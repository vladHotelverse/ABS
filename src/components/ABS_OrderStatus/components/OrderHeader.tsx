import type React from 'react'
import clsx from 'clsx'
import BookingInfoBar from '../../ABS_BookingInfoBar'
import type { OrderData } from '../../../services/orderStorage'
import { formatBookingIdForDisplay } from '../../../utils/bookingIdGenerator'

export interface OrderHeaderProps {
  orderData: OrderData
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderData }) => {
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    modified: 'bg-blue-100 text-blue-800',
  }
  
  return (
    <div className="rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Order #{formatBookingIdForDisplay(orderData.id)}
          </h1>
          <p className="text-gray-600">
            Created on {new Date(orderData.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className={clsx(
          'px-3 py-1 rounded-full text-sm font-medium',
          statusColors[orderData.status]
        )}>
          {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
        </div>
      </div>
      
      {/* Booking Info Bar */}
      <BookingInfoBar
        items={[
          {
            icon: 'Calendar',
            label: 'Check-in',
            value: orderData.userInfo.checkIn
          },
          {
            icon: 'Calendar', 
            label: 'Check-out',
            value: orderData.userInfo.checkOut
          },
          {
            icon: 'Home',
            label: 'Room Type',
            value: orderData.userInfo.roomType
          },
          {
            icon: 'Users',
            label: 'Occupancy',
            value: orderData.userInfo.occupancy
          },
          ...(orderData.userInfo.reservationCode ? [{
            icon: 'Tag' as const,
            label: 'Reservation Code',
            value: orderData.userInfo.reservationCode
          }] : [])
        ]}
      />
    </div>
  )
}

export default OrderHeader