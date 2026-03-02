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
    if (!user) { navigate("/signup"); return; }
    navigate(`/tournaments/${id}`);
  };

  const getStatusBadge = () => {
    if (isFull) return <Badge variant="destructive" className="shadow-[0_0_10px_rgba(239,68,68,0.4)]">Full</Badge>;
    if (slotsPercentage > 80) return <Badge className="bg-secondary/15 text-secondary border-secondary/30 shadow-[0_0_12px_rgba(255,50,0,0.3)] animate-pulse">Filling Fast</Badge>;
    return <Badge className="bg-success/15 text-success border-success/30 live-badge">Open</Badge>;
  };

  return (
    <div className="glass-card-hover p-6 group relative overflow-hidden card-3d">
      {/* Hover Glow Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-500" />
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1">
            <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{map}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/30">
                <Target className="w-3.5 h-3.5" />
                <span className="font-medium">{mode}</span>
              </div>
            </div>
            {gameMode === 'tdm' && (
              <Badge className="mt-3 bg-purple-600/15 text-purple-400 border-purple-500/30">
                <Zap className="w-3 h-3 mr-1" />
                TDM Arena
              </Badge>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Prize & Entry */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl p-5 border border-accent/20 group-hover:border-accent/40 transition-all duration-500">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 font-medium">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Prize Pool</span>
            </div>
            <div className="flex items-center text-3xl font-gaming font-bold text-gradient-gold">
              <IndianRupee className="w-6 h-6" />
              {prizePool.toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-5 border border-primary/20 group-hover:border-primary/40 transition-all duration-500">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2 font-medium">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span>Entry Fee</span>
            </div>
            <div className="flex items-center text-3xl font-gaming font-bold text-primary">
              <IndianRupee className="w-6 h-6" />
              {entryFee}
            </div>
          </div>
        </div>

        {/* Slots Progress */}
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
          <div className="h-2.5 bg-muted/30 rounded-full overflow-hidden border border-border/30">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                slotsPercentage > 80 
                  ? "bg-gradient-to-r from-secondary to-secondary/80 shadow-[0_0_12px_rgba(255,50,0,0.4)]" 
                  : "bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(255,120,0,0.3)]"
              }`}
              style={{ width: `${slotsPercentage}%` }}
            />
          </div>
        </div>

        {/* Start Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5 pb-5 border-b border-border/20 bg-muted/10 px-3 py-2.5 rounded-lg">
          <Clock className="w-4 h-4 text-accent" />
          <span className="font-medium">{startTime}</span>
        </div>

        {/* Action Button */}
        <Button
          className={`w-full font-bold text-base py-6 ${
            isFull 
              ? "" 
              : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 pulse-glow hover:scale-[1.02] transition-all duration-300 btn-luxury"
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
