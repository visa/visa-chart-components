/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IHeatMapProps {
  /**
   * @shortDescription Internationalization properties of the chart
   * @controlName TextArea
   * @groupName Localization
   * @sortOrder 1 */
  localization: ILocalizationType;

  /**
   * @shortDescription Sets the heading level (which also sets sublevels) for the chart. "p", "span", and "div" are also valid.
   * @controlName Select
   * @groupName Base
   * @sortOrder 6 */
  highestHeadingLevel: string | number;

  /**
   * @shortDescription Main title of the chart
   * @controlName TextField
   * @groupName Base */
  mainTitle: string;

  /**
   * @shortDescription Subtitle of the chart
   * @controlName TextField
   * @groupName Base */
  subTitle: string;

  /**
   * @shortDescription Height of the chart area in pixels
   * @controlName Slider
   * @groupName Base */
  height: number;

  /**
   * @shortDescription Width of the chart area in pixels
   * @controlName Slider
   * @groupName Base */
  width: number;

  /**
   * @shortDescription Margin between the subtitle and the chart area, or between the title and chart area if no subtitle is specified
   * @controlName TextArea
   * @groupName Margin */
  margin: IBoxModelType;

  /**
   * @shortDescription Padding between plot area and axes lines
   * @controlName TextArea
   * @groupName Padding */
  padding: IBoxModelType;

  /**
   * @shortDescription Data used to create chart
   * @controlName TextArea
   * @groupName Data */
  data: object[];

  /**
   * @shortDescription ID used to identify chart (must be unique), helpful for validation messages. Defaults to UUID v4 standard.
   * @controlName TextField
   * @groupName Data */
  uniqueID: string;

  /**
   * @shortDescription Adds annotations to the chart, see d3-annotation
   * @controlName TextArea
   * @groupName Annotations */
  annotations: object[];

  /**
   * @shortDescription  Key used to determine the x-axis categorical value
   * @controlName TextField
   * @groupName Data */
  xAccessor: string;

  /**
   * @shortDescription  Key used to determine the y-axis categorical value
   * @controlName TextField
   * @groupName Data */
  yAccessor: string;

  /**
   * @shortDescription Key used to determine heatmap's numeric property, for assigning color
   * @controlName TextField
   * @groupName Data */
  valueAccessor: string;

  /**
   * @shortDescription Determine the order of x-axis categorical values
   * @controlName TextField
   * @groupName Data */
  xKeyOrder: string[];

  /**
   * @shortDescription Determine the order of y-axis categorical values
   * @controlName TextField
   * @groupName Data */
  yKeyOrder: string[];

  /**
   * @shortDescription Controls the visibility of the x-axis, the visibility of the grid, and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  xAxis: IAxisType;

  /**
   * @shortDescription Controls the visibility of the y-axis, the visibility of the grid, and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  yAxis: IAxisType;

  /**
   * @shortDescription When selected, wraps the ordinal tick labels
   * @controlName Toggle
   * @groupName Axes */
  wrapLabel: boolean;

  /**
   * @shortDescription Controls the visibility of legend, the type (default, gradient, key), the format and labels of legend values
   * @controlName TextArea
   * @groupName Labels */
  legend: ILegendType;

  /**
   * @shortDescription Controls the visibility axis path
   * @controlName Toggle
   * @groupName Axes */
  hideAxisPath: boolean;

  /**
   * @shortDescription Manages messages and settings for chart accessibility
   * @controlName TextArea
   * @groupName Accessibility */
  accessibility: IAccessibilityType;

  /**
   * @shortDescription Manages settings for chart animation, property 'disabled' defaults to false or undefined
   * @controlName TextArea
   * @groupName Accessibility */
  animationConfig: IAnimationConfig;

  /**
   * @shortDescription Sets the color palette of the bars. Overridden by colors.
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Accepts array of color strings or values to customize colors.
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

  /**
   * @shortDescription Sets numbers of heatmap color steps
   * @controlName Slider
   * @groupName Style */
  colorSteps: number;

  /**
   * @shortDescription Sets the color and opacity of bar during mouse over
   * @controlName TextArea
   * @groupName Style */
  hoverStyle: IHoverStyleType;

  /**
   * @shortDescription Sets the styling of a bars when they are selected
   * @controlName TextArea
   * @groupName Style */
  clickStyle: IClickStyleType;

  /**
   * @shortDescription Changes pointer type during mouse over on grids
   * @controlName Radio
   * @groupName Style */
  cursor: string;

  /**
   * @shortDescription Changes grid shape (rect / circle)
   * @controlName Radio
   * @groupName Style */
  shape: string;

  /**
   * @shortDescription Changes stroke width of grids
   * @controlName Slider
   * @groupName Style */
  strokeWidth: string;

  /**
   * @shortDescription Sets the opacity of all other grids other than the one the mouse is over
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Controls visibility, styling and placement of data labels
   * @controlName TextArea
   * @groupName Labels */
  dataLabel: IDataLabelType;

  /**
   * @shortDescription Enables custom, user friendly names for data keys
   * @controlName TextArea
   * @groupName Labels */
  dataKeyNames: object;

  /**
   * @shortDescription When selected, allows tooltips to be displayed
   * @controlName Toggle
   * @groupName Labels */
  showTooltip: boolean;

  /**
   * @shortDescription Overrides the calculated default max value
   * @controlName TextField
   * @groupName Axes */
  maxValueOverride: number;

  /**
   * @shortDescription Overrides the calculated default min value
   * @controlName TextField
   * @groupName Axes */
  minValueOverride: number;

  /**
   * @shortDescription Customize the tooltip content
   * @controlName TextArea
   * @groupName Labels */
  tooltipLabel: ITooltipLabelType;

  /**
   * @shortDescription Sets the column names of data to interact with
   * @controlName TextArea
   * @groupName Style */
  interactionKeys: string[];

  /**
   * @shortDescription Suppresses and disables all event emitters. Setting to true can increase performance for non-interactive charts.
   * @controlName Toggle
   * @groupName Events */
  suppressEvents: boolean;

  /**
   * @shortDescription Set a callback for click event on each data point.
   * @controlName Toggle
   * @groupName Events */
  clickEvent: any;

  /**
   * @shortDescription Set a callback to execute when mouse enters the chart.
   * @controlName Toggle
   * @groupName Events */
  hoverEvent: any;

  /**
   * @shortDescription Set a callback to execute when mouse leaves the chart.
   * @controlName Toggle
   * @groupName Events */
  mouseOutEvent: any;

  /**
   * @shortDescription Set a callback to execute when chart initially loads.
   * @controlName Toggle
   * @groupName Events */
  initialLoadEvent: any;

  /**
   * @shortDescription Set a callback to execute when chart's initial load ends.
   * @controlName Toggle
   * @groupName Events */
  initialLoadEndEvent: any;

  /**
   * @shortDescription Set a callback to execute when chart drawing starts.
   * @controlName Toggle
   * @groupName Events */
  drawStartEvent: any;

  /**
   * @shortDescription Set a callback to execute when chart drawing ends.
   * @controlName Toggle
   * @groupName Events */
  drawEndEvent: any;

  /**
   * @shortDescription Set a callback to execute when chart geometry transitions end.
   * @controlName Toggle
   * @groupName Events */
  transitionEndEvent: any;

  /**
   * @shortDescription
   * @controlName TextArea
   * @groupName Style */
  hoverHighlight: object;

  /**
   * @shortDescription
   * @controlName TextArea
   * @groupName Style */
  clickHighlight: object[];
}

export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
export interface ILegendType {
  visible: boolean;
  labels?: string[];
  interactive?: boolean;
  format?: string;
  type?: string;
}

export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: string;
}

export interface IAxisType {
  visible: boolean;
  gridVisible?: boolean;
  label?: string;
  format?: string;
  tickInterval?: number;
  placement?: string;
}

export interface IHoverStyleType {
  color: string;
  strokeWidth: string | number;
}

export interface IClickStyleType {
  color: string;
  strokeWidth: string | number;
}

export interface ILocalizationType {
  language?: string | object;
  numeralLocale?: string | object;
  skipValidation?: boolean;
  overwrite?: boolean;
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
  keyboardNavConfig?: IKeyConfig;
}
export interface IAnimationConfig {
  disabled?: boolean;
}
export interface IKeyConfig {
  disabled?: boolean;
}
export interface ITooltipLabelType {
  labelAccessor: string[];
  labelTitle: string[];
  format: string | string[];
}
