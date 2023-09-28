/**
 * Copyright (c) 2020, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

export function getBrowser() {
  var browserName = 'Unknown';
  if (window.navigator.userAgent.indexOf('Edge') !== -1) {
    //Edge/Blink on EdgeHTML
    browserName = 'Edge';
  } else if (
    window.navigator.userAgent.indexOf('Chrome') !== -1 ||
    window.navigator.userAgent.indexOf('Edg/') !== -1 ||
    window.navigator.userAgent.indexOf('UCBrowser') !== -1
  ) {
    // Chrome or Edge Chromium
    browserName = 'Chrome';
  } else if (window.navigator.userAgent.indexOf('Safari') !== -1) {
    // Safari
    browserName = 'Safari';
  } else if (window.navigator.userAgent.indexOf('Firefox') !== -1) {
    // Firefox
    browserName = 'Firefox';
  } else if (
    window.navigator.userAgent.indexOf('MSIE') !== -1 ||
    window.navigator.userAgent.indexOf('Trident') !== -1
  ) {
    // IE
    browserName = 'IE';
  } else if (window.navigator.userAgent.indexOf('Opera') !== -1 || navigator.userAgent.indexOf('OPR') !== -1) {
    //Opera
    browserName = 'Opera';
  }

  return browserName;
}
