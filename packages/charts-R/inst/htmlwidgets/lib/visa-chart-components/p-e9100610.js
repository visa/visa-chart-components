/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{b as r}from"./p-cbe185fc.js";import{i as n,d as t,s as u}from"./p-ac3dcf33.js";function o(){var f,c=0,a=1,e=1,i=[.5],s=[0,1];function p(n){return n<=n?s[r(i,n,0,e)]:f}function m(){var r=-1;for(i=new Array(e);++r<e;)i[r]=((r+1)*a-(r-e)*c)/(e+1);return p}return p.domain=function(r){return arguments.length?(c=+r[0],a=+r[1],m()):[c,a]},p.range=function(r){return arguments.length?(e=(s=u.call(r)).length-1,m()):s.slice()},p.invertExtent=function(r){var n=s.indexOf(r);return n<0?[NaN,NaN]:n<1?[c,i[0]]:n>=e?[i[e-1],a]:[i[n-1],i[n]]},p.unknown=function(r){return arguments.length?(f=r,p):p},p.thresholds=function(){return i.slice()},p.copy=function(){return o().domain([c,a]).range(s).unknown(f)},n.apply(t(p),arguments)}export{o as q}