import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only synchronous state updates here
        setSession(session);
        setUser(session?.user ?? null);

        // Defer admin check with setTimeout to avoid blocking
        if (session?.user) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      // Get user email for super admin check
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      // Hardcoded super admin access
      if (currentUser?.email === 'ashadislam333@gmail.com') {
        setIsAdmin(true);
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    username: string, 
    ign: string, 
    bgmiId: string,
    deviceId?: string,
    signupIp?: string,
    referralCode?: string
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      // Step 1: Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        }
      });

      if (error) return { data, error };
      if (!data.user) return { data: null, error: new Error("Signup failed") };

      // Step 2: Get referrer ID if referral code provided
      let referredById = null;
      if (referralCode) {
        const { data: referrerUuid } = await supabase.rpc(
          'get_referrer_id', 
          { code: referralCode.toUpperCase() }
        );
        if (referrerUuid) referredById = referrerUuid;
      }

      // Step 3: Generate unique referral code
      const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Step 4: Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username: username,
          ign: ign,
          bgmi_id: bgmiId,
          device_id: deviceId || null,
          signup_ip: signupIp || null,
          last_ip: signupIp || null,
          wallet_balance: 0,
          bonus_balance: 0,
          referral_code: newReferralCode,
          referred_by: referredById,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return { data: null, error: new Error(`Profile creation failed: ${profileError.message}`) };
      }

      // Step 5: Assign user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: data.user.id,
          role: 'user',
        });

      if (roleError) {
        console.error("Role assignment failed:", roleError);
      }

      // Step 6: Credit referral bonus if applicable
      if (referredById) {
        try {
          await supabase.rpc('credit_referral_bonus', {
            referrer_id: referredById,
            new_user_name: username
          });
        } catch (refError) {
          console.error("Referral bonus error:", refError);
          // Don't fail signup if referral bonus fails
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error };

      // Check if user is admin
      if (data.user) {
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (roleData) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    navigate("/auth");
  };

  const value = {
    user,
    session,
    isAdmin,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
