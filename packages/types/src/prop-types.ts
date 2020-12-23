/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: any;
}

export interface IAxisType {
  visible: boolean;
  gridVisible?: boolean;
  label?: string;
  format?: string;
  tickInterval?: number;
  unit?: string;
  placement?: string;
  scales?: string;
  onlyTickExtents?: boolean;
}

export interface ILegendType {
  visible: boolean;
  labels?: string | string[];
  interactive?: boolean;
  format?: string;
  type?: string;
}
export interface IHoverStyleType {
  color?: string;
  strokeWidth?: string | number;
}

export interface IClickStyleType {
  color?: string;
  strokeWidth?: string | number;
}

export interface IAccessibilityType {
  longDescription?: string;
  executiveSummary?: string;
  purpose?: string;
  contextExplanation?: string;
  title?: string;
  elementDescriptionAccessor?: string;
  statisticalNotes?: string;
  structureNotes?: string;
  includeDataKeyNames?: boolean;
  hideDataTableButton?: boolean;
  disableValidation?: boolean;
  elementsAreInterface?: any;
  onChangeFunc?: any;
  hideTextures?: boolean;
  hideStrokes?: boolean;
  showSmallLabels?: boolean;
  showExperimentalTextures?: boolean;
}

export interface IReferenceStyleType {
  color?: string;
  strokeWidth?: string;
  opacity?: number;
  dashed?: string;
}

export interface ITooltipLabelType {
  labelAccessor: string[];
  labelTitle: string[];
  format: any[];
}

export interface IFocusStyleType {
  key?: string;
  sizeFromBar?: number;
}
export interface IBarStyleType {
  opacity?: number;
  width?: number;
  colorRule?: string;
}
export interface IMarkerStyleType {
  visible: boolean;
  type?: string;
  sizeFromBar?: number;
}
export interface ISeriesLabelType {
  visible: boolean;
  placement?: string;
  label?: string | string[];
  format?: string;
}

export interface IDifferenceLabelType {
  visible: boolean;
  placement?: string;
  calculation?: string;
  format?: any;
}

export interface IMapMarkerStyleType {
  visible: boolean;
  fill?: boolean;
  blend?: boolean;
  radius?: number;
  radiusRange?: string | number[];
  opacity?: number;
  color?: string;
  strokeWidth?: string;
}
export interface ICountryStyleType {
  fill: boolean;
  opacity?: number;
  color?: string;
  strokeWidth?: string;
}
export interface ISecondaryLinesType {
  keys: string[];
  showDataLabel: boolean;
  showSeriesLabel: boolean;
  opacity: number;
}
