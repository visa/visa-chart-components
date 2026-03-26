/**
 * Copyright (c) 2026 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{c as n,i as r,a as t,b as e,d as f}from"./p-c401ee52.js";function o(n,r){if(!r)r=[];var t=n?Math.min(r.length,n.length):0,e=r.slice(),f;return function(o){for(f=0;f<t;++f)e[f]=n[f]*(1-o)+r[f]*o;return e}}function i(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function a(n,r){var t=r?r.length:0,e=n?Math.min(t,n.length):0,f=new Array(e),o=new Array(t),i;for(i=0;i<e;++i)f[i]=s(n[i],r[i]);for(;i<t;++i)o[i]=r[i];return function(n){for(i=0;i<e;++i)o[i]=f[i](n);return o}}function u(n,r){var t=new Date;return n=+n,r=+r,function(e){return t.setTime(n*(1-e)+r*e),t}}function c(n,r){var t={},e={},f;if(n===null||typeof n!=="object")n={};if(r===null||typeof r!=="object")r={};for(f in r){if(f in n){t[f]=s(n[f],r[f])}else{e[f]=r[f]}}return function(n){for(f in t)e[f]=t[f](n);return e}}function s(s,y){var l=typeof y,p;return y==null||l==="boolean"?n(y):(l==="number"?r:l==="string"?(p=t(y))?(y=p,e):f:y instanceof t?e:y instanceof Date?u:i(y)?o:Array.isArray(y)?a:typeof y.valueOf!=="function"&&typeof y.toString!=="function"||isNaN(y)?c:r)(s,y)}export{s as i};
//# sourceMappingURL=p-0e79034b.js.map