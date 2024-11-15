/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-24fea2b7.system.js"],(function(n){"use strict";var t,r,e,f,o;return{setters:[function(n){t=n.c;r=n.i;e=n.a;f=n.b;o=n.d}],execute:function(){n("i",y);function u(n,t){if(!t)t=[];var r=n?Math.min(t.length,n.length):0,e=t.slice(),f;return function(o){for(f=0;f<r;++f)e[f]=n[f]*(1-o)+t[f]*o;return e}}function i(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function a(n,t){var r=t?t.length:0,e=n?Math.min(r,n.length):0,f=new Array(e),o=new Array(r),u;for(u=0;u<e;++u)f[u]=y(n[u],t[u]);for(;u<r;++u)o[u]=t[u];return function(n){for(u=0;u<e;++u)o[u]=f[u](n);return o}}function c(n,t){var r=new Date;return n=+n,t=+t,function(e){return r.setTime(n*(1-e)+t*e),r}}function s(n,t){var r={},e={},f;if(n===null||typeof n!=="object")n={};if(t===null||typeof t!=="object")t={};for(f in t){if(f in n){r[f]=y(n[f],t[f])}else{e[f]=t[f]}}return function(n){for(f in r)e[f]=r[f](n);return e}}function y(n,y){var l=typeof y,p;return y==null||l==="boolean"?t(y):(l==="number"?r:l==="string"?(p=e(y))?(y=p,f):o:y instanceof e?f:y instanceof Date?c:i(y)?u:Array.isArray(y)?a:typeof y.valueOf!=="function"&&typeof y.toString!=="function"||isNaN(y)?s:r)(n,y)}}}}));
//# sourceMappingURL=p-4ee088ed.system.js.map