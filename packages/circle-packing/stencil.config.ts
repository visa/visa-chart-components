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
  namespace: 'circle-packing',
  excludeSrc,
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/circle-packing',
      loaderDir: 'dist/loader',
      proxiesFile: '../charts-react/src/components/circle-packing.ts'
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/circle-packing',
      directivesProxyFile: '../charts-angular/src/directives/circle-packing.ts'
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
