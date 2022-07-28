/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: '@visa/charts-python:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
    widgets.registerWidget({
      name: '@visa/charts-python',
      version: plugin.version,
      exports: plugin
    });
  },
  autoStart: true
};
