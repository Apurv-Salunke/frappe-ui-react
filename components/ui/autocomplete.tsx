import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Combobox } from '@headlessui/react'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'
import { Button } from './button'
import { Popover } from './popover'
import { LoadingIndicator } from './loading-indicator'

export type OptionValue = string | number | boolean

export type Option = {
  label: string
  value: OptionValue
  description?: string
  [key: string]: any
}

export type AutocompleteOption = OptionValue | Option

export type AutocompleteOptionGroup = {
  group: string
  items: AutocompleteOption[]
  hideLabel?: boolean
}

type AutocompleteOptions = AutocompleteOption[] | AutocompleteOptionGroup[]

export type AutocompleteProps = {
  label?: string
  options: AutocompleteOptions
  hideSearch?: boolean
  placeholder?: string
  bodyClasses?: string | string[]
  loading?: boolean
  placement?: string
  showFooter?: boolean
  compareFn?: (a: Option, b: Option) => boolean
  maxOptions?: number
  value?: AutocompleteOption | AutocompleteOption[] | null
  defaultValue?: AutocompleteOption | AutocompleteOption[] | null
  onChange?: (value: AutocompleteOption | AutocompleteOption[] | null) => void
  onQueryChange?: (query: string) => void
} & (
  | {
      multiple: true
    }
  | {
      multiple?: false
    }
)

export function Autocomplete({
  label,
  options,
  hideSearch = false,
  placeholder,
  bodyClasses,
  loading = false,
  placement = 'bottom-start',
  showFooter = false,
  compareFn = (a, b) => a.value === b.value,
  maxOptions = 50,
  multiple = false,
  value: controlledValue,
  defaultValue,
  onChange,
  onQueryChange,
}: AutocompleteProps) {
  const [internalValue, setInternalValue] = useState<AutocompleteOption | AutocompleteOption[] | null>(
    defaultValue || (multiple ? [] : null)
  )
  const [query, setQuery] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const isOption = (option: AutocompleteOption): option is Option => {
    return typeof option === 'object'
  }

  const isOptionGroup = (option: any): option is AutocompleteOptionGroup => {
    return typeof option === 'object' && 'items' in option && 'group' in option
  }

  const sanitizeOptions = useCallback((opts: AutocompleteOption[]): Option[] => {
    if (!opts) return []
    return opts.map((option) => {
      return isOption(option)
        ? option
        : { label: option.toString(), value: option }
    })
  }, [])

  const filterOptions = useCallback(
    (opts: Option[]) => {
      if (!query) return opts
      return opts.filter((option) => {
        return (
          option.label.toLowerCase().includes(query.trim().toLowerCase()) ||
          option.value.toString().toLowerCase().includes(query.trim().toLowerCase())
        )
      })
    },
    [query]
  )

  const groups = useMemo(() => {
    if (!options?.length) return []

    let groups: AutocompleteOptionGroup[]
    if (isOptionGroup(options[0])) {
      groups = options as AutocompleteOptionGroup[]
    } else {
      groups = [
        {
          group: '',
          items: sanitizeOptions(options as AutocompleteOption[]),
          hideLabel: false,
        },
      ]
    }

    return groups
      .map((group, i) => {
        return {
          key: i,
          group: group.group,
          hideLabel: group.hideLabel,
          items: filterOptions(sanitizeOptions(group.items || [])),
        }
      })
      .filter((group) => group.items.length > 0)
  }, [options, sanitizeOptions, filterOptions])

  const allOptions = useMemo(() => {
    return groups.flatMap((group) => group.items)
  }, [groups])

  const findOption = useCallback(
    (option: AutocompleteOption): Option | null => {
      if (!option) return null
      const optionValue = isOption(option) ? option.value : option
      return allOptions.find((o) => o.value === optionValue) || null
    },
    [allOptions]
  )

  const makeOption = useCallback((option: AutocompleteOption): Option => {
    return isOption(option) ? option : { label: option.toString(), value: option }
  }, [])

  const getLabel = useCallback((option: AutocompleteOption): string => {
    if (isOption(option)) {
      return option?.label || option?.value?.toString() || ''
    }
    return option.toString()
  }, [])

  const selectedValue = useMemo(() => {
    if (!value) return multiple ? [] : null
    if (!multiple) {
      return findOption(value as AutocompleteOption) || makeOption(value as AutocompleteOption)
    }
    const values = (value || []) as AutocompleteOption[]
    return isOption(values[0])
      ? values
      : values.map((v) => findOption(v) || makeOption(v))
  }, [value, multiple, findOption, makeOption])

  const displayValue = useMemo(() => {
    if (!selectedValue) return ''
    if (!multiple) {
      return getLabel(selectedValue as AutocompleteOption)
    }
    return (selectedValue as Option[])
      .map((v) => getLabel(v))
      .join(', ')
  }, [selectedValue, multiple, getLabel])

  const isOptionSelected = useCallback(
    (option: AutocompleteOption): boolean => {
      if (!selectedValue) return false
      const optionValue = isOption(option) ? option.value : option
      if (!multiple) {
        const selected = selectedValue as Option
        return selected?.value === optionValue
      }
      return (selectedValue as Option[]).some((v) => v.value === optionValue)
    },
    [selectedValue, multiple]
  )

  const areAllOptionsSelected = useMemo(() => {
    if (!multiple) return false
    return allOptions.length === (selectedValue as Option[])?.length
  }, [multiple, allOptions.length, selectedValue])

  const handleValueChange = useCallback(
    (newValue: AutocompleteOption | AutocompleteOption[] | null) => {
      setQuery('')
      if (!multiple && newValue) {
        setShowOptions(false)
      }
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
      onQueryChange?.('')
    },
    [multiple, isControlled, onChange, onQueryChange]
  )

  const selectAll = useCallback(() => {
    handleValueChange(allOptions)
  }, [handleValueChange, allOptions])

  const clearAll = useCallback(() => {
    handleValueChange(multiple ? [] : null)
  }, [handleValueChange, multiple])

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      onQueryChange?.(newQuery)
    },
    [onQueryChange]
  )

  useEffect(() => {
    if (showOptions && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showOptions])

  return (
    <Popover
      show={showOptions}
      onOpenChange={setShowOptions}
      placement={placement as any}
      matchTargetWidth
      popoverClass={cn('mt-1', bodyClasses)}
      content={
        <Combobox
          value={selectedValue}
          onChange={handleValueChange}
          multiple={multiple as any}
          nullable
          by={(a: any, b: any) => {
            if (!a || !b) return false
            const aValue = isOption(a) ? a.value : a
            const bValue = isOption(b) ? b.value : b
            const aOpt: Option = isOption(a) ? a : { label: String(a), value: aValue }
            const bOpt: Option = isOption(b) ? b : { label: String(b), value: bValue }
            return compareFn(aOpt, bOpt)
          }}
        >
          <div className="relative mt-1 rounded-lg bg-surface-modal text-base shadow-2xl">
            <Combobox.Options
              static
              className={cn(
                'max-h-[15rem] overflow-y-auto px-1.5 pb-1.5',
                hideSearch && 'pt-1.5'
              )}
            >
              {!hideSearch && (
                <div className="sticky top-0 z-10 flex items-stretch space-x-1.5 bg-surface-modal py-1.5">
                  <div className="relative w-full">
                    <Combobox.Input
                      ref={searchInputRef}
                      className="form-input w-full focus:bg-surface-gray-3 hover:bg-surface-gray-4 text-ink-gray-8 rounded px-2 py-1 border border-outline-gray-2 focus:border-outline-gray-4 focus:outline-none focus:ring-2 focus:ring-outline-gray-3"
                      type="text"
                      value={query}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQueryChange(e.target.value)}
                      autoComplete="off"
                      placeholder="Search"
                    />
                    <div className="absolute right-0 inline-flex h-7 w-7 items-center justify-center">
                      {loading ? (
                        <LoadingIndicator className="h-4 w-4 text-ink-gray-5" />
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleQueryChange('')}
                          className="text-ink-gray-8 hover:text-ink-gray-6"
                        >
                          <FeatherIcon name="x" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {groups.map((group) => {
                if (group.items.length === 0) return null
                return (
                  <div key={group.key}>
                    {group.group && !group.hideLabel && (
                      <div className="sticky top-10 truncate bg-surface-modal px-2.5 py-1.5 text-sm font-medium text-ink-gray-5">
                        {group.group}
                      </div>
                    )}
                    {group.items.slice(0, maxOptions).map((option, idx) => (
                      <Combobox.Option
                        key={idx}
                        value={option}
                        disabled={option.disabled}
                        className={({ active }: { active: boolean }) =>
                          cn(
                            'flex cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-base',
                            active && 'bg-surface-gray-3',
                            option.disabled && 'opacity-50'
                          )
                        }
                      >
                        {({ selected: isSelected }: { selected: boolean }) => (
                          <li className="flex w-full items-center justify-between">
                            <div className="flex flex-1 gap-2 overflow-hidden items-center">
                              {(multiple || isSelected) && (
                                <div className="flex flex-shrink-0">
                                  {isOptionSelected(option) ? (
                                    <FeatherIcon
                                      name="check"
                                      className="h-4 w-4 text-ink-gray-7"
                                    />
                                  ) : (
                                    <div className="h-4 w-4" />
                                  )}
                                </div>
                              )}
                              <span className="flex-1 truncate text-ink-gray-7">
                                {option.label}
                              </span>
                            </div>
                            {option.description && (
                              <div className="ml-2 flex-shrink-0 text-sm text-ink-gray-5">
                                {option.description}
                              </div>
                            )}
                          </li>
                        )}
                      </Combobox.Option>
                    ))}
                  </div>
                )
              })}

              {groups.length === 0 && (
                <li className="rounded-md px-2.5 py-1.5 text-base text-ink-gray-5">
                  No results found
                </li>
              )}
            </Combobox.Options>

            {(showFooter || multiple) && (
              <div className="border-t p-1">
                {multiple ? (
                  <div className="flex items-center justify-end">
                    {!areAllOptionsSelected ? (
                      <Button label="Select All" onClick={selectAll} size="sm" />
                    ) : (
                      <Button label="Clear All" onClick={clearAll} size="sm" />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-end">
                    <Button label="Clear" onClick={clearAll} size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>
        </Combobox>
      }
    >
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs text-ink-gray-5">{label}</label>
        )}
        <button
          type="button"
          className={cn(
            'flex h-7 w-full items-center justify-between gap-2 rounded bg-surface-gray-2 px-2 py-1 transition-colors hover:bg-surface-gray-3 border border-transparent focus:border-outline-gray-4 focus:outline-none focus:ring-2 focus:ring-outline-gray-3',
            showOptions && 'bg-surface-gray-3'
          )}
          onClick={() => setShowOptions(!showOptions)}
        >
          <div className="flex items-center overflow-hidden">
            <span
              className={cn(
                'truncate text-base leading-5',
                displayValue ? 'text-ink-gray-8' : 'text-ink-gray-4'
              )}
            >
              {displayValue || placeholder || ''}
            </span>
          </div>
          <FeatherIcon
            name="chevron-down"
            className="h-4 w-4 text-ink-gray-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </Popover>
  )
}

