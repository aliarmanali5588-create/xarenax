-- Reset Super Admin Password
-- Email: ashadislam333@gmail.com
-- Password: @Mohammad_Ashad00###

-- First, delete any existing password for this user to ensure clean slate
UPDATE auth.users 
SET encrypted_password = crypt('@Mohammad_Ashad00###', gen_salt('bf'))
WHERE email = 'ashadislam333@gmail.com';

-- Ensure the user exists in profiles table
INSERT INTO public.profiles (id, username, ign, bgmi_id, referral_code)
SELECT 
  id, 
  'SuperAdmin', 
  'SuperAdmin', 
  'ADMIN001',
  'SUPERADMIN'
FROM auth.users 
WHERE email = 'ashadislam333@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Ensure admin role exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'ashadislam333@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;