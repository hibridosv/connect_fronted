// Cuentas recordadas en este navegador para el inicio de sesion rapido.
// Solo se guarda el usuario y los datos para mostrarlo; la contrasena nunca.
// No esta en clearTenantStorage: debe sobrevivir al cerrar sesion.
const STORAGE_KEY = 'remembered-users';
const MAX_USERS = 5;

export interface RememberedUser {
  username: string;
  name?: string | null;
  business?: string | null;
  lastLoginAt: number;
}

export function getRememberedUsers(): RememberedUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((u) => typeof u?.username === 'string') : [];
  } catch {
    return [];
  }
}

function saveRememberedUsers(list: RememberedUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_USERS)));
  } catch {}
}

const sameUser = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

// Lo pone de primero; conserva el nombre y el negocio que ya tenia
export function rememberUser(username: string) {
  const list = getRememberedUsers();
  const previous = list.find((u) => sameUser(u.username, username));
  saveRememberedUsers([
    { ...previous, username, lastLoginAt: Date.now() },
    ...list.filter((u) => !sameUser(u.username, username)),
  ]);
}

export function forgetUser(username: string) {
  saveRememberedUsers(getRememberedUsers().filter((u) => !sameUser(u.username, username)));
}

export function isRemembered(username: string) {
  return getRememberedUsers().some((u) => sameUser(u.username, username));
}

// Se llama al cargar config/find: completa el nombre y el negocio de una cuenta ya recordada
export function updateRememberedUser(username: string | undefined | null, data: { name?: string | null; business?: string | null }) {
  if (!username) return;
  const list = getRememberedUsers();
  if (!list.some((u) => sameUser(u.username, username))) return;
  saveRememberedUsers(list.map((u) => (sameUser(u.username, username) ? { ...u, ...data } : u)));
}
