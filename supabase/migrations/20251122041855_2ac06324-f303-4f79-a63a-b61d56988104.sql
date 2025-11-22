-- ============================================
-- SUPER ADMIN SECURITY IMPLEMENTATION
-- ============================================

-- Step 1: Create helper function to check if user is super admin by email
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_email = 'ashadislam333@gmail.com';
$$;

-- Step 2: Update handle_new_user function to auto-assign admin role to super admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  generated_code TEXT;
  assigned_role app_role;
BEGIN
  -- Generate unique referral code
  generated_code := UPPER(SUBSTRING(MD5(NEW.id::TEXT || NOW()::TEXT) FROM 1 FOR 8));
  
  -- Determine role based on email
  IF NEW.email = 'ashadislam333@gmail.com' THEN
    assigned_role := 'admin';
  ELSE
    assigned_role := 'user';
  END IF;
  
  -- Insert profile with IGN, BGMI ID, device_id, and signup_ip
  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    referral_code, 
    ign, 
    bgmi_id,
    device_id,
    signup_ip,
    last_ip,
    referred_by
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    generated_code,
    COALESCE(NEW.raw_user_meta_data->>'ign', ''),
    COALESCE(NEW.raw_user_meta_data->>'bgmi_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'device_id', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    COALESCE(NEW.raw_user_meta_data->>'signup_ip', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'referred_by' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'referred_by')::uuid 
      ELSE NULL 
    END
  );
  
  -- Assign role (admin for super admin, user for everyone else)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, assigned_role);
  
  RETURN NEW;
END;
$$;

-- Step 3: Drop existing RLS policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

-- Step 4: Create strict RLS policies for user_roles table
-- Users can only view their own role
CREATE POLICY "Users can view their own role only"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only super admin can insert roles
CREATE POLICY "Only super admin can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

-- Only super admin can update roles
CREATE POLICY "Only super admin can update roles"
ON public.user_roles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

-- Only super admin can delete roles
CREATE POLICY "Only super admin can delete roles"
ON public.user_roles
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

-- Step 5: Force update existing super admin user to admin role
DO $$
DECLARE
  super_admin_id uuid;
BEGIN
  -- Find the super admin user ID
  SELECT id INTO super_admin_id
  FROM auth.users
  WHERE email = 'ashadislam333@gmail.com'
  LIMIT 1;
  
  -- If super admin exists, ensure they have admin role
  IF super_admin_id IS NOT NULL THEN
    -- Delete existing role if any
    DELETE FROM public.user_roles
    WHERE user_id = super_admin_id;
    
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (super_admin_id, 'admin');
    
    RAISE NOTICE 'Super admin role assigned to user: %', super_admin_id;
  ELSE
    RAISE NOTICE 'Super admin user not found. Will be assigned on signup.';
  END IF;
END $$;

-- Step 6: Ensure all other users have 'user' role (cleanup)
UPDATE public.user_roles
SET role = 'user'
WHERE role = 'admin'
AND user_id NOT IN (
  SELECT id FROM auth.users WHERE email = 'ashadislam333@gmail.com'
);