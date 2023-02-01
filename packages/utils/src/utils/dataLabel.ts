/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { formatStats } from './formatStats';
import { select } from 'd3-selection';
import { scaleSqrt } from 'd3-scale';
import { symbolCircle, symbolCross, symbolSquare, symbolStar, symbolTriangle, symbolDiamond } from 'd3-shape';
import { resolveLabelCollision } from './collisionDetection';

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
  sizeScale,
  ordinalAccessor,
  valueAccessor,
  groupAccessor,
  sizeAccessor,
  shapeArea,
  placement,
  layout,
  labelOffset,
  radius,
  chartType,
  normalized,
  avoidCollision
}: {
  root?: any;
  xScale?: any;
  yScale?: any;
  sizeScale?: any;
  ordinalAccessor?: any;
  valueAccessor?: any;
  groupAccessor?: any;
  sizeAccessor?: any;
  shapeArea?: any;
  placement?: any;
  layout?: any;
  labelOffset?: any;
  radius?: any;
  chartType?: any;
  normalized?: any;
  avoidCollision?: {
    runOccupancyBitmap: boolean;
    bitmaps: any;
    labelSelection: any;
    avoidMarks: any;
    validPositions: string[];
    offsets: number[];
    accessors: string[];
    size: [number, number];
    boundsScope?: string;
    hideOnly?: boolean;
    removeOnly?: boolean;
    suppressMarkDraw?: boolean;
  };
}) => {
  let xPlacement;
  let yPlacement;
  let offset;
  let offset2;
  let textAnchor;

  // console.log('placing data labels', root.size(), avoidCollision, placement);

  if (chartType === 'bar') {
    switch (placement) {
      case 'auto':
        if (layout === 'vertical') {
          xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
          yPlacement = d => yScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
          offset2 = '0.25em';
          textAnchor = 'middle';
        } else if (layout === 'horizontal') {
          yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2;
          xPlacement = d => xScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
          offset2 = '0.25em';
          textAnchor = 'middle';
        }
        break;
      case 'top':
        xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
        yPlacement = d => yScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
        offset = '-.3em';
        textAnchor = 'middle';
        break;
      case 'bottom':
        xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
        yPlacement = d => yScale(Math.min(0, d[valueAccessor] * (-labelOffset || 1)));
        offset = '-.3em';
        textAnchor = 'middle';
        break;
      case 'left':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2;
        xPlacement = d => xScale(Math.min(0, d[valueAccessor] * (-labelOffset || 1)));
        offset = '.2em';
        offset2 = '.3em';
        textAnchor = 'start';
        break;
      case 'right':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2;
        xPlacement = d => xScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
        offset = '.3em';
        offset2 = '.3em';
        textAnchor = 'start';
        break;
      case 'top-left':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(Math.min(0, d[valueAccessor] * (-labelOffset || 1)));
        offset = '.2em';
        offset2 = '-.2em';
        textAnchor = 'start';
        break;
      case 'top-right':
        yPlacement = d => yScale(d[ordinalAccessor]);
        xPlacement = d => xScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
        offset = '-3em';
        offset2 = '-.2em';
        textAnchor = 'start';
        break;
      case 'bottom-left':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth();
        xPlacement = d => xScale(Math.min(0, d[valueAccessor] * (-labelOffset || 1)));
        offset = '.2em';
        offset2 = '1em';
        textAnchor = 'start';
        break;
      case 'bottom-right':
        yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth();
        xPlacement = d => xScale(Math.max(0, d[valueAccessor] * (labelOffset || 1)));
        offset = '-3em';
        offset2 = '1em';
        textAnchor = 'start';
        break;
    }
  } else if (chartType === 'stacked') {
    const getMod = d => (normalized ? d.getSum() : 1);
    if (layout === 'vertical') {
      switch (placement) {
        case 'auto':
          xPlacement = d => xScale(d[ordinalAccessor]) + xScale.bandwidth() / 2;
          yPlacement = d => (yScale(d.stackStart / getMod(d)) + yScale(d.stackEnd / getMod(d))) / 2;
          offset2 = '0.25em';
          textAnchor = 'middle';
          break;
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
        case 'auto':
          yPlacement = d => yScale(d[ordinalAccessor]) + yScale.bandwidth() / 2 + 4;
          xPlacement = d => (xScale(d.stackStart) + xScale(d.stackEnd)) / 2;
          offset = '0em';
          textAnchor = 'middle';
          break;
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
      case 'auto':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]);
        offset2 = '-0.6em';
        textAnchor = 'middle';
        break;
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
      case 'auto':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '0em';
        offset2 = '0em';
        textAnchor = 'middle';
        break;
      case 'bottom-right':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '0.45em';
        offset2 = '1.1em';
        textAnchor = 'start';
        break;
      case 'top-right':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '0.45em';
        offset2 = '-0.3em';
        textAnchor = 'start';
        break;
      case 'bottom-left':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '-0.45em';
        offset2 = '1.1em';
        textAnchor = 'end';
        break;
      case 'top-left':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d);
        offset = '-0.45em';
        offset2 = '-0.3em';
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
      case 'auto': // copy of ends for auto collision
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
    let offsetScale = scaleSqrt()
      .domain([sizeScale.domain()[0], sizeScale.domain()[1]])
      .range([1, 4]);
    let shape = d => shapeArea[groupAccessor ? d[groupAccessor] : '']['shape'];
    let shapeOffset = d =>
      sizeScale(d[sizeAccessor] * shapeArea[groupAccessor ? d[groupAccessor] : '']['toCircle']) || labelOffset;
    switch (placement) {
      case 'auto':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]);
        offset2 = '0.25em';
        textAnchor = 'middle';
        break;
      case 'middle':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]);
        offset2 = '0.25em';
        textAnchor = 'middle';
        break;
      case 'top':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]) - shapeOffset(d);
        offset2 = d =>
          ['diamond', 'triangle', 'star'].includes(shape(d)) && sizeAccessor
            ? `${-1 * (0.35 + 0.35 * offsetScale(d[sizeAccessor]))}em`
            : '-0.35em';

        textAnchor = 'middle';
        break;
      case 'bottom':
        xPlacement = d => xScale(d[ordinalAccessor]);
        yPlacement = d => yScale(d[valueAccessor]) + shapeOffset(d);
        offset2 = d =>
          shape(d) === 'diamond' && sizeAccessor
            ? `${0.75 + 0.5 * offsetScale(d[sizeAccessor])}em`
            : shape(d) === 'triangle' && sizeAccessor
            ? `${1.1 - 0.2 * offsetScale(d[sizeAccessor])}em`
            : '1.1em';
        textAnchor = 'middle';
        break;
      case 'left':
        xPlacement = d => xScale(d[ordinalAccessor]) - shapeOffset(d);
        yPlacement = d => yScale(d[valueAccessor]);
        offset = d => (shape(d) === 'diamond' && sizeAccessor ? '-.2em' : '-.4em');
        offset2 = '0.3em';
        textAnchor = 'end';
        break;
      case 'right':
        xPlacement = d => xScale(d[ordinalAccessor]) + shapeOffset(d);
        yPlacement = d => yScale(d[valueAccessor]);
        offset = d => (shape(d) === 'diamond' && sizeAccessor ? '.125em' : '.35em');
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

  // if we receive bitmap and auto placement we run, with heat-map as the only exception
  const autoPlacementIndicator = avoidCollision && avoidCollision.runOccupancyBitmap && placement === 'auto';
  const hideNoPlaceIndicator = avoidCollision && avoidCollision.hideOnly && !autoPlacementIndicator;
  if (chartType !== 'heat-map' && autoPlacementIndicator && !hideNoPlaceIndicator) {
    const bitmaps = resolveLabelCollision({
      bitmaps: avoidCollision.bitmaps,
      labelSelection: avoidCollision.labelSelection, // this should be root everytime basically...
      avoidMarks: avoidCollision.avoidMarks,
      validPositions: avoidCollision.validPositions,
      offsets: avoidCollision.offsets,
      accessors: avoidCollision.accessors,
      size: avoidCollision.size,
      boundsScope: avoidCollision.boundsScope,
      hideOnly: hideNoPlaceIndicator, // should be false always
      removeOnly: avoidCollision.removeOnly,
      suppressMarkDraw: avoidCollision.suppressMarkDraw
    });

    // now that the collision check is done we apply original placement to anything hidden (not placed) by it
    // this is needed because the marks will otherwise be placed at [0, 0], this util is expected to place them
    // checking for data-label-hidden !== false will capture anything that didn't go through collision and/or
    // was hidden by it, though we need to ignore this if we are in the setLabelOpacity interaction updates
    // thus we use the class temporarily added to each label to handle that
    // update during label interaction updates, we are excluding hidden labels that we moved from this now as well
    root
      .filter((_, i, n) => select(n[i]).attr('data-label-moved') !== 'true' && !select(n[i]).classed('collision-added'))
      .attr('x', xPlacement)
      .attr('y', yPlacement)
      .attr(layout === 'vertical' ? 'dy' : 'dx', offset)
      .attr(layout === 'vertical' ? 'dx' : 'dy', offset2)
      .attr('text-anchor', textAnchor);

    return bitmaps;
  } else if (chartType !== 'heat-map' && hideNoPlaceIndicator) {
    root.each((_, i, n) => {
      // doing an each.select will make sure we jump the transition passed in
      // in our mark item bounds we need to pass the result of original dataLabel util
      select(n[i])
        .attr('data-x', xPlacement)
        .attr('data-use-dx', true)
        .attr('dx', layout === 'vertical' ? offset2 : offset)
        .attr('data-y', yPlacement)
        .attr('data-use-dy', true)
        .attr('dy', layout === 'vertical' ? offset : offset2)
        .attr('text-anchor', textAnchor);
    });

    // next we draw the bitmap with only the marks
    let bitmaps;
    if (!avoidCollision.suppressMarkDraw) {
      bitmaps = resolveLabelCollision({
        bitmaps: avoidCollision.bitmaps,
        labelSelection: select('.empty-stuff-vcc-do-not-use'), // this should be root everytime basically...
        avoidMarks: avoidCollision.avoidMarks,
        validPositions: ['middle'],
        offsets: [1],
        accessors: avoidCollision.accessors,
        size: avoidCollision.size
      });
    }

    // next we try to place labels based on the util placed positions
    bitmaps = resolveLabelCollision({
      bitmaps: bitmaps || avoidCollision.bitmaps,
      labelSelection: root,
      avoidMarks: [],
      validPositions: ['middle'],
      offsets: [1],
      accessors: avoidCollision.accessors,
      size: avoidCollision.size,
      hideOnly: hideNoPlaceIndicator, // should be true always
      removeOnly: avoidCollision.removeOnly,
      suppressMarkDraw: avoidCollision.suppressMarkDraw
    });

    // hideOnly is passed, we need to place everything as we usually would
    root
      .attr('x', xPlacement)
      .attr('y', yPlacement)
      .attr(layout === 'vertical' ? 'dy' : 'dx', offset)
      .attr(layout === 'vertical' ? 'dx' : 'dy', offset2)
      .attr('text-anchor', textAnchor);

    return bitmaps;
  } else {
    // NOTE: heatmap has shortcut collision detection already for labels
    // (the accessibility.showSmallLabels prop handles this automatically and more efficiently due to the algorithmic concerns)
    root
      .attr('x', xPlacement)
      .attr('y', yPlacement)
      .attr(layout === 'vertical' ? 'dy' : 'dx', offset)
      .attr(layout === 'vertical' ? 'dx' : 'dy', offset2)
      .attr('text-anchor', textAnchor);
    return null;
  }
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
