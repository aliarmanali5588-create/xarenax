-- MASTER FIX: Signup + Referral System Complete Repair

-- ============================================
-- STEP 1: Fix Transaction Types Constraint
-- ============================================
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_type_check 
CHECK (type IN (
  'deposit', 
  'withdrawal', 
  'entry_fee',
  'winning',
  'referral_signup_bonus',
  'referral_win_bonus',
  'bonus_credit',
  'refund'
));

-- ============================================
-- STEP 2: Prevent Duplicate Welcome Notifications
-- ============================================
-- Drop existing welcome trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_new_profile_welcome ON public.profiles;

-- Recreate the welcome function to be idempotent (prevent duplicates)
CREATE OR REPLACE FUNCTION public.handle_new_user_welcome()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only insert if notification doesn't already exist for this user
  INSERT INTO public.notifications (user_id, title, message, type)
  SELECT 
    NEW.id,
    'Welcome to ArenaX! 🚀 Here''s how to Start',
    'Ready to dominate? Follow these steps:
1. Go to Wallet & Deposit money.
2. Browse Tournaments & click Join.
3. Get Room ID 15 mins before match.
4. Win & Withdraw instantly!

Check the ''How it Works'' page for more details.',
    'system'
  WHERE NOT EXISTS (
    SELECT 1 FROM public.notifications 
    WHERE user_id = NEW.id 
    AND type = 'system' 
    AND title LIKE 'Welcome to ArenaX%'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table (more reliable than auth.users)
CREATE TRIGGER on_new_profile_welcome
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome();

-- ============================================
-- STEP 3: Ensure Referral Stats Update Properly
-- ============================================
-- The create_user_profile function already handles referral bonuses correctly
-- Just ensure it has all necessary logic

-- Verify affiliate stats function exists and works
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