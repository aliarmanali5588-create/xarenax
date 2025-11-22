-- Update duplicate account check to allow unlimited for Super Admin
CREATE OR REPLACE FUNCTION public.check_duplicate_accounts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  account_count integer;
  is_admin_device boolean;
BEGIN
  -- 1. Count accounts from this IP/Device
  SELECT COUNT(*) INTO account_count
  FROM public.profiles
  WHERE (signup_ip = NEW.signup_ip AND NEW.signup_ip IS NOT NULL)
     OR (device_id = NEW.device_id AND NEW.device_id IS NOT NULL);

  -- 2. Check if this IP/Device belongs to the Admin
  -- Join with auth.users to check email since profiles doesn't store email
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p
    INNER JOIN auth.users u ON p.id = u.id
    WHERE (p.signup_ip = NEW.signup_ip OR p.device_id = NEW.device_id)
    AND u.email = 'ashadislam333@gmail.com'
  ) INTO is_admin_device;

  -- 3. Enforce Limits
  IF is_admin_device THEN
    -- Admin Device: No Limit (Allow unlimited testing)
    RETURN NEW;
  ELSE
    -- Public Device: Strict Limit of 2
    IF account_count >= 2 THEN
      RAISE EXCEPTION 'Maximum account limit (2) reached for this device.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;