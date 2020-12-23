/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export const removeRedundantAxesAT = (layout: string, rootEle: string) => {
  let axisLabelsToHide;
  console.log(layout);
  /*if ( layout === "vertical" ) {
        axisLabelsToHide = document.querySelectorAll(`${rootEle} .y .tick`);
    } else if ( layout === "horizontal" ) {
        axisLabelsToHide = document.querySelectorAll(`${rootEle} .x .tick`);
    }*/
  axisLabelsToHide = document.querySelectorAll(`${rootEle} .tick`);

  [...axisLabelsToHide].forEach(_ => {
    _.lastElementChild.setAttribute('role', 'presentation');
    _.lastElementChild.setAttribute('aria-hidden', 'true');
  });
};
