/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { fontsToLoad, textStylesToCreate } from './constants';

type UnitValue = { unit: string | 'PIXELS' | 'PERCENT'; value: number };
type FontName = { family: string; style: string };
type ConfigFont = {
  fontName: FontName;
  fontSize: number;
  letterSpacing: UnitValue;
  lineHeight: UnitValue;
  name: string;
  options: any;
  paragraphIndent: number;
  paragraphSpacing: number;
  textCase: string;
  textDecoration: string;
};

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const loadFontsAsyncHardCoded = async () => {
  const innerFonts = [...fontsToLoad];

  // get any additional fonts from local styles which may override the hard coded ones
  const localTextStyles = figma.getLocalTextStyles();
  localTextStyles.forEach(localStyle => {
    if (textStylesToCreate.filter(hStyle => hStyle.name === localStyle.name)) {
      // if the font is not already included, we need to load it as well
      if (
        innerFonts.filter(
          f => `${f.family}-${f.style}` === `${localStyle.fontName.family}-${localStyle.fontName.style}`
        ).length === 0
      ) {
        innerFonts.push(localStyle.fontName);
      }
    }
  });

  await asyncForEach(innerFonts, async (fontName: FontName) => {
    // innerFonts.map(async (fontName: FontName) => {
    await loadFontAsyncWithCorrection(fontName);
    const testText = figma.createText();
    try {
      testText.x = 50;
      testText.y = 50;
      testText.fontName = fontName;
      testText.characters = 'testing123';
      // console.log('testing font success', fontName, 'missing font flag:', testText.hasMissingFont);
      testText.remove();
    } catch {
      console.log('testing font failed', fontName, 'missing font flag:', testText.hasMissingFont);
      testText.remove();
    }
    return fontName;
  });
  figma.ui.postMessage({ type: 'receive-fonts', payload: { fonts: innerFonts } });
};

export const createChartTextStyles = () => {
  const textStyles = [];
  textStylesToCreate.map(styleConfig => {
    const existingStyleID = checkFigmaTextStyleExistsByName(styleConfig.name);
    if (existingStyleID) {
      textStyles.push(figma.getStyleById(existingStyleID));
    } else {
      const newStyle = figma.createTextStyle();
      setFigmaFontStyleProps(newStyle, styleConfig);
      textStyles.push(newStyle);
    }
  });
  // console.log('checking if we created styles', textStyles);
  return textStyles;
};

export const loadFontAsyncWithCorrection = async (fontName: FontName) => {
  try {
    await figma.loadFontAsync(fontName);
    return fontName;
  } catch {
    console.log('font mismatch, trying again');
    let { style } = fontName;
    switch (style) {
      case 'SemiBold': {
        style = 'Semibold';
        console.log('Found SemiBold... Using Semibold instead');
        break;
      }
      case 'Semibold': {
        style = 'SemiBold';
        console.log('Found Semibold... Using SemiBold instead');
        break;
      }
      case 'ExtraBold': {
        style = 'Extrabold';
        console.log('Found ExtraBold... Using Extrabold instead');
        break;
      }
      case 'Extrabold': {
        style = 'ExtraBold';
        console.log('Found Extrabold... Using ExtraBold instead');
        break;
      }
      case 'SemiBold Italic': {
        style = 'Semibold Italic';
        console.log('Found SemiBold Italic... Using Semibold Italic instead');
        break;
      }
      case 'Semibold Italic': {
        style = 'SemiBold Italic';
        console.log('Found Semibold Italic... Using SemiBold Italic instead');
        break;
      }
      case 'ExtraBold Italic': {
        style = 'Extrabold Italic';
        console.log('Found ExtraBold Italic... Using Extrabold Italic instead');
        break;
      }
      case 'Extrabold Italic': {
        style = 'ExtraBold Italic';
        console.log('Found Extrabold Italic... Using ExtraBold Italic instead');
        break;
      }
      default:
        style = 'Regular';
        break;
    }
    await figma.loadFontAsync({ ...fontName, style });
    return { ...fontName, style };
  }
};

export const setFigmaFontStyleProps = async (style: TextStyle, font: ConfigFont) => {
  // const loadedFont = await loadFontAsyncWithCorrection(font.fontName as FontName);
  const updateKeys = Object.keys(font);
  try {
    if (updateKeys && updateKeys.length > 0) {
      updateKeys.forEach(key => {
        // console.log('trying to set style font', key, style[key], font[key], updateKeys);
        style[key] = font[key];
      });
    }
  } catch (error) {
    console.log('error', error);
  }
};

export const checkFigmaTextStyleExistsByName = styleName => {
  const localStyles = figma.getLocalTextStyles();
  const styleObject = localStyles.filter(s => s.name === styleName);
  return styleObject && styleObject.length > 0 ? styleObject[0].id : undefined;
};

export const checkFigmaPaintStyleExistsByName = styleName => {
  const localStyles = figma.getLocalPaintStyles();
  const styleObject = localStyles.filter(s => s.name === styleName);
  return styleObject && styleObject.length > 0 ? styleObject[0].id : undefined;
};
