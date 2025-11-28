import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Search, Image as ImageIcon, Eye, History, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  screenshot_url: string | null;
  username?: string;
}

const AdminUTR = () => {
  const [submissions, setSubmissions] = useState<UTRSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [currentSubmission, setCurrentSubmission] = useState<UTRSubmission | null>(null);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [userHistory, setUserHistory] = useState<UTRSubmission[]>([]);
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
          verification_status,
          screenshot_url
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

  const viewScreenshot = async (submission: UTRSubmission) => {
    if (!submission.screenshot_url) return;

    try {
      // Create signed URL for private bucket
      const { data, error } = await supabase.storage
        .from('payment-proofs')
        .createSignedUrl(submission.screenshot_url, 3600); // 1 hour expiry

      if (error) throw error;

      setScreenshotUrl(data.signedUrl);
      setShowScreenshot(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load screenshot",
        variant: "destructive",
      });
    }
  };

  const viewUserHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("utr_submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserHistory(data || []);
      setShowHistory(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleQuickApprove = async (submission: UTRSubmission) => {
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
        title: "✅ Approved!",
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

  const handleQuickReject = (submission: UTRSubmission) => {
    setCurrentSubmission(submission);
    setShowRejectDialog(true);
  };

  const confirmReject = async () => {
    if (!currentSubmission || processingId) return;
    setProcessingId(currentSubmission.id);

    try {
      const { error } = await supabase
        .from("utr_submissions")
        .update({
          status: "rejected",
          processed_at: new Date().toISOString(),
          processed_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: rejectNotes || "Invalid UTR or payment not received",
        })
        .eq("id", currentSubmission.id);

      if (error) throw error;

      // Send notification
      await supabase.from("notifications").insert({
        user_id: currentSubmission.user_id,
        title: "❌ Payment Rejected",
        message: `Your UTR submission of ₹${currentSubmission.amount} was rejected. ${rejectNotes || "Please contact support."}`,
        type: "system",
      });

      toast({
        title: "Rejected",
        description: "UTR submission rejected and user notified",
      });

      setShowRejectDialog(false);
      setRejectNotes("");
      setCurrentSubmission(null);
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

  const handleBulkApprove = async () => {
    if (selectedSubmissions.size === 0 || processingId) return;

    const confirmed = window.confirm(
      `Approve ${selectedSubmissions.size} submissions? This will credit all selected payments.`
    );
    if (!confirmed) return;

    setProcessingId("bulk");
    let successCount = 0;
    let errorCount = 0;

    for (const id of selectedSubmissions) {
      const submission = submissions.find(s => s.id === id);
      if (!submission || submission.status !== "pending") continue;

      try {
        await supabase.rpc("handle_razorpay_success", {
          p_amount: submission.amount,
          p_order_id: `UTR_${submission.utr_number}`,
          p_payment_id: submission.utr_number,
        });

        await supabase
          .from("utr_submissions")
          .update({
            status: "approved",
            processed_at: new Date().toISOString(),
            processed_by: (await supabase.auth.getUser()).data.user?.id,
          })
          .eq("id", id);

        successCount++;
      } catch (error) {
        console.error(`Failed to approve ${id}:`, error);
        errorCount++;
      }
    }

    toast({
      title: `Bulk Approval Complete`,
      description: `✅ Approved: ${successCount} | ❌ Failed: ${errorCount}`,
    });

    setSelectedSubmissions(new Set());
    setProcessingId(null);
    fetchSubmissions();
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedSubmissions);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedSubmissions(newSet);
  };

  const selectAllPending = () => {
    const pendingIds = submissions.filter(s => s.status === "pending").map(s => s.id);
    setSelectedSubmissions(new Set(pendingIds));
  };

  const filteredSubmissions = submissions.filter(
    (sub) =>
      sub.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.utr_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingSubmissions = filteredSubmissions.filter(s => s.status === "pending");
  const processedSubmissions = filteredSubmissions.filter(s => s.status !== "pending");

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

  const getFraudIndicator = (submission: UTRSubmission) => {
    const score = submission.fraud_score || 0;
    
    if (score >= 70) {
      return <div className="flex items-center gap-1 text-red-500"><AlertTriangle className="w-4 h-4" /><span className="text-xs font-bold">HIGH RISK ({score})</span></div>;
    } else if (score >= 40) {
      return <div className="flex items-center gap-1 text-orange-500"><AlertTriangle className="w-4 h-4" /><span className="text-xs font-semibold">MEDIUM ({score})</span></div>;
    } else if (score > 0) {
      return <div className="text-xs text-yellow-500">Low ({score})</div>;
    }
    return <div className="text-xs text-green-500">✓ Clean</div>;
  };

  const renderSubmissionRow = (submission: UTRSubmission, showCheckbox: boolean = false) => (
    <TableRow 
      key={submission.id} 
      className={`
        ${submission.is_suspicious && submission.fraud_score && submission.fraud_score >= 70 ? "bg-red-500/10" : ""}
        ${submission.is_suspicious && submission.fraud_score && submission.fraud_score >= 40 ? "bg-orange-500/5" : ""}
        hover:bg-muted/50 transition-colors
      `}
    >
      {showCheckbox && (
        <TableCell>
          <Checkbox
            checked={selectedSubmissions.has(submission.id)}
            onCheckedChange={() => toggleSelection(submission.id)}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{submission.username}</TableCell>
      <TableCell className="text-admin-gold font-bold">₹{submission.amount}</TableCell>
      <TableCell className="font-mono text-sm">{submission.utr_number}</TableCell>
      <TableCell>{getStatusBadge(submission.status)}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {getFraudIndicator(submission)}
          {submission.fraud_flags && submission.fraud_flags.length > 0 && (
            <div className="text-xs text-muted-foreground flex flex-wrap gap-1">
              {submission.fraud_flags.map(flag => (
                <span key={flag} className="inline-block px-1.5 py-0.5 rounded bg-muted text-xs">
                  {flag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {submission.screenshot_url && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => viewScreenshot(submission)}
            className="text-primary hover:text-primary/80"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(submission.created_at).toLocaleString()}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => viewUserHistory(submission.user_id)}
            title="View user history"
          >
            <History className="w-4 h-4" />
          </Button>
          {submission.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => handleQuickApprove(submission)}
                disabled={processingId === submission.id}
                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-0"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleQuickReject(submission)}
                disabled={processingId === submission.id}
                className="text-red-400 hover:text-red-300"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="admin-neon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{pendingSubmissions.length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="admin-neon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspicious</p>
                <p className="text-3xl font-bold text-red-400">
                  {submissions.filter(s => s.is_suspicious && s.status === "pending").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="admin-neon-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="text-3xl font-bold text-primary">{selectedSubmissions.size}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-xl font-gaming text-admin-gold">UTR Verifications</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {selectedSubmissions.size > 0 && (
                <>
                  <Button
                    onClick={handleBulkApprove}
                    disabled={processingId === "bulk"}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve {selectedSubmissions.size} Selected
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSubmissions(new Set())}
                  >
                    Clear Selection
                  </Button>
                </>
              )}
              {pendingSubmissions.length > 0 && selectedSubmissions.size === 0 && (
                <Button
                  variant="outline"
                  onClick={selectAllPending}
                >
                  Select All Pending
                </Button>
              )}
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
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : (
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="pending">
                  Pending ({pendingSubmissions.length})
                </TabsTrigger>
                <TabsTrigger value="processed">
                  Processed ({processedSubmissions.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending">
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedSubmissions.size === pendingSubmissions.length && pendingSubmissions.length > 0}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                selectAllPending();
                              } else {
                                setSelectedSubmissions(new Set());
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UTR</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fraud</TableHead>
                        <TableHead>Screenshot</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                            No pending submissions
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingSubmissions.map((submission) => renderSubmissionRow(submission, true))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="processed">
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>UTR</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Fraud</TableHead>
                        <TableHead>Screenshot</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedSubmissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No processed submissions
                          </TableCell>
                        </TableRow>
                      ) : (
                        processedSubmissions.map((submission) => renderSubmissionRow(submission, false))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection (will be sent to user)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., Invalid UTR, Payment not received, Mismatch in amount..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject} disabled={!rejectNotes.trim()}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Screenshot Preview Dialog */}
      <Dialog open={showScreenshot} onOpenChange={setShowScreenshot}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Payment Screenshot</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center overflow-auto">
            <img 
              src={screenshotUrl} 
              alt="Payment proof" 
              className="max-w-full h-auto rounded-lg cursor-zoom-in hover:scale-105 transition-transform" 
              onClick={(e) => {
                const img = e.currentTarget;
                if (img.style.transform === 'scale(2)') {
                  img.style.transform = 'scale(1)';
                  img.style.cursor = 'zoom-in';
                } else {
                  img.style.transform = 'scale(2)';
                  img.style.cursor = 'zoom-out';
                }
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">Click image to zoom in/out</p>
        </DialogContent>
      </Dialog>

      {/* User History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Payment History</DialogTitle>
            <DialogDescription>
              All submissions from this user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {userHistory.map((submission) => (
              <div key={submission.id} className="p-3 rounded-lg border border-border/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">₹{submission.amount}</span>
                  {getStatusBadge(submission.status)}
                </div>
                <div className="text-sm text-muted-foreground">
                  UTR: <span className="font-mono">{submission.utr_number}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(submission.created_at).toLocaleString()}
                </div>
                {submission.fraud_flags && submission.fraud_flags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {submission.fraud_flags.map(flag => (
                      <Badge key={flag} variant="secondary" className="text-xs">
                        {flag.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUTR;
