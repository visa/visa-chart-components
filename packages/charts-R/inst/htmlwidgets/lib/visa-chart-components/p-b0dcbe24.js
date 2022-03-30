/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
function l(l,f){var n,r,u=l.length,o=-1;if(null==f){for(;++o<u;)if(null!=(n=l[o])&&n>=n)for(r=n;++o<u;)null!=(n=l[o])&&r>n&&(r=n)}else for(;++o<u;)if(null!=(n=f(l[o],o,l))&&n>=n)for(r=n;++o<u;)null!=(n=f(l[o],o,l))&&r>n&&(r=n);return r}export{l as m}