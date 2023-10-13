import { ReactNode } from 'react'
import { toast, ToastOptions } from 'react-toastify'

export const DEFAULT_TOAST_STYLE: ToastOptions = {
  position: toast.POSITION.TOP_RIGHT,
  className: 'toastWallet',
  autoClose: 3000,
  theme: 'dark',
}

export const doToast = (
  text: string | ReactNode,
  design: ToastOptions = DEFAULT_TOAST_STYLE,
  id?: string,
  className: ToastOptions = DEFAULT_TOAST_STYLE,
) => {
  return toast(text, { ...className, ...design, toastId: id || String(text) })
}
