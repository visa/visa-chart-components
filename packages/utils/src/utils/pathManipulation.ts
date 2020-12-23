/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export function resolveLines(left, right, key) {
  const output = [[], []];

  if (left.length < 1 || right.length < 1) return [];

  const leftKeys = {};
  const rightKeys = {};
  const deltas = [];

  let i = 0;
  for (i = 0; i < left.length; i++) {
    leftKeys[left[i][key]] = 1;
  }
  i = 0;
  for (i = 0; i < right.length; i++) {
    rightKeys[right[i][key]] = 1;
    if (leftKeys[right[i][key]]) {
      deltas.push(0);
    } else {
      deltas.push(1);
    }
  }
  i = 0;
  let rightPointer = 0;
  let leftPointer = 0;
  function push(change) {
    const leftElement = { ...left[leftPointer] };
    const rightElement = { ...right[rightPointer] };
    if (change) {
      leftElement[change] = true;
      rightElement[change] = true;
    }
    output[0].push(leftElement);
    output[1].push(rightElement);
  }
  function movePointers(leftChange, rightChange) {
    leftPointer = leftPointer + leftChange;
    rightPointer = rightPointer + rightChange;
  }
  let changeCounter = 0;
  let end = false;
  while (leftPointer < left.length && rightPointer < right.length) {
    const start = rightPointer !== 0 ? false : true;
    const adding = deltas[rightPointer];
    const removing = end && adding ? false : !rightKeys[left[leftPointer][key]];
    const retaining = !end && !removing ? true : false;
    if (removing) {
      const firstMove = !start && !end ? [0, -1] : [0, 0];
      const secondMove = !start && !end ? [1, 1] : [1, 0];
      movePointers(firstMove[0], firstMove[1]);
      push('exit');
      movePointers(secondMove[0], secondMove[1]);
    } else if (adding) {
      push('enter');
      movePointers(0, 1);
    } else if (retaining) {
      push(false);
      movePointers(1, 1);
    }
    if (!end && leftPointer === left.length && rightPointer < right.length) {
      end = true;
      movePointers(-1, 0);
    } else if (!end && leftPointer < left.length && rightPointer === right.length) {
      end = true;
      movePointers(0, -1);
    }
    changeCounter += removing || adding ? 1 : 0;
  }
  if (!changeCounter) {
    return [];
  }

  return output;
}

export function reduceGeoPathPrecision(element, percentReduction) {
  let path = '';
  let line = element.getAttribute('d');
  let lineArray = line.split('M');
  lineArray.shift();
  let i = 0;
  const extents = findPathExtents(element);
  for (i = 0; i < lineArray.length; i++) {
    const clone = element.cloneNode(true);
    clone.setAttribute('d', 'M' + lineArray[i]);
    const appendedClone = element.parentNode.appendChild(clone);
    const newLength = Math.floor(appendedClone.getTotalLength() * percentReduction);
    path += adjustAndTrimGeoPath(appendedClone, newLength, extents, 1);
    appendedClone.remove();
  }
  return path;
}

export function adjustAndTrimGeoPath(element, targetLength, adjust, maxDecimals) {
  function round(value, decimals) {
    const trickValue = {
      trick: value + 'e' + decimals
    };
    return Number(Math.round(trickValue[Object.keys(trickValue)[0]]) + 'e-' + decimals);
  }
  let l = element.getTotalLength();
  let i = 0;
  let increment = l / targetLength;
  let path = 'M';
  while (i <= l) {
    if (i) {
      path += 'L';
    }
    const point = element.getPointAtLength(i);
    const xAdjust = adjust ? -adjust.x.min : 0;
    const yAdjust = adjust ? -adjust.y.min : 0;
    const x = maxDecimals || maxDecimals === 0 ? round(point.x + xAdjust, maxDecimals) : point.x + xAdjust;
    const y = maxDecimals || maxDecimals === 0 ? round(point.y + yAdjust, maxDecimals) : point.y + yAdjust;
    path += x + ',' + y;
    i += increment;
  }
  path += 'Z';
  return path;
}

export function findPathExtents(element) {
  let l = element.getTotalLength();
  let i = 0;
  let extents = {
    x: {
      min: Infinity,
      max: 0
    },
    y: {
      min: Infinity,
      max: 0
    }
  };
  for (i = 0; i < l; i++) {
    const point = element.getPointAtLength(i);
    extents.x.max = extents.x.max < point.x ? point.x : extents.x.max;
    extents.x.min = extents.x.min > point.x ? point.x : extents.x.min;
    extents.y.max = extents.y.max < point.x ? point.y : extents.y.max;
    extents.y.min = extents.y.min > point.y ? point.y : extents.y.min;
  }
  return extents;
}

export function generalizePath(element, targetLength) {
  let l = element.getTotalLength();
  let i = 0;
  let increment = l / targetLength;
  let path = 'M';
  while (i <= l) {
    if (i) {
      path += 'L';
    }
    const point = element.getPointAtLength(i);
    path += point.x + ',' + point.y;
    i += increment;
  }
  path += 'Z';
  return path;
}

export function equalizePath(element, limit) {
  let l = element.getTotalLength();
  try {
    if (l > limit) throw 'Path length exceeds supplied limit. Raise limit.';
  } catch (err) {
    console.log(err);
  }
  let i = 0;
  let increment = 1;
  let path = 'M';
  let point = {};

  while (i <= l) {
    if (i) {
      path += 'L';
    }
    point = element.getPointAtLength(i);
    path += point['x'] + ',' + point['y'];
    i += increment;
  }
  while (i <= limit) {
    path += point['x'] + ',' + point['y'];
    i += increment;
  }
  path += 'Z';
  return path;
}
