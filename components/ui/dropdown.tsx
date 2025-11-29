import React, { useState, useCallback } from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '../../lib/utils'
import { FeatherIcon } from './feather-icon'
import { Button, ButtonProps } from './button'
import { Switch } from './switch'

export type DropdownOption = {
  label: string
  icon?: string | React.ComponentType<{ className?: string }> | null
  switch?: boolean
  disabled?: boolean
  switchValue?: boolean
  theme?: 'gray' | 'red'
  component?: React.ComponentType<any>
  onClick?: (val: any) => void
  route?: string
  condition?: () => boolean
  submenu?: DropdownOptions
}

export type DropdownGroupOption = {
  key?: number
  group: string
  items: DropdownOption[]
  hideLabel?: boolean
  theme?: 'gray' | 'red'
}

export type DropdownItem = DropdownOption | DropdownGroupOption
export type DropdownOptions = Array<DropdownItem>

export interface DropdownProps {
  button?: ButtonProps
  options?: DropdownOptions
  placement?: 'left' | 'right' | 'center'
  side?: 'top' | 'right' | 'bottom' | 'left'
  offset?: number
  children?: React.ReactNode
  onOpenChange?: (open: boolean) => void
}

export function Dropdown({
  button,
  options = [],
  placement = 'left',
  side = 'bottom',
  offset = 4,
  children,
  onOpenChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [onOpenChange]
  )

  const handleItemClick = useCallback(
    (item: DropdownOption, event: Event) => {
      if (item.route) {
        // Handle routing if needed (would need router integration)
        window.location.href = item.route
      } else if (item.onClick) {
        item.onClick(event)
      }
    },
    []
  )

  const normalizeDropdownItem = useCallback((option: DropdownOption): DropdownOption => {
    return {
      ...option,
      label: option.label,
      theme: option.theme || 'gray',
      icon: option.icon,
      component: option.component,
      onClick: (event: Event) => handleItemClick(option, event),
      submenu: option.submenu,
    }
  }, [handleItemClick])

  const getIconColor = (item: DropdownOption) => {
    if (item.disabled) return 'text-ink-gray-4'
    return item.theme === 'red' ? 'text-ink-red-3' : 'text-ink-gray-6'
  }

  const getTextColor = (item: DropdownOption) => {
    if (item.disabled) return 'text-ink-gray-4'
    return item.theme === 'red' ? 'text-ink-red-3' : 'text-ink-gray-7'
  }

  const getBackgroundColor = (item: DropdownOption) =>
    item.theme === 'red'
      ? 'focus:bg-surface-red-3 data-[highlighted]:bg-surface-red-3 data-[state=open]:bg-surface-red-3'
      : 'focus:bg-surface-gray-3 data-[highlighted]:bg-surface-gray-3 data-[state=open]:bg-surface-gray-3'

  const getSubmenuBackgroundColor = (item: DropdownOption) =>
    getBackgroundColor(item) +
    ' data-[state=open]:bg-surface-' +
    (item.theme === 'red' ? 'red-3' : 'gray-3')

  const filterOptions = useCallback(
    (opts: DropdownOption[]): DropdownOption[] => {
      return (opts || [])
        .filter(Boolean)
        .filter((option) => (option.condition ? option.condition() : true))
        .map((option) => normalizeDropdownItem(option))
    },
    [normalizeDropdownItem]
  )

  const processOptionsIntoGroups = useCallback(
    (opts: DropdownOptions): DropdownGroupOption[] => {
      let groups: DropdownGroupOption[] = []
      let currentGroup: DropdownGroupOption | null = null
      let i = 0

      for (let option of opts) {
        if (option == null) {
          continue
        }

        if ('group' in option) {
          if (currentGroup) {
            groups.push(currentGroup)
            currentGroup = null
          }
          let groupOption = {
            key: i,
            ...option,
            items: filterOptions(option.items),
          } as DropdownGroupOption
          groups.push(groupOption)
        } else {
          if (!currentGroup) {
            currentGroup = {
              key: i,
              group: '',
              hideLabel: true,
              items: [],
            } as DropdownGroupOption
          }
          currentGroup.items.push(...filterOptions([option as DropdownOption]))
        }
        i++
      }

      if (currentGroup) {
        groups.push(currentGroup)
      }

      return groups
    },
    [filterOptions]
  )

  const groupHasIcons = (group: DropdownGroupOption) => {
    return group.items.some((item) => item.icon)
  }

  const groups = processOptionsIntoGroups(options)

  const align =
    placement === 'left'
      ? 'start'
      : placement === 'right'
        ? 'end'
        : placement === 'center'
          ? 'center'
          : 'start'

  // CSS classes - EXACT COPY from Vue version
  const cssClasses = {
    dropdownContent:
      'min-w-40 divide-y divide-outline-gray-modals rounded-lg bg-surface-modal shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-content',
    groupContainer: 'p-1.5',
    groupLabel: 'flex h-7 items-center px-2 text-sm font-medium',
    itemLabel: 'whitespace-nowrap',
    itemIcon: 'mr-2 h-4 w-4 flex-shrink-0',
    itemIconPlaceholder: 'mr-2 h-4 w-4 flex-shrink-0',
    chevronIcon: 'ml-auto h-4 w-4 flex-shrink-0',
    itemButton:
      'group flex h-7 w-full items-center rounded px-2 text-base focus:outline-none',
    submenuTrigger:
      'group flex h-7 w-full items-center rounded px-2 text-base text-ink-gray-6 focus:outline-none',
  }

  const renderIcon = (item: DropdownOption) => {
    if (!item.icon) return null
    if (typeof item.icon === 'string') {
      return (
        <FeatherIcon
          name={item.icon}
          className={cn(cssClasses.itemIcon, getIconColor(item))}
          aria-hidden="true"
        />
      )
    }
    const IconComponent = item.icon
    return (
      <IconComponent
        className={cn(cssClasses.itemIcon, getIconColor(item))}
        aria-hidden="true"
      />
    )
  }

  const renderItem = (item: DropdownOption, group: DropdownGroupOption) => {
    if (item.switch) {
      return (
        <div className={cssClasses.itemButton}>
          {renderIcon(item)}
          <span className={cn(cssClasses.itemLabel, getTextColor(item))}>
            {item.label}
          </span>
          <div className="ml-auto">
            <Switch
              labelClasses="font-normal cursor-pointer"
              checked={item.switchValue || false}
              onCheckedChange={(checked) => item.onClick?.(checked)}
            />
          </div>
        </div>
      )
    }

    if (item.submenu) {
      return (
        <DropdownMenuPrimitive.Sub>
          <DropdownMenuPrimitive.SubTrigger
            className={cn(
              cssClasses.submenuTrigger,
              getSubmenuBackgroundColor(item)
            )}
          >
            {renderIcon(item)}
            {!item.icon && groupHasIcons(group) && (
              <div className={cssClasses.itemIconPlaceholder} />
            )}
            <span className={cn(cssClasses.itemLabel, getTextColor(item))}>
              {item.label}
            </span>
            <FeatherIcon
              name="chevron-right"
              className={cn(cssClasses.chevronIcon, getIconColor(item))}
              aria-hidden="true"
            />
          </DropdownMenuPrimitive.SubTrigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.SubContent
              className={cssClasses.dropdownContent}
              sideOffset={4}
            >
              {processOptionsIntoGroups(item.submenu).map((submenuGroup) => (
                <div key={submenuGroup.key} className={cssClasses.groupContainer}>
                  {submenuGroup.group && !submenuGroup.hideLabel && (
                    <DropdownMenuPrimitive.Label
                      className={cssClasses.groupLabel}
                    >
                      {submenuGroup.group}
                    </DropdownMenuPrimitive.Label>
                  )}
                  {submenuGroup.items.map((subItem) => {
                    if (subItem.switch) {
                      return (
                        <div key={subItem.label} className={cssClasses.itemButton}>
                          {renderIcon(subItem)}
                          <span
                            className={cn(cssClasses.itemLabel, getTextColor(subItem))}
                          >
                            {subItem.label}
                          </span>
                          <div className="ml-auto">
                            <Switch
                              labelClasses="font-normal cursor-pointer"
                              checked={subItem.switchValue || false}
                              onCheckedChange={(checked) => subItem.onClick?.(checked)}
                            />
                          </div>
                        </div>
                      )
                    }
                    return (
                      <DropdownMenuPrimitive.Item
                        key={subItem.label}
                        disabled={subItem.disabled}
                        className={cn(
                          'data-[disabled]:cursor-not-allowed',
                          cssClasses.itemButton,
                          getBackgroundColor(subItem)
                        )}
                        onSelect={(e) => {
                          e.preventDefault()
                          handleItemClick(subItem, e as unknown as Event)
                        }}
                      >
                        {renderIcon(subItem)}
                        {!subItem.icon && groupHasIcons(submenuGroup) && (
                          <div className={cssClasses.itemIconPlaceholder} />
                        )}
                        <span
                          className={cn(cssClasses.itemLabel, getTextColor(subItem))}
                        >
                          {subItem.label}
                        </span>
                      </DropdownMenuPrimitive.Item>
                    )
                  })}
                </div>
              ))}
            </DropdownMenuPrimitive.SubContent>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Sub>
      )
    }

    return (
      <DropdownMenuPrimitive.Item
        disabled={item.disabled}
        className={cn(
          'data-[disabled]:cursor-not-allowed',
          cssClasses.itemButton,
          getBackgroundColor(item)
        )}
        onSelect={(e) => {
          e.preventDefault()
          handleItemClick(item, e as unknown as Event)
        }}
      >
        {renderIcon(item)}
        {!item.icon && groupHasIcons(group) && (
          <div className={cssClasses.itemIconPlaceholder} />
        )}
        <span className={cn(cssClasses.itemLabel, getTextColor(item))}>
          {item.label}
        </span>
      </DropdownMenuPrimitive.Item>
    )
  }

  return (
    <DropdownMenuPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuPrimitive.Trigger asChild>
        {children || (
          <Button {...button}>
            {button?.label || 'Options'}
          </Button>
        )}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={cn(
            cssClasses.dropdownContent,
            {
              'origin-top-left': placement === 'left',
              'origin-top-right': placement === 'right',
              'origin-top': placement === 'center',
            }
          )}
          side={side}
          align={align}
          sideOffset={offset}
        >
          {groups.map((group) => {
            if (group.items.length === 0) return null
            return (
              <div key={group.key} className={cssClasses.groupContainer}>
                {group.group && !group.hideLabel && (
                  <DropdownMenuPrimitive.Label
                    className={cn(cssClasses.groupLabel, getTextColor(group as any))}
                  >
                    {group.group}
                  </DropdownMenuPrimitive.Label>
                )}
                {group.items.map((item) => (
                  <React.Fragment key={item.label}>
                    {renderItem(item, group)}
                  </React.Fragment>
                ))}
              </div>
            )
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  )
}

