/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{c as n,i as r,a as t,b as f,d as o}from"./p-b5f7528a.js";function e(n,r){if(!r)r=[];var t=n?Math.min(r.length,n.length):0,f=r.slice(),o;return function(e){for(o=0;o<t;++o)f[o]=n[o]*(1-e)+r[o]*e;return f}}function a(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function i(n,r){var t=r?r.length:0,f=n?Math.min(t,n.length):0,o=new Array(f),e=new Array(t),a;for(a=0;a<f;++a)o[a]=s(n[a],r[a]);for(;a<t;++a)e[a]=r[a];return function(n){for(a=0;a<f;++a)e[a]=o[a](n);return e}}function u(n,r){var t=new Date;return n=+n,r=+r,function(f){return t.setTime(n*(1-f)+r*f),t}}function c(n,r){var t={},f={},o;if(n===null||typeof n!=="object")n={};if(r===null||typeof r!=="object")r={};for(o in r){if(o in n){t[o]=s(n[o],r[o])}else{f[o]=r[o]}}return function(n){for(o in t)f[o]=t[o](n);return f}}function s(s,y){var l=typeof y,p;return y==null||l==="boolean"?n(y):(l==="number"?r:l==="string"?(p=t(y))?(y=p,f):o:y instanceof t?f:y instanceof Date?u:a(y)?e:Array.isArray(y)?i:typeof y.valueOf!=="function"&&typeof y.toString!=="function"||isNaN(y)?c:r)(s,y)}export{s as i};
//# sourceMappingURL=p-6e7316e2.js.map