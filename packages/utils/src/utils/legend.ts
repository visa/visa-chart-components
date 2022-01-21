/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { getTextWidth } from './textHelpers';
import { formatStats } from './formatStats';
import { setLegendAccess } from './accessibilityUtils';
import { symbols } from './symbols';
import {
  getAccessibleStrokes,
  getContrastingStroke,
  calculateRelativeLuminance,
  calculateLuminance,
  visaColorToHex
} from './colors';
import { createTextStrokeFilter } from './textures';
import { checkHovered, checkClicked, checkInteraction } from './interaction';
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
  hideStrokes,
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
  hide,
  hoverHighlight,
  clickHighlight,
  groupAccessor,
  interactionKeys,
  hoverStyle,
  clickStyle,
  hoverOpacity
}: {
  root?: any;
  uniqueID?: string;
  width?: any;
  height?: any;
  colorArr?: any;
  baseColorArr?: any;
  hideStrokes?: boolean;
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
  hoverHighlight?: any;
  clickHighlight?: any;
  groupAccessor?: string;
  interactionKeys?: any;
  hoverStyle?: any;
  clickStyle?: any;
  hoverOpacity?: number;
}) => {
  const totalWidth = width + padding.left + padding.right + 5;
  const leftOffset = padding.left + margin.left;
  const offsetLegend = type === 'scatter' || type === 'key' || type === 'line' || type === 'bar';
  const legendWidth = steps ? width / steps : 0;
  const legendHeight = 15;
  height = hide ? 0 : height + (offsetLegend ? 25 : 5);
  const opacity = hide ? 0 : 1;
  if (type === 'parallel') {
    type = 'line';
  }
  root.attr('viewBox', '0 0 ' + totalWidth + ' ' + height);
  let paddingWrapper = root.select('.legend-padding-wrapper');
  if (!root.select('.legend-padding-wrapper').size()) {
    paddingWrapper = root.append('g').attr('class', 'legend-padding-wrapper');
  }
  const symbolMod = !symbol ? 4 : 7;
  paddingWrapper.attr(
    'transform',
    `translate(${(offsetLegend ? leftOffset : 0) + symbolMod},${offsetLegend ? 24 : 4})`
  );
  const filter = createTextStrokeFilter({
    root: root.node(),
    id: `${uniqueID}-legend`,
    color: '#ffffff'
  });

  switch (type) {
    default:
      root
        .attr('opacity', opacity)
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('style', hide ? 'display: none;' : null)
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

          let context = colorGrid
            .enter()
            .append('rect')
            .attr('opacity', 0)
            .merge(colorGrid)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('x', 0)
            .attr('y', 0)
            .attr('fill', d);

          let exitContext = colorGrid.exit();

          const gridText = select(n[i])
            .selectAll('text')
            .data([d]);

          let textContext = gridText
            .enter()
            .append('text')
            .attr('opacity', 0)
            .merge(gridText)
            .attr('dx', labelPosition)
            .attr('dy', '2.5em')
            .text(gridLabel);

          let textExit = gridText.exit();

          if (duration) {
            context = context
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            exitContext = exitContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textContext = textContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textExit = textExit
              .transition()
              .duration(duration)
              .ease(easeCircleIn);
          }

          context.attr('opacity', opacity);

          exitContext.attr('opacity', 0).remove();

          textContext.attr('opacity', opacity);

          textExit.attr('opacity', 0).remove();
        });

      defaultLegend.exit().remove();
      break;

    case 'gradient':
      const gradientId = new Date().getTime();
      // draw legend as a gradient band
      root
        .attr('width', totalWidth)
        .attr('height', height)
        .attr('style', hide ? 'display: none;' : null)
        .attr('transform', `translate(0, 20)`)
        .attr('opacity', opacity);

      root.selectAll('.key').remove();
      root.selectAll('.default').remove();

      const textDiv = paddingWrapper.selectAll('text.gradient').data([0].concat(colorArr));

      let textContext = textDiv
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
        .text((d, i) =>
          i === 0
            ? formatStats(scale.invertExtent(colorArr[0])[0], format)
            : formatStats(scale.invertExtent(d)[1], format)
        );

      let textExit = textDiv.exit();

      if (duration) {
        textContext = textContext
          .transition()
          .duration(duration)
          .ease(easeCircleIn);

        textExit = textExit
          .transition()
          .duration(duration)
          .ease(easeCircleIn);
      }

      textContext.attr('opacity', (_, i) => (i === 0 || i === colorArr.length ? opacity : 0));

      textExit.attr('opacity', 0).remove();

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
        .attr('style', hide ? 'display: none;' : null);

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

          let context = keyDot
            .enter()
            .append('rect')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', d)
            .attr('width', 15)
            .attr('height', 15);

          let exitContext = keyDot.exit();

          const keyText = select(n[i])
            .selectAll('text')
            .data([keyLabel]);

          let textContext = keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .text(keyLabel);

          let textExit = keyText.exit();

          if (duration) {
            context = context
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            exitContext = exitContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textContext = textContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textExit = textExit
              .transition()
              .duration(duration)
              .ease(easeCircleIn);
          }

          context
            .attr('x', accumWidth)
            .attr('y', yPos)
            .attr('opacity', opacity);

          exitContext.attr('opacity', 0).remove();

          textContext
            .attr('x', accumWidth + 20)
            .attr('y', yPos)
            .attr('opacity', opacity);

          textExit.attr('opacity', 0).remove();
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
        .attr('style', hide ? 'display: none;' : null);

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

          let context = keyDot
            .enter()
            .append('line')
            .merge(keyDot)
            .style('stroke-width', secondary.includes(d.key) ? strokeWidth - 1 : strokeWidth)
            .style('stroke', colorArr[i])
            .style(
              'stroke-dasharray',
              secondary.includes(d.key) ? '2,2' : dashPatterns && i < dashPatterns.length ? dashPatterns[i] : ''
            )
            .attr('stroke-width', secondary.includes(d.key) ? strokeWidth - 1 : strokeWidth)
            .attr('stroke', colorArr[i])
            .attr(
              'stroke-dasharray',
              secondary.includes(d.key) ? '2,2' : dashPatterns && i < dashPatterns.length ? dashPatterns[i] : ''
            )
            .style('opacity', opacity);

          let exitContext = keyDot.exit();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d.key]);

          let textContext = keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .text(keyLabel);

          let textExit = keyText.exit();

          if (duration) {
            context = context
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            exitContext = exitContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textContext = textContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textExit = textExit
              .transition()
              .duration(duration)
              .ease(easeCircleIn);
          }

          context
            .attr('x1', accumWidthLine)
            .attr(
              'x2',
              accumWidthLine +
                (secondary.includes(d.key) ? 30 : dashPatterns && i < dashPatterns.length ? dashIdealSize[i] : 30)
            )
            .attr('y1', yPosLine + 8)
            .attr('y2', yPosLine + 8);

          exitContext.attr('opacity', 0).remove();

          textContext
            .attr(
              'x',
              accumWidthLine +
                5 +
                (secondary.includes(d.key) ? 30 : dashPatterns && i < dashPatterns.length ? dashIdealSize[i] : 30)
            )
            .attr('y', yPosLine)
            .attr('opacity', opacity);

          textExit.attr('opacity', 0).remove();
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
        .attr('style', hide ? 'display: none;' : null);

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
          let context = keyDot
            .enter()
            .append('rect')
            .attr('class', 'bar-rect')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', scale ? scale(d[labelKey]) : colorArr[i] || colorArr(d[labelKey]))
            .attr('width', 20)
            .attr('height', 20);

          let exitContext = keyDot.exit();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d[labelKey]]);

          let textContext = keyText
            .enter()
            .append('text')
            .attr('class', 'bar-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 16)
            .text(keyLabel);

          let textExit = keyText.exit();

          if (duration) {
            context = context
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            exitContext = exitContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textContext = textContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textExit = textExit
              .transition()
              .duration(duration)
              .ease(easeCircleIn);
          }

          context
            .attr('x', accumWidthBar)
            .attr('y', yPosBar)
            .attr('opacity', opacity);

          exitContext.attr('opacity', 0).remove();

          textContext
            .attr('x', accumWidthBar + 25)
            .attr('y', yPosBar)
            .attr('opacity', opacity);

          textExit.attr('opacity', 0).remove();
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
        .attr('style', hide ? 'display: none;' : null);

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

          let context = keyDot
            .enter()
            .append('path')
            .attr('opacity', 0)
            .merge(keyDot)
            .attr('fill', colorArr[i]);

          let exitContext = keyDot.exit();

          const keyText = select(n[i])
            .selectAll('text')
            .data([d]);

          let textContext = keyText
            .enter()
            .append('text')
            .attr('class', 'key-text')
            .attr('opacity', 0)
            .merge(keyText)
            .attr('dx', '.2em')
            .attr('dy', 13)
            .text(keyLabel);

          let textExit = keyText.exit();

          if (duration) {
            context = context
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            exitContext = exitContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textContext = textContext
              .transition()
              .duration(duration)
              .ease(easeCircleIn);

            textExit = textExit
              .transition()
              .duration(duration)
              .ease(easeCircleIn);
          }

          context
            .attr('transform', `translate(` + (+accumWidthScatter + 4) + `,` + (+yPosScatter + 8) + `)  scale(4)`)
            .attr('d', symbols[symbol[i] || symbol[0]].general)
            .attr('opacity', opacity);

          exitContext.attr('opacity', 0).remove();

          textContext
            .attr('x', accumWidthScatter + 15)
            .attr('y', yPosScatter)
            .attr('opacity', opacity);

          textExit.attr('opacity', 0).remove();
        });

      currentScatterLegend.exit().remove();

      break;
  }
  if (baseColorArr && !hideStrokes) {
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
        const contrastFriendlyColor = contrast < 3 ? getContrastingStroke(baseColor) : baseColor;
        select(n[i].firstElementChild).attr('data-base-color', baseColor);
        select(n[i].firstElementChild).attr('stroke', contrastFriendlyColor);
        select(n[i].firstElementChild).attr('stroke-width', 1);
      }
    });
  } else if (type !== 'line') {
    root
      .selectAll('.legend')
      .selectAll('*')
      .attr('stroke', 'none')
      .attr('stroke-width', 0);
  }
  root.selectAll('text').attr('filter', filter);
  root.attr('data-type', type || 'default');
  root.selectAll('.legend *:first-child').each((_, i, n) => {
    const me = select(n[i]);
    if (me.attr('fill')) {
      me.attr('data-fill', me.attr('fill'));
    }
    if (me.attr('stroke')) {
      me.attr('data-stroke', me.attr('stroke'));
    }
    if (me.attr('stroke-width')) {
      me.attr('data-stroke-width', me.attr('stroke-width'));
    }
  });
  setLegendInteractionState({
    root,
    uniqueID,
    interactionKeys,
    groupAccessor,
    hoverHighlight,
    clickHighlight,
    hoverStyle,
    clickStyle,
    hoverOpacity
  });
  setLegendAccess(root.node(), uniqueID);
};

export const setLegendInteractionState = ({
  root,
  uniqueID,
  interactionKeys,
  groupAccessor,
  hoverHighlight,
  clickHighlight,
  hoverStyle,
  clickStyle,
  hoverOpacity
}: {
  root?: any;
  uniqueID?: string;
  interactionKeys?: any;
  groupAccessor?: string;
  hoverHighlight?: any;
  clickHighlight?: any;
  hoverStyle?: any;
  clickStyle?: any;
  hoverOpacity?: number;
}) => {
  const type = root.attr('data-type');
  if (type !== 'gradient') {
    root.selectAll('.legend').each((d, i, n) => {
      const child = select(n[i].firstElementChild);
      const text = select(n[i]).select('text');
      const datum = !d.values ? d : d.values[0];
      const validLegendInteraction =
        groupAccessor && interactionKeys.length === 1 && interactionKeys[0] === groupAccessor;
      const hovered = checkHovered(datum, hoverHighlight, interactionKeys) && validLegendInteraction;
      const clicked = checkClicked(datum, clickHighlight, interactionKeys) && validLegendInteraction;
      const fill = child.attr('data-fill');
      const stroke = child.attr('data-stroke');
      let resultingStroke = '';
      if (fill) {
        const clickColor = clickStyle ? visaColorToHex(clickStyle.color) : '';
        const hoverColor = hoverStyle ? visaColorToHex(hoverStyle.color) : '';
        const resultingFill = clicked ? clickColor || fill : hovered && hoverColor ? hoverColor : fill;
        child.attr('fill', resultingFill);
        child.style('fill', resultingFill);
        const hasStroke = child.attr('stroke');
        const baseColor = child.attr('data-base-color');
        const resultingClick =
          type !== 'scatter'
            ? [getContrastingStroke(clickColor || baseColor || fill)]
            : getAccessibleStrokes(clickColor || baseColor || fill);
        const resultingHover =
          type !== 'scatter'
            ? [getContrastingStroke(hoverColor || baseColor || fill)]
            : getAccessibleStrokes(hoverColor || baseColor || fill);
        resultingStroke = clicked
          ? resultingClick[1] || resultingClick[0]
          : hovered
          ? resultingHover[1] || resultingHover[0]
          : hasStroke
          ? stroke
          : getContrastingStroke(fill);
      } else if (stroke) {
        const clickColor =
          clickStyle && clickStyle.color ? getAccessibleStrokes(visaColorToHex(clickStyle.color)) : [stroke];
        const hoverColor =
          hoverStyle && hoverStyle.color ? getAccessibleStrokes(visaColorToHex(hoverStyle.color)) : [stroke];
        resultingStroke = clicked ? clickColor[1] || clickColor[0] : hovered ? hoverColor[1] || hoverColor[0] : stroke;
      }
      child.attr('stroke', resultingStroke);
      child.style('stroke', resultingStroke);
      const baseStrokeWidth = parseFloat(child.attr('data-stroke-width')) || (stroke === 'none' ? 0 : 1);
      const strokeWidthDenominator = baseStrokeWidth < 1 ? baseStrokeWidth : 1;
      const strokeWidthMultiplier = type !== 'line' ? 1 : 2;
      const scale = type !== 'scatter' ? 1 : 4;
      child.attr(
        'stroke-width',
        (clicked
          ? clickStyle && clickStyle.strokeWidth && strokeWidthDenominator
            ? (parseFloat(clickStyle.strokeWidth + '') * strokeWidthMultiplier) / strokeWidthDenominator
            : baseStrokeWidth
          : hovered && hoverStyle && hoverStyle.strokeWidth && strokeWidthDenominator
          ? (parseFloat(hoverStyle.strokeWidth + '') * strokeWidthMultiplier) / strokeWidthDenominator
          : baseStrokeWidth) / scale
      );
      child.style('stroke-width', child.attr('stroke-width'));
      const disableDash = type === 'scatter' || type === 'line';
      child.attr(
        'stroke-dasharray',
        hovered && !clicked && !disableDash ? '8 6' : type !== 'line' ? 'none' : child.attr('stroke-dasharray')
      );
      child.style('stroke-dasharray', child.attr('stroke-dasharray'));
      const opacity = checkInteraction(d, 1, hoverOpacity, hoverHighlight, clickHighlight || [], interactionKeys);
      child.attr('opacity', opacity);
      text.attr('opacity', !opacity ? 0 : 1);
    });
  }
};
