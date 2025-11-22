-- Fix infinite recursion in participants RLS policy
-- The issue is the policy references the participants table within itself

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view participants of tournaments they joined" ON public.participants;

-- Create simplified policies that don't cause recursion
-- Admins can see all participants
CREATE POLICY "Admins can view all participants" 
ON public.participants 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Users can view their own participant records
CREATE POLICY "Users can view own participant records" 
ON public.participants 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can view other participants in tournaments they've joined
-- Using a security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.user_is_tournament_participant(p_tournament_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.participants
    WHERE tournament_id = p_tournament_id
      AND user_id = p_user_id
  )
$$;

CREATE POLICY "Users can view participants in their tournaments" 
ON public.participants 
FOR SELECT 
USING (public.user_is_tournament_participant(tournament_id, auth.uid()));