import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Trophy, 
  Wallet, 
  Users, 
  Settings,
  LogOut,
  Shield,
  UserPlus,
  CreditCard,
  TrendingUp,
  MessageSquare,
  BarChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ThemeToggle from "@/components/admin/ThemeToggle";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin, loading } = useAuth();

  // CRITICAL SECURITY: Protect admin routes
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast.error("Unauthorized Access");
      navigate("/");
    }
  }, [isAdmin, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Return null if not admin (prevents any rendering)
  if (!isAdmin) {
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Trophy, label: "Tournaments", path: "/admin/tournaments" },
    { icon: BarChart, label: "Analytics", path: "/admin/tournament-analytics" },
    { icon: Wallet, label: "Withdrawals", path: "/admin/withdrawals" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserPlus, label: "Referrals", path: "/admin/referrals" },
    { icon: CreditCard, label: "UTR Verify", path: "/admin/utr" },
    { icon: TrendingUp, label: "Fraud Analytics", path: "/admin/fraud-analytics" },
    { icon: MessageSquare, label: "Support", path: "/admin/support" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />
      
      {/* Sidebar */}
      <aside className="w-64 glass-card border-r border-border/50 flex flex-col relative z-10 shadow-xl">
        
        {/* Admin Brand */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Shield className="h-6 w-6 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-gaming font-bold">
                <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Panel
                </span>
              </h1>
              <p className="text-xs text-muted-foreground">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all hover-lift ${
                  isActive(item.path)
                    ? "bg-primary/20 text-primary border-l-2 border-primary shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "text-foreground hover:bg-primary/10"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-heading">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/30">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover-lift"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            <span className="font-heading">Exit Admin</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Header */}
        <header className="glass-card border-b border-border/50 p-6 shadow-lg sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-gaming font-bold">
                <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Command Center
                </span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your tournament platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="glass-card px-4 py-2 border border-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-gaming font-bold text-primary">
                  SUPER ADMIN
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
