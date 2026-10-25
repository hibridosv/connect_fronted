'use client'
import imagesStore from '@/stores/restaurant/imagesStore';
import { useEffect, useRef } from 'react';

export function useImagesSelectLogic(currentPage: any, searchTerm: string) {
  const { loadImages } = imagesStore()
  // ultima busqueda pedida; es un ref (no estado) para no volver a disparar el efecto
  const lastQuery = useRef<string | null>(null);

  useEffect(() => {
        const query = searchTerm;
        // busqueda nueva: vuelve a la pagina 1
        const page = query !== lastQuery.current ? "&page=1" : currentPage;
        lastQuery.current = query;
        loadImages(`restaurant/images?perPage=28${page}${searchTerm}`)
  }, [loadImages, currentPage, searchTerm])

}
