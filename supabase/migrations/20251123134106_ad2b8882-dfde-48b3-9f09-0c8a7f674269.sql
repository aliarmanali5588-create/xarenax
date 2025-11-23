-- Drop the old constraint
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

-- Add updated constraint with 'bonus' type included
ALTER TABLE public.transactions ADD CONSTRAINT transactions_type_check 
CHECK (type = ANY (ARRAY[
  'deposit'::text, 
  'withdrawal'::text, 
  'entry_fee'::text, 
  'winning'::text, 
  'referral_signup_bonus'::text, 
  'referral_win_bonus'::text, 
  'bonus_credit'::text, 
  'bonus'::text,
  'refund'::text,
  'admin_credit'::text
]));