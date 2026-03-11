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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Trophy, Key, Award, AlertTriangle, Pencil, Trash2, List, Users, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

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

// 300+ Tournament Name Presets
const TOURNAMENT_PRESETS = [
  // Battle Royale - Solo
  "Solo Showdown", "Lone Wolf Arena", "Solo Supremacy", "King of Solo", "Solo Slayer Cup",
  "Solo Dominator", "One Man Army", "Solo Champion League", "Survivor Solo", "Solo Thunder",
  "Solo Warrior Cup", "Solo Fire", "Solo Beast Mode", "Last Man Standing", "Solo Blitz",
  "Solo Rampage", "Solo Storm", "Sniper Solo Cup", "Solo Gladiator", "Solo Rush Hour",
  // Battle Royale - Duo
  "Duo Deathmatch", "Duo Demolition", "Dynamic Duo Cup", "Duo Rampage", "Duo Clash",
  "Duo Strike Force", "Duo Thunder", "Duo Warriors", "Partner in Crime", "Duo Blitz",
  "Duo Legends Cup", "Duo Storm", "Double Trouble", "Duo Champions", "Duo Assault",
  // Battle Royale - Squad
  "Squad Showdown", "Squad Legends", "Team Fury Cup", "Squad Champions", "Elite Squad",
  "Squad Battle Royale", "Squad Domination", "Ultimate Squad War", "Squad Clash", "Squad Strike",
  "Pro Squad League", "Squad Arena", "Squad Warriors", "Squad Thunder Cup", "Squad Blitz",
  "Squad Carnage", "Royal Squad Cup", "Squad Firestorm", "Squad Assault", "Squad Victory",
  // Map Specific - Erangel
  "Erangel Showdown", "Battle of Erangel", "Erangel Warriors", "Erangel Legends Cup",
  "Erangel Championship", "Erangel Arena", "Erangel Classic Cup", "Erangel Mayhem",
  "Erangel Kings", "Erangel Conquest", "Erangel Fury", "Erangel Storm",
  "Erangel Battle Royale", "Erangel Pro Cup", "Erangel Elite",
  // Map Specific - Livik
  "Livik Blitz", "Livik Rush", "Livik Lightning Cup", "Livik Sprint",
  "Livik Express", "Livik Thunder", "Livik Speed Run", "Livik Quick Cup",
  "Livik Warriors", "Livik Arena", "Livik Flash", "Livik Rapid Fire",
  // Map Specific - Miramar
  "Miramar Madness", "Desert Storm", "Miramar Warriors", "Miramar Legends",
  "Desert Clash", "Miramar Showdown", "Sand Storm Cup", "Miramar Arena",
  "Desert Kings", "Miramar Fury", "Miramar Championship", "Desert Domination",
  // Map Specific - Sanhok
  "Sanhok Survival", "Jungle Warfare", "Sanhok Warriors", "Sanhok Legends",
  "Jungle Cup", "Sanhok Rush", "Sanhok Arena", "Sanhok Thunder",
  "Jungle Rampage", "Sanhok Champions", "Sanhok Fury", "Sanhok Storm",
  // TDM
  "TDM Clash", "Arena Deathmatch", "TDM Warriors", "TDM Champions Cup",
  "Arena Showdown", "TDM Legends", "Arena Thunder", "TDM Rampage",
  "TDM Pro Cup", "Arena Blitz", "TDM Fury", "Close Combat Cup",
  "TDM Championship", "Arena Storm", "TDM Kings", "Arena Masters",
  "TDM Elite Cup", "Arena Legends", "TDM Supreme", "CQB Masters",
  // Weekly/Daily
  "Monday Mayhem", "Tuesday Takedown", "Wednesday Warriors", "Thursday Thunder",
  "Friday Fury", "Saturday Showdown", "Sunday Slam", "Daily Dose Cup",
  "Weekly Warfare", "Weekend Warrior Cup", "Midnight Madness", "Dawn Patrol Cup",
  "Night Owl Cup", "Evening Clash", "Afternoon Arena", "Morning Mayhem",
  // Themed
  "Fire & Fury Cup", "Blood Moon Tournament", "Dragon Slayer Cup", "Phoenix Rising",
  "Thunder Strike Cup", "Lightning League", "Storm Breaker Cup", "Iron Fist Cup",
  "Shadow Warriors", "Dark Knight Cup", "Golden Eagle Cup", "Silver Bullet Cup",
  "Diamond League", "Platinum Cup", "Bronze Battle", "Crystal Cup",
  "Neon Nights Cup", "Cyber Clash", "Digital Warfare", "Matrix Cup",
  // Prize Themed
  "₹100 Quick Cup", "₹500 Power Cup", "₹1000 Grand Cup", "₹2000 Mega Cup",
  "₹5000 Super Cup", "₹10000 Ultimate Cup", "Low Entry Cup", "High Stakes Cup",
  "Quick Cash Cup", "Big Prize Cup", "Jackpot Cup", "Bonus Cup",
  // Pro/Competitive
  "Pro League Season 1", "Amateur Cup", "Qualifier Round 1", "Semi Finals Cup",
  "Grand Finals", "All Stars Cup", "Invitational Cup", "Open Qualifier",
  "Ranked Cup", "Competitive Cup", "Tryhard Cup", "Sweat Fest Cup",
  "Grind Cup", "Practice Cup", "Warm Up Cup", "Scrims Cup",
  // Fun Themed
  "No Scope Challenge", "Pistol Only Cup", "Melee Madness", "Crossbow Cup",
  "Shotgun Showdown", "SMG Rush Cup", "Sniper Elite Cup", "Pan Warriors Cup",
  "Car Race Cup", "Bridge Camp Cup", "Hot Drop Cup", "Safe Zone Cup",
  "Pochinki Cup", "School Drop Cup", "Bootcamp Cup", "Military Base Cup",
  // Indian Themed
  "Desi Warriors Cup", "Hindustan Cup", "Indian Pro League", "Bharat Cup",
  "Desh Ka Champion", "Indian Legends Cup", "Namaste Cup", "Jai Hind Cup",
  "Tiger Cup", "Peacock Cup", "Mango Cup", "Cricket Fan Cup",
  // Seasonal
  "Summer Slam Cup", "Winter Warfare", "Spring Sprint Cup", "Autumn Arena",
  "Monsoon Madness", "Holi Special Cup", "Diwali Dhamaka", "Eid Special Cup",
  "New Year Blast", "Republic Day Cup", "Independence Day Cup", "Festival Cup",
  // Intensity Themed
  "Bloodbath Cup", "Massacre Cup", "Annihilation Cup", "Destruction Cup",
  "Devastation Cup", "Obliteration Cup", "Carnage Cup", "Chaos Cup",
  "Havoc Cup", "Pandemonium Cup", "Apocalypse Cup", "Armageddon Cup",
  // Level Themed
  "Beginner Cup", "Intermediate Cup", "Advanced Cup", "Expert Cup",
  "Master Cup", "Grandmaster Cup", "Legend Cup", "Mythic Cup",
  "Immortal Cup", "Conqueror Cup", "Ace Cup", "Crown Cup",
  // Crew/Clan
  "Clan Wars", "Crew Battle Cup", "Guild Cup", "Alliance Cup",
  "Brotherhood Cup", "Syndicate Cup", "Empire Cup", "Kingdom Cup",
  "Dynasty Cup", "Legion Cup", "Regiment Cup", "Battalion Cup",
  // Numbers
  "Battle #1", "Battle #2", "Battle #3", "Match #4", "Match #5",
  "Round #6", "Round #7", "Game #8", "Game #9", "Match #10",
  "Cup #11", "Cup #12", "Series #13", "Series #14", "Round #15",
  // Time Based
  "Rush Hour Cup", "Prime Time Cup", "Late Night Cup", "Early Bird Cup",
  "Golden Hour Cup", "Happy Hour Cup", "Power Hour Cup", "Zero Hour Cup",
  // Animal Themed
  "Tiger Clash", "Eagle Eye Cup", "Wolf Pack Cup", "Cobra Strike Cup",
  "Lion King Cup", "Shark Attack Cup", "Falcon Cup", "Scorpion Cup",
  "Dragon Cup", "Panther Cup", "Rhino Rush Cup", "Hawk Eye Cup",
];

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

interface ParticipantWithProfile {
  id: string;
  pubg_id: string;
  payment_status: string;
  joined_at: string;
  rank: number | null;
  kills: number | null;
  prize_amount: number | null;
  user_id: string;
  username?: string;
  ign?: string;
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
  const [selectedResultTournament, setSelectedResultTournament] = useState<Tournament | null>(null);
  const [prizeParticipants, setPrizeParticipants] = useState<ParticipantWithProfile[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<string[]>([]);
  const [distributingPrize, setDistributingPrize] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "", gameMode: "classic", map: "", matchType: "",
    entryFee: "", prizePool: "", perKillPrize: "", maxSlots: "", dateTime: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
  const [allTournaments, setAllTournaments] = useState<Tournament[]>([]);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedTournamentForRoom, setSelectedTournamentForRoom] = useState<Tournament | null>(null);
  const [roomFormData, setRoomFormData] = useState({ roomId: "", roomPassword: "" });
  const [updatingRoom, setUpdatingRoom] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [selectedTournamentForParticipants, setSelectedTournamentForParticipants] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [loadingPrizeParticipants, setLoadingPrizeParticipants] = useState(false);

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

  // Fetch participants with usernames (without FK join)
  const fetchParticipantsWithProfiles = async (tournamentId: string): Promise<ParticipantWithProfile[]> => {
    const { data: rawParticipants, error } = await supabase
      .from("participants")
      .select("id, pubg_id, payment_status, joined_at, rank, kills, prize_amount, user_id")
      .eq("tournament_id", tournamentId)
      .order("joined_at", { ascending: true });

    if (error) throw error;
    if (!rawParticipants || rawParticipants.length === 0) return [];

    // Fetch profiles for all participant user_ids
    const userIds = rawParticipants.map(p => p.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, ign")
      .in("id", userIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    return rawParticipants.map(p => ({
      ...p,
      username: profileMap.get(p.user_id)?.username || 'Unknown',
      ign: profileMap.get(p.user_id)?.ign || 'N/A',
    }));
  };

  const calculateProfit = () => {
    const entry = parseFloat(formData.entryFee) || 0;
    const prize = parseFloat(formData.prizePool) || 0;
    const slots = parseInt(formData.maxSlots) || 100;
    return entry * slots - prize;
  };

  const handleCreateMatch = async () => {
    if (!formData.title || !formData.map || !formData.matchType || !formData.entryFee || !formData.prizePool || !formData.dateTime) {
      toast.error("Please fill all required fields");
      return;
    }

    const tournamentData = {
      title: formData.title, map: formData.map, matchType: formData.matchType,
      entryFee: parseFloat(formData.entryFee) || 0, prizePool: parseFloat(formData.prizePool) || 0,
      perKillPrize: parseFloat(formData.perKillPrize) || 0, maxSlots: parseInt(formData.maxSlots) || 100,
      dateTime: formData.dateTime
    };

    try { tournamentSchema.parse(tournamentData); }
    catch (error) { if (error instanceof z.ZodError) toast.error(error.errors[0].message); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from("tournaments").insert({
        title: formData.title, game_mode: formData.gameMode, map: formData.map,
        match_type: formData.matchType, entry_fee: parseFloat(formData.entryFee),
        prize_pool: parseFloat(formData.prizePool),
        per_kill_prize: formData.gameMode === 'tdm' ? 0 : (parseFloat(formData.perKillPrize) || 0),
        max_slots: parseInt(formData.maxSlots),
        start_time: new Date(formData.dateTime).toISOString(),
        status: "upcoming", created_by: user?.id,
      });

      if (error) { toast.error("Failed to create tournament"); }
      else {
        toast.success("Tournament created successfully!");
        setFormData({ title: "", gameMode: "classic", map: "", matchType: "", entryFee: "", prizePool: "", perKillPrize: "", maxSlots: "100", dateTime: "" });
        fetchTournaments(); fetchAllTournaments();
      }
    } catch { toast.error("An error occurred"); }
    finally { setLoading(false); }
  };

  const getRequiredWinners = (matchType: string, gameMode: string | null, maxSlots: number) => {
    if (gameMode === 'tdm') {
      if (maxSlots === 2) return 1;
      if (maxSlots === 4) return 2;
      if (maxSlots === 8) return 4;
      return 1;
    }
    if (matchType === 'Solo') return 1;
    if (matchType === 'Duo') return 2;
    if (matchType === 'Squad') return 4;
    return 1;
  };

  const handleSelectTournamentForPrize = async (tournamentId: string) => {
    setSelectedResultTournamentId(tournamentId);
    const tournament = tournaments.find(t => t.id === tournamentId);
    setSelectedResultTournament(tournament || null);
    setSelectedWinners([]);

    if (tournament) {
      setLoadingPrizeParticipants(true);
      try {
        const parts = await fetchParticipantsWithProfiles(tournamentId);
        setPrizeParticipants(parts.filter(p => p.payment_status === 'paid'));
      } catch (error) {
        console.error("Error fetching participants for prize:", error);
        toast.error("Failed to load participants");
      } finally {
        setLoadingPrizeParticipants(false);
      }
    }
  };

  const toggleWinnerSelection = (participantUserId: string) => {
    if (!selectedResultTournament) return;
    const requiredWinners = getRequiredWinners(
      selectedResultTournament.match_type,
      selectedResultTournament.game_mode,
      selectedResultTournament.max_slots
    );

    setSelectedWinners(prev => {
      if (prev.includes(participantUserId)) {
        return prev.filter(id => id !== participantUserId);
      }
      if (prev.length >= requiredWinners) {
        toast.error(`Maximum ${requiredWinners} winner(s) allowed`);
        return prev;
      }
      return [...prev, participantUserId];
    });
  };

  const handleDistributePrize = async () => {
    if (!selectedResultTournamentId || !selectedResultTournament) {
      toast.error("Please select a match");
      return;
    }

    const requiredWinners = getRequiredWinners(
      selectedResultTournament.match_type,
      selectedResultTournament.game_mode,
      selectedResultTournament.max_slots
    );

    if (selectedWinners.length !== requiredWinners) {
      toast.error(`Please select exactly ${requiredWinners} winner(s)`);
      return;
    }

    setDistributingPrize(true);
    try {
      const prizePerWinner = selectedResultTournament.prize_pool / requiredWinners;

      for (const winnerUserId of selectedWinners) {
        const participant = prizeParticipants.find(p => p.user_id === winnerUserId);
        if (!participant) continue;

        // Update participant rank
        await supabase.from("participants")
          .update({ rank: 1, prize_amount: prizePerWinner })
          .eq("id", participant.id);

        // Credit winner's wallet
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("wallet_balance, total_winnings")
          .eq("id", winnerUserId)
          .single();

        await supabase.from("profiles")
          .update({
            wallet_balance: (currentProfile?.wallet_balance || 0) + prizePerWinner,
            total_winnings: (currentProfile?.total_winnings || 0) + prizePerWinner
          })
          .eq("id", winnerUserId);

        // Record transaction
        await supabase.from("transactions").insert({
          user_id: winnerUserId, amount: prizePerWinner, type: "contest_win", status: "success",
          description: `Prize for winning ${selectedResultTournament.title}${requiredWinners > 1 ? ` (Team Share)` : ''}`
        });

        // Notify winner
        await supabase.from("notifications").insert({
          user_id: winnerUserId,
          title: "🏆 Victory!",
          message: `Congratulations! You won ₹${prizePerWinner.toFixed(2)} in ${selectedResultTournament.title}. Prize credited to your wallet!`,
          type: "match"
        });
      }

      // Close match
      await supabase.from("tournaments")
        .update({ status: "completed" })
        .eq("id", selectedResultTournamentId);

      toast.success(`Prize pool of ₹${selectedResultTournament.prize_pool} distributed among ${requiredWinners} winner(s)!`);
      setSelectedWinners([]);
      setSelectedResultTournamentId("");
      setSelectedResultTournament(null);
      setPrizeParticipants([]);
      fetchTournaments(); fetchAllTournaments();
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
      title: tournament.title, gameMode: tournament.game_mode || 'classic',
      map: tournament.map, matchType: tournament.match_type,
      entryFee: tournament.entry_fee.toString(), prizePool: tournament.prize_pool.toString(),
      perKillPrize: tournament.per_kill_prize.toString(), maxSlots: tournament.max_slots.toString(),
      dateTime: new Date(tournament.start_time).toISOString().slice(0, 16),
    });
    setEditModalOpen(true);
  };

  const handleUpdateTournament = async () => {
    if (!editingTournament) return;
    try {
      const { error } = await supabase.from("tournaments").update({
        title: editFormData.title, game_mode: editFormData.gameMode, map: editFormData.map,
        match_type: editFormData.matchType, entry_fee: parseFloat(editFormData.entryFee),
        prize_pool: parseFloat(editFormData.prizePool),
        per_kill_prize: editFormData.gameMode === 'tdm' ? 0 : (parseFloat(editFormData.perKillPrize) || 0),
        max_slots: parseInt(editFormData.maxSlots),
        start_time: new Date(editFormData.dateTime).toISOString(),
      }).eq("id", editingTournament.id);
      if (error) throw error;
      toast.success("Tournament updated!"); setEditModalOpen(false); setEditingTournament(null);
      fetchAllTournaments(); fetchTournaments();
    } catch { toast.error("Failed to update tournament"); }
  };

  const handleCancelClick = (id: string) => { setTournamentToDelete(id); setDeleteDialogOpen(true); };

  const handleConfirmCancel = async () => {
    if (!tournamentToDelete) return;
    try {
      const { error } = await supabase.rpc("cancel_tournament", { match_id: tournamentToDelete });
      if (error) throw error;
      toast.success("Tournament cancelled & all participants refunded!");
      setDeleteDialogOpen(false); setTournamentToDelete(null);
      fetchAllTournaments(); fetchTournaments();
    } catch { toast.error("Failed to cancel tournament"); }
  };

  const handleManageRoomClick = async (tournament: Tournament) => {
    setSelectedTournamentForRoom(tournament);
    try {
      const { data } = await supabase.from("tournament_secrets")
        .select("room_id, room_password").eq("tournament_id", tournament.id).maybeSingle();
      setRoomFormData(data ? { roomId: data.room_id || "", roomPassword: data.room_password || "" } : { roomId: "", roomPassword: "" });
    } catch { setRoomFormData({ roomId: "", roomPassword: "" }); }
    setRoomModalOpen(true);
  };

  const handleSaveRoomCredentials = async () => {
    if (!selectedTournamentForRoom || !roomFormData.roomId || !roomFormData.roomPassword) {
      toast.error("Please fill all room details"); return;
    }
    setUpdatingRoom(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { toast.error("Auth error"); setUpdatingRoom(false); return; }

      const { error: upsertError } = await supabase.from("tournament_secrets").upsert(
        { tournament_id: selectedTournamentForRoom.id, room_id: roomFormData.roomId, room_password: roomFormData.roomPassword },
        { onConflict: "tournament_id", ignoreDuplicates: false }
      );
      if (upsertError) { toast.error(`Error: ${upsertError.message}`); setUpdatingRoom(false); return; }

      await supabase.from("tournaments").update({ status: "live" }).eq("id", selectedTournamentForRoom.id);

      const { data: parts } = await supabase.from("participants")
        .select("user_id").eq("tournament_id", selectedTournamentForRoom.id).eq("payment_status", "paid");

      if (parts?.length) {
        await supabase.from("notifications").insert(
          parts.map(p => ({ user_id: p.user_id, title: "🔴 MATCH IS LIVE!", message: `Room ID for ${selectedTournamentForRoom.title} is now available! Check "My Matches" section.`, type: "match" }))
        );
      }

      toast.success(`Room updated & ${parts?.length || 0} participants notified!`);
      setRoomModalOpen(false); setRoomFormData({ roomId: "", roomPassword: "" });
      setSelectedTournamentForRoom(null); fetchAllTournaments(); fetchTournaments();
    } catch (error: any) { toast.error(error?.message || "Failed"); }
    finally { setUpdatingRoom(false); }
  };

  const handleViewParticipants = async (tournament: Tournament) => {
    setSelectedTournamentForParticipants(tournament);
    setParticipantsModalOpen(true);
    setLoadingParticipants(true);
    try {
      const parts = await fetchParticipantsWithProfiles(tournament.id);
      setParticipants(parts);
    } catch (error) {
      console.error("Error fetching participants:", error);
      toast.error("Failed to load participants");
    } finally {
      setLoadingParticipants(false);
    }
  };

  // Real-time subscription for participants
  useEffect(() => {
    if (!participantsModalOpen || !selectedTournamentForParticipants) return;
    const channel = supabase
      .channel(`participants-${selectedTournamentForParticipants.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants', filter: `tournament_id=eq.${selectedTournamentForParticipants.id}` },
        async () => {
          try {
            const parts = await fetchParticipantsWithProfiles(selectedTournamentForParticipants.id);
            setParticipants(parts);
          } catch {}
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [participantsModalOpen, selectedTournamentForParticipants]);

  const getTeamAssignments = (participants: ParticipantWithProfile[], matchType: string, gameMode: string | null, maxSlots: number) => {
    let teamSize = 1;
    if (gameMode === 'tdm') {
      if (maxSlots === 4) teamSize = 2;
      else if (maxSlots === 8) teamSize = 4;
    } else {
      if (matchType === 'Duo') teamSize = 2;
      else if (matchType === 'Squad') teamSize = 4;
    }
    if (teamSize === 1) return participants.map((p, i) => ({ team: i + 1, members: [p] }));
    const teams: ParticipantWithProfile[][] = [];
    for (let i = 0; i < participants.length; i += teamSize) teams.push(participants.slice(i, i + teamSize));
    return teams.map((members, i) => ({ team: i + 1, members }));
  };

  const filteredPresets = TOURNAMENT_PRESETS.filter(name =>
    name.toLowerCase().includes(titleSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Create Match Form */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-gold/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-2xl font-gaming text-admin-gold">Create New Match</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tournament Title with Presets */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title" className="text-foreground">Tournament Title</Label>
              <div className="relative">
                <Input
                  id="title"
                  type="text"
                  placeholder="Type or click to select from 300+ presets..."
                  value={formData.title}
                  onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setTitleSearch(e.target.value); }}
                  onFocus={() => setShowPresets(true)}
                  className="bg-background/50 border-admin-red/30 focus:border-admin-gold"
                />
                {showPresets && (
                  <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    <div className="sticky top-0 bg-card p-2 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search names..."
                          value={titleSearch}
                          onChange={(e) => setTitleSearch(e.target.value)}
                          className="pl-8 h-8 text-sm"
                          autoFocus
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-1 text-xs" onClick={() => setShowPresets(false)}>
                        Close
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {filteredPresets.slice(0, 100).map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, title: name });
                            setShowPresets(false);
                            setTitleSearch("");
                          }}
                          className="text-left px-3 py-2 text-sm rounded hover:bg-primary/10 hover:text-primary transition-colors truncate"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                    {filteredPresets.length > 100 && (
                      <p className="text-xs text-muted-foreground text-center py-2">
                        Showing 100 of {filteredPresets.length} results. Type to filter.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Game Mode */}
            <div className="space-y-2">
              <Label className="text-foreground">Game Mode</Label>
              <Select value={formData.gameMode} onValueChange={(val) => setFormData({ ...formData, gameMode: val, map: "", maxSlots: val === 'tdm' ? '2' : '100' })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold"><SelectValue placeholder="Select game mode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="classic">Classic (Battle Royale)</SelectItem>
                  <SelectItem value="tdm">TDM (Arena)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Map */}
            <div className="space-y-2">
              <Label className="text-foreground">Map</Label>
              <Select value={formData.map} onValueChange={(val) => setFormData({ ...formData, map: val })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold"><SelectValue placeholder="Select map" /></SelectTrigger>
                <SelectContent>
                  {formData.gameMode === 'classic' ? (
                    <>{["Erangel", "Livik", "Miramar", "Sanhok"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</>
                  ) : (
                    <>{["Warehouse", "Hangar", "Ruins", "Santorini", "Library"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Match Type */}
            <div className="space-y-2">
              <Label className="text-foreground">Match Type</Label>
              <Select value={formData.matchType} onValueChange={(val) => setFormData({ ...formData, matchType: val })}>
                <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {["Solo", "Duo", "Squad"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Entry Fee (₹)</Label>
              <Input type="number" placeholder="30" value={formData.entryFee} onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })} className="bg-background/50 border-admin-red/30 focus:border-admin-gold" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Prize Pool (₹)</Label>
              <Input type="number" placeholder="1000" value={formData.prizePool} onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })} className="bg-background/50 border-admin-red/30 focus:border-admin-gold" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Per Kill Prize (₹) {formData.gameMode === 'tdm' && <span className="text-muted-foreground text-xs">(Disabled for TDM)</span>}</Label>
              <Input type="number" placeholder="10" value={formData.gameMode === 'tdm' ? '0' : formData.perKillPrize}
                onChange={(e) => setFormData({ ...formData, perKillPrize: e.target.value })}
                disabled={formData.gameMode === 'tdm'}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold disabled:opacity-50" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Max Slots</Label>
              {formData.gameMode === 'tdm' ? (
                <Select value={formData.maxSlots} onValueChange={(val) => setFormData({ ...formData, maxSlots: val })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30 focus:border-admin-gold"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">1v1 Duel (2 players)</SelectItem>
                    <SelectItem value="4">2v2 Duo (4 players)</SelectItem>
                    <SelectItem value="8">4v4 Squad (8 players)</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input type="number" placeholder="100" value={formData.maxSlots}
                  onChange={(e) => setFormData({ ...formData, maxSlots: e.target.value })}
                  className="bg-background/50 border-admin-red/30 focus:border-admin-gold" />
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-foreground">Start Date & Time</Label>
              <Input type="datetime-local" value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="bg-background/50 border-admin-red/30 focus:border-admin-gold" />
            </div>
          </div>

          {/* Profit Calculator */}
          <div className={`p-4 border rounded-lg ${calculateProfit() < 0 ? "bg-destructive/10 border-destructive/30" : "bg-admin-gold/10 border-admin-gold/30"}`}>
            <p className="text-sm text-muted-foreground mb-2">Estimated Profit ({formData.maxSlots || 100} Slots)</p>
            <p className={`text-3xl font-gaming font-bold ${calculateProfit() < 0 ? "text-destructive" : "text-admin-gold"}`}>₹{calculateProfit().toLocaleString()}</p>
            {calculateProfit() < 0 && (
              <div className="mt-3 flex items-start gap-2 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">Warning: Tournament will lose money!</p>
              </div>
            )}
          </div>

          <Button onClick={handleCreateMatch} disabled={loading}
            className="w-full bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80 font-gaming text-lg">
            <Trophy className="mr-2 h-5 w-5" />{loading ? "Creating..." : "Create Tournament"}
          </Button>
        </CardContent>
      </Card>

      {/* Match Result Entry - Now with participant selection */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-foreground">Match Result Entry</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Completed Match</Label>
            <Select value={selectedResultTournamentId} onValueChange={handleSelectTournamentForPrize}>
              <SelectTrigger className="bg-background/50 border-border"><SelectValue placeholder="Choose match" /></SelectTrigger>
              <SelectContent>
                {tournaments.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.title} - {t.map} {t.match_type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedResultTournament && (
            <>
              <div className="p-3 bg-muted/30 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Match Details</p>
                <p className="text-foreground font-medium">
                  {selectedResultTournament.game_mode === 'tdm'
                    ? `TDM ${selectedResultTournament.max_slots === 2 ? '1v1' : selectedResultTournament.max_slots === 4 ? '2v2' : '4v4'}`
                    : `${selectedResultTournament.match_type} - ${selectedResultTournament.map}`}
                </p>
                <p className="text-sm text-admin-gold mt-1">
                  Prize Pool: ₹{selectedResultTournament.prize_pool}
                  <span className="text-muted-foreground ml-2">
                    (Select {getRequiredWinners(selectedResultTournament.match_type, selectedResultTournament.game_mode, selectedResultTournament.max_slots)} winner(s) -
                    ₹{(selectedResultTournament.prize_pool / getRequiredWinners(selectedResultTournament.match_type, selectedResultTournament.game_mode, selectedResultTournament.max_slots)).toFixed(0)} each)
                  </span>
                </p>
              </div>

              {/* Participant list for winner selection */}
              <div className="space-y-2">
                <Label>Select Winner(s) from Participants ({selectedWinners.length}/{getRequiredWinners(selectedResultTournament.match_type, selectedResultTournament.game_mode, selectedResultTournament.max_slots)})</Label>
                {loadingPrizeParticipants ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : prizeParticipants.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No paid participants in this match</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                    {prizeParticipants.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedWinners.includes(p.user_id)
                            ? "border-2 border-admin-gold bg-admin-gold/10"
                            : "border border-border/50 bg-background/50 hover:border-primary/30"
                        }`}
                      >
                        <Checkbox
                          checked={selectedWinners.includes(p.user_id)}
                          onCheckedChange={() => toggleWinnerSelection(p.user_id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{p.username}</p>
                          <p className="text-xs text-muted-foreground">IGN: {p.ign} | BGMI ID: {p.pubg_id}</p>
                        </div>
                        {selectedWinners.includes(p.user_id) && (
                          <span className="text-admin-gold text-sm font-bold">👑 Winner</span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <Button onClick={handleDistributePrize} disabled={distributingPrize}
            className="bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80 font-gaming">
            <Award className="mr-2 h-5 w-5" />{distributingPrize ? "Processing..." : "Distribute Prize"}
          </Button>
        </CardContent>
      </Card>

      {/* Manage Tournaments Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <List className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-gaming text-foreground">Manage Tournaments</CardTitle>
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
                    <TableCell>{new Date(tournament.start_time).toLocaleString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}</TableCell>
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
                         tournament.status === 'open' ? '✅ Open' : tournament.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => handleViewParticipants(tournament)} className="border-primary/30 hover:bg-primary/10" title="View Participants">
                          <Users className="h-4 w-4 mr-1" />{tournament.current_slots}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleManageRoomClick(tournament)} className="border-cyan-400/30 hover:bg-cyan-400/10" title="Room Credentials">
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditClick(tournament)} className="border-admin-gold/30 hover:bg-admin-gold/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelClick(tournament.id)} className="border-destructive/30 hover:bg-destructive/10" title="Cancel & Refund">
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
                <Input value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="bg-background/50 border-admin-red/30" />
              </div>
              <div className="space-y-2">
                <Label>Game Mode</Label>
                <Select value={editFormData.gameMode} onValueChange={(val) => setEditFormData({ ...editFormData, gameMode: val, map: "" })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="tdm">TDM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Map</Label>
                <Select value={editFormData.map} onValueChange={(val) => setEditFormData({ ...editFormData, map: val })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(editFormData.gameMode === 'classic' ? ["Erangel","Livik","Miramar","Sanhok"] : ["Warehouse","Hangar","Ruins","Santorini","Library"]).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Match Type</Label>
                <Select value={editFormData.matchType} onValueChange={(val) => setEditFormData({ ...editFormData, matchType: val })}>
                  <SelectTrigger className="bg-background/50 border-admin-red/30"><SelectValue /></SelectTrigger>
                  <SelectContent>{["Solo","Duo","Squad"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Entry Fee (₹)</Label>
                <Input type="number" value={editFormData.entryFee} onChange={(e) => setEditFormData({ ...editFormData, entryFee: e.target.value })} className="bg-background/50 border-admin-red/30" />
              </div>
              <div className="space-y-2">
                <Label>Prize Pool (₹)</Label>
                <Input type="number" value={editFormData.prizePool} onChange={(e) => setEditFormData({ ...editFormData, prizePool: e.target.value })} className="bg-background/50 border-admin-red/30" />
              </div>
              <div className="space-y-2">
                <Label>Per Kill Prize (₹)</Label>
                <Input type="number" value={editFormData.gameMode === 'tdm' ? '0' : editFormData.perKillPrize}
                  onChange={(e) => setEditFormData({ ...editFormData, perKillPrize: e.target.value })}
                  disabled={editFormData.gameMode === 'tdm'} className="bg-background/50 border-admin-red/30 disabled:opacity-50" />
              </div>
              <div className="space-y-2">
                <Label>Max Slots</Label>
                {editFormData.gameMode === 'tdm' ? (
                  <Select value={editFormData.maxSlots} onValueChange={(val) => setEditFormData({ ...editFormData, maxSlots: val })}>
                    <SelectTrigger className="bg-background/50 border-admin-red/30"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">1v1</SelectItem><SelectItem value="4">2v2</SelectItem><SelectItem value="8">4v4</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input type="number" value={editFormData.maxSlots} onChange={(e) => setEditFormData({ ...editFormData, maxSlots: e.target.value })} className="bg-background/50 border-admin-red/30" />
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Start Date & Time</Label>
                <Input type="datetime-local" value={editFormData.dateTime} onChange={(e) => setEditFormData({ ...editFormData, dateTime: e.target.value })} className="bg-background/50 border-admin-red/30" />
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateTournament} className="bg-admin-gold text-admin-gold-foreground hover:bg-admin-gold/80">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Room Credentials Modal */}
      <Dialog open={roomModalOpen} onOpenChange={setRoomModalOpen}>
        <DialogContent className="max-w-md bg-background border-cyan-400/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-gaming text-cyan-400 flex items-center gap-2">
              <Key className="h-6 w-6" />Room Credentials
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTournamentForRoom && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Tournament</p>
                <p className="font-semibold">{selectedTournamentForRoom.title}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Room ID</Label>
              <Input placeholder="Enter Room ID" value={roomFormData.roomId} onChange={(e) => setRoomFormData({ ...roomFormData, roomId: e.target.value })} className="bg-background/50" />
            </div>
            <div className="space-y-2">
              <Label>Room Password</Label>
              <Input placeholder="Enter Password" value={roomFormData.roomPassword} onChange={(e) => setRoomFormData({ ...roomFormData, roomPassword: e.target.value })} className="bg-background/50" />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setRoomModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRoomCredentials} disabled={updatingRoom} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                {updatingRoom ? "Saving..." : "Save & Go LIVE"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-background border-destructive/30">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Tournament & Refund All?</AlertDialogTitle>
            <AlertDialogDescription>This will cancel the tournament permanently, refund all participants, and cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Tournament</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/80">Cancel & Refund All</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Participants View Modal */}
      <Dialog open={participantsModalOpen} onOpenChange={setParticipantsModalOpen}>
        <DialogContent className="bg-card border-primary/20 max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-gaming text-foreground flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />Tournament Participants
            </DialogTitle>
            {selectedTournamentForParticipants && (
              <div className="text-sm text-muted-foreground space-y-1 pt-2">
                <p className="font-medium text-foreground">{selectedTournamentForParticipants.title}</p>
                <p>{selectedTournamentForParticipants.map} - {selectedTournamentForParticipants.match_type}</p>
                <p>Registered: {selectedTournamentForParticipants.current_slots}/{selectedTournamentForParticipants.max_slots} players</p>
              </div>
            )}
          </DialogHeader>

          {loadingParticipants ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No participants yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between p-4 bg-background/50 rounded border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{participant.username}</p>
                        <p className="text-sm text-muted-foreground">IGN: {participant.ign}</p>
                        <p className="text-sm text-primary">BGMI ID: {participant.pubg_id}</p>
                        <p className="text-xs text-muted-foreground">Joined: {new Date(participant.joined_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        participant.payment_status === 'paid'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {participant.payment_status === 'paid' ? '✓ Paid' : 'Pending'}
                      </span>
                      {participant.rank === 1 && <p className="text-xs text-admin-gold">👑 Winner</p>}
                      {participant.prize_amount && participant.prize_amount > 0 && <p className="text-xs text-admin-gold font-medium">Won: ₹{participant.prize_amount}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{participants.length}</p>
                  <p className="text-xs text-muted-foreground">Total Players</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{participants.filter(p => p.payment_status === 'paid').length}</p>
                  <p className="text-xs text-muted-foreground">Paid</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{participants.filter(p => p.payment_status !== 'paid').length}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTournaments;
