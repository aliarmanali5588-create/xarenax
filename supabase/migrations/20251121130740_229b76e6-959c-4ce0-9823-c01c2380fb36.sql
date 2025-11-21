-- CRITICAL FIX: Remove the overly permissive policy I just added
-- That policy would expose all profile data to everyone!
DROP POLICY IF EXISTS "Anyone can view public profile data" ON public.profiles;

-- The correct security model is:
-- 1. Profiles table has strict RLS (users see only their own, admins see all)
-- 2. public_profiles VIEW filters to safe columns only
-- 3. For leaderboards, we'll use a different approach (aggregated data or Edge Function)

-- For now, profiles remain locked down:
-- - Users can ONLY see their own complete profile
-- - Admins can see all profiles
-- This is the most secure approach.