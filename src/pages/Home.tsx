import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section - MOBILE FIRST */}
      <section className="pt-28 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex mb-6 w-auto max-w-full">
              <span className="px-3 py-2 rounded-full glass-panel text-xs md:text-sm font-medium text-primary neon-border-cyan whitespace-normal text-center">
                India's #1 PUBG Tournament Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-gaming font-black mb-6 leading-tight px-2">
              <span className="text-glow-cyan">Compete.</span>{" "}
              <span className="text-glow-orange">Win.</span>{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Dominate.
              </span>
            </h1>

            <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 leading-relaxed px-4">
              Join thousands of PUBG/BGMI players in fair, transparent tournaments.
              Compete for real cash prizes starting at just ₹30 entry fee.
            </p>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center items-stretch px-4">
              <Button variant="gaming" asChild className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto w-full md:w-auto whitespace-normal">
                <Link to="/tournaments">Join Tournament Now</Link>
              </Button>
              <Button variant="neonOrange" asChild className="text-sm md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto w-full md:w-auto whitespace-normal">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-panel-hover rounded-xl p-5 md:p-6 text-center group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-background" />
                </div>
                <div className="text-3xl md:text-4xl font-gaming font-bold mb-2 text-glow-cyan">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - MOBILE FIRST */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-gaming font-bold text-center mb-8 md:mb-12 text-glow-cyan px-4">
            Why Choose ArenaX?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="glass-panel-hover rounded-xl p-6 md:p-8 text-center group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/30 group-hover:neon-border-cyan transition-all duration-300">
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - MOBILE FIRST */}
      <section className="py-16 md:py-20 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="glass-panel rounded-2xl p-6 md:p-12 text-center neon-border-cyan neon-glow-cyan">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-gaming font-bold mb-4 md:mb-6 text-glow-cyan px-2">
              Ready to Start Winning?
            </h2>
            <p className="text-base md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-2">
              Join your first tournament today and compete with the best PUBG players in India.
            </p>
            <Button variant="gaming" asChild className="text-sm md:text-lg px-8 md:px-12 py-3 md:py-4 h-auto w-full md:w-auto whitespace-normal">
              <Link to="/tournaments">Browse Tournaments</Link>
            </Button>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Home;
