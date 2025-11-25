import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, TrendingUp, Users, Trophy, DollarSign } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MapStats {
  map: string;
  total_tournaments: number;
  total_participants: number;
  avg_entry_fee: number;
}

interface ModeStats {
  game_mode: string;
  total_tournaments: number;
  total_participants: number;
  avg_entry_fee: number;
}

interface MatchTypeStats {
  match_type: string;
  total_tournaments: number;
  total_participants: number;
  avg_entry_fee: number;
}

interface EntryFeeStats {
  entry_fee_range: string;
  total_tournaments: number;
  total_participants: number;
  avg_slots_filled: number;
}

const TournamentAnalytics = () => {
  const [mapStats, setMapStats] = useState<MapStats[]>([]);
  const [modeStats, setModeStats] = useState<ModeStats[]>([]);
  const [matchTypeStats, setMatchTypeStats] = useState<MatchTypeStats[]>([]);
  const [entryFeeStats, setEntryFeeStats] = useState<EntryFeeStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all tournaments with participant counts
      const { data: tournaments, error } = await supabase
        .from("tournaments")
        .select(`
          id,
          map,
          game_mode,
          match_type,
          entry_fee,
          max_slots,
          current_slots,
          status
        `);

      if (error) throw error;

      // Calculate Map Statistics
      const mapData: { [key: string]: MapStats } = {};
      tournaments?.forEach((t) => {
        if (!mapData[t.map]) {
          mapData[t.map] = {
            map: t.map,
            total_tournaments: 0,
            total_participants: 0,
            avg_entry_fee: 0,
          };
        }
        mapData[t.map].total_tournaments++;
        mapData[t.map].total_participants += t.current_slots;
        mapData[t.map].avg_entry_fee += t.entry_fee;
      });

      const mapStatsArray = Object.values(mapData).map((stat) => ({
        ...stat,
        avg_entry_fee: stat.avg_entry_fee / stat.total_tournaments,
      }));
      mapStatsArray.sort((a, b) => b.total_participants - a.total_participants);
      setMapStats(mapStatsArray);

      // Calculate Game Mode Statistics
      const modeData: { [key: string]: ModeStats } = {};
      tournaments?.forEach((t) => {
        const mode = t.game_mode || "classic";
        if (!modeData[mode]) {
          modeData[mode] = {
            game_mode: mode,
            total_tournaments: 0,
            total_participants: 0,
            avg_entry_fee: 0,
          };
        }
        modeData[mode].total_tournaments++;
        modeData[mode].total_participants += t.current_slots;
        modeData[mode].avg_entry_fee += t.entry_fee;
      });

      const modeStatsArray = Object.values(modeData).map((stat) => ({
        ...stat,
        avg_entry_fee: stat.avg_entry_fee / stat.total_tournaments,
      }));
      modeStatsArray.sort((a, b) => b.total_participants - a.total_participants);
      setModeStats(modeStatsArray);

      // Calculate Match Type Statistics
      const matchTypeData: { [key: string]: MatchTypeStats } = {};
      tournaments?.forEach((t) => {
        if (!matchTypeData[t.match_type]) {
          matchTypeData[t.match_type] = {
            match_type: t.match_type,
            total_tournaments: 0,
            total_participants: 0,
            avg_entry_fee: 0,
          };
        }
        matchTypeData[t.match_type].total_tournaments++;
        matchTypeData[t.match_type].total_participants += t.current_slots;
        matchTypeData[t.match_type].avg_entry_fee += t.entry_fee;
      });

      const matchTypeStatsArray = Object.values(matchTypeData).map((stat) => ({
        ...stat,
        avg_entry_fee: stat.avg_entry_fee / stat.total_tournaments,
      }));
      matchTypeStatsArray.sort((a, b) => b.total_participants - a.total_participants);
      setMatchTypeStats(matchTypeStatsArray);

      // Calculate Entry Fee Range Statistics
      const entryFeeData: { [key: string]: { total: number; participants: number; slots: number[] } } = {
        "₹1-50": { total: 0, participants: 0, slots: [] },
        "₹51-100": { total: 0, participants: 0, slots: [] },
        "₹101-200": { total: 0, participants: 0, slots: [] },
        "₹201-500": { total: 0, participants: 0, slots: [] },
        "₹500+": { total: 0, participants: 0, slots: [] },
      };

      tournaments?.forEach((t) => {
        let range = "₹500+";
        if (t.entry_fee <= 50) range = "₹1-50";
        else if (t.entry_fee <= 100) range = "₹51-100";
        else if (t.entry_fee <= 200) range = "₹101-200";
        else if (t.entry_fee <= 500) range = "₹201-500";

        entryFeeData[range].total++;
        entryFeeData[range].participants += t.current_slots;
        if (t.max_slots > 0) {
          entryFeeData[range].slots.push((t.current_slots / t.max_slots) * 100);
        }
      });

      const entryFeeStatsArray = Object.entries(entryFeeData).map(([range, data]) => ({
        entry_fee_range: range,
        total_tournaments: data.total,
        total_participants: data.participants,
        avg_slots_filled:
          data.slots.length > 0
            ? data.slots.reduce((a, b) => a + b, 0) / data.slots.length
            : 0,
      }));
      setEntryFeeStats(entryFeeStatsArray);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart className="h-8 w-8 text-admin-gold" />
        <div>
          <h1 className="text-3xl font-gaming text-glow-cyan">Tournament Analytics</h1>
          <p className="text-muted-foreground">Insights on player preferences and popular formats</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-xl border-admin-gold/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tournaments</p>
                <p className="text-3xl font-gaming text-admin-gold">
                  {mapStats.reduce((acc, stat) => acc + stat.total_tournaments, 0)}
                </p>
              </div>
              <Trophy className="h-10 w-10 text-admin-gold/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-3xl font-gaming text-primary">
                  {mapStats.reduce((acc, stat) => acc + stat.total_participants, 0)}
                </p>
              </div>
              <Users className="h-10 w-10 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Entry Fee</p>
                <p className="text-3xl font-gaming text-green-500">
                  ₹
                  {Math.round(
                    mapStats.reduce((acc, stat) => acc + stat.avg_entry_fee, 0) /
                      (mapStats.length || 1)
                  )}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-500/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Fill Rate</p>
                <p className="text-3xl font-gaming text-cyan-500">
                  {Math.round(
                    entryFeeStats.reduce((acc, stat) => acc + stat.avg_slots_filled, 0) /
                      (entryFeeStats.length || 1)
                  )}
                  %
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-cyan-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Popularity */}
      <Card className="bg-card/50 backdrop-blur-xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-gaming text-glow-cyan">
            <Trophy className="h-5 w-5 text-admin-gold" />
            Most Popular Maps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Map</TableHead>
                <TableHead className="text-right">Tournaments</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="text-right">Avg Entry Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mapStats.map((stat, index) => (
                <TableRow key={stat.map} className="admin-neon-card">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {index === 0 && <span className="text-admin-gold">🏆</span>}
                      {index === 1 && <span className="text-gray-400">🥈</span>}
                      {index === 2 && <span className="text-amber-600">🥉</span>}
                      {stat.map}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{stat.total_tournaments}</TableCell>
                  <TableCell className="text-right text-primary font-semibold">
                    {stat.total_participants}
                  </TableCell>
                  <TableCell className="text-right">₹{Math.round(stat.avg_entry_fee)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Mode Popularity */}
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-gaming text-glow-cyan">
              <TrendingUp className="h-5 w-5 text-primary" />
              Game Mode Popularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Tournaments</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modeStats.map((stat) => (
                  <TableRow key={stat.game_mode} className="admin-neon-card">
                    <TableCell className="font-medium capitalize">{stat.game_mode}</TableCell>
                    <TableCell className="text-right">{stat.total_tournaments}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      {stat.total_participants}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Match Type Popularity */}
        <Card className="bg-card/50 backdrop-blur-xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-gaming text-glow-cyan">
              <Users className="h-5 w-5 text-cyan-500" />
              Match Type Popularity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Tournaments</TableHead>
                  <TableHead className="text-right">Participants</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchTypeStats.map((stat) => (
                  <TableRow key={stat.match_type} className="admin-neon-card">
                    <TableCell className="font-medium">{stat.match_type}</TableCell>
                    <TableCell className="text-right">{stat.total_tournaments}</TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      {stat.total_participants}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Entry Fee Analysis */}
      <Card className="bg-card/50 backdrop-blur-xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-gaming text-glow-cyan">
            <DollarSign className="h-5 w-5 text-green-500" />
            Entry Fee Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Entry Fee Range</TableHead>
                <TableHead className="text-right">Tournaments</TableHead>
                <TableHead className="text-right">Participants</TableHead>
                <TableHead className="text-right">Avg Fill Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entryFeeStats.map((stat) => (
                <TableRow key={stat.entry_fee_range} className="admin-neon-card">
                  <TableCell className="font-medium">{stat.entry_fee_range}</TableCell>
                  <TableCell className="text-right">{stat.total_tournaments}</TableCell>
                  <TableCell className="text-right text-primary font-semibold">
                    {stat.total_participants}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`font-semibold ${
                        stat.avg_slots_filled >= 80
                          ? "text-green-500"
                          : stat.avg_slots_filled >= 50
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {Math.round(stat.avg_slots_filled)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentAnalytics;
