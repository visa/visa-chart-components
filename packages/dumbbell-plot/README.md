# @visa/dumbbell-plot

---

![An image depicting an example of the default dumbbell-plot component](./docs/dumbbell-plot-1.png 'Example image of a dumbbell plot')
<br>

```js
<dumbbell-plot
  accessibility = {...}
  data = {[{"date":"2016-01-01T00:00:00.000Z","category":"Card A","value":7670994739,"offset":-8},{data}]}
  valueAccessor = {"value"}
  ordinalAccessor = {"date"}
  seriesAccessor = {"category"}
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
        <li><a href="#axis-props">Axis Props</a></li>
        <li><a href="#bar-and-marker-props">Bar & Marker Props</a></li>
        <li><a href="#event-props">Event Props</a></li>
        <li><a href="#label-props">Label Props</a></li>
        <li><a href="#margin-and-padding-props">Margin & Padding Props</a></li>
        <li><a href="#style-props">Style Props</a></li>
        <li><a href="#reference-line-props">Reference Line Props</a></li>
        <li><a href="#unit-test-props">Unit Testing Props</a></li>
      </ul>
    </li>
  </ol>
</details>
<br>

## <a name="installation-steps">#</a> Installation Steps

---

- Using npm

  ```
  $ npm i @visa/dumbbell-plot
  ```

- Using yarn
  ```
  $ yarn add @visa/dumbbell-plot
  ```

<br>

## <a name="props-documentation">#</a> Props Documentation

---

<br>

### <a name="base-props" href="#base-props">#</a> Base Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name                  | Type          | Default Value(s)                       | Description                                                                                                                                                                            |
| --------------------- | ------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `height`              | number        | 300                                    | Height in px of the chart container                                                                                                                                                    |
| `width`               | number        | 650                                    | Width in px of the chart container                                                                                                                                                     |
| `mainTitle`           | string        | 'Dumbbell Plot Title'                  | The `dynamic` tag of title for the chart (or you can create your own separately). See `highestHeadingLevel` prop for how tags get assigned.                                            |
| `subTitle`            | string        | 'This is the dumbbell plot's subtitle' | The `dynamic` tag for a sub title for the chart (or you can create your own separately). See `highestHeadingLevel` prop for how tags get assigned.                                     |
| `highestHeadingLevel` | string/number | 'h2'                                   | Sets the heading level (which also sets sublevels) for the chart. "p", "span", and "div" are also valid.                                                                               |
| `layout`              | string        | 'vertical'                             | Displays dumbbells in chart vertically or horizontally. (`vertical` and `horizontal` are the only valid inputs). If ordinalAccessor is a date, dumbbells will only display vertically. |

<br>
<br>

### <a name="data-props" href="#data-props">#</a> Data Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name              | Type     | Default Value(s) | Description                                                                                                                                           |
| ----------------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ordinalAccessor` | string   | 'date'           | Key used to determine dumbbell's categorical property.                                                                                                |
| `valueAccessor`   | string   | 'value'          | Key used to determine dumbbell's numeric property.                                                                                                    |
| `seriesAccessor`  | string   | 'category'       | Key used to determine dumbbell's series.                                                                                                              |
| `uniqueID`        | string   | `undefined`      | ID used to identify chart (must be unique per chart), helpful for validation messages. Defaults to UUID v4 standard.                                  |
| `data`            | object[] | `undefined`      | Data used to create chart, an array of objects which includes keys that map to above accessors.                                                       |
| `sortOrder`       | string   | ''               | Sets bar sort order. Accepts `'asc'`, `'desc'`, `'diffAsc'` , `'diffDesc'` , `'focusAsc'`, `'focusDesc'`, `'absoluteDiffAsc'`, `'absoluteDiffDesc'` . |

<br>
<br>

### <a name="accessibility-props" href="#accessibility-props">#</a> Accessibility Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

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
    let updates = 'The dumbbell chart has ';
    if (d.removed) {
      updates += 'removed ' + d.removed + ' bar' + (d.removed > 1 ? 's ' : ' ');
    }
    if (d.added) {
      updates += (d.removed ? 'and ' : '') + 'added ' + d.added + (d.removed ? '' : d.added > 1 ? ' bars' : ' bar');
    }
    setChartUpdates(updates);
  } else if (d.updated) {
    const newUpdate = "The chart's data has changed, but no bars were removed or added.";
    setChartUpdates(
      newUpdate !== chartUpdates ? newUpdate : "The chart's data has changed again, but no bars were removed or added."
    );
  }
};
```

<br>
<br>

### <a name="annotation-props" href="#annotation-props">#</a> Annotation Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

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

### <a name="axis-props" href="#axis-props">#</a> Axis Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name               | Type                 | Default Value(s)                        | Description                                                             |
| ------------------ | -------------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| `xAxis`            | object (custom type) | [IAxisType](../types/src/prop-types.ts) | Manages settings for the chart's x axis, _see object definition below_. |
| `yAxis`            | object (custom type) | [IAxisType](../types/src/prop-types.ts) | Manages settings for the chart's y axis, _see object definition below_. |
| `minValueOverride` | number               | `undefined`                             | Overrides the calculated default min value.                             |
| `maxValueOverride` | number               | `undefined`                             | Overrides the calculated default max value.                             |
| `showBaselineX`    | boolean              | false                                   | When selected and layout = vertical, shows the x baseline               |
| `showBaselineY`    | boolean              | false                                   | When selected and layout = horizontal, shows the y baseline             |
| `wrapLabel`        | boolean              | true                                    | When selected, wraps the ordinal axis labels.                           |

<br>

#### IAxisType Definition

| Name (xAxis./yAxis.) | Type    | Default Value(s)               | Description                                                                                                                                            |
| -------------------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `visible`            | boolean | true                           | Toggles the visibility of the axis.                                                                                                                    |
| `gridVisible`        | boolean | true                           | Toggles the visibility of the axis grid.                                                                                                               |
| `label`              | string  | 'X Axis'                       | Sets the label for the axis.                                                                                                                           |
| `unit`               | string  | '' or 'month'                  | Sets the unit of padding for the axis when accessor is a date.                                                                                         |
| `format`             | string  | '' or '%b %y' or '0[.][0][0]a' | Sets the formatting for axis elements, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |
| `tickInterval`       | number  | 1                              | Can be used to reduce the frequency of axis ticks. This number sets the interval of axis ticks that are shown.                                         |

<br>
<br>

### <a name="bar-and-marker-props" href="#bar-and-marker-props">#</a> Bar & Marker Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name          | Type                 | Default Value(s)                               | Description                                                                                                              |
| ------------- | -------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `barStyle`    | object (custom type) | [IBarStyleType](../types/src/prop-types.ts)    | Set styling for the dumbbell's bar, _see object definition below_.                                                       |
| `marker`      | object (custom type) | [IMarkerStyleType](../types/src/prop-types.ts) | Sets the visibility, type, and size of the bar marker, _see object definition below_.                                    |
| `focusMarker` | object (custom type) | [IFocusStyleType](../types/src/prop-types.ts)  | Optional. Specifies the key value and size to focus one marker (based on seriesAccessor), _see object definition below_. |

<br>

#### IBarStyleType Definition

| Name (barStyle.) | Type   | Default Value(s) | Description                                                                                  |
| ---------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `colorRule`      | string | 'default'        | Sets the color rule for the dumbbell bar (options are 'greaterValue', 'focus' or 'default'). |
| `opacity`        | number | 1                | Sets the opacity of the dumbbell bar.                                                        |
| `width`          | number | 1                | Sets the width of the dumbbell bar.                                                          |

<br>

#### IMarkerStyleType Definition

| Name (marker.) | Type    | Default Value(s) | Description                              |
| -------------- | ------- | ---------------- | ---------------------------------------- |
| `type`         | string  | 'dot'            | Sets the shape type of dumbbell markers. |
| `sizeFromBar`  | number  | 8                | Sets the size of the marker.             |
| `visible`      | boolean | true             | Sets the visibility of dumbbell markers. |

<br>

#### IFocusStyleType Definition

| Name (focusMarker.) | Type   | Default Value(s) | Description                                  |
| ------------------- | ------ | ---------------- | -------------------------------------------- |
| `key`               | string | ''               | Key used to determine which marker to focus. |
| `sizeFromBar`       | number | 12               | Sets the size of the focus marker.           |

<br>
<br>

### <a name="event-props" href="#event-props">#</a> Event Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

[Events in stencil.js](https://stenciljs.com/docs/events) dispatch [Custom DOM events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for other components to handle, we use Stencil's @Event() decorator to emit events (click, hover, mouseOut) from end user activity on our charts.

| Name              | Type                 | Default Value(s)                              | Description                                                                                                                                                                                                                                                                             |
| ----------------- | -------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `suppressEvents`  | boolean              | false                                         | Suppresses and disables all event emitters. Setting to true can increase performance for non-interactive charts.                                                                                                                                                                        |
| `cursor`          | string               | 'default'                                     | Changes pointer type during mouse over on data elements. Valid values are 'default' or 'pointer'.                                                                                                                                                                                       |
| `onClickFunc`     | function             | `undefined`                                   | When clickFunc event occurs (e.g., mouse/keyboard click on chart geometry), this event handler will be called with the custom event object (e.g., e), containing data at e.detail. You will need to construct your own functionality of what actions to take within the callback.       |
| `clickHighlight`  | object[]             | []                                            | Data used to track chart selections, an array of objects which includes keys that map to above accessors.                                                                                                                                                                               |
| `clickStyle`      | object (custom type) | [IClickStyleType](../types/src/prop-types.ts) | Sets the styling of data elements when they are selected, _see object definition below_.                                                                                                                                                                                                |
| `onHoverFunc`     | function             | `undefined`                                   | When hoverFunc event occurs (e.g., mouse hover/keyboard focus on chart geometry), this event handler will be called with the custom event object (e.g., e), containing data at e.detail. You will need to construct your own functionality of what actions to take within the callback. |
| `onMouseOutFunc`  | function             | `undefined`                                   | When mouseOutFunc event occurs (e.g., mouse/keyboard blur on chart geometry), this event handler will be called, and has no data object. You will need to construct your own functionality of what actions to take within the callback.                                                 |
| `hoverHighlight`  | object               | {}                                            | Datum object used to track active chart element, the object should include keys that map to above accessors.                                                                                                                                                                            |
| `hoverStyle`      | object (custom type) | [IHoverStyleType](../types/src/prop-types.ts) | Sets the styling of data elements when they are hovered/focused, _see object definition below_.                                                                                                                                                                                         |
| `interactionKeys` | string[]             | []                                            | Sets the key names of data to interact with.                                                                                                                                                                                                                                            |
| `hoverOpacity`    | number               | 1                                             | Sets opacity of inactive elements when hovering/focused on a chart geometry.                                                                                                                                                                                                            |

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
  const d = evt.detail; // data is located here
  this.currentClickedElement = [d]; // this is passed to clickHighlight prop
};

const hoverHandler = evt => {
  const d = evt.detail; // data is located here
  this.currentHoveredElement = d; // this is passed to hoverHighlight prop
};

const mouseOutHandler = evt => {
  this.currentHoveredElement = ''; // this is passed to hoverHighlight prop
};

// an example of calling these from within a stencil.js component
<dumbbell-plot
  data={[{ data }]}
  valueAccessor={'value'}
  ordinalAccessor={'date'}
  seriesAccessor={'category'}
  interactionKeys={['date']}
  onClickFunc={this.onClickFunc}
  clickHighlight={this.currentClickedElement}
  clickStyle={this.clickStyle}
  onHoverFunc={this.onHoverFunc}
  onMouseOutFunc={this.onMouseOut}
  hoverHighlight={this.currentHoveredElement}
  hoverStyle={this.hoverStyle}
/>;
//...
```

<br>
<br>

### <a name="label-props" href="#label-props">#</a> Label Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name              | Type                 | Default Value(s)                                    | Description                                                                                     |
| ----------------- | -------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `dataLabel`       | object (custom type) | [IDataLabelType](../types/src/prop-types.ts)        | Controls visibility, styling and placement of data labels, _see object definition below_.       |
| `differenceLabel` | object (custom type) | [IDifferenceLabelType ](../types/src/prop-types.ts) | Controls visibility, styling and placement of difference labels, _see object definition below_. |
| `seriesLabel`     | object (custom type) | [ISeriesLabelType](../types/src/prop-types.ts)      | Controls visibility, styling and placement of series labels, _see object definition below_.     |
| `legend`          | object (custom type) | [ILegendType](../types/src/prop-types.ts)           | Controls visibility and label of the chart legend, _see object definition below_.               |
| `showTooltip`     | boolean              | true                                                | Toggles whether to display the tooltip on hover/focus on chart geometries.                      |
| `tooltipLabel`    | object (custom type) | [ITooltipLabelType](../types/src/prop-types.ts)     | Controls visibility, content and format of the chart tooltip, _see object definition below_.    |

<br>

#### IDataLabelType Definition

| Name                | Type    | Default Value(s) | Description                                                                                                                                                                                                                                                                       |
| ------------------- | ------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor`     | string  | ''               | Key used to determine label's property.                                                                                                                                                                                                                                           |
| `visible`           | boolean | true             | Toggles the visibility (opacity) of the data labels.                                                                                                                                                                                                                              |
| `placement`         | string  | 'ends'           | Sets the placement of the data label. Accepts 'top', 'bottom', 'left', 'right', and 'ends'. Placement option 'auto' leverages the [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and places labels without overlaps in available space on the chart. |
| `format`            | string  | '0[.][0][0]a'    | Sets the formatting for the data labels, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/).                                                                                                                          |
| `collisionHideOnly` | boolean | false            | Toggles whether to run [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and hide labels if collision is detected (vs hide and then place). This is overridden by placement being set to `auto`.                                                        |

<br>

#### IDifferenceLabelType Definition

| Name                | Type    | Default Value(s) | Description                                                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculation`       | string  | 'difference'     | Sets the calculation used in the difference label. Accepts 'difference' or 'middle'.                                                                                                                                                                                                                                                           |
| `visible`           | boolean | true             | Toggles the visibility (opacity) of the difference labels.                                                                                                                                                                                                                                                                                     |
| `placement`         | string  | 'left'           | Sets the placement of the data label. Accepts 'top', 'bottom', 'left', and 'right'.                                                                                                                                                                                                                                                            |
| `format`            | string  | '0[.][0][0]a'    | Sets the formatting for the data labels, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). Placement option 'auto' leverages the [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and places labels without overlaps in available space on the chart. |
| `collisionHideOnly` | boolean | false            | Toggles whether to run [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and hide difference labels if collision is detected (vs hide and then place). This is overridden by placement being set to `auto`.                                                                                                          |

<br>

#### ISeriesLabel Definition

| Name                | Type     | Default Value(s) | Description                                                                                                                                                                                                                                                                |
| ------------------- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`             | string[] | []               | An array which determines the labels for each series, in order.                                                                                                                                                                                                            |
| `visible`           | boolean  | true             | Toggles the visibility (opacity) of the series labels.                                                                                                                                                                                                                     |
| `placement`         | string   | 'right'          | Sets the placement of the series label, accepts 'left', 'right', 'top', and 'bottom' Placement option 'auto' leverages the [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and places labels without overlaps in available space on the chart. |
| `collisionHideOnly` | boolean  | false            | Toggles whether to run [resolveLabelCollision](../utils/src/utils/collisionDetection.ts) algorithm and hide series labels if collision is detected (vs hide and then place). This is overridden by placement being set to `auto`.                                          |

<br>

#### ILegendType Definition

| Name          | Type     | Default Value(s) | Description                                                                                                                        |
| ------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `visible`     | boolean  | true             | Toggles the visibility (opacity/display) of the legend.                                                                            |
| `interactive` | boolean  | false            | Toggles the interactivity of the legend.                                                                                           |
| `labels`      | string[] | ''               | An array that sets each label in the legend, in order. Passing empty string will populate legend labels directly from data values. |

<br>

#### ITooltipLabelType Definition

| Name            | Type     | Default Value(s) | Description                                                                                                                                                                 |
| --------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor` | string[] | []               | An array that determines which property of the data is displayed in the tooltip.                                                                                            |
| `labelTitle`    | string[] | []               | An array that sets the title for each data property in the tooltip.                                                                                                         |
| `format`        | string   | ''               | Sets the formatting for the data properties in the tooltip, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |

<br>
<br>

### <a name="margin-and-padding-props" href="#margin-and-padding-props">#</a> Margin & Padding Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name      | Type                 | Default Value(s)                            | Description                                                                                                                                     |
| --------- | -------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `margin`  | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Margin between the subtitle and the chart area, or between the title and chart area if no subtitle is specified, _see object definition below_. |
| `padding` | object (custom type) | [IBoxModelType](../types/src/prop-types.ts) | Padding between plot area and axes lines, _see object definition below_.                                                                        |

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

### <a name="style-props" href="#style-props">#</a> Style Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

| Name           | Type     | Default Value(s) | Description                                                                                                       |
| -------------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| `colorPalette` | string   | 'categorical'    | Included color palettes can be found in our [color utility](../utils/src/utils/colors.ts). Overridden by colors.  |
| `colors`       | string[] | `undefined`      | Accepts array of color strings or color values to customize colors beyond our palettes. Colors assigned in order. |

<br>
<br>

### <a name="reference-line-props" href="#reference-line-props">#</a> Reference Line Props _Deprecated_[<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

The referenceLines and Style props are currently deprecated and will ultimately be fully replaced with the annotation prop. For the time being, this prop will work, but will also not pass accessibility requirements.

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

<br>
<br>

### <a name="unit-test-props" href="#unit-test-props">#</a> Unit Testing Props [<>](./src/components/dumbbell-plot/dumbbell-plot.tsx 'Source')

These props are used in development mode only to facilitate robust testing of charts, the should not be leveraged in a production deployments.

| Name       | Type    | Default Value(s) | Description                                                                                                                        |
| ---------- | ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `unitTest` | boolean | false            | If true, attaches relevant testing attributes to the chart's DOM elements, this only needs to be true when running our unit tests. |
