import { iconSvg } from "@/components/button/LiComponent";
import { SearchInput } from "@/components/Search";
import { useProductsSearchLogic } from "@/hooks/products/useProductsSearchLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import productAddStore from "@/stores/products/productAddStore";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";

export function AddProductsSearch() {
    const { product, loading } = productAddStore();
    const { setElement, getElement} = useTempStorage();
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const {currentPage} = usePagination("&page=1");
    const sortBy = "-updated_at";
    const { products, loading: loadingProducts} = useProductStore();
    useProductsSearchLogic(currentPage, searchTerm, sortBy);
    const elementSelected = getElement('product');
    const { system } = useConfigStore()

    if (!product || loading) return null;
    if (elementSelected) return null;

    const handleSelectProduct = (product: any) => {
        setElement('product', product);
        handleSearchTerm('');
    };

    return (
        <div className="relative w-full">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto por código o descripción..." animating={loadingProducts} />
            { searchTerm && products && products.data && products.data.length > 0 && (
                <div className='absolute top-full left-0 right-0 z-20 mt-2 bg-bg-content rounded-lg shadow-lg border border-bg-subtle/50'>
                   <ul className="divide-y divide-bg-subtle max-h-screen overflow-y-auto custom-scrollbar">
                    {products.data.map((item: any) => {
                        console.log("Producto en búsqueda:", item);
                        return (
                          <li 
                            key={item.id} onClick={() => handleSelectProduct(item)} >
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