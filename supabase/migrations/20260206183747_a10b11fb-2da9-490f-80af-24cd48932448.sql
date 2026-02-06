-- Drop the problematic policy we just created
DROP POLICY IF EXISTS "Allow referral code lookup via view" ON public.profiles;

-- Drop the old view to recreate it properly
DROP VIEW IF EXISTS public.public_referral_codes;

-- Create a SECURITY DEFINER function to lookup referral codes
-- This bypasses RLS and only returns the specific data we want
CREATE OR REPLACE FUNCTION public.lookup_referral_code(code text)
RETURNS TABLE(id uuid, referral_code text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.referral_code
  FROM public.profiles p
  WHERE p.referral_code = UPPER(TRIM(code))
  LIMIT 1;
$$;

-- Grant execute to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.lookup_referral_code(text) TO anon;
GRANT EXECUTE ON FUNCTION public.lookup_referral_code(text) TO authenticated;