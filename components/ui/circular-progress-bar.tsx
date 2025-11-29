import { useMemo } from 'react'
import { FeatherIcon } from './feather-icon'
import { cn } from '../../lib/utils'

export type Variant = 'solid' | 'outline'

export type Theme = 'black' | 'red' | 'green' | 'blue' | 'orange'
export interface ThemeProps {
  primary: string
  secondary: string
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export interface SizeProps {
  ringSize: string
  ringBarWidth: string
  innerTextFontSize: string
  checkIconSize: string
}

export interface CircularProgressBarProps {
  step: number
  totalSteps: number
  showPercentage?: boolean
  variant?: Variant
  theme?: Theme | ThemeProps
  size?: Size
  themeComplete?: string
}

// Predefined sizes for the circular progress bar
const sizeMap: Record<Size, SizeProps> = {
  xs: {
    ringSize: '30px',
    ringBarWidth: '6px',
    innerTextFontSize: '12px',
    checkIconSize: '16px',
  },
  sm: {
    ringSize: '42px',
    ringBarWidth: '10px',
    innerTextFontSize: '16px',
    checkIconSize: '20px',
  },
  md: {
    ringSize: '60px',
    ringBarWidth: '14px',
    innerTextFontSize: '20px',
    checkIconSize: '24px',
  },
  lg: {
    ringSize: '84px',
    ringBarWidth: '18px',
    innerTextFontSize: '24px',
    checkIconSize: '40px',
  },
  xl: {
    ringSize: '108px',
    ringBarWidth: '22px',
    innerTextFontSize: '28px',
    checkIconSize: '48px',
  },
}

// Predefined themes for the circular progress bar
const themeMap: Record<Theme, ThemeProps> = {
  black: {
    primary: '#333',
    secondary: '#888',
  },
  red: {
    primary: '#FF0000',
    secondary: '#FFD7D7',
  },
  green: {
    primary: '#22C55E',
    secondary: '#b1ffda',
  },
  blue: {
    primary: '#2376f5',
    secondary: '#D7D7FF',
  },
  orange: {
    primary: '#FFA500',
    secondary: '#FFE5CC',
  },
}

export function CircularProgressBar({
  step,
  totalSteps,
  showPercentage = false,
  variant = 'solid',
  theme: themeProp = 'black',
  size: sizeProp = 'md',
  themeComplete = 'lightgreen',
}: CircularProgressBarProps) {
  const size = useMemo(() => sizeMap[sizeProp] || sizeMap['md'], [sizeProp])

  const theme = useMemo(() => {
    if (typeof themeProp === 'string') {
      return themeMap[themeProp as Theme] || themeMap['black']
    }
    return themeProp
  }, [themeProp])

  const progress = useMemo(() => (step / totalSteps) * 100, [step, totalSteps])
  const isCompleted = useMemo(() => step === totalSteps, [step, totalSteps])

  // Adjust font size for percentage display
  const innerTextFontSize = useMemo(() => {
    if (showPercentage) {
      // Slightly smaller font for percentage
      const baseSize = parseInt(size.innerTextFontSize)
      return `${Math.max(baseSize - 4, 8)}px`
    }
    return size.innerTextFontSize
  }, [showPercentage, size.innerTextFontSize])

  const style = useMemo(
    () => ({
      '--size': size.ringSize,
      '--bar-width': size.ringBarWidth,
      '--font-size': innerTextFontSize,
      '--check-icon-size': size.checkIconSize,
      '--color-progress': theme.primary,
      '--color-remaining-circle': theme.secondary,
      '--color-complete': themeComplete,
      '--progress': `${progress}%`,
    } as React.CSSProperties),
    [size, innerTextFontSize, theme, themeComplete, progress]
  )

  return (
    <div
      className={cn(
        'circular-progress-bar',
        'relative rounded-full grid place-items-center',
        isCompleted && 'completed',
        variant === 'outline' && 'fillOuter'
      )}
      role="progressbar"
      style={style}
    >
      {!isCompleted ? (
        <div className="z-[2] relative" style={{ fontSize: innerTextFontSize }}>
          {showPercentage ? (
            <p>{progress.toFixed(0)}%</p>
          ) : (
            <p>{step}</p>
          )}
        </div>
      ) : (
        <div
          className="check-icon z-[3]"
          style={{ width: size.checkIconSize, height: size.checkIconSize }}
        >
          <FeatherIcon name="check" className="w-full h-full" />
        </div>
      )}
    </div>
  )
}

