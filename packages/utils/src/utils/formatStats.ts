/**
 * Copyright (c) 2020, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import numeral from './numeral'; //http://numeraljs.com/#format

function numeralRegister(type: string = 'format', name: string = 'formatName', payload: any) {
  // first check if we already have it?
  if (!(numeral[`${type}s`] && numeral[`${type}s`][name])) {
    try {
      numeral.register(type, name, payload);
      // console.log('numeral registered', type, name);
    } catch (e) {
      console.error('error encountered when registering to numeral instance', type, name, e);
    }
  }
}

export function getNumeralInstance() {
  return numeral;
}

export function registerNumeralLocale(name: string = 'formatName', payload: any) {
  numeralRegister('locale', name, payload);
}

export function registerNumeralFormat(name: string = 'formatName', payload: any) {
  numeralRegister('format', name, payload);
}

// note: a number of locales can be found here https://github.com/adamwdraper/Numeral-js/tree/master/src/locales
export function setNumeralLocale(locale: string = 'en') {
  if (numeral.locales && numeral.locales[locale]) {
    numeral.locale(locale);
  } else {
    console.error('numeral instance does not have the locale ', locale, ' registered.');
  }
}

export function formatStats(val: any = '0', format = '(0.00a)') {
  // console.log('checking numeral', numeral);
  return numeral(val).format(format);

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
