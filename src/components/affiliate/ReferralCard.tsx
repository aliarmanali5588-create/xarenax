import { Copy, Check, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const ReferralCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;

  useEffect(() => {
    if (user) {
      fetchReferralCode();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReferralCode = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setReferralCode(data?.referral_code || "");
    } catch (error) {
      console.error("Error fetching referral code:", error);
      toast({
        title: "Error",
        description: "Failed to load referral code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="glass-panel rounded-2xl p-8 neon-border-cyan neon-glow-cyan">
        <div className="text-center">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-gaming font-bold text-glow-cyan mb-2">
            Login Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Login to generate your unique referral link and start earning rewards
          </p>
          <Button variant="gaming" size="lg" asChild>
            <Link to="/auth">Login Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="glass-panel rounded-2xl p-8 neon-border-cyan neon-glow-cyan">
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-8 neon-border-cyan neon-glow-cyan">
      <h2 className="text-2xl font-gaming font-bold text-glow-cyan mb-2">
        Your Referral Code
      </h2>
      <p className="text-muted-foreground mb-6">
        Share your unique link and earn rewards
      </p>

      {/* Referral Code Display */}
      <div className="glass-panel rounded-xl p-6 mb-6 text-center">
        <div className="text-sm text-muted-foreground mb-2">Your Code</div>
        <div className="text-4xl font-gaming font-bold text-primary text-glow-cyan tracking-wider">
          {referralCode}
        </div>
      </div>

      {/* Referral Link */}
      <div className="glass-panel rounded-lg p-4 mb-4 flex items-center gap-3">
        <div className="flex-1 overflow-hidden">
          <div className="text-xs text-muted-foreground mb-1">Referral Link</div>
          <div className="text-sm text-foreground truncate">{referralLink}</div>
        </div>
        <Button
          onClick={handleCopy}
          variant={copied ? "neon" : "gaming"}
          size="sm"
          className="flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
      </div>

      {/* Earnings Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-lg p-4 text-center">
          <div className="text-2xl font-gaming font-bold text-primary">₹10</div>
          <div className="text-xs text-muted-foreground mt-1">Per Signup</div>
        </div>
        <div className="glass-panel rounded-lg p-4 text-center">
          <div className="text-2xl font-gaming font-bold text-secondary">₹100</div>
          <div className="text-xs text-muted-foreground mt-1">Per Win</div>
        </div>
      </div>
    </div>
  );
};

export default ReferralCard;
