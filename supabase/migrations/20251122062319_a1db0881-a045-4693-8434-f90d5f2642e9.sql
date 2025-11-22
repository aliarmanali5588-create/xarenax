-- Fix duplicate referral bonus in create_user_profile function with atomic logic
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
SET search_path TO 'public'
AS $$
DECLARE
  profile_exists boolean;
  bonus_given boolean;
BEGIN
  -- Check if profile already exists (idempotency check)
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = p_user_id) INTO profile_exists;
  
  IF profile_exists THEN
    -- Profile already exists, don't create duplicate
    RETURN;
  END IF;

  -- Insert profile
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
  
  -- Credit referral bonus if applicable (WITH ATOMIC PROTECTION)
  IF p_referred_by IS NOT NULL THEN
    -- Check if bonus already given to this referrer for this specific user
    SELECT EXISTS(
      SELECT 1 FROM public.transactions 
      WHERE user_id = p_referred_by 
      AND type = 'referral_signup_bonus'
      AND description = 'Referral signup bonus from ' || p_username
    ) INTO bonus_given;
    
    -- Only give bonus if not already given
    IF NOT bonus_given THEN
      -- Update referrer's bonus balance
      UPDATE public.profiles
      SET bonus_balance = bonus_balance + 10
      WHERE id = p_referred_by;
      
      -- Create transaction record
      INSERT INTO public.transactions (user_id, amount, type, status, description)
      VALUES (
        p_referred_by,
        10,
        'referral_signup_bonus',
        'success',
        'Referral signup bonus from ' || p_username
      );
      
      -- Send notification
      INSERT INTO public.notifications (user_id, title, message, type)
      VALUES (
        p_referred_by,
        '🎉 New Referral Signup!',
        'Great news! ' || p_username || ' just signed up using your referral code. You earned ₹10 bonus!',
        'affiliate'
      );
    END IF;
  END IF;
END;
$$;