/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{c as n,i as r,a as t,b as o,d as e}from"./p-91852fd8.js";function f(n,r){r||(r=[]);var t,o=n?Math.min(r.length,n.length):0,e=r.slice();return function(f){for(t=0;t<o;++t)e[t]=n[t]*(1-f)+r[t]*f;return e}}function a(n,r){var t,o=r?r.length:0,e=n?Math.min(o,n.length):0,f=new Array(e),a=new Array(o);for(t=0;t<e;++t)f[t]=c(n[t],r[t]);for(;t<o;++t)a[t]=r[t];return function(n){for(t=0;t<e;++t)a[t]=f[t](n);return a}}function u(n,r){var t=new Date;return n=+n,r=+r,function(o){return t.setTime(n*(1-o)+r*o),t}}function i(n,r){var t,o={},e={};for(t in null!==n&&"object"==typeof n||(n={}),null!==r&&"object"==typeof r||(r={}),r)t in n?o[t]=c(n[t],r[t]):e[t]=r[t];return function(n){for(t in o)e[t]=o[t](n);return e}}function c(c,s){var y,p,l=typeof s;return null==s||"boolean"===l?n(s):("number"===l?r:"string"===l?(y=t(s))?(s=y,o):e:s instanceof t?o:s instanceof Date?u:(p=s,!ArrayBuffer.isView(p)||p instanceof DataView?Array.isArray(s)?a:"function"!=typeof s.valueOf&&"function"!=typeof s.toString||isNaN(s)?i:r:f))(c,s)}export{c as i}