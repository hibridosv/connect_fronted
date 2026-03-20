import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface QrHistoryEntry {
  id: string;
  fileName: string;
  readAt: string;
  data: any;
}

interface QrReaderStoreState {
  currentInvoice: any | null;
  currentFileName: string | null;
  history: QrHistoryEntry[];
  setInvoice: (fileName: string, data: any) => void;
  clearInvoice: () => void;
  selectFromHistory: (id: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const qrReaderStore = create(
  persist<QrReaderStoreState>(
    (set, get) => ({
      currentInvoice: null,
      currentFileName: null,
      history: [],
      setInvoice: (fileName, data) => {
        const entry: QrHistoryEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          fileName,
          readAt: new Date().toISOString(),
          data,
        };
        set((state) => ({
          currentInvoice: data,
          currentFileName: fileName,
          history: [entry, ...state.history.filter((h) => h.fileName !== fileName)].slice(0, 5),
        }));
      },
      clearInvoice: () => set({ currentInvoice: null, currentFileName: null }),
      selectFromHistory: (id) => {
        const entry = get().history.find((h) => h.id === id);
        if (entry) set({ currentInvoice: entry.data, currentFileName: entry.fileName });
      },
      removeFromHistory: (id) => {
        set((state) => ({ history: state.history.filter((h) => h.id !== id) }));
      },
      clearHistory: () => set({ history: [], currentInvoice: null, currentFileName: null }),
    }),
    {
      name: 'qr-reader-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default qrReaderStore;
