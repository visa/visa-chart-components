/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { easeCircleIn } from 'd3-ease';
import { visaColors } from './colors';

// this function will output the correct label alignment based on props provided
// we need to handle
// top-left, top-middle, top-right
// middle-left, middle-middle, middle-right
// bottom-left, bottom-middle, bottom-right

// check layout, if we have it use it, otherwise check axis for ref line, otherwise default it
const getLayout = (d, layout) =>
  layout ? layout : d && d.axis ? (d.axis === 'x' ? 'horizontal' : 'vertical') : 'vertical';

// if we have labelPlacementHorizontal , use it, otherwise default it
const labelPlacementHorizontalValidPlacements = ['left', 'middle', 'right'];
const resolveLabelPlacementHorizontal = (d, layout) =>
  d.labelPlacementHorizontal && labelPlacementHorizontalValidPlacements.includes(d.labelPlacementHorizontal)
    ? d.labelPlacementHorizontal
    : getLayout(d, layout) === 'horizontal'
    ? 'middle'
    : 'right';

// if we have labelPlacementVertical, use it, otherwise default it
const labelPlacementVerticalValidPlacements = ['top', 'middle', 'bottom'];
const resolveLabelPlacementVertical = (d, layout) =>
  d.labelPlacementVertical &&
  d.labelPlacementVertical &&
  labelPlacementVerticalValidPlacements.includes(d.labelPlacementVertical)
    ? d.labelPlacementVertical
    : getLayout(d, layout) === 'horizontal'
    ? 'top'
    : 'middle';

const referenceLabelAligner = (d, layout, groupName, innerPaddedHeight, innerPaddedWidth) => {
  // all unique values from original code
  // const xValues = [0, innerPaddedWidth, x(value)];
  // const yValues = [0, innerPaddedWidth, y(value)];
  // const dxValues = ['-0.5em', '0em', '0.5em'];
  // const dyValues = ['-0.5em', '0.3em', '1em'];

  // no description in propsDefaultValues since calculated values needed
  const defaultPlacement = {
    horizontal: {
      textAnchor: 'middle',
      x: 0,
      y: 0,
      dx: '0em',
      dy: '-0.5em'
    },
    vertical: {
      textAnchor: 'start',
      x: innerPaddedWidth,
      y: 0,
      dx: '0.5em',
      dy: '0.0em'
    }
  };
  const textAnchorPlacement = {
    horizontal: {
      'left-top': 'end',
      'middle-top': 'middle',
      'right-top': 'start',
      'left-bottom': 'end',
      'middle-bottom': 'middle',
      'right-bottom': 'start'
    },
    vertical: {
      'left-top': 'start',
      'left-middle': 'end',
      'left-bottom': 'start',
      'right-top': 'end',
      'right-middle': 'start',
      'right-bottom': 'end'
    }
  };
  const xydxdyPlacement = {
    horizontal: {
      'left-top': { x: 0, y: 0, dx: '-0.5em', dy: '1em' },
      'middle-top': { x: 0, y: 0, dx: '0em', dy: '-0.5em' },
      'right-top': { x: 0, y: 0, dx: '0.5em', dy: '1em' },
      'left-bottom': { x: 0, y: innerPaddedHeight, dx: '-0.5em', dy: '-0.5em' },
      'middle-bottom': { x: 0, y: innerPaddedHeight, dx: '0em', dy: '1em' },
      'right-bottom': { x: 0, y: innerPaddedHeight, dx: '0.5em', dy: '-0.5em' }
    },
    vertical: {
      'left-top': { x: 0, y: 0, dx: '0.5em', dy: '-0.5em' },
      'left-middle': { x: 0, y: 0, dx: '-0.5em', dy: '0.3em' },
      'left-bottom': { x: 0, y: 0, dx: '0.5em', dy: '1em' },
      'right-top': { x: innerPaddedWidth, y: 0, dx: '-0.5em', dy: '-0.5em' },
      'right-middle': { x: innerPaddedWidth, y: 0, dx: '0.5em', dy: '0.3em' },
      'right-bottom': { x: innerPaddedWidth, y: 0, dx: '-0.5em', dy: '1em' }
    }
  };

  const refLabelPlacementObject = {
    textAnchor: textAnchorPlacement[`${layout}`][
      `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
    ]
      ? textAnchorPlacement[`${layout}`][
          `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
        ]
      : defaultPlacement[layout].textAnchor,
    x: xydxdyPlacement[`${layout}`][
      `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
    ]
      ? xydxdyPlacement[`${layout}`][
          `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
        ].x
      : defaultPlacement[layout].x,
    y: xydxdyPlacement[`${layout}`][
      `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
    ]
      ? xydxdyPlacement[`${layout}`][
          `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
        ].y
      : defaultPlacement[layout].y,
    dx: xydxdyPlacement[`${layout}`][
      `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
    ]
      ? xydxdyPlacement[`${layout}`][
          `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
        ].dx
      : defaultPlacement[layout].dx,
    dy: xydxdyPlacement[`${layout}`][
      `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
    ]
      ? xydxdyPlacement[`${layout}`][
          `${resolveLabelPlacementHorizontal(d, layout)}-${resolveLabelPlacementVertical(d, layout)}`
        ].dy
      : defaultPlacement[layout].dy
  };
  return refLabelPlacementObject;
};

export const setReferenceLine = ({
  groupName,
  root,
  referenceLines,
  duration,
  innerPaddedWidth,
  innerPaddedHeight,
  referenceStyle,
  layout,
  x,
  y,
  unitTest
}: {
  groupName?: any;
  root?: any;
  referenceLines?: any;
  duration?: number;
  innerPaddedWidth?: number;
  innerPaddedHeight?: number;
  referenceStyle?: any;
  layout?: string;
  x?: any;
  y?: any;
  unitTest?: boolean;
}) => {
  // we will use this mapping to set classes dynamically across reference lines and components
  const classNamePrefix = {
    bar: 'bar',
    stack: 'stacked-bar',
    cluster: 'clustered-bar',
    line: 'line',
    dumbbell: 'dumbbell',
    scatter: 'scatter'
    // pie chart is handled within the pie-chart component
  };

  // enter reference line group
  const currentReferences = root.selectAll('g').data(referenceLines, d => d.label);
  const enterReferences = currentReferences
    .enter()
    .append('g')
    .attr('class', `${classNamePrefix[groupName]}-reference`)
    .attr('data-testid', unitTest ? 'reference-g' : null)
    .attr('opacity', 1);

  // based on the layout set the placement of the reference line g with transform
  enterReferences.attr('transform', d =>
    getLayout(d, layout) === 'vertical' ? 'translate(0,' + y(d.value) + ')' : 'translate(' + x(d.value) + ',0)'
  );

  // enter reference lines
  const enterLines = enterReferences.append('line');
  enterLines
    .attr('class', `${classNamePrefix[groupName]}-reference-line`)
    .attr('data-testid', unitTest ? 'reference-line' : null)
    .attr('opacity', 0)
    .attr('x1', 0)
    .attr('y1', d => (getLayout(d, layout) === 'horizontal' ? innerPaddedHeight : 0))
    .attr('x2', d => (getLayout(d, layout) === 'horizontal' ? 0 : innerPaddedWidth))
    .attr('y2', 0);

  // enter reference line labels
  const enterLabels = enterReferences.append('text');
  enterLabels
    .attr('class', `${classNamePrefix[groupName]}-reference-line-label`)
    .attr('data-testid', unitTest ? 'reference-line-label' : null)
    .attr('opacity', 0)
    .attr(
      'text-anchor',
      d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).textAnchor
    )
    .attr('x', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).x)
    .attr('y', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).y)
    .attr('dx', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).dx)
    .attr('dy', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).dy);

  // merge references for data join and update
  const mergeReferences = currentReferences.merge(enterReferences);
  // animate updates on merged (data joined) reference lines
  mergeReferences
    .transition('merge')
    .ease(easeCircleIn)
    .duration(duration)
    .attr('transform', d =>
      getLayout(d, layout) === 'vertical' ? 'translate(0,' + y(d.value) + ')' : 'translate(' + x(d.value) + ',0)'
    );

  // now we update lines within our reference Gs
  const mergeLines = mergeReferences
    .selectAll(`.${classNamePrefix[groupName]}-reference-line`)
    .data(d => [d])
    .transition('merge')
    .ease(easeCircleIn)
    .duration(duration)
    .attr('x1', 0)
    .attr('y1', d => (getLayout(d, layout) === 'horizontal' ? innerPaddedHeight : 0))
    .attr('x2', d => (getLayout(d, layout) === 'horizontal' ? 0 : innerPaddedWidth))
    .attr('y2', 0);

  // and now we do labels within our reference Gs
  const mergeLabels = mergeReferences
    .selectAll(`.${classNamePrefix[groupName]}-reference-line-label`)
    .data(d => [d])
    .transition('merge')
    .ease(easeCircleIn)
    .duration(duration)
    .text(d => d.label)
    .attr(
      'text-anchor',
      d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).textAnchor
    )
    .attr('x', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).x)
    .attr('y', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).y)
    .attr('dx', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).dx)
    .attr('dy', d => referenceLabelAligner(d, getLayout(d, layout), groupName, innerPaddedHeight, innerPaddedWidth).dy);

  // update colors outside of the transitioned update above
  mergeLines
    .style('stroke', visaColors[referenceStyle.color] || referenceStyle.color)
    .style('stroke-width', referenceStyle.strokeWidth)
    .attr('stroke-dasharray', referenceStyle.dashed ? referenceStyle.dashed : '')
    .attr('opacity', referenceStyle.opacity);

  // need to check whether we should just use our text color function here?
  mergeLabels
    .style('fill', visaColors[referenceStyle.color] || referenceStyle.color)
    .attr('opacity', 1)
    .style('paint-order', 'stroke')
    .style('stroke', 'white')
    .style('stroke-width', '4px');

  // exit lifecycle for reference lines
  const exitReferences = currentReferences.exit();
  exitReferences
    .transition('exit')
    .ease(easeCircleIn)
    .duration(duration)
    .attr('opacity', 0)
    .remove();
};
