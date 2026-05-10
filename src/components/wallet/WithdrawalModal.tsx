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
  onSuccess?: (newBalance: number) => void;
}

const WithdrawalModal = ({ open, onOpenChange, currentBalance, onSuccess }: WithdrawalModalProps) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
  const [loading, setLoading] = useState(true);
  const MIN_WITHDRAWAL = 50;
  const MAX_WITHDRAWAL = 5000;

  const quickAmounts = [50, 100, 250, 500];

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

      // Check if user has added at least one UPI or bank account
      const { data: pm } = await supabase
        .from("user_payment_methods")
        .select("upi_id_1, upi_id_2, bank_account_no, bank_ifsc")
        .eq("user_id", user?.id)
        .maybeSingle();

      const hasUpi = !!(pm?.upi_id_1?.trim() || pm?.upi_id_2?.trim());
      const hasBank = !!(pm?.bank_account_no?.trim() && pm?.bank_ifsc?.trim());
      setHasPaymentMethod(hasUpi || hasBank);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async () => {
    const withdrawalAmount = parseFloat(amount);
    
    if (isNaN(withdrawalAmount) || withdrawalAmount < MIN_WITHDRAWAL) {
      toast.error(`Minimum withdrawal amount is ₹${MIN_WITHDRAWAL}`);
      return;
    }

    // Require UPI or bank account before allowing withdrawal
    if (!hasPaymentMethod) {
      toast.error("Please add a UPI ID or bank account first", {
        description: "Go to Profile → Payment Methods to add your withdrawal details",
        duration: 5000,
      });
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

    setLoading(true);
    try {
      // 1. Get or create user's payment method
      let { data: paymentMethod, error: pmError } = await supabase
        .from("user_payment_methods")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (pmError) throw pmError;

      // If no payment method exists, create one
      if (!paymentMethod) {
        const { data: newPM, error: createError } = await supabase
          .from("user_payment_methods")
          .insert({ user_id: user?.id })
          .select("id")
          .single();

        if (createError) throw createError;
        paymentMethod = newPM;
      }

      // 2. Create withdrawal request FIRST (so if constraint fails, no money is lost)
      const { error: withdrawalError } = await supabase
        .from("withdrawal_requests")
        .insert({
          user_id: user?.id,
          amount: withdrawalAmount,
          payment_method_id: paymentMethod.id,
          status: "pending"
        });

      if (withdrawalError) throw withdrawalError;

      // 3. Deduct from wallet balance (only after request succeeds)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user?.id)
        .single();

      if (profileError) throw profileError;

      const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({ wallet_balance: profile.wallet_balance - withdrawalAmount })
        .eq("id", user?.id)
        .select("wallet_balance")
        .single();

      if (updateError) throw updateError;
      if (!updatedProfile) throw new Error("Wallet balance could not be updated");

      // 4. Log transaction
      await supabase.from("transactions").insert({
        user_id: user?.id,
        amount: withdrawalAmount,
        type: "withdrawal",
        status: "pending",
        description: "Withdrawal request submitted"
      });

      // 5. Send notification to user
      await supabase.from("notifications").insert({
        user_id: user?.id,
        title: "💸 Withdrawal Request Submitted",
        message: `Your withdrawal request of ₹${withdrawalAmount} has been submitted and is being processed. You'll receive the money within 24-48 hours.`,
        type: "payment"
      });

      toast.success("Withdrawal request submitted! Processing within 24-48 hours.");
      onSuccess?.(updatedProfile.wallet_balance);
      onOpenChange(false);
      setAmount("");
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast.error("Failed to submit withdrawal request: " + error.message);
    } finally {
      setLoading(false);
    }
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

          {/* Missing payment method warning */}
          {!loading && !hasPaymentMethod && (
            <Alert className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <strong>Payment Method Required:</strong> Please add a UPI ID or bank account in your Profile before requesting a withdrawal.
              </AlertDescription>
            </Alert>
          )}

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
                min="50"
                max="5000"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum withdrawal: ₹50 | Maximum: ₹5,000
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
