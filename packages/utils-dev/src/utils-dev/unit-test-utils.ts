/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const flushTransitions = (jsDomEle, i?) => {
  // bug fix mock transform if null
  jsDomEle.transform = jsDomEle.transform ? jsDomEle.transform : { baseVal: 0, animVal: 0 };
  i = i ? i : 0; // since we are implementing this late, default to 0 if not provided

  // loop transitions and gather tweens and ends
  const transitionKeys = Object.keys(jsDomEle['__transition'] || {});
  const tweens = [];
  const ends = [];
  transitionKeys.forEach(tk => {
    const innerTweens = jsDomEle['__transition'][tk].tween;
    innerTweens.forEach(tween => {
      tweens.push(tween);
    });

    const innerEnds = jsDomEle['__transition'][tk].on._.end;
    innerEnds.forEach(end => {
      ends.push(end);
    });
  });

  // mess with timers
  const now = window.performance.now;
  window.performance.now = () => Infinity;

  // run each tween
  tweens.forEach(tween => {
    if (tween.name === 'text') {
      tween.value.bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle);
    } else if (tween.name !== 'attr.transform') {
      if (tween.value.bind(jsDomEle)()) {
        tween.value
          .bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle)
          .bind(jsDomEle)(1);
      }
    }
  });

  // run each dispatch / end
  ends.forEach(end => {
    end.value.bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle);
  });

  // reset timers when done
  window.performance.now = now;

  // remove transitions after running them
  jsDomEle['__transition'] = undefined;
};

export const parseTransform = a => {
  const b = {};
  // tslint:disable-next-line: forin
  for (const i in (a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))) {
    const c = a[i].match(/[\w\.\-]+/g);
    b[c.shift()] = c;
  }
  return b;
};

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const getTransitionDurations = jsDomEle => {
  const elementTransitions = {};

  // loop transitions and gather durations
  const transitionKeys = Object.keys(jsDomEle['__transition'] || {});
  transitionKeys.forEach(tk => {
    elementTransitions[jsDomEle['__transition'][tk].name] = jsDomEle['__transition'][tk].duration;
  });

  // return the compiled elementTransitions object
  return elementTransitions;
};

// enabling to us to ignore transforming es5 to es6
// in stencil test configuration for the specified items
export const esModules = [
  '@visa/charts-types',
  // 'd3-array',
  'd3-color',
  'd3-shape',
  'd3-path'
  // 'd3-dispatch',
  // 'd3-ease',
  // 'd3-format',
  // 'd3-interpolate',
  // 'd3-scale',
  // 'd3-selection',
  // 'd3-time',
  // 'd3-time-format',
  // 'd3-timer',
  // 'd3-transition',
  // 'internmap'
].join('|');
