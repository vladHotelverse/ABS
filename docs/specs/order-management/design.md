# Order Management System - Design

## Component Architecture

```typescript
// Main order status interface
const ABS_OrderStatus: React.FC = ({
  orderId,
  onOrderUpdate
}) => {
  const { order, loading, error } = useOrderData(orderId)
  const { proposals } = useHotelProposals(orderId)
  
  return (
    <div className="order-status-container">
      <OrderHeader order={order} />
      <OrderStatusProgress status={order.status} />
      <HotelProposalsSection 
        proposals={proposals}
        onProposalAction={handleProposalResponse}
      />
      <OrderDetails order={order} />
      <ModificationOptions order={order} />
    </div>
  )
}
```

## State Management

```typescript
interface OrderData {
  id: string
  status: 'pending' | 'confirmed' | 'modified' | 'cancelled'
  guestInfo: GuestInfo
  reservationDetails: ReservationDetails
  selectedItems: PricingItem[]
  proposals: HotelProposal[]
  totalPrice: number
  currency: string
  createdAt: string
  updatedAt: string
}

interface HotelProposal {
  id: string
  type: 'upgrade' | 'alternative' | 'addon'
  description: string
  pricing: PricingDetails
  validUntil: string
  status: 'pending' | 'accepted' | 'rejected'
}
```

## Communication System

- Email notifications for status changes
- Real-time updates through WebSocket connections
- Guest portal access with reservation codes
- Hotel staff dashboard for order management