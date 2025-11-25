import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, AlertCircle, Calendar, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import StatCardSkeleton from "@/components/admin/StatCardSkeleton";
import ActivityTableSkeleton from "@/components/admin/ActivityTableSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow, startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } from "date-fns";

interface Stats {
  totalUsers: number;
  totalDeposits: number;
  pendingWithdrawals: number;
  pendingCount: number;
  netProfit: number;
}

interface Activity {
  type: string;
  user: string;
  time: string;
  status: string;
}

interface DailyData {
  day: string;
  deposits: number;
  withdrawals: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDeposits: 0,
    pendingWithdrawals: 0,
    pendingCount: 0,
    netProfit: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [weeklyData, setWeeklyData] = useState<DailyData[]>([]);
  const [dateFilter, setDateFilter] = useState("this-week");

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter]);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch pending withdrawals
      const { data: withdrawals } = await supabase
        .from("withdrawal_requests")
        .select("amount")
        .eq("status", "pending");

      const pendingWithdrawals = withdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

      // Fresh start - Set deposits and profit to 0
      setStats({
        totalUsers: usersCount || 0,
        totalDeposits: 0,
        pendingWithdrawals,
        pendingCount: withdrawals?.length || 0,
        netProfit: 0,
      });

      // Fetch weekly chart data
      const { startDate, endDate } = getDateRange();
      const days = eachDayOfInterval({ start: startDate, end: endDate });

      // Fetch deposits by day
      const { data: dailyDeposits } = await supabase
        .from("transactions")
        .select("amount, created_at")
        .eq("type", "deposit")
        .eq("status", "success")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Fetch withdrawals by day
      const { data: dailyWithdrawals } = await supabase
        .from("withdrawal_requests")
        .select("amount, created_at")
        .eq("status", "approved")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString());

      // Group by day
      const chartData = days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayName = format(day, "EEE");

        const depositsForDay = dailyDeposits?.filter((d) =>
          d.created_at.startsWith(dayStr)
        ).reduce((sum, d) => sum + Number(d.amount), 0) || 0;

        const withdrawalsForDay = dailyWithdrawals?.filter((w) =>
          w.created_at.startsWith(dayStr)
        ).reduce((sum, w) => sum + Number(w.amount), 0) || 0;

        return {
          day: dayName,
          deposits: depositsForDay,
          withdrawals: withdrawalsForDay,
        };
      });

      setWeeklyData(chartData);

      // Fetch recent activity
      const activities: Activity[] = [];

      // Recent signups
      const { data: recentSignups } = await supabase
        .from("profiles")
        .select("username, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      recentSignups?.forEach((signup) => {
        activities.push({
          type: "Signup",
          user: signup.username,
          time: formatDistanceToNow(new Date(signup.created_at), { addSuffix: true }),
          status: "success",
        });
      });

      // Recent deposits
      const { data: recentDeposits } = await supabase
        .from("transactions")
        .select("profiles!inner(username), created_at, status")
        .eq("type", "deposit")
        .order("created_at", { ascending: false })
        .limit(2);

      recentDeposits?.forEach((deposit: any) => {
        activities.push({
          type: "Deposit",
          user: deposit.profiles.username,
          time: formatDistanceToNow(new Date(deposit.created_at), { addSuffix: true }),
          status: deposit.status,
        });
      });

      // Recent match joins
      const { data: recentJoins } = await supabase
        .from("participants")
        .select("profiles!inner(username), joined_at, payment_status")
        .order("joined_at", { ascending: false })
        .limit(2);

      recentJoins?.forEach((join: any) => {
        activities.push({
          type: "Match Join",
          user: join.profiles.username,
          time: formatDistanceToNow(new Date(join.joined_at), { addSuffix: true }),
          status: join.payment_status === "paid" ? "success" : "pending",
        });
      });

      // Sort activities by most recent
      activities.sort((a, b) => {
        const aTime = a.time.includes("second") ? 1 : a.time.includes("minute") ? 2 : 3;
        const bTime = b.time.includes("second") ? 1 : b.time.includes("minute") ? 2 : 3;
        return aTime - bTime;
      });

      setRecentActivity(activities.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate, endDate;

    switch (dateFilter) {
      case "this-week":
        startDate = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
        endDate = endOfWeek(now, { weekStartsOn: 0 });
        break;
      case "last-week":
        const lastWeek = subWeeks(now, 1);
        startDate = startOfWeek(lastWeek, { weekStartsOn: 0 });
        endDate = endOfWeek(lastWeek, { weekStartsOn: 0 });
        break;
      default:
        startDate = startOfWeek(now, { weekStartsOn: 0 });
        endDate = endOfWeek(now, { weekStartsOn: 0 });
    }

    return { startDate, endDate };
  };

  const chartConfig = {
    deposits: {
      label: "Deposits",
      color: "hsl(var(--chart-1))",
    },
    withdrawals: {
      label: "Withdrawals",
      color: "hsl(var(--chart-2))",
    },
  };

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: `${stats.totalUsers} registered users`,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Deposits",
      value: `₹${stats.totalDeposits.toFixed(2)}`,
      icon: ArrowUpRight,
      change: "Fresh start",
      trend: "₹0.00",
      trendUp: true,
    },
    {
      title: "Pending Withdrawals",
      value: `₹${stats.pendingWithdrawals.toLocaleString()}`,
      icon: AlertCircle,
      change: `${stats.pendingCount} requests pending`,
      trend: "",
      trendUp: false,
    },
    {
      title: "Net Profit",
      value: `₹${stats.netProfit.toFixed(2)}`,
      icon: TrendingUp,
      change: "Fresh start",
      trend: "₹0.00",
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-gaming font-bold bg-gradient-to-r from-admin-gold via-admin-red to-admin-gold bg-clip-text text-transparent">
            Financial Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time platform metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-admin-gold" />
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px] bg-card/50 border-admin-red/20">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid - Trading Style */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50 hover:border-admin-gold/50 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-admin-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-admin-gold/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-admin-gold" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                  {stat.trend && (
                    <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Weekly Chart - Trading Style */}
      {!loading && (
        <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-gaming text-admin-gold">
                  Weekly Performance
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Sunday to Saturday breakdown
                </p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-1))]" />
                  <span className="text-xs text-muted-foreground">Deposits</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-2))]" />
                  <span className="text-xs text-muted-foreground">Withdrawals</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="fillDeposits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillWithdrawals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  tickFormatter={(value) => `₹${value}`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fillDeposits)"
                />
                <Area
                  type="monotone"
                  dataKey="withdrawals"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fillWithdrawals)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {loading ? (
        <ActivityTableSkeleton />
      ) : (
        <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-gaming bg-gradient-to-r from-admin-gold to-admin-red bg-clip-text text-transparent">
              Live Activity Feed
            </CardTitle>
            <p className="text-sm text-muted-foreground">Real-time platform events</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-admin-gold font-semibold uppercase text-xs">Type</TableHead>
                  <TableHead className="text-admin-gold font-semibold uppercase text-xs">User</TableHead>
                  <TableHead className="text-admin-gold font-semibold uppercase text-xs">Time</TableHead>
                  <TableHead className="text-admin-gold font-semibold uppercase text-xs text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, idx) => (
                  <TableRow key={idx} className="border-border/30 hover:bg-admin-gold/5 transition-colors">
                    <TableCell className="font-semibold text-foreground">
                      {activity.type}
                    </TableCell>
                    <TableCell className="text-cyan-400 font-medium">
                      {activity.user}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {activity.time}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          activity.status === "success"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminDashboard;
