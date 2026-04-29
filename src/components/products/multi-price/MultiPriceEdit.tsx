import { DeleteButton } from "@/components/button/DeleteButton";
import SkeletonTable from "@/components/skeleton/skeleton-table";
import { useProductPricesEditLogic } from "@/hooks/products/useProductPricesEditLogic";
import { numberToMoney4Digits } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useStateStore from "@/stores/stateStorage";
import useTempStorage from "@/stores/useTempStorage";
import { useForm } from "react-hook-form";
import { RadioButton } from "../../button/RadioButton";
import { Button, Preset } from "../../button/button";
import { usePriceTypes } from "./priceTypeToText";

export interface MultiPrice {
  productId: string;
  isShow: boolean;
  text: string;
}

type Inputs = {
  quantity: number;
  price: number;
};

export function MultiPriceEdit(props: MultiPrice) {
  const { text, productId, isShow } = props;
  const { system } = useConfigStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const { options, priceTypeToText } = usePriceTypes();
  const { getElement } = useTempStorage();
  const selectedOption = getElement("optionSelected");
  const { prices, addPrice, deletePrice } = useProductPricesEditLogic(productId, isShow, reset, selectedOption);
  const { loading } = useStateStore();
  const isLoading = loading["productPrices"] ? true : false;

  if (!isShow) {
    return null;
  }

  return (
    <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-4 md:p-6">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-text-base">{text}</h3>
        <div className="w-full flex justify-center">
          <RadioButton options={options} />
        </div>
      </div>

      <form onSubmit={handleSubmit(addPrice)} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 items-start">
        <div className="flex flex-col">
          <label htmlFor="quantity" className="input-label">Cantidad</label>
          <input
            id="quantity"
            type="number"
            step="any"
            {...register("quantity", { required: "La cantidad es obligatoria.", valueAsNumber: true, })}
            className="input"
            placeholder="Ej: 10"
          />
          {errors.quantity && <p className="text-danger text-xs mt-1">{errors.quantity.message}</p>}
        </div>
        <div className="flex flex-col">
          <label htmlFor="price" className="input-label">Precio</label>
          <input
            id="price"
            type="number"
            step="any"
            {...register("price", { required: "El precio es obligatorio.", valueAsNumber: true })}
            className="input"
            placeholder="Ej: 150.00"
          />
          {errors.price && <p className="text-danger text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div className="self-end">
            <Button type="submit" preset={isLoading ? Preset.saving : Preset.add} text={isLoading ? "Guardando ..." : "Agregar Precio"} disabled={isLoading} />
        </div>
      </form>

      {isLoading ? (
        <SkeletonTable rows={3} columns={4} />
      ) : prices?.length && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-text-base">
            <thead className="text-xs text-text-base uppercase bg-bg-subtle/60">
              <tr className="border-b-2 border-bg-subtle">
                <th scope="col" className="px-4 py-3 border-r border-bg-subtle">Cant</th>
                <th scope="col" className="px-4 py-3 border-r border-bg-subtle">Precio</th>
                <th scope="col" className="px-4 py-3 border-r border-bg-subtle">Tipo</th>
                <th scope="col" className="px-4 py-3 text-center">Del</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-subtle">
              {prices
                .filter((price) =>
                  selectedOption?.id === 0
                    ? true
                    : price.price_type === selectedOption?.id
                )
                .map((price) => {
                  return (
                    <tr key={price.id} className="odd:bg-bg-subtle/40 hover:bg-bg-subtle divide-x divide-bg-subtle">
                      <td className="px-2 py-2 font-medium">{price.qty}</td>
                      <td className="px-2 py-2">
                        {numberToMoney4Digits(price.price, system)}
                      </td>
                      <td className="px-2 py-2">{priceTypeToText(price.price_type)}</td>
                      <td className="px-2 py-2 text-center">
                        <DeleteButton id={price.id} url="prices" disabled={false} text="¿Estas seguro de eliminar este precio?" onDeleteConfirm={deletePrice} header="Eliminar Precio" />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
