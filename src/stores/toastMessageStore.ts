import { create } from 'zustand';
interface ToastMessageState {
  message: any | null;
  error: any | null;
  info: string | null;
  setMessage: (message: any) => void;
  clearMessage: () => void;
  setError: (error: any) => void;
  clearError: () => void;
  // aviso neutro, p. ej. una busqueda sin resultados (type 'empty' de connect)
  setInfo: (info: string | null) => void;
  clearInfo: () => void;
}

const useToastMessageStore = create<ToastMessageState>((set) => ({
  message: null,
  error: null,
  info: null,
  setMessage: (message: any) => set({ message }),
  clearMessage: () => set({ message: null }),
  setError: (error: any) => set({ error }),
  clearError: () => set({ error: null }),
  setInfo: (info: string | null) => set({ info }),
  clearInfo: () => set({ info: null }),
}));
export default useToastMessageStore;
