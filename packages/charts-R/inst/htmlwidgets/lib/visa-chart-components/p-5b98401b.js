/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{b as r}from"./p-cbe185fc.js";import{i as n,d as t,s as u}from"./p-d34ffa0f.js";function f(){var o,a=0,e=1,i=1,c=[.5],s=[0,1];function p(n){return n<=n?s[r(c,n,0,i)]:o}function m(){var r=-1;for(c=new Array(i);++r<i;)c[r]=((r+1)*e-(r-i)*a)/(i+1);return p}return p.domain=function(r){return arguments.length?(a=+r[0],e=+r[1],m()):[a,e]},p.range=function(r){return arguments.length?(i=(s=u.call(r)).length-1,m()):s.slice()},p.invertExtent=function(r){var n=s.indexOf(r);return n<0?[NaN,NaN]:n<1?[a,c[0]]:n>=i?[c[i-1],e]:[c[n-1],c[n]]},p.unknown=function(r){return arguments.length?(o=r,p):p},p.thresholds=function(){return c.slice()},p.copy=function(){return f().domain([a,e]).range(s).unknown(o)},n.apply(t(p),arguments)}export{f as q}