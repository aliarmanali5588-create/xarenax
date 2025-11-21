-- ============================================
-- GRANULAR RLS POLICIES: EXPLICIT SELECT/UPDATE/INSERT/DELETE
-- ============================================

-- STEP 1: DROP ALL EXISTING POLICIES (Clean Slate)
DROP POLICY IF EXISTS "profiles_owner_only" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_full_access" ON public.profiles;
DROP POLICY IF EXISTS "payment_methods_owner_only" ON public.user_payment_methods;
DROP POLICY IF EXISTS "payment_methods_admin_full_access" ON public.user_payment_methods;

-- STEP 2: ENSURE RLS IS ENABLED
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;

-- STEP 3: EXPLICIT REVOKE (Belt and Suspenders)
REVOKE ALL ON public.profiles FROM anon, public;
REVOKE ALL ON public.user_payment_methods FROM anon, public;

-- ============================================
-- PROFILES TABLE: GRANULAR POLICIES
-- ============================================

-- SELECT: Users can ONLY read their own profile
CREATE POLICY "profiles_read_own"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- UPDATE: Users can ONLY update their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- INSERT: Users can ONLY insert their own profile
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- DELETE: Users can ONLY delete their own profile (if needed)
CREATE POLICY "profiles_delete_own"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ADMIN: Full access for admins to all profiles
CREATE POLICY "profiles_admin_all"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- USER_PAYMENT_METHODS TABLE: GRANULAR POLICIES
-- ============================================

-- SELECT: Users can ONLY read their own payment methods
CREATE POLICY "payment_read_own"
ON public.user_payment_methods
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can ONLY update their own payment methods
CREATE POLICY "payment_update_own"
ON public.user_payment_methods
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- INSERT: Users can ONLY insert their own payment methods
CREATE POLICY "payment_insert_own"
ON public.user_payment_methods
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can ONLY delete their own payment methods (if needed)
CREATE POLICY "payment_delete_own"
ON public.user_payment_methods
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ADMIN: Full access for admins to all payment methods
CREATE POLICY "payment_admin_all"
ON public.user_payment_methods
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================
-- VERIFICATION NOTES
-- ============================================
-- Anonymous users: SELECT returns 0 rows (RLS blocks)
-- Authenticated users: SELECT returns ONLY their own row
-- Admins: SELECT returns ALL rows