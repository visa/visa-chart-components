/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-36d0ec22.system.js","./p-d4465066.system.js"],(function(n){"use strict";var t,e,r,u;return{setters:[function(n){t=n.b},function(n){e=n.i;r=n.d;u=n.s}],execute:function(){n("q",i);function i(){var n=0,c=1,o=1,s=[.5],f=[0,1],a;function l(n){return n<=n?f[t(s,n,0,o)]:a}function d(){var t=-1;s=new Array(o);while(++t<o)s[t]=((t+1)*c-(t-o)*n)/(o+1);return l}l.domain=function(t){return arguments.length?(n=+t[0],c=+t[1],d()):[n,c]};l.range=function(n){return arguments.length?(o=(f=u.call(n)).length-1,d()):f.slice()};l.invertExtent=function(t){var e=f.indexOf(t);return e<0?[NaN,NaN]:e<1?[n,s[0]]:e>=o?[s[o-1],c]:[s[e-1],s[e]]};l.unknown=function(n){return arguments.length?(a=n,l):l};l.thresholds=function(){return s.slice()};l.copy=function(){return i().domain([n,c]).range(f).unknown(a)};return e.apply(r(l),arguments)}}}}));