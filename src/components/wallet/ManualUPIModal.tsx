import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ManualUPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
}

export const ManualUPIModal = ({ open, onOpenChange, amount }: ManualUPIModalProps) => {
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPaymentDetails();
    }
  }, [open]);

  const fetchPaymentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["upi_id", "qr_code_url"]);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.setting_key === "upi_id") {
          setUpiId(setting.setting_value);
        } else if (setting.setting_key === "qr_code_url") {
          setQrCodeUrl(setting.setting_value);
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load payment details",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitUTR = async () => {
    if (!utrNumber || utrNumber.length < 10) {
      toast({
        title: "Invalid UTR",
        description: "Please enter a valid UTR number (min 10 characters)",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("utr_submissions").insert({
        user_id: user.id,
        amount,
        utr_number: utrNumber,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "UTR submitted successfully. Your payment will be verified within 10 minutes.",
      });

      onOpenChange(false);
      setUtrNumber("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-gaming text-primary">
            Pay ₹{amount} via UPI
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
            </div>
          )}

          {/* UPI ID */}
          <div className="space-y-2">
            <Label>UPI ID</Label>
            <div className="flex gap-2">
              <Input value={upiId} readOnly className="font-mono" />
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(upiId)}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Amount Display */}
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">₹{amount}</p>
          </div>

          {/* UTR Input */}
          <div className="space-y-2">
            <Label htmlFor="utr">Enter UTR Number</Label>
            <Input
              id="utr"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter 12-digit UTR number"
              maxLength={20}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter the UTR/Transaction ID after completing the payment
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitUTR}
            disabled={submitting || !utrNumber}
            className="w-full"
            size="lg"
          >
            {submitting ? "Submitting..." : "Submit Payment Proof"}
          </Button>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-2 p-3 bg-muted/20 rounded">
            <p className="font-semibold">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Scan QR code or copy UPI ID</li>
              <li>Pay exactly ₹{amount}</li>
              <li>Copy the UTR/Transaction ID from your payment app</li>
              <li>Paste it above and submit</li>
              <li>Balance will be credited within 10 minutes after verification</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
