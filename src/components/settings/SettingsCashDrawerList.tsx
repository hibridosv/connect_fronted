import { Switch } from '@/components/button/Switch';
import { getCashDrawerStatusLabel } from '@/lib/utils';
import { getServices, updateService } from '@/services/services';
import useConfigStore from '@/stores/configStore';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';

interface SettingsCashDrawerListProps {
  changes: boolean;
}

export default function SettingsCashDrawerList({ changes }: SettingsCashDrawerListProps) {
  const [cashdrawers, setCashdrawers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { invoiceTypes } = useConfigStore();
  // documentos que se pueden dejar de predeterminado en una caja: sin la nota de credito (5); el config ya quita el temporal (9)
  const drawerInvoiceTypes = (invoiceTypes ?? []).filter((type: any) => type.type != 5 && type.type != 9);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getServices('cashdrawers?included=employee,invoiceType');
      setCashdrawers(res.data.data ?? []);
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = async (item: any) => {
    setUpdatingId(item.id);
    try {
      const newStatus = item.status === 1 ? 0 : 1;
      const response = await updateService(`cashdrawers/${item.id}`, { status: newStatus });
      useToastMessageStore.getState().setMessage(response);
      await loadData();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setUpdatingId(null);
    }
  };

  // null: la caja usa el predeterminado general
  const handleInvoiceType = async (item: any, value: string) => {
    setUpdatingId(item.id);
    try {
      const response = await updateService(`cashdrawers/${item.id}`, { invoice_type_id: value === '' ? null : value });
      useToastMessageStore.getState().setMessage(response);
      await loadData();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (cashdrawers.length === 0) return <div className="p-8 text-center text-text-muted text-sm">No hay cajas de cobro</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <span className="text-sm font-semibold text-text-base">Cajas de Cobro</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Caja</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Apertura</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Documento predeterminado</th>
              <th className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {cashdrawers.map((item: any) => {
              const status = getCashDrawerStatusLabel(item.status);
              const canToggle = changes && item.status !== 2;
              return (
                <tr key={item.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${updatingId === item.id ? 'opacity-60' : ''}`}>
                  <td className="px-3 py-2 whitespace-nowrap">{item.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{item.employee?.name ?? '—'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {changes ? (
                      <select className="input-select" value={item.invoice_type_id ?? ''} onChange={(e) => handleInvoiceType(item, e.target.value)} disabled={updatingId === item.id}>
                        <option value="">Usar el predeterminado general</option>
                        {drawerInvoiceTypes.map((type: any) => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                        {/* el tipo guardado puede estar terminado o deshabilitado: la caja usa el general mientras tanto */}
                        {item.invoice_type_id && !drawerInvoiceTypes.some((type: any) => type.id === item.invoice_type_id) && (
                          <option value={item.invoice_type_id} disabled>{item.invoice_type?.name ?? 'Documento no disponible'} (no disponible, usa el general)</option>
                        )}
                      </select>
                    ) : (
                      <span className="text-xs">{item.invoice_type?.name ?? 'Predeterminado general'}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {canToggle ? (
                      <Switch checked={item.status === 1} onChange={() => handleToggle(item)} label={status.text} sizing="sm" disabled={updatingId === item.id} />
                    ) : (
                      <span className={`text-xs font-medium ${status.color}`}>{status.text}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
