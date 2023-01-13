/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// exclude nested components from output targets, their packages will
// send the components to output targets as needed.
// const excludeComponents = ['data-table', 'keyboard-instructions'];
// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;

export const config: Config | any = {
  namespace: 'circle-packing',
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
      copy: [{ src: 'components/circle-packing', dest: '../../charts/src/components/circle-packing', warn: true }]
    }
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
