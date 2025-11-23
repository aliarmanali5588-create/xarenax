-- Add game_mode column with default 'classic'
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS game_mode text DEFAULT 'classic';

-- Add tags column for display (e.g., "1v1", "M416 Only")
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Add check constraint for game_mode
ALTER TABLE public.tournaments 
ADD CONSTRAINT tournaments_game_mode_check 
CHECK (game_mode = ANY (ARRAY['classic'::text, 'tdm'::text]));