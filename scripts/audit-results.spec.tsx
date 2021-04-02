/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import combinedAuditResults from '../coverage/yarn-audit-report.json';

describe('<yarn-audit-results>', () => {
  it('audit results should match what we had before, and be clean', async () => {
    expect(combinedAuditResults).toMatchSnapshot();
  });
});
