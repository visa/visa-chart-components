/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;

export class WorldMapDefaultValues {
  // base, margin and padding
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly mainTitle = 'This is the Map title';
  static readonly subTitle = 'This is the Map subtitle';
  static readonly height = 400;
  static readonly width = 500;
  static readonly margin = {
    top: 400 * 0.02,
    bottom: 400 * 0.02,
    right: 500 * 0.02,
    left: 500 * 0.02
  };
  static readonly padding = {
    top: 400 * 0.02,
    bottom: 400 * 0.02,
    right: 500 * 0.01,
    left: 500 * 0.01
  };

  // map
  static readonly mapProjection = 'Equal Earth';
  static readonly mapScaleZoom = 1.25;
  static readonly quality = 'High';

  // accessors
  static readonly markerAccessor = '';
  static readonly markerNameAccessor = '';
  static readonly joinAccessor = 'countryCode';
  static readonly joinNameAccessor = 'countryName';
  static readonly valueAccessor = 'value';
  static readonly latitudeAccessor = '';
  static readonly longitudeAccessor = '';
  static readonly groupAccessor = '';

  // accessibility
  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;

  // style
  static readonly showGridLines = false;
  static readonly sortOrder = propDefaultValues.sortOrder;
  static readonly colorPalette = propDefaultValues.colorPaletteSequential;
  static readonly colorSteps = propDefaultValues.colorSteps4;
  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;

  static readonly markerStyle = {
    visible: false,
    blend: false,
    fill: true,
    radius: 5,
    radiusRange: '',
    opacity: 1,
    color: 'base_grey',
    strokeWidth: 1
  };

  static readonly countryStyle = {
    fill: true,
    opacity: 0.8,
    color: 'base_grey',
    strokeWidth: 0.5
  };

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;
  static readonly cursor = propDefaultValues.cursor;
  static readonly suppressEvents = propDefaultValues.suppressEvents;

  static readonly dataLabel = propDefaultValues.hiddenDataLabel;
  static readonly legend = propDefaultValues.keyLegend;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;

  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
