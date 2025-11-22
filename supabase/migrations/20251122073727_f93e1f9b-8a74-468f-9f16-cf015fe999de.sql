-- Update tournament status constraint to support both old and new workflow statuses

-- Drop the old check constraint  
ALTER TABLE public.tournaments DROP CONSTRAINT IF EXISTS tournaments_status_check;

-- Add new check constraint that includes both old ('open') and new ('upcoming', 'live') statuses
-- This ensures backward compatibility while adding new statuses
ALTER TABLE public.tournaments 
ADD CONSTRAINT tournaments_status_check 
CHECK (status IN ('open', 'upcoming', 'live', 'full', 'completed', 'cancelled'));

-- Set default status to 'upcoming' for new tournaments
ALTER TABLE public.tournaments 
ALTER COLUMN status SET DEFAULT 'upcoming';

-- Add comment to clarify status usage
COMMENT ON COLUMN public.tournaments.status IS 'Tournament status: open (legacy), upcoming (default), live (room details added), full, completed, cancelled';