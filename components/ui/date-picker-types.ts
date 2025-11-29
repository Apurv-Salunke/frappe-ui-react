import type { Dayjs } from '../../lib/dayjs'

export type DatePickerPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

export type DatePickerViewMode = 'date' | 'month' | 'year'

export interface DatePickerDateObj {
  date: Dayjs
  key: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}

export interface DatePickerProps {
  value?: string
  defaultValue?: string
  placement?: DatePickerPlacement
  format?: string
  variant?: 'subtle' | 'ghost' | 'outline'
  readonly?: boolean
  placeholder?: string
  inputClass?: string
  allowCustom?: boolean
  autoClose?: boolean
  disabled?: boolean
  label?: string
  clearable?: boolean
  onChange?: (value: string) => void
  onValueChange?: (value: string) => void
}

