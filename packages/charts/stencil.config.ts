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
    enableImportInjection: true,
    experimentalSlotFixes: false // we don't use slots, flip to true if we start using them
  },
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@visa/charts',
      proxiesFile: '../charts-react/src/components/visa-charts.ts',
      includeDefineCustomElements: false,
      includeImportCustomElements: true,
      includePolyfills: false,
      customElementsDir: 'dist/components',
      // excludeComponents: ['visa-charts']
    }),
    angularOutputTarget({
      componentCorePackage: '@visa/charts',
      directivesProxyFile: '../charts-angular/src/lib/directives/visa-charts.ts',
      directivesArrayFile: '../charts-angular/src/lib/directives/index.ts',
      excludeComponents: ['visa-charts'],
      outputType: 'standalone',
      customElementsDir: 'dist/components'
    }),
    vueOutputTarget({
      componentCorePackage: '@visa/charts',
      proxiesFile: '../charts-vue/lib/components.ts',
      includeImportCustomElements: true,
      customElementsDir: 'dist/components',
      excludeComponents: ['visa-charts']
    }),
    { type: 'dist' },
    { type: 'dist-custom-elements', externalRuntime: false },
    { type: 'www' }
  ],
  plugins: [
    sass({
      injectGlobalPaths: ['scss/objects.scss']
    })
  ],
  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js']
  }
};
