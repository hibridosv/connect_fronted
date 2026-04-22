import { Button, Preset } from "@/components/button/button";
import { useProductAddLogic } from "@/hooks/products/useProductAddLogic";
import { documentType, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import productAddStore from "@/stores/products/productAddStore";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { AddProductsSearch } from "./AddProductsSearch";

export function AddProductForm() {
    useProductAddLogic();
    const { register, handleSubmit, reset } = useForm();
    const { product, loading, createProduct } = productAddStore();
    const { getElement, clearElement } = useTempStorage();
    const isTaxesActive = getElement("isTaxesActive");
    const productSelected = getElement("product");
    const { system } = useConfigStore()

    if (loading || !product) return null;

    const isSending = false;

    const onSubmit = async (data: any) => {
      data.product_id = productSelected.id
      data.actual_stock = data.quantity
      data.provider_id = product.provider_id
      data.employee_id = product.employee_id
      data.document_type = product.document_type
      data.comment = product.comment
      data.product_register_principal = product.id
      data.unit_cost = isTaxesActive ? data.unit_cost * 1.13 : data.unit_cost;
      data.sale_price = productSelected?.prices[0]?.price;
      await createProduct(data);
      reset();
      clearElement("product");
  }


    return (
        <div className="space-y-6">
            <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle w-full max-w-4xl mx-auto overflow-hidden">
                <div className="px-6 py-3 bg-bg-subtle/60 border-b border-bg-subtle">
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Resumen de la Compra</p>
                </div>
                <dl className="grid grid-cols-1 md:grid-cols-2 text-sm">
                    <div className="flex flex-col gap-0.5 px-6 py-4 md:border-r border-bg-subtle border-b">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Número de documento</dt>
                        <dd className="text-text-base font-semibold">{product.document_number || "N/A"}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 px-6 py-4 border-b border-bg-subtle">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Tipo de Documento</dt>
                        <dd className="text-text-base font-semibold">{documentType(product.document_type)}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 px-6 py-4 md:border-r border-bg-subtle">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Proveedor</dt>
                        <dd className="text-text-base font-semibold">{product?.provider?.name || "N/A"}</dd>
                    </div>
                    <div className="flex flex-col gap-0.5 px-6 py-4">
                        <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Impuestos</dt>
                        <dd className="text-text-base font-semibold">{isTaxesActive ? "Incluidos en precio" : "No incluidos"}</dd>
                    </div>
                    {product.comment && (
                        <div className="md:col-span-2 flex flex-col gap-1 px-6 py-4 border-t border-bg-subtle">
                            <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">Comentario</dt>
                            <dd className="text-text-base font-normal bg-bg-subtle/50 px-3 py-2 rounded-lg">{product.comment}</dd>
                        </div>
                    )}
                </dl>
            </div>

            <AddProductsSearch />

            {productSelected?.id && (
                <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-6 w-full max-w-4xl mx-auto">
                    <div className="flex items-start justify-between gap-4 mb-5 pb-4 border-b border-bg-subtle">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">Añadir producto</p>
                            <h3 className="text-lg font-bold text-primary truncate">{productSelected?.description}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="inline-flex items-center gap-1.5 bg-bg-subtle rounded-full px-3 py-1 text-xs font-medium text-text-muted">
                                <span className="text-text-muted/60">Stock</span>
                                <span className="font-bold text-text-base">{productSelected?.quantity}</span>
                            </span>
                            <span className="inline-flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1 text-xs font-medium text-primary">
                                <span className="text-primary/70">Precio</span>
                                <span className="font-bold">{productSelected?.prices?.[0]?.price ? numberToMoney(productSelected.prices[0].price, system) : "N/A"}</span>
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <label htmlFor="quantity" className="block text-sm font-bold text-text-muted mb-1"> Cantidad </label>
                                <input
                                    type="number"
                                    id="quantity"
                                    {...register("quantity", {required: true})}
                                    className="input"
                                    step="any"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label htmlFor="unit_cost" className="block text-sm font-bold text-text-muted mb-1"> Precio Costo </label>
                                <input
                                    type="number"
                                    id="unit_cost"
                                    {...register("unit_cost", {required: true})}
                                    className="input"
                                    step="any"
                                    min={0}
                                />
                            </div>

                            <div>
                                <label htmlFor="lot" className="block text-sm font-bold text-text-muted mb-1"> Lote </label>
                                <input type="text" id="lot" {...register("lot")} className="input" />
                            </div>
                              <div>
                                  <label htmlFor="expiration" className="block text-sm font-bold text-text-muted mb-1">
                                      Fecha de vencimiento
                                  </label>
                                  <input
                                      type="date"
                                      id="expiration"
                                      {...register("expiration", { disabled: productSelected.expires ? false : true })}
                                      className={productSelected.expires ? "input" : "input-disabled"}
                                  />
                              </div>
                        </div>
                        <div className="flex justify-center mt-6 pt-4 border-t border-bg-subtle gap-4">
                            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                            <Button disabled={isSending} preset={Preset.close} text="Cancelar" onClick={()=>clearElement("product")} />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
