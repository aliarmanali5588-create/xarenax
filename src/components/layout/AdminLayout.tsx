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
        <div className="w-12 h-12 border-4 border-admin-gold border-t-transparent rounded-full animate-spin"></div>
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
      <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-admin-red/20 flex flex-col relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-admin-gold/5 via-transparent to-admin-red/5 pointer-events-none" />
        
        {/* Admin Brand */}
        <div className="p-6 border-b border-admin-red/20 relative">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-admin-gold animate-pulse" />
              <div className="absolute inset-0 bg-admin-gold/20 blur-xl rounded-full" />
            </div>
            <div>
              <h1 className="text-xl font-gaming font-bold bg-gradient-to-r from-admin-gold via-admin-red to-admin-gold bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">God Mode Active</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 relative">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all relative group ${
                  isActive(item.path)
                    ? "bg-admin-gold/10 text-admin-gold border border-admin-gold/30"
                    : "text-foreground hover:bg-muted/50 hover:text-admin-gold"
                }`}
              >
                <item.icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.label}</span>
                {!isActive(item.path) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-admin-gold/0 via-admin-gold/5 to-admin-gold/0 opacity-0 group-hover:opacity-100 transition-opacity rounded" />
                )}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-admin-red/20 relative">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 group relative overflow-hidden"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Exit Admin</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        {/* Header */}
        <header className="bg-card/30 backdrop-blur-xl border-b border-admin-red/20 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-admin-gold/5 via-transparent to-admin-red/5 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h2 className="text-2xl font-gaming font-bold bg-gradient-to-r from-foreground via-admin-gold to-foreground bg-clip-text text-transparent">
                Command Center
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your tournament platform
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="px-4 py-2 bg-card/50 border border-border rounded-lg">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-bold text-admin-gold">
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
