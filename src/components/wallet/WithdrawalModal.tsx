import { useState, useEffect } from "react";
import { IndianRupee, ArrowDownToLine, AlertCircle, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface WithdrawalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
}

const WithdrawalModal = ({ open, onOpenChange, currentBalance }: WithdrawalModalProps) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const MIN_WITHDRAWAL = 110;
  const MAX_WITHDRAWAL = 10000;

  const quickAmounts = [500, 1000, 2000, 5000];

  useEffect(() => {
    if (open && user) {
      fetchUserStats();
    }
  }, [open, user]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("total_deposited, total_winnings")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setTotalDeposited(data?.total_deposited || 0);
      setTotalWinnings(data?.total_winnings || 0);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}`);
      return;
    }

    // Anti-fraud check: Must have deposited or won to withdraw
    if (totalDeposited === 0 && totalWinnings < 100) {
      toast.error("You must play matches or deposit to unlock withdrawals", {
        description: "This security measure prevents fake account abuse",
        duration: 5000,
      });
      return;
    }
    
    if (withdrawalAmount > MAX_WITHDRAWAL) {
      toast.error(`Maximum withdrawal amount is ₹${MAX_WITHDRAWAL}`);
      return;
    }

    if (withdrawalAmount > currentBalance) {
      toast.error("Insufficient balance");
      return;
    }

    // Mock withdrawal request
    toast.success("Withdrawal request submitted! Processing within 24-48 hours.");
    onOpenChange(false);
    setAmount("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-glow-orange">
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Request a withdrawal to your registered payment method
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Balance Info */}
          <div className="glass-panel rounded-lg p-4 bg-card/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <div className="flex items-center text-xl font-gaming font-bold text-primary">
                <IndianRupee className="w-5 h-5" />
                {currentBalance}
              </div>
            </div>
          </div>

          {/* Anti-fraud warning */}
          {totalDeposited === 0 && totalWinnings < 100 && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <Shield className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <strong>Withdrawal Locked:</strong> You must play matches or deposit to unlock withdrawals.
                This prevents fake account abuse.
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Amount Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount.toString() ? "neonOrange" : "outline"}
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="font-heading"
                  disabled={quickAmount > currentBalance}
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <Label htmlFor="withdrawAmount" className="text-sm font-medium mb-2 block">
              Withdrawal Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="withdrawAmount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg font-heading"
                min="110"
                max="10000"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum withdrawal: ₹110 | Maximum: ₹10,000
            </p>
          </div>

          {/* Warning Notice */}
          <div className="glass-panel rounded-lg p-3 border-secondary/30">
            <div className="flex gap-2">
              <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Important:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Withdrawals are processed within 24-48 hours</li>
                  <li>Make sure your payment details are set up in Profile</li>
                  <li>Amount will be transferred to your locked UPI/Bank account</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Withdrawal Button */}
          <Button
            onClick={handleWithdrawal}
            variant="neonOrange"
            size="lg"
            className="w-full"
            disabled={
              loading ||
              !amount ||
              parseFloat(amount) < MIN_WITHDRAWAL ||
              parseFloat(amount) > MAX_WITHDRAWAL ||
              parseFloat(amount) > currentBalance ||
              (totalDeposited === 0 && totalWinnings < 100)
            }
          >
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            Request Withdrawal
          </Button>

          {/* Security Notice */}
          <div className="glass-panel rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secure & Safe • Funds transferred to your verified account only
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
