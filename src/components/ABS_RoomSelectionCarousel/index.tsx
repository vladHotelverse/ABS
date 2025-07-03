import clsx from 'clsx'
import type React from 'react'
import { CarouselNavigation, PriceSlider, RoomCard, useSlider } from './components'
import { useCarouselState } from './hooks/useCarouselState'
import type { RoomSelectionCarouselProps, RoomSelectionCarouselTranslations } from './types'

const RoomSelectionCarousel: React.FC<RoomSelectionCarouselProps> = ({
  className,
  title,
  subtitle,
  roomOptions,
  initialSelectedRoom = null,
  onRoomSelected,
  onMakeOffer,
  onLearnMore,
  minPrice = 10,
  showPriceSlider = false,
  variant = 'basic',
  translations,
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
    offerMadeText: getTranslation('offerMadeText', offerMadeText, 'Has propuesto {price} EUR por noche'),
    discountBadgeText: getTranslation('discountBadgeText', discountBadgeText, '-{percentage}%'),
    noRoomsAvailableText: getTranslation('noRoomsAvailableText', undefined, 'No hay habitaciones disponibles.'),
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

  // Use separated carousel state management (without slider logic)
  const { state, actions } = useCarouselState({
    roomOptions,
    initialSelectedRoom,
    onRoomSelected,
  })

  // Determine if slider should be shown
  const shouldShowSlider = showPriceSlider || variant === 'with-slider'

  // Only initialize slider logic when needed
  const sliderData = useSlider({
    roomOptions,
    activeIndex: state.activeIndex,
    minPrice,
    onMakeOffer,
    offerMadeText: resolvedTexts.offerMadeText,
  })

  // Create a reusable slider component render function
  const renderPriceSlider = (containerClass = '') => {
    if (!shouldShowSlider) return null

    return (
      <div className={clsx('mt-6', containerClass)}>
        <PriceSlider
          proposedPrice={sliderData.proposedPrice}
          minPrice={minPrice}
          maxPrice={sliderData.maxPrice}
          nightText={resolvedTexts.nightText}
          makeOfferText={resolvedTexts.makeOfferText}
          availabilityText={resolvedTexts.availabilityText}
          proposePriceText={resolvedTexts.proposePriceText}
          currencyText={resolvedTexts.currencyText}
          onPriceChange={sliderData.setProposedPrice}
          onMakeOffer={sliderData.makeOffer}
        />
      </div>
    )
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
      <div className={clsx(className)}>
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
        )}

        <div className="w-full max-w-md mx-auto">
          <RoomCard
            room={roomOptions[0]}
            discountBadgeText={resolvedTexts.discountBadgeText}
            nightText={resolvedTexts.nightText}
            learnMoreText={resolvedTexts.learnMoreText}
            priceInfoText={resolvedTexts.priceInfoText}
            selectedText={resolvedTexts.selectedText}
            selectText={resolvedTexts.selectText}
            selectedRoom={state.selectedRoom}
            onSelectRoom={actions.selectRoom}
            activeImageIndex={state.activeImageIndices[0] || 0}
            onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(0, newImageIndex)}
            currencySymbol={resolvedTexts.currencySymbol}
            onLearnMore={onLearnMore}
            previousImageLabel={resolvedTexts.previousImage}
            nextImageLabel={resolvedTexts.nextImage}
            viewImageLabel={resolvedTexts.viewImage}
          />
        </div>

        {/* Price Slider for single room if needed */}
        {renderPriceSlider('max-w-md mx-auto')}
      </div>
    )
  }

  if (roomOptions.length === 2) {
    // Two rooms: Show side by side on large screens, carousel on mobile
    return (
      <div className={clsx(className)}>
        {/* Title and Subtitle */}
        {(title || subtitle) && (
          <div className="mb-6 text-center">
            {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
            {subtitle && <p className="text-neutral-600">{subtitle}</p>}
          </div>
        )}

        {/* Desktop: Side by side layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {roomOptions.map((room, index) => (
            <div key={room.id}>
              <RoomCard
                room={room}
                discountBadgeText={resolvedTexts.discountBadgeText}
                nightText={resolvedTexts.nightText}
                learnMoreText={resolvedTexts.learnMoreText}
                priceInfoText={resolvedTexts.priceInfoText}
                selectedText={resolvedTexts.selectedText}
                selectText={resolvedTexts.selectText}
                selectedRoom={state.selectedRoom}
                onSelectRoom={actions.selectRoom}
                activeImageIndex={state.activeImageIndices[index] || 0}
                onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                currencySymbol={resolvedTexts.currencySymbol}
                onLearnMore={onLearnMore}
                previousImageLabel={resolvedTexts.previousImage}
                nextImageLabel={resolvedTexts.nextImage}
                viewImageLabel={resolvedTexts.viewImage}
              />
            </div>
          ))}
        </div>

        {/* Mobile/Tablet: Carousel layout */}
        <div className="lg:hidden">
          <div className="relative w-full overflow-visible h-full">
            <div className="w-full relative perspective-[1000px] h-[550px] overflow-hidden">
              {roomOptions.map((room, index) => (
                <div
                  key={room.id}
                  className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                    'left-0 z-10': state.activeIndex === index,
                    'left-[-100%] z-5 opacity-70': state.activeIndex !== index && index === 0,
                    'left-[100%] z-5 opacity-70': state.activeIndex !== index && index === 1,
                  })}
                >
                  <RoomCard
                    room={room}
                    discountBadgeText={resolvedTexts.discountBadgeText}
                    nightText={resolvedTexts.nightText}
                    learnMoreText={resolvedTexts.learnMoreText}
                    priceInfoText={resolvedTexts.priceInfoText}
                    selectedText={resolvedTexts.selectedText}
                    selectText={resolvedTexts.selectText}
                    selectedRoom={state.selectedRoom}
                    onSelectRoom={actions.selectRoom}
                    activeImageIndex={state.activeImageIndices[index] || 0}
                    onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                    currencySymbol={resolvedTexts.currencySymbol}
                    onLearnMore={onLearnMore}
                    previousImageLabel={resolvedTexts.previousImage}
                    nextImageLabel={resolvedTexts.nextImage}
                    viewImageLabel={resolvedTexts.viewImage}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={actions.prevSlide}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                aria-label={resolvedTexts.previousRoomMobile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="flex gap-2">
                {roomOptions.map((room, index) => (
                  <button
                    key={`room-dot-${room.id}`}
                    onClick={() => actions.setActiveIndex(index)}
                    className={clsx('h-2 w-2 rounded-full transition-all duration-200', {
                      'bg-black': state.activeIndex === index,
                      'bg-neutral-300': state.activeIndex !== index,
                    })}
                    aria-label={resolvedTexts.goToRoom.replace('{index}', (index + 1).toString())}
                  />
                ))}
              </div>

              <button
                onClick={actions.nextSlide}
                className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                aria-label={resolvedTexts.nextRoomMobile}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Price Slider for two rooms */}
        {renderPriceSlider('max-w-md mx-auto lg:max-w-none')}
      </div>
    )
  }

  // Three or more rooms: Full carousel behavior
  return (
    <div className={clsx(className)}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="mb-6 text-center">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {subtitle && <p className="text-neutral-600">{subtitle}</p>}
        </div>
      )}

      <div className="lg:col-span-2">
        {/* Slider Container with Visible Cards */}
        <div className="relative w-full overflow-visible h-full">
          {/* Main Carousel Area */}
          <div className="w-full relative perspective-[1000px] h-[550px] overflow-hidden">
            {roomOptions.map((room, index) => (
              <div
                key={room.id}
                className={clsx('w-full absolute transition-all duration-500 ease-in-out', {
                  'left-0 z-10 sm:w-1/2 sm:left-1/4': state.activeIndex === index,
                  'left-[-100%] z-5 opacity-70 sm:w-1/2 sm:left-[-30%]':
                    index === (state.activeIndex - 1 + roomOptions.length) % roomOptions.length,
                  'left-[100%] z-5 opacity-70 sm:w-1/2 sm:left-[80%]':
                    index === (state.activeIndex + 1) % roomOptions.length,
                })}
              >
                <RoomCard
                  room={room}
                  discountBadgeText={resolvedTexts.discountBadgeText}
                  nightText={resolvedTexts.nightText}
                  learnMoreText={resolvedTexts.learnMoreText}
                  priceInfoText={resolvedTexts.priceInfoText}
                  selectedText={resolvedTexts.selectedText}
                  selectText={resolvedTexts.selectText}
                  selectedRoom={state.selectedRoom}
                  onSelectRoom={actions.selectRoom}
                  activeImageIndex={state.activeImageIndices[index] || 0}
                  onImageChange={(newImageIndex: number) => actions.setActiveImageIndex(index, newImageIndex)}
                  currencySymbol={resolvedTexts.currencySymbol}
                  onLearnMore={onLearnMore}
                  previousImageLabel={resolvedTexts.previousImage}
                  nextImageLabel={resolvedTexts.nextImage}
                  viewImageLabel={resolvedTexts.viewImage}
                />
              </div>
            ))}
          </div>

          {/* Desktop Carousel Navigation - Only visible on Desktop */}
          <CarouselNavigation
            onPrev={actions.prevSlide}
            onNext={actions.nextSlide}
            previousLabel={resolvedTexts.previousRoom}
            nextLabel={resolvedTexts.nextRoom}
          />
        </div>

        {/* Mobile/Tablet Carousel Controls */}
        <div className="lg:hidden flex justify-center items-center gap-4 mt-4">
          <button
            onClick={actions.prevSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={resolvedTexts.previousRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="flex gap-2">
            {roomOptions.map((room, index) => (
              <button
                key={`${room.id}-indicator`}
                onClick={() => actions.setActiveIndex(index)}
                className={clsx('h-2 w-2 rounded-full transition-all duration-200', {
                  'bg-black': state.activeIndex === index,
                  'bg-neutral-300': state.activeIndex !== index,
                })}
                aria-label={resolvedTexts.goToRoom.replace('{index}', (index + 1).toString())}
              />
            ))}
          </div>

          <button
            onClick={actions.nextSlide}
            className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            aria-label={resolvedTexts.nextRoomMobile}
          >
            <svg
              className="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Price Slider for three+ rooms */}
      {renderPriceSlider()}
    </div>
  )
}

export default RoomSelectionCarousel
export { RoomSelectionCarousel as ABS_RoomSelectionCarousel }
