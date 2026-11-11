'use client';
import { Badge } from "@/components/Badge";

import useTempStorage from "@/stores/useTempStorage";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";

export interface PurchasesDetailsModal {
  onClose: () => void;
  isShow: boolean;
}

const DTE_TYPES: Record<string, string> = {
  "01": "Factura",
  "03": "Comprobante de Crédito Fiscal",
  "05": "Nota de Crédito",
  "06": "Nota de Débito",
  "11": "Factura de Exportación",
  "14": "Factura de Sujeto Excluido",
};

const PAYMENT_CODES: Record<string, string> = {
  "01": "Billetes y monedas",
  "02": "Tarjeta Débito",
  "03": "Tarjeta Crédito",
  "04": "Cheque",
  "05": "Transferencia / Depósito Bancario",
  "99": "Otros",
};

const PLAZO_LABELS: Record<string, string> = {
  "01": "días",
  "02": "meses",
  "03": "años",
};

const CONDICION_LABELS: Record<number, string> = {
  1: "Contado",
  2: "Crédito",
  3: "Otro",
};

const AMBIENTE_LABELS: Record<string, string> = {
  "00": "Pruebas",
  "01": "Producción",
};

const fmt = (n: number) =>
  `$${Number(n ?? 0).toFixed(2)}`;

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-1 text-xs">
      <span className="text-text-muted shrink-0">{label}:</span>
      <span className="text-text-base font-medium break-all">{value}</span>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: number;
  bold?: boolean;
  large?: boolean;
  highlight?: boolean;
}

function SummaryRow({ label, value, bold, large, highlight }: SummaryRowProps) {
  return (
    <div className={`flex justify-between items-center ${large ? "text-sm" : "text-xs"}`}>
      <span className={bold ? "font-bold text-text-base" : "text-text-muted"}>{label}</span>
      <span
        className={`font-mono ${bold ? "font-bold" : ""} ${highlight ? "text-primary text-base" : "text-text-base"}`}
      >
        {fmt(value)}
      </span>
    </div>
  );
}

export function PurchasesDetailsModal(props: PurchasesDetailsModal) {
  const { onClose, isShow } = props;
  const { getElement } = useTempStorage();
  const record = getElement("purchaseSelected");

  if (!isShow || !record) return null;

  const { emisor, receptor, identificacion, cuerpoDocumento, resumen, selloRecibido } = record;

  const dteLabel = DTE_TYPES[identificacion?.tipoDte] ?? `Tipo ${identificacion?.tipoDte}`;
  const condicionLabel = CONDICION_LABELS[resumen?.condicionOperacion] ?? "—";
  const ambienteLabel = AMBIENTE_LABELS[identificacion?.ambiente] ?? identificacion?.ambiente;
  const isProduccion = identificacion?.ambiente === "01";

  return (
    <Modal
      show={isShow}
      onClose={onClose}
      size="xl4"
      headerTitle="Detalles de factura de compra"
      closeOnOverlayClick={false}
      hideCloseButton={false}
    >
      <Modal.Body>
        <div className="space-y-4 text-text-base text-sm">

          {/* Cabecera del documento */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-text-muted tracking-widest">Tipo de documento</span>
              <p className="text-base font-extrabold text-primary mt-1">{dteLabel}</p>
              {!isProduccion && (
                <Badge variant="danger" className="mt-1">
                  {ambienteLabel}
                </Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 sm:items-end text-xs">
              <div>
                <span className="text-text-muted">No. Control: </span>
                <span className="font-mono font-bold text-text-base">{identificacion?.numeroControl}</span>
              </div>
              <div>
                <span className="text-text-muted">Código generación: </span>
                <span className="font-mono text-text-muted">{identificacion?.codigoGeneracion}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-text-muted">Emisión:</span>
                <span className="font-semibold text-text-base">
                  {identificacion?.fecEmi} — {identificacion?.horEmi}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-text-muted">Condición:</span>
                <span className="font-semibold text-text-base">{condicionLabel}</span>
              </div>
            </div>
          </div>

          {/* Emisor / Receptor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
              <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-2 pb-1 border-b border-bg-subtle">
                Emisor
              </p>
              <p className="font-bold text-text-base leading-snug">{emisor?.nombre}</p>
              {emisor?.nombreComercial && emisor.nombreComercial !== emisor.nombre && (
                <p className="text-text-muted text-xs mt-0.5">{emisor.nombreComercial}</p>
              )}
              <div className="mt-2 space-y-0.5">
                <InfoRow label="NIT" value={emisor?.nit} />
                <InfoRow label="NRC" value={emisor?.nrc} />
                <InfoRow label="Actividad" value={emisor?.descActividad} />
                <InfoRow label="Dirección" value={emisor?.direccion?.complemento} />
                <InfoRow label="Teléfono" value={emisor?.telefono} />
                <InfoRow label="Correo" value={emisor?.correo} />
                <InfoRow
                  label="Establecimiento"
                  value={`${emisor?.codEstable ?? ""} / Punto venta: ${emisor?.codPuntoVenta ?? ""}`}
                />
              </div>
            </div>

            <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
              <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-2 pb-1 border-b border-bg-subtle">
                Receptor
              </p>
              <p className="font-bold text-text-base leading-snug">{receptor?.nombre}</p>
              {receptor?.nombreComercial && receptor.nombreComercial !== receptor.nombre && (
                <p className="text-text-muted text-xs mt-0.5">{receptor.nombreComercial}</p>
              )}
              <div className="mt-2 space-y-0.5">
                <InfoRow label="NIT" value={receptor?.nit} />
                <InfoRow label="NRC" value={receptor?.nrc} />
                <InfoRow label="Actividad" value={receptor?.descActividad} />
                <InfoRow label="Dirección" value={receptor?.direccion?.complemento} />
                <InfoRow label="Teléfono" value={receptor?.telefono} />
                <InfoRow label="Correo" value={receptor?.correo} />
              </div>
            </div>
          </div>

          {/* Tabla de ítems */}
          <div className="relative overflow-x-auto bg-bg-content rounded-lg shadow-sm border border-bg-subtle">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60 border-b-2 border-bg-subtle">
                <tr>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">#</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap">Código</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle">Descripción</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Cant.</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Precio Unit.</th>
                  <th className="px-3 py-2 font-bold tracking-wider border-r border-bg-subtle whitespace-nowrap text-right">Descuento</th>
                  <th className="px-3 py-2 font-bold tracking-wider whitespace-nowrap text-right">Venta Gravada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle/50">
                {cuerpoDocumento?.map((item: any) => (
                  <tr
                    key={item.numItem}
                    className="transition-colors duration-150 odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle text-text-base"
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-center text-text-muted">{item.numItem}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">{item.codigo}</td>
                    <td className="px-3 py-2 text-xs">{item.descripcion}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right">{item.cantidad}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right font-mono">{fmt(item.precioUni)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right font-mono">{fmt(item.montoDescu)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-right font-mono font-bold">{fmt(item.ventaGravada)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagos / Tributos + Resumen */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            <div className="space-y-3">
              {/* Forma de pago */}
              <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
                <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-2 pb-1 border-b border-bg-subtle">
                  Forma de pago
                </p>
                {resumen?.pagos?.map((pago: any, i: number) => (
                  <div key={i} className="space-y-1 mt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted text-xs">{PAYMENT_CODES[pago.codigo] ?? pago.codigo}</span>
                      <span className="font-semibold font-mono text-text-base">{fmt(pago.montoPago)}</span>
                    </div>
                    {pago.plazo && (
                      <p className="text-xs text-text-muted">
                        Plazo: {pago.periodo} {PLAZO_LABELS[pago.plazo] ?? pago.plazo}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Tributos */}
              {resumen?.tributos?.length > 0 && (
                <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
                  <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-2 pb-1 border-b border-bg-subtle">
                    Tributos
                  </p>
                  {resumen.tributos.map((t: any, i: number) => (
                    <div key={i} className="flex justify-between items-center mt-1">
                      <span className="text-text-muted text-xs">
                        {t.descripcion} <span className="font-mono">({t.codigo})</span>
                      </span>
                      <span className="font-semibold font-mono text-text-base">{fmt(t.valor)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resumen de totales */}
            <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
              <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-3 pb-1 border-b border-bg-subtle">
                Resumen
              </p>
              <div className="space-y-1.5">
                {resumen?.totalNoSuj > 0 && <SummaryRow label="Total No Sujeto" value={resumen.totalNoSuj} />}
                {resumen?.totalExenta > 0 && <SummaryRow label="Total Exento" value={resumen.totalExenta} />}
                <SummaryRow label="Total Gravado" value={resumen?.totalGravada ?? 0} />
                <SummaryRow label="Subtotal Ventas" value={resumen?.subTotalVentas ?? 0} />
                {resumen?.totalDescu > 0 && (
                  <SummaryRow label="Descuento Total" value={resumen.totalDescu} />
                )}
                <SummaryRow label="Subtotal" value={resumen?.subTotal ?? 0} />
                {resumen?.ivaRete1 > 0 && <SummaryRow label="IVA Retenido (1%)" value={resumen.ivaRete1} />}
                {resumen?.ivaPerci1 > 0 && <SummaryRow label="IVA Percibido (1%)" value={resumen.ivaPerci1} />}
                {resumen?.reteRenta > 0 && <SummaryRow label="Retención Renta" value={resumen.reteRenta} />}
                {resumen?.totalNoGravado > 0 && <SummaryRow label="No Gravado" value={resumen.totalNoGravado} />}

                <div className="border-t border-bg-subtle pt-2 mt-2">
                  <SummaryRow label="Monto Total Operación" value={resumen?.montoTotalOperacion ?? 0} bold />
                </div>
                <div className="border-t-2 border-primary/30 pt-2 mt-1">
                  <SummaryRow label="Total a Pagar" value={resumen?.totalPagar ?? 0} bold large highlight />
                </div>
              </div>
            </div>
          </div>

          {/* Total en letras */}
          <div className="bg-bg-subtle/60 border border-bg-subtle rounded-lg px-4 py-3 flex items-start gap-2">
            <span className="text-xs font-bold uppercase text-text-muted whitespace-nowrap mt-0.5">Son:</span>
            <span className="text-sm font-semibold text-text-base italic leading-snug">
              {resumen?.totalLetras}
            </span>
          </div>

          {/* Sello recibido */}
          {selloRecibido && (
            <div className="bg-bg-content border border-bg-subtle rounded-lg p-3">
              <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-1">Sello recibido (MH)</p>
              <p className="font-mono text-xs text-text-muted break-all leading-relaxed">{selloRecibido}</p>
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
