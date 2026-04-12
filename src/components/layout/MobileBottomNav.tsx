import { Link, useLocation } from "react-router-dom";
import { Trophy, Wallet, User, Award, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show on auth pages or admin pages
  if (location.pathname.includes("/login") || 
      location.pathname.includes("/signup") || 
      location.pathname.includes("/admin")) {
    return null;
  }

  // Don't show if not authenticated
  if (!user) {
    return null;
  }

  const navItems = [
    { name: "Tournaments", path: "/tournaments", icon: Trophy },
    { name: "Leaderboard", path: "/leaderboard", icon: Award },
    { name: "Affiliate", path: "/affiliate", icon: Users },
    { name: "Wallet", path: "/wallet", icon: Wallet },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/30 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 transition-all min-h-[44px] ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
              <span className={`text-[10px] font-medium ${active ? "font-bold" : ""}`}>
                {item.name}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
