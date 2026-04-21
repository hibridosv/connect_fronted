import { LiComponent } from "@/components/button/LiComponent";
import { SearchInput } from "@/components/Search";
import { useProductsSearchLogic } from "@/hooks/products/useProductsSearchLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import productRemovedStore from "@/stores/products/productRemovedStore";
import useProductStore from "@/stores/products/productStore";
import useTempStorage from "@/stores/useTempStorage";


export function RemoveProductsSearch() {
    const { product, loading } = productRemovedStore();
    const { getElement, setElement} = useTempStorage();
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const {currentPage} = usePagination("&page=1");
    const sortBy = "-updated_at";
    const { products, loading: loadingSearch } = useProductStore();
    useProductsSearchLogic(currentPage, searchTerm, sortBy);
    const elementSelected = getElement('product');

    if (!product || loading) return null;
    if (elementSelected) return null;


    const handleSelectProduct = (product: any) => {
        setElement('product', product);
        handleSearchTerm('');
    };

    return (
        <div className="relative w-full px-4">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto por código o descripción..." animating={loadingSearch} />
            { searchTerm && products && products.data && products.data.length > 0 && (
                <div className='absolute top-full left-0 right-0 z-20 mt-2 bg-bg-content rounded-lg shadow-lg border border-bg-subtle/50 mx-4'>
                  <ul className="divide-y divide-bg-subtle max-h-80 overflow-y-auto custom-scrollbar">
                    {products.data.map((item: any) => {
                        return (
                          <LiComponent 
                            key={item.id} 
                            text={`${item.cod} - ${item.description}`} 
                            onClick={() => handleSelectProduct(item)}
                          />
                        );
                    })}
                  </ul>
                </div> 
            )}
        </div>
    );
}
