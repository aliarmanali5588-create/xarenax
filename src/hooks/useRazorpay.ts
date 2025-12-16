import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { usePaymentRetry } from "./usePaymentRetry";
import confetti from "canvas-confetti";
import { playSuccessSound, playErrorSound } from "@/lib/soundEffects";

interface RazorpayOptions {
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export const useRazorpay = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { executeWithRetry } = usePaymentRetry();
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = async ({ amount, onSuccess, onFailure }: RazorpayOptions) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a payment.",
        variant: "destructive",
      });
      return;
    }

    // Check if Razorpay is loaded
    if (typeof (window as any).Razorpay === "undefined") {
      toast({
        title: "Payment Service Unavailable",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    // Fetch Razorpay Key from database
    let razorpayKey = "rzp_test_XXXXXXXXXXXXXXXX"; // Fallback
    try {
      const { data, error } = await supabase
        .from("platform_settings")
        .select("setting_value")
        .eq("setting_key", "razorpay_key_id")
        .single();

      if (error) throw error;
      if (data?.setting_value) {
        razorpayKey = data.setting_value;
      }
    } catch (error) {
      console.error("Failed to fetch Razorpay key:", error);
      toast({
        title: "Configuration Error",
        description: "Failed to load payment configuration. Using default.",
        variant: "destructive",
      });
    }

    const options = {
      key: razorpayKey,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "TeamFire",
      description: "Add money to wallet",
      image: "/favicon.ico",
      handler: async function (response: any) {
        try {
          // Immediately show processing state
          setIsProcessing(true);
          
          console.log('=== Razorpay Payment Success ===');
          console.log('Full Razorpay Response:', response);
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Order ID:', response.razorpay_order_id);
          
          // Get current session to ensure we have a valid auth token
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.error('No active session found');
            throw new Error('No active session found');
          }

          console.log('Session found, calling edge function...');

          // Call edge function with retry logic
          await executeWithRetry(async () => {
            const { data, error } = await supabase.functions.invoke('handle-payment-success', {
              body: {
                amount: amount,
                orderId: response.razorpay_order_id || 'MANUAL_PAYMENT',
                paymentId: response.razorpay_payment_id
              },
              headers: {
                Authorization: `Bearer ${session.access_token}`
              }
            });

            if (error) {
              console.error("Payment processing error:", error);
              console.error("Error details:", JSON.stringify(error));
              throw error;
            }

            console.log('Edge function response:', data);

            if (!data?.success) {
              console.error("Payment processing failed:", data);
              throw new Error(data?.error || 'Payment processing failed');
            }

            return data;
          }, {
            maxRetries: 3,
            initialDelay: 1000,
            backoffMultiplier: 2
          });

          // Force refresh wallet balance
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['wallet'] });

          // Trigger confetti celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#ff00ff', '#00ff88']
          });
          
          // Play success sound
          playSuccessSound();
          
          toast({
            title: "Payment Successful!",
            description: `₹${amount} has been added to your wallet.`,
          });
          
          // Hide processing state and reload page
          setIsProcessing(false);
          onSuccess?.(response);
          
          // Reload page after a brief delay to show success message
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (err) {
          console.error("Payment verification failed:", err);
          setIsProcessing(false);
          
          // Play error sound
          playErrorSound();
          
          toast({
            title: "Verification Failed",
            description: "Payment succeeded but wallet update failed. Contact support with your payment ID.",
            variant: "destructive",
          });
          onFailure?.(err);
        }
      },
      prefill: {
        name: "Player Name",
        email: "player@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#00f0ff",
      },
      modal: {
        ondismiss: function () {
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment process.",
            variant: "destructive",
          });
          onFailure?.({ message: "Payment cancelled by user" });
        },
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return { initiatePayment, isProcessing };
};
