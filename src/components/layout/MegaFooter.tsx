import { Link } from "react-router-dom";
import { MapPin, Send, Trophy, Shield, Zap, ChevronRight } from "lucide-react";
import teamfireLogo from "@/assets/teamfire-logo-new.png";

const MegaFooter = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Tournaments", path: "/tournaments" },
        { name: "Leaderboard", path: "/leaderboard" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Affiliate Program", path: "/affiliate" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", path: "/support/faq" },
        { name: "Contact Us", path: "/support/contact" },
        { name: "Telegram Support", path: "https://t.me/+6IoFwhsuUkEzMGM9", external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/legal/privacy" },
        { name: "Terms & Conditions", path: "/legal/terms" },
        { name: "Refund Policy", path: "/legal/refund" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border/20 bg-gradient-to-b from-card/20 to-background mt-12 md:mt-20 relative overflow-hidden">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      
      <div className="modern-container py-10 md:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <img 
                src={teamfireLogo} 
                alt="TeamFire" 
                className="h-16 w-16 rounded-xl transition-transform group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,120,0,0.4)]"
              />
              <span className="text-2xl font-gaming font-bold">
                <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Team</span>
                <span className="text-secondary">Fire</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm">
              India's most trusted BGMI tournament platform. Join thousands of players competing for real prizes.
            </p>
            
            {/* Contact - Telegram only */}
            <div className="space-y-3">
              <a 
                href="https://t.me/+6IoFwhsuUkEzMGM9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all duration-300 group/link"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/link:bg-primary/20 group-hover/link:border-primary/40 transition-all duration-300">
                  <Send className="w-5 h-5 text-primary" />
                </div>
                <span className="link-underline">Join Telegram Support</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>India</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex gap-3 mt-8">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-success text-xs font-medium">
                <Shield className="w-3.5 h-3.5" />
                Secure
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
                <Zap className="w-3.5 h-3.5" />
                Instant Pay
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                <Trophy className="w-3.5 h-3.5" />
                Fair Play
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-lg font-bold mb-6 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group/item"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover/item:opacity-100 group-hover/item:ml-0 transition-all duration-300 text-primary" />
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 group/item"
                      >
                        <ChevronRight className="w-3 h-3 opacity-0 -ml-5 group-hover/item:opacity-100 group-hover/item:ml-0 transition-all duration-300 text-primary" />
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-muted-foreground">
            <p className="mb-1 text-sm">
              © {new Date().getFullYear()} <span className="text-primary font-bold">TeamFire</span>. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Play responsibly • 18+ Only • Skill-based gaming platform
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/20 text-success text-sm font-semibold">
              100% Secure
            </div>
            <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              Fair Play
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MegaFooter;
