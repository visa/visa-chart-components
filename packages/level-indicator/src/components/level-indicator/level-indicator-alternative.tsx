/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, h, EventEmitter, Event } from '@stencil/core';
import { select, event } from 'd3-selection';
import { scaleBand, scaleLinear } from 'd3-scale';
import 'd3-transition';
import { IBoxModelType } from '@visa/charts-types';
import Utils from '@visa/visa-charts-utils';

const { getLicenses, drawTooltip, initTooltipStyle } = Utils;

@Component({
  tag: 'level-indicator-alternative',
  styleUrl: 'level-indicator.scss'
})
export class LevelIndicatorAlternative {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  @Prop() height: any = 100;
  @Prop() width: any = 60;
  @Prop() data: any = [{}];

  // chart accessors
  @Prop() ordinalAccessor: any = 'label';
  @Prop() valueAccessor: any = 'value';
  @Prop() showHeader: any = true;
  @Prop() showLabel: any = false;
  @Prop() enableColor: any = true;
  @Prop() dataFormat: any = '0,0.00';

  // value manipulations
  @Prop() threshold: any = 0.1;

  @Prop() colors: any = ['#180F58', '#B7C9E7', '#B7B7B7', '#E2AEBC', '#D60036'];
  @Prop() indicatorLabels: any = ['High', 'Above', 'Avg.', 'Below', 'Poor'];
  @Prop() defaultColor: any = ['#180F58'];
  @Prop() wrapLabel: boolean = true;
  @Prop() alignLabel: string = 'center';

  @Prop({ mutable: true }) padding: IBoxModelType = {
    top: this.height * 0.08,
    bottom: this.height * 0.25,
    right: this.width * 0.01, // 0.05
    left: this.width * 0.01 // 0.15
  };

  @Element()
  indicatorChartEl: HTMLElement;
  svg: any;
  rootG: any;
  tooltipG: any;
  x: any;
  y: any;
  innerHeight: number;
  innerWidth: number;
  indicatorWidth: any = this.height / 4;

  componentWillLoad() {
    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.padding.top - this.padding.bottom;
    this.innerWidth = this.width - this.padding.left - this.padding.right;
  }

  componentWillUpdate() {
    this.drawChart();
  }

  componentDidLoad() {
    this.drawChart();
    this.setTooltipInitialStyle();
  }

  drawChart() {
    this.reSetRoot();
    // scale band based on layout of chart
    this.y = scaleLinear()
      .domain([-this.threshold, this.threshold])
      .range([this.innerHeight - this.indicatorWidth / 6, 0]);

    this.x = scaleBand()
      .domain(this.data.map(d => d[this.ordinalAccessor]))
      .range([0, this.innerWidth])
      .padding(0.2);

    if (this.showLabel) {
      this.drawLabel();
    }
    this.drawIndicator();
  }

  // reset graph size based on window size
  reSetRoot() {
    if (this.svg) {
      this.svg.remove();
    }

    // assign the svg to this.svg use indicatorChartEl to make it specific to this instance
    this.svg = select(this.indicatorChartEl)
      .select('#visa-viz-d3-indicator-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.rootG = this.svg
      .append('g')
      .attr('id', 'visa-viz-padding-container-g')
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`)
      .attr('class', 'indicator');

    this.tooltipG = select(this.indicatorChartEl).select('.indicator-tooltip');
  }

  drawLabel() {
    // drawLabelLabels(this.rootG, 'avg', '', 0, this.height, this.padding);
    this.rootG
      .append('g')
      .attr('class', 'indicator-label')
      .attr('transform', `translate(0, ${this.innerHeight})`)
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('dy', '1.5em')
      .attr('dx', d => this.x(d[this.ordinalAccessor]) / 2)
      .text(d => this.getLabel(d[this.valueAccessor]));
  }

  drawIndicator() {
    let indicatorG = this.rootG
      .append('g')
      .attr('class', 'indicator-chart')
      .selectAll('g')
      .data(this.data)
      .enter()
      .append('g');

    let countArr = [-2, -1, 0, 1, 2];
    countArr.map(i => {
      indicatorG
        .append('rect')
        .attr('x', d => this.x(d[this.ordinalAccessor]))
        .attr('y', () => this.y((this.threshold / 2) * i) - this.indicatorWidth / 4)
        .attr('height', this.indicatorWidth / 2)
        .attr('width', this.indicatorWidth * 0.8)
        .attr('fill', '#E6E6E6');
    });

    indicatorG
      .append('rect')
      .attr('x', d => this.x(d[this.ordinalAccessor]) - this.indicatorWidth * 0.1)
      .attr('y', d => this.y(this.getLevel(d[this.valueAccessor])) - this.indicatorWidth / 4)
      .attr('height', this.indicatorWidth / 2)
      .attr('width', this.indicatorWidth)
      .attr('fill', d => (this.enableColor ? this.getColor(d[this.valueAccessor]) : this.defaultColor))
      .on('click', d => this.onClickHandler(d))
      .on('mouseover', d => this.onHoverHandler(d))
      .on('mouseout', () => this.onMouseOutHandler());
  }

  getLevel(value) {
    if (value >= this.threshold) {
      return this.threshold;
    } else if (value >= this.threshold / 2) {
      return this.threshold / 2;
    } else if (value > -this.threshold / 2) {
      return 0;
    } else if (value > -this.threshold) {
      return -this.threshold / 2;
    } else {
      return -this.threshold;
    }
  }

  getLabel(value) {
    if (value >= this.threshold) {
      return this.indicatorLabels[0];
    } else if (value >= this.threshold / 2) {
      return this.indicatorLabels[1];
    } else if (value > -this.threshold / 2) {
      return this.indicatorLabels[2];
    } else if (value > -this.threshold) {
      return this.indicatorLabels[3];
    } else {
      return this.indicatorLabels[4];
    }
  }

  getColor(value) {
    if (value >= this.threshold) {
      return this.colors[0];
    } else if (value >= this.threshold / 2) {
      return this.colors[1];
    } else if (value > -this.threshold / 2) {
      return this.colors[2];
    } else if (value > -this.threshold) {
      return this.colors[3];
    } else {
      return this.colors[4];
    }
  }

  onClickHandler(d) {
    this.clickFunc.emit(d);
  }

  onHoverHandler(d) {
    this.hoverFunc.emit(d);
    this.eventsTooltip({ data: d, evt: event, isToShow: true });
  }

  onMouseOutHandler() {
    this.mouseOutFunc.emit();
    this.eventsTooltip({ isToShow: false });
  }

  // set initial style (instead of copying css class across the lib)
  setTooltipInitialStyle() {
    initTooltipStyle(this.tooltipG);
  }

  eventsTooltip({ data, evt, isToShow }: { data?: any; evt?: any; isToShow: boolean }) {
    drawTooltip({
      root: this.tooltipG,
      data,
      event: evt,
      isToShow,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      chartType: 'bar'
    });
  }

  render() {
    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <div
            class="visa-ui-text--body"
            style={{
              visibility: this.showHeader ? 'visible' : 'hidden',
              width: this.wrapLabel ? `${this.indicatorWidth * 1.5}` + 'px' : 'auto',
              textAlign: this.alignLabel
            }}
          >
            {this.data[0][this.ordinalAccessor]}
          </div>
          <div class="indicator-tooltip vcl-tooltip" style={{ display: 'block' }} />
          <div id="visa-viz-d3-indicator-container" />
        </div>
      </div>
    );
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
