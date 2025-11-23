import { useEffect, useState } from "react";
import { Clock, IndianRupee, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface PaymentHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  description: string | null;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
}

const PaymentHistoryModal = ({ open, onOpenChange }: PaymentHistoryModalProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchTransactions();
    }
  }, [open]);

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === "deposit" || type.includes("credit") || type.includes("bonus") || type.includes("win")) {
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
    }
    return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === "deposit" || type.includes("credit") || type.includes("bonus") || type.includes("win")) {
      return "text-green-500";
    }
    return "text-orange-500";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      pending: "secondary",
      failed: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="text-xs">
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-border/50 max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-glow-cyan flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Payment History
          </DialogTitle>
          <DialogDescription>
            View all your recent transactions and payment details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="glass-panel p-4 rounded-lg animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="glass-panel p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">{getTransactionIcon(transaction.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {transaction.description || transaction.type}
                          </p>
                          {getStatusBadge(transaction.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {format(new Date(transaction.created_at), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                        {transaction.razorpay_payment_id && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="font-mono bg-muted/50 px-2 py-1 rounded">
                              ID: {transaction.razorpay_payment_id}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === "deposit" || transaction.type.includes("credit") || transaction.type.includes("bonus") || transaction.type.includes("win") ? "+" : "-"}
                        ₹{Math.abs(transaction.amount).toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="glass-panel rounded-lg p-3 text-center mt-4">
          <p className="text-xs text-muted-foreground">
            💡 All transactions are recorded securely and can be used for reference
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHistoryModal;
