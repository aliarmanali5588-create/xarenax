
-- Create sub_admins table for managing sub-admin permissions
CREATE TABLE public.sub_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  display_name text NOT NULL,
  permissions text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sub_admins ENABLE ROW LEVEL SECURITY;

-- Only super admin can manage sub_admins
CREATE POLICY "Super admin can manage sub_admins"
ON public.sub_admins
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'ashadislam333@gmail.com'
  )
);

-- Also allow selfashad@gmail.com (owner) 
CREATE POLICY "Owner can manage sub_admins"
ON public.sub_admins
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'selfashad@gmail.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = 'selfashad@gmail.com'
  )
);

-- Sub-admins can read their own record (to fetch permissions)
CREATE POLICY "Sub-admins can view own record"
ON public.sub_admins
FOR SELECT
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_sub_admins_updated_at
BEFORE UPDATE ON public.sub_admins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
