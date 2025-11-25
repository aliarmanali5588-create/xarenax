import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trophy, Users, IndianRupee, Clock, MapPin, Gamepad2, Target } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// SECURITY: PUBG ID Validation Schema
const pubgIdSchema = z.string()
  .trim()
  .min(3, "PUBG ID must be at least 3 characters")
  .max(20, "PUBG ID must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, hyphens, and underscores allowed");

interface Tournament {
  id: string;
  title: string;
  entry_fee: number;
  prize_pool: number;
  per_kill_prize: number;
  start_time: string;
  match_type: string;
  map: string;
  status: string;
  current_slots: number;
  max_slots: number;
}

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pubgId, setPubgId] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
    if (user) {
      fetchWalletBalance();
    }
  }, [id, user]);

  const fetchTournament = async () => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setTournament(data);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      toast.error("Failed to load tournament details");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("wallet_balance")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setWalletBalance(data?.wallet_balance || 0);
    } catch (error) {
      console.error("Error fetching wallet:", error);
    }
  };

  const handleJoinClick = () => {
    if (!user) {
      toast.error("Please login to join tournaments");
      navigate("/signup");
      return;
    }

    if (!tournament) return;

    if (walletBalance < tournament.entry_fee) {
      toast.error(`Insufficient balance! You need ₹${tournament.entry_fee}`);
      navigate("/wallet");
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmJoin = async () => {
    if (!user || !tournament || !pubgId.trim()) {
      toast.error("Please enter your PUBG ID");
      return;
    }

    // SECURITY: Validate PUBG ID format
    try {
      pubgIdSchema.parse(pubgId);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return;
    }

    setJoining(true);
    try {
      // Check if already joined
      const { data: existingParticipant } = await supabase
        .from("participants")
        .select("id")
        .eq("tournament_id", tournament.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingParticipant) {
        toast.error("You have already joined this tournament");
        setJoining(false);
        setShowConfirmDialog(false);
        return;
      }

      // Deduct entry fee from wallet
      const newBalance = walletBalance - tournament.entry_fee;
      const { error: walletError } = await supabase
        .from("profiles")
        .update({ wallet_balance: newBalance })
        .eq("id", user.id);

      if (walletError) throw walletError;

      // Insert participant
      const { error: participantError } = await supabase
        .from("participants")
        .insert({
          tournament_id: tournament.id,
          user_id: user.id,
          pubg_id: pubgId.trim(),
          payment_status: "paid",
        });

      if (participantError) throw participantError;

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: user.id,
        amount: -tournament.entry_fee,
        type: "entry_fee",
        status: "success",
        description: `Entry fee for ${tournament.title}`,
      });

      setWalletBalance(newBalance);
      toast.success("Successfully joined tournament! 🎉");
      setShowConfirmDialog(false);
      navigate("/profile");
    } catch (error) {
      console.error("Error joining tournament:", error);
      toast.error("Failed to join tournament. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Tournament not found</p>
      </div>
    );
  }

  const slotsPercentage = (tournament.current_slots / tournament.max_slots) * 100;
  const isFull = tournament.status === "full";

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="glass-panel rounded-2xl p-4 sm:p-6 md:p-8 mb-6 md:mb-8 neon-border-cyan">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-gaming font-bold mb-3 text-glow-cyan">
                  {tournament.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={isFull ? "destructive" : "default"} className="text-sm">
                    {isFull ? "Full" : "Open"}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {tournament.match_type}
                  </Badge>
                  <Badge variant="outline" className="text-sm">
                    {tournament.map}
                  </Badge>
                </div>
              </div>
              <Trophy className="w-12 h-12 text-admin-gold" />
            </div>

            {/* Prize Info */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div className="glass-panel rounded-xl p-4 border-l-4 border-secondary">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Trophy className="w-4 h-4" />
                  <span>Prize Pool</span>
                </div>
                <div className="flex items-center text-3xl font-gaming font-bold text-secondary text-glow-orange">
                  <IndianRupee className="w-6 h-6" />
                  {tournament.prize_pool.toLocaleString()}
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4 border-l-4 border-primary">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <IndianRupee className="w-4 h-4" />
                  <span>Entry Fee</span>
                </div>
                <div className="flex items-center text-3xl font-gaming font-bold text-primary text-glow-cyan">
                  <IndianRupee className="w-6 h-6" />
                  {tournament.entry_fee}
                </div>
              </div>

              <div className="glass-panel rounded-xl p-4 border-l-4 border-admin-gold">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                  <Target className="w-4 h-4" />
                  <span>Per Kill</span>
                </div>
                <div className="flex items-center text-3xl font-gaming font-bold text-admin-gold">
                  <IndianRupee className="w-6 h-6" />
                  {tournament.per_kill_prize}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="glass-panel rounded-xl p-4 sm:p-6 mb-6 md:mb-8">
            <h2 className="text-xl sm:text-2xl font-gaming font-bold mb-4 sm:mb-6 text-primary">
              Tournament Details
            </h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-heading font-bold">
                    {new Date(tournament.start_time).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Map</p>
                  <p className="font-heading font-bold">{tournament.map}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
                <Gamepad2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Game Mode</p>
                  <p className="font-heading font-bold">{tournament.match_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 glass-panel rounded-lg">
                <Users className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">Slots Available</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold">
                      {tournament.current_slots} / {tournament.max_slots}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {tournament.max_slots - tournament.current_slots} left
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        slotsPercentage > 80 ? "bg-secondary" : "bg-primary"
                      }`}
                      style={{ width: `${slotsPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Join Button */}
          <div className="glass-panel rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Your Wallet Balance</p>
                <p className="text-xl sm:text-2xl font-gaming font-bold text-primary flex items-center">
                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                  {walletBalance}
                </p>
              </div>
              {walletBalance < tournament.entry_fee && (
                <Badge variant="destructive" className="text-xs">Insufficient Balance</Badge>
              )}
            </div>
            <Button
              variant={isFull ? "outline" : "gaming"}
              size="lg"
              className="w-full h-12 text-base"
              disabled={isFull || joining}
              onClick={handleJoinClick}
            >
              {isFull ? "Tournament Full" : "Join Tournament"}
            </Button>
          </div>
        </div>
      </div>

      <MegaFooter />

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="glass-panel border-primary/30 w-[95%] max-w-lg mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-gaming text-xl sm:text-2xl text-primary">
              Confirm Tournament Entry
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="glass-panel rounded-lg p-4 my-4">
                <div className="space-y-2 text-foreground">
                  <p className="flex justify-between">
                    <span>Entry Fee:</span>
                    <span className="font-bold">₹{tournament.entry_fee}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Current Balance:</span>
                    <span className="font-bold">₹{walletBalance}</span>
                  </p>
                  <div className="border-t border-border/30 my-2"></div>
                  <p className="flex justify-between text-primary">
                    <span>Balance After:</span>
                    <span className="font-bold">
                      ₹{walletBalance - tournament.entry_fee}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pubg-id" className="text-foreground">
                  Enter your PUBG/BGMI ID
                </Label>
                <Input
                  id="pubg-id"
                  placeholder="e.g., YourGameName123"
                  value={pubgId}
                  onChange={(e) => setPubgId(e.target.value)}
                  className="glass-panel border-border/50"
                />
                <p className="text-xs text-muted-foreground">
                  Make sure this matches your in-game name exactly
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={joining} className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmJoin}
              disabled={joining || !pubgId.trim()}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
            >
              {joining ? "Joining..." : "Confirm & Join"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TournamentDetail;
