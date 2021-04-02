/**
 * Copyright (c) 2020, 2021 Visa, Inc.
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
  namespace: 'clustered-bar-chart',
  excludeSrc,
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/clustered-bar-chart',
      loaderDir: 'dist/loader',
      proxiesFile: '../charts-react/src/components/clustered-bar-chart.ts'
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/clustered-bar-chart',
      directivesProxyFile: '../charts-angular/src/directives/clustered-bar-chart.ts'
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
  },
  testing: {
    reporters: ['default', '../../node_modules/jest-html-reporter']
  }
};
