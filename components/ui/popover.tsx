import React, { useState, useRef, useEffect, useCallback } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'

export type PopoverPlacement =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

export interface PopoverProps {
  show?: boolean
  trigger?: 'click' | 'hover'
  hoverDelay?: number
  leaveDelay?: number
  placement?: PopoverPlacement
  popoverClass?: string
  transition?: 'default' | null
  hideOnBlur?: boolean
  matchTargetWidth?: boolean
  children: React.ReactNode
  content: React.ReactNode
  onOpenChange?: (open: boolean) => void
  onOpen?: () => void
  onClose?: () => void
}

export function Popover({
  show: controlledShow,
  trigger = 'click',
  hoverDelay = 0,
  leaveDelay = 0.5,
  placement = 'bottom-start',
  popoverClass = '',
  transition = null,
  hideOnBlur = true,
  matchTargetWidth = false,
  children,
  content,
  onOpenChange,
  onOpen,
  onClose,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const pointerOverTargetOrPopup = useRef(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const leaveTimer = useRef<NodeJS.Timeout | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledShow !== undefined
  const open = isControlled ? controlledShow : internalOpen

  // Parse placement - EXACT COPY from Vue version
  const placementSide = placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'
  const placementAlign = (placement.split('-')[1] || 'center') as 'start' | 'center' | 'end'

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value)
      }
      onOpenChange?.(value)
      if (value) {
        onOpen?.()
      } else {
        onClose?.()
      }
    },
    [isControlled, onOpenChange, onOpen, onClose]
  )

  const handleMouseOver = useCallback(() => {
    pointerOverTargetOrPopup.current = true
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
      leaveTimer.current = null
    }
    if (trigger === 'hover') {
      if (hoverDelay) {
        hoverTimer.current = setTimeout(() => {
          if (pointerOverTargetOrPopup.current) {
            setOpen(true)
          }
        }, hoverDelay * 1000)
      } else {
        setOpen(true)
      }
    }
  }, [trigger, hoverDelay, setOpen])

  const handleMouseLeave = useCallback(() => {
    pointerOverTargetOrPopup.current = false
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    if (trigger === 'hover') {
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current)
      }
      if (leaveDelay) {
        leaveTimer.current = setTimeout(() => {
          if (!pointerOverTargetOrPopup.current) {
            setOpen(false)
          }
        }, leaveDelay * 1000)
      } else {
        if (!pointerOverTargetOrPopup.current) {
          setOpen(false)
        }
      }
    }
  }, [trigger, leaveDelay, setOpen])

  const handleInteractOutside = useCallback(
    (event: Event) => {
      if (!hideOnBlur) {
        event.preventDefault()
        return
      }

      const target = event.target as Element
      if (
        anchorRef.current &&
        (anchorRef.current.contains(target) || anchorRef.current === target)
      ) {
        event.preventDefault()
        return
      }
    },
    [hideOnBlur]
  )

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current)
      }
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current)
      }
    }
  }, [])

  const hasTransition = transition === 'default'

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <div
          ref={anchorRef}
          className="flex"
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side={placementSide}
          align={placementAlign}
          style={{
            minWidth: matchTargetWidth
              ? 'var(--radix-popover-trigger-width)'
              : undefined,
          }}
          className={cn('PopoverContent', hasTransition && 'has-transition')}
          onMouseOver={() => {
            pointerOverTargetOrPopup.current = true
          }}
          onMouseLeave={handleMouseLeave}
          onInteractOutside={handleInteractOutside}
        >
          <div className={cn('relative body-container', popoverClass)}>
            {content || (
              <div className="rounded-lg border bg-surface-modal shadow-xl">
                {content}
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

