-- Migration: ensure settings table exists and is tracked with permissive dev policies
-- Run this in Nhost/Hasura SQL console.

CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_settings_updated_at ON public.settings;
CREATE TRIGGER trg_settings_updated_at
BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop old dev policies if exist
DO $$ BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "dev_settings_select" ON public.settings';
  EXECUTE 'DROP POLICY IF EXISTS "dev_settings_all" ON public.settings';
END $$;

-- VERY PERMISSIVE DEV POLICIES (adjust before production!)
CREATE POLICY "dev_settings_select" ON public.settings
  FOR SELECT USING (true);
CREATE POLICY "dev_settings_all" ON public.settings
  FOR ALL USING (true) WITH CHECK (true);

-- Seed defaults (idempotent)
INSERT INTO public.settings (key, value) VALUES
  ('general', '{"appName":"Online Hlasovani","appDescription":"Správa hlasování SVJ","defaultLanguage":"cs","timezone":"Europe/Prague"}'),
  ('sms', '{"provider":"smsbrana","username":"","password":"","senderName":"SVJ"}'),
  ('security', '{"sessionTimeout":30,"maxLoginAttempts":5,"passwordMinLength":8,"requireTwoFactor":false}'),
  ('notifications', '{"emailNotifications":true,"smsNotifications":false,"browserNotifications":false}'),
  ('appearance', '{"defaultTheme":"system","primaryColor":"#2563eb","logoUrl":""}')
ON CONFLICT (key) DO NOTHING;

-- NOTE: After running this, ensure table is *tracked* in Hasura metadata.
-- In Hasura console: Data -> Untracked tables -> Track for public.settings
