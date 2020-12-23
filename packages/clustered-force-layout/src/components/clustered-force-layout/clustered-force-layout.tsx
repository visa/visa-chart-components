/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { Component, Element, Prop, h, Watch, EventEmitter, Event } from '@stencil/core';
import { select, event } from 'd3-selection';
import { scalePow, scaleOrdinal } from 'd3-scale';
import { max, min } from 'd3-array';
import { forceCollide, forceSimulation, forceManyBody, forceX, forceY } from 'd3-force';
// import { interpolate } from 'd3-interpolate';
import { drag } from 'd3-drag';
import { v4 as uuid } from 'uuid';
import 'd3-transition';
import { IBoxModelType } from '@visa/charts-types';
import Utils from '@visa/visa-charts-utils';

const {
  formatStats,
  getLicenses,
  checkInteraction,
  checkClicked,
  checkHovered,
  getColors,
  outlineColor,
  visaColors,
  drawTooltip,
  initTooltipStyle
} = Utils;

@Component({
  tag: 'clustered-force-layout'
})
export class ClusteredForceLayout {
  @Event() clickFunc: EventEmitter;
  @Event() hoverFunc: EventEmitter;
  @Event() mouseOutFunc: EventEmitter;

  @Prop() width: any = 400;
  @Prop() height: any = 400;
  // @Prop() nodePadding: number = 1.5;  // separation between same-color nodes
  // @Prop() clusterPadding: number = 6; // separation between different-color nodes
  @Prop({ mutable: true }) maxRadius: number = 0; // maximum size of circles to allow
  @Prop() data: any;
  @Prop() uniqueID;
  @Prop() colors: any;
  @Prop({ mutable: true }) colorPalette = 'sequential_suppPurple';

  // accessors
  @Prop() clusterAccessor: string;
  @Prop() nodeAccessor: string;
  @Prop() nodeSizeAccessor: string;

  @Prop() mainTitle: string;
  @Prop() subTitle: string;

  @Prop() drag: boolean = true;

  // data label props object
  @Prop({ mutable: true }) showTooltip = true;
  @Prop({ mutable: true }) tooltipLabel;
  @Prop({ mutable: true }) cursor = 'cursor';
  @Prop() dataLabel: any = {
    visible: true,
    placement: 'center',
    content: 'nodeSizeAccessor',
    format: '0,0.00'
  };

  @Prop() margin: IBoxModelType = {
    top: this.height * 0.02,
    bottom: this.height * 0.02,
    right: this.width * 0.02,
    left: this.width * 0.02
  };
  @Prop({ mutable: true }) padding: IBoxModelType = {
    top: this.height * 0.02,
    bottom: this.height * 0.02,
    right: this.width * 0.02,
    left: this.width * 0.02
  };

  // Interactivity
  @Prop({ mutable: true }) hoverStyle: any = {
    color: 'comp_blue',
    strokeWidth: 2
  };
  @Prop({ mutable: true }) clickStyle: any = {
    color: 'supp_purple',
    strokeWidth: 2
  };
  @Prop({ mutable: true }) hoverOpacity = 1;
  @Prop({ mutable: true }) hoverHighlight: any;
  @Prop({ mutable: true }) clickHighlight: any = [];
  @Prop({ mutable: true }) interactionKeys: string[];

  @Element()
  clusterChartEl: HTMLElement;
  svg: any;
  rootG: any;
  tooltipG: any;
  innerHeight: number;
  innerWidth: number;
  innerPaddedHeight: number;
  innerPaddedWidth: number;
  innerXAxis: any;
  innerYAxis: any;
  circle: any;
  prepareLoading: any = true;
  colorArr: any;
  chartID: string;

  @Watch('uniqueID')
  idWatcher(newID, _oldID) {
    this.chartID = newID;
    this.clusterChartEl.id = this.chartID;
  }

  @Watch('data')
  dataWatcher(_newData, _oldData) {
    this.prepareLoading = true;
  }

  componentWillLoad() {
    this.chartID = this.uniqueID || 'cluster-force-layout-chart-' + uuid();
    this.clusterChartEl.id = this.chartID;

    // default interaction keys if not provided
    this.interactionKeys ? '' : (this.interactionKeys = [this.clusterAccessor || this.nodeAccessor]);

    // before we render/load we need to set our height and width based on props
    this.innerHeight = this.height - this.margin.top - this.margin.bottom;
    this.innerWidth = this.width - this.margin.left - this.margin.right;

    this.innerPaddedHeight = this.innerHeight - this.padding.top - this.padding.bottom;
    this.innerPaddedWidth = this.innerWidth - this.padding.left - this.padding.right;

    // default tooltip label vs updating tooltip util for default for this chart
    if (!this.tooltipLabel) {
      if (this.clusterAccessor) {
        this.tooltipLabel = {
          labelAccessor: [this.clusterAccessor, this.nodeAccessor, this.nodeSizeAccessor],
          labelTitle: ['', '', ''],
          format: ['', '', '0,0[.][0][a]']
        };
      } else {
        this.tooltipLabel = {
          labelAccessor: [this.nodeAccessor, this.nodeSizeAccessor],
          labelTitle: ['', ''],
          format: ['', '0,0[.][0][a]']
        };
      }
    }
  }

  componentDidLoad() {
    this.drawChart();
    this.setTooltipInitialStyle();
  }

  componentDidUpdate() {
    this.drawCircle(this.circle);
    if (this.data.length > 0 && this.prepareLoading) {
      this.prepareLoading = false;
      this.drawChart();
    }
  }

  reSetRoot() {
    if (this.svg) {
      this.svg.remove();
    }

    // assign the svg to this.svg use barChartEL to make it specific to this instance
    this.svg = select(this.clusterChartEl)
      .select('#visa-viz-d3-force-cluster-container')
      .append('svg')
      .attr('id', 'visa-viz-d3-svg-container')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);
    // .style("border", "2px solid black")

    this.svg
      .append('g')
      .attr('id', 'visa-viz-margin-container-g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.rootG = select(this.clusterChartEl)
      .select('#visa-viz-margin-container-g')
      .append('g')
      .attr('id', 'visa-viz-padding-container-g')
      .attr('transform', `translate(${this.padding.left}, ${this.padding.top})`);

    this.tooltipG = select(this.clusterChartEl).select('.clustered-force-layout-tooltip');
  }

  drawChart() {
    this.reSetRoot();

    // step 1 is to determine the number of clusters
    // 1. find max
    const maxAmount = max(this.data, d => d[this.nodeSizeAccessor]);
    const minAmount = min(this.data, d => d[this.nodeSizeAccessor]);

    // 2. Optimize the estimation of max Radius:
    // Compare the max & 2nd max value -> get a ratio "secondFirstRatio" m2 = maxAmount / secondMax
    // Get max, max2, max3.... until sqrt(n) max
    // e.g. if there are 100 circles, get until 10th max
    // Get all the ratio comparing to the max -> m2, m3= (max3 / maxAmount), m4,... m10
    // (1 + m2 + m3 + ... + m10) * r * 2 = min(w, h)
    // get the maximum possible radius r = min(w,h) / (2 * (1 + m2 + m3 + ....)
    const valueArr = [];
    const ratioArr = [];
    const ratioToMax = [1];
    let ratioToMaxSum = 1;
    this.data.map(d => {
      valueArr.push(d[this.nodeSizeAccessor]);
      ratioArr.push(d[this.nodeSizeAccessor] / maxAmount);
    });

    this.colorArr = this.clusterAccessor
      ? getColors(
          this.colors || this.colorPalette,
          scaleOrdinal()
            .domain(this.data.map(d => d[this.clusterAccessor]))
            .domain()
        )
      : getColors(this.colors || this.colorPalette, [minAmount, maxAmount]);

    for (var i = 0; i < Math.sqrt(this.data.length); i++) {
      var currentMax = Math.max.apply(null, valueArr); // get the max of the array
      valueArr.splice(valueArr.indexOf(currentMax), 1); // remove max from the array
      var secondMax = Math.max.apply(null, valueArr); // get the 2nd max
      ratioToMax.push(secondMax / maxAmount);
      ratioToMaxSum += secondMax / maxAmount;
    }

    // const maxAllowableRadius = Math.min(this.innerPaddedWidth,this.innerPaddedHeight) /  (Math.sqrt(this.data.length) * 2)
    const maxAllowableRadius = Math.min(this.innerPaddedWidth, this.innerPaddedHeight) / (ratioToMaxSum * 2);

    // Reset max Radius to the min of allowable or prop provided
    this.maxRadius = this.maxRadius !== 0 ? Math.min(this.maxRadius, maxAllowableRadius) : maxAllowableRadius;

    const radiusScale = scalePow()
      .exponent(0.5)
      .range([0, this.maxRadius])
      .domain([0, maxAmount]);

    const clusters = new Array();

    const myNodes = this.data.map(d => {
      return {
        id: d[this.nodeAccessor],
        cluster: d[this.clusterAccessor],
        radius: radiusScale(+d[this.nodeSizeAccessor]),
        value: d[this.nodeSizeAccessor],
        x: Math.random() * 900,
        y: Math.random() * 800,
        ...d
      };
    });

    myNodes.map(d => {
      if (
        !clusters[d[this.clusterAccessor]] ||
        radiusScale(+d[this.nodeSizeAccessor]) > clusters[d[this.clusterAccessor]].radius
      ) {
        clusters[d[this.clusterAccessor]] = d;
      }
    });

    const _forceCluster = alpha => {
      // cluster spacing depends on k below, lower the value, lesser the gap
      for (let i = 0, n = myNodes.length, node, cluster, k = alpha * 0.43; i < n; ++i) {
        node = myNodes[i];
        cluster = clusters[node.cluster];
        node.vx -= (node.x - cluster.x) * k;
        node.vy -= (node.y - cluster.y) * k;
      }
    };

    // const _tick = () => {
    //   this.circle.attr('cx', d  => d.x).attr('cy', d => d.y);
    // };

    // circle drag start
    const _dragstarted = () => {
      if (!event.active) {
        forceLayout.alphaTarget(0.3).restart();
      }
      select(this)
        .raise()
        .classed('active', true);
      forceLayout.force('collide').strength(1);
    };

    // circle drag in progress
    const _dragged = d => {
      select(this)
        .attr('cx', (d.x = event.x))
        .attr('cy', (d.y = event.y));
      forceLayout.force('collide').strength(1);
    };

    // circle drag stop
    const _dragended = () => {
      if (!event.active) {
        forceLayout.alphaTarget(0);
      }
      select(this).classed('active', false);
      forceLayout.force('collide').strength();
    };

    const forceLayout = forceSimulation()
      .nodes(myNodes)
      // .force("center", forceCenter([this.innerPaddedWidth / 2, this.innerPaddedHeight / 2]))
      .velocityDecay(0.9)
      .force('gravity', forceManyBody(30))
      .force(
        'x',
        forceX()
          .strength(0.9)
          .x(this.innerPaddedWidth / 2)
      )
      .force(
        'y',
        forceY()
          .strength(0.9)
          .y(this.innerPaddedHeight / 2)
      )
      .force(
        'collide',
        forceCollide()
          .radius(d => d.radius + 1)
          .iterations(2)
      )
      .force('cluster', _forceCluster)
      .stop();
    // .on('tick', _tick);

    setTimeout(() => {
      // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
      // for (var i = 0, n = Math.ceil(Math.log(forceLayout.alphaMin()) / Math.log(1 - forceLayout.alphaDecay())); i < n; ++i) {
      for (var i = 0, n = 500; i < n; ++i) {
        forceLayout.tick();
      }
      // create circles
      this.circle = this.rootG
        .selectAll('circle')
        .data(myNodes)
        .enter()
        .append('circle')
        .attr('class', d =>
          checkClicked(d, this.clickHighlight, this.interactionKeys) ? 'circle highlight' : 'circle'
        )
        .attr('cursor', this.cursor)
        .attr('r', d => d.radius)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('fill', d =>
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.interactionKeys) &&
          this.clickStyle.color
            ? visaColors[this.clickStyle.color] || this.clickStyle.color
            : checkHovered(d, this.hoverHighlight, this.interactionKeys) && this.hoverStyle.color
            ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
            : this.clusterAccessor
            ? this.colorArr(d[this.clusterAccessor])
            : this.colorArr(d[this.nodeSizeAccessor])
        )
        .attr('stroke', d =>
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.interactionKeys) &&
          this.clickStyle.color
            ? checkClicked(d, this.clickHighlight, this.interactionKeys)
              ? visaColors[this.clickStyle.stroke] ||
                this.clickStyle.stroke ||
                outlineColor(visaColors[this.clickStyle.color] || this.clickStyle.color)
              : checkHovered(d, this.hoverHighlight, this.interactionKeys)
              ? visaColors[this.hoverStyle.stroke] ||
                this.hoverStyle.stroke ||
                outlineColor(visaColors[this.hoverStyle.color] || this.hoverStyle.color)
              : ''
            : this.clusterAccessor
            ? outlineColor(this.colorArr(d[this.clusterAccessor]))
            : outlineColor(this.colorArr(d[this.nodeSizeAccessor]))
        )
        .attr('stroke-width', d =>
          this.clickHighlight.length > 0 &&
          checkClicked(d, this.clickHighlight, this.interactionKeys) &&
          this.clickStyle.color
            ? checkClicked(d, this.clickHighlight, this.interactionKeys)
              ? this.clickStyle.strokeWidth || 2
              : checkHovered(d, this.hoverHighlight, this.interactionKeys)
              ? this.hoverStyle.strokeWidth || 2
              : 1
            : 1
        )
        .attr('stroke-dasharray', d => (checkClicked(d, this.clickHighlight, this.interactionKeys) ? '4 3' : ''))
        .attr('opacity', d =>
          checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.interactionKeys)
        )
        .on('click', d => this.onClickHandler(d))
        .on('mouseover', d => this.onHoverHandler(d))
        .on('mouseout', () => this.onMouseOutHandler());

      // enable circle drag
      if (this.drag) {
        this.circle.call(
          drag()
            .on('start', _dragstarted)
            .on('drag', _dragged)
            .on('end', _dragended)
        );
      }

      // reduce jitter by delaying force
      // this.circle
      //   .transition()
      //   .duration(750)
      //   .delay(d => d.index * 5)
      //   .attrTween('r', d => {
      //     const i = interpolate(0, d.radius);
      //     return t => (d.radius = i(t));
      //   });
    });
  }

  drawCircle(circle) {
    circle
      .attr('class', d => (checkClicked(d, this.clickHighlight, this.interactionKeys) ? 'circle highlight' : 'circle'))
      .attr('fill', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d, this.clickHighlight, this.interactionKeys) &&
        this.clickStyle.color
          ? visaColors[this.clickStyle.color] || this.clickStyle.color
          : checkHovered(d, this.hoverHighlight, this.interactionKeys) && this.hoverStyle.color
          ? visaColors[this.hoverStyle.color] || this.hoverStyle.color
          : this.clusterAccessor
          ? this.colorArr(d[this.clusterAccessor])
          : this.colorArr(d[this.nodeSizeAccessor])
      )
      .attr('stroke', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d, this.clickHighlight, this.interactionKeys) &&
        this.clickStyle.color
          ? checkClicked(d, this.clickHighlight, this.interactionKeys)
            ? visaColors[this.clickStyle.stroke] ||
              this.clickStyle.stroke ||
              outlineColor(visaColors[this.clickStyle.color] || this.clickStyle.color)
            : checkHovered(d, this.hoverHighlight, this.interactionKeys)
            ? visaColors[this.hoverStyle.stroke] ||
              this.hoverStyle.stroke ||
              outlineColor(visaColors[this.hoverStyle.color] || this.hoverStyle.color)
            : ''
          : this.clusterAccessor
          ? outlineColor(this.colorArr(d[this.clusterAccessor]))
          : outlineColor(this.colorArr(d[this.nodeSizeAccessor]))
      )
      .attr('stroke-width', d =>
        this.clickHighlight.length > 0 &&
        checkClicked(d, this.clickHighlight, this.interactionKeys) &&
        this.clickStyle.color
          ? checkClicked(d, this.clickHighlight, this.interactionKeys)
            ? this.clickStyle.strokeWidth || 2
            : checkHovered(d, this.hoverHighlight, this.interactionKeys)
            ? this.hoverStyle.strokeWidth || 2
            : 1
          : 1
      )
      .attr('stroke-dasharray', d => (checkClicked(d, this.clickHighlight, this.interactionKeys) ? '4 3' : ''))
      .attr('opacity', d =>
        checkInteraction(d, 1, this.hoverOpacity, this.hoverHighlight, this.clickHighlight, this.interactionKeys)
      );
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

  // based on whether value accessor and format was provided return the right thing
  formatDataLabel(d) {
    if (this.dataLabel.content === 'nodeAccessor') {
      return d[this.nodeAccessor];
    } else {
      if (this.dataLabel.format) {
        return formatStats(d[this.nodeSizeAccessor], this.dataLabel.format);
      } else {
        return d[this.nodeSizeAccessor];
      }
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
      tooltipLabel: this.tooltipLabel,
      dataLabel: this.dataLabel,
      ordinalAccessor: this.nodeAccessor,
      valueAccessor: this.nodeSizeAccessor,
      groupAccessor: this.clusterAccessor,
      chartType: 'clustered-force-layout'
    });
  }

  render() {
    return (
      <div class="o-layout">
        <div class="o-layout--chart">
          <h2>{this.mainTitle}</h2>
          <p class="visa-ui-text--instructions">{this.subTitle}</p>
          <div
            class="clustered-force-layout-tooltip vcl-tooltip"
            style={{ display: this.showTooltip ? 'block' : 'none' }}
          />
          <div id="visa-viz-d3-force-cluster-container" />
        </div>
      </div>
    );
  }
}

// incorporate OSS licenses into build
window['VisaChartsLibOSSLicenses'] = getLicenses(); // tslint:disable-line no-string-literal
