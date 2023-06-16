/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class PieChartDefaultValues {
  static readonly mainTitle = 'Pie Chart Title';
  static readonly subTitle = "This is the pie chart's subtitle";
  static readonly centerTitle = '';
  static readonly centerSubTitle = '';
  static readonly height = 325;
  static readonly width = 600;
  static readonly margin = {
    top: 600 * 0.05,
    bottom: 600 * 0.05,
    right: 600 * 0.05,
    left: 600 * 0.05
  };
  static readonly padding = {
    top: 20,
    bottom: 50,
    right: 70,
    left: 70
  };

  static readonly localization = propDefaultValues.localization;

  static readonly ordinalAccessor = 'label';
  static readonly valueAccessor = 'value';
  static readonly innerRatio = 0.7;
  static readonly showEdgeLine = false;
  static readonly showPercentage = true;
  static readonly showLabelNote = true;
  static readonly labelOffset = 25;

  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;

  static readonly colorPalette = propDefaultValues.colorPaletteSequential;
  static readonly sortOrder = propDefaultValues.sortOrderAsc;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;
  static readonly referenceStyle = propDefaultValues.referenceStyle;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly cursor = propDefaultValues.cursor;

  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly dataLabel = propDefaultValues.dataLabelNormalizedOut;
  static readonly dataKeyNames;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;
  static readonly annotations = propDefaultValues.annotations;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
