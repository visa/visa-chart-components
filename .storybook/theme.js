/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { create } from '@storybook/theming';
import { version } from '../packages/charts/package.json';

import Utils from '../packages/utils/dist/visa-charts-utils.cjs';

const { visaColors } = Utils;

export default create({
  base: 'light',
  brandTitle: `Visa Chart Components @${version}`,
  brandUrl: 'https://github.com/visa/visa-chart-components',
  fontBase: '"Open Sans", sans-serif',
  colorPrimary: visaColors.categorical_blue,
  colorSecondary: visaColors.categorical_blue
});
