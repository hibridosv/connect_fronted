'use client'
import useReverb from '@/hooks/useReverb'
import { isRestaurant } from '@/lib/utils'
import useConfigStore from '@/stores/configStore'
import restauranMenuStore from '@/stores/orders/restauranMenuStore'
import { useEffect } from 'react'

/**
 * Escucha los cambios del menu del restaurante hechos por otros usuarios y lo marca para recargar.
 * Se monta en el Navbar para que el menu guardado en el storage no quede desactualizado aunque el usuario no este en la pantalla de ordenes.
 * El usuario que hizo el cambio se ignora: manageRestaurantStore ya limpia su menu.
 */
export function useMenuSyncLogic() {
  const { tenant, user } = useConfigStore()
  const isEnabled = !!tenant?.id && isRestaurant(tenant?.system)
  const { data: menuEventData, random: menuRandom } = useReverb(`${tenant?.id}-channel-menu`, 'MenuUpdatedEvent', isEnabled)

  useEffect(() => {
    if (!menuEventData) return
    if (user && user.id == menuEventData?.userId) return
    restauranMenuStore.getState().invalidate()
  }, [menuEventData, menuRandom, user])
}
