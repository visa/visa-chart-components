/**
 * Copyright (c) 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { isEmpty, isObject } from './utilFunctions';
import { getContrastingStroke, autoTextColor, ensureTextContrast } from './colors';
import { propDefaultValues } from '.';

export const setSubTitle = ({ root, subTitle }: { root?: any; subTitle?: any }) => {
  if (isObject(subTitle)) {
    if (!isEmpty(subTitle.text)) {
      const rootElement = root.node();
      rootElement.innerHTML = '';

      if (!isEmpty(subTitle.keywordsHighlight)) {
        let terms = subTitle.keywordsHighlight;
        let sentence = subTitle.text;

        let lastIndex = 0;
        terms.forEach(term => {
          const regex = new RegExp(`\\b${term.text}\\b`, 'gi');
          let match;
          let counter = 0;

          while ((match = regex.exec(sentence)) !== null) {
            counter++;
            if (!term.index || counter === term.index) {
              if (match.index > lastIndex) {
                const textNode = document.createTextNode(sentence.slice(lastIndex, match.index));
                rootElement.appendChild(textNode);
              }
              const span = document.createElement('span');
              span.textContent = match[0];

              if (term.mode === 'text') {
                span.style.color = ensureTextContrast(term.color);
                span.style.fontWeight = 'bold';
              } else if (term.mode === 'background') {
                span.style.color = autoTextColor(term.color);
                span.style.padding = '2px 4px';
                span.style.backgroundColor = term.color;
                span.style.border = `1px solid ${getContrastingStroke(term.color)}`;
              } else {
                span.style.color = autoTextColor(term.color);
                span.style.padding = '2px 4px';
                span.style.backgroundColor = term.color;
                span.style.border = `1px solid ${getContrastingStroke(term.color)}`;
              }
              rootElement.appendChild(span);

              lastIndex = regex.lastIndex;
            }
          }
        });
        if (lastIndex < sentence.length) {
          const textNode = document.createTextNode(sentence.slice(lastIndex));
          rootElement.appendChild(textNode);
        }
      } else {
        rootElement.textContent = subTitle.text;
      }
    } else {
      root.text(propDefaultValues.subTitle.text);
    }
  } else {
    root.text(subTitle);
  }
};
