/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// import { darkerColor } from './colors';

export const accessibility = {
  longDescription: '',
  executiveSummary: '',
  purpose: '',
  contextExplanation: '',
  title: '',
  elementDescriptionAccessor: '',
  statisticalNotes: '',
  structureNotes: '',
  includeDataKeyNames: false,
  hideDataTableButton: false,
  disableValidation: false,
  elementsAreInterface: null,
  hideTextures: false,
  hideStrokes: false,
  showSmallLabels: false,
  showExperimentalTextures: false,
  keyboardNavConfig: {
    disabled: false
  }
};

export const highestHeadingLevel = 'h2';
export const sortOrder = '';
export const sortOrderAsc = 'asc';
export const sortOrderDesc = 'desc';
export const layout = 'vertical';

export const xAxis = {
  visible: true,
  gridVisible: true,
  label: 'X Axis',
  format: '0[.][0][0]a',
  tickInterval: 1
};

export const xAxisDate = {
  visible: true,
  gridVisible: false,
  label: 'X Axis',
  unit: 'month',
  format: '%b %y',
  tickInterval: 1
};

export const yAxis = {
  visible: true,
  gridVisible: true,
  label: 'Y Axis',
  format: '0[.][0][0]a',
  tickInterval: 1
};

export const wrapLabel = true;

export const colorPaletteSingle = 'single_blue';
export const colorPaletteSequential = 'sequential_suppPurple';
export const colorPaletteSequentialGrey = 'sequential_grey';
export const colorPaletteDiverging = 'diverging_RtoB';
export const colorPaletteCategorical = 'categorical';
export const colorSteps4 = 4;
export const colorSteps5 = 5;

export const hoverStyle = {
  color: '',
  strokeWidth: 2
};

export const clickStyle = {
  color: '',
  strokeWidth: 2
};

export const symbolHoverStyle = {
  color: '',
  strokeWidth: 2
};

export const symbolClickStyle = {
  color: '',
  strokeWidth: 3
};

export const referenceStyle = {
  color: 'pri_grey',
  strokeWidth: '1px',
  opacity: 1,
  dashed: ''
};

export const seriesLabel = {
  visible: true,
  placement: 'right',
  label: []
};

export const cursor = 'default';
export const hoverOpacity = 1;
export const strokeWidth1 = 1;
export const strokeWidth2 = 2;

export const roundedCorner = 0;
export const barIntervalRatio = 0.2;

export const dotRadius6 = 6;
export const dotRadius5 = 5;
export const dotRadius4 = 4;
export const dotOpacity = 1;
export const dotSymbols = ['circle'];
export const showDots = true;

export const showFitLine = false;
export const showBaselineTrue = true;
export const showBaselineFalse = false;

export const secondaryLines = {
  keys: [],
  showDataLabel: true,
  showSeriesLabel: true,
  opacity: 1
};

export const hiddenDataLabel = {
  visible: false,
  labelAccessor: '',
  format: ''
};

export const dataLabel = {
  visible: true,
  placement: 'top',
  labelAccessor: '',
  format: '0[.][0][0]a'
};

export const dataLabelMiddle = {
  visible: true,
  placement: 'middle',
  labelAccessor: '',
  format: '0[.][0][0]a'
};

export const dataLabelEnds = {
  visible: true,
  placement: 'ends',
  labelAccessor: '',
  format: '0[.][0][0]a'
};

export const dataLabelBottomRight = {
  visible: true,
  placement: 'bottom-right',
  labelAccessor: 'value',
  format: '0[.][0][0]a'
};

export const dataLabelNormalizedOut = {
  visible: true,
  placement: 'outside',
  labelAccessor: '',
  format: 'normalized'
};

export const tooltipLabel = {
  labelAccessor: [],
  labelTitle: [],
  format: ''
};

export const legend = {
  visible: true,
  interactive: false,
  format: '0[.][0][0]a',
  labels: ''
};

export const categoryLegend = {
  visible: true,
  interactive: false,
  format: '',
  labels: ''
};

export const keyLegend = {
  visible: true,
  interactive: false,
  type: 'key',
  format: '0[.][0][0]a',
  labels: ''
};

export const hiddenLegend = {
  visible: false,
  interactive: false,
  labels: ''
};

export const showTooltip = true;
export const suppressEvents = false;
export const referenceLines = [];
export const annotations = [];
export const clickHighlight = [];
