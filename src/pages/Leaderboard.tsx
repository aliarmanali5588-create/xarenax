import { useState, useEffect } from "react";
import { Trophy, Medal, TrendingUp, Zap, Target, Crown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LeaderboardPodiumSkeleton from "@/components/leaderboard/LeaderboardPodiumSkeleton";
import LeaderboardTableSkeleton from "@/components/leaderboard/LeaderboardTableSkeleton";

type TimePeriod = "weekly" | "monthly" | "alltime";

interface Player {
  rank: number;
  username: string;
  wins: number;
  kills: number;
  matchesPlayed: number;
  winRate: number;
  totalEarnings: number;
}

// Mock Pro Player Data for Social Proof
const mockPlayers: Omit<Player, "rank">[] = [
  { username: "VENOM_GAMING", wins: 87, kills: 1842, matchesPlayed: 210, winRate: 41.4, totalEarnings: 48500 },
  { username: "SNIPER_KING_YT", wins: 82, kills: 1756, matchesPlayed: 198, winRate: 41.4, totalEarnings: 45200 },
  { username: "HEADSHOT_OP", wins: 79, kills: 1689, matchesPlayed: 192, winRate: 41.1, totalEarnings: 42800 },
  { username: "SHADOW_ASSASSIN", wins: 75, kills: 1598, matchesPlayed: 185, winRate: 40.5, totalEarnings: 39500 },
  { username: "PRO_REAPER_X", wins: 71, kills: 1523, matchesPlayed: 178, winRate: 39.9, totalEarnings: 36900 },
  { username: "THUNDER_BOLT", wins: 68, kills: 1465, matchesPlayed: 172, winRate: 39.5, totalEarnings: 34200 },
  { username: "ACE_COMMANDO", wins: 65, kills: 1402, matchesPlayed: 168, winRate: 38.7, totalEarnings: 31800 },
  { username: "NIGHT_SLAYER", wins: 62, kills: 1347, matchesPlayed: 163, winRate: 38.0, totalEarnings: 29500 },
  { username: "ELITE_HUNTER_99", wins: 59, kills: 1289, matchesPlayed: 158, winRate: 37.3, totalEarnings: 27200 },
  { username: "GHOST_RIDER_PG", wins: 56, kills: 1234, matchesPlayed: 154, winRate: 36.4, totalEarnings: 25100 },
  { username: "RAPID_KILLER", wins: 53, kills: 1178, matchesPlayed: 149, winRate: 35.6, totalEarnings: 23400 },
  { username: "DEATH_SQUAD_TM", wins: 50, kills: 1125, matchesPlayed: 145, winRate: 34.5, totalEarnings: 21800 },
  { username: "FURY_WARRIOR", wins: 47, kills: 1076, matchesPlayed: 141, winRate: 33.3, totalEarnings: 20200 },
  { username: "BEAST_MODE_ON", wins: 44, kills: 1024, matchesPlayed: 137, winRate: 32.1, totalEarnings: 18700 },
  { username: "TOXIC_GAMER_X", wins: 41, kills: 975, matchesPlayed: 133, winRate: 30.8, totalEarnings: 17300 },
  { username: "SAVAGE_STRIKER", wins: 38, kills: 928, matchesPlayed: 129, winRate: 29.5, totalEarnings: 15900 },
  { username: "ALPHA_PREDATOR", wins: 35, kills: 884, matchesPlayed: 125, winRate: 28.0, totalEarnings: 14600 },
  { username: "MEGA_DESTROYER", wins: 32, kills: 842, matchesPlayed: 121, winRate: 26.4, totalEarnings: 13200 },
  { username: "ULTIMATE_NINJA", wins: 29, kills: 801, matchesPlayed: 118, winRate: 24.6, totalEarnings: 11900 },
  { username: "CONQUEROR_KING", wins: 26, kills: 763, matchesPlayed: 114, winRate: 22.8, totalEarnings: 10500 },
];

const Leaderboard = () => {
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [period]);

  // Shuffle/Filter mock data based on period for "dynamic" effect
  const getPlayersForPeriod = (): Player[] => {
    let shuffledPlayers = [...mockPlayers];
    
    // Different shuffle for each period to simulate dynamic rankings
    if (period === "weekly") {
      shuffledPlayers.sort((a, b) => b.winRate - a.winRate);
    } else if (period === "monthly") {
      shuffledPlayers.sort((a, b) => b.kills - a.kills);
    } else {
      shuffledPlayers.sort((a, b) => b.totalEarnings - a.totalEarnings);
    }
    
    return shuffledPlayers.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  };

  const players = getPlayersForPeriod();
  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-admin-gold" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-48";
      case 2:
        return "h-40";
      case 3:
        return "h-32";
      default:
        return "h-24";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 text-admin-gold animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-gaming font-bold text-glow-cyan">
                Leaderboard
              </h1>
              <Trophy className="w-12 h-12 text-admin-gold animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground">
              Top Players of ArenaX
            </p>
          </div>

          {/* Time Period Filters */}
          <div className="flex justify-center gap-3 mb-12">
            <Button
              variant={period === "weekly" ? "gaming" : "outline"}
              onClick={() => setPeriod("weekly")}
              className="font-heading"
            >
              This Week
            </Button>
            <Button
              variant={period === "monthly" ? "gaming" : "outline"}
              onClick={() => setPeriod("monthly")}
              className="font-heading"
            >
              This Month
            </Button>
            <Button
              variant={period === "alltime" ? "gaming" : "outline"}
              onClick={() => setPeriod("alltime")}
              className="font-heading"
            >
              All Time
            </Button>
          </div>

          {/* Stats Cards - Mock "Active Platform" Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel rounded-xl p-6 border-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Active Players</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-primary">12,847</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-secondary/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-secondary" />
                <h3 className="font-heading font-bold text-foreground">Matches Today</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-secondary">342</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-admin-gold/30">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-admin-gold" />
                <h3 className="font-heading font-bold text-foreground">Total Prizes</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-admin-gold">₹18.7L</p>
            </div>
          </div>

          {/* Podium - Top 3 with Premium Visuals */}
          {loading ? (
            <LeaderboardPodiumSkeleton />
          ) : (
            <div className="glass-panel rounded-2xl p-8 mb-12 neon-border-cyan">
              <h2 className="text-2xl font-gaming font-bold text-center mb-8 text-admin-gold">
                🏆 Top Champions 🏆
              </h2>
              <div className="flex items-end justify-center gap-4 md:gap-8">
                {/* 2nd Place - Silver */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                  <div className="mb-4">
                    <Avatar className="w-20 h-20 border-4 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.5)]">
                      <AvatarFallback className="bg-gray-700 text-2xl font-gaming">
                        {topThree[1]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={`glass-panel rounded-t-xl w-full ${getPodiumHeight(2)} flex flex-col items-center justify-center bg-gradient-to-t from-gray-500/20 to-gray-400/10 border-t-4 border-gray-400`}>
                    <Medal className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-4xl font-gaming font-bold text-gray-400">2</span>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-heading font-bold text-foreground">{topThree[1]?.username}</p>
                    <p className="text-sm text-muted-foreground">{topThree[1]?.wins} Wins</p>
                    <Badge className="mt-2 bg-gray-500/20 text-gray-400 border-gray-400/50">
                      ₹{(topThree[1]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>

                {/* 1st Place - Gold */}
                <div className="flex flex-col items-center flex-1 max-w-[220px]">
                  <div className="mb-4 relative">
                    <Crown className="w-8 h-8 text-admin-gold absolute -top-8 left-1/2 transform -translate-x-1/2 animate-pulse" />
                    <Avatar className="w-24 h-24 border-4 border-admin-gold shadow-[0_0_30px_rgba(255,215,0,0.6)]">
                      <AvatarFallback className="bg-gradient-to-br from-admin-gold/30 to-secondary/30 text-3xl font-gaming text-admin-gold">
                        {topThree[0]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={`glass-panel rounded-t-xl w-full ${getPodiumHeight(1)} flex flex-col items-center justify-center bg-gradient-to-t from-admin-gold/20 to-admin-gold/10 border-t-4 border-admin-gold`}>
                    <Crown className="w-10 h-10 text-admin-gold mb-2" />
                    <span className="text-5xl font-gaming font-bold text-admin-gold">1</span>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-heading font-bold text-admin-gold text-lg">{topThree[0]?.username}</p>
                    <p className="text-sm text-muted-foreground">{topThree[0]?.wins} Wins</p>
                    <Badge className="mt-2 bg-admin-gold/20 text-admin-gold border-admin-gold/50">
                      ₹{(topThree[0]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>

                {/* 3rd Place - Bronze */}
                <div className="flex flex-col items-center flex-1 max-w-[200px]">
                  <div className="mb-4">
                    <Avatar className="w-20 h-20 border-4 border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                      <AvatarFallback className="bg-orange-900/50 text-2xl font-gaming">
                        {topThree[2]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className={`glass-panel rounded-t-xl w-full ${getPodiumHeight(3)} flex flex-col items-center justify-center bg-gradient-to-t from-orange-600/20 to-orange-500/10 border-t-4 border-orange-600`}>
                    <Medal className="w-8 h-8 text-orange-600 mb-2" />
                    <span className="text-4xl font-gaming font-bold text-orange-600">3</span>
                  </div>
                  <div className="mt-3 text-center">
                    <p className="font-heading font-bold text-foreground">{topThree[2]?.username}</p>
                    <p className="text-sm text-muted-foreground">{topThree[2]?.wins} Wins</p>
                    <Badge className="mt-2 bg-orange-500/20 text-orange-600 border-orange-600/50">
                      ₹{(topThree[2]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rankings Table */}
          {loading ? (
            <LeaderboardTableSkeleton />
          ) : (
            <div className="glass-panel rounded-xl p-6 overflow-x-auto">
              <h2 className="text-2xl font-gaming font-bold mb-6 text-primary">
                Full Rankings
              </h2>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead className="text-primary font-gaming">Rank</TableHead>
                    <TableHead className="text-primary font-gaming">Player</TableHead>
                    <TableHead className="text-primary font-gaming">Wins</TableHead>
                    <TableHead className="text-primary font-gaming">Kills</TableHead>
                    <TableHead className="text-primary font-gaming">Matches</TableHead>
                    <TableHead className="text-primary font-gaming">Win Rate</TableHead>
                    <TableHead className="text-primary font-gaming">Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {restOfPlayers.map((player) => (
                    <TableRow 
                      key={player.rank} 
                      className="border-border/30 hover:bg-card/60 transition-colors"
                    >
                      <TableCell className="font-gaming font-bold text-lg">
                        #{player.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border-2 border-primary/30">
                            <AvatarFallback className="bg-card text-sm font-gaming">
                              {player.username.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-heading font-semibold text-cyan-400">
                            {player.username}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-success">
                        {player.wins}
                      </TableCell>
                      <TableCell className="font-bold text-destructive">
                        {player.kills}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {player.matchesPlayed}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-heading">
                          {player.winRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-gaming font-bold text-admin-gold">
                        ₹{(player.totalEarnings / 1000).toFixed(1)}K
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Leaderboard;
