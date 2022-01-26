/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Prop, Element, State, h } from '@stencil/core';
import { IBoxModelType } from '@visa/charts-types';
import { DataTableDefaultValues } from './data-table-default-values';
import { select } from 'd3-selection';
import Utils from '@visa/visa-charts-utils';

const { getLicenses } = Utils;

@Component({
  tag: 'data-table',
  styleUrl: 'data-table.scss'
})
export class DataTable {
  // basic props for the table
  @Prop({ mutable: true }) uniqueID: string;
  @Prop({ mutable: true }) isCompact: boolean = DataTableDefaultValues.isCompact;
  @Prop({ mutable: true }) hideDataTable: boolean = DataTableDefaultValues.hideDataTable;
  @Prop({ mutable: true }) margin: IBoxModelType = DataTableDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = DataTableDefaultValues.padding;
  @Prop({ mutable: true }) tableColumns: string[];
  @Prop({ mutable: true }) secondaryTableColumns: string[];

  // data for the table
  @Prop() data: object[];
  @Prop() secondaryData: object[];

  // debugging props
  @Prop({ mutable: true }) unitTest: boolean = false;

  // state for showing the table
  @State() showTable: boolean = false;

  // Element
  @Element()
  dataTableEl: HTMLElement;
  table: any;
  secondaryTable: any;
  thead: any;
  tbody: any;
  rows: any;
  cells: any;
  defaults: boolean;

  componentWillLoad() {
    this.tableColumns = this.tableColumns ? this.tableColumns : (this.tableColumns = Object.keys(this.data[0]));
  }

  componentWillUpdate() {
    this.init();
    this.tableColumns = this.tableColumns ? this.tableColumns : (this.tableColumns = Object.keys(this.data[0]));
  }

  componentDidLoad() {
    this.drawTable();
  }

  componentDidUpdate() {
    this.drawTable();
  }

  reSetRoot() {
    // if we have a hide prop then we use vcc-sr class
    select(this.dataTableEl)
      .classed('vcc-sr', this.hideDataTable)
      .select('#visa-viz-data-table-button-' + this.uniqueID)
      .classed('vcc-state--active', this.showTable);

    if (this.table) {
      this.table.remove();
      this.table = null;
    }

    if (this.secondaryTable) {
      this.secondaryTable.remove();
      this.secondaryTable = null;
    }

    if (!this.table && this.showTable) {
      this.defaults = true;
      this.table = select(this.dataTableEl)
        .select('#visa-viz-data-table-container-' + this.uniqueID)
        .append('table')
        .attr('class', 'vcc-data-table vcc-state--single-select')
        .classed('vcc-state--compact', this.isCompact)
        .attr('data-header', 'header');

      if (this.secondaryData) {
        this.table.attr(
          'aria-label',
          'You are currently on data table 1 of 2. This table contains data for the chart nodes'
        );

        this.secondaryTable = select(this.dataTableEl)
          .select('#visa-viz-data-table-container-' + this.uniqueID)
          .append('table')
          .attr('class', 'vcc-secondary-data-table vcc-data-table vcc-state--single-select')
          .attr(
            'aria-label',
            'You are currently on data table 2 of 2. This table contains the data for the chart links'
          )
          .classed('vcc-state--compact', this.isCompact)
          .attr('data-header', 'header');
      }
    }
  }

  drawTable() {
    this.reSetRoot();
    // start by drawing the table header
    if (this.showTable) {
      this.thead = this.table
        .append('thead')
        .attr('class', 'vcc-thead')
        .append('tr')
        .attr('class', 'vcc-tr');

      // now add the column headers to the table header
      this.thead
        .selectAll('th')
        .data(this.tableColumns)
        .enter()
        .append('th')
        .attr('class', 'vcc-th')
        .attr('scope', 'col')
        .text(d => d);

      this.tbody = this.table.append('tbody').attr('class', 'vcc-tbody');

      this.rows = this.tbody
        .selectAll('tr')
        .data(this.data)
        .enter()
        .append('tr')
        .attr('class', 'vcc-tr');

      this.cells = this.rows
        .selectAll('.vcc-td')
        .data(row => {
          return this.tableColumns.map(col => {
            return {
              column: col,
              value: row[col]
            };
          });
        })
        .enter()
        .append((_, i) => {
          const element = i ? 'td' : 'th';
          return document.createElement(element);
        })
        .attr('scope', (_, i) => (i ? null : 'row'))
        .html(d => d.value)
        .attr('class', 'vcc-td');

      // draw secondary data table
      if (this.secondaryData) {
        this.thead = this.secondaryTable
          .append('thead')
          .attr('class', 'vcc-thead')
          .append('tr')
          .attr('class', 'vcc-tr');

        // now add the secondary column headers to the table header
        this.thead
          .selectAll('th')
          .data(this.secondaryTableColumns)
          .enter()
          .append('th')
          .attr('class', 'vcc-th')
          .attr('scope', 'col')
          .text(d => d);

        this.tbody = this.secondaryTable.append('tbody').attr('class', 'vcc-tbody');

        this.rows = this.tbody
          .selectAll('tr')
          .data(this.secondaryData)
          .enter()
          .append('tr')
          .attr('class', 'vcc-tr');

        this.cells = this.rows
          .selectAll('.vcc-td')
          .data(row => {
            return this.secondaryTableColumns.map(col => {
              return {
                column: col,
                value: row[col]
              };
            });
          })
          .enter()
          .append((_, i) => {
            const element = i ? 'td' : 'th';
            return document.createElement(element);
          })
          .attr('scope', (_, i) => (i ? null : 'row'))
          .html(d => d.value)
          .attr('class', 'vcc-td');
      }
    }
  }
  // using a similar workaround: https://github.com/Microsoft/TypeScript/issues/10761
  render() {
    const svgProps = { tabindex: -1 };
    const useProps = {
      href: `#visa-viz-view-grid--tiny-${this.uniqueID}`,
      xlinkHref: `#visa-viz-view-grid--tiny-${this.uniqueID}`
    };
    const symbolProps = { viewbox: '0 0 16 16' };
    return (
      <div
        class="visa-viz-data-table-outer-container"
        data-testid={this.unitTest ? 'data-table-outer-container' : null}
      >
        <div
          class="visa-viz-button-wrapper"
          style={{
            // if we don't push the button up, we need to add padding to the bottom of it
            paddingBottom: `${this.padding.left + this.margin.left - 35 < 0 ? 32 : 0}px`
          }}
        >
          <button
            id={`visa-viz-data-table-button-${this.uniqueID}`}
            type="button"
            class="vcc-btn-icon vcc-btn-icon--light-tiny visa-viz-data-table-button"
            style={{
              // if we have enough room to the left, we push the button next to the chart, otherwise we put it below the chart
              transform: `translate(${this.padding.left +
                this.margin.left -
                (this.padding.left + this.margin.left - 35 < 0 ? 0 : 35)}px,
                ${this.padding.left + this.margin.left - 35 < 0 ? 0 : -40}px)`
            }}
            aria-label="display data table"
            aria-expanded={this.showTable ? 'true' : 'false'}
            role="button"
            tabIndex={0}
            onClick={() => (this.showTable = !this.showTable)}
          >
            <svg class="vcc-icon--tiny" focusable="false" {...svgProps}>
              <use {...useProps} />
            </svg>
          </button>
          <svg class="vcc-icons">
            <symbol id={`visa-viz-view-grid--tiny-${this.uniqueID}`} {...symbolProps}>
              <path d="M5,5 L5,2 L2,2 L2,5 L5,5 Z M5,7 L2,7 C0.894905844,7 0,6.1044757 0,5 L0,2 C0,0.8955243 0.894905844,3.55271368e-15 2,3.55271368e-15 L5,3.55271368e-15 C6.10509416,3.55271368e-15 7,0.8955243 7,2 L7,5 C7,6.1044757 6.10509416,7 5,7 Z M14,5 L14,2 L11,2 L11,5 L14,5 Z M14,7 L11,7 C9.89490584,7 9,6.1044757 9,5 L9,2 C9,0.8955243 9.89490584,3.55271368e-15 11,3.55271368e-15 L14,3.55271368e-15 C15.1050942,3.55271368e-15 16,0.8955243 16,2 L16,5 C16,6.1044757 15.1050942,7 14,7 Z M5,14 L5,11 L2,11 L2,14 L5,14 Z M5,16 L2,16 C0.894905844,16 0,15.1044757 0,14 L0,11 C0,9.8955243 0.894905844,9 2,9 L5,9 C6.10509416,9 7,9.8955243 7,11 L7,14 C7,15.1044757 6.10509416,16 5,16 Z M14,14 L14,11 L11,11 L11,14 L14,14 Z M14,16 L11,16 C9.89490584,16 9,15.1044757 9,14 L9,11 C9,9.8955243 9.89490584,9 11,9 L14,9 C15.1050942,9 16,9.8955243 16,11 L16,14 C16,15.1044757 15.1050942,16 14,16 Z" />
              <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                <mask fill="#fff">
                  <use xlinkHref="#path-1" />
                </mask>
                <use fill="#000" fill-rule="nonzero" xlinkHref="#path-1" />
              </g>
            </symbol>
          </svg>
        </div>
        <div
          id={`visa-viz-data-table-container-${this.uniqueID}`}
          class="visa-viz-data-table-container"
          data-testid={this.unitTest ? 'data-table-container' : null}
        />
      </div>
    );
  }
  private init() {
    // reading properties
    const keys = Object.keys(DataTableDefaultValues);
    let i = 0;
    const exceptions = {};
    for (i = 0; i < keys.length; i++) {
      const exception = !exceptions[keys[i]] ? false : this[keys[i]] === exceptions[keys[i]].exception;
      this[keys[i]] = this[keys[i]] || exception ? this[keys[i]] : DataTableDefaultValues[keys[i]];
    }
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
