
-- Drop old map constraint
ALTER TABLE public.tournaments 
DROP CONSTRAINT IF EXISTS tournaments_map_check;

-- Add new map constraint with all maps (Classic + TDM)
ALTER TABLE public.tournaments 
ADD CONSTRAINT tournaments_map_check 
CHECK (map = ANY (ARRAY[
  'Erangel'::text, 
  'Livik'::text, 
  'Miramar'::text, 
  'Sanhok'::text,
  'Warehouse'::text,
  'Hangar'::text,
  'Ruins'::text,
  'Santorini'::text,
  'Library'::text
]));
