/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;
export class DumbbellPlotDefaultValues {
  static readonly mainTitle = 'Dumbbell Plot Title';
  static readonly subTitle = propDefaultValues.subTitle.text;
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

  static readonly ordinalAccessor = 'date';
  static readonly valueAccessor = 'value';
  static readonly seriesAccessor = 'category';

  // dumbbell specific props
  static readonly focusMarker = {
    key: '',
    sizeFromBar: 12
  };
  static readonly marker = {
    visible: true,
    type: 'dot',
    sizeFromBar: 8
  };
  static readonly barStyle = {
    opacity: 1,
    width: 1,
    colorRule: 'default'
  };
  static readonly differenceLabel = {
    visible: false,
    placement: 'left',
    calculation: 'difference',
    format: '0[.][0][0]a',
    collisionHideOnly: false
  };

  static readonly layout = propDefaultValues.layout;
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly sortOrder = propDefaultValues.sortOrder;

  static readonly xAxis = propDefaultValues.xAxisDate;
  static readonly yAxis = propDefaultValues.yAxis;
  static readonly showBaselineX = propDefaultValues.showBaselineFalse;
  static readonly showBaselineY = propDefaultValues.showBaselineFalse;

  static readonly wrapLabel = propDefaultValues.wrapLabel;
  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;

  static readonly referenceStyle = propDefaultValues.referenceStyle;
  static readonly cursor = propDefaultValues.cursor;
  static readonly roundedCorner = propDefaultValues.roundedCorner;
  static readonly barIntervalRatio = propDefaultValues.barIntervalRatio;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;

  static readonly dataLabel = propDefaultValues.dataLabelEnds;
  static readonly dataKeyNames;
  static readonly legend = propDefaultValues.hiddenLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;

  static readonly seriesLabel = propDefaultValues.seriesLabel;
}
