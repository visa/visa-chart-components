/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IDumbbellPlotProps {
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
   * @shortDescription  Key used to determine bars' categorical property
   * @controlName TextField
   * @groupName Data */
  ordinalAccessor: string;

  /**
   * @shortDescription  Key used to determine bars' numeric property
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
  xAxis: IAxisType;

  /**
   * @shortDescription Controls the visibility of the y-axis, the visibility of the grid, and the axis label and formatting
   * @controlName TextArea
   * @groupName Axes */
  yAxis: IAxisType;

  /**
   * @shortDescription When selected and layout = vertical, shows the x baseline
   * @controlName Toggle
   * @groupName Axes */
  showBaselineX: boolean;

  /**
   * @shortDescription When selected and layout = horizontal, shows the y baseline
   * @controlName Toggle
   * @groupName Axes */
  showBaselineY: boolean;

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
   * @shortDescription Sets the color palette of the bars (overridden by colors)
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Sorts the dumbbells by difference (will not sort if ordinalAccessor is a Date object)
   * @controlName Select
   * @groupName Data */
  sortOrder: string;

  /**
   * @shortDescription Displays dumbbells in chart vertically or horizontally. If ordinal accessor is a date, dumbells will only display vertically.
   * @controlName Radio
   * @groupName Base */
  layout: string;

  /**
   * @shortDescription Changes the width of bar on hover
   * @controlName TextArea
   * @groupName Style */
  hoverStyle: IHoverStyleType;

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
   * @shortDescription Accepts array of color strings or values to customize bar colors
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

  /**
   * @shortDescription Adds annotations to the chart, see d3-annotation
   * @controlName TextArea
   * @groupName Annotations */
  annotations: object[];

  /**
   * @shortDescription Optional: specifies the key value and size to focus one marker (based on seriesAccessor)
   * @controlName TextField
   * @groupName Marker */
  focusMarker: IFocusStyleType;

  /**
   * @shortDescription Sets the visibility, type, and size of the bar marker
   * @controlName TextField
   * @groupName Marker */
  marker: IMarkerStyleType;

  /**
   * @shortDescription Set styling for the bar (opacity, width, and rule for color)
   * @controlName TextField
   * @groupName Bar */
  barStyle: IBarStyleType;

  /**
   * @shortDescription Sets the opacity of all other bars other than the one the mouse is over
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Changes pointer type during mouse over on bars
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
  seriesLabel: ISeriesLabelType;

  /**
   * @shortDescription Controls visibility, placement and calculation (difference or absolute difference) of diff labels
   * @controlName TextArea
   * @groupName Labels */
  differenceLabel: IDifferenceLabelType;

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
   * @controlName TextArea
   * @groupName Events */
  clickFunc: any;

  /**
   * @shortDescription Set a callback to execute when mouse enters the chart.
   * @controlName TextArea
   * @groupName Events */
  hoverFunc: any;

  /**
   * @shortDescription Set a callback to execute when mouse leaves the chart.
   * @controlName TextArea
   * @groupName Events */
  mouseOutFunc: any;

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
export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: string;
}
export interface IFocusStyleType {
  key: string;
  sizeFromBar: number;
}
export interface IBarStyleType {
  opacity: number;
  width: number;
  colorRule: string;
}
export interface IMarkerStyleType {
  visible: boolean;
  type: string;
  sizeFromBar: number;
}
export interface IAxisType {
  visible: boolean;
  gridVisible?: boolean;
  label?: string;
  format?: string;
  tickInterval?: number;
  unit?: string;
}
export interface ISeriesLabelType {
  visible: boolean;
  placement: string;
  label: string | string[];
  format?: string;
}
export interface IDifferenceLabelType {
  visible: boolean;
  placement: string;
  calculation: string;
  format: any;
}
export interface ILegendType {
  visible: boolean;
  labels?: string[];
  interactive?: boolean;
  format?: string;
}
export interface IReferenceStyleType {
  color: string;
  strokeWidth: string;
  opacity: number;
  dashed: string;
}

export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
export interface IHoverStyleType {
  color?: string;
  strokeWidth?: number;
}

export interface IClickStyleType {
  color?: string;
  strokeWidth?: number;
}

export interface ITooltipLabelType {
  labelAccessor: string[];
  labelTitle: string[];
  format: string | string[];
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
  elementsAreInterface?: boolean;
  onChangeFunc?: any;
}
