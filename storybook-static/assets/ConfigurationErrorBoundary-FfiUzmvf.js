var a=Object.defineProperty;var i=(n,e,r)=>e in n?a(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r;var s=(n,e,r)=>i(n,typeof e!="symbol"?e+"":e,r);import{j as o}from"./jsx-runtime-BjG_zV1W.js";import{R as c}from"./index-yIsmwZOr.js";class d extends c.Component{constructor(r){super(r);s(this,"handleReset",()=>{this.setState({hasError:!1,error:null,errorInfo:null})});this.state={hasError:!1,error:null,errorInfo:null}}static getDerivedStateFromError(r){return{hasError:!0,error:r}}componentDidCatch(r,t){this.setState({errorInfo:t}),this.props.onError&&this.props.onError(r,t)}render(){return this.state.hasError?this.props.fallback?this.props.fallback:o.jsxs("div",{className:"flex flex-col items-center justify-center gap-4 rounded-lg border border-red-200 bg-red-50 p-6 text-red-900",children:[o.jsxs("div",{className:"text-center",children:[o.jsx("h2",{className:"text-lg font-semibold",children:"Something Went Wrong"}),o.jsx("p",{className:"text-sm text-red-700 mt-1",children:"An unexpected error occurred. Please try refreshing the page."})]}),!1,o.jsx("button",{onClick:this.handleReset,className:"rounded-md bg-red-600 px-4 py-2 text-white text-sm font-medium hover:bg-red-700 transition-colors",children:"Try Again"})]}):this.props.children}}d.__docgenInfo={description:`Error Boundary Component for Configuration and Runtime Errors

Catches errors that occur during rendering in child components
and displays a user-friendly error message instead of crashing.

## What It Catches:
- Errors during render
- Errors in lifecycle methods
- Errors in constructors

## What It DOESN'T Catch:
- Event handler errors (use try-catch in handlers)
- Async errors (use Promise.catch or try-catch with async/await)
- Server-side rendering errors
- Errors in the error boundary itself

## Usage:

### Basic Usage:
\`\`\`tsx
<ConfigurationErrorBoundary>
  <PricingSummaryPanel labels={labels} rooms={rooms} />
</ConfigurationErrorBoundary>
\`\`\`

### With Error Callback:
\`\`\`tsx
<ConfigurationErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service
    Sentry.captureException(error, { contexts: { errorInfo } })
  }}
>
  <YourComponent />
</ConfigurationErrorBoundary>
\`\`\`

### With Custom Fallback:
\`\`\`tsx
<ConfigurationErrorBoundary
  fallback={
    <div className="error-container">
      <h2>Custom Error Occurred</h2>
      <p>Please try refreshing the page</p>
    </div>
  }
>
  <YourComponent />
</ConfigurationErrorBoundary>
\`\`\``,methods:[{name:"handleReset",docblock:"Reset error state",modifiers:[],params:[],returns:null,description:"Reset error state"}],displayName:"ConfigurationErrorBoundary",props:{children:{required:!0,tsType:{name:"ReactNode"},description:"React components to wrap"},fallback:{required:!1,tsType:{name:"ReactNode"},description:"Custom fallback UI to display on error"},onError:{required:!1,tsType:{name:"signature",type:"function",raw:"(error: Error, errorInfo: ErrorInfo) => void",signature:{arguments:[{type:{name:"Error"},name:"error"},{type:{name:"ErrorInfo"},name:"errorInfo"}],return:{name:"void"}}},description:"Callback when error is caught (for logging services)"}}};export{d as C};
