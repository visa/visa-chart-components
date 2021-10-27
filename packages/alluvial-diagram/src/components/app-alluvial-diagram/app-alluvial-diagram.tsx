/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

@Component({
  tag: 'app-alluvial-diagram',
  styleUrl: 'app-alluvial-diagram.scss'
})
export class AppAlluvialDiagram {
  @State() highestHeadingLevel: string | number = 'h3';
  @State() data1: any;
  @State() data2: any;
  @State() data3: any;
  @State() nodes: any;
  @State() colorsArray: any = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4'];
  @State() colors: any = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#D90000']; //['#2e3047', '#43455c', '#3c3f58']
  @State() fillNodeConfig: any = false;
  @State() compareNodeConfig: any = false;
  @State() visibleLinkConfig: any = true;
  @State() fillModeLinkConfig: any = 'group';
  @State() opacityLinkConfig: any = 0.3;
  @State() linkConfig: any = {
    visible: this.visibleLinkConfig,
    // fillMode: 'source',
    fillMode: 'group',
    opacity: 0.6
  };
  @State() nodeConfig: any = {
    width: 15,
    alignment: 'center',
    padding: 10,
    compare: this.compareNodeConfig,
    fill: this.fillNodeConfig
  };
  @State() interactionKeys: any = ['group'];
  @State() fillState: any = 'new';
  @State() linkVisibilityState: any = true;
  @State() stateTrigger: any = 0;
  @State() width: number = 400;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() barIntervalRatio = 0.15;
  @State() padding: any = {
    top: 50,
    left: 140,
    right: 110,
    bottom: 50
  };

  @State() uniqueID: string = 'thisIsUnique';
  @State() dataLabel: any = {
    visible: true,
    placement: 'auto',
    labelAccessor: 'value',
    format: '0.0a',
    collisionHideOnly: false,
    collisionPlacement: 'inside'
  };
  @State() tooltipLabel: any = {
    labelAccessor: ['value'],
    labelTitle: ['value'],
    format: ['0,0[.0][a]']
  };
  // @State() clickElement: any = [];
  @State() clickElement: any = [{ group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }];
  @State() interactionState: any = ['group'];
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'region';
  @State() ordinalAccessor: any = 'country';
  @State() hoverElementTest: any = '';
  @State() clickElementTest: any = [];
  @State() animations: any = { disabled: true };
  @State() accessibility: any = {
    elementDescriptionAccessor: 'note', // see Indonesia above
    longDescription: 'An alluvial diagram which shows the movement of groups between 2018 and 2019.',
    contextExplanation: 'This chart is standalone, and can be manipulated by the preceding buttons.',
    executiveSummary: 'Medium is now the largest category in 2019.',
    purpose: 'Examines the flow of groups, between cateogries, over years.',
    structureNotes:
      'The categories are sorted from high to low, with new at the bottom. Links are used to visualize the population of the group moving between categories year over year.',
    statisticalNotes: 'Count of group members.',
    onChangeFunc: d => {
      this.onChangeFunc(d);
    },
    hideDataTableButton: true,
    elementsAreInterface: true,
    disableValidation: true
  };
  hoverStyle: any = {
    color: '#979db7',
    strokeWidth: 1.5
  };
  clickStyle: any = {
    color: '#8fdfff',
    strokeWidth: 2
  };
  // colors: any = ['#2e3047', '#43455c', '#3c3f58'];
  // colors: any = ['#EDEEF3', '#A8AABB', '#6C6E86', '#3c3f58'];

  linkStartData: any = [
    { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
    { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
    { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
    { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
    { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
    { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
    { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
    { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
    { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
    { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
    { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
    { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
  ];
  dataStorage1: any = [
    this.linkStartData,
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 301 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 275 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 281 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 1271 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 618 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 113 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 616 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 314 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 364 }
    ],
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 9091 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 681 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3681 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 9091 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 681 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3681 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 9091 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 681 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3681 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ]
    // new column on
    // [
    //   { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
    //   { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
    //   { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
    //   { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
    //   { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
    //   // { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 1133 },
    //   { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
    //   { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
    //   { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
    //   { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 },
    //   { group: 'Increased', source: 'Low 2019', target: 'High 2020', value: 3148 },
    //   { group: 'Decreased', source: 'High 2019', target: 'Medium 2020', value: 1279 },
    //   { group: 'New', source: 'Medium 2019', target: 'Low 2020', value: 3684 },
    // ]
    // [
    //   { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
    //   { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
    //   { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
    //   { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
    //   { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
    //   { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 1133 },
    //   { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
    //   { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
    //   { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
    //   { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    // ],
    // [
    //   { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
    //   { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
    //   { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
    //   { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
    //   { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
    //   { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 1133 },
    //   { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
    //   { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
    //   { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
    //   { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    // ],
    // [
    //   { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
    //   { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
    //   { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
    //   { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
    //   { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
    //   { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
    //   { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 1133 },
    //   { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
    //   { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
    //   { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
    //   { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    // ],
    // this.linkStartData
  ];
  dataStorage2: any = [
    this.linkStartData,
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 },
      { group: 'Increased', source: 'Low 2019', target: 'High 2020', value: 3148 },
      { group: 'Decreased', source: 'High 2019', target: 'Medium 2020', value: 1279 },
      { group: 'Decreased', source: 'Medium 2019', target: 'Low 2020', value: 3684 },
      { group: 'Decreased', source: 'Medium 2019', target: 'High 2020', value: 2684 }
    ],
    this.linkStartData,
    [
      { group: 'Remained', source: 'test', target: 'High 2018', value: 3010 },
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    this.linkStartData,
    [
      { group: 'Remained', source: 'test', target: 'High 2018', value: 3010 },
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 },
      { group: 'Increased', source: 'Low 2019', target: 'High 2020', value: 3148 },
      { group: 'Decreased', source: 'High 2019', target: 'Medium 2020', value: 1279 },
      { group: 'Decreased', source: 'Medium 2019', target: 'Low 2020', value: 3684 },
      { group: 'Decreased', source: 'Medium 2019', target: 'High 2020', value: 2684 }
    ]
  ];
  dataStorage3: any = [
    this.linkStartData,
    [
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 },
      { group: 'Increased', source: 'Low 2019', target: 'new', value: 3148 },
      { group: 'Decreased', source: 'High 2019', target: 'new', value: 1279 },
      { group: 'Decreased', source: 'Medium 2019', target: 'new', value: 3684 },
      { group: 'Decreased', source: 'Medium 2019', target: 'new', value: 2684 },
      { group: 'Increased', source: 'new', target: 'High 2020', value: 3148 },
      { group: 'Decreased', source: 'new', target: 'Medium 2020', value: 1279 },
      { group: 'Decreased', source: 'new', target: 'Low 2020', value: 3684 },
      { group: 'Decreased', source: 'new', target: 'High 2020', value: 2684 }
    ],
    this.linkStartData,
    [
      { group: 'Decreased', source: 'High 2016', target: 'Low 2017', value: 1234 },
      { group: 'Remained', source: 'Medium 2016', target: 'Medium 2017', value: 2010 },
      { group: 'Decreased', source: 'High 2017', target: 'Low 2018', value: 1234 },
      { group: 'Remained', source: 'Medium 2017', target: 'Medium 2018', value: 2010 },
      { group: 'Increased', source: 'Low 2017', target: 'Medium 2018', value: 1234 },
      { group: 'Decreased', source: 'High 2017', target: 'Medium 2018', value: 3010 },
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ],
    [
      { group: 'Decreased', source: 'High 2017', target: 'Low 2018', value: 1234 },
      { group: 'Remained', source: 'Medium 2017', target: 'Medium 2018', value: 2010 },
      { group: 'Increased', source: 'Low 2017', target: 'Medium 2018', value: 1234 },
      { group: 'Decreased', source: 'High 2017', target: 'Medium 2018', value: 3010 },
      { group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 },
      { group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 },
      { group: 'Decreased', source: 'High 2018', target: 'Low 2019', value: 2812 },
      { group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 },
      { group: 'Remained', source: 'Medium 2018', target: 'Medium 2019', value: 12712 },
      { group: 'Decreased', source: 'Medium 2018', target: 'Low 2019', value: 3367 },
      { group: 'Increased', source: 'Low 2018', target: 'High 2019', value: 68 },
      { group: 'Increased', source: 'Low 2018', target: 'Medium 2019', value: 8133 },
      { group: 'Remained', source: 'Low 2018', target: 'Low 2019', value: 6164 },
      { group: 'New', source: 'New 2018', target: 'High 2019', value: 3148 },
      { group: 'New', source: 'New 2018', target: 'Medium 2019', value: 7279 },
      { group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }
    ]
  ];
  // nodeStartData: any = [
  //   { did: 'High 2018' },
  //   { did: 'Medium 2018' },
  //   { did: 'Low 2018' },
  //   { did: 'New 2018' },
  //   { did: 'High 2019' },
  //   { did: 'Medium 2019' },
  //   { did: 'Low 2019' }
  // ];
  // nodeDataStorage: any = [
  //   this.nodeStartData,
  //   // this.nodeStartData,
  //   // this.nodeStartData,
  //   // this.nodeStartData,
  //   // [
  //   //   { did: 'High 2018' },
  //   //   { did: 'Medium 2018' },
  //   //   { did: 'Low 2018' },
  //   //   { did: 'New 2018' },
  //   //   { did: 'High 2019' },
  //   //   { did: 'Low 2019' }
  //   // ],
  //   // this.nodeStartData,
  //   // new column on far right
  //   [
  //     { did: 'High 2018' },
  //     { did: 'Medium 2018' },
  //     { did: 'Low 2018' },
  //     { did: 'New 2018' },
  //     { did: 'High 2019' },
  //     { did: 'Medium 2019' },
  //     { did: 'Low 2019' },
  //     { did: 'High 2020' },
  //     { did: 'Medium 2020' },
  //     { did: 'Low 2020' },
  //   ],
  //   [
  //     { did: 'High 2018' },
  //     { did: 'Medium 2018' },
  //     { did: 'Low 2018' },
  //     { did: 'New 2018' },
  //     { did: 'High 2019' },
  //     { did: 'Medium 2019' },
  //     { did: 'Low 2019' },
  //     { did: 'Nothing' },
  //     { did: 'High 2020' },
  //     { did: 'Medium 2020' },
  //     { did: 'Low 2020' },
  //   ],
  //   [
  //     { did: 'High 2018' },
  //     { did: 'Medium 2018' },
  //     { did: 'Low 2018' },
  //     { did: 'New 2018' },
  //     { did: 'High 2019' },
  //     { did: 'Medium 2019' },
  //     { did: 'Low 2019' },
  //     { did: 'High 2020' },
  //     { did: 'Medium 2020' },
  //     { did: 'Low 2020' },
  //   ],
  //   this.nodeStartData
  // ];

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data1 = this.dataStorage1[this.stateTrigger];
    this.data2 = this.dataStorage2[this.stateTrigger];
    this.data3 = this.dataStorage3[this.stateTrigger];
    // this.nodes = this.nodeDataStorage[this.stateTrigger];
  }
  onClickFunc(ev) {
    const d = ev.detail;

    if (d) {
      const newClicks = [...this.clickElement];
      const index = this.clickElement.findIndex(o => {
        let conditionsMet = false;
        conditionsMet = o.index === d.index ? true : false;
        // console.log('test', o.index);
        return conditionsMet;
      });
      if (index > -1) {
        newClicks.splice(index, 1);
      } else {
        newClicks.push(d);
      }
      this.clickElement = newClicks;
      // console.log('newClicks', this.clickElement);
    }
  }
  onHoverFunc(d) {
    this.hoverElement = d.detail;
  }
  onMouseOut() {
    this.hoverElement = '';
  }
  onChangeFunc(d) {
    if (d.updated && (d.removed || d.added)) {
      let updates = 'The bar chart has ';
      if (d.removed) {
        updates += 'removed ' + d.removed + ' bar' + (d.removed > 1 ? 's ' : ' ');
      }
      if (d.added) {
        updates += (d.removed ? 'and ' : '') + 'added ' + d.added + (d.removed ? '' : d.added > 1 ? ' bars' : ' bar');
      }
      this.chartUpdates = updates;
    } else if (d.updated) {
      const newUpdate = "The chart's data has changed, but no bars were removed or added.";
      this.chartUpdates =
        newUpdate !== this.chartUpdates
          ? newUpdate
          : "The chart's data has changed again, but no bars were removed or added.";
    } else {
      const newUpdate = "The chart's has updated, but no change to the data was made.";
      this.chartUpdates =
        newUpdate !== this.chartUpdates
          ? newUpdate
          : "The chart's has updated again, but no change to the data was made.";
    }
  }
  changeData(act) {
    setTimeout(() => {
      if (this.uniqueID !== 'POTENTIALLY_BUGGY_ID_CHANGE') {
        this.uniqueID = 'POTENTIALLY_BUGGY_ID_CHANGE';
      }
    }, 10000);
    const selectedActData = this['dataStorage' + act];
    this.stateTrigger = this.stateTrigger < selectedActData.length - 1 ? this.stateTrigger + 1 : 0;
    this['data' + act] = selectedActData[this.stateTrigger];
    // this.nodes = this.nodeDataStorage[this.stateTrigger];
  }

  changeShowLinks() {
    this.visibleLinkConfig = this.visibleLinkConfig !== true ? true : false;
    this.fillNodeConfig = this.fillNodeConfig ? false : true;
  }

  changeCompareNodes() {
    this.compareNodeConfig = this.compareNodeConfig ? false : true;
  }

  // changeLinkFillMode() {
  //   this.fillModeLinkConfig = this.fillModeLinkConfig === 'group' ? 'source' : 'group';
  // }

  changeLinkColor(band, toggleLinks) {
    if (toggleLinks) {
      this.visibleLinkConfig = this.visibleLinkConfig ? false : true;
      this.linkVisibilityState = this.visibleLinkConfig;
      this.fillNodeConfig = this.fillNodeConfig ? false : true;
    }

    if (band) {
      band === 'increased'
        ? (this.fillState = 'increased')
        : band === 'decreased'
        ? (this.fillState = 'decreased')
        : band === 'remained'
        ? (this.fillState = 'remained')
        : (this.fillState = 'new');
    }
    if (!this.linkVisibilityState) {
      if (this.fillState === 'increased') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#0051dc', '#0051dc'];
        this.clickElement = [{ group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 }];
      } else if (this.fillState === 'decreased') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#D90000', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 }];
      } else if (this.fillState === 'remained') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 }];
      } else if (this.fillState === 'new') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }];
      }
    } else if (this.linkVisibilityState) {
      if (this.fillState === 'increased') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#0051dc', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Increased', source: 'Medium 2018', target: 'High 2019', value: 909 }];
      } else if (this.fillState === 'decreased') {
        this.colorsArray = ['#E4E4E4', '#D90000', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Decreased', source: 'High 2018', target: 'Medium 2019', value: 2754 }];
      } else if (this.fillState === 'remained') {
        this.colorsArray = ['#767676', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Remained', source: 'High 2018', target: 'High 2019', value: 3010 }];
      } else if (this.fillState === 'new') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }];
      }
    }
  }

  changeDimension() {
    this.padding =
      this.padding.left === 60
        ? {
            top: 50,
            left: 150,
            right: 180,
            bottom: 40
          }
        : {
            top: 50,
            left: 60,
            right: 30,
            bottom: 40
          };
    this.width = this.width === 800 ? 700 : 800;
  }
  changeLabels() {
    if (this.dataLabel.placement === 'inside') {
      this.dataLabel = {
        visible: true, // !this.dataLabel.visible,
        placement: 'outside',
        labelAccessor: 'value',
        format: '0.0[a]'
      };

      this.padding = {
        top: 50,
        left: 140,
        right: 110,
        bottom: 50
      };
    } else {
      this.dataLabel = {
        visible: true, // !this.dataLabel.visible,
        placement: 'inside',
        labelAccessor: 'value',
        format: '0.0[a]'
      };

      this.padding = {
        top: 50,
        left: 10,
        right: 10,
        bottom: 50
      };
    }
  }
  changeTooltip() {
    this.tooltipLabel = { labelAccessor: ['value', 'test'], labelTitle: ['', ''], format: ['0,0[.0][a]', ''] };
  }

  changeInteraction() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.interactionState = this.interactionState[0] !== ['did'] ? ['did'] : ['source'];
    console.log(this.interactionState);
  }

  changeValueAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.groupAccessor = this.groupAccessor !== 'region' ? 'region' : null;
  }

  changeInteractionKey() {
    this.interactionState = this.interactionState[0] === ['group'] ? ['source'] : ['group'];
  }

  toggleTextures() {
    const newAccess = { ...this.accessibility };
    newAccess.hideTextures = !newAccess.hideTextures;
    this.accessibility = newAccess;
  }

  toggleSmallLabels() {
    const newAccess = { ...this.accessibility };
    newAccess.showSmallLabels = !newAccess.showSmallLabels;
    this.accessibility = newAccess;
  }

  onTestClickFunc(d) {
    const index = this.clickElementTest.indexOf(d);
    const newClicks = [...this.clickElementTest];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d);
    }
    this.clickElementTest = newClicks;
  }
  onTestHoverFunc(d) {
    this.hoverElementTest = d;
  }
  onTestMouseOut() {
    this.hoverElementTest = '';
  }
  handleInput = e => {
    e.preventDefault();
    this.highestHeadingLevel = e.cat[0].value;
  };

  render() {
    return (
      <div>
        {/* <div role="alert" aria-live="polite"> */}
        <p>{this.chartUpdates}</p>
        <div>
          <h4>I. Basic Links</h4>
          <button
            onClick={() => {
              this.changeData(1);
            }}
          >
            change data
          </button>
          <button
            onClick={() => {
              this.changeCompareNodes();
            }}
          >
            toggle CompareNodes
          </button>
          <button
            onClick={() => {
              this.changeLabels();
            }}
          >
            change label placement
          </button>
          <button
            onClick={() => {
              this.changeShowLinks();
            }}
          >
            hide links
          </button>
          <button
            onClick={() => {
              this.changeInteractionKey();
            }}
          >
            TEST change interaction key
          </button>
          <alluvial-diagram
            linkData={this.data1}
            // nodeData={this.nodes}
            width={500}
            height={450}
            padding={this.padding}
            colors={this.colors}
            sourceAccessor={'source'}
            targetAccessor={'target'}
            valueAccessor={'value'}
            groupAccessor={'group'}
            linkConfig={this.linkConfig}
            nodeConfig={this.nodeConfig}
            nodeIDAccessor={'did'}
            mainTitle={''}
            subTitle={''}
            dataLabel={this.dataLabel}
            // interactionKeys={this.interactionState}
            interactionKeys={this.interactionKeys}
            hoverOpacity={0.2}
            showTooltip={false}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickFunc={d => this.onClickFunc(d)}
            onHoverFunc={d => this.onHoverFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
            clickStyle={this.clickStyle}
            // animationConfig={this.animations}
          />
        </div>
        <div>
          <h4>II. New Columns on Edge</h4>
          <button
            onClick={() => {
              this.changeData(2);
            }}
          >
            change data
          </button>
          <button
            onClick={() => {
              this.changeCompareNodes();
            }}
          >
            toggle CompareNodes
          </button>
          <button
            onClick={() => {
              this.changeLabels();
            }}
          >
            change label placement
          </button>
          <alluvial-diagram
            linkData={this.data2}
            // nodeData={this.nodes}
            width={500}
            height={450}
            padding={this.padding}
            colors={['#717171']}
            sourceAccessor={'source'}
            targetAccessor={'target'}
            valueAccessor={'value'}
            groupAccessor={'group'}
            linkConfig={{
              ...{
                visible: this.visibleLinkConfig,
                // fillMode: 'source',
                fillMode: 'none',
                opacity: 0.5
              }
            }}
            nodeConfig={{
              ...{
                width: 15,
                alignment: 'center',
                padding: 10,
                compare: this.compareNodeConfig,
                fill: this.fillNodeConfig
              }
            }}
            nodeIDAccessor={'did'}
            mainTitle={''}
            subTitle={''}
            dataLabel={this.dataLabel}
            interactionKeys={this.interactionState}
            hoverOpacity={0.2}
            showTooltip={false}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickFunc={d => this.onClickFunc(d)}
            onHoverFunc={d => this.onHoverFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
          />
        </div>
        <div>
          <h4>III. New Node between Nodes</h4>
          <button
            onClick={() => {
              this.changeData(3);
            }}
          >
            change data
          </button>
          <button
            onClick={() => {
              this.changeCompareNodes();
            }}
          >
            toggle CompareNodes
          </button>
          <button
            onClick={() => {
              this.changeLabels();
            }}
          >
            change label placement
          </button>
          <alluvial-diagram
            linkData={this.data3}
            // nodeData={this.nodes}
            width={500}
            height={450}
            padding={this.padding}
            // colors={['#717171']}
            sourceAccessor={'source'}
            targetAccessor={'target'}
            valueAccessor={'value'}
            groupAccessor={'group'}
            linkConfig={{
              ...{
                visible: this.visibleLinkConfig,
                fillMode: 'source',
                // fillMode: 'none',
                opacity: 0.8
              }
            }}
            nodeConfig={{
              ...{
                width: 15,
                alignment: 'center',
                padding: 10,
                compare: this.compareNodeConfig,
                fill: this.fillNodeConfig
              }
            }}
            nodeIDAccessor={'did'}
            mainTitle={''}
            subTitle={''}
            dataLabel={this.dataLabel}
            interactionKeys={this.interactionState}
            hoverOpacity={0.2}
            showTooltip={false}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickFunc={d => this.onClickFunc(d)}
            onHoverFunc={d => this.onHoverFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
          />
        </div>
      </div>
    );
  }
}
