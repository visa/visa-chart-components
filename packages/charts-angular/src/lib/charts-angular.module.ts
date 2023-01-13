/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { applyPolyfills, defineCustomElements } from '@visa/charts/dist/loader';

// temporary comment to bump charts with feature commit
import {
  AlluvialDiagram,
  CirclePacking,
  BarChart,
  ClusteredBarChart,
  DataTable as VisaChartsDataTable,
  DumbbellPlot,
  HeatMap,
  KeyboardInstructions,
  LineChart,
  ParallelPlot,
  PieChart,
  ScatterPlot,
  StackedBarChart,
  WorldMap
} from './directives/visa-charts';

const DECLARATIONS = [
  // proxies
  AlluvialDiagram,
  BarChart,
  CirclePacking,
  ClusteredBarChart,
  DumbbellPlot,
  HeatMap,
  KeyboardInstructions,
  LineChart,
  ParallelPlot,
  PieChart,
  ScatterPlot,
  StackedBarChart,
  VisaChartsDataTable,
  WorldMap
];

applyPolyfills().then(() => {
  defineCustomElements();
});

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [CommonModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VisaChartsModule {}
