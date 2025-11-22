import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";

const RedeemInvite = () => {
  const [searchParams] = useSearchParams();
  const [inviteCode, setInviteCode] = useState(searchParams.get("code") || "");
  const [redeeming, setRedeeming] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Auto-redeem if code is in URL and user is logged in
    const code = searchParams.get("code");
    if (code && user && !success) {
      setInviteCode(code);
      redeemInvitation(code);
    }
  }, [searchParams, user]);

  const redeemInvitation = async (code?: string) => {
    const codeToRedeem = code || inviteCode.trim();
    
    if (!codeToRedeem) {
      toast({
        title: "Error",
        description: "Please enter an invitation code",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to redeem your invitation",
        variant: "destructive",
      });
      navigate(`/auth?redirect=/redeem-invite?code=${codeToRedeem}`);
      return;
    }

    setRedeeming(true);

    try {
      const { data, error } = await supabase.rpc("redeem_admin_invite", {
        code: codeToRedeem,
      });

      if (error) throw error;

      const result = data as { success: boolean; error?: string; role?: string };

      if (!result.success) {
        throw new Error(result.error || "Failed to redeem invitation");
      }

      setSuccess(true);
      toast({
        title: "Success! 🎉",
        description: `You now have ${result.role} privileges`,
      });

      // Redirect to admin panel after 2 seconds
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Redemption Failed",
        description: error.message || "Invalid or expired invitation code",
        variant: "destructive",
      });
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-primary/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <CardTitle className="text-2xl font-gaming text-primary">
              Admin Invitation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Redeem your invitation to gain elevated privileges
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {success ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-green-500">
                    Invitation Redeemed!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Redirecting to admin panel...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {!user && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-500">
                      You need to be logged in to redeem an invitation
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="code">Invitation Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 12-character code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    maxLength={12}
                    className="font-mono"
                  />
                </div>

                <Button
                  onClick={() => redeemInvitation()}
                  disabled={redeeming || !inviteCode.trim()}
                  className="w-full"
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redeeming...
                    </>
                  ) : (
                    "Redeem Invitation"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Invitation codes are single-use and time-limited</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <MegaFooter />
    </>
  );
};

export default RedeemInvite;
