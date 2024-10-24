/**
 * Copyright (c) 2020, 2021, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection'; // event
import { min, max } from 'd3-array';
import { scalePow, scaleQuantize, scaleOrdinal } from 'd3-scale';
import { easeCircleIn } from 'd3-ease';
import { nest } from 'd3-collection';
import * as geo from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from './topodata';
import worldSmall from './topodata-small';
import { d3Projections } from './world-map-projections';
import {
  IBoxModelType,
  ILocalizationType,
  IMapMarkerStyleType,
  ICountryStyleType,
  IDataLabelType,
  ILegendType,
  IClickStyleType,
  IHoverStyleType,
  ITooltipLabelType,
  IAnimationConfig,
  IAccessibilityType,
  ISubTitleType
} from '@visa/charts-types';
import { WorldMapDefaultValues } from './world-map-default-values';
import { v4 as uuid } from 'uuid';
import 'd3-transition';

import Utils from '@visa/visa-charts-utils';

const {
  getGlobalInstances,
  configLocalization,
  getActiveLanguageString,
  getContrastingStroke,
  createTextStrokeFilter,
  convertColorsToTextures,
  findTagLevel,
  prepareRenderChange,
  roundTo,
  resolveLabelCollision,
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
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  setAccessibilityDescriptionWidth,
  annotate, // not yet supported
  chartAccessors,
  checkInteraction,
  checkHovered,
  checkClicked,
  convertVisaColor,
  drawLegend,
  setLegendInteractionState,
  drawTooltip,
  formatDataLabel,
  getColors,
  getLicenses,
  getPadding,
  getScopedData,
  initTooltipStyle,
  moveToFront,
  overrideTitleTooltip,
  scopeDataKeys,
  transitionEndAll,
  visaColors,
  validateAccessibilityProps,
  validateLocalizationProps,
  setSubTitle
} = Utils;
@Component({
  tag: 'world-map',
  styleUrl: 'world-map.scss'
})
export class WorldMap {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = WorldMapDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) height: number = WorldMapDefaultValues.height;
  @Prop({ mutable: true }) width: number = WorldMapDefaultValues.width;
  @Prop({ mutable: true }) mainTitle: string = WorldMapDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string | ISubTitleType = WorldMapDefaultValues.subTitle;
  @Prop({ mutable: true }) margin: IBoxModelType = WorldMapDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = WorldMapDefaultValues.padding;

  // map
  @Prop({ mutable: true }) mapProjection: string = WorldMapDefaultValues.mapProjection;
  @Prop({ mutable: true }) mapScaleZoom: number = WorldMapDefaultValues.mapScaleZoom;
  @Prop({ mutable: true }) quality: string = WorldMapDefaultValues.quality;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) localization: ILocalizationType = WorldMapDefaultValues.localization;
  @Prop({ mutable: true }) sortOrder: string = WorldMapDefaultValues.sortOrder;
  @Prop({ mutable: true }) groupAccessor: string = WorldMapDefaultValues.groupAccessor;
  @Prop({ mutable: true }) markerAccessor: string = WorldMapDefaultValues.markerAccessor;
  @Prop({ mutable: true }) markerNameAccessor: string = WorldMapDefaultValues.markerNameAccessor;
  @Prop({ mutable: true }) joinAccessor: string = WorldMapDefaultValues.joinAccessor;
  @Prop({ mutable: true }) joinNameAccessor: string = WorldMapDefaultValues.joinNameAccessor;
  @Prop({ mutable: true }) valueAccessor: string = WorldMapDefaultValues.valueAccessor;
  @Prop({ mutable: true }) latitudeAccessor: string = WorldMapDefaultValues.latitudeAccessor;
  @Prop({ mutable: true }) longitudeAccessor: string = WorldMapDefaultValues.longitudeAccessor;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = WorldMapDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) colorSteps: number = WorldMapDefaultValues.colorSteps;
  @Prop({ mutable: true }) markerStyle: IMapMarkerStyleType = WorldMapDefaultValues.markerStyle;
  @Prop({ mutable: true }) countryStyle: ICountryStyleType = WorldMapDefaultValues.countryStyle;
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = WorldMapDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = WorldMapDefaultValues.clickStyle;
  @Prop({ mutable: true }) cursor: string = WorldMapDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = WorldMapDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = WorldMapDefaultValues.animationConfig;

  // Data label (5/7)
  @Prop({ mutable: true }) showTooltip: boolean = WorldMapDefaultValues.showTooltip;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = WorldMapDefaultValues.accessibility;
  @Prop({ mutable: true }) legend: ILegendType = WorldMapDefaultValues.legend;
  @Prop({ mutable: true }) showGridlines: boolean = WorldMapDefaultValues.showGridLines;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = WorldMapDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) dataLabel: IDataLabelType = WorldMapDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) annotations: object[] = WorldMapDefaultValues.annotations;

  // Calculation (6/7)
  @Prop({ mutable: true }) maxValueOverride: number;
  @Prop({ mutable: true }) minValueOverride: number;

  // Interactivity (7/7)
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = WorldMapDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];
  @Prop({ mutable: true }) suppressEvents: boolean = WorldMapDefaultValues.suppressEvents;

  // Testing (8/7)
  @Prop() unitTest: boolean = false;
  //  @Prop() debugMode: boolean = false;

  @Element()
  worldMapEl: HTMLElement;
  svg: any;
  root: any;
  rootG: any;
  projection: any;
  path: any;
  gridG: any;
  gridOutlineG: any;
  gridGraticuleG: any;
  graticule: any;
  colorScale: any;
  baseColorScale: any;
  precalculatedStrokes: any;
  strokeFilter: any;
  radiusScale: any;
  features: any;
  countries: any;
  markers: any;
  labels: any;
  references: any;
  defaults: boolean;
  duration: number;
  current: any;
  currentMarker: any;
  innerLegend: any;
  enter: any;
  enterMarker: any;
  enteringLabels: any;
  exit: any;
  exitMarker: any;
  exitingLabels: any;
  update: any;
  updateMarker: any;
  updatingLabels: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  innerMapProjection: string = 'Equal Earth';
  innerClickStyle: any;
  innerHoverStyle: any;
  innerInteractionKeys: any;
  innerMarkerAccessor: string;
  innerMarkerNameAccessor: string;
  colorArr: any;
  preparedColors: any;
  labelBackgrounds: any;
  strokeColors: any;
  preppedData: any;
  placement: string;
  legendData: any;
  legendG: any;
  tooltipG: any;
  subTitleG: any;
  previousQuality: string;
  tableData: any;
  tableColumns: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  enterMarkerSize: number;
  exitMarkerSize: number;
  chartID: string;
  shouldValidateAccessibility: boolean = true;
  shouldValidateLocalization: boolean = true;
  shouldValidate: boolean = false;
  shouldValidateClickStyle: boolean = false;
  shouldValidateHoverStyle: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateRootIDs: boolean = false;
  shouldUpdateLayoutVariables: boolean = false;
  shouldUpdateGrid: boolean = false;
  shouldSetGlobalProjection: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldSetMapFeatureQuality: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldUpdatePaths: boolean = false;
  shouldUpdateMarkers: boolean = false;
  shouldOrderMarkers: boolean = false;
  shouldSetMarkerSelectionClass: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldUpdateLegend: boolean = false;
  shouldUpdateScales: boolean = false;
  shouldUpdateData: boolean = false;
  shouldUpdateLegendData: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldUpdateColorFill: boolean = false;
  shouldUpdateMarkerStyle: boolean = false;
  shouldUpdatePathStyle: boolean = false;
  shouldUpdateLabelStyle: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldBindLegendInteractivity: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldUpdateLegendCursor: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldValidateMapProjection: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldValidateMarkerAccessor: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetSubTitle: boolean = false;
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
  shouldSetAnnotationAccessibility: boolean = false;
  shouldRedrawWrapper: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  // shouldSetAnnotationAccessibility: boolean = false; // not yet supported
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
    this.shouldUpdateLegendData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateMarkers = true;
    this.shouldOrderMarkers = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldValidate = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
  }

  @Watch('sortOrder')
  sortWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldUpdateMarkers = true;
    this.shouldOrderMarkers = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateColorFill = true;
    this.shouldUpdateLegend = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetMarkerSelectionClass = true;
    }
  }

  @Watch('joinNameAccessor')
  @Watch('joinAccessor')
  joinAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldValidateMarkerAccessor = true;
    this.shouldUpdateColorFill = true;
    this.shouldUpdateMarkers = true;
    this.shouldOrderMarkers = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetMarkerSelectionClass = true;
    }
  }

  @Watch('markerNameAccessor')
  @Watch('markerAccessor')
  @Watch('longitudeAccessor')
  @Watch('latitudeAccessor')
  markerAccessorWatcher(_newVal, _oldVal) {
    this.shouldValidateMarkerAccessor = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateData = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateMarkers = true;
    this.shouldOrderMarkers = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetMarkerSelectionClass = true;
    }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateLegendData = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateColorFill = true;
    this.shouldUpdateMarkers = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
  }

  @Watch('maxValueOverride')
  @Watch('minValueOverride')
  valueOverrideWatcher(_newVal, _oldVal) {
    this.shouldUpdateScales = true;
    this.shouldUpdateMarkers = true;
    this.shouldUpdateColorFill = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetTextures = true;
  }

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
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
    this.shouldSetAnnotationAccessibility = true;
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

  @Watch('colorPalette')
  @Watch('colors')
  @Watch('colorSteps')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateScales = true;
    this.shouldUpdateColorFill = true;
    this.shouldUpdateLegend = true;
    this.shouldSetTextures = true;
  }

  @Watch('mapProjection')
  @Watch('mapScaleZoom')
  projectionWatcher(_newVal, _oldVal) {
    this.shouldValidateMapProjection = true;
    this.shouldSetGlobalProjection = true;
    this.shouldUpdateData = true;
    this.shouldUpdatePaths = true;
    this.shouldUpdateMarkers = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateGrid = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('showGridlines')
  gridLineWatcher(_newVal, _oldVal) {
    this.shouldUpdateGrid = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldUpdateLayoutVariables = true;
    this.shouldResetRoot = true;
    this.shouldSetGlobalProjection = true;
    this.shouldUpdateData = true;
    this.shouldUpdatePaths = true;
    this.shouldUpdateMarkers = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateLegend = true;
    this.shouldUpdateGrid = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('quality')
  qualityWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop quality from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldUpdateTableData = true;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldUpdateLabelStyle = true;
    }
  }

  @Watch('legend')
  legendWatcher(_newVal, _oldVal) {
    this.shouldUpdateLegend = true;
    const newInteractiveVal = _newVal && _newVal.interactive;
    const oldInteractiveVal = _oldVal && _oldVal.interactive;
    if (newInteractiveVal !== oldInteractiveVal) {
      this.shouldBindLegendInteractivity = true;
      this.shouldUpdateLegendCursor = true;
    }
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('countryStyle')
  countryStyleWatcher(_newVal, _oldVal) {
    this.shouldUpdatePathStyle = true;
    const newFillVal = _newVal && _newVal.fill ? _newVal.fill : false;
    const oldFillVal = _oldVal && _oldVal.fill ? _oldVal.fill : false;
    if (newFillVal !== oldFillVal) {
      this.shouldUpdateCursor = true;
      this.shouldBindInteractivity = true;
    }
    this.shouldSetTextures = true;
  }

  @Watch('markerStyle')
  markerStyleWatcher(_newVal, _oldVal) {
    this.shouldUpdateMarkerStyle = true;
    this.shouldUpdateMarkers = true;
    this.shouldUpdateLabels = true;
    const newVisVal = _newVal && _newVal.visible;
    const oldVisVal = _oldVal && _oldVal.visible;
    if (newVisVal !== oldVisVal) {
      this.shouldUpdateData = true;
      this.shouldValidateInteractionKeys = true;
      this.shouldSetGlobalSelections = true;
      this.shouldUpdatePathStyle = true;
      this.shouldUpdateCursor = true;
      this.shouldBindInteractivity = true;
    }
    this.shouldUpdateScales = true;
    this.shouldSetTextures = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldValidateClickStyle = true;
    this.shouldSetTextures = true;
  }

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldValidateHoverStyle = true;
    this.shouldSetTextures = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetMarkerSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldUpdateTableData = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetMarkerSelectionClass = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('dataKeyNames')
  dataKeyNamesWatcher(_newVal, _oldVal) {
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
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
      this.shouldUpdateScales = true;
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
      this.shouldSetMarkerSelectionClass = true;
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

  @Watch('uniqueID')
  idWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop uniqueID from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
    // this.chartID = _newVal || 'world-map-' + uuid();
    // this.worldMapEl.id = this.chartID;
    // removed this boolean flip due to watcher issue after stencil upgrade
    // we will be disabling any update on uniqueID going forward as well
    // so this is inline with our planned future state for this prop.
    // this.shouldUpdateRootIDs = true;
    // this.shouldValidate = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldUpdateLegend = true;
    // this.shouldSetTextures = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetStrokes = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldBindLegendInteractivity = true;
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

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    const chartID = this.uniqueID || 'world-map-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.worldMapEl.id = this.chartID;
      this.setLocalizationConfig();
      this.setTagLevels();
      this.updateChartVariable(); // this sets innerPaddedWidth/Height needed by Projection
      this.validateMapProjection();
      this.validateMarkerAccessor();
      this.setGlobalProjection(); // this creates projection, needed in MapFeatureQuality
      this.setMapFeatureQuality(); // this creates features which is needed in prepareData
      this.prepareData();
      this.prepareLegendData();
      this.validateClickStyle();
      this.validateHoverStyle();
      this.setColors();
      this.prepareScales(); // NOTE that the range for colorScale is not set until we setTextures
      this.validateInteractionKeys();
      this.setTableData();
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      resolve('component will load');
    });
  }

  componentDidLoad() {
    return new Promise(resolve => {
      this.renderRootElements();
      this.reSetRoot();
      this.setTextures();

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
      this.drawOutlineGrid();
      this.drawGraticuleGrid();
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.enterPaths();
      this.enterMarkers();
      this.drawMarkers();
      this.enterLabels();
      this.addStrokeUnder();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawLegendElements();
      this.bindLegendInteractivity();
      this.drawDataLabels();
      this.setMarkerSelectedClass();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.setSubTitleElements();
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.markers.node());
      this.setGroupAccessibilityAttributes();
      this.setGroupAccessibilityID();
      this.onChangeHandler();
      this.defaults = false;
      resolve('component did load');
    }).then(() => this.initialLoadEndEvent.emit({ chartID: this.chartID }));
  }

  componentWillUpdate() {
    // NEVER put items in this method that rely on props (until stencil bug is resolved)
    // All items that belong here are currently at the top of render
    // see: https://github.com/ionic-team/stencil/issues/2061#issuecomment-578282178
    return new Promise(resolve => {
      resolve('component will update');
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
      if (this.shouldUpdateLabelStyle) {
        this.updateLabelStyle();
        this.shouldUpdateLabelStyle = false;
      }
      if (this.shouldEnterUpdateExit) {
        this.enterPaths();
        this.updatePathStyle(this.duration);
        this.exitPaths();
        this.enterMarkers();
        this.updateMarkerStyle(this.duration);
        this.exitMarkers();
        this.enterLabels();
        this.updateLabelStyle();
        this.exitLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldSetStrokes) {
        this.addStrokeUnder();
        this.shouldSetStrokes = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updatePathStyle(0);
        this.updateMarkerStyle(0);
        this.updateLabelStyle();
        this.updateLegendInteractionState();
        this.shouldDrawInteractionState = false;
        this.shouldUpdateColorFill = false;
        this.shouldUpdateMarkerStyle = false;
        this.shouldUpdatePathStyle = false;
      }
      if (this.shouldUpdateColorFill) {
        this.updatePathStyle(this.duration);
        this.updateMarkerStyle(this.duration);
        this.updateLabelStyle();
        this.shouldUpdateColorFill = false;
        this.shouldUpdateMarkerStyle = false;
        this.shouldUpdatePathStyle = false;
      }
      if (this.shouldUpdateMarkerStyle) {
        this.updateMarkerStyle(this.duration);
        this.shouldUpdateMarkerStyle = false;
      }
      if (this.shouldUpdatePathStyle) {
        this.updatePathStyle(this.duration);
        this.shouldUpdatePathStyle = false;
      }

      if (this.shouldUpdateGrid) {
        this.drawOutlineGrid();
        this.drawGraticuleGrid();
        this.shouldUpdateGrid = false;
      }
      if (this.shouldUpdateLegend) {
        this.drawLegendElements();
        this.shouldUpdateLegend = false;
      }
      if (this.shouldUpdatePaths) {
        this.drawPaths();
        this.shouldUpdatePaths = false;
      }
      if (this.shouldUpdateMarkers) {
        this.drawMarkers();
        this.shouldUpdateMarkers = false;
      }
      if (this.shouldOrderMarkers) {
        this.orderMarkers();
        this.shouldOrderMarkers = false;
      }
      if (this.shouldUpdateLabels) {
        this.drawDataLabels();
        this.shouldUpdateLabels = false;
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
      if (this.shouldSetMarkerSelectionClass) {
        this.setMarkerSelectedClass();
        this.shouldSetMarkerSelectionClass = false;
      }
      if (this.shouldBindInteractivity) {
        this.bindInteractivity();
        this.shouldBindInteractivity = false;
      }
      if (this.shouldBindLegendInteractivity) {
        this.bindLegendInteractivity();
        this.shouldBindLegendInteractivity = false;
      }
      if (this.shouldUpdateCursor) {
        this.updateCursor();
        this.updateLegendCursor();
        this.shouldUpdateCursor = false;
        this.shouldUpdateLegendCursor = false;
      }
      if (!this.shouldUpdateCursor && this.shouldUpdateLegendCursor) {
        this.updateLegendCursor();
        this.shouldUpdateLegendCursor = false;
      }
      if (this.shouldUpdateAnnotations) {
        this.drawAnnotations();
        this.shouldUpdateAnnotations = false;
      }
      if (this.shouldSetAnnotationAccessibility) {
        this.setAnnotationAccessibility();
        this.shouldSetAnnotationAccessibility = false;
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
          data: this.preppedData,
          uniqueID: this.uniqueID,
          context: {
            mainTitle: this.mainTitle,
            onClickEvent: this.suppressEvents ? undefined : this.clickEvent.emit
          }
        }
      );
    }
  }

  prepareData() {
    // sort and prep data (we may not need sort for map, this could help with which marks is drawn on top for markers)
    if (this.data) {
      if (this.sortOrder === 'asc') {
        this.preppedData = [...this.data].sort((a, b) => Number(b[this.valueAccessor]) - Number(a[this.valueAccessor]));
      } else if (this.sortOrder === 'desc') {
        this.preppedData = [...this.data].sort((a, b) => Number(a[this.valueAccessor]) - Number(b[this.valueAccessor]));
      } else {
        this.preppedData = this.data;
      }
    }
    // sorting the features like this allows us to put the countries with data on top of other countries
    // this helps their borders display correctly
    this.features.sort(a => {
      const aRecord = this.preppedData.find(obj => obj[this.joinAccessor] === a.id);
      return aRecord ? 1 : -1;
    });
    this.preppedData.forEach(d => {
      d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);

      if (this.latitudeAccessor && this.longitudeAccessor) {
        d[this.latitudeAccessor] = parseFloat(d[this.latitudeAccessor]);
        d[this.longitudeAccessor] = parseFloat(d[this.longitudeAccessor]);
      }

      // features requires that we have set/reset projection
      const featureData = this.features.find(obj => obj.id === d[this.joinAccessor]);
      d.innerLongitude = geo.geoPath().centroid(featureData)[0];
      d.innerLatitude = geo.geoPath().centroid(featureData)[1];

      // below we prepare the accessibliity message
      const nameAccessor = this.innerMarkerNameAccessor || this.joinNameAccessor;
      const lat = this.latitudeAccessor && d[this.latitudeAccessor] ? d[this.latitudeAccessor] : d.innerLatitude;
      const long = this.longitudeAccessor && d[this.longitudeAccessor] ? d[this.longitudeAccessor] : d.innerLongitude;
      const latLongName = 'Latitude: ' + lat + ', Longitude: ' + long;

      // for the accessibility message we need to figure out if we are using:
      // countries without markers + joinNameAccessor OR
      // any nameAccessor OR
      // lat long (first check if latLongs are provided, otherwise use innerLat+Long)
      d['Location placed using'] =
        !this.markerStyle.visible && this.joinNameAccessor
          ? this.accessibility.includeDataKeyNames
            ? this.joinNameAccessor + ': ' + d[this.joinNameAccessor]
            : d[this.joinNameAccessor]
          : nameAccessor && d[nameAccessor]
          ? this.accessibility.includeDataKeyNames
            ? nameAccessor + ': ' + d[nameAccessor]
            : d[nameAccessor]
          : latLongName;
    });
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

  updateChartVariable() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  // new for world-map
  validateMarkerAccessor() {
    // if marker accessor or marker name accessor not provide default to join accessor
    this.innerMarkerAccessor = this.markerAccessor ? this.markerAccessor : this.joinAccessor;
    this.innerMarkerNameAccessor = this.markerNameAccessor ? this.markerNameAccessor : this.joinNameAccessor;
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length
        ? this.interactionKeys
        : this.markerStyle.visible
        ? [this.groupAccessor || this.innerMarkerAccessor || this.joinAccessor]
        : [this.groupAccessor || this.joinAccessor];
  }

  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.worldMapEl)
        .select('.visa-viz-world-map-container')
        .attr('data-testid', 'chart-container');
      select(this.worldMapEl)
        .select('.world-map-main-title')
        .attr('data-testid', 'main-title');
      select(this.worldMapEl)
        .select('.world-map-sub-title')
        .attr('data-testid', 'sub-title');
      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      this.gridG.attr('data-testid', 'grid-group');
      this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');
      this.countries.attr('data-testid', 'country-group');
      this.markers.attr('data-testid', 'marker-group');
      this.labels.attr('data-testid', 'dataLabel-group');
      this.svg.select('defs').attr('data-testid', 'pattern-defs');

      this.updatingLabels
        .attr('data-testid', 'dataLabel')
        .attr('data-id', d => `label-${d[this.markerStyle.visible ? this.innerMarkerAccessor : this.joinAccessor]}`);
      this.update.attr('data-testid', 'country').attr('data-id', d => `country-path-${d.id}`);
      this.updateMarker.attr('data-testid', 'marker').attr('data-id', d => `marker-${d[this.innerMarkerAccessor]}`);
    } else {
      select(this.worldMapEl)
        .select('.visa-viz-world-map-container')
        .attr('data-testid', null);
      select(this.worldMapEl)
        .select('.world-map-main-title')
        .attr('data-testid', null);
      select(this.worldMapEl)
        .select('.world-map-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);
      this.countries.attr('data-testid', null);
      this.markers.attr('data-testid', null);
      this.labels.attr('data-testid', null);
      this.svg.select('defs').attr('data-testid', null);

      this.updatingLabels.attr('data-testid', null).attr('data-id', null);
      this.update.attr('data-testid', null).attr('data-id', null);
      this.updateMarker.attr('data-testid', null).attr('data-id', null);
    }
  }

  // needs to be updated for map based selections
  setGlobalSelections() {
    // set countries
    const dataBoundToCountryPaths = this.countries.selectAll('.country').data(this.features, d => d.id);
    this.enter = dataBoundToCountryPaths.enter().append('path');
    this.exit = dataBoundToCountryPaths.exit();
    this.update = dataBoundToCountryPaths.merge(this.enter);

    // record change for accessibility
    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    // set markers
    const dataBoundtoMarkers = this.markers
      .selectAll('.marker')
      .data(this.preppedData, d => d[this.innerMarkerAccessor]);
    this.enterMarker = dataBoundtoMarkers.enter().append('circle');
    this.exitMarker = dataBoundtoMarkers.exit();
    this.updateMarker = dataBoundtoMarkers.merge(this.enterMarker);

    this.exitMarkerSize = this.exitMarker.size();
    this.enterMarkerSize = this.enterMarker.size();

    // set labels
    const dataBoundToLabels = this.labels
      .selectAll('.world-map-dataLabel')
      .data(this.preppedData, d => d[this.markerStyle.visible ? this.innerMarkerAccessor : this.joinAccessor]);
    this.enteringLabels = dataBoundToLabels.enter().append('text');
    this.exitingLabels = dataBoundToLabels.exit();
    this.updatingLabels = dataBoundToLabels.merge(this.enteringLabels);
  }

  getLanguageString() {
    return getActiveLanguageString(this.localization);
  }

  setLocalizationConfig() {
    configLocalization(this.localization);
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

  addStrokeUnder() {
    this.strokeFilter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff',
      strokeSizeOverride: 1
    });
    const filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.labels.attr('filter', filter);
    this.updateMarker.attr('filter', this.strokeFilter);
  }

  prepareScales() {
    const minValue =
      (this.minValueOverride || this.minValueOverride === 0) &&
      this.minValueOverride < min(this.preppedData, d => d[this.valueAccessor])
        ? this.minValueOverride
        : min(this.preppedData, d => d[this.valueAccessor]);
    const maxValue =
      (this.maxValueOverride || this.maxValueOverride === 0) &&
      this.maxValueOverride > max(this.preppedData, d => d[this.valueAccessor])
        ? this.maxValueOverride
        : max(this.preppedData, d => d[this.valueAccessor]);

    const domain = this.groupAccessor ? this.preppedData.map(d => d[this.groupAccessor]) : [];
    // will need to handle error checking in this process
    this.colorScale = this.groupAccessor ? scaleOrdinal().domain(domain) : scaleQuantize().domain([minValue, maxValue]);

    this.baseColorScale = this.groupAccessor
      ? scaleOrdinal()
          .domain(domain)
          .range(this.preparedColors)
      : scaleQuantize()
          .domain([minValue, maxValue])
          .range(this.preparedColors);

    // calculating these early means we don't need to for every single country and marker. Performance, huzzah!
    this.precalculatedStrokes = {};
    let colorToPrep = visaColors[this.countryStyle.color] || this.countryStyle.color || 'base_grey';
    this.precalculatedStrokes[colorToPrep] = getContrastingStroke(colorToPrep);
    colorToPrep = visaColors[this.markerStyle.color] || this.markerStyle.color || 'base_grey';
    this.precalculatedStrokes[colorToPrep] = getContrastingStroke(colorToPrep);
    if (this.innerClickStyle.color) {
      colorToPrep = visaColors[this.innerClickStyle.color] || this.innerClickStyle.color;
      this.precalculatedStrokes[colorToPrep] = getContrastingStroke(colorToPrep);
    }
    if (this.innerHoverStyle.color) {
      colorToPrep = visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color;
      this.precalculatedStrokes[colorToPrep] = getContrastingStroke(colorToPrep);
    }
    this.precalculatedStrokes[visaColors['base_grey']] = '#ffffff';

    if (this.groupAccessor) {
      const strokes = [];
      this.preparedColors.forEach(color => {
        strokes.push(getContrastingStroke(color));
      });

      this.strokeColors = scaleQuantize()
        .domain(domain)
        .range(strokes);
    } else {
      this.strokeColors = baseColor => {
        if (this.colorPalette.includes('diverging')) {
          const i = this.preparedColors.indexOf(baseColor);
          if (this.preparedColors.length % 2) {
            const firstHalfIndex = (this.preparedColors.length - 1) / 2 - 1;
            const middleIndex = firstHalfIndex + 1;
            const secondHalfIndex = middleIndex + 1;
            return i <= firstHalfIndex
              ? this.preparedColors[0]
              : i >= secondHalfIndex
              ? this.preparedColors[this.preparedColors.length - 1]
              : getContrastingStroke(baseColor);
          } else {
            const topHalfIndex = this.preparedColors.length / 2;
            return i < topHalfIndex ? this.preparedColors[0] : this.preparedColors[this.preparedColors.length - 1];
          }
        } else {
          // palette is sequential, we use the darkest color
          return this.preparedColors[this.preparedColors.length - 1];
        }
      };
    }

    // size markers by area
    this.radiusScale = this.markerStyle.radiusRange
      ? scalePow()
          .exponent(0.5)
          .domain([minValue, maxValue])
          .range(this.markerStyle.radiusRange)
      : '';
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
    return scopeDataKeys(this, innerChartAccessors, 'world-map');
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = this.innerScopeDataKeys();
    this.tableData = getScopedData(this.preppedData, keys);
    this.tableColumns = Object.keys(keys);
  }

  updateMarkerStyle(innerDuration) {
    this.updateMarker
      .style('mix-blend-mode', this.markerStyle.blend ? 'multiply' : 'normal')
      .transition('update-marker')
      .duration(innerDuration || 0)
      .ease(easeCircleIn)
      .attr('fill-opacity', d => {
        if ((d.innerLatitude && d.innerLongitude) || (d[this.latitudeAccessor] && d[this.longitudeAccessor])) {
          return checkInteraction(
            d,
            this.markerStyle.opacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return 0;
        }
      })
      .attr('stroke-opacity', d => {
        if ((d.innerLatitude && d.innerLongitude) || (d[this.latitudeAccessor] && d[this.longitudeAccessor])) {
          return checkInteraction(
            d,
            this.markerStyle.opacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return 0;
        }
      })
      .attr('fill', (d, i, n) => this.setMarkerStyle(d, i, n))
      .attr('stroke-width', d =>
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys) && this.innerClickStyle.strokeWidth
          ? this.innerClickStyle.strokeWidth
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth
          ? this.innerHoverStyle.strokeWidth
          : this.markerStyle.strokeWidth || 1
      )
      .attr('stroke-dasharray', d =>
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
          ? ''
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth
          ? '4 3'
          : ''
      )
      .call(transitionEndAll, () => {
        // in case the fill/stroke contents change, we want to update our focus indicator to match
        // (the focus indicator copies the whole element being focused to place it on top)
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });
      });
  }

  updateLabelStyle() {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;
    const addCollisionClass = this.dataLabel.placement === 'auto' || hideOnly;

    this.updatingLabels.attr('opacity', (d, i, n) => {
      const prevOpacity = +select(n[i]).attr('opacity');
      const styleVisibility = select(n[i]).style('visibility');
      const showText =
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys) ||
        checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
      const labelOpacity = showText ? 1 : opacity;
      const targetOpacity =
        checkInteraction(
          d,
          labelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1; // we need this to be epsilon initially to enable auto placement algorithm to run on load;
      // we capture any item with opacity changing OR any item with opacity 1 and currently hidden
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

    if (addCollisionClass) {
      const labelsAdded = this.updatingLabels.filter((_, i, n) => select(n[i]).classed('collision-added'));
      const labelsRemoved = this.updatingLabels
        .filter((_, i, n) => select(n[i]).classed('collision-removed'))
        .attr('data-use-dx', hideOnly) // need this for direct resolveCollision call
        .attr('data-use-dy', hideOnly);

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
        this.bitmaps = resolveLabelCollision({
          labelSelection: labelsAdded,
          bitmaps: this.bitmaps,
          avoidMarks: [this.updateMarker],
          validPositions: hideOnly
            ? ['middle']
            : ['top', 'bottom', 'left', 'right', 'bottom-right', 'bottom-left', 'top-left', 'top-right', 'middle'],
          offsets: hideOnly ? [1] : [5, 1, 4, 4, 1, 1, 1, 1, 1],
          accessors: [this.markerAccessor, this.joinAccessor],
          size: [roundTo(this.width, 0), roundTo(this.height, 0)], // we need the whole width for series labels
          hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly && this.dataLabel.placement !== 'auto',
          suppressMarkDraw: true
        });

        // if we are in hide only we need to add attributes back
        if (hideOnly) {
          labelsAdded
            .attr('x', d =>
              this.latitudeAccessor && this.longitudeAccessor
                ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
                : isNaN(d.innerLongitude)
                ? 0
                : this.projection([+d.innerLongitude, +d.innerLatitude])[0]
            )
            .attr('y', d =>
              this.latitudeAccessor && this.longitudeAccessor
                ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
                : isNaN(d.innerLatitude)
                ? 0
                : this.projection([+d.innerLongitude, +d.innerLatitude])[1]
            )
            .attr('dy', d =>
              this.markerStyle.visible
                ? (typeof this.radiusScale === 'function'
                    ? this.radiusScale(d[this.valueAccessor])
                    : this.markerStyle.radius || 5) + 20
                : 0
            )
            .attr('text-anchor', 'middle');
        }

        // remove temporary class now
        labelsAdded.classed('collision-added', false);
      }
    }
  }

  updateLegendInteractionState() {
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

  validateClickStyle() {
    // interaction style default
    this.innerClickStyle = this.clickStyle
      ? this.clickStyle
      : {
          strokeWidth: 3
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

  validateMapProjection() {
    this.innerMapProjection = d3Projections.find(o => o.projectionName === this.mapProjection)
      ? this.mapProjection
      : 'Equal Earth';
  }

  setGlobalProjection() {
    // set the projection based on the prop passed
    const selectedProjection = d3Projections.find(o => o.projectionName === this.innerMapProjection);

    this.projection = selectedProjection
      .projection()
      .translate([this.innerPaddedWidth / 2, this.innerPaddedHeight / 2])
      .scale(this.innerPaddedWidth * selectedProjection.scaleMultiplier * this.mapScaleZoom);

    // set the paths
    this.path = geo.geoPath().projection(this.projection);

    // set the grid
    this.graticule = geo.geoGraticule();
  }

  setMapFeatureQuality() {
    if (this.quality === 'Low' || this.quality === 'low') {
      // first step in drawing paths is to set up the join function
      this.features = feature(worldSmall, worldSmall.objects.collection).features;
      this.features.map(feature => (feature.id = feature.properties.ISO_N3)); // add feature id cause it was bugging me
    } else {
      // first step in drawing paths is to set up the join function
      this.features = feature(worldData, worldData.objects.collection).features;
      this.features.map(feature => (feature.id = feature.properties.ISO_N3)); // add feature id cause it was bugging me
    }
  }

  updateRootIDs() {
    this.root.attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG.attr('id', 'visa-viz-padding-container-g-' + this.chartID);
  }

  renderRootElements() {
    this.svg = select(this.worldMapEl)
      .select('.visa-viz-world-map-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);

    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    // grid elements
    this.gridG = this.rootG.append('g').attr('class', 'grid-group');

    // path elements
    this.countries = this.rootG.append('g').attr('class', 'country-group');

    // marker elements
    this.markers = this.rootG.append('g').attr('class', 'marker-group');

    // label elements
    this.labels = this.rootG.append('g').attr('class', 'world-map-dataLabel-group');

    // legend
    this.legendG = select(this.worldMapEl)
      .select('.world-map-legend')
      .append('svg');

    this.subTitleG = select(this.worldMapEl).select('.world-map-sub-title');
    this.tooltipG = select(this.worldMapEl).select('.world-map-tooltip');
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

  setTextures() {
    const scheme =
      this.colorPalette && this.colorPalette.includes('categorical')
        ? 'categorical'
        : this.colorPalette && this.colorPalette.includes('diverging')
        ? 'diverging'
        : 'sequential';
    const limit = this.groupAccessor ? 6 : scheme === 'diverging' ? 11 : 9;
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
    this.colorScale.range(this.colorArr);
  }

  // dashed line for graticule grid
  drawOutlineGrid() {
    let duration = this.duration ? this.duration + 200 : 0;
    let opacity = 1;
    if (!this.showGridlines) {
      opacity = 0;
    }

    // first we handle the grid outline, select and check for existence
    let grid = this.gridG.select('.graticule-outline');
    // grid transition opacity 0, call end all transition, .remove()
    // call the draw function inside the transition end all

    // if the grid doesn't exist yet then we append it
    if (!grid.node()) {
      duration = 0;
      grid = this.gridG.append('g').attr('class', 'grid graticule-outline');
    }
    grid = grid.selectAll('.graticule-outline-path').data([`${this.innerMapProjection},${this.mapScaleZoom}`], d => d);
    grid
      .enter()
      .append('path')
      .attr('class', 'graticule-outline-path')
      .merge(grid)
      .attr('opacity', 0)
      .attr('d', this.path(this.graticule.outline()))
      .transition('update-grid-outline')
      .duration(duration)
      .ease(easeCircleIn)
      .attr('opacity', opacity);

    grid.exit().remove();
  }

  drawGraticuleGrid() {
    let duration = this.duration ? this.duration + 200 : 0;
    let opacity = 1;
    if (!this.showGridlines) {
      opacity = 0;
    }

    // rinse and repeat for inner grid
    let innerGrid = this.gridG.select('.graticule-grid');
    if (!innerGrid.node()) {
      duration = 0;
      innerGrid = this.gridG.append('g').attr('class', 'grid graticule-grid');
    }
    innerGrid = innerGrid
      .selectAll('.graticule-grid-path')
      .data([`${this.innerMapProjection},${this.mapScaleZoom}`], d => d);

    innerGrid
      .enter()
      .append('path')
      .attr('class', 'graticule-grid-path')
      .merge(innerGrid)
      .attr('opacity', 0)
      .attr('d', this.path(this.graticule()))
      .transition('update-grid-path')
      .duration(duration)
      .ease(easeCircleIn)
      .attr('opacity', opacity);

    innerGrid.exit().remove();
  }

  setMarkerSelectedClass() {
    this.updateMarker.classed('highlight', (d, i, n) => {
      let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
      selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
      const selectable = this.accessibility.elementsAreInterface;
      setElementInteractionAccessState(n[i], selected, selectable);
      return selected;
    });
  }

  updateCursor() {
    this.update.attr('cursor', d => {
      const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
      return joinedDataRecord && !this.suppressEvents && this.countryStyle.fill && !this.markerStyle.visible
        ? this.cursor
        : null;
    });
    this.updateMarker.attr('cursor', !this.suppressEvents && this.markerStyle.visible ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null);
  }

  updateLegendCursor() {
    this.innerLegend.style('cursor', !this.suppressEvents && this.legend.interactive ? this.cursor : null);
  }

  bindLegendInteractivity() {
    this.innerLegend
      .on('click', this.legend.interactive && !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        this.legend.interactive && !this.suppressEvents
          ? (d, i, n) => {
              this.hoverEvent.emit({ data: d, target: n[i] });
            }
          : null
      )
      .on('mouseout', this.legend.interactive && !this.suppressEvents ? d => this.onMouseOutHandler(d) : null);
  }

  bindInteractivity() {
    const interactiveToggle = !this.suppressEvents && this.countryStyle.fill && !this.markerStyle.visible;
    this.update
      .on(
        'click',
        interactiveToggle
          ? (d, i, n) => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onClickHandler(joinedDataRecord, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        interactiveToggle
          ? (d, i, n) => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onHoverHandler(joinedDataRecord, n[i]);
            }
          : null
      )
      .on(
        'mouseout',
        interactiveToggle
          ? d => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onMouseOutHandler(joinedDataRecord);
            }
          : null
      );

    this.updateMarker
      .on('click', !this.suppressEvents && this.markerStyle.visible ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        !this.suppressEvents && this.markerStyle.visible ? (d, i, n) => this.onHoverHandler(d, n[i]) : null
      )
      .on('mouseout', !this.suppressEvents && this.markerStyle.visible ? d => this.onMouseOutHandler(d) : null);

    this.updatingLabels
      .on(
        'click',
        !this.suppressEvents && this.dataLabel.visible
          ? (d, i, n) => {
              moveToFront(select(n[i]));
              this.onClickHandler(d, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              moveToFront(select(n[i]));
              this.onHoverHandler(d, n[i]);
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? d => this.onMouseOutHandler(d) : null);
  }

  enterPaths() {
    const interactiveToggle = !this.suppressEvents && this.countryStyle.fill && !this.markerStyle.visible;
    this.enter.interrupt();

    this.enter
      .attr('class', 'country')
      .attr('cursor', interactiveToggle ? this.cursor : null)
      .on(
        'click',
        interactiveToggle
          ? (d, i, n) => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onClickHandler(joinedDataRecord, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        interactiveToggle
          ? (d, i, n) => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onHoverHandler(joinedDataRecord, n[i]);
            }
          : null
      )
      .on(
        'mouseout',
        interactiveToggle
          ? d => {
              const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
              return this.onMouseOutHandler(joinedDataRecord);
            }
          : null
      )
      .attr('d', this.path)
      .attr('fill', (d, i, n) => this.setCountryStyle(d, i, n))
      .attr('stroke-width', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return joinedDataRecord &&
          this.clickHighlight.length > 0 &&
          checkClicked(joinedDataRecord, this.clickHighlight, this.innerInteractionKeys) &&
          this.innerClickStyle.strokeWidth
          ? this.innerClickStyle.strokeWidth
          : joinedDataRecord &&
            this.hoverHighlight &&
            checkHovered(joinedDataRecord, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth &&
            this.countryStyle.fill &&
            !this.markerStyle.visible
          ? this.innerHoverStyle.strokeWidth
          : this.countryStyle.strokeWidth || 0.5;
      })
      .attr('stroke-dasharray', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return joinedDataRecord &&
          this.clickHighlight.length > 0 &&
          checkClicked(joinedDataRecord, this.clickHighlight, this.innerInteractionKeys)
          ? ''
          : joinedDataRecord &&
            this.hoverHighlight &&
            checkHovered(joinedDataRecord, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth &&
            this.countryStyle.fill &&
            !this.markerStyle.visible
          ? '4 3'
          : '';
      })
      .attr('opacity', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return this.markerStyle.visible
          ? this.countryStyle.opacity
          : joinedDataRecord
          ? checkInteraction(
              joinedDataRecord,
              this.countryStyle.opacity,
              this.hoverOpacity,
              this.hoverHighlight,
              this.clickHighlight,
              this.innerInteractionKeys
            )
          : this.clickHighlight.length > 0 || this.hoverHighlight
          ? this.hoverOpacity
          : this.countryStyle.opacity;
      });
  }

  updatePathStyle(innerDuration) {
    this.update.interrupt('opacity');

    const updatePaths = prepareRenderChange({
      selection: this.update,
      duration: innerDuration,
      namespace: 'update-path',
      easing: easeCircleIn
    });

    updatePaths
      .attr('opacity', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return this.markerStyle.visible
          ? this.countryStyle.opacity
          : joinedDataRecord
          ? checkInteraction(
              joinedDataRecord,
              this.countryStyle.opacity,
              this.hoverOpacity,
              this.hoverHighlight,
              this.clickHighlight,
              this.innerInteractionKeys
            )
          : this.clickHighlight.length > 0 || this.hoverHighlight
          ? this.hoverOpacity
          : this.countryStyle.opacity;
      })
      .attr('fill', (d, i, n) => this.setCountryStyle(d, i, n))
      .attr('stroke-width', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return joinedDataRecord &&
          this.clickHighlight.length > 0 &&
          checkClicked(joinedDataRecord, this.clickHighlight, this.innerInteractionKeys) &&
          !this.markerStyle.visible
          ? this.innerClickStyle.strokeWidth
          : joinedDataRecord &&
            this.hoverHighlight &&
            checkHovered(joinedDataRecord, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth &&
            this.countryStyle.fill &&
            !this.markerStyle.visible
          ? this.innerHoverStyle.strokeWidth
          : this.countryStyle.strokeWidth || 1;
      })
      .attr('stroke-dasharray', d => {
        const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
        return joinedDataRecord &&
          this.clickHighlight.length > 0 &&
          checkClicked(joinedDataRecord, this.clickHighlight, this.innerInteractionKeys) &&
          !this.markerStyle.visible
          ? ''
          : joinedDataRecord &&
            this.hoverHighlight &&
            checkHovered(joinedDataRecord, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth &&
            this.countryStyle.fill &&
            !this.markerStyle.visible
          ? '4 3'
          : '';
      });
  }

  exitPaths() {
    this.exit.interrupt();

    // this fades the countries out, we never actually remove them (just hide them)
    this.exit
      .transition('exit-country')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0);
  }

  drawPaths() {
    this.update
      .transition('update-paths')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('d', this.path);
  }

  setCountryStyle(d, i, n) {
    const joinedDataRecord = this.preppedData.find(obj => obj[this.joinAccessor] === d.id);
    let fillColor;
    let strokeColor;
    if (!this.countryStyle.fill || !joinedDataRecord) {
      fillColor = visaColors[this.countryStyle.color] || this.countryStyle.color || 'base_grey';
    } else if (!this.markerStyle.visible) {
      if (
        this.clickHighlight.length > 0 &&
        checkClicked(joinedDataRecord, this.clickHighlight, this.innerInteractionKeys) &&
        this.innerClickStyle.color
      ) {
        fillColor = visaColors[this.innerClickStyle.color] || this.innerClickStyle.color;
      } else if (
        this.hoverHighlight &&
        checkHovered(joinedDataRecord, this.hoverHighlight, this.innerInteractionKeys) &&
        this.innerHoverStyle.color
      ) {
        fillColor = visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color;
      } else if (this.groupAccessor) {
        strokeColor = this.strokeColors(this.baseColorScale(joinedDataRecord[this.groupAccessor]));
        fillColor = this.colorScale(joinedDataRecord[this.groupAccessor]);
      } else {
        strokeColor = this.strokeColors(this.baseColorScale(joinedDataRecord[this.valueAccessor]));
        fillColor = this.colorScale(joinedDataRecord[this.valueAccessor]);
      }
    } else {
      strokeColor = this.strokeColors(this.baseColorScale(joinedDataRecord[this.valueAccessor]));
      fillColor = this.colorScale(joinedDataRecord[this.valueAccessor]);
    }
    select(n[i]).attr('stroke', strokeColor || this.precalculatedStrokes[fillColor]);
    return fillColor;
  }

  enterLabels() {
    const opacity = this.dataLabel.visible ? 1 : 0;
    this.enteringLabels
      .attr('class', 'world-map-dataLabel')
      .attr('text-anchor', 'middle')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('opacity', d => {
        const showText =
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) ||
          checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
        const labelOpacity = showText ? 1 : opacity;
        return checkInteraction(
          d,
          labelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : Number.EPSILON; // we need this to be epsilon initially to enable auto placement algorithm to run on load
      })
      .attr('x', d =>
        this.latitudeAccessor && this.longitudeAccessor
          ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
          : isNaN(d.innerLongitude)
          ? 0
          : this.projection([+d.innerLongitude, +d.innerLatitude])[0]
      )
      .attr('y', d =>
        this.latitudeAccessor && this.longitudeAccessor
          ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
          : isNaN(d.innerLatitude)
          ? 0
          : this.projection([+d.innerLongitude, +d.innerLatitude])[1]
      )
      .attr('dy', d =>
        this.markerStyle.visible
          ? (typeof this.radiusScale === 'function'
              ? this.radiusScale(d[this.valueAccessor])
              : this.markerStyle.radius || 5) + 20
          : 0
      )
      .on(
        'click',
        !this.suppressEvents && this.dataLabel.visible
          ? (d, i, n) => {
              moveToFront(select(n[i]));
              this.onClickHandler(d, n[i]);
            }
          : null
      )
      .on(
        'mouseover',
        !this.suppressEvents
          ? (d, i, n) => {
              moveToFront(select(n[i]));
              this.onHoverHandler(d, n[i]);
            }
          : null
      )
      .on('mouseout', !this.suppressEvents ? d => this.onMouseOutHandler(d) : null);
  }

  exitLabels() {
    this.exitingLabels
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 2)
      .attr('opacity', 0)
      .remove();
  }

  drawDataLabels() {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    const labelUpdate = this.updatingLabels
      .style('visibility', (_, i, n) =>
        this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly
          ? select(n[i]).style('visibility')
          : null
      )
      .attr('opacity', d => {
        // since we don't have an updateLabels() adding opacity update to draw as well
        const showText =
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) ||
          checkHovered(d, this.hoverHighlight, this.innerInteractionKeys);
        const labelOpacity = showText ? 1 : opacity;
        return checkInteraction(
          d,
          labelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1; // we need this to be epsilon initially to enable auto placement algorithm to run on load
      })
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .attr('data-x', d =>
        this.latitudeAccessor && this.longitudeAccessor
          ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
          : isNaN(d.innerLongitude)
          ? 0
          : this.projection([+d.innerLongitude, +d.innerLatitude])[0]
      )
      .attr('data-y', d =>
        this.latitudeAccessor && this.longitudeAccessor
          ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
          : isNaN(d.innerLatitude)
          ? 0
          : this.projection([+d.innerLongitude, +d.innerLatitude])[1]
      )
      .attr('dy', d =>
        this.markerStyle.visible
          ? (typeof this.radiusScale === 'function'
              ? this.radiusScale(d[this.valueAccessor])
              : this.markerStyle.radius || 5) + 20
          : 0
      )
      .attr('data-use-dy', hideOnly)
      .text(d => {
        let showText = false;

        showText =
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) ||
          checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) ||
          opacity;

        // if we don't have marker latitude and longitude don't show labels
        if (
          (this.latitudeAccessor && this.longitudeAccessor
            ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
            : isNaN(d.innerLatitude)
            ? 0
            : this.projection([+d.innerLongitude, +d.innerLatitude])[1]) === 0
        ) {
          showText = false;
        }
        if (
          (this.latitudeAccessor && this.longitudeAccessor
            ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
            : isNaN(d.innerLongitude)
            ? 0
            : this.projection([+d.innerLongitude, +d.innerLatitude])[0]) === 0
        ) {
          showText = false;
        }
        if (this.markerStyle.visible) {
          return showText ? this.getMarkerLabelText(d) : '';
        } else {
          return showText ? this.getMarkerLabelText(d) : '';
        }
      })
      .transition('update-labels')
      .ease(easeCircleIn)
      .duration(this.duration);
    if (this.dataLabel.visible && (this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly)) {
      this.bitmaps = resolveLabelCollision({
        labelSelection: labelUpdate,
        avoidMarks: [this.updateMarker],
        validPositions: hideOnly
          ? ['middle']
          : ['top', 'bottom', 'left', 'right', 'bottom-right', 'bottom-left', 'top-left', 'top-right', 'middle'],
        offsets: hideOnly ? [1] : [5, 1, 4, 4, 1, 1, 1, 1, 1],
        accessors: [this.markerAccessor, this.joinAccessor],
        size: [roundTo(this.width, 0), roundTo(this.height, 0)], // we need the whole width for series labels
        hideOnly: this.dataLabel.visible && this.dataLabel.collisionHideOnly && this.dataLabel.placement !== 'auto'
      });

      // if we are in hide only we need to add attributes back
      if (hideOnly) {
        labelUpdate
          .attr('x', d =>
            this.latitudeAccessor && this.longitudeAccessor
              ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
              : isNaN(d.innerLongitude)
              ? 0
              : this.projection([+d.innerLongitude, +d.innerLatitude])[0]
          )
          .attr('y', d =>
            this.latitudeAccessor && this.longitudeAccessor
              ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
              : isNaN(d.innerLatitude)
              ? 0
              : this.projection([+d.innerLongitude, +d.innerLatitude])[1]
          )
          .attr('dy', d =>
            this.markerStyle.visible
              ? (typeof this.radiusScale === 'function'
                  ? this.radiusScale(d[this.valueAccessor])
                  : this.markerStyle.radius || 5) + 20
              : 0
          )
          .attr('text-anchor', 'middle');
      }
    } else {
      labelUpdate
        .attr('x', d =>
          this.latitudeAccessor && this.longitudeAccessor
            ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0]
            : isNaN(d.innerLongitude)
            ? 0
            : this.projection([+d.innerLongitude, +d.innerLatitude])[0]
        )
        .attr('y', d =>
          this.latitudeAccessor && this.longitudeAccessor
            ? this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1]
            : isNaN(d.innerLatitude)
            ? 0
            : this.projection([+d.innerLongitude, +d.innerLatitude])[1]
        )
        .attr('dy', d =>
          this.markerStyle.visible
            ? (typeof this.radiusScale === 'function'
                ? this.radiusScale(d[this.valueAccessor])
                : this.markerStyle.radius || 5) + 20
            : 0
        )
        .attr('text-anchor', 'middle');
    }
  }

  getMarkerLabelText(d) {
    return this.dataLabel.labelAccessor
      ? this.dataLabel.format
        ? formatDataLabel(d, this.dataLabel.labelAccessor, this.dataLabel.format)
        : d[this.dataLabel.labelAccessor]
      : this.markerStyle.visible
      ? d[this.innerMarkerNameAccessor || this.innerMarkerAccessor]
      : d[this.joinNameAccessor || this.joinAccessor];
  }

  enterMarkers() {
    this.enterMarker.interrupt();

    // enter new markers with pre-defined properities
    this.enterMarker
      .attr('filter', this.strokeFilter)
      .attr('class', 'marker')
      .attr('cursor', !this.suppressEvents && this.markerStyle.visible ? this.cursor : null)
      .style('mix-blend-mode', this.markerStyle.blend ? 'multiply' : 'normal')
      .attr('cx', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0];
        } else {
          return isNaN(d.innerLongitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[0];
        }
      })
      .attr('cy', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1];
        } else {
          return isNaN(d.innerLatitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[1];
        }
      })
      .attr('r', 0)
      .attr('fill', (d, i, n) => this.setMarkerStyle(d, i, n))
      .attr('stroke-width', d =>
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys) && this.innerClickStyle.strokeWidth
          ? this.innerClickStyle.strokeWidth
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth
          ? this.innerHoverStyle.strokeWidth
          : this.markerStyle.strokeWidth || 1
      )
      .attr('stroke-dasharray', d =>
        checkClicked(d, this.clickHighlight, this.innerInteractionKeys)
          ? ''
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.innerHoverStyle.strokeWidth
          ? '4 3'
          : ''
      )
      .attr('fill-opacity', d => {
        if ((d.innerLatitude && d.innerLongitude) || (d[this.latitudeAccessor] && d[this.longitudeAccessor])) {
          return checkInteraction(
            d,
            this.markerStyle.opacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return 0;
        }
      })
      .attr('stroke-opacity', d => {
        if ((d.innerLatitude && d.innerLongitude) || (d[this.latitudeAccessor] && d[this.longitudeAccessor])) {
          return checkInteraction(
            d,
            this.markerStyle.opacity,
            this.hoverOpacity,
            this.hoverHighlight,
            this.clickHighlight,
            this.innerInteractionKeys
          );
        } else {
          return 0;
        }
      })
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      })
      .on('click', !this.suppressEvents && this.markerStyle.visible ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on(
        'mouseover',
        !this.suppressEvents && this.markerStyle.visible ? (d, i, n) => this.onHoverHandler(d, n[i]) : null
      )
      .on('mouseout', !this.suppressEvents && this.markerStyle.visible ? d => this.onMouseOutHandler(d) : null);
  }

  exitMarkers() {
    this.exitMarker
      .transition('exit')
      .duration(this.hoverHighlight ? 0 : this.duration)
      .ease(easeCircleIn)
      .style('fill-opacity', 0)
      .style('stroke-opacity', 0)
      .attr('r', 0);

    this.updateMarker
      .transition('accessibilityAfterExit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exitMarker.remove();
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

  // parsing this out as we only want to re-order the DOM when necessary (sort or data udpate)
  orderMarkers() {
    this.updateMarker.order();
    this.update.order();
    this.updatingLabels.order();
  }

  drawMarkers() {
    this.updateMarker
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .attr('data-r', d =>
        this.markerStyle.visible
          ? this.radiusScale
            ? this.radiusScale(d[this.valueAccessor])
            : this.markerStyle.radius || 5
          : 0
      )
      .attr('data-cx', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0];
        } else {
          return isNaN(d.innerLongitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[0];
        }
      })
      .attr('data-cy', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1];
        } else {
          return isNaN(d.innerLatitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[1];
        }
      })
      .attr('data-fill', true)
      .transition('update-markers')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('cx', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[0];
        } else {
          return isNaN(d.innerLongitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[0];
        }
      })
      .attr('cy', d => {
        if (this.latitudeAccessor && this.longitudeAccessor) {
          return this.projection([+d[this.longitudeAccessor], +d[this.latitudeAccessor]])[1];
        } else {
          return isNaN(d.innerLatitude) ? 0 : this.projection([+d.innerLongitude, +d.innerLatitude])[1];
        }
      })
      .attr('r', d =>
        this.markerStyle.visible
          ? this.radiusScale
            ? this.radiusScale(d[this.valueAccessor])
            : this.markerStyle.radius || 5
          : 0
      )
      .call(transitionEndAll, () => {
        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
        });

        // now we can emit the event that transitions are complete
        this.transitionEndEvent.emit({ chartID: this.chartID });
      });
  }

  setMarkerStyle(d, i, n) {
    let markerColor;
    let strokeColor;
    if (checkClicked(d, this.clickHighlight, this.innerInteractionKeys) && this.innerClickStyle.color) {
      markerColor = visaColors[this.innerClickStyle.color] || this.innerClickStyle.color;
    } else if (checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) && this.innerHoverStyle.color) {
      markerColor = visaColors[this.innerHoverStyle.color] || this.innerHoverStyle.color;
    } else if (!this.markerStyle.fill) {
      markerColor = visaColors[this.markerStyle.color] || this.markerStyle.color || 'base_grey';
    } else if (this.groupAccessor) {
      markerColor = this.baseColorScale(d[this.groupAccessor]);
      strokeColor = this.strokeColors(markerColor);
    } else {
      markerColor = this.baseColorScale(d[this.valueAccessor]);
      strokeColor = this.strokeColors(markerColor);
    }
    select(n[i]).attr('stroke', strokeColor || this.precalculatedStrokes[markerColor]);
    return markerColor;
  }

  // for the time being we are going to emit a warning as annotations do not work on world-map yet
  drawAnnotations() {
    // if (this.annotations && this.annotations.length) {
    //   console.warn(
    //     'Annotations prop submitted to world-map. The annotations prop is currently not supported on world-map component.'
    //   );
    // }

    annotate({
      source: this.rootG.node(),
      data: this.annotations,
      // xScale: this.x,
      // xAccessor: this.ordinalAccessor,
      // yScale: this.y,
      // yAccessor: this.valueAccessor
      width: this.width,
      height: this.height,
      padding: this.padding,
      margin: this.margin,
      bitmaps: this.bitmaps
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.getLanguageString(), this.worldMapEl, this.annotations, undefined);
  }

  // utilize the legend component to draw the map's legend.
  drawLegendElements() {
    // if we have default series access and it is not in the data don't show legend
    const noGroupAccessor =
      this.groupAccessor === WorldMapDefaultValues.groupAccessor &&
      this.legendData &&
      this.legendData.length === 1 &&
      this.legendData[0].key === 'undefined';

    drawLegend({
      root: this.legendG,
      uniqueID: this.chartID,
      width: this.innerPaddedWidth,
      height: this.margin.top + 20,
      colorArr: this.colorArr,
      baseColorArr:
        (this.colorPalette && this.colorPalette.includes('categorical')) ||
        (this.colorPalette && this.colorPalette.includes('diverging'))
          ? this.preparedColors
          : [this.preparedColors[this.preparedColors.length - 1]],
      scale: this.colorScale,
      steps: this.colorSteps,
      margin: this.margin,
      padding: this.padding,
      duration: this.duration,
      type: this.groupAccessor ? 'bar' : this.legend.type, // force to bar if we have a group accessor
      fontSize: 16,
      data: this.legendData,
      labelKey: this.groupAccessor,
      label: this.legend.labels,
      format: this.legend.format,
      hide: !this.legend || !this.legend.visible || (this.groupAccessor && noGroupAccessor), // may need to adjust for when we have group undefined
      interactionKeys: this.innerInteractionKeys,
      groupAccessor: this.groupAccessor,
      hoverHighlight: this.hoverHighlight,
      clickHighlight: this.clickHighlight,
      hoverStyle: this.innerHoverStyle,
      clickStyle: this.innerClickStyle,
      hoverOpacity: this.hoverOpacity
    });

    // now that we have drawn our legend elements we need to udpate our selection
    this.innerLegend = select(this.worldMapEl).selectAll('.legend');
  }

  // new accessibility functions added here
  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      language: this.getLanguageString(),
      rootEle: this.worldMapEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'world-map',
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
      chartTag: 'world-map',
      language: this.getLanguageString(),
      node: this.svg.node(),
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'marker',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: this.innerScopeDataKeys(),
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
    });
  }

  setGeometryAccessibilityAttributes() {
    // this makes sure every geom element has correct event handlers + semantics (role, tabindex, etc)
    this.updateMarker.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    // this adds an ARIA label to each geom (a description read by screen readers)
    const keys = this.innerScopeDataKeys();
    this.updateMarker.each((_d, i, n) => {
      setElementFocusHandler({
        chartTag: 'world-map',
        language: this.getLanguageString(),
        node: n[i],
        geomType: 'marker',
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
    initializeElementAccess(this.markers.node());
  }

  setGroupAccessibilityID() {
    // this sets an ARIA label on all the g elements in the chart
    this.markers.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.getLanguageString(), this.worldMapEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.getLanguageString(), this.worldMapEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.getLanguageString(), this.worldMapEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.getLanguageString(), this.worldMapEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.getLanguageString(), this.worldMapEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.getLanguageString(), this.worldMapEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.getLanguageString(), this.worldMapEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and gorup counts, etc)
    setAccessChartCounts({
      rootEle: this.worldMapEl,
      parentGNode: this.markers.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'world-map',
      geomType: 'marker'
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.getLanguageString(), this.worldMapEl, this.accessibility.structureNotes);
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
    if (d) {
      this.clickEvent.emit({ data: d, target: n });
    }
  }

  // handle mouse over of countries
  onHoverHandler(d, n) {
    overrideTitleTooltip(this.chartID, true);
    if (d) {
      this.hoverEvent.emit({ data: d, target: n });
      if (this.showTooltip) {
        this.eventsTooltip({ data: d, evt: event, isToShow: true });
      }
    }
  }

  // handle mouse out of countries
  onMouseOutHandler(d) {
    overrideTitleTooltip(this.chartID, false);
    if (d) {
      this.mouseOutEvent.emit();
      if (this.showTooltip) {
        this.eventsTooltip({ isToShow: false });
      }
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
      dataLabel: this.dataLabel,
      dataKeyNames: this.dataKeyNames,
      xAccessor:
        isToShow && select(evt.target).classed('country')
          ? this.joinNameAccessor
          : this.innerMarkerNameAccessor || this.joinNameAccessor,
      yAccessor:
        isToShow && select(evt.target).classed('country')
          ? this.joinAccessor
          : this.innerMarkerAccessor || this.joinAccessor,
      valueAccessor: this.valueAccessor,
      chartType: 'world-map'
    });
  }

  render() {
    this.drawStartEvent.emit({ chartID: this.chartID });
    // harcoding theme to light until we add the functionality
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
    if (this.shouldUpdateLayoutVariables) {
      this.updateChartVariable();
      this.shouldUpdateLayoutVariables = false;
    }
    if (this.shouldUpdateRootIDs) {
      this.updateRootIDs();
      this.shouldUpdateRootIDs = false;
    }
    if (this.shouldValidateMapProjection) {
      this.validateMapProjection();
      this.shouldValidateMapProjection = false;
    }
    if (this.shouldSetGlobalProjection) {
      this.setGlobalProjection();
      this.setMapFeatureQuality(); // we will not change the quality, but need to recreate features in these cases
      this.shouldSetGlobalProjection = false;
    }
    if (this.shouldValidateMarkerAccessor) {
      this.validateMarkerAccessor();
      this.shouldValidateMarkerAccessor = false;
    }
    if (this.shouldValidateInteractionKeys) {
      this.validateInteractionKeys();
      this.shouldValidateInteractionKeys = false;
    }
    if (this.shouldValidateClickStyle) {
      this.validateClickStyle();
      this.shouldValidateClickStyle = false;
    }
    if (this.shouldValidateHoverStyle) {
      this.validateHoverStyle();
      this.shouldValidateHoverStyle = false;
    }
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateTableData) {
      this.setTableData();
      this.shouldUpdateTableData = false;
    }
    if (this.shouldUpdateLegendData) {
      this.prepareLegendData();
      this.shouldUpdateLegendData = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldValidate) {
      this.shouldValidateAccessibilityProps();
      this.shouldValidateLocalizationProps();
      this.shouldValidate = false;
    }
    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the Stencil bug is fixed)

    return (
      <div class={`o-layout ${theme}`}>
        <div class="o-layout--chart">
          <this.topLevel class="world-map-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions world-map-sub-title vcl-sub-title" />
          <div class="world-map-legend vcl-legend" style={{ display: this.legend.visible ? 'block' : 'none' }} />
          <keyboard-instructions
            uniqueID={this.chartID}
            geomType={'marker'}
            groupName={'marker-group'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
            language={this.getLanguageString()}
            chartTag={'world-map'}
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
          <div class="visa-viz-world-map-container" />
          <div class="world-map-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(WorldMapDefaultValues);
    let i = 0;
    const exceptions = {
      showTooltip: {
        exception: false
      },
      showGridlines: {
        exception: false
      },
      hoverOpacity: {
        exception: 0
      },
      mainTitle: {
        exception: ''
      },
      subTitle: {
        exception: ''
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : WorldMapDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
