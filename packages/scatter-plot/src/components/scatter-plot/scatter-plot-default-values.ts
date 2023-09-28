/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class ScatterPlotDefaultValues {
  static readonly mainTitle = 'Scatter Plot Title';
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
    left: 60
  };

  static readonly localization = propDefaultValues.localization;

  static readonly xAccessor = 'metric';
  static readonly yAccessor = 'value';
  static readonly groupAccessor = 'category';

  static readonly sizeConfig = propDefaultValues.sizeConfig;
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly sortOrder = propDefaultValues.sortOrder;
  static readonly xAxis = propDefaultValues.xAxis;

  static readonly yAxis = propDefaultValues.yAxis;
  static readonly showBaselineX = propDefaultValues.showBaselineTrue;
  static readonly showBaselineY = propDefaultValues.showBaselineFalse;

  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;
  static readonly dotRadius = propDefaultValues.dotRadius6;
  static readonly dotOpacity = propDefaultValues.dotOpacity;
  static readonly dotSymbols = propDefaultValues.dotSymbols;

  static readonly referenceStyle = propDefaultValues.referenceStyle;
  static readonly showFitLine = propDefaultValues.showFitLine;
  static readonly fitLineStyle = propDefaultValues.referenceStyle;

  static readonly cursor = propDefaultValues.cursor;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly hoverStyle = propDefaultValues.symbolHoverStyle;
  static readonly clickStyle = propDefaultValues.symbolClickStyle;

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
