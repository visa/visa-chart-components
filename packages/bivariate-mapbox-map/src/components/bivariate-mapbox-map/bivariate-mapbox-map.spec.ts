/**
 * Copyright (c) 2020, 2022 Visa, Inc.
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

// currently we have a bug where the test script will hang and not close properly
// if all tests pass, until this is resolved, we force fail a test at the end of the script
// to ensure tests close out and
describe('fake-test-fail-exit', () => {
  it('force fail to get tests to close jest testing script when all pass', () => {
    expect(false).toBeTruthy();
  });
});
