/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { createMultiStrokeFilter } from './textures';
const defaultHoverStrokeWidth = 2;
const defaultClickStrokeWidth = 2;

export function checkInteraction(d, default_op, hover_op, hoverHighlight, clickHighlight, interactionKeys) {
  // data: d, default opacity: default_op, hover opacity: hover_op, hoverHighlight, clickHighlight, interactionKeys

  let elementOpacity = default_op === 0 ? 0 : hover_op;
  const matchClick = checkClicked(d, clickHighlight, interactionKeys);
  const matchHover = checkHovered(d, hoverHighlight, interactionKeys);

  if (matchHover || matchClick) {
    elementOpacity = default_op;
  } else if ((!hoverHighlight || matchHover) && (clickHighlight.length === 0 || matchClick)) {
    elementOpacity = default_op;
  }
  return elementOpacity;
}

export function checkHovered(d, hoverHighlight, interactionKeys) {
  // here we check for sub data objects, this will help catch time when data might be nested
  // in d for charts like pie chart and circle packing
  const datum = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
  let matchHover = 0;
  if (hoverHighlight) {
    interactionKeys.map(key => {
      if (hoverHighlight[key] instanceof Date && datum[key] instanceof Date) {
        if (hoverHighlight[key].getTime() === datum[key].getTime()) {
          matchHover++;
        }
      } else if (hoverHighlight[key] === datum[key]) {
        matchHover++;
      }
    });
  }
  return interactionKeys && interactionKeys.length && matchHover === interactionKeys.length;
}

export function checkClicked(d, clickHighlight, interactionKeys) {
  // first set flag to false by default
  let clickedCheck = false;
  // here we check for sub data objects, this will help catch time when data might be nested
  // in d for charts like pie chart and circle packing
  const datum = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};

  // if we have clickHighlight and it has length then we need to check it
  if (clickHighlight && clickHighlight.length) {
    // loop through each element in clickHighlight
    for (let i = 0; i < clickHighlight.length; i++) {
      // we are checking all keys fresh for each object in click highlight
      let matchedClick = 0;
      // now we need to check each key in interactionKeys, if we have a match with data increment matchedClick
      interactionKeys.map(key => {
        if (clickHighlight[i][key] instanceof Date && datum[key] instanceof Date) {
          if (clickHighlight[i][key].getTime() === datum[key].getTime()) {
            matchedClick++;
          }
        } else if (clickHighlight[i][key] === datum[key]) {
          matchedClick++;
        }
      });
      // check whether all interactions keys matched, if so return true and immediately stop looping
      if (matchedClick === interactionKeys.length) {
        clickedCheck = true;
        break;
      }
    }
  }

  // return results back to component if we have interaction keys and interaction keys length
  return interactionKeys && interactionKeys.length && clickedCheck;
}

export const buildStrokes = ({
  root,
  id,
  colors,
  clickStyle,
  hoverStyle,
  additionalStrokeSize,
  strokeOnHover,
  stacked,
  strokeOverride
}: {
  root: any;
  id: string;
  colors: any;
  clickStyle: any;
  hoverStyle: any;
  additionalStrokeSize?: number;
  strokeOnHover?: boolean;
  stacked?: boolean;
  strokeOverride?: any;
}) => {
  const strokes = {};
  const additionalStrokeExists = additionalStrokeSize || additionalStrokeSize === 0;
  let i = 0;
  colors.forEach(color => {
    const restSize = additionalStrokeExists ? additionalStrokeSize : 1;
    if (!strokes['rest' + color]) {
      strokes['rest' + color] = createMultiStrokeFilter({
        root,
        id,
        state: 'rest',
        fillColor: color,
        forceStrokeColor: strokeOverride && strokeOverride.length ? strokeOverride[i] : undefined,
        strokeWidth: restSize,
        includeOuterStroke: true,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    }
    if (additionalStrokeExists && !strokes['default' + color]) {
      strokes['default' + color] = createMultiStrokeFilter({
        root,
        id,
        state: 'default',
        fillColor: color,
        forceStrokeColor: strokeOverride && strokeOverride.length ? strokeOverride[i] : undefined,
        strokeWidth: 1,
        includeOuterStroke: true,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    }
    if (hoverStyle && hoverStyle.color && !strokes['hover' + hoverStyle.color]) {
      strokes['hover' + hoverStyle.color] = createMultiStrokeFilter({
        root,
        id,
        state: 'hover',
        fillColor: hoverStyle.color,
        strokeWidth:
          hoverStyle && hoverStyle.strokeWidth ? parseFloat(hoverStyle.strokeWidth) : defaultHoverStrokeWidth,
        includeOuterStroke: true,
        strokeOnHover,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    } else {
      strokes['hover' + color] = createMultiStrokeFilter({
        root,
        id,
        state: 'hover',
        fillColor: color,
        forceStrokeColor: strokeOverride && strokeOverride.length ? strokeOverride[i] : undefined,
        strokeWidth:
          hoverStyle && hoverStyle.strokeWidth ? parseFloat(hoverStyle.strokeWidth) : defaultHoverStrokeWidth,
        includeOuterStroke: true,
        strokeOnHover,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    }
    if (clickStyle && clickStyle.color && !strokes['click' + clickStyle.color]) {
      strokes['click' + clickStyle.color] = createMultiStrokeFilter({
        root,
        id,
        state: 'click',
        fillColor: clickStyle.color,
        strokeWidth:
          clickStyle && clickStyle.strokeWidth ? parseFloat(clickStyle.strokeWidth) : defaultClickStrokeWidth,
        includeOuterStroke: true,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    } else {
      strokes['click' + color] = createMultiStrokeFilter({
        root,
        id,
        state: 'click',
        fillColor: color,
        forceStrokeColor: strokeOverride && strokeOverride.length ? strokeOverride[i] : undefined,
        strokeWidth:
          clickStyle && clickStyle.strokeWidth ? parseFloat(clickStyle.strokeWidth) : defaultClickStrokeWidth,
        includeOuterStroke: true,
        alwaysShowStroke: !!additionalStrokeExists,
        stacked
      });
    }
    i++;
  });
  return strokes;
};

export const interactionStyle = ({
  data,
  clickHighlight,
  hoverHighlight,
  clickStyle,
  hoverStyle,
  interactionKeys,
  defaultStroke,
  defaultStrokeWidth,
  offset
}: {
  data: any;
  clickHighlight: any;
  hoverHighlight: any;
  clickStyle: any;
  hoverStyle: any;
  interactionKeys: any;
  defaultStroke: string;
  defaultStrokeWidth: number;
  offset: number;
}) => {
  const strokeColor =
    clickHighlight.length > 0 && checkClicked(data, clickHighlight, interactionKeys)
      ? defaultStroke
      : hoverHighlight && checkHovered(data, hoverHighlight, interactionKeys)
      ? defaultStroke
      : 'none';

  const strokeStyle = checkClicked(data, clickHighlight, interactionKeys) ? 'solid' : 'dashed';
  let strokeWidth = checkClicked(data, clickHighlight, interactionKeys)
    ? clickStyle.strokeWidth || defaultStrokeWidth
    : hoverHighlight && checkHovered(data, hoverHighlight, interactionKeys) && hoverStyle.strokeWidth
    ? hoverStyle.strokeWidth || defaultStrokeWidth
    : 0;

  if (typeof strokeWidth === 'string' && strokeWidth.includes('px')) {
    strokeWidth = parseInt(strokeWidth.substr(0, strokeWidth.indexOf('p')));
  }

  const strokeOffset = offset ? strokeWidth + offset : strokeWidth;
  // const strokeOffset = checkClicked(data, clickHighlight, interactionKeys) ? strokeWidth : strokeWidth + 2;

  return (
    `outline-color:` +
    strokeColor +
    `;
        outline-style:` +
    strokeStyle +
    `;
        outline-width:` +
    strokeWidth +
    `px;
        outline-offset:-` +
    strokeOffset +
    `px;`
  );
};
