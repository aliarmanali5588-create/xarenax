import { useEffect, useState } from "react";
import { Share2, UserPlus, Trophy, Users, Wallet, TrendingUp, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import AffiliateStepCard from "@/components/cards/AffiliateStepCard";
import ReferralCard from "@/components/affiliate/ReferralCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AffiliateStats {
  total_signups: number;
  active_depositors: number;
  matches_played: number;
  total_earnings: number;
}

interface ReferralHistory {
  id: string;
  username: string;
  created_at: string;
  total_deposited: number;
  total_winnings: number;
}

const Affiliate = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [referrals, setReferrals] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAffiliateData();
    }
  }, [user]);

  const fetchAffiliateData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);

      // Fetch stats using the database function
      const { data: statsData, error: statsError } = await supabase.rpc(
        "get_affiliate_stats",
        { p_user_id: user.id }
      );

      if (statsError) throw statsError;
      setStats(statsData as unknown as AffiliateStats);

      // Fetch referral history
      const { data: referralsData, error: referralsError } = await supabase
        .from("profiles")
        .select("id, username, created_at, total_deposited, total_winnings")
        .eq("referred_by", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (referralsError) throw referralsError;
      setReferrals(referralsData || []);
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const affiliateSteps = [
    {
      step: 1,
      title: "Share Your Link",
      description: "Get your unique referral code and share it with friends via WhatsApp, social media, or any platform.",
      reward: "Get Started",
      icon: Share2,
    },
    {
      step: 2,
      title: "Friend Joins",
      description: "When your friend signs up using your referral code and creates their account on TeamFire.",
      reward: "₹10 Instant",
      icon: UserPlus,
    },
    {
      step: 3,
      title: "Friend Wins Match",
      description: "Every time your referred friend wins a tournament match, you earn a commission automatically.",
      reward: "₹100 Per Win",
      icon: Trophy,
    },
  ];

  const calculateEarnings = (referral: ReferralHistory) => {
    // ₹10 signup bonus + potential win bonuses (estimate based on total winnings)
    const signupBonus = 10;
    const estimatedWins = Math.floor(referral.total_winnings / 1000); // Rough estimate
    const winBonus = estimatedWins * 100;
    return signupBonus + winBonus;
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/10" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-6 px-5 py-2.5 bg-secondary/15 text-secondary border-secondary/40 shadow-[0_0_20px_rgba(251,146,60,0.2)] text-sm md:text-base">
              <Share2 className="w-4 h-4 mr-2" />
              Earn While You Game
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse">
                Affiliate Dashboard
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Invite friends to TeamFire and earn <span className="text-secondary font-bold">rewards for every signup and win</span>
            </p>
          </div>

          {/* Referral Card */}
          <div className="max-w-2xl mx-auto">
            <ReferralCard />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">

          {/* Stats Dashboard - Enhanced */}
          {user && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-4xl font-gaming font-bold mb-6">
                <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Your Performance
                </span>
              </h2>
              
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="glass-panel p-3">
                      <Skeleton className="h-8 w-8 mb-2" />
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-6 w-16" />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                  {/* Total Signups */}
                  <Card className="glass-card p-4 md:p-6 hover-lift relative overflow-hidden group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-cyan-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Signups</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats?.total_signups || 0}
                    </p>
                  </Card>

                  {/* Active Depositors */}
                  <Card className="glass-panel p-3 hover:neon-border-orange transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats?.active_depositors || 0}
                    </p>
                  </Card>

                  {/* Matches Played */}
                  <Card className="glass-panel p-3 hover:neon-border-cyan transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-cyan-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Matches Played</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">
                      {stats?.matches_played || 0}
                    </p>
                  </Card>

                  {/* Total Earnings */}
                  <Card className="glass-panel p-3 hover:neon-border-orange transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                    <p className="text-xl md:text-2xl font-bold text-green-500">
                      ₹{stats?.total_earnings || 0}
                    </p>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Referral History - Responsive Table/Cards */}
          {user && referrals.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-gaming font-bold mb-6 text-glow-cyan">
                Recent Referrals
              </h2>

              {/* Desktop Table View */}
              <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-primary/10 border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold">User</th>
                      <th className="text-left p-4 text-sm font-semibold">Joined Date</th>
                      <th className="text-left p-4 text-sm font-semibold">Status</th>
                      <th className="text-right p-4 text-sm font-semibold">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors">
                        <td className="p-4">
                          <span className="font-medium">{referral.username}</span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {format(new Date(referral.created_at), "MMM dd, yyyy")}
                        </td>
                        <td className="p-4">
                          {referral.total_deposited > 0 ? (
                            <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              New
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <span className="font-bold text-green-500">
                            ₹{calculateEarnings(referral)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-3">
                {referrals.map((referral) => (
                  <Card key={referral.id} className="glass-panel p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground">{referral.username}</span>
                      {referral.total_deposited > 0 ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(referral.created_at), "MMM dd, yyyy")}
                      </span>
                      <span className="font-bold text-green-500">
                        ₹{calculateEarnings(referral)}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-gaming font-bold text-center mb-8 text-glow-cyan">
              How It Works
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
              {affiliateSteps.map((step, index) => (
                <AffiliateStepCard
                  key={step.step}
                  {...step}
                  isLast={index === affiliateSteps.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="glass-panel rounded-2xl p-6 md:p-12">
            <h3 className="text-2xl md:text-3xl font-gaming font-bold mb-8 text-center text-glow-cyan">
              Program Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold mb-1">No Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    Refer unlimited friends and earn without any cap on your earnings
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold mb-1">Instant Rewards</h4>
                  <p className="text-sm text-muted-foreground">
                    Get your referral bonus credited immediately to your wallet
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold mb-1">Track Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your referrals and earnings with detailed analytics
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-heading font-bold mb-1">Lifetime Commission</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn every time your referrals win, for as long as they play
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Affiliate;
