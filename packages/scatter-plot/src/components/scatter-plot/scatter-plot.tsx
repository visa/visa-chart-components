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
import { scaleLinear, scaleOrdinal, scaleSqrt, scaleSequentialSqrt } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
import { easeCircleIn } from 'd3-ease';
import { nest } from 'd3-collection';
import 'd3-transition';
import { v4 as uuid } from 'uuid';
import {
  IBoxModelType,
  ILocalizationType,
  IClickStyleType,
  IHoverStyleType,
  IAxisType,
  IReferenceStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  IAnimationConfig,
  ILegendType,
  ISubTitleType
} from '@visa/charts-types';
import { ScatterPlotDefaultValues } from './scatter-plot-default-values';
import Utils from '@visa/visa-charts-utils';

const {
  getGlobalInstances,
  configLocalization,
  getActiveLanguageString,
  getAccessibleStrokes,
  ensureTextContrast,
  createTextStrokeFilter,
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
  leastSquares,
  overrideTitleTooltip,
  placeDataLabels,
  scopeDataKeys,
  symbols,
  transitionEndAll,
  visaColors,
  validateAccessibilityProps,
  validateLocalizationProps,
  findTagLevel,
  prepareRenderChange,
  roundTo,
  resolveLabelCollision,
  setSubTitle
} = Utils;

@Component({
  tag: 'scatter-plot',
  styleUrl: 'scatter-plot.scss'
})
export class ScatterPlot {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) localization: ILocalizationType = ScatterPlotDefaultValues.localization;
  @Prop({ mutable: true }) mainTitle: string = ScatterPlotDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string | ISubTitleType = ScatterPlotDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = ScatterPlotDefaultValues.height;
  @Prop({ mutable: true }) width: number = ScatterPlotDefaultValues.width;
  @Prop({ mutable: true }) margin: IBoxModelType = ScatterPlotDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = ScatterPlotDefaultValues.padding;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = ScatterPlotDefaultValues.highestHeadingLevel;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) xAccessor: string = ScatterPlotDefaultValues.xAccessor;
  @Prop({ mutable: true }) yAccessor: string = ScatterPlotDefaultValues.yAccessor;
  @Prop({ mutable: true }) sizeConfig: any = ScatterPlotDefaultValues.sizeConfig;
  @Prop({ mutable: true }) groupAccessor: string = ScatterPlotDefaultValues.groupAccessor;

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = ScatterPlotDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = ScatterPlotDefaultValues.yAxis;
  @Prop({ mutable: true }) showBaselineX: boolean = ScatterPlotDefaultValues.showBaselineX;
  @Prop({ mutable: true }) showBaselineY: boolean = ScatterPlotDefaultValues.showBaselineY;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = ScatterPlotDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) dotRadius: number = ScatterPlotDefaultValues.dotRadius;
  @Prop({ mutable: true }) dotOpacity: number = ScatterPlotDefaultValues.dotOpacity;
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = ScatterPlotDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = ScatterPlotDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = ScatterPlotDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = ScatterPlotDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = ScatterPlotDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = ScatterPlotDefaultValues.animationConfig;
  @Prop({ mutable: true }) fitLineStyle: IReferenceStyleType = ScatterPlotDefaultValues.fitLineStyle;
  @Prop({ mutable: true }) dotSymbols: string[] = ScatterPlotDefaultValues.dotSymbols;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = ScatterPlotDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) showTooltip: boolean = ScatterPlotDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = ScatterPlotDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = ScatterPlotDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = ScatterPlotDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = ScatterPlotDefaultValues.annotations;

  // Calculation (6/7)
  @Prop() xMaxValueOverride: number;
  @Prop() xMinValueOverride: number;
  @Prop() yMaxValueOverride: number;
  @Prop() yMinValueOverride: number;
  @Prop({ mutable: true }) showFitLine: boolean = ScatterPlotDefaultValues.showFitLine;
  @Prop({ mutable: true }) referenceLines: object[] = ScatterPlotDefaultValues.referenceLines;

  // Interactivity (7/7)
  @Prop({ mutable: true }) suppressEvents: boolean = ScatterPlotDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = ScatterPlotDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Testing (8/7)
  @Prop() unitTest: boolean = false;
  //  @Prop() debugMode: boolean = false;

  @Element()
  scatterChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  shouldValidateLocalization: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  dotG: any;
  gridG: any;
  fitLine: any;
  references: any;
  legendG: any;
  tooltipG: any;
  colorArr: any;
  x: any;
  y: any;
  size: any;
  shapeArea: any;
  nest: any;
  symbol: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  xMin: any;
  xMax: any;
  yMin: any;
  yMax: any;
  sizeMin: any;
  sizeMax: any;
  defaults: boolean;
  current: any;
  enterPointWrappers: any;
  exitPointWrappers: any;
  updatePointWrappers: any;
  enterPoints: any;
  exitPoints: any;
  updatePoints: any;
  enteringLabelGroups: any;
  exitingLabelGroups: any;
  updatingLabelGroups: any;
  enterLabels: any;
  updateLabels: any;
  exitLabels: any;
  innerClickStyle: any;
  innerHoverStyle: any;
  innerLabelAccessor: string;
  innerLabelFormat: string;
  duration: any;
  labels: any;
  labelG: any;
  subTitleG: any;
  tableData: any;
  tableColumns: any;
  // these are added for accessibility
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  chartID: string;
  dotColor: any;
  textColor: any;
  rawColors: any;
  textColorArr: any;
  innerInteractionKeys: string[];
  groupInteraction: boolean;
  shouldUpdateAnnotations: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetSubTitle: boolean = false;
  shouldUpdateData: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldValidate: boolean = false;
  shouldUpdateLayout: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldUpdateBaselineX: boolean = false;
  shouldUpdateBaselineY: boolean = false;
  shouldUpdateXGrid: boolean = false;
  shouldUpdateYGrid: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldDrawFitLine: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldAddStrokeUnder: boolean = false;
  shouldValidateClickStyle: boolean = false;
  shouldValidateHoverStyle: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldValidateDataLabelAccessor: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldSetDotRadius: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldUpdateLegendInteractivity: boolean = false;
  shouldSetLegendCursor: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSetPointOpacity: boolean = false;
  // shouldUpdateStrokeWidth: boolean = false;
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
  shouldSetStrokes: boolean = false;
  shouldSetLocalizationConfig: boolean = false;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  filter: any;
  textFilter: any;
  strokes: any = {};
  bitmaps: any;

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldUpdateScales = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetPointOpacity = true;
    this.shouldEnterUpdateExit = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldAddStrokeUnder = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
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
    // this.chartID = newID || 'scatter-plot-' + uuid();
    // this.scatterChartEl.id = this.chartID;
    // this.shouldValidate = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldUpdateLegend = true;
    // this.shouldSetStrokes = true;
    // this.shouldAddStrokeUnder = true;
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
  layoutWatcher(_newVal, _oldVal) {
    this.shouldUpdateLayout = true;
    this.shouldUpdateScales = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('xAccessor')
  xAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldUpdateXGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('yAccessor')
  yAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldUpdateYGrid = true;
    this.shouldUpdateLabels = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('sizeConfig')
  sizeConfigWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateLabels = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldValidateDataLabelAccessor = true;
    this.shouldUpdateTableData = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldSetPointOpacity = true;
    this.shouldValidateHoverStyle = true;
    this.shouldValidateClickStyle = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetGroupAccessibilityAttributes = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
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

  @Watch('showBaselineX')
  showBaselineXWatcher(_newVal, _oldVal) {
    this.shouldUpdateBaselineX = true;
  }

  @Watch('showBaselineY')
  showBaselineYWatcher(_newVal, _oldVal) {
    this.shouldUpdateBaselineY = true;
  }

  @Watch('colors')
  @Watch('colorPalette')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
  }

  @Watch('dotRadius')
  dotRadiusWatcher(_newVal, _oldVal) {
    this.shouldValidateHoverStyle = true;
    this.shouldValidateClickStyle = true;
    this.shouldSetDotRadius = true;
    this.shouldUpdateGeometries = true; // this is need for auto placement
    this.shouldUpdateLabels = true;
  }

  @Watch('dotOpacity')
  dotOpacityWatcher(_newVal, _oldVal) {
    this.shouldSetPointOpacity = true;
  }

  @Watch('dotSymbols')
  dotSymbolsWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldSetPointOpacity = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldValidateHoverStyle = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldSetPointOpacity = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldValidateClickStyle = true;
  }

  @Watch('referenceLines')
  @Watch('referenceStyle')
  referenceWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('fitLineStyle')
  fitLineStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawFitLine = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
    this.shouldSetLegendCursor = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldSetPointOpacity = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldUpdateGeometries = true; // this is need for auto placement
    this.shouldUpdateTableData = true; // this is needed for data table formatting
    this.shouldSetParentSVGAccessibility = true; // this is needed for aria label formatting
    this.shouldSetGeometryAriaLabels = true; // this is needed for aria label formatting
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    const newAccessor = _newVal && _newVal.labelAccessor ? _newVal.labelAccessor : false;
    const oldAccessor = _oldVal && _oldVal.labelAccessor ? _oldVal.labelAccessor : false;
    const newFormat = _newVal && _newVal.format ? _newVal.format : false;
    const oldFormat = _oldVal && _oldVal.format ? _oldVal.format : false;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newAccessor !== oldAccessor || newFormat !== oldFormat) {
      this.shouldValidateDataLabelAccessor = true;
    }
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    // we need to call anywhere that innerDataKeys is used
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
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

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldUpdateLegend = true;
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

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetAnnotationAccessibility = true;
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
      this.shouldSetColors = true;
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

  @Watch('xMaxValueOverride')
  @Watch('xMinValueOverride')
  xValueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineX = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('yMaxValueOverride')
  @Watch('yMinValueOverride')
  yValueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldDrawFitLine = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateBaselineY = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('showFitLine')
  showFitLineWatcher(_newVal, _oldVal) {
    this.shouldDrawFitLine = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldSetPointOpacity = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldSetPointOpacity = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldSetPointOpacity = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateLegendInteractivity = true;
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

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    const chartID = this.uniqueID || 'scatter-plot-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.scatterChartEl.id = this.chartID;
      this.setLocalizationConfig();
      this.setTagLevels();
      this.prepareData();
      this.setLayoutData();
      this.validateClickStyle();
      this.validateHoverStyle();
      this.setColors();
      this.prepareScales();
      this.validateInteractionKeys();
      this.validateDataLabelAccessor();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
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
      this.setStrokes();
      this.setSubTitleElements();
      this.drawXGrid();
      this.drawYGrid();
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.enterPointGroups();
      // this.updatePointGroups();
      this.exitPointGroups();
      this.enterDataLabels();
      this.updateDataLabels();
      this.exitDataLabels();
      this.setPointOpacity();
      this.drawPointGroups();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawLegendElements();
      this.drawDataLabels();
      this.addStrokeUnder();
      this.drawFitLine();
      this.drawReferenceLines();
      this.setSelectedClass();
      this.updateCursor();
      this.setLegendCursor();
      this.bindInteractivity();
      this.bindLegendInteractivity();
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
      hideNonessentialGroups(this.root.node(), this.dotG.node());
      this.setGroupAccessibilityID();
      this.defaults = false;
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
        this.enterPointGroups();
        // this.updatePointGroups();
        this.exitPointGroups();
        this.enterDataLabels();
        this.updateDataLabels();
        this.exitDataLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldUpdateGeometries) {
        this.drawPointGroups();
        this.shouldUpdateGeometries = false;
      }
      if (this.shouldSetDotRadius) {
        this.setDotRadius();
        this.shouldSetDotRadius = false;
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
      if (this.shouldDrawFitLine) {
        this.drawFitLine();
        this.shouldDrawFitLine = false;
      }
      if (this.shouldUpdateReferenceLines) {
        this.drawReferenceLines();
        this.shouldUpdateReferenceLines = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
      }
      if (this.shouldSetPointOpacity) {
        this.setPointOpacity();
        this.shouldSetPointOpacity = false;
      }
      if (this.shouldSetLabelOpacity) {
        this.setLabelOpacity();
        this.shouldSetLabelOpacity = false;
      }
      if (this.shouldSetSelectionClass) {
        this.setSelectedClass();
        this.shouldSetSelectionClass = false;
      }
      if (this.shouldUpdateCursor) {
        this.updateCursor();
        this.shouldUpdateCursor = false;
      }
      if (this.shouldUpdateLegendInteractivity) {
        this.bindLegendInteractivity();
        this.shouldUpdateLegendInteractivity = false;
      }
      if (this.shouldSetLegendCursor) {
        this.setLegendCursor();
        this.shouldSetLegendCursor = false;
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
        this.shouldUpdateBaselineX = false;
      }
      if (this.shouldUpdateBaselineY) {
        this.drawBaselineY();
        this.shouldUpdateBaselineY = false;
      }
      this.onChangeHandler();
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

  setLayoutData() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length
        ? this.interactionKeys
        : this.groupAccessor
        ? [this.groupAccessor]
        : [this.xAccessor, this.yAccessor];

    this.groupInteraction =
      this.innerInteractionKeys.length === 1 && this.innerInteractionKeys[0] === this.groupAccessor;
  }

  validateDataLabelAccessor() {
    this.innerLabelAccessor = this.dataLabel.labelAccessor
      ? this.dataLabel.labelAccessor
      : this.sizeConfig.sizeAccessor
      ? this.sizeConfig.sizeAccessor
      : this.yAccessor;

    this.innerLabelFormat = this.dataLabel.labelAccessor
      ? this.dataLabel.format
      : this.sizeConfig.sizeAccessor
      ? this.sizeConfig.format
      : this.yAxis.format;
  }

  innerScopeDataKeys() {
    // generate scoped and formatted data for data-table component
    // we also scope singleAccessor array in chartAccessors based on what is actually in the data
    const innerChartSingleAccessors = [];
    chartAccessors.singleAccessors.forEach(accessor => {
      if (this[accessor] && min(this.data, d => d[this[accessor]]) !== undefined) {
        innerChartSingleAccessors.push(accessor);
      }
    });
    const innerChartAccessors = { ...chartAccessors, singleAccessors: innerChartSingleAccessors };
    return scopeDataKeys(this, innerChartAccessors, 'scatter-plot');
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = this.innerScopeDataKeys();
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  getLanguageString() {
    return getActiveLanguageString(this.localization);
  }

  setLocalizationConfig() {
    configLocalization(this.localization);
  }

  prepareData() {
    this.nest = this.groupAccessor
      ? nest()
          .key(d => d[this.groupAccessor])
          .entries(this.data)
      : [{ key: '', values: this.data }];
  }

  setSubTitleElements() {
    setSubTitle({
      root: this.subTitleG,
      subTitle: this.subTitle
    });
  }

  setColors = () => {
    this.rawColors = this.colors ? convertVisaColor(this.colors) : getColors(this.colorPalette, this.nest.length || 1);
    this.textColorArr = [];
    let adjustedColors = this.rawColors;
    function getStrokeColor(color) {
      const strokes = getAccessibleStrokes(color);
      return strokes.length === 2 ? strokes[1] : strokes[0];
    }
    if (!this.accessibility.hideStrokes) {
      this.strokes = {};
      if (this.innerClickStyle.color) {
        const color = visaColors[this.innerClickStyle.color] || this.innerClickStyle.color;
        this.strokes[color.toLowerCase()] = getStrokeColor(color);
      }
      if (this.innerHoverStyle.color) {
        const color = visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color;
        this.strokes[color.toLowerCase()] = getStrokeColor(color);
      }
      adjustedColors = [];
    }
    this.rawColors.forEach(color => {
      if (!this.accessibility.hideStrokes) {
        const adjusted = getStrokeColor(color);
        this.strokes[color.toLowerCase()] = adjusted;
        adjustedColors.push(adjusted);
      }
      this.textColorArr.push(ensureTextContrast(color, '#ffffff', 4.5));
    });
    if (this.innerClickStyle.color) {
      const color = visaColors[this.innerClickStyle.color] || this.innerClickStyle.color;
      this.textColorArr.push(ensureTextContrast(color, '#ffffff', 4.5));
    }
    if (this.innerHoverStyle.color) {
      const color = visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color;
      this.textColorArr.push(ensureTextContrast(color, '#ffffff', 4.5));
    }
    this.colorArr = adjustedColors;
  };

  prepareScales() {
    const xMinValue = min(this.data, d => parseFloat(d[this.xAccessor]));
    const xMaxValue = max(this.data, d => parseFloat(d[this.xAccessor]));
    const yMinValue = min(this.data, d => parseFloat(d[this.yAccessor]));
    const yMaxValue = max(this.data, d => parseFloat(d[this.yAccessor]));
    const zMinValue = min(this.data, d => parseFloat(d[this.sizeConfig.sizeAccessor]));
    const zMaxValue = max(this.data, d => parseFloat(d[this.sizeConfig.sizeAccessor]));

    this.xMin = this.xMinValueOverride === 0 ? 0 : this.xMinValueOverride || xMinValue - (xMaxValue - xMinValue) * 0.1;
    this.xMax = this.xMaxValueOverride === 0 ? 0 : this.xMaxValueOverride || xMaxValue + (xMaxValue - xMinValue) * 0.1;
    this.yMin = this.yMinValueOverride === 0 ? 0 : this.yMinValueOverride || yMinValue - (yMaxValue - yMinValue) * 0.1;
    this.yMax = this.yMaxValueOverride === 0 ? 0 : this.yMaxValueOverride || yMaxValue + (yMaxValue - yMinValue) * 0.1;

    // for size we need to check
    // 1. if sizeConfig is falsy we need to check for 0 as that is also falsy, but a valid value
    // 2. if we have a valid value (truthy or 0) then if it is smaller than the data use it, otherwise use the data
    // 3. we use some simple math to calc 10% of the range below the min
    const sizeMinTruthy = this.sizeConfig.minValueOverride || this.sizeConfig.minValueOverride === 0;
    const sizeMaxTruthy = this.sizeConfig.maxValueOverride || this.sizeConfig.maxValueOverride === 0;
    this.sizeMin =
      sizeMinTruthy && this.sizeConfig.minValueOverride < zMinValue ? this.sizeConfig.minValueOverride : zMinValue;
    this.sizeMax =
      sizeMaxTruthy && this.sizeConfig.maxValueOverride > zMaxValue ? this.sizeConfig.maxValueOverride : zMaxValue; // zMaxValue + (zMaxValue - zMinValue) * 0.1; // for the size scale we don't need a buffer like we do for axes

    const keys = [];
    this.nest.map(param => {
      keys.push(param.key);
    });

    if (this.xMax === this.xMin) {
      this.xMax = Math.max(0, this.xMax);
      this.xMin = Math.min(0, this.xMin);
    }

    if (this.yMax === this.yMin) {
      this.yMax = Math.max(0, this.yMax);
      this.yMin = Math.min(0, this.yMin);
    }

    if (this.sizeMax === this.sizeMin) {
      this.sizeMax = Math.max(0, this.sizeMax);
      this.sizeMin = Math.min(0, this.sizeMin);
    }

    this.x = scaleLinear()
      .domain([this.xMin, this.xMax])
      .range([0, this.innerPaddedWidth]);

    this.y = scaleLinear()
      .domain([this.yMin, this.yMax])
      .range([this.innerPaddedHeight, 0]);

    // for the range() of this scale we default to dotRadius for minimum
    // and scale up based on the dimenions of the chart, unless of course
    // size overrides are sent, then we will respect those as provided
    this.size = scaleSqrt()
      .domain([this.sizeMin, this.sizeMax])
      .range([
        this.sizeConfig.minSizeOverride || this.sizeConfig.minSizeOverride === 0
          ? this.sizeConfig.minSizeOverride
          : ScatterPlotDefaultValues.dotRadius,
        this.sizeConfig.maxSizeOverride || this.sizeConfig.maxSizeOverride === 0
          ? this.sizeConfig.maxSizeOverride
          : (this.innerPaddedWidth + this.innerPaddedHeight) / 2.5 / 10
      ]);

    this.symbol = scaleOrdinal()
      .domain(keys)
      .range(this.dotSymbols);

    this.shapeArea = {};
    keys.forEach(key => {
      let path_arr = [];
      let shape = symbols[this.symbol(key)].general;
      shape.split(/[A-Z]/g).forEach(j => {
        if (j.split(',').length === 2) {
          path_arr.push(j.split(','));
        }
      });
      let xs = [];
      let ys = [];
      path_arr.forEach((j, k) => {
        if (path_arr[k + 1]) {
          xs.push(parseFloat(j[0]) * parseFloat(path_arr[k + 1][1]));
          ys.push(parseFloat(j[1]) * parseFloat(path_arr[k + 1][0]));
        } else {
          xs.push(parseFloat(j[0]) * parseFloat(path_arr[0][1]));
          ys.push(parseFloat(j[1]) * parseFloat(path_arr[0][0]));
        }
      });
      let z = (xs.reduce((a, b) => a + b) - ys.reduce((a, b) => a + b)) / 2;
      this.shapeArea[key] = {
        shape: this.symbol(key),
        area: z,
        toCircle: Math.PI / z
      };
    });

    this.dotColor = scaleOrdinal()
      .domain(keys)
      .range(this.rawColors);

    const baseColors = [...this.rawColors];

    if (this.innerClickStyle.color) {
      baseColors.push(visaColors[this.innerClickStyle.color] || this.innerClickStyle.color);
    }
    if (this.innerHoverStyle.color) {
      baseColors.push(visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color);
    }
    this.textColor = scaleOrdinal()
      .domain(baseColors)
      .range(this.textColorArr);
  }

  validateHoverStyle() {
    this.innerHoverStyle = this.hoverStyle
      ? {
          color: this.hoverStyle.color,
          strokeWidth: this.hoverStyle.strokeWidth || 2
        }
      : {
          strokeWidth: 2
        };
  }

  validateClickStyle() {
    this.innerClickStyle = this.clickStyle
      ? {
          color: this.clickStyle.color,
          strokeWidth: this.clickStyle.strokeWidth || 3
        }
      : {
          strokeWidth: 3
        };
  }

  setStrokes() {
    this.textFilter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.filter = !this.accessibility.hideStrokes
      ? createTextStrokeFilter({
          root: this.svg.node(),
          id: this.chartID,
          color: '#ffffff',
          strokeSizeOverride: 1 / (this.dotRadius || 1)
        })
      : null;
  }

  addStrokeUnder() {
    this.updateLabels.attr('filter', this.textFilter);
    this.updatePoints.attr('filter', (_, i, n) => (!select(n[i]).classed('moving') ? this.filter : null));
  }

  textFillHandler = d => {
    const clicked =
      this.clickHighlight &&
      this.clickHighlight.length > 0 &&
      checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    const baseColor = clicked
      ? visaColors[this.innerClickStyle.color] ||
        this.innerClickStyle.color ||
        (this.groupAccessor ? this.dotColor(d[this.groupAccessor]) : this.rawColors[0])
      : hovered
      ? visaColors[this.innerHoverStyle.color] ||
        this.innerHoverStyle.color ||
        (this.groupAccessor ? this.dotColor(d[this.groupAccessor]) : this.rawColors[0])
      : this.groupAccessor
      ? this.dotColor(d[this.groupAccessor])
      : this.rawColors[0];
    const color = this.textColor(baseColor);
    return color;
  };

  updateStrokeWidth() {
    this.updatePoints.attr('stroke', this.handleDotStyle);
  }

  handleDotStyle = (d, i, n) => {
    let color = null;
    const clicked =
      this.clickHighlight &&
      this.clickHighlight.length > 0 &&
      checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
    const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
    const baseColor = clicked
      ? visaColors[this.innerClickStyle.color] ||
        this.innerClickStyle.color ||
        (this.groupAccessor ? this.dotColor(d[this.groupAccessor]) : this.rawColors[0])
      : hovered
      ? visaColors[this.innerHoverStyle.color] ||
        this.innerHoverStyle.color ||
        (this.groupAccessor ? this.dotColor(d[this.groupAccessor]) : this.rawColors[0])
      : this.groupAccessor && this.sizeConfig.dualEncodeColor
      ? scaleSequentialSqrt(
          [Math.max(0, this.sizeMin), this.sizeMax],
          interpolate('#fff', this.dotColor(d[this.groupAccessor]))
        )(d[this.sizeConfig.sizeAccessor]) || this.dotColor(d[this.groupAccessor])
      : this.groupAccessor && this.sizeConfig && !this.sizeConfig.dualEncodeColor
      ? this.dotColor(d[this.groupAccessor])
      : !this.groupAccessor && this.sizeConfig.dualEncodeColor
      ? scaleSequentialSqrt([Math.max(0, this.sizeMin), this.sizeMax], interpolate('#fff', this.rawColors[0]))(
          d[this.sizeConfig.sizeAccessor]
        ) || this.rawColors[0]
      : this.rawColors[0];
    if (!this.accessibility.hideStrokes) {
      const strokeWidth =
        (clicked
          ? parseFloat(this.innerClickStyle.strokeWidth) || 1
          : hovered
          ? parseFloat(this.innerHoverStyle.strokeWidth) || 1
          : 1) /
        (this.size(
          d[this.sizeConfig.sizeAccessor] * this.shapeArea[this.groupAccessor ? d[this.groupAccessor] : '']['toCircle']
        ) ||
          this.dotRadius ||
          1);

      select(n[i]).attr('stroke-width', strokeWidth);

      // we need to handle the following scenarios for stroke now
      // 1. clicked - use baseColor.toLowerCase()
      // 2. hovered - use baseColor.toLowerCase()
      // 3. groupAccessor - use this.dotColor(d[this.groupAccessor]).toLowerCase()
      // 4. no groupAccessor - use this.rawColors[0].toLowerCase()
      // strokes object was created with lowercase hex codes, so need to ensure lower case
      color = this.strokes[
        clicked || hovered
          ? baseColor.toLowerCase()
          : this.groupAccessor
          ? this.dotColor(d[this.groupAccessor]).toLowerCase()
          : this.rawColors[0].toLowerCase()
      ];
    }

    select(n[i]).attr('fill', baseColor);
    return color;
  };

  renderRootElements() {
    this.svg = select(this.scatterChartEl)
      .select('.visa-viz-d3-scatter-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);
    this.gridG = this.rootG.append('g').attr('class', 'scatter-grid-group');
    this.dotG = this.rootG
      .append('g')
      .attr('class', 'scatter-dot-group')
      .attr('isolation', 'isolate')
      .style('isolation', 'isolate');
    this.fitLine = this.rootG.append('g').attr('class', 'scatter-fit-line-group');
    this.labelG = this.rootG.append('g').attr('class', 'scatter-dataLabel-group');
    this.legendG = select(this.scatterChartEl)
      .select('.scatter-legend')
      .append('svg');
    this.subTitleG = select(this.scatterChartEl).select('.scatter-sub-title');
    this.tooltipG = select(this.scatterChartEl).select('.scatter-tooltip');
    this.references = this.rootG.append('g').attr('class', 'scatter-reference-line-group');
  }

  setGlobalSelections() {
    const dataBoundToGroups = this.dotG.selectAll('.series-point-group').data(this.nest, d => d.key);

    this.enterPointWrappers = dataBoundToGroups.enter().append('g');
    this.exitPointWrappers = dataBoundToGroups.exit();
    this.updatePointWrappers = dataBoundToGroups.merge(this.enterPointWrappers);

    this.exitSize = this.exitPointWrappers.selectAll('.data-point').size();
    this.exitSize += this.exitPointWrappers.size();

    const dataBoundToGeometries = this.updatePointWrappers.selectAll('.data-point').data(d => d.values);

    this.enterPoints = dataBoundToGeometries.enter().append('path');
    this.exitPoints = dataBoundToGeometries.exit();
    this.updatePoints = dataBoundToGeometries.merge(this.enterPoints);

    const dataBoundToLabelGroups = this.labelG.selectAll('.series-dataLabel-group').data(this.nest, d => d.key);

    this.enteringLabelGroups = dataBoundToLabelGroups.enter().append('g');
    this.exitingLabelGroups = dataBoundToLabelGroups.exit();
    this.updatingLabelGroups = dataBoundToLabelGroups.merge(this.enteringLabelGroups);

    const dataBoundToLabels = this.updatingLabelGroups.selectAll('text').data(d => d.values);
    this.enterLabels = dataBoundToLabels.enter().append('text');
    this.exitLabels = dataBoundToLabels.exit();
    this.updateLabels = dataBoundToLabels.merge(this.enterLabels);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.scatterChartEl)
        .select('.visa-viz-d3-scatter-container')
        .attr('data-testid', 'chart-container');
      select(this.scatterChartEl)
        .select('.scatter-main-title')
        .attr('data-testid', 'main-title');
      select(this.scatterChartEl)
        .select('.scatter-sub-title')
        .attr('data-testid', 'sub-title');
      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');
      this.gridG.attr('data-testid', 'scatter-grid-group');

      this.fitLine.attr('data-testid', 'scatter-fit-line-group');
      this.references.attr('data-testid', 'scatter-reference-line-group');

      this.dotG.attr('data-testid', 'marker-group-container');
      this.updatePointWrappers
        .attr('data-testid', 'marker-series-group')
        .attr('data-id', d => `marker-series-${d.key}`);
      this.updatePoints
        .attr('data-testid', 'marker')
        .attr('data-id', d => `marker-${d[this.groupAccessor]}-${d[this.xAccessor]}-${d[this.yAccessor]}`);

      this.labelG.attr('data-testid', 'dataLabel-group-container');
      this.updatingLabelGroups
        .attr('data-testid', 'dataLabel-series-group')
        .attr('data-id', d => `label-series-${d.key}`);
      this.updateLabels
        .attr('data-testid', 'dataLabel')
        .attr('data-id', d => `label-${d[this.groupAccessor]}-${d[this.xAccessor]}-${d[this.yAccessor]}`);

      this.svg.select('defs').attr('data-testid', 'pattern-defs');
    } else {
      select(this.scatterChartEl)
        .select('.visa-viz-d3-scatter-container')
        .attr('data-testid', null);
      select(this.scatterChartEl)
        .select('.scatter-main-title')
        .attr('data-testid', null);
      select(this.scatterChartEl)
        .select('.scatter-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);
      this.gridG.attr('data-testid', null);

      this.fitLine.attr('data-testid', null);
      this.references.attr('data-testid', null);

      this.dotG.attr('data-testid', null);
      this.updatePointWrappers.attr('data-testid', null).attr('data-id', null);
      this.updatePoints.attr('data-testid', null).attr('data-id', null);

      this.labelG.attr('data-testid', null);
      this.updatingLabelGroups.attr('data-testid', null).attr('data-id', null);
      this.updateLabels.attr('data-testid', null).attr('data-id', null);

      this.svg.select('defs').attr('data-testid', null);
    }
  }

  enterPointGroups() {
    this.enterPointWrappers.interrupt();
    this.enterPoints.interrupt();

    this.enterPointWrappers
      .attr('class', 'series-point-group')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on(
        'mouseover',
        this.groupInteraction && !this.suppressEvents
          ? (d, i, n) => this.onHoverHandler(d.values ? d.values[0] : d, n[i], true)
          : null
      )
      .on('mouseout', this.groupInteraction && !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .each((_, i, n) => {
        initializeElementAccess(n[i]);
      });

    this.enterPoints
      .attr('class', 'data-point entering')
      .style('mix-blend-mode', 'multiply')
      .attr('filter', this.filter)
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      })
      .on('click', (d, i, n) => this.onClickHandler(d, n[i]))
      .on('mouseover', (d, i, n) => this.onHoverHandler(d, n[i]))
      .on('mouseout', () => this.onMouseOutHandler())
      .attr('opacity', 0)
      .attr('stroke', this.handleDotStyle)
      .attr('d', d =>
        this.groupAccessor ? symbols[this.symbol(d[this.groupAccessor])].general : symbols[this.dotSymbols[0]].general
      )
      .attr(
        'transform',
        d => 'translate(' + this.x(d[this.xAccessor]) + ',' + this.y(d[this.yAccessor]) + ') scale(1)'
      );
    this.updatePointWrappers.order();
    this.updatePoints.order();
  }

  // updatePointGroups() {
  //   this.updatePointWrappers.interrupt();
  // }

  exitPointGroups() {
    this.exitPointWrappers.interrupt();
    this.exitPoints.interrupt();

    this.exitPointWrappers
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn);

    this.exitPointWrappers
      .selectAll('.data-point')
      .attr('filter', null)
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr('transform', (_, i, n) => {
        const transform = select(n[i]).attr('transform');
        const index = transform.indexOf('scale(');
        return transform.substring(0, index) + 'scale(1)';
      })
      .call(transitionEndAll, () => {
        this.exitPointWrappers.remove();
      });

    this.exitPoints
      .attr('filter', null)
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr('transform', (_, i, n) => {
        const transform = select(n[i]).attr('transform');
        const index = transform.indexOf('scale(');
        return transform.substring(0, index) + 'scale(1)';
      });

    this.updatePoints
      .transition('accessibilityAfterExit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exitPoints.remove();
        this.exitPointWrappers.remove();
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

  drawPointGroups() {
    this.updatePoints
      .each((d, i, n) => {
        const me = select(n[i]);
        const xChange = +me.attr('data-x') !== this.x(d[this.xAccessor]);
        const yChange = +me.attr('data-y') !== this.y(d[this.yAccessor]);
        const rChange =
          +me.attr('data-r') !==
            this.size(
              d[this.sizeConfig.sizeAccessor] *
                this.shapeArea[this.groupAccessor ? d[this.groupAccessor] : '']['toCircle']
            ) ||
          this.dotRadius ||
          1;
        if (xChange || yChange || rChange) {
          me.attr('filter', null);
          me.classed('moving', true);
        }
      })
      .attr('data-r', d => {
        return (
          this.size(
            d[this.sizeConfig.sizeAccessor] *
              this.shapeArea[this.groupAccessor ? d[this.groupAccessor] : '']['toCircle']
          ) ||
          this.dotRadius ||
          1
        );
      })
      .attr('data-x', d => this.x(d[this.xAccessor]))
      .attr('data-y', d => this.y(d[this.yAccessor]))
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .attr('data-d', (
        d // we can use base symbol here, it is much simplier and more performant
      ) => (this.groupAccessor ? symbols[this.symbol(d[this.groupAccessor])].base : symbols[this.dotSymbols[0]].base))
      .transition('update_d')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('d', d =>
        this.groupAccessor ? symbols[this.symbol(d[this.groupAccessor])].general : symbols[this.dotSymbols[0]].general
      )
      .attr(
        'transform',
        d =>
          'translate(' +
          this.x(d[this.xAccessor]) +
          ',' +
          this.y(d[this.yAccessor]) +
          ') scale(' +
          (this.size(
            d[this.sizeConfig.sizeAccessor] *
              this.shapeArea[this.groupAccessor ? d[this.groupAccessor] : '']['toCircle']
          ) ||
            this.dotRadius ||
            1) +
          ')'
      )
      .call(transitionEndAll, () => {
        setTimeout(() => {
          this.updatePointWrappers
            .selectAll('.moving')
            .classed('moving', false)
            .attr('filter', this.filter);

          // this.updatingLabelGroups
          //   .selectAll('.moving')
          //   .classed('moving', false)
          //   .attr('filter', this.textFilter);
        }, 0);

        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });

        // now we can emit the event that transitions are complete
        this.transitionEndEvent.emit({ chartID: this.chartID });
      });
  }

  setDotRadius() {
    this.updatePoints
      .transition('radius')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr(
        'transform',
        d =>
          'translate(' +
          this.x(d[this.xAccessor]) +
          ',' +
          this.y(d[this.yAccessor]) +
          ') scale(' +
          (this.size(
            d[this.sizeConfig.sizeAccessor] *
              this.shapeArea[this.groupAccessor ? d[this.groupAccessor] : '']['toCircle']
          ) ||
            this.dotRadius ||
            1) +
          ')'
      )
      .call(transitionEndAll, () => {
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
      });
  }

  setSelectedClass() {
    this.updatePoints.classed('highlight', (d, i, n) => {
      let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
      selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
      const selectable = this.accessibility.elementsAreInterface;
      setElementInteractionAccessState(n[i], selected, selectable);
      return selected;
    });
  }

  updateCursor() {
    this.updatePointWrappers.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updatingLabelGroups.attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null);
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

  drawXAxis() {
    const axisLabel =
      this.xAxis.label || this.xAxis.label === ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[this.xAccessor]
        ? this.dataKeyNames[this.xAccessor]
        : this.xAxis.label;

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: axisLabel, // this.xAxis.label,
      padding: this.padding,
      hide: !this.xAxis.visible,
      duration: this.duration
    });
  }

  drawYAxis() {
    const axisLabel =
      this.yAxis.label && this.yAxis.label !== ''
        ? this.yAxis.label
        : this.dataKeyNames && this.dataKeyNames[this.yAccessor]
        ? this.dataKeyNames[this.yAccessor]
        : this.yAxis.label;

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      format: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: axisLabel, // this.yAxis.label,
      padding: this.padding,
      hide: !this.yAxis.visible,
      duration: this.duration
    });
  }

  setXAxisAccessibility() {
    const axisLabel =
      this.xAxis.label || this.xAxis.label === ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[this.xAccessor]
        ? this.dataKeyNames[this.xAccessor]
        : this.xAxis.label;

    setAccessXAxis({
      rootEle: this.scatterChartEl,
      hasXAxis: this.xAxis ? this.xAxis.visible : false,
      xAxis: this.x,
      xAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasXAxis is always false
    });
  }

  setYAxisAccessibility() {
    const axisLabel =
      this.yAxis.label && this.yAxis.label !== ''
        ? this.yAxis.label
        : this.dataKeyNames && this.dataKeyNames[this.yAccessor]
        ? this.dataKeyNames[this.yAccessor]
        : this.yAxis.label;

    setAccessYAxis({
      rootEle: this.scatterChartEl,
      hasYAxis: this.yAxis ? this.yAxis.visible : false,
      yAxis: this.y,
      yAxisLabel: axisLabel ? axisLabel : ''
    });
  }

  drawBaselineY() {
    drawAxis({
      root: this.gridG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      padding: this.padding,
      markOffset: this.x(0) || -1,
      hide: !this.showBaselineY,
      duration: this.duration
    });
  }

  drawBaselineX() {
    drawAxis({
      root: this.gridG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      padding: this.padding,
      markOffset: this.y(0) || -1,
      hide: !this.showBaselineX,
      duration: this.duration
    });
  }

  drawXGrid() {
    drawGrid(
      this.gridG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.x,
      false,
      !this.xAxis.gridVisible,
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
      !this.yAxis.gridVisible,
      this.yAxis.tickInterval,
      this.duration
    );
  }

  bindLegendInteractivity() {
    select(this.scatterChartEl)
      .selectAll('.legend')
      .on(
        'click',
        this.legend.interactive && !this.suppressEvents
          ? (d, i, n) => this.onClickHandler(d.values ? d.values[0] : d, n[i])
          : null
      )
      .on(
        'mouseover',
        this.legend.interactive && !this.suppressEvents
          ? (d, i, n) => this.onHoverHandler(d.values ? d.values[0] : d, n[i], true)
          : null
      )
      .on('mouseout', this.legend.interactive && !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  setLegendCursor() {
    select(this.scatterChartEl)
      .selectAll('.legend')
      .style('cursor', this.legend.interactive && !this.suppressEvents ? this.cursor : null);
  }

  bindInteractivity() {
    this.enterPointWrappers
      .on(
        'mouseover',
        this.groupInteraction && !this.suppressEvents
          ? (d, i, n) => this.onHoverHandler(d.values ? d.values[0] : d, n[i], true)
          : null
      )
      .on('mouseout', this.groupInteraction && !this.suppressEvents ? () => this.onMouseOutHandler() : null);
    this.updatePoints
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
    this.updateLabels
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  enterDataLabels() {
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.enteringLabelGroups
      .attr('class', 'series-dataLabel-group')
      .attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null);

    this.enterLabels
      .attr('filter', this.textFilter)
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
      .attr('class', 'scatter-dataLabel entering')
      .attr('fill', this.textFillHandler)
      .on('click', !this.suppressEvents && this.dataLabel.visible ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        !this.suppressEvents && this.dataLabel.visible ? (d, i, n) => this.onHoverHandler(d, n[i]) : null
      )
      .on('mouseout', !this.suppressEvents && this.dataLabel.visible ? () => this.onMouseOutHandler() : null);

    placeDataLabels({
      root: this.enterLabels,
      xScale: this.x,
      yScale: this.y,
      sizeScale: this.size,
      ordinalAccessor: this.xAccessor,
      valueAccessor: this.yAccessor,
      groupAccessor: this.groupAccessor,
      sizeAccessor: this.sizeConfig.sizeAccessor,
      shapeArea: this.shapeArea,
      placement: this.dataLabel.placement,
      chartType: 'scatter',
      labelOffset: this.dotRadius
    });
  }

  updateDataLabels() {
    this.updateLabels.interrupt();

    const opacity = this.dataLabel.visible ? 1 : 0;

    // this.updatingLabelGroups
    //   .transition('opacity_g')
    //   .duration(this.duration)
    //   .ease(easeCircleIn)
    //   .call(transitionEndAll, () => {
    //     this.updatingLabelGroups.classed('entering', false);
    //   });

    this.updateLabels
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      // .duration((_, i, n) => {
      //   if (select(n[i]).classed('entering')) {
      //     select(n[i]).classed('entering', false);
      //     return this.duration;
      //   } else {
      //     return 0;
      //   }
      // })
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
          : 1;
      }) // ensure that entering class is getting removed after enter
      .call(transitionEndAll, (_, i, n) => {
        select(n[i]).classed('entering', false);
      });
  }

  exitDataLabels() {
    // this.exitingLabelGroups
    //   .transition('exit')
    //   .duration(this.duration)
    //   .ease(easeCircleIn)
    //   .remove();

    this.exitingLabelGroups
      .selectAll('.scatter-dataLabel')
      .attr('filter', null)
      .transition('exit')
      .duration(this.duration / 3)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitingLabelGroups.remove();
      });

    this.exitLabels
      .attr('filter', null)
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', 0)
      .remove();
  }

  drawDataLabels() {
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    this.updateLabels.text(d => {
      return formatDataLabel(d, this.innerLabelAccessor, this.innerLabelFormat);
    });

    const labelSettingUpdate = this.updateLabels
      // .each((d, i, n) => {
      //   const me = select(n[i]);
      //   const xOffset =
      //     this.dataLabel.placement === 'left'
      //       ? -this.dotRadius
      //       : this.dataLabel.placement === 'right'
      //       ? this.dotRadius
      //       : 0;
      //   const yOffset =
      //     this.dataLabel.placement === 'top'
      //       ? -this.dotRadius
      //       : this.dataLabel.placement === 'bottom'
      //       ? this.dotRadius
      //       : 0;
      //   const xChange = +me.attr('x') !== this.x(d[this.xAccessor]) + xOffset;
      //   const yChange = +me.attr('y') !== this.y(d[this.yAccessor]) + yOffset;
      //   if (xChange || yChange) {
      //     me.attr('filter', null);
      //     me.classed('moving', true);
      //   }
      // })
      .style('visibility', (_, i, n) =>
        this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly
          ? select(n[i]).style('visibility')
          : null
      )
      .attr('data-x', d => this.x(d[this.xAccessor]))
      .attr('data-y', d => this.y(d[this.yAccessor]))
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration);

    this.bitmaps = placeDataLabels({
      root: labelSettingUpdate,
      xScale: this.x,
      yScale: this.y,
      sizeScale: this.size,
      ordinalAccessor: this.xAccessor,
      valueAccessor: this.yAccessor,
      groupAccessor: this.groupAccessor,
      sizeAccessor: this.sizeConfig.sizeAccessor,
      shapeArea: this.shapeArea,
      placement: this.dataLabel.placement,
      chartType: 'scatter',
      labelOffset: this.dotRadius + this.dotRadius * 0.25,
      avoidCollision: {
        runOccupancyBitmap: this.dataLabel.visible && this.dataLabel.placement === 'auto',
        labelSelection: labelSettingUpdate,
        avoidMarks: [this.updatePoints],
        validPositions: hideOnly
          ? ['middle']
          : ['middle', 'top', 'bottom', 'left', 'right', 'bottom-right', 'bottom-left', 'top-left', 'top-right'],
        offsets: hideOnly ? [1] : [1, 5, 4, 4, 1, 1, 1, 1, 1],
        accessors: [this.xAccessor, this.yAccessor, this.groupAccessor, 'key'], // key is created for lines by nesting done in line,
        size: [roundTo(this.width, 0), roundTo(this.height, 0)],
        hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly
      }
    });
  }

  updateInteractionState() {
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.updatePoints.interrupt('opacity');
    // this.updateLabels.interrupt('opacity');

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    this.updatePoints.attr('stroke', this.handleDotStyle);
    this.updateLabels.attr('fill', this.textFillHandler);
    retainAccessFocus({
      parentGNode: this.rootG.node()
    });

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
  }

  setPointOpacity() {
    this.updatePoints.interrupt();

    this.updatePoints
      .transition('opacity')
      // .duration(this.duration)
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          select(n[i]).classed('entering', false);
          return this.duration;
        } else {
          return 0;
        }
      })
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(
          d,
          this.dotOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        )
      )
      .call(transitionEndAll, (_, i, n) => {
        select(n[i]).classed('entering', false);
      });
  }

  setLabelOpacity() {
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;
    const addCollisionClass = this.dataLabel.placement === 'auto' || hideOnly;

    this.updateLabels
      .attr('data-use-dx', hideOnly) // need this for direct resolveCollision call
      .attr('data-use-dy', hideOnly)
      .attr('opacity', (d, i, n) => {
        const prevOpacity = +select(n[i]).attr('opacity');
        const styleVisibility = select(n[i]).style('visibility');
        const targetOpacity =
          checkInteraction(
            d,
            this.dataLabel.visible ? 1 : 0,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          ) < 1
            ? 0
            : 1;
        if (
          ((targetOpacity === 1 && styleVisibility === 'hidden') || prevOpacity !== targetOpacity) &&
          (this.dataLabel.placement === 'auto' || hideOnly)
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

    if (addCollisionClass) {
      const labelsAdded = this.updateLabels.filter((_, i, n) => select(n[i]).classed('collision-added'));
      const labelsRemoved = this.updateLabels.filter((_, i, n) => select(n[i]).classed('collision-removed')); // .transition().duration(0);

      // we can now remove labels as well if we need to...
      if (labelsRemoved.size() > 0) {
        this.bitmaps = resolveLabelCollision({
          bitmaps: this.bitmaps,
          labelSelection: labelsRemoved,
          avoidMarks: [], // [this.updateDots], // this will link the series label to the last point in the line
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
        this.bitmaps = placeDataLabels({
          root: labelsAdded,
          xScale: this.x,
          yScale: this.y,
          sizeScale: this.size,
          ordinalAccessor: this.xAccessor,
          valueAccessor: this.yAccessor,
          groupAccessor: this.groupAccessor,
          sizeAccessor: this.sizeConfig.sizeAccessor,
          shapeArea: this.shapeArea,
          placement: this.dataLabel.placement,
          chartType: 'scatter',
          labelOffset: this.dotRadius + this.dotRadius * 0.25,
          avoidCollision: {
            runOccupancyBitmap: this.dataLabel.visible && this.dataLabel.placement === 'auto',
            bitmaps: this.bitmaps,
            labelSelection: labelsAdded,
            avoidMarks: [this.updatePoints],
            validPositions: hideOnly
              ? ['middle']
              : ['middle', 'top', 'bottom', 'left', 'right', 'bottom-right', 'bottom-left', 'top-left', 'top-right'],
            offsets: hideOnly ? [1] : [1, 5, 4, 4, 1, 1, 1, 1, 1],
            accessors: [this.xAccessor, this.yAccessor, this.groupAccessor, 'key'], // key is created for lines by nesting done in line,
            size: [roundTo(this.width, 0), roundTo(this.height, 0)],
            hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly,
            suppressMarkDraw: true
          }
        });

        // remove temporary class now
        labelsAdded.classed('collision-added', false);
      }
    }
  }

  drawFitLine() {
    const fitlineOpacity = this.showFitLine ? this.fitLineStyle.opacity : 0;

    const xSeries = this.data.map(d => parseFloat(d[this.xAccessor]));
    const ySeries = this.data.map(d => parseFloat(d[this.yAccessor]));
    const leastSquaresCoeff = leastSquares(xSeries, ySeries);

    const slope = leastSquaresCoeff[0];
    const intercept = leastSquaresCoeff[1];

    const currentFitLine = this.fitLine.selectAll('line').data(leastSquaresCoeff);

    const enterFitLine = currentFitLine
      .enter()
      .append('line')
      .attr('class', 'trendline')
      .attr('opacity', 0);

    currentFitLine
      .merge(enterFitLine)
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('x1', this.x(this.xMin))
      .attr('y1', this.y(intercept)) // intercept
      .attr('x2', this.x(this.xMax))
      .attr('y2', this.y(this.xMax * slope + intercept)) // this.xMax * slope + intercept
      .style('stroke', visaColors[this.fitLineStyle.color] || this.fitLineStyle.color)
      .style('stroke-width', this.fitLineStyle.strokeWidth)
      .attr('stroke-dasharray', this.fitLineStyle.dashed ? this.fitLineStyle.dashed : '')
      .attr('opacity', fitlineOpacity);

    currentFitLine.exit().remove();
  }

  drawReferenceLines() {
    const currentReferences = this.references.selectAll('g').data(this.referenceLines, d => d.label);

    const enterReferences = currentReferences
      .enter()
      .append('g')
      .attr('class', 'scatter-reference')
      .attr('opacity', 1);

    const enterLines = enterReferences.append('line');

    enterLines
      // .attr('id', (_, i) => 'reference-line-' + i)
      .attr('class', 'scatter-reference-line')
      .attr('opacity', 0);

    const enterRefLabels = enterReferences.append('text');

    enterRefLabels
      // .attr('id', (_, i) => 'reference-line-' + i + '-label')
      .attr('class', 'scatter-reference-line-label')
      .attr('opacity', 0);

    const mergeReferences = currentReferences.merge(enterReferences);

    const mergeLines = mergeReferences
      .selectAll('.scatter-reference-line')
      .data(d => [d])
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    const mergeRefLabels = mergeReferences
      .selectAll('.scatter-reference-line-label')
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

    // update reference lines
    mergeReferences
      .transition('merge')
      .ease(easeCircleIn)
      .duration(this.duration);

    enterLines
      .attr('x1', d => (d.axis === 'x' ? this.x(d.value) : 0))
      .attr('x2', d => (d.axis === 'x' ? this.x(d.value) : this.innerPaddedWidth))
      .attr('y1', d => (d.axis === 'x' ? 0 : this.y(d.value)))
      .attr('y2', d => (d.axis === 'x' ? this.innerPaddedHeight : this.y(d.value)));

    enterRefLabels
      .attr('text-anchor', d => (d.placement === 'right' ? 'start' : d.placement === 'left' ? 'end' : 'middle'))
      .attr('x', d => (d.placement === 'right' ? this.innerPaddedWidth : d.placement === 'left' ? 0 : this.x(d.value)))
      .attr('dx', d => (d.placement === 'right' ? '0.1em' : d.placement === 'left' ? '-0.1em' : 0))
      .attr('y', d => (d.placement === 'top' ? 0 : d.placement === 'bottom' ? this.innerPaddedHeight : this.y(d.value)))
      .attr('dy', d => (d.placement === 'top' ? '-0.3em' : d.placement === 'bottom' ? '1.3em' : '0.3em'));

    mergeLines
      .attr('x1', d => (d.axis === 'x' ? this.x(d.value) : 0))
      .attr('x2', d => (d.axis === 'x' ? this.x(d.value) : this.innerPaddedWidth))
      .attr('y1', d => (d.axis === 'x' ? 0 : this.y(d.value)))
      .attr('y2', d => (d.axis === 'x' ? this.innerPaddedHeight : this.y(d.value)));

    mergeRefLabels
      .attr('text-anchor', d => (d.placement === 'right' ? 'start' : d.placement === 'left' ? 'end' : 'middle'))
      .attr('x', d => (d.placement === 'right' ? this.innerPaddedWidth : d.placement === 'left' ? 0 : this.x(d.value)))
      .attr('dx', d => (d.placement === 'right' ? '0.1em' : d.placement === 'left' ? '-0.1em' : 0))
      .attr('y', d => (d.placement === 'top' ? 0 : d.placement === 'bottom' ? this.innerPaddedHeight : this.y(d.value)))
      .attr('dy', d => (d.placement === 'top' ? '-0.3em' : d.placement === 'bottom' ? '1.3em' : '0.3em'));

    mergeLines
      .style('stroke', visaColors[this.referenceStyle.color] || this.referenceStyle.color)
      .style('stroke-width', this.referenceStyle.strokeWidth)
      .attr('stroke-dasharray', this.referenceStyle.dashed ? this.referenceStyle.dashed : '')
      .style('opacity', this.referenceStyle.opacity);

    mergeRefLabels
      .style('fill', visaColors[this.referenceStyle.color] || this.referenceStyle.color)
      .style('opacity', this.referenceStyle.opacity);
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.x,
      xAccessor: this.xAccessor,
      yScale: this.y,
      yAccessor: this.yAccessor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      margin: this.margin,
      bitmaps: this.bitmaps
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.getLanguageString(), this.scatterChartEl, this.annotations);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      language: this.getLanguageString(),
      rootEle: this.scatterChartEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'scatter-plot',
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
      chartTag: 'scatter-plot',
      language: this.getLanguageString(),
      node: this.svg.node(),
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'point',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: this.innerScopeDataKeys(),
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      groupName: 'scatter-group',
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
    this.updatePoints.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    const keys = this.innerScopeDataKeys();
    this.updatePoints.each((_d, i, n) => {
      setElementFocusHandler({
        chartTag: 'scatter-plot',
        language: this.getLanguageString(),
        node: n[i],
        geomType: 'point',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        dataKeyNames: this.dataKeyNames,
        groupName: 'scatter-group',
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
    this.updatePointWrappers.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.getLanguageString(), this.scatterChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.getLanguageString(), this.scatterChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.getLanguageString(), this.scatterChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.getLanguageString(), this.scatterChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.getLanguageString(), this.scatterChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.getLanguageString(), this.scatterChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.getLanguageString(), this.scatterChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.scatterChartEl,
      parentGNode: this.dotG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'scatter-plot',
      geomType: 'point',
      groupName: 'scatter group'
      // recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.getLanguageString(), this.scatterChartEl, this.accessibility.structureNotes);
  }
  // new accessibility stuff ends here

  drawLegendElements() {
    // if we have default series access and it is not in the data don't show legend
    const noGroupAccessor =
      this.groupAccessor === ScatterPlotDefaultValues.groupAccessor &&
      this.nest &&
      this.nest.length === 1 &&
      this.nest[0].key === 'undefined';

    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.top + 20,
      colorArr: this.rawColors,
      baseColorArr: this.colorArr,
      hideStrokes: this.accessibility.hideStrokes,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: 'scatter',
      fontSize: 16,
      data: this.nest,
      label: this.legend.labels,
      symbol: this.dotSymbols,
      hide: !((this.legend.visible && !noGroupAccessor) || !this.legend || !this.groupAccessor),
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.groupAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.innerHoverStyle,
      clickStyle: this.innerClickStyle,
      hoverOpacity: this.hoverOpacity
    });
  }

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
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      sizeConfig: this.sizeConfig,
      xAccessor: this.xAccessor,
      yAccessor: this.yAccessor,
      chartType: 'scatter'
    });
  }

  render() {
    this.drawStartEvent.emit({ chartID: this.chartID });
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
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateLayout) {
      this.setLayoutData();
      this.shouldUpdateLayout = false;
    }
    if (this.shouldValidateClickStyle) {
      this.validateClickStyle();
      this.shouldValidateClickStyle = false;
    }
    if (this.shouldValidateHoverStyle) {
      this.validateHoverStyle();
      this.shouldValidateHoverStyle = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
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
    if (this.shouldUpdateTableData) {
      this.setTableData();
      this.shouldUpdateTableData = false;
    }
    if (this.shouldValidate) {
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.shouldValidate = false;
    }
    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the Stencil bug is fixed)

    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <this.topLevel class="scatter-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions scatter-sub-title vcl-sub-title" />
          <div class="scatter-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'point'}
            groupName={'scatter group'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
            language={this.getLanguageString()}
            chartTag={'scatter-plot'}
            width={this.width - (this.margin ? this.margin.right || 0 : 0)}
            isInteractive={this.accessibility.elementsAreInterface}
            hasCousinNavigation
            disabled={
              this.suppressEvents &&
              this.accessibility.elementsAreInterface === false &&
              this.accessibility.keyboardNavConfig &&
              this.accessibility.keyboardNavConfig.disabled
            } // the chart is "simple"
          />
          <div class="visa-viz-d3-scatter-container" />
          <div class="scatter-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
          <data-table
            uniqueID={this.chartID}
            isCompact
            language={this.getLanguageString()}
            tableColumns={this.tableColumns}
            data={this.tableData}
            dataKeyNames={this.dataKeyNames}
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
    const keys = Object.keys(ScatterPlotDefaultValues);
    let i = 0;
    const exceptions = {
      showFitLine: {
        exception: false
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
      },
      groupAccessor: {
        exception: ''
      },
      hoverOpacity: {
        exception: 0
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : ScatterPlotDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
