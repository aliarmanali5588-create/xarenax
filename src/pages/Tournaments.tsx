import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import TournamentCard from "@/components/cards/TournamentCard";
import TournamentCardSkeleton from "@/components/cards/TournamentCardSkeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
        .in("status", ["open", "full"])
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
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-gaming font-bold mb-3 md:mb-4 text-glow-cyan">
              Live Tournaments
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Choose your battle and start competing for real prizes
            </p>
          </div>

          {/* Search & Filter */}
          <div className="glass-panel rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-panel border-border/50"
                />
              </div>
            </div>
          </div>

          {/* Tournament Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <TournamentCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                {searchQuery ? "No tournaments found matching your search" : "No live tournaments available"}
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
