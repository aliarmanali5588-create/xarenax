import { Target, Trophy, Shield, Users, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const AboutUs = () => {
  const values = [
    {
      icon: Target,
      title: "Skill-Based Competition",
      description: "100% skill-based platform where player ability determines outcomes, not luck",
    },
    {
      icon: Trophy,
      title: "Fair Play",
      description: "Transparent rules and equal opportunities for all players in every tournament",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-grade security for your data and transactions. Fully compliant with regulations",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a community of passionate gamers who compete and celebrate achievements",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="modern-container max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-6xl font-gaming font-bold mb-4">
              About NeroXP
            </h1>
            <p className="text-xl text-muted-foreground">
              India's Premier Skill-Based BGMI Tournament Platform
            </p>
          </div>

          {/* Who We Are */}
          <div className="glass-card p-8 md:p-10 mb-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-primary">
              Who We Are
            </h2>
            <div className="space-y-4 text-foreground/80 leading-relaxed text-lg">
              <p>
                NeroXP is a <strong className="text-primary">100% skill-based competitive gaming platform</strong> that connects BGMI players across India. We are <strong>NOT a game of chance or gambling platform</strong>. Every tournament outcome is determined purely by player skill, strategy, and gameplay performance.
              </p>
              <p>
                Our platform enables gamers to showcase their abilities, compete in organized tournaments, and earn rewards based entirely on their gaming skills. We strictly comply with Indian laws and operate as a legitimate skill-gaming platform under applicable regulations.
              </p>
              <p>
                Founded with a mission to professionalize esports in India, NeroXP provides a secure, transparent, and fair environment where talent meets opportunity.
              </p>
            </div>
          </div>

          {/* What We Offer */}
          <div className="glass-card p-8 md:p-10 mb-8">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-primary">
              What We Offer
            </h2>
            <ul className="space-y-4 text-foreground/80">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-xl">✓</span>
                <span className="text-lg"><strong className="text-foreground">Daily Skill-Based Tournaments:</strong> Compete where only your gaming ability matters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-xl">✓</span>
                <span className="text-lg"><strong className="text-foreground">Transparent Prize Distribution:</strong> Winners determined by in-game metrics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-xl">✓</span>
                <span className="text-lg"><strong className="text-foreground">Secure Wallet System:</strong> Safe deposits and instant withdrawals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-xl">✓</span>
                <span className="text-lg"><strong className="text-foreground">Anti-Cheat Measures:</strong> Strict monitoring for fair play</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1 text-xl">✓</span>
                <span className="text-lg"><strong className="text-foreground">24/7 Support:</strong> Dedicated customer support for all queries</span>
              </li>
            </ul>
          </div>

          {/* Our Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-gaming font-bold mb-8 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="glass-card p-6 hover-lift"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="glass-card p-8 md:p-10 mb-8 border-2 border-primary/20">
            <h2 className="text-2xl font-gaming font-bold mb-4 text-primary">
              Legal & Compliance
            </h2>
              <p className="text-foreground/80 leading-relaxed text-lg mb-4">
                NeroXP operates as a <strong className="text-primary">skill-based gaming platform</strong>, which is legal in India. We are <strong>not a gambling platform</strong>. All competitions are based purely on player skill and game performance.
            </p>
            <p className="text-foreground/80 leading-relaxed text-lg">
              Our platform complies with all applicable Indian gaming laws and regulations. We ensure fair play, secure transactions, and responsible gaming practices.
            </p>
          </div>

          {/* Contact Information */}
          <div className="glass-card p-8 md:p-10">
            <h2 className="text-3xl font-gaming font-bold mb-6 text-primary">
              Get In Touch
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:helparenax@zohomail.in" className="text-primary hover:underline">
                    helparenax@zohomail.in
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Location</p>
                  <p className="text-muted-foreground">India</p>
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

export default AboutUs;