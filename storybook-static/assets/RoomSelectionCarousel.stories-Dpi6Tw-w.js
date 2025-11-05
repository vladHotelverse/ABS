import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as m}from"./index-yIsmwZOr.js";import{S as s}from"./skeleton-BUWR1J4E.js";import{B as H}from"./index-C5PU_V98.js";import{R as M,e as z,a as U,b as _,c as E,d as L}from"./index-B8llYjAU.js";import{a as P,R as B,r as A}from"./RoomUpgradeCarousel-CofKivqR.js";import{u as W}from"./translations-CxNbP9RY.js";import{d as Z}from"./attributeFormatter-BYYUaegB.js";import{R as F}from"./RoomCustomizationPreview-Cl93tKoo.js";import"./utils-BPIQTVVm.js";import"./calendar-FSbPRefC.js";import"./button-Dzxadojh.js";import"./chevron-right-DysUUpD1.js";import"./index-CZ_84MJS.js";import"./star-COhMArgh.js";import"./useIsDesktop-D-Yc6gef.js";import"./tooltip-CS7T2Siy.js";import"./index-CrvKlczb.js";import"./x-DuINInzT.js";const a=P(A.slice(0,4)),$=()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-lg bg-white p-5 shadow-sm",children:[e.jsx(s,{className:"h-5 w-40"}),e.jsxs("div",{className:"mt-4 space-y-3",children:[e.jsx(s,{className:"h-4 w-full"}),e.jsx(s,{className:"h-4 w-5/6"}),e.jsx(s,{className:"h-4 w-3/4"})]}),e.jsxs("div",{className:"mt-6 space-y-2 border-border border-t pt-4",children:[e.jsx(s,{className:"h-4 w-1/2"}),e.jsx(s,{className:"h-5 w-3/5"})]}),e.jsx(s,{className:"mt-5 h-10 w-full rounded-md"})]}),e.jsxs("div",{className:"rounded-lg bg-white p-5 shadow-sm",children:[e.jsx(s,{className:"h-5 w-32"}),e.jsxs("div",{className:"mt-3 space-y-2",children:[e.jsx(s,{className:"h-4 w-3/4"}),e.jsx(s,{className:"h-4 w-full"})]})]})]}),I=({children:o})=>e.jsxs(M,{showMobileWidget:!0,className:"bg-slate-100",children:[e.jsx(z,{children:e.jsx("div",{className:"bg-white shadow-sm",children:e.jsxs("div",{className:"mx-auto flex max-w-6xl items-center gap-4 px-4 py-4",children:[e.jsx(s,{className:"h-10 w-10 rounded-full"}),e.jsxs("div",{className:"flex-1 space-y-2",children:[e.jsx(s,{className:"h-4 w-48"}),e.jsx(s,{className:"h-3 w-64"})]}),e.jsx(s,{className:"h-10 w-36 rounded-md"})]})})}),e.jsx("div",{className:"bg-white shadow-sm",children:e.jsx(H,{welcomeText:{salutation:"Welcome back,",greeting:"Alex!"},hotelName:"Hotel Paradise Resort",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp",bookingDateRange:"12 Aug 2024 - 19 Aug 2024",bookingReference:"BCN-458921"})}),e.jsxs(U,{children:[e.jsx(_,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx("section",{className:"rounded-lg bg-white p-6 shadow-sm",children:o}),e.jsx(F,{title:"Customize your stay",description:"Upgrades selected in the carousel will surface here for cross-checking.",currency:"EUR",nights:4,categories:Z})]})}),e.jsx(E,{children:e.jsx($,{})})]}),e.jsx(L,{children:e.jsx("div",{className:"border-border border-t bg-white p-4 shadow-[0_-4px_12px_rgba(15,23,42,0.08)]",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(s,{className:"h-3 w-12"}),e.jsx(s,{className:"h-5 w-20"})]}),e.jsx(s,{className:"h-8 w-24 rounded-md"})]}),e.jsx(s,{className:"h-10 w-28 rounded-md"})]})})})]}),q=({rooms:o,translations:d=W,enableHoverZoom:O=!0,loading:T=!1})=>{const[r,p]=m.useState(o[0]??null);m.useEffect(()=>{p(o[0]??null)},[o]);const D=m.useMemo(()=>r?`${d.currencySymbol}${r.price}`:null,[r,d.currencySymbol]);return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h2",{className:"font-semibold text-foreground text-xl",children:"Choose your upgrade"}),e.jsx("p",{className:"text-muted-foreground text-sm",children:"Mirrors the upsell flow where guests review upgrade rooms before customising extras."})]}),e.jsxs("div",{className:"relative",children:[T&&e.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur",children:e.jsxs("div",{className:"space-y-2 rounded-lg bg-white p-4 shadow-md",children:[e.jsx(s,{className:"h-6 w-40"}),e.jsx(s,{className:"h-6 w-6 animate-spin rounded-full"})]})}),e.jsx(B,{roomOptions:o,initialSelectedRoom:r,onRoomSelected:p,translations:d,enableHoverZoom:O,className:"w-full"})]}),e.jsx("div",{className:"rounded-lg bg-muted p-4 shadow-inner",children:r?e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"font-medium text-foreground",children:"Selected room"}),e.jsx("p",{className:"mt-1 text-muted-foreground text-sm",children:r.roomType}),e.jsxs("div",{className:"mt-3 flex items-center justify-between text-sm",children:[e.jsx("span",{children:r.title??r.roomType}),e.jsx("span",{className:"font-semibold",children:D})]})]}):e.jsx("p",{className:"text-muted-foreground text-sm",children:"Select a room to preview pricing and details."})})]})},pe={title:"Upsell/RoomSelectionCarousel",component:q,parameters:{layout:"fullscreen"},decorators:[o=>e.jsx(I,{children:e.jsx(o,{})})],argTypes:{rooms:{control:!1},translations:{control:!1},enableHoverZoom:{control:"boolean"},loading:{control:"boolean"}}},t={args:{rooms:a},parameters:{docs:{description:{story:`
Matches the multi-room upgrade carousel embedded in \`apps/upsell-app\`. The decorator keeps the sidebar and extra
sections visible using skeletons so the spacing mirrors production.
        `}}}},n={args:{rooms:a.slice(0,2)},parameters:{docs:{description:{story:`
Demonstrates the two-room layout that switches between side-by-side cards on desktop and carousel on mobile viewports.
        `}}}},i={args:{rooms:a.slice(0,1)},parameters:{docs:{description:{story:`
Single-room scenario collapses the carousel into a compact card, matching properties that only upsell one upgrade choice.
        `}}}},c={args:{rooms:a,enableHoverZoom:!1},parameters:{docs:{description:{story:`
Use this variant to review the component without the hover zoom overlay (useful for accessibility audits or low-bandwidth
setups).
        `}}}},l={args:{rooms:a,loading:!0},parameters:{docs:{description:{story:`
Simulates the optimistic loading veil shown while the upgrade list fetches from the engine or revalidates pricing.
        `}}}};var h,u,g;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    rooms: baseRoomOptions
  },
  parameters: {
    docs: {
      description: {
        story: \`
Matches the multi-room upgrade carousel embedded in \\\`apps/upsell-app\\\`. The decorator keeps the sidebar and extra
sections visible using skeletons so the spacing mirrors production.
        \`
      }
    }
  }
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var x,w,b;n.parameters={...n.parameters,docs:{...(x=n.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    rooms: baseRoomOptions.slice(0, 2)
  },
  parameters: {
    docs: {
      description: {
        story: \`
Demonstrates the two-room layout that switches between side-by-side cards on desktop and carousel on mobile viewports.
        \`
      }
    }
  }
}`,...(b=(w=n.parameters)==null?void 0:w.docs)==null?void 0:b.source}}};var j,f,v;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    rooms: baseRoomOptions.slice(0, 1)
  },
  parameters: {
    docs: {
      description: {
        story: \`
Single-room scenario collapses the carousel into a compact card, matching properties that only upsell one upgrade choice.
        \`
      }
    }
  }
}`,...(v=(f=i.parameters)==null?void 0:f.docs)==null?void 0:v.source}}};var N,y,R;c.parameters={...c.parameters,docs:{...(N=c.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    rooms: baseRoomOptions,
    enableHoverZoom: false
  },
  parameters: {
    docs: {
      description: {
        story: \`
Use this variant to review the component without the hover zoom overlay (useful for accessibility audits or low-bandwidth
setups).
        \`
      }
    }
  }
}`,...(R=(y=c.parameters)==null?void 0:y.docs)==null?void 0:R.source}}};var S,k,C;l.parameters={...l.parameters,docs:{...(S=l.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    rooms: baseRoomOptions,
    loading: true
  },
  parameters: {
    docs: {
      description: {
        story: \`
Simulates the optimistic loading veil shown while the upgrade list fetches from the engine or revalidates pricing.
        \`
      }
    }
  }
}`,...(C=(k=l.parameters)==null?void 0:k.docs)==null?void 0:C.source}}};const he=["Default","TwoRooms","SingleRoom","HoverDisabled","Loading"];export{t as Default,c as HoverDisabled,l as Loading,i as SingleRoom,n as TwoRooms,he as __namedExportsOrder,pe as default};
