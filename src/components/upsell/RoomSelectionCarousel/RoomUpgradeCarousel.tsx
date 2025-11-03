'use client'

import type React from 'react'
import { cn } from '@/lib/utils'
import RoomCarouselContent from './components/RoomCarouselContent'
import RoomCarouselNavigation from './components/RoomCarouselNavigation'
import { SingleRoomLayout } from './components/SingleRoomLayout'
import { TwoRoomLayout } from './components/TwoRoomLayout'
import { useCarouselState } from './hooks/useCarouselState'
import { useRoomCardProps } from './hooks/useRoomCardProps'
import type { RoomCardTranslations, RoomUpgradeCarouselProps } from './types'

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

  // Convert translations to RoomCardTranslations format
  const roomCardTranslations: RoomCardTranslations = {
    nightText: translations.nightText,
    learnMoreText: translations.learnMoreText,
    priceInfoText: translations.priceInfoText,
    selectedText: translations.selectedText,
    selectText: translations.selectText,
    removeText: translations.removeText,
    previousImageLabel: translations.previousImageLabel,
    nextImageLabel: translations.nextImageLabel,
    viewImageLabel: translations.viewImageLabel,
  }

  // Use shared room card props hook
  const roomCardPropsArray = useRoomCardProps({
    roomOptions,
    translations: roomCardTranslations,
    selectedRoom,
    activeImageIndices,
    readonly: false,
    handleRoomSelection,
    handleImageChange,
    enableHoverZoom,
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
