import { useMemo, ReactNode } from 'react'
import { useId } from '../../lib/useId'
import { cn } from '../../lib/utils'
import { FormLabel } from './form-label'
import { Input } from './input'
import { Textarea } from './textarea'
import { Select } from './select'
import { Checkbox } from './checkbox'
import { Autocomplete } from './autocomplete'

export type FormControlType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'autocomplete'

export interface FormControlProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix' | 'suffix' | 'onChange'> {
  label?: string
  description?: string
  type?: FormControlType
  size?: 'sm' | 'md'
  variant?: 'subtle' | 'outline'
  required?: boolean
  children?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  descriptionSlot?: ReactNode
  rows?: number
  options?: Array<{ label: string; value: string; disabled?: boolean }> | string[]
}

export function FormControl({
  label,
  description,
  type = 'text',
  size = 'sm',
  variant = 'subtle',
  required = false,
  children,
  prefix,
  suffix,
  descriptionSlot,
  className,
  style,
  id: providedId,
  onChange,
  ...props
}: FormControlProps & { onChange?: (value: string) => void }) {
  const generatedId = useId()
  const id = providedId || generatedId

  const descriptionClasses = useMemo(
    () =>
      cn(
        {
          sm: 'text-xs',
          md: 'text-base',
        }[size],
        'text-ink-gray-5'
      ),
    [size]
  )

  // For checkbox, render it differently
  if (type === 'checkbox') {
    return (
      <Checkbox
        id={id}
        label={label}
        size={size}
        className={className}
        {...(props as any)}
      />
    )
  }

  return (
    <div className={cn('space-y-1.5', className)} style={style}>
      {label && (
        <FormLabel label={label} size={size} id={id} required={required} />
      )}
      {type === 'select' ? (
        <Select id={id} size={size} variant={variant} prefix={prefix} {...(props as any)} />
      ) : type === 'autocomplete' ? (
        <Autocomplete prefix={prefix} {...(props as any)} />
      ) : type === 'textarea' ? (
        <Textarea
          id={id}
          size={size}
          variant={variant}
          {...(props as any)}
        />
      ) : (
        <Input
          id={id}
          type={type}
          size={size}
          variant={variant}
          required={required}
          prefix={prefix}
          suffix={suffix}
          value={props.value as string | number | undefined}
          defaultValue={props.defaultValue as string | number | undefined}
          onChange={onChange}
          {...(props as Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'value' | 'defaultValue' | 'onChange'>)}
        />
      )}
      {descriptionSlot || (description && (
        <p className={descriptionClasses}>{description}</p>
      ))}
      {children}
    </div>
  )
}

