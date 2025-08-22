import clsx from 'clsx'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Check } from 'lucide-react'
import { UiButton } from '../ui/button'

export interface RoomTab {
  id: string
  roomName: string
  roomNumber: string
  guestName: string
}

export interface RoomTabsProps {
  className?: string
  roomTabs: RoomTab[]
  activeRoomId?: string
  onRoomTabClick?: (roomId: string) => void
  isSticky?: boolean
  headerHeight?: number
}

const RoomTabs: React.FC<RoomTabsProps> = ({
  className,
  roomTabs,
  activeRoomId,
  onRoomTabClick,
  isSticky = true,
  headerHeight = 50,
}) => {
  const [stickyTop, setStickyTop] = useState(headerHeight)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!isSticky) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const headerIsVisible = scrollY < headerHeight

      setStickyTop(headerIsVisible ? headerHeight : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isSticky, headerHeight])

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!roomTabs.length) return

      const { key } = event

      if (key === 'ArrowRight' || key === 'ArrowLeft') {
        event.preventDefault()

        // If no tab is focused, start with the first one
        let newIndex = focusedIndex === -1 ? 0 : focusedIndex

        if (key === 'ArrowRight') {
          newIndex = newIndex < roomTabs.length - 1 ? newIndex + 1 : 0
        } else {
          newIndex = newIndex > 0 ? newIndex - 1 : roomTabs.length - 1
        }

        setFocusedIndex(newIndex)
        buttonRefs.current[newIndex]?.focus()
      } else if ((key === 'Enter' || key === ' ') && focusedIndex >= 0) {
        event.preventDefault()
        const room = roomTabs[focusedIndex]
        onRoomTabClick?.(room.id)
      }
    },
    [focusedIndex, roomTabs, onRoomTabClick]
  )

  // Handle focus events
  const handleButtonFocus = useCallback((index: number) => {
    setFocusedIndex(index)
  }, [])

  const handleButtonBlur = useCallback(() => {
    // Small delay to prevent flicker when moving between buttons
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setFocusedIndex(-1)
      }
    }, 10)
  }, [])

  // Handle clicks - ensure focus index is updated
  const handleButtonClick = useCallback(
    (roomId: string, index: number) => {
      setFocusedIndex(index)
      onRoomTabClick?.(roomId)
    },
    [onRoomTabClick]
  )

  if (!roomTabs.length) return null

  return (
    <div
      ref={containerRef}
      className={clsx(
        'bg-black text-white border-t border-white/10 shadow-md transition-all duration-300 ease-in-out',
        isSticky && 'sticky z-100',
        className
      )}
      style={isSticky ? { top: `${stickyTop}px` } : undefined}
      onKeyDown={handleKeyDown}
      role="tablist"
      aria-label="Room tabs navigation"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide max-w-full">
            {roomTabs.map((room, index) => {
              const isActive = activeRoomId === room.id
              return (
                <UiButton
                  key={room.id}
                  ref={(el) => {
                    buttonRefs.current[index] = el
                  }}
                  onClick={() => handleButtonClick(room.id, index)}
                  onFocus={() => handleButtonFocus(index)}
                  onBlur={handleButtonBlur}
                  variant={isActive ? 'default' : 'secondary'}
                  size="sm"
                  className={clsx(
                    'flex-shrink-0 transition-all duration-200',
                    isActive ? 'bg-white text-black hover:bg-gray-100' : 'bg-white/10 text-white hover:bg-white/20',
                    focusedIndex === index && 'ring-2 ring-white/50 ring-offset-2 ring-offset-black'
                  )}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`room-panel-${room.id}`}
                  tabIndex={0}
                  aria-label={`Switch to ${room.roomName} - Room ${room.roomNumber} for ${room.guestName}`}
                >
                  <div className="flex items-center space-x-2">
                    {isActive && <Check className="w-4 h-4" />}
                    <div className="flex flex-col items-start min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{room.roomNumber}</span>
                        <span className="opacity-75">•</span>
                        <span className="truncate max-w-20 md:max-w-none">{room.guestName}</span>
                      </div>
                      <div className="text-xs opacity-75 truncate max-w-32 md:max-w-none">
                        {room.roomName}
                      </div>
                    </div>
                  </div>
                </UiButton>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Memoize the component to prevent unnecessary re-renders
export default React.memo(RoomTabs)
