-- Fix RLS Policies for Withdrawal Requests to ensure Admin visibility

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can manage withdrawals" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users can create withdrawals" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users can view their own withdrawal requests" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Users can create withdrawal requests" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Admins can view all withdrawal requests" ON public.withdrawal_requests;
DROP POLICY IF EXISTS "Admins can update withdrawal requests" ON public.withdrawal_requests;

-- 1. Allow Users to View/Create their OWN requests
CREATE POLICY "Users access own withdrawals" 
ON public.withdrawal_requests 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Allow Admins to View/Manage ALL requests (God Mode)
CREATE POLICY "Admins access all" 
ON public.withdrawal_requests 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);