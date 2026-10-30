import productRemovedStore from '@/stores/products/productRemovedStore';
import { useEffect } from 'react';


export function useProductRemoveLogic(currentPage: string = "") {
 const { loadProduct, loadProducts, loadOpenRegisters } = productRemovedStore();

    useEffect(() => {
        loadProduct(`removes/find?included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]==1`);
    }, [loadProduct]);

    // cada empleado trabaja solo en su registro: se avisa quien tiene uno abierto sin guardar
    useEffect(() => {
        loadOpenRegisters(`removes?sort=-created_at&included=employee&filter[status]==1`);
    }, [loadOpenRegisters]);


      useEffect(() => {
        loadProducts(`removes?sort=-created_at&included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]==2&perPage=12${currentPage}`);
    }, [loadProducts, currentPage]);

}
