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
  tag: 'app-clustered-bar-chart',
  styleUrl: 'app-clustered-bar-chart.scss'
})
export class AppClusteredBarChart {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() clickElement: any = [];
  @State() ordinalAccessor: any = 'item';
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'year';
  @State() legendLabels: any = [];
  @State() tooltipAccessor: any = 'item';
  @State() layout: string = 'vertical';

  @Element()
  appEl: HTMLElement;
  startData: any = [
    {
      year: '2016',
      otherCategory: '1990',
      otherGroup: 'D',
      otherValue: 15,
      item: 'A',
      value: -30,
      note: 'Worst performance in history.'
    },
    { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 27, item: 'A', value: 15 },
    { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 32, item: 'A', value: 4 },
    { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 15, item: 'A', value: 73 },
    { year: '2020', otherCategory: '1994', otherGroup: 'D', otherValue: 11, item: 'A', value: 64 },
    { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 25, item: 'B', value: -5 },
    { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 38, item: 'B', value: 23 },
    { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 41, item: 'B', value: 6 },
    { year: '2019', otherCategory: '1993', otherGroup: 'E', otherValue: 12, item: 'B', value: 21 },
    { year: '2020', otherCategory: '1994', otherGroup: 'E', otherValue: 54, item: 'B', value: 57 },
    { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 48, item: 'C', value: 22 },
    { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 31, item: 'C', value: 45 },
    { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 29, item: 'C', value: 78 },
    { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 13, item: 'C', value: 51 },
    { year: '2020', otherCategory: '1994', otherGroup: 'F', otherValue: 12, item: 'C', value: 8 }
  ];
  dataStorage: any = [
    this.startData,
    [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 15,
        item: 'A',
        value: -30,
        note: 'Worst performance in history.'
      },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 27, item: 'A', value: 15 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 32, item: 'A', value: 4 },
      { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 15, item: 'A', value: 73 },
      { year: '2020', otherCategory: '1994', otherGroup: 'D', otherValue: 11, item: 'A', value: 64 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 48, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 31, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 29, item: 'C', value: 78 },
      { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 13, item: 'C', value: 51 },
      { year: '2020', otherCategory: '1994', otherGroup: 'F', otherValue: 12, item: 'C', value: 8 }
    ],
    this.startData,
    [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 45,
        item: 'A',
        value: 30,
        note: 'Worst performance in history.'
      },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 17, item: 'A', value: 10 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 22, item: 'A', value: 14 },
      { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 5, item: 'A', value: 43 },
      { year: '2020', otherCategory: '1994', otherGroup: 'D', otherValue: 21, item: 'A', value: 37 },
      { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 75, item: 'B', value: 10 },
      { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 28, item: 'B', value: 13 },
      { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 11, item: 'B', value: 26 },
      { year: '2019', otherCategory: '1993', otherGroup: 'E', otherValue: 52, item: 'B', value: 31 },
      { year: '2020', otherCategory: '1994', otherGroup: 'E', otherValue: 34, item: 'B', value: 17 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 18, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 5, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 69, item: 'C', value: 38 },
      { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 33, item: 'C', value: 5 },
      { year: '2020', otherCategory: '1994', otherGroup: 'F', otherValue: 12, item: 'C', value: 18 }
    ],
    [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 45,
        item: 'A',
        value: 30,
        note: 'Worst performance in history.'
      },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 17, item: 'A', value: 10 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 22, item: 'A', value: 14 },
      { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 5, item: 'A', value: 43 },
      { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 75, item: 'B', value: 10 },
      { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 28, item: 'B', value: 13 },
      { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 11, item: 'B', value: 26 },
      { year: '2019', otherCategory: '1993', otherGroup: 'E', otherValue: 52, item: 'B', value: 31 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 18, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 5, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 69, item: 'C', value: 38 },
      { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 33, item: 'C', value: 5 }
    ],
    [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 45,
        item: 'A',
        value: 30,
        note: 'Worst performance in history.'
      },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 17, item: 'A', value: 10 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 22, item: 'A', value: 14 },
      { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 5, item: 'A', value: 43 },
      { year: '2020', otherCategory: '1994', otherGroup: 'D', otherValue: 21, item: 'A', value: 37 },
      { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 75, item: 'B', value: 10 },
      { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 28, item: 'B', value: 13 },
      { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 11, item: 'B', value: 26 },
      { year: '2019', otherCategory: '1993', otherGroup: 'E', otherValue: 52, item: 'B', value: 31 },
      { year: '2020', otherCategory: '1994', otherGroup: 'E', otherValue: 34, item: 'B', value: 17 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 18, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 5, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 69, item: 'C', value: 38 },
      { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 33, item: 'C', value: 5 },
      { year: '2020', otherCategory: '1994', otherGroup: 'F', otherValue: 12, item: 'C', value: 18 }
    ],
    [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 45,
        item: 'A',
        value: 30,
        note: 'Worst performance in history.'
      },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 17, item: 'A', value: 10 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 22, item: 'A', value: 14 },
      { year: '2019', otherCategory: '1993', otherGroup: 'D', otherValue: 5, item: 'A', value: 43 },
      { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 75, item: 'B', value: 10 },
      { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 28, item: 'B', value: 13 },
      { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 11, item: 'B', value: 26 },
      { year: '2019', otherCategory: '1993', otherGroup: 'E', otherValue: 52, item: 'B', value: 31 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 18, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 5, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 69, item: 'C', value: 38 },
      { year: '2019', otherCategory: '1993', otherGroup: 'F', otherValue: 33, item: 'C', value: 5 }
    ]
  ];

  componentWillUpdate() {
    // console.log('will update', this.clickElement);
  }
  onClickFunc(d) {
    const index = this.clickElement.indexOf(d.detail);
    if (index > -1) {
      this.clickElement.splice(index, 1);
    } else {
      this.clickElement.push(d.detail);
    }
    this.data = [
      { year: '2017', item: 'A', value: 15 },
      { year: '2018', item: 'A', value: 4 },
      { year: '2019', item: 'A', value: 73 },
      { year: '2020', item: 'A', value: 64 },
      { year: '2017', item: 'B', value: 23 },
      { year: '2018', item: 'B', value: 6 },
      { year: '2019', item: 'B', value: 21 },
      { year: '2020', item: 'B', value: 57 },
      { year: '2017', item: 'C', value: 45 },
      { year: '2018', item: 'C', value: 78 },
      { year: '2019', item: 'C', value: 51 },
      { year: '2020', item: 'C', value: 8 }
    ];
  }
  onHoverFunc(d) {
    this.hoverElement = d.detail;
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
  changeOrdinalAccessor() {
    this.ordinalAccessor = this.ordinalAccessor !== 'item' ? 'item' : 'otherGroup';
    console.log(this.ordinalAccessor);
  }

  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeGroupAccessor() {
    this.groupAccessor = this.groupAccessor !== 'year' ? 'year' : 'otherCategory';
  }
  changeLegendLabel() {
    this.legendLabels = this.legendLabels[0] === 'different' ? [] : ['different', 'legend', 'label'];
  }
  changeTooltipAccessor() {
    this.tooltipAccessor = this.tooltipAccessor !== 'item' ? 'item' : 'otherGroup';
  }
  changeLayout() {
    this.layout = this.layout === 'vertical' ? 'horizontal' : 'vertical';
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
              this.changeOrdinalAccessor();
            }}
          >
            change ordinalAccessor
          </button>
          <button
            onClick={() => {
              this.changeValueAccessor();
            }}
          >
            change valueAccessor
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
              this.changeLegendLabel();
            }}
          >
            changeLegendLabel
          </button>
          <button
            onClick={() => {
              this.changeTooltipAccessor();
            }}
          >
            change tooltip accessor
          </button>
          <button
            onClick={() => {
              this.changeLayout();
            }}
          >
            change layout
          </button>
        </div>
        <clustered-bar-chart
          mainTitle={'Bar Chart in app '}
          subTitle={'example'}
          height={400}
          width={800}
          yAxis={{
            visible: true,
            gridVisible: true,
            label: 'y axis',
            format: '0.0[a]'
          }}
          padding={{
            top: 20,
            left: 100,
            right: 30,
            bottom: 50
          }}
          data={this.data}
          layout={this.layout}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          groupAccessor={this.groupAccessor}
          tooltipLabel={{
            labelAccessor: ['year', this.tooltipAccessor, 'value'],
            labelTitle: ['', this.tooltipAccessor, 'Transaction'],
            format: ['', '', '$0[.][0]a']
          }}
          dataLabel={{ visible: true, placement: 'bottom', labelAccessor: 'value', format: '0.0[a]' }}
          colorPalette={'categorical'}
          cursor={'pointer'}
          hoverOpacity={0.2}
          legend={{ labels: this.legendLabels, visible: true, interactive: true }}
          clickStyle={{ strokeWidth: '2px' }}
          interactionKeys={['item', 'year']}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickFunc={d => this.onClickFunc(d)}
          onHoverFunc={d => this.onHoverFunc(d)}
          onMouseOutFunc={() => this.onMouseOut()}
          showTooltip={true}
          accessibility={{
            includeDataKeyNames: true,
            elementDescriptionAccessor: 'note', // see Indonesia above
            longDescription:
              'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
            contextExplanation: "This chart displays three arbitrary groups' values over 5 years",
            executiveSummary: 'Groups A and B ended 2016 in a deficit but saw dramatic growth by 2020',
            purpose:
              'The purpose of this chart template is to provide an example of a clustered bar chart with negative values',
            structureNotes:
              'The bar clusters are sorted chronologically by year. The color of each bar communicates what group they belong to. ',
            statisticalNotes: 'This chart is using dummy data',
            onChangeFunc: d => {
              this.onChangeFunc(d);
            }
          }}
        />
        {/* <clustered-bar-chart
          mainTitle={'Clustered Bar Chart Default'}
          subTitle={'Interaction Pattern'}
          height={400}
          width={800}
          yAxis={{
            visible: true,
            label: 'y axis',
            format: '0.0[a]'
          }}
          padding={{
            top: 20,
            left: 100,
            right: 30,
            bottom: 50
          }}
          data = {this.data}
          // data={[
          //   { year: '2016', item: 'A', value: -30 },
          //   { year: '2017', item: 'A', value: 15 },
          //   { year: '2018', item: 'A', value: 4 },
          //   { year: '2019', item: 'A', value: 73 },
          //   { year: '2020', item: 'A', value: 64 },
          //   { year: '2016', item: 'B', value: -5 },
          //   { year: '2017', item: 'B', value: 23 },
          //   { year: '2018', item: 'B', value: 6 },
          //   { year: '2019', item: 'B', value: 21 },
          //   { year: '2020', item: 'B', value: 57 },
          //   { year: '2016', item: 'C', value: 22 },
          //   { year: '2017', item: 'C', value: 45 },
          //   { year: '2018', item: 'C', value: 78 },
          //   { year: '2019', item: 'C', value: 51 },
          //   { year: '2020', item: 'C', value: 8 }
          // ]}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          groupAccessor={this.groupAccessor}
          cursor={'pointer'}
          legend={{ visible: true, interactive: true }}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickFunc={d => this.onClickFunc(d)}
          onHoverFunc={d => this.onHoverFunc(d)}
          onMouseOutFunc={() => this.onMouseOut()}
          accessibility={{
            elementDescriptionAccessor: 'note', // see Indonesia above
            longDescription:
              'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
            contextExplanation: "This chart displays three arbitraty groups' values over 5 years",
            executiveSummary: 'Groups A and B ended 2016 in a deficit but saw dramatic growth by 2020',
            purpose:
              'The purpose of this chart template is to provide an example of a clustered bar chart with negative values',
            structureNotes:
              'The bar clusters are sorted chronologically by year. The color of each bar communicates what group they belong to. ',
            statisticalNotes: 'This chart is using dummy data'
          }}
        />
        */}
      </div>
    );
  }
}
