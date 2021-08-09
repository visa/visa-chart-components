/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export function getTextWidth(text: string, fontSize: number, noPadding?: boolean, fontFamily?: string) {
  // this gets garbage collected after this function scope closes, since we do not append
  const padding = !noPadding ? 1.1 : 1; // for a11y we add padding, up to 10% of the text's dimensions
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontSize + 'px ' + (fontFamily || 'OpenSans');
  return context.measureText(text).width * padding;
}

export const verifyTextHasSpace = ({
  text,
  dimensions,
  fontSize,
  noPadding
}: {
  text: string;
  dimensions: any;
  fontSize: number;
  noPadding?: boolean;
}) => {
  // dimensions = { width: 97, height: 29 }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = fontSize + 'px OpenSans';
  const measurementData = context.measureText(text);
  const padding = !noPadding ? 1.1 : 1; // for a11y we add padding, up to 10% of the text's dimensions

  const keys = Object.keys(dimensions);
  let textHasRoom = true;
  let i = 0;
  while (textHasRoom && i < keys.length) {
    if (!(keys[i] === 'height')) {
      textHasRoom = measurementData[keys[i]] * padding <= dimensions[keys[i]];
    } else {
      textHasRoom = fontSize * padding <= dimensions[keys[i]];
    }
    i++;
  }
  return textHasRoom;
};

export const manuallyWrapText = ({
  text,
  width,
  fontSize,
  noPadding,
  wholeWords
}: {
  text: string;
  width: any;
  fontSize: number;
  noPadding?: boolean;
  wholeWords?: boolean;
}) => {
  // split into words
  const words = text.split(/\s+/).reverse();
  // turn words into lines
  const lines = [];
  let lineNumber = 0;
  let word = words.pop();
  while (word) {
    let line = lines[lineNumber];
    if (!line) {
      lines.push([]);
      line = lines[lineNumber];
    }
    // add current word to line
    line.push(word);
    const lineWidth = getTextWidth(line.join(' '), fontSize);
    // check if line has 1 word but is too long, if so:
    if (line.length === 1 && lineWidth > width) {
      // check if we aren't forcing whole words
      if (!wholeWords) {
        // if we aren't: split word, add hyphen, put split word ending at front of words array
        const splitWord = splitStringAtWidth(word, width, fontSize, noPadding);
        // remove whole word
        line.pop();
        // add first word plus hyphen
        line.push(splitWord[0] + (splitWord[1] ? '-' : ''));
        // use the second half of the word in the next iteration, if it exists
        if (splitWord[1]) {
          word = splitWord[1];
        } else {
          word = words.pop();
        }
      } else {
        // proceed with a line overlapping
        // prepare the next word for iteration
        word = words.pop();
      }
      // line is done, create single string
      lines[lineNumber] = line.join(' ');
      // start a new line
      lineNumber++;
    } else if (lineWidth > width) {
      // check if line is too long
      // - remove the word that just pushed the line over length
      line.pop();
      // line is done, create single string
      lines[lineNumber] = line.join(' ');
      // start a new line
      lineNumber++;
    } else {
      // prepare the next word for iteration
      word = words.pop();
      if (!word) {
        // no words left? line is done, create single string
        lines[lineNumber] = line.join(' ');
      }
    }
  }
  return lines;
};

const splitStringAtWidth = (string: string, width: number, fontSize: number, noPadding?: boolean) => {
  if (string.length <= 1) {
    return [string, ''];
  }
  let index = string.length - 1;
  let start = string.substring(0, index);
  let end = string.substring(index);
  while (getTextWidth(start + '-', fontSize, noPadding) > width && index > 1) {
    index--;
    start = string.substring(0, index);
    end = string.substring(index);
  }
  return [start, end];
};
