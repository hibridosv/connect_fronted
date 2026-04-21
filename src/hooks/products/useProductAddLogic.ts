import { useEffect } from 'react';

import useContactStore from '@/stores/ContactStore';
import cashAccountStore from '@/stores/cash/cashAccountStore';
import cashExpensesStore from '@/stores/cash/cashExpensesStore';
import productAddStore from '@/stores/products/productAddStore';

export function useProductAddLogic() {
  const { loadProduct, loadProducts} = productAddStore();
  const { loadContacts, contacts: providers } = useContactStore();
  const { loadExpensesCategories, expensesCategories } = cashExpensesStore();
  const { loadAccount, accounts } = cashAccountStore();


    useEffect(() => {
        loadProduct(`registers/principal/find?included=provider,registers.product&filter[status]=0`);
        loadProducts(`registers/principal?sort=-created_at&included=provider,registers.product,employee&filter[status]=1&perPage=10`);
        loadExpensesCategories(`cash/categories`);
        loadAccount(`cash/accounts?sort=-created_at&filterWhere[status]==1`);
    }, [loadProduct, loadProducts, loadExpensesCategories, loadAccount]);


    useEffect(() => {
        if (!providers) {
            loadContacts('contacts?filterWhere[is_provider]==1&perPage=100&page=1');
        }
    }, [loadContacts, providers]);

    return { expensesCategories, accounts }; 

}
