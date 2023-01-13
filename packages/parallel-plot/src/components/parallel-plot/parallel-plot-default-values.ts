/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;
export class ParallelPlotDefaultValues {
  static readonly mainTitle = 'Parallel Plot Title';
  static readonly subTitle = "This is the parallel plot's subtitle";
  static readonly height = 300;
  static readonly width = 500;
  static readonly margin = {
    top: 300 * 0.01,
    bottom: 300 * 0.01,
    right: 500 * 0.01,
    left: 500 * 0.01
  };
  static readonly padding = {
    top: 20,
    bottom: 50,
    right: 100,
    left: 75
  };

  static readonly ordinalAccessor = 'label';
  static readonly valueAccessor = 'value';
  static readonly seriesAccessor = 'series';

  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly xAxis = propDefaultValues.xAxis;
  static readonly yAxis = propDefaultValues.yAxis;
  static readonly showBaselineX = propDefaultValues.showBaselineFalse;
  static readonly wrapLabel = propDefaultValues.wrapLabel;
  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;

  static readonly referenceStyle = propDefaultValues.referenceStyle;

  static readonly strokeWidth = propDefaultValues.strokeWidth1;
  static readonly showDots = propDefaultValues.showDots;
  static readonly dotRadius = propDefaultValues.dotRadius4;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly cursor = propDefaultValues.cursor;

  static readonly dataLabel = propDefaultValues.dataLabelBottomRight;
  static readonly dataKeyNames;
  static readonly seriesLabel = propDefaultValues.seriesLabel;
  static readonly legend = propDefaultValues.hiddenLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;
  static readonly secondaryLines = propDefaultValues.secondaryLines;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
