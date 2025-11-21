-- ============================================
-- CRITICAL SECURITY FIX: Lock down user_payment_methods
-- ============================================

-- Ensure RLS is enabled (should already be, but double-check)
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view all payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Admins can update payment methods (including lock status)" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Users can update their own unlocked payment methods" ON public.user_payment_methods;
DROP POLICY IF EXISTS "Users can view their own payment methods" ON public.user_payment_methods;

-- STRICT POLICY 1: Users can ONLY view their own payment methods
CREATE POLICY "Users can view own payment methods only"
ON public.user_payment_methods
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- STRICT POLICY 2: Admins can view all payment methods
CREATE POLICY "Admins can view all payment methods"
ON public.user_payment_methods
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- STRICT POLICY 3: Users can insert their own payment methods (if not locked)
CREATE POLICY "Users can insert own payment methods"
ON public.user_payment_methods
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND NOT is_locked);

-- STRICT POLICY 4: Users can update their own unlocked payment methods
CREATE POLICY "Users can update own unlocked payment methods"
ON public.user_payment_methods
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND NOT is_locked)
WITH CHECK (auth.uid() = user_id);

-- STRICT POLICY 5: Admins can update any payment methods (including locked ones)
CREATE POLICY "Admins can update all payment methods"
ON public.user_payment_methods
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- STRICT POLICY 6: Admins can insert payment methods
CREATE POLICY "Admins can insert payment methods"
ON public.user_payment_methods
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- CRITICAL SECURITY FIX: Lock down profiles table
-- ============================================

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles of tournament co-participants" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile (not wallet or ban status)" ON public.profiles;

-- STRICT POLICY 1: Users can ONLY view their own complete profile (all sensitive data)
CREATE POLICY "Users can view own complete profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- STRICT POLICY 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- STRICT POLICY 3: Users can update own profile (but NOT wallet_balance or is_banned)
CREATE POLICY "Users can update own profile safely"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND wallet_balance = (SELECT wallet_balance FROM profiles WHERE id = auth.uid())
  AND is_banned = (SELECT is_banned FROM profiles WHERE id = auth.uid())
);

-- STRICT POLICY 4: Admins can update any profile (including sensitive fields)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- STRICT POLICY 5: Admins can insert profiles
CREATE POLICY "Admins can insert profiles"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- CREATE PUBLIC VIEW FOR SAFE DATA (Leaderboard)
-- ============================================

-- Create a view that exposes ONLY safe, non-sensitive profile data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.profiles;

-- Grant SELECT permission on this view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;
GRANT SELECT ON public.public_profiles TO anon;

-- Note: This view does NOT expose:
-- - wallet_balance (financial data)
-- - referral_code (sensitive)
-- - referred_by (personal relationships)
-- - is_banned (moderation data)
-- - full_name (PII)

COMMENT ON VIEW public.public_profiles IS 'Public-safe profile data for leaderboards and public displays. Does not expose sensitive financial or personal information.';