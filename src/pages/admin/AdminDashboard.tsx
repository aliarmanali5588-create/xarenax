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

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      icon: Users,
      change: "+12% from last month",
      color: "text-cyan-400",
    },
    {
      title: "Total Deposits",
      value: "₹4,23,500",
      icon: Wallet,
      change: "+8% from last month",
      color: "text-admin-gold",
    },
    {
      title: "Pending Withdrawals",
      value: "₹45,200",
      icon: AlertCircle,
      change: "24 requests pending",
      color: "text-admin-red",
    },
    {
      title: "Net Profit",
      value: "₹3,78,300",
      icon: TrendingUp,
      change: "+15% from last month",
      color: "text-green-400",
    },
  ];

  const recentActivity = [
    { type: "Signup", user: "player_123", time: "2 mins ago", status: "success" },
    { type: "Match Join", user: "pro_gamer_x", time: "5 mins ago", status: "success" },
    { type: "Deposit", user: "noob_slayer", time: "8 mins ago", status: "success" },
    { type: "Withdrawal", user: "ace_player", time: "12 mins ago", status: "pending" },
    { type: "Match Join", user: "sniper_king", time: "15 mins ago", status: "success" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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

      {/* Recent Activity */}
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
    </div>
  );
};

export default AdminDashboard;
