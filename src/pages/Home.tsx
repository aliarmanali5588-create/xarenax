import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import heroBanner from "@/assets/arena-realistic.jpg";

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
      <section className="pt-20 pb-8 px-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-accent/10 to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDMwYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-6xl mx-auto py-20 md:py-28">
            {/* Premium Badge */}
            <div className="inline-flex mb-8 animate-pulse-glow">
              <div className="glass-panel rounded-full px-6 py-3 border-2 border-primary/50 neon-glow-cyan">
                <span className="text-sm md:text-base font-gaming font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  India's #1 PUBG Tournament Platform
                  <Trophy className="w-5 h-5" />
                </span>
              </div>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-gaming font-black mb-8 leading-tight">
              <div className="mb-4">
                <span className="inline-block hover:scale-110 transition-transform duration-300 text-gradient-gaming drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                  COMPETE
                </span>
              </div>
              <div className="mb-4">
                <span className="inline-block hover:scale-110 transition-transform duration-300" style={{
                  background: 'linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 30px rgba(255,165,0,0.5))'
                }}>
                  DOMINATE
                </span>
              </div>
              <div>
                <span className="inline-block hover:scale-110 transition-transform duration-300 text-gradient-gaming drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                  WIN REAL CASH
                </span>
              </div>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-3xl text-foreground mb-10 md:mb-12 leading-relaxed font-medium max-w-4xl mx-auto">
              Join <span className="text-primary font-bold neon-glow-cyan">50,000+ players</span> in skill-based tournaments
              <br className="hidden md:block" />
              Win <span className="text-secondary font-bold neon-glow-orange">real cash prizes</span> • Entry from just <span className="text-accent font-bold">₹30</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 md:gap-6 justify-center items-stretch mb-10">
              <Button variant="gaming" asChild className="text-lg md:text-2xl px-10 md:px-16 py-6 md:py-8 h-auto hover-glow-intense font-bold shadow-2xl">
                <Link to="/tournaments">
                  <Trophy className="w-6 h-6 mr-2" />
                  Join Tournament Now
                </Link>
              </Button>
              <Button variant="neonOrange" asChild className="text-lg md:text-2xl px-10 md:px-16 py-6 md:py-8 h-auto hover-glow-intense font-bold shadow-2xl">
                <Link to="/how-it-works">
                  <Target className="w-6 h-6 mr-2" />
                  How It Works
                </Link>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="glass-panel rounded-xl px-6 py-3 border-2 border-success/30 hover:border-success transition-all">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-success" />
                  <span className="font-bold text-foreground">100% Secure</span>
                </div>
              </div>
              <div className="glass-panel rounded-xl px-6 py-3 border-2 border-primary/30 hover:border-primary transition-all">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <span className="font-bold text-foreground">Instant Payouts</span>
                </div>
              </div>
              <div className="glass-panel rounded-xl px-6 py-3 border-2 border-secondary/30 hover:border-secondary transition-all">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-secondary" />
                  <span className="font-bold text-foreground">Fair Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Arena Banner */}
      <section className="py-0 px-0 relative">
        <div className="relative h-[500px] md:h-[700px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={heroBanner} 
              alt="Professional Esports Arena" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
          </div>
          <div className="container mx-auto px-4 md:px-6 relative z-10 h-full flex items-center justify-center">
            <div className="text-center w-full max-w-4xl glass-panel rounded-3xl p-8 md:p-12 neon-border-cyan">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 text-admin-gold animate-pulse" />
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-gaming font-bold mb-4 md:mb-6 text-gradient-gaming">
                Championship Arena
              </h2>
              <p className="text-lg md:text-2xl text-foreground/90 mb-6 md:mb-8 font-medium">
                Compete in <span className="text-primary font-bold">world-class tournaments</span> with instant payouts and guaranteed fair play
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <div className="glass-panel rounded-xl px-4 md:px-6 py-3 md:py-4 border-2 border-primary/30">
                  <div className="text-2xl md:text-3xl font-gaming font-bold text-primary">₹10L+</div>
                  <div className="text-xs md:text-sm text-foreground/70">Prizes Won</div>
                </div>
                <div className="glass-panel rounded-xl px-4 md:px-6 py-3 md:py-4 border-2 border-secondary/30">
                  <div className="text-2xl md:text-3xl font-gaming font-bold text-secondary">50K+</div>
                  <div className="text-xs md:text-sm text-foreground/70">Active Players</div>
                </div>
                <div className="glass-panel rounded-xl px-4 md:px-6 py-3 md:py-4 border-2 border-accent/30">
                  <div className="text-2xl md:text-3xl font-gaming font-bold text-accent">500+</div>
                  <div className="text-xs md:text-sm text-foreground/70">Tournaments</div>
                </div>
              </div>
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
