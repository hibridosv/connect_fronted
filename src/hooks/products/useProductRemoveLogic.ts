import productRemovedStore from '@/stores/products/productRemovedStore';
import { useEffect } from 'react';


export function useProductRemoveLogic(currentPage: string = "") {
 const { loadProduct, loadProducts} = productRemovedStore();

    useEffect(() => {
        loadProduct(`removes/find?included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]=1`);
    }, [loadProduct]);


      useEffect(() => {
        loadProducts(`removes?sort=-created_at&included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]=2&perPage=15${currentPage}`);
    }, [loadProducts, currentPage]);

}
