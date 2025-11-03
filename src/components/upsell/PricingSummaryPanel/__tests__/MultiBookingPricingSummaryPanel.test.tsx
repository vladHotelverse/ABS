import { fireEvent, render, screen } from '@testing-library/react'
import MultiBookingPricingSummaryPanel from '../MultiBookingPricingSummaryPanel'
import { SectionType } from '../types'

const buildPanelProps = () => ({
  rooms: [
    {
      id: 'room-1',
      displayName: 'Room 1',
      guestName: 'Guest 1',
      formattedNights: '2 nights',
      formattedTotal: '$200',
      sections: [
        {
          title: 'Selected services',
          type: SectionType.Customization,
          items: [
            { id: 'item-1', name: 'Service 1', formattedPrice: '$50' },
            { id: 'item-2', name: 'Service 2', formattedPrice: '$75' },
          ],
        },
      ],
    },
    {
      id: 'room-2',
      displayName: 'Room 2',
      guestName: 'Guest 2',
      formattedNights: '3 nights',
      formattedTotal: '$300',
      sections: [
        {
          title: 'Selected services',
          type: SectionType.Customization,
          items: [
            { id: 'item-3', name: 'Service 3', formattedPrice: '$80' },
            { id: 'item-4', name: 'Service 4', formattedPrice: '$90' },
          ],
        },
      ],
    },
  ],
  formattedBookings: [],
  formattedOverallTotal: '$500',
  labels: {
    subtotalLabel: 'Subtotal',
    totalLabel: 'Total',
    payAtHotelLabel: 'Pay at hotel',
    viewTermsLabel: 'View terms',
    confirmButtonLabel: 'Confirm',
    loadingLabel: 'Loading',
    emptyCartMessage: 'Empty',
    removeLabel: 'Remove',
    roomsCountLabel: 'Rooms',
    singleRoomLabel: 'Room',
    exploreLabel: 'Explore',
    fromLabel: 'From',
    customizeStayTitle: 'Customize',
    chooseOptionsSubtitle: 'Choose',
    currencySymbol: '$',
    pricingSummaryLabel: 'Pricing summary',
    processingLabel: 'Processing',
    roomTotalLabel: 'Room total',
  },
})

describe('MultiBookingPricingSummaryPanel', () => {
  it('allows toggling accordions in uncontrolled mode', () => {
    const onActiveRoomsChange = vi.fn()
    render(
      <MultiBookingPricingSummaryPanel
        {...buildPanelProps()}
        exclusiveAccordion
        onActiveRoomsChange={onActiveRoomsChange}
      />
    )

    const roomButtons = screen.getAllByRole('button', { name: /expand details$/i })
    expect(roomButtons).toHaveLength(2)

    fireEvent.click(roomButtons[1])

    expect(onActiveRoomsChange).toHaveBeenCalledWith(['room-2'])
  })
})
