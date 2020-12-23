/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { GroupCharts } from './group-charts';

describe('group-charts', () => {
  it('should build', () => {
    expect(new GroupCharts()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [GroupCharts],
        html: '<group-charts></group-charts>'
      });
    });
  });
});
