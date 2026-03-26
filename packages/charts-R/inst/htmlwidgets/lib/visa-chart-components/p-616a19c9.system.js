/**
 * Copyright (c) 2026 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-524cfd57.system.js"],(function(n){"use strict";var t,r,u,e,c;return{setters:[function(n){t=n.h;r=n.e;u=n.b;e=n.i;c=n.a}],execute:function(){n({a:a,p:s,s:h});function f(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function i(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function o(n){return n<0?-n*n:n*n}function s(n){var t=n(c,c),u=1;function e(){return u===1?n(c,c):u===.5?n(i,o):n(f(u),f(1/u))}t.exponent=function(n){return arguments.length?(u=+n,e()):u};return r(t)}function a(){var n=s(t());n.copy=function(){return u(n,a()).exponent(n.exponent())};e.apply(n,arguments);return n}function h(){return a.apply(null,arguments).exponent(.5)}}}}));
//# sourceMappingURL=p-616a19c9.system.js.map