import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{c as x}from"./utils.fNskMoFt.js";import{m as h}from"./proxy.DYGCHi3C.js";import{r as l}from"./index.JXKNaeUN.js";/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),p=(...r)=>r.filter((t,a,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===a).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var g={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=l.forwardRef(({color:r="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:n="",children:s,iconNode:i,...d},c)=>l.createElement("svg",{ref:c,...g,width:t,height:t,stroke:r,strokeWidth:o?Number(a)*24/Number(t):a,className:p("lucide",n),...d},[...i.map(([b,u])=>l.createElement(b,u)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=(r,t)=>{const a=l.forwardRef(({className:o,...n},s)=>l.createElement(v,{ref:s,iconNode:t,className:p(`lucide-${f(r)}`,o),...n}));return a.displayName=`${r}`,a};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],j=m("ArrowUpRight",w);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",key:"tonef"}],["path",{d:"M9 18c-4.51 2-5-2-7-2",key:"9comsn"}]],N=m("Github",k);function E({title:r,description:t,tags:a,image:o,liveUrl:n,githubUrl:s,featured:i=!1,index:d=0}){return e.jsxs(h.article,{initial:{opacity:0,y:40},whileInView:{opacity:1,y:0},transition:{duration:.5,delay:d*.1},viewport:{once:!0},className:x("group relative border-3 border-brutal-black bg-brutal-white","shadow-brutal transition-all duration-200","hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-hover",i&&"md:col-span-2"),children:[o&&e.jsxs("div",{className:"relative aspect-video border-b-3 border-brutal-black overflow-hidden bg-brutal-cream",children:[e.jsx("img",{src:o,alt:r,className:"w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"}),e.jsx("div",{className:"absolute inset-0 bg-brutal-black/0 group-hover:bg-brutal-black/20 transition-colors duration-300"})]}),e.jsxs("div",{className:"p-6",children:[e.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:a.map(c=>e.jsx("span",{className:"px-2 py-1 text-[10px] font-mono uppercase tracking-wider border-2 border-brutal-black bg-brutal-cream",children:c},c))}),e.jsx("h3",{className:"font-display font-bold text-xl mb-2 group-hover:text-brutal-orange transition-colors",children:r}),e.jsx("p",{className:"text-sm text-gray-600 leading-relaxed mb-4",children:t}),e.jsxs("div",{className:"flex items-center gap-3",children:[n&&e.jsxs("a",{href:n,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider hover:text-brutal-orange transition-colors",children:[e.jsx("span",{children:"View Live"}),e.jsx(j,{className:"w-3 h-3"})]}),s&&e.jsxs("a",{href:s,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider hover:text-brutal-violet transition-colors",children:[e.jsx(N,{className:"w-3 h-3"}),e.jsx("span",{children:"Code"})]})]})]}),i&&e.jsx("div",{className:"absolute -top-3 -right-3 px-3 py-1 bg-brutal-orange text-white font-mono text-xs uppercase tracking-wider border-3 border-brutal-black shadow-brutal-sm rotate-brutal-2",children:"Featured"})]})}export{E as default};
