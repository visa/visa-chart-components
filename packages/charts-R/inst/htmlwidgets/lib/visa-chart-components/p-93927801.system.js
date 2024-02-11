/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-e8773665.system.js"],(function(n){"use strict";var t,e,r,u,o;return{setters:[function(n){t=n.f;e=n.d;r=n.b;u=n.i;o=n.a}],execute:function(){n({a:s,p:p,s:a});function c(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function i(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function f(n){return n<0?-n*n:n*n}function p(n){var t=n(o,o),r=1;function u(){return r===1?n(o,o):r===.5?n(i,f):n(c(r),c(1/r))}t.exponent=function(n){return arguments.length?(r=+n,u()):r};return e(t)}function s(){var n=p(t());n.copy=function(){return r(n,s()).exponent(n.exponent())};u.apply(n,arguments);return n}function a(){return s.apply(null,arguments).exponent(.5)}}}}));