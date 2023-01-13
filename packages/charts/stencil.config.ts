/**
 * Copyright (c) 2020, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';

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

// temporary comment to bump charts with feature commit
export const config: Config | any = {
  namespace: 'charts',
  buildEs5: 'prod',
  extras: {
    appendChildSlotFix: false,
    cssVarsShim: true,
    dynamicImportShim: true,
    safari10: true,
    shadowDomShim: true,
    scriptDataOpts: true,
    cloneNodeFix: false,
    slotChildNodesFix: true
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/charts',
      proxiesFile: '../charts-react/src/components/visa-charts.ts',
      includeDefineCustomElements: true,
      includePolyfills: true,
      excludeComponents: ['visa-charts']
    }),
    reactOutputTarget({
      componentCorePackage: '@visa/charts',
      proxiesFile: '../charts-figma/src/visa-charts.ts',
      includeDefineCustomElements: false,
      includeImportCustomElements: true,
      includePolyfills: false,
      customElementsDir: 'dist/components',
      excludeComponents: ['visa-charts']
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/charts',
      directivesProxyFile: '../charts-angular/src/lib/directives/visa-charts.ts',
      excludeComponents: ['visa-charts']
    }),
    { type: 'dist' },
    { type: 'dist-custom-elements', externalRuntime: false },
    { type: 'www' }
  ],
  plugins: [
    external({
      external: ['mapbox-gl']
    }),
    sass({
      injectGlobalPaths: ['scss/objects.scss']
    })
  ],
  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js', '../dumbbell-plot/node_modules/bowser/es5.js']
  }
};
