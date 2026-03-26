/**
 * Copyright (c) 2020, 2021, 2022, 2023, 2025 Visa, Inc.
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

const { translate, getLicenses } = Utils;

@Component({
  tag: 'data-table',
  styleUrl: 'data-table.scss'
})
export class DataTable {
  // basic props for the table
  @Prop({ mutable: true }) uniqueID: string;
  @Prop({ mutable: true }) language: string = DataTableDefaultValues.language;
  @Prop({ mutable: true }) isCompact: boolean = DataTableDefaultValues.isCompact;
  @Prop({ mutable: true }) hideDataTable: boolean = DataTableDefaultValues.hideDataTable;
  @Prop({ mutable: true }) margin: IBoxModelType = DataTableDefaultValues.margin;
  @Prop({ mutable: true }) padding: IBoxModelType = DataTableDefaultValues.padding;
  @Prop({ mutable: true }) tableColumns: string[];
  @Prop({ mutable: true }) secondaryTableColumns: string[];
  @Prop({ mutable: true }) dataKeyNames: object;

  // data for the table
  @Prop() data: object[];
  @Prop() secondaryData: object[];

  // debugging props
  @Prop({ mutable: true }) unitTest: boolean = false;

  // state for showing the table
  @State() showTable: boolean = this.hideDataTable ? true : false;

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
        this.table.attr('aria-label', `${translate('dataTable.table1', this.language)}.`);

        this.secondaryTable = select(this.dataTableEl)
          .select('#visa-viz-data-table-container-' + this.uniqueID)
          .append('table')
          .attr('class', 'vcc-secondary-data-table vcc-data-table vcc-state--single-select')
          .attr('aria-label', `${translate('dataTable.table2', this.language)}.`)
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
        .text(d => (this.dataKeyNames && this.dataKeyNames[d] ? this.dataKeyNames[d] : d));

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
          .text(d => (this.dataKeyNames && this.dataKeyNames[d] ? this.dataKeyNames[d] : d));

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
            aria-label={`${translate('dataTable.display', this.language)}`}
            aria-expanded={this.showTable ? 'true' : 'false'}
            role="button"
            tabIndex={this.hideDataTable ? -1 : 0}
            onClick={() => (this.showTable = !this.showTable)}
          >
            <svg class="vcc-icon--tiny" focusable="false" {...svgProps}>
              <use {...useProps} />
            </svg>
          </button>
          <svg class="vcc-icons">
            <symbol id={`visa-viz-view-grid--tiny-${this.uniqueID}`} {...symbolProps}>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 2.99219H2V4.99219H4V2.99219ZM0 0.992188V6.99219H6V0.992188H0ZM8 4.99219H16V2.99219H8V4.99219ZM8 12.9922H16V10.9922H8V12.9922ZM2 10.9922H4V12.9922H2V10.9922ZM0 14.9922V8.99219H6V14.9922H0Z"
              />
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
