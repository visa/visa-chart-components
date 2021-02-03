/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import Utils from '@visa/visa-charts-utils';
import '@visa/visa-charts-data-table';

const { findTagLevel } = Utils;

@Component({
  tag: 'app-bar-chart',
  styleUrl: 'app-bar-chart.scss'
})
export class AppBarChart {
  @State() highestHeadingLevel: string | number = 'h3';
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() width: number = 800;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() barIntervalRatio = 0.15;
  @State() padding: any = {
    top: 20,
    left: 60,
    right: 30,
    bottom: 40
  };
  @State() uniqueID: string = 'thisIsUnique';
  @State() dataLabel: any = { visible: true, placement: 'bottom', labelAccessor: 'value', format: '0.0[a]' };
  @State() tooltipLabel: any = {
    labelAccessor: ['region', 'country', 'value'],
    labelTitle: ['', 'country', 'value'],
    format: ['', '', '0,0[.0][a]']
  };
  @State() clickElement: any = [];
  @State() interactionState: any = ['region'];
  @State() valueAccessor: any = 'value';
  @State() groupAccessor: any = 'region';
  @State() ordinalAccessor: any = 'country';
  @State() hoverElementTest: any = '';
  @State() clickElementTest: any = [];
  @State() accessibility: any = {
    elementDescriptionAccessor: 'note', // see Indonesia above
    longDescription:
      'This is a bar chart that shows spending (in millions) on purchases in select market segments, across the top ten countries.',
    contextExplanation: 'This chart is the output of filters involving market segment selection.',
    executiveSummary:
      'Indonesia has a massive spend per capita, second in volume only to the US at one hundred eleven million dollars.',
    purpose:
      'Looking at the top ten countries by spend on a market segment can help show outliers or emerging market leaders in this area.',
    structureNotes: 'The bars are sorted in descending order and colored according to their regional grouping.',
    statisticalNotes:
      'Values here represent total spend in raw volume by market segment. These values are the sum of FY19 performance.',
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
        label: "China's Volume-per-capita is massively under market performance.",
        bgPadding: 20,
        title: 'Low Volume Per Capita',
        align: 'middle',
        wrap: 210
      },
      accessibilityDescription:
        'This annotation is a callout to China, which only has 27 million volume but 1.3 billion people.',
      data: { country: 'China', value: '27', region: 'Asia' },
      dy: '-20%',
      color: 'categorical_blue'
    }
  ];
  hoverStyle: any = {
    color: '#979db7',
    strokeWidth: 1.5
  };
  clickStyle: any = {
    color: '#8fdcc7',
    strokeWidth: 8
  };
  // colors: any = ['#2e3047', '#43455c', '#3c3f58'];
  colors: any = ['#EDEEF3', '#A8AABB', '#6C6E86', '#3c3f58'];
  // colors: any = ['#EBF4FA','#F2F2FF', '#FAFDF6'];
  startData: any = [
    {
      country: 'China',
      otherValue: '37',
      value: '27',
      region: 'Asia',
      test: 'Group A',
      tempDate: new Date(1986, 0, 2, 11, 39, 13),
      nonSense: 'test'
    },
    { country: 'Japan', otherValue: '24', value: '5', region: 'Asia', test: 'Group A', nonSense: 'test' },
    { country: 'Thailand', otherValue: '7', value: '52', region: 'Asia', test: 'Group A', nonSense: 'test' },
    {
      country: 'United States',
      otherValue: '30',
      value: '121',
      region: 'North America',
      test: 'Group A',
      tempDate: new Date(2018, 0, 2, 11, 39, 13),
      nonSense: 'test'
    },
    { country: 'Canada', otherValue: '20', value: '24', test: 'Group A', region: 'North America', nonSense: 'test' },
    { country: 'India', otherValue: '37', value: '21', test: 'Group b', region: 'Asia', nonSense: 'test' },
    {
      country: 'Indonesia',
      otherValue: '3',
      value: '73',
      test: 'Group b',
      region: 'Asia',
      note: 'The per capita ranking is 947% above the median',
      nonSense: 'test'
    },
    { country: 'Germany', otherValue: '16', value: '61', test: 'Group b', region: 'Europe', nonSense: 'test' },
    { country: 'Turkey', otherValue: '21', value: '28', test: 'Group b', region: 'Europe', nonSense: 'test' },
    { country: 'Italy', otherValue: '47', value: '16', test: 'Group b', region: 'Europe', nonSense: 'test' }
  ];
  dataStorage: any = [
    this.startData,
    [
      {
        country: 'China',
        otherValue: '37',
        value: '27',
        region: 'Asia',
        test: 'Group A',
        tempDate: new Date(1986, 0, 2, 11, 39, 13),
        nonSense: 'test'
      },
      { country: 'Japan', otherValue: '24', value: '10', region: 'Asia', test: 'Group A', nonSense: 'test' },
      { country: 'Thailand', otherValue: '7', value: '52', region: 'Asia', test: 'Group A', nonSense: 'test' },
      {
        country: 'United States',
        otherValue: '30',
        value: '121',
        region: 'North America',
        test: 'Group A',
        tempDate: new Date(2018, 0, 2, 11, 39, 13),
        nonSense: 'test'
      },
      { country: 'Canada', otherValue: '20', value: '24', test: 'Group A', region: 'North America', nonSense: 'test' },
      { country: 'India', otherValue: '37', value: '21', test: 'Group b', region: 'Asia', nonSense: 'test' },
      {
        country: 'Indonesia',
        otherValue: '3',
        value: '73',
        test: 'Group b',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.',
        nonSense: 'test'
      },
      { country: 'Germany', otherValue: '16', value: '61', test: 'Group b', region: 'Europe', nonSense: 'test' },
      { country: 'Turkey', otherValue: '21', value: '48', test: 'Group b', region: 'Europe', nonSense: 'test' },
      { country: 'Italy', otherValue: '47', value: '16', test: 'Group b', region: 'Europe', nonSense: 'test' }
    ],
    this.startData,
    [
      {
        country: 'China',
        otherValue: '37',
        value: '27',
        region: 'Asia',
        test: 'Group A',
        tempDate: new Date(1986, 0, 2, 11, 39, 13),
        nonSense: 'test'
      },
      { country: 'Japan', otherValue: '24', value: '10', region: 'Asia', test: 'Group A', nonSense: 'test' },
      { country: 'Thailand', otherValue: '7', value: '52', region: 'Asia', test: 'Group A', nonSense: 'test' },
      {
        country: 'United States',
        otherValue: '30',
        value: '121',
        region: 'North America',
        test: 'Group A',
        tempDate: new Date(2018, 0, 2, 11, 39, 13),
        nonSense: 'test'
      },
      { country: 'Canada', otherValue: '20', value: '24', test: 'Group A', region: 'North America', nonSense: 'test' },
      { country: 'India', otherValue: '37', value: '21', test: 'Group b', region: 'Asia', nonSense: 'test' },
      {
        country: 'Indonesia',
        otherValue: '3',
        value: '73',
        test: 'Group b',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.',
        nonSense: 'test'
      },
      { country: 'Germany', otherValue: '16', value: '61', test: 'Group b', region: 'Europe', nonSense: 'test' },
      { country: 'Turkey', otherValue: '21', value: '28', test: 'Group b', region: 'Europe', nonSense: 'test' },
      { country: 'Italy', otherValue: '47', value: '16', test: 'Group b', region: 'Europe', nonSense: 'test' }
    ],
    [
      { country: 'China', value: '17', region: 'Asia' },
      { country: 'Japan', value: '10', region: 'Asia' },
      { country: 'Thailand', value: '30', region: 'Asia' },
      { country: 'United States', value: '114', region: 'North America' },
      { country: 'Canada', value: '24', region: 'North America' },
      { country: 'India', value: '21', region: 'Asia' },
      {
        country: 'Indonesia',
        value: '111',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.'
      },
      { country: 'Germany', value: '38', region: 'Europe' },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    [
      { country: 'China', value: '17', region: 'Asia' },
      { country: 'Japan', value: '10', region: 'Asia' },
      { country: 'Thailand', value: '30', region: 'Asia' },
      { country: 'United States', value: '114', region: 'North America' },
      { country: 'Canada', value: '24', region: 'North America' },
      { country: 'India', value: '21', region: 'Asia' },
      {
        country: 'Indonesia',
        value: '111',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.'
      },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    [
      { country: 'China', value: '17', region: 'Asia' },
      { country: 'S. Korea', value: '9', region: 'Asia' },
      { country: 'Japan', value: '10', region: 'Asia' },
      { country: 'Thailand', value: '30', region: 'Asia' },
      { country: 'United States', value: '114', region: 'North America' },
      { country: 'Canada', value: '24', region: 'North America' },
      { country: 'India', value: '21', region: 'Asia' },
      {
        country: 'Indonesia',
        value: '111',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.'
      },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    [
      { country: 'China', value: '27', region: 'Asia' },
      { country: 'Japan', value: '10', region: 'Asia' },
      { country: 'Thailand', value: '30', region: 'Asia' },
      { country: 'United States', value: '114', region: 'North America' },
      { country: 'Canada', value: '24', region: 'North America' },
      { country: 'India', value: '21', region: 'Asia' },
      {
        country: 'Indonesia',
        value: '111',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.'
      },
      { country: 'Germany', value: '38', region: 'Europe' },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    [
      { country: 'China', value: '27', region: 'Asia' },
      { country: 'Japan', value: '40', region: 'Asia' },
      { country: 'Thailand', value: '30', region: 'Asia' },
      { country: 'United States', value: '114', region: 'North America' },
      { country: 'Canada', value: '24', region: 'North America' },
      { country: 'India', value: '21', region: 'Asia' },
      {
        country: 'Indonesia',
        value: '111',
        region: 'Asia',
        note: 'The per capita ranking is 947% above the median.'
      },
      { country: 'Germany', value: '38', region: 'Europe' },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    this.startData
  ];
  exampleData: any = [
    {
      name: 'Chris',
      power: 'Can Fly',
      role: 'Hero',
      stat: 10
    },
    {
      name: 'Akhil',
      power: 'Can Change Time',
      role: 'Hero',
      stat: 3
    },
    {
      name: 'Basav',
      power: 'Can Change Time',
      role: 'Wizard',
      stat: 2
    },
    {
      name: 'Frank',
      power: 'Can Teleport',
      role: 'Wizard',
      stat: 2
    },
    {
      name: 'Jaime',
      power: 'Can Teleport',
      role: 'Hero',
      stat: 2
    },
    {
      name: 'Layla',
      power: 'Can Fly',
      role: 'Wizard',
      stat: 1
    }
  ];
  yAxis: any = {
    gridVisible: false,
    visible: true,
    label: 'y axis',
    format: '0.0[a]'
  };
  legend: any = { visible: true, interactive: true, labels: [] };

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];
  }
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
  changeDimension() {
    this.padding =
      this.padding.left === 60
        ? {
            top: 20,
            left: 150,
            right: 180,
            bottom: 40
          }
        : {
            top: 20,
            left: 60,
            right: 30,
            bottom: 40
          };
    this.width = this.width === 800 ? 700 : 800;
  }
  changeAccessibility() {
    this.accessibility = {
      ...this.accessibility,
      elementsAreInterface: !this.accessibility.elementsAreInterface,
      showExperimentalTextures: !this.accessibility.showExperimentalTextures
    };
  }
  contextExplanation() {
    const newContextExplanation = this.accessibility.contextExplanation
      ? ''
      : 'This chart is the output of filters involving market segment selection.';
    this.accessibility = { ...this.accessibility, contextExplanation: newContextExplanation };
  }
  longDescription() {
    const newLongDescription = this.accessibility.longDescription
      ? ''
      : 'This is a bar chart that shows spending (in millions) on purchases in select market segments, across the top ten countries.';
    this.accessibility = { ...this.accessibility, longDescription: newLongDescription };
  }
  changeLabels() {
    this.dataLabel =
      this.dataLabel.placement === 'top'
        ? {
            visible: true, // !this.dataLabel.visible,
            placement: 'bottom',
            labelAccessor: 'value',
            format: '0.0[a]'
          }
        : {
            visible: true, // !this.dataLabel.visible,
            placement: 'top',
            labelAccessor: 'value',
            format: '0.0[a]'
          };
  }
  changeTooltip() {
    this.tooltipLabel = { labelAccessor: ['value', 'test'], labelTitle: ['', ''], format: ['0,0[.0][a]', ''] };
  }

  changeInteraction() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.interactionState = this.interactionState[0] !== 'region' ? ['region'] : ['country'];
    const shouldBeInteractive = this.interactionState[0] === 'region';
    this.legend = { ...this.legend, interactive: shouldBeInteractive };
  }

  changeValueAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }

  changeOrdinalAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.ordinalAccessor = this.ordinalAccessor !== 'country' ? 'country' : 'value';
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

  toggleStrokes() {
    const newAccess = { ...this.accessibility };
    newAccess.hideStrokes = !newAccess.hideStrokes;
    this.accessibility = newAccess;
  }

  changeInterval() {
    this.barIntervalRatio = this.barIntervalRatio === 0.05 ? 0.5 : 0.05;
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
    this.highestHeadingLevel = e.target[0].value;
  };

  render() {
    return (
      <div>
        {/* <div role="alert" aria-live="polite"> */}
        <div>
          <p>{this.chartUpdates}</p>
        </div>
        <bar-chart
          data={this.data}
          mainTitle={
            'Heading prop received: ' +
            this.highestHeadingLevel +
            '. Highest becomes <' +
            findTagLevel(this.highestHeadingLevel) +
            '>. '
          }
          subTitle={
            'Heading prop received: ' +
            this.highestHeadingLevel +
            '. Lowest becomes <' +
            findTagLevel(this.highestHeadingLevel, 3) +
            '>.'
          }
          height={400}
          width={this.width}
          yAxis={this.yAxis}
          padding={this.padding}
          // suppressEvents={true}
          ordinalAccessor={this.ordinalAccessor}
          valueAccessor={this.valueAccessor}
          groupAccessor={this.groupAccessor}
          // yAccessor={'region'}
          // xAccessor={'value'}
          // layout={"horizontal"}
          sortOrder="asc"
          dataLabel={this.dataLabel}
          tooltipLabel={this.tooltipLabel}
          colorPalette={'sequential_grey'} // categorical // sequential_grey // diverging_GtoP // diverging_GtoP
          // colors={this.colors}
          legend={this.legend}
          cursor={'pointer'}
          barIntervalRatio={this.barIntervalRatio}
          hoverOpacity={0}
          interactionKeys={this.interactionState}
          // interactionKeys={['region']}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickFunc={d => this.onClickFunc(d)}
          onHoverFunc={d => this.onHoverFunc(d)}
          onMouseOutFunc={() => this.onMouseOut()}
          hoverStyle={this.hoverStyle}
          clickStyle={this.clickStyle}
          accessibility={this.accessibility}
          uniqueID={this.uniqueID}
          // annotations={this.annotations}
          highestHeadingLevel={this.highestHeadingLevel}
        />
        <span>
          <form onSubmit={this.handleInput}>
            Type a heading level (1, 2, 3, h1, h4, div, p, span, etc)
            <input style={{ padding: '10px' }} type="text" id="highestHeadingLevel" name="highestHeadingLevel" />
            <input type="submit" value="Submit" />
          </form>
        </span>
        <button
          onClick={() => {
            this.changeAccessibility();
          }}
        >
          change elementsAreInterface
        </button>
        <button
          onClick={() => {
            this.longDescription();
          }}
        >
          toggle longDescription
        </button>
        <button
          onClick={() => {
            this.contextExplanation();
          }}
        >
          toggle contextExplanation
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
            this.toggleSmallLabels();
          }}
        >
          toggle small labels
        </button>
        <button
          onClick={() => {
            this.changeInterval();
          }}
        >
          change bar interval
        </button>
        <button
          onClick={() => {
            this.changeInteraction();
          }}
        >
          change interaction key
        </button>
        <button
          onClick={() => {
            this.changeDimension();
          }}
        >
          change dimension
        </button>
        <button
          onClick={() => {
            this.changeLabels();
          }}
        >
          change labels
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
            this.changeGroupAccessor();
          }}
        >
          change group accessor
        </button>
        <button
          onClick={() => {
            this.changeTooltip();
          }}
        >
          change tooltip Label
        </button>
        {/* <bar-chart
          data={this.exampleData}
          mainTitle={'Test'}
          subTitle={'example'}
          height={400}
          width={400}
          yAxis={{
            visible: true,
            label: 'stat',
            format: '0.0[a]'
          }}
          padding={{
            top: 20,
            left: 60,
            right: 30,
            bottom: 40
          }}
          ordinalAccessor={'name'}
          valueAccessor={'stat'}
          groupAccessor={'power'}
          sortOrder="desc"
          dataLabel={{ visible: true, placement: 'bottom', labelAccessor: 'stat', format: '0,0[.0][a]' }}
          tooltipLabel={{
            labelAccessor: ['name', 'stat', 'power', 'role'],
            labelTitle: ['', '', '', ''],
            format: ['', '0,0[.0][a]', '', '']
          }}
          colorPalette={'categorical'}
          legend={{ visible: true, interactive: true }}
          cursor={'pointer'}
          hoverOpacity={0.2}
          interactionKeys={['power', 'role']}
          hoverHighlight={this.hoverElementTest}
          clickHighlight={this.clickElementTest}
          onClickFunc={d => this.onTestClickFunc(d)}
          onHoverFunc={d => this.onTestHoverFunc(d)}
          onMouseOutFunc={() => this.onTestMouseOut()}
          accessibility={{
            elementDescriptionAccessor: 'note', // see Indonesia above
            longDescription:
              'This is a bar chart that shows spending (in millions) on purchases in select market segments, across the top ten countries.',
            contextExplanation: 'This chart is the output of filters involving market segment selection.',
            executiveSummary:
              'Indonesia has a massive spend per capita, second in volume only to the US at one hundred eleven million dollars.',
            purpose:
              'Looking at the top ten countries by spend on a market segment can help show outliers or emerging market leaders in this area.',
            structureNotes: 'The bars are sorted in descending order and colored according to their regional grouping.',
            statisticalNotes:
              'Values here represent total spend in raw volume by market segment. These values are the sum of FY19 performance.',
            onChangeFunc: () => {},
            elementsAreInterface: false,
            hideDataTableButton: true
          }}
          uniqueID={'test'}
        /> */}
      </div>
    );
  }
}
