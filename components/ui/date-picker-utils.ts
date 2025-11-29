import { dayjs, dayjsLocal, type Dayjs } from '../../lib/dayjs'
import type { DatePickerDateObj } from './date-picker-types'

// Constant list of month labels
export const months: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

// Start of given month (0-indexed month)
export function monthStart(year: number, monthIndex: number): Dayjs {
  return dayjs(`${year}-${monthIndex + 1}-01`)
}

// Build weeks grid for the calendar
export function generateWeeks(
  year: number,
  monthIndex: number,
  selected: string,
): DatePickerDateObj[][] {
  const start = monthStart(year, monthIndex).startOf('week')
  const end = monthStart(year, monthIndex).endOf('month').endOf('week')
  const days: DatePickerDateObj[] = []
  let d: Dayjs = start
  while (d.isBefore(end) || d.isSame(end)) {
    const inMonth = d.month() === monthIndex
    const sel = dayjs(selected)
    days.push({
      date: d,
      key: d.format('YYYY-MM-DD'),
      inMonth,
      isToday: d.isSame(dayjsLocal().format('YYYY-MM-DD'), 'day'),
      isSelected: sel.isValid() && d.isSame(sel, 'day'),
    })
    d = d.add(1, 'day')
  }
  const chunked: DatePickerDateObj[][] = []
  for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7))
  return chunked
}

type DateConstructorParam = string | number | Date

function getDate(...args: DateConstructorParam[]): Date {
  return new Date(...(args as [DateConstructorParam]))
}

export function getDateValue(date: Date | string) {
  if (!date || date.toString() === 'Invalid Date') return ''

  return dayjs(date)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .format('YYYY-MM-DD')
}

export { getDate }

