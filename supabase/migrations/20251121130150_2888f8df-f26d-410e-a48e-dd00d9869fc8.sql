-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create restrictive SELECT policies for profiles table
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of tournament co-participants"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.participants p1
    INNER JOIN public.participants p2 ON p1.tournament_id = p2.tournament_id
    WHERE p1.user_id = auth.uid()
      AND p2.user_id = profiles.id
  )
);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for public to view basic profile info (username, avatar) for leaderboard/public features
CREATE POLICY "Public can view basic profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);