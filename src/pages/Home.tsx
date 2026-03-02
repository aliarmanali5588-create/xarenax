import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Shield, Zap, Clock, ArrowRight, Star, Check, Lock, TrendingUp, Award, Target, Flame, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroBanner from "@/assets/hero-banner.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

/* ====== Animated Counter Hook ====== */
const useCountUp = (end: number, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return { count, ref };
};

/* ====== Smoke Particles Component ====== */
const SmokeParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full opacity-0"
        style={{
          width: `${80 + i * 40}px`,
          height: `${80 + i * 40}px`,
          left: `${10 + i * 15}%`,
          bottom: '0',
          background: `radial-gradient(circle, hsl(25 100% 50% / 0.08), transparent 70%)`,
          animation: `smokeRise ${6 + i * 2}s ease-out infinite`,
          animationDelay: `${i * 1.5}s`,
        }}
      />
    ))}
  </div>
);

/* ====== Fire Sparks Component ====== */
const FireSparks = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-accent"
        style={{
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 30}%`,
          '--spark-x': `${(Math.random() - 0.5) * 60}px`,
          animation: `sparkFloat ${2 + Math.random() * 3}s ease-out infinite`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: 0.8,
        } as React.CSSProperties}
      />
    ))}
  </div>
);

const Home = () => {
  const stats = [
    { label: "Active Players", value: "50K+", numValue: 50000, icon: Users, color: "text-primary" },
    { label: "Prize Distributed", value: "₹25L+", numValue: 2500000, icon: IndianRupee, color: "text-accent" },
    { label: "Tournaments Hosted", value: "500+", numValue: 500, icon: Trophy, color: "text-secondary" },
    { label: "User Rating", value: "4.9", numValue: 4.9, icon: Star, color: "text-accent" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data and transactions protected with military-grade encryption and secure payment gateways",
      gradient: "from-success/20 to-success/5",
      borderColor: "border-success/30",
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Withdraw your winnings instantly to your bank account or UPI within minutes",
      gradient: "from-primary/20 to-primary/5",
      borderColor: "border-primary/30",
    },
    {
      icon: Trophy,
      title: "100% Skill-Based",
      description: "Fair play guaranteed with transparent prize distribution and real-time tournament tracking",
      gradient: "from-accent/20 to-accent/5",
      borderColor: "border-accent/30",
    },
  ];

  const trustBadges = [
    { icon: Shield, text: "100% Skill Based", desc: "No luck, pure talent" },
    { icon: Zap, text: "Instant Withdrawals", desc: "Get paid in minutes" },
    { icon: Lock, text: "Secure Payments", desc: "Bank-grade encryption" },
    { icon: Check, text: "Fair Play", desc: "Anti-cheat systems" },
  ];

  const winners = [
    { name: "ProGamer_X", amount: "₹15,000", game: "BGMI Squad", avatar: "🏆" },
    { name: "SniperKing", amount: "₹8,500", game: "BGMI Solo", avatar: "🎯" },
    { name: "RushTeam", amount: "₹22,000", game: "BGMI Duo", avatar: "⚡" },
    { name: "ClutchMaster", amount: "₹12,000", game: "BGMI TDM", avatar: "🔥" },
  ];

  const playersCount = useCountUp(50000, 2000);
  const prizeCount = useCountUp(25, 2000);
  const tournamentsCount = useCountUp(500, 2000);
  const ratingCount = useCountUp(49, 2000);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <AnnouncementBar />
      <Navbar />

      {/* ======================================
          HERO SECTION - CINEMATIC
          ====================================== */}
      <section className="relative pt-28 pb-32 px-4 overflow-hidden min-h-[95vh] flex items-center noise-overlay">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        {/* Dark Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/75 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
        {/* Radial Glow Behind Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-secondary/10 rounded-full blur-[150px]" />
        
        {/* Smoke & Sparks */}
        <SmokeParticles />
        <FireSparks />
        
        <div className="modern-container relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
            <div className="fade-in-up">
              <Badge className="mb-8 px-6 py-3 text-sm bg-success/10 text-success border-success/30 backdrop-blur-sm hover:bg-success/15 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                <Shield className="w-4 h-4 mr-2" />
                India's Most Trusted BGMI Tournament Platform
              </Badge>
            </div>

            {/* Main Heading - Luxury Typography */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-gaming font-black mb-4 leading-[0.9] fade-in-up" style={{ animationDelay: '0.1s' }}>
              <span className="block text-foreground text-glow-white">COMPETE.</span>
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,90,0,0.5)] py-2">PLAY.</span>
              <span className="block text-foreground text-glow-white">WIN.</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
              Join <span className="text-primary font-bold">50,000+ players</span> competing in fair, skill-based tournaments. 
              Entry from just <span className="text-accent font-bold">₹30</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-12 py-7 text-lg font-bold pulse-glow hover:scale-105 transition-all duration-300 min-w-[260px] btn-luxury animate-float"
              >
                <Link to="/tournaments">
                  <Flame className="mr-2 w-5 h-5" />
                  Browse Tournaments
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="px-12 py-7 text-lg font-semibold border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 min-w-[260px] backdrop-blur-sm animate-neon-border"
              >
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Check, text: "100% Legal" },
                { icon: Lock, text: "Secure Payments" },
                { icon: Users, text: "50,000+ Players" },
                { icon: TrendingUp, text: "₹25L+ Paid Out" },
              ].map((indicator, index) => (
                <div 
                  key={index}
                  className="glass-panel rounded-xl p-3 flex flex-col items-center gap-2 hover:border-primary/30 transition-all duration-300 hover-lift"
                >
                  <indicator.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-center text-muted-foreground">{indicator.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================
          SOCIAL PROOF - ANIMATED COUNTERS
          ====================================== */}
      <section className="py-24 px-4 section-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 to-transparent" />
        <div className="modern-container relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
              Platform Stats
            </Badge>
            <h2 className="text-3xl md:text-5xl font-gaming font-bold">
              Numbers That <span className="text-gradient-gold">Speak</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6" ref={playersCount.ref}>
            {[
              { label: "Active Players", value: playersCount.count.toLocaleString() + "+", icon: Users, suffix: "" },
              { label: "Prize Distributed", value: "₹" + prizeCount.count + "L+", icon: IndianRupee, suffix: "" },
              { label: "Tournaments", value: tournamentsCount.count + "+", icon: Trophy, suffix: "" },
              { label: "User Rating", value: (ratingCount.count / 10).toFixed(1), icon: Star, suffix: "⭐" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-8 text-center group hover-lift"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:glow-primary transition-all duration-500">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-gaming font-bold mb-2 text-gradient-gold">
                  {stat.value} {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          WHY CHOOSE US - FEATURES
          ====================================== */}
      <section className="py-28 px-4 relative">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="modern-container relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-4 px-4 py-2 bg-accent/10 text-accent border-accent/20">
              Why 50,000+ Players Trust Us
            </Badge>
            <h2 className="text-3xl md:text-6xl font-gaming font-bold mb-6">
              Why Choose <span className="text-gradient-gold">TeamFire</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              India's most trusted and secure skill-based gaming platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-10 hover-lift group relative overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} border ${feature.borderColor} flex items-center justify-center group-hover:scale-110 transition-all duration-500`}>
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold mb-4 text-center">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-center">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          TRUST SECTION
          ====================================== */}
      <section className="py-24 px-4 section-light relative overflow-hidden">
        <div className="modern-container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-gaming font-bold mb-4">
              Built on <span className="text-gradient-gold">Trust</span>
            </h2>
            <p className="text-muted-foreground text-lg">Your safety is our top priority</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <div key={index} className="glass-card p-8 text-center hover-lift group">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-500">
                  <badge.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{badge.text}</h3>
                <p className="text-sm text-muted-foreground">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          WINNERS SHOWCASE
          ====================================== */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[200px]" />
        <div className="modern-container relative z-10">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-accent/10 text-accent border-accent/20">
              <Award className="w-3.5 h-3.5 mr-1.5" />
              Recent Winners
            </Badge>
            <h2 className="text-3xl md:text-5xl font-gaming font-bold mb-4">
              Winners <span className="text-gradient-gold">Spotlight</span>
            </h2>
            <p className="text-muted-foreground text-lg">Real players, real winnings</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {winners.map((winner, index) => (
              <div key={index} className="glass-card p-8 text-center hover-lift group relative overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Spotlight effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-accent/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{winner.avatar}</div>
                  <h3 className="text-lg font-heading font-bold mb-1">{winner.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{winner.game}</p>
                  <div className="text-2xl font-gaming font-bold text-gradient-gold">{winner.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================
          CTA SECTION - PREMIUM
          ====================================== */}
      <section className="py-28 px-4 section-light">
        <div className="modern-container">
          <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden border-glow">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[150px]" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/30 flex items-center justify-center animate-float">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl md:text-6xl font-gaming font-bold mb-8">
                Ready to Start <span className="text-gradient-gold">Winning</span>?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Join your first tournament today and compete with the best players in India
              </p>
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-primary via-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-12 py-7 text-lg font-bold rounded-2xl pulse-glow hover:scale-105 transition-all duration-300 btn-luxury"
              >
                <Link to="/tournaments" className="flex items-center gap-3">
                  <Flame className="w-5 h-5" />
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              
              {/* Trust Footer */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Instant Withdrawal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
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
