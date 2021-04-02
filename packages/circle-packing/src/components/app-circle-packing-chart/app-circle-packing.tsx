/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Event, EventEmitter, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
@Component({
  tag: 'app-circle-packing',
  styleUrl: 'app-circle-packing.scss'
})
export class AppCirclePacking {
  @State() data: any = [];
  @State() chartData: any;
  @State() stateTrigger: any = 0;
  @State() clickElement: any = [];
  @State() hoverElement: any = '';
  @State() bigClickElement: any = [];
  @State() bigHoverElement: any = '';
  // @State()
  @State() groupChartProp: any = [];
  @State() codeString: any = '';
  @State() value: any = 0; // this is for handling value changes for button to control which dataset to send
  @State() scatterAttribute: any;
  @State() scatterAttribute2: any;
  @State() barAttribute: any;
  @State() nodeAccessor: any = 'Type';
  @State() parentAccessor: any = 'Country';
  @State() sizeAccessor: any = 'value';
  @State() lineData: any;
  @State() pieData: any;
  @State() zoomTo: any;
  @State() bigZoomTo: any;
  @State() index: any = 1;
  @State() size: number = 500;
  @State() hellishData: any;
  @Event() updateComponent: EventEmitter;

  @State() accessibility: any = {
    longDescription:
      'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
    contextExplanation: 'This chart exists in a demo app created to let you quickly change props and see results',
    executiveSummary: 'The United States group has more children than the other two groups',
    purpose:
      'The purpose of this chart template is to test the functionality of a basic circle packing chart in the chart library',
    statisticalNotes: "This chart is using organizational data on Visa's product team",
    keyboardNavConfig: { disabled: false }
  };
  @State() suppressEvents: boolean = false;
  @Element()
  appEl: HTMLElement;
  height: any = 400;
  width: any = 400;
  dataLabel: any = { visible: true };
  bigDataLabel: any = { visible: true, labelAccessor: 'LastName' };
  bigClickStyle: any = {
    color: 'categorical_blue',
    stroke: 'base_grey',
    strokeWidth: 0.5,
    dashed: '3 1'
  };
  bigHoverStyle: any = {
    color: 'sec_yellow',
    strokeWidth: 1
  };
  bigTooltipLabel: any = {
    labelAccessor: ['DisplayName', 'Title', 'Department', 'Node Spread'],
    labelTitle: ['Name', 'Title', 'Department', 'Direct Reports'],
    format: []
  };
  bigAccessibility: any = {
    longDescription:
      'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
    contextExplanation: 'This chart exists in a demo app created to let you quickly change props and see results',
    executiveSummary: 'The United States group has more children than the other two groups',
    purpose:
      'The purpose of this chart template is to test the functionality of a basic circle packing chart in the chart library',
    statisticalNotes: "This chart is using organizational data on Visa's product team"
  };

  lifeCycleTestData = [];
  lifeCycleStates = [
    [
      { altType: 'ALL', altCountry: '', altValue: 42, id: 1, Type: 'World', Country: '', value: 7 },
      { altType: 'HAT', altCountry: 'ALL', altValue: 32, id: 2, Type: 'Mexico', Country: 'World', value: 50 },
      { altType: 'CAT', altCountry: 'ALL', altValue: 34, id: 3, Type: 'United States', Country: 'World', value: 25 },
      { altType: 'BAT', altCountry: 'ALL', altValue: 52, id: 4, Type: 'Canada', Country: 'World', value: 5 },
      { altType: 'a', altCountry: 'HAT', altValue: 15, id: 5, Type: 'A', Country: 'Mexico', value: 64 },
      { altType: 'b', altCountry: 'HAT', altValue: 34, id: 6, Type: 'B', Country: 'Mexico', value: 45 },
      { altType: 'c', altCountry: 'BAT', altValue: 63, id: 7, Type: 'C', Country: 'Canada', value: 13 },
      { altType: 'd', altCountry: 'BAT', altValue: 24, id: 8, Type: 'D', Country: 'Canada', value: 43 },
      { altType: 'e', altCountry: 'HAT', altValue: 34, id: 9, Type: 'E', Country: 'Mexico', value: 22 },
      { altType: 'f', altCountry: 'CAT', altValue: 44, id: 10, Type: 'F', Country: 'United States', value: 63 },
      { altType: 'g', altCountry: 'CAT', altValue: 62, id: 11, Type: 'G', Country: 'United States', value: 23 },
      { altType: 'h', altCountry: 'BAT', altValue: 22, id: 12, Type: 'H', Country: 'Canada', value: 39 },
      { altType: 'i', altCountry: 'CAT', altValue: 30, id: 13, Type: 'I', Country: 'United States', value: 40 }
    ],
    [
      { altType: 'ALL', altCountry: '', altValue: 42, id: 1, Type: 'World', Country: '', value: 70 },
      { altType: 'HAT', altCountry: 'ALL', altValue: 32, id: 2, Type: 'Mexico', Country: 'World', value: 50 },
      { altType: 'CAT', altCountry: 'ALL', altValue: 24, id: 3, Type: 'United States', Country: 'World', value: 25 },
      { altType: 'BAT', altCountry: 'ALL', altValue: 12, id: 4, Type: 'Canada', Country: 'World', value: 5 },
      { altType: 'a', altCountry: 'HAT', altValue: 45, id: 5, Type: 'A', Country: 'Mexico', value: 64 },
      { altType: 'b', altCountry: 'HAT', altValue: 34, id: 6, Type: 'B', Country: 'Mexico', value: 45 },
      { altType: 'c', altCountry: 'BAT', altValue: 13, id: 7, Type: 'C', Country: 'Canada', value: 83 },
      { altType: 'd', altCountry: 'BAT', altValue: 54, id: 8, Type: 'D', Country: 'Canada', value: 43 },
      { altType: 'e', altCountry: 'HAT', altValue: 14, id: 9, Type: 'E', Country: 'Mexico', value: 22 },
      { altType: 'f', altCountry: 'CAT', altValue: 24, id: 10, Type: 'F', Country: 'United States', value: 13 },
      { altType: 'g', altCountry: 'CAT', altValue: 32, id: 11, Type: 'G', Country: 'United States', value: 23 },
      { altType: 'h', altCountry: 'BAT', altValue: 62, id: 12, Type: 'H', Country: 'Canada', value: 39 },
      { altType: 'i', altCountry: 'CAT', altValue: 60, id: 13, Type: 'I', Country: 'United States', value: 40 }
    ],
    [
      { altType: 'ALL', altCountry: '', altValue: 12, id: 1, Type: 'World', Country: '', value: 7 },
      { altType: 'HAT', altCountry: 'ALL', altValue: 62, id: 2, Type: 'Mexico', Country: 'World', value: 50 },
      { altType: 'CAT', altCountry: 'ALL', altValue: 24, id: 3, Type: 'United States', Country: 'World', value: 25 },
      { altType: 'BAT', altCountry: 'ALL', altValue: 42, id: 4, Type: 'Canada', Country: 'World', value: 5 },
      { altType: 'a', altCountry: 'HAT', altValue: 45, id: 5, Type: 'A', Country: 'Mexico', value: 64 },
      { altType: 'b', altCountry: 'HAT', altValue: 34, id: 6, Type: 'B', Country: 'Mexico', value: 45 },
      { altType: 'f', altCountry: 'CAT', altValue: 24, id: 7, Type: 'C', Country: 'United States', value: 13 },
      { altType: 'd', altCountry: 'BAT', altValue: 54, id: 8, Type: 'D', Country: 'Canada', value: 43 },
      { altType: 'e', altCountry: 'HAT', altValue: 14, id: 9, Type: 'E', Country: 'Mexico', value: 22 },
      { altType: 'f', altCountry: 'CAT', altValue: 24, id: 10, Type: 'F', Country: 'United States', value: 63 },
      { altType: 'g', altCountry: 'CAT', altValue: 32, id: 11, Type: 'G', Country: 'United States', value: 23 },
      { altType: 'h', altCountry: 'BAT', altValue: 62, id: 12, Type: 'H', Country: 'Canada', value: 39 },
      { altType: 'i', altCountry: 'CAT', altValue: 60, id: 13, Type: 'I', Country: 'United States', value: 40 }
    ]
  ];
  circlePackComponentData: any = [
    { p: null, c: '@visa/circle-packing', cLabel: '@visa/circle-packing', v: 1 },
    { p: '@visa/circle-packing', c: 'import', cLabel: 'import', v: 1 },
    { p: 'import', c: '@stencil/core{Component}', cLabel: '@stencil/core{Component}', v: 1 },
    { p: 'import', c: '@stencil/core{Element}', cLabel: '@stencil/core{Element}', v: 1 },
    { p: 'import', c: '@stencil/core{Prop}', cLabel: '@stencil/core{Prop}', v: 1 },
    { p: 'import', c: '@stencil/core{h}', cLabel: '@stencil/core{h}', v: 1 },
    { p: 'import', c: '@stencil/core{Watch}', cLabel: '@stencil/core{Watch}', v: 1 },
    { p: 'import', c: '@stencil/core{Event}', cLabel: '@stencil/core{Event}', v: 1 },
    { p: 'import', c: '@stencil/core{EventEmitter}', cLabel: '@stencil/core{EventEmitter}', v: 1 },
    { p: 'import', c: '@visa/charts-types{IBoxModelType}', cLabel: '@visa/charts-types{IBoxModelType}', v: 1 },
    { p: 'import', c: '@visa/charts-types{IHoverStyleType}', cLabel: '@visa/charts-types{IHoverStyleType}', v: 1 },
    { p: 'import', c: '@visa/charts-types{IClickStyleType}', cLabel: '@visa/charts-types{IClickStyleType}', v: 1 },
    { p: 'import', c: '@visa/charts-types{IDataLabelType}', cLabel: '@visa/charts-types{IDataLabelType}', v: 1 },
    { p: 'import', c: '@visa/charts-types{ITooltipLabelType}', cLabel: '@visa/charts-types{ITooltipLabelType}', v: 1 },
    {
      p: 'import',
      c: '@visa/charts-types{IAccessibilityType}',
      cLabel: '@visa/charts-types{IAccessibilityType}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{getContrastingStroke}',
      cLabel: '@visa/visa-charts-utils{getContrastingStroke}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{createTextStrokeFilter}',
      cLabel: '@visa/visa-charts-utils{createTextStrokeFilter}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{convertColorsToTextures}',
      cLabel: '@visa/visa-charts-utils{convertColorsToTextures}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{initializeElementAccess}',
      cLabel: '@visa/visa-charts-utils{initializeElementAccess}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{initializeDescriptionRoot}',
      cLabel: '@visa/visa-charts-utils{initializeDescriptionRoot}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setElementFocusHandler}',
      cLabel: '@visa/visa-charts-utils{setElementFocusHandler}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessibilityController}',
      cLabel: '@visa/visa-charts-utils{setAccessibilityController}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{hideNonessentialGroups}',
      cLabel: '@visa/visa-charts-utils{hideNonessentialGroups}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessTitle}',
      cLabel: '@visa/visa-charts-utils{setAccessTitle}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessSubtitle}',
      cLabel: '@visa/visa-charts-utils{setAccessSubtitle}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessLongDescription}',
      cLabel: '@visa/visa-charts-utils{setAccessLongDescription}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessExecutiveSummary}',
      cLabel: '@visa/visa-charts-utils{setAccessExecutiveSummary}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessPurpose}',
      cLabel: '@visa/visa-charts-utils{setAccessPurpose}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessContext}',
      cLabel: '@visa/visa-charts-utils{setAccessContext}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessStatistics}',
      cLabel: '@visa/visa-charts-utils{setAccessStatistics}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessChartCounts}',
      cLabel: '@visa/visa-charts-utils{setAccessChartCounts}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessStructure}',
      cLabel: '@visa/visa-charts-utils{setAccessStructure}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessAnnotation}',
      cLabel: '@visa/visa-charts-utils{setAccessAnnotation}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{retainAccessFocus}',
      cLabel: '@visa/visa-charts-utils{retainAccessFocus}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{checkAccessFocus}',
      cLabel: '@visa/visa-charts-utils{checkAccessFocus}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setElementInteractionAccessState}',
      cLabel: '@visa/visa-charts-utils{setElementInteractionAccessState}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{drawTooltip}', cLabel: '@visa/visa-charts-utils{drawTooltip}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{setAccessibilityDescriptionWidth}',
      cLabel: '@visa/visa-charts-utils{setAccessibilityDescriptionWidth}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{annotate}', cLabel: '@visa/visa-charts-utils{annotate}', v: 1 },
    { p: 'import', c: '@visa/visa-charts-utils{getPadding}', cLabel: '@visa/visa-charts-utils{getPadding}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{chartAccessors}',
      cLabel: '@visa/visa-charts-utils{chartAccessors}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{checkInteraction}',
      cLabel: '@visa/visa-charts-utils{checkInteraction}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{checkClicked}', cLabel: '@visa/visa-charts-utils{checkClicked}', v: 1 },
    { p: 'import', c: '@visa/visa-charts-utils{checkHovered}', cLabel: '@visa/visa-charts-utils{checkHovered}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{convertVisaColor}',
      cLabel: '@visa/visa-charts-utils{convertVisaColor}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{getColors}', cLabel: '@visa/visa-charts-utils{getColors}', v: 1 },
    { p: 'import', c: '@visa/visa-charts-utils{getLicenses}', cLabel: '@visa/visa-charts-utils{getLicenses}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{getScopedData}',
      cLabel: '@visa/visa-charts-utils{getScopedData}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{initTooltipStyle}',
      cLabel: '@visa/visa-charts-utils{initTooltipStyle}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{transitionEndAll}',
      cLabel: '@visa/visa-charts-utils{transitionEndAll}',
      v: 1
    },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{overrideTitleTooltip}',
      cLabel: '@visa/visa-charts-utils{overrideTitleTooltip}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{roundTo}', cLabel: '@visa/visa-charts-utils{roundTo}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{scopeDataKeys}',
      cLabel: '@visa/visa-charts-utils{scopeDataKeys}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{visaColors}', cLabel: '@visa/visa-charts-utils{visaColors}', v: 1 },
    {
      p: 'import',
      c: '@visa/visa-charts-utils{validateAccessibilityProps}',
      cLabel: '@visa/visa-charts-utils{validateAccessibilityProps}',
      v: 1
    },
    { p: 'import', c: '@visa/visa-charts-utils{findTagLevel}', cLabel: '@visa/visa-charts-utils{findTagLevel}', v: 1 },
    { p: 'import', c: 'd3-selection{select}', cLabel: 'd3-selection{select}', v: 1 },
    { p: 'import', c: 'd3-selection{event}', cLabel: 'd3-selection{event}', v: 1 },
    { p: 'import', c: 'd3-array{max}', cLabel: 'd3-array{max}', v: 1 },
    { p: 'import', c: 'd3-transition{*}', cLabel: 'd3-transition{*}', v: 1 },
    { p: 'import', c: 'd3-hierarchy{hierarchy}', cLabel: 'd3-hierarchy{hierarchy}', v: 1 },
    { p: 'import', c: 'uuid{v4}', cLabel: 'uuid{v4}', v: 1 },
    { p: '@visa/circle-packing', c: '@Event', cLabel: '@Event', v: 1 },
    { p: '@Event', c: 'clickFunc', cLabel: 'clickFunc', v: 1 },
    { p: '@Event', c: 'hoverFunc', cLabel: 'hoverFunc', v: 1 },
    { p: '@Event', c: 'mouseOutFunc', cLabel: 'mouseOutFunc', v: 1 },
    { p: '@visa/circle-packing', c: '@Prop', cLabel: '@Prop', v: 1 },
    { p: '@Prop', c: 'mainTitle', cLabel: 'mainTitle', v: 1 },
    { p: '@Prop', c: 'subTitle', cLabel: 'subTitle', v: 1 },
    { p: '@Prop', c: 'height', cLabel: 'height', v: 1 },
    { p: '@Prop', c: 'width', cLabel: 'width', v: 1 },
    { p: '@Prop', c: 'margin', cLabel: 'margin', v: 1 },
    { p: '@Prop', c: 'padding', cLabel: 'padding', v: 1 },
    { p: '@Prop', c: 'circlePadding', cLabel: 'circlePadding', v: 1 },
    { p: '@Prop', c: 'highestHeadingLevel', cLabel: 'highestHeadingLevel', v: 1 },
    { p: '@Prop', c: 'data', cLabel: 'data', v: 1 },
    { p: '@Prop', c: 'uniqueID', cLabel: 'uniqueID', v: 1 },
    { p: '@Prop', c: 'dataDepth', cLabel: 'dataDepth', v: 1 },
    { p: '@Prop', c: 'displayDepth', cLabel: 'displayDepth', v: 1 },
    { p: '@Prop', c: 'parentAccessor', cLabel: 'parentAccessor', v: 1 },
    { p: '@Prop', c: 'nodeAccessor', cLabel: 'nodeAccessor', v: 1 },
    { p: '@Prop', c: 'sizeAccessor', cLabel: 'sizeAccessor', v: 1 },
    { p: '@Prop', c: 'colorPalette', cLabel: 'colorPalette', v: 1 },
    { p: '@Prop', c: 'colors', cLabel: 'colors', v: 1 },
    { p: '@Prop', c: 'cursor', cLabel: 'cursor', v: 1 },
    { p: '@Prop', c: 'hoverStyle', cLabel: 'hoverStyle', v: 1 },
    { p: '@Prop', c: 'clickStyle', cLabel: 'clickStyle', v: 1 },
    { p: '@Prop', c: 'hoverOpacity', cLabel: 'hoverOpacity', v: 1 },
    { p: '@Prop', c: 'showTooltip', cLabel: 'showTooltip', v: 1 },
    { p: '@Prop', c: 'tooltipLabel', cLabel: 'tooltipLabel', v: 1 },
    { p: '@Prop', c: 'dataLabel', cLabel: 'dataLabel', v: 1 },
    { p: '@Prop', c: 'annotations', cLabel: 'annotations', v: 1 },
    { p: '@Prop', c: 'accessibility', cLabel: 'accessibility', v: 1 },
    { p: '@Prop', c: 'suppressEvents', cLabel: 'suppressEvents', v: 1 },
    { p: '@Prop', c: 'interactionKeys', cLabel: 'interactionKeys', v: 1 },
    { p: '@Prop', c: 'hoverHighlight', cLabel: 'hoverHighlight', v: 1 },
    { p: '@Prop', c: 'clickHighlight', cLabel: 'clickHighlight', v: 1 },
    { p: '@Prop', c: 'zoomToNode', cLabel: 'zoomToNode', v: 1 },
    { p: '@visa/circle-packing', c: '@Element', cLabel: '@Element', v: 1 },
    { p: '@Element', c: 'circlePackingEl', cLabel: 'circlePackingEl', v: 1 },
    { p: '@Element', c: 'shouldValidateAccessibility', cLabel: 'shouldValidateAccessibility', v: 1 },
    { p: '@Element', c: 'svg', cLabel: 'svg', v: 1 },
    { p: '@Element', c: 'root', cLabel: 'root', v: 1 },
    { p: '@Element', c: 'rootG', cLabel: 'rootG', v: 1 },
    { p: '@Element', c: 'duration', cLabel: 'duration', v: 1 },
    { p: '@Element', c: 'innerHeight', cLabel: 'innerHeight', v: 1 },
    { p: '@Element', c: 'innerWidth', cLabel: 'innerWidth', v: 1 },
    { p: '@Element', c: 'innerPaddedHeight', cLabel: 'innerPaddedHeight', v: 1 },
    { p: '@Element', c: 'innerPaddedWidth', cLabel: 'innerPaddedWidth', v: 1 },
    { p: '@Element', c: 'current', cLabel: 'current', v: 1 },
    { p: '@Element', c: 'circle', cLabel: 'circle', v: 1 },
    { p: '@Element', c: 'circleG', cLabel: 'circleG', v: 1 },
    { p: '@Element', c: 'enterCircle', cLabel: 'enterCircle', v: 1 },
    { p: '@Element', c: 'exitCircle', cLabel: 'exitCircle', v: 1 },
    { p: '@Element', c: 'updateParentCircle', cLabel: 'updateParentCircle', v: 1 },
    { p: '@Element', c: 'enterText', cLabel: 'enterText', v: 1 },
    { p: '@Element', c: 'updateText', cLabel: 'updateText', v: 1 },
    { p: '@Element', c: 'exitText', cLabel: 'exitText', v: 1 },
    { p: '@Element', c: 'tooltipG', cLabel: 'tooltipG', v: 1 },
    { p: '@Element', c: 'nodes', cLabel: 'nodes', v: 1 },
    { p: '@Element', c: 'view', cLabel: 'view', v: 1 },
    { p: '@Element', c: 'zoomRatio', cLabel: 'zoomRatio', v: 1 },
    { p: '@Element', c: 'text', cLabel: 'text', v: 1 },
    { p: '@Element', c: 'textG', cLabel: 'textG', v: 1 },
    { p: '@Element', c: 'focus', cLabel: 'focus', v: 1 },
    { p: '@Element', c: 'colorArr', cLabel: 'colorArr', v: 1 },
    { p: '@Element', c: 'preparedColors', cLabel: 'preparedColors', v: 1 },
    { p: '@Element', c: 'rootCircle', cLabel: 'rootCircle', v: 1 },
    { p: '@Element', c: 'enter', cLabel: 'enter', v: 1 },
    { p: '@Element', c: 'holder', cLabel: 'holder', v: 1 },
    { p: '@Element', c: 'diameter', cLabel: 'diameter', v: 1 },
    { p: '@Element', c: 'currentDepth', cLabel: 'currentDepth', v: 1 },
    { p: '@Element', c: 'zooming', cLabel: 'zooming', v: 1 },
    { p: '@Element', c: 'timer', cLabel: 'timer', v: 1 },
    { p: '@Element', c: 'delay', cLabel: 'delay', v: 1 },
    { p: '@Element', c: 'prevent', cLabel: 'prevent', v: 1 },
    { p: '@Element', c: 'tableData', cLabel: 'tableData', v: 1 },
    { p: '@Element', c: 'tableColumns', cLabel: 'tableColumns', v: 1 },
    { p: '@Element', c: 'updated', cLabel: 'updated', v: 1 },
    { p: '@Element', c: 'exitSize', cLabel: 'exitSize', v: 1 },
    { p: '@Element', c: 'enterSize', cLabel: 'enterSize', v: 1 },
    { p: '@Element', c: 'textFilter', cLabel: 'textFilter', v: 1 },
    { p: '@Element', c: 'filter', cLabel: 'filter', v: 1 },
    { p: '@Element', c: 'innerDisplayDepth', cLabel: 'innerDisplayDepth', v: 1 },
    { p: '@Element', c: 'innerDataDepth', cLabel: 'innerDataDepth', v: 1 },
    { p: '@Element', c: 'chartID', cLabel: 'chartID', v: 1 },
    { p: '@Element', c: 'shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: '@Element', c: 'shouldValidateInteractionKeys', cLabel: 'shouldValidateInteractionKeys', v: 1 },
    { p: '@Element', c: 'shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: '@Element', c: 'shouldUpdateClickFunc', cLabel: 'shouldUpdateClickFunc', v: 1 },
    { p: '@Element', c: 'shouldUpdateHoverFunc', cLabel: 'shouldUpdateHoverFunc', v: 1 },
    { p: '@Element', c: 'shouldUpdateMouseoutFunc', cLabel: 'shouldUpdateMouseoutFunc', v: 1 },
    { p: '@Element', c: 'shouldUpdateAnnotations', cLabel: 'shouldUpdateAnnotations', v: 1 },
    { p: '@Element', c: 'shouldResetRoot', cLabel: 'shouldResetRoot', v: 1 },
    { p: '@Element', c: 'shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    { p: '@Element', c: 'shouldUpdateDisplayDepth', cLabel: 'shouldUpdateDisplayDepth', v: 1 },
    { p: '@Element', c: 'shouldUpdateLabels', cLabel: 'shouldUpdateLabels', v: 1 },
    { p: '@Element', c: 'shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: '@Element', c: 'shouldUpdateCursor', cLabel: 'shouldUpdateCursor', v: 1 },
    { p: '@Element', c: 'shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: '@Element', c: 'shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: '@Element', c: 'shouldValidate', cLabel: 'shouldValidate', v: 1 },
    { p: '@Element', c: 'shouldBindInteractivity', cLabel: 'shouldBindInteractivity', v: 1 },
    { p: '@Element', c: 'shouldUpdateDescriptionWrapper', cLabel: 'shouldUpdateDescriptionWrapper', v: 1 },
    { p: '@Element', c: 'shouldSetChartAccessibilityTitle', cLabel: 'shouldSetChartAccessibilityTitle', v: 1 },
    { p: '@Element', c: 'shouldSetChartAccessibilitySubtitle', cLabel: 'shouldSetChartAccessibilitySubtitle', v: 1 },
    {
      p: '@Element',
      c: 'shouldSetChartAccessibilityLongDescription',
      cLabel: 'shouldSetChartAccessibilityLongDescription',
      v: 1
    },
    {
      p: '@Element',
      c: 'shouldSetChartAccessibilityExecutiveSummary',
      cLabel: 'shouldSetChartAccessibilityExecutiveSummary',
      v: 1
    },
    {
      p: '@Element',
      c: 'shouldSetChartAccessibilityStatisticalNotes',
      cLabel: 'shouldSetChartAccessibilityStatisticalNotes',
      v: 1
    },
    {
      p: '@Element',
      c: 'shouldSetChartAccessibilityStructureNotes',
      cLabel: 'shouldSetChartAccessibilityStructureNotes',
      v: 1
    },
    { p: '@Element', c: 'shouldSetParentSVGAccessibility', cLabel: 'shouldSetParentSVGAccessibility', v: 1 },
    {
      p: '@Element',
      c: 'shouldSetGeometryAccessibilityAttributes',
      cLabel: 'shouldSetGeometryAccessibilityAttributes',
      v: 1
    },
    { p: '@Element', c: 'shouldSetGeometryAriaLabels', cLabel: 'shouldSetGeometryAriaLabels', v: 1 },
    {
      p: '@Element',
      c: 'shouldSetGroupAccessibilityAttributes',
      cLabel: 'shouldSetGroupAccessibilityAttributes',
      v: 1
    },
    { p: '@Element', c: 'shouldSetGroupAccessibilityLabel', cLabel: 'shouldSetGroupAccessibilityLabel', v: 1 },
    { p: '@Element', c: 'shouldSetChartAccessibilityPurpose', cLabel: 'shouldSetChartAccessibilityPurpose', v: 1 },
    { p: '@Element', c: 'shouldSetChartAccessibilityContext', cLabel: 'shouldSetChartAccessibilityContext', v: 1 },
    { p: '@Element', c: 'shouldSetChartAccessibilityCount', cLabel: 'shouldSetChartAccessibilityCount', v: 1 },
    { p: '@Element', c: 'shouldUpdateLayout', cLabel: 'shouldUpdateLayout', v: 1 },
    { p: '@Element', c: 'shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: '@Element', c: 'shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: '@Element', c: 'shouldSetTextStrokes', cLabel: 'shouldSetTextStrokes', v: 1 },
    { p: '@Element', c: 'shouldSetTagLevels', cLabel: 'shouldSetTagLevels', v: 1 },
    { p: '@Element', c: 'shouldRedrawWrapper', cLabel: 'shouldRedrawWrapper', v: 1 },
    { p: '@Element', c: 'shouldSetIDs', cLabel: 'shouldSetIDs', v: 1 },
    { p: '@Element', c: 'innerInteractionKeys', cLabel: 'innerInteractionKeys', v: 1 },
    { p: '@Element', c: 'defaultsLoaded', cLabel: 'defaultsLoaded', v: 1 },
    { p: '@Element', c: 'bottomLevel', cLabel: 'bottomLevel', v: 1 },
    { p: '@Element', c: 'topLevel', cLabel: 'topLevel', v: 1 },
    { p: '@Element', c: 'strokes', cLabel: 'strokes', v: 1 },
    { p: 'data', c: 'dataWatcher', cLabel: 'dataWatcher', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.updated', cLabel: 'updated', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldValidate', cLabel: 'shouldValidate', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    {
      p: 'dataWatcher',
      c: 'dataWatcher.shouldSetGeometryAccessibilityAttributes',
      cLabel: 'shouldSetGeometryAccessibilityAttributes',
      v: 1
    },
    { p: 'dataWatcher', c: 'dataWatcher.shouldSetGeometryAriaLabels', cLabel: 'shouldSetGeometryAriaLabels', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'dataWatcher', c: 'dataWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    { p: 'mainTitle', c: 'titleWatcher', cLabel: 'titleWatcher', v: 1 },
    { p: 'titleWatcher', c: 'titleWatcher.shouldValidate', cLabel: 'shouldValidate', v: 1 },
    {
      p: 'titleWatcher',
      c: 'titleWatcher.shouldUpdateDescriptionWrapper',
      cLabel: 'shouldUpdateDescriptionWrapper',
      v: 1
    },
    {
      p: 'titleWatcher',
      c: 'titleWatcher.shouldSetChartAccessibilityTitle',
      cLabel: 'shouldSetChartAccessibilityTitle',
      v: 1
    },
    {
      p: 'titleWatcher',
      c: 'titleWatcher.shouldSetParentSVGAccessibility',
      cLabel: 'shouldSetParentSVGAccessibility',
      v: 1
    },
    { p: 'subTitle', c: 'subtitleWatcher', cLabel: 'subtitleWatcher', v: 1 },
    {
      p: 'subtitleWatcher',
      c: 'subtitleWatcher.shouldSetChartAccessibilitySubtitle',
      cLabel: 'shouldSetChartAccessibilitySubtitle',
      v: 1
    },
    {
      p: 'subtitleWatcher',
      c: 'subtitleWatcher.shouldSetParentSVGAccessibility',
      cLabel: 'shouldSetParentSVGAccessibility',
      v: 1
    },
    { p: 'highestHeadingLevel', c: 'headingWatcher', cLabel: 'headingWatcher', v: 1 },
    { p: 'headingWatcher', c: 'headingWatcher.shouldRedrawWrapper', cLabel: 'shouldRedrawWrapper', v: 1 },
    { p: 'headingWatcher', c: 'headingWatcher.shouldSetTagLevels', cLabel: 'shouldSetTagLevels', v: 1 },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityCount',
      cLabel: 'shouldSetChartAccessibilityCount',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldUpdateDescriptionWrapper',
      cLabel: 'shouldUpdateDescriptionWrapper',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityTitle',
      cLabel: 'shouldSetChartAccessibilityTitle',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilitySubtitle',
      cLabel: 'shouldSetChartAccessibilitySubtitle',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityLongDescription',
      cLabel: 'shouldSetChartAccessibilityLongDescription',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityContext',
      cLabel: 'shouldSetChartAccessibilityContext',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityExecutiveSummary',
      cLabel: 'shouldSetChartAccessibilityExecutiveSummary',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityPurpose',
      cLabel: 'shouldSetChartAccessibilityPurpose',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityStatisticalNotes',
      cLabel: 'shouldSetChartAccessibilityStatisticalNotes',
      v: 1
    },
    {
      p: 'headingWatcher',
      c: 'headingWatcher.shouldSetChartAccessibilityStructureNotes',
      cLabel: 'shouldSetChartAccessibilityStructureNotes',
      v: 1
    },
    { p: 'parentAccessor', c: 'clusterWatcher', cLabel: 'clusterWatcher', v: 1 },
    { p: 'clusterWatcher', c: 'clusterWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'clusterWatcher', c: 'clusterWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'clusterWatcher', c: 'clusterWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'clusterWatcher', c: 'clusterWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    {
      p: 'clusterWatcher',
      c: 'clusterWatcher.shouldSetGeometryAriaLabels',
      cLabel: 'shouldSetGeometryAriaLabels',
      v: 1
    },
    { p: 'clusterWatcher', c: 'clusterWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'nodeAccessor', c: 'nodeWatcher', cLabel: 'nodeWatcher', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldSetGeometryAriaLabels', cLabel: 'shouldSetGeometryAriaLabels', v: 1 },
    { p: 'nodeWatcher', c: 'nodeWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'sizeAccessor', c: 'sizeWatcher', cLabel: 'sizeWatcher', v: 1 },
    { p: 'sizeWatcher', c: 'sizeWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'sizeWatcher', c: 'sizeWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'sizeWatcher', c: 'sizeWatcher.shouldSetGeometryAriaLabels', cLabel: 'shouldSetGeometryAriaLabels', v: 1 },
    { p: 'sizeWatcher', c: 'sizeWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'height', c: 'heightWatcher', cLabel: 'heightWatcher', v: 1 },
    { p: 'width', c: 'widthWatcher', cLabel: 'widthWatcher', v: 1 },
    { p: 'padding', c: 'paddingWatcher', cLabel: 'paddingWatcher', v: 1 },
    { p: 'margin', c: 'marginWatcher', cLabel: 'marginWatcher', v: 1 },
    { p: 'heightWatcher', c: 'heightWatcher.shouldUpdateLayout', cLabel: 'shouldUpdateLayout', v: 1 },
    { p: 'heightWatcher', c: 'heightWatcher.shouldResetRoot', cLabel: 'shouldResetRoot', v: 1 },
    { p: 'heightWatcher', c: 'heightWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'heightWatcher', c: 'heightWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'heightWatcher', c: 'heightWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'widthWatcher', c: 'widthWatcher.shouldUpdateLayout', cLabel: 'shouldUpdateLayout', v: 1 },
    { p: 'widthWatcher', c: 'widthWatcher.shouldResetRoot', cLabel: 'shouldResetRoot', v: 1 },
    { p: 'widthWatcher', c: 'widthWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'widthWatcher', c: 'widthWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'widthWatcher', c: 'widthWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'paddingWatcher', c: 'paddingWatcher.shouldUpdateLayout', cLabel: 'shouldUpdateLayout', v: 1 },
    { p: 'paddingWatcher', c: 'paddingWatcher.shouldResetRoot', cLabel: 'shouldResetRoot', v: 1 },
    { p: 'paddingWatcher', c: 'paddingWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'paddingWatcher', c: 'paddingWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'paddingWatcher', c: 'paddingWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'marginWatcher', c: 'marginWatcher.shouldUpdateLayout', cLabel: 'shouldUpdateLayout', v: 1 },
    { p: 'marginWatcher', c: 'marginWatcher.shouldResetRoot', cLabel: 'shouldResetRoot', v: 1 },
    { p: 'marginWatcher', c: 'marginWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'marginWatcher', c: 'marginWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'marginWatcher', c: 'marginWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'dataDepth', c: 'dataDepthWatcher', cLabel: 'dataDepthWatcher', v: 1 },
    { p: 'dataDepthWatcher', c: 'dataDepthWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'dataDepthWatcher', c: 'dataDepthWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    { p: 'dataDepthWatcher', c: 'dataDepthWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'displayDepth', c: 'displayDepthWatcher', cLabel: 'displayDepthWatcher', v: 1 },
    {
      p: 'displayDepthWatcher',
      c: 'displayDepthWatcher.shouldUpdateDisplayDepth',
      cLabel: 'shouldUpdateDisplayDepth',
      v: 1
    },
    { p: 'displayDepthWatcher', c: 'displayDepthWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'circlePadding', c: 'circlePaddingWatcher', cLabel: 'circlePaddingWatcher', v: 1 },
    { p: 'circlePaddingWatcher', c: 'circlePaddingWatcher.shouldUpdateData', cLabel: 'shouldUpdateData', v: 1 },
    { p: 'circlePaddingWatcher', c: 'circlePaddingWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'colors', c: 'colorsWatcher', cLabel: 'colorsWatcher', v: 1 },
    { p: 'colorPalette', c: 'colorPaletteWatcher', cLabel: 'colorPaletteWatcher', v: 1 },
    { p: 'colorsWatcher', c: 'colorsWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    { p: 'colorsWatcher', c: 'colorsWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'colorsWatcher', c: 'colorsWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'colorsWatcher', c: 'colorsWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'colorPaletteWatcher', c: 'colorPaletteWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    {
      p: 'colorPaletteWatcher',
      c: 'colorPaletteWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'colorPaletteWatcher', c: 'colorPaletteWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'colorPaletteWatcher', c: 'colorPaletteWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'showTooltip', c: 'showTooltipWatcher', cLabel: 'showTooltipWatcher', v: 1 },
    {
      p: 'showTooltipWatcher',
      c: 'showTooltipWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'tooltipLabel', c: 'tooltipLabelWatcher', cLabel: 'tooltipLabelWatcher', v: 1 },
    { p: 'tooltipLabelWatcher', c: 'tooltipLabelWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'hoverOpacity', c: 'hoverOpacityWatcher', cLabel: 'hoverOpacityWatcher', v: 1 },
    {
      p: 'hoverOpacityWatcher',
      c: 'hoverOpacityWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'clickStyle', c: 'interactionStyleWatcher', cLabel: 'interactionStyleWatcher', v: 1 },
    { p: 'hoverStyle', c: 'hoverStyleWatcher', cLabel: 'hoverStyleWatcher', v: 1 },
    {
      p: 'interactionStyleWatcher',
      c: 'interactionStyleWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'interactionStyleWatcher', c: 'interactionStyleWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'interactionStyleWatcher', c: 'interactionStyleWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'interactionStyleWatcher', c: 'interactionStyleWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    {
      p: 'hoverStyleWatcher',
      c: 'hoverStyleWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'hoverStyleWatcher', c: 'hoverStyleWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'hoverStyleWatcher', c: 'hoverStyleWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'hoverStyleWatcher', c: 'hoverStyleWatcher.shouldSetColors', cLabel: 'shouldSetColors', v: 1 },
    { p: 'cursor', c: 'cursorWatcher', cLabel: 'cursorWatcher', v: 1 },
    { p: 'cursorWatcher', c: 'cursorWatcher.shouldUpdateCursor', cLabel: 'shouldUpdateCursor', v: 1 },
    { p: 'clickHighlight', c: 'clickWatcher', cLabel: 'clickWatcher', v: 1 },
    { p: 'clickWatcher', c: 'clickWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'hoverHighlight', c: 'hoverWatcher', cLabel: 'hoverWatcher', v: 1 },
    { p: 'hoverWatcher', c: 'hoverWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'zoomToNode', c: 'zoomWatcher', cLabel: 'zoomWatcher', v: 1 },
    { p: 'zoomWatcher', c: 'zoomWatcher.shouldZoom', cLabel: 'shouldZoom', v: 1 },
    { p: 'interactionKeys', c: 'interactionWatcher', cLabel: 'interactionWatcher', v: 1 },
    {
      p: 'interactionWatcher',
      c: 'interactionWatcher.shouldValidateInteractionKeys',
      cLabel: 'shouldValidateInteractionKeys',
      v: 1
    },
    { p: 'interactionWatcher', c: 'interactionWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    {
      p: 'interactionWatcher',
      c: 'interactionWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    {
      p: 'interactionWatcher',
      c: 'interactionWatcher.shouldSetGeometryAriaLabels',
      cLabel: 'shouldSetGeometryAriaLabels',
      v: 1
    },
    { p: 'dataLabel', c: 'labelWatcher', cLabel: 'labelWatcher', v: 1 },
    { p: 'labelWatcher', c: 'labelWatcher.shouldUpdateTableData', cLabel: 'shouldUpdateTableData', v: 1 },
    { p: 'labelWatcher', c: 'labelWatcher.shouldUpdateLabels', cLabel: 'shouldUpdateLabels', v: 1 },
    { p: 'labelWatcher', c: 'labelWatcher.shouldAddStrokeUnder', cLabel: 'shouldAddStrokeUnder', v: 1 },
    { p: 'accessibility', c: 'accessibilityWatcher', cLabel: 'accessibilityWatcher', v: 1 },
    { p: 'accessibilityWatcher', c: 'accessibilityWatcher.shouldValidate', cLabel: 'shouldValidate', v: 1 },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldUpdateDescriptionWrapper',
      cLabel: 'shouldUpdateDescriptionWrapper',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityTitle',
      cLabel: 'shouldSetChartAccessibilityTitle',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetParentSVGAccessibility',
      cLabel: 'shouldSetParentSVGAccessibility',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityExecutiveSummary',
      cLabel: 'shouldSetChartAccessibilityExecutiveSummary',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityPurpose',
      cLabel: 'shouldSetChartAccessibilityPurpose',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityLongDescription',
      cLabel: 'shouldSetChartAccessibilityLongDescription',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityContext',
      cLabel: 'shouldSetChartAccessibilityContext',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityStatisticalNotes',
      cLabel: 'shouldSetChartAccessibilityStatisticalNotes',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetChartAccessibilityStructureNotes',
      cLabel: 'shouldSetChartAccessibilityStructureNotes',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetGroupAccessibilityLabel',
      cLabel: 'shouldSetGroupAccessibilityLabel',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetGeometryAriaLabels',
      cLabel: 'shouldSetGeometryAriaLabels',
      v: 1
    },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldSetParentSVGAccessibility',
      cLabel: 'shouldSetParentSVGAccessibility',
      v: 1
    },
    { p: 'accessibilityWatcher', c: 'accessibilityWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'accessibilityWatcher', c: 'accessibilityWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    {
      p: 'accessibilityWatcher',
      c: 'accessibilityWatcher.shouldDrawInteractionState',
      cLabel: 'shouldDrawInteractionState',
      v: 1
    },
    { p: 'annotations', c: 'annotationsWatcher', cLabel: 'annotationsWatcher', v: 1 },
    { p: 'annotationsWatcher', c: 'annotationsWatcher.shouldValidate', cLabel: 'shouldValidate', v: 1 },
    {
      p: 'annotationsWatcher',
      c: 'annotationsWatcher.shouldUpdateAnnotations',
      cLabel: 'shouldUpdateAnnotations',
      v: 1
    },
    { p: 'uniqueID', c: 'idWatcher', cLabel: 'idWatcher', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.chartID', cLabel: 'chartID', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldValidate', cLabel: 'shouldValidate', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldUpdateDescriptionWrapper', cLabel: 'shouldUpdateDescriptionWrapper', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldSetParentSVGAccessibility', cLabel: 'shouldSetParentSVGAccessibility', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldSetTextures', cLabel: 'shouldSetTextures', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldDrawInteractionState', cLabel: 'shouldDrawInteractionState', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldSetStrokes', cLabel: 'shouldSetStrokes', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldSetTextStrokes', cLabel: 'shouldSetTextStrokes', v: 1 },
    { p: 'idWatcher', c: 'idWatcher.shouldSetIDs', cLabel: 'shouldSetIDs', v: 1 },
    { p: 'suppressEvents', c: 'suppressWatcher', cLabel: 'suppressWatcher', v: 1 },
    { p: 'suppressWatcher', c: 'suppressWatcher.shouldBindInteractivity', cLabel: 'shouldBindInteractivity', v: 1 },
    { p: 'suppressWatcher', c: 'suppressWatcher.shouldUpdateCursor', cLabel: 'shouldUpdateCursor', v: 1 }
  ];

  updateClick(item) {
    if (Array.isArray(item)) {
      item.length === 0 || this.clickElement === item ? (this.clickElement = []) : (this.clickElement = item);
    } else {
      item === '' || this.clickElement === item ? (this.clickElement = []) : (this.clickElement = [item]);
    }
  }

  drawChart() {
    return <div>{this.clickElement}</div>;
  }
  onClickCountryFunc(d) {
    if (d.detail && d.detail.location_id > 100) {
      this.clickElement = [d.detail];
    }
  }
  onClickFunc(d) {
    if (d.detail) {
      const alreadyClicked = this.clickElement.filter(e => e.id === d.detail.id).length > 0;
      this.clickElement = alreadyClicked ? [] : [d.detail];
      //toggle this to test that zoomToNode works watcher works as expected
      this.zoomTo = !this.zoomTo ? d.detail : this.zoomTo.id !== d.detail.id ? d.detail : undefined;
      // this.zoomTo = this.lifeCycleStates[1][1];
    }
  }
  changeProps() {
    this.size = Math.max(100, this.size + Math.floor(Math.random() * (Math.random() < 0.5 ? -100 : 100)));
  }
  changeData() {
    this.stateTrigger = this.stateTrigger < this.lifeCycleStates.length - 1 ? this.stateTrigger + 1 : 0;
  }
  changeAccessElements() {
    this.accessibility = {
      ...this.accessibility,
      elementsAreInterface: !this.accessibility.elementsAreInterface
    };
  }
  changeKeyNav() {
    const keyboardNavConfig = {
      disabled: !this.accessibility.keyboardNavConfig.disabled
    };
    this.accessibility = {
      ...this.accessibility,
      keyboardNavConfig
    };
  }
  toggleSuppress() {
    this.suppressEvents = !this.suppressEvents;
  }
  onHoverFunc(d) {
    this.hoverElement = d.detail;
  }
  onMouseOut() {
    this.hoverElement = '';
  }
  onBigHoverFunc(d) {
    this.bigHoverElement = d.detail;
  }
  onBigMouseOut() {
    this.bigHoverElement = '';
  }
  onBigClickFunc(d) {
    if (d.detail) {
      const alreadyClicked = this.bigClickElement.filter(e => e.id === d.detail.id).length > 0;
      this.bigClickElement = alreadyClicked ? [] : [d.detail];
      this.bigZoomTo = !this.bigZoomTo ? d.detail : this.bigZoomTo.id !== d.detail.id ? d.detail : undefined;
    }
  }

  changeNodeAccessor() {
    this.nodeAccessor = this.nodeAccessor !== 'Type' ? 'Type' : 'altType';
    this.parentAccessor = this.parentAccessor !== 'Country' ? 'Country' : 'altCountry';
  }

  changeHeight() {
    this.height = this.height !== 400 ? 400 : 200;
  }

  changeWidth() {
    this.width = this.height !== 400 ? 400 : 100;
  }
  // changeParentAccessor() {
  //   this.nodeAccessor = this.nodeAccessor !== 'Type' ? 'Type' : 'altType';
  //   this.parentAccessor = this.parentAccessor !== 'Country' ? 'Country' : 'altCountry';
  // }

  changeSizeAccessor() {
    this.sizeAccessor = this.sizeAccessor !== 'value' ? 'value' : 'altValue';
  }

  render() {
    this.lifeCycleTestData = this.lifeCycleStates[this.index];
    this.chartData = this.lifeCycleStates[this.stateTrigger];

    // tslint:disable-next-line:no-unused-expression
    // const cat = ['Sketch', 'SQL', 'React'];

    return (
      <div style={{ padding: '50px' }}>
        <button
          onClick={() => {
            this.changeAccessElements();
          }}
        >
          change elementsAreInterface
        </button>
        <button
          onClick={() => {
            this.toggleSuppress();
          }}
        >
          toggle event suppression
        </button>
        <button
          onClick={() => {
            this.changeKeyNav();
          }}
        >
          toggle keyboard nav
        </button>
        <button
          onClick={() => {
            this.changeData();
          }}
        >
          change data
        </button>
        <button
          onClick={() => {
            this.changeNodeAccessor();
          }}
        >
          change node & parent accessor
        </button>
        <button
          onClick={() => {
            this.changeHeight();
          }}
        >
          change height
        </button>
        <button
          onClick={() => {
            this.changeWidth();
          }}
        >
          change width
        </button>
        {/* <button
          onClick={() => {
            this.changeParentAccessor();
          }}
        >
          change parent accessor
        </button> */}
        <button
          onClick={() => {
            this.changeSizeAccessor();
          }}
        >
          change size accessor
        </button>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <circle-packing
            data={this.chartData}
            nodeAccessor={this.nodeAccessor}
            parentAccessor={this.parentAccessor}
            sizeAccessor={this.sizeAccessor}
            height={this.height}
            width={this.width}
            // nodeAccessor={'Type'}
            // parentAccessor={'Country'}
            // sizeAccessor={'value'}
            subTitle={''}
            mainTitle={'Chart Height is ' + this.height + 'px and Width is ' + this.width}
            displayDepth={1}
            // hoverStyle={{
            //   strokeWidth: 2,
            //   color: '#fafafa'
            // }}
            // clickStyle={{
            //   strokeWidth: 4,
            //   color: '#e4e4e4'
            // }}
            colors={['white', 'white', 'white']}
            dataLabel={this.dataLabel}
            onHoverFunc={d => this.onHoverFunc(d)}
            onClickFunc={d => this.onClickFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
            clickHighlight={this.clickElement}
            hoverHighlight={this.hoverElement}
            zoomToNode={this.zoomTo}
            accessibility={{ ...this.accessibility, hideTextures: true }}
            suppressEvents={this.suppressEvents}
            circlePadding={3}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <circle-packing
            data={this.circlePackComponentData}
            nodeAccessor="c"
            parentAccessor="p"
            sizeAccessor="v"
            height={this.height}
            width={this.width}
            subTitle={''}
            mainTitle={'Circle Packing Component Structure'}
            displayDepth={4}
            dataDepth={5}
            tooltipLabel={{
              labelAccessor: ['p', 'cLabel'],
              labelTitle: ['Caller', 'Callee'],
              format: ['', '']
            }}
            // hoverStyle={{
            //   strokeWidth: 2,
            //   color: '#fafafa'
            // }}
            // clickStyle={{
            //   strokeWidth: 4,
            //   color: '#e4e4e4'
            // }}
            colors={['white', 'white', 'white', 'white', 'white', 'white']}
            onHoverFunc={d => this.onHoverFunc(d)}
            onClickFunc={d => this.onClickFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
            // clickHighlight={this.clickElement}
            // hoverHighlight={this.hoverElement}
            // zoomToNode={this.zoomTo}
            accessibility={{ ...this.accessibility, hideTextures: true }}
            circlePadding={3}
          />
        </div>
      </div>
    );
  }
}
