# Multibooking User Story & Implementation Guide

## User Story: Email-to-Booking Upsell Flow

### Background
The booking upsell system allows hotels to offer room upgrades and additional services to guests before their arrival, maximizing revenue and improving guest experience.

### User Journey

#### 1. Initial Reservation
- Guest makes reservation on hotel website (single room or multi-room booking)
- Reservation is stored with unique reservation code
- Guest receives booking confirmation

#### 2. Pre-Arrival Email Campaign
- **Timeline**: One week before arrival
- **Trigger**: Automated email system
- **Content**: Personalized upsell opportunities
- **CTA**: Email contains unique link to booking customization app

#### 3. Email Link Structure
```
https://app.hotel.com/booking/{reservationCode}?utm_source=email&utm_campaign=upsell

Example:
https://app.hotel.com/booking/1003066AU?utm_source=email&utm_campaign=upsell
https://app.hotel.com/booking/MULTI123?utm_source=email&utm_campaign=upsell
```

#### 4. Pre-Booking Form Flow
1. **Landing**: Guest clicks email link
2. **Validation**: App validates reservation code
3. **Detection**: System determines booking type:
   - Single room reservation → Single-booking UI
   - Multi-room reservation → Multi-booking UI
4. **Redirect**: Guest is automatically redirected to appropriate interface
5. **Pre-loaded Data**: Interface loads with existing reservation details

#### 5. Booking Customization
- **Single Room**: Current ABS_Landing interface with room upgrades, customizations, and special offers
- **Multi Room**: Multi-booking interface with per-room customizations and consolidated pricing

#### 6. Confirmation
- Guest confirms selections
- Updated booking is saved
- Confirmation email sent with changes

### Technical Requirements

#### Pre-Booking Form Component
- Input field for reservation code (if not in URL)
- Booking validation and error handling
- Loading states during lookup
- Responsive design

#### Routing Structure
```
/                           - Direct access (current behavior)
/booking/:reservationCode   - Email link entry point
/new-order/:orderId        - Order confirmation (existing)
/order/:orderId           - Order status (existing)
```

#### Booking Detection Logic
- Query reservation system by code
- Determine single vs multi-room booking
- Load associated guest and room data
- Handle edge cases (expired, cancelled bookings)

#### Demo Data Requirements
- Sample single-room reservation codes
- Sample multi-room reservation codes
- Realistic guest and room data
- Various booking scenarios for testing

### Sample Reservation Codes for Testing

#### Single Room Bookings
- `1003066AU` - Deluxe Silver room, 2 adults, 5 nights
- `SINGLE001` - Standard room, 1 adult, 3 nights
- `DELUXE123` - Deluxe Gold room, 2 adults, 7 nights

#### Multi-Room Bookings
- `MULTI123` - 3 rooms, family booking
- `GROUP456` - 2 rooms, couples trip
- `CORP789` - 4 rooms, corporate booking

### Error Scenarios
1. **Invalid reservation code**: Show error message with retry option
2. **Expired booking**: Redirect to main booking page
3. **Already customized**: Show current customizations with edit option
4. **System unavailable**: Show maintenance message

### Success Metrics
- Email click-through rate
- Conversion rate (email to booking customization)
- Average revenue per customized booking
- Guest satisfaction with pre-arrival customization

### Future Enhancements
1. **Personalization**: AI-driven upgrade recommendations
2. **Dynamic Pricing**: Real-time pricing updates
3. **Mobile App**: Deep linking to mobile app
4. **Social Features**: Share customizations with travel companions
5. **Loyalty Integration**: Points redemption for upgrades

## Implementation Notes

### Phase 1: Core Functionality
- Pre-booking form component
- Basic routing and validation
- Single/multi-room detection
- Integration with existing UIs

### Phase 2: Enhanced Features
- Advanced error handling
- Analytics tracking
- Performance optimization
- Accessibility improvements

### Phase 3: Advanced Features
- AI recommendations
- Dynamic pricing
- Social sharing
- Loyalty integration

---

*Last updated: [Current Date]*
*Version: 1.0*