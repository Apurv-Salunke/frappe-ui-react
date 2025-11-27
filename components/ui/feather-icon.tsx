import React from 'react'
import feather from 'feather-icons'
import { cn } from '../../lib/utils'

export interface FeatherIconProps {
  name: string
  className?: string
  color?: string
  strokeWidth?: number
}

const validIcons = Object.keys(feather.icons)

export function FeatherIcon({ 
  name, 
  className, 
  color, 
  strokeWidth = 1.5 
}: FeatherIconProps) {
  let icon = feather.icons[name]
  
  if (!icon) {
    console.warn(`[frappe-ui-react] Invalid icon name: ${name}`)
    icon = feather.icons['circle']
  }

  const iconAttrs = icon.attrs || {}
  
  return (
    <svg
      {...iconAttrs}
      fill="none"
      stroke="currentColor"
      color={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      width={null}
      height={null}
      className={cn('shrink-0', className)}
      dangerouslySetInnerHTML={{ __html: icon.contents }}
    />
  )
}

// Export valid icon names for TypeScript autocomplete
export const validIconNames = validIcons

