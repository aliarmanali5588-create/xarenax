import { useState, useEffect } from "react";
import { X, Sparkles, Star, Flame } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  influencer: string;
}

const AnnouncementBar = () => {
  const [settings, setSettings] = useState<AnnouncementSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncementSettings();
  }, []);

  const fetchAnnouncementSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["announcement_enabled", "announcement_text", "announcement_influencer"]);

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((item) => {
        settingsMap[item.setting_key] = item.setting_value;
      });

      setSettings({
        enabled: settingsMap.announcement_enabled === "true",
        text: settingsMap.announcement_text || "",
        influencer: settingsMap.announcement_influencer || "",
      });
    } catch (error) {
      console.error("Failed to fetch announcement settings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !settings || !settings.enabled || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-secondary via-primary to-secondary animate-gradient-x">
      <div className="relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping" />
          <div className="absolute top-1 right-1/3 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-white/50 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>

        <div className="modern-container py-2.5 md:py-3">
          <div className="flex items-center justify-center gap-2 md:gap-4 text-center pr-8">
            {/* Icon */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" />
            </div>

            {/* Main text with influencer highlight */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-white">
              {settings.influencer ? (
                <>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300 fill-yellow-300" />
                    <span className="font-bold text-yellow-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
                      {settings.influencer}
                    </span>
                  </span>
                  <span className="text-white/90">recommends TeamFire!</span>
                  <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-300" />
                </>
              ) : (
                <span>{settings.text}</span>
              )}
            </div>

            {/* Sparkle icon */}
            <div className="hidden sm:flex items-center gap-1.5">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
