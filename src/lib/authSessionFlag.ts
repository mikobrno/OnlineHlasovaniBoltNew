// Simple shared flag to indicate when auth state is known (after initial Nhost hook evaluation)
// Apollo authLink will consult this to skip token logic before readiness, preventing /v1/token noise.
let authReady = false;

export function setAuthReady(value: boolean) {
  authReady = value;
}

export function isAuthReady(): boolean {
  return authReady;
}
