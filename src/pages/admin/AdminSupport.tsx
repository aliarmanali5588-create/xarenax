import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Eye,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";

interface SupportTicket {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  priority: string;
  admin_notes: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminSupport = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const updates: any = { 
        status: newStatus,
        admin_notes: adminNotes || null
      };

      if (newStatus === 'resolved' || newStatus === 'closed') {
        const { data: { user } } = await supabase.auth.getUser();
        updates.resolved_by = user?.id;
        updates.resolved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(`Ticket ${newStatus === 'resolved' ? 'resolved' : 'updated'} successfully`);
      fetchTickets();
      setViewDialogOpen(false);
      setAdminNotes("");
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const handleUpdatePriority = async (ticketId: string, newPriority: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ priority: newPriority })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success('Priority updated successfully');
      fetchTickets();
    } catch (error) {
      console.error('Error updating priority:', error);
      toast.error('Failed to update priority');
    }
  };

  const openTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setAdminNotes(ticket.admin_notes || "");
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      in_progress: { variant: "default", icon: MessageCircle },
      resolved: { variant: "outline", icon: CheckCircle2 },
      closed: { variant: "outline", icon: CheckCircle2 },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      normal: "bg-green-500/20 text-green-400 border-green-500/50",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      urgent: "bg-red-500/20 text-red-400 border-red-500/50",
    };
    return (
      <Badge className={`${colors[priority]} border`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const stats = {
    pending: tickets.filter((t) => t.status === 'pending').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    urgent: tickets.filter((t) => t.priority === 'urgent').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading support tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-gaming font-bold mb-2 admin-glow-gold">
          Support Tickets
        </h1>
        <p className="text-muted-foreground">
          Manage user queries and support requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="admin-neon-card admin-neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold admin-glow-gold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="admin-neon-card admin-neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats.in_progress}</div>
          </CardContent>
        </Card>

        <Card className="admin-neon-card admin-neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
          </CardContent>
        </Card>

        <Card className="admin-neon-card admin-neon-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Urgent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold admin-glow-red">{stats.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="admin-neon-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card className="admin-neon-card">
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Priority</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-muted-foreground">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{ticket.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {ticket.email}
                          </div>
                          {ticket.phone && (
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {ticket.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="max-w-xs truncate">{ticket.subject}</div>
                      </td>
                      <td className="p-3">{getStatusBadge(ticket.status)}</td>
                      <td className="p-3">
                        <Select
                          value={ticket.priority}
                          onValueChange={(value) => handleUpdatePriority(ticket.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3 text-sm">
                        {format(new Date(ticket.created_at), 'MMM dd, yyyy')}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openTicket(ticket)}
                          className="admin-neon-border hover:admin-rgb-glow"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Support Ticket Details
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <div className="font-medium">{selectedTicket.name}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="font-medium">{selectedTicket.email}</div>
                </div>
                {selectedTicket.phone && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Phone</Label>
                    <div className="font-medium">{selectedTicket.phone}</div>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <div className="font-medium">
                    {format(new Date(selectedTicket.created_at), 'MMM dd, yyyy HH:mm')}
                  </div>
                </div>
              </div>

              {/* Subject & Message */}
              <div>
                <Label>Subject</Label>
                <div className="mt-1 p-3 bg-accent/30 rounded-lg font-medium">
                  {selectedTicket.subject}
                </div>
              </div>

              <div>
                <Label>Message</Label>
                <div className="mt-1 p-3 bg-accent/30 rounded-lg whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              {/* Status & Priority */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
                <div className="flex-1">
                  <Label>Priority</Label>
                  <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this ticket..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="gap-2">
                {selectedTicket.status === 'pending' && (
                  <Button
                    variant="default"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'in_progress')}
                  >
                    Mark In Progress
                  </Button>
                )}
                {(selectedTicket.status === 'pending' || selectedTicket.status === 'in_progress') && (
                  <Button
                    variant="outline"
                    className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved')}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
                {selectedTicket.status === 'resolved' && (
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                  >
                    Close Ticket
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSupport;
