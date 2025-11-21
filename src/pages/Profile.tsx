import { User, Mail, Phone, Calendar, Trophy, Target, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WithdrawalSettings from "@/components/profile/WithdrawalSettings";
import SupportCard from "@/components/support/SupportCard";
import { useAuth } from "@/contexts/AuthContext";
import TournamentRoomDetails from "@/components/tournaments/TournamentRoomDetails";
import ProfileStatsSkeleton from "@/components/profile/ProfileStatsSkeleton";
import { useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Simulate loading stats (replace with actual data fetch)
  useState(() => {
    const timer = setTimeout(() => setStatsLoading(false), 1000);
    return () => clearTimeout(timer);
  });
  
  const stats = [
    { label: "Tournaments Played", value: "12", icon: Trophy },
    { label: "Win Rate", value: "33%", icon: Target },
    { label: "Total Winnings", value: "₹1,000", icon: Award },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-6">
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
                      PX
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-gaming font-bold mb-2">ProGamer_X</h2>
                    <p className="text-sm sm:text-base text-muted-foreground mb-3 md:mb-4">Member since Jan 2024</p>
                    <Button variant="neon" className="w-full md:w-auto">Edit Profile</Button>
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
                      <div className="font-medium">progamer@example.com</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">+91 98765 43210</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">PUBG ID</div>
                      <div className="font-medium">51234567890</div>
                    </div>
                  </div>

                  <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Member Since</div>
                      <div className="font-medium">January 2024</div>
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
    </div>
  );
};

export default Profile;
