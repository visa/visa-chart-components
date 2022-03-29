/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { StackedBarChart } from './stacked-bar-chart';
import { StackedBarChartDefaultValues } from './stacked-bar-chart-default-values';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '../../../node_modules/@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '../../../node_modules/@visa/visa-charts-data-table/src/components/data-table/data-table';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';
import { nest } from 'd3-collection';

const { getColors, visaColors, formatStats, getContrastingStroke } = Utils;

const {
  asyncForEach,
  flushTransitions,
  parseTransform,
  unitTestAxis,
  unitTestGeneric,
  unitTestAccessibility,
  unitTestEvent,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<stacked-bar-chart>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new StackedBarChart()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      {
        year: '2016',
        otherCategory: '1990',
        otherGroup: 'D',
        otherValue: 15,
        item: 'A',
        value: -30,
        note: 'Worst performance in history.'
      },
      { year: '2016', otherCategory: '1990', otherGroup: 'E', otherValue: 25, item: 'B', value: -5 },
      { year: '2016', otherCategory: '1990', otherGroup: 'F', otherValue: 48, item: 'C', value: 22 },
      { year: '2017', otherCategory: '1991', otherGroup: 'D', otherValue: 27, item: 'A', value: 15 },
      { year: '2017', otherCategory: '1991', otherGroup: 'E', otherValue: 38, item: 'B', value: 40 },
      { year: '2017', otherCategory: '1991', otherGroup: 'F', otherValue: 31, item: 'C', value: 45 },
      { year: '2018', otherCategory: '1992', otherGroup: 'D', otherValue: 43, item: 'A', value: 26 },
      { year: '2018', otherCategory: '1992', otherGroup: 'E', otherValue: 13, item: 'B', value: 28 },
      { year: '2018', otherCategory: '1992', otherGroup: 'F', otherValue: 34, item: 'C', value: 31 }
    ];
    const EXPECTEDORDINALACCESSOR = 'item';
    const EXPECTEDGROUPACCESSOR = 'year';
    const EXPECTEDVALUEACCESSOR = 'value';
    const EXPECTEDUNIQUEID = 'stacked-bar-test';
    const MINVALUE = -30;
    const MAXVALUE = 45;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...StackedBarChartDefaultValues.accessibility, disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [StackedBarChart, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('stacked-bar-chart');
      component.uniqueID = EXPECTEDUNIQUEID;
      component.data = EXPECTEDDATA;
      component.unitTest = true;
      component.ordinalAccessor = EXPECTEDORDINALACCESSOR;
      component.groupAccessor = EXPECTEDGROUPACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
    });

    it('should build', () => {
      expect(new StackedBarChart()).toBeTruthy();
    });

    describe('render', () => {
      beforeEach(() => {
        // MOCK MATH.Random TO HANDLE UNIQUE ID CODE FROM ACCESSIBILITY UTIL
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
      });

      afterEach(() => {
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      it('should render with minimal props[data,oridnalAccessor,groupAccessor,valueAccessor] given', async () => {
        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        expect(page.root).toMatchSnapshot();
      });
    });

    describe('generic test suite', () => {
      Object.keys(unitTestGeneric).forEach(test => {
        const innerTestProps = unitTestGeneric[test].testDefault
          ? { [unitTestGeneric[test].prop]: StackedBarChartDefaultValues[unitTestGeneric[test].prop] }
          : unitTestGeneric[test].prop === 'data'
          ? { data: EXPECTEDDATA }
          : unitTestGeneric[test].testProps;
        const innerTestSelector =
          unitTestGeneric[test].testSelector === 'component-name'
            ? 'stacked-bar-chart'
            : unitTestGeneric[test].testSelector === '[data-testid=mark]'
            ? '[data-testid=marker]'
            : unitTestGeneric[test].testSelector;

        it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
          unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
      });
    });

    describe('accessibility', () => {
      describe('generic accessibility test suite', () => {
        const accessibilityTestMarks = {
          // when you click on a wrapper the util selects the svg instead, breaks this test
          // accessibility_keyboard_nav_group_enter_entry: {
          //   name: 'keyboard nav: group - enter will enter group',
          //   testSelector: '[data-testid=stacked-bar-wrapper][data-id=stacked-bar-wrapper-2016]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-2016-A]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 },
          //   testProps: {
          //     selectorAriaLabel: 'year 2016. Stack 1 of 3 which contains 3 interactive bars.',
          //     nextSelectorAriaLabel: 'year 2016. item A. value -30. Bar 1 of 3.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // },
          accessibility_keyboard_nav_group_esc_to_wrapper: {
            name: 'keyboard nav: group - escape will exit group',
            testSelector: '[data-testid=bar][data-id=bar-2016-A]',
            nextTestSelector: '[data-testid=stacked-bar-wrapper][data-id=stacked-bar-wrapper-2016]',
            keyDownObject: { key: 'Escape', code: 'Escape', keyCode: 27 },
            testProps: {
              selectorAriaLabel: 'year 2016. item A. value -30. Bar 1 of 3.',
              nextSelectorAriaLabel: 'year 2016. Sum -13. Stack 1 of 3 which contains 3 interactive bars.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          // esc from wrapper takes us to svg selection controller is empty in this case
          // accessibility_keyboard_nav_group_esc_exit: {
          //   name: 'keyboard nav: group - escape will exit group',
          //   testSelector: '[data-testid=stacked-bar-wrapper][data-id=stacked-bar-wrapper-2016]',
          //   nextTestSelector: '[data-testid=stacked-bar-group]',
          //   keyDownObject: { key: 'Escape', code: 'Escape', keyCode: 27 },
          //   testProps: {
          //     selectorAriaLabel: 'year 2016. Stack 1 of 3 which contains 3 interactive bars.',
          //     nextSelectorAriaLabel: 'Bar group which contains 12 interactive bars.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-2016-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-B]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'year 2016. item A. value -30. Bar 1 of 3.',
              nextSelectorAriaLabel: 'year 2016. item B. value -5. Bar 2 of 3.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=bar][data-id=bar-2016-C]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-A]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: '2016. C. 22. Bar 3 of 3.',
              nextSelectorAriaLabel: '2016. A. -30. Bar 1 of 3.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-2016-B]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-A]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'year 2016. item B. value -5. Bar 2 of 3.',
              nextSelectorAriaLabel: 'year 2016. item A. value -30. Bar 1 of 3.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=bar][data-id=bar-2016-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-C]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: '2016. A. -30. Bar 1 of 3.',
              nextSelectorAriaLabel: '2016. C. 22. Bar 3 of 3.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-2017-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-A]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: '2017. A. 15. Bar 1 of 3.',
              nextSelectorAriaLabel: '2016. A. -30. Bar 1 of 3.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=bar][data-id=bar-2016-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2018-A]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: '2016. A. -30. Bar 1 of 3.',
              nextSelectorAriaLabel: '2018. A. 26. Bar 1 of 3.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-2016-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2017-A]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: '2016. A. -30. Bar 1 of 3.',
              nextSelectorAriaLabel: '2017. A. 15. Bar 1 of 3.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=bar][data-id=bar-2018-A]',
            nextTestSelector: '[data-testid=bar][data-id=bar-2016-A]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'year 2018. item A. value 26. Bar 1 of 3.',
              nextSelectorAriaLabel: 'year 2016. item A. value -30. Bar 1 of 3.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: StackedBarChartDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            geometryType: 'Bar',
            geometryPlacementAttributes: ['x', 'y', 'height', 'width'],
            geometryAdjustmentValues: [
              { f: 'x', b: 7, w: 3, s: -1 },
              { f: 'y', b: 7, w: 3, s: -1 },
              { f: 'height', b: 7 * 2, w: 3 * 2, s: 1 },
              { f: 'width', b: 7 * 2, w: 3 * 2, s: 1 }
            ],
            annotations:
              unitTestAccessibility[test].prop === 'annotations'
                ? [
                    {
                      note: {
                        label: 'Product C saw strong gains until Product B was improved.',
                        bgPadding: { top: 0, bottom: 0, left: 5, right: 5 },
                        title: 'Temporary Growth',
                        lineType: 'none',
                        align: 'middle',
                        wrap: 225
                      },
                      accessibilityDescription:
                        "This annotation points to Product C's strong growth starting in 2016 but ending in 2018.",
                      y: [22],
                      x: '18%',
                      dy: [56.5],
                      dx: ['2017', '2016'],
                      className: 'stacked-chart-annotation',
                      type: 'annotationCalloutElbow'
                    },
                    {
                      note: {},
                      y: [45],
                      x: '33.6%',
                      dy: [56.5],
                      dx: ['2017', '2016'],
                      className: 'stacked-chart-annotation',
                      type: 'annotationCalloutElbow'
                    },
                    {
                      note: {},
                      y: [78],
                      x: '52.8%',
                      dy: [56.5],
                      dx: ['2017', '2016'],
                      className: 'stacked-chart-annotation',
                      type: 'annotationCalloutElbow'
                    }
                  ]
                : []
          };
          const innerTestSelector =
            unitTestAccessibility[test].testSelector === 'component-name'
              ? 'bar-chart'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=bar]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=stacked-bar-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=bar][data-id=bar-2016-A]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=bar][data-id=bar-2016-B]'
              : unitTestAccessibility[test].nextTestSelector;
          if (test === 'accessibility_keyboard_nav_generic_test') {
            // run keyboard nav test for each scenario above
            // skipping these by default as the target.focus() code in accessibilityController breaks them
            Object.keys(accessibilityTestMarks).forEach(keyboardTest => {
              it(`${unitTestAccessibility[test].prop}: ${accessibilityTestMarks[keyboardTest].name}`, () =>
                unitTestAccessibility[test].testFunc(
                  component,
                  page,
                  accessibilityTestMarks[keyboardTest].testProps
                    ? { ...innerTestProps, ...accessibilityTestMarks[keyboardTest].testProps }
                    : innerTestProps,
                  accessibilityTestMarks[keyboardTest].testSelector,
                  accessibilityTestMarks[keyboardTest].nextTestSelector,
                  accessibilityTestMarks[keyboardTest].keyDownObject
                ));
            });
          } else if (test === 'accessibility_focus_marker_style') {
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
            // skipping these by default as the target.focus() code in accessibilityController breaks them
          } else if (test === 'accessibility_focus_marker_style') {
            it.skip(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
          } else {
            // these tests can just be run straight away
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
          }
        });
      });
      describe('validation', () => {
        it('refer to generic results above for accessibility validation tests', () => {
          expect(true).toBeTruthy();
        });
      });
    });

    describe('base', () => {
      it('refer to generic results above for base tests', () => {
        expect(true).toBeTruthy();
      });
      describe('layout', () => {
        beforeEach(() => {
          jest.useFakeTimers('legacy');
        });
        afterEach(() => {
          jest.clearAllTimers();
        });
        // ARRANGE
        const nestCollection = nest()
          .key(d => d[EXPECTEDGROUPACCESSOR])
          .entries(EXPECTEDDATA);

        const datakeys = nestCollection.map(d => d.key);

        it('should render chart horizontally when layout prop is horizontal', async () => {
          // ARRANGE
          const EXPECTEDSCALEY0 = scaleBand()
            .domain(datakeys)
            .range([0, 500])
            .padding(0.2);

          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.layout = 'horizontal';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();

            expect(bar).toEqualAttribute('height', EXPECTEDSCALEY0.bandwidth());
          });
        });

        it('should render chart vertically when layout prop is vertical', async () => {
          // ARRANGE
          const EXPECTEDSCALEX0 = scaleBand()
            .domain(datakeys)
            .range([0, 500])
            .padding(0.2);

          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.layout = 'vertical';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALEX0.bandwidth());
          });
        });
      });
    });

    describe('margin & padding', () => {
      it('refer to generic results above for margin & padding tests', () => {
        expect(true).toBeTruthy();
      });
    });

    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      // Now it only tests against first word of title
      it('should pass annotation prop', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              label: 'Product C saw strong gains until Product B was improved.',
              bgPadding: { top: 0, bottom: 0, left: 5, right: 5 },
              title: 'Temporary Growth',
              lineType: 'none',
              align: 'middle',
              wrap: 225
            },
            accessibilityDescription:
              "This annotation points to Product C's strong growth starting in 2016 but ending in 2018.",
            y: [22],
            x: '18%',
            dy: [56.5],
            dx: ['2017', '2016'],
            className: 'stacked-chart-annotation',
            type: 'annotationCalloutElbow'
          },
          {
            note: {},
            y: [45],
            x: '33.6%',
            dy: [56.5],
            dx: ['2017', '2016'],
            className: 'stacked-chart-annotation',
            type: 'annotationCalloutElbow'
          },
          {
            note: {},
            y: [78],
            x: '52.8%',
            dy: [56.5],
            dx: ['2017', '2016'],
            className: 'stacked-chart-annotation',
            type: 'annotationCalloutElbow'
          }
        ];
        const data = [
          { year: '2016', item: 'A', value: -30 },
          { year: '2017', item: 'A', value: 15 },
          { year: '2018', item: 'A', value: 4 },
          { year: '2016', item: 'B', value: -5 },
          { year: '2017', item: 'B', value: 23 },
          { year: '2018', item: 'B', value: 6 },
          { year: '2016', item: 'C', value: 22 },
          { year: '2017', item: 'C', value: 45 },
          { year: '2018', item: 'C', value: 78 }
        ];
        const dataLabel = { visible: true, placement: 'top', labelAccessor: 'value', format: '0,0' };
        component.data = data;
        component.ordinalAccessor = 'item';
        component.valueAccessor = 'value';
        component.groupAccessor = 'year';
        component.dataLabel = dataLabel;
        component.annotations = annotations;

        // ACT
        page.root.append(component);
        await page.waitForChanges();

        // ASSERT
        const annotationGroup = await page.doc.querySelector('[data-testid=annotation-group]');
        expect(annotationGroup).toMatchSnapshot();
      });
    });

    describe('axes', () => {
      beforeEach(() => {
        jest.useFakeTimers('legacy');
      });

      afterEach(() => {
        jest.clearAllTimers();
      });
      describe('barIntervalRatio', () => {
        // ARRANGE
        const nestCollection = nest()
          .key(d => d[EXPECTEDGROUPACCESSOR])
          .entries(EXPECTEDDATA);
        const datakeys = nestCollection.map(d => d.key);

        beforeEach(() => {
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
        });

        it('should have ratio of 0.2 by default', async () => {
          // ARRANGE
          const EXPECTEDSCALEX0 = scaleBand()
            .domain(datakeys)
            .range([0, 500])
            .padding(0.2);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALEX0.bandwidth());
          });
        });
        it('should have ratio of 0.5 when passed on load', async () => {
          // ARRANGE
          const EXPECTEDSCALEX0 = scaleBand()
            .domain(datakeys)
            .range([0, 500])
            .padding(0.5);

          component.barIntervalRatio = 0.5;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALEX0.bandwidth());
          });
        });

        it('should have ratio of 0.5 when passed on update', async () => {
          // ARRANGE
          const EXPECTEDSCALEX0 = scaleBand()
            .domain(datakeys)
            .range([0, 500])
            .padding(0.5);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.barIntervalRatio = 0.5;
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALEX0.bandwidth());
          });
        });
      });

      // skipping max/min value override as we have to take stacks into account and this
      // is different than cluster
      describe.skip('minValueOverride', () => {
        // ARRANGE
        beforeEach(() => {
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
        });
        it('should have effect on bar size when minValueOverride is passed on load', async () => {
          const MINVALUEOVERRIDE = -40;
          const EXPECTEDSCALEX1 = scaleLinear()
            .domain([Math.min(0, MINVALUEOVERRIDE), MAXVALUE])
            .range([500, 0]);

          component.minValueOverride = MINVALUEOVERRIDE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar.__data__.value).toEqual(EXPECTEDDATA[i].value); // CHECK WE HAVE THE SAME DATA

            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALEX1(bar.__data__.stackEnd) - EXPECTEDSCALEX1(bar.__data__.stackStart)
            );
          });
        });

        it('should have effect on bar size when minValueOverride is passed on update', async () => {
          // ARRANGE
          const MINVALUEOVERRIDE = -40;
          const EXPECTEDSCALEX1 = scaleLinear()
            .domain([Math.min(0, MINVALUEOVERRIDE), MAXVALUE])
            .range([500, 0]);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.minValueOverride = MINVALUEOVERRIDE;
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALEX1(0) > EXPECTEDSCALEX1(EXPECTEDDATA[i].value)
                ? EXPECTEDSCALEX1(0) - EXPECTEDSCALEX1(EXPECTEDDATA[i].value)
                : EXPECTEDSCALEX1(EXPECTEDDATA[i].value) - EXPECTEDSCALEX1(0)
            );
          });
        });

        it('should have no effect on bar size when minValueOverride greater than minimum data value', async () => {
          // ARRANGE
          const MINVALUEOVERRIDE = -20;
          const EXPECTEDSCALEX1 = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUE])
            .range([500, 0]);

          component.minValueOverride = MINVALUEOVERRIDE;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALEX1(0) > EXPECTEDSCALEX1(EXPECTEDDATA[i].value)
                ? EXPECTEDSCALEX1(0) - EXPECTEDSCALEX1(EXPECTEDDATA[i].value)
                : EXPECTEDSCALEX1(EXPECTEDDATA[i].value) - EXPECTEDSCALEX1(0)
            );
          });
        });
      });

      describe.skip('maxValueOverride', () => {
        // ARRANGE
        beforeEach(() => {
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
        });
        it('should have effect on bar size when maxValueOverride is passed on load', async () => {
          const MAXVALUEOVERRIDE = 50;
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUEOVERRIDE])
            .range([500, 0]);

          component.maxValueOverride = MAXVALUEOVERRIDE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALE(0) > EXPECTEDSCALE(EXPECTEDDATA[i].value)
                ? EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value)
                : EXPECTEDSCALE(EXPECTEDDATA[i].value) - EXPECTEDSCALE(0)
            );
          });
        });

        it('should have effect on bar size when maxValueOverride is passed on update', async () => {
          // ARRANGE
          const MAXVALUEOVERRIDE = 50;
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUEOVERRIDE])
            .range([500, 0]);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.maxValueOverride = MAXVALUEOVERRIDE;
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALE(0) > EXPECTEDSCALE(EXPECTEDDATA[i].value)
                ? EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value)
                : EXPECTEDSCALE(EXPECTEDDATA[i].value) - EXPECTEDSCALE(0)
            );
          });
        });

        it('should have no effect on bar size when minValueOverride smaller than maximum data value', async () => {
          // ARRANGE
          const MAXVALUEOVERRIDE = 40;
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUE])
            .range([500, 0]);

          component.minValueOverride = MAXVALUEOVERRIDE;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute(
              'height',
              EXPECTEDSCALE(0) > EXPECTEDSCALE(EXPECTEDDATA[i].value)
                ? EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value)
                : EXPECTEDSCALE(EXPECTEDDATA[i].value) - EXPECTEDSCALE(0)
            );
          });
        });
      });
    });

    describe('generic axis tests', () => {
      Object.keys(unitTestAxis).forEach(test => {
        const yearTicks1 = ['2016', '2017', '2018'];
        const yearTicks2 = ['2016', '2017', '2018'];

        const numberTicks1 = ['-30', '-20', '-10', '0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];
        const numberTicks2 = [
          '-$30',
          '-$20',
          '-$10',
          '$0',
          '$10',
          '$20',
          '$30',
          '$40',
          '$50',
          '$60',
          '$70',
          '$80',
          '$90',
          '$100'
        ];

        const expectedValues = {
          xaxis_format_default: yearTicks1,
          yaxis_format_default: numberTicks1,
          xaxis_format_load: yearTicks2,
          yaxis_format_load: numberTicks2,
          xaxis_format_update: yearTicks2,
          yaxis_format_update: numberTicks2,
          xaxis_tickInterval_load: yearTicks2,
          yaxis_tickInterval_load: numberTicks2,
          xaxis_tickInterval_update: yearTicks2,
          yaxis_tickInterval_update: numberTicks2
        };

        const innerTestProps = unitTestAxis[test].testDefault
          ? { [unitTestAxis[test].prop]: StackedBarChartDefaultValues[unitTestAxis[test].prop] }
          : unitTestAxis[test].prop === 'data'
          ? { data: EXPECTEDDATA }
          : unitTestAxis[test].testProps;
        const innerTestSelector =
          unitTestAxis[test].testSelector === 'component-name' ? 'stacked-bar-chart' : unitTestAxis[test].testSelector;
        if (test === 'xaxis_grid_visible_load' || test === 'xaxis_grid_visible_update' || test === 'xaxis_unit_load') {
          // skipping these tests as they are not relevant to stacked bar chart
          it.skip(`${unitTestAxis[test].prop}: ${unitTestAxis[test].name}`, () =>
            unitTestAxis[test].testFunc(component, page, innerTestProps, innerTestSelector, expectedValues[test]));
        } else {
          it(`${unitTestAxis[test].prop}: ${unitTestAxis[test].name}`, () =>
            unitTestAxis[test].testFunc(component, page, innerTestProps, innerTestSelector, expectedValues[test]));
        }
      });
    });

    describe('data', () => {
      describe('uniqueId', () => {
        it('refer to generic results above for uniqueID tests', () => {
          expect(true).toBeTruthy();
        });
      });

      describe('data', () => {
        it('refer to generic results above for data tests', () => {
          expect(true).toBeTruthy();
        });
      });

      describe('sortOrder', () => {
        it('should render bars in order by default', async () => {
          // ARRANGE
          const expectedOrder = ['2016', '2017', '2018'];
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          const positions = {
            2016: 0,
            2017: 0,
            2018: 0
          };
          bars.forEach(bar => {
            positions[bar['__data__'][EXPECTEDGROUPACCESSOR]] = parseFloat(bar.getAttribute('x'));
          });
          // sort keys by values
          const sortedKeys = Object.keys(positions).sort((a, b) => positions[a] - positions[b]);
          sortedKeys.forEach((key, i) => {
            expect(key).toEqual(expectedOrder[i]);
          });
        });

        it('should render bars in sortOrder asc when passed as true on load', async () => {
          // ARRANGE
          jest.useFakeTimers('legacy');
          component.sortOrder = 'asc';
          const expectedOrder = ['2016', '2018', '2017'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          const positions = {
            2016: 0,
            2017: 0,
            2018: 0
          };
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();
            positions[bar['__data__'][EXPECTEDGROUPACCESSOR]] = parseFloat(bar.getAttribute('x'));
          });
          // sort keys by values
          const sortedKeys = Object.keys(positions).sort((a, b) => positions[a] - positions[b]);
          sortedKeys.forEach((key, i) => {
            expect(key).toEqual(expectedOrder[i]);
          });

          jest.clearAllTimers();
        });
        it('should render bars in sortOrder desc when passed as true on update', async () => {
          const expectedOrder = ['2017', '2018', '2016'];
          jest.useFakeTimers('legacy');

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sortOrder = 'desc';
          await page.waitForChanges();

          // ASSERT
          const bars = await page.doc.querySelectorAll('[data-testid=bar]');
          const positions = {
            2016: 0,
            2017: 0,
            2018: 0
          };
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();
            positions[bar['__data__'][EXPECTEDGROUPACCESSOR]] = parseFloat(bar.getAttribute('x'));
          });

          // sort keys by values and test that it matches order of bars
          const sortedKeys = Object.keys(positions).sort((a, b) => positions[a] - positions[b]);
          sortedKeys.forEach((key, i) => {
            expect(key).toEqual(expectedOrder[i]);
          });

          jest.clearAllTimers();
        });
      });
    });

    describe('interaction', () => {
      // the transitionEndAll is wrapped in a 0ms setTimeout for browser support
      // need to enable jest timers in order to enable code wrapped in the setTimeout(()=>{})
      beforeEach(() => {
        jest.useFakeTimers('legacy');
      });
      afterEach(() => {
        jest.clearAllTimers();
      });
      describe('bar based interaction tests', () => {
        const innerTestProps = {
          // set color palette to dark color to make sure morphology follows dark pattern
          colorPalette: 'single_blue',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5],
          transitionEndAllSelector: '[data-testid=bar]',
          runJestTimers: true
        };
        const innerTestSelector = '[data-testid=bar][data-id=bar-2016-A]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-2017-B]';
        Object.keys(unitTestInteraction).forEach(test => {
          it(`[${unitTestInteraction[test].group}] ${unitTestInteraction[test].prop}: ${
            unitTestInteraction[test].name
          }`, () =>
            unitTestInteraction[test].testFunc(
              component,
              page,
              innerTestProps,
              innerTestSelector,
              innerNegTestSelector
            ));
        });
      });

      describe('clickStyle with interaction keys', () => {
        const testLoad = 'interaction_clickStyle_custom_load';
        const testUpdate = 'interaction_clickStyle_custom_update';
        const innerTestSelector = '[data-testid=bar][data-id=bar-2016-A]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-2017-A]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year'],
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5],
          transitionEndAllSelector: '[data-testid=bar]',
          runJestTimers: true
        };

        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey group`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            innerTestProps,
            innerTestSelector,
            innerNegTestSelector
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey group`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            innerTestProps,
            innerTestSelector,
            innerNegTestSelector
          ));

        const newInnerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year', 'item'],
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5],
          transitionEndAllSelector: '[data-testid=bar]',
          runJestTimers: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-2016-A]',
            '[data-testid=bar][data-id=bar-2016-B]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-2016-A]',
            '[data-testid=bar][data-id=bar-2016-B]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=bar][data-id=bar-2016-A]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-2017-A]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year'],
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5],
          transitionEndAllSelector: '[data-testid=bar]',
          runJestTimers: true
        };

        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey group`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            innerTestProps,
            innerTestSelector,
            innerNegTestSelector
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey group`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            innerTestProps,
            innerTestSelector,
            innerNegTestSelector
          ));

        const newInnerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year', 'item'],
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5],
          transitionEndAllSelector: '[data-testid=bar]',
          runJestTimers: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-2016-A]',
            '[data-testid=bar][data-id=bar-2016-B]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-2016-A]',
            '[data-testid=bar][data-id=bar-2016-B]'
          ));
      });
    });

    describe('event-emitter', () => {
      // Open issue: https://github.com/ionic-team/stencil/issues/1964
      // Jest throwing TypeError : mouseover,mouseout, focus, blur etc.
      // TECH-DEBT: Once above issue is resolved, write more precise test for event params.
      beforeEach(() => {
        // MOCK MATH.Random TO HANDLE UNIQUE ID CODE FROM ACCESSIBILITY UTIL
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
      });

      afterEach(() => {
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(global.Math, 'random').mockRestore();
      });
      describe('generic event testing', () => {
        describe('bar based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              transitionEndAllSelector: '[data-testid=bar]'
            };
            const innerTestSelector = '[data-testid=bar]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
          });
        });
      });
    });

    describe('labels', () => {
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['item'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['item', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=bar][data-id=bar-2016-A]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b>A<br></b>X Axis:<b>2016</b><br>Y Axis:<b>-30</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>A</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>A</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>-$30</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>-$30</b><br></p>'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            // we have to handle clickEvent separately due to this.zooming boolean in circle-packing load

            it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name}`, () =>
              unitTestTooltip[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerTooltipContent[test]
              ));
          });
        });
      });
      describe('dataLabel', () => {
        describe('visible', () => {
          it('should render dataLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
          it('should not render the bar data labels if visible is false', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            component.dataLabel = {
              visible: false,
              labelAccessor: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
        });
        describe('labelAccessor', () => {
          it('should default to the value accessor if default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = await page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
          it('should render the data labels if visible is true', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            component.dataLabel = {
              visible: true,
              labelAccessor: 'otherValue',
              format: '0[.][0]%',
              position: 'top'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = await page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].otherValue, '0[.][0]%'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              position: 'top'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = await page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '$0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
        });
        describe('placement', () => {
          it('should place labels in middle of bars by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = await page.doc.querySelector('[data-testid=dataLabel]');
            const bar = await page.doc.querySelector('[data-testid=bar]');
            // get y and height of bar
            const barY = parseFloat(bar.getAttribute('y'));
            const barHeight = parseFloat(bar.getAttribute('height'));
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThanOrEqual(barY);
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(barY + barHeight);
          });
          it('should place labels on bottom of bars if passed', async () => {
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'bottom'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = await page.doc.querySelector('[data-testid=dataLabel]');
            const bar = await page.doc.querySelector('[data-testid=bar]');
            flushTransitions(label);
            flushTransitions(bar);
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThan(parseFloat(bar.getAttribute('y')));
          });
        });
      });

      describe('totalLabel', () => {
        describe('showTotalValue', () => {
          it('should render totalLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const totalLabel = page.doc.querySelector('[data-testid=totalLabel]');
            flushTransitions(totalLabel);
            await page.waitForChanges();
            expect(totalLabel).toEqualAttribute('opacity', 1);
          });
          it('should not render the bar total labels showTotalLabel is false', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            component.showTotalValue = false;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();
            const totalLabel = page.doc.querySelector('[data-testid=totalLabel]');
            flushTransitions(totalLabel);
            await page.waitForChanges();
            expect(totalLabel).toEqualAttribute('opacity', 0);
          });
        });
        describe('placement', () => {
          it('should place total labels on top of stacks by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = await page.doc.querySelector('[data-testid=totalLabel]');
            const bar = await page.doc.querySelector('[data-testid=bar]');
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(parseFloat(bar.getAttribute('y')));
          });
        });
      });

      describe('legend', () => {
        describe('visible', () => {
          it('by default the legend should render for stacked bar', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = await page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = await legendSVG.parentElement;
            const legendGs = await legendSVG.querySelector('g').querySelectorAll('g');
            expect(legendContainer.getAttribute('style')).toEqual('display: block;');
            expect(legendContainer).toHaveClass('stacked-bar-legend');
            expect(legendSVG).toEqualAttribute('opacity', 1);
            expect(legendGs.length).toEqual(3);
            expect(legendGs[0]).toHaveClass('legend');
            expect(legendGs[0]).toHaveClass('bar');
            expect(legendGs[0].childNodes.length).toEqual(2);
          });
          it('should render, but not be visible if false is passed', async () => {
            component.legend = {
              visible: false,
              interactive: false,
              type: 'bar',
              format: '0[.][0][0]a',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = await page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = await legendSVG.parentElement;
            const legendGs = await legendSVG.querySelector('g').querySelectorAll('g');
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            expect(legendContainer).toHaveClass('stacked-bar-legend');
            expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendGs.length).toEqual(3);
            expect(legendGs[0]).toHaveClass('legend');
            expect(legendGs[0]).toHaveClass('bar');
            expect(legendGs[0].childNodes.length).toEqual(2);
          });
        });
        describe('type', () => {
          it('should be bar default type by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendG = await page.doc.querySelector('[data-testid=legend-container] g g');
            expect(legendG).toHaveClass('legend');
            expect(legendG).toHaveClass('bar');
          });
          it('should be bar type even if another type is passed', async () => {
            component.legend = {
              visible: true,
              interactive: false,
              type: 'key',
              format: '0[.][0][0]a',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendG = await page.doc.querySelector('[data-testid=legend-container] g g');
            expect(legendG).toHaveClass('legend');
            expect(legendG).toHaveClass('bar');
          });
        });
        describe('interactive', () => {
          it('should not be interactive by deafult', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendG = await page.doc.querySelector('[data-testid=legend-container] g g');
            expect(legendG['__on']).toBeUndefined(); // tslint:disable-line: no-string-literal
          });
          it('should be interactive when interactive prop is true', async () => {
            component.legend = {
              visible: true,
              interactive: true,
              type: 'bar',
              format: '0[.][0][0]a',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendG = await page.doc.querySelector('[data-testid=legend-container] g g');
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
            component.legend = {
              visible: true,
              interactive: true,
              type: 'bar',
              format: '$0[.][0]a',
              labels: [15, 30, 45]
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendGText = await page.doc.querySelector('[data-testid=legend-container] g g text');
            flushTransitions(legendGText);
            expect(legendGText).toEqualText('$15');
          });
        });
        describe('labels', () => {
          it('should be equal to data values by default', async () => {
            // ARRANGE
            const EXPECTEDLABELS = ['A', 'B', 'C'];

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendGs = await page.doc.querySelectorAll('[data-testid=legend-container] g g');
            legendGs.forEach((legendG, i) => {
              const legendGText = legendG.querySelector('text');
              flushTransitions(legendGText);
              expect(legendGText).toEqualText(EXPECTEDLABELS[i]);
            });
          });
          it('should have custom labels when passed as prop', async () => {
            const EXPECTEDLABELS = ['D', 'E', 'F'];
            component.legend = {
              visible: true,
              interactive: true,
              type: 'bar',
              format: '',
              labels: EXPECTEDLABELS
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendGs = await page.doc.querySelectorAll('[data-testid=legend-container] g g');
            legendGs.forEach((legendG, i) => {
              const legendGText = legendG.querySelector('text');
              flushTransitions(legendGText);
              expect(legendGText).toEqualText(EXPECTEDLABELS[i]);
            });
          });
        });
      });
    });

    describe('reference line', () => {
      it('should pass referenceLines prop', async () => {
        // ARRANGE
        const referenceLines = [
          { label: 'Market', labelPlacementHorizontal: 'left', labelPlacementVertical: 'bottom', value: 30 }
        ];
        component.referenceLines = referenceLines;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLinesGroup = await page.doc.querySelector('[data-testid=reference-line-group]');
        expect(referenceLinesGroup).toMatchSnapshot();
      });

      it('should pass referenceStyle prop', async () => {
        // ARRANGE
        const referenceLines = [
          { label: 'Market', labelPlacementHorizontal: 'left', labelPlacementVertical: 'bottom', value: 30 }
        ];
        const referenceStyle = { color: 'pri_grey', dashed: '', opacity: 0.65, strokeWidth: '1px' };
        component.referenceLines = referenceLines;
        component.referenceStyle = referenceStyle;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLine = await page.doc.querySelector('.stacked-bar-reference-line');
        expect(referenceLine).toMatchSnapshot();
      });
    });

    describe('style with textures', () => {
      const EXPECTEDCOLORPALETTE = 'categorical';
      const EXPECTEDSCALE = getColors(
        EXPECTEDCOLORPALETTE,
        scaleOrdinal()
          .domain(EXPECTEDDATA.map(d => d.item))
          .domain()
      );
      const MARKSHAPETYPE = 'rect';
      const EXPECTEDTEXTURETYPE = ['path', 'circle', 'path', 'path', 'path', 'circle'];
      const EXPECTEDTEXTURESTROKE = ['stroke', 'fill', 'stroke', 'stroke', 'stroke', 'stroke'];

      describe('colorPalette', () => {
        it('should render texture categorical by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');

          // check pattern settings
          patterns.forEach((pattern, i) => {
            expect(pattern.querySelector(MARKSHAPETYPE)).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
            expect(pattern.querySelector(EXPECTEDTEXTURETYPE[i])).toEqualAttribute(
              EXPECTEDTEXTURESTROKE[i],
              getContrastingStroke(EXPECTEDSCALE(EXPECTEDDATA[i].item))
            );
          });

          // check bar pattern assignment
          bars.forEach((bar, i) => {
            const barFillURL = patterns[i % patterns.length].getAttribute('id');
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should load texture diverging R to B when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');

          // check pattern settings
          patterns.forEach((pattern, i) => {
            expect(pattern.querySelector(MARKSHAPETYPE)).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
            expect(pattern.querySelector(EXPECTEDTEXTURETYPE[i])).toEqualAttribute(
              EXPECTEDTEXTURESTROKE[i],
              getContrastingStroke(EXPECTEDSCALE(EXPECTEDDATA[i].item))
            );
          });

          // check bar pattern assignment
          bars.forEach((bar, i) => {
            const barFillURL = patterns[i % patterns.length].getAttribute('id');
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should update texture to diverging R to B when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');

          // check pattern settings
          patterns.forEach((pattern, i) => {
            expect(pattern.querySelector(MARKSHAPETYPE)).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
            expect(pattern.querySelector(EXPECTEDTEXTURETYPE[i])).toEqualAttribute(
              EXPECTEDTEXTURESTROKE[i],
              getContrastingStroke(EXPECTEDSCALE(EXPECTEDDATA[i].item))
            );
          });

          // check bar pattern assignment
          bars.forEach((bar, i) => {
            const barFillURL = patterns[i % patterns.length].getAttribute('id');
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should render sequential grey and color when colorPalette is sequential_grey', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');

          // check pattern settings
          patterns.forEach((pattern, i) => {
            expect(pattern.querySelector(MARKSHAPETYPE)).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
            expect(pattern.querySelector(EXPECTEDTEXTURETYPE[i])).toEqualAttribute(
              EXPECTEDTEXTURESTROKE[i],
              getContrastingStroke(EXPECTEDSCALE(EXPECTEDDATA[i].item))
            );
          });

          // check bar pattern assignment
          bars.forEach((bar, i) => {
            const barFillURL = patterns[i % patterns.length].getAttribute('id');
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
      });
      describe('colors', () => {
        it('should render colors texture instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763']; // has to much number of categories in data
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');

          // check pattern settings
          patterns.forEach((pattern, i) => {
            expect(pattern.querySelector(MARKSHAPETYPE)).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
            expect(pattern.querySelector(EXPECTEDTEXTURETYPE[i])).toEqualAttribute(
              EXPECTEDTEXTURESTROKE[i],
              getContrastingStroke(EXPECTEDSCALE(EXPECTEDDATA[i].item))
            );
          });

          // check bar pattern assignment
          bars.forEach((bar, i) => {
            const barFillURL = patterns[i % patterns.length].getAttribute('id');
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
      });
    });
    describe('style no textures', () => {
      const EXPECTEDCOLORPALETTE = 'categorical';
      const EXPECTEDSCALE = getColors(
        EXPECTEDCOLORPALETTE,
        scaleOrdinal()
          .domain(EXPECTEDDATA.map(d => d.item))
          .domain()
      );
      beforeEach(() => {
        component.accessibility = { ...component.accessibility, hideTextures: true };
        jest.useFakeTimers('legacy');
      });
      afterEach(() => {
        jest.clearAllTimers();
      });

      describe('colorPalette', () => {
        it('should render categorical by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          bars.forEach((bar, i) => {
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should load diverging R to B when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should update diverging R to B when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });

        it('should render sequential orange when colorPalette is sequential_orange', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_secOrange';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.item))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });

      describe('roundedCorner', () => {
        it('should render rectangle bars when roundedCorner is zero (default)', async () => {
          // ARRANGE
          const EXPECTEDROUNDEDCORNER = 0;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();

            expect(bar).toEqualAttribute('rx', EXPECTEDROUNDEDCORNER);
            expect(bar).toEqualAttribute('ry', EXPECTEDROUNDEDCORNER);
          });
        });

        it('should render rounded bars when roundedCorner is non-zero positive number', async () => {
          // ARRANGE
          const EXPECTEDROUNDEDCORNER = 5;
          component.roundedCorner = EXPECTEDROUNDEDCORNER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            // since we have a timeout in the transitionEndAll we need to advance timers
            if (i === bars.length - 1) jest.runOnlyPendingTimers();

            // now that we have advanced timers we can try to flushTransitions
            flushTransitions(bar);
            await page.waitForChanges();

            expect(bar).toEqualAttribute('rx', EXPECTEDROUNDEDCORNER);
            expect(bar).toEqualAttribute('ry', EXPECTEDROUNDEDCORNER);
          });
        });
      });
    });
    describe('aria-property', () => {
      // TODO: write unit test cases for aria-property
    });

    describe('methods', () => {
      // TODO: write unit test cases for component methods if any
    });
  });
});

// currently we have a bug where the test script will hang and not close properly
// if all tests pass, until this is resolved, we force fail a test at the end of the script
// to ensure tests close out and
describe('fake-test-fail-exit', () => {
  it('force fail to get tests to close jest testing script when all pass', () => {
    expect(false).toBeTruthy();
  });
});
