import { NhostClient } from '@nhost/nhost-js';
import { nhost } from './nhostClient';

export { nhost };

/**
 * Helper funkce pro získání JWT tokenu
 */
export async function getAccessToken(): Promise<string | null> {
  // Do not call getAccessToken when there is no session - this avoids POST /v1/token 401s
  try {
    const session = await nhost.auth.getSession();
    if (!session) return null;
    const token = await nhost.auth.getAccessToken();
    return token || null;
  } catch {
    return null;
  }
}

/**
 * Helper funkce pro přístup k Nhost klientu
 */
export function getNhostClient(): NhostClient {
  return nhost;
}

/**
 * Helper funkce pro kontrolu, zda je uživatel přihlášený
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await nhost.auth.getSession();
  return !!session;
}

/**
 * Helper funkce pro odhlášení
 */
export async function signOut(): Promise<void> {
  await nhost.auth.signOut();
}
