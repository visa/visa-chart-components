/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, h, Watch, EventEmitter, Event } from '@stencil/core';
import { select, event } from 'd3-selection';
import { max, min } from 'd3-array';
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
import { line } from 'd3-shape';
import { v4 as uuid } from 'uuid';
import 'd3-transition';
import { IBoxModelType } from '@visa/charts-types';
import Utils from '@visa/visa-charts-utils';

const {
  // circularFind,
  initTooltipStyle,
  drawAxis,
  drawGrid,
  drawTooltip,
  formatStats,
  // applyAT, // removed as this chart is not ready to support accessibility
  getLicenses,
  checkInteraction,
  checkClicked,
  checkHovered,
  interactionStyle,
  getColors,
  outlineColor,
  visaColors
} = Utils;

@Component({
  tag: 'pareto-chart',
  styleUrl: 'pareto-chart.scss'
})
export class ParetoChart {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  @Prop() height: any = 400;
  @Prop() width: any = 800;
  @Prop() data: any[];
  @Prop() showDataLabel: boolean = true; // to be removed

  // chart accessors
  @Prop() ordinalAccessor: any = 'label';
  @Prop() valueAccessor: any = 'value';
  @Prop() groupAccessor: any;
  @Prop() uniqueID;

  // value manipulations
  @Prop() maxValueOverride: any;

  // data label props object
  @Prop({ mutable: true }) showTooltip = true;
  @Prop() dataLabel: any = {
    visible: true,
    placement: 'top',
    content: 'valueAccessor',
    format: '0,0.00'
  };

  // reference line array for in order to draw one or many reference lines
  @Prop() referenceLines: any = [];

  // layout of chart verticle/horizontal/radial
  @Prop() layout: string = 'vertical';
  @Prop() mainTitle: string;
  @Prop() subTitle: string;
  @Prop() xAxis: any = {
    visible: true,
    gridVisible: true,
    tickInterval: 1
  };
  @Prop() yAxis: any = {
    visible: true,
    gridVisible: true,
    tickInterval: 1
  };
  @Prop() wrapLabel: boolean = false;
  @Prop({ mutable: true }) colors;
  @Prop({ mutable: true }) colorPalette = 'single_blue';
  @Prop({ mutable: true }) hoverStyle: any;
  @Prop({ mutable: true }) clickStyle: any;
  @Prop({ mutable: true }) hoverOpacity = 1;
  @Prop() cursor: any = 'default';
  @Prop() sortOrder: any = '';
  @Prop() roundedCorner: any = 0;

  @Prop() margin: IBoxModelType = {
    top: this.height * 0.01,
    bottom: this.height * 0.01,
    right: this.width * 0.01,
    left: this.width * 0.01
  };
  @Prop({ mutable: true }) padding: IBoxModelType = {
    top: 20,
    bottom: 60,
    right: 80,
    left: 80
  };

  @Prop({ mutable: true }) hideDataTable = false;

  // assign pareto line props
  @Prop() paretoStroke: any = '#767676';
  @Prop() paretoHighlight: any = '#15195A';
  @Prop() paretoDot: any = 3;
  @Prop() paretoThreshold: any;

  // Interactivity
  @Prop({ mutable: true }) hoverHighlight;
  @Prop({ mutable: true }) clickHighlight = [];
  @Prop({ mutable: true }) interactionKeys;

  @Element()
  barChartEl: HTMLElement;
  svg: any;
  root: any;
  rootG: any;
  tooltipG: any;
  bars: any;
  x: any;
  y: any;
  yCum: any;
  line: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  colorArr: any;
  chartID: string;
  shouldUpdateChart: boolean = false;
  shouldUpdateBarStyle: boolean = false;

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID;
    this.barChartEl.id = this.chartID;
  }

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    // console.log('we are in data watcher', _newData, _oldData);
    this.shouldUpdateChart = true;
  }

  @Watch('hoverHighlight')
  @Watch('clickHighlight')
  highlightWatcher(_newHighlight, _oldHighlight) {
    // console.log('we are in highlight watcher', _newHighlight, _oldHighlight);
    this.shouldUpdateBarStyle = true;
  }

  componentWillLoad() {
    this.chartID = this.uniqueID || 'bar-chart-' + uuid();
    this.barChartEl.id = this.chartID;
    // console.log('component will load',)
    this.updateChartVariable();
  }

  componentDidLoad() {
    // console.log('component did load')
    this.updateData();
    this.drawChart();
    this.setTooltipInitialStyle();
  }

  componentWillUpdate() {
    // console.log('component will update')
    this.updateChartVariable();
  }

  componentDidUpdate() {
    // console.log('component did update')
    // sorting of data defalut is asc
    if (this.sortOrder === 'asc') {
      this.data.sort((a, b) => Number(a[this.valueAccessor]) - Number(b[this.valueAccessor]));
    } else if (this.sortOrder === 'desc') {
      this.data.sort((a, b) => Number(b[this.valueAccessor]) - Number(a[this.valueAccessor]));
    }

    // this is a very unsophisticated pattern to handle hover issues only
    // if we are only updating bar style then don't redraw
    if (this.shouldUpdateBarStyle) {
      this.shouldUpdateBarStyle = false;
      this.updateBarSytle(this.bars);
    } else {
      // otherwise re-draw to handle any other possible change
      this.shouldUpdateChart = false;
      this.updateData();
      this.drawChart();
    }
  }

  updateData() {
    var totalAmount = 0;
    this.data.map((d, i) => {
      d[this.valueAccessor] = parseFloat(d[this.valueAccessor]);
      //prepare accumulative data for pareto line
      d[this.valueAccessor] = +d[this.valueAccessor];
      totalAmount += d[this.valueAccessor];
      d.CumulativeAmount = i === 0 ? d[this.valueAccessor] : d[this.valueAccessor] + this.data[i - 1].CumulativeAmount;
    });

    //prepare accumulative data for pareto line
    this.data.map(d => {
      d.CumulativePercentage = d.CumulativeAmount / totalAmount;
    });
  }

  updateChartVariable() {
    this.innerXAxis = { ...this.xAxis, gridVisible: !(this.layout === 'vertical') && this.xAxis.gridVisible };
    this.innerYAxis = { ...this.yAxis, gridVisible: this.layout === 'vertical' && this.yAxis.gridVisible };

    if (!this.innerXAxis.visible) {
      this.padding.bottom = this.height * 0.05;
    }

    if (!this.innerYAxis.visible) {
      this.padding.left = this.width * 0.05;
    }

    this.interactionKeys ? '' : (this.interactionKeys = [this.groupAccessor || this.ordinalAccessor]);

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;
  }

  updateBarSytle(bar) {
    bar
      .attr('fill', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d, this.clickHighlight, this.interactionKeys) &&
        this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.interactionKeys) && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : this.groupAccessor
          ? this.colorArr(d[this.groupAccessor])
          : this.colorArr(d[this.valueAccessor])
      )
      .attr('style', d => {
        // set style for interaction: hovered/focus state- dashed, clicked state- solid outline
        return interactionStyle({
          data: d,
          clickHighlight: this.clickHighlight,
          hoverHighlight: this.hoverHighlight,
          clickStyle: this.clickStyle,
          hoverStyle: this.hoverStyle,
          interactionKeys: this.interactionKeys,
          defaultStroke: outlineColor(
            this.groupAccessor ? this.colorArr(d[this.groupAccessor]) : this.colorArr(d[this.valueAccessor])
          ),
          defaultStrokeWidth: 3
        });
      })
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.interactionKeys)
      );
  }

  drawChart() {
    // console.log('draw chart', this.data)

    this.reSetRoot();
    // scale band based on layout of chart
    if (this.layout === 'vertical') {
      this.y = scaleLinear()
        .domain([0, this.maxValueOverride || max(this.data, d => d[this.valueAccessor])])
        .range([this.innerPaddedHeight, 0]);
      //for pareto-chart grid synchronize only
      if (this.yAxis.gridVisible == true) {
        var ceilingTen = Math.ceil(max(this.data, d => d[this.valueAccessor]) * 10) / 10;
        // console.log('show yAxis grid', ceilingTen)
        this.y = scaleLinear()
          .domain([0, ceilingTen])
          .range([this.innerPaddedHeight, 0]);
      }

      this.x = scaleBand()
        .domain(this.data.map(d => d[this.ordinalAccessor]))
        .range([0, this.innerPaddedWidth])
        .padding(0.2);

      // create accumulative y axis
      this.yCum = scaleLinear()
        .domain([0, 1])
        .range([this.innerPaddedHeight, 0]);
    } else if (this.layout === 'horizontal') {
      this.x = scaleLinear()
        .domain([0, this.maxValueOverride || max(this.data, d => d[this.valueAccessor])])
        .range([0, this.innerPaddedWidth]);

      this.y = scaleBand()
        .domain(this.data.map(d => d[this.ordinalAccessor]))
        .range([this.innerPaddedHeight, 0])
        .padding(0.2);
    }

    this.line = line()
      .x(d => this.x(d[this.ordinalAccessor]) + this.x.bandwidth() / 2)
      .y(d => this.yCum(d.CumulativePercentage));
    //.interpolate('basis');

    const minValue = min(this.data, d => d[this.valueAccessor]);
    const maxValue = max(this.data, d => d[this.valueAccessor]);

    this.colorArr = this.groupAccessor
      ? getColors(
          this.colors || this.colorPalette,
          scaleOrdinal()
            .domain(this.data.map(d => d[this.groupAccessor]))
            .domain()
        )
      : getColors(this.colors || this.colorPalette, [minValue, maxValue]);

    // interaction style default, adapted from bar chart
    this.hoverStyle = this.hoverStyle
      ? this.hoverStyle
      : this.colorPalette.includes('single')
      ? {
          color: 'comp_blue',
          strokeWidth: 3
        }
      : {
          strokeWidth: 3
        };

    this.clickStyle = this.clickStyle
      ? this.clickStyle
      : this.colorPalette.includes('single')
      ? {
          color: 'supp_purple',
          strokeWidth: 3
        }
      : {
          strokeWidth: 3
        };

    this.drawGrid();
    this.drawAxis();
    this.drawBars();
    if (this.line) {
      this.drawLine();
    }
    this.drawDataLabels();
    this.drawReferenceLines();

    // if (!this.hideAccessibility) {
    // applyAT({
    //   rootEle: this.barChartEl,
    //   svg: this.svg,
    //   title: this.mainTitle,
    //   subTitle: this.subTitle,
    //   data: this.data,
    //   // toolTipEl: this.tooltipG, // temporarilly removed during tooltip update, needs to be addressed during applyAT updatze
    //   hasXAxis: this.xAxis ? this.xAxis.visible : false,
    //   hasYAxis: this.yAxis ? this.yAxis.visible : false,
    //   xAxisLabel: this.xAxis.label ? this.xAxis.label : '',
    //   yAxisLabel: this.yAxis.label1 ? this.yAxis.label1 : '',
    //   secondaryYAxisLabel: this.yAxis.label2 ? this.yAxis.label2 : '',
    //   chartTag: 'pareto-chart',
    //   yAxis: this.y ? this.y : false,
    //   secondaryYAxis: this.yCum ? this.yCum : false,
    //   layout: this.layout ? this.layout : false,
    //   hideDataTable: this.hideDataTable
    // });
    // }
  }

  // reset graph size based on window size
  reSetRoot() {
    if (this.svg) {
      this.svg.remove();
    }

    this.svg = select(this.barChartEl)
      .select('#visa-viz-d3-pareto-container')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.root = this.svg
      .append('g')
      .attr('id', 'visa-viz-margin-container-g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.rootG = this.root
      .append('g')
      .attr('id', 'visa-viz-padding-container-g')
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);

    this.tooltipG = select(this.barChartEl).select('.pareto-tooltip');
  }

  // draw axis line
  drawAxis() {
    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.x,
      left: false,
      wrapLabel: this.wrapLabel && this.layout === 'vertical' ? this.x.bandwidth() : '',
      format: this.xAxis.format,
      tickInterval: this.xAxis.tickInterval,
      label: this.xAxis.label,
      padding: this.padding,
      hide: !this.innerXAxis.visible
    });

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.y,
      left: true,
      wrapLabel: this.wrapLabel ? this.padding.left || 100 : '',
      format: this.yAxis.format,
      tickInterval: this.yAxis.tickInterval,
      label: this.yAxis.label,
      padding: this.padding,
      hide: !this.innerYAxis.visible
    });

    drawAxis({
      root: this.rootG,
      height: this.innerPaddedHeight,
      width: this.innerPaddedWidth,
      axisScale: this.yCum,
      right: true,
      wrapLabel: this.wrapLabel ? this.padding.left || 100 : '',
      format: this.yAxis.formatCum || '0.0%',
      hide: !this.innerYAxis.visible
    });
  }

  // helper function that will assign different label placements within the viz - specific to bar for now
  placeDataLabels = (dRecord, xORy) => {
    let xPlacement;
    let yPlacement;
    let dEm;
    let dEmOther = '0em';
    let textAnchor;

    // console.log('we are in placeDataLabels', dRecord, xORy, this.dataLabel); // tslint:disable-line no-console

    if (this.layout === 'vertical') {
      if ((this.dataLabel.placement || 'top') === 'top') {
        xPlacement = this.x(dRecord[this.ordinalAccessor]) + this.x.bandwidth() / 2;
        yPlacement = this.y(Math.max(0, dRecord[this.valueAccessor]));
        dEm = '-.3em';
        textAnchor = 'middle';
      } else if ((this.dataLabel.placement || 'top') === 'bottom') {
        xPlacement = this.x(dRecord[this.ordinalAccessor]) + this.x.bandwidth() / 2;
        yPlacement = this.y(0) - 5;
        dEm = '-.2em';
        textAnchor = 'middle';
      }
    } else if (this.layout === 'horizontal') {
      if ((this.dataLabel.placement || 'top') === 'top') {
        yPlacement = this.y(dRecord[this.ordinalAccessor]) + this.y.bandwidth() / 2 + 4;
        xPlacement = this.x(dRecord[this.valueAccessor]) + 4;
        dEm = '.2em';
        textAnchor = 'start';
      } else if ((this.dataLabel.placement || 'top') === 'bottom') {
        yPlacement = this.y(dRecord[this.ordinalAccessor]) + this.y.bandwidth() / 2 + 4;
        xPlacement = this.x(0);
        dEm = '.2em';
        textAnchor = 'start';
      } else if ((this.dataLabel.placement || 'top') === 'bottomAbove') {
        yPlacement = this.y(dRecord[this.ordinalAccessor]);
        xPlacement = this.x(0);
        dEm = '.2em';
        dEmOther = '-.2em';
        textAnchor = 'start';
      } else if ((this.dataLabel.placement || 'top') === 'bottomBelow') {
        yPlacement = this.y(dRecord[this.ordinalAccessor]) + this.y.bandwidth();
        xPlacement = this.x(0);
        dEm = '.2em';
        dEmOther = '1em';
        textAnchor = 'start';
      }
    }

    if (xORy === 'x') {
      return xPlacement;
    } else if (xORy === 'y') {
      return yPlacement;
    } else if (xORy === 'em') {
      return dEm;
    } else if (xORy === 'em2') {
      return dEmOther;
    } else if (xORy === 'anchor') {
      return textAnchor;
    } else {
      return null;
    }
  };

  // based on whether value accessor and format was provided return the right thing
  formatDataLabel(d) {
    if (this.dataLabel.content === 'ordinalAccessor') {
      return d[this.ordinalAccessor];
    } else {
      if (this.dataLabel.format) {
        return formatStats(d[this.valueAccessor], this.dataLabel.format);
      } else {
        return d[this.valueAccessor];
      }
    }
  }

  // handle data labels
  drawDataLabels() {
    // check whether to show label, if so they render parts appropriately
    if (this.dataLabel.visible) {
      this.rootG.selectAll('text.dataLabel').remove();
      // console.log('we are in data label', this.dataLabel, this ); // tslint:disable-line no-console

      // now we can place the labels correctly on the graph
      this.rootG
        .append('g')
        .attr('class', 'bar-dataLabel-group')
        .attr('id', 'bar-dataLabel-group')
        .selectAll('.text')
        .data(this.data)
        .enter()
        .append('text')
        .attr('x', d => this.placeDataLabels(d, 'x'))
        .attr('y', d => this.placeDataLabels(d, 'y'))
        .attr(this.layout === 'vertical' ? 'dy' : 'dx', d => this.placeDataLabels(d, 'em'))
        .attr(this.layout === 'vertical' ? 'dx' : 'dy', d => this.placeDataLabels(d, 'em2'))
        .attr('text-anchor', d => this.placeDataLabels(d, 'anchor'))
        .attr('class', 'bar-dataLabel-' + this.layout)
        .text(d => this.formatDataLabel(d))
        .on('click', d => this.onClickHandler(d))
        .on('mouseover', d => this.onHoverHandler(d))
        .on('mouseout', () => this.onMouseOutHandler());
    }
  }

  // dashed line grid for chart
  drawGrid() {
    drawGrid(
      this.rootG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.x,
      false,
      !this.innerXAxis.gridVisible,
      this.xAxis.tickInterval
    );
    drawGrid(
      this.rootG,
      this.innerPaddedHeight,
      this.innerPaddedWidth,
      this.y,
      true,
      !this.innerYAxis.gridVisible,
      this.yAxis.tickInterval
    );
  }

  // bars based on data
  drawBars() {
    if (this.layout === 'vertical') {
      this.bars = this.rootG
        .append('g')
        .attr('class', 'bar-group')
        .selectAll('.bar')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('tabindex', (_, index) => (index === 0 ? '0' : '-1'))
        .attr('rx', this.roundedCorner)
        .attr('ry', this.roundedCorner)
        .attr('x', d => this.x(d[this.ordinalAccessor]))
        .attr('y', d => this.y(Math.max(0, d[this.valueAccessor]))) // this.y(d[this.valueAccessor]))
        .attr('height', d => Math.abs(this.y(0) - this.y(d[this.valueAccessor])))
        .attr('width', this.x.bandwidth())
        .attr('cursor', this.cursor)
        .attr('fill', d =>
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.interactionKeys) &&
          this.clickStyle.color
            ? visaColors[this.clickStyle.color] || this.clickStyle.color
            : this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.interactionKeys) && this.hoverStyle.color
            ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
            : this.groupAccessor
            ? this.colorArr(d[this.groupAccessor])
            : this.colorArr(d[this.valueAccessor])
        )
        .attr('style', d => {
          // set style for interaction: hovered/focus state- dashed, clicked state- solid outline
          return interactionStyle({
            data: d,
            clickHighlight: this.clickHighlight,
            hoverHighlight: this.hoverHighlight,
            clickStyle: this.clickStyle,
            hoverStyle: this.hoverStyle,
            interactionKeys: this.interactionKeys,
            defaultStroke: outlineColor(
              this.groupAccessor ? this.colorArr(d[this.groupAccessor]) : this.colorArr(d[this.valueAccessor])
            ),
            defaultStrokeWidth: 3
          });
        })
        .attr('opacity', d =>
          checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.interactionKeys)
        )
        .on('click', d => this.onClickHandler(d))
        .on('mouseover', d => this.onHoverHandler(d))
        .on('mouseout', () => this.onMouseOutHandler());
    } else if (this.layout === 'horizontal') {
      this.bars = this.rootG
        .append('g')
        .attr('class', 'bar-group')
        .selectAll('.bar')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('class', d => (this.clickHighlight.includes(d[this.ordinalAccessor]) ? 'bar highlight' : 'bar'))
        .attr('tabindex', (_, index) => (index === 0 ? '0' : '-1'))
        .attr('rx', this.roundedCorner)
        .attr('ry', this.roundedCorner)
        .attr('x', d => this.x(Math.min(0, d[this.valueAccessor])))
        .attr('y', d => this.y(d[this.ordinalAccessor]))
        .attr('height', this.y.bandwidth())
        .attr('width', d => Math.abs(this.x(d[this.valueAccessor]) - this.x(0)))
        .attr('cursor', this.cursor)
        .attr('fill', d =>
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.interactionKeys) &&
          this.clickStyle.color
            ? visaColors[this.clickStyle.color] || this.clickStyle.color
            : this.hoverHighlight && checkHovered(d, this.hoverHighlight, this.interactionKeys) && this.hoverStyle.color
            ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
            : this.groupAccessor
            ? this.colorArr(d[this.groupAccessor])
            : this.colorArr(d[this.valueAccessor])
        )
        .attr('style', d => {
          // set style for interaction: hovered/focus state- dashed, clicked state- solid outline
          return interactionStyle({
            data: d,
            clickHighlight: this.clickHighlight,
            hoverHighlight: this.hoverHighlight,
            clickStyle: this.clickStyle,
            hoverStyle: this.hoverStyle,
            interactionKeys: this.interactionKeys,
            defaultStroke: outlineColor(
              this.groupAccessor ? this.colorArr(d[this.groupAccessor]) : this.colorArr(d[this.valueAccessor])
            ),
            defaultStrokeWidth: 3
          });
        })
        .on('click', d => this.onClickHandler(d))
        .on('mouseover', d => this.onHoverHandler(d))
        .on('mouseout', () => this.onMouseOutHandler());
    }
  }

  drawLine() {
    let hasReachedThreshold = false;
    let reachedThresholdIndex;

    for (let i = 0; i < this.data.length; i++) {
      if (!hasReachedThreshold && this.data[i].CumulativePercentage > this.paretoThreshold) {
        reachedThresholdIndex = i;
        hasReachedThreshold = true;
      }
    }

    const lineG = this.rootG.append('g').attr('class', 'pareto-line');

    lineG
      .append('path')
      .datum(this.data)
      .attr('d', this.line)
      .attr('class', 'pareto-line-path')
      .attr('x', this.x.bandwidth() / 2)
      .attr('fill', 'none')
      .attr('stroke', this.paretoStroke)
      .attr('stroke-width', 1);

    lineG
      .selectAll('.pareto-background-dot')
      .data([this.data[reachedThresholdIndex]])
      .enter()
      .append('circle')
      .attr('class', 'pareto-background-dot')
      .attr('fill', '#fff')
      .attr('stroke', this.paretoHighlight)
      .attr('stroke-width', '1px')
      .attr('r', this.paretoDot + 6)
      .attr('cx', d => this.x(d[this.ordinalAccessor]) + this.x.bandwidth() / 2)
      .attr('cy', d => this.yCum(d.CumulativePercentage));

    lineG
      .selectAll('.pareto-dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'pareto-dot')
      .attr('fill', (_, i) => {
        if (i === reachedThresholdIndex) {
          return this.paretoHighlight;
        } else {
          return this.paretoStroke;
        }
      })
      .attr('r', (_, i) => (reachedThresholdIndex === i ? this.paretoDot + 3 : this.paretoDot))
      .attr('cx', d => this.x(d[this.ordinalAccessor]) + this.x.bandwidth() / 2)
      .attr('cy', d => this.yCum(d.CumulativePercentage));

    lineG
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .attr('x', d => this.placeDataLabels(d, 'x'))
      .attr('y', d => this.yCum(d.CumulativePercentage))
      .attr('dy', '-1em')
      .attr('text-anchor', 'middle')
      .attr('class', 'pareto-label')
      .attr('fill', this.paretoHighlight)
      .text((d, i) => (reachedThresholdIndex === i ? formatStats(d.CumulativePercentage, '0.0%') : ''));
  }

  drawReferenceLines() {
    // first check whether we have reference lines array populated
    if (this.referenceLines.length > 0) {
      if (this.layout === 'vertical') {
        this.rootG
          .append('g')
          .attr('class', 'bar-reference-line-group')
          .selectAll('.bar-reference-line')
          .data(this.referenceLines)
          .enter()
          .append('line')
          .attr('id', d => d.referenceID)
          .attr('class', 'bar-reference-line')
          .attr('x1', 0)
          .attr('x2', this.innerPaddedWidth)
          .attr('y1', d => this.y(d.referenceData.referenceValue))
          .attr('y2', d => this.y(d.referenceData.referenceValue))
          .style('stroke', d => d.referenceData.strokeColor)
          .style('stroke-width', d => d.referenceData.strokeWidth)
          .style('opacity', d => d.referenceData.strokeOpacity);

        this.rootG
          .select('.bar-reference-line-group')
          .selectAll('.bar-reference-line-label')
          .data(this.referenceLines)
          .enter()
          .append('text')
          .attr('id', d => d.referenceID + '-label')
          .attr('class', 'bar-reference-line-label')
          .attr('text-anchor', d =>
            (d.referenceData.labelPlacementHorizontal || 'right') === 'right' ? 'start' : 'end'
          )
          .attr('x', d =>
            (d.referenceData.labelPlacementHorizontal || 'right') === 'right' ? this.innerPaddedWidth : 0
          )
          .attr('dx', d => ((d.referenceData.labelPlacementHorizontal || 'right') === 'right' ? '0.1em' : '-0.1em'))
          .attr('y', d => this.y(d.referenceData.referenceValue))
          .attr('dy', '0.3em')
          .text(d => d.referenceData.labelValue)
          .style('fill', d => d.referenceData.strokeColor);
      } else if (this.layout === 'horizontal') {
        this.rootG
          .append('g')
          .attr('class', 'bar-reference-line-group')
          .selectAll('.bar-reference-line')
          .data(this.referenceLines)
          .enter()
          .append('line')
          .attr('id', d => d.referenceID)
          .attr('class', 'bar-reference-line')
          .attr('y1', 0)
          .attr('y2', this.innerPaddedHeight)
          .attr('x1', d => this.x(d.referenceData.referenceValue))
          .attr('x2', d => this.x(d.referenceData.referenceValue))
          .style('stroke', d => d.referenceData.strokeColor)
          .style('stroke-width', d => d.referenceData.strokeWidth)
          .style('opacity', d => d.referenceData.strokeOpacity);

        this.rootG
          .select('.bar-reference-line-group')
          .selectAll('.bar-reference-line-label')
          .data(this.referenceLines)
          .enter()
          .append('text')
          .attr('id', d => d.referenceID + '-label')
          .attr('class', 'bar-reference-line-label')
          .attr('text-anchor', 'middle')
          .attr('x', d => this.x(d.referenceData.referenceValue))
          .attr('y', d => ((d.referenceData.labelPlacementVertical || 'top') === 'top' ? 0 : this.innerPaddedHeight))
          .attr('dy', d => ((d.referenceData.labelPlacementVertical || 'top') === 'top' ? '-0.3em' : '1em'))
          .text(d => d.referenceData.labelValue)
          .style('fill', d => d.referenceData.strokeColor);
      }
      this.rootG.exit().remove();
    }
  }

  onClickHandler(d) {
    this.clickFunc.emit(d);
  }

  onHoverHandler(d) {
    this.hoverFunc.emit(d);
    if (this.showTooltip) {
      this.eventsTooltip({ data: d, evt: event, isToShow: true });
    }
  }

  onMouseOutHandler() {
    this.mouseOutFunc.emit();
    if (this.showTooltip) {
      this.eventsTooltip({ isToShow: false });
    }
  }

  // set initial style (instead of copying css class across the lib)
  setTooltipInitialStyle() {
    initTooltipStyle(this.tooltipG);
  }

  // tooltip
  eventsTooltip({ data, evt, isToShow }: { data?: any; evt?: any; isToShow: boolean }) {
    drawTooltip({
      root: this.tooltipG,
      data,
      event: evt,
      isToShow,
      tooltipLabel: undefined,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      dataLabel: this.dataLabel,
      layout: this.layout,
      ordinalAccessor: this.ordinalAccessor,
      valueAccessor: this.valueAccessor,
      chartType: 'bar'
    });
  }

  render() {
    // console.log('pareto-chart render', this.data)
    const theme = 'light';

    return (
      <div class={`o-layout is--${this.layout} ${theme}`}>
        <div class="o-layout--chart">
          <h1 class="visa-ui-header--4">{this.mainTitle}</h1>
          <p class="visa-ui-text--instructions">{this.subTitle}</p>
          <div class="pareto-tooltip vcl-tooltip" style={{ display: this.showTooltip ? 'block' : 'none' }} />
          <div id="visa-viz-d3-pareto-container" />
        </div>
      </div>
    );
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
