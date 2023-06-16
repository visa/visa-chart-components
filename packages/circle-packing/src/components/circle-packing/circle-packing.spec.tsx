/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CirclePacking } from './circle-packing';
import { CirclePackingDefaultValues } from './circle-packing-default-values';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '@visa/visa-charts-data-table/src/components/data-table/data-table';

// importing custom languages and locales
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, outlineColor, visaColors, getContrastingStroke } = Utils;
const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestGeneric,
  unitTestEvent,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

// shows how to use asyncForEach if needed
// add asyncForEach to import UtilsDev above
// await asyncForEach(marks, async (mark, i) => {
//   flushTransitions(mark);
//   await page.waitForChanges();
//   expect(mark).toEqualAttribute('height', EXPECTEDSCALE.bandwidth());
// });

describe('<circle-packing>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new CirclePacking()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { id: 2, Type: 'Mexico', Country: 'World', value: 73 },
      { id: 1, Type: 'World', Country: '', value: 10 },
      { id: 3, Type: 'United States', Country: 'World', value: 15 },
      { id: 4, Type: 'Canada', Country: 'World', value: 4 },
      { id: 5, Type: 'A', Country: 'Mexico', value: 64 },
      { id: 6, Type: 'B', Country: 'Mexico', value: 35 },
      { id: 7, Type: 'C', Country: 'United States', value: 23 },
      { id: 8, Type: 'D', Country: 'Canada', value: 16 },
      { id: 9, Type: 'E', Country: 'Mexico', value: 25 },
      { id: 10, Type: 'F', Country: 'United States', value: 23 },
      { id: 11, Type: 'G', Country: 'United States', value: 6 },
      { id: 12, Type: 'H', Country: 'Canada', value: 36 },
      { id: 13, Type: 'I', Country: 'United States', value: 10 },
      { id: 14, Type: 'babyI1', Country: 'I', value: 5 },
      { id: 15, Type: 'babyI2', Country: 'I', value: 5 }
    ];
    const EXPECTEDNODEACCESSOR = 'Type';
    const EXPECTEDPARENTACCESSOR = 'Country';
    const EXPECTEDSIZEACCESSOR = 'value';
    const EXPECTEDUNIQUEID = 'circle-packing-test';
    // const MINVALUE = 4;
    // const MAXVALUE = 73;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { disableValidation: true };
    const EXPECTEDLOCALIZATION = { ...CirclePackingDefaultValues.localization, skipValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [CirclePacking, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('circle-packing');
      component.data = EXPECTEDDATA;
      component.uniqueID = EXPECTEDUNIQUEID;
      component.nodeAccessor = EXPECTEDNODEACCESSOR;
      component.parentAccessor = EXPECTEDPARENTACCESSOR;
      component.sizeAccessor = EXPECTEDSIZEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.localization = EXPECTEDLOCALIZATION;
      // component.unitTest = true;

      // for circle pack specifically we need
      jest.useFakeTimers('legacy');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should build', () => {
      expect(new CirclePacking()).toBeTruthy();
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

      it('should render with minimal props[data,accessor(s)] given', async () => {
        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

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

    // @test-notes: had to remove theme and data, due to restructuring of data for circle pack this test doesn't work as designed
    // for data we need to do d.data.data for circle packing vs just using __data__
    // need to investigate this in the browser once we are able to connect the debugger again
    describe('generic test suite', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
      });

      afterEach(() => {
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(console, 'error').mockRestore();
      });
      Object.keys(unitTestGeneric).forEach(test => {
        const marginModifier = unitTestGeneric[test].testProps.margin
          ? unitTestGeneric[test].testDefault
            ? (600 - 8 - CirclePackingDefaultValues.margin.top * 2) / 2
            : (600 - 8 - unitTestGeneric[test].testProps.margin.top * 2) / 2
          : 0;
        if (unitTestGeneric[test].prop !== 'data') {
          // temporary if until we remove theme from testing util (part of props PR)
          const innerTestProps = unitTestGeneric[test].testDefault
            ? { [unitTestGeneric[test].prop]: CirclePackingDefaultValues[unitTestGeneric[test].prop], marginModifier }
            : unitTestGeneric[test].prop === 'data'
            ? { data: EXPECTEDDATA }
            : { ...unitTestGeneric[test].testProps, marginModifier }; // (600 height|width - 4*4 padding|margin)
          const innerTestSelector =
            unitTestGeneric[test].testSelector === 'component-name'
              ? 'circle-packing'
              : unitTestGeneric[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=circle]'
              : unitTestGeneric[test].testSelector;
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
            testSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-B]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'Type A. value 64. Country Mexico. Node 1. Number of child elements: 0.',
              nextSelectorAriaLabel: 'Type B. value 35. Country Mexico. Node 2. Number of child elements: 0.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true },
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=circle][data-id=circle-Mexico-E]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'E. 25. Mexico. Node 3. Number of child elements: 0.',
              nextSelectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=circle][data-id=circle-Mexico-B]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'Type B. value 35. Country Mexico. Node 2. Number of child elements: 0.',
              nextSelectorAriaLabel: 'Type A. value 64. Country Mexico. Node 1. Number of child elements: 0.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true },
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-E]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              nextSelectorAriaLabel: 'E. 25. Mexico. Node 3. Number of child elements: 0.',
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_up_arrow_parent: {
            name: 'keyboard nav: drill - up arrow goes to parent',
            testSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            nextTestSelector: '[data-testid=circle][data-id=circle-World-Mexico]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              nextSelectorAriaLabel: 'Mexico. 73. World. Node 1. Number of child elements: 3.',
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_down_arrow_child: {
            name: 'keyboard nav: drill - down arrow goes to child',
            testSelector: '[data-testid=circle][data-id=circle-World-Mexico]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'Mexico. 73. World. Node 1. Number of child elements: 3.',
              nextSelectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_shift_enter_to_parent: {
            name: 'keyboard nav: drill - shift+enter will move up to parent',
            testSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            nextTestSelector: '[data-testid=circle][data-id=circle-World-Mexico]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              selectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              nextSelectorAriaLabel: 'Mexico. 73. World. Node 1. Number of child elements: 3.',
              focusIndicatorNotGrouped: true
            }
          },
          accessibility_keyboard_nav_enter_to_child: {
            name: 'keyboard nav: drill - enter will move into to children',
            testSelector: '[data-testid=circle][data-id=circle-World-Mexico]',
            nextTestSelector: '[data-testid=circle][data-id=circle-Mexico-A]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 },
            testProps: {
              selectorAriaLabel: 'Mexico. 73. World. Node 1. Number of child elements: 3.',
              nextSelectorAriaLabel: 'A. 64. Mexico. Node 1. Number of child elements: 0.',
              focusIndicatorNotGrouped: true
            }
          }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: CirclePackingDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            expectedData: { id: 5, Type: 'A', Country: 'Mexico', value: 64 },
            geometryType: 'Circle',
            geometryPlacementAttributes: ['data-r', 'data-cx', 'data-cy'],
            geometryAdjustmentValues: [
              { f: 'data-r', b: 7, w: 3, s: -1 },
              { f: 'data-cx', b: 7, w: 3, s: -1 },
              { f: 'data-cy', b: 7 * 2, w: 3 * 2, s: 1 }
            ],
            // groupOverrideSelector: '#circle-in-pack-Mexico-circle-pack-unit-test-chart',
            annotations:
              unitTestAccessibility[test].prop === 'annotations'
                ? [
                    {
                      note: {
                        label: 'items',
                        bgPadding: 0,
                        title: 'Test Annotation',
                        align: 'left',
                        wrap: 130
                      },
                      accessibilityDescription: 'This is a test description for accessibility.',
                      x: 100,
                      y: 100,
                      className: 'circle-pack-annotation',
                      type: 'annotationCalloutCircle',
                      subject: { radius: 18 }
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
              ? 'circle-packing'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=circle]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=circle-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=circle][data-id=circle-Mexico-A]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=circle][data-id=circle-Mexico-B]'
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
            test === 'accessibility_textures_on_by_default' ||
            test === 'accessibility_categorical_textures_created_by_default' ||
            test === 'accessibility_focus_marker_style' ||
            test === 'accessibility_focus_group_style' ||
            test === 'accessibility_xaxis_description_set_on_load' ||
            test === 'accessibility_xaxis_description_off_on_load' ||
            test === 'accessibility_xaxis_description_added_on_update' ||
            test === 'accessibility_yaxis_description_set_on_load' ||
            test === 'accessibility_yaxis_description_off_on_load' ||
            test === 'accessibility_yaxis_description_added_on_update'
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

    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      it('should pass annotation prop', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              label: 'Social Media Intern returned to college',
              bgPadding: 20,
              title: 'Staff Change',
              align: 'middle',
              wrap: 130
            },
            accessibilityDescription:
              'This is an annotation that explains a drop in tweet ACTivity due to staff change.',
            y: 200,
            x: 200,
            dy: 50,
            type: 'annotationCallout',
            connector: { end: 'dot', endScale: 10 },
            color: 'pri_blue'
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

    // current these tests are failing due to attrTween / jsdom error where (_, i, n) is undefined
    // in the attrTween callback function
    describe('interaction', () => {
      // for now we are only testing interaction on circle pack without textures applied
      describe('circle pack based interaction tests', () => {
        const innerTestProps = {
          transitionEndAllSelector: '[data-testid=circle]',
          runJestTimers: true,
          accessibility: { disableValidation: true, hideTextures: true },
          useFilter: false
        };
        const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
        const innerNegTestSelector = '[data-testid=circle][data-id=circle-World-Canada]';
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
        const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
        const innerNegTestSelector = '[data-testid=circle][data-id=circle--World]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.comp_green,
          stroke: outlineColor(visaColors.comp_green),
          strokeWidth: '1px'
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['Country'],
          transitionEndAllSelector: '[data-testid=circle]',
          runJestTimers: true,
          accessibility: { disableValidation: true, hideTextures: true },
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
          interactionKeys: ['Type', 'Country'],
          transitionEndAllSelector: '[data-testid=circle]',
          runJestTimers: true,
          accessibility: { disableValidation: true, hideTextures: true },
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=circle][data-id=circle-World-Mexico]',
            '[data-testid=circle][data-id=circle-World-Canada]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=circle][data-id=circle-World-Mexico]',
            '[data-testid=circle][data-id=circle-World-Canada]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
        const innerNegTestSelector = '[data-testid=circle][data-id=circle--World]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.comp_green,
          stroke: outlineColor(visaColors.comp_green),
          strokeWidth: '1px'
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['Country'],
          accessibility: { disableValidation: true, hideTextures: true },
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
          interactionKeys: ['Type', 'Country'],
          accessibility: { disableValidation: true, hideTextures: true },
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=circle][data-id=circle-World-Mexico]',
            '[data-testid=circle][data-id=circle-World-Canada]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=circle][data-id=circle-World-Mexico]',
            '[data-testid=circle][data-id=circle-World-Canada]'
          ));
      });
    });

    // current these tests are failing due to attrTween / jsdom error where (_, i, n) is undefined
    // in the attrTween callback function
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
        describe('mark based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              nestedDataLocation: true,
              transitionEndAllSelector: '[data-testid=circle]'
            };
            const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
            // we have to handle clickEvent separately due to this.zooming boolean in circle-packing load
            if (test !== 'event_clickEvent_emit') {
              it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
                unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
            }
          });
        });
        describe('customized mark based event testing', () => {
          const testSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
          const allSelector = '[data-testid=circle]';
          it('[interaction] clickEvent: customized for circle-pack event object should emit and contain first data record when first mark is clicked', async () => {
            // ARRANGE
            const _callback = jest.fn();
            page.root.appendChild(component);
            page.doc.addEventListener('clickEvent', _callback);
            await page.waitForChanges();

            // ACT - Flush Initial Transition
            const markers = page.root.querySelectorAll(allSelector);
            markers.forEach(marker => {
              flushTransitions(marker);
            });

            // ACT - Now Check Event
            const markerToClick = page.root.querySelector(testSelector);
            const clickFunction = markerToClick['__on'].find(obj => obj.type === 'click'); // tslint:disable-line: no-string-literal
            const markerData = markerToClick['__data__'].data.data; // tslint:disable-line: no-string-literal
            clickFunction.value(markerData, 0, [markerToClick]);
            await page.waitForChanges();

            // ASSERT
            expect(_callback).toHaveBeenCalled();
            expect(_callback.mock.calls[0][0].detail.target).toMatchSnapshot();
            expect(_callback.mock.calls[0][0].detail.data).toMatchObject(EXPECTEDDATA[0]);
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

      describe('data - generic data tests must be modified for circle-pack', () => {
        const testSelector = '[data-testid=circle]';
        it('data: custom data on load', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          elements.forEach(element => {
            const matchData = EXPECTEDDATA.find(d => d.id === element['__data__'].data.data.id);
            expect(element['__data__'].data.data).toEqual(matchData); // tslint:disable-line: no-string-literal
          });
        });
        it('data: custom data enter on update', async () => {
          // ARRANGE
          const BEGINNINGDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1], EXPECTEDDATA[2], EXPECTEDDATA[3]];
          component.data = BEGINNINGDATA;

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.data = EXPECTEDDATA;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          elements.forEach(element => {
            const matchData = EXPECTEDDATA.find(d => d.id === element['__data__'].data.data.id);
            expect(element['__data__'].data.data).toEqual(matchData); // tslint:disable-line: no-string-literal
          });
        });
        it('data: custom data exit on update', async () => {
          const EXITDATA = [EXPECTEDDATA[1], EXPECTEDDATA[0], EXPECTEDDATA[2], EXPECTEDDATA[3]];

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.data = EXITDATA;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          elements.forEach((element, i) => {
            if (i + 1 <= EXITDATA.length) {
              const matchData = EXPECTEDDATA.find(d => d.id === element['__data__'].data.data.id);
              expect(element['__data__'].data.data).toEqual(matchData); // tslint:disable-line: no-string-literal
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

      describe('dataDepth', () => {
        const testSelector = '[data-testid=circle]';
        it('should render 13 nodes with dataDepth 5 (default)', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(13);
        });
        it('should render 4 nodes with dataDepth 1 on load', async () => {
          // ARRANGE
          component.dataDepth = 1;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(4);
        });
        it('should render 13 nodes with dataDepth 3 and displayDepth 2 (default) on update', async () => {
          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.dataDepth = 3;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(13);
        });
        it('should render 15 nodes with dataDepth 3 and displayDepth 3 on update', async () => {
          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.dataDepth = 3;
          component.displayDepth = 3;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(15);
        });
      });

      describe('displayDepth', () => {
        const testSelector = '[data-testid=circle]';
        it('should render 13 nodes with displayDepth 2 (default)', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(13);
        });
        it('should render 4 nodes with displayDepth 1 on load', async () => {
          // ARRANGE
          component.displayDepth = 1;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(4);
        });
        it('should render 15 nodes with displayDepth 3 on update', async () => {
          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.displayDepth = 3;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll(testSelector);
          expect(elements.length).toEqual(15);
        });
      });
    });

    describe('labels', () => {
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
          it('should default to the node accessor if default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = EXPECTEDDATA.find(d => d.id === label['__data__'].data.data.id);
              expect(label).toEqualText(expectedLabelValue.Type);
            });
          });
          it('should render labelAcccessor if provided load', async () => {
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'Country',
              format: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = EXPECTEDDATA.find(d => d.id === label['__data__'].data.data.id);
              expect(label).toEqualText(expectedLabelValue.Country);
            });
          });
          it('should render labelAcccessor if provided update', async () => {
            // ACT LOAD
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'Country',
              format: ''
            };
            await page.waitForChanges();

            // ASSERT
            const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
            dataLabels.forEach((label, i) => {
              const expectedLabelValue = EXPECTEDDATA.find(d => d.id === label['__data__'].data.data.id);
              expect(label).toEqualText(expectedLabelValue.Country);
            });
          });
        });
      });

      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['Type'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['Type', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b>Mexico</b><br>Country:<b>World</b><br>Value:<b>73</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>Mexico</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>Mexico</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>Mexico</b><br>Count:<b>$73</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>Mexico</b><br>Count:<b>$73</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;"><b>Mexico</b><br>Test Country:<b>World</b><br>Value:<b>73</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;"><b>Mexico</b><br>Test Country:<b>World</b><br>Value:<b>73</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load:
                'Test Destination Mexico. value 73. Test Country World. Node 1. Number of child elements: 3.',
              dataKeyNames_custom_on_update:
                'Test Destination Mexico. value 73. Test Country World. Node 1. Number of child elements: 3.'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            const customDataKeyNames = { dataKeyNames: { Country: 'Test Country', Type: 'Test Destination' } };
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
    });

    describe('style', () => {
      const circleMarkers = [
        '[data-testid=circle][data-id=circle--World]',
        '[data-testid=circle][data-id=circle-World-Mexico]',
        '[data-testid=circle][data-id=circle-Mexico-A]'
      ];
      describe('colorPalette', () => {
        it('should render sequential grey by default', async () => {
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };
          const EXPECTEDFILLCOLORS = getColors('sequential_grey', 4);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
        it('should render sequential pink on load', async () => {
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };
          component.colorPalette = 'sequential_suppPink';
          const EXPECTEDFILLCOLORS = getColors('sequential_suppPink', 4);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
        it('should render sequential pink on update', async () => {
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };
          const EXPECTEDFILLCOLORS = getColors('sequential_suppPink', 4);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = 'sequential_suppPink';
          await page.waitForChanges();

          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
        it('should render categorical on update', async () => {
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };
          const EXPECTEDFILLCOLORS = getColors('categorical', 4);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = 'categorical';
          await page.waitForChanges();

          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed on load', async () => {
          const EXPECTEDFILLCOLORS = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };
          component.colors = EXPECTEDFILLCOLORS;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
        it('should render colors instead of palette when passed on update', async () => {
          const EXPECTEDFILLCOLORS = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          // we are not testing textures here
          component.accessibility = { ...component.accessibility, hideTextures: true };

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colors = EXPECTEDFILLCOLORS;
          await page.waitForChanges();

          // ASSERT
          // ASSERT
          circleMarkers.forEach((selector, i) => {
            const circle = page.doc.querySelector(selector);
            expect(circle).toEqualAttribute('fill', EXPECTEDFILLCOLORS[i]);
            expect(circle).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[i]));
          });
        });
      });
      // these tests are broken by the use of attrTween on jsdom, need to investigate further
      describe('circlePadding', () => {
        it('circlePadding should be 5 by default', async () => {
          const EXPECTEDRADIUS = 99.35968555800704;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=circle][data-id=circle-World-Mexico]');
          const markerTransitionKeys = Object.keys(marker['__transition']);
          let markerValueR;
          markerTransitionKeys.forEach(ky => {
            if (marker['__transition'][ky]['name'] === 'zoom') {
              markerValueR = marker['__transition'][ky]['value']['attr.r'];
            }
          });
          expect(markerValueR).toBeCloseTo(EXPECTEDRADIUS);

          // flushTransitions code is breaking due to attrTween
          // replaced with above for now on all circlePadding tests
          // flushTransitions(marker);
          // const markerRadius = parseFloat(marker.getAttribute('r'));
          // expect(markerRadius).toBeCloseTo(EXPECTEDRADIUS);
        });
        it('circlePadding should adjust to 2 on load', async () => {
          const EXPECTEDRADIUS = 104.21263365393689;
          component.circlePadding = 2;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=circle][data-id=circle-World-Mexico]');
          const markerTransitionKeys = Object.keys(marker['__transition']);
          let markerValueR;
          markerTransitionKeys.forEach(ky => {
            if (marker['__transition'][ky]['name'] === 'zoom') {
              markerValueR = marker['__transition'][ky]['value']['attr.r'];
            }
          });
          expect(markerValueR).toBeCloseTo(EXPECTEDRADIUS);
        });
        it('circlePadding should adjust to 10 on load', async () => {
          const EXPECTEDRADIUS = 92.57918775231961;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.circlePadding = 10;
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=circle][data-id=circle-World-Mexico]');
          const markerTransitionKeys = Object.keys(marker['__transition']);
          let markerValueR;
          markerTransitionKeys.forEach(ky => {
            if (marker['__transition'][ky]['name'] === 'zoom') {
              markerValueR = marker['__transition'][ky]['value']['attr.r'];
            }
          });
          expect(markerValueR).toBeCloseTo(EXPECTEDRADIUS);
        });
      });
      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });
      describe('clickStyle', () => {
        it('refer to generic interaction results above for clickStyle tests', () => {
          expect(true).toBeTruthy();
        });
      });
      describe('hoverStyle', () => {
        it('refer to generic interaction results above for hoverStyle tests', () => {
          expect(true).toBeTruthy();
        });
      });
      describe('hoverOpacity', () => {
        it('refer to generic interaction results above for hoverOpacity tests', () => {
          expect(true).toBeTruthy();
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
