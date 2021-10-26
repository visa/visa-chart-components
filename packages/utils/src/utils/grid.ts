/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { axisBottom, axisLeft } from 'd3-axis';
import { easeCircleIn } from 'd3-ease';

export const drawGrid = (
  root: any,
  height: any,
  width: any,
  axis: any,
  left: any,
  hide?: any,
  tickInterval?: number,
  duration?: number
) => {
  let transitionDuration = duration || duration === 0 ? duration : 750;
  let opacity = 1;
  if (hide) {
    opacity = 0;
  }
  if (left) {
    let grid = root.selectAll('.grid').filter('.left');
    if (!grid.node()) {
      transitionDuration = 0;
      grid = root
        .append('g')
        .attr('class', 'grid left')
        .attr('data-testid', 'grid-left');
    }
    let context = grid;

    if (transitionDuration) {
      context = grid
        .transition('grid-left-update')
        .duration(transitionDuration)
        .ease(easeCircleIn);
    }
    context.attr('opacity', opacity).call(
      axisLeft(axis)
        .tickSize(-width)
        .tickFormat('')
        .tickValues(
          (axis.ticks ? axis.ticks() : axis.domain()).filter((_, i) => !(tickInterval && i % tickInterval !== 0))
        )
    );
  } else {
    let grid = root.selectAll('.grid').filter('.bottom');
    if (!grid.node()) {
      transitionDuration = 0;
      grid = root
        .append('g')
        .attr('class', 'grid bottom')
        .attr('data-testid', 'grid-bottom');
    }
    let context = grid;

    if (transitionDuration) {
      context = grid
        .transition('grid-bottom-update')
        .duration(transitionDuration)
        .ease(easeCircleIn);
    }
    context.attr('opacity', opacity).call(
      axisBottom(axis)
        .tickSize(height)
        .tickFormat('')
        .tickValues(
          (axis.ticks ? axis.ticks() : axis.domain()).filter((_, i) => !(tickInterval && i % tickInterval !== 0))
        )
    );
  }
};
