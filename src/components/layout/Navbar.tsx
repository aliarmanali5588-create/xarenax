import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, User, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Tournaments", path: "/tournaments", icon: Trophy },
    { name: "Affiliate", path: "/affiliate", icon: Users },
    { name: "How It Works", path: "/how-it-works", icon: null },
    { name: "Support", path: "/support/faq", icon: null },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center neon-glow-cyan transition-all duration-300 group-hover:scale-110">
              <Trophy className="w-6 h-6 text-background" />
            </div>
            <span className="text-2xl font-gaming font-bold text-glow-cyan">
              Arena<span className="text-secondary">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors font-medium"
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
          <div className="hidden md:flex items-center space-x-3">
            <NotificationBell />
            <Button variant="ghost" size="icon" asChild>
              <Link to="/wallet">
                <Wallet className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="neon" size="sm" asChild>
              <Link to="/tournaments">Join Now</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border/30">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-md transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </div>
              </Link>
            ))}
            <div className="flex gap-2 px-4 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/wallet" onClick={() => setMobileMenuOpen(false)}>
                  <Wallet className="w-4 h-4 mr-2" />
                  Wallet
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
