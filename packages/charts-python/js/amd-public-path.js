/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// In an AMD module, we set the public path using the magic requirejs 'module' dependency
// See https://github.com/requirejs/requirejs/wiki/Differences-between-the-simplified-CommonJS-wrapper-and-standard-AMD-define#module
// Since 'module' is a requirejs magic module, we must include 'module' in the webpack externals configuration.
import * as module from 'module';
const url = new URL(module.uri, document.location);
// Using lastIndexOf('/')+1 gives us the empty string if there is no '/', so pathname becomes '/'
url.pathname = url.pathname.slice(0, url.pathname.lastIndexOf('/') + 1);
__webpack_public_path__ = `${url.origin}${url.pathname}`;
