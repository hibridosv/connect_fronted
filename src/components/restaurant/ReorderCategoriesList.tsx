'use client';
import { NothingHere } from '@/components/NothingHere';
import SkeletonTable from '@/components/skeleton/skeleton-table';
import { URL } from '@/constants';
import Image from 'next/image';

const categoryImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
  `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`;

interface ReorderCategoriesListProps {
  categories: any[];
  loading: boolean;
  selectedCategoryId: string | null;
  primaryCategoryId: string | null;
  isPrimarySelected: boolean;
  onSelectCategory: (categoryId: string | null) => void;
}

export function ReorderCategoriesList({ categories, loading, selectedCategoryId, primaryCategoryId, isPrimarySelected, onSelectCategory }: ReorderCategoriesListProps) {
  if (loading) return <div className="mx-4"><SkeletonTable rows={4} columns={1} /></div>;
  if (!categories || categories.length === 0) return <NothingHere height="150" width="150" text="No hay categorías disponibles" />;

  const itemClass = (isSelected: boolean) =>
    `flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-colors text-sm ${
      isSelected ? 'bg-primary/10 text-text-base font-semibold' : 'text-text-muted hover:bg-bg-subtle'
    }`;

  const listItems = categories
    .filter((category: any) => category.id !== primaryCategoryId)
    .map((category: any) => (
      <li key={category.id} className={itemClass(selectedCategoryId === category.id)} onClick={() => onSelectCategory(category.id)}>
        <Image
          loader={categoryImageLoader}
          src={category?.img || 'default.png'}
          alt="Icono de categoría"
          width={24}
          height={24}
          className="rounded-full"
        />
        <span>{category?.name}</span>
      </li>
    ));

  return (
    <div className="mx-4">
      <div className="bg-bg-content rounded-lg border border-bg-subtle overflow-hidden">
        <ul className="divide-y divide-bg-subtle">
          <li className={itemClass(isPrimarySelected)} onClick={() => onSelectCategory(null)}>
            <span>Principal</span>
          </li>
          {listItems}
        </ul>
      </div>
    </div>
  );
}
