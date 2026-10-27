'use client'
import { DashboardFormat, DashboardRangeValues, DashboardWidget } from '@/interfaces/dashboard'
import { formatDateAsDMY } from '@/lib/date-formats'
import { getCountryProperty } from '@/lib/utils'
import useReverb from '@/hooks/useReverb'
import useConfigStore from '@/stores/configStore'
import useDashBoardStore from '@/stores/dashboardStore'
import { DateTime } from 'luxon'
import { useCallback, useEffect, useMemo, useRef } from 'react'

const REFRESH_MS = 120000
const AI_POLL_MS = 15000

export const rangePresets = [
  { key: 'today', label: 'Hoy' },
  { key: 'yesterday', label: 'Ayer' },
  { key: 'week', label: '7 días' },
  { key: 'month', label: 'Este mes' },
  { key: 'last_month', label: 'Mes anterior' },
  { key: 'custom', label: 'Personalizado' },
]

export const buildRange = (preset: string, initialDate = '', finalDate = ''): DashboardRangeValues => {
  const today = DateTime.now()
  const iso = (date: DateTime) => date.toISODate() as string
  switch (preset) {
    case 'yesterday': return { preset, option: '1', initialDate: iso(today.minus({ days: 1 })), finalDate: '' }
    case 'week': return { preset, option: '2', initialDate: iso(today.minus({ days: 6 })), finalDate: iso(today) }
    case 'month': return { preset, option: '2', initialDate: iso(today.startOf('month')), finalDate: iso(today) }
    case 'last_month': {
      const lastMonth = today.minus({ months: 1 })
      return { preset, option: '2', initialDate: iso(lastMonth.startOf('month')), finalDate: iso(lastMonth.endOf('month')) }
    }
    case 'custom': return { preset, option: '2', initialDate: initialDate || iso(today), finalDate: finalDate || initialDate || iso(today) }
    default: return { preset: 'today', option: '1', initialDate: iso(today), finalDate: '' }
  }
}

export const formatDashboardValue = (value: any, format: DashboardFormat, currency = '$'): string => {
  if (value === null || value === undefined || value === '') return '—'
  if (format === 'date') return formatDateAsDMY(`${value}T00:00:00`)
  const number = Number(value) || 0
  if (format === 'percent') return `${number.toFixed(2)}%`
  if (format === 'money') return `${currency}${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return number.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

export function useDashboardWidgetsLogic() {
  const { widgets, layout, range, period, data, loadingKeys, loading, loadWidgets, loadData, loadInsights, loadAi, setRange, ai } = useDashBoardStore()
  const { system, tenant } = useConfigStore()
  const currency = system ? getCountryProperty(parseInt(system.country)).currency : '$'

  const visibleWidgets = useMemo(() => layout
    .map((key) => widgets.find((widget) => widget.key === key))
    .filter((widget): widget is DashboardWidget => !!widget), [layout, widgets])

  const currentRange = range ?? buildRange('today')
  const includesToday = currentRange.option === '1'
    ? currentRange.initialDate === DateTime.now().toISODate()
    : currentRange.finalDate >= (DateTime.now().toISODate() as string)

  useEffect(() => {
    loadWidgets()
  }, [loadWidgets])

  const showsInsights = visibleWidgets.some((widget) => widget.type === 'insights')
  const showsAi = visibleWidgets.some((widget) => widget.type === 'ai')

  const refresh = useCallback(() => {
    loadData(visibleWidgets.map((widget) => widget.key), currentRange)
    if (showsInsights) loadInsights()
    if (showsAi) loadAi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleWidgets, showsInsights, showsAi, currentRange.preset, currentRange.initialDate, currentRange.finalDate, loadData, loadInsights, loadAi])

  // connect avisa por Reverb cuando n8n termina un analisis de IA: trae el resumen y sus recomendaciones
  const { random: aiEvent } = useReverb(`${tenant?.id}-channel-dashboard`, 'DashboardEvent', showsAi && !!tenant?.id)
  useEffect(() => {
    if (!aiEvent) return
    loadAi()
    if (showsInsights) loadInsights()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiEvent])

  // por si Reverb no llega: mientras haya un analisis generandose se consulta cada 15 segundos,
  // y al terminar se traen sus recomendaciones
  const aiPending = ai?.last?.status === 'pending'
  const wasPending = useRef(false)
  useEffect(() => {
    if (wasPending.current && !aiPending && showsInsights) loadInsights()
    wasPending.current = aiPending
    if (!aiPending || !showsAi) return
    const interval = setInterval(loadAi, AI_POLL_MS)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPending, showsAi])

  useEffect(() => {
    refresh()
  }, [refresh])

  // con un rango que incluye hoy los datos se actualizan solos (el backend los guarda 2 minutos)
  useEffect(() => {
    if (!includesToday || visibleWidgets.length === 0) return
    const interval = setInterval(refresh, REFRESH_MS)
    return () => clearInterval(interval)
  }, [includesToday, refresh, visibleWidgets.length])

  return {
    visibleWidgets,
    data,
    period,
    loadingKeys,
    loading,
    currency,
    range: currentRange,
    includesToday,
    setRange,
    refresh,
  }
}
