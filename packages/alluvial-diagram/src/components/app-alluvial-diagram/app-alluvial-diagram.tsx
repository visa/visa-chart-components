/**
 * Copyright (c) 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';

@Component({
  tag: 'app-alluvial-diagram',
  styleUrl: 'app-alluvial-diagram.scss'
})
export class AppAlluvialDiagram {
  @State() highestHeadingLevel: string | number = 'h3';
  @State() data: any;
  @State() nodes: any;
  @State() colorsArray: any = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4'];
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
  @State() fillNodeConfig: any = false;
  @State() compareNodeConfig: any = true;
  @State() visibleLinkConfig: any = true;
  @State() fillModeLinkConfig: any = 'group';
  @State() opacityLinkConfig: any = 0.3;

  @State() uniqueID: string = 'thisIsUnique';
  @State() dataLabel: any = { visible: false, placement: 'outside', labelAccessor: 'did' };
  @State() tooltipLabel: any = {
    labelAccessor: ['vale'],
    labelTitle: ['value'],
    format: ['0,0[.0][a]']
  };
  // @State() clickElement: any = [];
  @State() clickElement: any = [{ group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 }];
  @State() interactionState: any = ['value'];
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'region';
  @State() ordinalAccessor: any = 'country';
  @State() hoverElementTest: any = '';
  @State() clickElementTest: any = [];
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
  @State() annotations: any = [
    {
      note: {
        label: '3,148 (New to High)',
        bgPadding: 0,
        align: 'left',
        wrap: 210
      },
      accessibilityDescription: '2018 High Category total is 8,606',
      data: { group: 'New', cat: 'New Group 2018', target: 'High 2019', vale: 3148 },
      positionType: 'target',
      // dy: '-1%',
      color: '#000000'
    },
    {
      note: {
        label: '7,279 (New to Med)',
        bgPadding: 0,
        align: 'left',
        wrap: 210
      },
      accessibilityDescription: '2018 High Category total is 8,606',
      data: { group: 'New', cat: 'New Group 2018', target: 'Medium 2019', vale: 7279 },
      positionType: 'target',
      // dy: '-1%',
      color: '#000000'
    },
    {
      note: {
        label: '3,684 (New to Low)',
        bgPadding: 0,
        align: 'left',
        wrap: 210
      },
      accessibilityDescription: '2018 High Category total is 8,606',
      data: { group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 },
      positionType: 'target',
      // dy: '-1%',
      color: '#000000'
    }
  ];
  hoverStyle: any = {
    color: '#979db7',
    strokeWidth: 1.5
  };
  clickStyle: any = {
    color: '#8fdcc7',
    strokeWidth: 2
  };
  // colors: any = ['#2e3047', '#43455c', '#3c3f58'];
  colors: any = ['#EDEEF3', '#A8AABB', '#6C6E86', '#3c3f58'];

  startData: any = [
    { group: 'Remained', cat: 'High 2018', target: 'High 2019', vale: 3010 },
    { group: 'Decreased', cat: 'High 2018', target: 'Medium 2019', vale: 2754 },
    { group: 'Decreased', cat: 'High 2018', target: 'Low 2019', vale: 2812 },
    { group: 'Increased', cat: 'Medium 2018', target: 'High 2019', vale: 909 },
    { group: 'Remained', cat: 'Medium 2018', target: 'Medium 2019', vale: 12712 },
    { group: 'Decreased', cat: 'Medium 2018', target: 'Low 2019', vale: 3367 },
    { group: 'Increased', cat: 'Low 2018', target: 'High 2019', vale: 68 },
    { group: 'Increased', cat: 'Low 2018', target: 'Medium 2019', vale: 1133 },
    { group: 'Remained', cat: 'Low 2018', target: 'Low 2019', vale: 6164 },
    { group: 'New', cat: 'New Group 2018', target: 'High 2019', vale: 3148 },
    { group: 'New', cat: 'New Group 2018', target: 'Medium 2019', vale: 7279 },
    { group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 }
  ];
  dataStorage: any = [this.startData];
  test: any = [
    { did: 'High 2018' },
    { did: 'Medium 2018' },
    { did: 'Low 2018' },
    { did: 'New Group 2018' },
    { did: 'High 2019' },
    { did: 'Medium 2019' },
    { did: 'Low 2019' }
  ];

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];
    this.nodes = this.test;
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
      console.log('newClicks', this.clickElement);
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
  changeData() {
    setTimeout(() => {
      if (this.uniqueID !== 'POTENTIALLY_BUGGY_ID_CHANGE') {
        this.uniqueID = 'POTENTIALLY_BUGGY_ID_CHANGE';
      }
    }, 10000);
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
    this.data = this.dataStorage[this.stateTrigger];
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
      this.changeAnnotations(this.visibleLinkConfig);
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
        this.clickElement = [{ group: 'Increased', cat: 'Medium 2018', target: 'High 2019', vale: 909 }];
      } else if (this.fillState === 'decreased') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#D90000', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Decreased', cat: 'High 2018', target: 'Medium 2019', vale: 2754 }];
      } else if (this.fillState === 'remained') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Remained', cat: 'High 2018', target: 'High 2019', vale: 3010 }];
      } else if (this.fillState === 'new') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 }];
      }
    } else if (this.linkVisibilityState) {
      if (this.fillState === 'increased') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#0051dc', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Increased', cat: 'Medium 2018', target: 'High 2019', vale: 909 }];
        this.annotations = [
          {
            note: {
              label: '2018',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '8%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2019',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '229%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'High:',
              label: '0 Increased',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { did: 'High 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Medium: 909',
              label: 'Increased (5.3%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Medium Category total is 16,988',
            data: { did: 'Medium 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Low: 1,201',
              label: 'Increased (16.3%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Low Category total is 7,365',
            data: { did: 'Low 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'New Group:',
              label: '0 Increased',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 New Group Category total is 14,081',
            data: { did: 'New Group 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '909 (Med to High)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Increased', cat: 'Medium 2018', target: 'High 2019', vale: 909 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '68 (Low to High)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Increased', cat: 'Low 2018', target: 'High 2019', vale: 68 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '1,133 (Low to Med)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Increased', cat: 'Low 2018', target: 'Medium 2019', vale: 1133 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          }
        ];
      } else if (this.fillState === 'decreased') {
        this.colorsArray = ['#E4E4E4', '#D90000', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Decreased', cat: 'High 2018', target: 'Medium 2019', vale: 2754 }];
        this.annotations = [
          {
            note: {
              label: '2018',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '8%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2019',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '229%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'High: 5,596',
              label: 'Decreased (65.0%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            data: { did: 'High 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Medium: 3,367',
              label: 'Decreased (19.8%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Medium Category total is 3,367',
            data: { did: 'Medium 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Low:',
              label: '0 Decreased',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Low Category total is 7,365',
            data: { did: 'Low 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'New Group:',
              label: '0 Decreased',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 New Group Category total is 14,081',
            data: { did: 'New Group 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2,754 (High to Med)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Decreased', cat: 'High 2018', target: 'Medium 2019', vale: 2754 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2,812 (High to Low)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Decreased', cat: 'High 2018', target: 'Low 2019', vale: 2812 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '3,367 (Med to Low)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Decreased', cat: 'Medium 2018', target: 'Low 2019', vale: 3367 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          }
        ];
      } else if (this.fillState === 'remained') {
        this.colorsArray = ['#767676', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'Remained', cat: 'High 2018', target: 'High 2019', vale: 3010 }];
        this.annotations = [
          {
            note: {
              label: '2018',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '8%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2019',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '229%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'High: 3,010',
              label: 'Remained (35.0%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            data: { did: 'High 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Medium: 12,712',
              label: 'Remained (74.9%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Medium Category total is 3,367',
            data: { did: 'Medium 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Low: 6,164',
              label: 'Remained (83.7%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Low Category total is 7,365',
            data: { did: 'Low 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'New Group:',
              label: '0 Remained',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 New Group Category total is 14,081',
            data: { did: 'New Group 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '3,010(High to High)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Remained', cat: 'High 2018', target: 'High 2019', vale: 3010 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '12,712 (Med to Med)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Remained', cat: 'Medium 2018', target: 'Medium 2019', vale: 12712 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '6,164 (Low to Low)',
              bgPadding: 0,
              // title: 'High: 8,606',
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'Remained', cat: 'Low 2018', target: 'Low 2019', vale: 6164 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          }
        ];
      } else if (this.fillState === 'new') {
        this.colorsArray = ['#E4E4E4', '#E4E4E4', '#E4E4E4', '#78029D', '#E4E4E4', '#E4E4E4', '#E4E4E4'];
        this.clickElement = [{ group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 }];
        this.annotations = [
          {
            note: {
              label: '2018',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '8%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '2019',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            x: '229%',
            y: '-25%',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'High:',
              label: '0 New',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 5,596',
            data: { did: 'High 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Medium:',
              label: '0 New',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Medium Category total is 3,367',
            data: { did: 'Medium 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'Low:',
              label: '0 New',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 Low Category total is 7,365',
            data: { did: 'Low 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              title: 'New Group: 14,081',
              label: 'New (100%)',
              bgPadding: 0,
              align: 'right',
              wrap: 210
            },
            accessibilityDescription: '2018 New Group Category total is 14,081',
            data: { did: 'New Group 2018' },
            positionType: 'node',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '3,148 (New to High)',
              bgPadding: 0,
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'New', cat: 'New Group 2018', target: 'High 2019', vale: 3148 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '7,279 (New to Med)',
              bgPadding: 0,
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'New', cat: 'New Group 2018', target: 'Medium 2019', vale: 7279 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          },
          {
            note: {
              label: '3,684 (New to Low)',
              bgPadding: 0,
              align: 'left',
              wrap: 210
            },
            accessibilityDescription: '2018 High Category total is 8,606',
            data: { group: 'New', cat: 'New Group 2018', target: 'Low 2019', vale: 3684 },
            positionType: 'target',
            // dy: '-1%',
            color: '#000000'
          }
        ];
      }
    }
  }

  changeAnnotations(toggleLinks) {
    if (!toggleLinks) {
      this.annotations = [
        {
          note: {
            label: '2018',
            bgPadding: 0,
            align: 'middle',
            wrap: 210
          },
          accessibilityDescription: '2018 High Category total is 5,596',
          x: '102%',
          y: '-25%',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: '2019',
            bgPadding: 0,
            align: 'middle',
            wrap: 210
          },
          accessibilityDescription: '2018 High Category total is 5,596',
          x: '152%',
          y: '-25%',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'High: 8,606',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'right',
            wrap: 210
          },
          accessibilityDescription: '2018 High Category total is 8,606',
          data: { did: 'High 2018' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'Medium: 16,988',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'right',
            wrap: 210
          },
          accessibilityDescription: '2018 Medium Category total is 16,988',
          data: { did: 'Medium 2018' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'Low: 7,365',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'right',
            wrap: 210
          },
          accessibilityDescription: '2018 Low Category total is 7,365',
          data: { did: 'Low 2018' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'New Group: 14,081',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'right',
            wrap: 210
          },
          accessibilityDescription: '2018 New Group Category total is 14,081',
          data: { did: 'New Group 2018' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'High: 7,135',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'left',
            wrap: 210
          },
          accessibilityDescription: '2019 High Category total is 7,135',
          data: { did: 'High 2019' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'Medium: 23,878',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'left',
            wrap: 210
          },
          accessibilityDescription: '2019 Medium Category total is 23,878',
          data: { did: 'Medium 2019' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        },
        {
          note: {
            label: 'Low: 16,027',
            bgPadding: 0,
            // title: 'High: 8,606',
            align: 'left',
            wrap: 210
          },
          accessibilityDescription: '2019 Low Category total is 16,027',
          data: { did: 'Low 2019' },
          positionType: 'node',
          // dy: '-1%',
          color: '#000000'
        }
      ];
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
        labelAccessor: 'did',
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
        labelAccessor: 'did',
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
  }

  changeValueAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.groupAccessor = this.groupAccessor !== 'region' ? 'region' : null;
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
        <div>
          <p>{this.chartUpdates}</p>
          {/* <button
            onClick={() => {
              this.changeLinkFillMode();
            }}
          >
            toggle link fill type btw 'group' and 'source'
          </button> */}
          <button
            onClick={() => {
              this.changeLabels();
            }}
          >
            change labels
          </button>
          <button
            onClick={() => {
              this.changeShowLinks();
            }}
          >
            toggle link visibility
          </button>
          <button
            onClick={() => {
              this.changeCompareNodes();
            }}
          >
            toggle CompareNodes
          </button>
        </div>
        <br />
        <div>
          <button
            onClick={() => {
              this.changeLinkColor('increased', false);
            }}
          >
            increased
          </button>
          <button
            onClick={() => {
              this.changeLinkColor('decreased', false);
            }}
          >
            decreased
          </button>
          <button
            onClick={() => {
              this.changeLinkColor('remained', false);
            }}
          >
            remained
          </button>
          <button
            onClick={() => {
              this.changeLinkColor('new', false);
            }}
          >
            new
          </button>
          <button
            onClick={() => {
              this.changeLinkColor('', true);
            }}
          >
            view flows?
          </button>
        </div>
        <alluvial-diagram
          linkData={this.data}
          nodeData={this.nodes}
          width={500}
          height={500}
          padding={this.padding}
          // colors={[
          //   '#767676',
          //   '#D90000',
          //   '#0051dc',
          //   '#78029D'
          // ]}
          colors={this.colorsArray}
          colorPalette={'categorical'}
          sourceAccessor={'cat'}
          targetAccessor={'target'}
          valueAccessor={'vale'}
          groupAccessor={'group'}
          // labelAccessor={'label'}
          linkConfig={{
            ...{
              visible: this.visibleLinkConfig,
              // fillMode: 'source',
              fillMode: 'group',
              opacity: 1
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
          interactionKeys={['group']}
          // interactionKeys={['cat']}
          hoverOpacity={0.2}
          showTooltip={false}
          annotations={this.annotations}
          // tooltipLabel={this.tooltipLabel}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickFunc={d => this.onClickFunc(d)}
          onHoverFunc={d => this.onHoverFunc(d)}
          onMouseOutFunc={() => this.onMouseOut()}
        />
      </div>
    );
  }
}
