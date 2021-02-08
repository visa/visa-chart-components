/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, h, Watch, Event, EventEmitter } from '@stencil/core';

import { select, event } from 'd3-selection';
import { max, min } from 'd3-array';
import { timeMillisecond, timeSecond, timeMinute, timeHour, timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import { scalePoint, scaleLinear, scaleTime } from 'd3-scale';
import { nest } from 'd3-collection';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IAxisType,
  IReferenceStyleType,
  IFocusStyleType,
  IBarStyleType,
  IMarkerStyleType,
  ISeriesLabelType,
  IDifferenceLabelType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  ILegendType
} from '@visa/charts-types';
import { DumbbellPlotDefaultValues } from './dumbbell-plot-default-values';
import { easeCircleIn } from 'd3-ease';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';
import { v4 as uuid } from 'uuid';
const {
  getAccessibleStrokes,
  ensureTextContrast,
  createTextStrokeFilter,
  createUrl,
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
  drawTooltip,
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
  formatDataLabel,
  getColors,
  getLicenses,
  getPadding,
  getScopedData,
  initTooltipStyle,
  overrideTitleTooltip,
  placeDataLabels,
  scopeDataKeys,
  visaColors,
  transitionEndAll,
  validateAccessibilityProps,
  findTagLevel
} = Utils;

@Component({
  tag: 'dumbbell-plot',
  styleUrl: 'dumbbell-plot.scss'
})
export class DumbbellPlot {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;
  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = DumbbellPlotDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = DumbbellPlotDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = DumbbellPlotDefaultValues.height;
  @Prop({ mutable: true }) width: number = DumbbellPlotDefaultValues.width;
  @Prop({ mutable: true }) margin: IBoxModelType = DumbbellPlotDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = DumbbellPlotDefaultValues.padding;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = DumbbellPlotDefaultValues.highestHeadingLevel;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = DumbbellPlotDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = DumbbellPlotDefaultValues.valueAccessor;
  @Prop({ mutable: true }) seriesAccessor: string = DumbbellPlotDefaultValues.seriesAccessor;
  @Prop({ mutable: true }) sortOrder: string = DumbbellPlotDefaultValues.sortOrder;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = DumbbellPlotDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = DumbbellPlotDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = DumbbellPlotDefaultValues.wrapLabel;
  @Prop({ mutable: true }) layout: string = DumbbellPlotDefaultValues.layout;
  @Prop({ mutable: true }) showBaselineX: boolean = DumbbellPlotDefaultValues.showBaselineX;
  @Prop({ mutable: true }) showBaselineY: boolean = DumbbellPlotDefaultValues.showBaselineY;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = DumbbellPlotDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = DumbbellPlotDefaultValues.hoverStyle;
  @Prop({ mutable: true }) hoverOpacity: number = DumbbellPlotDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = DumbbellPlotDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = DumbbellPlotDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = DumbbellPlotDefaultValues.cursor;
  @Prop({ mutable: true }) focusMarker: IFocusStyleType = DumbbellPlotDefaultValues.focusMarker;
  @Prop({ mutable: true }) marker: IMarkerStyleType = DumbbellPlotDefaultValues.marker;
  @Prop({ mutable: true }) barStyle: IBarStyleType = DumbbellPlotDefaultValues.barStyle;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = DumbbellPlotDefaultValues.dataLabel;
  @Prop({ mutable: true }) seriesLabel: ISeriesLabelType = DumbbellPlotDefaultValues.seriesLabel;
  @Prop({ mutable: true }) differenceLabel: IDifferenceLabelType = DumbbellPlotDefaultValues.differenceLabel;
  @Prop({ mutable: true }) showTooltip: boolean = DumbbellPlotDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = DumbbellPlotDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = DumbbellPlotDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = DumbbellPlotDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = DumbbellPlotDefaultValues.annotations;

  // Calculation (6/7)
  @Prop({ mutable: true }) maxValueOverride: number;
  @Prop({ mutable: true }) minValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = DumbbellPlotDefaultValues.referenceLines;

  // Interactivity (7/7)
  @Prop({ mutable: true }) suppressEvents: boolean = DumbbellPlotDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = DumbbellPlotDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Testing & Debug (8/7)
  @Prop() unitTest: boolean = false;
  // @Prop() debugMode: boolean = false;

  @Element()
  dumbbellPlotEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  defs: any;
  x: any;
  y: any;
  nest: any;
  map: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  baselineG: any;
  references: any;
  defaults: boolean;
  duration: number;
  enter: any;
  exit: any;
  update: any;
  enterMarkers: any;
  updateMarkers: any;
  exitMarkers: any;
  enteringLabels: any;
  exitingLabels: any;
  updatingLabels: any;
  enterSeriesLabel: any;
  updateSeriesLabel: any;
  exitSeriesLabel: any;
  enterDiffLabel: any;
  updateDiffLabel: any;
  exitDiffLabel: any;
  enterLabels: any;
  updateLabels: any;
  enterLabelChildren: any;
  updateLabelChildren: any;
  exitLabelChildren: any;
  exitLabels: any;
  enterSize: number;
  exitSize: number;
  legendG: any;
  tooltipG: any;
  legendData: any;
  ordinalLabel: any;
  labels: any;
  dumbbellG: any;
  colorArr: any;
  rawColors: any;
  textColors: any;
  markerData: any;
  xAccessor: any;
  yAccessor: any;
  placement: string;
  layoutOverride: any;
  seriesLabelDetails: any;
  diffLabelDetails: any;
  diffLabelWrapper: any;
  isVertical: boolean;
  seriesInteraction: any;
  dumbbellInteraction: any;
  innerInteractionKeys: any;
  innerLabelAccessor: string;
  url: string;
  tableData: any;
  tableColumns: any;
  updated: boolean = true;
  time = {
    timemillisecond: timeMillisecond,
    timesecond: timeSecond,
    timeminute: timeMinute,
    timehour: timeHour,
    timeday: timeDay,
    timeweek: timeWeek,
    timemonth: timeMonth,
    timeyear: timeYear
  };
  chartID: string;
  markerG: any;
  seriesData: any;
  seriesLabelWrapper: any;
  shouldUpdateLayout: boolean = false;
  shouldValidate: boolean = false;
  // shouldUpdateAccessibility: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldCheckValueAxis: boolean = false;
  shouldCheckLabelAxis: boolean = false;
  shouldSetColors: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetSeriesSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldUpdateData: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldEnterUpdateExitMarkers: boolean = false;
  shouldUpdateMarkerOpacity: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldUpdateSeriesLabels: boolean = false;
  shouldUpdateDifferenceLabels: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldValidateDataLabelPlacement: boolean = false;
  shouldValidateDataLabelAccessor: boolean = false;
  shouldAddStrokeUnder: boolean = false;
  shouldUpdateBaselineX: boolean = false;
  shouldUpdateBaselineY: boolean = false;
  shouldUpdateLegendData: boolean = false;
  shouldUpdateMarkerIDs: boolean = false;
  shouldValidateLayout: boolean = false;
  shouldValidateSeriesLabelPlacement: boolean = false;
  shouldValidateDiffLabelPlacement: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldBindLegendInteractivity: boolean = false;
  shouldBindSeriesInteractivity: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldSetLegendCursor: boolean = false;
  shouldSetSeriesCursor: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSetSeriesLabelOpacity: boolean = false;
  shouldSetDifferenceLabelOpacity: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldRenderMarkerGroup: boolean = false;
  shouldUpdateBarStyle: boolean = false;
  shouldUpdateMarkerSize: boolean = false;
  shouldUpdateDiffLabelColor: boolean = false;
  shouldUpdateMarkerStyle: boolean = false;
  shouldDrawMarkerGeometries: boolean = false;
  shouldUpdateMarkerData: boolean = false;
  shouldUpdateSeriesData: boolean = false;
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
  shouldRedrawWrapper: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  shouldSetYAxisAccessibility: boolean = false;
  shouldSetXAxisAccessibility: boolean = false;
  shouldSetAnnotationAccessibility: boolean = false;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  strokes: any = {};

  @Watch('mainTitle')
  mainTitleWatcher(_newData, _oldData) {
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('subTitle')
  subTitleWatcher(_newData, _oldData) {
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldUpdateLayout = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldEnterUpdateExitMarkers = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldUpdateMarkerIDs = true;
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
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateBarStyle = true;
    this.shouldSetColors = true;
  }

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID || 'dumbbell-plot-' + uuid();
    this.dumbbellPlotEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateLegend = true;
    this.shouldAddStrokeUnder = true;
    this.shouldUpdateMarkerIDs = true;
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
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetChartAccessibilityLongDescription = true;
    this.shouldSetChartAccessibilityContext = true;
    this.shouldSetChartAccessibilityExecutiveSummary = true;
    this.shouldSetChartAccessibilityPurpose = true;
    this.shouldSetChartAccessibilityStatisticalNotes = true;
    this.shouldSetChartAccessibilityStructureNotes = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateGeometries = true;
    this.shouldEnterUpdateExit = true;
    this.shouldEnterUpdateExitMarkers = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetDifferenceLabelOpacity = true;
    this.shouldCheckLabelAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateData = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldEnterUpdateExit = true;
    this.shouldEnterUpdateExitMarkers = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldCheckValueAxis = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('seriesAccessor')
  seriesAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldUpdateLegendData = true;
    this.shouldDrawInteractionState = true;
    this.shouldEnterUpdateExit = true;
    this.shouldEnterUpdateExitMarkers = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldAddStrokeUnder = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateLegend = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('sortOrder')
  sortWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldEnterUpdateExitMarkers = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldAddStrokeUnder = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    const newFormatVal = _newVal && _newVal.format ? _newVal.format : false;
    const oldFormatVal = _oldVal && _oldVal.format ? _oldVal.format : false;
    const newUnitVal = _newVal && _newVal.unit ? _newVal.unit : false;
    const oldUnitVal = _oldVal && _oldVal.unit ? _oldVal.unit : false;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateXGrid = true;
    }
    if (newFormatVal !== oldFormatVal || newUnitVal !== oldUnitVal) {
      this.shouldUpdateScales = true;
      if (newUnitVal !== oldUnitVal) {
        this.shouldUpdateGeometries = true;
        this.shouldUpdateLabels = true;
        this.shouldUpdateSeriesLabels = true;
        this.shouldUpdateDifferenceLabels = true;
        this.shouldUpdateReferenceLines = true;
        this.shouldUpdateAnnotations = true;
      }
    }
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
  }

  @Watch('yAxis')
  yAxisWatcher(_newVal, _oldVal) {
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateYGrid = true;
    }
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
  }

  @Watch('wrapLabel')
  wrapLabelWatcher(_newVal, _oldVal) {
    this.shouldCheckLabelAxis = true;
  }

  @Watch('layout')
  layoutWatcher(_newVal, _oldVal) {
    this.shouldValidateLayout = true;
    this.shouldValidateDataLabelPlacement = true;
    this.shouldValidateSeriesLabelPlacement = true;
    this.shouldUpdateSeriesData = true;
    this.shouldValidateDiffLabelPlacement = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldAddStrokeUnder = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
  }

  @Watch('showBaselineX')
  showBaselineXWatcher(_newVal, _oldVal) {
    this.shouldUpdateBaselineX = true;
  }

  @Watch('showBaselineY')
  showBaselineYWatcher(_newVal, _oldVal) {
    this.shouldUpdateBaselineY = true;
  }

  @Watch('colorPalette')
  @Watch('colors')
  paletteWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldSetColors = true;
    this.shouldUpdateBarStyle = true;
    this.shouldUpdateMarkerStyle = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDiffLabelColor = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldUpdateBarStyle = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldUpdateBarStyle = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetDifferenceLabelOpacity = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
    this.shouldSetSeriesCursor = true;
  }

  @Watch('focusMarker')
  focusMarkerWatcher(_newVal, _oldVal) {
    this.shouldDrawMarkerGeometries = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldUpdateMarkerIDs = true;
    this.shouldUpdateData = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldUpdateLabels = true;
    const newSizeVal = _newVal && _newVal.sizeFromBar ? _newVal.sizeFromBar : 0;
    const oldSizeVal = _oldVal && _oldVal.sizeFromBar ? _oldVal.sizeFromBar : 0;
    if (newSizeVal !== oldSizeVal) {
      this.shouldUpdateMarkerSize = true;
    }
    const newKey = _newVal && _newVal.key ? _newVal.key : false;
    const oldKey = _oldVal && _oldVal.key ? _oldVal.key : false;
    if (newKey !== oldKey) {
      this.shouldUpdateDiffLabelColor = true;
      this.shouldUpdateMarkerSize = true;
      this.shouldUpdateBarStyle = true;
    }
  }

  @Watch('marker')
  markerWatcher(_newVal, _oldVal) {
    const newVisVal = _newVal && _newVal.visible;
    const oldVisVal = _oldVal && _oldVal.visible;
    if (newVisVal !== oldVisVal) {
      this.shouldUpdateMarkerOpacity = true;
    }
    const newTypeVal = _newVal && _newVal.type ? _newVal.type : false;
    const oldTypeVal = _oldVal && _oldVal.type ? _oldVal.type : false;
    if (newTypeVal !== oldTypeVal) {
      this.shouldRenderMarkerGroup = true;
      this.shouldEnterUpdateExitMarkers = true;
    }
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldUpdateMarkerIDs = true;
    this.shouldUpdateMarkerData = true;
    this.shouldUpdateSeriesData = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabels = true;
    const newSizeVal = _newVal && _newVal.sizeFromBar ? _newVal.sizeFromBar : 0;
    const oldSizeVal = _oldVal && _oldVal.sizeFromBar ? _oldVal.sizeFromBar : 0;
    if (newSizeVal !== oldSizeVal) {
      this.shouldUpdateMarkerSize = true;
    }
  }

  @Watch('barStyle')
  barStyleWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldUpdateBarStyle = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldUpdateDiffLabelColor = true;
    this.shouldDrawInteractionState = true;
    const newSizeVal = _newVal && _newVal.width ? _newVal.width : 0;
    const oldSizeVal = _oldVal && _oldVal.width ? _oldVal.width : 0;
    if (newSizeVal !== oldSizeVal) {
      this.shouldDrawInteractionState = true;
      this.shouldUpdateMarkerData = true;
      this.shouldUpdateData = true;
      this.shouldUpdateMarkerSize = true;
    }
  }

  @Watch('dataLabel')
  dataLabelWatcher(_newVal, _oldVal) {
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
      this.shouldValidateDataLabelPlacement = true;
      // this.shouldCheckLabelColor = true;
    }
    if (newAccessor !== oldAccessor) {
      this.shouldValidateDataLabelAccessor = true;
    }
  }

  @Watch('seriesLabel')
  seriesLabelWatcher(_newVal, _oldVal) {
    this.shouldValidateSeriesLabelPlacement = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldAddStrokeUnder = true;
    this.shouldUpdateTableData = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetSeriesLabelOpacity = true;
    }
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldUpdateSeriesData = true;
      this.shouldSetSeriesSelections = true;
    }
  }

  @Watch('differenceLabel')
  differenceLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateDiffLabelColor = true;
    this.shouldAddStrokeUnder = true;
    this.shouldUpdateTableData = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetDifferenceLabelOpacity = true;
    }
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldValidateDiffLabelPlacement = true;
    }
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
    const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    if (newStrokes !== oldStrokes) {
      this.shouldUpdateBarStyle = true;
      this.shouldUpdateMarkerStyle = true;
      this.shouldAddStrokeUnder = true;
      this.shouldUpdateLegend = true;
    }
  }

  @Watch('legend')
  legendWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegend = true;
    const newInteractiveVal = _newVal && _newVal.interactive;
    const oldInteractiveVal = _oldVal && _oldVal.interactive;
    if (newInteractiveVal !== oldInteractiveVal) {
      this.shouldBindLegendInteractivity = true;
      this.shouldSetLegendCursor = true;
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
    this.shouldUpdateGeometries = true;
    this.shouldCheckValueAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateDifferenceLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('referenceStyle')
  @Watch('referenceLines')
  referenceWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldBindLegendInteractivity = true;
    this.shouldBindSeriesInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
    this.shouldSetSeriesCursor = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldUpdateMarkerStyle = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetDifferenceLabelOpacity = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateMarkerData = true;
    this.shouldSetGlobalSelections = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerIDs = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldUpdateMarkerStyle = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetDifferenceLabelOpacity = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateMarkerData = true;
    this.shouldSetGlobalSelections = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldUpdateMarkerSize = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateMarkerStyle = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetDifferenceLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateMarkerData = true;
    this.shouldSetGlobalSelections = true;
    // if the new value is the seriesAccessor rebind the legend
    // should also compare this to old val to be even more efficient
    const newValSeriesCheck = _newVal && _newVal.length === 1 ? _newVal[0] === this.seriesAccessor : false;
    const oldValSeriesCheck = _oldVal && _oldVal.length === 1 ? _oldVal[0] === this.seriesAccessor : false;
    if (newValSeriesCheck !== oldValSeriesCheck) {
      this.shouldBindSeriesInteractivity = true; // this has to be added to handle updates to series labels
      this.shouldSetSeriesCursor = true;
      this.shouldBindLegendInteractivity = true;
      this.shouldSetLegendCursor = true;
    }
  }

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.chartID = this.uniqueID || 'dumbbell-plot-' + uuid();
      this.dumbbellPlotEl.id = this.chartID;
      this.setTagLevels();
      this.checkIfSafari();
      this.validateLayout();
      this.validateDataLabelPlacement();
      this.validateSeriesLabelPlacement();
      this.validateDiffLabelPlacement();
      this.validateInteractionKeys();
      this.prepareData();
      this.prepareMarkerData();
      this.prepareSeriesData();
      this.prepareLegendData();
      this.setLayoutData();
      this.prepareScales();
      this.validateDataLabelAccessor();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.setColors();
      resolve('component will load');
    });
  }

  componentWillUpdate() {
    // NEVER put items in this method (until stencil bug is resolved)
    // All items that belong here are currently at the top of componentDidUpdate
    // see: https://github.com/ionic-team/stencil/issues/2061#issuecomment-578282178
    return new Promise(resolve => {
      resolve('component will update');
    });
  }

  componentDidLoad() {
    return new Promise(resolve => {
      this.defaults = true;
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
      this.drawXGrid();
      this.drawYGrid();
      this.renderMarkerGroup();
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.enterMarkerGeometries();
      this.updateMarkerGeometries();
      this.exitMarkerGeometries();
      this.updateMarkerSize();
      this.enterDumbbells();
      this.updateDumbbells();
      this.exitDumbbells();
      this.enterSeriesLabels();
      this.updateSeriesLabels();
      this.exitSeriesLabels();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.enterDifferenceLabels();
      this.updateDifferenceLabels();
      this.exitDifferenceLabels();
      this.updateMarkerIds();
      this.drawDumbbells();
      this.updateInteractionState();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      // this.updateBarStyle();
      this.drawLegendElements();
      this.drawDataLabels();
      this.drawSeriesLabels();
      this.drawDifferenceLabels();
      this.addStrokeUnder();
      this.drawReferenceLines();
      this.setSelectedClass();
      this.setLabelOpacity();
      // this.updateCursor();
      // this.bindInteractivity();
      this.bindLegendInteractivity();
      // this.bindSeriesInteractivity();
      this.setLegendCursor();
      // this.setSeriesCursor();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.drawYAxis();
      this.setYAxisAccessibility();
      this.drawBaselineX();
      this.drawBaselineY();
      this.onChangeHandler();
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.dumbbellG.node());
      this.setGroupAccessibilityAttributes();
      this.setGroupAccessibilityLabel();
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
      if (this.shouldRenderMarkerGroup) {
        this.renderMarkerGroup();
        this.shouldRenderMarkerGroup = false;
      }
      if (this.shouldSetGlobalSelections) {
        this.setGlobalSelections();
        this.shouldSetGlobalSelections = false;
      }
      if (this.shouldSetSeriesSelections) {
        this.setSeriesSelections();
        this.shouldSetSeriesSelections = false;
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
      if (this.shouldEnterUpdateExitMarkers) {
        this.enterMarkerGeometries();
        this.updateMarkerGeometries();
        this.exitMarkerGeometries();
        this.shouldEnterUpdateExitMarkers = false;
        this.shouldUpdateMarkerOpacity = false;
      }
      if (this.shouldUpdateMarkerOpacity) {
        this.updateMarkerGeometries();
        this.shouldUpdateMarkerOpacity = false;
      }
      if (this.shouldEnterUpdateExit) {
        this.enterDumbbells();
        this.updateDumbbells();
        this.exitDumbbells();
        this.enterSeriesLabels();
        this.updateSeriesLabels();
        this.exitSeriesLabels();
        this.enterDataLabels();
        this.updateDataLabels();
        this.exitDataLabels();
        this.enterDifferenceLabels();
        this.updateDifferenceLabels();
        this.exitDifferenceLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldUpdateMarkerIDs) {
        this.updateMarkerIds();
        this.shouldUpdateMarkerIDs = false;
      }
      if (this.shouldUpdateGeometries) {
        this.drawDumbbells();
        this.shouldUpdateGeometries = false;
      }
      if (this.shouldUpdateBarStyle) {
        this.updateBarStyle();
        this.shouldUpdateBarStyle = false;
      }
      if (this.shouldUpdateMarkerStyle) {
        this.updateMarkerStyle();
        this.shouldUpdateMarkerStyle = false;
      }
      if (this.shouldUpdateMarkerSize) {
        this.updateMarkerSize();
        this.shouldUpdateMarkerSize = false;
      }
      if (this.shouldDrawMarkerGeometries) {
        this.drawMarkerGeometries();
        this.shouldDrawMarkerGeometries = false;
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
      if (this.shouldUpdateLegend) {
        this.drawLegendElements();
        this.shouldUpdateLegend = false;
      }
      if (this.shouldUpdateLabels) {
        this.drawDataLabels();
        this.shouldUpdateLabels = false;
      }
      if (this.shouldUpdateSeriesLabels) {
        this.drawSeriesLabels();
        this.shouldUpdateSeriesLabels = false;
      }
      if (this.shouldUpdateDifferenceLabels) {
        this.drawDifferenceLabels();
        this.shouldUpdateDifferenceLabels = false;
      }
      if (this.shouldAddStrokeUnder) {
        this.addStrokeUnder();
        this.shouldAddStrokeUnder = false;
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
      if (this.shouldSetSeriesLabelOpacity) {
        this.setSeriesLabelOpacity();
        this.shouldSetSeriesLabelOpacity = false;
      }
      if (this.shouldSetDifferenceLabelOpacity) {
        this.setDifferenceLabelOpacity();
        this.shouldSetDifferenceLabelOpacity = false;
      }
      if (this.shouldUpdateDiffLabelColor) {
        this.updateDiffLabelColor();
        this.shouldUpdateDiffLabelColor = false;
      }
      if (this.shouldSetSelectionClass) {
        this.setSelectedClass();
        this.shouldSetSelectionClass = false;
      }
      if (this.shouldBindLegendInteractivity) {
        this.bindLegendInteractivity();
        this.shouldBindLegendInteractivity = false;
      }
      if (this.shouldBindSeriesInteractivity) {
        this.bindSeriesInteractivity();
        this.shouldBindSeriesInteractivity = false;
      }
      if (this.shouldSetLegendCursor) {
        this.setLegendCursor();
        this.shouldSetLegendCursor = false;
      }
      if (this.shouldSetSeriesCursor) {
        this.setSeriesCursor();
        this.shouldSetSeriesCursor = false;
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
      if (this.shouldUpdateBaselineX) {
        this.drawBaselineX();
        this.shouldUpdateBaseline = false;
      }
      if (this.shouldUpdateBaselineY) {
        this.drawBaselineY();
        this.shouldUpdateBaseline = false;
      }
      this.onChangeHandler();
      resolve('component did update');
    });
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
            onClickFunc: !this.suppressEvents ? this.clickFunc.emit : undefined
          }
        }
      );
    }
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length ? this.interactionKeys : [this.ordinalAccessor];

    this.seriesInteraction =
      this.innerInteractionKeys.length === 1 && this.innerInteractionKeys[0] === this.seriesAccessor;

    this.dumbbellInteraction =
      this.innerInteractionKeys.length === 1 && this.innerInteractionKeys[0] === this.ordinalAccessor;
  }

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueAccessor;
  }

  validateLayout() {
    this.layoutOverride = !this.layout || this.data[0][this.ordinalAccessor] instanceof Date ? 'vertical' : this.layout;
    this.isVertical = this.layoutOverride === 'vertical';
  }

  validateDataLabelPlacement() {
    this.placement = this.dataLabel.placement;
    // this.layoutOverride = !this.layout || this.data[0][this.ordinalAccessor] instanceof Date ? 'vertical' : this.layout;

    if (this.layoutOverride === 'vertical') {
      if (this.placement !== 'left' && this.placement !== 'right') {
        this.placement = 'ends';
      }
    } else {
      if (this.placement !== 'top' && this.placement !== 'bottom') {
        this.placement = 'ends';
      }
    }
  }

  validateSeriesLabelPlacement() {
    this.seriesLabelDetails = { ...this.seriesLabel };
    if (!this.seriesLabelDetails.placement) {
      this.seriesLabelDetails.placement = this.isVertical ? 'right' : 'top';
    }
    if (
      this.isVertical &&
      (this.seriesLabelDetails.placement !== 'right' && this.seriesLabelDetails.placement !== 'left')
    ) {
      this.seriesLabelDetails.placement = 'right';
    } else if (
      !this.isVertical &&
      (this.seriesLabelDetails.placement !== 'top' && this.seriesLabelDetails.placement !== 'bottom')
    ) {
      this.seriesLabelDetails.placement = 'top';
    }
    if (!this.seriesLabelDetails.label || !this.seriesLabelDetails.label.length) {
      this.seriesLabelDetails.label = '';
    }
  }

  validateDiffLabelPlacement() {
    this.diffLabelDetails = { ...this.differenceLabel };

    if (!this.diffLabelDetails.placement) {
      this.diffLabelDetails.placement = this.isVertical ? 'left' : 'top';
    }
    if (
      this.isVertical &&
      (this.diffLabelDetails.placement !== 'right' && this.diffLabelDetails.placement !== 'left')
    ) {
      this.diffLabelDetails.placement = 'left';
    } else if (
      !this.isVertical &&
      (this.diffLabelDetails.placement !== 'top' && this.diffLabelDetails.placement !== 'bottom')
    ) {
      this.diffLabelDetails.placement = 'top';
    }
  }

  checkIfSafari() {
    this.url = createUrl();
  }

  setColors() {
    this.colors = this.colors ? convertVisaColor(this.colors) : '';

    this.rawColors = this.colors || getColors(this.colorPalette, 3);
    this.colorArr = this.rawColors;

    this.textColors = {};
    this.strokes = {};
    this.rawColors.forEach(color => {
      if (!this.accessibility.hideStrokes) {
        const strokes = getAccessibleStrokes(color);
        const adjusted = strokes.length === 2 ? strokes[1] : strokes[0];
        this.strokes[color.toLowerCase()] = adjusted;
      }
      this.textColors[color.toLowerCase()] = ensureTextContrast(color, '#ffffff', 4.5);
    });
    if (this.hoverStyle && this.hoverStyle.color) {
      if (!this.accessibility.hideStrokes) {
        const strokes = getAccessibleStrokes(this.hoverStyle.color);
        const adjusted = strokes.length === 2 ? strokes[1] : strokes[0];
        this.strokes[this.hoverStyle.color.toLowerCase()] = adjusted;
      }
      this.textColors[this.hoverStyle.color.toLowerCase()] = ensureTextContrast(this.hoverStyle.color, '#ffffff', 4.5);
    }
    if (this.clickStyle && this.clickStyle.color) {
      if (!this.accessibility.hideStrokes) {
        const strokes = getAccessibleStrokes(this.clickStyle.color);
        const adjusted = strokes.length === 2 ? strokes[1] : strokes[0];
        this.strokes[this.clickStyle.color.toLowerCase()] = adjusted;
      }
      this.textColors[this.clickStyle.color.toLowerCase()] = ensureTextContrast(this.clickStyle.color, '#ffffff', 4.5);
    }
  }

  // eventually we might use textures for dumbbell, but unfortunately marker elements scale their interior fill
  // this causes markers to have terrible looking textures at larger sizes! Unfortunate.
  // setTextures() {
  //   // dumbbell will only ever need 3 colors, but this ensures that in some weird circumstances where colors array has
  //   // more than 6 colors passed into it, the textures function won't throw any errors, since it maxes out at 6 textures.
  //   const colorsArray = !(this.colorArr.length > 6) ? this.colorArr : this.colorArr.slice(0,6);
  //   if (!this.accessibility.hideTextures) {
  //     this.colorArr = convertColorsToTextures({
  //       colors: colorsArray,
  //       rootSVG: this.svg.node(),
  //       id: this.chartID,
  //       scheme: 'categorical'
  //     });
  //   } else {
  //     this.colorArr = this.rawColors
  //   }
  // }

  setLayoutData() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'dumbbell-plot');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  prepareData() {
    const nested = nest()
      .key(d => d[this.ordinalAccessor])
      .entries(this.data);

    nested.forEach(parent => {
      parent.focusMarker = false;
      parent.greaterIndex = 1;
      let firstMarker = 'marker';
      let secondMarker = 'marker';
      if (parent.values[0][this.seriesAccessor] === this.focusMarker.key) {
        parent.focusMarker = 0;
        firstMarker = 'focusMarker';
      } else if (parent.values[1][this.seriesAccessor] === this.focusMarker.key) {
        parent.focusMarker = 1;
        secondMarker = 'focusMarker';
      }
      const bar0Width = checkClicked(parent.values[0], this.clickHighlight, this.innerInteractionKeys)
        ? parseFloat(this.clickStyle.strokeWidth + '') || this.barStyle.width
        : checkHovered(parent.values[0], this.hoverHighlight, this.innerInteractionKeys)
        ? parseFloat(this.hoverStyle.strokeWidth + '') || this.barStyle.width
        : this.barStyle.width;
      // : this.barStyle.width;
      const bar1Width = checkClicked(parent.values[1], this.clickHighlight, this.innerInteractionKeys)
        ? parseFloat(this.clickStyle.strokeWidth + '') || this.barStyle.width
        : checkHovered(parent.values[1], this.hoverHighlight, this.innerInteractionKeys)
        ? parseFloat(this.hoverStyle.strokeWidth + '') || this.barStyle.width
        : this.barStyle.width;
      // : this.barStyle.width;
      parent.values[0].offset =
        parent.focusMarker !== 0 && !this.marker.visible
          ? 1
          : this.marker.type === 'dot'
          ? (this[firstMarker].sizeFromBar * (bar0Width + 1)) / 2
          : this.marker.type === 'stroke'
          ? (this[firstMarker].sizeFromBar * (bar0Width + 1)) / 5
          : !parent.focusMarker
          ? (this[firstMarker].sizeFromBar * (bar0Width + 1)) / 2
          : (this[firstMarker].sizeFromBar * (bar0Width + 1)) / 5;
      parent.values[1].offset =
        parent.focusMarker !== 1 && !this.marker.visible
          ? -1
          : this.marker.type === 'dot'
          ? -(this[secondMarker].sizeFromBar * (bar1Width + 1)) / 2
          : this.marker.type === 'stroke'
          ? -(this[secondMarker].sizeFromBar * (bar1Width + 1)) / 5
          : parent.focusMarker
          ? -(this[secondMarker].sizeFromBar * (bar1Width + 1)) / 2
          : -(this[secondMarker].sizeFromBar * (bar1Width + 1)) / 5;
      if (parent.values[0][this.valueAccessor] >= parent.values[1][this.valueAccessor]) {
        parent.greaterIndex = 0;
        parent.values[0].offset = -parent.values[0].offset;
        parent.values[1].offset = -parent.values[1].offset;
      }
    });
    const prepareMessage = d => {
      const hash = {
        absoluteDiff: 'Absolute Difference ',
        difference: 'Difference '
      };
      const calculation =
        this.differenceLabel && this.differenceLabel.calculation && hash[this.differenceLabel.calculation]
          ? this.differenceLabel.calculation
          : 'difference';
      const format =
        this.differenceLabel && this.differenceLabel.format && this.differenceLabel.visible
          ? this.differenceLabel.format
          : this.differenceLabel && this.dataLabel.format && this.dataLabel.visible
          ? this.dataLabel.format
          : '0[.][0][0]a';

      return hash[calculation] + formatDataLabel(d, calculation, format);
    };

    this.nest = nested.sort((a, b) => {
      a.difference = a.values[0][this.valueAccessor] - a.values[1][this.valueAccessor];
      b.difference = b.values[0][this.valueAccessor] - b.values[1][this.valueAccessor];
      a.absoluteDiff = Math.abs(a.difference);
      b.absoluteDiff = Math.abs(b.difference);
      a.middle = (a.values[0][this.valueAccessor] + a.values[1][this.valueAccessor]) / 2;
      b.middle = (b.values[0][this.valueAccessor] + b.values[1][this.valueAccessor]) / 2;
      a.message = prepareMessage(a);
      b.message = prepareMessage(b);
      const focusIndex = a.focusMarker !== false ? a.focusMarker : 0;
      return a.values[0][this.ordinalAccessor] instanceof Date
        ? 0
        : this.sortOrder === 'asc' || this.sortOrder === 'diffAsc'
        ? a.difference - b.difference
        : this.sortOrder === 'desc' || this.sortOrder === 'diffDesc'
        ? b.difference - a.difference
        : this.sortOrder === 'focusAsc'
        ? a.values[focusIndex][this.valueAccessor] - b.values[focusIndex][this.valueAccessor]
        : this.sortOrder === 'focusDesc'
        ? b.values[focusIndex][this.valueAccessor] - a.values[focusIndex][this.valueAccessor]
        : this.sortOrder === 'absoluteDiffAsc'
        ? a.absoluteDiff - b.absoluteDiff
        : this.sortOrder === 'absoluteDiffDesc'
        ? b.absoluteDiff - a.absoluteDiff
        : 0;
    });
    // this.map = nest()
    // .key(d => d[this.ordinalAccessor])
    // .map(this.data);
  }

  prepareMarkerData() {
    this.markerData = [];
    const first = {
      focus: false,
      label: this.nest[0].values[0][this.seriesAccessor]
    };
    const second = {
      focus: false,
      label: this.nest[0].values[1][this.seriesAccessor]
    };
    if (this.nest[0].focusMarker) {
      second.focus = true;
    } else if (this.nest[0].focusMarker === 0) {
      first.focus = true;
    }

    // if (!this.isVertical) {
    //   first.value = this.nest[0].values[0][this.valueAccessor];
    //   second.value = this.nest[0].values[1][this.valueAccessor];
    // }
    const third = {
      ...first,
      limitOpacity: true
    };
    const fourth = {
      ...second,
      limitOpacity: true
    };
    const fifth = {
      ...first
    };
    const sixth = {
      ...second
    };
    this.markerData.push(first);
    this.markerData.push(second);
    this.markerData.push(third);
    this.markerData.push(fourth);
    this.markerData.push(fifth);
    this.markerData.push(sixth);

    let i = 0;
    this.markerData.forEach(d => {
      d.index = i;
      d.referenceIndex = i < 2 ? i : i < 4 ? i - 2 : i - 4;
      i++;
    });
  }

  prepareSeriesData() {
    const isVertical = this.layoutOverride === 'vertical';
    const checkString = isVertical ? 'right' : 'top';
    const isStandard = this.seriesLabelDetails.placement.includes(checkString);
    const first = {
      label: this.nest[0].values[0][this.seriesAccessor],
      [this.seriesAccessor]: this.nest[0].values[0][this.seriesAccessor],
      value: isStandard
        ? this.nest[this.nest.length - 1].values[0][this.valueAccessor]
        : this.nest[0].values[0][this.valueAccessor]
    };
    const second = {
      label: this.nest[0].values[1][this.seriesAccessor],
      [this.seriesAccessor]: this.nest[0].values[1][this.seriesAccessor],
      value: isStandard
        ? this.nest[this.nest.length - 1].values[1][this.valueAccessor]
        : this.nest[0].values[1][this.valueAccessor]
    };
    this.seriesData = [first, second];
  }

  prepareLegendData() {
    const first = {
      label: this.nest[0].values[0][this.seriesAccessor],
      [this.seriesAccessor]: this.nest[0].values[0][this.seriesAccessor]
    };
    const second = {
      label: this.nest[0].values[1][this.seriesAccessor],
      [this.seriesAccessor]: this.nest[0].values[1][this.seriesAccessor]
    };
    this.legendData = [first, second];
    this.ordinalLabel = this.legendData.map(d => {
      return d.label;
    });
  }

  prepareScales() {
    const minValue = min(this.data, d => parseFloat(d[this.valueAccessor]));
    const maxValue = max(this.data, d => parseFloat(d[this.valueAccessor]));

    if (this.layoutOverride === 'vertical') {
      this.xAccessor = this.ordinalAccessor;
      this.yAccessor = this.valueAccessor;

      this.y = scaleLinear()
        .domain([
          this.minValueOverride || this.minValueOverride === 0
            ? this.minValueOverride
            : minValue - (maxValue - minValue) * 0.15,
          this.maxValueOverride || this.maxValueOverride === 0
            ? this.maxValueOverride
            : maxValue + (maxValue - minValue) * 0.15
        ])
        .range([this.innerPaddedHeight, 0]);

      // set xAxis scale : date
      if (this.data[0][this.ordinalAccessor] instanceof Date) {
        const maxDate = max(this.data, d => d[this.ordinalAccessor]);
        const minDate = min(this.data, d => d[this.ordinalAccessor]);

        this.x = scaleTime()
          .domain([minDate, maxDate])
          .range([0, this.innerPaddedWidth]);

        if (this.xAxis.unit) {
          const timeTool = this.time['time' + this.xAxis.unit];
          this.x.domain([timeTool.offset(minDate, -1), timeTool.offset(maxDate, +1)]);
        }
      } else {
        // set xAxis scale : ordinal value
        this.x = scalePoint()
          .domain(this.nest.map(d => d.key))
          .padding(0.5)
          .range([0, this.innerPaddedWidth]);
      }
    } else if (this.layoutOverride === 'horizontal') {
      this.xAccessor = this.valueAccessor;
      this.yAccessor = this.ordinalAccessor;

      this.x = scaleLinear()
        .domain([
          this.minValueOverride || this.minValueOverride === 0
            ? this.minValueOverride
            : minValue - (maxValue - minValue) * 0.15,
          this.maxValueOverride || this.maxValueOverride === 0
            ? this.maxValueOverride
            : maxValue + (maxValue - minValue) * 0.15
        ])
        .range([0, this.innerPaddedWidth]);

      this.y = scalePoint()
        .domain(this.nest.map(d => d.key))
        .padding(0.5)
        .range([this.innerPaddedHeight, 0]);
    }
  }

  addStrokeUnder() {
    const filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.seriesLabelWrapper.selectAll('text').attr('filter', !this.accessibility.hideStrokes ? filter : null);
    this.diffLabelWrapper.attr('filter', !this.accessibility.hideStrokes ? filter : null);
    this.labels.attr('filter', !this.accessibility.hideStrokes ? filter : null);
    this.labels.attr('filter', !this.accessibility.hideStrokes ? filter : null);
    this.dumbbellG.attr('filter', !this.accessibility.hideStrokes ? filter : null);
  }

  // reset graph size based on window size
  renderRootElements() {
    this.svg = select(this.dumbbellPlotEl)
      .select('.visa-viz-d3-dumbbell-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);
    this.defs = this.rootG.append('defs');
    this.baselineG = this.rootG.append('g').attr('class', 'baseline-group');
    this.gridG = this.rootG.append('g').attr('class', 'gridline-group');

    this.dumbbellG = this.rootG.append('g').attr('class', 'dumbbell-group');

    this.seriesLabelWrapper = this.rootG.select('.dumbbell-series-wrapper');
    this.seriesLabelWrapper = this.rootG.append('g').attr('class', 'dumbbell-series-wrapper');

    this.diffLabelWrapper = this.rootG.select('.dumbbell-diff-label-wrapper');
    this.diffLabelWrapper = this.rootG.append('g').attr('class', 'dumbbell-diff-label-wrapper');

    this.legendG = select(this.dumbbellPlotEl)
      .select('.dumbbell-legend')
      .append('svg');

    this.tooltipG = select(this.dumbbellPlotEl).select('.dumbbell-tooltip');

    this.labels = this.rootG.append('g').attr('class', 'dumbbell-dataLabel-group');
    this.references = this.rootG.append('g').attr('class', 'dumbbell-reference-line-group');
  }

  renderMarkerGroup() {
    this.markerG = this.defs.select('.' + this.marker.type + 'markers');

    if (!this.markerG.node()) {
      this.defs.selectAll('g').remove();
      this.markerG = this.defs.append('g').attr('class', this.marker.type + 'markers');
    }
  }

  setSeriesSelections() {
    const dataBoundToSeriesLabel = this.seriesLabelWrapper
      .selectAll('.dumbbell-series-label')
      .data(this.seriesData, d => d.label);
    this.enterSeriesLabel = dataBoundToSeriesLabel.enter().append('text');
    this.exitSeriesLabel = dataBoundToSeriesLabel.exit();
    this.updateSeriesLabel = dataBoundToSeriesLabel.merge(this.enterSeriesLabel);
  }

  setGlobalSelections() {
    const dataBoundToGeometries = this.dumbbellG.selectAll('.dumbbell-plot').data(this.nest, d => d.key);

    this.enter = dataBoundToGeometries.enter().append('path');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    // const dataBoundToMarkers = this.markerG.selectAll('marker').data(this.markerData, (d, i) => {
    //   d.referenceIndex = i < 2 ? i : i < 4 ? i - 2 : i - 4;
    //   const basicId = this.generateId(d, i);

    //   this['marker' + i] = basicId;
    //   d.id = basicId;
    //   return d.label + i;
    // });

    const dataBoundToMarkers = this.markerG.selectAll('marker').data(this.markerData, (d, i) => {
      return d.label + i;
    });

    this.enterMarkers = dataBoundToMarkers.enter().append('marker');
    this.exitMarkers = dataBoundToMarkers.exit();
    this.updateMarkers = dataBoundToMarkers.merge(this.enterMarkers);

    this.setSeriesSelections();

    const dataBountToDiffLabel = this.diffLabelWrapper.selectAll('.dumbbell-diff-label').data(this.nest, d => d.key);

    this.enterDiffLabel = dataBountToDiffLabel.enter().append('text');
    this.exitDiffLabel = dataBountToDiffLabel.exit();
    this.updateDiffLabel = dataBountToDiffLabel.merge(this.enterDiffLabel);

    const dataBoundToLabels = this.labels.selectAll('g').data(this.nest, d => d.key);

    this.enterLabels = dataBoundToLabels.enter().append('g');
    this.exitLabels = dataBoundToLabels.exit();
    this.updateLabels = dataBoundToLabels.merge(this.enterLabels);

    const dataBoundToLabelChildren = this.updateLabels
      .selectAll('.dumbbell-dataLabel')
      .data(d => [d.values[0], d.values[1]], d => d[this.seriesAccessor]);

    this.enterLabelChildren = dataBoundToLabelChildren.enter().append('text');
    this.exitLabelChildren = dataBoundToLabelChildren.exit();
    this.updateLabelChildren = dataBoundToLabelChildren.merge(this.enterLabelChildren);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.dumbbellPlotEl)
        .select('.visa-viz-d3-dumbbell-container')
        .attr('data-testid', 'chart-container');
      select(this.dumbbellPlotEl)
        .select('.dumbbell-main-title')
        .attr('data-testid', 'main-title');
      select(this.dumbbellPlotEl)
        .select('.dumbbell-sub-title')
        .attr('data-testid', 'sub-title');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');
      this.dumbbellG.attr('data-testid', 'dumbbell-group');
      this.baselineG.attr('data-testid', 'baseline-group');

      this.references.attr('data-testid', 'reference-line-group');
      this.updateLabels.attr('data-testid', 'dataLabel-wrapper');
      this.updateLabelChildren
        .attr('data-testid', 'dataLabel')
        .attr('data-id', d => `label-${d[this.ordinalAccessor]}-${d[this.seriesAccessor]}`);
      this.updateDiffLabel.attr('data-testid', 'difference-label').attr('data-id', d => `difference-label-${d.key}`);
      this.updateSeriesLabel.attr('data-testid', 'series-label');
      this.updateMarkers.attr('data-testid', 'marker'); // .attr('data-id', d => `marker-${d[this.ordinalAccessor]}-${d[this.seriesAccessor]}`);
      this.update.attr('data-testid', 'line').attr('data-id', d => `line-${d.key}`);
    } else {
      select(this.dumbbellPlotEl)
        .select('.visa-viz-d3-dumbbell-container')
        .attr('data-testid', null);
      select(this.dumbbellPlotEl)
        .select('.dumbbell-main-title')
        .attr('data-testid', null);
      select(this.dumbbellPlotEl)
        .select('.dumbbell-sub-title')
        .attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);
      this.dumbbellG.attr('data-testid', null);
      this.baselineG.attr('data-testid', null);

      this.references.attr('data-testid', null);
      this.updateLabels.attr('data-testid', null);
      this.updateLabelChildren.attr('data-testid', null).attr('data-id', null);
      this.updateDiffLabel.attr('data-testid', null).attr('data-id', null);
      this.updateSeriesLabel.attr('data-testid', null);
      this.updateMarkers.attr('data-testid', null); // .attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);
    }
  }

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
    const bandWidth = (this.innerPaddedWidth / this.nest.length) * 0.7;
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      wrapLabel: this.wrapLabel ? bandWidth : '',
      dateFormat: this.xAxis.format,
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: this.xAxis.label,
      padding: this.padding,
      hide: !this.xAxis.visible
    });
  }

  drawYAxis() {
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      wrapLabel: this.wrapLabel ? 100 : '',
      format: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: this.yAxis.label,
      padding: this.padding,
      hide: !this.yAxis.visible
    });
  }

  setXAxisAccessibility() {
    setAccessXAxis({
      rootEle: this.dumbbellPlotEl,
      hasXAxis: this.xAxis ? this.xAxis.visible : false,
      xAxis: this.x ? this.x : false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    setAccessYAxis({
      rootEle: this.dumbbellPlotEl,
      hasYAxis: this.yAxis ? this.yAxis.visible : false,
      yAxis: this.y ? this.y : false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: this.yAxis.label ? this.yAxis.label : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  drawBaselineX() {
    drawAxis({
      root: this.baselineG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      padding: this.padding,
      markOffset: this.x(0),
      hide: this.layout === 'horizontal' ? !this.showBaselineY : true
    });
  }

  drawBaselineY() {
    drawAxis({
      root: this.baselineG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      padding: this.padding,
      markOffset: this.y(0),
      hide: this.layout === 'vertical' ? !this.showBaselineX : true
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
      !this.xAxis.gridVisible,
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
      !this.yAxis.gridVisible,
      this.yAxis.tickInterval
    );
  }

  enterMarkerGeometries() {
    this.enterMarkers
      .attr('orient', 'auto')
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('id', d => this.generateId(d, d.index))
      .attr('class', 'marker-' + this.marker.type)
      .attr('stroke', this.handleMarkerColors);
    if (this.marker.type === 'dot') {
      this.enterMarkers.append('circle').attr('r', 5);
    } else if (this.marker.type === 'stroke') {
      this.enterMarkers.append('path');
    } else if (this.marker.type === 'arrow') {
      this.enterMarkers.append('path');
    }
    this.updateMarkerSize(this.enterMarkers);
  }

  updateMarkerGeometries() {
    this.updateMarkers.interrupt();

    this.updateMarkers.attr('opacity', d => {
      return (this.marker.visible || d.focus) && !d.limitOpacity
        ? 1
        : this.marker.visible || d.focus
        ? this.hoverOpacity
        : 0;
    });
  }

  updateMarkerStyle() {
    this.updateMarkers.attr('stroke', this.handleMarkerColors);
  }

  exitMarkerGeometries() {
    this.exitMarkers
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .remove();
  }

  // geometry based on data
  enterDumbbells() {
    this.enter.interrupt();

    this.enter
      .attr('class', 'dumbbell-plot')
      .attr('d', d => {
        const centerX1 = this.x(d.values[0][this.xAccessor]);
        const centerY1 = this.y(d.values[0][this.yAccessor]);
        const centerX2 = this.x(d.values[1][this.xAccessor]);
        const centerY2 = this.y(d.values[1][this.yAccessor]);
        const ymod = this.layout === 'vertical' ? (centerY1 > centerY2 ? 0.001 : -0.001) : 0;
        const xmod = this.layout === 'horizontal' ? (centerX1 > centerX2 ? 0.001 : -0.001) : 0;
        return `M ${centerX1 + xmod} ${centerY1 +
          ymod} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX2 -
          xmod} ${centerY2 - ymod}`;
      })
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('opacity', 0)
      .each((_d, i, n) => {
        initializeGeometryAccess({
          node: n[i]
          // recursive: false // bar doesn't use this, so it can be omitted
        });
      })
      .on(
        'click',
        !this.suppressEvents
          ? (d, i, n) => {
              if (d.values) {
                const node = n[i];
                const mouseEvent = event;
                const index = this.findMarkerIndex(d, node, mouseEvent);
                this.onClickHandler(d.values[index]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              let data = d;
              if (d.values) {
                const node = n[i];
                const mouseEvent = event;
                const index = this.findMarkerIndex(d, node, mouseEvent);
                overrideTitleTooltip(this.chartID, true);
                data = d.values[index];
                this.hoverFunc.emit(data);
              }
              this.showTooltip
                ? this.eventsTooltip({
                    data: this.tooltipLabel.labelAccessor && this.tooltipLabel.labelAccessor.length ? data : d,
                    evt: event,
                    isToShow: true
                  })
                : '';
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('stroke', this.handleBarColors)
      .attr('fill-opacity', this.handleBarOpacity);

    this.update.order();
  }

  updateBarStyle() {
    this.update.attr('stroke', this.handleBarColors).attr('fill-opacity', this.handleBarOpacity);
  }

  handleMarkerColors = (d, i, n) => {
    const rawColor = this.rawColors[d.referenceIndex] || this.rawColors[0];
    const strokeColor =
      i < 2 && this.clickHighlight.length
        ? this.clickStyle.color || rawColor
        : i < 4
        ? rawColor
        : this.hoverStyle.color || rawColor;
    const baseColor = this.colorArr[d.referenceIndex] || this.colorArr[0];
    const fillColor =
      i < 2 && this.clickHighlight.length
        ? this.clickStyle.color || baseColor
        : i < 4
        ? baseColor
        : this.hoverStyle.color || baseColor;
    select(n[i]).attr('fill', fillColor);
    return !this.accessibility.hideStrokes ? this.strokes[strokeColor.toLowerCase()] : fillColor;
  };

  handleSeriesLabelColors = (d, i) => {
    let hovered;
    let clicked;
    if (this.seriesInteraction) {
      hovered = checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
      clicked = checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    }
    const baseColor = this.rawColors[i] || this.rawColors[0];
    const fillColor = this.seriesInteraction
      ? clicked && this.clickHighlight.length
        ? this.clickStyle.color || baseColor
        : hovered && this.hoverHighlight
        ? this.hoverStyle.color || baseColor
        : baseColor
      : baseColor;
    return this.textColors[fillColor.toLowerCase()];
  };

  handleLabelColors = (d, i) => {
    const hovered = checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    const clicked = checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const baseColor = this.rawColors[i] || this.rawColors[0];
    const fillColor =
      clicked && this.clickHighlight.length
        ? this.clickStyle.color || baseColor
        : hovered && this.hoverHighlight
        ? this.hoverStyle.color || baseColor
        : baseColor;
    return this.textColors[fillColor.toLowerCase()];
  };

  handleBarColors = (d, i, n) => {
    d.focusMarker = false;
    if (d.values[0][this.seriesAccessor] === this.focusMarker.key) {
      d.focusMarker = 0;
    } else if (d.values[1][this.seriesAccessor] === this.focusMarker.key) {
      d.focusMarker = 1;
    }
    const clicked =
      checkClicked(d.values[0], this.clickHighlight, this.innerInteractionKeys) &&
      checkClicked(d.values[1], this.clickHighlight, this.innerInteractionKeys);
    const hovered =
      checkHovered(d.values[0], this.hoverHighlight, this.innerInteractionKeys) &&
      checkHovered(d.values[1], this.hoverHighlight, this.innerInteractionKeys);

    const rawColor =
      this.barStyle.colorRule === 'focus' && (d.focusMarker || d.focusMarker === 0)
        ? this.rawColors[d.focusMarker]
        : this.barStyle.colorRule === 'greaterValue'
        ? this.rawColors[d.greaterIndex]
        : this.rawColors[2];
    const strokeColor =
      clicked && this.clickHighlight.length
        ? this.clickStyle.color || rawColor
        : hovered && this.hoverHighlight
        ? this.hoverStyle.color || rawColor
        : rawColor;

    const baseColor =
      this.barStyle.colorRule === 'focus' && (d.focusMarker || d.focusMarker === 0)
        ? this.colorArr[d.focusMarker]
        : this.barStyle.colorRule === 'greaterValue'
        ? this.colorArr[d.greaterIndex]
        : this.colorArr[2];
    const fillColor =
      clicked && this.clickHighlight.length
        ? this.clickStyle.color || baseColor
        : hovered && this.hoverHighlight
        ? this.hoverStyle.color || baseColor
        : baseColor;
    select(n[i]).attr('fill', fillColor);
    return !this.accessibility.hideStrokes ? this.strokes[strokeColor.toLowerCase()] : fillColor;
  };

  handleBarOpacity = (d, i, n) => {
    const first = checkInteraction(
      d.values[0],
      1,
      0,
      this.hoverHighlight,
      this.clickHighlight,
      this.innerInteractionKeys
    );
    const second = checkInteraction(
      d.values[1],
      1,
      0,
      this.hoverHighlight,
      this.clickHighlight,
      this.innerInteractionKeys
    );
    const opacity = first && second ? this.barStyle.opacity : this.hoverOpacity;
    select(n[i]).attr('stroke-opacity', opacity);
    return opacity;
  };

  updateMarkerSize(selection?) {
    const markersToResize = selection || this.updateMarkers;

    markersToResize.each((d, i, n) => {
      const me = select(n[i]);
      const barSize =
        i < 2 && this.clickHighlight.length
          ? parseFloat(this.clickStyle.strokeWidth + '')
          : i < 4
          ? this.barStyle.width
          : parseFloat(this.hoverStyle.strokeWidth + '');
      const barMult = d.focus ? this.focusMarker.sizeFromBar : this.marker.sizeFromBar;
      const mult =
        this.marker.type === 'dot'
          ? 1
          : this.marker.type === 'stroke'
          ? 2
          : (d.focus && this.focusMarker.key) || (!this.focusMarker.key && d.referenceIndex === 0)
          ? 1
          : 2;
      const unit = barMult * mult * (barSize + 1);
      const strokeUnit = unit ? 10 / unit : 0;
      me.attr('viewBox', `0 0 ${10 + strokeUnit} ${10 + strokeUnit}`)
        .attr('refX', 5 + strokeUnit / 2)
        .attr('refY', 5 + strokeUnit / 2)
        .attr('stroke-width', strokeUnit)
        .attr('markerWidth', unit)
        .attr('markerHeight', unit);
      if (this.marker.type === 'dot') {
        me.select('circle')
          .attr('cx', 5 + strokeUnit / 2)
          .attr('cy', 5 + strokeUnit / 2);
      } else if (this.marker.type === 'stroke') {
        me.select('path').attr(
          'd',
          `M 4.5 ${0 + strokeUnit / 2} L 4.5 ${10 + strokeUnit / 2} L 6 ${10 + strokeUnit / 2} L 6 ${0 +
            strokeUnit / 2} z`
        );
      } else if (this.marker.type === 'arrow') {
        me.select('path')
          .attr(
            'transform',
            d.focus && this.focusMarker.key && d.referenceIndex === 1
              ? `rotate(180,${5 + strokeUnit / 2},${5 + strokeUnit / 2})`
              : null
          )
          .attr(
            'd',
            (d.focus && this.focusMarker.key) || (!this.focusMarker.key && d.referenceIndex === 0)
              ? `M ${0 + strokeUnit / 2} ${5 + strokeUnit / 4} L ${10 + strokeUnit / 2} ${0 + strokeUnit / 2} L ${10 +
                  strokeUnit / 2} ${10 + strokeUnit / 2} z`
              : `M 4.5 ${0 + strokeUnit / 2} L 4.5 ${10 + strokeUnit / 2} L 6 ${10 + strokeUnit / 2} L 6 ${0 +
                  strokeUnit / 2} z`
          );
      }
    });
  }

  // unlike normal draw__ functions, this only runs if focusMarker changes
  drawMarkerGeometries() {
    this.updateMarkers.selectAll('.marker-' + this.marker.type).data(d => [d]); // data must be explicitly rebound to child elements (this normally only happens on enter)

    if (this.marker.type === 'arrow') {
      // Note: dot and stroke do not change "direction" (only size), and thus don't redraw
      this.updateMarkers.selectAll('path').attr('d', (d, i, n) => {
        const barSize =
          i < 2 && this.clickHighlight.length
            ? parseFloat(this.clickStyle.strokeWidth + '')
            : i < 4
            ? this.barStyle.width
            : parseFloat(this.hoverStyle.strokeWidth + '');
        const barMult = d.focus ? this.focusMarker.sizeFromBar : this.marker.sizeFromBar;
        const mult =
          this.marker.type === 'dot'
            ? 1
            : this.marker.type === 'stroke'
            ? 2
            : (d.focus && this.focusMarker.key) || (!this.focusMarker.key && d.referenceIndex === 0)
            ? 1
            : 2;
        const unit = barMult * mult * (barSize + 1);
        const strokeUnit = unit ? 10 / unit : 0;
        select(n[i]).attr(
          'transform',
          d.focus && this.focusMarker.key && d.referenceIndex === 1
            ? `rotate(180,${5 + strokeUnit / 2},${5 + strokeUnit / 2})`
            : null
        );
        return (d.focus && this.focusMarker.key) || (!this.focusMarker.key && d.referenceIndex === 0)
          ? `M ${0 + strokeUnit / 2} ${5 + strokeUnit / 4} L ${10 + strokeUnit / 2} ${0 + strokeUnit / 2} L ${10 +
              strokeUnit / 2} ${10 + strokeUnit / 2} z`
          : `M 4.5 ${0 + strokeUnit / 2} L 4.5 ${10 + strokeUnit / 2} L 6 ${10 + strokeUnit / 2} L 6 ${0 +
              strokeUnit / 2} z`;
      });
    }
  }

  updateDumbbells() {
    this.update.interrupt();

    this.enter
      .transition('opacity')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 1);
  }

  exitDumbbells() {
    this.exit.interrupt();

    this.exit
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .attr('d', (_, i, n) => {
        const me = select(n[i]);
        const centerX1 = +me.attr('data-centerX1');
        const centerY1 = +me.attr('data-centerY1');
        const centerX2 = +me.attr('data-centerX2');
        const centerY2 = +me.attr('data-centerY2');
        const ymod = this.layout === 'vertical' ? (centerY1 > centerY2 ? 0.001 : -0.001) : 0;
        const xmod = this.layout === 'horizontal' ? (centerX1 > centerX2 ? 0.001 : -0.001) : 0;
        return `M ${centerX1 + xmod} ${centerY1 +
          ymod} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX1} ${centerY1} L ${centerX2} ${centerY2} L ${centerX2} ${centerY2} L ${centerX2 -
          xmod} ${centerY2 - ymod}`;
      });

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

  setBarSize = (d, i, n) => {
    const clicked =
      checkClicked(d.values[0], this.clickHighlight, this.innerInteractionKeys) &&
      checkClicked(d.values[1], this.clickHighlight, this.innerInteractionKeys);
    const hovered =
      checkHovered(d.values[0], this.hoverHighlight, this.innerInteractionKeys) &&
      checkHovered(d.values[1], this.hoverHighlight, this.innerInteractionKeys);
    const barSize = this.dumbbellInteraction
      ? clicked
        ? parseFloat(this.clickStyle.strokeWidth + '') || this.barStyle.width
        : hovered
        ? parseFloat(this.hoverStyle.strokeWidth + '') || this.barStyle.width
        : this.barStyle.width
      : this.barStyle.width;
    const centerX1 = this.x(d.values[0][this.xAccessor]);
    const centerY1 = this.y(d.values[0][this.yAccessor]);
    const centerX2 = this.x(d.values[1][this.xAccessor]);
    const centerY2 = this.y(d.values[1][this.yAccessor]);
    const ymod = this.layout === 'vertical' ? (centerY1 > centerY2 ? 0.001 : -0.001) : 0;
    const xmod = this.layout === 'horizontal' ? (centerX1 > centerX2 ? 0.001 : -0.001) : 0;
    const widthMod = this.layout === 'vertical' ? barSize / 2 : 0;
    const heightMod = this.layout === 'horizontal' ? barSize / 2 : 0;
    select(n[i])
      .attr('data-barSize', barSize)
      .attr('data-centerX1', d => this.x(d.values[0][this.xAccessor]))
      .attr('data-centerY1', d => this.y(d.values[0][this.yAccessor]))
      .attr('data-centerX2', d => this.x(d.values[1][this.xAccessor]))
      .attr('data-centerY2', d => this.y(d.values[1][this.yAccessor]));
    return `M ${centerX1 + xmod} ${centerY1 + ymod} L ${centerX1} ${centerY1} L ${centerX1 + widthMod} ${centerY1 +
      heightMod} L ${centerX2 + widthMod} ${centerY2 + heightMod} L ${centerX2} ${centerY2} L ${centerX2 -
      widthMod} ${centerY2 - heightMod} L ${centerX1 - widthMod} ${centerY1 -
      heightMod} L ${centerX1} ${centerY1} L ${centerX1 + widthMod} ${centerY1 + heightMod} L ${centerX2 +
      widthMod} ${centerY2 + heightMod} L ${centerX2} ${centerY2} L ${centerX2 - xmod} ${centerY2 - ymod}`;
  };

  drawDumbbells() {
    this.update
      .classed('moving', (d, i, n) => {
        const me = select(n[i]);
        const clicked =
          checkClicked(d.values[0], this.clickHighlight, this.innerInteractionKeys) &&
          checkClicked(d.values[1], this.clickHighlight, this.innerInteractionKeys);
        const hovered =
          checkHovered(d.values[0], this.hoverHighlight, this.innerInteractionKeys) &&
          checkHovered(d.values[1], this.hoverHighlight, this.innerInteractionKeys);
        const barSize = this.dumbbellInteraction
          ? clicked
            ? parseFloat(this.clickStyle.strokeWidth + '') || this.barStyle.width
            : hovered
            ? parseFloat(this.hoverStyle.strokeWidth + '') || this.barStyle.width
            : this.barStyle.width
          : this.barStyle.width;
        const centerX1 = this.x(d.values[0][this.xAccessor]);
        const centerY1 = this.y(d.values[0][this.yAccessor]);
        const centerX2 = this.x(d.values[1][this.xAccessor]);
        const centerY2 = this.y(d.values[1][this.yAccessor]);
        const oldBar = +me.attr('data-barSize');
        const oldX1 = +me.attr('data-centerX1');
        const oldY1 = +me.attr('data-centerY1');
        const oldX2 = +me.attr('data-centerX2');
        const oldY2 = +me.attr('data-centerY2');
        return (
          barSize !== oldBar || centerX1 !== oldX1 || centerY1 !== oldY1 || centerX2 !== oldX2 || centerY2 !== oldY2
        );
      })
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('d', this.setBarSize)
      .call(transitionEndAll, () => {
        this.update.classed('moving', false);
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
          // focusDidExist // this only matters for exiting selections
          // recursive: true // this only matters for
        });
      });
  }

  updateMarkerIds() {
    this.updateMarkers.attr('id', d => this.generateId(d, d.index));
    this.update
      .attr('marker-start', d => {
        const check = checkInteraction(
          d.values[0],
          1,
          0,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
        const hovered = checkHovered(d.values[0], this.hoverHighlight, this.innerInteractionKeys);
        const clicked = checkClicked(d.values[0], this.clickHighlight, this.innerInteractionKeys);
        const marker =
          hovered && !clicked
            ? this.updateMarkers._groups[0][4].id
            : clicked || check
            ? this.updateMarkers._groups[0][0].id
            : this.updateMarkers._groups[0][2].id;
        return this.url + marker + ')';
      })
      .attr('marker-end', d => {
        const check = checkInteraction(
          d.values[1],
          1,
          0,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
        const hovered = checkHovered(d.values[1], this.hoverHighlight, this.innerInteractionKeys);
        const clicked = checkClicked(d.values[1], this.clickHighlight, this.innerInteractionKeys);
        const marker =
          hovered && !clicked
            ? this.updateMarkers._groups[0][5].id
            : clicked || check
            ? this.updateMarkers._groups[0][1].id
            : this.updateMarkers._groups[0][3].id;
        return this.url + marker + ')';
      });
  }

  updateInteractionState() {
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.update.interrupt('opacity');
    // this.updateSeriesLabel.interrupt('opacity');
    // this.updateDiffLabel.interrupt('opacity');
    this.updateLabelChildren.interrupt('opacity');
    this.updateMarkers.interrupt();

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time

    this.updateMarkers.attr('opacity', d => {
      return (this.marker.visible || d.focus) && !d.limitOpacity
        ? 1
        : this.marker.visible || d.focus
        ? this.hoverOpacity
        : 0;
    });

    this.update
      .attr('opacity', 1)
      .attr('stroke', this.handleBarColors)
      .attr('fill-opacity', this.handleBarOpacity)
      .each((_, i, n) => {
        const me = select(n[i]);
        if (!me.classed('moving')) {
          me.attr('d', this.setBarSize);
        }
      });

    this.drawDataLabels(true);

    retainAccessFocus({
      parentGNode: this.rootG.node()
    });

    setLegendInteractionState({
      root: this.legendG,
      uniqueID: this.chartID,
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.seriesAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.hoverStyle,
      clickStyle: this.clickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

  enterSeriesLabels() {
    this.enterSeriesLabel.interrupt();

    const checkString = this.isVertical ? 'right' : 'top';
    const isStandard = this.seriesLabelDetails.placement.includes(checkString);
    this.enterSeriesLabel
      .attr('opacity', 0)
      .attr('class', 'dumbbell-series-label')
      .attr('fill', this.handleSeriesLabelColors)
      .attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null)
      .on('click', !this.suppressEvents && this.seriesInteraction ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents && this.seriesInteraction ? d => this.onHoverHandler(d, false) : null)
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null)
      .attr('text-anchor', this.isVertical && isStandard ? 'start' : this.isVertical ? 'end' : 'middle')
      .attr('x', d => (this.isVertical && isStandard ? this.innerPaddedWidth : !this.isVertical ? this.x(d.value) : 0))
      .attr('y', d =>
        this.isVertical ? this.y(d.value) : !this.isVertical && !isStandard ? this.innerPaddedHeight : 0
      )
      .attr('dx', this.isVertical && isStandard ? '0.1em' : this.isVertical ? '-0.1em' : '0')
      .attr('dy', this.isVertical ? '0.3em' : '-0.1em');
  }

  updateSeriesLabels() {
    this.updateSeriesLabel.interrupt();

    this.updateSeriesLabel
      .transition('opacity_series_labels')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d => {
        const seriesLabelOpacity = !this.seriesLabel.visible ? 0 : 1;
        if (!this.seriesInteraction) {
          return seriesLabelOpacity;
        } else {
          return checkInteraction(
            d,
            seriesLabelOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          ) < 1
            ? 0
            : 1;
        }
      });
  }

  exitSeriesLabels() {
    this.exitSeriesLabel
      .transition('exit_series_labels')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  drawSeriesLabels() {
    const checkString = this.isVertical ? 'right' : 'top';
    const isStandard = this.seriesLabelDetails.placement.includes(checkString);

    this.updateSeriesLabel
      .text((d, i) => (this.seriesLabelDetails.label ? this.seriesLabelDetails.label[i] : d.label))
      .attr('fill', this.handleSeriesLabelColors)
      .transition('update_series_labels')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('text-anchor', this.isVertical && isStandard ? 'start' : this.isVertical ? 'end' : 'middle')
      .attr('x', d => (this.isVertical && isStandard ? this.innerPaddedWidth : !this.isVertical ? this.x(d.value) : 0))
      .attr('y', d =>
        this.isVertical ? this.y(d.value) : !this.isVertical && !isStandard ? this.innerPaddedHeight : 0
      )
      .attr('dx', this.isVertical && isStandard ? '0.1em' : this.isVertical ? '-0.1em' : '0')
      .attr('dy', this.isVertical ? '0.3em' : '-0.1em');
  }

  setSeriesLabelOpacity() {
    this.updateSeriesLabel.interrupt('opacity_series_labels');

    this.updateSeriesLabel.attr('opacity', d => {
      const seriesLabelOpacity = !this.seriesLabel.visible ? 0 : 1;
      // check if interactionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
      if (!this.seriesInteraction) {
        return seriesLabelOpacity;
      } else {
        return checkInteraction(
          d,
          seriesLabelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1;
      }
    });
  }

  enterDifferenceLabels() {
    this.enterDiffLabel.interrupt();

    const checkString = this.isVertical ? 'left' : 'top';
    const isStandard = this.diffLabelDetails.placement.includes(checkString);

    this.enterDiffLabel
      .attr('class', 'dumbbell-diff-label')
      .attr('opacity', 0)
      .attr('fill', this.setDiffLabelColor)
      .attr('cursor', !this.suppressEvents && this.dumbbellInteraction ? this.cursor : null)
      .on(
        'click',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? d => this.onClickHandler(d)
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? d => this.onHoverHandler(d, true)
          : null
      )
      .on(
        'mouseout',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? () => this.onMouseOutHandler()
          : null
      )
      .attr('x', d => (this.isVertical ? this.x(d.values[0][this.ordinalAccessor]) : this.x(d.middle)))
      .attr('y', d =>
        !this.isVertical && isStandard
          ? this.y(d.key) - this.barStyle.width / 2 - 4
          : !this.isVertical
          ? this.y(d.key) + this.barStyle.width / 2 + 4
          : this.y(d.middle)
      )
      .attr(
        'dx',
        this.isVertical && isStandard
          ? -this.barStyle.width / 2 - 4
          : this.isVertical
          ? this.barStyle.width / 2 + 4
          : '0'
      )
      .attr('dy', !this.isVertical && isStandard ? '0' : !this.isVertical ? '0.6em' : '0.3em');
  }

  updateDifferenceLabels() {
    this.updateDiffLabel.interrupt();

    this.updateDiffLabel
      .transition('opacity_diff_labels')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d => {
        const diffLabelOpacity = this.differenceLabel.visible ? 1 : 0;
        // check if interactionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
        if (!this.dumbbellInteraction) {
          return diffLabelOpacity;
        } else {
          return checkInteraction(
            d.values[0],
            diffLabelOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          ) < 1
            ? 0
            : 1;
        }
      });
  }

  exitDifferenceLabels() {
    this.exitDiffLabel
      .transition('exit_diff_label')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  drawDifferenceLabels() {
    const checkString = this.isVertical ? 'left' : 'top';
    const isStandard = this.diffLabelDetails.placement.includes(checkString);

    this.updateDiffLabel
      .text(d => formatDataLabel(d, this.differenceLabel.calculation, this.differenceLabel.format))
      .transition('update_diff_label')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('text-anchor', this.isVertical && isStandard ? 'end' : this.isVertical ? 'start' : 'middle')
      .attr('x', d => (this.isVertical ? this.x(d.values[0][this.ordinalAccessor]) : this.x(d.middle)))
      .attr('y', d =>
        !this.isVertical && isStandard
          ? this.y(d.key) - this.barStyle.width / 2 - 4
          : !this.isVertical
          ? this.y(d.key) + this.barStyle.width / 2 + 4
          : this.y(d.middle)
      )
      .attr(
        'dx',
        this.isVertical && isStandard
          ? -this.barStyle.width / 2 - 4
          : this.isVertical
          ? this.barStyle.width / 2 + 4
          : '0'
      )
      .attr('dy', !this.isVertical && isStandard ? '0' : !this.isVertical ? '0.6em' : '0.3em');
  }

  enterDataLabels() {
    this.enterLabels.interrupt();

    this.enterLabels
      .attr('class', 'dumbbell-label-wrapper')
      .attr('opacity', 0)
      .attr('fill', this.handleLabelColors);

    this.enterLabelChildren
      .attr('class', 'dumbbell-dataLabel')
      .attr('opacity', 0)
      .attr('fill', this.handleLabelColors)
      .attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null)
      .on('click', !this.suppressEvents && this.dataLabel.visible ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents && this.dataLabel.visible ? d => this.onHoverHandler(d, true) : null)
      .on('mouseout', !this.suppressEvents && this.dataLabel.visible ? () => this.onMouseOutHandler() : null);

    placeDataLabels({
      root: this.enterLabelChildren,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.placement,
      chartType: 'dumbbell',
      layout: this.layoutOverride,
      labelOffset: this.markerData
    });
  }

  setDifferenceLabelOpacity() {
    this.updateDiffLabel.interrupt('opacity_diff_labels');

    this.updateDiffLabel.attr('opacity', d => {
      const diffLabelOpacity = this.differenceLabel.visible ? 1 : 0;
      // check if interactionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
      if (!this.dumbbellInteraction) {
        return diffLabelOpacity;
      } else {
        return checkInteraction(
          d.values[0],
          diffLabelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1;
      }
    });
  }

  updateDataLabels() {
    this.updateLabelChildren.classed('transitioning', true);

    this.updateLabels
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', () => {
        const labelOpacity = !this.dataLabel.visible ? 0 : 1;
        return labelOpacity;
      })
      .call(transitionEndAll, () => {
        this.updateLabelChildren.classed('transitioning', false);
      });
  }

  exitDataLabels() {
    this.exitLabels.interrupt();

    this.exitLabels
      .selectAll('.dumbbell-dataLabel')
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitLabels.remove();
      });

    this.exitLabelChildren
      .transition('exit_dataLabel')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  drawDataLabels(interactionOverride?) {
    this.updateLabelChildren.text(d => {
      return formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format);
    });

    const labelUpdate = this.updateLabelChildren
      .attr('fill', this.handleLabelColors)
      .transition('update_dataLabel')
      .ease(easeCircleIn)
      .duration((d, i, n) => {
        const hovered = checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
        const clicked = checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
        if ((hovered || clicked) && interactionOverride && !select(n[i]).classed('transitioning')) {
          return 0;
        }
        return this.duration;
      });

    placeDataLabels({
      root: labelUpdate,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.placement,
      chartType: 'dumbbell',
      layout: this.layoutOverride,
      labelOffset: this.markerData
    });
  }

  updateDiffLabelColor() {
    this.updateDiffLabel.attr('fill', this.setDiffLabelColor);
  }

  setDiffLabelColor = d => {
    d.focusMarker = false;
    if (d.values[0][this.seriesAccessor] === this.focusMarker.key) {
      d.focusMarker = 0;
    } else if (d.values[1][this.seriesAccessor] === this.focusMarker.key) {
      d.focusMarker = 1;
    }

    const baseColor =
      this.barStyle.colorRule === 'focus' && (d.focusMarker || d.focusMarker === 0)
        ? this.rawColors[d.focusMarker]
        : this.barStyle.colorRule === 'greaterValue'
        ? this.rawColors[d.greaterIndex]
        : this.rawColors[2];
    let hovered;
    let clicked;
    if (this.dumbbellInteraction) {
      clicked =
        checkClicked(d.values[0], this.clickHighlight, this.innerInteractionKeys) &&
        checkClicked(d.values[1], this.clickHighlight, this.innerInteractionKeys);
      hovered =
        checkHovered(d.values[0], this.hoverHighlight, this.innerInteractionKeys) &&
        checkHovered(d.values[1], this.hoverHighlight, this.innerInteractionKeys);
    }
    const fillColor = this.dumbbellInteraction
      ? clicked && this.clickHighlight.length
        ? this.clickStyle.color || baseColor
        : hovered && this.hoverHighlight
        ? this.hoverStyle.color || baseColor
        : baseColor
      : baseColor;
    return this.textColors[fillColor.toLowerCase()];
  };

  setLabelOpacity() {
    this.updateLabels.attr('opacity', this.dataLabel.visible ? 1 : 0);

    this.updateLabelChildren.attr('opacity', d => {
      return checkInteraction(
        d,
        1,
        this.hoverOpacity,
        this.hoverHighlight,
        this.clickHighlight,
        this.innerInteractionKeys
      ) < 1
        ? 0
        : 1;
    });
  }

  updateMarkerOpacity() {
    this.updateMarkers.interrupt();

    this.updateMarkers.attr('opacity', d => {
      return (this.marker.visible || d.focus) && !d.limitOpacity
        ? 1
        : this.marker.visible || d.focus
        ? this.hoverOpacity
        : 0;
    });
  }

  drawReferenceLines() {
    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', '.dumbbell-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines
      // .attr('id', (_, i) => 'reference-line-' + i)
      .attr('class', 'dumbbell-reference-line')
      .attr('data-testid', this.unitTest ? 'reference-line' : null)
      .attr('opacity', 0);

    const enterLabels = enterReferences.append('text');

    enterLabels
      // .attr('id', (_, i) => 'reference-line-' + i + '-label')
      .attr('class', 'dumbbell-reference-line-label')
      .attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.dumbbell-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeLabels = mergeReferences
      .selectAll('.dumbbell-reference-line-label')
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

    enterReferences.attr('transform', d => {
      const scale = this.layoutOverride === 'horizontal' ? 'x' : 'y';
      return 'translate(0,' + this[scale](d.value) + ')';
    });

    mergeReferences
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('transform', d => {
        const scale = this.layoutOverride === 'horizontal' ? 'x' : 'y';
        return 'translate(0,' + this[scale](d.value) + ')';
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

    mergeLines
      .style('stroke', visaColors[this.referenceStyle.color] || this.referenceStyle.color)
      .style('stroke-width', this.referenceStyle.strokeWidth)
      .attr('stroke-dasharray', this.referenceStyle.dashed ? this.referenceStyle.dashed : '')
      .attr('opacity', this.referenceStyle.opacity);

    mergeLabels.style('fill', visaColors[this.referenceStyle.color] || this.referenceStyle.color).attr('opacity', 1);
  }

  setSelectedClass() {
    this.update.classed('highlight', (d, i, n) => {
      const first = checkInteraction(d.values[0], 1, 0, {}, this.clickHighlight, this.innerInteractionKeys);
      const second = checkInteraction(d.values[1], 1, 0, {}, this.clickHighlight, this.innerInteractionKeys);
      let selected = first || second;
      selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
      const selectable = this.accessibility.elementsAreInterface;
      setElementInteractionAccessState(n[i], selected, selectable);
      return selected;
    });
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.x,
      xAccessor: this.layout !== 'horizontal' ? this.ordinalAccessor : this.valueAccessor,
      yScale: this.y,
      yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.ordinalAccessor
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.dumbbellPlotEl, this.annotations);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      rootEle: this.dumbbellPlotEl,
      geomType: 'dumbbell',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'dumbbell-plot',
      uniqueID: this.chartID,
      highestHeadingLevel: this.highestHeadingLevel,
      redraw: this.shouldRedrawWrapper
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    const keys = scopeDataKeys(this, chartAccessors, 'dumbbell-plot');
    delete keys[this.ordinalAccessor];
    setRootSVGAccess({
      node: this.svg.node(),
      chartTag: 'dumbbell-plot',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'dumbbell',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: keys,
      // groupAccessor: this.groupAccessor
      // groupName: 'node',
      groupKeys: ['message'],
      nested: 'values'
      // recursive: true // bar chart does not include these
    });
  }

  setGeometryAccessibilityAttributes() {
    this.update.each((_d, i, n) => {
      initializeGeometryAccess({
        node: n[i]
        // recursive: false // dumbbell doesn't use this, so it can be omitted
      });
    });
  }

  setGeometryAriaLabels() {
    const keys = scopeDataKeys(this, chartAccessors, 'dumbbell-plot');
    delete keys[this.ordinalAccessor];
    this.update.each((_d, i, n) => {
      setGeometryAccessLabel({
        node: n[i],
        geomType: 'dumbbell',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        groupKeys: ['message'],
        nested: ['values'],
        uniqueID: this.chartID
      });
    });
  }

  setGroupAccessibilityAttributes() {
    // if a component's <g> elements can enter/exit, this will need to be called in the
    // lifecycle more than just initially, like how setGeometryAccessibilityAttributes works
    initializeGroupAccess(this.dumbbellG.node());
  }

  setGroupAccessibilityLabel() {
    this.dumbbellG.each((_, i, n) => {
      setGroupAccessLabel({
        node: n[i],
        geomType: 'dumbbell',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        groupKeys: ['message'],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.dumbbellPlotEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.dumbbellPlotEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.dumbbellPlotEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.dumbbellPlotEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.dumbbellPlotEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.dumbbellPlotEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.dumbbellPlotEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.dumbbellPlotEl,
      parentGNode: this.dumbbellG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'dumbbell-plot',
      geomType: 'dumbbell'
      // groupName: 'line', // bar chart doesn't use this, so it is omitted
      // recursive: true // bar chart doesn't use this, so it is omitted
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.dumbbellPlotEl, this.accessibility.structureNotes);
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

  onHoverHandler(d, hasTooltip) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverFunc.emit(d);
    if (this.showTooltip && hasTooltip) {
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
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      groupAccessor: this.seriesAccessor,
      diffLabelDetails: this.diffLabelDetails,
      chartType: 'dumbbell'
    });
  }

  updateCursor() {
    this.update.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updateDiffLabel.attr(
      'cursor',
      !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible ? this.cursor : null
    );
    this.updateLabelChildren.attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null);
  }

  drawLegendElements() {
    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.top + 20,
      colorArr: this.colorArr,
      baseColorArr: !this.accessibility.hideStrokes ? this.rawColors : null,
      hideStrokes: this.accessibility.hideStrokes,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: 'bar',
      fontSize: 16,
      data: this.legendData,
      label: this.legend.labels || this.ordinalLabel,
      hide: !this.legend.visible,
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.seriesAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.hoverStyle,
      clickStyle: this.clickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

  bindLegendInteractivity() {
    select(this.dumbbellPlotEl)
      .selectAll('.legend')
      .on(
        'click',
        this.legend.interactive && this.seriesInteraction && !this.suppressEvents ? d => this.onClickHandler(d) : null
      )
      .on(
        'mouseover',
        this.legend.interactive && this.seriesInteraction && !this.suppressEvents
          ? d => this.onHoverHandler(d, false)
          : null
      )
      .on(
        'mouseout',
        this.legend.interactive && this.seriesInteraction && !this.suppressEvents
          ? () => this.onMouseOutHandler()
          : null
      );
  }

  setLegendCursor() {
    select(this.dumbbellPlotEl)
      .selectAll('.legend')
      .style('cursor', this.legend.interactive && this.seriesInteraction && !this.suppressEvents ? this.cursor : null);
  }

  setSeriesCursor() {
    this.updateSeriesLabel.attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null);
  }

  bindSeriesInteractivity() {
    this.updateSeriesLabel
      .on('click', !this.suppressEvents && this.seriesInteraction ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents && this.seriesInteraction ? d => this.onHoverHandler(d, false) : null)
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null);
  }

  bindInteractivity() {
    this.update
      .on(
        'click',
        !this.suppressEvents
          ? (d, i, n) => {
              if (d.values) {
                const node = n[i];
                const mouseEvent = event;
                const index = this.findMarkerIndex(d, node, mouseEvent);
                this.onClickHandler(d.values[index]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              let data = d;
              if (d.values) {
                const node = n[i];
                const mouseEvent = event;
                const index = this.findMarkerIndex(d, node, mouseEvent);
                overrideTitleTooltip(this.chartID, true);
                data = d.values[index];
                this.hoverFunc.emit(data);
              }
              this.showTooltip
                ? this.eventsTooltip({
                    data: this.tooltipLabel.labelAccessor && this.tooltipLabel.labelAccessor.length ? data : d,
                    evt: event,
                    isToShow: true
                  })
                : '';
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updateLabelChildren
      .on('click', !this.suppressEvents && this.dataLabel.visible ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents && this.dataLabel.visible ? d => this.onHoverHandler(d, true) : null)
      .on('mouseout', !this.suppressEvents && this.dataLabel.visible ? () => this.onMouseOutHandler() : null);

    this.updateDiffLabel
      .on(
        'click',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? d => this.onClickHandler(d)
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? d => this.onHoverHandler(d, true)
          : null
      )
      .on(
        'mouseout',
        !this.suppressEvents && this.dumbbellInteraction && this.differenceLabel.visible
          ? () => this.onMouseOutHandler()
          : null
      );
  }

  findMarkerIndex(data, node, mouseEvent) {
    const pos =
      this.layoutOverride === 'vertical'
        ? this.findPosition(node, mouseEvent)[1]
        : this.findPosition(node, mouseEvent)[0];
    const a = this.layoutOverride === 'vertical' ? 'Y' : 'X';
    const start = +select(node).attr('data-center' + a + '1');
    const end = +select(node).attr('data-center' + a + '2');
    const middle = (end - start) / 2 + start;
    const adjust = data.values[0][this.valueAccessor] >= data.values[1][this.valueAccessor] ? 0 : 1;
    return pos <= middle ? 0 + adjust : 1 - adjust;
  }

  findPosition(node, mouseEvent) {
    const svg = node.ownerSVGElement || node;
    let point = svg.createSVGPoint();
    point.x = mouseEvent.clientX;
    point.y = mouseEvent.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  generateId(d, i) {
    let mult =
      this.marker.type === 'dot'
        ? 1
        : this.marker.type === 'stroke'
        ? 2
        : (d.focus && this.focusMarker.key) || (!this.focusMarker.key && d.referenceIndex === 0)
        ? 1
        : 2;
    mult = d.focus ? this.focusMarker.sizeFromBar * mult : this.marker.sizeFromBar * mult;
    const opacity = this.marker.visible || d.focus ? 1 : 0;
    const fill =
      this.rawColors[d.referenceIndex][0] === '#'
        ? this.rawColors[d.referenceIndex].substring(1)
        : this.rawColors[d.referenceIndex];
    let barWidth = (i < 2 && this.clickHighlight.length
      ? this.clickStyle.strokeWidth
      : i < 4
      ? this.barStyle.width
      : this.hoverStyle.strokeWidth
    ).toString();
    barWidth = '' + barWidth;
    barWidth = barWidth.replace(/\D/g, 'n');
    const basicId = 'marker-' + this.chartID + i + this.marker.type + mult + fill + barWidth + opacity;

    return basicId;
  }

  render() {
    // everything between this comment and the third should eventually
    // be moved into componentWillUpdate (if the stenicl bug is fixed)
    this.init();
    if (this.shouldSetTagLevels) {
      this.setTagLevels();
      this.shouldSetTagLevels = false;
    }
    if (this.shouldValidate) {
      this.shouldValidateAccessibilityProps();
      this.shouldValidate = false;
    }
    if (this.shouldValidateLayout) {
      this.validateLayout();
    }
    if (this.shouldValidateDataLabelPlacement) {
      this.validateDataLabelPlacement();
      this.shouldValidateDataLabelPlacement = false;
    }
    if (this.shouldValidateSeriesLabelPlacement) {
      this.validateSeriesLabelPlacement();
      this.shouldValidateSeriesLabelPlacement = false;
    }
    if (this.shouldValidateDiffLabelPlacement) {
      this.validateDiffLabelPlacement();
      this.shouldValidateDiffLabelPlacement = false;
    }
    if (this.shouldValidateDataLabelAccessor) {
      this.validateDataLabelAccessor();
      this.shouldValidateDataLabelAccessor = false;
    }
    if (this.shouldUpdateLayout) {
      this.setLayoutData();
      this.shouldUpdateLayout = false;
    }
    if (this.shouldValidateInteractionKeys) {
      this.validateInteractionKeys();
      this.shouldValidateInteractionKeys = false;
    }
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateMarkerData) {
      this.prepareMarkerData();
      this.shouldUpdateMarkerData = false;
    }
    if (this.shouldUpdateSeriesData) {
      this.prepareSeriesData();
      this.shouldUpdateSeriesData = false;
    }
    if (this.shouldUpdateLegendData) {
      this.prepareLegendData();
      this.shouldUpdateLegendData = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldCheckValueAxis) {
      if (this.layout === 'horizontal') {
        this.shouldUpdateXAxis = true;
        this.shouldSetXAxisAccessibility = true;
        this.shouldUpdateXGrid = true;
      } else if (this.layout === 'vertical' || this.layoutOverride) {
        this.shouldUpdateYAxis = true;
        this.shouldSetYAxisAccessibility = true;
        this.shouldUpdateYGrid = true;
      }
      this.shouldCheckValueAxis = false;
    }
    if (this.shouldCheckLabelAxis) {
      if (this.layout === 'vertical' || this.layoutOverride) {
        this.shouldUpdateXAxis = true;
        this.shouldSetXAxisAccessibility = true;
        this.shouldUpdateXGrid = true;
      } else if (this.layout === 'horizontal') {
        this.shouldUpdateYAxis = true;
        this.shouldSetYAxisAccessibility = true;
        this.shouldUpdateYGrid = true;
      }
      this.shouldCheckLabelAxis = false;
    }
    if (this.shouldUpdateTableData) {
      this.setTableData();
      this.shouldUpdateTableData = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the stenicl bug is fixed)

    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <this.topLevel class="dumbbell-main-title vcl-main-title" data-testid="main-title">
            {this.mainTitle}
          </this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions dumbbell-sub-title vcl-sub-title" data-testid="sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div class="dumbbell-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <div class="visa-viz-d3-dumbbell-container" />
          <div class="dumbbell-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(DumbbellPlotDefaultValues);
    let i = 0;
    const exceptions = {
      wrapLabel: {
        exception: false
      },
      strokeWidth: {
        exception: 0
      },
      showDots: {
        exception: false
      },
      dotRadius: {
        exception: 0
      },
      hoverOpacity: {
        exception: 0
      },
      showTooltip: {
        exception: false
      },
      mainTitle: {
        exception: ''
      },
      subTitle: {
        exception: ''
      },
      showBaselineX: {
        exception: false
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : DumbbellPlotDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
