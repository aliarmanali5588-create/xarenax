-- ============================================
-- ADMIN INVITATION SYSTEM
-- ============================================

-- Step 1: Create admin_invitations table
CREATE TABLE public.admin_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invite_code text NOT NULL UNIQUE,
  invitee_email text NOT NULL,
  granted_role app_role NOT NULL DEFAULT 'admin',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at timestamp with time zone NOT NULL,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  redeemed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Step 2: Add index for performance
CREATE INDEX idx_admin_invitations_code ON public.admin_invitations(invite_code);
CREATE INDEX idx_admin_invitations_status ON public.admin_invitations(status);
CREATE INDEX idx_admin_invitations_expires ON public.admin_invitations(expires_at);

-- Step 3: Enable RLS
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies - Only super admin can manage invitations
CREATE POLICY "Super admin can view all invitations"
ON public.admin_invitations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

CREATE POLICY "Super admin can create invitations"
ON public.admin_invitations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

CREATE POLICY "Super admin can update invitations"
ON public.admin_invitations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

CREATE POLICY "Super admin can delete invitations"
ON public.admin_invitations
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

-- Step 5: Function to generate unique invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    -- Generate 12-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(random()::text || clock_timestamp()::text) FROM 1 FOR 12));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM admin_invitations WHERE invite_code = code) INTO exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Step 6: Function to validate and redeem invite code
CREATE OR REPLACE FUNCTION public.redeem_admin_invite(code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation record;
  user_email text;
  result jsonb;
BEGIN
  -- Get current user email
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not authenticated');
  END IF;
  
  -- Get invitation
  SELECT * INTO invitation
  FROM admin_invitations
  WHERE invite_code = code
  FOR UPDATE;
  
  -- Check if invitation exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid invitation code');
  END IF;
  
  -- Check if already redeemed
  IF invitation.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invitation has already been used');
  END IF;
  
  -- Check if expired
  IF invitation.expires_at < now() THEN
    UPDATE admin_invitations
    SET status = 'expired'
    WHERE id = invitation.id;
    
    RETURN jsonb_build_object('success', false, 'error', 'This invitation has expired');
  END IF;
  
  -- Check if email matches
  IF invitation.invitee_email != user_email THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invitation is not for your email address');
  END IF;
  
  -- Grant role to user
  INSERT INTO user_roles (user_id, role)
  VALUES (auth.uid(), invitation.granted_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Mark invitation as accepted
  UPDATE admin_invitations
  SET 
    status = 'accepted',
    redeemed_by = auth.uid(),
    redeemed_at = now()
  WHERE id = invitation.id;
  
  RETURN jsonb_build_object('success', true, 'role', invitation.granted_role);
END;
$$;

-- Step 7: Add trigger for updated_at
CREATE TRIGGER update_admin_invitations_updated_at
BEFORE UPDATE ON public.admin_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Step 8: Function to auto-expire old invitations (for cron)
CREATE OR REPLACE FUNCTION public.expire_old_invitations()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.admin_invitations
  SET status = 'expired'
  WHERE status = 'pending'
  AND expires_at < now();
$$;