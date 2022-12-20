/**
 * Copyright (c) 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';

import { select, event } from 'd3-selection';
import { min, max } from 'd3-array';
import { linkHorizontal } from 'd3-shape';
import { easeCircleIn } from 'd3-ease';
// import { IAlluvialDiagramProps } from './alluvial-diagram-props';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
  IAnimationConfig,
  INodeConfigType,
  ILinkConfigType
} from '@visa/charts-types';
import { AlluvialDiagramDefaultValues } from './alluvial-diagram-default-values';
import { v4 as uuid } from 'uuid';
import 'd3-transition';
import Utils from '@visa/visa-charts-utils';
const {
  initializeDescriptionRoot,
  setAccessibilityController,
  initializeElementAccess,
  setElementFocusHandler,
  setElementAccessID,
  setAccessChartCounts,
  hideNonessentialGroups,
  setAccessTitle,
  setAccessSubtitle,
  setAccessLongDescription,
  setAccessExecutiveSummary,
  setAccessPurpose,
  setAccessContext,
  setAccessStatistics,
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  setAccessibilityDescriptionWidth,
  roundTo,
  resolveLabelCollision,
  transitionEndAll,
  annotate,
  checkClicked,
  checkInteraction,
  convertVisaColor,
  createTextStrokeFilter,
  drawTooltip,
  findTagLevel,
  formatDataLabel,
  formatStats,
  getColors,
  getContrastingStroke,
  getPadding,
  // getScopedData,
  checkHovered,
  initTooltipStyle,
  overrideTitleTooltip,
  scopeDataKeys,
  chartAccessors,
  sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight,
  prepareRenderChange,
  visaColors,
  validateAccessibilityProps
} = Utils;

@Component({
  tag: 'alluvial-diagram',
  styleUrl: 'alluvial-diagram.scss'
})
export class AlluvialDiagram {
  @Event() clickEvent: EventEmitter;
  @Event() hoverEvent: EventEmitter;
  @Event() mouseOutEvent: EventEmitter;
  @Event() initialLoadEvent: EventEmitter;
  @Event() initialLoadEndEvent: EventEmitter;
  @Event() drawStartEvent: EventEmitter;
  @Event() drawEndEvent: EventEmitter;
  @Event() transitionEndEvent: EventEmitter;

  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = AlluvialDiagramDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = AlluvialDiagramDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = AlluvialDiagramDefaultValues.height;
  @Prop({ mutable: true }) width: number = AlluvialDiagramDefaultValues.width;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = AlluvialDiagramDefaultValues.highestHeadingLevel;
  @Prop({ mutable: true }) margin: IBoxModelType = AlluvialDiagramDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = AlluvialDiagramDefaultValues.padding;

  // Data (2/7)
  @Prop() linkData: object[];
  @Prop() nodeData: object[];
  @Prop() uniqueID: string;
  @Prop({ mutable: true }) sourceAccessor: string = AlluvialDiagramDefaultValues.sourceAccessor;
  @Prop({ mutable: true }) targetAccessor: string = AlluvialDiagramDefaultValues.targetAccessor;
  @Prop({ mutable: true }) valueAccessor: string = AlluvialDiagramDefaultValues.valueAccessor;
  @Prop({ mutable: true }) groupAccessor: string = AlluvialDiagramDefaultValues.groupAccessor;
  @Prop({ mutable: true }) nodeIDAccessor: string = AlluvialDiagramDefaultValues.nodeIDAccessor;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) nodeConfig: INodeConfigType = AlluvialDiagramDefaultValues.nodeConfig;
  @Prop({ mutable: true }) linkConfig: ILinkConfigType = AlluvialDiagramDefaultValues.linkConfig;
  @Prop({ mutable: true }) colorPalette: string = AlluvialDiagramDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = AlluvialDiagramDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = AlluvialDiagramDefaultValues.clickStyle;
  @Prop({ mutable: true }) cursor: string = AlluvialDiagramDefaultValues.cursor;
  @Prop({ mutable: true }) hoverOpacity: number = AlluvialDiagramDefaultValues.hoverOpacity;
  @Prop({ mutable: true }) animationConfig: IAnimationConfig = AlluvialDiagramDefaultValues.animationConfig;

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = AlluvialDiagramDefaultValues.dataLabel;
  @Prop({ mutable: true }) dataKeyNames: object;
  @Prop({ mutable: true }) showTooltip: boolean = AlluvialDiagramDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = AlluvialDiagramDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = AlluvialDiagramDefaultValues.accessibility;
  @Prop({ mutable: true }) annotations: object[] = AlluvialDiagramDefaultValues.annotations;

  // Interactivity (7/7)
  @Prop({ mutable: true }) suppressEvents: boolean = AlluvialDiagramDefaultValues.suppressEvents;
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = AlluvialDiagramDefaultValues.clickHighlight;
  @Prop({ mutable: true }) interactionKeys: string[];

  // Testing (8/7)
  @Prop() unitTest: boolean = false;
  //  @Prop() debugMode: boolean = false;

  @Element()
  alluvialDiagramEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  nest: any;
  alluvialProperties: any;
  labels: any;
  tooltipG: any;
  defaults: boolean;
  duration: number;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  dataTest: any;
  chartID: string;
  enterNodeGroups: any;
  exitNodeGroups: any;
  updateNodeGroups: any;
  enterNodes: any;
  exitNodes: any;
  updateNodes: any;
  enterLinks: any;
  exitLinks: any;
  enterLinkGroups: any;
  exitLinkGroups: any;
  updateLinkGroups: any;
  updateLinks: any;
  enteringLabels: any;
  exitingLabels: any;
  updatingLabels: any;
  nodeList: any;
  linkList: any;
  innerNodeData: any;
  innerLinkData: any;
  preppedData: any;
  oldNodeCount: any;
  nodeCount: any;
  newColumn: any;
  nodeG: any;
  linkG: any;
  labelG: any;
  innerLinkFillMode: any;
  innerLabelAccessor: any;
  innerIDAccessor: any;
  innerNodeAlignment: any;
  innerNodeInteractionKeys: any;
  innerLinkInteractionKeys: any;
  innerInteractionKeys: any = [];
  colorArr: any;
  noLinksLeftPadding: any;
  widthAllNodesNoLinks: any;
  previousNodeLayers: any;
  currentNodeLayers: any;
  previousMinNodeLayer: any;
  previousMaxNodeLayer: any;
  currentMaxNodeLayer: any;
  currentMinNodeLayer: any;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  sourceLinksString: string = 'sourceLinks';
  targetLinksString: string = 'targetLinks';
  valueString: string = 'value';
  groupKeys: any;
  tableData: any;
  tableColumns: any;
  secondaryTableData: any;
  secondaryTableColumns: any;
  updated: boolean = true;
  enterSize: number;
  exitSize: number;
  shouldSetDimensions: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldRedrawWrapper: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldUpdateDescriptionWrapper: boolean = false;
  shouldSetChartAccessibilityCount: boolean = false;
  shouldSetChartAccessibilityTitle: boolean = false;
  shouldSetChartAccessibilitySubtitle: boolean = false;
  shouldSetChartAccessibilityLongDescription: boolean = false;
  shouldSetChartAccessibilityExecutiveSummary: boolean = false;
  shouldSetChartAccessibilityPurpose: boolean = false;
  shouldSetChartAccessibilityContext: boolean = false;
  shouldSetChartAccessibilityStatisticalNotes: boolean = false;
  shouldSetChartAccessibilityStructureNotes: boolean = false;
  shouldSetParentSVGAccessibility: boolean = false;
  shouldSetGeometryAccessibilityAttributes: boolean = false;
  shouldSetGeometryAriaLabels: boolean = false;
  shouldSetGroupAccessibilityLabel: boolean = false;
  shouldSetSelectionClass: boolean = false;
  shouldSetAnnotationAccessibility: boolean = false;
  shouldSetGlobalSelections: boolean = false;
  shouldSetTestingAttributes: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldEnterUpdateExit: boolean = false;
  shouldUpdateNodeGeometries: boolean = false;
  shouldUpdateNodeStyle: boolean = false;
  shouldUpdateLinkGeometries: boolean = false;
  shouldUpdateLinkStyle: boolean = false;
  shouldDrawNodeLabels: boolean = false;
  shouldSetNodeDimensions: boolean = false;
  shouldCallSankeyGenerator: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldValidateIdAccessor: boolean = false;
  shouldValidateLabelText: boolean = false;
  shouldValidateLinkFillMode: boolean = false;
  shouldValidateNodeAlignment: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldValidateLinkGroups: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldBindInteractivity: boolean = false;
  shouldResetRoot: boolean = false;
  shouldSetNodeLabelOpacity: boolean = false;
  bitmaps: any;

  @Watch('nodeData')
  @Watch('linkData')
  dataWatcher(_newData, _oldData) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldValidateIdAccessor = true;
    this.shouldSetNodeDimensions = true;
    this.shouldCallSankeyGenerator = true;
    this.shouldUpdateTableData = true;
    this.shouldValidateLinkGroups = true;
    this.shouldValidateAccessibility = true;
    this.shouldSetGlobalSelections = true;
    this.shouldSetTestingAttributes = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateNodeGeometries = true;
    this.shouldUpdateNodeStyle = true;
    this.shouldUpdateLinkGeometries = true;
    this.shouldDrawNodeLabels = true;
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawInteractionState = true;
    // this.shouldSetNodeLabelOpacity = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
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
    // this.chartID = newID || 'alluvial-diagram-' + uuid();
    // this.alluvialDiagramEl.id = this.chartID;
    // this.shouldValidateAccessibility = true;
    // this.shouldUpdateDescriptionWrapper = true;
    // this.shouldSetParentSVGAccessibility = true;
    // this.shouldDrawInteractionState = true;
  }

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
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
  mainTitleWatcher(_newVal, _oldVal) {
    this.shouldValidateAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('subTitle')
  subTitleWatcher(_newVal, _oldVal) {
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldSetDimensions = true;
    this.shouldSetNodeDimensions = true;
    this.shouldResetRoot = true;
    this.shouldCallSankeyGenerator = true;
    this.shouldSetGlobalSelections = true;
    // this.shouldEnterUpdateExit = true;
    this.shouldUpdateNodeGeometries = true;
    this.shouldUpdateNodeStyle = true;
    this.shouldUpdateLinkGeometries = true;
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawNodeLabels = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('sourceAccessor')
  sourceAccessorWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop sourceAccessor from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
    // this.shouldUpdateData = true;
    // this.shouldSetNodeDimensions = true;
    // this.shouldCallSankeyGenerator = true;
    // this.shouldUpdateTableData = true;
    // this.shouldSetGlobalSelections = true;
    // this.shouldEnterUpdateExit = true;
    // this.shouldUpdateNodeGeometries = true;
    // this.shouldUpdateNodeStyle = true;
    // this.shouldUpdateLinkGeometries = true;
    // this.shouldUpdateLinkStyle = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetNodeLabelOpacity = true;
    // this.shouldDrawNodeLabels = true;
    // this.shouldUpdateAnnotations = true;
    // this.shouldSetGeometryAriaLabels = true;
    // if (!(this.interactionKeys && this.interactionKeys.length)) {
    //   this.shouldValidateInteractionKeys = true;
    //   this.shouldSetSelectionClass = true;
    // }
  }

  @Watch('targetAccessor')
  targetAccessorWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop targetAccessor from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );

    // this.shouldUpdateData = true;
    // this.shouldSetNodeDimensions = true;
    // this.shouldCallSankeyGenerator = true;
    // this.shouldUpdateTableData = true;
    // this.shouldSetGlobalSelections = true;
    // this.shouldEnterUpdateExit = true;
    // this.shouldUpdateNodeGeometries = true;
    // this.shouldUpdateNodeStyle = true;
    // this.shouldUpdateLinkGeometries = true;
    // this.shouldUpdateLinkStyle = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetNodeLabelOpacity = true;
    // this.shouldDrawNodeLabels = true;
    // this.shouldUpdateAnnotations = true;
    // this.shouldSetGeometryAriaLabels = true;
    // if (!(this.interactionKeys && this.interactionKeys.length)) {
    //   this.shouldValidateInteractionKeys = true;
    //   this.shouldSetSelectionClass = true;
    // }
  }

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldSetNodeDimensions = true;
    this.shouldCallSankeyGenerator = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateNodeGeometries = true;
    this.shouldUpdateNodeStyle = true;
    this.shouldUpdateLinkGeometries = true;
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
    this.shouldDrawNodeLabels = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {
    this.shouldUpdateData = true;
    this.shouldValidateLinkFillMode = true;
    this.shouldValidateLinkGroups = true;
    this.shouldSetNodeDimensions = true;
    this.shouldCallSankeyGenerator = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGlobalSelections = true;
    this.shouldEnterUpdateExit = true;
    this.shouldUpdateNodeGeometries = true;
    this.shouldUpdateNodeStyle = true;
    this.shouldUpdateLinkGeometries = true;
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
    this.shouldDrawNodeLabels = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('nodeIDAccessor')
  nodeIDAccessorWatcher(_newVal, _oldVal) {
    console.error(
      'Change detected in prop nodeIDAccessor from value ' +
        _oldVal +
        ' to value ' +
        _newVal +
        '. This prop cannot be changed after component has loaded.'
    );
    // this.shouldUpdateData = true;
    // this.shouldValidateIdAccessor = true;
    // this.shouldSetNodeDimensions = true;
    // this.shouldCallSankeyGenerator = true;
    // this.shouldUpdateTableData = true;
    // this.shouldSetGlobalSelections = true;
    // this.shouldEnterUpdateExit = true;
    // this.shouldUpdateNodeGeometries = true;
    // this.shouldUpdateNodeStyle = true;
    // this.shouldUpdateLinkGeometries = true;
    // this.shouldUpdateLinkStyle = true;
    // this.shouldDrawInteractionState = true;
    // this.shouldSetNodeLabelOpacity = true;
    // this.shouldDrawNodeLabels = true;
    // this.shouldUpdateAnnotations = true;
    // this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('nodeConfig')
  nodeConfigWatcher(_newVal, _oldVal) {
    const newAlignmentVal = _newVal && _newVal.alignment;
    const oldAlignmentVal = _oldVal && _oldVal.alignment;
    const newCompareVal = _newVal && _newVal.compare;
    const oldCompareVal = _oldVal && _oldVal.compare;
    const newFillVal = _newVal && _newVal.fill;
    const oldFillVal = _oldVal && _oldVal.fill;
    const newWidthVal = _newVal && _newVal.width;
    const oldWidthVal = _oldVal && _oldVal.width;
    const newPaddingVal = _newVal && _newVal.padding;
    const oldPaddingVal = _oldVal && _oldVal.padding;
    if (newAlignmentVal !== oldAlignmentVal) {
      this.shouldValidateNodeAlignment = true;
    }
    if (
      newAlignmentVal !== oldAlignmentVal ||
      newCompareVal !== oldCompareVal ||
      newWidthVal !== oldWidthVal ||
      newPaddingVal !== oldPaddingVal
    ) {
      this.shouldSetNodeDimensions = true;
      this.shouldCallSankeyGenerator = true;
      this.shouldSetGlobalSelections = true;
      this.shouldDrawInteractionState = true;
      this.shouldSetGeometryAccessibilityAttributes = true;
      this.shouldUpdateNodeGeometries = true;
      this.shouldUpdateLinkGeometries = true;
      this.shouldDrawNodeLabels = true;
      this.shouldUpdateAnnotations = true;
    }
    if (newFillVal !== oldFillVal) {
      this.shouldUpdateNodeStyle = true;
      this.shouldUpdateLinkStyle = true;
    }
  }

  @Watch('linkConfig')
  linkConfigWatcher(_newVal, _oldVal) {
    const newFillModeVal = _newVal && _newVal.fillMode;
    const oldFillModeVal = _oldVal && _oldVal.fillMode;
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    // const newOpacityVal = _newVal && _newVal.opacity;
    // const oldOpacityVal = _oldVal && _oldVal.opacity;
    if (newFillModeVal !== oldFillModeVal) {
      this.shouldValidateLinkFillMode = true;
      this.shouldSetGlobalSelections = true;
      this.shouldEnterUpdateExit = true;
      this.shouldUpdateLinkGeometries = true;
    }
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetNodeDimensions = true;
      this.shouldCallSankeyGenerator = true;
      this.shouldSetGlobalSelections = true;
      this.shouldSetNodeLabelOpacity = true;
      this.shouldUpdateNodeGeometries = true;
      this.shouldUpdateLinkGeometries = true;
      this.shouldDrawNodeLabels = true;
      this.shouldUpdateAnnotations = true;
    }
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetTestingAttributes = true;
    // if (newOpacityVal !== oldOpacityVal) {
    // }
  }

  @Watch('colors')
  @Watch('colorPalette')
  colorWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldUpdateNodeStyle = true;
    this.shouldUpdateLinkStyle = true;
    this.shouldDrawInteractionState = true;
  }

  @Watch('clickStyle')
  @Watch('hoverStyle')
  interactionStyleWatcher(_newVal, _oldVal) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
  }

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {
    this.shouldUpdateCursor = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
  }

  @Watch('dataLabel')
  dataLabelWatcher(_newVal, _oldVal) {
    const newVisibleVal = _newVal && _newVal.visible;
    const oldVisibleVal = _oldVal && _oldVal.visible;
    const newLabelAccessorVal = _newVal && _newVal.labelAccessor ? _newVal.labelAccessor : false;
    const oldLabelAccessorVal = _oldVal && _oldVal.labelAccessor ? _oldVal.labelAccessor : false;
    if (newLabelAccessorVal !== oldLabelAccessorVal) {
      this.shouldValidateLabelText = true;
    }
    this.shouldDrawNodeLabels = true;
    this.shouldUpdateTableData = true;
    if (newVisibleVal !== oldVisibleVal) {
      this.shouldSetNodeLabelOpacity = true;
    }
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {
    this.shouldUpdateTableData = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('accessibility')
  accessibilityWatcher(_newVal, _oldVal) {
    this.shouldValidateAccessibility = true;
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
    // const newTextures = _newVal && _newVal.hideTextures ? _newVal.hideTextures : false;
    // const oldTextures = _oldVal && _oldVal.hideTextures ? _oldVal.hideTextures : false;
    // const newExTextures = _newVal && _newVal.showExperimentalTextures ? _newVal.showExperimentalTextures : false;
    // const oldExTextures = _oldVal && _oldVal.showExperimentalTextures ? _oldVal.showExperimentalTextures : false;
    // if (newTextures !== oldTextures || newExTextures !== oldExTextures) {
    //   this.shouldSetTextures = true;
    //   this.shouldUpdateLegend = true;
    //   this.shouldDrawInteractionState = true;
    //   this.shouldCheckLabelColor = true;
    // }
    // const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    // const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    // if (newStrokes !== oldStrokes) {
    //   this.shouldSetStrokes = true;
    //   this.shouldUpdateLegend = true;
    //   this.shouldDrawInteractionState = true;
    // }
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
    this.shouldValidateAccessibility = true;
    this.shouldSetAnnotationAccessibility = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
    this.shouldSetSelectionClass = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {
    this.shouldSetNodeDimensions = true;
    this.shouldCallSankeyGenerator = true;
    this.shouldValidateInteractionKeys = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetNodeLabelOpacity = true;
    this.shouldSetSelectionClass = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
  }

  @Watch('dataKeyNames')
  dataKeyNamesWatcher(_newVal, _oldVal) {
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetGroupAccessibilityLabel = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldValidateAccessibility = true;
    this.shouldRedrawWrapper = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetChartAccessibilityLongDescription = true;
    this.shouldSetChartAccessibilityContext = true;
    this.shouldSetChartAccessibilityExecutiveSummary = true;
    this.shouldSetChartAccessibilityPurpose = true;
    this.shouldSetChartAccessibilityStatisticalNotes = true;
    this.shouldSetChartAccessibilityStructureNotes = true;
    // this.shouldDrawInteractionState = true;
  }

  @Watch('unitTest')
  unitTestWatcher(_newVal, _oldVal) {
    this.shouldSetTestingAttributes = true;
  }

  componentWillLoad() {
    const chartID = this.uniqueID || 'alluvial-diagram-' + uuid();
    this.initialLoadEvent.emit({ chartID: chartID });
    // contrary to componentWillUpdate, this method appears safe to use for
    // any calculations we need. Keeping them here reduces future refactor,
    // since componentWillUpdate should eventually mirror this method
    return new Promise(resolve => {
      this.duration = 0;
      this.defaults = true;
      this.chartID = chartID;
      this.alluvialDiagramEl.id = this.chartID;
      this.setTagLevels();
      this.prepareData();
      this.setDimensions();
      this.validateIdAccessor();
      this.validateLabelText();
      this.validateLinkFillMode();
      this.validateNodeAlignment();
      this.validateInteractionKeys();
      this.validateLinkGroups();
      this.shouldValidateAccessibilityProps();
      this.setColors();
      this.setNodeDimensions();
      this.callSankeyGenerator();
      this.setTableData();
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
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.enterLinkGeometries();
      this.updateLinkGeometries();
      this.exitLinkGeometries();
      this.enterNodeGeometries();
      this.updateNodeGeometries();
      this.exitNodeGeometries();
      this.enterNodeLabels();
      this.updateNodeLabels();
      this.exitNodeLabels();
      this.updateLinkStyle();
      this.drawNodeGeometries();
      this.drawLinkGeometries();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.setGroupAccessibilityID();
      this.setChartCountAccessibility();
      this.setSelectedClass();
      this.updateCursor();
      this.drawNodeLabels();
      this.bindInteractivity();
      this.drawAnnotations();
      this.setAnnotationAccessibility();
      this.onChangeHandler();
      this.duration = 750;
      this.defaults = false;
      hideNonessentialGroups(this.root.node(), null);
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
      if (this.shouldSetGlobalSelections) {
        this.setGlobalSelections();
        this.shouldSetGlobalSelections = false;
      }
      if (this.shouldSetTestingAttributes) {
        this.setTestingAttributes();
        this.shouldSetTestingAttributes = false;
      }
      if (this.shouldEnterUpdateExit) {
        this.enterLinkGeometries();
        this.updateLinkGeometries();
        this.exitLinkGeometries();
        this.enterNodeGeometries();
        this.updateNodeGeometries();
        this.exitNodeGeometries();
        this.enterNodeLabels();
        this.updateNodeLabels();
        this.exitNodeLabels();
        this.shouldEnterUpdateExit = false;
      }
      if (this.shouldUpdateNodeGeometries) {
        this.drawNodeGeometries();
        this.shouldUpdateNodeGeometries = false;
      }
      if (this.shouldUpdateNodeStyle) {
        this.updateNodeStyle();
        this.shouldUpdateNodeStyle = false;
      }
      if (this.shouldUpdateLinkGeometries) {
        this.drawLinkGeometries();
        this.shouldUpdateLinkGeometries = false;
      }
      if (this.shouldUpdateLinkStyle) {
        this.updateLinkStyle();
        this.shouldUpdateLinkStyle = false;
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
      if (this.shouldDrawNodeLabels) {
        this.drawNodeLabels();
        this.shouldDrawNodeLabels = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
      }
      if (this.shouldSetNodeLabelOpacity) {
        this.setNodeLabelOpacity();
        this.shouldSetNodeLabelOpacity = false;
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
    }).then(() => this.drawEndEvent.emit({ chartID: this.chartID }));
  }

  setDimensions() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  prepareData() {
    this.nodeList = [];
    this.linkList = [];

    this.linkData.forEach((obj, i) => {
      const linkObj = {
        source: obj[this.sourceAccessor],
        target: obj[this.targetAccessor],
        value: obj[this.valueAccessor],
        data: obj
      };

      if (this.groupAccessor) {
        linkObj[this.groupAccessor] = obj[this.groupAccessor];
      }

      this.linkList[i] = linkObj;
    });

    // if the user did not set this.nodeData, generate node data from link data
    this.nodeData && this.nodeData.length > 1 ? (this.nodeList = this.nodeData) : this.createNodeList();
  }

  createNodeList() {
    this.nodeList = [];
    this.linkData.map(link => {
      if (!this.nodeList.some(e => e.id === link[this.sourceAccessor])) {
        const uniqueSourceID = { id: link[this.sourceAccessor] };
        this.nodeList.push(uniqueSourceID);
      }
      if (!this.nodeList.some(e => e.id === link[this.targetAccessor])) {
        const uniqueTargetID = { id: link[this.targetAccessor] };
        this.nodeList.push(uniqueTargetID);
      }
    });
  }

  validateLabelText() {
    // if label accessor is passed use that, otherwise default to value hardcoded which is the total
    // of valueAccessor at the node level
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.valueString;
  }

  // if there is no nodeData present, use 'id', otherwise use the nodeIDAccessor that is passed
  validateIdAccessor() {
    this.innerIDAccessor =
      this.nodeData && this.nodeData.length > 1
        ? this.nodeList[0][this.nodeIDAccessor]
          ? this.nodeIDAccessor
          : 'id'
        : 'id';
  }

  validateLinkFillMode() {
    this.innerLinkFillMode =
      this.groupAccessor && this.linkConfig.fillMode === 'group'
        ? 'group'
        : this.linkConfig.fillMode === 'source'
        ? 'source'
        : this.linkConfig.fillMode === 'target'
        ? 'target'
        : this.linkConfig.fillMode === 'link'
        ? 'link'
        : 'none';
  }

  validateNodeAlignment() {
    this.innerNodeAlignment =
      this.nodeConfig.alignment === 'right'
        ? sankeyRight
        : this.nodeConfig.alignment === 'center'
        ? sankeyCenter
        : this.nodeConfig.alignment === 'justify'
        ? sankeyJustify
        : sankeyLeft;
  }

  validateInteractionKeys() {
    this.innerInteractionKeys = [];

    this.innerInteractionKeys =
      this.interactionKeys && this.interactionKeys.length
        ? this.interactionKeys
        : [this.sourceAccessor, this.targetAccessor];
  }

  validateLinkGroups() {
    this.groupKeys = [];

    if (this.groupAccessor) {
      this.groupKeys = this.linkData.map(d => d[this.groupAccessor]).filter((x, i, a) => a.indexOf(x) === i);
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
          data: this.linkData,
          uniqueID: this.uniqueID,
          context: {
            mainTitle: this.mainTitle,
            onClickEvent: this.suppressEvents ? undefined : this.clickEvent.emit
          }
        }
      );
    }
  }

  setTableData() {
    // generate scoped and formatted data for data-table component, showing node data
    const uniqueNodeAccessors = ['nodeIDAccessor', 'valueAccessor'];
    const nodeAccessors = {
      singleAccessors: uniqueNodeAccessors,
      nestedAccessors: [
        {
          objectName: 'dataLabel',
          objectAccessors: ['labelAccessor'],
          formatAccessors: ['format']
        }
      ]
    };

    const nodeKeys = scopeDataKeys(this, nodeAccessors, 'alluvial-diagram');
    this.tableData = this.getScopedTableData(this.preppedData.nodes, nodeKeys);
    this.tableColumns = Object.keys(nodeKeys);

    // create secondary table data for link data
    // remove dataLabel accessor, as we use this in the nodeData table
    const linkChartAccessors = chartAccessors;
    delete linkChartAccessors.nestedAccessors[2];
    const keys = scopeDataKeys(this, linkChartAccessors, 'alluvial-diagram-secondary-table');
    this.secondaryTableData = this.getScopedTableData(this.preppedData.links, keys);
    this.secondaryTableColumns = Object.keys(keys);
  }

  getScopedTableData(data, keyMap) {
    const scopedData = [];
    data.forEach(dataRecord => {
      const scopedDataRecord = {};
      // links always have data objects, so will always enter this section of the loop
      Object.keys(keyMap).forEach(field => {
        if ('data' in dataRecord && dataRecord.data[field]) {
          scopedDataRecord[field] =
            keyMap[field] && dataRecord.data[field]
              ? formatStats(dataRecord.data[field], keyMap[field])
              : dataRecord.data[field];
        } else {
          if (field === this.valueAccessor) {
            scopedDataRecord[field] = keyMap[field]
              ? formatStats(dataRecord[this.valueString], keyMap[field])
              : dataRecord[this.valueString];
          } else {
            scopedDataRecord[field] =
              keyMap[field] && dataRecord[field] ? formatStats(dataRecord[field], keyMap[field]) : dataRecord[field];
          }
        }
      });
      scopedData.push(scopedDataRecord);
    });
    return scopedData;
  }

  setNodeDimensions() {
    // controls node width and node padding
    this.alluvialProperties = sankey(this.nodeConfig.compare, this.linkConfig.visible)
      .nodeId(d => d[this.innerIDAccessor])
      .nodeWidth(this.nodeConfig.width)
      .nodePadding(this.nodeConfig.padding)
      .nodeAlign(this.innerNodeAlignment)
      .nodeSort(null)
      .size([this.innerPaddedWidth, this.innerPaddedHeight]);
  }

  callSankeyGenerator() {
    const sankeyData = (nodes, links) =>
      this.alluvialProperties({
        nodes: nodes.map(d => ({ ...d })),
        links: links.map(d => ({ ...d }))
      });
    this.preppedData = sankeyData(this.nodeList, this.linkList);
    this.nodeCount = max(this.preppedData.nodes, d => d.layer);
  }

  renderRootElements() {
    this.svg = select(this.alluvialDiagramEl)
      .select('.visa-viz-d3-alluvial-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    // .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg.append('g').attr('id', 'visa-viz-margin-container-g-' + this.chartID);
    this.rootG = this.root.append('g').attr('id', 'visa-viz-padding-container-g-' + this.chartID);

    this.nodeG = this.rootG.append('g').attr('class', 'alluvial-node-group');
    this.linkG = this.rootG.append('g').attr('class', 'alluvial-link-group');

    this.labelG = this.rootG.append('g').attr('class', 'alluvial-dataLabel-group');
    this.tooltipG = select(this.alluvialDiagramEl).select('.alluvial-tooltip');
  }

  updateCursor() {
    this.updateLinks.attr('cursor', !this.suppressEvents ? this.cursor : null);
    // this.updateNodes.attr('cursor', !this.suppressEvents ? this.cursor : null);
    this.updatingLabels.attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null);
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

  setGlobalSelections() {
    if (this.currentNodeLayers) {
      this.previousNodeLayers = this.currentNodeLayers;
    }

    const dataBoundToNodes = this.nodeG
      .selectAll('.node-wrapper')
      .data(this.preppedData.nodes, d => d[this.innerIDAccessor]);

    this.enterNodes = dataBoundToNodes
      .enter()
      .append('g')
      .attr('class', 'node-wrapper')
      .attr('data-offset-group', 'true');
    this.enterNodes.append('rect').attr('class', 'alluvial-node');
    this.exitNodes = dataBoundToNodes.exit();
    this.updateNodes = dataBoundToNodes.merge(this.enterNodes);
    this.updateNodes.selectAll('.alluvial-node').data(d => [d]);

    this.currentNodeLayers = this.preppedData.nodes;
    if (this.previousNodeLayers) {
      const updatingNodesWithoutEnteringNodes = this.currentNodeLayers.filter(item =>
        this.previousNodeLayers.map(a => a[this.innerIDAccessor]).includes(item.id)
      );
      this.previousMaxNodeLayer = max(updatingNodesWithoutEnteringNodes, d => d.layer);
      this.previousMinNodeLayer = min(updatingNodesWithoutEnteringNodes, d => d.layer);

      const updatingNodesWithoutExitingNodes = this.previousNodeLayers.filter(item =>
        this.currentNodeLayers.map(a => a[this.innerIDAccessor]).includes(item.id)
      );
      this.currentMaxNodeLayer = max(updatingNodesWithoutExitingNodes, d => d.layer);
      this.currentMinNodeLayer = min(updatingNodesWithoutExitingNodes, d => d.layer);
    }

    // temporary, to be removed when lifecycle functions are added
    // tslint:disable-next-line:no-unused-expression
    // this.updateLinkGroups && this.updateLinkGroups.remove();
    // tslint:disable-next-line:no-unused-expression
    // this.updateLinks && this.updateLinks.remove();

    if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
      this.updateNodes.each((_, i, n) => {
        initializeElementAccess(n[i]);
      });
      const linkDataGroups = this.preppedData.nodes;
      const dataBoundToLinkGroups = this.linkG
        .selectAll('.alluvial-link-wrapper')
        .data(linkDataGroups, d => d[this.innerIDAccessor]);
      this.enterLinkGroups = dataBoundToLinkGroups.enter().append('g');
      this.exitLinkGroups = dataBoundToLinkGroups.exit().remove();
      this.updateLinkGroups = dataBoundToLinkGroups.merge(this.enterLinkGroups);

      const dataBoundToLinks = this.updateLinkGroups
        .selectAll('.alluvial-link')
        .data(d => d.sourceLinks, d => d.data[this.sourceAccessor] + d.data[this.targetAccessor]);
      this.enterLinks = dataBoundToLinks.enter().append('path');
      this.exitLinks = dataBoundToLinks.exit();
      this.updateLinks = dataBoundToLinks.merge(this.enterLinks).attr('data-offset-element', this.innerLinkFillMode);
    } else {
      this.updateNodes.attr('tabindex', null);

      const dataBoundToLinks = this.linkG
        .selectAll('.alluvial-link')
        .data(this.preppedData.links, d => d.data[this.sourceAccessor] + d.data[this.targetAccessor]);
      this.enterLinks = dataBoundToLinks.enter().append('path');
      this.exitLinks = dataBoundToLinks.exit();
      this.updateLinks = dataBoundToLinks.merge(this.enterLinks).attr('data-offset-element', null);
    }

    this.exitSize = this.exitLinks.size();
    this.enterSize = this.enterLinks.size();

    const dataBoundToLabels = this.labelG.selectAll('text').data(this.preppedData.nodes, d => d[this.innerIDAccessor]);
    this.enteringLabels = dataBoundToLabels.enter().append('text');
    this.exitingLabels = dataBoundToLabels.exit();
    this.updatingLabels = dataBoundToLabels.merge(this.enteringLabels);
  }

  setTestingAttributes() {
    if (this.unitTest) {
      select(this.alluvialDiagramEl)
        .select('.visa-viz-d3-alluvial-container')
        .attr('data-testid', 'chart-container');
      select(this.alluvialDiagramEl)
        .select('.alluvial-main-title')
        .attr('data-testid', 'main-title');
      select(this.alluvialDiagramEl)
        .select('.alluvial-sub-title')
        .attr('data-testid', 'sub-title');
      this.svg.attr('data-testid', 'root-svg');
      this.root.attr('data-testid', 'margin-container');
      this.rootG.attr('data-testid', 'padding-container');
      // this.legendG.attr('data-testid', 'legend-container');
      this.tooltipG.attr('data-testid', 'tooltip-container');

      // add test attributes to nodes
      // note that nodes are each wrapped in their own G, which is what this grabs
      this.updateNodes.attr('data-testid', 'node').attr('data-id', d => `node-${d[this.innerIDAccessor]}`);

      // add test attributes to links
      if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
        this.updateLinkGroups
          .attr('data-testid', 'alluvial-link-group')
          .attr('data-id', d => `link-group-${d[this.innerIDAccessor]}`);
      }
      this.updateLinks
        .attr('data-testid', 'link')
        .attr('data-id', d => `link-${d.source[this.innerIDAccessor]}-${d.target[this.innerIDAccessor]}`);

      // add test attributes to labels
      this.updatingLabels.attr('data-testid', 'dataLabel').attr('data-id', d => `dataLabel-${d[this.innerIDAccessor]}`);

      this.svg.select('defs').attr('data-testid', 'pattern-defs');
    } else {
      select(this.alluvialDiagramEl)
        .select('.visa-viz-d3-alluvial-container')
        .attr('data-testid', null);
      select(this.alluvialDiagramEl)
        .select('.alluvial-main-title')
        .attr('data-testid', null);
      select(this.alluvialDiagramEl)
        .select('.alluvial-sub-title')
        .attr('data-testid', null);
      this.svg.attr('data-testid', null);
      this.root.attr('data-testid', null);
      this.rootG.attr('data-testid', null);
      // this.legendG.attr('data-testid', null);
      this.tooltipG.attr('data-testid', null);

      // add test attributes to nodes
      this.updateNodes.attr('data-testid', null).attr('data-id', null);

      // add test attributes to links
      if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
        this.updateLinkGroups.attr('data-testid', null).attr('data-id', null);
      }
      this.updateLinks.attr('data-testid', null).attr('data-id', null);

      // add test attributes to labels
      this.updatingLabels.attr('data-testid', null).attr('data-id', null);

      this.svg.select('defs').attr('data-testid', null);
    }
  }

  newColumnInterpolationPosition() {
    return linkHorizontal()
      .source(d =>
        d.target.layer <= this.previousMinNodeLayer
          ? [d.source.x0, d.y0]
          : d.source.layer >= this.previousMaxNodeLayer
          ? [d.target.x1, d.y0]
          : [d.source.x1, d.y0]
      )
      .target(d =>
        d.target.layer <= this.previousMinNodeLayer
          ? [d.source.x0, d.y0]
          : d.source.layer >= this.previousMaxNodeLayer
          ? [d.target.x1, d.y0]
          : [d.target.x0, d.y1]
      );
  }

  enterLinkGeometries() {
    this.enterLinks.interrupt();
    const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;

    if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
      this.enterLinkGroups.attr('class', 'alluvial-link-wrapper');
    }

    this.enterLinks
      .attr('class', 'alluvial-link')
      .classed('entering', true)
      .attr('d', this.newColumnInterpolationPosition());

    this.enterLinks
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('stroke-dasharray', (d, i, n) => {
        d.linelength = n[i].getTotalLength() - 2;
        // return d.linelength + ' ' + d.linelength;
        return d.target.layer <= this.previousMinNodeLayer || d.source.layer >= this.previousMaxNodeLayer
          ? ''
          : d.linelength + ' ' + d.linelength;
      })
      // .attr('stroke-dashoffset', d => d.linelength)
      .attr('stroke-dashoffset', d =>
        d.target.layer <= this.previousMinNodeLayer || d.source.layer >= this.previousMaxNodeLayer ? 0 : d.linelength
      )
      .attr('stroke-width', d =>
        d.target.layer <= this.previousMinNodeLayer || d.source.layer >= this.previousMaxNodeLayer
          ? Math.max(1, d.width)
          : 0.1
      )
      .attr('stroke-opacity', linkOpacity)
      .transition('enter')
      .duration(this.duration)
      .ease(easeCircleIn)
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', d =>
        d.target.layer <= this.previousMinNodeLayer || d.source.layer >= this.previousMaxNodeLayer
          ? Math.max(1, d.width)
          : 1
      )
      .attr('stroke-dashoffset', 0);

    // const test = select(this.svg.node())
    //   .selectAll('.duplicated-clicked-link');

    // this.enterLinks.each((d, i, n) => {
    //   const clicked =
    //     this.clickHighlight &&
    //     this.clickHighlight.length > 0 &&
    //     checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys);
    //   if (clicked) {
    //     // this.drawDuplicateClickedLink(n[i]);
    //     // if (n[i].classed('duplicated-clicked-link')){
    //     // }
    //   }
    // });
  }

  updateLinkGeometries() {
    this.updateLinks.interrupt();
    const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;

    this.updateLinks
      .transition('opacity')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('stroke-opacity', d => {
        return checkInteraction(
          d.data,
          linkOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
          // this.nodeIDAccessor
        );
      });
  }

  exitLinkGeometries() {
    this.exitLinks.interrupt();
    const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;

    this.exitLinks
      .attr('stroke-dasharray', (d, i, n) => {
        d.linelength = n[i].getTotalLength();
        return d.target.layer <= this.previousMinNodeLayer || d.source.layer >= this.previousMaxNodeLayer
          ? ''
          : d.linelength + ' ' + d.linelength;
      })
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration)
      .attr('d', this.newColumnInterpolationPosition())
      .attr('stroke-opacity', linkOpacity)
      .attr('stroke-dashoffset', d => d.linelength)
      .attr('stroke-width', d =>
        d.target.layer <= this.currentMinNodeLayer || d.source.layer >= this.currentMaxNodeLayer
          ? Math.max(1, d.width)
          : 0.1
      )
      .remove();
  }

  drawLinkGeometries() {
    this.removeTemporaryClickedLinks(this.svg.node());
    // const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;

    if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
      this.updateLinkGroups.classed('link-group offset-target', true);
      // .classed('entering', true)
      // .attr('cursor', !this.suppressEvents ? this.cursor : null);
    }

    this.updateLinks
      .transition('update')
      .duration(this.duration)
      .ease(easeCircleIn)
      // .attr('stroke-opacity', d => {
      //   return checkInteraction(
      //     d.data,
      //     linkOpacity,
      //     this.hoverOpacity,
      //     this.hoverHighlight,
      //     this.clickHighlight,
      //     this.innerInteractionKeys
      //     // this.nodeIDAccessor
      //   );
      // })
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', d => Math.max(1, d.width))
      .call(transitionEndAll, () => {
        this.removeTemporaryClickedLinks(this.svg.node());
        this.updateLinks
          .classed('entering', false)
          .attr('d', sankeyLinkHorizontal())
          .attr('stroke-dasharray', '');

        this.updateInteractionState();
        this.updateLinks.each((d, i, n) => {
          const clicked =
            this.clickHighlight &&
            this.clickHighlight.length > 0 &&
            checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys);
          if (clicked) {
            // this will add a non-interactive duplicate of each clicked link above the existing ones
            // so that the link visually appears above all other links, but the keyboard nav order does not change
            this.drawDuplicateClickedLink(n[i], d);
          }
        });
      });

    this.updateLinks
      .transition('accessibilityAfterExit')
      .duration(this.duration)
      .ease(easeCircleIn)
      .call(transitionEndAll, () => {
        // before we exit geometries, we need to check if a focus exists or not
        const focusDidExist = checkAccessFocus(this.rootG.node());
        // then we must remove the exiting elements
        this.exitLinks.remove();
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
        // now we can emit the event that transitions are complete
        this.transitionEndEvent.emit({ chartID: this.chartID });
      });
  }

  // creates a clone of clicked links
  drawDuplicateClickedLink(inputElement, d) {
    const source = inputElement;
    const className = 'vcl-accessibility-focus';
    const parent = source.parentNode;
    const sourceCopy = source.cloneNode();
    select(sourceCopy)
      .classed('alluvial-link', false)
      .classed(className + '-highlight ' + className + '-hover', true)
      .classed('duplicated-clicked-link', true)
      .classed('entering', false)
      .data([d.data])
      .attr('focusable', false)
      .attr('aria-label', null)
      .attr('aria-hidden', true)
      .attr('role', null)
      .style('pointer-events', 'none')
      .attr('tabindex', null);

    if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
      const parentOfParent = parent.parentNode;
      const validSiblings = select(parentOfParent).selectAll('.link-group')._groups[0];
      const lastGroup = validSiblings[validSiblings.length - 1];
      lastGroup.appendChild(sourceCopy);
    } else {
      parent.appendChild(sourceCopy);
    }
  }

  removeTemporaryClickedLinks(root) {
    select(root)
      .selectAll('.duplicated-clicked-link')
      .remove();
  }

  updateLinkStyle() {
    this.updateLinks
      .attr('stroke', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys) &&
        this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : this.hoverHighlight &&
            checkHovered(d.data, this.hoverHighlight, this.innerInteractionKeys) &&
            this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : this.innerLinkFillMode === 'group'
          ? this.colorArr[this.groupKeys.indexOf(d[this.groupAccessor])]
          : this.innerLinkFillMode === 'none'
          ? this.colorArr[0] || '#E4E4E4'
          : this.innerLinkFillMode === 'link'
          ? this.colorArr[d.index]
          : this.innerLinkFillMode === 'source'
          ? this.colorArr[d.source.index]
          : this.colorArr[d.target.index]
      )
      .attr('fill', 'none');
  }

  enterNodeGeometries() {
    this.enterNodes.interrupt();

    if (!this.defaults) {
      this.enterNodes.classed('entering', true);
    }

    this.enterNodes
      .select('.alluvial-node')
      // .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('fill', (_, i) => (this.nodeConfig.fill ? this.colorArr[i] || this.colorArr[0] : '#E4E4E4'))
      .attr('stroke', (_, i) =>
        getContrastingStroke(this.nodeConfig.fill ? this.colorArr[i] || this.colorArr[0] : '#E4E4E4')
      )
      .attr('stroke-width', '1px')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('opacity', 0)
      .attr('width', d => d.x1 - d.x0);

    // .transition('enter_nodes')
    // .delay(20 * this.duration)
    // .duration(this.duration)
    // .ease(easeCircleIn)
    // .attr('x', d => d.x0)
    // .attr('y', d => d.y0)
    // .attr('height', d => d.y1 - d.y0)
    // .attr('width', d => d.x1 - d.x0)
    // .attr('opacity', 1);

    // this.enterNodeGroups
    //   .attr('class', 'node-wrapper')
    //   .attr('data-offset-group', 'true');
    // this.enterNodes
    //   .attr('class', 'alluvial-node');
  }

  updateNodeGeometries() {
    this.updateNodes.interrupt();

    this.updateNodes
      .select('.alluvial-node')
      .transition('node_opacity')
      .duration((_, i, n) => {
        if (select(n[i].parentNode).classed('entering')) {
          // select(n[i].parentNode).classed('entering', false);
          return this.duration / 3;
        }
        return 0;
      })
      // .duration(this.duration)
      .delay((_, i, n) => {
        return select(n[i].parentNode).classed('entering') ? this.duration / 1.2 : 0;
      })
      .ease(easeCircleIn)
      .attr(
        'opacity',
        1
        // d => {
        //   return checkInteraction(
        //     d.data,
        //     1,
        //     this.hoverOpacity,
        //     this.hoverHighlight,
        //     this.clickHighlight,
        //     this.innerInteractionKeys
        //     // this.nodeIDAccessor
        //   );
        // }
      );
  }

  exitNodeGeometries() {
    this.exitNodes.interrupt();

    this.exitNodes
      .select('.alluvial-node')
      .transition('exit')
      .ease(easeCircleIn)
      .duration(this.duration / 3)
      .attr('opacity', 0)
      .attr('width', 0)
      .select(function() {
        return this.parentNode;
      })
      .remove();
  }

  drawNodeGeometries() {
    this.updateNodes
      .select('.alluvial-node')
      // .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      // .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      // .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      // .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      // .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .transition('update_nodes')
      .duration((_, i, n) => {
        return select(n[i].parentNode).classed('entering') ? this.duration / 3 : this.duration;
      })
      .delay((_, i, n) => {
        return select(n[i].parentNode).classed('entering') ? this.duration / 1.2 : 0;
      })
      .ease(easeCircleIn)
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('opacity', 1)
      .call(transitionEndAll, () => {
        this.updateNodes.classed('entering', false);
        // .attr('opacity', 1)
        // .attr('d', sankeyLinkHorizontal())
        // .attr('stroke-dasharray', '');
      });
    // d => {
    // let matchHover = true;
    // if (d[this.sourceLinksString].length) {
    //   matchHover = d[this.sourceLinksString].some(
    //     linkData =>
    //       checkInteraction(
    //         linkData,
    //         1,
    //         this.hoverOpacity,
    //         this.hoverHighlight,
    //         this.clickHighlight,
    //         this.innerInteractionKeys,
    //         this.nodeIDAccessor
    //       ) >= 1
    //   );
    // }
    // if (d[this.targetLinksString].length) {
    //   matchHover = d[this.targetLinksString].some(
    //     linkData =>
    //       checkInteraction(
    //         linkData,
    //         1,
    //         this.hoverOpacity,
    //         this.hoverHighlight,
    //         this.clickHighlight,
    //         this.innerInteractionKeys,
    //         this.nodeIDAccessor
    //       ) >= 1
    //   );
    // }
    // return matchHover ? 1 : this.hoverOpacity;
    // })
  }

  updateNodeStyle() {
    this.updateNodes
      .select('.alluvial-node')
      .attr('fill', (_, i) => (this.nodeConfig.fill ? this.colorArr[i] || this.colorArr[0] : '#E4E4E4'));
    this.updateNodes
      .select('.alluvial-node')
      .attr('stroke', (_, i) =>
        getContrastingStroke(this.nodeConfig.fill ? this.colorArr[i] || this.colorArr[0] : '#E4E4E4')
      );
    this.updateNodes.select('.alluvial-node').attr('stroke-width', '1px');
  }

  enterNodeLabels() {
    this.enteringLabels.interrupt();
    const opacity = this.dataLabel.visible ? 1 : 0;
    const hiddenOpacity = this.dataLabel.visible ? Number.EPSILON : 0;
    this.widthAllNodesNoLinks = this.nodeCount * this.nodeConfig.width + this.nodeCount * this.nodeConfig.width;
    this.noLinksLeftPadding = (this.innerPaddedWidth - this.widthAllNodesNoLinks) / 2;

    this.enteringLabels
      .attr('class', 'alluvial-diagram-dataLabel entering')
      .attr('cursor', !this.suppressEvents && this.dataLabel.visible ? this.cursor : null)
      .attr('opacity', d => {
        if (this.linkConfig.visible) {
          let matchHover = true;
          if (d[this.sourceLinksString].length) {
            matchHover = d[this.sourceLinksString].some(
              linkData =>
                checkInteraction(
                  linkData.data,
                  opacity,
                  this.hoverOpacity,
                  this.hoverHighlight,
                  this.clickHighlight,
                  this.innerInteractionKeys
                ) >= 1
            );
          }
          if (d[this.targetLinksString].length) {
            matchHover = d[this.targetLinksString].some(
              linkData =>
                checkInteraction(
                  linkData.data,
                  opacity,
                  this.hoverOpacity,
                  this.hoverHighlight,
                  this.clickHighlight,
                  this.innerInteractionKeys
                ) >= 1
            );
          }
          return matchHover ? hiddenOpacity : 0;
        } else {
          return d.layer === 0 ? hiddenOpacity : d.layer === this.nodeCount ? hiddenOpacity : 0;
        }
      })
      .attr('x', d => {
        if (this.linkConfig.visible) {
          return this.dataLabel.placement === 'outside'
            ? d.x0 < this.innerPaddedWidth / 2
              ? d.x0
              : d.x1
            : d.x0 < this.innerPaddedWidth / 2
            ? d.x1
            : d.x0;
        } else {
          return d.x0 < this.innerPaddedWidth / 2
            ? this.noLinksLeftPadding
            : this.noLinksLeftPadding + this.widthAllNodesNoLinks + this.nodeConfig.width;
        }
      })
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dx', d =>
        this.dataLabel.placement === 'outside' || !this.linkConfig.visible
          ? d.x0 < this.innerPaddedWidth / 2
            ? '-0.5em'
            : '0.5em'
          : d.x0 < this.innerPaddedWidth / 2
          ? '0.5em'
          : '-0.5em'
      )
      .attr('dy', '0.4em')
      .attr('text-anchor', d => {
        return this.dataLabel.placement === 'outside' || !this.linkConfig.visible
          ? d.x0 < this.innerPaddedWidth / 2
            ? 'end'
            : 'start'
          : d.x0 < this.innerPaddedWidth / 2
          ? 'start'
          : 'end';
      });
  }

  updateNodeLabels() {
    this.updatingLabels.interrupt('label_opacity');
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.updatingLabels
      .transition('label_opacity')
      .ease(easeCircleIn)
      // .duration(this.duration)
      .duration((_, i, n) => {
        if (select(n[i]).classed('entering')) {
          return this.duration / 3;
        }
        return 0;
      })
      // .duration(this.duration)
      .delay((_, i, n) => {
        return select(n[i]).classed('entering') ? this.duration / 1.2 : 0;
      })
      .attr('opacity', d => {
        if (this.linkConfig.visible) {
          let matchHover = true;
          if (d[this.sourceLinksString].length) {
            matchHover = d[this.sourceLinksString].some(
              linkData =>
                checkInteraction(
                  linkData.data,
                  opacity,
                  this.hoverOpacity,
                  this.hoverHighlight,
                  this.clickHighlight,
                  this.innerInteractionKeys
                ) >= 1
            );
          }
          if (d[this.targetLinksString].length) {
            matchHover = d[this.targetLinksString].some(
              linkData =>
                checkInteraction(
                  linkData.data,
                  opacity,
                  this.hoverOpacity,
                  this.hoverHighlight,
                  this.clickHighlight,
                  this.innerInteractionKeys
                ) >= 1
            );
          }
          return matchHover ? 1 : 0;
        } else {
          return d.layer === 0 ? opacity : d.layer === this.nodeCount ? opacity : 0;
        }
      });
  }

  exitNodeLabels() {
    this.exitingLabels.interrupt();

    this.exitingLabels
      .transition('exit_labels')
      // .duration(this.duration)
      .duration(this.duration / 3)
      .ease(easeCircleIn)
      .attr('opacity', 0)
      .remove();
  }

  addStrokeUnder() {
    const filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.updatingLabels.attr('filter', filter);
  }

  drawNodeLabels() {
    // const opacity = this.dataLabel.visible ? 1 : 0;
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;

    this.widthAllNodesNoLinks = this.nodeCount * this.nodeConfig.width + this.nodeCount * this.nodeConfig.width;
    this.noLinksLeftPadding = (this.innerPaddedWidth - this.widthAllNodesNoLinks) / 2;
    const nodeLabelUpdate = this.updatingLabels
      .text(d =>
        this.dataLabel.format
          ? formatDataLabel(d, this.innerLabelAccessor, this.dataLabel.format)
          : d[this.innerLabelAccessor]
      )
      .attr('data-x', d => {
        if (this.linkConfig.visible) {
          return this.dataLabel.placement === 'outside'
            ? d.x0 < this.innerPaddedWidth / 2
              ? d.x0
              : d.x1
            : d.x0 < this.innerPaddedWidth / 2
            ? d.x1
            : d.x0;
        } else {
          return d.x0 < this.innerPaddedWidth / 2
            ? this.noLinksLeftPadding
            : this.noLinksLeftPadding + this.widthAllNodesNoLinks + this.nodeConfig.width;
        }
      })
      .attr('data-y', d => (d.y1 + d.y0) / 2)
      .attr('data-translate-x', this.padding.left + this.margin.left)
      .attr('data-translate-y', this.padding.top + this.margin.top)
      .attr('data-use-dx', hideOnly)
      .attr('data-use-dy', hideOnly)
      .attr('dx', d =>
        this.dataLabel.placement === 'outside' || !this.linkConfig.visible
          ? d.x0 < this.innerPaddedWidth / 2
            ? '-0.5em'
            : '0.5em'
          : d.x0 < this.innerPaddedWidth / 2
          ? '0.5em'
          : '-0.5em'
      )
      .attr('dy', '0.4em')
      .transition('update_labels')
      .duration((_, i, n) => {
        return select(n[i]).classed('entering') ? this.duration / 3 : this.duration;
      })
      .delay((_, i, n) => {
        return select(n[i]).classed('entering') ? this.duration / 1.2 : 0;
      })
      .ease(easeCircleIn);

    if (this.dataLabel.visible && (this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly)) {
      // we only need the node outlines and correct attributes on them
      const collisionPlacement = this.dataLabel && this.dataLabel.collisionPlacement;
      const nodeRects = this.updateNodes
        .select('.alluvial-node')
        .attr('data-x', d => d.x0)
        .attr('data-y', d => d.y0)
        .attr('data-translate-x', this.padding.left + this.margin.left)
        .attr('data-translate-y', this.padding.top + this.margin.top)
        .attr('data-height', d => d.y1 - d.y0)
        .attr('data-width', d => d.x1 - d.x0)
        .each((d, i, n) => {
          // for each node, we create a clone and place it
          // on either side of the rect to hack an inside/outside
          // placement from the collision util
          if (!hideOnly) {
            const source = n[i];
            const parent = source.parentNode;
            const className = 'alluvial-node-collision-clone';
            const sourceCopy = source.cloneNode();
            select(sourceCopy)
              .classed('alluvial-node', false)
              .classed(className, true)
              .classed('entering', false)
              .data([d])
              .attr('focusable', false)
              .attr('aria-label', null)
              .attr('aria-hidden', true)
              .attr('role', null)
              .style('pointer-events', 'none')
              .style('visibility', 'hidden')
              .attr('tabindex', null)
              .attr(
                'data-x',
                collisionPlacement === 'all'
                  ? d.x0
                  : collisionPlacement === 'outside'
                  ? d.x0 < this.innerPaddedWidth / 2
                    ? d.x0
                    : d.x1
                  : d.x0 < this.innerPaddedWidth / 2
                  ? d.x1
                  : d.x0
              )
              .attr('data-width', collisionPlacement === 'all' ? d.x1 - d.x0 : 1);

            // temporarily append these to the parent
            parent.appendChild(sourceCopy);
          }
        });
      const clonedRects = this.updateNodes.select('.alluvial-node-collision-clone');
      this.bitmaps = resolveLabelCollision({
        labelSelection: nodeLabelUpdate,
        avoidMarks: hideOnly ? [nodeRects] : [nodeRects, clonedRects],
        validPositions: hideOnly ? ['middle'] : ['left', 'right'],
        offsets: hideOnly ? [1] : [4, 4],
        accessors: [this.innerIDAccessor],
        size: [roundTo(this.width, 0), roundTo(this.height, 0)], // we need the whole width for series labels
        hideOnly: this.dataLabel.visible && hideOnly
      });
      clonedRects.remove();

      // if we are in hide only we need to add attributes back
      if (hideOnly) {
        nodeLabelUpdate
          .attr('text-anchor', d => {
            return this.dataLabel.placement === 'outside' || !this.linkConfig.visible
              ? d.x0 < this.innerPaddedWidth / 2
                ? 'end'
                : 'start'
              : d.x0 < this.innerPaddedWidth / 2
              ? 'start'
              : 'end';
          })
          .attr('x', d => {
            if (this.linkConfig.visible) {
              return this.dataLabel.placement === 'outside'
                ? d.x0 < this.innerPaddedWidth / 2
                  ? d.x0
                  : d.x1
                : d.x0 < this.innerPaddedWidth / 2
                ? d.x1
                : d.x0;
            } else {
              return d.x0 < this.innerPaddedWidth / 2
                ? this.noLinksLeftPadding
                : this.noLinksLeftPadding + this.widthAllNodesNoLinks + this.nodeConfig.width;
            }
          })
          .attr('y', d => (d.y1 + d.y0) / 2)
          .attr('dx', d =>
            this.dataLabel.placement === 'outside' || !this.linkConfig.visible
              ? d.x0 < this.innerPaddedWidth / 2
                ? '-0.5em'
                : '0.5em'
              : d.x0 < this.innerPaddedWidth / 2
              ? '0.5em'
              : '-0.5em'
          )
          .attr('dy', '0.4em');
      }
    } else {
      nodeLabelUpdate
        .attr('text-anchor', d => {
          return this.dataLabel.placement === 'outside' || !this.linkConfig.visible
            ? d.x0 < this.innerPaddedWidth / 2
              ? 'end'
              : 'start'
            : d.x0 < this.innerPaddedWidth / 2
            ? 'start'
            : 'end';
        })
        // .attr('opacity', d => {
        //   if (this.linkConfig.visible) {
        //     let matchHover = true;
        //     if (d[this.sourceLinksString].length) {
        //       matchHover = d[this.sourceLinksString].some(
        //         linkData =>
        //           checkInteraction(
        //             linkData.data,
        //             opacity,
        //             this.hoverOpacity,
        //             this.hoverHighlight,
        //             this.clickHighlight,
        //             this.innerInteractionKeys
        //           ) >= 1
        //       );
        //     }
        //     if (d[this.targetLinksString].length) {
        //       matchHover = d[this.targetLinksString].some(
        //         linkData =>
        //           checkInteraction(
        //             linkData.data,
        //             opacity,
        //             this.hoverOpacity,
        //             this.hoverHighlight,
        //             this.clickHighlight,
        //             this.innerInteractionKeys
        //           ) >= 1
        //       );
        //     }
        //     return matchHover ? 1 : 0;
        //   } else {
        //     return d.layer === 0 ? opacity : d.layer === this.nodeCount ? opacity : 0;
        //   }
        // })
        .attr('x', d => {
          if (this.linkConfig.visible) {
            return this.dataLabel.placement === 'outside'
              ? d.x0 < this.innerPaddedWidth / 2
                ? d.x0
                : d.x1
              : d.x0 < this.innerPaddedWidth / 2
              ? d.x1
              : d.x0;
          } else {
            return d.x0 < this.innerPaddedWidth / 2
              ? this.noLinksLeftPadding
              : this.noLinksLeftPadding + this.widthAllNodesNoLinks + this.nodeConfig.width;
          }
        })
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dx', d =>
          this.dataLabel.placement === 'outside' || !this.linkConfig.visible
            ? d.x0 < this.innerPaddedWidth / 2
              ? '-0.5em'
              : '0.5em'
            : d.x0 < this.innerPaddedWidth / 2
            ? '0.5em'
            : '-0.5em'
        )
        .attr('dy', '0.4em');
    }
    // we need to call this after the transitions
    nodeLabelUpdate.call(transitionEndAll, () => {
      this.updatingLabels.classed('entering', false);
      this.addStrokeUnder();
    });
  }

  setNodeLabelOpacity() {
    this.updatingLabels.interrupt('label_opacity');
    const hideOnly = this.dataLabel.placement !== 'auto' && this.dataLabel.collisionHideOnly;
    const addCollisionClass =
      this.dataLabel.visible && (this.dataLabel.placement === 'auto' || this.dataLabel.collisionHideOnly);
    const opacity = this.dataLabel.visible ? 1 : 0;

    this.updatingLabels.attr('opacity', (d, i, n) => {
      const prevOpacity = +select(n[i]).attr('opacity');
      const styleVisibility = select(n[i]).style('visibility');
      let targetOpacity;
      if (this.linkConfig.visible) {
        let matchHover = true;
        if (d[this.sourceLinksString].length) {
          matchHover = d[this.sourceLinksString].some(
            linkData =>
              checkInteraction(
                linkData.data,
                opacity,
                this.hoverOpacity,
                this.hoverHighlight,
                this.clickHighlight,
                this.innerInteractionKeys
              ) >= 1
          );
        }
        if (d[this.targetLinksString].length) {
          matchHover = d[this.targetLinksString].some(
            linkData =>
              checkInteraction(
                linkData.data,
                opacity,
                this.hoverOpacity,
                this.hoverHighlight,
                this.clickHighlight,
                this.innerInteractionKeys
              ) >= 1
          );
        }
        targetOpacity = matchHover ? opacity : 0;
      } else {
        targetOpacity = d.layer === 0 ? opacity : d.layer === this.nodeCount ? opacity : 0;
      }
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
        .attr('data-use-dx', hideOnly) // need to add this for remove piece of collision below
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
        // we only need the node outlines and correct attributes on them
        const collisionPlacement = this.dataLabel && this.dataLabel.collisionPlacement;
        const nodeRects = this.updateNodes
          .select('.alluvial-node')
          .attr('data-x', d => d.x0)
          .attr('data-y', d => d.y0)
          .attr('data-translate-x', this.padding.left + this.margin.left)
          .attr('data-translate-y', this.padding.top + this.margin.top)
          .attr('data-height', d => d.y1 - d.y0)
          .attr('data-width', d => d.x1 - d.x0)
          .each((d, i, n) => {
            // for each node, we create a clone and place it
            // on either side of the rect to hack an inside/outside
            // placement from the collision util
            if (!hideOnly) {
              const source = n[i];
              const parent = source.parentNode;
              const className = 'alluvial-node-collision-clone';
              const sourceCopy = source.cloneNode();
              select(sourceCopy)
                .classed('alluvial-node', false)
                .classed(className, true)
                .classed('entering', false)
                .data([d])
                .attr('focusable', false)
                .attr('aria-label', null)
                .attr('aria-hidden', true)
                .attr('role', null)
                .style('pointer-events', 'none')
                .style('visibility', 'hidden')
                .attr('tabindex', null)
                .attr(
                  'data-x',
                  collisionPlacement === 'all'
                    ? d.x0
                    : collisionPlacement === 'outside'
                    ? d.x0 < this.innerPaddedWidth / 2
                      ? d.x0
                      : d.x1
                    : d.x0 < this.innerPaddedWidth / 2
                    ? d.x1
                    : d.x0
                )
                .attr('data-width', collisionPlacement === 'all' ? d.x1 - d.x0 : 1);

              // temporarily append these to the parent
              parent.appendChild(sourceCopy);
            }
          });
        const clonedRects = this.updateNodes.select('.alluvial-node-collision-clone');
        this.bitmaps = resolveLabelCollision({
          labelSelection: labelsAdded,
          bitmaps: this.bitmaps,
          avoidMarks: hideOnly ? [nodeRects] : [nodeRects, clonedRects],
          validPositions: hideOnly ? ['middle'] : ['left', 'right'],
          offsets: hideOnly ? [1] : [4, 4],
          accessors: [this.innerIDAccessor],
          size: [roundTo(this.width, 0), roundTo(this.height, 0)], // we need the whole width for series labels
          hideOnly: this.dataLabel.visible && hideOnly,
          suppressMarkDraw: true
        });
        clonedRects.remove();

        // if we are in hide only we need to add attributes back
        if (hideOnly) {
          labelsAdded
            .attr('text-anchor', d => {
              return this.dataLabel.placement === 'outside' || !this.linkConfig.visible
                ? d.x0 < this.innerPaddedWidth / 2
                  ? 'end'
                  : 'start'
                : d.x0 < this.innerPaddedWidth / 2
                ? 'start'
                : 'end';
            })
            .attr('x', d => {
              if (this.linkConfig.visible) {
                return this.dataLabel.placement === 'outside'
                  ? d.x0 < this.innerPaddedWidth / 2
                    ? d.x0
                    : d.x1
                  : d.x0 < this.innerPaddedWidth / 2
                  ? d.x1
                  : d.x0;
              } else {
                return d.x0 < this.innerPaddedWidth / 2
                  ? this.noLinksLeftPadding
                  : this.noLinksLeftPadding + this.widthAllNodesNoLinks + this.nodeConfig.width;
              }
            })
            .attr('y', d => (d.y1 + d.y0) / 2)
            .attr('dx', d =>
              this.dataLabel.placement === 'outside' || !this.linkConfig.visible
                ? d.x0 < this.innerPaddedWidth / 2
                  ? '-0.5em'
                  : '0.5em'
                : d.x0 < this.innerPaddedWidth / 2
                ? '0.5em'
                : '-0.5em'
            )
            .attr('dy', '0.4em');
        }

        // remove temporary class now
        labelsAdded.classed('collision-added', false);
      }
    }
  }

  updateInteractionState() {
    // we created an "opacity" transition namespace in update's transition
    // we override it here to instantly display opacity state (below)
    this.removeTemporaryClickedLinks(this.svg.node());
    this.updateLinks.interrupt('opacity');

    // we use this.update and this.labelCurrent from setGlobalSelection here
    // the lifecycle state does not matter (enter/update/exit)
    // since interaction state can happen at any time
    const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;
    this.updateLinks
      .attr('stroke-opacity', d => {
        return checkInteraction(
          d.data,
          linkOpacity,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
          // this.nodeIDAccessor
        );
      })
      .attr('stroke', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys) &&
        this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : this.hoverHighlight &&
            checkHovered(d.data, this.hoverHighlight, this.innerInteractionKeys) &&
            this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : this.innerLinkFillMode === 'group'
          ? this.colorArr[this.groupKeys.indexOf(d[this.groupAccessor])]
          : this.innerLinkFillMode === 'none'
          ? this.colorArr[0] || '#E4E4E4'
          : this.innerLinkFillMode === 'link'
          ? this.colorArr[d.index]
          : this.innerLinkFillMode === 'source'
          ? this.colorArr[d.source.index]
          : this.colorArr[d.target.index]
      );

    this.updateLinks.each((d, i, n) => {
      const clicked =
        this.clickHighlight &&
        this.clickHighlight.length > 0 &&
        checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys);
      if (clicked) {
        // this will add a non-interactive duplicate of each clicked link above the existing ones
        // so that the link visually appears above all other links, but the keyboard nav order does not change
        this.drawDuplicateClickedLink(n[i], d);
      }
    });
  }

  bindInteractivity() {
    this.updateLinks
      .on('click', !this.suppressEvents ? (d, i, n) => this.onClickHandler(d, n[i]) : null)
      .on('mouseover', !this.suppressEvents ? (d, i, n) => this.onHoverHandler(d, n[i]) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null);
  }

  drawAnnotations() {
    const positionData = this.preppedData;
    const preppedAnnotations = [];
    this.annotations.forEach((datum: any) => {
      const d = { ...datum };
      let internalData = datum.data;
      if (positionData && internalData) {
        if (d.positionType === 'node' && d.data.hasOwnProperty(this.innerIDAccessor)) {
          const index = positionData.nodes.findIndex(x => x[this.innerIDAccessor] === d.data[this.innerIDAccessor]);
          internalData = positionData.nodes[index];
        } else if (
          d.positionType === 'source' ||
          (d.positionType === 'target' &&
            d.data.hasOwnProperty(this.sourceAccessor) &&
            d.data.hasOwnProperty(this.targetAccessor))
        ) {
          const index = positionData.links.findIndex(
            x =>
              x.data[this.sourceAccessor] === d.data[this.sourceAccessor] &&
              x.data[this.targetAccessor] === d.data[this.targetAccessor]
          );
          internalData = positionData.links[index];
        }
      }
      if (d.positionType && internalData) {
        if (d.positionType === 'target' && internalData.target) {
          d.x = internalData.target.x0;
          d.y = internalData.y1;
        } else if (d.positionType === 'source' && internalData.source) {
          d.x = internalData.source.x1;
          d.y = internalData.y0;
        } else if (d.positionType === 'node') {
          d.x = internalData.x1;
          d.y = (internalData.y1 + internalData.y0) / 2;
        }
      }
      // we need to wipe the data before we pass it in, so that the x and y are used instead!
      delete d.data;
      preppedAnnotations.push(d);
    });
    annotate({
      source: this.rootG.node(),
      data: preppedAnnotations,
      ignoreScales: true,
      // xScale: this.x,
      // xAccessor: this.layout !== 'horizontal' ? this.ordinalAccessor : this.valueAccessor,
      // yScale: this.y,
      // yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.ordinalAccessor,
      width: this.width,
      height: this.height,
      padding: this.padding,
      margin: this.margin,
      bitmaps: this.bitmaps
    });
  }

  setColors() {
    this.colorArr = this.colors ? convertVisaColor(this.colors) : getColors(this.colorPalette, this.nodeList.length);
  }

  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }

  setChartDescriptionWrapper() {
    // this initializes the accessibility description section of the chart
    initializeDescriptionRoot({
      rootEle: this.alluvialDiagramEl, // this.lineChartEl,
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'alluvial-diagram',
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
    // this sets the accessibility features of the root SVG element
    const keys = scopeDataKeys(this, chartAccessors, 'alluvial-diagram');
    setAccessibilityController({
      node: this.svg.node(), // this.svg.node(),
      chartTag: 'alluvial-diagram',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'link',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: keys,
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.innerIDAccessor,
      groupKeys: ['value'],
      groupName: 'node',
      disableKeyNav:
        this.suppressEvents &&
        this.accessibility.elementsAreInterface === false &&
        this.accessibility.keyboardNavConfig &&
        this.accessibility.keyboardNavConfig.disabled
    });
  }

  setGeometryAccessibilityAttributes() {
    // this makes sure every geom element has correct event handlers + semantics (role, tabindex, etc)
    this.updateLinks.each((_d, i, n) => {
      initializeElementAccess(n[i]);
    });
  }

  setGeometryAriaLabels() {
    // this adds an ARIA label to each geom (a description read by screen readers)
    const keys = scopeDataKeys(this, chartAccessors, 'alluvial-diagram');
    this.updateLinks.each((_d, i, n) => {
      setElementFocusHandler({
        node: n[i],
        geomType: 'link',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        dataKeyNames: this.dataKeyNames,
        groupName: 'node',
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
    this.updateNodes.each((_, i, n) => {
      setElementAccessID({
        node: n[i],
        uniqueID: this.chartID
      });
    });
  }

  setChartCountAccessibility() {
    // this is our automated section that describes the chart contents
    // (like geometry and gorup counts, etc)
    setAccessChartCounts({
      rootEle: this.alluvialDiagramEl, // this.lineChartEl,
      parentGNode: this.linkG.node(), // this.dotG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'alluvial-diagram',
      geomType: 'link',
      groupName: 'node'
      // recursive: true
    });
  }

  setSelectedClass() {
    this.updateLinks
      .classed('highlight', d => {
        const selected = checkInteraction(d.data, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        return this.clickHighlight && this.clickHighlight.length ? selected : false;
      })
      .each((d, i, n) => {
        let selected = checkInteraction(d.data, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
        const selectable = this.accessibility.elementsAreInterface;
        setElementInteractionAccessState(n[i], selected, selectable);
      });
  }

  setChartAccessibilityTitle() {
    setAccessTitle(this.alluvialDiagramEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.alluvialDiagramEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.alluvialDiagramEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.alluvialDiagramEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.alluvialDiagramEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.alluvialDiagramEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.alluvialDiagramEl, this.accessibility.statisticalNotes);
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.alluvialDiagramEl, this.accessibility.structureNotes);
  }

  setAnnotationAccessibility() {
    setAccessAnnotation(this.alluvialDiagramEl, this.annotations);
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
    this.clickEvent.emit({ data: d.data, target: n });
  }

  onHoverHandler(d, n) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverEvent.emit({ data: d.data, target: n });
    if (this.showTooltip) {
      this.eventsTooltip({ data: d.data, evt: event, isToShow: true });
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
      dataKeyNames: this.dataKeyNames,
      groupAccessor: this.groupAccessor,
      xAccessor: this.sourceAccessor, // map source to x for default tooltip logic
      yAccessor: this.targetAccessor, // map source to y for default tooltip logic
      valueAccessor: this.valueAccessor,
      ordinalAccessor: this.innerIDAccessor,
      chartType: 'alluvial-diagram'
    });
  }

  render() {
    this.drawStartEvent.emit({ chartID: this.chartID });
    // everything between this comment and the third should eventually
    // be moved into componentWillUpdate (if the stenicl bug is fixed)
    this.init();
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
    if (this.shouldValidateLabelText) {
      this.validateLabelText();
      this.shouldValidateLabelText = false;
    }
    if (this.shouldValidateLinkFillMode) {
      this.validateLinkFillMode();
      this.shouldValidateLinkFillMode = false;
    }
    if (this.shouldValidateNodeAlignment) {
      this.validateNodeAlignment();
      this.shouldValidateNodeAlignment = false;
    }
    if (this.shouldValidateInteractionKeys) {
      this.validateInteractionKeys();
      this.shouldValidateInteractionKeys = false;
    }
    if (this.shouldValidateLinkGroups) {
      this.validateLinkGroups();
      this.shouldValidateLinkGroups = true;
    }
    if (this.shouldValidateAccessibility) {
      this.shouldValidateAccessibilityProps();
      this.shouldValidateAccessibility = false;
    }
    if (this.shouldSetColors) {
      this.setColors();
      this.shouldSetColors = false;
    }
    if (this.shouldValidateIdAccessor) {
      this.validateIdAccessor();
      this.shouldValidateIdAccessor = false;
    }
    if (this.shouldSetNodeDimensions) {
      this.setNodeDimensions();
      this.shouldSetNodeDimensions = false;
    }
    if (this.shouldCallSankeyGenerator) {
      this.callSankeyGenerator();
      this.shouldCallSankeyGenerator = false;
    }
    if (this.shouldUpdateTableData) {
      this.setTableData();
      this.shouldUpdateTableData = false;
    }

    return (
      // <div class="alluvial-diagram">alluvial-diagram</div>;
      <div>
        <div class="o-layout">
          <div class="o-layout--chart">
            <this.topLevel class="alluvial-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
            <this.bottomLevel class="visa-ui-text--instructions alluvial-sub-title vcl-sub-title">
              {this.subTitle}
            </this.bottomLevel>
            <keyboard-instructions
              uniqueID={this.chartID}
              geomType={'link'}
              groupName={'node'} // taken from initializeDescriptionRoot, on bar this should be "bar group", stacked bar is "stack", and clustered is "cluster"
              chartTag={'alluvial-diagram'}
              width={this.width - (this.margin ? this.margin.right || 0 : 0)}
              isInteractive={this.accessibility.elementsAreInterface}
              hasCousinNavigation={this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target'}
              cousinActionOverride={'on a link'}
              cousinResultOverride={
                this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target'
                  ? "Drill up to link's Source or Target node"
                  : ''
              }
              disabled={
                this.suppressEvents &&
                this.accessibility.elementsAreInterface === false &&
                this.accessibility.keyboardNavConfig &&
                this.accessibility.keyboardNavConfig.disabled
              } // the chart is "simple"
            />
            <div class="visa-viz-d3-alluvial-container" />
            <div class="alluvial-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
            <data-table
              uniqueID={this.chartID}
              isCompact
              tableColumns={this.tableColumns}
              dataKeyNames={this.dataKeyNames}
              data={this.tableData}
              secondaryData={this.secondaryTableData}
              secondaryTableColumns={this.secondaryTableColumns}
              padding={this.padding}
              margin={this.margin}
              hideDataTable={this.accessibility.hideDataTableButton}
              unitTest={this.unitTest}
            />
          </div>
        </div>
        {/* <canvas id="bitmap-render" /> */}
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(AlluvialDiagramDefaultValues);
    let i = 0;
    const exceptions = {
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
      linkConfig: {
        ...{
          exception: false
        }
      }
    };
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : AlluvialDiagramDefaultValues[keys[i]];
    }
  }
}
