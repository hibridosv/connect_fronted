'use client'
import { createService, deleteService, getServices } from '@/services/services';
import useProductLinkedStore from '@/stores/products/productLinkedStore';
import useProductStore from '@/stores/products/productStore';
import useStateStore from '@/stores/stateStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import useTempStorage from '@/stores/useTempStorage';
import { useEffect, useRef, useState } from 'react';

export function useProductLinkedLogic(currentPage: any, searchTerm: string, sortBy: string, product: any, isShow: boolean) {
  const { loadProducts } = useProductStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);
  const [ products, setProducts ] = useState([]) as any;
  const { openLoading, closeLoading } = useStateStore();
  const { loadProducts: fetchDataLinked, products: productsLinked, loading, productId} = useProductLinkedStore();
  const { clearElement, getElement} = useTempStorage();
  const elementSelected = getElement("product");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
        const fetchData = async (url: string) => {
            openLoading("productSearch");
            try {
                const response = await getServices(url);
                setProducts(response.data.data);
            } catch (error) {
                    console.error('Error fetching data:', error);
            } finally {
                closeLoading("productSearch");
            }
        };

    if (isShow) {
        if(searchTerm === "") {
            lastQuery.current = null;
            setProducts([]);
        } else {
            const query = `${searchTerm}|${sortBy}`;
            // busqueda u orden nuevo: vuelve a la pagina 1
            const page = query !== lastQuery.current ? "&page=1" : currentPage;
            lastQuery.current = query;
            fetchData(`products?sort=${sortBy}&filterWhere[status]==1&filterWhere[is_restaurant]==0&filterWhere[product_type]=!3&perPage=10${page}${searchTerm}`)
        }
    }
  }, [loadProducts, currentPage, searchTerm, sortBy, product, openLoading, closeLoading, isShow]);


    useEffect(() => {
        if (isShow && product && product.id && product.product_type == 3 && productId != product.id) {
            fetchDataLinked(product.id);
        }
  }, [product, isShow, fetchDataLinked, productId])


const onSubmit = async (data: any) => {
    const newData = {
            ...data,
            product_id: product.id,
            added_product_id: elementSelected.id,
        }
    try {
      const response = await createService(`products/${newData.product_id}/linked`, newData);
      useToastMessageStore.getState().setMessage(response);
      await fetchDataLinked(newData.product_id);
      clearElement("product");
    } catch (error) {
      useToastMessageStore.getState().setError(error);
      console.error(error);
    }
}

const onDeleteLinked = async (linkedId: string) => {
    setIsDeleting(true);
    try {
        const response = await deleteService(`products/${linkedId}/linked`);
        useToastMessageStore.getState().setMessage(response);
        await fetchDataLinked(product.id);
    } catch (error) {
        useToastMessageStore.getState().setError(error);
    } finally {
        setIsDeleting(false);
    }
}

    return { products, onSubmit, onDeleteLinked, isDeleting, productsLinked, loading };
}
