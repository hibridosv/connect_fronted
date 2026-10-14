import { signOut } from 'next-auth/react';

const LAST_FORCED_SIGN_OUT_KEY = 'lastForcedSignOut';
const FORCED_SIGN_OUT_COOLDOWN_MS = 30000;

let signingOut = false;

// The sessionStorage cooldown prevents a redirect loop (/ -> /dashboard -> signOut -> /)
// when the auth endpoints keep failing and the session cookie cannot be cleared.
export function safeSignOut() {
  if (signingOut) return;
  try {
    const last = Number(sessionStorage.getItem(LAST_FORCED_SIGN_OUT_KEY) ?? 0);
    if (Date.now() - last < FORCED_SIGN_OUT_COOLDOWN_MS) return;
    sessionStorage.setItem(LAST_FORCED_SIGN_OUT_KEY, String(Date.now()));
  } catch {}
  signingOut = true;
  signOut({ callbackUrl: '/' });
}
