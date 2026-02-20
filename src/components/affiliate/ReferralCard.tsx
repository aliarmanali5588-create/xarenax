import { useState, useEffect } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReferralCard = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralCode();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReferralCode = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data?.referral_code) {
        setReferralCode(data.referral_code);
      }
    } catch (error) {
      console.error("Error fetching referral code:", error);
      toast.error("Failed to load referral code");
    } finally {
      setLoading(false);
    }
  };

  const referralLink = referralCode 
    ? `${window.location.origin}/auth?ref=${referralCode}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = () => {
    const shareText = `🎮 Join me on NeroXP - India's #1 BGMI Tournament Platform!\n\n💰 Win Real Cash\n🏆 Daily Tournaments\n⚡ Instant Withdrawals\n\nSign up with my code: ${referralCode}\n${referralLink}`;
    
    if (navigator.share) {
      navigator.share({
        title: "Join NeroXP",
        text: shareText,
      }).catch(() => {
        // Fallback to copy if share fails
        handleCopy();
      });
    } else {
      handleCopy();
    }
  };

  if (!user) {
    return (
      <Card className="glass-panel p-6 md:p-8 text-center">
        <h3 className="text-xl font-gaming font-bold mb-2">Login Required</h3>
        <p className="text-muted-foreground mb-4">
          Login to generate your unique referral link and start earning
        </p>
        <Button
          onClick={() => window.location.href = "/auth"}
          className="w-full md:w-auto"
        >
          Login to Continue
        </Button>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="glass-panel p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-primary/20 rounded w-1/3"></div>
          <div className="h-10 bg-primary/20 rounded"></div>
          <div className="h-10 bg-primary/20 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-panel p-6 md:p-8 neon-border-cyan">
      <h3 className="text-xl md:text-2xl font-gaming font-bold mb-6 text-glow-cyan">
        Your Referral Link
      </h3>

      <div className="space-y-4">
        {/* Referral Code Display */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Your Unique Code
          </label>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono text-lg font-bold text-center"
            />
          </div>
        </div>

        {/* Referral Link - Mobile Optimized */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Share This Link
          </label>
          <div className="flex flex-col gap-2">
            <Input
              value={referralLink}
              readOnly
              className="text-sm w-full"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              className="w-full gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Share Button - Full Width on Mobile */}
        <Button
          onClick={handleShare}
          className="w-full gap-2 bg-gradient-to-r from-cyan-500 to-orange-500 hover:opacity-90"
        >
          <ExternalLink className="w-4 h-4" />
          Share via WhatsApp / Social Media
        </Button>

        {/* Info */}
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            💡 Share your link to earn ₹10 per signup + ₹100 per win (unlimited!)
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ReferralCard;
