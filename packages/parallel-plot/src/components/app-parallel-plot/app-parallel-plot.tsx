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
  tag: 'app-parallel-plot',
  styleUrl: 'app-parallel-plot.scss'
})
export class AppParallelPlot {
  @State() ordinalAccessor: any = 'them';
  @State() valueAccessor: any = 'spend';
  @State() seriesAccessor: any = 'filter';
  @State() tooltipLabel: any = {
    format: '',
    labelAccessor: [this.valueAccessor],
    labelTitle: ['value']
  };
  @State() height: any = 300;
  // @State() xFormat: any = '%Y';
  @State() labelAccessor: any = 'spend';
  @State() legendLabels: any = null;
  @State() clickStrokeWidth: any = '3px';
  @State() hoverStrokeWidth: any = '3px';
  @State() cursor: any = 'default';
  @State() dotOpacity: any = true;
  @State() data: any;
  @State() interactionKeys: any = ['filter'];
  @State() hoverElement: any = '';
  @State() clickElement: any = [
    {
      otherOrd: 'Q1',
      date: new Date('2012-01-01T00:00:00.000Z'),
      otherVal: 0.1,
      otherCat: 'NY',
      them: 'them',
      filter: 'group 1',
      spend: 0.29
    }
  ];
  @State() stateTrigger: any = 2;
  @State() seriesLabel: any = [];
  @State() animations: any = { disabled: false };
  @State() dataLabel: any = {
    visible: true,
    // placement: 'top-right',
    placement: 'auto',
    labelAccessor: this.valueAccessor,
    format: '0.0[a]',
    collisionHideOnly: true
  };
  @State() seriesLabelProp: any = {
    visible: true,
    placement: 'auto',
    label: this.seriesLabel,
    collisionHideOnly: true
  };
  @State() yAxis: any = {
    visible: true,
    gridVisible: false,
    label: 'y axis',
    tickInterval: 2,
    format: '%',
    scales: 'preNormalized'
  };
  @State() accessibility: any = {
    longDescription: 'This is a chart template that was made to showcase the Visa Chart Components parallel plot',
    contextExplanation: 'This chart exists in a demo app created to let you quickly change props and see results',
    executiveSummary: 'Within the category them subset, we see the largest difference between group 2 and group 1',
    purpose: 'The purpose of this chart template is to provide an example of a parallel plot',
    structureNotes:
      'The percentage of each group 2ers, group 1, and all groups are shown as points in each of the four categories. These points of each group are connected by lines.',
    statisticalNotes: 'This chart is using dummy data',
    onChangeFunc: d => {
      this.onChange(d);
    },
    includeDataKeyNames: true,
    keyboardNavConfig: { disabled: false }
  };
  @State() suppressEvents: boolean = false;
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
  clickStyle: any;
  hoverStyle: any;
  secondaryLines: any = { keys: [], showDataLabel: true, showSeriesLabel: true, opacity: 0.8 };
  dataStorage: any = [
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'them subset',
        filter: 'all',
        spend: 0.28
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'them subset',
        filter: 'group 1',
        spend: 0.18
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.16,
        otherCat: 'MN',
        them: 'them',
        filter: 'other group',
        spend: 0.12
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.67,
        otherCat: 'MN',
        them: 'them subset',
        filter: 'other group',
        spend: 0.7
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.25,
        otherCat: 'MN',
        them: 'you',
        filter: 'other group',
        spend: 0.1
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.16,
        otherCat: 'MN',
        them: 'them',
        filter: 'group 2',
        spend: 0.82
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.25,
        otherCat: 'MN',
        them: 'you',
        filter: 'group 2',
        spend: 0.26
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'them subset',
        filter: 'all',
        spend: 0.28
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.24,
        otherCat: 'CA',
        them: 'your subbrand',
        filter: 'all',
        spend: 0.51
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'them subset',
        filter: 'group 1',
        spend: 0.18
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.13,
        otherCat: 'NY',
        them: 'your subbrand',
        filter: 'group 1',
        spend: 0.31
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.16,
        otherCat: 'MN',
        them: 'them',
        filter: 'group 2',
        spend: 0.82
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.67,
        otherCat: 'MN',
        them: 'them subset',
        filter: 'group 2',
        spend: 0.9
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.25,
        otherCat: 'MN',
        them: 'you',
        filter: 'group 2',
        spend: 0.26
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.35,
        otherCat: 'MN',
        them: 'your subbrand',
        filter: 'group 2',
        spend: 0.65
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'them subset',
        filter: 'all',
        spend: 0.28
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.24,
        otherCat: 'CA',
        them: 'your subbrand',
        filter: 'all',
        spend: 0.51
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'them subset',
        filter: 'group 1',
        spend: 0.18
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.13,
        otherCat: 'NY',
        them: 'your subbrand',
        filter: 'group 1',
        spend: 0.31
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.169
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'them subset',
        filter: 'all',
        spend: 0.58
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.41
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.24,
        otherCat: 'CA',
        them: 'your subbrand',
        filter: 'all',
        spend: 0.91
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 1
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'them subset',
        filter: 'group 1',
        spend: 0.48
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.21
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.13,
        otherCat: 'NY',
        them: 'your subbrand',
        filter: 'group 1',
        spend: 0.51
      }
    ],
    [
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.55,
        otherCat: 'CA',
        them: 'them',
        filter: 'all',
        spend: 0.69
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.45,
        otherCat: 'CA',
        them: 'them subset',
        filter: 'all',
        spend: 0.28
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'CA',
        them: 'you',
        filter: 'all',
        spend: 0.31
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.24,
        otherCat: 'CA',
        them: 'your subbrand',
        filter: 'all',
        spend: 0.51
      },
      {
        otherOrd: 'Q1',
        date: new Date('2012-01-01T00:00:00.000Z'),
        otherVal: 0.1,
        otherCat: 'NY',
        them: 'them',
        filter: 'group 1',
        spend: 0.29
      },
      {
        otherOrd: 'Q2',
        date: new Date('2013-01-01T00:00:00.000Z'),
        otherVal: 0.9,
        otherCat: 'NY',
        them: 'them subset',
        filter: 'group 1',
        spend: 0.18
      },
      {
        otherOrd: 'Q3',
        date: new Date('2014-01-01T00:00:00.000Z'),
        otherVal: 0.22,
        otherCat: 'NY',
        them: 'you',
        filter: 'group 1',
        spend: 0.71
      },
      {
        otherOrd: 'Q4',
        date: new Date('2015-01-01T00:00:00.000Z'),
        otherVal: 0.13,
        otherCat: 'NY',
        them: 'your subbrand',
        filter: 'group 1',
        spend: 0.31
      }
    ]
  ];

  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    filter: 'Grouping',
    them: 'Set',
    spend: 'Named Value'
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
  onChange(d) {
    console.log('change', d);
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
  changeOrdinalAccessor() {
    this.ordinalAccessor = this.ordinalAccessor !== 'them' ? 'them' : 'otherOrd';
  }

  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'spend' ? 'spend' : 'otherVal';
  }
  changeSeriesAccessor() {
    this.seriesAccessor = this.seriesAccessor !== 'filter' ? 'filter' : 'otherCat';
  }
  changeHeight() {
    this.height = this.height !== 600 ? 600 : 300;
  }
  // changeXformat() {
  //   this.xFormat = this.xFormat !== '%y' ? '%y' : '%Y';
  //   console.log(this.xFormat);
  // }
  changeLabelAccessor() {
    this.labelAccessor = this.labelAccessor !== 'spend' ? 'spend' : 'otherVal';
  }
  changeSeriesLabel() {
    this.seriesLabel = this.seriesLabel.length >= 1 ? [] : ['series A', 'series B', 'series C'];
  }
  changeLegendLabels() {
    this.legendLabels = this.legendLabels ? null : ['series A', 'series B', 'series C'];
    console.log;
  }
  changeTooltipLabel() {
    this.tooltipLabel =
      this.tooltipLabel.labelAccessor[0] !== this.valueAccessor
        ? { format: ['0%'], labelAccessor: [this.valueAccessor], labelTitle: ['value'] }
        : { format: '', labelAccessor: [this.seriesAccessor], labelTitle: [this.seriesAccessor] };
    // @State() colors: any = [ : 'otherGroup';
  }
  changeHoverStyle() {
    this.hoverStrokeWidth = this.hoverStrokeWidth !== '3px' ? '3px' : '1px';
  }
  changeClickStyle() {
    this.clickStrokeWidth = this.clickStrokeWidth !== '3px' ? '3px' : '1px';
  }
  changeCursor() {
    this.cursor = this.cursor !== 'default' ? 'default' : 'pointer';
  }
  changeDotOpacity() {
    this.dotOpacity = this.dotOpacity !== true ? true : false;
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }

  render() {
    this.data = this.dataStorage[this.stateTrigger];
    this.clickStyle = { color: '#222222', strokeWidth: this.clickStrokeWidth };
    this.hoverStyle = { color: '#e4e4e4', strokeWidth: this.hoverStrokeWidth };
    return (
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
        {/* <button
          onClick={() => {
            this.changeXformat();
          }}
        >
          change x-axis format
        </button> */}
        <button
          onClick={() => {
            this.changeLabelAccessor();
          }}
        >
          change label accessor
        </button>
        <button
          onClick={() => {
            this.changeSeriesLabel();
          }}
        >
          toggle custom series label
        </button>
        <button
          onClick={() => {
            this.changeLegendLabels();
          }}
        >
          toggle custom legend labels
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
            this.changeHoverStyle();
          }}
        >
          change hover style
        </button>
        <button
          onClick={() => {
            this.changeClickStyle();
          }}
        >
          change click style
        </button>
        <button
          onClick={() => {
            this.changeCursor();
          }}
        >
          change cursor
        </button>
        <button
          onClick={() => {
            this.changeDotOpacity();
          }}
        >
          show/hide dots
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <parallel-plot
          // localization={{
          //   language: hu,
          //   numeralLocale: HU,
          //   skipValidation: false
          // }}
          mainTitle="Parallel Plot Default"
          animationConfig={this.animations}
          subTitle="Interaction Style"
          width={500}
          height={this.height}
          data={this.data}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          seriesAccessor={this.seriesAccessor}
          seriesLabel={this.seriesLabelProp}
          dataLabel={this.dataLabel}
          dataKeyNames={this.dataKeyNames}
          yAxis={this.yAxis}
          dotRadius={5}
          strokeWidth={2}
          showDots={this.dotOpacity}
          // tooltipLabel={this.tooltipLabel}
          hoverOpacity={0.5}
          secondaryLines={this.secondaryLines}
          cursor={this.cursor}
          // annotations={this.annotations}
          interactionKeys={this.interactionKeys}
          clickStyle={this.clickStyle}
          hoverStyle={this.hoverStyle}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          accessibility={this.accessibility}
          suppressEvents={this.suppressEvents}
          onClickEvent={d => this.onClickFunc(d)}
          onHoverEvent={d => this.onHoverFunc(d)}
          onMouseOutEvent={() => this.onMouseOut()}
          // onInitialLoadEvent={e => e} // console.log('load event', e.detail, e)}
          // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
          // onDrawStartEvent={e => e} // console.log('draw start event', e.detail, e)}
          // onDrawEndEvent={e => e} // console.log('draw end event', e.detail, e)}
          // onTransitionEndEvent={e => e} //console.log('transition event', e.detail, e)}
        />
      </div>
    );
  }
}
