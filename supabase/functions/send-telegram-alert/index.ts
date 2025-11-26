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
    const { submissionId, amount, utrNumber, username, fraudScore, autoApproved } = await req.json();

    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const ADMIN_CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

    // Determine status emoji and message
    const statusEmoji = autoApproved ? "✅" : (fraudScore && fraudScore >= 40 ? "🚨" : "⏳");
    const statusText = autoApproved ? "AUTO-APPROVED" : (fraudScore && fraudScore >= 40 ? "SUSPICIOUS" : "PENDING");

    const message = `${statusEmoji} *NEW DEPOSIT ALERT*

👤 *User:* ${username || "Unknown"}
💰 *Amount:* ₹${amount}
🔢 *UTR:* \`${utrNumber}\`
📊 *Fraud Score:* ${fraudScore || 0}/100
🎯 *Status:* ${statusText}

${autoApproved ? "✅ Payment automatically approved!" : "👆 Review and take action:"}`;

    // Inline keyboard for approve/reject (only if not auto-approved)
    const keyboard = autoApproved ? undefined : {
      inline_keyboard: [
        [
          { text: "✅ Approve", callback_data: `approve_${submissionId}` },
          { text: "❌ Reject", callback_data: `reject_${submissionId}` }
        ]
      ]
    };

    const telegramPayload: any = {
      chat_id: ADMIN_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    };

    if (keyboard) {
      telegramPayload.reply_markup = keyboard;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Telegram API error:", errorData);
      throw new Error(`Telegram API error: ${errorData}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending Telegram alert:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
