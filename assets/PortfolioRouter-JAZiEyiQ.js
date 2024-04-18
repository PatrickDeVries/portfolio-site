import{r as t,_ as e,j as o,u as s}from"./index-mgKPekmz.js";const a=t.lazy(()=>e(()=>import("./PortfolioPageContent-SZtWHTj2.js"),__vite__mapDeps([0,1,2]))),n=()=>o.jsx(t.Suspense,{fallback:"Loading...",children:o.jsx(a,{})}),r=t.lazy(()=>e(()=>import("./SSEOPageContent-Twk9j8mh.js"),__vite__mapDeps([3,1,2]))),l=()=>o.jsx(t.Suspense,{fallback:"Loading...",children:o.jsx(r,{})}),i=[{path:"/",element:o.jsx(n,{})},{path:"sseo",element:o.jsx(l,{})}],c=()=>s(i);export{c as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/PortfolioPageContent-SZtWHTj2.js","assets/index-mgKPekmz.js","assets/index-mPipIzqI.css","assets/SSEOPageContent-Twk9j8mh.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}