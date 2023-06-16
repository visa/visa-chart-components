/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.
//
// Some static assets may be required by the custom widget javascript. The base
// url for the notebook is not known at build time and is therefore computed
// dynamically.
__webpack_public_path__ =
  document.querySelector('body').getAttribute('data-base-url') + 'nbextensions/@visa/charts-python';

// Configure requirejs
if (window.require) {
  window.require.config({
    map: {
      '*': {
        '@visa/charts-python': 'nbextensions/@visa/charts-python/index'
      }
    }
  });
}

// Export the required load_ipython_extension
export function load_ipython_extension() {}
