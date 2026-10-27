import { DashboardAiState, DashboardArrangement, DashboardInsight, DashboardPeriod, DashboardRangeValues, DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { createService, deleteService, getServices, updateService } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from './toastMessageStore';

interface DashboardState {
  widgets: DashboardWidget[];
  layout: string[];
  arrangement: DashboardArrangement[];
  customized: boolean;
  saving: boolean;
  range: DashboardRangeValues | null;
  period: DashboardPeriod | null;
  data: { [key: string]: DashboardWidgetData };
  loadingKeys: string[];
  insights: DashboardInsight[] | null;
  insightsLoading: boolean;
  ai: DashboardAiState | null;
  aiLoading: boolean;
  aiRequesting: boolean;
  loading: boolean;
  error: boolean;
  loadWidgets: () => Promise<void>;
  loadData: (keys: string[], range: DashboardRangeValues | null) => Promise<void>;
  setRange: (range: DashboardRangeValues) => void;
  saveLayout: (arrangement: DashboardArrangement[]) => Promise<boolean>;
  resetLayout: () => Promise<boolean>;
  loadInsights: () => Promise<void>;
  updateInsight: (id: string, status: 'dismissed' | 'done') => Promise<void>;
  loadAi: () => Promise<void>;
  requestAi: () => Promise<void>;
}

const rangeQuery = (range: DashboardRangeValues | null): string => {
  if (!range || range.preset === 'today') return '';
  const finalDate = range.option === '2' ? `&finalDate=${range.finalDate}` : '';
  return `&option=${range.option}&initialDate=${range.initialDate}${finalDate}`;
};

const catalogState = (data: any) => ({
  widgets: data.widgets,
  layout: data.layout,
  arrangement: data.arrangement,
  customized: data.customized,
});

const useDashBoardStore = create<DashboardState>((set, get) => ({
  widgets: [],
  layout: [],
  arrangement: [],
  customized: false,
  saving: false,
  range: null,
  period: null,
  data: {},
  loadingKeys: [],
  insights: null,
  insightsLoading: false,
  ai: null,
  aiLoading: false,
  aiRequesting: false,
  loading: false,
  error: false,

  loadWidgets: async () => {
    set({ loading: true });
    try {
      const response = await getServices('dashboard/widgets');
      set({ ...catalogState(response.data.data), error: false });
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      set({ error: true });
    } finally {
      set({ loading: false });
    }
  },

  // los indicadores y el resto van en llamadas separadas para que una consulta pesada no retrase las tarjetas
  loadData: async (keys, range) => {
    if (keys.length === 0) return;
    const { widgets } = get();
    const typeOf = (key: string) => widgets.find((widget) => widget.key === key)?.type;
    const isKpi = (key: string) => typeOf(key) === 'kpi';
    keys = keys.filter((key) => !['insights', 'ai'].includes(typeOf(key) as string));
    if (keys.length === 0) return;
    const batches = [keys.filter(isKpi), keys.filter((key) => !isKpi(key))].filter((batch) => batch.length > 0);

    set((state) => ({ loadingKeys: Array.from(new Set([...state.loadingKeys, ...keys])) }));
    await Promise.all(batches.map(async (batch) => {
      try {
        const response = await getServices(`dashboard/widgets/data?widgets=${batch.join(',')}${rangeQuery(range)}`);
        set((state) => ({ data: { ...state.data, ...response.data.data.widgets }, period: response.data.data.period, error: false }));
      } catch (error) {
        const failed = Object.fromEntries(batch.map((key) => [key, { error: true }]));
        set((state) => ({ data: { ...state.data, ...failed }, error: true }));
      } finally {
        set((state) => ({ loadingKeys: state.loadingKeys.filter((key) => !batch.includes(key)) }));
      }
    }));
  },

  setRange: (range) => set({ range, data: {} }),

  saveLayout: async (arrangement) => {
    set({ saving: true });
    try {
      const response = await updateService('dashboard/layout', { widgets: arrangement });
      set(catalogState(response.data.data));
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  resetLayout: async () => {
    set({ saving: true });
    try {
      const response = await deleteService('dashboard/layout');
      set(catalogState(response.data.data));
      useToastMessageStore.getState().setMessage(response);
      return true;
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      return false;
    } finally {
      set({ saving: false });
    }
  },

  loadInsights: async () => {
    set({ insightsLoading: true });
    try {
      const response = await getServices('dashboard/insights');
      set({ insights: response.data.data });
    } catch (error) {
      set({ insights: [] });
    } finally {
      set({ insightsLoading: false });
    }
  },

  loadAi: async () => {
    set({ aiLoading: true });
    try {
      const response = await getServices('dashboard/ai');
      set({ ai: response.data.data });
    } catch (error) {
      set({ ai: { report: null, last: null, manual: { used: 0, limit: 0, remaining: 0 } } });
    } finally {
      set({ aiLoading: false });
    }
  },

  // pide un analisis de hoy; el resultado llega por Reverb (o por el sondeo mientras esta pendiente)
  requestAi: async () => {
    set({ aiRequesting: true });
    try {
      const response = await createService('dashboard/ai/refresh', {});
      set((state) => ({
        ai: state.ai ? { ...state.ai, manual: response.data.data.manual, last: { status: 'pending', trigger: 'manual', created_at: new Date().toISOString() } } : state.ai,
      }));
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      set({ aiRequesting: false });
    }
  },

  updateInsight: async (id, status) => {
    try {
      const response = await updateService(`dashboard/insights/${id}`, { status });
      set((state) => ({ insights: (state.insights ?? []).filter((insight) => insight.id !== id) }));
      useToastMessageStore.getState().setMessage(response);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    }
  },
}));

export default useDashBoardStore;
