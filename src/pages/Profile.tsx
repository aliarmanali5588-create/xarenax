import { User, Mail, Calendar, Trophy, Target, Award, Pencil } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import WithdrawalSettings from "@/components/profile/WithdrawalSettings";
import SupportCard from "@/components/support/SupportCard";
import { useAuth } from "@/contexts/AuthContext";
import TournamentRoomDetails from "@/components/tournaments/TournamentRoomDetails";
import ProfileStatsSkeleton from "@/components/profile/ProfileStatsSkeleton";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  username: string;
  ign: string | null;
  bgmi_id: string | null;
  created_at: string;
  total_winnings: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tournamentStats, setTournamentStats] = useState({
    played: 0,
    winRate: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
      fetchTournamentStats();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, ign, bgmi_id, created_at, total_winnings')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (data) setProfileData(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchTournamentStats = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('rank')
        .eq('user_id', user.id);

      if (error) throw error;

      const played = data?.length || 0;
      const wins = data?.filter(p => p.rank === 1).length || 0;
      const winRate = played > 0 ? Math.round((wins / played) * 100) : 0;

      setTournamentStats({ played, winRate });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const stats = [
    { label: "Tournaments Played", value: tournamentStats.played.toString(), icon: Trophy },
    { label: "Win Rate", value: `${tournamentStats.winRate}%`, icon: Target },
    { label: "Total Winnings", value: `₹${profileData?.total_winnings || 0}`, icon: Award },
  ];

  const userInitials = profileData?.username 
    ? profileData.username.substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || "U";

  const memberSince = profileData?.created_at 
    ? new Date(profileData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-gaming font-bold mb-3 md:mb-4 text-glow-cyan">
              My Profile
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Your gaming stats and account information
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 md:mb-8 glass-panel">
              <TabsTrigger value="overview" className="font-heading text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="my-matches" className="font-heading text-xs sm:text-sm">My Matches</TabsTrigger>
              <TabsTrigger value="withdrawal" className="font-heading text-xs sm:text-sm">Withdrawal</TabsTrigger>
              <TabsTrigger value="support" className="font-heading text-xs sm:text-sm">Support</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 md:space-y-8">
              {/* Profile Card */}
              <div className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8 neon-border-cyan">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <Avatar className="w-32 h-32 border-4 border-primary/30 neon-glow-cyan">
                    <AvatarImage src="" alt="Profile" />
                    <AvatarFallback className="text-4xl font-gaming bg-gradient-to-br from-primary to-accent text-background">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-gaming font-bold mb-2">
                      {profileData?.username || user.email?.split('@')[0] || 'Player'}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 md:mb-4">
                      Member since {memberSince}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                      className="mt-2 border-primary/40 hover:border-primary hover:bg-primary/10 text-primary"
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{user.email}</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">IGN (In-Game Name)</div>
                      <div className="font-medium">{profileData?.ign || 'Not set'}</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">BGMI ID</div>
                      <div className="font-medium">{profileData?.bgmi_id || 'Not set'}</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="font-medium">{memberSince}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gaming Stats */}
              {statsLoading ? (
                <ProfileStatsSkeleton />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="glass-panel-hover rounded-xl p-4 sm:p-6 text-center group"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-background" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-gaming font-bold mb-2 text-glow-cyan">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
              )}
            </TabsContent>

            {/* My Matches Tab */}
            <TabsContent value="my-matches">
              <TournamentRoomDetails />
            </TabsContent>

            {/* Withdrawal Tab */}
          <TabsContent value="withdrawal">
            <WithdrawalSettings userId={user?.id || ""} />
          </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support">
              <SupportCard />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <MegaFooter />

      {/* Edit Profile Modal */}
      {user && profileData && (
        <EditProfileModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          currentData={{
            username: profileData.username,
            ign: profileData.ign,
            bgmiId: profileData.bgmi_id,
            email: user.email || "",
          }}
          userId={user.id}
          onSuccess={fetchProfileData}
        />
      )}
    </div>
  );
};

export default Profile;
