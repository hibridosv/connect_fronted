import { create } from 'zustand';


interface ordersStoreI {
  orders: any | null;
  order: any | null;
  lastResponse: any | null;
  tables: any | null;
  error: boolean;
  loading: boolean;
  sending: boolean;
  sendingProductIds: number[];
  saving: boolean;
  collecting: boolean;
  deleting: boolean;
}

const ordersStore = create<ordersStoreI>((set) => ({
  orders: null,
  order: null,
  lastResponse: null,
  tables: null,
  error: false,
  loading: false,
  sending: false,
  sendingProductIds: [],
  saving: false,
  collecting: false,
  deleting: false,
}));

export default ordersStore;
