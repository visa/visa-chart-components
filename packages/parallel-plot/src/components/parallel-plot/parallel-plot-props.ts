/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IParallelPlotProps {
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
   * @shortDescription  Key used to determine line's categorical property
   * @controlName TextField
   * @groupName Data */
  ordinalAccessor: string;

  /**
   * @shortDescription  Key used to determine line's numeric property
   * @controlName TextField
   * @groupName Data */
  valueAccessor: string;

  /**
   * @shortDescription Key used to determine series
   * @controlName TextField
   * @groupName Data */
  seriesAccessor: string;

  /**
   * @shortDescription Controls the visibility of the x-axis, the visibility of the grid, and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  xAxis: IXAxisType;

  /**
   * @shortDescription Controls the visibility of the y-axis, the visibility of the grid, and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  yAxis: IYAxisType;

  /**
   * @shortDescription When selected, shows the x baseline
   * @controlName Toggle
   * @groupName Axes */
  showBaselineX: boolean;

  /**
   * @shortDescription When selected, wraps the ordinal tick labels
   * @controlName Toggle
   * @groupName Axes */
  wrapLabel: boolean;

  /**
   * @shortDescription Sets visibility and label of chart legend
   * @controlName TextArea
   * @groupName Labels */
  legend: ILegendType;

  /**
   * @shortDescription Sets the color palette of the lines (overridden by colors)
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Changes the stroke width of line on hover
   * @controlName TextArea
   * @groupName Style */
  hoverStyle: IHoverStyleType; // object that holds a number. changes stroke width on hover

  /**
   * @shortDescription Sets the styling of a bars when they are selected
   * @controlName TextArea
   * @groupName Style */
  clickStyle: IClickStyleType;

  /**
   * @shortDescription Sets the styling of the reference line
   * @controlName TextArea
   * @groupName Reference_Line */
  referenceStyle: IReferenceStyleType;

  /**
   * @shortDescription Accepts array of color strings or values to customize line colors
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

  /**
   * @shortDescription Stroke width of series lines
   * @controlName Slider
   * @groupName Style */
  strokeWidth: number;

  /**
   * @shortDescription When selected, adds data points to line chart
   * @controlName Toggle
   * @groupName Style */
  showDots: boolean;

  /**
   * @shortDescription Sets the radius of data points, if present
   * @controlName Slider
   * @groupName Style */
  dotRadius: number;

  /**
   * @shortDescription Array of values used to classify series as secondary
   * @controlName TextArea
   * @groupName Data */
  secondaryLines: ISecondaryType;

  /**
   * @shortDescription Sets the opacity of all other lines other than the one the mouse is over
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Changes pointer type during mouse over on lines
   * @controlName Radio
   * @groupName Style */
  cursor: string;

  /**
   * @shortDescription Controls visibility, styling and placement of data labels
   * @controlName TextArea
   * @groupName Labels */
  dataLabel: IDataLabelType;

  /**
   * @shortDescription Controls visibility, styling and placement of series labels
   * @controlName TextArea
   * @groupName Labels */
  seriesLabel: ISeriesLabel;

  /**
   * @shortDescription When selected, allows tooltips to be displayed
   * @controlName Toggle
   * @groupName Labels */
  showTooltip: boolean;

  /**
   * @shortDescription Customize the tooltip content
   * @controlName TextArea
   * @groupName Labels */
  tooltipLabel: ITooltipLabel;

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
   * @shortDescription Data that sets the location and labeling of the reference line
   * @controlName TextArea
   * @groupName Reference_Line */
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
interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: any;
  collisionHideOnly?: boolean;
  collisionPlacement?: string;
}
interface IXAxisType {
  visible: boolean;
  label: string;
  format: any;
  tickInterval: number;
}
interface IYAxisType {
  visible: boolean;
  gridVisible: boolean;
  format: any;
  tickInterval: number;
  scales: string;
  onlyTickExtents: boolean;
  label: string;
}
interface ISeriesLabel {
  visible: boolean;
  placement?: string;
  label?: string | string[]; // this is incorrect and currently breaking if set to string[]
  collisionHideOnly?: boolean;
  collisionPlacement?: string;
}
interface ISecondaryType {
  keys: any;
  showDataLabel: boolean;
  showSeriesLabel: boolean;
  opacity: number;
}
interface ILegendType {
  visible: boolean;
  label: any;
  interactive: boolean;
}
interface IReferenceStyleType {
  color: string;
  strokeWidth: string;
  opacity: number;
  dashed: string;
}
interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
interface IClickStyleType {
  strokeWidth: string;
  color: string;
}
interface IHoverStyleType {
  color: string;
  strokeWidth: string;
}
interface ITooltipLabel {
  labelAccessor: string;
  labelTitle: string;
  format: any;
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
