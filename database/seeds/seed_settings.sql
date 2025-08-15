-- Seed default application settings
INSERT INTO settings (key, value) VALUES
  ('general', '{"appName":"Online Hlasovani","appDescription":"Správa hlasování SVJ","defaultLanguage":"cs","timezone":"Europe/Prague"}'),
  ('sms', '{"provider":"smsbrana","username":"","password":"","senderName":"SVJ"}'),
  ('security', '{"sessionTimeout":30,"maxLoginAttempts":5,"passwordMinLength":8,"requireTwoFactor":false}'),
  ('notifications', '{"emailNotifications":true,"smsNotifications":false,"browserNotifications":false}'),
  ('appearance', '{"defaultTheme":"system","primaryColor":"#2563eb","logoUrl":""}')
ON CONFLICT (key) DO NOTHING;
