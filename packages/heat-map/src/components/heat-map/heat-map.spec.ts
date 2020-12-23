/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { HeatMap } from './heat-map';

describe('heat-map', () => {
  it('should build', () => {
    expect(new HeatMap()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [HeatMap],
        html: '<heat-map></heat-map>'
      });
    });
  });
});
