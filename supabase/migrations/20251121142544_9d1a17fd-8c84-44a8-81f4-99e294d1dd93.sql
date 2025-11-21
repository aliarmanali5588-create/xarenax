-- CRITICAL SECURITY FIX: Harden profiles table RLS policies
-- Step 1: Drop ALL existing policies on profiles table
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safely" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles of tournament co-participants" ON public.profiles;

-- Step 2: Explicitly revoke all permissions from anonymous role
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.profiles FROM anon;

-- Step 3: Ensure RLS is enabled (should already be, but enforce it)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create strict Zero Trust policies

-- Policy 1: Users can only access their own profile
CREATE POLICY "Users can only access own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 2: Admins have full access to all profiles
CREATE POLICY "Admins can access all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 5: Add additional protection - users cannot modify sensitive fields
CREATE POLICY "Users cannot modify wallet_balance or is_banned"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND wallet_balance = (SELECT wallet_balance FROM profiles WHERE id = auth.uid())
  AND is_banned = (SELECT is_banned FROM profiles WHERE id = auth.uid())
);