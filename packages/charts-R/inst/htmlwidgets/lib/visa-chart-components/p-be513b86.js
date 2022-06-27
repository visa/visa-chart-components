/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{f as n,d as t,b as r,i as u,a}from"./p-b0783667.js";function o(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function f(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function i(n){return n<0?-n*n:n*n}function e(n){var r=n(a,a),u=1;function e(){return 1===u?n(a,a):.5===u?n(f,i):n(o(u),o(1/u))}return r.exponent=function(n){return arguments.length?(u=+n,e()):u},t(r)}function c(){var t=e(n());return t.copy=function(){return r(t,c()).exponent(t.exponent())},u.apply(t,arguments),t}function s(){return c.apply(null,arguments).exponent(.5)}export{c as a,e as p,s}