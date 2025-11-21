import { Share2, UserPlus, Trophy } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import AffiliateStepCard from "@/components/cards/AffiliateStepCard";
import ReferralCard from "@/components/affiliate/ReferralCard";

const Affiliate = () => {
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
      description: "When your friend signs up using your referral code and creates their account on ArenaX.",
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

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full glass-panel text-sm font-medium text-secondary neon-border-orange">
                Earn While You Game
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-gaming font-bold mb-4">
              <span className="text-glow-cyan">Affiliate</span>{" "}
              <span className="text-glow-orange">Program</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Invite friends to ArenaX and earn rewards for every signup and win. Turn your network into passive income!
            </p>
          </div>

          {/* Referral Card */}
          <div className="mb-16 max-w-2xl mx-auto">
            <ReferralCard />
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-gaming font-bold text-center mb-12 text-glow-cyan">
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

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="glass-panel-hover rounded-xl p-6 text-center">
              <div className="text-4xl font-gaming font-bold mb-2 text-primary text-glow-cyan">
                0
              </div>
              <div className="text-muted-foreground">Total Referrals</div>
            </div>
            <div className="glass-panel-hover rounded-xl p-6 text-center">
              <div className="text-4xl font-gaming font-bold mb-2 text-secondary text-glow-orange">
                ₹0
              </div>
              <div className="text-muted-foreground">Total Earnings</div>
            </div>
            <div className="glass-panel-hover rounded-xl p-6 text-center">
              <div className="text-4xl font-gaming font-bold mb-2 text-success">
                ₹0
              </div>
              <div className="text-muted-foreground">This Month</div>
            </div>
          </div>

          {/* Benefits */}
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-gaming font-bold mb-8 text-center text-glow-cyan">
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
      </div>

      <MegaFooter />
    </div>
  );
};

export default Affiliate;
