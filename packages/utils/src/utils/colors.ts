/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { scaleQuantize, scaleOrdinal, scaleLinear } from 'd3-scale';
import { hsl, rgb } from 'd3-color';

export const visaColors = {
  pri_grey: '#5C5C5C',
  sec_blue: '#003ea9',
  sec_orange: '#ef8400',
  sec_yellow: '#ffd700',
  comp_blue: '#2bb4da',
  comp_green: '#00a25e',
  supp_pink: '#ae48b4',
  supp_purple: '#7f48b4',
  supp_green: '#649f4a',
  supp_red: '#a50026',
  // for data viz component
  base_grey: '#D7D7DE',
  light_text: '#ffffff',
  grey_text: '#565656',
  dark_text: '#222222',

  // blue to black theme
  oss_blue: '#0051dc',
  oss_light_blue: '#7FA8ED',
  oss_dark_grey: '#363636',
  oss_light_grey: '#D7D7D7',

  // for categorical palettes
  categorical_blue: '#226092',
  categorical_light_blue: '#7c99b1',
  categorical_blue_text: '#164d79',
  categorical_purple: '#796aaf',
  categorical_light_purple: '#cacae7',
  categorical_purple_text: '#66589b',
  categorical_olive: '#829e46',
  categorical_light_olive: '#abb798',
  categorical_olive_text: '#498329',
  categorical_grey: '#7a6763',
  categorical_light_grey: '#a19491',
  categorical_grey_text: '#6e5a55',
  categorical_rose: '#c18174',
  categorical_light_rose: '#e7c0b8',
  categorical_rose_text: '#954737',
  categorical_brown: '#43312d',
  categorical_light_brown: '#624c48',
  categorical_brown_text: '#43312d'
};

export function darkerColor(color) {
  let hexColor = visaColors[color] || color;
  return hsl(hexColor)
    .darker(1.5)
    .hex();
}

export function brighterColor(color) {
  let hexColor = visaColors[color] || color;
  let brighterScale = scaleLinear()
    .domain([0, 0.45])
    .range([4, 2]);
  return hsl(hexColor)
    .brighter(brighterScale(hsl(hexColor).l))
    .hex();
  // return "white"
}

export function outlineColor(color) {
  let hexColor = visaColors[color] || color;
  return hsl(hexColor).l > 0.4 ? darkerColor(hexColor) : brighterColor(hexColor);
}

const sequentialColorIndex = [
  [7],
  [7],
  [2, 6],
  [0, 3, 6],
  [0, 2, 4, 6],
  [0, 1, 3, 5, 7],
  [1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6, 7]
];

const divergingColorIndex = [
  [0],
  [0],
  [0, 9],
  [0, 4, 9],
  [0, 3, 6, 9],
  [0, 2, 4, 6, 9],
  [0, 2, 4, 5, 7, 9],
  [0, 1, 2, 4, 7, 8, 9],
  [0, 1, 2, 3, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
];
const categoricalColorIndex = [
  [0],
  [0],
  [0, 1],
  [0, 1, 2],
  [0, 1, 2, 3],
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4, 5],
  [0, 1, 2, 3, 4, 5, 6], // 1- 7
  [0, 1, 2, 3, 4, 5, 6, 7],
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] //8-11
];

export function getColors(colorPalette, dataRange) {
  const colorArr = [];
  colorArr['single_blue'] = [visaColors.categorical_blue];
  colorArr['single_brown'] = [visaColors.categorical_brown];
  colorArr['single_grey'] = [visaColors.pri_grey];
  colorArr['single_secBlue'] = [visaColors.sec_blue];
  colorArr['single_secOrange'] = [visaColors.sec_orange];
  colorArr['single_compBlue'] = [visaColors.comp_blue];
  colorArr['single_compGreen'] = [visaColors.comp_green];
  colorArr['single_suppPink'] = [visaColors.supp_pink];
  colorArr['single_suppPurple'] = [visaColors.supp_purple];
  colorArr['single_suppGreen'] = [visaColors.supp_green];
  colorArr['single_ossBlue'] = [visaColors.oss_blue];
  colorArr['single_ossLightBlue'] = [visaColors.oss_light_blue];
  colorArr['single_ossGrey'] = [visaColors.oss_dark_grey];
  colorArr['single_ossLightGrey'] = [visaColors.oss_light_grey];
  colorArr['single_categorical_blue'] = [visaColors.categorical_blue];
  colorArr['single_categorical_light_blue'] = [visaColors.categorical_light_blue];
  colorArr['single_categorical_blue_text'] = [visaColors.categorical_blue_text];
  colorArr['single_categorical_purple'] = [visaColors.categorical_purple];
  colorArr['single_categorical_light_purple'] = [visaColors.categorical_light_purple];
  colorArr['single_categorical_purple_text'] = [visaColors.categorical_purple_text];
  colorArr['single_categorical_olive'] = [visaColors.categorical_olive];
  colorArr['single_categorical_light_olive'] = [visaColors.categorical_light_olive];
  colorArr['single_categorical_olive_text'] = [visaColors.categorical_olive_text];
  colorArr['single_categorical_grey'] = [visaColors.categorical_grey];
  colorArr['single_categorical_light_grey'] = [visaColors.categorical_light_grey];
  colorArr['single_categorical_grey_text'] = [visaColors.categorical_grey_text];
  colorArr['single_categorical_rose'] = [visaColors.categorical_rose];
  colorArr['single_categorical_light_rose'] = [visaColors.categorical_light_rose];
  colorArr['single_categorical_rose_text'] = [visaColors.categorical_rose_text];
  colorArr['single_categorical_brown'] = [visaColors.categorical_brown];
  colorArr['single_categorical_light_brown'] = [visaColors.categorical_light_brown];
  colorArr['single_categorical_brown_text'] = [visaColors.categorical_brown_text];

  colorArr['sequential_grey'] = [
    '#f2f2f2',
    '#d7d7d7',
    '#bdbdbd',
    '#a3a3a3',
    '#898989',
    '#717171',
    '#595959',
    '#434343',
    '#2e2e2e'
  ];
  colorArr['sequential_secBlue'] = [
    '#ecf9f9',
    '#c0e0f1',
    '#91c8ea',
    '#57b0e2',
    '#0c96d7',
    '#1778c7',
    '#145bb8',
    '#003da8',
    '#002c76'
  ];
  colorArr['sequential_secOrange'] = [
    '#fee9c7',
    '#ffc78d',
    '#faa654',
    '#ef8506',
    '#e36001',
    '#c04e04',
    '#9c3d05',
    '#7b2c05',
    '#5c1c00'
  ];
  colorArr['sequential_compBlue'] = [
    '#f3fbfe',
    '#bde3f2',
    '#81cae6',
    '#2ab1d7',
    '#2294b5',
    '#1b7994',
    '#135d74',
    '#0c4557',
    '#062c3a'
  ];
  colorArr['sequential_compGreen'] = [
    '#eafed4',
    '#bae7b4',
    '#89cf95',
    '#53b677',
    '#009e5c',
    '#00814b',
    '#00663b',
    '#004b2b',
    '#00321d'
  ];
  colorArr['sequential_suppPink'] = [
    '#f8f4f9',
    '#f3cef3',
    '#eca6ed',
    '#e37ce6',
    '#d74adf',
    '#aa45af',
    '#86378a',
    '#632a66',
    '#421b44'
  ];
  colorArr['sequential_suppPurple'] = [
    '#f7fcfd',
    '#e3daec',
    '#cebadd',
    '#b59acc',
    '#977ebb',
    '#7367a5',
    '#554f87',
    '#423667',
    '#331d48'
  ];
  colorArr['sequential_suppGreen'] = [
    '#ffffe5',
    '#deebc3',
    '#bed6a2',
    '#9ec283',
    '#7fae61',
    '#5e9a48',
    '#448340',
    '#286e3a',
    '#005a32'
  ];

  colorArr['diverging_RtoB'] = [
    '#a50026',
    '#c7422a',
    '#df7232',
    '#f3a14b',
    '#ffcf7b',
    '#afdbf1',
    '#7ab7e5',
    '#5390d1',
    '#386bb6',
    '#2d4697'
  ];
  colorArr['diverging_RtoG'] = [
    '#972800',
    '#ba4d18',
    '#df7131',
    '#f0a04e',
    '#fecd6e',
    '#bcdeba',
    '#72c1a7',
    '#529f8e',
    '#307e75',
    '#015e5d'
  ];
  colorArr['diverging_GtoP'] = [
    '#194f46',
    '#377258',
    '#57976f',
    '#7abb8c',
    '#a6e0b5',
    '#bbd4f9',
    '#aba6ea',
    '#9879d2',
    '#7655b2',
    '#3c3f85'
  ];
  colorArr['categorical'] = ['#7c99b1', '#cacae7', '#abb798', '#a19491', '#e7c0b8', '#624c48'];
  colorArr['categorical_light'] = ['#7c99b1', '#cacae7', '#abb798', '#a19491', '#e7c0b8', '#624c48'];
  colorArr['categorical_dark'] = ['#226092', '#796aaf', '#829e46', '#7a6763', '#c18174', '#43312d'];
  colorArr['categorical_text'] = ['#164d79', '#66589b', '#498329', '#6e5a55', '#954737', '#43312d'];

  const selectedColor = typeof colorPalette === 'string' ? colorArr[colorPalette] : colorPalette;

  if (Array.isArray(dataRange)) {
    // range of data keys is passed
    let colorScale;
    if (typeof dataRange[0] === 'string') {
      let newColorArr = [];
      let colorIndex = colorPalette.includes('diverging')
        ? divergingColorIndex
        : colorPalette.includes('categorical')
        ? categoricalColorIndex
        : sequentialColorIndex;

      typeof colorPalette === 'string' && colorIndex[dataRange.length]
        ? colorIndex[dataRange.length].map(key => {
            selectedColor[key] ? newColorArr.push(selectedColor[key]) : newColorArr.push(selectedColor[0]);
          })
        : (newColorArr = selectedColor);
      colorScale = scaleOrdinal()
        .domain(dataRange)
        .range(newColorArr);
    } else {
      colorScale = scaleQuantize()
        .domain(dataRange)
        .range(selectedColor);
    }
    return colorScale;
  } else if (Number.isInteger(dataRange)) {
    // number of colors is passed
    let newColorArr = [];
    let colorIndex = colorPalette.includes('diverging')
      ? divergingColorIndex
      : colorPalette.includes('categorical')
      ? categoricalColorIndex
      : sequentialColorIndex;

    colorIndex[dataRange]
      ? colorIndex[dataRange].map(key => {
          selectedColor[key] ? newColorArr.push(selectedColor[key]) : newColorArr.push(selectedColor[0]);
        })
      : (newColorArr = selectedColor);
    return newColorArr;
  } else return selectedColor;
}

/**
 * This function will find up to two strokes for a given input color. This is only designed for accessible graphics.
 *
 * This function is designed with VGAR compliance in mind, using the WCAG 2.1 contrast ratio formula to find the highest contrast stroke colors possible for a graphical element. Formula: https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests
 *
 * @see  uses two visa/visa-charts-utils functions: calculateLuminance()  and calculateRelativeLuminance().
 *
 * @param {string}   fillColor           Any valid HTML string may be passed for color: 'red', '#ffffff', 'rgb(12,200,15)', even 'hsl(0,60%,50%)'. Alpha values will be ignored (for accessibility purposes, web authors are strongly encouraged to avoid using opacity or alpha channels in styling).
 *
 * @return {string[]} Returns an array containing color hex values as strings. The first array position is always contrasted against the fill color. The second array position is sometimes empty but if it has a value it will always be the original color. The second value only populates if the original color has more than 3:1 contrast against white.
 */
export function getAccessibleStrokes(fillColor: string) {
  const strokes = [];
  strokes.push(getContrastingStroke(fillColor));
  const luminanceToWhite = calculateRelativeLuminance(calculateLuminance(fillColor), 1);
  if (luminanceToWhite >= 3) {
    strokes.push(fillColor);
  }
  return strokes;
}

// experimental function
// early tests show that this method can still fail to produce a valid stroke
// this is abandoned until further need
export function getRecursiveStroke(foreground: string, background: string) {
  const extents = {};
  const foregroundLuminance = calculateLuminance(foreground);
  const backgroundLuminance = calculateLuminance(background);
  const foregroundToWhite = calculateRelativeLuminance(foregroundLuminance, 1);
  const backgroundToWhite = calculateRelativeLuminance(backgroundLuminance, 1);
  extents[foreground] = {};
  extents[background] = {};
  extents[foreground].min = foregroundToWhite - 3 > 1 ? foregroundToWhite - 3 : 1;
  extents[foreground].max = foregroundToWhite + 3 < 21 ? foregroundToWhite + 3 : 21;
  extents[background].min = backgroundToWhite - 3 > 1 ? backgroundToWhite - 3 : 1;
  extents[background].max = backgroundToWhite + 3 < 21 ? backgroundToWhite + 3 : 21;
  const darkerColor = extents[foreground].max >= extents[background].max ? foreground : background;
  const lighterColor = extents[foreground].min <= extents[background].min ? foreground : background;
  const lightestValue = extents[lighterColor].min;
  const darkestValue = extents[darkerColor].max;
  const gaps = {
    dark: 21 - darkestValue > 0 ? 21 - darkestValue : 0,
    light: lightestValue - 1 > 0 ? lightestValue - 1 : 0
  };
  let foundStroke = '';
  let operation = '';
  let target = '';
  if (lighterColor === foreground && extents[foreground].max < extents[background].min) {
    // try darkening foreground into the inner gap space
    operation = 'darken';
    target = foreground;
  } else if (darkerColor === foreground && extents[foreground].min > extents[background].max) {
    // try lightening foreground into the inner gap space
    operation = 'lighten';
    target = foreground;
  }
  if (operation) {
    const colorAttempt = processColor(target, operation, 3);
    const attemptLuminance = calculateLuminance(colorAttempt);
    foundStroke = calculateRelativeLuminance(backgroundLuminance, attemptLuminance) >= 3 ? colorAttempt : 0;
  }
  if (!foundStroke) {
    // the inner gap didn't work, must try exterior gaps
    if (darkerColor === foreground && gaps.dark) {
      // try darkening foreground into the outer gap space
      operation = 'darken';
      target = foreground;
    } else if (lighterColor === foreground && gaps.light) {
      // try lightening foreground into the outer gap space
      operation = 'lighten';
      target = foreground;
    }
    foundStroke = operation ? processColor(target, operation, 3) : '';
  }
  if (!foundStroke) {
    // must try exterior gaps using the background color
    if (gaps.dark > gaps.light) {
      // try darkening foreground into the gap space
      operation = 'darken';
      target = background;
    } else {
      // try lighting foreground into the gap space
      operation = 'lighten';
      target = background;
    }
    foundStroke = operation ? processColor(target, operation, 3) : '';
  }
  if (!foundStroke) {
    foundStroke = foreground;
  }
  return foundStroke;
}

function processColor(color: string, operation: string, contrast: number) {
  const originalLuminance = calculateLuminance(color);
  const hslObject = hsl(color);
  let limitReached = false;
  let impossible = false;
  if (operation === 'darken') {
    hslObject.l -= 0.01;
    while (
      calculateRelativeLuminance(calculateLuminance(hslObject.hex()), originalLuminance) < contrast &&
      !impossible
    ) {
      hslObject.l -= 0.01;
      if (limitReached) {
        impossible = true;
      }
      if (hslObject.l < 0) {
        hslObject.l = 0;
        limitReached = true;
      }
    }
  } else {
    hslObject.l += 0.01;
    while (
      calculateRelativeLuminance(calculateLuminance(hslObject.hex()), originalLuminance) < contrast &&
      !impossible
    ) {
      hslObject.l += 0.01;
      if (limitReached) {
        impossible = true;
      }
      if (hslObject.l > 1) {
        hslObject.l = 1;
        limitReached = true;
      }
    }
  }
  return !impossible ? hslObject.hex() : '';
}

export function getContrastingStroke(fillColor: string) {
  const originalLuminance = calculateLuminance(fillColor);
  const luminanceToWhite = calculateRelativeLuminance(originalLuminance, 1);
  const hslObject = hsl(fillColor);
  if (luminanceToWhite < 3) {
    hslObject.l -= 0.01;
    while (
      hslObject.l > 0 &&
      calculateRelativeLuminance(calculateLuminance(hslObject.hex()), originalLuminance) < 3 &&
      hslObject.l
    ) {
      hslObject.l -= 0.01;
      if (hslObject.l < 0) {
        hslObject.l = 0;
      }
    }
  } else {
    hslObject.l += 0.01;
    while (
      calculateRelativeLuminance(calculateLuminance(hslObject.hex()), originalLuminance) < 3 &&
      hslObject.l !== 1
    ) {
      hslObject.l += 0.01;
      if (hslObject.l > 1) {
        hslObject.l = 1;
      }
    }
  }
  return hslObject.hex();
}

export function ensureTextContrast(textColor: string) {
  const originalLuminance = calculateLuminance(textColor);
  const luminanceToWhite = calculateRelativeLuminance(originalLuminance, 1);
  const hslObject = hsl(textColor);
  if (luminanceToWhite < 4.5) {
    hslObject.l -= 0.01;
    while (hslObject.l > 0 && calculateRelativeLuminance(calculateLuminance(hslObject.hex()), 1) < 4.5 && hslObject.l) {
      hslObject.l -= 0.01;
      if (hslObject.l < 0) {
        hslObject.l = 0;
      }
    }
  }
  return hslObject.hex();
}

/**
 * This function will calculate the perceived luminance of a valid HTML color.
 *
 * Formula and specification from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests.
 *
 * @param {string}   color           Any valid HTML string may be passed for color: 'red', '#ffffff', 'rgb(12,200,15)', even 'hsl(0,60%,50%)'. Alpha values will be ignored (for accessibility purposes, web authors are strongly encouraged to avoid using opacity or alpha channels in styling).
 *
 * @return {number} Returns a luminance value between 0 (black, no luminance) and 1 (white, full luminance).
 */
export function calculateLuminance(color: string) {
  function calcColorScore(normalizedColor) {
    return normalizedColor <= 0.03928 ? normalizedColor / 12.92 : Math.pow((normalizedColor + 0.055) / 1.055, 2.4);
  }
  const rgbObject = rgb(color);
  const rLuminance = 0.2126 * calcColorScore(rgbObject.r / 255);
  const gLuminance = 0.7152 * calcColorScore(rgbObject.g / 255);
  const bLuminance = 0.0722 * calcColorScore(rgbObject.b / 255);
  return rLuminance + gLuminance + bLuminance;
}

/**
 * This function will calculate the contrast ratio between two luminance values.
 *
 * Input luminance values may be supplied in any order. The output will always place the highest value as the numerator. Formula and specification from WCAG 2.0: https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests.
 *
 * @see  visa/visa-charts-utils: calculateLuminance() to convert an HTML color into a luminance value (which is the expected input of this function).
 *
 * @param {number}   luminance1           This value must be the calculated luminance of a color.
 * @param {number}   luminance2           This value must be the calculated luminance of another color.
 *
 * @return {number} Returns a contrast ratio between luminance values ranging from 1 (identical luminance) to 21 (complete opposites - black against white).
 */
export function calculateRelativeLuminance(luminance1: number, luminance2: number) {
  return luminance1 >= luminance2
    ? (luminance1 + 0.05) / (luminance2 + 0.05)
    : (luminance2 + 0.05) / (luminance1 + 0.05);
}

/**
 * This function will find the most appropriate text color (foreground) given a background color.
 *
 * This function is designed with VGAR compliance in mind, using the WCAG 2 contrast ratio formula to find the highest contrast text possible. Formula: https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests
 *
 * @see  uses two visa/visa-charts-utils functions: calculateLuminance()  and calculateRelativeLuminance().
 *
 * @param {string}   backgroundColor           Any valid HTML string may be passed for color: 'red', '#ffffff', 'rgb(12,200,15)', even 'hsl(0,60%,50%)'. Alpha values will be ignored (for accessibility purposes, web authors are strongly encouraged to avoid using opacity or alpha channels in styling).
 *
 * @return {string} Returns a color hex value, either '#ffffff' (white) or '#222222' (lead).
 */
export function autoTextColor(backgroundColor: string) {
  const lightLuminance = calculateLuminance(visaColors['light_text']);
  const greyLuminance = calculateLuminance(visaColors['dark_text']);
  const backgroundLuminance = calculateLuminance(backgroundColor);
  const relativeToLight = calculateRelativeLuminance(lightLuminance, backgroundLuminance);
  const relativeToGrey = calculateRelativeLuminance(greyLuminance, backgroundLuminance);
  return relativeToGrey < 4.5 && relativeToLight < 4.5
    ? visaColors['dark_text']
    : relativeToGrey > relativeToLight
    ? visaColors['dark_text']
    : visaColors['light_text'];
}

export function convertVisaColor(colorArr) {
  if (colorArr[0].includes('_')) {
    colorArr.map((c, i) => (colorArr[i] = visaColors[c]));
  }
  return colorArr;
}

export function visaColorToHex(color) {
  let hexColor = visaColors[color] || color;
  return hexColor;
}
