import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import TelegramIcon from "../icons/TelegramIcon";
import trophyIcon from "@/assets/trophy-icon.png";

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
        { name: "Telegram Support", path: "https://t.me/helparenaxesports", external: true },
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
    <footer className="border-t border-border/30 bg-card/30 mt-20">
      <div className="modern-container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6 group">
              <img 
                src={trophyIcon} 
                alt="ArenaX" 
                className="h-16 w-16 rounded-xl transition-transform group-hover:scale-110"
              />
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              India's most trusted PUBG/BGMI tournament platform. Join thousands of players competing for real prizes.
            </p>
            
            {/* Trust Indicators */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold text-foreground">100% Secure</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold text-foreground">Verified Platform</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span><span className="font-bold text-primary">10,000+</span> Trusted Players</span>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:helparenax@zohomail.in"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>helparenax@zohomail.in</span>
              </a>
              <a 
                href="https://t.me/+6IoFwhsuUkEzMGM9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <TelegramIcon className="w-5 h-5" />
                <span>Join Telegram</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-lg font-bold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="text-muted-foreground">
            <p className="mb-1">
              © {new Date().getFullYear()} <span className="text-primary font-bold">ArenaX</span>. All rights reserved.
            </p>
            <p className="text-sm">
              Play responsibly • 18+ Only • Skill-based gaming platform
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-success/10 text-success text-sm font-semibold">
              100% Secure
            </div>
            <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold">
              Fair Play
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MegaFooter;
