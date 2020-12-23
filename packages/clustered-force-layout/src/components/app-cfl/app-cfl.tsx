/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';

@Component({
  tag: 'app-cfl',
  styleUrl: 'app-cfl.scss'
})
export class AppCFL {
  @State() data: any = [
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 1',
      Type: 'Card A',
      Amount: 16045441.28,
      Count: 61031
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 1',
      Type: 'Card B',
      Amount: 1193401.13,
      Count: 5454
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 1',
      Type: 'Card C',
      Amount: 130223.13,
      Count: 979
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 2',
      Type: 'Card A',
      Amount: 21350560.5,
      Count: 188623
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 2',
      Type: 'Card B',
      Amount: 3895899.66,
      Count: 51584
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 2',
      Type: 'Card C',
      Amount: 481032.9,
      Count: 6589
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 3',
      Type: 'Card A',
      Amount: 5473629.96,
      Count: 20165
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 3',
      Type: 'Card B',
      Amount: 621565.76,
      Count: 3088
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 3',
      Type: 'Card C',
      Amount: 53928.9,
      Count: 417
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 4',
      Type: 'Card A',
      Amount: 24707428.31,
      Count: 142980
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 4',
      Type: 'Card B',
      Amount: 1138981.57,
      Count: 31395
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 4',
      Type: 'Card C',
      Amount: 220298.67,
      Count: 3842
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 5',
      Type: 'Card A',
      Amount: 9378401.15,
      Count: 123333
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 5',
      Type: 'Card B',
      Amount: 1677467.71,
      Count: 56891
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 5',
      Type: 'Card C',
      Amount: 242878.33,
      Count: 5037
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 6',
      Type: 'Card A',
      Amount: 7183112.43,
      Count: 110625
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 6',
      Type: 'Card B',
      Amount: 1564836.79,
      Count: 49943
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 6',
      Type: 'Card C',
      Amount: 108029.66,
      Count: 3362
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 7',
      Type: 'Card A',
      Amount: 8837433.39,
      Count: 141861
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 7',
      Type: 'Card B',
      Amount: 1552421.74,
      Count: 38539
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 7',
      Type: 'Card C',
      Amount: 215830.19,
      Count: 6000
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 8',
      Type: 'Card A',
      Amount: 922087.59,
      Count: 26383
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 8',
      Type: 'Card B',
      Amount: 103449.26,
      Count: 3773
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 8',
      Type: 'Card C',
      Amount: 37785.74,
      Count: 2008
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 9',
      Type: 'Card A',
      Amount: 10594810.85,
      Count: 71921
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 9',
      Type: 'Card B',
      Amount: 928383.95,
      Count: 11835
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 9',
      Type: 'Card C',
      Amount: 149925.82,
      Count: 2024
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 10',
      Type: 'Card A',
      Amount: 12570176.46,
      Count: 174130
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 10',
      Type: 'Card B',
      Amount: 1706143.55,
      Count: 57214
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 10',
      Type: 'Card C',
      Amount: 318331.23,
      Count: 2705
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 11',
      Type: 'Card A',
      Amount: 33765430.8,
      Count: 401115
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 11',
      Type: 'Card B',
      Amount: 20203740.78,
      Count: 489756
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 11',
      Type: 'Card C',
      Amount: 321505.83,
      Count: 7015
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 12',
      Type: 'Card A',
      Amount: 10257071,
      Count: 218639
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 12',
      Type: 'Card B',
      Amount: 1741911.02,
      Count: 40025
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 12',
      Type: 'Card C',
      Amount: 481962.62,
      Count: 18333
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 13',
      Type: 'Card A',
      Amount: 6078826.43,
      Count: 150726
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 13',
      Type: 'Card B',
      Amount: 1077520.55,
      Count: 35567
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 13',
      Type: 'Card C',
      Amount: 241810.04,
      Count: 7468
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 14',
      Type: 'Card A',
      Amount: 6881648.91,
      Count: 18626
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 14',
      Type: 'Card B',
      Amount: 320388.61,
      Count: 3634
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 14',
      Type: 'Card C',
      Amount: 44690.07,
      Count: 300
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 15',
      Type: 'Card A',
      Amount: 9172912.78,
      Count: 35599
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 15',
      Type: 'Card B',
      Amount: 350353.4,
      Count: 4096
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 15',
      Type: 'Card C',
      Amount: 102179.88,
      Count: 1713
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 16',
      Type: 'Card A',
      Amount: 1214515.43,
      Count: 4672
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 16',
      Type: 'Card B',
      Amount: 69558.87,
      Count: 572
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 16',
      Type: 'Card C',
      Amount: 6525.07,
      Count: 51
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 17',
      Type: 'Card A',
      Amount: 59700574.35,
      Count: 184629
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 17',
      Type: 'Card B',
      Amount: 2202082.46,
      Count: 11409
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 17',
      Type: 'Card C',
      Amount: 775853.61,
      Count: 5721
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 18',
      Type: 'Card A',
      Amount: 15443678.08,
      Count: 76079
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 18',
      Type: 'Card B',
      Amount: 3415262.67,
      Count: 36941
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 18',
      Type: 'Card C',
      Amount: 171567.78,
      Count: 2319
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 19',
      Type: 'Card A',
      Amount: 1931539.38,
      Count: 130913
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 19',
      Type: 'Card B',
      Amount: 271395.14,
      Count: 22720
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 19',
      Type: 'Card C',
      Amount: 135527.17,
      Count: 10542
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 20',
      Type: 'Card A',
      Amount: 17937372.98,
      Count: 337620
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 20',
      Type: 'Card B',
      Amount: 962049.149999999,
      Count: 28821
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 20',
      Type: 'Card C',
      Amount: 923044.44,
      Count: 25856
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 21',
      Type: 'Card A',
      Amount: 22873283.2,
      Count: 413816
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 21',
      Type: 'Card B',
      Amount: 4113639.04,
      Count: 196781
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 21',
      Type: 'Card C',
      Amount: 455309.37,
      Count: 10365
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 22',
      Type: 'Card A',
      Amount: 5884396.26,
      Count: 86071
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 22',
      Type: 'Card B',
      Amount: 779729.59,
      Count: 25309
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 22',
      Type: 'Card C',
      Amount: 150877.01,
      Count: 3536
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 23',
      Type: 'Card A',
      Amount: 3677772.8,
      Count: 139609
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 23',
      Type: 'Card B',
      Amount: 696288.59,
      Count: 45503
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 23',
      Type: 'Card C',
      Amount: 48880.19,
      Count: 1822
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 24',
      Type: 'Card A',
      Amount: 24354020.19,
      Count: 1001505
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 24',
      Type: 'Card B',
      Amount: 7771634.34,
      Count: 661363
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 24',
      Type: 'Card C',
      Amount: 368519.67,
      Count: 12572
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 25',
      Type: 'Card A',
      Amount: 15378770.53,
      Count: 41881
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 25',
      Type: 'Card B',
      Amount: 827720.15,
      Count: 4716
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 25',
      Type: 'Card C',
      Amount: 152328.37,
      Count: 1079
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 26',
      Type: 'Card A',
      Amount: 6465416.91000001,
      Count: 23560
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 26',
      Type: 'Card B',
      Amount: 124181.8,
      Count: 539
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 26',
      Type: 'Card C',
      Amount: 32450.96,
      Count: 226
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 27',
      Type: 'Card A',
      Amount: 1910835.05,
      Count: 9503
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 27',
      Type: 'Card B',
      Amount: 291379.49,
      Count: 2712
    },
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 27',
      Type: 'Card C',
      Amount: 43101.68,
      Count: 424
    }
  ];
  @State() hoverElement: any = '';
  @State() clickElement: any = [
    {
      Month: 'Sep 2018',
      Client: 'Data Visualization is Fun',
      Category: 'Segment 17',
      Type: 'Card A',
      Amount: 59700574.35,
      Count: 184629
    }
  ];
  @State() dataState: boolean = false;

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {}

  onClickFunc(d) {
    const index = this.clickElement.indexOf(d.detail);
    const newClicks = [...this.clickElement];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d.detail);
    }
    this.clickElement = newClicks;
  }
  onHoverFunc(d) {
    console.log('we are hovering on', d.detail);
    this.hoverElement = d.detail;
  }
  onMouseOut() {
    console.log('we have moused out');
    this.hoverElement = '';
  }

  changeData() {
    const data1 = [
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card A',
        Amount: 7183112.43,
        Count: 110625
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card B',
        Amount: 1564836.79,
        Count: 49943
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card C',
        Amount: 108029.66,
        Count: 3362
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card A',
        Amount: 8837433.39,
        Count: 141861
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card B',
        Amount: 1552421.74,
        Count: 38539
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card C',
        Amount: 215830.19,
        Count: 6000
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card A',
        Amount: 922087.59,
        Count: 26383
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card B',
        Amount: 103449.26,
        Count: 3773
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card C',
        Amount: 37785.74,
        Count: 2008
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card A',
        Amount: 10594810.85,
        Count: 71921
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card B',
        Amount: 928383.95,
        Count: 11835
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card C',
        Amount: 149925.82,
        Count: 2024
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card A',
        Amount: 12570176.46,
        Count: 174130
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card B',
        Amount: 1706143.55,
        Count: 57214
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card C',
        Amount: 318331.23,
        Count: 2705
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card A',
        Amount: 33765430.8,
        Count: 401115
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card B',
        Amount: 20203740.78,
        Count: 489756
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card C',
        Amount: 321505.83,
        Count: 7015
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card A',
        Amount: 10257071,
        Count: 218639
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card B',
        Amount: 1741911.02,
        Count: 40025
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card C',
        Amount: 481962.62,
        Count: 18333
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card A',
        Amount: 6078826.43,
        Count: 150726
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card B',
        Amount: 1077520.55,
        Count: 35567
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card C',
        Amount: 241810.04,
        Count: 7468
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card A',
        Amount: 6881648.91,
        Count: 18626
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card B',
        Amount: 320388.61,
        Count: 3634
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card C',
        Amount: 44690.07,
        Count: 300
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card A',
        Amount: 9172912.78,
        Count: 35599
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card B',
        Amount: 350353.4,
        Count: 4096
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card C',
        Amount: 102179.88,
        Count: 1713
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card A',
        Amount: 1214515.43,
        Count: 4672
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card B',
        Amount: 69558.87,
        Count: 572
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card C',
        Amount: 6525.07,
        Count: 51
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card A',
        Amount: 59700574.35,
        Count: 184629
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card B',
        Amount: 2202082.46,
        Count: 11409
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card C',
        Amount: 775853.61,
        Count: 5721
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card A',
        Amount: 15443678.08,
        Count: 76079
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card B',
        Amount: 3415262.67,
        Count: 36941
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card C',
        Amount: 171567.78,
        Count: 2319
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card A',
        Amount: 1931539.38,
        Count: 130913
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card B',
        Amount: 271395.14,
        Count: 22720
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card C',
        Amount: 135527.17,
        Count: 10542
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 20',
        Type: 'Card A',
        Amount: 17937372.98,
        Count: 337620
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 20',
        Type: 'Card B',
        Amount: 962049.149999999,
        Count: 28821
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 20',
        Type: 'Card C',
        Amount: 923044.44,
        Count: 25856
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 21',
        Type: 'Card A',
        Amount: 22873283.2,
        Count: 413816
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 21',
        Type: 'Card B',
        Amount: 4113639.04,
        Count: 196781
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 21',
        Type: 'Card C',
        Amount: 455309.37,
        Count: 10365
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 22',
        Type: 'Card A',
        Amount: 5884396.26,
        Count: 86071
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 22',
        Type: 'Card B',
        Amount: 779729.59,
        Count: 25309
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 22',
        Type: 'Card C',
        Amount: 150877.01,
        Count: 3536
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 23',
        Type: 'Card A',
        Amount: 3677772.8,
        Count: 139609
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 23',
        Type: 'Card B',
        Amount: 696288.59,
        Count: 45503
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 23',
        Type: 'Card C',
        Amount: 48880.19,
        Count: 1822
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 24',
        Type: 'Card A',
        Amount: 24354020.19,
        Count: 1001505
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 24',
        Type: 'Card B',
        Amount: 7771634.34,
        Count: 661363
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 24',
        Type: 'Card C',
        Amount: 368519.67,
        Count: 12572
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 25',
        Type: 'Card A',
        Amount: 15378770.53,
        Count: 41881
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 25',
        Type: 'Card B',
        Amount: 827720.15,
        Count: 4716
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 25',
        Type: 'Card C',
        Amount: 152328.37,
        Count: 1079
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 26',
        Type: 'Card A',
        Amount: 6465416.91000001,
        Count: 23560
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 26',
        Type: 'Card B',
        Amount: 124181.8,
        Count: 539
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 26',
        Type: 'Card C',
        Amount: 32450.96,
        Count: 226
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 27',
        Type: 'Card A',
        Amount: 1910835.05,
        Count: 9503
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 27',
        Type: 'Card B',
        Amount: 291379.49,
        Count: 2712
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 27',
        Type: 'Card C',
        Amount: 43101.68,
        Count: 424
      }
    ];
    const data2 = [
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 1',
        Type: 'Card A',
        Amount: 16045441.28,
        Count: 61031
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 1',
        Type: 'Card B',
        Amount: 1193401.13,
        Count: 5454
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 1',
        Type: 'Card C',
        Amount: 130223.13,
        Count: 979
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 2',
        Type: 'Card A',
        Amount: 21350560.5,
        Count: 188623
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 2',
        Type: 'Card B',
        Amount: 3895899.66,
        Count: 51584
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 2',
        Type: 'Card C',
        Amount: 481032.9,
        Count: 6589
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 3',
        Type: 'Card A',
        Amount: 5473629.96,
        Count: 20165
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 3',
        Type: 'Card B',
        Amount: 621565.76,
        Count: 3088
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 3',
        Type: 'Card C',
        Amount: 53928.9,
        Count: 417
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 4',
        Type: 'Card A',
        Amount: 24707428.31,
        Count: 142980
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 4',
        Type: 'Card B',
        Amount: 1138981.57,
        Count: 31395
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 4',
        Type: 'Card C',
        Amount: 220298.67,
        Count: 3842
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 5',
        Type: 'Card A',
        Amount: 9378401.15,
        Count: 123333
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 5',
        Type: 'Card B',
        Amount: 1677467.71,
        Count: 56891
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 5',
        Type: 'Card C',
        Amount: 242878.33,
        Count: 5037
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card A',
        Amount: 7183112.43,
        Count: 110625
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card B',
        Amount: 1564836.79,
        Count: 49943
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 6',
        Type: 'Card C',
        Amount: 108029.66,
        Count: 3362
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card A',
        Amount: 8837433.39,
        Count: 141861
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card B',
        Amount: 1552421.74,
        Count: 38539
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 7',
        Type: 'Card C',
        Amount: 215830.19,
        Count: 6000
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card A',
        Amount: 922087.59,
        Count: 26383
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card B',
        Amount: 103449.26,
        Count: 3773
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 8',
        Type: 'Card C',
        Amount: 37785.74,
        Count: 2008
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card A',
        Amount: 10594810.85,
        Count: 71921
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card B',
        Amount: 928383.95,
        Count: 11835
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 9',
        Type: 'Card C',
        Amount: 149925.82,
        Count: 2024
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card A',
        Amount: 12570176.46,
        Count: 174130
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card B',
        Amount: 1706143.55,
        Count: 57214
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 10',
        Type: 'Card C',
        Amount: 318331.23,
        Count: 2705
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card A',
        Amount: 33765430.8,
        Count: 401115
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card B',
        Amount: 20203740.78,
        Count: 489756
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 11',
        Type: 'Card C',
        Amount: 321505.83,
        Count: 7015
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card A',
        Amount: 10257071,
        Count: 218639
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card B',
        Amount: 1741911.02,
        Count: 40025
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 12',
        Type: 'Card C',
        Amount: 481962.62,
        Count: 18333
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card A',
        Amount: 6078826.43,
        Count: 150726
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card B',
        Amount: 1077520.55,
        Count: 35567
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 13',
        Type: 'Card C',
        Amount: 241810.04,
        Count: 7468
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card A',
        Amount: 6881648.91,
        Count: 18626
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card B',
        Amount: 320388.61,
        Count: 3634
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 14',
        Type: 'Card C',
        Amount: 44690.07,
        Count: 300
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card A',
        Amount: 9172912.78,
        Count: 35599
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card B',
        Amount: 350353.4,
        Count: 4096
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 15',
        Type: 'Card C',
        Amount: 102179.88,
        Count: 1713
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card A',
        Amount: 1214515.43,
        Count: 4672
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card B',
        Amount: 69558.87,
        Count: 572
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 16',
        Type: 'Card C',
        Amount: 6525.07,
        Count: 51
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card A',
        Amount: 59700574.35,
        Count: 184629
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card B',
        Amount: 2202082.46,
        Count: 11409
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 17',
        Type: 'Card C',
        Amount: 775853.61,
        Count: 5721
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card A',
        Amount: 15443678.08,
        Count: 76079
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card B',
        Amount: 3415262.67,
        Count: 36941
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 18',
        Type: 'Card C',
        Amount: 171567.78,
        Count: 2319
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card A',
        Amount: 1931539.38,
        Count: 130913
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card B',
        Amount: 271395.14,
        Count: 22720
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 19',
        Type: 'Card C',
        Amount: 135527.17,
        Count: 10542
      },
      {
        Month: 'Sep 2018',
        Client: 'Data Visualization is Fun',
        Category: 'Segment 20',
        Type: 'Card A',
        Amount: 17937372.98,
        Count: 337620
      }
    ];
    this.dataState = !this.dataState;
    this.data = this.dataState ? data1 : data2;
    console.log('we are in change data', this.dataState, this.data);
  }

  render() {
    console.log('!!!!app re-render', this.clickElement, this.hoverElement);
    return (
      <div>
        <button onClick={() => this.changeData()}> Change Data </button>
        <clustered-force-layout
          data={this.data}
          width={800}
          height={600}
          drag={false}
          nodeAccessor={'Category'}
          nodeSizeAccessor={'Amount'}
          colorPalette={'diverging_GtoP'}
          clusterAccessor={'Type'}
          mainTitle={'Segment Breakdown'}
          subTitle={'A look into segment spend'}
          dataLabel={{
            visible: true,
            placement: 'center',
            content: 'nodeSizeAccessor',
            format: '$0.0a'
          }}
          cursor={'pointer'}
          interactionKeys={['Category']}
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
