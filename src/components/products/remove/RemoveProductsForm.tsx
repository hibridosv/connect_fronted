import { Alert } from "@/components/Alert/Alert";
import { Button, Preset } from "@/components/button/button";
import useModalStore from "@/stores/modalStorage";
import productRemovedStore from "@/stores/products/productRemovedStore";
import useToastMessageStore from "@/stores/toastMessageStore";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { MdBallot } from "react-icons/md";

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
    const elementSelected = getElement('productRemoveSelected');

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
        <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-6 w-full max-w-4xl mx-auto">
            <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-bg-subtle">
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">Producto seleccionado</p>
                    <h3 className="text-lg font-bold text-primary truncate">{ elementSelected?.description }</h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-bg-subtle rounded-full px-3 py-1 text-xs font-medium text-text-muted">
                        <span className="text-text-muted/60">Código</span>
                        <span className="font-bold text-text-base">{ elementSelected?.cod }</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-bg-subtle rounded-full px-3 py-1 text-xs font-medium text-text-muted">
                        <span className="text-text-muted/60">Existencia</span>
                        {alreadyRemovedQuantity > 0 ? (
                            <span className="font-bold text-text-base">
                                { elementSelected?.quantity } <span className="text-text-muted/60 font-normal">-</span> { alreadyRemovedQuantity } <span className="text-text-muted/60 font-normal">=</span> { remainingStock }
                            </span>
                        ) : (
                            <span className="font-bold text-text-base">{ elementSelected?.quantity }</span>
                        )}
                    </span>
                    {lotSelected && (
                        <span className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1 text-xs font-medium text-primary">
                            <span className="text-primary/70">Lote</span>
                            <span className="font-bold">{ lotSelected?.lot }</span>
                        </span>
                    )}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <div className="mb-4">
                    <label htmlFor="quantity" className="block text-sm font-bold text-text-muted mb-1">Cantidad</label>
                    <div className="flex items-center gap-2">
                        <input type="number" id="quantity" {...register("quantity", { required: "La cantidad es obligatorio.", valueAsNumber: true, max: { value: remainingStock, message: "La cantidad no puede ser mayor a la existencia disponible." } })} className="input" step="any" min={0} />
                        <MdBallot size={30} color={lotSelected ? "red" : "gray"} className="text-text-muted clickeable" onClick={()=>{ openModal('ChangeLot'); setElement('productRemoveSelected', elementSelected) }} />
                    </div>
                    {errors.quantity && <p className="text-danger text-xs mt-1">{errors.quantity.message}</p>}
                </div>

                {isProductAlreadyRemoved && (
                    <Alert
                        type="warning"
                        title="Importante:"
                        text="Este producto ya fue descontado anteriormente en este ingreso. Revise los lotes antes de continuar."
                        className="mb-4"
                    />
                )}

                <div className="flex justify-center mt-6 pt-4 border-t border-bg-subtle gap-4">
                    <Button type="submit" disabled={loading} preset={loading ? Preset.saving : Preset.save} />
                    <Button disabled={loading} preset={Preset.close} text="Cancelar" onClick={()=>clearElement()} />
                </div>
            </form>
        </div>
  );
}
