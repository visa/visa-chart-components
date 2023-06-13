/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

// importing custom languages
// import { hu } from '../../../../utils/src/utils/localization/languages/hu';

// importing numeralLocales
// import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';
@Component({
  tag: 'app-scatter-plot',
  styleUrl: 'app-scatter-plot.scss'
})
export class AppScatterPlot {
  @State() data: any;
  @State() stateTrigger: any = 3;
  @State() hoverElement: any = '';
  @State() xAccessor: any = 'item';
  @State() yAccessor: any = 'value';
  @State() sizeConfig: any = {
    sizeAccessor: 'otherValue',
    dualEncodeColor: true
  };
  @State() groupAccessor: any = 'group';
  @State() baselineX: any = false;
  @State() baselineY: any = false;
  @State() colors: any = ['#FEFEFF', '#FEFFFE', '#FFFEFE', '#FFFEFF'];
  @State() colorPalette: string = 'categorical';
  @State() clickStroke: string = 'green';
  @State() clickStrokeWidth: number = 1.5;
  @State() clickColor: string = '#2e3047';
  @State() hoverStroke: string = 'white';
  @State() hoverStrokeWidth: number = 1;
  @State() hoverColor: string = '#8CD6C2';
  @State() interactionKeys: any = ['item'];
  @State() animations: any = { disabled: false };
  @State() dataLabel: any = { visible: true, placement: 'bottom', labelAccessor: '', format: '$0[.][0]a' };
  @State() accessibility: any = {
    elementsAreInterface: false,
    includeDataKeyNames: true,
    keyboardNavConfig: { disabled: false }
  };
  @State() suppressEvents: boolean = false;
  @State() dotSymbols: any = ['star', 'triangle', 'diamond'];
  @State() padding: any = {
    top: 20,
    left: 60,
    right: 50,
    bottom: 50
  };
  @State() xAxis: any = { visible: true, gridVisible: true, label: 'Age', format: '0' };
  @State() yAxis: any = { visible: true, gridVisible: true, label: 'Monthly Spending', format: '$0[a]' };

  @State() clickElement: any = [
    // { item: 4, otherItem: 1, group: 'C', value: 22135, otherValue: 111, test: 'B' }
    // { item: 3, otherItem: 8, group: 'A', value: 4004, otherValue: 385, test: 'B' }
  ];
  // startData: any = [
  //   { item: 1, otherItem: 234, group: 'A', value: -2700, otherValue: 235, test: 'A' },
  //   { item: 2, otherItem: 164, group: 'A', value: 1000, otherValue: 1235, test: 'B' },
  //   { item: -30, otherItem: 84, group: 'A', value: 4004, otherValue: 895, test: 'C' }
  // ];
  startData: any = [
    { item: 5.1, value: 3.5, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 4.9, value: 3.0, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 4.7, value: 3.2, otherValue: 1.3, petalWidth: 0.2, group: 'setosa' },
    { item: 4.6, value: 3.1, otherValue: 1.5, petalWidth: 0.2, group: 'setosa' },
    { item: 5.0, value: 3.6, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 5.4, value: 3.9, otherValue: 1.7, petalWidth: 0.4, group: 'setosa' },
    { item: 4.6, value: 3.4, otherValue: 1.4, petalWidth: 0.3, group: 'setosa' },
    { item: 5.0, value: 3.4, otherValue: 1.5, petalWidth: 0.2, group: 'setosa' },
    { item: 4.4, value: 2.9, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 4.9, value: 3.1, otherValue: 1.5, petalWidth: 0.1, group: 'setosa' },
    { item: 5.4, value: 3.7, otherValue: 1.5, petalWidth: 0.2, group: 'setosa' },
    { item: 4.8, value: 3.4, otherValue: 1.6, petalWidth: 0.2, group: 'setosa' },
    { item: 4.8, value: 3.0, otherValue: 1.4, petalWidth: 0.1, group: 'setosa' },
    { item: 4.3, value: 3.0, otherValue: 1.1, petalWidth: 0.1, group: 'setosa' },
    { item: 5.8, value: 4.0, otherValue: 1.2, petalWidth: 0.2, group: 'setosa' },
    { item: 5.7, value: 4.4, otherValue: 1.5, petalWidth: 0.4, group: 'setosa' },
    { item: 5.4, value: 3.9, otherValue: 1.3, petalWidth: 0.4, group: 'setosa' },
    { item: 4.9, value: 3.6, otherValue: 1.4, petalWidth: 0.1, group: 'setosa' },
    { item: 4.4, value: 3.0, otherValue: 1.3, petalWidth: 0.2, group: 'setosa' },
    { item: 5.1, value: 3.4, otherValue: 1.5, petalWidth: 0.2, group: 'setosa' },
    { item: 5.0, value: 3.5, otherValue: 1.3, petalWidth: 0.3, group: 'setosa' },
    { item: 4.5, value: 2.3, otherValue: 1.3, petalWidth: 0.3, group: 'setosa' },
    { item: 4.4, value: 3.2, otherValue: 1.3, petalWidth: 0.2, group: 'setosa' },
    { item: 5.0, value: 3.5, otherValue: 1.6, petalWidth: 0.6, group: 'setosa' },
    { item: 5.1, value: 3.8, otherValue: 1.9, petalWidth: 0.4, group: 'setosa' },
    { item: 4.8, value: 3.0, otherValue: 1.4, petalWidth: 0.3, group: 'setosa' },
    { item: 5.1, value: 3.8, otherValue: 1.6, petalWidth: 0.2, group: 'setosa' },
    { item: 4.6, value: 3.2, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 5.3, value: 3.7, otherValue: 1.5, petalWidth: 0.2, group: 'setosa' },
    { item: 5.0, value: 3.3, otherValue: 1.4, petalWidth: 0.2, group: 'setosa' },
    { item: 7.0, value: 3.2, otherValue: 4.7, petalWidth: 1.4, group: 'versicolor' },
    { item: 6.4, value: 3.2, otherValue: 4.5, petalWidth: 1.5, group: 'versicolor' },
    { item: 6.9, value: 3.1, otherValue: 4.9, petalWidth: 1.5, group: 'versicolor' },
    { item: 5.5, value: 2.3, otherValue: 4.0, petalWidth: 1.3, group: 'versicolor' },
    { item: 6.5, value: 2.8, otherValue: 4.6, petalWidth: 1.5, group: 'versicolor' },
    { item: 5.7, value: 2.8, otherValue: 4.5, petalWidth: 1.3, group: 'versicolor' },
    { item: 6.3, value: 3.3, otherValue: 4.7, petalWidth: 1.6, group: 'versicolor' },
    { item: 4.9, value: 2.4, otherValue: 3.3, petalWidth: 1.0, group: 'versicolor' },
    { item: 6.6, value: 2.9, otherValue: 4.6, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.2, value: 2.7, otherValue: 3.9, petalWidth: 1.4, group: 'versicolor' },
    { item: 5.0, value: 2.0, otherValue: 3.5, petalWidth: 1.0, group: 'versicolor' },
    { item: 5.8, value: 2.7, otherValue: 3.9, petalWidth: 1.2, group: 'versicolor' },
    { item: 6.0, value: 2.7, otherValue: 5.1, petalWidth: 1.6, group: 'versicolor' },
    { item: 5.4, value: 3.0, otherValue: 4.5, petalWidth: 1.5, group: 'versicolor' },
    { item: 6.0, value: 3.4, otherValue: 4.5, petalWidth: 1.6, group: 'versicolor' },
    { item: 6.7, value: 3.1, otherValue: 4.7, petalWidth: 1.5, group: 'versicolor' },
    { item: 6.3, value: 2.3, otherValue: 4.4, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.6, value: 3.0, otherValue: 4.1, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.5, value: 2.5, otherValue: 4.0, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.5, value: 2.6, otherValue: 4.4, petalWidth: 1.2, group: 'versicolor' },
    { item: 6.1, value: 3.0, otherValue: 4.6, petalWidth: 1.4, group: 'versicolor' },
    { item: 5.8, value: 2.6, otherValue: 4.0, petalWidth: 1.2, group: 'versicolor' },
    { item: 5.0, value: 2.3, otherValue: 3.3, petalWidth: 1.0, group: 'versicolor' },
    { item: 5.6, value: 2.7, otherValue: 4.2, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.7, value: 3.0, otherValue: 4.2, petalWidth: 1.2, group: 'versicolor' },
    { item: 5.7, value: 2.9, otherValue: 4.2, petalWidth: 1.3, group: 'versicolor' },
    { item: 6.2, value: 2.9, otherValue: 4.3, petalWidth: 1.3, group: 'versicolor' },
    { item: 5.1, value: 2.5, otherValue: 3.0, petalWidth: 1.1, group: 'versicolor' },
    { item: 5.7, value: 2.8, otherValue: 4.1, petalWidth: 1.3, group: 'versicolor' }
  ];
  dataStorage: any = [
    this.startData,
    [
      { item: 1, otherItem: 11, group: 'A', value: 1400, otherValue: 135, test: 'B' },
      { item: 2, otherItem: 9, group: 'A', value: 1800, otherValue: 35, test: 'B' },
      { item: 3, otherItem: 4, group: 'A', value: 1000, otherValue: 435, test: 'A' },
      { item: 4, otherItem: 11, group: 'B', value: 1400, otherValue: 135, test: 'B' },
      { item: 5, otherItem: 9, group: 'B', value: 1800, otherValue: 35, test: 'B' },
      { item: 6, otherItem: 4, group: 'B', value: 1000, otherValue: 435, test: 'A' },
      { item: 7, otherItem: 11, group: 'C', value: 1400, otherValue: 135, test: 'B' },
      { item: 8, otherItem: 9, group: 'C', value: 1800, otherValue: 35, test: 'B' },
      { item: 9, otherItem: 4, group: 'C', value: 1000, otherValue: 435, test: 'A' },
      { item: 10, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 11, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 12, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' },
      { item: 13, otherItem: 11, group: 'E', value: 1400, otherValue: 135, test: 'B' },
      { item: 14, otherItem: 9, group: 'E', value: 1800, otherValue: 35, test: 'B' },
      { item: 15, otherItem: 4, group: 'E', value: 1000, otherValue: 435, test: 'A' },
      { item: 1, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 2, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 3, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' },
      { item: 4, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 5, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 6, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' },
      { item: 7, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 8, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 9, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' },
      { item: 10, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 11, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 12, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' },
      { item: 13, otherItem: 11, group: 'D', value: 1400, otherValue: 135, test: 'B' },
      { item: 14, otherItem: 9, group: 'D', value: 1800, otherValue: 35, test: 'B' },
      { item: 15, otherItem: 4, group: 'D', value: 1000, otherValue: 435, test: 'A' }
    ],
    [
      { item: 1, otherItem: 2, group: 'A', value: 2700, otherValue: 135, test: 'A' },
      { item: 2, otherItem: 7, group: 'A', value: 1000, otherValue: 275, test: 'B' },
      { item: 3, otherItem: 8, group: 'A', value: 4004, otherValue: 385, test: 'B' },
      { item: 4, otherItem: 1, group: 'B', value: 2454, otherValue: 715, test: 'B' },
      { item: 5, otherItem: 9, group: 'B', value: 22135, otherValue: 100, test: 'B' },
      { item: 6, otherItem: 4, group: 'B', value: 11143, otherValue: 621, test: 'A' },
      { item: 7, otherItem: 2, group: 'C', value: 2454, otherValue: 111, test: 'C' },
      { item: 8, otherItem: 7, group: 'C', value: 22135, otherValue: 222, test: 'C' },
      { item: 9, otherItem: 8, group: 'C', value: 11143, otherValue: 555, test: 'C' },
      { item: 10, otherItem: 8, group: 'B', value: 11143, otherValue: 421, test: 'C' }
    ],
    [
      { item: 13, otherItem: 8, group: 'A', value: 27500, otherValue: 535, test: 'A' },
      { item: 3, otherItem: 18, group: 'A', value: 2000, otherValue: 445, test: 'B' },
      { item: 2, otherItem: 4, group: 'A', value: 3454, otherValue: 333, test: 'B' },
      { item: 4, otherItem: 8, group: 'C', value: 24543, otherValue: 222, test: 'B' },
      { item: 4, otherItem: 1, group: 'C', value: 22135, otherValue: 111, test: 'B' },
      { item: 4, otherItem: 2, group: 'C', value: 11143, otherValue: 111, test: 'A' },
      { item: 10, otherItem: 8, group: 'D', value: 3845, otherValue: 13, test: 'C' },
      { item: 20, otherItem: 4, group: 'D', value: 56323, otherValue: 555, test: 'C' },
      { item: 30, otherItem: 8, group: 'E', value: 12276, otherValue: 489, test: 'C' },
      { item: 22, otherItem: 1, group: 'E', value: 12421, otherValue: 371, test: 'C' },
      { item: 13, otherItem: 9, group: 'E', value: 23321, otherValue: 235, test: 'C' }
    ],
    [{ item: 13, otherItem: 5, group: 'A', value: 27500, otherValue: 235, test: 'A' }],
    [
      { item: 13, otherItem: 5, group: 'A', value: 27500, otherValue: 135, test: 'A' },
      { item: 3, otherItem: 2, group: 'A', value: 2000, otherValue: 626, test: 'B' },
      { item: 2, otherItem: 7, group: 'A', value: 3454, otherValue: 537, test: 'C' },
      { item: 4, otherItem: 8, group: 'C', value: 24543, otherValue: 246, test: 'D' },
      { item: 4, otherItem: 1, group: 'C', value: 22135, otherValue: 135, test: 'A' },
      { item: 4, otherItem: 9, group: 'C', value: 11143, otherValue: 434, test: 'B' },
      { item: 10, otherItem: 2, group: 'D', value: 3845, otherValue: 24, test: 'C' },
      { item: 20, otherItem: 7, group: 'D', value: 56323, otherValue: 357, test: 'D' },
      { item: 30, otherItem: 8, group: 'E', value: 12276, otherValue: 135, test: 'A' },
      { item: 22, otherItem: 1, group: 'E', value: 12421, otherValue: 351, test: 'B' },
      { item: 13, otherItem: 9, group: 'E', value: 23321, otherValue: 250, test: 'C' }
    ],
    [
      { item: 13, otherItem: 8, group: 'A', value: 27500, otherValue: 135, test: 'A' },
      { item: 4, otherItem: 1, group: 'C', value: 24543, otherValue: 215, test: 'B' },
      { item: 10, otherItem: 4, group: 'D', value: 3845, otherValue: 395, test: 'B' },
      { item: 30, otherItem: 7, group: 'E', value: 12276, otherValue: 535, test: 'C' }
    ]
  ];
  annotations: any = [
    {
      note: {
        label: '2018',
        bgPadding: 0,
        align: 'middle',
        wrap: 210
      },
      accessibilityDescription: '2018 High Spend band total is 5,596',
      x: '8%',
      y: '40%',
      disable: ['connector', 'subject'],
      // dy: '-1%',
      color: '#000000',
      className: 'testing1 testing2 testing3',
      collisionHideOnly: true
    },
    {
      note: {
        label: 'oasijfoiajsf',
        bgPadding: 0,
        align: 'middle',
        wrap: 210
      },
      accessibilityDescription: '2018 High Spend band total is 5,596',
      x: '8%',
      y: '40%',
      disable: ['connector', 'subject'],
      // dy: '-1%',
      color: '#000000',
      className: 'testing1 testing2 testing3',
      collisionHideOnly: false
    }
    // {
    //   note: {
    //     label: '24 items',
    //     bgPadding: 0,
    //     title: 'Dense Cluster',
    //     align: 'right',
    //     wrap: 130
    //   },
    //   data: { item: 3, otherItem: 8, group: 'A', value: 2000, otherValue: 435, test: 'B' },
    //   dx: '-10%',
    //   // "dy": "-50%",
    //   className: 'scatter-annotation',
    //   type: 'annotationCalloutCircle',
    //   subject: {
    //     radius: 15
    //   }
    // }
    // // , {
    // //   "note": {
    // //     "label": "24 items",
    // //     "bgPadding": 0,
    // //     "title": "Dense Cluster",
    // //     "align":"right",
    // //     "wrap": 130
    // //   },
    // //   "data": { item: 1, otherItem: 234, group: 'A', value: -2700, otherValue: 235, test: 'A' },
    // //   "dx": "5%",
    // //   // "dy": "-50%",
    // //   "className": "scatter-annotation",
    // //   "type":"annotationCalloutCircle",
    // //   "subject":{
    // //       "radius":15
    // //   }
    // // }
  ];

  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    group: 'Grouping',
    value: 'Named Value'
  };

  componentWillUpdate() {
    // console.log("will update", this.clickElement);
  }

  onClickFunc(d) {
    let index = -1;
    this.clickElement.forEach((el, i) => {
      let keyMatch = [];
      this.interactionKeys.forEach(k => {
        el[k] == d.detail.data[k] ? keyMatch.push(true) : keyMatch.push(false);
      });
      keyMatch.every(v => v === true) ? (index = i) : null;
    });

    const newClicks = [...this.clickElement];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d.detail.data);
    }
    this.clickElement = newClicks;
  }
  onHoverFunc(ev) {
    this.hoverElement = ev.detail.data;
  }
  onMouseOut() {
    this.hoverElement = '';
  }

  onChangeFunc(d) {
    console.log(d);
  }

  changeData() {
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
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

  changeXAccessor() {
    this.xAccessor = this.xAccessor !== 'item' ? 'item' : 'otherItem';
  }

  changeYAccessor() {
    this.yAccessor = this.yAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    this.groupAccessor = this.groupAccessor !== 'group' ? 'group' : 'test';
    // this.groupAccessor = !this.groupAccessor ? 'group' : undefined;
    this.clickElement = [];
    this.changeKeys();
  }

  removeGroupAccessor() {
    this.groupAccessor = this.groupAccessor ? undefined : 'group';
  }

  changeXBaseline() {
    this.baselineX = this.baselineX !== true ? true : false;
  }

  changeYBaseline() {
    this.baselineY = this.baselineY !== true ? true : false;
  }
  toggleColors() {
    this.colors = this.colors ? undefined : ['#FAFFFF', '#FFFAFF', '#FFFFFA', '#FAFFFA'];
  }
  changeColorPalette() {
    this.colorPalette = this.colorPalette === 'categorical' ? 'diverging_RtoB' : 'categorical';
  }
  changeKeys() {
    this.interactionKeys =
      this.interactionKeys[0] === this.groupAccessor ? [this, this.yAccessor] : [this.groupAccessor];
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }
  render() {
    // console.log('!!!!app re-render');
    this.data = this.dataStorage[this.stateTrigger];
    return (
      <div>
        <div>
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
              this.changeXAccessor();
            }}
          >
            change xAccessor
          </button>
          <button
            onClick={() => {
              this.changeYAccessor();
            }}
          >
            change yAccessor
          </button>
          <button
            onClick={() => {
              this.changeGroupAccessor();
            }}
          >
            change groupAccessor
          </button>
          <button
            onClick={() => {
              this.changeGroupAccessor();
            }}
          >
            change groupAccessor
          </button>
          <button
            onClick={() => {
              this.removeGroupAccessor();
            }}
          >
            remove groupAccessor
          </button>
          <button
            onClick={() => {
              this.changeXBaseline();
            }}
          >
            change X baseline visibility
          </button>
          <button
            onClick={() => {
              this.changeYBaseline();
            }}
          >
            change Y baseline visibility
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
              this.changeColorPalette();
            }}
          >
            change color palette
          </button>
          <button
            onClick={() => {
              this.changeKeys();
            }}
          >
            change interaction keys
          </button>

          <button
            onClick={() => {
              this.toggleAnimations();
            }}
          >
            toggle animations
          </button>
          <scatter-plot
            // localization={{
            //   language: hu,
            //   numeralLocale: HU,
            //   skipValidation: false
            // }}
            // Chart Attributes (1/7)
            mainTitle={'Scatter Plot Default '}
            animationConfig={this.animations}
            // annotations={this.annotations}
            subTitle={'Interaction Style'}
            height={600}
            width={800}
            xAxis={this.xAxis}
            yAxis={this.yAxis}
            showTooltip={true}
            // yMinValueOverride={0}
            padding={this.padding}
            // zMinValueOverride={1}
            // zMaxValueOverride={50}
            // margin={{
            //   top: 30,
            //   bottom: 50,
            //   right: 50,
            //   left: 60
            // }}
            cursor={'pointer'}
            hoverOpacity={0.5}
            // colors={this.colors}
            colorPalette={this.colorPalette}
            dotSymbols={this.dotSymbols}
            data={this.data}
            xAccessor={this.xAccessor}
            yAccessor={this.yAccessor}
            sizeConfig={this.sizeConfig}
            // dotRadius={25}
            // dotOpacity={1}
            showBaselineX={this.baselineX}
            showBaselineY={this.baselineY}
            groupAccessor={this.groupAccessor}
            // groupAccessor={''}
            legend={{ visible: true, interactive: true }}
            dataLabel={this.dataLabel}
            dataKeyNames={this.dataKeyNames}
            interactionKeys={this.interactionKeys}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickEvent={d => this.onClickFunc(d)}
            onHoverEvent={d => this.onHoverFunc(d)}
            onMouseOutEvent={() => this.onMouseOut()}
            // onInitialLoadEvent={e => console.log('load event', e.detail, e)}
            // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
            // onDrawStartEvent={e => console.log('draw start event', e.detail, e)}
            // onDrawEndEvent={e => console.log('draw end event', e.detail, e)}
            // onTransitionEndEvent={e => console.log('transition event', e.detail, e)}
            // clickStyle={{
            //   strokeWidth: this.clickStrokeWidth,
            //   color: this.clickColor
            // }}
            // hoverStyle={{
            //   strokeWidth: this.hoverStrokeWidth,
            //   color: this.hoverColor
            // }}
            accessibility={this.accessibility}
            suppressEvents={this.suppressEvents}
          />
        </div>
      </div>
    );
  }
}
