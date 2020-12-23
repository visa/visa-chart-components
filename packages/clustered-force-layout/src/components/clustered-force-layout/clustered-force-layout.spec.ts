/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { render } from '@stencil/core/testing';
import { ClusteredForceLayout } from './clustered-force-layout';

describe('clustered-force-layout', () => {
  it('should build', () => {
    expect(new ClusteredForceLayout()).toBeTruthy();
  });

  describe('rendering', () => {
    beforeEach(async () => {
      await render({
        components: [ClusteredForceLayout],
        html: '<clustered-force-layout></clustered-force-layout>'
      });
    });
  });
});
