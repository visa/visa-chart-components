/**
 * Copyright (c) 2020, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { getGlobalInstances } from './globalInstances';

function numeralRegister(type: string = 'format', name: string = 'formatName', payload: any, overwrite?: boolean) {
  const windowNumeral = getGlobalInstances()['numeral'];
  try {
    windowNumeral.register(type, name, payload, overwrite);
    // console.log('numeral registered', type, name);
  } catch (e) {
    console.warn('note: error encountered when registering to numeral instance', type, name);
  }
}

export function getNumeralInstance() {
  const windowNumeral = getGlobalInstances()['numeral'];
  return windowNumeral;
}

export function registerNumeralLocale(name: string = 'formatName', payload: any, overwrite?: boolean) {
  numeralRegister('locale', name, payload, overwrite);
}

export function registerNumeralFormat(name: string = 'formatName', payload: any, overwrite?: boolean) {
  numeralRegister('format', name, payload, overwrite);
}

// note: a number of locales can be found here https://github.com/adamwdraper/Numeral-js/tree/master/src/locales
export function setNumeralLocale(locale: string = 'en') {
  const windowNumeral = getGlobalInstances()['numeral'];
  if (windowNumeral.locales && windowNumeral.locales[locale]) {
    windowNumeral.locale(locale);
  } else {
    console.error('numeral instance does not have the locale ', locale, ' registered.');
  }
}

export function formatStats(val: any = '0', format = '(0.00a)') {
  const windowNumeral = getGlobalInstances()['numeral'];
  // console.log('checking numeral', numeral);
  return windowNumeral(val).format(format);

  // this type of code would be needed if we abstract the formatting into an api for the users
  // for now we can just force the users to provide the relevant format for numeral to work correctly
  // switch(true) {
  //   //for currency with auto decimal point(s)
  //   case type == 'currency' && decimal == 'auto':
  //     return numeral(val).format('$0.00a');

  //   //for currency with 1 decimal point(s)
  //   case type == 'currency' && decimal == 1:
  //     return numeral(val).format('$0.0a');

  //   //for currency with 1 decimal point(s)
  //   case type == 'number' && decimal == 1:
  //     return numeral(val).format('$0.0a');

  //     //for percent with round-off to next
  //   case type == 'percent':
  //     var t = numeral(val).format('0.00%');
  //     t = Math.ceil(t.substring(0, t.indexOf('%')));
  //     return t + '%';
  // }
}

export function roundTo(value, decimals) {
  const scale = Math.pow(10, decimals || 0);
  return Math.round((value + Number.EPSILON) * scale) / scale;
}
