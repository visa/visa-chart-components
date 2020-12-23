/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { BivariateMapboxMap } from './bivariate-mapbox-map';

describe('bivariate-mapbox-map', () => {
  it('should build', () => {
    expect(new BivariateMapboxMap()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [BivariateMapboxMap],
        html: '<bivariate-mapbox-map></bivariate-mapbox-map>'
      });
    });
  });
});
