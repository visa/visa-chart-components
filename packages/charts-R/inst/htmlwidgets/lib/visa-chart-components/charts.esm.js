/**
 * Copyright (c) 2021, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import{p as e,w as i,d as t,N as a,a as o,b as r}from"./p-eeee2e3c.js";export{s as setNonce}from"./p-eeee2e3c.js";(()=>{e.i=i.__cssshim;const s=Array.from(t.querySelectorAll("script")).find((e=>new RegExp(`/${a}(\\.esm)?\\.js($|\\?|#)`).test(e.src)||e.getAttribute("data-stencil-namespace")===a)),r=s["data-opts"]||{};return"onbeforeload"in s&&!history.scrollRestoration?{then(){}}:(r.resourcesUrl=new URL(".",new URL(s.getAttribute("data-resources-url")||s.src,i.location.href)).href,((o,s)=>{const r=`__sc_import_${a.replace(/\s|-/g,"_")}`;try{i[r]=new Function("w",`return import(w);//${Math.random()}`)}catch(l){const a=new Map;i[r]=l=>{var n;const c=new URL(l,o).href;let d=a.get(c);if(!d){const o=t.createElement("script");o.type="module",o.crossOrigin=s.crossOrigin,o.src=URL.createObjectURL(new Blob([`import * as m from '${c}'; window.${r}.m = m;`],{type:"application/javascript"}));const l=null!==(n=e.t)&&void 0!==n?n:function(e){var i,t,a;return null!==(a=null===(t=null===(i=e.head)||void 0===i?void 0:i.querySelector('meta[name="csp-nonce"]'))||void 0===t?void 0:t.getAttribute("content"))&&void 0!==a?a:void 0}(t);null!=l&&o.setAttribute("nonce",l),d=new Promise((e=>{o.onload=()=>{e(i[r].m),o.remove()}})),a.set(c,d),t.head.appendChild(o)}return d}}})(r.resourcesUrl,s),i.customElements?o(r):__sc_import_charts("./p-538882c8.js").then((()=>r)))})().then((e=>r(JSON.parse('[["p-0ed8b3b5",[[0,"data-table",{"uniqueID":[1025,"unique-i-d"],"language":[1025],"isCompact":[1028,"is-compact"],"hideDataTable":[1028,"hide-data-table"],"margin":[1040],"padding":[1040],"tableColumns":[1040],"secondaryTableColumns":[1040],"dataKeyNames":[1040],"data":[16],"secondaryData":[16],"unitTest":[1028,"unit-test"],"showTable":[32]}],[0,"keyboard-instructions",{"uniqueID":[1025,"unique-i-d"],"language":[1025],"geomType":[1025,"geom-type"],"groupName":[1025,"group-name"],"chartTag":[1025,"chart-tag"],"width":[1032],"isInteractive":[1028,"is-interactive"],"hasCousinNavigation":[1028,"has-cousin-navigation"],"disabled":[1028],"unitTest":[1028,"unit-test"],"showInstructions":[32],"showHeading":[32]}]]],["p-96722878",[[0,"alluvial-diagram",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"layout":[1025],"linkData":[16],"nodeData":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"sourceAccessor":[1025,"source-accessor"],"targetAccessor":[1025,"target-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"nodeIDAccessor":[1025,"node-i-d-accessor"],"nodeConfig":[1040],"linkConfig":[1040],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"annotations":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-ff55a283",[[0,"bar-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-7658b7d7",[[0,"circle-packing",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"circlePadding":[1026,"circle-padding"],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[8],"uniqueID":[8,"unique-i-d"],"dataDepth":[1026,"data-depth"],"displayDepth":[1026,"display-depth"],"parentAccessor":[1025,"parent-accessor"],"nodeAccessor":[1025,"node-accessor"],"sizeAccessor":[1025,"size-accessor"],"colorPalette":[1025,"color-palette"],"colors":[1040],"cursor":[1025],"hoverStyle":[1040],"clickStyle":[1040],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"annotations":[1040],"accessibility":[1040],"suppressEvents":[1028,"suppress-events"],"interactionKeys":[1040],"hoverHighlight":[1040],"clickHighlight":[1040],"zoomToNode":[1040]}]]],["p-5783562f",[[0,"clustered-bar-chart",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[8],"uniqueID":[8,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"reverseOrder":[1028,"reverse-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"groupIntervalRatio":[1026,"group-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"minValueOverride":[1026,"min-value-override"],"maxValueOverride":[1026,"max-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-3dae7af0",[[0,"dumbbell-plot",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"layout":[1025],"showBaselineX":[1028,"show-baseline-x"],"showBaselineY":[1028,"show-baseline-y"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"focusMarker":[1040],"marker":[1040],"barStyle":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"seriesLabel":[1040],"differenceLabel":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-7cef192e",[[0,"heat-map",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"xAccessor":[1025,"x-accessor"],"yAccessor":[1025,"y-accessor"],"valueAccessor":[1025,"value-accessor"],"xKeyOrder":[1040],"yKeyOrder":[1040],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"hideAxisPath":[1028,"hide-axis-path"],"colorPalette":[1025,"color-palette"],"colors":[1040],"colorSteps":[1026,"color-steps"],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"shape":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"suppressEvents":[1028,"suppress-events"],"unitTest":[4,"unit-test"]}]]],["p-e6f1019b",[[0,"line-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"showBaselineX":[1028,"show-baseline-x"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"showDots":[1028,"show-dots"],"dotRadius":[1026,"dot-radius"],"lineCurve":[1025,"line-curve"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"seriesLabel":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"referenceLines":[1040],"secondaryLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-63ec12bd",[[0,"parallel-plot",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"showBaselineX":[1028,"show-baseline-x"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"showDots":[1028,"show-dots"],"dotRadius":[1026,"dot-radius"],"lineCurve":[1025,"line-curve"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"seriesLabel":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"secondaryLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-b3cc0ee5",[[0,"pie-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"centerTitle":[1025,"center-title"],"centerSubTitle":[1025,"center-sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"sortOrder":[1025,"sort-order"],"colorPalette":[1025,"color-palette"],"colors":[1040],"innerRatio":[1026,"inner-ratio"],"showEdgeLine":[1028,"show-edge-line"],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showPercentage":[1028,"show-percentage"],"showTooltip":[1028,"show-tooltip"],"showLabelNote":[1028,"show-label-note"],"labelOffset":[1026,"label-offset"],"dataLabel":[1040],"dataKeyNames":[1040],"tooltipLabel":[1040],"accessibility":[1040],"annotations":[1040],"referenceData":[16],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-11aac691",[[0,"scatter-plot",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[16],"uniqueID":[1,"unique-i-d"],"xAccessor":[1025,"x-accessor"],"yAccessor":[1025,"y-accessor"],"sizeConfig":[1032,"size-config"],"groupAccessor":[1025,"group-accessor"],"xAxis":[1040],"yAxis":[1040],"showBaselineX":[1028,"show-baseline-x"],"showBaselineY":[1028,"show-baseline-y"],"colorPalette":[1025,"color-palette"],"colors":[1040],"dotRadius":[1026,"dot-radius"],"dotOpacity":[1026,"dot-opacity"],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"fitLineStyle":[1040],"dotSymbols":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"xMaxValueOverride":[2,"x-max-value-override"],"xMinValueOverride":[2,"x-min-value-override"],"yMaxValueOverride":[2,"y-max-value-override"],"yMinValueOverride":[2,"y-min-value-override"],"showFitLine":[1028,"show-fit-line"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-bdfdaf83",[[0,"stacked-bar-chart",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"normalized":[1028],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTotalValue":[1028,"show-total-value"],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"showZeroLabels":[1028,"show-zero-labels"],"minValueOverride":[1026,"min-value-override"],"maxValueOverride":[1026,"max-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-38153388",[[0,"world-map",{"highestHeadingLevel":[1032,"highest-heading-level"],"height":[1026],"width":[1026],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"margin":[1040],"padding":[1040],"mapProjection":[1025,"map-projection"],"mapScaleZoom":[1026,"map-scale-zoom"],"quality":[1025],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"sortOrder":[1025,"sort-order"],"groupAccessor":[1025,"group-accessor"],"markerAccessor":[1025,"marker-accessor"],"markerNameAccessor":[1025,"marker-name-accessor"],"joinAccessor":[1025,"join-accessor"],"joinNameAccessor":[1025,"join-name-accessor"],"valueAccessor":[1025,"value-accessor"],"latitudeAccessor":[1025,"latitude-accessor"],"longitudeAccessor":[1025,"longitude-accessor"],"colorPalette":[1025,"color-palette"],"colors":[1040],"colorSteps":[1026,"color-steps"],"markerStyle":[1040],"countryStyle":[1040],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showTooltip":[1028,"show-tooltip"],"accessibility":[1040],"legend":[1040],"showGridlines":[1028,"show-gridlines"],"tooltipLabel":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"suppressEvents":[1028,"suppress-events"],"unitTest":[4,"unit-test"]}]]]]'),e)));