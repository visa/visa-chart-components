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
import { timeMillisecond, timeSecond, timeMinute, timeHour, timeDay, timeWeek, timeMonth, timeYear } from 'd3-time';
import { scalePoint, scaleLinear, scaleTime } from 'd3-scale';
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
import { LineChartDefaultValues } from './line-chart-default-values';
import { easeCircleIn } from 'd3-ease';
import 'd3-transition';
import { v4 as uuid } from 'uuid';
import Utils from '@visa/visa-charts-utils';
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
  setAccessStructure,
  setAccessChartCounts,
  setAccessXAxis,
  setAccessYAxis,
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
  tag: 'line-chart',
  styleUrl: 'line-chart.scss'
})
export class LineChart {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = LineChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = LineChartDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = LineChartDefaultValues.height;
  @Prop({ mutable: true }) width: number = LineChartDefaultValues.width;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = LineChartDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) margin: IBoxModelType = LineChartDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = LineChartDefaultValues.padding;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = LineChartDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = LineChartDefaultValues.valueAccessor;
  @Prop({ mutable: true }) seriesAccessor: string = LineChartDefaultValues.seriesAccessor;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = LineChartDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = LineChartDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = LineChartDefaultValues.wrapLabel;
  @Prop({ mutable: true }) showBaselineX: boolean = LineChartDefaultValues.showBaselineX;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = LineChartDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = LineChartDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = LineChartDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = LineChartDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = LineChartDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = LineChartDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) strokeWidth: number = LineChartDefaultValues.strokeWidth;
  @Prop({ mutable: true }) showDots: boolean = LineChartDefaultValues.showDots;
  @Prop({ mutable: true }) dotRadius: number = LineChartDefaultValues.dotRadius;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = LineChartDefaultValues.dataLabel;
  @Prop({ mutable: true }) showTooltip: boolean = LineChartDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = LineChartDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = LineChartDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = LineChartDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = LineChartDefaultValues.annotations;
  @Prop({ mutable: true }) seriesLabel: ISeriesLabelType = LineChartDefaultValues.seriesLabel;

  // Calculation (6/7)
  @Prop() maxValueOverride: number;
  @Prop() minValueOverride: number;
  @Prop({ mutable: true }) referenceLines: object[] = LineChartDefaultValues.referenceLines;
  @Prop({ mutable: true }) secondaryLines: ISecondaryLinesType = LineChartDefaultValues.secondaryLines;

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = LineChartDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = LineChartDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  @Element()
  lineChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  gridG: any;
  lineG: any;
  dotG: any;
  seriesLabelG: any;
  line: any;
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
  seriesInteraction: any;
  tableData: any;
  tableColumns: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  enter: any;
  exit: any;
  update: any;
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
  labelDetails: any;
  isRight: any;
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
  innerInteractionKeys: any;
  innerLabelAccessor: string;
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
  shouldValidateDataLabelAccessor: boolean = false;
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
    this.shouldUpdateScales = true;
    this.shouldUpdateData = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateDotRadius = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
  }

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID;
    this.lineChartEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
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
    this.shouldUpdateScales = true;
    this.shouldUpdateData = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldValidate = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
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
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateSeriesLabels = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaseline = true;
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
    this.shouldUpdateScales = true;
    this.shouldUpdateInterpolationData = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateLines = true;
    this.shouldUpdatePoints = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateDotRadius = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldValidateDataLabelAccessor = true;
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
    const newGridVal = _newVal && _newVal.gridVisible;
    const oldGridVal = _oldVal && _oldVal.gridVisible;
    const newTickInterval = _newVal && _newVal.tickInterval ? _newVal.tickInterval : 0;
    const oldTickInterval = _oldVal && _oldVal.tickInterval ? _oldVal.tickInterval : 0;
    const newUnit = _newVal && _newVal.unit ? _newVal.unit : false;
    const oldUnit = _oldVal && _oldVal.unit ? _oldVal.unit : false;
    if (newGridVal !== oldGridVal || newTickInterval !== oldTickInterval) {
      this.shouldUpdateXGrid = true;
    }
    if (newUnit !== oldUnit) {
      this.shouldUpdateScales = true;
      this.shouldUpdateInterpolationData = true;
      this.shouldUpdateLines = true;
      this.shouldUpdatePoints = true;
      this.shouldUpdateXGrid = true;
      this.shouldUpdateSeriesLabels = true;
      this.shouldUpdateLabels = true;
      this.shouldUpdateReferenceLines = true;
      this.shouldUpdateAnnotations = true;
    }
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
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
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetSeriesLabelOpacity = true;
    this.shouldUpdateStrokeWidth = true;
    this.shouldUpdateColors = true;
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
    const newAccessor = _newVal && _newVal.labelAccessor ? _newVal.labelAccessor : false;
    const oldAccessor = _oldVal && _oldVal.labelAccessor ? _oldVal.labelAccessor : false;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newAccessor !== oldAccessor) {
      this.shouldValidateDataLabelAccessor = true;
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
      this.shouldUpdateStrokeWidth = true;
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
      this.chartID = this.uniqueID || 'line-chart-' + uuid();
      this.lineChartEl.id = this.chartID;
      this.setTagLevels();
      this.setDimensions();
      this.prepareScales();
      this.prepareData();
      this.updateInterpolationData();
      this.validateInteractionKeys();
      this.validateDataLabelAccessor();
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
      this.setGlobalSelections();
      this.enterLines();
      this.updateLines();
      this.exitLines();
      this.enterPoints();
      this.updatePoints();
      this.exitPoints();
      this.enterSeriesLabels();
      this.updateSeriesLabels();
      this.exitSeriesLabels();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.setSeriesLabelOpacity();
      this.drawLines();
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
      this.updateCursor();
      this.bindInteractivity();
      this.bindLegendInteractivity();
      this.setLegendCursor();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.drawYAxis();
      this.setYAxisAccessibility();
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
        this.enterLines();
        this.updateLines();
        this.exitLines();
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
      if (this.shouldUpdateLines) {
        this.drawLines();
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

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueAccessor;
  }

  prepareScales() {
    if (this.nest) {
      this.interpolating = this.nest;
      const oldXDomain = this.x.domain();
      const oldXRange = this.x.range();
      const oldYDomain = this.y.domain();
      const oldYRange = this.y.range();
      this.interpolating.x = this.x.domain(oldXDomain).range(oldXRange);
      this.interpolating.y = scaleLinear()
        .domain(oldYDomain)
        .range(oldYRange);
      this.interpolating.line = line()
        .x(d => this.interpolating.x(d[this.ordinalAccessor]))
        .y(d => this.interpolating.y(d[this.valueAccessor]));
      this.interpolating.map = this.map;
    }

    const minValue = min(this.data, d => parseFloat(d[this.valueAccessor]));
    const maxValue = max(this.data, d => parseFloat(d[this.valueAccessor]));

    this.y = scaleLinear()
      .domain([
        this.minValueOverride || this.minValueOverride === 0
          ? this.minValueOverride
          : minValue - (maxValue - minValue) * 0.1,
        this.maxValueOverride || this.maxValueOverride === 0
          ? this.maxValueOverride
          : maxValue + (maxValue - minValue) * 0.1
      ])
      .range([this.innerPaddedHeight, 0]);

    // set xAxis scale : date
    if (this.data[0][this.ordinalAccessor] instanceof Date) {
      const maxDate = max(this.data, d => d[this.ordinalAccessor]);
      const minDate = min(this.data, d => d[this.ordinalAccessor]);
      const timeDiffInMilliseconds = timeMillisecond.count(minDate, maxDate);
      const genericTimePadding = timeDiffInMilliseconds / 12;

      this.x = scaleTime()
        .domain([minDate, maxDate])
        .range([0, this.innerPaddedWidth]);

      if (this.xAxis.unit) {
        const timeTool = this.time['time' + this.xAxis.unit];
        this.x.domain([timeTool.offset(minDate, -1), timeTool.offset(maxDate, +1)]);
      } else {
        this.x.domain([
          new Date(timeMillisecond.offset(minDate, -genericTimePadding)),
          new Date(timeMillisecond.offset(maxDate, genericTimePadding))
        ]);
      }
    } else {
      // set xAxis scale : ordinal value
      this.x = scalePoint()
        .domain(this.data.map(d => d[this.ordinalAccessor]))
        .padding(0.5)
        .range([0, this.innerPaddedWidth]);
    }
    this.line = line()
      .x(d => this.x(d[this.ordinalAccessor]))
      .y(d => this.y(d[this.valueAccessor]));
  }

  prepareData() {
    this.nest = nest()
      .key(d => d[this.seriesAccessor])
      .entries(this.data);

    this.map = nest()
      .key(d => d[this.seriesAccessor])
      .map(this.data);
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
    const keys = scopeDataKeys(this, chartAccessors, 'line-chart');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
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

  // reset graph size based on window size
  renderRootElements() {
    this.svg = select(this.lineChartEl)
      .select('.visa-viz-d3-line-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.gridG = this.rootG.append('g').attr('class', 'grid-group');

    // this.lineG = this.rootG.select('.line-wrapper-group');
    this.lineG = this.rootG.append('g').attr('class', 'line-group line-wrapper-group');
    this.seriesLabelG = this.rootG.append('g').attr('class', 'line-series-wrapper');
    this.dotG = this.rootG.append('g').attr('class', 'dot-group');

    this.labels = this.rootG.append('g').attr('class', 'line-dataLabel-group');
    this.legendG = select(this.lineChartEl)
      .select('.line-legend')
      .append('svg');

    this.tooltipG = select(this.lineChartEl).select('.line-tooltip');
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

  setGlobalSelections() {
    const dataBoundToLines = this.lineG.selectAll('.line-plot').data(this.nest, d => d.key);
    this.enter = dataBoundToLines.enter().append('path');
    this.exit = dataBoundToLines.exit();
    this.update = dataBoundToLines.merge(this.enter);
    this.enterSize = this.enter.size();

    const dataBoundToDotWrappers = this.dotG.selectAll('.line-dot-wrapper').data(this.nest, d => d.key);
    this.enterDotWrappers = dataBoundToDotWrappers.enter().append('g');
    this.exitDotWrappers = dataBoundToDotWrappers.exit();
    this.updateDotWrappers = dataBoundToDotWrappers.merge(this.enterDotWrappers);

    const dataBountToSeriesLabels = this.seriesLabelG.selectAll('.line-series-label').data(this.nest, d => d.key);
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
      // this.updateDots = this.updateDotWrappers.selectAll('circle').data(d => d.interpolate.end);

      this.updatingLabelGroups.selectAll('.line-dataLabel').remove();
      const dataBoundToLabelChildren = this.updatingLabelGroups
        .selectAll('.line-dataLabel')
        .data(d => d.interpolate.start);

      this.enteringLabels = dataBoundToLabelChildren.enter().append('text');
      this.exitingLabels = dataBoundToLabelChildren.exit();
      this.updatingLabels = dataBoundToLabelChildren.merge(this.enteringLabels);

      // this.updatingLabels = this.updatingLabelGroups.selectAll('.line-dataLabel').data(d => d.interpolate.end);
    } else {
      const dataBoundToDots = this.updateDotWrappers.selectAll('circle').data(d => d.values);

      this.enterDots = dataBoundToDots.enter().append('circle');
      this.exitDots = dataBoundToDots.exit();
      this.updateDots = dataBoundToDots.merge(this.enterDots);

      this.enterSize = this.enterDots.size();
      this.exitSize = this.exitDots.size();

      const dataBoundToLabelChildren = this.updatingLabelGroups
        .selectAll('.line-dataLabel')
        .data(d => d.values, d => d[this.ordinalAccessor]);

      this.enteringLabels = dataBoundToLabelChildren.enter().append('text');
      this.exitingLabels = dataBoundToLabelChildren.exit();
      this.updatingLabels = dataBoundToLabelChildren.merge(this.enteringLabels);
    }
  }

  drawXAxis() {
    const bandWidth = (this.innerPaddedWidth / this.nest[0].values.length) * 0.7;
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
      wrapLabel: this.wrapLabel ? this.padding.left : '',
      format: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: this.yAxis.label,
      padding: this.padding,
      hide: !this.yAxis.visible
    });
  }

  setXAxisAccessibility() {
    setAccessXAxis({
      rootEle: this.lineChartEl,
      hasXAxis: this.innerXAxis ? this.innerXAxis.visible : false,
      xAxis: this.x,
      xAxisLabel: this.xAxis.label ? this.xAxis.label : ''
    });
  }

  setYAxisAccessibility() {
    setAccessYAxis({
      rootEle: this.lineChartEl,
      hasYAxis: this.innerYAxis ? this.innerYAxis.visible : false,
      yAxis: this.y,
      yAxisLabel: this.yAxis.label ? this.yAxis.label : ''
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
      markOffset: this.y(0) || -1,
      hide: !this.showBaselineX
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

  enterLines() {
    this.enter.interrupt();

    this.enter.attr('class', 'line-plot entering').attr('d', d => this.line(d.values));

    this.enter
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
                this.onHoverHandler(d.values[0], false);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null)
      .attr('stroke-dasharray', (d, i, n) => {
        d.linelength = n[i].getTotalLength();
        return d.linelength + ' ' + d.linelength;
      })
      .attr('stroke-dashoffset', d => d.linelength)
      .attr('stroke-width', 0.1)
      .transition('enter')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('stroke-dashoffset', 0)
      .attr('stroke-width', d => this.calculateStrokeWidth(d, true))
      .call(transitionEndAll, () => {
        this.enter.attr('stroke-dasharray', this.handleStrokeDasharray);
      });
  }

  updateLines() {
    this.update.interrupt();

    this.update
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d => {
        // check if interactionKeys includes seriesAccessor, if not then hide lines
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

  exitLines() {
    this.exit
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
  // lines based on data
  drawLines() {
    if (this.interpolating) {
      this.update.attr('d', (d, i, n) => {
        if (select(n[i]).classed('entering')) {
          return this.line(d.values);
        }
        return this.interpolating.line(d.interpolate.start);
      });
    }

    this.update
      .attr('stroke', this.handleLineStroke)
      .attr('fill', 'none')
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('d', d => (this.interpolating ? this.line(d.interpolate.end) : this.line(d.values)))
      .call(transitionEndAll, () => {
        this.update
          .classed('entering', false)
          .attr('d', d => this.line(d.values))
          .attr('stroke-dasharray', this.handleStrokeDasharray);
      });
  }

  enterPoints() {
    this.enterDotWrappers.interrupt();
    this.enterDots.interrupt();

    this.enterDotWrappers
      .attr('class', 'line-dot-wrapper')
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
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d, true) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    if (this.interpolating) {
      this.enterDots
        .attr('cx', d => this.interpolating.x(d[this.ordinalAccessor]))
        .attr('cy', d => this.interpolating.y(d[this.valueAccessor]))
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
        );

      this.enterDotWrappers
        .selectAll('circle')
        .attr('r', 0)
        .attr('cx', d => this.x(d[this.ordinalAccessor]))
        .attr('cy', d => this.y(d[this.valueAccessor]))
        .classed('entering', true)
        .attr('opacity', 0);
    }
    this.updateDotWrappers.order();
    this.updateDots.order();
  }

  updatePoints() {
    this.updateDotWrappers.interrupt();
    this.updateDots.interrupt();

    const dotOpacity = this.showDots ? 1 : 0;

    this.updateDotWrappers.attr('opacity', d => {
      const lineDotOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : 1;
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

      this.updateDots
        .transition('opacity')
        .ease(easeCircleIn)
        .duration((_, i, n) => {
          if (select(n[i]).classed('entering')) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((_, i, n) => {
          if (select(n[i]).classed('entering')) {
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
            this.interactionKeys
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
        this.updatingLabels = this.updatingLabelGroups.selectAll('.line-dataLabel');
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
    // this.updateDots.interrupt();
    this.updateDotWrappers
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.hoverHighlight || this.clickHighlight ? 0 : this.duration);
    let updateTransition;
    if (this.interpolating) {
      updateTransition = this.updateDots
        .transition('update')
        .ease(easeCircleIn)
        .duration((_, i, n) => {
          if (select(n[i]).classed('entering')) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((_, i, n) => {
          if (select(n[i]).classed('entering')) {
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
        );
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
        .transition('update')
        .ease(easeCircleIn)
        .duration(this.duration);
    }

    this.updateDots.attr('stroke', this.handleDotStroke);
    updateTransition
      .attr('cx', d => this.x(d[this.ordinalAccessor]))
      .attr('cy', d => this.y(d[this.valueAccessor]))
      .call(transitionEndAll, () => {
        this.updateDots.classed('entering', false).each(d => {
          d.enter = false;
        });
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
      });
  }

  updateStrokePattern() {
    this.update.attr('stroke-dasharray', this.handleStrokeDasharray);
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
        if (!d.enter && !me.classed('entering') && !d.exit) {
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
  // draw series label

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

  enterSeriesLabels() {
    this.seriesLabelEnter.interrupt();

    this.seriesLabelEnter
      .attr('opacity', 0)
      .attr('class', 'line-series-label')
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
                this.onHoverHandler(d.values[0], false);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null)
      .attr('fill', this.handleSeriesTextFill)
      .attr('x', this.isRight ? this.innerPaddedWidth : 0)
      .attr('y', d =>
        this.isRight
          ? this.y(d.values[d.values.length - 1][this.valueAccessor])
          : this.y(d.values[0][this.valueAccessor])
      )
      .attr('dx', this.isRight ? '0.1em' : '-0.1em')
      .attr('dy', '0.3em');
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
          : this.secondaryLines.keys.includes(d.key) &&
            (!this.secondaryLines.showSeriesLabel || this.secondaryLines.opacity < 1)
          ? 0
          : 1;
        // check if interactionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
        if (!this.seriesInteraction) {
          return seriesLabelOpacity;
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

  exitSeriesLabels() {
    this.seriesLabelExit
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  drawSeriesLabels() {
    this.seriesLabelUpdate.text((d, i) =>
      this.secondaryLines.keys.includes(d.key) && !this.secondaryLines.showSeriesLabel
        ? ''
        : this.labelDetails.label
        ? this.labelDetails.label[i]
        : d.key
    );

    this.seriesLabelUpdate
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('text-anchor', this.isRight ? 'start' : 'end')
      .attr('x', this.isRight ? this.innerPaddedWidth : 0)
      .attr('y', d =>
        this.isRight
          ? this.y(d.values[d.values.length - 1][this.valueAccessor])
          : this.y(d.values[0][this.valueAccessor])
      )
      .attr('dx', this.isRight ? '0.1em' : '-0.1em')
      .attr('dy', '0.3em');
  }

  enterDataLabels() {
    this.enteringLabelGroups.interrupt();

    this.enteringLabelGroups
      .attr('class', 'line-label-wrapper')
      .attr('opacity', 0)
      .attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0]);

    this.enteringLabels.attr('fill', this.handleTextFill);

    if (this.interpolating) {
      const childrenEnter = this.enteringLabels.attr('class', 'line-dataLabel');

      placeDataLabels({
        root: childrenEnter,
        xScale: this.interpolating.x,
        yScale: this.interpolating.y,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'line'
      });

      this.updatingLabels.attr('opacity', d =>
        d.enter
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
          : 1
      );

      const fullEnter = this.enteringLabelGroups
        .selectAll('.line-dataLabel')
        .attr('opacity', 0)
        .classed('entering', true);

      placeDataLabels({
        root: fullEnter,
        xScale: this.x,
        yScale: this.y,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'line'
      });
    } else {
      const childrenEnter = this.enteringLabels.attr('opacity', 0).attr('class', 'line-dataLabel');

      placeDataLabels({
        root: childrenEnter,
        xScale: this.x,
        yScale: this.y,
        ordinalAccessor: this.ordinalAccessor,
        valueAccessor: this.valueAccessor,
        placement: this.dataLabel.placement,
        chartType: 'line'
      });
    }
  }

  updateDataLabels() {
    this.updatingLabelGroups.interrupt('opacity');

    this.updatingLabelGroups.attr('opacity', d => {
      const labelOpacity = !this.dataLabel.visible
        ? 0
        : this.secondaryLines.keys.includes(d.key) &&
          (!this.secondaryLines.showDataLabel || this.secondaryLines.opacity < 1)
        ? 0
        : 1;
      return labelOpacity;
    });

    if (this.interpolating) {
      this.updatingLabels = this.updatingLabelGroups
        .selectAll('.line-dataLabel')
        .data(d => d.interpolate.end)
        .classed('exiting', d => d.exit);

      this.updatingLabels
        .transition('opacity')
        .ease(easeCircleIn)
        .duration((_, i, n) => {
          if (select(n[i]).classed('entering')) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((_, i, n) => {
          if (select(n[i]).classed('entering')) {
            return this.duration * 0.75 * (i / (n.length - 1));
          }
          return 0;
        })
        .attr('opacity', d =>
          d.exit
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
            : 1
        );
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
      .selectAll('.line-dataLabel')
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
      return formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format);
    });
    if (this.interpolating) {
      updateChildren = this.updatingLabels
        .transition('update')
        .ease(easeCircleIn)
        .duration((_, i, n) => {
          if (select(n[i]).classed('entering')) {
            return this.duration / 2;
          }
          return this.duration;
        })
        .delay((_, i, n) => {
          if (select(n[i]).classed('entering')) {
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
      yScale: this.y,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      placement: this.dataLabel.placement,
      chartType: 'line'
    });
  }

  updateStrokeWidth() {
    this.update.attr('stroke-width', d => this.calculateStrokeWidth(d, true));
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
    this.update.attr('stroke', this.handleLineStroke);
    this.seriesLabelUpdate.attr('fill', this.handleSeriesTextFill);
    this.updatingLabelGroups.attr('fill', (_, i) => this.rawColors[i] || this.rawColors[0]);
    this.updatingLabels.attr('fill', this.handleTextFill);
  }

  setLabelOpacity() {
    // this.updatingLabelGroups.interrupt();

    this.updatingLabelGroups.attr('opacity', d => {
      const labelOpacity = !this.dataLabel.visible
        ? 0
        : this.secondaryLines.keys.includes(d.key) &&
          (!this.secondaryLines.showDataLabel || this.secondaryLines.opacity < 1)
        ? 0
        : 1;
      return labelOpacity;
    });
    if (this.interpolating) {
      this.updatingLabels.each((d, i, n) => {
        const me = select(n[i]);
        if (!d.enter && !me.classed('entering') && !d.exit) {
          me.attr('opacity', () =>
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
    } else {
      this.updatingLabels.attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.innerInteractionKeys) <
        1
          ? 0
          : 1
      );
    }
  }

  setSeriesLabelOpacity() {
    this.seriesLabelUpdate.interrupt('opacity');

    this.seriesLabelUpdate.attr('opacity', d => {
      const seriesLabelOpacity = !this.seriesLabel.visible
        ? 0
        : this.secondaryLines.keys.includes(d.key) &&
          (!this.secondaryLines.showSeriesLabel || this.secondaryLines.opacity < 1)
        ? 0
        : 1;
      // check if interactionKeys includes seriesAccessor, if not then don't check seriesLabel for interaction
      if (!this.seriesInteraction) {
        return seriesLabelOpacity;
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

  updateInteractionState() {
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.update.interrupt('opacity');

    // we use this.update and this.updatingLabels from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    const dotOpacity = this.showDots ? 1 : 0;
    this.update.attr('opacity', d => {
      // check if interactionKeys includes seriesAccessor, if not then hide lines
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

    this.updateDotWrappers.attr('opacity', d => {
      const lineDotOpacity = this.secondaryLines.keys.includes(d.key) ? this.secondaryLines.opacity : 1;
      return lineDotOpacity;
    });

    this.updateDots.each((d, i, n) => {
      const me = select(n[i]);
      if (!d.enter && !me.classed('entering') && !d.exit) {
        me.attr('opacity', () => {
          return checkInteraction(
            d,
            dotOpacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.interactionKeys
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

  updateCursor() {
    this.update.attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null);
    this.updateDotWrappers.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.seriesLabelUpdate.attr('cursor', !this.suppressEvents && this.seriesInteraction ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  drawReferenceLines() {
    if (!this.references) {
      this.references = this.rootG.append('g').attr('class', 'line-reference-line-group');
    }

    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', '.line-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines
      // .attr('id', (_, i) => 'reference-line-' + i)
      .attr('class', 'line-reference-line')
      .attr('opacity', 0);

    const enterLabels = enterReferences.append('text');

    enterLabels
      // .attr('id', (_, i) => 'reference-line-' + i + '-label')
      .attr('class', 'line-reference-line-label')
      .attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.line-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeLabels = mergeReferences
      .selectAll('.line-reference-line-label')
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
    setAccessAnnotation(this.lineChartEl, this.annotations);
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
      type: 'line',
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

  bindLegendInteractivity() {
    select(this.lineChartEl)
      .selectAll('.legend')
      .on(
        'click',
        !this.suppressEvents && this.legend.interactive && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.onClickHandler(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents && this.legend.interactive && this.seriesInteraction
          ? d => {
              if (d.values) {
                this.hoverFunc.emit(d.values[0]);
              }
            }
          : null
      )
      .on(
        'mouseout',
        !this.suppressEvents && this.legend.interactive && this.seriesInteraction
          ? () => this.onMouseOutHandler()
          : null
      );
  }

  setLegendCursor() {
    select(this.lineChartEl)
      .selectAll('.legend')
      .style('cursor', !this.suppressEvents && this.legend.interactive && this.seriesInteraction ? this.cursor : null);
  }

  bindInteractivity() {
    this.update
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
                this.onHoverHandler(d.values[0], false);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null);

    this.updateDots
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d, true) : null)
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
                this.onHoverHandler(d.values[0], false);
              }
            }
          : null
      )
      .on('mouseout', !this.suppressEvents && this.seriesInteraction ? () => this.onMouseOutHandler() : null);
    this.updatingLabels
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d, true) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      rootEle: this.lineChartEl,
      geomType: 'point',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'line-chart',
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
      chartTag: 'line-chart',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'point',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'line-chart'),
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
    const keys = scopeDataKeys(this, chartAccessors, 'line-chart');
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
    setAccessTitle(this.lineChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.lineChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.lineChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.lineChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.lineChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.lineChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.lineChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and gorup counts, etc)
    setAccessChartCounts({
      rootEle: this.lineChartEl,
      parentGNode: this.dotG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'line-chart',
      geomType: 'point',
      groupName: 'line'
      // recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.lineChartEl, this.accessibility.structureNotes);
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
      chartType: 'line'
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
    if (this.shouldValidateDataLabelAccessor) {
      this.validateDataLabelAccessor();
      this.shouldValidateDataLabelAccessor = false;
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
          <div class="line-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <div class="visa-viz-d3-line-container" />
          <div class="line-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(LineChartDefaultValues);
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
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : LineChartDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
