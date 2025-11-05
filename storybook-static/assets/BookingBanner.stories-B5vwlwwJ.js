import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{S as a}from"./skeleton-BUWR1J4E.js";import{B as y}from"./index-C5PU_V98.js";import{R as j,a as B,b as R,c as S}from"./index-B8llYjAU.js";import"./utils-BPIQTVVm.js";import"./index-yIsmwZOr.js";import"./calendar-FSbPRefC.js";const T=({children:s})=>e.jsxs(j,{showMobileWidget:!0,className:"bg-slate-100",children:[s,e.jsxs(B,{children:[e.jsx(R,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx("div",{className:"rounded-lg bg-white p-6 shadow-sm",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx(a,{className:"h-6 w-48"}),e.jsx(a,{className:"h-4 w-full"}),e.jsx(a,{className:"h-4 w-5/6"})]})}),e.jsxs("div",{className:"rounded-lg bg-white p-6 shadow-sm",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{className:"h-6 w-40"}),e.jsx(a,{className:"h-6 w-24"})]}),e.jsxs("div",{className:"mt-4 space-y-2",children:[e.jsx(a,{className:"h-4 w-full"}),e.jsx(a,{className:"h-4 w-5/6"}),e.jsx(a,{className:"h-4 w-2/3"})]})]})]})}),e.jsx(S,{children:e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"rounded-lg bg-white p-5 shadow-sm",children:[e.jsx(a,{className:"h-5 w-32"}),e.jsxs("div",{className:"mt-4 space-y-2",children:[e.jsx(a,{className:"h-4 w-full"}),e.jsx(a,{className:"h-4 w-5/6"}),e.jsx(a,{className:"h-4 w-3/4"})]}),e.jsx(a,{className:"mt-6 h-10 w-full rounded-md"})]}),e.jsxs("div",{className:"rounded-lg bg-white p-5 shadow-sm",children:[e.jsx(a,{className:"h-5 w-28"}),e.jsx(a,{className:"mt-3 h-4 w-2/3"})]})]})})]}),e.jsx("div",{className:"mt-4 rounded-t-lg bg-white p-4 shadow-sm lg:hidden",children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{className:"h-5 w-32"}),e.jsx(a,{className:"h-8 w-24 rounded-md"})]})})]}),_={title:"Upsell/BookingBanner",component:y,parameters:{layout:"fullscreen"},tags:["autodocs"],decorators:[s=>e.jsx(T,{children:e.jsx(s,{})})],argTypes:{hotelImage:{control:"text"},companyLogo:{control:"text"},welcomeText:{control:"object"},hotelName:{control:"text"},bookingDateRange:{control:"text"},bookingNights:{control:"text"},bookingReference:{control:"text"},className:{control:"text"}}},t={args:{welcomeText:{salutation:"Welcome back,",greeting:"Alex!"},hotelName:"Hotel Paradise Resort",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp",bookingDateRange:"12 Aug 2024 - 19 Aug 2024",bookingNights:"7 nights",bookingReference:"BCN-458921"},parameters:{docs:{description:{story:`
Mirrors the booking page usage from \`apps/upsell-app\`: the banner sits at the top of the responsive layout, followed by
main booking content and pricing widgets. Use the controls to test different hotel branding, imagery, and booking
details without opening the app.
        `}}}},o={name:"Mobile With Booking Details",args:{welcomeText:{salutation:"Hey",greeting:"Jamie!"},hotelName:"Cloud Nine Resort",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp",bookingDateRange:"22 Sep 2024 - 25 Sep 2024",bookingNights:"3 nights",bookingReference:"NYC-882144"},parameters:{viewport:{defaultViewport:"mobile1"},docs:{description:{story:`
Highlights the mobile layout where booking reference and stay dates are now visible beneath the hotel details. Use the
Storybook viewport toolbar to preview other breakpoints.
        `}}}},n={args:{welcomeText:{salutation:"Hi",greeting:"Pat!"},hotelName:"The Grand Budapest Hotel",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp"},parameters:{docs:{description:{story:`
Mirrors \`BookingBannerContainer\` in the upsell-app: data fetchers populate hotel name, logo, and image, while booking
metadata is omitted because it's retrieved deeper in the flow.
        `}}}},r={args:{welcomeText:{salutation:"Welcome",greeting:"Traveler!"},hotelName:"Hotel Without Assets"},parameters:{docs:{description:{story:`
Fallback view when masters data lacks imagery or branding. Useful for testing how the banner behaves in low-data
environments or for partner onboarding.
        `}}}},i={args:{welcomeText:{salutation:"Welcome back,",greeting:"Alex!"},hotelName:"Hotel Paradise Resort",hotelImage:"https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp",companyLogo:"https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp"},render:s=>e.jsxs("div",{className:"relative",children:[e.jsx("div",{className:"absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur",children:e.jsxs("div",{className:"space-y-3 rounded-lg bg-white p-6 shadow-md",children:[e.jsx(a,{className:"h-6 w-40"}),e.jsx(a,{className:"h-4 w-56"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{className:"h-4 w-32"}),e.jsx(a,{className:"h-4 w-24"})]})]})}),e.jsx(y,{...s,className:"pointer-events-none opacity-30"})]}),parameters:{docs:{description:{story:`
Simulates the optimistic loading state used while booking data hydrates. The semi-transparent banner shows the eventual
layout, while an overlay skeleton communicates that the fetch is still in progress.
        `}}}};var l,c,d;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    welcomeText: {
      salutation: 'Welcome back,',
      greeting: 'Alex!'
    },
    hotelName: 'Hotel Paradise Resort',
    hotelImage: 'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
    bookingDateRange: '12 Aug 2024 - 19 Aug 2024',
    bookingNights: '7 nights',
    bookingReference: 'BCN-458921'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Mirrors the booking page usage from \\\`apps/upsell-app\\\`: the banner sits at the top of the responsive layout, followed by
main booking content and pricing widgets. Use the controls to test different hotel branding, imagery, and booking
details without opening the app.
        \`
      }
    }
  }
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var h,m,g;o.parameters={...o.parameters,docs:{...(h=o.parameters)==null?void 0:h.docs,source:{originalSource:`{
  name: 'Mobile With Booking Details',
  args: {
    welcomeText: {
      salutation: 'Hey',
      greeting: 'Jamie!'
    },
    hotelName: 'Cloud Nine Resort',
    hotelImage: 'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp',
    bookingDateRange: '22 Sep 2024 - 25 Sep 2024',
    bookingNights: '3 nights',
    bookingReference: 'NYC-882144'
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: \`
Highlights the mobile layout where booking reference and stay dates are now visible beneath the hotel details. Use the
Storybook viewport toolbar to preview other breakpoints.
        \`
      }
    }
  }
}`,...(g=(m=o.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};var p,b,w;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    welcomeText: {
      salutation: 'Hi',
      greeting: 'Pat!'
    },
    hotelName: 'The Grand Budapest Hotel',
    hotelImage: 'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Mirrors \\\`BookingBannerContainer\\\` in the upsell-app: data fetchers populate hotel name, logo, and image, while booking
metadata is omitted because it's retrieved deeper in the flow.
        \`
      }
    }
  }
}`,...(w=(b=n.parameters)==null?void 0:b.docs)==null?void 0:w.source}}};var u,v,x;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    welcomeText: {
      salutation: 'Welcome',
      greeting: 'Traveler!'
    },
    hotelName: 'Hotel Without Assets'
  },
  parameters: {
    docs: {
      description: {
        story: \`
Fallback view when masters data lacks imagery or branding. Useful for testing how the banner behaves in low-data
environments or for partner onboarding.
        \`
      }
    }
  }
}`,...(x=(v=r.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};var N,f,k;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    welcomeText: {
      salutation: 'Welcome back,',
      greeting: 'Alex!'
    },
    hotelName: 'Hotel Paradise Resort',
    hotelImage: 'https://cdn.hotelverse.tech/renderimages/h323/views/01_main-0060/37fd4da9-4801-458d-9886-33a5d8521482/original.webp',
    companyLogo: 'https://cdn.hotelverse.tech/logos/h323/fc48c20e-9a2e-414d-ba2e-2863aa069ae5/original.webp'
  },
  render: args => <div className="relative">
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur">
        <div className="space-y-3 rounded-lg bg-white p-6 shadow-md">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <BookingBanner {...args} className="pointer-events-none opacity-30" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
Simulates the optimistic loading state used while booking data hydrates. The semi-transparent banner shows the eventual
layout, while an overlay skeleton communicates that the fetch is still in progress.
        \`
      }
    }
  }
}`,...(k=(f=i.parameters)==null?void 0:f.docs)==null?void 0:k.source}}};const I=["Default","MobileBookingDetails","BookingFlowContainer","MissingBrandAssets","LoadingState"];export{n as BookingFlowContainer,t as Default,i as LoadingState,r as MissingBrandAssets,o as MobileBookingDetails,I as __namedExportsOrder,_ as default};
