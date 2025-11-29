import React, { useState, useMemo } from 'react'
import { cn } from '../../lib/utils'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type AvatarShape = 'circle' | 'square'

export interface AvatarProps {
  image?: string
  label?: string
  size?: AvatarSize
  shape?: AvatarShape
  children?: React.ReactNode
  className?: string
  indicator?: React.ReactNode
}

export function Avatar({
  image,
  label,
  size = 'md',
  shape = 'circle',
  children,
  className,
  indicator,
}: AvatarProps) {
  const [imgFetchError, setImgFetchError] = useState(false)

  // Shape classes - EXACT COPY from Vue version
  const shapeClasses = useMemo(() => {
    if (shape === 'circle') {
      return 'rounded-full'
    }
    // Square with size-specific rounding
    const squareRounding = {
      xs: 'rounded-[4px]',
      sm: 'rounded-[5px]',
      md: 'rounded-[5px]',
      lg: 'rounded-[6px]',
      xl: 'rounded-[6px]',
      '2xl': 'rounded-[8px]',
      '3xl': 'rounded-[10px]',
    }[size]
    return squareRounding
  }, [shape, size])

  // Size classes - EXACT COPY from Vue version
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
    '3xl': 'w-11.5 h-11.5',
  }[size]

  // Label classes - EXACT COPY from Vue version
  const labelClasses = useMemo(() => {
    const sizeClass = {
      xs: 'text-2xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-base',
      xl: 'text-lg',
      '2xl': 'text-xl',
      '3xl': 'text-2xl',
    }[size]
    return cn('font-medium', sizeClass)
  }, [size])

  // Indicator container classes - EXACT COPY from Vue version
  const indicatorContainerClasses = {
    xs: '-mr-[.1rem] -mb-[.1rem] h-2 w-2',
    sm: '-mr-[.1rem] -mb-[.1rem] h-[9px] w-[9px]',
    md: '-mr-[.1rem] -mb-[.1rem] h-2.5 w-2.5',
    lg: '-mr-[.1rem] -mb-[.1rem] h-3 w-3',
    xl: '-mr-[.1rem] -mb-[.1rem] h-3 w-3',
    '2xl': '-mr-[.1rem] -mb-[.1rem] h-3.5 w-3.5',
    '3xl': '-mr-[.2rem] -mb-[.2rem] h-4 w-4',
  }[size]

  // Indicator classes - EXACT COPY from Vue version
  const indicatorClasses = {
    xs: 'h-1 w-1',
    sm: 'h-[5px] w-[5px]',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
    xl: 'h-2 w-2',
    '2xl': 'h-2.5 w-2.5',
    '3xl': 'h-3 w-3',
  }[size]

  // Icon classes - EXACT COPY from Vue version
  const iconClasses = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-4 w-4',
    xl: 'h-4 w-4',
    '2xl': 'h-5 w-5',
    '3xl': 'h-5 w-5',
  }[size]

  const handleImageError = () => {
    setImgFetchError(true)
  }

  return (
    <div className={cn('relative inline-block shrink-0', sizeClasses, shapeClasses, className)}>
      {image && !imgFetchError ? (
        <img
          src={image}
          alt={label}
          className={cn(shapeClasses, 'h-full w-full object-cover')}
          onError={handleImageError}
        />
      ) : (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-surface-gray-2 uppercase text-ink-gray-5 select-none',
            labelClasses,
            shapeClasses
          )}
        >
          {children ? (
            <div className={iconClasses}>
              {children}
            </div>
          ) : (
            label?.[0]
          )}
        </div>
      )}
      {indicator && (
        <div
          className={cn(
            'absolute bottom-0 right-0 grid place-items-center rounded-full bg-surface-white',
            indicatorContainerClasses
          )}
        >
          <div className={indicatorClasses}>
            {indicator}
          </div>
        </div>
      )}
    </div>
  )
}

