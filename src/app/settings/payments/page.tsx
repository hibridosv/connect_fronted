'use client';

import { ViewTitle } from '@/components/ViewTitle';
import { InvoicePayDetailsModal } from '@/components/settings/InvoicePayDetailsModal';
import { InvoiceSystemTable } from '@/components/settings/InvoiceSystemTable';
import { ToasterMessage } from '@/components/toaster-message';
import { useInvoicesLogic } from '@/hooks/settings/useInvoicesLogic';
import useModalStore from '@/stores/modalStorage';
import useTempStorage from '@/stores/useTempStorage';
import Image from 'next/image';
import { LuLoaderCircle } from 'react-icons/lu';

export default function Page() {
  const { modals, closeModal } = useModalStore();
  const { getElement } = useTempStorage();
  const {
    invoices, payLink, loading, sendingLink,
    total, lastInvoice, tenant,
  } = useInvoicesLogic();

  const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 pb-10">
      <div className="col-span-3">
        <ViewTitle text="ULTIMAS FACTURAS" />
        <div className="mr-3 sm:mt-3 px-2">
          <InvoiceSystemTable records={invoices} isLoading={loading} />
        </div>
      </div>

      <div className="col-span-2">
        <ViewTitle text="SALDO PENDIENTE" />
        <div className="mr-3 sm:mt-3 px-2 space-y-3">
          <div className="animate-slide-up bg-bg-content rounded-lg shadow-sm border border-bg-subtle border-l-4 border-l-success px-4 py-3 flex items-center justify-between transition-shadow duration-200 hover:shadow-md">
            <span className="text-text-muted text-sm font-medium">Saldo pendiente</span>
            <span className="font-bold text-3xl text-text-base">$ {total.toFixed(2)}</span>
          </div>

          {sendingLink ? (
            <div className="animate-slide-up-delay bg-bg-content rounded-lg shadow-sm border border-bg-subtle px-4 py-3">
              <div className="text-center text-text-muted text-sm">Generando enlace de pago</div>
              <div className="flex justify-center py-3">
                <LuLoaderCircle className="animate-spin text-primary" size={28} />
              </div>
            </div>
          ) : payLink?.urlQrCodeEnlace && total > 0 && (
            <div className="animate-slide-up-delay bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden transition-shadow duration-200 hover:shadow-md">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 text-xs uppercase tracking-wider text-text-base">
                Pagar con tarjeta de crédito
              </div>
              <div className="mx-3 mt-2 mb-2 px-3 py-2 bg-info/10 border border-info/20 rounded text-info text-xs">
                Transacción segura a través de Wompi del Banco Agrícola. No guardamos ningún dato de su tarjeta.
              </div>
              <div className="flex justify-center pb-3">
                <a
                  target="_blank"
                  href={payLink?.urlEnlace ?? '#'}
                  className="button-green rounded-md px-5 py-1.5 text-sm font-semibold transition-transform duration-150 hover:scale-105 active:scale-95"
                  rel="noreferrer"
                >
                  Pagar factura
                </a>
              </div>
              <div className="border-t border-bg-subtle" />
              <div className="flex justify-center p-3">
                {payLink?.urlQrCodeEnlace && (
                  <Image
                    loader={imageLoader}
                    src={payLink.urlQrCodeEnlace}
                    alt="QR de pago"
                    width={200}
                    height={200}
                  />
                )}
              </div>
            </div>
          )}

          {total > 0 ? (
            <div className="animate-slide-up-delay-2 bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden transition-shadow duration-200 hover:shadow-md">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 text-xs uppercase tracking-wider text-text-base">
                Pagar con Transferencia Electrónica
              </div>
              <div className="p-3">
                <Image
                  loader={imageLoader}
                  src="https://digital.promerica.com.sv/promerica//assets/img/logo-promerica.png"
                  alt="Logo Promerica"
                  width={180}
                  height={27}
                  className="mb-2"
                />
                <div className="divide-y divide-bg-subtle text-sm">
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-text-muted">Número de cuenta</span>
                    <span className="font-semibold text-text-base">20000066001071</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-text-muted">Nombre</span>
                    <span className="font-semibold text-text-base">Erick Adonai Nuñez Martinez</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-text-muted">Concepto</span>
                    <span className="font-semibold text-text-base uppercase">
                      Factura {tenant?.id}-{lastInvoice?.id?.slice(-4)}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-danger">
                  Incluya el concepto en la transferencia para identificar su factura.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-slide-up-delay-2 bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden transition-shadow duration-200 hover:shadow-md">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 text-xs uppercase tracking-wider text-text-base">
                Al día con sus facturas
              </div>
              <div className="py-3 px-4 text-center text-sm text-text-muted">
                Si tiene alguna duda no dude en contactarnos
              </div>
            </div>
          )}
        </div>
      </div>

      <InvoicePayDetailsModal
        isShow={!!modals.invoicePayDetails}
        onClose={() => closeModal('invoicePayDetails')}
        record={getElement('invoicePayDetails')}
      />

      <ToasterMessage />
    </div>
  );
}
