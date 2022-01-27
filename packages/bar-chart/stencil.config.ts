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

// exclude nested components from output targets
const excludeComponents = ['data-table', 'keyboard-instructions'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;

export const config: Config | any = {
  namespace: 'bar-chart',
  tsconfig: dev ? './tsconfig.dev.json' : './tsconfig.json',
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
    reactOutputTarget({
      componentCorePackage: '@visa/bar-chart',
      loaderDir: 'dist/loader',
      proxiesFile: '../charts-react/src/components/bar-chart.ts',
      excludeComponents
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/bar-chart',
      directivesProxyFile: '../charts-angular/src/lib/directives/bar-chart.ts',
      excludeComponents
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
