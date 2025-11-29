import React from 'react'
import { cn } from '../../lib/utils'
import { useId } from '../../lib/useId'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  size?: 'sm' | 'md'
  label?: string
  disabled?: boolean
  padding?: boolean
  checked?: boolean
  defaultChecked?: boolean
  id?: string
  onChange?: (checked: boolean) => void
}

export function Checkbox({
  size = 'sm',
  label,
  disabled = false,
  padding = false,
  checked,
  defaultChecked,
  id,
  onChange,
  className,
  ...props
}: CheckboxProps) {
  const htmlId = id || useId()

  // Label classes - EXACT COPY from Vue version
  const labelClasses = cn(
    {
      sm: 'text-base font-medium',
      md: 'text-lg font-medium',
    }[size],
    disabled ? 'text-ink-gray-4' : 'text-ink-gray-8',
    'select-none',
    'block'
  )

  // Input classes - EXACT COPY from Vue version
  const baseClasses = disabled
    ? 'border-outline-gray-2 bg-surface-menu-bar text-ink-gray-3'
    : 'border-outline-gray-4 text-ink-gray-9 hover:border-outline-gray-5 focus:ring-offset-0 focus:border-outline-gray-8 active:border-outline-gray-6 transition'

  const interactionClasses = disabled
    ? ''
    : padding
      ? 'focus:ring-0'
      : 'hover:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3 active:bg-surface-gray-2'

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  }[size]

  const inputClasses = cn(
    'rounded-sm mt-[1px] bg-surface-white',
    baseClasses,
    interactionClasses,
    sizeClasses,
    className
  )

  const containerClasses = cn(
    'inline-flex space-x-2 rounded transition',
    {
      'px-2.5 py-1.5': padding && size === 'sm',
      'px-3 py-2': padding && size === 'md',
      'focus-within:bg-surface-gray-2 focus-within:ring-2 focus-within:ring-outline-gray-3 hover:bg-surface-gray-3 active:bg-surface-gray-4':
        padding && !disabled,
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked)
  }

  return (
    <div className={containerClasses}>
      <input
        type="checkbox"
        className={inputClasses}
        disabled={disabled}
        id={htmlId}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={handleChange}
        {...props}
      />
      {label && (
        <label className={labelClasses} htmlFor={htmlId}>
          {label}
        </label>
      )}
    </div>
  )
}

