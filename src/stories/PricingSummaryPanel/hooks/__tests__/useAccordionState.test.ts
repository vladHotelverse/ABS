import { act, renderHook } from '@testing-library/react'
import { SectionType } from '@/components/upsell/PricingSummaryPanel/types'
import type { MultiBookingPricingSummaryPanelProps } from '@/components/upsell/PricingSummaryPanel/MultiBookingPricingSummaryPanel'
import useAccordionState from '../useAccordionState'

type Room = MultiBookingPricingSummaryPanelProps['rooms'][number]

const buildRoom = (id: string, itemCount: number): Room => ({
  id,
  displayName: `Room ${id}`,
  guestName: `Guest ${id}`,
  formattedNights: '2 nights',
  formattedTotal: '€100.00',
  sections: [
    {
      title: 'Selected items',
      type: SectionType.Customization,
      items: Array.from({ length: itemCount }, (_, index) => ({
        id: `${id}-item-${index}`,
        name: `Item ${index}`,
        formattedPrice: '€10.00',
      })),
    },
  ],
  guestCount: 2,
})

const buildRooms = (): MultiBookingPricingSummaryPanelProps['rooms'] => [
  buildRoom('room-a', 1),
  buildRoom('room-b', 0),
  buildRoom('room-c', 2),
]

describe('useAccordionState', () => {
  it('initializes with rooms that contain items when not exclusive', () => {
    const { result } = renderHook(() => useAccordionState({ rooms: buildRooms() }))

    expect(result.current.initialActiveRooms).toEqual(['room-a', 'room-c'])
    expect(result.current.activeRooms).toEqual(['room-a', 'room-c'])
  })

  it('returns only the first room with items when exclusive', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        rooms: buildRooms(),
        exclusiveAccordion: true,
      })
    )

    expect(result.current.initialActiveRooms).toEqual(['room-a'])
    expect(result.current.activeRooms).toEqual(['room-a'])
  })

  it('honors explicit initial room configuration', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        rooms: buildRooms(),
        initialRoomIds: ['room-c'],
      })
    )

    expect(result.current.initialActiveRooms).toEqual(['room-c'])
    expect(result.current.activeRooms).toEqual(['room-c'])
  })

  it('allows toggling rooms in non-exclusive mode', () => {
    const { result } = renderHook(() => useAccordionState({ rooms: buildRooms() }))

    act(() => {
      result.current.toggleRoom('room-b')
    })

    expect(result.current.activeRooms).toEqual(['room-a', 'room-c', 'room-b'])

    act(() => {
      result.current.toggleRoom('room-a')
    })

    expect(result.current.activeRooms).toEqual(['room-c', 'room-b'])
  })

  it('enforces single selection in exclusive mode when toggling', () => {
    const { result } = renderHook(() =>
      useAccordionState({
        rooms: buildRooms(),
        exclusiveAccordion: true,
      })
    )

    act(() => {
      result.current.toggleRoom('room-c')
    })

    expect(result.current.activeRooms).toEqual(['room-c'])

    act(() => {
      result.current.toggleRoom('room-c')
    })

    expect(result.current.activeRooms).toEqual([])
  })

  it('can accept external active room updates', () => {
    const { result } = renderHook(() => useAccordionState({ rooms: buildRooms() }))

    act(() => {
      result.current.setActiveRooms(['room-b'])
    })

    expect(result.current.activeRooms).toEqual(['room-b'])
  })
})
