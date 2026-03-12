import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "tournaments", label: "Tournaments" },
  { key: "tournament-analytics", label: "Tournament Analytics" },
  { key: "withdrawals", label: "Withdrawals" },
  { key: "users", label: "Users" },
  { key: "referrals", label: "Referrals" },
  { key: "utr", label: "UTR Verify" },
  { key: "fraud-analytics", label: "Fraud Analytics" },
  
  { key: "settings", label: "Settings" },
];

interface SubAdmin {
  id: string;
  email: string;
  display_name: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
}

const ManageAdmins = () => {
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from("sub_admins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubAdmins((data as SubAdmin[]) || []);
    } catch (error: any) {
      console.error("Error fetching sub-admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (key: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const selectAll = () => {
    if (selectedPermissions.length === ALL_PERMISSIONS.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(ALL_PERMISSIONS.map((p) => p.key));
    }
  };

  const handleCreate = async () => {
    if (!email || !password || !displayName) {
      toast.error("Email, password aur name required hai!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password kam se kam 6 characters ka hona chahiye!");
      return;
    }
    if (selectedPermissions.length === 0) {
      toast.error("Kam se kam ek permission select karo!");
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-sub-admin", {
        body: {
          email,
          password,
          display_name: displayName,
          permissions: selectedPermissions,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`${displayName} ko admin bana diya gaya!`);
      setEmail("");
      setPassword("");
      setDisplayName("");
      setSelectedPermissions([]);
      fetchSubAdmins();
    } catch (error: any) {
      let errorMessage = error?.message || "Sub-admin create karne me error aaya";

      if (error?.context) {
        try {
          const parsed = await error.context.json();
          if (parsed?.error) {
            errorMessage = parsed.error;
          }
        } catch {
          // ignore parse failure
        }
      }

      toast.error(errorMessage);
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("delete-sub-admin", {
        body: { sub_admin_id: id },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`${name} ko remove kar diya gaya!`);
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error.message || "Delete karne me error aaya");
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke("update-sub-admin", {
        body: { sub_admin_id: id, is_active: !currentActive },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(currentActive ? "Admin deactivate ho gaya" : "Admin activate ho gaya");
      fetchSubAdmins();
    } catch (error: any) {
      toast.error(error.message || "Update karne me error aaya");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Sub-Admin */}
      <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-gaming text-primary">
              Create New Admin
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Display Name (YouTuber Name)</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Dynamo Gaming"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youtuber@gmail.com"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                  className="bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Permission Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Permissions (Kya dikhega?)</Label>
              <Button variant="outline" size="sm" onClick={selectAll}>
                {selectedPermissions.length === ALL_PERMISSIONS.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {ALL_PERMISSIONS.map((perm) => (
                <label
                  key={perm.key}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPermissions.includes(perm.key)
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-background/30 hover:border-primary/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedPermissions.includes(perm.key)}
                    onCheckedChange={() => togglePermission(perm.key)}
                  />
                  <span className="text-sm font-medium">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={creating}
            className="w-full md:w-auto"
            variant="gaming"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {creating ? "Creating..." : "Create Admin"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Sub-Admins */}
      <Card className="bg-card/50 backdrop-blur-xl border-secondary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-secondary" />
            <CardTitle className="text-xl font-gaming text-secondary">
              Existing Admins ({subAdmins.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : subAdmins.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Abhi tak koi sub-admin nahi hai. Upar se create karo!
            </p>
          ) : (
            <div className="space-y-4">
              {subAdmins.map((admin) => (
                <div
                  key={admin.id}
                  className={`p-4 rounded-lg border transition-all ${
                    admin.is_active
                      ? "border-primary/20 bg-primary/5"
                      : "border-destructive/20 bg-destructive/5 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-gaming font-bold text-lg">{admin.display_name}</h3>
                        <Badge variant={admin.is_active ? "default" : "destructive"}>
                          {admin.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{admin.email}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {admin.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs">
                            {ALL_PERMISSIONS.find((p) => p.key === perm)?.label || perm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(admin.id, admin.is_active)}
                      >
                        {admin.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {admin.display_name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ye action permanently {admin.display_name} ka account delete kar dega. Ye undo nahi ho sakta.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(admin.id, admin.display_name)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAdmins;
