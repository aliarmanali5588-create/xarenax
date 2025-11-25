import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Clock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const Home = () => {
  const stats = [
    { label: "Active Players", value: "50K+", icon: Users, color: "text-primary" },
    { label: "Total Prizes", value: "₹10L+", icon: IndianRupee, color: "text-secondary" },
    { label: "Tournaments", value: "500+", icon: Trophy, color: "text-accent" },
  ];

  const features = [
    {
      icon: Shield,
      title: "100% Secure",
      description: "Bank-grade security for all transactions and data protection",
      color: "text-success",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Withdraw your winnings instantly to your account",
      color: "text-primary",
    },
    {
      icon: Trophy,
      title: "Skill-Based",
      description: "Pure skill competition with transparent prize distribution",
      color: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="modern-container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Star className="w-4 h-4 mr-2" />
              India's #1 PUBG Tournament Platform
            </Badge>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-7xl font-gaming font-bold mb-6 leading-tight">
              Compete in <span className="text-gradient">PUBG Tournaments</span>
              <br />
              <span className="text-foreground">Win Real Cash</span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join 50,000+ players competing in fair, skill-based tournaments. Entry from just ₹30.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                <Link to="/tournaments">
                  Browse Tournaments
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="px-8 py-6 text-lg">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-success" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <span>Instant Withdrawal</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 section-light">
        <div className="modern-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass-card-hover p-8 text-center hover-lift"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-card to-muted mb-4`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-gaming font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="modern-container">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-5xl font-gaming font-bold mb-4">
              Why Choose ArenaX?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              India's most trusted skill-based gaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-8 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-card to-muted mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 section-light">
        <div className="modern-container">
          <div className="glass-card p-12 md:p-16 text-center card-shadow-lg">
            <Trophy className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h2 className="text-2xl md:text-5xl font-gaming font-bold mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join your first tournament today and compete with the best players in India
            </p>
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-white px-12 py-6 text-lg">
              <Link to="/tournaments">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Home;
