import{A as x,e as A,_ as v,F as H,Y as O,b as c,V as l,d as T,T as k,a as M,f as q}from"./q-acba68ae.js";import{l as N,a as j,t as p,r as Q,b as V,c as F,u as S,d as U,e as W,C as Y,D as z,f as Z,g as B}from"./q-e57ae540.js";const G=async({track:n})=>{const[r,s,e,h,t,o]=x(),u=A(""),{routes:C,menus:g,cacheModules:E,trailingSlash:_}=await v(()=>import("./q-15088fd1.js"),["build/q-15088fd1.js","build/q-acba68ae.js"]),w=n(()=>o.path),a=new URL(w,t.href),m=a.pathname,y=N(C,g,E,m),P=j(a.href,!0),f=await y;if(f){const[R,D,L]=f,d=D,I=d[d.length-1];if(m.endsWith("/")){if(!_){a.pathname=m.slice(0,-1),o.path=p(a);return}}else if(_){a.pathname+="/",o.path=p(a);return}t.href=a.href,t.pathname=m,t.params={...R},t.query=Object.fromEntries(a.searchParams.entries()),r.headings=I.headings,r.menu=L,s.contents=H(d);const b=await P,i=Q(b,t,d,u);V.clear(),e.links=i.links,e.meta=i.meta,e.styles=i.styles,e.title=i.title,e.frontmatter=i.frontmatter,F(window,o)}},J=()=>{const n=S();if(!(n!=null&&n.params))throw new Error("Missing Qwik City Env Data");const r=O("url");if(!r)throw new Error("Missing Qwik URL Env Data");const s=new URL(r),e=c({href:s.href,pathname:s.pathname,query:Object.fromEntries(s.searchParams.entries()),params:n.params}),h=c({path:p(s)}),t=c(U),o=c({headings:void 0,menu:void 0}),u=c({contents:void 0});return l(W,o),l(Y,u),l(z,t),l(Z,e),l(B,h),T(k(()=>v(()=>Promise.resolve().then(()=>K),void 0),"s_2Eo7WCpaqI8",[o,u,t,n,e,h])),M(q,{},"qY_0")},K=Object.freeze(Object.defineProperty({__proto__:null,s_2Eo7WCpaqI8:G,s_TxCFOy819ag:J},Symbol.toStringTag,{value:"Module"}));export{G as s_2Eo7WCpaqI8,J as s_TxCFOy819ag};
