/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { isEmpty, isObject } from './utilFunctions';
import { getContrastingStroke, autoTextColor } from './colors';
import { propDefaultValues } from '.';

export const setSubTitle = ({ root, uniqueID, subTitle }: { root?: any; uniqueID?: string; subTitle?: any }) => {
  if (isObject(subTitle)) {
    if (!isEmpty(subTitle.text)) {
      if (!isEmpty(subTitle.keywordsHighlight)) {
        let sentence = subTitle.text;
        let terms = subTitle.keywordsHighlight;

        terms.forEach(term => {
          let styleColor = `color: ${autoTextColor(term.color)};`;
          let styleBackgroundColor = `background-color: ${term.color};`;
          let styleBorder = `border: 1px solid ${getContrastingStroke(term.color)};`;
          let counter = 0;
          const regex = new RegExp(`\\b${term.text}\\b`, 'gi');

          sentence = sentence.replace(regex, match => {
            counter++;
            if (!term.index || counter === term.index) {
              return `<span class="vcl-sub-title-keyword" style="${styleBackgroundColor} ${styleBorder} ${styleColor}">${match}</span>`;
            }
            return match;
          });
        });
        root.html(sentence);
        // svg approach
        // if we want to have subtitle with svgs:
        // display: inline-block'>
        //     <svg overflow="visible">
        //       <text x="0" y="0" fill="${autoTextColor(subTitle.colors[index])}">${key}</text>
        //     </svg>
        //   </span>`
        // if we want to have subtitle with svgs:
        // let svgs = selectAll('span.vcl-sub-title-keyword svg');
        // Array.from(svgs['_groups'][0]).forEach((svg: any) => {
        //   let bbox = svg.getBBox();
        //   svg.setAttribute('width', bbox.x + bbox.width + bbox.x);
        //   svg.setAttribute('height', bbox.y + bbox.height + bbox.y);
        // });
        // let svgs = selectAll('span.vcl-sub-title-keyword svg');
        // Array.from(svgs['_groups'][0]).forEach((svg: any) => {
        //   let bbox = svg.getBBox();
        //   svg.setAttribute('width', bbox.x + bbox.width + bbox.x);
        //   svg.setAttribute('height', bbox.y + bbox.height + bbox.y);
        // });
      } else {
        root.text(subTitle.text);
      }
    } else {
      root.text(propDefaultValues.subTitle.text);
    }
  } else {
    root.text(subTitle);
  }
};
