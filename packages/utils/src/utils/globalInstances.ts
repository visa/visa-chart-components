/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import numeral from './numeral';
import i18next from 'i18next';
import { en } from './localization/languages/en';

/**
 * This function will create i18next instance if needed and then return i18next
 *
 * @see  leverages the existing i18Next api for initialization check.
 *
 * @param {boolean}   initIfNot A boolean value to determine whether to init i18Next if it doesn't already exist
 *
 * @return {i18Next} Returns an instance of i18Next.
 */
export const getGlobalInstances = () => {
  // we check whether there is an instance on the window, if so use it.
  // if not create it and initialize it.
  if (window && !window['VCCGlobalInstances']) {
    window['VCCGlobalInstances'] = { i18Next: undefined, numeral: undefined };
  }
  if (window && window['VCCGlobalInstances'] && !window['VCCGlobalInstances']['i18Next']) {
    window['VCCGlobalInstances']['i18Next'] = i18next;
    window['VCCGlobalInstances']['numeral'] = numeral;
  }
  if (!window['VCCGlobalInstances']['i18Next'].isInitialized) {
    window['VCCGlobalInstances']['i18Next'].init({
      ns: ['vcc'],
      lng: 'en',
      debug: false, // true
      fallbackLng: {
        default: ['en']
      },
      resources: { en }
    });
  }
  return window['VCCGlobalInstances'];
};
