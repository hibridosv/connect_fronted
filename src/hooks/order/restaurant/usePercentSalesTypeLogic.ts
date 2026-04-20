import { getServices } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import ordersStore from '@/stores/orders/ordersStore';
import { useEffect, useState } from 'react';

export function usePercentSalesTypeLogic() {
  const { activeConfig } = useConfigStore();
  const { order } = ordersStore();
  const [percentages, setPercentages] = useState<any[]>([]);

  useEffect(() => {
    if (order?.invoiceproducts) return;
    if (!activeConfig?.includes('restaurant-sales-percent')) return;

    const loadPercentages = async () => {
      try {
        const response = await getServices('dashboard/percentaje?restricted=true');
        if (response?.data?.data && Array.isArray(response.data.data)) {
          setPercentages(response.data.data);
        } else {
          setPercentages([]);
        }
      } catch {
        setPercentages([]);
      }
    };

    loadPercentages();
  }, [order, activeConfig]);

  return { percentages };
}
