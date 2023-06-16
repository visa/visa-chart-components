/**
 * Copyright (c) 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { AlluvialDiagram } from './alluvial-diagram';
import { AlluvialDiagramDefaultValues } from './alluvial-diagram-default-values';
import { scaleOrdinal } from 'd3-scale';
import { sum } from 'd3-array';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '@visa/visa-charts-data-table/src/components/data-table/data-table';

// importing custom languages and locales
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

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

describe('<alluvial-diagram>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new AlluvialDiagram()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDLINKDATA = [
      { group: 'Remained', cat: 'Cat12018', target: 'Cat12019', value: 3010 },
      { group: 'Decreased', cat: 'Cat12018', target: 'Cat22019', value: 2754 },
      { group: 'Decreased', cat: 'Cat12018', target: 'Cat32019', value: 2812 },
      { group: 'Increased', cat: 'Cat22018', target: 'Cat12019', value: 909 },
      { group: 'Remained', cat: 'Cat22018', target: 'Cat22019', value: 12712 },
      { group: 'Decreased', cat: 'Cat22018', target: 'Cat32019', value: 3367 },
      { group: 'Increased', cat: 'Cat32018', target: 'Cat12019', value: 68 },
      { group: 'Increased', cat: 'Cat32018', target: 'Cat22019', value: 1133 },
      { group: 'Remained', cat: 'Cat32018', target: 'Cat32019', value: 6164 },
      { group: 'New', cat: 'CatNew2018', target: 'Cat12019', value: 3148 },
      { group: 'New', cat: 'CatNew2018', target: 'Cat22019', value: 7279 },
      { group: 'New', cat: 'CatNew2018', target: 'Cat32019', value: 3684 }
    ];
    const EXPECTEDNODEDATA = [
      { did: 'Cat12018' },
      { did: 'Cat22018' },
      { did: 'Cat32018' },
      { did: 'CatNew2018' },
      { did: 'Cat12019' },
      { did: 'Cat22019' },
      { did: 'Cat32019' }
    ];
    const EXPECTEDSOURCEACCESSOR = 'cat';
    const EXPECTEDTARGETACCESSOR = 'target';
    const EXPECTEDVALUEACCESSOR = 'value';
    const EXPECTEDNODEIDACCESSOR = 'did';
    const EXPECTEDGROUPACCESSOR = 'group';
    const MINVALUE = 68;
    const MAXVALUE = 12712;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...AlluvialDiagramDefaultValues.accessibility, disableValidation: true };
    const EXPECTEDLOCALIZATION = { ...AlluvialDiagramDefaultValues.localization, skipValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [AlluvialDiagram, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('alluvial-diagram');
      component.linkData = [...EXPECTEDLINKDATA];
      component.nodeData = [...EXPECTEDNODEDATA];
      component.sourceAccessor = EXPECTEDSOURCEACCESSOR;
      component.targetAccessor = EXPECTEDTARGETACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.groupAccessor = EXPECTEDGROUPACCESSOR;
      component.nodeIDAccessor = EXPECTEDNODEIDACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.localization = EXPECTEDLOCALIZATION;
      component.uniqueID = 'alluvial-diagram-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new AlluvialDiagram()).toBeTruthy();
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

      it('should render with minimal props[data,accessors] given', async () => {
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

    // @test-notes: had to remove theme and data, due to restructuring of data for alluvial this test doesn't work as designed
    // for data we need to do d.data.data for alluvial vs just using __data__
    describe('generic test suite', () => {
      beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation();
      });

      afterEach(() => {
        jest.spyOn(console, 'error').mockRestore();
      });
      Object.keys(unitTestGeneric).forEach(test => {
        if (unitTestGeneric[test].prop !== 'data') {
          const innerTestProps = unitTestGeneric[test].testDefault
            ? { [unitTestGeneric[test].prop]: AlluvialDiagramDefaultValues[unitTestGeneric[test].prop] }
            : unitTestGeneric[test].prop === 'data'
            ? { data: EXPECTEDLINKDATA }
            : unitTestGeneric[test].testProps;
          const innerTestSelector =
            unitTestGeneric[test].testSelector === 'component-name'
              ? 'alluvial-diagram'
              : unitTestGeneric[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=link]'
              : unitTestGeneric[test].testSelector;
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        }
      });
      describe('data', () => {
        describe('uniqueId', () => {
          it('refer to generic results above for uniqueID tests', () => {
            expect(true).toBeTruthy();
          });
        });

        describe('data - generic data tests must be modified for alluvial-diagram', () => {
          const testSelector = '[data-testid=link]';
          it('data: custom data on load', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const elements = page.doc.querySelectorAll(testSelector);
            elements.forEach((element, i) => {
              expect(element['__data__'].data).toEqual(EXPECTEDLINKDATA[i]); // tslint:disable-line: no-string-literal
            });
          });
          it('data: custom data enter on update', async () => {
            // ARRANGE
            const BEGINNINGDATA = [EXPECTEDLINKDATA[0], EXPECTEDLINKDATA[1], EXPECTEDLINKDATA[2], EXPECTEDLINKDATA[3]];
            component.data = BEGINNINGDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.data = EXPECTEDLINKDATA;
            await page.waitForChanges();

            // ASSERT
            const elements = page.doc.querySelectorAll(testSelector);
            elements.forEach((element, i) => {
              expect(element['__data__'].data).toEqual(EXPECTEDLINKDATA[i]); // tslint:disable-line: no-string-literal
            });
          });
          it('data: custom data exit on update', async () => {
            const EXITDATA = [EXPECTEDLINKDATA[1], EXPECTEDLINKDATA[0], EXPECTEDLINKDATA[2], EXPECTEDLINKDATA[3]];

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
                expect(element['__data__'].data).toEqual(EXPECTEDLINKDATA[i]); // tslint:disable-line: no-string-literal
              } else {
                const lastTransitionKey = Object.keys(element['__transition'])[
                  Object.keys(element['__transition']).length - 1
                ]; // tslint:disable-line: no-string-literal
                const transitionName = element['__transition'][lastTransitionKey].name; // tslint:disable-line: no-string-literal
                expect(transitionName).toEqual('accessibilityAfterExit');
              }
            });
          });
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
          //   testSelector: '[data-testid=bar-group]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 }
          // },
          accessibility_keyboard_nav_group_shift_enter_exit: {
            name: 'keyboard nav: group - shift+enter will exit group',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            nextTestSelector: '[data-testid=node][data-id=node-Cat12018]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              linkConfig: { visible: true, fillMode: 'source', opacity: 1 },
              groupMarkerOverrideSelector: '[data-testid=node][data-id=node-Cat12018]',
              selectorAriaLabel: 'value 3k. group Remained. cat Cat12018. target Cat12019. Link 2.',
              nextSelectorAriaLabel: 'did Cat12018. node 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat12018-Cat32019]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'source', opacity: 1 },
              selectorAriaLabel: 'value 3k. group Remained. cat Cat12018. target Cat12019. Link 2.',
              nextSelectorAriaLabel: 'value 2.8k. group Decreased. cat Cat12018. target Cat32019. Link 3.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat32019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat12018-Cat22019]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'source', opacity: 1 },
              selectorAriaLabel: '2.8k. Decreased. Cat12018. Cat32019. Link 3.',
              nextSelectorAriaLabel: '2.8k. Decreased. Cat12018. Cat22019. Link 1.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat32019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'source', opacity: 1 },
              selectorAriaLabel: 'value 2.8k. group Decreased. cat Cat12018. target Cat32019. Link 3.',
              nextSelectorAriaLabel: 'value 3k. group Remained. cat Cat12018. target Cat12019. Link 2.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat22019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat12018-Cat32019]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'source', opacity: 1 },
              selectorAriaLabel: '2.8k. Decreased. Cat12018. Cat22019. Link 1.',
              nextSelectorAriaLabel: '2.8k. Decreased. Cat12018. Cat32019. Link 3.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=link][data-id=link-Cat22018-Cat22019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat12018-Cat22019]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'group', opacity: 1 },
              selectorAriaLabel: '12.7k. Remained. Cat22018. Cat22019. Link 5.',
              nextSelectorAriaLabel: '2.8k. Decreased. Cat12018. Cat22019. Link 1.'
            }
          },
          // accessibility_keyboard_nav_up_arrow_cousin_loop: {
          //   name: 'keyboard nav: cousin - up arrow loops to last',
          //   testSelector: '[data-testid=bar][data-id=bar-Jul-17]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Mar-18]',
          //   keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
          //   testProps: {
          //     groupAccessor: 'cat',
          //     selectorAriaLabel: 'Jul-17. 2.2m. B. Bar 4 of 12.',
          //     nextSelectorAriaLabel: 'Mar-18. 8.5m. B. Bar 12 of 12.'
          //   }
          // },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=link][data-id=link-Cat12018-Cat22019]',
            nextTestSelector: '[data-testid=link][data-id=link-Cat22018-Cat22019]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              linkConfig: { visible: true, fillMode: 'group', opacity: 1 },
              selectorAriaLabel: '2.8k. Decreased. Cat12018. Cat22019. Link 2.',
              nextSelectorAriaLabel: '12.7k. Remained. Cat22018. Cat22019. Link 5.'
            }
          }
          // accessibility_keyboard_nav_down_arrow_cousin_loop: {
          //   name: 'keyboard nav: cousin - down arrow loops to first',
          //   testSelector: '[data-testid=bar][data-id=bar-Mar-18]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Jul-17]',
          //   keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
          //   testProps: {
          //     groupAccessor: 'cat',
          //     selectorAriaLabel: 'month Mar-18. value 8.5m. cat B. Bar 12 of 12.',
          //     nextSelectorAriaLabel: 'month Jul-17. value 2.2m. cat B. Bar 4 of 12.',
          //     accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
          //   }
          // }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: AlluvialDiagramDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            geometryType: 'Bar',
            geometryPlacementAttributes: [], // we don't use these yet in alluvial tests
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
              ? 'alluvial-diagram'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=link]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=node]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=link][data-id=link-Cat12018-Cat12019]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=link][data-id=link-Cat12018-Cat22019]'
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
          } else if (test === 'accessibility_keyboard_selection_test') {
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
            // skipping these test for alluvial as they are not applicable or do not run correctly
          } else if (
            test === 'accessibility_focus_marker_style' ||
            test === 'accessibility_xaxis_description_set_on_load' ||
            test === 'accessibility_xaxis_description_off_on_load' ||
            test === 'accessibility_xaxis_description_added_on_update' ||
            test === 'accessibility_yaxis_description_set_on_load' ||
            test === 'accessibility_yaxis_description_off_on_load' ||
            test === 'accessibility_yaxis_description_added_on_update' ||
            test === 'accessibility_categorical_textures_created_by_default' ||
            test === 'accessibility_textures_on_by_default'
          ) {
            it.skip(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                innerTestSelector,
                innerNextTestSelector
              ));
          } else if (test === 'accessibility_textures_off_on_load' || test === 'accessibility_textures_off_on_update') {
            // for the texture off tests we have to check stroke, not fill
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                { ...innerTestProps, linkConfig: { visible: true, fillMode: 'none', opacity: 1 }, testStroke: true },
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

    describe('interaction', () => {
      // currently (v6.1.0), interaction is only built on links of alluvial diagram
      describe('link based interaction tests', () => {
        const innerTestProps = {
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
        };
        const innerTestSelector = '[data-testid=link][data-id=link-Cat12018-Cat12019]';
        const innerNegTestSelector = '[data-testid=link][data-id=link-Cat12018-Cat22019]';
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
        const innerTestSelector = '[data-testid=link][data-id=link-Cat12018-Cat12019]';
        const innerNegTestSelector = '[data-testid=link][data-id=link-Cat22018-Cat12019]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['cat'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
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
          interactionKeys: ['target'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));

        const groupInnerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['group'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            groupInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));
        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            groupInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=link][data-id=link-Cat12018-Cat12019]';
        const innerNegTestSelector = '[data-testid=link][data-id=link-Cat22018-Cat12019]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['cat'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
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
          interactionKeys: ['target'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));

        const groupInnerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['group'],
          transitionEndAllSelector: '[data-testid=link]',
          useFilter: false,
          skipStrokeTest: true,
          strokeOpacity: true
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            groupInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            groupInnerTestProps,
            '[data-testid=link][data-id=link-Cat12018-Cat12019]',
            '[data-testid=link][data-id=link-Cat12018-Cat22019]'
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
        describe('link based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              transitionEndAllSelector: '[data-testid=link]'
            };
            const innerTestSelector = '[data-testid=link]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDLINKDATA[0]));
          });
        });
      });
    });
    describe('labels', () => {
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['cat'],
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
            const innerTestSelector = '[data-testid=link][data-id=link-Cat12018-Cat12019]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b>Remained<br></b><b>Cat12018</b>to<b>Cat12019</b><br>Value:<b>3010</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>Cat12018</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>Cat12018</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>Cat12018</b><br>Count:<b>$3k</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>Cat12018</b><br>Count:<b>$3k</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;"><b>Remained<br></b><b>Cat12018</b>to<b>Cat12019</b><br>Test Value:<b>3010</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;"><b>Remained<br></b><b>Cat12018</b>to<b>Cat12019</b><br>Test Value:<b>3010</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load: 'Test Value 3k. group Remained. Test Cat Cat12018. target Cat12019. Link 1.',
              dataKeyNames_custom_on_update:
                'Test Value 3k. group Remained. Test Cat Cat12018. target Cat12019. Link 1.'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            const customDataKeyNames = { dataKeyNames: { value: 'Test Value', cat: 'Test Cat' } };
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
            dataLabels.forEach(label => {
              const matchingLinks = EXPECTEDLINKDATA.filter(
                d =>
                  d[EXPECTEDSOURCEACCESSOR] === label['__data__'].did ||
                  d[EXPECTEDTARGETACCESSOR] === label['__data__'].did
              );
              const nodeSummaryValue = sum(matchingLinks, d => d[EXPECTEDVALUEACCESSOR]);
              const expectedLabelValue = formatStats(nodeSummaryValue, '0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
        });
        describe('format', () => {
          it('should format number if passed as prop', async () => {
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
            dataLabels.forEach(label => {
              const matchingLinks = EXPECTEDLINKDATA.filter(
                d =>
                  d[EXPECTEDSOURCEACCESSOR] === label['__data__'].did ||
                  d[EXPECTEDTARGETACCESSOR] === label['__data__'].did
              );
              const nodeSummaryValue = sum(matchingLinks, d => d[EXPECTEDVALUEACCESSOR]);
              const expectedLabelValue = formatStats(nodeSummaryValue, '$0[.][0]a'); // tslint:disable-line: no-string-literal
              expect(label).toEqualText(expectedLabelValue);
            });
          });
        });
        describe('placement', () => {
          it('should place labels on inside of nodes by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const nodeRect = page.doc.querySelector('[data-testid=node]').querySelector('rect');
            expect(parseFloat(label.getAttribute('x'))).toBeGreaterThan(parseFloat(nodeRect.getAttribute('x')));
          });
          it('should place labels on outside of nodes if passed', async () => {
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'outside'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const nodeRect = page.doc.querySelector('[data-testid=node]').querySelector('rect');
            expect(parseFloat(label.getAttribute('x'))).toBeLessThanOrEqual(parseFloat(nodeRect.getAttribute('x')));
          });
        });
      });
    });
    describe('links', () => {
      describe('visible', () => {
        it('should have visible links with opacity 0.3 by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const firstNodeRect = page.doc.querySelector('[data-testid=node]').querySelector('rect');
          expect(parseFloat(firstNodeRect.getAttribute('x'))).toBeLessThan(100);
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', AlluvialDiagramDefaultValues.linkConfig.opacity);
          });
        });
        it('should not have visible links when passed on load', async () => {
          component.linkConfig = {
            fillMode: 'none',
            opacity: 0.3,
            visible: false
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // check that nodes moved
          const firstNodeRect = page.doc.querySelector('[data-testid=node]').querySelector('rect');
          expect(parseFloat(firstNodeRect.getAttribute('x'))).toBeGreaterThan(100);

          // check that links are hidden
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', 0);
          });
        });
        it('should not have visible links when passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.linkConfig = {
            fillMode: 'none',
            opacity: 0.3,
            visible: false
          };
          await page.waitForChanges();

          // ACT Flush Transitions
          const firstNodeRect = page.doc.querySelector('[data-testid=node]').querySelector('rect');
          flushTransitions(firstNodeRect);
          await page.waitForChanges();

          // ASSERT
          // check that nodes moved
          expect(parseFloat(firstNodeRect.getAttribute('x'))).toBeGreaterThan(100);

          // check that links are hidden
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', 0);
          });
        });
      });
      describe('opacity', () => {
        it('should have default opacity by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', AlluvialDiagramDefaultValues.linkConfig.opacity);
          });
        });
        it('should have opacity 1 when passed on load', async () => {
          component.linkConfig = {
            fillMode: 'none',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', 1);
          });
        });
        it('should have opacity 1 when passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.linkConfig = {
            fillMode: 'none',
            opacity: 1,
            visible: true
          };
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke-opacity', 1);
          });
        });
      });
      describe('fillMode', () => {
        it('should have fillMode of none by default', async () => {
          component.colorPalette = 'single_categorical_blue';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke', visaColors.categorical_blue);
          });
        });
        it('should have fillMode of link if passed on load', async () => {
          const expectedColors = getColors('categorical', EXPECTEDLINKDATA.length);
          component.colorPalette = 'categorical';
          component.linkConfig = {
            fillMode: 'link',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // FOR SOME REASON THIS TEST IS FINDING THAT WE ASSING COLOR 1 TO THE 7TH LINK
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach((link, i) => {
            expect(link).toEqualAttribute('stroke', i >= expectedColors.length ? 'none' : expectedColors[i]);
          });
        });
        it('should have fillMode of group if passed on load', async () => {
          const EXPECTEDCOLORSCALE = getColors(
            'categorical',
            scaleOrdinal()
              .domain(EXPECTEDLINKDATA.map(d => d[EXPECTEDGROUPACCESSOR]))
              .domain()
          );
          component.colorPalette = 'categorical';
          component.linkConfig = {
            fillMode: 'group',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // FOR SOME REASON THIS TEST IS FINDING THAT WE ASSING COLOR 1 TO THE 7TH LINK
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach((link, i) => {
            expect(link).toEqualAttribute('stroke', EXPECTEDCOLORSCALE(EXPECTEDLINKDATA[i][EXPECTEDGROUPACCESSOR]));
          });
        });
        it('should have fillMode of source if passed on load', async () => {
          const EXPECTEDCOLORSCALE = getColors(
            'categorical',
            scaleOrdinal()
              .domain(EXPECTEDLINKDATA.map(d => d[EXPECTEDSOURCEACCESSOR]))
              .domain()
          );
          component.colorPalette = 'categorical';
          component.linkConfig = {
            fillMode: 'source',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // FOR SOME REASON THIS TEST IS FINDING THAT WE ASSING COLOR 1 TO THE 7TH LINK
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach((link, i) => {
            expect(link).toEqualAttribute('stroke', EXPECTEDCOLORSCALE(EXPECTEDLINKDATA[i][EXPECTEDSOURCEACCESSOR]));
          });
        });
        it('should have fillMode of target if passed on load', async () => {
          const EXPECTEDCOLORSCALE = getColors(
            'categorical',
            scaleOrdinal()
              .domain(EXPECTEDLINKDATA.map(d => d[EXPECTEDTARGETACCESSOR]))
              .domain()
          );
          component.colorPalette = 'categorical';
          component.linkConfig = {
            fillMode: 'target',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // FOR SOME REASON THIS TEST IS FINDING THAT WE ASSING COLOR 1 TO THE 7TH LINK
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach((link, i) => {
            // console.log('checking', link.__data__.target.index, link.__data__.target.did, link['__data__'].target[EXPECTEDNODEIDACCESSOR], EXPECTEDLINKDATA[i][EXPECTEDTARGETACCESSOR], EXPECTEDCOLORSCALE.range(), EXPECTEDCOLORSCALE.domain());
            expect(link).toEqualAttribute('stroke', EXPECTEDCOLORSCALE(EXPECTEDLINKDATA[i][EXPECTEDTARGETACCESSOR]));
          });
        });
        it('should have fillMode of group if passed on update', async () => {
          const EXPECTEDCOLORSCALE = getColors(
            'categorical',
            scaleOrdinal()
              .domain(EXPECTEDLINKDATA.map(d => d[EXPECTEDGROUPACCESSOR]))
              .domain()
          );
          component.colorPalette = 'categorical';
          component.linkConfig = {
            fillMode: 'none',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.linkConfig = {
            fillMode: 'group',
            opacity: 1,
            visible: true
          };
          await page.waitForChanges();

          // ASSERT
          // FOR SOME REASON THIS TEST IS FINDING THAT WE ASSING COLOR 1 TO THE 7TH LINK
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach((link, i) => {
            expect(link).toEqualAttribute('stroke', EXPECTEDCOLORSCALE(EXPECTEDLINKDATA[i][EXPECTEDGROUPACCESSOR]));
          });
        });
      });
    });
    describe('nodes', () => {
      describe('fill', () => {
        const DEFAULTNODEFILL = '#E4E4E4';
        const DEFAULTNODESTROKE = getContrastingStroke('#E4E4E4');
        it('node fill should be off by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('fill', DEFAULTNODEFILL);
            expect(nodeRect).toEqualAttribute('stroke', DEFAULTNODESTROKE);
          });
        });
        it('node fill should be single_categorical_blue when passed on load', async () => {
          component.colorPalette = 'single_categorical_light_blue';
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            fill: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('fill', visaColors.categorical_light_blue);
            expect(nodeRect).toEqualAttribute('stroke', getContrastingStroke(visaColors.categorical_light_blue));
          });
        });
        it('node fill should be sequential_secOrange when passed on load', async () => {
          const EXPECTEDCOLORSCALE = getColors(
            'sequential_secOrange',
            scaleOrdinal()
              .domain(EXPECTEDNODEDATA.map(d => d[EXPECTEDNODEIDACCESSOR]))
              .domain()
          );
          component.colorPalette = 'sequential_secOrange';
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            fill: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach((nodeG, i) => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('fill', EXPECTEDCOLORSCALE(EXPECTEDNODEDATA[i][EXPECTEDNODEIDACCESSOR]));
            expect(nodeRect).toEqualAttribute(
              'stroke',
              getContrastingStroke(EXPECTEDCOLORSCALE(EXPECTEDNODEDATA[i][EXPECTEDNODEIDACCESSOR]))
            );
          });
        });
        it('node fill should be single_categorical_blue when passed on update', async () => {
          component.colorPalette = 'single_categorical_light_blue';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            fill: true
          };
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('fill', visaColors.categorical_light_blue);
            expect(nodeRect).toEqualAttribute('stroke', getContrastingStroke(visaColors.categorical_light_blue));
          });
        });
      });
      describe('width', () => {
        it('node width should be default by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('width', AlluvialDiagramDefaultValues.nodeConfig.width);
          });
        });
        it('node width should be 20 if passed on load', async () => {
          const EXPECTEDWIDTH = 20;
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            width: EXPECTEDWIDTH
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('width', EXPECTEDWIDTH);
          });
        });
        it('node width should be 20 if passed on update', async () => {
          const EXPECTEDWIDTH = 20;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            width: EXPECTEDWIDTH
          };
          await page.waitForChanges();

          // FLUSH TRANSITIONS
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          await asyncForEach(nodeGs, async nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            flushTransitions(nodeRect);
            await page.waitForChanges();
          });

          // ASSERT
          nodeGs.forEach(nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            expect(nodeRect).toEqualAttribute('width', EXPECTEDWIDTH);
          });
        });
      });
      describe('padding', () => {
        it('node padding should be default by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat22018]').querySelector('rect');
          expect(parseFloat(nodeG2Rect.getAttribute('y'))).toEqual(
            parseFloat(nodeG1Rect.getAttribute('y')) +
              parseFloat(nodeG1Rect.getAttribute('height')) +
              AlluvialDiagramDefaultValues.nodeConfig.padding
          );
        });
        it('node padding should be 10 if passed on load', async () => {
          const EXPECTEDPADDING = 10;
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            padding: EXPECTEDPADDING
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat22018]').querySelector('rect');
          expect(parseFloat(nodeG2Rect.getAttribute('y'))).toEqual(
            parseFloat(nodeG1Rect.getAttribute('y')) + parseFloat(nodeG1Rect.getAttribute('height')) + EXPECTEDPADDING
          );
        });
        it('node padding should be 10 if passed on update', async () => {
          const EXPECTEDPADDING = 10;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            padding: EXPECTEDPADDING
          };
          await page.waitForChanges();

          // FLUSH TRANSITIONS
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          await asyncForEach(nodeGs, async nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            flushTransitions(nodeRect);
            await page.waitForChanges();
          });

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat22018]').querySelector('rect');
          expect(parseFloat(nodeG2Rect.getAttribute('y'))).toEqual(
            parseFloat(nodeG1Rect.getAttribute('y')) + parseFloat(nodeG1Rect.getAttribute('height')) + EXPECTEDPADDING
          );
        });
      });
      describe('compare', () => {
        it('node compare should be off by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12019]').querySelector('rect');
          expect(parseFloat(nodeG1Rect.getAttribute('y')) + parseFloat(nodeG1Rect.getAttribute('height'))).not.toEqual(
            parseFloat(nodeG2Rect.getAttribute('y')) + parseFloat(nodeG2Rect.getAttribute('height'))
          );
        });
        it('node compare should be on if passed on load', async () => {
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            compare: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12019]').querySelector('rect');
          expect(parseFloat(nodeG1Rect.getAttribute('y')) + parseFloat(nodeG1Rect.getAttribute('height'))).toEqual(
            parseFloat(nodeG2Rect.getAttribute('y')) + parseFloat(nodeG2Rect.getAttribute('height'))
          );
        });
        it('node compare should be on if passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.nodeConfig = {
            ...AlluvialDiagramDefaultValues.nodeConfig,
            compare: true
          };
          await page.waitForChanges();

          // FLUSH TRANSITIONS
          const nodeGs = page.doc.querySelectorAll('[data-testid=node]');
          await asyncForEach(nodeGs, async nodeG => {
            const nodeRect = nodeG.querySelector('rect');
            flushTransitions(nodeRect);
            await page.waitForChanges();
          });

          // ASSERT
          const nodeG1Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12018]').querySelector('rect');
          const nodeG2Rect = page.doc.querySelector('[data-testid=node][data-id=node-Cat12019]').querySelector('rect');
          expect(parseFloat(nodeG1Rect.getAttribute('y')) + parseFloat(nodeG1Rect.getAttribute('height'))).toEqual(
            parseFloat(nodeG2Rect.getAttribute('y')) + parseFloat(nodeG2Rect.getAttribute('height'))
          );
        });
      }); // we are skipping tests for alignment of nodes for the time being
    });
    describe('style no textures', () => {
      describe('colorPalette', () => {
        it('should render categorical palette by default', async () => {
          const EXPECTEDFILLCOLOR = getColors('categorical', 1);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke', EXPECTEDFILLCOLOR);
          });
        });
        it('should load single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE, 1);
          // component.data = EXPECTEDDATALARGE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          links.forEach(link => {
            expect(link).toEqualAttribute('stroke', EXPECTEDFILLCOLOR);
          });
        });
        it('should update to single supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE, 1);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          await asyncForEach(links, async link => {
            flushTransitions(link);
            await page.waitForChanges();
            expect(link).toEqualAttribute('stroke', EXPECTEDFILLCOLOR);
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDCOLORSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDLINKDATA.map(d => d[EXPECTEDGROUPACCESSOR]))
              .domain()
          );
          component.colors = colors;
          component.linkConfig = {
            fillMode: 'group',
            opacity: 1,
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const links = page.doc.querySelectorAll('[data-testid=link]');
          await asyncForEach(links, async (link, i) => {
            flushTransitions(link);
            await page.waitForChanges();
            expect(link).toEqualAttribute('stroke', EXPECTEDCOLORSCALE(EXPECTEDLINKDATA[i][EXPECTEDGROUPACCESSOR]));
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
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
