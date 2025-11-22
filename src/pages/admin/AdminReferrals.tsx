import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  referrer_id: string;
  referrer_name: string;
  referred_id: string;
  referred_name: string;
  joined_at: string;
  commission_paid: number;
}

const AdminReferrals = () => {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      // Fetch all users who were referred
      const { data: referredUsers, error } = await supabase
        .from("profiles")
        .select(`
          id,
          username,
          referred_by,
          created_at
        `)
        .not("referred_by", "is", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get referrer details
      const referrerIds = [...new Set(referredUsers?.map(u => u.referred_by) || [])];
      const { data: referrers } = await supabase
        .from("profiles")
        .select("id, username")
        .in("id", referrerIds);

      const referrerMap = new Map(referrers?.map(r => [r.id, r.username]) || []);

      // Calculate commissions from transactions
      const { data: commissions } = await supabase
        .from("transactions")
        .select("user_id, amount")
        .in("type", ["referral_bonus", "affiliate_commission", "referral_signup_bonus", "referral_win_bonus"]);

      const commissionMap = new Map<string, number>();
      commissions?.forEach(c => {
        const current = commissionMap.get(c.user_id) || 0;
        commissionMap.set(c.user_id, current + Number(c.amount));
      });

      // Build referral data
      const referralList: ReferralData[] = referredUsers?.map(user => ({
        referrer_id: user.referred_by!,
        referrer_name: referrerMap.get(user.referred_by!) || "Unknown",
        referred_id: user.id,
        referred_name: user.username,
        joined_at: new Date(user.created_at).toLocaleDateString(),
        commission_paid: commissionMap.get(user.referred_by!) || 0,
      })) || [];

      setReferrals(referralList);
      setTotalReferrals(referralList.length);
      
      const total = Array.from(commissionMap.values()).reduce((sum, val) => sum + val, 0);
      setTotalCommission(total);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Referrals
            </CardTitle>
            <Users className="h-4 w-4 text-admin-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-gaming text-admin-gold">
              {loading ? "..." : totalReferrals}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Commission Paid
            </CardTitle>
            <DollarSign className="h-4 w-4 text-admin-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-gaming text-admin-gold">
              ₹{loading ? "..." : totalCommission.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <CardTitle className="text-xl font-gaming text-admin-gold">
            Affiliate Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : referrals.length === 0 ? (
            <p className="text-muted-foreground">No referrals yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer Name</TableHead>
                    <TableHead>Referred User</TableHead>
                    <TableHead>Date Joined</TableHead>
                    <TableHead>Commission Earned</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((ref, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{ref.referrer_name}</TableCell>
                      <TableCell>{ref.referred_name}</TableCell>
                      <TableCell>{ref.joined_at}</TableCell>
                      <TableCell className="text-green-500">₹{ref.commission_paid}</TableCell>
                      <TableCell>
                        <Badge variant={ref.commission_paid > 0 ? "default" : "secondary"}>
                          {ref.commission_paid > 0 ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReferrals;
