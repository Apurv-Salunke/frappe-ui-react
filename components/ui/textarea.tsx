import React, { useRef, useCallback, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { debounce } from '../../lib/debounce'
import { useId } from '../../lib/useId'

export type TextareaSize = 'sm' | 'md' | 'lg' | 'xl'
export type TextareaVariant = 'subtle' | 'outline'

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size' | 'onChange'> {
  size?: TextareaSize
  variant?: TextareaVariant
  placeholder?: string
  disabled?: boolean
  id?: string
  value?: string
  defaultValue?: string
  debounce?: number
  rows?: number
  label?: string
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'sm',
      variant = 'subtle',
      placeholder,
      disabled = false,
      id,
      value: controlledValue,
      defaultValue,
      debounce: debounceMs,
      rows = 3,
      label,
      onChange,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef
    const htmlId = id || useId()

    // Size classes - EXACT COPY from Vue version
    const sizeClasses = {
      sm: 'text-base rounded',
      md: 'text-base rounded',
      lg: 'text-lg rounded-md',
      xl: 'text-xl rounded-md',
    }[size]

    // Padding classes - EXACT COPY from Vue version
    const paddingClasses = {
      sm: ['py-1.5 px-2'],
      md: ['py-1.5 px-2.5'],
      lg: ['py-1.5 px-3'],
      xl: ['py-1.5 px-3'],
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
    }[variantForClasses]

    const inputClasses = cn(
      sizeClasses,
      paddingClasses,
      variantClasses,
      disabled ? 'text-ink-gray-5' : 'text-ink-gray-8',
      'transition-colors w-full block',
      className
    )

    // Label classes - EXACT COPY from Vue version
    const labelClasses = cn(
      {
        sm: 'text-xs',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
      }[size],
      'text-ink-gray-5',
      'block'
    )

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
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value
        debouncedEmitChange(newValue)
      },
      [debouncedEmitChange]
    )

    return (
      <div className="space-y-1.5">
        {label && (
          <label className={labelClasses} htmlFor={htmlId}>
            {label}
          </label>
        )}
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          id={htmlId}
          value={controlledValue}
          defaultValue={defaultValue}
          rows={rows}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

