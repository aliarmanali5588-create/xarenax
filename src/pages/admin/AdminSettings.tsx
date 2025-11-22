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
        .in("setting_key", ["razorpay_key_id", "razorpay_key_secret"]);

      if (error) throw error;

      data?.forEach((setting) => {
        if (setting.setting_key === "razorpay_key_id") {
          setRazorpayKeyId(setting.setting_value);
        } else if (setting.setting_key === "razorpay_key_secret") {
          setRazorpayKeySecret(setting.setting_value);
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

      toast({
        title: "Success!",
        description: "Razorpay settings updated successfully.",
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
              <div className="space-y-4">
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
