/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { getTextWidth } from './textHelpers';
import { formatStats } from './formatStats';
import { setLegendAccess } from './applyAccessibility';
import { symbols } from './symbols';
import { getContrastingStroke, calculateRelativeLuminance, calculateLuminance } from './colors';
import { select } from 'd3-selection';
import { easeCircleIn } from 'd3-ease';
import 'd3-transition';

export const drawLegend = ({
  root,
  uniqueID,
  width,
  height,
  colorArr,
  baseColorArr,
  dashPatterns,
  scale,
  steps,
  margin,
  padding,
  duration,
  type,
  secondary,
  fontSize,
  data,
  labelKey,
  label,
  symbol,
  format,
  hide
}: {
  root?: any;
  uniqueID?: string;
  width?: any;
  height?: any;
  colorArr?: any;
  baseColorArr?: any;
  dashPatterns?: any;
  scale?: any;
  steps?: any;
  margin?: any;
  padding?: any;
  duration?: any;
  type?: any;
  secondary?: any;
  fontSize?: any;
  data?: any;
  labelKey?: any;
  label?: any;
  symbol?: any;
  format?: any;
  hide?: any;
}) => {
  const totalWidth = width + padding.left + padding.right - 2;
  const leftOffset = padding.left + margin.left;
  const legendWidth = steps ? width / steps : 0;
  const legendHeight = 15;
  height = hide ? 0 : height - 2;
  const opacity = hide ? 0 : 1;
  if (type === 'parallel') {
    type = 'line';
  }
  root.attr('viewBox', '0 0 ' + totalWidth + ' ' + height);
  let paddingWrapper = root.select('.legend-padding-wrapper');
  if (!root.select('.legend-padding-wrapper').size()) {
    paddingWrapper = root
      .append('g')
      .attr('class', 'legend-padding-wrapper')
      .attr('transform', !symbol ? 'translate(1,1)' : 'translate(3,1)');
  }

  switch (type) {
    default:
      root
        .attr('opacity', opacity)
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('style', hide ? 'display: none;' : 'padding-left: 0px; padding-top: 0px;')
        .attr('transform', `translate(0, 0)`);

      const defaultLegend = paddingWrapper.selectAll('.legend.default').data([0].concat(colorArr));

      root.selectAll('.key').remove();
      root.selectAll('.gradient').remove();

      defaultLegend
        .enter()
        .append('g')
        .attr('class', 'legend default')
        .merge(defaultLegend)
        .attr('transform', (_, i) =>
          i === 0 ? `translate(${leftOffset}, 20)` : `translate(${(i - 1) * legendWidth + leftOffset}, 20)`
        )
        .each((d, i, n) => {
          const gridLabel =
            i === 0
              ? formatStats(scale.invertExtent(colorArr[0])[0], format)
              : formatStats(scale.invertExtent(d)[1], format);
          const labelPosition = i === 0 ? 0 : legendWidth;

          const colorGrid = select(n[i])
            .selectAll('rect')
            .data([d]);
          colorGrid
            .enter()
            .append('rect')
            .attr('opacity', 0)
            .merge(colorGrid)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', d)
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', opacity);

          colorGrid
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();

          const gridText = select(n[i])
            .selectAll('text')
            .data([d]);

          gridText
            .enter()
            .append('text')
            .attr('opacity', 0)
            .merge(gridText)
            .attr('dx', labelPosition)
            .attr('dy', '2.5em')
            .transition('update')
            .duration(duration)
            .ease(easeCircleIn)
            .text(gridLabel)
            .attr('opacity', opacity);

          gridText
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();
        });

      defaultLegend.exit().remove();
      break;

    case 'gradient':
      const gradientId = new Date().getTime();
      // draw legend as a gradient band
      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('style', hide ? 'display: none;' : 'padding-left: 0px; padding-top: 0px;')
        .attr('transform', `translate(0, 20)`)
        .attr('opacity', opacity);

      root.selectAll('.key').remove();
      root.selectAll('.default').remove();

      const textDiv = paddingWrapper.selectAll('text.gradient').data([0].concat(colorArr));

      textDiv
        .enter()
        .append('text')
        .attr('class', 'legend-text gradient')
        .merge(textDiv)
        .attr('transform', (_, i) =>
          i === 0 ? `translate(${leftOffset}, 0)` : `translate(${(i - 1) * legendWidth + leftOffset}, 0)`
        )
        .attr('opacity', 0)
        .attr('dx', (_, i) => (i === 0 ? 0 : legendWidth))
        .attr('dy', '2.5em')
        .transition('update')
        .duration(duration)
        .ease(easeCircleIn)
        .text((d, i) =>
          i === 0
            ? formatStats(scale.invertExtent(colorArr[0])[0], format)
            : formatStats(scale.invertExtent(d)[1], format)
        )
        .attr('opacity', (_, i) => (i === 0 || i === colorArr.length ? opacity : 0));

      textDiv
        .exit()
        .transition()
        .duration(duration)
        .ease(easeCircleIn)
        .attr('opacity', 0)
        .remove();

      if (!paddingWrapper.selectAll('.legend').empty()) {
        paddingWrapper.selectAll('.legend').remove();
      }

      const gradientDiv = paddingWrapper.append('g').attr('class', 'legend gradient');

      gradientDiv
        .append('defs')
        .append('linearGradient')
        .attr('id', 'mainGradient-' + gradientId)
        .selectAll('stop')
        .data(colorArr)
        .enter()
        .append('stop')
        .attr('offset', (_, i) => (100 / colorArr.length) * (i + 1) + '%')
        .attr('stop-color', d => d);

      gradientDiv
        .append('rect')
        .attr('class', 'legend-gradient')
        .attr('x', leftOffset)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', legendHeight)
        .attr('style', 'fill: url(#mainGradient-' + gradientId + ')');

      break;

    case 'key':
      let accumWidth = 0;
      let yPos = 0;

      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('opacity', opacity)
        .attr('style', hide ? 'display: none;' : 'padding-left: ' + leftOffset + 'px; padding-top: 20px;')
        .attr('transform', `translate(0, 0)`);

      const currentKeyLegend = paddingWrapper.selectAll('.legend.key').data(colorArr);

      root.selectAll('.default').remove();
      root.selectAll('.gradient').remove();

      currentKeyLegend
        .enter()
        .append('g')
        .attr('class', 'legend key')
        .merge(currentKeyLegend)
        .each((d, i, n) => {
          const prevLabel =
            i === 0
              ? ''
              : label
              ? label[i - 1]
              : formatStats(scale.invertExtent(colorArr[i - 1])[0], format) +
                '-' +
                formatStats(scale.invertExtent(colorArr[i - 1])[1], format);

          accumWidth = i === 0 ? 0 : accumWidth + getTextWidth(prevLabel, fontSize) + 40;
          if (accumWidth + getTextWidth(prevLabel, fontSize) > width) {
            //wrap legends if the length is larger than chart width
            accumWidth = 0;
            yPos += fontSize + 10; // line height
          }
          const keyLabel = label
            ? label[i]
            : formatStats(scale.invertExtent(d)[0], format) + '-' + formatStats(scale.invertExtent(d)[1], format);

          const keyDot = select(n[i])
            .selectAll('rect')
            .data([d]);

          keyDot
            .enter()
            .append('rect')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', d)
            .attr('width', 15)
            .attr('height', 15)
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('x', accumWidth)
            .attr('y', yPos)
            .attr('opacity', opacity);

          keyDot
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();

          const keyText = select(n[i])
            .selectAll('text')
            .data([keyLabel]);

          keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .transition('update')
            .duration(duration)
            .ease(easeCircleIn)
            .text(keyLabel)
            .attr('x', accumWidth + 20)
            .attr('y', yPos)
            .attr('opacity', opacity);

          keyText
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();
        });

      currentKeyLegend.exit().remove();

      break;

    case 'line':
      let accumWidthLine = 0;
      let yPosLine = 0;
      let strokeWidth = 3;
      const dashIdealSize = [28, 28, 26, 28, 26];

      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('opacity', 1)
        .attr('style', hide ? 'display: none;' : 'padding-left: ' + leftOffset + 'px; padding-top: 20px;');

      const currentLineLegend = paddingWrapper.selectAll('.legend').data(data);

      currentLineLegend
        .enter()
        .append('g')
        .attr('class', 'legend')
        .merge(currentLineLegend)
        .each((d, i, n) => {
          const prevLabel = i === 0 ? '' : label ? label[i - 1] : data[i - 1].key;
          const keyLabel = label ? label[i] : d.key;

          accumWidthLine = i === 0 ? 0 : accumWidthLine + getTextWidth(prevLabel, fontSize) + 60;
          if (accumWidthLine + getTextWidth(keyLabel, fontSize) > width) {
            //wrap legends if the length is larger than chart width
            accumWidthLine = 0;
            yPosLine += fontSize + 10; // line height
          }
          const keyDot = select(n[i])
            .selectAll('line')
            .data([d.key]);
          keyDot
            .enter()
            .append('line')
            .merge(keyDot)
            .style('stroke-width', secondary.includes(d.key) ? strokeWidth - 1 : strokeWidth)
            .style('stroke', colorArr[i])
            .style(
              'stroke-dasharray',
              secondary.includes(d.key) ? '2,2' : dashPatterns && i < dashPatterns.length ? dashPatterns[i] : ''
            )
            .style('opacity', opacity)
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('x1', accumWidthLine)
            .attr(
              'x2',
              accumWidthLine +
                (secondary.includes(d.key) ? 30 : dashPatterns && i < dashPatterns.length ? dashIdealSize[i] : 30)
            )
            .attr('y1', yPosLine + 8)
            .attr('y2', yPosLine + 8);

          keyDot
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d.key]);

          keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .transition('update')
            .duration(duration)
            .ease(easeCircleIn)
            .text(keyLabel)
            .attr(
              'x',
              accumWidthLine +
                5 +
                (secondary.includes(d.key) ? 30 : dashPatterns && i < dashPatterns.length ? dashIdealSize[i] : 30)
            )
            .attr('y', yPosLine)
            .attr('opacity', opacity);

          keyText
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();
        });

      currentLineLegend.exit().remove();

      break;

    case 'bar':
      let accumWidthBar = 0;
      let yPosBar = 0;

      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('opacity', opacity)
        .attr('style', hide ? 'display: none;' : 'padding-left: ' + leftOffset + 'px; padding-top: 20px;');

      const currentBarLegend = paddingWrapper.selectAll('.legend.bar').data(data);

      currentBarLegend
        .enter()
        .append('g')
        .attr('class', 'legend bar')
        .merge(currentBarLegend)
        .each((d, i, n) => {
          const prevLabel =
            i === 0
              ? ''
              : label && label[i - 1]
              ? format
                ? formatStats(label[i - 1], format)
                : label[i - 1]
              : format
              ? formatStats(data[i - 1][labelKey], format)
              : data[i - 1][labelKey];
          const keyLabel =
            label && label[i]
              ? format
                ? formatStats(label[i], format)
                : label[i]
              : format
              ? formatStats(d[labelKey], format)
              : d[labelKey];

          accumWidthBar = i === 0 ? 0 : accumWidthBar + getTextWidth(prevLabel, fontSize) + 45;
          if (accumWidthBar + getTextWidth(keyLabel, fontSize) > width) {
            //wrap legends if the length is larger than chart width
            accumWidthBar = 0;
            yPosBar += fontSize + 10; // line height
          }

          const keyDot = select(n[i])
            .selectAll('rect')
            .data([d[labelKey]]);
          keyDot
            .enter()
            .append('rect')
            .attr('class', 'bar-rect')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', scale ? scale(d[labelKey]) : colorArr[i] || colorArr(d[labelKey]))
            .attr('width', 20)
            .attr('height', 20)
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('x', accumWidthBar)
            .attr('y', yPosBar)
            .attr('opacity', opacity);

          keyDot
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d[labelKey]]);

          keyText
            .enter()
            .append('text')
            .attr('class', 'bar-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 16)
            .transition('update')
            .duration(duration)
            .ease(easeCircleIn)
            .text(keyLabel)
            .attr('x', accumWidthBar + 25)
            .attr('y', yPosBar)
            .attr('opacity', opacity);

          keyText
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();
        });

      currentBarLegend.exit().remove();

      break;

    case 'scatter':
      let accumWidthScatter = 0;
      let yPosScatter = 0;

      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('opacity', opacity)
        .attr('style', hide ? 'display: none;' : 'padding-left: ' + leftOffset + 'px; padding-top: 20px;');

      const currentScatterLegend = paddingWrapper.selectAll('.legend').data(data);

      currentScatterLegend
        .enter()
        .append('g')
        .attr('class', 'legend')
        .merge(currentScatterLegend)
        .each((d, i, n) => {
          const prevLabel = i === 0 ? '' : label ? label[i - 1] : data[i - 1].key;
          const keyLabel = label ? label[i] : d.key;

          accumWidthScatter = i === 0 ? 0 : accumWidthScatter + getTextWidth(prevLabel, fontSize) + 50;
          if (accumWidthScatter + getTextWidth(keyLabel, fontSize) > width) {
            //wrap legends if the length is larger than chart width
            accumWidthScatter = 0;
            yPosScatter += fontSize + 10; // line height
          }
          const keyDot = select(n[i])
            .selectAll('path')
            .data([d]);

          keyDot
            .enter()
            .append('path')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', colorArr[i])
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('transform', `translate(` + (+accumWidthScatter + 4) + `,` + (+yPosScatter + 8) + `)  scale(4)`)
            .attr('d', symbols[symbol[i] || symbol[0]].general)
            .attr('opacity', opacity);

          keyDot
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d]);

          keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .transition('update')
            .duration(duration)
            .ease(easeCircleIn)
            .text(keyLabel)
            .attr('x', accumWidthScatter + 15)
            .attr('y', yPosScatter)
            .attr('opacity', opacity);

          keyText
            .exit()
            .transition()
            .duration(duration)
            .ease(easeCircleIn)
            .attr('opacity', 0)
            .remove();
        });

      currentScatterLegend.exit().remove();

      break;
  }
  if (baseColorArr) {
    const isArray = Array.isArray(baseColorArr);
    root.selectAll('.legend').each((d, i, n) => {
      const baseColor =
        isArray && baseColorArr.length === 1
          ? baseColorArr[0]
          : isArray
          ? baseColorArr[i]
          : baseColorArr[i] || baseColorArr(d[labelKey]);
      if (baseColor) {
        const contrast = calculateRelativeLuminance(calculateLuminance(baseColor), 1);
        select(n[i].firstElementChild).attr('stroke', contrast < 3 ? getContrastingStroke(baseColor) : baseColor);
        select(n[i].firstElementChild).attr('stroke-width', !symbol ? 1 : 0.25);
      }
    });
  } else {
    root
      .selectAll('.legend')
      .selectAll('*')
      .attr('stroke', null)
      .attr('stroke-width', null);
  }
  setLegendAccess(root.node(), uniqueID);
};
