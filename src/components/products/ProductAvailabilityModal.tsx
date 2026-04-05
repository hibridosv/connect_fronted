'use client';
import { Button, Preset } from '@/components/button/button';
import Modal from '@/components/modal/Modal';
import { useGetRequest } from '@/hooks/request/useGetRequest';
import { useEffect } from 'react';
import { LuLoader } from 'react-icons/lu';
import { MdStorefront } from 'react-icons/md';

interface ProductAvailabilityModalProps {
  isShow: boolean;
  onClose: () => void;
  cod: string;
  description: string;
}

export function ProductAvailabilityModal({ isShow, onClose, cod, description }: ProductAvailabilityModalProps) {
  const { responseData, loading, getRequest } = useGetRequest();

  useEffect(() => {
    if (!isShow) return;
    getRequest(`transactions/products/stock/${cod}`, false);
  }, [isShow]);

  const stock: any[] = Array.isArray(responseData)
    ? responseData
    : Array.isArray(responseData?.data)
      ? responseData.data
      : [];

  return (
    <Modal show={isShow} onClose={onClose} size="md" headerTitle="Disponibilidad en sucursales" closeOnOverlayClick>
      <Modal.Body>
        <div className="px-1 py-2 space-y-4">

          <div className="flex items-start gap-3 p-3 bg-bg-subtle/40 rounded-lg border border-bg-subtle">
            <MdStorefront size={20} className="text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wide">Producto</p>
              <p className="text-sm font-semibold text-text-base">{description}</p>
              <p className="text-xs text-primary font-medium mt-0.5">{cod}</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-text-muted">
              <LuLoader size={28} className="animate-spin text-primary" />
              <p className="text-sm">Consultando disponibilidad...</p>
            </div>
          ) : stock.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-text-muted">
              <MdStorefront size={32} className="opacity-30" />
              <p className="text-sm">Sin información de disponibilidad.</p>
            </div>
          ) : (
            <div className="relative overflow-hidden bg-bg-content rounded-lg border border-bg-subtle">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                  <tr>
                    <th className="px-4 py-2.5 font-bold tracking-wider border-r border-bg-subtle">Sucursal</th>
                    <th className="px-4 py-2.5 font-bold tracking-wider text-right">Existencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle/50">
                  {stock.map((item: any) => (
                    <tr key={item.system} className="odd:bg-bg-subtle/40 hover:bg-bg-subtle transition-colors duration-150 text-text-base">
                      <td className="px-4 py-2.5 font-medium border-r border-bg-subtle">{item.system}</td>
                      <td className={`px-4 py-2.5 text-right font-bold ${item.stock <= 0 ? 'text-danger' : 'text-success'}`}>
                        {item.stock}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-bg-subtle bg-bg-subtle/60">
                  <tr>
                    <td className="px-4 py-2 text-xs font-bold text-text-muted uppercase border-r border-bg-subtle">Total</td>
                    <td className="px-4 py-2 text-right font-bold text-text-base">
                      {stock.reduce((sum: number, item: any) => sum + (item.stock ?? 0), 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}
