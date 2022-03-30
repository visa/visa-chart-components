/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{b as r}from"./p-cbe185fc.js";import{i as n,d as t,s as u}from"./p-f913f2e2.js";function f(){var o,e=0,i=1,a=1,c=[.5],s=[0,1];function p(n){return n<=n?s[r(c,n,0,a)]:o}function m(){var r=-1;for(c=new Array(a);++r<a;)c[r]=((r+1)*i-(r-a)*e)/(a+1);return p}return p.domain=function(r){return arguments.length?(e=+r[0],i=+r[1],m()):[e,i]},p.range=function(r){return arguments.length?(a=(s=u.call(r)).length-1,m()):s.slice()},p.invertExtent=function(r){var n=s.indexOf(r);return n<0?[NaN,NaN]:n<1?[e,c[0]]:n>=a?[c[a-1],i]:[c[n-1],c[n]]},p.unknown=function(r){return arguments.length?(o=r,p):p},p.thresholds=function(){return c.slice()},p.copy=function(){return f().domain([e,i]).range(s).unknown(o)},n.apply(t(p),arguments)}export{f as q}