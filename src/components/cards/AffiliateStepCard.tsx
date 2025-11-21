import { LucideIcon } from "lucide-react";

interface AffiliateStepCardProps {
  step: number;
  title: string;
  description: string;
  reward: string;
  icon: LucideIcon;
  isLast?: boolean;
}

const AffiliateStepCard = ({
  step,
  title,
  description,
  reward,
  icon: Icon,
  isLast = false,
}: AffiliateStepCardProps) => {
  return (
    <div className="relative">
      <div className="glass-panel-hover rounded-xl p-6 h-full">
        {/* Step Number */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan">
            <span className="text-xl font-gaming font-bold text-background">{step}</span>
          </div>
          <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border-2 border-primary/30">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{description}</p>

        {/* Reward Badge */}
        <div className="glass-panel rounded-lg p-3 border-l-4 border-secondary">
          <div className="text-xs text-muted-foreground mb-1">Earn</div>
          <div className="text-lg font-heading font-bold text-secondary text-glow-orange">
            {reward}
          </div>
        </div>
      </div>

      {/* Connector Arrow */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 -right-8 transform -translate-y-1/2">
          <div className="w-16 h-0.5 bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-8 border-l-primary" />
        </div>
      )}
    </div>
  );
};

export default AffiliateStepCard;
