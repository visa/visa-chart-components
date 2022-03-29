/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// import { defineCustomElements } from '../packages/charts/dist/esm/loader';

// defineCustomElements();

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewMode: 'story',
  controls: {
    expanded: true,
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};
