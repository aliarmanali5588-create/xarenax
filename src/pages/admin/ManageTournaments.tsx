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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trophy, Key, Award, AlertTriangle, Pencil, Trash2, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

// SECURITY: Tournament Creation Validation Schema
const tournamentSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  map: z.string().min(1, "Map is required"),
  matchType: z.string().min(1, "Match type is required"),
  entryFee: z.number().min(1, "Entry fee must be at least ₹1").max(10000, "Entry fee too high"),
  prizePool: z.number().min(1, "Prize pool must be at least ₹1").max(100000, "Prize pool too high"),
  perKillPrize: z.number().min(0, "Per kill prize cannot be negative").max(1000, "Per kill prize too high"),
  maxSlots: z.number().min(2, "Minimum 2 slots required").max(200, "Maximum 200 slots allowed"),
  dateTime: z.string().refine(
    (dt) => new Date(dt) > new Date(),
    "Start time must be in the future"
  )
});

interface Tournament {
  id: string;
  title: string;
  game_mode: string | null;
  map: string;
  match_type: string;
  start_time: string;
  status: string;
  entry_fee: number;
  prize_pool: number;
  per_kill_prize: number;
  max_slots: number;
  current_slots: number;
}

const ManageTournaments = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    gameMode: "classic",
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
  const [selectedResultTournamentId, setSelectedResultTournamentId] = useState("");
  const [winnerUsername, setWinnerUsername] = useState("");
  const [distributingPrize, setDistributingPrize] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    gameMode: "classic",
    map: "",
    matchType: "",
    entryFee: "",
    prizePool: "",
    perKillPrize: "",
    maxSlots: "",
    dateTime: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedTournamentForRoom, setSelectedTournamentForRoom] = useState<Tournament | null>(null);
  const [roomFormData, setRoomFormData] = useState({
    roomId: "",
    roomPassword: "",
  });
  const [updatingRoom, setUpdatingRoom] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchAllTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .in("status", ["upcoming", "live", "full"])
        .order("start_time", { ascending: true });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
    }
  };

  const fetchAllTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_time", { ascending: false });

      if (error) throw error;
      setAllTournaments(data || []);
    } catch (error) {
      console.error("Error fetching all tournaments:", error);
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
          game_mode: formData.gameMode,
          map: formData.map,
          match_type: formData.matchType,
          entry_fee: parseFloat(formData.entryFee),
          prize_pool: parseFloat(formData.prizePool),
          per_kill_prize: formData.gameMode === 'tdm' ? 0 : (parseFloat(formData.perKillPrize) || 0),
          max_slots: parseInt(formData.maxSlots),
          start_time: new Date(formData.dateTime).toISOString(),
          status: "upcoming",
          created_by: user?.id,
        });

      if (error) {
        console.error("Error creating tournament:", error);
        toast.error("Failed to create tournament");
      } else {
        toast.success("Tournament created successfully!");
        setFormData({
          title: "",
          gameMode: "classic",
          map: "",
          matchType: "",
          entryFee: "",
          prizePool: "",
          perKillPrize: "",
          maxSlots: "100",
          dateTime: "",
        });
        fetchTournaments();
        fetchAllTournaments();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDistributePrize = async () => {
    if (!selectedResultTournamentId || !winnerUsername.trim()) {
      toast.error("Please select a match and enter winner's username");
      return;
    }

    setDistributingPrize(true);

    try {
      // 1. Find the winner in profiles by username
      const { data: winnerProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("username", winnerUsername.trim())
        .maybeSingle();

      if (profileError) throw profileError;
      if (!winnerProfile) {
        toast.error(`User "${winnerUsername}" not found in the system`);
        return;
      }

      // 2. Verify user participated in this match
      const { data: participant, error: participantError } = await supabase
        .from("participants")
        .select("id, payment_status")
        .eq("tournament_id", selectedResultTournamentId)
        .eq("user_id", winnerProfile.id)
        .maybeSingle();

      if (participantError) throw participantError;
      if (!participant) {
        toast.error(`${winnerUsername} did not participate in this match`);
        return;
      }

      if (participant.payment_status !== "paid") {
        toast.error(`${winnerUsername} did not pay for this match`);
        return;
      }

      // 3. Get tournament details
      const { data: tournament, error: tournamentError } = await supabase
        .from("tournaments")
        .select("prize_pool, title")
        .eq("id", selectedResultTournamentId)
        .single();

      if (tournamentError) throw tournamentError;

      // 4. Update participant rank to 1
      await supabase
        .from("participants")
        .update({ rank: 1 })
        .eq("id", participant.id);

      // 5. Credit winner's wallet (read current balance first)
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("wallet_balance, total_winnings")
        .eq("id", winnerProfile.id)
        .single();

      const { error: walletError } = await supabase
        .from("profiles")
        .update({ 
          wallet_balance: (currentProfile?.wallet_balance || 0) + tournament.prize_pool,
          total_winnings: (currentProfile?.total_winnings || 0) + tournament.prize_pool
        })
        .eq("id", winnerProfile.id);

      if (walletError) throw walletError;

      // 6. Record transaction
      await supabase.from("transactions").insert({
        user_id: winnerProfile.id,
        amount: tournament.prize_pool,
        type: "contest_win",
        status: "success",
        description: `Prize for winning ${tournament.title}`
      });

      // 7. Close match
      await supabase
        .from("tournaments")
        .update({ status: "completed" })
        .eq("id", selectedResultTournamentId);

      // 8. Notify winner
      await supabase.from("notifications").insert({
        user_id: winnerProfile.id,
        title: "🏆 Victory!",
        message: `Congratulations! You won ₹${tournament.prize_pool} in ${tournament.title}. Prize credited to your wallet!`,
        type: "match"
      });

      toast.success(`₹${tournament.prize_pool} distributed to ${winnerUsername}!`);
      setWinnerUsername("");
      setSelectedResultTournamentId("");
      fetchTournaments();
      fetchAllTournaments();
    } catch (error) {
      console.error("Error distributing prize:", error);
      toast.error("Failed to distribute prize");
    } finally {
      setDistributingPrize(false);
    }
  };

  const handleEditClick = (tournament: Tournament) => {
    setEditingTournament(tournament);
    setEditFormData({
      title: tournament.title,
      gameMode: tournament.game_mode || 'classic',
      map: tournament.map,
      matchType: tournament.match_type,
      entryFee: tournament.entry_fee.toString(),
      prizePool: tournament.prize_pool.toString(),
      perKillPrize: tournament.per_kill_prize.toString(),
      maxSlots: tournament.max_slots.toString(),
      dateTime: new Date(tournament.start_time).toISOString().slice(0, 16),
    });
    setEditModalOpen(true);
  };

  const handleUpdateTournament = async () => {
    if (!editingTournament) return;

    try {
      const { error } = await supabase
        .from("tournaments")
        .update({
          title: editFormData.title,
          game_mode: editFormData.gameMode,
          map: editFormData.map,
          match_type: editFormData.matchType,
          entry_fee: parseFloat(editFormData.entryFee),
          prize_pool: parseFloat(editFormData.prizePool),
          per_kill_prize: editFormData.gameMode === 'tdm' ? 0 : (parseFloat(editFormData.perKillPrize) || 0),
          max_slots: parseInt(editFormData.maxSlots),
          start_time: new Date(editFormData.dateTime).toISOString(),
        })
        .eq("id", editingTournament.id);

      if (error) throw error;

      toast.success("Tournament updated successfully!");
      setEditModalOpen(false);
      setEditingTournament(null);
      fetchAllTournaments();
      fetchTournaments();
    } catch (error) {
      console.error("Error updating tournament:", error);
      toast.error("Failed to update tournament");
    }
  };

  const handleCancelClick = (tournamentId: string) => {
    setTournamentToDelete(tournamentId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!tournamentToDelete) return;

    try {
      // Call the cancel_tournament RPC function for automatic refunds
      const { error } = await supabase.rpc("cancel_tournament", {
        match_id: tournamentToDelete,
      });

      if (error) throw error;

      toast.success("Tournament cancelled & all participants refunded!");
      setDeleteDialogOpen(false);
      setTournamentToDelete(null);
      fetchAllTournaments();
      fetchTournaments();
    } catch (error) {
      console.error("Error cancelling tournament:", error);
      toast.error("Failed to cancel tournament");
    }
  };

  const handleManageRoomClick = async (tournament: Tournament) => {
    setSelectedTournamentForRoom(tournament);
    
    // Fetch existing room credentials if any
    try {
      const { data, error } = await supabase
        .from("tournament_secrets")
        .select("room_id, room_password")
        .eq("tournament_id", tournament.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRoomFormData({
          roomId: data.room_id || "",
          roomPassword: data.room_password || "",
        });
      } else {
        setRoomFormData({ roomId: "", roomPassword: "" });
      }
    } catch (error) {
      console.error("Error fetching room credentials:", error);
      setRoomFormData({ roomId: "", roomPassword: "" });
    }

    setRoomModalOpen(true);
  };

  const handleSaveRoomCredentials = async () => {
    if (!selectedTournamentForRoom || !roomFormData.roomId || !roomFormData.roomPassword) {
      toast.error("Please fill all room details");
      return;
    }

    setUpdatingRoom(true);

    try {
      // Debug: Check current auth status
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("Current user:", user?.id, user?.email);
      
      if (authError || !user) {
        toast.error("Authentication error. Please log in again.");
        setUpdatingRoom(false);
        return;
      }

      // Use upsert to handle both insert and update
      const { error: upsertError } = await supabase
        .from("tournament_secrets")
        .upsert(
          {
            tournament_id: selectedTournamentForRoom.id,
            room_id: roomFormData.roomId,
            room_password: roomFormData.roomPassword,
          },
          { onConflict: "tournament_id", ignoreDuplicates: false }
        );

      if (upsertError) {
        console.error("Upsert error details:", {
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code
        });
        toast.error(`Database error: ${upsertError.message}`);
        setUpdatingRoom(false);
        return;
      }

      // Update tournament status to 'live'
      await supabase
        .from("tournaments")
        .update({ status: "live" })
        .eq("id", selectedTournamentForRoom.id);

      // Get all paid participants
      const { data: participants } = await supabase
        .from("participants")
        .select("user_id")
        .eq("tournament_id", selectedTournamentForRoom.id)
        .eq("payment_status", "paid");

      // Send notification to all participants
      if (participants && participants.length > 0) {
        const notifications = participants.map(p => ({
          user_id: p.user_id,
          title: "🔴 MATCH IS LIVE!",
          message: `Room ID for ${selectedTournamentForRoom.title} is now available! The match is LIVE. Check "My Matches" section to get room details.`,
          type: "match"
        }));

        await supabase.from("notifications").insert(notifications);
      }

      toast.success(`Room details updated & ${participants?.length || 0} participants notified!`);
      setRoomModalOpen(false);
      setRoomFormData({ roomId: "", roomPassword: "" });
      setSelectedTournamentForRoom(null);
      fetchAllTournaments();
      fetchTournaments();
    } catch (error: any) {
      console.error("Error updating room details:", error);
      toast.error(error?.message || "Failed to update room details");
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

            {/* Game Mode Selection */}
            <div className="space-y-2">
              <Label htmlFor="gameMode" className="text-foreground">Game Mode</Label>
              <Select 
                value={formData.gameMode} 
                onValueChange={(val) => setFormData({ ...formData, gameMode: val, map: "", maxSlots: val === 'tdm' ? '2' : '100' })}
              >
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold">
                  <SelectValue placeholder="Select game mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic (Battle Royale)</SelectItem>
                  <SelectItem value="tdm">TDM (Arena)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Map Selection */}
            <div className="space-y-2">
              <Label htmlFor="map" className="text-foreground">Map</Label>
              <Select value={formData.map} onValueChange={(val) => setFormData({ ...formData, map: val })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold">
                  <SelectValue placeholder="Select map" />
                </SelectTrigger>
                <SelectContent>
                  {formData.gameMode === 'classic' ? (
                    <>
                      <SelectItem value="Erangel">Erangel</SelectItem>
                      <SelectItem value="Livik">Livik</SelectItem>
                      <SelectItem value="Miramar">Miramar</SelectItem>
                      <SelectItem value="Sanhok">Sanhok</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Hangar">Hangar</SelectItem>
                      <SelectItem value="Ruins">Ruins</SelectItem>
                      <SelectItem value="Santorini">Santorini</SelectItem>
                      <SelectItem value="Library">Library</SelectItem>
                    </>
                  )}
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
              <Label htmlFor="perKillPrize" className="text-foreground">
                Per Kill Prize (₹) {formData.gameMode === 'tdm' && <span className="text-muted-foreground text-xs">(Disabled for TDM)</span>}
              </Label>
              <Input
                id="perKillPrize"
                type="number"
                placeholder="10"
                value={formData.gameMode === 'tdm' ? '0' : formData.perKillPrize}
                onChange={(e) => setFormData({ ...formData, perKillPrize: e.target.value })}
                disabled={formData.gameMode === 'tdm'}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold disabled:opacity-50"
              />
            </div>

            {/* Max Slots */}
            <div className="space-y-2">
              <Label htmlFor="maxSlots" className="text-foreground">Max Slots</Label>
              {formData.gameMode === 'tdm' ? (
                <Select 
                  value={formData.maxSlots} 
                  onValueChange={(val) => setFormData({ ...formData, maxSlots: val })}
                >
                  <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">1v1 Duel</SelectItem>
                    <SelectItem value="4">2v2 Duo</SelectItem>
                    <SelectItem value="8">4v4 Squad</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id="maxSlots"
                  type="number"
                  placeholder="100"
                  value={formData.maxSlots}
                  onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                  className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
                />
              )}
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

      {/* Manage Tournaments Table */}
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
              <Select value={selectedResultTournamentId} onValueChange={setSelectedResultTournamentId}>
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Choose match" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.title} - {tournament.map} {tournament.match_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="winner">Winner Username</Label>
              <Input
                id="winner"
                placeholder="Enter winner's username"
                value={winnerUsername}
                onChange={(e) => setWinnerUsername(e.target.value)}
                className="bg-background/50 border-border"
              />
            </div>
          </div>
          <Button 
            onClick={handleDistributePrize}
            disabled={distributingPrize}
            className="bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80 font-gaming"
          >
            <Award className="mr-2 h-5 w-5" />
            {distributingPrize ? "Processing..." : "Distribute Prize"}
          </Button>
        </CardContent>
      </Card>

      {/* Manage Tournaments Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <List className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-gaming text-foreground">
              Manage Tournaments
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Entry Fee</TableHead>
                  <TableHead>Slots</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTournaments.map((tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell className="font-medium">{tournament.title}</TableCell>
                    <TableCell>{new Date(tournament.start_time).toLocaleString('en-US', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}</TableCell>
                    <TableCell>₹{tournament.entry_fee}</TableCell>
                    <TableCell>{tournament.current_slots}/{tournament.max_slots}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                        tournament.status === 'live' ? 'bg-red-500/20 text-red-400 animate-pulse' :
                        tournament.status === 'full' ? 'bg-yellow-500/20 text-yellow-400' :
                        tournament.status === 'open' ? 'bg-green-500/20 text-green-400' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {tournament.status === 'upcoming' ? '📅 Upcoming' :
                         tournament.status === 'live' ? '🔴 LIVE' :
                         tournament.status === 'full' ? '🔒 Full' :
                         tournament.status === 'open' ? '✅ Open' :
                         tournament.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleManageRoomClick(tournament)}
                          className="border-cyan-400/30 hover:bg-cyan-400/10"
                          title="Manage Room Credentials"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(tournament)}
                          className="border-admin-gold/30 hover:bg-admin-gold/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelClick(tournament.id)}
                          className="border-destructive/30 hover:bg-destructive/10"
                          title="Cancel & Refund All"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Tournament Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl bg-background border-admin-gold/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gaming text-admin-gold">Edit Tournament</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Tournament Title</Label>
                <Input
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="bg-background/50 border-admin-red/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Game Mode</Label>
                <Select 
                  value={editFormData.gameMode} 
                  onValueChange={(val) => setEditFormData({ ...editFormData, gameMode: val, map: "" })}
                >
                  <SelectTrigger className="bg-background/50 border-admin-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic (Battle Royale)</SelectItem>
                    <SelectItem value="tdm">TDM (Arena)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Map</Label>
                <Select value={editFormData.map} onValueChange={(val) => setEditFormData({ ...editFormData, map: val })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {editFormData.gameMode === 'classic' ? (
                      <>
                        <SelectItem value="Erangel">Erangel</SelectItem>
                        <SelectItem value="Livik">Livik</SelectItem>
                        <SelectItem value="Miramar">Miramar</SelectItem>
                        <SelectItem value="Sanhok">Sanhok</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Hangar">Hangar</SelectItem>
                        <SelectItem value="Ruins">Ruins</SelectItem>
                        <SelectItem value="Santorini">Santorini</SelectItem>
                        <SelectItem value="Library">Library</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Match Type</Label>
                <Select value={editFormData.matchType} onValueChange={(val) => setEditFormData({ ...editFormData, matchType: val })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solo">Solo</SelectItem>
                    <SelectItem value="Duo">Duo</SelectItem>
                    <SelectItem value="Squad">Squad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Entry Fee (₹)</Label>
                <Input
                  type="number"
                  value={editFormData.entryFee}
                  onChange={(e) => setEditFormData({ ...editFormData, entryFee: e.target.value })}
                  className="bg-background/50 border-admin-red/30"
                />
              </div>

              <div className="space-y-2">
                <Label>Prize Pool (₹)</Label>
                <Input
                  type="number"
                  value={editFormData.prizePool}
                  onChange={(e) => setEditFormData({ ...editFormData, prizePool: e.target.value })}
                  className="bg-background/50 border-admin-red/30"
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Per Kill Prize (₹) {editFormData.gameMode === 'tdm' && <span className="text-muted-foreground text-xs">(Disabled for TDM)</span>}
                </Label>
                <Input
                  type="number"
                  value={editFormData.gameMode === 'tdm' ? '0' : editFormData.perKillPrize}
                  onChange={(e) => setEditFormData({ ...editFormData, perKillPrize: e.target.value })}
                  disabled={editFormData.gameMode === 'tdm'}
                  className="bg-background/50 border-admin-red/30 disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label>Max Slots</Label>
                {editFormData.gameMode === 'tdm' ? (
                  <Select 
                    value={editFormData.maxSlots} 
                    onValueChange={(val) => setEditFormData({ ...editFormData, maxSlots: val })}
                  >
                    <SelectTrigger className="bg-background/50 border-admin-red/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">1v1 Duel</SelectItem>
                      <SelectItem value="4">2v2 Duo</SelectItem>
                      <SelectItem value="8">4v4 Squad</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type="number"
                    value={editFormData.maxSlots}
                    onChange={(e) => setEditFormData({ ...editFormData, maxSlots: e.target.value })}
                    className="bg-background/50 border-admin-red/30"
                  />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Start Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={editFormData.dateTime}
                  onChange={(e) => setEditFormData({ ...editFormData, dateTime: e.target.value })}
                  className="bg-background/50 border-admin-red/30"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTournament} className="bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80">
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Credentials Modal */}
      <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent className="max-w-md bg-background border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gaming text-cyan-400 flex items-center gap-2">
              <Key className="h-6 w-6" />
              Manage Room Credentials
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTournamentForRoom && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Tournament</p>
                <p className="font-semibold">{selectedTournamentForRoom.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(selectedTournamentForRoom.start_time).toLocaleString('en-US', { 
                    day: '2-digit', 
                    month: 'short', 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="roomIdInput">Room ID</Label>
              <Input
                id="roomIdInput"
                placeholder="Enter Room ID"
                value={roomFormData.roomId}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomId: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomPasswordInput">Room Password</Label>
              <Input
                id="roomPasswordInput"
                placeholder="Enter Password"
                value={roomFormData.roomPassword}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomPassword: e.target.value })}
                className="bg-background/50 border-border"
              />
            </div>

            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-3">
              <p className="text-xs text-cyan-400 font-semibold">⚡ What happens when you save:</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>✓ Tournament status changes to <span className="text-red-400 font-semibold">LIVE</span></li>
                <li>✓ All paid participants get notified instantly</li>
                <li>✓ Room credentials become visible to participants</li>
              </ul>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setRoomModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveRoomCredentials} 
                disabled={updatingRoom}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {updatingRoom ? "Saving..." : "Save & Go LIVE"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel & Refund Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Tournament & Refund All Participants?</AlertDialogTitle>
            <AlertDialogDescription>
              This will:
              <br />• Cancel the tournament permanently
              <br />• Refund entry fees to all paid participants
              <br />• Send refund notifications to all users
              <br />• Remove all participants from the match
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Tournament</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/80">
              Cancel & Refund All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageTournaments;
