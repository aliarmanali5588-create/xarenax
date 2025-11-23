-- Create function to handle Razorpay payment success
CREATE OR REPLACE FUNCTION public.handle_razorpay_success(
  p_user_id uuid, 
  p_amount numeric, 
  p_order_id text, 
  p_payment_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Update Wallet Balance and Total Deposited
  UPDATE public.profiles 
  SET wallet_balance = wallet_balance + p_amount,
      total_deposited = COALESCE(total_deposited, 0) + p_amount
  WHERE id = p_user_id;

  -- 2. Record Transaction
  INSERT INTO public.transactions (
    user_id, 
    amount, 
    type, 
    status, 
    razorpay_order_id, 
    razorpay_payment_id, 
    description
  ) VALUES (
    p_user_id, 
    p_amount, 
    'deposit', 
    'success', 
    p_order_id, 
    p_payment_id, 
    'Wallet Deposit via Razorpay'
  );

  -- 3. Send success notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    p_user_id,
    '💰 Deposit Successful!',
    'Your wallet has been credited with ₹' || p_amount || '. Happy Gaming!',
    'system'
  );
END;
$$;