import { useState, useCallback, useMemo } from 'react'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'
import { Button } from './button'
import { Popover } from './popover'
import { LoadingIndicator } from './loading-indicator'
import { Input } from './input'

export interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface MultiSelectProps {
  placeholder?: string
  options: MultiSelectOption[]
  hideSearch?: boolean
  loading?: boolean
  compareFn?: (a: MultiSelectOption, b: MultiSelectOption) => boolean
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  onChange?: (value: string[]) => void
}

export function MultiSelect({
  placeholder = 'Select option',
  options,
  hideSearch = false,
  loading = false,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onChange,
}: MultiSelectProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue || [])
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const handleValueChange = useCallback(
    (newValue: string[]) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      onChange?.(newValue)
    },
    [isControlled, onValueChange, onChange]
  )

  const getValues = useCallback(
    (arr: string[]) => {
      return arr.map((x) => options.find((y) => y.value === x)?.label).filter(Boolean) as string[]
    },
    [options]
  )

  const optionToStr = useCallback((opts: MultiSelectOption[]) => {
    return opts.map((x) => x.value)
  }, [])

  const selectedOptions = useMemo(() => {
    const labels = getValues(value).join(', ')
    return value.length > 0 ? labels : placeholder
  }, [value, getValues, placeholder])

  const clearAll = useCallback(() => {
    handleValueChange([])
  }, [handleValueChange])

  const selectAll = useCallback(() => {
    handleValueChange(optionToStr(options))
  }, [handleValueChange, optionToStr, options])

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options
    const lowerSearch = searchValue.toLowerCase()
    return options.filter(
      (option) => option.label.toLowerCase().includes(lowerSearch)
    )
  }, [options, searchValue])

  const handleOptionClick = useCallback(
    (optionValue: string) => {
      const newValue = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
      handleValueChange(newValue)
    },
    [value, handleValueChange]
  )

  const isSelected = useCallback(
    (optionValue: string) => value.includes(optionValue),
    [value]
  )

  return (
    <Popover
      show={open}
      onOpenChange={setOpen}
      matchTargetWidth
      popoverClass="mt-2 shadow-xl rounded-lg border bg-surface-modal"
      content={
        <div className="relative p-2 pb-0">
          {!hideSearch && (
            <div className="flex w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 ring-2 ring-outline-gray-2 transition-colors hover:bg-surface-gray-3 border border-transparent mb-2">
              <Input
                placeholder="Search for..."
                value={searchValue}
                onChange={(val) => setSearchValue(val)}
                className="bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full"
              />
              <div className="inline-flex gap-1">
                {loading && (
                  <LoadingIndicator className="size-4 text-ink-gray-5" />
                )}
                {searchValue && (
                  <button
                    onClick={() => setSearchValue('')}
                    className="text-ink-gray-9 hover:text-ink-gray-7"
                    type="button"
                  >
                    <FeatherIcon name="x" className="size-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="z-10 overflow-hidden">
            <div className="max-h-60 overflow-auto pb-1.5">
              {filteredOptions.length === 0 ? (
                <div className="text-ink-gray-5 text-base text-center py-1.5 px-2.5">
                  No results found
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => handleOptionClick(item.value)}
                    className={cn(
                      'w-full text-base leading-none text-ink-gray-7 rounded flex items-center h-7 p-1.5 relative select-none transition-colors',
                      'hover:bg-surface-gray-3 focus:bg-surface-gray-3 focus:outline-none',
                      item.disabled && 'opacity-50 pointer-events-none',
                      isSelected(item.value) && 'bg-surface-gray-2'
                    )}
                  >
                    <span className="flex-1 text-left">{item.label}</span>
                    {isSelected(item.value) && (
                      <FeatherIcon
                        name="check"
                        className="size-4 absolute right-2"
                      />
                    )}
                  </button>
                ))
              )}
            </div>

            <hr className="border-outline-gray-3" />

            <div className="flex justify-between my-2">
              <Button variant="ghost" onClick={clearAll} size="sm">
                Clear All
              </Button>
              <Button variant="ghost" onClick={selectAll} size="sm">
                Select All
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <Button
        className={cn(
          'w-full justify-between',
          value.length === 0 && '!text-ink-gray-4'
        )}
        onClick={() => setOpen(!open)}
      >
        {selectedOptions}
        <FeatherIcon name="chevron-down" className="size-4 text-ink-gray-5" />
      </Button>
    </Popover>
  )
}

