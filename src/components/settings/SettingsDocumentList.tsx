import { Switch } from '@/components/button/Switch';
import { Indicator, IndicatorType } from '@/components/Indicators';
import { getServices, updateService } from '@/services/services';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react';

interface SettingsDocumentListProps {
  changes: boolean;
}

function getDocumentStatus(status: number): { label: string; type: IndicatorType } {
  const map: Record<number, { label: string; type: IndicatorType }> = {
    0: { label: 'Inactivo',      type: 'inactive' },
    1: { label: 'Activo',        type: 'success' },
    2: { label: 'Terminado',     type: 'warning' },
    3: { label: 'Deshabilitado', type: 'danger' },
  };
  return map[status] ?? { label: 'Desconocido', type: 'inactive' };
}

export default function SettingsDocumentList({ changes }: SettingsDocumentListProps) {
  const [invoiceTypes, setInvoiceTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getServices('invoice/type');
      setInvoiceTypes(res.data.data ?? []);
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

  const handleToggle = async (item: any, field: string) => {
    setUpdatingId(item.id);
    try {
      let data: any = {};
      if (field === 'is_electronic') data.is_electronic = item.is_electronic === 1 ? 0 : 1;
      if (field === 'is_printable') data.is_printable = item.is_printable === 1 ? 0 : 1;
      if (field === 'status') data.status = item.status === 0 ? 3 : 0;
      const response = await updateService(`invoice/type/${item.id}`, data);
      useToastMessageStore.getState().setMessage(response);
      await loadData();
    } catch (error) {
      useToastMessageStore.getState().setError(error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (invoiceTypes.length === 0) return <div className="p-8 text-center text-text-muted text-sm">No hay documentos</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <span className="text-sm font-semibold text-text-base">Documentos</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
            <tr>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Tipo</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Nombre</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Electrónico</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Imprimible</th>
              <th className="px-6 py-3 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Deshabilitar</th>
              <th className="px-6 py-3 font-bold tracking-wider whitespace-nowrap">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bg-subtle/50">
            {invoiceTypes.map((item: any) => (
              <tr key={item.id} className={`transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base ${updatingId === item.id ? 'opacity-60' : ''}`}>
                <td className="px-3 py-2 whitespace-nowrap">{item.type}</td>
                <td className="px-3 py-2 whitespace-nowrap">{item.name}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {changes ? (
                    <Switch checked={item.is_electronic === 1} onChange={() => handleToggle(item, 'is_electronic')} label="" sizing="sm" disabled={updatingId === item.id} />
                  ) : (
                    <span className={`text-xs font-medium ${item.is_electronic === 1 ? 'text-success' : 'text-text-muted'}`}>{item.is_electronic === 1 ? 'Sí' : 'No'}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {changes ? (
                    <Switch checked={item.is_printable === 1} onChange={() => handleToggle(item, 'is_printable')} label="" sizing="sm" disabled={updatingId === item.id} />
                  ) : (
                    <span className={`text-xs font-medium ${item.is_printable === 1 ? 'text-success' : 'text-text-muted'}`}>{item.is_printable === 1 ? 'Sí' : 'No'}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {changes ? (
                    <Switch checked={item.status === 0} onChange={() => handleToggle(item, 'status')} label="" sizing="sm" disabled={updatingId === item.id} />
                  ) : (
                    <span className={`text-xs font-medium ${item.status === 0 ? 'text-danger' : 'text-text-muted'}`}>{item.status === 0 ? 'Deshabilitado' : 'Habilitado'}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Indicator type={getDocumentStatus(item.status).type} text={getDocumentStatus(item.status).label} coloredText />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
