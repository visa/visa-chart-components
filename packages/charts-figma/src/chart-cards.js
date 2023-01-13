/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import React from 'react';
import AlluvialDiagramSVG from './assets/images/alluvial-diagram.svg';
import BarChartSVG from './assets/images/bar-chart.svg';
import CirclePackingSVG from './assets/images/circle-packing.svg';
import ClusteredBarChartSVG from './assets/images/clustered-bar-chart.svg';
import DumbbellPlotSVG from './assets/images/dumbbell-plot.svg';
import HeatMapSVG from './assets/images/heat-map.svg';
import LineChartSVG from './assets/images/line-chart.svg';
import ParallelPlotSVG from './assets/images/parallel-plot.svg';
import PieChartSVG from './assets/images/pie-chart.svg';
import ScatterPlotSVG from './assets/images/scatter-plot.svg';
import StackedBarChartSVG from './assets/images/stacked-bar-chart.svg';
import WorldMapSVG from './assets/images/world-map.svg';

const ChartCards = props => {
  const chartArray = [
    'alluvial-diagram',
    'bar-chart',
    'circle-packing',
    'clustered-bar-chart',
    // 'dumbbell-plot', // markers make this one a mess, removing for now
    'heat-map',
    'line-chart',
    'parallel-plot',
    'pie-chart',
    'scatter-plot',
    'stacked-bar-chart',
    'world-map'
  ];

  const chartSVGMap = {
    'alluvial-diagram': AlluvialDiagramSVG,
    'bar-chart': BarChartSVG,
    'circle-packing': CirclePackingSVG,
    'clustered-bar-chart': ClusteredBarChartSVG,
    'dumbbell-plot': DumbbellPlotSVG,
    'heat-map': HeatMapSVG,
    'line-chart': LineChartSVG,
    'parallel-plot': ParallelPlotSVG,
    'pie-chart': PieChartSVG,
    'scatter-plot': ScatterPlotSVG,
    'stacked-bar-chart': StackedBarChartSVG,
    'world-map': WorldMapSVG
  };

  const chartCallback = (e, chart) => {
    // console.log('chart has been clicked', chart, `/assets/images/${chart}.svg`, e.target);
    props.level1Callback(chart);
  };

  return (
    (chartArray && (
      <div className="row">
        {chartArray.map(chart => {
          const chartTitle = chart.replace(/-/g, ' ');
          return (
            <div className="col" key={chart}>
              <button className="gallery-card" onClick={e => chartCallback(e, chart)} type="button">
                <div>
                  <img key={`chart-image-${chart}`} alt={`image of a ${chart}`} src={chartSVGMap[chart]} />
                  <h3 className="card-title">{chartTitle}</h3>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    )) ||
    null
  );
};

export default ChartCards;
