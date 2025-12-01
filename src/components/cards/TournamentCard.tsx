import { useNavigate } from "react-router-dom";
import { Trophy, Users, IndianRupee, Clock, MapPin, Zap, Target, ArrowRight } from "lucide-react";
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
    if (isFull) return <Badge variant="destructive" className="shadow-[0_0_10px_rgba(239,68,68,0.5)]">Full</Badge>;
    if (slotsPercentage > 80) return <Badge className="bg-secondary/20 text-secondary border-secondary/40 shadow-[0_0_10px_rgba(251,146,60,0.4)]">Filling Fast</Badge>;
    return <Badge className="bg-success/20 text-success border-success/40 shadow-[0_0_10px_rgba(34,197,94,0.4)]">Open</Badge>;
  };

  return (
    <div className="glass-card-hover p-6 group relative overflow-hidden">
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{map}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg">
                <Target className="w-3.5 h-3.5" />
                <span className="font-medium">{mode}</span>
              </div>
            </div>
            {gameMode === 'tdm' && (
              <Badge className="mt-3 bg-purple-600/20 text-purple-400 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                <Zap className="w-3 h-3 mr-1" />
                TDM Arena
              </Badge>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Prize & Entry - Enhanced Visual Hierarchy */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-secondary/15 to-secondary/5 rounded-xl p-5 border border-secondary/30 group-hover:border-secondary/50 transition-all duration-300 shadow-[0_0_20px_rgba(251,146,60,0.1)]">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 font-medium">
              <Trophy className="w-4 h-4 text-secondary drop-shadow-[0_0_6px_currentColor]" />
              <span>Prize Pool</span>
            </div>
            <div className="flex items-center text-3xl font-gaming font-bold text-secondary drop-shadow-[0_0_10px_currentColor]">
              <IndianRupee className="w-6 h-6" />
              {prizePool.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl p-5 border border-primary/30 group-hover:border-primary/50 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 font-medium">
              <IndianRupee className="w-4 h-4 text-primary drop-shadow-[0_0_6px_currentColor]" />
              <span>Entry Fee</span>
            </div>
            <div className="flex items-center text-3xl font-gaming font-bold text-primary drop-shadow-[0_0_10px_currentColor]">
              <IndianRupee className="w-6 h-6" />
              {entryFee}
            </div>
          </div>
        </div>

        {/* Slots Progress - More Visual */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="flex items-center gap-2 text-muted-foreground font-medium">
              <Users className="w-4 h-4 text-primary" />
              Players
            </span>
            <span className="font-bold text-foreground">
              {currentSlots}/{maxSlots}
            </span>
          </div>
          <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/50">
            <div
              className={`h-full transition-all duration-500 ${
                slotsPercentage > 80 
                  ? "bg-gradient-to-r from-secondary to-secondary/80 shadow-[0_0_10px_rgba(251,146,60,0.5)]" 
                  : "bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_10px_rgba(0,255,255,0.5)]"
              }`}
              style={{ width: `${slotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Start Time - Enhanced */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 pb-5 border-b border-border/50 bg-muted/20 px-3 py-2.5 rounded-lg">
          <Clock className="w-4 h-4 text-accent" />
          <span className="font-medium">{startTime}</span>
        </div>

        {/* Action Button - More Prominent */}
        <Button
          className={`w-full font-bold text-base py-6 ${
            isFull 
              ? "" 
              : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:scale-105 transition-all duration-300"
          }`}
          disabled={isFull}
          onClick={!isFull ? handleJoinClick : undefined}
        >
          {isFull ? "Tournament Full" : "Join Tournament"}
          {!isFull && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default TournamentCard;
