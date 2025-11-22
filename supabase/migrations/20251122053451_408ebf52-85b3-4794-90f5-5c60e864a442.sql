-- Drop and recreate create_user_profile function with correct parameter naming
DROP FUNCTION IF EXISTS public.create_user_profile(uuid,text,text,text,text,text,text,uuid);

CREATE FUNCTION public.create_user_profile(
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
SET search_path = public
AS $$
BEGIN
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
  
  -- Credit referral bonus if applicable
  IF p_referred_by IS NOT NULL THEN
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
END;
$$;