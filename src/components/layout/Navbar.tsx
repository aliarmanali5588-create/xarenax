import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Wallet, User, Trophy, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import navbarLogo from "@/assets/navbar-logo.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Tournaments", path: "/tournaments", icon: Trophy },
    { name: "Leaderboard", path: "/leaderboard", icon: Award },
    { name: "Affiliate", path: "/affiliate", icon: Users },
    { name: "How It Works", path: "/how-it-works", icon: null },
    { name: "Support", path: "/support/faq", icon: null },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={navbarLogo} 
              alt="ArenaX" 
              className="h-12 w-12 object-contain transition-all duration-300 group-hover:scale-110" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors font-medium text-sm"
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
            {/* Desktop Actions - Authenticated */}
            {user && (
              <div className="hidden lg:flex items-center gap-2">
                <NotificationBell />
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/wallet">
                    <Wallet className="w-5 h-5" />
                  </Link>
                </Button>
                <UserMenu />
                <Button variant="neon" size="sm" asChild>
                  <Link to="/tournaments">Join Now</Link>
                </Button>
              </div>
            )}

            {/* Desktop Actions - Guest */}
            {!user && (
              <div className="hidden lg:flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="gaming" size="sm" asChild>
                  <Link to="/signup">Signup</Link>
                </Button>
              </div>
            )}

            {/* Mobile Icons (Tablet and below) - Authenticated */}
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

            {/* Mobile Icons - Guest */}
            {!user && (
              <div className="flex lg:hidden items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
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
          <div className="lg:hidden py-4 space-y-2 border-t border-border/30 animate-in slide-in-from-top-2 duration-200 bg-[#050b14]/95 backdrop-blur-xl">
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
            
            {/* Authenticated User Actions */}
            {user && (
              <div className="border-t border-border/30 pt-3 mt-3 space-y-2 px-4">
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

            {/* Guest Actions */}
            {!user && (
              <div className="border-t border-border/30 pt-3 mt-3 space-y-2 px-4">
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
