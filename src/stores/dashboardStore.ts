import { DashboardPeriod, DashboardRangeValues, DashboardWidget, DashboardWidgetData } from '@/interfaces/dashboard';
import { getServices } from '@/services/services';
import { create } from 'zustand';
import useToastMessageStore from './toastMessageStore';

interface DashboardState {
  widgets: DashboardWidget[];
  layout: string[];
  range: DashboardRangeValues | null;
  period: DashboardPeriod | null;
  data: { [key: string]: DashboardWidgetData };
  loadingKeys: string[];
  loading: boolean;
  error: boolean;
  loadWidgets: () => Promise<void>;
  loadData: (keys: string[], range: DashboardRangeValues | null) => Promise<void>;
  setRange: (range: DashboardRangeValues) => void;
}

const rangeQuery = (range: DashboardRangeValues | null): string => {
  if (!range || range.preset === 'today') return '';
  const finalDate = range.option === '2' ? `&finalDate=${range.finalDate}` : '';
  return `&option=${range.option}&initialDate=${range.initialDate}${finalDate}`;
};

const useDashBoardStore = create<DashboardState>((set, get) => ({
  widgets: [],
  layout: [],
  range: null,
  period: null,
  data: {},
  loadingKeys: [],
  loading: false,
  error: false,

  loadWidgets: async () => {
    set({ loading: true });
    try {
      const response = await getServices('dashboard/widgets');
      set({ widgets: response.data.data.widgets, layout: response.data.data.layout, error: false });
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
    const isKpi = (key: string) => widgets.find((widget) => widget.key === key)?.type === 'kpi';
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
}));

export default useDashBoardStore;
