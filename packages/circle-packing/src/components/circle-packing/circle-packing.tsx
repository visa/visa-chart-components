/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, h, Watch, Event, EventEmitter } from '@stencil/core';
import {
  IBoxModelType,
  IHoverStyleType,
  IClickStyleType,
  IDataLabelType,
  ITooltipLabelType,
  IAccessibilityType
} from '@visa/charts-types';
import { CirclePackingDefaultValues } from './circle-packing-default-values';
import { select, event } from 'd3-selection';
import { max } from 'd3-array';
import 'd3-transition';
import * as hierarchy from 'd3-hierarchy';
import Utils from '@visa/visa-charts-utils';
import { v4 as uuid } from 'uuid';

const {
  getContrastingStroke,
  createTextStrokeFilter,
  convertColorsToTextures,
  initializeGeometryAccess,
  initializeDescriptionRoot,
  setGeometryAccessLabel,
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
  setAccessStructure,
  setAccessAnnotation,
  retainAccessFocus,
  checkAccessFocus,
  setElementInteractionAccessState,
  drawTooltip,
  setAccessibilityDescriptionWidth,
  annotate,
  getPadding,
  chartAccessors,
  checkInteraction,
  checkClicked,
  checkHovered,
  convertVisaColor,
  getColors,
  getLicenses,
  getScopedData,
  initTooltipStyle,
  transitionEndAll,
  overrideTitleTooltip,
  roundTo,
  scopeDataKeys,
  visaColors,
  validateAccessibilityProps,
  findTagLevel
} = Utils;

@Component({
  tag: 'circle-packing',
  styleUrl: 'circle-packing.scss'
})
export class CirclePacking {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;
  // Chart Attributes (1/7)
  @Prop({ mutable: true }) mainTitle: string = CirclePackingDefaultValues.mainTitle;
  @Prop({ mutable: true }) subTitle: string = CirclePackingDefaultValues.subTitle;
  @Prop({ mutable: true }) height: number = CirclePackingDefaultValues.height;
  @Prop({ mutable: true }) width: number = CirclePackingDefaultValues.width;
  @Prop({ mutable: true }) margin: IBoxModelType = CirclePackingDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = CirclePackingDefaultValues.padding;
  @Prop({ mutable: true }) circlePadding: number = CirclePackingDefaultValues.circlePadding;
  @Prop({ mutable: true }) highestHeadingLevel: string | number = CirclePackingDefaultValues.highestHeadingLevel;

  // Data (2/7)
  @Prop() data;
  @Prop() uniqueID;
  @Prop({ mutable: true }) dataDepth: number = CirclePackingDefaultValues.dataDepth;
  @Prop({ mutable: true }) displayDepth: number = CirclePackingDefaultValues.displayDepth;
  @Prop({ mutable: true }) parentAccessor: string = CirclePackingDefaultValues.parentAccessor;
  @Prop({ mutable: true }) nodeAccessor: string = CirclePackingDefaultValues.nodeAccessor;
  @Prop({ mutable: true }) sizeAccessor: string = CirclePackingDefaultValues.sizeAccessor;

  // Color & Shape (4/7)
  @Prop({ mutable: true }) colorPalette: string = CirclePackingDefaultValues.colorPalette;
  @Prop({ mutable: true }) colors: string[];
  @Prop({ mutable: true }) cursor: string = CirclePackingDefaultValues.cursor;
  @Prop({ mutable: true }) hoverStyle: IHoverStyleType = CirclePackingDefaultValues.hoverStyle;
  @Prop({ mutable: true }) clickStyle: IClickStyleType = CirclePackingDefaultValues.clickStyle;
  @Prop({ mutable: true }) hoverOpacity: number = CirclePackingDefaultValues.hoverOpacity;

  // Data label (5/7)
  @Prop({ mutable: true }) showTooltip: boolean = CirclePackingDefaultValues.showTooltip;
  @Prop({ mutable: true }) tooltipLabel: ITooltipLabelType = CirclePackingDefaultValues.tooltipLabel;
  @Prop({ mutable: true }) dataLabel: IDataLabelType = CirclePackingDefaultValues.dataLabel;
  @Prop({ mutable: true }) annotations: object[] = CirclePackingDefaultValues.annotations;
  @Prop({ mutable: true }) accessibility: IAccessibilityType = CirclePackingDefaultValues.accessibility;

  // Calculation (6/7)

  // Interactivity (7/7)
  @Prop() suppressEvents: boolean = CirclePackingDefaultValues.suppressEvents;
  @Prop({ mutable: true }) interactionKeys: string[];
  @Prop({ mutable: true }) hoverHighlight: object;
  @Prop({ mutable: true }) clickHighlight: object[] = CirclePackingDefaultValues.clickHighlight;
  @Prop({ mutable: true }) zoomToNode: object;

  @Element()
  circlePackingEl: HTMLElement;
  shouldValidateAccessibility: boolean = true;
  svg: any;
  root: any;
  rootG: any;
  duration: number;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  current: any;
  circle: any;
  circleG: any;
  enterCircle: any;
  exitCircle: any;
  updateParentCircle: any;
  enterText: any;
  updateText: any;
  exitText: any;
  tooltipG: any;
  nodes: any;
  view: any;
  zoomRatio: any;
  text: any;
  textG: any;
  focus: any;
  colorArr: any;
  preparedColors: any;
  rootCircle: any;
  enter: any;
  holder: any;
  diameter: any;
  currentDepth: number = 0;
  zooming: any = false;
  timer: any = 0;
  delay: any = 200;
  prevent: any = false;
  tableData: any;
  tableColumns: any;
  updated: boolean = false;
  exitSize: number = 0;
  enterSize: number = 0;
  textFilter: string;
  filter: string;
  innerDisplayDepth: number;
  innerDataDepth: number;
  chartID: string;
  shouldZoom: boolean = false;
  shouldValidateInteractionKeys: boolean = false;
  shouldDrawInteractionState: boolean = false;
  shouldUpdateClickFunc: boolean = false;
  shouldUpdateHoverFunc: boolean = false;
  shouldUpdateMouseoutFunc: boolean = false;
  // shouldUpdateAccessibility: boolean = false;
  shouldUpdateAnnotations: boolean = false;
  shouldResetRoot: boolean = false;
  shouldSetColors: boolean = false;
  shouldUpdateDisplayDepth: boolean = false;
  shouldUpdateLabels: boolean = false;
  shouldAddStrokeUnder: boolean = false;
  shouldUpdateCursor: boolean = false;
  shouldUpdateData: boolean = false;
  shouldUpdateTableData: boolean = false;
  shouldValidate: boolean = false;
  shouldBindInteractivity: boolean = false;
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
  shouldSetChartAccessibilityCount: boolean = false;
  shouldUpdateLayout: boolean = false;
  shouldSetTextures: boolean = false;
  shouldSetStrokes: boolean = false;
  shouldSetTextStrokes: boolean = false;
  shouldSetTagLevels: boolean = false;
  shouldRedrawWrapper: boolean = false;
  shouldSetIDs: boolean = false;
  innerInteractionKeys: any = [];
  defaultsLoaded: any = {};
  bottomLevel: string = 'p';
  topLevel: string = 'h2';
  strokes: any = {};

  @Watch('data')
  dataWatcher(_new, _old) {
    this.updated = true;
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldValidate = true;
    this.shouldZoom = true;
    this.shouldAddStrokeUnder = true;
    this.shouldSetGeometryAccessibilityAttributes = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetColors = true;
  }

  @Watch('mainTitle')
  titleWatcher(_new, _old) {
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetChartAccessibilityTitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('subTitle')
  subtitleWatcher(_new, _old) {
    this.shouldSetChartAccessibilitySubtitle = true;
    this.shouldSetParentSVGAccessibility = true;
  }

  @Watch('highestHeadingLevel')
  headingWatcher(_newVal, _oldVal) {
    this.shouldRedrawWrapper = true;
    this.shouldSetTagLevels = true;
    this.shouldSetChartAccessibilityCount = true;
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

  @Watch('parentAccessor')
  clusterWatcher(_new, _old) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldZoom = true;
    this.shouldAddStrokeUnder = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldDrawInteractionState = true;
  }

  @Watch('nodeAccessor')
  nodeWatcher(_new, _old) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldZoom = true;
    this.shouldAddStrokeUnder = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldDrawInteractionState = true;
  }

  @Watch('sizeAccessor')
  sizeWatcher(_new, _old) {
    this.shouldUpdateData = true;
    this.shouldUpdateTableData = true;
    this.shouldSetGeometryAriaLabels = true;
    this.shouldZoom = true;
  }

  @Watch('height')
  @Watch('width')
  @Watch('padding')
  @Watch('margin')
  heightWatcher(_new, _old) {
    this.shouldUpdateLayout = true;
    this.shouldResetRoot = true;
    this.shouldUpdateData = true;
    this.shouldZoom = true;
    this.shouldAddStrokeUnder = true;
  }

  @Watch('dataDepth')
  dataDepthWatcher(_new, _old) {
    this.shouldUpdateData = true;
    this.shouldSetColors = true;
    this.shouldZoom = true;
  }

  @Watch('displayDepth')
  displayDepthWatcher(_new, _old) {
    this.shouldUpdateDisplayDepth = true;
    this.shouldZoom = true;
  }

  @Watch('circlePadding')
  circlePaddingWatcher(_new, _old) {
    this.shouldUpdateData = true;
    this.shouldZoom = true;
  }

  @Watch('colors')
  @Watch('colorPalette')
  colorsWatcher(_new, _old) {
    this.shouldSetColors = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
  }

  @Watch('showTooltip')
  showTooltipWatcher(_new, _old) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('tooltipLabel')
  tooltipLabelWatcher(_new, _old) {
    this.shouldUpdateTableData = true;
  }

  @Watch('hoverOpacity')
  hoverOpacityWatcher(_new, _old) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('clickStyle')
  @Watch('hoverStyle')
  interactionStyleWatcher(_new, _old) {
    this.shouldDrawInteractionState = true;
    this.shouldSetTextures = true;
    this.shouldSetStrokes = true;
    this.shouldSetColors = true;
  }

  @Watch('cursor')
  cursorWatcher(_new, _old) {
    this.shouldUpdateCursor = true;
  }

  @Watch('clickHighlight')
  clickWatcher(_new, _old) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('hoverHighlight')
  hoverWatcher(_new, _old) {
    this.shouldDrawInteractionState = true;
  }

  @Watch('zoomToNode')
  zoomWatcher(_new, _old) {
    this.shouldZoom = true;
  }

  @Watch('interactionKeys')
  interactionWatcher(_new, _old) {
    this.shouldValidateInteractionKeys = true;
    this.shouldUpdateTableData = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetGeometryAriaLabels = true;
  }

  @Watch('dataLabel')
  labelWatcher(_new, _old) {
    this.shouldUpdateTableData = true;
    this.shouldUpdateLabels = true;
    this.shouldAddStrokeUnder = true;
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
    const newStrokes = _newVal && _newVal.hideStrokes ? _newVal.hideStrokes : false;
    const oldStrokes = _oldVal && _oldVal.hideStrokes ? _oldVal.hideStrokes : false;
    if (newStrokes !== oldStrokes) {
      this.shouldSetStrokes = true;
      this.shouldDrawInteractionState = true;
    }
  }

  @Watch('annotations')
  annotationsWatcher(_new, _old) {
    this.shouldValidate = true;
    this.shouldUpdateAnnotations = true;
  }

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID || 'circle-pack-' + uuid();
    this.circlePackingEl.id = this.chartID;
    this.shouldValidate = true;
    this.shouldUpdateDescriptionWrapper = true;
    this.shouldSetParentSVGAccessibility = true;
    this.shouldSetTextures = true;
    this.shouldDrawInteractionState = true;
    this.shouldSetStrokes = true;
    this.shouldSetTextStrokes = true;
    this.shouldSetIDs = true;
  }

  @Watch('suppressEvents')
  suppressWatcher(_newVal, _oldVal) {
    this.shouldBindInteractivity = true;
    this.shouldUpdateCursor = true;
  }

  componentWillLoad() {
    return new Promise(resolve => {
      this.duration = 0;
      this.chartID = this.uniqueID || 'circle-pack-' + uuid();
      this.circlePackingEl.id = this.chartID;
      this.setTagLevels();
      this.validateInteractionKeys();
      this.setTableData();
      this.setLayoutData();
      this.restructureData();
      this.shouldValidateAccessibilityProps();
      this.setColors();
      resolve('component will load');
    });
  }

  componentWillUpdate() {
    // NEVER put items in this method (until stencil bug is resolved)
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
      this.prepareChartForDrawing();
      this.reSetRoot();
      this.setTextures();
      this.setStrokes();
      this.setTextStrokes();
      this.updateDisplayDepth();
      this.enterUpdateExitCircles(this.circleG, this.filterData(this.currentDepth));
      const target = this.getZoomTarget();
      this.drawZoomChildren(target);
      this.setGlobalSelections();
      this.setChartCountAccessibility();
      this.setGeometryAccessibilityAttributes();
      this.setGeometryAriaLabels();
      this.addStrokeUnder();
      this.zoom(target);
      this.drawAnnotations();
      this.onChangeHandler();
      // we want to hide all child <g> of this.root BUT we want to make sure not to hide the
      // parent<g> that contains our geometries! In a subGroup chart (like stacked bars),
      // we want to pass the PARENT of all the <g>s that contain bars
      hideNonessentialGroups(this.root.node(), this.circleG.node(), true);
      // this.setGroupAccessibilityAttributes();
      // this.setGroupAccessibilityLabel();
      this.duration = 750;
      resolve('component did load');
    });
  }

  componentDidUpdate() {
    return new Promise(resolve => {
      // the following function always runs, no matter what prop changed
      this.prepareChartForDrawing();

      if (this.shouldResetRoot) {
        this.reSetRoot();
        this.shouldResetRoot = false;
      }
      if (this.shouldSetColors) {
        this.setColors();
        this.shouldSetColors = false;
      }
      if (this.shouldSetTextures) {
        this.setTextures();
        this.shouldSetTextures = false;
      }
      if (this.shouldSetStrokes) {
        this.setStrokes();
        this.shouldSetStrokes = false;
      }
      if (this.shouldSetTextStrokes) {
        this.setTextStrokes();
        this.shouldSetTextStrokes = false;
      }
      if (this.shouldSetIDs) {
        this.setIDs();
        this.shouldSetIDs = false;
      }
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
      if (this.shouldUpdateDisplayDepth) {
        this.updateDisplayDepth();
        this.shouldUpdateDisplayDepth = false;
      }

      if (this.shouldZoom) {
        const target = this.getZoomTarget();
        this.drawZoomChildren(target);
        this.setGlobalSelections();
        this.zoom(target);
        this.shouldZoom = false;
      } else if (this.shouldUpdateLabels) {
        const target = this.getZoomTarget();
        if (target.children && target.children.length) {
          this.setLabelSelections(target.children);
        }
        this.shouldUpdateLabels = false;
      }
      if (this.shouldAddStrokeUnder) {
        this.addStrokeUnder();
        this.shouldAddStrokeUnder = false;
      }
      // if (this.shouldUpdateCursor || this.shouldDrawInteractionState) {
      //   this.setGlobalSelections();
      // }
      if (this.shouldSetGeometryAccessibilityAttributes) {
        this.setGeometryAccessibilityAttributes();
        this.shouldSetGeometryAccessibilityAttributes = false;
      }
      if (this.shouldSetGeometryAriaLabels) {
        this.setGeometryAriaLabels();
        this.shouldSetGeometryAriaLabels = false;
      }
      if (this.shouldBindInteractivity) {
        this.bindInteractivity();
        this.shouldBindInteractivity = false;
      }
      if (this.shouldDrawInteractionState) {
        this.updateInteractionState();
        this.shouldDrawInteractionState = false;
      }
      if (this.shouldUpdateCursor) {
        this.updateCursor();
        this.shouldUpdateCursor = false;
      }
      if (this.shouldUpdateAnnotations) {
        this.drawAnnotations();
        this.shouldUpdateAnnotations = false;
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

  setTableData() {
    // generate scoped and formatted data for data-table component
    const keys = scopeDataKeys(this, chartAccessors, 'circle-packing');
    this.tableData = getScopedData(this.data, keys);
    this.tableColumns = Object.keys(keys);
  }

  setLayoutData() {
    this.padding = typeof this.padding === 'string' ? getPadding(this.padding) : this.padding;

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  restructureData() {
    this.diameter = Math.min(this.innerPaddedWidth, this.innerPaddedHeight);

    this.holder = hierarchy
      .stratify()
      .id(d => d[this.nodeAccessor])
      .parentId(d => d[this.parentAccessor])(this.data);

    this.rootCircle = hierarchy
      .hierarchy(this.holder)
      .sum(d => d.data[this.sizeAccessor] || 1)
      .sort((a, b) => b.data.value - a.data.value);

    // this.focus = this.focus || this.rootCircle;
    this.nodes = hierarchy
      .pack()
      .size([this.diameter - this.circlePadding, this.diameter - this.circlePadding])
      .padding(this.circlePadding)(this.rootCircle)
      .descendants();
    this.innerDataDepth = this.dataDepth
      ? Math.min(max(this.nodes, d => d.depth), this.dataDepth)
      : max(this.nodes, d => d.depth);

    this.nodes = this.nodes.filter(d => !(d.depth > this.innerDataDepth));
  }

  validateInteractionKeys() {
    this.innerInteractionKeys =
      !this.interactionKeys || (this.interactionKeys && this.interactionKeys.length === 0)
        ? [this.nodeAccessor]
        : [...this.interactionKeys];
  }

  prepareChartForDrawing() {
    const validId = this.zoomToNode ? this.generateValidId(this.zoomToNode[this.nodeAccessor]) : '';
    const target = this.zoomToNode ? this.rootG.select('#circle-in-pack-' + validId).data()[0] : this.rootCircle;
    this.view = !this.view ? [target.x, target.y, target.r * 2] : this.view;
    this.zoomRatio = !this.zoomRatio ? this.diameter / this.view[2] : this.zoomRatio;
    this.currentDepth = target.depth;
  }

  renderRootElements() {
    this.svg = select(this.circlePackingEl)
      .select('.visa-viz-circle-packing-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('data-testid', 'root-svg');

    this.root = this.svg
      .append('g')
      .attr('id', 'visa-viz-margin-container-g-' + this.chartID)
      .attr('data-testid', 'margin-container');

    this.rootG = this.root
      .append('g')
      .attr('id', 'visa-viz-padding-container-g-' + this.chartID)
      .attr('data-testid', 'padding-container');

    this.circleG = this.rootG
      .append('g')
      .attr('class', 'circle-pack-group')
      .attr('data-testid', 'circle-group');

    this.textG = this.rootG
      .append('g')
      .attr('class', 'circle-pack-text-group')
      .attr('data-testid', 'dataLabel-group');

    this.tooltipG = select(this.circlePackingEl).select('.circle-packing-tooltip');
  }

  reSetRoot() {
    this.svg
      .transition('root_reset')
      .duration(this.duration)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root
      .transition('root_reset')
      .duration(this.duration)
      .attr('transform', `translate(${this.diameter / 2 + this.margin.left}, ${this.diameter / 2 + this.margin.top})`);

    this.rootG
      .transition('root_reset')
      .duration(this.duration)
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);

    if (typeof this.filter !== 'undefined') {
      this.enterUpdateExitCircles(this.circleG, this.filterData(0));
    }

    setAccessibilityDescriptionWidth(this.chartID, this.width);
  }

  setGlobalSelections() {
    this.circle = this.rootG.selectAll('circle:not(.vcl-accessibility-focus-highlight)');
  }

  enterUpdateExitCircles(root, data) {
    const depth = data[0].depth;
    const dataBoundToGeometries = root.selectAll('.g-level-' + depth).data(data, d => d.data.id);

    this.enterCircle = dataBoundToGeometries.enter().append('g');
    this.enterSize += this.enterCircle.size();
    this.exitCircle = dataBoundToGeometries.exit();

    this.enterCircles(depth);
    this.exitCircles(this.exitCircle, true);

    this.updateParentCircle = dataBoundToGeometries.merge(this.enterCircle);
    this.updateParentCircle.order();

    this.checkRecursion(depth);
  }

  setCircleFilter = (_, i, n) => {
    return !select(n[i]).classed('moving') && !this.accessibility.hideStrokes ? this.filter : null;
  };

  setIDs = () => {
    this.rootG.selectAll('circle:not(.vcl-accessibility-focus-highlight)').attr('id', d => {
      return 'circle-in-pack-' + this.generateValidId(d.data.id);
    });
  };

  generateValidId = inputId => {
    const id = inputId instanceof Date ? inputId.getTime() : inputId;
    return (id + '-' + this.chartID).replace(/\W/g, '-');
  };

  enterCircles(depth) {
    this.enterCircle.attr('class', 'g-level-' + depth).attr('id', d => {
      return 'circle-in-pack-' + this.generateValidId(d.data.id);
    });

    this.enterCircle
      .append('circle')
      .attr('filter', this.setCircleFilter)
      .classed('node node-level-' + depth, true)
      .classed('node--root', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        return !d.parent;
      })
      .on(
        'mouseover',
        !this.suppressEvents
          ? (_, i, n) => {
              const d = select(n[i].parentNode).datum();
              this.onHoverHandler(d);
            }
          : null
      )
      .on(
        'mouseout',
        !this.suppressEvents
          ? () => {
              this.onMouseOutHandler();
            }
          : null
      )
      .on(
        'click',
        !this.suppressEvents
          ? (_, i, n) => {
              const d = select(n[i].parentNode).datum();
              if (!this.zooming) {
                this.clickFunc.emit({ ...d.data.data });
              }
            }
          : null
      )
      .attr('fill', this.setCircleStyle)
      .attr('opacity', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        const dataObj = d.data.data;
        return checkInteraction(
          dataObj,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      })
      .each((_d, i, n) => {
        initializeGeometryAccess({
          node: n[i],
          recursive: true
        });
        setGeometryAccessLabel({
          node: n[i],
          geomType: 'node',
          includeKeyNames: this.accessibility.includeDataKeyNames,
          dataKeys: scopeDataKeys(this, chartAccessors, 'circle-packing'),
          recursive: true,
          groupName: 'node',
          uniqueID: this.chartID
          // groupKeys: ["sum"], // circle-packing doesn't use this, so it can be omitted
          // nested: true, // circle-packing doesn't use this, so it can be omitted
        });
        const d = select(n[i].parentNode).datum();
        let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
        const selectable = this.accessibility.elementsAreInterface;
        setElementInteractionAccessState(n[i], selected, selectable);
      })
      .attr('data-testid', 'circle')
      .attr('data-id', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        const dataObj = d.data.data;
        return `circle-${dataObj[this.parentAccessor]}-${dataObj[this.nodeAccessor]}`;
      })
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr(
        'transform',
        d =>
          'translate(' +
          roundTo((d.x - this.view[0]) * this.zoomRatio, 4) +
          ',' +
          roundTo((d.y - this.view[1]) * this.zoomRatio, 4) +
          ')'
      )
      .attr('r', 0);
  }

  exitCircles(group, checkRecursive) {
    // const exitSelection = (group, checkRecursive) => {
    if (group.size()) {
      this.exitSize += group.size();
      if (checkRecursive) {
        this.exitSize += group.selectAll('g').size();
      }
      // before we exit geometries, we need to check if a focus exists or not
      const focusDidExist = checkAccessFocus(this.rootG.node());
      // then we must remove the exiting elements
      group.remove();
      // then our util can count geometries
      this.setChartCountAccessibility();
      // our group's label should update with new counts too
      // this.setGroupAccessibilityLabel();
      // since items exited, labels must receive updated values
      this.setGeometryAriaLabels();
      // and also make sure the user's focus isn't lost
      retainAccessFocus({
        parentGNode: this.rootG.node(),
        focusDidExist,
        recursive: true
      });
    }
  }

  checkRecursion(depth) {
    this.updateParentCircle.each((d, i, n) => {
      const updateDepth = this.currentDepth + this.innerDisplayDepth;
      let nextDepth = 0;
      if (d.depth + 1 <= updateDepth) {
        nextDepth = depth + 1;
      }
      if (nextDepth && d.children && d.children.length) {
        this.enterUpdateExitCircles(select(n[i]), d.children);
      } else {
        this.exitCircles(select(n[i]).selectAll('g'), false);
      }
    });
  }

  setLabelSelections(data) {
    // drawLabels(data) {
    const dataBoundToLabels = this.textG.selectAll('text').data(data, d => (d.data || {}).id);
    this.enterText = dataBoundToLabels.enter().append('text');
    this.updateText = dataBoundToLabels.merge(this.enterText);
    this.exitText = dataBoundToLabels.exit().remove();

    this.enterLabels();
    this.drawLabels();
    // this.updateText.exit().remove();
  }

  enterLabels() {
    this.enterText
      .attr('filter', this.textFilter)
      .attr('class', 'label circle-packing-dataLabel')
      .attr('cursor', !this.suppressEvents ? this.cursor : null)
      .attr('data-testid', 'dataLabel')
      .attr('data-x', d => roundTo((d.x - this.view[0]) * this.zoomRatio, 4))
      .attr('data-y', d => roundTo((d.y - this.view[1]) * this.zoomRatio, 4))
      .attr('transform', d => {
        return (
          'translate(' +
          roundTo((d.x - this.view[0]) * this.zoomRatio, 4) +
          ',' +
          roundTo((d.y - this.view[1]) * this.zoomRatio, 4) +
          ')'
        );
      })
      .attr('text-anchor', 'middle');
  }

  drawLabels() {
    this.updateText
      .attr('opacity', _ => {
        return this.dataLabel.visible ? 1 : 0;
      })
      .text(d =>
        this.dataLabel.labelAccessor ? d.data.data[this.dataLabel.labelAccessor] : d.data.data[this.nodeAccessor]
      );
    this.placeLabels();
  }

  placeLabels() {
    this.updateText
      .classed('moving', (d, i, n) => {
        const oldX = +select(n[i]).attr('data-x');
        const oldY = +select(n[i]).attr('data-y');
        const newX = roundTo((d.x - this.view[0]) * this.zoomRatio, 4);
        const newY = roundTo((d.y - this.view[1]) * this.zoomRatio, 4);
        return oldX !== newX || oldY !== newY;
      })
      .attr('data-x', d => roundTo((d.x - this.view[0]) * this.zoomRatio, 4))
      .attr('data-y', d => roundTo((d.y - this.view[1]) * this.zoomRatio, 4));

    this.updateText
      .filter('.moving')
      .attr('filter', null)
      .transition('place')
      .duration(this.duration)
      .attr('transform', d => {
        return (
          'translate(' +
          roundTo((d.x - this.view[0]) * this.zoomRatio, 4) +
          ',' +
          roundTo((d.y - this.view[1]) * this.zoomRatio, 4) +
          ')'
        );
      })
      .call(transitionEndAll, () => {
        this.updateText.classed('moving', false);
        setTimeout(() => {
          this.addStrokeUnder();
        }, 0);
      });
  }

  addStrokeUnder() {
    this.updateText.attr('filter', this.textFilter);
  }

  setTextStrokes() {
    this.textFilter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff'
    });
    this.filter = createTextStrokeFilter({
      root: this.svg.node(),
      id: this.chartID,
      color: '#ffffff',
      strokeSizeOverride: 1
    });
  }

  bindInteractivity() {
    this.circle
      .on(
        'mouseover',
        !this.suppressEvents
          ? (_, i, n) => {
              const d = select(n[i].parentNode).datum();
              this.onHoverHandler(d);
            }
          : null
      )
      .on(
        'mouseout',
        !this.suppressEvents
          ? () => {
              this.onMouseOutHandler();
            }
          : null
      )
      .on(
        'click',
        !this.suppressEvents
          ? (_, i, n) => {
              const d = select(n[i].parentNode).datum();
              if (!this.zooming) {
                this.clickFunc.emit({ ...d.data.data });
              }
            }
          : null
      );
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
    setAccessAnnotation(this.circlePackingEl, this.annotations);
  }

  setColors() {
    this.preparedColors = this.colors
      ? convertVisaColor(this.colors)
      : getColors(this.colorPalette, this.innerDataDepth + 1);
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
    // let i = 0
    this.strokes = [];
    this.preparedColors.forEach(color => {
      // const background = i ? this.preparedColors[i-1] : '#ffffff'
      this.strokes.push(getContrastingStroke(color));
      // i++
    });
  }

  updateDisplayDepth() {
    this.innerDisplayDepth = this.displayDepth
      ? Math.min(max(this.nodes, d => d.depth), this.displayDepth)
      : max(this.nodes, d => d.depth);
    if (this.circleG) {
      this.circleG.selectAll('g').each((d, i, n) => {
        if (d.depth > this.innerDisplayDepth) {
          this.exitSize++;
          this.exitSize += select(n[i])
            .selectAll('g')
            .size();
          select(n[i]).remove();
        }
      });
    }
  }

  updateCursor() {
    this.circle.attr('cursor', !this.suppressEvents ? this.cursor : null);
  }

  setCircleStyle = (_, i, n) => {
    const d = select(n[i].parentNode).datum();
    const dataObj = d.data.data;
    const defaultColor = this.colorArr[d.depth] || '#fff';
    // const previousColor = this.preparedColors[d.depth-1] || '#fff';
    const clicked = checkClicked(dataObj, this.clickHighlight, this.innerInteractionKeys);
    const hovered = checkHovered(dataObj, this.hoverHighlight, this.innerInteractionKeys);
    const baseColor =
      d.depth !== 0
        ? clicked && this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color || defaultColor
          : hovered && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color || defaultColor
          : defaultColor
        : defaultColor;
    select(n[i])
      .attr(
        'stroke',
        clicked
          ? getContrastingStroke(
              visaColors[this.clickStyle.color] || this.clickStyle.color || this.preparedColors[d.depth]
            )
          : hovered
          ? getContrastingStroke(
              visaColors[this.hoverStyle.color] || this.hoverStyle.color || this.preparedColors[d.depth]
            )
          : this.strokes[d.depth]
      )
      .attr(
        'stroke-width',
        clicked
          ? this.clickStyle.strokeWidth || 3
          : hovered
          ? this.hoverStyle.strokeWidth || 2
          : !this.accessibility.hideStrokes
          ? 1
          : 0
      )
      .attr('stroke-dasharray', hovered && !clicked ? '4 3' : '');
    return baseColor;
  };

  updateInteractionState() {
    this.circle
      .attr('fill', this.setCircleStyle)
      .attr('filter', this.setCircleFilter)
      .attr('opacity', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        const dataObj = d.data.data;
        return checkInteraction(
          dataObj,
          1,
          this.hoverOpacity,
          this.hoverHighlight,
          this.clickHighlight,
          this.innerInteractionKeys
        );
      })
      .each((_d, i, n) => {
        const d = select(n[i].parentNode).datum();
        let selected = checkInteraction(d, true, false, '', this.clickHighlight, this.innerInteractionKeys);
        selected = this.clickHighlight && this.clickHighlight.length ? selected : false;
        const selectable = this.accessibility.elementsAreInterface;
        setElementInteractionAccessState(n[i], selected, selectable);
      });
    if (!this.zooming) {
      retainAccessFocus({
        parentGNode: this.rootG.node(),
        recursive: true
      });
    }
  }

  drawZoomChildren(target) {
    if (target.children && target.children.length) {
      const validId = this.generateValidId(target.data.id);
      this.enterUpdateExitCircles(this.rootG.select('#circle-in-pack-' + validId), target.children);
      this.setLabelSelections(target.children);
    } else if (target) {
      this.setLabelSelections([target]);
    }
  }

  getZoomTarget() {
    const validId = this.zoomToNode ? this.generateValidId(this.zoomToNode[this.nodeAccessor]) : '';
    return this.zoomToNode ? this.rootG.select('#circle-in-pack-' + validId).datum() : this.rootCircle;
  }

  zoom(target) {
    this.zooming = true;
    this.view = [target.x, target.y, target.r * 2];
    this.zoomRatio = this.diameter / this.view[2];
    // property that only assigned once
    this.circle
      .classed('moving', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        const oldX = +select(n[i]).attr('data-x');
        const oldY = +select(n[i]).attr('data-y');
        const oldR = +select(n[i]).attr('r');
        const newX = roundTo((d.x - this.view[0]) * this.zoomRatio, 4);
        const newY = roundTo((d.y - this.view[1]) * this.zoomRatio, 4);
        const newR = d.r * this.zoomRatio;
        return oldR !== newR || oldX !== newX || oldY !== newY;
      })
      .attr('data-x', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        return roundTo((d.x - this.view[0]) * this.zoomRatio, 4);
      })
      .attr('data-y', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        return roundTo((d.y - this.view[1]) * this.zoomRatio, 4);
      });

    this.circle
      .filter('.moving')
      .attr('filter', null)
      .transition('zoom')
      .duration(this.duration)
      .attr('transform', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        return (
          'translate(' +
          roundTo((d.x - this.view[0]) * this.zoomRatio, 4) +
          ',' +
          roundTo((d.y - this.view[1]) * this.zoomRatio, 4) +
          ')'
        );
      })
      .attr('r', (_, i, n) => {
        const d = select(n[i].parentNode).datum();
        return d.r * this.zoomRatio;
      })
      .attrTween('x', (_, i, n) => {
        // we tween over an unused attribute so that it causes no reflow
        // but we can move the focus indicator with every frame of the animation
        // making a separate animation will cause the indicator to lag
        const focusSource = select(n[i]).classed('vcl-accessibility-focus-source');
        return () => {
          if (focusSource) {
            // only a single moving element needs this to run, if it even exists
            retainAccessFocus({
              parentGNode: this.rootG.node(),
              recursive: true
            });
          }
          return 0;
        };
      })
      .call(transitionEndAll, () => {
        this.zooming = false;
        this.circle.classed('moving', false);
        setTimeout(() => {
          this.circle.attr('filter', this.setCircleFilter);
        }, 0);
        // we call this one last time
        retainAccessFocus({
          parentGNode: this.rootG.node(),
          recursive: true
          // focusDidExist // this only matters for exiting selections
        });
      });

    this.placeLabels();
  }

  onHoverHandler(d) {
    overrideTitleTooltip(this.chartID, true);
    this.hoverFunc.emit(d.data.data);
    if (this.showTooltip) {
      this.eventsTooltip({ data: d.data.data, evt: event, isToShow: true });
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
      ordinalAccessor: this.nodeAccessor,
      groupAccessor: this.parentAccessor,
      valueAccessor: this.sizeAccessor,
      chartType: 'circle-packing'
    });
  }

  // new accessibility functions added here
  setTagLevels() {
    this.topLevel = findTagLevel(this.highestHeadingLevel);
    this.bottomLevel = findTagLevel(this.highestHeadingLevel, 3);
  }
  setChartDescriptionWrapper() {
    initializeDescriptionRoot({
      rootEle: this.circlePackingEl,
      geomType: 'node',
      title: this.accessibility.title || this.mainTitle,
      chartTag: 'circle-packing',
      uniqueID: this.chartID,
      groupName: 'node',
      recursive: true,
      redraw: this.shouldRedrawWrapper
    });
    this.shouldRedrawWrapper = false;
  }

  setParentSVGAccessibility() {
    setRootSVGAccess({
      node: this.svg.node(),
      chartTag: 'circle-packing',
      title: this.accessibility.title || this.mainTitle,
      description: this.subTitle,
      uniqueID: this.chartID,
      geomType: 'node',
      includeKeyNames: this.accessibility.includeDataKeyNames,
      dataKeys: scopeDataKeys(this, chartAccessors, 'circle-packing'),
      groupAccessor: this.parentAccessor,
      groupName: 'node',
      recursive: true
    });
  }

  setGeometryAccessibilityAttributes() {
    this.rootG.selectAll('.node').each((_d, i, n) => {
      initializeGeometryAccess({
        node: n[i],
        recursive: true
      });
    });
  }

  setGeometryAriaLabels() {
    const keys = scopeDataKeys(this, chartAccessors, 'circle-packing');
    this.rootG.selectAll('.node').each((_d, i, n) => {
      setGeometryAccessLabel({
        node: n[i],
        geomType: 'node',
        includeKeyNames: this.accessibility.includeDataKeyNames,
        dataKeys: keys,
        recursive: true,
        groupName: 'node',
        uniqueID: this.chartID
        // groupKeys: ["sum"], // circle-packing doesn't use this, so it can be omitted
        // nested: true, // circle-packing doesn't use this, so it can be omitted
      });
    });
  }

  // setGroupAccessibilityAttributes() {
  //   // if a component's <g> elements can enter/exit, this will need to be called in the
  //   // lifecycle more than just initially, like how setGeometryAccessibilityAttributes works
  //   initializeGroupAccess(this.bars.node());
  // }

  // setGroupAccessibilityLabel() {
  //   this.bars.each((_, i, n) => {
  //     setGroupAccessLabel({
  //       node: n[i],
  //       geomType: 'node',
  //       includeKeyNames: this.accessibility.includeDataKeyNames,
  //       groupName: 'node',
  //       groupAccessor: this.parentAccessor
  //       // isSubgroup: true, // circle-packing doesn't use this, so it can be omitted
  //       // groupKeys?: any // circle-packing doesn't use this, so it can be omitted
  //     });
  //   });
  // }

  setChartAccessibilityTitle() {
    setAccessTitle(this.circlePackingEl, this.accessibility.title || this.mainTitle);
  }

  setChartAccessibilitySubtitle() {
    setAccessSubtitle(this.circlePackingEl, this.subTitle);
  }

  setChartAccessibilityLongDescription() {
    setAccessLongDescription(this.circlePackingEl, this.accessibility.longDescription);
  }

  setChartAccessibilityExecutiveSummary() {
    setAccessExecutiveSummary(this.circlePackingEl, this.accessibility.executiveSummary);
  }

  setChartAccessibilityPurpose() {
    setAccessPurpose(this.circlePackingEl, this.accessibility.purpose);
  }

  setChartAccessibilityContext() {
    setAccessContext(this.circlePackingEl, this.accessibility.contextExplanation);
  }

  setChartAccessibilityStatisticalNotes() {
    setAccessStatistics(this.circlePackingEl, this.accessibility.statisticalNotes);
  }

  setChartCountAccessibility() {
    setAccessChartCounts({
      rootEle: this.circlePackingEl,
      parentGNode: this.circleG.node(), // pass the wrapper to <g> or geometries here, should be single node selection
      chartTag: 'circle-packing',
      geomType: 'node',
      groupName: 'node',
      recursive: true
    });
  }

  setChartAccessibilityStructureNotes() {
    setAccessStructure(this.circlePackingEl, this.accessibility.structureNotes);
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

  filterData(targetDepth) {
    return this.nodes.filter(d => {
      if (d.depth === targetDepth) {
        return true;
      }
      return false;
    });
  }

  render() {
    this.init();
    if (this.shouldSetTagLevels) {
      this.setTagLevels();
      this.shouldSetTagLevels = false;
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
    if (this.shouldUpdateLayout) {
      this.setLayoutData();
      this.shouldUpdateLayout = false;
    }
    if (this.shouldUpdateData) {
      this.restructureData();
      this.shouldUpdateData = false;
    }
    return (
      <div class="o-layout" data-testid="outer-layout">
        <div class="o-layout--chart" data-testid="layout-chart">
          <this.topLevel data-testid="main-title">{this.mainTitle}</this.topLevel>
          <this.bottomLevel class="visa-ui-text--instructions" data-testid="sub-title">
            {this.subTitle}
          </this.bottomLevel>
          <div class="visa-viz-circle-packing-container" data-testid="chart-container" />
          <div
            class="circle-packing-tooltip vcl-tooltip"
            data-testid="tooltip-container"
            style={{ display: this.showTooltip ? 'block' : 'none' }}
          />
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
    const keys = Object.keys(CirclePackingDefaultValues);
    let i = 0;
    const exceptions = {
      showTooltip: {
        exception: false
      },
      circlePadding: {
        exception: 0
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
      if (!(this[keys[i]] || exception) && !(CirclePackingDefaultValues[keys[i]] === this[keys[i]])) {
        // the following line was removed because it causes buggy behavior
        // we should reapproach how this util interacts with lifecycle
        // in a future refactor (currently causes 2 renders)
        // this.defaultsLoaded[keys[i]] = this.defaultsLoaded[keys[i]] === undefined ? true : false;
        this[keys[i]] = CirclePackingDefaultValues[keys[i]];
      }
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
