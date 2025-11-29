import * as ToastPrimitive from '@radix-ui/react-toast'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'
import { CircleCheckIcon } from './circle-check-icon'

export interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  message?: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  icon?: React.ComponentType<{ className?: string }>
  closable?: boolean
  action?: {
    label: string
    altText?: string
    onClick: () => void
  }
  onAction?: () => void
}

export function Toast({
  open,
  onOpenChange,
  message,
  type = 'info',
  duration,
  icon: Icon,
  closable = true,
  action,
  onAction,
}: ToastProps) {
  const handleAction = () => {
    action?.onClick?.()
    onAction?.()
  }

  const renderIcon = () => {
    if (Icon) {
      return <Icon className="flex-shrink-0 size-4" />
    }
    if (type === 'success') {
      return <CircleCheckIcon className="flex-shrink-0 size-4 text-ink-green-2" />
    }
    if (type === 'warning') {
      return <FeatherIcon name="alert-triangle" className="flex-shrink-0 size-4 text-ink-amber-2" />
    }
    if (type === 'error') {
      return <FeatherIcon name="x-circle" className="flex-shrink-0 size-4 text-ink-red-2" />
    }
    return <FeatherIcon name="info" className="flex-shrink-0 size-4 text-ink-blue-2" />
  }

  return (
    <ToastPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={closable ? duration : 0}
      className={cn(
        'toast-root-animatable',
        'bg-surface-gray-6 border-none rounded-md px-4 py-1.5 shadow-lg flex items-center justify-between gap-3 min-w-[280px] max-w-[400px] pointer-events-auto list-none'
      )}
    >
      <div className="flex items-center gap-2 flex-grow overflow-hidden">
        <div>{renderIcon()}</div>
        <div className="flex flex-col flex-grow overflow-hidden">
          {message && (
            <ToastPrimitive.Description
              className="text-p-sm break-words text-ink-white"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 h-7">
        {action && (
          <ToastPrimitive.Action
            altText={action.altText || action.label}
            onClick={handleAction}
            className="flex-shrink-0 rounded px-2 py-1 text-sm text-ink-blue-link hover:text-ink-gray-3 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-4"
          >
            {action.label}
          </ToastPrimitive.Action>
        )}
        {closable && (
          <ToastPrimitive.Close className="flex-shrink-0 rounded p-1 text-ink-white hover:text-ink-gray-3 focus:outline-none focus-visible:ring focus-visible:ring-outline-gray-4">
            <FeatherIcon name="x" className="size-4" />
          </ToastPrimitive.Close>
        )}
      </div>
    </ToastPrimitive.Root>
  )
}

