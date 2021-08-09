/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import * as d3 from 'd3';
import {
  annotation,
  annotationBadge,
  annotationLabel,
  annotationCallout,
  annotationCalloutElbow,
  annotationCalloutCurve,
  annotationCalloutCircle,
  annotationCalloutRect,
  annotationXYThreshold
} from '../../node_modules/d3-svg-annotation/indexRollupNext.js';
import { visaColorToHex } from './colors';
import { hideNode } from './accessibilityUtils';
import { select } from 'd3-selection';
import { roundTo } from './formatStats';
import { resolveLabelCollision } from './collisionDetection';
import { getTextWidth } from './textHelpers';

interface DatumObject {
  [key: string]: any;
}
const types = {
  annotationLabel: annotationLabel,
  annotationCallout: annotationCallout,
  annotationCalloutElbow: annotationCalloutElbow,
  annotationCalloutCurve: annotationCalloutCurve,
  annotationCalloutCircle: annotationCalloutCircle,
  annotationCalloutRect: annotationCalloutRect,
  annotationXYThreshold: annotationXYThreshold,
  annotationBadge: annotationBadge
};
export function annotate({
  source,
  data,
  xScale,
  xAccessor,
  yScale,
  yAccessor,
  ignoreScales,
  width,
  height,
  padding,
  margin,
  bitmaps
}: {
  source?: any;
  data?: any;
  xScale?: any;
  xAccessor?: any;
  yScale?: any;
  yAccessor?: any;
  ignoreScales?: boolean;
  width?;
  any;
  height?: any;
  padding?: any;
  margin?: any;
  bitmaps?: any;
}) {
  d3.select(source)
    .selectAll('.vcl-annotation-group')
    .remove();

  const annotations = d3
    .select(source)
    .append('g')
    .attr('class', 'vcl-annotation-group')
    .attr('data-testid', 'annotation-group');

  hideNode(annotations.node());

  const editable = d3
    .select(source)
    .append('g')
    .attr('class', 'editable vcl-annotation-group')
    .attr('data-testid', 'editable-annotation-group');

  hideNode(editable.node());

  if (data && data.length) {
    const percentX = d3
      .scaleLinear()
      .range(xScale ? xScale.range() : [0, 100])
      .domain([0, 100]);
    const yRange = yScale ? yScale.range() : [0, 100];
    const y0 = yRange[0] >= yRange[1] ? 100 : 0;
    const y1 = 100 - y0;
    const percentY = d3
      .scaleLinear()
      .range(yRange)
      .domain([y0, y1]);

    let invertedY = d => {
      const height = yRange[0] >= yRange[1] ? yRange[0] : yRange[1];
      return yScale(d) - height;
    };

    const annotationData = [];
    const annotationEditableData = [];
    data.forEach((datum, i) => {
      const d: DatumObject = {};
      const dKeys = Object.keys(datum);
      dKeys.forEach(key => {
        if (key !== 'data' && key !== 'subject' && key !== 'connector' && key !== 'note') {
          if (datum[key] instanceof Array) {
            d[key] = [...datum[key]];
          } else {
            d[key] = datum[key];
          }
        } else {
          d[key] = {};
          const innerKeys = Object.keys(datum[key]);
          innerKeys.forEach(innerKey => {
            if (datum[key][innerKey] instanceof Array) {
              if (innerKey === 'points') {
                // [ // datum[key][innerKey]
                //   [ // point
                //     40,
                //     50
                //   ],
                //   [
                //     200,
                //     100
                //   ]
                // ]
                // or
                // [ // datum[key][innerKey]
                //   [ // point
                //     [val,val],
                //     [val]
                //   ],
                //   [
                //     [val],
                //     [val]
                //   ]
                // ]
                d[key][innerKey] = [];
                datum[key][innerKey].forEach(point => {
                  const clonedPoint = [];
                  if (point[0] instanceof Array && point[1] instanceof Array) {
                    clonedPoint.push([...point[0]]);
                    clonedPoint.push([...point[1]]);
                  } else {
                    clonedPoint.push(point[0]);
                    clonedPoint.push(point[1]);
                  }
                  d[key][innerKey].push(clonedPoint);
                });
              } else {
                d[key][innerKey] = [...datum[key][innerKey]];
              }
            } else {
              d[key][innerKey] = datum[key][innerKey];
            }
          });
        }
      });
      const yToDate = d.parseAsDates && (d.parseAsDates.includes('y') || d.parseAsDates.includes(yAccessor));
      const xToDate = d.parseAsDates && (d.parseAsDates.includes('x') || d.parseAsDates.includes(xAccessor));
      let diff = 0;
      if (d.data) {
        const keys = Object.keys(d.data);
        let i = 0;
        if (yToDate || xToDate) {
          for (i = 0; i < keys.length; i++) {
            if (keys[i] === 'x' || keys[i] === xAccessor) {
              d.data[keys[i]] = checkDate(d.data[keys[i]], xToDate);
            } else if (keys[i] === yAccessor || keys[i] === 'y') {
              d.data[keys[i]] = checkDate(d.data[keys[i]], yToDate);
            }
          }
        }
      }
      if (d.x) {
        d.x = resolveValue(d.x, xScale, percentX, xToDate);
      }
      if (d.y) {
        d.y = resolveValue(d.y, yScale, percentY, yToDate);
      }
      if (d.dx) {
        if (d.dx instanceof Array) {
          diff = d.data && d.data[xAccessor] !== undefined ? xScale(d.data[xAccessor]) : d.x ? d.x : 0;
        }
        d.dx = resolveValue(d.dx, xScale, percentX, xToDate) - diff;
      }
      if (d.dy) {
        diff = 0;
        if (d.dy instanceof Array) {
          diff = d.data && d.data[yAccessor] !== undefined ? yScale(d.data[yAccessor]) : d.y ? d.y : 0;
        }
        d.dy = resolveValue(d.dy, yScale, percentY, yToDate) - diff;
      }
      if (d.subject) {
        if (d.subject.x1) {
          d.subject.x1 = resolveValue(d.subject.x1, xScale, percentX, xToDate);
        }
        if (d.subject.y1) {
          d.subject.y1 = resolveValue(d.subject.y1, yScale, percentY, yToDate);
        }
        if (d.subject.x2) {
          d.subject.x2 = resolveValue(d.subject.x2, xScale, percentX, xToDate);
        }
        if (d.subject.y2) {
          d.subject.y2 = resolveValue(d.subject.y2, yScale, percentY, yToDate);
        }
        if (d.subject.width) {
          d.subject.width = resolveValue(d.subject.width, xScale, percentX, xToDate);
        }
        if (d.subject.height) {
          d.subject.height = resolveValue(d.subject.height, invertedY, percentY, yToDate);
        }
      }
      if (d.connector) {
        if (typeof d.connector.curve === 'string') {
          d.connector.curve = d3[d.connector.curve];
        }
        if (d.connector.points instanceof Array) {
          d.connector.points.forEach(point => {
            point[0] = resolveValue(point[0], xScale, percentX, xToDate);
            point[1] = resolveValue(point[1], yScale, percentY, yToDate);
          });
        }
      }
      if (d.type && typeof d.type === 'string') {
        d.type = types[d.type];
      }
      if (!d.editMode) {
        annotationData.push(d);
      } else {
        annotationEditableData.push(d);
      }
      if (d.color) {
        d.color = visaColorToHex(d.color) || d.color;
      }
      if (d.collisionHideOnly) {
        if (d.className) {
          d.className = d.className + ' annotation-detect-collision';
        } else {
          d.className = 'annotation-detect-collision';
        }
      }
    });
    let makeAnnotations = annotation().annotations(annotationData);
    let makeEditableAnnotations = annotation()
      .editMode(true)
      .annotations(annotationEditableData);

    if (!ignoreScales) {
      makeAnnotations = annotation()
        .accessors({
          x: function(d) {
            return xScale(d[xAccessor]);
          },
          y: function(d) {
            return yScale(d[yAccessor]);
          }
        })
        .annotations(annotationData);

      makeEditableAnnotations = annotation()
        .editMode(true)
        .accessors({
          x: function(d) {
            return xScale(d[xAccessor]);
          },
          y: function(d) {
            return yScale(d[yAccessor]);
          }
        })
        .annotations(annotationEditableData);
    }

    annotations.call(makeAnnotations);
    editable.call(makeEditableAnnotations);

    // checking if avoidCollision is set in any annotation object that user passed
    if (annotationData && annotationData.some(e => e.collisionHideOnly === true)) {
      hideOverlappingAnnotations(source, width, height, padding, margin, bitmaps);
    }
    if (annotationEditableData && annotationEditableData.some(e => e.collisionHideOnly === true)) {
      hideOverlappingAnnotations(source, width, height, padding, margin, bitmaps);
    }
  }

  // addStrokeUnder(
  //   d3
  //     .select(source)
  //     .selectAll('.vcl-annotation-group')
  //     .selectAll('text'),
  //   'white'
  // );
}

function resolveValue(d, scale, percentScale, shouldBeDate) {
  if (d) {
    if (d instanceof Array) {
      if (d.length === 1) {
        return checkZero(scale(checkDate(d[0], shouldBeDate)));
      } else if (d.length === 2) {
        return checkZero(scale(checkDate(d[0], shouldBeDate)) - scale(checkDate(d[1], shouldBeDate)));
      }
    } else if (typeof d === 'string' && d.substring(d.length - 1, d.length) === '%') {
      return checkZero(percentScale(+d.substring(0, d.length - 1)));
    }
  }
  return checkZero(d);
}

function checkZero(v) {
  if (v === 0) {
    return 0.000000001;
  }
  return v;
}

function checkDate(d, shouldCheck) {
  if (shouldCheck) {
    if (typeof d === 'object' && typeof d.getMonth === 'function') {
      return d;
    }
    return new Date(d);
  }
  return d;
}

function hideOverlappingAnnotations(source, width, height, padding, margin, bitmaps) {
  // now that we have annotated we can use existing bitmap to check for collisions
  // all annotation shapes are drawn as paths
  // circle.handle is used for edit mode, which we currently don't support
  // annotation-connector
  // path.connector
  // annotation-subject
  // path.subject
  // annotation-note
  // path.note-line
  // annotation-note-content
  // text.annotation-note-label
  // text.annotation-note-title
  // rect.annotation-note-bg
  const annotationsG = select(source)
    .select('.vcl-annotation-group')
    .select('.annotations');
  annotationsG.selectAll('.annotation').style('visibility', null);
  annotationsG.selectAll('.annotation-detect-collision').each((_, i, n) => {
    // annotationsG.selectAll('.annotation').each((_, i, n) => {
    const me = n[i];
    const annotationTransform = parseTransformSimple(select(me).attr('transform'));
    const annotationTranslate = (annotationTransform && annotationTransform['translate']) || [0, 0];
    // we will need to address transforms on:
    // 1. g.annotation
    // 2. g.annotation-note
    // 3. g.annotation-note-content
    // 4. g.connector path.connector-end.connector-dot
    const annotationNoteTransform =
      select(me)
        .select('.annotation-note')
        .attr('transform') &&
      parseTransformSimple(
        select(me)
          .select('.annotation-note')
          .attr('transform')
      );
    const annotationNoteTranslate = (annotationNoteTransform && annotationNoteTransform['translate']) || [0, 0];

    const annotationNoteContentTransform =
      select(me)
        .select('.annotation-note')
        .select('.annotation-note-content')
        .attr('transform') &&
      parseTransformSimple(
        select(me)
          .select('.annotation-note')
          .select('.annotation-note-content')
          .attr('transform')
      );
    const annotationNoteContentTranslate = (annotationNoteContentTransform &&
      annotationNoteContentTransform['translate']) || [0, 0];

    // first thing we can do is add data-d paths to draw all the annotation stuff to bitmap
    // paths will also need to handle the various transforms
    select(me)
      .selectAll('path')
      .each((_, i, n) => {
        const pathMe = select(n[i]);
        let translateX = annotationTranslate[0] + padding.left + margin.left;
        let translateY = annotationTranslate[1] + padding.top + margin.top;
        if (pathMe.classed('note-line')) {
          translateX += annotationNoteTranslate[0];
          translateY += annotationNoteTranslate[1];
        }
        pathMe
          .attr('data-d', pathMe.attr('d'))
          .attr('data-translate-x', translateX)
          .attr('data-translate-y', translateY);
      });

    // next we need to try and handle our texts for the annotations
    // this assumes all text is in the note arena
    let maxDataWidth = 0;
    select(me)
      .selectAll('text')
      .each((_, i, n) => {
        const textElement = n[i];
        const style = getComputedStyle(textElement);
        const fontSize = parseFloat(style.fontSize);
        const textHeight = Math.max(fontSize - 1, 1); // clone.getBBox().height;
        const textWidth = getTextWidth(textElement.textContent, fontSize, true, style.fontFamily);
        const textMe = select(textElement);
        const translateX =
          annotationTranslate[0] +
          annotationNoteTranslate[0] +
          annotationNoteContentTranslate[0] +
          padding.left +
          margin.left;
        const translateY =
          annotationTranslate[1] +
          annotationNoteTranslate[1] +
          annotationNoteContentTranslate[1] +
          padding.top +
          margin.top;
        maxDataWidth = Math.max(textWidth, maxDataWidth);
        textMe
          .attr('data-x', +textMe.attr('x') || 0)
          .attr('data-y', textHeight / 2 + +textMe.attr('y') || 0)
          .attr('data-ignore', textWidth === 0)
          .attr('data-width', textWidth)
          .attr('data-height', textHeight)
          .attr('data-translate-x', translateX)
          .attr('data-translate-y', translateY)
          .attr('data-no-text-anchor', true);
      });

    // if we have no text we set this flag for visibility check later
    if (maxDataWidth === 0) {
      select(me).attr('data-no-text', true);
    }
  });

  bitmaps = resolveLabelCollision({
    bitmaps: bitmaps,
    labelSelection: select('.nothing-exists-here'),
    avoidMarks: [annotationsG.selectAll('.annotation-detect-collision').selectAll('path')],
    validPositions: ['middle'],
    offsets: [1],
    // offsets: [2, 2, 4, 2, 1, 1, 1, 1],
    accessors: ['cidx'],
    size: [roundTo(width, 0), roundTo(height, 0)] // we need the whole width for series labels
  });

  bitmaps = resolveLabelCollision({
    bitmaps: bitmaps,
    labelSelection: annotationsG.selectAll('.annotation-detect-collision text'), //.filter((_, i, n) => +select(n[i]).attr('data-width') > 0),
    avoidMarks: [],
    validPositions: ['middle'],
    offsets: [1],
    accessors: ['cidx'],
    size: [roundTo(width, 0), roundTo(height, 0)] // we need the whole width for series labels
  });

  // now that we have hidden text, we need to  hide the rest of the annotation
  annotationsG.selectAll('.annotation-detect-collision').each((_, i, n) => {
    const me = n[i];
    let textShownIndicator = false;
    select(me)
      .selectAll('text')
      .each((_, i, n) => {
        const textElement = n[i];
        const elementIndicator =
          select(textElement).attr('data-label-hidden') === 'false' &&
          select(textElement).attr('data-ignore') === 'false';
        textShownIndicator = textShownIndicator || elementIndicator; // if we already have a true, we need to keep it
      });

    // this will flip visibility on the full element if we don't find any visible text
    if (textShownIndicator || select(me).attr('data-no-text') === 'true') {
      select(me).style('visibility', null);
    } else {
      select(me).style('visibility', 'hidden');
    }
  });
}

function parseTransformSimple(transform) {
  const result = {};
  transform
    .trim()
    .replace(', ', ',')
    .split(' ')
    .forEach(transformation => {
      const step1 = transformation.split(')')[0].split(',');
      const step2 = step1[0].split('(');
      result[step2[0]] = [];
      result[step2[0]].push(+step2[1], +step1[1]);
    });
  return result;
}
