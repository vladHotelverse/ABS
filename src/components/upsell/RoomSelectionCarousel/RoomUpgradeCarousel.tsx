'use client'

import type React from 'react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import RoomCarouselContent from './components/RoomCarouselContent'
import RoomCarouselNavigation from './components/RoomCarouselNavigation'
import { SingleRoomLayout } from './components/SingleRoomLayout'
import { TwoRoomLayout } from './components/TwoRoomLayout'
import { useCarouselState } from './hooks/useCarouselState'
import { useRoomCardProps } from './hooks/useRoomCardProps'
import { useUpgradeAutoCenter } from './hooks/useUpgradeAutoCenter'
import type { RoomUpgradeCarouselProps } from './types'
import { adaptUpgradeTranslations, createSimpleAmenitiesMap } from './utils/translationAdapters'

const RoomUpgradeCarousel: React.FC<RoomUpgradeCarouselProps> = ({
  roomOptions,
  initialSelectedRoom,
  onRoomSelected,
  translations,
  className,
  enableHoverZoom = true,
}) => {
  // Use consolidated carousel state management hook
  const {
    selectedRoom,
    activeImageIndices,
    roomCarouselApi,
    current,
    count,
    setRoomCarouselApi,
    handleRoomSelection,
    handleImageChange,
  } = useCarouselState({
    roomOptions,
    initialSelectedRoom,
    onRoomSelected,
  })

  // Use existing auto-center hook for multi-room scenarios
  const { handleRoomSelectionWithCenter } = useUpgradeAutoCenter({
    selectedRoomId: selectedRoom?.id || null,
    roomCarouselApi,
    roomOptions,
    onRoomSelection: handleRoomSelection,
  })

  // Convert upgrade translations to format expected by shared hooks
  const resolvedTexts = useMemo(() => adaptUpgradeTranslations(translations), [translations])

  // Create simple amenities map for upgrade scenarios
  const dynamicAmenitiesMap = useMemo(() => createSimpleAmenitiesMap(roomOptions), [roomOptions])

  // Use shared room card props hook
  const roomCardPropsArray = useRoomCardProps({
    roomOptions,
    resolvedTexts,
    selectedRoom,
    activeImageIndices,
    dynamicAmenitiesMap,
    readonly: false,
    mode: 'selection',
    handleRoomSelection,
    handleImageChange,
    enableHoverZoom,
    handleRoomSelectionWithCenter,
  })

  // Determine layout based on room count
  const roomCount = roomOptions.length

  // Single room layout
  if (roomCount === 1) {
    return (
      <div className={cn(className)}>
        <SingleRoomLayout roomCardPropsArray={roomCardPropsArray} className="w-full" />
      </div>
    )
  }

  // Two room layout
  if (roomCount === 2) {
    return (
      <div className={cn(className)}>
        <TwoRoomLayout
          roomCardPropsArray={roomCardPropsArray}
          roomCarouselApi={roomCarouselApi}
          setRoomCarouselApi={setRoomCarouselApi}
          current={current}
          className="w-full"
        />
      </div>
    )
  }

  // Multi-room carousel layout (3+ rooms)
  return (
    <div className={cn(className)}>
      <div className="relative">
        <RoomCarouselContent
          roomCardPropsArray={roomCardPropsArray}
          current={current}
          setRoomCarouselApi={setRoomCarouselApi}
          className="w-full"
        />

        <RoomCarouselNavigation
          roomCarouselApi={roomCarouselApi}
          current={current}
          count={count}
          roomOptions={roomOptions}
          showArrows={true}
          showDots={true}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default RoomUpgradeCarousel
