/**
 * Copyright (c) 2020, 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { HeatMap } from './heat-map';
import { HeatMapDefaultValues } from './heat-map-default-values';
// import { sum } from 'd3-array';
import { scaleQuantize } from 'd3-scale';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '@visa/visa-charts-data-table/src/components/data-table/data-table';

// importing custom languages and locales
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, visaColors, formatStats } = Utils;

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<heat-map>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new HeatMap()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { year: '2010', item: 'A', value: 40 },
      { year: '2011', item: 'A', value: 23 },
      { year: '2012', item: 'A', value: 14 },
      { year: '2013', item: 'A', value: 20 },
      { year: '2014', item: 'A', value: 2 },
      { year: '2015', item: 'A', value: -10 },
      { year: '2016', item: 'A', value: -10 },
      { year: '2017', item: 'A', value: 15 },
      { year: '2018', item: 'A', value: 4 },
      { year: '2019', item: 'A', value: 73 },
      { year: '2020', item: 'A', value: 64 },
      { year: '2010', item: 'B', value: 20 },
      { year: '2011', item: 'B', value: 33 },
      { year: '2012', item: 'B', value: -4 },
      { year: '2013', item: 'B', value: 3 },
      { year: '2014', item: 'B', value: 10 },
      { year: '2015', item: 'B', value: -10 },
      { year: '2016', item: 'B', value: -5 },
      { year: '2017', item: 'B', value: 23 },
      { year: '2018', item: 'B', value: 6 },
      { year: '2019', item: 'B', value: 21 },
      { year: '2020', item: 'B', value: 57 },
      { year: '2010', item: 'C', value: 70 },
      { year: '2011', item: 'C', value: 53 },
      { year: '2012', item: 'C', value: 54 },
      { year: '2013', item: 'C', value: 20 },
      { year: '2014', item: 'C', value: 42 },
      { year: '2015', item: 'C', value: 17 },
      { year: '2016', item: 'C', value: 22 },
      { year: '2017', item: 'C', value: 45 },
      { year: '2018', item: 'C', value: 78 },
      { year: '2019', item: 'C', value: 51 },
      { year: '2020', item: 'C', value: 8 }
    ];
    const EXPECTEDXACCESSOR = 'year';
    const EXPECTEDYACCESSOR = 'item';
    const EXPECTEDVALUEACCESSOR = 'value';
    const MINVALUE = -10;
    const MAXVALUE = 78;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...HeatMapDefaultValues.accessibility, disableValidation: true };
    const EXPECTEDLOCALIZATION = { ...HeatMapDefaultValues.localization, skipValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [HeatMap, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('heat-map');
      component.data = [...EXPECTEDDATA];
      component.xAccessor = EXPECTEDXACCESSOR;
      component.yAccessor = EXPECTEDYACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.localization = EXPECTEDLOCALIZATION;
      component.uniqueID = 'heat-map-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new HeatMap()).toBeTruthy();
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

        // flush labels for testing to ensure opacity of 1 on initial render
        const elements = page.doc.querySelectorAll('[data-testid=dataLabel]');
        await asyncForEach(elements, async element => {
          flushTransitions(element);
          await page.waitForChanges();
        });

        // ASSERT
        expect(page.root).toMatchSnapshot();
      });

      it('localization: should render localized with minimal props[data,accessors] given', async () => {
        component.localization = {
          language: hu,
          numeralLocale: HU,
          skipValidation: true,
          overwrite: false
        };
        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // flush labels for testing to ensure opacity of 1 on initial render
        const elements = page.doc.querySelectorAll('[data-testid=dataLabel]');
        await asyncForEach(elements, async element => {
          flushTransitions(element);
          await page.waitForChanges();
        });

        // ASSERT
        expect(page.root).toMatchSnapshot();
      });
    });

    describe('generic test suite', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
      });

      afterEach(() => {
        jest.spyOn(console, 'error').mockRestore();
      });
      const heatData = EXPECTEDDATA.map(d => {
        return {
          ...d,
          valueAccessor: d[EXPECTEDVALUEACCESSOR],
          xAccessor: d[EXPECTEDXACCESSOR],
          yAccessor: d[EXPECTEDYACCESSOR]
        };
      });
      Object.keys(unitTestGeneric).forEach(test => {
        const innerTestProps = unitTestGeneric[test].testDefault
          ? { [unitTestGeneric[test].prop]: HeatMapDefaultValues[unitTestGeneric[test].prop] }
          : unitTestGeneric[test].prop === 'data'
          ? { data: heatData }
          : unitTestGeneric[test].testProps;
        const innerTestSelector =
          unitTestGeneric[test].testSelector === 'component-name'
            ? 'heat-map'
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
          // accessibility_keyboard_nav_group_enter_entry: {
          //   name: 'keyboard nav: group - enter will enter group',
          //   testSelector: '[data-testid=bar-group]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 }
          // },
          accessibility_keyboard_nav_group_shift_enter_exit: {
            name: 'keyboard nav: group - shift+enter will exit group',
            testSelector: '[data-testid=marker][data-id=marker-2010-A]',
            nextTestSelector: '[data-testid=map-group]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              selectorAriaLabel: 'year 2010. item A. value 40. Cell 1.',
              nextSelectorAriaLabel: 'item A. row 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-2010-A]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2011-A]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'year 2010. item A. value 40. Cell 1.',
              nextSelectorAriaLabel: 'year 2011. item A. value 23. Cell 2.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=marker][data-id=marker-2020-A]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-A]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: '2020. A. 64. Cell 11.',
              nextSelectorAriaLabel: '2010. A. 40. Cell 1.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-2011-A]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-A]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'year 2011. item A. value 23. Cell 2.',
              nextSelectorAriaLabel: 'year 2010. item A. value 40. Cell 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=marker][data-id=marker-2010-A]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2020-A]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: '2010. A. 40. Cell 1.',
              nextSelectorAriaLabel: '2020. A. 64. Cell 11.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-2010-C]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-B]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'year 2010. item C. value 70. Cell 1.',
              nextSelectorAriaLabel: 'year 2010. item B. value 20. Cell 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=marker][data-id=marker-2010-A]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-C]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: '2010. A. 40. Cell 1.',
              nextSelectorAriaLabel: '2010. C. 70. Cell 1.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-2010-B]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-C]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: '2010. B. 20. Cell 1.',
              nextSelectorAriaLabel: '2010. C. 70. Cell 1.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=marker][data-id=marker-2010-C]',
            nextTestSelector: '[data-testid=marker][data-id=marker-2010-A]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: '2010. C. 70. Cell 1.',
              nextSelectorAriaLabel: '2010. A. 40. Cell 1.'
            }
          }
          // these group tests should work, but getting focus onto the row
          // may require some additional steps not currently in the test
          // e.g., we may want to focus a mark and then esc to group
          // as direct selection of group does not seem to work (and doesn't work that way in component either)
          // accessibility_keyboard_nav_right_arrow_group: {
          //   name: 'keyboard nav: group - right arrow goes to next',
          //   testSelector: '[data-testid=map-row][data-id=row-A]',
          //   nextTestSelector: '[data-testid=map-row][data-id=row-B]',
          //   keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
          //   testProps: {
          //     selectorAriaLabel: 'item A. Row 1 of 3 which contains 11 interactive cells.',
          //     nextSelectorAriaLabel: 'item B. Row 2 of 3 which contains 11 interactive cells.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // },
          // accessibility_keyboard_nav_right_arrow_group_loop: {
          //   name: 'keyboard nav: group - right arrow goes to next',
          //   testSelector: '[data-testid=map-row][data-id=row-C]',
          //   nextTestSelector: '[data-testid=map-row][data-id=row-A]',
          //   keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
          //   testProps: {
          //     selectorAriaLabel: 'item C. Row 3 of 3 which contains 11 interactive cells.',
          //     nextSelectorAriaLabel: 'item A. Row 1 of 3 which contains 11 interactive cells.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // },
          // accessibility_keyboard_nav_left_arrow_group: {
          //   name: 'keyboard nav: group - left arrow goes to next',
          //   testSelector: '[data-testid=map-row][data-id=row-C]',
          //   nextTestSelector: '[data-testid=map-row][data-id=row-B]',
          //   keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
          //   testProps: {
          //     selectorAriaLabel: 'item C. Row 3 of 3 which contains 11 interactive cells.',
          //     nextSelectorAriaLabel: 'item B. Row 2 of 3 which contains 11 interactive cells.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // },
          // accessibility_keyboard_nav_left_arrow_group_loop: {
          //   name: 'keyboard nav: group - left arrow loops to last from first',
          //   testSelector: '[data-testid=map-row][data-id=row-A]',
          //   nextTestSelector: '[data-testid=map-row][data-id=row-C]',
          //   keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
          //   testProps: {
          //     selectorAriaLabel: 'A. Row 1 of 3 which contains 11 interactive cells.',
          //     nextSelectorAriaLabel: 'C. Row 3 of 3 which contains 11 interactive cells.',
          //   }
          // },
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: HeatMapDefaultValues[unitTestAccessibility[test].prop] }
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
                        title: 'The month of june',
                        label: "June's volume is here.",
                        bgPadding: 20,
                        align: 'middle',
                        wrap: 210
                      },
                      accessibilityDescription: 'This annotation is a callout to June, which is for testing purposes.',
                      data: { month: 'Jun-17', value: 3234002, cat: 'A' },
                      dy: '-20%',
                      color: 'pri_blue'
                    }
                  ]
                : []
          };
          const innerTestSelector =
            unitTestAccessibility[test].testSelector === 'component-name'
              ? 'heat-map'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=marker]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=map-row]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=marker][data-id=marker-2010-A]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=marker][data-id=marker-2010-B]'
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
            // } else if (
            //   // these accessibility tests need a group accessor for bar-chart
            //   test === 'accessibility_categorical_textures_created_by_default' ||
            //   test === 'accessibility_group_aria_label_add_update' ||
            //   test === 'accessibility_group_aria_label_remove_update'
            // ) {
            //   it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
            //     unitTestAccessibility[test].testFunc(
            //       component,
            //       page,
            //       innerTestProps,
            //       innerTestSelector,
            //       innerNextTestSelector
            //     ));
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
            // skipping textures for heat-map as they are off by default, unlike other charts
          } else if (
            test === 'accessibility_focus_marker_style' ||
            test === 'accessibility_textures_on_by_default' ||
            test === 'accessibility_categorical_textures_created_by_default' ||
            test === 'accessibility_referenceLine_description_set_on_load' ||
            test === 'accessibility_referenceLine_description_set_on_update'
          ) {
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
    });

    describe('margin & padding', () => {
      it('refer to generic results above for margin & padding tests', () => {
        expect(true).toBeTruthy();
      });
    });

    // annotations break in jsdom due to their text wrapping function in d3-annotation
    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      it('should pass annotation prop', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              title: '2011:',
              label: 'The year 2011',
              bgPadding: 0,
              align: 'center',
              lineType: 'none',
              wrap: 250
            },
            y: '0%',
            x: ['2010'],
            className: 'heatmap-annotation',
            type: 'annotationCalloutRect',
            accessibilityDescription: 'This annotation is a callout to 2011, which is for testing purposes.',
            subject: {
              width: ['2011', '2010'],
              height: '100%'
            },
            disable: ['connector']
          }
        ];
        component.annotations = annotations;

        // ACT
        page.root.append(component);
        await page.waitForChanges();

        // ASSERT
        const annotationGroup = page.doc.querySelector('[data-testid=annotation-group]');
        expect(annotationGroup).toMatchSnapshot();
      });
    });

    describe('axes', () => {
      describe('minValueOverride', () => {
        it('should reset legend and component when min override is passed', async () => {
          const valueColorScale = scaleQuantize()
            .domain([-20, MAXVALUE])
            .range(getColors('sequential_suppPurple', 5));

          component.minValueOverride = -20;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          const legendGText = legendGs[0].childNodes[1].textContent; // tslint:disable-line: no-string-literal
          const markerCells = page.doc.querySelectorAll('[data-testid=marker]');
          expect(legendGText.substring(0, 3)).toEqual('-20');
          markerCells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
      });
      describe('maxValueOverride', () => {
        it('should reset legend and component when min override is passed', async () => {
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, 100])
            .range(getColors('sequential_suppPurple', 5));

          // need to set legend to key for this text to work
          component.legend = {
            visible: true,
            type: 'key',
            format: '0,0'
          };
          component.maxValueOverride = 100;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          const legendGText = legendGs[4].childNodes[1].textContent; // tslint:disable-line: no-string-literal
          const markerCells = page.doc.querySelectorAll('[data-testid=marker]');
          expect(legendGText.substring(legendGText.length - 3)).toEqual('100');
          markerCells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
      });

      describe('hideAxisPath', () => {
        it('baseline on xAxis and yAxis should visible by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisPath = page.doc.querySelector('[data-testid=x-axis]').querySelector('path');
          const yAxisPath = page.doc.querySelector('[data-testid=y-axis]').querySelector('path');
          expect(xAxisPath).not.toHaveClass('hidden');
          expect(yAxisPath).not.toHaveClass('hidden');
        });
        it('should flip visibility of baselines on load', async () => {
          // ARRANGE
          component.hideAxisPath = true;

          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisPath = page.doc.querySelector('[data-testid=x-axis]').querySelector('path');
          const yAxisPath = page.doc.querySelector('[data-testid=y-axis]').querySelector('path');
          expect(xAxisPath).toHaveClass('hidden');
          expect(yAxisPath).toHaveClass('hidden');
        });
        it('should flip opacity of baselines on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.hideAxisPath = true;
          await page.waitForChanges();

          // ASSERT
          const xAxisPath = page.doc.querySelector('[data-testid=x-axis]').querySelector('path');
          const yAxisPath = page.doc.querySelector('[data-testid=y-axis]').querySelector('path');
          expect(xAxisPath).toHaveClass('hidden');
          expect(yAxisPath).toHaveClass('hidden');
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

      describe('axis.label', () => {
        it('should place axis label when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '0[.][0][0]a',
            label: 'Custom X Axis Label',
            tickInterval: 1,
            visible: true
          };
          const EXPECTEDYAXIS = {
            visible: true,
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
        it('xAxis should have default format applied to numbers', async () => {
          // ARRANGE
          component.wrapLabel = false;
          const EXPECTEDTICKS = [
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020'
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('yAxis should have default format applied to numbers', async () => {
          // ARRANGE
          component.wrapLabel = false;
          component.yAccessor = EXPECTEDXACCESSOR;
          component.xAccessor = EXPECTEDYACCESSOR;
          const EXPECTEDTICKS = [
            '2010',
            '2011',
            '2012',
            '2013',
            '2014',
            '2015',
            '2016',
            '2017',
            '2018',
            '2019',
            '2020'
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const YAxisTicks = page.doc.querySelectorAll('[data-testid=Y-axis] [data-testid=axis-tick]');
          YAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
        it('xAxis should have custom format applied to numbers if passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '$0[.][0]',
            gridVisible: true,
            label: 'Custom X Axis Label',
            tickInterval: 1,
            visible: true
          };
          component.wrapLabel = false;
          component.xAxis = EXPECTEDXAXIS;
          const EXPECTEDTICKS = [
            '$2010',
            '$2011',
            '$2012',
            '$2013',
            '$2014',
            '$2015',
            '$2016',
            '$2017',
            '$2018',
            '$2019',
            '$2020'
          ];

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
          const EXPECTEDYAXIS = {
            format: '$0[.][0]',
            gridVisible: true,
            label: 'Custom Y Axis Label',
            tickInterval: 1,
            visible: true
          };
          component.wrapLabel = false;
          component.yAccessor = EXPECTEDXACCESSOR;
          component.xAccessor = EXPECTEDYACCESSOR;
          component.yAxis = EXPECTEDYAXIS;
          const EXPECTEDTICKS = [
            '$2010',
            '$2011',
            '$2012',
            '$2013',
            '$2014',
            '$2015',
            '$2016',
            '$2017',
            '$2018',
            '$2019',
            '$2020'
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const YAxisTicks = page.doc.querySelectorAll('[data-testid=Y-axis] [data-testid=axis-tick]');
          YAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDTICKS[i]);
          });
        });
      });

      describe('axis.tickInterval', () => {
        const EXPECTEDXTICKS = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020'];
        const EXPECTEDYTICKS = ['A', 'B', 'C'];
        it('should have tick interval one by default', async () => {
          // ARRANGE
          component.wrapLabel = false;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick]');
          const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick]');
          xAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDXTICKS[i]);
          });
          yAxisTicks.forEach((tick, i) => {
            expect(tick).toEqualText(EXPECTEDYTICKS[i]);
          });
        });
        it('should have tick interval 2 when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            tickInterval: 2,
            visible: true
          };
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
            const expectedAxisText = i % 2 === 0 ? EXPECTEDXTICKS[i] : '';
            expect(tick).toEqualText(expectedAxisText);
          });
          yAxisTicks.forEach((tick, i) => {
            const expectedAxisText = i % 2 === 0 ? EXPECTEDYTICKS[i] : '';
            expect(tick).toEqualText(expectedAxisText);
          });
        });
      });

      describe('wrapLabel', () => {
        it('should render wrapped ordinal tick labels when wrapLabel is true (default)', async () => {
          component.width = 400;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const xAxisTicksText = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');
          xAxisTicksText.forEach((text, i) => {
            const textTspans = text.querySelectorAll('[data-testid=axis-tick-text-tspan]');
            expect(textTspans.length).toBeGreaterThanOrEqual(1);
            expect(text['__data__']).toEqual(EXPECTEDDATA[i][EXPECTEDXACCESSOR]); // tslint:disable-line: no-string-literal
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
            expect(text).toEqualText(EXPECTEDDATA[i][EXPECTEDXACCESSOR]);
          });
        });
      });
    });

    describe('interaction', () => {
      describe('cell based interaction tests', () => {
        const innerTestProps = {
          colorPalette: 'single_categorical_light_blue',
          transitionEndAllSelector: '[data-testid=marker]',
          clickStyle: {
            color: visaColors.categorical_light_blue, // use this as it is referenced in test
            strokeWidth: 2
          },
          hoverStyle: {
            color: visaColors.categorical_light_blue, // use this as it is referenced in test
            strokeWidth: 2
          }
        };
        const innerTestSelector = '[data-testid=marker][data-id=marker-2010-A]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-2010-B]';
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
        const innerTestSelector = '[data-testid=marker][data-id=marker-2010-A]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-2011-A]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_blue, // use this as it is referenced in test
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          colorPalette: 'single_categorical_light_blue',
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year'],
          transitionEndAllSelector: '[data-testid=marker]'
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
          colorPalette: 'single_categorical_light_blue',
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['item'],
          transitionEndAllSelector: '[data-testid=marker]'
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-2010-A]',
            '[data-testid=marker][data-id=marker-2010-B]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-2010-A]',
            '[data-testid=marker][data-id=marker-2010-B]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=marker][data-id=marker-2010-A]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-2010-B]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_blue, // use this as it is referenced in test
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          colorPalette: 'single_categorical_light_blue',
          hoverStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['item'],
          transitionEndAllSelector: '[data-testid=marker]'
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
          colorPalette: 'single_categorical_light_blue',
          hoverStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['year'],
          transitionEndAllSelector: '[data-testid=marker]'
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-2010-A]',
            '[data-testid=marker][data-id=marker-2011-A]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-2010-A]',
            '[data-testid=marker][data-id=marker-2011-A]'
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
        describe('cell based events', () => {
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

      describe('xKeyOrder', () => {
        it('should render data in order by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2015-A]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2020-A]');

          expect(parseFloat(elementA.getAttribute('x'))).toBeLessThan(parseFloat(elementB.getAttribute('x')));
          expect(parseFloat(elementB.getAttribute('x'))).toBeLessThan(parseFloat(elementC.getAttribute('x')));
        });
        it('should render data in order passed on load', async () => {
          component.xKeyOrder = [
            '2020',
            '2019',
            '2018',
            '2017',
            '2016',
            '2015',
            '2014',
            '2013',
            '2012',
            '2011',
            '2010'
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2015-A]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2020-A]');

          expect(parseFloat(elementC.getAttribute('x'))).toBeLessThan(parseFloat(elementB.getAttribute('x')));
          expect(parseFloat(elementB.getAttribute('x'))).toBeLessThan(parseFloat(elementA.getAttribute('x')));
        });
        it('should render data in order passed on update', async () => {
          component.xKeyOrder = [
            '2020',
            '2019',
            '2018',
            '2017',
            '2016',
            '2015',
            '2014',
            '2013',
            '2012',
            '2011',
            '2010'
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.yKeyOrder = ['B', 'C', 'A'];
          await page.waitForChanges();

          // FLUSH TRANSITIONS
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
          });

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2015-A]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2020-A]');

          expect(parseFloat(elementC.getAttribute('x'))).toBeLessThan(parseFloat(elementB.getAttribute('x')));
          expect(parseFloat(elementB.getAttribute('x'))).toBeLessThan(parseFloat(elementA.getAttribute('x')));
        });
      });

      describe('yKeyOrder', () => {
        it('should render data in order by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-B]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-C]');

          expect(parseFloat(elementA.getAttribute('y'))).toBeLessThan(parseFloat(elementB.getAttribute('y')));
          expect(parseFloat(elementB.getAttribute('y'))).toBeLessThan(parseFloat(elementC.getAttribute('y')));
        });
        it('should render data in order passed on load', async () => {
          component.yKeyOrder = ['B', 'C', 'A'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-B]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-C]');

          expect(parseFloat(elementB.getAttribute('y'))).toBeLessThan(parseFloat(elementC.getAttribute('y')));
          expect(parseFloat(elementC.getAttribute('y'))).toBeLessThan(parseFloat(elementA.getAttribute('y')));
        });
        it('should render data in order passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.yKeyOrder = ['B', 'C', 'A'];
          await page.waitForChanges();

          // FLUSH TRANSITIONS
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
          });

          // ASSERT
          const elementA = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-A]');
          const elementB = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-B]');
          const elementC = page.doc.querySelector('[data-testid=marker][data-id=marker-2010-C]');

          expect(parseFloat(elementB.getAttribute('y'))).toBeLessThan(parseFloat(elementC.getAttribute('y')));
          expect(parseFloat(elementC.getAttribute('y'))).toBeLessThan(parseFloat(elementA.getAttribute('y')));
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
            const innerTestSelector = '[data-testid=marker][data-id=marker-2010-A]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;">X Axis:<b>2010</b><br>Y Axis:<b>A</b><br>Value:<b>40</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>A</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>A</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$40</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$40</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;">Test Year:<b>2010</b><br>Y Axis:<b>A</b><br>Value:<b>40</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;">Test Year:<b>2010</b><br>Y Axis:<b>A</b><br>Value:<b>40</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load: 'Test Year 2010. item A. value 40. Cell 1.',
              dataKeyNames_custom_on_update: 'Test Year 2010. item A. value 40. Cell 1.'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            const customDataKeyNames = { dataKeyNames: { year: 'Test Year' } };
            // we have to handle clickEvent separately due to this.zooming boolean in circle-packing load
            if (test === 'dataKeyNames_custom_on_load' || test === 'dataKeyNames_custom_on_update') {
              it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name}`, () =>
                unitTestTooltip[test].testFunc(
                  component,
                  page,
                  {
                    ...innerTestProps,
                    ...customDataKeyNames,
                    accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true },
                    selectorAriaLabel: innerAriaContent[test]
                  },
                  innerTestSelector,
                  innerTooltipContent[test]
                ));
            } else {
              it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name}`, () =>
                unitTestTooltip[test].testFunc(
                  component,
                  page,
                  innerTestProps,
                  innerTestSelector,
                  innerTooltipContent[test]
                ));
            }
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
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
          it('should render the random value if label accessor is passed', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            const EXPECTEDDATARANDOM = [
              { year: '2010', item: 'A', value: 40, random: Math.random() },
              { year: '2011', item: 'A', value: 23, random: Math.random() },
              { year: '2012', item: 'A', value: 14, random: Math.random() },
              { year: '2013', item: 'A', value: 20, random: Math.random() },
              { year: '2014', item: 'A', value: 2, random: Math.random() },
              { year: '2015', item: 'A', value: -10, random: Math.random() },
              { year: '2016', item: 'A', value: -10, random: Math.random() },
              { year: '2017', item: 'A', value: 15, random: Math.random() },
              { year: '2018', item: 'A', value: 4, random: Math.random() },
              { year: '2019', item: 'A', value: 73, random: Math.random() },
              { year: '2020', item: 'A', value: 64, random: Math.random() },
              { year: '2010', item: 'B', value: 20, random: Math.random() },
              { year: '2011', item: 'B', value: 33, random: Math.random() },
              { year: '2012', item: 'B', value: -4, random: Math.random() },
              { year: '2013', item: 'B', value: 3, random: Math.random() },
              { year: '2014', item: 'B', value: 10, random: Math.random() },
              { year: '2015', item: 'B', value: -10, random: Math.random() },
              { year: '2016', item: 'B', value: -5, random: Math.random() },
              { year: '2017', item: 'B', value: 23, random: Math.random() },
              { year: '2018', item: 'B', value: 6, random: Math.random() },
              { year: '2019', item: 'B', value: 21, random: Math.random() },
              { year: '2020', item: 'B', value: 57, random: Math.random() }
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

        describe('legend', () => {
          describe('visible', () => {
            it('by default the legend should render due to lack of group accessor', async () => {
              // ACT
              page.root.appendChild(component);
              await page.waitForChanges();

              // ASSERT
              const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
              const legendContainer = legendSVG.parentElement;
              const legendPaddingG = legendSVG.querySelector('g');
              const legendG = legendPaddingG.querySelector('g');
              expect(legendContainer.getAttribute('style')).toEqual('display: block;');
              expect(legendContainer).toHaveClass('heat-map-legend');
              expect(legendSVG).toEqualAttribute('opacity', 1);
              expect(legendPaddingG).toHaveClass('legend-padding-wrapper');
              expect(legendG).toHaveClass('legend');
              expect(legendG).toHaveClass('default');
            });
            it('should render, but not be visible if false is passed', async () => {
              component.legend = {
                visible: false,
                interactive: false,
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
          });
          describe('type', () => {
            it('should be default type by default', async () => {
              // ACT
              page.root.appendChild(component);
              await page.waitForChanges();

              // ASSERT
              const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
              const legendPaddingG = legendSVG.querySelector('g');
              const legendG = legendPaddingG.querySelector('g');
              expect(legendG).toHaveClass('legend');
              expect(legendG).toHaveClass('default');
            });
            it('should be key type if passed', async () => {
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
              expect(legendG).toHaveClass('key');
            });
          });
          describe('format', () => {
            it('should format number if passed as prop', async () => {
              component.legend = {
                visible: true,
                type: 'key',
                format: '$0,0',
                labels: [15, 30, 45, 60, 75]
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
              const EXPECTEDLABELS = ['-10-8', '8-25', '25-43', '43-60', '60-78'];
              component.legend = {
                visible: true,
                format: '0,0',
                type: 'key'
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
            it('should have custom labels when passed as prop', async () => {
              const EXPECTEDLABELS = ['A', 'B', 'C', 'D', 'E'];
              component.legend = {
                visible: true,
                type: 'key',
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
    });

    describe('style no textures', () => {
      // should not need this anymore
      // beforeEach(() => {
      //   component.accessibility = { ...component.accessibility, hideTextures: true };
      // });

      describe('colorPalette', () => {
        it('should render sequential supp purple by default', async () => {
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, MAXVALUE])
            .range(getColors('sequential_suppPurple', 5));

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
        it('should load sequential grey when colorPalette is sequential_grey', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_grey';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, MAXVALUE])
            .range(getColors(EXPECTEDCOLORPALETTE, 5));

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
        it('should update to sequential grey when colorPalette is sequential_grey', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_grey';
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, MAXVALUE])
            .range(getColors(EXPECTEDCOLORPALETTE, 5));

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf', '#226092'];
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, MAXVALUE])
            .range(colors);
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach((cell, i) => {
            expect(cell).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i][EXPECTEDVALUEACCESSOR]));
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });

      describe('strokeWidth', () => {
        it('should render strokeWidth 2 by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach(cell => {
            expect(cell).toEqualAttribute('width', 29.648760330578508);
          });
        });
        it('should render strokeWidth 5 if passed', async () => {
          component.strokeWidth = 5;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach(cell => {
            expect(cell).toEqualAttribute('width', 26.440460947503198);
          });
        });
      });
      describe('shape', () => {
        it('should render rectangle cells by default', async () => {
          // ARRANGE
          const EXPECTEDROUNDEDCORNER = 0;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach(cell => {
            expect(cell).toEqualAttribute('rx', EXPECTEDROUNDEDCORNER);
            expect(cell).toEqualAttribute('ry', EXPECTEDROUNDEDCORNER);
          });
        });

        it('should render circles (rounded rects) if passed', async () => {
          // ARRANGE
          component.shape = 'circle';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const cells = page.doc.querySelectorAll('[data-testid=marker]');
          cells.forEach(cell => {
            expect(parseFloat(cell.getAttribute('rx'))).toBeGreaterThan(0);
            expect(parseFloat(cell.getAttribute('ry'))).toBeGreaterThan(0);
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
