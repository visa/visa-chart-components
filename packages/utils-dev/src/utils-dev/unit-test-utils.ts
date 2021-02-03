/**
 * Copyright (c) 2020, 2021 Visa, Inc.
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
  const now = performance.now;
  performance.now = () => Infinity;

  // run each tween
  tweens.forEach(tween => {
    if (tween.name === 'text') {
      tween.value.bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle);
    } else if (tween.name !== 'attr.transform') {
      if (tween.value.bind(jsDomEle)()) {
        tween.value.bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle)(1);
      }
    }
  });

  // run each dispatch / end
  ends.forEach(end => {
    end.value.bind(jsDomEle)(jsDomEle.__data__, i, jsDomEle);
  });

  // reset timers when done
  performance.now = now;
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
