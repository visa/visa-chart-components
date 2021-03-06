/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, Watch, h, Event, EventEmitter } from '@stencil/core';

import { select, event } from 'd3-selection';
import { max } from 'd3-array';
// import * as d3Sankey from 'd3-sankey';
import { easeCircleIn } from 'd3-ease';
// import { IAlluvialDiagramProps } from './alluvial-diagram-props';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType,
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
  transitionEndAll,
  annotate,
  checkClicked,
  checkInteraction,
  convertVisaColor,
  drawTooltip,
  findTagLevel,
  getColors,
  getPadding,
  initTooltipStyle,
  overrideTitleTooltip,
  scopeDataKeys,
  chartAccessors,
  sankey,
  sankeyCenter,
  sankeyJustify,
  sankeyLeft,
  sankeyLinkHorizontal,
  sankeyRight
} = Utils;

@Component({
  tag: 'alluvial-diagram',
  styleUrl: 'alluvial-diagram.scss'
})
export class AlluvialDiagram {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

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

  // Data label (5/7)
  @Prop({ mutable: true }) dataLabel: IDataLabelType = AlluvialDiagramDefaultValues.dataLabel;
  @Prop({ mutable: true }) showTooltip: boolean = AlluvialDiagramDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = AlluvialDiagramDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = AlluvialDiagramDefaultValues.accessibility;
  @Prop({ mutable: true }) annotations: object[] = AlluvialDiagramDefaultValues.annotations;

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = AlluvialDiagramDefaultValues.suppressEvents;
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
  interactionKeysWithObjs: any;
  colorArr: any;
  noLinksLeftPadding: any;
  widthAllNodesNoLinks: any;
  topLevel: string = 'h2';
  bottomLevel: string = 'p';
  sourceLinksString: string = 'sourceLinks';
  targetLinksString: string = 'targetLinks';
  groupKeys: any;
  shouldSetDimensions: boolean = false;
  shouldUpdateData: boolean = false;
  shouldSetColors: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldRedrawWrapper: boolean = false;
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

  @Watch('linkData')
  linkDataWatcher(_newData, _oldData) {}

  @Watch('nodeData')
  nodeDataWatcher(_newData, _oldData) {}

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID || 'alluvial-diagram-' + uuid();
    this.alluvialDiagramEl.id = this.chartID;
  }

  @Watch('mainTitle')
  mainTitleWatcher(_newVal, _oldVal) {}

  @Watch('subTitle')
  subTitleWatcher(_newVal, _oldVal) {}

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

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  dimensionWatcher(_newVal, _oldVal) {
    this.shouldSetDimensions = true;
  }

  @Watch('sourceAccessor')
  sourceAccessorWatcher(_newVal, _oldVal) {}

  @Watch('targetAccessor')
  targetAccessorWatcher(_newVal, _oldVal) {}

  @Watch('valueAccessor')
  valueAccessorWatcher(_newVal, _oldVal) {}

  @Watch('groupAccessor')
  groupAccessorWatcher(_newVal, _oldVal) {}

  @Watch('nodeIDAccessor')
  nodeIDAccessorWatcher(_newVal, _oldVal) {}

  @Watch('nodeConfig')
  nodeConfigWatcher(_newVal, _oldVal) {
    // const newFillVal = _newVal && _newVal.fill;
    // const oldFillVal = _oldVal && _oldVal.fill;
    // const newWidthVal = _newVal && _newVal.width;
    // const oldWidthVal = _oldVal && _oldVal.width;
    // const newPaddingVal = _newVal && _newVal.padding;
    // const oldPaddingVal = _oldVal && _oldVal.padding;
    // const newAlignmentVal = _newVal && _newVal.alignment;
    // const oldAlignmentVal = _oldVal && _oldVal.alignment;
    // const newCompareVal = _newVal && _newVal.compare;
    // const oldCompareVal = _oldVal && _oldVal.compare;
  }

  @Watch('linkConfig')
  linkConfigWatcher(_newVal, _oldVal) {}

  @Watch('colorPalette')
  colorPaletteWatcher(_newVal, _oldVal) {}

  @Watch('colors')
  colorsWatcher(_newVal, _oldVal) {}

  @Watch('clickStyle')
  clickStyleWatcher(_newVal, _oldVal) {}

  @Watch('hoverStyle')
  hoverStyleWatcher(_newVal, _oldVal) {}

  @Watch('cursor')
  cursorWatcher(_newVal, _oldVal) {}

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_newVal, _oldVal) {}

  @Watch('dataLabel')
  dataLabelWatcher(_newVal, _oldVal) {}

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_newVal, _oldVal) {}

  @Watch('showTooltip')
  showTooltipWatcher(_newVal, _oldVal) {}

  @Watch('accessibility')
  accessibilityWatcher(_newVal, _oldVal) {
    // this.shouldValidate = true;
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
  }

  @Watch('annotations')
  annotationsWatcher(_newVal, _oldVal) {}

  @Watch('clickHighlight')
  clickWatcher(_newVal, _oldVal) {}

  @Watch('hoverHighlight')
  hoverWatcher(_newVal, _oldVal) {}

  @Watch('interactionKeys')
  interactionWatcher(_newVal, _oldVal) {}

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {}

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
      this.defaults = true;
      this.chartID = this.uniqueID || 'alluvial-diagram-' + uuid();
      this.alluvialDiagramEl.id = this.chartID;
      this.setTagLevels();
      this.setDimensions();
      this.prepareData();
      this.validateIdAccessor();
      this.validateLabelText();
      this.validateLinkFillMode();
      this.validateNodeAlignment();
      this.validateInteractionKeys();
      this.validateLinkGroups();
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
      this.setTooltipInitialStyle();
      this.setNodesDimensions();
      this.callSankeyGenerator();
      this.setGlobalSelections();
      this.setTestingAttributes();
      this.drawNodes();
      this.drawLinks();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.setGroupAccessibilityID();
      this.setChartCountAccessibility();
      this.setSelectedClass();
      this.drawNodeLabels();
      this.drawAnnotations();
      this.setAnnotationAccessibility();

      hideNonessentialGroups(this.root.node(), null);
      resolve('component did load');
    });
  }

  componentDidUpdate() {
    return new Promise(resolve => {
      this.reSetRoot();

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

      this.setNodesDimensions();
      this.callSankeyGenerator();
      // if (this.shouldSetGlobalSelections) {
      this.setGlobalSelections();
      //   this.shouldSetGlobalSelections = false;
      // }
      if (this.shouldSetTestingAttributes) {
        this.setTestingAttributes();
        this.shouldSetTestingAttributes = false;
      }
      this.drawNodes();
      this.drawLinks();
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
      if (this.shouldSetSelectionClass) {
        this.setSelectedClass();
        this.shouldSetSelectionClass = false;
      }
      this.drawNodeLabels();
      this.drawAnnotations();
      if (this.shouldSetAnnotationAccessibility) {
        this.setAnnotationAccessibility();
        this.shouldSetAnnotationAccessibility = false;
      }

      resolve('component did update');
    });
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
      linkObj[this.groupAccessor] = obj[this.groupAccessor];
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
    this.innerLabelAccessor = this.dataLabel.labelAccessor ? this.dataLabel.labelAccessor : this.innerIDAccessor;
  }

  // if  there is no nodeData present, use 'id', otherwise use the nodeIDAccessor that is passed
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
        : this.linkConfig.fillMode === 'path'
        ? 'path'
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
    this.interactionKeysWithObjs = [];
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

  setNodesDimensions() {
    //controls node width and node padding
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
    this.updateNodes = dataBoundToNodes.merge(this.enterNodes); //.selectAll('rect');
    this.updateNodes.selectAll('.alluvial-node').data(d => [d]);

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
      this.enterLinkGroups = dataBoundToLinkGroups
        .enter()
        .append('g')
        .attr('class', 'alluvial-link-wrapper');
      this.exitLinkGroups = dataBoundToLinkGroups.exit().remove();
      this.updateLinkGroups = dataBoundToLinkGroups.merge(this.enterLinkGroups);

      const dataBoundToLinks = this.updateLinkGroups
        .selectAll('.alluvial-link')
        .data(d => d.sourceLinks, d => d.data[this.sourceAccessor] + d.data[this.targetAccessor]);
      this.enterLinks = dataBoundToLinks
        .enter()
        .append('path')
        .attr('class', 'alluvial-link');
      this.exitLinks = dataBoundToLinks.exit();
      this.updateLinks = dataBoundToLinks.merge(this.enterLinks).attr('data-offset-element', this.innerLinkFillMode);
    } else {
      this.updateNodes.attr('tabindex', null);

      const dataBoundToLinks = this.linkG
        .selectAll('.alluvial-link')
        .data(this.preppedData.links, d => d.data[this.sourceAccessor] + d.data[this.targetAccessor]);
      this.enterLinks = dataBoundToLinks
        .enter()
        .append('path')
        .attr('class', 'alluvial-link');
      this.exitLinks = dataBoundToLinks.exit();
      this.updateLinks = dataBoundToLinks.merge(this.enterLinks).attr('data-offset-element', null);
    }

    const dataBoundToLabels = this.labelG.selectAll('text').data(this.preppedData.nodes, d => d[this.nodeIDAccessor]);
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

      // this.svg.select('defs').attr('data-testid', 'pattern-defs');
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

      // this.svg.select('defs').attr('data-testid', null);
    }
  }

  drawLinks() {
    this.removeTemporaryClickedLinks(this.svg.node());
    const linkOpacity = this.linkConfig.visible ? this.linkConfig.opacity : 0;

    if (this.innerLinkFillMode === 'source' || this.innerLinkFillMode === 'target') {
      this.updateLinkGroups.classed('link-group offset-target', true);
      // .classed('entering', true)
      // .attr('cursor', !this.suppressEvents ? this.cursor : null);
    }

    this.updateLinks
      .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('fill', 'none')
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
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d =>
        this.innerLinkFillMode === 'group'
          ? this.colorArr[this.groupKeys.indexOf(d[this.groupAccessor])]
          : this.innerLinkFillMode === 'none'
          ? this.colorArr[0] || '#E4E4E4'
          : this.innerLinkFillMode === 'path'
          ? this.colorArr[d.index]
          : this.innerLinkFillMode === 'source'
          ? this.colorArr[d.source.index]
          : this.colorArr[d.target.index]
      )
      .attr('stroke-width', d => Math.max(1, d.width))
      .each((d, i, n) => {
        const clicked =
          this.clickHighlight &&
          this.clickHighlight.length > 0 &&
          checkClicked(d.data, this.clickHighlight, this.innerInteractionKeys);
        if (clicked) {
          // this will add a non-interactive duplicate of each clicked link above the existing ones
          // so that the link visually appears above all other links, but the keyboard nav order does not change
          this.drawDuplicateClickedLink(n[i]);
        }
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
      });
  }

  // creates a clone of clicked links
  drawDuplicateClickedLink(inputElement) {
    const source = inputElement;
    const className = 'vcl-accessibility-focus';
    const parent = source.parentNode;
    const sourceCopy = source.cloneNode();
    select(sourceCopy)
      .classed('alluvial-link', false)
      .classed(className + '-highlight ' + className + '-hover', true)
      .classed('duplicated-clicked-link', true)
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

  drawNodes() {
    this.updateNodes
      .select('.alluvial-node')
      // .on('click', !this.suppressEvents ? d => this.onClickHandler(d) : null)
      // .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      // .on('mouseover', !this.suppressEvents ? d => this.onHoverHandler(d) : null)
      // .on('mouseout', !this.suppressEvents ? () => this.onMouseOutHandler() : null)
      // .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('opacity', 1)
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
      //         this.interactionKeysWithObjs,
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
      //         this.interactionKeysWithObjs,
      //         this.nodeIDAccessor
      //       ) >= 1
      //   );
      // }
      // return matchHover ? 1 : this.hoverOpacity;
      // })
      .attr('fill', (_, i) => (this.nodeConfig.fill ? this.colorArr[i] || this.colorArr[0] : '#E4E4E4'))
      .attr('stroke', '#717171');
    // .attr('stroke-width', '1px');
  }

  drawNodeLabels() {
    const opacity = this.dataLabel.visible ? 1 : 0;
    const lastColumnLayer = max(this.preppedData.nodes, d => d.layer);
    this.widthAllNodesNoLinks = lastColumnLayer * this.nodeConfig.width + lastColumnLayer * this.nodeConfig.width;
    this.noLinksLeftPadding = (this.innerPaddedWidth - this.widthAllNodesNoLinks) / 2;

    this.updatingLabels
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
          return d.layer === 0 ? opacity : d.layer === lastColumnLayer ? opacity : 0;
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
      })
      .text(d => d[this.innerLabelAccessor]);
  }

  drawAnnotations() {
    const positionData = this.preppedData;
    const preppedAnnotations = [];
    this.annotations.forEach((datum: any) => {
      const d = { ...datum };
      let internalData = datum.data;
      if (positionData && internalData) {
        if (d.positionType === 'node' && d.data.hasOwnProperty(this.nodeIDAccessor)) {
          const index = positionData.nodes.findIndex(x => x[this.nodeIDAccessor] === d.data[this.nodeIDAccessor]);
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
      ignoreScales: true
      // xScale: this.x,
      // xAccessor: this.layout !== 'horizontal' ? this.ordinalAccessor : this.valueAccessor,
      // yScale: this.y,
      // yAccessor: this.layout !== 'horizontal' ? this.valueAccessor : this.ordinalAccessor
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
      geomType: 'link', // 'node', // maybe not childmost level? very tricky here...
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'alluvial-diagram',
      uniqueID: this.chartID,
      groupName: 'node', // when do we describe the columns??
      highestHeadingLevel: this.highestHeadingLevel,
      redraw: this.shouldRedrawWrapper
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
      groupAccessor: this.innerIDAccessor,
      groupKeys: ['value'],
      groupName: 'node'
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

  onClickHandler(d) {
    this.clickFunc.emit(d.data);
  }

  onHoverHandler(d) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverFunc.emit(d.data);
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
      groupAccessor: this.groupAccessor,
      // sourceAccessor: this.sourceAccessor,
      // targetAccessor: this.targetAccessor,
      valueAccessor: this.valueAccessor,
      // labelAccessor: this.labelAccessor,
      ordinalAccessor: this.innerIDAccessor,
      chartType: 'alluvial-diagram'
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
    // if (this.shouldSetDimensions) {
    this.setDimensions();
    // this.shouldSetDimensions = false;
    // }
    // if (this.shouldUpdateData) {
    this.prepareData();
    // this.shouldUpdateData = false;
    // }
    this.validateIdAccessor();
    this.validateLabelText();
    this.validateLinkFillMode();
    this.validateInteractionKeys();
    this.validateLinkGroups();
    // if (this.shouldSetColors) {
    this.setColors();
    // this.shouldSetColors = false;
    // }

    return (
      // <div class="alluvial-diagram">alluvial-diagram</div>;
      <div>
        <div class="o-layout">
          <div class="o-layout--chart">
            <this.topLevel class="alluvial-main-title vcl-main-title">{this.mainTitle}</this.topLevel>
            <this.bottomLevel class="visa-ui-text--instructions alluvial-sub-title vcl-sub-title">
              {this.subTitle}
            </this.bottomLevel>
            <div class="visa-viz-d3-alluvial-container" />
            <div class="alluvial-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
            {/* <data-table
              uniqueID={this.chartID}
              isCompact
              tableColumns={this.tableColumns}
              data={this.tableData}
              padding={this.padding}
              margin={this.margin}
              hideDataTable={this.accessibility.hideDataTableButton}
              unitTest={this.unitTest}
            /> */}
          </div>
        </div>
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
