import { useState } from "react";
import { Search, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import TournamentCard from "@/components/cards/TournamentCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Tournaments = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock tournament data
  const tournaments = [
    {
      id: "1",
      title: "Elite Squad Championship",
      entryFee: 30,
      prizePool: 1000,
      totalSlots: 100,
      filledSlots: 67,
      startTime: "Today, 6:00 PM",
      mode: "Squad",
      map: "Erangel",
      status: "open" as const,
    },
    {
      id: "2",
      title: "Pro Duo Battle",
      entryFee: 50,
      prizePool: 2000,
      totalSlots: 100,
      filledSlots: 89,
      startTime: "Today, 8:00 PM",
      mode: "Duo",
      map: "Miramar",
      status: "filling" as const,
    },
    {
      id: "3",
      title: "Solo Survival Masters",
      entryFee: 30,
      prizePool: 1000,
      totalSlots: 100,
      filledSlots: 45,
      startTime: "Tomorrow, 5:00 PM",
      mode: "Solo",
      map: "Sanhok",
      status: "open" as const,
    },
    {
      id: "4",
      title: "Weekend Warriors",
      entryFee: 50,
      prizePool: 2000,
      totalSlots: 100,
      filledSlots: 100,
      startTime: "Tomorrow, 7:00 PM",
      mode: "Squad",
      map: "Vikendi",
      status: "full" as const,
    },
    {
      id: "5",
      title: "Night Owl Challenge",
      entryFee: 30,
      prizePool: 1000,
      totalSlots: 100,
      filledSlots: 23,
      startTime: "Tomorrow, 11:00 PM",
      mode: "Squad",
      map: "Erangel",
      status: "open" as const,
    },
    {
      id: "6",
      title: "Mega Prize Pool Event",
      entryFee: 50,
      prizePool: 2000,
      totalSlots: 100,
      filledSlots: 56,
      startTime: "Saturday, 4:00 PM",
      mode: "Duo",
      map: "Miramar",
      status: "open" as const,
    },
  ];

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              Live Tournaments
            </h1>
            <p className="text-xl text-muted-foreground">
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
              <Button variant="neon">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Tournament Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No tournaments found matching your search.
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
