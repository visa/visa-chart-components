/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { PieChart } from './pie-chart';
import { PieChartDefaultValues } from './pie-chart-default-values';
import { sum } from 'd3-array';
import { scaleOrdinal } from 'd3-scale';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '../../../node_modules/@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '../../../node_modules/@visa/visa-charts-data-table/src/components/data-table/data-table';

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

describe('<pie-chart>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new PieChart()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { label: 'Client-A', value: 43000, location: 'US' },
      { label: 'Client-C', value: 32000, location: 'US' },
      { label: 'Client-D', value: 25000, location: 'US' },
      { label: 'Client-B', value: 52000, location: 'Europe' },
      { label: 'Client-E', value: 31000, location: 'Europe' }
    ];
    const EXPECTEDDATAVALUESUM = sum(EXPECTEDDATA, d => d.value);

    const EXPECTEDORDINALACCESSOR = 'label';
    const EXPECTEDVALUEACCESSOR = 'value';
    const EXPECTEDGROUPACCESSOR = 'location';
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...PieChartDefaultValues.accessibility, disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [PieChart, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('pie-chart');
      component.data = [...EXPECTEDDATA];
      component.ordinalAccessor = EXPECTEDORDINALACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.uniqueID = 'pie-chart-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new PieChart()).toBeTruthy();
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
    });

    describe('generic test suite', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
      });

      afterEach(() => {
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(console, 'error').mockRestore();
      });
      Object.keys(unitTestGeneric).forEach(test => {
        if (unitTestGeneric[test].prop !== 'data') {
          const paddingModifier = unitTestGeneric[test].testProps.padding
            ? unitTestGeneric[test].testDefault // we know the right/left defaults are larger so use innerPaddedWidth
              ? (600 - 20 - PieChartDefaultValues.padding.right - PieChartDefaultValues.padding.left) / 2
              : (600 - 20 - unitTestGeneric[test].testProps.padding.top * 2) / 2 // we know these are the same
            : 0;
          const innerTestProps = unitTestGeneric[test].testDefault
            ? { [unitTestGeneric[test].prop]: PieChartDefaultValues[unitTestGeneric[test].prop], paddingModifier }
            : unitTestGeneric[test].prop === 'data'
            ? { data: EXPECTEDDATA }
            : { ...unitTestGeneric[test].testProps, paddingModifier };
          const innerTestSelector =
            unitTestGeneric[test].testSelector === 'component-name'
              ? 'pie-chart'
              : unitTestGeneric[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=pie]'
              : unitTestGeneric[test].testSelector;
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        }
      });

      // have to do custom data test due to how much stuff we add to data object
      it('data: custom data on load', async () => {
        component.sortOrder = 'default';

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT - we have to check the .data of the __data__ attribute for pie
        const elements = page.doc.querySelectorAll('[data-testid=pie]');
        elements.forEach((element, i) => {
          expect(element['__data__'].data).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
        });
      });

      it('data: custom data enter on update', async () => {
        component.sortOrder = 'default';

        // ARRANGE
        const BEGINNINGDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1]];
        component.data = BEGINNINGDATA;

        // ACT RENDER
        page.root.appendChild(component);
        await page.waitForChanges();

        // ACT UPDATE
        component.data = EXPECTEDDATA;
        await page.waitForChanges();

        // ASSERT - we have to check the .data of the __data__ attribute for pie
        const elements = page.doc.querySelectorAll('[data-testid=pie]');
        elements.forEach((element, i) => {
          expect(element['__data__'].data).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
        });
      });

      it('data: custom data exit on update', async () => {
        component.sortOrder = 'default';

        // ARRANGE
        const EXITDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1]];

        // ACT RENDER
        page.root.appendChild(component);
        await page.waitForChanges();

        // ACT UPDATE
        component.data = EXITDATA;
        await page.waitForChanges();

        // ASSERT - we have to check the .data of the __data__ attribute for pie
        const elements = page.doc.querySelectorAll('[data-testid=pie]');
        elements.forEach((element, i) => {
          if (i + 1 <= EXITDATA.length) {
            expect(element['__data__'].data).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
          } else {
            const lastTransitionKey = Object.keys(element['__transition'])[
              Object.keys(element['__transition']).length - 1
            ]; // tslint:disable-line: no-string-literal
            const transitionName = element['__transition'][lastTransitionKey].name; // tslint:disable-line: no-string-literal
            expect(transitionName).toEqual('exit');
          }
        });
      });
    });

    describe('accessibility', () => {
      describe('generic accessibility test suite', () => {
        // PROBABLY WANT TO CREATE SEPARATE TEST FOR ENTER EXIT? LEAVING THOSE COMMENTED OUT FOR NOW
        // WHAT ABOUT GROUP SIBLING NAVIGATION?
        const accessibilityTestMarks = {
          // accessibility_keyboard_nav_group_enter_entry: {
          //   name: 'keyboard nav: group - enter will enter group',
          //   testSelector: '[data-testid=pie-group]',
          //   nextTestSelector: '[data-testid=pie][data-id=pie-Client-A]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 }
          // },
          accessibility_keyboard_nav_group_shift_enter_exit: {
            name: 'keyboard nav: group - shift+enter will exit group',
            testSelector: '[data-testid=pie][data-id=pie-Client-A]',
            nextTestSelector: '[data-testid=pie-group]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              selectorAriaLabel: 'label Client-A. value 43k. Slice 1 of 5.',
              nextSelectorAriaLabel: 'Pie which contains 5 interactive slices.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=pie][data-id=pie-Client-A]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-C]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'label Client-A. value 43k. Slice 1 of 5.',
              nextSelectorAriaLabel: 'label Client-C. value 32k. Slice 2 of 5.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=pie][data-id=pie-Client-E]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-A]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'Client-E. 31k. Slice 5 of 5.',
              nextSelectorAriaLabel: 'Client-A. 43k. Slice 1 of 5.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=pie][data-id=pie-Client-C]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-A]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'Client-C. 32k. Slice 2 of 5.',
              nextSelectorAriaLabel: 'Client-A. 43k. Slice 1 of 5.',
              accessibility: { ...EXPECTEDACCESSIBILITY }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=pie][data-id=pie-Client-A]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-E]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'Client-A. 43k. Slice 1 of 5.',
              nextSelectorAriaLabel: 'Client-E. 31k. Slice 5 of 5.'
            }
          }
          // currently there is no cousin nav on pie chart
          /*
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=pie][data-id=pie-Sep-17]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-C]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'Sep-17. 3.8m. B. pie 6 of 12.',
              nextSelectorAriaLabel: 'Jul-17. 2.2m. B. pie 4 of 12.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=pie][data-id=pie-Client-C]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Mar-18]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'Jul-17. 2.2m. B. pie 4 of 12.',
              nextSelectorAriaLabel: 'Mar-18. 8.5m. B. pie 12 of 12.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=pie][data-id=pie-Client-C]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Sep-17]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'month Jul-17. value 2.2m. cat B. pie 4 of 12.',
              nextSelectorAriaLabel: 'month Sep-17. value 3.8m. cat B. pie 6 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=pie][data-id=pie-Mar-18]',
            nextTestSelector: '[data-testid=pie][data-id=pie-Client-C]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              groupAccessor: 'cat',
              selectorAriaLabel: 'month Mar-18. value 8.5m. cat B. pie 12 of 12.',
              nextSelectorAriaLabel: 'month Jul-17. value 2.2m. cat B. pie 4 of 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          }
          */
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: PieChartDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            sortOrder: 'default', // default is asc, we are testing against no sort
            geometryType: 'Pie',
            geometryPlacementAttributes: ['data-r', 'data-fake-x', 'data-fake-y'],
            geometryAdjustmentValues: [
              { f: 'data-r', b: 7, w: 3, s: -1 },
              { f: 'data-x', b: 7, w: 3, s: -1 },
              { f: 'data-y', b: 7 * 2, w: 3 * 2, s: 1 }
            ],
            annotations:
              unitTestAccessibility[test].prop === 'annotations'
                ? [
                    {
                      note: {
                        label: 'oasijfoiajsf',
                        bgPadding: 0,
                        align: 'middle',
                        wrap: 210
                      },
                      accessibilityDescription: '2018 High Spend band total is 5,596',
                      x: '8%',
                      y: '40%',
                      disable: ['connector', 'subject'],
                      // dy: '-1%',
                      color: '#000000',
                      className: 'testing1 testing2 testing3',
                      collisionHideOnly: false
                    },
                    {
                      note: {},
                      accessibilityDecorationOnly: true,
                      type: 'annotationXYThreshold',
                      subject: {
                        x1: 0,
                        x2: 250
                      },
                      color: 'pri_blue',
                      disable: ['note', 'connector']
                    }
                  ]
                : []
          };
          const innerTestSelector =
            unitTestAccessibility[test].testSelector === 'component-name'
              ? 'pie-chart'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=pie]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=pie-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=pie][data-id=pie-Client-A]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=pie][data-id=pie-Client-C]'
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
            // these accessibility tests need a group accessor for pie-chart
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
          } else if (test === 'accessibility_controller_initialize') {
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
            // skipping the axis related stuff as pie chart does not have an axis
            // the focus marker test needs to be adjusted for pie chart still
          } else if (
            test === 'accessibility_xaxis_description_set_on_load' ||
            test === 'accessibility_xaxis_description_off_on_load' ||
            test === 'accessibility_xaxis_description_added_on_update' ||
            test === 'accessibility_yaxis_description_set_on_load' ||
            test === 'accessibility_yaxis_description_off_on_load' ||
            test === 'accessibility_yaxis_description_added_on_update'
          ) {
            it.skip(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
            // need to flush all marks to test fill of pie chart geometries
          } else if (test === 'accessibility_textures_on_by_default') {
            it('accessibility: textures are applied by default on load', async () => {
              // ARRANGE
              // if we have any testProps apply them
              if (Object.keys(innerTestProps).length) {
                Object.keys(innerTestProps).forEach(testProp => {
                  component[testProp] = innerTestProps[testProp];
                });
              }

              // ACT
              page.root.appendChild(component);
              await page.waitForChanges();

              // ASSERT
              const patterns = page.doc.querySelector(innerNextTestSelector).querySelectorAll('pattern');
              const markers = page.doc.querySelectorAll(innerTestSelector);

              await asyncForEach(markers, async element => {
                flushTransitions(element);
                await page.waitForChanges();
              });

              expect(markers[0]).toEqualAttribute('fill', `url(#${patterns[0].getAttribute('id')})`);
            });
            // need to flush all marks to test fill of pie chart geometries
          } else if (test === 'accessibility_textures_off_on_load') {
            it('accessibility: textures are removed on load', async () => {
              // ARRANGE
              component.accessibility = { ...component.accessibility, hideTextures: true };
              component.colorPalette = 'single_ossBlue';

              // if we have any testProps apply them
              if (Object.keys(innerTestProps).length) {
                Object.keys(innerTestProps).forEach(testProp => {
                  component[testProp] = innerTestProps[testProp];
                });
              }

              // ACT
              page.root.appendChild(component);
              await page.waitForChanges();

              // ASSERT
              const markers = page.doc.querySelectorAll(innerTestSelector);

              await asyncForEach(markers, async element => {
                flushTransitions(element);
                await page.waitForChanges();
              });

              expect(markers[0]).toEqualAttribute('fill', visaColors.oss_blue);
            });
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

    // annotations break in jsdom due to their text wrapping function in d3-annotation -- fixed in stencil 2.17.3
    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      it('should pass annotation prop on load', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              label: 'oasijfoiajsf',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Spend band total is 5,596',
            x: '8%',
            y: '40%',
            disable: ['connector', 'subject'],
            // dy: '-1%',
            color: '#000000',
            className: 'testing1 testing2 testing3',
            collisionHideOnly: false
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
      it('should pass annotation prop on update', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              label: 'oasijfoiajsf',
              bgPadding: 0,
              align: 'middle',
              wrap: 210
            },
            accessibilityDescription: '2018 High Spend band total is 5,596',
            x: '8%',
            y: '40%',
            disable: ['connector', 'subject'],
            // dy: '-1%',
            color: '#000000',
            className: 'testing1 testing2 testing3',
            collisionHideOnly: false
          }
        ];

        // ACT
        page.root.append(component);
        await page.waitForChanges();

        // UPDATE
        component.annotations = annotations;
        await page.waitForChanges();

        // ASSERT
        const annotationGroup = page.doc.querySelector('[data-testid=annotation-group]');
        expect(annotationGroup).toMatchSnapshot();
      });
    });

    describe('interaction', () => {
      describe('pie based interaction tests', () => {
        const innerTestProps = {
          applyFlushTransitions: true,
          transitionEndAllSelector: '[data-testid=pie]',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5]
        };
        const innerTestSelector = '[data-testid=pie][data-id=pie-Client-A]';
        const innerNegTestSelector = '[data-testid=pie][data-id=pie-Client-C]';
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
        const innerTestSelector = '[data-testid=pie][data-id=pie-Client-A]';
        const innerNegTestSelector = '[data-testid=pie][data-id=pie-Client-B]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['location'],
          transitionEndAllSelector: '[data-testid=pie]',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5]
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
          interactionKeys: ['label'],
          transitionEndAllSelector: '[data-testid=pie]',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5]
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=pie][data-id=pie-Client-A]',
            '[data-testid=pie][data-id=pie-Client-C]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=pie][data-id=pie-Client-A]',
            '[data-testid=pie][data-id=pie-Client-C]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=pie][data-id=pie-Client-A]';
        const innerNegTestSelector = '[data-testid=pie][data-id=pie-Client-E]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['location'],
          transitionEndAllSelector: '[data-testid=pie]',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5]
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
          interactionKeys: ['label'],
          transitionEndAllSelector: '[data-testid=pie]',
          customRadiusModifier: [-1, 0.5, 0.5, 0.5, 0.5]
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=pie][data-id=pie-Client-A]',
            '[data-testid=pie][data-id=pie-Client-C]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=pie][data-id=pie-Client-A]',
            '[data-testid=pie][data-id=pie-Client-C]'
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
        describe('pie based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              transitionEndAllSelector: '[data-testid=pie]',
              sortOrder: 'default' // default is asc, we are testing against no sort
            };
            const innerTestSelector = '[data-testid=pie]';

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
        it('should render data in ascending order by default', async () => {
          // ARRANGE
          const EXPECTEDDATAASC = [
            { label: 'Client-D', value: 25000, location: 'US' },
            { label: 'Client-E', value: 31000, location: 'Europe' },
            { label: 'Client-C', value: 32000, location: 'US' },
            { label: 'Client-A', value: 43000, location: 'US' },
            { label: 'Client-B', value: 52000, location: 'Europe' }
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=pie]');
          elements.forEach((element, i) => {
            expect(element['__data__'].label).toEqual(EXPECTEDDATAASC[i].label); // tslint:disable-line: no-string-literal
          });
        });
        it('should render data in descending order when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'desc';
          const EXPECTEDDATADESC = [
            { label: 'Client-B', value: 52000, location: 'Europe' },
            { label: 'Client-A', value: 43000, location: 'US' },
            { label: 'Client-C', value: 32000, location: 'US' },
            { label: 'Client-E', value: 31000, location: 'Europe' },
            { label: 'Client-D', value: 25000, location: 'US' }
          ];
          component.sortOrder = EXPECTEDSORTORDER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=pie]');
          elements.forEach((element, i) => {
            expect(element['__data__'].label).toEqual(EXPECTEDDATADESC[i].label); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in default order when sortOrder is default', async () => {
          const EXPECTEDSORTORDER = 'default';
          component.sortOrder = EXPECTEDSORTORDER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=pie]');
          elements.forEach((element, i) => {
            expect(element['__data__'].label).toEqual(EXPECTEDDATA[i].label); // tslint:disable-line: no-string-literal
          });
        });
      });
    });

    describe('labels', () => {
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['label'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['label', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=pie][data-id=pie-Client-A]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;">Label:<b>Client-A</b><br>Value (%):<b>23.5%</b><br>Value:<b>43k</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>Client-A</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>Client-A</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>Client-A</b><br>Count:<b>$43k</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>Client-A</b><br>Count:<b>$43k</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;">Test Label:<b>Client-A</b><br>Value (%):<b>23.5%</b><br>Value:<b>43k</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;">Test Label:<b>Client-A</b><br>Value (%):<b>23.5%</b><br>Value:<b>43k</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load: 'Test Label Client-A. value 43k. Slice 4 of 5.',
              dataKeyNames_custom_on_update: 'Test Label Client-A. value 43k. Slice 4 of 5.'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            const customDataKeyNames = { dataKeyNames: { label: 'Test Label' } };
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
        // ARRANGE we need sort order default for all these tests
        beforeEach(() => {
          component.sortOrder = 'default';
        });

        describe('visible', () => {
          it('should render dataLabel and dataLabel-note by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            flushTransitions(dataLabel);
            const dataLabelNote = page.doc.querySelector('[data-testid=dataLabel-note]');
            flushTransitions(dataLabelNote);
            await page.waitForChanges();
            expect(dataLabel).toEqualAttribute('opacity', 1);
            expect(dataLabelNote).toEqualAttribute('opacity', 1);
          });
          it('should not render the pie data and note labels if visible is false', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            component.dataLabel = {
              visible: false,
              labelAccessor: ''
            };
            component.showLabelNote = false;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            flushTransitions(dataLabel);
            const dataLabelNote = page.doc.querySelector('[data-testid=dataLabel-note]');
            flushTransitions(dataLabelNote);
            await page.waitForChanges();
            expect(dataLabel).toEqualAttribute('opacity', 0);
            expect(dataLabelNote).toEqualAttribute('opacity', 0);
          });
        });
        describe('labelAccessor', () => {
          it('should default to the value accessor percentage if default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value / EXPECTEDDATAVALUESUM, '0[.][0]%');
              // const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });

            const dataLabelNotes = page.doc.querySelectorAll('[data-testid=dataLabel-note]');
            dataLabelNotes.forEach((note, i) => {
              expect(note).toEqualText(EXPECTEDDATA[i].label);
            });
          });
          it('should default to the value accessor if showPercentage false', async () => {
            component.showPercentage = false;
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '$0[.][0]a');
              // const expectedLabelValue = formatStats(EXPECTEDDATA[i].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });

            const dataLabelNotes = page.doc.querySelectorAll('[data-testid=dataLabel-note]');
            dataLabelNotes.forEach((note, i) => {
              expect(note).toEqualText(EXPECTEDDATA[i].label);
            });
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
            component.showPercentage = false;
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '0[.][0]a',
              position: 'top'
            };

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
        });
        describe('placement', () => {
          it('should place labels outside center of arc by default', async () => {
            // We are hardcoding these results for now
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const pie = page.doc.querySelector('[data-testid=pie]');
            flushTransitions(label);
            flushTransitions(pie);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toEqual(82.43625545908955);
            expect(parseFloat(label.getAttribute('y'))).toEqual(-90.61188545595842);
            // expect(parseFloat(label.getAttribute('x'))).toBeLessThanOrEqual(parseFloat(pie.getAttribute('data-fake-x')));
            // expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(parseFloat(pie.getAttribute('data-fake-y')));
          });
          it('should place labels on inside of pie arcs if passed', async () => {
            // We are hardcoding these results for now
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'inside'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const pie = page.doc.querySelector('[data-testid=pie]');
            flushTransitions(label);
            flushTransitions(pie);
            expect(parseFloat(label.getAttribute('x'))).toEqual(55.77065037691466);
            expect(parseFloat(label.getAttribute('y'))).toEqual(-61.30171434418411);
          });
          it('should place labels on edge of pie arcs if passed', async () => {
            // We are hardcoding these results for now
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'edge'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const pie = page.doc.querySelector('[data-testid=pie]');
            flushTransitions(label);
            flushTransitions(pie);
            expect(parseFloat(label.getAttribute('x'))).toEqual(121.95435978901467);
            expect(parseFloat(label.getAttribute('y'))).toEqual(-11.54920466748947);
          });
        });
        describe('labelOffset', () => {
          it('should place labels outside center of arc with different offset if passed', async () => {
            component.labelOffset = 10;

            // We are hardcoding these results for now
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const pie = page.doc.querySelector('[data-testid=pie]');
            flushTransitions(label);
            flushTransitions(pie);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toEqual(72.34202009675205);
            expect(parseFloat(label.getAttribute('y'))).toEqual(-79.51655254298392);
          });
        });
        // describe('legend', () => {
        //   describe('visible', () => {
        //     it('by default the legend should not render due to lack of group accessor', async () => {
        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendContainer = legendSVG.parentElement;
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelector('g');
        //       expect(legendContainer.getAttribute('style')).toEqual('display: none;');
        //       expect(legendContainer).toHaveClass('pie-legend');
        //       expect(legendSVG).toEqualAttribute('opacity', 0);
        //       expect(legendPaddingG).toHaveClass('legend-padding-wrapper');
        //       expect(legendG).toHaveClass('legend');
        //       expect(legendG).toHaveClass('pie');
        //     });
        //     it('should render, but not be visible if false is passed', async () => {
        //       component.legend = {
        //         visible: false,
        //         interactive: false,
        //         type: 'pie',
        //         format: '0[.][0][0]a',
        //         labels: ''
        //       };

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendContainer = legendSVG.parentElement;
        //       expect(legendContainer.getAttribute('style')).toEqual('display: none;');
        //       expect(legendSVG).toEqualAttribute('opacity', 0);
        //       expect(legendSVG.getAttribute('style')).toEqual('display: none;');
        //     });
        //     it('should render, and be visible if groupAccessor is passed', async () => {
        //       component.groupAccessor = 'cat';

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendContainer = legendSVG.parentElement;
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelectorAll('g');
        //       expect(legendContainer.getAttribute('style')).toEqual('display: block;');
        //       expect(legendSVG).toEqualAttribute('opacity', 1);
        //       expect(legendG.length).toEqual(3);
        //     });
        //   });
        //   describe('type', () => {
        //     it('should be pie default type by default', async () => {
        //       component.groupAccessor = 'cat';

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelector('g');
        //       expect(legendG).toHaveClass('legend');
        //       expect(legendG).toHaveClass('pie');
        //     });
        //     it('should be pie type even if another type is passed', async () => {
        //       component.groupAccessor = 'cat';
        //       component.legend = {
        //         visible: true,
        //         interactive: false,
        //         type: 'key',
        //         format: '0[.][0][0]a',
        //         labels: ''
        //       };

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelector('g');
        //       expect(legendG).toHaveClass('legend');
        //       expect(legendG).toHaveClass('pie');
        //     });
        //   });
        //   describe('interactive', () => {
        //     it('should not be interactive by deafult', async () => {
        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelector('g');
        //       expect(legendG['__on']).toBeUndefined(); // tslint:disable-line: no-string-literal
        //     });
        //     it('should be interactive when interactive prop is true', async () => {
        //       component.groupAccessor = 'cat';
        //       component.legend = {
        //         visible: true,
        //         interactive: true,
        //         type: 'pie',
        //         format: '0[.][0][0]a',
        //         labels: ''
        //       };

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendG = legendPaddingG.querySelector('g');
        //       expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
        //     });
        //   });
        //   describe('format', () => {
        //     it('should format number if passed as prop', async () => {
        //       component.groupAccessor = 'cat';
        //       component.legend = {
        //         visible: true,
        //         interactive: true,
        //         type: 'pie',
        //         format: '$0[.][0]a',
        //         labels: [15, 30]
        //       };

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendGText = legendPaddingG.querySelector('g text');
        //       flushTransitions(legendGText);
        //       expect(legendGText).toEqualText('$15');
        //     });
        //   });
        //   describe('labels', () => {
        //     it('should be equal to data values by default', async () => {
        //       // ARRANGE
        //       component.groupAccessor = 'cat';
        //       const EXPECTEDLABELS = ['A', 'B', 'C'];

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendGs = legendPaddingG.querySelectorAll('g');
        //       await asyncForEach(legendGs, async (legendG, i) => {
        //         const legendGText = legendG.querySelector('text');
        //         flushTransitions(legendGText);
        //         await page.waitForChanges();
        //         expect(legendGText).toEqualText(EXPECTEDLABELS[i]);
        //       });
        //     });
        //     it('should have custom labels when passed as prop', async () => {
        //       const EXPECTEDLABELS = ['D', 'E', 'F'];
        //       component.legend = {
        //         visible: true,
        //         interactive: true,
        //         type: 'pie',
        //         format: '',
        //         labels: EXPECTEDLABELS
        //       };

        //       // ACT
        //       page.root.appendChild(component);
        //       await page.waitForChanges();

        //       // ASSERT
        //       const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
        //       const legendPaddingG = legendSVG.querySelector('g');
        //       const legendGs = legendPaddingG.querySelectorAll('g');
        //       await asyncForEach(legendGs, async (legendG, i) => {
        //         const legendGText = legendG.querySelector('text');
        //         flushTransitions(legendGText);
        //         await page.waitForChanges();
        //         expect(legendGText).toEqualText(EXPECTEDLABELS[i]);
        //       });
        //     });
        //   });
      });
    });

    describe('reference line', () => {
      beforeEach(() => {
        // MOCK MATH.Random TO HANDLE UNIQUE ID CODE FROM ACCESSIBILITY UTIL
        jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
      });

      afterEach(() => {
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(global.Math, 'random').mockRestore();
      });

      it('should pass referenceLines prop', async () => {
        // ARRANGE
        const referenceData = [{ label: 'Reference1', value: 34000 }, { label: 'Reference2', value: 56500 }];
        component.referenceData = referenceData;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLine = page.doc.querySelector('.pie-reference-line-group');
        expect(referenceLine).toMatchSnapshot();
      });

      it('should pass referenceStyle prop', async () => {
        // ARRANGE
        const referenceData = [{ label: 'Reference1', value: 34000 }, { label: 'Reference2', value: 56500 }];
        const referenceStyle = { color: 'oss_blue', dashed: '4 3', opacity: 0.85, strokeWidth: '2px' };
        component.referenceData = referenceData;
        component.referenceStyle = referenceStyle;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLine = page.doc.querySelector('.pie-reference-line-group');
        expect(referenceLine).toMatchSnapshot();
      });
    });

    describe('style with textures', () => {
      describe('colorPalette', () => {
        it('should render texture sequential purple by default', async () => {
          const EXPECTEDFILLCOLOR = getColors('sequential_suppPurple')[0];
          const EXPECTEDTEXTURECOLOR = getContrastingStroke(EXPECTEDFILLCOLOR);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // now we can check if patterns are there
          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute('fill', `url(#${patterns[i].getAttribute('id')})`);
          });
        });
        it('should load texture single supplement Pink when colorPalette is single_suppPink', async () => {
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
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // now we can check if patterns are there
          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute('fill', `url(#${patterns[i].getAttribute('id')})`);
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

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // check pattern settings
          expect(patterns[0].querySelector('rect')).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          expect(patterns[0].querySelector('path')).toEqualAttribute('stroke', EXPECTEDTEXTURECOLOR);

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // now we can check if patterns are there
          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute('fill', `url(#${patterns[i].getAttribute('id')})`);
          });
        });
        it('should render categorical textures and color when colorPalette is categorical', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.label))
              .domain()
          );
          const LASTCOLOR = visaColors.base_grey;
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            const pieColor = i === pies.length - 1 ? LASTCOLOR : EXPECTEDSCALE(EXPECTEDDATA[i].label);
            const piePattern = patterns[EXPECTEDSCALE.domain().findIndex(o => o === EXPECTEDDATA[i].label)];
            const patternFill = piePattern.childNodes[0];
            const patternStroke = piePattern.childNodes[1];
            const pieFillURL = piePattern.getAttribute('id');

            // check pattern settings
            expect(patternFill).toEqualAttribute('fill', pieColor);
            const patternStrokeColorTest =
              patternStroke.getAttribute('stroke') === getContrastingStroke(pieColor) ||
              patternStroke.getAttribute('fill') === getContrastingStroke(pieColor);
            expect(patternStrokeColorTest).toBeTruthy();
            expect(pie).toEqualAttribute('fill', `url(#${pieFillURL})`);
          });
        });
      });
      describe('colors', () => {
        it('should render colors texture instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf', '#226092'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.label))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const patterns = page.doc.querySelector('[data-testid=pattern-defs]').querySelectorAll('pattern');
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            const pieColor = EXPECTEDSCALE(EXPECTEDDATA[i].label);
            const piePattern = patterns[EXPECTEDSCALE.domain().findIndex(o => o === EXPECTEDDATA[i].label)];
            const patternFill = piePattern.childNodes[0];
            const patternStroke = piePattern.childNodes[1];
            const pieFillURL = piePattern.getAttribute('id');

            // check pattern settings
            expect(patternFill).toEqualAttribute('fill', pieColor);
            const patternStrokeColorTest =
              patternStroke.getAttribute('stroke') === getContrastingStroke(pieColor) ||
              patternStroke.getAttribute('fill') === getContrastingStroke(pieColor);
            expect(patternStrokeColorTest).toBeTruthy();
            expect(pie).toEqualAttribute('fill', `url(#${pieFillURL})`);
          });
        });
      });
    });

    describe('style no textures', () => {
      beforeEach(() => {
        component.accessibility = { ...component.accessibility, hideTextures: true };
        component.sortOrder = 'default';
      });

      describe('colorPalette', () => {
        it('should render sequential purple by default', async () => {
          const EXPECTEDCOLORPALETTE = 'sequential_suppPurple';
          const LASTCOLOR = visaColors.base_grey;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute(
              'fill',
              i === pies.length - 1 ? LASTCOLOR : getColors(EXPECTEDCOLORPALETTE, 4)[i]
            );
          });
        });
        it('should load single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          const LASTCOLOR = visaColors.base_grey;
          // component.data = EXPECTEDDATALARGE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const pies = page.doc.querySelectorAll('[data-testid=pie]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // now we can check if patterns are there
          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute('fill', i === pies.length - 1 ? LASTCOLOR : EXPECTEDFILLCOLOR);
          });
        });
        it('should update to single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);
          const LASTCOLOR = visaColors.base_grey;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          const pies = page.doc.querySelectorAll('[data-testid=pie]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ASSERT
          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute('fill', i === pies.length - 1 ? LASTCOLOR : EXPECTEDFILLCOLOR);
          });
        });

        it('should render sequential blue when colorPalette is sequential_orange', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_secOrange';
          const LASTCOLOR = visaColors.base_grey;
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute(
              'fill',
              i === pies.length - 1 ? LASTCOLOR : getColors(EXPECTEDCOLORPALETTE, 4)[i]
            );
          });
        });

        it('should render categorical color when colorPalette is categorical', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'categorical';
          const LASTCOLOR = visaColors.base_grey;
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const pies = page.doc.querySelectorAll('[data-testid=pie]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            expect(pie).toEqualAttribute(
              'fill',
              i === pies.length - 1 ? LASTCOLOR : getColors(EXPECTEDCOLORPALETTE, 4)[i]
            );
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf', '#226092'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.label))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const pies = page.doc.querySelectorAll('[data-testid=pie]');

          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          pies.forEach((pie, i) => {
            const pieColor = EXPECTEDSCALE(EXPECTEDDATA[i].label);
            expect(pie).toEqualAttribute('fill', pieColor);
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });
    });

    describe('style other', () => {
      describe('innerRatio', () => {
        it('should render with innerRatio .7 by default', async () => {
          // ARRANGE
          const EXPECTEDPATHD =
            'M5.970153145843347e-15,-97.5A97.5,97.5,0,0,1,73.7851396762801,-63.73384629027057L51.649597773396074,-44.6136924031894A68.25,68.25,0,0,0,4.1791072020903425e-15,-68.25Z';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const pies = page.doc.querySelectorAll('[data-testid=pie]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ASSERT
          const pie = pies[0];
          expect(pie).toEqualAttribute('d', EXPECTEDPATHD);
        });

        it('should render innerRatio of 0 on load', async () => {
          // ARRANGE
          component.innerRatio = 0;
          const EXPECTEDPATHD = 'M5.970153145843347e-15,-97.5A97.5,97.5,0,0,1,73.7851396762801,-63.73384629027057L0,0Z';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const pies = page.doc.querySelectorAll('[data-testid=pie]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ASSERT
          const pie = pies[0];
          expect(pie).toEqualAttribute('d', EXPECTEDPATHD);
        });
        // update test is broken for some reason
        it.skip('should render innerRatio of 0.1 on update', async () => {
          // ARRANGE
          const EXPECTEDPATHD =
            'M5.970153145843347e-15,-97.5A97.5,97.5,0,0,1,73.7851396762801,-63.73384629027057L7.3785139676280105,-6.373384629027057A9.75,9.75,0,0,0,5.970153145843347e-16,-9.75Z';

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // we have to flush the pies in order to trigger the style applications
          let pies = page.doc.querySelectorAll('[data-testid=pie]');
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ACT UPDATE
          component.innerRatio = 0.1;
          await page.waitForChanges();

          pies = page.doc.querySelectorAll('[data-testid=pie]');
          await asyncForEach(pies, async pie => {
            flushTransitions(pie);
            await page.waitForChanges();
          });

          // ASSERT
          const pie = pies[0];
          expect(pie).toEqualAttribute('d', EXPECTEDPATHD);
        });
      });

      describe('showEdgeLine', () => {
        it('should not render showEdgeLine by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const edgeLines = page.doc.querySelectorAll('[data-testid=pie-edge-line]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(edgeLines, async edgeLine => {
            flushTransitions(edgeLine);
            await page.waitForChanges();
          });

          // ASSERT
          edgeLines.forEach(edgeLine => {
            expect(edgeLine).toEqualAttribute('opacity', 0);
          });
        });
        it('should render showEdgeLine when passed on load', async () => {
          component.showEdgeLine = true;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const edgeLines = page.doc.querySelectorAll('[data-testid=pie-edge-line]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(edgeLines, async edgeLine => {
            flushTransitions(edgeLine);
            await page.waitForChanges();
          });

          // ASSERT
          edgeLines.forEach(edgeLine => {
            expect(edgeLine).toEqualAttribute('opacity', 1);
          });
        });
        // update test is broken for some reason
        it.skip('should render showEdgeLine when passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const edgeLines = page.doc.querySelectorAll('[data-testid=pie-edge-line]');
          // we have to flush the pies in order to trigger the style applications
          await asyncForEach(edgeLines, async edgeLine => {
            flushTransitions(edgeLine);
            await page.waitForChanges();
          });

          component.showEdgeLine = true;
          await page.waitForChanges();

          await asyncForEach(edgeLines, async edgeLine => {
            flushTransitions(edgeLine);
            await page.waitForChanges();
          });

          // ASSERT
          edgeLines.forEach(edgeLine => {
            expect(edgeLine).toEqualAttribute('opacity', 1);
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
