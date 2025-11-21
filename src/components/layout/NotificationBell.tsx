import { Bell } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const NotificationBell = () => {
  const [notifications] = useState([
    {
      id: 1,
      title: "Match Starting Soon",
      description: "Elite Squad Championship starts in 15 minutes",
      time: "5m ago",
      type: "match",
    },
    {
      id: 2,
      title: "Withdrawal Processed",
      description: "₹500 has been transferred to your UPI",
      time: "1h ago",
      type: "payment",
    },
    {
      id: 3,
      title: "Referral Bonus",
      description: "You earned ₹10 from a new signup!",
      time: "2h ago",
      type: "affiliate",
    },
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg glass-panel-hover transition-all group">
          <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold neon-glow-orange">
              {notifications.length}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 glass-panel border-border/50 p-2">
        <div className="px-3 py-2 border-b border-border/50 mb-2">
          <h3 className="font-heading font-semibold text-sm">Notifications</h3>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No notifications
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg hover:bg-card/60"
              >
                <div className="flex items-start justify-between w-full">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{notification.description}</p>
                <span className="text-xs text-muted-foreground/70">{notification.time}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
