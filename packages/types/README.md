# Types

A collection of common prop types used across the VCC ecosystem.

## Charts that leverage these types:

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

## Default Values

Default values for all of these types can be found the [propDefaultValues file in our utils](../utils/src/utils/propDefaultValues.ts) but are also outlined in the tables below.

## API Contents

<details open="open">
  <summary>Jump To:</summary>
  <ol>
    <li><a href="#accessibility">Accessibility</a>
      <ul>
        <li>
          <a href="#IAccessibilityType">IAccessibilityType</a>
        </li>
      </ul>
    <li><a href="#basic-props">Basic Props</a>
      <ul>
        <li>
          <a href="#IBoxModelType">IBoxModelType</a>
        </li>
      </ul>
    </li>
    <li><a href="#dumbbell-specific">Dumbbell Specific</a>
      <ul>
        <li>
          <a href="#IBarStyleType">IBarStyleType</a>
        </li>
        <li>
          <a href="#IDifferenceLabelType">IDifferenceLabelType</a>
        </li>
        <li>
          <a href="#IFocusStyleType">IFocusStyleType</a>
        </li>
        <li>
          <a href="#IMarkerStyleType">IMarkerStyleType</a>
        </li>
      </ul>
    </li>
    <li><a href="#interactivity">Interactivity</a>
      <ul>
        <li>
          <a href="#IHoverStyleType">IHoverStyleType</a>
        </li>
        <li>
          <a href="#IClickStyleType">IClickStyleType</a>
        </li>
      </ul>
    </li>
    <li><a href="#labels-and-legend">Labels and Legend</a>
      <ul>
        <li>
          <a href="#IDataLabelType">IDataLabelType</a>
        </li>
        <li>
          <a href="#ILegendType">ILegendType</a>
        </li>
        <li>
          <a href="#ISeriesLabelType">ISeriesLabelType</a>
        </li>
        <li>
          <a href="#ITooltipLabelType">ITooltipLabelType</a>
        </li>
      </ul>
    </li>
    <li><a href="#reference-lines">Reference Lines</a>
      <ul>
        <li>
          <a href="#IReferenceStyleType">IReferenceStyleType</a>
        </li>
      </ul>
    </li>
    <li><a href="#secondary-lines">Secondary Lines</a>
      <ul>
        <li>
          <a href="#ISecondaryLinesType">ISecondaryLinesType</a>
        </li>
      </ul>
    </li>
    <li><a href="#world-map-specific">World Map Specific</a>
      <ul>
        <li>
          <a href="#IMapMarkerStyleType">IMapMarkerStyleType</a>
        </li>
        <li>
          <a href="#ICountryStyleType">ICountryStyleType</a>
        </li>
      </ul>
    </li>
    <li><a href="#x-and-y-axis">X and Y Axis</a>
      <ul>
        <li>
          <a href="#IAxisType">IAxisType</a>
        </li>
      </ul>
    </li>
  </ol>
</details>
<br>
<hr>
<br>

## <a name="accessibility" href="#accessibility">#</a> Accessibility [<>](./src/prop-types.ts 'Source')

### <a name="IAccessibilityType" href="#IAccessibilityType">#</a> IAccessibilityType

Used by every chart. Specifies a robust set of settings that make VCC data experiences more accessible.

Description props are used to explain the chart to a user who cannot see it and should be carefully considered early in the design process. In addition, it is always best to provide explanations of the chart's context, purpose, summaries, statistics in visual, textual form for people with cognitive impairment/disability. In cases where this information is provided outside of the chart, it does not need to be provided to these props.

Note that some of these props are required by [chart accessibility validation](../utils/README#validation) and will throw warnings until the default values are changed (such as `elementsAreInterface`). The prop for `disableValidation` should be set to true before an application's production build and deployment process but _only_ if the chart is considered accessible (validation can slow down the chart's lifecycle performance significantly).

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
<hr>

## <a name="basic-props" href="#basic-props">#</a> Basic Props [<>](./src/prop-types.ts 'Source')

### <a name="IBoxModelType" href="#IBoxModelType">#</a> IBoxModelType

Used by every chart for both the `padding` and `margin` props.

| Name     | Type   | Default Value(s) | Description                                             |
| -------- | ------ | ---------------- | ------------------------------------------------------- |
| `top`    | number | height \* 0.01   | Sets the top margin/padding for the chart container.    |
| `bottom` | number | height \* 0.01   | Sets the bottom margin/padding for the chart container. |
| `left`   | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |
| `right`  | number | width \* 0.01    | Sets the top margin/padding for the chart container.    |

<br>
<hr>

## <a name="dumbbell-specific" href="#dumbbell-specific">#</a> Dumbbell Specific [<>](./src/prop-types.ts 'Source')

### <a name="IBarStyleType" href="#IBarStyleType">#</a> IBarStyleType

[Dumbbell plot](../dumbbell-plot) only. Sets props for dumbbell's bar.

| Name (barStyle.) | Type   | Default Value(s) | Description                                                                                  |
| ---------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `colorRule`      | string | 'default'        | Sets the color rule for the dumbbell bar (options are 'greaterValue', 'focus' or 'default'). |
| `opacity`        | number | 1                | Sets the opacity of the dumbbell bar.                                                        |
| `width`          | number | 1                | Sets the width of the dumbbell bar.                                                          |

<br>

### <a name="IDifferenceLabelType" href="#IDifferenceLabelType">#</a> IDifferenceLabelType

[Dumbbell plot](../dumbbell-plot) only. Adjusts settings for the difference label (label between dumbbell markers).

| Name          | Type    | Default Value(s) | Description                                                                                                                                              |
| ------------- | ------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculation` | string  | 'difference'     | Sets the calculation used in the difference label. Accepts 'difference' or 'middle'.                                                                     |
| `visible`     | boolean | true             | Toggles the visibility (opacity) of the difference labels.                                                                                               |
| `placement`   | string  | 'left'           | Sets the placement of the data label. Accepts 'top', 'bottom', 'left', and 'right'.                                                                      |
| `format`      | string  | '0[.][0][0]a'    | Sets the formatting for the data labels, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |

<br>

### <a name="IFocusStyleType" href="#IFocusStyleType">#</a> IFocusStyleType

[Dumbbell plot](../dumbbell-plot) only. Sets props for focus marker. `sizeFromBar` will override <a href="#IMarkerStyleType">marker style</a> props, but only for markers that match the `focusMarker.key`.

| Name (focusMarker.) | Type   | Default Value(s) | Description                                  |
| ------------------- | ------ | ---------------- | -------------------------------------------- |
| `key`               | string | ''               | Key used to determine which marker to focus. |
| `sizeFromBar`       | number | 12               | Sets the size of the focus marker.           |

<br>

### <a name="IMarkerStyleType" href="#IMarkerStyleType">#</a> IMarkerStyleType

[Dumbbell plot](../dumbbell-plot) only. Sets props for dumbbell's markers. <a href="#IFocusStyleType">Focus marker</a>'s `sizeFromBar` will override this prop's `sizeFromBar`, but only for markers that match the `focusMarker.key`.

| Name (marker.) | Type    | Default Value(s) | Description                              |
| -------------- | ------- | ---------------- | ---------------------------------------- |
| `type`         | string  | 'dot'            | Sets the shape type of dumbbell markers. |
| `sizeFromBar`  | number  | 8                | Sets the size of the marker.             |
| `visible`      | boolean | true             | Sets the visibility of dumbbell markers. |

<br>

<hr>

## <a name="interactivity" href="#interactivity">#</a> Interactivity [<>](./src/prop-types.ts 'Source')

### <a name="IHoverStyleType" href="#IHoverStyleType">#</a> IHoverStyleType

Sets the color and stroke width for elements when they match the `hoverHighlight` and `interactionKeys` props. See chart-level documentation for [how to handle hover interactivity](..bar-chart/README#event-props).

| Name          | Type   | Default Value(s) | Description                                                                                  |
| ------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `color`       | string | ''               | Sets the color of the hovered element (requires hoverHighlight to be valid and sent).        |
| `strokeWidth` | number | 2                | Sets the stroke width of the hovered element (requires hoverHighlight to be valid and sent). |

<br>

### <a name="IClickStyleType" href="#IClickStyleType">#</a> IClickStyleType

Sets the color and stroke width for elements when they match the `clickHighlight` and `interactionKeys` props. See chart-level documentation for [how to handle click interactivity](..bar-chart/README#event-props).

| Name          | Type   | Default Value(s) | Description                                                                                  |
| ------------- | ------ | ---------------- | -------------------------------------------------------------------------------------------- |
| `color`       | string | ''               | Sets the color of the clicked element (requires clickHighlight to be valid and sent).        |
| `strokeWidth` | number | 2                | Sets the stroke width of the clicked element (requires clickHighlight to be valid and sent). |

<br>

<hr>

## <a name="labels-and-legend" href="#labels-and-legend">#</a> Labels and Legend [<>](./src/prop-types.ts 'Source')

### <a name="IDataLabelType" href="#IDataLabelType">#</a> IDataLabelType

Used by every chart. Specifies label values, visibility, placement, and format of data labels.

| Name            | Type    | Default Value(s)                       | Description                                                                                                                                              |
| --------------- | ------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor` | string  | ''                                     | Key used to determine label's property.                                                                                                                  |
| `visible`       | boolean | true                                   | Toggles the visibility (opacity) of the data labels.                                                                                                     |
| `placement`     | string  | 'top' (vertical), 'right' (horizontal) | Sets the placement of the data label. Examples of values are 'top', 'bottom' for vertical layout and 'left', 'right', 'top-right' for horizontal layout. |
| `format`        | string  | '0[.][0][0]a'                          | Sets the formatting for the data lables, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |

<br>

### <a name="ILegendType" href="#ILegendType">#</a> ILegendType

Specifies visibility, interactivity, format, label values, and type of chart legends. Only charts that have `groupAccessor` or `seriesAccessor` passed as the only value in `interactionKeys` can set `interactive` to true. The various styles allowed for `type` differ for each chart.

| Name          | Type     | Default Value(s) | Description                                                                                                                                                |
| ------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `visible`     | boolean  | true             | Toggles the visibility (opacity/display) of the legend.                                                                                                    |
| `interactive` | boolean  | false            | Toggles the interactivity of the legend.                                                                                                                   |
| `format`      | string   | ''               | Sets the formatting for the legend lables, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |
| `labels`      | string[] | ''               | An array that sets each label in the legend, in order. Passing empty string will populate legend labels directly from data values.                         |
| `type`        | string   | 'bar'            | Sets the type of the legend, forced to 'bar' in bar-chart.                                                                                                 |

<br>

### <a name="ISeriesLabelType" href="#ISeriesLabelType">#</a> ISeriesLabelType

Used in [Line Chart](../line-chart), [Parallel plot](../parallel-plot), and [Dumbbell plot](../dumbbell-plot). Specifies label content and placement for series labels.

| Name        | Type     | Default Value(s) | Description                                                       |
| ----------- | -------- | ---------------- | ----------------------------------------------------------------- |
| `label`     | string[] | []               | An array which determines the labels for each line, in order.     |
| `visible`   | boolean  | true             | Toggles the visibility (opacity) of the series labels.            |
| `placement` | string   | 'right'          | Sets the placement of the series label, accepts 'left' or 'right' |

<br>

### <a name="ITooltipLabelType" href="#ITooltipLabelType">#</a> ITooltipLabelType

Used by every chart to set the label values, titles, and formatting within a tooltip.

| Name            | Type     | Default Value(s) | Description                                                                                                                                                                 |
| --------------- | -------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `labelAccessor` | string[] | []               | An array that determines which property of the data is displayed in the tooltip.                                                                                            |
| `labelTitle`    | string[] | []               | An array that sets the title for each data property in the tooltip.                                                                                                         |
| `format`        | string   | ''               | Sets the formatting for the data properties in the tooltip, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |

<br>

<hr>

## <a name="reference-lines" href="#reference-lines">#</a> Reference Lines [<>](./src/prop-types.ts 'Source')

### <a name="IReferenceStyleType" href="#IReferenceStyleType">#</a> IReferenceStyleType

Note: The referenceLines and Style props are currently deprecated and will ultimately be fully replaced by the [`annotation` prop](../utils/README.md#annotate). For the time being, this prop will work, but will not pass accessibility requirements. Use at your own risk or migrate to [annotations](../utils/README.md#annotation).

| Name          | Type   | Default Value(s) | Description                                                             |
| ------------- | ------ | ---------------- | ----------------------------------------------------------------------- |
| `color`       | string | 'pri_grey'       | Sets the color of the reference line.                                   |
| `strokeWidth` | number | 1                | Sets the stroke width of the reference line.                            |
| `opacity`     | number | 1                | Sets the opacity of the reference line.                                 |
| `dashed`      | string | ''               | Sets the dash array property of the path element of the reference line. |

<br>

<hr>

## <a name="secondary-lines" href="#secondary-lines">#</a> Secondary Lines [<>](./src/prop-types.ts 'Source')

### <a name="ISecondaryLinesType" href="#ISecondaryLinesType">#</a> ISecondaryLinesType

Used in [Line Chart](../line-chart) and [Parallel plot](../parallel-plot). Specifies styling overrides meant to de-emphasize secondary lines (reduce cognitive load of non-essential lines). Secondary lines are matched according to strings of `seriesAccessor` values passed into `secondaryLines.keys`.

| Name (secondaryLines.) | Type     | Default Value(s) | Description                                              |
| ---------------------- | -------- | ---------------- | -------------------------------------------------------- |
| `keys`                 | string[] | []               | Assign keys of secondary lines.                          |
| `showDataLabel`        | boolean  | true             | Sets the visibility of data labels on secondary lines.   |
| `showSeriesLabel`      | boolean  | true             | Sets the visibility of series labels on secondary lines. |
| `opacity`              | number   | 1                | Sets the opacity of secondary lines.                     |

<br>
<hr>

## <a name="world-map-specific" href="#world-map-specific">#</a> World Map Specific [<>](./src/prop-types.ts 'Source')

### <a name="IMapMarkerStyleType" href="#IMapMarkerStyleType">#</a> IMapMarkerStyleType

[World Map](../world-map) only. Adjusts the settings and style of the markers being placed on the map.

| Name (markerStyle.) | Type     | Default Value(s) | Description                                                                                                                              |
| ------------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `visible`           | boolean  | false            | Sets the visibility of map markers.                                                                                                      |
| `fill`              | boolean  | true             | Sets whether to color markers with either a, `ordinal()` (based on groupAccessor), or `quantize()` (based on valueAccessor) color scale. |
| `blend`             | boolean  | false            | Sets whether to apply mix-blend-mode multiply (true), or normal (false).                                                                 |
| `color`             | string   | base_grey        | Sets the color of the marker if `fill` is false.                                                                                         |
| `strokeWidth`       | string   | 1px              | Sets the stroke-width of the marker (currently requires `Npx` notation.)                                                                 |
| `opacity`           | number   | 0.8              | Sets the opacity of the marker.                                                                                                          |
| `radius`            | number   | 5                | Sets the radius of the marker, if `radiusRange` is falsy/empty string.                                                                   |
| `radiusRange`       | number[] | ''               | Sets the size of the marker through a value based scale, currently leverages `d3.scalePow().exponent(0.5)` for marking scaling approach. |

<br>

### <a name="ICountryStyleType" href="#ICountryStyleType">#</a> ICountryStyleType

[World Map](../world-map) only. Adjusts the settings and style of the map's country features.

| Name (countryStyle.) | Type    | Default Value(s) | Description                                                                                                                                       |
| -------------------- | ------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fill`               | boolean | true             | Sets whether to color country features with either a, `ordinal()` (based on groupAccessor), or `quantize()` (based on valueAccessor) color scale. |
| `opacity`            | number  | 0.8              | Sets the opacity of the country features.                                                                                                         |
| `color`              | string  | base_grey        | Sets the color of the country features if `fill` is false.                                                                                        |
| `strokeWidth`        | string  | 1px              | Sets the stroke-width of the country features (currently requires `Npx` notation.)                                                                |

<br>

<hr>

## <a name="x-and-y-axis" href="#x-and-y-axis">#</a> X and Y Axis [<>](./src/prop-types.ts 'Source')

### <a name="IAxisType" href="#IAxisType">#</a> IAxisType

Used by most charts to customize the x and y axis. Only charts that plot dates (like [Line Chart](../line-chart)) can use the `unit` property. Only [Parallel Plot](../parallel-plot) uses `yAxis.scales` and `yAxis.onlyTickExtents`.

| Name (xAxis./yAxis.)    | Type    | Default Value(s)               | Description                                                                                                                                            |
| ----------------------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `visible`               | boolean | true                           | Toggles the visibility of the axis.                                                                                                                    |
| `gridVisible`           | boolean | true                           | Toggles the visibility of the axis grid.                                                                                                               |
| `label`                 | string  | 'X Axis'                       | Sets the label for the axis.                                                                                                                           |
| `placement`             | string  | 'top' (x), 'left' (y)          | Sets the axis placement for x 'top' or 'bottom' and for y 'left', or 'right'.                                                                          |
| `format`                | string  | '' or '%b %y' or '0[.][0][0]a' | Sets the formatting for axis elements, EG %b, refer to [d3-time-format](https://github.com/d3/d3-time-format) and [numeral.js](http://numeraljs.com/). |
| `tickInterval`          | number  | 1                              | Can be used to reduce the frequency of axis ticks. This number sets the interval of axis ticks that are shown.                                         |
| `unit`                  | string  | '' or 'month'                  | Sets the unit of padding for the axis when accessor is a date.                                                                                         |
| `yAxis.scales`          | string  | `undefined` or 'preNormalized' | Sets the type of scales used in y axis for [parallel plot](../parallel-plot).                                                                          |
| `yAxis.onlyTickExtents` | boolean | true                           | Hides yAxis ticks between min/max for [parallel plot](../parallel-plot).                                                                               |

<br>
