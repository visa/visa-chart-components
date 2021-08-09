/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export function transitionEndAll(transition, callback, noTransition?) {
  if (noTransition) {
    callback.apply(this, arguments);
  } else {
    var n = 0;
    transition
      .each(function() {
        ++n;
      })
      .on('end', function() {
        if (!--n) callback.apply(this, arguments);
      });
  }
}
