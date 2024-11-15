/**
 * Copyright (c) 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
class t{constructor(t,s){this._context=t;this._x=s}areaStart(){this._line=0}areaEnd(){this._line=NaN}lineStart(){this._point=0}lineEnd(){if(this._line||this._line!==0&&this._point===1)this._context.closePath();this._line=1-this._line}point(t,s){t=+t,s=+s;switch(this._point){case 0:{this._point=1;if(this._line)this._context.lineTo(t,s);else this._context.moveTo(t,s);break}case 1:this._point=2;default:{if(this._x)this._context.bezierCurveTo(this._x0=(this._x0+t)/2,this._y0,this._x0,s,t,s);else this._context.bezierCurveTo(this._x0,this._y0=(this._y0+s)/2,t,this._y0,t,s);break}}this._x0=t,this._y0=s}}function s(s){return new t(s,true)}function i(s){return new t(s,false)}export{i as a,s as b};
//# sourceMappingURL=p-50f1a99e.js.map