import React, { useMemo, useRef, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { debounce } from '../../lib/debounce'

export type TextInputTypes = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'password' 
  | 'tel' 
  | 'url' 
  | 'search'

export type InputSize = 'sm' | 'md' | 'lg' | 'xl'
export type InputVariant = 'subtle' | 'outline' | 'ghost'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'suffix' | 'onChange'> {
  type?: TextInputTypes
  size?: InputSize
  variant?: InputVariant
  placeholder?: string
  disabled?: boolean
  id?: string
  value?: string | number
  defaultValue?: string | number
  debounce?: number
  required?: boolean
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      size = 'sm',
      variant = 'subtle',
      placeholder,
      disabled = false,
      id,
      value: controlledValue,
      defaultValue,
      debounce: debounceMs,
      required,
      prefix,
      suffix,
      onChange,
      onValueChange,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null)
    const inputRef = (ref as React.RefObject<HTMLInputElement>) || internalRef

    const textColor = disabled ? 'text-ink-gray-5' : 'text-ink-gray-8'

    // Size classes - EXACT COPY from Vue version
    const sizeClasses = {
      sm: 'text-base rounded h-7',
      md: 'text-base rounded h-8',
      lg: 'text-lg rounded-md h-10',
      xl: 'text-xl rounded-md h-10',
    }[size]

    // Padding classes - EXACT COPY from Vue version
    const paddingClasses = {
      sm: [
        'py-1.5',
        prefix ? 'pl-8' : 'pl-2',
        suffix ? 'pr-8' : 'pr-2',
      ],
      md: [
        'py-1.5',
        prefix ? 'pl-9' : 'pl-2.5',
        suffix ? 'pr-9' : 'pr-2.5',
      ],
      lg: [
        'py-1.5',
        prefix ? 'pl-10' : 'pl-3',
        suffix ? 'pr-10' : 'pr-3',
      ],
      xl: [
        'py-1.5',
        prefix ? 'pl-10' : 'pl-3',
        suffix ? 'pr-10' : 'pr-3',
      ],
    }[size]

    // Variant classes - EXACT COPY from Vue version
    const variantForClasses = disabled ? 'disabled' : variant
    const variantClasses = {
      subtle:
        'border border-[--surface-gray-2] bg-surface-gray-2 placeholder-ink-gray-4 hover:border-outline-gray-modals hover:bg-surface-gray-3 focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
      outline:
        'border border-outline-gray-2 bg-surface-white placeholder-ink-gray-4 hover:border-outline-gray-3 hover:shadow-sm focus:bg-surface-white focus:border-outline-gray-4 focus:shadow-sm focus:ring-0 focus-visible:ring-2 focus-visible:ring-outline-gray-3',
      disabled: cn(
        'border bg-surface-gray-1 placeholder-ink-gray-3',
        variant === 'outline'
          ? 'border-outline-gray-2'
          : 'border-transparent'
      ),
      ghost: 'border-0 focus:ring-0 focus-visible:ring-0',
    }[variantForClasses]

    const inputClasses = cn(
      sizeClasses,
      paddingClasses,
      variantClasses,
      textColor,
      'transition-colors w-full dark:[color-scheme:dark]',
      className
    )

    // Prefix and suffix classes - EXACT COPY from Vue version
    const prefixClasses = {
      sm: 'pl-2',
      md: 'pl-2.5',
      lg: 'pl-3',
      xl: 'pl-3',
    }[size]

    const suffixClasses = {
      sm: 'pr-2',
      md: 'pr-2.5',
      lg: 'pr-3',
      xl: 'pr-3',
    }[size]

    // Handle change with debounce support
    const emitChange = useCallback((newValue: string) => {
      onChange?.(newValue)
      onValueChange?.(newValue)
    }, [onChange, onValueChange])

    const debouncedEmitChange = useMemo(
      () => (debounceMs ? debounce(emitChange, debounceMs) : emitChange),
      [debounceMs, emitChange]
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        debouncedEmitChange(newValue)
      },
      [debouncedEmitChange]
    )

    return (
      <div
        className={cn('relative flex items-center', className)}
        style={style}
      >
        {prefix && (
          <div
            className={cn(
              'absolute inset-y-0 left-0 flex items-center',
              textColor,
              prefixClasses
            )}
          >
            {prefix}
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          id={id}
          value={controlledValue}
          defaultValue={defaultValue}
          required={required}
          onChange={handleChange}
          {...(props as Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>)}
        />
        {suffix && (
          <div
            className={cn(
              'absolute inset-y-0 right-0 flex items-center',
              textColor,
              suffixClasses
            )}
          >
            {suffix}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

