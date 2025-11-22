-- Fix Double Bonus Issue with Idempotency Logic

CREATE OR REPLACE FUNCTION public.process_new_referral(new_user_id uuid, code_used text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id uuid;
  already_referred uuid;
BEGIN
  -- 1. Check if User is ALREADY linked (Prevent Double Bonus)
  SELECT referred_by INTO already_referred FROM public.profiles WHERE id = new_user_id;
  
  IF already_referred IS NOT NULL THEN
    -- Stop immediately if already processed
    RETURN;
  END IF;

  -- 2. Find Referrer
  SELECT id INTO referrer_id FROM public.profiles WHERE referral_code = code_used;

  IF referrer_id IS NOT NULL THEN
    -- Link User
    UPDATE public.profiles SET referred_by = referrer_id WHERE id = new_user_id;

    -- Reward Referrer (+10)
    UPDATE public.profiles SET bonus_balance = bonus_balance + 10 WHERE id = referrer_id;

    -- Transaction Record
    INSERT INTO public.transactions (user_id, amount, type, status, description)
    VALUES (referrer_id, 10, 'referral_signup_bonus', 'success', 'Bonus for referring a new user');

    -- Notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (referrer_id, '🎉 New Referral Signup!', 'You earned ₹10 bonus!', 'affiliate');
  END IF;
END;
$$;