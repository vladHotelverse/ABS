import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as q}from"./index-yIsmwZOr.js";import{S as n}from"./skeleton-BUWR1J4E.js";import{B as F}from"./index-C5PU_V98.js";import{R as G,a as J,b as Q,c as X,d as Y}from"./index-B8llYjAU.js";import{M as H,u as Z}from"./useAccordionState-DMEDgIv3.js";import{p as r,m as u,f as y,s as $,g as ee,h as oe,i as se,j as ne,k as re,n as ae,o as te}from"./translations-CxNbP9RY.js";import"./utils-BPIQTVVm.js";import"./calendar-FSbPRefC.js";import"./button-Dzxadojh.js";import"./x-DuINInzT.js";import"./chevron-right-DysUUpD1.js";import"./users-pk_HKbK0.js";import"./useIsDesktop-D-Yc6gef.js";const ie=({children:o})=>e.jsxs(G,{showMobileWidget:!0,className:"bg-muted my-8",children:[e.jsx(F,{welcomeText:{salutation:"Welcome back, Alex!"},hotelName:"Hotel Paradise Resort",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp",bookingDateRange:"12 Aug 2024 - 19 Aug 2024",bookingReference:"BCN-458921"}),e.jsxs(J,{className:"mt-8 sm:px-0",children:[e.jsx(Q,{children:e.jsxs("section",{className:"rounded-lg bg-white p-6 shadow-sm",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsx(n,{className:"h-6 w-56"}),e.jsx(n,{className:"h-4 w-72"})]}),e.jsxs("div",{className:"mt-4 grid gap-3 sm:grid-cols-2",children:[e.jsx(n,{className:"h-32 rounded-lg"}),e.jsx(n,{className:"h-32 rounded-lg"})]})]})}),e.jsx(X,{children:o})]}),e.jsx(Y,{children:e.jsx("div",{className:"border-border border-t bg-white p-4 shadow",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(n,{className:"h-3 w-12"}),e.jsx(n,{className:"h-5 w-20"})]}),e.jsx(n,{className:"h-8 w-24 rounded-md"})]}),e.jsx(n,{className:"h-10 w-28 rounded-md"})]})})})]}),ke={title:"Upsell/PricingSummaryPanel",component:H,parameters:{layout:"fullscreen"},decorators:[o=>e.jsx(ie,{children:e.jsx(o,{})})],argTypes:{loading:{control:"boolean"},readonly:{control:"boolean"},exclusiveAccordion:{control:"boolean"}}},a=({rooms:o,exclusiveAccordion:s=!1,onActiveRoomsChange:t,...W})=>{const h=o??[],{activeRooms:_,setActiveRooms:f,initialActiveRooms:V}=Z({rooms:h,exclusiveAccordion:s}),U=q.useCallback(v=>{f(v),t==null||t(v)},[t,f]);return e.jsx(H,{...W,rooms:h,exclusiveAccordion:s,activeRooms:_,initialActiveRooms:V,onActiveRoomsChange:U})},i={args:{rooms:y,formattedBookings:u,formattedOverallTotal:"€1,728.00",labels:r,exclusiveAccordion:!0,onRemoveItem:(o,s)=>{console.log("Remove item",{bookingKey:o,itemId:s})},onConfirm:()=>console.log("Confirm selection")},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:"\nIncludes all three option types: room upgrades, room customizations, and stay enhancements. Matches the sidebar integration used in `apps/upsell-app`. The `MultiBookingPricingSummaryPanel` receives the same pre-formatted rooms, booking metadata, and labels that `usePricingSummaryPanel` delivers so designers can preview the cart summary without opening the full application.\n        "}}}},m={args:{rooms:ee,formattedBookings:$,formattedOverallTotal:"€1,120.00",labels:r,exclusiveAccordion:!0,onConfirm:()=>console.log("Confirm single room")},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:`
Single-booking scenario where the accordion collapses into the compact card used for one room stays.
        `}}}},l={args:{rooms:y,formattedBookings:u,formattedOverallTotal:"€1,045.00",labels:r,loading:!0,exclusiveAccordion:!0},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:`
Displays the loading veil shown while the cart recalculates after adding or removing upgrades.
        `}}}},c={args:{rooms:y,formattedBookings:u,formattedOverallTotal:"€1,045.00",labels:r,readonly:!0,exclusiveAccordion:!0},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:`
Read-only mode for confirmation flows where guests review selections but cannot edit the cart.
        `}}}},d={args:{rooms:se,formattedBookings:oe,formattedOverallTotal:"€5,965.00",labels:r,exclusiveAccordion:!1,onRemoveItem:(o,s)=>{console.log("Remove item",{bookingKey:o,itemId:s})},onConfirm:()=>console.log("Confirm selection")},render:o=>e.jsx(a,{...o}),parameters:{viewport:{defaultViewport:"smallDesktop"}}},g={args:{rooms:re,formattedBookings:ne,formattedOverallTotal:"€2,205.00",labels:r,exclusiveAccordion:!0,onRemoveItem:(o,s)=>{console.log("Remove item",{bookingKey:o,itemId:s})},onConfirm:()=>console.log("Confirm selection")},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:`
Multi-room booking with only Stay Enhancement offers selected. Shows how the pricing summary handles rooms with exclusive stay enhancement items like spa packages, airport transfers, and special services.
        `}}}},p={args:{rooms:te,formattedBookings:ae,formattedOverallTotal:"€2,945.00",labels:r,exclusiveAccordion:!0,onRemoveItem:(o,s)=>{console.log("Remove item",{bookingKey:o,itemId:s})},onConfirm:()=>console.log("Confirm selection")},render:o=>e.jsx(a,{...o}),parameters:{docs:{description:{story:`
Showcase all three option categories in a single room: room upgrades, room customizations, and stay enhancements. This demonstrates the full flexibility of the pricing summary panel.
        `}}}};var S,b,x;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,728.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', {
        bookingKey,
        itemId
      });
    },
    onConfirm: () => console.log('Confirm selection')
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Includes all three option types: room upgrades, room customizations, and stay enhancements. Matches the sidebar integration used in \\\`apps/upsell-app\\\`. The \\\`MultiBookingPricingSummaryPanel\\\` receives the same pre-formatted rooms, booking metadata, and labels that \\\`usePricingSummaryPanel\\\` delivers so designers can preview the cart summary without opening the full application.
        \`
      }
    }
  }
}`,...(x=(b=i.parameters)==null?void 0:b.docs)==null?void 0:x.source}}};var k,w,R;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    rooms: singleRoomSummary,
    formattedBookings: singleBookingSummary,
    formattedOverallTotal: '€1,120.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onConfirm: () => console.log('Confirm single room')
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Single-booking scenario where the accordion collapses into the compact card used for one room stays.
        \`
      }
    }
  }
}`,...(R=(w=m.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var j,B,O;l.parameters={...l.parameters,docs:{...(j=l.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,045.00',
    labels: pricingSummaryLabels,
    loading: true,
    exclusiveAccordion: true
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Displays the loading veil shown while the cart recalculates after adding or removing upgrades.
        \`
      }
    }
  }
}`,...(O=(B=l.parameters)==null?void 0:B.docs)==null?void 0:O.source}}};var A,C,T;c.parameters={...c.parameters,docs:{...(A=c.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    rooms: multiRoomSummary,
    formattedBookings: multiBookingSummary,
    formattedOverallTotal: '€1,045.00',
    labels: pricingSummaryLabels,
    readonly: true,
    exclusiveAccordion: true
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Read-only mode for confirmation flows where guests review selections but cannot edit the cart.
        \`
      }
    }
  }
}`,...(T=(C=c.parameters)==null?void 0:C.docs)==null?void 0:T.source}}};var I,N,P;d.parameters={...d.parameters,docs:{...(I=d.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    rooms: fourRoomsSummary,
    formattedBookings: fourRoomsBookings,
    formattedOverallTotal: '€5,965.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: false,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', {
        bookingKey,
        itemId
      });
    },
    onConfirm: () => console.log('Confirm selection')
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    viewport: {
      defaultViewport: 'smallDesktop'
    }
  }
}`,...(P=(N=d.parameters)==null?void 0:N.docs)==null?void 0:P.source}}};var L,E,M;g.parameters={...g.parameters,docs:{...(L=g.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    rooms: stayEnhancementOnlyRooms,
    formattedBookings: stayEnhancementOnlyBookings,
    formattedOverallTotal: '€2,205.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', {
        bookingKey,
        itemId
      });
    },
    onConfirm: () => console.log('Confirm selection')
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Multi-room booking with only Stay Enhancement offers selected. Shows how the pricing summary handles rooms with exclusive stay enhancement items like spa packages, airport transfers, and special services.
        \`
      }
    }
  }
}`,...(M=(E=g.parameters)==null?void 0:E.docs)==null?void 0:M.source}}};var D,K,z;p.parameters={...p.parameters,docs:{...(D=p.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    rooms: completeOptionsRooms,
    formattedBookings: completeOptionsBookings,
    formattedOverallTotal: '€2,945.00',
    labels: pricingSummaryLabels,
    exclusiveAccordion: true,
    onRemoveItem: (bookingKey, itemId) => {
      console.log('Remove item', {
        bookingKey,
        itemId
      });
    },
    onConfirm: () => console.log('Confirm selection')
  },
  render: args => <AccordionStateStory {...args} />,
  parameters: {
    docs: {
      description: {
        story: \`
Showcase all three option categories in a single room: room upgrades, room customizations, and stay enhancements. This demonstrates the full flexibility of the pricing summary panel.
        \`
      }
    }
  }
}`,...(z=(K=p.parameters)==null?void 0:K.docs)==null?void 0:z.source}}};const we=["Default","SingleRoom","Loading","ReadOnly","DynamicHeightTest","StayEnhancementOnly","CompleteOptions"];export{p as CompleteOptions,i as Default,d as DynamicHeightTest,l as Loading,c as ReadOnly,m as SingleRoom,g as StayEnhancementOnly,we as __namedExportsOrder,ke as default};
