/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { formatStats } from './formatStats';
import { symbolCircle, symbolCross, symbolSquare, symbolStar, symbolTriangle, symbolDiamond } from 'd3-shape';

export function formatDataLabel(d, labelAccessor, format, normalized?) {
  const modifier = normalized ? d.getSum() : 1;
  return format
    ? formatStats(d[labelAccessor] / modifier, format === 'normalized' ? '0[.][0]%' : format)
    : d[labelAccessor] / modifier;
}

export const placeDataLabels = ({
  root,
  xScale,
  yScale,
  ordinalAccessor,
  valueAccessor,
  placement,
  layout,
  labelOffset,
  radius,
  chartType,
  normalized
}: {
  root?: any;
  xScale?: any;
  yScale?: any;
  ordinalAccessor?: any;
  valueAccessor?: any;
  placement?: any;
  layout?: any;
  labelOffset?: any;
  radius?: any;
  chartType?: any;
  normalized?: any;
}) => {
  let xPlacement;
  let yPlacement;
  let offset;
  let offset2;
  let textAnchor;

  if (chartType === 'bar') {
    switch (placement) {
      case 'top':
        xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
        yPlacement = d => yScale(Math.max(0, d[valueAccessor]));
        offset = '-.3em';
        textAnchor = 'middle';
        break;
      case 'bottom':
        xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
        yPlacement = d => yScale(Math.min(0, d[valueAccessor])) - 2;
        offset = '-.2em';
        textAnchor = 'middle';
        break;
      case 'left':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
        xPlacement = d => xScale(Math.min(0, d[valueAccessor]));
        offset = '.2em';
        textAnchor = 'start';
        break;
      case 'right':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
        xPlacement = d => xScale(Math.max(0, d[valueAccessor])) + 2;
        offset = '.2em';
        textAnchor = 'start';
        break;
      case 'top-left':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(Math.min(0, d[valueAccessor]));
        offset = '.2em';
        offset2 = '-.2em';
        textAnchor = 'start';
        break;
      case 'top-right':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(Math.max(0, d[valueAccessor]));
        offset = '-3em';
        offset2 = '-.2em';
        textAnchor = 'start';
        break;
      case 'bottom-left':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth();
        xPlacement = d => xScale(Math.min(0, d[valueAccessor]));
        offset = '.2em';
        offset2 = '1em';
        textAnchor = 'start';
        break;
      case 'bottom-right':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth();
        xPlacement = d => xScale(Math.max(0, d[valueAccessor]));
        offset = '-3em';
        offset2 = '1em';
        textAnchor = 'start';
        break;
    }
  } else if (chartType === 'stacked') {
    const getMod = d => (normalized ? d.getSum() : 1);
    if (layout === 'vertical') {
      switch (placement) {
        case 'bottom':
          xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
          yPlacement = d => yScale(d.stackEnd / getMod(d));
          offset = '-.3em';
          textAnchor = 'middle';
          break;

        case 'top':
          xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
          yPlacement = d => yScale(d.stackStart / getMod(d));
          offset = '1em';
          textAnchor = 'middle';
          break;

        case 'middle':
          xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
          yPlacement = d => (yScale(d.stackStart / getMod(d)) + yScale(d.stackEnd / getMod(d))) / 2;
          offset = '.3em';
          textAnchor = 'middle';
          break;
      }
    } else {
      switch (placement) {
        case 'base':
          yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
          xPlacement = d => (d.stackEnd < 0 ? xScale(d.stackStart / getMod(d)) : xScale(d.stackEnd / getMod(d)));
          offset = d => (d.stackEnd < 0 ? '-.3em' : '.3em');
          textAnchor = d => (d.stackEnd < 0 ? 'end' : 'start');
          break;

        case 'end':
          yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
          xPlacement = d => (d.stackEnd < 0 ? xScale(d.stackEnd / getMod(d)) : xScale(d.stackStart / getMod(d)));
          offset = d => (d.stackEnd < 0 ? '.3em' : '-.3em');
          textAnchor = d => (d.stackEnd < 0 ? 'start' : 'end');
          break;

        case 'middle':
          yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
          xPlacement = d => (xScale(d.stackStart) + xScale(d.stackEnd)) / 2;
          offset = '0em';
          textAnchor = 'middle';
          break;
      }
    }
  } else if (chartType === 'line') {
    switch (placement) {
      case 'top':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]);
        offset2 = '-0.6em';
        textAnchor = 'middle';
        break;
      case 'bottom':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]) + 20;
        textAnchor = 'middle';
        break;
      case 'left':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(d[valueAccessor]);
        offset = '.2em';
        textAnchor = 'start';
        break;
      case 'right':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(d[valueAccessor]) + 4;
        offset = '.2em';
        textAnchor = 'start';
        break;
    }
  } else if (chartType === 'parallel') {
    switch (placement) {
      case 'bottom-right':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '0.3em';
        offset2 = '0.9em';
        textAnchor = 'start';
        break;
      case 'top-right':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '0.3em';
        offset2 = '-0.1em';
        textAnchor = 'start';
        break;
      case 'bottom-left':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '-0.3em';
        offset2 = '0.9em';
        textAnchor = 'end';
        break;
      case 'top-left':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '-0.3em';
        offset2 = '-0.1em';
        textAnchor = 'end';
        break;
    }
  } else if (chartType === 'dumbbell') {
    switch (placement) {
      case 'ends':
        xPlacement = d => (layout === 'vertical' ? xScale(d[ordinalAccessor]) : xScale(d[valueAccessor]) - d.offset);
        yPlacement = d => (layout === 'vertical' ? yScale(d[valueAccessor]) + d.offset : yScale(d[ordinalAccessor]));
        offset = d => {
          return layout === 'vertical' && d.offset >= 0
            ? '0.9em'
            : layout === 'vertical'
            ? '-0.3em'
            : d.offset >= 0
            ? '-0.3em'
            : '0.3em';
        };
        offset2 = layout === 'vertical' ? '0.0em' : '0.3em';
        textAnchor = d => {
          return layout === 'vertical' ? 'middle' : d.offset >= 0 ? 'end' : 'start';
        };
        break;
      case 'top':
        yPlacement = d => yScale(d[ordinalAccessor]) - Math.abs(d.offset);
        xPlacement = d => xScale(d[valueAccessor]);
        offset2 = '-0.3em'; // d => -Math.abs(d.offset);
        offset = '0.0em';
        textAnchor = 'middle';
        break;
      case 'bottom':
        yPlacement = d => yScale(d[ordinalAccessor]) + Math.abs(d.offset);
        xPlacement = d => xScale(d[valueAccessor]) + 4;
        offset2 = '0.9em'; // d => Math.abs(d.offset);
        offset = '0.0em';
        textAnchor = 'middle';
        break;
      case 'left':
        yPlacement = d => yScale(d[valueAccessor]);
        xPlacement = d => xScale(d[ordinalAccessor]) - 4 - Math.abs(d.offset);
        offset2 = '0.0em'; // d => -Math.abs(d.offset);
        offset = '0.3em';
        textAnchor = 'end';
        break;
      case 'right':
        yPlacement = d => yScale(d[valueAccessor]);
        xPlacement = d => xScale(d[ordinalAccessor]) + 4 + Math.abs(d.offset);
        offset2 = '0.0em'; // d => Math.abs(d.offset);
        offset = '0.3em';
        textAnchor = 'start';
        break;
    }
  } else if (chartType === 'pie') {
    switch (placement) {
      case 'inside':
        offset2 = '0.1em';
        textAnchor = 'middle';
        break;
      case 'outside':
        textAnchor = (d, i) => (d.endAngle < Math.PI || i === 0 ? 'start' : 'end');
        xPlacement = d => (radius + 5) * Math.sin((d.startAngle + d.endAngle) / 2);
        yPlacement = d => -(radius + 5) * Math.cos((d.startAngle + d.endAngle) / 2);
        offset = d => (d.endAngle < Math.PI ? -labelOffset : labelOffset);
        offset2 = d => (d.endAngle < Math.PI ? labelOffset : -labelOffset);
        break;
      case 'edge':
        xPlacement = d => (radius + 10) * Math.sin(d.endAngle);
        yPlacement = d => -(radius + 10) * Math.cos(d.endAngle);
        offset = d => (d.endAngle < Math.PI ? -labelOffset : labelOffset);
        offset2 = d => (d.endAngle < Math.PI ? labelOffset : -labelOffset);
        textAnchor = (d, i) => (d.endAngle < Math.PI || i === 0 ? 'start' : 'end');
        break;
      case 'note':
        textAnchor = (d, i) => (d.endAngle < Math.PI || i === 0 ? 'start' : 'end');
        xPlacement = d => (radius + 5) * Math.sin((d.startAngle + d.endAngle) / 2);
        yPlacement = d => -(radius + 5) * Math.cos((d.startAngle + d.endAngle) / 2);
        offset = d => (d.endAngle < Math.PI ? -labelOffset : labelOffset);
        offset2 = d => (d.endAngle < Math.PI ? labelOffset + 15 : -labelOffset + 15);
        break;
      case 'note_edge':
        xPlacement = d => (radius + 10) * Math.sin(d.endAngle);
        yPlacement = d => -(radius + 10) * Math.cos(d.endAngle);
        offset = d => (d.endAngle < Math.PI ? -labelOffset : labelOffset);
        offset2 = d => (d.endAngle < Math.PI ? labelOffset + 15 : -labelOffset + 15);
        textAnchor = (d, i) => (d.endAngle < Math.PI || i === 0 ? 'start' : 'end');
        break;
    }
  } else if (chartType === 'scatter') {
    switch (placement) {
      case 'top':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]) - labelOffset;
        offset2 = '-0.35em';
        textAnchor = 'middle';
        break;
      case 'bottom':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]) + labelOffset;
        offset2 = '0.9em';
        textAnchor = 'middle';
        break;
      case 'left':
        xPlacement = d => xScale(d[ordinalAccessor]) - labelOffset;
        yPlacement = d => yScale(d[valueAccessor]);
        offset = '-.4em';
        offset2 = '0.3em';
        textAnchor = 'end';
        break;
      case 'right':
        xPlacement = d => xScale(d[ordinalAccessor]) + labelOffset;
        yPlacement = d => yScale(d[valueAccessor]);
        offset = '.35em';
        offset2 = '0.3em';
        textAnchor = 'start';
        break;
    }
  } else if (chartType === 'heat-map') {
    xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
    yPlacement = d => yScale(d[valueAccessor]) + yScale.bandwidth() / 2;
    offset2 = '.5em';
    textAnchor = 'middle';
  } else if (chartType === 'world-map') {
    xPlacement = d => xScale([+d[ordinalAccessor], +d[valueAccessor]])[0];
    yPlacement = d => xScale([+d[ordinalAccessor], +d[valueAccessor]])[1];
  }

  root
    .attr('x', xPlacement)
    .attr('y', yPlacement)
    .attr(layout === 'vertical' ? 'dy' : 'dx', offset)
    .attr(layout === 'vertical' ? 'dx' : 'dy', offset2)
    .attr('text-anchor', textAnchor);
};

export function getDataSymbol(symbolFunc, symbolType) {
  const symbolMap = {
    cross: symbolCross,
    circle: symbolCircle,
    square: symbolSquare,
    star: symbolStar,
    triangle: symbolTriangle,
    diamond: symbolDiamond
  };

  return symbolMap[symbolType] ? symbolFunc.type(symbolMap[symbolType])() : symbolFunc.type(symbolCircle)();
}
