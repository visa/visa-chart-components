# @visa/bivariate-mapbox-map

## _Prototype Component: Use at your own risk._

This component is an experimental prototype and undergoing more work. It has not been fully tested to the extent that [core, product-grade Visa Chart Components](../charts) have been. Functionality is likely to change and some or many features may be even be deprecated.

---

## Description

A custom mapbox implementation to render a bivariate map of the US (msa and zip level).

## Installation Steps

- Using npm
  ```
  $ npm i @visa/bivariate-mapbox-map
  ```
- Using yarn
  ```
  $ yarn add @visa/bivariate-mapbox-map
  ```

## Props Documentation

- `height` Number: Height in px of the map container
- `width` Number: Width in px of the map container
- `token` String: Mapbox API token to use for the map render, this should be your specific token for your application/visualization.
- `mainTitle` String: The `h2` tag of title for the map (or you can create your own separately).
- `subTitle` String: The `p` tag for a sub title for the map (or you can create your own separately).

### accessors

- `ordinalAccessor` String: The key of the data field (key/value pair) which holds the identifier of the geography (e.g., zip code of MSA ID).
- `ordinalNameAccessor` String: The key of the data field which holds the name of the geography (e.g., zip code of MSA ID).
- `valueAccessors` Array[string,string]: An array containing 2 (and only 2) strings which map to the keys of the data fields containing the metrics for the bivariate scheme of the map.
- `noDataAccessor` String: The key of the data field (key/value pair) which holds the boolean identifier as to whether the metrics for this data record should not be displayed.

### style

- `colorPalette` String oneOf(`redBlue`, `bluePurple`, `greenBlue`, `purpleOrange`): String enumerator which specifies which bivariate color palette to use (these palettes were obtained from https://www.joshuastevens.net/cartography/make-a-bivariate-choropleth-map/).
- `defaultColor` String: Valid hex color code to be used when a geometry does not have a corresponding value mapped to it.
- `pinStyle` Object: An object containing two keys (size and overrideColor) which determine the size of hardcoded color of the pin. If you do not send overrideColor, the pin color will match the geometry's color.
- `showEmpty` Boolean: This boolean input will toggle visibility of the `empty` polygons on the map. These are items which non of your data matches.

### data

- `msaData` Array<any>: An array of n data objects containing data which is to be mapped to the MSA layer of the map.
- `selectMSAs` Array<any>: An array of n data objects containing data which should be put into "selected state" for the MSA level.
- `zipData` Array<any>: An array of n data objects containing data which is to be mapped to the ZIP layer of the map.
- `selectZips` Array<any>: An array of n data objects containing data which should be put into "selected state" for the zip level.
- `lassoData` Object: A hash of n lasso objects, requires objects to be valid lassos (often saved from the onSelectionFunc callback via d.lassoFilter, assuming you send d into the callback.
- `pinIDs` string[]: An array of n strings which contain the identifier/key of the geometries which should have a pin placed on it, pins only render for the current layer being viewed on the map (either MSA or zip, but not both at the same time).
- `bivariateFilter` Number[0,1,2,3,4,5,6,7,8]: An array of up to 9 numerical values (from 0 to 8) which associate the bins that should be selected in the bivariate key on the map.
- `hideNoData` Boolean: This boolean input will toggle visibility of the polygons where d[noDataAccessor] === true. These are items which your data matches to, but the noDataAccessor resolves true. This can be used in combination with other props like bivariateFilter to ensure this set of records is handled alongside data that can be shown.

### map stuff

- `fitBounds` Array[Array[Number,Number,Number,Number]...n]: An array of n [bounding box arrays](https://docs.mapbox.com/help/glossary/bounding-box/) which will be used to zoom/place the map viewport. Each bounding box array holds 4 values.
- `zoomThreshold` Number: a numerical value which is a valid [mapbox zoom level](https://docs.mapbox.com/help/glossary/zoom-level/). This value will determine at what zoom point will the layers switch from MSA layer to zip layer data.
- `preserveDrawingBuffer` boolean: Toggle the `options.preserveDrawingBuffer` option for the instance of the mapbox map. Defaults to false as this has a performance impact on rendering.

### tooltip

- `showTooltip` boolean: When truthy, allows tooltips to be displayed.
- `tooltipLabel` object: An object interface which allows you to customize the tooltip content (has keys format, labelAccessor, labelTitle, and follows the standard Visa Chart Components implementation).
- `noDataMessage` String: This string will be displayed with ordinalAccessor and ordinalNameAccessor within the tooltip when hovering on a point that has d[noDataAccessor] === true.

### interactivity

[Events in stencil.js](https://stenciljs.com/docs/events) dispatch [Custom DOM events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events) for other components to handle, we use Stencil's @Event() decorator to emit these events.

- `selectionFunc` function: When selectionFunc event occurs, this event handler will be called with an object "d" (see object below). You will need to construct your own functionality of what actions to take within the callback.

```js
onSelectionHandler = (d, layer) => {
  const output = {
    layer, // the current layer
    colorFilter: [...this.bivariateFilter], // the current state of the bivariate key
    lassoFilter: { ...this.lassoCollection }, // the current state of lassos
    data: [...d] // the resulting data that has been filtered by bivariateFilter, lassos, or selectMsas/selectZips
  };
  this.selectionFunc.emit(output);
};
```

- `clickFunc` function: When clickFunc event occurs, this event handler will be called with an object "d" (see object below). You will need to construct your own functionality of what actions to take within the callback.

```js
    ...
    this.clickFunc.emit({
        msa: msaFeatureData,
        zip: zipFeatureData
    });
    ...
```

- `hoverFunc` function: When hoverFunc event occurs, this event handler will be called with an object "d" (see object below). You will need to construct your own functionality of what actions to take within the callback.

```js
onHoverHandler = d => {
  const featureData = [];
  if (d) {
    d.map(innerD => {
      if (innerD.state.data) {
        featureData.push(innerD.state.data);
      }
    });
  }
  this.hoverFunc.emit(featureData);
};
```

- `moveEndFunc` function: When moveEndFunc event occurs, this event handler will be called with an object "d" (see object below). You will need to construct your own functionality of what actions to take within the callback.

```js
this.moveEndFunc.emit({
  e,
  zoom: this.map.getZoom(),
  bounds: this.map.getBounds(),
  center: this.map.getCenter()
});
```

- `binUpdateFunc` function: When binUpdateFunc event occurs, this event handler will be called with an object "d" (see object below). You will need to construct your own functionality of what actions to take within the callback. The main purpose of this pub/sub method is to get up-to-date information on the bivariate key bins for both msa and zip layers.

```js
    // the assumed render order for a bivariate key is:
    // [ 6, 7, 8,
    //   3, 4, 5,
    //   0, 1, 2 ]
    const bivariateBins: any = { zip: [], msa: [] };
    binUpdateHandler() {
        if (typeof this.onBinUpdateFunc === 'function') {
        this.binUpdateFunc.emit(this.bivariateBins);
        }
    }
```
