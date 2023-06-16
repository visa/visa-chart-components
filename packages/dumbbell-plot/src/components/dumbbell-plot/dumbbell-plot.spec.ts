/**
 * Copyright (c) 2020, 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { DumbbellPlot } from './dumbbell-plot';
import { DumbbellPlotDefaultValues } from './dumbbell-plot-default-values';
import { scalePoint, scaleLinear, scaleTime } from 'd3-scale';
import { timeMonth } from 'd3-time';
// import { rgb } from 'd3-color'; // this code is commented out now

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '@visa/visa-charts-data-table/src/components/data-table/data-table';

// importing custom languages and locales
import { hu } from '@visa/visa-charts-utils/src/utils/localization/languages/hu';
import { HU } from '@visa/visa-charts-utils/src/utils/localization/numeralLocales/hu';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { formatStats, getColors, roundTo, getContrastingStroke, ensureTextContrast } = Utils;

const {
  asyncForEach,
  flushTransitions,
  unitTestAccessibility,
  unitTestAxis,
  unitTestGeneric,
  unitTestEvent,
  unitTestInteraction,
  unitTestTooltip
} = UtilsDev;

describe('<dumbbell-plot>', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new DumbbellPlot()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { date: 'Jan-2016', category: 'CatA', value: 7670994739 },
      { date: 'Feb-2016', category: 'CatA', value: 7628909842 },
      { date: 'Mar-2016', category: 'CatA', value: 8358837379 },
      { date: 'Apr-2016', category: 'CatA', value: 8334842966 },
      { date: 'May-2016', category: 'CatA', value: 8588600035 },
      { date: 'Jun-2016', category: 'CatA', value: 8484192554 },
      { date: 'Jul-2016', category: 'CatA', value: 8778636197 },
      { date: 'Aug-2016', category: 'CatA', value: 8811163096 },
      { date: 'Sep-2016', category: 'CatA', value: 8462148898 },
      { date: 'Oct-2016', category: 'CatA', value: 9051933407 },
      { date: 'Nov-2016', category: 'CatA', value: 8872849978 },
      { date: 'Dec-2016', category: 'CatA', value: 9709829820 },
      { date: 'Jan-2016', category: 'CatB', value: 6570994739 },
      { date: 'Feb-2016', category: 'CatB', value: 4628909842 },
      { date: 'Mar-2016', category: 'CatB', value: 4358837379 },
      { date: 'Apr-2016', category: 'CatB', value: 5534842966 },
      { date: 'May-2016', category: 'CatB', value: 4388600035 },
      { date: 'Jun-2016', category: 'CatB', value: 3484192554 },
      { date: 'Jul-2016', category: 'CatB', value: 3578636197 },
      { date: 'Aug-2016', category: 'CatB', value: 6411163096 },
      { date: 'Sep-2016', category: 'CatB', value: 5262148898 },
      { date: 'Oct-2016', category: 'CatB', value: 4651933407 },
      { date: 'Nov-2016', category: 'CatB', value: 6772849978 },
      { date: 'Dec-2016', category: 'CatB', value: 5609829820 }
    ];
    const EXPECTEDORDINALACCESSOR = 'date';
    const EXPECTEDSERIESACCESSOR = 'category';
    const EXPECTEDVALUEACCESSOR = 'value';
    const EXPECTEDUNIQUEID = 'unique-d-plot';
    const MINVALUE = 3484192554;
    const MAXVALUE = 9709829820;
    const innerMinValue = MINVALUE - (MAXVALUE - MINVALUE) * 0.15;
    const innerMaxValue = MAXVALUE + (MAXVALUE - MINVALUE) * 0.15;

    // EXTRA DATA TO ENABLE LAYOUT CHANGES
    const LAYOUTDATA = [
      { region: 'North America', category: 'CatA', value: MINVALUE },
      { region: 'CEMEA', category: 'CatA', value: 7628909842 },
      { region: 'South America', category: 'CatA', value: 8334842966 },
      { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
      { region: 'North America', category: 'CatB', value: 7570994739 },
      { region: 'CEMEA', category: 'CatB', value: 4628909842 },
      { region: 'South America', category: 'CatB', value: 5534842966 },
      { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 }
    ];
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { disableValidation: true };
    const EXPECTEDLOCALIZATION = { ...DumbbellPlotDefaultValues.localization, skipValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [DumbbellPlot, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('dumbbell-plot');
      component.uniqueID = EXPECTEDUNIQUEID;
      component.data = EXPECTEDDATA;
      component.unitTest = true;
      component.ordinalAccessor = EXPECTEDORDINALACCESSOR;
      component.seriesAccessor = EXPECTEDSERIESACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.localization = EXPECTEDLOCALIZATION;
    });

    it('should build', () => {
      expect(new DumbbellPlot()).toBeTruthy();
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

      it('should render with minimal props[data,oridnalAccessor,seriesAccessor,valueAccessor] given', async () => {
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
            ? { [unitTestGeneric[test].prop]: DumbbellPlotDefaultValues[unitTestGeneric[test].prop] }
            : unitTestGeneric[test].prop === 'data'
            ? { data: EXPECTEDDATA }
            : unitTestGeneric[test].testProps;
          const innerTestSelector =
            unitTestGeneric[test].testSelector === 'component-name'
              ? 'dumbbell-plot'
              : unitTestGeneric[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=marker]'
              : unitTestGeneric[test].testSelector;
          it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
            unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
        }
      });
      // have to do custom data test due to how data is joined to dumbbell
      it('data: custom data on load', async () => {
        // ACT
        page.root.appendChild(component);
        await page.waitForChanges();

        // ASSERT
        const elements = page.doc.querySelectorAll('[data-testid=line]');
        let counter = 0;
        elements.forEach(element => {
          counter = counter + 2;
          const mappedCatAData = element['__data__'].values.find(o => o.category === 'CatA'); // tslint:disable-line: no-string-literal
          const mappedCatBData = element['__data__'].values.find(o => o.category === 'CatB'); // tslint:disable-line: no-string-literal
          const expectedMonthCatAData = EXPECTEDDATA.find(o => o.date === mappedCatAData.date && o.category === 'CatA');
          const expectedMonthCatBData = EXPECTEDDATA.find(o => o.date === mappedCatBData.date && o.category === 'CatB');
          expect(mappedCatAData).toEqual(expectedMonthCatAData);
          expect(mappedCatBData).toEqual(expectedMonthCatBData);
        });
        expect(counter).toEqual(24);
      });

      it('data: custom data enter on update', async () => {
        // ARRANGE
        const BEGINNINGDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1], EXPECTEDDATA[12], EXPECTEDDATA[13]];
        component.data = BEGINNINGDATA;

        // ACT RENDER
        page.root.appendChild(component);
        await page.waitForChanges();

        // ACT UPDATE
        component.data = EXPECTEDDATA;
        await page.waitForChanges();

        // ASSERT
        const elements = page.doc.querySelectorAll('[data-testid=line]');
        let counter = 0;
        elements.forEach(element => {
          counter = counter + 2;
          const mappedCatAData = element['__data__'].values.find(o => o.category === 'CatA'); // tslint:disable-line: no-string-literal
          const mappedCatBData = element['__data__'].values.find(o => o.category === 'CatB'); // tslint:disable-line: no-string-literal
          const expectedMonthCatAData = EXPECTEDDATA.find(o => o.date === mappedCatAData.date && o.category === 'CatA');
          const expectedMonthCatBData = EXPECTEDDATA.find(o => o.date === mappedCatBData.date && o.category === 'CatB');
          expect(mappedCatAData).toEqual(expectedMonthCatAData);
          expect(mappedCatBData).toEqual(expectedMonthCatBData);
        });
        expect(counter).toEqual(24);
      });

      it('data: custom data exit on update', async () => {
        // ARRANGE
        const EXITDATA = [EXPECTEDDATA[0], EXPECTEDDATA[12]];

        // ACT RENDER
        page.root.appendChild(component);
        await page.waitForChanges();

        // ACT UPDATE
        component.data = EXITDATA;
        await page.waitForChanges();

        // ASSERT
        const elements = page.doc.querySelectorAll('[data-testid=line]');
        elements.forEach((element, i) => {
          if (element['__data__'].key === 'Jan-2016') {
            const mappedCatAData = element['__data__'].values.find(o => o.category === 'CatA'); // tslint:disable-line: no-string-literal
            const mappedCatBData = element['__data__'].values.find(o => o.category === 'CatB'); // tslint:disable-line: no-string-literal
            const expectedMonthCatAData = EXPECTEDDATA.find(
              o => o.date === mappedCatAData.date && o.category === 'CatA'
            );
            const expectedMonthCatBData = EXPECTEDDATA.find(
              o => o.date === mappedCatBData.date && o.category === 'CatB'
            );
            expect(mappedCatAData).toEqual(expectedMonthCatAData);
            expect(mappedCatBData).toEqual(expectedMonthCatBData);
          } else {
            const lastTransitionKey = Object.keys(element['__transition'])[ // tslint:disable-line: no-string-literal
              Object.keys(element['__transition']).length - 1 // tslint:disable-line: no-string-literal
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
          //   testSelector: '[data-testid=bar-group]',
          //   nextTestSelector: '[data-testid=bar][data-id=bar-Apr-17]',
          //   keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13 }
          // },
          accessibility_keyboard_nav_group_shift_enter_exit: {
            name: 'keyboard nav: group - shift+enter will exit group',
            testSelector: '[data-testid=line][data-id=line-Jan-2016]',
            nextTestSelector: '[data-testid=dumbbell-group]',
            keyDownObject: { key: 'Enter', code: 'Enter', keyCode: 13, shiftKey: true },
            testProps: {
              selectorAriaLabel: 'category CatA. value 7.7b. category CatB. value 6.6b. Difference 1.1b. Dumbbell 1.',
              nextSelectorAriaLabel: 'Number of interactive dumbbells in this dumbbell plot: 12.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow: {
            name: 'keyboard nav: sibling - right arrow goes to next',
            testSelector: '[data-testid=line][data-id=line-Jan-2016]',
            nextTestSelector: '[data-testid=line][data-id=line-Feb-2016]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'category CatA. value 7.7b. category CatB. value 6.6b. Difference 1.1b. Dumbbell 1.',
              nextSelectorAriaLabel: 'category CatA. value 7.6b. category CatB. value 4.6b. Difference 3b. Dumbbell 2.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_right_arrow_loop: {
            name: 'keyboard nav: sibling - right arrow goes to first from last',
            testSelector: '[data-testid=line][data-id=line-Dec-2016]',
            nextTestSelector: '[data-testid=line][data-id=line-Jan-2016]',
            keyDownObject: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39 },
            testProps: {
              selectorAriaLabel: 'category CatA. value 9.7b. category CatB. value 5.6b. Difference 4.1b. Dumbbell 12.',
              nextSelectorAriaLabel:
                'category CatA. value 7.7b. category CatB. value 6.6b. Difference 1.1b. Dumbbell 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_sibling: {
            name: 'keyboard nav: sibling - left arrow goes to next',
            testSelector: '[data-testid=line][data-id=line-Feb-2016]',
            nextTestSelector: '[data-testid=line][data-id=line-Jan-2016]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'category CatA. value 7.6b. category CatB. value 4.6b. Difference 3b. Dumbbell 2.',
              nextSelectorAriaLabel:
                'category CatA. value 7.7b. category CatB. value 6.6b. Difference 1.1b. Dumbbell 1.',
              accessibility: { ...EXPECTEDACCESSIBILITY, includeDataKeyNames: true }
            }
          },
          accessibility_keyboard_nav_left_arrow_loop: {
            name: 'keyboard nav: sibling - left arrow loops to last from first',
            testSelector: '[data-testid=line][data-id=line-Jan-2016]',
            nextTestSelector: '[data-testid=line][data-id=line-Dec-2016]',
            keyDownObject: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37 },
            testProps: {
              selectorAriaLabel: 'CatA 7.7b. CatB 6.6b. Difference 1.1b. Dumbbell 1.',
              nextSelectorAriaLabel: 'CatA 9.7b. CatB 5.6b. Difference 4.1b. Dumbbell 12.'
            }
          }
        };
        Object.keys(unitTestAccessibility).forEach(test => {
          const tempTestProps = unitTestAccessibility[test].testDefault
            ? { [unitTestAccessibility[test].prop]: DumbbellPlotDefaultValues[unitTestAccessibility[test].prop] }
            : unitTestAccessibility[test].testProps;
          const innerTestProps = {
            ...tempTestProps,
            geometryType: 'Dumbbell',
            // we will need to udpate the below when we enable the dumbbell focus indicator test
            geometryPlacementAttributes: [],
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
              ? 'dumbbell-plot'
              : unitTestAccessibility[test].testSelector === '[data-testid=controller]'
              ? '.VCL-controller'
              : unitTestAccessibility[test].testSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].testSelector === '[data-testid=padding]'
              ? '[data-testid=padding-container]'
              : unitTestAccessibility[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=line]'
              : unitTestAccessibility[test].testSelector === '[data-testid=group]'
              ? '[data-testid=dumbbell-group]'
              : unitTestAccessibility[test].testSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].testSelector
                : '[data-testid=line][data-id=line-Jan-2016]'
              : unitTestAccessibility[test].testSelector;
          const innerNextTestSelector =
            unitTestAccessibility[test].nextTestSelector === '[data-testid=svg]'
              ? '[data-testid=root-svg]'
              : unitTestAccessibility[test].nextTestSelector === '[data-id=mark-id]'
              ? accessibilityTestMarks[test]
                ? accessibilityTestMarks[test].nextTestSelector
                : '[data-testid=line][data-id=line-Feb-2016]'
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
            test === 'accessibility_keyboard_nav_tooltip_esc_hide'
          ) {
            // for the tooltip we need to test against the data label
            it(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
              unitTestAccessibility[test].testFunc(
                component,
                page,
                innerTestProps,
                '[data-testid=dataLabel][data-id="label-Jan-2016-CatA"]',
                innerNextTestSelector
              ));
            // skipping a few tests that we have not finished adjusting for dumbbell yet.
          } else if (
            test === 'accessibility_focus_marker_style' ||
            test === 'accessibility_textures_on_by_default' ||
            test === 'accessibility_categorical_textures_created_by_default'
          ) {
            it.skip(`${unitTestAccessibility[test].prop}: ${unitTestAccessibility[test].name}`, () =>
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
        const EXPECTEDORDINALSCALE = scalePoint()
          .domain(LAYOUTDATA.map(d => d.region))
          .padding(0.5)
          .range([0, 500]);
        const EXPECTEDLINEARSCALE = scaleLinear()
          .domain([innerMinValue, innerMaxValue])
          .range([0, 500]);
        const EXPECTEDTIMESCALE = scaleTime()
          .domain([
            timeMonth.offset(new Date('2016-01-01T00:00:00.000Z'), -1),
            timeMonth.offset(new Date('2016-12-01T00:00:00.000Z'), 1)
          ])
          .range([0, 500]);

        it('should render chart horizontally when layout prop is horizontal', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.layout = 'horizontal';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(lines, async line => {
            flushTransitions(line);
            const expectedDataRecords = LAYOUTDATA.filter(o => o.region === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerX1')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerX2')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(500 - EXPECTEDORDINALSCALE(expectedDataRecords[0].region), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(500 - EXPECTEDORDINALSCALE(expectedDataRecords[1].region), 4)
            );
          });
        });

        it('should render chart vertically when layout prop is vertical', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.layout = 'vertical';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = LAYOUTDATA.filter(o => o.region === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerX1')), 4)).toEqual(
              roundTo(EXPECTEDORDINALSCALE(expectedDataRecords[0].region), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerX2')), 4)).toEqual(
              roundTo(EXPECTEDORDINALSCALE(expectedDataRecords[1].region), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(500 - EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(500 - EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });

        // removed the date from the raw data so skipping this one
        it('should render chart vertically when layout prop is horizontal and oridnal access is a date', async () => {
          const DATAWITHDATE = [
            { date: new Date('2016-01-01T00:00:00.000Z'), category: 'CatA', value: 7670994739 },
            { date: new Date('2016-02-01T00:00:00.000Z'), category: 'CatA', value: 7628909842 },
            { date: new Date('2016-03-01T00:00:00.000Z'), category: 'CatA', value: 8358837379 },
            { date: new Date('2016-04-01T00:00:00.000Z'), category: 'CatA', value: 8334842966 },
            { date: new Date('2016-05-01T00:00:00.000Z'), category: 'CatA', value: 8588600035 },
            { date: new Date('2016-06-01T00:00:00.000Z'), category: 'CatA', value: 8484192554 },
            { date: new Date('2016-07-01T00:00:00.000Z'), category: 'CatA', value: 8778636197 },
            { date: new Date('2016-08-01T00:00:00.000Z'), category: 'CatA', value: 8811163096 },
            { date: new Date('2016-09-01T00:00:00.000Z'), category: 'CatA', value: 8462148898 },
            { date: new Date('2016-10-01T00:00:00.000Z'), category: 'CatA', value: 9051933407 },
            { date: new Date('2016-11-01T00:00:00.000Z'), category: 'CatA', value: 8872849978 },
            { date: new Date('2016-12-01T00:00:00.000Z'), category: 'CatA', value: 9709829820 },
            { date: new Date('2016-01-01T00:00:00.000Z'), category: 'CatB', value: 6570994739 },
            { date: new Date('2016-02-01T00:00:00.000Z'), category: 'CatB', value: 4628909842 },
            { date: new Date('2016-03-01T00:00:00.000Z'), category: 'CatB', value: 4358837379 },
            { date: new Date('2016-04-01T00:00:00.000Z'), category: 'CatB', value: 5534842966 },
            { date: new Date('2016-05-01T00:00:00.000Z'), category: 'CatB', value: 4388600035 },
            { date: new Date('2016-06-01T00:00:00.000Z'), category: 'CatB', value: 3484192554 },
            { date: new Date('2016-07-01T00:00:00.000Z'), category: 'CatB', value: 3578636197 },
            { date: new Date('2016-08-01T00:00:00.000Z'), category: 'CatB', value: 6411163096 },
            { date: new Date('2016-09-01T00:00:00.000Z'), category: 'CatB', value: 5262148898 },
            { date: new Date('2016-10-01T00:00:00.000Z'), category: 'CatB', value: 4651933407 },
            { date: new Date('2016-11-01T00:00:00.000Z'), category: 'CatB', value: 6772849978 },
            { date: new Date('2016-12-01T00:00:00.000Z'), category: 'CatB', value: 5609829820 }
          ];
          // ARRANGE -- need to pass data with date in it for this one
          component.data = DATAWITHDATE;
          component.width = 500;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };
          component.layout = 'horizontal';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = DATAWITHDATE.filter(
              o => o.date.getTime() === new Date(line['__data__'].key).getTime()
            ); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerX1')), 4)).toEqual(
              roundTo(EXPECTEDTIMESCALE(expectedDataRecords[0].date), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerX2')), 4)).toEqual(
              roundTo(EXPECTEDTIMESCALE(expectedDataRecords[1].date), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(500 - EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(500 - EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });
      });
    });

    describe('margin & padding', () => {
      it('refer to generic results above for margin & padding tests', () => {
        expect(true).toBeTruthy();
      });
    });

    // the bbox call in d3-svg-annotations breaks due to the mockSVGElement not
    // having the bbox function available on it.
    describe('annotations', () => {
      // TODO: need to add more precise test case for annotations label and text
      it('should pass annotation prop', async () => {
        // ARRANGE
        const annotations = [
          {
            note: {},
            y: [7670994739],
            x: ['2016-01-01'],
            dy: [9709829820],
            dx: ['2016-12-01'],
            className: 'dumbbell-annotation',
            type: 'annotationLabel',
            connector: {
              type: 'curve',
              curve: 'curveLinear',
              points: [
                [['2016-02-01', '2016-01-01'], [7628909842, 7670994739]],
                [['2016-03-01', '2016-01-01'], [8358837379, 7670994739]],
                [['2016-04-01', '2016-01-01'], [8334842966, 7670994739]],
                [['2016-05-01', '2016-01-01'], [8588600035, 7670994739]],
                [['2016-06-01', '2016-01-01'], [5484192554, 7670994739]],
                [['2016-07-01', '2016-01-01'], [6778636197, 7670994739]],
                [['2016-08-01', '2016-01-01'], [8811163096, 7670994739]],
                [['2016-09-01', '2016-01-01'], [8462148898, 7670994739]],
                [['2016-10-01', '2016-01-01'], [9051933407, 7670994739]],
                [['2016-11-01', '2016-01-01'], [8872849978, 7670994739]]
              ]
            },
            color: 'categorical_blue',
            parseAsDates: ['x']
          },
          {
            note: {},
            y: [6570994739],
            x: ['2016-01-01'],
            dy: [5609829820],
            dx: ['2016-12-01'],
            className: 'dumbbell-annotation',
            type: 'annotationLabel',
            connector: {
              type: 'curve',
              curve: 'curveLinear',
              points: [
                [['2016-02-01', '2016-01-01'], [4628909842, 6570994739]],
                [['2016-03-01', '2016-01-01'], [3358837379, 6570994739]],
                [['2016-04-01', '2016-01-01'], [5534842966, 6570994739]],
                [['2016-05-01', '2016-01-01'], [4388600035, 6570994739]],
                [['2016-06-01', '2016-01-01'], [7484192554, 6570994739]],
                [['2016-07-01', '2016-01-01'], [8978636197, 6570994739]],
                [['2016-08-01', '2016-01-01'], [6411163096, 6570994739]],
                [['2016-09-01', '2016-01-01'], [5262148898, 6570994739]],
                [['2016-10-01', '2016-01-01'], [4651933407, 6570994739]],
                [['2016-11-01', '2016-01-01'], [6772849978, 6570994739]]
              ]
            },
            color: 'catecategorical_grey',
            parseAsDates: ['x']
          }
        ];
        component.annotations = annotations;

        // ACT
        page.root.append(component);
        await page.waitForChanges();

        // ASSERT
        const annotationGroup = page.doc.querySelectorAll('[data-testid=annotation-group]');
        expect(annotationGroup).toMatchSnapshot();
      });
    });

    describe('axes', () => {
      describe('minValueOverride', () => {
        const EXPECTEDLINEARSCALE = scaleLinear()
          .domain([0, innerMaxValue])
          .range([500, 0]);
        it('should baseline y axis at zero when passed on load', async () => {
          // ARRANGE
          component.minValueOverride = 0;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = EXPECTEDDATA.filter(o => o.date === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });

        it('should baseline y axis at zero when passed on update', async () => {
          // ARRANGE
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.minValueOverride = 0;
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = EXPECTEDDATA.filter(o => o.date === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });
      });

      describe('maxValueOverride', () => {
        const EXPECTEDLINEARSCALE = scaleLinear()
          .domain([innerMinValue, 20000000000])
          .range([500, 0]);
        it('should topline y axis at 20b when passed on load', async () => {
          // ARRANGE
          component.maxValueOverride = 20000000000;
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = EXPECTEDDATA.filter(o => o.date === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });

        it('should topline y axis at 20b when passed on update', async () => {
          // ARRANGE
          component.height = 500;
          component.margin = { bottom: 0, left: 0, right: 0, top: 0 };
          component.padding = { bottom: 0, left: 0, right: 0, top: 0 };

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.maxValueOverride = 20000000000;
          await page.waitForChanges();

          // ASSERT
          const lines = page.doc.querySelectorAll('[data-testid=line]');
          lines.forEach(line => {
            flushTransitions(line);
            const expectedDataRecords = EXPECTEDDATA.filter(o => o.date === line['__data__'].key); // tslint:disable-line: no-string-literal
            expect(roundTo(parseFloat(line.getAttribute('data-centerY1')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[0].value), 4)
            );
            expect(roundTo(parseFloat(line.getAttribute('data-centerY2')), 4)).toEqual(
              roundTo(EXPECTEDLINEARSCALE(expectedDataRecords[1].value), 4)
            );
          });
        });
      });

      describe('showBaselineX & showBaselineY', () => {
        it('baseline on xAxis and yAxis should not be visible by default', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=baseline-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
          expect(yAxis).toEqualAttribute('opacity', 0);
        });

        it('should render yAxis baseline and not xAxis baseline when horizontal', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';
          component.showBaselineX = true;
          component.showBaselineY = true;
          component.layout = 'horizontal';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=baseline-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis-mark]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 0);
          expect(yAxis).toEqualAttribute('opacity', 1);
        });

        it('should render xAxis baseline and not yAxis baseline when vertical on load', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';
          component.showBaselineX = true;
          component.showBaselineY = true;
          component.layout = 'vertical';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=baseline-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 1);
          expect(yAxis).toEqualAttribute('opacity', 0);
        });

        it('should render xAxis baseline and not yAxis baseline when vertical on update', async () => {
          // ARRANGE
          component.data = LAYOUTDATA;
          component.ordinalAccessor = 'region';
          component.seriesAccessor = 'category';
          component.valueAccessor = 'value';
          component.layout = 'vertical';

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.showBaselineX = true;
          component.showBaselineY = true;
          await page.waitForChanges();

          // ASSERT
          const baselineGroup = page.doc.querySelector('[data-testid=baseline-group]');
          const xAxis = baselineGroup.querySelector('[data-testid=x-axis-mark]');
          const yAxis = baselineGroup.querySelector('[data-testid=y-axis]');
          flushTransitions(xAxis);
          flushTransitions(yAxis);
          expect(xAxis).toEqualAttribute('opacity', 1);
          expect(yAxis).toEqualAttribute('opacity', 0);
        });
      });

      describe('generic axis tests', () => {
        const DATAWITHDATE = [
          { date: new Date('2016-01-01T00:00:00.000Z'), category: 'CatA', value: 7670994739 },
          { date: new Date('2016-02-01T00:00:00.000Z'), category: 'CatA', value: 7628909842 },
          { date: new Date('2016-03-01T00:00:00.000Z'), category: 'CatA', value: 8358837379 },
          { date: new Date('2016-04-01T00:00:00.000Z'), category: 'CatA', value: 8334842966 },
          { date: new Date('2016-05-01T00:00:00.000Z'), category: 'CatA', value: 8588600035 },
          { date: new Date('2016-06-01T00:00:00.000Z'), category: 'CatA', value: 8484192554 },
          { date: new Date('2016-07-01T00:00:00.000Z'), category: 'CatA', value: 8778636197 },
          { date: new Date('2016-08-01T00:00:00.000Z'), category: 'CatA', value: 8811163096 },
          { date: new Date('2016-09-01T00:00:00.000Z'), category: 'CatA', value: 8462148898 },
          { date: new Date('2016-10-01T00:00:00.000Z'), category: 'CatA', value: 9051933407 },
          { date: new Date('2016-11-01T00:00:00.000Z'), category: 'CatA', value: 8872849978 },
          { date: new Date('2016-12-01T00:00:00.000Z'), category: 'CatA', value: 9709829820 },
          { date: new Date('2016-01-01T00:00:00.000Z'), category: 'CatB', value: 6570994739 },
          { date: new Date('2016-02-01T00:00:00.000Z'), category: 'CatB', value: 4628909842 },
          { date: new Date('2016-03-01T00:00:00.000Z'), category: 'CatB', value: 4358837379 },
          { date: new Date('2016-04-01T00:00:00.000Z'), category: 'CatB', value: 5534842966 },
          { date: new Date('2016-05-01T00:00:00.000Z'), category: 'CatB', value: 4388600035 },
          { date: new Date('2016-06-01T00:00:00.000Z'), category: 'CatB', value: 3484192554 },
          { date: new Date('2016-07-01T00:00:00.000Z'), category: 'CatB', value: 3578636197 },
          { date: new Date('2016-08-01T00:00:00.000Z'), category: 'CatB', value: 6411163096 },
          { date: new Date('2016-09-01T00:00:00.000Z'), category: 'CatB', value: 5262148898 },
          { date: new Date('2016-10-01T00:00:00.000Z'), category: 'CatB', value: 4651933407 },
          { date: new Date('2016-11-01T00:00:00.000Z'), category: 'CatB', value: 6772849978 },
          { date: new Date('2016-12-01T00:00:00.000Z'), category: 'CatB', value: 5609829820 }
        ];
        Object.keys(unitTestAxis).forEach(test => {
          const monthTicks1 = [
            'Jan 16',
            'Feb 16',
            'Mar 16',
            'Apr 16',
            'May 16',
            'Jun 16',
            'Jul 16',
            'Aug 16',
            'Sep 16',
            'Oct 16',
            'Nov 16',
            'Dec 16'
          ];
          const monthTicks2 = [
            'Jan 2016',
            'Feb 2016',
            'Mar 2016',
            'Apr 2016',
            'May 2016',
            'Jun 2016',
            'Jul 2016',
            'Aug 2016',
            'Sep 2016',
            'Oct 2016',
            'Nov 2016',
            'Dec 2016'
          ];
          const numberTicks1 = ['3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b'];
          const numberTicks2 = ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];
          const expectedValues = {
            xaxis_format_default: monthTicks1,
            yaxis_format_default: numberTicks1,
            xaxis_format_load: monthTicks2,
            yaxis_format_load: numberTicks2,
            xaxis_format_update: monthTicks2,
            yaxis_format_update: numberTicks2,
            xaxis_tickInterval_load: monthTicks2,
            yaxis_tickInterval_load: numberTicks2,
            xaxis_tickInterval_update: monthTicks2,
            yaxis_tickInterval_update: numberTicks2
          };

          const innerTestProps = unitTestAxis[test].testDefault
            ? { [unitTestAxis[test].prop]: DumbbellPlotDefaultValues[unitTestAxis[test].prop] }
            : unitTestAxis[test].prop === 'xAxis.format' ||
              unitTestAxis[test].prop === 'xAxis.tickInterval' ||
              unitTestAxis[test].prop === 'xAxis.unit'
            ? { data: DATAWITHDATE }
            : unitTestAxis[test].testProps;
          const innerTestSelector =
            unitTestAxis[test].testSelector === 'component-name' ? 'dumbbell-plot' : unitTestAxis[test].testSelector;
          it(`${unitTestAxis[test].prop}: ${unitTestAxis[test].name}`, () =>
            unitTestAxis[test].testFunc(component, page, innerTestProps, innerTestSelector, expectedValues[test]));
        });
      });
    });

    describe('interaction', () => {
      const commonInteractionProps = { data: LAYOUTDATA, ordinalAccessor: 'region', seriesAccessor: 'category' };
      describe('data label based interaction tests', () => {
        const innerTestProps = commonInteractionProps;
        const innerTestSelector = '[data-testid=dataLabel][data-id="label-North America-CatA"]';
        const innerNegTestSelector = '[data-testid=dataLabel][data-id=label-CEMEA-CatA]';
        Object.keys(unitTestInteraction).forEach(test => {
          if (unitTestInteraction[test].prop === 'cursor') {
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

      /*
      describe('clickStyle with interaction keys', () => {
        const testLoad = 'interaction_clickStyle_custom_load';
        const testUpdate = 'interaction_clickStyle_custom_update';
        const innerTestSelector = '[data-testid=dataLabel][data-id="label-North America-CatA"]';
        const innerNegTestSelector = '[data-testid=dataLabel][data-id=label-CEMEA-CatB]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.comp_green,
          stroke: outlineColor(visaColors.comp_green),
          strokeWidth: '1px'
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = { ...commonInteractionProps, ...{
            clickStyle: CUSTOMCLICKSTYLE,
            hoverOpacity: EXPECTEDHOVEROPACITY,
            interactionKeys: ['category']
          } 
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

        const newInnerTestProps = { ...commonInteractionProps, ...{
            clickStyle: CUSTOMCLICKSTYLE,
            hoverOpacity: EXPECTEDHOVEROPACITY,
            interactionKeys: ['category', 'region']
          }
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=dataLabel][data-id="label-North America-CatA"]',
            '[data-testid=dataLabel][data-id=label-CEMEA-CatA]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=dataLabel][data-id="label-North America-CatA"]',
            '[data-testid=dataLabel][data-id=label-CEMEA-CatA]'
          ));
      });
      describe('hoverStyle custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=bar][data-id=bar-Apr-17]';
        const innerNegTestSelector = '[data-testid=bar][data-id=bar-Jul-17]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.comp_green,
          stroke: outlineColor(visaColors.comp_green),
          strokeWidth: '1px'
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
      */
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
      const commonInteractionProps = { data: LAYOUTDATA, ordinalAccessor: 'region', seriesAccessor: 'category' };
      describe('generic event testing', () => {
        describe('label based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              ...commonInteractionProps,
              ...{
                showTooltip: false,
                transitionEndAllSelector: '[data-testid=line]'
              }
            };
            const innerTestSelector = '[data-testid=dataLabel][data-id="label-North America-CatA"]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, LAYOUTDATA[0]));
          });
        });
      });
    });

    describe('data', () => {
      const commonInteractionProps = { data: LAYOUTDATA, ordinalAccessor: 'region', seriesAccessor: 'category' };
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
        it('should render data in ascending order of difference when sortOrder is asc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'asc';
          const EXPECTEDDATAASC = [
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'North America', category: 'CatB', value: 7570994739 },
            { region: 'South America', category: 'CatB', value: 5534842966 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATAASC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATAASC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in ascending order of focus marker when sortOrder is focusAsc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'focusAsc';
          const EXPECTEDDATAASC = [
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'North America', category: 'CatB', value: 7570994739 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'South America', category: 'CatB', value: 5534842966 },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          component.focusMarker = { key: 'CatA', sizeFromBar: 0.75 };
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATAASC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATAASC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in ascending order of absolute difference when sortOrder is absoluteDiffAsc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'absoluteDiffAsc';
          const EXPECTEDDATAASC = [
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'South America', category: 'CatB', value: 5534842966 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'North America', category: 'CatB', value: 7570994739 },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATAASC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATAASC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in descending order of difference when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'desc';
          const EXPECTEDDATADESC = [
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'South America', category: 'CatB', value: 5534842966 },
            { region: 'North America', category: 'CatB', value: 7570994739 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATADESC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATADESC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in descending order of focus marker when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'focusDesc';
          const EXPECTEDDATADESC = [
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 },
            { region: 'South America', category: 'CatB', value: 5534842966 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'North America', category: 'CatB', value: 7570994739 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          component.focusMarker = { key: 'CatA', sizeFromBar: 0.75 };
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATADESC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATADESC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in descending order of absolute difference when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDSORTORDER = 'absoluteDiffDesc';
          const EXPECTEDDATADESC = [
            { region: 'Asia and Pacific', category: 'CatA', value: MAXVALUE },
            { region: 'North America', category: 'CatA', value: MINVALUE },
            { region: 'CEMEA', category: 'CatA', value: 7628909842 },
            { region: 'South America', category: 'CatA', value: 8334842966 },
            { region: 'Asia and Pacific', category: 'CatB', value: 4388600035 },
            { region: 'North America', category: 'CatB', value: 7570994739 },
            { region: 'CEMEA', category: 'CatB', value: 4628909842 },
            { region: 'South America', category: 'CatB', value: 5534842966 }
          ];
          component.sortOrder = EXPECTEDSORTORDER;
          component.focusMarker = { key: 'CatA', sizeFromBar: 0.75 };
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(EXPECTEDDATADESC[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(EXPECTEDDATADESC[i + 4]); // tslint:disable-line: no-string-literal
          });
        });

        it('should render data in default order when sortOrder is default', async () => {
          Object.keys(commonInteractionProps).forEach(commonProp => {
            component[commonProp] = commonInteractionProps[commonProp];
          });

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach((element, i) => {
            expect(element['__data__'].values[0]).toMatchObject(LAYOUTDATA[i]); // tslint:disable-line: no-string-literal
            expect(element['__data__'].values[1]).toMatchObject(LAYOUTDATA[i + 4]); // tslint:disable-line: no-string-literal
          });
        });
      });
    });
    describe('bar', () => {
      // const commonInteractionProps = { data: LAYOUTDATA, ordinalAccessor: 'region', seriesAccessor: 'category' };
      describe('barStyle.colorRule', () => {
        const EXPECTEDCOLORS = getColors('categorical', 3);
        it('bar color should be default on load', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDCOLORS[2]));
            expect(element).toEqualAttribute('fill', EXPECTEDCOLORS[2]);
          });
        });
        it('bar color should be greaterValue if set on load', async () => {
          // ARRANGE
          component.barStyle = { width: 1, opacity: 1, colorRule: 'greaterValue' };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDCOLORS[0]));
            expect(element).toEqualAttribute('fill', EXPECTEDCOLORS[0]);
          });
        });
        it('bar color should be focus if set on load', async () => {
          // ARRANGE
          component.focusMarker = { key: 'CatB', sizeFromBar: 4 };
          component.barStyle = { width: 1, opacity: 1, colorRule: 'focus' };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDCOLORS[1]));
            expect(element).toEqualAttribute('fill', EXPECTEDCOLORS[1]);
          });
        });
        it('bar color should be greaterValue if set on update', async () => {
          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.barStyle = { width: 1, opacity: 1, colorRule: 'greaterValue' };
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(elements, async element => {
            flushTransitions(element);
            await page.waitForChanges();
            expect(element).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDCOLORS[0]));
            expect(element).toEqualAttribute('fill', EXPECTEDCOLORS[0]);
          });
        });
        it('bar color should be focus if set on update', async () => {
          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.focusMarker = { key: 'CatA', sizeFromBar: 4 };
          component.barStyle = { width: 1, opacity: 1, colorRule: 'focus' };
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(elements, async element => {
            flushTransitions(element);
            await page.waitForChanges();
            expect(element).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDCOLORS[0]));
            expect(element).toEqualAttribute('fill', EXPECTEDCOLORS[0]);
          });
        });
      });
      describe('barStyle.opacity', () => {
        it('bar stroke opacity should default to 1 on load', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('stroke-opacity', 1);
          });
        });
        it('bar stroke opacity set to 0.5 on load', async () => {
          // ARRANGE
          component.barStyle = { width: 1, opacity: 0.5, colorRule: 'default' };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('stroke-opacity', 0.5);
          });
        });
        it('bar stroke opacity set to 0.5 on update', async () => {
          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.barStyle = { width: 1, opacity: 0.25, colorRule: 'default' };
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(elements, async element => {
            flushTransitions(element);
            await page.waitForChanges();
            expect(element).toEqualAttribute('stroke-opacity', 0.25);
          });
        });
      });
      describe('barStyle.width', () => {
        it('bar width should default to 1 on load', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('data-barSize', 1);
          });
        });
        it('bar width set to 5 on load', async () => {
          // ARRANGE
          component.barStyle = { width: 5, opacity: 1, colorRule: 'default' };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          elements.forEach(element => {
            expect(element).toEqualAttribute('data-barSize', 5);
          });
        });
        it('bar width set to 2.5 on update', async () => {
          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.barStyle = { width: 2.5, opacity: 1, colorRule: 'default' };
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=line]');
          await asyncForEach(elements, async element => {
            flushTransitions(element);
            await page.waitForChanges();
            expect(element).toEqualAttribute('data-barSize', 2.5);
          });
        });
      });
    });
    describe('labels', () => {
      const commonInteractionProps = { data: LAYOUTDATA, ordinalAccessor: 'region', seriesAccessor: 'category' };
      describe('tooltip', () => {
        const tooltip1 = {
          tooltipLabel: {
            format: [],
            labelAccessor: ['region'],
            labelTitle: ['Testing123']
          }
        };
        const tooltip2 = {
          tooltipLabel: {
            format: ['', '$0[.][0]a'],
            labelAccessor: ['region', 'value'],
            labelTitle: ['Testing123', 'Count']
          }
        };
        describe('generic tooltip tests', () => {
          Object.keys(unitTestTooltip).forEach(test => {
            const innerTestSelector = '[data-testid=dataLabel][data-id="label-North America-CatA"]';
            const dataKeyTestSelector = '[data-testid=line][data-id=line-CEMEA]';
            const innerTooltipProps = {
              tooltip_tooltipLabel_custom_load: tooltip1,
              tooltip_tooltipLabel_custom_update: tooltip1,
              tooltip_tooltipLabel_custom_format_load: tooltip2,
              tooltip_tooltipLabel_custom_format_update: tooltip2
            };
            const innerTooltipContent = {
              tooltip_tooltipLabel_default: '<p style="margin: 0;"><b>North America</b><br/>CatA:<b>3.5b</b></p>',
              tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>North America</b><br></p>',
              tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>North America</b><br></p>',
              tooltip_tooltipLabel_custom_format_load:
                '<p style="margin: 0;">Testing123:<b>North America</b><br>Count:<b>$3.5b</b><br></p>',
              tooltip_tooltipLabel_custom_format_update:
                '<p style="margin: 0;">Testing123:<b>North America</b><br>Count:<b>$3.5b</b><br></p>',
              dataKeyNames_custom_on_load:
                '<p style="margin: 0;"><b>CEMEA</b><br>Difference:<b>3b<br></b>CatA:<b>7.6b</b><br>CatB:<b>4.6b</b></p>',
              dataKeyNames_custom_on_update:
                '<p style="margin: 0;"><b>CEMEA</b><br>Difference:<b>3b<br></b>CatA:<b>7.6b</b><br>CatB:<b>4.6b</b></p>'
            };
            const innerAriaContent = {
              dataKeyNames_custom_on_load:
                'Test Category CatA. value 7.6b. Test Category CatB. value 4.6b. Difference 3b. Dumbbell 2.',
              dataKeyNames_custom_on_update:
                'Test Category CatA. value 7.6b. Test Category CatB. value 4.6b. Difference 3b. Dumbbell 2.'
            };
            const innerTestProps = {
              ...commonInteractionProps,
              ...unitTestTooltip[test].testProps,
              ...innerTooltipProps[test]
            };
            const customDataKeyNames = { dataKeyNames: { category: 'Test Category' } };
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
                  dataKeyTestSelector,
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

            const dataLabelWrapper = page.doc.querySelector('[data-testid=dataLabel-wrapper]');
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            expect(dataLabelWrapper).toEqualAttribute('opacity', 1);
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
          it('should not render the bar data labels if visible is false on load', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            component.dataLabel = {
              visible: false,
              labelAccessor: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabelWrapper = page.doc.querySelector('[data-testid=dataLabel-wrapper]');
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            expect(dataLabelWrapper).toEqualAttribute('opacity', 0);
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
          it('should not render the bar data labels if visible is false on update', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: false,
              labelAccessor: ''
            };
            await page.waitForChanges();

            const dataLabelWrapper = page.doc.querySelector('[data-testid=dataLabel-wrapper]');
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
            expect(dataLabelWrapper).toEqualAttribute('opacity', 0);
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
        });
        describe('labelAccessor & format', () => {
          it('should default to the value accessor if default', async () => {
            // ARRANGE
            component.data = LAYOUTDATA;
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel][data-id="label-North America-CatA"]');
            const expectedLabelValue = formatStats(LAYOUTDATA[0].value, '0[.][0]a'); // tslint:disable-line: no-string-literal
            expect(dataLabel).toEqualText(expectedLabelValue);
          });
          it('should render specific field and format if labelAccessor is passed on load', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            LAYOUTDATA.map(rec => (rec['random'] = Math.random())); // tslint:disable-line: no-string-literal
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.dataLabel = {
              visible: true,
              labelAccessor: 'random',
              format: '0[.][0][0]%',
              position: 'ends'
            };
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel][data-id="label-North America-CatA"]');
            const expectedLabelValue = formatStats(LAYOUTDATA[0]['random'], '0[.][0][0]%'); // tslint:disable-line: no-string-literal
            expect(dataLabel).toEqualText(expectedLabelValue);
          });
          it('should render specific field and format if labelAccessor is passed on update', async () => {
            // ARRANGE // equal earth is the default this should match without setting prop
            LAYOUTDATA.map(rec => (rec['random'] = Math.random())); // tslint:disable-line: no-string-literal
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'random',
              format: '0[.][0][0]%',
              position: 'ends'
            };
            await page.waitForChanges();

            // ASSERT
            const dataLabel = page.doc.querySelector('[data-testid=dataLabel][data-id="label-North America-CatA"]');
            const expectedLabelValue = formatStats(LAYOUTDATA[0]['random'], '0[.][0][0]%'); // tslint:disable-line: no-string-literal
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualText(expectedLabelValue);
          });
        });
        describe('placement - vertical', () => {
          it('should place labels on ends of dumbbells by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            expect(parseFloat(label.getAttribute('y'))).toBeLessThanOrEqual(
              parseFloat(line.getAttribute('data-centerY1'))
            );
          });
          it('should place labels on side of bars if passed left or right on load', async () => {
            // ARRANGE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'right'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('y'))).toEqual(parseFloat(line.getAttribute('data-centerY1')));
          });
          it('should place labels on side of bars if passed left or right on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'left'
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('y'))).toEqual(parseFloat(line.getAttribute('data-centerY1')));
          });
        });
        describe('placement - horizontal', () => {
          it('should place labels on ends of dumbbells by default', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            expect(parseFloat(label.getAttribute('x'))).toBeLessThanOrEqual(
              parseFloat(line.getAttribute('data-centerX1'))
            );
          });
          it('should place labels on side of bars if passed top or bottom on load', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'top'
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toEqual(parseFloat(line.getAttribute('data-centerX1')));
          });
          it('should place labels on side of bars if passed top or bottom on update', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.dataLabel = {
              visible: true,
              labelAccessor: 'value',
              format: '$0[.][0]a',
              placement: 'bottom'
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=dataLabel]');
            const line = page.doc.querySelector('[data-testid=line]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            expect(parseFloat(label.getAttribute('x'))).toEqual(parseFloat(line.getAttribute('data-centerX1')) + 4);
          });
        });
      });

      describe('differenceLabel', () => {
        describe('visible', () => {
          it('should not render differenceLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=difference-label]');
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
          it('should render differenceLabel when passed on load', async () => {
            // ARRANGE
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'left',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=difference-label]');
            flushTransitions(dataLabel);

            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
          it('should render differenceLabel when passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'left',
              visible: true
            };
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=difference-label]');
            expect(dataLabel).toEqualAttribute('opacity', 1);
          });
        });
        describe('calculation & format', () => {
          it('should render calculation difference and default format by default (though hidden)', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-id="difference-label-North America"]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualText(formatStats(LAYOUTDATA[0].value - LAYOUTDATA[4].value, '0[.][0][0]a'));
          });
          it('should render calculation middle and custom format on load (though hidden)', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;
            component.differenceLabel = {
              calculation: 'middle',
              format: '$0[.][0]a',
              placement: 'left',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-id="difference-label-North America"]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualText(
              formatStats(LAYOUTDATA[0].value - (LAYOUTDATA[0].value - LAYOUTDATA[4].value) / 2, '$0[.][0]a')
            );
          });
          it('should render calculation middle and custom format on update (though hidden)', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.differenceLabel = {
              calculation: 'middle',
              format: '$0[.][0]a',
              placement: 'left',
              visible: true
            };
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-id="difference-label-North America"]');
            flushTransitions(dataLabel);
            await page.waitForChanges();
            expect(dataLabel).toEqualText(
              formatStats(LAYOUTDATA[0].value - (LAYOUTDATA[0].value - LAYOUTDATA[4].value) / 2, '$0[.][0]a')
            );
          });
        });
        describe('placement - vertical', () => {
          it('should place difference labels on left of dumbbells by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-Jan-2016"]');
            const line = page.doc.querySelector('[data-id="line-Jan-2016"]');
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerY1')) +
                (parseFloat(line.getAttribute('data-centerY2')) - parseFloat(line.getAttribute('data-centerY1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('y')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('x')) + parseFloat(label.getAttribute('dx'))).toBeLessThan(
              parseFloat(line.getAttribute('data-centerX1'))
            );
          });
          it('should place labels on side of bars if passed left or right on load', async () => {
            // ARRANGE
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'right',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-Jan-2016"]');
            const line = page.doc.querySelector('[data-id="line-Jan-2016"]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerY1')) +
                (parseFloat(line.getAttribute('data-centerY2')) - parseFloat(line.getAttribute('data-centerY1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('y')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('x')) + parseFloat(label.getAttribute('dx'))).toBeGreaterThan(
              parseFloat(line.getAttribute('data-centerX1'))
            );
          });
          it('should place labels on side of bars if passed left or right on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'right',
              visible: true
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-Jan-2016"]');
            const line = page.doc.querySelector('[data-id="line-Jan-2016"]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerY1')) +
                (parseFloat(line.getAttribute('data-centerY2')) - parseFloat(line.getAttribute('data-centerY1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('y')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('x')) + parseFloat(label.getAttribute('dx'))).toBeGreaterThan(
              parseFloat(line.getAttribute('data-centerX1'))
            );
          });
        });
        describe('placement - horizontal', () => {
          it('should place difference labels on tops of dumbbells by default', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-North America"]');
            const line = page.doc.querySelector('[data-id="line-North America"]');
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerX1')) +
                (parseFloat(line.getAttribute('data-centerX2')) - parseFloat(line.getAttribute('data-centerX1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('x')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('y')) + parseFloat(label.getAttribute('dy'))).toBeLessThan(
              parseFloat(line.getAttribute('data-centerY1'))
            );
          });
          it('should place difference labels on bottoms of dumbbells on load', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'bottom',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-North America"]');
            const line = page.doc.querySelector('[data-id="line-North America"]');
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerX1')) +
                (parseFloat(line.getAttribute('data-centerX2')) - parseFloat(line.getAttribute('data-centerX1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('x')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('y')) + parseFloat(label.getAttribute('dy'))).toBeGreaterThan(
              parseFloat(line.getAttribute('data-centerY1'))
            );
          });
          it('should place difference labels on bottoms of dumbbells on update', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.differenceLabel = {
              calculation: 'difference',
              format: '0[.][0][0]a',
              placement: 'bottom',
              visible: true
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-id="difference-label-North America"]');
            const line = page.doc.querySelector('[data-id="line-North America"]');
            flushTransitions(label);
            flushTransitions(line);
            await page.waitForChanges();
            const labelPlacement = roundTo(
              parseFloat(line.getAttribute('data-centerX1')) +
                (parseFloat(line.getAttribute('data-centerX2')) - parseFloat(line.getAttribute('data-centerX1'))) / 2,
              4
            );
            expect(roundTo(parseFloat(label.getAttribute('x')), 4)).toEqual(labelPlacement);
            expect(parseFloat(label.getAttribute('y')) + parseFloat(label.getAttribute('dy'))).toBeGreaterThan(
              parseFloat(line.getAttribute('data-centerY1'))
            );
          });
        });
      });
      describe('seriesLabel', () => {
        describe('visible', () => {
          it('should render seriesLabel by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            const dataLabel = page.doc.querySelector('[data-testid=series-label]');
            flushTransitions(dataLabel);
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

            const dataLabel = page.doc.querySelector('[data-testid=series-label]');
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

            const dataLabel = page.doc.querySelector('[data-testid=series-label]');
            flushTransitions(dataLabel);
            expect(dataLabel).toEqualAttribute('opacity', 0);
          });
        });

        describe('placement - vertical', () => {
          it('should place series labels on right of chart by default', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            const lastLine = page.doc.querySelector('[data-id="line-Asia and Pacific"]');
            const innerPaddedWidth =
              component.width -
              component.margin.left -
              component.margin.right -
              component.padding.left -
              component.padding.right;

            flushTransitions(label);
            flushTransitions(lastLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', lastLine.getAttribute('data-centerY1'));
            expect(label).toEqualAttribute('x', innerPaddedWidth);
          });
          it('should place series labels on left of chart on load', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;
            component.seriesLabel = {
              visible: true,
              placement: 'left',
              label: []
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            const firstLine = page.doc.querySelector('[data-id="line-North America"]');

            flushTransitions(label);
            flushTransitions(firstLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', firstLine.getAttribute('data-centerY1'));
            expect(label).toEqualAttribute('x', 0);
          });

          it('should place series labels on left of chart on update', async () => {
            // ARRANGE
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

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
            const label = page.doc.querySelector('[data-testid=series-label]');
            const firstLine = page.doc.querySelector('[data-id="line-North America"]');

            flushTransitions(label);
            flushTransitions(firstLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('y', firstLine.getAttribute('data-centerY1'));
            expect(label).toEqualAttribute('x', 0);
          });
        });
        describe('placement - horizontal', () => {
          it('should place series labels on top of chart by default', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            const lastLine = page.doc.querySelector('[data-id="line-Asia and Pacific"]');

            flushTransitions(label);
            flushTransitions(lastLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('x', lastLine.getAttribute('data-centerX1'));
            expect(label).toEqualAttribute('y', 0);
          });
          it('should place series labels on bottom of chart on load', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;
            component.seriesLabel = {
              visible: true,
              placement: 'bottom',
              label: []
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            const firstLine = page.doc.querySelector('[data-id="line-North America"]');
            const innerPaddedHeight =
              component.height -
              component.margin.top -
              component.margin.bottom -
              component.padding.top -
              component.padding.bottom;

            flushTransitions(label);
            flushTransitions(firstLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('x', firstLine.getAttribute('data-centerX1'));
            expect(label).toEqualAttribute('y', innerPaddedHeight);
          });

          it('should place series labels on bottom of chart on update', async () => {
            // ARRANGE
            component.layout = 'horizontal';
            component.ordinalAccessor = 'region';
            component.seriesAccessor = 'category';
            component.valueAccessor = 'value';
            component.data = LAYOUTDATA;

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.seriesLabel = {
              visible: true,
              placement: 'bottom',
              label: []
            };
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            const firstLine = page.doc.querySelector('[data-id="line-North America"]');
            const innerPaddedHeight =
              component.height -
              component.margin.top -
              component.margin.bottom -
              component.padding.top -
              component.padding.bottom;

            flushTransitions(label);
            flushTransitions(firstLine);
            await page.waitForChanges();

            expect(label).toEqualAttribute('x', firstLine.getAttribute('data-centerX1'));
            expect(label).toEqualAttribute('y', innerPaddedHeight);
          });
        });
        describe('label', () => {
          it('should use values of seriesAccessor as label by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const label = page.doc.querySelector('[data-testid=series-label]');
            expect(label).toEqualText('CatA');
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
            const label = page.doc.querySelector('[data-testid=series-label]');
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
            const label = page.doc.querySelector('[data-testid=series-label]');
            flushTransitions(label);
            await page.waitForChanges();
            expect(label).toEqualText('One');
          });
        });
      });

      describe('legend', () => {
        describe('visible', () => {
          it('by default the legend should not render', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendG = legendSVG.querySelector('g').querySelector('g');
            const legendContainer = legendSVG.parentNode;
            expect(legendContainer.getAttribute('style')).toEqual('display: none;');
            expect(legendContainer).toHaveClass('dumbbell-legend');
            expect(legendSVG).toEqualAttribute('opacity', 0);
            expect(legendG).toHaveClass('legend');
            expect(legendG).toHaveClass('bar');
          });
          it('should render, and be visible if visible is passed', async () => {
            component.legend = {
              visible: true,
              interactive: false,
              format: '',
              labels: ''
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
            const legendG = legendSVG.querySelector('g').querySelectorAll('g');
            const legendContainer = legendSVG.parentNode;
            expect(legendContainer.getAttribute('style')).toEqual('display: block;');
            expect(legendSVG).toEqualAttribute('opacity', 1);
            expect(legendG.length).toEqual(2);
          });
        });
        describe('interactive', () => {
          it('should not be interactive by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendG = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelector('g');
            expect(legendG['__on']).toBeUndefined(); // tslint:disable-line: no-string-literal
          });
          it('should be interactive when interactive prop is true and interaction keys is series accessor on load', async () => {
            component.interactionKeys = ['category'];
            component.cursor = 'pointer';
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
            const legendG = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelector('g');
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
            expect(legendG.getAttribute('style')).toEqual('cursor: pointer;');
          });
          it('should be interactive when interactive prop is true and interaction keys is series accessor on update', async () => {
            // ARRANGE
            component.cursor = 'pointer';
            component.interactionKeys = ['category'];

            // ACT RENDER
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
            const legendG = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelector('g');
            flushTransitions(legendG);
            await page.waitForChanges();
            expect(legendG['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
            expect(legendG.getAttribute('style')).toEqual('cursor: pointer;');
          });
          it('should be interactive when interactive prop is true on load and interaction keys is series accessor on update', async () => {
            // ARRANGE
            component.cursor = 'pointer';
            component.legend = {
              visible: true,
              interactive: true,
              format: '',
              labels: ''
            };

            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT ONE - SHOULD NOT BE INTERACTIVE DUE TO LACK OF INTERACTION KEYS
            const legendGLoad = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelector('g');
            expect(legendGLoad['__on']).toBeUndefined(); // tslint:disable-line: no-string-literal
            expect(legendGLoad.getAttribute('style')).toBeNull();

            // ACT UPDATE
            component.interactionKeys = ['category'];
            await page.waitForChanges();

            // ASSERT TWO - SHOULD BE INTERACTIVE AFTER SPECIFYING INTERACTION KEYS
            const legendGUpdate = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelector('g');
            flushTransitions(legendGUpdate);
            await page.waitForChanges();
            expect(legendGUpdate['__on'].length).toEqual(3); // tslint:disable-line: no-string-literal
            expect(legendGUpdate.getAttribute('style')).toEqual('cursor: pointer;');
          });
        });
        describe('labels', () => {
          it('should be equal to data values by default', async () => {
            // ARRANGE
            const EXPECTEDLABELS = ['CatA', 'CatB'];

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendGs = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelectorAll('g');
            await asyncForEach(legendGs, async (legendG, i) => {
              const legendGText = legendG.querySelector('text');
              flushTransitions(legendGText);
              await page.waitForChanges();
              expect(legendGText).toEqualText(EXPECTEDLABELS[i]);
            });
          });
          it('should have custom labels when passed as prop', async () => {
            const EXPECTEDLABELS = ['Cat', 'Dog'];
            component.legend = {
              visible: true,
              interactive: false,
              labels: EXPECTEDLABELS
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const legendGs = page.doc
              .querySelector('[data-testid=legend-container]')
              .querySelector('g')
              .querySelectorAll('g');
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

    describe('markers', () => {
      const dotMult = 1;
      const strokeMult = 2;
      const arrowMult = 1;
      const markerAdj = 0.3125;
      const arrowD = 'M 0.3125 5.15625 L 10.3125 0.3125 L 10.3125 10.3125 z'; // 'M 0 5 L 10 0 L 10 10 z';
      const strokeD = 'M 4.5 0.15625 L 4.5 10.15625 L 6 10.15625 L 6 0.15625 z'; // 'M 4.5 1 L 4.5 9 L 6 9 L 6 1 z';
      const circleR = 5;

      describe('marker', () => {
        describe('visible', () => {
          it('marker should be visible by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker).toEqualAttribute('opacity', 1);
            });
          });
          it('marker should not be visible when false is passed on load', async () => {
            component.marker = {
              sizeFromBar: 8,
              type: 'dot',
              visible: false
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker).toEqualAttribute('opacity', 0);
            });
          });
          it('marker should not be visible when false is passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.marker = {
              sizeFromBar: 8,
              type: 'dot',
              visible: false
            };
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker).toEqualAttribute('opacity', 0);
            });
          });
        });
        // the new (v5) logic for creating/sizing markers has not been updated here.
        describe.skip('type', () => {
          it('marker type should be dot by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            const markerParent = markerGroup[0].parentNode;
            expect(markerParent).toHaveClass('dotmarkers');
            markerGroup.forEach(marker => {
              expect(marker).toHaveClass('marker-dot');
              const markerChild = marker.querySelector('circle');
              expect(markerChild).toEqualAttribute('cx', circleR + markerAdj);
              expect(markerChild).toEqualAttribute('cy', circleR + markerAdj);
              expect(markerChild).toEqualAttribute('r', circleR);
            });
          });
          it('marker type should be arrow if passed on load', async () => {
            // ARRANGE
            component.marker = {
              sizeFromBar: 8,
              type: 'arrow',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            const markerParent = markerGroup[0].parentNode;
            expect(markerParent).toHaveClass('arrowmarkers');
            markerGroup.forEach((marker, i) => {
              expect(marker).toHaveClass('marker-arrow');
              const markerChild = marker.querySelector('path');
              expect(markerChild).toEqualAttribute('d', i % 2 === 0 ? arrowD : strokeD);
            });
          });
          it('marker type should be stroke if passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.marker = {
              sizeFromBar: 8,
              type: 'stroke',
              visible: true
            };
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            const markerParent = markerGroup[0].parentNode;
            expect(markerParent).toHaveClass('strokemarkers');
            markerGroup.forEach(marker => {
              expect(marker).toHaveClass('marker-stroke');
              const markerChild = marker.querySelector('path');
              expect(markerChild).toEqualAttribute('d', strokeD);
            });
          });
        });
        describe.skip('sizeFromBar', () => {
          it('marker sizeFromBar should be 8 by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker).toEqualAttribute('markerWidth', 8 * dotMult * 2);
              expect(marker).toEqualAttribute('markerHeight', 8 * dotMult * 2);
            });
          });
          it('marker sizeFromBar should be 18 when passed on load', async () => {
            // ARRANGE
            component.marker = {
              sizeFromBar: 18,
              type: 'stroke',
              visible: true
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker).toEqualAttribute('markerWidth', 18 * strokeMult * 2);
              expect(marker).toEqualAttribute('markerHeight', 18 * strokeMult * 2);
            });
          });
          it('marker sizeFromBar should be 10 when passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.marker = {
              sizeFromBar: 10,
              type: 'arrow',
              visible: true
            };
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach((marker, i) => {
              expect(marker).toEqualAttribute('markerWidth', 10 * (i % 2 === 0 ? arrowMult : strokeMult) * 2);
              expect(marker).toEqualAttribute('markerHeight', 10 * (i % 2 === 0 ? arrowMult : strokeMult) * 2);
            });
          });
        });
      });

      describe('focusMarker', () => {
        describe('key', () => {
          it('focusMarker key should be empty by default', async () => {
            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              expect(marker['__data__'].focus).toEqual(false); // tslint:disable-line: no-string-literal
            });
          });
          it('focusMarker key should be applied if valid and passed on load', async () => {
            component.focusMarker = {
              key: 'CatA',
              sizeFromBar: 12
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach((marker, i) => {
              expect(marker['__data__'].focus).toEqual(i % 2 === 0); // tslint:disable-line: no-string-literal
            });
          });
          it('focusMarker key should be applied if valid and passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.focusMarker = {
              key: 'CatB',
              sizeFromBar: 12
            };
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach((marker, i) => {
              expect(marker['__data__'].focus).toEqual(i % 2 === 1); // tslint:disable-line: no-string-literal
            });
          });
        });
        // the new (v5) logic for creating/sizing markers has not been updated here.
        describe.skip('sizeFromBar', () => {
          it('focusMarker sizeFromBar should be 12 (default) when focus marker is passed on load', async () => {
            component.focusMarker = {
              key: 'CatB',
              sizeFromBar: 12
            };

            // ACT
            page.root.appendChild(component);
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach(marker => {
              if (marker['__data__'].focus) {
                // tslint:disable-line: no-string-literal
                expect(marker).toEqualAttribute('markerWidth', 12 * dotMult * 2);
                expect(marker).toEqualAttribute('markerHeight', 12 * dotMult * 2);
              } else {
                expect(marker).toEqualAttribute('markerWidth', 8 * dotMult * 2);
                expect(marker).toEqualAttribute('markerHeight', 8 * dotMult * 2);
              }
            });
          });
          it('focusMarker sizeFromBar should be 15 when passed on update', async () => {
            // ACT RENDER
            page.root.appendChild(component);
            await page.waitForChanges();

            // ACT UPDATE
            component.marker = {
              sizeFromBar: 8,
              type: 'arrow',
              visible: true
            };
            component.focusMarker = {
              key: 'CatA',
              sizeFromBar: 15
            };
            await page.waitForChanges();

            // ASSERT
            const markerGroup = page.doc.querySelectorAll('[data-testid=marker]');
            markerGroup.forEach((marker, i) => {
              if (marker['__data__'].focus) {
                // tslint:disable-line: no-string-literal
                expect(marker).toEqualAttribute('markerWidth', 15 * arrowMult * 2);
                expect(marker).toEqualAttribute('markerHeight', 15 * arrowMult * 2);
              } else {
                expect(marker).toEqualAttribute('markerWidth', 8 * strokeMult * 2);
                expect(marker).toEqualAttribute('markerHeight', 8 * strokeMult * 2);
              }
            });
          });
        });
      });
    });

    describe('reference line', () => {
      const referenceLines = [
        {
          label: 'Market',
          labelPlacementHorizontal: 'right',
          labelPlacementVertical: 'bottom',
          value: 7500000000
        }
      ];
      const referenceStyle = {
        color: 'supp_pink',
        dashed: '',
        opacity: 0.65,
        strokeWidth: '1px'
      };
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
        const referenceLine = page.doc.querySelector('[data-testid=reference-line]');
        expect(referenceLine).toMatchSnapshot();
      });
    });

    describe('style', () => {
      // const checkRGB = element => element.getAttribute('fill').substr(0, 3) === 'rgb';
      describe('colorPalette', () => {
        it('should render categorical palette by default', async () => {
          const EXPECTEDFILLCOLORS = getColors('categorical', 3);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          const line = page.doc.querySelector('[data-testid=line]');
          const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          const seriesLabels = page.doc.querySelectorAll('[data-testid=series-label]');
          const diffLabels = page.doc.querySelector('[data-testid=difference-label]');
          expect(markers[0]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[0]);
          expect(markers[1]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[1]);
          expect(labels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(labels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(seriesLabels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(seriesLabels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(diffLabels).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[2], '#ffffff', 4.5));
          expect(line).toEqualAttribute('stroke', getContrastingStroke(EXPECTEDFILLCOLORS[2]));
        });
        it('should load diverging red to green when colorPalette is diverging_RtoG', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoG';
          component.colorPalette = EXPECTEDCOLORPALETTE;
          const EXPECTEDFILLCOLORS = getColors(EXPECTEDCOLORPALETTE, 3);

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          const line = page.doc.querySelector('[data-testid=line]');
          const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          const seriesLabels = page.doc.querySelectorAll('[data-testid=series-label]');
          const diffLabels = page.doc.querySelector('[data-testid=difference-label]');
          expect(markers[0]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[0]);
          expect(markers[1]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[1]);
          expect(labels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(labels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(seriesLabels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(seriesLabels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(diffLabels).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[2], '#ffffff', 4.5));
          expect(line).toEqualAttribute('stroke', EXPECTEDFILLCOLORS[2]);
        });
        it('should update to sequential supplement Pink when colorPalette is sequential_suppPink', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_suppPink';
          const EXPECTEDFILLCOLORS = getColors(EXPECTEDCOLORPALETTE, 3);
          // component.data = EXPECTEDDATALARGE;

          // ACT LOAD
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colorPalette = EXPECTEDCOLORPALETTE;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          const line = page.doc.querySelector('[data-testid=line]');
          const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          const seriesLabels = page.doc.querySelectorAll('[data-testid=series-label]');
          const diffLabels = page.doc.querySelector('[data-testid=difference-label]');
          flushTransitions(labels[0]);
          flushTransitions(labels[1]);
          flushTransitions(seriesLabels[0]);
          flushTransitions(seriesLabels[1]);
          flushTransitions(diffLabels);
          await page.waitForChanges();

          expect(markers[0]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[0]);
          expect(markers[1]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[1]);
          expect(labels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(labels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(seriesLabels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(seriesLabels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(diffLabels).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[2], '#ffffff', 4.5));
          expect(line).toEqualAttribute('stroke', EXPECTEDFILLCOLORS[2]);
        });
      });

      describe('colors', () => {
        it('should render colors instead of palette when passed on load', async () => {
          const colors = ['#829e46', '#796aaf', '#7a6763'];
          const EXPECTEDFILLCOLORS = colors;
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          const line = page.doc.querySelector('[data-testid=line]');
          const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          const seriesLabels = page.doc.querySelectorAll('[data-testid=series-label]');
          const diffLabels = page.doc.querySelector('[data-testid=difference-label]');
          expect(markers[0]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[0]);
          expect(markers[1]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[1]);
          expect(labels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(labels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(seriesLabels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(seriesLabels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(diffLabels).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[2], '#ffffff', 4.5));
          expect(line).toEqualAttribute('stroke', EXPECTEDFILLCOLORS[2]);
        });
        it('should render colors instead of palette when passed on update', async () => {
          const colors = ['#829e46', '#796aaf', '#7a6763']; // ["#829e46","#7a6763","#796aaf"]
          const EXPECTEDFILLCOLORS = colors;

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.colors = colors;
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          const line = page.doc.querySelector('[data-testid=line]');
          const labels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          const seriesLabels = page.doc.querySelectorAll('[data-testid=series-label]');
          const diffLabels = page.doc.querySelector('[data-testid=difference-label]');
          flushTransitions(labels[0]);
          flushTransitions(labels[1]);
          flushTransitions(seriesLabels[0]);
          flushTransitions(seriesLabels[1]);
          flushTransitions(diffLabels);
          await page.waitForChanges();

          expect(markers[0]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[0]);
          expect(markers[1]).toEqualAttribute('fill', EXPECTEDFILLCOLORS[1]);
          expect(labels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(labels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(seriesLabels[0]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[0], '#ffffff', 4.5));
          expect(seriesLabels[1]).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[1], '#ffffff', 4.5));
          expect(diffLabels).toEqualAttribute('fill', ensureTextContrast(EXPECTEDFILLCOLORS[2], '#ffffff', 4.5));
          expect(line).toEqualAttribute('stroke', EXPECTEDFILLCOLORS[2]);
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
