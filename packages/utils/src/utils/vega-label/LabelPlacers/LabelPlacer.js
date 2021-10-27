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

/*eslint no-console: "warn"*/
/*eslint no-empty: "warn"*/
import { canvas } from 'vega-canvas';
import { labelWidth, checkCollision } from './Common';

const SIZE_FACTOR = 0.707106781186548; // this is 1 over square root of 2

// Options for align
const ALIGN = ['right', 'center', 'left'];

// Options for baseline
const BASELINE = ['bottom', 'middle', 'top'];

export default class LabelPlacer {
  constructor(bitmaps, size, anchors, offsets) {
    this.bm0 = bitmaps[0];
    this.bm1 = bitmaps[1];
    this.width = size[0];
    this.height = size[1];
    this.anchors = anchors;
    this.offsets = offsets;
  }

  place(d) {
    // do we need this check for VCC?
    const mb = d.markBound;
    // can not be placed if the mark is not visible in the graph bound
    if (mb[2] < 0 || mb[5] < 0 || mb[0] > this.width || mb[3] > this.height) {
      return false;
    }

    const context = canvas().getContext('2d');
    const n = this.offsets.length;
    const textHeight = d.textHeight;
    const markBound = d.markBound;
    const text = d.text;
    const font = d.font;
    let textWidth = d.textWidth;
    let dx, dy, isInside, sizeFactor, insideFactor;
    let x, x1, xc, x2, y1, yc, y2;
    let _x1, _x2, _y1, _y2;

    // for each anchor and offset
    for (let i = 0; i < n; i++) {
      dx = (this.anchors[i] & 0x3) - 1; // this is used to pick anchor position x
      dy = ((this.anchors[i] >>> 0x2) & 0x3) - 1; // this is used to pick anchor position y

      isInside = this.bm1 && ((dx === 0 && dy === 0) || this.offsets[i] < 0);
      sizeFactor = dx && dy ? SIZE_FACTOR : 1;
      insideFactor = this.offsets[i] < 0 ? -1 : 1;

      yc = markBound[4 + dy] + (insideFactor * textHeight * dy) / 2.0 + this.offsets[i] * dy * sizeFactor;
      x = markBound[1 + dx] + this.offsets[i] * dx * sizeFactor;

      y1 = yc - textHeight / 2.0;
      y2 = yc + textHeight / 2.0;

      _y1 = this.bm0.scalePixel(y1);
      _y2 = this.bm0.scalePixel(y2);
      _x1 = this.bm0.scalePixel(x);

      // we are setting text width in our call, so this is not
      // really ever going to be used
      if (!textWidth) {
        // to avoid finding width of text label,
        if (!isLabelPlacable(_x1, _x1, _y1, _y2, this.bm0, this.bm1, x, x, y1, y2, markBound, isInside)) {
          // skip this anchor/offset option if fail to place the label with 1px width
          continue;
        } else {
          // Otherwise, find the label width
          textWidth = labelWidth(context, text, textHeight, font);
        }
      }

      xc = x + (insideFactor * textWidth * dx) / 2.0;
      x1 = xc - textWidth / 2.0;
      x2 = xc + textWidth / 2.0;

      _x1 = this.bm0.scalePixel(x1);
      _x2 = this.bm0.scalePixel(x2);

      // place label if the position is placable
      // VCC moves this outside of the below if statement as we need write placement
      // even if we hide label for better interactivity and transition/lifecycle experience
      d.x = !dx ? xc : dx * insideFactor < 0 ? x2 : x1;
      d.y = !dy ? yc : dy * insideFactor < 0 ? y2 : y1;

      d.align = ALIGN[dx * insideFactor + 1];
      d.baseline = BASELINE[dy * insideFactor + 1];

      if (isLabelPlacable(_x1, _x2, _y1, _y2, this.bm0, this.bm1, x1, x2, y1, y2, markBound, isInside)) {
        this.bm0.markInRangeScaled(_x1, _y1, _x2, _y2);
        return true;
      }
      // else { // debugging of failed positions
      //   this.bm0.markInRangeScaled(_x1, _y1, _x2, _y2);
      // }
    }
    return false;
  }

  unplace(d) {
    const n = this.offsets.length;
    const textHeight = d.textHeight;
    const markBound = d.markBound;
    let textWidth = d.textWidth;
    let dx, dy, sizeFactor, insideFactor;
    let x, x1, xc, x2, y1, yc, y2;
    let _x1, _x2, _y1, _y2;

    // for each anchor and offset
    for (let i = 0; i < n; i++) {
      dx = (this.anchors[i] & 0x3) - 1; // this is used to pick anchor position x
      dy = ((this.anchors[i] >>> 0x2) & 0x3) - 1; // this is used to pick anchor position y

      sizeFactor = dx && dy ? SIZE_FACTOR : 1;
      insideFactor = this.offsets[i] < 0 ? -1 : 1;

      yc = markBound[4 + dy] + (insideFactor * textHeight * dy) / 2.0 + this.offsets[i] * dy * sizeFactor;
      x = markBound[1 + dx] + this.offsets[i] * dx * sizeFactor;

      y1 = yc - textHeight / 2.0;
      y2 = yc + textHeight / 2.0;

      _y1 = this.bm0.scalePixel(y1);
      _y2 = this.bm0.scalePixel(y2);
      _x1 = this.bm0.scalePixel(x);

      xc = x + (insideFactor * textWidth * dx) / 2.0;
      x1 = xc - textWidth / 2.0;
      x2 = xc + textWidth / 2.0;

      _x1 = this.bm0.scalePixel(x1);
      _x2 = this.bm0.scalePixel(x2);

      this.bm0.unmarkInRangeScaled(_x1, _y1, _x2, _y2 + 3);
    }
    return true;
  }
}

function isLabelPlacable(_x1, _x2, _y1, _y2, bm0, bm1, x1, x2, y1, y2, markBound, isInside) {
  return !(
    bm0.searchOutOfBound(_x1, _y1, _x2, _y2) ||
    (isInside
      ? checkCollision(_x1, _y1, _x2, _y2, bm1) || !isInMarkBound(x1, y1, x2, y2, markBound)
      : checkCollision(_x1, _y1, _x2, _y2, bm0))
  );
}

function isInMarkBound(x1, y1, x2, y2, markBound) {
  return markBound[0] <= x1 && x2 <= markBound[2] && markBound[3] <= y1 && y2 <= markBound[5];
}
