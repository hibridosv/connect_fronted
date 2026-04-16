import { ENCRYPT_CLIENT_ID } from '@/constants';
import CryptoJS from 'crypto-js';
import { StateStorage } from 'zustand/middleware';

const SECRET = ENCRYPT_CLIENT_ID ?? '';

export const encryptedStorage: StateStorage = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(raw, SECRET);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET).toString();
    localStorage.setItem(name, encrypted);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};
