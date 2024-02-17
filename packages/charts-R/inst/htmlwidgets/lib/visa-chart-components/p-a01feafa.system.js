/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-7be0a444.system.js"],(function(n){"use strict";var t,e,r,i,f;return{setters:[function(n){t=n.c;e=n.i;r=n.a;i=n.b;f=n.d}],execute:function(){n("i",l);function o(n,t){if(!t)t=[];var e=n?Math.min(t.length,n.length):0,r=t.slice(),i;return function(f){for(i=0;i<e;++i)r[i]=n[i]*(1-f)+t[i]*f;return r}}function u(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function a(n,t){var e=t?t.length:0,r=n?Math.min(e,n.length):0,i=new Array(r),f=new Array(e),o;for(o=0;o<r;++o)i[o]=l(n[o],t[o]);for(;o<e;++o)f[o]=t[o];return function(n){for(o=0;o<r;++o)f[o]=i[o](n);return f}}function c(n,t){var e=new Date;return n=+n,t=+t,function(r){return e.setTime(n*(1-r)+t*r),e}}function s(n,t){var e={},r={},i;if(n===null||typeof n!=="object")n={};if(t===null||typeof t!=="object")t={};for(i in t){if(i in n){e[i]=l(n[i],t[i])}else{r[i]=t[i]}}return function(n){for(i in e)r[i]=e[i](n);return r}}function l(n,l){var y=typeof l,g;return l==null||y==="boolean"?t(l):(y==="number"?e:y==="string"?(g=r(l))?(l=g,i):f:l instanceof r?i:l instanceof Date?c:u(l)?o:Array.isArray(l)?a:typeof l.valueOf!=="function"&&typeof l.toString!=="function"||isNaN(l)?s:e)(n,l)}}}}));