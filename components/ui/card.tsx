import React from 'react'
import { cn } from '../../lib/utils'
import { LoadingIndicator } from './loading-indicator'

export interface CardProps {
  title?: string
  subtitle?: string
  loading?: boolean
  children?: React.ReactNode
  className?: string
  actions?: React.ReactNode
  actionsLeft?: React.ReactNode
}

export function Card({
  title,
  subtitle,
  loading = false,
  children,
  className,
  actions,
  actionsLeft,
}: CardProps) {
  return (
    <div className={cn(
      'flex flex-col rounded-lg border bg-white px-6 py-5 shadow',
      className
    )}>
      {(title || actions || actionsLeft) && (
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            {actionsLeft && (
              <div className="flex items-center space-x-2">
                {actionsLeft}
              </div>
            )}
            {title && (
              <h2 className="text-xl font-semibold">{title}</h2>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}
      {subtitle && (
        <p className="mt-1.5 text-base text-gray-600">
          {subtitle}
        </p>
      )}
      {loading ? (
        <div className="mt-4 flex flex-auto flex-col items-center justify-center rounded-md">
          <div className="flex items-center text-base text-ink-gray-4">
            <LoadingIndicator className="-ml-1 mr-2 h-3 w-3" />
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        children && (
          <div className="mt-4 flex-auto overflow-auto">
            {children}
          </div>
        )
      )}
    </div>
  )
}

