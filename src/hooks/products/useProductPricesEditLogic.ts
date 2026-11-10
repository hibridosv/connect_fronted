'use client'
import useStateStore from '@/stores/stateStorage'
import { useCallback, useEffect, useState } from 'react'
import { getServices, createService, deleteService } from '@/services/services'
import { Price } from '@/interfaces/price';
import useToastMessageStore from '@/stores/toastMessageStore';

export function useProductPricesEditLogic(ProductId?: string, isShow?: boolean, reset?: any, selectedOption?: any) {
    const [ prices, setPrices ] = useState<Price[] | null>();
    const { openLoading, closeLoading } = useStateStore();

    const fetchDataPrices = useCallback(async (url: string) => {
        openLoading("productPrices");
        try {
            const response = await getServices(url);
            setPrices(response.data.data);
        } catch (error) {
                useToastMessageStore.getState().setError(error);
        } finally {
            closeLoading("productPrices");
        }
    }, [openLoading, closeLoading, setPrices]);
  
    useEffect(() => {
        if (isShow && ProductId) {
            fetchDataPrices(`prices?sort=created_at&filterWhere[product_id]==${ProductId}`);
        }
    }, [isShow, ProductId, fetchDataPrices]);

    const addPrice = async (data: any) => {
        try {
            if (!selectedOption || selectedOption.id === 0) {
                useToastMessageStore.getState().setError({ message : "Por favor, seleccione un tipo de precio."});
                return;
            }
            const priceData = {
                product_id: ProductId,
                qty: data.quantity,
                price: data.price,
                price_type: selectedOption.id,
            };
            const response = await createService('prices', priceData);
            await fetchDataPrices(`prices?sort=created_at&filterWhere[product_id]==${ProductId}`);
            useToastMessageStore.getState().setMessage(response);
            reset();
        } catch (error) {
            useToastMessageStore.getState().setError(error);
        }
    }

    const deletePrice = async (url: string) => {
        try {
            const response = await deleteService(url);
            await fetchDataPrices(`prices?sort=created_at&filterWhere[product_id]==${ProductId}`);
            useToastMessageStore.getState().setMessage(response);
        } catch (error) {
            useToastMessageStore.getState().setError(error);
        }
    }

    return { prices, addPrice, deletePrice  }
}
