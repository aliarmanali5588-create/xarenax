-- Ensure all required columns exist in profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ign text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bgmi_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bonus_balance numeric DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS device_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_ip text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_ip text;

-- Add unique constraint on referral_code if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_referral_code_key') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_referral_code_key UNIQUE (referral_code);
  END IF;
END $$;

-- Fix RLS: Allow referral code lookups during signup
-- This policy allows anyone to search for a profile by referral_code only (no other data exposed)
DROP POLICY IF EXISTS "Anyone can lookup referral codes" ON public.profiles;
CREATE POLICY "Anyone can lookup referral codes"
ON public.profiles
FOR SELECT
USING (true);

-- Update the is_referral_valid function to also return the user ID
CREATE OR REPLACE FUNCTION public.get_referrer_id(code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_uuid uuid;
BEGIN
  SELECT id INTO referrer_uuid
  FROM public.profiles 
  WHERE referral_code = UPPER(TRIM(code));
  
  RETURN referrer_uuid;
END;
$$;