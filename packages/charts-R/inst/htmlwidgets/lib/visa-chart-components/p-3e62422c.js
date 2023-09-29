/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{b as r}from"./p-cbe185fc.js";import{i as n,d as t,s as u}from"./p-be615bb3.js";function o(){var e,f=0,i=1,a=1,c=[.5],s=[0,1];function b(n){return n<=n?s[r(c,n,0,a)]:e}function p(){var r=-1;for(c=new Array(a);++r<a;)c[r]=((r+1)*i-(r-a)*f)/(a+1);return b}return b.domain=function(r){return arguments.length?(f=+r[0],i=+r[1],p()):[f,i]},b.range=function(r){return arguments.length?(a=(s=u.call(r)).length-1,p()):s.slice()},b.invertExtent=function(r){var n=s.indexOf(r);return n<0?[NaN,NaN]:n<1?[f,c[0]]:n>=a?[c[a-1],i]:[c[n-1],c[n]]},b.unknown=function(r){return arguments.length?(e=r,b):b},b.thresholds=function(){return c.slice()},b.copy=function(){return o().domain([f,i]).range(s).unknown(e)},n.apply(t(b),arguments)}export{o as q}