import React, { useState } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'
import { useId } from '../../lib/useId'

export interface SwitchProps {
  size?: 'sm' | 'md'
  label?: string
  description?: string
  disabled?: boolean
  icon?: string | React.ComponentType<{ className?: string }>
  labelClasses?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  onChange?: (checked: boolean) => void
}

export function Switch({
  size = 'sm',
  label = '',
  description = '',
  disabled = false,
  icon,
  labelClasses = '',
  checked: controlledChecked,
  defaultChecked,
  onCheckedChange,
  onChange,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked || false)
  const isControlled = controlledChecked !== undefined
  const checked = isControlled ? controlledChecked : internalChecked

  const id = useId()

  const handleCheckedChange = (newChecked: boolean) => {
    if (!isControlled) {
      setInternalChecked(newChecked)
    }
    onCheckedChange?.(newChecked)
    onChange?.(newChecked)
  }

  // Switch classes - EXACT COPY from Vue version
  const switchClasses = cn(
    'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-transparent transition-colors duration-100 ease-in-out items-center',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
    'disabled:cursor-not-allowed disabled:bg-surface-gray-3',
    checked
      ? 'bg-surface-gray-7 enabled:hover:bg-surface-gray-6 active:bg-surface-gray-5 group-hover:enabled:bg-surface-gray-6'
      : 'bg-surface-gray-4 enabled:hover:bg-gray-400 active:bg-gray-500 group-hover:enabled:bg-gray-400',
    size === 'md' ? 'h-5 w-8 border-[3px]' : 'h-4 w-[26px] border-2'
  )

  // Switch circle classes - EXACT COPY from Vue version
  const switchCircleClasses = cn(
    'pointer-events-none inline-block transform rounded-full bg-surface-white shadow ring-0 transition duration-100 ease-in-out',
    size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3',
    size === 'md'
      ? checked
        ? 'translate-x-3 rtl:-translate-x-3'
        : 'translate-x-0'
      : checked
        ? 'translate-x-2.5 rtl:-translate-x-2.5'
        : 'translate-x-0'
  )

  const iconClasses = 'mr-2 h-4 w-4 flex-shrink-0 text-ink-gray-6'

  // Switch label classes - EXACT COPY from Vue version
  const switchLabelClasses = cn(
    'font-medium leading-normal',
    disabled && !description
      ? 'text-ink-gray-4'
      : 'text-ink-gray-8',
    size === 'md' ? 'text-lg' : 'text-base',
    labelClasses
  )

  // Switch group classes - EXACT COPY from Vue version
  const switchGroupClasses = label
    ? cn(
        'flex justify-between',
        !description
          ? cn(
              'group items-center space-x-3 cursor-pointer rounded focus-visible:bg-surface-gray-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-outline-gray-3',
              disabled
                ? 'cursor-not-allowed'
                : 'hover:bg-surface-gray-3 active:bg-surface-gray-4',
              size === 'md' ? 'px-3 py-1.5' : 'px-2.5 py-1.5'
            )
          : cn(
              'items-start',
              size === 'md' ? 'px-3 space-x-3.5' : 'px-2.5 space-x-2.5'
            )
      )
    : undefined

  const renderIcon = () => {
    if (!icon) return null
    if (typeof icon === 'string') {
      return <FeatherIcon name={icon} className={iconClasses} aria-hidden="true" />
    }
    const IconComponent = icon
    return <IconComponent className={iconClasses} aria-hidden="true" />
  }

  const switchElement = (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      className={switchClasses}
    >
      <SwitchPrimitive.Thumb className={switchCircleClasses} />
    </SwitchPrimitive.Root>
  )

  if (!label) {
    return switchElement
  }

  return (
    <div className={switchGroupClasses}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center">
          {renderIcon()}
          <label className={switchLabelClasses} htmlFor={id}>
            {label}
          </label>
        </div>
        {description && (
          <span className="max-w-xs text-p-sm text-ink-gray-7">
            {description}
          </span>
        )}
      </div>
      {switchElement}
    </div>
  )
}

