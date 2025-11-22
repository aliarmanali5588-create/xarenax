import { useState, useEffect } from "react";
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
import { Users, Ban, CheckCircle, Search, AlertTriangle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import StatCardSkeleton from "@/components/admin/StatCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import SendMoneyModal from "@/components/admin/SendMoneyModal";

interface User {
  id: string;
  username: string;
  ign: string;
  bgmiId: string;
  walletBalance: number;
  signupIp: string;
  deviceId: string;
  status: "active" | "banned";
  joinDate: string;
  matchesPlayed: number;
  isDuplicate?: boolean;
}

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) {
        toast.error("Failed to fetch users");
        console.error(profilesError);
        return;
      }

      // Fetch participant counts for each user
      const { data: participantsData } = await supabase
        .from("participants")
        .select("user_id");

      const matchCounts = participantsData?.reduce((acc, p) => {
        acc[p.user_id] = (acc[p.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Detect duplicates based on IP and device ID
      const ipCounts: Record<string, number> = {};
      const deviceCounts: Record<string, number> = {};
      
      profilesData?.forEach((profile) => {
        if (profile.signup_ip) {
          ipCounts[profile.signup_ip] = (ipCounts[profile.signup_ip] || 0) + 1;
        }
        if (profile.device_id) {
          deviceCounts[profile.device_id] = (deviceCounts[profile.device_id] || 0) + 1;
        }
      });

      const transformedUsers: User[] = (profilesData || []).map((profile) => ({
        id: profile.id,
        username: profile.username || "Unknown",
        ign: profile.ign || "N/A",
        bgmiId: profile.bgmi_id || "N/A",
        walletBalance: Number(profile.wallet_balance) || 0,
        signupIp: profile.signup_ip || "Not captured",
        deviceId: profile.device_id || "Not captured",
        status: profile.is_banned ? "banned" : "active",
        joinDate: new Date(profile.created_at).toLocaleDateString(),
        matchesPlayed: matchCounts[profile.id] || 0,
        isDuplicate: (profile.signup_ip && ipCounts[profile.signup_ip] > 1) || 
                     (profile.device_id && deviceCounts[profile.device_id] > 1),
      }));

      setUsers(transformedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUnban = async (id: string) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newBanStatus = user.status === "active";

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_banned: newBanStatus })
        .eq("id", id);

      if (error) {
        toast.error("Failed to update user status");
        console.error(error);
        return;
      }

      setUsers(
        users.map((u) =>
          u.id === id
            ? {
                ...u,
                status: newBanStatus ? ("banned" as const) : ("active" as const),
              }
            : u
        )
      );

      if (newBanStatus) {
        toast.error(`User ${user.username} has been banned`);
      } else {
        toast.success(`User ${user.username} has been unbanned`);
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("An error occurred");
    }
  };

  const handleOpenSendMoney = (user: User) => {
    setSelectedUser(user);
    setShowSendMoneyModal(true);
  };

  const handleSendMoneySuccess = () => {
    fetchUsers(); // Refresh user data after sending money
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bgmiId.includes(searchTerm) ||
      user.signupIp.includes(searchTerm) ||
      user.deviceId.includes(searchTerm) ||
      user.id.includes(searchTerm);
    
    if (showDuplicatesOnly) {
      return matchesSearch && user.isDuplicate;
    }
    
    return matchesSearch;
  });

  const duplicateCount = users.filter(u => u.isDuplicate).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardContent className="pt-6">
            <Skeleton className="h-14 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              Duplicate Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-yellow-400">
              {duplicateCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-admin-gold" />
              <Input
                placeholder="🔍 Search by Username, IGN, BGMI ID, IP, or Device ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>
            
            {/* Find Duplicates Button */}
            <Button
              variant={showDuplicatesOnly ? "default" : "outline"}
              className={showDuplicatesOnly 
                ? "w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" 
                : "w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              }
              onClick={() => setShowDuplicatesOnly(!showDuplicatesOnly)}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {showDuplicatesOnly ? "Show All Users" : `Find Duplicates (${duplicateCount})`}
            </Button>
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
                <TableHead className="text-admin-gold">Signup IP</TableHead>
                <TableHead className="text-admin-gold">Wallet</TableHead>
                <TableHead className="text-admin-gold">Status</TableHead>
                <TableHead className="text-admin-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No users found matching your search" : showDuplicatesOnly ? "No duplicate accounts found" : "No users registered yet"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={`border-admin-red/20 ${user.isDuplicate ? 'bg-yellow-500/5' : ''}`}
                >
                  <TableCell className="font-medium text-cyan-400">
                    <div className="flex items-center gap-2">
                      {user.username}
                      {user.isDuplicate && (
                        <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-foreground font-semibold">
                    {user.ign}
                  </TableCell>
                  <TableCell className="font-mono text-primary">
                    {user.bgmiId}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">
                    {user.signupIp}
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
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleOpenSendMoney(user)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pay
                      </Button>
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
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Send Money Modal */}
      {selectedUser && (
        <SendMoneyModal
          isOpen={showSendMoneyModal}
          onClose={() => setShowSendMoneyModal(false)}
          user={selectedUser}
          onSuccess={handleSendMoneySuccess}
        />
      )}
    </div>
  );
};

export default AdminUsers;
