import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface RazorpayOptions {
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export const useRazorpay = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      name: "ArenaX",
      description: "Add money to wallet",
      image: "/favicon.ico",
      handler: async function (response: any) {
        try {
          // Call edge function to credit wallet
          const { data, error } = await supabase.functions.invoke('handle-payment-success', {
            body: {
              amount: amount,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            }
          });

          if (error) {
            console.error("Payment processing error:", error);
            throw error;
          }

          if (!data?.success) {
            console.error("Payment processing failed:", data);
            throw new Error(data?.error || 'Payment processing failed');
          }

          // Force refresh wallet balance
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['wallet'] });

          toast({
            title: "Payment Successful!",
            description: `₹${amount} has been added to your wallet.`,
          });
          onSuccess?.(response);
        } catch (err) {
          console.error("Payment verification failed:", err);
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

  return { initiatePayment };
};
