import { useState, useEffect } from "react";
import { Trophy, Medal, TrendingUp, Zap, Target, Crown, ArrowUp, ArrowDown } from "lucide-react";
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
  trend?: "up" | "down";
}

// Generate realistic data based on time period
const getLeaderboardData = (period: TimePeriod): Player[] => {
  const baseNames = [
    "VENOM_GAMING", "SNIPER_KING_YT", "HEADSHOT_OP", "SHADOW_ASSASSIN",
    "PRO_REAPER_X", "THUNDER_BOLT", "ACE_COMMANDO", "NIGHT_SLAYER",
    "ELITE_HUNTER_99", "GHOST_RIDER_PG", "RAPID_KILLER", "DEATH_SQUAD_TM",
    "FURY_WARRIOR", "BEAST_MODE_ON", "TOXIC_GAMER_X", "SAVAGE_STRIKER",
    "ALPHA_PREDATOR", "MEGA_DESTROYER", "ULTIMATE_NINJA", "CONQUEROR_KING"
  ];

  if (period === "weekly") {
    // Weekly: Lower stats, more dynamic rankings
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(10 - (i * 0.4)),
      kills: Math.floor(250 - (i * 10)),
      matchesPlayed: Math.floor(25 - (i * 0.8)),
      winRate: parseFloat((40 - (i * 1.2)).toFixed(1)),
      totalEarnings: Math.floor(5000 - (i * 200)),
      trend: Math.random() > 0.5 ? "up" : "down"
    }));
  } else if (period === "monthly") {
    // Monthly: Medium stats
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(40 - (i * 1.5)),
      kills: Math.floor(950 - (i * 35)),
      matchesPlayed: Math.floor(105 - (i * 3)),
      winRate: parseFloat((38 - (i * 0.9)).toFixed(1)),
      totalEarnings: Math.floor(22000 - (i * 800)),
      trend: Math.random() > 0.5 ? "up" : "down"
    }));
  } else {
    // All Time: High stats (original data)
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(135 - (i * 5)),
      kills: Math.floor(2850 - (i * 100)),
      matchesPlayed: Math.floor(320 - (i * 10)),
      winRate: parseFloat((42 - (i * 0.8)).toFixed(1)),
      totalEarnings: Math.floor(125000 - (i * 5500)),
      trend: Math.random() > 0.5 ? "up" : "down"
    }));
  }
};

const Leaderboard = () => {
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [period]);

  const players = getLeaderboardData(period);
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
              <h1 className="text-3xl md:text-6xl font-gaming font-bold text-glow-cyan">
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

          {/* Stats Cards - Compact Mobile Design */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6 mb-12">
            <div className="glass-panel rounded-lg md:rounded-xl p-3 md:p-6 border-primary/30">
              <div className="hidden md:flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Active Players</h3>
              </div>
              <p className="text-xs md:hidden text-muted-foreground mb-1">Players</p>
              <p className="text-lg md:text-3xl font-gaming font-bold text-primary">12.8K</p>
            </div>
            <div className="glass-panel rounded-lg md:rounded-xl p-3 md:p-6 border-secondary/30">
              <div className="hidden md:flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-secondary" />
                <h3 className="font-heading font-bold text-foreground">Matches Today</h3>
              </div>
              <p className="text-xs md:hidden text-muted-foreground mb-1">Matches</p>
              <p className="text-lg md:text-3xl font-gaming font-bold text-secondary">342</p>
            </div>
            <div className="glass-panel rounded-lg md:rounded-xl p-3 md:p-6 border-admin-gold/30">
              <div className="hidden md:flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-admin-gold" />
                <h3 className="font-heading font-bold text-foreground">Total Prizes</h3>
              </div>
              <p className="text-xs md:hidden text-muted-foreground mb-1">Prizes</p>
              <p className="text-lg md:text-3xl font-gaming font-bold text-admin-gold">₹18.7L</p>
            </div>
          </div>

          {/* Podium - Top 3 with Premium Visuals */}
          {loading ? (
            <LeaderboardPodiumSkeleton />
          ) : (
            <div className="glass-panel rounded-2xl p-4 md:p-8 mb-12 neon-border-cyan">
              <h2 className="text-xl md:text-2xl font-gaming font-bold text-center mb-6 md:mb-8 text-admin-gold">
                🏆 Top Champions 🏆
              </h2>
              <div className="flex items-end justify-center gap-2 md:gap-8">
                {/* 2nd Place - Silver */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 md:mb-4">
                    <Avatar className="w-14 h-14 md:w-20 md:h-20 border-2 md:border-4 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.5)]">
                      <AvatarFallback className="bg-gray-700 text-lg md:text-2xl font-gaming">
                        {topThree[1]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="glass-panel rounded-t-xl w-full h-24 md:h-40 flex flex-col items-center justify-center bg-gradient-to-t from-gray-500/20 to-gray-400/10 border-t-2 md:border-t-4 border-gray-400 min-w-[90px] md:min-w-[140px]">
                    <Medal className="w-5 h-5 md:w-8 md:h-8 text-gray-400 mb-1 md:mb-2" />
                    <span className="text-2xl md:text-4xl font-gaming font-bold text-gray-400">2</span>
                  </div>
                  <div className="mt-2 md:mt-3 text-center">
                    <p className="font-heading font-bold text-foreground text-xs md:text-base max-w-[80px] md:max-w-none truncate">
                      {topThree[1]?.username}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{topThree[1]?.wins} Wins</p>
                    <Badge className="mt-1 md:mt-2 bg-gray-500/20 text-gray-400 border-gray-400/50 text-xs">
                      ₹{(topThree[1]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>

                {/* 1st Place - Gold */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 md:mb-4 relative">
                    <Crown className="w-6 h-6 md:w-8 md:h-8 text-admin-gold absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 animate-pulse" />
                    <Avatar className="w-20 h-20 md:w-28 md:h-28 border-2 md:border-4 border-admin-gold shadow-[0_0_30px_rgba(255,215,0,0.6)]">
                      <AvatarFallback className="bg-gradient-to-br from-admin-gold/30 to-secondary/30 text-2xl md:text-3xl font-gaming text-admin-gold">
                        {topThree[0]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="glass-panel rounded-t-xl w-full h-32 md:h-48 flex flex-col items-center justify-center bg-gradient-to-t from-admin-gold/20 to-admin-gold/10 border-t-2 md:border-t-4 border-admin-gold min-w-[100px] md:min-w-[160px]">
                    <Crown className="w-6 h-6 md:w-10 md:h-10 text-admin-gold mb-1 md:mb-2" />
                    <span className="text-3xl md:text-5xl font-gaming font-bold text-admin-gold">1</span>
                  </div>
                  <div className="mt-2 md:mt-3 text-center">
                    <p className="font-heading font-bold text-admin-gold text-sm md:text-lg max-w-[90px] md:max-w-none truncate">
                      {topThree[0]?.username}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{topThree[0]?.wins} Wins</p>
                    <Badge className="mt-1 md:mt-2 bg-admin-gold/20 text-admin-gold border-admin-gold/50 text-xs">
                      ₹{(topThree[0]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>

                {/* 3rd Place - Bronze */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 md:mb-4">
                    <Avatar className="w-14 h-14 md:w-20 md:h-20 border-2 md:border-4 border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                      <AvatarFallback className="bg-orange-900/50 text-lg md:text-2xl font-gaming">
                        {topThree[2]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="glass-panel rounded-t-xl w-full h-20 md:h-32 flex flex-col items-center justify-center bg-gradient-to-t from-orange-600/20 to-orange-500/10 border-t-2 md:border-t-4 border-orange-600 min-w-[90px] md:min-w-[140px]">
                    <Medal className="w-5 h-5 md:w-8 md:h-8 text-orange-600 mb-1 md:mb-2" />
                    <span className="text-2xl md:text-4xl font-gaming font-bold text-orange-600">3</span>
                  </div>
                  <div className="mt-2 md:mt-3 text-center">
                    <p className="font-heading font-bold text-foreground text-xs md:text-base max-w-[80px] md:max-w-none truncate">
                      {topThree[2]?.username}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{topThree[2]?.wins} Wins</p>
                    <Badge className="mt-1 md:mt-2 bg-orange-500/20 text-orange-600 border-orange-600/50 text-xs">
                      ₹{(topThree[2]?.totalEarnings / 1000).toFixed(1)}K
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rankings List - Enhanced Glass Cards */}
          {loading ? (
            <LeaderboardTableSkeleton />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block glass-panel rounded-xl p-6 overflow-x-auto">
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
                          <div className="flex items-center gap-2">
                            {player.wins}
                            {player.trend === "up" ? (
                              <ArrowUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <ArrowDown className="w-3 h-3 text-red-500" />
                            )}
                          </div>
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

              {/* Mobile Glass Cards */}
              <div className="block md:hidden space-y-3">
                <h2 className="text-xl font-gaming font-bold mb-4 text-primary px-2">
                  Full Rankings
                </h2>
                {restOfPlayers.map((player) => (
                  <div 
                    key={player.rank}
                    className="glass-panel rounded-lg p-4 bg-gradient-to-r from-white/5 to-transparent border border-border/30 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-gaming font-bold text-primary">
                          #{player.rank}
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-primary/30">
                          <AvatarFallback className="bg-card text-sm font-gaming">
                            {player.username.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-heading font-bold text-cyan-400 text-sm">
                            {player.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {player.matchesPlayed} Matches
                          </p>
                        </div>
                      </div>
                      {player.trend === "up" ? (
                        <ArrowUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Wins</p>
                        <p className="font-bold text-success">{player.wins}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Kills</p>
                        <p className="font-bold text-destructive">{player.kills}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                        <Badge variant="secondary" className="text-xs">
                          {player.winRate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/20 text-center">
                      <span className="font-gaming font-bold text-admin-gold">
                        ₹{(player.totalEarnings / 1000).toFixed(1)}K Earned
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Leaderboard;
