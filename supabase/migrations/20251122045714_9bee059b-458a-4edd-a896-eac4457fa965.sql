-- Create a security definer function to validate referral codes
CREATE OR REPLACE FUNCTION public.is_referral_valid(code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return true if the referral code exists in profiles table
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE referral_code = UPPER(TRIM(code))
  );
END;
$$;