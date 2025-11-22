-- Insert Default Placeholder Values for Razorpay Settings
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES 
  ('razorpay_key_id', '', 'Razorpay Public Key ID (Test/Live)'),
  ('razorpay_key_secret', '', 'Razorpay Private Key Secret (Test/Live)')
ON CONFLICT (setting_key) DO NOTHING;