import { NhostClient } from '@nhost/nhost-js';
import { nhost } from './nhostClient';

/**
 * Helper funkce pro získání JWT tokenu
 */
export async function getAccessToken(): Promise<string | null> {
  const token = await nhost.auth.getAccessToken();
  return token || null;
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
