import { create } from 'zustand';

type SessionStoreState = {
  accessToken: string | null;
  url: string | null;
  setSession: (accessToken: string, url: string) => void;
  clearSession: () => void;
};

let resolveSessionChecked: () => void;
export const sessionChecked = new Promise<void>((resolve) => {
  resolveSessionChecked = resolve;
});

const sessionStore = create<SessionStoreState>((set) => ({
  accessToken: null,
  url: null,
  setSession: (accessToken, url) => {
    resolveSessionChecked();
    set({ accessToken, url });
  },
  clearSession: () => {
    resolveSessionChecked();
    set({ accessToken: null, url: null });
  },
}));

export default sessionStore;
