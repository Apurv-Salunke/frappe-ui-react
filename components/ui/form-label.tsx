import { useMemo } from 'react'
import { cn } from '../../lib/utils'

export interface FormLabelProps {
  label: string
  size?: 'sm' | 'md'
  id?: string
  required?: boolean
}

export function FormLabel({
  label,
  size = 'sm',
  id,
  required = false,
}: FormLabelProps) {
  const labelClasses = useMemo(
    () =>
      cn(
        'block',
        {
          sm: 'text-xs',
          md: 'text-base',
        }[size],
        'text-ink-gray-5'
      ),
    [size]
  )

  return (
    <label className={labelClasses} htmlFor={id}>
      {label}
      {required && (
        <>
          <span className="text-ink-red-3 select-none" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  )
}

