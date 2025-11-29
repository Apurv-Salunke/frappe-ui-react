import { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react'
import { Tab } from '@headlessui/react'
import { cn } from '../../lib/utils'

export interface TabItem {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  [key: string]: any
}

export interface TabsContextValue {
  tabIndex: number
  tabs: TabItem[]
  vertical: boolean
  setTabIndex: (index: number) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

export interface TabsProps {
  tabs: TabItem[]
  defaultIndex?: number
  selectedIndex?: number
  onIndexChange?: (index: number) => void
  vertical?: boolean
  as?: 'div' | 'template'
  className?: string
  children?: ReactNode
  renderTabItem?: (props: { tab: TabItem; selected: boolean }) => ReactNode
  renderTabPanel?: (props: { tab: TabItem }) => ReactNode
}

export function Tabs({
  tabs,
  defaultIndex = 0,
  selectedIndex: controlledIndex,
  onIndexChange,
  vertical = false,
  as = 'template',
  className,
  children,
  renderTabItem,
  renderTabPanel,
}: TabsProps) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex)
  const isControlled = controlledIndex !== undefined
  const selectedIndex = isControlled ? controlledIndex : internalIndex

  const handleIndexChange = (index: number) => {
    if (!isControlled) {
      setInternalIndex(index)
    }
    onIndexChange?.(index)
  }

  const contextValue: TabsContextValue = {
    tabIndex: selectedIndex,
    tabs,
    vertical,
    setTabIndex: handleIndexChange,
  }

  const content = (
    <TabsContext.Provider value={contextValue}>
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={handleIndexChange}
        vertical={vertical}
      >
        {children || (
          <>
            <TabList renderTabItem={renderTabItem} />
            <TabPanels renderTabPanel={renderTabPanel} />
          </>
        )}
      </Tab.Group>
    </TabsContext.Provider>
  )

  if (as === 'template') {
    return content
  }

  return (
    <div
      className={cn(
        'flex flex-1 overflow-hidden',
        vertical ? '' : 'flex-col',
        className
      )}
    >
      {content}
    </div>
  )
}

export interface TabListProps {
  renderTabItem?: (props: { tab: TabItem; selected: boolean }) => ReactNode
}

export function TabList({ renderTabItem }: TabListProps) {
  const { tabIndex, tabs, vertical } = useTabsContext()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const indicatorRef = useRef<HTMLDivElement>(null)
  const [transitionClass, setTransitionClass] = useState('')

  function moveIndicator(index: number) {
    if (!indicatorRef.current || index >= tabRefs.current.length) {
      return
    }
    const selectedTab = tabRefs.current[index]
    if (!selectedTab) return

    if (vertical) {
      indicatorRef.current.style.height = `${selectedTab.offsetHeight}px`
      indicatorRef.current.style.top = `${selectedTab.offsetTop}px`
    } else {
      indicatorRef.current.style.width = `${selectedTab.offsetWidth}px`
      indicatorRef.current.style.left = `${selectedTab.offsetLeft}px`
    }
  }

  useEffect(() => {
    if (tabIndex >= tabs.length) {
      return
    }
    setTransitionClass('transition-all duration-300 ease-in-out')
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => moveIndicator(tabIndex), 0)
  }, [tabIndex, tabs.length, vertical])

  useEffect(() => {
    // Initial positioning
    setTimeout(() => moveIndicator(tabIndex), 100)
  }, [])

  return (
    <Tab.List
      className={cn(
        'relative flex',
        vertical
          ? 'flex-col border-r overflow-y-auto'
          : 'gap-7.5 border-b overflow-x-auto items-center px-5'
      )}
    >
      {tabs.map((tab, i) => (
        <Tab
          key={i}
          className={({ selected }) =>
            cn(
              'flex items-center gap-1.5 text-base duration-300 ease-in-out hover:text-ink-gray-9 focus:outline-none focus:transition-none',
              selected ? 'text-ink-gray-9' : 'text-ink-gray-5',
              vertical
                ? 'py-2.5 px-4 border-r border-transparent hover:border-outline-gray-3'
                : 'py-3 border-b border-transparent hover:border-outline-gray-3'
            )
          }
          ref={(node) => {
            if (node) {
              tabRefs.current[i] = node as HTMLButtonElement
            }
          }}
        >
          {renderTabItem
            ? renderTabItem({ tab, selected: i === tabIndex })
            : (
              <>
                {tab.icon && <tab.icon className="size-4" />}
                {tab.label}
              </>
            )}
        </Tab>
      ))}
      <div
        ref={indicatorRef}
        className={cn(
          'tab-indicator absolute bg-surface-gray-7',
          vertical ? 'right-0 w-px' : 'bottom-0 h-px',
          transitionClass
        )}
      />
    </Tab.List>
  )
}

export interface TabPanelsProps {
  renderTabPanel?: (props: { tab: TabItem }) => ReactNode
}

export function TabPanels({ renderTabPanel }: TabPanelsProps) {
  const { tabs } = useTabsContext()

  return (
    <Tab.Panels className="flex flex-1 overflow-hidden">
      {tabs.map((tab, i) => (
        <Tab.Panel
          key={i}
          className="flex flex-1 flex-col overflow-y-auto focus:outline-none"
        >
          {renderTabPanel ? renderTabPanel({ tab }) : null}
        </Tab.Panel>
      ))}
    </Tab.Panels>
  )
}

