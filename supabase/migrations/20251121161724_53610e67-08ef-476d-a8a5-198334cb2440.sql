-- Add IGN and BGMI ID columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN ign TEXT,
ADD COLUMN bgmi_id TEXT;

-- Create index for faster searches
CREATE INDEX idx_profiles_bgmi_id ON public.profiles(bgmi_id);
CREATE INDEX idx_profiles_ign ON public.profiles(ign);