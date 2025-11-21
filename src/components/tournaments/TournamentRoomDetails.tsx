import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Copy, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface RoomDetails {
  tournament_id: string;
  room_id: string;
  room_password: string;
  tournament_title: string;
  tournament_start_time: string;
  tournament_map: string;
  tournament_match_type: string;
}

const TournamentRoomDetails = () => {
  const { user } = useAuth();
  const [roomDetails, setRoomDetails] = useState<RoomDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPassword, setCopiedPassword] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRoomDetails();
    }
  }, [user]);

  const fetchRoomDetails = async () => {
    try {
      // First, get tournaments the user has joined and paid for
      const { data: participants, error: participantError } = await supabase
        .from("participants")
        .select("tournament_id")
        .eq("user_id", user?.id)
        .eq("payment_status", "paid");

      if (participantError) throw participantError;

      if (!participants || participants.length === 0) {
        setRoomDetails([]);
        setLoading(false);
        return;
      }

      const tournamentIds = participants.map((p) => p.tournament_id);

      // Fetch tournament secrets and tournament details
      const { data: secrets, error: secretsError } = await supabase
        .from("tournament_secrets")
        .select(`
          tournament_id,
          room_id,
          room_password,
          tournaments (
            title,
            start_time,
            map,
            match_type
          )
        `)
        .in("tournament_id", tournamentIds);

      if (secretsError) throw secretsError;

      // Transform the data
      const transformedData = secrets?.map((secret: any) => ({
        tournament_id: secret.tournament_id,
        room_id: secret.room_id,
        room_password: secret.room_password,
        tournament_title: secret.tournaments.title,
        tournament_start_time: secret.tournaments.start_time,
        tournament_map: secret.tournaments.map,
        tournament_match_type: secret.tournaments.match_type,
      })) || [];

      setRoomDetails(transformedData);
    } catch (error) {
      console.error("Error fetching room details:", error);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: "id" | "password", tournamentId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "id") {
        setCopiedId(tournamentId);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        setCopiedPassword(tournamentId);
        setTimeout(() => setCopiedPassword(null), 2000);
      }
      toast.success(`${type === "id" ? "Room ID" : "Password"} copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (loading) {
    return (
      <Card className="glass-panel neon-border-cyan">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading room details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (roomDetails.length === 0) {
    return (
      <Card className="glass-panel border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl font-gaming text-glow-cyan">
              My Tournament Room Details
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No room details available. Join a tournament and complete payment to see room credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-gaming font-bold text-glow-cyan mb-4">
        My Tournament Room Details
      </h2>
      {roomDetails.map((details) => (
        <Card key={details.tournament_id} className="glass-panel neon-border-cyan">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Key className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg font-gaming">
                {details.tournament_title}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              {details.tournament_map} • {details.tournament_match_type} • {new Date(details.tournament_start_time).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Room ID */}
            <div className="glass-panel rounded-lg p-4 space-y-2">
              <Label className="text-sm text-muted-foreground">Room ID</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background/50 rounded-lg px-4 py-3 font-mono text-lg font-bold text-primary">
                  {details.room_id}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(details.room_id, "id", details.tournament_id)}
                  className="shrink-0 hover:bg-primary/20"
                >
                  {copiedId === details.tournament_id ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Room Password */}
            <div className="glass-panel rounded-lg p-4 space-y-2">
              <Label className="text-sm text-muted-foreground">Password</Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-background/50 rounded-lg px-4 py-3 font-mono text-lg font-bold text-primary">
                  {details.room_password}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyToClipboard(details.room_password, "password", details.tournament_id)}
                  className="shrink-0 hover:bg-primary/20"
                >
                  {copiedPassword === details.tournament_id ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Join the PUBG/BGMI room with these credentials before the tournament starts. Screenshot these details for your reference.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper Label component
const Label = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
);

export default TournamentRoomDetails;
