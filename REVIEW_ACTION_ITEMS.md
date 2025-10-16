# Zustand Migration - Priority Action Items

## 🔴 Critical Issues (Fix Before Merge)

### 1. Fix Bidding Feature Tests ⏱️ 1-2 hours
**Issue:** 2 tests failing due to `biddingEnabled: false` default  
**Impact:** Feature broken, tests fail  
**Files:** `src/stores/bookingStore.ts`, `src/stores/__tests__/bookingStore.test.ts`

**Solution:**
```typescript
// Option A: Enable by default
const initialState: BookingState = {
  biddingEnabled: true,  // Changed from false
  // ...
}

// Option B: Make configurable
biddingEnabled: import.meta.env.VITE_BIDDING_ENABLED !== 'false',

// Fix tests:
beforeEach(() => {
  useBookingStore.getState().resetState()
  useBookingStore.setState({ biddingEnabled: true })
})
```

---

### 2. Add Persistence Middleware ⏱️ 2-3 hours
**Issue:** User loses all booking data on page refresh  
**Impact:** Major UX problem, high cart abandonment risk  
**Files:** `src/stores/bookingStore.ts`

**Solution:**
```typescript
import { persist, createJSONStorage } from 'zustand/middleware'

export const useBookingStore = create<BookingStore>()(
  devtools(
    persist(
      immer<BookingStore>((set, get) => ({ /* ... */ })),
      {
        name: 'abs-booking-storage',
        version: 1,
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          mode: state.mode,
          rooms: state.rooms,
          activeRoomId: state.activeRoomId,
        }),
        onRehydrateStorage: () => (state) => {
          // Handle Date deserialization
          if (state) {
            state.rooms.forEach(room => {
              room.items.forEach(item => {
                if (typeof item.addedAt === 'string') {
                  item.addedAt = new Date(item.addedAt)
                }
              })
            })
          }
        },
      }
    )
  )
)
```

**Test:**
1. Add items to cart
2. Refresh page
3. Verify items are still there

---

### 3. Fix Performance - Selective Subscriptions ⏱️ 3-4 hours
**Issue:** ABS_Landing subscribes to entire store, causing excessive re-renders  
**Impact:** Poor performance, frame drops, slow interactions  
**Files:** `src/components/ABS_Landing/ABS_Landing.tsx`

**Solution:**
```typescript
// ❌ BEFORE
const bookingStore = useBookingStore()

// ✅ AFTER
import { shallow } from 'zustand/shallow'

const { rooms, activeRoomId, mode } = useBookingStore(
  (state) => ({
    rooms: state.rooms,
    activeRoomId: state.activeRoomId,
    mode: state.mode,
  }),
  shallow
)

// Actions (never cause re-renders)
const addItemToRoom = useBookingStore((state) => state.addItemToRoom)
const removeItem = useBookingStore((state) => state.removeItemFromRoom)

// Derived state
const totalPrice = useBookingStore((state) => state.getTotalPrice())
```

**Test:**
1. Open React DevTools Profiler
2. Interact with booking system
3. Verify reduced re-render count (should be ~80% fewer)

---

### 4. Add Critical Documentation ⏱️ 2-3 hours
**Issue:** No store documentation or migration guide  
**Impact:** Developers confused, hard to onboard  
**Files:** Create new files

**Solution:**
Create these files:

1. **`src/stores/README.md`**
```markdown
# Booking Store Documentation

## Overview
Unified Zustand store for ABS booking system...

## Architecture
- Single vs Multi-booking modes
- Room-based state organization
- Item types and conflict resolution

## Usage Examples
[Code examples here]

## Performance Best Practices
[Selector patterns]
```

2. **`docs/ZUSTAND_MIGRATION_GUIDE.md`**
```markdown
# Migration from useBookingState to Zustand

## Before
const { selectedRoom, addCustomization } = useBookingState()

## After
const rooms = useBookingStore(state => state.rooms)
const addItem = useBookingStore(state => state.addItemToRoom)
```

---

## 🟡 High Priority (Fix Soon)

### 5. Fix Room Name Restoration Edge Cases ⏱️ 1-2 hours
**Issue:** Room name restoration fails when `baseRoom` is undefined  
**Files:** `src/stores/bookingStore.ts` lines 345-360

**Solution:**
```typescript
if (!hasRemainingRoomUpgrades) {
  if (room.baseRoom?.title || room.baseRoom?.roomType) {
    const originalName = room.baseRoom.title || room.baseRoom.roomType
    room.roomName = originalName
  } else {
    console.warn(`Cannot restore room name for ${roomId}: missing baseRoom`)
  }
}
```

**Add test:**
```typescript
it('should handle room upgrade removal when baseRoom is undefined', () => {
  // Test implementation
})
```

---

### 6. Add Edge Case Tests ⏱️ 2-3 hours
**Issue:** Missing test coverage for edge cases  
**Files:** `src/stores/__tests__/bookingStore.test.ts`

**Add tests for:**
- Adding item to non-existent room
- Invalid room IDs
- Malformed item data
- Empty room arrays
- Concurrent updates

---

### 7. Fix Object.assign in updateItemInRoom ⏱️ 30 minutes
**Issue:** `Object.assign` bypasses Immer's change tracking  
**Files:** `src/stores/bookingStore.ts` line 369

**Solution:**
```typescript
// ❌ BEFORE
if (item) {
  Object.assign(item, updates)
}

// ✅ AFTER
if (item) {
  Object.keys(updates).forEach(key => {
    item[key as keyof BookingItem] = updates[key as keyof Partial<BookingItem>]
  })
}
```

---

## 🟢 Medium Priority (Nice to Have)

### 8. Add Selector Memoization ⏱️ 2-3 hours
**Issue:** Selectors recompute on every call  
**Files:** `src/stores/bookingStore.ts` lines 579-613

**Solution:**
Use memoization patterns or computed state

---

### 9. Modularize Large Store ⏱️ 1-2 days
**Issue:** 725-line monolithic file  
**Files:** `src/stores/bookingStore.ts`

**Solution:**
Split into slices:
- `roomSlice.ts`
- `itemSlice.ts`
- `uiSlice.ts`
- `selectorSlice.ts`

---

### 10. Add Logging Middleware ⏱️ 1 hour
**Issue:** Hard to debug state changes  
**Files:** `src/stores/bookingStore.ts`

**Solution:**
```typescript
const logMiddleware = (config) => (set, get, api) => {
  return config(
    (...args) => {
      console.log('State before:', get())
      set(...args)
      console.log('State after:', get())
    },
    get,
    api
  )
}

// Use in development only
const middleware = import.meta.env.DEV
  ? devtools(logMiddleware(persist(immer(...))))
  : devtools(persist(immer(...)))
```

---

## Implementation Checklist

### Pre-Merge (Required)
- [ ] Fix bidding tests (Issue #1)
- [ ] Add persist middleware (Issue #2)
- [ ] Fix performance with selectors (Issue #3)
- [ ] Add documentation (Issue #4)
- [ ] All tests passing (26/28 → 28/28)
- [ ] Code review with team
- [ ] Performance benchmark passed

### Post-Merge (Within 1 week)
- [ ] Fix room name restoration (Issue #5)
- [ ] Add edge case tests (Issue #6)
- [ ] Fix Object.assign (Issue #7)
- [ ] Monitor error rates
- [ ] Track performance metrics

### Future Improvements (Within 1 month)
- [ ] Add selector memoization (Issue #8)
- [ ] Modularize store (Issue #9)
- [ ] Add logging middleware (Issue #10)
- [ ] Complete component migration audit
- [ ] Add integration tests

---

## Testing Checklist

### Unit Tests
- [x] Initialization
- [x] Mode management
- [x] Room management
- [ ] **Bidding (2 tests failing)** ← Fix this
- [x] Item management
- [x] Selectors
- [ ] Edge cases (add tests)

### Integration Tests
- [ ] Complete booking flow
- [ ] Multi-room workflow
- [ ] Edit existing booking
- [ ] Error recovery
- [ ] Persistence (add after middleware)

### Performance Tests
- [ ] Large datasets (100+ rooms)
- [ ] Rapid updates
- [ ] Memory leak detection
- [ ] Selector performance
- [ ] Re-render counting

---

## Success Criteria

### Must Have (Before Merge)
✅ All tests passing (28/28)  
✅ Data persists across page refresh  
✅ Performance improvement: 80% fewer re-renders  
✅ Documentation complete  
✅ No console errors or warnings  

### Nice to Have (Post-Merge)
✅ Edge cases covered by tests  
✅ Integration tests for critical paths  
✅ Performance benchmarks established  
✅ Monitoring and alerts set up  
✅ Developer onboarding video  

---

## Estimated Timeline

**Critical fixes:** 2-3 days  
**High priority fixes:** 2-3 days  
**Total before merge:** 4-6 days  

**Post-merge improvements:** 1-2 weeks  

---

## Next Steps

1. **Assign issues** to developers
2. **Set up branch** for fixes
3. **Daily standups** to track progress
4. **Code review** after each fix
5. **Merge** when all critical issues resolved
6. **Monitor** production metrics
7. **Iterate** on feedback

---

## Questions?

Contact: [Your Team Lead]  
Slack: #abs-development  
Documentation: See ZUSTAND_MIGRATION_REVIEW.md
