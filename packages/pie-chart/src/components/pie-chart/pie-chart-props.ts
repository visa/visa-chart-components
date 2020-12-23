/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IPieChartProps {
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
   * @shortDescription If specified, adds a main title to the center of the donut chart
   * @controlName TextField
   * @groupName Base */
  centerTitle: string;

  /**
   * @shortDescription If specified, adds a subtitle to the center of the donut chart
   * @controlName TextField
   * @groupName Base */
  centerSubTitle: string;

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
  // innerTitle: string;

  /**
   * @shortDescription Manages messages and settings for chart accessibility
   * @controlName TextArea
   * @groupName Accessibility */
  accessibility: IAccessibilityType;

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
   * @shortDescription  Key used to determine pie's categorical property
   * @controlName TextField
   * @groupName Data */
  ordinalAccessor: string;

  /**
   * @shortDescription  Key used to determine pie's numeric property
   * @controlName TextField
   * @groupName Data */
  valueAccessor: string;

  /**
   * @shortDescription Sorts the bars into asceneding or descending order, or clears all sorting
   * @controlName Radio
   * @groupName Data */
  sortOrder: string;

  /**
   * @shortDescription Sets the color palette used in the chart (overriden by colors)
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Accepts array of color strings or values to customize slice colors
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

  /**
   * @shortDescription Sets the size of the filled circle in the middle of the pie as a proportion of the total pie
   * @controlName Slider
   * @groupName Style */
  innerRatio: number;

  /**
   * @shortDescription Displays edge line around each section
   * @controlName Toggle
   * @groupName Style */
  showEdgeLine: boolean;

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
   * @shortDescription Sets the styling of the reference line
   * @controlName TextArea
   * @groupName Reference_Line */
  referenceStyle: IReferenceStyleType;

  /**
   * @shortDescription Changes pointer type during mouse over on pies
   * @controlName Radio
   * @groupName Style */
  cursor: string;

  /**
   * @shortDescription Sets the opacity of all other pies other than the one the mouse is over
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Displays data label value as a percentage of the whole
   * @controlName Toggle
   * @groupName Labels */
  showPercentage: boolean;

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
   * @shortDescription When selected, adds data labels
   * @controlName TextArea
   * @groupName Labels */
  dataLabel: IDataLabelType;

  /**
   * @shortDescription When selected, allows label notes to be displayed
   * @controlName Toggle
   * @groupName Labels */
  showLabelNote: boolean;

  /**
   * @shortDescription Sets distance of labels from chart
   * @controlName Slider
   * @groupName Labels */
  labelOffset: number;

  /**
   * @shortDescription Data used to set the location and labeling of the reference line
   * @controlName TextArea
   * @groupName Reference_Line */
  referenceData: object[];

  /**
   * @shortDescription Sets the column names of data to interact with
   * @controlName TextArea
   * @groupName Style */
  interactionKeys: any[];

  /**
   * @shortDescription Set a callback for click event on each data point.
   * @controlName TextArea
   * @groupName Events */
  clickFunc: any;

  /**
   * @shortDescription Suppresses and disables all event emitters. Setting to true can increase performance for non-interactive charts.
   * @controlName Toggle
   * @groupName Events */
  suppressEvents: boolean;

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
  hoverHighlight: any;
  /**
   * @shortDescription
   * @controlName TextArea
   * @groupName Style */
  clickHighlight: any[];
}
export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: string;
}
export interface IHoverStyleType {
  color: string;
  strokeWidth: string | number;
}

export interface IClickStyleType {
  color: string;
  strokeWidth: string | number;
}
export interface IReferenceStyleType {
  color?: string;
  strokeWidth?: string;
  opacity?: number;
  dashed?: string;
}

export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
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
  elementsAreInterface?: any;
  onChangeFunc?: any;
}
