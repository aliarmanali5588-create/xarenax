import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const update = await req.json();
    console.log("Telegram webhook received:", JSON.stringify(update));

    // Handle callback query (button clicks)
    if (update.callback_query) {
      const callbackData = update.callback_query.data;
      const messageId = update.callback_query.message.message_id;
      const chatId = update.callback_query.message.chat.id;

      console.log("Processing callback:", callbackData);

      // Parse callback data: "approve_uuid" or "reject_uuid"
      const [action, submissionId] = callbackData.split("_");

      if (action === "approve" || action === "reject") {
        const newStatus = action === "approve" ? "approved" : "rejected";

        // Update UTR submission status
        const { data: submission, error: updateError } = await supabase
          .from("utr_submissions")
          .update({ 
            status: newStatus,
            processed_at: new Date().toISOString(),
            verification_status: newStatus === "approved" ? "verified" : "rejected"
          })
          .eq("id", submissionId)
          .select("*, profiles!inner(username, wallet_balance)")
          .single();

        if (updateError) {
          console.error("Error updating submission:", updateError);
          throw updateError;
        }

        // If approved, credit wallet
        if (newStatus === "approved" && submission) {
          const { error: walletError } = await supabase
            .from("profiles")
            .update({ 
              wallet_balance: submission.profiles.wallet_balance + submission.amount,
              total_deposited: supabase.rpc('increment', { amount: submission.amount })
            })
            .eq("id", submission.user_id);

          if (walletError) {
            console.error("Error updating wallet:", walletError);
            throw walletError;
          }

          // Create transaction record
          await supabase.from("transactions").insert({
            user_id: submission.user_id,
            amount: submission.amount,
            type: "deposit",
            status: "success",
            description: `Manual UPI Deposit - UTR: ${submission.utr_number}`,
          });

          // Send notification to user
          await supabase.from("notifications").insert({
            user_id: submission.user_id,
            title: "💰 Deposit Approved!",
            message: `Your deposit of ₹${submission.amount} has been approved and credited to your wallet.`,
            type: "payment",
          });
        } else if (newStatus === "rejected" && submission) {
          // Notify user about rejection
          await supabase.from("notifications").insert({
            user_id: submission.user_id,
            title: "❌ Deposit Rejected",
            message: `Your deposit of ₹${submission.amount} was rejected. Please contact support if you believe this is an error.`,
            type: "system",
          });
        }

        // Update Telegram message
        const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
        const statusEmoji = newStatus === "approved" ? "✅" : "❌";
        const newMessage = `${statusEmoji} *DEPOSIT ${newStatus.toUpperCase()}*

👤 *User:* ${submission.profiles?.username || "Unknown"}
💰 *Amount:* ₹${submission.amount}
🔢 *UTR:* \`${submission.utr_number}\`

Status: ${newStatus === "approved" ? "Wallet credited successfully!" : "Rejected by admin"}`;

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: newMessage,
              parse_mode: "Markdown",
            }),
          }
        );

        // Answer callback query
        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callback_query_id: update.callback_query.id,
              text: `Payment ${newStatus}!`,
            }),
          }
        );
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Telegram webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
