/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{i as n,e as r,f as t,s as u}from"./p-42dcf457.js";function e(){var f=0,i=1,o=1,a=[.5],c=[0,1],s;function N(n){return n<=n?c[t(a,n,0,o)]:s}function p(){var n=-1;a=new Array(o);while(++n<o)a[n]=((n+1)*i-(n-o)*f)/(o+1);return N}N.domain=function(n){return arguments.length?(f=+n[0],i=+n[1],p()):[f,i]};N.range=function(n){return arguments.length?(o=(c=u.call(n)).length-1,p()):c.slice()};N.invertExtent=function(n){var r=c.indexOf(n);return r<0?[NaN,NaN]:r<1?[f,a[0]]:r>=o?[a[o-1],i]:[a[r-1],a[r]]};N.unknown=function(n){return arguments.length?(s=n,N):N};N.thresholds=function(){return a.slice()};N.copy=function(){return e().domain([f,i]).range(c).unknown(s)};return n.apply(r(N),arguments)}export{e as q};
//# sourceMappingURL=p-2c889405.js.map