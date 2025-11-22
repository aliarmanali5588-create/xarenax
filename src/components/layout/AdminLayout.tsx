import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  Trophy, 
  Wallet, 
  Users, 
  Settings,
  LogOut,
  Shield,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
    { icon: Wallet, label: "Withdrawals", path: "/admin/withdrawals" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: UserPlus, label: "Referrals", path: "/admin/referrals" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card/50 backdrop-blur-xl border-r border-admin-red/20 flex flex-col">
        {/* Admin Brand */}
        <div className="p-6 border-b border-admin-red/20">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-admin-gold" />
            <div>
              <h1 className="text-xl font-gaming font-bold text-admin-gold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">God Mode Active</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 transition-all ${
                  isActive(item.path)
                    ? "bg-admin-red/20 text-admin-gold border border-admin-gold/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                    : "text-foreground hover:bg-admin-red/10 hover:text-admin-gold"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-admin-red/20">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
            onClick={signOut}
          >
            <LogOut className="h-5 w-5" />
            Exit Admin
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card/30 backdrop-blur-xl border-b border-admin-red/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-gaming font-bold text-foreground">
                Command Center
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your tournament platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-admin-red/20 border border-admin-red/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-bold text-admin-gold">SUPER ADMIN</p>
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
