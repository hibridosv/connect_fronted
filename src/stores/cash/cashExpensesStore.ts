import { createService, deleteService, getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from '../toastMessageStore';

const replaceExpenseInList = (expenses: any, id: string, updatedExpense: any) => {
    if (!expenses) return expenses;
    if (Array.isArray(expenses)) {
        return expenses.map((expense: any) => expense.id === id ? updatedExpense : expense);
    }
    return {
        ...expenses,
        data: expenses.data?.map((expense: any) => expense.id === id ? updatedExpense : expense) ?? expenses.data,
    };
};

interface cashExpensesStoreProps {
  expenses: any | null;
  expensesCategories: any | null;
  error: boolean;
  loading: boolean;
  sending: boolean;
  deleting: boolean;
  uploadingImage: boolean;
  deletingImage: boolean;
  loadExpenses: (url: string) => Promise<void>;
  loadExpensesCategories: (url: string) => Promise<void>;
  createExpense: (data: any) => Promise<boolean>;
  createExpenseCategory: (data: any) => Promise<boolean>;
  deleteExpense: (url: string) => Promise<void>;
  uploadExpenseImage: (id: string, data: FormData) => Promise<boolean>;
  deleteExpenseImage: (id: string) => Promise<boolean>;
}

const cashExpensesStore = create<cashExpensesStoreProps>((set, get) => ({
    expenses: null,
    expensesCategories: null,
    error: false,
    loading: false,
    sending: false,
    deleting: false,
    uploadingImage: false,
    deletingImage: false,
    loadExpenses: async (url: string) => {
        set({ loading: true });
        try {
            const response = await getServices(url);
            set({ expenses: response.data.data, error: false });
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },

    loadExpensesCategories: async (url: string) => {
        set({ loading: true });
        try {
            const response = await getServices(url);
            set({ expensesCategories: response.data.data, error: false });
        } catch (error) {
            console.error('Error fetching data:', error);
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },


    createExpense: async (data) => {
        set({ sending: true });
        try {
            const response = await createService("cash/expenses", data);
            set({ expenses: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ sending: false });
        }
    },

    createExpenseCategory: async (data) => {
        set({ loading: true });
        try {
            const response = await createService("cash/categories", data);
            set({ expensesCategories: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ loading: false });
        }
    },
    
    deleteExpense: async (url: string) => {
        set({ deleting: true });
        try {
            const response = await deleteService(url);
            set({ expenses: response.data.data, error: false });
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
        } finally {
            set({ deleting: false });
        }
    },

    uploadExpenseImage: async (id: string, data: FormData) => {
        set({ uploadingImage: true });
        try {
            const response = await createService(`cash/expenses/${id}/image`, data);
            const updatedExpense = response.data.data;
            set({
                expenses: replaceExpenseInList(get().expenses, id, updatedExpense),
                error: false,
            });
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ uploadingImage: false });
        }
    },

    deleteExpenseImage: async (id: string) => {
        set({ deletingImage: true });
        try {
            const response = await deleteService(`cash/expenses/${id}/image`);
            const updatedExpense = response.data.data;
            set({
                expenses: replaceExpenseInList(get().expenses, id, updatedExpense),
                error: false,
            });
            useToastMessageStore.getState().setMessage(response);
            return true;
        } catch (error) {
            useToastMessageStore.getState().setError(error);
            set({ error: true });
            return false;
        } finally {
            set({ deletingImage: false });
        }
    },

}));

export default cashExpensesStore;
