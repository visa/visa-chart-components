/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';

function external(c = {}) {
  const ext = 'external';
  return {
    name: 'external',
    options(options) {
      options.external = (options.external || []).concat(c[ext]);
      return options;
    }
  };
}

export const config: Config | any = {
  namespace: 'charts',
  outputTargets: [{ type: 'dist' }, { type: 'www' }],
  plugins: [
    external({
      external: ['mapbox-gl']
    })
  ],
  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js', '../dumbbell-plot/node_modules/bowser/es5.js']
  }
};
