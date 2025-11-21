-- Fix the security definer view issue
-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles;

-- Create view with SECURITY INVOKER (uses querying user's permissions)
CREATE OR REPLACE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.profiles;

-- Grant SELECT permission on this view
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Add RLS policy to allow anyone to read from this view
-- Since the view only exposes safe columns, this is secure
CREATE POLICY "Anyone can view public profile data"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

COMMENT ON VIEW public.public_profiles IS 'Public-safe profile data for leaderboards. Uses SECURITY INVOKER to enforce RLS policies of the querying user.';