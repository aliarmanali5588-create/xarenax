import { Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SupportCard = () => {
  return (
    <div className="glass-panel rounded-2xl p-8 neon-border-orange">
      <h2 className="text-2xl font-gaming font-bold text-glow-orange mb-2">
        Need Help?
      </h2>
      <p className="text-muted-foreground mb-6">
        Our support team is here to assist you 24/7
      </p>

      <div className="space-y-4">
        {/* Email Support */}
        <a
          href="mailto:helparenax@zohomail.in"
          className="glass-panel-hover rounded-xl p-6 flex items-center gap-4 group block"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center neon-glow-cyan group-hover:scale-110 transition-transform">
            <Mail className="w-7 h-7 text-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg mb-1">Email Support</h3>
            <p className="text-sm text-primary">helparenax@zohomail.in</p>
          </div>
        </a>

        {/* Telegram Channel */}
        <a
          href="https://t.me/+6IoFwhsuUkEzMGM9"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel-hover rounded-xl p-6 flex items-center gap-4 group block"
        >
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center neon-glow-orange group-hover:scale-110 transition-transform">
            <MessageCircle className="w-7 h-7 text-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-lg mb-1">Telegram Community</h3>
            <p className="text-sm text-secondary">Join for Room IDs & Updates</p>
          </div>
        </a>
      </div>

      {/* Support Hours */}
      <div className="mt-6 glass-panel rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Average Response Time: <span className="text-primary font-semibold">Under 2 hours</span>
        </p>
      </div>
    </div>
  );
};

export default SupportCard;
