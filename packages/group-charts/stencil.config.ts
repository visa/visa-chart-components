/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

let excludeSrc = ['**/app-*/*', '**/*.spec*', '**/*.test*', '**/*.e2e*'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
if (dev) {
  excludeSrc = [];
}

export const config: Config | any = {
  namespace: 'group-charts',
  excludeSrc,
  outputTargets: [{ type: 'dist' }, { type: 'www' }],
  plugins: [
    sass({
      injectGlobalPaths: ['src/scss/objects.scss']
    })
  ],
  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js']
  }
};
