import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Card, CardContent } from "@/components/ui/card";

export const PushNotificationToggle = () => {
  const { isSupported, isSubscribed, isLoading, permission, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return (
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <BellOff className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Push Notifications Not Available</p>
              <p className="text-xs">Your browser doesn't support push notifications</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="glass-card border-destructive/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-destructive">
            <BellOff className="w-5 h-5" />
            <div>
              <p className="text-sm font-medium">Notifications Blocked</p>
              <p className="text-xs">Please enable notifications in your browser settings</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card hover-lift">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isSubscribed ? 'bg-primary/10' : 'bg-muted'}`}>
              {isSubscribed ? (
                <Bell className="w-5 h-5 text-primary" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                {isSubscribed 
                  ? 'Get notified even when app is closed' 
                  : 'Enable to receive tournament updates'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant={isSubscribed ? "outline" : "default"}
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={isLoading}
            className="min-w-[80px]"
          >
            {isLoading ? '...' : isSubscribed ? 'Disable' : 'Enable'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
