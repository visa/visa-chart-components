# @visa/charts

This packages bundles [visa chart components](../../) web components into a single build.

### Installation Steps

- Using npm
  ```
  $ npm i @visa/charts
  ```
- Using yarn
  ```
  $ yarn add @visa/charts
  ```

#### Components with `Ready` status in this bundle

- [@visa/bar-chart](../bar-chart)
- [@visa/clustered-bar-chart](../clustered-bar-chart)
- [@visa/stacked-bar-chart](../stacked-bar-chart)
- [@visa/line-chart](../line-chart)
- [@visa/pie-chart](../pie-chart)
- [@visa/scatter-plot](../scatter-plot)
- [@visa/heat-map](../heat-map)
- [@visa/circle-packing](../circle-packing)
- [@visa/parallel-plot](../parallel-plot)
- [@visa/dumbbell-plot](../dumbbell-plot)
- [@visa/world-map](../world-map)
- [@visa/visa-charts-data-table](../data-table)

#### Components with `Development` status

- [@visa/alluvial-diagram](../alluvial-diagram)

<hr>

### <a name="how_to" href="#how_to">#</a> How to use the @visa/charts web component bundle in different environments

Walk throughs included below:

- [Web component in javascript](#web_components)
- [Web component in react](#web_components_react)
- [Web component in angular](#web_components_angular)

<br>

#### <a name="web_components" href="#web_components">#</a> Web component in javascript [^](#how_to)

Step 1: Install `yarn add @visa/charts`

Step 2: Mount components to the window

```html
// in your index.html
<script src="./node_modules/@visa/charts/dist/charts.js"></script>
```

```js
// or if you take advantage of ES modules, you can use below:
import { defineCustomElements } from '@visa/charts/dist/loader';
defineCustomElements(window);
```

Step 3 (Optional): Build a function for dynamic prop assignment

```js
// this function is optional, it makes assigning props easier and dynamic
function assignChartProps(chart, props) {
  Object.keys(props).forEach(prop => {
    chart[prop] = props[prop];
  });
}

// example props object
var props = {
  data: [
    { month: 'Apr 17', value: 1407543 },
    { month: 'May 17', value: 6042320 },
    { month: 'Jun 17', value: 3234002 },
    { month: 'Jul 17', value: 2221233 },
    { month: 'Aug 17', value: 4476321 },
    { month: 'Sep 17', value: 3789221 },
    { month: 'Oct 17', value: 6543535 },
    { month: 'Nov 17', value: 7457432 },
    { month: 'Dec 17', value: 2636346 },
    { month: 'Jan 18', value: 2340000 },
    { month: 'Feb 18', value: 3202340 },
    { month: 'Mar 18', value: 8503536 }
  ],
  valueAccessor: 'value',
  ordinalAccessor: 'month'
};
```

Step 4: Leverage the components using the pattern/method of your choice

```js
// in your JS file

// vanilla method
const barChart = document.getElementById('bar-chart');
assignChartProps(barChart, props); // custom function from Step 3

// templating method
const chartTemplate = document.getElementById('bar-chart-template').content;
const templateBarChart = chartTemplate.firstElementChild;
assignChartProps(templateBarChart, props); // custom function from Step 3
document.body.appendChild(chartTemplate);

// jquery method
const jqueryBarChart = $('#bar-chart')[0];
assignChartProps(jqueryBarChart, props); // custom function from Step 3
```

```html
<!-- in your HTML file -->

<!-- Vanilla Element -->
<bar-chart id="bar-chart" />

<!-- Vanilla Template -->
<template id="bar-chart-template">
  <bar-chart />
</template>
```

#### <a name="web_components_react" href="#web_components_react">#</a> Web component in react [^](#how_to)

Step 1: Install `yarn add @visa/charts`

Step 2: Mount the custom web components to the window

```js
// in your index.js or some other high level component
...
import { defineCustomElements as defineChartLib } from '@visa/charts/dist/loader';
...
ReactDOM.render(<App />, document.getElementById('root'));
defineChartLib(window);
...
```

Step 3: Add the required util to your project for passing props

```js
// we usually put this in our src/utils folder and export it
export function wc(customEvents = {}, props = {}) {
  let storedEl;

  return function(el) {
    Object.entries(customEvents).forEach(([name, value]) => {
      // If we have an element then add event listeners
      // otherwise remove the event listener
      const action = el ? el.addEventListener : storedEl.removeEventListener;
      if (typeof value === 'function') {
        action(name, value);
        return;
      }
    });
    // If we have an element then set props
    if (el) {
      Object.entries(props).forEach(([name, value]) => {
        el[name] = value;
      });
    }
    storedEl = el;
  };
}
```

Step 4: Leverage the web components directly in React

```js
// we usually create a local component within our project
// note: you can also apply step 2 directly within the local component if you choose
import React from 'react';
import { wc } from '../utils/wc'; // eslint-disable-line spellcheck/spell-checker
import { defineCustomElements as defineChartLib, applyPolyfills } from '@visa/charts/dist/loader'; // remove this line if you did step 2

/**
 * BarChart
 */
class BarChart extends React.Component {
  /**
   * ensure that the chart components required are available in the window
   */
  // remove this stuff if you did step 2
  componentWillMount() {
    if (!(window.customElements || {}).get('bar-chart')) {
      // if you need stencil's polyfills
      applyPolyfills().then(() => defineChartLib(window));

      // or, if you don't need polyfill
      // defineChartLib(window);
    }
  }

  /**
   * @returns {child} the stencil data visualization component
   */
  render() {
    return <bar-chart ref={wc({}, { ...this.props })} />;
  }
}

BarChart.defaultProps = {};

export default BarChart;
```

#### <a name="web_components_angular" href="#web_components_angular">#</a> Web component in angular [^](#how_to)

Step 1: Install `yarn add @visa/charts`

Step 2: Mount the custom web components to the window

```js
// in main.ts of project or any appropriate .ts file (ideally this only should be called once, during bootstrapping)
import { enableProdMode } from '@angular/core';
// ...
import { defineCustomElements, applyPolyfills } from '@visa/charts/dist/loader';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));

// if you need stencil's polyfills
applyPolyfills().then(() => defineCustomElements(window));

// or, if you don't need polyfill
// defineCustomElements(window);
```

Step 3: Add the required schema to your project for using custom web components

```js
// in a module.ts that includes any components
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
// ...
@NgModule({
    imports: [],
    // ...
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
// ...
```

Step 4: Leverage the web components directly in Angular

```js
// in component.ts

import { Component, OnInit, ViewChild, ElementRef, OnChanges } from '@angular/core';
// the following import only needs to be called if this was
// not done in the earlier bootstrapping step
import { defineCustomElements } from '@visa/charts/dist/loader';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html'
})
export class BarChartComponent implements OnInit, OnChanges {
  // we will only pass a single object, with all props as properties
  props = {
    ordinalAccessor: 'month',
    valueAccessor: 'value',
    data: [
      { month: 'Apr 17', value: 1407543 },
      { month: 'May 17', value: 6042320 },
      { month: 'Jun 17', value: 3234002 },
      { month: 'Jul 17', value: 2221233 },
      { month: 'Aug 17', value: 4476321 },
      { month: 'Sep 17', value: 3789221 },
      { month: 'Oct 17', value: 6543535 },
      { month: 'Nov 17', value: 7457432 },
      { month: 'Dec 17', value: 2636346 },
      { month: 'Jan 18', value: 2340000 },
      { month: 'Feb 18', value: 3202340 },
      { month: 'Mar 18', value: 8503536 }
    ]
  };
  @ViewChild('chart') chart: ElementRef;
  constructor() {
    // the following binding to the window only needs to be called
    // if this was not done in the earlier bootstrapping step
    defineCustomElements(window);
  }
  ngOnInit() {
    // our components watch for state change, so this simply binds the properties
    Object.keys(this.props).forEach(key => {
      this.chart.nativeElement[key] = this.props[key];
    });
  }
  ngOnChanges() {
    // if props change, we reassign properties to trigger internal state change
    Object.keys(this.props).forEach(key => {
      this.chart.nativeElement[key] = this.props[key];
    });
  }
}
```

```html
<!-- in component.html -->

<bar-chart #chart [props]="props"> </bar-chart>
```
