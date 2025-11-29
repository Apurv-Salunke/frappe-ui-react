import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'

export type AlertTheme = 'yellow' | 'blue' | 'red' | 'green'

export interface AlertProps {
  title: string
  theme?: AlertTheme
  variant?: 'subtle' | 'outline'
  description?: string
  dismissable?: boolean
  children?: React.ReactNode
  icon?: React.ReactNode
  footer?: React.ReactNode
  onDismiss?: () => void
}

export function Alert({
  title,
  theme,
  variant = 'subtle',
  description,
  dismissable = true,
  children,
  icon,
  footer,
  onDismiss,
}: AlertProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  // Classes - EXACT COPY from Vue version
  const subtleBgs = {
    yellow: 'bg-surface-amber-2',
    blue: 'bg-surface-blue-2',
    red: 'bg-surface-red-2',
    green: 'bg-surface-green-2',
  }

  const classes = cn(
    'grid grid-cols-[auto_1fr_auto] gap-3 rounded-md px-4 py-3.5 text-base items-start',
    variant === 'outline'
      ? 'border border-outline-gray-3'
      : theme
        ? subtleBgs[theme]
        : 'bg-surface-gray-2'
  )

  // Icon mapping - EXACT COPY from Vue version
  const iconData = theme
    ? {
        yellow: { name: 'alert-triangle', css: 'text-ink-amber-3' },
        blue: { name: 'info', css: 'text-ink-blue-3' },
        red: { name: 'x-circle', css: 'text-ink-red-3' },
        green: { name: 'check-circle', css: 'text-ink-green-3' },
      }[theme]
    : null

  const handleDismiss = () => {
    setVisible(false)
    onDismiss?.()
  }

  const hasIcon = icon || iconData
  const hasDescription = description || children

  return (
    <div role="alert" className={classes}>
      {icon ? (
        <div className="size-4">{icon}</div>
      ) : iconData ? (
        <FeatherIcon
          name={iconData.name}
          className={cn('size-4', iconData.css)}
        />
      ) : null}

      <div className={cn('grid gap-2', !hasIcon && 'col-span-2')}>
        <span className="text-ink-gray-9">{title}</span>

        {hasDescription && (
          <div>
            {description && (
              <p className="text-ink-gray-6 prose-sm">{description}</p>
            )}
            {children}
          </div>
        )}
      </div>

      {dismissable && (
        <button onClick={handleDismiss} type="button">
          <FeatherIcon name="x" className="size-4" />
        </button>
      )}
      {footer}
    </div>
  )
}

