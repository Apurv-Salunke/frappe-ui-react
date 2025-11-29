import React, { useState, useRef, useCallback } from 'react'
import { Input, InputProps } from './input'
import { Tooltip } from './tooltip'
import { FeatherIcon } from './feather-icon'

export interface PasswordProps extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

export const Password = React.forwardRef<HTMLInputElement, PasswordProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const [show, setShow] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (ref as React.RefObject<HTMLInputElement>) || inputRef

    // Check if value contains asterisks (masked password)
    const showEye = controlledValue
      ? !controlledValue.includes('*')
      : defaultValue
        ? !defaultValue.includes('*')
        : true

    const handleChange = useCallback(
      (newValue: string) => {
        onChange?.(newValue)
        onValueChange?.(newValue)
      },
      [onChange, onValueChange]
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle Cmd+I or Ctrl+I to toggle visibility
        if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
          e.preventDefault()
          setShow((prev) => !prev)
        }
        props.onKeyDown?.(e)
      },
      [props]
    )


    const handleToggle = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setShow((prev) => !prev)
    }, [])

    const iconElement = showEye ? (
      <div className="h-3 cursor-pointer mr-1 flex items-center justify-center">
        <Tooltip
          content={
            <div className="flex items-center gap-1">
              <span>{show ? 'Hide Password' : 'Show Password'}</span>
              <kbd className="bg-surface-gray-5 text-ink-gray-2 px-1 rounded text-xs">
                Mod+I
              </kbd>
            </div>
          }
        >
          <button
            type="button"
            onClick={handleToggle}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
            className="flex items-center justify-center"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            <FeatherIcon 
              key={show ? 'eye-off' : 'eye'}
              name={show ? 'eye-off' : 'eye'} 
              className="h-3 w-3"
            />
          </button>
        </Tooltip>
      </div>
    ) : undefined

    return (
      <Input
        ref={combinedRef}
        type={show ? 'text' : 'password'}
        value={controlledValue}
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        suffix={iconElement}
        className={className}
        {...props}
      />
    )
  }
)

Password.displayName = 'Password'

