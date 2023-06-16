/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { ChartModel, ChartView, version } from './index';
import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';

export const chartWidgetPlugin = {
  id: '@visa/charts-python:plugin',
  requires: [IJupyterWidgetRegistry],
  activate: function(app, widgets) {
    widgets.registerWidget({
      name: '@visa/charts-python',
      version: version,
      exports: { ChartModel, ChartView }
    });
  },
  autoStart: true
};

export default chartWidgetPlugin;
