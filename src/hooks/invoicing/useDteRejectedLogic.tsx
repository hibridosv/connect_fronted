'use client'
import useReverb from '@/hooks/useReverb'
import { getServices } from '@/services/services'
import useConfigStore from '@/stores/configStore'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

/**
 * Aviso de DTE rechazado (docs/pending/plan-diagnostico-dte.md de connect, fase 2).
 * billing emite DteRejectedEvent en {tenant}-channel-dte solo con el document_id (los canales son publicos);
 * aqui se pide el diagnostico a connect y el toast sale solo al usuario que cobro la orden.
 * Se monta en el Navbar para que llegue en cualquier pantalla; si pulse no estaba abierto, el rechazo sigue en Documentos.
 */
export function useDteRejectedLogic() {
  const { tenant, user } = useConfigStore()
  const { data, random } = useReverb(`${tenant?.id}-channel-dte`, 'DteRejectedEvent', !!tenant?.id)

  useEffect(() => {
    const documentId = data?.document_id
    if (!documentId || !user) return

    getServices(`electronic/documents/${documentId}/diagnosis`)
      .then((response: any) => {
        const document = response?.data?.data
        if (!document || document.charged_by !== user.id) return
        const cause = document.diagnosis?.find((item: any) => item.code !== 'unknown')?.cause
          ?? 'Hacienda rechazó el documento.'
        toast.error(
          <div className="text-sm">
            <p className="font-semibold">Documento rechazado {document.numero_control ?? ''}</p>
            <p>{cause}</p>
            <Link href="/invoicing/rejected" className="underline text-primary">Ver qué hacer</Link>
          </div>,
          { id: `dte-rejected-${documentId}`, duration: 15000 }
        )
      })
      .catch(() => {}) // es solo un aviso: si falla, el rechazo sigue en Documentos
  }, [data, random, user])
}
