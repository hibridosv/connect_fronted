const TENANT_STORAGE_KEYS = [
  'config-storage',
  'menu-storage',
  'default-contact-storage',
  'notification-storage',
  'qr-reader-storage',
];

let switchingTenant = false;

export function clearTenantStorage() {
  try {
    TENANT_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

// Lets the tab that performs the switch handle its own redirect, so SessionSyncer
// does not reload it on the current page when the new session arrives.
export function setSwitchingTenant(value: boolean) {
  switchingTenant = value;
}

export function isSwitchingTenant() {
  return switchingTenant;
}
