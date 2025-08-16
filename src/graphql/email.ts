import { gql } from '@apollo/client';
import { EMAIL_TEMPLATE_FIELDS } from './templates';
import { GLOBAL_VARIABLE_FIELDS } from './globals';

export const GET_EMAIL_GENERATOR_DATA = gql`
  query GetEmailGeneratorData($buildingId: uuid!) {
    email_templates(
      where: {
        _or: [{ building_id: { _eq: $buildingId } }, { is_global: { _eq: true } }]
      }
      order_by: { name: asc }
    ) {
      ...EmailTemplateFields
    }
    members(
      where: { building_id: { _eq: $buildingId } }
      order_by: { name: asc }
    ) {
      id
      name
      email
    }
    global_variables(order_by: { name: asc }) {
      ...GlobalVariableFields
    }
    buildings_by_pk(id: $buildingId) {
      id
      name
      address
    }
  }
  ${EMAIL_TEMPLATE_FIELDS}
  ${GLOBAL_VARIABLE_FIELDS}
`;

export const SEND_TEST_EMAIL_MUTATION = gql`
  mutation SendTestEmail($to: String!, $subject: String!, $body: String!) {
    sendEmail(to: $to, subject: $subject, body: $body) {
      success
      message
    }
  }
`;

// Fallback JS volání Netlify funkce pro lokální prostředí,
// pokud Hasura akce ještě není nasazena.
export async function sendTestEmailFallback(to: string, subject: string, body: string) {
  try {
    type EmailResp = { success?: boolean; message?: string; error?: string } & Record<string, unknown>;
    // Kandidátní prefixy (SPA může být pod /OnlineHlasovaniBoltNew nebo jiném base path)
    const runtimeBase = (() => {
      if (typeof window !== 'undefined' && '__APP_BASE__' in window) {
        const v = (window as unknown as Record<string, unknown>)['__APP_BASE__'];
        return typeof v === 'string' ? v : '';
      }
      return '';
    })();
    const viteBase = (() => {
      try {
  // Vite env nemusí existovat v runtime (SSR / jiný bundler)
  const im = import.meta as unknown as Record<string, unknown>;
  const envObj = (im && typeof im === 'object' && 'env' in im) ? (im.env as Record<string, unknown>) : undefined;
  const maybe = envObj && typeof envObj.BASE_URL === 'string' ? envObj.BASE_URL : '';
        return typeof maybe === 'string' ? maybe : '';
      } catch { return ''; }
    })();
    let pathPrefix = '';
    if (typeof window !== 'undefined') {
      const segs = window.location.pathname.split('/').filter(Boolean);
      if (segs.length > 0) pathPrefix = '/' + segs[0];
    }
    const explicitEnv = (typeof window === 'undefined') ? (process.env.PUBLIC_SITE_URL || '') : '';
    const candidatesRaw = ['', runtimeBase, viteBase, pathPrefix, explicitEnv];
    // Pokud je k dispozici explicitní absolutní endpoint přes Vite env proměnnou, použijeme jej jako první (bez dalších kombinací)
    const overrideUrl = (() => {
      try {
        const im = import.meta as unknown as Record<string, unknown>;
        const envObj = (im && typeof im === 'object' && 'env' in im) ? (im.env as Record<string, unknown>) : undefined;
        const val = envObj && typeof envObj.VITE_EMAIL_FUNCTION_URL === 'string' ? envObj.VITE_EMAIL_FUNCTION_URL.trim() : '';
        return val;
      } catch { return ''; }
    })();
    if (overrideUrl) {
      try {
        const res = await fetch(overrideUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html: body })
        });
        const txt = await res.text();
        let parsed: EmailResp | null = null;
        try { parsed = txt ? JSON.parse(txt) : {}; } catch {
          return { success: false, message: `Override (${overrideUrl}) nevrátil JSON (${txt.substring(0,60)}...)` };
        }
        if (!res.ok || !parsed?.success) {
          return { success: false, message: parsed?.error as string || parsed?.message as string || `HTTP ${res.status}` };
        }
        return { success: true, message: (parsed.message as string) || 'OK' };
      } catch (e) {
        return { success: false, message: `Override selhal: ${(e as Error).message}` };
      }
    }
    const candidates = Array.from(new Set(candidatesRaw.filter(Boolean))).map(p => p.endsWith('/') ? p.slice(0,-1) : p);
    const attempts: string[] = [];
    for (const prefix of [''].concat(candidates)) {
      try {
        const url = prefix + '/.netlify/functions/send-email';
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to, subject, html: body }),
        });
        const text = await res.text();
        let data: EmailResp | null = null;
        try { data = text ? JSON.parse(text) : {}; } catch {
          attempts.push(`${url} -> nonJSON: ${text.substring(0,40)}`);
          continue;
        }
        if (!res.ok || !data?.success) {
          attempts.push(`${url} -> ${(data?.error as string) || (data?.message as string) || 'fail'}`);
          continue;
        }
        return { success: true, message: (data.message as string) || 'OK' };
      } catch (inner) {
        attempts.push(`${prefix || '(root)'} -> ${(inner as Error).message}`);
      }
    }
    return { success: false, message: 'Email funkce nedostupná: ' + attempts.slice(0,3).join(' | ') };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Neznámá chyba';
    return { success: false, message: msg };
  }
}

