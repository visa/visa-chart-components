/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { ParallelPlot } from './parallel-plot';

describe('parallel-plot', () => {
  it('should build', () => {
    expect(new ParallelPlot()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [ParallelPlot],
        html: '<parallel-plot></parallel-plot>'
      });
    });
  });
});
