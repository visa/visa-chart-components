/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import Utils from '@visa/visa-charts-utils';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';

const { findTagLevel } = Utils;

@Component({
  tag: 'app-bar-chart',
  styleUrl: 'app-bar-chart.scss'
})
export class AppBarChart {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() clickElement: any = [];
  @State() interactionKeys: any = ['region'];
  @State() groupAccessor: any = 'region';
  @State() clickStatus: any = '';

  startData: any = [
    { country: 'China', value: '27', region: 'Asia' },
    { country: 'Japan', value: '5', region: 'Asia' },
    { country: 'Thailand', value: '30', region: 'Asia' },
    {
      country: 'United States',
      value: '114',
      region: 'North America'
    },
    { country: 'Canada', value: '24', region: 'North America' },
    { country: 'India', value: '21', region: 'Asia' },
    {
      country: 'Indonesia',
      value: '111',
      region: 'Asia',
      note: 'The per capita ranking is 947% above the median'
    },
    { country: 'Germany', value: '38', region: 'Europe' },
    { country: 'Turkey', value: '28', region: 'Europe' },
    { country: 'Italy', value: '16', region: 'Europe' }
  ];
  dataStorage: any = [
    this.startData,
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
        note: 'The per capita ranking is 947% above the median'
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
        note: 'The per capita ranking is 947% above the median'
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
        note: 'The per capita ranking is 947% above the median'
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
        note: 'The per capita ranking is 947% above the median'
      },
      { country: 'Germany', value: '38', region: 'Europe' },
      { country: 'Turkey', value: '28', region: 'Europe' },
      { country: 'Italy', value: '16', region: 'Europe' }
    ],
    this.startData
  ];

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];
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
    let activated = true;
    if (index > -1) {
      activated = false;
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d.detail.data);
    }

    const clickedText =
      (activated ? 'Activated ' : 'Deactivated ') + this.groupAccessor + ' ' + d.detail.data[this.groupAccessor] + '. ';
    const plural = newClicks.length === 1 ? '' : 's';
    const totalStatus = newClicks.length + ' ' + this.groupAccessor + plural + ' active.';
    this.clickStatus = clickedText + totalStatus;
    this.clickElement = newClicks;
  }
  onHoverFunc(d) {
    this.hoverElement = d.detail.data;
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
    }
  }

  changeData() {
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
    this.data = this.dataStorage[this.stateTrigger];
  }

  render() {
    return (
      <div>
        <bar-chart
          data={this.data}
          height={400}
          width={800}
          mainTitle={'Interactive, grouped bar chart using h3 heading override.'}
          subTitle={
            'Shows patterns, multi-strokes, annotations, sub-grouping (+ keyboard nav), special screen reader note on a geometry (Indonesia), dynamic (changing) data, automatic label hiding (Japan), and "interactive" element feedback.'
          }
          yAxis={{
            visible: true,
            label: 'Amount',
            format: '0.[a]'
          }}
          xAxis={{
            visible: true,
            label: 'Countries'
          }}
          padding={{
            top: 20,
            left: 60,
            right: 10,
            bottom: 40
          }}
          ordinalAccessor={'country'}
          valueAccessor={'value'}
          groupAccessor={this.groupAccessor}
          sortOrder={'desc'}
          dataLabel={{ visible: true, placement: 'bottom', labelAccessor: 'value', format: '0.[a]' }}
          tooltipLabel={{ labelAccessor: ['country', 'value'], labelTitle: ['', ''], format: ['', '0.[a]'] }}
          colorPalette={'categorical'}
          legend={{ visible: true, interactive: true }}
          cursor={'pointer'}
          hoverOpacity={0.15}
          uniqueID={'bar-chart-1'}
          interactionKeys={this.interactionKeys}
          hoverHighlight={this.hoverElement}
          clickHighlight={this.clickElement}
          onClickEvent={d => this.onClickFunc(d)}
          onHoverEvent={d => this.onHoverFunc(d)}
          onMouseOutEvent={() => this.onMouseOut()}
          highestHeadingLevel={3}
          accessibility={{
            elementDescriptionAccessor: 'note',
            longDescription:
              'This is a bar chart that shows spending (in millions) on Card A card purchases in select segments, across the top ten countries.',
            contextExplanation: 'This chart is the output of filters involving segment selection.',
            executiveSummary:
              'Indonesia has a massive spend per capita, second in amount only to the US at one hundred eleven million dollars.',
            purpose:
              'Looking at the top ten countries by Card A spend on a segment can help show outliers or emerging market leaders in this area.',
            structureNotes: 'The bars are sorted in descending order and colored according to their regional grouping.',
            statisticalNotes:
              'Values here represent total Card A spend in raw amount by segment. These values are the sum of FY19 performance.',
            elementsAreInterface: true,
            includeDataKeyNames: true,
            onChangeFunc: d => {
              this.onChangeFunc(d);
            }
          }}
          annotations={[
            {
              note: {
                label: "China's Amount-per-capita is massively under market performance.",
                bgPadding: 20,
                title: 'Low Amount Per Capita',
                align: 'middle',
                wrap: 210
              },
              accessibilityDescription:
                'This annotation is a callout to China, which only has 27 million amount but 1.3 billion people.',
              data: { country: 'China', value: '27', region: 'Asia' },
              dy: '-20%',
              color: 'categorical_blue'
            }
          ]}
        />
        <span>
          <h4>Status Caption:</h4>
          <div key={`bar-chart-aria-live`} role="alert" aria-live="polite">
            <p>{this.chartUpdates}</p>
          </div>
          <div key={`bar-chart-aria-live-assertive`} role="alert" aria-live="assertive">
            <p>{this.clickStatus}</p>
          </div>
        </span>
        <button
          onClick={() => {
            this.changeData();
          }}
        >
          change data
        </button>
      </div>
    );
  }
}
