import { useState, useEffect } from "react";
import { Plus, ArrowDownToLine, History, IndianRupee, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import MegaFooter from "@/components/layout/MegaFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawalModal from "@/components/wallet/WithdrawalModal";
import TransactionSkeleton from "@/components/wallet/TransactionSkeleton";

const Wallet = () => {
  const { user } = useAuth();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingTestMoney, setAddingTestMoney] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
    }
    // Simulate transactions loading
    const timer = setTimeout(() => {
      setTransactionsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [user]);

  const [bonusBalance, setBonusBalance] = useState(0);

  const fetchWalletBalance = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("wallet_balance, bonus_balance")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      setCurrentBalance(data?.wallet_balance || 0);
      setBonusBalance(data?.bonus_balance || 0);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestMoney = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    setAddingTestMoney(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ wallet_balance: currentBalance + 500 })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentBalance(data.wallet_balance);
      toast.success("₹500 added to your wallet for testing!");
    } catch (error) {
      console.error("Error adding test money:", error);
      toast.error("Failed to add test money");
    } finally {
      setAddingTestMoney(false);
    }
  };
  
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

      <div className="pt-24 pb-20 px-4 md:px-6 overflow-x-hidden">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-gaming font-bold mb-3 md:mb-4 text-glow-cyan">
              My Wallet
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
              Manage your funds and track transactions
            </p>
          </div>

          {/* Balance Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-6 md:mb-8 neon-border-cyan neon-glow-cyan">
            <div className="text-center mb-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-2 md:mb-3">Wallet Balance (Withdrawable)</div>
              {loading ? (
                <div className="flex items-center justify-center h-16">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center text-4xl sm:text-5xl md:text-6xl font-gaming font-bold text-primary text-glow-cyan">
                  <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                  {currentBalance}
                </div>
              )}
            </div>

            {/* Bonus Balance Display */}
            {bonusBalance > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Bonus Balance (Entry Fees Only)</div>
                  <div className="flex items-center justify-center text-2xl font-gaming font-bold text-secondary text-glow-orange">
                    <IndianRupee className="w-5 h-5" />
                    {bonusBalance}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cannot be withdrawn • Use for tournament entries
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <Button 
                variant="gaming" 
                size="lg" 
                className="w-full h-12 hover:scale-105 transition-transform text-sm sm:text-base"
                onClick={() => setDepositModalOpen(true)}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add Money
              </Button>
              <Button 
                variant="neonOrange" 
                size="lg" 
                className="w-full h-12 hover:scale-105 transition-transform text-sm sm:text-base"
                onClick={() => setWithdrawalModalOpen(true)}
              >
                <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Withdraw
              </Button>
            </div>

            {/* Test Money Button */}
            <div className="mt-4 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                size="lg"
                className="w-full border-admin-gold/50 text-admin-gold hover:bg-admin-gold/10 hover:scale-105 transition-all"
                onClick={handleAddTestMoney}
                disabled={addingTestMoney}
              >
                {addingTestMoney ? (
                  <>
                    <div className="w-4 h-4 border-2 border-admin-gold border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add Test Money (₹500)
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-8 md:mb-12">
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Deposits</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-primary">₹100</div>
            </div>
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Winnings</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-success">₹1,000</div>
            </div>
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Withdrawn</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-secondary">₹500</div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="glass-panel rounded-xl p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-xl sm:text-2xl font-heading font-bold">Transaction History</h2>
            </div>

            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((index) => (
                  <TransactionSkeleton key={index} />
                ))}
              </div>
            ) : (
              <>
                {/* Mobile Card View */}
                <div className="block space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="glass-panel rounded-lg p-4 hover:bg-card/60 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium mb-1 text-sm sm:text-base">{transaction.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.date}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs flex-shrink-0">
                          {transaction.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/30">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <div
                          className={`text-xl font-heading font-bold ${getTransactionColor(
                            transaction.type
                          )}`}
                        >
                          {transaction.amount > 0 ? "+" : ""}₹
                          {Math.abs(transaction.amount)}
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
              </>
            )}
          </div>
        </div>
      </div>

      <MegaFooter />
      <DepositModal open={depositModalOpen} onOpenChange={setDepositModalOpen} />
      <WithdrawalModal 
        open={withdrawalModalOpen} 
        onOpenChange={setWithdrawalModalOpen}
        currentBalance={currentBalance}
      />
    </div>
  );
};

export default Wallet;
