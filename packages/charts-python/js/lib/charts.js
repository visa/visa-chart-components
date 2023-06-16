/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

// var widgets = require('@jupyter-widgets/base');
import { DOMWidgetModel, DOMWidgetView } from '@jupyter-widgets/base';
var pkg = require('../package.json');

// temporary comment to bump charts with feature commit
// import vcc components for python widget
var { BarChart } = require('@visa/charts/dist/components/bar-chart');
var { StackedBarChart } = require('@visa/charts/dist/components/stacked-bar-chart');
var { ClusteredBarChart } = require('@visa/charts/dist/components/clustered-bar-chart');
var { LineChart } = require('@visa/charts/dist/components/line-chart');
var { PieChart } = require('@visa/charts/dist/components/pie-chart');
var { ScatterPlot } = require('@visa/charts/dist/components/scatter-plot');
var { HeatMap } = require('@visa/charts/dist/components/heat-map');
var { CirclePacking } = require('@visa/charts/dist/components/circle-packing');
var { ParallelPlot } = require('@visa/charts/dist/components/parallel-plot');
var { DumbbellPlot } = require('@visa/charts/dist/components/dumbbell-plot');
var { WorldMap } = require('@visa/charts/dist/components/world-map');
var { AlluvialDiagram } = require('@visa/charts/dist/components/alluvial-diagram');
var { DataTable } = require('@visa/charts/dist/components/data-table');
var { KeyboardInstructions } = require('@visa/charts/dist/components/keyboard-instructions');

customElements.define('bar-chart', BarChart);
customElements.define('clustered-bar-chart', ClusteredBarChart);
customElements.define('stacked-bar-chart', StackedBarChart);
customElements.define('line-chart', LineChart);
customElements.define('pie-chart', PieChart);
customElements.define('scatter-plot', ScatterPlot);
customElements.define('heat-map', HeatMap);
customElements.define('circle-packing', CirclePacking);
customElements.define('parallel-plot', ParallelPlot);
customElements.define('dumbbell-plot', DumbbellPlot);
customElements.define('world-map', WorldMap);
customElements.define('alluvial-diagram', AlluvialDiagram);
customElements.define('keyboard-instructions', KeyboardInstructions);
customElements.define('data-table', DataTable);

// See charts.py for the kernel counterpart to this file.

// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export class ChartModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: 'ChartModel',
      _view_name: 'ChartView',
      _model_module: pkg.name,
      _view_module: pkg.name,
      _model_module_version: pkg.version,
      _view_module_version: pkg.version,

      data: [],
      linkData: [],
      nodeData: [],
      ordinalAccessor: '',
      valueAccessor: '',
      groupAccessor: '',
      seriesAccessor: '',
      xAccessor: '',
      yAccessor: '',
      nodeAccessor: '',
      parentAccessor: '',
      sizeAccessor: '',
      joinAccessor: '',
      joinNameAccessor: '',
      markerAccessor: '',
      markerNameAccessor: '',
      latitudeAccessor: '',
      longitudeAccessor: '',
      sourceAccessor: '',
      targetAccessor: '',
      nodeIDAccessor: '',
      mainTitle: '',
      subTitle: '',
      accessibility: {},
      config: {}
    };
  }
}

// Custom View. Renders the widget model.
export class ChartView extends DOMWidgetView {
  // _chart: HTMLElement,

  // Defines how the widget gets rendered into the DOM
  render() {
    this._chart = document.createElement(this.model.get('chartType'));

    var style = document.createElement('style');
    style.innerHTML = `
    html { 
      font-size: 14px;
    }
    .vcc-icon--tiny {
      height: 16px !important;
      width: 16px !important;
    }
    .vcc-ki-icon--tiny {
      height: 16px !important;
      width: 16px !important;
    }
    .visa-viz-keyboard-instructions-button-wrapper {
      padding-top: 4px;
    }
    `;
    document.head.appendChild(style);

    this._chart.data = this.model.get('data');
    this._chart.linkData = this.model.get('linkData');
    this._chart.nodeData = this.model.get('nodeData');
    this._chart.ordinalAccessor = this.model.get('ordinalAccessor');
    this._chart.valueAccessor = this.model.get('valueAccessor');
    this._chart.groupAccessor = this.model.get('groupAccessor');
    this._chart.seriesAccessor = this.model.get('seriesAccessor');
    this._chart.xAccessor = this.model.get('xAccessor');
    this._chart.yAccessor = this.model.get('yAccessor');
    this._chart.nodeAccessor = this.model.get('nodeAccessor');
    this._chart.parentAccessor = this.model.get('parentAccessor');
    this._chart.sizeAccessor = this.model.get('sizeAccessor');
    this._chart.joinAccessor = this.model.get('joinAccessor');
    this._chart.joinNameAccessor = this.model.get('joinNameAccessor');
    this._chart.markerAccessor = this.model.get('markerAccessor');
    this._chart.markerNameAccessor = this.model.get('markerNameAccessor');
    this._chart.latitudeAccessor = this.model.get('latitudeAccessor');
    this._chart.longitudeAccessor = this.model.get('longitudeAccessor');
    this._chart.sourceAccessor = this.model.get('sourceAccessor');
    this._chart.targetAccessor = this.model.get('targetAccessor');
    this._chart.nodeIDAccessor = this.model.get('nodeIDAccessor');
    this._chart.mainTitle = this.model.get('mainTitle');
    this._chart.subTitle = this.model.get('subTitle');
    this._chart.accessibility = this.model.get('accessibility');

    // since we re-render everytime we can simply add event listeners
    // if we get lifecycle involved we will have to check if they exist already or not
    this._chart.addEventListener('clickEvent', this.clickHandler);
    this._chart.addEventListener('hoverEvent', this.hoverHandler);
    this._chart.addEventListener('mouseOutEvent', this.mouseOutHandler);

    Object.keys(this.model.get('config')).forEach(prop => {
      this._chart[prop] = this.model.get('config')[prop];
    });

    this.el.appendChild(this._chart);

    this.data_changed();
    this.accessor_changed();
    this.title_changed();
    this.accessibility_changed();
    this.config_changed();

    // Observe changes in the value traitlet in Python, and define
    // a custom callback.
    this.model.on('change:data', this.data_changed, this);
    this.model.on('change:linkData', this.data_changed, this);
    this.model.on('change:nodeData', this.data_changed, this);
    this.model.on('change:ordinalAccessor', this.accessor_changed, this);
    this.model.on('change:valueAccessor', this.accessor_changed, this);
    this.model.on('change:groupAccessor', this.accessor_changed, this);
    this.model.on('change:seriesAccessor', this.accessor_changed, this);
    this.model.on('change:xAccessor', this.accessor_changed, this);
    this.model.on('change:yAccessor', this.accessor_changed, this);
    this.model.on('change:nodeAccessor', this.accessor_changed, this);
    this.model.on('change:parentAccessor', this.accessor_changed, this);
    this.model.on('change:sizeAccessor', this.accessor_changed, this);
    this.model.on('change:joinAccessor', this.accessor_changed, this);
    this.model.on('change:joinNameAccessor', this.accessor_changed, this);
    this.model.on('change:markerAccessor', this.accessor_changed, this);
    this.model.on('change:markerNameAccessor', this.accessor_changed, this);
    this.model.on('change:latitudeAccessor', this.accessor_changed, this);
    this.model.on('change:longitudeAccessor', this.accessor_changed, this);
    this.model.on('change:sourceAccessor', this.accessor_changed, this);
    this.model.on('change:targetAccessor', this.accessor_changed, this);
    this.model.on('change:nodeIDAccessor', this.accessor_changed, this);
    this.model.on('change:mainTitle', this.title_changed, this);
    this.model.on('change:subTitle', this.title_changed, this);
    this.model.on('change:accessibility', this.accessibility_changed, this);
    this.model.on('change:config', this.config_changed, this);
  }

  clickHandler(e) {
    let d = e.detail && e.detail.data;
    // let t = e.detail && e.detail.target;
    let targetChart = e.target;
    // console.log('chart clicked', e, d, t, targetChart);
    if (d && typeof d == 'object') {
      let index = -1;
      targetChart.clickHighlight.forEach((ele, i) => {
        let keyMatch = [];
        targetChart.innerInteractionKeys.forEach(k => {
          ele[k] == d[k] ? keyMatch.push(true) : keyMatch.push(false);
        });
        keyMatch.every(v => v === true) ? (index = i) : null;
      });
      const newClicks = [...targetChart.clickHighlight];
      if (index > -1) {
        newClicks.splice(index, 1);
      } else {
        newClicks.push(d);
      }
      targetChart.clickHighlight = newClicks;
    }
  }

  hoverHandler(e) {
    let d = e.detail && e.detail.data;
    // let t = e.detail && e.detail.target;
    let targetChart = e.target;
    // console.log('checking hover', e, d ,t, targetChart);
    if (d && typeof d == 'object') {
      targetChart.hoverHighlight = d;
    } else {
      targetChart.hoverHighlight = '';
    }
  }

  mouseOutHandler(e) {
    let targetChart = e.target;
    targetChart.hoverHighlight = '';
  }

  data_changed() {
    this._chart.data = this.model.get('data');
    if (this._chart.data) {
      let regex = /^\d{4}[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])/;
      this._chart.data.forEach(d => {
        Object.keys(d).forEach(k => {
          if (regex.test(d[k])) {
            d[k] = new Date(d[k]);
          }
        });
      });
    }
    this._chart.linkData = this.model.get('linkData');
    // this._chart.nodeData = this.model.get('nodeData');
  }

  accessor_changed() {
    this._chart.ordinalAccessor = this.model.get('ordinalAccessor');
    this._chart.valueAccessor = this.model.get('valueAccessor');
    this._chart.groupAccessor = this.model.get('groupAccessor');
    this._chart.seriesAccessor = this.model.get('seriesAccessor');
    this._chart.xAccessor = this.model.get('xAccessor');
    this._chart.yAccessor = this.model.get('yAccessor');
    this._chart.nodeAccessor = this.model.get('nodeAccessor');
    this._chart.parentAccessor = this.model.get('parentAccessor');
    this._chart.sizeAccessor = this.model.get('sizeAccessor');
    this._chart.joinAccessor = this.model.get('joinAccessor');
    this._chart.joinNameAccessor = this.model.get('joinNameAccessor');
    this._chart.markerAccessor = this.model.get('markerAccessor');
    this._chart.markerNameAccessor = this.model.get('markerNameAccessor');
    this._chart.latitudeAccessor = this.model.get('latitudeAccessor');
    this._chart.longitudeAccessor = this.model.get('longitudeAccessor');
    this._chart.sourceAccessor = this.model.get('sourceAccessor');
    this._chart.targetAccessor = this.model.get('targetAccessor');
    this._chart.nodeIDAccessor = this.model.get('nodeIDAccessor');
  }

  title_changed() {
    this._chart.mainTitle = this.model.get('mainTitle');
    this._chart.subTitle = this.model.get('subTitle');
  }

  accessibility_changed() {
    this._chart.accessibility = this.model.get('accessibility');
  }

  config_changed() {
    Object.keys(this.model.get('config')).forEach(prop => {
      this._chart[prop] = this.model.get('config')[prop];
    });
  }
}
