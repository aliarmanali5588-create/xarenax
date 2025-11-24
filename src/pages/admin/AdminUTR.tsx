import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface UTRSubmission {
  id: string;
  user_id: string;
  amount: number;
  utr_number: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
  fraud_score: number | null;
  fraud_flags: string[] | null;
  is_suspicious: boolean | null;
  verification_status: string | null;
  username?: string;
}

const AdminUTR = () => {
  const [submissions, setSubmissions] = useState<UTRSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("utr_submissions")
        .select(`
          id,
          user_id,
          amount,
          utr_number,
          status,
          created_at,
          admin_notes,
          fraud_score,
          fraud_flags,
          is_suspicious,
          verification_status
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch usernames
      const userIds = data?.map((sub) => sub.user_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds);

      const submissionsWithUsernames = data?.map((sub) => ({
        ...sub,
        username: profiles?.find((p) => p.id === sub.user_id)?.username || "Unknown",
      }));

      setSubmissions(submissionsWithUsernames || []);
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

  const handleApprove = async (submission: UTRSubmission) => {
    if (processingId) return;
    setProcessingId(submission.id);

    try {
      // Update user's wallet balance
      const { error: profileError } = await supabase.rpc("handle_razorpay_success", {
        p_amount: submission.amount,
        p_order_id: `UTR_${submission.utr_number}`,
        p_payment_id: submission.utr_number,
      });

      if (profileError) throw profileError;

      // Update UTR submission status
      const { error: utrError } = await supabase
        .from("utr_submissions")
        .update({
          status: "approved",
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq("id", submission.id);

      if (utrError) throw utrError;

      toast({
        title: "Success!",
        description: `₹${submission.amount} credited to ${submission.username}'s wallet`,
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submission: UTRSubmission, notes: string) => {
    if (processingId) return;
    setProcessingId(submission.id);

    try {
      const { error } = await supabase
        .from("utr_submissions")
        .update({
          status: "rejected",
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: notes || "Invalid UTR or payment not received",
        })
        .eq("id", submission.id);

      if (error) throw error;

      // Send notification
      await supabase.from("notifications").insert({
        user_id: submission.user_id,
        title: "❌ Payment Rejected",
        message: `Your UTR submission of ₹${submission.amount} was rejected. ${notes || "Please contact support."}`,
        type: "system",
      });

      toast({
        title: "Rejected",
        description: "UTR submission rejected and user notified",
      });

      fetchSubmissions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.utr_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge variant="secondary" className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge variant="secondary" className="bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getFraudBadge = (submission: UTRSubmission) => {
    if (!submission.is_suspicious) return null;
    
    const score = submission.fraud_score || 0;
    let color = "bg-yellow-500/20 text-yellow-400";
    if (score >= 70) color = "bg-red-500/20 text-red-400";
    else if (score >= 40) color = "bg-orange-500/20 text-orange-400";

    return (
      <Badge variant="secondary" className={color}>
        ⚠️ Suspicious ({score})
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-gaming text-admin-gold">UTR Verifications</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>UTR Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Fraud Check</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No UTR submissions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id} className={submission.is_suspicious ? "bg-red-500/5" : ""}>
                        <TableCell className="font-medium">{submission.username}</TableCell>
                        <TableCell className="text-admin-gold">₹{submission.amount}</TableCell>
                        <TableCell className="font-mono text-sm">{submission.utr_number}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {getFraudBadge(submission)}
                            {submission.fraud_flags && submission.fraud_flags.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {submission.fraud_flags.map(flag => (
                                  <span key={flag} className="inline-block mr-1 px-1 py-0.5 rounded bg-muted">
                                    {flag.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(submission.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {submission.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(submission)}
                                disabled={processingId === submission.id}
                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  const notes = prompt("Rejection reason (optional):");
                                  if (notes !== null) handleReject(submission, notes);
                                }}
                                disabled={processingId === submission.id}
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                          {submission.status !== "pending" && (
                            <span className="text-sm text-muted-foreground">
                              {submission.admin_notes || "Processed"}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUTR;
