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

### <a name="accessibility_tests" href="#accessibility_tests">#</a> unitTestAccessibility [<>](./src/utils-dev/unit-test-accessibility.ts 'Source')

This collection of unit tests aims to validate the implementation of our `accessibility` properties/features on each chart. Currently the testing suite covers functionality including, but not limited too: headings/instructions, highestHeadingLevel, aria roles/labels on our geometries, groups and containers, keyboard navigation (enter, exit, sibling, cousin, selection, etc.), custom focus indicator and more. The unit testing functions in this file are coupled with the [accessibility prop](../types/README.md#accessibility) that [each Visa Chart Component](../bar-chart/README.md#accessibility-props) ships with.

<hr>
<br>

### <a name="axis_tests" href="#axis_tests">#</a> unitTestAxis [<>](./src/utils-dev/unit-test-axis.ts 'Source')

This collection of unit tests aims to validate the implementation of our `axis` properties/features on each chart. Currently the testing suite covers functionality defined in our [chart component's documentation for how to use the x and y axis props](../bar-chart/README.md#axis-props). Each of these features has an associated set of unit tests to test implementation of the feature set of each chart.

<hr>
<br>

### <a name="event_tests" href="#event_tests">#</a> unitTestEvent [<>](./src/utils-dev/unit-test-event.ts 'Source')

This collection of unit tests aims to validate the implementation of `events` which we emit from each chart, currently suppressEvents, click, hover and mouseOut. The tests use jest mock functions to validate that events can be listened for and callbacks fired with associated data objects as expected. You can find documentation about this part of the event and interaction pattern in our [chart component's documentation](../bar-chart/README.md#event-props).

<hr>
<br>

### <a name="generic_tests" href="#generic_tests">#</a> unitTestGeneric [<>](./src/utils-dev/unit-test-generic.ts 'Source')

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

You can find documentation about these props in our [chart component's documentation](../bar-chart/README.md#base-props).

<hr>
<br>

### <a name="interaction_tests" href="#interaction_tests">#</a> unitTestInteraction [<>](./src/utils-dev/unit-test-interaction.ts 'Source')

This collection of unit tests aims to validate the consistent interaction pattern we implement on each chart. It validates props like `cursor`, `hoverStyle`, `clickHighlight` and `hoverOpacity` are implemented correctly across the repo. You can find documentation about this part of the event and interaction pattern in our [chart component's documentation](../bar-chart/README.md#event-props).

<hr>
<br>

### <a name="label_tests" href="#label_tests">#</a> unitTestLabel [<>](./src/utils-dev/unit-test-label.ts 'Source')

This collection of unit tests is under development and yet to implemented as part of the wider unit testing suite.

<hr>
<br>

### <a name="tooltip_tests" href="#tooltip_tests">#</a> unitTestTooltip [<>](./src/utils-dev/unit-test-tooltip.ts 'Source')

This collection of unit tests aims to validate the consistent tooltip pattern we implement on each chart. It validates props like `showTooltip` and `tooltipLabel` are implemented correctly across the repo. You can find documentation about our tooltip pattern in our [chart component's documentation](../bar-chart/README.md#label-props).

<hr>
<br>

### <a name="utils_tests" href="#utils_tests">#</a> Testing Utilities [<>](./src/utils-dev/unit-test-utils.ts 'Source')

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

## Testing Use Case

It is vital to the longevity of VCC to understand how the testing suite can be used/modified/extended. The below use case explanation is introducing how testing works in practice.

![Software flow diagram of a testing use case. The numbers on this diagram correspond with the High Level Description section's numbered list of items. The items on the diagram and corresponding High Level Description items describe the testing use case.](./../utils-dev/docs/test-use-case.png 'Testing Use Case Diagram')

Note: the numbers on the above diagram correspond with the numbered list below.

### High Level Description

1. The `bar-chart-spec.tsx` is rendering the `bar-chart` component which is coded in the `bar-chart.tsx` file. In general, `*-spec.tsx` file is the unit testing file, that renders a component over and over again for every test we choose to run. The `bar-chart` component will be the focus of our unit testing use case.
2. When the `unitTest` flag is set to true, testing (selection) attributes (like `data-testid=chart-container`) are added to the component's DOM layers to make selection of specific parts of the component easier when the execution of the test(s) happen. For example, the `setTestingAttributes` function within `bar-chart.tsx` is assigning testing related `id`s to the component.
3. The `bar-chart-spec.tsx` (unit testing file) is used to configure and run different tests. Each test defined in this file is configured to run an instance of the `bar-chart` component. We can run tests specific to `bar-chart` in this file, and, we can also reference common (reusable) tests which can be run across a number of components. See Point 4 for details about common tests.
4. Common tests refer to tests that are grouped together according to focus area. These tests are defined and referenced above in this `README.md` file (e.g., [accessibility tests](#accessibility_tests)). Common tests are written in a reusable way, so they can be referenced by many components. There is an API like structure to these which enables the reuse across a number of components. Here is an example of the unit test for default height which is used across different chart components:

```js
/*
  test is exported as a named object, we loop through these in the *-spec.tsx testing files
*/
export const generic_height_default_load = {
  /* the prop this test will effect */
  prop: 'height',
  /* the group this prop belongs to */
  group: 'base',
  /* human friendly test name */
  name: 'default height on load',
  /* is test for a default behavior? */
  testDefault: true,
  /*
    testProps is an object which is looped through within the testFunc, this allows for custom prop assignments to be sent across unit testing for different charts. In some tests it has a default value, but often this is overridden by passing this object from the *-spec.tsx files
  */
  testProps: { height: 999999 },
  /*
    test selector, often used to classify and further the select the example DOM element of the chart, sometimes this will need to overridden in each chart's unit testing as well.
  */
  testSelector: '[data-testid=chart-container] svg',
  /*
    next test selector, similar to testSelector, but allows for a secondary selector to be passed. Useful when we have to different elements to test (e.g., keyboard navigation).
  */
  nextTestSelector: '[data-testid=chart-container] svg',
  /*
    the test function which contains all code needed to execute the common unit test. It will take in various variables (e.g., component) and these variables can change slightly depending on the test. This is example is simple and takes in the component, page, testProps and testSelector variables only.
  */
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
  /*
    ...
    unit test code
    ...
  */
```

Here is an example of calling a common test and configuring it specifically for a single test in our `bar-chart` component. In this example we are going to use our `accessibility_keyboard_nav_generic_test` within `unit-test-accessibility.ts` and configure it to test for using shift+tab to exit a group of bars on the chart.

```js
/* first we configure set up for how to the test in bar-chart */
const accessibilityTestMarks = {
   accessibility_keyboard_nav_group_shift_enter_exit: {
    name: 'keyboard nav: group - shift+enter will exit group',
    testSelector: '[data-testid=bar][data-id=bar-Apr-17]',
    nextTestSelector: '[data-testid=bar-group]',
    keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
    testProps: {
      selectorAriaLabel: 'month Apr-17. value 1.4m. Bar 1 of 12.',
      nextSelectorAriaLabel: 'Bar group which contains 12 interactive bars.',
      accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
    }
  },
/* ... more tests and their configurations declared here ... */
};

// in our *-spec.tsx file, we are going to loop through accessibility common tests.
Object.keys(unitTestAccessibility).forEach(test => {
  // then for the keyboard nav test specifically we are going to run multiple iterations
  if (test === 'accessibility_keyboard_nav_generic_test') {
    // run keyboard nav test for each scenario in accessibilityTestMarks
    Object.keys(accessibilityTestMarks).forEach(keyboardTest => {
      it(`${unitTestAccessibility[test].prop}: ${accessibilityTestMarks[keyboardTest].name}`, () =>
        // we run the testFunc and then pass the custom configs defined above
        unitTestAccessibility[test].testFunc(
          component, // an instance of the component created in *-spec.tsx file
          page, // an instance of stencil's SpecPage created in *-spec.tsx file
          accessibilityTestMarks[keyboardTest].testProps
            ? { ...innerTestProps, ...accessibilityTestMarks[keyboardTest].testProps }
            : innerTestProps,
          accessibilityTestMarks[keyboardTest].testSelector,
          accessibilityTestMarks[keyboardTest].nextTestSelector,
          accessibilityTestMarks[keyboardTest].keyDownObject
        ));
    });
  } // ... more else ifs and other tests run ...
```

While this example shows how to leverage a common test, we also create feature relevant tests directly in each chart's `*-spec.tsx` file.

### Components Related Test Modifications

When a component is modified, it is likely that tests will also need some modification(s) in order to keep up to date with the new component behavior. Thus, when this happens, we need to check the following:

- Upon completion of a new functionality or bug fixes, the unit testing suite should be run. If test failures are occurring, then it should be determined whether this is due to new functionality in the component that is affecting tests, or issues that have been introduced to the component. We may need to address the occurring issues in component changes, and/or update tests to match the expected behavior of a component.
- Tests may also fail due to snapshots becoming out of date. Testing snapshots need to be updated in one or many chart components. Documentation is provided in the root `README.md` on how to update snapshots when needed.
