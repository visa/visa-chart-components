/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleBand, scaleLinear } from 'd3-scale';
import { nest } from 'd3-collection';
import { easeCircleIn } from 'd3-ease';
import {
  ILocalizationType,
  IBoxModelType,
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
import { ClusteredBarChartDefaultValues } from './clustered-bar-chart-default-values';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';
import { v4 as uuid } from 'uuid';
const {
  configLocalization,
  getGlobalInstances,
  getActiveLanguageString,
  verifyTextHasSpace,
  checkAttributeTransitions,
  createTextStrokeFilter,
  drawHoverStrokes,
  removeHoverStrokes,
  buildStrokes,
  convertColorsToTextures,
  initializeDescriptionRoot,
  initializeElementAccess,
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
  convertVisaColor,
  checkInteraction,
  checkClicked,
  checkHovered,
  drawAxis,
  drawGrid,
  drawLegend,
  setLegendInteractionState,
  drawTooltip,
  formatDataLabel,
  formatDate,
  getColors,
  getLicenses,
  getPadding,
  getScopedData,
  initTooltipStyle,
  overrideTitleTooltip,
  placeDataLabels,
  scopeDataKeys,
  transitionEndAll,
  visaColors,
  validateAccessibilityProps,
  validateLocalizationProps,
  findTagLevel,
  prepareRenderChange,
  roundTo,
  resolveLabelCollision,
  setSubTitle,
  setReferenceLine
} = Utils;

@Component({
  tag: 'clustered-bar-chart',
  styleUrl: 'clustered-bar-chart.scss'
})
export class ClusteredBarChart {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = ClusteredBarChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string | ISubTitleType = ClusteredBarChartDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = ClusteredBarChartDefaultValues.height;
  @Prop({ mutable: true }) width: number = ClusteredBarChartDefaultValues.width;
  @Prop({ mutable: true }) layout: string = ClusteredBarChartDefaultValues.layout;
  @Prop({ mutable: true }) margin: IBoxModelType = ClusteredBarChartDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = ClusteredBarChartDefaultValues.padding;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = ClusteredBarChartDefaultValues.highestHeadingLevel;

  // Data (2/7)
  @Prop() data;
  @Prop() uniqueID;
  @Prop({ mutable: true }) localization: ILocalizationType = ClusteredBarChartDefaultValues.localization;
  @Prop({ mutable: true }) ordinalAccessor: string = ClusteredBarChartDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = ClusteredBarChartDefaultValues.valueAccessor;
  @Prop({ mutable: true }) groupAccessor: string = ClusteredBarChartDefaultValues.groupAccessor;
  @Prop({ mutable: true }) reverseOrder: boolean = ClusteredBarChartDefaultValues.reverseOrder;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = ClusteredBarChartDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = ClusteredBarChartDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = ClusteredBarChartDefaultValues.wrapLabel;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = ClusteredBarChartDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = ClusteredBarChartDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = ClusteredBarChartDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = ClusteredBarChartDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = ClusteredBarChartDefaultValues.cursor;
  @Prop({ mutable: true }) roundedCorner: number = ClusteredBarChartDefaultValues.roundedCorner;
  @Prop({ mutable: true }) barIntervalRatio: number = ClusteredBarChartDefaultValues.barIntervalRatio;
  @Prop({ mutable: true }) groupIntervalRatio: number = ClusteredBarChartDefaultValues.groupIntervalRatio;
  @Prop({ mutable: true }) hoverOpacity: number = ClusteredBarChartDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = ClusteredBarChartDefaultValues.animationConfig;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = ClusteredBarChartDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) showTooltip: boolean = ClusteredBarChartDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = ClusteredBarChartDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = ClusteredBarChartDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = ClusteredBarChartDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = ClusteredBarChartDefaultValues.annotations;

  // Calculation (6/7)
  @Prop({ mutable: true }) minValueOverride: number;
  @Prop({ mutable: true }) maxValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = ClusteredBarChartDefaultValues.referenceLines;

  // Interactivity (7/7)
  @Prop({ mutable: true }) suppressEvents: boolean = ClusteredBarChartDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = ClusteredBarChartDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Testing & Debug (8/8)
  @Prop() unitTest: boolean = false;
  // @Prop() debugMode: boolean = false;

  // Element
  @Element()
  clusteredBarChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  shouldValidateLocalization: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  barG: any;
  gridG: any;
  bars: any;
  labelG: any;
  labels: any;
  referencesG: any;
  defaults: boolean;
  current: any;
  enter: any;
  exit: any;
  update: any;
  enterBarWrappers: any;
  updateBarWrappers: any;
  exitBarWrappers: any;
  // vertical layout
  x0: any;
  x1: any;
  y: any;
  // horizontal layout
  y0: any;
  y1: any;
  x: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  nest: any = [];
  datakeys: any = [];
  legendData: any = [];
  colorArr: any;
  preparedColors: any;
  duration: number;
  legendG: any;
  subTitleG: any;
  tooltipG: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  enterLabels: any;
  exitLabels: any;
  updateLabels: any;
  enterLabelWrappers: any;
  updateLabelWrappers: any;
  exitLabelWrappers: any;
  tableData: any;
  tableColumns: any;
  chartID: string;
  innerInteractionKeys: any;
  innerLabelAccessor: string;
  shouldValidate: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetDimensions: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldValidateAxes: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetSubTitle: boolean = false;
  shouldValidateLabelPlacement: boolean = false;
  shouldValidateDataLabelAccessor: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldCheckValueAxis: boolean = false;
  shouldCheckLabelAxis: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldUpdateCorners: boolean = false;
  shouldUpdateLegendData: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldSetLegendCursor: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSetLabelPosition: boolean = false;
  shouldSetLabelContent: boolean = false;
  shouldCheckLabelColor: boolean = false;
  shouldBindInteractivity: boolean = false;
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
  shouldSetGroupAccessibilityLabel: boolean = false;
  shouldSetChartAccessibilityPurpose: boolean = false;
  shouldSetChartAccessibilityContext: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldRedrawWrapper: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  shouldSetYAxisAccessibility: boolean = false;
  shouldSetXAxisAccessibility: boolean = false;
  shouldSetAnnotationAccessibility: boolean = false;
  shouldSetTextures: boolean = false;
  shouldSetStrokes: boolean = false;
  shouldSetLocalizationConfig: boolean = false;
  strokes: any = {};
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  bitmaps: any;

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetLabelContent = true;
    this.shouldSetLabelPosition = true;
    // this.shouldDrawInteractionState = true; // called from updateGeometries
    // this.shouldCheckLabelColor = true; // called from updateGeometries
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateLegendData = true;
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

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    console.error(
      'Change detected in prop uniqueID from value ' +
        _oldID +
        ' to value ' +
        newID +
        '. This prop cannot be changed after component has loaded.'
    );
    // this.chartID = newID || 'clustered-bar-chart-' + uuid();
    // this.clusteredBarChartEl.id = this.chartID;
    // this.shouldValidate = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldUpdateLegend = true;
    // this.shouldSetStrokes = true;
  }

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldSetAnnotationAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
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

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldSetDimensions = true;
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

  @Watch('layout')
  layoutWatcher(_newVal, _oldVal) {
    this.shouldValidateLabelPlacement = true;
    this.shouldUpdateScales = true;
    this.shouldValidateAxes = true;
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
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetTestingAttributes = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateScales = true;
    this.shouldSetColors = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetColors = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckValueAxis = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldSetLabelContent = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldCheckLabelAxis = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('reverseOrder')
  reverseOrderWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    if (this.layout === 'vertical') {
      this.shouldValidateAxes = true;
      this.shouldUpdateXAxis = true;
      this.shouldSetXAxisAccessibility = true;
    } else if (this.layout === 'horizontal') {
      this.shouldValidateAxes = true;
      this.shouldUpdateYAxis = true;
      this.shouldSetYAxisAccessibility = true;
    }
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    this.shouldValidateAxes = true;
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
    this.shouldValidateAxes = true;
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
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
  }

  @Watch('colors')
  @Watch('colorPalette')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetStrokes = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetStrokes = true;
  }

  @Watch('referenceLines')
  @Watch('referenceStyle')
  referenceWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
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

  @Watch('groupIntervalRatio')
  groupIntervalRatioWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
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
    // if only visible changes we just flip opacity, but don't redraw
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    // any placement related stuff and we do a full redraw, no opacity
    if (
      newPlacementVal !== oldPlacementVal ||
      newCollisionPlacementVal !== oldCollisionPlacementVal ||
      newCollisionHideOnlyVal !== oldCollisionHideOnlyVal
    ) {
      this.shouldValidateLabelPlacement = true;
      this.shouldSetLabelPosition = true;
      this.shouldCheckLabelColor = true;
    }
    // text/format required redraw/table but no opacity
    if (newAccessor !== oldAccessor || newFormatVal !== oldFormatVal) {
      this.shouldValidateDataLabelAccessor = true;
      this.shouldUpdateTableData = true;
      this.shouldSetLabelContent = true;
      this.shouldCheckLabelColor = true;
    }
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
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
    if (newTextures !== oldTextures) {
      this.shouldSetTextures = true;
      this.shouldUpdateLegend = true;
      this.shouldDrawInteractionState = true;
    }
    const newSmallValue = _newVal && _newVal.showSmallLabels ? _newVal.showSmallLabels : false;
    const oldSmallValue = _oldVal && _oldVal.showSmallLabels ? _oldVal.showSmallLabels : false;
    if (newSmallValue !== oldSmallValue) {
      this.shouldSetLabelOpacity = true;
    }
    const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    if (newStrokes !== oldStrokes) {
      this.shouldUpdateLegend = true;
      this.shouldSetStrokes = true;
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
      this.shouldDrawInteractionState = true;
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

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetAnnotationAccessibility = true;
  }

  @Watch('maxValueOverride')
  @Watch('minValueOverride')
  valueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldCheckValueAxis = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetLabelPosition = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
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
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
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

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
    this.shouldUpdateLegendInteractivity = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldRedrawWrapper = true;
    this.shouldValidate = true;
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
    const chartID = this.uniqueID || 'clustered-bar-chart-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.clusteredBarChartEl.id = this.chartID;
      this.setLocalizationConfig();
      this.setTagLevels();
      this.prepareData();
      this.prepareLegendData();
      this.setDimensions();
      this.prepareScales();
      this.validateInteractionKeys();
      this.validateDataLabelAccessor();
      this.validateAxes();
      this.validateLabelPlacement();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
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
      this.enterGeometries();
      this.updateGeometries();
      this.exitGeometries();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.drawGeometries();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawLegendElements();
      this.bindLegendInteractivity();
      this.setLabelContent();
      this.processLabelPosition(this.updateLabels, false, true, false);
      this.drawReferenceLines();
      this.setSelectedClass();
      this.checkLabelColorAgainstBackground();
      this.updateCursor();
      this.bindInteractivity();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.drawYAxis();
      this.setYAxisAccessibility();
      this.drawBaseline();
      this.onChangeHandler();

      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.barG.node());
      this.setGroupAccessibilityID();
      this.defaults = false;

      // catch all to remove entering class from labels once we have loaded component
      this.updateLabels.classed('entering', false);
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
        this.enterDataLabels();
        this.updateDataLabels();
        this.exitDataLabels();
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
      if (this.shouldUpdateAnnotations) {
        this.drawAnnotations();
        this.shouldUpdateAnnotations = false;
      }
      if (this.shouldSetAnnotationAccessibility) {
        this.setAnnotationAccessibility();
        this.shouldSetAnnotationAccessibility = false;
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
      if (this.shouldUpdateBaseline) {
        this.drawBaseline();
        this.shouldUpdateBaseline = false;
      }
      this.onChangeHandler();
      this.updateLabels.classed('entering', false);
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
            onClickEvent: !this.suppressEvents ? this.clickEvent.emit : undefined
          }
        }
      );
    }
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length ? this.interactionKeys : [this.ordinalAccessor];
  }

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueAccessor;
  }

  validateLabelPlacement() {
    // check data label placement assignment based on layout
    if (this.layout === 'vertical') {
      if (
        this.dataLabel.placement !== 'top' &&
        this.dataLabel.placement !== 'bottom' &&
        this.dataLabel.placement !== 'auto'
      ) {
        this.dataLabel.placement = 'top';
      }
    } else {
      if (
        this.dataLabel.placement !== 'right' &&
        this.dataLabel.placement !== 'left' &&
        this.dataLabel.placement !== 'auto'
      ) {
        this.dataLabel.placement = 'right';
      }
    }
  }

  getLanguageString() {
    return getActiveLanguageString(this.localization);
  }

  setLocalizationConfig() {
    configLocalization(this.localization);
  }

  setDimensions() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  prepareData() {
    // check data format & offset time object
    this.data.map(d => {
      d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);
      d[this.groupAccessor] =
        d[this.groupAccessor] instanceof Date
          ? formatDate({
              date: d[this.groupAccessor],
              format: this.layout === 'vertical' ? this.xAxis.format : this.yAxis.format,
              offsetTimezone: true
            })
          : d[this.groupAccessor];
    });

    this.nest = nest()
      .key(d => d[this.groupAccessor])
      .entries(this.data);

    // Get all item categories
    this.datakeys = this.nest.map(d => d.key);
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'clustered-bar-chart');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  prepareScales() {
    const minBarValue =
      this.minValueOverride && this.minValueOverride < min(this.data, d => d[this.valueAccessor])
        ? this.minValueOverride
        : min(this.data, d => d[this.valueAccessor]);

    const maxBarValue =
      this.maxValueOverride && this.maxValueOverride > max(this.data, d => d[this.valueAccessor])
        ? this.maxValueOverride
        : max(this.data, d => d[this.valueAccessor]);

    // scale band based on layout of chart
    if (this.layout === 'vertical') {
      this.y = scaleLinear()
        .domain([Math.min(0, minBarValue), Math.max(0, maxBarValue)])
        .range([this.innerPaddedHeight, 0]);

      this.x0 = scaleBand()
        .domain(this.datakeys)
        .range(this.reverseOrder ? [this.innerPaddedWidth, 0] : [0, this.innerPaddedWidth])
        .padding(this.groupIntervalRatio);

      this.x1 = scaleBand()
        .domain(this.nest[0].values.map(d => d[this.ordinalAccessor]))
        .rangeRound([0, this.x0.bandwidth()])
        .padding(this.barIntervalRatio);
    } else if (this.layout === 'horizontal') {
      this.x = scaleLinear()
        .domain([Math.min(0, minBarValue), Math.max(0, maxBarValue)])
        .range([0, this.innerPaddedWidth]);

      this.y0 = scaleBand()
        .domain(this.datakeys)
        .range(this.reverseOrder ? [this.innerPaddedHeight, 0] : [0, this.innerPaddedHeight])
        .padding(this.groupIntervalRatio);

      this.y1 = scaleBand()
        .domain(this.nest[0].values.map(d => d[this.ordinalAccessor]))
        .rangeRound([0, this.y0.bandwidth()])
        .padding(this.barIntervalRatio);
    }
  }

  validateAxes() {
    // check whether we are going to display axis and then update props
    this.innerXAxis = { ...this.xAxis, gridVisible: !(this.layout === 'vertical') && this.xAxis.gridVisible };
    this.innerYAxis = { ...this.yAxis, gridVisible: this.layout === 'vertical' && this.yAxis.gridVisible };
  }

  setSubTitleElements() {
    setSubTitle({
      root: this.subTitleG,
      subTitle: this.subTitle
    });
  }

  setColors() {
    this.preparedColors = this.colors
      ? convertVisaColor(this.colors)
      : getColors(this.colorPalette, this.nest[0].values.length);
  }

  setTextures() {
    const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    if (this.accessibility.hideTextures || colorsArray.length > 6) {
      this.colorArr = this.preparedColors;
    } else {
      const colorsToConvert = colorsArray;
      const textures = convertColorsToTextures({
        colors: colorsToConvert,
        rootSVG: this.svg.node(),
        id: this.chartID,
        scheme: 'categorical',
        disableTransitions: !this.duration
      });
      this.colorArr = this.preparedColors.range ? this.preparedColors.copy().range(textures) : textures;
    }
  }

  setStrokes() {
    this.strokes = buildStrokes({
      root: this.svg.node(),
      id: this.chartID,
      colors: this.preparedColors.range ? this.preparedColors.range() : this.preparedColors,
      clickStyle: this.clickStyle,
      hoverStyle: this.hoverStyle
    });
  }

  renderRootElements() {
    this.svg = select(this.clusteredBarChartEl)
      .select('.visa-viz-d3-clustered-bar-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.gridG = this.rootG.append('g').attr('class', 'grid-group');
    this.barG = this.rootG.append('g').attr('class', 'clustered-bar-group');

    this.labelG = this.rootG.append('g').attr('class', 'clustered-bar-dataLabel-group');

    this.legendG = select(this.clusteredBarChartEl)
      .select('.clustered-bar-legend')
      .append('svg');

    this.subTitleG = select(this.clusteredBarChartEl).select('.clustered-bar-sub-title');
    this.tooltipG = select(this.clusteredBarChartEl).select('.clustered-bar-tooltip');

    this.referencesG = this.rootG.append('g').attr('class', 'clustered-bar-reference-line-group');
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.clusteredBarChartEl)
        .select('.visa-viz-d3-clustered-bar-container')
        .attr('data-testid', 'chart-container');
      select(this.clusteredBarChartEl)
        .select('.clustered-bar-main-title')
        .attr('data-testid', 'main-title');
      select(this.clusteredBarChartEl)
        .select('.clustered-bar-sub-title')
        .attr('data-testid', 'sub-title');

      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');

      this.barG.attr('data-testid', 'clustered-bar-group');
      this.updateBarWrappers
        .attr('data-testid', 'clustered-bar-wrapper')
        .attr('data-id', d => `clustered-bar-wrapper-${d.key}`);
      this.update
        .attr('data-testid', 'bar')
        .attr('data-id', d => `bar-${d[this.groupAccessor]}-${d[this.ordinalAccessor]}`);

      this.labelG.attr('data-testid', 'clustered-bar-dataLabel-group');
      this.updateLabelWrappers
        .attr('data-testid', 'clustered-bar-dataLabel-wrapper')
        .attr('data-id', d => `clustered-bar-dataLabel-wrapper-${d.key}`);
      this.updateLabels
        .attr('data-testid', 'dataLabel')
        .attr('data-id', d => `dataLabel-${d[this.groupAccessor]}-${d[this.ordinalAccessor]}`);

      this.referencesG.attr('data-testid', 'reference-line-group');
      this.svg.select('defs').attr('data-testid', 'pattern-defs');

      // reference lines do not have global selections
      this.referencesG.selectAll('.clustered-bar-reference-line').attr('data-testid', 'reference-line');

      this.referencesG.selectAll('.clustered-bar-reference-line-label').attr('data-testid', 'reference-line-label');
    } else {
      select(this.clusteredBarChartEl)
        .select('.visa-viz-d3-clustered-bar-container')
        .attr('data-testid', null);
      select(this.clusteredBarChartEl)
        .select('.clustered-bar-main-title')
        .attr('data-testid', null);
      select(this.clusteredBarChartEl)
        .select('.clustered-bar-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);

      this.barG.attr('data-testid', null);
      this.updateBarWrappers.attr('data-testid', null).attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);

      this.labelG.attr('data-testid', null);
      this.updateLabelWrappers.attr('data-testid', null).attr('data-id', null);
      this.updateLabels.attr('data-testid', null).attr('data-id', null);

      this.referencesG.attr('data-testid', null);
      this.svg.select('defs').attr('data-testid', null);

      // reference lines do not have global selections
      this.referencesG.selectAll('.clustered-bar-reference-line').attr('data-testid', null);

      this.referencesG.selectAll('.clustered-bar-reference-line-label').attr('data-testid', null);
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
    const axisAccessor = this.layout === 'vertical' ? this.groupAccessor : this.valueAccessor;
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
      axisScale: this.layout === 'vertical' ? this.x0 : this.x,
      left: false,
      wrapLabel: this.wrapLabel && this.layout === 'vertical' ? this.x0.bandwidth() : '',
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: axisLabel, // this.xAxis.label,
      padding: this.padding,
      hide: !this.innerXAxis.visible,
      duration: this.duration
    });
  }

  drawYAxis() {
    const axisAccessor = this.layout === 'vertical' ? this.valueAccessor : this.groupAccessor;
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
      axisScale: this.layout === 'vertical' ? this.y : this.y0,
      left: true,
      wrapLabel: this.wrapLabel ? this.padding.left || 100 : '',
      format: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: axisLabel, // this.yAxis.label,
      padding: this.padding,
      hide: !this.innerYAxis.visible,
      duration: this.duration
    });
  }

  setXAxisAccessibility() {
    const axisAccessor = this.layout === 'vertical' ? this.groupAccessor : this.valueAccessor;
    const axisLabel =
      this.xAxis.label || this.xAxis.label === ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.xAxis.label;

    setAccessXAxis({
      rootEle: this.clusteredBarChartEl,
      hasXAxis: this.innerXAxis ? this.innerXAxis.visible : false,
      xAxis: this.layout === 'vertical' ? this.x0 || false : this.x || false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    const axisAccessor = this.layout === 'vertical' ? this.valueAccessor : this.groupAccessor;
    const axisLabel =
      this.yAxis.label && this.yAxis.label !== ''
        ? this.yAxis.label
        : this.dataKeyNames && this.dataKeyNames[axisAccessor]
        ? this.dataKeyNames[axisAccessor]
        : this.yAxis.label;

    setAccessYAxis({
      rootEle: this.clusteredBarChartEl,
      hasYAxis: this.innerYAxis ? this.innerYAxis.visible : false,
      yAxis: this.layout === 'vertical' ? this.y || false : this.y0 || false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  drawBaseline() {
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.layout === 'vertical' ? this.x0 : this.x,
      left: false,
      padding: this.padding,
      markOffset: this.layout === 'vertical' ? this.y(0) || -1 : this.y0(0) || -1,
      hide: !(this.layout === 'vertical'),
      duration: this.duration
    });
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.layout === 'vertical' ? this.y : this.y0,
      left: true,
      padding: this.padding,
      markOffset: this.layout === 'vertical' ? this.x0(0) || -1 : this.x(0) || -1,
      hide: this.layout === 'vertical',
      duration: this.duration
    });
  }

  // dashed line grid for chart
  drawXGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.layout === 'vertical' ? this.x0 : this.x,
      false,
      !this.innerXAxis.gridVisible,
      this.xAxis.tickInterval,
      this.duration
    );
  }

  drawYGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.layout === 'vertical' ? this.y : this.y0,
      true,
      !this.innerYAxis.gridVisible,
      this.yAxis.tickInterval,
      this.duration
    );
  }

  setGlobalSelections() {
    const dataBoundToWrappers = this.barG.selectAll('.clustered-bar-wrapper').data(this.nest, d => d.key);

    this.enterBarWrappers = dataBoundToWrappers.enter().append('g');
    this.exitBarWrappers = dataBoundToWrappers.exit();
    this.updateBarWrappers = dataBoundToWrappers.merge(this.enterBarWrappers);

    const dataBoundToGeometries = this.updateBarWrappers
      .selectAll('.clustered-bar')
      .data(d => d.values, d => d[this.ordinalAccessor]);

    this.enter = dataBoundToGeometries.enter().append('rect');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.enterSize = this.enter.size();
    this.exitSize = this.exit.size();

    const dataBoundToLabelWrappers = this.labelG.selectAll('g').data(this.nest, d => d.key);

    this.enterLabelWrappers = dataBoundToLabelWrappers.enter().append('g');
    this.exitLabelWrappers = dataBoundToLabelWrappers.exit();
    this.updateLabelWrappers = dataBoundToLabelWrappers.merge(this.enterLabelWrappers);

    const dataBoundToLabels = this.updateLabelWrappers
      .selectAll('text')
      .data(d => d.values, d => d[this.ordinalAccessor]);
    this.enterLabels = dataBoundToLabels.enter().append('text');
    this.exitLabels = dataBoundToLabels.exit();
    this.updateLabels = dataBoundToLabels.merge(this.enterLabels);
    // this.labels
  }

  enterGeometries() {
    this.enter.interrupt();
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const choice = this.layout === 'vertical' ? 'max' : 'min';

    this.enterBarWrappers
      .attr('class', 'clustered-bar-wrapper')
      .classed('entering', true)
      .attr('transform', d =>
        this.layout === 'vertical' ? 'translate(' + this.x0(d.key) + ',0)' : 'translate(0,' + this.y0(d.key) + ')'
      )
      .each((_, i, n) => {
        initializeElementAccess(n[i]);
      });

    this.enter
      .attr('class', 'clustered-bar')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('rx', this.roundedCorner)
      .attr('ry', this.roundedCorner)
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      })
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('fill', (d, i) => {
        const clicked =
          this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
        const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
        const baseColor = this.colorArr[i];
        return clicked && this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : clicked
          ? baseColor
          : hovered && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : baseColor;
      })
      .attr('opacity', 0)
      .attr(valueAxis, d => this[valueAxis](Math[choice](0, d[this.valueAccessor])))
      .attr(valueDimension, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .attr(ordinalAxis, d => this[ordinalAxis + '1'](d[this.ordinalAccessor]))
      .attr(ordinalDimension, this[ordinalAxis + '1'].bandwidth());

    if (!this.defaults) {
      this.enter
        .classed('entering', true)
        .attr(ordinalAxis, (d, i, n) => {
          const p = select(n[i].parentNode);
          const groupEntering = p.classed('entering');
          let xStart = groupEntering
            ? this[ordinalAxis + '0'](p.datum().key)
            : this[ordinalAxis + '1'](d[this.ordinalAccessor]);
          const xCenter = groupEntering
            ? this[ordinalAxis + '0'].bandwidth() / 2
            : this[ordinalAxis + '1'].bandwidth() / 2;
          const xPercent = (xStart + xCenter) / (this.innerPaddedWidth / 2);
          xStart = groupEntering ? 0 : xStart;
          const shift = xStart + xCenter * xPercent;
          return shift;
        })
        .attr(ordinalDimension, 0);
    }
    this.enterBarWrappers.order();
    this.enter.order();
  }

  updateGeometries() {
    this.update.interrupt();

    this.update
      .transition('opacity')
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          select(n[i]).classed('entering', false);
          return this.duration;
        }
        return 0;
      })
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
      );
  }

  exitGeometries() {
    this.exitBarWrappers.interrupt();
    this.exit.interrupt();

    const axisOfShift = this.layout === 'vertical' ? 'x' : 'y';
    const dimensionOfShift = this.layout === 'vertical' ? 'width' : 'height';
    const innerPaddedDimension = 'innerPadded' + dimensionOfShift[0].toUpperCase() + dimensionOfShift.substring(1);

    this.exit
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr(axisOfShift, (_d, i, n) => {
        const self = select(n[i]);
        let shift = +self.attr(axisOfShift) + +self.attr(dimensionOfShift) / 2;
        shift =
          +self.attr(axisOfShift) + (+self.attr(dimensionOfShift) / 2) * (shift / (this[innerPaddedDimension] / 2));
        return shift;
      })
      .attr(dimensionOfShift, 0);

    this.exitSize += this.exitBarWrappers.selectAll('.clustered-bar').size();

    this.exitBarWrappers
      .selectAll('.clustered-bar')
      .transition('exit_wrappers')
      .duration(this.duration * 0.75)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr(axisOfShift, (_, i, n) => {
        const p = n[i].parentNode;
        const xStart = p.transform.baseVal.consolidate().matrix.e;
        const xCenter = this[axisOfShift + '0'].bandwidth() / 2;
        const xPercent = (xStart + xCenter) / (this[innerPaddedDimension] / 2);
        const shift = xCenter * xPercent;
        return shift;
      })
      .attr(dimensionOfShift, 0);

    this.update
      .transition('accessibilityAfterExit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exit.remove();
        this.exitBarWrappers.remove();
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

    this.updateBarWrappers
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('transform', d =>
        this.layout === 'vertical' ? 'translate(' + this.x0(d.key) + ',0)' : 'translate(0,' + this.y0(d.key) + ')'
      )
      .call(transitionEndAll, () => {
        this.updateBarWrappers.classed('entering', false);
      });

    this.update
      .classed('geometryIsMoving', (d, i, n) => {
        const geometryIsUpdating = checkAttributeTransitions(select(n[i]), [
          {
            attr: ordinalAxis,
            numeric: true,
            newValue: this[ordinalAxis + '1'](d[this.ordinalAccessor])
          },
          {
            attr: ordinalDimension,
            numeric: true,
            newValue: this[ordinalAxis + '1'].bandwidth()
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
      .attr(
        `data-${ordinalAxis}`,
        d =>
          this.layout === 'vertical'
            ? this[ordinalAxis + '1'](d[this.ordinalAccessor]) //+ this.x0(d[this.groupAccessor])
            : this[ordinalAxis + '1'](d[this.ordinalAccessor]) //+ this.y0(d[this.groupAccessor])
      )
      .attr(
        `data-translate-x`,
        d => (this.layout === 'vertical' ? this.x0(d[this.groupAccessor]) : 0) + this.padding.left + this.margin.left
      )
      .attr(
        `data-translate-y`,
        d => (this.layout === 'vertical' ? 0 : this.y0(d[this.groupAccessor])) + this.padding.top + this.margin.top
      )
      .attr(`data-${ordinalDimension}`, this[ordinalAxis + '1'].bandwidth())
      .attr(`data-${valueAxis}`, d => this[valueAxis](Math[choice](0, d[this.valueAccessor])))
      .attr(`data-${valueDimension}`, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .transition('update')
      .duration((_, i, n) => {
        return select(n[i]).classed('entering') ? this.duration / 2 : this.duration;
      })
      .delay((_, i, n) => {
        return select(n[i]).classed('entering') ? this.duration / 2 : 0;
      })
      .ease(easeCircleIn)
      .attr(valueAxis, d => this[valueAxis](Math[choice](0, d[this.valueAccessor])))
      .attr(valueDimension, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      )
      .attr(ordinalAxis, d => this[ordinalAxis + '1'](d[this.ordinalAccessor]))
      .attr(ordinalDimension, this[ordinalAxis + '1'].bandwidth())
      .call(transitionEndAll, () => {
        this.update.classed('geometryIsMoving', false);

        this.updateInteractionState();
        this.checkLabelColorAgainstBackground();
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
        // now we can emit the event that transitions are complete
        this.transitionEndEvent.emit({ chartID: this.chartID });
      });
  }

  updateInteractionState() {
    removeHoverStrokes(this.svg.node());
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.update.interrupt('opacity');

    // we use this.update and this.updateLabels from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    // first we address interaction state on marks/bars
    this.update
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
      )
      .attr('fill', (d, i) => {
        const clicked =
          this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
        const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
        const baseColor = this.colorArr[i];
        return clicked && this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : clicked
          ? baseColor
          : hovered && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : baseColor;
      })
      .attr('filter', (d, i, n) => {
        if (!this.accessibility.hideStrokes && !select(n[i]).classed('geometryIsMoving')) {
          const clicked =
            this.clickHighlight &&
            this.clickHighlight.length > 0 &&
            checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
          const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
          const baseColor = this.preparedColors[i];
          const state = clicked ? 'click' : hovered && !select(n[i]).classed('geometryIsMoving') ? 'hover' : 'rest';
          const color =
            clicked && this.clickStyle.color
              ? visaColors[this.clickStyle.color] || this.clickStyle.color
              : clicked
              ? baseColor
              : hovered && this.hoverStyle.color
              ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
              : baseColor;
          if (state === 'hover') {
            drawHoverStrokes({
              inputElement: n[i],
              id: this.chartID,
              key: d[this.ordinalAccessor] + d[this.groupAccessor],
              strokeWidth: this.hoverStyle.strokeWidth,
              fill: color
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
      groupAccessor: this.ordinalAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.hoverStyle,
      clickStyle: this.clickStyle,
      hoverOpacity: this.hoverOpacity
    });

    // and lastly we have to check for labels, especially when auto placement is in place
    this.updateLabels.interrupt('opacity');
    const addCollisionClass = this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly;
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    this.processLabelOpacity(this.updateLabels, addCollisionClass);

    // if we have collision on, we need to update the bitmap on interaction
    if (addCollisionClass) {
      const labelsAdded = this.updateLabels.filter((_, i, n) => select(n[i]).classed('collision-added'));
      const labelsRemoved = this.updateLabels
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
    this.processLabelOpacity(this.updateLabels);
  }

  processLabelOpacity(selection, addCollisionClass?) {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const fullBandwidth = this[ordinalAxis + '0'].bandwidth() / this.nest[0].values.length;

    selection.attr('opacity', (d, i, n) => {
      const prevOpacity = +select(n[i]).attr('opacity');
      const styleVisibility = select(n[i]).style('visibility');
      const dimensions = {};
      dimensions[ordinalDimension] =
        this.dataLabel.placement === 'left' || this.dataLabel.placement === 'bottom'
          ? this[ordinalAxis + '1'].bandwidth()
          : fullBandwidth;
      if (this.dataLabel.placement === 'left' || this.dataLabel.placement === 'bottom') {
        dimensions[valueDimension] = Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        );
      }
      const hasRoom =
        this.dataLabel.placement === 'auto' ||
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
    this.updateLabels.attr('fill', (d, i, n) => {
      return this.textTreatmentHandler(d, i, n);
    });
  }

  setRoundedCorners() {
    this.update
      .transition('corners')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('rx', this.roundedCorner)
      .attr('ry', this.roundedCorner);
  }

  textTreatmentHandler = (d, i, n) => {
    const me = select(n[i]);
    const bgColor =
      this.clickHighlight &&
      this.clickHighlight.length > 0 &&
      checkClicked(d, this.clickHighlight, this.innerInteractionKeys) &&
      this.clickStyle.color
        ? visaColors[this.clickStyle.color] || this.clickStyle.color
        : this.hoverHighlight &&
          checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
          this.hoverStyle.color
        ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
        : this.preparedColors[i];

    const autoPlacementBackgroundColor =
      this.dataLabel.placement === 'auto' // can ignore this for collisionHideOnly
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
      autoPlacementBackgroundColor || this.dataLabel.placement === 'bottom' || this.dataLabel.placement === 'left'
        ? autoTextColor(bgColor)
        : visaColors.dark_text;
    me.attr(
      'filter',
      !me.classed('textIsMoving')
        ? createTextStrokeFilter({
            root: this.svg.node(),
            id: this.chartID,
            color:
              autoPlacementBackgroundColor ||
              this.dataLabel.placement === 'bottom' ||
              this.dataLabel.placement === 'left'
                ? bgColor
                : '#ffffff'
          })
        : null
    );
    return color;
  };

  setSelectedClass() {
    this.update.classed('highlight', (d, i, n) => {
      let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
      selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
      const selectable = this.accessibility.elementsAreInterface;
      setElementInteractionAccessState(n[i], selected, selectable);
      return selected;
    });
  }

  updateCursor() {
    this.update.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updateLabels.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  enterDataLabels() {
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.enterLabelWrappers
      .attr('class', 'clustered-bar-label-wrapper')
      .classed('entering', true)
      .attr('transform', d =>
        this.layout === 'vertical' ? 'translate(' + this.x0(d.key) + ',0)' : 'translate(0,' + this.y0(d.key) + ')'
      );

    this.enterLabels
      .attr('class', 'clustered-bar-dataLabel')
      .classed('entering', true)
      .classed('clustered-bar-dataLabel-horizontal', false)
      .classed('clustered-bar-dataLabel-vertical', false)
      .classed('clustered-bar-dataLabel-' + this.layout, true)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('opacity', d =>
        checkInteraction(
          d,
          opacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : Number.EPSILON
      )
      .attr('fill', this.textTreatmentHandler)
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.enterLabels.attr(ordinalAxis, (d, i, n) => {
      const zeroScale = ordinalAxis + '0';
      const oneScale = ordinalAxis + '1';
      const breadth = ordinalAxis === 'x' ? 'innerPaddedWidth' : 'innerPaddedHeight';
      const p = select(n[i].parentNode);
      const groupEntering = p.classed('entering');
      let xStart = groupEntering ? this[zeroScale](p.datum().key) : this[oneScale](d[this.ordinalAccessor]);
      const xCenter = groupEntering ? this[zeroScale].bandwidth() / 2 : this[oneScale].bandwidth() / 2;
      const xPercent = (xStart + xCenter) / (this[breadth] / 2);
      xStart = groupEntering ? 0 : xStart;
      const shift = xStart + xCenter * xPercent;
      return shift;
    });
  }

  updateDataLabels() {
    this.updateLabels.interrupt();
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.updateLabels
      .transition('opacity')
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          // select(n[i]).classed('entering', false);
          return this.duration / 4;
        }
        return 0;
      })
      .delay((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          // select(n[i]).classed('entering', false);
          return (this.duration / 4) * 3;
        }
        return 0;
      })
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(
          d,
          opacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1
      )
      .call(transitionEndAll, () => {
        this.updateLabels.classed('entering', false);
        // this.checkLabelColorAgainstBackground();
      });
  }

  exitDataLabels() {
    this.exitLabelWrappers
      .selectAll('text')
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 3)
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitLabelWrappers.remove();
      });

    this.exitLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 3)
      .attr('opacity', 0)
      .remove();
  }

  setLabelContent() {
    this.updateLabels.text(d => formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format));
  }

  setLabelPosition() {
    // position the label wrappers with/without transition
    this.updateLabelWrappers
      .classed('clustered-bar-dataLabel-horizontal', false)
      .classed('clustered-bar-dataLabel-vertical', false)
      .classed('clustered-bar-dataLabel-' + this.layout, true);

    const changeLabelWrappers = prepareRenderChange({
      selection: this.updateLabelWrappers,
      duration: this.duration,
      namespace: 'position-label-wrappers',
      easing: easeCircleIn
    });

    changeLabelWrappers
      .attr('transform', d =>
        this.layout === 'vertical' ? 'translate(' + this.x0(d.key) + ',0)' : 'translate(0,' + this.y0(d.key) + ')'
      )
      .call(transitionEndAll, () => {
        this.updateLabelWrappers.classed('entering', false);
      });

    // we have to run this filter as there are times when enter/update will one another's nodes in them.
    const enteringOnly = this.enterLabels.filter((_, i, n) => {
      return select(n[i]).classed('entering');
    });
    const updatingOnly = this.updateLabels.filter((_, i, n) => {
      return !select(n[i]).classed('entering');
    });

    // if we have enter and update we need to process them separately
    // enter with no transition, update with transition
    // the transition is the main reason we need to do this.
    if (enteringOnly.size() > 0) {
      this.processLabelPosition(enteringOnly, false, true, false);
      this.processLabelPosition(updatingOnly, true, false, true);
    } else {
      // otherwise we can just process update and do it all in one step with transition
      // doing this all at once saves processing time from calling resolveLabelCollision less
      this.processLabelPosition(updatingOnly, true, true, false);
    }
  }

  processLabelPosition(selection, runTransition?, redrawBitmap?, suppressMarkDraw?) {
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const choice = this.layout === 'vertical' ? 'max' : 'min';
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;
    let textHeight = 15; // default label is usually 15
    const collisionSettings = {
      vertical: {
        top: {
          validPositions: ['top', 'bottom'],
          offsets: [4, 1]
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
          offsets: [1, 20]
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

    // prep the data- attributes for label collision algorithm
    // only needs to be run if we are running collision though
    selection
      .style('visibility', (_, i, n) =>
        this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly
          ? select(n[i]).style('visibility')
          : null
      )
      .attr(`data-${ordinalAxis}`, (d, i, n) => {
        if (i === 0) {
          // we just need to check this on one element
          const textElement = n[i];
          const style = getComputedStyle(textElement);
          const fontSize = parseFloat(style.fontSize);
          textHeight = Math.max(fontSize - 1, 1); // clone.getBBox().height;
        }

        return this[ordinalAxis + '1'](d[this.ordinalAccessor]);
      })
      .attr(
        `data-translate-x`,
        d => (this.layout === 'vertical' ? this.x0(d[this.groupAccessor]) : 0) + this.padding.left + this.margin.left
      )
      .attr(
        `data-translate-y`,
        d => (this.layout === 'vertical' ? 0 : this.y0(d[this.groupAccessor])) + this.padding.top + this.margin.top
      )
      .attr(`data-${ordinalDimension}`, this[ordinalAxis + '1'].bandwidth())
      .attr(`data-${valueAxis}`, d => this[valueAxis](Math[choice](0, d[this.valueAccessor])))
      .attr(`data-${valueDimension}`, d =>
        Math.abs(
          this.layout === 'vertical'
            ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
            : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
        )
      );

    // we use prepareRenderChange to use or not use .transition()
    // immediate - label enter and interaction effects
    // transition - update effects (e.g., data change)
    const changeLabels = prepareRenderChange({
      selection: selection,
      duration: !runTransition ? 0 : this.duration,
      namespace: 'position-labels',
      easing: easeCircleIn
    });

    this.bitmaps = placeDataLabels({
      root: changeLabels,
      xScale: this.layout === 'vertical' ? this.x1 : this.x,
      yScale: this.layout === 'vertical' ? this.y : this.y1,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.dataLabel.placement,
      layout: this.layout,
      chartType: 'bar',
      avoidCollision: {
        runOccupancyBitmap: this.dataLabel.visible && this.dataLabel.placement === 'auto',
        bitmaps: !redrawBitmap ? this.bitmaps : undefined,
        labelSelection: changeLabels,
        avoidMarks: [this.update],
        validPositions: hideOnly ? ['middle'] : collisionSettings[this.layout][boundsScope].validPositions,
        offsets: hideOnly ? [1] : collisionSettings[this.layout][boundsScope].offsets,
        accessors: [this.groupAccessor, this.ordinalAccessor, 'key'], // key is created for lines by nesting done in line,
        size: [roundTo(this.width, 0), roundTo(this.height, 0)], // for some reason the bitmap needs width instead of inner padded width here
        boundsScope: hideOnly ? undefined : boundsScope,
        hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly,
        suppressMarkDraw: suppressMarkDraw
      }
    });
  }

  drawReferenceLines() {
    setReferenceLine({
      groupName: 'cluster',
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

  prepareLegendData() {
    this.legendData = this.nest[0].values;
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
      labelKey: this.ordinalAccessor,
      label: this.legend.labels,
      hide: !this.legend.visible,
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.ordinalAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.hoverStyle,
      clickStyle: this.clickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

  bindLegendInteractivity() {
    select(this.clusteredBarChartEl)
      .selectAll('.legend')
      .style('cursor', this.legend.interactive && !this.suppressEvents ? this.cursor : '')
      .on('click', this.legend.interactive && !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        this.legend.interactive && !this.suppressEvents
          ? (d, i, n) => {
              this.hoverEvent.emit({ data: d, target: n[i] });
            }
          : null
      )
      .on('mouseout', this.legend.interactive && !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  setLegendCursor() {
    select(this.clusteredBarChartEl)
      .selectAll('.legend')
      .style('cursor', this.legend.interactive && !this.suppressEvents ? this.cursor : null);
  }

  bindInteractivity() {
    this.update
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updateLabels
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.layout !== 'horizontal' ? this.x0 : this.x,
      xAccessor: this.layout !== 'horizontal' ? this.groupAccessor : this.valueAccessor,
      yScale: this.layout !== 'horizontal' ? this.y : this.y0,
      yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.groupAccessor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      margin: this.margin,
      bitmaps: this.bitmaps
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.getLanguageString(), this.clusteredBarChartEl, this.annotations, this.referenceLines);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      language: this.getLanguageString(),
      rootEle: this.clusteredBarChartEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'clustered-bar-chart',
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
      chartTag: 'clustered-bar-chart',
      language: this.getLanguageString(),
      node: this.svg.node(),
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'bar',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'clustered-bar-chart'),
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      groupName: 'cluster',
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
      // groupKeys: [],
      // nested: '',
      // recursive: true
    });
  }

  setGeometryAccessibilityAttributes() {
    this.update.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    const keys = scopeDataKeys(this, chartAccessors, 'clustered-bar-chart');
    this.update.each((_d, i, n) => {
      setElementFocusHandler({
        chartTag: 'clustered-bar-chart',
        language: this.getLanguageString(),
        node: n[i],
        geomType: 'bar',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        dataKeyNames: this.dataKeyNames,
        groupName: 'cluster',
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

  setGroupAccessibilityID() {
    this.updateBarWrappers.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.getLanguageString(), this.clusteredBarChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.clusteredBarChartEl,
      parentGNode: this.barG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'clustered-bar-chart',
      geomType: 'bar',
      groupName: 'cluster'
      // recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.getLanguageString(), this.clusteredBarChartEl, this.accessibility.structureNotes);
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

  onHoverHandler(d, n) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverEvent.emit({ data: d, target: n });
    if (this.showTooltip && d[this.ordinalAccessor]) {
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
      dataKeyNames: this.dataKeyNames,
      layout: this.layout,
      ordinalAccessor: this.groupAccessor, // on purpose - to match tooltip util format
      groupAccessor: this.ordinalAccessor, // on purpose - to match tooltip util format
      valueAccessor: this.valueAccessor,
      chartType: 'clustered'
    });
  }

  render() {
    this.drawStartEvent.emit({ chartID: this.chartID });
    // hardcoded theme to light until we add this functionality
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
        this.shouldUpdateXGrid = true;
      } else if (this.layout === 'vertical') {
        this.shouldUpdateYAxis = true;
        this.shouldUpdateYGrid = true;
      }
      this.shouldCheckValueAxis = false;
    }
    if (this.shouldCheckLabelAxis) {
      if (this.layout === 'vertical') {
        this.shouldUpdateXAxis = true;
        this.shouldUpdateXGrid = true;
        this.shouldSetXAxisAccessibility = true;
      } else if (this.layout === 'horizontal') {
        this.shouldUpdateYAxis = true;
        this.shouldUpdateYGrid = true;
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
    if (this.shouldSetDimensions) {
      this.setDimensions();
      this.shouldSetDimensions = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldValidateInteractionKeys) {
      this.validateInteractionKeys();
      this.shouldValidateInteractionKeys = false;
    }
    if (this.shouldValidateDataLabelAccessor) {
      this.validateDataLabelAccessor();
      this.shouldValidateDataLabelAccessor = false;
    }
    if (this.shouldValidateAxes) {
      this.validateAxes();
      this.shouldValidateAxes = false;
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
          <this.topLevel class="clustered-bar-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions clustered-bar-sub-title vcl-sub-title" />
          <div class="clustered-bar-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'bar'}
            groupName={'cluster'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
            language={this.getLanguageString()}
            chartTag={'clustered-bar-chart'}
            width={this.width - (this.margin ? this.margin.right || 0 : 0)}
            isInteractive={this.accessibility.elementsAreInterface}
            hasCousinNavigation // on bar this requires checking for groupAccessor
            disabled={
              this.suppressEvents &&
              this.accessibility.elementsAreInterface === false &&
              this.accessibility.keyboardNavConfig &&
              this.accessibility.keyboardNavConfig.disabled
            } // the chart is "simple"
          />
          <div class="visa-viz-d3-clustered-bar-container" />
          <div class="clustered-bar-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(ClusteredBarChartDefaultValues);
    let i = 0;
    // accept 0 or false as default value
    const exceptions = {
      mainTitle: {
        exception: ''
      },
      subTitle: {
        exception: ''
      },
      barIntervalRatio: {
        exception: 0
      },
      groupIntervalRatio: {
        exception: 0
      },
      showTooltip: {
        exception: false
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
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : ClusteredBarChartDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
