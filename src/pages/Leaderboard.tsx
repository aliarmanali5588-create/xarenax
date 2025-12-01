import { useState, useEffect } from "react";
import { Trophy, Medal, Crown, TrendingUp, Zap, Target } from "lucide-react";
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

const getLeaderboardData = (period: TimePeriod): Player[] => {
  const baseNames = [
    "VENOM_GAMING", "SNIPER_KING_YT", "HEADSHOT_OP", "SHADOW_ASSASSIN",
    "PRO_REAPER_X", "THUNDER_BOLT", "ACE_COMMANDO", "NIGHT_SLAYER",
    "ELITE_HUNTER_99", "GHOST_RIDER_PG", "RAPID_KILLER", "DEATH_SQUAD_TM",
    "FURY_WARRIOR", "BEAST_MODE_ON", "TOXIC_GAMER_X", "SAVAGE_STRIKER",
    "ALPHA_PREDATOR", "MEGA_DESTROYER", "ULTIMATE_NINJA", "CONQUEROR_KING"
  ];

  if (period === "weekly") {
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(10 - (i * 0.4)),
      kills: Math.floor(250 - (i * 10)),
      matchesPlayed: Math.floor(25 - (i * 0.8)),
      winRate: parseFloat((40 - (i * 1.2)).toFixed(1)),
      totalEarnings: Math.floor(5000 - (i * 200)),
    }));
  } else if (period === "monthly") {
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(40 - (i * 1.5)),
      kills: Math.floor(950 - (i * 35)),
      matchesPlayed: Math.floor(105 - (i * 3)),
      winRate: parseFloat((38 - (i * 0.9)).toFixed(1)),
      totalEarnings: Math.floor(22000 - (i * 800)),
    }));
  } else {
    return baseNames.map((name, i) => ({
      rank: i + 1,
      username: name,
      wins: Math.floor(135 - (i * 5)),
      kills: Math.floor(2850 - (i * 100)),
      matchesPlayed: Math.floor(320 - (i * 10)),
      winRate: parseFloat((42 - (i * 0.8)).toFixed(1)),
      totalEarnings: Math.floor(125000 - (i * 5500)),
    }));
  }
};

const Leaderboard = () => {
  const [period, setPeriod] = useState<TimePeriod>("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [period]);

  const players = getLeaderboardData(period);
  const topThree = players.slice(0, 3);
  const restOfPlayers = players.slice(3);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-12 h-12 md:w-14 md:h-14 text-primary animate-pulse drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]" />
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-gaming font-bold">
                <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Leaderboard
                </span>
              </h1>
              <Trophy className="w-12 h-12 md:w-14 md:h-14 text-primary animate-pulse drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]" />
            </div>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Compete with the best and climb to the top
            </p>
          </div>

          {/* Time Period Filters */}
          <div className="flex justify-center gap-3 mb-8">
            <Button
              variant={period === "weekly" ? "gaming" : "outline"}
              onClick={() => setPeriod("weekly")}
              className="font-heading text-sm md:text-base px-6 h-11 md:h-12"
            >
              This Week
            </Button>
            <Button
              variant={period === "monthly" ? "gaming" : "outline"}
              onClick={() => setPeriod("monthly")}
              className="font-heading text-sm md:text-base px-6 h-11 md:h-12"
            >
              This Month
            </Button>
            <Button
              variant={period === "alltime" ? "gaming" : "outline"}
              onClick={() => setPeriod("alltime")}
              className="font-heading text-sm md:text-base px-6 h-11 md:h-12"
            >
              All Time
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8">
            <div className="glass-card p-3 md:p-6 hover-lift">
              <div className="flex flex-col items-center">
                <TrendingUp className="w-5 h-5 md:w-8 md:h-8 text-primary mb-2" />
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Players</p>
                <p className="text-lg md:text-3xl font-gaming font-bold text-primary">12.8K</p>
              </div>
            </div>
            <div className="glass-card p-3 md:p-6 hover-lift">
              <div className="flex flex-col items-center">
                <Zap className="w-5 h-5 md:w-8 md:h-8 text-secondary mb-2" />
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Matches</p>
                <p className="text-lg md:text-3xl font-gaming font-bold text-secondary">342</p>
              </div>
            </div>
            <div className="glass-card p-3 md:p-6 hover-lift">
              <div className="flex flex-col items-center">
                <Target className="w-5 h-5 md:w-8 md:h-8 text-accent mb-2" />
                <p className="text-xs md:text-sm text-muted-foreground mb-1">Prizes</p>
                <p className="text-lg md:text-3xl font-gaming font-bold text-accent">₹18.7L</p>
              </div>
            </div>
          </div>

          {/* Top 3 Podium */}
          {loading ? (
            <LeaderboardPodiumSkeleton />
          ) : (
            <div className="glass-card p-4 md:p-8 mb-8">
              <h2 className="text-xl md:text-3xl font-gaming font-bold text-center mb-6">
                <span className="text-gradient bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  🏆 Top Champions 🏆
                </span>
              </h2>
              
              <div className="flex items-end justify-center gap-3 md:gap-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center flex-1 max-w-[140px] md:max-w-[180px]">
                  <Avatar className="w-16 h-16 md:w-24 md:h-24 mb-3 border-2 md:border-4 border-gray-400 shadow-[0_0_20px_rgba(156,163,175,0.5)]">
                    <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-lg md:text-2xl font-gaming text-white">
                      {topThree[1]?.username.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full bg-gradient-to-t from-gray-600/30 to-gray-500/20 rounded-t-xl border-t-2 md:border-t-4 border-gray-400 flex flex-col items-center justify-center h-28 md:h-40 mb-2">
                    <Medal className="w-6 h-6 md:w-10 md:h-10 text-gray-400 mb-1" />
                    <span className="text-3xl md:text-5xl font-gaming font-bold text-gray-400">2</span>
                  </div>
                  <p className="font-heading font-bold text-xs md:text-sm text-foreground mb-1 truncate w-full text-center">
                    {topThree[1]?.username}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">{topThree[1]?.wins} Wins</p>
                  <Badge className="bg-gray-500/20 text-gray-400 border-gray-400/50 text-xs">
                    ₹{(topThree[1]?.totalEarnings / 1000).toFixed(1)}K
                  </Badge>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center flex-1 max-w-[160px] md:max-w-[200px]">
                  <div className="relative mb-3">
                    <Crown className="w-7 h-7 md:w-10 md:h-10 text-amber-400 absolute -top-7 md:-top-10 left-1/2 -translate-x-1/2 animate-pulse drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
                    <Avatar className="w-20 h-20 md:w-32 md:h-32 border-2 md:border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-2xl md:text-4xl font-gaming text-white">
                        {topThree[0]?.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="w-full bg-gradient-to-t from-amber-600/30 to-amber-500/20 rounded-t-xl border-t-2 md:border-t-4 border-amber-400 flex flex-col items-center justify-center h-36 md:h-48 mb-2">
                    <Crown className="w-7 h-7 md:w-12 md:h-12 text-amber-400 mb-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    <span className="text-4xl md:text-6xl font-gaming font-bold text-amber-400">1</span>
                  </div>
                  <p className="font-heading font-bold text-sm md:text-base text-amber-400 mb-1 truncate w-full text-center">
                    {topThree[0]?.username}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">{topThree[0]?.wins} Wins</p>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-400/50 text-xs">
                    ₹{(topThree[0]?.totalEarnings / 1000).toFixed(1)}K
                  </Badge>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center flex-1 max-w-[140px] md:max-w-[180px]">
                  <Avatar className="w-16 h-16 md:w-24 md:h-24 mb-3 border-2 md:border-4 border-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]">
                    <AvatarFallback className="bg-gradient-to-br from-orange-600 to-orange-800 text-lg md:text-2xl font-gaming text-white">
                      {topThree[2]?.username.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full bg-gradient-to-t from-orange-600/30 to-orange-500/20 rounded-t-xl border-t-2 md:border-t-4 border-orange-600 flex flex-col items-center justify-center h-24 md:h-32 mb-2">
                    <Medal className="w-6 h-6 md:w-10 md:h-10 text-orange-600 mb-1" />
                    <span className="text-3xl md:text-5xl font-gaming font-bold text-orange-600">3</span>
                  </div>
                  <p className="font-heading font-bold text-xs md:text-sm text-foreground mb-1 truncate w-full text-center">
                    {topThree[2]?.username}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">{topThree[2]?.wins} Wins</p>
                  <Badge className="bg-orange-500/20 text-orange-600 border-orange-600/50 text-xs">
                    ₹{(topThree[2]?.totalEarnings / 1000).toFixed(1)}K
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Full Rankings */}
          {loading ? (
            <LeaderboardTableSkeleton />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block glass-card p-6">
                <h2 className="text-2xl font-gaming font-bold mb-6">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Full Rankings
                  </span>
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
                        className="border-border/30 hover:bg-primary/5 transition-colors"
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
                            <span className="font-heading font-semibold text-foreground">
                              {player.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-primary">{player.wins}</TableCell>
                        <TableCell className="font-medium">{player.kills}</TableCell>
                        <TableCell className="font-medium">{player.matchesPlayed}</TableCell>
                        <TableCell>
                          <Badge className="bg-primary/20 text-primary border-primary/50">
                            {player.winRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-accent">
                          ₹{(player.totalEarnings / 1000).toFixed(1)}K
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                <h2 className="text-xl font-gaming font-bold mb-4 text-center">
                  <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Full Rankings
                  </span>
                </h2>
                {restOfPlayers.map((player) => (
                  <div key={player.rank} className="glass-card p-4 hover-lift">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl font-gaming font-bold text-primary">
                        #{player.rank}
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-primary/30">
                        <AvatarFallback className="bg-card font-gaming">
                          {player.username.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-foreground truncate">
                          {player.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {player.wins} Wins • {player.kills} Kills
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="font-bold text-primary">{player.winRate}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Matches</p>
                        <p className="font-bold">{player.matchesPlayed}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="font-bold text-accent">₹{(player.totalEarnings / 1000).toFixed(1)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <MegaFooter />
    </div>
  );
};

export default Leaderboard;
