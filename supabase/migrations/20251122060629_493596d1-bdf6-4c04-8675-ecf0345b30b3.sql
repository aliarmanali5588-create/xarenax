-- Fix duplicate referral bonus with atomic update logic
CREATE OR REPLACE FUNCTION public.process_new_referral(new_user_id uuid, code_used text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  referrer_id uuid;
  rows_updated integer;
BEGIN
  -- 1. Find Referrer
  SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = code_used;

  IF referrer_id IS NOT NULL THEN
    -- 2. ATOMIC LINKING (The Fix)
    -- Attempt to link the user ONLY IF they are not already linked.
    UPDATE public.profiles 
    SET referred_by = referrer_id 
    WHERE id = new_user_id AND referred_by IS NULL;

    -- 3. Check if WE were the ones who linked them
    GET DIAGNOSTICS rows_updated = ROW_COUNT;

    -- 4. Only give bonus if the update actually happened (rows_updated = 1)
    IF rows_updated > 0 THEN
      -- Update Bonus (+10 only)
      UPDATE public.profiles SET bonus_balance = bonus_balance + 10 WHERE id = referrer_id;

      -- Insert Transaction
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (referrer_id, 10, 'referral_signup_bonus', 'success', 'Bonus for referring a new user');

      -- Send Notification
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (referrer_id, '🎉 New Referral Signup!', 'Great news! A new user just signed up using your referral code. You earned ₹10 bonus!', 'affiliate');
    END IF;
    -- If rows_updated is 0, it means the user was already linked, so we DO NOTHING.
  END IF;
END;
$$;