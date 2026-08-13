'use client'
import useReverb from '@/hooks/useReverb'
import useConfigStore, { MAX_CONFIG_RETRIES } from '@/stores/configStore'
import { useThemeStore } from '@/stores/themeStore'
import { useEffect, useRef } from 'react'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000

export function useConfigLogic() {
  const { configurations, loadConfig, reloadConfig, loading, _hasHydrated, tenant, error, retryCount, lastLoadedAt } = useConfigStore()
  const { setTheme } = useThemeStore()

  const { random: pusherEvent } = useReverb(`${tenant?.id}-channel-pay`, 'PusherPayInvoiceEvent', true)
  const isFirstPusherEvent = useRef(true)

  useEffect(() => {
    if (isFirstPusherEvent.current) {
      isFirstPusherEvent.current = false
      return
    }
    if (tenant?.id) {
      console.log('PusherPayInvoiceEvent received, reloading config...')
      reloadConfig()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pusherEvent])


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