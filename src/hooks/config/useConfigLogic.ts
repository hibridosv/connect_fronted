'use client'
import { MAX_CONFIG_RETRIES } from '@/stores/configStore'
import useConfigStore from '@/stores/configStore'
import { useThemeStore } from '@/stores/themeStore'
import { useEffect } from 'react'

export function useConfigLogic() {
  const { configurations, loadConfig, loading, _hasHydrated, tenant, error, retryCount } = useConfigStore()
  const { setTheme } = useThemeStore()

  useEffect(() => {
    if (_hasHydrated && configurations === null && !loading) {
      loadConfig()
    }
  }, [_hasHydrated, configurations, loading, loadConfig])

  useEffect(() => {
    if (tenant) {
      if (tenant?.system === 1 || tenant?.system === 2) {
        setTheme('navy');
      } else {
        setTheme('green')
      }
    }
  }, [setTheme, tenant])

  return { configFailed: error && retryCount >= MAX_CONFIG_RETRIES }
}
