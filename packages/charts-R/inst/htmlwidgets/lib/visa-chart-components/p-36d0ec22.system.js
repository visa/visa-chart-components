/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register([],(function(n){"use strict";return{execute:function(){n({a:l,m:r});function e(n,e){return n<e?-1:n>e?1:n>=e?0:NaN}function l(n){if(n.length===1)n=i(n);return{left:function(e,l,i,t){if(i==null)i=0;if(t==null)t=e.length;while(i<t){var u=i+t>>>1;if(n(e[u],l)<0)i=u+1;else t=u}return i},right:function(e,l,i,t){if(i==null)i=0;if(t==null)t=e.length;while(i<t){var u=i+t>>>1;if(n(e[u],l)>0)t=u;else i=u+1}return i}}}function i(n){return function(l,i){return e(n(l),i)}}var t=l(e);var u=n("b",t.right);function r(n,e){var l=n.length,i=-1,t,u;if(e==null){while(++i<l){if((t=n[i])!=null&&t>=t){u=t;while(++i<l){if((t=n[i])!=null&&t>u){u=t}}}}}else{while(++i<l){if((t=e(n[i],i,n))!=null&&t>=t){u=t;while(++i<l){if((t=e(n[i],i,n))!=null&&t>u){u=t}}}}}return u}}}}));