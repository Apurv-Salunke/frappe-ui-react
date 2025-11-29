import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Combobox as HeadlessCombobox } from '@headlessui/react'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'

export type ComboboxVariant = 'subtle' | 'outline' | 'ghost'

export type SelectableOption = {
  type?: 'option'
  label: string
  value: string
  icon?: string | React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export type CustomOption = {
  type: 'custom'
  label: string
  key: string
  icon?: string | React.ComponentType<{ className?: string }>
  disabled?: boolean
  onClick: (context: { searchTerm: string }) => void
  keepOpen?: boolean
  slotName?: string
  render?: () => React.ReactNode
  condition?: (context: { searchTerm: string }) => boolean
}

export type SimpleOption = string | SelectableOption | CustomOption
export type GroupedOption = { group: string; options: SimpleOption[] }
export type ComboboxOption = SimpleOption | GroupedOption

export interface ComboboxProps {
  variant?: ComboboxVariant
  options: Array<ComboboxOption>
  value?: string | null
  defaultValue?: string | null
  placeholder?: string
  disabled?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  placement?: 'start' | 'center' | 'end'
  onChange?: (value: string | null) => void
  onSelectedOptionChange?: (option: SimpleOption | null) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onInput?: (value: string) => void
}

export function Combobox({
  variant = 'subtle',
  options,
  value: controlledValue,
  defaultValue,
  placeholder,
  disabled = false,
  openOnFocus = false,
  openOnClick = false,
  onChange,
  onSelectedOptionChange,
  onFocus,
  onBlur,
  onInput,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null)
  const [searchTerm, setSearchTerm] = useState(() => {
    const initialValue = defaultValue || controlledValue
    if (!initialValue) return ''
    // We'll set this properly after getDisplayValue is defined
    return ''
  })
  const [isOpen, setIsOpen] = useState(false)
  const [userHasTyped, setUserHasTyped] = useState(false)
  const lastSearchTermRef = useRef('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  const isGroup = (option: ComboboxOption): option is GroupedOption => {
    return typeof option === 'object' && 'group' in option
  }

  const isCustomOption = (option: SimpleOption): option is CustomOption => {
    return typeof option === 'object' && 'type' in option && option.type === 'custom'
  }

  const getLabel = useCallback((option: SimpleOption): string => {
    return typeof option === 'string' ? option : option.label
  }, [])

  const getValue = useCallback((option: SimpleOption): string | undefined => {
    if (typeof option === 'string') return option
    if (isCustomOption(option)) return undefined
    return option.value
  }, [])

  const getKey = useCallback((option: SimpleOption): string => {
    if (typeof option === 'string') return option
    if (isCustomOption(option)) return option.key
    return option.value
  }, [])

  const isDisabled = useCallback((option: SimpleOption): boolean => {
    return typeof option === 'object' && !!option.disabled
  }, [])

  const getIcon = useCallback((option: SimpleOption): string | React.ComponentType<{ className?: string }> | undefined => {
    return typeof option === 'object' ? option.icon : undefined
  }, [])

  const allOptionsFlat = useMemo(() => {
    const flatOptions: SimpleOption[] = []
    options.forEach((optionOrGroup) => {
      if (isGroup(optionOrGroup)) {
        flatOptions.push(...optionOrGroup.options)
      } else {
        flatOptions.push(optionOrGroup)
      }
    })
    return flatOptions
  }, [options])

  const getDisplayValue = useCallback(
    (selectedValue: string | null | undefined): string => {
      if (!selectedValue) return ''
      const selectedOption = allOptionsFlat.find((opt) => getValue(opt) === selectedValue)
      return selectedOption ? getLabel(selectedOption) : selectedValue || ''
    },
    [allOptionsFlat, getValue, getLabel]
  )

  const selectedOption = useMemo(() => {
    if (!value) return null
    return allOptionsFlat.find((opt) => getValue(opt) === value) || null
  }, [value, allOptionsFlat, getValue])

  const selectedOptionIcon = useMemo(() => {
    return selectedOption ? getIcon(selectedOption) : undefined
  }, [selectedOption, getIcon])

  const shouldShowOption = useCallback(
    (option: SimpleOption, search: string, context: { searchTerm: string }) => {
      if (isCustomOption(option)) {
        if (option.condition) {
          return option.condition(context)
        }
        if (!search) return true
        return getLabel(option).toLowerCase().includes(search.toLowerCase())
      }

      if (!search) return true
      const label = getLabel(option).toLowerCase()
      const value = getValue(option)?.toLowerCase() || ''
      const lowerSearch = search.toLowerCase()
      return label.includes(lowerSearch) || value.includes(lowerSearch)
    },
    [getLabel, getValue]
  )

  const filterFunction = useCallback(
    (opts: ComboboxOption[], search: string) => {
      const context = { searchTerm: search }
      const filtered: ComboboxOption[] = []

      opts.forEach((optionOrGroup) => {
        if (isGroup(optionOrGroup)) {
          const filteredGroupOptions = optionOrGroup.options.filter((opt) =>
            shouldShowOption(opt, search, context)
          )
          if (filteredGroupOptions.length > 0) {
            filtered.push({ ...optionOrGroup, options: filteredGroupOptions })
          }
        } else if (shouldShowOption(optionOrGroup, search, context)) {
          filtered.push(optionOrGroup)
        }
      })

      return filtered
    },
    [shouldShowOption]
  )

  const filteredOptions = useMemo(() => {
    if (isOpen && !userHasTyped && value) {
      return options
    }
    return filterFunction(options, searchTerm)
  }, [isOpen, userHasTyped, value, options, searchTerm, filterFunction])

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      // Update searchTerm immediately to prevent input lag
      setSearchTerm(newValue)
      lastSearchTermRef.current = newValue
      setUserHasTyped(true)
      
      // Ensure dropdown is open when user starts typing
      if (!isOpen) {
        setIsOpen(true)
      }

      if (newValue === '') {
        const newInternalValue = null
        if (!isControlled) {
          setInternalValue(newInternalValue)
        }
        onChange?.(newInternalValue)
      }
      onInput?.(newValue)
    },
    [isControlled, onChange, onInput, isOpen]
  )

  const handleValueChange = useCallback(
    (newValue: SimpleOption) => {
      const optionValue = getValue(newValue)
      const selectedOpt = optionValue
        ? allOptionsFlat.find((opt) => getKey(opt) === optionValue) || null
        : null

      if (selectedOpt && isCustomOption(selectedOpt)) {
        const context = { searchTerm: lastSearchTermRef.current }
        selectedOpt.onClick(context)

        if (selectedOpt.keepOpen) {
          setTimeout(() => {
            setIsOpen(true)
          }, 0)
        } else {
          setIsOpen(false)
          setSearchTerm(getDisplayValue(value))
          lastSearchTermRef.current = ''
          setUserHasTyped(false)
        }
        return
      }

      const finalValue = optionValue || null
      if (!isControlled) {
        setInternalValue(finalValue)
      }
      onChange?.(finalValue)
      setSearchTerm(getDisplayValue(finalValue))
      lastSearchTermRef.current = ''
      setUserHasTyped(false)
      onSelectedOptionChange?.(selectedOpt)
    },
    [isControlled, allOptionsFlat, getKey, getValue, getDisplayValue, value, onChange, onSelectedOptionChange]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (!open) {
        setSearchTerm(getDisplayValue(value))
        setUserHasTyped(false)
      } else {
        setUserHasTyped(false)
      }
    },
    [value, getDisplayValue]
  )

  // Sync internal state with HeadlessCombobox open state
  const handleComboboxOpenChange = useCallback(
    (open: boolean) => {
      handleOpenChange(open)
    },
    [handleOpenChange]
  )

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      if (openOnFocus) {
        setIsOpen(true)
      }
      onFocus?.(event)
    },
    [openOnFocus, onFocus]
  )

  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(event)
    },
    [onBlur]
  )

  const handleClick = useCallback(() => {
    if (openOnClick) {
      setIsOpen(true)
    }
  }, [openOnClick])

  useEffect(() => {
    if (!userHasTyped) {
      setSearchTerm(getDisplayValue(value))
    }
  }, [value, userHasTyped, getDisplayValue])

  const variantClasses = useMemo(() => {
    const borderCss =
      'border focus-within:border-outline-gray-4 focus-within:ring-2 focus-within:ring-outline-gray-3'

    return {
      subtle: `${borderCss} bg-surface-gray-2 hover:bg-surface-gray-3 border-transparent`,
      outline: `${borderCss} border-outline-gray-2`,
      ghost: '',
    }[variant]
  }, [variant])

  const renderIcon = (icon?: string | React.ComponentType<{ className?: string }>) => {
    if (!icon) return null
    if (typeof icon === 'string') {
      return <FeatherIcon name={icon} className="w-4 h-4" />
    }
    const IconComponent = icon
    return <IconComponent className="w-4 h-4" />
  }

  return (
    <div className="relative">
      <HeadlessCombobox
        value={allOptionsFlat.find((opt) => getValue(opt) === value) || null}
        onChange={handleValueChange}
        disabled={disabled}
      >
        {({ open }) => {
          // Sync state when HeadlessCombobox open state changes
          useEffect(() => {
            handleComboboxOpenChange(open)
          }, [open, handleComboboxOpenChange])

          return (
            <>
              <div
                className={cn(
                  'flex h-7 w-full items-center justify-between gap-2 rounded px-2 py-1 transition-colors',
                  disabled && 'opacity-50 pointer-events-none',
                  variantClasses
                )}
                onClick={handleClick}
              >
                <div className="flex items-center gap-2 flex-1 overflow-hidden">
                  {selectedOptionIcon && (
                    <div className="flex-shrink-0 w-4 h-4 inline-flex items-center justify-center">
                      {renderIcon(selectedOptionIcon)}
                    </div>
                  )}
                  <HeadlessCombobox.Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="bg-transparent p-0 focus:outline-0 border-0 focus:border-0 focus:ring-0 text-base text-ink-gray-8 h-full placeholder:text-ink-gray-4 w-full"
                    placeholder={placeholder || ''}
                    autoComplete="off"
                  />
                </div>
                <HeadlessCombobox.Button>
                  <FeatherIcon name="chevron-down" className="h-4 w-4 text-ink-gray-5" />
                </HeadlessCombobox.Button>
              </div>
              <HeadlessCombobox.Options
                className={cn(
                  'absolute z-10 min-w-full mt-1 bg-surface-modal overflow-hidden rounded-lg shadow-2xl max-h-60 overflow-auto pb-1.5',
                  !isGroup(filteredOptions[0]) && 'px-1.5 pt-1.5'
                )}
              >
                {filteredOptions.length === 0 && (
                  <div className="text-ink-gray-5 text-base text-center py-1.5 px-2.5">
                    No results found for "{searchTerm}"
                  </div>
                )}
                {filteredOptions.map((optionOrGroup, index) => {
                  if (isGroup(optionOrGroup)) {
                    return (
                      <div key={index}>
                        <div className="px-2.5 pt-3 pb-1.5 text-sm font-medium text-ink-gray-5 sticky top-0 bg-surface-modal z-10">
                          {optionOrGroup.group}
                        </div>
                        {optionOrGroup.options.map((option, idx) => (
                          <HeadlessCombobox.Option
                            key={`${index}-${idx}`}
                            value={option}
                            disabled={isDisabled(option)}
                            className={({ active }: { active: boolean }) =>
                              cn(
                                'text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none',
                                'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
                                active && 'bg-surface-gray-3'
                              )
                            }
                          >
                            {({ selected }: { selected: boolean }) => (
                              <>
                                <span className="flex items-center gap-2 pr-6 flex-1">
                                  {renderIcon(getIcon(option))}
                                  {getLabel(option)}
                                </span>
                                {selected && (
                                  <FeatherIcon
                                    name="check"
                                    className="absolute right-0 w-6 inline-flex items-center justify-center size-4"
                                  />
                                )}
                              </>
                            )}
                          </HeadlessCombobox.Option>
                        ))}
                      </div>
                    )
                  }
                  return (
                    <HeadlessCombobox.Option
                      key={index}
                      value={optionOrGroup}
                      disabled={isDisabled(optionOrGroup)}
                      className={({ active }: { active: boolean }) =>
                        cn(
                          'text-base leading-none text-ink-gray-7 rounded flex items-center h-7 px-2.5 py-1.5 relative select-none',
                          'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
                          active && 'bg-surface-gray-3'
                        )
                      }
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          <span className="flex items-center gap-2 pr-6 flex-1">
                            {renderIcon(getIcon(optionOrGroup))}
                            {getLabel(optionOrGroup)}
                          </span>
                          {selected && (
                            <FeatherIcon
                              name="check"
                              className="absolute right-0 w-6 inline-flex items-center justify-center size-4"
                            />
                          )}
                        </>
                      )}
                    </HeadlessCombobox.Option>
                  )
                })}
              </HeadlessCombobox.Options>
            </>
          )
        }}
      </HeadlessCombobox>
    </div>
  )
}
