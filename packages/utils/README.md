# Utils

**Visa Charts Utils (utils)** are utility components and functions which are imported and leveraged by all **Visa Chart Components (VCC)**. Many utils are leveraged by VCC to help each chart with specific core functionalities, and can be used alongside VCC or independently (in some cases).

## API Contents

<details open="open">
  <summary>Jump To:</summary>
  <ol>
    <li>
      <a href="#accessibility">Accessibility</a>
      <ul>
        <li><a href="#create-url">createUrl()</a></li>
      </ul>
    </li>
    <li>
      <a href="#annotations">Annotations</a>
      <ul>
        <li><a href="#annotate">annotate()</a></li>
      </ul>
    </li>
    <li>
      <a href="#axis">Axes</a>
    </li>
    <li>
      <a href="#browser-util">Browser and OS Detection</a>
      <ul>
        <li><a href="#get-browser">getBrowser()</a></li>
      </ul>
      <ul>
        <li><a href="#get-os">getOS()</a></li>
      </ul>
    </li>
    <li>
      <a href="#calculation">Calculating Stats</a>
      <ul>
        <li><a href="#least-squares">leastSquares()</a></li>
      </ul>
    </li>
    <li>
      <a href="#colors">Colors</a>
      <ul>
        <li><a href="#auto-text-color">autoTextColor()</a></li>
      </ul>
      <ul>
        <li><a href="#calculate-luminance">calculateLuminance()</a></li>
      </ul>
      <ul>
        <li><a href="#calculate-relative-luminanc">calculateRelativeLuminance()</a></li>
      </ul>
      <ul>
        <li><a href="#convert-visa-color">convertVisaColor()</a></li>
      </ul>
      <ul>
        <li><a href="#ensure-text-contrast">ensureTextContrast()</a></li>
      </ul>
      <ul>
        <li><a href="#get-accessible-strokes">getAccessibleStrokes()</a></li>
      </ul>
      <ul>
        <li><a href="#get-contrasting-stroke">getContrastingStroke()</a></li>
      </ul>
      <ul>
        <li><a href="#visa-color-to-he">visaColorToHex()</a></li>
      </ul>
    </li>
    <li>
      <a href="#data-labels">Data Labels</a>
    </li>
    <li>
      <a href="#data-transformation">Data Transformation</a>
      <ul>
        <li><a href="#fix-nested-sparseness">fixNestedSparseness()</a></li>
      </ul>
    </li>
    <li>
      <a href="#formatting-dates">Formatting Dates</a>
    </li>
    <li>
      <a href="#formatting-numbers">Formatting Numbers</a>
      <ul>
        <li><a href="#round-to">roundTo()</a></li>
      </ul>
    </li>
    <li>
      <a href="#interactivity">Interactivity</a>
    </li>
    <li>
      <a href="#legends">Legends</a>
    </li>
    <li>
      <a href="#licensing-bundle">License Bundle</a>
    </li>
    <li>
      <a href="#path-manipulations">Path Manipulations</a>
      <ul>
        <li><a href="#equalize-path">equalizePath()</a></li>
      </ul>
      <ul>
        <li><a href="#generalize-path">generalizePath()</a></li>
      </ul>
      <ul>
        <li><a href="#reduce-geo-precision">reduceGeoPathPrecision()</a></li>
      </ul>
      <ul>
        <li><a href="#resolve-lines">resolveLines()</a></li>
      </ul>
    </li>
    <li>
      <a href="#symbols">Symbols</a>
      <ul>
        <li><a href="#symbols-export">symbols()</a></li>
      </ul>
    </li>
    <li>
      <a href="#textures">Textures</a>
    </li>
    <li>
      <a href="#tooltips">Tooltips</a>
    </li>
    <li>
      <a href="#validation">Validation</a>
    </li>
  </ol>
</details>
<br>

## <a name="installation-steps">#</a> Installation Steps:

To use utils in your projects run `yarn add @visa/visa-charts-utils`. The utils export contains nearly 100 different functions across more than 2 dozen files. You can import only the utils you need into a specific file using a destructuring pattern, like so:

```js
import Utils from '@visa/visa-charts-utils
const {
  calculateLuminance,
  calculateRelativeLuminance
} = Utils;

const greyLuminance = calculateLuminance('#767676')
const whiteLuminance = calculateLuminance('white')
const wcagContrastRatio = calculateRelativeLuminance(greyLuminance,whiteLuminance)
```

## Overview of the utils

Each main util file is outlined below. Some of these utils are designed with environmental requirements (such as assuming an element uses d3's `__data__` DOM property), while others are made with a purely functional pattern and require no special setup to use right away. Purely functional exports are marked as `[ functional ]`.

<hr>
<br>

## <a name="accessibility" href="#accessibility">#</a> Accessibility [<>](./src/utils/applyAccessibility.ts 'Source')

This is a large collection of functionality meant to integrate accessibility into the VCC lifecycle, encompassing nearly 30 exports. Every function is expected to exist within the ecosystem of VCC, with one exception that is generalized. Many of the functions in this file interact closely with the [accessibility prop](../types/README.md#accessibility) that [each Visa Chart Component](../bar-chart/README.md#accessibility-props) ships with.

![An image depicting a chart and a series of symbols that resemble controls, such as left, right, select, undo, etc.](./docs/accessibility.jpg 'Accessibility controls shown over a chart')

### **Notable Exports:**

#### <a name='create-url' href='#create-url'>#</a> `createUrl(id: string) [ functional ]`:

This function expects a string formatted as a valid HTML id and will return a string that can be used to reference the element with that ID in style or attribute declarations. This function handles an array of strange browser and environment quirks when producing valid urls for style/attributes.

Example use:

```js
const textureID = 'custom-texture-fill';
const textureUrl = createUrl(textureID);
// simplest form returned is "url(#custom-texture-fill)"
select(element).attr('fill', textureUrl);
```

<hr>
<br>

## <a name="annotations" href="#annotations">#</a> Annotations [<>](./src/utils/annotation.ts 'Source')

This is a wrapper on [d3-svg-annotation](https://d3-annotation.susielu.com/) by Susie Lu that allows developers to specify data values (and use simple arithmetic operations) in addition to exact pixel or numeric dimensions (as is standard to d3-svg-annotation already).

![An image depicting an example annotation on a bar-chart component](./docs/annotation.jpg 'Annotation on a chart')

### **Notable Exports:**

#### <a name='annotate' href='#annotate'>#</a> `annotate({...})`:

Adds annotations to a chart, based on props sent to the chart. Developers can specify annotations using the documention provided by [d3-svg-annotation](https://d3-annotation.susielu.com/) as well as using data values.

Example annotation prop sent to a chart:

```jsx
<bar-chart
  {...props}
  annotations = [
    {
      "note": {
        "label": "Social Media Intern returned to college",
        "bgPadding": 20,
        "title": "Staff Change",
        "align": "middle",
        "wrap": 130
      },
      /*
        devs must explain where they are on a chart for users who cannot see
        this text is exposed to screen reader users in addition to note text
      */
      "accessibilityDescription": "There has been a drop in tweet activity due to staff change in Q3.",
      /*
        data objects can be passed in directly and will use the chart's scale
        if any other props are passed for x/y, those will override this object
      */
      "data": {
        "label": "Q3",
        "value": 2125
      },
      // if a value is wrapped in array brackets, it will use the chart's scale
      "y": [2600],
      // percentages may also be passed, in string format
      "x": "62%",
      // when no bracket or % is used, numbers result in actual pixel space
      "dy": -85,
      "type": "annotationCallout",
      "connector": {
        "end": "dot",
        "endScale": 3
      },
      // visa-charts colors can be passed in and will be used
      "color": "oss_dark_grey"
  ]
></bar-chart>
```

Example use by a Visa Chart Component:

```js
annotate({
  source: this.svg,
  data: this.annotations,
  xScale: this.x,
  xAccessor: this.ordinalAccessor,
  yScale: this.y,
  yAccessor: this.valueAccessor
});
```

<hr>
<br>

## <a name="axis" href="#axis">#</a> Axes [<>](./src/utils/axis.ts 'Source')

This util adds axes to Visa Chart Components, customizable by props sent to each chart. Inspired heavily by [d3.js's axis](https://github.com/d3/d3-axis), with modifications to suit VCC design system and lifecycle. The primary export function `drawAxis({...})` is expected to work with a Visa Chart Component. See a [chart component's documentation for how to use the x and y axis props](../bar-chart/README.md#axis-props).

<hr>
<br>

## <a name="browser-util" href="#browser-util">#</a> Browser and OS Detection [<>](./src/utils/browser-util.ts 'Source')

This util can be used to query which browser or operating system is being used, using a simple interface on top of [ua-parser-js](github.com/faisalman/ua-parser-js).

### **Notable Exports:**

#### <a name='get-browser' href='#get-browser'>#</a> `getBrowser()`:

This function returns a string representing the browser being used.

Example use:

```js
const browser = getBrowser(); // 'IE', 'Edge', 'Safari', etc
```

#### <a name='get-os' href='#get-os'>#</a> `getOS()`:

This function returns a string representing the operating system being used.

Example use:

```js
const os = getOS(); // 'Mac OS', 'Linux', etc
```

<hr>
<br>

## <a name="calculation" href="#calculation">#</a> Calculating Stats [<>](./src/utils/calculation.ts 'Source')

This util is leveraged by the scatter-plot Visa Chart Component to calculate its least squares coefficient for use in a fit line.

### **Notable Exports:**

#### <a name='least-squares' href='#least-squares'>#</a> `leastSquares(xSeries: number[], ySeries: number[]) [ functional ]`:

This function expects two arrays of numbers and will return an array containing the slope, intercept, and r-squared values based on the data.

![An image depicting an example scatterplot component with a fitted trend line.](./docs/least-squares.jpg 'Scatter plot with fit line')

Example use:

```js
const calculation = leastSquares([4, 5, 6, 7, 8], [1, 2, 3, 4, 5]); // [1, -3, 1]
```

<hr>
<br>

## <a name="colors" href="#colors">#</a> Colors [<>](./src/utils/colors.ts 'Source')

This util contains a wide array of color-related functions, some for convenient styling operations, others for leveraging VCC's color schemes, and others for ensuring accessibility programmatically.

### **Notable Exports:**

#### <a name='auto-text-color' href='#auto-text-color'>#</a> `autoTextColor(backgroundColor: string) [ functional ]`:

This function will find the most appropriate text color (foreground) given a background color. This function is designed with accessibility compliance in mind, using the [WCAG 2 contrast ratio formula](https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests) to find the highest contrast text possible. Any valid HTML string for a color may be sent: 'red', '#ffffff', 'rgb(12, 200, 15), etc. Alpha values will be ignored. A hex color will be returned, either '#ffffff' or '#222222'.

![An image depicting an example bar-chart component with different color text on each bar, to contrast against the different bar colors.](./docs/auto-text-color.jpg 'Bar chart with automatic text colors')

Example use:

```js
const textColorOnBlue = autoTextColor('blue'); // '#ffffff'
const textColorOnSoftWhite = autoTextColor('rgb(215, 215, 215)'); // '#222222'
```

<br>

#### <a name='calculate-luminance' href='#calculate-luminance'>#</a> `calculateLuminance(color: string) [ functional ]`:

This function will calculate the perceived luminance value of a valid HTML color. [Formula and specification from WCAG 2.0](https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests). Any valid HTML string for a color may be sent: 'red', '#ffffff', 'rgb(12, 200, 15), etc. Alpha values will be ignored. A number will be returned, between 0 (black, no luminance) and 1 (white, full luminance).

Example use:

```js
const whiteLuminance = calculateLuminance('#ffffff'); // 1
const blackLuminance = calculateLuminance('black'); // 0
```

<br>

#### <a name='calculate-relative-luminance' href='#calculate-relative-luminance'>#</a> `calculateRelativeLuminance(luminance1: number, luminance2: number) [ functional ]`:

This function will calculate the contrast ratio between two <a href='#calculate-luminance'>luminance values</a> according to accessibility standards. Luminance values must be a number between 0 and 1 (inclusive). Input luminance values may be supplied in any order, the output will always place the highest value as the numerator. [Formula and specification from WCAG 2.0](https://www.w3.org/TR/WCAG20-TECHS/G18.html#G18-tests). A number will be returned between 1 (the colors have identical luminance) and 21 (the colors are complete opposites, literally black and white).

Note that [WCAG 2.1 AA contrast ratio requirements](https://webaim.org/articles/contrast/) for non-text and large text contrast must be at least 3:1 and regular text must be at least 4.5:1.

Example use:

```js
const contrastRatioBW = calculateRelativeLuminance(whiteLuminance, blackLuminance); // 21
const contrastRatioWW = calculateRelativeLuminance(whiteLuminance, whiteLuminance); // 1
const contrastRatioBB = calculateRelativeLuminance(blackLuminance, blackLuminance); // 1
```

<br>

#### <a name='convert-visa-color' href='#convert-visa-color'>#</a> `convertVisaColor(colorArr: string[]) [ functional ]`:

This function expects an array of strings. It will assume the array contains only Visa Chart Component color codes if at least the first entry has an underscore in the string. For performance, no further checking or validation is done. Mixed arrays of color strings and VCC color codes may produce unwanted results. This operation is done in-place on the input array and will either return the array untouched or it will attempt to convert VCC color codes into hex codes.

Example use:

```js
const validScheme = convertVisaColor(['blue', 'green']); // ['blue', 'green']
const validVCCScheme = convertVisaColor(['oss_light_grey', 'oss_dark_grey']); // ['#D7D7D7', '#363636']
const invalidScheme = convertVisaColor(['oss_light_grey', 'green']); // ['#D7D7D7', undefined]
```

<br>

#### <a name='ensure-text-contrast' href='#ensure-text-contrast'>#</a> `ensureTextContrast(textColor: string) [ functional ]`:

This function takes a text color as an argument and will attempt to darken that color (while maintaining saturation and hue) until it passes [WCAG 2.1 AA contrast standards](https://webaim.org/articles/contrast/) (4.5:1). If it already passes, it will not be darkened. This function assumes the text is being used on a white background.

Note that any valid HTML string for a color may be sent: 'red', '#ffffff', 'rgb(12, 200, 15), etc. Alpha values will be ignored.

![An image depicting an example scatter plot component with different colored points and darker text matching a highlighted group of points.](./docs/ensure-text-contrast.jpg 'Scatter plot with automatically darkened text colors')

Example use:

```js
const geometryColor = '#8CD6C2';
const textColorToMatch = ensureTextContrast(geometryColor); // '#2e816b'
```

<br>

#### <a name='get-accessible-strokes' href='#get-accessible-strokes'>#</a> `getAccessibleStrokes(fillColor: string) [ functional ]`:

This function will find up to two strokes for a given input color for use as a border on a filled element or as a line (in the case of a line chart). Note that any valid HTML string for a color may be sent: 'red', '#ffffff', 'rgb(12, 200, 15), etc. Alpha values will be ignored.

The output is an array of hex codes. The first value is computed by <a href='#get-contrasting-stroke'>getContrastingStroke</a> and will always have a 3:1 contrast against the original color. If the original color is dark enough against white by itself, it is added to the array as a second color (this is done to programmatically signal whether the returned contrasting stroke should or should not be used, given the context).

To demonstrate: For Visa Chart Components with textures, the interior fill will always use the first color for the texture's stroke. If the fill is dark enough, no stroke will be shown on the exterior unless the chart is interacted with.

![An image depicting an example bar chart component with dark grey fill and light grey line pattern on it.](./docs/get-accessible-strokes.jpg 'Bar chart showing contrasting stroke textures')

Example use:

```js
const greyFill = '#767676';
const strokes = getAccessibleStrokes(greyFill); // ['#d2d2d2','#767676']
```

<br>

#### <a name='get-contrasting-stroke' href='#get-contrasting-stroke'>#</a> `getContrastingStroke(fillColor: string) [ functional ]`:

This function receives a color string and will return a color string that is at least 3:1 contrast against the original color. This function can help geometries pass [WCAG 2.1 non-text contrast ratio](https://webaim.org/articles/contrast/) requirements even when light colors are used as input to a component. Note that any valid HTML string for a color may be sent: 'red', '#ffffff', 'rgb(12, 200, 15), etc. Alpha values will be ignored.

![An image depicting an example scatter-plot component nearly white marks that have dark blue outlines.](./docs/get-contrasting-stroke.jpg 'Scatter plot showing high contrast strokes')

Example use:

```js
const nearlyWhiteFill = '#FEFEFF';
const highContrastStroke = getContrastingStroke(nearlyWhiteFill); // '#8484ff'
```

<br>

#### <a name='visa-color-to-hex' href='#visa-color-to-hex'>#</a> `visaColorToHex(color: string) [ functional ]`:

This function will take a string as input and return either a hex code based on a Visa Chart Components color code. If no VCC color code is passed, the original string is returned instead.

Example use:

```js
const ossToGreyHexCode = visaColorToHex('oss_dark_grey'); // '#363636'
const greyHexCode = visaColorToHex('#363636'); // '#363636'
```

<hr>
<br>

## <a name="data-labels" href="#data-labels">#</a> Data Labels [<>](./src/utils/dataLabel.ts 'Source')

This util is used to place and format data labels all across Visa Chart Components. Each chart has its own set of placement rules (if any). See a [chart component's documentation for how to use the dataLabel prop](../bar-chart/README.md#label-props).

<hr>
<br>

## <a name="data-transformation" href="#data-transformation">#</a> Data Transformation [<>](./src/utils/dataTransform.ts 'Source')

This util is used to perform various data preparation and transformation operations, primarily to prepare each [Visa Chart Component's data table](../data-table/README.md) props. One function is unused by VCC but is useful for developers wishing to create valid nested data.

### **Notable Exports:**

#### <a name='fix-nested-sparseness' href='#fix-nested-sparseness'>#</a> `fixNestedSparseness(data: any, ordinalAccessor: string, groupAccessor: string, valueAccessor: string, defaultValue?: number)`:

For charts that nest their data (Stacked Bar, Clustered Bar, etc), the data must not be sparse. This utility is an in-place operation on an array of objects that will add any missing datum with corresponding ordinal and group accessor values. Value accessor values will populate as either 0 (by default) or a provided default numeric value. Developers are expected to handle their own data preparation, this utility is provided as a convenience (and an example of one way this operation can be done).

As with any borrowed data algorithm, developers should assess this function to determine if it suits their needs before using.

Example use:

```js
// this dataset has 3 categories and 2 groups, but only 3 datum (should have 6)
const badData = [{ cat: 'a', group: 'x', val: 5 }, { cat: 'b', group: 'x', val: 5 }, { cat: 'c', group: 'y', val: 5 }];
fixNestedSparseness(this.badData, 'cat', 'group', 'val', 1);
/*
badData is no longer sparse and can be properly nested:
[
  {cat: "a", group: "x", val: 5},
  {cat: "b", group: "x", val: 5},
  {cat: "c", group: "y", val: 5},
  {val: 1, cat: "c", group: "x"},
  {val: 1, cat: "a", group: "y"},
  {val: 1, cat: "b", group: "y"}
]
*/
```

<hr>
<br>

## <a name="formatting-dates" href="#formatting-dates">#</a> Formatting Dates [<>](./src/utils/formatDate.ts 'Source')

This util is for formatting dates used in VCC data labels, tooltips, axes, and in accompanying data tables. For guidance on how to specify time formatting, see [d3-time-format](https://github.com/d3/d3-time-format) (which this util leverages).

<hr>
<br>

## <a name="formatting-numbers" href="#formatting-numbers">#</a> Formatting Numbers [<>](./src/utils/formatStats.ts 'Source')

This util is for formatting any non-date number used in VCC data labels, tooltips, axes, and in accompanying data tables. For guidance on how to specify number formatting, see [Numeral.js's formatting](http://numeraljs.com/#format) (which this util leverages).

### **Notable Exports:**

#### <a name='round-to' href='#round-to'>#</a> `roundTo(value: number, decimal: number) [ functional ]`:

[Rounding is an unbelievably complex issue](https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary) in any language that uses IEEE's standard for floating point numbers (virtually 99% of all languages, JavaScript/TypeScript included). This util allows a developer to specify which decimal point they would like to round to and has very few faults in how it implements rounding. This function uses `Number.EPSILON` as well as descaling (according to the desired decimal place).

Example use:

```js
Math.round(1.005 * 1000) / 1000; // Returns 1 instead of expected 1.01!
roundTo(1.005, 2); // 1.01

Number(parseFloat('1.555').toFixed(2)); // Returns 1.55 instead of 1.56.
roundTo(1.555, 2); // 1.56
```

<hr>
<br>

## <a name="interactivity" href="#interactivity">#</a> Interactivity [<>](./src/utils/interaction.ts 'Source')

This util handles verifying and executing all interaction state in Visa Chart Components: Checking hover status with `checkHovered()` when a chart receives `hoverHighlight` prop, click/select status with `checkClicked()` when a chart receives `clickHighlight` prop, or both at once using `checkInteraction()`. It also handles building custom SVG stroke filters using `buildStrokes()` (which could be useful to emulate, such as when a developer wants to build a custom legend to accompany a chart).

![An image depicting an example heat map component being focused by a keyboard and showing a tooltip.](./docs/interactivity.jpg 'Heat map showing focus and tooltip')

<hr>
<br>

## <a name="legends" href="#legends">#</a> Legends [<>](./src/utils/legend.ts 'Source')

This util handles building and maintaining lifecycle for legends (of all shapes and sizes) used in Visa Chart Components. Legend types range from gradients, to categorical blocks, lines, symbols, and diverging/sequential scales represented as range bands and ordinal blocks. This util is meant to be consumed by Visa Chart Components exclusively but could be leveraged by someone clever enough in their own environment.

![An example legend with 6 different line types shown.](./docs/legend.jpg 'Legend example for a line chart')

<hr>
<br>

## <a name="licensing-bundle" href="#licensing-bundle">#</a> License Bundle [<>](./src/utils/license.ts 'Source')

This simple util is in place to ensure that required open source licenses are bundled with our code, including our own. It is maintained by our team each time a new dependency is added to one of our components and attaches itself (an object containing license information) to the window ensuring all licenses associated with our packages can be found at `window.VisaChartsLibOSSLicenses` anywhere Visa Chart Components is being used. Dev dependencies are not included as they are not distributed via our minified builds.

```js
// an example of the license information maintained in this utility
const licenses = [
  {
    dependency: 'visa-chart-components',
    github_link: 'https://github.com/visa/visa-chart-components',
    license: {
      type: 'MIT',
      update_date: '11/15/2020',
      link: 'https://github.com/visa/visa-chart-components/blob/master/LICENSE.md',
      text: `
        Copyright (c) Visa, Inc.

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
      `
    }
  },
  // {...}, {...}]
```

<hr>
<br>

## <a name="path-manipulations" href="#path-manipulations">#</a> Path Manipulations [<a>](./src/utils/pathManipulation.ts 'Source')

This util hosts a series of algorithms used to produce optimized svg map paths, handle a novel transition pattern between two paths, and generalize and equalize paths for symbols (enabling them to transition between one another, like in our [Scatter Plot](../scatter-plot) component). All of these functions were created as scripts and run to pre-calculate assets in VCC with the exception of `resolveLines()`, which transitions lines in [Line Chart](../line-chart) and [Parallel Plot](../parallel-plot).

### **Notable Exports:**

#### <a name='equalize-path' href='#equalize-path'>#</a> `equalizePath(element: any, limit: number) [ functional ]`:

This function will take an [SVGGeometryElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement) and desired pixel length greater than or equal to the path's current length. This function will return a string that follows svg path standards with a point for every pixel desired in the final length. (The new path will have the same pixel length but with more points in it).

This can help one path transition smoothly into another path, but requires knowing which path has the highest length (you can use the DOM's native [getTotalLength()](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement/getTotalLength)). <a href="#generalize-path">Generalizing the paths</a> instead of equalizing can improve the frame rate performance of any transitions between paths but requires knowing the number of points between the two paths (rather than relying on their lengths).

Because this method adds repeating points to the end of a path, it will produce an "accordion-like" squeezing or stretching morph effect when changing to a line with a different length.

Example use:

```js
// make an object so we can easily describe shorter/longer paths later
const paths = {
  one: {
    element: pathA,
    length: 0
  },
  two: {
    element: pathB,
    length: 0
  }
};
// get lengths of each path
paths.one.length = paths.one.element.getTotalLength();
paths.two.length = paths.two.element.getTotalLength();

// figure out which one is the longer and shorter one
const longer = paths.one.length > paths.two.length ? 'one' : 'two';
const shorter = longer === 'one' ? 'two' : 'one';

// create equalized path for shorter element
const shorterEqualized = equalizePath(paths[shorter].element, paths[longer].length);
// set shorter path to the now equal, longer path
// this new path should appear virtually identical to its previous
paths[shorter].element.setAttribute('d', shorterEqualized);

// create equalized path for longer element
// this new path has the same length, but now has one point per pixel
// (it could have had 10 points but 400 pixels long, now it has 400 points)
const longerEqualized = equalizePath(paths[longer].element, paths[longer].length);
// set shorter path to the now equal, longer path
// this new path will appear identical to its previous
paths[longer].element.setAttribute('d', longerEqualized);

// transitioning between the two is now without any weird teleporting quirks
select(paths.one.element)
  .transition()
  .duration(750)
  .attr('d', paths.two.element.getAttribute('d'));
```

<br>

#### <a name='generalize-path' href='#generalize-path'>#</a> `generalizePath(element: any, targetLength: number) [ functional ]`:

Generalizing a path is a way transition efficiently between two states without path interpolation glitches as long as there is a known number of points between both path states beforehand. (This can be several orders of magnitude faster than <a href="#equalize-path">equalizing a path</a> in most cases.)

This function expects an [SVGGeometryElement](https://developer.mozilla.org/en-US/docs/Web/API/SVGGeometryElement) and a number to be used to divide the path into new point coordinates. This function will return a string that follows svg path standards.

Because this method adds points within a path, it will produce dividing/merging morph effect when changing to a line with a different length.

Example use (this can also be demonstrated by transitioning between symbols in the <a href="../scatter-plot">Scatter Plot</a> component):

(Note that the least common multiple is 6, but you can [compute least common multiple between a pair of numbers](https://www.w3resource.com/javascript-exercises/javascript-math-exercise-10.php) yourself if you want. Calculation function is omitted for simplicity.)

```js
// make an object so we can easily describe paths
// points are based on known dataset lengths for this example
const paths = {
  one: {
    element: pathA,
    pointsInPath: 2
  },
  two: {
    element: pathB,
    pointsInPath: 3
  }
};

// find least common multiple between pair of numbers
const lcm = lcmFromPair(paths.one.pointsInPath, paths.two.pointsInPath); // 6

// generalize each path
const oneGeneralized = generalizePath(paths.one.element, 6);
const twoGeneralized = generalizePath(paths.two.element, 6);

// set first path to new generalized path -- it should still look the same
paths.one.element.setAttribute('d', oneGeneralized);

// transition to new path state -- this should be without quirks/glitches
select(paths.one.element)
  .transition()
  .duration(750)
  .attr('d', twoGeneralized);
```

<br>

#### <a name='reduce-geo-precision' href='#reduce-geo-precision'>#</a> `reduceGeoPathPrecision(element: any, percentReduction: number)`:

Most paths used in svg-based maps are much higher fidelity than necessary due to the precision of coordinates used in the path data. When viewing a map zoomed out or in a small size, this can significantly reduce the size of memory used. This script can be used to pre-compute large batches of svg paths (you can also just use [Turf.js](https://turfjs.org/), which is algorithmically better in most situations but doesn't operate on svg paths directly). This function calls `adjustAndTrimGeoPath()` and `findPathExtents()`, which are also in the same util file.

Example use (this is also used in the <a href="../world-map">World Map</a> component):

```js
const lowerFidelityPath = reduceGeoPathPrecision(svgCountryElement, 0.05);
svgCountryElement.setAttribute('d', lowerFidelityPath); // much smaller size of memory usage
```

<br>

#### <a name='resolve-lines' href='#resolve-lines'>#</a> `resolveLines(left: any, right: any, key: string) [ functional ]`:

Transition animations between paths and lines can be a difficult thing to consider and the algorithms used to prepare paths for transitioning affect the user's experience of the changing line state. Part of VCC's motion design considerations for chart transitions involves minimizing movement that is unnecessary while also maximizing the user's ability to retain object constancy. When it comes to making object constancy easier, the transition's easing can help. But reducing moving parts (unless those parts change) requires careful algorithmic prep work. This function is how VCC handles transitioning line states (like in in [Line Chart](../line-chart) and [Parallel Plot](../parallel-plot)) to meet these UX needs.

This function accepts a left dataset (the dataset a path is currently based on) and a right dataset (the dataset that will now be used for that path). The final argument is a key used to determine uniqueness of data points in the path (in order to identify which individual points have been added, removed, or are still present). This function returns an array of two new datasets, one based on the left dataset and one based on the right. These new datasets share the same number of data points but when rendered as paths will look identical to paths rendered using the left and right datasets.

This method will make new points sprout from (and old points collapse into) their nearest-existing, left-preferred neighbor. When no left neighbor exists, the nearest right neighbor is used.

Example use:
(This example uses a `lineGenerator()` function, but you will need to build your own. A good example for turning data into svg path's `d` attribute is [d3's line method](https://github.com/d3/d3-shape#lines).)

```js
// we are using our old data, new data, and a unique key to create interpolation data
const interpolationData = resolveLines(oldData, newData, ordinalAccessor);

// we are using
pathElement.setAttribute('d', lineGenerator(interpolationData[0]));

// transition to new path state
select(pathElement)
  .transition()
  .duration(750)
  .attr('d', lineGenerator(interpolationData[1]));
```

<hr>
<br>

## <a name="symbols" href="#symbols">#</a> Symbols [<>](./src/utils/symbols.ts 'Source')

This util holds data for symbol elements used by VCC, notably in the [Scatter Plot](../scatter-plot) component. These symbols can be accessed and used in a different environment or even in situations where you build your own custom legend.

![An example scatter plot chart that uses symbols for different categories of marks.](./docs/symbols.jpg 'Symbols shown on a scatter plot')

### **Notable Exports:**

#### <a name='symbols-export' href='#symbols-export'>#</a> `symbols() [ functional ]`:

This function has no arguments and will return an array of all symbol path data. Each symbol property (`circle`, `cross`, `diamond`, `square`, `star`, and `triangle`) each has two different path properties that can be used for rendering. Both paths look identical. One path is the `base` path and is the simplest, smallest-memory version of that symbol. The other path is `general` and has been <a href="#generalize-line">generalized</a> with every other symbol (so that they can transition smoothly between one another).

Example use:

```js
// use simple base by default - uses a little less memory
path.setAttribute(symbols().square.base);

if (symbolTypeIsChanging) {
  // set to a base that can transition
  path.setAttribute(symbols().square.general);

  // now the transition is smooth and delightful
  select(path)
    .transition()
    .duration(750)
    .attr('d', symbols().star.general);
}
```

<hr>
<br>

## <a name="textures" href="#textures">#</a> Textures [<a>](./src/utils/textures.ts 'Source')

This util contains an array of functions that are used to handle creating textures and stroke filters for charts, for accessibility purposes. All of these functions are designed to be integrated into a VCC ecosystem, but it is possible to leverage `convertColorsToTextures({...})` to emulate the textures on a chart (for creating a custom legend or something else).

Textures in VCC are designed to always have <a href="#get-contrasting-stroke">strokes which contrast against their base fill</a> color by at least 3:1, while the stroke filters (multiple strokes layered onto each element) are designed with an exterior white stroke, followed by either the geometry's edge (if it is dark enough against white) or else a stroke that is at least 3:1 against white. Textures and strokes work together in harmony. The stroke filter also creates a 1px inner border that cleans up the edges of any textures from touching the exterior strokes.

![An example stacked bar chart that has strokes and textures applied.](./docs/textures.jpg 'Textures and strokes shown on a stacked bar chart')

<hr>
<br>

## <a name="tooltips" href="#tooltips">#</a> Tooltips [<a>](./src/utils/tooltip.ts 'Source')

This util exports functions that manage and maintain the tooltips shown on a chart. For more information on how to specify props to change the format and display of tooltips, see the [tooltip section of label props documentation](../bar-chart/README.md#label-props) of any chart.

![An example pie chart with a tooltip shown.](./docs/tooltip.jpg 'Tooltip shown on a pie chart')

<hr>
<br>

## <a name="validation" href="#validation">#</a> Validation [<a>](./src/utils/validate-accessibility-props.ts 'Source')

Accessibility validation is a powerful dev-experience feature that comes baked into the VCC ecosystem. This util will validate the accessibility props passed by the user to a chart and encourage them to make better decisions by posting suggestions and warnings in a browser's JavaScript console. While this util has no notable exports, we want it to stand as an example of a way to encourage accessibility development early on.

You can learn more about the accessibility prop and how to turn validation off by checking the props documentation for any chart. Note that validation **should** be disabled before building and deploying but **only** once a chart is considered an accessible data experience.

![A view of a browser's JavaScript console, with multiple warnings and messages related to accessibility displayed.](./docs/validation.jpg 'Warning devs about accessibility failures in the console')

<hr>
<br>

## Visa Chart Components with `Ready` status that use our utils

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
