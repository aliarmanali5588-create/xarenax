import { useState } from "react";
import { IndianRupee, CreditCard } from "lucide-react";
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
  const { initiatePayment } = useRazorpay();

  const quickAmounts = [100, 250, 500, 1000];

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
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
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum deposit: ₹10 | Maximum: ₹50,000
            </p>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handleDeposit}
            variant="gaming"
            size="lg"
            className="w-full"
            disabled={!amount || parseFloat(amount) <= 0}
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
  );
};

export default DepositModal;
