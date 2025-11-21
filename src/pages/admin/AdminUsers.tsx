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
      walletBalance: 5500,
      ipAddress: "192.168.1.100",
      status: "active",
      joinDate: "2024-01-10",
      matchesPlayed: 45,
    },
    {
      id: "U002",
      username: "ace_player",
      walletBalance: 3200,
      ipAddress: "192.168.1.101",
      status: "active",
      joinDate: "2024-01-12",
      matchesPlayed: 32,
    },
    {
      id: "U003",
      username: "sniper_king",
      walletBalance: 0,
      ipAddress: "192.168.1.100",
      status: "banned",
      joinDate: "2024-01-13",
      matchesPlayed: 15,
    },
    {
      id: "U004",
      username: "noob_slayer",
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
      user.ipAddress.includes(searchTerm) ||
      user.id.includes(searchTerm)
  );

  const duplicateIPs = users.reduce((acc, user) => {
    acc[user.ipAddress] = (acc[user.ipAddress] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
              Duplicate IPs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-orange-400">
              {Object.values(duplicateIPs).filter((count) => count > 1).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-admin-gold" />
              <CardTitle className="text-xl font-gaming text-admin-gold">
                User Management
              </CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users, IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-admin-red/20">
                <TableHead className="text-admin-gold">ID</TableHead>
                <TableHead className="text-admin-gold">Username</TableHead>
                <TableHead className="text-admin-gold">Wallet</TableHead>
                <TableHead className="text-admin-gold">IP Address</TableHead>
                <TableHead className="text-admin-gold">Matches</TableHead>
                <TableHead className="text-admin-gold">Join Date</TableHead>
                <TableHead className="text-admin-gold">Status</TableHead>
                <TableHead className="text-admin-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const isDuplicateIP = duplicateIPs[user.ipAddress] > 1;
                return (
                  <TableRow key={user.id} className="border-admin-red/20">
                    <TableCell className="font-mono text-xs">{user.id}</TableCell>
                    <TableCell className="font-medium text-cyan-400">
                      {user.username}
                    </TableCell>
                    <TableCell className="font-bold text-admin-gold">
                      ₹{user.walletBalance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{user.ipAddress}</span>
                        {isDuplicateIP && (
                          <Badge
                            variant="destructive"
                            className="text-xs bg-admin-red/20 text-admin-red border-admin-red/50"
                          >
                            Duplicate
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.matchesPlayed}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {user.joinDate}
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
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
