"use strict";(self.webpackChunkfe_web_boss_bundle=self.webpackChunkfe_web_boss_bundle||[]).push([[117],{2117:function(t,e,o){o.r(e),o.d(e,{BzlAvatar:function(){return Ui},BzlBadge:function(){return Zi},BzlButton:function(){return Bi},BzlCascader:function(){return Ri},BzlCascaderPanel:function(){return Ti},BzlCheckbox:function(){return Di},BzlCheckboxGroup:function(){return Li},BzlCopyButton:function(){return ri},BzlDialog:function(){return wi},BzlDivider:function(){return $i},BzlForm:function(){return go},BzlFormItem:function(){return ei},BzlIcon:function(){return so},BzlInput:function(){return eo},BzlLayout:function(){return ro},BzlLink:function(){return lo},BzlLogo:function(){return Ue},BzlOption:function(){return Ze},BzlPagination:function(){return Je},BzlPopover:function(){return qe},BzlPopup:function(){return je},BzlRadio:function(){return Se},BzlRadioGroup:function(){return Te},BzlSelect:function(){return Re},BzlSpin:function(){return we},BzlStep:function(){return ke},BzlSteps:function(){return ge},BzlSwitch:function(){return ye},BzlTag:function(){return _e},BzlTextarea:function(){return le},BzlToast:function(){return se.Y},BzlTooltip:function(){return jt},Toast:function(){return ce.y8},ToastManager:function(){return ce.tx},getBasePath:function(){return ji},getFormControls:function(){return Jt},registerIconLibrary:function(){return Ni.Sm},serialize:function(){return Gt},setBasePath:function(){return qi},unregisterIconLibrary:function(){return Ni.ds},v2BzlModelDirective:function(){return Qt}});var i=o(9016),r=i.i`
  :host {
    --max-width: 284px;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--bzl-tooltip-arrow-size);
    --arrow-color: color-mix(in srgb, var(--bzl-color-neutral-1000) 80%, transparent);
  }

  .tooltip::part(popup) {
    z-index: var(--bzl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--bzl-tooltip-border-radius);
    background-color: var(--bzl-tooltip-background-color);
    font-family: var(--bzl-tooltip-font-family);
    font-size: var(--bzl-tooltip-font-size);
    font-weight: var(--bzl-tooltip-font-weight);
    line-height: var(--bzl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--bzl-tooltip-color);
    padding: var(--bzl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`,a=i.i`
  :host {
    --arrow-color: var(--bzl-color-neutral-1000);
    --arrow-size: 8px; /* 使用 SVG 的高度作为箭头尺寸 */
    --arrow-height: var(--arrow-size);
    --arrow-width: calc(var(--arrow-size) * 2.5);
    --arrow-size-diagonal: 8px;
    --arrow-size-diagonal-horizontal: calc(var(--arrow-size-diagonal) * 1.75);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: var(--arrow-width);
    height: var(--arrow-height);
    color: var(--arrow-color);
  }

  /* 根据位置调整箭头方向 */
  .popup[data-current-placement*='bottom'] .popup__arrow {
    transform: rotate(180deg);
  }

  .popup[data-current-placement*='left'] .popup__arrow {
    transform: rotate(-90deg);
  }

  .popup[data-current-placement*='right'] .popup__arrow {
    transform: rotate(90deg);
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--bzl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`,n=o(1510),l=o(2106),s=o(5138),c=o(6909),d=Math.min,h=Math.max,p=Math.round,u=Math.floor,b=t=>({x:t,y:t}),g={left:"right",right:"left",bottom:"top",top:"bottom"},f={start:"end",end:"start"};function m(t,e,o){return h(t,d(e,o))}function v(t,e){return"function"==typeof t?t(e):t}function y(t){return t.split("-")[0]}function z(t){return t.split("-")[1]}function x(t){return"x"===t?"y":"x"}function _(t){return"y"===t?"height":"width"}var w=new Set(["top","bottom"]);function k(t){return w.has(y(t))?"y":"x"}function C(t){return x(k(t))}function $(t){return t.replace(/start|end/g,t=>f[t])}var S=["left","right"],E=["right","left"],A=["top","bottom"],P=["bottom","top"];function T(t){return t.replace(/left|right|bottom|top/g,t=>g[t])}function D(t){return"number"!=typeof t?function(t){return(0,c.IA)({top:0,right:0,bottom:0,left:0},t)}(t):{top:t,right:t,bottom:t,left:t}}function F(t){const{x:e,y:o,width:i,height:r}=t;return{width:i,height:r,top:o,left:e,right:e+i,bottom:o+r,x:e,y:o}}function O(t,e,o){let{reference:i,floating:r}=t;const a=k(e),n=C(e),l=_(n),s=y(e),c="y"===a,d=i.x+i.width/2-r.width/2,h=i.y+i.height/2-r.height/2,p=i[l]/2-r[l]/2;let u;switch(s){case"top":u={x:d,y:i.y-r.height};break;case"bottom":u={x:d,y:i.y+i.height};break;case"right":u={x:i.x+i.width,y:h};break;case"left":u={x:i.x-r.width,y:h};break;default:u={x:i.x,y:i.y}}switch(z(e)){case"start":u[n]-=p*(o&&c?-1:1);break;case"end":u[n]+=p*(o&&c?-1:1)}return u}async function L(t,e){var o;void 0===e&&(e={});const{x:i,y:r,platform:a,rects:n,elements:l,strategy:s}=t,{boundary:c="clippingAncestors",rootBoundary:d="viewport",elementContext:h="floating",altBoundary:p=!1,padding:u=0}=v(e,t),b=D(u),g=l[p?"floating"===h?"reference":"floating":h],f=F(await a.getClippingRect({element:null==(o=await(null==a.isElement?void 0:a.isElement(g)))||o?g:g.contextElement||await(null==a.getDocumentElement?void 0:a.getDocumentElement(l.floating)),boundary:c,rootBoundary:d,strategy:s})),m="floating"===h?{x:i,y:r,width:n.floating.width,height:n.floating.height}:n.reference,y=await(null==a.getOffsetParent?void 0:a.getOffsetParent(l.floating)),z=await(null==a.isElement?void 0:a.isElement(y))&&await(null==a.getScale?void 0:a.getScale(y))||{x:1,y:1},x=F(a.convertOffsetParentRelativeRectToViewportRelativeRect?await a.convertOffsetParentRelativeRectToViewportRelativeRect({elements:l,rect:m,offsetParent:y,strategy:s}):m);return{top:(f.top-x.top+b.top)/z.y,bottom:(x.bottom-f.bottom+b.bottom)/z.y,left:(f.left-x.left+b.left)/z.x,right:(x.right-f.right+b.right)/z.x}}var B=new Set(["left","top"]);function I(){return"undefined"!=typeof window}function V(t){return M(t)?(t.nodeName||"").toLowerCase():"#document"}function R(t){var e;return(null==t||null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function N(t){var e;return null==(e=(M(t)?t.ownerDocument:t.document)||window.document)?void 0:e.documentElement}function M(t){return!!I()&&(t instanceof Node||t instanceof R(t).Node)}function q(t){return!!I()&&(t instanceof Element||t instanceof R(t).Element)}function j(t){return!!I()&&(t instanceof HTMLElement||t instanceof R(t).HTMLElement)}function W(t){return!(!I()||"undefined"==typeof ShadowRoot)&&(t instanceof ShadowRoot||t instanceof R(t).ShadowRoot)}var H=new Set(["inline","contents"]);function U(t){const{overflow:e,overflowX:o,overflowY:i,display:r}=rt(t);return/auto|scroll|overlay|hidden|clip/.test(e+i+o)&&!H.has(r)}var K=new Set(["table","td","th"]);function X(t){return K.has(V(t))}var Z=[":popover-open",":modal"];function Y(t){return Z.some(e=>{try{return t.matches(e)}catch(t){return!1}})}var G=["transform","translate","scale","rotate","perspective"],J=["transform","translate","scale","rotate","perspective","filter"],Q=["paint","layout","strict","content"];function tt(t){const e=et(),o=q(t)?rt(t):t;return G.some(t=>!!o[t]&&"none"!==o[t])||!!o.containerType&&"normal"!==o.containerType||!e&&!!o.backdropFilter&&"none"!==o.backdropFilter||!e&&!!o.filter&&"none"!==o.filter||J.some(t=>(o.willChange||"").includes(t))||Q.some(t=>(o.contain||"").includes(t))}function et(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}var ot=new Set(["html","body","#document"]);function it(t){return ot.has(V(t))}function rt(t){return R(t).getComputedStyle(t)}function at(t){return q(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function nt(t){if("html"===V(t))return t;const e=t.assignedSlot||t.parentNode||W(t)&&t.host||N(t);return W(e)?e.host:e}function lt(t){const e=nt(t);return it(e)?t.ownerDocument?t.ownerDocument.body:t.body:j(e)&&U(e)?e:lt(e)}function st(t,e,o){var i;void 0===e&&(e=[]),void 0===o&&(o=!0);const r=lt(t),a=r===(null==(i=t.ownerDocument)?void 0:i.body),n=R(r);if(a){const t=ct(n);return e.concat(n,n.visualViewport||[],U(r)?r:[],t&&o?st(t):[])}return e.concat(r,st(r,[],o))}function ct(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}function dt(t){const e=rt(t);let o=parseFloat(e.width)||0,i=parseFloat(e.height)||0;const r=j(t),a=r?t.offsetWidth:o,n=r?t.offsetHeight:i,l=p(o)!==a||p(i)!==n;return l&&(o=a,i=n),{width:o,height:i,$:l}}function ht(t){return q(t)?t:t.contextElement}function pt(t){const e=ht(t);if(!j(e))return b(1);const o=e.getBoundingClientRect(),{width:i,height:r,$:a}=dt(e);let n=(a?p(o.width):o.width)/i,l=(a?p(o.height):o.height)/r;return n&&Number.isFinite(n)||(n=1),l&&Number.isFinite(l)||(l=1),{x:n,y:l}}var ut=b(0);function bt(t){const e=R(t);return et()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:ut}function gt(t,e,o,i){void 0===e&&(e=!1),void 0===o&&(o=!1);const r=t.getBoundingClientRect(),a=ht(t);let n=b(1);e&&(i?q(i)&&(n=pt(i)):n=pt(t));const l=function(t,e,o){return void 0===e&&(e=!1),!(!o||e&&o!==R(t))&&e}(a,o,i)?bt(a):b(0);let s=(r.left+l.x)/n.x,c=(r.top+l.y)/n.y,d=r.width/n.x,h=r.height/n.y;if(a){const t=R(a),e=i&&q(i)?R(i):i;let o=t,r=ct(o);for(;r&&i&&e!==o;){const t=pt(r),e=r.getBoundingClientRect(),i=rt(r),a=e.left+(r.clientLeft+parseFloat(i.paddingLeft))*t.x,n=e.top+(r.clientTop+parseFloat(i.paddingTop))*t.y;s*=t.x,c*=t.y,d*=t.x,h*=t.y,s+=a,c+=n,o=R(r),r=ct(o)}}return F({width:d,height:h,x:s,y:c})}function ft(t,e){const o=at(t).scrollLeft;return e?e.left+o:gt(N(t)).left+o}function mt(t,e,o){void 0===o&&(o=!1);const i=t.getBoundingClientRect();return{x:i.left+e.scrollLeft-(o?0:ft(t,i)),y:i.top+e.scrollTop}}var vt=new Set(["absolute","fixed"]);function yt(t,e,o){let i;if("viewport"===e)i=function(t,e){const o=R(t),i=N(t),r=o.visualViewport;let a=i.clientWidth,n=i.clientHeight,l=0,s=0;if(r){a=r.width,n=r.height;const t=et();(!t||t&&"fixed"===e)&&(l=r.offsetLeft,s=r.offsetTop)}return{width:a,height:n,x:l,y:s}}(t,o);else if("document"===e)i=function(t){const e=N(t),o=at(t),i=t.ownerDocument.body,r=h(e.scrollWidth,e.clientWidth,i.scrollWidth,i.clientWidth),a=h(e.scrollHeight,e.clientHeight,i.scrollHeight,i.clientHeight);let n=-o.scrollLeft+ft(t);const l=-o.scrollTop;return"rtl"===rt(i).direction&&(n+=h(e.clientWidth,i.clientWidth)-r),{width:r,height:a,x:n,y:l}}(N(t));else if(q(e))i=function(t,e){const o=gt(t,!0,"fixed"===e),i=o.top+t.clientTop,r=o.left+t.clientLeft,a=j(t)?pt(t):b(1);return{width:t.clientWidth*a.x,height:t.clientHeight*a.y,x:r*a.x,y:i*a.y}}(e,o);else{const o=bt(t);i={x:e.x-o.x,y:e.y-o.y,width:e.width,height:e.height}}return F(i)}function zt(t,e){const o=nt(t);return!(o===e||!q(o)||it(o))&&("fixed"===rt(o).position||zt(o,e))}function xt(t,e,o){const i=j(e),r=N(e),a="fixed"===o,n=gt(t,!0,a,e);let l={scrollLeft:0,scrollTop:0};const s=b(0);function c(){s.x=ft(r)}if(i||!i&&!a)if(("body"!==V(e)||U(r))&&(l=at(e)),i){const t=gt(e,!0,a,e);s.x=t.x+e.clientLeft,s.y=t.y+e.clientTop}else r&&c();a&&!i&&r&&c();const d=!r||i||a?b(0):mt(r,l);return{x:n.left+l.scrollLeft-s.x-d.x,y:n.top+l.scrollTop-s.y-d.y,width:n.width,height:n.height}}function _t(t){return"static"===rt(t).position}function wt(t,e){if(!j(t)||"fixed"===rt(t).position)return null;if(e)return e(t);let o=t.offsetParent;return N(t)===o&&(o=o.ownerDocument.body),o}function kt(t,e){const o=R(t);if(Y(t))return o;if(!j(t)){let e=nt(t);for(;e&&!it(e);){if(q(e)&&!_t(e))return e;e=nt(e)}return o}let i=wt(t,e);for(;i&&X(i)&&_t(i);)i=wt(i,e);return i&&it(i)&&_t(i)&&!tt(i)?o:i||function(t){let e=nt(t);for(;j(e)&&!it(e);){if(tt(e))return e;if(Y(e))return null;e=nt(e)}return null}(t)||o}var Ct={convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{elements:e,rect:o,offsetParent:i,strategy:r}=t;const a="fixed"===r,n=N(i),l=!!e&&Y(e.floating);if(i===n||l&&a)return o;let s={scrollLeft:0,scrollTop:0},c=b(1);const d=b(0),h=j(i);if((h||!h&&!a)&&(("body"!==V(i)||U(n))&&(s=at(i)),j(i))){const t=gt(i);c=pt(i),d.x=t.x+i.clientLeft,d.y=t.y+i.clientTop}const p=!n||h||a?b(0):mt(n,s,!0);return{width:o.width*c.x,height:o.height*c.y,x:o.x*c.x-s.scrollLeft*c.x+d.x+p.x,y:o.y*c.y-s.scrollTop*c.y+d.y+p.y}},getDocumentElement:N,getClippingRect:function(t){let{element:e,boundary:o,rootBoundary:i,strategy:r}=t;const a=[..."clippingAncestors"===o?Y(e)?[]:function(t,e){const o=e.get(t);if(o)return o;let i=st(t,[],!1).filter(t=>q(t)&&"body"!==V(t)),r=null;const a="fixed"===rt(t).position;let n=a?nt(t):t;for(;q(n)&&!it(n);){const e=rt(n),o=tt(n);o||"fixed"!==e.position||(r=null),(a?!o&&!r:!o&&"static"===e.position&&r&&vt.has(r.position)||U(n)&&!o&&zt(t,n))?i=i.filter(t=>t!==n):r=e,n=nt(n)}return e.set(t,i),i}(e,this._c):[].concat(o),i],n=a[0],l=a.reduce((t,o)=>{const i=yt(e,o,r);return t.top=h(i.top,t.top),t.right=d(i.right,t.right),t.bottom=d(i.bottom,t.bottom),t.left=h(i.left,t.left),t},yt(e,n,r));return{width:l.right-l.left,height:l.bottom-l.top,x:l.left,y:l.top}},getOffsetParent:kt,getElementRects:async function(t){const e=this.getOffsetParent||kt,o=this.getDimensions,i=await o(t.floating);return{reference:xt(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(t){return Array.from(t.getClientRects())},getDimensions:function(t){const{width:e,height:o}=dt(t);return{width:e,height:o}},getScale:pt,isElement:q,isRTL:function(t){return"rtl"===rt(t).direction}};function $t(t,e){return t.x===e.x&&t.y===e.y&&t.width===e.width&&t.height===e.height}var St=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var o,i;const{placement:r,middlewareData:a,rects:n,initialPlacement:l,platform:s,elements:d}=e,h=v(t,e),{mainAxis:p=!0,crossAxis:u=!0,fallbackPlacements:b,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:f="none",flipAlignment:m=!0}=h,x=(0,c.YG)(h,["mainAxis","crossAxis","fallbackPlacements","fallbackStrategy","fallbackAxisSideDirection","flipAlignment"]);if(null!=(o=a.arrow)&&o.alignmentOffset)return{};const w=y(r),D=k(l),F=y(l)===l,O=await(null==s.isRTL?void 0:s.isRTL(d.floating)),B=b||(F||!m?[T(l)]:function(t){const e=T(t);return[$(t),e,$(e)]}(l)),I="none"!==f;!b&&I&&B.push(...function(t,e,o,i){const r=z(t);let a=function(t,e,o){switch(t){case"top":case"bottom":return o?e?E:S:e?S:E;case"left":case"right":return e?A:P;default:return[]}}(y(t),"start"===o,i);return r&&(a=a.map(t=>t+"-"+r),e&&(a=a.concat(a.map($)))),a}(l,m,f,O));const V=[l,...B],R=await L(e,x),N=[];let M=(null==(i=a.flip)?void 0:i.overflows)||[];if(p&&N.push(R[w]),u){const t=function(t,e,o){void 0===o&&(o=!1);const i=z(t),r=C(t),a=_(r);let n="x"===r?i===(o?"end":"start")?"right":"left":"start"===i?"bottom":"top";return e.reference[a]>e.floating[a]&&(n=T(n)),[n,T(n)]}(r,n,O);N.push(R[t[0]],R[t[1]])}if(M=[...M,{placement:r,overflows:N}],!N.every(t=>t<=0)){var q,j;const t=((null==(q=a.flip)?void 0:q.index)||0)+1,e=V[t];if(e&&("alignment"!==u||D===k(e)||M.every(t=>t.overflows[0]>0&&k(t.placement)===D)))return{data:{index:t,overflows:M},reset:{placement:e}};let o=null==(j=M.filter(t=>t.overflows[0]<=0).sort((t,e)=>t.overflows[1]-e.overflows[1])[0])?void 0:j.placement;if(!o)switch(g){case"bestFit":{var W;const t=null==(W=M.filter(t=>{if(I){const e=k(t.placement);return e===D||"y"===e}return!0}).map(t=>[t.placement,t.overflows.filter(t=>t>0).reduce((t,e)=>t+e,0)]).sort((t,e)=>t[1]-e[1])[0])?void 0:W[0];t&&(o=t);break}case"initialPlacement":o=l}if(r!==o)return{reset:{placement:o}}}return{}}}},Et=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){var o,i;const{placement:r,rects:a,platform:n,elements:l}=e,s=v(t,e),{apply:p=()=>{}}=s,u=(0,c.YG)(s,["apply"]),b=await L(e,u),g=y(r),f=z(r),m="y"===k(r),{width:x,height:_}=a.floating;let w,C;"top"===g||"bottom"===g?(w=g,C=f===(await(null==n.isRTL?void 0:n.isRTL(l.floating))?"start":"end")?"left":"right"):(C=g,w="end"===f?"top":"bottom");const $=_-b.top-b.bottom,S=x-b.left-b.right,E=d(_-b[w],$),A=d(x-b[C],S),P=!e.middlewareData.shift;let T=E,D=A;if(null!=(o=e.middlewareData.shift)&&o.enabled.x&&(D=S),null!=(i=e.middlewareData.shift)&&i.enabled.y&&(T=$),P&&!f){const t=h(b.left,0),e=h(b.right,0),o=h(b.top,0),i=h(b.bottom,0);m?D=x-2*(0!==t||0!==e?t+e:h(b.left,b.right)):T=_-2*(0!==o||0!==i?o+i:h(b.top,b.bottom))}await p((0,c.ko)((0,c.IA)({},e),{availableWidth:D,availableHeight:T}));const F=await n.getDimensions(l.floating);return x!==F.width||_!==F.height?{reset:{rects:!0}}:{}}}};function At(t){return function(t){for(let e=t;e;e=Pt(e))if(e instanceof Element&&"none"===getComputedStyle(e).display)return null;for(let e=Pt(t);e;e=Pt(e)){if(!(e instanceof Element))continue;const t=getComputedStyle(e);if("contents"!==t.display){if("static"!==t.position||tt(t))return e;if("BODY"===e.tagName)return e}}return null}(t)}function Pt(t){return t.assignedSlot?t.assignedSlot:t.parentNode instanceof ShadowRoot?t.parentNode.host:t.parentNode}var Tt=class extends s.X{constructor(){super(...arguments),this.currentPlacement="",this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=12,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){const t=this.anchorEl.getBoundingClientRect(),e=this.popup.getBoundingClientRect(),o=this.currentPlacement||this.placement;let i=0,r=0,a=0,n=0,l=0,s=0,c=0,d=0;o.includes("top")||o.includes("bottom")?t.top<e.top?(i=t.left,r=t.bottom,a=t.right,n=t.bottom,l=e.left,s=e.top,c=e.right,d=e.top):(i=e.left,r=e.bottom,a=e.right,n=e.bottom,l=t.left,s=t.top,c=t.right,d=t.top):t.left<e.left?(i=t.right,r=t.top,a=e.left,n=e.top,l=t.right,s=t.bottom,c=e.left,d=e.bottom):(i=e.right,r=e.top,a=t.left,n=t.top,l=e.right,s=e.bottom,c=t.left,d=t.bottom),this.style.setProperty("--hover-bridge-top-left-x",`${i}px`),this.style.setProperty("--hover-bridge-top-left-y",`${r}px`),this.style.setProperty("--hover-bridge-top-right-x",`${a}px`),this.style.setProperty("--hover-bridge-top-right-y",`${n}px`),this.style.setProperty("--hover-bridge-bottom-left-x",`${l}px`),this.style.setProperty("--hover-bridge-bottom-left-y",`${s}px`),this.style.setProperty("--hover-bridge-bottom-right-x",`${c}px`),this.style.setProperty("--hover-bridge-bottom-right-y",`${d}px`)}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(t){super.updated(t),t.has("active")&&(this.active?this.start():this.stop()),t.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){if(await this.stop(),this.anchor&&"string"==typeof this.anchor){const t=this.getRootNode();this.anchorEl=t.getElementById(this.anchor)}else this.anchor instanceof Element||function(t){return null!==t&&"object"==typeof t&&"getBoundingClientRect"in t&&(!("contextElement"in t)||t.contextElement instanceof Element)}(this.anchor)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]');this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){this.anchorEl&&this.active&&(this.cleanup=function(t,e,o,i){void 0===i&&(i={});const{ancestorScroll:r=!0,ancestorResize:a=!0,elementResize:n="function"==typeof ResizeObserver,layoutShift:l="function"==typeof IntersectionObserver,animationFrame:s=!1}=i,p=ht(t),b=r||a?[...p?st(p):[],...st(e)]:[];b.forEach(t=>{r&&t.addEventListener("scroll",o,{passive:!0}),a&&t.addEventListener("resize",o)});const g=p&&l?function(t,e){let o,i=null;const r=N(t);function a(){var t;clearTimeout(o),null==(t=i)||t.disconnect(),i=null}return function n(l,s){void 0===l&&(l=!1),void 0===s&&(s=1),a();const p=t.getBoundingClientRect(),{left:b,top:g,width:f,height:m}=p;if(l||e(),!f||!m)return;const v={rootMargin:-u(g)+"px "+-u(r.clientWidth-(b+f))+"px "+-u(r.clientHeight-(g+m))+"px "+-u(b)+"px",threshold:h(0,d(1,s))||1};let y=!0;function z(e){const i=e[0].intersectionRatio;if(i!==s){if(!y)return n();i?n(!1,i):o=setTimeout(()=>{n(!1,1e-7)},1e3)}1!==i||$t(p,t.getBoundingClientRect())||n(),y=!1}try{i=new IntersectionObserver(z,(0,c.ko)((0,c.IA)({},v),{root:r.ownerDocument}))}catch(t){i=new IntersectionObserver(z,v)}i.observe(t)}(!0),a}(p,o):null;let f,m=-1,v=null;n&&(v=new ResizeObserver(t=>{let[i]=t;i&&i.target===p&&v&&(v.unobserve(e),cancelAnimationFrame(m),m=requestAnimationFrame(()=>{var t;null==(t=v)||t.observe(e)})),o()}),p&&!s&&v.observe(p),v.observe(e));let y=s?gt(t):null;return s&&function e(){const i=gt(t);y&&!$t(y,i)&&o(),y=i,f=requestAnimationFrame(e)}(),o(),()=>{var t;b.forEach(t=>{r&&t.removeEventListener("scroll",o),a&&t.removeEventListener("resize",o)}),null==g||g(),null==(t=v)||t.disconnect(),v=null,s&&cancelAnimationFrame(f)}}(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(t=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.currentPlacement="",this.removeAttribute("data-current-placement"),this.popup.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>t())):t()})}reposition(){if(!this.active||!this.anchorEl)return;const t=[(e={mainAxis:this.distance,crossAxis:this.skidding},void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var o,i;const{x:r,y:a,placement:n,middlewareData:l}=t,s=await async function(t,e){const{placement:o,platform:i,elements:r}=t,a=await(null==i.isRTL?void 0:i.isRTL(r.floating)),n=y(o),l=z(o),s="y"===k(o),c=B.has(n)?-1:1,d=a&&s?-1:1,h=v(e,t);let{mainAxis:p,crossAxis:u,alignmentAxis:b}="number"==typeof h?{mainAxis:h,crossAxis:0,alignmentAxis:null}:{mainAxis:h.mainAxis||0,crossAxis:h.crossAxis||0,alignmentAxis:h.alignmentAxis};return l&&"number"==typeof b&&(u="end"===l?-1*b:b),s?{x:u*d,y:p*c}:{x:p*c,y:u*d}}(t,e);return n===(null==(o=l.offset)?void 0:o.placement)&&null!=(i=l.arrow)&&i.alignmentOffset?{}:{x:r+s.x,y:a+s.y,data:(0,c.ko)((0,c.IA)({},s),{placement:n})}}})];var e;this.sync?t.push(Et({apply:({rects:t})=>{const e="width"===this.sync||"both"===this.sync,o="height"===this.sync||"both"===this.sync;this.popup.style.width=e?`${t.reference.width}px`:"",this.popup.style.height=o?`${t.reference.height}px`:""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&t.push(St({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:"best-fit"===this.flipFallbackStrategy?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&t.push(function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:o,y:i,placement:r}=e,a=v(t,e),{mainAxis:n=!0,crossAxis:l=!1,limiter:s={fn:t=>{let{x:e,y:o}=t;return{x:e,y:o}}}}=a,d=(0,c.YG)(a,["mainAxis","crossAxis","limiter"]),h={x:o,y:i},p=await L(e,d),u=k(y(r)),b=x(u);let g=h[b],f=h[u];if(n){const t="y"===b?"bottom":"right";g=m(g+p["y"===b?"top":"left"],g,g-p[t])}if(l){const t="y"===u?"bottom":"right";f=m(f+p["y"===u?"top":"left"],f,f-p[t])}const z=s.fn((0,c.ko)((0,c.IA)({},e),{[b]:g,[u]:f}));return(0,c.ko)((0,c.IA)({},z),{data:{x:z.x-o,y:z.y-i,enabled:{[b]:n,[u]:l}}})}}}({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?t.push(Et({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:t,availableHeight:e})=>{"vertical"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-height",`${e}px`):this.style.removeProperty("--auto-size-available-height"),"horizontal"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-width",`${t}px`):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&t.push((t=>({name:"arrow",options:t,async fn(e){const{x:o,y:i,placement:r,rects:a,platform:n,elements:l,middlewareData:s}=e,{element:h,padding:p=0}=v(t,e)||{};if(null==h)return{};const u=D(p),b={x:o,y:i},g=C(r),f=_(g),y=await n.getDimensions(h),x="y"===g,w=x?"top":"left",k=x?"bottom":"right",$=x?"clientHeight":"clientWidth",S=a.reference[f]+a.reference[g]-b[g]-a.floating[f],E=b[g]-a.reference[g],A=await(null==n.getOffsetParent?void 0:n.getOffsetParent(h));let P=A?A[$]:0;P&&await(null==n.isElement?void 0:n.isElement(A))||(P=l.floating[$]||a.floating[f]);const T=S/2-E/2,F=P/2-y[f]/2-1,O=d(u[w],F),L=d(u[k],F),B=O,I=P-y[f]-L,V=P/2-y[f]/2+T,R=m(B,V,I),N=!s.arrow&&null!=z(r)&&V!==R&&a.reference[f]/2-(V<B?O:L)-y[f]/2<0,M=N?V<B?V-B:V-I:0;return{[g]:b[g]+M,data:(0,c.IA)({[g]:R,centerOffset:V-R-M},N&&{alignmentOffset:M}),reset:N}}}))({element:this.arrowEl,padding:this.arrowPadding}));const o="absolute"===this.strategy?t=>Ct.getOffsetParent(t,At):Ct.getOffsetParent;((t,e,o)=>{const i=new Map,r=(0,c.IA)({platform:Ct},o),a=(0,c.ko)((0,c.IA)({},r.platform),{_c:i});return(async(t,e,o)=>{const{placement:i="bottom",strategy:r="absolute",middleware:a=[],platform:n}=o,l=a.filter(Boolean),s=await(null==n.isRTL?void 0:n.isRTL(e));let d=await n.getElementRects({reference:t,floating:e,strategy:r}),{x:h,y:p}=O(d,i,s),u=i,b={},g=0;for(let o=0;o<l.length;o++){const{name:a,fn:f}=l[o],{x:m,y:v,data:y,reset:z}=await f({x:h,y:p,initialPlacement:i,placement:u,strategy:r,middlewareData:b,rects:d,platform:n,elements:{reference:t,floating:e}});h=null!=m?m:h,p=null!=v?v:p,b=(0,c.ko)((0,c.IA)({},b),{[a]:(0,c.IA)((0,c.IA)({},b[a]),y)}),z&&g<=50&&(g++,"object"==typeof z&&(z.placement&&(u=z.placement),z.rects&&(d=!0===z.rects?await n.getElementRects({reference:t,floating:e,strategy:r}):z.rects),({x:h,y:p}=O(d,u,s))),o=-1)}return{x:h,y:p,placement:u,strategy:r,middlewareData:b}})(t,e,(0,c.ko)((0,c.IA)({},r),{platform:a}))})(this.anchorEl,this.popup,{placement:this.placement,middleware:t,strategy:this.strategy,platform:(0,c.ko)((0,c.IA)({},Ct),{getOffsetParent:o})}).then(({x:t,y:e,middlewareData:o,placement:i})=>{const r={top:"bottom",right:"left",bottom:"top",left:"right"}[i.split("-")[0]];if(this.currentPlacement=i,this.setAttribute("data-current-placement",i),this.popup.setAttribute("data-current-placement",i),Object.assign(this.popup.style,{left:`${t}px`,top:`${e}px`}),this.arrow){const t=o.arrow.x,e=o.arrow.y;let i="",a="",n="",l="";if("start"===this.arrowPlacement){const o="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"";i="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",l=o}else"end"===this.arrowPlacement?(a="number"==typeof t?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",n="number"==typeof e?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""):"center"===this.arrowPlacement?(l="number"==typeof t?"calc(50% - var(--arrow-size-diagonal))":"",i="number"==typeof e?"calc(50% - var(--arrow-size-diagonal))":""):(l="number"==typeof t?`${t}px`:"",i="number"==typeof e?`${e}px`:"");Object.assign(this.arrowEl.style,{top:i,right:a,bottom:n,left:l,[r]:["left","right"].includes(r)?"calc(var(--arrow-size-diagonal-horizontal) * -1)":"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("bzl-reposition")}render(){return i.x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${(0,n.e)({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${(0,n.e)({popup:!0,"popup--active":this.active,"popup--fixed":"fixed"===this.strategy,"popup--has-arrow":this.arrow})}
        data-placement=${this.placement}
      >
        <slot></slot>
        ${this.arrow?i.x`<svg
              part="arrow"
              class="popup__arrow"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="20"
              height="8"
              viewBox="0 0 20 8"
            >
              <g opacity="1">
                <path
                  d="M20 8L0 8C1.90646 8 3.72011 7.17702 4.97551 5.74227L8.49485 1.72018C9.29167 0.809521 10.7083 0.809521 11.5052 1.72018L15.0245 5.74227C16.2799 7.17702 18.0935 8 20 8Z"
                  fill-rule="nonzero"
                  transform="matrix(-1 0 0 -1 20 8)"
                  fill="var(--arrow-color)"
                />
              </g>
            </svg> `:""}
      </div>
    `}};function Dt(t,e,o){return new Promise(i=>{if((null==o?void 0:o.duration)===1/0)throw new Error("Promise-based animations must be finite.");const r=t.animate(e,(0,c.ko)((0,c.IA)({},o),{duration:window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:o.duration}));r.addEventListener("cancel",i,{once:!0}),r.addEventListener("finish",i,{once:!0})})}function Ft(t){return(t=t.toString().toLowerCase()).indexOf("ms")>-1?parseFloat(t):t.indexOf("s")>-1?1e3*parseFloat(t):parseFloat(t)}function Ot(t){return Promise.all(t.getAnimations().map(t=>new Promise(e=>{t.cancel(),requestAnimationFrame(e)})))}function Lt(t,e){return new Promise(o=>{t.addEventListener(e,function i(r){r.target===t&&(t.removeEventListener(e,i),o())})})}Tt.styles=[l.$,a],(0,c.Cc)([(0,s.e)(".popup")],Tt.prototype,"popup",2),(0,c.Cc)([(0,s.e)(".popup__arrow")],Tt.prototype,"arrowEl",2),(0,c.Cc)([(0,s.n)()],Tt.prototype,"anchor",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Tt.prototype,"active",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Tt.prototype,"placement",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Tt.prototype,"strategy",2),(0,c.Cc)([(0,s.n)({type:Number})],Tt.prototype,"distance",2),(0,c.Cc)([(0,s.n)({type:Number})],Tt.prototype,"skidding",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Tt.prototype,"arrow",2),(0,c.Cc)([(0,s.n)({attribute:"arrow-placement"})],Tt.prototype,"arrowPlacement",2),(0,c.Cc)([(0,s.n)({attribute:"arrow-padding",type:Number})],Tt.prototype,"arrowPadding",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Tt.prototype,"flip",2),(0,c.Cc)([(0,s.n)({attribute:"flip-fallback-placements",converter:{fromAttribute:t=>t.split(" ").map(t=>t.trim()).filter(t=>""!==t),toAttribute:t=>t.join(" ")}})],Tt.prototype,"flipFallbackPlacements",2),(0,c.Cc)([(0,s.n)({attribute:"flip-fallback-strategy"})],Tt.prototype,"flipFallbackStrategy",2),(0,c.Cc)([(0,s.n)({type:Object})],Tt.prototype,"flipBoundary",2),(0,c.Cc)([(0,s.n)({attribute:"flip-padding",type:Number})],Tt.prototype,"flipPadding",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Tt.prototype,"shift",2),(0,c.Cc)([(0,s.n)({type:Object})],Tt.prototype,"shiftBoundary",2),(0,c.Cc)([(0,s.n)({attribute:"shift-padding",type:Number})],Tt.prototype,"shiftPadding",2),(0,c.Cc)([(0,s.n)({attribute:"auto-size"})],Tt.prototype,"autoSize",2),(0,c.Cc)([(0,s.n)()],Tt.prototype,"sync",2),(0,c.Cc)([(0,s.n)({type:Object})],Tt.prototype,"autoSizeBoundary",2),(0,c.Cc)([(0,s.n)({attribute:"auto-size-padding",type:Number})],Tt.prototype,"autoSizePadding",2),(0,c.Cc)([(0,s.n)({attribute:"hover-bridge",type:Boolean})],Tt.prototype,"hoverBridge",2);var Bt=new Map,It=new WeakMap;function Vt(t,e){return"rtl"===e.toLowerCase()?{keyframes:t.rtlKeyframes||t.keyframes,options:t.options}:t}function Rt(t,e){Bt.set(t,function(t){return null!=t?t:{keyframes:[],options:{duration:0}}}(e))}function Nt(t,e,o){const i=It.get(t);if(null==i?void 0:i[e])return Vt(i[e],o.dir);const r=Bt.get(e);return r?Vt(r,o.dir):{keyframes:[],options:{duration:0}}}var Mt=o(378),qt=class extends s.X{constructor(){super(),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=t=>{"Escape"===t.key&&(t.stopPropagation(),this.hide())},this.handleMouseOver=()=>{if(this.hasTrigger("hover")){const t=Ft(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")){const t=Ft(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}get computedDistance(){const t=getComputedStyle(this).getPropertyValue("--bzl-tooltip-arrow-size");return t&&"0px"!==t&&"0"!==t?this.distance+8:this.distance}disconnectedCallback(){var t;super.disconnectedCallback(),null==(t=this.closeWatcher)||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(t){return this.trigger.split(" ").includes(t)}async handleOpenChange(){var t,e;if(this.open){if(this.disabled)return;this.emit("bzl-show"),"CloseWatcher"in window?(null==(t=this.closeWatcher)||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await Ot(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:e,options:o}=Nt(this,"tooltip.show",{dir:"ltr"});await Dt(this.popup.popup,e,o),this.popup.reposition(),this.emit("bzl-after-show")}else{this.emit("bzl-hide"),null==(e=this.closeWatcher)||e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await Ot(this.body);const{keyframes:t,options:o}=Nt(this,"tooltip.hide",{dir:"ltr"});await Dt(this.popup.popup,t,o),this.popup.active=!1,this.body.hidden=!0,this.emit("bzl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Lt(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Lt(this,"bzl-after-hide")}render(){return i.x`
      <bzl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${(0,n.e)({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        arrow-placement=${this.placement.includes("start")?"start":this.placement.includes("end")?"end":void 0}
        distance=${this.computedDistance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </bzl-popup>
    `}};qt.styles=[l.$,r],qt.dependencies={"bzl-popup":Tt},(0,c.Cc)([(0,s.e)("slot:not([name])")],qt.prototype,"defaultSlot",2),(0,c.Cc)([(0,s.e)(".tooltip__body")],qt.prototype,"body",2),(0,c.Cc)([(0,s.e)("bzl-popup")],qt.prototype,"popup",2),(0,c.Cc)([(0,s.n)()],qt.prototype,"content",2),(0,c.Cc)([(0,s.n)()],qt.prototype,"placement",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],qt.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Number})],qt.prototype,"distance",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],qt.prototype,"open",2),(0,c.Cc)([(0,s.n)({type:Number})],qt.prototype,"skidding",2),(0,c.Cc)([(0,s.n)()],qt.prototype,"trigger",2),(0,c.Cc)([(0,s.n)({type:Boolean})],qt.prototype,"hoist",2),(0,c.Cc)([(0,Mt.w)("open",{waitUntilFirstUpdate:!0})],qt.prototype,"handleOpenChange",1),(0,c.Cc)([(0,Mt.w)(["content","distance","hoist","placement","skidding"])],qt.prototype,"handleOptionsChange",1),(0,c.Cc)([(0,Mt.w)("disabled")],qt.prototype,"handleDisabledChange",1),Rt("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),Rt("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}});var jt=qt;qt.define("bzl-tooltip");var Wt=new WeakMap,Ht=new WeakMap,Ut=new WeakMap,Kt=new WeakSet,Xt=new WeakMap,Zt=class{constructor(t,e){this.handleFormData=t=>{const e=this.options.disabled(this.host),o=this.options.name(this.host),i=this.options.value(this.host),r="bzl-button"===this.host.tagName.toLowerCase();this.host.isConnected&&!e&&!r&&"string"==typeof o&&o.length>0&&void 0!==i&&(Array.isArray(i)?i.forEach(e=>{t.formData.append(o,e.toString())}):t.formData.append(o,i.toString()))},this.handleFormSubmit=t=>{var e;const o=this.options.disabled(this.host),i=this.options.reportValidity;this.form&&!this.form.noValidate&&(null==(e=Wt.get(this.form))||e.forEach(t=>{this.setUserInteracted(t,!0)})),!this.form||this.form.noValidate||o||i(this.host)||(t.preventDefault(),t.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),Xt.set(this.host,[])},this.handleInteraction=t=>{const e=Xt.get(this.host);e.includes(t.type)||e.push(t.type),e.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.checkValidity&&!e.checkValidity())return!1}return!0},this.reportFormValidity=()=>{if(this.form&&!this.form.noValidate){const t=this.form.querySelectorAll("*");for(const e of t)if("function"==typeof e.reportValidity&&!e.reportValidity())return!1}return!0},(this.host=t).addController(this),this.options=(0,c.IA)({form:t=>{const e=t.form;if(e){const o=t.getRootNode().querySelector(`#${e}`);if(o)return o}return t.closest("form")},name:t=>t.name,value:t=>t.value,defaultValue:t=>t.defaultValue,disabled:t=>{var e;return null!=(e=t.disabled)&&e},reportValidity:t=>"function"!=typeof t.reportValidity||t.reportValidity(),checkValidity:t=>"function"!=typeof t.checkValidity||t.checkValidity(),setValue:(t,e)=>t.value=e,assumeInteractionOn:["bzl-input"]},e)}hostConnected(){const t=this.options.form(this.host);t&&this.attachForm(t),Xt.set(this.host,[]),this.options.assumeInteractionOn.forEach(t=>{this.host.addEventListener(t,this.handleInteraction)})}hostDisconnected(){this.detachForm(),Xt.delete(this.host),this.options.assumeInteractionOn.forEach(t=>{this.host.removeEventListener(t,this.handleInteraction)})}hostUpdated(){const t=this.options.form(this.host);t||this.detachForm(),t&&this.form!==t&&(this.detachForm(),this.attachForm(t)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(t){t?(this.form=t,Wt.has(this.form)?Wt.get(this.form).add(this.host):Wt.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),Ht.has(this.form)||(Ht.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),Ut.has(this.form)||(Ut.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){if(!this.form)return;const t=Wt.get(this.form);t&&(t.delete(this.host),t.size<=0&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),Ht.has(this.form)&&(this.form.reportValidity=Ht.get(this.form),Ht.delete(this.form)),Ut.has(this.form)&&(this.form.checkValidity=Ut.get(this.form),Ut.delete(this.form)),this.form=void 0))}setUserInteracted(t,e){e?Kt.add(t):Kt.delete(t),t.requestUpdate()}doAction(t,e){if(this.form){if("reset"===t){const t=new Event("reset",{bubbles:!0,cancelable:!0});return void this.form.dispatchEvent(t)}const o=document.createElement("button");o.type=t,o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.clipPath="inset(50%)",o.style.overflow="hidden",o.style.whiteSpace="nowrap",e&&(o.name=e.name,o.value=e.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(t=>{e.hasAttribute(t)&&o.setAttribute(t,e.getAttribute(t))})),this.form.append(o),o.click(),o.remove()}}getForm(){var t;return null!=(t=this.form)?t:null}reset(t){this.doAction("reset",t)}submit(t){this.doAction("submit",t)}setValidity(t){const e=this.host,o=Boolean(Kt.has(e)),i=Boolean(e.required);e.toggleAttribute("data-required",i),e.toggleAttribute("data-optional",!i),e.toggleAttribute("data-invalid",!t),e.toggleAttribute("data-valid",t),e.toggleAttribute("data-user-invalid",!t&&o),e.toggleAttribute("data-user-valid",t&&o)}updateValidity(){const t=this.host;this.setValidity(t.validity.valid)}emitInvalidEvent(t){const e=new CustomEvent("bzl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});t||e.preventDefault(),this.host.dispatchEvent(e)||null==t||t.preventDefault()}},Yt=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});function Gt(t){const e=new FormData(t),o={};return e.forEach((t,e)=>{if(Reflect.has(o,e)){const i=o[e];Array.isArray(i)?i.push(t):o[e]=[o[e],t]}else o[e]=t}),o}function Jt(t){const e=[...t.getRootNode().querySelectorAll("*")],o=[...t.elements],i=Wt.get(t);return[...o,...i?Array.from(i):[]].sort((t,o)=>e.indexOf(t)<e.indexOf(o)?-1:e.indexOf(t)>e.indexOf(o)?1:0)}Object.freeze((0,c.ko)((0,c.IA)({},Yt),{valid:!1,valueMissing:!0})),Object.freeze((0,c.ko)((0,c.IA)({},Yt),{valid:!1,customError:!0}));var Qt={install(t,e){const o=new WeakMap;t.directive("bzl-model",{bind(e,i,r){var a;const n="BZL-SELECT"===e.tagName?"bzl-change":"input",l=e=>{const o=r.context;o&&function(t,e,o,i){const r=o.split(".");if(1===r.length)return void t.set(e,o,i);const a=r.pop(),n=r.reduce((t,e)=>t[e],e);t.set(n,a,i)}(t,o,i.expression,e.target.value)};o.set(e,l),e.value=null!=(a=i.value)?a:void 0,e.addEventListener(n,l)},update(t,e){var o;t.value=null!=(o=e.value)?o:void 0},unbind(t){const e=o.get(t);if(e){const o="BZL-SELECT"===t.tagName?"bzl-change":"input";t.removeEventListener(o,e)}}})}},te=i.i`
  :host {
    display: block;
  }

  .textarea {
    display: grid;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    line-height: var(--bzl-line-height-dense);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-medium);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--bzl-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    color: var(--bzl-input-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--bzl-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    cursor: not-allowed;
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .textarea--standard {
    border-color: var(--bzl-color-danger-600);
  }

  :host([data-user-invalid]) .textarea--standard.textarea--focused:not(.textarea--disabled) {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }

  .textarea__control,
  .textarea__size-adjuster {
    grid-area: 1 / 1 / 2 / 2;
  }

  /* Inline word counter inside the textarea */
  .textarea__count {
    grid-area: 1 / 1 / 2 / 2;
    justify-self: end;
    align-self: end;
    margin-right: var(--bzl-input-spacing-medium);
    margin-bottom: var(--bzl-spacing-1);
    color: var(--bzl-input-placeholder-color);
    font-variant-numeric: tabular-nums;
    pointer-events: none;
    font-size: var(--bzl-font-size-2x-small);
  }

  .textarea__size-adjuster {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--bzl-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--bzl-input-placeholder-color-disabled);
  }

  .textarea__control {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: var(--bzl-line-height-dense);
    color: var(--bzl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
    padding: var(--bzl-input-padding-updown) var(--bzl-input-padding-leftright);
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--bzl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`,ee=(t="value")=>(e,o)=>{const r=e.constructor,a=r.prototype.attributeChangedCallback;r.prototype.attributeChangedCallback=function(e,n,l){var s;const c=r.getPropertyOptions(t);if(e===("string"==typeof c.attribute?c.attribute:t)){const e=c.converter||i.u,r=("function"==typeof e?e:null!=(s=null==e?void 0:e.fromAttribute)?s:i.u.fromAttribute)(l,c.type);this[t]!==r&&(this[o]=r)}a.call(this,e,n,l)}},oe=o(7487),ie=o(4724),re=(0,ie.e)(class extends ie.i{constructor(t){if(super(t),t.type!==ie.t.PROPERTY&&t.type!==ie.t.ATTRIBUTE&&t.type!==ie.t.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!(0,oe.f)(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===i.T||e===i.E)return e;const o=t.element,r=t.name;if(t.type===ie.t.PROPERTY){if(e===o[r])return i.T}else if(t.type===ie.t.BOOLEAN_ATTRIBUTE){if(!!e===o.hasAttribute(r))return i.T}else if(t.type===ie.t.ATTRIBUTE&&o.getAttribute(r)===e+"")return i.T;return(0,oe.m)(t),e}}),ae=t=>null!=t?t:i.E,ne=class extends s.X{constructor(){super(...arguments),this.hasFocus=!1,this.title="",this.name="",this.value="",this.showWordLimit=!1,this.placeholder="",this.rows=3,this.resize="vertical",this.disabled=!1,this.readonly=!1,this.autocomplete="off",this.defaultValue=""}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.setTextareaHeight()),this.updateComplete.then(()=>{this.setTextareaHeight(!0),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var t;super.disconnectedCallback(),this.input&&(null==(t=this.resizeObserver)||t.unobserve(this.input))}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("bzl-change")}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleInput(){this.value=this.input.value,this.emit("bzl-input")}handleInvalid(){}setTextareaHeight(t){"auto"===this.resize?(this.sizeAdjuster.style.height=`${this.input.clientHeight}px`,this.input.style.height="auto",this.input.style.height=`${this.input.scrollHeight}px`):t&&(this.input.style.height="")}handleDisabledChange(){}handleRowsChange(){this.setTextareaHeight(!0)}async handleValueChange(){await this.updateComplete,this.setTextareaHeight()}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}render(){return i.x`
      <div
        part="base"
        class=${(0,n.e)({textarea:!0,"textarea--standard":!0,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--resize-none":"none"===this.resize,"textarea--resize-vertical":"vertical"===this.resize,"textarea--resize-auto":"auto"===this.resize})}
      >
        <textarea
          part="textarea"
          id="input"
          class="textarea__control"
          title=${this.title}
          name=${ae(this.name)}
          .value=${re(this.value)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          placeholder=${ae(this.placeholder)}
          rows=${ae(this.rows)}
          minlength=${ae(this.minlength)}
          maxlength=${ae(this.maxlength)}
          ?autofocus=${this.autofocus}
          @change=${this.handleChange}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        ></textarea>
        <div part="textarea-adjuster" class="textarea__size-adjuster" ?hidden=${"auto"!==this.resize}></div>

        ${this.showWordLimit?i.x`
              <span class="textarea__count" aria-hidden="true">
                ${`${"string"==typeof this.value?this.value.length:0}${this.maxlength?`/${this.maxlength}`:""}`}
              </span>
            `:""}
      </div>
    `}};ne.styles=[l.$,te],(0,c.Cc)([(0,s.e)(".textarea__control")],ne.prototype,"input",2),(0,c.Cc)([(0,s.e)(".textarea__size-adjuster")],ne.prototype,"sizeAdjuster",2),(0,c.Cc)([(0,s.r)()],ne.prototype,"hasFocus",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"title",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"name",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"show-word-limit"})],ne.prototype,"showWordLimit",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"placeholder",2),(0,c.Cc)([(0,s.n)({type:Number})],ne.prototype,"rows",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"resize",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ne.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ne.prototype,"readonly",2),(0,c.Cc)([(0,s.n)({type:Number})],ne.prototype,"minlength",2),(0,c.Cc)([(0,s.n)({type:Number})],ne.prototype,"maxlength",2),(0,c.Cc)([(0,s.n)()],ne.prototype,"autocomplete",2),(0,c.Cc)([(0,s.n)({type:Boolean})],ne.prototype,"autofocus",2),(0,c.Cc)([ee()],ne.prototype,"defaultValue",2),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],ne.prototype,"handleDisabledChange",1),(0,c.Cc)([(0,Mt.w)("rows",{waitUntilFirstUpdate:!0})],ne.prototype,"handleRowsChange",1),(0,c.Cc)([(0,Mt.w)("value",{waitUntilFirstUpdate:!0})],ne.prototype,"handleValueChange",1);var le=ne;ne.define("bzl-textarea");var se=o(2909),ce=o(5066),de=(o(7302),o(6133),i.i`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    min-width: 0;
    box-sizing: border-box;
    --bzl-step-marker-box: 24px;
    --bzl-step-marker-icon-size: 21px;
    --bzl-step-label-inline-row-width: 196px;
  }

  :host([data-last='true']) {
    flex: none;
  }

  .step {
    display: flex;
    position: relative;
    color: var(--bzl-color-neutral-900);
    box-sizing: border-box;
  }

  .step--horizontal {
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    width: 100%;
  }

  .step--vertical {
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }

  .step--vertical:not(.step--last) {
    min-height: 74px;
  }

  .step__track {
    display: flex;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .step--horizontal .step__track {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  /*
   * 横向 + 标题在上：第 1 列固定为图标宽度，保证连线始终从图标后开始；
   * 文案放在第 2 行并相对图标中心对齐，不再影响第 1 行连线起点。
   */
  .step--horizontal.step--label-vertical {
    position: relative;
  }
  .step--horizontal.step--label-vertical .step__label-line-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--bzl-step-label-inline-row-width);
  }

  .step--horizontal.step--label-vertical > .step__connector {
    position: absolute;
    top: 11.5px;
    left: calc(var(--bzl-step-label-inline-row-width) / 2 + var(--bzl-step-marker-box) / 2);
    width: calc(100% - var(--bzl-step-marker-box) - var(--bzl-spacing-5));
  }

  .step--horizontal.step--label-vertical .step__label-line-row > .step__body--label-block {
    margin-top: var(--bzl-spacing-2);
    text-align: center;
  }

  .step--vertical .step__track {
    flex-direction: column;
    align-items: center;
    width: var(--bzl-step-marker-box);
    align-self: stretch;
  }

  .step--vertical .step__marker {
    margin-right: 0;
  }

  .step__marker {
    flex-shrink: 0;
    width: var(--bzl-step-marker-box);
    height: var(--bzl-step-marker-box);
    line-height: var(--bzl-step-marker-box);
    text-align: center;
    box-sizing: border-box;
    margin-right: var(--bzl-spacing-3);
  }

  .step__index-circle {
    display: inline-block;
    width: var(--bzl-step-marker-icon-size);
    height: var(--bzl-step-marker-icon-size);
    line-height: var(--bzl-step-marker-icon-size);
    text-align: center;
    border-radius: var(--bzl-border-radius-circle);
    color: var(--bzl-color-neutral-0);
    font-size: var(--bzl-font-size-2x-small);
  }

  .step--process .step__index-circle {
    background-color: var(--bzl-color-primary-600);
  }

  .step--wait .step__index-circle {
    background-color: var(--bzl-color-neutral-600);
  }

  .step__index {
    display: inline;
    vertical-align: baseline;
  }

  .step__icon {
    display: block;
    font-size: 23px;
    color: var(--bzl-color-primary-600);
  }

  .step--danger .step__icon {
    color: var(--bzl-color-danger-600);
  }

  .step--dot .step__dot {
    display: inline-block;
    width: var(--bzl-badge-dot-size);
    height: var(--bzl-badge-dot-size);
    border-radius: var(--bzl-border-radius-circle);
    vertical-align: middle;
    box-sizing: border-box;
  }

  .step--dot.step--process .step__dot,
  .step--dot.step--finish .step__dot {
    background-color: var(--bzl-color-primary-600);
  }

  .step--dot.step--wait .step__dot {
    background-color: var(--bzl-color-neutral-600);
  }

  .step--dot.step--danger .step__dot {
    background-color: var(--bzl-color-danger-600);
  }

  .step__connector {
    flex-shrink: 0;
    background-color: var(--bzl-panel-divider-color);
    box-sizing: border-box;
  }

  .step--finish .step__connector {
    background-color: var(--bzl-color-boss-600);
  }

  .step--horizontal .step__connector {
    height: 1px;
  }

  .step--horizontal:not(.step--label-inline) .step__connector,
  .step--horizontal.step--label-inline .step__inline-title-row .step__connector {
    flex: 1 1 auto;
    align-self: center;
    min-width: var(--bzl-spacing-4);
    margin-inline-start: var(--bzl-spacing-4);
  }

  .step--horizontal.step--label-inline .step__inline-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .step--vertical .step__connector {
    flex: 1 1 auto;
    width: 1px;
    min-height: var(--bzl-spacing-5);
    margin-top: var(--bzl-spacing-2);
  }

  .step--last .step__connector {
    display: none;
  }

  .step__body {
    flex: 1 1 auto;
    min-width: 0;
    box-sizing: border-box;
  }

  .step--horizontal .step__body {
    margin-top: var(--bzl-spacing-2);
    width: 100%;
  }

  .step__inline-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }

  .step--horizontal.step--label-inline .step__marker {
    margin-inline-end: var(--bzl-spacing-3);
  }

  .step--horizontal.step--label-inline .step__body {
    flex: 1 1 auto;
    margin-top: 0;
    width: auto;
  }

  .step--vertical .step__body {
    margin-inline-start: var(--bzl-spacing-3);
  }

  .step__title {
    font-size: var(--bzl-font-size-medium);
    line-height: var(--bzl-line-height-normal);
    font-weight: var(--bzl-font-weight-bold);
    white-space: nowrap;
  }

  .step__description {
    margin-top: var(--bzl-spacing-1);
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-line-height-x-dense);
  }
`),he=o(5339),pe=class extends s.X{constructor(){super(...arguments),this.title="",this.description="",this.status=void 0,this._context={index:0,isCurrent:!1,effectiveStatus:"wait",stepsType:"default",direction:"horizontal",labelPlacement:"horizontal",isLast:!1}}applyContextFromParent(t){this._context=t,t.isLast?this.setAttribute("data-last","true"):this.removeAttribute("data-last")}get hasUserStatusOverride(){return null!==this.status&&void 0!==this.status}get effectiveStatus(){return this._context.effectiveStatus}renderMarker(){const t=this._context,e=t.effectiveStatus;return"dot"===t.stepsType?i.x`<span class="step__dot"></span>`:"finish"===e?i.x`<bzl-icon class="step__icon" name="pass-face"></bzl-icon>`:"danger"===e?i.x`<bzl-icon class="step__icon" name="close-face1"></bzl-icon>`:i.x`<span class="step__index-circle"><span class="step__index">${t.index+1}</span></span>`}renderTitleDescription(){return i.x`
      ${this.title?i.x`<div part="title" class="step__title">${this.title}</div>`:null}
      ${this.description?i.x`<div part="description" class="step__description">${this.description}</div>`:null}
    `}renderInlineBody(t){const e=Boolean(this.title||t);return i.x`
      ${e?i.x`
            <div class="step__inline-title-row">
              ${this.title?i.x`<div part="title" class="step__title">${this.title}</div>`:null}
              ${t?i.x`<div part="connector" class="step__connector"></div>`:null}
            </div>
          `:null}
      ${this.description?i.x`<div part="description" class="step__description">${this.description}</div>`:null}
    `}renderBase(t,e){const o=this._context,r=o.effectiveStatus;return i.x`
      <div
        part="base"
        class=${(0,n.e)(t)}
        data-step-index=${String(o.index)}
        data-effective-status=${r}
        data-current=${o.isCurrent?"true":"false"}
        data-last=${o.isLast?"true":"false"}
      >
        ${e}
      </div>
    `}render(){const t=this._context,e=t.effectiveStatus,o="dot"===t.stepsType,r=!t.isLast,a="horizontal"===t.direction&&"horizontal"===t.labelPlacement,n={step:!0,"step--horizontal":"horizontal"===t.direction,"step--vertical":"vertical"===t.direction,"step--label-inline":a,"step--label-vertical":"horizontal"===t.direction&&"vertical"===t.labelPlacement,"step--dot":o,"step--default":!o,[`step--${e}`]:!0,"step--current":t.isCurrent,"step--last":t.isLast};if(a)return this.renderBase(n,i.x`
          <div class="step__inline-row">
            <div part="marker" class="step__marker">${this.renderMarker()}</div>
            <div part="body" class="step__body">${this.renderInlineBody(r)}</div>
          </div>
        `);if("horizontal"===t.direction&&"vertical"===t.labelPlacement){const t=Boolean(this.title||this.description);return this.renderBase(n,i.x`
          <div class="step__label-line-row">
            <div part="marker" class="step__marker">${this.renderMarker()}</div>
            ${t?i.x`<div part="body" class="step__body step__body--label-block">${this.renderTitleDescription()}</div>`:null}
          </div>
          ${r?i.x`<div part="connector" class="step__connector"></div>`:null}
        `)}return this.renderBase(n,i.x`
        <div class="step__track">
          <div part="marker" class="step__marker">${this.renderMarker()}</div>
          ${r?i.x`<div part="connector" class="step__connector"></div>`:null}
        </div>
        <div part="body" class="step__body">${this.renderTitleDescription()}</div>
      `)}};pe.styles=[l.$,de],pe.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.n)()],pe.prototype,"title",2),(0,c.Cc)([(0,s.n)()],pe.prototype,"description",2),(0,c.Cc)([(0,s.n)({reflect:!0})],pe.prototype,"status",2),(0,c.Cc)([(0,s.r)()],pe.prototype,"_context",2);var ue=i.i`
  :host {
    display: block;
  }

  .steps {
    width: 100%;
    display: flex;
    gap: var(--bzl-spacing-5);
  }

  .steps--vertical {
    flex-direction: column;
  }

  .steps--horizontal > slot::slotted(bzl-step:not([data-last='true'])) {
    flex: 1;
    min-width: 0;
  }

  .steps--horizontal > slot::slotted(bzl-step[data-last='true']) {
    flex: none;
  }

  .steps--vertical > slot::slotted(bzl-step) {
    width: 100%;
  }
`,be=class extends s.X{constructor(){super(...arguments),this._previousClampedCurrentIndex=void 0,this._stepsLightDomObserver=void 0,this.type="default",this.direction="horizontal",this.labelPlacement="horizontal",this.current=0,this.status="process",this.handleSlotChange=()=>{this.syncToSteps()}}get stepElements(){return[...this.querySelectorAll(":scope > bzl-step")]}get stepCount(){return this.stepElements.length}normalizeCurrentStep(){const t=Number(this.current);return Number.isFinite(t)?Math.floor(t):1}get clampedCurrentIndex(){return this.getClampedCurrentIndex(this.stepCount)}getClampedCurrentIndex(t){if(0===t)return-1;const e=this.normalizeCurrentStep();return e<=0?-1:e>t?t:e-1}computeEffectiveStatus(t,e,o,i){return t.hasUserStatusOverride?t.status:e<o?"finish":e>o?"wait":i}buildContext(t,e,o,i,r,a,n,l){return{index:t,isCurrent:e>=0&&e<o&&t===e,effectiveStatus:i,stepsType:r,direction:a,labelPlacement:n,isLast:l}}connectedCallback(){super.connectedCallback(),this._stepsLightDomObserver=new MutationObserver(()=>{this.syncToSteps()}),this._stepsLightDomObserver.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["status"]})}disconnectedCallback(){var t;null==(t=this._stepsLightDomObserver)||t.disconnect(),this._stepsLightDomObserver=void 0,this._previousClampedCurrentIndex=void 0,super.disconnectedCallback()}notifyCurrentStepChangeIfNeeded(){const t=this.clampedCurrentIndex;void 0!==this._previousClampedCurrentIndex?this._previousClampedCurrentIndex!==t&&(this._previousClampedCurrentIndex=t,this.emit("bzl-change")):this._previousClampedCurrentIndex=t}syncToSteps(){const t=this.stepElements,e=t.length,o=this.getClampedCurrentIndex(e),i=this.type,r=this.direction,a=this.labelPlacement,n=this.status,l=e-1;for(let s=0;s<e;s+=1){const c=t[s],d=this.computeEffectiveStatus(c,s,o,n),h=this.buildContext(s,o,e,d,i,r,a,s===l);c.applyContextFromParent(h)}this.notifyCurrentStepChangeIfNeeded()}updated(t){super.updated(t),(t.has("current")||t.has("status")||t.has("direction")||t.has("type")||t.has("labelPlacement"))&&this.syncToSteps()}render(){return i.x`
      <div
        part="base"
        class=${(0,n.e)({steps:!0,"steps--horizontal":"horizontal"===this.direction,"steps--vertical":"vertical"===this.direction,"steps--default":"default"===this.type,"steps--dot":"dot"===this.type})}
        data-current-index=${this.stepCount>0?String(this.clampedCurrentIndex):""}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}};be.styles=[l.$,ue],be.dependencies={"bzl-step":pe},(0,c.Cc)([(0,s.n)({reflect:!0})],be.prototype,"type",2),(0,c.Cc)([(0,s.n)({reflect:!0})],be.prototype,"direction",2),(0,c.Cc)([(0,s.n)({reflect:!0,attribute:"label-placement"})],be.prototype,"labelPlacement",2),(0,c.Cc)([(0,s.n)({type:Number,reflect:!0})],be.prototype,"current",2),(0,c.Cc)([(0,s.n)({reflect:!0})],be.prototype,"status",2);var ge=be;be.define("bzl-steps");var fe=i.i`
  :host([size='small']) {
    --height: 16px;
    --thumb-size: 12px;
    --width: 28px;
    font-size: var(--bzl-input-font-size-small);
  }

  :host([size='medium']) {
    --height: 20px;
    --thumb-size: 16px;
    --width: 36px;
    font-size: var(--bzl-input-font-size-medium);
  }

  :host {
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--bzl-color-neutral-500);
    border-radius: var(--height);
    transition: var(--bzl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    line-height: var(--thumb-size);
    font-size: var(--thumb-size);
    background-color: var(--bzl-color-neutral-0);
    border-radius: 50%;
    translate: calc((var(--width) - var(--height)) / -2);
    transition:
      var(--bzl-transition-fast) translate ease,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--bzl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--bzl-color-neutral-0);
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--bzl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--bzl-color-neutral-0);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--bzl-color-primary-600);
  }

  /* Disabled */
  .switch--disabled {
    cursor: not-allowed;
  }

  .switch--disabled .switch__control {
    background-color: var(--bzl-color-neutral-300);
  }

  .switch--disabled.switch--checked .switch__control {
    background-color: var(--bzl-color-primary-300);
  }
`,me=o(1054),ve=class extends s.X{constructor(){super(...arguments),this.title="",this.name="",this.size="medium",this.disabled=!1,this.loading=!1,this.checked=!1}handleBlur(){this.emit("bzl-blur")}handleInput(){this.emit("bzl-input")}handleClick(){this.disabled||this.loading||(this.checked=!this.checked,this.emit("bzl-change"))}handleFocus(){this.emit("bzl-focus")}handleKeyDown(t){this.disabled||this.loading||("ArrowLeft"===t.key&&(t.preventDefault(),this.checked=!1,this.emit("bzl-change"),this.emit("bzl-input")),"ArrowRight"===t.key&&(t.preventDefault(),this.checked=!0,this.emit("bzl-change"),this.emit("bzl-input")))}handleCheckedChange(){this.input.checked=this.checked}click(){this.input.click()}focus(t){this.input.focus(t)}blur(){this.input.blur()}render(){return i.x`
      <label
        part="base"
        class=${(0,n.e)({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled||this.loading,"switch--small":"small"===this.size,"switch--medium":"medium"===this.size})}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${ae(this.value)}
          .checked=${re(this.checked)}
          .disabled=${this.disabled||this.loading}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb">
            ${this.loading?i.x`<bzl-spin size="xsmall" style="--spin-font-size: var(--thumb-size)">
                  ${this.checked?null:i.x`<bzl-icon slot="icon" type="library" name="gray-loading-face"></bzl-icon>`}
                </bzl-spin>`:null}
          </span>
        </span>
      </label>
    `}};ve.styles=[l.$,fe],ve.dependencies={"bzl-spin":me.v},(0,c.Cc)([(0,s.e)('input[type="checkbox"]')],ve.prototype,"input",2),(0,c.Cc)([(0,s.n)()],ve.prototype,"title",2),(0,c.Cc)([(0,s.n)()],ve.prototype,"name",2),(0,c.Cc)([(0,s.n)()],ve.prototype,"value",2),(0,c.Cc)([(0,s.n)({reflect:!0})],ve.prototype,"size",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ve.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ve.prototype,"loading",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ve.prototype,"checked",2),(0,c.Cc)([(0,Mt.w)("checked",{waitUntilFirstUpdate:!0})],ve.prototype,"handleCheckedChange",1);var ye=ve;ve.define("bzl-switch");var ze=i.i`
  :host {
    display: inline-block;
    --bzl-tag-height-large: 28px;
    --bzl-tag-height-medium: 24px;
    --bzl-tag-height-small: 20px;
    --bzl-tag-height-xsmall: 16px;
  }

  .tag {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border: solid 1px;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__prefix {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .tag__prefix bzl-icon {
    font-size: 1em;
  }

  .tag--has-prefix .tag__prefix {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .tag__remove {
    margin-inline-start: var(--bzl-spacing-2);
    cursor: pointer;
  }

  .tag--xsmall .tag__remove {
    margin-inline-start: var(--bzl-spacing-1);
  }

  .tag__remove::part(base) {
    padding: 0;
  }

  /*
   * Variant default: 600 底、白字（color default 为中性灰）
   */

  .tag--boss.tag--variant-default {
    background-color: var(--bzl-color-boss-600);
    border-color: var(--bzl-color-boss-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--red.tag--variant-default {
    background-color: var(--bzl-color-red-600);
    border-color: var(--bzl-color-red-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--orange.tag--variant-default {
    background-color: var(--bzl-color-orange-600);
    border-color: var(--bzl-color-orange-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--green.tag--variant-default {
    background-color: var(--bzl-color-green-600);
    border-color: var(--bzl-color-green-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--blue.tag--variant-default {
    background-color: var(--bzl-color-blue-600);
    border-color: var(--bzl-color-blue-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--default.tag--variant-default {
    background-color: var(--bzl-color-neutral-200);
    border-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Variant filled: 100 底、700 字
   */

  .tag--boss.tag--variant-filled {
    background-color: var(--bzl-color-boss-100);
    border-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
  }

  .tag--red.tag--variant-filled {
    background-color: var(--bzl-color-red-100);
    border-color: var(--bzl-color-red-100);
    color: var(--bzl-color-red-700);
  }

  .tag--orange.tag--variant-filled {
    background-color: var(--bzl-color-orange-100);
    border-color: var(--bzl-color-orange-100);
    color: var(--bzl-color-orange-700);
  }

  .tag--green.tag--variant-filled {
    background-color: var(--bzl-color-green-100);
    border-color: var(--bzl-color-green-100);
    color: var(--bzl-color-green-700);
  }

  .tag--blue.tag--variant-filled {
    background-color: var(--bzl-color-blue-100);
    border-color: var(--bzl-color-blue-100);
    color: var(--bzl-color-blue-700);
  }

  .tag--default.tag--variant-filled {
    background-color: var(--bzl-color-neutral-200);
    border-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Variant lined: 白底、700 字、1px 500 边框（color default 为中性灰）
   */

  .tag--boss.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-boss-500);
    color: var(--bzl-color-boss-700);
  }

  .tag--red.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-red-500);
    color: var(--bzl-color-red-700);
  }

  .tag--orange.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-orange-500);
    color: var(--bzl-color-orange-700);
  }

  .tag--green.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-green-500);
    color: var(--bzl-color-green-700);
  }

  .tag--blue.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-blue-500);
    color: var(--bzl-color-blue-700);
  }

  .tag--default.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-neutral-500);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Removable icon: 500 默认、900 hover（color default 为中性色阶）
   */

  .tag--removable .tag__remove {
    color: var(--bzl-color-boss-700);
  }

  .tag--removable.tag--boss .tag__remove:hover {
    color: var(--bzl-color-boss-900);
  }

  .tag--removable.tag--red .tag__remove {
    color: var(--bzl-color-red-700);
  }

  .tag--removable.tag--red .tag__remove:hover {
    color: var(--bzl-color-red-900);
  }

  .tag--removable.tag--orange .tag__remove {
    color: var(--bzl-color-orange-700);
  }

  .tag--removable.tag--orange .tag__remove:hover {
    color: var(--bzl-color-orange-900);
  }

  .tag--removable.tag--green .tag__remove {
    color: var(--bzl-color-green-700);
  }

  .tag--removable.tag--green .tag__remove:hover {
    color: var(--bzl-color-green-900);
  }

  .tag--removable.tag--blue .tag__remove {
    color: var(--bzl-color-blue-700);
  }

  .tag--removable.tag--blue .tag__remove:hover {
    color: var(--bzl-color-blue-900);
  }

  .tag--removable.tag--default .tag__remove {
    color: var(--bzl-color-neutral-700);
  }

  .tag--removable.tag--default .tag__remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  /*
   * 当默认色为白色时，hover 不切换到 900。
   */
  .tag--removable.tag--variant-default.tag--boss .tag__remove,
  .tag--removable.tag--variant-default.tag--red .tag__remove,
  .tag--removable.tag--variant-default.tag--orange .tag__remove,
  .tag--removable.tag--variant-default.tag--green .tag__remove,
  .tag--removable.tag--variant-default.tag--blue .tag__remove,
  .tag--removable.tag--variant-default.tag--boss .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--red .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--orange .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--green .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--blue .tag__remove:hover {
    color: var(--bzl-color-neutral-0);
  }

  /*
   * Size modifiers（高度/行高/字号/水平内边距）
   */

  .tag--large {
    border-radius: var(--bzl-border-radius-small);
    font-size: var(--bzl-font-size-small);
    height: var(--bzl-tag-height-large);
    line-height: var(--bzl-tag-height-large);
    padding: 0 var(--bzl-spacing-4);
  }

  .tag--medium,
  .tag--small,
  .tag--xsmall {
    border-radius: var(--bzl-border-radius-x-small);
  }

  .tag--medium {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-medium);
    line-height: var(--bzl-tag-height-medium);
    padding: 0 var(--bzl-spacing-4);
  }

  .tag--small {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-small);
    line-height: var(--bzl-tag-height-small);
    padding: 0 var(--bzl-spacing-3);
  }

  .tag--xsmall {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-xsmall);
    line-height: var(--bzl-tag-height-xsmall);
    padding: 0 var(--bzl-spacing-3);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--bzl-border-radius-pill);
  }
`,xe=class extends s.X{constructor(){super(...arguments),this.color="default",this.size="medium",this.variant="default",this.pill=!1,this.removable=!1,this.handlePrefixSlotChange=()=>this.requestUpdate()}firstUpdated(t){var e;super.firstUpdated(t),null==(e=this.prefixSlot)||e.addEventListener("slotchange",this.handlePrefixSlotChange),this.requestUpdate()}disconnectedCallback(){var t;null==(t=this.prefixSlot)||t.removeEventListener("slotchange",this.handlePrefixSlotChange),super.disconnectedCallback()}get hasPrefixContent(){const t=this.prefixSlot;return!!t&&t.assignedNodes({flatten:!0}).some(t=>{var e;return t.nodeType===Node.ELEMENT_NODE||t.nodeType===Node.TEXT_NODE&&Boolean(null==(e=t.textContent)?void 0:e.trim())})}handleRemoveClick(){this.emit("bzl-remove")}render(){return i.x`
      <span
        part="base"
        class=${(0,n.e)({tag:!0,[`tag--${this.color}`]:!0,[`tag--${this.size}`]:!0,[`tag--variant-${this.variant}`]:!0,"tag--has-prefix":this.hasPrefixContent,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <span part="prefix" class="tag__prefix">
          <slot name="prefix"></slot>
        </span>
        <slot part="content" class="tag__content"></slot>

        ${this.removable?i.x`
              <bzl-icon
                part="remove-button"
                class="tag__remove"
                name="improper-outline"
                tabindex="-1"
                @click=${this.handleRemoveClick}
              ></bzl-icon>
            `:""}
      </span>
    `}};xe.styles=[l.$,ze],xe.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.n)({reflect:!0})],xe.prototype,"color",2),(0,c.Cc)([(0,s.n)({reflect:!0})],xe.prototype,"size",2),(0,c.Cc)([(0,s.n)({reflect:!0})],xe.prototype,"variant",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],xe.prototype,"pill",2),(0,c.Cc)([(0,s.n)({type:Boolean})],xe.prototype,"removable",2),(0,c.Cc)([(0,s.e)('slot[name="prefix"]')],xe.prototype,"prefixSlot",2);var _e=xe;xe.define("bzl-tag");var we=me.v;me.v.define("bzl-spin");var ke=pe;pe.define("bzl-step");var Ce=i.i`
  :host {
    display: inline-block;
    line-height: 0;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: center;
    --toggle-size: var(--bzl-toggle-size-medium);
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-input-font-size-medium);
    font-weight: var(--bzl-input-font-weight);
    color: var(--bzl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio__checked-icon {
    display: block;
    width: var(--bzl-spacing-3);
    height: var(--bzl-spacing-3);
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-neutral-0);
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--bzl-toggle-border-width) var(--bzl-color-neutral-400);
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-neutral-0);
    box-sizing: border-box;
    color: transparent;
    transition:
      var(--bzl-transition-fast) border-color,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover (unchecked: border only) */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--bzl-color-primary-700);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-primary-600);
    background-color: var(--bzl-color-primary-600);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--bzl-color-primary-700);
    background-color: var(--bzl-color-primary-700);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Disabled */
  .radio--disabled {
    cursor: not-allowed;
  }

  .radio--disabled .radio__control {
    border-color: var(--bzl-color-neutral-400);
    background-color: var(--bzl-color-neutral-200);
  }

  .radio--disabled.radio--checked .radio__control {
    background-color: var(--bzl-color-neutral-400);
  }

  .radio--disabled .radio__label {
    color: var(--bzl-color-neutral-600);
  }

  .radio__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    line-height: var(--bzl-line-height-dense);
    margin-inline-start: var(--bzl-spacing-4);
    user-select: none;
    -webkit-user-select: none;
  }
`,$e=class extends s.X{constructor(){super(),this.checked=!1,this.hasFocus=!1,this.disabled=!1,this.handleBlur=()=>{this.hasFocus=!1,this.emit("bzl-blur")},this.handleClick=()=>{this.disabled||(this.checked=!0)},this.handleFocus=()=>{this.hasFocus=!0,this.emit("bzl-focus")},this.addEventListener("blur",this.handleBlur),this.addEventListener("click",this.handleClick),this.addEventListener("focus",this.handleFocus)}connectedCallback(){super.connectedCallback(),this.setInitialAttributes()}setInitialAttributes(){this.setAttribute("role","radio"),this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.setAttribute("tabindex",this.checked?"0":"-1")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return i.x`
      <span
        part="base"
        class=${(0,n.e)({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus})}
      >
        <span part="${"control"+(this.checked?" control--checked":"")}" class="radio__control">
          ${this.checked?i.x`<span part="checked-icon" class="radio__checked-icon"></span>`:""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `}};$e.styles=[l.$,Ce],(0,c.Cc)([(0,s.r)()],$e.prototype,"checked",2),(0,c.Cc)([(0,s.r)()],$e.prototype,"hasFocus",2),(0,c.Cc)([(0,s.n)()],$e.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],$e.prototype,"disabled",2),(0,c.Cc)([(0,Mt.w)("checked")],$e.prototype,"handleCheckedChange",1),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],$e.prototype,"handleDisabledChange",1);var Se=$e;$e.define("bzl-radio");var Ee=i.i`
  :host {
    display: inline-block;
  }

  .radio-group {
    display: inline-flex;
    gap: var(--bzl-spacing-8);
  }
`,Ae=i.i`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    margin-bottom: var(--bzl-spacing-1);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--bzl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--bzl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--bzl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--bzl-input-required-content);
    margin-inline-start: var(--bzl-input-required-content-offset);
    color: var(--bzl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--bzl-input-help-text-color);
    margin-top: var(--bzl-spacing-1);
    line-height: var(--bzl-input-help-text-line-height);
    padding-left: var(--bzl-spacing-4);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--bzl-spacing-2);
  }
`,Pe=class extends s.X{constructor(){super(...arguments),this.name="option",this.value=""}getAllRadios(){return[...this.querySelectorAll("bzl-radio")]}handleRadioClick(t){const e=t.target.closest("bzl-radio"),o=this.getAllRadios(),i=this.value;e&&!e.disabled&&(this.value=e.value,o.forEach(t=>t.checked=t===e),this.value!==i&&(this.emit("bzl-change"),this.emit("bzl-input")))}handleKeyDown(t){var e;if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key))return;const o=this.getAllRadios().filter(t=>!t.disabled),i=null!=(e=o.find(t=>t.checked))?e:o[0],r=" "===t.key?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,a=this.value;let n=o.indexOf(i)+r;n<0&&(n=o.length-1),n>o.length-1&&(n=0),this.getAllRadios().forEach(t=>{t.checked=!1,t.setAttribute("tabindex","-1")}),this.value=o[n].value,o[n].checked=!0,o[n].setAttribute("tabindex","0"),o[n].focus(),this.value!==a&&(this.emit("bzl-change"),this.emit("bzl-input")),t.preventDefault()}async syncRadioElements(){const t=this.getAllRadios();await Promise.all(t.map(async t=>{await t.updateComplete,t.checked=t.value===this.value})),t.length>0&&!t.some(t=>t.checked)&&t[0].setAttribute("tabindex","0")}syncRadios(){customElements.get("bzl-radio")?this.syncRadioElements():customElements.whenDefined("bzl-radio").then(()=>this.syncRadios())}updateCheckedRadio(){this.getAllRadios().forEach(t=>t.checked=t.value===this.value)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}render(){return i.x`
      <div part="base" class="radio-group">
        <slot @slotchange=${this.syncRadios} @click=${this.handleRadioClick} @keydown=${this.handleKeyDown}></slot>
      </div>
    `}};Pe.styles=[l.$,Ae,Ee],(0,c.Cc)([(0,s.e)("slot:not([name])")],Pe.prototype,"defaultSlot",2),(0,c.Cc)([(0,s.n)()],Pe.prototype,"name",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Pe.prototype,"value",2),(0,c.Cc)([(0,Mt.w)("value")],Pe.prototype,"handleValueChange",1);var Te=Pe;Pe.define("bzl-radio-group");var De=i.i`
  :host {
    display: block;
  }

  /** The popup */
  .select {
    flex: 1 1 auto;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    line-height: var(--bzl-line-height-2x-loose);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    /* Medium size styles (default) - previously .select--medium */
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-small);
    box-sizing: border-box;
    min-height: var(--bzl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--bzl-input-spacing-medium);
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--bzl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  .select__display-input::placeholder {
    color: var(--bzl-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--bzl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--bzl-input-padding-leftright);
    gap: 4px;
    /* padding-block: 5px; */
  }

  .select__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-1);
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-900);
    border: none;
    border-radius: var(--bzl-border-radius-small);
    padding-inline: var(--bzl-spacing-4);
    padding-block: var(--bzl-spacing-1);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-spacing-7);
    cursor: pointer;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color;
  }

  .select__tag:hover {
    background-color: var(--bzl-color-neutral-300);
  }

  /* “+n” 汇总 Tag，仅展示不可移除 */
  .select__tag--collapse {
    cursor: default;
  }

  .select__tag--collapse:hover {
    background-color: var(--bzl-color-neutral-200);
  }

  .select--disabled .select__tag {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: var(--bzl-color-neutral-700);
    width: 12px;
    height: 12px;
    transition: var(--bzl-transition-fast) color;
  }

  .select__tag-remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  .select__tag-remove:focus {
    outline: none;
  }

  /* NOTE: Size-specific tag styles removed - currently only supports medium size.
     To re-enable size support:
     - Restore .select__tag--small, .select__tag--medium, .select__tag--large classes
     - Apply them conditionally in select.component.ts render() method */

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .select--standard:not(.select--disabled):hover .select__combobox {
    border-color: var(--bzl-color-primary-700);
  }

  .select--standard:not(.select--disabled):hover .select__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .select--standard:not(.select--disabled).select--open .select__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    color: var(--bzl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: var(--bzl-shadow-focus);
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .select--standard .select__combobox {
    border-color: var(--bzl-color-danger-600);
  }
  :host([data-user-invalid]) .select--standard.select--focused:not(.select--disabled) .select__combobox,
  :host([data-user-invalid]) .select--standard.select--open:not(.select--disabled) .select__combobox {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }
  :host([data-user-invalid]) .select--standard:not(.select--disabled):hover .select__expand-icon {
    color: var(--bzl-color-danger-600);
  }

  :host([data-user-invalid]) .select--standard.select--open:not(.select--disabled) .select__expand-icon {
    color: var(--bzl-color-danger-600);
  }

  /* Size styles - currently only medium size is supported (applied as default above).
     To re-enable size support:
     1. Restore .select--small, .select--medium, .select--large classes below
     2. Move medium styles from .select__combobox to .select--medium .select__combobox
     3. Add size property back to select.component.ts
     4. Add size classes to classMap in render() method */

  /* Medium size spacing for prefix and multiple mode */
  .select__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    /* 使用较小 padding 兼顾：1) 选择后高度不突变 2) tag 换行时与边框有间距 */
    padding-block: 5px;
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
  }

  /* NOTE: Suffix styles removed. To re-enable:
     - Restore .select__suffix styles (same as .select__prefix)
     - Restore .select__suffix::slotted(*) with margin-inline-start: var(--bzl-spacing-small)
     - Add suffix slot back to select.component.ts render() method */

  /* Clear button */
  .select__clear {
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
    display: none;
    /* Medium size spacing */
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .select__combobox:hover .select__clear {
    display: inline-flex;
  }

  .select__combobox:hover .select__clear ~ .select__expand-icon {
    display: none;
  }

  .select__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--bzl-color-neutral-600);
    transition: var(--bzl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-medium);
    font-weight: var(--bzl-font-weight-normal);
    box-shadow: var(--bzl-shadow-neutral-light);
    background: var(--bzl-panel-background-color);
    border: solid var(--bzl-panel-border-width) var(--bzl-color-neutral-300);
    border-radius: var(--bzl-border-radius-regular);
    padding: var(--bzl-spacing-2);
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    /* 默认最大高度约 5.5 个选项，选项高度 = line-height + padding-block */
    max-height: min(
      var(--auto-size-available-height),
      calc((var(--bzl-line-height-dense) + var(--bzl-spacing-5) * 2) * 5.5 + var(--bzl-spacing-2) * 2)
    );
  }

  .select__listbox ::slotted(bzl-divider) {
    --spacing: var(--bzl-spacing-4);
  }

  .select__listbox ::slotted(small) {
    display: block;
    font-size: var(--bzl-font-size-small);
    font-weight: var(--bzl-font-weight-semibold);
    color: var(--bzl-color-neutral-500);
    padding-block: var(--bzl-spacing-2);
    padding-inline: var(--bzl-spacing-8);
  }

  .select__listbox ::slotted(bzl-option:not(:last-of-type)) {
    margin-block-end: var(--bzl-spacing-1);
  }
`,Fe=new Set;function Oe(t){if(Fe.add(t),!document.documentElement.classList.contains("bzl-scroll-lock")){const t=function(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}()+function(){const t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,""));return isNaN(t)||!t?0:t}();let e=getComputedStyle(document.documentElement).scrollbarGutter;e&&"auto"!==e||(e="stable"),t<2&&(e=""),document.documentElement.style.setProperty("--bzl-scroll-lock-gutter",e),document.documentElement.classList.add("bzl-scroll-lock"),document.documentElement.style.setProperty("--bzl-scroll-lock-size",`${t}px`)}}function Le(t){Fe.delete(t),0===Fe.size&&(document.documentElement.classList.remove("bzl-scroll-lock"),document.documentElement.style.removeProperty("--bzl-scroll-lock-size"))}var Be=class extends ie.i{constructor(t){if(super(t),this.it=i.E,t.type!==ie.t.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===i.E||null==t)return this._t=void 0,this.it=t;if(t===i.T)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}};Be.directiveName="unsafeHTML",Be.resultType=1;var Ie=(0,ie.e)(Be),Ve=class extends s.X{constructor(){super(...arguments),this.typeToSelectString="",this.hasFocus=!1,this.displayLabel="",this.selectedOptions=[],this.name="",this.value="",this.placeholder="",this.multiple=!1,this.maxOptionsVisible=2,this.collapseTags=!1,this.disabled=!1,this.clearable=!1,this.open=!1,this.hoist=!1,this.placement="bottom",this.getTag=t=>i.x`
    <span part="tag__content" class="select__tag-content">${t.getTextLabel()}</span>
  `,this.handleDocumentFocusIn=t=>{const e=t.composedPath();this&&!e.includes(this)&&this.hide()},this.handleDocumentKeyDown=t=>{const e=t.target,o=null!==e.closest(".select__clear"),i=null!==e.closest("bzl-icon-button"),r=null!==e.closest(".select__tag-remove");if(!(o||i||r)){if("Escape"===t.key&&this.open&&!this.closeWatcher&&(t.preventDefault(),t.stopPropagation(),this.hide(),this.displayInput.focus({preventScroll:!0})),"Enter"===t.key||" "===t.key&&""===this.typeToSelectString)return t.preventDefault(),t.stopImmediatePropagation(),this.open?void(this.currentOption&&!this.currentOption.disabled&&(this.multiple?this.toggleOptionSelection(this.currentOption):this.setSelectedOptions(this.currentOption),this.updateComplete.then(()=>{this.emit("bzl-input"),this.emit("bzl-change")}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))):void this.show();if(["ArrowUp","ArrowDown","Home","End"].includes(t.key)){const e=this.getAllOptions(),o=this.currentOption?e.indexOf(this.currentOption):-1;let i=Math.max(0,o);if(t.preventDefault(),!this.open&&(this.show(),this.currentOption))return;"ArrowDown"===t.key?(i=o+1,i>e.length-1&&(i=0)):"ArrowUp"===t.key?(i=o-1,i<0&&(i=e.length-1)):"Home"===t.key?i=0:"End"===t.key&&(i=e.length-1),this.setCurrentOption(e[i])}if(t.key&&1===t.key.length||"Backspace"===t.key){const e=this.getAllOptions();if(t.metaKey||t.ctrlKey||t.altKey)return;if(!this.open){if("Backspace"===t.key)return;this.show()}t.stopPropagation(),t.preventDefault(),clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=window.setTimeout(()=>this.typeToSelectString="",1e3),"Backspace"===t.key?this.typeToSelectString=this.typeToSelectString.slice(0,-1):this.typeToSelectString+=t.key.toLowerCase();for(const t of e)if(t.getTextLabel().toLowerCase().startsWith(this.typeToSelectString)){this.setCurrentOption(t);break}}}},this.handleDocumentMouseDown=t=>{const e=t.composedPath();this&&!e.includes(this)&&this.hide()}}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.handleDefaultSlotChange()})}addOpenListeners(){var t;document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown),this.getRootNode()!==document&&this.getRootNode().addEventListener("focusin",this.handleDocumentFocusIn),"CloseWatcher"in window&&(null==(t=this.closeWatcher)||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.open&&(this.hide(),this.displayInput.focus({preventScroll:!0}))})}removeOpenListeners(){var t;document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),this.getRootNode()!==document&&this.getRootNode().removeEventListener("focusin",this.handleDocumentFocusIn),null==(t=this.closeWatcher)||t.destroy()}handleFocus(){this.hasFocus=!0,this.displayInput.setSelectionRange(0,0),this.emit("bzl-focus")}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleComboboxMouseDown(t){const e=t.composedPath(),o=e.some(t=>t instanceof Element&&"bzl-icon-button"===t.tagName.toLowerCase()),i=e.some(t=>{var e;return t instanceof Element&&(null==(e=t.classList)?void 0:e.contains("select__tag-remove"))});this.disabled||o||i||(t.preventDefault(),this.displayInput.focus({preventScroll:!0}),this.open=!this.open)}handleComboboxKeyDown(t){"Tab"!==t.key&&(t.stopPropagation(),this.handleDocumentKeyDown(t))}handleClearClick(t){t.stopPropagation(),""!==this.value&&(this.setSelectedOptions([]),this.displayInput.focus({preventScroll:!0}),this.updateComplete.then(()=>{this.emit("bzl-clear"),this.emit("bzl-input"),this.emit("bzl-change")}))}handleClearMouseDown(t){t.stopPropagation(),t.preventDefault()}handleOptionClick(t){const e=t.target.closest("bzl-option"),o=this.value;e&&!e.disabled&&(this.multiple?this.toggleOptionSelection(e):this.setSelectedOptions(e),this.updateComplete.then(()=>this.displayInput.focus({preventScroll:!0})),this.value!==o&&this.updateComplete.then(()=>{this.emit("bzl-input"),this.emit("bzl-change")}),this.multiple||(this.hide(),this.displayInput.focus({preventScroll:!0})))}handleDefaultSlotChange(){customElements.get("bzl-option")||customElements.whenDefined("bzl-option").then(()=>this.handleDefaultSlotChange());const t=this.getAllOptions(),e=Array.isArray(this.value)?this.value:[this.value],o=[];t.forEach(t=>o.push(t.value)),this.setSelectedOptions(t.filter(t=>e.includes(t.value)))}handleTagRemove(t,e){t&&"function"==typeof t.stopPropagation&&t.stopPropagation(),this.disabled||(this.toggleOptionSelection(e,!1),this.updateComplete.then(()=>{this.emit("bzl-input"),this.emit("bzl-change")}))}getAllOptions(){return[...this.querySelectorAll("bzl-option")]}setCurrentOption(t){this.getAllOptions().forEach(t=>{t.current=!1,t.tabIndex=-1}),t?(this.currentOption=t,t.current=!0,t.tabIndex=0,t.focus()):this.currentOption=void 0}setSelectedOptions(t){const e=this.getAllOptions(),o=Array.isArray(t)?t:[t];e.forEach(t=>t.selected=!1),o.length&&o.forEach(t=>t.selected=!0),this.selectionChanged()}toggleOptionSelection(t,e){t.selected=!0===e||!1===e?e:!t.selected,this.selectionChanged()}selectionChanged(){var t,e,o;const i=this.getAllOptions();if(this.selectedOptions=i.filter(t=>t.selected),this.multiple)this.value=this.selectedOptions.map(t=>t.value),this.displayLabel="";else{const i=this.selectedOptions[0];this.value=null!=(t=null==i?void 0:i.value)?t:"",this.displayLabel=null!=(o=null==(e=null==i?void 0:i.getTextLabel)?void 0:e.call(i))?o:""}}get tags(){if(!this.multiple)return[];const t=this.selectedOptions.length,e=this.collapseTags&&this.maxOptionsVisible>0?this.maxOptionsVisible:t,o=Math.min(e,t),r=[];for(let t=0;t<o&&t<this.selectedOptions.length;t++){const e=this.selectedOptions[t],o=this.getTag(e,t),a="string"==typeof o?i.x`${Ie(o)}`:o;r.push(i.x`
        <div part="tag" class="select__tag">
          ${a}
          <button
            part="tag__remove-button"
            class="select__tag-remove"
            type="button"
            aria-label="Remove"
            @click=${t=>{t.stopPropagation(),this.handleTagRemove(t,e)}}
          >
            <bzl-icon name="improper-outline" aria-hidden="true"></bzl-icon>
          </button>
        </div>
      `)}return this.collapseTags&&this.maxOptionsVisible>0&&t>this.maxOptionsVisible&&r.push(i.x`
        <div part="tag" class="select__tag select__tag--collapse">
          <span part="tag__content" class="select__tag-content">+${t-this.maxOptionsVisible}</span>
        </div>
      `),r}handleInvalid(){}handleDisabledChange(){this.disabled&&(this.open=!1,this.handleOpenChange())}handleValueChange(){const t=this.getAllOptions(),e=Array.isArray(this.value)?this.value:[this.value];this.setSelectedOptions(t.filter(t=>e.includes(t.value)))}async handleOpenChange(){if(this.open&&!this.disabled){this.setCurrentOption(null),this.emit("bzl-show"),this.addOpenListeners(),await Ot(this),this.listbox.hidden=!1,this.popup.active=!0;const{keyframes:t,options:e}=Nt(this,"select.show",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.currentOption&&function(t,e,o="vertical",i="smooth"){const r=function(t,e){return{top:Math.round(t.getBoundingClientRect().top-e.getBoundingClientRect().top),left:Math.round(t.getBoundingClientRect().left-e.getBoundingClientRect().left)}}(t,e),a=r.top+e.scrollTop,n=r.left+e.scrollLeft,l=e.scrollLeft,s=e.scrollLeft+e.offsetWidth,c=e.scrollTop,d=e.scrollTop+e.offsetHeight;"horizontal"!==o&&"both"!==o||(n<l?e.scrollTo({left:n,behavior:i}):n+t.clientWidth>s&&e.scrollTo({left:n-e.offsetWidth+t.clientWidth,behavior:i})),"vertical"!==o&&"both"!==o||(a<c?e.scrollTo({top:a,behavior:i}):a+t.clientHeight>d&&e.scrollTo({top:a-e.offsetHeight+t.clientHeight,behavior:i}))}(this.currentOption,this.listbox,"vertical","auto"),this.emit("bzl-after-show")}else{this.emit("bzl-hide"),this.removeOpenListeners(),await Ot(this);const{keyframes:t,options:e}=Nt(this,"select.hide",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.listbox.hidden=!0,this.popup.active=!1,this.emit("bzl-after-hide")}}async show(){if(!this.open&&!this.disabled)return this.open=!0,Lt(this,"bzl-after-show");this.open=!1}async hide(){if(this.open&&!this.disabled)return this.open=!1,Lt(this,"bzl-after-hide");this.open=!1}focus(t){this.displayInput.focus(t)}blur(){this.displayInput.blur()}render(){const t=this.clearable&&!this.disabled&&this.value.length>0,e=this.multiple?this.selectedOptions.length>0:!!this.value,o=!!this.placeholder&&!e;return i.x`
      <bzl-popup
        class=${(0,n.e)({select:!0,"select--standard":!0,"select--open":this.open,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--focused":this.hasFocus,"select--placeholder-visible":o,"select--top":"top"===this.placement,"select--bottom":"bottom"===this.placement})}
        placement=${this.placement}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        distance=${2}
        sync="width"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <div
          part="combobox"
          class="select__combobox"
          slot="anchor"
          @keydown=${this.handleComboboxKeyDown}
          @mousedown=${this.handleComboboxMouseDown}
        >
          <slot part="prefix" name="prefix" class="select__prefix"></slot>

          <input
            part="display-input"
            class="select__display-input"
            type="text"
            placeholder=${this.placeholder}
            .disabled=${this.disabled}
            .value=${this.displayLabel}
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            readonly
            aria-controls="listbox"
            aria-expanded=${this.open?"true":"false"}
            aria-disabled=${this.disabled?"true":"false"}
            tabindex="0"
            @focus=${this.handleFocus}
            @blur=${this.handleBlur}
          />

          ${this.multiple?i.x`<div part="tags" class="select__tags">${this.tags}</div>`:""}

          <input
            class="select__value-input"
            type="text"
            ?disabled=${this.disabled}
            .value=${Array.isArray(this.value)?this.value.join(", "):this.value}
            tabindex="-1"
            aria-hidden="true"
            @focus=${()=>this.focus()}
            @invalid=${this.handleInvalid}
          />

          ${t?i.x`
                <button
                  part="clear-button"
                  class="select__clear"
                  type="button"
                  aria-label="Clear"
                  @mousedown=${this.handleClearMouseDown}
                  @click=${this.handleClearClick}
                  tabindex="-1"
                >
                  <slot name="clear-icon">
                    <bzl-icon name="close-face1"></bzl-icon>
                  </slot>
                </button>
              `:""}

          <!-- NOTE: Suffix slot removed. To re-enable:
               - Add back: <slot name="suffix" part="suffix" class="select__suffix"></slot>
               - Restore @slot suffix and @csspart suffix in JSDoc
               - Restore .select__suffix styles in select.styles.ts -->

          <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
            <bzl-icon name="down-outline"></bzl-icon>
          </slot>
        </div>

        <div
          id="listbox"
          aria-expanded=${this.open?"true":"false"}
          part="listbox"
          class="select__listbox"
          tabindex="-1"
          @mouseup=${this.handleOptionClick}
          @slotchange=${this.handleDefaultSlotChange}
        >
          <slot></slot>
        </div>
      </bzl-popup>
    `}};Ve.styles=[l.$,De],Ve.dependencies={"bzl-icon":he.K,"bzl-popup":Tt},(0,c.Cc)([(0,s.e)(".select")],Ve.prototype,"popup",2),(0,c.Cc)([(0,s.e)(".select__combobox")],Ve.prototype,"combobox",2),(0,c.Cc)([(0,s.e)(".select__display-input")],Ve.prototype,"displayInput",2),(0,c.Cc)([(0,s.e)(".select__value-input")],Ve.prototype,"valueInput",2),(0,c.Cc)([(0,s.e)(".select__listbox")],Ve.prototype,"listbox",2),(0,c.Cc)([(0,s.r)()],Ve.prototype,"hasFocus",2),(0,c.Cc)([(0,s.r)()],Ve.prototype,"displayLabel",2),(0,c.Cc)([(0,s.r)()],Ve.prototype,"currentOption",2),(0,c.Cc)([(0,s.r)()],Ve.prototype,"selectedOptions",2),(0,c.Cc)([(0,s.n)()],Ve.prototype,"name",2),(0,c.Cc)([(0,s.n)({attribute:"value"})],Ve.prototype,"value",2),(0,c.Cc)([(0,s.n)()],Ve.prototype,"placeholder",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ve.prototype,"multiple",2),(0,c.Cc)([(0,s.n)({attribute:"max-options-visible",type:Number})],Ve.prototype,"maxOptionsVisible",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"collapse-tags"})],Ve.prototype,"collapseTags",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ve.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Ve.prototype,"clearable",2),(0,c.Cc)([(0,s.r)()],Ve.prototype,"open",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Ve.prototype,"hoist",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Ve.prototype,"placement",2),(0,c.Cc)([(0,s.n)({attribute:!1})],Ve.prototype,"getTag",2),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],Ve.prototype,"handleDisabledChange",1),(0,c.Cc)([(0,Mt.w)("value",{waitUntilFirstUpdate:!0})],Ve.prototype,"handleValueChange",1),(0,c.Cc)([(0,Mt.w)("open",{waitUntilFirstUpdate:!0})],Ve.prototype,"handleOpenChange",1),Rt("select.show",{keyframes:[{opacity:0,transform:"scale(0.9, 0)"},{opacity:1,transform:"scale(1, 1)"}],options:{duration:250,easing:"ease"}}),Rt("select.hide",{keyframes:[{opacity:1,transform:"scale(1, 1)"},{opacity:0,transform:"scale(0.9, 0)"}],options:{duration:250,easing:"ease"}});var Re=Ve;Ve.define("bzl-select");var Ne=i.i`
  :host {
    --max-width: 320px;
    --hide-delay: 100ms;
    --show-delay: 100ms;

    display: contents;
  }

  .popover {
    --arrow-size: var(--bzl-popover-arrow-size);
    --arrow-color: var(--bzl-popover-background-color);
  }

  .popover::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .popover[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .popover[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .popover[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .popover[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .popover__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--bzl-popover-border-radius);
    background-color: var(--bzl-popover-background-color);
    box-shadow: var(--bzl-popover-shadow);
    color: var(--bzl-popover-color);
    font-family: var(--bzl-popover-font-family);
    font-size: var(--bzl-popover-font-size);
    font-weight: var(--bzl-popover-font-weight);
    line-height: var(--bzl-popover-line-height);
    padding: var(--bzl-popover-padding);
    box-sizing: border-box;
  }
`,Me=class extends s.X{constructor(){super(),this.hoverTimeout=0,this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="click",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.shouldHandleAutoTrigger()&&this.hide()},this.handleFocus=()=>{this.hasTrigger("focus")&&this.shouldHandleAutoTrigger()&&this.show()},this.handleClick=t=>{this.hasTrigger("click")&&this.shouldHandleAutoTrigger()&&(t.composedPath().includes(this.body)||(this.open?this.hide():this.show()))},this.handleMouseOver=()=>{if(this.hasTrigger("hover")&&this.shouldHandleAutoTrigger()){const t=Ft(getComputedStyle(this).getPropertyValue("--show-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),t)}},this.handleMouseOut=()=>{if(this.hasTrigger("hover")&&this.shouldHandleAutoTrigger()){const t=Ft(getComputedStyle(this).getPropertyValue("--hide-delay"));clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),t)}},this.handleDocumentMouseDown=t=>{t.composedPath().includes(this)||this.hide()},this.handleDocumentKeyDown=t=>{"Escape"===t.key&&this.open&&!this.closeWatcher&&(t.stopPropagation(),this.hide())},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}get computedDistance(){const t=getComputedStyle(this).getPropertyValue("--bzl-popover-arrow-size");return t&&"0px"!==t&&"0"!==t?this.distance+8:this.distance}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners()}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition(),this.disabled||this.addOpenListeners())}hasTrigger(t){return this.trigger.trim()===t}shouldHandleAutoTrigger(){return!this.hasTrigger("manual")}addOpenListeners(){var t;document.addEventListener("keydown",this.handleDocumentKeyDown),this.hasTrigger("click")&&document.addEventListener("mousedown",this.handleDocumentMouseDown),"CloseWatcher"in window&&(null==(t=this.closeWatcher)||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()})}removeOpenListeners(){var t;document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),null==(t=this.closeWatcher)||t.destroy()}async handleOpenChange(){if(this.open){if(this.disabled)return void(this.open=!1);this.emit("bzl-show"),this.addOpenListeners(),await Ot(this.body),this.body.hidden=!1,this.popup.active=!0;const{keyframes:t,options:e}=Nt(this,"popover.show",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.popup.reposition(),this.emit("bzl-after-show")}else{this.emit("bzl-hide"),this.removeOpenListeners(),await Ot(this.body);const{keyframes:t,options:e}=Nt(this,"popover.hide",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.popup.active=!1,this.body.hidden=!0,this.emit("bzl-after-hide")}}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Lt(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Lt(this,"bzl-after-hide")}render(){return i.x`
      <bzl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${(0,n.e)({popover:!0,"popover--open":this.open})}
        placement=${this.placement}
        arrow-placement=${this.placement.includes("start")?"start":this.placement.includes("end")?"end":void 0}
        distance=${this.computedDistance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-haspopup="dialog" aria-expanded=${this.open?"true":"false"}></slot>

        ${""}
        <div part="body" class="popover__body" role="dialog">
          <slot name="content">${this.content}</slot>
        </div>
      </bzl-popup>
    `}};Me.styles=[l.$,Ne],Me.dependencies={"bzl-popup":Tt},(0,c.Cc)([(0,s.e)("slot:not([name])")],Me.prototype,"defaultSlot",2),(0,c.Cc)([(0,s.e)(".popover__body")],Me.prototype,"body",2),(0,c.Cc)([(0,s.e)("bzl-popup")],Me.prototype,"popup",2),(0,c.Cc)([(0,s.n)()],Me.prototype,"content",2),(0,c.Cc)([(0,s.n)()],Me.prototype,"placement",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Me.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Number})],Me.prototype,"distance",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Me.prototype,"open",2),(0,c.Cc)([(0,s.n)({type:Number})],Me.prototype,"skidding",2),(0,c.Cc)([(0,s.n)()],Me.prototype,"trigger",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Me.prototype,"hoist",2),(0,c.Cc)([(0,Mt.w)("open",{waitUntilFirstUpdate:!0})],Me.prototype,"handleOpenChange",1),(0,c.Cc)([(0,Mt.w)(["content","distance","hoist","placement","skidding"])],Me.prototype,"handleOptionsChange",1),(0,c.Cc)([(0,Mt.w)("disabled")],Me.prototype,"handleDisabledChange",1),Rt("popover.show",{keyframes:[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],options:{duration:150,easing:"ease"}}),Rt("popover.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.95)"}],options:{duration:100,easing:"ease"}});var qe=Me;Me.define("bzl-popover");var je=Tt;Tt.define("bzl-popup");var We=i.i`
  :host {
    display: inline-block;
  }

  .logo-container {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.2s ease;
  }

  /* 支持不同的 logo 类型样式 */
  :host([type='fill']) .logo-container {
    /* fill 类型的特殊样式 */
  }

  :host([type='line']) .logo-container {
    /* line 类型的特殊样式 */
  }

  :host([type='text']) .logo-container {
    /* text 类型的特殊样式 */
    padding-top: calc(124 / 700 * 100%);
  }

  /* 支持不同的主题样式 */
  :host([theme='dark']) .logo-container {
    /* dark 主题的特殊样式 */
  }

  :host([theme='light']) .logo-container {
    /* light 主题的特殊样式 */
  }
`,He=class extends s.X{constructor(){super(...arguments),this.type="fill",this.theme="default",this.size=40}get backgroundImage(){return`https://static.zhipin.com/assets/bzl-design/components/logo/${this.type}-${this.theme}.svg`}get height(){return"text"===this.type?"auto":`${this.size}px`}render(){return i.x`
      <div
        part="base"
        class="logo-container"
        style="width: ${this.size}px; height: ${this.height}; background-image: url('${this.backgroundImage}')"
      ></div>
    `}};He.styles=[l.$,We],(0,c.Cc)([(0,s.n)({reflect:!0})],He.prototype,"type",2),(0,c.Cc)([(0,s.n)({reflect:!0})],He.prototype,"theme",2),(0,c.Cc)([(0,s.n)({type:Number,reflect:!0})],He.prototype,"size",2);var Ue=He;He.define("bzl-logo");var Ke=i.i`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    font-weight: var(--bzl-font-weight-normal);
    line-height: var(--bzl-line-height-dense);
    letter-spacing: var(--bzl-letter-spacing-normal);
    color: var(--bzl-color-neutral-900);
    background-color: var(--bzl-color-neutral-0);
    padding: var(--bzl-spacing-5) var(--bzl-scene-padding-11);
    border-radius: var(--bzl-border-radius-small);
    transition: var(--bzl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
    color: var(--bzl-color-neutral-1000);
  }

  .option--current:not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
  }

  .option--current.option--disabled {
    background-color: var(--bzl-color-primary-600);
    color: var(--bzl-color-neutral-0);
    opacity: 1;
  }

  .option--selected:not(.option--current):not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--bzl-line-height-dense);
  }

  .option--selected:not(.option--disabled) .option__label {
    color: var(--bzl-color-primary-600);
  }

  .option .option__check {
    flex: 0 0 auto;
    visibility: hidden;
    color: var(--bzl-color-primary-600);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option--selected:not(.option--disabled) .option__prefix {
    color: var(--bzl-color-primary-600);
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-4);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`,Xe=class extends s.X{constructor(){super(...arguments),this.isInitialized=!1,this.current=!1,this.selected=!1,this.hasHover=!1,this.value="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false")}handleDefaultSlotChange(){this.isInitialized?customElements.whenDefined("bzl-select").then(()=>{const t=this.closest("bzl-select");t&&t.handleDefaultSlotChange()}):this.isInitialized=!0}handleMouseEnter(){this.hasHover=!0}handleMouseLeave(){this.hasHover=!1}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleValueChange(){"string"!=typeof this.value&&(this.value=String(this.value)),this.value.includes(" ")&&(console.error("选项的值不能包含空格。所有空格已被替换为下划线。",this),this.value=this.value.replace(/ /g,"_"))}getTextLabel(){const t=this.childNodes;let e="";return[...t].forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&(t.hasAttribute("slot")||(e+=t.textContent)),t.nodeType===Node.TEXT_NODE&&(e+=t.textContent)}),e.trim()}isMultipleSelect(){const t=this.closest("bzl-select");return null==t?void 0:t.multiple}render(){const t=this.isMultipleSelect();return i.x`
      <div
        part="base"
        class=${(0,n.e)({option:!0,"option--current":this.current,"option--disabled":this.disabled,"option--selected":this.selected,"option--hover":this.hasHover})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        ${t?i.x`<bzl-icon class="option__check" name="right-outline"></bzl-icon>`:""}
      </div>
    `}};Xe.styles=[l.$,Ke],Xe.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.e)(".option__label")],Xe.prototype,"defaultSlot",2),(0,c.Cc)([(0,s.r)()],Xe.prototype,"current",2),(0,c.Cc)([(0,s.r)()],Xe.prototype,"selected",2),(0,c.Cc)([(0,s.r)()],Xe.prototype,"hasHover",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Xe.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Xe.prototype,"disabled",2),(0,c.Cc)([(0,Mt.w)("disabled")],Xe.prototype,"handleDisabledChange",1),(0,c.Cc)([(0,Mt.w)("selected")],Xe.prototype,"handleSelectedChange",1),(0,c.Cc)([(0,Mt.w)("value")],Xe.prototype,"handleValueChange",1);var Ze=Xe;Xe.define("bzl-option");var Ye=i.i`
  :host {
    display: inline-block;
  }

  .pagination {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
    font-family: var(--bzl-input-font-family);
    color: var(--bzl-color-gray-700);
  }

  .pagination__list {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
  }

  .pagination__arrow {
    width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    border-radius: var(--bzl-border-radius-regular);
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    color: var(--bzl-color-gray-700);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination__arrow-icon {
    font-size: var(--bzl-font-size-medium);
  }

  .pagination__arrow-icon.prev-icon {
    transform: translate(var(--bzl-spacing-1), -1px);
  }
  .pagination__arrow-icon.next-icon {
    transform: translate(calc(var(--bzl-spacing-1) * -1), -1px);
  }

  .pagination__arrow:hover:not(.pagination__arrow--disabled) {
    background-color: var(--bzl-color-gray-100);
  }

  .pagination__arrow--gray-bg:hover:not(.pagination__arrow--disabled) {
    background-color: var(--bzl-color-neutral-0);
  }

  .pagination__arrow--disabled {
    cursor: not-allowed;
    color: var(--bzl-color-gray-500);
  }

  .pagination__item {
    min-width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    padding: 0 var(--bzl-spacing-2);
    border-radius: var(--bzl-border-radius-regular);
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-2x-loose);
    text-align: center;
  }

  .pagination__item:hover:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-gray-200);
  }

  .pagination__item--bg:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-neutral-0);
  }

  .pagination__item--bg:hover:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-gray-300);
  }

  .pagination__item--active {
    background-color: var(--bzl-color-boss-600);
    color: var(--bzl-color-neutral-0);
  }

  .pagination__ellipsis {
    min-width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    padding: 0 var(--bzl-spacing-2);
    border-radius: var(--bzl-border-radius-regular);
    background-color: transparent;
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-large);
    line-height: var(--bzl-line-height-2x-loose);
    text-align: center;
  }

  .pagination--simple {
    gap: var(--bzl-spacing-2);
  }

  .pagination__simple-center {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
    color: var(--bzl-color-gray-600);
  }

  .pagination--simple .pagination__arrow-icon {
    font-size: var(--bzl-font-size-small);
  }

  .pagination__simple-input {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-gray-800);
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-input-border-radius);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
  }

  .pagination__simple-input:hover {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }

  .pagination__simple-input:focus-within {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .pagination__simple-input--medium {
    width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-8);
  }

  .pagination__simple-input--large {
    width: calc(var(--bzl-spacing-10) + var(--bzl-spacing-1));
    height: var(--bzl-spacing-9);
  }

  .pagination__simple-input-control {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    text-align: center;
    -webkit-appearance: none;
  }

  .pagination__simple-input-control:focus {
    outline: none;
  }

  .pagination__simple-total {
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-gray-800);
  }

  .pagination__simple-total-number {
    margin-left: var(--bzl-spacing-2);
  }

  :host([size='large']) .pagination--simple .pagination__arrow-icon {
    font-size: var(--bzl-font-size-medium);
  }
`,Ge=class extends s.X{constructor(){super(...arguments),this.page=1,this.total=1,this.pageSize=10,this.pagerCount=7,this.simple=!1,this.size="default",this.background=!1,this.inputValue=""}connectedCallback(){super.connectedCallback(),this.syncInputValue()}updated(t){(t.has("page")||t.has("total")||t.has("pageSize")||t.has("pageCount"))&&(this.normalizeState(),this.syncInputValue())}normalizeState(){const t=this.getPageCount();let e=this.page>0?Math.floor(this.page):1;e>t&&(e=t),e!==this.page&&(this.page=e)}syncInputValue(){this.inputValue=String(this.page||1)}emitChange(t,e){t!==this.page&&(this.page=t,this.emit("bzl-page-change",{detail:{page:t}}),"prev"===e?this.emit("bzl-prev-click",{detail:{page:t}}):"next"===e&&this.emit("bzl-next-click",{detail:{page:t}}))}getPageCount(){if("number"==typeof this.pageCount&&this.pageCount>0)return Math.floor(this.pageCount);const t=this.pageSize>0?Math.floor(this.pageSize):10,e=this.total>0?Math.floor(this.total):1;return Math.max(1,Math.ceil(e/t))}getEffectivePagerCount(){let t=this.pagerCount||7;return t<5&&(t=5),t>21&&(t=21),t%2==0&&(t+=1),t}handlePrevClick(){this.page<=1||this.emitChange(this.page-1,"prev")}handleNextClick(){this.page>=this.getPageCount()||this.emitChange(this.page+1,"next")}handleItemClick(t){this.emitChange(t)}handleInputChange(){const t=this.input.value.replace(/[^\d]/g,"");this.inputValue=t,this.input.value=t}normalizeInputPage(){const t=Number(this.inputValue),e=this.getPageCount();if(!this.inputValue||Number.isNaN(t)||t<1)return 1;const o=Math.floor(t);return o>e?e:o}handleInputKeydown(t){"Enter"===t.key&&this.commitInputPage()}handleInputBlur(){this.commitInputPage()}commitInputPage(){const t=this.normalizeInputPage();this.inputValue=String(t),this.emitChange(t)}get isPrevDisabled(){return this.page<=1}get isNextDisabled(){return this.page>=this.getPageCount()}getVisiblePages(){const t=this.getPageCount(),e=this.page,o=this.getEffectivePagerCount();if(t<=o)return Array.from({length:t},(t,e)=>e+1);const i=[],r=t=>{i[i.length-1]!==t&&i.push(t)};r(1);const a=o-2,n=Math.floor(a/2);let l=e-n,s=e+n;l<=2&&(l=2,s=l+a-1),s>=t-1&&(s=t-1,l=s-a+1,l<2&&(l=2)),l>2&&r("ellipsis");for(let t=l;t<=s;t+=1)r(t);return s<t-1&&r("ellipsis"),r(t),i}renderPrev(){return i.x`
      <button
        part="prev"
        class=${(0,n.e)({pagination__arrow:!0,"pagination__arrow--disabled":this.isPrevDisabled,"pagination__arrow--gray-bg":this.background})}
        ?disabled=${this.isPrevDisabled}
        @click=${this.handlePrevClick}
      >
        <bzl-icon class="pagination__arrow-icon prev-icon" name="leftback-outline"></bzl-icon>
      </button>
    `}renderNext(){return i.x`
      <button
        part="next"
        class=${(0,n.e)({pagination__arrow:!0,"pagination__arrow--disabled":this.isNextDisabled,"pagination__arrow--gray-bg":this.background})}
        ?disabled=${this.isNextDisabled}
        @click=${this.handleNextClick}
      >
        <bzl-icon class="pagination__arrow-icon next-icon" name="rightback-medium-outline"></bzl-icon>
      </button>
    `}renderSimple(){return i.x`
      <div part="base" class="pagination pagination--simple">
        ${this.renderPrev()}
        <div class="pagination__simple-center">
          <div
            part="simple-input"
            class=${(0,n.e)({"pagination__simple-input":!0,"pagination__simple-input--medium":"large"!==this.size,"pagination__simple-input--large":"large"===this.size})}
          >
            <input
              type="text"
              class="pagination__simple-input-control"
              .value=${re(this.inputValue)}
              @input=${this.handleInputChange}
              @keydown=${this.handleInputKeydown}
              @blur=${this.handleInputBlur}
            />
          </div>
          <span part="simple-total" class="pagination__simple-total">
            /
            <span class="pagination__simple-total-number">${this.getPageCount()}</span>
          </span>
        </div>
        ${this.renderNext()}
      </div>
    `}renderDefault(){const t=this.getVisiblePages();return i.x`
      <div part="base" class="pagination">
        ${this.renderPrev()}
        <div class="pagination__list">
          ${t.map(t=>{if("ellipsis"===t)return i.x`<span class="pagination__ellipsis">···</span>`;const e=t,o=e===this.page;return i.x`
              <button
                part=${o?"item item-active":"item"}
                class=${(0,n.e)({pagination__item:!0,"pagination__item--active":o,"pagination__item--bg":this.background})}
                @click=${()=>this.handleItemClick(e)}
              >
                ${e}
              </button>
            `})}
        </div>
        ${this.renderNext()}
      </div>
    `}render(){return this.simple?this.renderSimple():this.renderDefault()}};Ge.styles=[l.$,Ye],Ge.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.e)(".pagination__simple-input-control")],Ge.prototype,"input",2),(0,c.Cc)([(0,s.n)({type:Number,reflect:!0})],Ge.prototype,"page",2),(0,c.Cc)([(0,s.n)({type:Number})],Ge.prototype,"total",2),(0,c.Cc)([(0,s.n)({attribute:"page-size",type:Number})],Ge.prototype,"pageSize",2),(0,c.Cc)([(0,s.n)({attribute:"page-count",type:Number})],Ge.prototype,"pageCount",2),(0,c.Cc)([(0,s.n)({attribute:"pager-count",type:Number})],Ge.prototype,"pagerCount",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ge.prototype,"simple",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Ge.prototype,"size",2),(0,c.Cc)([(0,s.n)({attribute:"background",type:Boolean,reflect:!0})],Ge.prototype,"background",2),(0,c.Cc)([(0,s.r)()],Ge.prototype,"inputValue",2);var Je=Ge;Ge.define("bzl-pagination");var Qe=i.i`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--bzl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--bzl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--bzl-input-placeholder-color-disabled);
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .input--standard {
    border-color: var(--bzl-color-danger-600);
  }
  :host([data-user-invalid]) .input--standard.input--focused:not(.input--disabled) {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--bzl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--bzl-input-height-large) var(--bzl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--bzl-color-neutral-900);
    caret-color: var(--bzl-input-color);
  }

  .input__control::placeholder {
    color: var(--bzl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--bzl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  /* Inline word counter inside the input */
  .input__count {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
    font-variant-numeric: tabular-nums;
    margin-inline-end: var(--bzl-input-spacing-medium);
    font-size: var(--bzl-font-size-2x-small);
  }

  .input__prefix ::slotted(bzl-icon),
  .input__suffix ::slotted(bzl-icon) {
    color: var(--bzl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--medium {
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-medium);
    height: var(--bzl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--bzl-input-height-medium) - var(--bzl-input-border-width) * 2);
    padding: 0 var(--bzl-input-padding-leftright);
  }

  .input--medium .input__clear {
    width: calc(1em + var(--bzl-input-spacing-medium) * 2);
  }

  .input--medium .input__count {
    margin-inline-end: var(--bzl-input-spacing-medium);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--bzl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-large);
    height: var(--bzl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--bzl-input-height-large) - var(--bzl-input-border-width) * 2);
    padding: 0 var(--bzl-input-padding-leftright);
  }

  .input--large .input__clear {
    width: calc(1em + var(--bzl-input-spacing-large) * 2);
  }

  .input--large .input__count {
    margin-inline-end: var(--bzl-input-spacing-large);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--bzl-input-spacing-large);
  }

  /*
   * Clearable
   */

  .input__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .input__clear:focus {
    outline: none;
  }
`,to=class extends s.X{constructor(){super(...arguments),this.hasFocus=!1,this.title="",this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.showWordLimit=!1,this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.autocomplete="off"}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleChange(){this.value=this.input.value,this.emit("bzl-change")}handleClearClick(t){t.preventDefault(),""!==this.value&&(this.value="",this.emit("bzl-clear"),this.emit("bzl-input"),this.emit("bzl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleInput(){this.value=this.input.value,this.emit("bzl-input")}handleInvalid(){}handleKeyDown(t){t.metaKey||t.ctrlKey||t.shiftKey||t.altKey,t.key}handleDisabledChange(){}handleStepChange(){this.input.step=String(this.step)}async handleValueChange(){await this.updateComplete}focus(t){this.input.focus(t)}blur(){this.input.blur()}select(){this.input.select()}render(){const t=this.clearable&&!this.disabled&&!this.readonly&&("number"==typeof this.value||this.value.length>0);return i.x`
      <div
        part="base"
        class=${(0,n.e)({input:!0,"input--medium":"medium"===this.size,"input--large":"large"===this.size,"input--standard":!0,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value})}
      >
        <span part="prefix" class="input__prefix">
          <slot name="prefix"></slot>
        </span>

        <input
          part="input"
          id="input"
          class="input__control"
          type=${this.type}
          title=${this.title}
          name=${ae(this.name)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          placeholder=${ae(this.placeholder)}
          minlength=${ae(this.minlength)}
          maxlength=${ae(this.maxlength)}
          min=${ae(this.min)}
          max=${ae(this.max)}
          step=${ae(this.step)}
          .value=${re(this.value)}
          ?autofocus=${this.autofocus}
          autocomplete=${this.autocomplete}
          @change=${this.handleChange}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @keydown=${this.handleKeyDown}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />

        ${t?i.x`
              <button
                part="clear-button"
                class="input__clear"
                type="button"
                aria-label="清空"
                @click=${this.handleClearClick}
                tabindex="-1"
              >
                <slot name="clear-icon">
                  <bzl-icon name="close-face1" library="system"></bzl-icon>
                </slot>
              </button>
            `:""}
        ${this.showWordLimit?i.x`
              <span class="input__count" aria-hidden="true">
                ${`${"string"==typeof this.value?this.value.length:0}${this.maxlength?`/${this.maxlength}`:""}`}
              </span>
            `:""}

        <span part="suffix" class="input__suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `}};to.styles=[l.$,Qe],to.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.e)(".input__control")],to.prototype,"input",2),(0,c.Cc)([(0,s.r)()],to.prototype,"hasFocus",2),(0,c.Cc)([(0,s.n)()],to.prototype,"title",2),(0,c.Cc)([(0,s.n)({reflect:!0})],to.prototype,"type",2),(0,c.Cc)([(0,s.n)()],to.prototype,"name",2),(0,c.Cc)([(0,s.n)()],to.prototype,"value",2),(0,c.Cc)([ee()],to.prototype,"defaultValue",2),(0,c.Cc)([(0,s.n)({reflect:!0})],to.prototype,"size",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"show-word-limit"})],to.prototype,"showWordLimit",2),(0,c.Cc)([(0,s.n)({type:Boolean})],to.prototype,"clearable",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],to.prototype,"disabled",2),(0,c.Cc)([(0,s.n)()],to.prototype,"placeholder",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],to.prototype,"readonly",2),(0,c.Cc)([(0,s.n)({type:Number})],to.prototype,"minlength",2),(0,c.Cc)([(0,s.n)({type:Number})],to.prototype,"maxlength",2),(0,c.Cc)([(0,s.n)()],to.prototype,"min",2),(0,c.Cc)([(0,s.n)()],to.prototype,"max",2),(0,c.Cc)([(0,s.n)()],to.prototype,"step",2),(0,c.Cc)([(0,s.n)({type:Boolean})],to.prototype,"autofocus",2),(0,c.Cc)([(0,s.n)()],to.prototype,"autocomplete",2),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],to.prototype,"handleDisabledChange",1),(0,c.Cc)([(0,Mt.w)("step",{waitUntilFirstUpdate:!0})],to.prototype,"handleStepChange",1),(0,c.Cc)([(0,Mt.w)("value",{waitUntilFirstUpdate:!0})],to.prototype,"handleValueChange",1);var eo=to;to.define("bzl-input");var oo=i.i`
  /* 确保 bzl-layout 元素为块级元素 */
  :host {
    display: block;
  }

  /* 默认布局容器样式 */
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bzl-color-neutral-0);
  }

  /* 当Layout内部只有Sider和Content时，调整flex-direction为row */
  :host([data-sider-only]) .layout {
    flex-direction: row;
  }

  /* Header 类型样式 - 应用到 :host */
  :host([type='header']) {
    flex: 0 0 auto;
    height: var(--bzl-layout-header-height);
    line-height: var(--bzl-layout-header-height);
    display: flex;
    align-items: center;
  }

  /* Footer 类型样式 - 应用到 :host */
  :host([type='footer']) {
    flex: 0 0 auto;
    height: var(--bzl-layout-header-height);
    line-height: var(--bzl-layout-header-height);
    text-align: center;
    display: flex;
    align-items: center;
  }

  /* Content 类型样式 - 应用到 :host */
  :host([type='content']) {
    flex: 1 1 auto;
    padding: var(--bzl-spacing-6);
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Sider 类型样式 - 应用到 :host */
  :host([type='sider']) {
    position: relative;
    transition: all var(--bzl-transition-fast) ease;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* 侧边栏内容区域 - 可滚动 */
  :host([type='sider']) ::slotted(*) {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* 侧边栏内容容器 */
  .layout-sider__content {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .layout-sider__trigger {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bzl-layout-trigger-height);
    line-height: var(--bzl-layout-trigger-height);
    text-align: center;
    cursor: pointer;
    color: var(--bzl-color-neutral-600);
    border-top: 1px solid var(--bzl-color-neutral-200);
    transition: all var(--bzl-transition-fast) ease;
    user-select: none;
    flex: 0 0 auto;
  }
`,io=class extends s.X{constructor(){super(...arguments),this.type="",this.collapsed=!1,this.collapsedWidth="80px",this.collapsible=!1,this.defaultCollapsed=!1,this.width="192px"}handleCollapsedChange(){"sider"===this.type&&this.emit("bzl-collapse",{detail:{collapsed:this.collapsed}})}handleTriggerClick(){"sider"===this.type&&this.collapsible&&(this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent("bzl-collapse",{detail:{collapsed:this.collapsed},bubbles:!0,composed:!0})),this.notifyChildrenCollapseState())}notifyChildrenCollapseState(){var t;const e=null==(t=this.shadowRoot)?void 0:t.querySelector(".layout-sider__content");e&&e.dispatchEvent(new CustomEvent("sider-collapse",{detail:{collapsed:this.collapsed},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),"sider"===this.type?(this.defaultCollapsed&&!this.hasAttribute("collapsed")&&(this.collapsed=!0),this.updateSiderStyles()):""===this.type&&this.checkHasSider()}disconnectedCallback(){super.disconnectedCallback()}updated(t){super.updated(t),t.has("collapsed")||t.has("width")||t.has("collapsedWidth")?"sider"===this.type&&this.updateSiderStyles():""===this.type&&this.checkHasSider()}checkHasSider(){if(""===this.type){const t=null!==this.querySelector('bzl-layout[type="sider"]'),e=Array.from(this.children).filter(t=>"BZL-LAYOUT"===t.tagName);this.toggleAttribute("data-has-sider",t);const o=2===e.length&&t;this.toggleAttribute("data-sider-only",o)}}updateSiderStyles(){if("sider"===this.type){const t=this.collapsed?`width: ${this.collapsedWidth};`:`width: ${this.width};`;this.style.cssText=t}}render(){switch(this.type){case"header":case"footer":case"content":return i.x`<slot></slot>`;case"sider":return i.x`
          <div part="content" class="layout-sider__content" ?data-collapsed=${this.collapsed}>
            <slot></slot>
          </div>
          ${this.collapsible?i.x`
                <div part="trigger" class="layout-sider__trigger" @click=${this.handleTriggerClick}>
                  <slot name="trigger"> ${this.collapsed?"»":"«"} </slot>
                </div>
              `:""}
        `;default:return i.x`
          <div part="base" class="layout">
            <slot></slot>
          </div>
        `}}};io.styles=[l.$,oo],(0,c.Cc)([(0,s.n)()],io.prototype,"type",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],io.prototype,"collapsed",2),(0,c.Cc)([(0,s.n)({attribute:"collapsed-width"})],io.prototype,"collapsedWidth",2),(0,c.Cc)([(0,s.n)({type:Boolean})],io.prototype,"collapsible",2),(0,c.Cc)([(0,s.n)({attribute:"default-collapsed",type:Boolean})],io.prototype,"defaultCollapsed",2),(0,c.Cc)([(0,s.n)()],io.prototype,"width",2),(0,c.Cc)([(0,Mt.w)("collapsed")],io.prototype,"handleCollapsedChange",1);var ro=io;io.define("bzl-layout");var ao=i.i`
  :host {
    display: inline-block;
  }

  .link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: var(--bzl-color-neutral-900);
    transition: all var(--bzl-transition-fast);
    cursor: pointer;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-dense);
  }

  /* 默认状态 */
  .link--default {
    color: var(--bzl-color-neutral-900);
  }

  .link--default:not(.link--underline):hover {
    color: var(--bzl-color-primary-600);
  }

  /* 主要状态 */
  .link--primary {
    color: var(--bzl-color-primary-700);
  }

  .link--primary:not(.link--underline):hover {
    color: var(--bzl-color-primary-600);
  }

  /* 下划线样式 */
  .link--underline {
    text-decoration: none;
  }

  .link--underline:hover {
    text-decoration: underline;
  }

  /* 禁用状态 */
  .link--disabled {
    cursor: not-allowed;
    text-decoration: none !important;
    pointer-events: none;
  }

  .link--primary.link--disabled {
    color: var(--bzl-color-primary-400) !important;
  }

  .link--default.link--disabled {
    color: var(--bzl-color-neutral-600) !important;
  }

  /* 箭头图标样式 */
  .link__suffix {
    font-size: var(--bzl-font-size-2x-small);
  }
`,no=class extends s.X{constructor(){super(...arguments),this.status="default",this.underline=!1,this.href="",this.target="",this.disabled=!1}render(){const t={link:!0,"link--default":"default"===this.status,"link--primary":"primary"===this.status,"link--underline":this.underline,"link--disabled":this.disabled};return i.x`
      <a
        part="base"
        class=${(0,n.e)(t)}
        href=${this.disabled?null:this.href}
        target=${this.target}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
      >
        <slot></slot>
        <slot name="suffix" part="suffix" class="link__suffix"></slot>
      </a>
    `}handleClick(t){this.disabled&&(t.preventDefault(),t.stopPropagation())}};no.styles=[l.$,ao],no.dependencies={},(0,c.Cc)([(0,s.n)({reflect:!0})],no.prototype,"status",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],no.prototype,"underline",2),(0,c.Cc)([(0,s.n)()],no.prototype,"href",2),(0,c.Cc)([(0,s.n)()],no.prototype,"target",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],no.prototype,"disabled",2);var lo=no;no.define("bzl-link");var so=he.K;he.K.define("bzl-icon");var co=i.i`
  :host {
    display: block;
  }

  .bzl-form {
  }

  ::slotted(bzl-form-item) {
    display: block;
  }
`;function ho(t,e,o){let i=t;const r=(e=e.replace(/\[(\w+)\]/g,".$1").replace(/^\./,"")).split(".");let a=0;for(let t=r.length;a<t-1&&(i||o);++a){const t=r[a];if(!(t in i)){if(o)throw new Error("please transfer a valid prop path to form item!");break}i=i[t]}const n=i||{},l=r[a];return{o:n,k:l,v:i?i[l]:null}}var po=new Set(["BZL-INPUT","BZL-TEXTAREA","BZL-SELECT","INPUT","TEXTAREA","SELECT"]),uo=new Set(["BZL-INPUT","BZL-TEXTAREA","BZL-SELECT","INPUT","TEXTAREA"]),bo=class extends s.X{constructor(){super(...arguments),this.name="",this.labelPosition="right",this.labelWidth="",this.labelSuffix="",this.hideMessage=!1,this.hideAsterisk=!1,this.model=null,this.rules=null,this.formItems=[],this._onSlotChange=()=>{var t;const e=this.slotRef;if(!e)return;const o=(null!=(t=null==e?void 0:e.assignedElements({flatten:!0}))?t:[]).filter(t=>"BZL-FORM-ITEM"===t.tagName).filter(t=>!!t.prop);this.formItems=o,this._applyFormPropsToItems(),this._syncModelToItems(),this._syncRulesToItems()}}willUpdate(t){super.willUpdate(t),t.has("model")&&this._syncModelToItems(),t.has("rules")&&this._syncRulesToItems(),["labelPosition","labelWidth","hideMessage","hideAsterisk","labelSuffix"].some(e=>t.has(e))&&this._applyFormPropsToItems()}_applyFormPropsToItems(){var t;const e=this.slotRef;if(!e)return;const o=(null!=(t=e.assignedElements({flatten:!0}))?t:[]).filter(t=>"BZL-FORM-ITEM"===t.tagName),i={hideMessage:this.hideMessage,labelWidth:this.labelWidth,hideAsterisk:this.hideAsterisk,labelSuffix:this.labelSuffix,labelPosition:this.labelPosition};o.forEach(t=>t.setFormProps(i))}_syncModelToItems(){this.model&&this.formItems.forEach(t=>t.setFormModel(this.model))}_syncRulesToItems(){this.rules&&this.formItems.forEach(t=>{if(!t.prop)return;const e=t.prop,{v:o}=ho(this.rules,e,!1);o&&t.setRule({[e]:o})})}validate(t){let e;if("function"!=typeof t&&(e=new Promise((e,o)=>{t=(t,i)=>{t?e(t):o(null!=i?i:{})}})),0===this.formItems.length&&t(!0),(async()=>{let e=!0;const o={},i=await Promise.all(this.formItems.map(t=>new Promise(e=>{t.validate((t,o)=>e({message:t,invalidFields:null!=o?o:{}}))})));for(const t of i)t.message&&(e=!1),t.invalidFields&&Object.assign(o,t.invalidFields);t(e,e?void 0:o)})(),e)return e}validateField(t,e){const o=Array.isArray(t)?t:[t],i=this.formItems.filter(t=>o.includes(t.prop));i.length?i.forEach(t=>t.validate(e)):console.warn("[BzlForm] please pass correct props!")}clearValidate(t){let e=this.formItems;if(t){const o=Array.isArray(t)?t:[t];e=this.formItems.filter(t=>o.includes(t.prop))}e.forEach(t=>t.clearValidate())}resetFields(){this.model?this.formItems.forEach(t=>t.resetField()):console.warn("[BzlForm] please set model (form.model or setModel)!")}getValues(){if(this.model)return this.formItems.forEach(t=>t.getValue()),this.model;console.warn("[BzlForm] please set model (form.model or setModel)!")}render(){return i.x`
      <form class="bzl-form" part="base">
        <slot @slotchange=${this._onSlotChange}></slot>
      </form>
    `}};bo.styles=[co],(0,c.Cc)([(0,s.n)()],bo.prototype,"name",2),(0,c.Cc)([(0,s.n)({attribute:"label-position",reflect:!0})],bo.prototype,"labelPosition",2),(0,c.Cc)([(0,s.n)({attribute:"label-width"})],bo.prototype,"labelWidth",2),(0,c.Cc)([(0,s.n)({attribute:"label-suffix"})],bo.prototype,"labelSuffix",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"hide-message"})],bo.prototype,"hideMessage",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"hide-asterisk"})],bo.prototype,"hideAsterisk",2),(0,c.Cc)([(0,s.n)({type:Object,attribute:!1})],bo.prototype,"model",2),(0,c.Cc)([(0,s.n)({type:Object,attribute:!1})],bo.prototype,"rules",2),(0,c.Cc)([(0,s.e)("form slot")],bo.prototype,"slotRef",2),(0,c.Cc)([(0,s.r)()],bo.prototype,"formItems",2);var go=bo;bo.define("bzl-form");var fo=i.i`
  :host {
    display: block;
    position: relative;
  }

  .form-item__wrapper {
    display: flex;
    margin-bottom: var(--bzl-spacing-7);
  }

  .form-item__label-wrapper {
    flex-shrink: 0;
    margin-right: var(--bzl-spacing-7);
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-neutral-700);
    line-height: var(--bzl-line-height-normal);
  }

  .form-item__label-wrapper .form-item__label {
    display: inline-block;
    width: 100%;
    line-height: var(--bzl-line-height-3x-loose);
  }

  .form-item--required .form-item__label::before {
    content: '*';
    color: var(--bzl-color-danger-600);
    margin-right: var(--bzl-spacing-2);
  }

  .form-item--no-asterisk .form-item__label::before {
    display: none;
  }

  .form-item--label-top .form-item__wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .form-item--label-top .form-item__label-wrapper {
    margin-right: 0;
    margin-bottom: var(--bzl-spacing-4);
  }

  .form-item--label-top .form-item__label-wrapper .form-item__label {
    line-height: var(--bzl-line-height-normal);
  }

  .form-item__main {
    flex: 1;
  }

  .form-item__main-content {
    min-height: var(--bzl-line-height-3x-loose);
    line-height: var(--bzl-line-height-3x-loose);
    /* font-size: 0; */
  }

  .form-item__error-msg {
    color: var(--bzl-color-danger-600);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-line-height-normal);
    display: inline-block;
  }

  .form-item--success .form-item__error-msg,
  .form-item--validating .form-item__error-msg {
    display: none;
  }

  .form-item--validating {
    /* opacity: 0.8; */
  }
`,mo="important",vo=" !"+mo,yo=(0,ie.e)(class extends ie.i{constructor(t){var e;if(super(t),t.type!==ie.t.ATTRIBUTE||"style"!==t.name||(null==(e=t.strings)?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{const i=t[o];return null==i?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:o}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?o.removeProperty(t):o[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(vo);t.includes("-")||e?o.setProperty(t,e?i.slice(0,-11):i,e?mo:""):o[t]=i}}return i.T}});function zo(){return zo=Object.assign?Object.assign.bind():function(t){for(var e=1;e<arguments.length;e++){var o=arguments[e];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(t[i]=o[i])}return t},zo.apply(this,arguments)}function xo(t){return(xo=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function _o(t,e){return(_o=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}function wo(t,e,o){return wo=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(t){return!1}}()?Reflect.construct.bind():function(t,e,o){var i=[null];i.push.apply(i,e);var r=new(Function.bind.apply(t,i));return o&&_o(r,o.prototype),r},wo.apply(null,arguments)}function ko(t){var e="function"==typeof Map?new Map:void 0;return ko=function(t){if(null===t||(o=t,-1===Function.toString.call(o).indexOf("[native code]")))return t;var o;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,i)}function i(){return wo(t,arguments,xo(this).constructor)}return i.prototype=Object.create(t.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),_o(i,t)},ko(t)}var Co=/%[sdj%]/g;function $o(t){if(!t||!t.length)return null;var e={};return t.forEach(function(t){var o=t.field;e[o]=e[o]||[],e[o].push(t)}),e}function So(t){for(var e=arguments.length,o=new Array(e>1?e-1:0),i=1;i<e;i++)o[i-1]=arguments[i];var r=0,a=o.length;return"function"==typeof t?t.apply(null,o):"string"==typeof t?t.replace(Co,function(t){if("%%"===t)return"%";if(r>=a)return t;switch(t){case"%s":return String(o[r++]);case"%d":return Number(o[r++]);case"%j":try{return JSON.stringify(o[r++])}catch(t){return"[Circular]"}default:return t}}):t}function Eo(t,e){return null==t||!("array"!==e||!Array.isArray(t)||t.length)||!(!function(t){return"string"===t||"url"===t||"hex"===t||"email"===t||"date"===t||"pattern"===t}(e)||"string"!=typeof t||t)}function Ao(t,e,o){var i=0,r=t.length;!function a(n){if(n&&n.length)o(n);else{var l=i;i+=1,l<r?e(t[l],a):o([])}}([])}"undefined"!=typeof process&&process.env;var Po=function(t){var e,o;function i(e,o){var i;return(i=t.call(this,"Async Validation Error")||this).errors=e,i.fields=o,i}return o=t,(e=i).prototype=Object.create(o.prototype),e.prototype.constructor=e,_o(e,o),i}(ko(Error));function To(t,e){return function(o){var i,r;return i=t.fullFields?function(t,e){for(var o=t,i=0;i<e.length;i++){if(null==o)return o;o=o[e[i]]}return o}(e,t.fullFields):e[o.field||t.fullField],(r=o)&&void 0!==r.message?(o.field=o.field||t.fullField,o.fieldValue=i,o):{message:"function"==typeof o?o():o,fieldValue:i,field:o.field||t.fullField}}}function Do(t,e){if(e)for(var o in e)if(e.hasOwnProperty(o)){var i=e[o];"object"==typeof i&&"object"==typeof t[o]?t[o]=zo({},t[o],i):t[o]=i}return t}var Fo,Oo=function(t,e,o,i,r,a){!t.required||o.hasOwnProperty(t.field)&&!Eo(e,a||t.type)||i.push(So(r.messages.required,t.fullField))},Lo=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,Bo=/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,Io={integer:function(t){return Io.number(t)&&parseInt(t,10)===t},float:function(t){return Io.number(t)&&!Io.integer(t)},array:function(t){return Array.isArray(t)},regexp:function(t){if(t instanceof RegExp)return!0;try{return!!new RegExp(t)}catch(t){return!1}},date:function(t){return"function"==typeof t.getTime&&"function"==typeof t.getMonth&&"function"==typeof t.getYear&&!isNaN(t.getTime())},number:function(t){return!isNaN(t)&&"number"==typeof t},object:function(t){return"object"==typeof t&&!Io.array(t)},method:function(t){return"function"==typeof t},email:function(t){return"string"==typeof t&&t.length<=320&&!!t.match(Lo)},url:function(t){return"string"==typeof t&&t.length<=2048&&!!t.match(function(){if(Fo)return Fo;var t="[a-fA-F\\d:]",e=function(e){return e&&e.includeBoundaries?"(?:(?<=\\s|^)(?="+t+")|(?<="+t+")(?=\\s|$))":""},o="(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}",i="[a-fA-F\\d]{1,4}",r=("\n(?:\n(?:"+i+":){7}(?:"+i+"|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:"+i+":){6}(?:"+o+"|:"+i+"|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:"+i+":){5}(?::"+o+"|(?::"+i+"){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:"+i+":){4}(?:(?::"+i+"){0,1}:"+o+"|(?::"+i+"){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:"+i+":){3}(?:(?::"+i+"){0,2}:"+o+"|(?::"+i+"){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:"+i+":){2}(?:(?::"+i+"){0,3}:"+o+"|(?::"+i+"){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:"+i+":){1}(?:(?::"+i+"){0,4}:"+o+"|(?::"+i+"){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::"+i+"){0,5}:"+o+"|(?::"+i+"){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm,"").replace(/\n/g,"").trim(),a=new RegExp("(?:^"+o+"$)|(?:^"+r+"$)"),n=new RegExp("^"+o+"$"),l=new RegExp("^"+r+"$"),s=function(t){return t&&t.exact?a:new RegExp("(?:"+e(t)+o+e(t)+")|(?:"+e(t)+r+e(t)+")","g")};s.v4=function(t){return t&&t.exact?n:new RegExp(""+e(t)+o+e(t),"g")},s.v6=function(t){return t&&t.exact?l:new RegExp(""+e(t)+r+e(t),"g")};var c=s.v4().source,d=s.v6().source;return Fo=new RegExp("(?:^(?:(?:(?:[a-z]+:)?//)|www\\.)(?:\\S+(?::\\S*)?@)?(?:localhost|"+c+"|"+d+'|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#][^\\s"]*)?$)',"i")}())},hex:function(t){return"string"==typeof t&&!!t.match(Bo)}},Vo="enum",Ro=Oo,No=function(t,e,o,i,r){(/^\s+$/.test(e)||""===e)&&i.push(So(r.messages.whitespace,t.fullField))},Mo=function(t,e,o,i,r){if(t.required&&void 0===e)Oo(t,e,o,i,r);else{var a=t.type;["integer","float","array","regexp","object","method","email","number","date","url","hex"].indexOf(a)>-1?Io[a](e)||i.push(So(r.messages.types[a],t.fullField,t.type)):a&&typeof e!==t.type&&i.push(So(r.messages.types[a],t.fullField,t.type))}},qo=function(t,e,o,i,r){var a="number"==typeof t.len,n="number"==typeof t.min,l="number"==typeof t.max,s=e,c=null,d="number"==typeof e,h="string"==typeof e,p=Array.isArray(e);if(d?c="number":h?c="string":p&&(c="array"),!c)return!1;p&&(s=e.length),h&&(s=e.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"_").length),a?s!==t.len&&i.push(So(r.messages[c].len,t.fullField,t.len)):n&&!l&&s<t.min?i.push(So(r.messages[c].min,t.fullField,t.min)):l&&!n&&s>t.max?i.push(So(r.messages[c].max,t.fullField,t.max)):n&&l&&(s<t.min||s>t.max)&&i.push(So(r.messages[c].range,t.fullField,t.min,t.max))},jo=function(t,e,o,i,r){t[Vo]=Array.isArray(t[Vo])?t[Vo]:[],-1===t[Vo].indexOf(e)&&i.push(So(r.messages[Vo],t.fullField,t[Vo].join(", ")))},Wo=function(t,e,o,i,r){t.pattern&&(t.pattern instanceof RegExp?(t.pattern.lastIndex=0,t.pattern.test(e)||i.push(So(r.messages.pattern.mismatch,t.fullField,e,t.pattern))):"string"==typeof t.pattern&&(new RegExp(t.pattern).test(e)||i.push(So(r.messages.pattern.mismatch,t.fullField,e,t.pattern))))},Ho=function(t,e,o,i,r){var a=t.type,n=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e,a)&&!t.required)return o();Ro(t,e,i,n,r,a),Eo(e,a)||Mo(t,e,i,n,r)}o(n)},Uo={string:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e,"string")&&!t.required)return o();Ro(t,e,i,a,r,"string"),Eo(e,"string")||(Mo(t,e,i,a,r),qo(t,e,i,a,r),Wo(t,e,i,a,r),!0===t.whitespace&&No(t,e,i,a,r))}o(a)},method:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&Mo(t,e,i,a,r)}o(a)},number:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(""===e&&(e=void 0),Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&(Mo(t,e,i,a,r),qo(t,e,i,a,r))}o(a)},boolean:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&Mo(t,e,i,a,r)}o(a)},regexp:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),Eo(e)||Mo(t,e,i,a,r)}o(a)},integer:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&(Mo(t,e,i,a,r),qo(t,e,i,a,r))}o(a)},float:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&(Mo(t,e,i,a,r),qo(t,e,i,a,r))}o(a)},array:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(null==e&&!t.required)return o();Ro(t,e,i,a,r,"array"),null!=e&&(Mo(t,e,i,a,r),qo(t,e,i,a,r))}o(a)},object:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&Mo(t,e,i,a,r)}o(a)},enum:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r),void 0!==e&&jo(t,e,i,a,r)}o(a)},pattern:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e,"string")&&!t.required)return o();Ro(t,e,i,a,r),Eo(e,"string")||Wo(t,e,i,a,r)}o(a)},date:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e,"date")&&!t.required)return o();var n;Ro(t,e,i,a,r),Eo(e,"date")||(n=e instanceof Date?e:new Date(e),Mo(t,n,i,a,r),n&&qo(t,n.getTime(),i,a,r))}o(a)},url:Ho,hex:Ho,email:Ho,required:function(t,e,o,i,r){var a=[],n=Array.isArray(e)?"array":typeof e;Ro(t,e,i,a,r,n),o(a)},any:function(t,e,o,i,r){var a=[];if(t.required||!t.required&&i.hasOwnProperty(t.field)){if(Eo(e)&&!t.required)return o();Ro(t,e,i,a,r)}o(a)}};function Ko(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var t=JSON.parse(JSON.stringify(this));return t.clone=this.clone,t}}}var Xo=Ko(),Zo=function(){function t(t){this.rules=null,this._messages=Xo,this.define(t)}var e=t.prototype;return e.define=function(t){var e=this;if(!t)throw new Error("Cannot configure a schema with no rules");if("object"!=typeof t||Array.isArray(t))throw new Error("Rules must be an object");this.rules={},Object.keys(t).forEach(function(o){var i=t[o];e.rules[o]=Array.isArray(i)?i:[i]})},e.messages=function(t){return t&&(this._messages=Do(Ko(),t)),this._messages},e.validate=function(e,o,i){var r=this;void 0===o&&(o={}),void 0===i&&(i=function(){});var a=e,n=o,l=i;if("function"==typeof n&&(l=n,n={}),!this.rules||0===Object.keys(this.rules).length)return l&&l(null,a),Promise.resolve(a);if(n.messages){var s=this.messages();s===Xo&&(s=Ko()),Do(s,n.messages),n.messages=s}else n.messages=this.messages();var c={};(n.keys||Object.keys(this.rules)).forEach(function(t){var o=r.rules[t],i=a[t];o.forEach(function(o){var n=o;"function"==typeof n.transform&&(a===e&&(a=zo({},a)),i=a[t]=n.transform(i)),(n="function"==typeof n?{validator:n}:zo({},n)).validator=r.getValidationMethod(n),n.validator&&(n.field=t,n.fullField=n.fullField||t,n.type=r.getType(n),c[t]=c[t]||[],c[t].push({rule:n,value:i,source:a,field:t}))})});var d={};return function(t,e,o,i,r){if(e.first){var a=new Promise(function(e,a){var n=function(t){var e=[];return Object.keys(t).forEach(function(o){e.push.apply(e,t[o]||[])}),e}(t);Ao(n,o,function(t){return i(t),t.length?a(new Po(t,$o(t))):e(r)})});return a.catch(function(t){return t}),a}var n=!0===e.firstFields?Object.keys(t):e.firstFields||[],l=Object.keys(t),s=l.length,c=0,d=[],h=new Promise(function(e,a){var h=function(t){if(d.push.apply(d,t),++c===s)return i(d),d.length?a(new Po(d,$o(d))):e(r)};l.length||(i(d),e(r)),l.forEach(function(e){var i=t[e];-1!==n.indexOf(e)?Ao(i,o,h):function(t,e,o){var i=[],r=0,a=t.length;function n(t){i.push.apply(i,t||[]),++r===a&&o(i)}t.forEach(function(t){e(t,n)})}(i,o,h)})});return h.catch(function(t){return t}),h}(c,n,function(e,o){var i,r=e.rule,l=!("object"!==r.type&&"array"!==r.type||"object"!=typeof r.fields&&"object"!=typeof r.defaultField);function s(t,e){return zo({},e,{fullField:r.fullField+"."+t,fullFields:r.fullFields?[].concat(r.fullFields,[t]):[t]})}function c(i){void 0===i&&(i=[]);var c=Array.isArray(i)?i:[i];!n.suppressWarning&&c.length&&t.warning("async-validator:",c),c.length&&void 0!==r.message&&(c=[].concat(r.message));var h=c.map(To(r,a));if(n.first&&h.length)return d[r.field]=1,o(h);if(l){if(r.required&&!e.value)return void 0!==r.message?h=[].concat(r.message).map(To(r,a)):n.error&&(h=[n.error(r,So(n.messages.required,r.field))]),o(h);var p={};r.defaultField&&Object.keys(e.value).map(function(t){p[t]=r.defaultField}),p=zo({},p,e.rule.fields);var u={};Object.keys(p).forEach(function(t){var e=p[t],o=Array.isArray(e)?e:[e];u[t]=o.map(s.bind(null,t))});var b=new t(u);b.messages(n.messages),e.rule.options&&(e.rule.options.messages=n.messages,e.rule.options.error=n.error),b.validate(e.value,e.rule.options||n,function(t){var e=[];h&&h.length&&e.push.apply(e,h),t&&t.length&&e.push.apply(e,t),o(e.length?e:null)})}else o(h)}if(l=l&&(r.required||!r.required&&e.value),r.field=e.field,r.asyncValidator)i=r.asyncValidator(r,e.value,c,e.source,n);else if(r.validator){try{i=r.validator(r,e.value,c,e.source,n)}catch(t){null==console.error||console.error(t),n.suppressValidatorError||setTimeout(function(){throw t},0),c(t.message)}!0===i?c():!1===i?c("function"==typeof r.message?r.message(r.fullField||r.field):r.message||(r.fullField||r.field)+" fails"):i instanceof Array?c(i):i instanceof Error&&c(i.message)}i&&i.then&&i.then(function(){return c()},function(t){return c(t)})},function(t){!function(t){var e=[],o={};function i(t){var o;Array.isArray(t)?e=(o=e).concat.apply(o,t):e.push(t)}for(var r=0;r<t.length;r++)i(t[r]);e.length?(o=$o(e),l(e,o)):l(null,a)}(t)},a)},e.getType=function(t){if(void 0===t.type&&t.pattern instanceof RegExp&&(t.type="pattern"),"function"!=typeof t.validator&&t.type&&!Uo.hasOwnProperty(t.type))throw new Error(So("Unknown rule type %s",t.type));return t.type||"string"},e.getValidationMethod=function(t){if("function"==typeof t.validator)return t.validator;var e=Object.keys(t),o=e.indexOf("message");return-1!==o&&e.splice(o,1),1===e.length&&"required"===e[0]?Uo.required:Uo[this.getType(t)]||void 0},t}();function Yo(){}function Go(t){const e=t.tagName;return!!po.has(e)||"value"in t||"checked"in t&&"boolean"==typeof t.checked}function Jo(t){return uo.has(t.tagName)}function Qo(t){for(const e of t){if(Go(e))return e;const t=Qo(Array.from(e.children));if(t)return t}return null}Zo.register=function(t,e){if("function"!=typeof e)throw new Error("Cannot register a validator by type, validator is not a function");Uo[t]=e},Zo.warning=function(){},Zo.messages=Xo,Zo.validators=Uo;var ti=class extends s.X{constructor(){super(...arguments),this.prop="",this.label="",this.labelWidth="",this.hideMessage=!1,this.hideAsterisk=!1,this.rules=[],this.validateState="",this.validateMessage="",this.validateDisabled=!1,this.itemNode=null,this.formRules=null,this.formProps={hideAsterisk:!1,hideMessage:!1,labelWidth:"",labelSuffix:"",labelPosition:"left"},this.formModel=null,this.initialValue=null,this._changeHandler=()=>this.onFieldChange(),this._blurHandler=()=>this.onFieldBlur(),this._hasUserChanged=!1,this._debouncedChange=function(t){let e=0;return function(...o){clearTimeout(e),e=setTimeout(()=>{t.apply(this,o)},200)}}(()=>{this.validateDisabled||this.validate()}),this._contentSlotChange=()=>{const t=this.contentSlot;if(!t)return;const e=Qo(t.assignedElements({flatten:!0}));this.itemNode&&(this.itemNode.removeEventListener("change",this._changeHandler),this.itemNode.removeEventListener("bzl-change",this._changeHandler),Jo(this.itemNode)&&(this.itemNode.removeEventListener("blur",this._blurHandler),this.itemNode.removeEventListener("bzl-blur",this._blurHandler)),this.itemNode=null),e&&(this.itemNode=e,this._syncControlInvalid("error"===this.validateState),e.addEventListener("change",this._changeHandler),e.addEventListener("bzl-change",this._changeHandler),Jo(e)&&(e.addEventListener("blur",this._blurHandler),e.addEventListener("bzl-blur",this._blurHandler)))}}setFormProps(t){this.formProps=t}setFormModel(t){if(!t||!this.prop)return;this.formModel=t;const{v:e}=ho(t,this.prop,!0);this.initialValue=e}setRule(t){this.formRules=t}getRules(){var t;const e=Array.isArray(this.rules)?this.rules:this.rules?[this.rules]:[],o=null==(t=this.formRules)?void 0:t[this.prop],i=Array.isArray(o)?o:o?[o]:[],r=e.length?e:i;return[].concat(r)}_syncControlInvalid(t){this.itemNode&&(t?this.itemNode.setAttribute("data-user-invalid",""):this.itemNode.removeAttribute("data-user-invalid"))}validate(t=Yo){this.validateDisabled=!1;const e=this.getRules();if(!e||0===e.length)return this._syncControlInvalid(!1),void t();this.validateState="validating",new Zo({[this.prop]:e}).validate({[this.prop]:this.getValue()},{firstFields:!0},(e,o)=>{this.validateState=e?"error":"success",this.validateMessage=e?e[0].message:"",this._syncControlInvalid("error"===this.validateState),t(this.validateMessage||void 0,o)})}clearValidate(){this.validateState="",this.validateMessage="",this.validateDisabled=!1,this._syncControlInvalid(!1)}resetField(){if(this.validateState="",this.validateMessage="",this._hasUserChanged=!1,this._syncControlInvalid(!1),!this.formModel||!this.prop)return;const t=ho(this.formModel,this.prop,!0);this.validateDisabled=!0,Array.isArray(this.initialValue)?t.o[t.k]=[].concat(this.initialValue):t.o[t.k]=this.initialValue,this.validateDisabled=!1}getValue(){if(!this.prop)return;if(!this.formModel)return;const{v:t}=ho(this.formModel,this.prop,!0);return t}onFieldChange(){this._hasUserChanged=!0,this._debouncedChange()}onFieldBlur(){this.validateDisabled||this._hasUserChanged&&this.validate()}isRequired(){const t=this.getRules();return!!(this.prop&&t&&t.some(t=>t.required))}disconnectedCallback(){this.itemNode&&(this.itemNode.removeEventListener("change",this._changeHandler),this.itemNode.removeEventListener("bzl-change",this._changeHandler),Jo(this.itemNode)&&(this.itemNode.removeEventListener("blur",this._blurHandler),this.itemNode.removeEventListener("bzl-blur",this._blurHandler)),this.itemNode=null),super.disconnectedCallback()}_itemClass(){const t=["form-item"];return"success"===this.validateState&&t.push("form-item--success"),"validating"===this.validateState&&t.push("form-item--validating"),(this.hideAsterisk||this.formProps.hideAsterisk)&&t.push("form-item--no-asterisk"),this.isRequired()&&t.push("form-item--required"),"top"===this.formProps.labelPosition&&t.push("form-item--label-top"),t.join(" ")}_labelStyle(){const t={},e=this.labelWidth||this.formProps.labelWidth;e&&(t.width=e);const o=this.formProps.labelPosition;return"left"!==o&&"right"!==o||(t.textAlign=o),t}render(){const t=!this.formProps.hideMessage&&!this.hideMessage&&"error"===this.validateState&&!!this.validateMessage;return i.x`
      <div class=${this._itemClass()} part="base">
        <div class="form-item__wrapper" part="wrapper">
          <div class="form-item__label-wrapper" style=${yo(this._labelStyle())}>
            <slot name="label">
              <div class="form-item__label">${this.label}<span>${this.formProps.labelSuffix||""}</span></div>
            </slot>
          </div>
          <div class="form-item__main">
            <div class="form-item__main-content">
              <slot @slotchange=${this._contentSlotChange}></slot>
            </div>
            ${t?i.x`<div class="form-item__error-msg">${this.validateMessage}</div>`:""}
          </div>
        </div>
      </div>
    `}};ti.styles=[fo],(0,c.Cc)([(0,s.e)(".form-item__main-content slot")],ti.prototype,"contentSlot",2),(0,c.Cc)([(0,s.n)()],ti.prototype,"prop",2),(0,c.Cc)([(0,s.n)()],ti.prototype,"label",2),(0,c.Cc)([(0,s.n)({attribute:"label-width"})],ti.prototype,"labelWidth",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"hide-message"})],ti.prototype,"hideMessage",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"hide-asterisk"})],ti.prototype,"hideAsterisk",2),(0,c.Cc)([(0,s.n)({type:Array})],ti.prototype,"rules",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"validateState",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"validateMessage",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"validateDisabled",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"itemNode",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"formRules",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"formProps",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"formModel",2),(0,c.Cc)([(0,s.r)()],ti.prototype,"initialValue",2);var ei=ti;ti.define("bzl-form-item");var oi=i.i`
  :host {
    --error-color: var(--bzl-color-danger-600);
    --success-color: var(--bzl-color-success-600);

    display: inline-block;
  }

  .copy-button__button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--bzl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--bzl-spacing-4);
    cursor: pointer;
    transition: var(--bzl-transition-x-fast) color;
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`,ii=class extends s.X{constructor(){super(...arguments),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(this.disabled||this.isCopying)return;this.isCopying=!0;let t=this.value;if(this.from){const e=this.getRootNode(),o=this.from.includes("."),i=this.from.includes("[")&&this.from.includes("]");let r=this.from,a="";o?[r,a]=this.from.trim().split("."):i&&([r,a]=this.from.trim().replace(/\]$/,"").split("["));const n="getElementById"in e?e.getElementById(r):null;n?t=i?n.getAttribute(a)||"":o?n[a]||"":n.textContent||"":(this.showStatus("error"),this.emit("bzl-error"))}if(t)try{await navigator.clipboard.writeText(t),this.showStatus("success"),this.emit("bzl-copy",{detail:{value:t}})}catch(t){this.showStatus("error"),this.emit("bzl-error")}else this.showStatus("error"),this.emit("bzl-error")}async showStatus(t){const e=this.copyLabel||"复制",o=this.successLabel||"已复制",i=this.errorLabel||"错误",r="success"===t?this.successIcon:this.errorIcon,a=Nt(this,"copy.in",{dir:"ltr"}),n=Nt(this,"copy.out",{dir:"ltr"});this.tooltip.content="success"===t?o:i,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=t,r.hidden=!1,await r.animate(a.keyframes,a.options).finished,setTimeout(async()=>{await r.animate(n.keyframes,n.options).finished,r.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(a.keyframes,a.options).finished,this.tooltip.content=e,this.isCopying=!1},this.feedbackDuration)}render(){const t=this.copyLabel||"复制";return i.x`
      <bzl-tooltip
        class=${(0,n.e)({"copy-button":!0,"copy-button--success":"success"===this.status,"copy-button--error":"error"===this.status})}
        content=${t}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <bzl-icon name="copy-outline"></bzl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <bzl-icon name="right-outline"></bzl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <bzl-icon name="improper-outline"></bzl-icon>
          </slot>
        </button>
      </bzl-tooltip>
    `}};ii.styles=[l.$,oi],ii.dependencies={"bzl-icon":he.K,"bzl-tooltip":qt},(0,c.Cc)([(0,s.e)('slot[name="copy-icon"]')],ii.prototype,"copyIcon",2),(0,c.Cc)([(0,s.e)('slot[name="success-icon"]')],ii.prototype,"successIcon",2),(0,c.Cc)([(0,s.e)('slot[name="error-icon"]')],ii.prototype,"errorIcon",2),(0,c.Cc)([(0,s.e)("bzl-tooltip")],ii.prototype,"tooltip",2),(0,c.Cc)([(0,s.r)()],ii.prototype,"isCopying",2),(0,c.Cc)([(0,s.r)()],ii.prototype,"status",2),(0,c.Cc)([(0,s.n)()],ii.prototype,"value",2),(0,c.Cc)([(0,s.n)()],ii.prototype,"from",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ii.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({attribute:"copy-label"})],ii.prototype,"copyLabel",2),(0,c.Cc)([(0,s.n)({attribute:"success-label"})],ii.prototype,"successLabel",2),(0,c.Cc)([(0,s.n)({attribute:"error-label"})],ii.prototype,"errorLabel",2),(0,c.Cc)([(0,s.n)({attribute:"feedback-duration",type:Number})],ii.prototype,"feedbackDuration",2),(0,c.Cc)([(0,s.n)({attribute:"tooltip-placement"})],ii.prototype,"tooltipPlacement",2),(0,c.Cc)([(0,s.n)({type:Boolean})],ii.prototype,"hoist",2),Rt("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}}),Rt("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}});var ri=ii;ii.define("bzl-copy-button");var ai=i.i`
  :host {
    --width: 784px;
    --header-spacing: 24px 32px 16px;
    --body-spacing: 8px 32px;
    --footer-spacing: 24px 32px;

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--bzl-z-index-dialog);
  }

  .dialog__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--bzl-spacing-9));
    max-height: calc(100% - var(--bzl-spacing-9));
    background-color: var(--bzl-panel-background-color);
    border-radius: var(--bzl-border-radius-large);
    box-shadow: var(--bzl-shadow-neutral-ultra);
  }

  .dialog__panel:focus {
    outline: none;
  }

  .dialog--no-header .dialog__panel {
    padding-top: 24px;
  }

  .dialog--no-header .dialog__body {
    padding-top: 0;
  }

  .dialog--no-footer .dialog__panel {
    padding-bottom: 24px;
  }

  .dialog--no-footer .dialog__body {
    padding-bottom: 0;
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    padding: var(--header-spacing);
    border-radius: var(--bzl-border-radius-large) var(--bzl-border-radius-large) 0 0;
    background: linear-gradient(179.99998deg, #ddf5f5 0%, rgba(221, 245, 245, 0) 100%), #ffffff;
    border: 1px solid var(--bzl-color-neutral-0);
  }

  .dialog__header-main {
    flex: 1 1 auto;
    min-width: 0;
  }

  .dialog__title-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .dialog__status-icon {
    flex: 0 0 auto;
    font-size: 20px;
    margin-inline-end: 8px;
  }

  .dialog--type-success .dialog__status-icon {
    color: var(--bzl-color-success-600);
  }

  .dialog--type-warning .dialog__status-icon {
    color: var(--bzl-color-warning-600);
  }

  .dialog--type-danger .dialog__status-icon {
    color: var(--bzl-color-danger-600);
  }

  .dialog__header-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .dialog__title {
    flex: 1 1 auto;
    min-width: 0;
    font: inherit;
    font-size: var(--bzl-font-size-large);
    line-height: var(--bzl-line-height-x-loose);
    color: var(--bzl-color-neutral-1000);
    font-weight: var(--bzl-font-weight-bold);
    margin: 0;
  }

  .dialog__sub-title {
    margin: var(--bzl-spacing-2) 0 0;
    color: var(--bzl-color-neutral-700);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-normal);
  }

  .dialog__header-actions {
    position: absolute;
    top: var(--bzl-spacing-6);
    right: var(--bzl-spacing-6);
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--bzl-spacing-2);
  }

  .dialog .dialog__header-actions .dialog__close::part(base) {
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    line-height: var(--bzl-line-height-normal);
    border-radius: var(--bzl-border-radius-small);
    color: var(--bzl-color-neutral-700);
    background-color: transparent;
    border: none;
  }

  .dialog .dialog__header-actions .dialog__close:not([disabled]):hover::part(base) {
    background-color: color-mix(in srgb, var(--bzl-color-neutral-700) 8%, transparent);
    color: var(--bzl-color-neutral-700);
    border: none;
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--bzl-spacing-5);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--bzl-overlay-background-color);
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--bzl-color-neutral-0);
    }
  }
`,ni=i.i`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  /*
   * CSS Custom Properties for Button Sizing
   * These can be overridden externally to customize button dimensions
   */
  :host {
    /* XSmall size variables */
    --bzl-button-height-xsmall: 24px;

    /* Small size variables */
    --bzl-button-height-small: 28px;

    /* Default size variables */
    --bzl-button-height-default: 32px;

    /* Large size variables */
    --bzl-button-height-large: 36px;

    /* XLarge size variables */
    --bzl-button-height-xlarge: 40px;

    /* 各尺寸按钮最小宽度 */
    --bzl-button-min-width-xsmall: 52px;
    --bzl-button-min-width-small: 62px;
    --bzl-button-min-width-medium: 66px;
    --bzl-button-min-width-large: 74px;
    --bzl-button-min-width-xlarge: 82px;

    /* 带图标按钮的尺寸变量 */
    --bzl-button-height-small-with-icon: 32px;
    --bzl-button-height-default-with-icon: 36px;
    --bzl-button-height-large-with-icon: 40px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-style: solid;
    border-width: 1px;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    box-sizing: border-box;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .button--disabled {
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__icon {
    pointer-events: none;
  }

  .button--has-icon.button--has-label .button__icon::slotted(*) {
    margin-right: 4px;
  }

  /* Margin for spinner when loading */
  .button--has-icon.button--has-label .button__icon bzl-spin {
    margin-right: 4px;
  }

  /* Icon sizing for buttons with text */
  .button--has-icon.button--has-label .button__icon::slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Icon sizing for icon-only buttons */
  .button--has-icon:not(.button--has-label) .button__icon::slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Icon sizing for different icon-only button sizes */
  .button--has-icon:not(.button--has-label).button--small .button__icon::slotted(*) {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .button--has-icon:not(.button--has-label).button--default .button__icon::slotted(*) {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .button--has-icon:not(.button--has-label).button--large .button__icon::slotted(*) {
    font-size: 22px;
    width: 22px;
    height: 22px;
  }

  /* Icon-only buttons - 确保宽高相同 */
  .button--has-icon:not(.button--has-label) {
    padding: 0;
    width: var(--bzl-button-height-small);
    height: var(--bzl-button-height-small);
    min-width: var(--bzl-button-height-small);
  }

  /* Icon-only buttons 不同尺寸的宽高 */
  .button--has-icon:not(.button--has-label).button--small {
    width: var(--bzl-button-height-small-with-icon);
    height: var(--bzl-button-height-small-with-icon);
    min-width: var(--bzl-button-height-small-with-icon);
  }

  .button--has-icon:not(.button--has-label).button--default {
    width: var(--bzl-button-height-default-with-icon);
    height: var(--bzl-button-height-default-with-icon);
    min-width: var(--bzl-button-height-default-with-icon);
  }

  .button--has-icon:not(.button--has-label).button--large {
    width: var(--bzl-button-height-large-with-icon);
    height: var(--bzl-button-height-large-with-icon);
    min-width: var(--bzl-button-height-large-with-icon);
  }

  .button__label::slotted(bzl-icon) {
    vertical-align: -2px;
  }

  /*
   * Primary variant styles
   */

  /* Primary - Default theme (对应原来brand) */
  .button--primary.button--theme-default {
    background-color: var(--bzl-color-boss-600);
    color: #fff;
    border: none;
  }

  .button--primary.button--theme-default:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-700);
    color: #fff;
    border: none;
  }

  .button--primary.button--theme-default.button--disabled {
    background-color: var(--bzl-color-boss-300);
    color: #fff;
    border: none;
  }

  /* Primary - Brand theme (对应原来brand-light) */
  .button--primary.button--theme-brand {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--primary.button--theme-brand:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-200);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--primary.button--theme-brand.button--disabled {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-400);
    border: none;
  }

  /* Primary - Neutral theme */
  .button--primary.button--theme-neutral {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-800);
    border: none;
  }

  .button--primary.button--theme-neutral:hover:not(.button--disabled) {
    background-color: var(--bzl-color-gray-300);
    color: var(--bzl-color-gray-800);
    border: none;
  }

  .button--primary.button--theme-neutral.button--disabled {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-600);
    border: none;
  }

  /*
   * Outline variant styles
   */

  /* Outline - Default theme (对应原来brand-light) */
  .button--outline.button--theme-default {
    border-color: var(--bzl-color-boss-500);
    background-color: transparent;
    color: var(--bzl-color-boss-700);
  }

  .button--outline.button--theme-default:hover:not(.button--disabled) {
    border-color: var(--bzl-color-boss-500);
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
  }

  .button--outline.button--theme-default.button--disabled {
    border-color: var(--bzl-color-boss-400);
    background-color: transparent;
    color: var(--bzl-color-boss-400);
  }

  /* Outline - Neutral theme */
  .button--outline.button--theme-neutral {
    border-color: var(--bzl-color-gray-400);
    background-color: transparent;
    color: var(--bzl-color-gray-800);
  }

  .button--outline.button--theme-neutral:hover:not(.button--disabled) {
    border-color: var(--bzl-color-gray-400);
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-800);
  }

  .button--outline.button--theme-neutral.button--disabled {
    border-color: var(--bzl-color-gray-400);
    background-color: transparent;
    color: var(--bzl-color-gray-600);
  }

  /*
   * Text variant styles
   */

  /* Text - Default theme (对应原来brand-light) */
  .button--text.button--theme-default {
    background-color: transparent;
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--text.button--theme-default:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--text.button--theme-default.button--disabled {
    background-color: transparent;
    color: var(--bzl-color-boss-400);
    border: none;
  }

  /* Text - Neutral theme */
  .button--text.button--theme-neutral {
    background-color: transparent;
    color: var(--bzl-color-gray-900);
    border: none;
  }

  .button--text.button--theme-neutral:hover:not(.button--disabled) {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-900);
    border: none;
  }

  .button--text.button--theme-neutral.button--disabled {
    background-color: transparent;
    color: var(--bzl-color-gray-600);
    border: none;
  }

  /*
   * Size modifiers
   */

  .button--xsmall {
    height: var(--bzl-button-height-xsmall);
    min-width: var(--bzl-button-min-width-xsmall);
    padding: 4px 8px;
    font-size: 12px;
    line-height: var(--bzl-button-height-xsmall);
    border-radius: 6px;
  }

  .button--small {
    height: var(--bzl-button-height-small);
    min-width: var(--bzl-button-min-width-small);
    padding: 4px 10px;
    font-size: 14px;
    line-height: var(--bzl-button-height-small);
    border-radius: 8px;
  }

  /* 带图标的small按钮使用特殊高度 */
  .button--small.button--has-icon {
    height: var(--bzl-button-height-small-with-icon);
    line-height: var(--bzl-button-height-small-with-icon);
  }

  .button--default {
    height: var(--bzl-button-height-default);
    min-width: var(--bzl-button-min-width-medium);
    padding: 4px 12px;
    font-size: 14px;
    line-height: var(--bzl-button-height-default);
    border-radius: 8px;
  }

  /* 带图标的default按钮使用特殊高度 */
  .button--default.button--has-icon {
    height: var(--bzl-button-height-default-with-icon);
    line-height: var(--bzl-button-height-default-with-icon);
  }

  .button--large {
    height: var(--bzl-button-height-large);
    min-width: var(--bzl-button-min-width-large);
    padding: 6px 16px;
    font-size: 14px;
    line-height: var(--bzl-button-height-large);
    border-radius: 8px;
  }

  /* 带图标的large按钮使用特殊高度 */
  .button--large.button--has-icon {
    height: var(--bzl-button-height-large-with-icon);
    line-height: var(--bzl-button-height-large-with-icon);
  }

  .button--xlarge {
    height: var(--bzl-button-height-xlarge);
    min-width: var(--bzl-button-min-width-xlarge);
    padding: 8px 20px;
    font-size: 14px;
    line-height: var(--bzl-button-height-xlarge);
    border-radius: 8px;
  }

  /*
   * Shape variants
   */

  /* Default shape with size-specific border radius */
  .button--shape-default.button--xsmall {
    border-radius: 6px;
  }

  .button--shape-default.button--small,
  .button--shape-default.button--default,
  .button--shape-default.button--large,
  .button--shape-default.button--xlarge {
    border-radius: 8px;
  }

  /* Round */
  .button--round {
    border-radius: 100px;
  }

  /* Circle */
  .button--circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    min-width: auto;
    padding: 0px;
  }

  .button--circle .button__label {
    display: none;
  }

  /* Hide user-provided icon content when loading */
  .button--loading .button__icon::slotted(*) {
    display: none;
  }

  .button--loading bzl-spin {
    --indicator-color: currentColor;
  }

  /* For icon-only buttons, use larger spinner */
  .button--loading.button--has-icon:not(.button--has-label) bzl-spin {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Loading spinner for different icon-only button sizes */
  .button--loading.button--has-icon:not(.button--has-label).button--small bzl-spin {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .button--loading.button--has-icon:not(.button--has-label).button--default bzl-spin {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .button--loading.button--has-icon:not(.button--has-label).button--large bzl-spin {
    font-size: 22px;
    width: 22px;
    height: 22px;
  }

  /*
   * Button spacing - No padding, elements are centered
   */

  /*
   * Button groups support
   */

  :host([data-bzl-button-group__button--first]:not([data-bzl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-bzl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-bzl-button-group__button--last]:not([data-bzl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-bzl-button-group__button]:not([data-bzl-button-group__button--first])) {
    margin-inline-start: calc(-1 * 1px);
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-bzl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-bzl-button-group__button--focus]),
  :host([data-bzl-button-group__button][checked]) {
    z-index: 2;
  }
`,li=Symbol.for(""),si=t=>{if((null==t?void 0:t.r)===li)return null==t?void 0:t._$litStatic$},ci=(t,...e)=>({_$litStatic$:e.reduce((e,o,i)=>e+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(o)+t[i+1],t[0]),r:li}),di=new Map,hi=t=>(e,...o)=>{const i=o.length;let r,a;const n=[],l=[];let s,c=0,d=!1;for(;c<i;){for(s=e[c];c<i&&void 0!==(a=o[c],r=si(a));)s+=r+e[++c],d=!0;c!==i&&l.push(a),n.push(s),c++}if(c===i&&n.push(e[i]),d){const t=n.join("$$lit$$");void 0===(e=di.get(t))&&(n.raw=n,di.set(t,e=n)),o=l}return t(e,...o)},pi=hi(i.x),ui=(hi(i.b),hi(i.w),class extends s.X{constructor(){super(...arguments),this.formControlController=new Zt(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new me.X(this,"[default]","icon"),this.invalid=!1,this.title="",this.size="default",this.variant="primary",this.shape="default",this.disabled=!1,this.loading=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get effectiveSize(){return!this.hasSlotController.test("icon")&&!this.loading||"xsmall"!==this.size&&"xlarge"!==this.size?this.size:"default"}get validity(){return this.isButton()?this.button.validity:Yt}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleClick(t){if(this.disabled||this.loading)t.preventDefault();else if(this.isButton()&&("submit"===this.type&&this.formControlController.submit(this),"reset"===this.type)){const t=this.formControlController.getForm()||this.closest("form");if(t){const e=new Event("reset",{bubbles:!0,cancelable:!0});t.dispatchEvent(e)}}}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}checkValidity(){if(this.isButton()){if("button"===this.type)return!0;const t=this.button.checkValidity();return t||this.disabled||this.emit("bzl-invalid",{bubbles:!1,cancelable:!0,composed:!1}),t}return!0}getForm(){return this.formControlController.getForm()}reportValidity(){if(this.isButton()){if("button"===this.type)return!0;const t=this.button.reportValidity();return t||this.disabled||this.emit("bzl-invalid",{bubbles:!1,cancelable:!0,composed:!1}),t}return!0}setCustomValidity(t){this.isButton()&&(this.button.setCustomValidity(t),this.formControlController.updateValidity())}render(){const t=this.isLink(),e=t?ci`a`:ci`button`;return pi`
      <${e}
        part="base"
        class=${(0,n.e)({button:!0,"button--primary":"primary"===this.variant,"button--outline":"outline"===this.variant,"button--text":"text"===this.variant,"button--xsmall":"xsmall"===this.effectiveSize,"button--small":"small"===this.effectiveSize,"button--default":"default"===this.effectiveSize,"button--large":"large"===this.effectiveSize,"button--xlarge":"xlarge"===this.effectiveSize,"button--theme-default":"default"===(this.theme||"default"),"button--theme-brand":"brand"===(this.theme||"default"),"button--theme-neutral":"neutral"===(this.theme||"default"),"button--shape-default":"default"===this.shape,"button--round":"round"===this.shape,"button--circle":"circle"===this.shape,"button--disabled":this.disabled,"button--loading":this.loading,"button--rtl":!1,"button--has-label":this.hasSlotController.test("[default]"),"button--has-icon":this.hasSlotController.test("icon")||this.loading})}
        ?disabled=${ae(t?void 0:this.disabled)}
        type=${ae(t?void 0:this.type)}
        title=${this.title}
        name=${ae(t?void 0:this.name)}
        value=${ae(t?void 0:this.value)}
        href=${ae(t&&!this.disabled?this.href:void 0)}
        target=${ae(t?this.target:void 0)}
        download=${ae(t?this.download:void 0)}
        rel=${ae(t?this.rel:void 0)}
        role=${ae(t?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
      >
        <slot name="icon" part="icon" class="button__icon">
          ${this.loading?pi`<bzl-spin size="xsmall"></bzl-spin>`:""}
        </slot>
        <slot part="label" class="button__label"></slot>
      </${e}>
    `}});function*bi(t=document.activeElement){null!=t&&(yield t,"shadowRoot"in t&&t.shadowRoot&&"closed"!==t.shadowRoot.mode&&(yield*(0,c.y0)(bi(t.shadowRoot.activeElement))))}ui.styles=[l.$,ni],ui.dependencies={"bzl-icon":he.K,"bzl-spin":me.v},(0,c.Cc)([(0,s.e)(".button")],ui.prototype,"button",2),(0,c.Cc)([(0,s.r)()],ui.prototype,"invalid",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"title",2),(0,c.Cc)([(0,s.n)({reflect:!0})],ui.prototype,"size",2),(0,c.Cc)([(0,s.n)({reflect:!0})],ui.prototype,"variant",2),(0,c.Cc)([(0,s.n)({reflect:!0})],ui.prototype,"theme",2),(0,c.Cc)([(0,s.n)({reflect:!0})],ui.prototype,"shape",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ui.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],ui.prototype,"loading",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"type",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"name",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"value",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"href",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"target",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"rel",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"download",2),(0,c.Cc)([(0,s.n)()],ui.prototype,"form",2),(0,c.Cc)([(0,s.n)({attribute:"formaction"})],ui.prototype,"formAction",2),(0,c.Cc)([(0,s.n)({attribute:"formenctype"})],ui.prototype,"formEnctype",2),(0,c.Cc)([(0,s.n)({attribute:"formmethod"})],ui.prototype,"formMethod",2),(0,c.Cc)([(0,s.n)({attribute:"formnovalidate",type:Boolean})],ui.prototype,"formNoValidate",2),(0,c.Cc)([(0,s.n)({attribute:"formtarget"})],ui.prototype,"formTarget",2),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],ui.prototype,"handleDisabledChange",1);var gi=new WeakMap;function fi(t){let e=gi.get(t);return e||(e=window.getComputedStyle(t,null),gi.set(t,e)),e}function mi(t){const e=new WeakMap,o=[];return function i(r){if(r instanceof Element){if(r.hasAttribute("inert")||r.closest("[inert]"))return;if(e.has(r))return;e.set(r,!0),!o.includes(r)&&function(t){const e=t.tagName.toLowerCase(),o=Number(t.getAttribute("tabindex"));if(t.hasAttribute("tabindex")&&(isNaN(o)||o<=-1))return!1;if(t.hasAttribute("disabled"))return!1;if(t.closest("[inert]"))return!1;if("input"===e&&"radio"===t.getAttribute("type")){const e=t.getRootNode(),o=`input[type='radio'][name="${t.getAttribute("name")}"]`,i=e.querySelector(`${o}:checked`);return i?i===t:e.querySelector(o)===t}return!!function(t){if("function"==typeof t.checkVisibility)return t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0});const e=fi(t);return"hidden"!==e.visibility&&"none"!==e.display}(t)&&(!("audio"!==e&&"video"!==e||!t.hasAttribute("controls"))||!!t.hasAttribute("tabindex")||!(!t.hasAttribute("contenteditable")||"false"===t.getAttribute("contenteditable"))||!!["button","input","select","textarea","a","audio","video","summary","iframe"].includes(e)||function(t){const e=fi(t),{overflowY:o,overflowX:i}=e;return"scroll"===o||"scroll"===i||"auto"===o&&"auto"===i&&(t.scrollHeight>t.clientHeight&&"auto"===o||!(!(t.scrollWidth>t.clientWidth)||"auto"!==i))}(t))}(r)&&o.push(r),r instanceof HTMLSlotElement&&function(t,e){var o;return(null==(o=t.getRootNode({composed:!0}))?void 0:o.host)!==e}(r,t)&&r.assignedElements({flatten:!0}).forEach(t=>{i(t)}),null!==r.shadowRoot&&"open"===r.shadowRoot.mode&&i(r.shadowRoot)}for(const t of r.children)i(t)}(t),o.sort((t,e)=>{const o=Number(t.getAttribute("tabindex"))||0;return(Number(e.getAttribute("tabindex"))||0)-o})}var vi=[],yi=class{constructor(t){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=t=>{var e;if("Tab"!==t.key||this.isExternalActivated)return;if(!this.isActive())return;const o=[...bi()].pop();if(this.previousFocus=o,this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;t.shiftKey?this.tabDirection="backward":this.tabDirection="forward";const i=mi(this.element);let r=i.findIndex(t=>t===o);this.previousFocus=this.currentFocus;const a="forward"===this.tabDirection?1:-1;for(;;){r+a>=i.length?r=0:r+a<0?r=i.length-1:r+=a,this.previousFocus=this.currentFocus;const o=i[r];if("backward"===this.tabDirection&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;if(o&&this.possiblyHasTabbableChildren(o))return;t.preventDefault(),this.currentFocus=o,null==(e=this.currentFocus)||e.focus({preventScroll:!1});const n=[...bi()];if(n.includes(this.currentFocus)||!n.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=t,this.elementsWithTabbableControls=["iframe"]}activate(){vi.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){vi=vi.filter(t=>t!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return vi[vi.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){if(this.isActive()&&!this.isExternalActivated){const t=mi(this.element);if(!this.element.matches(":focus-within")){const e=t[0],o=t[t.length-1],i="forward"===this.tabDirection?e:o;"function"==typeof(null==i?void 0:i.focus)&&(this.currentFocus=i,i.focus({preventScroll:!1}))}}}possiblyHasTabbableChildren(t){return this.elementsWithTabbableControls.includes(t.tagName.toLowerCase())||t.hasAttribute("controls")}},zi={success:"pass-face",warning:"tip-face2",danger:"close-face1"},xi=new Set(["default","success","warning","danger"]),_i=class extends s.X{constructor(){super(...arguments),this.hasSlotController=new me.X(this,"footer"),this.modal=new yi(this),this.open=!1,this.title="",this.subTitle="",this.type="default",this.noHeader=!1,this.noFooter=!1,this.noClose=!1,this.noCancel=!1,this.cancelText="取消",this.noConfirm=!1,this.confirmText="确定",this.handleDocumentKeyDown=t=>{"Escape"===t.key&&this.modal.isActive()&&this.open&&(t.stopPropagation(),this.requestClose("keyboard"))}}get hasFooterSlot(){return this.hasSlotController.test("footer")}get showDefaultFooterActions(){return!(this.hasFooterSlot||this.noCancel&&this.noConfirm)}get hasVisibleFooter(){return!this.noFooter&&(this.hasFooterSlot||this.showDefaultFooterActions)}getAnimationDir(){return"rtl"===(this.dir||document.documentElement.getAttribute("dir")||"ltr").toLowerCase()?"rtl":"ltr"}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),Oe(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),Le(this),this.removeOpenListeners()}async runBeforeHook(t){return!t||await t()}async runBeforeCancel(t){return!this.beforeCancel||await this.beforeCancel(t)}async dispatchCancel(t){return!!await this.runBeforeCancel(t)&&!this.emit("bzl-cancel",{cancelable:!0}).defaultPrevented}async handleDefaultConfirm(){await this.runBeforeHook(this.beforeConfirm)&&(this.emit("bzl-confirm",{cancelable:!0}).defaultPrevented||this.hide())}async handleDefaultCancel(){await this.runBeforeHook(this.beforeBtnCancel)&&(this.emit("bzl-btn-cancel",{cancelable:!0}).defaultPrevented||await this.hideAfterCancel("cancel-button"))}async hideAfterCancel(t){await this.dispatchCancel(t)&&this.hide()}async requestClose(t){if(this.emit("bzl-request-close",{cancelable:!0,detail:{source:t}}).defaultPrevented){const t=Nt(this,"dialog.denyClose",{dir:this.getAnimationDir()});return void Dt(this.panel,t.keyframes,t.options)}await this.hideAfterCancel(t)}addOpenListeners(){var t;"CloseWatcher"in window?(null==(t=this.closeWatcher)||t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.requestClose("keyboard")}):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var t;null==(t=this.closeWatcher)||t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}async handleOpenChange(){const t=this.getAnimationDir();if(this.open){this.emit("bzl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),Oe(this);const e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([Ot(this.dialog),Ot(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("bzl-initial-focus",{cancelable:!0}).defaultPrevented||(e?e.focus({preventScroll:!0}):this.panel.focus({preventScroll:!0})),e&&e.setAttribute("autofocus","")});const o=Nt(this,"dialog.show",{dir:t}),i=Nt(this,"dialog.overlay.show",{dir:t});await Promise.all([Dt(this.panel,o.keyframes,o.options),Dt(this.overlay,i.keyframes,i.options)]),this.emit("bzl-after-show")}else{(t=>{var e;const{activeElement:o}=document;o&&t.contains(o)&&(null==(e=document.activeElement)||e.blur())})(this),this.emit("bzl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([Ot(this.dialog),Ot(this.overlay)]);const e=Nt(this,"dialog.hide",{dir:t}),o=Nt(this,"dialog.overlay.hide",{dir:t});await Promise.all([Dt(this.overlay,o.keyframes,o.options).then(()=>{this.overlay.hidden=!0}),Dt(this.panel,e.keyframes,e.options).then(()=>{this.panel.hidden=!0})]),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,Le(this);const i=this.originalTrigger;"function"==typeof(null==i?void 0:i.focus)&&setTimeout(()=>i.focus()),this.emit("bzl-after-hide")}}handleTypeChange(){xi.has(this.type)||(this.type="default")}getStatusIcon(){if("default"!==this.type)return zi[this.type]}async show(){if(!this.open)return this.open=!0,Lt(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Lt(this,"bzl-after-hide")}render(){const t=this.getStatusIcon();return i.x`
      <div
        part="base"
        class=${(0,n.e)({dialog:!0,"dialog--open":this.open,"dialog--no-header":this.noHeader,"dialog--no-footer":this.noFooter,"dialog--has-footer":this.hasVisibleFooter,"dialog--type-success":"success"===this.type,"dialog--type-warning":"warning"===this.type,"dialog--type-danger":"danger"===this.type})}
      >
        <div
          part="overlay"
          class="dialog__overlay"
          @click=${()=>{this.requestClose("overlay")}}
          tabindex="-1"
        ></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${ae(this.noHeader?this.title:void 0)}
          aria-labelledby=${ae(this.noHeader?void 0:"title")}
          tabindex="-1"
        >
          ${this.noHeader?"":i.x`
                <header part="header" class="dialog__header">
                  <div part="header-main" class="dialog__header-main">
                    <div class="dialog__header-text">
                      <div class="dialog__title-row">
                        ${t?i.x`<bzl-icon
                              part="status-icon"
                              class="dialog__status-icon"
                              name=${t}
                            ></bzl-icon>`:""}
                        <h2 part="title" class="dialog__title" id="title">
                          ${this.title.length>0?this.title:String.fromCharCode(65279)}
                        </h2>
                      </div>
                      ${this.subTitle?i.x`<p part="sub-title" class="dialog__sub-title">${this.subTitle}</p>`:""}
                    </div>
                  </div>
                </header>
              `}
          ${this.noClose?"":i.x`
                <div class="dialog__header-actions">
                  <bzl-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="dialog__close"
                    variant="text"
                    size="small"
                    shape="circle"
                    title="关闭"
                    @click="${()=>{this.requestClose("close-button")}}"
                  >
                    <bzl-icon slot="icon" name="improper-outline"></bzl-icon>
                  </bzl-button>
                </div>
              `}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
            ${this.showDefaultFooterActions?i.x`
                  <div class="dialog__footer-actions">
                    ${this.noCancel?"":i.x`
                          <bzl-button
                            part="cancel-button"
                            exportparts="base:cancel-button__base"
                            class="dialog__footer-cancel"
                            variant="outline"
                            theme="neutral"
                            @click=${()=>{this.handleDefaultCancel()}}
                          >
                            ${this.cancelText}
                          </bzl-button>
                        `}
                    ${this.noConfirm?"":i.x`
                          <bzl-button
                            part="confirm-button"
                            exportparts="base:confirm-button__base"
                            class="dialog__footer-confirm"
                            variant="primary"
                            @click=${()=>{this.handleDefaultConfirm()}}
                          >
                            ${this.confirmText}
                          </bzl-button>
                        `}
                  </div>
                `:""}
          </footer>
        </div>
      </div>
    `}};_i.styles=[l.$,ai],_i.dependencies={"bzl-button":ui,"bzl-icon":he.K},(0,c.Cc)([(0,s.e)(".dialog")],_i.prototype,"dialog",2),(0,c.Cc)([(0,s.e)(".dialog__panel")],_i.prototype,"panel",2),(0,c.Cc)([(0,s.e)(".dialog__overlay")],_i.prototype,"overlay",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],_i.prototype,"open",2),(0,c.Cc)([(0,s.n)({reflect:!0})],_i.prototype,"title",2),(0,c.Cc)([(0,s.n)({attribute:"sub-title",reflect:!0})],_i.prototype,"subTitle",2),(0,c.Cc)([(0,s.n)({reflect:!0})],_i.prototype,"type",2),(0,c.Cc)([(0,s.n)({attribute:"no-header",type:Boolean,reflect:!0})],_i.prototype,"noHeader",2),(0,c.Cc)([(0,s.n)({attribute:"no-footer",type:Boolean,reflect:!0})],_i.prototype,"noFooter",2),(0,c.Cc)([(0,s.n)({attribute:"no-close",type:Boolean,reflect:!0})],_i.prototype,"noClose",2),(0,c.Cc)([(0,s.n)({attribute:"no-cancel",type:Boolean,reflect:!0})],_i.prototype,"noCancel",2),(0,c.Cc)([(0,s.n)({attribute:"cancel-text",reflect:!0})],_i.prototype,"cancelText",2),(0,c.Cc)([(0,s.n)({attribute:"no-confirm",type:Boolean,reflect:!0})],_i.prototype,"noConfirm",2),(0,c.Cc)([(0,s.n)({attribute:"confirm-text",reflect:!0})],_i.prototype,"confirmText",2),(0,c.Cc)([(0,s.n)({attribute:!1})],_i.prototype,"beforeConfirm",2),(0,c.Cc)([(0,s.n)({attribute:!1})],_i.prototype,"beforeCancel",2),(0,c.Cc)([(0,s.n)({attribute:!1})],_i.prototype,"beforeBtnCancel",2),(0,c.Cc)([(0,Mt.w)("open",{waitUntilFirstUpdate:!0})],_i.prototype,"handleOpenChange",1),(0,c.Cc)([(0,Mt.w)("type")],_i.prototype,"handleTypeChange",1),Rt("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}}),Rt("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}}),Rt("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),Rt("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),Rt("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}});var wi=_i;_i.define("bzl-dialog");var ki=i.i`
  :host {
    --color: var(--bzl-panel-divider-color);
    --width: var(--bzl-panel-border-width);
    --spacing: var(--bzl-spacing-5);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host(:not([vertical])[dashed]) {
    border-top-style: dashed;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }

  :host([vertical][dashed]) {
    border-left-style: dashed;
  }
`,Ci=class extends s.X{constructor(){super(...arguments),this.vertical=!1,this.dashed=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}};Ci.styles=[l.$,ki],(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ci.prototype,"vertical",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ci.prototype,"dashed",2),(0,c.Cc)([(0,Mt.w)("vertical")],Ci.prototype,"handleVerticalChange",1);var $i=Ci;Ci.define("bzl-divider");var Si=i.i`
  :host {
    display: inline-block;
    line-height: 0;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    color: var(--bzl-input-label-color);
    cursor: pointer;
    --toggle-size: var(--bzl-toggle-size-medium);
    font-size: var(--bzl-input-font-size-medium);
    vertical-align: middle;
  }

  .checkbox__control {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    box-sizing: border-box;
    border: solid var(--bzl-toggle-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-border-radius-x-small);
    background-color: var(--bzl-input-background-color);
    color: var(--bzl-color-neutral-0);
    transition:
      var(--bzl-transition-fast) border-color,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    font-size: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--bzl-input-border-color-hover);
    background-color: var(--bzl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--bzl-color-primary-600);
    background-color: var(--bzl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--bzl-color-primary-700);
    background-color: var(--bzl-color-primary-700);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    /* opacity: 0.5; */
    cursor: not-allowed;
  }

  .checkbox.checkbox--disabled .checkbox__control {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color);
    color: var(--bzl-color-neutral-500);
  }

  .checkbox.checkbox--disabled .checkbox__label {
    color: var(--bzl-input-color-disabled);
  }

  .checkbox__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    line-height: var(--bzl-line-height-dense);
    margin-inline-start: var(--bzl-spacing-4);
    user-select: none;
    -webkit-user-select: none;
  }
`,Ei=class extends s.X{constructor(){super(...arguments),this.hasFocus=!1,this.name="",this.disabled=!1,this.checked=!1,this.indeterminate=!1}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("bzl-change")}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleInput(){this.emit("bzl-input")}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate}render(){return i.x`
      <label
        part="base"
        class=${(0,n.e)({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          name=${this.name}
          value=${ae(this.value)}
          .indeterminate=${re(this.indeterminate)}
          .checked=${re(this.checked)}
          .disabled=${this.disabled}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
          class="checkbox__control"
        >
          ${this.checked?i.x` <bzl-icon part="checked-icon" class="checkbox__checked-icon" name="checkall-outline"></bzl-icon> `:""}
          ${!this.checked&&this.indeterminate?i.x`
                <bzl-icon
                  part="indeterminate-icon"
                  class="checkbox__indeterminate-icon"
                  name="checkpart-outline"
                ></bzl-icon>
              `:""}
        </span>

        <div part="label" class="checkbox__label">
          <slot></slot>
        </div>
      </label>
    `}};Ei.styles=[l.$,Ae,Si],Ei.dependencies={"bzl-icon":he.K},(0,c.Cc)([(0,s.e)('input[type="checkbox"]')],Ei.prototype,"input",2),(0,c.Cc)([(0,s.r)()],Ei.prototype,"hasFocus",2),(0,c.Cc)([(0,s.n)()],Ei.prototype,"name",2),(0,c.Cc)([(0,s.n)()],Ei.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ei.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ei.prototype,"checked",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Ei.prototype,"indeterminate",2),(0,c.Cc)([(0,Mt.w)(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],Ei.prototype,"handleStateChange",1);var Ai=i.i`
  :host {
    display: inline-block;
    --bzl-cascader-panel-column-width: 180px;
    --bzl-cascader-panel-option-height: 36px;
    font-size: var(--bzl-font-size-small);
  }

  .cascader__panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    max-height: calc(var(--bzl-cascader-panel-option-height) * 5.5 + var(--bzl-spacing-2) * 2);
    border-radius: var(--bzl-border-radius-regular);
    background-color: var(--bzl-color-neutral-0);
    box-shadow: var(--bzl-shadow-neutral-light);
    border: var(--bzl-input-border-width) solid var(--bzl-color-neutral-300);
    overflow: hidden;
  }

  .cascader__columns {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow-x: auto;
  }

  .cascader__column {
    flex: 0 0 var(--bzl-cascader-panel-column-width);
    width: var(--bzl-cascader-panel-column-width);
    border-right: var(--bzl-input-border-width) solid var(--bzl-color-gray-100);
    overflow-y: auto;
    padding: var(--bzl-spacing-2);
    box-sizing: border-box;
  }

  .cascader__column:last-child {
    border-right: none;
  }

  .cascader__option:not(:last-child) {
    margin-block-end: var(--bzl-spacing-1);
  }

  .cascader__option {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--bzl-cascader-panel-option-height);
    padding: 0 var(--bzl-scene-padding-11);
    cursor: pointer;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-cascader-panel-option-height);
    color: var(--bzl-color-neutral-900);
    background-color: var(--bzl-color-neutral-0);
    border-radius: var(--bzl-border-radius-small);
    transition:
      background-color var(--bzl-transition-fast) ease,
      color var(--bzl-transition-fast) ease;
  }

  .cascader__option-label {
    flex: 1;
    min-width: 0;
    line-height: var(--bzl-cascader-panel-option-height);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cascader__option-expand-icon {
    margin-left: var(--bzl-spacing-2);
    color: var(--bzl-color-neutral-500);
  }

  .cascader__option:hover:not(.cascader__option--disabled) {
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-1000);
  }

  .cascader__option--in-selected-path:not(.cascader__option--disabled) {
    color: var(--bzl-color-primary-700);
  }

  .cascader__option--in-selected-path:not(.cascader__option--disabled) .cascader__option-label {
    color: var(--bzl-color-primary-700);
  }

  .cascader__option--disabled {
    cursor: not-allowed;
    color: var(--bzl-color-neutral-500);
  }

  .cascader__option--disabled:hover {
    background-color: transparent;
  }
`,Pi=class extends s.X{constructor(){super(...arguments),this.options=[],this.value=[],this.multiple=!1,this.defaultExpandAllColumns=!1,this.checkStrategy="parent",this.activePath=[],this.flattened=[]}get normalizedValue(){return this.multiple?this.value||[]:[this.value||[]]}setNormalizedValue(t){this.multiple?this.value=t:this.value=t[0]||[]}connectedCallback(){super.connectedCallback(),this.flattened=this.flattenOptions(this.options),this.ensureInitialActivePath()}updated(t){t.has("options")&&(this.flattened=this.flattenOptions(this.options)),(t.has("options")||t.has("value"))&&this.ensureInitialActivePath()}ensureInitialActivePath(){if(!this.options||0===this.options.length)return;if(this.activePath.length>0)return;const t=this.normalizedValue.find(t=>Array.isArray(t)&&t.length>0);if(t&&this.flattened.length>0){const e=this.flattened.find(e=>e.values.length===t.length&&e.values.every((e,o)=>e===t[o]));if(e)return void(this.activePath=e.path)}if(!this.defaultExpandAllColumns)return;const e=[];let o=this.getChildren(null);for(;o.length>0;){const t=o[0];e.push(t),o=this.getChildren(t)}this.activePath=e}getChildren(t){if(!t)return this.options||[];const e=t.children;return Array.isArray(e)?e:[]}isLeaf(t){return 0===this.getChildren(t).length}getLabel(t){return(null==t?void 0:t.label)||""}getValue(t){return(null==t?void 0:t.value)||""}isDisabled(t){return Boolean(t&&t.disabled)}flattenOptions(t){const e=[],o=(t,i)=>{t.forEach(t=>{const r=[...i,t],a=r.map(t=>this.getLabel(t)),n=r.map(t=>this.getValue(t));e.push({path:r,labels:a,values:n});const l=this.getChildren(t);l.length&&o(l,r)})};return o(t||[],[]),e}isPathSelected(t){return this.normalizedValue.some(e=>e.length===t.length&&e.every((e,o)=>e===t[o]))}getLeafDescendantPaths(t){return this.flattened.filter(e=>{if(e.values.length<=t.length)return!1;if(!t.every((t,o)=>e.values[o]===t))return!1;const o=e.path[e.path.length-1];return this.isLeaf(o)})}serializePath(t){return JSON.stringify(t)}isStringArray(t){return Array.isArray(t)&&t.every(t=>"string"==typeof t)}deserializePath(t){try{const e=JSON.parse(t);return this.isStringArray(e)?e:[]}catch(t){return[]}}getCheckState(t){const e=this.getLeafDescendantPaths(t);if(0===e.length)return{checked:this.isPathSelected(t),indeterminate:!1};const o=new Set(this.normalizedValue.map(t=>this.serializePath(t))),i=e.filter(t=>o.has(this.serializePath(t.values))).length;return 0===i?{checked:!1,indeterminate:!1}:i===e.length?{checked:!0,indeterminate:!1}:{checked:!1,indeterminate:!0}}isPathOnActivePath(t){const e=this.activePath.map(t=>this.getValue(t));return t.length<=e.length&&t.every((t,o)=>t===e[o])}toggleOption(t,e){if(this.isDisabled(t))return;const o=[...this.activePath.slice(0,e),t],i=o.map(t=>this.getValue(t)),r=this.isLeaf(t);this.multiple?r||(this.activePath=o):r?this.selectPath(i):this.activePath=o}handleCheckboxToggle(t,e){if(this.isDisabled(t))return;const o=[...this.activePath.slice(0,e),t],i=o.map(t=>this.getValue(t));"parent"===this.checkStrategy?this.toggleWithDescendants(o):this.toggleSinglePath(i)}selectPath(t){this.multiple?this.toggleSinglePath(t):(this.setNormalizedValue([t]),this.emit("bzl-change"))}toggleSinglePath(t){const e=this.normalizedValue,o=e.some(e=>e.length===t.length&&e.every((e,o)=>e===t[o]))?e.filter(e=>!(e.length===t.length&&e.every((e,o)=>e===t[o]))):[...e,t];this.setNormalizedValue(o),this.emit("bzl-change")}toggleWithDescendants(t){const e=t.map(t=>this.getValue(t)),o=this.getLeafDescendantPaths(e),i=0===o.length?[e]:o.map(t=>t.values),r=new Set(this.normalizedValue.map(t=>this.serializePath(t))),a=i.every(t=>r.has(this.serializePath(t))),n=new Set(r);a?i.forEach(t=>{n.delete(this.serializePath(t))}):i.forEach(t=>{n.add(this.serializePath(t))});const l=Array.from(n).map(t=>this.deserializePath(t));this.setNormalizedValue(l),this.emit("bzl-change")}renderColumns(){const t=[],e=this.getChildren(null);return t.push(e),this.activePath.forEach(e=>{const o=this.getChildren(e);o.length&&t.push(o)}),i.x`
      <div class="cascader__columns">
        ${t.map((t,e)=>i.x`
            <div class="cascader__column">${t.map(t=>this.renderOption(t,e))}</div>
          `)}
      </div>
    `}renderOption(t,e){const o=this.getLabel(t),r=this.isLeaf(t),a=[...this.activePath.slice(0,e),t].map(t=>this.getValue(t)),l=this.isPathSelected(a),s=this.isPathOnActivePath(a),c=this.isDisabled(t),d=this.multiple,h=this.multiple&&"parent"===this.checkStrategy&&d?this.getCheckState(a):null,p=h?h.checked:l,u=!!h&&h.indeterminate,b=p||u||l,g=this.multiple?r?b:s||b:l||s;return i.x`
      <div
        class=${(0,n.e)({cascader__option:!0,"cascader__option--selected":b,"cascader__option--in-selected-path":g,"cascader__option--disabled":c})}
        @click=${()=>this.toggleOption(t,e)}
      >
        ${d?i.x`
              <bzl-checkbox
                .checked=${p}
                .indeterminate=${u}
                .disabled=${c}
                @bzl-change=${o=>{o.stopPropagation(),this.handleCheckboxToggle(t,e)}}
              >
              </bzl-checkbox>
            `:null}

        <div class="cascader__option-label">${o}</div>

        ${r?null:i.x` <bzl-icon class="cascader__option-expand-icon" name="rightback-small-outline2"></bzl-icon> `}
      </div>
    `}render(){return i.x` <div class="cascader__panel">${this.renderColumns()}</div> `}};Pi.styles=[l.$,Ai],Pi.dependencies={"bzl-checkbox":Ei,"bzl-icon":he.K},(0,c.Cc)([(0,s.n)({attribute:!1})],Pi.prototype,"options",2),(0,c.Cc)([(0,s.n)({attribute:!1})],Pi.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Pi.prototype,"multiple",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"default-expand-all-columns"})],Pi.prototype,"defaultExpandAllColumns",2),(0,c.Cc)([(0,s.n)({attribute:"check-strategy"})],Pi.prototype,"checkStrategy",2),(0,c.Cc)([(0,s.r)()],Pi.prototype,"activePath",2),(0,c.Cc)([(0,s.r)()],Pi.prototype,"flattened",2);var Ti=Pi;Pi.define("bzl-cascader-panel");var Di=Ei;Ei.define("bzl-checkbox");var Fi=i.i`
  :host {
    display: inline-block;
  }

  .checkbox-group {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--bzl-group-gap-medium);
  }
`,Oi=class extends s.X{constructor(){super(...arguments),this.checkboxElements=[],this.name="",this.value=[],this.disabled=!1,this.handleCheckboxChange=t=>{t.stopPropagation();const e=this.checkboxElements.filter(t=>t.checked).map(t=>t.value);this.value=e,this.emit("bzl-change")}}getAllCheckboxes(){return[...this.querySelectorAll("bzl-checkbox")]}handleSlotChange(){this.checkboxElements.forEach(t=>{t.removeEventListener("bzl-change",this.handleCheckboxChange)});const t=this.getAllCheckboxes();this.checkboxElements=t,this.checkboxElements.forEach(t=>{t.addEventListener("bzl-change",this.handleCheckboxChange)}),this.syncCheckboxesFromValue(!0),this.syncDisabledToChildren(!0)}syncCheckboxesFromValue(t){const e=Array.isArray(this.value)?this.value:null===this.value||void 0===this.value?[]:[String(this.value)];t&&0===e.length||this.checkboxElements.forEach(t=>{var o;const i=null!=(o=t.value)?o:"";t.checked=e.includes(i)})}syncDisabledToChildren(t){t&&!this.disabled||this.checkboxElements.forEach(t=>{t.disabled=this.disabled})}handleValueChange(){this.syncCheckboxesFromValue()}handleDisabledChange(){this.syncDisabledToChildren()}render(){return i.x`
      <div class="checkbox-group" part="base">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}};Oi.styles=[l.$,Fi],Oi.dependencies={"bzl-checkbox":Ei},(0,c.Cc)([(0,s.e)("slot")],Oi.prototype,"defaultSlot",2),(0,c.Cc)([(0,s.r)()],Oi.prototype,"checkboxElements",2),(0,c.Cc)([(0,s.n)()],Oi.prototype,"name",2),(0,c.Cc)([(0,s.n)({attribute:"value"})],Oi.prototype,"value",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Oi.prototype,"disabled",2),(0,c.Cc)([(0,Mt.w)("value",{waitUntilFirstUpdate:!0})],Oi.prototype,"handleValueChange",1),(0,c.Cc)([(0,Mt.w)("disabled",{waitUntilFirstUpdate:!0})],Oi.prototype,"handleDisabledChange",1);var Li=Oi;Oi.define("bzl-checkbox-group");var Bi=ui;ui.define("bzl-button"),o(6482);var Ii=i.i`
  :host {
    display: block;
  }

  .cascader {
    display: flex;
  }

  .cascader-popup::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .cascader-popup[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .cascader-popup[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox - 与 select 入口样式一致 */
  .cascader__anchor {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    line-height: var(--bzl-line-height-2x-loose);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-small);
    box-sizing: border-box;
    min-height: var(--bzl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--bzl-spacing-5);
  }

  .cascader--standard .cascader__anchor {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .cascader--standard:not(.cascader--disabled):hover .cascader__anchor {
    border-color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled):hover .cascader__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled).cascader--open .cascader__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled).cascader--open .cascader__anchor,
  .cascader--standard:not(.cascader--disabled).cascader--focused .cascader__anchor {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: var(--bzl-shadow-focus);
  }

  .cascader--standard.cascader--disabled .cascader__anchor {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    color: var(--bzl-input-color-disabled);
    cursor: not-allowed;
    outline: none;
  }

  .cascader__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
  }

  .cascader__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .cascader--multiple:not(.cascader--placeholder-visible) .cascader__prefix::slotted(*) {
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader--multiple:not(.cascader--placeholder-visible) .cascader__anchor {
    padding-inline-start: 0;
    padding-block: 5px;
  }

  .cascader--multiple.cascader--custom-label:not(.cascader--placeholder-visible) .cascader__anchor {
    padding-block: 0;
  }

  .cascader__label {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--bzl-spacing-2);
  }

  .cascader__placeholder {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--bzl-input-placeholder-color);
  }

  .cascader__single-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--bzl-input-color);
  }

  .cascader:not(.cascader--disabled):hover .cascader__single-text {
    color: var(--bzl-input-color-hover);
  }

  .cascader__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--bzl-input-padding-leftright);
    gap: var(--bzl-spacing-2);
  }

  .cascader__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-1);
    max-width: 120px;
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-900);
    border: none;
    border-radius: var(--bzl-border-radius-small);
    padding-inline: var(--bzl-spacing-4);
    padding-block: var(--bzl-spacing-1);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-spacing-7);
    cursor: pointer;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color;
  }

  .cascader__tag:hover {
    background-color: var(--bzl-color-neutral-300);
  }

  .cascader__tag--collapse {
    cursor: default;
  }

  .cascader__tag--collapse:hover {
    background-color: var(--bzl-color-neutral-200);
  }

  .cascader--disabled .cascader__tag {
    cursor: not-allowed;
  }

  .cascader__tag-text {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cascader__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    margin-left: var(--bzl-spacing-1);
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    color: var(--bzl-color-neutral-700);
    width: 12px;
    height: 12px;
    transition: var(--bzl-transition-fast) color;
  }

  .cascader__tag-remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  .cascader__tag-remove bzl-icon {
    font-size: var(--bzl-font-size-2x-small);
  }

  .cascader__suffix {
    display: inline-flex;
    align-items: center;
  }

  .cascader__clear {
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
    display: none;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader__anchor:hover .cascader__clear {
    display: inline-flex;
  }

  .cascader__anchor:hover .cascader__clear ~ .cascader__expand-icon {
    display: none;
  }

  .cascader__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .cascader__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--bzl-color-neutral-600);
    transition: var(--bzl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader--open .cascader__expand-icon {
    rotate: -180deg;
  }
`,Vi=class extends s.X{constructor(){super(...arguments),this.options=[],this.value=[],this.placeholder="",this.separator="/",this.multiple=!1,this.defaultExpandAllColumns=!1,this.checkStrategy="parent",this.disabled=!1,this.clearable=!1,this.placement="bottom",this.hoist=!1,this.maxTagsVisible=1,this.collapseTags=!1,this.open=!1,this.hasCustomLabel=!1,this.handleDocumentMouseDown=t=>{t.composedPath().includes(this)||this.hide()}}get hasValue(){return this.multiple,(this.value||[]).length>0}getDisplayLabelForPath(t,e=this.options){var o;if(!Array.isArray(t)||0===t.length||!(null==e?void 0:e.length))return"";const i=[];let r=e;for(const e of t){const t=r.find(t=>{var o;return(null!=(o=t.value)?o:"")===e});if(!t)break;i.push(String(null!=(o=t.label)?o:""));const a=Array.isArray(t.children)?t.children:[];if(0===a.length)break;r=a}return i.join(this.separator)}handleLabelSlotChange(){if(!this.labelSlot)return void(this.hasCustomLabel=!1);const t=this.labelSlot.assignedNodes({flatten:!0});this.hasCustomLabel=!!t&&t.length>0}async show(){if(!this.open&&!this.disabled)return this.open=!0,this.handleOpenChange(),Lt(this,"bzl-after-show")}async hide(){if(this.open&&!this.disabled)return this.open=!1,this.handleOpenChange(),Lt(this,"bzl-after-hide")}handleAnchorMouseDown(t){this.disabled||(t.preventDefault(),this.open=!this.open,this.handleOpenChange())}handleClearMouseDown(t){t.stopPropagation(),t.preventDefault()}handleClearClick(t){t.stopPropagation(),this.hasValue&&(this.value=[],this.emit("bzl-clear"),this.emit("bzl-change"))}handleOpenChange(){this.open&&!this.disabled?(this.emit("bzl-show"),document.addEventListener("mousedown",this.handleDocumentMouseDown),this.updateComplete.then(async()=>{await Ot(this),this.popup.active=!0;const{keyframes:t,options:e}=Nt(this,"cascader.show",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.emit("bzl-after-show")})):(this.emit("bzl-hide"),document.removeEventListener("mousedown",this.handleDocumentMouseDown),this.updateComplete.then(async()=>{await Ot(this);const{keyframes:t,options:e}=Nt(this,"cascader.hide",{dir:"ltr"});await Dt(this.popup.popup,t,e),this.popup.active=!1,this.emit("bzl-after-hide")}))}get displayText(){if(this.multiple)return"";const t=this.value;return Array.isArray(t)&&t.length?this.getDisplayLabelForPath(t):""}get visibleTags(){const t=this.value||[],e=t.length;if(!this.multiple)return{tags:[],restCount:0};let o=e;return this.collapseTags&&this.maxTagsVisible>0&&(o=Math.min(this.maxTagsVisible,e)),{tags:t.slice(0,o).map(t=>({pathValues:t,label:this.getDisplayLabelForPath(t)})),restCount:this.collapseTags&&this.maxTagsVisible>0&&e>this.maxTagsVisible?e-this.maxTagsVisible:0}}handleTagRemoveClick(t,e){if(e.stopPropagation(),!this.panel)return;const o=(this.panel.value||[]).filter(e=>!(e.length===t.length&&e.every((e,o)=>e===t[o])));this.panel.value=o,this.value=o,this.emit("bzl-change")}handlePanelChange(t){t.stopPropagation(),this.panel&&(this.value=(this.multiple,this.panel.value||[]),this.emit("bzl-change"),this.multiple||this.hide())}renderAnchorContent(){const t=this.clearable&&!this.disabled&&this.hasValue;if(!this.hasValue)return i.x`
        <slot part="prefix" name="prefix" class="cascader__prefix"></slot>
        <div class="cascader__label">
          <span class="cascader__placeholder">${this.placeholder}</span>
        </div>
        <div class="cascader__suffix">
          ${t?i.x`
                <button
                  class="cascader__clear"
                  type="button"
                  aria-label="Clear"
                  @mousedown=${this.handleClearMouseDown}
                  @click=${this.handleClearClick}
                >
                  <bzl-icon name="close-face1"></bzl-icon>
                </button>
              `:null}
          <slot name="expand-icon" part="expand-icon" class="cascader__expand-icon">
            <bzl-icon name="down-outline"></bzl-icon>
          </slot>
        </div>
      `;const{tags:e,restCount:o}=this.visibleTags;return i.x`
      <slot part="prefix" name="prefix" class="cascader__prefix"></slot>
      <div class="cascader__label">
        <slot name="label" @slotchange=${this.handleLabelSlotChange}>
          ${this.multiple?i.x`
                <div class="cascader__tags">
                  ${e.map(t=>i.x`
                      <div class="cascader__tag">
                        <span class="cascader__tag-text">${t.label}</span>
                        <button
                          class="cascader__tag-remove"
                          type="button"
                          aria-label="Remove"
                          @click=${e=>this.handleTagRemoveClick(t.pathValues,e)}
                        >
                          <bzl-icon name="improper-outline"></bzl-icon>
                        </button>
                      </div>
                    `)}
                  ${o>0?i.x`
                        <div class="cascader__tag cascader__tag--collapse">
                          <span class="cascader__tag-text">+${o}</span>
                        </div>
                      `:null}
                </div>
              `:i.x` <span class="cascader__single-text">${this.displayText}</span> `}
        </slot>
      </div>

      <div class="cascader__suffix">
        ${t?i.x`
              <button
                class="cascader__clear"
                type="button"
                aria-label="Clear"
                @mousedown=${this.handleClearMouseDown}
                @click=${this.handleClearClick}
              >
                <bzl-icon name="close-face1"></bzl-icon>
              </button>
            `:null}
        <slot name="expand-icon" part="expand-icon" class="cascader__expand-icon">
          <bzl-icon name="down-outline"></bzl-icon>
        </slot>
      </div>
    `}render(){const t=!!this.placeholder&&!this.hasValue;return i.x`
      <bzl-popup
        class=${(0,n.e)({"cascader-popup":!0,cascader:!0,"cascader--standard":!0,"cascader--open":this.open,"cascader--disabled":this.disabled,"cascader--multiple":this.multiple,"cascader--placeholder-visible":t,"cascader--custom-label":this.hasCustomLabel})}
        placement=${this.placement}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        distance=${2}
        sync="width"
      >
        <div class="cascader__anchor" slot="anchor" @mousedown=${this.handleAnchorMouseDown}>
          ${this.renderAnchorContent()}
        </div>

        <bzl-cascader-panel
          .options=${this.options}
          .value=${this.value}
          .multiple=${this.multiple}
          .checkStrategy=${this.checkStrategy}
          .defaultExpandAllColumns=${this.defaultExpandAllColumns}
          @bzl-change=${this.handlePanelChange}
        >
        </bzl-cascader-panel>
      </bzl-popup>
    `}};Vi.styles=[l.$,Ii],Vi.dependencies={"bzl-cascader-panel":Pi,"bzl-popup":Tt,"bzl-checkbox":Ei,"bzl-icon":he.K},(0,c.Cc)([(0,s.e)(".cascader-popup")],Vi.prototype,"popup",2),(0,c.Cc)([(0,s.e)("bzl-cascader-panel")],Vi.prototype,"panel",2),(0,c.Cc)([(0,s.e)('slot[name="label"]')],Vi.prototype,"labelSlot",2),(0,c.Cc)([(0,s.n)({attribute:!1})],Vi.prototype,"options",2),(0,c.Cc)([(0,s.n)({attribute:!1})],Vi.prototype,"value",2),(0,c.Cc)([(0,s.n)()],Vi.prototype,"placeholder",2),(0,c.Cc)([(0,s.n)()],Vi.prototype,"separator",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Vi.prototype,"multiple",2),(0,c.Cc)([(0,s.n)({type:Boolean,attribute:"default-expand-all-columns"})],Vi.prototype,"defaultExpandAllColumns",2),(0,c.Cc)([(0,s.n)({attribute:"check-strategy"})],Vi.prototype,"checkStrategy",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Vi.prototype,"disabled",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Vi.prototype,"clearable",2),(0,c.Cc)([(0,s.n)({reflect:!0})],Vi.prototype,"placement",2),(0,c.Cc)([(0,s.n)({type:Boolean})],Vi.prototype,"hoist",2),(0,c.Cc)([(0,s.n)({attribute:"max-tags-visible",type:Number})],Vi.prototype,"maxTagsVisible",2),(0,c.Cc)([(0,s.n)({attribute:"collapse-tags",type:Boolean})],Vi.prototype,"collapseTags",2),(0,c.Cc)([(0,s.r)()],Vi.prototype,"open",2),(0,c.Cc)([(0,s.r)()],Vi.prototype,"hasCustomLabel",2),Rt("cascader.show",{keyframes:[{opacity:0,transform:"scale(0.9, 0.9)"},{opacity:1,transform:"scale(1, 1)"}],options:{duration:200,easing:"ease"}}),Rt("cascader.hide",{keyframes:[{opacity:1,transform:"scale(1, 1)"},{opacity:0,transform:"scale(0.9, 0.9)"}],options:{duration:150,easing:"ease"}});var Ri=Vi;Vi.define("bzl-cascader"),o(4843),o(3589);var Ni=o(4680),Mi="";function qi(t){Mi=t}function ji(t=""){if(!Mi){const t=[...document.getElementsByTagName("script")],e=t.find(t=>t.hasAttribute("data-bzl-design"));if(e)qi(e.getAttribute("data-bzl-design"));else{const e=t.find(t=>/bzl-design(\.min)?\.js($|\?)/.test(t.src)||/bzl-design-autoloader(\.min)?\.js($|\?)/.test(t.src));let o="";e&&(o=e.getAttribute("src")),qi(o.split("/").slice(0,-1).join("/"))}}return Mi.replace(/\/$/,"")+(t?`/${t.replace(/^\//,"")}`:"")}var Wi=i.i`
  :host {
    display: inline-block;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: var(--bzl-color-neutral-400);
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
  }

  .avatar--circle,
  .avatar--circle .avatar__image {
    border-radius: var(--bzl-border-radius-circle);
  }

  .avatar__default {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .avatar__default .avatar__default-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }

  .avatar__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    min-height: 16px;
    font-size: 12px;
    line-height: 1;
    z-index: 1;
  }

  .avatar__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`,Hi=class extends s.X{constructor(){super(...arguments),this.hasError=!1,this.image="",this.loading="eager",this.size=48}handleImageChange(){this.hasError=!1}handleImageLoadError(){this.hasError=!0,this.emit("bzl-error")}render(){const t=i.x`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${this.handleImageLoadError}"
      />
    `,e=i.x`
      <div part="default" class="avatar__default" aria-hidden="true">
        <img
          class="avatar__default-image"
          src="https://static.zhipin.com/assets/bzl-design/components/avatar/default-avatar.svg"
          alt=""
        />
      </div>
    `,o=i.x`
      <div part="badge" class="avatar__badge">
        <slot name="badge"></slot>
      </div>
    `;return i.x`
      <div
        part="base"
        class=${(0,n.e)({avatar:!0,"avatar--circle":!0})}
        style="width: ${this.size}px; height: ${this.size}px;"
      >
        ${this.image&&!this.hasError?t:e} ${o}
      </div>
    `}};Hi.styles=[l.$,Wi],(0,c.Cc)([(0,s.r)()],Hi.prototype,"hasError",2),(0,c.Cc)([(0,s.n)()],Hi.prototype,"image",2),(0,c.Cc)([(0,s.n)()],Hi.prototype,"loading",2),(0,c.Cc)([(0,s.n)({type:Number})],Hi.prototype,"size",2),(0,c.Cc)([(0,Mt.w)("image")],Hi.prototype,"handleImageChange",1);var Ui=Hi;Hi.define("bzl-avatar");var Ki=i.i`
  :host {
    display: inline-flex;
  }

  .badge-container {
    position: relative;
    display: inline-block;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, var(--bzl-font-size-2x-small));
    font-weight: var(--bzl-font-weight-semibold);
    letter-spacing: var(--bzl-letter-spacing-normal);
    border-radius: var(--bzl-border-radius-small);
    white-space: nowrap;
    padding: 0 var(--bzl-spacing-2);
    user-select: none;
    cursor: inherit;
    background-color: var(--bzl-color-danger-600);
    color: var(--bzl-color-neutral-0);
    box-sizing: border-box;
    min-width: var(--bzl-line-height-x-dense);
    height: var(--bzl-line-height-x-dense);
    line-height: var(--bzl-line-height-x-dense);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--bzl-border-radius-pill);
  }

  /* Dot modifier */
  .badge--dot {
    padding: 0;
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-danger-600);
    min-width: var(--bzl-badge-dot-size);
    min-height: var(--bzl-badge-dot-size);
    width: var(--bzl-badge-dot-size);
    height: var(--bzl-badge-dot-size);
  }

  /* Positioned badge (右上角定位) */
  .badge--positioned {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    z-index: 1;
  }
`,Xi=class extends s.X{constructor(){super(...arguments),this.color="",this.cn=!1,this.dot=!1,this.text="",this.offset=[0,0]}hasSlotContent(){return Array.from(this.childNodes).some(t=>{var e;return t.nodeType===Node.ELEMENT_NODE||t.nodeType===Node.TEXT_NODE&&(null==(e=t.textContent)?void 0:e.trim())})}getColorStyle(){return this.color?`background-color: ${this.color};`:""}getOffsetStyle(){const[t,e]=this.offset;return`transform: translate(calc(50% + ${t}px), calc(-50% + ${e}px));`}mergeStyles(...t){return t.filter(t=>t).join(" ")}renderDotBadge(t){const e=this.getColorStyle();if(t){const t=this.getOffsetStyle();return i.x`
        <div class="badge-container">
          <slot></slot>
          <span
            part="base"
            class=${(0,n.e)({badge:!0,"badge--dot":!0,"badge--positioned":!0})}
            style=${this.mergeStyles(e,t)}
            role="status"
          ></span>
        </div>
      `}return i.x`
      <span
        part="base"
        class=${(0,n.e)({badge:!0,"badge--dot":!0})}
        style=${e}
        role="status"
      ></span>
    `}renderTextBadge(t){const e=this.getColorStyle();if(t){if(!this.text)return i.x`
          <div class="badge-container">
            <slot></slot>
          </div>
        `;const t=this.getOffsetStyle();return i.x`
        <div class="badge-container">
          <slot></slot>
          <span
            part="base"
            class=${(0,n.e)({badge:!0,"badge--pill":!this.cn,"badge--positioned":!0})}
            style=${this.mergeStyles(e,t)}
            role="status"
          >
            ${this.text}
          </span>
        </div>
      `}return this.text?i.x`
      <span
        part="base"
        class=${(0,n.e)({badge:!0,"badge--pill":!this.cn})}
        style=${e}
        role="status"
      >
        ${this.text}
      </span>
    `:i.x`<slot></slot>`}render(){const t=this.hasSlotContent();return this.dot?this.renderDotBadge(t):this.renderTextBadge(t)}};Xi.styles=[l.$,Ki],(0,c.Cc)([(0,s.n)({type:String})],Xi.prototype,"color",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Xi.prototype,"cn",2),(0,c.Cc)([(0,s.n)({type:Boolean,reflect:!0})],Xi.prototype,"dot",2),(0,c.Cc)([(0,s.n)({type:String})],Xi.prototype,"text",2),(0,c.Cc)([(0,s.n)({type:Array})],Xi.prototype,"offset",2);var Zi=Xi;Xi.define("bzl-badge")}}]);