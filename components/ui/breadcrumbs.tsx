import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Dropdown } from './dropdown'
import { Button } from './button'
import { FeatherIcon } from './feather-icon'
import { cn } from '../../lib/utils'

export interface BreadcrumbItem {
  label: string
  route?: string | { path: string; [key: string]: any }
  onClick?: () => void
  [key: string]: any
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  onNavigate?: (route: string | { path: string; [key: string]: any }) => void
  renderPrefix?: (item: BreadcrumbItem) => React.ReactNode
  renderSuffix?: (item: BreadcrumbItem) => React.ReactNode
}

export function Breadcrumbs({
  items,
  onNavigate,
  renderPrefix,
  renderSuffix,
}: BreadcrumbsProps) {
  const crumbsRef = useRef<HTMLDivElement>(null)
  const [overflowedX, setOverflowedX] = useState(false)

  const filteredItems = useMemo(() => items.filter(Boolean), [items])

  const checkOverflow = useCallback(() => {
    if (!crumbsRef.current) return

    // Temporarily show all items to measure width
    setOverflowedX(false)

    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      if (!crumbsRef.current) return
      const scrollWidth = crumbsRef.current.scrollWidth
      const clientWidth = crumbsRef.current.clientWidth
      setOverflowedX(scrollWidth > clientWidth)
    }, 0)
  }, [])

  useEffect(() => {
    checkOverflow()
  }, [items, checkOverflow])

  useEffect(() => {
    if (!crumbsRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      checkOverflow()
    })

    resizeObserver.observe(crumbsRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [checkOverflow])

  const dropdownItems = useMemo(() => {
    if (!overflowedX) return []
    const allExceptLastTwo = filteredItems.slice(0, -2)
    return allExceptLastTwo.map((item) => {
      const onClick = () => {
        if (item.onClick) {
          item.onClick()
        }
        if (item.route && onNavigate) {
          onNavigate(item.route)
        }
      }
      return {
        label: item.label,
        onClick,
      }
    })
  }, [overflowedX, filteredItems, onNavigate])

  const crumbs = useMemo(
    () => (overflowedX ? filteredItems.slice(-2) : filteredItems),
    [overflowedX, filteredItems]
  )

  const handleItemClick = useCallback(
    (item: BreadcrumbItem) => {
      if (item.onClick) {
        item.onClick()
      }
      if (item.route && onNavigate) {
        onNavigate(item.route)
      }
    },
    [onNavigate]
  )

  return (
    <div ref={crumbsRef} className="flex min-w-0 items-center">
      {overflowedX && (
        <>
          <div className="h-7">
            <Dropdown options={dropdownItems}>
              <Button variant="ghost">
                <FeatherIcon name="more-horizontal" className="w-4 text-ink-gray-5" />
              </Button>
            </Dropdown>
          </div>
          <span className="ml-1 mr-0.5 text-base text-ink-gray-4" aria-hidden="true">
            /
          </span>
        </>
      )}

      <div className="flex min-w-0 items-center text-ellipsis whitespace-nowrap">
        {crumbs.map((item, i) => {
          const isLast = i === crumbs.length - 1
          const itemContent = (
            <>
              {renderPrefix && renderPrefix(item)}
              <span>{item.label}</span>
              {renderSuffix && renderSuffix(item)}
            </>
          )

          if (item.route) {
            return (
              <React.Fragment key={i}>
                <a
                  href={typeof item.route === 'string' ? item.route : item.route.path}
                  onClick={(e) => {
                    e.preventDefault()
                    handleItemClick(item)
                  }}
                  className={cn(
                    'flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3',
                    isLast
                      ? 'text-ink-gray-9'
                      : 'text-ink-gray-5 hover:text-ink-gray-7'
                  )}
                >
                  {itemContent}
                </a>
                {!isLast && (
                  <span
                    className="mx-0.5 text-base text-ink-gray-4"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </React.Fragment>
            )
          }

          return (
            <React.Fragment key={i}>
              <button
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex items-center rounded px-0.5 py-1 text-lg font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-outline-gray-3',
                  isLast
                    ? 'text-ink-gray-9'
                    : 'text-ink-gray-5 hover:text-ink-gray-7'
                )}
              >
                {itemContent}
              </button>
              {!isLast && (
                <span
                  className="mx-0.5 text-base text-ink-gray-4"
                  aria-hidden="true"
                >
                  /
                </span>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

