import { useState } from "react";
import { IndianRupee, CreditCard, Loader2 } from "lucide-react";
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
import { useRazorpay } from "@/hooks/useRazorpay";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositModal = ({ open, onOpenChange }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const { initiatePayment, isProcessing } = useRazorpay();

  const MIN_DEPOSIT = 1;
  const MAX_DEPOSIT = 5000;
  const quickAmounts = [100, 250, 500, 1000];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < MIN_DEPOSIT) {
      return;
    }
    if (depositAmount > MAX_DEPOSIT) {
      return;
    }

    initiatePayment({
      amount: depositAmount,
      onSuccess: () => {
        onOpenChange(false);
        setAmount("");
      },
      onFailure: () => {
        // Handle failure
      },
    });
  };

  return (
    <>
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="glass-panel p-8 rounded-lg border border-primary/20 shadow-glow max-w-sm mx-4 text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-gaming text-glow-cyan">
                Verifying Payment...
              </h3>
              <p className="text-sm text-muted-foreground">
                Please do not close or refresh this window.
              </p>
              <p className="text-xs text-muted-foreground">
                This may take 10-20 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-panel border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gaming text-glow-cyan">
              Add Money to Wallet
            </DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Amount Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Select</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === quickAmount.toString() ? "gaming" : "outline"}
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="font-heading"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium mb-2 block">
              Custom Amount
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg font-heading"
                min="1"
                max="5000"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum deposit: ₹1 | Maximum: ₹5,000
            </p>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handleDeposit}
            variant="gaming"
            size="lg"
            className="w-full"
            disabled={!amount || parseFloat(amount) < MIN_DEPOSIT || parseFloat(amount) > MAX_DEPOSIT}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Pay with Razorpay
          </Button>

          {/* Security Notice */}
          <div className="glass-panel rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Secured by Razorpay • 100% Safe & Encrypted
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default DepositModal;
