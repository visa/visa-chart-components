/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;
export class LineChartDefaultValues {
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly mainTitle = 'Line Chart Title';
  static readonly subTitle = "This is the line chart's subtitle";
  static readonly height = 300;
  static readonly width = 650;
  static readonly margin = {
    top: 300 * 0.01,
    bottom: 300 * 0.01,
    right: 650 * 0.01,
    left: 650 * 0.01
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
  static readonly seriesAccessor = 'series';

  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly xAxis = propDefaultValues.xAxisDate;
  static readonly yAxis = propDefaultValues.yAxis;
  static readonly showBaselineX = propDefaultValues.showBaselineTrue;
  static readonly wrapLabel = propDefaultValues.wrapLabel;
  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;

  static readonly referenceStyle = propDefaultValues.referenceStyle;

  static readonly strokeWidth = propDefaultValues.strokeWidth2;
  static readonly showDots = propDefaultValues.showDots;
  static readonly dotRadius = propDefaultValues.dotRadius4;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly cursor = propDefaultValues.cursor;

  static readonly dataLabel = propDefaultValues.dataLabelLine;
  static readonly dataKeyNames;
  static readonly seriesLabel = propDefaultValues.seriesLabel;
  static readonly legend = propDefaultValues.categoryLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;

  static readonly secondaryLines = propDefaultValues.secondaryLines;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
