import { Bell, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PushNotificationToggle } from "@/components/notifications/PushNotificationToggle";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "match" | "payment" | "affiliate" | "system";
  is_read: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    fetchNotifications();

    // Set up realtime subscription for new notifications
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new as Notification, ...prev]);
            toast.info("New notification received!");
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === payload.new.id ? (payload.new as Notification) : n
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications((data || []) as Notification[]);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId)
        .eq("user_id", user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Don't render bell icon if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-lg glass-panel-hover transition-all group">
          <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs font-bold neon-glow-orange">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 glass-panel border-border/50 p-2"
      >
        <div className="px-3 py-2 border-b border-border/50 mb-2">
          <h3 className="font-heading font-semibold text-sm">Notifications</h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No new notifications
          </div>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer rounded-lg hover:bg-card/60 ${
                  !notification.is_read ? "bg-primary/5" : ""
                }`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.type}
                    </Badge>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {notification.message}
                </p>
                <span className="text-xs text-muted-foreground/70">
                  {getTimeAgo(notification.created_at)}
                </span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer p-3 hover:bg-card/60"
          onClick={() => navigate("/notification-preferences")}
        >
          <Settings className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">Notification Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationBell;
