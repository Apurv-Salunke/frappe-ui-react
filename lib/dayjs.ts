import dayjs, { type Dayjs } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import isToday from 'dayjs/plugin/isToday'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)
dayjs.extend(isToday)
dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)

function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function dayjsLocal(dateTimeString?: string): Dayjs {
  const localTimezone = getBrowserTimezone()
  if (!dateTimeString) return dayjs().tz(localTimezone)
  return dayjs.tz(dateTimeString, 'UTC').tz(localTimezone)
}

export function dayjsSystem(dateTimeString?: string): Dayjs {
  const systemTimezone = 'UTC'
  const localTimezone = getBrowserTimezone()
  if (!dateTimeString) return dayjs().tz(systemTimezone)
  return dayjs.tz(dateTimeString, localTimezone).tz(systemTimezone)
}

export { dayjs }
export type { Dayjs }

