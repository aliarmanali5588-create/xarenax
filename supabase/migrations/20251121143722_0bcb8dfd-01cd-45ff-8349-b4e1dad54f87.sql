-- ============================================
-- CRITICAL SECURITY FIX: NUCLEAR RESET OF RLS
-- ============================================

-- STEP 1: FORCE ENABLE RLS (Double Check)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;

-- STEP 2: NUCLEAR OPTION - DROP ALL EXISTING POLICIES
-- Drop all profiles policies
DROP POLICY IF EXISTS "Users can only access own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users cannot modify wallet_balance or is_banned" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own complete profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile safely" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles of tournament co-participants" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can see own" ON public.profiles;

-- Drop all user_payment_methods policies
DROP POLICY IF EXISTS "Users can view own payment methods only" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Admins can view all payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Users can insert own payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Users can update own unlocked payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Admins can update all payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Admins can insert payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Owner payment" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Admin payment" ON public.user_payment_methods;

-- STEP 3: EXPLICITLY REVOKE PUBLIC/ANON ACCESS
REVOKE ALL ON public.profiles FROM anon;
REVOKE ALL ON public.profiles FROM public;
REVOKE ALL ON public.user_payment_methods FROM anon;
REVOKE ALL ON public.user_payment_methods FROM public;

-- STEP 4: CREATE STRICT "NO-LEAK" POLICIES

-- PROFILES TABLE: Owner + Admin ONLY
CREATE POLICY "profiles_owner_only"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_full_access"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- USER_PAYMENT_METHODS TABLE: Owner + Admin ONLY
CREATE POLICY "payment_methods_owner_only"
ON public.user_payment_methods
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "payment_methods_admin_full_access"
ON public.user_payment_methods
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- STEP 5: DROP ANY POTENTIALLY LEAKING VIEWS
DROP VIEW IF EXISTS public.public_profiles CASCADE;

-- VERIFICATION: Ensure no anon/public roles have any access
-- (This is just documentation, not executable)
-- SELECT * FROM pg_policies WHERE tablename IN ('profiles', 'user_payment_methods');