/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class HeatMapDefaultValues {
  static readonly mainTitle = 'Heat Map Title';
  static readonly subTitle = "This is the heat map's subtitle";
  static readonly height = 250;
  static readonly width = 500;
  static readonly margin = {
    top: 250 * 0.01,
    bottom: 250 * 0.01,
    right: 500 * 0.01,
    left: 500 * 0.01
  };
  static readonly padding = {
    top: 20,
    bottom: 30,
    right: 60,
    left: 80
  };

  static readonly xAccessor = 'date';
  static readonly yAccessor = 'category';
  static readonly valueAccessor = 'value';

  static readonly shape = 'rect';
  static readonly hideAxisPath = propDefaultValues.showBaselineFalse;

  static readonly accessibility = propDefaultValues.accessibility;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;

  static readonly xAxis = propDefaultValues.xAxis;
  static readonly yAxis = propDefaultValues.yAxis;
  static readonly wrapLabel = propDefaultValues.wrapLabel;
  static readonly strokeWidth = propDefaultValues.strokeWidth2;

  static readonly colorPalette = propDefaultValues.colorPaletteSequential;
  static readonly colorSteps = propDefaultValues.colorSteps5;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;

  static readonly cursor = propDefaultValues.cursor;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;

  static readonly dataLabel = propDefaultValues.dataLabel;
  static readonly legend = propDefaultValues.legend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly referenceLines = propDefaultValues.referenceLines;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
