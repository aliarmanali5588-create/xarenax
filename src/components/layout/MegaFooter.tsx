import { Link } from "react-router-dom";
import { Trophy, Mail, MapPin, Instagram, Twitter, Youtube } from "lucide-react";
import TelegramIcon from "../icons/TelegramIcon";

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
    <footer className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background/95" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDMwYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzAwZmZmZiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDUiLz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="relative z-10 border-t-2 border-primary/20">
        {/* Top Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="w-14 h-14 md:w-16 md:h-16 gradient-gaming rounded-2xl flex items-center justify-center neon-glow-multi transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-2xl">
                  <Trophy className="w-8 h-8 md:w-9 md:h-9 text-background" />
                </div>
                <div>
                  <span className="text-3xl md:text-4xl font-gaming font-bold text-gradient-gaming block">
                    Arena<span className="text-secondary">X</span>
                  </span>
                  <span className="text-xs text-primary/70 uppercase tracking-wider font-bold">Esports Platform</span>
                </div>
              </Link>
              <p className="text-base md:text-lg text-foreground/80 mb-6 leading-relaxed font-medium">
                India's most trusted <span className="text-primary font-bold">PUBG/BGMI tournament platform</span>. Join thousands of players competing for real prizes in fair and transparent competitions.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3 text-sm md:text-base">
                <a 
                  href="mailto:helparenax@zohomail.in"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <span>helparenax@zohomail.in</span>
                </a>
                <a 
                  href="https://t.me/+6IoFwhsuUkEzMGM9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <TelegramIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span>Join Telegram Community</span>
                </a>
                <div className="flex items-center gap-3 text-foreground/80">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <span>Jaipur, Rajasthan, India</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-gaming text-xl md:text-2xl font-bold mb-5 text-gradient-gaming">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.path}
                          className="text-base text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="text-base text-foreground/70 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block group"
                        >
                          <span className="relative">
                            {link.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                          </span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Social Media & Newsletter Section */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 mb-8 border-2 border-primary/20 hover-glow-intense">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl md:text-2xl font-gaming font-bold text-gradient-gaming mb-2">
                  Join the Community
                </h4>
                <p className="text-foreground/70">Stay updated with latest tournaments and prizes</p>
              </div>
              <div className="flex gap-4">
                <a 
                  href="https://t.me/+6IoFwhsuUkEzMGM9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl gradient-gaming flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                >
                  <TelegramIcon className="w-6 h-6 text-background" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all shadow-lg"
                >
                  <Instagram className="w-6 h-6 text-primary" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all shadow-lg"
                >
                  <Twitter className="w-6 h-6 text-primary" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all shadow-lg"
                >
                  <Youtube className="w-6 h-6 text-primary" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t-2 border-border/30">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="text-foreground/70">
                <p className="text-base font-medium mb-1">
                  © {new Date().getFullYear()} <span className="text-primary font-bold">ArenaX</span>. All rights reserved.
                </p>
                <p className="text-sm text-foreground/50">
                  Play responsibly • Only for users 18+ • Skill-based gaming platform
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-lg glass-panel border border-primary/30">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">100% Secure</span>
                </div>
                <div className="px-4 py-2 rounded-lg glass-panel border border-secondary/30">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Fair Play</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MegaFooter;
