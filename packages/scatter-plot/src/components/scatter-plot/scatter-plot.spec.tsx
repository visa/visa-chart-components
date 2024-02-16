/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { ScatterPlot } from './scatter-plot';
import { ScatterPlotDefaultValues } from './scatter-plot-default-values';
import { scaleOrdinal, scaleLinear, scaleSqrt, scaleSequentialSqrt } from 'd3-scale';
import { interpolate } from 'd3-interpolate';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '@visa/visa-charts-data-table/src/components/data-table/data-table';

// importing custom languages and locales
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, visaColors, formatStats, symbols } = Utils;

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestEvent,
  unitTestGeneric,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<scatter-plot>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new ScatterPlot()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { item: 1, group: 'A', value: 2700 },
      { item: 2, group: 'A', value: 1000 },
      { item: 3, group: 'A', value: 4004 },
      { item: 4, group: 'B', value: 2454 },
      { item: 5, group: 'B', value: 2135 },
      { item: 6, group: 'B', value: 11143 },
      { item: 7, group: 'C', value: 3845 },
      { item: 8, group: 'C', value: 2823 },
      { item: 9, group: 'C', value: 1666 },
      { item: 10, group: 'C', value: 1421 },
      { item: 11, group: 'D', value: 8845 },
      { item: 12, group: 'D', value: 6865 },
      { item: 13, group: 'D', value: 6154 },
      { item: 14, group: 'D', value: 4109 }
    ];
    const EXPECTEDGROUPACCESSOR = 'group';
    const EXPECTEDXACCESSOR = 'item';
    const EXPECTEDYACCESSOR = 'value';
    const MINVALUE = 1000;
    const MAXVALUE = 11143;
    const MINITEM = 1;
    const MAXITEM = 14;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { ...ScatterPlotDefaultValues.accessibility, disableValidation: true };
    const EXPECTEDLOCALIZATION = { ...ScatterPlotDefaultValues.localization, skipValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [ScatterPlot, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('scatter-plot');
      component.data = [...EXPECTEDDATA];
      component.groupAccessor = EXPECTEDGROUPACCESSOR;
      component.xAccessor = EXPECTEDXACCESSOR;
      component.yAccessor = EXPECTEDYACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.localization = EXPECTEDLOCALIZATION;
      component.uniqueID = 'scatter-plot-unit-test';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new ScatterPlot()).toBeTruthy();
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

      it('should render with minimal props[data,(group,x,y)Accessor] given', async () => {
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
        // RESTORE GLOBAL FUNCTION FROM MOCK AFTER TEST
        jest.spyOn(console, 'error').mockRestore();
      });
      Object.keys(unitTestGeneric).forEach(test => {
        const innerTestProps = unitTestGeneric[test].testDefault
          ? { [unitTestGeneric[test].prop]: ScatterPlotDefaultValues[unitTestGeneric[test].prop] }
          : unitTestGeneric[test].prop === 'data'
          ? { data: EXPECTEDDATA }
          : unitTestGeneric[test].testProps;
        const innerTestSelector =
          unitTestGeneric[test].testSelector === 'component-name'
            ? 'scatter-plot'
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
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-2-1000]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'group A. item 1. value 2.7k. Point 1.',
              nextSelectorAriaLabel: 'group A. item 2. value 1k. Point 2.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=marker][data-id=marker-A-3-4004]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'A. 3. 4k. Point 3.',
              nextSelectorAriaLabel: 'A. 1. 2.7k. Point 1.'
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-A-3-4004]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-2-1000]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'group A. item 3. value 4k. Point 3.',
              nextSelectorAriaLabel: 'group A. item 2. value 1k. Point 2.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-3-4004]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'A. 1. 2.7k. Point 1.',
              nextSelectorAriaLabel: 'A. 3. 4k. Point 3.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin: {
            name: 'keyboard nav: cousin - up arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-B-4-2454]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'B. 4. 2.5k. Point 1.',
              nextSelectorAriaLabel: 'A. 1. 2.7k. Point 1.'
            }
          },
          accessibility_keyboard_nav_up_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - up arrow loops to last',
            testSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            nextTestSelector: '[data-testid=marker][data-id=marker-D-11-8845]',
            keyDownObject: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38 },
            testProps: {
              selectorAriaLabel: 'A. 1. 2.7k. Point 1.',
              nextSelectorAriaLabel: 'D. 11. 8.8k. Point 1.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin: {
            name: 'keyboard nav: cousin - down arrow goes to next',
            testSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            nextTestSelector: '[data-testid=marker][data-id=marker-B-4-2454]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'A. 1. 2.7k. Point 1.',
              nextSelectorAriaLabel: 'B. 4. 2.5k. Point 1.'
            }
          },
          accessibility_keyboard_nav_down_arrow_cousin_loop: {
            name: 'keyboard nav: cousin - down arrow loops to first',
            testSelector: '[data-testid=marker][data-id=marker-D-11-8845]',
            nextTestSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            keyDownObject: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40 },
            testProps: {
              selectorAriaLabel: 'D. 11. 8.8k. Point 1.',
              nextSelectorAriaLabel: 'A. 1. 2.7k. Point 1.'
            }
          },
          accessibility_keyboard_nav_shift_enter_to_group: {
            name: 'keyboard nav: group - shift+enter will move up to group',
            testSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
            nextTestSelector: '[data-testid=marker-series-group][data-id=marker-series-A]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              selectorAriaLabel: 'A. 1. 2.7k. Point 1.',
              nextSelectorAriaLabel: 'A. scatter group 1.'
            }
          }
          // accessibility_keyboard_nav_enter_group: {
          //   name: 'keyboard nav: group - enter will move into to group',
          //   testSelector: '[data-testid=marker-series-group][data-id=marker-series-A]',
          //   nextTestSelector: '[data-testid=marker][data-id=marker-A-1-2700]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 },
          //   testProps: {
          //     selectorAriaLabel: 'A. Scatter group 1 of 4 which contains 3 interactive points.',
          //     nextSelectorAriaLabel: 'A. 1. 2.7k. Point 1 of 3.'
          //   }
          // }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: ScatterPlotDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            geometryType: 'Symbol',
            geometryPlacementAttributes: ['data-r', 'data-x', 'data-y'],
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
                        label: 'scatter items',
                        bgPadding: 0,
                        title: 'Test Annotation',
                        align: 'left',
                        wrap: 130
                      },
                      accessibilityDescription: 'This is a test description for accessibility.',
                      data: {
                        item: 2,
                        value: 1500
                      },
                      dy: '-35%',
                      className: 'scatter-annotation',
                      type: 'annotationCalloutCircle',
                      subject: { radius: 18 }
                    }
                  ]
                : [],
            referenceLines:
              unitTestAccessibility[test].prop === 'referenceLines'
                ? [
                    {
                      label: 'Mid',
                      placement: 'bottom',
                      value: 20,
                      axis: 'x',
                      accessibilityDescription: 'accessDesc1'
                    },
                    {
                      label: 'Avg (est)',
                      placement: 'right',
                      value: 20000,
                      axis: 'y',
                      accessibilityDescription: 'accessDesc2'
                    }
                  ]
                : []
          };
          const innerTestSelector =
            unitTestAccessibility[test].testSelector === 'component-name'
              ? 'scatter-plot'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=marker]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=marker-group-container]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=marker][data-id=marker-A-1-2700]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=marker][data-id=marker-A-2-1000]'
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

      // focus - recevies focus indicator
      // blur - focus indicator
      // group/bar - left/right, but wait on the up/down
      // keys could change
      // spacebar for selection/click event
      // describe.only('keyboard focus indicator', () => {
      //   it('chart entry', async () => {
      //     // ARRANGE
      //     const mockFocusEvent = new Event('focus');
      //     const mockKeyboardEvent = new KeyboardEvent('keydown', { key: "ArrowRight", code: "ArrowRight", keyCode: 39 });
      //     const clonedAttibutes = ['x','y','height','width'];

      //     // ACT
      //     page.root.appendChild(component);
      //     await page.waitForChanges();

      //     // SELECT THE BAR GROUP AND MOCK THE OWNER SVG ELEMENT SINCE JSDOM DOESN'T HAVE THIS
      //     const ownerSVG = page.root.querySelector('[data-testid=chart-container] svg');
      //     const barGroup = page.root.querySelector('[data-testid=marker-group]');
      //     Object.defineProperty(barGroup, 'ownerSVGElement', {
      //       get: () => ownerSVG,
      //       set: () => {} // tslint:disable-line: no-empty
      //     });

      //     // ACT FOCUS
      //     const markerToFocus = page.root.querySelector('[data-id=marker-A-1-2700]');
      //     markerToFocus.dispatchEvent(mockFocusEvent);

      //     // NOW THAT WE ARE FOCUSED MOCK .focus() on mark to receive focus
      //     const markerReceiveFocus = page.root.querySelector('[data-id=marker-A-2-1000]');
      //     markerReceiveFocus['focus'] = () => markerReceiveFocus.dispatchEvent(mockFocusEvent); // tslint:disable-line: no-string-literal

      //     // FIRE THE KEYBOARD EVENT
      //     markerToFocus.dispatchEvent(mockKeyboardEvent);
      //     await page.waitForChanges();

      //     // NOW WE CAN DETERMINE WHETHER THE NEXT SIBLING IS FOCUSED
      //     // FIND FOCUS MARKER CONTAINER
      //     const focusMarkerG = page.root.querySelector('g.vcl-accessibility-focus-highlight');

      //     // ASSERT
      //     expect(markerToFocus).not.toHaveClass('vcl-accessibility-focus-source');
      //     expect(markerReceiveFocus).toHaveClass('vcl-accessibility-focus-source');
      //     expect(focusMarkerG).toBeTruthy();
      //     expect(focusMarkerG.childNodes.length).toEqual(3);

      //     // check clone is over the newly focused marker vs the original
      //     const clonedMarker = focusMarkerG.childNodes[2];
      //     clonedAttibutes.forEach(attr => {
      //       expect(clonedMarker).toEqualAttribute(attr, markerReceiveFocus.getAttribute(attr));
      //     });
      //   });
      // });

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

    // annotations break in jsdom due to their text wrapping function in d3-annotation -- fixed in stencil 2.17.3+
    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      it('should pass annotation prop on load', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {
              label: 'scatter items',
              bgPadding: 0,
              title: 'Test Annotation',
              align: 'left',
              wrap: 130
            },
            accessibilityDescription: 'This is a test description for accessibility.',
            data: {
              item: 2,
              value: 1500
            },
            dy: '-35%',
            className: 'scatter-annotation',
            type: 'annotationCalloutCircle',
            subject: { radius: 18 }
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
              label: 'scatter items',
              bgPadding: 0,
              title: 'Test Annotation',
              align: 'left',
              wrap: 130
            },
            accessibilityDescription: 'This is a test description for accessibility.',
            data: {
              item: 2,
              value: 1500
            },
            dy: '-35%',
            className: 'scatter-annotation',
            type: 'annotationCalloutCircle',
            subject: { radius: 18 }
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

    describe('axes', () => {
      describe('xMinValueOverride & xMaxValueOverride', () => {
        it('should set min and max x value from data by default', async () => {
          // ARRANGE
          const xMin = MINITEM - (MAXITEM - MINITEM) * 0.1;
          const xMax = MAXITEM + (MAXITEM - MINITEM) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([xMin, xMax])
            .range([0, 650]);

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
            expect(marker).toEqualAttribute('data-x', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should set min X value when passed on load', async () => {
          // ARRANGE
          const xMin = -5;
          const xMax = MAXITEM + (MAXITEM - MINITEM) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([xMin, xMax])
            .range([0, 650]);

          component.xMinValueOverride = -5;
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
            expect(marker).toEqualAttribute('data-x', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should set min X value when passed on update', async () => {
          // ARRANGE
          const xMin = -5;
          const xMax = MAXITEM + (MAXITEM - MINITEM) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([xMin, xMax])
            .range([0, 650]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.xMinValueOverride = -5;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-x', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should set max X value when passed on load', async () => {
          // ARRANGE
          const xMin = MINITEM - (MAXITEM - MINITEM) * 0.1;
          const xMax = 20;
          const EXPECTEDSCALE = scaleLinear()
            .domain([xMin, xMax])
            .range([0, 650]);

          component.xMaxValueOverride = 20;
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
            expect(marker).toEqualAttribute('data-x', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
        it('should set max X value when passed on update', async () => {
          // ARRANGE
          const xMin = MINITEM - (MAXITEM - MINITEM) * 0.1;
          const xMax = 20;
          const EXPECTEDSCALE = scaleLinear()
            .domain([xMin, xMax])
            .range([0, 650]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.xMaxValueOverride = 20;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-x', EXPECTEDSCALE(EXPECTEDDATA[i].item));
          });
        });
      });
      describe('yMinValueOverride & yMaxValueOverride', () => {
        it('should set min and max y value from data by default', async () => {
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
            expect(marker).toEqualAttribute('data-y', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set min Y value when passed on load', async () => {
          // ARRANGE
          const yMin = 0;
          const yMax = MAXVALUE + (MAXVALUE - MINVALUE) * 0.1;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.yMinValueOverride = 0;
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
            expect(marker).toEqualAttribute('data-y', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set min Y value when passed on update', async () => {
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
          component.yMinValueOverride = 0;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-y', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set max Y value when passed on load', async () => {
          // ARRANGE
          const yMin = MINVALUE - (MAXVALUE - MINVALUE) * 0.1;
          const yMax = 15000;
          const EXPECTEDSCALE = scaleLinear()
            .domain([yMin, yMax])
            .range([300, 0]);

          component.yMaxValueOverride = 15000;
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
            expect(marker).toEqualAttribute('data-y', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
        it('should set max Y value when passed on update', async () => {
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
          component.yMaxValueOverride = 15000;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-y', EXPECTEDSCALE(EXPECTEDDATA[i].value));
          });
        });
      });

      describe('showBaselineX & showBaselineY', () => {
        it('baseline on xAxis should be visible and baseline on yAxis should not be visible by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=scatter-grid-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis-mark]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 1);
          expect(yAxis).toEqualAttribute('opacity', 0);
        });
        it('should flip opacity of baselines on load', async () => {
          // ARRANGE
          component.showBaselineX = false;
          component.showBaselineY = true;

          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=scatter-grid-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis-mark]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
          expect(yAxis).toEqualAttribute('opacity', 1);
        });
        it('should flip opacity of baselines on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.showBaselineX = false;
          component.showBaselineY = true;
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=scatter-grid-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis-mark]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
          expect(yAxis).toEqualAttribute('opacity', 1);
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
        it('should render both x and y grids by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const gridBottom = page.doc.querySelector('[data-testid=grid-bottom]');
          const gridLeft = page.doc.querySelector('[data-testid=grid-left]');
          flushTransitions(gridBottom);
          flushTransitions(gridLeft);
          expect(gridBottom).toEqualAttribute('opacity', 1);
          expect(gridLeft).toEqualAttribute('opacity', 1);
        });
        it('should not render both x and y grids when passed on load', async () => {
          // ARRANGE
          component.xAxis = {
            visible: true,
            gridVisible: false,
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
          expect(gridBottom).toEqualAttribute('opacity', 0);
          expect(gridLeft).toEqualAttribute('opacity', 0);
        });
        it('should not render both x and y grids when passed on update', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.xAxis = {
            visible: true,
            gridVisible: false,
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
          expect(gridBottom).toEqualAttribute('opacity', 0);
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
          const EXPECTEDTICKS = ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k'];

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
          const EXPECTEDTICKS = ['0', '2', '4', '6', '8', '10', '12', '14'];

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
          const EXPECTEDTICKS = [
            '$0',
            '$1k',
            '$2k',
            '$3k',
            '$4k',
            '$5k',
            '$6k',
            '$7k',
            '$8k',
            '$9k',
            '$10k',
            '$11k',
            '$12k'
          ];

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
          const EXPECTEDTICKS = ['$0', '$2', '$4', '$6', '$8', '$10', '$12', '$14'];

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
        it('x and y axis should have tick interval 2 when passed', async () => {
          // ARRANGE
          const EXPECTEDXAXIS = {
            format: '0[.][0][0]a',
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
          const EXPECTEDXTICKS = ['0', '2', '4', '6', '8', '10', '12', '14'];
          const EXPECTEDYTICKS = ['0', '1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k'];
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
        const innerTestSelector = '[data-testid=marker][data-id=marker-A-1-2700]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-B-4-2454]'; // scatter defaults to group highlight
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
                '[data-testid=marker-series-group][data-id=marker-series-A]',
                '[data-testid=marker-series-group][data-id=marker-series-B]'
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
        const innerTestSelector = '[data-testid=marker][data-id=marker-A-1-2700]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-B-4-2454]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['group'],
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
          interactionKeys: ['group', 'item'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-A-1-2700]',
            '[data-testid=marker][data-id=marker-A-2-1000]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-A-1-2700]',
            '[data-testid=marker][data-id=marker-A-2-1000]'
          ));
      });

      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=marker][data-id=marker-A-1-2700]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-B-4-2454]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 1
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['group'],
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
          interactionKeys: ['group', 'item'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-A-1-2700]',
            '[data-testid=marker][data-id=marker-A-2-1000]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=marker][data-id=marker-A-1-2700]',
            '[data-testid=marker][data-id=marker-A-2-1000]'
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
            labelAccessor: ['item'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['group', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=marker][data-id=marker-A-1-2700]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default:
                '<p style="margin: 0;"><b>A<br></b>X Axis:<b>1</b><br>Y Axis:<b>2.7k</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>1</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>1</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$2.7k</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>A</b><br>Count:<b>$2.7k</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;"><b>A<br></b>Test Item:<b>1</b><br>Y Axis:<b>2.7k</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;"><b>A<br></b>Test Item:<b>1</b><br>Y Axis:<b>2.7k</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load: 'group A. Test Item 1. value 2.7k. Point 1.',
              dataKeyNames_custom_on_update: 'group A. Test Item 1. value 2.7k. Point 1.'
            };
            const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };
            const customDataKeyNames = { dataKeyNames: { item: 'Test Item' } };
            const customSizeConfig = { sizeConfig: { sizeAccessor: 'value', format: '$0.0a' } };
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
              it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name} sizeConfig`, () =>
                unitTestTooltip[test].testFunc(
                  component,
                  page,
                  {
                    ...innerTestProps,
                    ...customDataKeyNames,
                    ...customSizeConfig,
                    accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true },
                    selectorAriaLabel: 'group A. Test Item 1. value $2.7k. Point 1.'
                  },
                  innerTestSelector,
                  `<p style="margin: 0;"><b>A<br></b>Test Item:<b>1</b><br>Y Axis:<b>2.7k</b><br>Value:<b>$2.7k</b></p>`
                ));
            } else if (test === 'tooltip_tooltipLabel_default') {
              // default tooltip without sizeConfig
              it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name}`, () =>
                unitTestTooltip[test].testFunc(
                  component,
                  page,
                  innerTestProps,
                  innerTestSelector,
                  innerTooltipContent[test]
                ));
              // default tooltip with sizeConfig
              it(`${unitTestTooltip[test].prop}: ${unitTestTooltip[test].name} sizeConfig`, () =>
                unitTestTooltip[test].testFunc(
                  component,
                  page,
                  {
                    ...innerTestProps,
                    ...customSizeConfig
                  },
                  innerTestSelector,
                  `<p style="margin: 0;"><b>A<br></b>X Axis:<b>1</b><br>Y Axis:<b>2.7k</b><br>Value:<b>$2.7k</b></p>`
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
            flushTransitions(dataLabel);
            await page.waitForChanges();
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
          it('should render label accessor if passed on load', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            const EXPECTEDDATARANDOM = [
              { item: 1, group: 'A', value: 2700, random: Math.random() },
              { item: 2, group: 'A', value: 1000, random: Math.random() },
              { item: 3, group: 'A', value: 4004, random: Math.random() },
              { item: 4, group: 'B', value: 2454, random: Math.random() },
              { item: 5, group: 'B', value: 2135, random: Math.random() },
              { item: 6, group: 'B', value: 11143, random: Math.random() },
              { item: 7, group: 'C', value: 3845, random: Math.random() },
              { item: 8, group: 'C', value: 2823, random: Math.random() },
              { item: 9, group: 'C', value: 1666, random: Math.random() },
              { item: 10, group: 'C', value: 1421, random: Math.random() },
              { item: 11, group: 'D', value: 8845, random: Math.random() },
              { item: 12, group: 'D', value: 6865, random: Math.random() },
              { item: 13, group: 'D', value: 6154, random: Math.random() },
              { item: 14, group: 'D', value: 4109, random: Math.random() }
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
          it('should render label accessor if passed on update', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            const EXPECTEDDATARANDOM = [
              { item: 1, group: 'A', value: 2700, random: Math.random() },
              { item: 2, group: 'A', value: 1000, random: Math.random() },
              { item: 3, group: 'A', value: 4004, random: Math.random() },
              { item: 4, group: 'B', value: 2454, random: Math.random() },
              { item: 5, group: 'B', value: 2135, random: Math.random() },
              { item: 6, group: 'B', value: 11143, random: Math.random() },
              { item: 7, group: 'C', value: 3845, random: Math.random() },
              { item: 8, group: 'C', value: 2823, random: Math.random() },
              { item: 9, group: 'C', value: 1666, random: Math.random() },
              { item: 10, group: 'C', value: 1421, random: Math.random() },
              { item: 11, group: 'D', value: 8845, random: Math.random() },
              { item: 12, group: 'D', value: 6865, random: Math.random() },
              { item: 13, group: 'D', value: 6154, random: Math.random() },
              { item: 14, group: 'D', value: 4109, random: Math.random() }
            ];
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
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(parseFloat(marker.getAttribute('data-y')));
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
            expect(parseFloat(label.getAttribute('y'))).toBeGreaterThan(parseFloat(marker.getAttribute('data-y')));
          });
          it('should place labels on right of markers if passed on update', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'right'
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const marker = page.doc.querySelector('[data-testid=marker]');
            flushTransitions(label);
            flushTransitions(marker);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toBeGreaterThan(parseFloat(marker.getAttribute('data-x')));
          });
          it('should place labels on left of markers if passed on update', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'right'
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const marker = page.doc.querySelector('[data-testid=marker]');
            flushTransitions(label);
            flushTransitions(marker);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toBeGreaterThan(parseFloat(marker.getAttribute('data-x')));
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
            expect(legendContainer).toHaveClass('scatter-legend');
            expect(legendSVG).toEqualAttribute('opacity', 1);
            expect(legendPaddingG).toHaveClass('legend-padding-wrapper');
            expect(legendG[0]).toHaveClass('legend');
            expect(legendG.length).toEqual(4);
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
            expect(legendSVG).toEqualAttribute('opacity', 0);
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
            expect(legendSVG).toEqualAttribute('opacity', 0);
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
              labels: [15, 30, 45, 60]
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
            const EXPECTEDLABELS = ['A', 'B', 'C', 'D'];

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
            const EXPECTEDLABELS = ['DOG', 'CAT', 'BIRD', 'TURTLE'];
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

    describe('reference line', () => {
      it('should pass referenceLines prop', async () => {
        // ARRANGE
        const referenceLines = [
          { label: 'Mid', placement: 'top', value: 4, axis: 'x' },
          { label: 'Avg (est)', placement: 'right', value: 6000, axis: 'y' }
        ];
        component.referenceLines = referenceLines;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLinesGroup = page.doc.querySelector('[data-testid=reference-line-group]');
        const referenceLineG = page.doc.querySelector('[data-testid=reference-g]');
        const referenceLine = page.doc.querySelector('[data-testid=reference-line]');
        const referenceLineLabel = page.doc.querySelector('[data-testid=reference-line-label]');
        flushTransitions(referenceLinesGroup);
        flushTransitions(referenceLineG);
        flushTransitions(referenceLine);
        flushTransitions(referenceLineLabel);
        await page.waitForChanges();
        expect(referenceLinesGroup).toMatchSnapshot();
      });

      it('should pass referenceStyle prop', async () => {
        // ARRANGE
        const referenceLines = [
          { label: 'Mid', placement: 'top', value: 4, axis: 'x' },
          { label: 'Avg (est)', placement: 'right', value: 6000, axis: 'y' }
        ];
        const referenceStyle = { color: 'categorical_blue', dashed: '', opacity: 0.65, strokeWidth: '2.5px' };
        component.referenceLines = referenceLines;
        component.referenceStyle = referenceStyle;

        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const referenceLinesGroup = page.doc.querySelector('[data-testid=reference-line-group]');
        const referenceLineG = page.doc.querySelector('[data-testid=reference-g]');
        const referenceLine = page.doc.querySelector('[data-testid=reference-line]');
        const referenceLineLabel = page.doc.querySelector('[data-testid=reference-line-label]');
        flushTransitions(referenceLinesGroup);
        flushTransitions(referenceLineG);
        flushTransitions(referenceLine);
        flushTransitions(referenceLineLabel);
        await page.waitForChanges();
        expect(referenceLinesGroup).toMatchSnapshot();
      });
    });

    describe('markers', () => {
      describe('dotOpacity', () => {
        it('should render markers with default (1) dotOpacity by default', async () => {
          // ARRANGE
          const EXPECTEDOPACITY = ScatterPlotDefaultValues.dotOpacity;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('opacity', EXPECTEDOPACITY);
          });
        });
        it('should render markers with .5 dotOpacity if passed on load', async () => {
          // ARRANGE
          const EXPECTEDOPACITY = 0.5;
          component.dotOpacity = EXPECTEDOPACITY;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('opacity', EXPECTEDOPACITY);
          });
        });
        it('should render markers with .5 dotOpacity if passed on update', async () => {
          // ARRANGE
          const EXPECTEDOPACITY = 0.5;

          // ACT - RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.dotOpacity = EXPECTEDOPACITY;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('opacity', EXPECTEDOPACITY);
          });
        });
      });

      describe('dotRadius', () => {
        it('should render markers with default dotRadius by default', async () => {
          // ARRANGE
          const EXPECTEDRADIUS = ScatterPlotDefaultValues.dotRadius;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-r', EXPECTEDRADIUS);
          });
        });
        it('should render markers with 10 dotRadius if passed on load', async () => {
          // ARRANGE
          const EXPECTEDRADIUS = 10;
          component.dotRadius = EXPECTEDRADIUS;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-r', EXPECTEDRADIUS);
          });
        });
        it('should render markers with 10 dotRadius if passed on update', async () => {
          // ARRANGE
          const EXPECTEDRADIUS = 10;

          // ACT - RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - UPDATE
          component.dotRadius = EXPECTEDRADIUS;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('data-r', EXPECTEDRADIUS);
          });
        });
      });

      describe('dotSymbols', () => {
        it('should render circles by default', async () => {
          // ARRANGE
          const EXPECTEDSYMBOL = symbols.circle.general;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('d', EXPECTEDSYMBOL);
          });
        });
        it('should render stars if passed on load', async () => {
          // ARRANGE
          const EXPECTEDSYMBOL = symbols.star.general;
          component.dotSymbols = ['star'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('d', EXPECTEDSYMBOL);
          });
        });
        it('should render dots, square, stars, cross  if passed on load', async () => {
          // ARRANGE
          const EXPECTEDSYMBOL = {
            A: symbols.circle.general,
            B: symbols.square.general,
            C: symbols.cross.general,
            D: symbols.star.general
          };
          component.dotSymbols = ['circle', 'square', 'cross', 'star'];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            expect(marker).toEqualAttribute('d', EXPECTEDSYMBOL[EXPECTEDDATA[i].group]);
          });
        });
        it('should render stars if passed on update', async () => {
          // ARRANGE
          const EXPECTEDSYMBOL = symbols.star.general;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.dotSymbols = ['star'];
          await page.waitForChanges();

          // ASSERT - WE ONLY TEST ONE OR A FEW MARKERS HERE TO AVOID CALL TRANSITION END ALL
          // WHICH FAILS IN JSDOM DUE TO (_, i, n) NOT BEING AVAILABLE
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('d', EXPECTEDSYMBOL);
          });
        });
        it('should render dots, square, stars, cross  if passed on update', async () => {
          // ARRANGE
          const EXPECTEDSYMBOL = {
            A: symbols.circle.general,
            B: symbols.square.general,
            C: symbols.cross.general,
            D: symbols.star.general
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.dotSymbols = ['circle', 'square', 'cross', 'star'];
          await page.waitForChanges();

          // ASSERT - WE ONLY TEST ONE OR A FEW MARKERS HERE TO AVOID CALL TRANSITION END ALL
          // WHICH FAILS IN JSDOM DUE TO (_, i, n) NOT BEING AVAILABLE
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker, i);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('d', EXPECTEDSYMBOL[EXPECTEDDATA[i].group]);
          });
        });
      });

      describe('sizeConfig', () => {
        it('should set sizeConfig.sizeAccessor on load', async () => {
          // ARRANGE
          const minSizeOverride = undefined;
          const maxSizeOverride = undefined;
          const EXPECTEDSCALE = scaleSqrt()
            .domain([MINVALUE, MAXVALUE])
            .range([minSizeOverride || ScatterPlotDefaultValues.dotRadius, maxSizeOverride || (650 + 300) / 2.5 / 10]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.sizeConfig = {
            sizeAccessor: 'value'
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 1);
          });
        });
        it('should set sizeConfig.sizeAccessor on update', async () => {
          // ARRANGE
          const minSizeOverride = undefined;
          const maxSizeOverride = undefined;
          const EXPECTEDSCALE = scaleSqrt()
            .domain([MINVALUE, MAXVALUE])
            .range([minSizeOverride || ScatterPlotDefaultValues.dotRadius, maxSizeOverride || (650 + 300) / 2.5 / 10]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sizeConfig = {
            sizeAccessor: 'value'
          };
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 1);
          });
        });
        it('should set sizeConfig.dualEncodeColor on load', async () => {
          // ARRANGE
          const dotColor = scaleOrdinal()
            .domain(['A', 'B', 'C', 'D'])
            .range([
              visaColors.categorical_light_blue,
              visaColors.categorical_blue,
              visaColors.categorical_light_purple,
              visaColors.categorical_purple
            ]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.sizeConfig = {
            sizeAccessor: 'value',
            dualEncodeColor: true
          };
          component.colors = [
            visaColors.categorical_light_blue,
            visaColors.categorical_blue,
            visaColors.categorical_light_purple,
            visaColors.categorical_purple
          ];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute(
              'fill',
              scaleSequentialSqrt(
                [Math.max(0, MINVALUE), MAXVALUE],
                interpolate('#fff', dotColor(EXPECTEDDATA[i].group))
              )(EXPECTEDDATA[i].value)
            );
          });
        });
        it('should set sizeConfig.dualEncodeColor on update', async () => {
          // ARRANGE
          const dotColor = scaleOrdinal()
            .domain(['A', 'B', 'C', 'D'])
            .range([
              visaColors.categorical_light_blue,
              visaColors.categorical_blue,
              visaColors.categorical_light_purple,
              visaColors.categorical_purple
            ]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sizeConfig = {
            sizeAccessor: 'value',
            dualEncodeColor: true
          };
          component.colors = [
            visaColors.categorical_light_blue,
            visaColors.categorical_blue,
            visaColors.categorical_light_purple,
            visaColors.categorical_purple
          ];
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute(
              'fill',
              scaleSequentialSqrt(
                [Math.max(0, MINVALUE), MAXVALUE],
                interpolate('#fff', dotColor(EXPECTEDDATA[i].group))
              )(EXPECTEDDATA[i].value)
            );
          });
        });
        it('should set sizeConfig.minValueOverride & sizeConfig.maxValueOverride on load', async () => {
          // ARRANGE
          const sizeMin = 100;
          const sizeMax = 15000;
          const EXPECTEDSCALE = scaleSqrt()
            .domain([sizeMin, sizeMax])
            .range([ScatterPlotDefaultValues.dotRadius, (650 + 300) / 2.5 / 10]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.sizeConfig = {
            sizeAccessor: 'value',
            minValueOverride: sizeMin,
            maxValueOverride: sizeMax
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 1);
          });
        });
        it('should set sizeConfig.minValueOverride & sizeConfig.maxValueOverride on update', async () => {
          // ARRANGE
          const sizeMin = 0;
          const sizeMax = 15000;
          const EXPECTEDSCALE = scaleSqrt()
            .domain([sizeMin, sizeMax])
            .range([ScatterPlotDefaultValues.dotRadius, (650 + 300) / 2.5 / 10]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sizeConfig = {
            sizeAccessor: 'value',
            minValueOverride: 0,
            maxValueOverride: 15000
          };
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 0);
          });
        });
        it('should set sizeConfig.minSizeOverride & sizeConfig.maxSizeOverride on load', async () => {
          // ARRANGE
          const minSizeOverride = 1;
          const maxSizeOverride = 20; // to big of a number here will lead to a failure
          const EXPECTEDSCALE = scaleSqrt()
            .domain([MINVALUE, MAXVALUE])
            .range([minSizeOverride, maxSizeOverride]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.sizeConfig = { sizeAccessor: 'value', minSizeOverride, maxSizeOverride };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 1);
          });
        });
        it('should set sizeConfig.minSizeOverride & sizeConfig.maxSizeOverride on update', async () => {
          // ARRANGE
          const minSizeOverride = 1;
          const maxSizeOverride = 20;
          const EXPECTEDSCALE = scaleSqrt()
            .domain([MINVALUE, MAXVALUE])
            .range([minSizeOverride, maxSizeOverride]);

          component.height = 300;
          component.width = 650;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sizeConfig = { sizeAccessor: 'value', minSizeOverride, maxSizeOverride };
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async (marker, i) => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(Number(marker.getAttribute('data-r'))).toBeCloseTo(EXPECTEDSCALE(EXPECTEDDATA[i].value), 1);
          });
        });
      });
    });

    describe('style', () => {
      // this doesn't do anything on scatter
      // beforeEach(() => {
      //   component.accessibility = { ...component.accessibility, hideTextures: true };
      // });

      describe('colorPalette', () => {
        it('should render categorical palette by default', async () => {
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.group))
              .domain()
          );

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].group));
          });
        });
        it('should load single supplement Pink when colorPalette is single_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          });
        });
        it('should update to single supplement Pink when colorPalette is single_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'single_suppPink';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE);

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          await asyncForEach(markers, async marker => {
            flushTransitions(marker);
            await page.waitForChanges();
            expect(marker).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
          });
        });

        it('should render sequential orange when colorPalette is sequential_orange', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_secOrange';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.group))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].group));
          });
        });

        it('should render diverging_RtoB color when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDSCALE = getColors(
            EXPECTEDCOLORPALETTE,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.group))
              .domain()
          );
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].group));
          });
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDSCALE = getColors(
            colors,
            scaleOrdinal()
              .domain(EXPECTEDDATA.map(d => d.group))
              .domain()
          );
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            expect(marker).toEqualAttribute('fill', EXPECTEDSCALE(EXPECTEDDATA[i].group));
          });
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
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
