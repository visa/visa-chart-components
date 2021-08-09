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

// Path parsing and rendering code adapted from fabric.js -- Thanks!
const cmdlen = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7 },
  regexp = [/([MLHVCSQTAZmlhvcsqtaz])/g, /###/, /(\.\d+)(\.\d)/g, /(\d)([-+])/g, /\s|,|###/];

export default function(pathstr) {
  const result = [];
  let curr, chunks, parsed, param, cmd, len, i, j, n, m;

  // First, break path into command sequence
  const path = pathstr
    .slice()
    .replace(regexp[0], '###$1')
    .split(regexp[1])
    .slice(1);

  // Next, parse each command in turn
  for (i = 0, n = path.length; i < n; ++i) {
    curr = path[i];
    chunks = curr
      .slice(1)
      .trim()
      .replace(regexp[2], '$1###$2')
      .replace(regexp[3], '$1###$2')
      .split(regexp[4]);
    cmd = curr.charAt(0);

    parsed = [cmd];
    for (j = 0, m = chunks.length; j < m; ++j) {
      if ((param = +chunks[j]) === param) {
        // not NaN
        parsed.push(param);
      }
    }

    len = cmdlen[cmd.toLowerCase()];
    if (parsed.length - 1 > len) {
      const m = parsed.length;
      j = 1;
      result.push([cmd].concat(parsed.slice(j, (j += len))));

      // handle implicit lineTo (#2803)
      cmd = cmd === 'M' ? 'L' : cmd === 'm' ? 'l' : cmd;

      for (; j < m; j += len) {
        result.push([cmd].concat(parsed.slice(j, j + len)));
      }
    } else {
      result.push(parsed);
    }
  }

  return result;
}
