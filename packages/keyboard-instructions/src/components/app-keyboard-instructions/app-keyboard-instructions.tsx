/**
 * Copyright (c) 2021, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Element, h } from '@stencil/core';

@Component({
  tag: 'app-keyboard-instructions',
  styleUrl: 'app-keyboard-instructions.scss'
})
export class AppDataTable {
  @State() language: string = 'en';
  @State() data: any = [];
  @State() hoverElement: any = '';
  @State() clickElement: any = [];
  @State() interactive: boolean = true;
  @State() cousinNav: boolean = true;
  @State() width: number = 350;
  @State() disabled: boolean = false;
  @State() headingLevel: string = 'h2';
  @State() margins: number = 25;

  @Element()
  appEl: HTMLElement;

  componentWillUpdate() {
    // console.log('will update', this.clickElement);
  }
  onClickFunc(d) {
    this.clickElement = [d];
  }
  onHoverFunc(d) {
    this.hoverElement = d;
  }
  onMouseOut() {
    this.hoverElement = '';
  }
  toggleInteractivity() {
    this.interactive = !this.interactive;
  }
  toggleCousins() {
    this.cousinNav = !this.cousinNav;
  }
  changeWidth() {
    this.width = this.width === 350 ? 250 : this.width === 250 ? 600 : 350;
  }
  changeMargins() {
    this.margins = this.margins === 25 ? 5 : 25;
  }
  toggleDisabled() {
    this.disabled = !this.disabled;
  }
  changeHeadingLevel() {
    this.headingLevel = this.headingLevel === 'h2' ? 'p' : this.headingLevel === 'p' ? 'span' : 'h2';
  }

  render() {
    console.log('!!!!app re-render');
    return (
      <div>
        <button
          onClick={() => {
            this.toggleInteractivity();
          }}
        >
          toggle interactivity
        </button>
        <button
          onClick={() => {
            this.toggleCousins();
          }}
        >
          toggle cousin navigation
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
            this.changeMargins();
          }}
        >
          change margins
        </button>
        <button
          onClick={() => {
            this.toggleDisabled();
          }}
        >
          toggle disabled
        </button>
        <br />
        <br />
        <br />
        <div style={{ width: '100%', height: '100%', border: '1px solid black', position: 'relative' }}>
          <this.headingLevel>Chart Wrapper (Title Goes Here)</this.headingLevel>
          <p>(Chart Subtitle Goes Here)</p>
          <keyboard-instructions
            language={'en'}
            uniqueID={'test'}
            geomType={'point'}
            groupName={'line'}
            chartTag={'line-chart'}
            width={this.width - this.margins}
            isInteractive={this.interactive}
            hasCousinNavigation={this.cousinNav}
            disabled={this.disabled}
          />
          <div style={{ position: 'relative', width: `${this.width}px`, height: `250px`, border: '1px dashed black' }}>
            <div style={{ position: 'absolute', left: '0', top: '0' }}>Chart OUTER Area</div>
            <div
              style={{
                position: 'relative',
                left: `${this.margins}px`,
                top: `${this.margins}px`,
                width: `${this.width - this.margins * 2}px`,
                height: `${250 - this.margins * 2}px`,
                border: '2px solid black',
                background: '#e4e4e4'
              }}
            >
              Chart INNER Area
            </div>
          </div>
        </div>
      </div>
    );
  }
}
