/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { LineChart } from './line-chart';
import { LineChartDefaultValues } from './line-chart-default-values';
import { scaleOrdinal, scaleLinear } from 'd3-scale';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '../../../node_modules/@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '../../../node_modules/@visa/visa-charts-data-table/src/components/data-table/data-table';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, visaColors, formatStats, symbols, getAccessibleStrokes } = Utils;

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<line-chart>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new LineChart()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { date: '2016-01', category: 'Card-A', value: 7670994739 },
      { date: '2016-02', category: 'Card-A', value: 7628909842 },
      { date: '2016-03', category: 'Card-A', value: 8358837379 },
      { date: '2016-04', category: 'Card-A', value: 8334842966 },
      { date: '2016-05', category: 'Card-A', value: 8588600035 },
      { date: '2016-06', category: 'Card-A', value: 8484192554 },
      { date: '2016-07', category: 'Card-A', value: 8778636197 },
      { date: '2016-08', category: 'Card-A', value: 8811163096 },
      { date: '2016-09', category: 'Card-A', value: 8462148898 },
      { date: '2016-10', category: 'Card-A', value: 9051933407 },
      { date: '2016-11', category: 'Card-A', value: 8872849978 },
      { date: '2016-12', category: 'Card-A', value: 9709829820 },
      { date: '2016-01', category: 'Card-B', value: 6570994739 },
      { date: '2016-02', category: 'Card-B', value: 4628909842 },
      { date: '2016-03', category: 'Card-B', value: 4358837379 },
      { date: '2016-04', category: 'Card-B', value: 5534842966 },
      { date: '2016-05', category: 'Card-B', value: 4388600035 },
      { date: '2016-06', category: 'Card-B', value: 3484192554 },
      { date: '2016-07', category: 'Card-B', value: 3578636197 },
      { date: '2016-08', category: 'Card-B', value: 6411163096 },
      { date: '2016-09', category: 'Card-B', value: 5262148898 },
      { date: '2016-10', category: 'Card-B', value: 4651933407 },
      { date: '2016-11', category: 'Card-B', value: 6772849978 },
      { date: '2016-12', category: 'Card-B', value: 5609829820 }
    ];

    const moreCategoryData = [
      { date: '2016-01', category: 'Card-A', value: 7670994739 },
      { date: '2016-02', category: 'Card-A', value: 7628909842 },
      { date: '2016-03', category: 'Card-A', value: 8358837379 },
      { date: '2016-04', category: 'Card-A', value: 8334842966 },
      { date: '2016-05', category: 'Card-A', value: 8588600035 },
      { date: '2016-06', category: 'Card-A', value: 8484192554 },
      { date: '2016-01', category: 'Card-B', value: 8778636197 },
      { date: '2016-02', category: 'Card-B', value: 8811163096 },
      { date: '2016-03', category: 'Card-B', value: 8462148898 },
      { date: '2016-04', category: 'Card-B', value: 9051933407 },
      { date: '2016-05', category: 'Card-B', value: 8872849978 },
      { date: '2016-06', category: 'Card-B', value: 9709829820 },
      { date: '2016-01', category: 'Card-C', value: 6570994739 },
      { date: '2016-02', category: 'Card-C', value: 4628909842 },
      { date: '2016-03', category: 'Card-C', value: 4358837379 },
      { date: '2016-04', category: 'Card-C', value: 5534842966 },
      { date: '2016-05', category: 'Card-C', value: 4388600035 },
      { date: '2016-06', category: 'Card-C', value: 3484192554 },
      { date: '2016-01', category: 'Card-D', value: 3578636197 },
      { date: '2016-02', category: 'Card-D', value: 6411163096 },
      { date: '2016-03', category: 'Card-D', value: 5262148898 },
      { date: '2016-04', category: 'Card-D', value: 4651933407 },
      { date: '2016-05', category: 'Card-D', value: 6772849978 },
      { date: '2016-06', category: 'Card-D', value: 5609829820 },
      { date: '2016-01', category: 'Card-E', value: 4570994739 },
      { date: '2016-02', category: 'Card-E', value: 5628909842 },
      { date: '2016-03', category: 'Card-E', value: 3358837379 },
      { date: '2016-04', category: 'Card-E', value: 2534842966 },
      { date: '2016-05', category: 'Card-E', value: 6388600035 },
      { date: '2016-06', category: 'Card-E', value: 5484192554 }
    ];

    const EXPECTEDSERIESACCESSOR = 'category';
    const EXPECTEDORDINALACCESSOR = 'date';
    const EXPECTEDVALUEACCESSOR = 'value';
    const MINVALUE = 3484192554;
    const MAXVALUE = 9709829820;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...LineChartDefaultValues.accessibility, disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [LineChart, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('line-chart');
      component.data = [...EXPECTEDDATA];
      component.seriesAccessor = EXPECTEDSERIESACCESSOR;
      component.ordinalAccessor = EXPECTEDORDINALACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.uniqueID = 'line-chart-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new LineChart()).toBeTruthy();
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

      it('should render with minimal props[data,(series,ordinal,value)Accessor] given', async () => {
        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // flush labels for testing to ensure opacity of 1 on initial render
        const elements = page.doc.querySelectorAll('[data-testid=line-series-label]');
        await asyncForEach(elements, async element => {
          flushTransitions(element);
          await page.waitForChanges();
        });

        // ASSERT
        expect(page.root).toMatchSnapshot();
      });
    });

    describe('generic test suite', () => {
      Object.keys(unitTestGeneric).forEach(test => {
        const innerTestProps = unitTestGeneric[test].testDefault
          ? { [unitTestGeneric[test].prop]: LineChartDefaultValues[unitTestGeneric[test].prop] }
          : unitTestGeneric[test].prop === 'data'
          ? { data: EXPECTEDDATA }
          : unitTestGeneric[test].testProps;
        const innerTestSelector =
          unitTestGeneric[test].testSelector === 'component-name'
            ? 'line-chart'
            : unitTestGeneric[test].testSelector === '[data-testid=mark]'
            ? '[data-testid=marker]'
            : unitTestGeneric[test].testSelector;
        if (test === 'generic_data_custom_update_enter') {
          innerTestProps.data = EXPECTEDDATA.map(rec => {
            return { ...rec, enter: true };
          });
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        } else if (unitTestGeneric[test].prop === 'data') {
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        } else {
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        }
      });
    });

    describe('accessibility', () => {
      describe('generic accessibility test suite', () => {
        const accessibilityTestMarks = {
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-02]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'category Card-A. date 2016-01. value 7.7b. Point 1 of 12.',
              nextSelectorAriaLabel: 'category Card-A. date 2016-02. value 7.6b. Point 2 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-12]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'Card-A. 2016-12. 9.7b. Point 12 of 12.',
              nextSelectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 12.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-02]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'category Card-A. date 2016-02. value 7.6b. Point 2 of 12.',
              nextSelectorAriaLabel: 'category Card-A. date 2016-01. value 7.7b. Point 1 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-12]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 12.',
              nextSelectorAriaLabel: 'Card-A. 2016-12. 9.7b. Point 12 of 12.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-Card-B-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'Card-B. 2016-01. 8.8b. Point 1 of 6.',
              nextSelectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 6.',
              data: moreCategoryData
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-E-2016-01]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 6.',
              nextSelectorAriaLabel: 'Card-E. 2016-01. 4.6b. Point 1 of 6.',
              data: moreCategoryData
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-B-2016-01]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 6.',
              nextSelectorAriaLabel: 'Card-B. 2016-01. 8.8b. Point 1 of 6.',
              data: moreCategoryData
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=marker][data-id=marker-Card-E-2016-01]',
            nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'Card-E. 2016-01. 4.6b. Point 1 of 6.',
              nextSelectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 6.',
              data: moreCategoryData
            }
          },
          accessibility_keyboard_nav_esc_to_group: {
            name: 'keyboard nav: group - escape will move up to group',
            testSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
            keyDownObject: { key: 'Escape', code: 'Escape', keyCode: 27 },
            testProps: {
              selectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 12.',
              nextSelectorAriaLabel: 'Card-A. Line 1 of 2 which contains 12 interactive points.'
            }
          }
          // the tests below here do not work because the selection of a group (g) kicks
          // the focus up to the SVG, this would require significant refactor to generic nav tests
          // accessibility_keyboard_nav_series_right_arrow: {
          //   name: 'keyboard nav series: sibling - right arrow goes to next',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
          //   nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-B]',
          //   keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
          //   testProps: {
          //     selectorAriaLabel: 'Card-A. Line 1 of 5 which contains 6 interactive points.',
          //     nextSelectorAriaLabel: 'Card-B. Line 2 of 5 which contains 6 interactive points.',
          //     data: moreCategoryData
          //   }
          // },
          // accessibility_keyboard_nav_series_right_arrow_loop: {
          //   name: 'keyboard nav series: sibling - right arrow loops to first',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-E]',
          //   nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
          //   keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
          //   testProps: {
          //     selectorAriaLabel: 'Card-E. Line 5 of 5 which contains 6 interactive points.',
          //     nextSelectorAriaLabel: 'Card-A. Line 1 of 5 which contains 6 interactive points.',
          //     data: moreCategoryData
          //   }
          // },
          // accessibility_keyboard_nav_series_left_arrow: {
          //   name: 'keyboard nav series: sibling - right arrow goes to next',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-B]',
          //   nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
          //   keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
          //   testProps: {
          //     selectorAriaLabel: 'Card-B. Line 2 of 5 which contains 6 interactive points.',
          //     nextSelectorAriaLabel: 'Card-A. Line 1 of 5 which contains 6 interactive points.',
          //     data: moreCategoryData
          //   }
          // },
          // accessibility_keyboard_nav_series_left_arrow_loop: {
          //   name: 'keyboard nav series: sibling - right arrow loops to first',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
          //   nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-E]',
          //   keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
          //   testProps: {
          //     selectorAriaLabel: 'Card-A. Line 1 of 5 which contains 6 interactive points.',
          //     nextSelectorAriaLabel: 'Card-E. Line 5 of 5 which contains 6 interactive points.',
          //     data: moreCategoryData
          //   }
          // },
          // accessibility_keyboard_nav_enter_group: {
          //   name: 'keyboard nav: group - enter will move into to group',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
          //   nextTestSelector: '[data-testid=marker][data-id=marker-Card-A-2016-01]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 },
          //   testProps: {
          //     selectorAriaLabel: 'Card-A. Line 1 of 2 which contains 12 interactive points.',
          //     nextSelectorAriaLabel: 'Card-A. 2016-01. 7.7b. Point 1 of 12.'
          //   }
          // }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: LineChartDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            geometryType: 'Circle',
            geometryPlacementAttributes: ['r', 'cx', 'cy'],
            geometryAdjustmentValues: [
              { f: 'r', b: 7, w: 3, s: -1 },
              { f: 'cx', b: 7, w: 3, s: -1 },
              { f: 'cy', b: 7 * 2, w: 3 * 2, s: 1 }
            ],
            annotations:
              unitTestAccessibility[test].prop === 'annotations'
                ? [
                    {
                      note: {
                        label: 'Low debit in June',
                        bgPadding: 0,
                        align: 'right',
                        wrap: 130
                      },
                      accessibilityDescription: 'This is a test description for accessibility.',
                      data: { date: '2016-06', category: 'Card-B', value: 3484192554 },
                      dx: '35%',
                      dy: '2%',
                      color: 'categorical_orange',
                      type: 'annotationCalloutCircle',
                      subject: {
                        radius: 6
                      }
                    }
                  ]
                : []
          };
          const innerTestSelector =
            unitTestAccessibility[test].testSelector === 'component-name'
              ? 'line-chart'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=marker]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=marker-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=marker][data-id=marker-Card-A-2016-01]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=marker][data-id=marker-Card-A-2016-02]'
              : unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
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
            test === 'accessibility_textures_on_by_default' || // textures have been tested in styles for line
            test === 'accessibility_textures_off_on_load' ||
            test === 'accessibility_textures_off_on_update' ||
            test === 'accessibility_categorical_textures_created_by_default' ||
            test === 'accessibility_focus_marker_style'
            // test === 'accessibility_focus_marker_style' ||
            // test === 'accessibility_focus_group_style' ||
            // test === 'accessibility_keyboard_selection_test'
          ) {
            it.skip(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
          } else if (
            test === 'accessibility_focus_marker_style' // update this test for single test review
          ) {
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                { ...innerTestProps },
                innerTestSelector,
                innerNextTestSelector
              ));
            // skipping these by default as the target.focus() code in accessibilityController breaks them
            // skipping texture default tests for scatter as scatter uses symbols instead of textures
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
      describe('minValueOverride & maxValueOverride', () => {
        it('should set min and max value from data by default', async () => {
          // ARRANGE
          const yMin = MINVALUE - (MAXVALUE - MINVALUE) * 0.1;
          const yMax = MAXVALUE + (MAXVALUE - MINVALUE) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('cy', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set min value when passed on load', async () => {
          // ARRANGE
          const yMin = 0;
          const yMax = MAXVALUE + (MAXVALUE - MINVALUE) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.minValueOverride = 0;
          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('cy', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set min value when passed on update', async () => {
          // ARRANGE
          const yMin = 0;
          const yMax = MAXVALUE + (MAXVALUE - MINVALUE) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.minValueOverride = 0;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('cy', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set max value when passed on load', async () => {
          // ARRANGE
          const yMin = MINVALUE - (MAXVALUE - MINVALUE) * 0.1;
          const yMax = 15000;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.maxValueOverride = 15000;
          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('cy', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set max value when passed on update', async () => {
          // ARRANGE
          const yMin = MINVALUE - (MAXVALUE - MINVALUE) * 0.1;
          const yMax = 15000;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.maxValueOverride = 15000;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('cy', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
      });

      describe('showBaselineX', () => {
        it('baseline on xAxis should be visible by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxis = page.doc.querySelector('[data-testid=x-axis-mark]');
          flushTransitions(xAxis);
          expect(xAxis).toEqualAttribute('opacity', 1);
        });
        it('should flip opacity of baseline on load', async () => {
          // ARRANGE
          component.showBaselineX = false;

          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxis = page.doc.querySelector('[data-testid=x-axis-mark]');
          flushTransitions(xAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
        });
        it('should flip opacity of baseline on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.showBaselineX = false;
          await page.waitForChanges();

          // ASSERT
          const xAxis = page.doc.querySelector('[data-testid=x-axis-mark]');
          flushTransitions(xAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
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
        it('should not render when false is passed on load', async () => {
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
        it('should not render when false is passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
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
        it('should render y but not x grids by default', async () => {
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
        it('should flip render on both x and y grids when passed on load', async () => {
          // ARRANGE
          component.xAxis = {
            visible: true,
            gridVisible: true,
            label: 'X Axis',
            format: '0[.][0][0]a'
          };
          component.yAxis = {
            visible: true,
            gridVisible: false,
            label: 'Y Axis',
            format: '0[.][0][0]a'
          };

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
        it('should flip render on both x and y grids when passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.xAxis = {
            visible: true,
            gridVisible: true,
            label: 'X Axis',
            format: '0[.][0][0]a'
          };
          component.yAxis = {
            visible: true,
            gridVisible: false,
            label: 'Y Axis',
            format: '0[.][0][0]a'
          };
          await page.waitForChanges();

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
          const EXPECTEDTICKS = ['3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          yAxisTicks.forEach((tick, i) => {
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
          const EXPECTEDTICKS = ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          yAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
      });

      describe('axis.tickInterval', () => {
        it('x and y axis should have tick interval 2 when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '',
            gridVisible: true,
            label: 'Custom X Axis Label',
            tickInterval: 2,
            visible: true
          };
          const EXPECTEDYAXIS = {
            format: '0[.][0][0]a',
            gridVisible: true,
            label: 'Custom Y Axis Label',
            tickInterval: 2,
            visible: true
          };
          const EXPECTEDXTICKS = [
            '2016-01',
            '',
            '2016-03',
            '',
            '2016-05',
            '',
            '2016-07',
            '',
            '2016-09',
            '',
            '2016-11',
            ''
          ];
          const EXPECTEDYTICKS = ['3b', '', '5b', '', '7b', '', '9b', ''];
          component.wrapLabel = false;
          component.xAxis = EXPECTEDXAXIS;
          component.yAxis = EXPECTEDYAXIS;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            const expectedAxisText = i % 2 === 0 ? EXPECTEDXTICKS[i] : '';
            expect(tick).toEqualText(expectedAxisText);
          });
          yAxisTicks.forEach((tick, i) => {
            const expectedAxisText = i % 2 === 0 ? EXPECTEDYTICKS[i] : '';
            expect(tick).toEqualText(expectedAxisText);
          });
        });
      });
    });

    describe('interaction', () => {
      describe('marker based interaction tests', () => {
        const innerTestProps = { useFilter: false };
        const innerTestSelector = '[data-testid=marker][data-id=marker-Card-A-2016-01]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-Card-B-2016-01]'; // line defaults to series highlight
        Object.keys(unitTestInteraction).forEach(test => {
          if (unitTestInteraction[test].prop === 'cursor') {
            // in scatter-plot cursor is maintained at the series group level
            it(`[${unitTestInteraction[test].group}] ${unitTestInteraction[test].prop}: ${
              unitTestInteraction[test].name
            }`, () =>
              unitTestInteraction[test].testFunc(
                component,
                page,
                innerTestProps,
                '[data-testid=marker-series-group][data-id=marker-series-Card-A]',
                '[data-testid=marker-series-group][data-id=marker-series-Card-B]'
              ));
          } else {
            // otherwise we need to perform other prop tests on the markers
            // these tests are written expecting filters, etc. need to be adjusted for scatter
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
          }
        });
      });
      describe('clickStyle with interaction keys', () => {
        const testLoad = 'interaction_clickStyle_custom_load';
        const testUpdate = 'interaction_clickStyle_custom_update';
        const innerTestSelector = '[data-testid=marker][data-id=marker-Card-A-2016-01]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-Card-B-2016-01]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['category'],
          useFilter: false
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
          interactionKeys: ['category', 'date'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            '[data-testid=marker][data-id=marker-Card-A-2016-02]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            '[data-testid=marker][data-id=marker-Card-A-2016-02]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=marker][data-id=marker-Card-A-2016-01]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-Card-B-2016-01]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['category'],
          useFilter: false
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
          interactionKeys: ['category', 'date'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            '[data-testid=marker][data-id=marker-Card-A-2016-02]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-Card-A-2016-01]',
            '[data-testid=marker][data-id=marker-Card-A-2016-02]'
          ));
      });
      describe('line based interaction tests', () => {
        const innerTestProps = { useFilter: false };
        const innerTestSelector = '[data-testid=line][data-id=line-Card-A]';
        const innerNegTestSelector = '[data-testid=line][data-id=line-Card-B]'; // line defaults to series highlight
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
        describe('marker based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              transitionEndAllSelector: '[data-testid=marker]'
            };
            const innerTestSelector = '[data-testid=marker]';

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
    });

    describe('labels', () => {
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['category'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['category', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=marker][data-id=marker-Card-A-2016-01]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b>Card-A<br></b>X Axis:<b>2016-01</b><br>Y Axis:<b>7.7b</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>Card-A</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>Card-A</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>Card-A</b><br>Count:<b>$7.7b</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>Card-A</b><br>Count:<b>$7.7b</b><br></p>'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            // we have to handle clickEvent separately due to zooming boolean in circle-packing load

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

      describe('seriesLabel', () => {
        describe('visible', () => {
          it('should render seriesLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=line-series-label]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
          it('should not render seriesLabel when passed on load', async () => {
            // ARRANGE
            component.seriesLabel = {
              visible: false,
              placement: 'right',
              label: []
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=line-series-label]');
            flushTransitions(dataLabel);
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
          it('should not render seriesLabel when passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.seriesLabel = {
              visible: false,
              placement: 'right',
              label: []
            };
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=line-series-label]');
            flushTransitions(dataLabel);
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
        });

        describe('placement', () => {
          it('should place series labels on right of chart by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            const lastMarker = page.doc.querySelector('[data-testid=marker][data-id="marker-Card-A-2016-12"]');
            const innerPaddedWidth =
              component.width -
              component.margin.left -
              component.margin.right -
              component.padding.left -
              component.padding.right;

            flushTransitions(label);
            flushTransitions(lastMarker);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', lastMarker.getAttribute('cy'));
            expect(label).toEqualAttribute('x', innerPaddedWidth + 10);
          });
          it('should place series labels on left of chart on load', async () => {
            // ARRANGE
            component.seriesLabel = {
              visible: true,
              placement: 'left',
              label: []
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            const firstMarker = page.doc.querySelector('[data-testid=marker][data-id="marker-Card-A-2016-01"]');

            flushTransitions(label);
            flushTransitions(firstMarker);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', firstMarker.getAttribute('cy'));
            expect(label).toEqualAttribute('x', 0);
          });

          it('should place series labels on left of chart on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.seriesLabel = {
              visible: true,
              placement: 'left',
              label: []
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            const firstMarker = page.doc.querySelector('[data-testid=marker][data-id="marker-Card-A-2016-01"]');

            flushTransitions(label);
            flushTransitions(firstMarker);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', firstMarker.getAttribute('cy'));
            expect(label).toEqualAttribute('x', 0);
          });
        });
        describe('label', () => {
          it('should use values of seriesAccessor as label by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            expect(label).toEqualText('Card-A');
          });
          it('should use values of label prop when passed on load', async () => {
            component.seriesLabel = {
              visible: true,
              placement: 'right',
              label: ['One', 'Two']
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            expect(label).toEqualText('One');
          });
          it('should use values of label prop when passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.seriesLabel = {
              visible: true,
              placement: 'right',
              label: ['One', 'Two']
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=line-series-label]');
            flushTransitions(label);
            await page.waitForChanges();
            expect(label).toEqualText('One');
          });
        });
      });

      describe('dataLabel', () => {
        describe('visible', () => {
          it('should render dataLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=dataLabel-group]');
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

            const dataLabel = page.doc.querySelector('[data-testid=dataLabel-group]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
        });
        describe('labelAccessor', () => {
          const EXPECTEDDATARANDOM = [
            { date: '2016-01', category: 'Card-A', value: 7670994739, random: Math.random() },
            { date: '2016-02', category: 'Card-A', value: 7628909842, random: Math.random() },
            { date: '2016-03', category: 'Card-A', value: 8358837379, random: Math.random() },
            { date: '2016-04', category: 'Card-A', value: 8334842966, random: Math.random() },
            { date: '2016-05', category: 'Card-A', value: 8588600035, random: Math.random() },
            { date: '2016-06', category: 'Card-A', value: 8484192554, random: Math.random() },
            { date: '2016-07', category: 'Card-A', value: 8778636197, random: Math.random() },
            { date: '2016-08', category: 'Card-A', value: 8811163096, random: Math.random() },
            { date: '2016-09', category: 'Card-A', value: 8462148898, random: Math.random() },
            { date: '2016-10', category: 'Card-A', value: 9051933407, random: Math.random() },
            { date: '2016-11', category: 'Card-A', value: 8872849978, random: Math.random() },
            { date: '2016-12', category: 'Card-A', value: 9709829820, random: Math.random() }
          ];
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
          it('should render label accessor if passed on load', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
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
          it('should render label accessor if passed on update', async () => {
            // ARRANGE
            component.data = EXPECTEDDATARANDOM;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'random',
              format: '0[.][0]%',
              position: 'top'
            };
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
          it('should place labels on top of markers by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const marker = page.doc.querySelector('[data-testid=marker]');
            flushTransitions(label);
            flushTransitions(marker);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(parseFloat(marker.getAttribute('cy')));
          });
          it('should place labels on bottom of markers if passed on load', async () => {
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
            const marker = page.doc.querySelector('[data-testid=marker]');
            flushTransitions(label);
            flushTransitions(marker);
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThan(parseFloat(marker.getAttribute('cy')));
          });
          it('should place labels on bottom of markers if passed on update', async () => {
            // ACT - LOAD
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT - UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'bottom'
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const marker = page.doc.querySelector('[data-testid=marker]');
            flushTransitions(label);
            flushTransitions(marker);
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThan(parseFloat(marker.getAttribute('cy')));
          });
        });
      });

      describe('legend', () => {
        describe('visible', () => {
          it('by default the legend should render', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelectorAll('g');
            expect(legendContainer.getAttribute('style')).toEqual('display: block;');
            expect(legendContainer).toHaveClass('line-legend');
            expect(legendSVG).toEqualAttribute('opacity', 1);
            expect(legendPaddingG).toHaveClass('legend-padding-wrapper');
            expect(legendG[0]).toHaveClass('legend');
            expect(legendG.length).toEqual(2);
          });
          it('should render, but not be visible if false is passed', async () => {
            component.legend = {
              visible: false,
              interactive: false,
              format: '',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            // expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendSVG.getAttribute('style')).toEqual('display: none;');
          });
          it('should render, but not be visible if false is passed on update', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.legend = {
              visible: false,
              interactive: false,
              format: '',
              labels: ''
            };
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendContainer = legendSVG.parentElement;
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            // expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendSVG.getAttribute('style').includes('display: none')).toBeTruthy();
          });
        });
        describe('type', () => {
          it('should be key/symbol legend type by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG).toHaveClass('legend');
          });
          it('should be key/symbol type even if another type is passed', async () => {
            component.legend = {
              visible: true,
              interactive: false,
              type: 'gradient',
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
          it('should be interactive when interactive prop is true on load', async () => {
            component.legend = {
              visible: true,
              interactive: true,
              format: '',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG['__on']).toBeTruthy();
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
          });
          it('should be interactive when interactive prop is true on update', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.legend = {
              visible: true,
              interactive: true,
              format: '',
              labels: ''
            };
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendPaddingG = legendSVG.querySelector('g');
            const legendG = legendPaddingG.querySelector('g');
            expect(legendG['__on']).toBeTruthy();
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
            component.legend = {
              visible: true,
              interactive: true,
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
            const EXPECTEDLABELS = ['Card-A', 'Card-B'];

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
            const EXPECTEDLABELS = ['DOG', 'CAT'];
            component.legend = {
              visible: true,
              interactive: false,
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

    describe('secondary line', () => {
      const secondaryLines = {
        keys: ['Card-B'],
        showDataLabel: true,
        showSeriesLabel: true,
        opacity: 1
      };
      it('should pass secondaryLines prop', async () => {
        // ARRANGE
        component.secondaryLines = secondaryLines;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // Run Transitions
        const lines = page.doc.querySelectorAll('[data-testid=line]');
        await asyncForEach(lines, async line => {
          flushTransitions(line); // flush transitions to trigger transitionEndAll
          await page.waitForChanges();
        });

        const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
        await asyncForEach(labels, async label => {
          flushTransitions(label); // flush transitions to trigger transitionEndAll
          await page.waitForChanges();
        });

        const seriesLabels = page.doc.querySelectorAll('[data-testid=line-series-label]');
        await asyncForEach(seriesLabels, async seriesLabel => {
          flushTransitions(seriesLabel); // flush transitions to trigger transitionEndAll
          await page.waitForChanges();
        });

        // ASSERT
        // line should be dashed, 1 stroke width, opacity
        const secondaryLine = page.doc.querySelector('[data-testid=line][data-id=line-Card-B]');
        expect(secondaryLine).toEqualAttribute('stroke-width', 1);
        expect(secondaryLine).toEqualAttribute('opacity', 1);
        expect(secondaryLine).toEqualAttribute('stroke-dasharray', '2,2');

        // dataLabels should be visible and have correct opacity
        const secondaryLabels = page.doc.querySelector('[data-testid=dataLabel-group][data-id=dataLabel-group-Card-B]');
        expect(secondaryLabels).toEqualAttribute('opacity', 1);

        // series labels should be visible and have correct opacity
        const secondarySeriesLabels = page.doc.querySelector(
          '[data-testid=line-series-label][data-id=line-series-label-Card-B]'
        );
        expect(secondarySeriesLabels).toEqualAttribute('opacity', 1);
      });
    });
    describe('reference line', () => {
      const referenceLines = [{ label: 'Average', labelPlacementHorizontal: 'right', value: 6300000000 }];
      const referenceStyle = { color: 'categorical_blue', dashed: '', opacity: 0.65, strokeWidth: '2.5px' };
      it('should pass referenceLines prop', async () => {
        // ARRANGE
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
        component.referenceLines = referenceLines;
        component.referenceStyle = referenceStyle;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLine = page.doc.querySelector('[data-testid=reference-line-group]');
        expect(referenceLine).toMatchSnapshot();
      });
    });

    describe('style', () => {
      describe('colorPalette', () => {
        it('should render categorical palette by default', async () => {
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.category))
              .domain()
          );

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDSCALE(EXPECTEDDATA[i].category))[0];
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].category));
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const lineCategory = line.getAttribute('data-id').replace('line-', '');
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDSCALE(lineCategory))[0];
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });
        it('should load single categorical blue when colorPalette is single_categorical_light_blue', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_categorical_light_blue';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDFILLCOLOR)[0];
            expect(marker).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDFILLCOLOR)[0];
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });
        it('should update to single categorical blue when colorPalette is single_categorical_light_blue', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_categorical_light_blue';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDFILLCOLOR)[0];
            expect(marker).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDFILLCOLOR)[0];
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });

        it('should render divergingRtoG when colorPalette is diverging_RtoG', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoG';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.category))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            const EXPECTEDSTROKE = EXPECTEDSCALE(EXPECTEDDATA[i].category);
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].category));
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const lineCategory = line.getAttribute('data-id').replace('line-', '');
            const EXPECTEDSTROKE = EXPECTEDSCALE(lineCategory);
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });

        it('should render diverging_RtoB color when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.category))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            const EXPECTEDSTROKE = EXPECTEDSCALE(EXPECTEDDATA[i].category);
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].category));
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const lineCategory = line.getAttribute('data-id').replace('line-', '');
            const EXPECTEDSTROKE = EXPECTEDSCALE(lineCategory);
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.category))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            const EXPECTEDSTROKE = EXPECTEDSCALE(EXPECTEDDATA[i].category);
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].category));
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            const lineCategory = line.getAttribute('data-id').replace('line-', '');
            const EXPECTEDSTROKE = EXPECTEDSCALE(lineCategory);
            expect(line).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });

      describe('markerStrokes', () => {
        it('should render marker strokes by default using single_categorical_light_blue', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_categorical_light_blue';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          const EXPECTEDSTROKE = getAccessibleStrokes(EXPECTEDFILLCOLOR)[0];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('stroke', EXPECTEDSTROKE);
          });
        });
        it('should not render marker strokes by default using single_categorical_light_blue and passed on load', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_categorical_light_blue';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          component.accessibility = { ...component.accessibility, hideStrokes: true };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker.getAttribute('stroke')).toBeFalsy();
          });
        });
        it('should not render marker strokes by default using single_categorical_light_blue and passed on update', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_categorical_light_blue';
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.accessibility = { ...component.accessibility, hideStrokes: true };
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker.getAttribute('stroke')).toBeFalsy();
          });
        });
      });

      describe('lineTextures', () => {
        const b: string = ',';
        const short: string = '2,2';
        const med: string = '4,2';
        const long: string = '8,2';
        const dashPatterns: any = ['', long, long + b + med, short + b + long + b + long, short + b + short + b + long];
        const textureData: any = moreCategoryData;
        it('should render line textures by default', async () => {
          // ARRANGE
          component.data = textureData;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          lines.forEach((line, i) => {
            expect(line).toEqualAttribute('stroke-dasharray', dashPatterns[i]);
          });
        });
        it('should not render line textures when passed on load', async () => {
          // ARRANGE
          component.data = textureData;
          component.accessibility = { ...component.accessibility, hideTextures: true };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          lines.forEach(line => {
            expect(line.getAttribute('stroke-dasharray')).toBeFalsy();
          });
        });
        it('should not render line textures when passed on update', async () => {
          // ARRANGE
          component.data = textureData;

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.accessibility = { ...component.accessibility, hideTextures: true };
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          lines.forEach(line => {
            expect(line.getAttribute('stroke-dasharray')).toBeFalsy();
          });
        });
      });

      describe('showDots', () => {
        it('should render dots on lines by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('opacity', 1);
          });
        });
        it('should not render dots on lines if passed on load', async () => {
          // ARRANGE
          component.showDots = false;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('opacity', 0);
          });
        });
        it('should not render dots on lines if passed on update', async () => {
          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          // ACT UPDATE
          component.showDots = false;
          await page.waitForChanges();

          // ASSERT
          await asyncForEach(markers, async marker => {
            flushTransitions(marker); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('opacity', 0);
          });
        });
      });
      describe('dotRadius', () => {
        it('should have dot radius of 4 + 1 = 5 on markers by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('r', 5);
          });
        });
        it('should have dot radius of 7 + 1 = 8 on markers on load', async () => {
          // ARRANGE
          component.dotRadius = 7;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('r', 8);
          });
        });
        it('should have dot radius of 3 + 1 = 4 on markers on update', async () => {
          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.dotRadius = 3;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('r', 4);
          });
        });
      });
      describe('strokeWidth', () => {
        it('should have line strokeWidth of 2 by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          lines.forEach(line => {
            expect(line).toEqualAttribute('stroke-width', 2);
          });
        });
        it('should have line strokeWidth of 5 when passed on load', async () => {
          // ARRANGE
          component.strokeWidth = 5;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
          });

          lines.forEach(line => {
            expect(line).toEqualAttribute('stroke-width', 5);
          });
        });
        it('should have line strokeWidth of 3.5 when passed on update', async () => {
          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
            expect(line).toEqualAttribute('stroke-width', 2);
          });

          // ACT UPDATE
          component.strokeWidth = 3.5;
          await page.waitForChanges();

          // ASSERT
          await asyncForEach(lines, async line => {
            flushTransitions(line); // flush transitions to trigger transitionEndAll
            await page.waitForChanges();
            expect(line).toEqualAttribute('stroke-width', 3.5);
          });
        });
      });
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
