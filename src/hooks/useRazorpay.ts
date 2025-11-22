import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RazorpayOptions {
  amount: number;
  onSuccess?: (response: any) => void;
  onFailure?: (error: any) => void;
}

export const useRazorpay = () => {
  const { toast } = useToast();

  const initiatePayment = async ({ amount, onSuccess, onFailure }: RazorpayOptions) => {
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
      handler: function (response: any) {
        toast({
          title: "Payment Successful!",
          description: `₹${amount} has been added to your wallet.`,
        });
        onSuccess?.(response);
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
