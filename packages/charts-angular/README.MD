# @visa/charts-angular

This package bundles [visa chart components](../../) web components and exports them as angular components. We leveage [stencil's angular bindings](https://stenciljs.com/docs/framework-bindings) in the creation of @visa/charts-angular.

### Installation Steps

- Using npm
  ```
  $ npm i @visa/charts-angular
  ```
- Using yarn
  ```
  $ yarn add @visa/charts-angular
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

#### <a name="angular_components" href="#angular_components">#</a> Use VCC as angular components

Step 1: Install `yarn add @visa/charts-angular`

Step 2: Use component as any other Angular component

```js
// in component.ts

public props = {
    ordinalAccessor: 'month',
    valueAccessor: 'value',
    data: [
        {'month': 'Apr 17', 'value': 1407543},
        {'month': 'May 17', 'value': 6042320},
        {'month': 'Jun 17', 'value': 3234002},
        {'month': 'Jul 17', 'value': 2221233},
        {'month': 'Aug 17', 'value': 4476321},
        {'month': 'Sep 17', 'value': 3789221},
        {'month': 'Oct 17', 'value': 6543535},
        {'month': 'Nov 17', 'value': 7457432},
        {'month': 'Dec 17', 'value': 2636346},
        {'month': 'Jan 18', 'value': 2340000},
        {'month': 'Feb 18', 'value': 3202340},
        {'month': 'Mar 18', 'value': 8503536}
    ]
}
```

```html
<!-- in component.html -->
<bar-chart [ordinalAccessor]="props.ordinalAccessor" [valueAccessor]="props.valueAccessor" [data]="props.data">
</bar-chart>
```
