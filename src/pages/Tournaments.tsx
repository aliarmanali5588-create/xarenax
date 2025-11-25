import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import TournamentCard from "@/components/cards/TournamentCard";
import TournamentCardSkeleton from "@/components/cards/TournamentCardSkeleton";
import { Input } from "@/components/ui/input";
import { Search, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background" />
        <div className="container mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-gaming font-bold mb-4 md:mb-6 text-gradient-gaming">
              🏆 Live Tournaments 🏆
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 font-medium">
              Choose your battle and start competing for <span className="text-secondary">real prizes</span>
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-panel-hover rounded-2xl p-6 md:p-8 mb-10 md:mb-12 neon-border-cyan relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
            <div className="flex flex-col md:flex-row gap-4 relative z-10">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary" />
                <Input
                  placeholder="🔍 Search tournaments by name, map, or mode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 glass-panel border-2 border-primary/30 focus:border-primary text-base font-medium"
                />
              </div>
            </div>
          </div>

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
            <div className="text-center py-20 glass-panel rounded-2xl">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-2xl font-gaming text-muted-foreground mb-2">
                {searchQuery ? "No tournaments found" : "No live tournaments available"}
              </p>
              <p className="text-foreground/70">
                {searchQuery ? "Try adjusting your search" : "Check back soon for new matches!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Tournaments;
