/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';
import '@visa/visa-charts-data-table';
import '@visa/keyboard-instructions';
@Component({
  tag: 'app-pie-chart',
  styleUrl: 'app-pie-chart.scss'
})
export class AppPieChart {
  @State() data: any;
  @State() stateTrigger: any = 0;
  @State() animations: any = { disabled: false };
  @State() refStateTrigger: any = 0;
  @State() hoverElement: any = '';
  @State() chartUpdates: string;
  @State() width: any = 450;
  @State() height: any = 450;
  @State() padding: any = {
    top: 20,
    left: 60,
    right: 85,
    bottom: 40
  };
  @State() clickElement: any = [];
  @State() colorPalette: any = 'single_suppPink';
  @State() edge: any = true;
  @State() valueAccessor: any = 'value';
  @State() refData: any;
  @State() edgeline: any = true;
  @State() access: any = {
    includeDataKeyNames: true,
    longDescription:
      'This is a chart template that was made to showcase some of the capabilities of Visa Chart Components',
    contextExplanation:
      'This chart current data is determined by the Change Data button above while the props used are set in the props controls below.',
    purpose:
      'The purpose of this chart template is to provide an example of how to build a basic pie chart using the chart library',
    statisticalNotes: 'This chart is using dummy data.',
    disableValidation: false,
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

  refDataStorage: any = [
    [{ label: 'Dining', value: '6931260' }],
    [{ label: 'Dining', value: '2931260' }],
    [{ label: '', value: false }]
  ];

  startData: any = [
    { label: '2018 Share', value: '3126000', otherValue: '4226000' },
    { label: 'Total', value: '4324500', otherValue: '5126000' }
  ];
  dataStorage: any = [
    this.startData,
    [
      { label: '2018 Share', value: '1000', otherValue: '6126000' },
      { label: 'Competitor 1', value: '1000', otherValue: '5126000' },
      { label: 'Competitor 2', value: '1000', otherValue: '4126000' },
      { label: 'Competitor 3', value: '6000', otherValue: '3126000' },
      { label: 'Competitor 4', value: '26000', otherValue: '1126000' }
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
    placement: 'edge',
    labelAccessor: 'value',
    format: '$0[.][0]a',
    collisionHideOnly: true
  }; // format: 'normalized' };
  ref = [{ label: 'PY Share', value: '3396000' }];
  style = { color: 'supp_purple' };

  @Element()
  appEl: HTMLElement;

  componentWillLoad() {
    this.data = this.dataStorage[this.stateTrigger];
  }
  // componentWillUpdate() {
  //   // console.log('will update', this.clickElement);
  // }
  onClickFunc(evt) {
    const d = evt.detail;
    const index = this.clickElement.indexOf(d);
    const newClicks = [...this.clickElement];
    if (index > -1) {
      newClicks.splice(index, 1);
    } else {
      newClicks.push(d);
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

  render() {
    console.log('loaded!', this.chartUpdates);
    this.data = this.dataStorage[this.stateTrigger];
    this.refData = this.refDataStorage[this.refStateTrigger];
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
            data={this.data}
            animationConfig={this.animations}
            mainTitle={'test'}
            subTitle={''}
            centerSubTitle={''}
            centerTitle={'Pie'}
            accessibility={this.access}
            suppressEvents={this.suppressEvents}
            height={this.height}
            width={this.width}
            padding={this.padding}
            ordinalAccessor={'label'}
            valueAccessor={this.valueAccessor}
            innerRatio={0} // {0.0000000001}
            dataLabel={this.dataLabel}
            labelOffset={25}
            showLabelNote={true}
            // colors={['blue','grey','brown','darkgreen','#eeeeee']}
            colorPalette={'categorical'}
            hoverOpacity={0.15}
            cursor={'pointer'}
            sortOrder={'default'}
            showTooltip={true}
            showPercentage={false}
            showEdgeLine={this.edgeline}
            // annotations={this.annotations}
            // referenceData={this.refData}
            // referenceStyle={{ color: 'supp_purple' }}
            // interactionKeys={['category']}
            hoverHighlight={this.hoverElement}
            clickHighlight={this.clickElement}
            onClickFunc={d => this.onClickFunc(d)}
            onHoverFunc={d => this.onHoverFunc(d)}
            onMouseOutFunc={() => this.onMouseOut()}
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
