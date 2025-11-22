-- Update the handle_new_user trigger function with proper referral logic
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_id uuid;
  new_referral_code text;
  assigned_role app_role;
BEGIN
  -- Generate a unique referral code for the new user
  new_referral_code := UPPER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 8));
  
  -- Determine role based on email
  IF NEW.email = 'ashadislam333@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;
  
  -- 1. Create Profile with all required fields
  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    referral_code, 
    ign, 
    bgmi_id,
    device_id,
    signup_ip,
    last_ip,
    bonus_balance,
    wallet_balance,
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    new_referral_code,
    COALESCE(NEW.raw_user_meta_data->>'ign', ''),
    COALESCE(NEW.raw_user_meta_data->>'bgmi_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'device_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    0,
    0,
    CASE 
      WHEN NEW.raw_user_meta_data->>'referred_by' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'referred_by')::uuid 
      ELSE NULL 
    END
  );
  
  -- 2. Assign Role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();