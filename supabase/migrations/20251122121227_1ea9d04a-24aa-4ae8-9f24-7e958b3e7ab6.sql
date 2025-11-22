-- Drop the admin_invitations table and related functions
DROP TABLE IF EXISTS public.admin_invitations CASCADE;

-- Drop related functions
DROP FUNCTION IF EXISTS public.generate_invite_code() CASCADE;
DROP FUNCTION IF EXISTS public.redeem_admin_invite(text) CASCADE;
DROP FUNCTION IF EXISTS public.expire_old_invitations() CASCADE;