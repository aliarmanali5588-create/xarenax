-- 1. Drop the failing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 2. Update RLS policies to allow frontend inserts
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 3. Allow users to insert their own roles
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;

CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id AND role = 'user'::app_role);

-- 4. Ensure all required columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ign text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bgmi_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code text UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS device_id text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS signup_ip text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_ip text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_balance numeric DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bonus_balance numeric DEFAULT 0;