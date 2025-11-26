import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UPIMethod {
  id?: string;
  upi_id: string;
  qr_code_url: string;
  display_name: string;
  is_active: boolean;
}

const AdminSettings = () => {
  const [razorpayKeyId, setRazorpayKeyId] = useState("");
  const [razorpayKeySecret, setRazorpayKeySecret] = useState("");
  const [upiMethods, setUpiMethods] = useState<UPIMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch Razorpay settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("platform_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["razorpay_key_id", "razorpay_key_secret"]);

      if (settingsError) throw settingsError;

      settingsData?.forEach((setting) => {
        if (setting.setting_key === "razorpay_key_id") {
          setRazorpayKeyId(setting.setting_value);
        } else if (setting.setting_key === "razorpay_key_secret") {
          setRazorpayKeySecret(setting.setting_value);
        }
      });

      // Fetch UPI methods
      const { data: upiData, error: upiError } = await supabase
        .from("upi_payment_methods")
        .select("*")
        .order("created_at", { ascending: true });

      if (upiError) throw upiError;

      setUpiMethods(upiData || []);
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

  const addUpiMethod = () => {
    if (upiMethods.length >= 10) {
      toast({
        title: "Limit Reached",
        description: "You can add maximum 10 UPI methods",
        variant: "destructive",
      });
      return;
    }
    setUpiMethods([
      ...upiMethods,
      {
        upi_id: "",
        qr_code_url: "",
        display_name: `UPI ${upiMethods.length + 1}`,
        is_active: true,
      },
    ]);
  };

  const removeUpiMethod = async (index: number, id?: string) => {
    if (id) {
      const { error } = await supabase
        .from("upi_payment_methods")
        .delete()
        .eq("id", id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete UPI method",
          variant: "destructive",
        });
        return;
      }
    }
    setUpiMethods(upiMethods.filter((_, i) => i !== index));
  };

  const updateUpiMethod = (index: number, field: keyof UPIMethod, value: string | boolean) => {
    const updated = [...upiMethods];
    updated[index] = { ...updated[index], [field]: value };
    setUpiMethods(updated);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save Razorpay settings
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

      // Save UPI methods (only non-empty ones)
      for (const method of upiMethods) {
        if (method.upi_id.trim()) {
          if (method.id) {
            // Update existing
            const { error } = await supabase
              .from("upi_payment_methods")
              .update({
                upi_id: method.upi_id,
                qr_code_url: method.qr_code_url,
                display_name: method.display_name,
                is_active: method.is_active,
              })
              .eq("id", method.id);

            if (error) throw error;
          } else {
            // Insert new
            const { error } = await supabase
              .from("upi_payment_methods")
              .insert({
                upi_id: method.upi_id,
                qr_code_url: method.qr_code_url,
                display_name: method.display_name,
                is_active: method.is_active,
              });

            if (error) throw error;
          }
        }
      }

      toast({
        title: "Success!",
        description: "Payment settings updated successfully.",
      });
      
      fetchSettings(); // Refresh data
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
                  {/* Multiple UPI Payment Methods */}
                  <div className="space-y-4 p-4 border border-admin-gold/20 rounded-lg bg-admin-gold/5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-gaming text-admin-gold">UPI Payment Methods</h3>
                      <Button
                        onClick={addUpiMethod}
                        size="sm"
                        disabled={upiMethods.length >= 10}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add UPI
                      </Button>
                    </div>
                    
                    {upiMethods.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No UPI methods added yet. Click "Add UPI" to start.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {upiMethods.map((method, index) => (
                          <div key={index} className="space-y-3 p-4 border border-admin-gold/10 rounded-lg bg-background/30">
                            <div className="flex items-center justify-between">
                              <Label className="text-admin-gold font-semibold">{method.display_name}</Label>
                              <Button
                                onClick={() => removeUpiMethod(index, method.id)}
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`upi_id_${index}`}>UPI ID</Label>
                              <Input
                                id={`upi_id_${index}`}
                                type="text"
                                value={method.upi_id}
                                onChange={(e) => updateUpiMethod(index, "upi_id", e.target.value)}
                                placeholder="your-upi@paytm"
                                className="bg-background/50"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`qr_code_${index}`}>QR Code URL</Label>
                              <Input
                                id={`qr_code_${index}`}
                                type="text"
                                value={method.qr_code_url}
                                onChange={(e) => updateUpiMethod(index, "qr_code_url", e.target.value)}
                                placeholder="https://your-domain.com/qr-code.png"
                                className="bg-background/50"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
