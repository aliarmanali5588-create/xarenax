-- Create a function to credit referral signup bonus
CREATE OR REPLACE FUNCTION public.credit_referral_bonus(
  referrer_id uuid,
  new_user_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update referrer's bonus balance
  UPDATE public.profiles
  SET bonus_balance = bonus_balance + 10
  WHERE id = referrer_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (user_id, amount, type, status, description)
  VALUES (
    referrer_id,
    10,
    'referral_signup_bonus',
    'success',
    'Referral signup bonus from ' || new_user_name
  );
  
  -- Send notification
  INSERT INTO public.notifications (user_id, title, message, type)
  VALUES (
    referrer_id,
    '🎉 New Referral Signup!',
    'Great news! ' || new_user_name || ' just signed up using your referral code. You earned ₹10 bonus!',
    'affiliate'
  );
END;
$$;