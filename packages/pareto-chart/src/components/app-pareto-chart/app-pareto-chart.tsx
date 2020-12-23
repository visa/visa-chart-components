/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Event, EventEmitter, Element, h } from '@stencil/core';

@Component({
  tag: 'app-pareto-chart',
  styleUrl: 'app-pareto-chart.scss'
})
export class AppParetoChart {
  @State() data: any = [
    { month: 'Jan', value: 1250000 },
    { month: 'Feb', value: 202340 },
    { month: 'Mar', value: 803536 },
    { month: 'Apr', value: 1407543 },
    { month: 'May', value: 6042320 },
    { month: 'Jun', value: 3234002 },
    { month: 'Jul', value: 2221233 },
    { month: 'Aug', value: 4476321 },
    { month: 'Sep', value: 3789221 },
    { month: 'Oct', value: 6543535 },
    { month: 'Nov', value: 7457432 },
    { month: 'Dec', value: 3636346 }
  ];
  @State() hoverElement: any = '';
  @State() clickElement: any = [{ month: 'Feb', value: 202340 }, { month: 'Mar', value: 803536 }];
  @State() dataState: boolean = false;

  @State() value: any = 0; // this is for handling value changes for button to control which dataset to send

  @Event() updateComponent: EventEmitter;

  @Element()
  appEl: HTMLElement;

  onClickFunc(d) {
    console.log('we are in the click event', d.detail);
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
    console.log('we are in hover function', d.detail);
    this.hoverElement = d.detail;
  }
  onMouseOut() {
    this.hoverElement = '';
  }

  changeData() {
    const data1 = [
      { month: 'Jan', value: 1250000 },
      { month: 'Feb', value: 202340 },
      { month: 'Mar', value: 803536 },
      { month: 'Apr', value: 1407543 },
      { month: 'May', value: 6042320 },
      { month: 'Jun', value: 3234002 },
      { month: 'Jul', value: 2221233 },
      { month: 'Aug', value: 4476321 },
      { month: 'Sep', value: 3789221 },
      { month: 'Oct', value: 6543535 },
      { month: 'Nov', value: 7457432 },
      { month: 'Dec', value: 3636346 }
    ];
    const data2 = [
      { month: 'Jan', value: 1250000 },
      { month: 'Feb', value: 202340 },
      { month: 'Mar', value: 803536 },
      { month: 'Apr', value: 1407543 },
      { month: 'May', value: 6042320 },
      { month: 'Jun', value: 3234002 },
      { month: 'Jul', value: 2221233 },
      { month: 'Aug', value: 4476321 },
      { month: 'Sep', value: 3789221 },
      { month: 'Oct', value: 1543535 },
      { month: 'Nov', value: 3457432 },
      { month: 'Dec', value: 1636346 }
    ];
    this.dataState = !this.dataState;
    this.data = this.dataState ? data1 : data2;
    console.log('we are in change data', this.dataState, this.data);
  }

  render() {
    console.log('!!!!app re-render');
    return (
      <div>
        <button onClick={() => this.changeData()}> Change Data </button>
        <pareto-chart
          height={400}
          width={1000}
          hideDataTable={true}
          // hideAccessibility={true}
          layout="vertical"
          data={this.data}
          ordinalAccessor="month"
          valueAccessor="value"
          paretoThreshold={0.7}
          cursor={'pointer'}
          xAxis={{ visible: true, gridVisible: false, label: 'Month', format: '' }}
          yAxis={{ visible: true, gridVisible: true, label: 'Amount', format: '0,0[a]', formatCum: '0%' }}
          dataLabel={{
            content: 'valueAccessor',
            format: '0.0[a]',
            placement: 'top',
            visible: true
          }}
          showTooltip={true}
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
