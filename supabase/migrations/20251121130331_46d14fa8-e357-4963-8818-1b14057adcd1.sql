-- Create tournament_secrets table for sensitive room credentials
CREATE TABLE public.tournament_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  room_id TEXT NOT NULL,
  room_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tournament_id)
);

-- Enable RLS on tournament_secrets
ALTER TABLE public.tournament_secrets ENABLE ROW LEVEL SECURITY;

-- Admins can view all tournament secrets
CREATE POLICY "Admins can view all tournament secrets"
ON public.tournament_secrets
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert tournament secrets
CREATE POLICY "Admins can insert tournament secrets"
ON public.tournament_secrets
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update tournament secrets
CREATE POLICY "Admins can update tournament secrets"
ON public.tournament_secrets
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete tournament secrets
CREATE POLICY "Admins can delete tournament secrets"
ON public.tournament_secrets
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Users can view tournament secrets ONLY if they are paid participants
CREATE POLICY "Paid participants can view tournament secrets"
ON public.tournament_secrets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.participants
    WHERE participants.tournament_id = tournament_secrets.tournament_id
      AND participants.user_id = auth.uid()
      AND participants.payment_status = 'paid'
  )
);

-- Migrate existing data from tournaments to tournament_secrets
INSERT INTO public.tournament_secrets (tournament_id, room_id, room_password)
SELECT id, room_id, room_password
FROM public.tournaments
WHERE room_id IS NOT NULL AND room_password IS NOT NULL;

-- Remove room_id and room_password columns from tournaments table
ALTER TABLE public.tournaments DROP COLUMN IF EXISTS room_id;
ALTER TABLE public.tournaments DROP COLUMN IF EXISTS room_password;

-- Add trigger for updated_at on tournament_secrets
CREATE TRIGGER update_tournament_secrets_updated_at
BEFORE UPDATE ON public.tournament_secrets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();