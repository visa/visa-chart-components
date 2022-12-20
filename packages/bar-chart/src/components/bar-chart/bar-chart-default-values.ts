/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class BarChartDefaultValues {
  static readonly mainTitle = 'This is bar chart title';
  static readonly subTitle = 'This is the bar chart subtitle';
  static readonly height = 325;
  static readonly width = 675;
  static readonly margin = {
    top: 325 * 0.01,
    bottom: 325 * 0.01,
    right: 675 * 0.01,
    left: 675 * 0.01
  };
  static readonly padding = {
    top: 20,
    bottom: 50,
    right: 60,
    left: 60
  };
  static readonly ordinalAccessor = 'label';
  static readonly valueAccessor = 'value';
  static readonly groupAccessor = '';

  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly layout = propDefaultValues.layout;
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly sortOrder = propDefaultValues.sortOrder;
  static readonly xAxis = propDefaultValues.xAxis;

  static readonly yAxis = propDefaultValues.yAxis;
  static readonly wrapLabel = propDefaultValues.wrapLabel;
  static readonly colorPalette = propDefaultValues.colorPaletteSingle;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;

  static readonly referenceStyle = propDefaultValues.referenceStyle;
  static readonly cursor = propDefaultValues.cursor;
  static readonly roundedCorner = propDefaultValues.roundedCorner;
  static readonly barIntervalRatio = propDefaultValues.barIntervalRatio;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;

  static readonly dataLabel = propDefaultValues.dataLabel;
  static readonly dataKeyNames;
  static readonly legend = propDefaultValues.categoryLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
