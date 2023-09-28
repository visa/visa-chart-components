# @visa/charts-vue

This package bundles [visa chart components](../../) web components and exports them as vue components. We leverage [stencil's vue bindings](https://stenciljs.com/docs/framework-bindings) in the creation of @visa/charts-vue.

---

### Installation Steps

- Using npm
  ```
  $ npm i @visa/charts-vue
  ```
- Using yarn
  ```
  $ yarn add @visa/charts-vue
  ```

---

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
- [@visa/alluvial-diagram](../alluvial-diagram)
- [@visa/visa-charts-data-table](../data-table)
- [@visa/keyboard-instructions](packages/keyboard-instructions)

<!-- #### Components with `Development` status -->
<hr>

#### <a name="vue_components" href="#vue_components">#</a> Use VCC as vue components

Step 1: Install `yarn add @visa/charts-vue`

Step 2: Use component as any other Vue component

```js
// in App.vue
import { BarChart, VisaChartsDataTable } from '@visa/charts-vue';

<BarChart
  mainTitle="BarChart"
  subTitle="Vertical (default) bar chart example"
  :data="data"
  ordinalAccessor="month"
  valueAccessor="value"
  :height="400"
  :width="600"
/>;

// OR, use as a plugin

// in main.js
import { ComponentLibrary } from '@visa/charts-vue';
createApp(App).use(ComponentLibrary).mount('#app');

// in App.vue
<bar-chart
  mainTitle="BarChart"
  subTitle="Vertical (default) bar chart example"
  :data="data"
  ordinalAccessor="month"
  valueAccessor="value"
  :height="400"
  :width="600"
/>;
```
