import React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export interface TooltipProps {
  text?: string | React.ReactNode
  hoverDelay?: number
  placement?: 'top' | 'right' | 'bottom' | 'left'
  arrowClass?: string
  disabled?: boolean
  children: React.ReactNode
  content?: React.ReactNode
}

export function Tooltip({
  text = '',
  hoverDelay = 0.5,
  placement = 'top',
  arrowClass = 'fill-surface-gray-7',
  disabled = false,
  children,
  content,
}: TooltipProps) {
  const delayDuration = hoverDelay * 1000

  if (disabled) {
    return <>{children}</>
  }

  const hasContent = text || content

  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        {hasContent && (
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side={placement}
              sideOffset={4}
              className="z-[100]"
            >
              <div className="rounded bg-surface-gray-7 px-2 py-1 text-xs text-ink-white shadow-xl">
                {content || text}
              </div>
              <TooltipPrimitive.Arrow
                className={arrowClass}
                width={8}
                height={4}
              />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

