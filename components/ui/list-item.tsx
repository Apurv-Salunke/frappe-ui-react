import { ReactNode, useMemo } from 'react'

export interface ListItemProps {
  title: string
  subtitle?: string
  children?: ReactNode
  renderActions?: () => ReactNode
  renderSubtitle?: () => ReactNode
}

export function ListItem({
  title,
  subtitle,
  children,
  renderActions,
  renderSubtitle,
}: ListItemProps) {
  const secondaryText = useMemo(() => {
    if (!subtitle) return null
    return subtitle.replace(/\n/g, '<br>')
  }, [subtitle])

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h3 className="text-base font-medium text-gray-900">{title}</h3>
        {(secondaryText || renderSubtitle) && (
          <div className="mt-1">
            {renderSubtitle ? (
              renderSubtitle()
            ) : secondaryText ? (
              <span
                className="text-base text-gray-600"
                dangerouslySetInnerHTML={{ __html: secondaryText }}
              />
            ) : null}
          </div>
        )}
      </div>
      {renderActions && <div>{renderActions()}</div>}
      {children && <div>{children}</div>}
    </div>
  )
}

