import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as z}from"./index-yIsmwZOr.js";import{C as Q}from"./ConfigurationErrorBoundary-FfiUzmvf.js";const X=t=>({...t,formattedPrice:`$${t.price.toFixed(2)}`,isInStock:t.stock>0,hasGoodRating:t.rating>=4}),Y=t=>t.filter(r=>r.stock>0),Z=t=>{if(t.length===0)return{totalProducts:0,totalValue:0,averagePrice:0,averageRating:0};const r=t.length,a=t.reduce((n,o)=>n+o.price*o.stock,0),s=t.reduce((n,o)=>n+o.price,0)/r,i=t.reduce((n,o)=>n+o.rating,0)/r;return{totalProducts:r,totalValue:a,averagePrice:s,averageRating:i}},K=(t,r)=>{const{onlyAvailable:a=!0}=r??{};return z.useMemo(()=>{let s=a?Y(t):t;const n=[...s].sort((c,l)=>c.rating!==l.rating?l.rating-c.rating:c.stock>0&&l.stock===0?-1:c.stock===0&&l.stock>0?1:c.name.localeCompare(l.name)).map(X),o=Z(s);return{products:n,stats:o,hasProducts:s.length>0}},[t,a])},ee=({name:t,price:r,rating:a,isInStock:s,hasGoodRating:i})=>e.jsxs("div",{className:"flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsx("h3",{className:"font-semibold text-lg",children:t}),i&&e.jsx("span",{className:"text-xs bg-green-100 text-green-800 px-2 py-1 rounded",children:"⭐ Top Rated"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-2xl font-bold text-blue-600",children:r}),e.jsx("span",{className:`text-sm ${s?"text-green-600":"text-red-600"}`,children:s?"✓ In Stock":"✗ Out of Stock"})]}),e.jsxs("div",{className:"flex items-center gap-1 text-sm text-yellow-500",children:["⭐".repeat(Math.floor(a)),e.jsxs("span",{className:"text-gray-500",children:[a,"/5"]})]}),e.jsx("button",{className:`w-full py-2 rounded text-white font-medium ${s?"bg-blue-600 hover:bg-blue-700 cursor-pointer":"bg-gray-400 cursor-not-allowed"}`,children:s?"Add to Cart":"Unavailable"})]}),te=({totalProducts:t,totalValue:r,averagePrice:a,averageRating:s})=>e.jsxs("div",{className:"grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-6",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600 text-sm",children:"Total Products"}),e.jsx("p",{className:"text-3xl font-bold text-gray-900",children:t})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600 text-sm",children:"Total Value"}),e.jsxs("p",{className:"text-3xl font-bold text-green-600",children:["$",r.toFixed(2)]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600 text-sm",children:"Avg Price"}),e.jsxs("p",{className:"text-3xl font-bold text-blue-600",children:["$",a.toFixed(2)]})]}),e.jsxs("div",{children:[e.jsx("p",{className:"text-gray-600 text-sm",children:"Avg Rating"}),e.jsxs("p",{className:"text-3xl font-bold text-yellow-600",children:[s.toFixed(1),"/5"]})]})]}),re=({products:t})=>t.length===0?e.jsx("div",{className:"rounded-lg border border-gray-200 bg-gray-50 p-8 text-center",children:e.jsx("p",{className:"text-gray-500 text-lg",children:"No products available"})}):e.jsx("div",{className:"grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",children:t.map(r=>e.jsx(ee,{name:r.name,price:r.formattedPrice,rating:r.rating,isInStock:r.isInStock,hasGoodRating:r.hasGoodRating},r.id))}),y=({products:t,showUnavailable:r=!1})=>{if(!Array.isArray(t))return e.jsx("div",{className:"rounded-lg border border-red-200 bg-red-50 p-4 text-red-900",children:e.jsx("p",{children:"Invalid products data"})});const{products:a,stats:s,hasProducts:i}=K(t,{onlyAvailable:!r});return!i&&!r?e.jsx("div",{className:"rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900",children:e.jsx("p",{children:"No products in stock"})}):e.jsx(Q,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Inventory Stats"}),e.jsx(te,{totalProducts:s.totalProducts,totalValue:s.totalValue,averagePrice:s.averagePrice,averageRating:s.averageRating})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"text-2xl font-bold mb-4",children:"Products"}),e.jsx(re,{products:a})]})]})})},x=[{id:"1",name:"Wireless Headphones",price:79.99,stock:15,rating:4.8,category:"electronics"},{id:"2",name:"USB-C Cable",price:9.99,stock:0,rating:4.2,category:"electronics"},{id:"3",name:"Cotton T-Shirt",price:24.99,stock:50,rating:4.5,category:"clothing"},{id:"4",name:"Jeans",price:59.99,stock:30,rating:4.6,category:"clothing"},{id:"5",name:"JavaScript Book",price:39.99,stock:8,rating:4.9,category:"books"},{id:"6",name:"Python Book",price:44.99,stock:0,rating:4.7,category:"books"}],ne={title:"Patterns/Best Practices Example",component:y,parameters:{layout:"padded",docs:{description:{component:"Complete working example showing all architectural patterns working together. Shows proper separation of concerns between business logic, utilities, and UI components."}}},argTypes:{showUnavailable:{control:"boolean",description:"Show unavailable products in the list"}}},d={args:{products:x,showUnavailable:!1},parameters:{docs:{description:{story:"Shows products that are in stock, sorted by rating and availability."}}}},u={args:{products:x,showUnavailable:!0},parameters:{docs:{description:{story:"Shows all products including out-of-stock items, with visual indicators."}}}},p={args:{products:[]},parameters:{docs:{description:{story:"Shows empty state when no products are available."}}}},g={render:t=>e.jsx(y,{...t,products:x.filter(r=>r.category==="electronics")}),args:{products:[],showUnavailable:!1},parameters:{docs:{description:{story:"Filtered to show only electronics. Parent filters data before passing to container."}}}},m={render:t=>{const[r,a]=z.useState(!1);return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("label",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"checkbox",checked:r,onChange:s=>a(s.target.checked),className:"w-4 h-4"}),e.jsx("span",{className:"text-sm font-medium",children:"Show unavailable products"})]}),e.jsx(y,{...t,showUnavailable:r})]})},args:{products:x},parameters:{docs:{description:{story:"Interactive story showing real-time filtering. Toggle to show/hide unavailable products."}}}},h={render:t=>{const{products:r,stats:a}=K(t.products);return e.jsxs("div",{className:"space-y-8",children:[e.jsxs("div",{className:"rounded-lg bg-blue-50 p-4 border border-blue-200",children:[e.jsx("h3",{className:"font-bold text-blue-900 mb-2",children:"Architecture Pattern"}),e.jsxs("ul",{className:"text-sm text-blue-900 space-y-1",children:[e.jsxs("li",{children:["✓ ",e.jsx("strong",{children:"Business Logic:"})," useProductDisplay hook"]}),e.jsxs("li",{children:["✓ ",e.jsx("strong",{children:"Data Utilities:"})," filterAvailableProducts, formatProductForDisplay"]}),e.jsxs("li",{children:["✓ ",e.jsx("strong",{children:"Pure Components:"})," ProductCard, ProductStats, ProductList"]}),e.jsxs("li",{children:["✓ ",e.jsx("strong",{children:"Parent Validation:"})," ProductListContainer checks input"]}),e.jsxs("li",{children:["✓ ",e.jsx("strong",{children:"Error Handling:"})," ConfigurationErrorBoundary wraps all"]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-lg mb-4",children:"Rendered Result"}),e.jsx(y,{...t})]}),e.jsxs("div",{className:"rounded-lg bg-gray-50 p-4 border border-gray-200",children:[e.jsx("h3",{className:"font-bold text-gray-900 mb-2",children:"Debug Info"}),e.jsx("pre",{className:"text-xs overflow-auto text-gray-700",children:JSON.stringify({inputProducts:t.products.length,displayProducts:r.length,stats:{totalValue:a.totalValue.toFixed(2),averagePrice:a.averagePrice.toFixed(2),averageRating:a.averageRating.toFixed(1)}},null,2)})]})]})},args:{products:x},parameters:{docs:{description:{story:"Shows how each layer of the architecture works together with debug info."}}}};var b,v,f,P,w;d.parameters={...d.parameters,docs:{...(b=d.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    products: mockProducts,
    showUnavailable: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows products that are in stock, sorted by rating and availability.'
      }
    }
  }
}`,...(f=(v=d.parameters)==null?void 0:v.docs)==null?void 0:f.source},description:{story:`Default Story: Shows all available products
Demonstrates:
- Business logic in hooks (useProductDisplay)
- Filtering (availability logic)
- Pure UI components
- Parent handles validation
- Error boundary wraps components`,...(w=(P=d.parameters)==null?void 0:P.docs)==null?void 0:w.description}}};var j,N,k,S,C;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    products: mockProducts,
    showUnavailable: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows all products including out-of-stock items, with visual indicators.'
      }
    }
  }
}`,...(k=(N=u.parameters)==null?void 0:N.docs)==null?void 0:k.source},description:{story:`Story: Shows all products including unavailable
Demonstrates:
- Same component, different behavior
- Parent controls visibility via props
- Reusability through configuration`,...(C=(S=u.parameters)==null?void 0:S.docs)==null?void 0:C.description}}};var U,R,D,A,E;p.parameters={...p.parameters,docs:{...(U=p.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    products: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state when no products are available.'
      }
    }
  }
}`,...(D=(R=p.parameters)==null?void 0:R.docs)==null?void 0:D.source},description:{story:`Story: Empty state
Demonstrates:
- Parent handles empty state
- Graceful degradation
- User-friendly messaging`,...(E=(A=p.parameters)==null?void 0:A.docs)==null?void 0:E.description}}};var F,B,I,L,V;g.parameters={...g.parameters,docs:{...(F=g.parameters)==null?void 0:F.docs,source:{originalSource:`{
  render: args => <ProductListContainer {...args} products={mockProducts.filter(p => p.category === 'electronics')} />,
  args: {
    products: [],
    showUnavailable: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Filtered to show only electronics. Parent filters data before passing to container.'
      }
    }
  }
}`,...(I=(B=g.parameters)==null?void 0:B.docs)==null?void 0:I.source},description:{story:`Story: Single product category
Demonstrates:
- Filtering by criteria (done at parent level)
- Dynamic data selection
- Real-world use case`,...(V=(L=g.parameters)==null?void 0:L.docs)==null?void 0:V.description}}};var T,O,$,W,G;m.parameters={...m.parameters,docs:{...(T=m.parameters)==null?void 0:T.docs,source:{originalSource:`{
  render: args => {
    const [showUnavailable, setShowUnavailable] = useState(false);
    return <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showUnavailable} onChange={e => setShowUnavailable(e.target.checked)} className="w-4 h-4" />
          <span className="text-sm font-medium">Show unavailable products</span>
        </label>

        <ProductListContainer {...args} showUnavailable={showUnavailable} />
      </div>;
  },
  args: {
    products: mockProducts
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive story showing real-time filtering. Toggle to show/hide unavailable products.'
      }
    }
  }
}`,...($=(O=m.parameters)==null?void 0:O.docs)==null?void 0:$.source},description:{story:`Story: Interactive with toggle
Demonstrates:
- Component responsiveness to prop changes
- Real-time filtering
- User interaction handling`,...(G=(W=m.parameters)==null?void 0:W.docs)==null?void 0:G.description}}};var H,J,M,_,q;h.parameters={...h.parameters,docs:{...(H=h.parameters)==null?void 0:H.docs,source:{originalSource:`{
  render: args => {
    const {
      products: displayProducts,
      stats
    } = useProductDisplay(args.products);
    return <div className="space-y-8">
        {/* Explain the pattern */}
        <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2">Architecture Pattern</h3>
          <ul className="text-sm text-blue-900 space-y-1">
            <li>✓ <strong>Business Logic:</strong> useProductDisplay hook</li>
            <li>✓ <strong>Data Utilities:</strong> filterAvailableProducts, formatProductForDisplay</li>
            <li>✓ <strong>Pure Components:</strong> ProductCard, ProductStats, ProductList</li>
            <li>✓ <strong>Parent Validation:</strong> ProductListContainer checks input</li>
            <li>✓ <strong>Error Handling:</strong> ConfigurationErrorBoundary wraps all</li>
          </ul>
        </div>

        {/* Show the result */}
        <div>
          <h3 className="font-bold text-lg mb-4">Rendered Result</h3>
          <ProductListContainer {...args} />
        </div>

        {/* Show debug info */}
        <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-2">Debug Info</h3>
          <pre className="text-xs overflow-auto text-gray-700">
            {JSON.stringify({
            inputProducts: args.products.length,
            displayProducts: displayProducts.length,
            stats: {
              totalValue: stats.totalValue.toFixed(2),
              averagePrice: stats.averagePrice.toFixed(2),
              averageRating: stats.averageRating.toFixed(1)
            }
          }, null, 2)}
          </pre>
        </div>
      </div>;
  },
  args: {
    products: mockProducts
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how each layer of the architecture works together with debug info.'
      }
    }
  }
}`,...(M=(J=h.parameters)==null?void 0:J.docs)==null?void 0:M.source},description:{story:`Story: Pattern breakdown
Demonstrates:
- Architecture separation
- Each layer responsibility
- How patterns work together`,...(q=(_=h.parameters)==null?void 0:_.docs)==null?void 0:q.description}}};const ie=["WithAvailableProducts","WithAllProducts","EmptyProducts","ElectronicsOnly","InteractiveToggle","PatternBreakdown"];export{g as ElectronicsOnly,p as EmptyProducts,m as InteractiveToggle,h as PatternBreakdown,u as WithAllProducts,d as WithAvailableProducts,ie as __namedExportsOrder,ne as default};
