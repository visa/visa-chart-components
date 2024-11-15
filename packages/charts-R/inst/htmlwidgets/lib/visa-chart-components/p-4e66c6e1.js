/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{h as n,e as t,b as r,i as u,a}from"./p-42dcf457.js";function o(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function e(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function f(n){return n<0?-n*n:n*n}function i(n){var r=n(a,a),u=1;function i(){return u===1?n(a,a):u===.5?n(e,f):n(o(u),o(1/u))}r.exponent=function(n){return arguments.length?(u=+n,i()):u};return t(r)}function c(){var t=i(n());t.copy=function(){return r(t,c()).exponent(t.exponent())};u.apply(t,arguments);return t}function s(){return c.apply(null,arguments).exponent(.5)}export{c as a,i as p,s};
//# sourceMappingURL=p-4e66c6e1.js.map