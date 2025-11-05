import{j as a}from"./jsx-runtime-BjG_zV1W.js";import{B as n,c as l,p as t,b as c}from"./storyHelpers-BnyVlK5_.js";import"./card-DeuLGTZi.js";import{b as k}from"./translations-CxNbP9RY.js";import"./tooltip-CS7T2Siy.js";import"./utils-BPIQTVVm.js";import"./index-yIsmwZOr.js";import"./button-Dzxadojh.js";import"./index-CZ_84MJS.js";import"./calendar-FSbPRefC.js";import"./users-pk_HKbK0.js";const j={title:"Upsell/BookingAccordionCard",component:n,parameters:{layout:"padded"}},s=l(k),o={args:{...c,onCancelBookingClick:()=>{},formatDate:t,t:s}},r={render:()=>a.jsxs("div",{className:"space-y-6",children:[a.jsx(n,{...c,onCancelBookingClick:()=>{},formatDate:t,t:s}),a.jsx(n,{...c,occupancy:{adults:4,childs:0,infants:0},formattedTotalPrice:"€480.00",onCancelBookingClick:()=>{},formatDate:t,t:s})]})};var e,i,d;o.parameters={...o.parameters,docs:{...(e=o.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    ...bookingAccordionCardArgs,
    onCancelBookingClick: () => {},
    formatDate: passthroughDate,
    t: bookingAccordionT
  }
}`,...(d=(i=o.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};var m,p,g;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">
      <BookingAccordionCard {...bookingAccordionCardArgs} onCancelBookingClick={() => {}} formatDate={passthroughDate} t={bookingAccordionT} />
      <BookingAccordionCard {...bookingAccordionCardArgs} occupancy={{
      adults: 4,
      childs: 0,
      infants: 0
    }} formattedTotalPrice="€480.00" onCancelBookingClick={() => {}} formatDate={passthroughDate} t={bookingAccordionT} />
    </div>
}`,...(g=(p=r.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};const y=["SingleCard","TwoCardsStacked"];export{o as SingleCard,r as TwoCardsStacked,y as __namedExportsOrder,j as default};
