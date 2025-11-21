import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trophy, Key, Award, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// SECURITY: Tournament Creation Validation Schema
const tournamentSchema = z.object({
  title: z.string().trim().min(5, "Title too short").max(100, "Title too long"),
  map: z.string().min(1, "Map is required"),
  matchType: z.string().min(1, "Match type is required"),
  entryFee: z.number().min(1, "Entry fee must be at least ₹1").max(10000, "Entry fee too high"),
  prizePool: z.number().min(1, "Prize pool must be at least ₹1"),
  perKillPrize: z.number().min(0, "Per kill prize cannot be negative").max(1000, "Per kill prize too high"),
  maxSlots: z.number().min(10, "Minimum 10 slots required").max(200, "Maximum 200 slots allowed"),
  dateTime: z.string().refine(
    (dt) => new Date(dt) > new Date(),
    "Start time must be in the future"
  )
}).refine(
  (data) => data.prizePool < (data.entryFee * data.maxSlots * 0.9),
  {
    message: "Prize pool exceeds 90% of revenue - financially unsustainable!",
    path: ["prizePool"]
  }
);

interface Tournament {
  id: string;
  title: string;
  map: string;
  match_type: string;
  start_time: string;
  status: string;
}

const ManageTournaments = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    map: "",
    matchType: "",
    entryFee: "",
    prizePool: "",
    perKillPrize: "",
    maxSlots: "100",
    dateTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [roomCredentials, setRoomCredentials] = useState({
    roomId: "",
    roomPassword: "",
  });
  const [updatingRoom, setUpdatingRoom] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("id, title, map, match_type, start_time, status")
        .in("status", ["open", "full"])
        .order("start_time", { ascending: true });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const calculateProfit = () => {
    const entry = parseFloat(formData.entryFee) || 0;
    const prize = parseFloat(formData.prizePool) || 0;
    const slots = parseInt(formData.maxSlots) || 100;
    const estimatedRevenue = entry * slots;
    return estimatedRevenue - prize;
  };

  const handleCreateMatch = async () => {
    if (!formData.title || !formData.map || !formData.matchType || !formData.entryFee || !formData.prizePool || !formData.dateTime) {
      toast.error("Please fill all required fields");
      return;
    }

    // SECURITY: Validate tournament data
    const tournamentData = {
      title: formData.title,
      map: formData.map,
      matchType: formData.matchType,
      entryFee: parseFloat(formData.entryFee) || 0,
      prizePool: parseFloat(formData.prizePool) || 0,
      perKillPrize: parseFloat(formData.perKillPrize) || 0,
      maxSlots: parseInt(formData.maxSlots) || 100,
      dateTime: formData.dateTime
    };

    try {
      tournamentSchema.parse(tournamentData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("tournaments")
        .insert({
          title: formData.title,
          map: formData.map,
          match_type: formData.matchType,
          entry_fee: parseFloat(formData.entryFee),
          prize_pool: parseFloat(formData.prizePool),
          per_kill_prize: parseFloat(formData.perKillPrize) || 0,
          max_slots: parseInt(formData.maxSlots),
          start_time: new Date(formData.dateTime).toISOString(),
          status: "open",
          created_by: user?.id,
        });

      if (error) {
        console.error("Error creating tournament:", error);
        toast.error("Failed to create tournament");
      } else {
        toast.success("Tournament created successfully!");
        setFormData({
          title: "",
          map: "",
          matchType: "",
          entryFee: "",
          prizePool: "",
          perKillPrize: "",
          maxSlots: "100",
          dateTime: "",
        });
        fetchTournaments(); // Refresh tournament list
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoomDetails = async () => {
    if (!selectedTournamentId || !roomCredentials.roomId || !roomCredentials.roomPassword) {
      toast.error("Please select a tournament and fill all room details");
      return;
    }

    setUpdatingRoom(true);

    try {
      // Check if tournament_secrets already exists for this tournament
      const { data: existingSecret, error: checkError } = await supabase
        .from("tournament_secrets")
        .select("id")
        .eq("tournament_id", selectedTournamentId)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingSecret) {
        // Update existing secret
        const { error } = await supabase
          .from("tournament_secrets")
          .update({
            room_id: roomCredentials.roomId,
            room_password: roomCredentials.roomPassword,
          })
          .eq("tournament_id", selectedTournamentId);

        if (error) throw error;
      } else {
        // Insert new secret
        const { error } = await supabase
          .from("tournament_secrets")
          .insert({
            tournament_id: selectedTournamentId,
            room_id: roomCredentials.roomId,
            room_password: roomCredentials.roomPassword,
          });

        if (error) throw error;
      }

      toast.success("Room details updated successfully! Paid participants can now see them.");
      setRoomCredentials({ roomId: "", roomPassword: "" });
      setSelectedTournamentId("");
    } catch (error) {
      console.error("Error updating room details:", error);
      toast.error("Failed to update room details");
    } finally {
      setUpdatingRoom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Match Form */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-2xl font-gaming text-admin-gold">
              Create New Match
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Title */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-foreground">Tournament Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Elite Squad Championship"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>

            {/* Map Selection */}
            <div className="space-y-2">
              <Label htmlFor="map" className="text-foreground">Map</Label>
              <Select value={formData.map} onValueChange={(val) => setFormData({ ...formData, map: val })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Erangel">Erangel</SelectItem>
                  <SelectItem value="Livik">Livik</SelectItem>
                  <SelectItem value="Miramar">Miramar</SelectItem>
                  <SelectItem value="Sanhok">Sanhok</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="matchType" className="text-foreground">Match Type</Label>
              <Select value={formData.matchType} onValueChange={(val) => setFormData({ ...formData, matchType: val })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Solo">Solo</SelectItem>
                  <SelectItem value="Duo">Duo</SelectItem>
                  <SelectItem value="Squad">Squad</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry Fee */}
            <div className="space-y-2">
              <Label htmlFor="entryFee" className="text-foreground">Entry Fee (₹)</Label>
              <Input
                id="entryFee"
                type="number"
                placeholder="30"
                value={formData.entryFee}
                onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>

            {/* Prize Pool */}
            <div className="space-y-2">
              <Label htmlFor="prizePool" className="text-foreground">Prize Pool (₹)</Label>
              <Input
                id="prizePool"
                type="number"
                placeholder="1000"
                value={formData.prizePool}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>

            {/* Per Kill Prize */}
            <div className="space-y-2">
              <Label htmlFor="perKillPrize" className="text-foreground">Per Kill Prize (₹)</Label>
              <Input
                id="perKillPrize"
                type="number"
                placeholder="10"
                value={formData.perKillPrize}
                onChange={(e) => setFormData({ ...formData, perKillPrize: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>

            {/* Max Slots */}
            <div className="space-y-2">
              <Label htmlFor="maxSlots" className="text-foreground">Max Slots</Label>
              <Input
                id="maxSlots"
                type="number"
                placeholder="100"
                value={formData.maxSlots}
                onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="dateTime" className="text-foreground">Start Date & Time</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
              />
            </div>
          </div>

          {/* Profit Calculator */}
          <div className={`p-4 border rounded-lg ${
            calculateProfit() < 0 
              ? "bg-destructive/10 border-destructive/30" 
              : "bg-admin-gold/10 border-admin-gold/30"
          }`}>
            <p className="text-sm text-muted-foreground mb-2">Estimated Profit ({formData.maxSlots || 100} Slots)</p>
            <p className={`text-3xl font-gaming font-bold ${
              calculateProfit() < 0 ? "text-destructive" : "text-admin-gold"
            }`}>
              ₹{calculateProfit().toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue: ₹{((parseFloat(formData.entryFee) || 0) * (parseInt(formData.maxSlots) || 100)).toLocaleString()} - Prize: ₹{(parseFloat(formData.prizePool) || 0).toLocaleString()}
            </p>
            {calculateProfit() < 0 && (
              <div className="mt-3 flex items-start gap-2 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">Warning: Tournament will lose money!</p>
              </div>
            )}
          </div>

          <Button
            onClick={handleCreateMatch}
            className="w-full bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80 font-gaming text-lg"
            disabled={loading}
          >
            <Trophy className="mr-2 h-5 w-5" />
            {loading ? "Creating..." : "Create Tournament"}
          </Button>
        </CardContent>
      </Card>

      {/* Update Room Details */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Key className="h-6 w-6 text-cyan-400" />
            <CardTitle className="text-xl font-gaming text-foreground">
              Update Room Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matchSelect">Select Match</Label>
              <Select value={selectedTournamentId} onValueChange={setSelectedTournamentId}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Choose match" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.map} {tournament.match_type} - {new Date(tournament.start_time).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                placeholder="Enter Room ID"
                value={roomCredentials.roomId}
                onChange={(e) => setRoomCredentials({ ...roomCredentials, roomId: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter Password"
                value={roomCredentials.roomPassword}
                onChange={(e) => setRoomCredentials({ ...roomCredentials, roomPassword: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>
          </div>
          <Button 
            onClick={handleUpdateRoomDetails}
            disabled={updatingRoom}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            {updatingRoom ? "Updating..." : "Update & Notify Players"}
          </Button>
        </CardContent>
      </Card>

      {/* Match Result Entry */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-foreground">
              Match Result Entry
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resultMatch">Select Completed Match</Label>
              <Select>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Choose match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match1">Erangel Solo - 6:00 PM (Completed)</SelectItem>
                  <SelectItem value="match2">Livik Squad - 4:00 PM (Completed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="winner">Winner Username</Label>
              <Input
                id="winner"
                placeholder="Enter winner's username"
                className="bg-background/50 border-border"
              />
            </div>
          </div>
          <Button className="bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80 font-gaming">
            <Award className="mr-2 h-5 w-5" />
            Distribute Prize
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageTournaments;
