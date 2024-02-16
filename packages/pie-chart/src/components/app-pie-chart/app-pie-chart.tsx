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
import { select } from 'd3-selection';
import Utils from '@visa/visa-charts-utils';

// importing custom languages
// import { hu } from '../../../../utils/src/utils/localization/languages/hu';

// importing numeralLocales
// import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

const { formatStats } = Utils;
@Component({
  tag: 'app-pie-chart',
  styleUrl: 'app-pie-chart.scss'
})
export class AppPieChart {
  @State() data: any;
  @State() stateTrigger: any = 1;
  @State() animations: any = { disabled: false };
  @State() refStateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() width: any = 500;
  @State() height: any = 500;
  @State() padding: any = {
    top: 100,
    left: 100,
    right: 100,
    bottom: 100
  };
  @State() interactionKeys: any = ['label'];
  @State() clickElement: any = [
    // { label: 'Competitor 2', value: '1000', otherValue: '4126000' }
  ];
  @State() colorPalette: any = 'single_suppPink';
  @State() edge: any = true;
  @State() valueAccessor: any = 'value';
  @State() refData: any;
  @State() edgeline: any = false;
  @State() access: any = {
    includeDataKeyNames: true,
    elementsAreInterface: false,
    hideTextures: false,
    disableValidation: true,
    hideStrokes: false
    // hideTextures: true,
    // includeDataKeyNames: true,
    // longDescription:
    // 'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
    // contextExplanation:
    // 'This chart current data is determined by the Change Data button above while the props used are set in the props controls below.',
    // purpose:
    // 'The purpose of this chart template is to provide an example of how to build a basic pie chart using the chart library',
    // statisticalNotes: 'This chart is using dummy data.',
    // disableValidation: false,
    // keyboardNavConfig: { disabled: false }
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
        label: 'labelExample',
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

  refDataStorage: any = [
    [
      {
        label: 'Dining',
        value: '41260',
        accessibilityDescription: 'Reference Line #1 accessibility description.',
        accessibilityDecorationOnly: false
      }
    ]
  ];

  startData: any = [
    { label: '2018 Share', value: '31206000', otherValue: '42026000' },
    { label: 'Total', value: '4324500', otherValue: '5126000' }
  ];
  dataStorage: any = [
    this.startData,
    [
      { label: '2018 Share', value: '100000', otherValue: '61206000' },
      { label: 'Competitor 1', value: '1000', otherValue: '5126000' },
      { label: 'Competitor 2', value: '1000', otherValue: '4126000' },
      { label: 'Competitor 3', value: '1000', otherValue: '3126000' },
      { label: 'Competitor 4', value: '1000', otherValue: '1126000' }
    ],
    [
      { label: '2018 Share', value: '3126000', otherValue: '8126000' },
      { label: 'Total', value: '4324500', otherValue: '5126000' }
    ],
    [
      { label: '2018 Share', value: '2126000', otherValue: '2126000' },
      { label: 'Total', value: '4324500', otherValue: '5126000' }
    ],
    [
      { label: '2018 Share', value: '2126000', otherValue: '4226000' },
      { label: 'Total', value: '2324500', otherValue: '5126000' }
    ],
    [
      { label: '2018 Share', value: '20149000', otherValue: '9126000' },
      { label: 'Total', value: '4324500', otherValue: '5126000' }
    ]
  ];
  dataLabel: any = {
    visible: true,
    placement: 'inside',
    labelAccessor: 'value%',
    // format: '$0[.][0]a',
    format: 'normalized',
    collisionHideOnly: true
  }; // format: 'normalized' };
  ref = [{ label: 'PY Share', value: '3396000' }];
  style = { color: 'supp_purple' };

  @Element()
  appEl: HTMLElement;
  dataKeyNames: any = {
    label: 'Pie Slice',
    value: 'Pie Value'
  };

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];
    // this.placeAnnotationLabels();
  }
  // componentWillUpdate() {
  //   // console.log('will update', this.clickElement);
  // }
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

  onChangeFunc(d) {
    if (d.updated && (d.removed || d.added)) {
      let updates = 'The pie chart has ';
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
  changeAccessElements() {
    this.access = {
      ...this.access,
      elementsAreInterface: !this.access.elementsAreInterface
    };
  }
  changeKeyNav() {
    const keyboardNavConfig = {
      disabled: !this.access.keyboardNavConfig.disabled
    };
    this.access = {
      ...this.access,
      keyboardNavConfig
    };
  }
  toggleSuppress() {
    this.suppressEvents = !this.suppressEvents;
  }

  changeDimension() {
    if (this.width !== 200) {
      this.width = 200;
      this.height = 200;
    } else {
      this.width = 300;
      this.height = 300;
    }
  }

  changePadding() {
    if (this.padding.top !== 80) {
      this.padding = {
        top: 80,
        left: 60,
        right: 30,
        bottom: 40
      };
    } else {
      this.padding = {
        top: 180,
        left: 160,
        right: 130,
        bottom: 140
      };
    }
  }

  changeCP() {
    this.colorPalette !== 'single_suppPink'
      ? (this.colorPalette = 'single_suppPink')
      : (this.colorPalette = 'single_compGreen');
  }

  changeEdgeline() {
    this.edgeline = this.edgeline ? false : true;
    console.log('showEdgeline is now set to ', this.edgeline);
  }

  changeValueAccessor() {
    // this.valueAccessor !== 'value' ? (this.valueAccessor = 'value') : (this.valueAccessor = 'otherValue');
    this.valueAccessor = this.valueAccessor !== 'value' ? 'value' : 'otherValue';
  }
  changeRefData() {
    this.refStateTrigger = this.refStateTrigger < this.refDataStorage.length - 1 ? this.refStateTrigger + 1 : 0;
    this.refData = this.refDataStorage[this.refStateTrigger];
  }
  toggleAnimations() {
    this.animations = { disabled: !this.animations.disabled };
  }
  placeAnnotationLabels() {
    console.log('placeannotations');
    const pieSlices = select('.pie-dataLabel-group').selectAll('.pie-dataLabel-highlight');
    console.log('pieSlices', pieSlices.size(), pieSlices);
    const translateXY = 250;
    const chartTop = -this.height + translateXY + this.padding.top / 2;
    const chartBottom = translateXY - this.padding.bottom / 2;
    const chartMiddle = chartTop + chartBottom - this.padding.bottom / 2;
    const chartLeft = -this.padding.left / 2;
    const annotations = [];
    const quadrantHash = { 1: [], 2: [], 3: [], 4: [] };
    const quadrantStarts = {
      1: {
        x: this.width - 50 - this.padding.left - this.padding.right,
        y: -(this.height - 50) + this.padding.top + this.padding.bottom
      },
      2: {
        // x: this.width - 100, y: this.height - 100
        x: this.width - 50 - this.padding.left - this.padding.right,
        y: chartMiddle // (-this.height/2) // + this.padding.top + this.padding.bottom
      },
      3: { x: chartLeft, y: chartBottom },
      4: { x: chartLeft, y: chartTop }
    };
    console.log(
      'we are placing annotations',
      pieSlices,
      this.data,
      this.annotations,
      chartTop,
      chartBottom,
      chartMiddle
    );

    pieSlices.each((d, i, n) => {
      const me = select(n[i]);
      const quadrant =
        d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI / 2
          ? 1
          : d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI
          ? 2
          : d.startAngle + (d.endAngle - d.startAngle) / 2 < Math.PI * 1.5
          ? 3
          : 4;
      quadrantHash[quadrant].push({ ...d, quadrant });

      console.log('checking slice', n[i], d, quadrant, quadrantStarts[quadrant], quadrantHash[quadrant]);
      annotations.push({
        note: {
          label: formatStats(d[this.valueAccessor], '0.0a'),
          title: d['label'],
          lineType: 'vertical',
          align: 'middle'
        },
        connector: { type: 'elbow', end: 'dot', endScale: 1.5 },
        data: d,
        x: +me.attr('data-x'),
        y: +me.attr('data-y'),
        color: me.attr('fill'),
        nx: quadrantStarts[quadrant].x - 100,
        ny:
          quadrant === 3
            ? quadrantStarts[quadrant].y - quadrantHash[quadrant].length * 50
            : quadrantStarts[quadrant].y + quadrantHash[quadrant].length * 50
      });
    });

    this.annotations = [...annotations];
    console.log('we are placing annotations', this.data, this.annotations);
  }

  render() {
    console.log('loaded!', this.chartUpdates);
    this.data = this.dataStorage[this.stateTrigger];
    this.refData = this.refDataStorage[this.refStateTrigger];
    // this.placeAnnotationLabels();
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
            this.changeDimension();
          }}
        >
          change dimension
        </button>
        <button
          onClick={() => {
            this.changePadding();
          }}
        >
          change padding
        </button>
        <button
          onClick={() => {
            this.changeValueAccessor();
          }}
        >
          valueAccessor
        </button>
        <button
          onClick={() => {
            this.changeCP();
          }}
        >
          change color palette
        </button>
        <button
          onClick={() => {
            this.changeRefData();
          }}
        >
          remove ref data
        </button>
        <button
          onClick={() => {
            this.changeEdgeline();
          }}
        >
          toggle showEdgeLine
        </button>

        <button
          onClick={() => {
            this.toggleAnimations();
          }}
        >
          toggle animations
        </button>
        <div>
          <pie-chart
            // localization={{
            //   language: hu,
            //   numeralLocale: HU,
            //   skipValidation: false
            // }}
            data={this.data}
            animationConfig={this.animations}
            mainTitle={'test'}
            subTitle={'test'}
            // subTitle={{
            //   text:'When was transaction is dummy count below market dummy average?',
            //   keywordsHighlight: [
            //     { text: "transaction is dummy", color:'#FF4F00'},
            //     { text: "dummy", color: '#efefef'},
            //     {text: "average", color: '#323232'},
            //   ]
            // }}
            centerSubTitle={''}
            centerTitle={'Pie'}
            colorPalette={'diverging_RtoG'}
            accessibility={this.access}
            suppressEvents={this.suppressEvents}
            height={this.height}
            width={this.width}
            padding={this.padding}
            ordinalAccessor={'label'}
            valueAccessor={this.valueAccessor}
            innerRatio={0.1} // {0.0000000001}
            dataLabel={this.dataLabel}
            labelOffset={0.0000001}
            showLabelNote={false}
            // colors={['blue','grey','brown','darkgreen','#eeeeee']}
            //colorPalette={'categorical'}
            hoverOpacity={0.15}
            cursor={'pointer'}
            sortOrder={'default'}
            showTooltip={true}
            showPercentage={true}
            showEdgeLine={false}
            annotations={this.annotations}
            referenceData={this.refData}
            referenceStyle={{ color: 'supp_purple' }}
            interactionKeys={this.interactionKeys}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickEvent={d => this.onClickFunc(d)}
            onHoverEvent={d => this.onHoverFunc(d)}
            onMouseOutEvent={() => this.onMouseOut()}
            // onInitialLoadEvent={e => console.log('load event', e.detail, e)}
            // onInitialLoadEndEvent={e => console.log('load end event', e.detail, e)}
            // onDrawStartEvent={e => console.log('draw start event', e.detail, e)}
            // onDrawEndEvent={e => console.log('draw end event', e.detail, e)}
            onTransitionEndEvent={() => this.placeAnnotationLabels()} //  console.log('transition event', e.detail, e)}
          />
        </div>
        <div>
          {/* <pie-chart
            centerSubTitle={'United States'}
            centerTitle={'42%'}
            colorPalette={this.colorPalette}
            data={[{ label: 'United States', value: 3126000 }, { label: 'Others', value: 4324500 }]}
            // data={this.data}
            ordinalAccessor={'label'}
            valueAccessor={'value'}
            dataLabel={{ visible: true, placement: 'outside', labelAccessor: 'value', format: '$0.0[a]' }}
            height={325}
            accessibility={{
              includeDataKeyNames: true,
              longDescription:
                'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
              contextExplanation:
                'This chart current data is determined by the Change Data button above while the props used are set in the props controls below.',
              purpose:
                'The purpose of this chart template is to provide an example of how to build a basic pie chart using the chart library',
              statisticalNotes: 'This chart is using dummy data.',
              disableValidation: true
            }}
            innerRatio={0.8}
            mainTitle={'Emphasis'}
            showEdgeLine={true}
            showLabelNote={true}
            showPercentage={false}
            subTitle={''}
            referenceData={this.refData}
            referenceStyle={{ color: 'supp_purple' }}
            tooltipLabel={{
              labelAccessor: ['label', 'value'],
              labelTitle: ['', 'Count'],
              format: ['', '0,0.0[a]']
            }}
            width={600}
          /> */}
        </div>
      </div>
    );
  }
}
