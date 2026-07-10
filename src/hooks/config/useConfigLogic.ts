'use client'
import useConfigStore, { MAX_CONFIG_RETRIES } from '@/stores/configStore'
import { useThemeStore } from '@/stores/themeStore'
import { useEffect } from 'react'
import useReverb from '../useReverb'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function useConfigLogic() {
  const { configurations, loadConfig, reloadConfig, loading, _hasHydrated, tenant, error, retryCount, lastLoadedAt } = useConfigStore()
  const { setTheme } = useThemeStore()
  
  
  const { data: pusherEventData, random: pusherRandom } = useReverb(`${tenant?.id}-channel-notify`, 'ReverbNotify', true);

  useEffect(() => {
    if (!pusherEventData) return;
        console.log('pusherEventData', pusherEventData);
   }, [pusherEventData, pusherRandom]);


  useEffect(() => {
    if (!_hasHydrated || loading) return

    const isExpired = !lastLoadedAt || Date.now() - lastLoadedAt >= TWENTY_FOUR_HOURS_MS

    if (isExpired) {
      reloadConfig()
    } else if (configurations === null) {
      loadConfig()
    }
  }, [_hasHydrated, configurations, loading, lastLoadedAt, loadConfig, reloadConfig])

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