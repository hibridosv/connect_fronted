'use client'
import { getErrorMessage } from '@/lib/httpError'
import useToastMessageStore from '@/stores/toastMessageStore'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export function useToastMessage() {
  const { message, clearMessage, error, clearError, info, clearInfo } = useToastMessageStore()

  useEffect(() => {
    if (message) {
      toast.success(message?.data?.message || message.message)
      clearMessage()
    }
    if (error) {
      const text = getErrorMessage(error)
      if (text) toast.error(text)
      clearError()
    }
    if (info) {
      toast(info, { icon: 'ℹ️' })
      clearInfo()
    }

  }, [message, clearMessage, error, clearError, info, clearInfo])
}
