-- Fix duplicate referral bonuses and implement fraud prevention

-- 1. Update create_user_profile to ONLY create profile, NOT give bonus
-- The trigger will handle bonus separately
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id uuid,
  p_username text,
  p_ign text,
  p_bgmi_id text,
  p_device_id text,
  p_signup_ip text,
  p_referral_code text,
  p_referred_by uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  profile_exists boolean;
BEGIN
  -- Check if profile already exists (idempotency check)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_user_id) INTO profile_exists;
  
  IF profile_exists THEN
    -- Profile already exists, don't create duplicate
    RETURN;
  END IF;

  -- Insert profile (NO BONUS LOGIC HERE - trigger will handle it)
  INSERT INTO public.profiles (
    id,
    username,
    ign,
    bgmi_id,
    device_id,
    signup_ip,
    last_ip,
    wallet_balance,
    bonus_balance,
    referral_code,
    referred_by
  ) VALUES (
    p_user_id,
    p_username,
    p_ign,
    p_bgmi_id,
    p_device_id,
    p_signup_ip,
    p_signup_ip,
    0,
    0,
    p_referral_code,
    p_referred_by
  );
  
  -- Assign user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'user'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

-- 2. Update handle_referral_signup to give bonus ONLY for FIRST referral (fraud prevention)
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  referrer_id uuid;
  referrer_bonus_count integer;
BEGIN
  -- Check if user was referred by someone
  IF NEW.referred_by IS NOT NULL THEN
    referrer_id := NEW.referred_by;
    
    -- FRAUD PREVENTION: Check if referrer has EVER received signup bonus before
    SELECT COUNT(*) INTO referrer_bonus_count
    FROM public.transactions
    WHERE user_id = referrer_id 
    AND type = 'referral_signup_bonus';
    
    -- Only give bonus if this is referrer's FIRST successful referral
    IF referrer_bonus_count = 0 THEN
      -- Add ₹10 to referrer's bonus_balance
      UPDATE public.profiles
      SET bonus_balance = bonus_balance + 10
      WHERE id = referrer_id;
      
      -- Create transaction record for referrer
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (
        referrer_id,
        10,
        'referral_signup_bonus',
        'success',
        'Referral signup bonus from ' || COALESCE(NEW.username, 'new user')
      );
      
      -- Send notification to referrer
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        referrer_id,
        '🎉 New Referral Signup!',
        'Great news! ' || COALESCE(NEW.username, 'A new user') || ' just signed up using your referral code. You earned ₹10 bonus!',
        'affiliate'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. Update handle_referral_win_commission to give 10% of actual prize (NOT deducted from winner)
CREATE OR REPLACE FUNCTION public.handle_referral_win_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  winner_profile RECORD;
  referrer_id uuid;
  commission_amount numeric;
BEGIN
  -- Only trigger if participant won (rank = 1)
  IF NEW.rank = 1 AND (OLD.rank IS NULL OR OLD.rank != 1) THEN
    -- Get the winner's profile
    SELECT * INTO winner_profile
    FROM public.profiles
    WHERE id = NEW.user_id;
    
    -- Check if winner was referred by someone
    IF winner_profile.referred_by IS NOT NULL THEN
      referrer_id := winner_profile.referred_by;
      
      -- Calculate 10% commission from prize_amount (NOT deducted from winner)
      commission_amount := NEW.prize_amount * 0.10;
      
      -- Add commission to referrer's wallet_balance (Real Cash)
      UPDATE public.profiles
      SET wallet_balance = wallet_balance + commission_amount
      WHERE id = referrer_id;
      
      -- Create transaction record for referrer
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (
        referrer_id,
        commission_amount,
        'referral_win_bonus',
        'success',
        '10% referral commission from ' || COALESCE(winner_profile.username, 'referred user') || ' winning ₹' || NEW.prize_amount
      );
      
      -- Send notification to referrer
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        referrer_id,
        '💰 Referral Win Commission!',
        'Awesome! ' || COALESCE(winner_profile.username, 'Your referred user') || ' just won ₹' || NEW.prize_amount || '! You earned ₹' || commission_amount || ' commission (10%)!',
        'affiliate'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;