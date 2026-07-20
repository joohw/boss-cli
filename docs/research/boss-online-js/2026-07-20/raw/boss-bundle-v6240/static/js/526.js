"use strict";(self.webpackChunkfe_web_boss_bundle=self.webpackChunkfe_web_boss_bundle||[]).push([[526],{1510:function(e,t,n){n.d(t,{e:function(){return s}});var i=n(4724),o=n(9016),s=(0,i.e)(class extends i.i{constructor(e){var t;if(super(e),e.type!==i.t.ATTRIBUTE||"class"!==e.name||(null==(t=e.strings)?void 0:t.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){var n,i;if(void 0===this.st){this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e)));for(const e in t)t[e]&&!(null==(n=this.nt)?void 0:n.has(e))&&this.st.add(e);return this.render(t)}const s=e.element.classList;for(const e of this.st)e in t||(s.remove(e),this.st.delete(e));for(const e in t){const n=!!t[e];n===this.st.has(e)||(null==(i=this.nt)?void 0:i.has(e))||(n?(s.add(e),this.st.add(e)):(s.remove(e),this.st.delete(e)))}return o.T}})},378:function(e,t,n){n.d(t,{w:function(){return o}});var i=n(6909);function o(e,t){const n=(0,i.IA)({waitUntilFirstUpdate:!1},t);return(t,i)=>{const{update:o}=t,s=Array.isArray(e)?e:[e];t.update=function(e){s.forEach(t=>{const o=t;if(e.has(o)){const t=e.get(o),s=this[o];t!==s&&(n.waitUntilFirstUpdate&&!this.hasUpdated||this[i](t,s))}}),o.call(this,e)}}}},4680:function(e,t,n){n.d(t,{Hh:function(){return l},Sm:function(){return c},ds:function(){return a},cl:function(){return r},pA:function(){return s}});var i=[{name:"color",resolver:e=>`https://static.zhipin.com/assets/bzl-design/icons/colorful/${e}.svg`}],o=[];function s(e){o.push(e)}function r(e){o=o.filter(t=>t!==e)}function l(e){return i.find(t=>t.name===e)}function c(e,t){a(e),i.push({name:e,resolver:t.resolver,mutator:t.mutator,spriteSheet:t.spriteSheet}),o.forEach(t=>{t.library===e&&t.setIcon()})}function a(e){i=i.filter(t=>t.name!==e)}},7302:function(e,t,n){n.d(t,{k:function(){return h}});var i=n(6133),o=n(1054),s=n(5339),r=n(378),l=n(1510),c=n(2106),a=n(5138),u=n(9016),d=n(6909),h=class extends a.X{constructor(){super(...arguments),this.isVisible=!1,this.hasSlotContent=!1,this.hasSuffixContent=!1,this.type="info",this.content="",this.duration=3e3,this.loading=!1}connectedCallback(){super.connectedCallback(),this.show()}firstUpdated(){this.checkSlotContent()}checkSlotContent(){const e=this.shadowRoot.querySelector("slot:not([name])");if(e){const t=e.assignedNodes();this.hasSlotContent=t.some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent.trim()||e.nodeType===Node.ELEMENT_NODE)}const t=this.shadowRoot.querySelector('slot[name="suffix"]');if(t){const e=t.assignedNodes();this.hasSuffixContent=e.some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent.trim()||e.nodeType===Node.ELEMENT_NODE)}}disconnectedCallback(){super.disconnectedCallback(),this.clearHideTimer()}getDefaultIcon(){return{success:"pass-face",info:"info-circle",warning:"tip-face2",error:"close-face1"}[this.type]}shouldShowIcon(){return!!this.loading||!("info"===this.type&&!this.icon)}clearHideTimer(){this.hideTimer&&(clearTimeout(this.hideTimer),this.hideTimer=void 0)}setHideTimer(){this.clearHideTimer(),this.duration>0&&(this.hideTimer=setTimeout(()=>{this.hide()},this.duration))}show(){this.isVisible||(this.isVisible=!0,this.emit("bzl-show"),this.setHideTimer())}hide(){this.isVisible&&(this.isVisible=!1,this.clearHideTimer(),this.emit("bzl-hide"),setTimeout(()=>{this.remove(),this.emit("bzl-close")},300))}handleMouseEnter(){this.clearHideTimer()}handleMouseLeave(){this.setHideTimer()}handleSlotChange(){this.checkSlotContent()}handleSuffixSlotChange(){this.checkSlotContent()}handleSuffixClick(){this.emit("bzl-suffix-click")}handleDurationChange(){this.isVisible&&this.setHideTimer()}render(){const e=this.loading?"loading":this.icon||this.getDefaultIcon(),t=this.shouldShowIcon(),n=Boolean(this.content)||this.hasSlotContent;return u.x`
      <div
        part="base"
        class=${(0,l.e)({toast:!0,"toast--success":"success"===this.type,"toast--info":"info"===this.type,"toast--warning":"warning"===this.type,"toast--error":"error"===this.type,"toast--visible":this.isVisible,"toast--animate":!0,"toast--loading":this.loading,"toast--has-icon-and-content":t&&n})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        ${this.shouldShowIcon()?u.x`
              <div part="icon" class="toast__icon">
                <slot name="icon">
                  ${this.loading?u.x`<bzl-spin size="small"><bzl-icon slot="icon" name="loading"></bzl-icon></bzl-spin>`:u.x`<bzl-icon name=${e}></bzl-icon>`}
                </slot>
              </div>
            `:""}

        <div part="message" class="toast__message">
          <slot @slotchange=${this.handleSlotChange}>${this.content}</slot>
        </div>

        <div
          part="suffix"
          class="toast__suffix"
          style="display: ${this.hasSuffixContent?"block":"none"}"
          @click=${this.handleSuffixClick}
        >
          <slot name="suffix" @slotchange=${this.handleSuffixSlotChange}></slot>
        </div>
      </div>
    `}};h.styles=[c.$,i.R],h.dependencies={"bzl-icon":s.K,"bzl-spin":o.v},(0,d.Cc)([(0,a.r)()],h.prototype,"isVisible",2),(0,d.Cc)([(0,a.r)()],h.prototype,"hasSlotContent",2),(0,d.Cc)([(0,a.r)()],h.prototype,"hasSuffixContent",2),(0,d.Cc)([(0,a.n)({reflect:!0})],h.prototype,"type",2),(0,d.Cc)([(0,a.n)()],h.prototype,"content",2),(0,d.Cc)([(0,a.n)({type:Number})],h.prototype,"duration",2),(0,d.Cc)([(0,a.n)()],h.prototype,"icon",2),(0,d.Cc)([(0,a.n)({type:Boolean})],h.prototype,"loading",2),(0,d.Cc)([(0,r.w)("duration")],h.prototype,"handleDurationChange",1)},5339:function(e,t,n){n.d(t,{K:function(){return g}});var i,o=n(7487),s=n(4843),r=n(3589),l=n(4680),c=n(378),a=n(2106),u=n(5138),d=n(9016),h=n(6909),p=Symbol(),f=Symbol(),b=new Map,g=class extends u.X{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.library="color",this.type="font"}async resolveIcon(e,t){var n;let o;if(null==t?void 0:t.spriteSheet)return this.svg=d.x`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(o=await fetch(e,{mode:"cors"}),!o.ok)return 410===o.status?p:f}catch(e){return f}try{const e=document.createElement("div");e.innerHTML=await o.text();const t=e.firstElementChild;if("svg"!==(null==(n=null==t?void 0:t.tagName)?void 0:n.toLowerCase()))return p;i||(i=new DOMParser);const s=i.parseFromString(t.outerHTML,"text/html").body.querySelector("svg");return s?(s.part.add("svg"),document.adoptNode(s)):p}catch(e){return p}}connectedCallback(){super.connectedCallback(),(0,l.pA)(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){super.disconnectedCallback(),(0,l.cl)(this)}getIconSource(){const e=(0,l.Hh)(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:void 0,fromLibrary:!1}}async setIcon(){var e;if("font"===this.type)return void(this.svg=null);const{url:t,fromLibrary:n}=this.getIconSource(),i=n?(0,l.Hh)(this.library):void 0;if(!t)return void(this.svg=null);let s=b.get(t);if(s||(s=this.resolveIcon(t,i),b.set(t,s)),!this.initialRender)return;const r=await s;if(r===f&&b.delete(t),t===this.getIconSource().url)if((0,o.e)(r)){if(this.svg=r,i){await this.updateComplete;const e=this.shadowRoot.querySelector("[part='svg']");"function"==typeof i.mutator&&e&&i.mutator(e)}}else switch(r){case f:case p:this.svg=null,this.emit("bzl-error");break;default:this.svg=r.cloneNode(!0),null==(e=null==i?void 0:i.mutator)||e.call(i,this.svg),this.emit("bzl-load")}}render(){return"font"===this.type&&this.name?d.x`<i class="bzl-design-icon-pure ${this.name}" style="font-size: inherit;"></i>`:this.svg}};g.styles=[a.$,r.L,s.t],(0,h.Cc)([(0,u.r)()],g.prototype,"svg",2),(0,h.Cc)([(0,u.n)({reflect:!0})],g.prototype,"name",2),(0,h.Cc)([(0,u.n)({reflect:!0})],g.prototype,"library",2),(0,h.Cc)([(0,u.n)({reflect:!0})],g.prototype,"type",2),(0,h.Cc)([(0,c.w)(["name","library","type"])],g.prototype,"setIcon",1)},6482:function(e,t,n){n.d(t,{e:function(){return i}});var i=n(9016).i`
  :host {
    --spin-color: var(--bzl-color-primary-600);
    --internal-spin-speed: var(--spin-speed, 1s);
    --spin-font-size: 16px;

    display: inline-flex;
    flex: none;
    font-family: 'PingFang SC';
    font-size: var(--spin-font-size);
  }

  .spin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .spin--overlay {
    position: relative;
    display: block;
  }

  .spin__content {
    position: relative;
  }

  .spin__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    z-index: 1;
  }

  .spin__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin var(--internal-spin-speed) linear infinite;
  }

  .spin__loading-icon {
    color: var(--spin-color);
  }

  .spin__text {
    color: var(--bzl-color-gray-700);
    text-align: center;
    white-space: nowrap;
    margin-top: 4px;
  }

  /* Size variants */
  .spin--xsmall .spin__loading-icon,
  .spin--xsmall .spin__icon ::slotted(bzl-icon) {
    font-size: 1em;
  }

  .spin--xsmall .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--small .spin__loading-icon,
  .spin--small .spin__icon ::slotted(bzl-icon) {
    font-size: 1.25em;
  }

  .spin--small .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--default .spin__loading-icon,
  .spin--default .spin__icon ::slotted(bzl-icon) {
    font-size: 1.5em;
  }

  .spin--default .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--large .spin__loading-icon,
  .spin--large .spin__icon ::slotted(bzl-icon) {
    font-size: 2em;
  }

  .spin--large .spin__text {
    font-size: var(--bzl-font-size-small);
  }

  .spin--xlarge .spin__loading-icon,
  .spin--xlarge .spin__icon ::slotted(bzl-icon) {
    font-size: 2.5em;
  }

  .spin--xlarge .spin__text {
    font-size: var(--bzl-font-size-medium);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`},2909:function(e,t,n){n.d(t,{Y:function(){return o}});var i=n(7302),o=i.k;i.k.define("bzl-toast")},9016:function(e,t,n){n.d(t,{E:function(){return C},T:function(){return S},Z:function(){return B},b:function(){return A},f:function(){return ue},i:function(){return Z},i2:function(){return ge},u:function(){return ae},w:function(){return E},x:function(){return w}});var i=globalThis,o=i.trustedTypes,s=o?o.createPolicy("lit-html",{createHTML:e=>e}):void 0,r="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,c="?"+l,a=`<${c}>`,u=document,d=()=>u.createComment(""),h=e=>null===e||"object"!=typeof e&&"function"!=typeof e,p=Array.isArray,f=e=>p(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),b="[ \t\n\f\r]",g=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,m=/-->/g,v=/>/g,y=RegExp(`>|${b}(?:([^\\s"'>=/]+)(${b}*=${b}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,_=/"/g,$=/^(?:script|style|textarea|title)$/i,x=e=>(t,...n)=>({_$litType$:e,strings:t,values:n}),w=x(1),A=x(2),E=x(3),S=Symbol.for("lit-noChange"),C=Symbol.for("lit-nothing"),T=new WeakMap,k=u.createTreeWalker(u,129);function O(e,t){if(!p(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s?s.createHTML(t):t}var P=(e,t)=>{const n=e.length-1,i=[];let o,s=2===t?"<svg>":3===t?"<math>":"",c=g;for(let t=0;t<n;t++){const n=e[t];let u,d,h=-1,p=0;for(;p<n.length&&(c.lastIndex=p,d=c.exec(n),null!==d);)p=c.lastIndex,c===g?"!--"===d[1]?c=m:void 0!==d[1]?c=v:void 0!==d[2]?($.test(d[2])&&(o=RegExp("</"+d[2],"g")),c=y):void 0!==d[3]&&(c=y):c===y?">"===d[0]?(c=null!=o?o:g,h=-1):void 0===d[1]?h=-2:(h=c.lastIndex-d[2].length,u=d[1],c=void 0===d[3]?y:'"'===d[3]?_:z):c===_||c===z?c=y:c===m||c===v?c=g:(c=y,o=void 0);const f=c===y&&e[t+1].startsWith("/>")?" ":"";s+=c===g?n+a:h>=0?(i.push(u),n.slice(0,h)+r+n.slice(h)+l+f):n+l+(-2===h?t:f)}return[O(e,s+(e[n]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]},N=class e{constructor({strings:t,_$litType$:n},i){let s;this.parts=[];let a=0,u=0;const h=t.length-1,p=this.parts,[f,b]=P(t,n);if(this.el=e.createElement(f,i),k.currentNode=this.el.content,2===n||3===n){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=k.nextNode())&&p.length<h;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(r)){const t=b[u++],n=s.getAttribute(e).split(l),i=/([.?@])?(.*)/.exec(t);p.push({type:1,index:a,name:i[2],strings:n,ctor:"."===i[1]?L:"?"===i[1]?j:"@"===i[1]?D:I}),s.removeAttribute(e)}else e.startsWith(l)&&(p.push({type:6,index:a}),s.removeAttribute(e));if($.test(s.tagName)){const e=s.textContent.split(l),t=e.length-1;if(t>0){s.textContent=o?o.emptyScript:"";for(let n=0;n<t;n++)s.append(e[n],d()),k.nextNode(),p.push({type:2,index:++a});s.append(e[t],d())}}}else if(8===s.nodeType)if(s.data===c)p.push({type:2,index:a});else{let e=-1;for(;-1!==(e=s.data.indexOf(l,e+1));)p.push({type:7,index:a}),e+=l.length-1}a++}}static createElement(e,t){const n=u.createElement("template");return n.innerHTML=e,n}};function U(e,t,n=e,i){var o,s,r;if(t===S)return t;let l=void 0!==i?null==(o=n._$Co)?void 0:o[i]:n._$Cl;const c=h(t)?void 0:t._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null==(s=null==l?void 0:l._$AO)||s.call(l,!1),void 0===c?l=void 0:(l=new c(e),l._$AT(e,n,i)),void 0!==i?(null!=(r=n._$Co)?r:n._$Co=[])[i]=l:n._$Cl=l),void 0!==l&&(t=U(e,l._$AS(e,t.values),l,i)),t}var M,H=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;const{el:{content:n},parts:i}=this._$AD,o=(null!=(t=null==e?void 0:e.creationScope)?t:u).importNode(n,!0);k.currentNode=o;let s=k.nextNode(),r=0,l=0,c=i[0];for(;void 0!==c;){if(r===c.index){let t;2===c.type?t=new R(s,s.nextSibling,this,e):1===c.type?t=new c.ctor(s,c.name,c.strings,this,e):6===c.type&&(t=new V(s,this,e)),this._$AV.push(t),c=i[++l]}r!==(null==c?void 0:c.index)&&(s=k.nextNode(),r++)}return k.currentNode=u,o}p(e){let t=0;for(const n of this._$AV)void 0!==n&&(void 0!==n.strings?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},R=class e{get _$AU(){var e,t;return null!=(t=null==(e=this._$AM)?void 0:e._$AU)?t:this._$Cv}constructor(e,t,n,i){var o;this.type=2,this._$AH=C,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=i,this._$Cv=null==(o=null==i?void 0:i.isConnected)||o}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===(null==e?void 0:e.nodeType)&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=U(this,e,t),h(e)?e===C||null==e||""===e?(this._$AH!==C&&this._$AR(),this._$AH=C):e!==this._$AH&&e!==S&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):f(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==C&&h(this._$AH)?this._$AA.nextSibling.data=e:this.T(u.createTextNode(e)),this._$AH=e}$(e){var t;const{values:n,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=N.createElement(O(i.h,i.h[0]),this.options)),i);if((null==(t=this._$AH)?void 0:t._$AD)===o)this._$AH.p(n);else{const e=new H(o,this),t=e.u(this.options);e.p(n),this.T(t),this._$AH=e}}_$AC(e){let t=T.get(e.strings);return void 0===t&&T.set(e.strings,t=new N(e)),t}k(t){p(this._$AH)||(this._$AH=[],this._$AR());const n=this._$AH;let i,o=0;for(const s of t)o===n.length?n.push(i=new e(this.O(d()),this.O(d()),this,this.options)):i=n[o],i._$AI(s),o++;o<n.length&&(this._$AR(i&&i._$AB.nextSibling,o),n.length=o)}_$AR(e=this._$AA.nextSibling,t){var n;for(null==(n=this._$AP)||n.call(this,!1,!0,t);e!==this._$AB;){const t=e.nextSibling;e.remove(),e=t}}setConnected(e){var t;void 0===this._$AM&&(this._$Cv=e,null==(t=this._$AP)||t.call(this,e))}},I=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,i,o){this.type=1,this._$AH=C,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,n.length>2||""!==n[0]||""!==n[1]?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=C}_$AI(e,t=this,n,i){const o=this.strings;let s=!1;if(void 0===o)e=U(this,e,t,0),s=!h(e)||e!==this._$AH&&e!==S,s&&(this._$AH=e);else{const i=e;let r,l;for(e=o[0],r=0;r<o.length-1;r++)l=U(this,i[n+r],t,r),l===S&&(l=this._$AH[r]),s||(s=!h(l)||l!==this._$AH[r]),l===C?e=C:e!==C&&(e+=(null!=l?l:"")+o[r+1]),this._$AH[r]=l}s&&!i&&this.j(e)}j(e){e===C?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}},L=class extends I{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===C?void 0:e}},j=class extends I{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==C)}},D=class extends I{constructor(e,t,n,i,o){super(e,t,n,i,o),this.type=5}_$AI(e,t=this){var n;if((e=null!=(n=U(this,e,t,0))?n:C)===S)return;const i=this._$AH,o=e===C&&i!==C||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==C&&(i===C||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,n;"function"==typeof this._$AH?this._$AH.call(null!=(n=null==(t=this.options)?void 0:t.host)?n:this.element,e):this._$AH.handleEvent(e)}},V=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){U(this,e)}},B={M:r,P:l,A:c,C:1,L:P,R:H,D:f,V:U,I:R,H:I,N:j,U:D,B:L,F:V},q=i.litHtmlPolyfillSupport;null==q||q(N,R),(null!=(M=i.litHtmlVersions)?M:i.litHtmlVersions=[]).push("3.3.1");var X=globalThis,W=X.ShadowRoot&&(void 0===X.ShadyCSS||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),K=new WeakMap,F=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(W&&void 0===e){const n=void 0!==t&&1===t.length;n&&(e=K.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&K.set(t,e))}return e}toString(){return this.cssText}},Z=(e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,n,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[i+1],e[0]);return new F(n,e,Y)},J=W?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const n of e.cssRules)t+=n.cssText;return(e=>new F("string"==typeof e?e:e+"",void 0,Y))(t)})(e):e,{is:G,defineProperty:Q,getOwnPropertyDescriptor:ee,getOwnPropertyNames:te,getOwnPropertySymbols:ne,getPrototypeOf:ie}=Object,oe=globalThis,se=oe.trustedTypes,re=se?se.emptyScript:"",le=oe.reactiveElementPolyfillSupport,ce=(e,t)=>e,ae={toAttribute(e,t){switch(t){case Boolean:e=e?re:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let n=e;switch(t){case Boolean:n=null!==e;break;case Number:n=null===e?null:Number(e);break;case Object:case Array:try{n=JSON.parse(e)}catch(e){n=null}}return n}},ue=(e,t)=>!G(e,t),de={attribute:!0,type:String,converter:ae,reflect:!1,useDefault:!1,hasChanged:ue};null!=Symbol.metadata||(Symbol.metadata=Symbol("metadata")),null!=oe.litPropertyMetadata||(oe.litPropertyMetadata=new WeakMap);var he,pe=class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),(null!=(t=this.l)?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=de){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const n=Symbol(),i=this.getPropertyDescriptor(e,n,t);void 0!==i&&Q(this.prototype,e,i)}}static getPropertyDescriptor(e,t,n){var i;const{get:o,set:s}=null!=(i=ee(this.prototype,e))?i:{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const i=null==o?void 0:o.call(this);null==s||s.call(this,t),this.requestUpdate(e,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){var t;return null!=(t=this.elementProperties.get(e))?t:de}static _$Ei(){if(this.hasOwnProperty(ce("elementProperties")))return;const e=ie(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(ce("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ce("properties"))){const e=this.properties,t=[...te(e),...ne(e)];for(const n of t)this.createProperty(n,e[n])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,n]of t)this.elementProperties.set(e,n)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const n=this._$Eu(e,t);void 0!==n&&this._$Eh.set(n,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const n=new Set(e.flat(1/0).reverse());for(const e of n)t.unshift(J(e))}else void 0!==e&&t.push(J(e));return t}static _$Eu(e,t){const n=t.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),null==(e=this.constructor.l)||e.forEach(e=>e(this))}addController(e){var t,n;(null!=(t=this._$EO)?t:this._$EO=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&(null==(n=e.hostConnected)||n.call(e))}removeController(e){var t;null==(t=this._$EO)||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){var e;const t=null!=(e=this.shadowRoot)?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(W)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const n of t){const t=document.createElement("style"),i=X.litNonce;void 0!==i&&t.setAttribute("nonce",i),t.textContent=n.cssText,e.appendChild(t)}})(t,this.constructor.elementStyles),t}connectedCallback(){var e;null!=this.renderRoot||(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null==(e=this._$EO)||e.forEach(e=>{var t;return null==(t=e.hostConnected)?void 0:t.call(e)})}enableUpdating(e){}disconnectedCallback(){var e;null==(e=this._$EO)||e.forEach(e=>{var t;return null==(t=e.hostDisconnected)?void 0:t.call(e)})}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){var n;const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==(null==(n=i.converter)?void 0:n.toAttribute)?i.converter:ae).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){var n,i,o;const s=this.constructor,r=s._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=s.getPropertyOptions(r),l="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==(null==(n=e.converter)?void 0:n.fromAttribute)?e.converter:ae;this._$Em=r;const c=l.fromAttribute(t,e.type);this[r]=null!=(o=null!=c?c:null==(i=this._$Ej)?void 0:i.get(r))?o:c,this._$Em=null}}requestUpdate(e,t,n){var i,o;if(void 0!==e){const s=this.constructor,r=this[e];if(null!=n||(n=s.getPropertyOptions(e)),!((null!=(i=n.hasChanged)?i:ue)(r,t)||n.useDefault&&n.reflect&&r===(null==(o=this._$Ej)?void 0:o.get(e))&&!this.hasAttribute(s._$Eu(e,n))))return;this.C(e,t,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:i,wrapped:o},s){var r,l,c;n&&!(null!=(r=this._$Ej)?r:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,null!=(l=null!=s?s:t)?l:this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(null!=(c=this._$Eq)?c:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(null!=this.renderRoot||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,n]of e){const{wrapped:e}=n,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,n,i)}}let t=!1;const n=this._$AL;try{t=this.shouldUpdate(n),t?(this.willUpdate(n),null==(e=this._$EO)||e.forEach(e=>{var t;return null==(t=e.hostUpdate)?void 0:t.call(e)}),this.update(n)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(n)}willUpdate(e){}_$AE(e){var t;null==(t=this._$EO)||t.forEach(e=>{var t;return null==(t=e.hostUpdated)?void 0:t.call(e)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}};pe.elementStyles=[],pe.shadowRootOptions={mode:"open"},pe[ce("elementProperties")]=new Map,pe[ce("finalized")]=new Map,null==le||le({ReactiveElement:pe}),(null!=(he=oe.reactiveElementVersions)?he:oe.reactiveElementVersions=[]).push("2.1.1");var fe,be=globalThis,ge=class extends pe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return null!=(e=this.renderOptions).renderBefore||(e.renderBefore=t.firstChild),t}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,n)=>{var i,o;const s=null!=(i=null==n?void 0:n.renderBefore)?i:t;let r=s._$litPart$;if(void 0===r){const e=null!=(o=null==n?void 0:n.renderBefore)?o:null;s._$litPart$=r=new R(t.insertBefore(d(),e),e,void 0,null!=n?n:{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null==(e=this._$Do)||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null==(e=this._$Do)||e.setConnected(!1)}render(){return S}};ge._$litElement$=!0,ge.finalized=!0,null==(fe=be.litElementHydrateSupport)||fe.call(be,{LitElement:ge});var me,ve=be.litElementPolyfillSupport;null==ve||ve({LitElement:ge}),(null!=(me=be.litElementVersions)?me:be.litElementVersions=[]).push("4.2.1")},2106:function(e,t,n){n.d(t,{$:function(){return i}});var i=n(9016).i`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`},5066:function(e,t,n){n.d(t,{tx:function(){return s},y8:function(){return l}});var i=n(7302),o=n(6909),s=class e{constructor(){this.toasts=[],this.loadingToasts=[],this.defaultOptions={type:"info",duration:3e3,loading:!1,offset:32},customElements.get("bzl-toast")||i.k.define("bzl-toast")}static getInstance(){return e.instance||(e.instance=new e),e.instance}createToast(e){const t=document.createElement("bzl-toast"),n=(0,o.IA)((0,o.IA)({},this.defaultOptions),e);if(n.type&&(t.type=n.type),void 0!==n.duration&&(t.duration=n.duration),n.icon&&(t.icon=n.icon),void 0!==n.loading&&(t.loading=n.loading),n.html?t.innerHTML=n.html:n.content&&(t.content=n.content),n.suffix){const e=document.createElement("span");e.innerHTML=n.suffix,e.setAttribute("slot","suffix"),t.appendChild(e),setTimeout(()=>{if(t.shadowRoot){const e=t.shadowRoot.querySelector('slot[name="suffix"]');null==e||e.dispatchEvent(new Event("slotchange"))}},0)}return t.addEventListener("bzl-close",()=>{this.removeToast(t)}),n.onSuffixClick&&t.addEventListener("bzl-suffix-click",n.onSuffixClick),t}show(e){const t="string"==typeof e?{content:e}:e,n=this.createToast(t);return document.body.appendChild(n),t.loading?this.loadingToasts.push(n):this.toasts.push(n),this.updateToastPositions(),n}success(e){const t="string"==typeof e?{content:e}:e;return this.show((0,o.ko)((0,o.IA)({},t),{type:"success"}))}info(e){const t="string"==typeof e?{content:e}:e;return this.show((0,o.ko)((0,o.IA)({},t),{type:"info"}))}warning(e){const t="string"==typeof e?{content:e}:e;return this.show((0,o.ko)((0,o.IA)({},t),{type:"warning"}))}error(e){const t="string"==typeof e?{content:e}:e;return this.show((0,o.ko)((0,o.IA)({},t),{type:"error"}))}loading(e){const t="string"==typeof e?{content:e}:e;return this.show((0,o.ko)((0,o.IA)({},t),{loading:!0,duration:0}))}removeToast(e){const t=this.toasts.indexOf(e);if(t>-1)return this.toasts.splice(t,1),void this.updateToastPositions();const n=this.loadingToasts.indexOf(e);n>-1&&(this.loadingToasts.splice(n,1),this.updateToastPositions())}updateToastPositions(){const e=this.defaultOptions.offset||32;this.toasts.forEach((t,n)=>{t.style.position="fixed",t.style.top=`${e+60*n}px`,t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex=`${2e3+n}`,t.style.transition="all 0.3s ease"}),this.loadingToasts.forEach((t,n)=>{t.style.position="fixed",t.style.top=`${e+60*n}px`,t.style.left="50%",t.style.transform="translateX(-50%)",t.style.zIndex=`${3e3+n}`,t.style.transition="all 0.3s ease"})}closeAllLoading(){this.loadingToasts.forEach(e=>{e.hide()}),this.loadingToasts=[]}closeAllNormal(){this.toasts.forEach(e=>{e.hide()}),this.toasts=[]}closeAll(){this.closeAllNormal(),this.closeAllLoading()}setDefaults(e){this.defaultOptions=(0,o.IA)((0,o.IA)({},this.defaultOptions),e)}},r=s.getInstance(),l={show:e=>r.show(e),success:e=>r.success(e),info:e=>r.info(e),warning:e=>r.warning(e),error:e=>r.error(e),loading:e=>r.loading(e),closeAll:()=>r.closeAll(),closeAllNormal:()=>r.closeAllNormal(),closeAllLoading:()=>r.closeAllLoading(),setDefaults:e=>r.setDefaults(e)}},3589:function(e,t,n){n.d(t,{L:function(){return i}});var i=n(9016).i`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
    line-height: 1;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  /* 更多 */
`},7487:function(e,t,n){n.d(t,{e:function(){return s},f:function(){return r},m:function(){return c}});var i=n(9016),{I:o}=i.Z,s=(e,t)=>void 0===t?void 0!==(null==e?void 0:e._$litType$):(null==e?void 0:e._$litType$)===t,r=e=>void 0===e.strings,l={},c=(e,t=l)=>e._$AH=t},6133:function(e,t,n){n.d(t,{R:function(){return i}});var i=n(9016).i`
  :host {
    display: block;
    position: fixed;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: auto;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0;
    height: 40px;
    padding: 9px 16px;
    border-radius: 12px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    white-space: nowrap;
  }

  /* 当既有icon又有文本内容时显示4px间距 */
  .toast--has-icon-and-content {
    gap: 4px;
  }

  .toast--animate.toast--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .toast--visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* 成功状态样式 */
  .toast--success {
    background-color: var(--bzl-color-boss-600);
  }

  .toast--success .toast__icon {
    color: #fff;
  }

  /* 信息状态样式 */
  .toast--info {
    background-color: var(--bzl-color-boss-600);
  }

  .toast--info .toast__icon {
    color: #fff;
  }

  /* 警告状态样式 */
  .toast--warning {
    background-color: var(--bzl-color-orange-600);
  }

  .toast--warning .toast__icon {
    color: #fff;
  }

  /* 错误状态样式 */
  .toast--error {
    background-color: var(--bzl-color-red-600);
  }

  .toast--error .toast__icon {
    color: #fff;
  }

  /* loading状态样式 */
  .toast--loading .toast__icon {
    color: #fff;
  }

  .toast__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .toast__icon bzl-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .toast__icon bzl-spin {
    --indicator-color: #fff;
  }

  .toast__icon bzl-icon[name='loading'] {
    background: conic-gradient(from -190deg, #fff 0deg, #23b7b7 290deg);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .toast__message {
    flex: 1;
    color: #fff;
    font-weight: 400;
  }

  .toast__suffix {
    flex-shrink: 0;
    margin-left: 12px;
    color: #fff;
    font-weight: 400;
    cursor: pointer;
    transition: text-decoration 0.2s ease;
  }

  .toast__suffix:hover {
    text-decoration: underline;
  }

  /* 响应式设计 */
  @media (max-width: 640px) {
    :host {
      left: 16px;
      right: 16px;
      transform: none;
    }

    .toast {
      white-space: normal;
      min-height: 40px;
      height: auto;
    }
  }

  /* 动画效果 */
  @keyframes toast-enter {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toast-exit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  .toast--animate {
    animation: toast-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast--animate:not(.toast--visible) {
    animation: toast-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`},5138:function(e,t,n){n.d(t,{X:function(){return h},e:function(){return d},n:function(){return l},r:function(){return c}});var i=n(9016),o=n(6909),s={attribute:!0,type:String,converter:i.u,reflect:!1,hasChanged:i.f},r=(e=s,t,n)=>{const{kind:i,metadata:o}=n;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),r.set(n.name,e),"accessor"===i){const{name:i}=n;return{set(n){const o=t.get.call(this);t.set.call(this,n),this.requestUpdate(i,o,e)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=n;return function(n){const o=this[i];t.call(this,n),this.requestUpdate(i,o,e)}}throw Error("Unsupported decorator location: "+i)};function l(e){return(t,n)=>"object"==typeof n?r(e,t,n):((e,t,n)=>{const i=t.hasOwnProperty(n);return t.constructor.createProperty(n,e),i?Object.getOwnPropertyDescriptor(t,n):void 0})(e,t,n)}function c(e){return l((0,o.ko)((0,o.IA)({},e),{state:!0,attribute:!1}))}var a,u=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,n),n);function d(e,t){return(n,i,o)=>{const s=t=>{var n,i;return null!=(i=null==(n=t.renderRoot)?void 0:n.querySelector(e))?i:null};if(t){const{get:e,set:t}="object"==typeof i?n:null!=o?o:(()=>{const e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return u(n,i,{get(){let n=e.call(this);return void 0===n&&(n=s(this),(null!==n||this.hasUpdated)&&t.call(this,n)),n}})}return u(n,i,{get(){return s(this)}})}}var h=class extends i.i2{constructor(){super(),(0,o.VK)(this,a,!1),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){const n=new CustomEvent(e,(0,o.IA)({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(n),n}static define(e,t=this,n={}){const i=customElements.get(e);if(!i){try{customElements.define(e,t,n)}catch(i){customElements.define(e,class extends t{},n)}return}let o=" (unknown version)",s=o;"version"in t&&t.version&&(o=" v"+t.version),"version"in i&&i.version&&(s=" v"+i.version),o&&s&&o===s||console.warn(`Attempted to register <${e}>${o}, but <${e}>${s} has already been registered.`)}attributeChangedCallback(e,t,n){(0,o.S7)(this,a)||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&null!=this[t]&&this.initialReflectedProperties.set(t,this[t])}),(0,o.OV)(this,a,!0)),super.attributeChangedCallback(e,t,n)}willUpdate(e){super.willUpdate(e),this.initialReflectedProperties.forEach((t,n)=>{e.has(n)&&null==this[n]&&(this[n]=t)})}};a=new WeakMap,h.version="0.0.12",h.dependencies={},(0,o.Cc)([l()],h.prototype,"dir",2),(0,o.Cc)([l()],h.prototype,"lang",2)},4843:function(e,t,n){n.d(t,{t:function(){return i}});var i=n(9016).i`

  .bzl-design-icon-pure {
    font-family: "bzl-design-icon-pure" !important;
    font-size: inherit;
    font-style: normal;
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: top;
  }

  .bzl-design-icon-pure.checkpart-outline:before {
    content: "\\e1dd";
  }
  .bzl-design-icon-pure.checkall-outline:before {
    content: "\\e1dc";
  }
  .bzl-design-icon-pure.pin-to-top-outline:before {
    content: "\\e1db";
  }
  .bzl-design-icon-pure.add-group-outline:before {
    content: "\\e1d9";
  }
  .bzl-design-icon-pure.dual-card-display-outline:before {
    content: "\\e1da";
  }
  .bzl-design-icon-pure.loading:before {
    content: "\\e1d8";
  }
  .bzl-design-icon-pure.portfolio-pic-outline:before {
    content: "\\e1d7";
  }
  .bzl-design-icon-pure.expert-analyzer-outline:before {
    content: "\\e1d6";
  }
  .bzl-design-icon-pure.communication-progress-outline:before {
    content: "\\e1d5";
  }
  .bzl-design-icon-pure.close-face1:before {
    content: "\\e1d4";
  }
  .bzl-design-icon-pure.car-outline1:before {
    content: "\\e1d3";
  }
  .bzl-design-icon-pure.bus-outline1:before {
    content: "\\e1d2";
  }
  .bzl-design-icon-pure.bike-outline1:before {
    content: "\\e1d1";
  }
  .bzl-design-icon-pure.hightlight-face1:before {
    content: "\\e1d0";
  }
  .bzl-design-icon-pure.image-broke-outline1:before {
    content: "\\e1cf";
  }
  .bzl-design-icon-pure.interview-outline1:before {
    content: "\\e1ce";
  }
  .bzl-design-icon-pure.ing-outline1:before {
    content: "\\e1cd";
  }
  .bzl-design-icon-pure.interview-face1:before {
    content: "\\e1cc";
  }
  .bzl-design-icon-pure.purpose-outline1:before {
    content: "\\e1cb";
  }
  .bzl-design-icon-pure.pic-outline1:before {
    content: "\\e1c9";
  }
  .bzl-design-icon-pure.input-face:before {
    content: "\\e1c7";
  }
  .bzl-design-icon-pure.input-outline:before {
    content: "\\e1c8";
  }
  .bzl-design-icon-pure.remove-face1:before {
    content: "\\e1be";
  }
  .bzl-design-icon-pure.tip-face2:before {
    content: "\\e1c1";
  }
  .bzl-design-icon-pure.walk-outline1:before {
    content: "\\e1c5";
  }
  .bzl-design-icon-pure.uploadcloud-face1:before {
    content: "\\e1c3";
  }
  .bzl-design-icon-pure.v-face1:before {
    content: "\\e1c4";
  }
  .bzl-design-icon-pure.setting-face1:before {
    content: "\\e1c0";
  }
  .bzl-design-icon-pure.report-face1:before {
    content: "\\e1bf";
  }
  .bzl-design-icon-pure.top-outline1:before {
    content: "\\e1c2";
  }
  .bzl-design-icon-pure.pic-face1:before {
    content: "\\e1bd";
  }
  .bzl-design-icon-pure.view-phone-outline:before {
    content: "\\e1b6";
  }
  .bzl-design-icon-pure.view-wechat-outline:before {
    content: "\\e1b8";
  }
  .bzl-design-icon-pure.chat-message:before {
    content: "\\e1b9";
  }
  .bzl-design-icon-pure.view-resume-outline:before {
    content: "\\e1b7";
  }
  .bzl-design-icon-pure.copy-outline1:before {
    content: "\\e1ba";
  }
  .bzl-design-icon-pure.interview-completed-outline:before {
    content: "\\e1b2";
  }
  .bzl-design-icon-pure.refuse-outline:before {
    content: "\\e1b3";
  }
  .bzl-design-icon-pure.retract-outline:before {
    content: "\\e1b4";
  }
  .bzl-design-icon-pure.transfer-outline:before {
    content: "\\e1b5";
  }
  .bzl-design-icon-pure.change-phone-number-outline:before {
    content: "\\e1b1";
  }
  .bzl-design-icon-pure.accessibility-outline:before {
    content: "\\e1a2";
  }
  .bzl-design-icon-pure.hearing-aid-outline:before {
    content: "\\e1a4";
  }
  .bzl-design-icon-pure.crutch-outline:before {
    content: "\\e1a3";
  }
  .bzl-design-icon-pure.hearing-impairment-outline:before {
    content: "\\e1a5";
  }
  .bzl-design-icon-pure.mental-disability-outline:before {
    content: "\\e1a7";
  }
  .bzl-design-icon-pure.physical-disability-outline:before {
    content: "\\e1a9";
  }
  .bzl-design-icon-pure.visual-impairment-outline:before {
    content: "\\e1ac";
  }
  .bzl-design-icon-pure.visual-aiddevice-outline:before {
    content: "\\e1ab";
  }
  .bzl-design-icon-pure.intellectual-disability-outline:before {
    content: "\\e1a6";
  }
  .bzl-design-icon-pure.walker-outline:before {
    content: "\\e1ad";
  }
  .bzl-design-icon-pure.lower-prosthesis-outline:before {
    content: "\\e1af";
  }
  .bzl-design-icon-pure.wear-prosthesis-outline:before {
    content: "\\e1ae";
  }
  .bzl-design-icon-pure.other-tools-outline:before {
    content: "\\e1a8";
  }
  .bzl-design-icon-pure.speech-impairment-outline:before {
    content: "\\e1aa";
  }
  .bzl-design-icon-pure.search-outline:before {
    content: "\\e18a";
  }
  .bzl-design-icon-pure.send-outline:before {
    content: "\\e18c";
  }
  .bzl-design-icon-pure.send-face:before {
    content: "\\e18b";
  }
  .bzl-design-icon-pure.setting-outline:before {
    content: "\\e18e";
  }
  .bzl-design-icon-pure.time-outline:before {
    content: "\\e190";
  }
  .bzl-design-icon-pure.tip-outline:before {
    content: "\\e193";
  }
  .bzl-design-icon-pure.tip-face:before {
    content: "\\e191";
  }
  .bzl-design-icon-pure.up-outline:before {
    content: "\\e195";
  }
  .bzl-design-icon-pure.upload-outline:before {
    content: "\\e196";
  }
  .bzl-design-icon-pure.switch-outline:before {
    content: "\\e18f";
  }
  .bzl-design-icon-pure.volumeoff-face:before {
    content: "\\e199";
  }
  .bzl-design-icon-pure.volumeon-face:before {
    content: "\\e19b";
  }
  .bzl-design-icon-pure.zoomout-outline:before {
    content: "\\e1a1";
  }
  .bzl-design-icon-pure.volumeon-outline:before {
    content: "\\e19c";
  }
  .bzl-design-icon-pure.volumeoff-outline:before {
    content: "\\e19a";
  }
  .bzl-design-icon-pure.work-face:before {
    content: "\\e19e";
  }
  .bzl-design-icon-pure.work-outline:before {
    content: "\\e19f";
  }
  .bzl-design-icon-pure.zoomin-outline:before {
    content: "\\e1a0";
  }
  .bzl-design-icon-pure.report-outline:before {
    content: "\\e17f";
  }
  .bzl-design-icon-pure.retransmission-outline:before {
    content: "\\e180";
  }
  .bzl-design-icon-pure.rightback-medium-outline:before {
    content: "\\e182";
  }
  .bzl-design-icon-pure.rightback-small-outline1:before {
    content: "\\e184";
  }
  .bzl-design-icon-pure.rightback-small-outline2:before {
    content: "\\e185";
  }
  .bzl-design-icon-pure.round-outline:before {
    content: "\\e186";
  }
  .bzl-design-icon-pure.save-face:before {
    content: "\\e187";
  }
  .bzl-design-icon-pure.save-outline:before {
    content: "\\e188";
  }
  .bzl-design-icon-pure.right-outline:before {
    content: "\\e181";
  }
  .bzl-design-icon-pure.remove-outline:before {
    content: "\\e17d";
  }
  .bzl-design-icon-pure.scan-outline:before {
    content: "\\e189";
  }
  .bzl-design-icon-pure.photo-face:before {
    content: "\\e171";
  }
  .bzl-design-icon-pure.photo:before {
    content: "\\e172";
  }
  .bzl-design-icon-pure.place-outline:before {
    content: "\\e176";
  }
  .bzl-design-icon-pure.rate-outline:before {
    content: "\\e17b";
  }
  .bzl-design-icon-pure.radio-face:before {
    content: "\\e17a";
  }
  .bzl-design-icon-pure.pass-face:before {
    content: "\\e16f";
  }
  .bzl-design-icon-pure.purpose-face:before {
    content: "\\e178";
  }
  .bzl-design-icon-pure.pass-outline:before {
    content: "\\e170";
  }
  .bzl-design-icon-pure.place-face:before {
    content: "\\e175";
  }
  .bzl-design-icon-pure.increase-outline:before {
    content: "\\e161";
  }
  .bzl-design-icon-pure.lights-outline:before {
    content: "\\e168";
  }
  .bzl-design-icon-pure.message-outline:before {
    content: "\\e16d";
  }
  .bzl-design-icon-pure.load-outline:before {
    content: "\\e16a";
  }
  .bzl-design-icon-pure.ing-face:before {
    content: "\\e162";
  }
  .bzl-design-icon-pure.message-face:before {
    content: "\\e16c";
  }
  .bzl-design-icon-pure.modify-outline:before {
    content: "\\e16e";
  }
  .bzl-design-icon-pure.leftback-outline:before {
    content: "\\e166";
  }
  .bzl-design-icon-pure.lights-face:before {
    content: "\\e167";
  }
  .bzl-design-icon-pure.menu-outline:before {
    content: "\\e16b";
  }
  .bzl-design-icon-pure.link-outline:before {
    content: "\\e169";
  }
  .bzl-design-icon-pure.collection-outline:before {
    content: "\\e154";
  }
  .bzl-design-icon-pure.collection-outline1:before {
    content: "\\e155";
  }
  .bzl-design-icon-pure.delete-outline:before {
    content: "\\e158";
  }
  .bzl-design-icon-pure.down-outline:before {
    content: "\\e159";
  }
  .bzl-design-icon-pure.educational-background-face:before {
    content: "\\e15a";
  }
  .bzl-design-icon-pure.educational-background-outline:before {
    content: "\\e15b";
  }
  .bzl-design-icon-pure.explain-outline:before {
    content: "\\e15c";
  }
  .bzl-design-icon-pure.image-broke-face:before {
    content: "\\e15e";
  }
  .bzl-design-icon-pure.copy-face:before {
    content: "\\e156";
  }
  .bzl-design-icon-pure.copy-outline:before {
    content: "\\e157";
  }
  .bzl-design-icon-pure.improper-outline:before {
    content: "\\e160";
  }
  .bzl-design-icon-pure.ban-outline:before {
    content: "\\e14d";
  }
  .bzl-design-icon-pure.ban-face:before {
    content: "\\e14c";
  }
  .bzl-design-icon-pure.close-outline:before {
    content: "\\e153";
  }
  .bzl-design-icon-pure.change-outline:before {
    content: "\\e151";
  }
  .bzl-design-icon-pure.add-face:before {
    content: "\\e149";
  }
  .bzl-design-icon-pure.add-outline1:before {
    content: "\\e14a";
  }
  .bzl-design-icon-pure.ai-face1:before {
    content: "\\e14b";
  }
  .bzl-design-icon-pure.recruitment-data-face:before {
    content: "\\e136";
  }
  .bzl-design-icon-pure.referral-face:before {
    content: "\\e138";
  }
  .bzl-design-icon-pure.recruitment-data-outline:before {
    content: "\\e137";
  }
  .bzl-design-icon-pure.referral-outline:before {
    content: "\\e139";
  }
  .bzl-design-icon-pure.rights-face:before {
    content: "\\e13a";
  }
  .bzl-design-icon-pure.rule-center-outline:before {
    content: "\\e13d";
  }
  .bzl-design-icon-pure.hunt-face:before {
    content: "\\e13e";
  }
  .bzl-design-icon-pure.target-outline:before {
    content: "\\e141";
  }
  .bzl-design-icon-pure.hunt-outline:before {
    content: "\\e13f";
  }
  .bzl-design-icon-pure.tools-box-face:before {
    content: "\\e142";
  }
  .bzl-design-icon-pure.tools-box-outline:before {
    content: "\\e143";
  }
  .bzl-design-icon-pure.tools-face:before {
    content: "\\e144";
  }
  .bzl-design-icon-pure.rights-outline:before {
    content: "\\e13b";
  }
  .bzl-design-icon-pure.rule-center-face:before {
    content: "\\e13c";
  }
  .bzl-design-icon-pure.target-face:before {
    content: "\\e140";
  }
  .bzl-design-icon-pure.tools-outline:before {
    content: "\\e145";
  }
  .bzl-design-icon-pure.job-subscription-face:before {
    content: "\\e126";
  }
  .bzl-design-icon-pure.job-subscription-outline:before {
    content: "\\e127";
  }
  .bzl-design-icon-pure.live-recruitment-outline:before {
    content: "\\e129";
  }
  .bzl-design-icon-pure.live-recruitment-face:before {
    content: "\\e128";
  }
  .bzl-design-icon-pure.more2-outline:before {
    content: "\\e12d";
  }
  .bzl-design-icon-pure.outsourcing-face:before {
    content: "\\e12e";
  }
  .bzl-design-icon-pure.precise-call-outline:before {
    content: "\\e131";
  }
  .bzl-design-icon-pure.outsourcing-outline:before {
    content: "\\e12f";
  }
  .bzl-design-icon-pure.more2-face:before {
    content: "\\e12c";
  }
  .bzl-design-icon-pure.premium-management-face:before {
    content: "\\e132";
  }
  .bzl-design-icon-pure.purple-face:before {
    content: "\\e134";
  }
  .bzl-design-icon-pure.me-outline:before {
    content: "\\e12b";
  }
  .bzl-design-icon-pure.purple-outline:before {
    content: "\\e135";
  }
  .bzl-design-icon-pure.precise-call-face:before {
    content: "\\e130";
  }
  .bzl-design-icon-pure.me-face:before {
    content: "\\e12a";
  }
  .bzl-design-icon-pure.premium-management-outline:before {
    content: "\\e133";
  }
  .bzl-design-icon-pure.human-face:before {
    content: "\\e114";
  }
  .bzl-design-icon-pure.human-outline:before {
    content: "\\e115";
  }
  .bzl-design-icon-pure.inspiration-outline:before {
    content: "\\e117";
  }
  .bzl-design-icon-pure.intelligent-interview-outline:before {
    content: "\\e119";
  }
  .bzl-design-icon-pure.inspiration-face:before {
    content: "\\e116";
  }
  .bzl-design-icon-pure.intention-communication-outline:before {
    content: "\\e11b";
  }
  .bzl-design-icon-pure.intention-leads-face:before {
    content: "\\e11c";
  }
  .bzl-design-icon-pure.intention-leads-outline:before {
    content: "\\e11d";
  }
  .bzl-design-icon-pure.interview-management-face:before {
    content: "\\e120";
  }
  .bzl-design-icon-pure.intention-communication-face:before {
    content: "\\e11a";
  }
  .bzl-design-icon-pure.interview-pelple-face:before {
    content: "\\e122";
  }
  .bzl-design-icon-pure.interaction-outline:before {
    content: "\\e11f";
  }
  .bzl-design-icon-pure.job-management-face:before {
    content: "\\e124";
  }
  .bzl-design-icon-pure.interview-management-outiine:before {
    content: "\\e121";
  }
  .bzl-design-icon-pure.job-management-outline:before {
    content: "\\e125";
  }
  .bzl-design-icon-pure.interview-pelple-outline:before {
    content: "\\e123";
  }
  .bzl-design-icon-pure.intelligent-interview-face:before {
    content: "\\e118";
  }
  .bzl-design-icon-pure.interaction-face:before {
    content: "\\e11e";
  }
  .bzl-design-icon-pure.ai-recruitment-outline:before {
    content: "\\e101";
  }
  .bzl-design-icon-pure.city-face:before {
    content: "\\e106";
  }
  .bzl-design-icon-pure.city-outline:before {
    content: "\\e107";
  }
  .bzl-design-icon-pure.filter-face:before {
    content: "\\e112";
  }
  .bzl-design-icon-pure.bidding-platform-face:before {
    content: "\\e102";
  }
  .bzl-design-icon-pure.company-homepage-outline:before {
    content: "\\e109";
  }
  .bzl-design-icon-pure.company-management-outline:before {
    content: "\\e10b";
  }
  .bzl-design-icon-pure.control-face:before {
    content: "\\e10c";
  }
  .bzl-design-icon-pure.creation-center-outline:before {
    content: "\\e111";
  }
  .bzl-design-icon-pure.company-management-face:before {
    content: "\\e10a";
  }
  .bzl-design-icon-pure.creation-center-face:before {
    content: "\\e110";
  }
  .bzl-design-icon-pure.chat-outline:before {
    content: "\\e105";
  }
  .bzl-design-icon-pure.control-outline:before {
    content: "\\e10d";
  }
  .bzl-design-icon-pure.filter-outline:before {
    content: "\\e113";
  }
  .bzl-design-icon-pure.chat-face:before {
    content: "\\e104";
  }
  .bzl-design-icon-pure.bidding-platform-outline:before {
    content: "\\e103";
  }
  .bzl-design-icon-pure.company-homepage-face:before {
    content: "\\e108";
  }
  .bzl-design-icon-pure.ai-recruitment-face:before {
    content: "\\e100";
  }
`},4724:function(e,t,n){n.d(t,{e:function(){return o},i:function(){return s},t:function(){return i}});var i={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},o=e=>(...t)=>({_$litDirective$:e,values:t}),s=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}},6909:function(e,t,n){n.d(t,{Cc:function(){return g},IA:function(){return p},OV:function(){return z},S7:function(){return v},VK:function(){return y},YG:function(){return b},ko:function(){return f},y0:function(){return $}});var i=Object.defineProperty,o=Object.defineProperties,s=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertySymbols,c=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,u=(e,t)=>(t=Symbol[e])?t:Symbol.for("Symbol."+e),d=e=>{throw TypeError(e)},h=(e,t,n)=>t in e?i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,p=(e,t)=>{for(var n in t||(t={}))c.call(t,n)&&h(e,n,t[n]);if(l)for(var n of l(t))a.call(t,n)&&h(e,n,t[n]);return e},f=(e,t)=>o(e,r(t)),b=(e,t)=>{var n={};for(var i in e)c.call(e,i)&&t.indexOf(i)<0&&(n[i]=e[i]);if(null!=e&&l)for(var i of l(e))t.indexOf(i)<0&&a.call(e,i)&&(n[i]=e[i]);return n},g=(e,t,n,o)=>{for(var r,l=o>1?void 0:o?s(t,n):t,c=e.length-1;c>=0;c--)(r=e[c])&&(l=(o?r(t,n,l):r(l))||l);return o&&l&&i(t,n,l),l},m=(e,t,n)=>t.has(e)||d("Cannot "+n),v=(e,t,n)=>(m(e,t,"read from private field"),n?n.call(e):t.get(e)),y=(e,t,n)=>t.has(e)?d("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n),z=(e,t,n,i)=>(m(e,t,"write to private field"),i?i.call(e,n):t.set(e,n),n),_=function(e,t){this[0]=e,this[1]=t},$=e=>{var t,n=e[u("asyncIterator")],i=!1,o={};return null==n?(n=e[u("iterator")](),t=e=>o[e]=t=>n[e](t)):(n=n.call(e),t=e=>o[e]=t=>{if(i){if(i=!1,"throw"===e)throw t;return t}return i=!0,{done:!1,value:new _(new Promise(i=>{var o=n[e](t);o instanceof Object||d("Object expected"),i(o)}),1)}}),o[u("iterator")]=()=>o,t("next"),"throw"in n?t("throw"):o.throw=e=>{throw e},"return"in n&&t("return"),o}},1054:function(e,t,n){n.d(t,{X:function(){return a},v:function(){return u}});var i=n(6482),o=n(5339),s=n(2106),r=n(5138),l=n(9016),c=n(6909),a=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{const t=e.target;(this.slotNames.includes("[default]")&&!t.name||t.name&&this.slotNames.includes(t.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){const t=e;if("bzl-visually-hidden"===t.tagName.toLowerCase())return!1;if(!t.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return null!==this.host.querySelector(`:scope > [slot="${e}"]`)}test(e){return"[default]"===e?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},u=class extends r.X{constructor(){super(...arguments),this.hasSlotController=new a(this,"[default]","icon","text"),this.text="",this.size="default"}render(){return this.hasSlotController.test("[default]")?l.x`
        <div part="base" class="spin spin--${this.size} spin--overlay">
          <div part="content" class="spin__content">
            <slot></slot>
          </div>
          <div class="spin__overlay">
            <div part="icon" class="spin__icon">
              <slot name="icon">
                <bzl-icon type="library" name="loading-face" class="spin__loading-icon"></bzl-icon>
              </slot>
            </div>
            ${this.text||this.hasSlotController.test("text")?l.x`
                  <div part="text" class="spin__text">
                    <slot name="text">${this.text}</slot>
                  </div>
                `:""}
          </div>
        </div>
      `:l.x`
      <div part="base" class="spin spin--${this.size}">
        <div part="icon" class="spin__icon">
          <slot name="icon">
            <bzl-icon type="library" name="loading-face" class="spin__loading-icon"></bzl-icon>
          </slot>
        </div>
        ${this.text||this.hasSlotController.test("text")?l.x`
              <div part="text" class="spin__text">
                <slot name="text">${this.text}</slot>
              </div>
            `:""}
      </div>
    `}};u.styles=[s.$,i.e],u.dependencies={"bzl-icon":o.K},(0,c.Cc)([(0,r.n)()],u.prototype,"text",2),(0,c.Cc)([(0,r.n)()],u.prototype,"size",2)}}]);