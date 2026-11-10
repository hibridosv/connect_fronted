'use client'
import { getServices } from '@/services/services';
import useStateStore from '@/stores/stateStorage';
import useToastMessageStore from '@/stores/toastMessageStore';
import { useEffect, useState } from 'react'

interface ExpiredStats {
    total: number;
    expired: number;
    toexpired: number;
}

export function useProductExpiresLogic() {
  const [productsExpired, setProductsExpired] = useState<any[]>([]);
  const [expired, setExpired] = useState<ExpiredStats | null>(null);
  const { openLoading, closeLoading } = useStateStore();
 
  useEffect(() => {
        const getProductsExpired = async () => {
            openLoading("Expirations");
            try {
                const response = await getServices(`expirations`);
                setProductsExpired(response.data.data);
                const exp = await getServices(`expired`);
                setExpired(exp.data.data);
            } catch (error) {
                useToastMessageStore.getState().setError(error);
            } finally {
                closeLoading("Expirations");
            }
        }
        getProductsExpired();
    }, [openLoading, closeLoading]);

    return { productsExpired, expired };
}
