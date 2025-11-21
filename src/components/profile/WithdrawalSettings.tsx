import { useState, useEffect } from "react";
import { Lock, Unlock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// SECURITY: Payment Details Validation Schema
const paymentDetailsSchema = z.object({
  upiId1: z.string()
    .trim()
    .regex(/^[\w.+-]+@[\w.-]+$/, "Invalid UPI format (e.g., name@upi)"),
  upiId2: z.string().optional(),
  accountNumber: z.string()
    .trim()
    .regex(/^\d{9,18}$/, "Account number must be 9-18 digits"),
  bankName: z.string()
    .trim()
    .min(2, "Bank name too short")
    .max(50, "Bank name too long")
    .regex(/^[a-zA-Z\s]+$/, "Only letters and spaces allowed in bank name"),
  ifscCode: z.string()
    .trim()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format (e.g., HDFC0001234)")
});

interface WithdrawalSettingsProps {
  userId: string;
}

const WithdrawalSettings = ({ userId }: WithdrawalSettingsProps) => {
  const { toast } = useToast();
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    upiId1: "",
    upiId2: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, [userId]);

  const fetchPaymentMethods = async () => {
    try {
      const { data, error } = await supabase
        .from("user_payment_methods")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFormData({
          upiId1: data.upi_id_1 || "",
          upiId2: data.upi_id_2 || "",
          accountNumber: data.bank_account_no || "",
          bankName: data.bank_name || "",
          ifscCode: data.bank_ifsc || "",
        });
        setIsLocked(data.is_locked);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoading(false);
    }
  };

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

    // SECURITY: Validate payment details format
    try {
      paymentDetailsSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid Format",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    try {
      const { error } = await supabase
        .from("user_payment_methods")
        .upsert({
          user_id: userId,
          upi_id_1: formData.upiId1,
          upi_id_2: formData.upiId2 || null,
          bank_account_no: formData.accountNumber,
          bank_name: formData.bankName,
          bank_ifsc: formData.ifscCode,
          is_locked: true,
        });

      if (error) throw error;

      setIsLocked(true);
      setShowConfirmDialog(false);
      toast({
        title: "Withdrawal Details Locked 🔒",
        description: "Your payment details have been secured. Contact support to modify.",
      });
    } catch (error) {
      console.error("Error saving payment methods:", error);
      toast({
        title: "Error",
        description: "Failed to save payment details. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-8 neon-border-cyan">
        <p className="text-center text-muted-foreground">Loading...</p>
      </div>
    );
  }

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

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="glass-panel border-primary/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-gaming text-glow-cyan">
              Confirm Lock Payment Details
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              You cannot change these details later. Once locked, you'll need to contact support for any modifications. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave} className="bg-primary hover:bg-primary/90">
              Yes, Lock Details
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawalSettings;
