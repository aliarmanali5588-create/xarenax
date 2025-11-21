import { useState } from "react";
import { Plus, ArrowDownToLine, History, IndianRupee } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DepositModal from "@/components/wallet/DepositModal";

const Wallet = () => {
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  
  const transactions = [
    {
      id: "1",
      type: "win",
      amount: 1000,
      description: "Elite Squad Championship - 1st Place",
      date: "2024-01-20 18:30",
      status: "completed",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: -500,
      description: "Bank Transfer",
      date: "2024-01-19 14:20",
      status: "completed",
    },
    {
      id: "3",
      type: "deposit",
      amount: 100,
      description: "UPI Deposit",
      date: "2024-01-18 10:15",
      status: "completed",
    },
    {
      id: "4",
      type: "entry",
      amount: -30,
      description: "Tournament Entry Fee",
      date: "2024-01-18 09:00",
      status: "completed",
    },
  ];

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "win":
      case "deposit":
        return "text-success";
      case "withdrawal":
      case "entry":
        return "text-destructive";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-gaming font-bold mb-4 text-glow-cyan">
              My Wallet
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your funds and track transactions
            </p>
          </div>

          {/* Balance Card */}
          <div className="glass-panel rounded-2xl p-8 mb-8 neon-border-cyan neon-glow-cyan">
            <div className="text-center mb-6">
              <div className="text-sm text-muted-foreground mb-2">Available Balance</div>
              <div className="flex items-center justify-center text-6xl font-gaming font-bold text-primary text-glow-cyan">
                <IndianRupee className="w-12 h-12" />
                570
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="gaming" 
                size="lg" 
                className="w-full hover:scale-105 transition-transform"
                onClick={() => setDepositModalOpen(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Money
              </Button>
              <Button variant="neonOrange" size="lg" className="w-full hover:scale-105 transition-transform">
                <ArrowDownToLine className="w-5 h-5 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-panel rounded-xl p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Deposits</div>
              <div className="text-2xl font-heading font-bold text-primary">₹100</div>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Winnings</div>
              <div className="text-2xl font-heading font-bold text-success">₹1,000</div>
            </div>
            <div className="glass-panel rounded-xl p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Withdrawn</div>
              <div className="text-2xl font-heading font-bold text-secondary">₹500</div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-heading font-bold">Transaction History</h2>
            </div>

            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="glass-panel rounded-lg p-4 hover:bg-card/60 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{transaction.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-xl font-heading font-bold ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}₹
                        {Math.abs(transaction.amount)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {transactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      </div>

      <MegaFooter />
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
    </div>
  );
};

export default Wallet;
