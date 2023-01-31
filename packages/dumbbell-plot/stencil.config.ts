/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { esModules } from '../utils-dev/src/utils-dev/unit-test-utils';

// exclude nested components from output targets, their packages will
// send the components to output targets as needed.
// const excludeComponents = ['data-table', 'keyboard-instructions'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;

export const config: Config | any = {
  namespace: 'dumbbell-plot',
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
    { type: 'dist' },
    {
      // we also use this output to copy the source code to our bundle package at @visa/charts
      type: 'www',
      copy: [{ src: 'components/dumbbell-plot', dest: '../../charts/src/components/dumbbell-plot', warn: true }]
    }
  ],
  plugins: [
    sass({
      injectGlobalPaths: ['src/scss/objects.scss']
    })
  ],
  commonjs: {
    include: ['../utils/dist/visa-charts-utils.umd.js', 'node_modules/bowser/es5.js']
  },
  testing: {
    reporters: ['default', '../../node_modules/jest-html-reporter'],
    transform: {
      '^.+\\.(ts|tsx|js|jsx|css)$': '@stencil/core/testing/jest-preprocessor'
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`]
    // another option for how to handle this, use d3's pre-minified files as well
    //  however transpiling is preferred and should be more stable in the long run
    // moduleNameMapper: {
    //   "^d3-color$": "<rootDir>/node_modules/d3-color/dist/d3-color.min.js",
    //   "^d3-scale$": "<rootDir>/node_modules/d3-scale/dist/d3-scale.min.js"
    // }
  }
};
