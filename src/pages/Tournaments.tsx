import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import TournamentCard from "@/components/cards/TournamentCard";
import TournamentCardSkeleton from "@/components/cards/TournamentCardSkeleton";
import { Input } from "@/components/ui/input";
import { Search, Filter, Trophy, Zap, Users, Shield, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Tournament {
  id: string;
  title: string;
  entry_fee: number;
  prize_pool: number;
  start_time: string;
  match_type: string;
  map: string;
  status: string;
  current_slots: number;
  max_slots: number;
}

const Tournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .in("status", ["upcoming", "open", "full"])
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching tournaments:", error);
        toast.error("Failed to load tournaments");
      } else {
        setTournaments(data || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.map.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.match_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Live Tournaments", value: tournaments.length.toString(), icon: Trophy },
    { label: "Active Players", value: "2.8K", icon: Users },
    { label: "Total Prize Pool", value: "₹85K", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="modern-container relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-6 px-5 py-2.5 bg-primary/15 text-primary border-primary/40 shadow-[0_0_20px_rgba(0,255,255,0.2)]">
              <Zap className="w-4 h-4 mr-2" />
              Join Live Tournaments Now
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-gaming font-bold mb-8 leading-tight">
              <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-pulse">Live Tournaments</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose your battle and start competing for <span className="text-secondary font-bold">real cash prizes</span>
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-card/40 px-4 py-2 rounded-lg border border-border/30">
                <Shield className="w-4 h-4 text-success" />
                <span className="font-medium">100% Secure</span>
              </div>
              <div className="flex items-center gap-2 bg-card/40 px-4 py-2 rounded-lg border border-border/30">
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-medium">Instant Join</span>
              </div>
              <div className="flex items-center gap-2 bg-card/40 px-4 py-2 rounded-lg border border-border/30">
                <Trophy className="w-4 h-4 text-secondary" />
                <span className="font-medium">Fair Play</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="glass-card p-6 text-center hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary drop-shadow-[0_0_10px_currentColor]" />
                </div>
                <div className="text-4xl font-gaming font-bold mb-2 text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar - Premium Design */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
              <Input
                placeholder="Search by tournament name, map, or game mode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative pl-14 pr-6 h-16 md:h-20 text-base md:text-lg bg-card/60 backdrop-blur-xl border-2 border-border/60 focus:border-primary rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] focus:shadow-[0_12px_48px_0_rgba(0,255,255,0.3)] transition-all duration-300 font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tournament Grid Section */}
      <section className="pb-20 px-4">
        <div className="modern-container">
          {/* Section Header */}
          {!loading && filteredTournaments.length > 0 && (
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-4xl font-gaming font-bold">
                <span className="text-primary">Available</span> Matches
              </h2>
              <Badge variant="secondary" className="text-sm md:text-base px-4 py-2">
                {filteredTournaments.length} Tournament{filteredTournaments.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          {/* Tournament Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <TournamentCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  id={tournament.id}
                  title={tournament.title}
                  entryFee={tournament.entry_fee}
                  prizePool={tournament.prize_pool}
                  startTime={new Date(tournament.start_time).toLocaleString()}
                  mode={tournament.match_type}
                  map={tournament.map}
                  status={tournament.status}
                  currentSlots={tournament.current_slots}
                  maxSlots={tournament.max_slots}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 glass-card relative overflow-hidden">
              {/* Empty State Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                  <Filter className="w-12 h-12 text-primary/70" />
                </div>
                <h3 className="text-3xl md:text-4xl font-gaming font-bold text-foreground mb-4">
                  {searchQuery ? "No Matches Found" : "No Live Tournaments"}
                </h3>
                <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery 
                    ? "Try adjusting your search or check back soon" 
                    : "New tournaments coming soon. Check back in a few minutes!"}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Tournaments;
