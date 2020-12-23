/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { ParetoChart } from './pareto-chart';

describe('pareto-chart', () => {
  it('should build', () => {
    expect(new ParetoChart()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [ParetoChart],
        html: '<pareto-chart></pareto-chart>'
      });
    });
  });
});
