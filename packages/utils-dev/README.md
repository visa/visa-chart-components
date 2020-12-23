# Utils (Development)

#### @visa/visa-charts-utils-dev

**Visa Charts Utils Dev (utils-dev)** are development (e.g., dev dependency) utility components and functions which are imported and leveraged by all **Visa Chart Components (VCC)**. The vast majority of development utils are leveraged to abstract unit testing procedures so that they can be used across multiple charts. We leverage [Stencil's Unit Testing](https://stenciljs.com/docs/unit-testing) approach, which ultimately relies on [Jest](https://jestjs.io/) and [jsdom](https://github.com/jsdom/jsdom). Development utilities are not meant to be bundled in a build and should only be leveraged as devDependencies, hence the package separation from our [utils](../utils).

## API Contents

- [Accessibility](#accessibility_tests)
- [Axis](#axis_tests)
- [Event](#event_tests)
- [Generic](#generic_tests)
- [Interaction](#interaction_tests)
- [Label](#label_tests) - in development
- [Tooltip](#tooltip_tests)
- [Testing utils](#utils_tests)

## Installation Process:

To use our development utils in your projects run `yarn add @visa/visa-charts-utils-dev`. The development utils export contains groups of tests for each area listed above. You can see in the [testing of our bar-chart component](../bar-chart/src/components/bar-chart/bar-chart.spec.tsx) the import and usage pattern needed to take advantage of these unit tests. These tests are tightly coupled to our component patterns and implementations; but could be abstracted further.

```js
// code snippet from ../bar-chart/src/components/bar-chart/bar-chart.spec.tsx
//...
import UtilsDev from '@visa/visa-charts-utils-dev';

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('generic test suite', () => {
  Object.keys(unitTestGeneric).forEach(test => {
    const innerTestProps = unitTestGeneric[test].testDefault
      ? { [unitTestGeneric[test].prop]: BarChartDefaultValues[unitTestGeneric[test].prop] }
      : unitTestGeneric[test].prop === 'data'
      ? { data: EXPECTEDDATA }
      : unitTestGeneric[test].testProps;
    const innerTestSelector =
      unitTestGeneric[test].testSelector === 'component-name'
        ? 'bar-chart'
        : unitTestGeneric[test].testSelector === '[data-testid=mark]'
        ? '[data-testid=bar]'
        : unitTestGeneric[test].testSelector;
    it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
      unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
  });
});
//...
```

## Overview of the development utils

Each main development util file is outlined below. As mentioned above the unit tests are implemented with some tight coupling to our component implementations and property feature set. Each battery of unit tests (e.g., accessibility) is exported as a single object (e.g., `unitTestAxis`) which can be iterated through using the `Object.keys().forEach()` pattern shown above.

<hr>
<br>

### <a name="accessibility_tests" href="#accessibility_tests">#</a> unitTestAccessibility [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-accessibility.ts 'Source')

This collection of unit tests aims to validate the implementation of our `accessibility` properties/features on each chart. Currently the testing suite covers functionality including, but not limited too: headings/instructions, highestHeadingLevel, aria roles/labels on our geometries, groups and containers, keyboard navigation (enter, exit, sibling, cousin, selection, etc.), custom focus indicator and more. The unit testing functions in this file are coupled with the [accessibility prop](https://github.com/visa/visa-chart-components/packages/types/README.md#accessibility) that [each Visa Chart Component](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#accessibility-props) ships with.

<hr>
<br>

### <a name="axis_tests" href="#axis_tests">#</a> unitTestAxis [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-axis.ts 'Source')

This collection of unit tests aims to validate the implementation of our `axis` properties/features on each chart. Currently the testing suite covers functionality defined in our [chart component's documentation for how to use the x and y axis props](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#axis-props). Each of these features has an associated set of unit tests to test implementation of the feature set of each chart.

<hr>
<br>

### <a name="event_tests" href="#event_tests">#</a> unitTestEvent [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-event.ts 'Source')

This collection of unit tests aims to validate the implementation of `events` which we emit from each chart, currently suppressEvents, click, hover and mouseOut. The tests use jest mock functions to validate that events can be listened for and callbacks fired with associated data objects as expected. You can find documentation about this part of the event and interaction pattern in our [chart component's documentation](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#event-props).

<hr>
<br>

### <a name="generic_tests" href="#generic_tests">#</a> unitTestGeneric [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-generic.ts 'Source')

This collection of unit tests aims to validate the implementation of some our basic props which are widely used across our chart components. For example, `height` and `margin` are two props which exist on every chart and can be tested using the same pattern via this development utility. Currently this testing suite reviews the following props:

- height
- width
- mainTitle
- subTitle
- margin
- padding
- uniqueID
- data
- accessibility.disableValidation (will be moved to unitTestAccessibility)

You can find documentation about these props in our [chart component's documentation](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#base-props).

<hr>
<br>

### <a name="interaction_tests" href="#interaction_tests">#</a> unitTestInteraction [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-interaction.ts 'Source')

This collection of unit tests aims to validate the consistent interaction pattern we implement on each chart. It validates props like `cursor`, `hoverStyle`, `clickHighlight` and `hoverOpacity` are implemented correctly across the repo. You can find documentation about this part of the event and interaction pattern in our [chart component's documentation](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#event-props).

<hr>
<br>

### <a name="label_tests" href="#label_tests">#</a> unitTestLabels [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-labels.ts 'Source')

This collection of unit tests is under development and yet to implemented as part of the wider unit testing suite.

<hr>
<br>

### <a name="tooltip_tests" href="#tooltip_tests">#</a> unitTestTooltip [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-tooltip.ts 'Source')

This collection of unit tests aims to validate the consistent tooltip pattern we implement on each chart. It validates props like `showTooltip` and `tooltipLabel` are implemented correctly across the repo. You can find documentation about our tooltip pattern in our [chart component's documentation](https://github.com/visa/visa-chart-components/packages/bar-chart/README.md#label-props).

<hr>
<br>

### <a name="utils_tests" href="#utils_tests">#</a> Testing Utilities [<>](https://github.com/visa/visa-chart-components/packages/utils-dev/src/utils-dev/unit-test-utils.ts 'Source')

A collection of helpful js utilities to facilitate unit testing of [d3](https://d3js.org) on [jsdom](https://github.com/jsdom/jsdom).

#### **Notable Exports:**

<a name='asyncForEach' href='#asyncForEach'>#</a> `asyncForEach(group, callback)`:
This function will enable the use of .forEach loop in an async/await manner. It is used to avoid unhandled promise return when running async unit tests across multiple elements. This can be useful when you need to run flushTransitions on all elements to trigger `transitionEndAll` behavior. This utility function is adapted from this [codeburst thread](https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404).

Example use:

```js
//...
await page.waitForChanges();

// ASSERT
const bars = page.doc.querySelectorAll('[data-testid=bar]');
await asyncForEach(bars, async bar => {
  flushTransitions(bar);
  await page.waitForChanges();
  expect(bar).toEqualAttribute('height', EXPECTEDSCALE.bandwidth());
});
//...
```

<br>

<a name='flushTransitions' href='#flushTransitions'>#</a> `flushTransitions(mockElement)`:
This function will attempt to flush all pending transitions on a mockElement in jsdom. This can be useful when testing elements of our charts which leverage [d3-transition](https://github.com/d3/d3-transition). If transitions can be flushed, the mockElement passed into the function will have its attributes updated according to the end state of the transition taking effect. This cannot be used to test ticks of a transition, only the end state of one. This utility function is adapted from this [d3 issue thread](https://github.com/d3/d3/issues/1789).

Example use:

```js
//...
// ASSERT
const expectedOutputBeforeTransition = 90;
const expectedOutputAfterTransition = 100;
const element = page.doc.querySelector('[data-testid=chart-container]');
expect(element).toEqualAttribute('height', expectedOutputBeforeTransition); // this attribute will have the state of the element pre transition
flushTransitions(element);
await page.waitForChanges();
expect(element).toEqualAttribute('height', expectedOutputAfterTransition); // this attribute will have the end state of the element post transition
```

<br>

<a name='parseTransform' href='#parseTransform'>#</a> `parseTransform(element.getAttribute('transform'))`:
This function will parse the transform attribute of a DOM element to simplify testing of various transform sub-properties. For example, it will take the transform value of `transform: translate(1, 0)` and return an object like `{ translate: [1, 0] }`. This utility function is adapted from this [stack overflow thread](https://stackoverflow.com/questions/17824145/parse-svg-transform-attribute-with-javascript).

Example use:

```js
//...
await page.waitForChanges();
const transformData = parseTransform(xAxisTick.getAttribute('transform'));
expect(parseFloat(transformData['translate'][0])).toBeLessThan(2);
//...
```
