import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Mail, Lock, User, Gamepad2, Hash } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { getDeviceFingerprint } from "@/lib/deviceFingerprint";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  ign: z.string().min(3, "IGN must be at least 3 characters").max(30, "IGN must be less than 30 characters"),
  bgmiId: z.string().min(5, "BGMI ID must be at least 5 digits").max(20, "BGMI ID must be less than 20 digits").regex(/^\d+$/, "BGMI ID must contain only numbers"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Redirect logged-in users away from auth pages
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Determine default tab based on URL path
  const isSignupRoute = window.location.pathname === '/signup';
  const [activeTab, setActiveTab] = useState(isSignupRoute ? "signup" : "login");
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ email: "", password: "", confirmPassword: "", username: "", ign: "", bgmiId: "" });
  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Auto-fill referral code from URL
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref.toUpperCase());
      toast.info(`Referral code ${ref.toUpperCase()} applied!`, {
        description: "You'll get special bonuses when you sign up"
      });
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      loginSchema.parse(loginForm);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before logging in");
        } else {
          toast.error(error.message || "Login failed");
        }
      } else if (data.user) {
        // Super Admin redirection
        if (data.user.email === 'ashadislam333@gmail.com') {
          console.log("Super Admin Detected. Redirecting...");
          toast.success("Welcome back, Commander! 🫡");
          navigate('/admin/dashboard');
        } else {
          console.log("Regular user detected. Redirecting to dashboard...");
          toast.success("Login Successful!");
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      signupSchema.parse(signupForm);
      setLoading(true);
      
      // Validate referral code if provided
      if (referralCode && referralCode.trim() !== "") {
        const { data: isValid, error: rpcError } = await supabase.rpc('is_referral_valid', { 
          code: referralCode 
        });
        
        if (rpcError) {
          toast.error("Failed to validate referral code");
          setLoading(false);
          return;
        }
        
        if (!isValid) {
          toast.error("Invalid Referral Code", {
            description: "The referral code you entered does not exist. Please check and try again.",
            duration: 5000,
          });
          setLoading(false);
          return;
        }
      }
      
      // Capture device fingerprint for anti-fraud tracking
      const { deviceId, ip } = await getDeviceFingerprint();
      
      const { data, error } = await signUp(
        signupForm.email, 
        signupForm.password, 
        signupForm.username, 
        signupForm.ign, 
        signupForm.bgmiId,
        deviceId,
        ip || undefined,
        referralCode || undefined
      );
      
      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("An account with this email already exists");
        } else if (error.message.includes("Maximum account limit reached")) {
          toast.error("Maximum account limit reached for this device", {
            description: "Please log in to your existing account",
            duration: 5000,
          });
        } else {
          toast.error(error.message || "Signup failed");
        }
      } else {
        // Check if email verification is required
        if (data.user && !data.session) {
          // Email verification required
          toast.success("Verification link sent!", {
            description: "Please check your email to activate your account",
            duration: 6000,
          });
          // Clear form fields
          setSignupForm({ email: "", password: "", confirmPassword: "", username: "", ign: "", bgmiId: "" });
          setReferralCode("");
        } else {
          // Auto-confirmed signup (no verification needed)
          toast.success("Account created successfully! You can now login.");
          // Switch to login tab
          const loginTab = document.querySelector('[value="login"]') as HTMLButtonElement;
          if (loginTab) loginTab.click();
        }
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.5)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] transition-shadow">
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-background drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-gaming font-bold mb-2">
            <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              ArenaX
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">Join the Ultimate PUBG Tournament Platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card className="glass-card border-border/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-gaming">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome Back
                  </span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" variant="gaming" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            <Card className="glass-card border-border/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl font-gaming">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Create Account
                  </span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">Sign up to start your gaming journey</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Warning Message */}
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                    <p className="text-sm text-destructive font-medium text-center">
                      ⚠️ सही Email डालें, वरना Password Reset नहीं होगा!
                    </p>
                    <p className="text-xs text-destructive/80 text-center mt-1">
                      Enter correct email, otherwise password reset won't work
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="gamer123"
                        value={signupForm.username}
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-ign">In-Game Name (IGN)</Label>
                    <div className="relative">
                      <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-ign"
                        type="text"
                        placeholder="Mortal_OP"
                        value={signupForm.ign}
                        onChange={(e) => setSignupForm({ ...signupForm, ign: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-bgmi-id">BGMI ID</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-bgmi-id"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="543216789"
                        value={signupForm.bgmiId}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '');
                          setSignupForm({ ...signupForm, bgmiId: value });
                        }}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="••••••••"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {/* Referral Code Badge */}
                  {referralCode && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <p className="text-sm text-green-500 font-medium flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Referral Code Active: <span className="font-bold">{referralCode}</span>
                      </p>
                    </div>
                  )}
                  <Button type="submit" variant="gaming" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
