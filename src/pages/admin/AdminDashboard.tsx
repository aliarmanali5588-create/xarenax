import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatCardSkeleton from "@/components/admin/StatCardSkeleton";
import ActivityTableSkeleton from "@/components/admin/ActivityTableSkeleton";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Fetch total deposits
      const { data: deposits } = await supabase
        .from("transactions")
        .select("amount")
        .eq("type", "deposit")
        .eq("status", "success");

      const totalDeposits = deposits?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      // Fetch pending withdrawals
      const { data: withdrawals } = await supabase
        .from("withdrawal_requests")
        .select("amount")
        .eq("status", "pending");

      const pendingWithdrawals = withdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

      // Fetch total paid withdrawals
      const { data: paidWithdrawals } = await supabase
        .from("withdrawal_requests")
        .select("amount")
        .eq("status", "approved");

      const totalPaidWithdrawals = paidWithdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;

      // Calculate net profit (deposits - paid withdrawals)
      const netProfit = totalDeposits - totalPaidWithdrawals;

      setStats({
        totalUsers: usersCount || 0,
        totalDeposits,
        pendingWithdrawals,
        pendingCount: withdrawals?.length || 0,
        netProfit,
      });

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

  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: `${stats.totalUsers} registered users`,
      color: "text-cyan-400",
    },
    {
      title: "Total Deposits",
      value: `₹${stats.totalDeposits.toLocaleString()}`,
      icon: Wallet,
      change: "All-time deposits",
      color: "text-admin-gold",
    },
    {
      title: "Pending Withdrawals",
      value: `₹${stats.pendingWithdrawals.toLocaleString()}`,
      icon: AlertCircle,
      change: `${stats.pendingCount} requests pending`,
      color: "text-admin-red",
    },
    {
      title: "Net Profit",
      value: `₹${stats.netProfit.toLocaleString()}`,
      icon: TrendingUp,
      change: "Deposits minus paid withdrawals",
      color: "text-green-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="bg-card/50 backdrop-blur-xl border-admin-red/20 hover:border-admin-gold/50 transition-all"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-gaming font-bold text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      {loading ? (
        <ActivityTableSkeleton />
      ) : (
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader>
            <CardTitle className="text-xl font-gaming text-admin-gold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-admin-red/20">
                  <TableHead className="text-admin-gold">Type</TableHead>
                  <TableHead className="text-admin-gold">User</TableHead>
                  <TableHead className="text-admin-gold">Time</TableHead>
                  <TableHead className="text-admin-gold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity, idx) => (
                  <TableRow key={idx} className="border-admin-red/20">
                    <TableCell className="font-medium">{activity.type}</TableCell>
                    <TableCell className="text-cyan-400">{activity.user}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {activity.time}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          activity.status === "success"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
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
