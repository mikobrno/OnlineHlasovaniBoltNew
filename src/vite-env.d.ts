/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_SMSBRANA_LOGIN: string
  readonly VITE_SMSBRANA_PASSWORD: string
  readonly NODE_ENV: string
  readonly VITE_NHOST_BACKEND_URL: string
  readonly VITE_NHOST_SUBDOMAIN: string
  readonly VITE_NHOST_REGION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
