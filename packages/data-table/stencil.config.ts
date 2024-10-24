/**
 * Copyright (c) 2020, 2021, 2022, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// @ts-ignore
const dev: boolean = process.argv && process.argv.indexOf('--dev') > -1;

export const config: Config | any = {
  namespace: 'visa-charts-data-table',
  tsconfig: dev ? './tsconfig.dev.json' : './tsconfig.prod.json',
  buildEs5: 'prod',
  extras: {
    enableImportInjection: true,
    experimentalSlotFixes: false // we don't use slots, flip to true if we start using them
  },
  outputTargets: [
    { type: 'dist' },
    { type: 'dist-custom-elements', externalRuntime: false },
    {
      // we also use this output to copy the source code to our bundle package at @visa/charts
      type: 'www',
      copy: [
        {
          src: 'components/data-table/**/!(*spec).{js,ts,tsx,jsx,scss,css}',
          dest: '../../charts/src/components/data-table',
          warn: true
        }
      ]
    }
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
