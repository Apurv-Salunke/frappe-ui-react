import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { dayjs, dayjsLocal } from '../../lib/dayjs'
import type { Dayjs } from '../../lib/dayjs'
import { Popover } from './popover'
import { Button } from './button'
import { Input } from './input'
import { FeatherIcon } from './feather-icon'
import { months, monthStart, generateWeeks, getDateValue } from './date-picker-utils'
import type { DatePickerProps, DatePickerViewMode } from './date-picker-types'
import { cn } from '../../lib/utils'

export function DatePicker({
  value: controlledValue,
  defaultValue,
  placement = 'bottom-start',
  format,
  variant = 'subtle',
  readonly = false,
  placeholder = 'Select date',
  inputClass,
  allowCustom = true,
  autoClose = true,
  disabled = false,
  label,
  clearable = true,
  onChange,
  onValueChange,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue || controlledValue || '')
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<DatePickerViewMode>('date')
  const [currentYear, setCurrentYear] = useState<number>(dayjs().year())
  const [currentMonth, setCurrentMonth] = useState<number>(dayjs().month())
  const [selected, setSelected] = useState<string>('')
  const [inputValue, setInputValue] = useState<string>('')
  const [isTyping, setIsTyping] = useState(false)
  const popoverContentRef = useRef<HTMLDivElement>(null)

  const DATE_FORMAT = 'YYYY-MM-DD'
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue

  function coerceToDayjs(val?: string | null): Dayjs | null {
    if (!val) return null
    const raw = String(val).trim()
    if (!raw) return null
    if (format) {
      const dStrict = dayjs(raw, format, true)
      if (dStrict.isValid()) return dStrict
    }
    const dLoose = dayjs(raw)
    if (dLoose.isValid()) return dLoose
    const normalized = getDateValue(raw)
    if (normalized) {
      const dNorm = dayjs(normalized)
      if (dNorm.isValid()) return dNorm
    }
    return null
  }

  function syncFromValue(val?: string): void {
    if (!val) {
      if (!clearable) {
        const today = dayjsLocal()
        setCurrentYear(today.year())
        setCurrentMonth(today.month())
        setSelected(today.format(DATE_FORMAT))
      } else {
        setSelected('')
      }
      return
    }
    const d = coerceToDayjs(val)
    if (!d) {
      setSelected('')
      return
    }
    setCurrentYear(d.year())
    setCurrentMonth(d.month())
    setSelected(d.format(DATE_FORMAT))
  }

  useEffect(() => {
    syncFromValue(value)
  }, [value])

  useEffect(() => {
    if (!isTyping) {
      const displayLabel = format
        ? formatter(selected, format)
        : selected
      setInputValue(displayLabel)
    }
  }, [selected, format, isTyping])

  function formatter(dateStr: string, fmt: string): string {
    const d = dayjs(dateStr)
    if (!d.isValid()) return dateStr
    return d.format(fmt)
  }


  function maybeClose(condition = true) {
    if (condition && autoClose) {
      setIsOpen(false)
    }
  }

  function clearSelection() {
    if (!selected) return
    setSelected('')
    const newValue = ''
    if (!isControlled) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
    onValueChange?.(newValue)
    setInputValue('')
  }

  function commitInput(close = false): void {
    const raw = inputValue.trim()
    if (!raw) {
      if (!clearable) {
        selectDate(dayjsLocal())
        maybeClose(close)
      } else {
        clearSelection()
        maybeClose(close)
      }
      return
    }
    const d = coerceToDayjs(raw)
    if (d) {
      selectDate(d)
      maybeClose(close)
    }
  }

  function onBlur(e: React.FocusEvent) {
    // Don't close if focus is moving to the calendar popover
    const next = e.relatedTarget as Node | null
    if (next && popoverContentRef.current?.contains(next)) {
      return
    }
    // Use setTimeout to check if focus moved to popover after blur
    setTimeout(() => {
      const activeElement = document.activeElement
      if (activeElement && popoverContentRef.current?.contains(activeElement)) {
        return
      }
      commitInput()
      setIsTyping(false)
    }, 0)
  }

  function onEnter() {
    commitInput(true)
    setIsTyping(false)
  }

  function activateInput() {
    setIsTyping(true)
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  function handleInputClick(e: React.MouseEvent) {
    e.stopPropagation()
    activateInput()
  }

  function handleChevronClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const weeks = useMemo(
    () => generateWeeks(currentYear, currentMonth, selected),
    [currentYear, currentMonth, selected]
  )

  function selectDate(date: string | Date | Dayjs): void {
    const d = dayjs(date as any)
    if (!d.isValid()) return
    const prev = selected
    const newSelected = d.format(DATE_FORMAT)
    setSelected(newSelected)
    setCurrentYear(d.year())
    setCurrentMonth(d.month())

    if (newSelected !== value) {
      if (!isControlled) {
        setInternalValue(newSelected)
      }
      onChange?.(newSelected)
      if (newSelected !== prev) {
        onValueChange?.(newSelected)
      }
    }

    // Reflect new value in input immediately if not typing
    if (!isTyping) {
      setInputValue(
        format ? formatter(newSelected, format) : newSelected
      )
    }
    setView('date')
  }

  function selectMonth(i: number): void {
    setCurrentMonth(i)
    setView('date')
  }

  function selectYear(y: number): void {
    setCurrentYear(y)
    setView('month')
  }

  function prev(): void {
    if (view === 'date') {
      const m = monthStart(currentYear, currentMonth).subtract(1, 'month')
      setCurrentYear(m.year())
      setCurrentMonth(m.month())
    } else if (view === 'month') {
      setCurrentYear((prev) => prev - 1)
    } else {
      setCurrentYear((prev) => prev - 12)
    }
  }

  function next(): void {
    if (view === 'date') {
      const m = monthStart(currentYear, currentMonth).add(1, 'month')
      setCurrentYear(m.year())
      setCurrentMonth(m.month())
    } else if (view === 'month') {
      setCurrentYear((prev) => prev + 1)
    } else {
      setCurrentYear((prev) => prev + 12)
    }
  }

  function handleDateCellClick(date: string | Date | Dayjs) {
    selectDate(date)
    if (autoClose) {
      setIsOpen(false)
    }
    setIsTyping(false)
  }

  function selectOffset(days = 0) {
    handleDateCellClick(dayjsLocal().add(days, 'day'))
  }

  function handleTodayClick() {
    selectOffset(0)
  }

  function handleTomorrowClick() {
    selectOffset(1)
  }

  function handleClearClick() {
    clearSelection()
    maybeClose()
    setIsTyping(false)
    setView('date')
  }

  function cycleView(): void {
    if (view === 'date') setView('month')
    else if (view === 'month') setView('year')
    else setView('date')
  }

  function handleClose() {
    setView('date')
    if (isTyping) {
      commitInput()
      setIsTyping(false)
    }
  }

  const yearRangeStart = useMemo(
    () => currentYear - (currentYear % 12),
    [currentYear]
  )
  const yearRange = useMemo(
    () => Array.from({ length: 12 }, (_, i) => yearRangeStart + i),
    [yearRangeStart]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        onEnter()
      }
    },
    [onEnter]
  )

  const calendarContent = (
    <div
      ref={popoverContentRef}
      className="w-fit min-w-60 select-none text-base text-ink-gray-9 rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 mt-2"
    >
        <div className="flex items-center justify-between p-2 pb-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm font-medium text-ink-gray-7"
            onClick={cycleView}
          >
            {view === 'date' && (
              <span>
                {months[currentMonth]} {currentYear}
              </span>
            )}
            {view === 'month' && <span>{currentYear}</span>}
            {view === 'year' && (
              <span>
                {yearRangeStart} - {yearRangeStart + 11}
              </span>
            )}
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              icon="chevron-left"
              className="size-7"
              onClick={prev}
            />
            {!clearable && (
              <Button
                variant="ghost"
                className="text-xs"
                onClick={handleTodayClick}
              >
                Today
              </Button>
            )}
            <Button
              variant="ghost"
              icon="chevron-right"
              className="size-7"
              onClick={next}
            />
          </div>
        </div>
        <div className="p-2">
          {view === 'date' && (
            <div role="grid" aria-label="Calendar dates">
              <div className="flex items-center text-xs font-medium uppercase text-ink-gray-4 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div
                    key={i}
                    className="flex h-6 w-8 items-center justify-center"
                  >
                    {d}
                  </div>
                ))}
              </div>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex" role="row">
                  {week.map((dateObj) => (
                    <button
                      key={dateObj.key}
                      type="button"
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded cursor-pointer text-sm focus:outline-none focus:ring-2 focus:ring-outline-gray-2',
                        dateObj.inMonth ? 'text-ink-gray-8' : 'text-ink-gray-3',
                        dateObj.isToday && 'font-extrabold text-ink-gray-9',
                        dateObj.isSelected
                          ? 'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                          : 'hover:bg-surface-gray-2'
                      )}
                      role="gridcell"
                      aria-selected={dateObj.isSelected ? 'true' : 'false'}
                      aria-label={
                        dateObj.date.format('YYYY-MM-DD') +
                        (dateObj.isToday ? ' (Today)' : '')
                      }
                      onClick={() => handleDateCellClick(dateObj.date)}
                    >
                      {dateObj.date.date()}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
          {view === 'month' && (
            <div
              className="grid grid-cols-3 gap-1"
              role="grid"
              aria-label="Select month"
            >
              {months.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  className={cn(
                    'py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6',
                    i === currentMonth &&
                      'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                  )}
                  aria-selected={i === currentMonth ? 'true' : 'false'}
                  onClick={() => selectMonth(i)}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
          {view === 'year' && (
            <div
              className="grid grid-cols-3 gap-1"
              role="grid"
              aria-label="Select year"
            >
              {yearRange.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={cn(
                    'py-2 text-sm rounded cursor-pointer text-center hover:bg-surface-gray-2 focus:outline-none focus:ring-2 focus:ring-brand-6',
                    y === currentYear &&
                      'bg-surface-gray-6 text-ink-white hover:bg-surface-gray-6'
                  )}
                  aria-selected={y === currentYear ? 'true' : 'false'}
                  onClick={() => selectYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
        {clearable && (
          <div className="flex items-center justify-between gap-1 p-2 border-t">
            <div className="flex gap-1">
              <Button variant="outline" onClick={handleTodayClick}>
                Today
              </Button>
              <Button variant="outline" onClick={handleTomorrowClick}>
                Tomorrow
              </Button>
            </div>
            {selected && (
              <Button size="sm" variant="outline" onClick={handleClearClick}>
                Clear
              </Button>
            )}
          </div>
        )}
    </div>
  )

  return (
    <div className="inline-block w-full">
      {label && (
        <label className="block text-sm font-medium text-ink-gray-8 mb-1">
          {label}
        </label>
      )}
      <Popover
        show={isOpen}
        onOpenChange={setIsOpen}
        placement={placement}
        onClose={handleClose}
        content={calendarContent}
        hideOnBlur={false}
      >
        <div className="w-full">
          <Input
            type="text"
            className={cn('cursor-text w-full', inputClass)}
            variant={variant}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readonly || !allowCustom}
            value={inputValue}
            onChange={(val) => {
              setInputValue(val)
              setIsTyping(true)
            }}
            onFocus={activateInput}
            onClick={handleInputClick}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            suffix={
              <button
                type="button"
                className="h-4 w-4 cursor-pointer flex items-center justify-center"
                onClick={handleChevronClick}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                tabIndex={-1}
              >
                <FeatherIcon name="chevron-down" className="h-4 w-4" />
              </button>
            }
          />
        </div>
      </Popover>
    </div>
  )
}

