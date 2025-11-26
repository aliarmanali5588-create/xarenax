import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Upload, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ManualUPIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
}

interface UPIMethod {
  id: string;
  upi_id: string;
  qr_code_url: string;
  display_name: string;
}

export const ManualUPIModal = ({ open, onOpenChange, amount }: ManualUPIModalProps) => {
  const [upiMethods, setUpiMethods] = useState<UPIMethod[]>([]);
  const [selectedUpi, setSelectedUpi] = useState<UPIMethod | null>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [utrValidation, setUtrValidation] = useState<"idle" | "valid" | "invalid">("idle");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPaymentDetails();
    }
  }, [open]);

  const fetchPaymentDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("upi_payment_methods")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setUpiMethods(data);
        setSelectedUpi(data[0]); // Select first UPI by default
      } else {
        toast({
          title: "No UPI Available",
          description: "No UPI payment methods are currently available",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load UPI details",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: selectedUpi ? `${selectedUpi.display_name} copied to clipboard` : "UPI ID copied",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Real-time UTR validation
  const validateUTR = (utr: string) => {
    // UTR format: Typically 12 digits for UPI transactions
    // Can be alphanumeric but usually numeric
    const trimmed = utr.trim();
    
    if (trimmed.length === 0) {
      setUtrValidation("idle");
      return;
    }
    
    // Check if 12 characters, alphanumeric
    if (trimmed.length === 12 && /^[A-Z0-9]{12}$/i.test(trimmed)) {
      setUtrValidation("valid");
    } else if (trimmed.length >= 10 && trimmed.length <= 22 && /^[A-Z0-9]+$/i.test(trimmed)) {
      // Some payment apps use different lengths
      setUtrValidation("valid");
    } else {
      setUtrValidation("invalid");
    }
  };

  const handleUTRChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setUtrNumber(upperValue);
    validateUTR(upperValue);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setScreenshot(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitUTR = async () => {
    if (!utrNumber || utrNumber.length < 10) {
      toast({
        title: "Invalid UTR",
        description: "Please enter a valid UTR number (10-22 characters)",
        variant: "destructive",
      });
      return;
    }

    if (utrValidation === "invalid") {
      toast({
        title: "Invalid UTR Format",
        description: "UTR should contain only letters and numbers",
        variant: "destructive",
      });
      return;
    }

    if (!screenshot) {
      toast({
        title: "Screenshot Required",
        description: "Please upload your payment screenshot to continue",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error("Screenshot upload error:", uploadError);
          toast({
            title: "Warning",
            description: "Screenshot upload failed, but submission will continue",
            variant: "default",
          });
        } else {
          screenshotUrl = fileName;
        }
      }

      // Run fraud detection
      const { data: fraudData, error: fraudError } = await supabase.rpc(
        "detect_utr_fraud",
        {
          p_user_id: user.id,
          p_utr_number: utrNumber,
          p_amount: amount,
        }
      );

      if (fraudError) {
        console.error("Fraud detection error:", fraudError);
        // Continue with submission even if fraud detection fails
      }

      // Parse fraud data safely
      const fraudResult = fraudData ? (fraudData as any) : { fraud_score: 100, fraud_flags: ['unknown'], is_suspicious: true };
      const fraudScore = fraudResult.fraud_score || 100;
      const fraudFlags = fraudResult.fraud_flags || [];

      // ⛔ AUTO-APPROVAL DISABLED FOR MAXIMUM SECURITY ⛔
      // All deposits MUST be manually verified by admin
      // This prevents ANY fraudulent deposits from being auto-credited
      const autoApprove = false;
      
      const initialStatus = autoApprove ? "approved" : "pending";

      // Insert UTR submission with fraud detection results and screenshot
      const { data: submission, error: insertError } = await supabase
        .from("utr_submissions")
        .insert({
          user_id: user.id,
          amount,
          utr_number: utrNumber,
          status: initialStatus,
          fraud_score: fraudScore,
          fraud_flags: fraudResult.fraud_flags || [],
          is_suspicious: fraudResult.is_suspicious || false,
          verification_status: autoApprove ? "verified" : "pending",
          screenshot_url: screenshotUrl,
          processed_at: autoApprove ? new Date().toISOString() : null,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // If auto-approved, credit wallet immediately
      if (autoApprove) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("wallet_balance, total_deposited, username")
          .eq("id", user.id)
          .single();

        if (profile) {
          await supabase
            .from("profiles")
            .update({ 
              wallet_balance: profile.wallet_balance + amount,
              total_deposited: profile.total_deposited + amount
            })
            .eq("id", user.id);

          // Create transaction record
          await supabase.from("transactions").insert({
            user_id: user.id,
            amount,
            type: "deposit",
            status: "success",
            description: `Manual UPI Deposit (Auto-Approved) - UTR: ${utrNumber}`,
          });

          // Send success notification
          await supabase.from("notifications").insert({
            user_id: user.id,
            title: "💰 Deposit Auto-Approved!",
            message: `Your deposit of ₹${amount} has been automatically verified and credited to your wallet.`,
            type: "payment",
          });
        }
      }

      toast({
        title: autoApprove ? "✅ Instantly Approved!" : "Success! ✅",
        description: autoApprove
          ? `Your deposit of ₹${amount} has been automatically approved and credited to your wallet!`
          : "Payment proof submitted with screenshot. Admin will verify within 10 minutes!",
      });

      onOpenChange(false);
      setUtrNumber("");
      setScreenshot(null);
      setScreenshotPreview("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-panel max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-glow-cyan">
            Pay via UPI
          </DialogTitle>
          <DialogDescription>
            Complete your payment and submit UTR for instant verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-2 -mr-2 flex-1">
          {/* Amount Display - Prominent */}
          <div className="p-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl border-2 border-primary/30 text-center space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Amount to Pay</p>
            <p className="text-4xl font-gaming font-bold text-glow-cyan">₹{amount}</p>
            <p className="text-xs text-destructive font-semibold">⚠️ Pay EXACTLY this amount</p>
          </div>

          {/* UPI Selection - Multiple Options */}
          {upiMethods.length > 1 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Select UPI Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {upiMethods.map((method) => (
                  <Button
                    key={method.id}
                    type="button"
                    variant={selectedUpi?.id === method.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedUpi(method)}
                    className="w-full"
                  >
                    {method.display_name}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Choose any UPI if one is down
              </p>
            </div>
          )}

          {/* QR Code */}
          {selectedUpi?.qr_code_url && (
            <div className="flex justify-center p-4 bg-white rounded-xl shadow-lg">
              <img 
                src={selectedUpi.qr_code_url} 
                alt={`${selectedUpi.display_name} QR Code`} 
                className="w-48 h-48" 
              />
            </div>
          )}

          {/* UPI ID */}
          {selectedUpi && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">{selectedUpi.display_name}</Label>
              <div className="flex gap-2">
                <Input value={selectedUpi.upi_id} readOnly className="font-mono text-base bg-muted" />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(selectedUpi.upi_id)}
                  className="hover-lift"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* UTR Input with Validation */}
          <div className="space-y-2">
            <Label htmlFor="utr" className="text-sm font-semibold">
              Enter UTR/Transaction ID
            </Label>
            <div className="relative">
              <Input
                id="utr"
                value={utrNumber}
                onChange={(e) => handleUTRChange(e.target.value)}
                placeholder="Enter 12-digit UTR (e.g., 123456789012)"
                maxLength={22}
                className="font-mono text-base pr-10"
              />
              {utrValidation === "valid" && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
              )}
              {utrValidation === "invalid" && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex items-start gap-2 text-xs">
              <AlertCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Find the UTR/Transaction ID in your payment app after completing the transaction. 
                It's usually 12 characters (letters and numbers).
              </p>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="space-y-2">
            <Label htmlFor="screenshot" className="text-sm font-semibold text-destructive">
              Upload Payment Screenshot (Required) *
            </Label>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                {screenshot && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setScreenshot(null);
                      setScreenshotPreview("");
                    }}
                  >
                    <XCircle className="h-5 w-5 text-destructive" />
                  </Button>
                )}
              </div>
              {screenshotPreview && (
                <div className="relative w-full max-w-xs mx-auto">
                  <img 
                    src={screenshotPreview} 
                    alt="Payment screenshot preview" 
                    className="w-full h-auto rounded-lg border-2 border-primary/30"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ready to Upload
                  </Badge>
                </div>
              )}
              <div className="flex items-start gap-2 text-xs">
                <Upload className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-destructive">Required:</strong> Upload your payment screenshot for 
                  verification. Max 5MB (JPG, PNG, WEBP)
                </p>
              </div>
            </div>
          </div>

          {/* Warning for fraud detection */}
          <Alert className="border-amber-500/50 bg-amber-500/5">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-xs space-y-1">
              <p>
                <strong>Maximum Security Active:</strong> All deposits require manual admin verification.
              </p>
              <p className="text-amber-600 dark:text-amber-400">
                ⏳ Admin will verify within 5-10 minutes
              </p>
              <p className="text-green-600 dark:text-green-400">
                ✅ Your balance will be credited after verification
              </p>
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitUTR}
            disabled={submitting || !utrNumber || utrValidation === "invalid" || !screenshot}
            className="w-full"
            size="lg"
            variant="gaming"
          >
            {uploading ? (
              <>
                <Upload className="w-5 h-5 mr-2 animate-pulse" />
                Uploading Screenshot...
              </>
            ) : submitting ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Submit Payment Proof
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground space-y-3 p-4 bg-muted/20 rounded-lg border border-border/50">
            <p className="font-semibold text-foreground text-sm">📋 How to Submit:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Copy" to copy UPI ID or scan QR code</li>
              <li>Open any UPI app (PhonePe, GPay, Paytm, etc.)</li>
              <li>Pay <strong>EXACTLY ₹{amount}</strong> to the UPI ID</li>
              <li>Copy the UTR/Transaction ID from your payment app</li>
              <li>Paste it above and click "Submit Payment Proof"</li>
              <li>✅ Balance credited within <strong>10 minutes</strong> after verification</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
