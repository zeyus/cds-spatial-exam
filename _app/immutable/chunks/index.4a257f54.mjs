function y(){}function z(t,n){for(const e in n)t[e]=n[e];return t}function D(t){return t()}function C(){return Object.create(null)}function x(t){t.forEach(D)}function A(t){return typeof t=="function"}function lt(t,n){return t!=t?n==n:t!==n||t&&typeof t=="object"||typeof t=="function"}function F(t){return Object.keys(t).length===0}function G(t,...n){if(t==null)return y;const e=t.subscribe(...n);return e.unsubscribe?()=>e.unsubscribe():e}function ot(t,n,e){t.$$.on_destroy.push(G(n,e))}function st(t,n,e,i){if(t){const r=B(t,n,e,i);return t[0](r)}}function B(t,n,e,i){return t[1]&&i?z(e.ctx.slice(),t[1](i(n))):e.ctx}function ut(t,n,e,i){if(t[2]&&i){const r=t[2](i(e));if(n.dirty===void 0)return r;if(typeof r=="object"){const u=[],c=Math.max(n.dirty.length,r.length);for(let s=0;s<c;s+=1)u[s]=n.dirty[s]|r[s];return u}return n.dirty|r}return n.dirty}function ft(t,n,e,i,r,u){if(r){const c=B(n,e,i,u);t.p(c,r)}}function at(t){if(t.ctx.length>32){const n=[],e=t.ctx.length/32;for(let i=0;i<e;i++)n[i]=-1;return n}return-1}function dt(t){return t&&A(t.destroy)?t.destroy:y}const _t=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;let w=!1;function I(){w=!0}function J(){w=!1}function K(t,n,e,i){for(;t<n;){const r=t+(n-t>>1);e(r)<=i?t=r+1:n=r}return t}function R(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let o=0;o<n.length;o++){const a=n[o];a.claim_order!==void 0&&l.push(a)}n=l}const e=new Int32Array(n.length+1),i=new Int32Array(n.length);e[0]=-1;let r=0;for(let l=0;l<n.length;l++){const o=n[l].claim_order,a=(r>0&&n[e[r]].claim_order<=o?r+1:K(1,r,b=>n[e[b]].claim_order,o))-1;i[l]=e[a]+1;const f=a+1;e[f]=l,r=Math.max(f,r)}const u=[],c=[];let s=n.length-1;for(let l=e[r]+1;l!=0;l=i[l-1]){for(u.push(n[l-1]);s>=l;s--)c.push(n[s]);s--}for(;s>=0;s--)c.push(n[s]);u.reverse(),c.sort((l,o)=>l.claim_order-o.claim_order);for(let l=0,o=0;l<c.length;l++){for(;o<u.length&&c[l].claim_order>=u[o].claim_order;)o++;const a=o<u.length?u[o]:null;t.insertBefore(c[l],a)}}function W(t,n){if(w){for(R(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?(n.claim_order!==void 0||n.parentNode!==t)&&t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else(n.parentNode!==t||n.nextSibling!==null)&&t.appendChild(n)}function ht(t,n,e){w&&!e?W(t,n):(n.parentNode!==t||n.nextSibling!=e)&&t.insertBefore(n,e||null)}function Q(t){t.parentNode&&t.parentNode.removeChild(t)}function U(t){return document.createElement(t)}function S(t){return document.createTextNode(t)}function mt(){return S(" ")}function pt(){return S("")}function yt(t,n,e,i){return t.addEventListener(n,e,i),()=>t.removeEventListener(n,e,i)}function gt(t,n,e){e==null?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function V(t){return Array.from(t.childNodes)}function X(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function H(t,n,e,i,r=!1){X(t);const u=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const s=t[c];if(n(s)){const l=e(s);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),s}}for(let c=t.claim_info.last_index-1;c>=0;c--){const s=t[c];if(n(s)){const l=e(s);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,s}}return i()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function Y(t,n,e,i){return H(t,r=>r.nodeName===n,r=>{const u=[];for(let c=0;c<r.attributes.length;c++){const s=r.attributes[c];e[s.name]||u.push(s.name)}u.forEach(c=>r.removeAttribute(c))},()=>i(n))}function xt(t,n,e){return Y(t,n,e,U)}function Z(t,n){return H(t,e=>e.nodeType===3,e=>{const i=""+n;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>S(n),!0)}function bt(t){return Z(t," ")}function $t(t,n){n=""+n,t.data!==n&&(t.data=n)}function wt(t,n,e,i){e==null?t.style.removeProperty(n):t.style.setProperty(n,e,i?"important":"")}function Et(t,n){const e=[];let i=0;for(const r of n.childNodes)if(r.nodeType===8){const u=r.textContent.trim();u===`HEAD_${t}_END`?(i-=1,e.push(r)):u===`HEAD_${t}_START`&&(i+=1,e.push(r))}else i>0&&e.push(r);return e}function Nt(t,n){return new t(n)}let g;function p(t){g=t}function L(){if(!g)throw new Error("Function called outside component initialization");return g}function vt(t){L().$$.on_mount.push(t)}function At(t){L().$$.after_update.push(t)}const h=[],M=[];let m=[];const k=[],O=Promise.resolve();let N=!1;function P(){N||(N=!0,O.then(q))}function St(){return P(),O}function v(t){m.push(t)}const E=new Set;let _=0;function q(){if(_!==0)return;const t=g;do{try{for(;_<h.length;){const n=h[_];_++,p(n),tt(n.$$)}}catch(n){throw h.length=0,_=0,n}for(p(null),h.length=0,_=0;M.length;)M.pop()();for(let n=0;n<m.length;n+=1){const e=m[n];E.has(e)||(E.add(e),e())}m.length=0}while(h.length);for(;k.length;)k.pop()();N=!1,E.clear(),p(t)}function tt(t){if(t.fragment!==null){t.update(),x(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(v)}}function nt(t){const n=[],e=[];m.forEach(i=>t.indexOf(i)===-1?n.push(i):e.push(i)),e.forEach(i=>i()),m=n}const $=new Set;let d;function jt(){d={r:0,c:[],p:d}}function Tt(){d.r||x(d.c),d=d.p}function et(t,n){t&&t.i&&($.delete(t),t.i(n))}function Ct(t,n,e,i){if(t&&t.o){if($.has(t))return;$.add(t),d.c.push(()=>{$.delete(t),i&&(e&&t.d(1),i())}),t.o(n)}else i&&i()}function Mt(t){t&&t.c()}function kt(t,n){t&&t.l(n)}function it(t,n,e,i){const{fragment:r,after_update:u}=t.$$;r&&r.m(n,e),i||v(()=>{const c=t.$$.on_mount.map(D).filter(A);t.$$.on_destroy?t.$$.on_destroy.push(...c):x(c),t.$$.on_mount=[]}),u.forEach(v)}function rt(t,n){const e=t.$$;e.fragment!==null&&(nt(e.after_update),x(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function ct(t,n){t.$$.dirty[0]===-1&&(h.push(t),P(),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function Dt(t,n,e,i,r,u,c,s=[-1]){const l=g;p(t);const o=t.$$={fragment:null,ctx:[],props:u,update:y,not_equal:r,bound:C(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(l?l.$$.context:[])),callbacks:C(),dirty:s,skip_bound:!1,root:n.target||l.$$.root};c&&c(o.root);let a=!1;if(o.ctx=e?e(t,n.props||{},(f,b,...j)=>{const T=j.length?j[0]:b;return o.ctx&&r(o.ctx[f],o.ctx[f]=T)&&(!o.skip_bound&&o.bound[f]&&o.bound[f](T),a&&ct(t,f)),b}):[],o.update(),a=!0,x(o.before_update),o.fragment=i?i(o.ctx):!1,n.target){if(n.hydrate){I();const f=V(n.target);o.fragment&&o.fragment.l(f),f.forEach(Q)}else o.fragment&&o.fragment.c();n.intro&&et(t.$$.fragment),it(t,n.target,n.anchor,n.customElement),J(),q()}p(l)}class Bt{$destroy(){rt(this,1),this.$destroy=y}$on(n,e){if(!A(e))return y;const i=this.$$.callbacks[n]||(this.$$.callbacks[n]=[]);return i.push(e),()=>{const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}$set(n){this.$$set&&!F(n)&&(this.$$.skip_bound=!0,this.$$set(n),this.$$.skip_bound=!1)}}export{it as A,rt as B,st as C,ft as D,at as E,ut as F,W as G,y as H,ot as I,Et as J,_t as K,yt as L,dt as M,x as N,Bt as S,mt as a,ht as b,bt as c,Ct as d,pt as e,Tt as f,et as g,Q as h,Dt as i,At as j,U as k,xt as l,V as m,gt as n,vt as o,wt as p,S as q,Z as r,lt as s,St as t,$t as u,jt as v,M as w,Nt as x,Mt as y,kt as z};
