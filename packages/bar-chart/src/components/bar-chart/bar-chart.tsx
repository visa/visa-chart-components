/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { easeCircleIn } from 'd3-ease';
import { nest } from 'd3-collection';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IAxisType,
  IReferenceStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  IAnimationConfig,
  ILegendType
} from '@visa/charts-types';
import { BarChartDefaultValues } from './bar-chart-default-values';
import { v4 as uuid } from 'uuid';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';

const {
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
  convertVisaColor,
  drawAxis,
  drawGrid,
  drawLegend,
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
  findTagLevel,
  prepareRenderChange,
  roundTo,
  resolveLabelCollision
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
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = BarChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = BarChartDefaultValues.subTitle;
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
  @Prop() suppressEvents: boolean = BarChartDefaultValues.suppressEvents;
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
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  bars: any;
  labels: any;
  nest: any;
  references: any;
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
  placement: string;
  legendG: any;
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
  shouldUpdateGeometries: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
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
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  shouldSetTextures: boolean = false;
  strokes: any = {};
  bitmaps: any;

  @Watch('data')
  dataWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    // this.shouldDrawInteractionState = true; // called from updateGeometries
    // this.shouldCheckLabelColor = true; // called from updateGeometries
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetLabelContent = true;
    this.shouldSetLabelPosition = true;
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
    if (newVisibleVal !== oldVisibleVal) {
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

  @Watch('referenceLines')
  @Watch('referenceStyle')
  referenceWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
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

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetAnnotationAccessibility = true;
  }

  @Watch('uniqueID')
  idWatcher(newVal, _oldVal) {
    this.chartID = newVal || 'bar-chart-' + uuid();
    this.barChartEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateLegend = true;
    this.shouldSetTextures = true;
    this.shouldCheckLabelColor = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetStrokes = true;
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
      this.setTagLevels();
      this.prepareData();
      this.prepareLegendData();
      this.updateChartVariable();
      this.prepareScales();
      this.validateInteractionKeys();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
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
    });
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

  prepareScales() {
    // scale band based on layout of chart
    const minBarValue = this.minValueOverride
      ? this.minValueOverride
      : min(this.preppedData, d => d[this.valueAccessor]);

    if (this.layout === 'vertical') {
      this.y = scaleLinear()
        .domain([Math.min(0, minBarValue), this.maxValueOverride || max(this.preppedData, d => d[this.valueAccessor])])
        .range([this.innerPaddedHeight, 0]);
      this.x = scaleBand()
        .domain(this.preppedData.map(d => d[this.ordinalAccessor]))
        .range([0, this.innerPaddedWidth])
        .padding(this.barIntervalRatio);
    } else if (this.layout === 'horizontal') {
      this.x = scaleLinear()
        .domain([Math.min(0, minBarValue), this.maxValueOverride || max(this.preppedData, d => d[this.valueAccessor])])
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

  // draw axis line
  drawXAxis() {
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
      label: this.xAxis.label,
      padding: this.padding,
      hide: !this.xAxis.visible,
      duration: this.duration
    });
  }

  drawYAxis() {
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
      label: this.yAxis.label,
      padding: this.padding,
      hide: !this.yAxis.visible,
      duration: this.duration
    });
  }

  drawBaseline() {
    // add baseline at 0
    if (this.layout === 'vertical') {
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
        markOffset: this.x(0) || -1,
        duration: this.duration
      });
    }
  }

  setXAxisAccessibility() {
    setAccessXAxis({
      rootEle: this.barChartEl,
      hasXAxis: this.xAxis ? this.xAxis.visible : false,
      xAxis: this.x ? this.x : false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    setAccessYAxis({
      rootEle: this.barChartEl,
      hasYAxis: this.yAxis ? this.yAxis.visible : false,
      yAxis: this.y ? this.y : false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: this.yAxis.label ? this.yAxis.label : '' // this is optional for some charts, if hasXAxis is always false
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
      !(!(this.layout === 'vertical') && this.xAxis.gridVisible),
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
      !(this.layout === 'vertical' && this.yAxis.gridVisible),
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
      .attr(valueAxis, d => this[valueAxis](Math[choice](0, d[this.valueAccessor])))
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
            newValue: this[valueAxis](Math[choice](0, d[this.valueAccessor])) // this.y(d[this.valueAccessor]))
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
      .attr(`data-${valueAxis}`, d => this[valueAxis](Math[choice](0, d[this.valueAccessor]))) // this.y(d[this.valueAccessor]))
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
      .attr(valueAxis, d => this[valueAxis](Math[choice](0, d[this.valueAccessor]))) // this.y(d[this.valueAccessor]))
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
      this.references.attr('data-testid', 'reference-line-group');
      this.svg.select('defs').attr('data-testid', 'pattern-defs');

      this.updatingLabels.attr('data-testid', 'dataLabel').attr('data-id', d => `label-${d[this.ordinalAccessor]}`);
      this.update.attr('data-testid', 'bar').attr('data-id', d => `bar-${d[this.ordinalAccessor]}`);

      // reference lines do not have global selections
      this.references.selectAll('.bar-reference-line').attr('data-testid', 'reference-line');

      this.references.selectAll('.bar-reference-line-label').attr('data-testid', 'reference-line-label');
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
      this.references.attr('data-testid', null);
      this.svg.select('defs').attr('data-testid', null);

      this.updatingLabels.attr('data-testid', null).attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);

      this.references.selectAll('.bar-reference-line').attr('data-testid', null);

      this.references.selectAll('.bar-reference-line-label').attr('data-testid', null);
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

    this.tooltipG = select(this.barChartEl).select('.bar-tooltip');

    this.references = this.rootG.append('g').attr('class', 'bar-reference-line-group');
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
    const opacity = this.dataLabel.visible ? 1 : 0;
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
            opacity,
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
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.enteringLabels
      .attr('opacity', d => {
        return checkInteraction(
          d,
          opacity,
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
      .attr(`data-${valueAxis}`, d => this[valueAxis](Math[choice](0, d[this.valueAccessor]))) // this.y(d[this.valueAccessor]))
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
    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', '.bar-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines.attr('class', 'bar-reference-line').attr('opacity', 0);

    const enterLabels = enterReferences.append('text');

    enterLabels.attr('class', 'bar-reference-line-label').attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.bar-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeLabels = mergeReferences
      .selectAll('.bar-reference-line-label')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration)
      .text(d => d.label);

    const exitReferences = currentReferences.exit();

    exitReferences
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();

    if (this.layout === 'vertical') {
      enterReferences.attr('transform', d => {
        return 'translate(0,' + this.y(d.value) + ')';
      });

      mergeReferences
        .transition('merge')
        .ease(easeCircleIn)
        .duration(this.duration)
        .attr('transform', d => {
          return 'translate(0,' + this.y(d.value) + ')';
        });

      enterLines
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x2', this.innerPaddedWidth);

      enterLabels
        .attr('text-anchor', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? 'start' : 'end'))
        .attr('x', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? this.innerPaddedWidth : 0))
        .attr('y', 0)
        .attr('dx', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? '0.1em' : '-0.1em'))
        .attr('dy', '0.3em');

      mergeLines
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x2', this.innerPaddedWidth);

      mergeLabels
        .attr('text-anchor', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? 'start' : 'end'))
        .attr('x', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? this.innerPaddedWidth : 0))
        .attr('y', 0)
        .attr('dx', d => ((d.labelPlacementHorizontal || 'right') === 'right' ? '0.1em' : '-0.1em'))
        .attr('dy', '0.3em');
    } else if (this.layout === 'horizontal') {
      enterReferences.attr('transform', d => {
        return 'translate(' + this.x(d.value) + ',0)';
      });

      mergeReferences
        .transition('merge')
        .ease(easeCircleIn)
        .duration(this.duration)
        .attr('transform', d => {
          return 'translate(' + this.x(d.value) + ',0)';
        });

      enterLines
        .attr('x1', 0)
        .attr('y1', this.innerPaddedHeight)
        .attr('x2', 0)
        .attr('y2', 0);

      mergeLines
        .attr('x1', 0)
        .attr('y1', this.innerPaddedHeight)
        .attr('x2', 0)
        .attr('y2', 0);

      enterLabels
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => ((d.labelPlacementVertical || 'top') === 'top' ? 0 : this.innerPaddedHeight))
        .attr('dx', 0)
        .attr('dy', d => ((d.labelPlacementVertical || 'top') === 'top' ? '-0.3em' : '1em'));

      mergeLabels
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', d => {
          return (d.labelPlacementVertical || 'top') === 'top' ? 0 : this.innerPaddedHeight;
        })
        .attr('dx', 0)
        .attr('dy', d => ((d.labelPlacementVertical || 'top') === 'top' ? '-0.3em' : '1em'));
    }

    mergeLines
      .style('stroke', visaColors[this.referenceStyle.color] || this.referenceStyle.color)
      .style('stroke-width', this.referenceStyle.strokeWidth)
      .attr('stroke-dasharray', this.referenceStyle.dashed ? this.referenceStyle.dashed : '')
      .attr('opacity', this.referenceStyle.opacity);

    mergeLabels.style('fill', visaColors[this.referenceStyle.color] || this.referenceStyle.color).attr('opacity', 1);
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
    setAccessAnnotation(this.barChartEl, this.annotations);
  }

  // new accessibility functions added here
  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
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
        this.accessibility.keyboardNavConfig.disabled
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    setAccessibilityController({
      node: this.svg.node(),
      chartTag: 'bar-chart',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'bar',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'bar-chart'),
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
        node: n[i],
        geomType: 'bar',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
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
    setAccessTitle(this.barChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.barChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.barChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.barChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.barChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.barChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.barChartEl, this.accessibility.statisticalNotes);
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
    setAccessStructure(this.barChartEl, this.accessibility.structureNotes);
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
    // be moved into componentWillUpdate (if the stenicl bug is fixed)
    this.init();
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
    // be moved into componentWillUpdate (if the stenicl bug is fixed)
    return (
      <div class={`o-layout is--${this.layout} ${theme}`}>
        <div class="o-layout--chart">
          <this.topLevel class="bar-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions bar-sub-title vcl-sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div
            class="bar-legend vcl-legend"
            style={{ display: this.legend.visible && this.groupAccessor ? 'block' : 'none' }}
          />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'bar'}
            groupName={'bar group'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
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
            tableColumns={this.tableColumns}
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
