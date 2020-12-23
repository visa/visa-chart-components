/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, State, h } from '@stencil/core';
import Utils from '@visa/visa-charts-utils';
import '@visa/visa-charts-data-table';

const { autoTextColor, getColors, calculateLuminance, calculateRelativeLuminance, fixNestedSparseness } = Utils;
@Component({
  tag: 'app-stacked-bar-chart',
  styleUrl: 'app-stacked-bar-chart.scss'
})
export class AppStackedBarChart {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() hoverElement: any = {};
  @State() clickElement: any = [];
  @State() ordinalAccessor: any = 'category';
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'date';
  @State() showTotalValue: boolean = false;
  @State() showZeroLabels: boolean = true;
  @State() dataLabelVis: boolean = true;
  @State() layout: any = 'vertical';
  @State() sort: any = 'desc';
  @State() intKey: any = ['category'];
  @State() dataLabelAccessor: any = 'value';
  @State() label: any = {
    labelAccessor: ['category', 'value'],
    labelTitle: ['Category ', 'Value'],
    format: ['', '$[a]']
  };
  @State() zeroLabel: boolean = true;
  @State() fixedData: any;
  @State() dataLabel: any = {
    visible: this.dataLabelVis,
    placement: 'middle',
    labelAccessor: this.dataLabelAccessor,
    format: ''
  };
  interactionKeys: any = ['category'];
  legend: any = { visible: true, interactive: true };
  padding: any = {
    top: 20,
    left: 100,
    right: 30,
    bottom: 50
  };
  xAxis: any = {
    format: this.layout === 'horizontal' ? '0[.][0][0]a' : '%b',
    visible: true,
    gridVisible: false,
    label: 'xAxis'
  };
  yAxis: any = {
    visible: true,
    gridVisible: true,
    label: 'Y Axis',
    format: this.layout === 'horizontal' ? '%b' : '0[.][0][0]a',
    tickInterval: 1
  };
  clickStyle: any = {
    strokeWidth: 4
  };
  hoverStyle: any = {
    strokeWidth: 3
  };
  @State() accessibility: any = {
    disableValidation: true
    // hideTextures: true,
    // hideStrokes: true
  };
  @Element()
  appEl: HTMLElement;
  testDate: any;
  endDate: any;
  startDate: any;
  maxContrast: number = 0;
  badData: any = [
    {
      cat: 'a',
      group: 'x',
      val: 5
    },
    {
      cat: 'b',
      group: 'x',
      val: 5
    },
    {
      cat: 'c',
      group: 'y',
      val: 5
    }
  ];
  startData: any = [
    {
      date: new Date('2016-01-01'),
      otherCategory: 'group1',
      otherGroup: '1',
      otherValue: 12,
      category: 'Restaurant',
      value: 120,
      count: 420
    },
    {
      date: new Date('2016-02-01'),
      otherCategory: 'group1',
      otherGroup: '2',
      otherValue: 22,
      category: 'Restaurant',
      value: 121,
      count: 439
    },
    {
      date: new Date('2016-03-01'),
      otherCategory: 'group1',
      otherGroup: '3',
      otherValue: 32,
      category: 'Restaurant',
      value: 119,
      count: 402
    },
    {
      date: new Date('2016-04-01'),
      otherCategory: 'group1',
      otherGroup: '4',
      otherValue: 42,
      category: 'Restaurant',
      value: 114,
      count: 434
    },
    {
      date: new Date('2016-05-01'),
      otherCategory: 'group1',
      otherGroup: '5',
      otherValue: 52,
      category: 'Restaurant',
      value: 0,
      count: 395
    },
    {
      date: new Date('2016-06-01'),
      otherCategory: 'group1',
      otherGroup: '6',
      otherValue: 22,
      category: 'Restaurant',
      value: 112,
      count: 393
    },
    {
      date: new Date('2016-07-01'),
      otherCategory: 'group1',
      otherGroup: '7',
      otherValue: 82,
      category: 'Restaurant',
      value: 130,
      count: 445
    },
    {
      date: new Date('2016-08-01'),
      otherCategory: 'group1',
      otherGroup: '8',
      otherValue: 42,
      category: 'Restaurant',
      value: 124,
      count: 456
    },
    {
      date: new Date('2016-09-01'),
      otherCategory: 'group1',
      otherGroup: '9',
      otherValue: 12,
      category: 'Restaurant',
      value: 119,
      count: 355
    },
    {
      date: new Date('2016-10-01'),
      otherCategory: 'group1',
      otherGroup: '10',
      otherValue: 82,
      category: 'Restaurant',
      value: 106,
      count: 464
    },
    {
      date: new Date('2016-11-01'),
      otherCategory: 'group1',
      otherGroup: '11',
      otherValue: 32,
      category: 'Restaurant',
      value: 123,
      count: 486
    },
    {
      date: new Date('2016-12-01'),
      otherCategory: 'group1',
      otherGroup: '12',
      otherValue: 92,
      category: 'Restaurant',
      value: 133,
      count: 491
    },
    {
      date: new Date('2016-01-01'),
      otherCategory: 'group2',
      otherGroup: '1',
      otherValue: 12,
      category: 'Travel',
      value: 89,
      count: 342
    },
    {
      date: new Date('2016-02-01'),
      otherCategory: 'group2',
      otherGroup: '2',
      otherValue: 12,
      category: 'Travel',
      value: 93,
      count: 434
    },
    {
      date: new Date('2016-03-01'),
      otherCategory: 'group2',
      otherGroup: '3',
      otherValue: 52,
      category: 'Travel',
      value: 82,
      count: 378
    },
    {
      date: new Date('2016-04-01'),
      otherCategory: 'group2',
      otherGroup: '4',
      otherValue: 72,
      category: 'Travel',
      value: 92,
      count: 323
    },
    {
      date: new Date('2016-05-01'),
      otherCategory: 'group2',
      otherGroup: '5',
      otherValue: 62,
      category: 'Travel',
      value: 0,
      count: 434
    },
    {
      date: new Date('2016-06-01'),
      otherCategory: 'group2',
      otherGroup: '6',
      otherValue: 72,
      category: 'Travel',
      value: 85,
      count: 376
    },
    {
      date: new Date('2016-07-01'),
      otherCategory: 'group2',
      otherGroup: '7',
      otherValue: 42,
      category: 'Travel',
      value: 88,
      count: 404
    },
    {
      date: new Date('2016-08-01'),
      otherCategory: 'group2',
      otherGroup: '8',
      otherValue: 62,
      category: 'Travel',
      value: 84,
      count: 355
    },
    {
      date: new Date('2016-09-01'),
      otherCategory: 'group2',
      otherGroup: '9',
      otherValue: 82,
      category: 'Travel',
      value: 90,
      count: 432
    },
    {
      date: new Date('2016-10-01'),
      otherCategory: 'group2',
      otherGroup: '10',
      otherValue: 22,
      category: 'Travel',
      value: 80,
      count: 455
    },
    {
      date: new Date('2016-11-01'),
      otherCategory: 'group2',
      otherGroup: '11',
      otherValue: 52,
      category: 'Travel',
      value: 92,
      count: 445
    },
    {
      date: new Date('2016-12-01'),
      otherCategory: 'group2',
      otherGroup: '12',
      otherValue: 92,
      category: 'Travel',
      value: 97,
      count: 321
    },
    {
      date: new Date('2016-01-01'),
      otherCategory: 'group3',
      otherGroup: '1',
      otherValue: 12,
      category: 'Shopping',
      value: 73,
      count: 456
    },
    {
      date: new Date('2016-02-01'),
      otherCategory: 'group3',
      otherGroup: '2',
      otherValue: 32,
      category: 'Shopping',
      value: 74,
      count: 372
    },
    {
      date: new Date('2016-03-01'),
      otherCategory: 'group3',
      otherGroup: '3',
      otherValue: 52,
      category: 'Shopping',
      value: 68,
      count: 323
    },
    {
      date: new Date('2016-04-01'),
      otherCategory: 'group3',
      otherGroup: '4',
      otherValue: 72,
      category: 'Shopping',
      value: 66,
      count: 383
    },
    {
      date: new Date('2016-05-01'),
      otherCategory: 'group3',
      otherGroup: '5',
      otherValue: 42,
      category: 'Shopping',
      value: 0,
      count: 382
    },
    {
      date: new Date('2016-06-01'),
      otherCategory: 'group3',
      otherGroup: '6',
      otherValue: 82,
      category: 'Shopping',
      value: 70,
      count: 365
    },
    {
      date: new Date('2016-07-01'),
      otherCategory: 'group3',
      otherGroup: '7',
      otherValue: 42,
      category: 'Shopping',
      value: 74,
      count: 296
    },
    {
      date: new Date('2016-08-01'),
      otherCategory: 'group3',
      otherGroup: '8',
      otherValue: 52,
      category: 'Shopping',
      value: 68,
      count: 312
    },
    {
      date: new Date('2016-09-01'),
      otherCategory: 'group3',
      otherGroup: '9',
      otherValue: 92,
      category: 'Shopping',
      value: 75,
      count: 334
    },
    {
      date: new Date('2016-10-01'),
      otherCategory: 'group3',
      otherGroup: '10',
      otherValue: 12,
      category: 'Shopping',
      value: 66,
      count: 386
    },
    {
      date: new Date('2016-11-01'),
      otherCategory: 'group3',
      otherGroup: '11',
      otherValue: 22,
      category: 'Shopping',
      value: 85,
      count: 487
    },
    {
      date: new Date('2016-12-01'),
      otherCategory: 'group3',
      otherGroup: '12',
      otherValue: 62,
      category: 'Shopping',
      value: 89,
      count: 512
    },
    {
      date: new Date('2016-01-01'),
      otherCategory: 'group4',
      otherGroup: '1',
      otherValue: 2,
      category: 'Other',
      value: 83,
      count: 432
    },
    {
      date: new Date('2016-02-01'),
      otherCategory: 'group4',
      otherGroup: '2',
      otherValue: 42,
      category: 'Other',
      value: 87,
      count: 364
    },
    {
      date: new Date('2016-03-01'),
      otherCategory: 'group4',
      otherGroup: '3',
      otherValue: 92,
      category: 'Other',
      value: 76,
      count: 334
    },
    {
      date: new Date('2016-04-01'),
      otherCategory: 'group4',
      otherGroup: '4',
      otherValue: 12,
      category: 'Other',
      value: 86,
      count: 395
    },
    {
      date: new Date('2016-05-01'),
      otherCategory: 'group4',
      otherGroup: '5',
      otherValue: 42,
      category: 'Other',
      value: 0,
      count: 354
    },
    {
      date: new Date('2016-06-01'),
      otherCategory: 'group4',
      otherGroup: '6',
      otherValue: 42,
      category: 'Other',
      value: 77,
      count: 386
    },
    {
      date: new Date('2016-07-01'),
      otherCategory: 'group4',
      otherGroup: '7',
      otherValue: 12,
      category: 'Other',
      value: 79,
      count: 353
    },
    {
      date: new Date('2016-08-01'),
      otherCategory: 'group4',
      otherGroup: '8',
      otherValue: 72,
      category: 'Other',
      value: 85,
      count: 288
    },
    {
      date: new Date('2016-09-01'),
      otherCategory: 'group4',
      otherGroup: '9',
      otherValue: 22,
      category: 'Other',
      value: 87,
      count: 353
    },
    {
      date: new Date('2016-10-01'),
      otherCategory: 'group4',
      otherGroup: '10',
      otherValue: 92,
      category: 'Other',
      value: 76,
      count: 322
    },
    {
      date: new Date('2016-11-01'),
      otherCategory: 'group4',
      otherGroup: '11',
      otherValue: 12,
      category: 'Other',
      value: 96,
      count: 412
    },
    {
      date: new Date('2016-12-01'),
      otherCategory: 'group4',
      otherGroup: '12',
      otherValue: 32,
      category: 'Other',
      value: 104,
      count: 495
    }
  ];
  dataStorage: any = [
    this.startData,
    [
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group1',
        otherGroup: '1',
        otherValue: 12,
        category: 'Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group1',
        otherGroup: '2',
        otherValue: 22,
        category: 'Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group1',
        otherGroup: '3',
        otherValue: 32,
        category: 'Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group1',
        otherGroup: '4',
        otherValue: 42,
        category: 'Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group1',
        otherGroup: '5',
        otherValue: 52,
        category: 'Restaurant',
        value: 0,
        count: 395
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group1',
        otherGroup: '6',
        otherValue: 22,
        category: 'Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group1',
        otherGroup: '7',
        otherValue: 82,
        category: 'Restaurant',
        value: 130,
        count: 445
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group1',
        otherGroup: '8',
        otherValue: 42,
        category: 'Restaurant',
        value: 124,
        count: 456
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group1',
        otherGroup: '9',
        otherValue: 12,
        category: 'Restaurant',
        value: 119,
        count: 355
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group1',
        otherGroup: '10',
        otherValue: 82,
        category: 'Restaurant',
        value: 106,
        count: 464
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group1',
        otherGroup: '11',
        otherValue: 32,
        category: 'Restaurant',
        value: 123,
        count: 486
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group1',
        otherGroup: '12',
        otherValue: 92,
        category: 'Restaurant',
        value: 133,
        count: 491
      },
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group2',
        otherGroup: '1',
        otherValue: 12,
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group2',
        otherGroup: '2',
        otherValue: 12,
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group2',
        otherGroup: '3',
        otherValue: 52,
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group2',
        otherGroup: '4',
        otherValue: 72,
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group2',
        otherGroup: '5',
        otherValue: 62,
        category: 'Travel',
        value: 0,
        count: 434
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group2',
        otherGroup: '6',
        otherValue: 72,
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group2',
        otherGroup: '7',
        otherValue: 42,
        category: 'Travel',
        value: 88,
        count: 404
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group2',
        otherGroup: '8',
        otherValue: 62,
        category: 'Travel',
        value: 84,
        count: 355
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group2',
        otherGroup: '9',
        otherValue: 82,
        category: 'Travel',
        value: 90,
        count: 432
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group2',
        otherGroup: '10',
        otherValue: 22,
        category: 'Travel',
        value: 80,
        count: 455
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group2',
        otherGroup: '11',
        otherValue: 52,
        category: 'Travel',
        value: 92,
        count: 445
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group2',
        otherGroup: '12',
        otherValue: 92,
        category: 'Travel',
        value: 97,
        count: 321
      },
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group3',
        otherGroup: '1',
        otherValue: 12,
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group3',
        otherGroup: '2',
        otherValue: 32,
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group3',
        otherGroup: '3',
        otherValue: 52,
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group3',
        otherGroup: '4',
        otherValue: 72,
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group3',
        otherGroup: '5',
        otherValue: 42,
        category: 'Shopping',
        value: 0,
        count: 382
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group3',
        otherGroup: '6',
        otherValue: 82,
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group3',
        otherGroup: '7',
        otherValue: 42,
        category: 'Shopping',
        value: 74,
        count: 296
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group3',
        otherGroup: '8',
        otherValue: 52,
        category: 'Shopping',
        value: 68,
        count: 312
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group3',
        otherGroup: '9',
        otherValue: 92,
        category: 'Shopping',
        value: 75,
        count: 334
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group3',
        otherGroup: '10',
        otherValue: 12,
        category: 'Shopping',
        value: 66,
        count: 386
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group3',
        otherGroup: '11',
        otherValue: 22,
        category: 'Shopping',
        value: 85,
        count: 487
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group3',
        otherGroup: '12',
        otherValue: 62,
        category: 'Shopping',
        value: 89,
        count: 512
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group1',
        otherGroup: '1',
        otherValue: 12,
        category: 'Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group1',
        otherGroup: '2',
        otherValue: 22,
        category: 'Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group1',
        otherGroup: '3',
        otherValue: 32,
        category: 'Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group1',
        otherGroup: '4',
        otherValue: 42,
        category: 'Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group1',
        otherGroup: '5',
        otherValue: 52,
        category: 'Restaurant',
        value: 0,
        count: 395
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group1',
        otherGroup: '6',
        otherValue: 22,
        category: 'Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group1',
        otherGroup: '7',
        otherValue: 82,
        category: 'Restaurant',
        value: 130,
        count: 445
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group1',
        otherGroup: '8',
        otherValue: 42,
        category: 'Restaurant',
        value: 124,
        count: 456
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group1',
        otherGroup: '9',
        otherValue: 12,
        category: 'Restaurant',
        value: 119,
        count: 355
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group1',
        otherGroup: '10',
        otherValue: 82,
        category: 'Restaurant',
        value: 106,
        count: 464
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group1',
        otherGroup: '11',
        otherValue: 32,
        category: 'Restaurant',
        value: 123,
        count: 486
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group1',
        otherGroup: '12',
        otherValue: 92,
        category: 'Restaurant',
        value: 133,
        count: 491
      },
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group2',
        otherGroup: '1',
        otherValue: 12,
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group2',
        otherGroup: '2',
        otherValue: 12,
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group2',
        otherGroup: '3',
        otherValue: 52,
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group2',
        otherGroup: '4',
        otherValue: 72,
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group2',
        otherGroup: '5',
        otherValue: 62,
        category: 'Travel',
        value: 0,
        count: 434
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group2',
        otherGroup: '6',
        otherValue: 72,
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group2',
        otherGroup: '7',
        otherValue: 42,
        category: 'Travel',
        value: 88,
        count: 404
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group2',
        otherGroup: '8',
        otherValue: 62,
        category: 'Travel',
        value: 84,
        count: 355
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group2',
        otherGroup: '9',
        otherValue: 82,
        category: 'Travel',
        value: 90,
        count: 432
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group2',
        otherGroup: '10',
        otherValue: 22,
        category: 'Travel',
        value: 80,
        count: 455
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group2',
        otherGroup: '11',
        otherValue: 52,
        category: 'Travel',
        value: 92,
        count: 445
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group2',
        otherGroup: '12',
        otherValue: 92,
        category: 'Travel',
        value: 97,
        count: 321
      },
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group3',
        otherGroup: '1',
        otherValue: 12,
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group3',
        otherGroup: '2',
        otherValue: 32,
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group3',
        otherGroup: '3',
        otherValue: 52,
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group3',
        otherGroup: '4',
        otherValue: 72,
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group3',
        otherGroup: '5',
        otherValue: 42,
        category: 'Shopping',
        value: 0,
        count: 382
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group3',
        otherGroup: '6',
        otherValue: 82,
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group3',
        otherGroup: '7',
        otherValue: 42,
        category: 'Shopping',
        value: 74,
        count: 296
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group3',
        otherGroup: '8',
        otherValue: 52,
        category: 'Shopping',
        value: 68,
        count: 312
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group3',
        otherGroup: '9',
        otherValue: 92,
        category: 'Shopping',
        value: 75,
        count: 334
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group3',
        otherGroup: '10',
        otherValue: 12,
        category: 'Shopping',
        value: 66,
        count: 386
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group3',
        otherGroup: '11',
        otherValue: 22,
        category: 'Shopping',
        value: 85,
        count: 487
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group3',
        otherGroup: '12',
        otherValue: 62,
        category: 'Shopping',
        value: 89,
        count: 512
      },
      {
        date: new Date('2016-01-01'),
        otherCategory: 'group4',
        otherGroup: '1',
        otherValue: 2,
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-02-01'),
        otherCategory: 'group4',
        otherGroup: '2',
        otherValue: 42,
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-03-01'),
        otherCategory: 'group4',
        otherGroup: '3',
        otherValue: 92,
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-04-01'),
        otherCategory: 'group4',
        otherGroup: '4',
        otherValue: 12,
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-05-01'),
        otherCategory: 'group4',
        otherGroup: '5',
        otherValue: 42,
        category: 'Other',
        value: 0,
        count: 354
      },
      {
        date: new Date('2016-06-01'),
        otherCategory: 'group4',
        otherGroup: '6',
        otherValue: 42,
        category: 'Other',
        value: 77,
        count: 386
      },
      {
        date: new Date('2016-07-01'),
        otherCategory: 'group4',
        otherGroup: '7',
        otherValue: 12,
        category: 'Other',
        value: 79,
        count: 353
      },
      {
        date: new Date('2016-08-01'),
        otherCategory: 'group4',
        otherGroup: '8',
        otherValue: 72,
        category: 'Other',
        value: 85,
        count: 288
      },
      {
        date: new Date('2016-09-01'),
        otherCategory: 'group4',
        otherGroup: '9',
        otherValue: 22,
        category: 'Other',
        value: 87,
        count: 353
      },
      {
        date: new Date('2016-10-01'),
        otherCategory: 'group4',
        otherGroup: '10',
        otherValue: 92,
        category: 'Other',
        value: 76,
        count: 322
      },
      {
        date: new Date('2016-11-01'),
        otherCategory: 'group4',
        otherGroup: '11',
        otherValue: 12,
        category: 'Other',
        value: 96,
        count: 412
      },
      {
        date: new Date('2016-12-01'),
        otherCategory: 'group4',
        otherGroup: '12',
        otherValue: 32,
        category: 'Other',
        value: 104,
        count: 495
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 130,
        count: 445
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 124,
        count: 456
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 10,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 119,
        count: 355
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 11,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 106,
        count: 464
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 12,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 123,
        count: 486
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group2',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group2',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group2',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group2',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group2',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group2',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group2',
        category: 'Travel',
        value: 88,
        count: 404
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group2',
        category: 'Travel',
        value: 84,
        count: 355
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 10,
        otherCategory: 'group2',
        category: 'Travel',
        value: 90,
        count: 432
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 11,
        otherCategory: 'group2',
        category: 'Travel',
        value: 80,
        count: 455
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 12,
        otherCategory: 'group2',
        category: 'Travel',
        value: 92,
        count: 445
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 74,
        count: 296
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 68,
        count: 312
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 10,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 75,
        count: 334
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 11,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 66,
        count: 386
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 12,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 85,
        count: 487
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group4',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group4',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group4',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group4',
        category: 'Other',
        value: 77,
        count: 386
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group4',
        category: 'Other',
        value: 79,
        count: 353
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group4',
        category: 'Other',
        value: 85,
        count: 288
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 10,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 353
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 11,
        otherCategory: 'group4',
        category: 'Other',
        value: 76,
        count: 322
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 12,
        otherCategory: 'group4',
        category: 'Other',
        value: 85,
        count: 487
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 130,
        count: 445
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 124,
        count: 456
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 119,
        count: 355
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 106,
        count: 464
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 123,
        count: 486
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 133,
        count: 491
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group2',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group2',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group2',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group2',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group2',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group2',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group2',
        category: 'Travel',
        value: 88,
        count: 404
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group2',
        category: 'Travel',
        value: 84,
        count: 355
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group2',
        category: 'Travel',
        value: 90,
        count: 432
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group2',
        category: 'Travel',
        value: 80,
        count: 455
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group2',
        category: 'Travel',
        value: 92,
        count: 445
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group2',
        category: 'Travel',
        value: 97,
        count: 321
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 74,
        count: 296
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 68,
        count: 312
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 75,
        count: 334
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 66,
        count: 386
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 85,
        count: 487
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 89,
        count: 512
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group4',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group4',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group4',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group4',
        category: 'Other',
        value: 77,
        count: 386
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group4',
        category: 'Other',
        value: 79,
        count: 353
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group4',
        category: 'Other',
        value: 85,
        count: 288
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group4',
        category: 'Other',
        value: 87,
        count: 353
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group4',
        category: 'Other',
        value: 76,
        count: 322
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group4',
        category: 'Other',
        value: 96,
        count: 412
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group4',
        category: 'Other',
        value: 104,
        count: 495
      }
    ],
    [
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 120,
        count: 220
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 221,
        count: 339
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 319,
        count: 402
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 214,
        count: 134
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 102,
        count: 295
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 230,
        count: 445
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 324,
        count: 456
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 219,
        count: 355
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 106,
        count: 264
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 123,
        count: 286
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group1',
        category: 'Restaurant',
        value: 133,
        count: 191
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group2',
        category: 'Travel',
        value: 389,
        count: 342
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group2',
        category: 'Travel',
        value: 293,
        count: 434
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group2',
        category: 'Travel',
        value: 182,
        count: 678
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group2',
        category: 'Travel',
        value: 392,
        count: 123
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group2',
        category: 'Travel',
        value: 290,
        count: 234
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group2',
        category: 'Travel',
        value: 185,
        count: 376
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group2',
        category: 'Travel',
        value: 388,
        count: 404
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group2',
        category: 'Travel',
        value: 284,
        count: 355
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group2',
        category: 'Travel',
        value: 190,
        count: 232
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group2',
        category: 'Travel',
        value: 80,
        count: 455
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group2',
        category: 'Travel',
        value: 92,
        count: 445
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group2',
        category: 'Travel',
        value: 97,
        count: 121
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 173,
        count: 356
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 174,
        count: 372
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 168,
        count: 323
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 166,
        count: 483
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 172,
        count: 482
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 170,
        count: 465
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 374,
        count: 196
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 368,
        count: 112
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 375,
        count: 134
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 366,
        count: 386
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 385,
        count: 487
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group3',
        category: 'Shopping',
        value: 389,
        count: 512
      },
      {
        date: new Date('2016-01-01'),
        otherGroup: 1,
        otherCategory: 'group4',
        category: 'Other',
        value: 283,
        count: 132
      },
      {
        date: new Date('2016-02-01'),
        otherGroup: 2,
        otherCategory: 'group4',
        category: 'Other',
        value: 187,
        count: 264
      },
      {
        date: new Date('2016-03-01'),
        otherGroup: 3,
        otherCategory: 'group4',
        category: 'Other',
        value: 376,
        count: 334
      },
      {
        date: new Date('2016-04-01'),
        otherGroup: 4,
        otherCategory: 'group4',
        category: 'Other',
        value: 286,
        count: 495
      },
      {
        date: new Date('2016-05-01'),
        otherGroup: 5,
        otherCategory: 'group4',
        category: 'Other',
        value: 187,
        count: 554
      },
      {
        date: new Date('2016-06-01'),
        otherGroup: 6,
        otherCategory: 'group4',
        category: 'Other',
        value: 177,
        count: 486
      },
      {
        date: new Date('2016-07-01'),
        otherGroup: 7,
        otherCategory: 'group4',
        category: 'Other',
        value: 179,
        count: 353
      },
      {
        date: new Date('2016-08-01'),
        otherGroup: 8,
        otherCategory: 'group4',
        category: 'Other',
        value: 285,
        count: 288
      },
      {
        date: new Date('2016-09-01'),
        otherGroup: 9,
        otherCategory: 'group4',
        category: 'Other',
        value: 287,
        count: 253
      },
      {
        date: new Date('2016-10-01'),
        otherGroup: 10,
        otherCategory: 'group4',
        category: 'Other',
        value: 276,
        count: 122
      },
      {
        date: new Date('2016-11-01'),
        otherGroup: 11,
        otherCategory: 'group4',
        category: 'Other',
        value: 396,
        count: 112
      },
      {
        date: new Date('2016-12-01'),
        otherGroup: 12,
        otherCategory: 'group4',
        category: 'Other',
        value: 204,
        count: 495
      }
    ]
  ];
  tinyData: any = [
    { date: '2016-01-01', category: '1', value: 1 },
    { date: '2016-01-01', category: '2', value: 1 },
    { date: '2016-01-01', category: '3', value: 1 },
    { date: '2016-01-01', category: '4', value: 1 },
    { date: '2016-01-01', category: '5', value: 1 },
    { date: '2016-01-01', category: '6', value: 1 },
    { date: '2016-01-01', category: '7', value: 1 },
    { date: '2016-01-01', category: '8', value: 1 },
    { date: '2016-01-01', category: '9', value: 1 },
    { date: '2016-01-01', category: '10', value: 1 },
    { date: '2016-01-01', category: '11', value: 1 }
  ];
  accessibilityPalettes: any = [
    'sequential_grey',
    'sequential_secBlue',
    'sequential_secOrange',
    'sequential_compBlue',
    'sequential_compGreen',
    'sequential_suppPink',
    'sequential_suppPurple',
    'sequential_suppGreen',
    'diverging_RtoB',
    'diverging_RtoG',
    'diverging_GtoP',
    'categorical',
    'categorical_dark',
    'categorical_light',
    'categorical_text'
  ];
  paletteLengths: any = {
    sequential_grey: 9,
    sequential_secBlue: 9,
    sequential_secOrange: 9,
    sequential_compBlue: 9,
    sequential_compGreen: 9,
    sequential_suppPink: 9,
    sequential_suppPurple: 9,
    sequential_suppGreen: 9,
    diverging_RtoB: 10,
    diverging_RtoG: 10,
    diverging_GtoP: 10,
    categorical: 6,
    categorical_dark: 6,
    categorical_light: 6,
    categorical_text: 6
  };
  accessibilityData: any = [];
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
    // this.accessibility = {...this.accessibility,hideStrokes:true}
    // setTimeout(()=>{
    this.hoverElement = ev.detail;
    //   setTimeout(()=>{
    //     this.accessibility = {...this.accessibility,hideStrokes:false}
    //   },35)
    // },1)
  }
  onMouseOut() {
    // this.accessibility = {...this.accessibility,hideStrokes:true}
    // setTimeout(()=>{
    //   this.hoverElement = '';
    //   setTimeout(()=>{
    //     this.accessibility = {...this.accessibility,hideStrokes:false}
    //   },35)
    // },1)
    this.hoverElement = {};
  }
  onChangeFunc(d) {
    console.log('changeFunc', d);
  }

  changeData() {
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
  }

  toggleDataLabel() {
    this.dataLabelVis = this.dataLabelVis !== true ? true : false;
  }

  changeLabelAccessor() {
    this.dataLabelAccessor = this.dataLabelAccessor !== 'count' ? 'count' : 'value';
    console.log(this.dataLabelAccessor);
  }

  toggleZeroLabel() {
    this.zeroLabel = this.zeroLabel !== true ? true : false;
  }

  changeLayout() {
    this.layout = this.layout !== 'vertical' ? 'vertical' : 'horizontal';
  }

  changeOrdinalAccessor() {
    this.ordinalAccessor = this.ordinalAccessor !== 'category' ? 'category' : 'otherCategory';
  }

  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'count';
  }

  changeGroupAccessor() {
    this.groupAccessor = this.groupAccessor !== 'date' ? 'date' : 'otherGroup';
  }

  changeSortOrder() {
    this.sort = this.sort !== 'desc' ? 'desc' : 'asc';
  }

  changeTooltip() {
    this.label.labelAccessor[0] !== 'category'
      ? (this.label = {
          labelAccessor: ['category', 'value'],
          labelTitle: ['Category ', 'Value'],
          format: ['', '$[a]']
        })
      : (this.label = { labelAccessor: ['value'], labelTitle: ['Value'], format: [''] });
  }

  calculateData() {
    // function round(value, decimals) {
    //   return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    // }
    this.accessibilityPalettes.forEach(palette => {
      const props = {
        mainTitle: palette,
        subTitle: '',
        height: 400,
        width: 100,
        layout: 'vertical',
        showTooltip: true,
        xAxis: { visible: false },
        yAxis: { visible: false },
        data: [],
        colorPalette: palette,
        ordinalAccessor: 'category',
        valueAccessor: 'value',
        groupAccessor: 'date',
        legend: { visible: false, interactive: true },
        cursor: 'pointer',
        clickStyle: {
          stroke: 'categorical_blue',
          strokeWidth: 4
        },
        hoverStyle: {
          stroke: 'white',
          strokeWidth: 3
        },
        dataLabel: {
          visible: true
        },
        accessibility: { disableValidation: true, hideDataTableButton: true, hideStrokes: true, hideTextures: true },
        maxValueOverride: 0,
        showTotalValue: false,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        margin: { top: 0, bottom: 0, left: 0, right: 0 }
      };
      const colorPalette = getColors(palette, this.paletteLengths[palette]);
      let i = 0;
      let contrastTotal = 0;
      for (i = 0; i < this.paletteLengths[palette]; i++) {
        const colorLuminance = calculateLuminance(colorPalette[i]);
        const textLuminance = calculateLuminance(autoTextColor(colorPalette[i]));
        const value = calculateRelativeLuminance(colorLuminance, textLuminance).toFixed(2);
        const newDatum = { ...this.tinyData[i], value };
        contrastTotal += +value;
        props.data.push(newDatum);
      }
      if (this.maxContrast < contrastTotal) {
        this.maxContrast = contrastTotal;
      }
      props.maxValueOverride = contrastTotal / this.paletteLengths[palette];
      props.subTitle = 'Avg Ratio: ' + (contrastTotal / this.paletteLengths[palette]).toFixed(2);
      this.accessibilityData.push(props);
    });
    this.accessibilityData.sort((a, b) => (b.maxValueOverride > a.maxValueOverride ? 1 : -1));
    this.accessibilityData.forEach(prop => {
      prop.maxValueOverride = this.maxContrast;
      // delete prop.maxValueOverride
    });
  }

  fixBadData() {
    console.log({ ...this.badData });
    // we are setting the default value
    fixNestedSparseness(this.badData, 'cat', 'group', 'val', 1);
    console.log(this.badData);
    // now that it is safe to use, we assign it
    this.fixedData = this.badData;
  }

  render() {
    // this.data = this.dataStorage[this.stateTrigger];
    const colorBars = [];
    if (!this.accessibilityData.length) {
      this.calculateData();
    }
    this.accessibilityData.forEach(data => {
      colorBars.push(
        <div class="bar-rows">
          <stacked-bar-chart {...data} />
        </div>
      );
    });
    return (
      <div>
        {colorBars}
        <br />
        {this.fixedData ? (
          <stacked-bar-chart data={this.fixedData} ordinalAccessor="cat" groupAccessor="group" valueAccessor="val" />
        ) : (
          ''
        )}
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
            this.toggleDataLabel();
          }}
        >
          data label visibility
        </button>
        <button
          onClick={() => {
            this.changeLabelAccessor();
          }}
        >
          dataLabel accessor
        </button>
        <button
          onClick={() => {
            this.changeLayout();
          }}
        >
          change layout
        </button>
        <button
          onClick={() => {
            this.changeSortOrder();
          }}
        >
          change sort order
        </button>
        <button
          onClick={() => {
            this.changeTooltip();
          }}
        >
          change tooltip
        </button>
        <button
          onClick={() => {
            this.toggleZeroLabel();
          }}
        >
          zero label
        </button>
        <button
          onClick={() => {
            this.fixBadData();
          }}
        >
          fix data
        </button>
        <br />
        <stacked-bar-chart
          interactionKeys={this.interactionKeys}
          onHoverFunc={d => this.onHoverFunc(d)}
          onMouseOutFunc={() => this.onMouseOut()}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          groupAccessor={this.groupAccessor}
          mainTitle={'Stacked Bar Chart'}
          subTitle={'test subtitle'}
          height={500}
          width={1000}
          layout={this.layout}
          padding={this.padding}
          showTooltip={true}
          xAxis={this.xAxis}
          yAxis={this.yAxis}
          data={this.dataStorage[this.stateTrigger]}
          normalized={false}
          sortOrder={this.sort}
          showZeroLabels={this.zeroLabel}
          barIntervalRatio={0.008}
          cursor={'pointer'}
          clickStyle={this.clickStyle}
          hoverStyle={this.hoverStyle}
          tooltipLabel={this.label}
          dataLabel={this.dataLabel}
          hoverOpacity={0.99999999999}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickFunc={d => this.onClickFunc(d)}
          accessibility={this.accessibility}
          // annotations={[{"note":{"label":"*","bgPadding":0,"title":"","lineType":"none","align":"middle","wrap":175},"y":"-2%","x":[this.testDate],"dy":"1%","dx":["2016-11-15"],"color":"#f5a623","className":"stacked-bar-annotation","type":"annotationCalloutRect","subject":{"width":[this.endDate,this.startDate],"height":"104%"},"parseAsDates":["x"],"disable":["connector"]}]}
        />
      </div>
    );
  }
}
