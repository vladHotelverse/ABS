import type { FC, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

export type TabsStripTab = {
  id: string
  label: string
  badge?: ReactNode
}

export type TabsStripProps = {
  tabs: TabsStripTab[]
  activeId?: string
  defaultActiveId?: string
  sticky?: boolean
  className?: string
  onChange?: (id: string) => void
}

export const TabsStrip: FC<TabsStripProps> = ({
  tabs,
  activeId,
  defaultActiveId,
  sticky = true,
  className,
  onChange,
}) => {
  const [internalActiveId, setInternalActiveId] = useState<string | undefined>(
    activeId ?? defaultActiveId ?? tabs[0]?.id
  )

  useEffect(() => {
    if (activeId !== undefined) return
    setInternalActiveId(defaultActiveId ?? tabs[0]?.id)
  }, [activeId, defaultActiveId, tabs])

  const effectiveActiveId = activeId ?? internalActiveId

  const containerClass = useMemo(() => {
    const stickyCls = sticky
      ? 'sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border'
      : 'border-b border-border'
    return [stickyCls, className].filter(Boolean).join(' ')
  }, [className, sticky])

  const baseButtonClass =
    'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition shadow-sm ring-1 ring-border'

  if (!tabs.length) {
    return null
  }

  return (
    <div className={containerClass}>
      <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-3">
        {tabs.map((tab) => {
          const isActive = tab.id === effectiveActiveId
          const stateClass = isActive
            ? 'bg-primary text-primary-foreground ring-primary'
            : 'bg-background text-foreground hover:bg-muted'
          return (
            <button
              key={tab.id}
              type="button"
              className={`${baseButtonClass} ${stateClass}`}
              onClick={() => {
                if (activeId === undefined) {
                  setInternalActiveId(tab.id)
                }
                onChange?.(tab.id)
              }}
            >
              <span>{tab.label}</span>
              {tab.badge ? <span>{tab.badge}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
