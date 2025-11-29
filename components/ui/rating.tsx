import { useState, useEffect, useCallback, useMemo } from 'react'
import { FeatherIcon } from './feather-icon'
import { cn } from '../../lib/utils'

export interface RatingProps {
  value?: number
  defaultValue?: number
  ratingFrom?: number
  label?: string
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onChange?: (value: number) => void
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  ratingFrom = 5,
  label,
  readonly = false,
  size = 'md',
  onChange,
}: RatingProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [hoveredRating, setHoveredRating] = useState(0)

  const isControlled = controlledValue !== undefined
  const rating = isControlled ? controlledValue : internalValue

  useEffect(() => {
    if (isControlled) {
      // Controlled mode - value is managed externally
      return
    }
  }, [isControlled, controlledValue])

  const iconClasses = useCallback(
    (index: number) => {
      const sizeClasses = {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-6',
        xl: 'size-7',
      }[size]

      const classes: string[] = [sizeClasses, 'fill-gray-300', 'text-transparent', 'mr-0.5']

      if (index <= hoveredRating && index > rating) {
        classes.push('!fill-yellow-200')
      } else if (index <= rating) {
        classes.push('!fill-yellow-500')
      }

      if (!readonly) {
        classes.push('cursor-pointer')
      }

      return cn(classes)
    },
    [hoveredRating, rating, size, readonly]
  )

  const markRating = useCallback(
    (index: number) => {
      if (readonly) return

      if (!isControlled) {
        setInternalValue(index)
      }
      onChange?.(index)
    },
    [readonly, isControlled, onChange]
  )

  const handleMouseOver = useCallback(
    (index: number) => {
      if (!readonly) {
        setHoveredRating(index)
      }
    },
    [readonly]
  )

  const handleMouseLeave = useCallback(() => {
    if (!readonly) {
      setHoveredRating(0)
    }
  }, [readonly])

  const stars = useMemo(
    () => Array.from({ length: ratingFrom }, (_, i) => i + 1),
    [ratingFrom]
  )

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs text-ink-gray-5">{label}</label>
      )}
      <div className="flex text-center">
        {stars.map((index) => (
          <div
            key={index}
            onMouseOver={() => handleMouseOver(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => markRating(index)}
          >
            <FeatherIcon
              name="star"
              className={iconClasses(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

