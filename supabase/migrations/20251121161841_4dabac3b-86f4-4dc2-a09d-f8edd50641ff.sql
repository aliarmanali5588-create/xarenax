-- Update the handle_new_user function to include ign and bgmi_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  generated_code TEXT;
BEGIN
  -- Generate unique referral code
  generated_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Insert profile with IGN and BGMI ID
  INSERT INTO public.profiles (id, username, full_name, referral_code, ign, bgmi_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generated_code,
    COALESCE(NEW.raw_user_meta_data->>'ign', ''),
    COALESCE(NEW.raw_user_meta_data->>'bgmi_id', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$function$;