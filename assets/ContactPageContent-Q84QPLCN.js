import{G as o,a as n,e as a,j as e,M as c,b as s,c as m}from"./index-idC9n4Zg.js";function d(t){return o({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"}}]})(t)}function l(t){return o({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"}}]})(t)}const p=n.div.withConfig({displayName:"Wrapper",componentId:"sc-j4r1b6-0"})(["padding:3rem;margin-top:auto;margin-bottom:auto;display:flex;flex-direction:column;align-items:center;"]),x=n.div.withConfig({displayName:"ContactText",componentId:"sc-j4r1b6-1"})(["font-size:2rem;"]),h=n.div.withConfig({displayName:"SocialLinks",componentId:"sc-j4r1b6-2"})(["margin-left:auto;margin-right:auto;margin-bottom:3rem;display:flex;gap:2rem;flex-wrap:wrap;align-items:center;justify-content:center;"]),g=n.div.withConfig({displayName:"SocialLink",componentId:"sc-j4r1b6-3"})(["display:flex;flex-direction:column;align-items:center;margin-top:1rem;margin-bottom:1rem;text-decoration:none;color:",";&:hover{text-decoration:underline;}"],({theme:t})=>t.text),C=()=>{const t=a(),r=[{site:"LinkedIn",href:"https://www.linkedin.com/in/pcdevri/",icon:e.jsx(l,{size:"10rem",color:t.secondary}),text:"https://www.linkedin.com/in/pcdevri/"},{site:"GitHub",href:"https://github.com/PatrickDeVries",icon:e.jsx(d,{size:"10rem",color:t.secondary}),text:"https://github.com/PatrickDeVries"},{site:"Email",href:"mailto:pcdevri@gmail.com",icon:e.jsx(c,{size:"10rem",color:t.secondary}),text:"pcdevri@gmail.com"},{site:"Text",href:"sms:8178881514",icon:e.jsx(s,{size:"10rem",color:t.secondary}),text:"(817) 888-1514"},{site:"Phone",href:"tel:8178881514",icon:e.jsx(m,{size:"10rem",color:t.secondary}),text:"(817) 888-1514"}];return e.jsxs(p,{children:[e.jsx(x,{children:"Contact me:"}),e.jsx(h,{children:r.map(i=>e.jsxs(g,{as:"a",href:i.href,children:[i.icon,e.jsx("div",{children:i.text})]},i.site))})]})};export{C as default};