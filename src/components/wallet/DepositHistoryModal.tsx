import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Clock, CheckCircle2, XCircle, AlertCircle, Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DepositHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DepositRecord {
  id: string;
  amount: number;
  utr_number: string;
  status: string;
  created_at: string;
  processed_at: string | null;
  admin_notes: string | null;
  fraud_score: number | null;
  is_suspicious: boolean | null;
}

export const DepositHistoryModal = ({ open, onOpenChange }: DepositHistoryModalProps) => {
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchDepositHistory();
    }
  }, [open]);

  const fetchDepositHistory = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("utr_submissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setDeposits(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load deposit history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, isSuspicious: boolean | null) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className={`${isSuspicious ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}`}>
            <Clock className="w-3 h-3 mr-1" />
            {isSuspicious ? "Under Review" : "Pending"}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-border/50 max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-glow-cyan flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            Deposit History
          </DialogTitle>
          <DialogDescription>
            View all your deposit transactions and their status
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 -mr-2 flex-1">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="glass-panel p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">No deposits yet</p>
              <p className="text-muted-foreground text-sm mt-2">
                Your deposit history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="glass-panel p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="font-heading text-2xl font-bold text-glow-cyan">
                        ₹{deposit.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        UTR: <span className="font-mono">{deposit.utr_number}</span>
                      </p>
                    </div>
                    {getStatusBadge(deposit.status, deposit.is_suspicious)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Submitted</p>
                      <p className="font-medium">
                        {format(new Date(deposit.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                    {deposit.processed_at && (
                      <div>
                        <p className="text-muted-foreground">Processed</p>
                        <p className="font-medium">
                          {format(new Date(deposit.processed_at), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                      </div>
                    )}
                  </div>

                  {deposit.admin_notes && (
                    <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Admin Note:</p>
                      <p className="text-xs">{deposit.admin_notes}</p>
                    </div>
                  )}

                  {deposit.fraud_score !== null && deposit.fraud_score > 0 && (
                    <div className="flex items-center gap-2 text-xs text-amber-500">
                      <AlertCircle className="w-3 h-3" />
                      <span>Fraud Score: {deposit.fraud_score}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
