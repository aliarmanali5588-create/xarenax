import { Link } from "react-router-dom";
import { Trophy, Users, IndianRupee, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TournamentCardProps {
  id: string;
  title: string;
  entryFee: number;
  prizePool: number;
  totalSlots: number;
  filledSlots: number;
  startTime: string;
  mode: string;
  map: string;
  status?: "open" | "filling" | "full";
}

const TournamentCard = ({
  id,
  title,
  entryFee,
  prizePool,
  totalSlots,
  filledSlots,
  startTime,
  mode,
  map,
  status = "open",
}: TournamentCardProps) => {
  const slotsPercentage = (filledSlots / totalSlots) * 100;

  const getStatusBadge = () => {
    if (status === "full") return <Badge variant="destructive">Full</Badge>;
    if (slotsPercentage > 80) return <Badge variant="secondary">Filling Fast</Badge>;
    return <Badge className="bg-success text-success-foreground">Open</Badge>;
  };

  return (
    <div className="glass-panel-hover rounded-xl p-6 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-heading font-bold mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              {mode} • {map}
            </span>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Prize & Entry */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-panel rounded-lg p-4 border-l-4 border-secondary">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <Trophy className="w-4 h-4" />
            <span>Prize Pool</span>
          </div>
          <div className="flex items-center text-2xl font-heading font-bold text-secondary text-glow-orange">
            <IndianRupee className="w-5 h-5" />
            {prizePool.toLocaleString()}
          </div>
        </div>

        <div className="glass-panel rounded-lg p-4 border-l-4 border-primary">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
            <IndianRupee className="w-4 h-4" />
            <span>Entry Fee</span>
          </div>
          <div className="flex items-center text-2xl font-heading font-bold text-primary text-glow-cyan">
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
            {filledSlots}/{totalSlots}
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
        <span>Starts: {startTime}</span>
      </div>

      {/* Action Button */}
      <Button
        variant={status === "full" ? "outline" : "gaming"}
        className="w-full"
        disabled={status === "full"}
        asChild={status !== "full"}
      >
        {status === "full" ? (
          <span>Tournament Full</span>
        ) : (
          <Link to={`/tournaments/${id}`}>Join Tournament</Link>
        )}
      </Button>
    </div>
  );
};

export default TournamentCard;
