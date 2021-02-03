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
import { timeHour, timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import { scalePoint, scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
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
  ILegendType,
  ISeriesLabelType,
  ISecondaryLinesType
} from '@visa/charts-types';
import { ParallelPlotDefaultValues } from './parallel-plot-default-values';
import { easeCircleIn } from 'd3-ease';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';
import { v4 as uuid } from 'uuid';
const {
  getAccessibleStrokes,
  ensureTextContrast,
  createTextStrokeFilter,
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
  overrideTitleTooltip,
  placeDataLabels,
  resolveLines,
  scopeDataKeys,
  transitionEndAll,
  visaColors,
  validateAccessibilityProps
} = Utils;

@Component({
  tag: 'parallel-plot',
  styleUrl: 'parallel-plot.scss'
})
export class ParallelPlot {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = ParallelPlotDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = ParallelPlotDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = ParallelPlotDefaultValues.height;
  @Prop({ mutable: true }) width: number = ParallelPlotDefaultValues.width;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = ParallelPlotDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) margin: IBoxModelType = ParallelPlotDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = ParallelPlotDefaultValues.padding;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = ParallelPlotDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = ParallelPlotDefaultValues.valueAccessor;
  @Prop({ mutable: true }) seriesAccessor: string = ParallelPlotDefaultValues.seriesAccessor;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = ParallelPlotDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = ParallelPlotDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = ParallelPlotDefaultValues.wrapLabel;
  @Prop({ mutable: true }) showBaselineX: boolean = ParallelPlotDefaultValues.showBaselineX;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = ParallelPlotDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = ParallelPlotDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = ParallelPlotDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = ParallelPlotDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = ParallelPlotDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = ParallelPlotDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) strokeWidth: number = ParallelPlotDefaultValues.strokeWidth;
  @Prop({ mutable: true }) showDots: boolean = ParallelPlotDefaultValues.showDots;
  @Prop({ mutable: true }) dotRadius: number = ParallelPlotDefaultValues.dotRadius;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = ParallelPlotDefaultValues.dataLabel;
  @Prop({ mutable: true }) showTooltip: boolean = ParallelPlotDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = ParallelPlotDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = ParallelPlotDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = ParallelPlotDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = ParallelPlotDefaultValues.annotations;
  @Prop({ mutable: true }) seriesLabel: ISeriesLabelType = ParallelPlotDefaultValues.seriesLabel;

  // Calculation (6/7)
  @Prop() maxValueOverride: number;
  @Prop() minValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = ParallelPlotDefaultValues.referenceLines;
  @Prop({ mutable: true }) secondaryLines: ISecondaryLinesType = ParallelPlotDefaultValues.secondaryLines;

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = ParallelPlotDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = ParallelPlotDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  @Element()
  parallelChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  parallelLineG: any;
  dotG: any;
  yEnter: any;
  yUpdate: any;
  yExit: any;
  line: any;
  seriesLabelG: any;
  x: any;
  y: any;
  nest: any;
  map: any;
  interpolating: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  references: any;
  defaults: boolean;
  duration: number;
  legendG: any;
  tooltipG: any;
  labels: any;
  colorArr: any;
  rawColors: any;
  textColors: any;
  multiYScale: any;
  scalesUsed: any;
  yGroup: any;
  extent: any;
  seriesInteraction: any;
  updated: boolean = true;
  enterSize: number = 0;
  exitSize: number = 0;
  enterLines: any;
  exitLines: any;
  updateLines: any;
  enterDotWrappers: any;
  updateDotWrappers: any;
  exitDotWrappers: any;
  enterDots: any;
  updateDots: any;
  exitDots: any;
  enteringLabelGroups: any;
  exitingLabelGroups: any;
  updatingLabelGroups: any;
  enteringLabels: any;
  exitingLabels: any;
  updatingLabels: any;
  seriesLabelEnter: any;
  seriesLabelUpdate: any;
  seriesLabelExit: any;
  tableData: any;
  tableColumns: any;
  time = {
    timehour: timeHour,
    timeday: timeDay,
    timeweek: timeWeek,
    timemonth: timeMonth,
    timeyear: timeYear
  };
  chartID: string;
  innerInteractionKeys: any;
  labelDetails: any;
  seriesLabelCurrent: any;
  isRight: any;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldValidate: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetDimensions: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldSetColors: boolean = false;
  shouldUpdateLines: boolean = false;
  shouldUpdatePoints: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateBaseline: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSetSeriesLabelOpacity: boolean = false;
  shouldSetLegendCursor: boolean = false;
  shouldAddStrokeUnder: boolean = false;
  shouldValidateSeriesLabels: boolean = false;
  shouldUpdateSeriesLabels: boolean = false;
  shouldUpdateColors: boolean = false;
  shouldUpdateStrokeWidth: boolean = false;
  shouldUpdateInterpolationData: boolean = false;
  shouldSetScaleUsed: boolean = false;
  shouldUpdateDotRadius: boolean = false;
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
  shouldUpdateDashPatterns: boolean = false;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  strokes: any = {};
  b: string = ',';
  short: string = '2,2';
  med: string = '4,2';
  long: string = '8,2';
  dashPatterns: any = [
    '',
    this.long,
    this.long + this.b + this.med,
    this.short + this.b + this.long + this.b + this.long,
    this.short + this.b + this.short + this.b + this.long
  ];

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateData = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID;
    this.parallelChartEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateLegend = true;
    this.shouldAddStrokeUnder = true;
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
    this.shouldResetRoot = true;
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('seriesAccessor')
  seriesAccessorWatcher(_newVal, _oldVal) {
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateData = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldValidate = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
    this.shouldUpdateLabels = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateTableData = true;
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateStrokeWidth = true;
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGlobalSelections = true;
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    this.shouldUpdateXAxis = true;
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateXGrid = true;
    }
    this.shouldSetXAxisAccessibility = true;
  }

  @Watch('yAxis')
  yAxisWatcher(_newVal, _oldVal) {
    const newScaleVal = _newVal && _newVal.scales ? _newVal.scales : false;
    const oldScaleVal = _oldVal && _oldVal.scales ? _oldVal.scales : false;
    if (newScaleVal !== oldScaleVal) {
      this.shouldSetScaleUsed = true;
      this.shouldUpdateScales = true;
      this.shouldUpdateData = true;
      this.shouldUpdateInterpolationData = true;
      this.shouldUpdateLines = true;
      this.shouldUpdatePoints = true;
      this.shouldUpdateYGrid = true;
      this.shouldUpdateSeriesLabels = true;
      this.shouldUpdateLabels = true;
    }
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

  @Watch('showBaselineX')
  showBaselineXWatcher(_newVal, _oldVal) {
    this.shouldUpdateBaseline = true;
  }

  @Watch('colorPalette')
  paletteWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
  }

  @Watch('colors')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
    this.shouldSetColors = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
    this.shouldSetColors = true;
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

  @Watch('strokeWidth')
  strokeWidthWatcher(_newVal, _oldVal) {
    this.shouldUpdateStrokeWidth = true;
  }

  @Watch('showDots')
  showDotsWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('dotRadius')
  dotRadiusWatcher(_newVal, _oldVal) {
    this.shouldUpdateDotRadius = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
  }

  @Watch('dataLabel')
  dataLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldUpdateTableData = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldUpdateSeriesLabels = true;
    }
  }

  @Watch('seriesLabel')
  seriesLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldValidateSeriesLabels = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetSeriesLabelOpacity = true;
    }
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    // this.shouldDrawInteractionState = true;
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
    const newSmallValue = _newVal && _newVal.showSmallLabels ? _newVal.showSmallLabels : false;
    const oldSmallValue = _oldVal && _oldVal.showSmallLabels ? _oldVal.showSmallLabels : false;
    if (newSmallValue !== oldSmallValue) {
      this.shouldSetLabelOpacity = true;
    }
    const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    if (newStrokes !== oldStrokes) {
      this.shouldUpdateStrokeWidth = true;
      this.shouldSetColors = true;
      this.shouldDrawInteractionState = true;
    }
    const newTextures = _newVal && _newVal.hideTextures ? _newVal.hideTextures : false;
    const oldTextures = _oldVal && _oldVal.hideTextures ? _oldVal.hideTextures : false;
    if (newTextures !== oldTextures) {
      this.shouldUpdateDashPatterns = true;
      this.shouldUpdateLegend = true;
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

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('maxValueOverride')
  @Watch('minValueOverride')
  valueOverrideWatcher(_newVal, _oldVal) {
    this.shouldSetScaleUsed = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('secondaryLines')
  secondaryLinesWatcher(_newVal, _oldVal) {
    const newDataLabelVal = _newVal && _newVal.showDataLabel;
    const oldDataLabelVal = _oldVal && _oldVal.showDataLabel;
    const newSeriesLabelVal = _newVal && _newVal.showSeriesLabel;
    const oldSeriesLabelVal = _oldVal && _oldVal.showSeriesLabel;
    const newKeysVal = _newVal && _newVal.keys ? _newVal.keys : false;
    const oldKeysVal = _oldVal && _oldVal.keys ? _oldVal.keys : false;
    const newOpacityVal = _newVal && _newVal.opacity ? _newVal.opacity : 0;
    const oldOpacityVal = _oldVal && _oldVal.opacity ? _oldVal.opacity : 0;
    if (newKeysVal !== oldKeysVal) {
      this.shouldUpdateLines = true;
      this.shouldSetLabelOpacity = true;
      this.shouldSetSeriesLabelOpacity = true;
    }
    if (newDataLabelVal !== oldDataLabelVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newSeriesLabelVal !== oldSeriesLabelVal) {
      this.shouldUpdateLabels = true;
    }
    if (newOpacityVal !== oldOpacityVal) {
      this.shouldDrawInteractionState = true;
      this.shouldSetSeriesLabelOpacity = true;
    }
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
    this.shouldUpdateLegendInteractivity = true;
  }

  componentWillLoad() {
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = this.uniqueID || 'parallel-plot-' + uuid();
      this.parallelChartEl.id = this.chartID;
      this.setTagLevels();
      this.setDimensions();
      this.setScaleUsed();
      this.prepareScales();
      this.prepareData();
      this.updateInterpolationData();
      this.validateInteractionKeys();
      this.validateSeriesLabels();
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
      this.renderChartRootElemets();
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
      this.setGlobalSelections();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.enterYAxis();
      this.exitYAxis();
      this.drawYAxis();
      this.setYAxisAccessibility();
      this.enterChartLines();
      this.updateChartLines();
      this.exitChartLines();
      this.enterPoints();
      this.updatePoints();
      this.exitPoints();
      this.enterSeriesLabels();
      this.updateSeriesLabels();
      this.exitSeriesLabels();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.drawChartLines();
      this.drawPoints();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawSeriesLabels();
      this.drawLegendElements();
      this.drawDataLabels();
      this.addStrokeUnder();
      this.drawReferenceLines();
      this.setSelectedClass();
      this.updateInteractionState();
      this.setLabelOpacity();
      this.setSeriesLabelOpacity();
      this.updateCursor();
      this.bindInteractivity();
      this.setLegendCursor();
      this.bindLegendInteractivity();
      this.drawBaseline();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      hideNonessentialGroups(this.root.node(), this.dotG.node());
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
      if (this.shouldUpdateXGrid) {
        this.drawXGrid();
        this.shouldUpdateXGrid = false;
      }
      if (this.shouldUpdateYGrid) {
        this.drawYGrid();
        this.shouldUpdateYGrid = false;
      }
      if (this.shouldSetGlobalSelections) {
        this.setGlobalSelections();
        this.shouldSetGlobalSelections = false;
      }
      if (this.shouldEnterUpdateExit) {
        this.enterYAxis();
        this.exitYAxis();
        this.enterChartLines();
        this.updateChartLines();
        this.exitChartLines();
        this.enterPoints();
        this.updatePoints();
        this.exitPoints();
        this.enterSeriesLabels();
        this.updateSeriesLabels();
        this.exitSeriesLabels();
        this.enterDataLabels();
        this.updateDataLabels();
        this.exitDataLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldSetYAxisAccessibility) {
        this.setXAxisAccessibility();
        this.shouldSetYAxisAccessibility = false;
      }
      if (this.shouldUpdateXAxis) {
        this.drawXAxis();
        this.shouldUpdateXAxis = false;
      }
      if (this.shouldUpdateYAxis) {
        this.drawYAxis();
        this.shouldUpdateYAxis = false;
      }
      if (this.shouldSetYAxisAccessibility) {
        this.setYAxisAccessibility();
        this.shouldSetYAxisAccessibility = false;
      }
      if (this.shouldUpdateLines) {
        this.drawChartLines();
        this.shouldUpdateLines = false;
      }
      if (this.shouldUpdatePoints) {
        this.drawPoints();
        this.shouldUpdatePoints = false;
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
      if (this.shouldUpdateSeriesLabels) {
        this.drawSeriesLabels();
        this.shouldUpdateSeriesLabels = false;
      }
      if (this.shouldUpdateColors) {
        this.updateColors();
        this.shouldUpdateColors = false;
      }
      if (this.shouldUpdateLegend) {
        this.drawLegendElements();
        this.shouldUpdateLegend = false;
      }
      if (this.shouldUpdateLabels) {
        this.drawDataLabels();
        this.shouldUpdateLabels = false;
      }
      if (this.addStrokeUnder) {
        this.addStrokeUnder();
        this.shouldAddStrokeUnder = false;
      }
      if (this.shouldUpdateReferenceLines) {
        this.drawReferenceLines();
        this.shouldUpdateReferenceLines = false;
      }
      if (this.shouldUpdateStrokeWidth) {
        this.updateStrokeWidth();
        this.shouldUpdateStrokeWidth = false;
      }
      if (this.shouldUpdateDotRadius) {
        this.updateDotRadius();
        this.shouldUpdateDotRadius = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
      }
      if (this.shouldUpdateDashPatterns) {
        this.updateStrokePattern();
        this.shouldUpdateDashPatterns = false;
      }
      if (this.shouldSetLabelOpacity) {
        this.setLabelOpacity();
        this.shouldSetLabelOpacity = false;
      }
      if (this.shouldSetSeriesLabelOpacity) {
        this.setSeriesLabelOpacity();
        this.shouldSetSeriesLabelOpacity = false;
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

  setDimensions() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length ? this.interactionKeys : [this.seriesAccessor];

    this.seriesInteraction =
      this.innerInteractionKeys.length === 1 && this.innerInteractionKeys[0] === this.seriesAccessor;
  }

  setColors() {
    this.rawColors = this.colors ? convertVisaColor(this.colors) : getColors(this.colorPalette, this.nest.length);
    this.textColors = {};
    let adjustedColors = this.rawColors;
    this.strokes = {};
    if (!this.accessibility.hideStrokes) {
      adjustedColors = [];
    }
    this.rawColors.forEach(color => {
      if (!this.accessibility.hideStrokes) {
        const strokes = getAccessibleStrokes(color);
        const adjusted = strokes.length === 2 ? strokes[1] : strokes[0];
        this.strokes[color.toLowerCase()] = adjusted;
        adjustedColors.push(adjusted);
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
    this.colorArr = adjustedColors;
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'parallel-plot');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  prepareData() {
    this.multiYScale = {};

    this.nest = nest()
      .key(d => {
        if (!this.multiYScale[d[this.ordinalAccessor]]) {
          this.multiYScale[d[this.ordinalAccessor]] = {
            min: Infinity,
            max: 0
          };
        }
        if (this.multiYScale[d[this.ordinalAccessor]].min > d[this.valueAccessor]) {
          this.multiYScale[d[this.ordinalAccessor]].min = d[this.valueAccessor];
        }
        if (this.multiYScale[d[this.ordinalAccessor]].max < d[this.valueAccessor]) {
          this.multiYScale[d[this.ordinalAccessor]].max = d[this.valueAccessor];
        }
        return d[this.seriesAccessor];
      })
      .entries(this.data);

    this.map = nest()
      .key(d => d[this.seriesAccessor])
      .map(this.data);

    const keys = Object.keys(this.multiYScale);

    keys.forEach(key => {
      const scale = this.multiYScale[key];
      const rangePadding = this.innerPaddedHeight * 0.05;
      scale.y = scaleLinear()
        .domain([
          this.minValueOverride || this.minValueOverride === 0 ? this.minValueOverride : scale.min,
          this.maxValueOverride || this.maxValueOverride === 0 ? this.maxValueOverride : scale.max
        ])
        .range([this.innerPaddedHeight - rangePadding, 0 + rangePadding]);
      scale.ticks = [scale.y.invert(this.innerPaddedHeight), scale.y.invert(0)];
    });
  }

  updateInterpolationData() {
    if (this.interpolating) {
      let change = this.nest.length;
      this.nest.forEach(parent => {
        parent.interpolate = {};

        const left = this.interpolating.map.get(parent.key);
        const right = parent.values;

        if (!left) {
          parent.interpolate.start = right;
          parent.interpolate.end = right;
        } else {
          const resolved = resolveLines(left, right, this.ordinalAccessor);
          if (!resolved.length) {
            parent.interpolate.start = left;
            parent.interpolate.end = right;
            change--;
          } else {
            parent.interpolate.start = resolved[0];
            parent.interpolate.end = resolved[1];
          }
        }
      });
      if (!change && this.nest.length === this.interpolating.length) {
        this.interpolating = false;
      }
    }
  }

  prepareScales() {
    if (this.nest) {
      this.interpolating = this.nest;
      const oldXDomain = this.x.domain();
      const oldXRange = this.x.range();
      const oldYDomain = this.y.domain();
      const oldYRange = this.y.range();
      this.interpolating.scales = this.scalesUsed;
      this.interpolating.multiYScale = { ...this.multiYScale };
      this.interpolating.x = this.x.domain(oldXDomain).range(oldXRange);
      this.interpolating.y = scaleLinear()
        .domain(oldYDomain)
        .range(oldYRange);
      this.interpolating.line = line()
        .x(d => this.interpolating.x(d[this.ordinalAccessor]))
        .y(d => {
          if (this.interpolating.scales === 'individual') {
            return this.interpolating.multiYScale[d[this.ordinalAccessor]].y(d[this.valueAccessor]);
          }
          return this.interpolating.y(d[this.valueAccessor]);
        });
      this.interpolating.map = this.map;
    }

    this.extent = {};
    this.extent.minValue = min(this.data, d => parseFloat(d[this.valueAccessor]));
    this.extent.maxValue = max(this.data, d => parseFloat(d[this.valueAccessor]));
    // const extentPadding = Math.abs(this.extent.maxValue * 0.1 || this.extent.minValue * 0.1);
    let paddedMin = 0 + this.innerPaddedHeight * 0.05;
    let paddedMax = this.innerPaddedHeight - this.innerPaddedHeight * 0.05;

    if (this.yAxis.scales === 'preNormalized') {
      this.extent.minValue = 0;
      this.extent.maxValue = 1;
      paddedMin = 0;
      paddedMax = this.innerPaddedHeight;
    }

    this.extent.minValue =
      this.minValueOverride || this.minValueOverride === 0 ? this.minValueOverride : this.extent.minValue;
    this.extent.maxValue =
      this.maxValueOverride || this.maxValueOverride === 0 ? this.maxValueOverride : this.extent.maxValue;
    paddedMin = this.minValueOverride || this.minValueOverride === 0 ? this.minValueOverride : paddedMin;
    paddedMax = this.maxValueOverride || this.maxValueOverride === 0 ? this.maxValueOverride : paddedMax;
    this.y = scaleLinear()
      .domain([this.extent.minValue, this.extent.maxValue])
      .range([paddedMax, paddedMin]);

    // set xAxis scale : ordinal value
    this.x = scalePoint()
      .domain(this.data.map(d => d[this.ordinalAccessor]))
      .range([0, this.innerPaddedWidth]);

    this.line = line()
      .x(d => this.x(d[this.ordinalAccessor]))
      .y(d => {
        if (this.yAxis.scales === 'individual') {
          return this.multiYScale[d[this.ordinalAccessor]].y(d[this.valueAccessor]);
        }
        return this.y(d[this.valueAccessor]);
      });
  }

  validateSeriesLabels() {
    this.labelDetails = { ...this.seriesLabel };
    if (!this.labelDetails.placement) {
      this.labelDetails.placement = '';
    }
    if (!this.labelDetails.label || !this.labelDetails.label.length) {
      this.labelDetails.label = '';
    }

    this.isRight = this.labelDetails.placement.includes('right');
  }

  setScaleUsed() {
    this.scalesUsed = this.yAxis.scales;
  }

  renderRootElements() {
    this.svg = select(this.parallelChartEl)
      .select('.visa-viz-d3-parallel-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.gridG = this.rootG.append('g').attr('class', 'grid-group');
  }

  renderChartRootElemets() {
    this.yGroup = this.rootG.append('g').attr('class', 'y-scales-group');
    this.parallelLineG = this.rootG.append('g').attr('class', 'parallel-group parallel-line-group');
    this.dotG = this.rootG.append('g').attr('class', 'parallel-group');
    this.seriesLabelG = this.rootG.append('g').attr('class', 'parallel-series-wrapper');
    this.labels = this.rootG.append('g').attr('class', 'parallel-dataLabel-group');
    this.legendG = select(this.parallelChartEl)
      .select('.parallel-legend')
      .append('svg');

    this.tooltipG = select(this.parallelChartEl).select('.parallel-tooltip');

    this.setTooltipInitialStyle();
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

  setGlobalSelections() {
    const keys = Object.keys(this.multiYScale);
    const dataBoundToAxes = this.yGroup.selectAll('.y-wrapper').data(keys, d => d);
    this.yEnter = dataBoundToAxes.enter().append('g');
    this.yExit = dataBoundToAxes.exit();
    this.yUpdate = dataBoundToAxes.merge(this.yEnter);

    const dataBoundToLines = this.parallelLineG.selectAll('.parallel-plot').data(this.nest, d => d.key);
    this.enterLines = dataBoundToLines.enter().append('path');
    this.exitLines = dataBoundToLines.exit();
    this.updateLines = dataBoundToLines.merge(this.enterLines);
    this.enterSize = this.enterLines.size();

    const dataBoundToDotWrappers = this.dotG.selectAll('.parallel-dot-wrapper').data(this.nest, d => d.key);
    this.enterDotWrappers = dataBoundToDotWrappers.enter().append('g');
    this.exitDotWrappers = dataBoundToDotWrappers.exit();
    this.updateDotWrappers = dataBoundToDotWrappers.merge(this.enterDotWrappers);

    const dataBountToSeriesLabels = this.seriesLabelG.selectAll('.parallel-series-label').data(this.nest, d => d.key);
    this.seriesLabelEnter = dataBountToSeriesLabels.enter().append('text');
    this.seriesLabelExit = dataBountToSeriesLabels.exit();
    this.seriesLabelUpdate = dataBountToSeriesLabels.merge(this.seriesLabelEnter);

    const dataBoundToLabels = this.labels.selectAll('g').data(this.nest, d => d.key);
    this.enteringLabelGroups = dataBoundToLabels.enter().append('g');
    this.exitingLabelGroups = dataBoundToLabels.exit();
    this.updatingLabelGroups = dataBoundToLabels.merge(this.enteringLabelGroups);

    if (this.interpolating) {
      this.updateDotWrappers.selectAll('circle').remove();

      const dataBoundToDots = this.updateDotWrappers.selectAll('circle').data(d => d.interpolate.start);
      this.enterDots = dataBoundToDots.enter().append('circle');
      this.exitDots = dataBoundToDots.exit();
      this.updateDots = dataBoundToDots.merge(this.enterDots);

      this.updatingLabelGroups.selectAll('.parallel-dataLabel').remove();
      const dataBoundToLabelChildren = this.updatingLabelGroups
        .selectAll('.parallel-dataLabel')
        .data(d => d.interpolate.start);
      this.enteringLabels = dataBoundToLabelChildren.enter().append('text');
      this.updatingLabels = dataBoundToLabelChildren.merge(this.enteringLabels);
      //   // this.updatingLabels = this.updatingLabelGroups.selectAll('.line-dataLabel').data(d => d.interpolate.end);
    } else {
      const dataBoundToDots = this.updateDotWrappers.selectAll('circle').data(d => d.values);

      this.enterDots = dataBoundToDots.enter().append('circle');
      this.exitDots = dataBoundToDots.exit();
      this.updateDots = dataBoundToDots.merge(this.enterDots);

      this.enterSize = this.enterDots.size();
      this.exitSize = this.exitDots.size();

      const dataBoundToLabelChildren = this.updatingLabelGroups
        .selectAll('.parallel-dataLabel')
        .data(d => d.values, d => d[this.ordinalAccessor]);

      this.enteringLabels = dataBoundToLabelChildren.enter().append('text');
      this.exitingLabels = dataBoundToLabelChildren.exit();
      this.updatingLabels = dataBoundToLabelChildren.merge(this.enteringLabels);
    }
  }

  // draw axis line
  drawXAxis() {
    const bandWidth = (this.innerPaddedWidth / this.nest[0].values.length) * 0.7;
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      wrapLabel: this.wrapLabel ? bandWidth : '',
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: this.xAxis.label,
      padding: this.padding,
      hide: !this.xAxis.visible,
      hidePath: true
    });
  }

  enterYAxis() {
    this.yEnter
      .attr('class', 'y-wrapper')
      .attr('transform', d => 'translate(' + this.x(d) + ',0)')
      .attr('opacity', 0);
  }

  exitYAxis() {
    this.yExit
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .remove();
  }

  drawYAxis() {
    this.yUpdate
      .each((d, i, n) => {
        const ticks =
          this.yAxis.scales === 'individual'
            ? this.multiYScale[d].ticks
            : !this.yAxis.onlyTickExtents
            ? this.yAxis.onlyTickExtents
            : [this.extent.minValue, this.extent.maxValue];
        const domain = this.multiYScale[d].y.domain();
        const hideMe =
          domain[0] === domain[1] ? true : i === 0 || this.yAxis.scales === 'individual' ? !this.yAxis.visible : true;
        drawAxis({
          root: select(n[i]),
          height: this.innerPaddedHeight,
          width: this.innerPaddedWidth,
          axisScale: this.yAxis.scales === 'individual' ? this.multiYScale[d].y : this.y,
          left: true,
          wrapLabel: this.wrapLabel ? this.padding.left : '',
          format: this.yAxis.format,
          tickInterval: ticks ? 1 : this.yAxis.tickInterval,
          label: this.yAxis.scales === 'individual' || hideMe ? '' : this.yAxis.label,
          padding: this.padding,
          hide: hideMe,
          hidePath: true,
          ticks
        });
      })
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('transform', d => 'translate(' + this.x(d) + ',0)')
      .attr('opacity', 1);
  }

  setXAxisAccessibility() {
    setAccessXAxis({
      rootEle: this.parallelChartEl,
      hasXAxis: this.xAxis ? this.xAxis.visible : false,
      xAxis: this.x ? this.x : false, // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    setAccessYAxis({
      rootEle: this.parallelChartEl,
      hasYAxis: this.yAxis ? this.yAxis.visible : false,
      yAxis: this.y ? this.y : false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: this.yAxis.label ? this.yAxis.label : '', // this is optional for some charts, if hasXAxis is always false
      xAxisLabel: this.xAxis.label ? this.xAxis.label : '' // parallel uses this to label all the y axes
    });
  }

  drawBaseline() {
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      padding: this.padding,
      markOffset: this.y(0),
      hide: !this.showBaselineX
    });
  }
  // dashed line grid for chart
  drawXGrid() {
    drawGrid(this.gridG, this.innerPaddedHeight, this.innerPaddedWidth, this.x, false, false, this.xAxis.tickInterval);
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

  // lines based on data
  enterChartLines() {
    this.enterLines.interrupt();

    this.enterLines.attr('class', 'parallel-plot entering').attr('d', d => this.line(d.values));

    this.enterLines
      .attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null)
      .on(
        'click',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onHoverHandler(d.values[0]);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('stroke-dasharray', (d, i, n) => {
        d.linelength = n[i].getTotalLength();
        return d.linelength + ' ' + d.linelength;
      })
      .attr('stroke', this.handleLineStroke)
      .attr('fill', 'none')
      .attr('stroke-width', 0.1);
  }

  updateChartLines() {
    this.updateLines.interrupt();

    this.updateLines
      .transition()
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('stroke-dashoffset', 0)
      .attr('stroke-width', d => this.calculateStrokeWidth(d, true))
      .call(transitionEndAll, () => {
        this.updateLines.attr('stroke-dasharray', this.handleStrokeDasharray);
      });

    this.updateLines
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d => {
        const lineOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : 1;
        if (!this.seriesInteraction) {
          return lineOpacity;
        } else if (this.secondaryLines.keys.includes(d.key)) {
          return checkInteraction(
            d.values[0],
            this.secondaryLines.opacity,
            Math.min(this.secondaryLines.opacity, this.hoverOpacity),
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return checkInteraction(
            d.values[0], // use first data point of each line to decide interaction highlight
            lineOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        }
      });
  }

  exitChartLines() {
    this.exitLines.interrupt();

    this.exitLines
      .attr('stroke-dasharray', (d, i, n) => {
        d.linelength = n[i].getTotalLength();
        return d.linelength + ' ' + d.linelength;
      })
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .attr('stroke-dashoffset', d => d.linelength)
      .attr('stroke-width', 0.1)
      .remove();
  }

  drawChartLines() {
    if (this.interpolating) {
      this.updateLines.attr('d', (d, i, n) => {
        if (select(n[i]).classed('entering')) {
          return this.line(d.values);
        }
        return this.interpolating.line(d.interpolate.start);
      });
    }

    this.updateLines
      .attr('stroke-width', d => this.calculateStrokeWidth(d, true))
      .attr('stroke-dashoffset', d => d.linelength)
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('d', d => (this.interpolating ? this.line(d.interpolate.end) : this.line(d.values)))
      .call(transitionEndAll, () => {
        this.updateLines
          .classed('entering', false)
          .attr('d', d => this.line(d.values))
          .attr('stroke-dasharray', this.handleStrokeDasharray);
      });
  }

  dynamicY = d => {
    if (this.yAxis.scales === 'individual') {
      return this.multiYScale[d[this.ordinalAccessor]].y(d[this.valueAccessor]);
    }
    return this.y(d[this.valueAccessor]);
  };

  interpolateDynamicY = d => {
    if (this.yAxis.scales === 'individual') {
      return this.interpolating.multiYScale[d[this.ordinalAccessor]].y(d[this.valueAccessor]);
    }
    return this.interpolating.y(d[this.valueAccessor]);
  };

  enterPoints() {
    this.enterDots.interrupt();

    this.enterDotWrappers
      .attr('class', 'parallel-dot-wrapper')
      .attr('opacity', 0)
      .attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0])
      .each((_, i, n) => {
        // we bind accessible interactivity and semantics here (role, tabindex, etc)
        initializeGroupAccess(n[i]);
      });

    this.enterDots
      .each((_d, i, n) => {
        initializeGeometryAccess({
          node: n[i]
        });
      })
      .attr('stroke', this.handleDotStroke)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    if (this.interpolating) {
      this.enterDots
        .attr('cx', d => this.interpolating.x(d[this.ordinalAccessor]))
        .attr('cy', this.interpolateDynamicY)
        .attr('r', d =>
          d.enter
            ? 0
            : checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.clickStyle && this.clickStyle.strokeWidth ? parseFloat('' + this.clickStyle.strokeWidth) / 2 : 1)
            : checkHovered(d, this.hoverHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.hoverStyle && this.hoverStyle.strokeWidth ? parseFloat('' + this.hoverStyle.strokeWidth) / 2 : 1)
            : this.secondaryLines.keys.includes(d[this.seriesAccessor])
            ? this.dotRadius + 0.5
            : this.dotRadius + parseFloat('' + this.strokeWidth) / 2
        )
        .attr('stroke-width', d => this.calculateStrokeWidth(d));

      this.enterDotWrappers
        .selectAll('circle')
        .attr('r', 0)
        .attr('cx', d => this.x(d[this.ordinalAccessor]))
        .attr('cy', this.dynamicY)
        .attr('opacity', 0);
    }
    this.updateDotWrappers.order();
    this.updateDots.order();
  }

  updatePoints() {
    // this.updateDotWrappers.interrupt();
    this.updateDots.interrupt();
    const dotOpacity = this.showDots ? 1 : 0;

    this.updateDots.attr('tabindex', (_, index) => (index === 0 ? '0' : '-1'));

    this.updateDotWrappers.attr('opacity', d => {
      const lineDotOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : dotOpacity;
      return lineDotOpacity;
    });

    if (this.interpolating) {
      this.updateDots.attr('opacity', d => {
        this.exitSize += d.exit ? 1 : 0;
        this.enterSize += d.enter ? 1 : 0;
        return d.enter ? 0 : 1;
      });
      this.updateDots = this.updateDotWrappers
        .selectAll('circle')
        .data(d => d.interpolate.end)
        .classed('exiting', d => d.exit);

      this.enterDotWrappers.selectAll('circle').each(d => {
        d.enterWholeGroup = true;
      });

      this.updateDots
        .transition('opacity')
        .ease(easeCircleIn)
        .duration(d => {
          if (d.enterWholeGroup) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((d, i, n) => {
          if (d.enterWholeGroup) {
            return this.duration * 0.75 * (i / (n.length - 1));
          }
          return 0;
        })
        .attr('opacity', d => {
          return checkInteraction(
            d,
            dotOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        });
    } else {
      this.updateDots
        .transition('opacity')
        .ease(easeCircleIn)
        .duration(this.duration)
        .attr('opacity', d => {
          return checkInteraction(
            d,
            dotOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        });
    }
  }

  exitPoints() {
    this.exitDots.interrupt();

    this.exitDots
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .attr('r', 0);

    this.exitDotWrappers
      .selectAll('circle')
      .each(d => {
        d.exitWholeGroup = true;
      })
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .delay((_, i, n) => {
        return this.duration - this.duration * (i / (n.length - 1));
      })
      .attr('opacity', 0)
      .attr('r', 0);

    // this new transtition ensures that the chart counts and all labels
    // correctly reflect the newest information
    this.updateDots
      .transition('accessibilityAfterExit')
      .duration(this.duration / 2)
      .delay((_, i, n) => {
        return this.duration - this.duration * (i / (n.length - 1));
      })
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exitDots.remove();
        this.exitDotWrappers.remove();
        this.svg.selectAll('.exiting').remove();
        // updateDots/labels will keep references to the removed elements unless we reassign
        this.updateDots = this.updateDotWrappers.selectAll('circle');
        this.updatingLabels = this.updatingLabelGroups.selectAll('.parallel-dataLabel');
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

  // draw dots
  drawPoints() {
    let updateTransition;
    if (this.interpolating) {
      updateTransition = this.updateDots
        .transition('update')
        .ease(easeCircleIn)
        .duration(d => {
          if (d.enterWholeGroup) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((d, i, n) => {
          if (d.enterWholeGroup) {
            return this.duration * 0.75 * (i / (n.length - 1));
          }
          return 0;
        })
        .attr('r', d =>
          d.exit
            ? 0
            : checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.clickStyle && this.clickStyle.strokeWidth ? parseFloat('' + this.clickStyle.strokeWidth) / 2 : 1)
            : checkHovered(d, this.hoverHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.hoverStyle && this.hoverStyle.strokeWidth ? parseFloat('' + this.hoverStyle.strokeWidth) / 2 : 1)
            : this.secondaryLines.keys.includes(d[this.seriesAccessor])
            ? this.dotRadius + 0.5
            : this.dotRadius + parseFloat('' + this.strokeWidth) / 2
        )
        .attr('stroke-width', d => this.calculateStrokeWidth(d));
    } else {
      updateTransition = this.updateDots
        .attr('r', d =>
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.clickStyle && this.clickStyle.strokeWidth ? parseFloat('' + this.clickStyle.strokeWidth) / 2 : 1)
            : checkHovered(d, this.hoverHighlight, this.innerInteractionKeys)
            ? this.dotRadius +
              (this.hoverStyle && this.hoverStyle.strokeWidth ? parseFloat('' + this.hoverStyle.strokeWidth) / 2 : 1)
            : this.secondaryLines.keys.includes(d[this.seriesAccessor])
            ? this.dotRadius + 0.5
            : this.dotRadius + parseFloat('' + this.strokeWidth) / 2
        )
        .attr('stroke-width', d => this.calculateStrokeWidth(d))
        .transition('update')
        .ease(easeCircleIn)
        .duration(this.duration);
    }
    this.updateDots.attr('stroke', this.handleDotStroke);
    updateTransition
      .attr('cx', d => this.x(d[this.ordinalAccessor]))
      .attr('cy', this.dynamicY)
      .call(transitionEndAll, () => {
        this.updateDots.each(d => {
          d.enterWholeGroup = false;
          d.enter = false;
        });
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
      });
  }

  enterSeriesLabels() {
    this.seriesLabelEnter.interrupt();

    this.seriesLabelEnter
      .attr('class', 'parallel-series-label')
      .attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null)
      .on(
        'click',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onSeriesHoverHandler(d.values[0]);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('fill', this.handleSeriesTextFill)
      .attr('x', this.isRight ? this.innerPaddedWidth : 0)
      .attr('y', d => {
        if (this.yAxis.scales === 'individual') {
          return this.isRight
            ? this.multiYScale[d.values[d.values.length - 1][this.ordinalAccessor]].y(
                d.values[d.values.length - 1][this.valueAccessor]
              )
            : this.multiYScale[d.values[0][this.ordinalAccessor]].y(d.values[0][this.valueAccessor]);
        }
        return this.isRight
          ? this.y(d.values[d.values.length - 1][this.valueAccessor])
          : this.y(d.values[0][this.valueAccessor]);
      })
      .attr('dx', this.isRight ? '0.3em' : '-0.3em')
      .attr('dy', this.dataLabel && this.dataLabel.placement === 'top-right' ? '0.9em' : '-0.1em')
      .attr('opacity', 0);
  }

  updateSeriesLabels() {
    this.seriesLabelUpdate.interrupt();

    this.seriesLabelUpdate
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d => {
        const seriesLabelOpacity = !this.seriesLabel.visible
          ? 0
          : this.secondaryLines.keys.includes(d.key)
          ? this.secondaryLines.opacity
          : 1;
        // check if innerInteractionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
        if (!this.seriesInteraction) {
          return seriesLabelOpacity;
        } else if (this.secondaryLines.keys.includes(d.key)) {
          return checkInteraction(
            d.values[0],
            seriesLabelOpacity,
            Math.min(this.secondaryLines.opacity, this.hoverOpacity),
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return checkInteraction(
            d.values[0],
            seriesLabelOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        }
      });
  }

  exitSeriesLabels() {
    this.seriesLabelExit.interrupt();

    this.seriesLabelExit
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  // draw series label
  drawSeriesLabels() {
    this.seriesLabelUpdate
      .attr('fill', this.handleSeriesTextFill)
      .text((d, i) =>
        this.secondaryLines.keys.includes(d.key) && !this.secondaryLines.showSeriesLabel
          ? ''
          : this.labelDetails.label
          ? this.labelDetails.label[i]
          : d.key
      )
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('text-anchor', this.isRight ? 'start' : 'end')
      .attr('x', this.isRight ? this.innerPaddedWidth : 0)
      .attr('y', d => {
        if (this.yAxis.scales === 'individual') {
          return this.isRight
            ? this.multiYScale[d.values[d.values.length - 1][this.ordinalAccessor]].y(
                d.values[d.values.length - 1][this.valueAccessor]
              )
            : this.multiYScale[d.values[0][this.ordinalAccessor]].y(d.values[0][this.valueAccessor]);
        }
        return this.isRight
          ? this.y(d.values[d.values.length - 1][this.valueAccessor])
          : this.y(d.values[0][this.valueAccessor]);
      })
      .attr('dx', this.isRight ? '0.3em' : '-0.3em')
      .attr('dy', this.dataLabel && this.dataLabel.placement === 'top-right' ? '0.9em' : '-0.1em');
  }

  enterDataLabels() {
    this.enteringLabels.interrupt();

    this.enteringLabelGroups
      .attr('class', 'parallel-label-wrapper')
      .attr('opacity', 0)
      .attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0]);

    this.enteringLabels
      .attr('opacity', 0)
      .attr('fill', this.handleTextFill)
      .attr('class', 'parallel-dataLabel')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    if (this.interpolating) {
      const childrenEnter = this.enteringLabels.attr('class', 'parallel-dataLabel');

      placeDataLabels({
        root: childrenEnter,
        xScale: this.interpolating.x,
        yScale: this.interpolateDynamicY,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'parallel'
      });

      this.updatingLabels.attr('opacity', d => (d.enter ? 0 : 1));

      const fullEnter = this.enteringLabelGroups.selectAll('.parallel-dataLabel').attr('opacity', 0);

      placeDataLabels({
        root: fullEnter,
        xScale: this.x,
        yScale: this.dynamicY,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'parallel'
      });
    } else {
      const childrenEnter = this.enteringLabels.attr('opacity', 0).attr('class', 'parallel-dataLabel');

      placeDataLabels({
        root: childrenEnter,
        xScale: this.x,
        yScale: this.dynamicY,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'parallel'
      });
    }
  }

  updateDataLabels() {
    this.updatingLabelGroups.interrupt();

    this.updatingLabelGroups.attr('opacity', d => {
      const labelOpacity = !this.dataLabel.visible
        ? 0
        : this.secondaryLines.keys.includes(d.key) && this.secondaryLines.showDataLabel
        ? this.secondaryLines.opacity
        : this.secondaryLines.keys.includes(d.key) && !this.secondaryLines.showDataLabel
        ? 0
        : 1;
      return labelOpacity;
    });

    if (this.interpolating) {
      this.updatingLabels = this.updatingLabelGroups
        .selectAll('.parallel-dataLabel')
        .data(d => d.interpolate.end)
        .classed('exiting', d => d.exit);

      this.enteringLabelGroups.each(d => (d.enterWholeGroup = true));

      this.updatingLabels
        .transition('opacity')
        .ease(easeCircleIn)
        .duration(d => {
          if (d.enterWholeGroup) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((d, i, n) => {
          if (d.enterWholeGroup) {
            return this.duration * 0.75 * (i / (n.length - 1));
          }
          return 0;
        })
        .attr('opacity', d => {
          return d.exit
            ? 0
            : checkInteraction(
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
    } else {
      this.updatingLabels.attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys) <
        1
          ? 0
          : 1
      );
    }
  }

  exitDataLabels() {
    this.exitingLabels.interrupt();

    this.exitingLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();

    this.exitingLabelGroups
      .selectAll('.parallel-dataLabel')
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .delay((_, i, n) => {
        return this.duration - this.duration * (i / (n.length - 1));
      })
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitingLabelGroups.remove();
      });
  }

  drawDataLabels() {
    let updateChildren = this.updatingLabels.text(d => {
      return formatDataLabel(d, this.dataLabel.labelAccessor, this.dataLabel.format);
    });
    if (this.interpolating) {
      updateChildren = this.updatingLabels
        .transition('update')
        .ease(easeCircleIn)
        .duration(d => {
          if (d.enterWholeGroup) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((d, i, n) => {
          if (d.enterWholeGroup) {
            return this.duration * 0.75 * (i / (n.length - 1));
          }
          return 0;
        });
    } else {
      updateChildren = this.updatingLabels
        .transition('update')
        .ease(easeCircleIn)
        .duration(this.duration);
    }

    placeDataLabels({
      root: updateChildren,
      xScale: this.x,
      yScale: this.dynamicY,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.dataLabel.placement,
      chartType: 'parallel'
    });
  }

  updateInteractionState() {
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.updateLines.interrupt('opacity');

    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    this.updateLines.attr('opacity', d => {
      const lineOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : 1;
      if (!this.seriesInteraction) {
        return lineOpacity;
      } else if (this.secondaryLines.keys.includes(d.key)) {
        return checkInteraction(
          d.values[0],
          this.secondaryLines.opacity,
          Math.min(this.secondaryLines.opacity, this.hoverOpacity),
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      } else {
        return checkInteraction(
          d.values[0], // use first data point of each line to decide interaction highlight
          lineOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      }
    });

    const dotOpacity = this.showDots ? 1 : 0;
    this.updateDotWrappers.attr('opacity', d => {
      const lineDotOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : dotOpacity;
      return lineDotOpacity;
    });

    this.updateDots.each((d, i, n) => {
      if (!d.enter && !d.enterWholeGroup && !d.exit && !d.exitWholeGroup) {
        select(n[i]).attr('opacity', () => {
          return checkInteraction(
            d,
            dotOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        });
      }
    });

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

  setSeriesLabelOpacity() {
    this.seriesLabelUpdate.each((d, i, n) => {
      const me = select(n[i]);
      if (!me.classed('entering')) {
        me.attr('opacity', () => {
          const seriesLabelOpacity =
            (!this.seriesLabel.visible
              ? 0
              : this.secondaryLines.keys.includes(d.key)
              ? this.secondaryLines.opacity
              : 1) < 1
              ? 0
              : 1;
          // check if innerInteractionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
          if (!this.seriesInteraction) {
            return seriesLabelOpacity;
          } else if (this.secondaryLines.keys.includes(d.key)) {
            return checkInteraction(
              d.values[0],
              seriesLabelOpacity,
              Math.min(this.secondaryLines.opacity, this.hoverOpacity),
              this.hoverHighlight,
              this.clickHighlight,
              this.innerInteractionKeys
            ) < 1
              ? 0
              : 1;
          } else {
            return checkInteraction(
              d.values[0],
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
    });
  }

  setLabelOpacity() {
    this.updatingLabelGroups.attr('opacity', d => {
      return (!this.dataLabel.visible
        ? 0
        : this.secondaryLines.keys.includes(d.key) && this.secondaryLines.showDataLabel
        ? this.secondaryLines.opacity
        : this.secondaryLines.keys.includes(d.key) && !this.secondaryLines.showDataLabel
        ? 0
        : 1) < 1
        ? 0
        : 1;
    });
    this.updatingLabels.each((d, i, n) => {
      if (!d.enter && !d.enterWholeGroup && !d.exit && !d.exitWholeGroup) {
        select(n[i]).attr('opacity', () =>
          checkInteraction(
            d,
            1,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          ) < 1
            ? 0
            : 1
        );
      }
    });
  }

  bindInteractivity() {
    this.updateLines
      .on(
        'click',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onHoverHandler(d.values[0]);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updateDots
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.seriesLabelUpdate
      .on(
        'click',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onSeriesHoverHandler(d.values[0]);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updatingLabels
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  addStrokeUnder() {
    const filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.labels.attr('filter', filter);
    this.seriesLabelG.attr('filter', filter);
  }

  handleDotStroke = (d, i, n) => {
    if (!this.accessibility.hideStrokes) {
      const clicked =
        this.clickHighlight &&
        this.clickHighlight.length > 0 &&
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
      const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
      const baseColor = select(n[i].parentNode).attr('fill');
      const color =
        clicked && this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : clicked
          ? baseColor
          : hovered && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : baseColor;
      select(n[i]).attr('stroke-width', this.calculateStrokeWidth(d));
      select(n[i]).attr('fill', color);
      return this.strokes[color.toLowerCase()];
    }
    return null;
  };

  handleLineStroke = (data, i) => {
    const baseColor = this.colorArr[i] || this.colorArr[0];
    const d = data.values[0];
    const clicked = checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const hovered = checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    return this.seriesInteraction
      ? clicked && this.clickStyle.color
        ? this.strokes[(visaColors[this.clickStyle.color] || this.clickStyle.color).toLowerCase()]
        : clicked
        ? baseColor
        : hovered && this.hoverStyle.color
        ? this.strokes[(visaColors[this.hoverStyle.color] || this.hoverStyle.color).toLowerCase()]
        : baseColor
      : baseColor;
  };

  handleSeriesTextFill = (data, i) => {
    const baseColor = this.rawColors[i] || this.rawColors[0];
    const d = data.values[0];
    const clicked = checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const hovered = checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    const color = this.seriesInteraction
      ? clicked && this.clickStyle.color
        ? visaColors[this.clickStyle.color] || this.clickStyle.color
        : clicked
        ? baseColor
        : hovered && this.hoverStyle.color
        ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
        : baseColor
      : baseColor;
    return this.textColors[color.toLowerCase()];
  };

  handleTextFill = (d, i, n) => {
    const clicked =
      this.clickHighlight &&
      this.clickHighlight.length > 0 &&
      checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    const baseColor = select(n[i].parentNode).attr('fill');
    const color =
      clicked && this.clickStyle.color
        ? visaColors[this.clickStyle.color] || this.clickStyle.color
        : clicked
        ? baseColor
        : hovered && this.hoverStyle.color
        ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
        : baseColor;
    return this.textColors[color.toLowerCase()];
  };

  updateColors() {
    this.updateDotWrappers.attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0]);
    this.updateDots.attr('stroke', this.handleDotStroke);
    this.updateLines.attr('stroke', this.handleLineStroke);
    this.seriesLabelUpdate.attr('fill', this.handleSeriesTextFill);
    this.updatingLabelGroups.attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0]);
    this.updatingLabels.attr('fill', this.handleTextFill);
  }

  updateCursor() {
    this.updateLines.attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null);
    this.updateDots.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.seriesLabelUpdate.attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  drawReferenceLines() {
    if (!this.references) {
      this.references = this.rootG.append('g').attr('class', 'parallel-reference-line-group');
    }

    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', '.parallel-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines
      // .attr('id', (_, i) => 'reference-line-' + i)
      .attr('class', 'line-reference-line')
      .attr('opacity', 0);

    const enterLabels = enterReferences.append('text');

    enterLabels
      // .attr('id', (_, i) => 'reference-line-' + i + '-label')
      .attr('class', 'parallel-reference-line-label')
      .attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.parallel-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeLabels = mergeReferences
      .selectAll('.parallel-reference-line-label')
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

    mergeLines
      .style('stroke', visaColors[this.referenceStyle.color] || this.referenceStyle.color)
      .style('stroke-width', this.referenceStyle.strokeWidth)
      .attr('stroke-dasharray', this.referenceStyle.dashed ? this.referenceStyle.dashed : '')
      .attr('opacity', this.referenceStyle.opacity);

    mergeLabels.style('fill', visaColors[this.referenceStyle.color] || this.referenceStyle.color).attr('opacity', 1);
  }

  updateStrokeWidth() {
    this.updateLines.attr('stroke-width', d => this.calculateStrokeWidth(d, true));
    this.updateDots.attr('stroke', this.handleDotStroke);
  }

  calculateStrokeWidth = (data, useChildData?) => {
    const d = !useChildData ? data : data.values[0];
    return !useChildData || this.seriesInteraction
      ? checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
        ? this.clickStyle.strokeWidth || this.strokeWidth
        : checkHovered(d, this.hoverHighlight, this.innerInteractionKeys)
        ? this.hoverStyle.strokeWidth || this.strokeWidth
        : !this.secondaryLines.keys.includes(d[this.seriesAccessor])
        ? this.strokeWidth
        : 1
      : !this.secondaryLines.keys.includes(d[this.seriesAccessor])
      ? this.strokeWidth
      : 1;
  };

  updateStrokePattern() {
    this.updateLines.attr('stroke-dasharray', this.handleStrokeDasharray);
  }

  handleStrokeDasharray = (d, i) => {
    return this.secondaryLines.keys.includes(d.key)
      ? this.short
      : !this.accessibility.hideTextures
      ? this.dashPatterns[i]
      : '';
  };

  updateDotRadius() {
    this.updateDots
      .each((d, i, n) => {
        const me = select(n[i]);
        if (!d.enter && !d.enterWholeGroup && !me.classed('entering') && !d.exit) {
          me.attr('r', () =>
            checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
              ? this.dotRadius +
                (this.clickStyle && this.clickStyle.strokeWidth ? parseFloat('' + this.clickStyle.strokeWidth) / 2 : 1)
              : checkHovered(d, this.hoverHighlight, this.innerInteractionKeys)
              ? this.dotRadius +
                (this.hoverStyle && this.hoverStyle.strokeWidth ? parseFloat('' + this.hoverStyle.strokeWidth) / 2 : 1)
              : this.secondaryLines.keys.includes(d[this.seriesAccessor])
              ? this.dotRadius + 0.5
              : this.dotRadius + parseFloat('' + this.strokeWidth) / 2
          );
        }
      })
      .attr('stroke', this.handleDotStroke);
  }

  setSelectedClass() {
    this.updateDots.classed('highlight', (d, i, n) => {
      let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
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
      xAccessor: this.ordinalAccessor,
      yScale: this.y,
      yAccessor: this.valueAccessor
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.parallelChartEl, this.annotations);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      rootEle: this.parallelChartEl,
      geomType: 'point',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'parallel-plot',
      uniqueID: this.chartID,
      groupName: 'line',
      highestHeadingLevel: this.highestHeadingLevel,
      redraw: this.shouldRedrawWrapper
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    // this sets the accessibility features of the root SVG element
    setRootSVGAccess({
      node: this.svg.node(),
      chartTag: 'parallel-plot',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'point',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'parallel-plot'),
      groupAccessor: this.seriesAccessor,
      groupName: 'line'
    });
  }

  setGeometryAccessibilityAttributes() {
    // this makes sure every geom element has correct event handlers + semantics (role, tabindex, etc)
    this.updateDots.each((_d, i, n) => {
      initializeGeometryAccess({
        node: n[i]
      });
    });
  }

  setGeometryAriaLabels() {
    // this adds an ARIA label to each geom (a description read by screen readers)
    const keys = scopeDataKeys(this, chartAccessors, 'parallel-plot');
    this.updateDots.each((_d, i, n) => {
      setGeometryAccessLabel({
        node: n[i],
        geomType: 'point',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        groupName: 'line',
        uniqueID: this.chartID
      });
    });
  }

  setGroupAccessibilityLabel() {
    // this sets an ARIA label on all the g elements in the chart
    this.updateDotWrappers.each((_, i, n) => {
      setGroupAccessLabel({
        node: n[i],
        geomType: 'point',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        groupName: 'line',
        isSubgroup: true,
        groupAccessor: this.seriesAccessor,
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.parallelChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.parallelChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.parallelChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.parallelChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.parallelChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.parallelChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.parallelChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and gorup counts, etc)
    setAccessChartCounts({
      rootEle: this.parallelChartEl,
      parentGNode: this.dotG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'parallel-plot',
      geomType: 'point',
      groupName: 'line'
      // recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.parallelChartEl, this.accessibility.structureNotes);
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
    this.interpolating = false;
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
    if (this.showTooltip && d[this.ordinalAccessor]) {
      this.eventsTooltip({ data: d, evt: event, isToShow: true });
    }
  }

  onSeriesHoverHandler(d) {
    this.hoverFunc.emit(d);
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
      chartType: 'parallel'
    });
  }

  bindLegendInteractivity() {
    select(this.parallelChartEl)
      .selectAll('.legend')
      .on(
        'click',
        !this.suppressEvents && this.seriesInteraction && this.legend.interactive
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.seriesInteraction && this.legend.interactive
          ? d => {
              if (d.values) {
                this.hoverFunc.emit(d.values[0]);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents && this.legend.interactive ? () => this.onMouseOutHandler() : null);
  }

  setLegendCursor() {
    select(this.parallelChartEl)
      .selectAll('.legend')
      .style('cursor', !this.suppressEvents && this.legend.interactive && this.seriesInteraction ? this.cursor : null);
  }

  drawLegendElements() {
    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.top + 20,
      colorArr: this.colorArr,
      dashPatterns: !this.accessibility.hideTextures ? this.dashPatterns : null,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: 'parallel',
      secondary: this.secondaryLines.keys,
      fontSize: 16,
      data: this.nest,
      label: this.legend.labels,
      hide: !(this.legend.visible || !this.legend),
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.seriesAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.hoverStyle,
      clickStyle: this.clickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

  render() {
    // everything between this comment and the third should eventually
    // be moved into componentWillUpdate (if the stenicl bug is fixed)
    this.init();
    if (this.shouldSetTagLevels) {
      this.setTagLevels();
      this.shouldSetTagLevels = false;
    }
    if (this.shouldSetDimensions) {
      this.setDimensions();
      this.shouldSetDimensions = false;
    }
    if (this.shouldSetScaleUsed) {
      this.setScaleUsed();
      this.shouldSetScaleUsed = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateInterpolationData) {
      this.updateInterpolationData();
      this.shouldUpdateInterpolationData = false;
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
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    if (this.shouldValidateSeriesLabels) {
      this.validateSeriesLabels();
      this.shouldValidateSeriesLabels = false;
    }
    // // Everything between this comment and the first should eventually
    // // be moved into componentWillUpdate (if the stenicl bug is fixed)

    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <this.topLevel data-testid="main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions" data-testid="sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div class="parallel-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <div class="visa-viz-d3-parallel-container" />
          <div class="parallel-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(ParallelPlotDefaultValues);
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
      hoverOpacity: {
        exception: 0
      },
      dotRadius: {
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
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : ParallelPlotDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
