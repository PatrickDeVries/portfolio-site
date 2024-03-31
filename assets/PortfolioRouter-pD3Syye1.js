import{r as t,_ as e,j as o,u as s}from"./index-nzqLFnVi.js";const a=t.lazy(()=>e(()=>import("./PortfolioPageContent-deRnx9pZ.js"),__vite__mapDeps([0,1,2]))),n=()=>o.jsx(t.Suspense,{fallback:"Loading...",children:o.jsx(a,{})}),r=t.lazy(()=>e(()=>import("./SSEOPageContent-oa5V9Ybd.js"),__vite__mapDeps([3,1,2,4]))),l=()=>o.jsx(t.Suspense,{fallback:"Loading...",children:o.jsx(r,{})}),i=[{path:"/",element:o.jsx(n,{})},{path:"sseo",element:o.jsx(l,{})}],c=()=>s(i);export{c as default};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/PortfolioPageContent-deRnx9pZ.js","assets/index-nzqLFnVi.js","assets/index-mPipIzqI.css","assets/SSEOPageContent-oa5V9Ybd.js","assets/style-1fi3E4mZ.js"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}