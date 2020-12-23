/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import parser from 'ua-parser-js';
const ua = parser(window.navigator.userAgent);

export const getBrowser = () => {
  return ua.browser.name;
};

export const getOS = () => {
  return ua.os.name;
};
