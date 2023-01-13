/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import React, { useEffect, useState, useRef } from 'react';
import recipe_json from './data/recipe-data.json';

import {
  BarChart,
  ClusteredBarChart,
  StackedBarChart,
  LineChart,
  PieChart,
  ScatterPlot,
  HeatMap,
  CirclePacking,
  ParallelPlot,
  DumbbellPlot,
  WorldMap,
  AlluvialDiagram
} from './visa-charts';

let chartProps = {};

// since we are using the charts directly from @visa/charts we alread mounted them on DOM
const chartTags = {
  'alluvial-diagram': AlluvialDiagram,
  'bar-chart': BarChart,
  'circle-packing': CirclePacking,
  'clustered-bar-chart': ClusteredBarChart,
  'dumbbell-plot': DumbbellPlot,
  'heat-map': HeatMap,
  'line-chart': LineChart,
  'parallel-plot': ParallelPlot,
  'pie-chart': PieChart,
  'scatter-plot': ScatterPlot,
  'stacked-bar-chart': StackedBarChart,
  'world-map': WorldMap
};

function BuildPropsFromRecipeData(recipeData, chartType, recipeName) {
  return recipeData.filter(recipe =>
    recipe.chart === chartType && recipe.name === recipeName ? recipeName : 'Default'
  );
}

const DisplayChart = ({
  chartType,
  recipe,
  fullChart,
  storePropsCallback
  // onChange,
}) => {
  const [clickElement, setClickElement] = useState(recipe.clickHighlight || []);
  const [hoverElement, setHoverElement] = useState(recipe.hoverHighlight || '');
  const chartElement = useRef(null);

  const ChartComponent = chartTags[chartType];
  let innerProps;
  chartProps = BuildPropsFromRecipeData(recipe_json, chartType, recipe && recipe.name);
  const sparkAccessibility = Object.assign({}, recipe.accessibility, {
    hideDataTableButton: true,
    hideStrokes: true,
    hideTextures: ['line-chart', 'parallel-plot'].includes(chartType) ? false : true,
    elementsAreInterface: false,
    keyboardNavConfig: { disabled: true },
    disableValidation: true
  });

  // useEffect(() => {
  if (recipe && !fullChart) {
    const sparkChartProps = {
      subTitle: '',
      mainTitle: '',
      suppressEvents: true,
      centerTitle: null,
      centerSubTitle: null,
      height: 100,
      width: 175,
      dotRadius: 3,
      xAxis: {
        visible: false,
        gridVisible: recipe.xAxis ? recipe.xAxis.gridVisible : '',
        format: recipe.chart === 'heat-map' ? recipe.xAxis && recipe.xAxis.format : '',
        tickInterval: recipe.xAxis && recipe.xAxis.tickInterval ? recipe.xAxis.tickInterval : ''
      },
      yAxis: {
        visible: false,
        gridVisible: recipe.yAxis ? recipe.yAxis.gridVisible : '',
        format: recipe.chart === 'heat-map' ? recipe.yAxis && recipe.yAxis.format : '',
        tickInterval: recipe.yAxis && recipe.yAxis.tickInterval ? recipe.yAxis.tickInterval : ''
      },
      legend: {
        visible: false,
        type: recipe.chart === 'heat-map' ? 'default' : ''
      },
      annotations: [],
      differenceLabel: { visible: false },
      dataLabel: {
        // visible: recipe.chart === 'pie-chart' ? recipe.dataLabel.visible : false,
        visible: false,
        labelAccessor: '',
        placement: '',
        format: ''
        // labelAccessor: recipe.dataLabel.labelAccessor,
        // placement: recipe.dataLabel.placement,
        // format: recipe.dataLabel.format
      },
      strokeWidth: recipe.name === 'Dot Matrix' && 0,
      showLabelNote: false,
      showTooltip: false,
      showTotalValue: false,
      hideAxisPath: true,
      seriesLabel: { visible: false },
      barStyle:
        recipe.marker && recipe.marker.type === 'stroke'
          ? { width: 10, opacity: 0.5, colorRule: 'default' }
          : recipe.barStyle,
      marker:
        recipe.barStyle && recipe.barStyle.width > 2
          ? { ...recipe.marker, sizeFromBar: 1 }
          : recipe.marker && recipe.marker.type === 'arrow'
          ? { ...recipe.marker, sizeFromBar: 2 }
          : { ...recipe.marker, sizeFromBar: 4 },
      focusMarker:
        recipe.barStyle && recipe.barStyle.width > 2
          ? { ...recipe.focusMarker, sizeFromBar: 1 }
          : { ...recipe.focusMarker, sizeFromBar: 4 },
      referenceLines: [
        {
          label: '',
          labelPlacementHorizontal: '',
          labelPlacementVertical: '',
          value: recipe.referenceLines && recipe.referenceLines[0] ? recipe.referenceLines[0].value : null
        }
      ],
      quality: 'Low',
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      },
      padding: {
        left: 10,
        right: 10,
        top: 5,
        bottom: recipe.name === 'Dot Matrix' ? 40 : 5
      },
      nodeConfig: {
        fill: false,
        width: 4,
        padding: 4,
        alignment: 'left',
        compare: false
      },
      accessibility: sparkAccessibility
    };
    innerProps = { ...recipe, ...sparkChartProps };
  } else if (recipe && fullChart) {
    innerProps = { ...recipe, unitTest: true, accessibility: { ...sparkAccessibility, hideStrokes: false } };
  } else innerProps = { ...chartProps, width: 400, height: 250 };

  // we need to check if we have a date field in our data, if so we need to make it a date
  // for now we will force the data to have field named 'date' to enable date formatting
  if (innerProps.data && Object.keys(innerProps.data[0]).includes('date')) {
    innerProps.data.map(d => (d.date = new Date(d.date)));
  }

  // have to wrap the callback in a useEffect to keep it from firing every render
  useEffect(() => {
    if (storePropsCallback) storePropsCallback(innerProps);
  }, [chartType, recipe, fullChart]); // wrap in useEffect to keep from inifinte looping

  const onClickFunc = d => {
    const datum =
      d && d.detail && d.detail.data && d.detail.data.data && d.detail.data.data.data
        ? d.detail.data.data.data
        : d && d.detail.data.data
        ? d.detail.data.data
        : d && d.detail.data
        ? d.detail.data
        : {};
    const interactionKeys = recipe.interactionKeys
      ? recipe.interactionKeys
      : chartElement && chartElement.current && chartElement.current['interactionKeys']
      ? chartElement.current['interactionKeys']
      : chartElement && chartElement.current && chartElement.current['innerInteractionKeys']
      ? chartElement.current['innerInteractionKeys']
      : [];

    let index = -1;
    clickElement.forEach((el, i) => {
      let keyMatch = [];
      interactionKeys.forEach(k => {
        k == 'date'
          ? el[k].getTime() == datum[k].getTime()
            ? keyMatch.push(true)
            : keyMatch.push(false)
          : el[k] == datum[k]
          ? keyMatch.push(true)
          : keyMatch.push(false);
      });
      keyMatch.every(v => v === true) ? (index = i) : null;
    });

    const newClicks = [...clickElement];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(datum);
    }
    setClickElement(newClicks);
  };

  const onHoverFunc = d => {
    const datum =
      d && d.detail && d.detail.data && d.detail.data.data && d.detail.data.data.data
        ? d.detail.data.data.data
        : d && d.detail.data.data
        ? d.detail.data.data
        : d && d.detail.data
        ? d.detail.data
        : {};
    // console.log('hover event', d, datum);
    setHoverElement(datum);
  };

  const onMouseOut = () => {
    setHoverElement('');
  };
  // console.log('chartProps', innerProps, recipe, chartProps, ChartComponent, hoverElement, clickElement);

  // // ref={wc({}, { ...innerProps })}
  return (
    <div>
      <ChartComponent
        className={fullChart ? 'chart-created' : 'recipe-chart'}
        ref={chartElement}
        {...innerProps}
        onHoverEvent={onHoverFunc}
        onClickEvent={onClickFunc}
        onMouseOutEvent={onMouseOut}
        hoverHighlight={hoverElement}
        clickHighlight={clickElement}
      />
    </div>
  );
};

export default DisplayChart;
