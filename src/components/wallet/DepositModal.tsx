import { useState } from "react";
import { IndianRupee, Smartphone, History } from "lucide-react";
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
import { ManualUPIModal } from "./ManualUPIModal";
import { DepositHistoryModal } from "./DepositHistoryModal";

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DepositModal = ({ open, onOpenChange }: DepositModalProps) => {
  const [amount, setAmount] = useState("");
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const MIN_DEPOSIT = 50;
  const MAX_DEPOSIT = 5000;
  const quickAmounts = [100, 250, 500, 1000];

  const handleUPIPayment = () => {
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < MIN_DEPOSIT || depositAmount > MAX_DEPOSIT) {
      return;
    }

    setSelectedAmount(depositAmount);
    setShowUPIModal(true);
    onOpenChange(false);
  };

  return (
    <>
      {/* Deposit Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-panel border-border/50 max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-gaming text-glow-cyan">
                  Add Money to Wallet
                </DialogTitle>
                <DialogDescription>
                  Enter the amount you want to add to your wallet
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowHistory(true);
                  onOpenChange(false);
                }}
                className="flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                History
              </Button>
            </div>
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
                min="50"
                max="5000"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Minimum deposit: ₹50 | Maximum: ₹5,000
            </p>
          </div>

          {/* Payment Button */}
          <div className="space-y-3">
            <Button
              onClick={handleUPIPayment}
              disabled={!amount || parseFloat(amount) < MIN_DEPOSIT || parseFloat(amount) > MAX_DEPOSIT}
              variant="gaming"
              size="lg"
              className="w-full"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Pay via UPI
            </Button>
          </div>

          {/* Security Notice */}
          <div className="glass-panel rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 100% Safe & Secure Payment
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>

      <ManualUPIModal
        open={showUPIModal}
        onOpenChange={(open) => {
          setShowUPIModal(open);
          if (!open) {
            setAmount("");
          }
        }}
        amount={selectedAmount}
      />

      <DepositHistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
      />
    </>
  );
};

export default DepositModal;
