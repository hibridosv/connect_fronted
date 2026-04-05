'use client'
import CodeRequestGuard from '@/components/modal/CodeRequestGuard';
import { useCodeRequest } from '@/hooks/useCodeRequest';
import { TypeOfPrice } from '@/services/enums';
import useConfigStore from '@/stores/configStore';
import useTempStorage from '@/stores/useTempStorage';
import { IoMdLock, IoMdUnlock } from 'react-icons/io';

export const setPriceName = (priceType: number): string => {
  if (priceType === TypeOfPrice.normal) return "PRECIO NORMAL";
  if (priceType === TypeOfPrice.wholesaler) return "PRECIO MAYORISTA";
  if (priceType === TypeOfPrice.promotion) return "PRECIO PROMOCION";
  return "PRECIO NORMAL";
}

export function MultiPriceChange() {
  const { activeConfig } = useConfigStore();
  const { getElement, setElement } = useTempStorage();
  const typeOfPriceSelect = getElement('typeOfPrice') ?? 1;

  const { isRequired } = useCodeRequest('code-request-prices');
  const multiPriceStatus = activeConfig && activeConfig.includes("is-multi-price");

  const pricesActive = [TypeOfPrice.normal];
  if (activeConfig && activeConfig.includes("product-price-wolesaler")) pricesActive.push(TypeOfPrice.wholesaler);
  if (activeConfig && activeConfig.includes("product-price-promotion")) pricesActive.push(TypeOfPrice.promotion);

  const handleChangePriceType = () => {
    const currentIndex = pricesActive.indexOf(typeOfPriceSelect as TypeOfPrice);
    const nextIndex = (currentIndex + 1) % pricesActive.length;
    setElement('typeOfPrice', pricesActive[nextIndex]);
  }

  if (!multiPriceStatus) return <span>PRECIO NORMAL</span>;

  return (
    <div>
      <CodeRequestGuard permission="code-request-prices" onAuthorized={handleChangePriceType} >
        <span className='flex items-center gap-2 clickeable'>
          { setPriceName(typeOfPriceSelect) }
          {isRequired
            ? <IoMdLock className="h-4 w-4 text-danger" />
            : <IoMdUnlock className="h-4 w-4 text-success" />
          }
        </span>
      </CodeRequestGuard>
    </div>
    );
}