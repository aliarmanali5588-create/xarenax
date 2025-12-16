-- Add announcement settings to platform_settings
INSERT INTO public.platform_settings (setting_key, setting_value, description)
VALUES 
  ('announcement_enabled', 'false', 'Enable/disable the announcement bar on home page'),
  ('announcement_text', 'Welcome to TeamFire! Join tournaments and win real money!', 'The text to display in the announcement bar'),
  ('announcement_influencer', '', 'Influencer/YouTuber name to highlight in the announcement')
ON CONFLICT (setting_key) DO NOTHING;