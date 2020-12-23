/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
@Component({
  tag: 'app-scatter-plot',
  styleUrl: 'app-scatter-plot.scss'
})
export class AppScatterPlot {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() xAccessor: any = 'item';
  @State() yAccessor: any = 'value';
  @State() groupAccessor: any = 'group';
  @State() baselineX: any = false;
  @State() baselineY: any = false;
  @State() colors: any = ['#FEFEFF', '#FEFFFE', '#FFFEFE', '#FFFEFF'];
  @State() colorPalette: string = 'diverging_RtoB';
  @State() clickStroke: string = 'green';
  @State() clickStrokeWidth: number = 1.5;
  @State() clickColor: string = '#2e3047';
  @State() hoverStroke: string = 'white';
  @State() hoverStrokeWidth: number = 1;
  @State() hoverColor: string = '#8CD6C2';
  @State() interactionKeys: any = ['group'];

  @State() clickElement: any = [];
  startData: any = [
    { item: 1, otherItem: 234, group: 'A', value: -2700, otherValue: 235, test: 'A' },
    { item: 2, otherItem: 164, group: 'A', value: 1000, otherValue: 1235, test: 'B' },
    { item: -30, otherItem: 84, group: 'A', value: 4004, otherValue: 895, test: 'C' }
  ];
  dataStorage: any = [
    this.startData,
    [
      { item: 1, otherItem: 2, group: 'A', value: 2700, otherValue: 135, test: 'A' },
      { item: 2, otherItem: 7, group: 'A', value: 1000, otherValue: 35, test: 'B' },
      { item: 3, otherItem: 8, group: 'A', value: 4004, otherValue: 435, test: 'B' },
      { item: 4, otherItem: 11, group: 'B', value: 2454, otherValue: 95, test: 'B' },
      { item: 5, otherItem: 9, group: 'B', value: 2213, otherValue: 175, test: 'B' },
      { item: 6, otherItem: 4, group: 'B', value: 1114, otherValue: 615, test: 'A' }
    ],
    [
      { item: 1, otherItem: 2, group: 'A', value: 2700, otherValue: 135, test: 'A' },
      { item: 2, otherItem: 7, group: 'A', value: 1000, otherValue: 275, test: 'B' },
      { item: 3, otherItem: 8, group: 'A', value: 4004, otherValue: 385, test: 'B' },
      { item: 4, otherItem: 1, group: 'B', value: 2454, otherValue: 715, test: 'B' },
      { item: 5, otherItem: 9, group: 'B', value: 22135, otherValue: 363, test: 'B' },
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
  @Element()
  appEl: HTMLElement;
  componentWillUpdate() {
    // console.log("will update", this.clickElement);
  }
  onClickFunc(ev) {
    const d = ev.detail;
    if (d) {
      const newClicks = [...this.clickElement];
      const keys = Object.keys(d);
      const index = this.clickElement.findIndex(o => {
        let conditionsMet = 0;
        keys.forEach(key => {
          conditionsMet += o[key] === d[key] ? 1 : 0;
        });
        return conditionsMet && conditionsMet === keys.length;
      });
      if (index > -1) {
        newClicks.splice(index, 1);
      } else {
        newClicks.push(d);
      }
      this.clickElement = newClicks;
    }
  }
  onHoverFunc(ev) {
    this.hoverElement = ev.detail;
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

  changeXAccessor() {
    this.xAccessor = this.xAccessor !== 'item' ? 'item' : 'otherItem';
  }

  changeYAccessor() {
    this.yAccessor = this.yAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    this.groupAccessor = this.groupAccessor !== 'group' ? 'group' : 'test';
    // this.groupAccessor = !this.groupAccessor ? 'group' : undefined;
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
  render() {
    console.log('!!!!app re-render');
    this.data = this.dataStorage[this.stateTrigger];
    return (
      <div>
        <div>
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
          <scatter-plot
            // Chart Attributes (1/7)
            mainTitle={'Scatter Plot Default '}
            subTitle={'Interaction Style'}
            height={400}
            width={800}
            xAxis={{ visible: true, gridVisible: false, label: 'Age', format: '0' }}
            yAxis={{ visible: true, gridVisible: true, label: 'Monthly Spending', format: '$0[a]' }}
            showTooltip={true}
            // yMinValueOverride={0}
            padding={{
              top: 20,
              left: 60,
              right: 50,
              bottom: 50
            }}
            cursor={'pointer'}
            hoverOpacity={1}
            colors={this.colors}
            colorPalette={this.colorPalette}
            dotSymbols={['star', 'square', 'cross', 'circle', 'star']}
            data={this.data}
            xAccessor={this.xAccessor}
            yAccessor={this.yAccessor}
            dotRadius={25}
            dotOpacity={1}
            showBaselineX={this.baselineX}
            showBaselineY={this.baselineY}
            groupAccessor={this.groupAccessor}
            legend={{ visible: true }}
            dataLabel={{ visible: true, placement: 'right', labelAccessor: 'value', format: '0.0[a]' }}
            interactionKeys={this.interactionKeys}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickFunc={d => this.onClickFunc(d)}
            onHoverFunc={d => this.onHoverFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
            clickStyle={{
              strokeWidth: this.clickStrokeWidth,
              color: this.clickColor
            }}
            hoverStyle={{
              strokeWidth: this.hoverStrokeWidth,
              color: this.hoverColor
            }}
            accessibility={{
              longDescription:
                'This is a chart template that was made to showcase the Visa Chart Components scatter plot',
              contextExplanation:
                'This chart exists in a demo app created to let you quickly change props and see results',
              executiveSummary: 'We see high monthly spending between 35 to 45 age group',
              purpose: 'The purpose of this chart template is to provide an example of a scatter plot',
              structureNotes: 'Monthly spending of different age groups',
              statisticalNotes: 'This chart is using dummy data',
              onChangeFunc: d => {
                this.onChangeFunc(d);
              }
            }}
          />
        </div>
      </div>
    );
  }
}
