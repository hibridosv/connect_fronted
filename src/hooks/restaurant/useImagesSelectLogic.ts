'use client'
import imagesStore from '@/stores/restaurant/imagesStore';
import { useEffect, useState } from 'react';

export function useImagesSelectLogic(currentPage: any, searchTerm: string) {
  const { loadImages } = imagesStore()
  const [searchTermNew, setSearchTermNew] = useState("");

  useEffect(() => {
        if (searchTerm != searchTermNew) {
          setSearchTermNew(searchTerm);
          loadImages(`restaurant/images?perPage=28&page=1${searchTerm}`)
        } else {
           loadImages(`restaurant/images?perPage=28${currentPage}${searchTerm}`)
        }
  }, [loadImages, currentPage, searchTerm, searchTermNew])

}
