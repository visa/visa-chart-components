/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IAlluvialDiagramProps {
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
   * @shortDescription Data used to create chart links
   * @controlName TextArea
   * @groupName Data */
  linkData: object[];

  /**
   * @shortDescription Data used to create chart nodes. If nodeData is not set, nodes will be auto generated based on linkData.
   * @controlName TextArea
   * @groupName Data */
  nodeData: object[];

  /**
   * @shortDescription ID used to identify chart (must be unique), helpful for validation messages. Defaults to UUID v4 standard.
   * @controlName TextField
   * @groupName Data */
  uniqueID: string;

  /**
   * @shortDescription  Key used to the origin for the stream, or where it flows from
   * @controlName TextField
   * @groupName Data */
  sourceAccessor: string;

  /**
   * @shortDescription  Key used to the destination for the stream, or where it flows to
   * @controlName TextField
   * @groupName Data */
  targetAccessor: string;

  /**
   * @shortDescription  Key used to determine flow's numeric property and width
   * @controlName TextField
   * @groupName Data */
  valueAccessor: string;

  /**
   * @shortDescription Key used set link color modes that are not based on target or source
   * @controlName TextField
   * @groupName Data */
  groupAccessor: string;

  /**
   * @shortDescription  Key used to determine the node ids, which targetAccessor and valueAccessor will use.
   * @controlName TextField
   * @groupName Data */
  nodeIDAccessor: string;

  /**
   * @shortDescription Sets the configuration and styling properties of nodes in the alluvial
   * @controlName TextArea
   * @groupName Nodes */
  nodeConfig: INodeConfigType;

  /**
   * @shortDescription Sets the configuration and styling properties of links in the alluvial
   * @controlName TextArea
   * @groupName Links */
  linkConfig: ILinkConfigType;

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
   * @shortDescription Adds annotations to the chart, see d3-annotation
   * @controlName TextArea
   * @groupName Annotations */
  annotations: object[];

  /**
   * @shortDescription Accepts array of color strings or values to customize line colors
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

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

interface IDataLabelType {
  visible: boolean;
  placement: string;
  labelAccessor: string;
  format: any;
  collisionHideOnly?: boolean;
  collisionPlacement?: string;
}
interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

interface IHoverStyleType {
  color: string;
  strokeWidth: string;
}
interface IClickStyleType {
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
interface INodeConfigType {
  fill: boolean;
  width: number;
  padding: number;
  alignment: string;
  compare: boolean;
}

interface ILinkConfigType {
  visible: boolean;
  fillMode: string;
  opacity: number;
}
