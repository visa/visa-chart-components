/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const circularFind = (array: string[] | number[], index: number): string | number => {
  const remainder: number = index % array.length;
  return array[remainder === 0 ? 0 : remainder];
};
