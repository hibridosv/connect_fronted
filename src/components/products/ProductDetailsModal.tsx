'use client';
import { useProductDetailsLogic } from "@/hooks/products/useProductDetailsLogic";
import { Product } from "@/interfaces/products";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { FaBox, FaCheckCircle, FaTag, FaTimesCircle, FaUserTie } from "react-icons/fa";
import { MdOutlineAttachMoney, MdOutlineBrandingWatermark, MdOutlineCategory, MdOutlineHomeRepairService, MdOutlineInfo, MdOutlineInventory, MdOutlineLocationOn, MdProductionQuantityLimits } from "react-icons/md"; // Icons
import { useState } from "react";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";
import { ProductAvailabilityModal } from "./ProductAvailabilityModal";
import { ProductImagesViewer } from "./images/ProductImagesViewer";
import { ProductLinked } from "./ProductLinked";

export interface ProductDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  record: Product; 
}

export function ProductDetailsModal(props: ProductDetailsModalProps) {
  const { onClose, isShow, record } = props;
  const { system, hasLinked } = useConfigStore();
  const { responseData, loading } = useProductDetailsLogic(record, isShow);
  const realQuantity = (responseData?.data) ? record.quantity - responseData?.data : record?.quantity;
  const [showAvailability, setShowAvailability] = useState(false);

    if (!isShow || !record) { return null; }

  // Helper para renderizar una fila de detalle
  const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="flex items-center gap-2 text-text-base">
      {icon && <span className="text-text-muted">{icon}</span>}
      <span className="font-medium text-text-muted">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  // Helper para badge de estado
  const StatusBadge = ({ status }: { status: number }) => {
    const isActive = status == 1;
    const bgColor = isActive ? 'bg-success/20' : 'bg-danger/20';
    const textColor = isActive ? 'text-success' : 'text-danger';
    const text = isActive ? 'Activo' : 'Inactivo';
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
        {text}
      </span>
    );
  };

  // Helper para badge de tipo de producto
  const ProductTypeBadge = ({ type }: { type: number }) => {
    let label = '';
    let icon = null;
    let color = 'text-info'; // Default para desconocido
    switch (type) {
      case 1: label = 'Producto'; icon = <FaBox />; color = 'text-primary'; break;
      case 2: label = 'Servicio'; icon = <MdOutlineHomeRepairService />; color = 'text-info'; break;
      case 3: label = 'Relacionado'; icon = <FaTag />; color = 'text-success'; break;
      default: label = 'Desconocido'; icon = <MdOutlineInfo />; break;
    }
    return (
      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
        {icon} {label}
      </span>
    );
  };


  return (
    <Modal show={isShow} onClose={onClose} size="xl2" headerTitle={`Detalles: ${record.description}`} closeOnOverlayClick={false} hideCloseButton={false}>
      <Modal.Body>
        <div className="p-2 space-y-4 text-text-base"> {/* Main padding and spacing */}

          {/* Sección 1: Información Básica y Estado */}
          <div className="grid grid-cols-10 gap-4 pb-4 border-b border-bg-subtle">
            <div className="col-span-9">
              <div className="text-lg font-bold text-text-base mb-1">{record.description}</div>
              <p className="text-sm text-text-muted">Código: <span className="font-semibold text-primary">{record.cod}</span></p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatusBadge status={record.status} />
              <ProductTypeBadge type={record.product_type} />
            </div>
          </div>

          {/* Sección 2: Métricas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative group bg-bg-subtle/50 p-4 rounded-lg flex items-center gap-3 cursor-pointer">
              <MdOutlineAttachMoney size={24} className="text-primary" />
              <div>
                <p className="text-sm text-text-muted">Precio:</p>
                <p className="text-lg font-bold text-text-base">{record.prices[0] ? numberToMoney(record.prices[0].price, system) : numberToMoney(0, system)}</p>
              </div>
              {record.prices  && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-bg-content border border-bg-subtle rounded-lg shadow-xl ring-2 ring-primary z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="p-2">
                    <p className="text-sm font-semibold text-text-base mb-1">Listado de Precios:</p>
                    {record.prices.map((priceItem, index) => (
                      <div key={index} className="flex justify-between text-sm text-text-muted">
                        <span>Cant. {priceItem.qty}:</span>
                        <span>{numberToMoney(priceItem.price, system)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-bg-subtle/50 p-4 rounded-lg flex items-center gap-3">
              <MdOutlineInventory size={24} className="text-primary" />
              <div>
                <p className="text-sm text-text-muted">Stock:</p>
                <p className="text-lg font-bold text-text-base">
                  {record.quantity} <span className="text-text-muted text-sm">({record.quantity_unit?.abbreviation ?? 'Unidad'})</span>
                </p>
              </div>
            </div>
            <div className={`p-4 rounded-lg flex items-center gap-3 ${realQuantity <= 0  || responseData?.data? 'bg-danger/20' : 'bg-bg-subtle/50'}`}>
              <MdProductionQuantityLimits size={24} className='text-primary' />
              <div>
                <p className="text-sm text-text-muted">Cant. Actual:</p>
                <p className="text-lg font-bold text-text-base">
                  { loading ? 'Cargando...' : <span> {realQuantity} <span className="text-text-muted text-sm">({record.quantity_unit?.abbreviation ?? 'Unidad'})</span></span> }
                </p>
              </div>
            </div>
          </div>

          {/* Sección 3: Categorización y Ubicación */}
          { record.product_type == 1 && (<>
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-text-base border-b border-bg-subtle pb-1">Clasificación</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DetailRow label="Categoría" value={record.category?.name ?? '--'} icon={<MdOutlineCategory />} />
              <DetailRow label="Marca" value={record.brand?.name ?? '--'} icon={<MdOutlineBrandingWatermark />} />
              <DetailRow label="Ubicación" value={record.location?.name ?? '--'} icon={<MdOutlineLocationOn />} />
              <DetailRow label="Proveedor" value={record.provider?.name ?? '--'} icon={<FaUserTie />} />
            </div>
          </div>

          {/* Sección 4: Detalles Adicionales */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-text-base border-b border-bg-subtle pb-1">Detalles Adicionales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DetailRow label="Costo Unitario" value={numberToMoney(record.unit_cost, system)} icon={<MdOutlineAttachMoney />} />
              <DetailRow label="Impuestos" value={`${record.taxes}%`} icon={<FaTag />} />
              {record.information && <DetailRow label="Información" value={record.information} icon={<MdOutlineInfo />} />} 
              {record.tags && <DetailRow label="Stock Minimo" value={record.minimum_stock} icon={<MdProductionQuantityLimits />} />} 
              {record.default_discount !== null && <DetailRow label="Desc. por Defecto" value={`${record.default_discount}%`} icon={<MdOutlineAttachMoney />} />} 
              {record.default_commission !== null && <DetailRow label="Comisión por Defecto" value={`${record.default_commission}%`} icon={<MdOutlineAttachMoney />} />} 
            </div>
          </div>

          {/* Sección 5: Banderas (Flags) */}
          <div className="space-y-2">
            <h4 className="text-md font-semibold text-text-base border-b border-bg-subtle pb-1">Características</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DetailRow label="Expira" value={record.expires ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-danger" />} />
              <DetailRow label="Requiere Receta" value={record.prescription ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-danger" />} />
            </div>
          </div>
          </>)}

          <ProductLinked record={record} isShow={isShow} />

          <ProductImagesViewer productId={String(record.id)} />

        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-between items-center">
          <button
            type="button"
            onClick={() => setShowAvailability(true)}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-bg-subtle text-text-muted hover:text-primary hover:border-primary transition-colors"
          >
            Ver Disponibilidad
          </button>
          <Button onClick={onClose} preset={Preset.close} disabled={false} />
        </div>
      </Modal.Footer>
      <ProductAvailabilityModal
        isShow={showAvailability}
        onClose={() => setShowAvailability(false)}
        cod={record.cod}
        description={record.description}
      />
    </Modal>
  );
}