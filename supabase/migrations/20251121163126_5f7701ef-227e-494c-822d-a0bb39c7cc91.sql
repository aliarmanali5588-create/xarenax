-- Add anti-fraud tracking columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN signup_ip text,
ADD COLUMN last_ip text,
ADD COLUMN device_id text;

-- Create index for faster duplicate detection
CREATE INDEX idx_profiles_signup_ip ON public.profiles(signup_ip) WHERE signup_ip IS NOT NULL;
CREATE INDEX idx_profiles_device_id ON public.profiles(device_id) WHERE device_id IS NOT NULL;

-- Create function to check for duplicate accounts (Max 2 accounts per device/IP)
CREATE OR REPLACE FUNCTION public.check_duplicate_accounts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  duplicate_count integer;
BEGIN
  -- Count existing accounts with same device_id OR signup_ip
  SELECT COUNT(*) INTO duplicate_count
  FROM public.profiles
  WHERE (device_id = NEW.device_id AND NEW.device_id IS NOT NULL)
     OR (signup_ip = NEW.signup_ip AND NEW.signup_ip IS NOT NULL);
  
  -- Block if 2 or more accounts already exist
  IF duplicate_count >= 2 THEN
    RAISE EXCEPTION 'Maximum account limit reached for this device. Please log in to your existing account.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce duplicate account check
CREATE TRIGGER trigger_check_duplicate_accounts
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.check_duplicate_accounts();

-- Update handle_new_user function to include device_id and signup_ip
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  generated_code TEXT;
BEGIN
  -- Generate unique referral code
  generated_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Insert profile with IGN, BGMI ID, device_id, and signup_ip
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
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generated_code,
    COALESCE(NEW.raw_user_meta_data->>'ign', ''),
    COALESCE(NEW.raw_user_meta_data->>'bgmi_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'device_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'referred_by' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'referred_by')::uuid 
      ELSE NULL 
    END
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;