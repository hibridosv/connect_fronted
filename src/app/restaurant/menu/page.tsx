'use client';
import { Pagination } from "@/components/Pagination";
import { ProductsLinkedModal } from "@/components/products/new/ProductsLinkedModal";
import { ManageCategories } from "@/components/restaurant/ManageCategories";
import { ManageOptions } from "@/components/restaurant/ManageOptions";
import { OptionsVariantsModal } from "@/components/restaurant/OptionsVariantsModal";
import { RestaurantCategoryAddModal } from "@/components/restaurant/RestaurantCategoryAddModal";
import { RestaurantMenuTable } from "@/components/restaurant/RestaurantMenuTable";
import { RestaurantOptionsAddModal } from "@/components/restaurant/RestaurantOptionsAddModal";
import { RestaurantProductCategoryModal } from "@/components/restaurant/RestaurantProductCategoryModal";
import { RestaurantProductDeleteModal } from "@/components/restaurant/RestaurantProductDeleteModal";
import { RestaurantProductFieldModal } from "@/components/restaurant/RestaurantProductFieldModal";
import { RestaurantProductModifiersModal } from "@/components/restaurant/RestaurantProductModifiersModal";
import { RestaurantProductPanelModal } from "@/components/restaurant/RestaurantProductPanelModal";
import { ShowImagesModal } from "@/components/restaurant/ShowImagesModal";
import { SearchInput } from "@/components/Search";
import { ToasterMessage } from "@/components/toaster-message";
import { ViewTitle } from "@/components/ViewTitle";
import { useRestaurantAddProductLogic } from "@/hooks/restaurant/useRestaurantAddProductLogic";
import { useRestaurantMenuLogic } from "@/hooks/restaurant/useRestaurantMenuLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import manageRestaurantStore from "@/stores/restaurant/manageRestaurantStore";
import useTempStorage from "@/stores/useTempStorage";
import { BiPlusCircle } from "react-icons/bi";


export default function Page() {
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["description"], 500);
  useRestaurantMenuLogic(currentPage, searchTerm);
  useRestaurantAddProductLogic(true);
  const { products, updateProduct, loadingProducts } = manageRestaurantStore();
  const { modals, closeModal, openModal } = useModalStore();
  const { getElement } = useTempStorage();

  const handleSelectProductImage = (image: string) => {
    const product = getElement('menuProduct');
    if (product) updateProduct(product.id, { field: 'image', data: image });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="Menu de restaurante" />
        <RestaurantMenuTable />
        <Pagination records={products} handlePageNumber={handlePageNumber} />
    </div>
    <div className="md:col-span-3">
      <div className="m-4">
        <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar productos" animating={loadingProducts} />
      </div>
        <div  className="mx-4 flex items-center justify-between">
          <ViewTitle text="Modificadores" />
          <BiPlusCircle size={28} className="clickeable" onClick={() => { openModal("restaurantOptionsAdd") }} />
        </div>
        <ManageOptions />
        <div  className="mx-4 flex items-center justify-between">
          <ViewTitle text="Categorias" />
          <BiPlusCircle size={28} className="clickeable" onClick={() => { openModal("restaurantCategory") }} />
        </div>
        <ManageCategories />
    </div>
    <OptionsVariantsModal isShow={modals.optionSelected} onClose={() => closeModal("optionSelected")} />
    <RestaurantOptionsAddModal isShow={modals.restaurantOptionsAdd} onClose={() => closeModal("restaurantOptionsAdd")} />
    <ShowImagesModal isShow={modals.showImagesOptionModal} onClose={() => closeModal("showImagesOptionModal")} nameImage="productImageOption" />
    <RestaurantCategoryAddModal isShow={modals.restaurantCategory} onClose={() => closeModal("restaurantCategory")} />
    <ShowImagesModal isShow={modals.showImagesCategoryModal} onClose={() => closeModal("showImagesCategoryModal")} nameImage="productImageCategory" />
    <RestaurantProductFieldModal isShow={modals.menuProductField} onClose={() => closeModal("menuProductField")} />
    <RestaurantProductCategoryModal isShow={modals.menuProductCategory} onClose={() => closeModal("menuProductCategory")} />
    <RestaurantProductPanelModal isShow={modals.menuProductPanel} onClose={() => closeModal("menuProductPanel")} />
    <RestaurantProductModifiersModal isShow={modals.menuProductModifiers} onClose={() => closeModal("menuProductModifiers")} />
    <ProductsLinkedModal isShow={modals.menuProductLinked} onClose={() => closeModal("menuProductLinked")} product={getElement('menuProduct')} requiredLink={false} />
    <RestaurantProductDeleteModal isShow={modals.menuProductDelete} onClose={() => closeModal("menuProductDelete")} />
    <ShowImagesModal isShow={modals.menuProductImage} onClose={() => closeModal("menuProductImage")} nameImage="menuProductImage" onSelect={handleSelectProductImage} />
    <ToasterMessage />
</div>
  );
}
