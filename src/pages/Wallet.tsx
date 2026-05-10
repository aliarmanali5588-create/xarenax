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
import PaymentHistoryModal from "@/components/wallet/PaymentHistoryModal";

const Wallet = () => {
  const { user } = useAuth();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingTestMoney, setAddingTestMoney] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [bonusBalance, setBonusBalance] = useState(0);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchWalletBalance();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("wallet_balance, bonus_balance, total_deposited, total_winnings")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setCurrentBalance(data.wallet_balance || 0);
        setBonusBalance(data.bonus_balance || 0);
        setTotalDeposited(data.total_deposited || 0);
        setTotalWinnings(data.total_winnings || 0);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error("Failed to load wallet balance");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      // Calculate total withdrawn
      const withdrawn = data
        ?.filter((t) => t.type === "withdrawal" && t.status === "success")
        .reduce((sum, t) => sum + t.amount, 0) || 0;
      
      setTotalWithdrawn(withdrawn);
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setTransactionsLoading(false);
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
      fetchTransactions(); // Refresh transactions
    } catch (error) {
      console.error("Error adding test money:", error);
      toast.error("Failed to add test money");
    } finally {
      setAddingTestMoney(false);
    }
  };

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
    <div className="min-h-screen pb-20 lg:pb-0">
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
          <div className="glass-card rounded-2xl p-6 sm:p-8 mb-6 md:mb-8 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.15)]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-xs sm:text-sm text-muted-foreground mb-2 md:mb-3 font-medium">Wallet Balance (Withdrawable)</div>
                {loading ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-5xl sm:text-6xl md:text-7xl font-gaming font-bold text-primary drop-shadow-[0_0_20px_rgba(0,255,255,0.6)]">
                    <IndianRupee className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
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
                  className="w-full h-14 hover:scale-105 transition-transform text-sm sm:text-base font-bold shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)]"
                  onClick={() => setDepositModalOpen(true)}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Money
                </Button>
                <Button 
                  variant="neonOrange" 
                  size="lg" 
                  className="w-full h-14 hover:scale-105 transition-transform text-sm sm:text-base font-bold shadow-[0_0_30px_rgba(251,146,60,0.3)] hover:shadow-[0_0_40px_rgba(251,146,60,0.5)]"
                  onClick={() => setWithdrawalModalOpen(true)}
                >
                  <ArrowDownToLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Withdraw
                </Button>
              </div>

              {/* Payment History Button */}
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-12 hover:scale-105 transition-transform text-sm sm:text-base"
                  onClick={() => setPaymentHistoryOpen(true)}
                >
                  <History className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View Payment History
                </Button>
              </div>

              {/* Test Money Button - Super Admin Only */}
              {user?.email === 'ashadislam333@gmail.com' && (
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
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 mb-8 md:mb-12">
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Deposits</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-primary">₹{totalDeposited}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Winnings</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-success">₹{totalWinnings}</div>
            </div>
            <div className="glass-panel rounded-xl p-4 md:p-6">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 md:mb-2">Total Withdrawn</div>
              <div className="text-xl md:text-2xl font-heading font-bold text-secondary">₹{totalWithdrawn}</div>
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
                          <div className="font-medium mb-1 text-sm sm:text-base">
                            {transaction.description || transaction.type}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.created_at).toLocaleString()}
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
                          {["deposit", "winning", "referral_signup_bonus", "referral_win_bonus"].includes(transaction.type) ? "+" : ""}₹
                          {transaction.amount}
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
        onSuccess={(newBalance) => {
          setCurrentBalance(newBalance);
          fetchTransactions();
        }}
      />
      <PaymentHistoryModal
        open={paymentHistoryOpen}
        onOpenChange={setPaymentHistoryOpen}
      />
    </div>
  );
};

export default Wallet;
