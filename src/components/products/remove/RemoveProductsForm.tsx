import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import useModalStore from "@/stores/modalStorage";
import productRemovedStore from "@/stores/products/productRemovedStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { MdBallot, MdInventory2 } from "react-icons/md";

type Inputs = {
  quantity: number;
};

export function RemoveProductsForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
    const { product, loading, createProduct } = productRemovedStore();
    const { getElement, clearElement} = useTempStorage();
    const { openModal } = useModalStore();
    const { setElement } = useTempStorage();
    const lotSelected = getElement("lotSelected");
    const elementSelected = getElement('product');

    if (!product || !elementSelected) return null;

    const existingFailures = product?.failures?.filter((failure: any) => failure.status !== 2 && failure.product?.id === elementSelected?.id) ?? [];
    const alreadyRemovedQuantity = existingFailures.reduce((accumulatedQuantity: number, failure: any) => accumulatedQuantity + Number(failure.quantity), 0);
    const isProductAlreadyRemoved = existingFailures.length > 0;
    const remainingStock = Number(elementSelected?.quantity ?? 0) - alreadyRemovedQuantity;

    const onSubmit = async (data: Inputs) => {
        if (!data.quantity || !product?.reason) {
          useToastMessageStore.getState().setError({ message : "Debe ingresar la cantidad"});
          return 
        }
        const newData = {
          ...data,
          product_id : elementSelected?.id,
          failure_id : product?.id,
          type : product?.type,
          reason : product?.reason,
          lot_id : lotSelected?.id,
        }
        createProduct(newData);
        reset();
        clearElement();
    }

  return (
        <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 md:p-6">
            <div className="mb-6 rounded-lg border border-bg-subtle overflow-hidden">
                <div className="bg-primary px-4 py-2.5 flex items-center gap-2">
                    <MdInventory2 size={14} className="text-text-inverted/70 shrink-0" />
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-inverted/80">Producto seleccionado</p>
                </div>
                <div className="bg-bg-subtle/20 px-4 py-4 flex flex-col gap-3">
                    <p className="text-sm font-bold text-text-base leading-snug">{ elementSelected?.description }</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-bg-content rounded-md px-3 py-2 border border-bg-subtle">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted block mb-0.5">Código</span>
                            <span className="text-sm font-semibold text-text-base">{ elementSelected?.cod }</span>
                        </div>
                        <div className="bg-bg-content rounded-md px-3 py-2 border border-bg-subtle">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted block mb-0.5">Existencia</span>
                            {alreadyRemovedQuantity > 0 ? (
                                <span className="text-sm font-bold text-text-base">
                                    { elementSelected?.quantity } <span className="text-text-muted/60 font-normal">-</span> { alreadyRemovedQuantity } <span className="text-text-muted/60 font-normal">=</span> { remainingStock }
                                </span>
                            ) : (
                                <span className="text-sm font-bold text-text-base">{ elementSelected?.quantity }</span>
                            )}
                        </div>
                    </div>
                    {lotSelected && (
                        <div className="bg-bg-content rounded-md px-3 py-2 border border-bg-subtle">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted block mb-0.5">Lote</span>
                            <span className="text-sm font-semibold text-text-base">{ lotSelected?.name ?? lotSelected?.id }</span>
                        </div>
                    )}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="flex flex-col mb-4">
              <label htmlFor="quantity" className="input-label">
                Cantidad
              </label>
              <div className="flex items-center gap-2">
                <input type="number" {...register("quantity", { required: "La cantidad es obligatorio.", valueAsNumber: true, max: elementSelected?.quantity })} className="input" step="any" min={0} />
                <MdBallot size={30} color={lotSelected ? "red" : "gray"} className="text-text-muted clickeable" onClick={()=>{ openModal('ChangeLot'); setElement('product', elementSelected) }} />
              </div>
              {errors.quantity && <p className="text-danger text-xs mt-1">{errors.quantity.message}</p>}
            </div>

            {isProductAlreadyRemoved && (
                <Alert
                    type="warning"
                    title="Producto repetido:"
                    text="Este producto ya fue descontado anteriormente en este ingreso. Revise los lotes antes de continuar."
                    className="mb-4"
                />
            )}

            <div className="flex justify-end gap-4">
              <Button text="Cancelar" disabled={loading} preset={Preset.cancel} onClick={()=>clearElement()} />
              <Button type="submit" disabled={loading} preset={loading ? Preset.saving : Preset.save} />
            </div>
          </form>
        </div>
  );
}
