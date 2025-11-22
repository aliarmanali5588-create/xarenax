-- Fix Status Constraint for Withdrawal Requests

-- 1. Drop the old strict rule
ALTER TABLE public.withdrawal_requests 
DROP CONSTRAINT IF EXISTS withdrawal_requests_status_check;

-- 2. Add a flexible rule (Allow multiple status variations)
ALTER TABLE public.withdrawal_requests 
ADD CONSTRAINT withdrawal_requests_status_check 
CHECK (status IN ('pending', 'paid', 'rejected', 'Paid', 'Rejected', 'approved'));