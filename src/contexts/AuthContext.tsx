import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const SUPER_ADMIN_EMAILS = ['ashadislam333@gmail.com', 'selfashad@gmail.com'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  permissions: string[];
  loading: boolean;
  signUp: (email: string, password: string, username: string, ign: string, bgmiId: string, deviceId?: string, signupIp?: string, referralCode?: string) => Promise<{ data: any, error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const ALL_PERMISSIONS = [
    'dashboard', 'tournaments', 'tournament-analytics', 'withdrawals',
    'users', 'referrals', 'utr', 'fraud-analytics', 'support', 'settings', 'manage-admins'
  ];

  const checkRolesAndPermissions = async (userId: string, userEmail?: string) => {
    try {
      const isSuperAdminUser = SUPER_ADMIN_EMAILS.includes(userEmail || '');
      
      if (isSuperAdminUser) {
        setIsAdmin(true);
        setIsSuperAdmin(true);
        setPermissions(ALL_PERMISSIONS);
        return;
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (roleData) {
        setIsAdmin(true);
        // Fetch sub-admin permissions
        const { data: subAdminData } = await supabase
          .from("sub_admins")
          .select("permissions, is_active")
          .eq("user_id", userId)
          .single();

        if (subAdminData && subAdminData.is_active) {
          setPermissions(subAdminData.permissions as string[]);
        } else {
          setPermissions([]);
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setPermissions([]);
      }
    } catch (error) {
      console.error("Error checking roles:", error);
      setIsAdmin(false);
      setIsSuperAdmin(false);
      setPermissions([]);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            checkRolesAndPermissions(session.user.id, session.user.email || undefined);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsSuperAdmin(false);
          setPermissions([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkRolesAndPermissions(session.user.id, session.user.email || undefined);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string, password: string, username: string, ign: string, bgmiId: string,
    deviceId?: string, signupIp?: string, referralCode?: string
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: redirectUrl }
      });

      if (error) return { data, error };
      if (!data.user) return { data: null, error: new Error("Signup failed") };

      let referredById = null;
      if (referralCode) {
        const { data: referrerUuid } = await supabase.rpc('get_referrer_id', { code: referralCode.toUpperCase() });
        if (referrerUuid) referredById = referrerUuid;
      }

      const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error: profileError } = await supabase.rpc('create_user_profile', {
        p_user_id: data.user.id, p_username: username, p_ign: ign, p_bgmi_id: bgmiId,
        p_device_id: deviceId || '', p_signup_ip: signupIp || '',
        p_referral_code: newReferralCode, p_referred_by: referredById
      });

      if (profileError) {
        return { data: null, error: new Error(`Profile creation failed: ${profileError.message}`) };
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };

      if (data.user) {
        await checkRolesAndPermissions(data.user.id, data.user.email || undefined);
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setPermissions([]);
    navigate("/auth");
  };

  const value = {
    user, session, isAdmin, isSuperAdmin, permissions, loading,
    signUp, signIn, signOut,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
