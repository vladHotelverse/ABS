import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{S as g}from"./skeleton-BUWR1J4E.js";import{T as n,t as p}from"./TabsStrip-BAC56n61.js";import"./ConfigurationErrorBoundary-FfiUzmvf.js";import"./translations-CxNbP9RY.js";import{U as b}from"./users-pk_HKbK0.js";import"./utils-BPIQTVVm.js";import"./index-yIsmwZOr.js";import"./button-Dzxadojh.js";const x=s=>s.map(a=>({id:a.id,label:a.label,badge:typeof a.guests=="number"?e.jsxs("span",{className:"inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs",children:[e.jsx(b,{className:"h-4 w-4"})," ",a.guests]}):void 0})),E={title:"Upsell/TabsDemo",component:n,parameters:{layout:"fullscreen"},argTypes:{onChange:{action:"tab changed"}}},u=[{id:"room-1",label:"Room 1",guests:2},{id:"room-2",label:"Room 2",guests:4},{id:"room-3",label:"Room 3",guests:2}],t={args:{tabs:x(u),sticky:!0},render:s=>e.jsx("div",{style:p,children:e.jsx(n,{...s})})},r={render:()=>e.jsxs("div",{className:"bg-muted",style:p,children:[e.jsx(n,{tabs:x(u)}),e.jsxs("div",{className:"mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3",children:[e.jsx("div",{className:"space-y-4 lg:col-span-2",children:e.jsxs("div",{className:"rounded-xl bg-white p-6 shadow-sm",children:[e.jsx("h2",{className:"font-bold text-2xl",children:"Upgrade Your Room - TRIPLE DELUXE GOLF VIEW"}),e.jsx("p",{className:"text-muted-foreground",children:"Choose an upgrade for your currently selected room."}),e.jsx("div",{className:"mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3",children:[1,2,3].map(s=>e.jsxs("div",{className:"overflow-hidden rounded-xl bg-white p-0 shadow-[var(--shadow-depth-2)] ring-1 ring-border/60",children:[e.jsxs("div",{className:"relative",children:[e.jsx(g,{className:"h-44 w-full"}),e.jsxs("div",{className:"absolute top-2 left-2 space-x-2",children:[e.jsx("span",{className:"rounded-full bg-white/90 px-2 py-0.5 text-xs",children:"Mountain View"}),e.jsx("span",{className:"rounded-full bg-white/90 px-2 py-0.5 text-xs",children:"Kitchenette"})]}),e.jsx("div",{className:"absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-0.5 text-xs",children:"8 photos"})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{className:"font-semibold",children:"JUNIOR SUITE"}),e.jsx("p",{className:"mt-1 line-clamp-2 text-muted-foreground text-sm",children:"Enjoy a spacious retreat of 84 m² designed for complete relaxation..."}),e.jsxs("div",{className:"mt-3 flex items-center justify-between",children:[e.jsxs("div",{className:"text-muted-foreground",children:[e.jsx("span",{className:"font-bold text-2xl",children:"60"})," € / night"]}),e.jsx("button",{className:"rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm",children:"UPGRADE NOW"})]}),e.jsx("p",{className:"text-muted-foreground text-xs",children:"Additional cost per night"})]})]},s))})]})}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-xl bg-white p-0 shadow-sm ring-1 ring-border/60",children:[e.jsxs("div",{className:"flex items-center justify-between border-border border-b p-4",children:[e.jsx("h3",{className:"font-medium",children:"Customize your stay"}),e.jsx("span",{className:"rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs",children:"3 rooms"})]}),e.jsxs("div",{className:"p-10 text-center text-muted-foreground",children:["No selections made for this room yet.",e.jsx("br",{}),"Add upgrades or customizations to see them here."]})]}),e.jsxs("div",{className:"rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/60",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"font-semibold",children:"Total"}),e.jsx("span",{className:"font-semibold",children:"€0.00"})]}),e.jsxs("div",{className:"mt-2 flex items-center justify-between text-muted-foreground text-sm",children:[e.jsx("span",{className:"inline-flex items-center gap-2",children:e.jsx("span",{className:"rounded-sm border px-1.5 py-0.5",children:"Pay at Hotel"})}),e.jsx("span",{className:"italic",children:"Subject to availability"})]}),e.jsx("button",{className:"mt-4 w-full rounded-md bg-primary px-3 py-2 text-primary-foreground",children:"Confirm Selection"})]})]})]})]})};var d,i,o;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    tabs: buildTabs(tabsSample),
    sticky: true
  },
  render: args => <div style={tabsDemoTheme}>
      <TabsStrip {...args} />
    </div>
}`,...(o=(i=t.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};var l,m,c;r.parameters={...r.parameters,docs:{...(l=r.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <div className="bg-muted" style={tabsDemoTheme}>
      <TabsStrip tabs={buildTabs(tabsSample)} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="font-bold text-2xl">Upgrade Your Room - TRIPLE DELUXE GOLF VIEW</h2>
            <p className="text-muted-foreground">Choose an upgrade for your currently selected room.</p>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(i => <div key={i} className="overflow-hidden rounded-xl bg-white p-0 shadow-[var(--shadow-depth-2)] ring-1 ring-border/60">
                  <div className="relative">
                    <Skeleton className="h-44 w-full" />
                    <div className="absolute top-2 left-2 space-x-2">
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs">Mountain View</span>
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs">Kitchenette</span>
                    </div>
                    <div className="absolute right-2 bottom-2 rounded-full bg-white/90 px-2 py-0.5 text-xs">
                      8 photos
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">JUNIOR SUITE</h3>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">
                      Enjoy a spacious retreat of 84 m² designed for complete relaxation...
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-muted-foreground">
                        <span className="font-bold text-2xl">60</span> € / night
                      </div>
                      <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm">
                        UPGRADE NOW
                      </button>
                    </div>
                    <p className="text-muted-foreground text-xs">Additional cost per night</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-0 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between border-border border-b p-4">
              <h3 className="font-medium">Customize your stay</h3>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary text-xs">3 rooms</span>
            </div>
            <div className="p-10 text-center text-muted-foreground">
              No selections made for this room yet.
              <br />
              Add upgrades or customizations to see them here.
            </div>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-border/60">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">€0.00</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-muted-foreground text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="rounded-sm border px-1.5 py-0.5">Pay at Hotel</span>
              </span>
              <span className="italic">Subject to availability</span>
            </div>
            <button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-primary-foreground">
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
}`,...(c=(m=r.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const U=["TabsOnly","TabsWithPreview"];export{t as TabsOnly,r as TabsWithPreview,U as __namedExportsOrder,E as default};
