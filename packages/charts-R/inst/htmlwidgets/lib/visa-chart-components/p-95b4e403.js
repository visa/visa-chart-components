/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{b as r}from"./p-cbe185fc.js";import{i as n,d as t,s as u}from"./p-f01e9bc5.js";function o(){var f,e=0,c=1,i=1,a=[.5],s=[0,1];function p(n){return n<=n?s[r(a,n,0,i)]:f}function m(){var r=-1;for(a=new Array(i);++r<i;)a[r]=((r+1)*c-(r-i)*e)/(i+1);return p}return p.domain=function(r){return arguments.length?(e=+r[0],c=+r[1],m()):[e,c]},p.range=function(r){return arguments.length?(i=(s=u.call(r)).length-1,m()):s.slice()},p.invertExtent=function(r){var n=s.indexOf(r);return n<0?[NaN,NaN]:n<1?[e,a[0]]:n>=i?[a[i-1],c]:[a[n-1],a[n]]},p.unknown=function(r){return arguments.length?(f=r,p):p},p.thresholds=function(){return a.slice()},p.copy=function(){return o().domain([e,c]).range(s).unknown(f)},n.apply(t(p),arguments)}export{o as q}