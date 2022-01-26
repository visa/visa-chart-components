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
const nodePolyfills = require('rollup-plugin-node-polyfills');

let copy = [];
let excludeSrc = ['**/app-*/*', '**/*.spec*', '**/*.test*', '**/*.e2e*'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
if (dev) {
  excludeSrc = [];
  copy = [{ src: 'components/app-bivariate-mapbox-map/data', dest: 'data' }];
}

export const config: Config | any = {
  namespace: 'bivariate-mapbox-map',
  excludeSrc,
  copy,
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/bivariate-mapbox-map',
      loaderDir: 'dist/loader',
      proxiesFile: '../charts-react/src/components/bivariate-mapbox-map.ts'
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/bivariate-mapbox-map',
      directivesProxyFile: '../charts-angular/src/lib/directives/bivariate-mapbox-map.ts'
    }),
    { type: 'dist' },
    { type: 'www' }
  ],
  rollupPlugins: { after: [nodePolyfills()] },
  plugins: [
    sass({
      injectGlobalPaths: ['src/scss/objects.scss']
    })
  ],
  commonjs: {
    include: [
      '../utils/dist/visa-charts-utils.umd.js',
      'node_modules/@turf/turf/turf.min.js',
      'node_modules/mapbox-gl/dist/mapbox-gl.js',
      'node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js'
    ]
  }
};
