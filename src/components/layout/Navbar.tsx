import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, User, Trophy, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import teamfireLogo from "@/assets/teamfire-logo-new.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "Tournaments", path: "/tournaments", icon: Trophy },
    { name: "Leaderboard", path: "/leaderboard", icon: Award },
    { name: "Affiliate", path: "/affiliate", icon: Users },
    { name: "How It Works", path: "/how-it-works", icon: null },
    { name: "Support", path: "/support/faq", icon: null },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.3),0_1px_0_rgba(255,120,0,0.1)]' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="relative">
              <img 
                src={teamfireLogo} 
                alt="TeamFire" 
                className="h-11 w-11 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(255,120,0,0.5)]" 
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl md:text-3xl font-gaming font-bold">
              <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Team</span>
              <span className="text-secondary">Fire</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-all duration-300 font-medium text-sm link-underline"
                activeClassName="text-primary bg-primary/10"
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden lg:flex items-center gap-2">
                <NotificationBell />
                <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10 hover:text-primary transition-colors">
                  <Link to="/wallet">
                    <Wallet className="w-5 h-5" />
                  </Link>
                </Button>
                <UserMenu />
                <Button variant="neon" size="sm" asChild className="pulse-glow hover:scale-105 transition-all duration-300 btn-luxury">
                  <Link to="/tournaments">Join Now</Link>
                </Button>
              </div>
            )}

            {!user && (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="outline" size="sm" asChild className="border-border/50 hover:border-primary/40">
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="gaming" size="sm" asChild className="animate-neon-border btn-luxury">
                  <Link to="/signup">Signup</Link>
                </Button>
              </div>
            )}

            {user && (
              <div className="flex lg:hidden items-center gap-2">
                <NotificationBell />
                <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                  <Link to="/wallet">
                    <Wallet className="w-5 h-5" />
                  </Link>
                </Button>
                <UserMenu />
              </div>
            )}

            {!user && (
              <div className="flex lg:hidden items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            <button
              className="lg:hidden p-2 text-foreground hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border/20 animate-in slide-in-from-top-2 duration-200 bg-background/95 backdrop-blur-xl rounded-b-2xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </div>
              </Link>
            ))}
            
            {user && (
              <div className="border-t border-border/20 pt-3 mt-3 space-y-2 px-4">
                <Button variant="outline" size="sm" className="w-full justify-start sm:hidden" asChild>
                  <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start sm:hidden" asChild>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button variant="neon" size="sm" className="w-full" asChild>
                  <Link to="/tournaments" onClick={() => setMobileMenuOpen(false)}>
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Tournament
                  </Link>
                </Button>
              </div>
            )}

            {!user && (
              <div className="border-t border-border/20 pt-3 mt-3 space-y-2 px-4">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="gaming" size="sm" className="w-full" asChild>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Signup
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
