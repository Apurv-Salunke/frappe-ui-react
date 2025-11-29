import * as ToastPrimitive from '@radix-ui/react-toast'
import { ToastProvider as ToastContextProvider, Toasts } from './toast-context'

export interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastContextProvider>
      <ToastPrimitive.Provider swipeDirection="down">
        {children}
        <Toasts />
        <ToastPrimitive.Viewport className="fixed bottom-0 items-end right-0 flex flex-col p-5 gap-[10px] w-auto max-w-full z-[2147483647] outline-none pointer-events-none" />
      </ToastPrimitive.Provider>
    </ToastContextProvider>
  )
}

