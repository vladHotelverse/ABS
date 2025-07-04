import { useTranslation } from 'react-i18next';

// Define our own translation type instead of importing from non-existent path
interface ABSLandingTranslations {
  roomTitle: string;
  roomSubtitle: string;
  selectText: string;
  selectedText: string;
  nightText: string;
  learnMoreText: string;
  priceInfoText: string;
  customizeTitle: string;
  customizeSubtitle: string;
  bedsTitle: string;
  locationTitle: string;
  floorTitle: string;
  viewTitle: string;
  noPreferenceLabel: string;
  highFloorLabel: string;
  lowFloorLabel: string;
  quietAreaLabel: string;
  nearElevatorLabel: string;
  oceanViewLabel: string;
  cityViewLabel: string;
  gardenViewLabel: string;
  mountainViewLabel: string;
  kingBedLabel: string;
  queenBedLabel: string;
  twinBedsLabel: string;
  sofaBedLabel: string;
  offersTitle: string;
  offersSubtitle: string;
  specialOffersLabels: Record<string, string>;
  loadingLabel: string;
  errorTitle: string;
  errorMessage: string;
  tryAgainLabel: string;
  bookingConfirmedTitle: string;
  confirmationMessage: string;
  backToHomeLabel: string;
  emptyCartMessage: string;
  totalLabel: string;
  currencySymbol: string;
  selectedRoomLabel: string;
  upgradesLabel: string;
  specialOffersLabel: string;
  subtotalLabel: string;
  taxesLabel: string;
  payAtHotelLabel: string;
  viewTermsLabel: string;
  confirmButtonLabel: string;
  noUpgradesSelectedLabel: string;
  noOffersSelectedLabel: string;
  editLabel: string;
  roomRemovedMessage: string;
  offerRemovedMessagePrefix: string;
  customizationRemovedMessagePrefix: string;
  addedMessagePrefix: string;
  euroSuffix: string;
  checkInLabel: string;
  checkOutLabel: string;
  occupancyLabel: string;
  reservationCodeLabel: string;
  summaryButtonLabel: string;
  removeRoomUpgradeLabel: string;
  exploreLabel: string;
  roomImageAltText: string;
  fromLabel: string;
  multiBookingLabels: Record<string, string>;
}

/**
 * Hook to get ABS component translations
 * This provides structured translations for all ABS components
 */
export const useABSTranslations = (): ABSLandingTranslations => {
  const { t } = useTranslation();

  return {
    // Room section
    roomTitle: t('abs_components.room_selection.title'),
    roomSubtitle: t('abs_components.room_selection.subtitle'),
    selectText: t('abs_components.room_selection.select_text'),
    selectedText: t('abs_components.room_selection.selected_text'),
    nightText: t('abs_components.room_selection.night_text'),
    learnMoreText: t('abs_components.room_selection.learn_more_text'),
    priceInfoText: t('abs_components.room_selection.price_info_text'),

    // Customization section
    customizeTitle: t('abs_components.customization.title'),
    customizeSubtitle: t('abs_components.customization.subtitle'),
    bedsTitle: t('abs_components.customization.beds_title'),
    locationTitle: t('abs_components.customization.location_title'),
    floorTitle: t('abs_components.customization.floor_title'),
    viewTitle: t('abs_components.customization.view_title'),

    // Room customization texts
    noPreferenceLabel: t('abs_components.customization.no_preference_label'),
    highFloorLabel: t('abs_components.customization.high_floor_label'),
    lowFloorLabel: t('abs_components.customization.low_floor_label'),
    quietAreaLabel: t('abs_components.customization.quiet_area_label'),
    nearElevatorLabel: t('abs_components.customization.near_elevator_label'),
    oceanViewLabel: t('abs_components.customization.ocean_view_label'),
    cityViewLabel: t('abs_components.customization.city_view_label'),
    gardenViewLabel: t('abs_components.customization.garden_view_label'),
    mountainViewLabel: t('abs_components.customization.mountain_view_label'),
    kingBedLabel: t('abs_components.customization.king_bed_label'),
    queenBedLabel: t('abs_components.customization.queen_bed_label'),
    twinBedsLabel: t('abs_components.customization.twin_beds_label'),
    sofaBedLabel: t('abs_components.customization.sofa_bed_label'),

    // Special offers section
    offersTitle: t('abs_components.special_offers.title'),
    offersSubtitle: t('abs_components.special_offers.subtitle'),
    specialOffersLabels: {
      perStay: t('abs_components.special_offers.per_stay'),
      perPerson: t('abs_components.special_offers.per_person'),
      perNight: t('abs_components.special_offers.per_night'),
      total: t('abs_components.special_offers.total'),
      bookNow: t('abs_components.special_offers.book_now'),
      numberOfPersons: t('abs_components.special_offers.number_of_persons'),
      numberOfNights: t('abs_components.special_offers.number_of_nights'),
      addedLabel: t('abs_components.special_offers.added_label'),
      popularLabel: t('abs_components.special_offers.popular_label'),
      personsTooltip: t('abs_components.special_offers.persons_tooltip'),
      personsSingularUnit: t('abs_components.special_offers.persons_singular_unit'),
      personsPluralUnit: t('abs_components.special_offers.persons_plural_unit'),
      nightsTooltip: t('abs_components.special_offers.nights_tooltip'),
      nightsSingularUnit: t('abs_components.special_offers.nights_singular_unit'),
      nightsPluralUnit: t('abs_components.special_offers.nights_plural_unit'),
      personSingular: t('abs_components.special_offers.person_singular'),
      personPlural: t('abs_components.special_offers.person_plural'),
      nightSingular: t('abs_components.special_offers.night_singular'),
      nightPlural: t('abs_components.special_offers.night_plural'),
      removeOfferLabel: t('abs_components.special_offers.remove_offer_label'),
      decreaseQuantityLabel: t('abs_components.special_offers.decrease_quantity_label'),
      increaseQuantityLabel: t('abs_components.special_offers.increase_quantity_label'),
      selectDateLabel: t('abs_components.special_offers.select_date_label'),
      selectDateTooltip: t('abs_components.special_offers.select_date_tooltip'),
      dateRequiredLabel: t('abs_components.special_offers.date_required_label'),
    },

    // Booking state section
    loadingLabel: t('abs_components.booking_state.loading_label'),
    errorTitle: t('abs_components.booking_state.error_title'),
    errorMessage: t('abs_components.booking_state.error_message'),
    tryAgainLabel: t('abs_components.booking_state.try_again_label'),
    bookingConfirmedTitle: t('abs_components.booking_state.booking_confirmed_title'),
    confirmationMessage: t('abs_components.booking_state.confirmation_message'),
    backToHomeLabel: t('abs_components.booking_state.back_to_home_label'),

    // Pricing and cart
    emptyCartMessage: t('abs_components.pricing_summary.empty_cart_message'),
    totalLabel: t('abs_components.pricing_summary.total_label'),
    currencySymbol: t('abs_components.pricing_summary.currency_symbol'),
    selectedRoomLabel: t('abs_components.pricing_summary.selected_room_label'),
    upgradesLabel: t('abs_components.pricing_summary.upgrades_label'),
    specialOffersLabel: t('abs_components.pricing_summary.special_offers_label'),
    subtotalLabel: t('abs_components.pricing_summary.subtotal_label'),
    taxesLabel: t('abs_components.pricing_summary.taxes_label'),
    payAtHotelLabel: t('abs_components.pricing_summary.pay_at_hotel_label'),
    viewTermsLabel: t('abs_components.pricing_summary.view_terms_label'),
    confirmButtonLabel: t('abs_components.pricing_summary.confirm_button_label'),
    noUpgradesSelectedLabel: t('abs_components.pricing_summary.no_upgrades_selected_label'),
    noOffersSelectedLabel: t('abs_components.pricing_summary.no_offers_selected_label'),
    editLabel: t('abs_components.pricing_summary.edit_label'),
    roomRemovedMessage: t('abs_components.pricing_summary.room_removed_message'),
    offerRemovedMessagePrefix: t('abs_components.pricing_summary.offer_removed_message_prefix'),
    customizationRemovedMessagePrefix: t('abs_components.pricing_summary.customization_removed_message_prefix'),
    addedMessagePrefix: t('abs_components.pricing_summary.added_message_prefix'),
    euroSuffix: t('abs_components.pricing_summary.euro_suffix'),

    // Booking info
    checkInLabel: t('abs_components.booking_info.check_in_label'),
    checkOutLabel: t('abs_components.booking_info.check_out_label'),
    occupancyLabel: t('abs_components.booking_info.occupancy_label'),
    reservationCodeLabel: t('abs_components.booking_info.reservation_code_label'),

    // UI text
    summaryButtonLabel: t('abs_components.header.summary_tab'),
    removeRoomUpgradeLabel: t('abs_components.pricing_summary.remove_room_upgrade_label'),
    exploreLabel: t('common.explore'),
    roomImageAltText: t('abs_components.pricing_summary.room_image_alt_text'),
    fromLabel: t('abs_components.pricing_summary.from_label'),

    // Multi-booking labels
    multiBookingLabels: {
      title: t('abs_components.multi_booking.title'),
      subtitle: t('abs_components.multi_booking.subtitle'),
      roomsSelected: t('abs_components.multi_booking.rooms_selected'),
      totalPrice: t('abs_components.multi_booking.total_price'),
      confirmAll: t('abs_components.multi_booking.confirm_all'),
      removeRoom: t('abs_components.multi_booking.remove_room'),
      addRoom: t('abs_components.multi_booking.add_room'),
      bookingSummary: t('abs_components.multi_booking.booking_summary'),
      roomDetails: t('abs_components.multi_booking.room_details'),
      guestDetails: t('abs_components.multi_booking.guest_details'),
      pricingDetails: t('abs_components.multi_booking.pricing_details'),
    },
  };
};

/**
 * Get pricing summary panel translations specifically
 */
export const usePricingSummaryTranslations = () => {
  const { t } = useTranslation();
  
  return {
    pricingSummaryLabel: t('abs_components.pricing_summary.title'),
    emptyCartMessage: t('abs_components.pricing_summary.empty_cart_message'),
    totalLabel: t('abs_components.pricing_summary.total_label'),
    subtotalLabel: t('abs_components.pricing_summary.subtotal_label'),
    taxesLabel: t('abs_components.pricing_summary.taxes_label'),
    currencySymbol: t('abs_components.pricing_summary.currency_symbol'),
    selectedRoomLabel: t('abs_components.pricing_summary.selected_room_label'),
    upgradesLabel: t('abs_components.pricing_summary.upgrades_label'),
    specialOffersLabel: t('abs_components.pricing_summary.special_offers_label'),
    payAtHotelLabel: t('abs_components.pricing_summary.pay_at_hotel_label'),
    viewTermsLabel: t('abs_components.pricing_summary.view_terms_label'),
    confirmButtonLabel: t('abs_components.pricing_summary.confirm_button_label'),
    noUpgradesSelectedLabel: t('abs_components.pricing_summary.no_upgrades_selected_label'),
    noOffersSelectedLabel: t('abs_components.pricing_summary.no_offers_selected_label'),
    editLabel: t('abs_components.pricing_summary.edit_label'),
    roomRemovedMessage: t('abs_components.pricing_summary.room_removed_message'),
    offerRemovedMessagePrefix: t('abs_components.pricing_summary.offer_removed_message_prefix'),
    customizationRemovedMessagePrefix: t('abs_components.pricing_summary.customization_removed_message_prefix'),
    addedMessagePrefix: t('abs_components.pricing_summary.added_message_prefix'),
    euroSuffix: t('abs_components.pricing_summary.euro_suffix'),
    removeRoomUpgradeLabel: t('abs_components.pricing_summary.remove_room_upgrade_label'),
    roomImageAltText: t('abs_components.pricing_summary.room_image_alt_text'),
    fromLabel: t('abs_components.pricing_summary.from_label'),
    invalidPricingError: t('abs_components.pricing_summary.invalid_pricing_error'),
  };
};

export default useABSTranslations;