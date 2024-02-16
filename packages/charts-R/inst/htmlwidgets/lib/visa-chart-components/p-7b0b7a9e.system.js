/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register([],(function(t){"use strict";return{execute:function(){t({a:n,b:e});var i=function(){function t(t,i){this._context=t;this._x=i}t.prototype.areaStart=function(){this._line=0};t.prototype.areaEnd=function(){this._line=NaN};t.prototype.lineStart=function(){this._point=0};t.prototype.lineEnd=function(){if(this._line||this._line!==0&&this._point===1)this._context.closePath();this._line=1-this._line};t.prototype.point=function(t,i){t=+t,i=+i;switch(this._point){case 0:{this._point=1;if(this._line)this._context.lineTo(t,i);else this._context.moveTo(t,i);break}case 1:this._point=2;default:{if(this._x)this._context.bezierCurveTo(this._x0=(this._x0+t)/2,this._y0,this._x0,i,t,i);else this._context.bezierCurveTo(this._x0,this._y0=(this._y0+i)/2,t,this._y0,t,i);break}}this._x0=t,this._y0=i};return t}();function e(t){return new i(t,true)}function n(t){return new i(t,false)}}}}));