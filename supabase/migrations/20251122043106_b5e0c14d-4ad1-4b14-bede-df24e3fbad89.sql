-- Create function to get affiliate stats
CREATE OR REPLACE FUNCTION public.get_affiliate_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total_signups integer;
  active_depositors integer;
  matches_played integer;
  total_earnings numeric;
  result jsonb;
BEGIN
  -- Count total signups (users referred by this user)
  SELECT COUNT(*) INTO total_signups
  FROM profiles
  WHERE referred_by = p_user_id;
  
  -- Count active depositors (referred users who have deposited)
  SELECT COUNT(DISTINCT p.id) INTO active_depositors
  FROM profiles p
  WHERE p.referred_by = p_user_id
  AND p.total_deposited > 0;
  
  -- Count matches played by referred users
  SELECT COUNT(*) INTO matches_played
  FROM participants pt
  INNER JOIN profiles p ON pt.user_id = p.id
  WHERE p.referred_by = p_user_id;
  
  -- Calculate total earnings from referral bonuses
  SELECT COALESCE(SUM(amount), 0) INTO total_earnings
  FROM transactions
  WHERE user_id = p_user_id
  AND type IN ('referral_signup_bonus', 'referral_win_bonus');
  
  -- Build JSON result
  result := jsonb_build_object(
    'total_signups', total_signups,
    'active_depositors', active_depositors,
    'matches_played', matches_played,
    'total_earnings', total_earnings
  );
  
  RETURN result;
END;
$$;

-- Update referral signup trigger to send notification
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  referrer_id uuid;
BEGIN
  -- Check if user was referred by someone
  IF NEW.referred_by IS NOT NULL THEN
    referrer_id := NEW.referred_by;
    
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
  
  RETURN NEW;
END;
$$;

-- Update referral win commission trigger to send notification
CREATE OR REPLACE FUNCTION public.handle_referral_win_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  winner_profile RECORD;
  referrer_id uuid;
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
      
      -- Add ₹100 to referrer's wallet_balance (Real Cash)
      UPDATE public.profiles
      SET wallet_balance = wallet_balance + 100
      WHERE id = referrer_id;
      
      -- Create transaction record for referrer
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (
        referrer_id,
        100,
        'referral_win_bonus',
        'success',
        'Referral win commission from ' || COALESCE(winner_profile.username, 'referred user')
      );
      
      -- Send notification to referrer
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        referrer_id,
        '💰 Referral Win Commission!',
        'Awesome! ' || COALESCE(winner_profile.username, 'Your referred user') || ' just won a match! You earned ₹100 commission directly to your wallet!',
        'affiliate'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;