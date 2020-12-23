/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

let excludeSrc = ['**/app-*/*', '**/*.spec*', '**/*.test*', '**/*.e2e*'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
if (dev) {
  excludeSrc = [];
}

export const config: Config | any = {
  namespace: 'heat-map',
  excludeSrc,
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/heat-map',
      loaderDir: 'dist/loader',
      proxiesFile: '../charts-react/src/components/heat-map.ts'
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/heat-map',
      directivesProxyFile: '../charts-angular/src/directives/heat-map.ts'
    }),
    { type: 'dist' },
    { type: 'www' }
  ],
  plugins: [
    sass({
      injectGlobalPaths: ['src/scss/objects.scss']
    })
  ],

  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js']
  }
};
