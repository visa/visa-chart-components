/**
 * Copyright (c) 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import Utils from '@visa/visa-charts-utils';

const { propDefaultValues } = Utils;
export class AlluvialDiagramDefaultValues {
  static readonly highestHeadingLevel = propDefaultValues.highestHeadingLevel;
  static readonly mainTitle = 'Alluvial Diagram Title';
  static readonly subTitle = "This is the alluvial diagram's subtitle";
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

  static readonly sourceAccessor = 'source';
  static readonly targetAccessor = 'target';
  static readonly valueAccessor = 'value';
  static readonly groupAccessor = '';
  // static readonly labelAccessor = '';
  static readonly nodeIDAccessor = 'id';

  static readonly nodeConfig = {
    fill: false,
    width: 12,
    padding: 20,
    alignment: 'left',
    compare: false
  };

  static readonly linkConfig = {
    visible: true,
    fillMode: 'none',
    opacity: 0.3
  };

  static readonly accessibility = propDefaultValues.accessibility;
  static readonly animationConfig = propDefaultValues.animationConfig;
  static readonly colorPalette = propDefaultValues.colorPaletteCategorical;
  static readonly dataLabel = propDefaultValues.dataLabel;
  static readonly dataKeyNames;
  static readonly annotations = propDefaultValues.annotations;

  static readonly hoverStyle = propDefaultValues.hoverStyle;
  static readonly clickStyle = propDefaultValues.clickStyle;
  static readonly hoverOpacity = propDefaultValues.hoverOpacity;
  static readonly cursor = propDefaultValues.cursor;
  static readonly tooltipLabel = propDefaultValues.tooltipLabel;
  static readonly showTooltip = propDefaultValues.showTooltip;
  static readonly suppressEvents = propDefaultValues.suppressEvents;
  static readonly hoverHighlight;
  static readonly clickHighlight = propDefaultValues.clickHighlight;
}
