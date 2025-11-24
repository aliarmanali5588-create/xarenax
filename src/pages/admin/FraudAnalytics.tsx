import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Shield, TrendingUp, Flag } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

interface FraudStats {
  totalSubmissions: number;
  suspiciousSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  averageFraudScore: number;
  highRiskCount: number;
}

interface FlagData {
  name: string;
  count: number;
}

interface TrendData {
  date: string;
  suspicious: number;
  normal: number;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const FraudAnalytics = () => {
  const [stats, setStats] = useState<FraudStats>({
    totalSubmissions: 0,
    suspiciousSubmissions: 0,
    approvedSubmissions: 0,
    rejectedSubmissions: 0,
    averageFraudScore: 0,
    highRiskCount: 0,
  });
  const [flagDistribution, setFlagDistribution] = useState<FlagData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch all UTR submissions
      const { data: submissions, error } = await supabase
        .from("utr_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!submissions) {
        setLoading(false);
        return;
      }

      // Calculate statistics
      const total = submissions.length;
      const suspicious = submissions.filter((s) => s.is_suspicious).length;
      const approved = submissions.filter((s) => s.status === "approved").length;
      const rejected = submissions.filter((s) => s.status === "rejected").length;
      const highRisk = submissions.filter((s) => (s.fraud_score || 0) >= 70).length;
      const avgScore = total > 0
        ? submissions.reduce((sum, s) => sum + (s.fraud_score || 0), 0) / total
        : 0;

      setStats({
        totalSubmissions: total,
        suspiciousSubmissions: suspicious,
        approvedSubmissions: approved,
        rejectedSubmissions: rejected,
        averageFraudScore: Math.round(avgScore),
        highRiskCount: highRisk,
      });

      // Calculate flag distribution
      const flagMap = new Map<string, number>();
      submissions.forEach((s) => {
        if (s.fraud_flags && Array.isArray(s.fraud_flags)) {
          s.fraud_flags.forEach((flag: string) => {
            flagMap.set(flag, (flagMap.get(flag) || 0) + 1);
          });
        }
      });

      const flagData = Array.from(flagMap.entries())
        .map(([name, count]) => ({
          name: name.replace(/_/g, " ").toUpperCase(),
          count,
        }))
        .sort((a, b) => b.count - a.count);

      setFlagDistribution(flagData);

      // Calculate trend data (last 7 days)
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toISOString().split("T")[0];
      });

      const trends = last7Days.map((date) => {
        const daySubmissions = submissions.filter((s) =>
          s.created_at.startsWith(date)
        );
        return {
          date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          suspicious: daySubmissions.filter((s) => s.is_suspicious).length,
          normal: daySubmissions.filter((s) => !s.is_suspicious).length,
        };
      });

      setTrendData(trends);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: "Suspicious", value: stats.suspiciousSubmissions, color: "#ef4444" },
    { name: "Normal", value: stats.totalSubmissions - stats.suspiciousSubmissions, color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-gaming text-admin-gold">Fraud Analytics</h1>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading analytics...</p>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-admin-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-admin-gold">{stats.totalSubmissions}</div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-red-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Suspicious Flagged
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{stats.suspiciousSubmissions}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.totalSubmissions > 0
                    ? `${((stats.suspiciousSubmissions / stats.totalSubmissions) * 100).toFixed(1)}%`
                    : "0%"}{" "}
                  of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  High Risk (≥70)
                </CardTitle>
                <Flag className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{stats.highRiskCount}</div>
                <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-xl border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Fraud Score
                </CardTitle>
                <Shield className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{stats.averageFraudScore}</div>
                <p className="text-xs text-muted-foreground mt-1">Lower is better</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
              <CardHeader>
                <CardTitle className="text-lg font-gaming text-admin-gold">
                  7-Day Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="suspicious"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Suspicious"
                    />
                    <Line
                      type="monotone"
                      dataKey="normal"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Normal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribution Pie */}
            <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
              <CardHeader>
                <CardTitle className="text-lg font-gaming text-admin-gold">
                  Submission Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Flag Distribution */}
          <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
            <CardHeader>
              <CardTitle className="text-lg font-gaming text-admin-gold">
                Most Common Fraud Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              {flagDistribution.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No fraud flags detected yet
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={flagDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#ef4444" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
            <CardHeader>
              <CardTitle className="text-lg font-gaming text-admin-gold">
                Status Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-2xl font-bold text-green-500">{stats.approvedSubmissions}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalSubmissions > 0
                      ? `${((stats.approvedSubmissions / stats.totalSubmissions) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-500">{stats.rejectedSubmissions}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.totalSubmissions > 0
                      ? `${((stats.rejectedSubmissions / stats.totalSubmissions) * 100).toFixed(1)}%`
                      : "0%"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {stats.totalSubmissions - stats.approvedSubmissions - stats.rejectedSubmissions}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default FraudAnalytics;
