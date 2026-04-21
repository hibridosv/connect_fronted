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
          <InvoiceSystemTable records={invoices?.data} isLoading={loading} />
        </div>
      </div>

      <div className="col-span-2">
        <ViewTitle text="SALDO PENDIENTE" />
        <div className="mr-3 sm:mt-3 px-2 space-y-4">
          <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle border-l-4 border-l-success p-4">
            <div className="text-center text-text-muted text-sm">Saldo pendiente</div>
            <div className="text-center font-semibold text-5xl md:text-6xl p-3 text-text-base">
              $ {total.toFixed(2)}
            </div>
          </div>

          {sendingLink ? (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4">
              <div className="text-center text-text-muted text-sm">Generando Enlace de pago</div>
              <div className="flex justify-center p-3">
                <LuLoaderCircle className="animate-spin text-primary" size={32} />
              </div>
            </div>
          ) : payLink?.urlQrCodeEnlace && total > 0 && (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 uppercase text-text-base">
                Pagar con tarjeta de credito
              </div>
              <div className="m-3 p-2 bg-info/10 border border-info/20 rounded-lg text-info text-xs">
                Transacción segura a traves de Wompi del Banco Agricola, No guardamos ningun tipo de dato de su tarjeta
              </div>
              <div className="flex justify-center p-3">
                <a
                  target="_blank"
                  href={payLink?.urlEnlace ?? '#'}
                  className="button-green rounded-md px-6 py-2 font-semibold"
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
                    width={250}
                    height={250}
                  />
                )}
              </div>
            </div>
          )}

          {total > 0 ? (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 uppercase text-text-base">
                Pagar con Transferencia Electrónica
              </div>
              <div className="font-semibold p-4 space-y-1 text-text-base">
                <Image
                  loader={imageLoader}
                  src="https://digital.promerica.com.sv/promerica//assets/img/logo-promerica.png"
                  alt="Logo Promerica"
                  width={375}
                  height={57}
                />
                <div>
                  <span>Numero de Cuenta: </span>
                  <span className="ml-2">20000066001071</span>
                </div>
                <div>
                  <span>Nombre: </span>
                  <span className="ml-2">Erick Adonai Nuñez Martinez</span>
                </div>
                <div>
                  <span>Concepto: </span>
                  <span className="ml-2 uppercase">
                    Factura {tenant?.id}-{lastInvoice?.id?.slice(-4)}
                  </span>
                </div>
                <div className="text-xs text-danger">
                  Es importante incluya el concepto en la Transferencia para identificar su factura
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle overflow-hidden">
              <div className="text-center bg-bg-subtle/60 font-semibold py-2 uppercase text-text-base">
                Gracias por mantenerse al dia con sus facturas
              </div>
              <div className="font-semibold p-4 text-center text-text-base">
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
