-- Reset password for super admin account
-- This is a one-time operation to set the password for ashadislam333@gmail.com

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the user ID for the super admin
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'ashadislam333@gmail.com';

  -- Update the password using Supabase's internal password hashing
  -- Note: The password '@Mohammad_Ashad00###' will be securely hashed
  IF admin_user_id IS NOT NULL THEN
    -- Use the admin API to update the password
    -- This requires direct auth table access
    UPDATE auth.users
    SET 
      encrypted_password = crypt('@Mohammad_Ashad00###', gen_salt('bf')),
      updated_at = now()
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Password updated successfully for super admin';
  ELSE
    RAISE EXCEPTION 'Super admin user not found';
  END IF;
END $$;