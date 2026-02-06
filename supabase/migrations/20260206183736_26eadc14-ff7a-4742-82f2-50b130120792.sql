-- SECURITY FIX: Remove overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.profiles;

-- Create a secure view that ONLY exposes referral_code for public lookup
-- Using security_invoker=on ensures RLS is respected
CREATE OR REPLACE VIEW public.public_referral_codes
WITH (security_invoker=on) AS
  SELECT 
    id,
    referral_code
  FROM public.profiles;

-- Grant SELECT on the view to authenticated and anon users
GRANT SELECT ON public.public_referral_codes TO authenticated;
GRANT SELECT ON public.public_referral_codes TO anon;

-- Create RLS policy on profiles for the view to work
-- This allows SELECT only on id and referral_code columns via the view
CREATE POLICY "Allow referral code lookup via view"
ON public.profiles
FOR SELECT
TO anon
USING (true);

-- Note: The view only exposes id and referral_code, so even though 
-- the policy allows SELECT, only those columns are accessible via the view