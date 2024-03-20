/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-6f1df621.system.js"],(function(n){"use strict";var t,r,e,u,o;return{setters:[function(n){t=n.f;r=n.d;e=n.b;u=n.i;o=n.a}],execute:function(){n({a:s,p:p,s:a});function c(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function f(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function i(n){return n<0?-n*n:n*n}function p(n){var t=n(o,o),e=1;function u(){return e===1?n(o,o):e===.5?n(f,i):n(c(e),c(1/e))}t.exponent=function(n){return arguments.length?(e=+n,u()):e};return r(t)}function s(){var n=p(t());n.copy=function(){return e(n,s()).exponent(n.exponent())};u.apply(n,arguments);return n}function a(){return s.apply(null,arguments).exponent(.5)}}}}));