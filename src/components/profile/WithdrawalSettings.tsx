import { useState } from "react";
import { Lock, Unlock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WithdrawalSettings = () => {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(false);
  const [formData, setFormData] = useState({
    upiId1: "",
    upiId2: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  const handleSave = () => {
    // Validate all fields are filled
    if (!formData.upiId1 || !formData.accountNumber || !formData.bankName || !formData.ifscCode) {
      toast({
        title: "Incomplete Information",
        description: "Please fill all mandatory fields before locking.",
        variant: "destructive",
      });
      return;
    }

    setIsLocked(true);
    toast({
      title: "Withdrawal Details Locked 🔒",
      description: "Your payment details have been secured. Contact support to modify.",
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-8 neon-border-cyan">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-gaming font-bold text-glow-cyan mb-2">
            Withdrawal Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Set your payment details. Once saved, they will be locked for security.
          </p>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 neon-border-cyan">
            <Lock className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Locked</span>
          </div>
        )}
      </div>

      {isLocked && (
        <div className="glass-panel rounded-lg p-4 mb-6 border-primary/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-primary mb-1">Security Lock Active</p>
            <p className="text-muted-foreground">
              Your withdrawal details are locked to prevent fraud. Contact support at{" "}
              <a href="mailto:helparenax@zohomail.in" className="text-primary hover:text-primary/80">
                helparenax@zohomail.in
              </a>{" "}
              to make changes.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* UPI Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            UPI Details
          </h3>
          
          <div>
            <Label htmlFor="upiId1" className="text-sm font-medium mb-2 block">
              UPI ID #1 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="upiId1"
              type="text"
              placeholder="yourname@upi"
              value={formData.upiId1}
              onChange={(e) => setFormData({ ...formData, upiId1: e.target.value })}
              disabled={isLocked}
              className={`${isLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
            />
          </div>

          <div>
            <Label htmlFor="upiId2" className="text-sm font-medium mb-2 block">
              UPI ID #2 <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="upiId2"
              type="text"
              placeholder="backup@upi"
              value={formData.upiId2}
              onChange={(e) => setFormData({ ...formData, upiId2: e.target.value })}
              disabled={isLocked}
              className={`${isLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
            />
          </div>
        </div>

        {/* Bank Details Section */}
        <div className="space-y-4 pt-4 border-t border-border/50">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Bank Account Details
          </h3>

          <div>
            <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
              Account Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              disabled={isLocked}
              className={`${isLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
            />
          </div>

          <div>
            <Label htmlFor="bankName" className="text-sm font-medium mb-2 block">
              Bank Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bankName"
              type="text"
              placeholder="e.g., HDFC Bank"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              disabled={isLocked}
              className={`${isLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
            />
          </div>

          <div>
            <Label htmlFor="ifscCode" className="text-sm font-medium mb-2 block">
              IFSC Code <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ifscCode"
              type="text"
              placeholder="e.g., HDFC0001234"
              value={formData.ifscCode}
              onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
              disabled={isLocked}
              className={`${isLocked ? "opacity-60 cursor-not-allowed bg-muted" : ""}`}
            />
          </div>
        </div>

        {!isLocked && (
          <Button
            onClick={handleSave}
            variant="gaming"
            size="lg"
            className="w-full"
          >
            <Unlock className="w-5 h-5 mr-2" />
            Save & Lock Details
          </Button>
        )}
      </div>
    </div>
  );
};

export default WithdrawalSettings;
