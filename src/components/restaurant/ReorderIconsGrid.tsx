'use client';
import { NothingHere } from '@/components/NothingHere';
import { RestaurantMenuSkeleton } from '@/components/skeleton/RestaurantMenuSkeleton';
import { URL } from '@/constants';
import Image from 'next/image';
import { RefObject } from 'react';

const imageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) =>
  `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`;

interface ReorderIconsGridProps {
  items: any[];
  loading: boolean;
  isDragging: boolean;
  dragSourceIndex: RefObject<number | null>;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
}

export function ReorderIconsGrid({ items, loading, isDragging, dragSourceIndex, onDragStart, onDragEnter, onDragEnd }: ReorderIconsGridProps) {
  if (loading) return <RestaurantMenuSkeleton imageQuantity={20} />;
  if (items.length === 0) return <NothingHere text="No hay iconos para mostrar" />;

  const listItems = items.map((record: any, index: number) => {
    const isProduct = record.icon_type === 1;
    const label = isProduct ? record?.product?.description : record?.category?.name;
    const imageSrc = isProduct ? record?.product?.restaurant?.image : record?.category?.img;
    const isBeingDragged = dragSourceIndex.current === index;

    return (
      <div
        key={record.id}
        draggable
        onDragStart={() => onDragStart(index)}
        onDragEnter={() => onDragEnter(index)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        title={label}
        className={`cursor-grab active:cursor-grabbing transition-opacity duration-150 ${isBeingDragged ? 'opacity-40' : 'opacity-100'}`}
      >
        <div className="relative w-[104px] overflow-hidden rounded-xl bg-bg-content shadow-md select-none">
          <div className="relative h-[104px] w-[104px] overflow-hidden">
            {imageSrc && (
              <Image
                loader={imageLoader}
                src={imageSrc}
                alt={label || 'Icono'}
                width={104}
                height={104}
                className="h-full w-full object-cover pointer-events-none"
              />
            )}
            <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/30">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
              </svg>
            </div>
          </div>
          <div className={`flex h-10 items-center justify-center px-1.5 ${isProduct ? 'bg-bg-subtle/80' : 'bg-slate-300'}`}>
            <p className={`w-full text-center text-[12px] font-semibold uppercase leading-tight line-clamp-2 ${isProduct ? 'text-text-base' : 'text-black'}`}>
              {label}
            </p>
          </div>
          {!isProduct && (
            <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/90 shadow-sm">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className={`flex flex-wrap justify-center gap-3 ${isDragging ? 'cursor-grabbing' : ''}`}>
      {listItems}
    </div>
  );
}
