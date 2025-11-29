import React from 'react'
import { cn } from '../../lib/utils'

export type BadgeTheme = 'gray' | 'blue' | 'green' | 'orange' | 'red'
export type BadgeSize = 'sm' | 'md' | 'lg'
export type BadgeVariant = 'solid' | 'subtle' | 'outline' | 'ghost'

export interface BadgeProps {
  theme?: BadgeTheme
  size?: BadgeSize
  variant?: BadgeVariant
  label?: string | number | { toString(): string }
  children?: React.ReactNode
  className?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export function Badge({
  theme = 'gray',
  size = 'md',
  variant = 'subtle',
  label,
  children,
  className,
  prefix,
  suffix,
}: BadgeProps) {
  // Variant classes - EXACT COPY from Vue version
  const solidClasses = {
    gray: 'text-ink-white bg-surface-gray-7',
    blue: 'text-ink-blue-1 bg-surface-blue-2',
    green: 'text-ink-green-1 bg-surface-green-3',
    orange: 'text-ink-amber-1 bg-surface-amber-2',
    red: 'text-ink-red-1 bg-surface-red-4',
  }[theme]

  const subtleClasses = {
    gray: 'text-ink-gray-6 bg-surface-gray-2',
    blue: 'text-ink-blue-2 bg-surface-blue-1',
    green: 'text-ink-green-3 bg-surface-green-2',
    orange: 'text-ink-amber-3 bg-surface-amber-1',
    red: 'text-ink-red-4 bg-surface-red-1',
  }[theme]

  const outlineClasses = {
    gray: 'text-ink-gray-6 bg-transparent border border-outline-gray-1',
    blue: 'text-ink-blue-2 bg-transparent border border-outline-blue-1',
    green: 'text-ink-green-3 bg-transparent border border-outline-green-2',
    orange: 'text-ink-amber-3 bg-transparent border border-outline-amber-2',
    red: 'text-ink-red-4 bg-transparent border border-outline-red-2',
  }[theme]

  const ghostClasses = {
    gray: 'text-ink-gray-6 bg-transparent',
    blue: 'text-ink-blue-2 bg-transparent',
    green: 'text-ink-green-3 bg-transparent',
    orange: 'text-ink-amber-3 bg-transparent',
    red: 'text-ink-red-4 bg-transparent',
  }[theme]

  const variantClasses = {
    subtle: subtleClasses,
    solid: solidClasses,
    outline: outlineClasses,
    ghost: ghostClasses,
  }[variant]

  // Size classes - EXACT COPY from Vue version
  const sizeClasses = {
    sm: 'h-4 text-xs px-1.5',
    md: 'h-5 text-xs px-1.5',
    lg: 'h-6 text-sm px-2',
  }[size]

  const badgeClasses = cn(
    'inline-flex select-none items-center gap-1 rounded-full whitespace-nowrap',
    variantClasses,
    sizeClasses,
    className
  )

  const prefixMaxHeight = size === 'lg' ? 'max-h-6' : 'max-h-4'
  const suffixMaxHeight = size === 'lg' ? 'max-h-6' : 'max-h-4'

  return (
    <div className={badgeClasses}>
      {prefix && (
        <div className={prefixMaxHeight}>
          {prefix}
        </div>
      )}
      {children || (label?.toString() ?? '')}
      {suffix && (
        <div className={suffixMaxHeight}>
          {suffix}
        </div>
      )}
    </div>
  )
}

