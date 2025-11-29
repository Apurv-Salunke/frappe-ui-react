import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'

export type SelectOption =
  | string
  | {
      label: string
      value: string
      disabled?: boolean
    }

export interface SelectProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'subtle' | 'outline' | 'ghost'
  placeholder?: string
  disabled?: boolean
  id?: string
  value?: string | number
  defaultValue?: string | number
  options?: SelectOption[]
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  prefix?: React.ReactNode
}

export function Select({
  size = 'sm',
  variant = 'subtle',
  placeholder = 'Select option',
  disabled = false,
  id,
  value: controlledValue,
  defaultValue,
  options = [],
  onValueChange,
  children,
  prefix,
}: SelectProps) {
  // Font size classes - EXACT COPY from Vue version
  const fontSizeClasses = {
    sm: 'text-base',
    md: 'text-base',
    lg: 'text-lg',
  }[size]

  // Padding classes - EXACT COPY from Vue version
  const paddingClasses = {
    sm: 'px-2',
    md: 'px-2.5',
    lg: 'px-3',
  }[size]

  // Size classes - EXACT COPY from Vue version
  const sizeClasses = {
    sm: 'rounded min-h-7',
    md: 'rounded min-h-8',
    lg: 'rounded-md min-h-10',
  }[size]

  // Select classes - EXACT COPY from Vue version
  const variantForClasses = disabled ? 'disabled' : variant
  const variantClasses = {
    subtle:
      'border border-[--surface-gray-2] bg-surface-gray-2 hover:border-outline-gray-modals hover:bg-surface-gray-3',
    outline:
      'border border-outline-gray-2 bg-surface-white hover:border-outline-gray-3',
    ghost:
      'bg-transparent border-transparent hover:bg-surface-gray-3 focus:bg-surface-gray-3',
    disabled: cn(
      'border',
      variant !== 'ghost' ? 'bg-surface-gray-1' : '',
      variant === 'outline'
        ? 'border-outline-gray-2'
        : 'border-transparent'
    ),
  }[variantForClasses]

  const selectClasses = cn(
    sizeClasses,
    fontSizeClasses,
    paddingClasses,
    variantClasses,
    'transition-colors w-full data-[state=open]:ring-2 ring-outline-gray-2'
  )

  // Normalize options - EXACT COPY from Vue version
  type NormalizedOption = { label: string; value: string; disabled?: boolean }
  const selectOptions: NormalizedOption[] = (() => {
    if (!options || options.length === 0) return []
    const str = typeof options[0] === 'string'
    if (str) {
      return (options as string[]).map((x) => ({ label: x, value: x }))
    }
    return (options as NormalizedOption[]).filter((x) => x && x.value)
  })()

  const triggerClasses = cn(
    'inline-flex items-center gap-2 outline-none text-base data-[placeholder]:text-ink-gray-4 data-[disabled]:text-ink-gray-4',
    selectClasses
  )

  return (
    <SelectPrimitive.Root
      value={controlledValue?.toString()}
      defaultValue={defaultValue?.toString()}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectPrimitive.Trigger
        id={id}
        className={triggerClasses}
        aria-label="Customise options"
      >
        {prefix}
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <FeatherIcon
            name="chevron-down"
            className="size-4 text-ink-gray-4 ml-auto"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="bg-surface-modal border rounded-lg shadow-lg will-change-[opacity,transform] z-[100] min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-auto"
          sideOffset={5}
          position="popper"
        >
          <SelectPrimitive.Viewport className="p-1 flex flex-col">
            {children ||
              selectOptions.map((option, index) => (
                <SelectPrimitive.Item
                  key={index}
                  value={option.value.toString()}
                  disabled={option.disabled}
                  className={cn(
                    sizeClasses,
                    paddingClasses,
                    fontSizeClasses,
                    'text-base text-ink-gray-9 flex items-center relative data-[highlighted]:bg-surface-gray-2 border-0 data-[state=checked]:bg-surface-gray-2 data-[disabled]:text-ink-gray-4'
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

