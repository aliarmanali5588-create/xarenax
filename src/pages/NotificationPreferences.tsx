import { useState, useEffect } from "react";
import { Bell, Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";

interface NotificationPreferences {
  enable_match_notifications: boolean;
  enable_payment_notifications: boolean;
  enable_prize_notifications: boolean;
  enable_system_notifications: boolean;
  enable_affiliate_notifications: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const NotificationPreferences = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enable_match_notifications: true,
    enable_payment_notifications: true,
    enable_prize_notifications: true,
    enable_system_notifications: true,
    enable_affiliate_notifications: true,
    quiet_hours_enabled: false,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
  });

  useEffect(() => {
    if (user) {
      fetchPreferences();
    }
  }, [user]);

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setPreferences({
          enable_match_notifications: data.enable_match_notifications,
          enable_payment_notifications: data.enable_payment_notifications,
          enable_prize_notifications: data.enable_prize_notifications,
          enable_system_notifications: data.enable_system_notifications,
          enable_affiliate_notifications: data.enable_affiliate_notifications,
          quiet_hours_enabled: data.quiet_hours_enabled,
          quiet_hours_start: data.quiet_hours_start?.substring(0, 5) || "22:00",
          quiet_hours_end: data.quiet_hours_end?.substring(0, 5) || "08:00",
        });
      }
    } catch (error) {
      console.error("Error fetching preferences:", error);
      toast.error("Failed to load notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({
          user_id: user.id,
          ...preferences,
        });

      if (error) throw error;

      toast.success("Notification preferences saved! ✅");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    } finally {
      setSaving(false);
    }
  };

  const notificationTypes = [
    {
      key: "enable_match_notifications" as keyof NotificationPreferences,
      title: "🎮 Tournament Notifications",
      description: "Get notified about tournament starts, reminders, and room details",
    },
    {
      key: "enable_payment_notifications" as keyof NotificationPreferences,
      title: "💰 Payment Notifications",
      description: "Receive updates about deposits, withdrawals, and wallet transactions",
    },
    {
      key: "enable_prize_notifications" as keyof NotificationPreferences,
      title: "🏆 Prize Notifications",
      description: "Get notified when you win prizes and receive rewards",
    },
    {
      key: "enable_affiliate_notifications" as keyof NotificationPreferences,
      title: "🤝 Affiliate Notifications",
      description: "Updates about your referrals, bonuses, and commissions",
    },
    {
      key: "enable_system_notifications" as keyof NotificationPreferences,
      title: "📢 System Notifications",
      description: "Important announcements, updates, and platform news",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pb-20 lg:pb-0">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="modern-container max-w-3xl mx-auto text-center">
            <p className="text-muted-foreground">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="modern-container max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-gaming font-bold mb-3 text-glow-cyan">
              Notification Preferences
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Customize which notifications you want to receive and set quiet hours
            </p>
          </div>

          <div className="space-y-6">
            {/* Notification Types */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl">Notification Types</CardTitle>
                <CardDescription>
                  Choose which types of notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notificationTypes.map((type) => (
                  <div key={type.key} className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <Label htmlFor={type.key} className="text-base font-medium cursor-pointer">
                        {type.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <Switch
                      id={type.key}
                      checked={preferences[type.key] as boolean}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, [type.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quiet Hours */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">Quiet Hours</CardTitle>
                </div>
                <CardDescription>
                  Mute notifications during specific hours (e.g., while sleeping)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quiet-hours" className="text-base font-medium">
                      Enable Quiet Hours
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      No notifications during your quiet hours
                    </p>
                  </div>
                  <Switch
                    id="quiet-hours"
                    checked={preferences.quiet_hours_enabled}
                    onCheckedChange={(checked) =>
                      setPreferences((prev) => ({ ...prev, quiet_hours_enabled: checked }))
                    }
                  />
                </div>

                {preferences.quiet_hours_enabled && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div>
                      <Label htmlFor="start-time" className="text-sm">
                        Start Time
                      </Label>
                      <input
                        id="start-time"
                        type="time"
                        value={preferences.quiet_hours_start}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            quiet_hours_start: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="end-time" className="text-sm">
                        End Time
                      </Label>
                      <input
                        id="end-time"
                        type="time"
                        value={preferences.quiet_hours_end}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            quiet_hours_end: e.target.value,
                          }))
                        }
                        className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleSave}
                disabled={saving}
                className="min-w-[200px]"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;
