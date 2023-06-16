/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// isUndefined
export function isUndefined(payload) {
  if (typeof payload === 'undefined') {
    return true;
  }
  return false;
}
// isObject
export function isObject(payload) {
  return payload !== null && typeof payload === 'object' && typeof payload !== 'undefined';
}

// isEmpty
export const isEmpty = obj => [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;

// xor
const binaryXor = (arr1, arr2) => {
  const a = arr1.filter(x => !arr2.includes(x));
  const b = arr2.filter(x => !arr1.includes(x));

  return Array.from(new Set([...a, ...b]));
};
export const xor = (...arrays) => arrays.reduce(binaryXor, []);

// omit
export const omit = (obj, props) => {
  obj = { ...obj };
  props.forEach(prop => delete obj[prop]);
  return obj;
};
