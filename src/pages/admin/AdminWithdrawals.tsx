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
import { toast } from "sonner";
import { Wallet, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  username: string;
  amount: number;
  upi_id_1?: string;
  upi_id_2?: string;
  bank_account_no?: string;
  bank_name?: string;
  bank_ifsc?: string;
  status: "pending" | "paid" | "rejected";
  created_at: string;
}

const AdminWithdrawals = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawalRequests = async () => {
    setLoading(true);
    try {
      // Fetch withdrawal requests with payment methods
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from("withdrawal_requests")
        .select(`
          id,
          user_id,
          amount,
          status,
          created_at,
          payment_method_id,
          user_payment_methods(
            upi_id_1,
            upi_id_2,
            bank_account_no,
            bank_name,
            bank_ifsc
          )
        `)
        .order("created_at", { ascending: false });

      if (withdrawalError) throw withdrawalError;

      // Get unique user IDs
      const userIds = [...new Set(withdrawalData?.map((req: any) => req.user_id) || [])];

      // Fetch profiles for these users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Create a map of user_id to username
      const profileMap = new Map(profilesData?.map((p: any) => [p.id, p.username]));

      // Combine the data
      const formattedRequests: WithdrawalRequest[] = (withdrawalData || []).map((req: any) => ({
        id: req.id,
        user_id: req.user_id,
        username: profileMap.get(req.user_id) || "Unknown",
        amount: req.amount,
        upi_id_1: req.user_payment_methods?.upi_id_1,
        upi_id_2: req.user_payment_methods?.upi_id_2,
        bank_account_no: req.user_payment_methods?.bank_account_no,
        bank_name: req.user_payment_methods?.bank_name,
        bank_ifsc: req.user_payment_methods?.bank_ifsc,
        status: req.status,
        created_at: req.created_at,
      }));

      setRequests(formattedRequests);
    } catch (error: any) {
      toast.error("Failed to fetch withdrawal requests: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const handleMarkAsPaid = async (id: string, userId: string) => {
    try {
      // Update withdrawal request status
      const { error: updateError } = await supabase
        .from("withdrawal_requests")
        .update({ 
          status: "paid",
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Send notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "💸 Withdrawal Successful!",
        message: "Your withdrawal has been processed successfully. Money has been sent to your registered account.",
        type: "payment",
      });

      toast.success("Withdrawal marked as paid!");
      fetchWithdrawalRequests();
    } catch (error: any) {
      toast.error("Failed to mark as paid: " + error.message);
    }
  };

  const handleReject = async (id: string, userId: string, amount: number) => {
    try {
      // 1. Refund to wallet
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;
      if (!profile) throw new Error("User profile not found");

      const { error: walletError } = await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance + amount })
        .eq("id", userId);

      if (walletError) throw walletError;

      // 2. Update withdrawal request status
      const { error: updateError } = await supabase
        .from("withdrawal_requests")
        .update({ 
          status: "rejected",
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // 3. Log refund transaction
      await supabase.from("transactions").insert({
        user_id: userId,
        amount: amount,
        type: "refund",
        status: "success",
        description: "Withdrawal rejected - Amount refunded to wallet",
      });

      // 4. Send notification
      await supabase.from("notifications").insert({
        user_id: userId,
        title: "❌ Withdrawal Rejected",
        message: `Your withdrawal request of ₹${amount} has been rejected. The amount has been refunded to your wallet.`,
        type: "payment",
      });

      toast.success("Withdrawal rejected and amount refunded!");
      fetchWithdrawalRequests();
    } catch (error: any) {
      toast.error("Failed to reject withdrawal: " + error.message);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const totalPending = pendingRequests.reduce((sum, r) => sum + r.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-admin-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-orange-400">
              {pendingRequests.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-admin-gold">
              ₹{totalPending.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-cyan-400">
              {requests.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-admin-gold">
              Withdrawal Requests
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-admin-red/20">
                <TableHead className="text-admin-gold">ID</TableHead>
                <TableHead className="text-admin-gold">User</TableHead>
                <TableHead className="text-admin-gold">Amount</TableHead>
                <TableHead className="text-admin-gold">Payment Details</TableHead>
                <TableHead className="text-admin-gold">Date</TableHead>
                <TableHead className="text-admin-gold">Status</TableHead>
                <TableHead className="text-admin-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No withdrawal requests found
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id} className="border-admin-red/20">
                    <TableCell className="font-mono text-xs">
                      {request.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="font-medium text-cyan-400">
                      {request.username}
                    </TableCell>
                    <TableCell className="font-bold text-admin-gold">
                      ₹{request.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        {!request.upi_id_1 && !request.upi_id_2 && !request.bank_account_no ? (
                          <span className="text-orange-400 font-medium">
                            ⚠️ Not Set Up
                          </span>
                        ) : (
                          <>
                            {request.upi_id_1 && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">UPI 1:</span>
                                <span className="text-foreground font-mono">
                                  {request.upi_id_1} 🔒
                                </span>
                              </div>
                            )}
                            {request.upi_id_2 && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">UPI 2:</span>
                                <span className="text-foreground font-mono">
                                  {request.upi_id_2} 🔒
                                </span>
                              </div>
                            )}
                            {request.bank_account_no && (
                              <>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Bank:</span>
                                  <span className="text-foreground">
                                    {request.bank_name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">A/C:</span>
                                  <span className="text-foreground font-mono">
                                    {request.bank_account_no} 🔒
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">IFSC:</span>
                                  <span className="text-foreground font-mono">
                                    {request.bank_ifsc}
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.status === "paid"
                            ? "default"
                            : request.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          request.status === "pending"
                            ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                            : request.status === "paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : ""
                        }
                      >
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleMarkAsPaid(request.id, request.user_id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Paid
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request.id, request.user_id, request.amount)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWithdrawals;
