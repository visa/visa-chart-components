/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
export interface IWorldMapProps {
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
   * @groupName Base
   * @sortOrder 1 */
  mainTitle: string;

  /**
   * @shortDescription Subtitle of the chart. A string or an array of objects. Objects should contain text (one/multiple word(s)/number(s) as a single string) and color (HEX) keys. Optional key: index.
   * @controlName TextField
   * @groupName Base
   * @sortOrder 2 */
  subTitle: string | ISubTitleType;

  /**
   * @shortDescription Height of the chart area in pixels
   * @controlName Slider
   * @groupName Base
   * @sortOrder 3 */
  height: number;

  /**
   * @shortDescription Width of the chart area in pixels
   * @controlName Slider
   * @groupName Base
   * @sortOrder 4 */
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
   * @shortDescription  Key used to determine marker's key property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 3 */
  markerAccessor: string;

  /**
   * @shortDescription  Key used to determine marker's name property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 4 */
  markerNameAccessor: string;

  /**
   * @shortDescription  Key used to determine country's key property (ISO 3-Digit Code)
   * @controlName TextField
   * @groupName Data
   * @sortOrder 1 */
  joinAccessor: string;

  /**
   * @shortDescription  Key used to determine country's name property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 2 */
  joinNameAccessor: string;

  /**
   * @shortDescription  Key used to determine the country/marker's numeric property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 7 */
  valueAccessor: string;

  /**
   * @shortDescription  Key used to determine marker's latitude property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 5 */
  latitudeAccessor: string;

  /**
   * @shortDescription  Key used to determine marker's longitude property
   * @controlName TextField
   * @groupName Data
   * @sortOrder 6 */
  longitudeAccessor: string;

  /**
   * @shortDescription Can be used to sort the markers ascending/descending to ensure they are layered correctly
   * @controlName Radio
   * @groupName Data
   * @sortOrder 8 */
  sortOrder: string;

  /**
   * @shortDescription Overrides the calculated default min value for marker/color scales
   * @controlName TextField
   * @groupName Data
   * @sortOrder 9 */
  minValueOverride: number;

  /**
   * @shortDescription Overrides the calculated default max value for marker/color scales
   * @controlName TextField
   * @groupName Data
   * @sortOrder 10 */
  maxValueOverride: number;

  /**
   * @shortDescription Key used to determine country/marker color
   * @controlName TextField
   * @groupName Data */
  groupAccessor: string;

  /**
   * @shortDescription Sets the projection of the world-map to display * = Recommened for use.
   * @controlName Select
   * @groupName Map
   * @sortOrder 1 */
  mapProjection: string;

  /**
   * @shortDescription Adjusts the zoom of the map (take caution when modifying this prop).
   * @controlName Slider
   * @groupName Map
   * @sortOrder 2 */
  mapScaleZoom: number;

  /**
   * @shortDescription Sets the color palette of the countries/markers. Overridden by colors.
   * @controlName Select
   * @groupName Style */
  colorPalette: string;

  /**
   * @shortDescription Sets the quality of the map's vector shapes.
   * @controlName Select
   * @groupName Map */
  quality: string;

  /**
   * @shortDescription Accepts array of color strings or values to customize colors.
   * @controlName TextArea
   * @groupName Style */
  colors: string[];

  /**
   * @shortDescription Specifies the number of steps to use from colorPalette, overridden by colors.
   * @controlName Slider
   * @groupName Style */
  colorSteps: number;

  /**
   * @shortDescription Object for setting various style attribute for map dots/markers
   * @controlName TextArea
   * @groupName Markers */
  markerStyle: IMarkerStyleType;

  /**
   * @shortDescription Object for setting various style attribute for countries
   * @controlName TextArea
   * @groupName Countries */
  countryStyle: ICountryStyleType;

  /**
   * @shortDescription Sets the color and opacity of marker/countries during mouse over
   * @controlName TextArea
   * @groupName Style */
  hoverStyle: IHoverStyleType;

  /**
   * @shortDescription Sets the styling of markers/countries when they are selected
   * @controlName TextArea
   * @groupName Style */
  clickStyle: IClickStyleType;

  /**
   * @shortDescription Sets opacity of element on hovering it
   * @controlName Slider
   * @groupName Style */
  hoverOpacity: number;

  /**
   * @shortDescription Changes pointer type during mouse over on countries/markers
   * @controlName Radio
   * @groupName Style */
  cursor: string;

  /**
   * @shortDescription Sets visibility and label of chart legend
   * @controlName TextArea
   * @groupName Labels */
  legend: ILegendType;

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
   * @shortDescription Toggles whether to display background map gridlines
   * @controlName Toggle
   * @groupName Map */
  showGridlines: boolean;

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

export interface IDataLabelType {
  visible: boolean;
  placement?: string;
  labelAccessor?: string;
  format?: string;
  collisionHideOnly?: boolean;
  collisionPlacement?: string;
}

export interface IBoxModelType {
  top: number;
  bottom: number;
  right: number;
  left: number;
}
export interface ILegendType {
  visible: boolean;
  interactive?: boolean;
  type?: string;
  format?: string;
  labels?: string | string[];
}
export interface IMarkerStyleType {
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
export interface IHoverStyleType {
  color?: string;
  strokeWidth?: string;
}
export interface IClickStyleType {
  color?: string;
  opacity?: number;
  strokeWidth?: string;
  showLabels?: boolean;
}
export interface ITooltipLabelType {
  labelAccessor: string[];
  labelTitle?: string[];
  format: string | string[];
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
