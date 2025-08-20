import clsx from 'clsx'
import type React from 'react'
import { useMemo } from 'react'
import { SingleRoomLayout, TwoRoomLayout, MultiRoomLayout } from './components'
import { useCarouselState } from './hooks/useCarouselState'
import { useDragHandlers } from './hooks/useDragHandlers'
import type { RoomSelectionCarouselProps, RoomSelectionCarouselTranslations } from './types'
import type { RoomCardTranslations, RoomCardHandlers, RoomCardConfig, RoomCardState, RoomOption } from './types'
import { getDynamicAmenitiesForAllRooms, getCurrentRoomAmenities } from './utils/amenitiesSelector'

const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = ({
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
  showPriceSlider = true,
  variant = 'basic',
  translations,
  currentRoomType = 'DELUXE SILVER',
  currentRoomAmenities,
  mode = 'selection',
  readonly = false,
  // Deprecated individual props - keeping for backward compatibility
  learnMoreText,
  nightText,
  priceInfoText,
  makeOfferText,
  availabilityText,
  selectedText,
  selectText,
  proposePriceText,
  currencyText,
  currencySymbol,
  offerMadeText,
  discountBadgeText,
  bidSubmittedText,
  updateBidText,
  cancelBidText,
  upgradeNowText,
  removeText,
  activeBid,
}) => {
  // Helper function to resolve text values (new translations object takes precedence)
  const getTranslation = (
    key: keyof Omit<RoomSelectionCarouselTranslations, 'navigationLabels'>,
    fallbackValue?: string,
    defaultValue = ''
  ): string => {
    if (translations?.[key]) {
      return translations[key] as string
    }
    return fallbackValue || defaultValue
  }

  // Helper function to get navigation labels
  const getNavigationLabel = (
    key: keyof RoomSelectionCarouselTranslations['navigationLabels'],
    fallbackValue?: string,
    defaultValue = ''
  ): string => {
    if (translations?.navigationLabels?.[key]) {
      return translations.navigationLabels[key]
    }
    return fallbackValue || defaultValue
  }

  // Resolve all text values with backward compatibility
  const resolvedTexts = {
    learnMoreText: getTranslation('learnMoreText', learnMoreText, 'Descubre más detalles'),
    nightText: getTranslation('nightText', nightText, '/noche'),
    priceInfoText: getTranslation('priceInfoText', priceInfoText, 'Información sobre tarifas e impuestos.'),
    makeOfferText: getTranslation('makeOfferText', makeOfferText, 'Hacer oferta'),
    availabilityText: getTranslation('availabilityText', availabilityText, 'Sujeto a disponibilidad'),
    selectedText: getTranslation('selectedText', selectedText, 'SELECCIONADO'),
    selectText: getTranslation('selectText', selectText, 'SELECCIONAR'),
    proposePriceText: getTranslation('proposePriceText', proposePriceText, 'Propon tu precio:'),
    currencyText: getTranslation('currencyText', currencyText, 'EUR'),
    currencySymbol: getTranslation('currencySymbol', currencySymbol, '€'),
    upgradeNowText: getTranslation('upgradeNowText', upgradeNowText, 'Upgrade now'),
    removeText: getTranslation('removeText', removeText, 'Remove'),
    offerMadeText: getTranslation('offerMadeText', offerMadeText, 'Has propuesto {price} EUR por noche'),
    discountBadgeText: getTranslation('discountBadgeText', discountBadgeText, '-{percentage}%'),
    noRoomsAvailableText: getTranslation('noRoomsAvailableText', undefined, 'No hay habitaciones disponibles.'),
    bidSubmittedText: getTranslation('bidSubmittedText', bidSubmittedText, 'Bid submitted'),
    updateBidText: getTranslation('updateBidText', updateBidText, 'Update bid'),
    cancelBidText: getTranslation('cancelBidText', cancelBidText, 'Cancel'),
    // Navigation labels
    previousRoom: getNavigationLabel('previousRoom', undefined, 'Previous room'),
    nextRoom: getNavigationLabel('nextRoom', undefined, 'Next room'),
    previousRoomMobile: getNavigationLabel('previousRoomMobile', undefined, 'Previous room (mobile)'),
    nextRoomMobile: getNavigationLabel('nextRoomMobile', undefined, 'Next room (mobile)'),
    goToRoom: getNavigationLabel('goToRoom', undefined, 'Go to room {index}'),
    previousImage: getNavigationLabel('previousImage', undefined, 'Previous image'),
    nextImage: getNavigationLabel('nextImage', undefined, 'Next image'),
    viewImage: getNavigationLabel('viewImage', undefined, 'View image {index}'),
  }

  // Generate dynamic amenities for all rooms
  const dynamicAmenitiesMap = useMemo(() => {
    const userCurrentAmenities = currentRoomAmenities || getCurrentRoomAmenities(currentRoomType, roomOptions)
    return getDynamicAmenitiesForAllRooms(roomOptions, currentRoomType, userCurrentAmenities)
  }, [roomOptions, currentRoomType, currentRoomAmenities])

  // Use separated carousel state management (without slider logic)
  const { state, actions } = useCarouselState({
    roomOptions,
    initialSelectedRoom,
    onRoomSelected,
  })

  // Drag handlers for room carousel navigation
  const roomCarouselDragHandlers = useDragHandlers({
    onDragStart: actions.startDrag,
    onDragMove: actions.updateDrag,
    onDragEnd: (options) => actions.endDrag({ roomCount: roomOptions.length, ...options }),
    disabled: roomOptions.length <= 1,
  })


  // Determine if slider should be shown (disabled in consultation mode)
  const shouldShowSlider = (showPriceSlider || variant === 'with-slider') && mode === 'selection' && !readonly

  // Helper function to create grouped props for RoomCard
  const createRoomCardProps = (room: RoomOption, roomIndex: number) => {
    const translations: RoomCardTranslations = {
      discountBadgeText: resolvedTexts.discountBadgeText,
      nightText: resolvedTexts.nightText,
      learnMoreText: resolvedTexts.learnMoreText,
      priceInfoText: resolvedTexts.priceInfoText,
      selectedText: resolvedTexts.selectedText,
      selectText: resolvedTexts.upgradeNowText || resolvedTexts.selectText,
      removeText: resolvedTexts.removeText,
      instantConfirmationText: 'Instant Confirmation',
      bidSubmittedText: resolvedTexts.bidSubmittedText,
      previousImageLabel: resolvedTexts.previousImage,
      nextImageLabel: resolvedTexts.nextImage,
      viewImageLabel: resolvedTexts.viewImage,
      proposePriceText: resolvedTexts.proposePriceText,
      availabilityText: resolvedTexts.availabilityText,
      currencyText: resolvedTexts.currencyText,
      offerMadeText: resolvedTexts.offerMadeText,
      updateBidText: resolvedTexts.updateBidText,
      cancelBidText: resolvedTexts.cancelBidText,
      makeOfferText: resolvedTexts.makeOfferText,
    }

    const handlers: RoomCardHandlers = {
      onSelectRoom: readonly || mode === 'consultation' ? () => {} : actions.selectRoom,
      onImageChange: (newImageIndex: number) => actions.setActiveImageIndex(roomIndex, newImageIndex),
      onLearnMore,
      onMakeOffer,
      onCancelBid,
    }

    const config: RoomCardConfig = {
      currencySymbol: resolvedTexts.currencySymbol,
      isActive: state.activeIndex === roomIndex,
      showPriceSlider: shouldShowSlider,
      minPrice,
      dynamicAmenities: dynamicAmenitiesMap.get(room.id),
      roomIndex,
    }

    const cardState: RoomCardState = {
      selectedRoom: state.selectedRoom,
      activeImageIndex: state.activeImageIndices[roomIndex] || 0,
      activeBid,
    }

    return {
      room,
      translations,
      handlers,
      config,
      state: cardState,
    }
  }

  if (roomOptions.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-neutral-500">{resolvedTexts.noRoomsAvailableText}</p>
      </div>
    )
  }

  // Handle different room counts with different layouts
  if (roomOptions.length === 1) {
    // Single room: No carousel, just display the room card
    return (
      <SingleRoomLayout
        className={className}
        title={title}
        subtitle={subtitle}
        roomCardProps={createRoomCardProps(roomOptions[0], 0)}
      />
    )
  }

  if (roomOptions.length === 2) {
    // Two rooms: Show side by side on large screens, carousel on mobile
    const roomCardPropsArray = roomOptions.map((room, index) => createRoomCardProps(room, index))
    
    return (
      <TwoRoomLayout
        className={className}
        title={title}
        subtitle={subtitle}
        roomCardPropsArray={roomCardPropsArray}
        state={state}
        dragHandlers={roomCarouselDragHandlers}
        onPrevSlide={actions.prevSlide}
        onNextSlide={actions.nextSlide}
        onSetActiveIndex={actions.setActiveIndex}
        navigationLabels={{
          previousRoomMobile: resolvedTexts.previousRoomMobile,
          nextRoomMobile: resolvedTexts.nextRoomMobile,
          goToRoom: resolvedTexts.goToRoom,
        }}
      />
    )
  }

  // Three or more rooms: Full carousel behavior
  const roomCardPropsArray = roomOptions.map((room, index) => createRoomCardProps(room, index))
  
  return (
    <MultiRoomLayout
      className={className}
      title={title}
      subtitle={subtitle}
      roomCardPropsArray={roomCardPropsArray}
      state={state}
      dragHandlers={roomCarouselDragHandlers}
      onPrevSlide={actions.prevSlide}
      onNextSlide={actions.nextSlide}
      onSetActiveIndex={actions.setActiveIndex}
      navigationLabels={{
        previousRoom: resolvedTexts.previousRoom,
        nextRoom: resolvedTexts.nextRoom,
        previousRoomMobile: resolvedTexts.previousRoomMobile,
        nextRoomMobile: resolvedTexts.nextRoomMobile,
        goToRoom: resolvedTexts.goToRoom,
      }}
    />
  )
}

export default RoomSelectionCarousel
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel }
