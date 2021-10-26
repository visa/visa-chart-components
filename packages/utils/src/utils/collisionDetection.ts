/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

// This code builds off of vega-label, see ./vega-label for additional utils leveraged herein
import { select } from 'd3-selection';
import { getTextWidth } from './textHelpers';
import { prepareBitmap, addToBitmap } from './vega-label/BitMap'; // printBitMap
import LabelPlacer from './vega-label/LabelPlacers/LabelPlacer';
import { getBrowser } from './browser-util';
import { polyfillGetAttributeNames } from './customPolyfills';

const browser = getBrowser();
const isIE11 = browser === 'IE'; // ua.includes('rv:11.0');
if (isIE11) {
  polyfillGetAttributeNames();
}
// 8-bit representation of anchors
// obtained from vega-label
const TOP = 0x0,
  MIDDLE = 0x1 << 0x2,
  BOTTOM = 0x2 << 0x2,
  LEFT = 0x0,
  CENTER = 0x1,
  RIGHT = 0x2;

// Dictionary mapping from text anchor to its number representation
// obtained from vega-label
const anchorTextToNumber = {
  'top-left': TOP + LEFT,
  top: TOP + CENTER,
  'top-right': TOP + RIGHT,
  left: MIDDLE + LEFT,
  middle: MIDDLE + CENTER,
  right: MIDDLE + RIGHT,
  'bottom-left': BOTTOM + LEFT,
  bottom: BOTTOM + CENTER,
  'bottom-right': BOTTOM + RIGHT
};

export const findCollision = (bbox1: any, bbox2: any) =>
  bbox1.x <= bbox2.x + bbox2.width &&
  bbox2.x <= bbox1.x + bbox1.width &&
  bbox2.y <= bbox1.y + bbox1.height &&
  bbox1.y <= bbox2.y + bbox2.height;

// NOTE: resolveCollision assumes a TRANSITION selection (aka selection.transition().duration()... etc)
// results outside of a transition are untested!
export const resolveLabelCollision = ({
  labelSelection, // this is a set of selections determined by component
  avoidMarks, // marks to draw to bitmap and then avoid when placing a label
  validPositions, // this the list of anchor positions to allow (e.g., series label should be middle, top, bottom, right/left?)
  offsets, // these offsets should be predetermined, but allowing components to specify could be helpful at some point
  attributes, // can be removed // these are the label placement attributes to set (x, y, text-anchor should be all we need)
  accessors, // these are the accessors to check when building the key:value hash for mark boundaries
  size, // an array with chart [ width, height ]
  boundsScope, // used in getting mark bounds, can help more specifically define placment of labels
  bitmaps, // outputted/inputted bitmap created, used to speed up subsequent calls to this function
  hideOnly, // a boolean that will be off by default, but when true is passed it will not place, only hide overlapping
  removeOnly, // a boolean that will be off by default, but when true is passed it will only remove labels passed from bitmap
  suppressMarkDraw // a boolean that will be off by default, but when true is passed it will skip drawing chart marks to canvas/bitmap
}: {
  labelSelection: any;
  avoidMarks: any;
  attributes?: any;
  validPositions?: string[];
  offsets?: number[];
  accessors?: string[];
  size: [number, number];
  boundsScope?: string;
  bitmaps?: any;
  hideOnly?: boolean;
  removeOnly?: boolean;
  suppressMarkDraw?: boolean;
}) => {
  const anchors = validPositions; // this should be the allowed placements
  // const padding = 100; // The padding in pixels (default 0) by which a label may extend past the chart bounding box.
  const labelsArray = []; // we will populate this with labels to add to bitmap
  const marksArray = []; // we will populate this with marks to add to bitmap
  const boundsHash = {}; // hash lookup used to match bounds to labels

  // check size is there
  if (!size || size.length !== 2) {
    throw Error('Size of chart should be specified as an array of width and height');
  }

  // step 1a: map d3 mark selections in preperation for vega-label, an array of multiple selections
  if (avoidMarks && avoidMarks.length) {
    avoidMarks.forEach(marks => {
      const innerMarkArray = [];
      marks.each((d, i, n) => {
        const item = {};
        item['node'] = n[i];
        item['nodeName'] = n[i].nodeName;
        item['datum'] = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
        n[i].getAttributeNames().forEach(attrName => {
          item[attrName] = select(n[i]).attr(attrName);
        });
        item['boundsScope'] = boundsScope;
        item['bounds'] = getMarkItemBounds(item);
        const accessorValues = accessors.map(key => item['datum'][key] || 'Not Found');
        boundsHash[accessorValues.join('-')] = item['bounds'];
        item['key'] = accessorValues.join('-');
        innerMarkArray.push(item);
      });
      marksArray.push(innerMarkArray);
    });
  }

  // step 1b: map d3 label selections in preperation for vega-label, a single label selection
  if (labelSelection) {
    labelSelection.each((d, i, n) => {
      const item = {};
      const textElement = n[i];
      const style = getComputedStyle(textElement);
      const fontSize = parseFloat(style.fontSize);
      const fontFamily = style.fontFamily;
      item['node'] = n[i];
      item['i'] = i;
      item['nodeName'] = textElement.nodeName;
      item['fontSize'] = fontSize; // d.fontSize in Vega
      item['font'] = style.fontFamily;
      item['text'] = textElement.textContent;
      item['sort'] = false;
      item['originalOpacity'] = 1; // should be opacity of the element ultimately
      item['datum'] = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
      textElement.getAttributeNames().forEach(attrName => {
        item[attrName] = select(textElement).attr(attrName);
      });
      item['textWidth'] =
        textElement.nodeName === 'rect'
          ? +item['width']
          : getTextWidth(textElement.textContent, fontSize, true, fontFamily);
      item['textHeight'] = textElement.nodeName === 'rect' ? +item['height'] : Math.max(fontSize - 1, 1); // clone.getBBox().height;
      const accessorValues = accessors.map(key => item['datum'][key] || 'Not Found');
      // we check our has to try and find the corresponding mark boundaries
      // if we do not find them we fall back to our label boundaries
      // but the success of this algorithm seems very reliant on mark boundaries
      item['key'] = accessorValues.join('-');
      item['boundsScope'] = boundsScope;
      const oldDataX = item['data-x'];
      const oldDataY = item['data-y'];
      if (removeOnly && item['x'] && item['y'] && !(item['keep-data-y'] === 'true')) {
        item['data-x'] = item['x'];
        item['data-y'] = item['y'];
      }
      item['markBound'] =
        boundsHash[accessorValues.join('-')] && !hideOnly // if hide only, we need to use text as is
          ? boundsHash[accessorValues.join('-')]
          : getMarkItemBounds(item);
      if (removeOnly) {
        item['data-x'] = oldDataX;
        item['data-y'] = oldDataY;
      }
      labelsArray.push(item);
    });
  }

  // step 2: create bitmaps via vega-label
  // VCC does not use avoidBaseMark or markType and leverage marksArray directly instead
  // VCC does not leverage padding yet either, defaulted to 1 for the time being
  const avoidBaseMark = false; // marksArray && marksArray.length > 0; // we only use basemark if matching markers are passed

  // console.log('calling bitmap', bitmaps, labelsArray, size, 'markType_unused', avoidBaseMark, marksArray, false, 1);
  // if we received an inputted bitmap, add to it, otherwise, create a new one from scratch
  if (bitmaps && bitmaps.length === 2 && !removeOnly && !suppressMarkDraw) {
    addToBitmap(bitmaps, labelsArray, size, 'markType_unused', avoidBaseMark, marksArray, false, 1);
  } else if (!removeOnly && !suppressMarkDraw) {
    bitmaps = prepareBitmap(labelsArray, size, 'markType_unused', avoidBaseMark, marksArray, false, 1);
  }

  // useful examples and debugging info from vega-label
  // this call is an example that will only draw marks into the bitmap and not place any labels
  // const bitmaps =  prepareBitmap([], size, 'markType_unused', true, marksArray, false, 1);

  // this call is an example that will ignore any base marks passed to the util
  // const bitmaps = prepareBitmap(labelsArray, size, 'circle', false, [], false, 1);

  // debugging code
  // printBitMap(bitmaps[0], 'bitmap-render'); // debug the bitmap being created
  // console.log('getting bitmap', bitmaps, labelsArray, marksArray);

  // step 3: place or hide labels...
  // alignMap is used to reset the text anchor based on the position result from the
  // occupancy bitmap check
  const alignMap = {
    right: 'end',
    center: 'middle',
    left: 'start'
  };

  const anchorPositions = anchors.map(anchor => anchorTextToNumber[anchor]);
  const labelPlacer = new LabelPlacer(bitmaps, size, anchorPositions, offsets);
  const attributeHash = {};
  if (removeOnly) {
    // removeOnly will circumvent anything done below as it relates to stuff outside
    // of this utility
    labelsArray.forEach((item, i) => {
      const itemKey = item.key === 'Not Found' ? i : `${item.i}-${item.key}`;
      // console.log('remove-item-from-bitmap', item.i, item.key, item);

      // call the bitmap remover function we added (tweaked copy of .place())
      // we only do this if the label was not already hidden
      if (item['data-label-hidden'] !== 'true') labelPlacer.unplace(item);

      // we don't do anything when we remove from bitmap only
      attributeHash[itemKey] = {
        'do-nothing': true
      };
    });
  } else {
    labelsArray.forEach((item, i) => {
      // this handles when we don't have a data match
      // requires the lowest level selection in d3
      const itemKey = item.key === 'Not Found' ? i : `${item.i}-${item.key}`;
      if (item['data-hidden'] === 'true') {
        // console.log('data-hidden', item.i, item.key, item);
        attributeHash[itemKey] = {
          'do-nothing': true
        };
      } else if (+item['opacity'] === 0) {
        // console.log('opacity-0', item);
        attributeHash[itemKey] = {
          'do-nothing': true
        };
      } else if (!item['data-hidden'] && labelPlacer.place(item)) {
        // console.log(
        //   'placing node',
        //   i,
        //   item.key,
        //   item.key === 'Not Found' ? i : item.key,
        //   item,
        //   item.baseline === 'top'
        //     ? item['textHeight']
        //     : item.baseline === 'bottom'
        //     ? -item['textHeight'] / 5
        //     : item['textHeight'] / 3,
        //   select(item.node).attr('x'),
        //   item.x,
        //   select(item.node).attr('y'),
        //   item.y
        // );
        attributeHash[itemKey] = {
          visibility: null,
          x: item.x,
          y: item.y,
          translateX: !+item['data-translate-x'] ? 0 : +item['data-translate-x'],
          translateY: !+item['data-translate-y'] ? 0 : +item['data-translate-y'],
          // this adjusts the placement of text based on LabelPlacer logic from vega-label
          translateHeight: !item['data-no-text-anchor']
            ? item.baseline === 'top'
              ? +item['textHeight'] //  / 3
              : item.baseline === 'middle'
              ? +item['textHeight'] / 3
              : 0
            : 0,
          'text-anchor': !item['data-no-text-anchor'] ? alignMap[item.align] : null,
          'data-align': item.align,
          'data-baseline': item.baseline,
          'data-label-moved': true,
          'data-label-hidden': false,
          textHeight: item.textHeight
        };
        // we will have to place item here based on whats comes back
      } else {
        // console.log('hiding node', i, item.key, item.key === 'Not Found' ? i : item.key, item);
        attributeHash[itemKey] = {
          visibility: 'hidden',
          x: item.x,
          y: item.y,
          translateX: !+item['data-translate-x'] ? 0 : +item['data-translate-x'],
          translateY: !+item['data-translate-y'] ? 0 : +item['data-translate-y'],
          // this adjusts the placement of text based on LabelPlacer logic from vega-label
          translateHeight: !item['data-no-text-anchor']
            ? item.baseline === 'top'
              ? +item['textHeight'] //  / 3
              : item.baseline === 'middle'
              ? +item['textHeight'] / 3
              : 0
            : 0,
          'text-anchor': !item['data-no-text-anchor'] ? alignMap[item.align] : null,
          'data-align': item.align,
          'data-baseline': item.baseline,
          textHeight: item.textHeight,
          'data-label-moved': true,
          'data-label-hidden': true
        };
      }
    });

    // now that we are done we set the selection values onto the transition
    labelSelection.style('visibility', (d, i, n) => {
      const innerD = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
      const accessorValues = accessors.map(key => innerD[key] || 'Not Found');
      const attributes =
        accessorValues.join('-') === 'Not Found' ? attributeHash[i] : attributeHash[`${i}-${accessorValues.join('-')}`];
      // first we check if we are not supposed to do anything
      if (accessors && accessors.length && attributes && attributes['do-nothing']) {
        // console.log('we are in do nothing', i, d, n[i], attributes);
        return select(n[i]).style('visibility');
      } else {
        // console.log('we are in do something', i, d, n[i], attributes);
        // if we get past that, then we can apply visibility update
        select(n[i])
          .attr('data-label-hidden', accessors && accessors.length && attributes && attributes['data-label-hidden'])
          .attr('data-label-moved', accessors && accessors.length && attributes && attributes['data-label-moved'])
          .attr('data-align', attributes['data-align'])
          .attr('data-baseline', attributes['data-baseline'])
          .attr('dx', !(select(n[i]).attr('data-use-dx') === 'true') ? null : select(n[i]).attr('dx'))
          .attr('dy', !(select(n[i]).attr('data-use-dy') === 'true') ? null : select(n[i]).attr('dy'))
          .attr('data-use-dx', null)
          .attr('data-use-dy', null); // we may still need these, but it was causing a blip of placement on world-map during hideOnly mode
        return accessors && accessors.length && attributes && (attributes.visibility === null || !attributes.visibility)
          ? null
          : 'hidden';
      }
    });
    // we only update placement if hideOnly is not passed/truthy, which should be default
    // matching the selection to the array above has lead to a lot of repeated code
    // we can likely improve the performance, conciseness and readibility of this code
    // in future revisions
    if (!hideOnly) {
      labelSelection
        // .each((d, i, n) => {
        //   const innerD = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
        //   const accessorValues = accessors.map(key => innerD[key] || 'Not Found');
        //   const attributes =
        //     accessorValues.join('-') === 'Not Found'
        //       ? attributeHash[i]
        //       : attributeHash[`${i}-${accessorValues.join('-')}`];
        // this is more concise, but since it is a different selection it doesn't transition
        // we would have to get transition info from the passed selection somehow to do it this way
        // select(n[i])
        // .transition('collision-update') // this does not work
        // .ease(labelSelection.ease())
        // .duration(labelSelection.duration())
        // .style('visibility', attributes && attributes.visibility === null ? null : 'hidden')
        // .attr('x', attributes && attributes.x ? attributes.x : select(n[i]).attr('x'))
        // .attr('y', attributes && attributes.y ? attributes.y : select(n[i]).attr('y'))
        // .attr('dx', (_, i, n) => (!select(n[i]).attr('data-use-dx') ? null : select(n[i]).attr('dx')))
        // .attr('dy', (_, i, n) => (!select(n[i]).attr('data-use-dy') ? null : select(n[i]).attr('dy')));
        // })
        .attr('x', (d, i, n) => {
          const innerD = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
          const accessorValues = accessors.map(key => innerD[key] || 'Not Found');
          const attributes =
            accessorValues.join('-') === 'Not Found'
              ? attributeHash[i]
              : attributeHash[`${i}-${accessorValues.join('-')}`];
          // console.log('checking stuff', n[i], accessorValues, attributeHash, attributes, accessors && accessors.length && attributes && attributes.x);
          return accessors && accessors.length && attributes && attributes.x
            ? attributes.x - attributes.translateX
            : select(n[i]).attr('data-x');
        })
        .attr('y', (d, i, n) => {
          const innerD = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
          const accessorValues = accessors.map(key => innerD[key] || 'Not Found');
          const attributes =
            accessorValues.join('-') === 'Not Found'
              ? attributeHash[i]
              : attributeHash[`${i}-${accessorValues.join('-')}`];
          const translateTextHeight = accessors && accessors.length && attributes && attributes['translateHeight'];
          return accessors && accessors.length && attributes && attributes.y
            ? attributes.y - attributes.translateY + translateTextHeight
            : select(n[i]).attr('data-y');
        })
        .attr('text-anchor', (d, i, n) => {
          const innerD = d && d.data && d.data.data ? d.data.data : d && d.data ? d.data : d ? d : {};
          const accessorValues = accessors.map(key => innerD[key] || 'Not Found');
          const attributes =
            accessorValues.join('-') === 'Not Found'
              ? attributeHash[i]
              : attributeHash[`${i}-${accessorValues.join('-')}`];
          return accessors && accessors.length && attributes && attributes['text-anchor']
            ? attributes['text-anchor']
            : select(n[i]).attr('text-anchor');
        });
    }
  }
  // this print is super userful for debugging, it is coupled with the commented out
  // canvas element on each VCC component
  // printBitMap(bitmaps[0], 'bitmap-render');
  return bitmaps;
};

// function created for VCC to get the 6 point bounds for vega-label algorithm
export const getMarkItemBounds = markItem => {
  const translateX = !+markItem['data-translate-x'] ? 0 : +markItem['data-translate-x'];
  const translateY = !+markItem['data-translate-y'] ? 0 : +markItem['data-translate-y'];
  switch (markItem['nodeName']) {
    case 'text':
      // this could come through as textWidth or data-width depending on the component
      const textWidth = (!markItem['textWidth'] ? +markItem['data-width'] : +markItem['textWidth']) || 0;
      const textHeight = (!markItem['textHeight'] ? +markItem['data-height'] : +markItem['textHeight']) || 0;
      const fontSize = +markItem['fontSize'] || textHeight; // if we have textHeight, we should always have fontSize
      const translateTextAnchor = markItem['data-text-anchor'] // if data-text-anchor is passed, we need to use it first
        ? !markItem['data-text-anchor'] || markItem['data-text-anchor'] === 'start'
          ? 0
          : markItem['data-text-anchor'] === 'middle'
          ? textWidth / 2
          : textWidth
        : markItem['text-anchor']
        ? !markItem['text-anchor'] || markItem['text-anchor'] === 'start'
          ? 0
          : markItem['text-anchor'] === 'middle'
          ? textWidth / 2
          : textWidth
        : 0;
      const dx =
        markItem['data-use-dx'] !== 'true'
          ? 0
          : +markItem['dx']
          ? +markItem['dx']
          : markItem['dx'] && markItem['dx'].indexOf('em') >= 0
          ? +markItem['dx'].replace('em', '') * fontSize
          : 0;
      const dy =
        markItem['data-use-dy'] !== 'true'
          ? 0
          : +markItem['dy']
          ? +markItem['dy']
          : markItem['dy'] && markItem['dy'].indexOf('em') >= 0
          ? +markItem['dy'].replace('em', '') * fontSize
          : 0;

      // console.log('creating text bounds for', markItem, textHeight, textWidth, translateTextAnchor);
      switch (markItem['boundsScope']) {
        case 'centroid':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight / 2
          ];
        case 'top':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-y'] + dy + translateY,
            +markItem['data-y'] + dy + translateY,
            +markItem['data-y'] + dy + translateY
          ];
        case 'middle':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight / 2
          ];
        case 'bottom':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-y'] + dy + translateY + textHeight,
            +markItem['data-y'] + dy + translateY + textHeight,
            +markItem['data-y'] + dy + translateY + textHeight
          ];
        case 'center':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-y'] + dy + translateY,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight
          ];
        case 'right':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-y'] + dy + translateY,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight
          ];
        case 'left':
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-y'] + dy + translateY,
            +markItem['data-y'] + dy + translateY + textHeight / 2,
            +markItem['data-y'] + dy + translateY + textHeight
          ];
        default:
          // for default bounds we push text up as this matches how text is rendered on DOM based on bottom left corner
          return [
            +markItem['data-x'] + dx + translateX - translateTextAnchor,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
            +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
            +markItem['data-y'] + dy + translateY - textHeight,
            +markItem['data-y'] + dy + translateY - textHeight / 2,
            +markItem['data-y'] + dy + translateY
          ];
        // return [ // this will render text with the location centered on the Y axis
        //   +markItem['data-x'] + dx + translateX - translateTextAnchor,
        //   +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth / 2,
        //   +markItem['data-x'] + dx + translateX - translateTextAnchor + textWidth,
        //   +markItem['data-y'] + dy + translateY - textHeight / 2,
        //   +markItem['data-y'] + dy + translateY,
        //   +markItem['data-y'] + dy + translateY + textHeight / 2
        // ];
      }
    case 'circle': // cx/cy is center point
      return [
        +markItem['data-cx'] + translateX - +markItem['data-r'],
        +markItem['data-cx'] + translateX,
        +markItem['data-cx'] + translateX + +markItem['data-r'],
        +markItem['data-cy'] + translateY - +markItem['data-r'],
        +markItem['data-cy'] + translateY,
        +markItem['data-cy'] + translateY + +markItem['data-r']
      ];
    case 'rect': // x/y is top left corner
      switch (markItem['boundsScope']) {
        case 'annotation':
          return [
            +markItem['data-x'] + translateX - +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-y'] + translateY - +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2
          ];
        case 'top':
          return [
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY
          ];
        case 'middle':
          return [
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2
          ];
        case 'bottom':
          return [
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-y'] + translateY + +markItem['data-height'] - 6,
            +markItem['data-y'] + translateY + +markItem['data-height'] - 6,
            +markItem['data-y'] + translateY + +markItem['data-height'] - 6
          ];
        case 'right':
          return [
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height']
          ];
        case 'left':
          return [
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX,
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height']
          ];
        default:
          return [
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
            +markItem['data-x'] + translateX + +markItem['data-width'],
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
            +markItem['data-y'] + translateY + +markItem['data-height']
          ];
      }
    case 'path':
      // console.log('we are getting path bounds', markItem);
      return +markItem['data-fake-x']
        ? [
            +markItem['data-fake-x'] + translateX - (+markItem['data-r'] || 0),
            +markItem['data-fake-x'] + translateX,
            +markItem['data-fake-x'] + translateX + (+markItem['data-r'] || 0),
            +markItem['data-fake-y'] + translateY - (+markItem['data-r'] || 0),
            +markItem['data-fake-y'] + translateY,
            +markItem['data-fake-y'] + translateY + (+markItem['data-r'] || 0)
          ]
        : +markItem['data-centerX1']
        ? [
            +markItem['data-centerX1'] + translateX,
            +markItem['data-centerX1'] + (+markItem['data-centerX2'] - +markItem['data-centerX1']) / 2 + translateX,
            +markItem['data-centerX2'] + translateX,
            +markItem['data-centerY1'] + translateY,
            +markItem['data-centerY1'] + (+markItem['data-centerY2'] - +markItem['data-centerY1']) / 2 + translateY,
            +markItem['data-centerY2'] + translateY
          ]
        : [
            +markItem['data-x'] + translateX - (+markItem['data-r'] || 0),
            +markItem['data-x'] + translateX,
            +markItem['data-x'] + translateX + (+markItem['data-r'] || 0),
            +markItem['data-y'] + translateY - (+markItem['data-r'] || 0),
            +markItem['data-y'] + translateY,
            +markItem['data-y'] + translateY + (+markItem['data-r'] || 0)
          ];
    default:
      // we should not really be hitting default with anything at this point
      return [
        +markItem['data-x'] + translateX,
        +markItem['data-x'] + translateX + +markItem['data-width'] / 2,
        +markItem['data-x'] + translateX + +markItem['data-width'],
        +markItem['data-y'] + translateY,
        +markItem['data-y'] + translateY + +markItem['data-height'] / 2,
        +markItem['data-y'] + translateY + +markItem['data-height']
      ];
    // remove bbox from algorithm because it is slow and we don't need it
    // return [
    //   bbox.x,
    //   bbox.x + bbox.width / 2.0,
    //   bbox.x + bbox.width,
    //   bbox.y,
    //   bbox.y + bbox.height / 2.0,
    //   bbox.y + bbox.height
    // ];
  }
};
