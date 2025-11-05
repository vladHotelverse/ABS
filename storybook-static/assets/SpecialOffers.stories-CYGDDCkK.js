import{j as o}from"./jsx-runtime-BjG_zV1W.js";import{r as Je}from"./index-yIsmwZOr.js";import{S as Me,m as s,b as y,c as Ke,d as Xe,e as Ye,h as Ze,i as eo,j as oo,k as ro,u as so,a as to,g as no,f as ao}from"./mockOffers-Bgv_G-qr.js";import{c as io}from"./offerItemConverter-CH2xl498.js";import"./utils-BPIQTVVm.js";import"./card-DeuLGTZi.js";import"./button-Dzxadojh.js";import"./tooltip-CS7T2Siy.js";import"./index-CZ_84MJS.js";import"./index-CrvKlczb.js";import"./calendar-FSbPRefC.js";import"./x-DuINInzT.js";import"./star-COhMArgh.js";const So={title:"Upsell/SpecialOffers",component:Me,parameters:{layout:"padded",docs:{description:{component:`
# SpecialOffers Component

A pure presentation component for displaying and managing special offer bookings.

## Architecture

This component is **fully controlled** - all state and business logic is handled externally:
- **UI Layer**: Pure presentation components in \`components/upsell/SpecialOffers/\`
- **Business Logic**: Hooks in \`stories/SpecialOffers/hooks/\` demonstrate integration patterns
- **State Management**: Parent component controls selections, bookings, and validation

## Integration

The component requires pricing utilities and callbacks from parent. See stories below for examples:
- PerStayPricing: Stay-based pricing with quantity controls
- PerPersonPricing: Person-count dependent totals and messaging
- PerNightPricing: Night/service pricing scenarios
- SingleDateSelection: Offers that require a single date
- MultipleDatesSelection: Offers that allow multiple dates
- Multibooking: Integration with bookingStore (see SpecialOffersMultibooking.stories.tsx)

## Variations

Special offers can combine these dimensions (pre-calculated by the parent):
- Pricing basis: per stay, per person, or per night/service.
- Quantity handling: fixed quantities (e.g. all-inclusive) vs adjustable controls.
- Date requirements: no date, single-date selector, or multi-date selector with optional reservation windows.
- Reservation context: person counts, night counts, or stay windows needed for totals.
- Booking state and validation: already booked, disabled, or requiring warning messages.

## Hooks

Three hooks provide business logic:
- \`useOfferPricing\`: Price formatting and calculations
- \`useOfferSelections\`: Selection state management
- \`useOfferBooking\`: Booking validation and callbacks

NOTE: String-matching offer detection (All Inclusive, Late Checkout, Online Check-in) is documented for future refactoring.
        `}}},tags:["autodocs"]};function t({offers:e,currencySymbol:h="€",reservationInfo:S,onOfferBooked:r,labelsOverride:i}){const{formatPrice:Ce,calculateTotal:B,getUnitLabel:Ue}=so(h,S),{selections:w,bookedOffers:P,bookingAttempts:Ve,updateQuantity:Ae,updateSelectedDate:Ee,updateSelectedDates:_e,setBookedOffers:j}=to({offers:e,reservationInfo:S}),D=no(),x=i?{...D,...i}:D,$e=n=>{const I=e.find(a=>a.id===n);if(!I)return;const N=w[n],Ge=B(I,N),R=io(I,N,Ge);if(P.has(n)){const a=new Set(P);a.delete(n),j(a),r==null||r({...R,quantity:0})}else{const a=new Set(P);a.add(n),j(a),r==null||r(R)}},L={};Ve.forEach(n=>{L[n]=!0});const ze=ao(e,w,Array.from(P),h,x,Ce,B,n=>Ue(n,x),L);return o.jsx("div",{className:"w-full flex justify-center",children:o.jsx(Me,{cardData:ze,onUpdateQuantity:Ae,onUpdateSelectedDate:Ee,onUpdateSelectedDates:_e,onBookOffer:$e,labels:x})})}const c={render:()=>o.jsx(t,{offers:y,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},f={render:()=>o.jsx(t,{offers:Ke,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},d={render:()=>o.jsx(t,{offers:Xe,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},l={render:()=>o.jsx(t,{offers:Ye,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},p={render:()=>o.jsx(t,{offers:Ze,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},m={render:()=>o.jsx(t,{offers:eo,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},g={render:()=>o.jsx(t,{offers:oo,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e),labelsOverride:{perStay:"per room",decreaseQuantityLabel:"Decrease rooms",increaseQuantityLabel:"Increase rooms",removeOfferLabel:"Remove room"}})},u={render:()=>o.jsx(t,{offers:ro,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},k={render:()=>o.jsx(t,{offers:y,currencySymbol:"$",reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},O={render:()=>{const[e,h]=Je.useState([]),S=r=>{h(i=>[...i,r])};return o.jsxs("div",{className:"space-y-6",children:[o.jsx(t,{offers:y,reservationInfo:s,onOfferBooked:S}),e.length>0&&o.jsxs("div",{className:"rounded-lg border border-border bg-card p-4",children:[o.jsx("h3",{className:"mb-4 text-lg font-semibold",children:"Booking Log"}),o.jsx("div",{className:"space-y-2",children:e.map((r,i)=>o.jsxs("div",{className:"rounded border border-border/50 bg-muted p-3 text-sm",children:[o.jsx("div",{className:"font-medium",children:r.name}),o.jsxs("div",{className:"text-muted-foreground",children:["Price: €",r.price.toFixed(2)," | Quantity: ",r.quantity," | Type: ",r.type]})]},i))})]})]})}},b={parameters:{viewport:{defaultViewport:"mobile1"}},render:()=>o.jsx(t,{offers:y,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})},v={parameters:{viewport:{defaultViewport:"tablet"}},render:()=>o.jsx(t,{offers:y,reservationInfo:s,onOfferBooked:e=>console.log("Offer booked:",e)})};var W,q,H,F,T;c.parameters={...c.parameters,docs:{...(W=c.parameters)==null?void 0:W.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockOffers} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(H=(q=c.parameters)==null?void 0:q.docs)==null?void 0:H.source},description:{story:"Default story - standard grid with all offers",...(T=(F=c.parameters)==null?void 0:F.docs)==null?void 0:T.description}}};var Q,M,C,U,V;f.parameters={...f.parameters,docs:{...(Q=f.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockFeaturedOffers} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(C=(M=f.parameters)==null?void 0:M.docs)==null?void 0:C.source},description:{story:"Featured offers only - smaller selection",...(V=(U=f.parameters)==null?void 0:U.docs)==null?void 0:V.description}}};var A,E,_,$,z;d.parameters={...d.parameters,docs:{...(A=d.parameters)==null?void 0:A.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockSingleOffer} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(_=(E=d.parameters)==null?void 0:E.docs)==null?void 0:_.source},description:{story:"Single offer layout",...(z=($=d.parameters)==null?void 0:$.docs)==null?void 0:z.description}}};var G,J,K,X,Y;l.parameters={...l.parameters,docs:{...(G=l.parameters)==null?void 0:G.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockPerStayOffer} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(K=(J=l.parameters)==null?void 0:J.docs)==null?void 0:K.source},description:{story:`Per-stay pricing focus - shows stay-based unit label and quantity handling
Base: unit price multiplied by quantity
Frequency: once per stay
Scope: not applicable`,...(Y=(X=l.parameters)==null?void 0:X.docs)==null?void 0:Y.description}}};var Z,ee,oe,re,se;p.parameters={...p.parameters,docs:{...(Z=p.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockPerPersonOffer} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(oe=(ee=p.parameters)==null?void 0:ee.docs)==null?void 0:oe.source},description:{story:`Per-person pricing focus - highlights person-based totals and messaging
Base: per person 
Frequency: once per stay
Scope: not applicable or entire stay`,...(se=(re=p.parameters)==null?void 0:re.docs)==null?void 0:se.description}}};var te,ne,ae,ie,ce;m.parameters={...m.parameters,docs:{...(te=m.parameters)==null?void 0:te.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockPerNightOffer} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(ae=(ne=m.parameters)==null?void 0:ne.docs)==null?void 0:ae.source},description:{story:`Per-night/service pricing focus - showcases nightly pricing behavior
Includes nightly services like dinner packages and valet parking`,...(ce=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:ce.description}}};var fe,de,le,pe,me;g.parameters={...g.parameters,docs:{...(fe=g.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockPerRoomOffer} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} labelsOverride={{
    perStay: 'per room',
    decreaseQuantityLabel: 'Decrease rooms',
    increaseQuantityLabel: 'Increase rooms',
    removeOfferLabel: 'Remove room'
  }} />
}`,...(le=(de=g.parameters)==null?void 0:de.docs)==null?void 0:le.source},description:{story:`Per-room pricing focus - demonstrates multiplying per-room services as quantity
Base: per room per stay
Frequency: once per stay per room
Scope: room-specific`,...(me=(pe=g.parameters)==null?void 0:pe.docs)==null?void 0:me.description}}};var ge,ue,ke,Oe,be;u.parameters={...u.parameters,docs:{...(ge=u.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockDateSelectionOffers} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(ke=(ue=u.parameters)==null?void 0:ue.docs)==null?void 0:ke.source},description:{story:"Date selection offers - demonstrates offers requiring date selection",...(be=(Oe=u.parameters)==null?void 0:Oe.docs)==null?void 0:be.description}}};var ve,ye,he,Se,Pe;k.parameters={...k.parameters,docs:{...(ve=k.parameters)==null?void 0:ve.docs,source:{originalSource:`{
  render: () => <SpecialOffersWithHooks offers={mockOffers} currencySymbol="$" reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(he=(ye=k.parameters)==null?void 0:ye.docs)==null?void 0:he.source},description:{story:"Different currency - demonstrates currency symbol customization",...(Pe=(Se=k.parameters)==null?void 0:Se.docs)==null?void 0:Pe.description}}};var xe,Ie,Be,we,je;O.parameters={...O.parameters,docs:{...(xe=O.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  render: () => {
    const [bookingLog, setBookingLog] = useState<OfferData[]>([]);
    const handleOfferBooked = (data: OfferData) => {
      setBookingLog(prev => [...prev, data]);
    };
    return <div className="space-y-6">
        <SpecialOffersWithHooks offers={mockOffers} reservationInfo={mockReservationInfo} onOfferBooked={handleOfferBooked} />

        {bookingLog.length > 0 && <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">Booking Log</h3>
            <div className="space-y-2">
              {bookingLog.map((booking, index) => <div key={index} className="rounded border border-border/50 bg-muted p-3 text-sm">
                  <div className="font-medium">{booking.name}</div>
                  <div className="text-muted-foreground">
                    Price: €{booking.price.toFixed(2)} | Quantity: {booking.quantity} | Type: {booking.type}
                  </div>
                </div>)}
            </div>
          </div>}
      </div>;
  }
}`,...(Be=(Ie=O.parameters)==null?void 0:Ie.docs)==null?void 0:Be.source},description:{story:"Interactive example with booking log",...(je=(we=O.parameters)==null?void 0:we.docs)==null?void 0:je.description}}};var De,Le,Ne,Re,We;b.parameters={...b.parameters,docs:{...(De=b.parameters)==null?void 0:De.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => <SpecialOffersWithHooks offers={mockOffers} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(Ne=(Le=b.parameters)==null?void 0:Le.docs)==null?void 0:Ne.source},description:{story:"Mobile viewport",...(We=(Re=b.parameters)==null?void 0:Re.docs)==null?void 0:We.description}}};var qe,He,Fe,Te,Qe;v.parameters={...v.parameters,docs:{...(qe=v.parameters)==null?void 0:qe.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    }
  },
  render: () => <SpecialOffersWithHooks offers={mockOffers} reservationInfo={mockReservationInfo} onOfferBooked={data => console.log('Offer booked:', data)} />
}`,...(Fe=(He=v.parameters)==null?void 0:He.docs)==null?void 0:Fe.source},description:{story:"Tablet viewport",...(Qe=(Te=v.parameters)==null?void 0:Te.docs)==null?void 0:Qe.description}}};const Po=["Default","FeaturedOnly","SingleOffer","PerStayPricing","PerPersonPricing","PerNightPricing","PerRoomPricing","WithDateSelection","DifferentCurrency","WithBookingLog","Mobile","Tablet"];export{c as Default,k as DifferentCurrency,f as FeaturedOnly,b as Mobile,m as PerNightPricing,p as PerPersonPricing,g as PerRoomPricing,l as PerStayPricing,d as SingleOffer,v as Tablet,O as WithBookingLog,u as WithDateSelection,Po as __namedExportsOrder,So as default};
