/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

/* This file includes code covered by the following notice */
/**
 * Copyright (c) 2016, University of Washington Interactive Data Lab
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *   may be used to endorse or promote products derived from this software
 *   without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

/*eslint no-fallthrough: "warn" */
/*eslint no-console: "warn"*/
// import {Marks} from 'vega-scenegraph';
import pathParse from './utils/pathParse';
import pathRender from './utils/pathRender';

const DIV = 0x5;
const MOD = 0x1f;
const SIZE = 0x20;
const right0 = new Uint32Array(SIZE + 1);
const right1 = new Uint32Array(SIZE + 1);

right1[0] = 0x0;
right0[0] = ~right1[0];
for (let i = 1; i <= SIZE; i++) {
  right1[i] = (right1[i - 1] << 0x1) | 0x1;
  right0[i] = ~right1[i];
}

function applyMark(array, index, mask) {
  array[index] |= mask;
}

function applyUnmark(array, index, mask) {
  array[index] &= mask;
}

export default class BitMap {
  constructor(width, height, padding) {
    this.pixelRatio = Math.sqrt((width * height) / 1000000.0);

    // bound pixelRatio to be not less than 1
    if (this.pixelRatio < 1) {
      this.pixelRatio = 1;
    }

    this.padding = padding;

    this.width = ~~((width + 2 * padding + this.pixelRatio) / this.pixelRatio);
    this.height = ~~((height + 2 * padding + this.pixelRatio) / this.pixelRatio);

    this.array = new Uint32Array(~~((this.width * this.height + SIZE) / SIZE));
  }

  /**
   * Get pixel ratio between real size and bitmap size
   * @returns pixel ratio between real size and bitmap size
   */
  getPixelRatio() {
    return this.pixelRatio;
  }

  /**
   * Scale real pixel in the chart into bitmap pixel
   * @param realPixel the real pixel to be scaled down
   * @returns scaled pixel
   */
  scalePixel(realPixel) {
    return ~~((realPixel + this.padding) / this.pixelRatio);
  }

  markScaled(x, y) {
    const mapIndex = y * this.width + x;
    applyMark(this.array, mapIndex >>> DIV, 1 << (mapIndex & MOD));
  }

  mark(x, y) {
    this.markScaled(this.scalePixel(x), this.scalePixel(y));
  }

  unmarkScaled(x, y) {
    const mapIndex = y * this.width + x;
    applyUnmark(this.array, mapIndex >>> DIV, ~(1 << (mapIndex & MOD)));
  }

  unmark(x, y) {
    this.unmarkScaled(this.scalePixel(x), this.scalePixel(y));
  }

  getScaled(x, y) {
    const mapIndex = y * this.width + x;
    return this.array[mapIndex >>> DIV] & (1 << (mapIndex & MOD));
  }

  get(x, y) {
    return this.getScaled(this.scalePixel(x), this.scalePixel(y));
  }

  markInRangeScaled(x, y, x2, y2) {
    let start, end, indexStart, indexEnd;
    for (; y <= y2; y++) {
      start = y * this.width + x;
      end = y * this.width + x2;
      indexStart = start >>> DIV;
      indexEnd = end >>> DIV;
      if (indexStart === indexEnd) {
        applyMark(this.array, indexStart, right0[start & MOD] & right1[(end & MOD) + 1]);
      } else {
        applyMark(this.array, indexStart, right0[start & MOD]);
        applyMark(this.array, indexEnd, right1[(end & MOD) + 1]);

        for (let i = indexStart + 1; i < indexEnd; i++) {
          applyMark(this.array, i, 0xffffffff);
        }
      }
    }
  }

  markInRange(x, y, x2, y2) {
    return this.markInRangeScaled(this.scalePixel(x), this.scalePixel(y), this.scalePixel(x2), this.scalePixel(y2));
  }

  unmarkInRangeScaled(x, y, x2, y2) {
    let start, end, indexStart, indexEnd;
    for (; y <= y2; y++) {
      start = y * this.width + x;
      end = y * this.width + x2;
      indexStart = start >>> DIV;
      indexEnd = end >>> DIV;
      if (indexStart === indexEnd) {
        applyUnmark(this.array, indexStart, right1[start & MOD] | right0[(end & MOD) + 1]);
      } else {
        applyUnmark(this.array, indexStart, right1[start & MOD]);
        applyUnmark(this.array, indexEnd, right0[(end & MOD) + 1]);

        for (let i = indexStart + 1; i < indexEnd; i++) {
          applyUnmark(this.array, i, 0x0);
        }
      }
    }
  }

  unmarkInRange(x, y, x2, y2) {
    return this.unmarkInRangeScaled(this.scalePixel(x), this.scalePixel(y), this.scalePixel(x2), this.scalePixel(y2));
  }

  getInRangeScaled(x, y, x2, y2) {
    let start, end, indexStart, indexEnd;
    for (; y <= y2; y++) {
      start = y * this.width + x;
      end = y * this.width + x2;
      indexStart = start >>> DIV;
      indexEnd = end >>> DIV;
      if (indexStart === indexEnd) {
        if (this.array[indexStart] & right0[start & MOD] & right1[(end & MOD) + 1]) {
          return true;
        }
      } else {
        if (this.array[indexStart] & right0[start & MOD]) {
          return true;
        }
        if (this.array[indexEnd] & right1[(end & MOD) + 1]) {
          return true;
        }

        for (let i = indexStart + 1; i < indexEnd; i++) {
          if (this.array[i]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getInRange(x, y, x2, y2) {
    return this.getInRangeScaled(this.scalePixel(x), this.scalePixel(y), this.scalePixel(x2), this.scalePixel(y2));
  }

  searchOutOfBound(x, y, x2, y2) {
    return x < 0 || y < 0 || y2 >= this.height || x2 >= this.width;
  }
}

// static function

// bit mask for getting first 2 bytes of alpha value
const ALPHA_MASK = 0xff000000;

// alpha value equivalent to opacity 0.0625
const INSIDE_OPACITY_IN_ALPHA = 0x10000000;
const INSIDE_OPACITY = 0.0625;

/**
 * Get bitmaps and fill the with mark information from data
 * @param {array} data data of labels to be placed
 * @param {array} size size of chart in format [width, height]
 * @param {string} marktype marktype of the base mark
 * @param {bool} avoidBaseMark a flag if base mark is to be avoided
 * @param {array} avoidMarks array of mark data to be avoided
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 * @param {number} padding padding from the boundary of the chart
 *
 * @returns array of 2 bitmaps:
 *          - first bitmap is filled with all the avoiding marks
 *          - second bitmap is filled with borders of all the avoiding marks (second bit map can be
 *            undefined if checking border of base mark is not needed when not avoiding any mark)
 */
export function prepareBitmap(data, size, marktype, avoidBaseMark, avoidMarks, labelInside, padding) {
  const isGroupArea = false; // VCC does not have group/area - marktype === 'group' && data[0].datum.datum.items[0].marktype === 'area';
  const width = size[0];
  const height = size[1];
  const n = data.length;

  // for VCC we do not need these step as marks are already passed into this function
  // vs pulled from the Vega spec
  // extract data information from base mark when base mark is to be avoid
  // or base mark is implicitly avoid when base mark is group area
  // if (marktype && (avoidBaseMark || isGroupArea)) {
  //   const items = new Array(n);
  //   for (let i = 0; i < n; i++) {
  //     items[i] = data[i].datum.datum;
  //   }
  //   avoidMarks.push(items);
  // }

  if (avoidMarks.length) {
    // when there is at least one mark to be avoided
    const context = writeToCanvas(avoidMarks, width, height, labelInside || isGroupArea);
    return writeToBitMaps(context, width, height, labelInside, isGroupArea, padding);
  } else {
    const bitMap = new BitMap(width, height, padding);
    if (avoidBaseMark) {
      // when there is no base mark but data points are to be avoided
      for (let i = 0; i < n; i++) {
        const d = data[i];
        bitMap.mark(d.markBound[0], d.markBound[3]);
      }
    }
    return [bitMap, undefined];
  }
}

/**
 * Get bitmaps and fill the with mark information from data
 * @param {array} bitmaps pre-created bitmaps to specifically add content too
 * @param {array} data data of labels to be placed
 * @param {array} size size of chart in format [width, height]
 * @param {string} marktype marktype of the base mark
 * @param {bool} avoidBaseMark a flag if base mark is to be avoided
 * @param {array} avoidMarks array of mark data to be avoided
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 * @param {number} padding padding from the boundary of the chart
 *
 * @returns array of 2 bitmaps:
 *          - first bitmap is filled with all the avoiding marks
 *          - second bitmap is filled with borders of all the avoiding marks (second bit map can be
 *            undefined if checking border of base mark is not needed when not avoiding any mark)
 */
export function addToBitmap(bitmaps, data, size, marktype, avoidBaseMark, avoidMarks, labelInside, padding) {
  const isGroupArea = false; // VCC does not have group/area - marktype === 'group' && data[0].datum.datum.items[0].marktype === 'area';
  const width = size[0];
  const height = size[1];
  const n = data.length;

  if (avoidMarks.length) {
    // when there is at least one mark to be avoided
    const context = writeToCanvas(avoidMarks, width, height, labelInside || isGroupArea);
    return writeToPassedBitMaps(context, bitmaps, width, height, labelInside, isGroupArea, padding);
  } else {
    if (avoidBaseMark) {
      // when there is no base mark but data points are to be avoided
      for (let i = 0; i < n; i++) {
        const d = data[i];
        bitmaps[0].mark(d.markBound[0], d.markBound[3]);
      }
    }
    return bitmaps;
  }
}

/**
 * Write avoid marks from drawn canvas to bitmap
 * @param {object} context canvas context, to which all avoiding marks are drawn
 * @param {array} bitmaps pre-created bitmaps to specifically add content too
 * @param {number} width width of the chart
 * @param {number} height height of the chart
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 * @param {bool} isGroupArea a flag if the base mark if group area
 * @param {number} padding padding from the boundary of the chart
 *
 * @returns array of 2 bitmaps:
 *          - first bitmap is filled with all the avoiding marks
 *          - second bitmap is filled with borders of all the avoiding marks
 */
function writeToPassedBitMaps(context, bitmaps, width, height, labelInside, isGroupArea, padding) {
  const imageData = context.getImageData(0, 0, width, height);
  const canvasBuffer = new Uint32Array(imageData.data.buffer);
  let x, y, alpha;

  if (isGroupArea) {
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        alpha = canvasBuffer[y * width + x] & ALPHA_MASK;
        // only fill second layer for group area because labels are only not allowed to place over
        // border of area
        if (alpha && alpha ^ INSIDE_OPACITY_IN_ALPHA) {
          bitmaps[1].mark(x, y);
        }
      }
    }
  } else {
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        alpha = canvasBuffer[y * width + x] & ALPHA_MASK;
        if (alpha) {
          // fill first layer if there is something in canvas in that location
          bitmaps[0].mark(x, y);

          // fill second layer if there is a border in canvas in that location
          // and label can be placed inside
          if (labelInside && alpha ^ INSIDE_OPACITY_IN_ALPHA) {
            bitmaps[1].mark(x, y);
          }
        }
      }
    }
  }
  return bitmaps;
}

/**
 * Write marks to be avoided to canvas to be written to bitmap later
 * @param {array} avoidMarks array of mark data to be avoided
 * @param {number} width width of the chart
 * @param {number} height height of the chart
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 *
 * @returns canvas context, to which all avoiding marks are drawn
 */
function writeToCanvas(avoidMarks, width, height, labelInside) {
  const m = avoidMarks.length;
  // const c = document.getElementById('canvas-render'); // debugging canvas
  const c = document.createElement('canvas');
  const context = c.getContext('2d');
  let originalItems, itemsLen;
  c.setAttribute('width', width);
  c.setAttribute('height', height);

  // draw every avoiding marks into canvas
  for (let i = 0; i < m; i++) {
    originalItems = avoidMarks[i];
    itemsLen = originalItems.length;
    if (!itemsLen) {
      continue;
    }

    // need to update this to work off VCC polyfill of Vega specification
    // if (originalItems[0].mark.marktype !== 'group') {
    if (originalItems[0].nodeName !== 'group') {
      drawMark(context, originalItems, labelInside);
    } else {
      drawGroup(context, originalItems, labelInside);
    }
  }

  return context;
}

/**
 * Write avoid marks from drawn canvas to bitmap
 * @param {object} context canvas context, to which all avoiding marks are drawn
 * @param {number} width width of the chart
 * @param {number} height height of the chart
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 * @param {bool} isGroupArea a flag if the base mark if group area
 * @param {number} padding padding from the boundary of the chart
 *
 * @returns array of 2 bitmaps:
 *          - first bitmap is filled with all the avoiding marks
 *          - second bitmap is filled with borders of all the avoiding marks
 */
function writeToBitMaps(context, width, height, labelInside, isGroupArea, padding) {
  const layer1 = new BitMap(width, height, padding);
  const layer2 = (labelInside || isGroupArea) && new BitMap(width, height, padding);
  const imageData = context.getImageData(0, 0, width, height);
  const canvasBuffer = new Uint32Array(imageData.data.buffer);
  let x, y, alpha;

  if (isGroupArea) {
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        alpha = canvasBuffer[y * width + x] & ALPHA_MASK;
        // only fill second layer for group area because labels are only not allowed to place over
        // border of area
        if (alpha && alpha ^ INSIDE_OPACITY_IN_ALPHA) {
          layer2.mark(x, y);
        }
      }
    }
  } else {
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        alpha = canvasBuffer[y * width + x] & ALPHA_MASK;
        if (alpha) {
          // fill first layer if there is something in canvas in that location
          layer1.mark(x, y);

          // fill second layer if there is a border in canvas in that location
          // and label can be placed inside
          if (labelInside && alpha ^ INSIDE_OPACITY_IN_ALPHA) {
            layer2.mark(x, y);
          }
        }
      }
    }
  }
  return [layer1, layer2];
}

/**
 * Draw mark into canvas
 * @param {object} context canvas context, to which all avoiding marks are drawn
 * @param {array} originalItems mark to be drawn into canvas
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 */
function drawMark(context, originalItems, labelInside) {
  const n = originalItems.length;
  let items;
  if (labelInside) {
    items = new Array(n);
    for (let i = 0; i < n; i++) {
      items[i] = prepareMarkItem(originalItems[i]);
    }
  } else {
    items = originalItems;
  }

  // draw items into canvas
  items.forEach(item => drawCanvasShape(context, item));
  // Marks[items[0].mark.marktype].draw(context, {items: items}, null);
}

/**
 * draw group of marks into canvas
 * @param {object} context canvas context, to which all avoiding marks are drawn
 * @param {array} groups group of marks to be drawn into canvas
 * @param {bool} labelInside a flag if label to be placed inside mark or not
 */
function drawGroup(context, groups, labelInside) {
  const n = groups.length;
  let marks;
  for (let i = 0; i < n; i++) {
    marks = groups[i].items;
    for (let j = 0; j < marks.length; j++) {
      const g = marks[j];
      if (g.marktype !== 'group') {
        drawMark(context, g.items, labelInside);
      } else {
        // recursivly draw group of marks
        drawGroup(context, g.items, labelInside);
      }
    }
  }
}

/**
 * Prepare item before drawing into canvas (setting stroke and opacity)
 * @param {object} originalItem item to be prepared
 *
 * @returns prepared item
 */
function prepareMarkItem(originalItem) {
  const item = {};
  for (const key in originalItem) {
    item[key] = originalItem[key];
  }
  if (item.stroke) {
    item.strokeOpacity = 1;
  }

  if (item.fill) {
    item.fillOpacity = INSIDE_OPACITY;
    item.stroke = '#000';
    item.strokeOpacity = 1;
    item.strokeWidth = 2;
  }
  return item;
}

// debugging tools

export function printBitMap(bitmap, id) {
  if (!arguments.length) {
    id = 'bitmap-render';
  }

  let x, y;
  const canvas = document.getElementById(id);
  if (!canvas) {
    return;
  }

  canvas.setAttribute('width', bitmap.width);
  canvas.setAttribute('height', bitmap.height);
  const ctx = canvas.getContext('2d');
  for (y = 0; y < bitmap.height; y++) {
    for (x = 0; x < bitmap.width; x++) {
      if (bitmap.getScaled(x, y)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

export function printBitMapContext(bitmap, ctx) {
  let x, y;
  for (y = 0; y < bitmap.height; y++) {
    for (x = 0; x < bitmap.width; x++) {
      if (bitmap.getScaled(x, y)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

// VCC replacement for vega-label's Marks[items[0].mark.marktype].draw(context, {items: items}, null);
// this is where we are different than Vega and can simplify drawing shapes on canvas
function drawCanvasShape(context, item) {
  const translateX = !+item['data-translate-x'] ? 0 : +item['data-translate-x'];
  const translateY = !+item['data-translate-y'] ? 0 : +item['data-translate-y'];
  const dx = item['data-use-dx'] === 'true' && +item['dx'] ? +item['dx'] : 0;
  const dy = item['data-use-dy'] === 'true' && +item['dy'] ? +item['dy'] : 0;
  context.beginPath();
  // hoping we can just pass labels as rects as well for the time being?
  if (item.nodeName === 'rect') {
    // console.log('drawing rect to canvas', item, translateX, translateY);
    context.rect(+item['data-x'] + translateX, +item['data-y'] + translateY, +item['data-width'], +item['data-height']);
    context.stroke();
    if (item['data-fill'] && item['data-fill'] === 'true') context.fill();
  } else if (item.nodeName === 'text') {
    // when drawing to canvas, we need to take into account text anchor
    const translateTextAnchor = item['text-anchor']
      ? !item['text-anchor'] || item['text-anchor'] === 'start'
        ? 0
        : item['text-anchor'] === 'middle'
        ? item['data-width'] / 2
        : item['data-width']
      : 0;
    // when drawing canvas, we need to take into account the baseline set by vega-label
    const translateTextHeight =
      item['baseline'] && false
        ? item['baseline'] === 'top'
          ? +item['data-height']
          : item['baseline'] === 'middle'
          ? +item['data-height'] / 3
          : 0
        : 0;
    // console.log('drawing text to canvas', item, translateX, translateTextAnchor, dx, translateY, dy);
    context.rect(
      +item['data-x'] + translateX - translateTextAnchor + dx,
      +item['data-y'] + translateY + translateTextHeight + dy,
      +item['data-width'],
      +item['data-height']
    );
    context.stroke();
    if (item['data-fill'] && item['data-fill'] === 'true') context.fill();
  } else if (item.nodeName === 'circle') {
    context.arc(+item['data-cx'] + translateX, +item['data-cy'] + translateY, +item['data-r'], 0, 2 * Math.PI);
    context.stroke();
    if (item['data-fill'] && item['data-fill'] === 'true') context.fill();
  } else if (item.nodeName === 'line') {
    context.moveTo(+item['data-x1'] + translateX, +item['data-y1'] + translateY);
    context.lineTo(+item['data-x2'] + translateX, +item['data-y2'] + translateY);
    context.stroke();
  } else if (item.nodeName === 'path') {
    const parsed = pathParse(item['data-d']);
    const l = (+item['data-x'] || 0) + translateX;
    const t = (+item['data-y'] || 0) + translateY;
    const sX = +item['data-r'] || 1;
    const sY = sX;
    // console.log('drawing path to canvas', item, translateX, translateY, parsed);
    pathRender(context, parsed, l, t, sX, sY); // Math.sqrt(size) / 2);
    context.stroke();
    if (item['data-fill'] && item['data-fill'] === 'true') context.fill();
  }
  context.closePath();
}
