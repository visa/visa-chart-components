/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';
const { propDefaultValues } = Utils;

export class CirclePackingDefaultValues {
  static readonly mainTitle = 'Circle Packing Title';
  static readonly subTitle = "This is the circle packing chart's subtitle";
  static readonly height = 400;
  static readonly width = 400;
  static readonly circlePadding = 5;
  static readonly margin = {
    top: 400 * 0.01,
    bottom: 400 * 0.01,
    right: 400 * 0.01,
    left: 400 * 0.01
  };
  static readonly padding = {
    top: 400 * 0.01,
    bottom: 400 * 0.01,
    right: 400 * 0.01,
    left: 400 * 0.01
  };
  static readonly dataDepth = 5;
  static readonly displayDepth = 2;
  static readonly parentAccessor = 'parentNode';
  static readonly nodeAccessor = 'childNode';
  static readonly sizeAccessor = 'value';
  static readonly colorPalette = propDefaultValues.colorPaletteSequentialGrey;

  static readonly dataLabel = propDefaultValues.dataLabelCenter;
  static readonly dataKeyNames;
  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly cursor = propDefaultValues.cursor;
  static readonly interactionKeys = propDefaultValues.interactionKeys;
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;

  static readonly annotations = propDefaultValues.annotations;
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;

  static readonly tooltipLabel = propDefaultValues.tooltipLabel;
  static readonly showTooltip = propDefaultValues.showTooltip;

  static readonly clickHighlight = propDefaultValues.clickHighlight;
  static readonly hoverHighlight;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
}
