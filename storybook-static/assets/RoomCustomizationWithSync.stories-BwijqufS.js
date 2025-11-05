import{j as y}from"./jsx-runtime-BjG_zV1W.js";import{r as c}from"./index-yIsmwZOr.js";import{s as ve,u as we,A as Se,a as Ie,D as Re,d as C,l as Ue}from"./attributeFormatter-BYYUaegB.js";import{u as Le,M as Te}from"./useAccordionState-DMEDgIv3.js";import{S as q,p as v}from"./translations-CxNbP9RY.js";import"./utils-BPIQTVVm.js";import"./button-Dzxadojh.js";import"./tooltip-CS7T2Siy.js";import"./index-CZ_84MJS.js";import"./index-CrvKlczb.js";import"./x-DuINInzT.js";import"./useIsDesktop-D-Yc6gef.js";import"./skeleton-BUWR1J4E.js";import"./chevron-right-DysUUpD1.js";import"./users-pk_HKbK0.js";const Ae=(s={})=>{const{initialItems:i=[],onStateChange:e}=s,[r,a]=c.useState(i),[o,t]=c.useState({}),d=c.useCallback((n,l)=>{e&&e({items:n,isLoading:l})},[e]),p=c.useCallback(n=>{t(l=>({...l,[n.id]:!0})),setTimeout(()=>{a(l=>{if(l.some(m=>m.id===n.id))return l;const u=[...l,n];return t(m=>{const g={...m};return delete g[n.id],d(u,g),g}),u})},300)},[d]),h=c.useCallback(n=>{t(l=>({...l,[n]:!0})),setTimeout(()=>{a(l=>{const u=l.filter(m=>m.id!==n);return t(m=>{const g={...m};return delete g[n],d(u,g),g}),u})},300)},[d]),k=c.useCallback(n=>{r.some(u=>u.id===n.id)?h(n.id):p(n)},[r,p,h]),f=c.useCallback(()=>{a(i),t({}),d(i,{})},[i,d]),b=c.useCallback(n=>r.filter(l=>l.bookingKey===n),[r]);return{items:r,addItem:p,removeItem:h,toggleItem:k,reset:f,isLoading:o,getItemsByBooking:b}},w=(s,i,e)=>new Intl.NumberFormat(e,{style:"currency",currency:i}).format(s),Ne=(s,i,e)=>{const r=new Date(s),a=new Date(i),o=new Intl.DateTimeFormat(e,{month:"short",day:"numeric"});return`${o.format(r)} - ${o.format(a)}`},xe=(s,i)=>{const e=[],r=s.filter(t=>t.type==="upgrade"),a=s.filter(t=>t.type==="attribute"),o=s.filter(t=>t.type==="offer");return r.length>0&&e.push({title:"Choose your superior room",type:q.Upgrade,items:r.map(t=>({id:t.id,name:t.name,formattedPrice:w(t.amount,i.currency,i.locale)}))}),a.length>0&&e.push({title:"Customize your room",type:q.Customization,items:a.map(t=>({id:t.id,name:t.name,formattedPrice:w(t.amount,i.currency,i.locale)}))}),o.length>0&&e.push({title:"Special offers",type:q.Offer,items:o.map(t=>({id:t.id,name:t.name,formattedPrice:w(t.amount,i.currency,i.locale)}))}),e},E=(s,i,e,r)=>{const o=s.filter(t=>t.bookingKey===i).reduce((t,d)=>t+d.amount,0);return e.includeNightMultiplier&&r?o*r:o},qe=(s,i,e)=>i.map(r=>{const a=s.filter(d=>d.bookingKey===r.bookingKey),o=xe(a,e),t=E(s,r.bookingKey,e,r.nights);return{id:r.id,displayName:r.displayName,guestName:r.guestName,formattedNights:`${r.nights} ${r.nights===1?"night":"nights"}`,formattedTotal:w(t,e.currency,e.locale),sections:o,guestCount:r.guests}}),Ee=(s,i)=>s.map(e=>({id:e.id,displayName:e.displayName,bookingKey:e.bookingKey,formattedDateRange:Ne(e.checkIn,e.checkOut,i.locale),formattedNights:`${e.nights} ${e.nights===1?"night":"nights"}`,formattedGuests:`${e.guests} ${e.guests===1?"guest":"guests"}`})),Me=(s,i,e)=>{const r=i.reduce((a,o)=>a+E(s,o.bookingKey,e,o.nights),0);return w(r,e.currency,e.locale)},Be=(s,i,e)=>{const r={};return i.forEach(a=>{const o=E(s,a.bookingKey,e,a.nights);r[a.bookingKey]=w(o,e.currency,e.locale)}),r},fe=c.createContext(void 0),he=({children:s,initialItems:i=[],bookings:e,config:r={},onStateChange:a})=>{const o=c.useMemo(()=>({currency:"EUR",locale:"en-US",includeNightMultiplier:!1,...r}),[r]),t=Ae({initialItems:i,onStateChange:a}),d=c.useMemo(()=>qe(t.items,e,o),[t.items,e,o]),p=c.useMemo(()=>Ee(e,o),[e,o]),h=c.useMemo(()=>Me(t.items,e,o),[t.items,e,o]),k=c.useMemo(()=>Be(t.items,e,o),[t.items,e,o]),f=l=>t.items.some(u=>u.id===l),b=l=>t.isLoading[l]||!1,n={items:t.items,isLoading:t.isLoading,rooms:d,formattedBookings:p,formattedOverallTotal:h,formattedPerRoomTotals:k,addItem:t.addItem,removeItem:t.removeItem,toggleItem:t.toggleItem,reset:t.reset,getItemsByBooking:t.getItemsByBooking,isItemSelected:f,isItemLoading:b};return y.jsx(fe.Provider,{value:n,children:s})},be=()=>{const s=c.useContext(fe);if(!s)throw new Error("useCartStory must be used within CartStoryProvider");return s};he.__docgenInfo={description:"Provider component that manages cart state and provides transformed data",methods:[],displayName:"CartStoryProvider",props:{children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},initialItems:{required:!1,tsType:{name:"Array",elements:[{name:"CartItem"}],raw:"CartItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},bookings:{required:!0,tsType:{name:"Array",elements:[{name:"BookingInfo"}],raw:"BookingInfo[]"},description:""},config:{required:!1,tsType:{name:"Partial",elements:[{name:"TransformConfig"}],raw:"Partial<TransformConfig>"},description:"",defaultValue:{value:"{}",computed:!1}},onStateChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(state: { items: CartItem[]; isLoading: Record<string, boolean> }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ items: CartItem[]; isLoading: Record<string, boolean> }",signature:{properties:[{key:"items",value:{name:"Array",elements:[{name:"CartItem"}],raw:"CartItem[]",required:!0}},{key:"isLoading",value:{name:"Record",elements:[{name:"string"},{name:"boolean"}],raw:"Record<string, boolean>",required:!0}}]}},name:"state"}],return:{name:"void"}}},description:""}}};const Pe=({categories:s,bookingKey:i,currency:e,nights:r,disabledAttributes:a=[],readonly:o=!1})=>{const{toggleItem:t,isItemSelected:d,isItemLoading:p}=be(),h=c.useMemo(()=>new Set(a),[a]),k=c.useMemo(()=>ve(s),[s]),f=we(Re),b=c.useCallback((n,l)=>{const u={id:`attr-${n.id}`,name:n.name,amount:n.amount,bookingKey:i,categoryId:l,attributeId:n.id,type:"attribute"};t(u)},[i,t]);return y.jsx(Se,{categories:k,renderAttributeCard:(n,l)=>{const u=`attr-${n.id}`,m=d(u),g=p(u),x=!!(n.disabled||h.has(n.id)||g),Ce=r?n.amount/r:n.amount;return y.jsx(Ie,{attribute:n,isSelected:m,disabled:x,onToggle:()=>b(n,l),originalPrice:Ce,displayCurrency:e,readonly:o},n.id)},displayConfig:{initialVisibleCount:f.initialVisibleCount,showMoreThreshold:f.showMoreThreshold,showMoreLabel:f.showMoreLabel,showLessLabel:f.showLessLabel}})},ze=({labels:s,loading:i=!1,readonly:e=!1,exclusiveAccordion:r=!0,onConfirm:a})=>{const{rooms:o,formattedBookings:t,formattedOverallTotal:d,removeItem:p,isLoading:h}=be(),k=i||Object.keys(h).length>0,{activeRooms:f,setActiveRooms:b,initialActiveRooms:n}=Le({rooms:o??[],exclusiveAccordion:r}),l=c.useCallback((m,g)=>{p(g)},[p]),u=c.useCallback(m=>{b(m)},[b]);return y.jsx(Te,{rooms:o,formattedBookings:t,formattedOverallTotal:d,labels:s,loading:k,readonly:e,exclusiveAccordion:r,activeRooms:f,initialActiveRooms:n,onActiveRoomsChange:u,onRemoveItem:l,onConfirm:a})},ke=({initialItems:s=[],bookings:i,config:e,categories:r,labels:a,currency:o,nights:t,disabledAttributes:d,readonly:p=!1,loading:h=!1,exclusiveAccordion:k=!0,onConfirm:f,onStateChange:b,layout:n="side-by-side",showTitle:l=!0,title:u="Customize your stay",description:m="Pick room add-ons to tailor the experience. Selections update the cart in real-time."})=>{var x;const g=((x=i[0])==null?void 0:x.bookingKey)||"default";return y.jsx(he,{initialItems:s,bookings:i,config:e,onStateChange:b,children:y.jsxs("div",{className:n==="side-by-side"?"grid grid-cols-1 gap-6 lg:grid-cols-2":"space-y-6",children:[y.jsxs("div",{className:"space-y-6",children:[l&&y.jsxs("div",{className:"space-y-2",children:[y.jsx("h2",{className:"font-semibold text-foreground text-xl",children:u}),y.jsx("p",{className:"text-muted-foreground text-sm",children:m})]}),y.jsx(Pe,{categories:r,bookingKey:g,currency:o,nights:t,disabledAttributes:d,readonly:p})]}),y.jsx("div",{className:n==="side-by-side"?"lg:sticky lg:top-6 lg:self-start":"",children:y.jsx(ze,{labels:a,loading:h,readonly:p,exclusiveAccordion:k,onConfirm:f})})]})})};ke.__docgenInfo={description:`Wrapper component that provides synchronized state between
AttributesCategories and MultiBookingPricingSummaryPanel`,methods:[],displayName:"RoomCustomizationStoryWrapper",props:{initialItems:{required:!1,tsType:{name:"Array",elements:[{name:"CartItem"}],raw:"CartItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},bookings:{required:!0,tsType:{name:"Array",elements:[{name:"BookingInfo"}],raw:"BookingInfo[]"},description:""},config:{required:!1,tsType:{name:"Partial",elements:[{name:"TransformConfig"}],raw:"Partial<TransformConfig>"},description:""},categories:{required:!0,tsType:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: number
  name: string
  description?: string
  attributes: RoomCustomizationAttribute[]
}`,signature:{properties:[{key:"id",value:{name:"number",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"attributes",value:{name:"Array",elements:[{name:"signature",type:"object",raw:`{
  id: number
  name: string
  description?: string
  icon: string
  amount: number
  exclusivityRatio?: number
  disabled?: boolean
}`,signature:{properties:[{key:"id",value:{name:"number",required:!0}},{key:"name",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"icon",value:{name:"string",required:!0}},{key:"amount",value:{name:"number",required:!0}},{key:"exclusivityRatio",value:{name:"number",required:!1}},{key:"disabled",value:{name:"boolean",required:!1}}]}}],raw:"RoomCustomizationAttribute[]",required:!0}}]}}],raw:"RoomCustomizationCategory[]"},description:""},labels:{required:!0,tsType:{name:"UILabels"},description:""},currency:{required:!0,tsType:{name:"string"},description:""},nights:{required:!0,tsType:{name:"number"},description:""},disabledAttributes:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""},readonly:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},loading:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},exclusiveAccordion:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},onConfirm:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onStateChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(state: { items: CartItem[]; isLoading: Record<string, boolean> }) => void",signature:{arguments:[{type:{name:"signature",type:"object",raw:"{ items: CartItem[]; isLoading: Record<string, boolean> }",signature:{properties:[{key:"items",value:{name:"Array",elements:[{name:"CartItem"}],raw:"CartItem[]",required:!0}},{key:"isLoading",value:{name:"Record",elements:[{name:"string"},{name:"boolean"}],raw:"Record<string, boolean>",required:!0}}]}},name:"state"}],return:{name:"void"}}},description:""},layout:{required:!1,tsType:{name:"union",raw:"'side-by-side' | 'stacked'",elements:[{name:"literal",value:"'side-by-side'"},{name:"literal",value:"'stacked'"}]},description:"",defaultValue:{value:"'side-by-side'",computed:!1}},showTitle:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Customize your stay'",computed:!1}},description:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Pick room add-ons to tailor the experience. Selections update the cart in real-time.'",computed:!1}}}};const et={title:"Upsell/RoomCustomization/Synchronized",component:ke,parameters:{layout:"padded",docs:{description:{component:`
**Interactive Room Customization with Live Cart Sync**

This story demonstrates the full production-like user flow where:
1. Users select/deselect attributes from categories
2. Cart state updates with simulated loading
3. Pricing summary reflects changes in real-time
4. Remove actions work bidirectionally

Built with React Context + useState (no Zustand) for Storybook isolation.
        `}}}},S=[{id:"booking-1",bookingKey:"booking-1",displayName:"Skyline Suite",guestName:"Sarah Johnson",checkIn:"2024-12-15",checkOut:"2024-12-18",nights:3,guests:2}],je=[{id:"booking-1",bookingKey:"booking-1",displayName:"Skyline Suite",guestName:"Sarah Johnson",checkIn:"2024-12-15",checkOut:"2024-12-18",nights:3,guests:2},{id:"booking-2",bookingKey:"booking-2",displayName:"Deluxe King Room",guestName:"Miguel Torres",checkIn:"2024-12-15",checkOut:"2024-12-17",nights:2,guests:3}],M=[{id:"attr-101",name:"Premium Bedding Package",amount:72,bookingKey:"booking-1",categoryId:1,attributeId:101,type:"attribute"},{id:"attr-201",name:"Sunset Ocean View",amount:84,bookingKey:"booking-1",categoryId:2,attributeId:201,type:"attribute"}],I={args:{initialItems:[],bookings:S,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},title:"Customize your stay",description:"Select room add-ons to see them appear in the pricing summary on the right."},parameters:{docs:{description:{story:`
Start with an empty cart. Click "Add" on attribute cards to see real-time updates in the pricing summary.
The cart simulates async loading with a 300ms delay for realistic interaction.
        `}}}},R={args:{initialItems:M,bookings:S,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},title:"Review your selections",description:"Previously selected add-ons are highlighted. Click to adjust your choices."},parameters:{docs:{description:{story:`
Demonstrates starting with pre-selected items (e.g., from URL params, previous step, or consultation call).
Users can remove existing selections or add more.
        `}}}},U={args:{initialItems:[],bookings:S,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},disabledAttributes:Ue,title:"Limited availability",description:"Some upgrades are temporarily unavailable for this booking window."},parameters:{docs:{description:{story:`
Simulates service inventory fallback when availability rules disable certain attributes.
Disabled cards show tooltips and cannot be selected.
        `}}}},L={args:{initialItems:M,bookings:S,categories:C,labels:{...v,confirmButtonLabel:"Confirm and proceed"},currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},readonly:!0,title:"Requested add-ons",description:"Guest requested these amenities during consultation. Review before confirming."},parameters:{docs:{description:{story:`
Matches the consultation/read-only flow where selections are locked for review.
Add/Remove buttons are hidden, and pricing is display-only.
        `}}}},T={args:{initialItems:[],bookings:je,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},exclusiveAccordion:!0,title:"Customize all rooms",description:"Add customizations for each booking. Selections are tracked per room."},parameters:{docs:{description:{story:`
Shows multi-booking scenario with accordion-based pricing summary.
Current implementation assigns all attributes to the first booking.
For production, implement per-booking attribute selection UI.
        `}}}},A={args:{initialItems:M,bookings:S,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},loading:!0,title:"Customize your stay",description:"Loading state demonstration"},parameters:{docs:{description:{story:`
Shows the loading overlay while cart recalculates.
In practice, this would display during API calls for pricing validation.
        `}}}},N={args:{initialItems:[],bookings:S,categories:C,labels:v,currency:"EUR",nights:3,config:{currency:"EUR",locale:"en-US",includeNightMultiplier:!1},layout:"stacked",title:"Customize your stay",description:"Stacked layout for smaller viewports."},parameters:{docs:{description:{story:`
Vertical layout where pricing summary appears below attribute selection.
Better for mobile or narrow viewports.
        `}}}};var B,P,z,j,K;I.parameters={...I.parameters,docs:{...(B=I.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    title: 'Customize your stay',
    description: 'Select room add-ons to see them appear in the pricing summary on the right.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Start with an empty cart. Click "Add" on attribute cards to see real-time updates in the pricing summary.
The cart simulates async loading with a 300ms delay for realistic interaction.
        \`
      }
    }
  }
}`,...(z=(P=I.parameters)==null?void 0:P.docs)==null?void 0:z.source},description:{story:`Interactive Selection - Start with empty cart

User flow:
1. Click "Add" on any attribute card
2. Watch cart summary update on the right
3. Click "Remove" from either location
4. See totals recalculate`,...(K=(j=I.parameters)==null?void 0:j.docs)==null?void 0:K.description}}};var D,O,V,$,_;R.parameters={...R.parameters,docs:{...(D=R.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    title: 'Review your selections',
    description: 'Previously selected add-ons are highlighted. Click to adjust your choices.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Demonstrates starting with pre-selected items (e.g., from URL params, previous step, or consultation call).
Users can remove existing selections or add more.
        \`
      }
    }
  }
}`,...(V=(O=R.parameters)==null?void 0:O.docs)==null?void 0:V.source},description:{story:`Pre-filled Cart - Start with items already selected

Simulates the consultation/review flow where selections come from a previous step.`,...(_=($=R.parameters)==null?void 0:$.docs)==null?void 0:_.description}}};var F,G,W,J,Y;U.parameters={...U.parameters,docs:{...(F=U.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    disabledAttributes: limitedAvailabilityAttributeIds,
    title: 'Limited availability',
    description: 'Some upgrades are temporarily unavailable for this booking window.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Simulates service inventory fallback when availability rules disable certain attributes.
Disabled cards show tooltips and cannot be selected.
        \`
      }
    }
  }
}`,...(W=(G=U.parameters)==null?void 0:G.docs)==null?void 0:W.source},description:{story:`Limited Inventory - Some attributes unavailable

Shows disabled state when attributes are out of stock or restricted.`,...(Y=(J=U.parameters)==null?void 0:J.docs)==null?void 0:Y.description}}};var Z,H,Q,X,ee;L.parameters={...L.parameters,docs:{...(Z=L.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: {
      ...pricingSummaryLabels,
      confirmButtonLabel: 'Confirm and proceed'
    },
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    readonly: true,
    title: 'Requested add-ons',
    description: 'Guest requested these amenities during consultation. Review before confirming.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Matches the consultation/read-only flow where selections are locked for review.
Add/Remove buttons are hidden, and pricing is display-only.
        \`
      }
    }
  }
}`,...(Q=(H=L.parameters)==null?void 0:H.docs)==null?void 0:Q.source},description:{story:`Read-only Mode - Consultation review flow

Locked selections for review before final confirmation.`,...(ee=(X=L.parameters)==null?void 0:X.docs)==null?void 0:ee.description}}};var te,re,ne,ie,oe;T.parameters={...T.parameters,docs:{...(te=T.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    initialItems: [],
    bookings: multiRoomBookings,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    exclusiveAccordion: true,
    title: 'Customize all rooms',
    description: 'Add customizations for each booking. Selections are tracked per room.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Shows multi-booking scenario with accordion-based pricing summary.
Current implementation assigns all attributes to the first booking.
For production, implement per-booking attribute selection UI.
        \`
      }
    }
  }
}`,...(ne=(re=T.parameters)==null?void 0:re.docs)==null?void 0:ne.source},description:{story:`Multi-booking Scenario - Independent carts per room

NOTE: Current implementation uses single booking key for attribute selection.
For true multi-booking support, extend ConnectedAttributesCategories to support
multiple booking contexts or show separate sections per booking.`,...(oe=(ie=T.parameters)==null?void 0:ie.docs)==null?void 0:oe.description}}};var se,ae,le,ce,de;A.parameters={...A.parameters,docs:{...(se=A.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    initialItems: prefilledCartItems,
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    loading: true,
    title: 'Customize your stay',
    description: 'Loading state demonstration'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Shows the loading overlay while cart recalculates.
In practice, this would display during API calls for pricing validation.
        \`
      }
    }
  }
}`,...(le=(ae=A.parameters)==null?void 0:ae.docs)==null?void 0:le.source},description:{story:`Loading State - Simulated async operations

Demonstrates loading overlay while cart operations are in progress.`,...(de=(ce=A.parameters)==null?void 0:ce.docs)==null?void 0:de.description}}};var ue,me,pe,ge,ye;N.parameters={...N.parameters,docs:{...(ue=N.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    initialItems: [],
    bookings: singleRoomBooking,
    categories: defaultRoomCustomizationCategories,
    labels: pricingSummaryLabels,
    currency: 'EUR',
    nights: 3,
    config: {
      currency: 'EUR',
      locale: 'en-US',
      includeNightMultiplier: false
    },
    layout: 'stacked',
    title: 'Customize your stay',
    description: 'Stacked layout for smaller viewports.'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Vertical layout where pricing summary appears below attribute selection.
Better for mobile or narrow viewports.
        \`
      }
    }
  }
}`,...(pe=(me=N.parameters)==null?void 0:me.docs)==null?void 0:pe.source},description:{story:"Stacked Layout - Mobile-friendly vertical layout",...(ye=(ge=N.parameters)==null?void 0:ge.docs)==null?void 0:ye.description}}};const tt=["InteractiveSelection","PrefilledCart","LimitedInventory","ReadOnlyConsultation","MultipleRooms","LoadingState","StackedLayout"];export{I as InteractiveSelection,U as LimitedInventory,A as LoadingState,T as MultipleRooms,R as PrefilledCart,L as ReadOnlyConsultation,N as StackedLayout,tt as __namedExportsOrder,et as default};
