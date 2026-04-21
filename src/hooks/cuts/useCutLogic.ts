'use client'
import useCutStore from '@/stores/cashdrawer/cutStore'
import { useEffect } from 'react'


export function useCutLogic(url: string, isShow: boolean) {
  const { loadCut, cut } = useCutStore()

  useEffect(() => {
      if (isShow){
        loadCut(url)
      }
  }, [loadCut, url, isShow])

  return { cut }
}
