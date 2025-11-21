-- Remove the overly permissive policy I just added
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;

-- Note: For leaderboard functionality, we can either:
-- 1. Require authentication to view leaderboards
-- 2. Create a separate public leaderboard view with only non-sensitive data
-- For now, profiles are only visible to:
-- - The user themselves (full access)
-- - Co-participants in tournaments (full access)  
-- - Admins (full access)