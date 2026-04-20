import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { usePagination } from "@/hooks/usePagination";
import { useProductsSearchModalLogic } from "@/hooks/useProductsSearchModalLogic";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import useModalStore from "@/stores/modalStorage";
import productSearchModalStore from "@/stores/productSearchModalStore";
import useTempStorage from "@/stores/useTempStorage";
import { SearchInput } from "../Search";
import { iconSvg } from "../button/LiComponent";

export interface SearchProductModalI {
  onClose: () => void;
  isShow: boolean;
}

export function SearchProductModal({ onClose, isShow }: SearchProductModalI) {
    const { system } = useConfigStore()
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const {currentPage} = usePagination("&page=1");
    const { products } = productSearchModalStore();
    useProductsSearchModalLogic(currentPage, searchTerm);
    const { modals, closeModal, openModal } = useModalStore();
    const { getElement, clearElement, setElement } = useTempStorage();


    const handleSelected = (product: any) => {
        openModal('productDetailsOnNavbar');
        setElement('productDetailsOnNavbar', product.cod);
        handleSearchTerm('');
    }   


    return (
        <Modal show={isShow}  onClose={onClose}  size="xl2" headerTitle="Buscar Producto">
            <Modal.Body>
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <div className="w-full">
                    <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto por código o descripción..." />
                    { searchTerm && products && products.data && products.data.length > 0 && (
                        <div className='top-full left-0 right-0 z-20 mt-2 bg-bg-content rounded-lg shadow-lg border border-bg-subtle/50'>
                            <ul className="divide-y divide-bg-subtle max-h-screen overflow-y-auto custom-scrollbar">
                            {products.data.map((item: any) => {
                                return (
                                    <li key={item.id} onClick={() => handleSelected(item)}>
                                        <div className={`flex justify-between items-center p-3 hover:bg-bg-subtle rounded-md transition-colors duration-150 clickeable`}>
                                            <span className="text-text-base justify-start">
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

            </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} preset={Preset.close} />
            </Modal.Footer>
        </Modal>
    );
}
