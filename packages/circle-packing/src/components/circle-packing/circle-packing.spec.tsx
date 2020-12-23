/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { CirclePacking } from './circle-packing';
import { CirclePackingDefaultValues } from './circle-packing-default-values';
import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { getColors, outlineColor, visaColors, getContrastingStroke } = Utils;

const { flushTransitions, unitTestGeneric, unitTestEvent, unitTestInteraction, unitTestTooltip } = UtilsDev;

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
    const MINVALUE = 4;
    const MAXVALUE = 73;
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [CirclePacking],
        html: '<div></div>'
      });
      component = page.doc.createElement('circle-packing');
      component.data = EXPECTEDDATA;
      component.uniqueID = EXPECTEDUNIQUEID;
      component.nodeAccessor = EXPECTEDNODEACCESSOR;
      component.parentAccessor = EXPECTEDPARENTACCESSOR;
      component.sizeAccessor = EXPECTEDSIZEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
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
    });

    // @test-notes: had to remove theme and data, due to restructuring of data for circle pack this test doesn't work as designed
    // for data we need to do d.data.data for circle packing vs just using __data__
    // need to investigate this in the browser once we are able to connect the debugger again
    describe('generic test suite', () => {
      Object.keys(unitTestGeneric).forEach(test => {
        if (unitTestGeneric[test].prop !== 'data') {
          // temporary if until we remove theme from testing util (part of props PR)
          const innerTestProps = unitTestGeneric[test].testDefault
            ? { [unitTestGeneric[test].prop]: CirclePackingDefaultValues[unitTestGeneric[test].prop] }
            : unitTestGeneric[test].prop === 'data'
            ? { data: EXPECTEDDATA }
            : unitTestGeneric[test].testProps;
          const innerTestSelector =
            unitTestGeneric[test].testSelector === 'component-name'
              ? 'circle-packing'
              : unitTestGeneric[test].testSelector === '[data-testid=mark]'
              ? '[data-testid=circle]'
              : unitTestGeneric[test].testSelector;
          if (unitTestGeneric[test].prop === 'margin' || unitTestGeneric[test].prop === 'padding') {
            // skip margin and padding until we can solve issues with parseSVG() and jsdom mocked SVG elements
            it.skip(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
              unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
          } else {
            it(`${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
              unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
          }
        }
      });
    });

    describe('accessibility', () => {
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

    // current these tests are failing due to attrTween / jsdom error where (_, i, n) is undefined
    // in the attrTween callback function
    describe.skip('interaction', () => {
      describe('circle pack based interaction tests', () => {
        const innerTestProps = {};
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
          interactionKeys: ['Country']
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
          interactionKeys: ['Type', 'Country']
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
          interactionKeys: ['Country']
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
          interactionKeys: ['Type', 'Country']
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
    describe.skip('event-emitter', () => {
      // Open issue: https://github.com/ionic-team/stencil/issues/1964
      // Jest throwing TypeError : mouseover,mouseout, focus, blur etc.
      // TECH-DEBT: Once above issue is resolved, write more precise test for event params.

      describe('generic event testing', () => {
        describe('mark based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              showTooltip: false,
              nestedDataLocation: true
            };
            const innerTestSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
            // we have to handle clickFunc separately due to this.zooming boolean in circle-packing load
            if (test !== 'event_clickFunc_emit') {
              it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
                unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
            }
          });
        });
        describe('customized mark based event testing', () => {
          const testSelector = '[data-testid=circle][data-id=circle-World-Mexico]';
          const allSelector = '[data-testid=circle]';
          it('[interaction] clickFunc: customized for circle-pack event object should emit and contain first data record when first mark is clicked', async () => {
            // ARRANGE
            const _callback = jest.fn();
            page.root.appendChild(component);
            page.doc.addEventListener('clickFunc', _callback);
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
            expect(_callback.mock.calls[0][0].detail).toMatchObject(EXPECTEDDATA[0]);
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
                '<p style="margin: 0;">Testing123:<b>Mexico</b><br>Count:<b>$73</b><br></p>'
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
