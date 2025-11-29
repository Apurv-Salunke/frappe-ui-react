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

    const toggleShow = useCallback(() => {
      setShow((prev) => !prev)
    }, [])

    return (
      <Input
        ref={combinedRef}
        type={show ? 'text' : 'password'}
        value={controlledValue}
        defaultValue={defaultValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        suffix={
          showEye ? (
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
                onClick={toggleShow}
                className="h-3 cursor-pointer mr-1 flex items-center"
              >
                <FeatherIcon
                  name={show ? 'eye-off' : 'eye'}
                  className="h-3 w-3"
                />
              </button>
            </Tooltip>
          ) : undefined
        }
        className={className}
        {...props}
      />
    )
  }
)

Password.displayName = 'Password'

