/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{f as n,d as t,b as r,i as u,a}from"./p-ac3dcf33.js";function f(n){return function(t){return t<0?-Math.pow(-t,n):Math.pow(t,n)}}function o(n){return n<0?-Math.sqrt(-n):Math.sqrt(n)}function c(n){return n<0?-n*n:n*n}function i(n){var r=n(a,a),u=1;function i(){return 1===u?n(a,a):.5===u?n(o,c):n(f(u),f(1/u))}return r.exponent=function(n){return arguments.length?(u=+n,i()):u},t(r)}function e(){var t=i(n());return t.copy=function(){return r(t,e()).exponent(t.exponent())},u.apply(t,arguments),t}function s(){return e.apply(null,arguments).exponent(.5)}export{e as a,i as p,s}