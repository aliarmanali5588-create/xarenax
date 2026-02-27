import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Clock, ArrowRight, Star, Check, Lock, TrendingUp } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

const Home = () => {
  const stats = [
    { label: "Active Players", value: "50K+", icon: Users, color: "text-primary" },
    { label: "Total Prizes", value: "₹10L+", icon: IndianRupee, color: "text-secondary" },
    { label: "Tournaments", value: "500+", icon: Trophy, color: "text-accent" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data and transactions protected with military-grade encryption and secure payment gateways",
      color: "text-success",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Withdraw your winnings instantly to your bank account or UPI within minutes",
      color: "text-primary",
    },
    {
      icon: Trophy,
      title: "100% Skill-Based",
      description: "Fair play guaranteed with transparent prize distribution and real-time tournament tracking",
      color: "text-secondary",
    },
  ];

  const trustIndicators = [
    { icon: Check, text: "100% Legal & Licensed" },
    { icon: Lock, text: "Secure Payments" },
    { icon: Users, text: "50,000+ Players" },
    { icon: TrendingUp, text: "₹10L+ Paid Out" },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <AnnouncementBar />
      <Navbar />

      {/* Hero Section - Premium Gaming Aesthetic */}
      <section className="relative pt-28 pb-24 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
        {/* Accent Glows */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="modern-container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <Badge className="mb-6 px-5 py-2.5 text-sm bg-success/15 text-success border-success/40 hover:bg-success/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
              <Shield className="w-4 h-4 mr-2" />
              India's Most Trusted BGMI Tournament Platform
            </Badge>

            {/* Main Heading - Enhanced Typography */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              Dominate <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">BGMI Tournaments</span>
              <br />
              <span className="text-foreground drop-shadow-[0_0_30px_rgba(0,255,255,0.5)]">Win Real Cash</span>
            </h1>

            {/* Description - Larger & Clearer */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Join <span className="text-primary font-bold">50,000+ players</span> competing in fair, skill-based tournaments. 
              Entry from just <span className="text-secondary font-bold">₹30</span>.
            </p>

            {/* CTA Buttons - More Prominent */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-10 py-7 text-lg font-bold shadow-[0_0_40px_rgba(0,255,255,0.4)] hover:shadow-[0_0_60px_rgba(0,255,255,0.6)] hover:scale-105 transition-all duration-300 min-w-[240px]"
              >
                <Link to="/tournaments">
                  Browse Tournaments
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="px-10 py-7 text-lg font-semibold border-2 border-border hover:border-primary hover:bg-primary/10 min-w-[240px]"
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Trust Indicators - Premium Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {trustIndicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="glass-panel rounded-xl p-4 flex flex-col items-center gap-2 hover:border-primary/40 transition-all duration-300"
                >
                  <indicator.icon className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium text-center">{indicator.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Premium Cards */}
      <section className="py-20 px-4 section-light">
        <div className="modern-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card-hover p-8 text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-300">
                  <stat.icon className={`w-10 h-10 ${stat.color} drop-shadow-[0_0_10px_currentColor]`} />
                </div>
                <div className="text-5xl font-gaming font-bold mb-3 text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced Trust Building */}
      <section className="py-24 px-4">
        <div className="modern-container">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
              Why 50,000+ Players Trust Us
            </Badge>
            <h2 className="text-3xl md:text-6xl font-gaming font-bold mb-6">
              Why Choose <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TeamFire</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              India's most trusted and secure skill-based gaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-8 hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-card to-muted border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.2)]">
                  <feature.icon className={`w-10 h-10 ${feature.color} drop-shadow-[0_0_10px_currentColor]`} />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4 text-center">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-24 px-4 section-light">
        <div className="modern-container">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
            {/* Background Glow Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center hover:scale-110 transition-all duration-300">
                <Trophy className="w-8 h-8 text-primary drop-shadow-[0_0_10px_currentColor]" />
              </div>
              <h2 className="text-3xl md:text-6xl font-gaming font-bold mb-8">
                Ready to Start <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Winning</span>?
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Join your first tournament today and compete with the best players in India
              </p>
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:to-secondary/90 text-background px-10 py-6 text-lg font-bold rounded-2xl shadow-[0_8px_40px_rgba(0,255,255,0.4)] hover:shadow-[0_12px_60px_rgba(0,255,255,0.6)] hover:scale-105 transition-all duration-300"
              >
                <Link to="/tournaments" className="flex items-center gap-2">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              {/* Trust Footer */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
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
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" />
                  <span>Fair Play Guaranteed</span>
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

export default Home;
