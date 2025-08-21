# Multibooking Testing Guide

## Test URLs

### Development Server
- **Local**: http://localhost:5174/
- **Pre-booking Form**: http://localhost:5174/booking
- **With Reservation Code**: http://localhost:5174/booking/MULTI123

## Test Scenarios

### 1. Single Room Booking Flow

#### Test Code: `1003066AU`
1. Navigate to: `http://localhost:5174/booking/1003066AU`
2. **Expected Behavior**:
   - Pre-booking form shows "Validating Your Reservation"
   - After validation, redirects to single-booking interface (`/`)
   - Interface loads with:
     - Guest: "Demo Guest"
     - Check-in: "2025-10-10"
     - Check-out: "2025-10-15" 
     - Room: "DELUXE SILVER"
     - Occupancy: "2 Adults, 0 Children"
   - Shows standard single-room interface (no room tabs)

### 2. Multi-Room Booking Flow

#### Test Code: `MULTI123`
1. Navigate to: `http://localhost:5174/booking/MULTI123`
2. **Expected Behavior**:
   - Pre-booking form shows "Validating Your Reservation"
   - After validation, redirects to multi-booking interface (`/multi-booking`)
   - Interface loads with:
     - Guest: "John Smith"
     - Check-in: "2025-10-10"
     - Check-out: "2025-10-15"
     - 3 rooms displayed
   - Shows multi-booking interface with:
     - Room tabs at top
     - Multi-room pricing panel
     - Per-room customization

#### Test Code: `GROUP456`
1. Navigate to: `http://localhost:5174/booking/GROUP456`
2. **Expected Behavior**:
   - Shows 2-room booking for couples trip
   - Guest: "Emily Wilson"
   - Both rooms are Rock Suites
   - 4-night stay (2025-10-12 to 2025-10-16)

### 3. Manual Entry Flow

1. Navigate to: `http://localhost:5174/booking`
2. **Expected Behavior**:
   - Shows pre-booking form with manual entry
   - Enter reservation code manually
   - Test with codes: `1003066AU`, `MULTI123`, `GROUP456`

### 4. Error Handling

#### Invalid Reservation Code
1. Navigate to: `http://localhost:5174/booking/INVALID123`
2. **Expected Behavior**:
   - Shows error message
   - Provides manual retry option

#### Direct Access
1. Navigate to: `http://localhost:5174/multi-booking`
2. **Expected Behavior**:
   - Redirects to pre-booking form (no booking info available)

## Visual Verification

### Single Booking Interface
- ✅ Standard header with total price
- ✅ Single booking info bar
- ✅ Room selection carousel
- ✅ Room customization section
- ✅ Special offers section
- ✅ Standard pricing summary panel (right side)

### Multi-Booking Interface
- ✅ Standard header with total price
- ✅ Room tabs below header
- ✅ Multi-room booking info bar
- ✅ Room selection carousel
- ✅ Room customization section
- ✅ Special offers section
- ✅ **Multi-booking pricing summary panel** (right side)

### Multi-Booking Specific Features
- ✅ Room tabs navigation
- ✅ Per-room accordion in booking info bar
- ✅ Multi-room pricing breakdown
- ✅ "Confirm All Selections" button
- ✅ Room-specific customizations

## Component Integration Test

### Pre-Booking Form Components
- ✅ `PreBookingForm` - Main form component
- ✅ Email link validation
- ✅ Manual entry fallback
- ✅ Loading states
- ✅ Error handling

### Multi-Booking Components
- ✅ `useMultiBookingState` - State management hook
- ✅ `MultiBookingPricingSummaryPanel` - Right sidebar
- ✅ `MultiBookingInfo` - Booking info bar component
- ✅ `RoomTabs` - Room navigation tabs

### Routing Integration
- ✅ `/booking/:reservationCode` - Email link entry
- ✅ `/booking` - Manual entry form
- ✅ `/multi-booking` - Multi-booking interface
- ✅ `/` - Single booking interface (default)

## Expected User Flow

### Email Campaign Flow
1. **Guest receives email** with link: `hotel.com/booking/MULTI123`
2. **Click email link** → Pre-booking form validates code
3. **System detects** multi-room booking
4. **Redirects to** multi-booking interface with pre-loaded data
5. **Guest customizes** each room individually
6. **Confirms all selections** → Booking updated

### Manual Entry Flow
1. **Guest visits** `hotel.com/booking`
2. **Enters reservation code** manually
3. **System validates and routes** to appropriate interface
4. **Continue with customization**

## Performance Expectations
- Pre-booking validation: ~1.5 seconds (simulated API call)
- Multi-booking data loading: Instantaneous (uses mock data)
- Interface transitions: Smooth React Router navigation
- Responsive design: Works on mobile, tablet, desktop

## Next Steps
1. Test all scenarios listed above
2. Verify responsive design on different screen sizes
3. Test form validation edge cases
4. Confirm multi-booking pricing calculations
5. Validate room customization per room
6. Test booking confirmation flow

---

*Last updated: August 21, 2025*