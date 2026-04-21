import { SearchInput } from "@/components/Search";
import { useProductsSearchLogic } from "@/hooks/products/useProductsSearchLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
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
                  <ul className="divide-y divide-bg-subtle max-h-80 overflow-y-auto custom-scrollbar">
                    {products.data.map((item: any) => {
                        return (
                          <li 
                            key={item.id} 
                            className="flex justify-between items-center p-3 hover:bg-bg-subtle rounded-md cursor-pointer transition-colors duration-150" 
                            onClick={() => handleSelectProduct(item)}
                          >
                            <span className="font-medium text-text-base">{item.cod} - {item.description}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </li>
                        );
                    })}
                  </ul>
                </div> 
            )}
        </div>
    );
}