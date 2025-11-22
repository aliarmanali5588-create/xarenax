import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Copy, Trash2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface Invitation {
  id: string;
  invite_code: string;
  invitee_email: string;
  granted_role: string;
  status: string;
  expires_at: string;
  redeemed_at: string | null;
  created_at: string;
}

const invitationSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  duration: z.string(),
});

const AdminInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    duration: "24", // hours
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createInvitation = async () => {
    try {
      const validated = invitationSchema.parse(formData);
      setCreating(true);

      // Generate invite code
      const { data: codeData, error: codeError } = await supabase
        .rpc("generate_invite_code");

      if (codeError) throw codeError;

      const inviteCode = codeData as string;

      // Calculate expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + parseInt(validated.duration));

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create invitation
      const { error: insertError } = await supabase
        .from("admin_invitations")
        .insert({
          invite_code: inviteCode,
          invitee_email: validated.email,
          expires_at: expiresAt.toISOString(),
          created_by: user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: `Invitation created for ${validated.email}`,
      });

      setFormData({ email: "", duration: "24" });
      setShowDialog(false);
      fetchInvitations();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create invitation",
          variant: "destructive",
        });
      }
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (code: string) => {
    const inviteUrl = `${window.location.origin}/redeem-invite?code=${code}`;
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedCode(code);
    toast({
      title: "Copied!",
      description: "Invitation link copied to clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const revokeInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("admin_invitations")
        .update({ status: "revoked" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Revoked",
        description: "Invitation has been revoked",
      });

      fetchInvitations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to revoke invitation",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "default",
      accepted: "secondary",
      expired: "destructive",
      revoked: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-gaming text-admin-gold">Admin Invitations</h2>
          <p className="text-sm text-muted-foreground">Manage temporary admin access</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Create Invitation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Admin Invitation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Invitee Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Expires In</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData({ ...formData, duration: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                    <SelectItem value="24">24 hours</SelectItem>
                    <SelectItem value="72">3 days</SelectItem>
                    <SelectItem value="168">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={createInvitation}
                disabled={creating}
                className="w-full"
              >
                {creating ? "Creating..." : "Generate Invitation"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <CardTitle className="text-xl font-gaming text-admin-gold">
            Active Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : invitations.length === 0 ? (
            <p className="text-muted-foreground">No invitations created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Invite Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.invitee_email}</TableCell>
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span>{invite.invite_code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(invite.invite_code)}
                            className="h-6 w-6 p-0"
                          >
                            {copiedCode === invite.invite_code ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invite.status)}</TableCell>
                      <TableCell className="text-xs">
                        {new Date(invite.expires_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs">
                        {new Date(invite.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {invite.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => revokeInvitation(invite.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminInvitations;
