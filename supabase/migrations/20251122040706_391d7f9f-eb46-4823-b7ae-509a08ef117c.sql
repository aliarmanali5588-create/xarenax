-- Create platform_settings table for managing dynamic configuration
CREATE TABLE public.platform_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins can manage all settings"
ON public.platform_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Authenticated users can only SELECT the public Razorpay key
CREATE POLICY "Users can view public razorpay key"
ON public.platform_settings
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND setting_key = 'razorpay_key_id'
);

-- Add trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Razorpay settings (placeholder values)
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES 
  ('razorpay_key_id', 'rzp_test_XXXXXXXXXXXXXXXX', 'Razorpay Public Key ID'),
  ('razorpay_key_secret', 'YOUR_SECRET_KEY_HERE', 'Razorpay Secret Key (Private)')
ON CONFLICT (setting_key) DO NOTHING;