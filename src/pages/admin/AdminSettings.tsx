import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Save, Plus, Trash2, Megaphone } from "lucide-react";
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
  const [upiMethods, setUpiMethods] = useState<UPIMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Announcement settings
  const [announcementEnabled, setAnnouncementEnabled] = useState(false);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementInfluencer, setAnnouncementInfluencer] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch all platform settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("platform_settings")
        .select("setting_key, setting_value")
        .in("setting_key", [
          "announcement_enabled",
          "announcement_text",
          "announcement_influencer"
        ]);

      if (settingsError) throw settingsError;

      settingsData?.forEach((setting) => {
        if (setting.setting_key === "announcement_enabled") {
          setAnnouncementEnabled(setting.setting_value === "true");
        } else if (setting.setting_key === "announcement_text") {
          setAnnouncementText(setting.setting_value);
        } else if (setting.setting_key === "announcement_influencer") {
          setAnnouncementInfluencer(setting.setting_value);
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
      // Delete QR code from storage if exists
      const method = upiMethods[index];
      if (method.qr_code_url) {
        try {
          const fileName = method.qr_code_url.split('/').pop();
          if (fileName) {
            await supabase.storage.from('qr-codes').remove([fileName]);
          }
        } catch (error) {
          console.error("Failed to delete QR code from storage:", error);
        }
      }

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

  const handleQRUpload = async (index: number, file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG, WEBP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `qr-${Date.now()}-${index}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('qr-codes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('qr-codes')
        .getPublicUrl(fileName);

      updateUpiMethod(index, "qr_code_url", publicUrl);

      toast({
        title: "Success!",
        description: "QR Code uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload QR code",
        variant: "destructive",
      });
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
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

      // Save Announcement settings
      const announcementSettings = [
        { setting_key: "announcement_enabled", setting_value: announcementEnabled.toString(), description: "Enable/disable the announcement bar on home page" },
        { setting_key: "announcement_text", setting_value: announcementText, description: "The text to display in the announcement bar" },
        { setting_key: "announcement_influencer", setting_value: announcementInfluencer, description: "Influencer/YouTuber name to highlight in the announcement" },
      ];

      for (const setting of announcementSettings) {
        const { error } = await supabase
          .from("platform_settings")
          .upsert(
            { ...setting, updated_at: new Date().toISOString() },
            { onConflict: "setting_key" }
          );
        if (error) throw error;
      }

      toast({
        title: "Success!",
        description: "Settings updated successfully.",
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
                              <Label htmlFor={`qr_code_${index}`}>QR Code</Label>
                              
                              {/* QR Code Preview */}
                              {method.qr_code_url && (
                                <div className="flex justify-center p-4 bg-white rounded-lg mb-2">
                                  <img 
                                    src={method.qr_code_url} 
                                    alt={`${method.display_name} QR`}
                                    className="w-32 h-32 object-contain"
                                  />
                                </div>
                              )}
                              
                              {/* File Upload Button */}
                              <div className="flex gap-2">
                                <Input
                                  id={`qr_code_${index}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleQRUpload(index, file);
                                  }}
                                  className="bg-background/50"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Upload QR code image (JPG, PNG, WEBP - Max 5MB)
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Announcement Bar Settings */}
                  <div className="space-y-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3">
                      <Megaphone className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-gaming text-primary">Announcement Bar (Home Page)</h3>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Show a promotional banner on the home page to highlight influencers, YouTubers, or special offers. Great for building trust!
                    </p>

                    <div className="flex items-center gap-3 p-3 bg-background/30 rounded-lg">
                      <Switch
                        id="announcement_enabled"
                        checked={announcementEnabled}
                        onCheckedChange={setAnnouncementEnabled}
                      />
                      <Label htmlFor="announcement_enabled" className="font-medium">
                        Enable Announcement Bar
                      </Label>
                    </div>

                    {announcementEnabled && (
                      <div className="space-y-4 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                          <Label htmlFor="announcement_influencer">
                            Influencer/YouTuber Name (Optional)
                          </Label>
                          <Input
                            id="announcement_influencer"
                            type="text"
                            value={announcementInfluencer}
                            onChange={(e) => setAnnouncementInfluencer(e.target.value)}
                            placeholder="e.g., Dynamo Gaming, Scout, Jonathan"
                            className="bg-background/50"
                          />
                          <p className="text-xs text-muted-foreground">
                            If provided, shows: "[Name] recommends TeamFire!"
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="announcement_text">
                            Custom Text (Used if no influencer name)
                          </Label>
                          <Input
                            id="announcement_text"
                            type="text"
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="Welcome to TeamFire! Join tournaments and win real money!"
                            className="bg-background/50"
                          />
                        </div>

                        {/* Preview */}
                        <div className="mt-4 p-3 bg-gradient-to-r from-secondary via-primary to-secondary rounded-lg">
                          <p className="text-center text-white text-sm font-medium">
                            Preview: {announcementInfluencer ? (
                              <span>⭐ <span className="text-yellow-300 font-bold">{announcementInfluencer}</span> recommends TeamFire! ✨</span>
                            ) : (
                              announcementText || "Your announcement text here..."
                            )}
                          </p>
                        </div>
                      </div>
                    )}
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
