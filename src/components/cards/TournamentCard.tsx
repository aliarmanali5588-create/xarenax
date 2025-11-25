import { useNavigate } from "react-router-dom";
import { Trophy, Users, IndianRupee, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

interface TournamentCardProps {
  id: string;
  title: string;
  entryFee: number;
  prizePool: number;
  currentSlots?: number;
  maxSlots?: number;
  startTime: string;
  mode: string;
  map: string;
  status?: string;
  gameMode?: string | null;
}

const TournamentCard = ({
  id,
  title,
  entryFee,
  prizePool,
  currentSlots = 0,
  maxSlots = 100,
  startTime,
  mode,
  map,
  status = "Open",
  gameMode,
}: TournamentCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const slotsPercentage = (currentSlots / maxSlots) * 100;
  const isFull = status?.toLowerCase() === "full";

  const handleJoinClick = () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    navigate(`/tournaments/${id}`);
  };

  const getStatusBadge = () => {
    if (isFull) return <Badge variant="destructive">Full</Badge>;
    if (slotsPercentage > 80) return <Badge variant="secondary">Filling Fast</Badge>;
    return <Badge className="bg-success text-success-foreground">Open</Badge>;
  };

  return (
    <div className="glass-card p-6 hover-lift group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{mode} • {map}</span>
          </div>
          {gameMode === 'tdm' && (
            <Badge className="mt-2 bg-purple-600 text-white">
              TDM Arena
            </Badge>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Prize & Entry */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <Trophy className="w-4 h-4" />
            <span>Prize Pool</span>
          </div>
          <div className="flex items-center text-2xl font-gaming font-bold text-secondary">
            <IndianRupee className="w-5 h-5" />
            {prizePool.toLocaleString()}
          </div>
        </div>

        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <IndianRupee className="w-4 h-4" />
            <span>Entry Fee</span>
          </div>
          <div className="flex items-center text-2xl font-gaming font-bold text-primary">
            <IndianRupee className="w-5 h-5" />
            {entryFee}
          </div>
        </div>
      </div>

      {/* Slots Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4" />
            Slots
          </span>
          <span className="font-medium">
            {currentSlots}/{maxSlots}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              slotsPercentage > 80 ? "bg-secondary" : "bg-primary"
            }`}
            style={{ width: `${slotsPercentage}%` }}
          />
        </div>
      </div>

      {/* Start Time */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 pb-4 border-b border-border/50">
        <Clock className="w-4 h-4" />
        <span>{startTime}</span>
      </div>

      {/* Action Button */}
      <Button
        className="w-full"
        disabled={isFull}
        onClick={!isFull ? handleJoinClick : undefined}
      >
        {isFull ? "Tournament Full" : "Join Tournament"}
      </Button>
    </div>
  );
};

export default TournamentCard;
