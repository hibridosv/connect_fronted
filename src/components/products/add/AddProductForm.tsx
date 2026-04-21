import { Button, Preset } from "@/components/button/button";
import { useProductAddLogic } from "@/hooks/products/useProductAddLogic";
import { documentType } from "@/lib/utils";
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
            <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-6 w-full max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-text-base border-b border-bg-subtle pb-3 mb-4">Resumen de la Compra</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="col-span-1">
                        <dt className="font-medium text-text-muted">Número de documento</dt>
                        <dd className="text-text-base font-semibold mt-1">{product.document_number || "N/A"}</dd>
                    </div>
                    <div className="col-span-1">
                        <dt className="font-medium text-text-muted">Tipo de Documento</dt>
                        <dd className="text-text-base font-semibold mt-1">{documentType(product.document_type)}</dd>
                    </div>
                    <div className="col-span-1">
                        <dt className="font-medium text-text-muted">Proveedor</dt>
                        <dd className="text-text-base font-semibold mt-1">{product?.provider?.name || "N/A"}</dd>
                    </div>
                    <div className="col-span-1">
                        <dt className="font-medium text-text-muted">Impuestos</dt>
                        <dd className="text-text-base font-semibold mt-1">{isTaxesActive ? "Productos con impuestos incluidos" : "Productos sin impuestos"}</dd>
                    </div>
                    {product.comment && (
                        <div className="md:col-span-2">
                            <dt className="font-medium text-text-muted">Comentario</dt>
                            <dd className="text-text-base font-normal mt-1 bg-bg-subtle/50 p-2 rounded-md">{product.comment}</dd>
                        </div>
                    )}
                </dl>
            </div>

            <AddProductsSearch />

            {productSelected?.id && (
                <div className="bg-bg-content rounded-2xl shadow-lg border border-bg-subtle p-6 w-full max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold text-primary mb-4 pb-3 border-b border-bg-subtle">
                        Añadir: {productSelected?.description}
                    </h3>
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
