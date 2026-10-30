import { getCountryProperty, numberToMoney } from "@/lib/utils";
import { createService } from "@/services/services";
import useConfigStore from "@/stores/configStore";
import useInvoiceDetailsStore from "@/stores/invoicing/invoiceDetailsStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert } from "../Alert/Alert";
import { Button, Preset } from "../button/button";
import { Switch } from "../button/Switch";
import Modal from "../modal/Modal";

export interface CreateCreditNoteModalI {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}
export function CreateCreditNoteModal(props: CreateCreditNoteModalI) {
    const { onClose, isShow, record } = props;
  
  const [isSending, setIsSending] = useState(false);
  // motivo del ultimo intento fallido: queda visible en el modal (el toast desaparece a los pocos segundos)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProductReturn, setIsProductReturn] = useState(true);
  const [formProducts, setFormProducts] = useState<any[]>([]);
  const [totalState, setTotalState] = useState(0);
  const { system } = useConfigStore();
  const { setError, setMessage } = useToastMessageStore();
  const {loadingOrder, fetchOrder } = useInvoiceDetailsStore();

  const { control, handleSubmit, setValue, getValues } = useForm({
    shouldUnregister: false,
  });
  const taxesPercent = 1 + (getCountryProperty(parseInt(system?.country)).taxes / 100);
  // con notas activas solo cabe una parcial por el saldo: la total anula toda la venta y connect la rechaza
  const activeCreditNotes = record?.creditnotes?.filter((note: any) => note.status === 1).reduce((sum: number, note: any) => sum + Number(note.total ?? 0), 0) ?? 0;
  const hasCreditNotes = activeCreditNotes > 0;
  const available = Math.max(Number(record?.total ?? 0) - activeCreditNotes, 0);
  const productsRef = useRef<any[]>([]);

  useEffect(() => {
    if (isShow) setErrorMessage(null);
    if (record?.products && isShow) {
      const initializedProducts = record.products.map((product: any) => ({
        ...product,
        quantity: product.quantity || 1,
        original_quantity: Number(product.quantity) || 1,
        discount: Number(product.discount) || 0,
      }));
      setFormProducts(initializedProducts);
      productsRef.current = initializedProducts;

      initializedProducts.forEach((product: any) => {
        setValue(`product-${product.id}`, product.quantity);
        setValue(`name-${product.id}`, product.product);
        setValue(`price-${product.id}`, product.unit_price);
      });
      
      setTotalState(calculateTotal(initializedProducts));
    }
    // eslint-disable-next-line
  }, [record?.products, setValue, isShow]);

  // unit_price es el precio sin descuento y discount el descuento de toda la linea:
  // se descuenta la parte proporcional a la cantidad de la nota de credito
  const lineTotal = (p: any) => {
    const quantity = Number(getValues(`product-${p.id}`)) || 0;
    const price = Number(getValues(`price-${p.id}`)) || 0;
    const discount = p.original_quantity ? (p.discount * quantity) / p.original_quantity : 0;
    return Math.max(quantity * price - discount, 0);
  };

  const calculateTotal = (products = formProducts) => {
    return products.reduce((total: number, p: any) => total + lineTotal(p), 0);
  };

  // Update the total after blur (focus lost) rather than on every change
  const updateTotalAfterBlur = () => {
    setTimeout(() => {
      setTotalState(calculateTotal());
    }, 0);
  };

  const handleNc = async () => {
    // Calculate the final total before submission
    const currentTotal = calculateTotal();
    setTotalState(currentTotal);
    const totalIsDiferent = Math.abs(currentTotal - record.total) >= 0.01;
    if (hasCreditNotes && currentTotal - available >= 0.01) {
      const message = `El monto supera el saldo disponible para notas de crédito (${numberToMoney(available, system)})`;
      setError({ message });
      setErrorMessage(message);
      return;
    }
    
    const formattedData = formProducts
      .map((product: any) => {
        const quantity = Number(getValues(`product-${product.id}`)) || 0;
        const unit_price = Number(getValues(`price-${product.id}`)) || 0;
        const name = getValues(`name-${product.id}`);
        if (quantity === 0) return null;
        const total = lineTotal(product);
        const subtotal = total / taxesPercent;
        const taxes = total - subtotal;
        return {
          id: product.id,
          product_id: product.product_id,
          product_type: product.product_type,
          lot_id: product.lot_id,
          product_name: name,
          product_price: unit_price,
          product_subtotal: subtotal,
          product_taxes: taxes,
          product_total: total,
          quantity,
        };
      })
      .filter((item) => item !== null);
      
      if (formattedData.length === 0) {
        setError({ message: "Debe tener al menos un producto con cantidad mayor a 0"});
        return;
      }
      
      const newData = {
        products: formattedData,
        invoice: record.id,
        subtotal: currentTotal / taxesPercent,
        taxes: currentTotal - (currentTotal / taxesPercent),
        total: currentTotal,
        credit_note_type: totalIsDiferent || hasCreditNotes ? 2 : 1, // 1 for full credit note, 2 for partial
        is_product_return: isProductReturn
    };

    try {
      setIsSending(true);
      setErrorMessage(null);
      const response = await createService(`documents/credit-note`, newData);
      if (response.status === 200) {
        setMessage({ message: "Nota de crédito enviada correctamente"});
        await fetchOrder(record.id);
        onClose();
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setErrorMessage((error as any)?.response?.data?.message || (error as any)?.message || "No se pudo crear la nota de crédito");
    } finally {
      setIsSending(false);
    }
  };

  // Calculate product total for display in table
  const getProductTotal = (product: any) => lineTotal(product);


  if (!isShow || !record) return null;


  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle="Crear nota de crédito">
      <Modal.Body>
        <form onSubmit={handleSubmit(handleNc)}>
          <div className="p-4">
            {hasCreditNotes ? (
              <Alert
                type="warning"
                text={`Esta factura ya tiene notas de crédito por ${numberToMoney(activeCreditNotes, system)}. Solo puede emitir una nota parcial por ${numberToMoney(available, system)} como máximo: modifique las cantidades o los precios antes de enviarla.`}
                isDismissible={false}
                className="mb-6"
              />
            ) : (
              <Alert
                type="info"
                text="Para emitir una Nota de Crédito por el total del documento, haga clic directamente en 'Crear Nota de Crédito'. Para una nota parcial, modifique las cantidades de los productos antes de enviarla."
                isDismissible={false}
                className="mb-6"
              />
            )}
            <div className="w-full overflow-x-auto rounded-lg border border-bg-subtle">
              <table className="w-full text-sm text-left text-text-base">
                <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
                  <tr>
                    <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-center">Cant</th>
                    <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle">Código</th>
                    <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle w-full">Producto</th>
                    <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-right">Precio</th>
                    <th className="px-4 py-3 font-medium border-b-2 border-bg-subtle text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-subtle">
                  {formProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-bg-subtle/40">
                      <td className="px-4 py-2">
                        <Controller
                          name={`product-${product.id}`}
                          control={control}
                          defaultValue={product.quantity}
                          render={({ field }) => (
                            <input
                              type="number"
                              step="any"
                              {...field}
                              min={0}
                              className="w-20 bg-bg-content border border-bg-subtle rounded-md shadow-sm text-center focus:ring-primary focus:border-primary sm:text-sm"
                              onBlur={() => {
                                field.onBlur();
                                updateTotalAfterBlur();
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 truncate">{product.cod}</td>
                      <td className="px-4 py-2">
                        <Controller
                          name={`name-${product.id}`}
                          control={control}
                          defaultValue={product.product}
                          render={({ field }) => (
                            <textarea
                              rows={1}
                              maxLength={250}
                              {...field}
                              className="w-full bg-bg-content border border-bg-subtle rounded-md shadow-sm px-2 py-1 focus:ring-primary focus:border-primary sm:text-sm"
                            />
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Controller
                          name={`price-${product.id}`}
                          control={control}
                          defaultValue={product.unit_price}
                          render={({ field }) => (
                            <input
                              type="number"
                              {...field}
                              className="w-24 bg-bg-content border border-bg-subtle rounded-md shadow-sm px-2 py-1 text-right focus:ring-primary focus:border-primary sm:text-sm"
                              onBlur={() => {
                                field.onBlur();
                                updateTotalAfterBlur();
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium">
                        {numberToMoney(getProductTotal(product), system)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-bg-subtle/60">
                  <tr>
                    <td colSpan={4} className="text-right font-bold py-3 px-4 border-t-2 border-bg-subtle">TOTAL:</td>
                    <td className="py-3 px-4 border-t-2 border-bg-subtle font-bold text-right">
                      {numberToMoney(totalState, system)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-right font-bold py-3 px-4">RETORNAR PRODUCTOS AL INVENTARIO:</td>
                    <td className="py-3 px-4 font-bold flex justify-end">
                      <Switch
                        disabled={false}
                        checked={isProductReturn}
                        label={isProductReturn ? "Sí" : "No"}
                        onChange={() => setIsProductReturn(!isProductReturn)}
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            {errorMessage && (
              <Alert
                type="danger"
                title="No se pudo crear la nota de crédito"
                text={errorMessage}
                isDismissible={false}
                className="mt-6"
              />
            )}
            {record?.invoice_assigned?.type !== 3 ? (
              <Alert
                type="warning"
                text="No se puede crear una nota de crédito en este documento."
                isDismissible={false}
                className="my-8"
              />
            ) : (
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  preset={isSending || loadingOrder ? Preset.saving : Preset.save}
                  text="Crear Nota de Crédito"
                  disabled={isSending || loadingOrder}
                />
              </div>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose} preset={Preset.close} text="Cerrar" />
      </Modal.Footer>
    </Modal>
  );
}