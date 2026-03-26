/**
 * Copyright (c) 2026 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{i as n,e as r,f as t,s as u}from"./p-96dd0c39.js";function e(){var i=0,o=1,a=1,f=[.5],c=[0,1],s;function N(n){return n<=n?c[t(f,n,0,a)]:s}function p(){var n=-1;f=new Array(a);while(++n<a)f[n]=((n+1)*o-(n-a)*i)/(a+1);return N}N.domain=function(n){return arguments.length?(i=+n[0],o=+n[1],p()):[i,o]};N.range=function(n){return arguments.length?(a=(c=u.call(n)).length-1,p()):c.slice()};N.invertExtent=function(n){var r=c.indexOf(n);return r<0?[NaN,NaN]:r<1?[i,f[0]]:r>=a?[f[a-1],o]:[f[r-1],f[r]]};N.unknown=function(n){return arguments.length?(s=n,N):N};N.thresholds=function(){return f.slice()};N.copy=function(){return e().domain([i,o]).range(c).unknown(s)};return n.apply(r(N),arguments)}export{e as q};
//# sourceMappingURL=p-7738e447.js.map