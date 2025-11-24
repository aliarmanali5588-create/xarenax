import { Target, Trophy, Shield, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: "Skill-Based Competition",
      description: "We provide a 100% skill-based gaming platform where player ability determines outcomes, not chance or luck.",
    },
    {
      icon: Trophy,
      title: "Fair Play",
      description: "Every tournament is designed to ensure fair competition with transparent rules and equal opportunities for all players.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data and transactions are protected with bank-grade security. We comply with all Indian gaming regulations.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "We're building a community of passionate gamers who compete, improve, and celebrate skill-based achievements.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              About ArenaX
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              India's Premier Skill-Based PUBG/BGMI Tournament Platform
            </p>
          </div>

          {/* Who We Are */}
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-glow-cyan">
              Who We Are
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                ArenaX is a <strong className="text-foreground">100% skill-based competitive gaming platform</strong> that connects PUBG and BGMI players across India. We are NOT a game of chance or gambling platform. Every tournament outcome is determined purely by player skill, strategy, and gameplay performance.
              </p>
              <p>
                Our platform enables gamers to showcase their abilities, compete in organized tournaments, and earn rewards based entirely on their gaming skills. We strictly comply with Indian laws and operate as a legitimate skill-gaming platform under applicable regulations.
              </p>
              <p>
                Founded with a mission to professionalize esports in India, ArenaX provides a secure, transparent, and fair environment where talent meets opportunity.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="glass-panel rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-glow-cyan">
              What We Offer
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Daily Skill-Based Tournaments:</strong> Compete in organized matches where only your gaming ability matters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Transparent Prize Distribution:</strong> Winners are determined by in-game performance metrics (kills, rank, survival time)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Secure Wallet System:</strong> Safe deposits and instant withdrawals with multiple payment options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">Anti-Cheat Measures:</strong> Strict monitoring to ensure fair play and competitive integrity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span><strong className="text-foreground">24/7 Support:</strong> Dedicated customer support for all your queries and concerns</span>
              </li>
            </ul>
          </div>

          {/* Our Values */}
          <div className="mb-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-center text-glow-cyan">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="glass-panel rounded-xl p-6 hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300"
                >
                  <div className="w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan">
                    <value.icon className="w-6 h-6 text-background" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Compliance */}
          <div className="glass-panel rounded-2xl p-8 mb-8 border-2 border-primary/30">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-glow-cyan">
              Legal & Compliance
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-foreground font-semibold">
                ⚖️ ArenaX is a Skill-Based Gaming Platform - NOT Gambling
              </p>
              <p>
                We operate in full compliance with Indian laws and regulations governing skill-based gaming. Our tournaments are games of skill where outcomes are determined by player performance, not random chance. We do not offer any form of gambling, betting, or games of chance.
              </p>
              <p>
                All tournaments require players to demonstrate knowledge, strategy, and proficiency in PUBG/BGMI gameplay. Winners are selected based on measurable skill metrics such as kills, rank placement, and survival time.
              </p>
              <p className="text-sm italic">
                Players must be 18 years or older. Residents of restricted states (as per local regulations) are not permitted to participate in cash tournaments.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="glass-panel rounded-xl p-6 text-center">
            <h3 className="font-heading font-bold text-lg mb-4">
              Get in Touch
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Have questions? We're here to help!
            </p>
            <div className="flex flex-col gap-2 items-center">
              <p className="text-foreground">
                Email:{" "}
                <a
                  href="mailto:helparenax@zohomail.in"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  helparenax@zohomail.in
                </a>
              </p>
              <p className="text-foreground">Location: Mumbai, Maharashtra, India</p>
            </div>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default AboutUs;
