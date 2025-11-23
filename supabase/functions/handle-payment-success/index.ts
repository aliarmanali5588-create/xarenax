import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentSuccessRequest {
  amount: number;
  orderId: string;
  paymentId: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with user's auth
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      throw new Error('User not authenticated');
    }

    console.log('Processing payment for user:', user.id);

    // Parse request body
    const { amount, orderId, paymentId }: PaymentSuccessRequest = await req.json();

    if (!amount || !orderId || !paymentId) {
      throw new Error('Missing required parameters');
    }

    console.log('Payment details:', { amount, orderId, paymentId });

    // Create admin client for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Update wallet balance and total deposited
    const { data: currentProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('wallet_balance, total_deposited')
      .eq('id', user.id)
      .single();

    if (fetchError || !currentProfile) {
      console.error('Failed to fetch profile:', fetchError);
      throw new Error('Failed to fetch user profile');
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        wallet_balance: (currentProfile.wallet_balance || 0) + amount,
        total_deposited: (currentProfile.total_deposited || 0) + amount
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update profile:', updateError);
      throw updateError;
    }

    console.log('Wallet updated successfully');

    // 2. Record transaction
    const { error: transactionError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: user.id,
        amount: amount,
        type: 'deposit',
        status: 'success',
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        description: 'Wallet Deposit via Razorpay'
      });

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError);
      throw transactionError;
    }

    console.log('Transaction recorded');

    // 3. Send notification
    const { error: notificationError } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: user.id,
        title: '💰 Deposit Successful!',
        message: `Your wallet has been credited with ₹${amount}. Happy Gaming!`,
        type: 'system'
      });

    if (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't throw - notification failure shouldn't fail the whole payment
    }

    console.log('Payment processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Payment processed successfully',
        amount: amount
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
