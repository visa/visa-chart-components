/**
 * Copyright (c) 2021, 2022 Visa, Inc.
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
  @State() colors: any = undefined;
  @State() fillNodeConfig: any = true;
  @State() compareNodeConfig: any = false;
  @State() visibleLinkConfig: any = true;
  @State() fillModeLinkConfig: any = 'group';
  @State() opacityLinkConfig: any = 0.3;
  @State() linkConfig: any = {
    visible: this.visibleLinkConfig,
    // fillMode: 'none',
    fillMode: 'source',
    opacity: 0.6
  };
  @State() nodeConfig: any = {
    width: 15,
    alignment: 'center',
    padding: 10,
    compare: this.compareNodeConfig,
    fill: this.fillNodeConfig
  };
  // @State() interactionKeys: any = ['source'];
  @State() fillState: any = 'new';
  @State() linkVisibilityState: any = true;
  @State() stateTrigger: any = 0;
  @State() nodeData: any;
  @State() nodeID: any = 'dataID';
  @State() width: number = 700;
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
    labelAccessor: 'Freq',
    // format: '0',
    collisionHideOnly: false,
    collisionPlacement: 'inside'
  };
  @State() tooltipLabel: any = {
    labelAccessor: ['Freq'],
    labelTitle: ['Freq'],
    format: ['0,0[.0][a]']
  };
  @State() clickElement: any = [];
  // @State() clickElement: any = [{ group: 'New', source: 'New 2018', target: 'Low 2019', value: 3684 }];
  @State() interactionState: any = ['group'];
  @State() sourceAccessor: any = 'source';
  @State() targetAccessor: any = 'target';
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'group';
  @State() hoverElementTest: any = '';
  @State() clickElementTest: any = [];
  @State() animations: any = { disabled: true };
  @State() annotations: any = [
    {
      note: {
        label: 'test 1',
        bgPadding: 0,
        align: 'left',
        wrap: 810
      },
      // className: 'link-labels-right',
      data: {
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Medium',
        otherValue: 346,
        group: 'Remained',
        source: 'Medium 2018',
        target: 'Medium 2019',
        value: 12712
      },
      positionType: 'target',
      disable: ['connector', 'subject'],
      color: '#88ee22'
      // sortOrder: 100 + currYrCt++,
      // collisionHideOnly: targetArr.indexOf(node[this.targetAccessor])!== i ? true : false
    }
  ];
  @State() suppressEvents: any = false;
  @State() accessibility: any = {
    longDescription: 'An alluvial diagram which shows the movement of groups between 2018 and 2019.',
    contextExplanation: 'This chart is standalone, and can be manipulated by the preceding buttons.',
    executiveSummary: 'Medium is now the largest category in 2019.',
    purpose: 'Examines the flow of groups, between cateogries, over years.',
    structureNotes:
      'The categories are sorted from high to low, with new at the bottom. Links are used to visualize the population of the group moving between categories year over year.',
    statisticalNotes: 'Count of group members.',
    // onChangeFunc: d => {
    //   this.onChangeFunc(d);
    // },
    hideDataTableButton: false,
    elementsAreInterface: true,
    disableValidation: false
  };
  @State() hoverStyle: any = {
    color: '#000000'
    // strokeWidth: 1.5
  };
  @State() clickStyle: any = {
    color: '#88ee22'
  };

  linkStartData: any = [
    {
      otherGroup: 'a',
      otherSource: 'US',
      otherTarget: 'High',
      otherValue: 234,
      group: 'Remained',
      source: 'High 2018',
      target: 'High 2019',
      value: 3010
    },
    {
      otherGroup: 'a',
      otherSource: 'US',
      otherTarget: 'Medium',
      otherValue: 342,
      group: 'Decreased',
      source: 'High 2018',
      target: 'Medium 2019',
      value: 2754
    },
    {
      otherGroup: 'a',
      otherSource: 'US',
      otherTarget: 'Low',
      otherValue: 451,
      group: 'Decreased',
      source: 'High 2018',
      target: 'Low 2019',
      value: 2812
    },
    {
      otherGroup: 'b',
      otherSource: 'LA',
      otherTarget: 'High',
      otherValue: 534,
      group: 'Increased',
      source: 'Medium 2018',
      target: 'High 2019',
      value: 909
    },
    {
      otherGroup: 'b',
      otherSource: 'LA',
      otherTarget: 'Medium',
      otherValue: 346,
      group: 'Remained',
      source: 'Medium 2018',
      target: 'Medium 2019',
      value: 12712
    },
    {
      otherGroup: 'b',
      otherSource: 'LA',
      otherTarget: 'Low',
      otherValue: 467,
      group: 'Decreased',
      source: 'Medium 2018',
      target: 'Low 2019',
      value: 3367
    },
    {
      otherGroup: 'c',
      otherSource: 'EU',
      otherTarget: 'High',
      otherValue: 234,
      group: 'Increased',
      source: 'Low 2018',
      target: 'High 2019',
      value: 68
    },
    {
      otherGroup: 'c',
      otherSource: 'EU',
      otherTarget: 'Medium',
      otherValue: 356,
      group: 'Increased',
      source: 'Low 2018',
      target: 'Medium 2019',
      value: 8133
    },
    {
      otherGroup: 'c',
      otherSource: 'EU',
      otherTarget: 'Low',
      otherValue: 261,
      group: 'Remained',
      source: 'Low 2018',
      target: 'Low 2019',
      value: 6164
    },
    {
      otherGroup: 'd',
      otherSource: 'NEW',
      otherTarget: 'High',
      otherValue: 123,
      group: 'New',
      source: 'New 2018',
      target: 'High 2019',
      value: 3148
    },
    {
      otherGroup: 'd',
      otherSource: 'NEW',
      otherTarget: 'Medium',
      otherValue: 987,
      group: 'New',
      source: 'New 2018',
      target: 'Medium 2019',
      value: 7279
    },
    {
      otherGroup: 'd',
      otherSource: 'NEW',
      otherTarget: 'Low',
      otherValue: 345,
      group: 'New',
      source: 'New 2018',
      target: 'Low 2019',
      value: 3684
    }
  ];
  dataStorage1: any = [
    this.linkStartData,
    [
      {
        otherValue: 234,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'High',
        group: 'Remained',
        source: 'High 2018',
        target: 'High 2019',
        value: 301
      },
      {
        otherValue: 342,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Medium',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Medium 2019',
        value: 275
      },
      {
        otherValue: 451,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Low 2019',
        value: 281
      },
      {
        otherValue: 534,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Medium 2018',
        target: 'High 2019',
        value: 909
      },
      {
        otherValue: 346,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Medium',
        group: 'Remained',
        source: 'Medium 2018',
        target: 'Medium 2019',
        value: 1271
      },
      {
        otherValue: 467,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'Medium 2018',
        target: 'Low 2019',
        value: 3367
      },
      {
        otherValue: 234,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Low 2018',
        target: 'High 2019',
        value: 618
      },
      {
        otherValue: 356,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Medium',
        group: 'Increased',
        source: 'Low 2018',
        target: 'Medium 2019',
        value: 113
      },
      {
        otherValue: 261,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Low',
        group: 'Remained',
        source: 'Low 2018',
        target: 'Low 2019',
        value: 616
      },
      {
        otherValue: 123,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'High',
        group: 'New',
        source: 'New 2018',
        target: 'High 2019',
        value: 314
      },
      {
        otherValue: 987,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Medium',
        group: 'New',
        source: 'New 2018',
        target: 'Medium 2019',
        value: 279
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Low',
        group: 'New',
        source: 'New 2018',
        target: 'Low 2019',
        value: 364
      }
    ],
    [
      {
        otherValue: 234,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'High',
        group: 'Remained',
        source: 'High 2018',
        target: 'High 2019',
        value: 3010
      },
      {
        otherValue: 342,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Medium',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Medium 2019',
        value: 2754
      },
      {
        otherValue: 451,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Low 2019',
        value: 2812
      },
      {
        otherValue: 534,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Medium 2018',
        target: 'High 2019',
        value: 9091
      },
      {
        otherValue: 346,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Medium',
        group: 'Remained',
        source: 'Medium 2018',
        target: 'Medium 2019',
        value: 12712
      },
      {
        otherValue: 467,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'Medium 2018',
        target: 'Low 2019',
        value: 3367
      },
      {
        otherValue: 234,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Low 2018',
        target: 'High 2019',
        value: 681
      },
      {
        otherValue: 356,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Medium',
        group: 'Increased',
        source: 'Low 2018',
        target: 'Medium 2019',
        value: 8133
      },
      {
        otherValue: 261,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Low',
        group: 'Remained',
        source: 'Low 2018',
        target: 'Low 2019',
        value: 6164
      },
      {
        otherValue: 123,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'High',
        group: 'New',
        source: 'New 2018',
        target: 'High 2019',
        value: 3681
      },
      {
        otherValue: 987,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Medium',
        group: 'New',
        source: 'New 2018',
        target: 'Medium 2019',
        value: 7279
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Low',
        group: 'New',
        source: 'New 2018',
        target: 'Low 2019',
        value: 3684
      }
    ],
    [
      {
        otherValue: 534,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Medium 2018',
        target: 'High 2019',
        value: 9091
      },
      {
        otherValue: 346,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Medium',
        group: 'Remained',
        source: 'Medium 2018',
        target: 'Medium 2019',
        value: 12712
      },
      {
        otherValue: 467,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'Medium 2018',
        target: 'Low 2019',
        value: 3367
      },
      {
        otherValue: 234,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Low 2018',
        target: 'High 2019',
        value: 681
      },
      {
        otherValue: 356,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Medium',
        group: 'Increased',
        source: 'Low 2018',
        target: 'Medium 2019',
        value: 8133
      },
      {
        otherValue: 261,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Low',
        group: 'Remained',
        source: 'Low 2018',
        target: 'Low 2019',
        value: 6164
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'High',
        group: 'New',
        source: 'New 2018',
        target: 'High 2019',
        value: 3681
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Medium',
        group: 'New',
        source: 'New 2018',
        target: 'Medium 2019',
        value: 7279
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Low',
        group: 'New',
        source: 'New 2018',
        target: 'Low 2019',
        value: 3684
      }
    ],
    [
      {
        otherValue: 234,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'High',
        group: 'Remained',
        source: 'High 2018',
        target: 'High 2019',
        value: 3010
      },
      {
        otherValue: 342,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Medium',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Medium 2019',
        value: 2754
      },
      {
        otherValue: 451,
        otherGroup: 'a',
        otherSource: 'US',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'High 2018',
        target: 'Low 2019',
        value: 2812
      },
      {
        otherValue: 534,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Medium 2018',
        target: 'High 2019',
        value: 9091
      },
      {
        otherValue: 346,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Medium',
        group: 'Remained',
        source: 'Medium 2018',
        target: 'Medium 2019',
        value: 12712
      },
      {
        otherValue: 467,
        otherGroup: 'b',
        otherSource: 'LA',
        otherTarget: 'Low',
        group: 'Decreased',
        source: 'Medium 2018',
        target: 'Low 2019',
        value: 3367
      },
      {
        otherValue: 234,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'High',
        group: 'Increased',
        source: 'Low 2018',
        target: 'High 2019',
        value: 681
      },
      {
        otherValue: 356,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Medium',
        group: 'Increased',
        source: 'Low 2018',
        target: 'Medium 2019',
        value: 8133
      },
      {
        otherValue: 261,
        otherGroup: 'c',
        otherSource: 'EU',
        otherTarget: 'Low',
        group: 'Remained',
        source: 'Low 2018',
        target: 'Low 2019',
        value: 6164
      },
      {
        otherValue: 123,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'High',
        group: 'New',
        source: 'New 2018',
        target: 'High 2019',
        value: 3681
      },
      {
        otherValue: 987,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Medium',
        group: 'New',
        source: 'New 2018',
        target: 'Medium 2019',
        value: 7279
      },
      {
        otherValue: 345,
        otherGroup: 'd',
        otherSource: 'NEW',
        otherTarget: 'Low',
        group: 'New',
        source: 'New 2018',
        target: 'Low 2019',
        value: 3684
      }
    ]
  ];
  nodeStartData: any = [
    { otherID: 'US', label: 'A', dataID: 'High 2018' },
    { otherID: 'LA', label: 'B', dataID: 'Medium 2018' },
    { otherID: 'EU', label: 'C', dataID: 'Low 2018' },
    { otherID: 'NEW', label: 'D', dataID: 'New 2018' },
    { otherID: 'High', label: 'E', dataID: 'High 2019' },
    { otherID: 'Medium', label: 'F', dataID: 'Medium 2019' },
    { otherID: 'Low', label: 'G', dataID: 'Low 2019' }
  ];
  nodeDataStorage: any = [
    this.nodeStartData,
    this.nodeStartData,
    this.nodeStartData,
    [
      { label: 'B', dataID: 'Medium 2018' },
      { label: 'C', dataID: 'Low 2018' },
      { label: 'D', dataID: 'New 2018' },
      { label: 'E', dataID: 'High 2019' },
      { label: 'F', dataID: 'Medium 2019' },
      { label: 'G', dataID: 'Low 2019' }
    ],
    this.nodeStartData
  ];

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data1 = this.dataStorage1[this.stateTrigger];
    this.nodes = this.nodeDataStorage[this.stateTrigger];
    this.nodeData = this.nodes;
  }
  onClickFunc(ev) {
    const d = ev.detail.data;
    // console.log('click', ev, ev.detail, d);
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
    this.hoverElement = d.detail.data;
  }
  onMouseOut() {
    this.hoverElement = '';
  }
  onChangeFunc(d) {
    console.log(d);
    if (d.updated && (d.removed || d.added)) {
      let updates = 'The alluvial chart has ';
      if (d.removed) {
        updates += 'removed ' + d.removed + ' link' + (d.removed > 1 ? 's ' : ' ');
      }
      if (d.added) {
        updates += (d.removed ? 'and ' : '') + 'added ' + d.added + (d.removed ? '' : d.added > 1 ? ' links' : ' link');
      }
      this.chartUpdates = updates;
    } else if (d.updated) {
      const newUpdate = "The chart's data has changed, but no links were removed or added.";
      this.chartUpdates =
        newUpdate !== this.chartUpdates
          ? newUpdate
          : "The chart's data has changed again, but no links were removed or added.";
    } else {
      const newUpdate = 'The chart has updated, but no change to the data was made.';
      this.chartUpdates =
        newUpdate !== this.chartUpdates
          ? newUpdate
          : 'The chart has updated again, but no change to the data was made.';
    }
  }

  changeData(act) {
    // setTimeout(() => {
    //   if (this.uniqueID !== 'POTENTIALLY_BUGGY_ID_CHANGE') {
    //     this.uniqueID = 'POTENTIALLY_BUGGY_ID_CHANGE';
    //   }
    // }, 10000);
    const selectedActData = this['dataStorage' + act];
    this.stateTrigger = this.stateTrigger < selectedActData.length - 1 ? this.stateTrigger + 1 : 0;
    this['data' + act] = selectedActData[this.stateTrigger];
    // console.log(this.chartUpdates);
    // this.nodes = this.nodeDataStorage[this.stateTrigger];
  }

  toggleNodeData() {
    this.nodeData = this.nodeData && this.nodeData.length > 1 ? null : this.nodes;
    // this.nodeID = this.nodeData && this.nodeData.length > 1 ? 'dataID' : 'id';
    // console.log(this.nodeData, this.nodeID);
  }

  changeShowLinks() {
    this.visibleLinkConfig = this.visibleLinkConfig !== true ? true : false;
    this.fillNodeConfig = this.fillNodeConfig ? false : true;
  }

  changeTooltip() {
    this.tooltipLabel.labelAccessor[0] !== 'group'
      ? (this.tooltipLabel = {
          labelAccessor: ['group', 'value'],
          labelTitle: ['Group ', 'Value'],
          format: ['', '0,0[.0][a]']
        })
      : (this.tooltipLabel = { labelAccessor: ['value'], labelTitle: ['Value'], format: ['0,0[.0][a]'] });
  }

  changeCompareNodes() {
    this.compareNodeConfig = this.compareNodeConfig ? false : true;
  }

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
    this.width = this.width === 700 ? 400 : 700;
  }

  changeLabels() {
    if (this.dataLabel.labelAccessor === 'otherID') {
      this.dataLabel = {
        visible: true,
        placement: 'auto',
        labelAccessor: 'dataID',
        format: '',
        collisionHideOnly: false,
        collisionPlacement: 'inside'
      };
    } else {
      this.dataLabel = {
        visible: true,
        placement: 'auto',
        labelAccessor: 'otherID',
        format: '',
        collisionHideOnly: false,
        collisionPlacement: 'inside'
      };
    }
  }

  changeAnnotations() {
    this.annotations =
      this.annotations[0].positionType === 'target'
        ? [
            {
              note: {
                label: 'test 1',
                bgPadding: 0,
                align: 'left',
                wrap: 810
              },
              // className: 'link-labels-right',
              data: {
                otherGroup: 'b',
                otherSource: 'LA',
                otherTarget: 'Medium',
                otherValue: 346,
                group: 'Remained',
                source: 'Medium 2018',
                target: 'Medium 2019',
                value: 12712
              },
              positionType: 'source',
              disable: ['connector', 'subject'],
              color: '#222222'
              // sortOrder: 100 + currYrCt++,
              // collisionHideOnly: targetArr.indexOf(node[this.targetAccessor])!== i ? true : false
            }
          ]
        : [
            {
              note: {
                label: 'test 1',
                bgPadding: 0,
                align: 'left',
                wrap: 810
              },
              // className: 'link-labels-right',
              data: {
                otherGroup: 'b',
                otherSource: 'LA',
                otherTarget: 'Medium',
                otherValue: 346,
                group: 'Remained',
                source: 'Medium 2018',
                target: 'Medium 2019',
                value: 12712
              },
              positionType: 'target',
              disable: ['connector', 'subject'],
              color: '#88ee22'
              // sortOrder: 100 + currYrCt++,
              // collisionHideOnly: targetArr.indexOf(node[this.targetAccessor])!== i ? true : false
            }
          ];
  }

  simpleChartToggle() {
    this.suppressEvents = this.accessibility.elementsAreInterface ? true : false;
    this.accessibility = this.accessibility.elementsAreInterface
      ? {
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
          hideDataTableButton: false,
          elementsAreInterface: false,
          disableValidation: true,
          keyboardNavConfig: { disabled: true }
        }
      : {
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
          hideDataTableButton: false,
          elementsAreInterface: true,
          disableValidation: true,
          keyboardNavConfig: { disabled: false }
        };
  }

  changeLabelAccessors() {
    if (this.dataLabel.labelAccessor === 'dataID') {
      this.dataLabel = {
        visible: true, // !this.dataLabel.visible,
        placement: 'inside',
        labelAccessor: 'label',
        format: ''
      };
    } else {
      this.dataLabel = {
        visible: true, // !this.dataLabel.visible,
        placement: 'inside',
        labelAccessor: 'dataID',
        format: ''
      };
    }
  }

  changeInteraction() {
    this.interactionState = this.interactionState[0] !== ['did'] ? ['did'] : ['source'];
  }

  toggleColors() {
    this.colors = this.colors
      ? undefined
      : ['#E4E4E4', '#D90000', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
  }

  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    this.groupAccessor = this.groupAccessor !== 'group' ? 'group' : 'otherGroup';
  }

  changeSourceAccessor() {
    this.sourceAccessor = this.sourceAccessor !== 'source' ? 'source' : 'otherSource';
  }

  changeTargetAccessor() {
    this.targetAccessor = this.targetAccessor !== 'target' ? 'target' : 'otherTarget';
  }

  changeNodeIDAccessor() {
    this.nodeID = this.nodeID !== 'dataID' ? 'dataID' : 'otherID';
    this.sourceAccessor = this.sourceAccessor !== 'source' ? 'source' : 'otherSource';
    this.targetAccessor = this.targetAccessor !== 'target' ? 'target' : 'otherTarget';
    this.dataLabel = { ...this.dataLabel };
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
        <p>heyyyyy {this.chartUpdates}</p>
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
              this.toggleNodeData();
            }}
          >
            toggle node data
          </button>
          <button
            onClick={() => {
              this.changeDimension();
            }}
          >
            set dimensions
          </button>
          <button
            onClick={() => {
              this.toggleColors();
            }}
          >
            toggle colors
          </button>
          <button
            onClick={() => {
              this.changeTooltip();
            }}
          >
            change tooltip label
          </button>
          <button
            onClick={() => {
              this.changeValueAccessor();
            }}
          >
            change value accessor
          </button>
          <button
            onClick={() => {
              this.changeGroupAccessor();
            }}
          >
            change group accessor
          </button>
          <button
            onClick={() => {
              this.changeSourceAccessor();
            }}
          >
            change source accessor
          </button>
          <button
            onClick={() => {
              this.changeTargetAccessor();
            }}
          >
            change target accessor
          </button>
          <button
            onClick={() => {
              this.changeNodeIDAccessor();
            }}
          >
            change nodeID accessor
          </button>
          <button
            onClick={() => {
              this.changeLabels();
            }}
          >
            toggle label accessor
          </button>
          <button
            onClick={() => {
              this.changeAnnotations();
            }}
          >
            annotations
          </button>
          <button
            onClick={() => {
              this.simpleChartToggle();
            }}
          >
            simple chart toggle
          </button>
          <p>{this.nodeID}</p>
          <alluvial-diagram
            linkData={[
              { Hair: 'Black', Eye: 'Brown', Sex: 'Female', Freq: 36, newHair: 'Black -Hair', newEye: 'Brown -Eye' },
              { Hair: 'Brown', Eye: 'Brown', Sex: 'Female', Freq: 66, newHair: 'Brown -Hair', newEye: 'Brown -Eye' },
              { Hair: 'Red', Eye: 'Brown', Sex: 'Female', Freq: 16, newHair: 'Red -Hair', newEye: 'Brown -Eye' },
              { Hair: 'Blond', Eye: 'Brown', Sex: 'Female', Freq: 4, newHair: 'Blond -Hair', newEye: 'Brown -Eye' },
              { Hair: 'Black', Eye: 'Blue', Sex: 'Female', Freq: 9, newHair: 'Black -Hair', newEye: 'Blue -Eye' },
              { Hair: 'Brown', Eye: 'Blue', Sex: 'Female', Freq: 34, newHair: 'Brown -Hair', newEye: 'Blue -Eye' },
              { Hair: 'Red', Eye: 'Blue', Sex: 'Female', Freq: 7, newHair: 'Red -Hair', newEye: 'Blue -Eye' },
              { Hair: 'Blond', Eye: 'Blue', Sex: 'Female', Freq: 64, newHair: 'Blond -Hair', newEye: 'Blue -Eye' },
              { Hair: 'Black', Eye: 'Hazel', Sex: 'Female', Freq: 5, newHair: 'Black -Hair', newEye: 'Hazel -Eye' },
              { Hair: 'Brown', Eye: 'Hazel', Sex: 'Female', Freq: 29, newHair: 'Brown -Hair', newEye: 'Hazel -Eye' },
              { Hair: 'Red', Eye: 'Hazel', Sex: 'Female', Freq: 7, newHair: 'Red -Hair', newEye: 'Hazel -Eye' },
              { Hair: 'Blond', Eye: 'Hazel', Sex: 'Female', Freq: 5, newHair: 'Blond -Hair', newEye: 'Hazel -Eye' },
              { Hair: 'Black', Eye: 'Green', Sex: 'Female', Freq: 2, newHair: 'Black -Hair', newEye: 'Green -Eye' },
              { Hair: 'Brown', Eye: 'Green', Sex: 'Female', Freq: 14, newHair: 'Brown -Hair', newEye: 'Green -Eye' },
              { Hair: 'Red', Eye: 'Green', Sex: 'Female', Freq: 7, newHair: 'Red -Hair', newEye: 'Green -Eye' },
              { Hair: 'Blond', Eye: 'Green', Sex: 'Female', Freq: 8, newHair: 'Blond -Hair', newEye: 'Green -Eye' }
            ]}
            // nodeData={this.nodeData}
            width={this.width}
            height={450}
            padding={this.padding}
            colors={this.colors}
            sourceAccessor={'newHair'}
            targetAccessor={'newEye'}
            valueAccessor={'Freq'}
            // groupAccessor={this.groupAccessor}
            // nodeIDAccessor={this.nodeID}
            linkConfig={this.linkConfig}
            nodeConfig={this.nodeConfig}
            mainTitle={''}
            subTitle={''}
            dataLabel={this.dataLabel}
            // interactionKeys={this.interactionKeys}
            hoverOpacity={0.2}
            showTooltip={true}
            colorPalette={'categorical'}
            tooltipLabel={this.tooltipLabel}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickEvent={d => this.onClickFunc(d)}
            onHoverEvent={d => this.onHoverFunc(d)}
            onMouseOutEvent={() => this.onMouseOut()}
            // onInitialLoadEvent={e => console.log('load event', e.detail, e)}
            // onDrawStartEvent={e => console.log('draw start event', e.detail, e)}
            // onDrawEndEvent={e => console.log('draw end event', e.detail, e)}
            // onTransitionEndEvent={e => console.log('transition event', e.detail, e)}
            clickStyle={this.clickStyle}
            hoverStyle={this.hoverStyle}
            annotations={this.annotations}
            accessibility={this.accessibility}
            suppressEvents={this.suppressEvents}
            // animationConfig={this.animations}
          />
        </div>
      </div>
    );
  }
}
