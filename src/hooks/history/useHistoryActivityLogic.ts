import { AdditionalField, DateRangeValues } from '@/components/button/DateRange';
import { ActivityLogFilters } from '@/interfaces/activityLog';
import { urlConstructor } from '@/lib/urlConstructor';
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Historial de acciones: filtros (modulo, accion, usuario) en el DateRange y paginado
export function useHistoryActivityLogic(currentPage: string) {
    const [ history, setHistory ] = useState<any>(null);
    const [ filters, setFilters ] = useState<ActivityLogFilters | null>(null);
    const [ values, setValues ] = useState<DateRangeValues>({ option: "1", initialDate: `${DateTime.now().toFormat('yyyy-MM-dd')} 00:00:00` });
    const { openLoading, closeLoading, loading } = useStateStore();

    useEffect(() => {
        (async () => {
            try {
                const response = await getServices('histories/activity/filters');
                setFilters(response.data.data);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    const loadHistory = useCallback(async (data: DateRangeValues, page: string) => {
        openLoading("history");
        try {
            const response = await getServices(`${urlConstructor(data, 'histories/activity')}${page}`);
            setHistory(response.data.data);
        } catch (error) {
            console.error(error);
            setHistory(null);
        } finally {
            closeLoading("history");
        }
    }, [openLoading, closeLoading]);

    useEffect(() => {
        loadHistory(values, currentPage);
    }, [values, currentPage, loadHistory]);

    const additionalFields: AdditionalField[] = useMemo(() => {
        if (!filters) return [];
        const all = { value: '', label: 'Todos' };
        return [
            { name: 'module', label: 'Módulo', type: 'select', options: [all, ...filters.modules.map(m => ({ value: m.id, label: m.name }))] },
            { name: 'event', label: 'Acción', type: 'select', options: [all, ...filters.events.map(e => ({ value: e.id, label: e.name }))] },
            { name: 'userId', label: 'Usuario', type: 'select', options: [all, ...filters.users.map(u => ({ value: u.id, label: u.name }))] },
        ];
    }, [filters]);

    return { history, setValues, additionalFields, loading };
}
