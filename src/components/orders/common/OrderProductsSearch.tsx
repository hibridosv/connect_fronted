import { iconSvg } from "@/components/button/LiComponent";
import { SearchInput } from "@/components/Search";
import { useOrderProductsSearchLogic } from "@/hooks/order/common/useOrderProductsSearchLogic";
import { useOrderFnLogic } from "@/hooks/order/product/useOrderFnLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";
import { useState } from "react";

export function OrderProductsSearch() {
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const {currentPage} = usePagination("&page=1");
    const sortBy = "description";
    const { products, loading } = useProductStore();
    const [searchKey, setSearchKey] = useState(Date.now()); // 1. Añadimos un estado para la key
    useOrderProductsSearchLogic(currentPage, searchTerm, sortBy);
    const { getElement, setElement } = useTempStorage();
    const typeOfSearch = getElement('typeOfSearch');
    const { addNew } = useOrderFnLogic();
    const { system } = useConfigStore()


    const handleSelectProduct = (product: any) => {
      setElement('productSearched', product);
      addNew(product);
      handleSearchTerm('');
      setSearchKey(Date.now()); // 2. Cambiamos la key para forzar el reseteo
    };

    if (!typeOfSearch) return null;


    return (
        <div className="relative w-full">
            {/* 3. Usamos el estado como key en el componente SearchInput */}
            <SearchInput key={searchKey} handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto por código o descripción..." animating={loading} />
            { searchTerm && products && products.data && products.data.length > 0 && (
                <div className='absolute top-full left-0 right-0 z-20 mt-2 bg-bg-content rounded-lg shadow-lg border border-bg-subtle/50'>
                  <ul className="divide-y divide-bg-subtle max-h-screen overflow-y-auto custom-scrollbar">
                    {products.data.map((item: any) => {
                        return (
                           <li key={item.id} onClick={() => handleSelectProduct(item)}>
                            <div className={`flex justify-between items-center p-3 hover:bg-bg-subtle rounded-md transition-colors duration-150 clickeable`}>
                              <span className="text-text-base">
                                {item.cod} | 
                                {item.description} 
                                {item?.prices && <span className="text-xs font-normal border border-slate-500 ml-3 shadow-md rounded-md px-1">{ numberToMoney(item?.prices[0]?.price ?? 0, system) }</span>}
                                </span>
                              <span className="flex items-center">
                                <span className="text-xs font-normal border border-slate-500 ml-3 shadow-md rounded-md px-1 justify-end max-h-5 h-5">{item?.quantity}</span>
                                {iconSvg}
                              </span>
                            </div>
                          </li>
                        );
                    })}
                  </ul>
                </div> 
            )}
        </div>
    );
}