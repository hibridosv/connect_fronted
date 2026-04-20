'use client'
import { isProducts } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { tenant } = useConfigStore();


  useEffect(() => {
    if (tenant?.system) {
        if (isProducts(tenant?.system)) {
          router.push("/orders/products");
        } else {
          router.push("/orders/restaurant");
        }
    }
  }, [router, tenant]);
  
  return (<div></div>)
}