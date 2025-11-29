import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import DOMPurify from 'dompurify'
import { Toast } from './toast'
import { LoadingIndicator } from './loading-indicator'

export interface ToastOptions {
  id?: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  icon?: React.ComponentType<{ className?: string }>
  closable?: boolean
  action?: {
    label: string
    altText?: string
    onClick: () => void
  }
}

export interface ToastItem extends ToastOptions {
  id: string
  open: boolean
}

export interface ToastPromiseOptions<TData = any, TError = any> {
  loading: string
  success: string | ((data: TData) => string)
  error: string | ((error: TError) => string)
  successDuration?: number
  errorDuration?: number
  duration?: number
  successAction?: {
    label: string
    altText?: string
    onClick: () => void
  }
  errorAction?: {
    label: string
    altText?: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toasts: ToastItem[]
  createToast: (options: ToastOptions) => string
  removeToast: (id: string) => void
  removeAllToasts: () => void
  updateToast: (id: string, updates: Partial<Omit<ToastItem, 'id'>>) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

let toastIdCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const createToast = useCallback((options: ToastOptions): string => {
    const id = options.id || `toast-${toastIdCounter++}`
    const durationInMs = options.duration != null ? options.duration * 1000 : 5000

    const sanitizedMessage = DOMPurify.sanitize(options.message, {
      ALLOWED_TAGS: ['a', 'em', 'strong', 'i', 'b', 'u'],
    })

    const toastItem: ToastItem = {
      id,
      open: true,
      message: sanitizedMessage,
      type: options.type || 'info',
      duration: durationInMs,
      action: options.action,
      icon: options.icon,
      closable: options.closable ?? true,
    }

    setToasts((prev) => [...prev, toastItem])
    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const updateToast = useCallback((id: string, updates: Partial<Omit<ToastItem, 'id'>>) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, open: true } : t))
    )
  }, [])

  return (
    <ToastContext.Provider
      value={{ toasts, createToast, removeToast, removeAllToasts, updateToast }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function Toasts() {
  const context = useContext(ToastContext)
  if (!context) return null

  const { toasts, removeToast } = context

  const handleOpenChange = (id: string, isOpen: boolean) => {
    if (!isOpen) {
      removeToast(id)
    }
  }

  const handleAction = (id: string) => {
    removeToast(id)
  }

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          open={toast.open}
          onOpenChange={(isOpen) => handleOpenChange(toast.id, isOpen)}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          icon={toast.icon}
          closable={toast.closable}
          action={toast.action}
          onAction={() => handleAction(toast.id)}
        />
      ))}
    </>
  )
}

// Toast API - These are placeholders that will throw errors if used outside provider
// Use useToastAPI() hook instead
export const toast = {
  create: (_options: ToastOptions): string => {
    throw new Error('toast.create must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  remove: (_id: string) => {
    throw new Error('toast.remove must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  removeAll: () => {
    throw new Error('toast.removeAll must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  promise: async <TData = any, TError = any>(
    _promiseToResolve: Promise<TData>,
    _options: ToastPromiseOptions<TData, TError>
  ): Promise<TData> => {
    throw new Error('toast.promise must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  success: (_message: string, _options: Omit<ToastOptions, 'message' | 'type'> = {}): string => {
    throw new Error('toast.success must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  error: (_message: string, _options: Omit<ToastOptions, 'message' | 'type'> = {}): string => {
    throw new Error('toast.error must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  warning: (_message: string, _options: Omit<ToastOptions, 'message' | 'type'> = {}): string => {
    throw new Error('toast.warning must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
  info: (_message: string, _options: Omit<ToastOptions, 'message' | 'type'> = {}): string => {
    throw new Error('toast.info must be called within ToastProvider. Use useToastAPI() hook instead.')
  },
}

// Create a hook that provides the toast API
export function useToastAPI() {
  const { createToast, removeToast, removeAllToasts, updateToast } = useToast()

  return {
    create: createToast,
    remove: removeToast,
    removeAll: removeAllToasts,
    promise: async <TData = any, TError = any>(
      promiseToResolve: Promise<TData>,
      options: ToastPromiseOptions<TData, TError>
    ): Promise<TData> => {
      const loadingDurationInSeconds = options.duration ?? 0

      const toastId = createToast({
        message: options.loading,
        type: 'info',
        icon: () => <LoadingIndicator className="text-ink-white" />,
        duration: loadingDurationInSeconds,
        closable: false,
      })

      try {
        const data = await promiseToResolve
        const successMessage =
          typeof options.success === 'function' ? options.success(data) : options.success

        const successToastDurationInSeconds = options.successDuration ?? options.duration ?? 5

        updateToast(toastId, {
          message: successMessage,
          type: 'success',
          duration: successToastDurationInSeconds * 1000,
          icon: undefined,
          closable: true,
          action: options.successAction,
        })
        return data
      } catch (error) {
        const errorMessage =
          typeof options.error === 'function' ? options.error(error as TError) : options.error

        const errorToastDurationInSeconds = options.errorDuration ?? options.duration ?? 5

        updateToast(toastId, {
          message: errorMessage,
          type: 'error',
          duration: errorToastDurationInSeconds * 1000,
          icon: undefined,
          closable: true,
          action: options.errorAction,
        })
        throw error
      }
    },
    success: (message: string, options: Omit<ToastOptions, 'message' | 'type'> = {}) =>
      createToast({ message, type: 'success', ...options }),
    error: (message: string, options: Omit<ToastOptions, 'message' | 'type'> = {}) =>
      createToast({ message, type: 'error', ...options }),
    warning: (message: string, options: Omit<ToastOptions, 'message' | 'type'> = {}) =>
      createToast({ message, type: 'warning', ...options }),
    info: (message: string, options: Omit<ToastOptions, 'message' | 'type'> = {}) =>
      createToast({ message, type: 'info', ...options }),
  }
}

