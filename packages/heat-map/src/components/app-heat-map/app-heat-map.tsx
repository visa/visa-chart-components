/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Event, EventEmitter, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

@Component({
  tag: 'app-heat-map',
  styleUrl: 'app-heat-map.scss'
})
export class AppHeatMap {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() clickElement: any = [];
  @State() codeString: any = '';
  @State() value: any = 0; // this is for handling value changes for button to control which dataset to send
  @State() valueAccessor: any = 'value';
  @State() xAccessor: any = 'date';
  @State() yAccessor: any = 'category';
  @State() xKeyOrder: any = ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06'];
  @State() yKeyOrder: any = ['Travel', 'Long Name Restaurant', 'Shopping', 'Other'];
  @State() wrapLabel: any = true;
  @State() interactionKeys: any = ['date'];
  @State() xAxisPlacement: any = 'bottom';
  @State() xAxisFormat: any = '%m/%d';
  @State() suppressEvents: boolean = false;
  @State() label: any = {
    labelAccessor: ['category', 'value'],
    labelTitle: ['Category ', 'Value'],
    format: ['', '0o']
  };
  @State() legend: any = {
    visible: true,
    type: 'key',
    format: '0,0',
    labels: ['Lowest', 'V V Low', 'V Low', 'Low', 'Med-Low', 'Med', 'Med-High', 'High', 'V High', 'V V High', 'Highest']
  };
  @State() animations: any = { disabled: false };
  startData: any = [
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'ghi',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'ghi',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'ghi',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'ghi',
        category: 'Other',
        value: 77,
        count: 386
      }
    ]
  ];
  dataStorage: any = [
    // this.startData,
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'ghi',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'ghi',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'ghi',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'ghi',
        category: 'Other',
        value: 77,
        count: 386
      }
    ],
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'ghi',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'ghi',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'ghi',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'ghi',
        category: 'Other',
        value: 77,
        count: 386
      }
    ],
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'ghi',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'ghi',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'ghi',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'ghi',
        category: 'Other',
        value: 77,
        count: 386
      }
    ],
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'ghi',
        category: 'Other',
        value: 83,
        count: 432
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 364
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'ghi',
        category: 'Other',
        value: 76,
        count: 334
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'ghi',
        category: 'Other',
        value: 86,
        count: 395
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'ghi',
        category: 'Other',
        value: 87,
        count: 354
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'ghi',
        category: 'Other',
        value: 77,
        count: 386
      }
    ],
    [
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 120,
        count: 420
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 121,
        count: 439
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 119,
        count: 402
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 114,
        count: 434
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 102,
        count: 395
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 112,
        count: 393
      },
      {
        date: new Date('2016-01-07T00:00:00.000Z'),
        otherX: 'g',
        otherCategory: 'abc',
        category: 'Long Name Restaurant',
        value: 130,
        count: 445
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: '123',
        category: 'Travel',
        value: 89,
        count: 342
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: '123',
        category: 'Travel',
        value: 93,
        count: 434
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: '123',
        category: 'Travel',
        value: 82,
        count: 378
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: '123',
        category: 'Travel',
        value: 92,
        count: 323
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: '123',
        category: 'Travel',
        value: 90,
        count: 434
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: '123',
        category: 'Travel',
        value: 85,
        count: 376
      },
      {
        date: new Date('2016-01-07T00:00:00.000Z'),
        otherX: 'g',
        otherCategory: '123',
        category: 'Travel',
        value: 88,
        count: 404
      },
      {
        date: new Date('2016-01-01T00:00:00.000Z'),
        otherX: 'a',
        otherCategory: 'def',
        category: 'Shopping',
        value: 73,
        count: 456
      },
      {
        date: new Date('2016-01-02T00:00:00.000Z'),
        otherX: 'b',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 372
      },
      {
        date: new Date('2016-01-03T00:00:00.000Z'),
        otherX: 'c',
        otherCategory: 'def',
        category: 'Shopping',
        value: 68,
        count: 323
      },
      {
        date: new Date('2016-01-04T00:00:00.000Z'),
        otherX: 'd',
        otherCategory: 'def',
        category: 'Shopping',
        value: 66,
        count: 383
      },
      {
        date: new Date('2016-01-05T00:00:00.000Z'),
        otherX: 'e',
        otherCategory: 'def',
        category: 'Shopping',
        value: 72,
        count: 382
      },
      {
        date: new Date('2016-01-06T00:00:00.000Z'),
        otherX: 'f',
        otherCategory: 'def',
        category: 'Shopping',
        value: 70,
        count: 365
      },
      {
        date: new Date('2016-01-07T00:00:00.000Z'),
        otherX: 'g',
        otherCategory: 'def',
        category: 'Shopping',
        value: 74,
        count: 296
      }
    ]
  ];
  @State() accessibility: any = {
    longDescription: 'This is a chart template that was made to showcase the Visa Chart Components heat map',
    contextExplanation: 'This chart exists in a demo app created to let you quickly change props and see results',
    executiveSummary: 'Restaurants have the highest values shown',
    purpose: 'The purpose of this chart template is to provide an example of a heat map',
    structureNotes:
      'A square is shown for each of the four categories and seven dates displayed, and the color of these squares represents a high, mid or low value',
    statisticalNotes: 'This chart is using dummy data',
    elementsAreInterface: false,
    keyboardNavConfig: { disabled: false },
    onChangeFunc: d => {
      this.onChangeFunc(d);
    },
    disableValidation: true
  };
  dataLabel: any = { visible: true, labelAccessor: 'value', format: '' };
  padding: any = { top: 20, bottom: 30, right: 50, left: 80 };
  xAxis: any = {
    visible: true,
    label: '',
    placement: this.xAxisPlacement,
    format: this.xAxisFormat,
    tickInterval: 1
  };
  yAxis: any = { visible: true, label: '', format: '' };
  @Event() updateComponent: EventEmitter;

  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    category: 'Grouping',
    value: 'Rank'
  };

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
  onHoverFunc(ev) {
    this.hoverElement = { ...ev.detail.data };
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
    this.xAccessor = this.xAccessor !== 'date' ? 'date' : 'otherX';
  }
  changeYAccessor() {
    this.yAccessor = this.yAccessor !== 'category' ? 'category' : 'otherCategory';
  }
  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'count';
  }
  changexKeyOrder() {
    this.xKeyOrder =
      this.xKeyOrder[2] !== '01/03'
        ? ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06']
        : ['01/01', '01/02', '01/04', '01/03', '01/06', '01/05'];
  }
  changeyKeyOrder() {
    console.log('changing key order');
    this.yKeyOrder =
      this.yKeyOrder[0] !== 'Long Name Restaurant'
        ? ['Long Name Restaurant', 'Travel', 'Shopping', 'Other']
        : ['Shopping', 'Long Name Restaurant', 'Other', 'Travel'];
  }
  changeIntKey() {
    this.interactionKeys = this.interactionKeys[0] !== 'date' ? ['date'] : ['category'];
  }
  changeWrapLabel() {
    this.wrapLabel = this.wrapLabel ? false : true;
  }
  changeTooltip() {
    this.label.labelAccessor[0] !== 'category'
      ? (this.label = {
          labelAccessor: ['category', 'value'],
          labelTitle: ['Category ', 'Value'],
          format: ['', '0o']
        })
      : (this.label = { labelAccessor: ['value'], labelTitle: ['Value'], format: [''] });
  }
  changeLegend() {
    this.legend.type !== 'key'
      ? (this.legend = {
          visible: true,
          type: 'key',
          format: '0,0',
          labels: [
            'Lowest',
            'V V Low',
            'V Low',
            'Low',
            'Med-Low',
            'Med',
            'Med-High',
            'High',
            'V High',
            'V V High',
            'Highest'
          ]
        })
      : (this.legend = {
          visible: true,
          type: 'gradient',
          format: '0o',
          labels: ['']
        });
  }
  changeXAxisFormat() {
    this.xAxisFormat = this.xAxisFormat !== '%d' ? '%d' : '%m/%d';
  }
  changeXAxisPlacement() {
    this.xAxisPlacement = this.xAxisPlacement !== 'bottom' ? 'bottom' : 'top';
  }
  toggleTextures() {
    const a = { ...this.accessibility, showExperimentalTextures: !this.accessibility.showExperimentalTextures };
    this.accessibility = a;
  }
  toggleStrokes() {
    const a = { ...this.accessibility, hideStrokes: !this.accessibility.hideStrokes };
    this.accessibility = a;
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
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }

  render() {
    this.data = this.dataStorage[this.stateTrigger];
    console.log('!!!!app re-render');
    return (
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
            this.changeValueAccessor();
          }}
        >
          change valueAccessor
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
            this.changexKeyOrder();
          }}
        >
          change xKeyOrder
        </button>
        <button
          onClick={() => {
            this.changeyKeyOrder();
          }}
        >
          change yKeyOrder
        </button>
        <button
          onClick={() => {
            this.changeWrapLabel();
          }}
        >
          change wrap label
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
            this.changeLegend();
          }}
        >
          change legend
        </button>
        <button
          onClick={() => {
            this.changeIntKey();
          }}
        >
          change interaction key
        </button>
        <button
          onClick={() => {
            this.changeXAxisFormat();
          }}
        >
          change xAxis Format
        </button>
        <button
          onClick={() => {
            this.changeXAxisPlacement();
          }}
        >
          change xAxis Placement
        </button>
        <button
          onClick={() => {
            this.toggleTextures();
          }}
        >
          toggle textures
        </button>
        <button
          onClick={() => {
            this.toggleStrokes();
          }}
        >
          toggle strokes
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <heat-map
          colorPalette={'diverging_GtoP'} // sequential_grey // diverging_GtoP // diverging_GtoP
          // colors={[#ff4000, #555fff, #ff193f]}
          colorSteps={11}
          animationConfig={this.animations}
          cursor={'pointer'}
          data={this.data}
          dataLabel={this.dataLabel}
          dataKeyNames={this.dataKeyNames}
          height={400}
          hideAxisPath={true}
          legend={this.legend}
          mainTitle={'Heat Map Default'}
          interactionKeys={this.interactionKeys}
          padding={this.padding}
          subTitle={'Interaction Style'}
          showTooltip={true}
          // tooltipLabel={this.label}
          width={800}
          maxValueOverride={50}
          valueAccessor={this.valueAccessor}
          xAccessor={this.xAccessor}
          yAccessor={this.yAccessor}
          // xKeyOrder={this.xKeyOrder}
          yKeyOrder={this.yKeyOrder}
          wrapLabel={this.wrapLabel}
          shape={'square'}
          xAxis={this.xAxis}
          yAxis={this.yAxis}
          accessibility={this.accessibility}
          suppressEvents={this.suppressEvents}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickEvent={d => this.onClickFunc(d)}
          onHoverEvent={d => this.onHoverFunc(d)}
          onMouseOutEvent={() => this.onMouseOut()}
          // onInitialLoadEvent={e => e} // console.log('load event', e.detail, e)}
          // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
          // onDrawStartEvent={e => e} // console.log('draw start event', e.detail, e)}
          // onDrawEndEvent={e => e} // console.log('draw end event', e.detail, e)}
          // onTransitionEndEvent={e => e} // console.log('transition event', e.detail, e)}
        />
      </div>
    );
  }
}
