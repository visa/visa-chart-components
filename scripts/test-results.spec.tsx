/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import combinedTestResults from '../coverage/jest-test-report.json';

describe('<jest-test-report>', () => {
  it('test errors should match what we had before', async () => {
    expect(combinedTestResults).toMatchSnapshot();
  });
});
