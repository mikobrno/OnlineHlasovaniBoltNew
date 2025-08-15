CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE public.settings IS 'Key-value store for application settings.';
COMMENT ON COLUMN public.settings.key IS 'The unique key for the setting.';
COMMENT ON COLUMN public.settings.value IS 'The JSONB value of the setting.';

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow admin users to manage settings
CREATE POLICY "Allow admin to manage settings" ON public.settings
    FOR ALL
    TO "user" -- Změněno z "authenticated" na "user" pro Nhost
    USING ( (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE )
    WITH CHECK ( (SELECT is_admin FROM public.users WHERE id = auth.uid()) = TRUE );

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
('general', '{
  "appName": "OnlineSprava",
  "appDescription": "Systém pro správu hlasování a komunikace v SVJ/BD",
  "defaultLanguage": "cs",
  "timezone": "Europe/Prague"
}'),
('sms', '{
  "provider": "smsbrana",
  "username": "",
  "password": ""
}'),
('security', '{
  "sessionTimeout": 30,
  "maxLoginAttempts": 5,
  "passwordMinLength": 8,
  "requireTwoFactor": false
}'),
('notifications', '{
  "emailNotifications": true,
  "smsNotifications": true,
  "browserNotifications": false
}'),
('appearance', '{
  "defaultTheme": "system",
  "primaryColor": "#3b82f6",
  "logoUrl": ""
}')
ON CONFLICT (key) DO NOTHING;

-- Create a function to get a setting value
CREATE OR REPLACE FUNCTION get_setting(setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
    setting_value JSONB;
BEGIN
    SELECT value INTO setting_value FROM public.settings WHERE key = setting_key;
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create a function to update a setting value
CREATE OR REPLACE FUNCTION update_setting(setting_key TEXT, new_value JSONB)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.settings (key, value)
    VALUES (setting_key, new_value)
    ON CONFLICT (key) DO UPDATE
    SET value = new_value, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
