-- 1. Ensure the table structure is correct
-- (Table already exists, just making sure)

-- 2. CRITICAL: Add UNIQUE constraint on tournament_id (Required for Upsert)
ALTER TABLE public.tournament_secrets 
DROP CONSTRAINT IF EXISTS unique_tournament_secret;

ALTER TABLE public.tournament_secrets 
ADD CONSTRAINT unique_tournament_secret UNIQUE (tournament_id);

-- 3. Fix RLS Policies for Admin Access
-- Drop old policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view all tournament secrets" ON public.tournament_secrets;
DROP POLICY IF EXISTS "Admins can insert tournament secrets" ON public.tournament_secrets;
DROP POLICY IF EXISTS "Admins can update tournament secrets" ON public.tournament_secrets;
DROP POLICY IF EXISTS "Admins can delete tournament secrets" ON public.tournament_secrets;
DROP POLICY IF EXISTS "Admins full access" ON public.tournament_secrets;

-- Add comprehensive Admin policy using has_role function
CREATE POLICY "Admins full access" 
ON public.tournament_secrets 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Keep the existing participant access policy
DROP POLICY IF EXISTS "Paid participants can view tournament secrets" ON public.tournament_secrets;

CREATE POLICY "Paid participants can view tournament secrets" 
ON public.tournament_secrets 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM participants
    WHERE participants.tournament_id = tournament_secrets.tournament_id
      AND participants.user_id = auth.uid()
      AND participants.payment_status = 'paid'
  )
);