/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';
import { select, event } from 'd3-selection';
import { arc, pie } from 'd3-shape';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IReferenceStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType
} from '@visa/charts-types';
import { PieChartDefaultValues } from './pie-chart-default-values';
import { easeCircleIn } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import 'd3-transition';
import { v4 as uuid } from 'uuid';
import Utils from '@visa/visa-charts-utils';

const {
  // verifyTextHasSpace,
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
  drawTooltip,
  formatStats,
  getColors,
  getLicenses,
  getPadding,
  getScopedData,
  initTooltipStyle,
  transitionEndAll,
  overrideTitleTooltip,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps,
  findTagLevel
} = Utils;
@Component({
  tag: 'pie-chart',
  styleUrl: 'pie-chart.scss'
})
export class PieChart {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = PieChartDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = PieChartDefaultValues.subTitle;
  @Prop({ mutable: true }) centerTitle: string = PieChartDefaultValues.centerTitle;
  @Prop({ mutable: true }) centerSubTitle: string = PieChartDefaultValues.centerSubTitle;
  @Prop({ mutable: true }) height: number = PieChartDefaultValues.height;
  @Prop({ mutable: true }) width: number = PieChartDefaultValues.width;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = PieChartDefaultValues.highestHeadingLevel;

  @Prop({ mutable: true }) margin: IBoxModelType = PieChartDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = PieChartDefaultValues.padding;

  // Data (2/7)
  @Prop() data: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) ordinalAccessor: string = PieChartDefaultValues.ordinalAccessor;
  @Prop({ mutable: true }) valueAccessor: string = PieChartDefaultValues.valueAccessor;
  @Prop({ mutable: true }) sortOrder: string = PieChartDefaultValues.sortOrder;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = PieChartDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) innerRatio: number = PieChartDefaultValues.innerRatio;
  @Prop({ mutable: true }) showEdgeLine: boolean = PieChartDefaultValues.showEdgeLine;
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = PieChartDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = PieChartDefaultValues.clickStyle;
  @Prop({ mutable: true }) referenceStyle: IReferenceStyleType = PieChartDefaultValues.referenceStyle;
  @Prop({ mutable: true }) cursor: string = PieChartDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = PieChartDefaultValues.hoverOpacity;

  // Data label (5/7)
  @Prop({ mutable: true }) showPercentage: boolean = PieChartDefaultValues.showPercentage;
  @Prop({ mutable: true }) showTooltip: boolean = PieChartDefaultValues.showTooltip;
  @Prop({ mutable: true }) showLabelNote: boolean = PieChartDefaultValues.showLabelNote;
  @Prop({ mutable: true }) labelOffset: number = PieChartDefaultValues.labelOffset;
  @Prop({ mutable: true }) dataLabel: IDataLabelType = PieChartDefaultValues.dataLabel;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = PieChartDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = PieChartDefaultValues.accessibility;
  @Prop({ mutable: true }) annotations: object[] = PieChartDefaultValues.annotations;

  // Calculation (6/7)
  @Prop() referenceData: object[];

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = PieChartDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = PieChartDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  @Element()
  pieChartEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  graphDataMerged: any;
  preppedData: any;
  svg: any;
  root: any;
  rootG: any;
  arc: any;
  edgeG: any;
  current: any;
  enter: any;
  exit: any;
  enteringLabels: any;
  exitingLabels: any;
  updatingLabels: any;
  enteringRefLabels: any;
  exitingRefLabels: any;
  updatingRefLabels: any;
  enteringLabelsNotes: any;
  exitingLabelsNotes: any;
  updatingLabelsNotes: any;
  enteringRefLabelsNotes: any;
  exitingRefLabelsNotes: any;
  updatingRefLabelsNotes: any;
  enteringEdges: any;
  exitingEdges: any;
  updatingEdges: any;
  update: any;
  updateRefPie: any;
  duration: number;
  defaults: boolean;
  innerWidth: number;
  innerHeight: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  radius: number;
  innerRadius: number;
  outerRadius: number;
  pie: any;
  pieBackground: any;
  pieG: any;
  placement: string;
  refArr: any;
  edges: any;
  refEdges: any;
  pieData: any;
  colorArr: any;
  preparedColors: any;
  refData: any;
  labelsCurrent: any;
  labelG: any;
  tooltipG: any;
  refLabelG: any;
  refLabelsCurrent: any;
  labelsCurrentNotes: any;
  refLabelsCurrentNotes: any;
  tableData: any;
  tableColumns: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  chartID: string;
  innerInteractionKeys: any;
  shouldValidate: boolean = false;
  shouldUpdateCenterTitle: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldResetRoot: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetColors: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldUpdateGeometries: boolean = false;
  shouldUpdateEdgeLines: boolean = false;
  shouldUpdateInnerRatio: boolean = false;
  shouldUpdateLayout: boolean = false;
  shouldSetPieRadius: boolean = false;
  shouldprepareChartData: boolean = false;
  shouldUpdateReferenceLines: boolean = false;
  shouldUpdateClickFunc: boolean = false;
  shouldUpdateHoverFunc: boolean = false;
  shouldUpdateMouseoutFunc: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldSetLabelOpacity: boolean = false;
  shouldCheckLabelColor: boolean = false;
  shouldUpdateScales: boolean = false;
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
  shouldSetAnnotationAccessibility: boolean = false;
  shouldSetTextures: boolean = false;
  shouldSetStrokes: boolean = false;
  strokes: any = {};
  topLevel: string = 'h2';
  bottomLevel: string = 'p';

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

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
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

  @Watch('centerTitle')
  @Watch('centerSubTitle')
  centerTitleWatcher(_newVal, _oldVal) {
    this.shouldUpdateCenterTitle = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  layoutWatcher(_newVal, _oldVal) {
    this.shouldUpdateLayout = true;
    this.shouldUpdateData = true;
    this.shouldResetRoot = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateScales = true;
    this.shouldSetPieRadius = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('data')
  dataWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetColors = true;
  }

  @Watch('uniqueID')
  idWatcher(newVal, _oldVal) {
    this.chartID = newVal || 'pie-chart-' + uuid();
    this.pieChartEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldCheckLabelColor = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetStrokes = true;
  }

  @Watch('ordinalAccessor')
  ordinalAccessorWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetLabelOpacity = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    if (!(this.interactionKeys && this.interactionKeys.length)) {
      this.shouldValidateInteractionKeys = true;
      this.shouldSetSelectionClass = true;
    }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateData = true;
    this.shouldUpdateScales = true;
    this.shouldSetGlobalSelections = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetLabelOpacity = true;
    this.shouldCheckLabelColor = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('sortOrder')
  sortWatcher(_newVal, _oldVal) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldDrawInteractionState = true;
    this.shouldUpdateTableData = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldUpdateLabels = true;
    this.shouldUpdateReferenceLines = true;
    this.shouldUpdateAnnotations = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('colorPalette')
  paletteWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('colors')
  colorsWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('innerRatio')
  innerRatioWatcher(_newVal, _oldVal) {
    this.shouldSetPieRadius = true;
    this.shouldUpdateData = true;
    this.shouldUpdateInnerRatio = true;
    this.shouldUpdateGeometries = true;
    this.shouldUpdateEdgeLines = true;
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('showEdgeLine')
  showEdgeLineWatcher(_newVal, _oldVal) {
    this.shouldUpdateEdgeLines = true;
  }

  @Watch('referenceStyle')
  referenceWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
  }

  @Watch('showPercentage')
  showPercentageWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldValidate = true;
    this.shouldUpdateTableData = true;
  }

  @Watch('dataLabel')
  labelWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
    this.shouldValidate = true;
    this.shouldUpdateTableData = true;
    const newPlacementVal = _newVal && _newVal.placement ? _newVal.placement : false;
    const oldPlacementVal = _oldVal && _oldVal.placement ? _oldVal.placement : false;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetLabelOpacity = true;
    }
    if (newPlacementVal !== oldPlacementVal) {
      this.shouldSetLabelOpacity = true;
      this.shouldCheckLabelColor = true;
    }
  }

  @Watch('showLabelNote')
  labelNoteWatcher(_newVal, _oldVal) {
    this.shouldSetLabelOpacity = true;
    this.shouldUpdateLabels = true;
  }

  @Watch('labelOffset')
  labelOffsetWatcher(_newVal, _oldVal) {
    this.shouldUpdateLabels = true;
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

  @Watch('referenceData')
  referenceDataWatcher(_newVal, _oldVal) {
    this.shouldUpdateReferenceLines = true;
    // this.shouldUpdateAccessibility = true;
    this.shouldUpdateTableData = true;
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
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetChartAccessibilityLongDescription = true;
    this.shouldSetChartAccessibilityContext = true;
    this.shouldSetChartAccessibilityExecutiveSummary = true;
    this.shouldSetChartAccessibilityPurpose = true;
    this.shouldSetChartAccessibilityStatisticalNotes = true;
    this.shouldSetChartAccessibilityStructureNotes = true;
  }

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
  }
  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetStrokes = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldCheckLabelColor = true;
    this.shouldSetLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldUpdateTableData = true;
  }

  componentWillLoad() {
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.chartID = this.uniqueID || 'pie-chart-' + uuid();
      this.pieChartEl.id = this.chartID;
      this.setTagLevels();
      this.prepareScales();
      this.prepareData();
      this.setLayoutData();
      this.setPieRadius();
      this.validateInteractionKeys();
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
      this.setTextures();
      this.setStrokes();
      this.setGlobalSelections();
      this.setColors();
      this.setInnerRatio();
      this.enterGeometries();
      this.updateGeometries();
      this.exitGeometries();
      this.enterLabels('Labels');
      this.updateLabels('Labels');
      this.exitLabels('Labels');
      this.enterEdgeLine();
      this.updateEdgeLine('Edges');
      this.exitEdgeLine();
      this.enterLabels('RefLabels');
      this.updateLabels('RefLabels');
      this.exitLabels('RefLabels');
      this.drawDataLabels('Labels');
      this.drawDataLabels('RefLabels');
      this.drawGeometries();
      this.drawEdgeLine();
      this.drawReferenceLines();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.drawCenterTitle();
      this.setSelectedClass();
      this.updateInteractionState();
      this.setLabelOpacity();
      this.checkLabelColorAgainstBackground();
      this.updateCursor();
      this.bindInteractivity();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.onChangeHandler();
      hideNonessentialGroups(this.root.node(), this.pieG.node());
      this.setGroupAccessibilityAttributes();
      this.setGroupAccessibilityID();
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
      if (this.shouldEnterUpdateExit) {
        this.enterGeometries();
        this.updateGeometries();
        this.exitGeometries();
        this.enterEdgeLine();
        this.updateEdgeLine('Edges');
        this.exitEdgeLine();
        this.enterLabels('Labels');
        this.updateLabels('Labels');
        this.exitLabels('Labels');
        this.enterLabels('RefLabels');
        this.updateLabels('RefLabels');
        this.exitLabels('RefLabels');
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldUpdateCenterTitle) {
        this.drawCenterTitle();
        this.shouldUpdateCenterTitle = false;
      }
      if (this.shouldUpdateEdgeLines) {
        this.updateEdgeLine('Edges');
        this.drawEdgeLine();
        this.shouldUpdateEdgeLines = false;
      }
      if (this.shouldUpdateLabels) {
        this.drawDataLabels('Labels');
        this.drawDataLabels('RefLabels');
        this.shouldUpdateLabels = false;
      }
      if (this.shouldUpdateReferenceLines) {
        this.drawReferenceLines();
        this.shouldUpdateReferenceLines = false;
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
      this.onChangeHandler();
      resolve('component did update');
    });
  }

  shouldValidateAccessibilityProps() {
    if (this.shouldValidateAccessibility && !this.accessibility.disableValidation) {
      this.shouldValidateAccessibility = false;
      const NORMALIZED = 'normalized';
      validateAccessibilityProps(this.chartID, this.accessibility, {
        annotations: this.annotations,
        data: this.data,
        uniqueID: this.uniqueID,
        context: {
          mainTitle: this.mainTitle,
          onClickFunc: this.suppressEvents ? undefined : this.clickFunc.emit,
          tooltipLabel: this.tooltipLabel,
          dataLabel: this.dataLabel,
          valueAccessor: this.valueAccessor
        },
        misc: {
          normalized: this.hasOwnProperty(NORMALIZED) ? this[NORMALIZED] : false
        }
      });
    }
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      // this.interactionKeys ? '' : (this.interactionKeys = [this.ordinalAccessor]);
      this.interactionKeys && this.interactionKeys.length ? this.interactionKeys : [this.ordinalAccessor];
  }

  setLayoutData() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  setPieRadius() {
    this.radius = Math.min(this.innerPaddedWidth, this.innerPaddedHeight) / 2;

    // this.pieData.forEach(d => {
    //   this.innerRadius = this.radius * this.innerRatio;
    //   this.outerRadius = this.radius;
    // });

    this.innerRadius = this.radius * this.innerRatio;
    this.outerRadius = this.radius;
  }

  prepareData() {
    if (this.data) {
      if (this.sortOrder === 'asc') {
        this.preppedData = [...this.data].sort((a, b) => Number(a[this.valueAccessor]) - Number(b[this.valueAccessor]));
      } else if (this.sortOrder === 'desc') {
        this.preppedData = [...this.data].sort((a, b) => Number(b[this.valueAccessor]) - Number(a[this.valueAccessor]));
      } else {
        this.preppedData = this.data;
      }
      let dataSum = 0;
      this.preppedData.map(d => {
        d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);
        dataSum += d[this.valueAccessor];
        d.getSum = () => dataSum; // sum(this.preppedData, d => parseFloat(d[this.valueAccessor]));
        // d['rowSum'] = sum(this.preppedData, d => parseFloat(d[this.valueAccessor]));
      });
    }

    this.refArr = [];
    if (this.referenceData && this.referenceData.length) {
      let dataTotal = 0;
      this.preppedData.map(k => (dataTotal += k[this.valueAccessor]));
      this.referenceData.forEach(d => {
        const refPrep = [];
        refPrep.push(d);
        refPrep.push({
          [this.ordinalAccessor]: '',
          [this.valueAccessor]: dataTotal - d[this.valueAccessor]
        });
        const refPie = this.pie(refPrep);
        this.refArr.push({ ...refPie[0] });
      });
    }

    this.pieData = this.pie(this.preppedData);
    this.refData = this.refArr;
  }

  prepareScales() {
    this.pie = pie()
      .value(data => {
        return data[this.valueAccessor];
      })
      .sort((_a, _b) => null);

    this.arc = arc();
  }

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'pie-chart');
    this.tableData = getScopedData(this.preppedData, keys);
    this.tableColumns = Object.keys(keys);
  }

  setColors() {
    const colorFromProps =
      this.colors && this.colors.length
        ? convertVisaColor(this.colors)
        : getColors(this.colorPalette, this.preppedData.length - 1);
    if (!this.colors || !this.colors.length) {
      colorFromProps.push(visaColors.base_grey);
    }
    this.preparedColors = colorFromProps;
  }

  setTextures() {
    const colorsArray = this.preparedColors.range ? this.preparedColors.range() : this.preparedColors;
    if (this.accessibility.hideTextures || colorsArray.length > 6) {
      this.colorArr = this.preparedColors;
    } else {
      const textures = convertColorsToTextures({
        colors: colorsArray,
        rootSVG: this.svg.node(),
        id: this.chartID,
        scheme: 'categorical'
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
      hoverStyle: this.hoverStyle,
      stacked: true
    });
  }

  setInnerRatio() {
    this.innerRatio = this.innerRatio === 0 || this.innerRatio ? this.innerRatio : PieChartDefaultValues.innerRatio;
  }

  renderRootElements() {
    this.svg = select(this.pieChartEl)
      .select('.visa-viz-d3-pie-container')
      .append('svg')
      .style('isolation', 'isolate')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);

    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.pieG = this.rootG.append('g').attr('class', 'pie-group');

    this.labelG = this.rootG.append('g').attr('class', 'pie-dataLabel-group');

    this.refLabelG = this.rootG.append('g').attr('class', 'pie-dataLabel-group');

    this.edgeG = this.rootG.append('g').attr('class', 'pie-edge-line-group');

    this.tooltipG = select(this.pieChartEl).select('.pie-tooltip');
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
      .attr('transform', `translate(${this.padding.left + this.radius}, ${this.padding.top + this.radius})`);

    setAccessibilityDescriptionWidth(this.chartID, this.width);
  }

  setGlobalSelections() {
    const dataBoundToGeometries = this.pieG.selectAll('.arc').data(this.pieData, d => {
      d[this.ordinalAccessor] = d.data[this.ordinalAccessor];
      return d[this.ordinalAccessor];
    });

    this.enter = dataBoundToGeometries.enter().append('path');
    this.exit = dataBoundToGeometries.exit();
    this.update = dataBoundToGeometries.merge(this.enter);

    this.exitSize = this.exit.size();
    this.enterSize = this.enter.size();

    const dataBoundToLabels = this.labelG.selectAll('.pie-dataLabel-highlight').data(this.pieData);
    this.enteringLabels = dataBoundToLabels.enter().append('text');
    this.exitingLabels = dataBoundToLabels.exit();
    this.updatingLabels = dataBoundToLabels.merge(this.enteringLabels);

    const dataBoundToLabelsNotes = this.labelG.selectAll('.pie-dataLabel-note').data(this.pieData);
    this.enteringLabelsNotes = dataBoundToLabelsNotes.enter().append('text');
    this.exitingLabelsNotes = dataBoundToLabelsNotes.exit();
    this.updatingLabelsNotes = dataBoundToLabelsNotes.merge(this.enteringLabelsNotes);

    const dataBoundToRefLabels = this.refLabelG.selectAll('.pie-dataLabel-highlight').data(this.refData);
    this.enteringRefLabels = dataBoundToRefLabels.enter().append('text');
    this.exitingRefLabels = dataBoundToRefLabels.exit();
    this.updatingRefLabels = dataBoundToRefLabels.merge(this.enteringRefLabels);

    const dataBoundToRefLabelsNotes = this.refLabelG.selectAll('.pie-dataLabel-note').data(this.refData);
    this.enteringRefLabelsNotes = dataBoundToRefLabelsNotes.enter().append('text');
    this.exitingRefLabelsNotes = dataBoundToRefLabelsNotes.exit();
    this.updatingRefLabelsNotes = dataBoundToRefLabelsNotes.merge(this.enteringRefLabelsNotes);

    const dataBoundToEdges = this.edgeG.selectAll('.edge-line').data(this.pieData);
    this.enteringEdges = dataBoundToEdges.enter().append('path');
    this.exitingEdges = dataBoundToEdges.exit();
    this.updatingEdges = dataBoundToEdges.merge(this.enteringEdges);
  }

  updateInteractionState() {
    removeHoverStrokes(this.svg.node());
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    this.update
      .attr('opacity', d =>
        checkInteraction(
          d.data,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        )
      )
      .attr('fill', (d, i) => {
        return this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.innerInteractionKeys) &&
          this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : this.hoverHighlight &&
            checkHovered(d, this.hoverHighlight, this.innerInteractionKeys) &&
            this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : this.preppedData.length === 2 && i === 1
          ? this.preparedColors[i]
          : this.colorArr[i] || this.colorArr[0];
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
              key: d[this.ordinalAccessor], // this must match whatever is used to bind the data, otherwise i
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
  }

  setLabelOpacity() {
    const labelOpacity = this.dataLabel.visible ? 1 : 0;
    const noteOpacity = this.showLabelNote ? 1 : 0;

    this.updatingLabels.attr('opacity', d =>
      checkInteraction(
        d.data,
        labelOpacity,
        this.hoverOpacity,
        this.hoverHighlight,
        this.clickHighlight,
        this.innerInteractionKeys
      ) < 1
        ? 0
        : 1
    );
    // addStrokeUnder(this.updatingLabels, 'white');

    this.updatingRefLabels.attr('opacity', d =>
      checkInteraction(
        d.data,
        labelOpacity,
        this.hoverOpacity,
        this.hoverHighlight,
        this.clickHighlight,
        this.innerInteractionKeys
      ) < 1
        ? 0
        : 1
    );
    // addStrokeUnder(this.updatingRefLabels, 'white');

    this.updatingLabelsNotes.attr('opacity', d =>
      checkInteraction(
        d.data,
        noteOpacity,
        this.hoverOpacity,
        this.hoverHighlight,
        this.clickHighlight,
        this.innerInteractionKeys
      ) < 1
        ? 0
        : 1
    );
    // addStrokeUnder(this.updatingLabelsNotes, 'white');

    this.updatingRefLabelsNotes.attr('opacity', d =>
      checkInteraction(
        d.data,
        noteOpacity,
        this.hoverOpacity,
        this.hoverHighlight,
        this.clickHighlight,
        this.innerInteractionKeys
      ) < 1
        ? 0
        : 1
    );
    // addStrokeUnder(this.updatingRefLabelsNotes, 'white');
  }

  // setLabelOpacity() {
  //   this.updatingLabels.interrupt('opacity');
  //   this.processLabelOpacity(this.updatingLabels);
  // }

  // processLabelOpacity(selection) {
  //   const opacity = this.dataLabel.visible ? 1 : 0;
  //   const ordinalAxis = this.layout === 'vertical' ? 'x' : 'y';
  //   const ordinalDimension = this.layout === 'vertical' ? 'width' : 'height';
  //   const valueAxis = this.layout === 'vertical' ? 'y' : 'x';
  //   const valueDimension = this.layout === 'vertical' ? 'height' : 'width';
  //   const fullBandwidth =
  //     this.layout === 'vertical' ? this.innerPaddedWidth / this.data.length : this.innerPaddedHeight / this.data.length;

  //   selection.attr('opacity', d => {
  //     const dimensions = {};
  //     dimensions[ordinalDimension] =
  //       this.placement === 'left' || this.placement === 'bottom' ? this[ordinalAxis].bandwidth() : fullBandwidth;
  //     if (this.placement === 'left' || this.placement === 'bottom') {
  //       dimensions[valueDimension] = Math.abs(
  //         this.layout === 'vertical'
  //           ? this[valueAxis](0) - this[valueAxis](d[this.valueAccessor])
  //           : this[valueAxis](d[this.valueAccessor]) - this[valueAxis](0)
  //       );
  //     }
  //     const hasRoom =
  //       this.accessibility.showSmallLabels ||
  //       verifyTextHasSpace({
  //         text: formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format),
  //         dimensions,
  //         fontSize: 14
  //       });
  //     return hasRoom
  //       ? checkInteraction(
  //           d,
  //           opacity,
  //           this.hoverOpacity,
  //           this.hoverHighlight,
  //           this.clickHighlight,
  //           this.innerInteractionKeys
  //         ) < 1
  //         ? 0
  //         : 1
  //       : 0;
  //   });
  // }

  checkLabelColorAgainstBackground() {
    this.updatingLabels.attr('fill', this.textTreatmentHandler);
  }

  textTreatmentHandler = (d, i, n, specifiedPlacement?) => {
    const placement = specifiedPlacement || this.placement;
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

    const color = placement === 'inside' ? autoTextColor(bgColor) : visaColors.dark_text;
    const me = select(n[i]);
    me.attr(
      'filter',
      !me.classed('textIsMoving')
        ? createTextStrokeFilter({
            root: this.svg.node(),
            id: this.chartID,
            color: placement === 'inside' ? bgColor : '#ffffff'
          })
        : null
    );
    return color;
  };

  enterGeometries() {
    this.enter.interrupt();

    this.enter
      .attr('class', 'arc')
      .classed('entering', true)
      .attr('opacity', 0)
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      });
    this.update.order();
  }

  updateGeometries() {
    this.update.interrupt();

    // opacity
    this.update
      .transition('opacity')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(
          d.data,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        )
      );
  }

  exitGeometries() {
    this.exit.interrupt();

    this.exit
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attrTween('d', (_d, i, n) => {
        const end = {
          startAngle: 0,
          endAngle: 0,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius
        };
        const me = n[i];
        const interpolator = interpolate(me._current, end);
        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      })
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
    this.update
      .classed('geometryIsMoving', (d, i, n) => {
        const geometryIsUpdating = checkAttributeTransitions(select(n[i]), [
          {
            attr: 'd',
            newValue: this.arc({
              startAngle: d.startAngle,
              endAngle: d.endAngle,
              innerRadius: this.innerRadius,
              outerRadius: this.outerRadius
            })
          }
        ]);
        return geometryIsUpdating;
      })
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attrTween('d', (d, i, n) => {
        let start = n[i]._current;
        const end = {
          startAngle: d.startAngle,
          endAngle: d.endAngle,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius
        };
        if (select(n[i]).classed('entering')) {
          start = {
            startAngle: 0,
            endAngle: 0,
            innerRadius: this.innerRadius,
            outerRadius: this.outerRadius
          };
          select(n[i]).classed('entering', false);
        }
        const me = n[i];
        const interpolator = interpolate(start, end);
        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      })
      .call(transitionEndAll, () => {
        this.update.classed('geometryIsMoving', false);
        this.updateInteractionState();

        // we must make sure if geometries move, that our focus indicator does too
        retainAccessFocus({
          parentGNode: this.rootG.node()
          // focusDidExist // this only matters for exiting selections
          // recursive: true // this only matters for
        });
      });
  }

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

  drawReferenceLines() {
    const currentRefPie = this.pieG.selectAll('.arc-ref').data(this.refData);
    const enterRefPie = currentRefPie
      .enter()
      .append('path')
      .attr('opacity', 0)
      .attr('class', 'arc-ref')
      .attr('fill', 'none')
      .attr('stroke-width', 0)
      .classed('entering', true)
      .each((_d, i, n) => {
        initializeElementAccess(n[i]);
      });

    const exitRefPie = currentRefPie.exit();
    exitRefPie
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attrTween('d', (_, i, n) => {
        const me = n[i];
        const start = me._current;

        const end = {
          startAngle: 0,
          endAngle: 0,
          innerRadius: Math.max(0, this.innerRadius - 5),
          outerRadius: this.outerRadius + 5
        };
        const interpolator = interpolate(start, end);

        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      })
      .remove();

    this.updateRefPie = currentRefPie.merge(enterRefPie).classed('ignore', (_, i) => (i === 0 ? false : true));

    this.updateRefPie
      .attr('opacity', this.referenceStyle.opacity)
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('stroke-width', this.innerRatio !== 0 ? 3 : 0)
      .attr(this.innerRatio !== 0 ? 'fill' : 'stroke', 'rgba(0,0,0,0)')
      .attr(this.innerRatio !== 0 ? 'stroke' : 'fill', (_, i) => {
        // d.fill = this.colorArr[i];
        return (
          visaColors[this.referenceStyle.color] || this.referenceStyle.color || this.preparedColors[i]
        ); /* refIsLarger ? this.colorArr[i] :*/
      })
      .attrTween('d', (d, i, n) => {
        const me = n[i];
        let start = me._current;
        if (select(me).classed('entering')) {
          start = {
            startAngle: 0,
            endAngle: 0,
            innerRadius: Math.max(0, this.innerRadius - 5),
            outerRadius: this.outerRadius + 5
          };
          select(me).classed('entering', false);
        }
        const end = {
          startAngle: d.endAngle,
          endAngle: d.endAngle,
          innerRadius: Math.max(0, this.innerRadius - 5),
          outerRadius: this.outerRadius + 5
        };
        const interpolator = interpolate(start, end);
        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      });
  }

  enterLabels(group) {
    const placement = group === 'RefLabels' ? 'edge' : this.dataLabel.placement;

    this['entering' + group]
      .attr('class', 'pie-dataLabel-highlight')
      .attr('opacity', 0)
      .classed('entering', true)
      .attr('fill', (d, i, n) => this.textTreatmentHandler(d, i, n, placement))
      .attr('cursor', !this.suppressEvents && group !== 'RefLabels' ? this.cursor : null)
      .on('click', !this.suppressEvents && group !== 'RefLabels' ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents && group !== 'RefLabels' ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents && group !== 'RefLabels' ? () => this.onMouseOutHandler() : null);

    this['entering' + group + 'Notes']
      .attr('class', 'pie-dataLabel-note')
      .attr('opacity', 0)
      .classed('entering', true)
      .attr('cursor', !this.suppressEvents && group !== 'RefLabels' ? this.cursor : null)
      .on('click', !this.suppressEvents && group !== 'RefLabels' ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents && group !== 'RefLabels' ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents && group !== 'RefLabels' ? () => this.onMouseOutHandler() : null);
  }

  updateLabels(group) {
    this.updatingLabels.interrupt();
    const labelOpacity = this.dataLabel.visible ? 1 : 0;
    const noteOpacity = this.showLabelNote ? 1 : 0;

    this['updating' + group]
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('opacity', d =>
        checkInteraction(
          d.data,
          labelOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1
      );

    this['updating' + group + 'Notes']
      .transition('opacity')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', d =>
        checkInteraction(
          d.data,
          noteOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        ) < 1
          ? 0
          : 1
      );
  }

  exitLabels(group) {
    const placement = group === 'RefLabels' ? 'edge' : this.dataLabel.placement;

    this['exiting' + group]
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attrTween('x', (_d, i, n) => {
        const me = n[i];
        let inner = 'inner';
        let arcPadding = 0;
        if (placement !== 'inside') {
          inner = 'outer';
          arcPadding = this.labelOffset;
        }
        const end = {
          startAngle: 0,
          start: 0,
          endAngle: 0,
          innerRadius: this[inner + 'Radius'] + arcPadding,
          outerRadius: this.outerRadius + arcPadding
        };
        const interpolator = interpolate(me._current, end);
        return t => {
          me._current = interpolator(t);
          select(me).attr('y', this.arc.centroid(me._current)[1]);
          select(me).text(
            placement === 'edge' && i === this.preppedData.length - 1 && group !== 'RefLabels'
              ? ''
              : this.showPercentage
              ? formatStats((me._current.endAngle - me._current.start) / (2 * Math.PI), '0.[0]%')
              : this.dataLabel.format
              ? formatStats(me._current.value, this.dataLabel.format)
              : me._current.value
          );
          return this.arc.centroid(me._current)[0];
        };
      })
      .remove();

    this['exiting' + group + 'Notes']
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attrTween('x', (_d, i, n) => {
        const me = n[i];
        let inner = 'inner';
        let arcPadding = 0;
        if (placement !== 'inside') {
          inner = 'outer';
          arcPadding = this.labelOffset;
        }
        const end = {
          value: 0,
          startAngle: 0,
          endAngle: 0,
          innerRadius: this[inner + 'Radius'] + arcPadding,
          outerRadius: this.outerRadius + arcPadding
        };
        const interpolator = interpolate(me._current, end);
        return t => {
          me._current = interpolator(t);
          select(me).attr('y', this.arc.centroid(me._current)[1]);
          return this.arc.centroid(me._current)[0];
        };
      })
      .remove();
  }

  drawDataLabels(group) {
    const placement = group === 'RefLabels' ? 'edge' : this.dataLabel.placement;

    this['updating' + group]
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('dx', 0) // can i move this into a seperate this.update? testing now
      .attr('dy', placement === 'inside' ? '0.1em' : 0)
      .attr('text-anchor', (d, i) =>
        placement === 'inside' ? 'middle' : d.endAngle < Math.PI || i === 0 ? 'start' : 'end'
      )
      .attrTween('x', (d, i, n) => {
        const me = n[i];
        let start = me._current;
        let innerRadius = 'innerRadius';
        let arcPadding = 0;
        let startAngle = 'startAngle';
        if (placement !== 'inside') {
          innerRadius = 'outerRadius';
          arcPadding = this.labelOffset;
        }
        if (placement === 'edge') {
          startAngle = 'endAngle';
        }
        if (select(n[i]).classed('entering')) {
          start = {
            value: d.data[this.valueAccessor],
            start: d.startAngle,
            startAngle: 0,
            endAngle: 0,
            innerRadius: this[innerRadius] + arcPadding,
            outerRadius: this.outerRadius + arcPadding
          };
          select(n[i]).classed('entering', false);
        }
        const end = {
          value: d.data[this.valueAccessor],
          start: d.startAngle,
          startAngle: d[startAngle],
          endAngle: d.endAngle,
          innerRadius: this[innerRadius] + arcPadding,
          outerRadius: this.outerRadius + arcPadding
        };
        const interpolator = interpolate(start, end);
        return t => {
          me._current = interpolator(t);
          select(me).attr('y', this.arc.centroid(me._current)[1]);
          select(me).text(
            placement === 'edge' && i === this.preppedData.length - 1 && group !== 'RefLabels'
              ? ''
              : this.showPercentage
              ? formatStats((me._current.endAngle - me._current.start) / (2 * Math.PI), '0.0%')
              : this.dataLabel.format
              ? formatStats(me._current.value, this.dataLabel.format)
              : me._current.value
          );
          // addStrokeUnder(select(me), 'white');
          return this.arc.centroid(me._current)[0];
        };
      })
      .call(transitionEndAll, () => {
        // addStrokeUnder(this['updating' + group], 'white');
      });

    this['updating' + group + 'Notes']
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('dx', 0) // can I move this here? was in a seperate update
      .text((d, i) =>
        placement === 'edge' && i === this.preppedData.length - 1 && group !== 'RefLabels'
          ? ''
          : d.data[this.ordinalAccessor]
      ) // can I move this here? was in a seperate update
      .attr('dy', placement === 'inside' ? 0 : '1.2em')
      .attr('text-anchor', (d, i) => (d.endAngle < Math.PI || i === 0 ? 'start' : 'end'))
      .attrTween('x', (d, i, n) => {
        const me = n[i];
        let start = me._current;
        const startAngle = placement === 'edge' ? 'endAngle' : 'startAngle';
        if (select(n[i]).classed('entering')) {
          start = {
            startAngle: 0,
            endAngle: 0,
            innerRadius: this.outerRadius + this.labelOffset,
            outerRadius: this.outerRadius + this.labelOffset
          };
          select(n[i]).classed('entering', false);
        }
        const end = {
          startAngle: d[startAngle],
          endAngle: d.endAngle,
          innerRadius: this.outerRadius + this.labelOffset,
          outerRadius: this.outerRadius + this.labelOffset
        };
        const interpolator = interpolate(start, end);
        return t => {
          me._current = interpolator(t);
          select(me).attr('y', this.arc.centroid(me._current)[1]);
          // addStrokeUnder(select(me), 'white');
          return this.arc.centroid(me._current)[0];
        };
      })
      .call(transitionEndAll, () => {
        // addStrokeUnder(this['updating' + group + 'Notes'], 'white');
      });
  }

  drawCenterTitle() {
    let titleRoot = this.rootG.select('.pie-center-title-group');

    if (this.defaults) {
      titleRoot = this.rootG
        .append('g')
        .attr('class', 'pie-center-title-group')
        .style('opacity', 1);

      titleRoot
        .append('text')
        .attr('class', 'visa-ui-header--1 visa-viz-title')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', visaColors.dark_text);

      titleRoot
        .append('text')
        .attr('class', 'visa-ui-text--body visa-viz-subtitle')
        .attr('text-anchor', 'middle')
        .attr('x', 0)
        .attr('fill', visaColors.dark_text);
    }
    titleRoot.select('.visa-viz-title').text(this.centerTitle);
    titleRoot
      .select('.visa-viz-subtitle')
      .attr('y', this.centerTitle ? 20 : 10)
      .text(this.centerSubTitle);

    const filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    titleRoot.attr('filter', filter);

    // addStrokeUnder(titleRoot.select('.visa-viz-title'), 'white');
    // addStrokeUnder(titleRoot.select('.visa-viz-subtitle'), 'white');
  }

  enterEdgeLine() {
    this.enteringEdges
      .attr('class', 'edge-line')
      .attr('opacity', 0)
      .classed('entering', true)
      .attr('stroke-width', 1)
      .attr('stroke', visaColors.dark_text)
      .attr('fill', 'none');
  }

  updateEdgeLine(group) {
    let edgeOpacity = 1;
    if (!(this.showEdgeLine || this.dataLabel.placement === 'edge')) {
      edgeOpacity = 0;
    }

    this.updatingEdges
      .transition('edgeOpacity')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', (_, i) => (group === 'refEdges' && i !== 0 ? 0 : edgeOpacity));
  }

  exitEdgeLine() {
    this.exitingEdges
      .transition('exit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .attrTween('d', (_, i, n) => {
        const me = n[i];
        const end = {
          startAngle: 0,
          endAngle: 0,
          innerRadius: (this.radius + this.radius * this.innerRatio) / 2,
          outerRadius: (this.radius + this.radius * this.innerRatio) / 2
        };
        const interpolator = interpolate(me._current, end);
        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      })
      .remove();
  }

  drawEdgeLine() {
    this.updatingEdges
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attrTween('d', (d, i, n) => {
        const me = n[i];
        let start = me._current;
        if (select(me).classed('entering')) {
          start = {
            startAngle: 0,
            endAngle: 0,
            innerRadius: Math.max(0, this.innerRadius - 5),
            outerRadius: this.outerRadius + 5
          };
          select(me).classed('entering', false);
        }
        const end = {
          startAngle: d.endAngle,
          endAngle: d.endAngle,
          innerRadius: Math.max(0, this.innerRadius - 5),
          outerRadius: this.outerRadius + 5
        };
        const interpolator = interpolate(start, end);
        return t => {
          me._current = interpolator(t);
          return this.arc(me._current);
        };
      });
  }

  drawAnnotations() {
    annotate({
      source: this.rootG.node(),
      data: this.annotations // ,
      // xScale: this.x,
      // xAccessor: this.ordinalAccessor,
      // yScale: this.y,
      // yAccessor: this.valueAccessor
    });
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.pieChartEl, this.annotations);
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      rootEle: this.pieChartEl,
      geomType: 'slice',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'pie-chart',
      uniqueID: this.chartID,
      groupName: 'pie',
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
      chartTag: 'pie-chart',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'slice',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'pie-chart'),
      // groupAccessor: this.groupAccessor // pie chart does not include these
      groupName: 'pie',
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
      // groupKeys: [], // pie chart does not include these
      // nested: '', // pie chart does not include these
      // recursive: true // pie chart does not include these
    });
  }

  setGeometryAccessibilityAttributes() {
    this.update.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
    this.updateRefPie.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    const keys = scopeDataKeys(this, chartAccessors, 'pie-chart');
    this.update.each((_d, i, n) => {
      setElementFocusHandler({
        node: n[i],
        geomType: 'slice',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        groupName: 'pie',
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
    this.updateRefPie.each((_d, i, n) => {
      setElementFocusHandler({
        node: n[i],
        geomType: 'slice',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        groupName: 'pie',
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
    initializeElementAccess(this.pieG.node());
  }

  setGroupAccessibilityID() {
    this.pieG.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.pieChartEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.pieChartEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.pieChartEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.pieChartEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.pieChartEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.pieChartEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.pieChartEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.pieChartEl,
      parentGNode: this.pieG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'pie-chart',
      geomType: 'slice',
      groupName: 'pie'
      // recursive: true // pie chart doesn't use this, so it is omitted
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.pieChartEl, this.accessibility.structureNotes);
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

  updateCursor() {
    this.update.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  bindInteractivity() {
    this.update
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);

    this.updatingLabels
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
    this.updatingLabelsNotes
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d.data) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d.data) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  onClickHandler(d) {
    this.clickFunc.emit(d);
  }

  onHoverHandler(d) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverFunc.emit(d);
    if (this.showTooltip) {
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
      dataLabel: this.dataLabel,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      chartType: 'pie',
      normalized: this.showPercentage
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
    if (this.shouldUpdateScales) {
      this.prepareScales();
      this.shouldUpdateScales = false;
    }
    if (this.shouldUpdateData) {
      this.prepareData();
      this.shouldUpdateData = false;
    }
    if (this.shouldUpdateLayout) {
      this.setLayoutData();
      this.shouldUpdateLayout = false;
    }
    if (this.shouldSetPieRadius) {
      this.setPieRadius();
      this.shouldSetPieRadius = false;
    }
    if (this.shouldUpdateInnerRatio) {
      this.setInnerRatio();
      this.shouldUpdateInnerRatio = false;
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
    // Everything between this comment and the first should eventually
    // be moved into componentWillUpdate (if the stenicl bug is fixed)

    return (
      <div class="o-layout is--vertical">
        <div class="o-layout--chart">
          <this.topLevel data-testid="main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions" data-testid="sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div class="visa-viz-d3-pie-container" />
          <div class="pie-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
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
    const keys = Object.keys(PieChartDefaultValues);
    let i = 0;
    const exceptions = {
      showLabelNote: {
        exception: false
      },
      innerRatio: {
        exception: 0
      },
      showPercentage: {
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
      hoverOpacity: {
        exception: 0
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : PieChartDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
