import { cn } from '../../lib/utils'
import { Button } from './button'

export type DividerOrientation = 'horizontal' | 'vertical'
export type DividerPosition = 'center' | 'start' | 'end'

export interface DividerAction {
  label?: string
  loading?: boolean
  handler?: () => void
}

export interface DividerProps {
  orientation?: DividerOrientation
  position?: DividerPosition
  action?: DividerAction
  flexItem?: boolean
  className?: string
}

export function Divider({
  orientation = 'horizontal',
  position = 'center',
  action,
  flexItem = false,
  className,
}: DividerProps) {
  // Alignment classes - EXACT COPY from Vue version
  const spacerDimensionClasses = {
    horizontal: 'border-t-[1px] w-full',
    vertical: 'border-l-[1px]',
  }[orientation]

  const flexClasses = flexItem ? 'self-stretch h-auto' : 'h-full'

  const alignmentClasses = cn(
    'relative whitespace-nowrap border-0 border-outline-gray-2',
    spacerDimensionClasses,
    flexClasses,
    className
  )

  // Action alignment classes - EXACT COPY from Vue version
  const actionAlignmentClasses = {
    horizontal: {
      center: 'left-1/2 top-0 -translate-y-2/4 -translate-x-1/2',
      start: 'left-0 top-0 -translate-y-2/4 ml-4',
      end: 'right-0 -translate-y-2/4 mr-4',
    },
    vertical: {
      center: '-translate-x-2/4 top-1/2 left-0 -translate-y-1/2',
      start: '-translate-x-2/4 top-0 mt-4 left-0',
      end: '-translate-x-2/4 bottom-0 mb-4 left-0',
    },
  }[orientation][position]

  const Component = action ? 'div' : 'hr'

  return (
    <Component className={alignmentClasses}>
      {action && (
        <span className={cn('absolute', actionAlignmentClasses)}>
          <Button
            label={action.label}
            loading={action.loading}
            size="sm"
            variant="outline"
            onClick={action.handler}
          />
        </span>
      )}
    </Component>
  )
}

