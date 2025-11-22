-- Create trigger to reward referrer when referred user wins (rank = 1)
CREATE OR REPLACE FUNCTION public.handle_referral_win_commission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

-- Create trigger on participants table
DROP TRIGGER IF EXISTS reward_referrer_on_win ON public.participants;

CREATE TRIGGER reward_referrer_on_win
AFTER INSERT OR UPDATE ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_win_commission();