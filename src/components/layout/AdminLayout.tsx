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
import ParticlesBackground from "@/components/admin/ParticlesBackground";
import ThemeToggle from "@/components/admin/ThemeToggle";
import ParticleSettings, { ParticleConfig } from "@/components/admin/ParticleSettings";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin, loading } = useAuth();
  
  // Particle settings state
  const [particleConfig, setParticleConfig] = useState<ParticleConfig>(() => {
    const saved = localStorage.getItem("admin-particle-config");
    return saved
      ? JSON.parse(saved)
      : { count: 30, speed: 0.5, colorScheme: "gold-red", enabled: true, particleSize: 2.5, connectionDistance: 120 };
  });

  // Performance tracking state
  const [fps, setFps] = useState<number>(0);
  const [particleCount, setParticleCount] = useState<number>(0);

  const handleFpsUpdate = (newFps: number, count: number) => {
    setFps(newFps);
    setParticleCount(count);
  };

  // Save particle config to localStorage
  useEffect(() => {
    localStorage.setItem("admin-particle-config", JSON.stringify(particleConfig));
  }, [particleConfig]);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-admin-primary border-t-transparent rounded-full animate-spin"></div>
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
    <div className="min-h-screen bg-background flex relative">
      {/* Animated Particles Background */}
      <ParticlesBackground config={particleConfig} onFpsUpdate={handleFpsUpdate} />
      
      {/* Particle Settings Panel */}
      <ParticleSettings 
        config={particleConfig} 
        onChange={setParticleConfig}
        fps={fps}
        particleCount={particleCount}
      />
      
      {/* Sidebar */}
      <aside className="w-64 bg-card/30 backdrop-blur-xl border-r border-border/30 flex flex-col relative z-10">
        
        {/* Admin Brand */}
        <div className="p-6 border-b border-border/30 relative">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-admin-primary" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">Command Center</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 relative">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all ${
                  isActive(item.path)
                    ? "bg-admin-primary/10 text-admin-primary border-l-2 border-admin-primary"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/30 relative">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            <span>Exit Admin</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Header */}
        <header className="bg-card/20 backdrop-blur-xl border-b border-border/30 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Command Center
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your tournament platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="px-4 py-2 bg-card/50 border border-border/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-bold text-admin-primary">
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
