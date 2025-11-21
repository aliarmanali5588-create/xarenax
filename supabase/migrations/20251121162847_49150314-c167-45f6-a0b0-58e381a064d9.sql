-- Add bonus_balance column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN bonus_balance numeric NOT NULL DEFAULT 0;

-- Add total_deposited and total_winnings tracking columns
ALTER TABLE public.profiles 
ADD COLUMN total_deposited numeric NOT NULL DEFAULT 0,
ADD COLUMN total_winnings numeric NOT NULL DEFAULT 0;

-- Create function to handle referral signup bonus (₹10 in bonus_balance)
CREATE OR REPLACE FUNCTION public.handle_referral_signup()
RETURNS TRIGGER
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
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for referral signup bonus
CREATE TRIGGER trigger_referral_signup
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_signup();

-- Create function to handle referral win commission (₹100 in wallet_balance)
CREATE OR REPLACE FUNCTION public.handle_referral_win_commission()
RETURNS TRIGGER
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
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for referral win commission
CREATE TRIGGER trigger_referral_win_commission
AFTER UPDATE OF rank ON public.participants
FOR EACH ROW
EXECUTE FUNCTION public.handle_referral_win_commission();