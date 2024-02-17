/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import"./p-cbe185fc.js";import{r as n}from"./p-1e7506b0.js";import{o as t,i as r}from"./p-45691346.js";function u(){var e,o,i=t().unknown(void 0),f=i.domain,c=i.range,a=[0,1],h=!1,p=0,s=0,M=.5;function l(){var t=f().length,r=a[1]<a[0],u=a[r-0],i=a[1-r];e=(i-u)/Math.max(1,t-p+2*s),h&&(e=Math.floor(e)),u+=(i-u-e*(t-p))*M,o=e*(1-p),h&&(u=Math.round(u),o=Math.round(o));var l=n(t).map((function(n){return u+e*n}));return c(r?l.reverse():l)}return delete i.unknown,i.domain=function(n){return arguments.length?(f(n),l()):f()},i.range=function(n){return arguments.length?(a=[+n[0],+n[1]],l()):a.slice()},i.rangeRound=function(n){return a=[+n[0],+n[1]],h=!0,l()},i.bandwidth=function(){return o},i.step=function(){return e},i.round=function(n){return arguments.length?(h=!!n,l()):h},i.padding=function(n){return arguments.length?(p=Math.min(1,s=+n),l()):p},i.paddingInner=function(n){return arguments.length?(p=Math.min(1,n),l()):p},i.paddingOuter=function(n){return arguments.length?(s=+n,l()):s},i.align=function(n){return arguments.length?(M=Math.max(0,Math.min(1,n)),l()):M},i.copy=function(){return u(f(),a).round(h).paddingInner(p).paddingOuter(s).align(M)},r.apply(l(),arguments)}function e(n){var t=n.copy;return n.padding=n.paddingOuter,delete n.paddingInner,delete n.paddingOuter,n.copy=function(){return e(t())},n}function o(){return e(u.apply(null,arguments).paddingInner(1))}export{u as b,o as p}