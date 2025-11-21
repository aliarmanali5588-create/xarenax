import { Link } from "react-router-dom";
import { Trophy, Mail, MapPin } from "lucide-react";
import TelegramIcon from "../icons/TelegramIcon";

const MegaFooter = () => {
  const footerSections = [
    {
      title: "Platform",
      links: [
        { name: "Tournaments", path: "/tournaments" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Affiliate Program", path: "/affiliate" },
        { name: "Wallet", path: "/wallet" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", path: "/support/faq" },
        { name: "Contact Us", path: "/support/contact" },
        { name: "WhatsApp Support", path: "#", external: true },
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
    <footer className="bg-gradient-to-b from-background to-card border-t border-border/30 mt-16 md:mt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Main Footer Content - MOBILE FIRST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center neon-glow-cyan transition-all duration-300 group-hover:scale-110">
                <Trophy className="w-6 h-6 md:w-7 md:h-7 text-background" />
              </div>
              <span className="text-2xl md:text-3xl font-gaming font-bold text-glow-cyan">
                Arena<span className="text-secondary">X</span>
              </span>
            </Link>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 leading-relaxed">
              India's most trusted PUBG/BGMI tournament platform. Join thousands of players competing for real prizes in fair and transparent competitions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 md:mt-1 text-primary flex-shrink-0" />
                <span>helparenax@zohomail.in</span>
              </div>
              <a 
                href="https://t.me/+6IoFwhsuUkEzMGM9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <TelegramIcon className="w-4 h-4 mt-0.5 md:mt-1 text-primary flex-shrink-0" />
                <span>Join our Telegram Community</span>
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 md:mt-1 text-primary flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading text-base md:text-lg font-bold mb-3 md:mb-4 text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.path}
                        className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors"
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
        <div className="pt-4 md:pt-6 border-t border-border/30 text-center text-xs md:text-sm text-muted-foreground px-2">
          <p className="mb-2">
            © {new Date().getFullYear()} ArenaX. All rights reserved.
          </p>
          <p className="text-xs">
            Play responsibly. Only for users 18+. Skill-based gaming platform compliant with applicable laws.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MegaFooter;
