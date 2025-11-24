import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [upiId, setUpiId] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["razorpay_key_id", "razorpay_key_secret", "upi_id", "qr_code_url"]);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.setting_key === "razorpay_key_id") {
          setRazorpayKeyId(setting.setting_value);
        } else if (setting.setting_key === "razorpay_key_secret") {
          setRazorpayKeySecret(setting.setting_value);
        } else if (setting.setting_key === "upi_id") {
          setUpiId(setting.setting_value);
        } else if (setting.setting_key === "qr_code_url") {
          setQrCodeUrl(setting.setting_value);
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Upsert Razorpay Key ID
      const { error: keyIdError } = await supabase
        .from("platform_settings")
        .upsert(
          {
            setting_key: "razorpay_key_id",
            setting_value: razorpayKeyId,
            description: "Razorpay Public Key ID",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" }
        );

      if (keyIdError) throw keyIdError;

      // Upsert Razorpay Key Secret
      const { error: secretError } = await supabase
        .from("platform_settings")
        .upsert(
          {
            setting_key: "razorpay_key_secret",
            setting_value: razorpayKeySecret,
            description: "Razorpay Private Key Secret",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" }
        );

      if (secretError) throw secretError;

      // Upsert UPI ID
      const { error: upiError } = await supabase
        .from("platform_settings")
        .upsert(
          {
            setting_key: "upi_id",
            setting_value: upiId,
            description: "UPI ID for manual payments",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" }
        );

      if (upiError) throw upiError;

      // Upsert QR Code URL
      const { error: qrError } = await supabase
        .from("platform_settings")
        .upsert(
          {
            setting_key: "qr_code_url",
            setting_value: qrCodeUrl,
            description: "QR Code URL for UPI payments",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "setting_key" }
        );

      if (qrError) throw qrError;

      toast({
        title: "Success!",
        description: "Payment settings updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-admin-gold">
              Platform Settings
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <>
              <div className="space-y-6">
                {/* Manual UPI Payment Settings */}
                <div className="space-y-4 p-4 border border-admin-gold/20 rounded-lg bg-admin-gold/5">
                  <h3 className="text-lg font-gaming text-admin-gold">Manual UPI Payment</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="upi_id">UPI ID</Label>
                    <Input
                      id="upi_id"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="your-upi@paytm"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qr_code_url">QR Code URL</Label>
                    <Input
                      id="qr_code_url"
                      type="text"
                      value={qrCodeUrl}
                      onChange={(e) => setQrCodeUrl(e.target.value)}
                      placeholder="https://your-domain.com/qr-code.png"
                      className="bg-background/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload QR code image and paste the URL here
                    </p>
                  </div>
                </div>

                {/* Razorpay Settings */}
                <div className="space-y-4 p-4 border border-muted/20 rounded-lg">
                  <h3 className="text-lg font-gaming text-muted-foreground">Razorpay (Optional)</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="razorpay_key_id">Razorpay Key ID (Public)</Label>
                    <Input
                      id="razorpay_key_id"
                      type="text"
                      value={razorpayKeyId}
                      onChange={(e) => setRazorpayKeyId(e.target.value)}
                      placeholder="rzp_test_XXXXXXXXXXXXXXXX"
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpay_key_secret">Razorpay Key Secret (Private)</Label>
                    <Input
                      id="razorpay_key_secret"
                      type="password"
                      value={razorpayKeySecret}
                      onChange={(e) => setRazorpayKeySecret(e.target.value)}
                      placeholder="YOUR_SECRET_KEY_HERE"
                      className="bg-background/50"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full md:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
