/**
 * Copyright (c) 2020, 2021, 2022, 2023, 2024 Visa, Inc.
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
  tag: 'app-line-chart',
  styleUrl: 'app-line-chart.scss'
})
export class AppLineChart {
  @State() data: any;
  @State() secondData: any;
  @State() stateTrigger: any = 1;
  @State() hoverElement: any = '';
  @State() secondaryHoverElement: any = '';
  @State() secondaryHover: any = '';
  @State() clickElement: any = [
    // {
    // date: new Date('2017-01-01'),
    // otherOrd: '13',
    // otherCat: 'ABC',
    // otherVal: 100,
    // category: 'Card A',
    // value: 7670994739
    // }
  ];
  @State() secondaryClick: any = [];
  @State() yAxis: any = { visible: true, gridVisible: true, label: 'Score', format: '0[.][0]' };
  @State() ordinalAccessor: any = 'date';
  @State() valueAccessor: any = 'value';
  @State() seriesAccessor: any = 'category';
  @State() seriesLabel: any = { visible: true, placement: 'auto' };
  @State() dataLabel: any = {
    visible: true,
    placement: 'auto',
    displayOnly: ['last'], // all | first | last | min | max
    labelAccessor: this.valueAccessor,
    format: '0.0[a]'
  };
  @State() height: any = 300;
  @State() interactionKeys: any = [this.ordinalAccessor];
  @State() secondaryKey: any = 'Card B';
  @State() secondaryOpacity: any = 1;
  @State() secondaryDataLabel: any = true;
  @State() secondarySeriesLabel: any = true;
  @State() unit: any = 'month';
  @State() animations: any = { disabled: true };
  @State() annotations: any = [
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
  ];
  @State() tooltipLabel: any = {
    format: '',
    labelAccessor: [this.ordinalAccessor],
    labelTitle: [this.ordinalAccessor]
  };
  // @State() colors: any = [
  //   '#2e2e2e',
  //   '#434343',
  //   '#595959',
  //   '#717171',
  //   '#898989',
  //   '#a3a3a3',
  //   '#bdbdbd',
  //   '#d7d7d7',
  //   '#f2f2f2']
  // colorsBase: any = ['#2e2e2e',
  // '#434343',
  // '#595959',
  // '#717171',
  // '#898989',
  // '#a3a3a3',
  // '#bdbdbd',
  // '#d7d7d7',
  // '#f2f2f2']
  @State() colors: any = [
    '#f2f2f2',
    '#d7d7d7',
    '#bdbdbd',
    '#a3a3a3',
    '#898989',
    '#717171',
    '#595959',
    '#434343',
    '#2e2e2e'
  ];
  @State() accessibility: any = {
    longDescription: 'This is a chart template that was made to showcase the Visa Chart Components line plot',
    contextExplanation: 'This chart exists in a demo app created to let you quickly change props and see results',
    executiveSummary:
      'Within the category peer subset, we see the largest difference between high spend and millennials',
    purpose: 'The purpose of this chart template is to provide an example of a line plot',
    structureNotes:
      'The percentage of each high spenders, millennials, and all groups are shown as points in each of the four categories. These points of each group are connected by lines.',
    statisticalNotes: 'This chart is using dummy data',
    onChangeFunc: d => {
      this.onChangeFunc(d);
    },
    elementsAreInterface: false,
    disableValidation: true,
    keyboardNavConfig: { disabled: false }
  };
  @State() suppressEvents: boolean = false;
  @State() theWorstDataEver: any;
  smashIt: boolean = true;
  seriesLimit: number = 10;
  dataPoints: number = 24;
  hoverStyle: any = { color: '#d7d7d7', strokeWidth: 2 };
  clickStyle: any = { color: '#FFC4C4', strokeWidth: 5 };
  simpleColors: any = ['#FFC4C4', '#C4DAFF'];
  colorsBase: any = ['#f2f2f2', '#d7d7d7', '#bdbdbd', '#a3a3a3', '#898989', '#717171', '#595959', '#434343', '#2e2e2e'];
  selectedColor: string = '#00CF81';
  hoveredColor: string = '#0068FF';
  colorIndexes: any = {};
  breakTestData: any = [
    {
      ordinal: 'a',
      value: null,
      series: '1'
    },
    {
      ordinal: 'a',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'b',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'c',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'd',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'e',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'f',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'g',
      value: null,
      series: '1'
    },
    {
      ordinal: 'a',
      value: 2,
      series: '2'
    },
    {
      ordinal: 'b',
      value: 2,
      series: '2'
    },
    {
      ordinal: 'c',
      value: null,
      series: '2'
    },
    {
      ordinal: 'd',
      value: null,
      series: '2'
    },
    {
      ordinal: 'e',
      value: 2,
      series: '2'
    },
    {
      ordinal: 'f',
      value: null,
      series: '2'
    },
    {
      ordinal: 'g',
      value: 2,
      series: '2'
    }
  ];
  dashTestData: any = [
    {
      ordinal: 'a',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'b',
      value: 1,
      series: '1'
    },
    {
      ordinal: 'a',
      value: 2,
      series: '2'
    },
    {
      ordinal: 'b',
      value: 2,
      series: '2'
    },
    {
      ordinal: 'a',
      value: 3,
      series: '3'
    },
    {
      ordinal: 'b',
      value: 3,
      series: '3'
    },
    {
      ordinal: 'a',
      value: 4,
      series: '4'
    },
    {
      ordinal: 'b',
      value: 4,
      series: '4'
    },
    {
      ordinal: 'a',
      value: 5,
      series: '5'
    },
    {
      ordinal: 'b',
      value: 5,
      series: '5'
    },
    {
      ordinal: 'a',
      value: 6,
      series: 'secondary'
    },
    {
      ordinal: 'b',
      value: 6,
      series: 'secondary'
    }
  ];
  collisionTestData: any = [
    {
      ordinal: new Date('2016-01-01'),
      value: 100000,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 110000,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 120000,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 130000,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100004,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100005,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100006,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100007,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100008,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100009,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 100010,
      series: '1'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 200010,
      series: '2'
    },
    {
      ordinal: new Date('2016-01-01'),
      value: 500010,
      series: '3'
    },
    {
      ordinal: new Date('2016-02-01'),
      value: 990000,
      series: '1'
    },
    {
      ordinal: new Date('2016-02-01'),
      value: 965000,
      series: '2'
    },
    {
      ordinal: new Date('2016-02-01'),
      value: 945000,
      series: '3'
    }
  ];
  startData: any = [
    {
      date: new Date('2016-01-01'),
      otherOrd: '1',
      otherCat: 'ABC',
      otherVal: 100,
      category: 'Card A',
      value: null
    },
    {
      date: new Date('2016-02-01'),
      otherOrd: '2',
      otherCat: 'ABC',
      otherVal: 220,
      category: 'Card A',
      value: null
    },
    {
      date: new Date('2016-03-01'),
      otherOrd: '3',
      otherCat: 'ABC',
      otherVal: 680,
      category: 'Card A',
      value: 8358837379
    },
    {
      date: new Date('2016-04-01'),
      otherOrd: '4',
      otherCat: 'ABC',
      otherVal: 923,
      category: 'Card A',
      value: 8334842966
    },
    {
      date: new Date('2016-05-01'),
      otherOrd: '5',
      otherCat: 'ABC',
      otherVal: 542,
      category: 'Card A',
      value: 8588600035
    },
    {
      date: new Date('2016-06-01'),
      otherOrd: '6',
      otherCat: 'ABC',
      otherVal: 452,
      category: 'Card A',
      value: 8484192554
    },
    {
      date: new Date('2016-07-01'),
      otherOrd: '7',
      otherCat: 'ABC',
      otherVal: 300,
      category: 'Card A',
      value: 8778636197
    },
    {
      date: new Date('2016-08-01'),
      otherOrd: '8',
      otherCat: 'ABC',
      otherVal: 200,
      category: 'Card A',
      value: 8811163096
    },
    {
      date: new Date('2016-09-01'),
      otherOrd: '9',
      otherCat: 'ABC',
      otherVal: 100,
      category: 'Card A',
      value: 8462148898
    },
    {
      date: new Date('2016-10-01'),
      otherOrd: '10',
      otherCat: 'ABC',
      otherVal: 100,
      category: 'Card A',
      value: 9051933407
    },
    {
      date: new Date('2016-11-01'),
      otherOrd: '11',
      otherCat: 'ABC',
      otherVal: 150,
      category: 'Card A',
      value: 8872849978
    },
    {
      date: new Date('2016-12-01'),
      otherOrd: '12',
      otherCat: 'ABC',
      otherVal: 150,
      category: 'Card A',
      value: 9709829820
    },
    {
      date: new Date('2017-01-01'),
      otherOrd: '13',
      otherCat: 'ABC',
      otherVal: 100,
      category: 'Card A',
      value: 7670994739
    },
    {
      date: new Date('2017-02-01'),
      otherOrd: '14',
      otherCat: 'ABC',
      otherVal: 100,
      category: 'Card A',
      value: 5670994739
    },
    {
      date: new Date('2016-01-01'),
      otherOrd: '1',
      otherCat: 'DEF',
      otherVal: 150,
      category: 'Card B',
      value: 6570994739
    },
    {
      date: new Date('2016-02-01'),
      otherOrd: '2',
      otherCat: 'DEF',
      otherVal: 250,
      category: 'Card B',
      value: 4628909842
    },
    {
      date: new Date('2016-03-01'),
      otherOrd: '3',
      otherCat: 'DEF',
      otherVal: 400,
      category: 'Card B',
      value: 4358837379
    },
    {
      date: new Date('2016-04-01'),
      otherOrd: '4',
      otherCat: 'DEF',
      otherVal: 500,
      category: 'Card B',
      value: 5534842966
    },
    {
      date: new Date('2016-05-01'),
      otherOrd: '5',
      otherCat: 'DEF',
      otherVal: 700,
      category: 'Card B',
      value: 4388600035
    },
    {
      date: new Date('2016-06-01'),
      otherOrd: '6',
      otherCat: 'DEF',
      otherVal: 800,
      category: 'Card B',
      value: 3484192554
    },
    {
      date: new Date('2016-07-01'),
      otherOrd: '7',
      otherCat: 'DEF',
      otherVal: 800,
      category: 'Card B',
      value: 3578636197
    },
    {
      date: new Date('2016-08-01'),
      otherOrd: '8',
      otherCat: 'DEF',
      otherVal: 500,
      category: 'Card B',
      value: 6411163096
    },
    {
      date: new Date('2016-09-01'),
      otherOrd: '9',
      otherCat: 'DEF',
      otherVal: 670,
      category: 'Card B',
      value: 5262148898
    },
    {
      date: new Date('2016-10-01'),
      otherOrd: '10',
      otherCat: 'DEF',
      otherVal: 850,
      category: 'Card B',
      value: 4651933407
    },
    {
      date: new Date('2016-11-01'),
      otherOrd: '11',
      otherCat: 'DEF',
      otherVal: 850,
      category: 'Card B',
      value: null
    },
    {
      date: new Date('2016-12-01'),
      otherOrd: '12',
      otherCat: 'DEF',
      otherVal: 940,
      category: 'Card B',
      value: 5609829820
    },
    {
      date: new Date('2017-01-01'),
      otherOrd: '13',
      otherCat: 'DEF',
      otherVal: 150,
      category: 'Card B',
      value: 6570994739
    },
    {
      date: new Date('2017-02-01'),
      otherOrd: '14',
      otherCat: 'DEF',
      otherVal: 150,
      category: 'Card B',
      value: 5570994739
    }
  ];
  dataStorage: any = [
    [
      {
        date: new Date('2017-01-01'),
        otherOrd: '13',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2017-02-01'),
        otherOrd: '14',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 5670994739
      },
      {
        date: new Date('2017-01-01'),
        otherOrd: '13',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2017-02-01'),
        otherOrd: '14',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 5570994739
      }
    ],
    this.startData,
    [
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'ABC',
        otherVal: 800,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'ABC',
        otherVal: 500,
        category: 'Card A',
        value: 7628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'ABC',
        otherVal: 670,
        category: 'Card A',
        value: 8358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 8334842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'ABC',
        otherVal: 220,
        category: 'Card A',
        value: 8588600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'ABC',
        otherVal: 680,
        category: 'Card A',
        value: 8484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'ABC',
        otherVal: 923,
        category: 'Card A',
        value: 8778636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'ABC',
        otherVal: 542,
        category: 'Card A',
        value: 8811163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'ABC',
        otherVal: 452,
        category: 'Card A',
        value: 8462148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'ABC',
        otherVal: 300,
        category: 'Card A',
        value: 9051933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'ABC',
        otherVal: 200,
        category: 'Card A',
        value: null
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 9709829820
      },
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 4628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'DEF',
        otherVal: 940,
        category: 'Card B',
        value: 4358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'DEF',
        otherVal: 100,
        category: 'Card B',
        value: 5534842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 4388600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3578636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'DEF',
        otherVal: 250,
        category: 'Card B',
        value: 6411163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'DEF',
        otherVal: 400,
        category: 'Card B',
        value: 5262148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 4651933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'DEF',
        otherVal: 700,
        category: 'Card B',
        value: 6772849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'DEF',
        otherVal: 800,
        category: 'Card B',
        value: 5609829820
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'ABC',
        otherVal: 800,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'ABC',
        otherVal: 500,
        category: 'Card A',
        value: 7628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'ABC',
        otherVal: 670,
        category: 'Card A',
        value: 8358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 8334842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'ABC',
        otherVal: 220,
        category: 'Card A',
        value: 8588600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'ABC',
        otherVal: 680,
        category: 'Card A',
        value: 8484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'ABC',
        otherVal: 923,
        category: 'Card A',
        value: 8778636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'ABC',
        otherVal: 542,
        category: 'Card A',
        value: 8811163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'ABC',
        otherVal: 452,
        category: 'Card A',
        value: 8462148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'ABC',
        otherVal: 300,
        category: 'Card A',
        value: 9051933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'ABC',
        otherVal: 200,
        category: 'Card A',
        value: 8872849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 9709829820
      },
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 4628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'DEF',
        otherVal: 940,
        category: 'Card B',
        value: 4358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'DEF',
        otherVal: 100,
        category: 'Card B',
        value: null
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 4388600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3578636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'DEF',
        otherVal: 250,
        category: 'Card B',
        value: 6411163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'DEF',
        otherVal: 400,
        category: 'Card B',
        value: 5262148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 4651933407
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'DEF',
        otherVal: 800,
        category: 'Card B',
        value: 5609829820
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 4628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'DEF',
        otherVal: 940,
        category: 'Card B',
        value: 4358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'DEF',
        otherVal: 100,
        category: 'Card B',
        value: 5534842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 4388600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3578636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'DEF',
        otherVal: 250,
        category: 'Card B',
        value: 6411163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'DEF',
        otherVal: 400,
        category: 'Card B',
        value: 5262148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 4651933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'DEF',
        otherVal: 700,
        category: 'Card B',
        value: 6772849978
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'ABC',
        otherVal: 800,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'ABC',
        otherVal: 500,
        category: 'Card A',
        value: 7628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'ABC',
        otherVal: 670,
        category: 'Card A',
        value: 8358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 8334842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'ABC',
        otherVal: 220,
        category: 'Card A',
        value: 8588600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'ABC',
        otherVal: 680,
        category: 'Card A',
        value: 8484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'ABC',
        otherVal: 923,
        category: 'Card A',
        value: 8778636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'ABC',
        otherVal: 542,
        category: 'Card A',
        value: 8811163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'ABC',
        otherVal: 452,
        category: 'Card A',
        value: 8462148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'ABC',
        otherVal: 300,
        category: 'Card A',
        value: 9051933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'ABC',
        otherVal: 200,
        category: 'Card A',
        value: 8872849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 9709829820
      },
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 4628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'DEF',
        otherVal: 940,
        category: 'Card B',
        value: 4358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'DEF',
        otherVal: 100,
        category: 'Card B',
        value: 5534842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 4388600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 3578636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'DEF',
        otherVal: 250,
        category: 'Card B',
        value: 6411163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'DEF',
        otherVal: 400,
        category: 'Card B',
        value: 5262148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 4651933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'DEF',
        otherVal: 700,
        category: 'Card B',
        value: 6772849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'DEF',
        otherVal: 800,
        category: 'Card B',
        value: 5609829820
      }
    ],
    this.startData,
    [
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'ABC',
        otherVal: 220,
        category: 'Card A',
        value: 7628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'ABC',
        otherVal: 680,
        category: 'Card A',
        value: 8358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'ABC',
        otherVal: 923,
        category: 'Card A',
        value: 8334842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'ABC',
        otherVal: 542,
        category: 'Card A',
        value: 8588600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'ABC',
        otherVal: 452,
        category: 'Card A',
        value: 8484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'ABC',
        otherVal: 300,
        category: 'Card A',
        value: 8778636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'ABC',
        otherVal: 200,
        category: 'Card A',
        value: 8811163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 8462148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 9051933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'ABC',
        otherVal: 150,
        category: 'Card A',
        value: 8872849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'ABC',
        otherVal: 150,
        category: 'Card A',
        value: 9709829820
      },
      {
        date: new Date('2017-01-01'),
        otherOrd: '13',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 7670994739
      },
      {
        date: new Date('2017-02-01'),
        otherOrd: '14',
        otherCat: 'ABC',
        otherVal: 100,
        category: 'Card A',
        value: 6670994739
      },
      {
        date: new Date('2016-01-01'),
        otherOrd: '1',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2016-02-01'),
        otherOrd: '2',
        otherCat: 'DEF',
        otherVal: 250,
        category: 'Card B',
        value: 4628909842
      },
      {
        date: new Date('2016-03-01'),
        otherOrd: '3',
        otherCat: 'DEF',
        otherVal: 400,
        category: 'Card B',
        value: 4358837379
      },
      {
        date: new Date('2016-04-01'),
        otherOrd: '4',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 5534842966
      },
      {
        date: new Date('2016-05-01'),
        otherOrd: '5',
        otherCat: 'DEF',
        otherVal: 700,
        category: 'Card B',
        value: 4388600035
      },
      {
        date: new Date('2016-06-01'),
        otherOrd: '6',
        otherCat: 'DEF',
        otherVal: 800,
        category: 'Card B',
        value: 3484192554
      },
      {
        date: new Date('2016-07-01'),
        otherOrd: '7',
        otherCat: 'DEF',
        otherVal: 800,
        category: 'Card B',
        value: 3578636197
      },
      {
        date: new Date('2016-08-01'),
        otherOrd: '8',
        otherCat: 'DEF',
        otherVal: 500,
        category: 'Card B',
        value: 6411163096
      },
      {
        date: new Date('2016-09-01'),
        otherOrd: '9',
        otherCat: 'DEF',
        otherVal: 670,
        category: 'Card B',
        value: 5262148898
      },
      {
        date: new Date('2016-10-01'),
        otherOrd: '10',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 4651933407
      },
      {
        date: new Date('2016-11-01'),
        otherOrd: '11',
        otherCat: 'DEF',
        otherVal: 850,
        category: 'Card B',
        value: 6772849978
      },
      {
        date: new Date('2016-12-01'),
        otherOrd: '12',
        otherCat: 'DEF',
        otherVal: 940,
        category: 'Card B',
        value: 5609829820
      },
      {
        date: new Date('2017-01-01'),
        otherOrd: '13',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 6570994739
      },
      {
        date: new Date('2017-02-01'),
        otherOrd: '14',
        otherCat: 'DEF',
        otherVal: 150,
        category: 'Card B',
        value: 2570994739
      }
    ]
  ];
  secondStorage: any;
  clickedIndex: number = -1;
  hoveredIndex: number = -1;
  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    date: 'Line Date',
    value: 'Named Value'
  };

  componentWillLoad() {
    this.theWorstDataEver = this.generateTheWorstDataEver();
  }
  componentWillUpdate() {
    // console.log("will update", this.clickElement);
  }
  generateTheWorstDataEver() {
    const newNightmare = [];
    const startTime = new Date().getTime();
    let s = 0;
    for (s = 0; s < this.seriesLimit; s++) {
      let i = 0;
      for (i = 0; i < this.dataPoints; i++) {
        const ordinal =
          i && i !== this.dataPoints - 1
            ? new Date(startTime + Math.random() * 10000000000)
            : i
            ? new Date(startTime + 10000000000)
            : new Date(startTime);
        newNightmare.push({
          ordinal,
          series: s,
          value: !(this.smashIt && !i && !s) ? Math.random() : 10
        });
      }
    }
    return newNightmare;
  }
  prepareColor(d, e) {
    // first check if array already has click color... if so then we remove!
    const colorArray = [...this.colors];
    const index = this.colorIndexes[d.category];
    if (e === 'selectedColor') {
      if (this.clickedIndex === index) {
        colorArray[index] = index === this.hoveredIndex ? this.hoveredColor : this.colorsBase[index];
        this.clickedIndex = -1;
      } else {
        colorArray[this.clickedIndex] = this.colorsBase[this.clickedIndex];
        this.clickedIndex = index;
        colorArray[index] = this[e];
      }
    } else if (this.hoveredIndex === index) {
      colorArray[index] = this.colorsBase[index];
      this.hoveredIndex = -1;
    } else {
      this.hoveredIndex = index;
      colorArray[index] = this[e];
    }
    this.colors = colorArray;
  }

  onClickFunc(d) {
    let index = -1;
    this.clickElement.forEach((el, i) => {
      let keyMatch = [];
      this.interactionKeys.forEach(k => {
        k == 'date'
          ? el[k].getTime() == d.detail.data[k].getTime()
            ? keyMatch.push(true)
            : keyMatch.push(false)
          : el[k] == d.detail.data[k]
          ? keyMatch.push(true)
          : keyMatch.push(false);
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
  onHoverFunc(d) {
    this.hoverElement = d.detail.data;
  }
  onMouseOut = () => {
    this.hoverElement = '';
  };
  secondaryHoverFunc(ev) {
    const d = ev.detail.data;
    this.seriesLabel = { visible: true, placement: 'right' };
    this.secondaryHover = d;
    this.prepareColor(d, 'hoveredColor');
  }
  secondaryMouseOut() {
    const duplicate = { ...this.secondaryHover };
    this.secondaryHover = '';
    this.secondaryHoverElement = '';
    this.seriesLabel = { visible: false, placement: 'right' };
    // const colorArray = [...this.colors];
    // const index = colorArray.indexOf(this.hoveredColor);
    // colorArray.splice(index, 1, this.colorsBase[index]);
    this.prepareColor(duplicate, 'hoveredColor');
    // this.colors = colorArray;
  }
  onChangeFunc(d) {
    console.log(d);
  }
  changeData() {
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
  }
  backData() {
    this.stateTrigger = this.stateTrigger > 0 ? this.stateTrigger - 1 : this.dataStorage.length - 1;
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
  changeOrdinalAccessor() {
    this.ordinalAccessor = this.ordinalAccessor !== 'date' ? 'date' : 'otherOrd';
  }

  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherVal';
  }

  changeSeriesAccessor() {
    this.seriesAccessor = this.seriesAccessor !== 'category' ? 'category' : 'otherCat';
  }
  changeHeight() {
    this.height = this.height !== 600 ? 600 : 300;
  }
  changeInteractionKeys() {
    this.interactionKeys =
      this.interactionKeys[0] !== this.seriesAccessor ? [this.seriesAccessor] : [this.ordinalAccessor];
  }
  changeSecondaryLine() {
    this.secondaryKey = this.secondaryKey !== 'Card B' ? 'Card B' : 'Card A';
  }
  changeSecondaryLineOpacity() {
    this.secondaryOpacity = this.secondaryOpacity !== 1 ? 1 : 0.5;
  }
  changeSecondaryLineDL() {
    this.secondaryDataLabel = this.secondaryDataLabel !== true ? true : false;
  }
  changeSecondaryLineSL() {
    this.secondarySeriesLabel = this.secondarySeriesLabel !== true ? true : false;
  }
  changeTooltipLabel() {
    this.tooltipLabel =
      this.tooltipLabel.labelAccessor[0] !== this.ordinalAccessor
        ? { format: ['%b'], labelAccessor: [this.ordinalAccessor], labelTitle: [this.ordinalAccessor] }
        : { format: '', labelAccessor: [this.seriesAccessor], labelTitle: [this.seriesAccessor] };
    // @State() colors: any = [ : 'otherGroup';
  }
  changeUnit() {
    this.unit = this.unit !== 'month' ? 'month' : 'year';
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }

  render() {
    this.data = this.dataStorage[this.stateTrigger];
    let nightmareColors = [];
    this.theWorstDataEver.forEach(_ => nightmareColors.push('#222222'));
    return (
      <div>
        {/* <line-chart
          mainTitle={'Dash Patterns'}
          subTitle={'5 Dash Patterns + Secondary Line Pattern'}
          data={this.dashTestData}
          ordinalAccessor="ordinal"
          seriesAccessor="series"
          valueAccessor="value"
          uniqueID="dash-test"
          colors={['#222222', '#222222', '#222222', '#222222', '#222222', '#222222']}
          dataLabel={{ visible: false }}
          secondaryLines={{
            keys: ['secondary'],
            opacity: 1,
            showDataLabel: true,
            showSeriesLabel: true
          }}
          margin={{
            top: 5,
            left: 0,
            bottom: 36,
            right: 5
          }}
          padding={{
            top: 5,
            left: 36,
            bottom: 36,
            right: 5
          }}
          showBaselineX={false}
          yAxis={{ visible: false, gridVisible: false }}
          xAxis={{ visible: false, gridVisible: false }}
        /> */}

        {/* <line-chart
          mainTitle={'Broken Lines'}
          subTitle={'Testing broken lines with non-date ordinal data'}
          data={this.breakTestData}
          ordinalAccessor="ordinal"
          seriesAccessor="series"
          valueAccessor="value"
          uniqueID="broken-line-test"
          colors={['#222222', '#222222', '#222222', '#222222', '#222222', '#222222']}
          dataLabel={{
            visible: true,
            placement: 'middle',
            labelAccessor: 'value',
            format: '0,0.[00]a'
          }}
          // dataLabel={{ visible: true }}
          showBaselineX={false}
          yAxis={{ visible: false, gridVisible: true }}
          xAxis={{ visible: false, gridVisible: false }}
        /> */}

        {/* <line-chart
          mainTitle={'Collision Testing'}
          subTitle={'testing collision use cases'}
          data={this.collisionTestData}
          ordinalAccessor="ordinal"
          seriesAccessor="series"
          valueAccessor="value"
          uniqueID="collision-test"
          dataLabel={{
            visible: true,
            placement: 'middle',
            labelAccessor: 'value',
            format: '0,0.[00]a'
          }}
          width={600}
          height={350}
          colors={['#222222', '#222222', '#222222', '#222222', '#222222', '#222222']}
          margin={{
            top: 5,
            left: 5,
            bottom: 5,
            right: 5
          }}
          padding={{
            top: 20,
            left: 40,
            bottom: 20,
            right: 40
          }}
          dotRadius={3}
          showBaselineX={false}
          yAxis={{ visible: false, gridVisible: false }}
          xAxis={{ visible: false, gridVisible: false }}
        />

        <line-chart
          mainTitle={'XTREME Collision Testing'}
          subTitle={'use the state/variables in the app tsx to make it a nightmare'}
          data={this.theWorstDataEver}
          ordinalAccessor="ordinal"
          seriesAccessor="series"
          valueAccessor="value"
          uniqueID="horrific"
          width={800}
          height={400}
          colors={nightmareColors}
          dataLabel={{
            visible: true,
            placement: 'middle',
            labelAccessor: 'value',
            format: '0,0.[00]a'
          }}
          margin={{
            top: 5,
            left: 0,
            bottom: 36,
            right: 50
          }}
          padding={{
            top: 20,
            left: 36,
            bottom: 36,
            right: 20
          }}
          showBaselineX={false}
          yAxis={{ visible: false, gridVisible: false }}
          xAxis={{ visible: false, gridVisible: false }}
        /> */}
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
            this.backData();
          }}
        >
          back data
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
            this.changeSeriesAccessor();
          }}
        >
          change seriesAccessor
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
            this.changeInteractionKeys();
          }}
        >
          change interaction keys
        </button>
        <button
          onClick={() => {
            this.changeSecondaryLine();
          }}
        >
          change secondary line
        </button>
        <button
          onClick={() => {
            this.changeSecondaryLineOpacity();
          }}
        >
          change secondary line opacity
        </button>
        <button
          onClick={() => {
            this.changeSecondaryLineDL();
          }}
        >
          toggle secondary line labels
        </button>
        <button
          onClick={() => {
            this.changeSecondaryLineSL();
          }}
        >
          toggle secondary series labels
        </button>
        <button
          onClick={() => {
            this.changeTooltipLabel();
          }}
        >
          change tooltip
        </button>
        <button
          onClick={() => {
            this.changeUnit();
          }}
        >
          change unit
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <line-chart
          // localization={{
          //   language: hu,
          //   numeralLocale: HU,
          //   skipValidation: false
          // }}
          lineCurve={'linear'}
          // Chart Attributes (1/7)
          mainTitle={'Line Chart in app'}
          // animationConfig={this.animations}
          subTitle={'example'}
          // subTitle={{
          //   text:'When was transaction is dummy count below market dummy average?',
          //   keywordsHighlight: [
          //     { text: "transaction is dummy", color:'#FF4F00'},
          //     { text: "dummy", color: '#efefef'},
          //     {text: "average", color: '#323232'},
          //   ]
          // }}
          height={this.height}
          width={600}
          // xAxis={{ visible: true, gridVisible: true, label: 'Quarter', unit: this.unit, format: '%b' }}
          // yAxis={{ visible: true, gridVisible: true, label: 'Volume', format: '0[.][0][0]a' }}
          // minValueOverride={-2000000}
          // padding={{
          //   top: 20,
          //   left: 60,
          //   right: 80,
          //   bottom: 50
          // }}
          data={this.data}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          seriesAccessor={this.seriesAccessor}
          dataLabel={this.dataLabel}
          dataKeyNames={this.dataKeyNames}
          seriesLabel={this.seriesLabel}
          // legend={{ visible: false, labels: [], interactive: true }}
          // colorPalette={'sequential_grey'}
          cursor={'pointer'}
          strokeWidth={2}
          colors={this.simpleColors}
          // colors={['sec_orange', 'sec_blue', 'sec_orange', 'supp_green', 'sec_blue']}
          hoverOpacity={0.2}
          hoverStyle={this.hoverStyle}
          clickStyle={this.clickStyle}
          clickHighlight={this.clickElement}
          hoverHighlight={this.hoverElement}
          interactionKeys={this.interactionKeys}
          referenceLines={[
            {
              label: 'Average',
              labelPlacementHorizontal: 'right',
              labelPlacementVertical: 'top',
              value: 7300000000,
              accessibilityDescription: 'This reference line is a callout to the Average value, which is 100.',
              accessibilityDecorationOnly: false
            }
          ]}
          secondaryLines={{
            keys: [this.secondaryKey],
            opacity: this.secondaryOpacity,
            showDataLabel: this.secondaryDataLabel,
            showSeriesLabel: this.secondarySeriesLabel
          }}
          onClickEvent={d => this.onClickFunc(d)}
          onHoverEvent={d => this.onHoverFunc(d)}
          onMouseOutEvent={() => this.onMouseOut()}
          // onInitialLoadEvent={e => e} // console.log('load event', e.detail, e)}
          // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
          // onDrawStartEvent={e => e} // console.log('draw start event', e.detail, e)}
          // onDrawEndEvent={e => e} // console.log('draw end event', e.detail, e)}
          // onTransitionEndEvent={e => e} // console.log('transition event', e.detail, e)}
          showTooltip={true}
          // tooltipLabel={this.tooltipLabel}
          // annotations={this.annotations}
          accessibility={this.accessibility}
          suppressEvents={this.suppressEvents}
          dotRadius={5}
        />
      </div>
    );
  }
}
