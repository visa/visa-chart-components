/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class ClusteredBarChartDefaultValues {
  static readonly mainTitle = 'Clustered Bar Chart Title';
  static readonly subTitle = "This is the clustered bar chart's subtitle";
  static readonly height = 250;
  static readonly width = 675;
  static readonly margin = {
    top: 400 * 0.01,
    bottom: 400 * 0.01,
    right: 400 * 0.01,
    left: 400 * 0.01
  };
  static readonly padding = {
    top: 20,
    bottom: 50,
    right: 50,
    left: 50
  };

  static readonly localization = propDefaultValues.localization;

  static readonly ordinalAccessor = 'label';
  static readonly valueAccessor = 'value';
  static readonly groupAccessor = 'category';
  static readonly reverseOrder = false;

  static readonly layout = propDefaultValues.layout;
  static readonly xAxis = propDefaultValues.xAxis;
  static readonly yAxis = propDefaultValues.yAxis;
  static readonly wrapLabel = propDefaultValues.wrapLabel;

  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;
  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;
  static readonly referenceStyle = propDefaultValues.referenceStyle;
  static readonly cursor = propDefaultValues.cursor;
  static readonly roundedCorner = propDefaultValues.roundedCorner;
  static readonly barIntervalRatio = propDefaultValues.barIntervalRatio;
  static readonly groupIntervalRatio = propDefaultValues.barIntervalRatio;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;

  static readonly dataLabel = propDefaultValues.dataLabel;
  static readonly dataKeyNames;

  static readonly legend = propDefaultValues.categoryLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;
  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;

  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly clickHighlight = propDefaultValues.clickHighlight;
  static readonly hoverHighlight;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
}
