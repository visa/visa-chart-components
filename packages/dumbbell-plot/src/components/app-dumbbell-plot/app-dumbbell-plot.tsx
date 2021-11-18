/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Event, EventEmitter, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

@Component({
  tag: 'app-dumbbell-plot',
  styleUrl: 'app-dumbbell-plot.scss'
})
export class AppDumbbellPlot {
  @State() data: any = [];
  @State() hoverElement: any = '';
  @State() clickElement: any = [
    // {
    //   altOrdinal: 'B',
    //   altValue: 2,
    //   altSeries: 'abc',
    //   time: new Date('2016-02-01T02:00:00.000Z'),
    //   date: 'Second',
    //   category: 'You',
    //   value: 0.022628909842
    // }
  ];
  @Event() updateComponent: EventEmitter;
  @State() stateTrigger: any = 3;
  @State() barSize: any = 1;
  @State() layout: any = 'vertical';
  // @State() layout: any = 'horizontal';
  @State() valueAccessor: any = 'value';
  @State() ordinalAccessor: any = 'date';
  @State() seriesAccessor: any = 'category';
  @State() dataLabelAccessor: any = 'value';
  @State() markerType: any = 'dot';
  @State() diffLabelVis: any = true;
  @State() markerSize: any = 8;
  @State() height: any = 500;
  @State() width: any = 700;
  @State() sortOrder: any = '';
  @State() xAxisVis: any = true;
  @State() yAxisVis: any = true;
  @State() dataLabelPlacement: any = 'auto';
  @State() seriesLabelPlacement: any = 'auto';
  @State() tooltipAccessor: any = 'category';
  @State() dataLabelVisible: any = true;
  @State() seriesLabelVisible: any = true;
  @State() legendLabels: any = ['You', 'Them'];
  @State() timeUnit: string = 'month'; // NOTE: ordinalAccessor must be set to 'time' to test this
  @State() xFormat: string = '%b'; // NOTE: ordinalAccessor must be set to 'time' to test this
  @State() colorPalette: string = 'categorical'; // NOTE: ordinalAccessor must be set to 'time' to test this
  @State() focusKey: string = '';
  @State() markerVisible: boolean = true;
  @State() focusSize: number = 2;
  @State() interactionKeys: any = ['date'];
  @State() accessibility: any = {
    hideStrokes: false,
    includeDataKeyNames: true,
    keyboardNavConfig: { disabled: false }
  };
  @State() dataLabel: any = {
    visible: this.dataLabelVisible,
    placement: this.dataLabelPlacement,
    labelAccessor: this.dataLabelAccessor,
    format: '0.0%'
  };
  @State() seriesLabel: any = {
    visible: this.seriesLabelVisible,
    placement: this.seriesLabelPlacement,
    label: this.seriesAccessor,
    format: '0.0%'
  };
  @State() differenceLabel: any = {
    visible: this.diffLabelVis,
    placement: 'auto',
    calculation: 'absoluteDiff',
    format: '0.0%'
  };
  @State() xAxis: any = {
    visible: this.xAxisVis,
    gridVisible: true,
    label: 'x-axis',
    tickInterval: 1,
    format: this.xFormat,
    unit: this.timeUnit
  };
  @State() yAxis: any = {
    visible: this.yAxisVis,
    gridVisible: true,
    label: '',
    format: '%',
    tickInterval: 2
  };
  @State() marker: any = {
    visible: this.markerVisible,
    type: this.markerType,
    sizeFromBar: this.markerSize
  };
  @State() focusMarker: any = {
    key: this.focusKey,
    sizeFromBar: this.focusSize
  };
  @State() barStyle: any = {
    width: this.barSize,
    opacity: 0.5,
    colorRule: 'default'
  };
  @State() legend: any = {
    labels: this.legendLabels,
    visible: true
  };
  @State() suppressEvents: boolean = false;
  @State() animations: any = { disabled: false };
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
  dataStorage: any = [
    [
      {
        altOrdinal: 'A',
        altValue: 2,
        altSeries: 'abc',
        time: new Date('2016-01-01T01:00:00.000Z'), // NOTE: ordinalAccessor must be set to 'time' to test this
        date: 'First',
        category: 'You',
        value: 0.000070994739
      },
      {
        altOrdinal: 'B',
        altValue: 2,
        altSeries: 'abc',
        time: new Date('2016-02-01T02:00:00.000Z'),
        date: 'Second',
        category: 'You',
        value: 0.022628909842
      },
      {
        altOrdinal: 'C',
        altValue: 2,
        altSeries: 'abc',
        time: new Date('2016-03-01T04:00:00.000Z'),
        date: 'Third',
        category: 'You',
        value: 0.020358837379
      },
      {
        altOrdinal: 'D',
        altValue: 2,
        altSeries: 'abc',
        time: new Date('2016-04-01T08:00:00.000Z'),
        date: 'Fourth',
        category: 'You',
        value: 0.02134842966
      },
      {
        altOrdinal: 'A',
        altValue: 8,
        altSeries: '123',
        time: new Date('2016-01-01T01:00:00.000Z'),
        date: 'First',
        category: 'Them',
        value: 0.016370994739
      },
      {
        altOrdinal: 'B',
        altValue: 8,
        altSeries: '123',
        time: new Date('2016-02-01T02:00:00.000Z'),
        date: 'Second',
        category: 'Them',
        value: 0.017628909842
      },
      {
        altOrdinal: 'C',
        altValue: 8,
        altSeries: '123',
        time: new Date('2016-03-01T04:00:00.000Z'),
        date: 'Third',
        category: 'Them',
        value: 0.018358837379
      },
      {
        altOrdinal: 'D',
        altValue: 8,
        altSeries: '123',
        time: new Date('2016-04-01T08:00:00.000Z'),
        date: 'Fourth',
        category: 'Them',
        value: 0.018334842966
      }
    ],
    [
      { altOrdinal: 'A', altValue: 2, altSeries: 'abc', date: 'First', category: 'You', value: 0.024572994739 },
      { altOrdinal: 'B', altValue: 2, altSeries: 'abc', date: 'Second', category: 'You', value: 0.0226245609842 },
      { altOrdinal: 'C', altValue: 3, altSeries: 'abc', date: 'Third', category: 'You', value: 0.02023467379 },
      { altOrdinal: 'D', altValue: 1, altSeries: 'abc', date: 'Fourth', category: 'You', value: 0.02467366 },
      { altOrdinal: 'A', altValue: 2, altSeries: '123', date: 'First', category: 'Them', value: 0.016370994739 },
      { altOrdinal: 'B', altValue: 6, altSeries: '123', date: 'Second', category: 'Them', value: 0.017628909842 },
      { altOrdinal: 'C', altValue: 4, altSeries: '123', date: 'Third', category: 'Them', value: 0.018358837379 },
      { altOrdinal: 'D', altValue: 8, altSeries: '123', date: 'Fourth', category: 'Them', value: 0.018334842966 }
    ],
    [
      { altOrdinal: 'A', altValue: 2, altSeries: 'abc', date: 'First', category: 'You', value: 0.024572994739 },
      { altOrdinal: 'B', altValue: 1, altSeries: 'abc', date: 'Third', category: 'You', value: 0.02023467379 },
      { altOrdinal: 'C', altValue: 2, altSeries: 'abc', date: 'Fourth', category: 'You', value: 0.022467366 },
      { altOrdinal: 'D', altValue: 1, altSeries: 'abc', date: 'Fifth', category: 'You', value: 0.032467366 },
      { altOrdinal: 'A', altValue: 5, altSeries: '123', date: 'First', category: 'Them', value: 0.016370994739 },
      { altOrdinal: 'B', altValue: 6, altSeries: '123', date: 'Third', category: 'Them', value: 0.018358837379 },
      { altOrdinal: 'C', altValue: 7, altSeries: '123', date: 'Fourth', category: 'Them', value: 0.018334842966 },
      { altOrdinal: 'D', altValue: 8, altSeries: '123', date: 'Fifth', category: 'Them', value: 0.022467366 }
    ],
    [
      { altOrdinal: 'A', altValue: 6, altSeries: 'abc', date: 'First', category: 'You', value: 0.054572994739 },
      { altOrdinal: 'B', altValue: 5, altSeries: 'abc', date: 'Third', category: 'You', value: 0.02823467379 },
      { altOrdinal: 'C', altValue: 1, altSeries: 'abc', date: 'Fourth', category: 'You', value: 0.0222467366 },
      { altOrdinal: 'D', altValue: 5, altSeries: 'abc', date: 'Fifth', category: 'You', value: 0.087372994739 },
      { altOrdinal: 'A', altValue: 2, altSeries: '123', date: 'First', category: 'Them', value: 0.016370994739 },
      { altOrdinal: 'B', altValue: 7, altSeries: '123', date: 'Third', category: 'Them', value: 0.023358837379 },
      { altOrdinal: 'C', altValue: 2, altSeries: '123', date: 'Fourth', category: 'Them', value: 0.046334842966 },
      { altOrdinal: 'D', altValue: 8, altSeries: '123', date: 'Fifth', category: 'Them', value: 0.03472994739 }
    ]
  ];

  @Element()
  appEl: HTMLElement;

  button = document.querySelector('input');

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
  onHoverFunc(d) {
    this.hoverElement = d.detail.data;
  }
  onMouseOut() {
    this.hoverElement = '';
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
  changeLayout() {
    this.layout = this.layout !== 'vertical' ? 'vertical' : 'horizontal';
  }
  changeValueAccessor() {
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'altValue';
    this.dataLabelAccessor = this.valueAccessor;
  }
  changeOrdinalAccessor() {
    this.ordinalAccessor = this.ordinalAccessor !== 'date' ? 'date' : 'altOrdinal';
  }
  changeSeriesAccessor() {
    this.seriesAccessor = this.seriesAccessor !== 'category' ? 'category' : 'altSeries';
  }
  changeTooltipAccessor() {
    this.tooltipAccessor = this.tooltipAccessor !== 'category' ? 'category' : 'altSeries';
  }
  changeDataLabelAccessor() {
    this.dataLabelAccessor = this.dataLabelAccessor !== 'value' ? 'value' : 'altValue';
  }

  changeMarkerType() {
    this.markerType = this.markerType !== 'dot' ? 'dot' : 'arrow';
  }
  turnDiffLabelOff() {
    this.diffLabelVis = this.diffLabelVis !== true ? true : false;
  }
  changeMarkerSize() {
    this.markerSize = this.markerSize !== 1 ? 1 : 1.5;
  }
  toggleFocusMarker() {
    this.focusKey = !this.focusKey ? 'Them' : '';
  }
  toggleMarkerVisibility() {
    console.log('we are now visible...', !this.markerVisible);
    this.markerVisible = !this.markerVisible;
  }
  changeFocusSize() {
    this.focusSize = 5 - this.focusSize;
  }
  changeHeight() {
    this.height = this.height !== 1000 ? 1000 : 1300;
  }
  changeWidth() {
    this.width = this.width !== 900 ? 900 : 1200;
  }
  xAxisVisible() {
    this.xAxisVis = this.xAxisVis === true ? false : true;
  }
  xAxisUnit() {
    this.timeUnit = this.timeUnit === 'month' ? 'day' : 'month';
  }
  yAxisVisible() {
    this.yAxisVis = this.yAxisVis === true ? false : true;
  }
  changeColorPalette() {
    this.colorPalette = this.colorPalette === 'categorical' ? 'diverging_RtoB' : 'categorical';
  }
  dataLabelVis() {
    this.dataLabelVisible = this.dataLabelVisible === true ? false : true;
  }
  seriesLabelVis() {
    this.seriesLabelVisible = this.seriesLabelVisible !== true ? true : false;
  }
  changeInteractionKeys() {
    this.interactionKeys = this.interactionKeys[0] === 'date' ? ['category'] : ['date'];
  }
  toggleStrokes() {
    this.accessibility = this.accessibility.hideStrokes
      ? { hideStrokes: false, includeDataKeyNames: true }
      : { hideStrokes: true };
  }
  changeBarSize() {
    this.barSize = this.barSize === 12 ? 30 : this.barSize === 30 ? 80 : 12;
  }
  changeLegendLabel() {
    this.legendLabels = this.legendLabels[0] !== 'You' ? ['You', 'Them'] : ['Legend Test', 'Different Label'];
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }
  // changeTimeFormat() {
  //   if (this.ordinalAccessor !== 'time') {
  //     this.ordinalAccessor = 'time';
  //   }
  //   this.timeUnit = this.timeUnit !== '%b' ? '%b' : '%i';
  //   console.log('time', this.ordinalAccessor, this.timeUnit);
  // }

  render() {
    console.log('!!!!app re-render');
    this.data = this.dataStorage[this.stateTrigger];
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
            this.changeLayout();
          }}
        >
          change layout
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
            this.changeOrdinalAccessor();
          }}
        >
          change ordinal accessor
        </button>
        <button
          onClick={() => {
            this.changeSeriesAccessor();
          }}
        >
          change series accessor
        </button>
        <button
          onClick={() => {
            this.changeDataLabelAccessor();
          }}
        >
          change data label accessor
        </button>
        <button
          onClick={() => {
            this.changeMarkerType();
          }}
        >
          change marker type
        </button>
        <button
          onClick={() => {
            this.changeMarkerSize();
          }}
        >
          change marker size
        </button>
        <button
          onClick={() => {
            this.toggleMarkerVisibility();
          }}
        >
          toggle marker visibility
        </button>
        <button
          onClick={() => {
            this.toggleFocusMarker();
          }}
        >
          toggle focus marker
        </button>
        <button
          onClick={() => {
            this.changeFocusSize();
          }}
        >
          change focus size
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
            this.changeWidth();
          }}
        >
          change width
        </button>
        <button
          onClick={() => {
            this.xAxisVisible();
          }}
        >
          xAxis visible
        </button>
        <button
          onClick={() => {
            this.xAxisUnit();
          }}
        >
          xAxis unit
        </button>
        <button
          onClick={() => {
            this.yAxisVisible();
          }}
        >
          yAxis visible
        </button>
        <button
          onClick={() => {
            this.changeColorPalette();
          }}
        >
          color palette
        </button>
        <br />
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
        <br />
        <br />
        <form action="">
          SORT ORDER
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'asc';
            }}
            name="asc"
            value="asc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'desc';
            }}
            name="desc"
            value="desc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'diffAsc';
            }}
            name="diffAsc"
            value="diffAsc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'diffDesc';
            }}
            name="diffDesc"
            value="diffDesc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'focusAsc';
            }}
            name="focusAsc"
            value="focusAsc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'focusDesc';
            }}
            name="focusDesc"
            value="focusDesc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'absoluteDiffAsc';
            }}
            name="absoluteDiffAsc"
            value="absoluteDiffAsc"
          />
          <input
            type="button"
            onClick={() => {
              this.sortOrder = 'absoluteDiffDesc';
            }}
            name="absoluteDiffDesc"
            value="absoluteDiffDesc"
          />
        </form>
        <br />
        <form action="">
          DATA LABEL PLACEMENT
          <input
            type="button"
            onClick={() => {
              this.dataLabelPlacement = 'auto';
            }}
            name="auto"
            value="auto"
          />
          <input
            type="button"
            onClick={() => {
              this.dataLabelPlacement = 'left';
            }}
            name="left"
            value="left"
          />
          <input
            type="button"
            onClick={() => {
              this.dataLabelPlacement = 'right';
            }}
            name="right"
            value="right"
          />
          <input
            type="button"
            onClick={() => {
              this.dataLabelPlacement = 'top';
            }}
            name="top"
            value="top"
          />
          <input
            type="button"
            onClick={() => {
              this.dataLabelPlacement = 'bottom';
            }}
            name="bottom"
            value="bottom"
          />
        </form>
        <br />
        <form action="">
          SERIES LABEL PLACEMENT
          <input
            type="button"
            onClick={() => {
              this.seriesLabelPlacement = 'auto';
            }}
            name="auto"
            value="auto"
          />
          <input
            type="button"
            onClick={() => {
              this.seriesLabelPlacement = 'right';
            }}
            name="right"
            value="right"
          />
          <input
            type="button"
            onClick={() => {
              this.seriesLabelPlacement = 'left';
            }}
            name="left"
            value="left"
          />
          <input
            type="button"
            onClick={() => {
              this.seriesLabelPlacement = 'top';
            }}
            name="top"
            value="top"
          />
          <input
            type="button"
            onClick={() => {
              this.seriesLabelPlacement = 'bottom';
            }}
            name="bottom"
            value="bottom"
          />
        </form>
        <br />
        <button
          onClick={() => {
            this.turnDiffLabelOff();
          }}
        >
          diff label visibility
        </button>
        <button
          onClick={() => {
            this.dataLabelVis();
          }}
        >
          data label visibility
        </button>
        <button
          onClick={() => {
            this.seriesLabelVis();
          }}
        >
          series label visibility
        </button>
        <br />
        <br />
        <button
          onClick={() => {
            this.changeInteractionKeys();
          }}
        >
          change interaction keys
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
            this.changeBarSize();
          }}
        >
          change bar size
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <dumbbell-plot
          animationConfig={this.animations}
          data={this.data}
          layout={this.layout}
          height={this.height}
          width={this.width}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          seriesAccessor={this.seriesAccessor}
          dataLabel={this.dataLabel}
          seriesLabel={this.seriesLabel}
          differenceLabel={this.differenceLabel}
          xAxis={this.xAxis}
          yAxis={this.yAxis}
          marker={this.marker}
          focusMarker={this.focusMarker}
          barStyle={this.barStyle}
          accessibility={this.accessibility}
          suppressEvents={this.suppressEvents}
          colorPalette={this.colorPalette}
          // clickStyle={{ color: 'darkred', strokeWidth: 20 }}
          // hoverStyle={{ color: 'red', strokeWidth: 17 }}
          interactionKeys={this.interactionKeys}
          sortOrder={this.sortOrder}
          legend={this.legend}
          // tooltipLabel={{
          //   format: '',
          //   labelAccessor: [this.tooltipAccessor],
          //   labelTitle: 'asdasdffas'
          // }}
          hoverOpacity={0.5}
          showTooltip={true}
          // annotations={this.annotations}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickEvent={d => this.onClickFunc(d)}
          onHoverEvent={d => this.onHoverFunc(d)}
          onMouseOutEvent={() => this.onMouseOut()}
          onInitialLoadEvent={e => e} // console.log('load event', e.detail, e)}
          onDrawStartEvent={e => e} // console.log('draw start event', e.detail, e)}
          onDrawEndEvent={e => e} // console.log('draw end event', e.detail, e)}
          onTransitionEndEvent={e => e} // console.log('transition event', e.detail, e)}
        />
      </div>
    );
  }
}
