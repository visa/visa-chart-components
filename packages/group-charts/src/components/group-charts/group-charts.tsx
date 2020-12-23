/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, State, Prop, h } from '@stencil/core';
import '@visa/pie-chart';
import '@visa/bar-chart';
import '@visa/scatter-plot';
import '@visa/circle-packing';
import '@visa/clustered-force-layout';
import '@visa/world-map';
import '@visa/visa-charts-data-table';
import Utils from '@visa/visa-charts-utils';
const { getLicenses } = Utils;
@Component({
  tag: 'group-charts',
  styleUrl: 'group-charts.scss'
})
export class GroupCharts {
  @Prop() chartContent: any = [];
  @Prop() selectionMode: any = 'multiple';
  @Prop() onElementUpdate: any = new Function();
  @Prop() filterAccessor: any = 'label';
  @Prop() defaultClickElement: any = [];

  @State() data: any = [];
  @State() hoverElement: any = '';
  @State() clickElement: any = [];

  componentWillLoad() {
    // renders once with the correct state
  }
  componentWillUpdate() {
    if (!this.clickElement) {
      this.clickElement = this.defaultClickElement;
    }
    this.renderCharts();
  }

  onClick(label) {
    this.handleClickElement(label);
  }

  handleClickElement(label) {
    console.log('handleClickElement', label);
    if (this.selectionMode === 'single') {
      this.clickElement.includes(label) ? (this.clickElement = '') : (this.clickElement = [label]);
    } else if (this.selectionMode === 'multiple') {
      if (!this.clickElement.includes(label)) {
        this.clickElement.push(label);
      } else {
        for (let i = this.clickElement.length - 1; i >= 0; i--) {
          if (this.clickElement[i] === label) {
            this.clickElement.splice(i, 1);
          }
        }
      }
    } else {
      this.clickElement = [];
    }

    this.onElementUpdate(this.clickElement);
  }

  onHover(label) {
    // console.log('this.props.onHover', label)
    this.hoverElement = label;
  }

  onMouseOut() {
    this.hoverElement = '';
  }

  drawChart(chartContent) {
    const { chartType, width, ...restProps } = chartContent;
    const interactivityProps = {
      onClickFunc: d => this.onClick(d),
      onHoverFunc: d => this.onHover(d),
      onMouseOutFunc: () => this.onMouseOut(),
      clickHighlight: this.clickElement,
      hoverHighlight: this.hoverElement
    };

    switch (chartContent.chartType) {
      case 'bar-chart':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <bar-chart width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'pie-chart':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <pie-chart width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'scatter-plot':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <scatter-plot width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'circle-packing':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <circle-packing width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'clustered-force-layout':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <clustered-force-layout width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'line-chart':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <line-chart width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'world-map':
        return (
          <div class={'col--lg-' + chartContent.width}>
            <world-map width={chartContent.width * 100} {...interactivityProps} {...restProps} />
          </div>
        );

      case 'space':
        return <div class={'col--lg-' + chartContent.width} />;

      default:
        return;
    }
  }

  renderCharts() {
    return this.chartContent.map(row => {
      return this.drawChart(row);
    });
  }

  render() {
    return <div class="row">{this.renderCharts()}</div>;
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
