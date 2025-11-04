import type { FC, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
      ? 'sticky top-0 z-10 bg-white/90 backdrop-blur '
      : ''
    return [stickyCls, className].filter(Boolean).join(' ')
  }, [className, sticky])


  if (!tabs.length) {
    return null
  }

  return (
    <div className={containerClass}>
      <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto pl-0.5 py-3">
        {tabs.map((tab) => {
          const isActive = tab.id === effectiveActiveId
          const stateClass = isActive
            ? 'bg-primary text-primary-foreground ring-primary'
            : 'bg-background text-foreground hover:bg-muted'
          return (
            <Button
              key={tab.id}
              type="button"
              variant={isActive ? 'default' : 'ghost'}
              className={cn(stateClass)}
              onClick={() => {
                if (activeId === undefined) {
                  setInternalActiveId(tab.id)
                }
                onChange?.(tab.id)
              }}
            >
              <span>{tab.label}</span>
              {tab.badge ? <span>{tab.badge}</span> : null}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
