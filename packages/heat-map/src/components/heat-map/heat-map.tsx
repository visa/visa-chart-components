/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, Event, EventEmitter, h } from '@stencil/core';
import { select, event } from 'd3-selection';
import { min, max } from 'd3-array';
import { scaleBand, scaleQuantize } from 'd3-scale';
import { easeCircleIn } from 'd3-ease';
import { nest } from 'd3-collection';
import {
  IBoxModelType,
  ILocalizationType,
  IHoverStyleType,
  IClickStyleType,
  IAxisType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  IAnimationConfig,
  ILegendType,
  ISubTitleType
} from '@visa/charts-types';
import { HeatMapDefaultValues } from './heat-map-default-values';
import 'd3-transition';
import { v4 as uuid } from 'uuid';
import Utils from '@visa/visa-charts-utils';

const {
  getGlobalInstances,
  configLocalization,
  getActiveLanguageString,
  calculateLuminance,
  prepareStrokeColorsFromScheme,
  verifyTextHasSpace,
  checkAttributeTransitions,
  createTextStrokeFilter,
  drawHoverStrokes,
  removeHoverStrokes,
  buildStrokes,
  convertColorsToTextures,
  findTagLevel,
  prepareRenderChange,
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
  checkInteraction,
  checkClicked,
  checkHovered,
  convertVisaColor,
  drawAxis,
  drawLegend,
  drawTooltip,
  formatStats,
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
  validateAccessibilityProps,
  validateLocalizationProps,
  setSubTitle
} = Utils;

@Component({
  tag: 'heat-map',
  styleUrl: 'heat-map.scss'
})
export class HeatMap {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) localization: ILocalizationType = HeatMapDefaultValues.localization;
  @Prop({ mutable: true }) mainTitle: string = HeatMapDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string | ISubTitleType = HeatMapDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = HeatMapDefaultValues.height;
  @Prop({ mutable: true }) width: number = HeatMapDefaultValues.width;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = HeatMapDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) margin: IBoxModelType = HeatMapDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = HeatMapDefaultValues.padding;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) xAccessor: string = HeatMapDefaultValues.xAccessor;
  @Prop({ mutable: true }) yAccessor: string = HeatMapDefaultValues.yAccessor;
  @Prop({ mutable: true }) valueAccessor: string = HeatMapDefaultValues.valueAccessor;
  @Prop({ mutable: true }) xKeyOrder: string[];
  @Prop({ mutable: true }) yKeyOrder: string[];

  // Axis (3/7)
  @Prop({ mutable: true }) xAxis: IAxisType = HeatMapDefaultValues.xAxis;
  @Prop({ mutable: true }) yAxis: IAxisType = HeatMapDefaultValues.yAxis;
  @Prop({ mutable: true }) wrapLabel: boolean = HeatMapDefaultValues.wrapLabel;
  @Prop({ mutable: true }) hideAxisPath: boolean = HeatMapDefaultValues.hideAxisPath;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = HeatMapDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) colorSteps: number = HeatMapDefaultValues.colorSteps;
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = HeatMapDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = HeatMapDefaultValues.clickStyle;
  @Prop({ mutable: true }) cursor: string = HeatMapDefaultValues.cursor;
  @Prop({ mutable: true }) shape: string = HeatMapDefaultValues.shape;
  @Prop({ mutable: true }) hoverOpacity: number = HeatMapDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = HeatMapDefaultValues.animationConfig;
  @Prop({ mutable: true }) strokeWidth: number = HeatMapDefaultValues.strokeWidth;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = HeatMapDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) showTooltip: boolean = HeatMapDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = HeatMapDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = HeatMapDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = HeatMapDefaultValues.legend;
  @Prop({ mutable: true }) annotations: object[] = HeatMapDefaultValues.annotations;

  // Calculation (6/7)
  @Prop({ mutable: true }) maxValueOverride: number;
  @Prop({ mutable: true }) minValueOverride: number;

  // Interactivity (7/7)
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = HeatMapDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];
  @Prop({ mutable: true }) suppressEvents: boolean = HeatMapDefaultValues.suppressEvents;

  // Testing (8/7)
  @Prop() unitTest: boolean = false;
  //  @Prop() debugMode: boolean = false;

  // Element
  @Element()
  heatMapEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  shouldValidateLocalization: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  tooltipG: any;
  subTitleG: any;
  map: any;
  row: any;
  labelG: any;
  labels: any;
  defaults: boolean;
  current: any;
  enter: any;
  exit: any;
  update: any;
  enterRowWrappers: any;
  updateRowWrappers: any;
  exitRowWrappers: any;
  enteringLabelGroups: any;
  exitingLabelGroups: any;
  updatingLabelGroups: any;
  enterLabels: any;
  updateLabels: any;
  exitLabels: any;
  heat: any;
  rawHeat: any;
  fillColors: any;
  strokeColors: any;
  y: any;
  x: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  nest: any = [];
  datakeys: any = [];
  colorArr: any;
  preparedColors: any;
  duration: number;
  legendG: any;
  preppedData: any;
  interpolating: any;
  tableData: any;
  tableColumns: any;
  updateCheck: any;
  // these are added for accessibility
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  chartID: string;
  xAxisElement: any;
  innerInteractionKeys: any;
  shouldValidate: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetDimensions: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldResetRoot: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetSubTitle: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldFormatClickHighlight: boolean = false;
  shouldFormatHoverHighlight: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldUpdateXAxis: boolean = false;
  shouldUpdateYAxis: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldSwapXAxis: boolean = false;
  shouldSwapYAxis: boolean = false;
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
  shouldSetLocalizationConfig: boolean = false;
  strokes: any = {};
  topLevel: string = 'h2';
  bottomLevel: string = 'p';

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldUpdateScales = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetLabelOpacity = true;
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
    // this.chartID = newID;
    // this.heatMapEl.id = this.chartID;
    // this.shouldValidate = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldUpdateLegend = true;
    // this.shouldSetTextures = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetStrokes = true;
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
    this.shouldSetDimensions = true;
    this.shouldUpdateScales = true;
    this.shouldSetTextures = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('xAccessor')
  xAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldFormatClickHighlight = true;
    this.shouldFormatHoverHighlight = true;
    this.shouldDrawInteractionState = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('yAccessor')
  yAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldFormatClickHighlight = true;
    this.shouldFormatHoverHighlight = true;
    this.shouldDrawInteractionState = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('valueAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateLegend = true;
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateLabels = true;
    this.shouldSetGeometryAriaLabels = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('xKeyOrder')
  xKeyOrderWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateXAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetXAxisAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('yKeyOrder')
  yKeyOrderWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateYAxis = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetYAxisAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('xAxis')
  xAxisWatcher(_newVal, _oldVal) {
    const newFormatVal = _newVal && _newVal.format ? _newVal.format : false;
    const oldFormatVal = _oldVal && _oldVal.format ? _oldVal.format : false;
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    if (newFormatVal !== oldFormatVal) {
      this.shouldUpdateData = true;
      this.shouldSetColors = true;
      this.shouldUpdateScales = true;
      this.shouldSetTextures = true;
      this.shouldSetGlobalSelections = true;
      this.shouldFormatClickHighlight = true;
      this.shouldFormatHoverHighlight = true;
      this.shouldDrawInteractionState = true;
      this.shouldEnterUpdateExit = true;
      this.shouldUpdateTableData = true;
      this.shouldUpdateGeometries = true;
      this.shouldUpdateLabels = true;
      this.shouldUpdateLegend = true;
      this.shouldUpdateAnnotations = true;
    }
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldSwapXAxis = true;
    }
    this.shouldUpdateXAxis = true;
    this.shouldSetXAxisAccessibility = true;
  }

  @Watch('yAxis')
  yAxisWatcher(_newVal, _oldVal) {
    const newFormatVal = _newVal && _newVal.format ? _newVal.format : false;
    const oldFormatVal = _oldVal && _oldVal.format ? _oldVal.format : false;
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    if (newFormatVal !== oldFormatVal) {
      this.shouldUpdateData = true;
      this.shouldSetColors = true;
      this.shouldUpdateScales = true;
      this.shouldSetTextures = true;
      this.shouldSetGlobalSelections = true;
      this.shouldFormatClickHighlight = true;
      this.shouldFormatHoverHighlight = true;
      this.shouldDrawInteractionState = true;
      this.shouldEnterUpdateExit = true;
      this.shouldUpdateTableData = true;
      this.shouldUpdateGeometries = true;
      this.shouldUpdateLabels = true;
      this.shouldUpdateLegend = true;
      this.shouldUpdateAnnotations = true;
    }
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldSwapYAxis = true;
    }
    this.shouldUpdateYAxis = true;
    this.shouldSetYAxisAccessibility = true;
  }

  @Watch('wrapLabel')
  wrapLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
  }

  @Watch('hideAxisPath')
  hideAxisPathWatcher(_newVal, _oldVal) {
    this.shouldUpdateXAxis = true;
    this.shouldUpdateYAxis = true;
  }

  @Watch('colorPalette')
  @Watch('colors')
  @Watch('colorSteps')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateLegend = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
  }

  @Watch('shape')
  shapeWatcher(_newVal, _oldVal) {
    this.shouldUpdateGeometries = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
  }

  @Watch('strokeWidth')
  strokeWidthWatcher(_newVal, _oldVal) {
    this.shouldUpdateGeometries = true;
    this.shouldUpdateScales = true;
    this.shouldSetTextures = true;
    this.shouldUpdateGeometries = true;
    this.shouldSetStrokes = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldSetLabelOpacity = true;
    this.shouldDrawInteractionState = true;
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldUpdateTableData = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    // this.shouldDrawInteractionState = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('legend')
  legendWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegend = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
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
    const newTextures = _newVal && _newVal.hideTextures ? _newVal.hideTextures : false;
    const oldTextures = _oldVal && _oldVal.hideTextures ? _oldVal.hideTextures : false;
    const newExTextures = _newVal && _newVal.showExperimentalTextures ? _newVal.showExperimentalTextures : false;
    const oldExTextures = _oldVal && _oldVal.showExperimentalTextures ? _oldVal.showExperimentalTextures : false;
    if (newTextures !== oldTextures || newExTextures !== oldExTextures) {
      this.shouldSetTextures = true;
      this.shouldUpdateLegend = true;
      this.shouldSetStrokes = true;
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

  @Watch('maxValueOverride')
  @Watch('minValueOverride')
  valueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetTextures = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldFormatClickHighlight = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldFormatHoverHighlight = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
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

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    const chartID = this.uniqueID || 'heat-map-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.heatMapEl.id = this.chartID;
      this.setLocalizationConfig();
      this.setTagLevels();
      this.prepareData();
      this.setDimensions();
      this.setColors();
      this.prepareScales();
      this.validateInteractionKeys();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.formatClickHighlight();
      this.formatHoverHighlight();
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
      this.setSubTitleElements();
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
      this.drawDataLabels();
      this.drawLegendElements();
      this.setSelectedClass();
      this.updateInteractionState();
      this.bindInteractivity();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.drawXAxis();
      this.setXAxisAccessibility();
      this.drawYAxis();
      this.setYAxisAccessibility();
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.map.node());
      this.setGroupAccessibilityID();
      this.onChangeHandler();
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
      if (this.shouldUpdateLegend) {
        this.drawLegendElements();
        this.shouldUpdateLegend = false;
      }
      if (this.shouldUpdateLabels) {
        this.drawDataLabels();
        this.shouldUpdateLabels = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
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
      if (this.shouldSwapXAxis) {
        this.drawXAxis(true);
        this.shouldSwapXAxis = false;
      }
      if (this.shouldSwapYAxis) {
        this.drawYAxis(true);
        this.shouldSwapYAxis = false;
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

  formatClickHighlight() {
    if (this.clickHighlight) {
      this.clickHighlight.map(d => {
        if (!d['xAccessor'] || !d['yAccessor']) {
          d['xAccessor'] =
            d[this.xAccessor] instanceof Date
              ? formatDate({
                  date: d[this.xAccessor],
                  format: this.xAxis.format,
                  offsetTimezone: true
                })
              : d[this.xAccessor];

          d['yAccessor'] =
            d[this.yAccessor] instanceof Date
              ? formatDate({
                  date: d[this.yAccessor],
                  format: this.yAxis.format,
                  offsetTimezone: true
                })
              : d[this.yAccessor];
        }
      });
    }
  }

  formatHoverHighlight() {
    if (this.hoverHighlight) {
      if (!this.hoverHighlight['xAccessor'] || !this.hoverHighlight['yAccessor']) {
        this.hoverHighlight['xAccessor'] =
          this.hoverHighlight[this.xAccessor] instanceof Date
            ? formatDate({
                date: this.hoverHighlight[this.xAccessor],
                format: this.xAxis.format,
                offsetTimezone: true
              })
            : this.hoverHighlight[this.xAccessor];
        this.hoverHighlight['yAccessor'] =
          this.hoverHighlight[this.yAccessor] instanceof Date
            ? formatDate({
                date: this.hoverHighlight[this.yAccessor],
                format: this.yAxis.format,
                offsetTimezone: true
              })
            : this.hoverHighlight[this.yAccessor];
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

  validateInteractionKeys() {
    if (this.interactionKeys && this.interactionKeys.length) {
      if (this.interactionKeys.includes(this.xAccessor) || this.interactionKeys.includes(this.yAccessor)) {
        const checkInteractionKeys = [];
        this.interactionKeys.map(k => {
          const newKey = k === this.xAccessor ? 'xAccessor' : k === this.yAccessor ? 'yAccessor' : k;
          checkInteractionKeys.push(newKey);
        });
        this.innerInteractionKeys = checkInteractionKeys;
      }
    } else {
      // initialize interacrtionKeys prop
      this.innerInteractionKeys = ['xAccessor', 'yAccessor'];
    }
  }

  prepareScales() {
    const minMapValue =
      (this.minValueOverride || this.minValueOverride === 0) &&
      this.minValueOverride < min(this.preppedData, d => d.valueAccessor)
        ? this.minValueOverride
        : min(this.preppedData, d => d.valueAccessor);
    const maxMapValue =
      (this.maxValueOverride || this.maxValueOverride === 0) &&
      this.maxValueOverride > max(this.preppedData, d => d.valueAccessor)
        ? this.maxValueOverride
        : max(this.preppedData, d => d.valueAccessor);

    this.x = scaleBand()
      .domain(this.xKeyOrder ? this.xKeyOrder : this.preppedData.map(d => d.xAccessor))
      .range([0, this.innerPaddedWidth]);
    this.x.padding(this.strokeWidth ? this.strokeWidth / this.x.bandwidth() : 0);
    this.y = scaleBand()
      .domain(this.yKeyOrder ? this.yKeyOrder : this.preppedData.map(d => d.yAccessor))
      .range([0, this.innerPaddedHeight]);

    this.y.padding(this.strokeWidth ? this.strokeWidth / this.y.bandwidth() : 0);

    this.heat = scaleQuantize().domain([minMapValue, maxMapValue]);

    const strokeColors = [];
    const backgroundColors = [];
    let i = 0;
    const half = Math.ceil(this.preparedColors.length / 2);
    const isDiverging = this.colorPalette && this.colorPalette.includes('diverging');
    const isDark = this.colorPalette && this.colorPalette.includes('dark');
    this.preparedColors.forEach(color => {
      const colorsMatchingScheme = prepareStrokeColorsFromScheme(
        color,
        i,
        this.preparedColors,
        isDiverging ? 'diverging' : 'sequential'
      );
      if (isDiverging) {
        const fillLuminance = calculateLuminance(colorsMatchingScheme.fillColor);
        const strokeLuminance = calculateLuminance(colorsMatchingScheme.textureColor);
        const darkerColor =
          fillLuminance > strokeLuminance ? colorsMatchingScheme.textureColor : colorsMatchingScheme.fillColor;
        const lighterColor =
          fillLuminance < strokeLuminance ? colorsMatchingScheme.textureColor : colorsMatchingScheme.fillColor;
        if (this.preparedColors.length % 2 && i === (this.preparedColors.length - 1) / 2) {
          backgroundColors.push(isDark ? darkerColor : lighterColor);
          strokeColors.push(isDark ? lighterColor : darkerColor);
        } else {
          strokeColors.push(isDark ? darkerColor : lighterColor);
          backgroundColors.push(isDark ? lighterColor : darkerColor);
        }
      } else {
        if (i + 1 < half) {
          backgroundColors.push(this.preparedColors[0]);
          strokeColors.push(this.preparedColors[this.preparedColors.length - 1]);
        } else {
          strokeColors.push(this.preparedColors[0]);
          backgroundColors.push(this.preparedColors[this.preparedColors.length - 1]);
        }
      }
      i++;
    });

    this.fillColors = scaleQuantize()
      .domain([minMapValue, maxMapValue])
      .range(backgroundColors);

    this.strokeColors = scaleQuantize()
      .domain([minMapValue, maxMapValue])
      .range(strokeColors);

    this.rawHeat = scaleQuantize()
      .domain([minMapValue, maxMapValue])
      .range(this.preparedColors);

    this.updateCheck = true;
  }

  setSubTitleElements() {
    setSubTitle({
      root: this.subTitleG,
      subTitle: this.subTitle
    });
  }

  setColors() {
    this.preparedColors = this.colors ? convertVisaColor(this.colors) : getColors(this.colorPalette, this.colorSteps);
  }

  setTextures() {
    const scheme = this.colorPalette && this.colorPalette.includes('diverging') ? 'diverging' : 'sequential';
    const limit = scheme === 'diverging' ? 11 : 9;
    if (this.accessibility.hideTextures || this.colorSteps > limit || !this.accessibility.showExperimentalTextures) {
      this.colorArr = this.preparedColors;
    } else {
      const textures = convertColorsToTextures({
        colors: this.preparedColors,
        rootSVG: this.svg.node(),
        id: this.chartID,
        scheme,
        disableTransitions: !this.duration
      });
      this.colorArr = textures;
    }
    this.heat.range(this.colorArr);
  }

  setStrokes() {
    // technically the user could pass hoverstyle/clickstyle.color and we want to make sure that we intercept that
    // heatmap does not use this prop, since color is bound intrinsically to value in the data
    const clickStyle = { ...this.clickStyle, color: undefined };
    const hoverStyle = { ...this.hoverStyle, color: undefined };
    this.strokes = buildStrokes({
      root: this.svg.node(),
      id: this.chartID,
      colors:
        !this.accessibility.hideTextures && this.accessibility.showExperimentalTextures
          ? this.fillColors.range()
          : this.preparedColors, // this.fillColors.range(), // this.divergingColors && this.divergingColors.fills.length && !this.accessibility.hideTextures ? this.divergingColors.fills : this.preparedColors,
      clickStyle,
      hoverStyle,
      strokeOverride:
        !this.accessibility.hideTextures && this.accessibility.showExperimentalTextures
          ? this.strokeColors.range()
          : undefined
    });
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'heat-map');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  prepareData() {
    // copy data to preppedData for data manipulation
    // check data format & offset time object, create new keys for modified xAccessor, yAccessor, valueAccessor values
    // this allows heatmap to share same data entries across different dimensions
    if (this.updateCheck) {
      this.interpolating = this.preppedData;
      const oldXDomain = this.x.domain();
      const oldXRange = this.x.range();
      const oldYDomain = this.y.domain();
      const oldYRange = this.y.range();
      this.interpolating.x = scaleBand()
        .domain(oldXDomain)
        .range(oldXRange);
      this.interpolating.y = scaleBand()
        .domain(oldYDomain)
        .range(oldYRange);
    }
    this.preppedData = this.data.map(d => {
      const newRow = { ...d };
      newRow['valueAccessor'] = parseFloat(d[this.valueAccessor]);
      newRow['xAccessor'] =
        d[this.xAccessor] instanceof Date
          ? formatDate({
              date: d[this.xAccessor],
              format: this.xAxis.format,
              offsetTimezone: true
            })
          : d[this.xAccessor];
      newRow['yAccessor'] =
        d[this.yAccessor] instanceof Date
          ? formatDate({
              date: d[this.yAccessor],
              format: this.yAxis.format,
              offsetTimezone: true
            })
          : d[this.yAccessor];

      return newRow;
    });

    // groups each row of the heatmap to make keyboard navigation easier for accessibility
    this.nest = nest()
      .key(d => d[this.yAccessor])
      .entries(this.preppedData);

    // Get all item categories
    this.datakeys = this.nest.map(d => d.key);
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

  drawXAxis(swapping?: boolean) {
    const axisLabel =
      this.xAxis.label || this.xAxis.label === ''
        ? this.xAxis.label
        : this.dataKeyNames && this.dataKeyNames[this.xAccessor]
        ? this.dataKeyNames[this.xAccessor]
        : this.xAxis.label;
    // draw axes
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      top: this.xAxis.placement === 'top',
      wrapLabel: this.wrapLabel ? this.x.bandwidth() : '',
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: axisLabel, // this.xAxis.label,
      padding: this.padding,
      hide: swapping || !this.xAxis.visible,
      duration: this.duration,
      hidePath: this.hideAxisPath
    });
  }

  drawYAxis(swapping?: boolean) {
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
      left: this.yAxis.placement !== 'right',
      right: this.yAxis.placement === 'right',
      format: this.yAxis.format,
      wrapLabel: this.wrapLabel ? this.padding.left || 100 : '',
      tickInterval: this.yAxis.tickInterval,
      label: axisLabel, // this.yAxis.label,
      padding: this.padding,
      hide: swapping || !this.yAxis.visible,
      duration: this.duration,
      hidePath: this.hideAxisPath
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
      rootEle: this.heatMapEl,
      hasXAxis: this.xAxis ? this.xAxis.visible : false,
      xAxis: this.x || false, // this is optional for some charts, if hasXAxis is always false
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
      rootEle: this.heatMapEl,
      hasYAxis: this.yAxis ? this.yAxis.visible : false,
      yAxis: this.y || false, // this is optional for some charts, if hasXAxis is always false
      yAxisLabel: axisLabel ? axisLabel : '' // this is optional for some charts, if hasYAxis is always false
    });
  }

  renderRootElements() {
    this.svg = select(this.heatMapEl)
      .select('.visa-viz-d3-heat-map-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);
    this.map = this.rootG.append('g').attr('class', 'map-group');
    this.labelG = this.rootG.append('g').attr('class', 'heat-map-dataLabel-group');
    this.legendG = select(this.heatMapEl)
      .select('.heat-map-legend')
      .append('svg');
    this.subTitleG = select(this.heatMapEl).select('.heat-sub-title');
    this.tooltipG = select(this.heatMapEl).select('.heat-map-tooltip');
  }

  setGlobalSelections() {
    this.xAxisElement = this.rootG.selectAll('.bottom');
    const dataBoundToGroups = this.map.selectAll('.row').data(this.nest, d => d.key);

    this.enterRowWrappers = dataBoundToGroups.enter().append('g');
    this.exitRowWrappers = dataBoundToGroups.exit();
    this.updateRowWrappers = dataBoundToGroups.merge(this.enterRowWrappers);

    const dataBoundToGeometries = this.updateRowWrappers
      .selectAll('.grid')
      .data(d => d.values, d => d.xAccessor + d.yAccessor);

    this.enter = dataBoundToGeometries.enter().append('rect');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    this.exitSize += this.exitRowWrappers.selectAll('.grid').size();

    const dataBoundToLabelGroups = this.labelG.selectAll('g').data(this.nest, d => d.key);

    this.enteringLabelGroups = dataBoundToLabelGroups.enter().append('g');
    this.exitingLabelGroups = dataBoundToLabelGroups.exit();
    this.updatingLabelGroups = dataBoundToLabelGroups.merge(this.enteringLabelGroups);

    const dataBoundToLabels = this.updatingLabelGroups
      .selectAll('text')
      .data(d => d.values, d => d.xAccessor + d.yAccessor);
    this.enterLabels = dataBoundToLabels.enter().append('text');
    this.exitLabels = dataBoundToLabels.exit();
    this.updateLabels = dataBoundToLabels.merge(this.enterLabels);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.heatMapEl)
        .select('.visa-viz-d3-heat-map-container')
        .attr('data-testid', 'chart-container');
      select(this.heatMapEl)
        .select('.heat-main-title')
        .attr('data-testid', 'main-title');
      select(this.heatMapEl)
        .select('.heat-sub-title')
        .attr('data-testid', 'sub-title');
      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');
      this.map.attr('data-testid', 'map-group');
      this.labelG.attr('data-testid', 'dataLabel-group');
      this.svg.select('defs').attr('data-testid', 'pattern-defs');

      this.updateRowWrappers.attr('data-testid', 'map-row').attr('data-id', d => `row-${d.key}`);
      this.updateLabels
        .attr('data-testid', 'dataLabel')
        .attr('data-id', d => `label-${d[this.xAccessor]}-${d[this.yAccessor]}`);
      this.update
        .attr('data-testid', 'marker')
        .attr('data-id', d => `marker-${d[this.xAccessor]}-${d[this.yAccessor]}`);
    } else {
      select(this.heatMapEl)
        .select('.visa-viz-d3-heat-map-container')
        .attr('data-testid', null);
      select(this.heatMapEl)
        .select('.heat-main-title')
        .attr('data-testid', null);
      select(this.heatMapEl)
        .select('.heat-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);
      this.map.attr('data-testid', null);
      this.labelG.attr('data-testid', null);
      this.svg.select('defs').attr('data-testid', null);

      this.updateRowWrappers.attr('data-testid', null).attr('data-id', null);
      this.updateLabels.attr('data-testid', null).attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);
    }
  }

  // draw heat map
  enterGeometries() {
    this.enter.interrupt();

    this.enterRowWrappers
      .attr('class', 'row')
      .classed('entering', true)
      .each((_, i, n) => {
        // we bind accessible interactivity and semantics here (role, tabindex, etc)
        initializeElementAccess(n[i]);
      });

    this.enter
      .attr('class', 'grid')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      })
      .on(
        'click',
        !this.suppressEvents
          ? (d, i, n) => {
              this.onClickHandler(d, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              this.onHoverHandler(d, n[i]);
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('opacity', 0)
      .attr('y', d => {
        if (this.interpolating && this.interpolating.y(d.yAccessor) === undefined) {
          let shift = this.y(d.yAccessor);
          shift = shift + this.y.bandwidth() * (shift / this.y(this.y.domain()[0]));
          return shift;
        } else if (this.interpolating) {
          return this.interpolating.y(d.yAccessor);
        }
        return this.y(d.yAccessor);
      })
      .attr('height', d => {
        if (this.interpolating && this.interpolating.y(d.yAccessor) === undefined) {
          return 0;
        } else if (this.interpolating) {
          return this.interpolating.y.bandwidth();
        }
        return this.y.bandwidth();
      })
      .attr('x', d => {
        if (this.interpolating && this.interpolating.x(d.xAccessor) === undefined) {
          let shift = this.x(d.xAccessor);
          shift = shift + this.x.bandwidth() * (shift / this.x(this.x.domain()[this.x.domain().length - 1]));
          return shift;
        } else if (this.interpolating) {
          return this.interpolating.x(d.xAccessor);
        }
        return this.x(d.xAccessor);
      })
      .attr('width', d => {
        if (this.interpolating && this.interpolating.x(d.xAccessor) === undefined) {
          return 0;
        } else if (this.interpolating) {
          return this.interpolating.x.bandwidth();
        }
        return this.x.bandwidth();
      })
      .attr('rx', this.shape === 'circle' ? this.x.bandwidth() : 0)
      .attr('ry', this.shape === 'circle' ? this.y.bandwidth() : 0);

    this.update.order();
    this.enterRowWrappers.order();
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
      .attr('opacity', d => {
        return checkInteraction(
          d,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      });
  }

  exitGeometries() {
    this.exit.interrupt();

    this.exit
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr('y', (d, i, n) => {
        if (this.y(d.yAccessor) === undefined) {
          const self = select(n[i]);
          let shift = +self.attr('y');
          shift = shift + +self.attr('height') * (shift / this.y(this.y.domain()[0]));
          return shift;
        }
        return this.y(d.yAccessor);
      })
      .attr('height', d => {
        if (this.y(d.yAccessor) === undefined) {
          return 0;
        }
        return this.y.bandwidth();
      })
      .attr('x', (d, i, n) => {
        if (this.x(d.xAccessor) === undefined) {
          const self = select(n[i]);
          let shift = +self.attr('x');
          shift = shift + +self.attr('width') * (shift / this.x(this.x.domain()[this.x.domain().length - 1]));
          return shift;
        }
        return this.x(d.xAccessor);
      })
      .attr('width', d => {
        if (this.x(d.xAccessor) === undefined) {
          return 0;
        }
        return this.x.bandwidth();
      });

    this.exitRowWrappers
      .selectAll('.grid')
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attr('y', (_, i, n) => {
        const self = select(n[i]);
        let shift = +self.attr('y');
        shift = shift + +self.attr('height') * (shift / this.y(this.y.domain()[0]));
        return shift;
      })
      .attr('height', 0)
      .attr('x', (d, i, n) => {
        if (this.x(d.xAccessor) === undefined) {
          const self = select(n[i]);
          let shift = +self.attr('x');
          shift = shift + +self.attr('width') * (shift / this.x(this.x.domain()[this.x.domain().length - 1]));
          return shift;
        }
        return this.x(d.xAccessor);
      })
      .attr('width', d => {
        if (this.x(d.xAccessor) === undefined) {
          return 0;
        }
        return this.x.bandwidth();
      });

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
        this.exitRowWrappers.remove();
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
        });
      });
  }

  drawGeometries() {
    this.updateRowWrappers
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        this.updateRowWrappers.classed('entering', false);
      });

    const updateTransition = this.update
      .classed('geometryIsMoving', (d, i, n) => {
        const geometryIsUpdating = checkAttributeTransitions(select(n[i]), [
          {
            attr: 'y',
            numeric: true,
            newValue: this.y(d.yAccessor)
          },
          {
            attr: 'height',
            numeric: true,
            newValue: this.y.bandwidth()
          },
          {
            attr: 'x',
            numeric: true,
            newValue: this.x(d.xAccessor)
          },
          {
            attr: 'width',
            numeric: true,
            newValue: this.x.bandwidth()
          },
          {
            attr: 'rx',
            numeric: true,
            newValue: this.shape === 'circle' ? this.x.bandwidth() : 0
          },
          {
            attr: 'ry',
            numeric: true,
            newValue: this.shape === 'circle' ? this.y.bandwidth() : 0
          }
        ]);
        return geometryIsUpdating;
      })
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('y', d => this.y(d.yAccessor))
      .attr('height', this.y.bandwidth())
      .attr('x', d => this.x(d.xAccessor))
      .attr('width', this.x.bandwidth())
      .attr('rx', this.shape === 'circle' ? this.x.bandwidth() : 0)
      .attr('ry', this.shape === 'circle' ? this.y.bandwidth() : 0);

    if (this.accessibility.hideTextures || !this.accessibility.showExperimentalTextures) {
      updateTransition.attr('fill', d => {
        return this.heat(d[this.valueAccessor]);
      });
    }

    updateTransition.call(transitionEndAll, () => {
      this.update.classed('geometryIsMoving', false);

      this.updateInteractionState();

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

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time

    this.update
      .attr('fill', d => {
        return this.heat(d[this.valueAccessor]);
      })
      .attr('opacity', d => {
        return checkInteraction(
          d,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      })
      .attr('filter', (d, i, n) => {
        if (!this.accessibility.hideStrokes && !select(n[i]).classed('geometryIsMoving')) {
          const clicked =
            this.clickHighlight &&
            this.clickHighlight.length > 0 &&
            checkClicked(d, this.clickHighlight, this.innerInteractionKeys);
          const hovered = this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
          const baseColor =
            !this.accessibility.hideTextures && this.accessibility.showExperimentalTextures
              ? this.fillColors(d[this.valueAccessor])
              : this.rawHeat(d[this.valueAccessor]);
          const strokeOverride =
            !this.accessibility.hideTextures && this.accessibility.showExperimentalTextures
              ? this.strokeColors(d[this.valueAccessor])
              : undefined;
          const state = clicked ? 'click' : hovered && !select(n[i]).classed('geometryIsMoving') ? 'hover' : 'rest';
          if (state === 'hover') {
            drawHoverStrokes({
              inputElement: n[i],
              id: this.chartID,
              key: d[this.xAccessor] + d[this.yAccessor],
              strokeWidth: this.hoverStyle.strokeWidth,
              fill: baseColor,
              strokeOverride
            });
          }
          return this.strokes[state + baseColor];
        }
        return null;
      });

    // in case the fill/stroke contents change, we want to update our focus indicator to match
    // (the focus indicator copies the whole element being focused to place it on top)
    retainAccessFocus({
      parentGNode: this.rootG.node()
    });

    // since elements may have changed fill, we update labels to match
    this.updateLabels.attr('fill', this.textTreatmentHandler);
  }

  setLabelOpacity() {
    this.processLabelOpacity(this.updateLabels);
  }

  processLabelOpacity(selection, isATransition?) {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const dimensions = {
      width: this.x.bandwidth(),
      height: this.y.bandwidth()
    };
    const parseText = d => {
      let text = this.dataLabel.labelAccessor ? d[this.dataLabel.labelAccessor] : d.valueAccessor;
      text =
        text instanceof Date
          ? formatDate({
              date: text,
              format: this.dataLabel.format,
              offsetTimezone: true
            })
          : formatStats(text, this.dataLabel.format);
      const hasRoom =
        this.accessibility.showSmallLabels ||
        verifyTextHasSpace({
          text,
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
    };
    if (isATransition) {
      selection.attr('opacity', parseText);
    } else {
      selection.each((d, i, n) => {
        if (!select(n[i]).classed('entering')) {
          select(n[i]).attr('opacity', () => parseText(d));
        }
      });
    }
  }

  textTreatmentHandler = (d, i, n) => {
    const bgColor =
      !this.accessibility.hideTextures && this.accessibility.showExperimentalTextures
        ? this.fillColors(d.valueAccessor)
        : this.rawHeat(d.valueAccessor);
    const color = autoTextColor(bgColor);
    const me = select(n[i]);
    me.attr(
      'filter',
      !me.classed('textIsMoving')
        ? createTextStrokeFilter({
            root: this.svg.node(),
            id: this.chartID,
            color: bgColor
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

  bindInteractivity() {
    this.update
      .on(
        'click',
        !this.suppressEvents
          ? (d, i, n) => {
              this.onClickHandler(d, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              this.onHoverHandler(d, n[i]);
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updateLabels
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  enterDataLabels() {
    this.enteringLabelGroups.attr('class', 'heat-map-label-wrapper');

    this.enterLabels
      .attr('class', 'heat-map-dataLabel entering')
      .attr('opacity', 0)
      .attr('fill', this.textTreatmentHandler)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    placeDataLabels({
      root: this.enterLabels,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: 'xAccessor',
      valueAccessor: 'yAccessor',
      chartType: 'heat-map'
    });
  }

  updateDataLabels() {
    const updateTransition = this.updateLabels
      .transition('opacity')
      .ease(easeCircleIn)
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          return this.duration / 2;
        }
        return 0;
      })
      .delay((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          return this.duration / 2;
        }
        return 0;
      });

    this.processLabelOpacity(updateTransition, true);
    updateTransition.call(transitionEndAll, () => {
      this.updateLabels.classed('entering', false);
    });
    // this.updatingLabelGroups
    //   .transition('opacity')
    //   .duration(this.duration)
    //   .ease(easeCircleIn)
    //   .attr('opacity', d => {
    //     return checkInteraction(
    //       d,
    //       this.dataLabel.visible ? 1 : 0,
    //       this.hoverOpacity,
    //       this.hoverHighlight,
    //       this.clickHighlight,
    //       this.innerInteractionKeys
    //     ) < 1
    //       ? 0
    //       : 1;
    //   })
    //   .call(transitionEndAll, () => {
    //     this.updatingLabelGroups.classed('entering', false);
    //   });
  }

  exitDataLabels() {
    this.exitLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .remove();

    this.exitingLabelGroups
      .selectAll('text')
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .call(transitionEndAll, () => {
        this.exitingLabelGroups.remove();
      });
  }

  drawDataLabels() {
    this.updateLabels.attr('fill', this.textTreatmentHandler).text(d => {
      const text = this.dataLabel.labelAccessor ? d[this.dataLabel.labelAccessor] : d.valueAccessor;
      return text instanceof Date
        ? formatDate({
            date: text,
            format: this.dataLabel.format,
            offsetTimezone: true
          })
        : formatStats(text, this.dataLabel.format);
    });

    const placeLabels = this.updateLabels
      .transition('update')
      .ease(easeCircleIn)
      .duration(this.duration);

    placeDataLabels({
      root: placeLabels,
      xScale: this.x,
      yScale: this.y,
      ordinalAccessor: 'xAccessor',
      valueAccessor: 'yAccessor',
      chartType: 'heat-map'
    });
  }

  drawLegendElements() {
    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.bottom + 60,
      colorArr: this.legend && this.legend.type !== 'gradient' ? this.colorArr : this.preparedColors,
      baseColorArr: !(this.colorPalette && this.colorPalette.includes('diverging'))
        ? [this.preparedColors[this.preparedColors.length - 1]]
        : this.strokeColors.range(),
      hideStrokes: this.accessibility.hideStrokes,
      scale: this.heat,
      steps: this.colorSteps,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: this.legend.type,
      fontSize: 12,
      label: this.legend.labels,
      format: this.legend.format,
      hide: !this.legend.visible
    });
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      xScale: this.x,
      xAccessor: this.xAccessor,
      yScale: this.y,
      yAccessor: this.yAccessor
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.getLanguageString(), this.heatMapEl, this.annotations, undefined);
  }
  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      language: this.getLanguageString(),
      rootEle: this.heatMapEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'heat-map',
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
    // this sets the accessibility features of the root SVG element
    setAccessibilityController({
      chartTag: 'heat-map',
      language: this.getLanguageString(),
      node: this.svg.node(),
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'cell',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'heat-map'),
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.yAccessor,
      groupName: 'row',
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
    });
  }

  setGeometryAccessibilityAttributes() {
    // this makes sure every geom element has correct event handlers + semantics (role, tabindex, etc)
    this.update.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    // this adds an ARIA label to each geom (a description read by screen readers)
    const keys = scopeDataKeys(this, chartAccessors, 'heat-map');
    this.update.each((_d, i, n) => {
      setElementFocusHandler({
        chartTag: 'heat-map',
        language: this.getLanguageString(),
        node: n[i],
        geomType: 'cell',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        dataKeyNames: this.dataKeyNames,
        groupName: 'row',
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
    // this sets an ARIA label on all the g elements in the chart
    this.updateRowWrappers.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.getLanguageString(), this.heatMapEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.getLanguageString(), this.heatMapEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.getLanguageString(), this.heatMapEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.getLanguageString(), this.heatMapEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.getLanguageString(), this.heatMapEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.getLanguageString(), this.heatMapEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.getLanguageString(), this.heatMapEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and group counts, etc)
    setAccessChartCounts({
      rootEle: this.heatMapEl,
      parentGNode: this.map.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'heat-map',
      geomType: 'cell',
      groupName: 'row'
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.getLanguageString(), this.heatMapEl, this.accessibility.structureNotes);
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
    if (this.showTooltip) {
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
      valueAccessor: this.valueAccessor,
      xAccessor: this.xAccessor,
      yAccessor: this.yAccessor,
      chartType: 'heat-map'
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
    if (this.shouldSetDimensions) {
      this.setDimensions();
      this.shouldSetDimensions = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldFormatClickHighlight) {
      this.formatClickHighlight();
      this.shouldFormatClickHighlight = false;
    }
    if (this.shouldFormatHoverHighlight) {
      this.formatHoverHighlight();
      this.shouldFormatHoverHighlight = false;
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
    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the Stencil bug is fixed)

    return (
      <div class={`o-layout`}>
        <div class="o-layout--chart">
          <this.topLevel class="heat-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions heat-sub-title vcl-sub-title" />
          <div class="heat-map-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'cell'}
            groupName={'row'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
            language={this.getLanguageString()}
            chartTag={'heat-map'}
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
          <div class="visa-viz-d3-heat-map-container" />
          <div class="heat-map-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(HeatMapDefaultValues);
    let i = 0;
    // accept 0 or false as default value
    const exceptions = {
      strokeWidth: {
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
      wrapLabel: {
        exception: false
      },
      hoverOpacity: {
        exception: 0
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : HeatMapDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
