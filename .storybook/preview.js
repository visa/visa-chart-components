/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { registerLocalization } from './utils';

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

setTimeout(() => {
  // register hu/HU localizaiton for use in front end
  registerLocalization();
}, 10);
