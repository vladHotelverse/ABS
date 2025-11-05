import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{S as t}from"./skeleton-BUWR1J4E.js";import{R as w}from"./RoomCustomizationPreview-Cl93tKoo.js";import{d as a,c as R,l as S}from"./attributeFormatter-BYYUaegB.js";import"./utils-BPIQTVVm.js";import"./index-yIsmwZOr.js";import"./translations-CxNbP9RY.js";import"./button-Dzxadojh.js";import"./tooltip-CS7T2Siy.js";import"./index-CZ_84MJS.js";import"./index-CrvKlczb.js";import"./x-DuINInzT.js";import"./useIsDesktop-D-Yc6gef.js";const T={title:"Upsell/RoomCustomization",component:w,parameters:{layout:"fullscreen"},argTypes:{nights:{control:{type:"number",min:1,step:1}}}},s={args:{title:"Customize your stay",description:"Pick room add-ons to tailor the experience before guests arrive.",currency:"EUR",nights:4,categories:a},parameters:{docs:{description:{story:`
Recreates the upsell page layout where room customization lives beneath the upgrade carousel. Tweak the controls to
simulate hotel data, attribute pricing, or length of stay without opening \`apps/upsell-app\`.
        `}}}},i={args:{title:"Requested add-ons",description:"Guests asked for the following amenities during the call. Review before confirming.",currency:"EUR",nights:4,categories:a,initialSelectedIds:R,readonly:!0},parameters:{docs:{description:{story:`
Matches the consultation/read-only flow where selections come from a concierge interaction. Agents review the locked
choices with editing disabled.
        `}}}},o={args:{title:"Limited availability",description:"Some upgrades are temporarily unavailable for this booking window.",currency:"EUR",nights:3,categories:a,disabledAttributes:S,initialSelectedIds:[101]},parameters:{docs:{description:{story:`
Simulates the service inventory fallback when availability rules disable certain attributes after pricing refresh.
Disabled cards show the tooltip and selection is prevented.
        `}}}},r={args:{title:"Customize your stay",description:"Loading personalization options…",currency:"EUR",nights:4,categories:a},render:f=>e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur",children:e.jsxs("div",{className:"space-y-3 rounded-lg bg-white p-6 shadow-md",children:[e.jsx(t,{className:"h-6 w-48"}),e.jsx(t,{className:"h-4 w-64"}),e.jsxs("div",{className:"grid grid-cols-1 gap-2 sm:grid-cols-2",children:[e.jsx(t,{className:"h-24 rounded-lg"}),e.jsx(t,{className:"h-24 rounded-lg"}),e.jsx(t,{className:"h-24 rounded-lg sm:col-span-2"})]})]})}),e.jsx(w,{...f})]}),parameters:{docs:{description:{story:`
Shows the optimistic loading overlay used while attribute pricing resolves. Beneath the skeleton, the eventual layout
renders so spacing and scroll behaviour stay consistent.
        `}}}};var n,l,c;s.parameters={...s.parameters,docs:{...(n=s.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    title: 'Customize your stay',
    description: 'Pick room add-ons to tailor the experience before guests arrive.',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories
  },
  parameters: {
    docs: {
      description: {
        story: \`
Recreates the upsell page layout where room customization lives beneath the upgrade carousel. Tweak the controls to
simulate hotel data, attribute pricing, or length of stay without opening \\\`apps/upsell-app\\\`.
        \`
      }
    }
  }
}`,...(c=(l=s.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,m,u;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    title: 'Requested add-ons',
    description: 'Guests asked for the following amenities during the call. Review before confirming.',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories,
    initialSelectedIds: consultationPreviewSelection,
    readonly: true
  },
  parameters: {
    docs: {
      description: {
        story: \`
Matches the consultation/read-only flow where selections come from a concierge interaction. Agents review the locked
choices with editing disabled.
        \`
      }
    }
  }
}`,...(u=(m=i.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var p,g,h;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    title: 'Limited availability',
    description: 'Some upgrades are temporarily unavailable for this booking window.',
    currency: 'EUR',
    nights: 3,
    categories: defaultRoomCustomizationCategories,
    disabledAttributes: limitedAvailabilityAttributeIds,
    initialSelectedIds: [101]
  },
  parameters: {
    docs: {
      description: {
        story: \`
Simulates the service inventory fallback when availability rules disable certain attributes after pricing refresh.
Disabled cards show the tooltip and selection is prevented.
        \`
      }
    }
  }
}`,...(h=(g=o.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var y,v,b;r.parameters={...r.parameters,docs:{...(y=r.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    title: 'Customize your stay',
    description: 'Loading personalization options…',
    currency: 'EUR',
    nights: 4,
    categories: defaultRoomCustomizationCategories
  },
  render: args => <div className="relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur">
        <div className="space-y-3 rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg sm:col-span-2" />
          </div>
        </div>
      </div>
      <RoomCustomizationPreview {...args} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
Shows the optimistic loading overlay used while attribute pricing resolves. Beneath the skeleton, the eventual layout
renders so spacing and scroll behaviour stay consistent.
        \`
      }
    }
  }
}`,...(b=(v=r.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};const q=["Default","ConsultationReview","LimitedInventory","LoadingState"];export{i as ConsultationReview,s as Default,o as LimitedInventory,r as LoadingState,q as __namedExportsOrder,T as default};
