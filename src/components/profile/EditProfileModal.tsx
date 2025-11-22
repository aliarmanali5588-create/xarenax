import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentData: {
    username: string;
    ign: string | null;
    bgmiId: string | null;
    email: string;
  };
  userId: string;
  onSuccess: () => void;
}

export const EditProfileModal = ({
  open,
  onOpenChange,
  currentData,
  userId,
  onSuccess,
}: EditProfileModalProps) => {
  const [formData, setFormData] = useState({
    username: currentData.username || "",
    ign: currentData.ign || "",
    bgmiId: currentData.bgmiId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username.trim(),
          ign: formData.ign.trim() || null,
          bgmi_id: formData.bgmiId.trim() || null,
        })
        .eq("id", userId);

      if (error) {
        // Check for unique constraint violation
        if (error.code === "23505") {
          toast({
            title: "Error",
            description: "Username already taken. Please choose another.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Profile Updated Successfully",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={currentData.email}
              disabled
              className="bg-muted/50 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-foreground">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
              required
              maxLength={50}
              className="bg-background border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ign" className="text-foreground">
              In-Game Name (IGN)
            </Label>
            <Input
              id="ign"
              type="text"
              value={formData.ign}
              onChange={(e) =>
                setFormData({ ...formData, ign: e.target.value })
              }
              placeholder="Enter your in-game name"
              maxLength={50}
              className="bg-background border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgmiId" className="text-foreground">
              BGMI ID
            </Label>
            <Input
              id="bgmiId"
              type="text"
              value={formData.bgmiId}
              onChange={(e) =>
                setFormData({ ...formData, bgmiId: e.target.value })
              }
              placeholder="Enter your BGMI ID"
              maxLength={50}
              className="bg-background border-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
