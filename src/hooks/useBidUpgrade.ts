import { useState, useCallback, useMemo } from 'react'

export interface BidItem {
  id: string
  roomId: string
  roomName: string
  bidAmount: number
  originalPrice?: number
  status: 'pending' | 'submitted' | 'accepted' | 'rejected'
  targetRoom?: any // Will be typed properly when RoomOption is available
  submittedAt?: Date
}

export interface UseBidUpgradeProps {
  onBidSubmit?: (bid: BidItem) => void
  onBidRemove?: (bidId: string) => void
}

export interface UseBidUpgradeReturn {
  bids: BidItem[]
  activeBid: BidItem | undefined
  addBid: (price: number, room: { id: string; roomType: string; price: number }) => void
  removeBid: (bidId: string) => void
  updateBidStatus: (bidId: string, status: BidItem['status']) => void
  totalBidAmount: number
}

export const useBidUpgrade = ({ onBidSubmit, onBidRemove }: UseBidUpgradeProps = {}): UseBidUpgradeReturn => {
  const [bids, setBids] = useState<BidItem[]>([])

  // Add a new bid for a room upgrade
  const addBid = useCallback((price: number, room: { id: string; roomType: string; price: number }) => {
    const newBid: BidItem = {
      id: `bid-${Date.now()}-${room.id}`,
      roomId: room.id,
      roomName: room.roomType,
      originalPrice: room.price,
      bidAmount: price,
      status: 'submitted',
      targetRoom: room,
      submittedAt: new Date(),
    }

    setBids((_prevBids) => {
      // Remove any existing bids (only one active bid allowed)
      return [newBid]
    })
    
    onBidSubmit?.(newBid)
  }, [onBidSubmit])

  // Remove a bid
  const removeBid = useCallback(
    (bidId: string) => {
      setBids((prevBids) => {
        const bidToRemove = prevBids.find((bid) => bid.id === bidId)
        if (bidToRemove) {
          onBidRemove?.(bidId)
        }
        return prevBids.filter((bid) => bid.id !== bidId)
      })
    },
    [onBidRemove]
  )

  // Update bid status
  const updateBidStatus = useCallback((bidId: string, status: BidItem['status']) => {
    setBids((prevBids) => 
      prevBids.map((bid) => 
        bid.id === bidId ? { ...bid, status } : bid
      )
    )
  }, [])

  // Get the active bid (only one allowed)
  const activeBid = useMemo(() => bids[0], [bids])

  // Calculate total bid amount
  const totalBidAmount = useMemo(() => {
    return bids
      .filter(bid => bid.status === 'submitted' || bid.status === 'accepted')
      .reduce((total, bid) => total + bid.bidAmount, 0)
  }, [bids])

  return {
    bids,
    activeBid,
    addBid,
    removeBid,
    updateBidStatus,
    totalBidAmount,
  }
}