import React from 'react'
import { cn } from '../../lib/utils'

const MIN_VALUE = 0
const MAX_VALUE = 100

export interface ProgressProps {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  label?: string
  hint?: boolean
  intervals?: boolean
  intervalCount?: number
  children?: React.ReactNode
  className?: string
}

export function Progress({
  value,
  size = 'sm',
  label,
  hint = false,
  intervals = false,
  intervalCount = 6,
  children,
  className,
}: ProgressProps) {
  // Indicator container classes - EXACT COPY from Vue version
  const heightClass = {
    sm: 'h-[2px]',
    md: 'h-1',
    lg: 'h-2',
    xl: 'h-3',
  }[size]

  const layoutClasses = intervals
    ? 'flex space-x-1'
    : 'relative bg-surface-gray-2'

  const indicatorContainerClasses = cn(
    'overflow-hidden rounded-xl',
    heightClass,
    layoutClasses,
    className
  )

  // Calculate filled intervals - EXACT COPY from Vue version
  const filledIntervalCount = (() => {
    if (value > MAX_VALUE) {
      return intervalCount
    }
    return Math.round((value / MAX_VALUE) * intervalCount)
  })()

  return (
    <div className="w-full space-y-[10px]">
      {(label || hint || children) && (
        <div className="flex items-baseline justify-between">
          {label ? (
            <span className="text-base font-medium text-ink-gray-8">
              {label}
            </span>
          ) : (
            <span></span>
          )}

          {(hint || children) && (
            <span className="self-end">
              {children || (
                <span className="text-base font-medium text-ink-gray-4">
                  {value}%
                </span>
              )}
            </span>
          )}
        </div>
      )}

      <div
        className={indicatorContainerClasses}
        aria-valuemax={MAX_VALUE}
        aria-valuemin={MIN_VALUE}
        aria-valuenow={value}
        role="progressbar"
      >
        {!intervals ? (
          // Continuous Progress Bar - EXACT COPY from Vue version
          <div
            className="h-full bg-surface-gray-7"
            style={{ width: `${value}%` }}
          />
        ) : (
          // Interval Progress Bar - EXACT COPY from Vue version
          Array.from({ length: intervalCount }, (_, index) => (
            <div
              key={index}
              className={cn(
                'h-full w-full',
                index < filledIntervalCount
                  ? 'bg-surface-gray-7'
                  : 'bg-surface-gray-2'
              )}
            />
          ))
        )}
      </div>
    </div>
  )
}

