import clsx from 'clsx'
import type React from 'react'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { RoomCard } from './components'
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

  // Local state for room selection and image indices
  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(initialSelectedRoom)
  const [activeImageIndices, setActiveImageIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {}
    roomOptions.forEach((_, index) => {
      indices[index] = 0
    })
    return indices
  })
  
  // Carousel API for controlling room navigation
  const [roomCarouselApi, setRoomCarouselApi] = useState<CarouselApi>()
  
  // Make room carousel API available to child components if needed
  useEffect(() => {
    if (roomCarouselApi) {
      // Store reference for potential child access
      ;(window as any).roomCarouselApi = roomCarouselApi
    }
    return () => {
      delete (window as any).roomCarouselApi
    }
  }, [roomCarouselApi])

  // Generate dynamic amenities for all rooms
  const dynamicAmenitiesMap = useMemo(() => {
    const userCurrentAmenities = currentRoomAmenities || getCurrentRoomAmenities(currentRoomType, roomOptions)
    return getDynamicAmenitiesForAllRooms(roomOptions, currentRoomType, userCurrentAmenities)
  }, [roomOptions, currentRoomType, currentRoomAmenities])

  // Handle room selection
  const handleRoomSelection = useCallback((room: RoomOption | null) => {
    setSelectedRoom(room)
    onRoomSelected?.(room)
  }, [onRoomSelected])

  // Handle image index changes with basic debouncing
  const handleImageChange = useCallback((roomIndex: number, imageIndex: number) => {
    setActiveImageIndices(prev => {
      // Only update if the value actually changed
      if (prev[roomIndex] === imageIndex) {
        return prev
      }
      return {
        ...prev,
        [roomIndex]: imageIndex
      }
    })
  }, [])


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
      onSelectRoom: readonly || mode === 'consultation' ? () => {} : handleRoomSelection,
      onImageChange: (newImageIndex: number) => handleImageChange(roomIndex, newImageIndex),
      onLearnMore,
      onMakeOffer,
      onCancelBid,
    }

    const config: RoomCardConfig = {
      currencySymbol: resolvedTexts.currencySymbol,
      isActive: true, // We'll handle this differently now with carousel
      showPriceSlider: shouldShowSlider,
      minPrice,
      dynamicAmenities: dynamicAmenitiesMap.get(room.id),
      roomIndex,
    }

    const cardState: RoomCardState = {
      selectedRoom,
      activeImageIndex: activeImageIndices[roomIndex] || 0,
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

  // Handle empty state
  if (roomOptions.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-neutral-500">{resolvedTexts.noRoomsAvailableText}</p>
      </div>
    )
  }

  // Single room: No carousel needed
  if (roomOptions.length === 1) {
    const roomCardProps = createRoomCardProps(roomOptions[0], 0)
    return (
      <div className={clsx(className)}>
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
        )}
        
        <div className="flex justify-center">
          <RoomCard {...roomCardProps} />
        </div>
      </div>
    )
  }

  // Multiple rooms: Use shadcn/ui Carousel
  const roomCardPropsArray = roomOptions.map((room, index) => createRoomCardProps(room, index))

  return (
    <div className={clsx(className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      {/* Two rooms: Side by side on desktop, carousel on mobile */}
      {roomOptions.length === 2 ? (
        <>
          {/* Desktop: Side by side */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6">
            {roomCardPropsArray.map((roomCardProps) => (
              <RoomCard key={roomCardProps.room.id} {...roomCardProps} />
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="lg:hidden">
            <div className="overflow-hidden px-6">
              <Carousel 
                setApi={setRoomCarouselApi}
                opts={{
                  align: "center",
                  loop: false,
                  containScroll: false,
                  watchResize: true,
                  watchSlides: true,
                }}
                className="w-full"
              >
                <CarouselContent className="flex">
                  {roomCardPropsArray.map((roomCardProps) => (
                    <CarouselItem 
                      key={roomCardProps.room.id}
                      className="flex-shrink-0"
                      style={{
                        flexBasis: '70%',
                        width: '70%',
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '0 4px',
                      }}
                    >
                      <div style={{ width: '320px', maxWidth: '320px' }}>
                        <RoomCard {...roomCardProps} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-30" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-30" />
              </Carousel>
            </div>
          </div>
        </>
      ) : (
        /* Three or more rooms: Centered carousel with 50/25/25 layout */
        <div className="relative w-full mx-auto">
          <div className="overflow-hidden">
            <Carousel 
              setApi={setRoomCarouselApi}
              opts={{
                align: "center",
                loop: roomOptions.length > 2,
                containScroll: false,
                watchResize: true,
                watchSlides: true,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent 
                className="flex" 
                style={{
                  // Container sized to show exactly center + 2 partial sides
                  width: '100%',
                }}
              >
                {roomCardPropsArray.map((roomCardProps) => (
                  <CarouselItem 
                    key={roomCardProps.room.id} 
                    className="flex-shrink-0"
                    style={{
                      // Each slide is 50% of container width
                      // This means center takes 50%, and each side shows 25%
                      flexBasis: '60%',
                      width: '60%',
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '0 8px',
                    }}
                  >
                      <RoomCard {...roomCardProps} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-30" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-30" />
            </Carousel>
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomSelectionCarousel
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel }
