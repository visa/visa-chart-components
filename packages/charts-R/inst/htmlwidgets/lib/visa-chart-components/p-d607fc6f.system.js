/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-134059df.system.js"],(function(n){"use strict";var t,r,e,i,f;return{setters:[function(n){t=n.c;r=n.i;e=n.a;i=n.b;f=n.d}],execute:function(){n("i",l);function o(n,t){if(!t)t=[];var r=n?Math.min(t.length,n.length):0,e=t.slice(),i;return function(f){for(i=0;i<r;++i)e[i]=n[i]*(1-f)+t[i]*f;return e}}function u(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function a(n,t){var r=t?t.length:0,e=n?Math.min(r,n.length):0,i=new Array(e),f=new Array(r),o;for(o=0;o<e;++o)i[o]=l(n[o],t[o]);for(;o<r;++o)f[o]=t[o];return function(n){for(o=0;o<e;++o)f[o]=i[o](n);return f}}function c(n,t){var r=new Date;return n=+n,t=+t,function(e){return r.setTime(n*(1-e)+t*e),r}}function s(n,t){var r={},e={},i;if(n===null||typeof n!=="object")n={};if(t===null||typeof t!=="object")t={};for(i in t){if(i in n){r[i]=l(n[i],t[i])}else{e[i]=t[i]}}return function(n){for(i in r)e[i]=r[i](n);return e}}function l(n,l){var y=typeof l,g;return l==null||y==="boolean"?t(l):(y==="number"?r:y==="string"?(g=e(l))?(l=g,i):f:l instanceof e?i:l instanceof Date?c:u(l)?o:Array.isArray(l)?a:typeof l.valueOf!=="function"&&typeof l.toString!=="function"||isNaN(l)?s:r)(n,l)}}}}));