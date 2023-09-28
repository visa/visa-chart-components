/**
 * Copyright (c) 2020, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IBivariateMapboxMapProps {
  /**
   * @shortDescription Main title of the chart
   * @controlName TextField
   * @groupName Base */
  mainTitle: string;

  /**
   * @shortDescription Subtitle of the chart. A string or an array of objects. Objects should contain text (one/multiple word(s)/number(s) as a single string) and color (HEX) keys. Optional key: index.
   * @controlName TextField
   * @groupName Base */
  subTitle: string | ISubTitleType;
}

export interface ISubTitleType {
  text?: string;
  keywordsHighlight?: object[];
}
