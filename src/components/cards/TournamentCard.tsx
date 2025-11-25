import { useNavigate } from "react-router-dom";
import { Trophy, Users, IndianRupee, Clock } from "lucide-react";
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

  const handleJoinClick = () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    navigate(`/tournaments/${id}`);
  };

  const getStatusBadge = () => {
    if (status?.toLowerCase() === "full") return <Badge variant="destructive">Full</Badge>;
    if (slotsPercentage > 80) return <Badge variant="secondary">Filling Fast</Badge>;
    return <Badge className="bg-success text-success-foreground">Open</Badge>;
  };

  return (
    <div className="glass-panel-hover rounded-2xl p-6 group hover-glow-intense relative overflow-hidden border-2 border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex-1">
          <h3 className="text-xl font-heading font-bold mb-2 text-gradient-gaming group-hover:scale-105 transition-transform inline-block">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/30 font-medium">
              {mode} • {map}
            </span>
          </div>
          {gameMode === 'tdm' && (
            <Badge className="mt-2 bg-purple-600 text-white border-purple-500 hover:bg-purple-700 animate-pulse-glow">
              ⚡ TDM ARENA
            </Badge>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Prize & Entry */}
      <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
        <div className="glass-panel rounded-xl p-4 border-2 border-secondary/30 hover:border-secondary transition-colors group/prize">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <Trophy className="w-4 h-4 text-secondary" />
            <span>Prize Pool</span>
          </div>
          <div className="flex items-center text-2xl font-gaming font-bold text-secondary neon-glow-orange">
            <IndianRupee className="w-5 h-5" />
            {prizePool.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 border-2 border-primary/30 hover:border-primary transition-colors group/entry">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
            <IndianRupee className="w-4 h-4 text-primary" />
            <span>Entry Fee</span>
          </div>
          <div className="flex items-center text-2xl font-gaming font-bold text-primary neon-glow-cyan">
            <IndianRupee className="w-5 h-5" />
            {entryFee}
          </div>
        </div>
      </div>

      {/* Slots Progress */}
      <div className="mb-4 relative z-10">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="flex items-center gap-2 text-foreground font-semibold">
            <Users className="w-5 h-5 text-primary" />
            Slots Filling
          </span>
          <span className="font-gaming font-bold text-primary">
            {currentSlots}/{maxSlots}
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              slotsPercentage > 80 ? "bg-gradient-to-r from-secondary to-destructive" : "bg-gradient-to-r from-primary to-accent"
            }`}
            style={{ width: `${slotsPercentage}%` }}
          />
        </div>
      </div>

      {/* Start Time */}
      <div className="flex items-center gap-2 text-sm mb-5 pb-4 border-b border-border/50 relative z-10">
        <Clock className="w-5 h-5 text-primary" />
        <span className="font-medium text-foreground">Starts: <span className="text-primary">{startTime}</span></span>
      </div>

      {/* Action Button */}
      <Button
        variant={status === "full" ? "outline" : "gaming"}
        className="w-full hover-glow-intense font-bold text-base py-6 relative z-10"
        disabled={status === "full"}
        onClick={status !== "full" ? handleJoinClick : undefined}
      >
        {status === "full" ? "🚫 Tournament Full" : "⚡ Join Tournament"}
      </Button>
    </div>
  );
};

export default TournamentCard;
