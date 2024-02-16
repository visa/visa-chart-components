/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IScatterPlotProps {
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
   * @shortDescription Subtitle of the chart. A string or an array of objects. Objects should contain text (one/multiple word(s)/number(s) as a single string) and color (HEX) keys. Optional key: index.
   * @controlName TextField
   * @groupName Base */
  subTitle: string | ISubTitleType;

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
   * @shortDescription  Key used to determine the x-axis value
   * @controlName TextField
   * @groupName Data */
  xAccessor: string;

  /**
   * @shortDescription  Key used to determine the y-axis value
   * @controlName TextField
   * @groupName Data */
  yAccessor: string;

  /**
   * @shortDescription Key used to determine groups of data points, for assigning symbols and color
   * @controlName TextField
   * @groupName Data */
  groupAccessor: string;

  /**
   * @shortDescription Controls the visibility of the x-axis, the visibility of the grid and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  xAxis: IAxisType;

  /**
   * @shortDescription Controls the visibility of the y-axis, the visibility of the grid and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  yAxis: IAxisType;

  /**
   * @shortDescription Sets visibility and label of chart legend
   * @controlName TextArea
   * @groupName Labels */
  legend: ILegendType;

  /**
   * @shortDescription Sets the color of the elements, assigned using groupAccessor (overridden by colors)
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Accepts array of color strings or values to customize data points, assigned using groupAccessor
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

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
   * @shortDescription Sets the radius of data points
   * @controlName Slider
   * @groupName Marker */
  dotRadius: number;

  /**
   * @shortDescription Sets the opacity of data points, if present
   * @controlName Slider
   * @groupName Marker */
  dotOpacity: number;

  /**
   * @shortDescription Sets the styling of the reference line
   * @controlName TextArea
   * @groupName Reference_Lines */
  referenceStyle: IReferenceStyleType;

  /**
   * @shortDescription Sets the styling of the fit line
   * @controlName TextArea
   * @groupName Reference_Lines */
  fitLineStyle: IReferenceStyleType;

  /**
   * @shortDescription Displays a filled line at x-axis baseline 0
   * @controlName Toggle
   * @groupName Axes */
  showBaselineX: boolean;

  /**
   * @shortDescription Displays a filled line at y-axis baseline 0
   * @controlName Toggle
   * @groupName Axes */
  showBaselineY: boolean;

  /**
   * @shortDescription Array to assign symbols with groupAccessor (circle, cross, diamond, square, star, triangle)
   * @controlName TextArea
   * @groupName Marker */
  dotSymbols: string[];

  /**
   * @shortDescription Sets the opacity of all other dots other than the one the mouse is over
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Changes pointer type during mouse over on dots
   * @controlName Radio
   * @groupName Style */
  cursor: string;

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
   * @shortDescription Controls size, dual color encoding and range of size for marks
   * @controlName TextArea
   * @groupName Marker */
  sizeConfig: ISizeConfigType;

  /**
   * @shortDescription When selected, allows tooltips to be displayed
   * @controlName Toggle
   * @groupName Labels */
  showTooltip: boolean;

  /**
   * @shortDescription Customize the tooltip content
   * @controlName TextArea
   * @groupName Labels */
  tooltipLabel: ITooltipLabelType;

  /**
   * @shortDescription Overrides the calculated default max value of the x-axis
   * @controlName TextField
   * @groupName Axes */
  xMaxValueOverride: number;

  /**
   * @shortDescription Overrides the calculated default min value of the x-axis
   * @controlName TextField
   * @groupName Axes */
  xMinValueOverride: number;

  /**
   * @shortDescription Overrides the calculated default max value of the y-axis
   * @controlName TextField
   * @groupName Axes */
  yMaxValueOverride: number;

  /**
   * @shortDescription Overrides the calculated default min value of the y-axis
   * @controlName TextField
   * @groupName Axes */
  yMinValueOverride: number;

  /**
   * @shortDescription When selected, displays a linear regression line
   * @controlName Toggle
   * @groupName Reference_Lines */
  showFitLine: boolean;

  /**
   * @shortDescription Data that sets the location and labeling of the reference line(s)
   * @controlName TextArea
   * @groupName Reference_Lines */
  referenceLines: object[];

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

export interface IAxisType {
  visible: boolean;
  gridVisible?: boolean;
  label?: string;
  format?: string;
  tickInterval?: number;
  placement?: string;
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

export interface IReferenceStyleType {
  color: string;
  strokeWidth: string;
  opacity: number;
  dashed: string;
}
export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: string;
  collisionHideOnly?: boolean;
  collisionPlacement?: string;
}
export interface ISizeConfigType {
  sizeAccessor?: string;
  minValueOverride?: number;
  maxValueOverride?: number;
  minSizeOverride?: number;
  maxSizeOverride?: number;
  dualEncodeColor?: boolean;
  format?: string;
}

export interface ITooltipLabelType {
  labelAccessor: string[];
  labelTitle: string[];
  format: string | string[];
}

export interface IHoverStyleType {
  color?: string;
  strokeWidth?: number;
}

export interface IClickStyleType {
  color?: string;
  strokeWidth?: number;
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

export interface ISubTitleType {
  text?: string;
  keywordsHighlight?: object[];
}
