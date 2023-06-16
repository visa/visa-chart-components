/**
 * Copyright (c) 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
System.register(["./p-6345a0d3.system.js"],(function(e,i){"use strict";var t,a,s,o,r,l;return{setters:[function(i){t=i.p;a=i.w;s=i.d;o=i.N;r=i.a;l=i.b;e("setNonce",i.s)}],execute:function(){function e(e){var i,t,a;return(a=(t=(i=e.head)===null||i===void 0?void 0:i.querySelector('meta[name="csp-nonce"]'))===null||t===void 0?void 0:t.getAttribute("content"))!==null&&a!==void 0?a:undefined}var n=function(e){return"__sc_import_".concat(e.replace(/\s|-/g,"_"))};var c=function(){{t.$cssShim$=a.__cssshim}var e=Array.from(s.querySelectorAll("script")).find((function(e){return new RegExp("/".concat(o,"(\\.esm)?\\.js($|\\?|#)")).test(e.src)||e.getAttribute("data-stencil-namespace")===o}));var l=e["data-opts"]||{};if("onbeforeload"in e&&!history.scrollRestoration){return{then:function(){}}}{l.resourcesUrl=new URL(".",new URL(e.getAttribute("data-resources-url")||e.src,a.location.href)).href;{u(l.resourcesUrl,e)}if(!a.customElements){return i.import("./p-cbfae706.system.js").then((function(){return l}))}}return r(l)};var u=function(i,r){var l=n(o);try{a[l]=new Function("w","return import(w);//".concat(Math.random()))}catch(u){var c=new Map;a[l]=function(o){var n;var u=new URL(o,i).href;var d=c.get(u);if(!d){var h=s.createElement("script");h.type="module";h.crossOrigin=r.crossOrigin;h.src=URL.createObjectURL(new Blob(["import * as m from '".concat(u,"'; window.").concat(l,".m = m;")],{type:"application/javascript"}));var p=(n=t.$nonce$)!==null&&n!==void 0?n:e(s);if(p!=null){h.setAttribute("nonce",p)}d=new Promise((function(e){h.onload=function(){e(a[l].m);h.remove()}}));c.set(u,d);s.head.appendChild(h)}return d}}};c().then((function(e){return l(JSON.parse('[["p-77c6f031.system",[[0,"data-table",{"uniqueID":[1025,"unique-i-d"],"language":[1025],"isCompact":[1028,"is-compact"],"hideDataTable":[1028,"hide-data-table"],"margin":[1040],"padding":[1040],"tableColumns":[1040],"secondaryTableColumns":[1040],"dataKeyNames":[1040],"data":[16],"secondaryData":[16],"unitTest":[1028,"unit-test"],"showTable":[32]}],[0,"keyboard-instructions",{"uniqueID":[1025,"unique-i-d"],"language":[1025],"geomType":[1025,"geom-type"],"groupName":[1025,"group-name"],"chartTag":[1025,"chart-tag"],"width":[1032],"isInteractive":[1028,"is-interactive"],"hasCousinNavigation":[1028,"has-cousin-navigation"],"disabled":[1028],"unitTest":[1028,"unit-test"],"showInstructions":[32],"showHeading":[32]}]]],["p-1a041b1e.system",[[0,"alluvial-diagram",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"linkData":[16],"nodeData":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"sourceAccessor":[1025,"source-accessor"],"targetAccessor":[1025,"target-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"nodeIDAccessor":[1025,"node-i-d-accessor"],"nodeConfig":[1040],"linkConfig":[1040],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"annotations":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-1cf6b0d7.system",[[0,"bar-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-487b73b7.system",[[0,"circle-packing",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"circlePadding":[1026,"circle-padding"],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[8],"uniqueID":[8,"unique-i-d"],"dataDepth":[1026,"data-depth"],"displayDepth":[1026,"display-depth"],"parentAccessor":[1025,"parent-accessor"],"nodeAccessor":[1025,"node-accessor"],"sizeAccessor":[1025,"size-accessor"],"colorPalette":[1025,"color-palette"],"colors":[1040],"cursor":[1025],"hoverStyle":[1040],"clickStyle":[1040],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"annotations":[1040],"accessibility":[1040],"suppressEvents":[1028,"suppress-events"],"interactionKeys":[1040],"hoverHighlight":[1040],"clickHighlight":[1040],"zoomToNode":[1040]}]]],["p-c3e24368.system",[[0,"clustered-bar-chart",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[8],"uniqueID":[8,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"reverseOrder":[1028,"reverse-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"groupIntervalRatio":[1026,"group-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"minValueOverride":[1026,"min-value-override"],"maxValueOverride":[1026,"max-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-93be920a.system",[[0,"dumbbell-plot",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"layout":[1025],"showBaselineX":[1028,"show-baseline-x"],"showBaselineY":[1028,"show-baseline-y"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"focusMarker":[1040],"marker":[1040],"barStyle":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"seriesLabel":[1040],"differenceLabel":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-26841c2b.system",[[0,"heat-map",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"xAccessor":[1025,"x-accessor"],"yAccessor":[1025,"y-accessor"],"valueAccessor":[1025,"value-accessor"],"xKeyOrder":[1040],"yKeyOrder":[1040],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"hideAxisPath":[1028,"hide-axis-path"],"colorPalette":[1025,"color-palette"],"colors":[1040],"colorSteps":[1026,"color-steps"],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"shape":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"suppressEvents":[1028,"suppress-events"],"unitTest":[4,"unit-test"]}]]],["p-dbfd9bc1.system",[[0,"line-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"showBaselineX":[1028,"show-baseline-x"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"showDots":[1028,"show-dots"],"dotRadius":[1026,"dot-radius"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"seriesLabel":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"referenceLines":[1040],"secondaryLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-7c07da50.system",[[0,"parallel-plot",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"seriesAccessor":[1025,"series-accessor"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"showBaselineX":[1028,"show-baseline-x"],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"strokeWidth":[1026,"stroke-width"],"showDots":[1028,"show-dots"],"dotRadius":[1026,"dot-radius"],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"seriesLabel":[1040],"maxValueOverride":[2,"max-value-override"],"minValueOverride":[2,"min-value-override"],"referenceLines":[1040],"secondaryLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-2a683080.system",[[0,"pie-chart",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"centerTitle":[1025,"center-title"],"centerSubTitle":[1025,"center-sub-title"],"height":[1026],"width":[1026],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"sortOrder":[1025,"sort-order"],"colorPalette":[1025,"color-palette"],"colors":[1040],"innerRatio":[1026,"inner-ratio"],"showEdgeLine":[1028,"show-edge-line"],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showPercentage":[1028,"show-percentage"],"showTooltip":[1028,"show-tooltip"],"showLabelNote":[1028,"show-label-note"],"labelOffset":[1026,"label-offset"],"dataLabel":[1040],"dataKeyNames":[1040],"tooltipLabel":[1040],"accessibility":[1040],"annotations":[1040],"referenceData":[16],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-0aca0fde.system",[[0,"scatter-plot",{"localization":[1040],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"margin":[1040],"padding":[1040],"highestHeadingLevel":[1032,"highest-heading-level"],"data":[16],"uniqueID":[1,"unique-i-d"],"xAccessor":[1025,"x-accessor"],"yAccessor":[1025,"y-accessor"],"sizeConfig":[1032,"size-config"],"groupAccessor":[1025,"group-accessor"],"xAxis":[1040],"yAxis":[1040],"showBaselineX":[1028,"show-baseline-x"],"showBaselineY":[1028,"show-baseline-y"],"colorPalette":[1025,"color-palette"],"colors":[1040],"dotRadius":[1026,"dot-radius"],"dotOpacity":[1026,"dot-opacity"],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"fitLineStyle":[1040],"dotSymbols":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"xMaxValueOverride":[2,"x-max-value-override"],"xMinValueOverride":[2,"x-min-value-override"],"yMaxValueOverride":[2,"y-max-value-override"],"yMinValueOverride":[2,"y-min-value-override"],"showFitLine":[1028,"show-fit-line"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-5874356c.system",[[0,"stacked-bar-chart",{"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"height":[1026],"width":[1026],"layout":[1025],"highestHeadingLevel":[1032,"highest-heading-level"],"margin":[1040],"padding":[1040],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"ordinalAccessor":[1025,"ordinal-accessor"],"valueAccessor":[1025,"value-accessor"],"groupAccessor":[1025,"group-accessor"],"sortOrder":[1025,"sort-order"],"xAxis":[1040],"yAxis":[1040],"wrapLabel":[1028,"wrap-label"],"normalized":[1028],"colorPalette":[1025,"color-palette"],"colors":[1040],"hoverStyle":[1040],"clickStyle":[1040],"referenceStyle":[1040],"cursor":[1025],"roundedCorner":[1026,"rounded-corner"],"barIntervalRatio":[1026,"bar-interval-ratio"],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"showTotalValue":[1028,"show-total-value"],"showTooltip":[1028,"show-tooltip"],"tooltipLabel":[1040],"accessibility":[1040],"legend":[1040],"annotations":[1040],"showZeroLabels":[1028,"show-zero-labels"],"minValueOverride":[1026,"min-value-override"],"maxValueOverride":[1026,"max-value-override"],"referenceLines":[1040],"suppressEvents":[1028,"suppress-events"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"unitTest":[4,"unit-test"]}]]],["p-757308c0.system",[[0,"world-map",{"highestHeadingLevel":[1032,"highest-heading-level"],"height":[1026],"width":[1026],"mainTitle":[1025,"main-title"],"subTitle":[1025,"sub-title"],"margin":[1040],"padding":[1040],"mapProjection":[1025,"map-projection"],"mapScaleZoom":[1026,"map-scale-zoom"],"quality":[1025],"data":[16],"uniqueID":[1,"unique-i-d"],"localization":[1040],"sortOrder":[1025,"sort-order"],"groupAccessor":[1025,"group-accessor"],"markerAccessor":[1025,"marker-accessor"],"markerNameAccessor":[1025,"marker-name-accessor"],"joinAccessor":[1025,"join-accessor"],"joinNameAccessor":[1025,"join-name-accessor"],"valueAccessor":[1025,"value-accessor"],"latitudeAccessor":[1025,"latitude-accessor"],"longitudeAccessor":[1025,"longitude-accessor"],"colorPalette":[1025,"color-palette"],"colors":[1040],"colorSteps":[1026,"color-steps"],"markerStyle":[1040],"countryStyle":[1040],"hoverStyle":[1040],"clickStyle":[1040],"cursor":[1025],"hoverOpacity":[1026,"hover-opacity"],"animationConfig":[1040],"showTooltip":[1028,"show-tooltip"],"accessibility":[1040],"legend":[1040],"showGridlines":[1028,"show-gridlines"],"tooltipLabel":[1040],"dataLabel":[1040],"dataKeyNames":[1040],"annotations":[1040],"maxValueOverride":[1026,"max-value-override"],"minValueOverride":[1026,"min-value-override"],"hoverHighlight":[1040],"clickHighlight":[1040],"interactionKeys":[1040],"suppressEvents":[1028,"suppress-events"],"unitTest":[4,"unit-test"]}]]]]'),e)}))}}}));