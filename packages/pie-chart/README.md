# @visa/pie-chart

![An image depicting an example of the default pie-chart component](./docs/pie-chart-1.png 'Example image of a pie chart')
<br>

```js
<pie-chart
  accessibility = {...}
  data = {[{"label":"2018 Market Share","value":3126000},{data}]}
  valueAccessor = {"value"}
  ordinalAccessor = {"label"}
/>
```

<br>

<details open="open">
  <summary>Jump To:</summary>
  <ol>
    <li>
      <a href="#installation-steps">Installation Steps</a>
    </li>
    <li>
      <a href="#props-documentation">Props Documentation</a>
      <ul>
        <li><a href="#base-props">Base Props </a></li>
        <li><a href="#data-props">Data Props</a></li>
        <li><a href="#accessibility-props">Accessibility Props</a></li>
        <li><a href="#annotation-props">Annotation Props</a></li>
        <li><a href="#event-props">Event Props</a></li>
        <li><a href="#label-props">Label Props</a></li>
        <li><a href="#margin-and-padding-props">Margin & Padding Props</a></li>
        <li><a href="#style-props">Style Props</a></li>
        <li><a href="#reference-line-props">Reference Line Props</a></li>
      </ul>
    </li>
  </ol>
</details>
<br>

## <a name="installation-steps">#</a> Installation Steps

---

- Using npm

  ```
  $ npm i @visa/pie-chart
  ```

- Using yarn
  ```
  $ yarn add @visa/pie-chart
  ```

<br>

## <a name="props-documentation">#</a> Props Documentation

---

<br>

### <a name="base-props" href="#base-props">#</a> Base Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name                  | Type          | Default Value(s)                   | Description                                                                                                                                        |
| --------------------- | ------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `height`              | number        | 325                                | Height in px of the chart container                                                                                                                |
| `width`               | number        | 600                                | Width in px of the chart container                                                                                                                 |
| `mainTitle`           | string        | 'Pie Chart Title'                  | The `dynamic` tag of title for the chart (or you can create your own separately). See `highestHeadingLevel` prop for how tags get assigned.        |
| `subTitle`            | string        | 'This is the pie chart's subtitle' | The `dynamic` tag for a sub title for the chart (or you can create your own separately). See `highestHeadingLevel` prop for how tags get assigned. |
| `centerTitle`         | string        | ''                                 | If specified, adds a main title to the center of the donut chart.                                                                                  |
| `centerSubTitle`      | string        | ''                                 | If specified, adds a subtitle to the center of the donut chart.                                                                                    |
| `highestHeadingLevel` | string/number | 'h2'                               | Sets the heading level (which also sets sublevels) for the chart. "p", "span", and "div" are also valid.                                           |

<br>
<br>

### <a name="data-props" href="#data-props">#</a> Data Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name              | Type     | Default Value(s) | Description                                                                                                              |
| ----------------- | -------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `data`            | object[] | `undefined`      | Data used to create chart, an array of objects which includes keys that map to accessors.                                |
| `uniqueID`        | string   | `undefined`      | ID used to identify chart (must be unique per chart), helpful for validation messages. Defaults to UUID v4 standard.     |
| `ordinalAccessor` | string   | 'label'          | Key used to determine chart's categorical property.                                                                      |
| `valueAccessor`   | string   | 'value'          | Key used to determine chart's numeric property.                                                                          |
| `sortOrder`       | boolean  | false            | Sorts slices into ascending or descending order, or clears all sorting. (`'asc'`, `'desc'`, `''` are only valid values). |

<br>
<br>

### <a name="accessibility-props" href="#accessibility-props">#</a> Accessibility Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name            | Type                 | Default Value(s)                                 | Description                                                                           |
| --------------- | -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `accessibility` | object (custom type) | [IAccessibilityType](../types/src/prop-types.ts) | Manages messages and settings for chart accessibility, _see object definition below_. |

<br>

#### IAccessibilityType Definition

| Name (accessibility.)        | Type                                     | Default Value(s)      | Description                                                                                                                                                                                                                |
| ---------------------------- | ---------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `longDescription`            | string                                   | ''                    | Use this to add a helpful description of the chart.                                                                                                                                                                        |
| `executiveSummary`           | string                                   | ''                    | Use this to describe the biggest takeaway of the chart.                                                                                                                                                                    |
| `purpose`                    | string                                   | ''                    | Use this to describe the purpose of this particular chart.                                                                                                                                                                 |
| `contextExplanation`         | string                                   | ''                    | Use this to explain any controls or content on your page that affect or are affected by this chart.                                                                                                                        |
| `title`                      | string                                   | ''                    | Gives the chart an alternate title to be used by screen readers.                                                                                                                                                           |
| `elementDescriptionAccessor` | string                                   | ''                    | Optional key used to add an additional description to any element, from your data.                                                                                                                                         |
| `statisticalNotes`           | string                                   | ''                    | Use this to provide any statistical explanations, such as trends, clusters, patterns, or outliers.                                                                                                                         |
| `structureNotes`             | string                                   | ''                    | Use this to describe special visual features of the chart, such as sorting, color grouping, etc.                                                                                                                           |
| `includeDataKeyNames`        | boolean                                  | false                 | If true, includes data key names in voice over description of each element. EG "Year over year growth: 5.6%" instead of just "5.6%"                                                                                        |
| `hideDataTableButton`        | boolean                                  | false                 | If true, hides the data table button (but it is still available to screen reader users).                                                                                                                                   |
| `disableValidation`          | boolean                                  | false                 | If true, disables validations of accessibility props for this chart. Validation is intended to be used during development; upon completion, validation should be disabled.                                                 |
| `elementsAreInterface`       | any/boolean                              | null                  | Defaults to null. Set to true if interacting with the elements in this chart affects your application. Otherwise, must be set to false.                                                                                    |
| `onChangeFunc`               | function                                 | `undefined`           | Custom event listener (changeFunc) that enables dev to control accessibility page experience when chart data updates.                                                                                                      |
| `showSmallLabels`            | boolean                                  | false                 | Defaults to false. Set to true if you would like to display labels on small elements that are likely to overlap. Note, this could impact accessibility of your graphic.                                                    |
| `hideStrokes`                | boolean                                  | false                 | Defaults to false. Set to true if you would like to remove automated stroke outlines from the chart, note, this could impact accessibility of your graphic.                                                                |
| `hideTextures`               | boolean                                  | false                 | Defaults to false. Set to true if you would like to remove textures from the chart, note, this could impact accessibility of your graphic.                                                                                 |
| `keyboardNavConfig`          | [IKeyConfig](../types/src/prop-types.ts) | `{ disabled: false }` | Defaults disabled to false. May be set to true if `accessibility.elementsAreInterface = false` and `suppressEvents = true`. This will disable keyboard navigation and simplify chart instructions for screen reader users. |
| `showExperimentalTextures`   | boolean                                  | false                 | Defaults to false. Set to true if you would like leverage our textures which are still undergoing research and development.                                                                                                |

<br>

```js
// accessibility = { ...accessibility, onChangeFunc: d => changeHandler(d)}
// example of setting updates on page based on changeFunc custom events
const changeHandler = d => {
  if (d.updated && (d.removed || d.added)) {
    let updates = 'The pie chart has ';
    if (d.removed) {
      updates += 'removed ' + d.removed + ' slice' + (d.removed > 1 ? 's ' : ' ');
    }
    if (d.added) {
      updates += (d.removed ? 'and ' : '') + 'added ' + d.added + (d.removed ? '' : d.added > 1 ? ' slices' : ' slice');
    }
    setChartUpdates(updates);
  } else if (d.updated) {
    const newUpdate = "The chart's data has changed, but no slices were removed or added.";
    setChartUpdates(
      newUpdate !== chartUpdates
        ? newUpdate
        : "The chart's data has changed again, but no slices were removed or added."
    );
  }
};
```

<br>
<br>

### <a name="annotation-props" href="#annotation-props">#</a> Annotation Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name          | Type                 | Default Value(s) | Description                                                                                             |
| ------------- | -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------- |
| `annotations` | array[{annotations}] | []               | Adds annotations to the chart, see [d3-svg-annotation](https://d3-annotation.susielu.com/) by Susie Lu. |

<br>

#### annotations object definition

`annotations` is an array of objects which needs to have the following properties within them. See the detailed api specifications from [d3-svg-annotation](https://d3-annotation.susielu.com/#api), along with additional properties layered on top of that work, documented below.

| Name                       | Type   | Default Value(s) | Description                                                                    |
| -------------------------- | ------ | ---------------- | ------------------------------------------------------------------------------ |
| `accessibilityDescription` | string | `undefined`      | Sets the accessibility description for the annotation for screen reader users. |

<br>
<br>

### <a name="event-props" href="#event-props">#</a> Event Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

[Events in stencil.js](https://stenciljs.com/docs/events) dispatch [Custom DOM events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for other components to handle, we use Stencil's @Event() decorator to emit events (click, hover, mouseOut) from end user activity on our charts.

| Name                   | Type                 | Default Value(s)                              | Description                                                                                                                                                                                                                                                                                                                     |
| ---------------------- | -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `suppressEvents`       | boolean              | false                                         | Suppresses and disables click, hover and mouseOut event emitters. Setting to true can increase performance for non-interactive charts.                                                                                                                                                                                          |
| `cursor`               | string               | 'default'                                     | Changes pointer type during mouse over on elements. Valid values are 'default' or 'pointer'.                                                                                                                                                                                                                                    |
| `onClickEvent`         | function             | `undefined`                                   | When clickEvent event occurs (e.g., mouse/keyboard click on chart geometry), this event handler will be called with the custom event object (e.g., e), containing data and target node at e.detail `{data: d, target: n}`. You will need to construct your own functionality of what actions to take within the callback.       |
| `clickHighlight`       | object[]             | []                                            | Data used to track chart selections, an array of objects which includes keys that map to above accessors.                                                                                                                                                                                                                       |
| `clickStyle`           | object (custom type) | [IClickStyleType](../types/src/prop-types.ts) | Sets the styling of elements when they are selected, _see object definition below_.                                                                                                                                                                                                                                             |
| `onHoverEvent`         | function             | `undefined`                                   | When hoverEvent event occurs (e.g., mouse hover/keyboard focus on chart geometry), this event handler will be called with the custom event object (e.g., e), containing data and target node at e.detail `{data: d, target: n}`. You will need to construct your own functionality of what actions to take within the callback. |
| `onMouseOutEvent`      | function             | `undefined`                                   | When mouseOutEvent event occurs (e.g., mouse/keyboard blur on chart geometry), this event handler will be called, and has no data object. You will need to construct your own functionality of what actions to take within the callback.                                                                                        |
| `hoverHighlight`       | object               | {}                                            | Datum object used to track active chart element, the object should include keys that map to above accessors.                                                                                                                                                                                                                    |
| `hoverStyle`           | object (custom type) | [IHoverStyleType](../types/src/prop-types.ts) | Sets the styling of elements when they are hovered/focused, _see object definition below_.                                                                                                                                                                                                                                      |
| `interactionKeys`      | string[]             | []                                            | Sets the column names of data to interact with.                                                                                                                                                                                                                                                                                 |
| `hoverOpacity`         | number               | 1                                             | Sets opacity of inactive elements when hovering/focused on a chart geometry.                                                                                                                                                                                                                                                    |
| `onInitialLoadEvent`   | function             | `undefined`                                   | When initalLoad event occurs (e.g., chart is mounted to window), this event handler will be called with the custom event object (e.g., e), containing the corresponding chartID at e.detail. You will need to construct your own functionality of what actions to take within the callback.                                     |
| `onDrawStartEvent`     | function             | `undefined`                                   | When drawStart event occurs (e.g., chart render function is called), this event handler will be called with the custom event object (e.g., e), containing the corresponding chartID at e.detail. You will need to construct your own functionality of what actions to take within the callback.                                 |
| `onDrawEndEvent`       | function             | `undefined`                                   | When drawEnd event occurs (e.g., chart's stencil lifecycle completes), this event handler will be called with the custom event object (e.g., e), containing the corresponding chartID at e.detail. You will need to construct your own functionality of what actions to take within the callback.                               |
| `onTransitionEndEvent` | function             | `undefined`                                   | When transitionEnd event occurs (e.g., chart geometry's transition lifecycle completes), this event handler will be called with the custom event object (e.g., e), containing the corresponding chartID at e.detail. You will need to construct your own functionality of what actions to take within the callback.             |

<br>

#### IClickStyleType Definition

| Name          | Type   | Default Value(s) | Description                                                                                  |
| ------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `color`       | string | ''               | Sets the color of the clicked element (requires clickHighlight to be valid and sent).        |
| `strokeWidth` | number | 2                | Sets the stroke width of the clicked element (requires clickHighlight to be valid and sent). |

<br>

#### IHoverStyleType Definition

| Name          | Type   | Default Value(s) | Description                                                                                  |
| ------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `color`       | string | ''               | Sets the color of the hovered element (requires hoverHighlight to be valid and sent).        |
| `strokeWidth` | number | 2                | Sets the stroke width of the hovered element (requires hoverHighlight to be valid and sent). |

```js
// example of interactivity code
// note this only tracks a single click, you need your own logic to build the array of currnet selections made by user and then pass that result back to chart
//...
const clickHandler = evt => {
  const d = evt.detail.data; // data is located here
  const t = evt.detail.target; // chart mark/label clicked is located here

  this.currentClickedElement = [d]; // this is passed to clickHighlight prop
};

const hoverHandler = evt => {
  const d = evt.detail.data; // data is located here
  const t = evt.detail.target; // chart mark/label clicked is located here

  this.currentHoveredElement = d; // this is passed to hoverHighlight prop
};

const mouseOutHandler = evt => {
  this.currentHoveredElement = ''; // this is passed to hoverHighlight prop
};

// an example of calling these from within a stencil.js component
<pie-chart
  data={[{ data }]}
  valueAccessor={'value'}
  ordinalAccessor={'label'}
  interactionKeys={['label']}
  onClickEvent={this.onClickEvent}
  clickHighlight={this.currentClickedElement}
  clickStyle={this.clickStyle}
  onHoverEvent={this.onHoverEvent}
  onMouseOutEvent={this.onMouseOut}
  hoverHighlight={this.currentHoveredElement}
  hoverStyle={this.hoverStyle}
/>;
//...
```

<br>
<br>

### <a name="label-props" href="#label-props">#</a> Label Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name             | Type                 | Default Value(s)                                | Description                                                                                  |
| ---------------- | -------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `dataLabel`      | object (custom type) | [IDataLabelType](../types/src/prop-types.ts)    | Controls visibility, styling and placement of data labels, _see object definition below_.    |
| `labelOffset`    | number               | 25                                              | Sets distance of labels from chart.                                                          |
| `showLabelNote`  | boolean              | true                                            | When selected, displays label notes.                                                         |
| `showPercentage` | boolean              | true                                            | When selected, displays data label value as a percentage of the whole.                       |
| `showTooltip`    | boolean              | true                                            | Toggles whether to display the tooltip on hover/focus on chart geometries.                   |
| `tooltipLabel`   | object (custom type) | [ITooltipLabelType](../types/src/prop-types.ts) | Controls visibility, content and format of the chart tooltip, _see object definition below_. |

<br>

#### IDataLabelType Definition

| Name                | Type    | Default Value(s) | Description                                                                                                                                                                                                                                                |
| ------------------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor`     | string  | ''               | Key used to determine label's property.                                                                                                                                                                                                                    |
| `visible`           | boolean | true             | Toggles the visibility (opacity) of the data labels.                                                                                                                                                                                                       |
| `placement`         | string  | 'outside'        | Sets the placement of the data label, accepts 'outside', 'inside' or 'edge'. Placement option 'auto' leverages the [resolveLabelCollision](../utils#resolve-label-collision) algorithm and places labels without overlaps in available space on the chart. |
| `format`            | string  | 'normalized'     | Sets the formatting for the data labels, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/).                                                                                                   |
| `collisionHideOnly` | boolean | false            | Toggles whether to run [resolveLabelCollision](../utils#resolve-label-collision) algorithm and hide labels if collision is detected (vs hide and then place). This is overridden by placement being set to `auto`.                                         |

<br>

#### ITooltipLabelType Definition

| Name            | Type     | Default Value(s) | Description                                                                                                                                                                 |
| --------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor` | string[] | []               | An array that determines which property of the data is displayed in the tooltip.                                                                                            |
| `labelTitle`    | string[] | []               | An array that sets the title for each data property in the tooltip.                                                                                                         |
| `format`        | string   | ''               | Sets the formatting for the data properties in the tooltip, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |

<br>
<br>

### <a name="margin-and-padding-props" href="#margin-and-padding-props">#</a> Margin & Padding Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name      | Type                 | Default Value(s)                            | Description                                                                                                                                     |
| --------- | -------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin`  | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Margin between the subtitle and the chart area, or between the title and chart area if no subtitle is specified, _see object definition below_. |
| `padding` | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Padding between edge and the chart area, _see object definition below_.                                                                         |

<br>

#### IBoxModelType Definition

| Name     | Type   | Default Value(s) | Description                                             |
| -------- | ------ | ---------------- | ------------------------------------------------------- |
| `top`    | number | height \* 0.01   | Sets the top margin/padding for the chart container.    |
| `bottom` | number | height \* 0.01   | Sets the bottom margin/padding for the chart container. |
| `left`   | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |
| `right`  | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |

<br>
<br>

### <a name="style-props" href="#style-props">#</a> Style Props [<>](./src/components/pie-chart/pie-chart.tsx 'Source')

| Name           | Type     | Default Value(s) | Description                                                                                         |
| -------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| `colorPalette` | string   | 'single_blue'    | Included color palettes can be found in our [color utility](../utils#colors). Overridden by colors. |
| `colors`       | string[] | `undefined`      | Accepts array of color strings or color values to customize colors beyond our palettes.             |
| `innerRatio`   | number   | 0.7              | Sets the size of the filled circle in the middle of the pie as a proportion of the total pie.       |
| `showEdgeLine` | boolean  | false            | Displays edge line around each section.                                                             |

<br>
<br>

### <a name="reference-line-props" href="#reference-line-props">#</a> Reference Line Props _Deprecated_[<>](./src/components/pie-chart/pie-chart.tsx 'Source')

The referenceLines and referenceStyle props are currently deprecated and will ultimately be fully replaced with the annotation prop. For the time being, this prop will work, but will also not pass accessibility requirements.

| Name             | Type                 | Default Value(s)                                  | Description                                                                                                                   |
| ---------------- | -------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `referenceLines` | object[]             | []                                                | Data that sets the location and labeling of the reference line                                                                |
| `referenceStyle` | object (custom type) | [IReferenceStyleType](../types/src/prop-types.ts) | Sets the styling of reference line(s) placed on the chart, _see object definition below_. #### IReferenceStyleType Definition |

#### IReferenceStyleType Definition

| Name          | Type   | Default Value(s) | Description                                                             |
| ------------- | ------ | ---------------- | ----------------------------------------------------------------------- |
| `color`       | string | 'pri_grey'       | Sets the color of the reference line.                                   |
| `strokeWidth` | number | 1                | Sets the stroke width of the reference line.                            |
| `opacity`     | number | 1                | Sets the opacity of the reference line.                                 |
| `dashed`      | string | ''               | Sets the dash array property of the path element of the reference line. |

<br>

#### referenceLines object definition

`referenceLines` is an array of objects which needs to have the following properties within them.

| Name                       | Type   | Default Value(s) | Description                                                     |
| -------------------------- | ------ | ---------------- | --------------------------------------------------------------- |
| `label`                    | string | `undefined`      | Sets the label to show for the reference line.                  |
| `labelPlacementHorizontal` | string | `undefined`      | Sets the horizontal label placement for the reference line.     |
| `labelPlacementVertical`   | string | `undefined`      | Sets the vertical label placement for the reference line.       |
| `value`                    | number | `undefined`      | Sets the value where to place the reference line, per the axis. |
