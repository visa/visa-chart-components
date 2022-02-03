/**
 * Copyright (c) 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { AlluvialDiagram } from './alluvial-diagram';
import { AlluvialDiagramDefaultValues } from './alluvial-diagram-default-values';
import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';

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
      { group: 'Remained', cat: 'Cat1 2018', target: 'Cat1 2019', value: 3010 },
      { group: 'Decreased', cat: 'Cat1 2018', target: 'Cat2 2019', value: 2754 },
      { group: 'Decreased', cat: 'Cat1 2018', target: 'Cat3 2019', value: 2812 },
      { group: 'Increased', cat: 'Cat2 2018', target: 'Cat1 2019', value: 909 },
      { group: 'Remained', cat: 'Cat2 2018', target: 'Cat2 2019', value: 12712 },
      { group: 'Decreased', cat: 'Cat2 2018', target: 'Cat3 2019', value: 3367 },
      { group: 'Increased', cat: 'Cat3 2018', target: 'Cat1 2019', value: 68 },
      { group: 'Increased', cat: 'Cat3 2018', target: 'Cat2 2019', value: 1133 },
      { group: 'Remained', cat: 'Cat3 2018', target: 'Cat3 2019', value: 6164 },
      { group: 'New', cat: 'CatNew 2018', target: 'Cat1 2019', value: 3148 },
      { group: 'New', cat: 'CatNew 2018', target: 'Cat2 2019', value: 7279 },
      { group: 'New', cat: 'CatNew 2018', target: 'Cat3 2019', value: 3684 }
    ];
    const EXPECTEDNODEDATA = [
      { did: 'Cat1 2018' },
      { did: 'Cat2 2018' },
      { did: 'Cat3 2018' },
      { did: 'CatNew 2018' },
      { did: 'Cat1 2019' },
      { did: 'Cat2 2019' },
      { did: 'Cat3 2019' }
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
    });

    // @test-notes: had to remove theme and data, due to restructuring of data for alluvial this test doesn't work as designed
    // for data we need to do d.data.data for alluvial vs just using __data__
    describe('generic test suite', () => {
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
