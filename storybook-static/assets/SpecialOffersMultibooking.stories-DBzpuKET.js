import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as m}from"./index-yIsmwZOr.js";import{S as z,u as Z,a as G,b as S,f as H,g as J,m as C}from"./mockOffers-Bgv_G-qr.js";import{f as W,i as X,c as Y,a as ee}from"./offerItemConverter-CH2xl498.js";import"./utils-BPIQTVVm.js";import"./card-DeuLGTZi.js";import"./button-Dzxadojh.js";import"./tooltip-CS7T2Siy.js";import"./index-CZ_84MJS.js";import"./index-CrvKlczb.js";import"./calendar-FSbPRefC.js";import"./x-DuINInzT.js";import"./star-COhMArgh.js";const be={title:"Upsell/SpecialOffers/Multibooking",component:z,parameters:{layout:"padded",docs:{description:{component:`
# SpecialOffers with Multibooking Integration

Demonstrates how to integrate SpecialOffers with a multibooking system using Zustand bookingStore pattern.

## Key Concepts

### Room-Aware Booking
- Each room maintains its own offer collection
- Active room context determines where offers are added
- Prevents conflicts across rooms

### Offer Storage Format
Offers are stored as \`EnhancedBookingItem\` with:
- \`type: 'offer'\`
- \`concept: 'enhance-your-stay'\`
- \`metadata.originalOfferId\`: For tracking and duplicate detection
- \`price\`: Final calculated price (NOT multiplied by nights)

### Bidirectional Sync
- **Add Offer**: Component → bookingStore → Pricing Panel
- **Remove Offer**: Pricing Panel → bookingStore → Component
- State synchronization via \`bookedOfferIds\`

### Duplicate Prevention
Uses \`metadata.originalOfferId\` to check if offer already exists before adding.

### Integration Pattern
\`\`\`typescript
const handleBookOffer = (offerId: number) => {
  const roomId = getCurrentRoomId()
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Check for duplicate
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  // Convert and add
  const offerItem = convertOfferDataToBookingItem(offerData)
  bookingStore.addItemToRoom(roomId, offerItem)
}
\`\`\`

See stories below for complete examples.
        `}}},tags:["autodocs"]};function oe(){const[x,f]=m.useState([{id:"room-1",roomName:"Deluxe Ocean View",items:[],isActive:!0},{id:"room-2",roomName:"Premium Suite",items:[],isActive:!1}]),[k,O]=m.useState("room-1"),r=m.useCallback((c,a)=>{f(s=>s.map(i=>i.id===c?{...i,items:[...i.items,{...a,id:`item-${Date.now()}`}]}:i))},[]),j=m.useCallback((c,a)=>{f(s=>s.map(i=>i.id===c?{...i,items:i.items.filter(R=>R.id!==a)}:i))},[]),g=m.useCallback(c=>{O(c),f(a=>a.map(s=>({...s,isActive:s.id===c})))},[]);return{rooms:x,activeRoomId:k,addItemToRoom:r,removeItemFromRoom:j,setActiveRoom:g}}function te(){const[x,f]=m.useState(""),[k,O]=m.useState("success"),r=oe(),{formatPrice:j,calculateTotal:g,getUnitLabel:c}=Z("€",C),{selections:a,bookedOffers:s,updateQuantity:i,updateSelectedDate:R,updateSelectedDates:L,setBookedOffers:I}=G({offers:S,reservationInfo:C}),N=J(),u=(o,t)=>{f(o),O(t),setTimeout(()=>f(""),3e3)},D=m.useCallback(()=>r.activeRoomId,[r.activeRoomId]),_=m.useCallback(o=>{const t=D(),n=r.rooms.find(l=>l.id===t);if(!n)return;const d=S.find(l=>l.id===o);if(!d)return;const p=a[o],v=g(d,p);if(s.has(o)){const l=W(n.items,o);if(l&&l.id){r.removeItemFromRoom(t,l.id);const w=new Set(s);w.delete(o),I(w),u(`${d.title} removed from ${n.roomName}`,"info")}return}if(X(n.items,o)){u(`${d.title} is already added to ${n.roomName}`,"error");return}const y=Y(d,p,v),V=ee(y);r.addItemToRoom(t,V);const B=new Set(s);B.add(o),I(B),u(`${d.title} added to ${n.roomName}`,"success")},[D,r,S,a,g,s,I,u]),K=H(S,a,Array.from(s),"€",N,j,g,c);return r.rooms.find(o=>o.id===r.activeRoomId),e.jsxs("div",{className:"space-y-6",children:[x&&e.jsx("div",{className:`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 shadow-lg ${k==="success"?"border-green-200 bg-green-50 text-green-900":k==="error"?"border-red-200 bg-red-50 text-red-900":"border-blue-200 bg-blue-50 text-blue-900"}`,children:x}),e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsx("h3",{className:"mb-3 text-sm font-semibold text-muted-foreground",children:"Select Active Room"}),e.jsx("div",{className:"flex gap-2",children:r.rooms.map(o=>e.jsxs("button",{onClick:()=>r.setActiveRoom(o.id),className:`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${o.isActive?"border-primary bg-primary text-primary-foreground":"border-border bg-background hover:bg-accent"}`,children:[o.roomName,o.items.length>0&&e.jsx("span",{className:"ml-2 rounded-full bg-background/20 px-2 py-0.5 text-xs",children:o.items.length})]},o.id))})]}),e.jsx(z,{cardData:K,onUpdateQuantity:i,onUpdateSelectedDate:R,onUpdateSelectedDates:L,onBookOffer:_,labels:N}),e.jsx("div",{className:"grid gap-4 sm:grid-cols-2",children:r.rooms.map(o=>e.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsx("h3",{className:"font-semibold",children:o.roomName}),o.isActive&&e.jsx("span",{className:"rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary",children:"Active"})]}),o.items.length===0?e.jsx("p",{className:"text-sm text-muted-foreground",children:"No offers added yet"}):e.jsx("div",{className:"space-y-2",children:o.items.map((t,n)=>{var d,p;return e.jsxs("div",{className:"rounded border border-border/50 bg-muted p-3 text-sm",children:[e.jsx("div",{className:"font-medium",children:t.name}),e.jsxs("div",{className:"text-muted-foreground",children:["€",t.price.toFixed(2)," | ",(d=t.metadata)==null?void 0:d.offerType,((p=t.metadata)==null?void 0:p.quantity)&&` | Qty: ${t.metadata.quantity}`]}),e.jsx("button",{onClick:()=>{var v;if(t.id&&((v=t.metadata)!=null&&v.originalOfferId)){r.removeItemFromRoom(o.id,t.id);const y=new Set(s);y.delete(t.metadata.originalOfferId),I(y),u(`${t.name} removed`,"info")}},className:"mt-2 text-xs text-destructive hover:underline",children:"Remove"})]},n)})}),e.jsx("div",{className:"mt-3 border-t border-border pt-3",children:e.jsxs("div",{className:"flex justify-between text-sm font-semibold",children:[e.jsx("span",{children:"Total:"}),e.jsxs("span",{children:["€",o.items.reduce((t,n)=>t+n.price,0).toFixed(2)]})]})})]},o.id))})]})}const b={render:()=>e.jsx(te,{})},h={render:()=>e.jsxs("div",{className:"prose max-w-4xl",children:[e.jsx("h2",{children:"Multibooking Integration Pattern"}),e.jsx("h3",{children:"1. Room Context"}),e.jsx("pre",{className:"rounded-lg bg-muted p-4",children:`const getCurrentRoomId = useCallback((): string => {
  if (shouldShowMultiBooking) {
    return activeRoomId || roomBookings[0]?.id || 'default-room'
  } else {
    return bookingStore.rooms[0]?.id || 'single-booking-default'
  }
}, [shouldShowMultiBooking, activeRoomId])`}),e.jsx("h3",{children:"2. Adding Offers"}),e.jsx("pre",{className:"rounded-lg bg-muted p-4",children:`const handleBookOffer = (offerId: number) => {
  const roomId = getCurrentRoomId()
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Check duplicate
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  // Convert and add
  const offerData = createOfferDataFromSelection(offer, selection, price)
  const bookingItem = convertOfferDataToBookingItem(offerData)
  bookingStore.addItemToRoom(roomId, bookingItem)
}`}),e.jsx("h3",{children:"3. Removing Offers"}),e.jsx("pre",{className:"rounded-lg bg-muted p-4",children:`// From pricing panel
const handleRemove = (itemId: string) => {
  bookingStore.removeItemFromRoom(roomId, itemId)
}

// From special offers component
if (bookedOffers.has(offerId)) {
  const item = findBookedOfferItem(room.items, offerId)
  if (item?.id) {
    bookingStore.removeItemFromRoom(roomId, item.id)
  }
}`}),e.jsx("h3",{children:"4. Offer Item Structure"}),e.jsx("pre",{className:"rounded-lg bg-muted p-4",children:`{
  type: 'offer',
  concept: 'enhance-your-stay',
  name: 'Spa Package',
  price: 240.00,  // Final calculated price
  metadata: {
    originalOfferId: 4,
    quantity: 1,
    offerType: 'perPerson',
    persons: 2,
    selectedDate: Date,
  }
}`}),e.jsx("h3",{children:"5. Important Notes"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Price Storage:"})," Offers store final price (NOT multiplied by nights in bookingStore)"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Duplicate Detection:"})," Uses ",e.jsx("code",{children:"metadata.originalOfferId"})]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Room Context:"})," Always add offers to active room"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Bidirectional Sync:"})," Removing from panel resets component state"]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Toast Messages:"})," Include room name in multibooking mode"]})]})]})};var T,A,F,P,M;b.parameters={...b.parameters,docs:{...(T=b.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: () => <SpecialOffersMultibookingDemo />
}`,...(F=(A=b.parameters)==null?void 0:A.docs)==null?void 0:F.source},description:{story:"Complete multibooking integration demo",...(M=(P=b.parameters)==null?void 0:P.docs)==null?void 0:M.description}}};var $,U,E,q,Q;h.parameters={...h.parameters,docs:{...($=h.parameters)==null?void 0:$.docs,source:{originalSource:`{
  render: () => <div className="prose max-w-4xl">
      <h2>Multibooking Integration Pattern</h2>

      <h3>1. Room Context</h3>
      <pre className="rounded-lg bg-muted p-4">
        {\`const getCurrentRoomId = useCallback((): string => {
  if (shouldShowMultiBooking) {
    return activeRoomId || roomBookings[0]?.id || 'default-room'
  } else {
    return bookingStore.rooms[0]?.id || 'single-booking-default'
  }
}, [shouldShowMultiBooking, activeRoomId])\`}
      </pre>

      <h3>2. Adding Offers</h3>
      <pre className="rounded-lg bg-muted p-4">
        {\`const handleBookOffer = (offerId: number) => {
  const roomId = getCurrentRoomId()
  const room = bookingStore.rooms.find(r => r.id === roomId)

  // Check duplicate
  if (isOfferAlreadyBooked(room.items, offerId)) {
    showToast('Already added', 'error')
    return
  }

  // Convert and add
  const offerData = createOfferDataFromSelection(offer, selection, price)
  const bookingItem = convertOfferDataToBookingItem(offerData)
  bookingStore.addItemToRoom(roomId, bookingItem)
}\`}
      </pre>

      <h3>3. Removing Offers</h3>
      <pre className="rounded-lg bg-muted p-4">
        {\`// From pricing panel
const handleRemove = (itemId: string) => {
  bookingStore.removeItemFromRoom(roomId, itemId)
}

// From special offers component
if (bookedOffers.has(offerId)) {
  const item = findBookedOfferItem(room.items, offerId)
  if (item?.id) {
    bookingStore.removeItemFromRoom(roomId, item.id)
  }
}\`}
      </pre>

      <h3>4. Offer Item Structure</h3>
      <pre className="rounded-lg bg-muted p-4">
        {\`{
  type: 'offer',
  concept: 'enhance-your-stay',
  name: 'Spa Package',
  price: 240.00,  // Final calculated price
  metadata: {
    originalOfferId: 4,
    quantity: 1,
    offerType: 'perPerson',
    persons: 2,
    selectedDate: Date,
  }
}\`}
      </pre>

      <h3>5. Important Notes</h3>
      <ul>
        <li>
          <strong>Price Storage:</strong> Offers store final price (NOT multiplied by nights in bookingStore)
        </li>
        <li>
          <strong>Duplicate Detection:</strong> Uses <code>metadata.originalOfferId</code>
        </li>
        <li>
          <strong>Room Context:</strong> Always add offers to active room
        </li>
        <li>
          <strong>Bidirectional Sync:</strong> Removing from panel resets component state
        </li>
        <li>
          <strong>Toast Messages:</strong> Include room name in multibooking mode
        </li>
      </ul>
    </div>
}`,...(E=(U=h.parameters)==null?void 0:U.docs)==null?void 0:E.source},description:{story:"Documentation story explaining the integration pattern",...(Q=(q=h.parameters)==null?void 0:q.docs)==null?void 0:Q.description}}};const he=["MultibookingIntegration","IntegrationPattern"];export{h as IntegrationPattern,b as MultibookingIntegration,he as __namedExportsOrder,be as default};
