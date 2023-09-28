/**
 * Copyright (c) 2020, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export function getPadding(padding) {
  let paddingSetting;
  if (padding === 'large') {
    paddingSetting = {
      top: 40,
      bottom: 60,
      right: 100,
      left: 80
    };
  } else if (padding === 'small') {
    paddingSetting = {
      top: 10,
      bottom: 20,
      right: 40,
      left: 40
    };
  } else if (padding === '') {
    paddingSetting = {
      top: 20,
      bottom: 50,
      right: 70,
      left: 60
    };
  } else if (padding === 'inlineText') {
    return '3px 6px 3px 6px';
  }

  return paddingSetting;
}

export const validationStyle = {
  warningStyle: 'color: #C6003F;font-size:medium;',
  recommendationStyle: 'font-size:medium;',
  specialRecommendationStyle: 'color: #0061C1;font-size:medium;'
};
