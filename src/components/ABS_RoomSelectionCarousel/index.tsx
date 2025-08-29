import clsx from 'clsx'
import type React from 'react'
import { useMemo } from 'react'
import { SingleRoomLayout, TwoRoomLayout, MultiRoomLayout } from './components'
import type { RoomSelectionCarouselProps } from './types'
import { useCarouselState, useTranslations, useRoomCardProps } from './hooks'
import { getDynamicAmenitiesForAllRooms, getCurrentRoomAmenities } from './utils/amenitiesSelector'

const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = (props) => {
  const {
    className,
    title,
    subtitle,
    roomOptions,
    initialSelectedRoom = null,
    onRoomSelected,
    onMakeOffer,
    onLearnMore,
    onCancelBid,
    minPrice = 10,
    showPriceSlider = false,
    variant = 'basic',
    translations,
    currentRoomType = 'DELUXE SILVER',
    currentRoomAmenities,
    mode = 'selection',
    readonly = false,
    activeBid,
    contextRoomId,
    roomSpecificSelections,
  } = props

  // Use custom hooks for state management and translations
  const resolvedTexts = useTranslations({
    translations,
    fallbackProps: {},
  })

  // Use custom hooks for state management
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
    contextRoomId,
    roomSpecificSelections,
  })

  // Generate dynamic amenities for all rooms
  const dynamicAmenitiesMap = useMemo(() => {
    const userCurrentAmenities = currentRoomAmenities || getCurrentRoomAmenities(currentRoomType, roomOptions)
    return getDynamicAmenitiesForAllRooms(roomOptions, currentRoomType, userCurrentAmenities)
  }, [roomOptions, currentRoomType, currentRoomAmenities])

  // Determine if slider should be shown (disabled in consultation mode)
  const shouldShowSlider = (showPriceSlider || variant === 'with-slider') && mode === 'selection' && !readonly

  // Use custom hook for room card props creation
  const roomCardPropsArray = useRoomCardProps({
    roomOptions,
    resolvedTexts,
    selectedRoom,
    activeImageIndices,
    activeBid,
    dynamicAmenitiesMap,
    shouldShowSlider,
    minPrice,
    readonly,
    mode,
    handleRoomSelection,
    handleImageChange,
    onLearnMore,
    onMakeOffer,
    onCancelBid,
  })

  // Handle empty state
  if (roomOptions.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-neutral-500">{resolvedTexts.noRoomsAvailableText}</p>
      </div>
    )
  }

  // Common props for all layouts
  const commonLayoutProps = {
    title,
    subtitle,
    className,
    roomCardPropsArray,
    roomCarouselApi,
    setRoomCarouselApi,
    current,
    count,
  }

  // Single room: No carousel needed
  if (roomOptions.length === 1) {
    return <SingleRoomLayout {...commonLayoutProps} />
  }

  // Two rooms: Side by side on desktop, carousel on mobile
  if (roomOptions.length === 2) {
    return <TwoRoomLayout {...commonLayoutProps} />
  }

  // Multiple rooms: Use carousel with pagination
  return <MultiRoomLayout {...commonLayoutProps} roomOptions={roomOptions} />
}

export default RoomSelectionCarousel
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel }