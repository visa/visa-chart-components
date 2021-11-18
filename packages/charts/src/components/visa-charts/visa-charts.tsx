/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { Component, h } from '@stencil/core';
import '@visa/alluvial-diagram';
import '@visa/bar-chart';
import '@visa/line-chart';
import '@visa/scatter-plot';
import '@visa/pie-chart';
import '@visa/stacked-bar-chart';
import '@visa/clustered-bar-chart';
import '@visa/circle-packing';
import '@visa/heat-map';
/* STARTS: comment this code for faster demo build / uncomment for full build */
import '@visa/parallel-plot';
import '@visa/dumbbell-plot';
import '@visa/world-map';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';
// import '@visa/bivariate-mapbox-map';
/* ENDS :comment this code for faster demo build */
@Component({
  tag: 'visa-charts'
})
export class VisaCharts {
  render() {
    return (
      <div>
        <alluvial-diagram />
        <bar-chart />
        <line-chart />
        <scatter-plot />
        <pie-chart />
        <stacked-bar-chart />
        <clustered-bar-chart />
        <circle-packing />
        <heat-map />
        <parallel-plot />
        <dumbbell-plot />
        <world-map />
        {/* <bivariate-mapbox-map /> */}
      </div>
    );
  }
}
