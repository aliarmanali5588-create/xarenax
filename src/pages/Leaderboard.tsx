import { useState } from "react";
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

const Leaderboard = () => {
  const [period, setPeriod] = useState<TimePeriod>("weekly");

  const players: Player[] = [
    {
      rank: 1,
      username: "SHADOW_KING",
      wins: 45,
      kills: 892,
      matchesPlayed: 120,
      winRate: 37.5,
      totalEarnings: 125000,
    },
    {
      rank: 2,
      username: "ACE_SNIPER",
      wins: 42,
      kills: 856,
      matchesPlayed: 115,
      winRate: 36.5,
      totalEarnings: 98000,
    },
    {
      rank: 3,
      username: "PRO_GAMER_X",
      wins: 38,
      kills: 795,
      matchesPlayed: 110,
      winRate: 34.5,
      totalEarnings: 87000,
    },
    {
      rank: 4,
      username: "HEADSHOT_MASTER",
      wins: 35,
      kills: 742,
      matchesPlayed: 105,
      winRate: 33.3,
      totalEarnings: 76000,
    },
    {
      rank: 5,
      username: "SILENT_KILLER",
      wins: 32,
      kills: 698,
      matchesPlayed: 98,
      winRate: 32.7,
      totalEarnings: 65000,
    },
    {
      rank: 6,
      username: "THUNDER_STRIKE",
      wins: 30,
      kills: 654,
      matchesPlayed: 95,
      winRate: 31.6,
      totalEarnings: 58000,
    },
    {
      rank: 7,
      username: "NIGHT_HAWK",
      wins: 28,
      kills: 612,
      matchesPlayed: 92,
      winRate: 30.4,
      totalEarnings: 52000,
    },
    {
      rank: 8,
      username: "VIPER_SQUAD",
      wins: 26,
      kills: 587,
      matchesPlayed: 88,
      winRate: 29.5,
      totalEarnings: 47000,
    },
  ];

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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel rounded-xl p-6 border-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-heading font-bold text-foreground">Total Players</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-primary">2,543</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-secondary/30">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-6 h-6 text-secondary" />
                <h3 className="font-heading font-bold text-foreground">Total Matches</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-secondary">8,932</p>
            </div>
            <div className="glass-panel rounded-xl p-6 border-admin-gold/30">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-admin-gold" />
                <h3 className="font-heading font-bold text-foreground">Prize Distributed</h3>
              </div>
              <p className="text-3xl font-gaming font-bold text-admin-gold">₹5.2L</p>
            </div>
          </div>

          {/* Podium - Top 3 */}
          <div className="glass-panel rounded-2xl p-8 mb-12 neon-border-cyan">
            <h2 className="text-2xl font-gaming font-bold text-center mb-8 text-admin-gold">
              🏆 Top Champions 🏆
            </h2>
            <div className="flex items-end justify-center gap-4 md:gap-8">
              {/* 2nd Place */}
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
                    ₹{(topThree[1]?.totalEarnings / 1000).toFixed(0)}K
                  </Badge>
                </div>
              </div>

              {/* 1st Place */}
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
                    ₹{(topThree[0]?.totalEarnings / 1000).toFixed(0)}K
                  </Badge>
                </div>
              </div>

              {/* 3rd Place */}
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
                    ₹{(topThree[2]?.totalEarnings / 1000).toFixed(0)}K
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Rankings Table */}
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
                      ₹{(player.totalEarnings / 1000).toFixed(0)}K
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default Leaderboard;
