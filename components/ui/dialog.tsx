import React, { useState, useCallback, useMemo } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '../../lib/utils'
import { Button, type ButtonProps } from './button'
import { FeatherIcon } from './feather-icon'

export type DialogIcon = {
  name: string
  appearance?: 'warning' | 'info' | 'danger' | 'success'
}

export type DialogSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'

export type DialogActionContext = {
  close: () => void
}

export type DialogAction = Omit<ButtonProps, 'onClick'> & {
  onClick?: (context: DialogActionContext) => void | Promise<void>
}

export type DialogOptions = {
  title?: string
  message?: string
  size?: DialogSize
  icon?: DialogIcon | string
  actions?: Array<DialogAction>
  position?: 'top' | 'center'
  paddingTop?: string | number
}

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options?: DialogOptions
  disableOutsideClickToClose?: boolean
  children?: React.ReactNode
  onClose?: () => void
  onAfterLeave?: () => void
}

export function Dialog({
  open,
  onOpenChange,
  options = {},
  disableOutsideClickToClose = false,
  children,
  onClose,
  onAfterLeave,
}: DialogProps) {
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen)
      if (!newOpen) {
        onClose?.()
        // Call onAfterLeave after animation completes
        setTimeout(() => {
          onAfterLeave?.()
        }, 150)
      }
    },
    [onOpenChange, onClose, onAfterLeave]
  )

  const close = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  // Process icon
  const icon = useMemo(() => {
    if (!options?.icon) return null
    let iconData = options.icon
    if (typeof iconData === 'string') {
      iconData = { name: iconData }
    }
    return iconData as DialogIcon
  }, [options?.icon])

  // Process actions with loading state
  const actions = useMemo((): Array<DialogAction & { loading: boolean }> => {
    if (!options.actions?.length) return []

    return options.actions.map((action, index) => {
      const actionId = `action-${index}`
      return {
        ...action,
        loading: actionLoading[actionId] || false,
        onClick: async () => {
          if (!action.onClick) {
            close()
            return
          }

          setActionLoading((prev) => ({ ...prev, [actionId]: true }))
          try {
            const context: DialogActionContext = { close }
            await action.onClick(context)
          } finally {
            setActionLoading((prev) => ({ ...prev, [actionId]: false }))
          }
        },
      }
    })
  }, [options.actions, actionLoading, close])

  // Dialog position classes - EXACT COPY from Vue version
  const dialogPositionClasses = useMemo(() => {
    if (options?.paddingTop) return ''
    const position = options?.position || 'center'
    const classMap: Record<string, string> = {
      center: 'justify-center',
      top: 'pt-[20vh]',
    }
    return classMap[position]
  }, [options?.position, options?.paddingTop])

  const dialogPositionStyles = useMemo(() => {
    if (options?.paddingTop) {
      return { paddingTop: options.paddingTop }
    }
    return {}
  }, [options?.paddingTop])

  // Icon background classes - EXACT COPY from Vue version
  const dialogIconBgClasses = useMemo(() => {
    const appearance = icon?.appearance
    if (!appearance) return 'bg-surface-gray-2'
    const classMap: Record<string, string> = {
      warning: 'bg-surface-amber-2',
      info: 'bg-surface-blue-2',
      danger: 'bg-surface-red-2',
      success: 'bg-surface-green-2',
    }
    return classMap[appearance]
  }, [icon?.appearance])

  const dialogIconClasses = useMemo(() => {
    const appearance = icon?.appearance
    if (!appearance) return 'text-ink-gray-5'
    const classMap: Record<string, string> = {
      warning: 'text-ink-amber-3',
      info: 'text-ink-blue-3',
      danger: 'text-ink-red-4',
      success: 'text-ink-green-3',
    }
    return classMap[appearance]
  }, [icon?.appearance])

  // Size classes - EXACT COPY from Vue version
  const sizeClasses = cn({
    'max-w-7xl': options.size === '7xl',
    'max-w-6xl': options.size === '6xl',
    'max-w-5xl': options.size === '5xl',
    'max-w-4xl': options.size === '4xl',
    'max-w-3xl': options.size === '3xl',
    'max-w-2xl': options.size === '2xl',
    'max-w-xl': options.size === 'xl',
    'max-w-lg': options.size === 'lg' || !options.size,
    'max-w-md': options.size === 'md',
    'max-w-sm': options.size === 'sm',
    'max-w-xs': options.size === 'xs',
  })

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 bg-black-overlay-200 backdrop-filter backdrop-blur-[12px] overflow-y-auto dialog-overlay outline-none data-[state=open]:animate-dialog-overlay-in data-[state=closed]:animate-dialog-overlay-out"
          data-dialog={options.title}
        >
          <div
            className={cn(
              'flex min-h-screen flex-col items-center px-4 py-4 text-center',
              dialogPositionClasses
            )}
            style={dialogPositionStyles}
          >
            <DialogPrimitive.Content
              className={cn(
                'my-8 inline-block w-full transform overflow-hidden rounded-xl bg-surface-modal text-left align-middle shadow-xl dialog-content focus-visible:outline-none data-[state=open]:animate-dialog-content-in data-[state=closed]:animate-dialog-content-out',
                sizeClasses
              )}
              onEscapeKeyDown={(e) => {
                if (disableOutsideClickToClose) {
                  e.preventDefault()
                }
              }}
              onInteractOutside={(e) => {
                if (disableOutsideClickToClose) {
                  e.preventDefault()
                }
              }}
            >
            {children ? (
              children
            ) : (
              <>
                <div className="bg-surface-modal px-4 pb-6 pt-5 sm:px-6">
                  <div className="flex">
                    <div className="w-full flex-1">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {icon && (
                            <div
                              className={cn(
                                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
                                dialogIconBgClasses
                              )}
                            >
                              <FeatherIcon
                                name={icon.name}
                                className={cn('h-4 w-4', dialogIconClasses)}
                                aria-hidden="true"
                              />
                            </div>
                          )}
                          <DialogPrimitive.Title asChild>
                            <h3 className="text-2xl font-semibold leading-6 text-ink-gray-9">
                              {options.title || 'Untitled'}
                            </h3>
                          </DialogPrimitive.Title>
                        </div>
                        <DialogPrimitive.Close asChild>
                          <Button variant="ghost" onClick={close}>
                            <FeatherIcon name="x" className="h-4 w-4 text-ink-gray-9" />
                          </Button>
                        </DialogPrimitive.Close>
                      </div>

                      {options.message && (
                        <DialogPrimitive.Description asChild>
                          <p className="text-p-base text-ink-gray-7">
                            {options.message}
                          </p>
                        </DialogPrimitive.Description>
                      )}
                    </div>
                  </div>
                </div>
                {(actions.length > 0 || options.actions) && (
                  <div className="px-4 pb-7 pt-4 sm:px-6">
                    <div className="space-y-2">
                      {actions.map((action, index) => {
                        const { onClick: _onClick, loading: actionLoading, label, ...buttonProps } = action
                        return (
                          <Button
                            key={index}
                            className="w-full"
                            disabled={buttonProps.disabled || actionLoading}
                            loading={actionLoading}
                            {...buttonProps}
                          >
                            {label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
            </DialogPrimitive.Content>
          </div>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// Export sub-components for flexible composition
export const DialogRoot = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogOverlay = DialogPrimitive.Overlay
export const DialogContent = DialogPrimitive.Content
export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description
export const DialogClose = DialogPrimitive.Close

