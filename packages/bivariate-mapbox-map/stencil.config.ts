/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
// import { reactOutputTarget } from '@stencil/react-output-target';
// import { angularOutputTarget } from '@stencil/angular-output-target';
const nodePolyfills = require('rollup-plugin-node-polyfills');

let copy = [];
// exclude nested components from output targets, their packages will
// send the components to output targets as needed.
// const excludeComponents = ['data-table', 'keyboard-instructions', 'scatter-plot'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;
if (dev) {
  copy = [{ src: 'components/app-bivariate-mapbox-map/data', dest: 'data' }];
}
export const config: Config | any = {
  namespace: 'bivariate-mapbox-map',
  tsconfig: dev ? './tsconfig.dev.json' : './tsconfig.prod.json',
  buildEs5: 'prod',
  extras: {
    cssVarsShim: true,
    dynamicImportShim: true,
    safari10: true,
    shadowDomShim: true,
    scriptDataOpts: true,
    appendChildSlotFix: false,
    cloneNodeFix: false,
    slotChildNodesFix: true
  },
  outputTargets: [
    // remove mapbox component from bundles
    // reactOutputTarget({
    //   componentCorePackage: '@visa/bivariate-mapbox-map',
    //   loaderDir: 'dist/loader',
    //   proxiesFile: '../charts-react/src/components/bivariate-mapbox-map.ts',
    //   excludeComponents
    // }),
    // angularOutputTarget({
    //   componentCorePackage: '@visa/bivariate-mapbox-map',
    //   directivesProxyFile: '../charts-angular/src/lib/directives/bivariate-mapbox-map.ts',
    //   excludeComponents
    // }),
    { type: 'dist' },
    { type: 'www', copy }
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
      'node_modules/mapbox-gl/dist/mapbox-gl.js',
      'node_modules/@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.js'
    ]
  }
};
