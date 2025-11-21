import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Wallet, CheckCircle, XCircle } from "lucide-react";

interface WithdrawalRequest {
  id: string;
  username: string;
  amount: number;
  upiId: string;
  bankDetails?: {
    accountNo: string;
    bankName: string;
    ifsc: string;
  };
  status: "pending" | "paid" | "rejected";
  requestDate: string;
}

const AdminWithdrawals = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([
    {
      id: "WD001",
      username: "pro_gamer_x",
      amount: 5000,
      upiId: "progamer@paytm",
      status: "pending",
      requestDate: "2024-01-15",
    },
    {
      id: "WD002",
      username: "ace_player",
      amount: 3000,
      upiId: "ace.player@ybl",
      bankDetails: {
        accountNo: "1234567890",
        bankName: "HDFC Bank",
        ifsc: "HDFC0001234",
      },
      status: "pending",
      requestDate: "2024-01-15",
    },
    {
      id: "WD003",
      username: "sniper_king",
      amount: 2500,
      upiId: "sniper@oksbi",
      status: "paid",
      requestDate: "2024-01-14",
    },
  ]);

  const handleMarkAsPaid = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "paid" as const } : req
      )
    );
    toast.success("Withdrawal marked as paid!");
  };

  const handleReject = (id: string) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "rejected" as const } : req
      )
    );
    toast.error("Withdrawal request rejected");
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const totalPending = pendingRequests.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-orange-400">
              {pendingRequests.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-admin-gold">
              ₹{totalPending.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-gaming font-bold text-cyan-400">
              {requests.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Withdrawal Requests Table */}
      <Card className="bg-card/50 backdrop-blur-xl border-admin-red/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet className="h-6 w-6 text-admin-gold" />
            <CardTitle className="text-xl font-gaming text-admin-gold">
              Withdrawal Requests
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-admin-red/20">
                <TableHead className="text-admin-gold">ID</TableHead>
                <TableHead className="text-admin-gold">User</TableHead>
                <TableHead className="text-admin-gold">Amount</TableHead>
                <TableHead className="text-admin-gold">Payment Details</TableHead>
                <TableHead className="text-admin-gold">Date</TableHead>
                <TableHead className="text-admin-gold">Status</TableHead>
                <TableHead className="text-admin-gold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className="border-admin-red/20">
                  <TableCell className="font-mono text-xs">
                    {request.id}
                  </TableCell>
                  <TableCell className="font-medium text-cyan-400">
                    {request.username}
                  </TableCell>
                  <TableCell className="font-bold text-admin-gold">
                    ₹{request.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">UPI:</span>
                        <span className="text-foreground font-mono">
                          {request.upiId} 🔒
                        </span>
                      </div>
                      {request.bankDetails && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Bank:</span>
                            <span className="text-foreground">
                              {request.bankDetails.bankName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">A/C:</span>
                            <span className="text-foreground font-mono">
                              {request.bankDetails.accountNo} 🔒
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">IFSC:</span>
                            <span className="text-foreground font-mono">
                              {request.bankDetails.ifsc}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {request.requestDate}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        request.status === "paid"
                          ? "default"
                          : request.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        request.status === "pending"
                          ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                          : request.status === "paid"
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : ""
                      }
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Paid
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWithdrawals;
