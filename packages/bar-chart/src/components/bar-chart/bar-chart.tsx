/**
 * Copyright (c) 2020, 2021, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection';
import { max, min, minIndex, maxIndex } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { easeCircleIn } from 'd3-ease';
import { nest } from 'd3-collection';
import {
  IBoxModelType,
  ILocalizationType,
  IHoverStyleType,
  IClickStyleType,
  IAxisType,
  IReferenceStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  IAnimationConfig,
  ILegendType,
  ISubTitleType
} from '@visa/charts-types';
import { BarChartDefaultValues } from './bar-chart-default-values';
import { v4 as uuid } from 'uuid';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';

const {
  getGlobalInstances,
  configLocalization,
  getActiveLanguageString,
  prepareStrokeColorsFromScheme,
  calculateLuminance,
  verifyTextHasSpace,
  checkAttributeTransitions,
  createTextStrokeFilter,
  drawHoverStrokes,
  removeHoverStrokes,
  buildStrokes,
  convertColorsToTextures,
  initializeElementAccess,
  initializeDescriptionRoot,
  setElementFocusHandler,
  setElementAccessID,
  setAccessibilityController,
  hideNonessentialGroups,
  setAccessTitle,
  setAccessSubtitle,
  setAccessLongDescription,
  setAccessExecutiveSummary,
  setAccessPurpose,
  setAccessContext,
  setAccessStatistics,
  setAccessChartCounts,
  setAccessXAxis,
  setAccessYAxis,
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  setAccessibilityDescriptionWidth,
  autoTextColor,
  annotate,
  chartAccessors,
  checkInteraction,
  checkClicked,
  checkHovered,
  checkLabelDisplayOnly,
  convertVisaColor,
  drawAxis,
  drawGrid,
  drawLegend,
  setSubTitle,
  setReferenceLine,
  setLegendInteractionState,
  drawTooltip,
  formatDataLabel,
  getColors,
  getLicenses,
  getPadding,
  getScopedData,
  initTooltipStyle,
  placeDataLabels,
  overrideTitleTooltip,
  transitionEndAll,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps,
  validateLocalizationProps,
  findTagLevel,
  prepareRenderChange,
  roundTo,
  resolveLabelCollision,
  halve
} = Utils;

@Component({
  tag: 'bar-chart',
  styleUrl: 'bar-chart.scss'
})
export class BarChart {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) localization: ILocalizationType = BarChartDefaultValues.localization;
  @Prop({ mutable: true }) mainTitle: string = BarChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string | ISubTitleType = BarChartDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = BarChartDefaultValues.height;
  @Prop({ mutable: true }) width: number = BarChartDefaultValues.width;
  @Prop({ mutable: true }) layout: string = BarChartDefaultValues.layout;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = BarChartDefaultValues.highestHeadingLevel;

  @Prop({ mutable: true }) margin: IBoxModelType = BarChartDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = BarChartDefaultValues.padding;

  // Data (2/6)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = BarChartDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = BarChartDefaultValues.valueAccessor;
  @Prop({ mutable: true }) groupAccessor: string = BarChartDefaultValues.groupAccessor;
  @Prop({ mutable: true }) sortOrder: string = BarChartDefaultValues.sortOrder;

  // Axis (3/3)
  @Prop({ mutable: true }) xAxis: IAxisType = BarChartDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = BarChartDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = BarChartDefaultValues.wrapLabel;

  // Color & Shape (4/10)
  @Prop({ mutable: true }) colorPalette: string = BarChartDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = BarChartDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = BarChartDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = BarChartDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = BarChartDefaultValues.cursor;
  @Prop({ mutable: true }) roundedCorner: number = BarChartDefaultValues.roundedCorner;
  @Prop({ mutable: true }) barIntervalRatio: number = BarChartDefaultValues.barIntervalRatio;
  @Prop({ mutable: true }) hoverOpacity: number = BarChartDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = BarChartDefaultValues.animationConfig;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = BarChartDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) showTooltip: boolean = BarChartDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = BarChartDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = BarChartDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = BarChartDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = BarChartDefaultValues.annotations;

  // Calculation (6/7)
  @Prop() maxValueOverride: number;
  @Prop() minValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = BarChartDefaultValues.referenceLines;

  // Interactivity (7/7)
  @Prop({ mutable: true }) suppressEvents: boolean = BarChartDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = BarChartDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Testing (8/7)
  @Prop() unitTest: boolean = false;
  //  @Prop() debugMode: boolean = false;

  // Element
  @Element()
  barChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  shouldValidateLocalization: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  bars: any;
  labels: any;
  nest: any;
  referencesG: any;
  defaults: boolean;
  duration: number;
  enter: any;
  exit: any;
  update: any;
  enteringLabels: any;
  exitingLabels: any;
  updatingLabels: any;
  x: any;
  y: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  colorArr: any;
  preppedData: any;
  displayOnlyLabelData: any;
  placement: string;
  legendG: any;
  subTitleG: any;
  tooltipG: any;
  legendData: any;
  // these are added for accessibility
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  tableData: any;
  tableColumns: any;
  chartID: string;
  innerClickStyle: any;
  innerHoverStyle: any;
  innerInteractionKeys: any;
  preparedColors: any;
  fillColors: any;
  strokeColors: any;
  innerLabelAccessor: string;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldValidate: boolean = false;
  shouldUpdateData: boolean = false;
  shouldUpdateLayoutVariables: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldValidateClickStyle: boolean = false;
  shouldValidateHoverStyle: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetSubTitle: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldUpdateLabelData: boolean = false;
  shouldUpdateLegendData: boolean = false;
  shouldCheckValueAxis: boolean = false;
  shouldCheckLabelAxis: boolean = false;
  shouldUpdateCorners: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldValidateLabelPlacement: boolean = false;
  shouldValidateDataLabelAccessor: boolean = false;
  shouldCheckLabelColor: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSetLabelPosition: boolean = false;
  shouldSetLabelContent: boolean = false;
  shouldUpdateDescriptionWrapper: boolean = false;
  shouldSetChartAccessibilityTitle: boolean = false;
  shouldSetChartAccessibilitySubtitle: boolean = false;
  shouldSetChartAccessibilityLongDescription: boolean = false;
  shouldSetChartAccessibilityExecutiveSummary: boolean = false;
  shouldSetChartAccessibilityStatisticalNotes: boolean = false;
  shouldSetChartAccessibilityStructureNotes: boolean = false;
  shouldSetParentSVGAccessibility: boolean = false;
  shouldSetGeometryAccessibilityAttributes: boolean = false;
  shouldSetGeometryAriaLabels: boolean = false;
  shouldSetGroupAccessibilityAttributes: boolean = false;
  shouldSetGroupAccessibilityLabel: boolean = false;
  shouldSetChartAccessibilityPurpose: boolean = false;
  shouldSetChartAccessibilityContext: boolean = false;
  shouldSetLegendCursor: boolean = false;
  shouldRedrawWrapper: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  shouldSetYAxisAccessibility: boolean = false;
  shouldSetXAxisAccessibility: boolean = false;
  shouldSetAnnotationAccessibility: boolean = false;
  shouldSetStrokes: boolean = false;
  shouldSetTextures: boolean = false;
  shouldSetLocalizationConfig: boolean = false;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  strokes: any = {};
  bitmaps: any;

  @Watch('data')
  dataWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabelData = true;
    this.shouldSetLabelPosition = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    // this.shouldDrawInteractionState = true; // called from updateGeometries
    // this.shouldCheckLabelColor = true; // called from updateGeometries
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetLabelContent = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldValidate = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetStrokes = true;
  }

  @Watch('sortOrder')
  sortWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabelData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetLabelContent = true;
    this.shouldSetLabelPosition = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegendData = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLegend = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldUpdateTableData = true;
    this.shouldSetStrokes = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldCheckLabelAxis = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetStrokes = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckValueAxis = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelContent = true;
    this.shouldSetLabelPosition = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetStrokes = true;
  }

  @Watch('maxValueOverride')
  @Watch('minValueOverride')
  valueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldCheckValueAxis = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetAnnotationAccessibility = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetSubTitle = true;
    this.shouldSetChartAccessibilityLongDescription = true;
    this.shouldSetChartAccessibilityContext = true;
    this.shouldSetChartAccessibilityExecutiveSummary = true;
    this.shouldSetChartAccessibilityPurpose = true;
    this.shouldSetChartAccessibilityStatisticalNotes = true;
    this.shouldSetChartAccessibilityStructureNotes = true;
  }

  @Watch('mainTitle')
  titleWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('subTitle')
  subtitleWatcher(_newVal, _oldVal) {
    this.shouldSetSubTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateXGrid = true;
    }
    const newCenterBaseline = _newVal && _newVal.centerBaseline;
    const oldCenterBaseline = _oldVal && _oldVal.centerBaseline;
    if (newCenterBaseline !== oldCenterBaseline) {
      this.shouldValidateLabelPlacement = true;
      this.shouldUpdateScales = true;
      this.shouldResetRoot = true;
      this.shouldUpdateGeometries = true;
      this.shouldSetGeometryAccessibilityAttributes = true;
      this.shouldUpdateXAxis = true;
      this.shouldUpdateYAxis = true;
      this.shouldUpdateXGrid = true;
      this.shouldUpdateYGrid = true;
      this.shouldSetLabelPosition = true;
      this.shouldCheckLabelColor = true;
      this.shouldUpdateLegend = true;
      this.shouldUpdateReferenceLines = true;
      this.shouldUpdateBaseline = true;
      this.shouldUpdateAnnotations = true;
    }
  }

  @Watch('yAxis')
  yAxisWatcher(_newVal, _oldVal) {
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateYGrid = true;
    }
    const newCenterBaseline = _newVal && _newVal.centerBaseline;
    const oldCenterBaseline = _oldVal && _oldVal.centerBaseline;
    if (newCenterBaseline !== oldCenterBaseline) {
      this.shouldValidateLabelPlacement = true;
      this.shouldUpdateScales = true;
      this.shouldResetRoot = true;
      this.shouldUpdateGeometries = true;
      this.shouldSetGeometryAccessibilityAttributes = true;
      this.shouldUpdateXAxis = true;
      this.shouldUpdateYAxis = true;
      this.shouldUpdateXGrid = true;
      this.shouldUpdateYGrid = true;
      this.shouldSetLabelPosition = true;
      this.shouldCheckLabelColor = true;
      this.shouldUpdateLegend = true;
      this.shouldUpdateReferenceLines = true;
      this.shouldUpdateBaseline = true;
      this.shouldUpdateAnnotations = true;
    }
  }

  @Watch('wrapLabel')
  wrapLabelWatcher(_newVal, _oldVal) {
    this.shouldCheckLabelAxis = true;
  }

  @Watch('colors')
  @Watch('colorPalette')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLegend = true;
    this.shouldSetStrokes = true;
  }

  @Watch('layout')
  layoutWatcher(_newVal, _oldVal) {
    this.shouldValidateLabelPlacement = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldUpdateLayoutVariables = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('roundedCorner')
  cornerWatcher(_newVal, _oldVal) {
    this.shouldUpdateCorners = true;
  }

  @Watch('barIntervalRatio')
  intervalRatioWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldCheckLabelAxis = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    const newCollisionPlacementVal = _newVal && _newVal.collisionPlacement ? _newVal.collisionPlacement : false;
    const oldCollisionPlacementVal = _oldVal && _oldVal.collisionPlacement ? _oldVal.collisionPlacement : false;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    const newAccessor = _newVal && _newVal.labelAccessor ? _newVal.labelAccessor : false;
    const oldAccessor = _oldVal && _oldVal.labelAccessor ? _oldVal.labelAccessor : false;
    const newFormatVal = _newVal && _newVal.format ? _newVal.format : false;
    const oldFormatVal = _oldVal && _oldVal.format ? _oldVal.format : false;
    const newCollisionHideOnlyVal = _newVal && _newVal.collisionHideOnly ? _newVal.collisionHideOnly : false;
    const oldCollisionHideOnlyVal = _oldVal && _oldVal.collisionHideOnly ? _oldVal.collisionHideOnly : false;
    const newDisplayOnlyVal = _newVal && _newVal.displayOnly;
    const oldDisplayOnlyVal = _oldVal && _oldVal.displayOnly;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newDisplayOnlyVal !== oldDisplayOnlyVal) {
      this.shouldUpdateLabelData = true;
      this.shouldSetLabelOpacity = true;
    }
    if (
      newPlacementVal !== oldPlacementVal ||
      newCollisionPlacementVal !== oldCollisionPlacementVal ||
      newCollisionHideOnlyVal !== oldCollisionHideOnlyVal
    ) {
      this.shouldValidateLabelPlacement = true;
      this.shouldSetLabelPosition = true;
      this.shouldCheckLabelColor = true;
    }
    if (newAccessor !== oldAccessor || newFormatVal !== oldFormatVal) {
      this.shouldUpdateTableData = true;
      this.shouldValidateDataLabelAccessor = true;
      this.shouldSetLabelContent = true;
      this.shouldCheckLabelColor = true;
    }
  }

  @Watch('legend')
  legendWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegend = true;
    const newInteractiveVal = _newVal && _newVal.interactive;
    const oldInteractiveVal = _oldVal && _oldVal.interactive;
    if (newInteractiveVal !== oldInteractiveVal) {
      this.shouldSetLegendCursor = true;
      this.shouldUpdateLegendInteractivity = true;
    }
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldValidateClickStyle = true;
    this.shouldSetStrokes = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldValidateHoverStyle = true;
    this.shouldSetStrokes = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetSelectionClass = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
  }

  @Watch('dataKeyNames')
  dataKeyNamesWatcher(_newVal, _oldVal) {
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
  }

  @Watch('accessibility')
  accessibilityWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    const newTitle = _newVal && _newVal.title ? _newVal.title : false;
    const oldTitle = _oldVal && _oldVal.title ? _oldVal.title : false;
    if (newTitle !== oldTitle) {
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldSetChartAccessibilityTitle = true;
      this.shouldSetParentSVGAccessibility = true;
    }
    const newExecutiveSummary = _newVal && _newVal.executiveSummary ? _newVal.executiveSummary : false;
    const oldExecutiveSummary = _oldVal && _oldVal.executiveSummary ? _oldVal.executiveSummary : false;
    if (newExecutiveSummary !== oldExecutiveSummary) {
      this.shouldSetChartAccessibilityExecutiveSummary = true;
    }
    const newPurpose = _newVal && _newVal.purpose ? _newVal.purpose : false;
    const oldPurpose = _oldVal && _oldVal.purpose ? _oldVal.purpose : false;
    if (newPurpose !== oldPurpose) {
      this.shouldSetChartAccessibilityPurpose = true;
    }
    const newLongDescription = _newVal && _newVal.longDescription ? _newVal.longDescription : false;
    const oldLongDescription = _oldVal && _oldVal.longDescription ? _oldVal.longDescription : false;
    if (newLongDescription !== oldLongDescription) {
      this.shouldSetChartAccessibilityLongDescription = true;
    }
    const newContext = _newVal && _newVal.contextExplanation ? _newVal.contextExplanation : false;
    const oldContext = _oldVal && _oldVal.contextExplanation ? _oldVal.contextExplanation : false;
    if (newContext !== oldContext) {
      this.shouldSetChartAccessibilityContext = true;
    }
    const newStatisticalNotes = _newVal && _newVal.statisticalNotes ? _newVal.statisticalNotes : false;
    const oldStatisticalNotes = _oldVal && _oldVal.statisticalNotes ? _oldVal.statisticalNotes : false;
    if (newStatisticalNotes !== oldStatisticalNotes) {
      this.shouldSetChartAccessibilityStatisticalNotes = true;
    }
    const newStructureNotes = _newVal && _newVal.structureNotes ? _newVal.structureNotes : false;
    const oldStructureNotes = _oldVal && _oldVal.structureNotes ? _oldVal.structureNotes : false;
    if (newStructureNotes !== oldStructureNotes) {
      this.shouldSetChartAccessibilityStructureNotes = true;
    }
    const newincludeDataKeyNames = _newVal && _newVal.includeDataKeyNames;
    const oldincludeDataKeyNames = _oldVal && _oldVal.includeDataKeyNames;
    const newElementDescriptionAccessor =
      _newVal && _newVal.elementDescriptionAccessor ? _newVal.elementDescriptionAccessor : false;
    const oldElementDescriptionAccessor =
      _oldVal && _oldVal.elementDescriptionAccessor ? _oldVal.elementDescriptionAccessor : false;
    if (
      newincludeDataKeyNames !== oldincludeDataKeyNames ||
      newElementDescriptionAccessor !== oldElementDescriptionAccessor
    ) {
      if (newincludeDataKeyNames !== oldincludeDataKeyNames) {
        // this one is tricky because it needs to run after the lifecycle
        // AND it could run in the off-chance this prop is changed
        this.shouldSetGroupAccessibilityLabel = true;
      }
      this.shouldSetGeometryAriaLabels = true;
      this.shouldSetParentSVGAccessibility = true;
    }
    const newTextures = _newVal && _newVal.hideTextures ? _newVal.hideTextures : false;
    const oldTextures = _oldVal && _oldVal.hideTextures ? _oldVal.hideTextures : false;
    const newExTextures = _newVal && _newVal.showExperimentalTextures ? _newVal.showExperimentalTextures : false;
    const oldExTextures = _oldVal && _oldVal.showExperimentalTextures ? _oldVal.showExperimentalTextures : false;
    if (newTextures !== oldTextures || newExTextures !== oldExTextures) {
      this.shouldSetTextures = true;
      this.shouldUpdateLegend = true;
      this.shouldDrawInteractionState = true;
      this.shouldCheckLabelColor = true;
    }
    const newSmallValue = _newVal && _newVal.showSmallLabels ? _newVal.showSmallLabels : false;
    const oldSmallValue = _oldVal && _oldVal.showSmallLabels ? _oldVal.showSmallLabels : false;
    if (newSmallValue !== oldSmallValue) {
      this.shouldSetLabelOpacity = true;
    }
    const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    if (newStrokes !== oldStrokes) {
      this.shouldSetStrokes = true;
      this.shouldUpdateLegend = true;
      this.shouldDrawInteractionState = true;
    }
    const newKeyNav =
      _newVal && _newVal.keyboardNavConfig && _newVal.keyboardNavConfig.disabled
        ? _newVal.keyboardNavConfig.disabled
        : false;
    const oldKeyNav =
      _oldVal && _oldVal.keyboardNavConfig && _oldVal.keyboardNavConfig.disabled
        ? _oldVal.keyboardNavConfig.disabled
        : false;
    const newInterface = _newVal && _newVal.elementsAreInterface ? _newVal.elementsAreInterface : false;
    const oldInterface = _oldVal && _oldVal.elementsAreInterface ? _oldVal.elementsAreInterface : false;
    if (newKeyNav !== oldKeyNav || newInterface !== oldInterface) {
      this.shouldSetGeometryAriaLabels = true;
      this.shouldSetParentSVGAccessibility = true;
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldRedrawWrapper = true;
      this.shouldSetChartAccessibilityTitle = true;
      this.shouldSetChartAccessibilitySubtitle = true;
      this.shouldSetChartAccessibilityLongDescription = true;
      this.shouldSetChartAccessibilityContext = true;
      this.shouldSetChartAccessibilityExecutiveSummary = true;
      this.shouldSetChartAccessibilityPurpose = true;
      this.shouldSetChartAccessibilityStatisticalNotes = true;
      this.shouldSetChartAccessibilityStructureNotes = true;
    }
    if (newInterface !== oldInterface) {
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('referenceLines')
  @Watch('referenceStyle')
  referenceLinesWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetAnnotationAccessibility = true;
  }

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetAnnotationAccessibility = true;
  }

  @Watch('localization')
  localizationWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;

    // language
    const newLanguage = _newVal && _newVal.language ? _newVal.language : false;
    const oldLanguage = _oldVal && _oldVal.language ? _oldVal.language : false;
    if (newLanguage !== oldLanguage) {
      this.shouldSetLocalizationConfig = true;
      this.shouldUpdateTableData = true;
      this.shouldValidateDataLabelAccessor = true;
      this.shouldSetLabelContent = true;
      this.shouldCheckLabelColor = true;
      this.shouldRedrawWrapper = true;
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldSetChartAccessibilityCount = true;
      this.shouldSetYAxisAccessibility = true;
      this.shouldSetXAxisAccessibility = true;
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldSetGeometryAriaLabels = true;
      this.shouldSetParentSVGAccessibility = true;
    }

    // numeralLocale
    const newNumeralLocale = _newVal && _newVal.numeralLocale ? _newVal.numeralLocale : false;
    const oldNumeralLocale = _oldVal && _oldVal.numeralLocale ? _oldVal.numeralLocale : false;
    if (newNumeralLocale !== oldNumeralLocale) {
      this.shouldSetLocalizationConfig = true;
      this.shouldUpdateTableData = true;
      this.shouldValidateDataLabelAccessor = true;
      this.shouldSetLabelContent = true;
      this.shouldCheckLabelColor = true;
      this.shouldRedrawWrapper = true;
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldSetChartAccessibilityCount = true;
      this.shouldSetYAxisAccessibility = true;
      this.shouldSetXAxisAccessibility = true;
      this.shouldUpdateDescriptionWrapper = true;
      this.shouldSetGeometryAriaLabels = true;
      this.shouldSetParentSVGAccessibility = true;
    }
  }

  @Watch('uniqueID')
  idWatcher(newVal, _oldVal) {
    console.error(
      'Change detected in prop uniqueID from value ' +
        _oldVal +
        ' to value ' +
        newVal +
        '. This prop cannot be changed after component has loaded.'
    );
    // we have removed the ability to change this prop post load
    // this.chartID = newVal || 'bar-chart-' + uuid();
    // this.barChartEl.id = this.chartID;
    // this.shouldValidate = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldUpdateLegend = true;
    // this.shouldSetTextures = true;
    // this.shouldCheckLabelColor = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetStrokes = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
    this.shouldUpdateLegendInteractivity = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldValidate = true;
    this.shouldRedrawWrapper = true;
    this.shouldSetSubTitle = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetChartAccessibilityLongDescription = true;
    this.shouldSetChartAccessibilityContext = true;
    this.shouldSetChartAccessibilityExecutiveSummary = true;
    this.shouldSetChartAccessibilityPurpose = true;
    this.shouldSetChartAccessibilityStatisticalNotes = true;
    this.shouldSetChartAccessibilityStructureNotes = true;
  }

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    const chartID = this.uniqueID || 'bar-chart-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.barChartEl.id = this.chartID;
      this.setLocalizationConfig();
      this.setTagLevels();
      this.prepareData();
      this.prepareLegendData();
      this.prepareLabelData();
      this.updateChartVariable();
      this.prepareScales();
      this.validateInteractionKeys();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.validateClickStyle();
      this.validateHoverStyle();
      this.setColors();
      resolve('component will load');
    });
  }

  componentWillUpdate() {
    // NEVER put items in this method that rely on props (until stencil bug is resolved)
    // All items that belong here are currently at the top of render
    // see: https://github.com/ionic-team/stencil/issues/2061#issuecomment-578282178
    return new Promise(resolve => {
      resolve('component will update');
    });
  }

  componentDidLoad() {
    return new Promise(resolve => {
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.renderRootElements();
      this.setTooltipInitialStyle();
      this.setChartDescriptionWrapper();
      this.setChartAccessibilityTitle();
      this.setChartAccessibilitySubtitle();
      this.setChartAccessibilityLongDescription();
      this.setChartAccessibilityExecutiveSummary();
      this.setChartAccessibilityPurpose();
      this.setChartAccessibilityContext();
      this.setChartAccessibilityStatisticalNotes();
      this.setChartAccessibilityStructureNotes();
      this.setParentSVGAccessibility();
      this.reSetRoot();
      this.setTextures();
      this.setStrokes();
      this.setSubTitleElements();
      this.drawXGrid();
      this.drawYGrid();
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.validateClickStyle();
      this.validateHoverStyle();
      this.validateDataLabelAccessor();
      this.enterGeometries();
      this.updateGeometries();
      this.exitGeometries();
      this.enterLabels();
      this.updateLabels();
      this.exitLabels();
      this.drawGeometries();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.setRoundedCorners();
      this.drawLegendElements();
      this.validateLabelPlacement();
      this.setLabelContent();
      this.processLabelPosition(this.updatingLabels, false, true, false);
      this.drawReferenceLines();
      this.setSelectedClass();
      this.checkLabelColorAgainstBackground();
      this.updateCursor();
      this.bindInteractivity();
      this.bindLegendInteractivity();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.drawYAxis();
      this.setYAxisAccessibility();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.drawBaseline();
      this.onChangeHandler();
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.bars.node());
      this.setGroupAccessibilityAttributes();
      this.setGroupAccessibilityID();
      this.defaults = false;
      // catch all to remove entering class from labels once we have loaded component
      this.updatingLabels.classed('entering', false);
      resolve('component did load');
    }).then(() => this.initialLoadEndEvent.emit({ chartID: this.chartID }));
  }

  componentDidUpdate() {
    return new Promise(resolve => {
      this.duration = !this.animationConfig || !this.animationConfig.disabled ? 750 : 0;
      if (this.shouldUpdateDescriptionWrapper) {
        this.setChartDescriptionWrapper();
        this.shouldUpdateDescriptionWrapper = false;
      }
      if (this.shouldSetChartAccessibilityCount) {
        this.setChartCountAccessibility();
        this.shouldSetChartAccessibilityCount = false;
      }
      if (this.shouldSetChartAccessibilityTitle) {
        this.setChartAccessibilityTitle();
        this.shouldSetChartAccessibilityTitle = false;
      }
      if (this.shouldSetChartAccessibilitySubtitle) {
        this.setChartAccessibilitySubtitle();
        this.shouldSetChartAccessibilitySubtitle = false;
      }
      if (this.shouldSetChartAccessibilityLongDescription) {
        this.setChartAccessibilityLongDescription();
        this.shouldSetChartAccessibilityLongDescription = false;
      }
      if (this.shouldSetChartAccessibilityExecutiveSummary) {
        this.setChartAccessibilityExecutiveSummary();
        this.shouldSetChartAccessibilityExecutiveSummary = false;
      }
      if (this.shouldSetChartAccessibilityPurpose) {
        this.setChartAccessibilityPurpose();
        this.shouldSetChartAccessibilityPurpose = false;
      }
      if (this.shouldSetChartAccessibilityContext) {
        this.setChartAccessibilityContext();
        this.shouldSetChartAccessibilityContext = false;
      }
      if (this.shouldSetChartAccessibilityStatisticalNotes) {
        this.setChartAccessibilityStatisticalNotes();
        this.shouldSetChartAccessibilityStatisticalNotes = false;
      }
      if (this.shouldSetChartAccessibilityStructureNotes) {
        this.setChartAccessibilityStructureNotes();
        this.shouldSetChartAccessibilityStructureNotes = false;
      }
      if (this.shouldSetParentSVGAccessibility) {
        this.setParentSVGAccessibility();
        this.shouldSetParentSVGAccessibility = false;
      }
      if (this.shouldResetRoot) {
        this.reSetRoot();
        this.shouldResetRoot = false;
      }
      if (this.shouldSetTextures) {
        this.setTextures();
        this.shouldSetTextures = false;
      }
      if (this.shouldSetStrokes) {
        this.setStrokes();
        this.shouldSetStrokes = false;
      }
      if (this.shouldSetGlobalSelections) {
        this.setGlobalSelections();
        this.shouldSetGlobalSelections = false;
      }
      if (this.shouldSetTestingAttributes) {
        this.setTestingAttributes();
        this.shouldSetTestingAttributes = false;
      }
      if (this.shouldSetSubTitle) {
        this.setSubTitleElements();
        this.shouldSetSubTitle = false;
      }
      if (this.shouldUpdateXGrid) {
        this.drawXGrid();
        this.shouldUpdateXGrid = false;
      }
      if (this.shouldUpdateYGrid) {
        this.drawYGrid();
        this.shouldUpdateYGrid = false;
      }
      if (this.shouldEnterUpdateExit) {
        this.enterGeometries();
        this.updateGeometries();
        this.exitGeometries();
        this.enterLabels();
        this.updateLabels();
        this.exitLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldUpdateGeometries) {
        this.drawGeometries();
        this.shouldUpdateGeometries = false;
      }
      if (this.shouldSetGeometryAccessibilityAttributes) {
        this.setGeometryAccessibilityAttributes();
        this.shouldSetGeometryAccessibilityAttributes = false;
      }
      if (this.shouldSetGeometryAriaLabels) {
        this.setGeometryAriaLabels();
        this.shouldSetGeometryAriaLabels = false;
      }
      // if a component's <g> elements can enter/exit, this will need to be called
      // in the lifecycle more than just initially
      // if (this.shouldSetGroupAccessibilityAttributes) {
      //   this.setGroupAccessibilityAttributes()
      //   this.shouldSetGroupAccessibilityAttributes = false
      // }
      if (this.shouldSetGroupAccessibilityLabel) {
        this.setGroupAccessibilityID();
        this.shouldSetGroupAccessibilityLabel = false;
      }
      if (this.shouldUpdateCorners) {
        this.setRoundedCorners();
        this.shouldUpdateCorners = false;
      }
      if (this.shouldUpdateLegend) {
        this.drawLegendElements();
        this.shouldUpdateLegend = false;
      }
      if (this.shouldSetLabelContent) {
        this.setLabelContent();
        this.shouldSetLabelContent = false;
      }
      if (this.shouldSetLabelPosition) {
        this.setLabelPosition();
        this.shouldSetLabelPosition = false;
      }
      if (this.shouldUpdateReferenceLines) {
        this.drawReferenceLines();
        this.shouldUpdateReferenceLines = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
      }
      if (this.shouldSetLabelOpacity) {
        this.setLabelOpacity();
        this.shouldSetLabelOpacity = false;
      }
      if (this.shouldCheckLabelColor) {
        this.checkLabelColorAgainstBackground();
        this.shouldCheckLabelColor = false;
      }
      if (this.shouldSetSelectionClass) {
        this.setSelectedClass();
        this.shouldSetSelectionClass = false;
      }
      if (this.shouldUpdateLegendInteractivity) {
        this.bindLegendInteractivity();
        this.shouldUpdateLegendInteractivity = false;
      }
      if (this.shouldSetLegendCursor) {
        this.setLegendCursor();
        this.shouldSetLegendCursor = false;
      }
      if (this.shouldUpdateCursor) {
        this.updateCursor();
        this.shouldUpdateCursor = false;
      }
      if (this.shouldBindInteractivity) {
        this.bindInteractivity();
        this.shouldBindInteractivity = false;
      }
      if (this.shouldUpdateXAxis) {
        this.drawXAxis();
        this.shouldUpdateXAxis = false;
      }
      if (this.shouldSetXAxisAccessibility) {
        this.setXAxisAccessibility();
        this.shouldSetXAxisAccessibility = false;
      }
      if (this.shouldUpdateYAxis) {
        this.drawYAxis();
        this.shouldUpdateYAxis = false;
      }
      if (this.shouldSetYAxisAccessibility) {
        this.setYAxisAccessibility();
        this.shouldSetYAxisAccessibility = false;
      }
      if (this.shouldUpdateAnnotations) {
        this.drawAnnotations();
        this.shouldUpdateAnnotations = false;
      }
      if (this.shouldSetAnnotationAccessibility) {
        this.setAnnotationAccessibility();
        this.shouldSetAnnotationAccessibility = false;
      }
      if (this.shouldUpdateBaseline) {
        this.drawBaseline();
        this.shouldUpdateBaseline = false;
      }
      this.onChangeHandler();
      this.updatingLabels.classed('entering', false);
      resolve('component did update');
    }).then(() => this.drawEndEvent.emit({ chartID: this.chartID }));
  }

  shouldValidateLocalizationProps() {
    const windowInstances = getGlobalInstances();
    const languageString = windowInstances.i18Next.language;
    const languageObject = windowInstances.i18Next.getResourceBundle(languageString);
    const numeralObject = windowInstances.numeral.localeData();
    if (this.shouldValidateLocalization && !this.localization.skipValidation) {
      this.shouldValidateLocalization = false;
      validateLocalizationProps(this.chartID, {
        ...this.localization,
        language: languageObject,
        numeralLocale: numeralObject
      });
    }
  }

  shouldValidateAccessibilityProps() {
    if (this.shouldValidateAccessibility && !this.accessibility.disableValidation) {
      this.shouldValidateAccessibility = false;
      validateAccessibilityProps(
        this.chartID,
        { ...this.accessibility },
        {
          annotations: this.annotations,
          data: this.data,
          uniqueID: this.uniqueID,
          context: {
            mainTitle: this.mainTitle,
            onClickEvent: this.suppressEvents ? undefined : this.clickEvent.emit
          }
        }
      );
    }
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length
        ? this.interactionKeys
        : [this.groupAccessor || this.ordinalAccessor];
  }

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueAccessor;
  }

  getLanguageString() {
    return getActiveLanguageString(this.localization);
  }

  setLocalizationConfig() {
    configLocalization(this.localization);
  }

  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  updateChartVariable() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  prepareData() {
    if (this.data) {
      if (this.sortOrder === 'asc') {
        this.preppedData = [...this.data].sort((a, b) => {
          a[this.valueAccessor] = parseFloat(a[this.valueAccessor]);
          b[this.valueAccessor] = parseFloat(b[this.valueAccessor]);
          return a[this.valueAccessor] - b[this.valueAccessor];
        });
      } else if (this.sortOrder === 'desc') {
        this.preppedData = [...this.data].sort((a, b) => {
          a[this.valueAccessor] = parseFloat(a[this.valueAccessor]);
          b[this.valueAccessor] = parseFloat(b[this.valueAccessor]);
          return b[this.valueAccessor] - a[this.valueAccessor];
        });
      } else {
        this.preppedData = this.data;
        this.preppedData.map(d => {
          d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);
        });
      }
    }
  }

  prepareLegendData() {
    const nested = nest()
      .key(d => d[this.groupAccessor])
      .entries(this.preppedData);

    this.legendData = [];
    nested.forEach(el => {
      this.legendData.push(el.values[0]);
    });
  }

  prepareLabelData() {
    if (this.preppedData) {
      // min
      const minIdx = minIndex(this.preppedData, d => d[this.valueAccessor]);
      const minItem = this.preppedData[minIdx];
      // max
      const maxIdx = maxIndex(this.preppedData, d => d[this.valueAccessor]);
      const maxItem = this.preppedData[maxIdx];
      // first
      const firstItem = this.preppedData.find(val => val[this.valueAccessor] != null);
      // last
      const lastItem = [...this.preppedData].reverse().find(val => val[this.valueAccessor] != null);

      this.displayOnlyLabelData = {
        first: [firstItem],
        last: [lastItem],
        min: [minItem],
        max: [maxItem]
      };
    }
  }

  setSubTitleElements() {
    setSubTitle({
      root: this.subTitleG,
      subTitle: this.subTitle
    });
  }

  setColors() {
    const colorFromProps = this.colors ? convertVisaColor(this.colors) : this.colorPalette;

    const minValue = min(this.preppedData, d => d[this.valueAccessor]);
    const maxValue = max(this.preppedData, d => d[this.valueAccessor]);

    this.preparedColors = this.groupAccessor
      ? getColors(
          colorFromProps,
          scaleOrdinal()
            .domain(this.data.map(d => d[this.groupAccessor]))
            .domain()
        )
      : getColors(colorFromProps, [minValue, maxValue]);

    const colors = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    const strokeColors = [];
    const backgroundColors = [];
    let i = 0;
    const half = Math.ceil(colors.length / 2);
    const isDiverging = this.colorPalette && this.colorPalette.includes('diverging');
    const isDark = this.colorPalette && this.colorPalette.includes('dark');
    const scheme = this.groupAccessor || colors.length === 1 ? 'categorical' : isDiverging ? 'diverging' : 'sequential';
    colors.forEach(color => {
      const colorsMatchingScheme = prepareStrokeColorsFromScheme(color, i, colors, scheme);
      if (scheme === 'diverging') {
        const fillLuminance = calculateLuminance(colorsMatchingScheme.fillColor);
        const strokeLuminance = calculateLuminance(colorsMatchingScheme.textureColor);
        const darkerColor =
          fillLuminance > strokeLuminance ? colorsMatchingScheme.textureColor : colorsMatchingScheme.fillColor;
        const lighterColor =
          fillLuminance < strokeLuminance ? colorsMatchingScheme.textureColor : colorsMatchingScheme.fillColor;
        if (colors.length % 2 && i === (colors.length - 1) / 2) {
          backgroundColors.push(isDark ? darkerColor : lighterColor);
          strokeColors.push(isDark ? lighterColor : darkerColor);
        } else {
          strokeColors.push(isDark ? darkerColor : lighterColor);
          backgroundColors.push(isDark ? lighterColor : darkerColor);
        }
      } else {
        if (i + 1 < half) {
          backgroundColors.push(colors[0]);
          strokeColors.push(colors[colors.length - 1]);
        } else {
          strokeColors.push(colors[0]);
          backgroundColors.push(colors[colors.length - 1]);
        }
      }
      i++;
    });

    this.fillColors = this.preparedColors.copy().range(backgroundColors);

    this.strokeColors = this.preparedColors.copy().range(strokeColors);
  }

  setTextures() {
    const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    const scheme =
      this.groupAccessor || colorsArray.length === 1
        ? 'categorical'
        : this.colorPalette && this.colorPalette.includes('diverging')
        ? 'diverging'
        : 'sequential';
    if (
      this.accessibility.hideTextures ||
      (scheme === 'categorical' && colorsArray.length > 6) ||
      (scheme !== 'categorical' && !this.accessibility.showExperimentalTextures)
    ) {
      this.colorArr = this.preparedColors;
    } else {
      const textures = convertColorsToTextures({
        colors: colorsArray,
        rootSVG: this.svg.node(),
        id: this.chartID,
        scheme,
        disableTransitions: !this.duration
      });
      this.colorArr = this.preparedColors.copy().range(textures);
    }
  }

  setStrokes() {
    const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    const scheme =
      this.groupAccessor || colorsArray.length === 1
        ? 'categorical'
        : this.colorPalette && this.colorPalette.includes('diverging')
        ? 'diverging'
        : 'sequential';
    this.strokes = buildStrokes({
      root: this.svg.node(),
      id: this.chartID,
      colors:
        !this.accessibility.hideTextures && scheme !== 'categorical' && this.accessibility.showExperimentalTextures
          ? this.fillColors.range()
          : colorsArray,
      clickStyle: this.innerClickStyle,
      hoverStyle: this.innerHoverStyle,
      strokeOverride:
        !this.accessibility.hideTextures && scheme !== 'categorical' && this.accessibility.showExperimentalTextures
          ? this.strokeColors.range()
          : undefined
    });
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'bar-chart');
    this.tableData = getScopedData(this.preppedData, keys);
    this.tableColumns = Object.keys(keys);
  }

  validateLabelPlacement() {
    // check data label placement assignment based on layout
    this.placement = this.dataLabel.placement;
    if (this.layout === 'vertical') {
      if (this.placement !== 'top' && this.placement !== 'bottom' && this.placement !== 'auto') {
        this.placement = 'top';
      }
    } else {
      if (!this.placement || this.placement === 'top' || this.placement === 'bottom') {
        this.placement = 'right';
      }
    }
  }

  // scale band based on layout of chart, called in mulitple places to reduce code repetition
  shouldCenterBaseline() {
    return (
      ((this.xAxis.centerBaseline && this.layout === 'horizontal') ||
        (this.yAxis.centerBaseline && this.layout === 'vertical')) &&
      min(this.preppedData, d => d[this.valueAccessor]) >= 0
    );
  }

  prepareScales() {
    // if center baseline then (1) use maxOverride halved or (2) use data halved
    // else (1) use minOverride or (2) use data
    const minBarValue = this.shouldCenterBaseline()
      ? this.maxValueOverride && this.maxValueOverride > max(this.preppedData, d => d[this.valueAccessor])
        ? -halve(this.maxValueOverride)
        : -halve(max(this.preppedData, d => d[this.valueAccessor]))
      : this.minValueOverride && this.minValueOverride < min(this.preppedData, d => d[this.valueAccessor])
      ? this.minValueOverride
      : min(this.preppedData, d => d[this.valueAccessor]);

    const maxBarValue = this.shouldCenterBaseline()
      ? this.maxValueOverride && this.maxValueOverride > max(this.preppedData, d => d[this.valueAccessor])
        ? halve(this.maxValueOverride)
        : halve(max(this.preppedData, d => d[this.valueAccessor]))
      : this.maxValueOverride && this.maxValueOverride > max(this.preppedData, d => d[this.valueAccessor])
      ? this.maxValueOverride
      : max(this.preppedData, d => d[this.valueAccessor]);

    if (this.layout === 'vertical') {
      this.y = scaleLinear()
        .domain([Math.min(0, minBarValue), Math.max(0, maxBarValue)])
        .range([this.innerPaddedHeight, 0]);
      this.x = scaleBand()
        .domain(this.preppedData.map(d => d[this.ordinalAccessor]))
        .range([0, this.innerPaddedWidth])
        .padding(this.barIntervalRatio);
    } else if (this.layout === 'horizontal') {
      this.x = scaleLinear()
        .domain([Math.min(0, minBarValue), Math.max(0, maxBarValue)])
        .range([0, this.innerPaddedWidth]);

      this.y = scaleBand()
        .domain(this.preppedData.map(d => d[this.ordinalAccessor]))
        .range([0, this.innerPaddedHeight])
        .padding(this.barIntervalRatio);
    }
  }

  // reset graph size based on window size
  reSetRoot() {
    const changeSvg = prepareRenderChange({
      selection: this.svg,
      duration: this.duration,
      namespace: 'root_reset',
      easing: easeCircleIn
    });

    changeSvg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    const changeRoot = prepareRenderChange({
      selection: this.root,
      duration: this.duration,
      namespace: 'root_reset',
      easing: easeCircleIn
    });

    changeRoot.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const changeRootG = prepareRenderChange({
      selection: this.rootG,
      duration: this.duration,
      namespace: 'root_reset',
      easing: easeCircleIn
    });

    changeRootG.attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);

    setAccessibilityDescriptionWidth(this.chartID, this.width);
  }

  // this function is used in drawAxis and setAccessAxis functions to determine (inverse) visible
  // of the relevant axis + layout combination
  checkHideAxisState(axisName: string, relevantLayout: string, minValue: number) {
    return this[axisName].centerBaseline && this.layout === relevantLayout && minValue >= 0
      ? true
      : !this[axisName].visible;
  }

  // draw axis line
  drawXAxis() {
    const axisAccessor = this.layout === 'vertical' ? this.ordinalAccessor : this.valueAccessor;
    const axisLabel =
      this.xAxis.label || this.xAxis.label === ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.xAxis.label;

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      wrapLabel: this.wrapLabel && this.layout === 'vertical' ? this.innerPaddedWidth / this.data.length : '',
      format: this.xAxis.format,
      dateFormat: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: axisLabel, // this.xAxis.label,
      padding: this.padding,
      hide: this.checkHideAxisState('xAxis', 'horizontal', min(this.preppedData, d => d[this.valueAccessor])),
      duration: this.duration
    });
  }

  drawYAxis() {
    const axisAccessor = this.layout === 'vertical' ? this.valueAccessor : this.ordinalAccessor;
    const axisLabel =
      this.yAxis.label && this.yAxis.label !== ''
        ? this.yAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.yAxis.label;

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      wrapLabel: this.wrapLabel ? this.padding.left || 100 : '',
      format: this.yAxis.format,
      dateFormat: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: axisLabel, // this.yAxis.label,
      padding: this.padding,
      hide: this.checkHideAxisState('yAxis', 'vertical', min(this.preppedData, d => d[this.valueAccessor])),
      duration: this.duration
    });
  }

  drawBaseline() {
    // add baseline at 0
    if (this.layout === 'vertical' && !this.shouldCenterBaseline()) {
      drawAxis({
        root: this.rootG,
        height: this.innerPaddedHeight,
        width: this.innerPaddedWidth,
        axisScale: this.x,
        left: false,
        padding: this.padding,
        markOffset: this.y(0) || -1,
        duration: this.duration
      });
    }
    if (this.layout === 'horizontal') {
      drawAxis({
        root: this.rootG,
        height: this.innerPaddedHeight,
        width: this.innerPaddedWidth,
        axisScale: this.y,
        left: true,
        padding: this.padding,
        markOffset: this.shouldCenterBaseline()
          ? this.maxValueOverride && this.maxValueOverride > max(this.preppedData, d => d[this.valueAccessor])
            ? -halve(this.maxValueOverride)
            : -halve(max(this.preppedData, d => d[this.valueAccessor]))
          : this.minValueOverride && this.minValueOverride < min(this.preppedData, d => d[this.valueAccessor])
          ? this.minValueOverride
          : this.x(0) || -1,
        duration: this.duration
      });
    }
  }

  setXAxisAccessibility() {
    const axisAccessor = this.layout === 'vertical' ? this.ordinalAccessor : this.valueAccessor;
    const axisLabel =
      this.xAxis.label && this.xAxis.label !== ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.xAxis.label;

    setAccessXAxis({
      rootEle: this.barChartEl,
      hasXAxis: !this.checkHideAxisState('xAxis', 'horizontal', min(this.preppedData, d => d[this.valueAccessor])), // this is inverse of how drawAxis works
      xAxis: this.x ? this.x : false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    const axisAccessor = this.layout === 'vertical' ? this.valueAccessor : this.ordinalAccessor;
    const axisLabel =
      this.yAxis.label && this.yAxis.label !== ''
        ? this.yAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.yAxis.label;

    setAccessYAxis({
      rootEle: this.barChartEl,
      hasYAxis: !this.checkHideAxisState('yAxis', 'vertical', min(this.preppedData, d => d[this.valueAccessor])), // this is inverse of how drawAxis works
      yAxis: this.y ? this.y : false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasXAxis is always false
      // secondaryYAxis?: any, // pareto uses this
      // secondaryYAxisLabel?: string, // pareto uses this
      // xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // parallel uses this to label all the y axes
    });
  }

  // dashed line grid for chart
  drawXGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.x,
      false,
      this.shouldCenterBaseline() && this.xAxis.gridVisible
        ? !(this.layout === 'vertical')
        : !(!(this.layout === 'vertical') && this.xAxis.gridVisible),
      this.xAxis.tickInterval,
      this.duration
    );
  }

  drawYGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.y,
      true,
      this.shouldCenterBaseline() && this.yAxis.gridVisible
        ? !(this.layout === 'horizontal')
        : !(this.layout === 'vertical' && this.yAxis.gridVisible),
      this.yAxis.tickInterval,
      this.duration
    );
  }

  enterGeometries() {
    this.enter.interrupt();
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const innerPaddedOrdinalDimension =
      'innerPadded' + ordinalDimension[0].toUpperCase() + ordinalDimension.substring(1);
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const choice = this.layout === 'vertical' ? 'max' : 'min';

    this.enter
      .attr('class', 'bar')
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('rx', this.roundedCorner)
      .attr('ry', this.roundedCorner)
      .attr('fill', d => {
        // the following line could be added back in to improve performance, but it is visually quite jarring
        // const fillSource = !select(n[i]).classed('geometryIsMoving') ? this.colorArr : this.preparedColors
        return this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) &&
          this.innerClickStyle.color
          ? visaColors[this.innerClickStyle.color] || this.innerClickStyle.color
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.color
          ? visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color
          : this.groupAccessor
          ? this.colorArr(d[this.groupAccessor])
          : this.colorArr(d[this.valueAccessor]);
      })
      .attr(valueAxis, d =>
        this.shouldCenterBaseline()
          ? this[valueAxis](halve(d[this.valueAccessor]) * (this.layout === 'vertical' ? 1 : -1))
          : this[valueAxis](Math[choice](0, d[this.valueAccessor]))
      )
      .attr(valueDimension, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      });
    if (this.defaults) {
      this.enter
        .attr('opacity', d =>
          checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
        )
        .attr(ordinalAxis, d => this[ordinalAxis](d[this.ordinalAccessor]))
        .attr(ordinalDimension, this[ordinalAxis].bandwidth());
    } else {
      this.enter
        .attr('opacity', 0)
        .attr(ordinalAxis, d => {
          let shift = this[ordinalAxis](d[this.ordinalAccessor]) + this[ordinalAxis].bandwidth() / 2;
          shift =
            this[ordinalAxis](d[this.ordinalAccessor]) +
            (this[ordinalAxis].bandwidth() / 2) * (shift / (this[innerPaddedOrdinalDimension] / 2));
          return shift;
        })
        .attr(ordinalDimension, 0);
    }
    this.update.order();
  }

  updateGeometries() {
    this.update.interrupt();

    this.update
      .transition('opacity')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
      );
  }

  exitGeometries() {
    this.exit.interrupt();
    const axisOfShift = this.layout === 'vertical' ? 'x' : 'y';
    const dimensionOfShift = this.layout === 'vertical' ? 'width' : 'height';
    const innerPaddedDimension = 'innerPadded' + dimensionOfShift[0].toUpperCase() + dimensionOfShift.substring(1);

    this.exit
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr(axisOfShift, (_d, i, n) => {
        const self = select(n[i]);
        let shift = +self.attr(axisOfShift) + +self.attr(dimensionOfShift) / 2;
        shift =
          +self.attr(axisOfShift) + (+self.attr(dimensionOfShift) / 2) * (shift / (this[innerPaddedDimension] / 2));
        return shift;
      })
      .attr(dimensionOfShift, 0)
      .attr('opacity', 0);

    // We use this.update instead of this.exit to ensure the functions at the end
    // of our lifecycle run, even though we are removing the exiting elements from
    // inside this transition's endAll.
    // (If we put this in this.exit, it will only run if elements exit.
    // We want this to run every lifecycle.)
    this.update
      .transition('accessibilityAfterExit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exit.remove();
        // then our util can count geometries
        this.setChartCountAccessibility();
        // our group's label should update with new counts too
        this.setGroupAccessibilityID();
        // since items exited, labels must receive updated values
        this.setGeometryAriaLabels();
        // and also make sure the user's focus isn't lost
        retainAccessFocus({
          parentGNode: this.rootG.node(),
          focusDidExist
          // recursive: true
        });
      });
  }

  drawGeometries() {
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const choice = this.layout === 'vertical' ? 'max' : 'min';
    this.update
      .classed('geometryIsMoving', (d, i, n) => {
        const geometryIsUpdating = checkAttributeTransitions(select(n[i]), [
          {
            attr: ordinalAxis,
            numeric: true,
            newValue: this[ordinalAxis](d[this.ordinalAccessor])
          },
          {
            attr: ordinalDimension,
            numeric: true,
            newValue: this[ordinalAxis].bandwidth()
          },
          {
            attr: valueAxis,
            numeric: true,
            newValue: this.shouldCenterBaseline()
              ? this[valueAxis](halve(d[this.valueAccessor]) * (this.layout === 'vertical' ? 1 : -1))
              : this[valueAxis](Math[choice](0, d[this.valueAccessor]))
          },
          {
            attr: valueDimension,
            numeric: true,
            newValue: Math.abs(
              this.layout === 'vertical'
                ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
                : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
            )
          }
        ]);
        return geometryIsUpdating;
      })
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .attr(`data-${ordinalAxis}`, d => this[ordinalAxis](d[this.ordinalAccessor]))
      .attr(`data-${ordinalDimension}`, this[ordinalAxis].bandwidth())
      .attr(`data-${valueAxis}`, d =>
        this.shouldCenterBaseline()
          ? this[valueAxis](halve(d[this.valueAccessor]) * (this.layout === 'vertical' ? 1 : -1))
          : this[valueAxis](Math[choice](0, d[this.valueAccessor]))
      )
      .attr(`data-${valueDimension}`, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr(ordinalAxis, d => this[ordinalAxis](d[this.ordinalAccessor]))
      .attr(ordinalDimension, this[ordinalAxis].bandwidth())
      .attr(valueAxis, d =>
        this.shouldCenterBaseline()
          ? this[valueAxis](halve(d[this.valueAccessor]) * (this.layout === 'vertical' ? 1 : -1))
          : this[valueAxis](Math[choice](0, d[this.valueAccessor]))
      )
      .attr(valueDimension, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .call(transitionEndAll, () => {
        this.update.classed('geometryIsMoving', false);

        this.updateInteractionState();
        this.checkLabelColorAgainstBackground();

        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
          // focusDidExist // this only matters for exiting selections
          // recursive: true // this only matters for
        });

        // now we can emit the event that transitions are complete
        this.transitionEndEvent.emit({ chartID: this.chartID });
      });
  }

  setGlobalSelections() {
    const dataBoundToGeometries = this.bars.selectAll('.bar').data(this.preppedData, d => d[this.ordinalAccessor]);

    this.enter = dataBoundToGeometries.enter().append('rect');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    const dataBoundToLabels = this.labels.selectAll('text').data(this.preppedData, d => d[this.ordinalAccessor]);
    this.enteringLabels = dataBoundToLabels.enter().append('text');
    this.exitingLabels = dataBoundToLabels.exit();
    this.updatingLabels = dataBoundToLabels.merge(this.enteringLabels);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.barChartEl)
        .select('.visa-viz-d3-bar-container')
        .attr('data-testid', 'chart-container');
      select(this.barChartEl)
        .select('.bar-main-title')
        .attr('data-testid', 'main-title');
      select(this.barChartEl)
        .select('.bar-sub-title')
        .attr('data-testid', 'sub-title');
      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');
      this.bars.attr('data-testid', 'bar-group');
      this.labels.attr('data-testid', 'dataLabel-group');
      this.referencesG.attr('data-testid', 'reference-line-group');
      this.svg.select('defs').attr('data-testid', 'pattern-defs');

      this.updatingLabels.attr('data-testid', 'dataLabel').attr('data-id', d => `label-${d[this.ordinalAccessor]}`);
      this.update.attr('data-testid', 'bar').attr('data-id', d => `bar-${d[this.ordinalAccessor]}`);

      // reference lines do not have global selections
      this.referencesG.selectAll('.bar-reference-line').attr('data-testid', 'reference-line');

      this.referencesG.selectAll('.bar-reference-line-label').attr('data-testid', 'reference-line-label');
    } else {
      select(this.barChartEl)
        .select('.visa-viz-d3-bar-container')
        .attr('data-testid', null);
      select(this.barChartEl)
        .select('.bar-main-title')
        .attr('data-testid', null);
      select(this.barChartEl)
        .select('.bar-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);
      this.bars.attr('data-testid', null);
      this.labels.attr('data-testid', null);
      this.referencesG.attr('data-testid', null);
      this.svg.select('defs').attr('data-testid', null);

      this.updatingLabels.attr('data-testid', null).attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);

      this.referencesG.selectAll('.bar-reference-line').attr('data-testid', null);

      this.referencesG.selectAll('.bar-reference-line-label').attr('data-testid', null);
    }
  }

  renderRootElements() {
    this.svg = select(this.barChartEl)
      .select('.visa-viz-d3-bar-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);

    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.gridG = this.rootG.append('g').attr('class', 'grid-group');

    this.bars = this.rootG.append('g').attr('class', 'bar-group');

    this.labels = this.rootG.append('g').attr('class', 'bar-dataLabel-group');

    this.legendG = select(this.barChartEl)
      .select('.bar-legend')
      .append('svg');

    this.subTitleG = select(this.barChartEl).select('.bar-sub-title');

    this.tooltipG = select(this.barChartEl).select('.bar-tooltip');

    this.referencesG = this.rootG.append('g').attr('class', 'bar-reference-line-group');
  }

  setRoundedCorners() {
    this.update
      .transition('corners')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('rx', this.roundedCorner)
      .attr('ry', this.roundedCorner);
  }

  validateClickStyle() {
    this.innerClickStyle = this.clickStyle
      ? this.clickStyle
      : {
          strokeWidth: 2
        };
  }

  validateHoverStyle() {
    // interaction style default
    this.innerHoverStyle = this.hoverStyle
      ? this.hoverStyle
      : {
          strokeWidth: 2
        };
  }

  updateInteractionState() {
    removeHoverStrokes(this.svg.node());
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.update.interrupt('opacity');

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    // first we address interaction state on marks/bars
    this.update
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
      )
      .attr('fill', d => {
        // the following line could be added back in to improve performance, but it is visually quite jarring
        // const fillSource = !select(n[i]).classed('geometryIsMoving') ? this.colorArr : this.preparedColors
        return this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) &&
          this.innerClickStyle.color
          ? visaColors[this.innerClickStyle.color] || this.innerClickStyle.color
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.color
          ? visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color
          : this.groupAccessor
          ? this.colorArr(d[this.groupAccessor])
          : this.colorArr(d[this.valueAccessor]);
      })
      .attr('filter', (d, i, n) => {
        if (!this.accessibility.hideStrokes && !select(n[i]).classed('geometryIsMoving')) {
          const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
          const scheme =
            this.groupAccessor || colorsArray.length === 1
              ? 'categorical'
              : this.colorPalette && this.colorPalette.includes('diverging')
              ? 'diverging'
              : 'sequential';
          const colorScale =
            !this.accessibility.hideTextures && scheme !== 'categorical' && this.accessibility.showExperimentalTextures
              ? 'fillColors'
              : 'preparedColors';

          const clicked =
            this.clickHighlight &&
            this.clickHighlight.length > 0 &&
            checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
          const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
          const baseColor = this.groupAccessor
            ? this[colorScale](d[this.groupAccessor])
            : this[colorScale](d[this.valueAccessor]);
          const state = clicked ? 'click' : hovered && !select(n[i]).classed('geometryIsMoving') ? 'hover' : 'rest';
          const color =
            clicked && this.innerClickStyle.color
              ? visaColors[this.innerClickStyle.color] || this.innerClickStyle.color
              : clicked
              ? baseColor
              : hovered && this.innerHoverStyle.color
              ? visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color
              : baseColor;
          const strokeOverride =
            !this.accessibility.hideTextures &&
            scheme !== 'categorical' &&
            this.accessibility.showExperimentalTextures &&
            color === baseColor
              ? this.strokeColors(d[this.groupAccessor || this.valueAccessor])
              : undefined;
          if (state === 'hover') {
            drawHoverStrokes({
              inputElement: n[i],
              id: this.chartID,
              key: d[this.ordinalAccessor], // this must match whatever is used to bind the data, otherwise i
              strokeWidth: this.innerHoverStyle.strokeWidth,
              fill: color,
              strokeOverride
            });
          }
          return this.strokes[state + color];
        }
        return null;
      });
    retainAccessFocus({
      parentGNode: this.rootG.node()
    });

    // then we set the legend interactive state
    setLegendInteractionState({
      root: this.legendG,
      uniqueID: this.chartID,
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.groupAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.innerHoverStyle,
      clickStyle: this.innerClickStyle,
      hoverOpacity: this.hoverOpacity
    });

    // and lastly we have to check for labels, especially when auto placement is in place
    this.updatingLabels.interrupt('opacity');
    const addCollisionClass = this.placement === 'auto' || this.dataLabel.collisionHideOnly;
    const hideOnly = this.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    this.processLabelOpacity(this.updatingLabels, addCollisionClass);

    // if we have collision on, we need to update the bitmap on interaction
    if (addCollisionClass) {
      const labelsAdded = this.updatingLabels.filter((_, i, n) => select(n[i]).classed('collision-added'));
      const labelsRemoved = this.updatingLabels
        .filter((_, i, n) => select(n[i]).classed('collision-removed'))
        .attr('data-use-dx', hideOnly) // need to add this for remove piece of collision below
        .attr('data-use-dy', hideOnly); // .transition().duration(0);

      // we can now remove labels as well if we need to...
      if (labelsRemoved.size() > 0) {
        this.bitmaps = resolveLabelCollision({
          bitmaps: this.bitmaps,
          labelSelection: labelsRemoved,
          avoidMarks: [],
          validPositions: ['middle'],
          offsets: [1],
          accessors: ['key'],
          size: [roundTo(this.width, 0), roundTo(this.height, 0)],
          hideOnly: false,
          removeOnly: true
        });

        // remove temporary class now
        labelsRemoved.classed('collision-removed', false);
      }

      // we can now add labels as well if we need to...
      if (labelsAdded.size() > 0) {
        this.processLabelPosition(labelsAdded, false, false, true);

        // remove temporary class now
        labelsAdded.classed('collision-added', false);
      }
    }
  }

  setLabelOpacity() {
    this.processLabelOpacity(this.updatingLabels);
  }

  processLabelOpacity(selection, addCollisionClass?) {
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const fullBandwidth =
      this.layout === 'vertical' ? this.innerPaddedWidth / this.data.length : this.innerPaddedHeight / this.data.length;

    selection.attr('opacity', (d, i, n) => {
      const prevOpacity = +select(n[i]).attr('opacity');
      const styleVisibility = select(n[i]).style('visibility');
      const dimensions = {};
      dimensions[ordinalDimension] =
        this.placement === 'left' || this.placement === 'bottom' ? this[ordinalAxis].bandwidth() : fullBandwidth;
      if (this.placement === 'left' || this.placement === 'bottom') {
        dimensions[valueDimension] = Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        );
      }
      const hasRoom =
        this.placement === 'auto' ||
        this.dataLabel.collisionHideOnly ||
        this.accessibility.showSmallLabels ||
        verifyTextHasSpace({
          text: formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format),
          dimensions,
          fontSize: 14
        });
      const targetOpacity = hasRoom
        ? checkInteraction(
            d,
            checkLabelDisplayOnly(this.dataLabel.visible, this.dataLabel.displayOnly, d, this.displayOnlyLabelData, [
              this.ordinalAccessor
            ]),
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          ) < 1
          ? 0
          : 1
        : 0;
      if (
        ((targetOpacity === 1 && styleVisibility === 'hidden') || prevOpacity !== targetOpacity) &&
        addCollisionClass
      ) {
        if (targetOpacity === 1) {
          select(n[i])
            .classed('collision-added', true)
            .style('visibility', null);
        } else {
          select(n[i]).classed('collision-removed', true);
        }
      }
      return targetOpacity;
    });
  }

  checkLabelColorAgainstBackground() {
    this.updatingLabels.attr('fill', this.textTreatmentHandler);
  }

  textTreatmentHandler = (d, i, n) => {
    const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    const scheme =
      this.groupAccessor || colorsArray.length === 1
        ? 'categorical'
        : this.colorPalette && this.colorPalette.includes('diverging')
        ? 'diverging'
        : 'sequential';

    const colorScale =
      !this.accessibility.hideTextures && scheme !== 'categorical' && this.accessibility.showExperimentalTextures
        ? 'fillColors'
        : 'preparedColors';

    const bgColor =
      this.clickHighlight &&
      this.clickHighlight.length > 0 &&
      checkClicked(d, this.clickHighlight, this.innerInteractionKeys) &&
      this.innerClickStyle.color
        ? visaColors[this.innerClickStyle.color] || this.innerClickStyle.color
        : this.hoverHighlight &&
          checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
          this.innerHoverStyle.color
        ? visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color
        : this.groupAccessor
        ? this[colorScale](d[this.groupAccessor])
        : this[colorScale](d[this.valueAccessor]);
    const me = select(n[i]);
    const autoPlacementBackgroundColor =
      this.placement === 'auto' // can ignore this for collisionHideOnly
        ? this.layout === 'vertical'
          ? (this.dataLabel.collisionPlacement === 'top' && me.attr('data-baseline') !== 'bottom') ||
            (this.dataLabel.collisionPlacement === 'middle' && me.attr('data-baseline') !== 'bottom') ||
            (this.dataLabel.collisionPlacement === 'bottom' &&
              me.attr('data-baseline') === 'bottom' &&
              ((d[this.valueAccessor] >= 0 && this.y(0) - this.y(d[this.valueAccessor]) > 20) ||
                (d[this.valueAccessor] < 0 && this.y(0) - this.y(d[this.valueAccessor]) < -20))) // if bottom we can check against baseline value of 0, helps to handle charts with negative values
          : (this.dataLabel.collisionPlacement === 'right' && me.attr('data-align') !== 'left') ||
            (this.dataLabel.collisionPlacement === 'middle' && me.attr('data-align') !== 'left') ||
            (this.dataLabel.collisionPlacement === 'left' && me.attr('data-align') !== 'right')
        : false;
    const color =
      autoPlacementBackgroundColor || this.placement === 'bottom' || this.placement === 'left'
        ? autoTextColor(bgColor)
        : visaColors.dark_text;
    me.attr(
      'filter',
      !me.classed('textIsMoving')
        ? createTextStrokeFilter({
            root: this.svg.node(),
            id: this.chartID,
            color:
              autoPlacementBackgroundColor || this.placement === 'bottom' || this.placement === 'left'
                ? bgColor
                : '#ffffff'
          })
        : null
    );
    return color;
  };

  setSelectedClass() {
    this.update
      .classed('highlight', d => {
        const selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        return this.clickHighlight && this.clickHighlight.length ? selected : false;
      })
      .each((d, i, n) => {
        let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
        const selectable = this.accessibility.elementsAreInterface;
        setElementInteractionAccessState(n[i], selected, selectable);
      });
  }

  updateCursor() {
    this.update.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  bindLegendInteractivity() {
    select(this.barChartEl)
      .selectAll('.legend')
      .on('click', this.legend.interactive && !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        this.legend.interactive && !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i], true) : null
      )
      .on('mouseout', this.legend.interactive && !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  setLegendCursor() {
    select(this.barChartEl)
      .selectAll('.legend')
      .style('cursor', this.legend.interactive && !this.suppressEvents ? this.cursor : null);
  }

  bindInteractivity() {
    this.update
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
    this.updatingLabels
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  enterLabels() {
    this.enteringLabels
      .attr('opacity', d => {
        return checkInteraction(
          d,
          checkLabelDisplayOnly(this.dataLabel.visible, this.dataLabel.displayOnly, d, this.displayOnlyLabelData, [
            this.ordinalAccessor
          ]),
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : Number.EPSILON; // we need this to be epsilon initially to enable auto placement algorithm to run on load
      })
      .attr('class', 'bar-dataLabel entering') // entering class is used by collision
      .attr('fill', this.textTreatmentHandler)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    // placeDataLabels({
    //   root: this.enteringLabels,
    //   xScale: this.x,
    //   yScale: this.y,
    //   ordinalAccessor: this.ordinalAccessor,
    //   valueAccessor: this.valueAccessor,
    //   placement: this.placement,
    //   layout: this.layout,
    //   chartType: 'bar'
    // });
  }

  updateLabels() {
    const enterTransition = this.updatingLabels
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration);

    this.processLabelOpacity(enterTransition);
  }

  exitLabels() {
    this.exitingLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .remove();
  }

  setLabelContent() {
    this.updatingLabels.text(d => formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format));
  }

  setLabelPosition() {
    const enteringOnly = this.enteringLabels.filter((_, i, n) => {
      return select(n[i]).classed('entering');
    });
    const updatingOnly = this.updatingLabels.filter((_, i, n) => {
      return !select(n[i]).classed('entering');
    });
    // if we have enter and update we need to process them separately
    // enter with no transition, update with transition
    if (enteringOnly.size() > 0) {
      this.processLabelPosition(enteringOnly, false, true, false);
      this.processLabelPosition(updatingOnly, true, false, true);
    } else {
      // otherwise we can just process update and do it all in one step with transition
      this.processLabelPosition(updatingOnly, true, true, false);
    }
  }

  processLabelPosition(selection, runTransition?, redrawBitmap?, suppressMarkDraw?) {
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const choice = this.layout === 'vertical' ? 'max' : 'min';
    let textHeight = 15; // default label is usually 15
    const hideOnly = this.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    const collisionSettings = {
      vertical: {
        top: {
          validPositions: ['top', 'bottom'],
          offsets: [5, 1]
        },
        middle: {
          validPositions: ['middle', 'top'],
          offsets: [1, textHeight / 2]
        },
        bottom: {
          validPositions: ['middle', 'top'],
          offsets: [1, textHeight / 2]
        }
      },
      horizontal: {
        right: {
          validPositions: ['right', 'left'],
          offsets: [4, 8]
        },
        middle: {
          validPositions: ['middle', 'right'],
          offsets: [1, 15]
        },
        left: {
          validPositions: ['left', 'right'],
          offsets: [4, 20]
        }
      }
    };

    const collisionPlacement = this.dataLabel && this.dataLabel.collisionPlacement;
    const boundsScope =
      collisionPlacement && collisionSettings[this.layout][collisionPlacement] // check whether placement provided maps correctly
        ? this.dataLabel.collisionPlacement
        : this.layout === 'vertical'
        ? 'top' // if we don't have collisionPlacement
        : 'right';

    selection
      .style('visibility', (_, i, n) => {
        if (i === 0) {
          // we just need to check this on one element
          const textElement = n[i];
          const style = getComputedStyle(textElement);
          const fontSize = parseFloat(style.fontSize);
          textHeight = Math.max(fontSize - 1, 1); // clone.getBBox().height;
        }

        return this.placement === 'auto' || this.dataLabel.collisionHideOnly ? select(n[i]).style('visibility') : null;
      })
      .attr(`data-${ordinalAxis}`, d => this[ordinalAxis](d[this.ordinalAccessor]))
      .attr(`data-${ordinalDimension}`, this[ordinalAxis].bandwidth())
      .attr(`data-${valueAxis}`, d =>
        this.shouldCenterBaseline()
          ? this[valueAxis](halve(d[this.valueAccessor]) * (this.layout === 'vertical' ? 1 : -1))
          : this[valueAxis](Math[choice](0, d[this.valueAccessor]))
      )
      .attr(`data-${valueDimension}`, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top);

    const changeLabels = prepareRenderChange({
      selection: selection,
      duration: !runTransition ? 0 : this.duration,
      namespace: 'position-labels',
      easing: easeCircleIn
    });

    this.bitmaps = placeDataLabels({
      root: changeLabels,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.placement,
      layout: this.layout,
      labelOffset: this.shouldCenterBaseline() ? halve(1) : undefined,
      chartType: 'bar',
      avoidCollision: {
        runOccupancyBitmap: this.dataLabel.visible && this.placement === 'auto',
        bitmaps: !redrawBitmap ? this.bitmaps : undefined,
        labelSelection: changeLabels,
        avoidMarks: [this.update],
        validPositions: hideOnly ? ['middle'] : collisionSettings[this.layout][boundsScope].validPositions,
        offsets: hideOnly ? [1] : collisionSettings[this.layout][boundsScope].offsets,
        accessors: [this.ordinalAccessor, this.groupAccessor], // key is created for lines by nesting done in line,
        size: [roundTo(this.width, 0), roundTo(this.height, 0)], // for some reason the bitmap needs width instead of inner padded width here
        boundsScope: hideOnly ? undefined : boundsScope,
        hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly,
        suppressMarkDraw: suppressMarkDraw
      }
    });
  }

  drawReferenceLines() {
    setReferenceLine({
      groupName: 'bar',
      root: this.referencesG,
      referenceLines: this.referenceLines,
      referenceStyle: this.referenceStyle,
      innerPaddedWidth: this.innerPaddedWidth,
      innerPaddedHeight: this.innerPaddedHeight,
      duration: this.duration,
      layout: this.layout,
      x: this.x,
      y: this.y,
      unitTest: this.unitTest
    });
  }

  drawLegendElements() {
    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.top + 20,
      colorArr: this.colorArr,
      baseColorArr: this.preparedColors,
      hideStrokes: this.accessibility.hideStrokes,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: 'bar',
      fontSize: 16,
      data: this.legendData,
      labelKey: this.groupAccessor,
      label: this.legend.labels,
      format: this.legend.format,
      hide: !this.legend.visible || !this.groupAccessor, // only allow legend when there is groupAccessor
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.groupAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.innerHoverStyle,
      clickStyle: this.innerClickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.x,
      xAccessor: this.layout !== 'horizontal' ? this.ordinalAccessor : this.valueAccessor,
      yScale: this.y,
      yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.ordinalAccessor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      margin: this.margin,
      bitmaps: this.bitmaps
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.getLanguageString(), this.barChartEl, this.annotations, this.referenceLines);
  }

  // new accessibility functions added here
  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      language: this.getLanguageString(),
      rootEle: this.barChartEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'bar-chart',
      uniqueID: this.chartID,
      highestHeadingLevel: this.highestHeadingLevel,
      redraw: this.shouldRedrawWrapper,
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled,
      hideDataTable: this.accessibility.hideDataTableButton
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    setAccessibilityController({
      chartTag: 'bar-chart',
      language: this.getLanguageString(),
      node: this.svg.node(),
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'bar',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'bar-chart'),
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
      // groupName: 'node', // bar chart does not include these
      // groupKeys: [], // bar chart does not include these
      // nested: '', // bar chart does not include these
      // recursive: true // bar chart does not include these
    });
  }

  setGeometryAccessibilityAttributes() {
    this.update.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    const keys = scopeDataKeys(this, chartAccessors, 'bar-chart');
    this.update.each((_d, i, n) => {
      setElementFocusHandler({
        chartTag: 'bar-chart',
        language: this.getLanguageString(),
        node: n[i],
        geomType: 'bar',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        dataKeyNames: this.dataKeyNames,
        uniqueID: this.chartID,
        disableKeyNav:
          this.suppressEvents &&
          this.accessibility.elementsAreInterface === false &&
          this.accessibility.keyboardNavConfig &&
          this.accessibility.keyboardNavConfig.disabled
      });
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setGroupAccessibilityAttributes() {
    // if a component's <g> elements can enter/exit, this will need to be called in the
    // lifecycle more than just initially, like how setGeometryAccessibilityAttributes works
    initializeElementAccess(this.bars.node());
  }

  setGroupAccessibilityID() {
    this.bars.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.getLanguageString(), this.barChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.getLanguageString(), this.barChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.getLanguageString(), this.barChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.getLanguageString(), this.barChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.getLanguageString(), this.barChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.getLanguageString(), this.barChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.getLanguageString(), this.barChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.barChartEl,
      parentGNode: this.bars.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'bar-chart',
      geomType: 'bar'
      // groupName: 'line', // bar chart doesn't use this, so it is omitted
      // recursive: true // bar chart doesn't use this, so it is omitted
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.getLanguageString(), this.barChartEl, this.accessibility.structureNotes);
  }
  // new accessibility stuff ends here

  onChangeHandler() {
    if (this.accessibility && typeof this.accessibility.onChangeFunc === 'function') {
      const d = {
        updated: this.updated,
        added: this.enterSize,
        removed: this.exitSize
      };
      this.accessibility.onChangeFunc(d);
    }
    this.updated = false;
    this.enterSize = 0;
    this.exitSize = 0;
  }

  onClickHandler(d, n) {
    this.clickEvent.emit({ data: d, target: n });
  }

  onHoverHandler(d, n, isLegend?) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverEvent.emit({ data: d, target: n });
    if (this.showTooltip && !isLegend) {
      this.eventsTooltip({ data: d, evt: event, isToShow: true });
    }
  }

  onMouseOutHandler() {
    overrideTitleTooltip(this.chartID, false);
    this.mouseOutEvent.emit();
    if (this.showTooltip) {
      this.eventsTooltip({ isToShow: false });
    }
  }

  // set initial style (instead of copying css class across the lib)
  setTooltipInitialStyle() {
    initTooltipStyle(this.tooltipG);
  }

  // tooltip
  eventsTooltip({ data, evt, isToShow }: { data?: any; evt?: any; isToShow: boolean }) {
    drawTooltip({
      root: this.tooltipG,
      data,
      event: evt,
      isToShow,
      tooltipLabel: this.tooltipLabel,
      dataKeyNames: this.dataKeyNames,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      dataLabel: this.dataLabel,
      layout: this.layout,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      groupAccessor: this.groupAccessor,
      chartType: 'bar'
    });
  }

  render() {
    this.drawStartEvent.emit({ chartID: this.chartID });

    // theme hardcoded until we re-enable it
    const theme = 'light';
    // everything between this comment and the third should eventually
    // be moved into componentWillUpdate (if the Stencil bug is fixed)
    this.init();
    if (this.shouldSetLocalizationConfig) {
      this.setLocalizationConfig();
      this.shouldSetLocalizationConfig = false;
    }
    if (this.shouldSetTagLevels) {
      this.setTagLevels();
      this.shouldSetTagLevels = false;
    }
    if (this.shouldCheckValueAxis) {
      if (this.layout === 'horizontal') {
        this.shouldUpdateXAxis = true;
        this.shouldSetXAxisAccessibility = true;
        this.shouldUpdateXGrid = true;
      } else if (this.layout === 'vertical') {
        this.shouldUpdateYAxis = true;
        this.shouldSetYAxisAccessibility = true;
        this.shouldUpdateYGrid = true;
      }
      this.shouldCheckValueAxis = false;
    }
    if (this.shouldCheckLabelAxis) {
      if (this.layout === 'vertical') {
        this.shouldUpdateXAxis = true;
        this.shouldSetXAxisAccessibility = true;
      } else if (this.layout === 'horizontal') {
        this.shouldUpdateYAxis = true;
        this.shouldSetYAxisAccessibility = true;
      }
      this.shouldCheckLabelAxis = false;
    }
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateLegendData) {
      this.prepareLegendData();
      this.shouldUpdateLegendData = false;
    }
    if (this.shouldUpdateLabelData) {
      this.prepareLabelData();
      this.shouldUpdateLabelData = false;
    }
    if (this.shouldUpdateLayoutVariables) {
      this.updateChartVariable();
      this.shouldUpdateLayoutVariables = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldValidateInteractionKeys) {
      this.validateInteractionKeys();
      this.shouldValidateInteractionKeys = false;
    }
    if (this.shouldUpdateTableData) {
      this.setTableData();
      this.shouldUpdateTableData = false;
    }
    if (this.shouldValidate) {
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.shouldValidate = false;
    }
    if (this.shouldValidateClickStyle) {
      this.validateClickStyle();
      this.shouldValidateClickStyle = false;
    }
    if (this.shouldValidateHoverStyle) {
      this.validateHoverStyle();
      this.shouldValidateHoverStyle = false;
    }
    if (this.shouldValidateDataLabelAccessor) {
      this.validateDataLabelAccessor();
      this.shouldValidateDataLabelAccessor = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    if (this.shouldValidateLabelPlacement) {
      this.validateLabelPlacement();
      this.shouldValidateLabelPlacement = false;
    }

    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the Stencil bug is fixed)
    return (
      <div class={`o-layout is--${this.layout} ${theme}`}>
        <div class="o-layout--chart">
          <this.topLevel class="bar-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions bar-sub-title vcl-sub-title" />
          <div
            class="bar-legend vcl-legend"
            style={{ display: this.legend.visible && this.groupAccessor ? 'block' : 'none' }}
          />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'bar'}
            groupName={'bar group'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
            language={this.getLanguageString()}
            chartTag={'bar-chart'}
            width={this.width - (this.margin ? this.margin.right || 0 : 0)}
            isInteractive={this.accessibility.elementsAreInterface}
            hasCousinNavigation={this.groupAccessor ? true : false} // on bar this requires checking for groupAccessor
            disabled={
              this.suppressEvents &&
              this.accessibility.elementsAreInterface === false &&
              this.accessibility.keyboardNavConfig &&
              this.accessibility.keyboardNavConfig.disabled
            } // the chart is "simple"
          />
          <div class="visa-viz-d3-bar-container" />
          <div class="bar-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
          <data-table
            uniqueID={this.chartID}
            isCompact
            language={this.getLanguageString()}
            tableColumns={this.tableColumns}
            dataKeyNames={this.dataKeyNames}
            data={this.tableData}
            padding={this.padding}
            margin={this.margin}
            hideDataTable={this.accessibility.hideDataTableButton}
            unitTest={this.unitTest}
          />
        </div>
        {/* <canvas id="bitmap-render" /> */}
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(BarChartDefaultValues);
    let i = 0;
    const exceptions = {
      showTooltip: {
        exception: false
      },
      mainTitle: {
        exception: ''
      },
      subTitle: {
        exception: ''
      },
      barIntervalRatio: {
        exception: 0
      },
      wrapLabel: {
        exception: false
      },
      hoverOpacity: {
        exception: 0
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : BarChartDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
