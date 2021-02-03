/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection';
import { scaleBand, scaleLinear, scaleTime } from 'd3-scale';
import { nest } from 'd3-collection';
import { max, min } from 'd3-array';
import { easeCircleIn } from 'd3-ease';
import 'd3-transition';
import { v4 as uuid } from 'uuid';
import Utils from '@visa/visa-charts-utils';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IAxisType,
  IReferenceStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  ILegendType
} from '@visa/charts-types';
import { StackedBarChartDefaultValues } from './stacked-bar-chart-default-values';
const {
  getBrowser,
  verifyTextHasSpace,
  checkAttributeTransitions,
  createTextStrokeFilter,
  drawHoverStrokes,
  removeHoverStrokes,
  buildStrokes,
  convertColorsToTextures,
  findTagLevel,
  initializeGeometryAccess,
  initializeDescriptionRoot,
  initializeGroupAccess,
  setGeometryAccessLabel,
  setGroupAccessLabel,
  setRootSVGAccess,
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
  formatStats,
  formatDate,
  formatDataLabel,
  getPadding,
  getColors,
  getLicenses,
  getScopedData,
  initTooltipStyle,
  overrideTitleTooltip,
  placeDataLabels,
  transitionEndAll,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps
} = Utils;
@Component({
  tag: 'stacked-bar-chart',
  styleUrl: 'stacked-bar-chart.scss'
})
export class StackedBarChart {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;
  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = StackedBarChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = StackedBarChartDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = StackedBarChartDefaultValues.height;
  @Prop({ mutable: true }) width: number = StackedBarChartDefaultValues.width;
  @Prop({ mutable: true }) layout: string = StackedBarChartDefaultValues.layout;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = StackedBarChartDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) margin: IBoxModelType = StackedBarChartDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = StackedBarChartDefaultValues.padding;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = StackedBarChartDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = StackedBarChartDefaultValues.valueAccessor;
  @Prop({ mutable: true }) groupAccessor: string = StackedBarChartDefaultValues.groupAccessor;
  @Prop({ mutable: true }) sortOrder: string = StackedBarChartDefaultValues.sortOrder;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = StackedBarChartDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = StackedBarChartDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = StackedBarChartDefaultValues.wrapLabel;
  @Prop({ mutable: true }) normalized: boolean = StackedBarChartDefaultValues.normalized;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = StackedBarChartDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = StackedBarChartDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = StackedBarChartDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = StackedBarChartDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = StackedBarChartDefaultValues.cursor;
  @Prop({ mutable: true }) roundedCorner: number = StackedBarChartDefaultValues.roundedCorner;
  @Prop({ mutable: true }) barIntervalRatio: number = StackedBarChartDefaultValues.barIntervalRatio;
  @Prop({ mutable: true }) hoverOpacity: number = StackedBarChartDefaultValues.hoverOpacity;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = StackedBarChartDefaultValues.dataLabel;
  @Prop({ mutable: true }) showTotalValue: boolean = StackedBarChartDefaultValues.showTotalValue;
  @Prop({ mutable: true }) showTooltip: boolean = StackedBarChartDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = StackedBarChartDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = StackedBarChartDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = StackedBarChartDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = StackedBarChartDefaultValues.annotations;
  @Prop({ mutable: true }) showZeroLabels: boolean = StackedBarChartDefaultValues.showZeroLabels;

  // Calculation (6/7)
  @Prop({ mutable: true }) minValueOverride: number;
  @Prop({ mutable: true }) maxValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = StackedBarChartDefaultValues.referenceLines;

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = StackedBarChartDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = StackedBarChartDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Element
  @Element()
  stackedBarChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  barG: any;
  bars: any;
  labelG: any;
  labels: any;
  totalLabels: any;
  defaults: boolean;
  current: any;
  enter: any;
  exit: any;
  update: any;
  enterBarWrappers: any;
  exitBarWrappers: any;
  updateBarWrappers: any;
  x: any;
  y: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  series: any = [];
  extent: any = [];
  datakeys: any = [];
  colorArr: any;
  preparedColors: any;
  duration: any;
  references: any;
  legendG: any;
  tooltipG: any;
  interpolating: any;
  stackOrder: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  enterLabels: any;
  exitLabels: any;
  updateLabels: any;
  enterLabelWrappers: any;
  updateLabelWrappers: any;
  exitLabelWrappers: any;
  enterTotalLabels: any;
  updateTotalLabels: any;
  exitTotalLabels: any;
  tableData: any;
  tableColumns: any;
  chartID: string;
  innerInteractionKeys: any;
  innerLabelAccessor: string;
  legendData: any;
  shouldValidateInteractionKeys: boolean = false;
  shouldValidate: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetDimensions: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldSetColors: boolean = false;
  shouldValidateAxes: boolean = false;
  shouldValidateClickHighlight: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldResetRoot: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldCheckValueAxis: boolean = false;
  shouldCheckLabelAxis: boolean = false;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldUpdateCorners: boolean = false;
  shouldUpdateLegendData: boolean = false;
  shouldValidateLabelPlacement: boolean = false;
  shouldValidateDataLabelAccessor: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldUpdateTotalLabels: boolean = false;
  shouldCheckLabelColor: boolean = false;
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
  shouldRedrawWrapper: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  shouldSetYAxisAccessibility: boolean = false;
  shouldSetXAxisAccessibility: boolean = false;
  shouldSetAnnotationAccessibility: boolean = false;
  shouldSetTextures: boolean = false;
  shouldSetStrokes: boolean = false;
  isSafari: boolean = getBrowser() === 'Safari'; // this is necessary for handling redraw when filter attributes change
  strokes: any = {};
  textStrokes: any = {};
  topLevel: string = 'h2';
  bottomLevel: string = 'p';

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldValidateClickHighlight = true;
    this.shouldSetColors = true;
    this.shouldSetTextures = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLegendData = true;
    this.shouldValidate = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateLabels = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetStrokes = true;
  }

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID;
    this.stackedBarChartEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateLegend = true;
    this.shouldSetTextures = true;
    this.shouldCheckLabelColor = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetStrokes = true;
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

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldSetDimensions = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('layout')
  layoutWatcher(_newVal, _oldVal) {
    this.interpolating = false;
    this.shouldValidateLabelPlacement = true;
    this.shouldUpdateScales = true;
    this.shouldValidateAxes = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateLegendData = true;
    this.shouldSetColors = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateLegend = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
    this.shouldCheckValueAxis = true;
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldValidateClickHighlight = true;
    this.shouldUpdateScales = true;
    this.shouldSetColors = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
    this.shouldSetGlobalSelections = true;
    this.shouldCheckValueAxis = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldValidateClickHighlight = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldCheckLabelAxis = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateReferenceLines = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
  }

  @Watch('sortOrder')
  sortWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldCheckLabelAxis = true;
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    this.shouldValidateAxes = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateXAxis = true;
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
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
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

  @Watch('normalized')
  normalizedWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldValidateClickHighlight = true;
    this.shouldUpdateScales = true;
    this.shouldSetColors = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldCheckValueAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGroupAccessibilityLabel = true;
  }

  @Watch('colorPalette')
  paletteWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextures = true;
  }

  @Watch('colors')
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
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetSelectionClass = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
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
  }

  @Watch('roundedCorner')
  cornerWatcher(_newVal, _oldVal) {
    this.shouldUpdateCorners = true;
  }

  @Watch('barIntervalRatio')
  intervalRatioWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetLabelOpacity = true;
    this.shouldCheckLabelAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldUpdateTableData = true;
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    const newAccessor = _newVal && _newVal.labelAccessor ? _newVal.labelAccessor : false;
    const oldAccessor = _oldVal && _oldVal.labelAccessor ? _oldVal.labelAccessor : false;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldSetLabelOpacity = true;
      this.shouldValidateLabelPlacement = true;
      this.shouldCheckLabelColor = true;
    }
    if (newAccessor !== oldAccessor) {
      this.shouldValidateDataLabelAccessor = true;
    }
  }

  @Watch('showTotalValue')
  showTotalValueWatcher(_newVal, _oldVal) {
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
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
      this.shouldSetStrokes = true;
      this.shouldUpdateLegend = true;
      this.shouldDrawInteractionState = true;
    }
  }

  @Watch('showZeroLabels')
  showZeroLabelsWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
  }

  @Watch('legend')
  legendWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegend = true;
    const newInteractiveVal = _newVal && _newVal.interactive;
    const oldInteractiveVal = _oldVal && _oldVal.interactive;
    if (newInteractiveVal !== oldInteractiveVal) {
      this.shouldUpdateLegendInteractivity = true;
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
    this.shouldUpdateLabels = true;
    this.shouldUpdateTotalLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldValidateClickHighlight = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldUpdateLegendInteractivity = true;
  }

  componentWillLoad() {
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = this.uniqueID || 'stacked-bar-chart-' + uuid();
      this.stackedBarChartEl.id = this.chartID;
      this.setTagLevels();
      this.prepareData();
      this.prepareLegendData();
      this.setDimensions();
      this.prepareScales();
      this.validateClickHighlight();
      this.validateInteractionKeys();
      this.validateDataLabelAccessor();
      this.validateAxes();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
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
      this.enterGeometries();
      this.updateGeometries();
      this.exitGeometries();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.enterTotalDataLabels();
      this.updateTotalDataLabels();
      this.exitTotalDataLabels();
      this.setRoundedCorners();
      this.drawGeometries();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawLegendElements();
      this.bindLegendInteractivity();
      this.validateLabelPlacement();
      this.drawDataLabels();
      this.drawTotalDataLabels();
      this.drawReferenceLines();
      this.setSelectedClass();
      this.updateInteractionState();
      this.setLabelOpacity();
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
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.barG.node());
      this.setGroupAccessibilityLabel();
      this.onChangeHandler();
      this.duration = 750;
      this.defaults = false;
      resolve('component did load');
    });
  }

  componentDidUpdate() {
    return new Promise(resolve => {
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
        this.enterTotalDataLabels();
        this.updateTotalDataLabels();
        this.exitTotalDataLabels();
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
        this.setGroupAccessibilityLabel();
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
      if (this.shouldUpdateLabels) {
        this.drawDataLabels();
        this.shouldUpdateLabels = false;
      }
      if (this.shouldUpdateTotalLabels) {
        this.drawTotalDataLabels();
        this.shouldUpdateTotalLabels = false;
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
      resolve('component did update');
    });
  }

  shouldValidateAccessibilityProps() {
    if (this.shouldValidateAccessibility && !this.accessibility.disableValidation) {
      this.shouldValidateAccessibility = false;
      validateAccessibilityProps(this.chartID, this.accessibility, {
        annotations: this.annotations,
        data: this.data,
        uniqueID: this.uniqueID,
        context: {
          mainTitle: this.mainTitle,
          onClickFunc: !this.suppressEvents ? this.clickFunc.emit : undefined,
          tooltipLabel: this.tooltipLabel,
          dataLabel: this.dataLabel,
          valueAccessor: this.valueAccessor
        },
        misc: {
          normalized: this.normalized
        }
      });
    }
  }

  validateLabelPlacement() {
    // check data label placement assignment based on layout
    if (this.layout === 'vertical') {
      if (
        !(
          this.dataLabel.placement === 'top' ||
          this.dataLabel.placement === 'middle' ||
          this.dataLabel.placement === 'bottom'
        )
      ) {
        this.dataLabel.placement = 'middle';
      }
    } else {
      if (
        !(
          this.dataLabel.placement === 'end' ||
          this.dataLabel.placement === 'middle' ||
          this.dataLabel.placement === 'base'
        )
      ) {
        this.dataLabel.placement = 'middle';
      }
    }
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length ? this.interactionKeys : [this.ordinalAccessor];
  }

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueAccessor;
  }

  validateAxes() {
    // check whether we are going to display axis and then update props
    this.innerXAxis = { ...this.xAxis, gridVisible: !(this.layout === 'vertical') && this.xAxis.gridVisible };
    this.innerYAxis = { ...this.yAxis, gridVisible: this.layout === 'vertical' && this.yAxis.gridVisible };
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
    this.extent = [0, 0];
    const dataCopy = [];

    this.data.forEach(d => {
      const keys = Object.keys(d);
      const item = {};
      keys.forEach(key => {
        item[key] = !(d[key] instanceof Date) ? d[key] : new Date(d[key].getTime());
      });
      dataCopy.push(item);
    });

    // prepare flat data for stacked layout
    const nestData = nest()
      .key(d => {
        d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);
        d[this.groupAccessor] =
          d[this.groupAccessor] instanceof Date
            ? formatDate({
                date: d[this.groupAccessor],
                format: this.layout === 'vertical' ? this.xAxis.format : this.yAxis.format,
                offsetTimezone: true
              })
            : d[this.groupAccessor];
        return d[this.groupAccessor];
      })
      .entries(dataCopy);

    this.interpolating = this.series.length ? this.series : '';
    if (this.interpolating) {
      this.interpolating.stackOrder = this.stackOrder;
    }
    const ordinalValues = {};
    const stackDiverging = nestedArray => {
      let i = 0;
      const j = nestedArray.length;
      const output = [];
      this.stackOrder = {};
      for (i = 0; i < j; i++) {
        const row = { ...nestedArray[i] };
        let k = 0;
        let sum = 0;
        let sumAboveZero = 0;
        const base = {
          positive: 0,
          negative: 0
        };
        const v = nestedArray[i].values;
        const l = v.length;
        row.values = [];
        let previous = 0;
        for (k = 0; k < l; k++) {
          const item = { ...v[k] };
          const value = item[this.valueAccessor];
          if (value >= 0) {
            item.stackEnd = base.positive;
            base.positive += value;
            item.stackStart = base.positive;
          } else {
            item.stackStart = base.negative;
            base.negative += value;
            item.stackEnd = base.negative;
          }
          let group = this.stackOrder[item[this.groupAccessor]];
          if (!group) {
            this.stackOrder[item[this.groupAccessor]] = {};
            group = this.stackOrder[item[this.groupAccessor]];
          }
          if (!group[item[this.ordinalAccessor]]) {
            group[item[this.ordinalAccessor]] = {
              previous,
              value,
              stackStart: item.stackStart,
              stackEnd: item.stackEnd
            };
          }
          item.enteringStackStart = false;
          if (this.interpolating && this.interpolating.stackOrder[item[this.groupAccessor]]) {
            const interpolateGroup = this.interpolating.stackOrder[item[this.groupAccessor]];
            const findInterpolation = preceedingElement => {
              if (preceedingElement === 0) {
                return 0;
              } else if (interpolateGroup[preceedingElement]) {
                if (value >= 0 && interpolateGroup[preceedingElement].value >= 0) {
                  return interpolateGroup[preceedingElement].stackStart;
                } else if (value < 0 && interpolateGroup[preceedingElement].value < 0) {
                  return interpolateGroup[preceedingElement].stackEnd;
                }
              }
              const nextPrevious = group[preceedingElement].previous;
              return findInterpolation(nextPrevious);
            };
            if (!interpolateGroup[item[this.ordinalAccessor]]) {
              item.enteringStackStart = findInterpolation(previous);
            }
          }
          previous = item[this.ordinalAccessor];
          item.getSum = () => row.sum;
          sum += value;
          if (value > 0) {
            sumAboveZero += value;
          }
          if (!ordinalValues[item[this.ordinalAccessor]]) {
            ordinalValues[item[this.ordinalAccessor]] = 1;
          }
          row.values.push(item);
        }
        if (base.positive > this.extent[1]) {
          this.extent[1] = base.positive;
        }
        if (base.negative < this.extent[0]) {
          this.extent[0] = base.negative;
        }
        row.sum = sum;
        row.sumMessage = 'Sum ' + sum;
        row.sumAboveZero = sumAboveZero;
        output.push(row);
      }
      return output;
    };
    stackDiverging(nestData);

    // Get all item categories (ordinal accessor)
    this.datakeys = Object.keys(ordinalValues);
    this.series = stackDiverging(nestData);
    if (this.sortOrder === 'asc') {
      this.series = [...this.series].sort((a, b) => a.sum - b.sum);
    } else if (this.sortOrder === 'desc') {
      this.series = [...this.series].sort((a, b) => b.sum - a.sum);
    }
  }

  prepareLegendData() {
    this.legendData = this.series[0].values;
  }

  validateClickHighlight() {
    // format clickHighlight data row if there is date
    this.clickHighlight.map(d => {
      d[this.groupAccessor] =
        d[this.groupAccessor] instanceof Date
          ? formatDate({
              date: d[this.groupAccessor],
              format: this.layout === 'vertical' ? this.xAxis.format : this.yAxis.format,
              offsetTimezone: true
            })
          : d[this.groupAccessor];
    });
  }

  setTableData() {
    const flattenedNest = [];
    this.series.forEach(s => {
      s.values.forEach(val => {
        // val['rowSum'] = val.getSum();
        flattenedNest.push(val);
      });
    });
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'stacked-bar-chart');
    this.tableData = getScopedData(flattenedNest, keys);
    this.tableColumns = Object.keys(keys);
  }

  setColors() {
    this.preparedColors = this.colors
      ? convertVisaColor(this.colors)
      : getColors(this.colorPalette, this.datakeys.length);
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
        scheme: 'categorical'
      });
      this.colorArr = this.preparedColors.range ? this.preparedColors.copy().range(textures) : textures;
    }
  }

  setStrokes() {
    const colors = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    this.strokes = buildStrokes({
      root: this.svg.node(),
      id: this.chartID,
      colors,
      clickStyle: this.clickStyle,
      hoverStyle: this.hoverStyle,
      stacked: true
    });
    this.textStrokes = {};
    colors.forEach(color => {
      this.textStrokes[color] = createTextStrokeFilter({
        root: this.svg.node(),
        id: this.chartID,
        color
      });
    });
    if (this.clickStyle && this.clickStyle.color) {
      this.textStrokes[this.clickStyle.color] = createTextStrokeFilter({
        root: this.svg.node(),
        id: this.chartID,
        color: this.clickStyle.color
      });
    }
    if (this.hoverStyle && this.hoverStyle.color) {
      this.textStrokes[this.hoverStyle.color] = createTextStrokeFilter({
        root: this.svg.node(),
        id: this.chartID,
        color: this.hoverStyle.color
      });
    }
  }

  prepareScales() {
    const minBarValue =
      this.minValueOverride && this.minValueOverride < this.extent[0] ? this.minValueOverride : this.extent[0];
    const maxBarValue = this.maxValueOverride || this.extent[1];
    const domain = this.normalized ? [0, 1] : [minBarValue, maxBarValue];

    if (this.interpolating) {
      this.interpolating.oldXDomain = this.x.domain();
      this.interpolating.oldXRange = this.x.range();
      this.interpolating.oldYDomain = this.y.domain();
      this.interpolating.oldYRange = this.y.range();
    }
    // scale band based on layout of chart
    if (this.layout === 'vertical') {
      if (this.interpolating) {
        this.interpolating.padding = this.x.padding();
        this.interpolating.x = scaleBand()
          .domain(this.interpolating.oldXDomain)
          .range(this.interpolating.oldXRange)
          .padding(this.interpolating.padding);
        this.interpolating.y = scaleLinear()
          .domain(this.interpolating.oldYDomain)
          .range(this.interpolating.oldYRange);
      }
      this.y = scaleLinear()
        .domain(domain)
        .range([this.innerPaddedHeight, 0]);

      this.x = scaleBand()
        .domain(this.series.map(d => d.key))
        .range([0, this.innerPaddedWidth])
        .padding(this.barIntervalRatio);
    } else if (this.layout === 'horizontal') {
      if (this.interpolating) {
        this.interpolating.padding = this.y.padding();
        this.interpolating.x = scaleLinear()
          .domain(this.interpolating.oldXDomain)
          .range(this.interpolating.oldXRange);
        this.interpolating.y = scaleBand()
          .domain(this.interpolating.oldYDomain)
          .range(this.interpolating.oldYRange)
          .padding(this.interpolating.padding);
      }
      this.x = scaleLinear()
        .domain(domain)
        .range([0, this.innerPaddedWidth]);

      this.y = scaleBand()
        .domain(this.series.map(d => d.key))
        .range([0, this.innerPaddedHeight])
        .padding(this.barIntervalRatio);
    }
  }

  renderRootElements() {
    this.svg = select(this.stackedBarChartEl)
      .select('.visa-viz-d3-stacked-bar-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.gridG = this.rootG.append('g').attr('class', 'grid-group');
    this.barG = this.rootG.append('g').attr('class', 'stacked-bar-group');

    this.labelG = this.rootG.append('g').attr('class', 'stacked-bar-dataLabel-group');
    this.totalLabels = this.rootG.append('g').attr('class', 'bar-dataLabel-group');
    this.legendG = select(this.stackedBarChartEl)
      .select('.stacked-bar-legend')
      .append('svg');

    this.tooltipG = select(this.stackedBarChartEl).select('.stacked-bar-tooltip');
  }

  // reset graph size based on window size
  reSetRoot() {
    this.svg
      .transition('root_reset')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root
      .transition('root_reset')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.rootG
      .transition('root_reset')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);

    setAccessibilityDescriptionWidth(this.chartID, this.width);
  }

  drawXAxis() {
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      wrapLabel: this.wrapLabel && this.layout === 'vertical' ? this.x.bandwidth() : '',
      format: this.xAxis.format,
      dateFormat: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: this.xAxis.label,
      padding: this.padding,
      hide: !this.innerXAxis.visible
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
      hide: !this.innerYAxis.visible
    });
  }

  setXAxisAccessibility() {
    setAccessXAxis({
      rootEle: this.stackedBarChartEl,
      hasXAxis: this.innerXAxis ? this.innerXAxis.visible : false,
      xAxis: this.layout === 'vertical' ? this.x || false : this.y || false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    setAccessYAxis({
      rootEle: this.stackedBarChartEl,
      hasYAxis: this.innerYAxis ? this.innerYAxis.visible : false,
      yAxis: this.layout === 'vertical' ? this.y || false : this.x || false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: this.yAxis.label ? this.yAxis.label : '' // this is optional for some charts, if hasXAxis is always false
      // secondaryYAxis?: any, // pareto uses this
      // secondaryYAxisLabel?: string, // pareto uses this
      // xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // parallel uses this to label all the y axes
    });
  }

  drawBaseline() {
    if (this.layout === 'vertical') {
      drawAxis({
        root: this.rootG,
        height: this.innerPaddedHeight,
        width: this.innerPaddedWidth,
        axisScale: this.x,
        left: false,
        padding: this.padding,
        markOffset: this.y(0) || -1
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
        markOffset: this.x(0) || -1
      });
    }
  }

  // dashed line grid for chart
  drawXGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.x,
      false,
      !this.innerXAxis.gridVisible,
      this.xAxis.tickInterval
    );
  }

  drawYGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.y,
      true,
      !this.innerYAxis.gridVisible,
      this.yAxis.tickInterval
    );
  }

  setGlobalSelections() {
    const dataBoundToBarGroups = this.barG.selectAll('.stacked-bar-series').data(this.series, d => d.key);

    this.enterBarWrappers = dataBoundToBarGroups.enter().append('g');
    this.exitBarWrappers = dataBoundToBarGroups.exit();
    this.updateBarWrappers = dataBoundToBarGroups.merge(this.enterBarWrappers);

    const dataBoundToGeometries = this.updateBarWrappers
      .selectAll('.stacked-bar')
      .data(d => d.values, d => d[this.ordinalAccessor]);

    this.enter = dataBoundToGeometries.enter().append('rect');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    const dataBoundToLabelWrappers = this.labelG
      .selectAll('.stacked-bar-dataLabel-series')
      .data(this.series, d => d.key);
    this.enterLabelWrappers = dataBoundToLabelWrappers.enter().append('g');
    this.exitLabelWrappers = dataBoundToLabelWrappers.exit();
    this.updateLabelWrappers = dataBoundToLabelWrappers.merge(this.enterLabelWrappers);

    const dataBoundToLabels = this.updateLabelWrappers
      .selectAll('.stacked-bar-dataLabel')
      .data(d => d.values, d => d[this.ordinalAccessor]);
    this.enterLabels = dataBoundToLabels.enter().append('text');
    this.exitLabels = dataBoundToLabels.exit();
    this.updateLabels = dataBoundToLabels.merge(this.enterLabels);

    const dataBoundToTotalLabels = this.totalLabels
      .selectAll('.bar-dataLabel-group text')
      .data(this.series, d => d.key);
    this.enterTotalLabels = dataBoundToTotalLabels.enter().append('text');
    this.exitTotalLabels = dataBoundToTotalLabels.exit();
    this.updateTotalLabels = dataBoundToTotalLabels.merge(this.enterTotalLabels);
  }

  enterGeometries() {
    this.enter.interrupt();
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const padding = this.layout === 'vertical' ? 'innerPaddedWidth' : 'innerPaddedHeight';

    this.enter
      .attr('class', 'stacked-bar')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .each((_d, i, n) => {
        initializeGeometryAccess({
          node: n[i]
        });
      })
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr(valueAxis, d => {
        let scale = this[valueAxis];
        if (this.interpolating) {
          scale = this.interpolating[valueAxis];
        }
        let direction = d.stackEnd;
        if (d.stackEnd < 0) {
          direction = d.stackStart;
        }
        if (typeof d.enteringStackStart === 'number') {
          direction = d.enteringStackStart;
        }
        const modifier = !this.normalized ? 1 : d.getSum();
        return scale(direction / modifier);
      })
      .attr(valueDimension, 0)
      .attr(ordinalAxis, d => {
        let scale = this[ordinalAxis];
        if (this.interpolating) {
          scale = this.interpolating[ordinalAxis];
        }
        return scale(d[this.groupAccessor]);
      })
      .attr(ordinalDimension, () => {
        let scale = this[ordinalAxis];
        if (this.interpolating) {
          scale = this.interpolating[ordinalAxis];
        }
        return scale.bandwidth();
      });

    this.enterBarWrappers
      .attr('class', 'stacked-bar-series entering')
      .each((_, i, n) => {
        // we bind accessible interactivity and semantics here (role, tabindex, etc)
        initializeGroupAccess(n[i]);
      })
      .selectAll('.stacked-bar')
      .attr(valueDimension, d => {
        const modifier = !this.normalized ? 1 : d.getSum();
        return this.layout === 'vertical'
          ? this.y(d.stackEnd / modifier) - this.y(d.stackStart / modifier)
          : this.x(d.stackStart / modifier) - this.x(d.stackEnd / modifier);
      });

    if (this.defaults) {
      this.enter.attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys)
      );
    } else {
      this.enter.attr('opacity', 0);

      this.enterBarWrappers
        .selectAll('.stacked-bar')
        .attr(valueAxis, d => {
          const modifier = !this.normalized ? 1 : d.getSum();
          return this.layout === 'vertical' ? this.y(d.stackStart / modifier) : this.x(d.stackEnd / modifier);
        })
        .attr(ordinalAxis, d => {
          let shift = this[ordinalAxis](d[this.groupAccessor]) + this[ordinalAxis].bandwidth() / 2;
          shift =
            this[ordinalAxis](d[this.groupAccessor]) +
            (this[ordinalAxis].bandwidth() / 2) * (shift / (this[padding] / 2));
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
      )
      .call(transitionEndAll, () => {
        this.update.classed('entering', false);
      });
  }

  exitGeometries() {
    this.exit.interrupt();
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
    const padding = this.layout === 'vertical' ? 'innerPaddedWidth' : 'innerPaddedHeight';

    this.exit
      .attr('filter', null)
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr(valueDimension, 0)
      .attr(valueAxis, d => {
        let direction = d.stackEnd;
        if (d.stackEnd < 0) {
          direction = d.stackStart;
        }
        const modifier = !this.normalized ? 1 : d.getSum();
        return this[valueAxis](direction / modifier);
      })
      .attr(ordinalAxis, d => this[ordinalAxis](d[this.groupAccessor]));

    this.exitBarWrappers
      .selectAll('.stacked-bar')
      .attr('filter', null)
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr(valueAxis, (_, i, n) => select(n[i]).attr(valueAxis))
      .attr(ordinalAxis, (_d, i, n) => {
        const self = select(n[i]);
        let shift = +self.attr(ordinalAxis) + +self.attr(ordinalDimension) / 2;
        shift = +self.attr(ordinalAxis) + (+self.attr(ordinalDimension) / 2) * (shift / (this[padding] / 2));
        return shift;
      })
      .attr(valueDimension, (_, i, n) => select(n[i]).attr(valueDimension))
      .attr(ordinalDimension, 0);

    // this new transtition ensures that the chart counts and all labels
    // correctly reflect the newest information
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
        this.setGroupAccessibilityLabel();
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
    // const padding = this.layout === 'vertical' ? 'innerPaddedWidth' : 'innerPaddedHeight';

    this.updateBarWrappers
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        this.updateBarWrappers.classed('entering', false);
      });

    this.update
      .classed('geometryIsMoving', (d, i, n) => {
        const modifier = !this.normalized ? 1 : d.getSum();
        const geometryIsUpdating = checkAttributeTransitions(select(n[i]), [
          {
            attr: ordinalAxis,
            numeric: true,
            newValue: this[ordinalAxis](d[this.groupAccessor])
          },
          {
            attr: ordinalDimension,
            numeric: true,
            newValue: this[ordinalAxis].bandwidth()
          },
          {
            attr: valueAxis,
            numeric: true,
            newValue: this.layout === 'vertical' ? this.y(d.stackStart / modifier) : this.x(d.stackEnd / modifier)
          },
          {
            attr: valueDimension,
            numeric: true,
            newValue:
              this.layout === 'vertical'
                ? this.y(d.stackEnd / modifier) - this.y(d.stackStart / modifier)
                : this.x(d.stackStart / modifier) - this.x(d.stackEnd / modifier)
          }
        ]);
        return geometryIsUpdating;
      })
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr(valueAxis, d => {
        const modifier = !this.normalized ? 1 : d.getSum();
        return this.layout === 'vertical' ? this.y(d.stackStart / modifier) : this.x(d.stackEnd / modifier);
      })
      .attr(valueDimension, d => {
        const modifier = !this.normalized ? 1 : d.getSum();
        return this.layout === 'vertical'
          ? this.y(d.stackEnd / modifier) - this.y(d.stackStart / modifier)
          : this.x(d.stackStart / modifier) - this.x(d.stackEnd / modifier);
      })
      .attr(ordinalAxis, d => this[ordinalAxis](d[this.groupAccessor]))
      .attr(ordinalDimension, this[ordinalAxis].bandwidth())
      .call(transitionEndAll, () => {
        setTimeout(() => {
          this.update.classed('geometryIsMoving', false);
          this.updateInteractionState();

          this.updateLabels.classed('textIsMoving', false);
          this.checkLabelColorAgainstBackground();
        }, 0); // 33 is the magic number: it is approx 1 frame at 30fps, so the largest, least-noticable timeout
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
      });
  }

  updateInteractionState() {
    removeHoverStrokes(this.svg.node());
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.update.interrupt('opacity');
    this.updateLabels.interrupt('opacity');

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time

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
      .each((d, i, n) => {
        const me = select(n[i]);
        if (!this.accessibility.hideStrokes && !me.classed('geometryIsMoving')) {
          const clicked =
            this.clickHighlight &&
            this.clickHighlight.length > 0 &&
            checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
          const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
          const baseColor = this.preparedColors[i];
          const state = clicked ? 'click' : hovered ? 'hover' : 'rest';
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
          const filter = this.strokes[state + color];
          if (filter !== me.attr('filter')) {
            // this setTimeout is actually related to a browser bug in safari (it won't draw
            // updates if the filter changes from one type to another). we must remove the
            // filter and then add the right one in a different scope of execution
            if (this.isSafari) {
              me.attr('filter', null);
              setTimeout(() => {
                me.attr('filter', filter);
              }, 0);
            } else {
              me.attr('filter', filter);
            }
          }
        } else {
          me.attr('filter', null);
        }
      });
    // in case the fill/stroke contents change, we want to update our focus indicator to match
    // (the focus indicator copies the whole element being focused to place it on top)
    retainAccessFocus({
      parentGNode: this.rootG.node()
    });

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
  }

  setLabelOpacity() {
    this.processLabelOpacity(this.updateLabels);
    this.updateTotalLabels.attr('opacity', this.showTotalValue && !this.normalized ? 1 : 0);
  }

  processLabelOpacity(selection) {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
    const valueDimension = this.layout === 'vertical' ? 'height' : 'width';

    selection.attr('opacity', d => {
      const modifier = !this.normalized ? 1 : d.getSum();
      const dimensions = {};
      dimensions[ordinalDimension] = this[ordinalAxis].bandwidth();
      dimensions[valueDimension] =
        this.layout === 'vertical'
          ? this.y(d.stackEnd / modifier) - this.y(d.stackStart / modifier)
          : this.x(d.stackStart / modifier) - this.x(d.stackEnd / modifier);
      const hasRoom =
        this.accessibility.showSmallLabels ||
        verifyTextHasSpace({
          text: formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format, this.normalized),
          dimensions,
          fontSize: 14
        });
      return hasRoom
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
    });
  }

  checkLabelColorAgainstBackground() {
    this.updateLabels.attr('fill', (d, i, n) => {
      return this.textTreatmentHandler(d, i, n);
    });
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

    const color = autoTextColor(bgColor);
    if (!me.classed('textIsMoving')) {
      const filter = this.textStrokes[bgColor];
      if (filter !== me.attr('filter')) {
        if (this.isSafari) {
          me.attr('filter', null);
          setTimeout(() => {
            me.attr('filter', filter);
          }, 0);
        } else {
          me.attr('filter', filter);
        }
      }
    } else {
      me.attr('filter', null);
    }

    return color;
  };

  bindInteractivity() {
    this.update
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  setRoundedCorners() {
    this.update
      .transition('shared_update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('rx', this.roundedCorner)
      .attr('ry', this.roundedCorner);
  }

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
    select(this.stackedBarChartEl)
      .selectAll('.legend')
      .style('cursor', !this.suppressEvents && this.legend.interactive && this.legend.visible ? this.cursor : null);
  }

  enterDataLabels() {
    this.enterLabelWrappers.attr('class', 'stacked-bar-dataLabel-series entering');

    this.enterLabels
      .attr('class', 'stacked-bar-dataLabel entering')
      .style('pointer-events', 'none')
      .classed('stacked-bar-dataLabel-' + this.layout, true)
      .attr('opacity', 0)
      .attr('fill', this.textTreatmentHandler);

    placeDataLabels({
      root: this.enterLabels,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: this.groupAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.dataLabel.placement,
      layout: this.layout,
      chartType: 'stacked',
      normalized: this.normalized
    });
  }

  updateDataLabels() {
    this.updateLabels.interrupt();
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.updateLabelWrappers
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        this.updateLabelWrappers.classed('entering', false);
      });

    this.updateLabels
      .transition('opacity')
      .ease(easeCircleIn)
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          select(n[i]).classed('entering', false);
          return this.duration;
        }
        return 0;
      })
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
      });
  }

  exitDataLabels() {
    this.exitLabelWrappers
      .selectAll('text')
      .attr('filter', null)
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitLabelWrappers.remove();
      });

    this.exitLabels
      .attr('filter', null)
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .remove();
  }

  drawDataLabels() {
    this.updateLabels
      .classed('stacked-bar-dataLabel-horizontal', false)
      .classed('stacked-bar-dataLabel-vertical', false)
      .classed('stacked-bar-dataLabel-' + this.layout, true)
      .text(d => {
        if (d[this.valueAccessor] === 0 && !this.showZeroLabels) {
          return '';
        }
        return formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format, this.normalized);
      });

    this.updateLabelWrappers
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        this.updateLabelWrappers.classed('entering', false);
      });

    const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
    const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
    const stack = this.layout === 'vertical' ? 'stackStart' : 'stackEnd';

    const labelUpdate = this.updateLabels
      .classed('textIsMoving', d => {
        if (!this.interpolating) {
          return false;
        }
        const modifier = !this.normalized ? 1 : d.getSum();
        const textIsMoving =
          this.interpolating[ordinalAxis](d[this.groupAccessor]) !== this[ordinalAxis](d[this.groupAccessor]) ||
          this.interpolating[valueAxis](d[stack] / modifier) !== this[valueAxis](d[stack] / modifier);
        return textIsMoving;
      })
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration);

    placeDataLabels({
      root: labelUpdate,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: this.groupAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.dataLabel.placement,
      layout: this.layout,
      chartType: 'stacked',
      normalized: this.normalized
    });
  }
  // draw total value dataLabel

  enterTotalDataLabels() {
    const groupDimension = this.layout === 'vertical' ? 'x' : 'y';
    const sumDimension = this.layout === 'vertical' ? 'y' : 'x';

    this.enterTotalLabels
      .attr('class', 'bar-dataLabel-' + this.layout)
      .attr('opacity', 0)
      .attr('fill', visaColors.dark_text)
      .attr(groupDimension, d => {
        return this[groupDimension](d.key) + this[groupDimension].bandwidth() / 2;
      })
      .attr(sumDimension, d => {
        return this[sumDimension](d.sumAboveZero) + 4;
      });
    // .attr('text-anchor', this.layout === 'vertical' ? 'middle' : 'start');
  }

  updateTotalDataLabels() {
    const totalValueOpacity = this.showTotalValue && !this.normalized ? 1 : 0;

    this.updateTotalLabels
      .transition('total_opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', totalValueOpacity);
  }

  exitTotalDataLabels() {
    this.exitTotalLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .remove();
  }

  drawTotalDataLabels() {
    const groupDimension = this.layout === 'vertical' ? 'x' : 'y';
    const sumDimension = this.layout === 'vertical' ? 'y' : 'x';
    const totalValueOpacity = this.showTotalValue && !this.normalized ? 1 : 0;

    this.updateTotalLabels
      .text(d => formatStats(d.sum, this.dataLabel.format))
      .attr('text-anchor', this.layout === 'vertical' ? 'middle' : 'start');

    this.updateTotalLabels
      .classed('bar-dataLabel-horizontal', false)
      .classed('bar-dataLabel-vertical', false)
      .classed('bar-dataLabel-' + this.layout, true)
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', totalValueOpacity)
      .attr(groupDimension, d => {
        return this[groupDimension](d.key) + this[groupDimension].bandwidth() / 2;
      })
      .attr(sumDimension, d => {
        return this[sumDimension](d.sumAboveZero);
      })
      .attr('dx', this.layout === 'vertical' ? '0' : '0.3em')
      .attr('dy', this.layout === 'vertical' ? '-0.3em' : '.3em');
  }

  drawReferenceLines() {
    if (!this.references) {
      this.references = this.rootG.append('g').attr('class', 'stacked-bar-reference-line-group');
    }

    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', '.stacked-bar-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines
      // .attr('id', (_, i) => 'reference-line-' + i)
      .attr('class', 'stacked-bar-reference-line')
      .attr('opacity', 0);

    const enterLabels = enterReferences.append('text');

    enterLabels
      // .attr('id', (_, i) => 'reference-line-' + i + '-label')
      .attr('class', 'stacked-bar-reference-line-label')
      .attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.stacked-bar-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeLabels = mergeReferences
      .selectAll('.stacked-bar-reference-line-label')
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

  drawAnnotations() {
    let ordinalScale = this.layout !== 'horizontal' ? this.x : this.y;
    const valueScale = this.layout !== 'horizontal' ? this.y : this.x;
    if (this.data[0][this.groupAccessor] instanceof Date) {
      const maxDate = max(this.data, d => d[this.groupAccessor]);
      const minDate = min(this.data, d => d[this.groupAccessor]);
      const range = this.layout !== 'horizontal' ? [0, this.innerPaddedWidth] : [this.innerPaddedHeight, 0];

      ordinalScale = scaleTime()
        .domain([minDate, maxDate])
        .range(range);
    }
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.layout !== 'horizontal' ? ordinalScale : valueScale,
      xAccessor: this.layout !== 'horizontal' ? this.groupAccessor : this.valueAccessor,
      yScale: this.layout !== 'horizontal' ? valueScale : ordinalScale,
      yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.groupAccessor
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.stackedBarChartEl, this.annotations);
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
    select(this.stackedBarChartEl)
      .selectAll('.legend')
      .style('cursor', !this.suppressEvents && this.legend.interactive && this.legend.visible ? this.cursor : null)
      .on(
        'click',
        !this.suppressEvents && this.legend.interactive && this.legend.visible ? d => this.onClickHandler(d) : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.legend.interactive && this.legend.visible ? d => this.hoverFunc.emit(d) : null
      )
      .on(
        'mouseout',
        !this.suppressEvents && this.legend.interactive && this.legend.visible ? () => this.onMouseOutHandler() : null
      );
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      rootEle: this.stackedBarChartEl,
      geomType: 'bar',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'stacked-bar-chart',
      uniqueID: this.chartID,
      groupName: 'stack',
      highestHeadingLevel: this.highestHeadingLevel,
      redraw: this.shouldRedrawWrapper
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    // this sets the accessibility features of the root SVG element
    setRootSVGAccess({
      node: this.svg.node(),
      chartTag: 'stacked-bar-chart',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'bar',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'stacked-bar-chart'),
      groupAccessor: this.groupAccessor,
      groupName: 'stack',
      groupKeys: this.showTotalValue ? ['sumMessage'] : false // for special group-level keys (typically not needed)
      // nested: '', // dumbbell only right now
      // recursive: true // circle-pack only right now
    });
  }

  setGeometryAccessibilityAttributes() {
    // this makes sure every geom element has correct event handlers + semantics (role, tabindex, etc)
    this.update.each((_d, i, n) => {
      initializeGeometryAccess({
        node: n[i]
      });
    });
  }

  setGeometryAriaLabels() {
    // this adds an ARIA label to each geom (a description read by screen readers)
    const keys = scopeDataKeys(this, chartAccessors, 'stacked-bar-chart');
    this.update.each((_d, i, n) => {
      setGeometryAccessLabel({
        node: n[i],
        geomType: 'bar',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        groupKeys: this.showTotalValue ? ['sumMessage'] : false,
        groupName: 'stack',
        uniqueID: this.chartID
      });
    });
  }

  setGroupAccessibilityLabel() {
    // this sets an ARIA label on all the g elements in the chart
    this.updateBarWrappers.each((_, i, n) => {
      setGroupAccessLabel({
        node: n[i],
        geomType: 'bar',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        groupName: 'stack',
        isSubgroup: true,
        groupAccessor: this.groupAccessor,
        groupKeys: this.showTotalValue ? ['sumMessage'] : false,
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.stackedBarChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.stackedBarChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.stackedBarChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.stackedBarChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.stackedBarChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.stackedBarChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.stackedBarChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and gorup counts, etc)
    setAccessChartCounts({
      rootEle: this.stackedBarChartEl,
      parentGNode: this.barG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'stacked-bar-chart',
      geomType: 'bar',
      groupName: 'stack'
      // recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.stackedBarChartEl, this.accessibility.structureNotes);
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

  onClickHandler(d) {
    this.clickFunc.emit(d);
  }

  onHoverHandler(d) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverFunc.emit(d);
    if (this.showTooltip && d) {
      this.eventsTooltip({ data: d, evt: event, isToShow: true });
    }
  }

  onMouseOutHandler() {
    overrideTitleTooltip(this.chartID, false);
    this.mouseOutFunc.emit();
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
      ordinalAccessor: this.groupAccessor, // on purpose - to match tooltip util format
      groupAccessor: this.ordinalAccessor, // on purpose - to match tooltip util format
      valueAccessor: this.valueAccessor,
      normalized: this.normalized,
      chartType: 'stacked'
    });
  }

  render() {
    // theme hardcoded until functionality is added
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
    if (this.shouldSetDimensions) {
      this.setDimensions();
      this.shouldSetDimensions = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldValidateClickHighlight) {
      this.validateClickHighlight();
      this.shouldValidateClickHighlight = false;
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
    // be moved into componentWillUpdate (if the stenicl bug is fixed)

    return (
      <div class={`o-layout is--${this.layout} ${theme}`}>
        <div class="o-layout--chart">
          <this.topLevel data-testid="main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions" data-testid="sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div class="stacked-bar-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <div class="visa-viz-d3-stacked-bar-container" />
          <div class="stacked-bar-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
          <data-table
            uniqueID={this.chartID}
            isCompact
            tableColumns={this.tableColumns}
            data={this.tableData}
            padding={this.padding}
            margin={this.margin}
            hideDataTable={this.accessibility.hideDataTableButton}
          />
        </div>
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(StackedBarChartDefaultValues);
    let i = 0;
    // accept 0 or false as default value
    const exceptions = {
      mainTitle: {
        exception: ''
      },
      subTitle: {
        exception: ''
      },
      showTooltip: {
        exception: false
      },
      wrapLabel: {
        exception: false
      },
      showTotalValue: {
        exception: false
      },
      barIntervalRatio: {
        exception: 0
      },
      hoverOpacity: {
        exception: 0
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : StackedBarChartDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
