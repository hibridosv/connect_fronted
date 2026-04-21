'use client'
import useConfigStore from '@/stores/configStore'
import { useThemeStore } from '@/stores/themeStore'
import { useEffect, useRef } from 'react'

const MAX_CONFIG_RETRIES = 3

export function useConfigLogic() {
  const { isLoaded, loadConfig, loading, _hasHydrated, tenant, error } = useConfigStore()
  const { setTheme } = useThemeStore()
  const retryCount = useRef(0)

  useEffect(() => {
    if (_hasHydrated && !isLoaded && !loading && retryCount.current < MAX_CONFIG_RETRIES) {
      retryCount.current++
      loadConfig()
    }
  }, [_hasHydrated, isLoaded, loading, loadConfig])

  
  useEffect(() => {
    if (tenant) {
      if (tenant?.system === 1 || tenant?.system === 2) {
        setTheme('navy');
      } else {
        setTheme('green')
      }
    }
  }, [ setTheme, tenant ])

  return { configFailed: error && retryCount.current >= MAX_CONFIG_RETRIES }
}
