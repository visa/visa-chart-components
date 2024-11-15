/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-371946ee.system.js"],(function(n){"use strict";var t,r,u,e,c;return{setters:[function(n){t=n.h;r=n.e;u=n.b;e=n.i;c=n.a}],execute:function(){n({a:a,p:s,s:h});function i(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function f(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function o(n){return n<0?-n*n:n*n}function s(n){var t=n(c,c),u=1;function e(){return u===1?n(c,c):u===.5?n(f,o):n(i(u),i(1/u))}t.exponent=function(n){return arguments.length?(u=+n,e()):u};return r(t)}function a(){var n=s(t());n.copy=function(){return u(n,a()).exponent(n.exponent())};e.apply(n,arguments);return n}function h(){return a.apply(null,arguments).exponent(.5)}}}}));
//# sourceMappingURL=p-c1af5ec6.system.js.map