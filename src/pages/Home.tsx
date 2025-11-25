import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import heroBanner from "@/assets/tournament-hero-banner.jpg";

const Home = () => {
  const stats = [
    { label: "Active Players", value: "50K+", icon: Users },
    { label: "Total Prizes", value: "₹10L+", icon: IndianRupee },
    { label: "Tournaments", value: "500+", icon: Trophy },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Encrypted payments and fair play guaranteed",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Win and withdraw your earnings immediately",
    },
    {
      icon: Target,
      title: "Skilled Gameplay",
      description: "Pure skill-based tournaments, no luck involved",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero Banner - Gaming Vibe */}
      <section className="pt-20 pb-0 px-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDMwYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto py-16 md:py-24">
            <div className="inline-flex mb-6 w-auto max-w-full animate-pulse-glow">
              <span className="px-4 py-2 rounded-full glass-panel text-xs md:text-sm font-bold text-primary neon-border-cyan whitespace-normal text-center uppercase tracking-wider">
                🏆 India's #1 PUBG Tournament Platform 🏆
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-gaming font-black mb-6 leading-tight px-2">
              <span className="text-glow-cyan inline-block hover:scale-110 transition-transform">Compete.</span>{" "}
              <span className="text-glow-orange inline-block hover:scale-110 transition-transform">Win.</span>{" "}
              <span className="text-gradient-gaming inline-block hover:scale-110 transition-transform">
                Dominate.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-foreground/90 mb-8 md:mb-10 leading-relaxed px-4 font-medium">
              Join <span className="text-primary font-bold">50,000+ players</span> in skill-based PUBG/BGMI tournaments.
              <br className="hidden md:block" />
              Compete for <span className="text-secondary font-bold">real cash prizes</span> starting at just ₹30 entry fee.
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch px-4 mb-8">
              <Button variant="gaming" asChild className="text-base md:text-xl px-8 md:px-12 py-4 md:py-6 h-auto w-full md:w-auto whitespace-normal hover-glow-intense font-bold">
                <Link to="/tournaments">🎮 Join Tournament Now</Link>
              </Button>
              <Button variant="neonOrange" asChild className="text-base md:text-xl px-8 md:px-12 py-4 md:py-6 h-auto w-full md:w-auto whitespace-normal hover-glow-intense font-bold">
                <Link to="/how-it-works">📚 How It Works</Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Instant Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-secondary" />
                <span>Fair Play</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Arena Banner */}
      <section className="py-0 px-0 relative">
        <div className="relative h-[400px] md:h-[600px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroBanner} 
              alt="Professional Gaming Arena" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 h-full flex items-end pb-12 md:pb-20">
            <div className="text-center w-full">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-gaming font-bold mb-4 text-gradient-gaming">
                World-Class Gaming Experience
              </h2>
              <p className="text-lg md:text-2xl text-foreground/90 max-w-3xl mx-auto font-medium">
                Professional tournaments with <span className="text-primary">real prizes</span>, instant payouts, and <span className="text-secondary">fair gameplay</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 px-4 md:px-6 bg-gradient-to-b from-background via-card/30 to-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-panel-hover rounded-2xl p-6 md:p-8 text-center group hover-glow-intense relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl gradient-gaming flex items-center justify-center neon-glow-multi group-hover:scale-110 transition-transform shadow-2xl">
                    <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-background" />
                  </div>
                  <div className="text-4xl md:text-5xl font-gaming font-bold mb-3 text-gradient-gaming">
                    {stat.value}
                  </div>
                  <div className="text-base md:text-lg text-foreground font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-gaming font-bold text-center mb-4 text-gradient-gaming px-4">
            Why Choose ArenaX?
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 md:mb-16">
            India's most trusted skill-based gaming platform
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-panel-hover rounded-2xl p-8 md:p-10 text-center group hover-glow-intense relative overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-2xl gradient-gaming flex items-center justify-center neon-glow-multi group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-2xl">
                    <feature.icon className="w-10 h-10 md:w-12 md:h-12 text-background" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3 md:mb-4 text-gradient-gaming">{feature.title}</h3>
                  <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 animate-pulse-glow" />
        <div className="container mx-auto relative z-10">
          <div className="glass-panel rounded-3xl p-8 md:p-16 text-center rgb-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
            <div className="relative z-10">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 text-admin-gold animate-pulse" />
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-gaming font-bold mb-6 md:mb-8 text-gradient-gaming px-2">
                Ready to Start Winning?
              </h2>
              <p className="text-lg md:text-2xl text-foreground/90 mb-8 md:mb-10 max-w-3xl mx-auto px-2 font-medium">
                Join your first tournament today and compete with the <span className="text-primary">best PUBG players</span> in India.
                Start earning real cash prizes now!
              </p>
              <Button variant="gaming" asChild className="text-lg md:text-2xl px-10 md:px-16 py-5 md:py-7 h-auto w-full md:w-auto whitespace-normal hover-glow-intense font-bold">
                <Link to="/tournaments">🎯 Browse Tournaments</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Home;
