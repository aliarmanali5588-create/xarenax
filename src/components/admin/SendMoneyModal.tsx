import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, Send } from "lucide-react";

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    ign: string;
    walletBalance: number;
  };
  onSuccess: () => void;
}

const SendMoneyModal = ({ isOpen, onClose, user, onSuccess }: SendMoneyModalProps) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"winning" | "refund" | "bonus" | "penalty">("winning");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Check if penalty amount exceeds wallet balance
    if (type === "penalty" && amountNum > user.walletBalance) {
      toast.error(`Cannot deduct ₹${amountNum}. User only has ₹${user.walletBalance} in wallet.`);
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    try {
      setLoading(true);

      // Fetch current profile data
      const { data: currentProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("wallet_balance, total_winnings")
        .eq("id", user.id)
        .single();

      if (fetchError) throw fetchError;

      // Calculate new balance (add for credit types, subtract for penalty)
      const balanceChange = type === "penalty" ? -amountNum : amountNum;
      
      // Update user's wallet balance and total_winnings if it's a winning
      const updateData: any = {
        wallet_balance: Math.max(0, (currentProfile.wallet_balance || 0) + balanceChange),
      };

      if (type === "winning") {
        updateData.total_winnings = (currentProfile.total_winnings || 0) + amountNum;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          amount: amountNum,
          type: type,
          status: "success",
          description: description.trim(),
        });

      if (transactionError) throw transactionError;

      // Send notification to user
      const notificationMessage = type === "winning" 
        ? `Congratulations! You received ₹${amountNum} as tournament winnings. ${description.trim()}`
        : type === "refund"
        ? `Your refund of ₹${amountNum} has been processed. ${description.trim()}`
        : type === "bonus"
        ? `You received a bonus of ₹${amountNum}! ${description.trim()}`
        : `₹${amountNum} has been deducted from your wallet. Reason: ${description.trim()}`;

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: type === "winning" 
            ? "🏆 Tournament Winning!" 
            : type === "refund" 
            ? "💰 Refund Processed" 
            : type === "bonus"
            ? "🎁 Bonus Received"
            : "⚠️ Wallet Deduction",
          message: notificationMessage,
          type: type === "penalty" ? "system" : "payment",
        });

      if (notificationError) console.error("Notification error:", notificationError);

      toast.success(
        type === "penalty" 
          ? `₹${amountNum} deducted from ${user.username}'s wallet`
          : `₹${amountNum} sent to ${user.username} successfully!`
      );
      
      // Reset form
      setAmount("");
      setType("winning");
      setDescription("");
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error processing transaction:", error);
      toast.error(error.message || "Failed to process transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount("");
      setType("winning");
      setDescription("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-xl border-admin-gold/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-gaming text-admin-gold flex items-center gap-2">
            <DollarSign className="w-6 h-6" />
            Send Money to Player
          </DialogTitle>
          <DialogDescription className="text-base">
            Sending money to <span className="text-cyan-400 font-semibold">{user.username}</span> ({user.ign})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Current Balance Display */}
          <div className="bg-background/50 border border-admin-red/20 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">Current Wallet Balance</div>
            <div className="text-2xl font-gaming font-bold text-admin-gold">
              ₹{user.walletBalance.toLocaleString()}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground font-semibold">
              Amount (₹)
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-admin-gold" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="1"
                placeholder="Enter amount (e.g., 100)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 h-12 text-lg border-admin-red/30 focus:border-admin-gold"
                required
              />
            </div>
          </div>

          {/* Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-foreground font-semibold">
              Transaction Type
            </Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger className="h-12 border-admin-red/30 focus:border-admin-gold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl border-admin-gold/30">
                <SelectItem value="winning" className="text-green-400 font-semibold">
                  🏆 Tournament Winning
                </SelectItem>
                <SelectItem value="refund" className="text-blue-400 font-semibold">
                  💰 Refund
                </SelectItem>
                <SelectItem value="bonus" className="text-yellow-400 font-semibold">
                  🎁 Bonus
                </SelectItem>
                <SelectItem value="penalty" className="text-red-400 font-semibold">
                  ⚠️ Penalty / Fraud Deduction
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="E.g., Tournament #15 Winner - 1st Place"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] border-admin-red/30 focus:border-admin-gold resize-none"
              required
            />
          </div>

          {/* Preview of New Balance */}
          {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
            <div className={`border rounded-lg p-4 ${
              type === "penalty" 
                ? "bg-red-500/10 border-red-500/30" 
                : "bg-green-500/10 border-green-500/30"
            }`}>
              <div className="text-sm text-muted-foreground mb-1">
                {type === "penalty" ? "New Balance After Deduction" : "New Balance After Transaction"}
              </div>
              <div className={`text-2xl font-gaming font-bold ${
                type === "penalty" ? "text-red-400" : "text-green-400"
              }`}>
                ₹{(type === "penalty" 
                  ? Math.max(0, user.walletBalance - parseFloat(amount))
                  : user.walletBalance + parseFloat(amount)
                ).toLocaleString()}
              </div>
              {type === "penalty" && parseFloat(amount) > user.walletBalance && (
                <div className="text-xs text-red-400 mt-2">
                  ⚠️ Amount exceeds current balance
                </div>
              )}
            </div>
          )}
        </form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-admin-red/30"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || (type === "penalty" && parseFloat(amount) > user.walletBalance)}
            className={
              type === "penalty"
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-gaming"
                : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-gaming"
            }
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {type === "penalty" ? `Deduct ₹${amount || "0"}` : `Send ₹${amount || "0"}`}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendMoneyModal;
