/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { Plugin } from 'vue';
// components
import { BarChart } from '@visa/charts/dist/components/bar-chart';
import { StackedBarChart } from '@visa/charts/dist/components/stacked-bar-chart';
import { ClusteredBarChart } from '@visa/charts/dist/components/clustered-bar-chart';
import { LineChart } from '@visa/charts/dist/components/line-chart';
import { PieChart } from '@visa/charts/dist/components/pie-chart';
import { ScatterPlot } from '@visa/charts/dist/components/scatter-plot';
import { HeatMap } from '@visa/charts/dist/components/heat-map';
import { CirclePacking } from '@visa/charts/dist/components/circle-packing';
import { ParallelPlot } from '@visa/charts/dist/components/parallel-plot';
import { DumbbellPlot } from '@visa/charts/dist/components/dumbbell-plot';
import { WorldMap } from '@visa/charts/dist/components/world-map';
import { AlluvialDiagram } from '@visa/charts/dist/components/alluvial-diagram';
import { DataTable } from '@visa/charts/dist/components/data-table';
import { KeyboardInstructions } from '@visa/charts/dist/components/keyboard-instructions';

export const ComponentLibrary: Plugin = {
  async install() {
    customElements.define('bar-chart', BarChart);
    customElements.define('clustered-bar-chart', ClusteredBarChart);
    customElements.define('stacked-bar-chart', StackedBarChart);
    customElements.define('line-chart', LineChart);
    customElements.define('pie-chart', PieChart);
    customElements.define('scatter-plot', ScatterPlot);
    customElements.define('heat-map', HeatMap);
    customElements.define('circle-packing', CirclePacking);
    customElements.define('parallel-plot', ParallelPlot);
    customElements.define('dumbbell-plot', DumbbellPlot);
    customElements.define('world-map', WorldMap);
    customElements.define('alluvial-diagram', AlluvialDiagram);
    customElements.define('keyboard-instructions', KeyboardInstructions);
    customElements.define('data-table', DataTable);
  }
};
