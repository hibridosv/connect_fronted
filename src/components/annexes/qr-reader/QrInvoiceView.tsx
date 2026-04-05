'use client';
import { NothingHere } from '@/components/NothingHere';
import qrReaderStore from '@/stores/annexes/qrReaderStore';
import { useEffect, useRef, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { LuFileJson, LuShieldCheck, LuX } from 'react-icons/lu';

const DTE_TYPES: Record<string, string> = {
  '01': 'Factura',
  '03': 'Comprobante de Crédito Fiscal',
  '05': 'Nota de Crédito',
  '06': 'Nota de Débito',
  '11': 'Factura de Exportación',
  '14': 'Factura de Sujeto Excluido',
};

const PAYMENT_CODES: Record<string, string> = {
  '01': 'Billetes y monedas',
  '02': 'Tarjeta Débito',
  '03': 'Tarjeta Crédito',
  '04': 'Cheque',
  '05': 'Transferencia / Depósito Bancario',
  '99': 'Otros',
};

const PLAZO_LABELS: Record<string, string> = {
  '01': 'días',
  '02': 'meses',
  '03': 'años',
};

const CONDICION_LABELS: Record<number, string> = {
  1: 'Contado',
  2: 'Crédito',
  3: 'Otro',
};

const AMBIENTE_LABELS: Record<string, string> = {
  '00': 'Pruebas',
  '01': 'Producción',
};

const fmt = (n: number) => `$${Number(n ?? 0).toFixed(2)}`;

const SECTION_DELAYS = [0, 60, 120, 180, 240, 300, 360];

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
    <div className={`flex justify-between items-center ${large ? 'text-sm' : 'text-xs'}`}>
      <span className={bold ? 'font-bold text-text-base' : 'text-text-muted'}>{label}</span>
      <span className={`font-mono ${bold ? 'font-bold' : ''} ${highlight ? 'text-primary text-base' : 'text-text-base'}`}>
        {fmt(value)}
      </span>
    </div>
  );
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div
      style={{
        animation: `qr-reveal-section 0.45s ease-out both`,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function QrInvoiceView() {
  const { currentInvoice, currentFileName, clearInvoice } = qrReaderStore();
  const [invoiceKey, setInvoiceKey] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const prevInvoiceRef = useRef<any>(null);

  useEffect(() => {
    if (currentInvoice && currentInvoice !== prevInvoiceRef.current) {
      prevInvoiceRef.current = currentInvoice;
      setInvoiceKey((k) => k + 1);
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 900);
      return () => clearTimeout(timer);
    }
  }, [currentInvoice]);

  if (!currentInvoice) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10">
        <NothingHere text="Importe un archivo JSON para visualizar la factura" width="200" height="120" />
      </div>
    );
  }

  const { emisor, receptor, sujetoExcluido, identificacion, cuerpoDocumento, resumen, selloRecibido } = currentInvoice;

  const isSujetoExcluido = identificacion?.tipoDte === '14';
  const counterpart = receptor ?? sujetoExcluido;
  const dteLabel = DTE_TYPES[identificacion?.tipoDte] ?? `Tipo ${identificacion?.tipoDte}`;
  const condicionLabel = CONDICION_LABELS[resumen?.condicionOperacion] ?? '—';
  const ambienteLabel = AMBIENTE_LABELS[identificacion?.ambiente] ?? identificacion?.ambiente;
  const isProduccion = identificacion?.ambiente === '01';
  const hasSello = !!selloRecibido?.trim?.();

  return (
    <div key={invoiceKey} className="relative p-4 space-y-4">

      {showFlash && (
        <div
          className="absolute inset-0 pointer-events-none rounded-lg z-20"
          style={{
            background: 'linear-gradient(180deg, rgb(var(--color-primary) / 0.12) 0%, transparent 60%)',
            animation: 'qr-flash-scan 0.9s ease-out forwards',
          }}
        />
      )}

      {showFlash && (
        <div
          className="absolute inset-x-0 top-0 h-0.5 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(to right, transparent, rgb(var(--color-primary) / 0.8), transparent)',
            boxShadow: '0 0 8px 2px rgb(var(--color-primary) / 0.3)',
            animation: 'qr-scan-down 0.9s ease-in-out forwards',
          }}
        />
      )}

      <AnimatedSection delay={SECTION_DELAYS[0]}>
        {currentFileName && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-text-muted min-w-0">
              <LuFileJson size={13} className="text-primary/60 shrink-0" />
              <span className="font-mono truncate">{currentFileName}</span>
            </div>
            <button
              onClick={clearInvoice}
              className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-text-muted hover:text-danger transition-colors clickeable"
              title="Limpiar factura actual"
            >
              <LuX size={12} />
              Limpiar
            </button>
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[1]}>
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase text-text-muted tracking-widest">Tipo de documento</span>
            <p className="text-base font-extrabold text-primary mt-1">{dteLabel}</p>
            {!isProduccion && (
              <span className="inline-flex items-center mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-danger/10 text-danger">
                {ambienteLabel}
              </span>
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
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[2]}>
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
                value={`${emisor?.codEstable ?? ''} / Punto venta: ${emisor?.codPuntoVenta ?? ''}`}
              />
            </div>
          </div>

          <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
            <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-2 pb-1 border-b border-bg-subtle">
              {isSujetoExcluido ? 'Sujeto Excluido' : 'Receptor'}
            </p>
            <p className="font-bold text-text-base leading-snug">{counterpart?.nombre}</p>
            {receptor?.nombreComercial && receptor.nombreComercial !== receptor.nombre && (
              <p className="text-text-muted text-xs mt-0.5">{receptor.nombreComercial}</p>
            )}
            <div className="mt-2 space-y-0.5">
              {isSujetoExcluido ? (
                <InfoRow label="Documento" value={sujetoExcluido?.numDocumento} />
              ) : (
                <>
                  <InfoRow label="NIT" value={receptor?.nit} />
                  <InfoRow label="NRC" value={receptor?.nrc} />
                </>
              )}
              <InfoRow label="Actividad" value={counterpart?.descActividad} />
              <InfoRow label="Dirección" value={counterpart?.direccion?.complemento} />
              <InfoRow label="Teléfono" value={counterpart?.telefono} />
              <InfoRow label="Correo" value={counterpart?.correo} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[3]}>
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
                <th className="px-3 py-2 font-bold tracking-wider whitespace-nowrap text-right">
                  {isSujetoExcluido ? 'Compra' : 'Venta Gravada'}
                </th>
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
                  <td className="px-3 py-2 whitespace-nowrap text-right font-mono font-bold">
                    {fmt(item.ventaGravada ?? item.compra ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[4]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-3">
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

          <div className="bg-bg-content border border-bg-subtle rounded-lg p-4">
            <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-3 pb-1 border-b border-bg-subtle">
              Resumen
            </p>
            <div className="space-y-1.5">
              {isSujetoExcluido ? (
                <>
                  {resumen?.totalCompra > 0 && <SummaryRow label="Total Compra" value={resumen.totalCompra} />}
                  {resumen?.descu > 0 && <SummaryRow label="Descuento" value={resumen.descu} />}
                  {resumen?.totalDescu > 0 && <SummaryRow label="Descuento Total" value={resumen.totalDescu} />}
                  <SummaryRow label="Subtotal" value={resumen?.subTotal ?? 0} />
                  {resumen?.ivaRete1 > 0 && <SummaryRow label="IVA Retenido (1%)" value={resumen.ivaRete1} />}
                  {resumen?.reteRenta > 0 && <SummaryRow label="Retención Renta" value={resumen.reteRenta} />}
                </>
              ) : (
                <>
                  {resumen?.totalNoSuj > 0 && <SummaryRow label="Total No Sujeto" value={resumen.totalNoSuj} />}
                  {resumen?.totalExenta > 0 && <SummaryRow label="Total Exento" value={resumen.totalExenta} />}
                  <SummaryRow label="Total Gravado" value={resumen?.totalGravada ?? 0} />
                  <SummaryRow label="Subtotal Ventas" value={resumen?.subTotalVentas ?? 0} />
                  {resumen?.totalDescu > 0 && <SummaryRow label="Descuento Total" value={resumen.totalDescu} />}
                  <SummaryRow label="Subtotal" value={resumen?.subTotal ?? 0} />
                  {resumen?.ivaRete1 > 0 && <SummaryRow label="IVA Retenido (1%)" value={resumen.ivaRete1} />}
                  {resumen?.ivaPerci1 > 0 && <SummaryRow label="IVA Percibido (1%)" value={resumen.ivaPerci1} />}
                  {resumen?.reteRenta > 0 && <SummaryRow label="Retención Renta" value={resumen.reteRenta} />}
                  {resumen?.totalNoGravado > 0 && <SummaryRow label="No Gravado" value={resumen.totalNoGravado} />}
                  <div className="border-t border-bg-subtle pt-2 mt-2">
                    <SummaryRow label="Monto Total Operación" value={resumen?.montoTotalOperacion ?? 0} bold />
                  </div>
                </>
              )}
              <div className="border-t-2 border-primary/30 pt-2 mt-1">
                <SummaryRow label="Total a Pagar" value={resumen?.totalPagar ?? 0} bold large highlight />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[5]}>
        <div className="bg-bg-subtle/60 border border-bg-subtle rounded-lg px-4 py-3 flex items-start gap-2">
          <span className="text-xs font-bold uppercase text-text-muted whitespace-nowrap mt-0.5">Son:</span>
          <span className="text-sm font-semibold text-text-base italic leading-snug">{resumen?.totalLetras}</span>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={SECTION_DELAYS[6]}>
        {hasSello ? (
          <div className="bg-bg-content border border-bg-subtle rounded-lg p-3">
            <p className="text-xs font-bold uppercase text-text-muted tracking-widest mb-1 flex items-center gap-1.5">
              <LuShieldCheck size={13} className="text-success" />
              Sello recibido (MH)
            </p>
            <p className="font-mono text-xs text-text-muted break-all leading-relaxed">{selloRecibido}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-warning/40 bg-warning/8 px-4 py-3 flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              <FiAlertTriangle size={16} className="text-warning" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            </div>
            <div>
              <p className="text-xs font-bold text-warning uppercase tracking-wider">Sin sello del Ministerio de Hacienda</p>
              <p className="text-xs text-text-muted mt-0.5 leading-snug">
                Este documento no tiene sello de recibido (MH). Puede ser un DTE pendiente de transmisión o no procesado por el MH.
              </p>
            </div>
          </div>
        )}
      </AnimatedSection>

    </div>
  );
}
