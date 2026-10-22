'use client';

import { ContactTopProduct } from '@/interfaces/contact';
import { formatDateAsDMY } from '@/lib/date-formats';
import { numberToMoney } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import Link from 'next/link';

export interface ContactTopProductsProps {
  products: ContactTopProduct[] | undefined;
  loading: boolean;
}

export function ContactTopProducts({ products, loading }: ContactTopProductsProps) {
  const { system } = useConfigStore();
  const max = products?.length ? products[0].quantity_sum : 0;

  return (
    <div className="bg-bg-content rounded-xl shadow-sm border border-bg-subtle p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-text-base">Productos más comprados</h3>
        <p className="text-[11px] text-text-muted mt-0.5 font-medium">Top 10 por unidades compradas</p>
      </div>

      {loading && !products && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-bg-subtle rounded animate-pulse" />)}
        </div>
      )}

      {products && products.length === 0 && (
        <p className="text-sm text-text-muted text-center py-8">Sin productos comprados en este período</p>
      )}

      {products && products.length > 0 && (
        <ul className="space-y-3">
          {products.map((product, index) => (
            <li key={product.cod}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <div className="min-w-0 flex items-baseline gap-2">
                  <span className={`shrink-0 w-5 text-xs font-bold ${index === 0 ? 'text-orange-500' : 'text-text-muted'}`}>{index + 1}</span>
                  {product.product_id ? (
                    <Link href={`/products/${product.product_id}/kardex`} className="truncate font-medium text-text-base hover:text-primary hover:underline" title={product.product}>
                      {product.product}
                    </Link>
                  ) : (
                    <span className="truncate font-medium text-text-base" title={product.product}>{product.product}</span>
                  )}
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-text-base">{numberToMoney(product.total_sum, system)}</span>
              </div>
              <div className="ml-7 mt-1 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
                <div className="h-full rounded-full bg-primary/70" style={{ width: `${max ? (product.quantity_sum / max) * 100 : 0}%` }} />
              </div>
              <div className="ml-7 mt-1 flex flex-wrap gap-x-3 text-[11px] text-text-muted">
                <span>{product.quantity_sum.toLocaleString()} unidades compradas</span>
                <span>{product.orders_count} compra(s)</span>
                <span>Última: {formatDateAsDMY(product.last_bought_at)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
