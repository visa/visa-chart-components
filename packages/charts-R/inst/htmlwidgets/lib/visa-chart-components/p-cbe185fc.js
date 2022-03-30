/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
function n(n,r){return n<r?-1:n>r?1:n>=r?0:NaN}function r(r){var u;return 1===r.length&&(u=r,r=function(r,l){return n(u(r),l)}),{left:function(n,u,l,f){for(null==l&&(l=0),null==f&&(f=n.length);l<f;){var t=l+f>>>1;r(n[t],u)<0?l=t+1:f=t}return l},right:function(n,u,l,f){for(null==l&&(l=0),null==f&&(f=n.length);l<f;){var t=l+f>>>1;r(n[t],u)>0?f=t:l=t+1}return l}}}var u=r(n).right;function l(n,r){var u,l,f=n.length,t=-1;if(null==r){for(;++t<f;)if(null!=(u=n[t])&&u>=u)for(l=u;++t<f;)null!=(u=n[t])&&u>l&&(l=u)}else for(;++t<f;)if(null!=(u=r(n[t],t,n))&&u>=u)for(l=u;++t<f;)null!=(u=r(n[t],t,n))&&u>l&&(l=u);return l}export{r as a,u as b,l as m}