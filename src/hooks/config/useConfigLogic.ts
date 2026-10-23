'use client'
import useReverb from '@/hooks/useReverb'
import useConfigStore, { MAX_CONFIG_RETRIES } from '@/stores/configStore'
import { useThemeStore } from '@/stores/themeStore'
import { useEffect } from 'react'

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000
const GLOBAL_REFRESH_SPREAD_MS = 30 * 1000

export function useConfigLogic() {
  const { configurations, loadConfig, reloadConfig, loading, _hasHydrated, tenant, error, retryCount, lastLoadedAt } = useConfigStore()
  const { setTheme } = useThemeStore()

  const hasTenant = !!tenant?.id
  const { random: payEvent } = useReverb(`${tenant?.id}-channel-pay`, 'PusherPayInvoiceEvent', hasTenant)
  const { random: tenantRefreshEvent } = useReverb(`${tenant?.id}-channel-config`, 'RefreshConfigEvent', hasTenant)
  const { random: globalRefreshEvent } = useReverb('channel-config', 'RefreshConfigEvent', hasTenant)

  useEffect(() => {
    if (!payEvent && !tenantRefreshEvent) return
    reloadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payEvent, tenantRefreshEvent])

  useEffect(() => {
    if (!globalRefreshEvent) return
    // Reparte las recargas para que no lleguen todas al mismo tiempo a los servidores
    const timeout = setTimeout(() => reloadConfig(), Math.random() * GLOBAL_REFRESH_SPREAD_MS)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalRefreshEvent])


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