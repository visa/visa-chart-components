/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Config } from '@stencil/core';
import { esModules } from './packages/utils-dev/src/utils-dev/unit-test-utils';

// as of stencil 2.22.2, we need a test focused stencil config to enable compare-test-results scripts
export const config: Config | any = {
  testing: {
    transform: {
      '^.+\\.(ts|tsx|js|jsx|css)$': '@stencil/core/testing/jest-preprocessor'
    },
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`]
  }
};
