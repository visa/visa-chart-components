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
const DegToRad = Math.PI / 180;
// const Epsilon = 1e-14;
const HalfPi = Math.PI / 2;
const Tau = Math.PI * 2;
// const HalfSqrt3 = Math.sqrt(3) / 2;

export var segmentCache = {};
export var bezierCache = {};

var join = [].join;

// Copied from Inkscape svgtopdf, thanks!
export function segments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {
  const key = join.call(arguments);
  if (segmentCache[key]) {
    return segmentCache[key];
  }

  const th = rotateX * DegToRad;
  const sin_th = Math.sin(th);
  const cos_th = Math.cos(th);
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const px = cos_th * (ox - x) * 0.5 + sin_th * (oy - y) * 0.5;
  const py = cos_th * (oy - y) * 0.5 - sin_th * (ox - x) * 0.5;
  let pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);
  if (pl > 1) {
    pl = Math.sqrt(pl);
    rx *= pl;
    ry *= pl;
  }

  const a00 = cos_th / rx;
  const a01 = sin_th / rx;
  const a10 = -sin_th / ry;
  const a11 = cos_th / ry;
  const x0 = a00 * ox + a01 * oy;
  const y0 = a10 * ox + a11 * oy;
  const x1 = a00 * x + a01 * y;
  const y1 = a10 * x + a11 * y;

  const d = (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0);
  let sfactor_sq = 1 / d - 0.25;
  if (sfactor_sq < 0) sfactor_sq = 0;
  let sfactor = Math.sqrt(sfactor_sq);
  if (sweep == large) sfactor = -sfactor;
  const xc = 0.5 * (x0 + x1) - sfactor * (y1 - y0);
  const yc = 0.5 * (y0 + y1) + sfactor * (x1 - x0);

  const th0 = Math.atan2(y0 - yc, x0 - xc);
  const th1 = Math.atan2(y1 - yc, x1 - xc);

  let th_arc = th1 - th0;
  if (th_arc < 0 && sweep === 1) {
    th_arc += Tau;
  } else if (th_arc > 0 && sweep === 0) {
    th_arc -= Tau;
  }

  const segs = Math.ceil(Math.abs(th_arc / (HalfPi + 0.001)));
  const result = [];
  for (let i = 0; i < segs; ++i) {
    const th2 = th0 + (i * th_arc) / segs;
    const th3 = th0 + ((i + 1) * th_arc) / segs;
    result[i] = [xc, yc, th2, th3, rx, ry, sin_th, cos_th];
  }

  return (segmentCache[key] = result);
}

export function bezier(params) {
  const key = join.call(params);
  if (bezierCache[key]) {
    return bezierCache[key];
  }

  var cx = params[0],
    cy = params[1],
    th0 = params[2],
    th1 = params[3],
    rx = params[4],
    ry = params[5],
    sin_th = params[6],
    cos_th = params[7];

  const a00 = cos_th * rx;
  const a01 = -sin_th * ry;
  const a10 = sin_th * rx;
  const a11 = cos_th * ry;

  const cos_th0 = Math.cos(th0);
  const sin_th0 = Math.sin(th0);
  const cos_th1 = Math.cos(th1);
  const sin_th1 = Math.sin(th1);

  const th_half = 0.5 * (th1 - th0);
  const sin_th_h2 = Math.sin(th_half * 0.5);
  const t = ((8 / 3) * sin_th_h2 * sin_th_h2) / Math.sin(th_half);
  const x1 = cx + cos_th0 - t * sin_th0;
  const y1 = cy + sin_th0 + t * cos_th0;
  const x3 = cx + cos_th1;
  const y3 = cy + sin_th1;
  const x2 = x3 + t * sin_th1;
  const y2 = y3 - t * cos_th1;

  return (bezierCache[key] = [
    a00 * x1 + a01 * y1,
    a10 * x1 + a11 * y1,
    a00 * x2 + a01 * y2,
    a10 * x2 + a11 * y2,
    a00 * x3 + a01 * y3,
    a10 * x3 + a11 * y3
  ]);
}
