-- Drop the old function with wrong signature
DROP FUNCTION IF EXISTS public.handle_razorpay_success(uuid, numeric, text, text);

-- Create secure function that uses auth.uid() instead of passing user_id
CREATE OR REPLACE FUNCTION public.handle_razorpay_success(
  p_amount numeric, 
  p_order_id text, 
  p_payment_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  curr_user_id uuid;
BEGIN
  -- Get the ID of the user calling the function
  curr_user_id := auth.uid();
  
  IF curr_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- 1. Update Wallet Balance and Total Deposited
  UPDATE public.profiles 
  SET wallet_balance = wallet_balance + p_amount,
      total_deposited = COALESCE(total_deposited, 0) + p_amount
  WHERE id = curr_user_id;

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
    curr_user_id, 
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
    curr_user_id,
    '💰 Deposit Successful!',
    'Your wallet has been credited with ₹' || p_amount || '. Happy Gaming!',
    'system'
  );
END;
$$;