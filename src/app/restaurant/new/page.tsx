'use client';
import { Button, Preset } from "@/components/button/button";
import { RestaurantCategoryAddModal } from "@/components/restaurant/RestaurantCategoryAddModal";
import { RestaurantOptionsAddModal } from "@/components/restaurant/RestaurantOptionsAddModal";
import { ShowImagesModal } from "@/components/restaurant/ShowImagesModal";
import { ViewTitle } from "@/components/ViewTitle";
import { URL } from '@/constants';
import { useRestaurantAddProductLogic } from "@/hooks/restaurant/useRestaurantAddProductLogic";
import { useRestaurantFnLogic } from "@/hooks/restaurant/useRestaurantFnLogic";
import useModalStore from "@/stores/modalStorage";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import useTempStorage from "@/stores/useTempStorage";
import Image from "next/image";
import { useForm } from "react-hook-form";

export default function Page() {
  useRestaurantAddProductLogic(true);
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  const { categories, options, workStations, sending  } = manageRestaurantStore();
  const { modals, closeModal, openModal } = useModalStore();
  const { getElement } = useTempStorage();
  const selectedImage = getElement("productImage") || "default.png";
  const { onSubmit } = useRestaurantFnLogic();


  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  const handleSubmitForm = async (data: any) => {
     const success = await onSubmit(data);
     if (success) {
       reset();
     }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
        <div className="md:col-span-7 md:border-r md:border-primary">
            <ViewTitle text="Registrar Producto" />

            <div className="w-full px-4">
              <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">

                <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full px-3 mb-2">
                  <label htmlFor="description" className="input-label">Nombre del producto</label>
                  <input type="text" id="description" {...register("description")} className="input" />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="unit_cost" className="input-label">Precio de costo</label>
                  <input type="number" id="unit_cost" {...register("unit_cost")} className="input" step="any" />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="sale_price" className="input-label">Precio de venta</label>
                  <input type="number" id="sale_price" {...register("sale_price")} className="input" step="any" />
                </div>

                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="category_id" className="input-label clickeable" onClick={() => { openModal("restaurantCategory") }}>Categoria (Click para agregar)</label>
                  {categories && categories.length > 0 ?
                  <select defaultValue={categories[0] ? categories[0].id : []} id="category_id" {...register("category_id")} className="input-select">
                    {categories?.map((value: any) => {
                      return ( <option key={value.id} value={value.id}> {value.name} </option> );
                    })}
                  </select> :
                  <div className="input"></div>
                  }
                </div>

                {options?.length > 0 ?
                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="options" className="input-label clickeable" onClick={() => { openModal("restaurantOptionsAdd") }}>Modificadores (Click para agregar)</label>
                  {options?.map((value: any) => {
                    return (
                      <div key={value.id} className="flex items-center gap-2 uppercase mt-2">
                        <input type="checkbox" {...register("options")} value={value.id} />
                        <label htmlFor="prescription" className="input-label">{ value.name }</label>
                      </div>
                       );
                      })}
                </div> :
                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="sale_price" className="input-label">Modificadores</label>
                  <div className="input h-10">Sin Modificadores</div>
                </div>}

                {workStations?.length > 0 ?
                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="work_station_id" className="input-label">Espacio de trabajo</label>
                    <select id="work_station_id" defaultValue={1} {...register("work_station_id")} className="input-select">
                      <option value={1}> Ninguno </option>
                    {workStations?.map((value: any) => {
                      return ( <option key={value.id} value={value.id}> {value.name} </option> );
                    })}
                  </select>
                </div> :
                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label htmlFor="sale_price" className="input-label">Espacio de trabajo</label>
                  <div className="input h-10">Sin espacios de trabajo</div>
                </div>}

                <div className="w-full md:w-1/3 px-3 mb-2">
                  <label className="input-label">Seleccionar Imagen</label>
                  <div className="w-full clickeable" onClick={()=> { openModal("showImagesModal")}}>
                  <Image loader={imageLoader} src={selectedImage} alt="Icono de imagen" width={96} height={96} className="drop-shadow-lg rounded-md" />
                  </div>
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="information" className="input-label">Información </label>
                <textarea {...register("information", {})} rows={2} className="input w-full" />
                </div>

                </div>

                <div className="flex justify-center">
                <Button type="submit" disabled={sending} preset={sending ? Preset.saving : Preset.save} />
                </div>
              </form>
          </div>

        </div>
        <div className="md:col-span-3">

        </div>
        <RestaurantOptionsAddModal isShow={modals.restaurantOptionsAdd} onClose={() => closeModal("restaurantOptionsAdd")} />
        <ShowImagesModal isShow={modals.showImagesOptionModal} onClose={() => closeModal("showImagesOptionModal")} nameImage="productImageOption" />
        <RestaurantCategoryAddModal isShow={modals.restaurantCategory} onClose={() => closeModal("restaurantCategory")} />
        <ShowImagesModal isShow={modals.showImagesCategoryModal} onClose={() => closeModal("showImagesCategoryModal")} nameImage="productImageCategory" />
        <ShowImagesModal isShow={modals.showImagesModal} onClose={() => closeModal("showImagesModal")} />
    </div>
  );
}
