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
import Utils from '@visa/visa-charts-utils';

// importing custom languages
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';

// importing numeralLocales
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

const {
  // formatStats,
  // setNumeralLocale,
  getNumeralInstance,
  registerI18NextLanguage,
  registerNumeralLocale,
  registerNumeralFormat
} = Utils;
@Component({
  tag: 'app-bar-chart',
  styleUrl: 'app-bar-chart.scss'
})
export class AppBarChart {
  @State() localization: any = {
    language: 'hu',
    numeralLocale: 'US',
    skipValidation: false,
    overwrite: true
  };
  @State() data: any;
  @State() stateTrigger: any = 1;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() clickElement: any = [];
  @State() interactionKeys: any = ['region'];
  @State() groupAccessor: any = 'region';
  @State() clickStatus: any = '';
  @State() dataLabel: any = { visible: true, placement: 'left', labelAccessor: 'value', format: '0.[a]' };
  @State() tooltipLabel: any = { labelAccessor: ['country', 'value'], labelTitle: ['a', 'b'], format: ['', '0.[a]'] };
  @State() xAxis: any = {
    visible: true,
    // gridVisible: false,
    // label: 'Countries'
    centerBaseline: false
  };
  @State() yAxis: any = {
    visible: true
    // label: 'Amount',
    // format: '0.[a]',
    // centerBaseline: false
  };

  startData: any = [
    { country: 'China', value: '27', region: 'Asia' },
    { country: 'Japan', value: '5', region: 'Asia' },
    { country: 'Thailand', value: '30', region: 'Asia' },
    {
      country: 'United States',
      value: '1143482',
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
  keyNames: any = {
    country: 'Countries',
    value: 'Custom Value Name',
    region: 'Groupped'
  };

  // load a locale
  frLocale = {
    delimiters: {
      thousands: ' ',
      decimal: ','
    },
    abbreviations: {
      thousand: 'k',
      million: 'm',
      billion: 'b',
      trillion: 't'
    },
    ordinal: function(number) {
      return number === 1 ? 'er' : 'ème';
    },
    currency: {
      symbol: '€'
    }
  };
  jpLocale = {
    delimiters: {
      thousands: ',',
      decimal: '.'
    },
    abbreviations: {
      thousand: '千',
      million: '百万',
      billion: '十億',
      trillion: '兆'
    },
    ordinal: function(_) {
      return '.';
    },
    currency: {
      symbol: '¥'
    }
  };

  componentDidLoad() {
    // execute this code after the component mounts
  }

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];

    // how to register language and locales
    registerI18NextLanguage(hu);
    registerNumeralLocale('hu', HU, false);
    registerNumeralLocale('ja', this.jpLocale);

    // how to register a custom number format
    const numeral = getNumeralInstance();
    registerNumeralFormat('full-currency-code', {
      regexps: {
        format: /([A-Z]{3})$/,
        unformat: /([A-Z]{3})$/
      },
      format: function(value, format, roundingFunction) {
        var currencyCode = format.substring(format.length - 3);
        var space = numeral._.includes(format, ` ${currencyCode}`) ? ' ' : '';
        var output;

        // check for space before currency code
        var regexCode = new RegExp(`/( ${currencyCode})$/`, 'g');
        format = format.replace(regexCode, '');

        output = numeral._.numberToFormat(value, format, roundingFunction);

        if (numeral._.includes(output, ')')) {
          output = output.split('');

          output.splice(-1, 0, space + currencyCode);

          output = output.join('');
        } else {
          output = output + space + currencyCode;
        }

        return output;
      },
      unformat: function(string) {
        return numeral._.stringToNumber(string) * 0.01;
      }
    });
    // console.log('checking numeral instance', numeral._, numeral.locales, numeral.formats, formatStats);
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

  changeLocale() {
    if (this.localization.language === 'en' && this.localization.numeralLocale === 'US') {
      this.localization = {
        language: 'hu',
        numeralLocale: 'HU',
        skipValidation: false,
        overwrite: false
      };
    } else {
      this.localization = {
        language: 'en',
        numeralLocale: 'US',
        skipValidation: false,
        overwrite: false
      };
    }
  }

  changeData() {
    this.stateTrigger = this.stateTrigger < this.dataStorage.length - 1 ? this.stateTrigger + 1 : 0;
    this.data = this.dataStorage[this.stateTrigger];

    // change center baseline
    // this.xAxis = { visible: true, centerBaseline: !this.xAxis.centerBaseline };
  }

  render() {
    return (
      <div>
        <bar-chart
          localization={this.localization}
          data={this.data}
          height={400}
          width={800}
          mainTitle={'Interactive, grouped bar chart using h3 heading override.'}
          subTitle={
            'Shows patterns, multi-strokes, annotations, sub-grouping (+ keyboard nav), special screen reader note on a geometry (Indonesia), dynamic (changing) data, automatic label hiding (Japan), and "interactive" element feedback.'
          }
          // subTitle={{
          //   text: 'This is a subtitle this?',
          //   keywordsHighlight: [{ text: 'this', color: '#FF4F00', index: 1 }]
          // }}
          yAxis={this.yAxis}
          xAxis={this.xAxis}
          // padding={{
          //   top: 20,
          //   left: 60,
          //   right: 10,
          //   bottom: 40
          // }}

          ordinalAccessor={'country'}
          valueAccessor={'value'}
          groupAccessor={this.groupAccessor}
          dataKeyNames={this.keyNames}
          sortOrder={'desc'}
          dataLabel={this.dataLabel}
          tooltipLabel={this.tooltipLabel}
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
          layout={'vertical'}
          // onInitialLoadEvent={e => console.log('load event', e.detail, e)}
          // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
          // onDrawStartEvent={e => console.log('draw start event', e.detail, e)}
          // onDrawEndEvent={e => console.log('draw end event', e.detail, e)}
          // onTransitionEndEvent={e => console.log('transition event', e.detail, e)}
          highestHeadingLevel={3}
          accessibility={{
            hideDataTableButton: false,
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
            showSmallLabels: true,
            includeDataKeyNames: true,
            onChangeFunc: d => {
              this.onChangeFunc(d);
            }
          }}
          referenceLines={[
            {
              label: 'Average',
              labelPlacementHorizontal: 'right',
              labelPlacementVertical: 'top',
              value: 75,
              accessibilityDescription: 'This reference line is a callout to the Average value, which is 100.',
              accessibilityDecorationOnly: false
            },
            {
              label: 'Low',
              labelPlacementHorizontal: 'right',
              labelPlacementVertical: 'top',
              value: 20,
              // accessibilityDescription: 'This reference line is a callout to the Low value, which is 20.',
              accessibilityDecorationOnly: false
            }
          ]}
          annotations={[
            {
              note: {
                bgPadding: 20,
                title: 'India',
                align: 'middle',
                wrap: 210,
                lineType: 'none'
              },
              accessibilityDescription: 'India Annotation accessibility description.',
              data: { country: 'India', value: '21', region: 'Asia' },
              dy: '-15%',
              dx: '0%',
              color: 'categorical_blue'
            },
            {
              note: {
                bgPadding: 20,
                title: 'China',
                align: 'middle',
                wrap: 210,
                lineType: 'none'
              },
              accessibilityDescription:
                'This annotation is a callout to China, which only has 27 million amount but 1.3 billion people.',
              data: { country: 'China', value: '17', region: 'Asia' },
              dy: '-15%',
              dx: '0%',
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
        <button
          onClick={() => {
            this.changeLocale();
          }}
        >
          {`changeLocale (${this.localization.language}-${this.localization.numeralLocale})`}
        </button>
      </div>
    );
  }
}
