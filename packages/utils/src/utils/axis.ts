/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select } from 'd3-selection';
import { formatStats } from './formatStats';
import { manuallyWrapText } from './textHelpers';
import { easeCircleIn } from 'd3-ease';
import { timeFormat } from 'd3-time-format';

const tickArguments = [];
let tickValues = null;
let transitionDuration = 750;
let orient = 1;
let tickFormat = null;
let tickSizeInner = 6;
let tickSizeOuter = 6;
let tickPadding = 3;
let xOffset = 0;
let yOffset = 0;
let tickWidth = 0;
let scale: any;
let hideAxisPath: any;
let k = 1;
let x = 'x';
let transform = translateX;
const orientTop = 1;
const orientRight = 2;
const orientBottom = 3;
const orientLeft = 4;
const epsilon = 1e-6;

export const drawAxis = ({
  root,
  height,
  width,
  axisScale,
  left,
  right,
  top,
  wrapLabel,
  format,
  dateFormat,
  tickInterval,
  label,
  padding,
  hide,
  markOffset,
  hidePath,
  ticks,
  duration
}: {
  root?: any;
  height?: any;
  width?: any;
  axisScale?: any;
  left?: any;
  right?: any;
  top?: any;
  bottom?: any;
  wrapLabel?: any;
  format?: any;
  dateFormat?: '%b';
  tickInterval?: any;
  label?: any;
  padding?: any;
  hide?: any;
  markOffset?: any;
  hidePath?: any;
  ticks?: any;
  duration?: number;
}) => {
  transitionDuration = duration || duration === 0 ? duration : transitionDuration;
  scale = axisScale;
  hideAxisPath = hidePath;
  tickValues = ticks ? ticks : null;
  let opacity = 1;
  if (hide) {
    opacity = 0;
  }
  tickWidth = wrapLabel ? wrapLabel : 0;

  if (markOffset) {
    // mark line at x=0
    if (left) {
      let axisBase = root.selectAll('.axis-mark-y');
      if (axisBase.empty()) {
        transitionDuration = 0;
        axisBase = root.append('g').attr('class', 'axis-mark-y axis-mark');
      }
      tickFormat = () => null;
      orient = orientLeft;
      setOrientation();

      let context = axisBase.attr('data-testid', 'y-axis-mark');
      // .attr('transform', markOffset > 0 ? `translate(${markOffset}, 0)` : '')

      if (transitionDuration) {
        context = context
          .transition('axis_base')
          .ease(easeCircleIn)
          .duration(transitionDuration);
      }
      context
        .attr('transform', markOffset > 0 ? `translate(${markOffset}, 0)` : '')
        .attr('opacity', opacity)
        .call(axis);
    } else {
      // mark line at y=0
      let axisBase = root.selectAll('.axis-mark-x');
      if (axisBase.empty()) {
        transitionDuration = 0;
        axisBase = root.append('g');
      }
      tickFormat = () => null;

      orient = orientBottom;
      setOrientation();

      let context = axisBase.attr('class', 'axis-mark-x axis-mark').attr('data-testid', 'x-axis-mark');

      if (transitionDuration) {
        context = context
          .transition('axis_base')
          .ease(easeCircleIn)
          .duration(transitionDuration);
      }
      context
        .attr('transform', markOffset > 0 ? `translate(0, ${markOffset})` : '')
        .attr('opacity', opacity)
        .call(axis);
    }
  } else if (left) {
    // left y axis
    let axisNode = root
      .selectAll('.axis')
      .filter('.y')
      .filter('.left');
    let axisLabel = root
      .selectAll('.axis-label')
      .filter('.y')
      .filter('.left');

    if (axisNode.empty()) {
      transitionDuration = 0;
      axisNode = root.append('g');
      axisLabel = root.append('text');
    }

    tickFormat = (data, i) => {
      if (tickInterval && i % tickInterval !== 0) {
        return null;
      } else if (format && typeof data === 'number') {
        return formatStats(data, format);
      } else if (data instanceof Date) {
        const formatTime = timeFormat(dateFormat);
        return formatTime(data);
      } else {
        return data;
      }
    };

    tickSizeInner = 0;
    tickSizeOuter = 0;
    tickPadding = 10;

    if (tickWidth) {
      xOffset = -8;
      yOffset = 0.6;
    }

    orient = orientLeft;
    setOrientation();

    let context = axisNode.attr('class', 'y axis left').attr('data-testid', 'y-axis');

    if (transitionDuration) {
      context = context
        .transition('axis_node')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    context.attr('opacity', opacity).call(axis);

    let labelContext = axisLabel
      .attr('class', 'y axis-label left')
      .attr('data-testid', 'y-axis-label')
      .attr('transform', `rotate(-90)`)
      .text(label);

    if (transitionDuration) {
      labelContext = labelContext
        .transition('axis_label')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    labelContext
      .attr('y', padding ? 0 - padding.left : -50)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em');
    // .attr("opacity",opacity);
  } else if (right) {
    // right y axis
    let axisNode = root
      .selectAll('.axis')
      .filter('.y')
      .filter('.right');
    let axisLabel = root
      .selectAll('.axis-label')
      .filter('.y')
      .filter('.right');
    if (axisNode.empty()) {
      transitionDuration = 0;
      axisNode = root.append('g');
      axisLabel = root.append('text');
    }

    tickFormat = (data, i) => {
      if (tickInterval && i % tickInterval !== 0) {
        return null;
      } else if (format && typeof data === 'number') {
        return formatStats(data, format);
      } else if (data instanceof Date) {
        const formatTime = timeFormat(dateFormat);
        return formatTime(data);
      } else {
        return data;
      }
    };
    tickSizeInner = 0;
    tickSizeOuter = 0;
    tickPadding = 10;

    if (tickWidth) {
      xOffset = 8;
      yOffset = 0.6;
    }
    orient = orientRight;
    setOrientation();
    let context = axisNode.attr('class', 'y axis right').attr('data-testid', 'sec-y-axis');

    if (transitionDuration) {
      context = context
        .transition('axis_node')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    context
      .attr('transform', `translate(${width},0)`)
      .attr('opacity', opacity)
      .call(axis);

    let labelContext = axisLabel
      .attr('class', 'y axis-label right')
      .attr('data-testid', 'sec-y-axis-label')
      .attr('transform', `rotate(-90)`)
      .text(label || 'Cumulative Percentage');

    if (transitionDuration) {
      labelContext = labelContext
        .transition('axis_label')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    labelContext
      .attr('y', padding ? width + padding.left + padding.right - 50 : width - 50)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em');
    // .attr("opacity",opacity);
  } else if (top) {
    // x axis on top
    let axisNode = root
      .selectAll('.axis')
      .filter('.x')
      .filter('.top');
    let axisLabel = root
      .selectAll('.axis-label')
      .filter('.x')
      .filter('.top');
    if (axisNode.empty()) {
      transitionDuration = 0;
      axisNode = root.append('g');
      axisLabel = root.append('text');
    }

    tickFormat = (data, i) => {
      if (tickInterval && i % tickInterval !== 0) {
        return null;
      } else if (format && typeof data === 'number') {
        return formatStats(data, format);
      } else if (data instanceof Date) {
        const formatTime = timeFormat(dateFormat);
        return formatTime(data);
      } else {
        return data;
      }
    };
    tickSizeInner = 0;
    tickSizeOuter = 0;
    tickPadding = 10;

    if (tickWidth) {
      xOffset = 0;
      yOffset = 1;
    }

    orient = orientTop;
    setOrientation();

    let context = axisNode.attr('class', 'x axis top').attr('data-testid', 'sec-x-axis');

    if (transitionDuration) {
      context = context
        .transition('axis_node')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    context
      .attr('transform', `translate(0, 0)`)
      .attr('opacity', opacity)
      .call(axis);

    let labelContext = axisLabel
      .attr('class', 'x axis-label top')
      .attr('data-testid', 'sec-x-axis-label')
      .attr('transform', `translate(0, 0)`)
      .text(format && typeof label === 'number' ? formatStats(label, format) : label);

    if (transitionDuration) {
      labelContext = labelContext
        .transition('axis_label')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    labelContext
      .attr('x', width / 2)
      .attr('y', padding ? -padding.top : -50)
      .attr('dy', '1em');
    // .attr("opacity",opacity);
  } else {
    // x axis at bottom
    let axisNode = root
      .selectAll('.axis')
      .filter('.x')
      .filter('.bottom');
    let axisLabel = root
      .selectAll('.axis-label')
      .filter('.x')
      .filter('.bottom');
    if (axisNode.empty()) {
      transitionDuration = 0;
      axisNode = root.append('g');
      axisLabel = root.append('text');
    }

    tickFormat = (data, i) => {
      if (tickInterval && i % tickInterval !== 0) {
        return null;
      } else if (format && typeof data === 'number') {
        return formatStats(data, format);
      } else if (data instanceof Date) {
        const formatTime = timeFormat(dateFormat);
        return formatTime(data);
      } else {
        return data;
      }
    };
    tickSizeInner = 0;
    tickSizeOuter = 0;
    tickPadding = 10;

    if (tickWidth) {
      xOffset = 0;
      yOffset = 1;
    }

    orient = orientBottom;
    setOrientation();

    let context = axisNode.attr('class', 'x axis bottom').attr('data-testid', 'x-axis');

    if (transitionDuration) {
      context = context
        .transition('axis_node')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    context
      .attr('transform', `translate(0, ${height})`)
      .attr('opacity', opacity)
      .call(axis);

    let labelContext = axisLabel
      .attr('class', 'x axis-label bottom')
      .attr('data-testid', 'x-axis-label')
      .attr('transform', `translate(0, 0)`)
      .text(format && typeof label === 'number' ? formatStats(label, format) : label);

    if (transitionDuration) {
      labelContext = labelContext
        .transition('axis_node')
        .ease(easeCircleIn)
        .duration(transitionDuration);
    }
    labelContext.attr('x', width / 2).attr('y', padding ? height + padding.bottom : height);
    // .attr("opacity",opacity);
  }
  // transitionDuration = 750;
};

function axis(context: any) {
  const values =
    tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues;
  const format =
    tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat;
  const spacing = Math.max(tickSizeInner, 0) + tickPadding;
  const range = scale.range();
  const range0 = +range[0] + 0.5;
  const range1 = +range[range.length - 1] + 0.5;
  const position = (scale.bandwidth ? center : number)(scale.copy());
  const selection = context.selection ? context.selection() : context;
  let path = selection.selectAll('.domain').data([null]);
  let tick = selection
    .selectAll('.tick')
    .data(values, scale)
    .order();
  let tickExit = tick.exit();
  const tickEnter = tick
    .enter()
    .append('g')
    .attr('class', 'tick')
    .attr('data-testid', 'axis-tick');
  let line = tick.select('line');
  let text = tick.select('text');

  path = path.merge(
    path
      .enter()
      .insert('path', '.tick')
      .attr('class', 'domain')
      .attr('stroke', 'currentColor')
  );

  selection.selectAll('.domain').attr('class', hideAxisPath ? 'domain hidden' : 'domain');

  tick = tick.merge(tickEnter);

  line = line.merge(
    tickEnter
      .append('line')
      .attr('data-testid', 'axis-tick-line')
      .attr('stroke', 'currentColor')
      .attr(x + '2', k * tickSizeInner)
  );

  if (!scale.formattedTicks) {
    scale.formattedTicks = [];
  }
  text = text
    .merge(
      tickEnter
        .append('text')
        .attr('data-testid', 'axis-tick-text')
        .attr('fill', 'currentColor')
        .attr(x, k * spacing)
        .attr('dy', orient === orientTop ? '0em' : orient === orientBottom ? '0.71em' : '0.32em')
    )
    .text((d, i) => {
      if (format(d, i)) {
        scale.formattedTicks.push(format(d, i));
      }
      return format(d, i);
    });

  if (tickWidth > 0) {
    text.call(wrap);
  }

  if (context !== selection && transitionDuration) {
    path = path
      .transition(context)
      .duration(transitionDuration)
      .ease(easeCircleIn);
    tick = tick
      .transition(context)
      .duration(transitionDuration)
      .ease(easeCircleIn);
    line = line
      .transition(context)
      .duration(transitionDuration)
      .ease(easeCircleIn);
    text = text
      .transition(context)
      .duration(transitionDuration)
      .ease(easeCircleIn);

    tickExit = tickExit
      .transition(context)
      .attr('opacity', epsilon)
      .attr('transform', function(d) {
        return isFinite((d = position(d))) ? transform(d) : this.getAttribute('transform');
      });

    tickEnter.attr('opacity', epsilon).attr('transform', function(d) {
      let p = this.parentNode.__axis;
      return transform(p && isFinite((p = p(d))) ? p : position(d));
    });
  }

  tickExit.remove();

  path.attr(
    'd',
    orient === orientLeft || orient === orientRight
      ? tickSizeOuter
        ? 'M' + k * tickSizeOuter + ',' + range0 + 'H0.5V' + range1 + 'H' + k * tickSizeOuter
        : 'M0.5,' + range0 + 'V' + range1
      : tickSizeOuter
      ? 'M' + range0 + ',' + k * tickSizeOuter + 'V0.5H' + range1 + 'V' + k * tickSizeOuter
      : 'M' + range0 + ',0.5H' + range1
  );

  tick.attr('opacity', 1).attr('transform', d => transform(position(d)));

  line.attr(x + '2', k * tickSizeInner);

  text.attr(x, k * spacing);

  selection
    .filter(entering)
    .attr('fill', 'none')
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif')
    .attr('text-anchor', orient === orientRight ? 'start' : orient === orientLeft ? 'end' : 'middle');

  selection.each(function() {
    this.__axis = position;
  });
}

export function wrap(selection: any) {
  selection.each(function() {
    const text = select(this);
    const words = manuallyWrapText({
      text: text.text(),
      width: tickWidth,
      fontSize: 12,
      noPadding: false,
      wholeWords: false
    });
    const lineHeight = yOffset; // ems
    let lineNumber = 0;
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy'));
    text.text(null);
    words.forEach(word => {
      text
        .append('tspan')
        .attr('data-testid', 'axis-tick-text-tspan')
        .attr('x', xOffset)
        .attr('y', y)
        .attr('dy', lineNumber * lineHeight + dy + 'em')
        .text(word);
      lineNumber++;
    });
  });
}

function setOrientation() {
  k = orient === orientTop || orient === orientLeft ? -1 : 1;
  x = orient === orientLeft || orient === orientRight ? 'x' : 'y';
  transform = orient === orientTop || orient === orientBottom ? translateX : translateY;
}

function identity(id) {
  return id;
}

function translateX(xPos) {
  return 'translate(' + (xPos + 0.5) + ',0)';
}

function translateY(yPos) {
  return 'translate(0,' + (yPos + 0.5) + ')';
}

function number(scaleFunction) {
  return d => {
    return +scaleFunction(d);
  };
}

function center(scaleFunction) {
  let offset = Math.max(0, scaleFunction.bandwidth() - 1) / 2; // Adjust for 0.5px offset.
  if (scaleFunction.round()) {
    offset = Math.round(offset);
  }
  return d => {
    return +scaleFunction(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}
