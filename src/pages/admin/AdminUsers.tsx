import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, Ban, CheckCircle, Search } from "lucide-react";

interface User {
  id: string;
  username: string;
  ign: string;
  bgmiId: string;
  walletBalance: number;
  ipAddress: string;
  status: "active" | "banned";
  joinDate: string;
  matchesPlayed: number;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([
    {
      id: "U001",
      username: "pro_gamer_x",
      ign: "ProGamer",
      bgmiId: "543216789",
      walletBalance: 5500,
      ipAddress: "192.168.1.100",
      status: "active",
      joinDate: "2024-01-10",
      matchesPlayed: 45,
    },
    {
      id: "U002",
      username: "ace_player",
      ign: "AceShooter",
      bgmiId: "987654321",
      walletBalance: 3200,
      ipAddress: "192.168.1.101",
      status: "active",
      joinDate: "2024-01-12",
      matchesPlayed: 32,
    },
    {
      id: "U003",
      username: "sniper_king",
      ign: "SniperKing",
      bgmiId: "456789123",
      walletBalance: 0,
      ipAddress: "192.168.1.100",
      status: "banned",
      joinDate: "2024-01-13",
      matchesPlayed: 15,
    },
    {
      id: "U004",
      username: "noob_slayer",
      ign: "NoobSlayer",
      bgmiId: "789123456",
      walletBalance: 1800,
      ipAddress: "192.168.1.102",
      status: "active",
      joinDate: "2024-01-14",
      matchesPlayed: 20,
    },
  ]);

  const handleBanUnban = (id: string) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? ("banned" as const) : ("active" as const),
            }
          : user
      )
    );
    const user = users.find((u) => u.id === id);
    if (user?.status === "active") {
      toast.error(`User ${user.username} has been banned`);
    } else {
      toast.success(`User ${user?.username} has been unbanned`);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bgmiId.includes(searchTerm) ||
      user.ipAddress.includes(searchTerm) ||
      user.id.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-cyan-400">
              {users.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-green-400">
              {users.filter((u) => u.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Banned Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-admin-red">
              {users.filter((u) => u.status === "banned").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Matches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-orange-400">
              {users.reduce((acc, u) => acc + u.matchesPlayed, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-gold" />
            <Input
              placeholder="🔍 Search by Username, IGN, BGMI ID, or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-background/50 border-admin-red/30 focus:border-admin-gold"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-admin-gold">
              User Management
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-admin-red/20">
                <TableHead className="text-admin-gold">Username</TableHead>
                <TableHead className="text-admin-gold">IGN</TableHead>
                <TableHead className="text-admin-gold">BGMI ID</TableHead>
                <TableHead className="text-admin-gold">Wallet</TableHead>
                <TableHead className="text-admin-gold">Status</TableHead>
                <TableHead className="text-admin-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-admin-red/20">
                  <TableCell className="font-medium text-cyan-400">
                    {user.username}
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">
                    {user.ign}
                  </TableCell>
                  <TableCell className="font-mono text-primary">
                    {user.bgmiId}
                  </TableCell>
                  <TableCell className="font-bold text-admin-gold">
                    ₹{user.walletBalance.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "default" : "destructive"}
                      className={
                        user.status === "active"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-admin-red/20 text-admin-red border-admin-red/50"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={user.status === "active" ? "destructive" : "default"}
                      onClick={() => handleBanUnban(user.id)}
                      className={
                        user.status === "banned"
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : ""
                      }
                    >
                      {user.status === "active" ? (
                        <>
                          <Ban className="h-4 w-4 mr-1" />
                          Ban
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Unban
                        </>
                      )}
                    </Button>
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

export default AdminUsers;
