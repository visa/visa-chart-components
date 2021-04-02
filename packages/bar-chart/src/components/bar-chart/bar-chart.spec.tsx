/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { BarChart } from './bar-chart';
import { BarChartDefaultValues } from './bar-chart-default-values';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, visaColors, formatStats, getContrastingStroke } = Utils;

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<bar-chart>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new BarChart()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { month: 'Apr-17', value: 1407543, cat: 'A' },
      { month: 'May-17', value: 6042320, cat: 'A' },
      { month: 'Jun-17', value: 3234002, cat: 'A' },
      { month: 'Jul-17', value: 2221233, cat: 'B' },
      { month: 'Aug-17', value: 4476321, cat: 'A' },
      { month: 'Sep-17', value: 3789221, cat: 'B' },
      { month: 'Oct-17', value: 6543535, cat: 'B' },
      { month: 'Nov-17', value: 7457432, cat: 'A' },
      { month: 'Dec-17', value: 2636346, cat: 'B' },
      { month: 'Jan-18', value: 2340000, cat: 'C' },
      { month: 'Feb-18', value: 3202340, cat: 'A' },
      { month: 'Mar-18', value: 8503536, cat: 'B' }
    ];
    const EXPECTEDORDINALACCESSOR = 'month';
    const EXPECTEDVALUEACCESSOR = 'value';
    const MINVALUE = 1407543;
    const MAXVALUE = 8503536;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...BarChartDefaultValues.accessibility, disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [BarChart],
        html: '<div></div>'
      });
      component = page.doc.createElement('bar-chart');
      component.data = [...EXPECTEDDATA];
      component.ordinalAccessor = EXPECTEDORDINALACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.uniqueID = 'bar-chart-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new BarChart()).toBeTruthy();
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

      it('should render with minimal props[data,oridnalAccessor,valueAccessor] given', async () => {
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
        if (unitTestGeneric[test].prop === 'margin' || unitTestGeneric[test].prop === 'padding') {
          // skip margin and padding until we can solve issues with parseSVG() and jsdom mocked SVG elements
          it.skip(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        } else {
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        }
      });
    });

    describe('accessibility', () => {
      describe('generic accessibility test suite', () => {
        // LEFT OFF HERE LEFT OFF HERE LEFT OFF HERE
        // PROBABLY WANT TO CREATE SEPARATE TEST FOR ENTER EXIT? LEAVING THOSE COMMENTED OUT FOR NOW
        // WHAT ABOUT GROUP SIBLING NAVIGATION?
        const accessibilityTestMarks = {
          // accessibility_keyboard_nav_group_enter_entry: {
          //   name: 'keyboard nav: group - enter will enter group',
          //   testSelector: '[data-testid=bar-group]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 }
          // },
          accessibility_keyboard_nav_group_esc_exit: {
            name: 'keyboard nav: group - escape will exit group',
            testSelector: '[data-testid=bar][data-id=bar-Apr-17]',
            nextTestSelector: '[data-testid=bar-group]',
            keyDownObject: { key: 'Escape', code: 'Escape', keyCode: 27 },
            testProps: {
              selectorAriaLabel: 'month Apr-17. value 1.4m. Bar 1 of 12.',
              nextSelectorAriaLabel: 'Bar group which contains 12 interactive bars.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-Apr-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-May-17]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'month Apr-17. value 1.4m. Bar 1 of 12.',
              nextSelectorAriaLabel: 'month May-17. value 6m. Bar 2 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=bar][data-id=bar-Mar-18]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'Mar-18. 8.5m. Bar 12 of 12.',
              nextSelectorAriaLabel: 'Apr-17. 1.4m. Bar 1 of 12.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-May-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'month May-17. value 6m. Bar 2 of 12.',
              nextSelectorAriaLabel: 'month Apr-17. value 1.4m. Bar 1 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=bar][data-id=bar-Apr-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Mar-18]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'Apr-17. 1.4m. Bar 1 of 12.',
              nextSelectorAriaLabel: 'Mar-18. 8.5m. Bar 12 of 12.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-Sep-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Jul-17]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'Sep-17. 3.8m. B. Bar 6 of 12.',
              nextSelectorAriaLabel: 'Jul-17. 2.2m. B. Bar 4 of 12.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=bar][data-id=bar-Jul-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Mar-18]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'Jul-17. 2.2m. B. Bar 4 of 12.',
              nextSelectorAriaLabel: 'Mar-18. 8.5m. B. Bar 12 of 12.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=bar][data-id=bar-Jul-17]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Sep-17]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'month Jul-17. value 2.2m. cat B. Bar 4 of 12.',
              nextSelectorAriaLabel: 'month Sep-17. value 3.8m. cat B. Bar 6 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=bar][data-id=bar-Mar-18]',
            nextTestSelector: '[data-testid=bar][data-id=bar-Jul-17]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'month Mar-18. value 8.5m. cat B. Bar 12 of 12.',
              nextSelectorAriaLabel: 'month Jul-17. value 2.2m. cat B. Bar 4 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: BarChartDefaultValues[unitTestAccessibility[test].prop] }
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
                        label: "May's volume is here.",
                        bgPadding: 20,
                        title: 'The month of may',
                        align: 'middle',
                        wrap: 210
                      },
                      accessibilityDescription: 'This annotation is a callout to May, which is for testing purposes.',
                      data: { month: 'May-17', value: 6042320, cat: 'A' },
                      dy: '-20%',
                      color: 'pri_blue'
                    },
                    {
                      note: {
                        label: "June's volume is here.",
                        bgPadding: 20,
                        title: 'The month of june',
                        align: 'middle',
                        wrap: 210
                      },
                      data: { month: 'Jun-17', value: 3234002, cat: 'A' },
                      dy: '-20%',
                      color: 'pri_blue'
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
              ? '[data-testid=bar-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=bar][data-id=bar-Apr-17]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=bar][data-id=bar-May-17]'
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
          } else if (
            // these accessibility tests need a group accessor for bar-chart
            test === 'accessibility_categorical_textures_created_by_default' ||
            test === 'accessibility_group_aria_label_add_update' ||
            test === 'accessibility_group_aria_label_remove_update'
          ) {
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                { ...innerTestProps, groupAccessor: 'cat' },
                innerTestSelector,
                innerNextTestSelector
              ));
            // update this test to check out just one of them
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
        it('should render chart horizontally when layout prop is horizontal', async () => {
          // ARRANGE
          const EXPECTEDSCALE = scaleBand()
            .domain(EXPECTEDDATA.map(d => d.month))
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
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('height', EXPECTEDSCALE.bandwidth());
          });
        });

        it('should render chart vertically when layout prop is vertical', async () => {
          // ARRANGE
          const EXPECTEDSCALE = scaleBand()
            .domain(EXPECTEDDATA.map(d => d.month))
            .range([0, 500])
            .padding(0.2);
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALE.bandwidth());
          });
        });
      });
    });

    describe('margin & padding', () => {
      it('refer to generic results above for margin & padding tests', () => {
        expect(true).toBeTruthy();
      });
    });

    // annotations break in jsdom due to their text wrapping function in d3-annotation
    // describe('annotations', () => {
    //   // TODO: need to add more precise test case for annotations label and text
    //   it('should pass annotation prop', async () => {
    //     // ARRANGE
    //     const annotations = [
    //       {
    //         note: {
    //           label: 'Social Media Intern returned to college',
    //           bgPadding: 20,
    //           title: 'Staff Change',
    //           align: 'middle',
    //           wrap: 130
    //         },
    //         accessibilityDescription:
    //           'This is an annotation that explains a drop in tweet ACTivity due to staff change.',
    //         y: [2600],
    //         x: '62%',
    //         dy: -85,
    //         type: 'annotationCallout',
    //         connector: { end: 'dot', endScale: 10 },
    //         color: 'pri_blue'
    //       }
    //     ];
    //     const data = [
    //       { label: 'Q1', value: 1125 },
    //       { label: 'Q2', value: 3725 },
    //       { label: 'Q3', value: 2125 },
    //       { label: 'Q4', value: 4125 }
    //     ];
    //     const dataLabel = { visible: true, placement: 'top', labelAccessor: 'value', format: '0,0' };
    //     component.data = data;
    //     component.ordinalAccessor = 'label';
    //     component.valueAccessor = 'value';
    //     component.dataLabel = dataLabel;
    //     component.annotations = annotations;

    //     // ACT
    //     page.root.append(component);
    //     await page.waitForChanges();

    //     // ASSERT
    //     const annotationGroup = page.doc.querySelector('[data-testid=annotation-group]');
    //     expect(annotationGroup).toMatchSnapshot();
    //   });
    // });

    describe('axes', () => {
      describe('barIntervalRatio', () => {
        it('should have ratio of 0.2 by default', async () => {
          // ARRANGE
          const EXPECTEDSCALE = scaleBand()
            .domain(EXPECTEDDATA.map(d => d.month))
            .range([0, 500])
            .padding(0.2);
          component.width = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALE.bandwidth());
          });
        });
        it('should have ratio of 0.5 when passed on load', async () => {
          // ARRANGE
          const EXPECTEDSCALE = scaleBand()
            .domain(EXPECTEDDATA.map(d => d.month))
            .range([0, 500])
            .padding(0.5);
          component.width = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.barIntervalRatio = 0.5;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALE.bandwidth());
          });
        });
        it('should have ratio of 0.5 when passed on update', async () => {
          // ARRANGE
          const EXPECTEDSCALE = scaleBand()
            .domain(EXPECTEDDATA.map(d => d.month))
            .range([0, 500])
            .padding(0.5);
          component.width = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.barIntervalRatio = 0.5;
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('width', EXPECTEDSCALE.bandwidth());
          });
        });
      });

      describe('minValueOverride', () => {
        it('should have no effect on bar chart when passed', async () => {
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUE])
            .range([500, 0]);

          component.minValueOverride = 100000;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('height', EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
      });
      describe('maxValueOverride', () => {
        it('should effect bar size when maxValueOverride is passed on load', async () => {
          const MAXVALUEOVERRIDE = 10000000;
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUEOVERRIDE])
            .range([500, 0]);

          component.maxValueOverride = MAXVALUEOVERRIDE;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('height', EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should effect bar size when maxValueOverride is passed on update', async () => {
          const MAXVALUEOVERRIDE = 10000000;
          const EXPECTEDSCALE = scaleLinear()
            .domain([Math.min(0, MINVALUE), MAXVALUEOVERRIDE])
            .range([500, 0]);

          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

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
            expect(bar).toEqualAttribute('height', EXPECTEDSCALE(0) - EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
      });

      describe('axis.visible', () => {
        it('xAxis and yAxis should be visible by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxis = page.doc.querySelector('[data-testid=x-axis]');
          const yAxis = page.doc.querySelector('[data-testid=y-axis]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 1);
          expect(yAxis).toEqualAttribute('opacity', 1);
        });
        it('should not render when false is passed', async () => {
          // ARRANGE
          component.xAxis = {
            visible: false,
            gridVisible: true,
            label: 'X Axis',
            format: '0[.][0][0]a',
            tickInterval: 1
          };
          component.yAxis = {
            visible: false,
            gridVisible: true,
            label: 'Y Axis',
            format: '0[.][0][0]a',
            tickInterval: 1
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxis = page.doc.querySelector('[data-testid=x-axis]');
          const yAxis = page.doc.querySelector('[data-testid=y-axis]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
          expect(yAxis).toEqualAttribute('opacity', 0);
        });
      });

      describe('axis.gridVisible', () => {
        it('should not render when false or layout is vertical (default)', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const gridBottom = page.doc.querySelector('[data-testid=grid-bottom]');
          const gridLeft = page.doc.querySelector('[data-testid=grid-left]');
          flushTransitions(gridBottom);
          flushTransitions(gridLeft);
          expect(gridBottom).toEqualAttribute('opacity', 0);
          expect(gridLeft).toEqualAttribute('opacity', 1);
        });
        it('should render when true and layout is horizontal', async () => {
          component.layout = 'horizontal';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // ASSERT
          const gridBottom = page.doc.querySelector('[data-testid=grid-bottom]');
          const gridLeft = page.doc.querySelector('[data-testid=grid-left]');
          flushTransitions(gridBottom);
          flushTransitions(gridLeft);
          expect(gridBottom).toEqualAttribute('opacity', 1);
          expect(gridLeft).toEqualAttribute('opacity', 0);
        });
      });

      describe('axis.label', () => {
        it('should place axis label when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '0[.][0][0]a',
            gridVisible: true,
            label: 'Custom X Axis Label',
            tickInterval: 1,
            visible: true
          };
          const EXPECTEDYAXIS = {
            visible: true,
            gridVisible: true,
            label: 'Custom Y Axis Label',
            format: '0[.][0][0]a',
            tickInterval: 1
          };
          component.xAxis = EXPECTEDXAXIS;
          component.yAxis = EXPECTEDYAXIS;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisLabel = page.doc.querySelector('[data-testid=x-axis-label]');
          const yAxisLabel = page.doc.querySelector('[data-testid=y-axis-label]');
          expect(xAxisLabel).toEqualText(EXPECTEDXAXIS.label);
          expect(yAxisLabel).toEqualText(EXPECTEDYAXIS.label);
        });
      });

      describe('axis.format', () => {
        it('yAxis should have default format applied to numbers', async () => {
          // ARRANGE
          component.wrapLabel = false;
          const EXPECTEDTICKS = ['0', '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          yAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('xAxis should have default format applied to numbers', async () => {
          // ARRANGE
          component.wrapLabel = false;
          component.layout = 'horizontal';
          const EXPECTEDTICKS = ['0', '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('yAxis should have custom format applied to numbers if passed', async () => {
          // ARRANGE
          component.wrapLabel = false;
          const EXPECTEDYAXIS = {
            format: '$0[.][0][0]a',
            gridVisible: true,
            label: 'Custom Y Axis Label',
            tickInterval: 1,
            visible: true
          };
          component.yAxis = EXPECTEDYAXIS;
          const EXPECTEDTICKS = ['$0', '$1m', '$2m', '$3m', '$4m', '$5m', '$6m', '$7m', '$8m'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          yAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('xAxis should have custom format applied to numbers if passed', async () => {
          // ARRANGE
          component.wrapLabel = false;
          component.layout = 'horizontal';
          const EXPECTEDXAXIS = {
            format: '$0[.][0][0]a',
            gridVisible: true,
            label: 'Custom X Axis Label',
            tickInterval: 1,
            visible: true
          };
          component.xAxis = EXPECTEDXAXIS;
          const EXPECTEDTICKS = ['$0', '$1m', '$2m', '$3m', '$4m', '$5m', '$6m', '$7m', '$8m'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
      });

      describe('axis.tickInterval', () => {
        it('should have tick interval one by default', async () => {
          // ARRANGE
          const EXPECTEDTICKS = ['0', '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m'];
          component.wrapLabel = false;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDDATA[i].month);
          });
          yAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('should have tick interval 2 when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '0[.][0][0]a',
            gridVisible: true,
            label: 'Custom X Axis Label',
            tickInterval: 2,
            visible: true
          };
          const EXPECTEDTICKS = ['0', '1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m'];
          component.wrapLabel = false;
          component.xAxis = EXPECTEDXAXIS;
          component.yAxis = EXPECTEDXAXIS;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            const expectedAxisText = i % 2 === 0 ? EXPECTEDDATA[i].month : '';
            expect(tick).toEqualText(expectedAxisText);
          });
          yAxisTicks.forEach((tick, i) => {
            const expectedAxisText = i % 2 === 0 ? EXPECTEDTICKS[i] : '';
            expect(tick).toEqualText(expectedAxisText);
          });
        });
      });
    });

    describe('interaction', () => {
      describe('bar based interaction tests', () => {
        const innerTestProps = {};
        const innerTestSelector = '[data-testid=bar][data-id=bar-Apr-17]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-May-17]';
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
        const innerTestSelector = '[data-testid=bar][data-id=bar-Apr-17]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-Jul-17]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['cat']
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
          interactionKeys: ['cat', 'month']
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-Apr-17]',
            '[data-testid=bar][data-id=bar-May-17]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-Apr-17]',
            '[data-testid=bar][data-id=bar-May-17]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=bar][data-id=bar-Apr-17]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-Jul-17]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['cat']
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
          interactionKeys: ['cat', 'month']
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-Apr-17]',
            '[data-testid=bar][data-id=bar-May-17]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=bar][data-id=bar-Apr-17]',
            '[data-testid=bar][data-id=bar-May-17]'
          ));
      });
    });

    describe('event-emitter', () => {
      // Open issue: https://github.com/ionic-team/stencil/issues/1964
      // Jest throwing TypeError : mouseover,mouseout, focus, blur etc.
      // TECH-DEBT: Once above issue is resolved, write more precise test for event params.

      describe('generic event testing', () => {
        describe('bar based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false
            };
            const innerTestSelector = '[data-testid=bar]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
          });
        });
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

      describe('sort', () => {
        it('should render data in ascending order when sortOrder is asc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'asc';
          const EXPECTEDDATAASC = [
            { month: 'Apr-17', value: 1407543 },
            { month: 'Jul-17', value: 2221233 },
            { month: 'Jan-18', value: 2340000 },
            { month: 'Dec-17', value: 2636346 },
            { month: 'Feb-18', value: 3202340 },
            { month: 'Jun-17', value: 3234002 },
            { month: 'Sep-17', value: 3789221 },
            { month: 'Aug-17', value: 4476321 },
            { month: 'May-17', value: 6042320 },
            { month: 'Oct-17', value: 6543535 },
            { month: 'Nov-17', value: 7457432 },
            { month: 'Mar-18', value: 8503536 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=bar]');
          elements.forEach((element, i) => {
            expect(element['__data__'].month).toEqual(EXPECTEDDATAASC[i].month); // tslint:disable-line: no-string-literal
          });
        });
        it('should render data in descending order when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'desc';
          const EXPECTEDDATADESC = [
            { month: 'Mar-18', value: 8503536 },
            { month: 'Nov-17', value: 7457432 },
            { month: 'Oct-17', value: 6543535 },
            { month: 'May-17', value: 6042320 },
            { month: 'Aug-17', value: 4476321 },
            { month: 'Sep-17', value: 3789221 },
            { month: 'Jun-17', value: 3234002 },
            { month: 'Feb-18', value: 3202340 },
            { month: 'Dec-17', value: 2636346 },
            { month: 'Jan-18', value: 2340000 },
            { month: 'Jul-17', value: 2221233 },
            { month: 'Apr-17', value: 1407543 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=bar]');
          elements.forEach((element, i) => {
            expect(element['__data__'].month).toEqual(EXPECTEDDATADESC[i].month); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in default order when sortOrder is default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=bar]');
          elements.forEach((element, i) => {
            expect(element['__data__'].month).toEqual(EXPECTEDDATA[i].month); // tslint:disable-line: no-string-literal
          });
        });
      });

      describe('wrapLabel', () => {
        it('should render wrapped ordinal tick labels when wrapLabel is true (default)', async () => {
          component.width = 500;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicksText = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');
          xAxisTicksText.forEach((text, i) => {
            const textTspans = text.querySelectorAll('[data-testid=axis-tick-text-tspan]');
            expect(textTspans.length).toBeGreaterThanOrEqual(1);
            expect(text['__data__']).toEqual(EXPECTEDDATA[i].month); // tslint:disable-line: no-string-literal
          });
        });
        it('should render unwrapped ordinal tick labels when wrapLabel is false', async () => {
          const EXPECTEDWRAPLABEL = false;
          component.wrapLabel = EXPECTEDWRAPLABEL;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicksText = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');
          xAxisTicksText.forEach((text, i) => {
            expect(text).toEqualText(EXPECTEDDATA[i].month);
          });
        });
      });
    });

    describe('labels', () => {
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['month'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['cat', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=bar][data-id=bar-Apr-17]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b></b>X Axis:<b>Apr-17</b><br>Y Axis:<b>1.4m</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>Apr-17</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>Apr-17</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$1.4m</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$1.4m</b><br></p>'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            // we have to handle clickFunc separately due to this.zooming boolean in circle-packing load

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
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
          it('should render the data labels if visible is true', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            const EXPECTEDDATARANDOM = [
              { month: 'Jan', value: 1250000, random: Math.random() },
              { month: 'Feb', value: 202340, random: Math.random() },
              { month: 'Mar', value: 803536, random: Math.random() },
              { month: 'Apr', value: 1407543, random: Math.random() },
              { month: 'May', value: 6042320, random: Math.random() },
              { month: 'Jun', value: 3234002, random: Math.random() }
            ];
            component.dataLabel = {
              visible: true,
              labelAccessor: 'random',
              format: '0[.][0]%',
              position: 'top'
            };
            component.data = EXPECTEDDATARANDOM;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATARANDOM[i].random, '0[.][0]%'); // tslint:disable-line: no-string-literal
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
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '$0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
        });
        describe('placement', () => {
          it('should place labels on top of bars by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const bar = page.doc.querySelector('[data-testid=bar]');
            flushTransitions(label);
            flushTransitions(bar);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(parseFloat(bar.getAttribute('y')));
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
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const bar = page.doc.querySelector('[data-testid=bar]');
            flushTransitions(label);
            flushTransitions(bar);
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThan(parseFloat(bar.getAttribute('y')));
          });
        });
      });

      describe('legend', () => {
        describe('visible', () => {
          it('by default the legend should not render due to lack of group accessor', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            expect(legendContainer).toHaveClass('bar-legend');
            expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendPaddingG).toHaveClass('legend-padding-wrapper');
            expect(legendG).toHaveClass('legend');
            expect(legendG).toHaveClass('bar');
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
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendSVG.getAttribute('style')).toEqual('display: none;');
          });
          it('should render, and be visible if groupAccessor is passed', async () => {
            component.groupAccessor = 'cat';

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelectorAll('g');
            expect(legendContainer.getAttribute('style')).toEqual('display: block;');
            expect(legendSVG).toEqualAttribute('opacity', 1);
            expect(legendG.length).toEqual(3);
          });
        });
        describe('type', () => {
          it('should be bar default type by default', async () => {
            component.groupAccessor = 'cat';

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG).toHaveClass('legend');
            expect(legendG).toHaveClass('bar');
          });
          it('should be bar type even if another type is passed', async () => {
            component.groupAccessor = 'cat';
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
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
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
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG['__on']).toBeUndefined(); // tslint:disable-line: no-string-literal
          });
          it('should be interactive when interactive prop is true', async () => {
            component.groupAccessor = 'cat';
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
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
            component.groupAccessor = 'cat';
            component.legend = {
              visible: true,
              interactive: true,
              type: 'bar',
              format: '$0[.][0]a',
              labels: [15, 30]
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendGText = legendPaddingG.querySelector('g text');
            flushTransitions(legendGText);
            expect(legendGText).toEqualText('$15');
          });
        });
        describe('labels', () => {
          it('should be equal to data values by default', async () => {
            // ARRANGE
            component.groupAccessor = 'cat';
            const EXPECTEDLABELS = ['A', 'B', 'C'];

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendGs = legendPaddingG.querySelectorAll('g');
            await asyncForEach(legendGs, async (legendG, i) => {
              const legendGText = legendG.querySelector('text');
              flushTransitions(legendGText);
              await page.waitForChanges();
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
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendGs = legendPaddingG.querySelectorAll('g');
            await asyncForEach(legendGs, async (legendG, i) => {
              const legendGText = legendG.querySelector('text');
              flushTransitions(legendGText);
              await page.waitForChanges();
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
          { label: 'Market', labelPlacementHorizontal: 'left', labelPlacementVertical: 'bottom', value: 7000000 }
        ];
        component.referenceLines = referenceLines;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLinesGroup = page.doc.querySelector('[data-testid=reference-line-group]');
        expect(referenceLinesGroup).toMatchSnapshot();
      });

      it('should pass referenceStyle prop', async () => {
        // ARRANGE
        const referenceLines = [
          { label: 'Market', labelPlacementHorizontal: 'left', labelPlacementVertical: 'bottom', value: 7000000 }
        ];
        const referenceStyle = { color: 'pri_grey', dashed: '', opacity: 0.65, strokeWidth: '1px' };
        component.referenceLines = referenceLines;
        component.referenceStyle = referenceStyle;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLine = page.doc.querySelector('[data-testid=reference-line]');
        expect(referenceLine).toMatchSnapshot();
      });
    });

    describe('style with textures', () => {
      describe('colorPalette', () => {
        it('should render texture single blue by default', async () => {
          const EXPECTEDFILLCOLOR = getColors('single_blue');
          const EXPECTEDTEXTURECOLOR = getContrastingStroke(EXPECTEDFILLCOLOR);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          const barFillURL = patterns[0].getAttribute('id');

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);
          bars.forEach(bar => {
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should load texture single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          const EXPECTEDTEXTURECOLOR = getContrastingStroke(EXPECTEDFILLCOLOR);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          const barFillURL = patterns[0].getAttribute('id');

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);
          bars.forEach(bar => {
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should update texture to single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          const EXPECTEDTEXTURECOLOR = getContrastingStroke(EXPECTEDFILLCOLOR);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          const barFillURL = patterns[0].getAttribute('id');

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);
          bars.forEach(bar => {
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
        it('should render categorical textures and color when colorPalette is categorical', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.cat))
              .domain()
          );
          component.groupAccessor = 'cat';
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          bars.forEach((bar, i) => {
            const barColor = EXPECTEDSCALE(EXPECTEDDATA[i].cat);
            const barPattern = patterns[EXPECTEDSCALE.domain().findIndex(o => o === EXPECTEDDATA[i].cat)];
            const patternFill = barPattern.childNodes[0];
            const patternStroke = barPattern.childNodes[1];
            const barFillURL = barPattern.getAttribute('id');

            // check pattern settings
            expect(patternFill).toEqualAttribute('fill', barColor);
            const patternStrokeColorTest =
              patternStroke.getAttribute('stroke') === getContrastingStroke(barColor) ||
              patternStroke.getAttribute('fill') === getContrastingStroke(barColor);
            expect(patternStrokeColorTest).toBeTruthy();
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
      });
      describe('colors', () => {
        it('should render colors texture instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.cat))
              .domain()
          );
          component.groupAccessor = 'cat';
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          bars.forEach((bar, i) => {
            const barColor = EXPECTEDSCALE(EXPECTEDDATA[i].cat);
            const barPattern = patterns[EXPECTEDSCALE.domain().findIndex(o => o === EXPECTEDDATA[i].cat)];
            const patternFill = barPattern.childNodes[0];
            const patternStroke = barPattern.childNodes[1];
            const barFillURL = barPattern.getAttribute('id');

            // check pattern settings
            expect(patternFill).toEqualAttribute('fill', barColor);
            const patternStrokeColorTest =
              patternStroke.getAttribute('stroke') === getContrastingStroke(barColor) ||
              patternStroke.getAttribute('fill') === getContrastingStroke(barColor);
            expect(patternStrokeColorTest).toBeTruthy();
            expect(bar).toEqualAttribute('fill', `url(#${barFillURL})`);
          });
        });
      });
    });

    describe('style no textures', () => {
      beforeEach(() => {
        component.accessibility = { ...component.accessibility, hideTextures: true };
      });

      describe('colorPalette', () => {
        it('should render single blue by default', async () => {
          const EXPECTEDFILLCOLOR = getColors('single_blue');

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          bars.forEach(bar => {
            expect(bar).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          });
        });
        it('should load single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          // component.data = EXPECTEDDATALARGE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          });
        });
        it('should update to single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          // component.data = EXPECTEDDATALARGE;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async bar => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          });
        });

        it('should render sequential blue when colorPalette is sequential_orange', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_secOrange';
          const EXPECTEDSCALE = getColors(EXPECTEDCOLORPALETTE, [MINVALUE, MAXVALUE]);

          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });

        it('should render categorical color when colorPalette is categorical', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.cat))
              .domain()
          );
          component.groupAccessor = 'cat';
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].cat));
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.cat))
              .domain()
          );
          component.groupAccessor = 'cat';
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const bars = page.doc.querySelectorAll('[data-testid=bar]');
          await asyncForEach(bars, async (bar, i) => {
            flushTransitions(bar);
            await page.waitForChanges();
            expect(bar).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].cat));
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
          bars.forEach(bar => {
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
          bars.forEach(bar => {
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
