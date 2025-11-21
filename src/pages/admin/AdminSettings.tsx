import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-admin-gold">
              Admin Settings
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Settings panel coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
