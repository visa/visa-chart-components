/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import numeral from './numeral'; //http://numeraljs.com/#format

export function formatStats(val: any = '0', format = '(0.00a)') {
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
