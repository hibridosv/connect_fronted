'use client';
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { NothingHere } from "@/components/NothingHere";
import { useKardexDetailLogic } from "@/hooks/products/useKardexDetailLogic";
import useConfigStore from "@/stores/configStore";
import useProductStore from "@/stores/products/productStore";
import { AjusteInventario } from "./templates/ajuste-inventario";
import { IngresoProducto } from "./templates/ingreso-producto";
import { InventarioInicial } from "./templates/inventario-inicial";
import { RegistroAverias } from "./templates/registro-averias";
import { RetornoInventario } from "./templates/retorno-inventario";
import { TransferenciaA } from "./templates/transferencia-a";
import { TransferenciaDesde } from "./templates/transferencia-desde";
import { Ventas } from "./templates/ventas";

export interface KardexDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  record: any;
}

export function KardexDetailsModal(props: KardexDetailsModalProps) {
  const { onClose, isShow, record } = props;
  const { system } = useConfigStore();
  const { kardexDetails, loading } = useProductStore();
  useKardexDetailLogic(record?.id);

  const getTemplate = (description: string) => {
    if (!kardexDetails) return;
    switch (description) {
      case 'Ventas':                        return <Ventas request={kardexDetails} />;
      case 'Ingreso de producto':           return <IngresoProducto request={kardexDetails} />;
      case 'Ajuste de inventario':          return <AjusteInventario request={kardexDetails} />;
      case 'Registro de averias':           return <RegistroAverias request={kardexDetails} />;
      case 'Registro de translados':        return <RegistroAverias request={kardexDetails} />;
      case 'Registro de devoluciones':      return <RegistroAverias request={kardexDetails} />;
      case 'Registro de cambios':           return <RegistroAverias request={kardexDetails} />;
      case 'Inventario Inicial':            return <InventarioInicial request={kardexDetails} />;
      case 'Retorno de inventario':         return <RetornoInventario request={kardexDetails} />;
      case 'Transferencia desde sucursal':  return <TransferenciaDesde request={kardexDetails} />;
      case 'Transferencia a sucursal':      return <TransferenciaA request={kardexDetails} />;
      default:                              return <></>;
    }
  };

  return (
    <Modal show={isShow} onClose={onClose} size="xl" headerTitle="Detalles de la Transacción" closeOnOverlayClick={false} hideCloseButton={false}>
      <Modal.Body>
        {loading ? (
          <div className="p-4 space-y-3 animate-pulse">
            <div className="h-6 bg-bg-subtle rounded-lg w-1/3" />
            <div className="h-4 bg-bg-subtle rounded w-full" />
            <div className="h-4 bg-bg-subtle rounded w-5/6" />
            <div className="h-4 bg-bg-subtle rounded w-4/6" />
            <div className="h-4 bg-bg-subtle rounded w-full" />
          </div>
        ) : !kardexDetails ? (
          <NothingHere text="No se encuentran registros de esta transacción" />
        ) : (
          <div>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-bg-subtle/60 border-b border-bg-subtle">
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Tipo de movimiento</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                {record?.description}
              </span>
            </div>
            <div className="p-4">
              {getTemplate(record?.description)}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );
}
