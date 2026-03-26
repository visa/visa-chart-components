/**
 * Copyright (c) 2026 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{h as n,e as t,b as r,i as u,a}from"./p-96dd0c39.js";function o(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function e(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function i(n){return n<0?-n*n:n*n}function c(n){var r=n(a,a),u=1;function c(){return u===1?n(a,a):u===.5?n(e,i):n(o(u),o(1/u))}r.exponent=function(n){return arguments.length?(u=+n,c()):u};return t(r)}function f(){var t=c(n());t.copy=function(){return r(t,f()).exponent(t.exponent())};u.apply(t,arguments);return t}function s(){return f.apply(null,arguments).exponent(.5)}export{f as a,c as p,s};
//# sourceMappingURL=p-e912cf5b.js.map