import { numberToMoney } from "@/lib/utils";
import { returnedQuantities } from "@/lib/returns";
import { createService } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import useInvoiceDetailsStore from "@/stores/invoicing/invoiceDetailsStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "../Alert/Alert";
import { Button, Preset } from "../button/button";
import Modal from "../modal/Modal";

export interface CreateReturnModalI {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}

/**
 * Evento de Retorno (DTE 18): devolución de productos de una Factura, Factura de Exportación o Factura de Sujeto
 * Excluido electrónica, sin invalidarla. Los productos retornados vuelven al inventario; no toca la caja.
 */
export function CreateReturnModal(props: CreateReturnModalI) {
  const { onClose, isShow, record } = props;
  const { system } = useConfigStore();
  const { setError, setMessage } = useToastMessageStore();
  const { loadingOrder, fetchOrder } = useInvoiceDetailsStore();
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  // motivo del ultimo intento fallido: queda visible en el modal (el toast desaparece a los pocos segundos)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // los productos agrupados (group_by) no van como items en el DTE, no se pueden retornar
  const products = useMemo(() => {
    const returned = returnedQuantities(record);
    return (record?.products ?? [])
      .filter((product: any) => !product.group_by)
      .map((product: any) => ({
        ...product,
        available: Math.max(Number(product.quantity) - (returned[product.id] ?? 0), 0),
      }));
  }, [record]);

  useEffect(() => {
    if (isShow) {
      setQuantities({});
      setErrorMessage(null);
    }
  }, [isShow, record?.id]);

  const quantityOf = (product: any) => Number(quantities[product.id]) || 0;
  // el total de la linea incluye impuestos y descuento: se toma la parte proporcional a la cantidad retornada
  const lineTotal = (product: any) => {
    const quantity = Number(product.quantity) || 0;
    return quantity ? (Number(product.total) * quantityOf(product)) / quantity : 0;
  };
  const total = products.reduce((sum: number, product: any) => sum + lineTotal(product), 0);
  const invalid = products.some((product: any) => quantityOf(product) < 0 || quantityOf(product) > product.available);
  const selected = products.filter((product: any) => quantityOf(product) > 0);

  const handleReturn = async () => {
    if (selected.length === 0) {
      setError({ message: "Indique la cantidad a retornar de al menos un producto" });
      return;
    }
    if (invalid) {
      setError({ message: "La cantidad a retornar no puede ser mayor a la disponible" });
      return;
    }
    try {
      setIsSending(true);
      setErrorMessage(null);
      const response = await createService(`documents/return`, {
        invoice: record.id,
        products: selected.map((product: any) => ({ id: product.id, quantity: quantityOf(product) })),
      });
      if (response.status === 200) {
        setMessage({ message: "Retorno enviado correctamente" });
        await fetchOrder(record.id);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setErrorMessage((error as any)?.response?.data?.message || (error as any)?.message || "No se pudo crear el retorno");
    } finally {
      setIsSending(false);
    }
  };

  if (!isShow || !record) return null;

  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle="Crear retorno">
      <Modal.Body>
        <div className="p-4">
          <Alert
            type="info"
            text="Indique la cantidad que el cliente devuelve de cada producto. Se enviará un Evento de Retorno al Ministerio de Hacienda, los productos volverán al inventario y el documento seguirá vigente por el resto."
            isDismissible={false}
            className="mb-6"
          />
          <div className="w-full overflow-x-auto rounded-lg border border-bg-subtle">
            <table className="w-full text-sm text-left text-text-base">
              <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
                <tr>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-center">Retornar</th>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-center">Disponible</th>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle">Código</th>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle w-full">Producto</th>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-right">Precio</th>
                  <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-subtle">
                {products.map((product: any) => {
                  const excede = quantityOf(product) > product.available;
                  return (
                    <tr key={product.id} className="hover:bg-bg-subtle/40">
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          min={0}
                          max={product.available}
                          step="any"
                          value={quantities[product.id] ?? ""}
                          placeholder="0"
                          disabled={product.available <= 0}
                          onChange={(e) => setQuantities({ ...quantities, [product.id]: e.target.value })}
                          className={`w-20 bg-bg-content border rounded-md shadow-sm text-center focus:ring-primary focus:border-primary sm:text-sm disabled:opacity-50 ${excede ? "border-danger" : "border-bg-subtle"}`}
                        />
                      </td>
                      <td className="px-4 py-2 text-center">{product.available}</td>
                      <td className="px-4 py-2 truncate">{product.cod}</td>
                      <td className="px-4 py-2">{product.product}</td>
                      <td className="px-4 py-2 text-right">{numberToMoney(product.unit_price || 0, system)}</td>
                      <td className="px-4 py-2 text-right font-medium">{numberToMoney(lineTotal(product), system)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-bg-subtle/60">
                <tr>
                  <td colSpan={5} className="text-right font-bold py-3 px-4 border-t-2 border-bg-subtle">TOTAL A RETORNAR:</td>
                  <td className="py-3 px-4 border-t-2 border-bg-subtle font-bold text-right">{numberToMoney(total, system)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          {errorMessage && (
            <Alert type="danger" title="No se pudo crear el retorno" text={errorMessage} isDismissible={false} className="mt-6" />
          )}
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleReturn}
              preset={isSending || loadingOrder ? Preset.saving : Preset.save}
              text="Crear Retorno"
              disabled={isSending || loadingOrder || selected.length === 0 || invalid}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} text="Cerrar" />
      </Modal.Footer>
    </Modal>
  );
}
