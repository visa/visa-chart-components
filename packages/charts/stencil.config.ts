/**
 * Copyright (c) 2020, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

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
  buildEs5: 'prod',
  extras: {
    cssVarsShim: true,
    appendChildSlotFix: false,
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
    vueOutputTarget({
      componentCorePackage: '@visa/charts',
      proxiesFile: '../charts-vue/lib/components.ts'
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
