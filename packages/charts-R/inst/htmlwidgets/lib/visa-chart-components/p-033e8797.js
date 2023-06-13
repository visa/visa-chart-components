/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{c as n,p as t}from"./p-a2704cb7.js";import{x as i,y as u}from"./p-cbc590f6.js";function r(n){this._context=n}function o(n){return new r(n)}function f(){var r=i,f=u,s=n(!0),c=null,e=o,l=null;function h(n){var i,u,o,h=n.length,a=!1;for(null==c&&(l=e(o=t())),i=0;i<=h;++i)!(i<h&&s(u=n[i],i,n))===a&&((a=!a)?l.lineStart():l.lineEnd()),a&&l.point(+r(u,i,n),+f(u,i,n));if(o)return l=null,o+""||null}return h.x=function(t){return arguments.length?(r="function"==typeof t?t:n(+t),h):r},h.y=function(t){return arguments.length?(f="function"==typeof t?t:n(+t),h):f},h.defined=function(t){return arguments.length?(s="function"==typeof t?t:n(!!t),h):s},h.curve=function(n){return arguments.length?(e=n,null!=c&&(l=e(c)),h):e},h.context=function(n){return arguments.length?(null==n?c=l=null:l=e(c=n),h):c},h}r.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(n,t){switch(n=+n,t=+t,this._point){case 0:this._point=1,this._line?this._context.lineTo(n,t):this._context.moveTo(n,t);break;case 1:this._point=2;default:this._context.lineTo(n,t)}}};export{f as l}