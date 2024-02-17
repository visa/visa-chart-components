/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select } from 'd3-selection';
import { setTooltipAccess, hideTooltipListener } from './accessibilityUtils';
import { formatStats } from './formatStats';
import { capitalized } from './calculation';
import { formatDataLabel } from './dataLabel';
import { formatDate } from './formatDate';
import { transition } from 'd3-transition';

const buildTooltipContent = ({
  data,
  tooltipLabel,
  dataKeyNames,
  xAxis,
  yAxis,
  dataLabel,
  layout,
  ordinalAccessor,
  valueAccessor,
  xAccessor, // equivalent to joinNameAccessor / markerNameAccessor in map and sourceAccessor in alluvial
  yAccessor, // equivalent to joinAccessor / markerAccessor in map and targetAccessor in alluvial
  groupAccessor, // equivalent to seriesAccessor in line, dumbbell, parallel
  sizeConfig, // size for scatter plot tooltip
  diffLabelDetails,
  normalized,
  chartType
}: {
  data?: any;
  tooltipLabel?: any;
  dataKeyNames?: any;
  xAxis?: any;
  yAxis?: any;
  dataLabel?: any;
  layout?: any;
  ordinalAccessor?: any;
  valueAccessor?: any;
  xAccessor?: any;
  yAccessor?: any;
  groupAccessor?: any;
  sizeConfig?: any;
  diffLabelDetails?: any;
  normalized?: any;
  chartType?: any;
}) => {
  // user assigned tooltipLabel
  if (tooltipLabel && tooltipLabel.labelAccessor.length > 0) {
    let labelStr = '';
    tooltipLabel.labelAccessor.map((k, i) => {
      const title = // if we have tooltip label use it, if we have key map use it next
        tooltipLabel.labelTitle && tooltipLabel.labelTitle[i] !== ''
          ? tooltipLabel.labelTitle[i] + ': '
          : dataKeyNames && dataKeyNames[k]
          ? dataKeyNames[k] + ': '
          : '';
      labelStr += `${title}<b>${
        tooltipLabel.format && tooltipLabel.format[i]
          ? data[k] instanceof Date
            ? formatDate({
                date: data[k],
                format: tooltipLabel.format[i],
                offsetTimezone: true
              })
            : normalized && tooltipLabel.format[i] === 'normalized' // only for stacked-bar value
            ? formatDataLabel(data, k, dataLabel.format, k === valueAccessor)
            : !isNaN(parseFloat(data[k]))
            ? formatStats(data[k], tooltipLabel.format[i])
            : data[k]
          : data[k]
      } </b><br/>`;
    });
    labelStr.replace(',', '');
    return labelStr;
  } else {
    // default tooltip
    // make keymap the first check, then use axis labels, then data keys directly
    let defaultLabel = '';
    const firstTitle = xAxis && yAxis ? xAccessor || ordinalAccessor : ordinalAccessor;
    const secondTitle = xAxis && yAxis ? yAccessor || valueAccessor : valueAccessor;
    const thirdTitle = sizeConfig ? sizeConfig.sizeAccessor : '';
    const firstTitleMapped =
      dataKeyNames && dataKeyNames[firstTitle]
        ? dataKeyNames[firstTitle]
        : xAxis && yAxis
        ? layout === 'horizontal'
          ? yAxis.label
          : xAxis.label
        : firstTitle;
    const secondTitleMapped =
      dataKeyNames && dataKeyNames[secondTitle]
        ? dataKeyNames[secondTitle]
        : xAxis && yAxis
        ? layout === 'horizontal'
          ? xAxis.label
          : yAxis.label
        : secondTitle;
    const thirdTitleMapped = dataKeyNames && dataKeyNames[thirdTitle] ? dataKeyNames[thirdTitle] : thirdTitle;
    const percentageTitleMapped =
      dataKeyNames && dataKeyNames[`${secondTitle}%`] ? dataKeyNames[`${secondTitle}%`] : undefined;

    // bar, pie
    if (chartType === 'bar') {
      defaultLabel = `
      <b>${groupAccessor && data[groupAccessor] ? data[groupAccessor] + '<br/>' : ''} </b>
      ${capitalized(firstTitleMapped) + ': <b>' + data[ordinalAccessor]} </b><br/> 
        ${capitalized(secondTitleMapped) + ':'}
        <b>${formatStats(data[valueAccessor], dataLabel.format)}</b>`;
    }
    // if we have normalized then we output percent and value
    else if (chartType === 'pie') {
      defaultLabel = `
        ${capitalized(firstTitleMapped) + ': <b>' + data[ordinalAccessor]} </b><br/> 
        ${
          normalized
            ? percentageTitleMapped
              ? capitalized(percentageTitleMapped) +
                ': <b>' +
                formatDataLabel(data, valueAccessor, '0[.][0]%', normalized) +
                '</b><br/>'
              : capitalized(secondTitleMapped) +
                ' (%): <b>' +
                formatDataLabel(data, valueAccessor, '0[.][0]%', normalized) +
                '</b><br/>'
            : ''
        }
        ${capitalized(secondTitleMapped) + ': '}
        <b>${formatStats(data[valueAccessor], dataLabel.format === 'normalized' ? '0[.][0]a' : dataLabel.format)}</b>
      `;
    }
    // scatter-plot
    else if (chartType === 'scatter') {
      defaultLabel = `
        <b>${groupAccessor && data[groupAccessor] ? data[groupAccessor] + '<br/>' : ''} </b>
        ${capitalized(firstTitleMapped) + ':'} 
        <b>${formatStats(data[xAccessor], xAxis.format || '')} </b><br/>
        ${capitalized(secondTitleMapped) + ':'} 
        <b>${formatStats(data[yAccessor], yAxis.format || '')}</b>
        ${sizeConfig && sizeConfig.sizeAccessor ? '<br/>' + capitalized(thirdTitleMapped) + ':' : ''} 
        ${
          sizeConfig && sizeConfig.sizeAccessor
            ? '<b>' + formatStats(data[sizeConfig.sizeAccessor], sizeConfig.format || dataLabel.format || '') + '</b>'
            : ''
        }`;
    }
    // line, parallel
    else if (chartType === 'line' || chartType === 'parallel') {
      defaultLabel = `
        <b>${groupAccessor && data[groupAccessor] ? data[groupAccessor] + '<br/>' : ''}</b>
        ${capitalized(firstTitleMapped) + ':'} 
        <b>${
          data[ordinalAccessor] instanceof Date
            ? formatDate({
                date: data[ordinalAccessor],
                format: xAxis.format,
                offsetTimezone: true
              })
            : data[ordinalAccessor]
        } </b><br/>
        ${capitalized(secondTitleMapped) + ':'} 
        <b>${formatStats(data[valueAccessor], dataLabel.format || '')}</b>`;
    }
    // stacked-bar, clustered-bar
    else if (chartType === 'stacked' || chartType === 'clustered') {
      defaultLabel = `
        <b>${data[groupAccessor] + '<br/>'}</b>
        ${capitalized(firstTitleMapped) + ':'} 
        <b>${data[ordinalAccessor]} </b><br/> 
        ${
          normalized
            ? percentageTitleMapped
              ? capitalized(percentageTitleMapped) +
                ': <b>' +
                formatDataLabel(data, valueAccessor, '0[.][0]%', normalized) +
                '</b><br/>'
              : capitalized(secondTitleMapped) +
                ' (%): <b>' +
                formatDataLabel(data, valueAccessor, '0[.][0]%', normalized) +
                '</b><br/>'
            : ''
        }
        ${capitalized(secondTitleMapped) + ': '}
        <b>${formatStats(data[valueAccessor], dataLabel.format === 'normalized' ? '0[.][0]a' : dataLabel.format)}</b>
      `;
    }
    // heat-map
    else if (chartType === 'heat-map') {
      defaultLabel = `
        ${capitalized(firstTitleMapped) + ':'} 
        <b>${
          data[xAccessor] instanceof Date
            ? formatDate({
                date: data[xAccessor],
                format: xAxis.format,
                offsetTimezone: true
              })
            : data[xAccessor]
        } </b><br/>
        ${capitalized(secondTitleMapped) + ':'} 
        <b>${
          data[yAccessor] instanceof Date
            ? formatDate({
                date: data[yAccessor],
                format: yAxis.format,
                offsetTimezone: true
              })
            : data[yAccessor]
        } </b><br/>
        ${capitalized(dataKeyNames && dataKeyNames[valueAccessor] ? dataKeyNames[valueAccessor] : valueAccessor) + ':'}
        <b>${formatStats(data[valueAccessor], dataLabel.format || '')}</b>`;
    }
    // circle-packing
    else if (chartType === 'circle-packing') {
      defaultLabel = `
        <b>${capitalized(data[ordinalAccessor])} </b><br/>
        ${capitalized(dataKeyNames && dataKeyNames[groupAccessor] ? dataKeyNames[groupAccessor] : groupAccessor) +
          ': <b>' +
          data[groupAccessor]} </b><br/>
        ${capitalized(dataKeyNames && dataKeyNames[valueAccessor] ? dataKeyNames[valueAccessor] : valueAccessor) + ':'}
        <b>${formatStats(data[valueAccessor], dataLabel.format || '')}</b>`;
    }
    // world-map
    else if (chartType === 'world-map') {
      defaultLabel = `
        <b>${groupAccessor && data[groupAccessor] ? data[groupAccessor] + '<br/>' : ''} </b>
        <b>${data[xAccessor]} (${data[yAccessor]}) </b><br/>
          ${dataKeyNames && dataKeyNames[valueAccessor] ? dataKeyNames[valueAccessor] : valueAccessor}: 
          <b>${formatStats(data[valueAccessor], dataLabel.format || '')}</b>`;
    }
    // dumbbell
    else if (chartType === 'dumbbell') {
      if (data && data.key && data.values) {
        defaultLabel =
          `<b>
          ${
            data.values[0][ordinalAccessor] instanceof Date
              ? formatDate({
                  date: data.values[0][ordinalAccessor],
                  format: xAxis.format,
                  offsetTimezone: true
                })
              : data.values[0][ordinalAccessor]
          } </b><br/>` +
          'Difference: ' +
          `<b>${
            dataLabel.format
              ? formatStats(data[diffLabelDetails.calculation], dataLabel.format)
              : data[diffLabelDetails.calculation]
          } <br/></b>` +
          data.values[0][groupAccessor] +
          ': ' +
          `<b>${
            dataLabel.format
              ? formatStats(data.values[0][valueAccessor], dataLabel.format)
              : data.values[0][valueAccessor]
          } </b><br/>` +
          data.values[1][groupAccessor] +
          ': ' +
          `<b>${
            dataLabel.format
              ? formatStats(data.values[1][valueAccessor], dataLabel.format)
              : data.values[1][valueAccessor]
          }</b>
        `;
      } else {
        defaultLabel =
          `<b>
        ${
          data[ordinalAccessor] instanceof Date
            ? formatDate({
                date: data[ordinalAccessor],
                format: xAxis.format,
                offsetTimezone: true
              })
            : data[ordinalAccessor]
        } </b><br/>` +
          data[groupAccessor] +
          ': ' +
          `<b>${dataLabel.format ? formatStats(data[valueAccessor], dataLabel.format) : data[valueAccessor]}</b>
        `;
      }
    }
    // alluvial-diagram
    else if (chartType === 'alluvial-diagram') {
      defaultLabel = `
      <b>${groupAccessor && data[groupAccessor] ? data[groupAccessor] + '<br/>' : ''} </b>
      <b>${capitalized(data[xAccessor])}</b> → <b>${capitalized(data[yAccessor])} </b><br/>
      ${capitalized(dataKeyNames && dataKeyNames[valueAccessor] ? dataKeyNames[valueAccessor] : valueAccessor) + ':'}
      <b>${
        dataLabel && dataLabel.format ? formatStats(data[valueAccessor], dataLabel.format) : data[valueAccessor]
      }</b>`;
    }

    return defaultLabel;
  }
};

export const overrideTitleTooltip = (uniqueID, toRemove) => {
  const paddingIdBegin = 'visa-viz-padding-container-g-';
  const paddingG = select(`#${paddingIdBegin}${uniqueID}`);
  if (toRemove) {
    if (paddingG.select('title').size() === 0) {
      paddingG.append('title').text('');
    }
  } else {
    paddingG.select('title').remove();
  }
};

export const initTooltipStyle = root => {
  root
    .style('position', 'absolute')
    .style('padding', '0.5rem')
    .style('opacity', 0)
    .style('background-color', '#ffffff')
    .style('font-size', '14px')
    .style('font-weight', '400')
    .style('color', '#222222')
    .style('border', '1px solid #565656')
    .style('border-radius', '3px')
    .style('pointer-events', 'none')
    .style('min-width', '80px')
    .style('max-width', '300px')
    .style('z-index', 10);

  root.append('p').style('margin', 0);
};

export const drawTooltip = ({
  root,
  data,
  event,
  isToShow,
  tooltipLabel,
  dataKeyNames,
  xAxis,
  yAxis,
  dataLabel,
  layout,
  ordinalAccessor,
  valueAccessor,
  xAccessor, // equivalent to joinNameAccessor / markerNameAccessor in map and sourceAccessor in alluvial
  yAccessor, // equivalent to joinAccessor / markerAccessor in map and targetAccessor in alluvial
  groupAccessor, // equivalent to seriesAccessor in line, dumbbell, parallel,
  sizeConfig, // size for scatter plot tooltip
  diffLabelDetails,
  normalized,
  chartType
}: {
  root?: any;
  data?: any;
  event?: any;
  isToShow?: any;
  tooltipLabel?: any;
  dataKeyNames?: any;
  xAxis?: any;
  yAxis?: any;
  dataLabel?: any;
  layout?: any;
  ordinalAccessor?: any;
  valueAccessor?: any;
  xAccessor?: any;
  yAccessor?: any;
  groupAccessor?: any;
  sizeConfig?: any;
  diffLabelDetails?: any;
  normalized?: any;
  chartType?: any;
}) => {
  const toShow = () => {
    const positions = [event.pageX, event.pageY];
    const tooltipContent = buildTooltipContent({
      data,
      tooltipLabel,
      dataKeyNames,
      xAxis,
      yAxis,
      dataLabel,
      layout,
      ordinalAccessor,
      valueAccessor,
      xAccessor, // equivalent to joinNameAccessor / markerNameAccessor in map and sourceAccessor in alluvial
      yAccessor, // equivalent to joinAccessor / markerAccessor in map and targetAccessor in alluvial
      groupAccessor, // equivalent to seriesAccessor in line, dumbbell, parallel
      sizeConfig, // size for scatter plot tooltip
      diffLabelDetails,
      normalized,
      chartType
    });

    // get bounds of parent (e.g., placement of chart container)
    const parentBounds = root.node().parentElement.getBoundingClientRect();

    // place tooltip on top left temporary to populate and not have wrap
    root.style('left', '0px').style('top', '0px');

    // populate tooltip so we can get its bounds as well
    root.select('p').html(tooltipContent);

    // now we get bounds for height/width/top/left after populating content
    const bounds = root.node().getBoundingClientRect();

    // if the page has been scrolled we need to account for that
    const adjLeft = (document.body.scrollLeft || 0) + (document.documentElement.scrollLeft || 0);
    const adjLeftFlip = parentBounds.width / 2 - (positions[0] - bounds.left - adjLeft) < 0 ? bounds.width : 0;
    const adjTop = (document.body.scrollTop || 0) + (document.documentElement.scrollTop || 0);

    // place tooltip and then fade in
    // left = mouse position - adjust left for parent container location (bounds.left) - adjust for scroll - adjust to left if on right half of graph
    // right = mouse position - adjust up for parent container location (bounds.right) - adjust for height of tooltip - adjust for scroll
    // console.log('checking tooltip', positions, bounds, adjLeft, adjLeftFlip, adjTop); // for debugging of placement and width/height
    root
      .style('left', `${positions[0] - bounds.left - adjLeft - adjLeftFlip}px`)
      .style('top', `${positions[1] - bounds.top - bounds.height - adjTop}px`)
      .transition(transition().duration(200))
      .style('opacity', 1);
  };

  const toHide = () => {
    root.transition(transition().duration(500)).style('opacity', 0);
  };

  if (root) {
    isToShow ? toShow() : toHide();
    setTooltipAccess(root.node());
    hideTooltipListener(isToShow);
  }
};
