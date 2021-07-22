/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { newSpecPage, SpecPage } from '@stencil/core/testing';
import { WorldMap } from './world-map';
import { WorldMapDefaultValues } from './world-map-default-values';
import { scaleQuantize, scaleOrdinal, scalePow } from 'd3-scale';

// we need to bring in our nested components as well, was required to bring in the source vs dist folder to get it to mount
import { KeyboardInstructions } from '../../../node_modules/@visa/keyboard-instructions/src/components/keyboard-instructions/keyboard-instructions';
import { DataTable } from '../../../node_modules/@visa/visa-charts-data-table/src/components/data-table/data-table';

import Utils from '@visa/visa-charts-utils';
import UtilsDev from '@visa/visa-charts-utils-dev';

const { visaColors, getColors } = Utils;

const { flushTransitions, unitTestGeneric, unitTestEvent, unitTestInteraction, unitTestTooltip } = UtilsDev;

describe('<world-map />', () => {
  // TECH DEBT: Need to revisit class-logic-testing post PURE function refactor.
  // Class-logic-testing is TDD and BDD friendly.
  describe('class-logic', () => {
    it('should build', () => {
      expect(new WorldMap()).toBeTruthy();
    });
  });

  describe('rendered-html', () => {
    let page: SpecPage;
    let component;

    // START:minimal props need to be passed to component
    const EXPECTEDDATA = [
      { ID: 0, Name: 'USA', 'Birth Rate': 50, 'Other Rate': 25, 'Country Code': '840', Type: 'A' },
      { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Other Rate': 100, 'Country Code': '024', Type: 'B' },
      { ID: 2, Name: 'Brazil', 'Birth Rate': 25, 'Other Rate': 33, 'Country Code': '076', Type: 'A' },
      { ID: 3, Name: 'Greenland', 'Birth Rate': 39.2, 'Other Rate': 75, 'Country Code': '304', Type: 'B' }
    ];
    const MINVALUE = 14.2;
    const MAXVALUE = 50;
    const EXPECTEDJOINACCESSOR = 'Country Code';
    const EXPECTEDJOINNAMEACCESSOR = 'Name';
    const EXPECTEDVALUEACCESSOR = 'Birth Rate';
    const DEFAULTMARKERSTYLEVISIBLE = {
      visible: true,
      blend: false,
      fill: true,
      radius: 5,
      radiusScale: [5, 15],
      opacity: 1,
      color: 'base_grey',
      strokeWidth: 1
    };
    const INTERACTIONTESTMARKERSTYLEVISIBLE = {
      visible: true,
      blend: false,
      fill: false,
      radius: 5,
      opacity: 1,
      color: 'categorical_light_purple',
      strokeWidth: 1
    };
    // END:minimal props need to be passed to component

    // disable accessibility validation to keep output stream(terminal) clean
    const EXPECTEDACCESSIBILITY = { disableValidation: true };

    beforeEach(async () => {
      page = await newSpecPage({
        components: [WorldMap, KeyboardInstructions, DataTable],
        html: '<div></div>'
      });
      component = page.doc.createElement('world-map');
      component.data = EXPECTEDDATA;
      component.joinAccessor = EXPECTEDJOINACCESSOR;
      component.joinNameAccessor = EXPECTEDJOINNAMEACCESSOR;
      component.valueAccessor = EXPECTEDVALUEACCESSOR;
      component.accessibility = EXPECTEDACCESSIBILITY;
      component.uniqueID = 'snapshot-test-1';
      component.unitTest = true;
    });

    it('should build', () => {
      expect(new WorldMap()).toBeTruthy();
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

      it('should render with minimal props given', async () => {
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
          ? { [unitTestGeneric[test].prop]: WorldMapDefaultValues[unitTestGeneric[test].prop] }
          : unitTestGeneric[test].prop === 'data'
          ? { data: EXPECTEDDATA }
          : unitTestGeneric[test].testProps;
        const innerTestSelector =
          unitTestGeneric[test].testSelector === 'component-name'
            ? 'world-map'
            : unitTestGeneric[test].testSelector === '[data-testid=mark]'
            ? '[data-testid=marker]'
            : unitTestGeneric[test].testSelector;
        it(`[${unitTestGeneric[test].group}] ${unitTestGeneric[test].prop}: ${unitTestGeneric[test].name}`, () =>
          unitTestGeneric[test].testFunc(component, page, innerTestProps, innerTestSelector));
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

    describe('mapOptions', () => {
      describe('mapProjection', () => {
        it('should render the equal earth mapProjection by default', async () => {
          // ARRANGE - N/A equal earth is the default this should match without setting prop

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path').getAttribute('d');
          expect(worldMapSVG).toMatchSnapshot();
        });
        it('should render the natural earth mapProjection upon setting prop', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          const EXPECTEDPROJECTION = 'Natural Earth';
          component.mapProjection = EXPECTEDPROJECTION;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path').getAttribute('d');
          expect(worldMapSVG).toMatchSnapshot();
        });
      });
      describe('setMapScaleZoom', () => {
        it('should render the map with zoomed out view', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          const EXPECTEDMAPSCALEZOOM = 1.0;
          component.mapScaleZoom = EXPECTEDMAPSCALEZOOM;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path').getAttribute('d');
          expect(worldMapSVG).toMatchSnapshot();
        });
      });
      describe('showGridlines', () => {
        it('should not render the map gridlines by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const outlinePath = page.doc.querySelector('[data-testid=grid-group] .graticule-outline path');
          const gridPath = page.doc.querySelector('[data-testid=grid-group] .graticule-grid path');
          flushTransitions(outlinePath);
          flushTransitions(gridPath);
          expect(outlinePath).toEqualAttribute('opacity', 0);
          expect(gridPath).toEqualAttribute('opacity', 0);
        });
        it('should render the map gridlines if showGridlines is true', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          component.showGridlines = true;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const outlinePath = page.doc.querySelector('[data-testid=grid-group] .graticule-outline path');
          const gridPath = page.doc.querySelector('[data-testid=grid-group] .graticule-grid path');
          flushTransitions(outlinePath);
          flushTransitions(gridPath);
          expect(outlinePath).toEqualAttribute('opacity', 1);
          expect(gridPath).toEqualAttribute('opacity', 1);
        });
      });
      describe('quality', () => {
        it('should render the low quality map upon setting prop', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          // const EXPECTEDPROJECTION = 'Natural Earth';
          component.mapProjection = 'Low';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path').getAttribute('d');
          expect(worldMapSVG).toMatchSnapshot();
        });
      });
    });

    describe('countryStyle', () => {
      describe('fill', () => {
        it('choropleth should be on by default', async () => {
          // default is sequential blue with colorSteps 4
          const EXPECTEDFILLCOLOR = getColors('sequential_suppPurple', 4)[3];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
        it('choropleth should use color provided when .fill is false', async () => {
          // ARRANGE
          // asserts on both fill = false and colort
          component.countryStyle = {
            fill: false,
            opacity: 0.8,
            color: 'categorical_blue',
            strokeWidth: 0.5
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', visaColors.categorical_blue);
        });
      });
      describe('opacity', () => {
        it('opacity should be .8 by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path');
          expect(worldMapSVG).toEqualAttribute('opacity', 0.8);
        });
        it('opacity should be .5 when setting the prop', async () => {
          // ARRANGE // countryStyle.fill = true is the default this should match without setting prop
          const EXPECTEDOPACITY = 0.5;
          const EXPECTEDCOUNTRYSTYLE = {
            fill: true,
            opacity: EXPECTEDOPACITY,
            color: 'base_grey',
            strokeWidth: 0.5
          };
          component.countryStyle = EXPECTEDCOUNTRYSTYLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path');
          expect(worldMapSVG).toEqualAttribute('opacity', EXPECTEDOPACITY);
        });
      });
      describe('strokeWidth', () => {
        it('stroke width should be .5 px by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path');
          expect(worldMapSVG).toEqualAttribute('stroke-width', 0.5);
        });
        it('stroke width should be 2 when setting the prop', async () => {
          // ARRANGE // countryStyle.fill = true is the default this should match without setting prop
          const EXPECTEDSTROKEWIDTH = 2;
          const EXPECTEDCOUNTRYSTYLE = {
            fill: true,
            opacity: 0.8,
            color: 'base_grey',
            strokeWidth: EXPECTEDSTROKEWIDTH
          };
          component.countryStyle = EXPECTEDCOUNTRYSTYLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const worldMapSVG = page.doc.querySelector('[data-testid=country-group] path');
          expect(worldMapSVG).toEqualAttribute('stroke-width', EXPECTEDSTROKEWIDTH);
        });
      });
    });

    describe('markerStyle', () => {
      describe('visible', () => {
        it('markers should be rendered, but not visible by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            expect(marker).toEqualAttribute('r', 0);
          });
        });
        it('markers should be rendered, and visible when prop is passed', async () => {
          component.markerStyle = {
            visible: true,
            blend: false,
            fill: false,
            radius: 5,
            opacity: 0.8,
            color: 'base_grey',
            strokeWidth: 1
          };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach(marker => {
            flushTransitions(marker);
            expect(marker).toEqualAttribute('r', 5);
          });
        });
      });
      describe('fill and blend', () => {
        it('markers should be rendered, and have fill by default, though not visible', async () => {
          const EXPECTEDFILLCOLOR = getColors('sequential_suppPurple', 4)[3];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
        it('markers should be rendered, and not filled when false is passed to prop', async () => {
          component.markerStyle = {
            visible: true,
            blend: false,
            fill: false,
            radius: 5,
            opacity: 0.8,
            color: 'categorical_blue',
            strokeWidth: 1
          };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('fill', visaColors['categorical_blue']); // tslint:disable-line: no-string-literal
        });
        it('markers should be rendered, and multiply true is passed to blend prop', async () => {
          component.markerStyle = {
            visible: true,
            blend: true,
            fill: false,
            radius: 5,
            opacity: 0.8,
            color: 'base_grey',
            strokeWidth: 1
          };
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker.getAttribute('style')).toEqual('mix-blend-mode: multiply;');
        });
      });
      describe('opacity', () => {
        it('opacity should be .8 by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('fill-opacity', 1);
          expect(marker).toEqualAttribute('stroke-opacity', 1);
        });
        it('opacity should be .5 when setting the prop', async () => {
          // ARRANGE
          const EXPECTEDOPACITY = 0.5;
          component.markerStyle = {
            visible: true,
            blend: true,
            fill: false,
            radius: 5,
            opacity: EXPECTEDOPACITY,
            color: 'base_grey',
            strokeWidth: 1
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('fill-opacity', EXPECTEDOPACITY);
          expect(marker).toEqualAttribute('stroke-opacity', EXPECTEDOPACITY);
        });
      });
      describe('strokeWidth', () => {
        it('stroke width should be 1px by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('stroke-width', 1);
        });
        it('stroke width should be 2px when setting the prop', async () => {
          // ARRANGE
          const EXPECTEDSTROKEWIDTH = 2;
          component.markerStyle = {
            visible: true,
            blend: true,
            fill: false,
            radius: 5,
            opacity: 0.8,
            color: 'base_grey',
            strokeWidth: EXPECTEDSTROKEWIDTH
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          expect(marker).toEqualAttribute('stroke-width', EXPECTEDSTROKEWIDTH);
        });
      });
      describe('radius and radius range', () => {
        it('radius should be 5 by default', async () => {
          component.markerStyle = {
            visible: true
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          flushTransitions(marker);
          expect(marker).toEqualAttribute('r', 5);
        });
        it('radius should update to 10 when passed to the prop', async () => {
          // ARRANGE
          const EXPECTEDRADIUS = 10;
          component.markerStyle = {
            visible: true,
            radius: EXPECTEDRADIUS
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const marker = page.doc.querySelector('[data-testid=marker]');
          flushTransitions(marker);
          expect(marker).toEqualAttribute('r', EXPECTEDRADIUS);
        });
        it('radius should be based on range when passed radius range prop is passed', async () => {
          // ARRANGE
          const EXPECTEDRANGE = [5, 15];
          const radiusScale = scalePow()
            .exponent(0.5)
            .domain([MINVALUE, MAXVALUE])
            .range(EXPECTEDRANGE);
          component.markerStyle = {
            visible: true,
            radiusRange: EXPECTEDRANGE
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const markers = page.doc.querySelectorAll('[data-testid=marker]');
          markers.forEach((marker, i) => {
            flushTransitions(marker);
            expect(marker).toEqualAttribute('r', radiusScale(EXPECTEDDATA[i]['Birth Rate']));
          });
        });
      });
    });

    describe('interaction', () => {
      describe('path based interaction tests', () => {
        const innerTestProps = {
          colorPalette: 'single_categorical_light_purple',
          useFilter: false
        };
        const innerTestSelector = '[data-testid=country][data-id=country-path-840]';
        const innerNegTestSelector = '[data-testid=country][data-id=country-path-076]';
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
      describe('marker based interaction tests', () => {
        const innerTestProps = {
          markerStyle: INTERACTIONTESTMARKERSTYLEVISIBLE,
          useFilter: false,
          fillStrokeOpacity: true
        };
        const innerTestSelector = '[data-testid=marker][data-id=marker-840]';
        const innerNegTestSelector = '[data-testid=marker][data-id=marker-076]';
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

    describe('clickStyle', () => {
      describe('custom with interaction keys', () => {
        const testLoad = 'interaction_clickStyle_custom_load';
        const testUpdate = 'interaction_clickStyle_custom_update';
        const innerTestSelector = '[data-testid=country][data-id=country-path-076]';
        const innerNegTestSelector = '[data-testid=country][data-id=country-path-024]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 4
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['Type'],
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
          interactionKeys: ['Type', 'Country Code'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=country][data-id=country-path-840]',
            '[data-testid=country][data-id=country-path-076]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=country][data-id=country-path-840]',
            '[data-testid=country][data-id=country-path-076]'
          ));
      });
    });
    describe('hoverStyle', () => {
      describe('custom with interaction keys', () => {
        const testLoad = 'interaction_hoverStyle_custom_load';
        const testUpdate = 'interaction_hoverStyle_custom_update';
        const innerTestSelector = '[data-testid=country][data-id=country-path-076]';
        const innerNegTestSelector = '[data-testid=country][data-id=country-path-024]';
        const CUSTOMCLICKSTYLE = {
          color: visaColors.categorical_light_purple, // this has to be light enough to require a contrasting stroke
          strokeWidth: 3
        };
        const EXPECTEDHOVEROPACITY = 0.25;
        const innerTestProps = {
          clickStyle: CUSTOMCLICKSTYLE,
          hoverOpacity: EXPECTEDHOVEROPACITY,
          interactionKeys: ['Type'],
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
          interactionKeys: ['Type', 'Country Code'],
          useFilter: false
        };
        it(`[${unitTestInteraction[testLoad].group}] ${unitTestInteraction[testLoad].prop}: ${
          unitTestInteraction[testLoad].name
        } interactionKey value`, () =>
          unitTestInteraction[testLoad].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=country][data-id=country-path-840]',
            '[data-testid=country][data-id=country-path-076]'
          ));

        it(`[${unitTestInteraction[testUpdate].group}] ${unitTestInteraction[testUpdate].prop}: ${
          unitTestInteraction[testUpdate].name
        } interactionKey value`, () =>
          unitTestInteraction[testUpdate].testFunc(
            component,
            page,
            newInnerTestProps,
            '[data-testid=country][data-id=country-path-840]',
            '[data-testid=country][data-id=country-path-076]'
          ));
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

      describe('minValueOverride', () => {
        it('should reset legend and component when min override is passed', async () => {
          const valueColorScale = scaleQuantize()
            .domain([0, MAXVALUE])
            .range(getColors('sequential_suppPurple', 4));

          component.minValueOverride = 0;
          component.markerStyle = DEFAULTMARKERSTYLEVISIBLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          const legendGText = legendGs[0].childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          const markerCircles = page.doc.querySelectorAll('[data-testid=marker]');
          expect(legendGText.substring(0, 1)).toEqual('0');
          markerCircles.forEach((circle, i) => {
            expect(circle).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i]['Birth Rate']));
          });
        });
      });
      describe('maxValueOverride', () => {
        it('should reset legend and component when min override is passed', async () => {
          const valueColorScale = scaleQuantize()
            .domain([MINVALUE, 100])
            .range(getColors('sequential_suppPurple', 4));

          component.maxValueOverride = 100;
          component.markerStyle = DEFAULTMARKERSTYLEVISIBLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          const legendGText = legendGs[3].childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          const markerCircles = page.doc.querySelectorAll('[data-testid=marker]');
          expect(legendGText.substring(legendGText.length - 3)).toEqual('100');
          markerCircles.forEach((circle, i) => {
            expect(circle).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i]['Birth Rate']));
          });
        });
      });
      describe('valueAccessor', () => {
        it('should update legend and component when different valueAccessor is passed', async () => {
          const valueColorScale = scaleQuantize()
            .domain([25, 100])
            .range(getColors('sequential_suppPurple', 4));

          component.valueAccessor = 'Other Rate';
          component.markerStyle = DEFAULTMARKERSTYLEVISIBLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          const legendMinText = legendGs[0].childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          const legendMaxText = legendGs[3].childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          const markerCircles = page.doc.querySelectorAll('[data-testid=marker]');
          expect(legendMinText.substring(0, 2)).toEqual('25');
          expect(legendMaxText.substring(legendMaxText.length - 3)).toEqual('100');
          markerCircles.forEach((circle, i) => {
            expect(circle).toEqualAttribute('fill', valueColorScale(EXPECTEDDATA[i]['Other Rate']));
          });
        });
      });
      describe('groupAccessor', () => {
        it('should update legend and component when groupAccessor is passed', async () => {
          const groupColorScale = scaleOrdinal()
            .domain(EXPECTEDDATA.map(d => d.Type))
            .range(getColors('sequential_suppPurple', 4));

          component.groupAccessor = 'Type';
          component.markerStyle = DEFAULTMARKERSTYLEVISIBLE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendGs = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          legendGs.forEach((legendG, i) => {
            expect(legendG.childNodes[1]['__data__']).toEqual(groupColorScale.domain()[i]); // tslint:disable-line: no-string-literal
          });

          const markerCircles = page.doc.querySelectorAll('[data-testid=marker]');
          markerCircles.forEach((circle, i) => {
            expect(circle).toEqualAttribute('fill', groupColorScale(EXPECTEDDATA[i]['Type']));
          });
        });
      });
      // @watch-notes: other accessor testing is TBD
      describe('sort', () => {
        it('should render data in ascending order when sortOrder is asc', async () => {
          // ARRANGE // NOTE FOR MAP RENDERING ORDER IS REVERSED ON PURPOSE
          const EXPECTEDDATADESC = [
            { ID: 0, Name: 'USA', 'Birth Rate': 50, 'Country Code': '840', Type: 'A' },
            { ID: 3, Name: 'Greenland', 'Birth Rate': 39.2, 'Country Code': '304', Type: 'B' },
            { ID: 2, Name: 'Brazil', 'Birth Rate': 25, 'Country Code': '076', Type: 'A' },
            { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Country Code': '024', Type: 'B' }
          ];
          component.sortOrder = 'asc';

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          // @watch-notes: this fails need to see what the right way to test this with basav is
          const elements = page.doc.querySelectorAll('[data-testid=marker]');
          elements.forEach((element, i) => {
            expect(element['__data__'].ID).toEqual(EXPECTEDDATADESC[i].ID); // tslint:disable-line: no-string-literal
          });
        });
        // @watch-notes: we need to revisit whether to test accessor changes...
        it('should render data in descending order when sortOrder is desc', async () => {
          // ARRANGE
          const EXPECTEDDATAASC = [
            { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Country Code': '024', Type: 'B' },
            { ID: 2, Name: 'Brazil', 'Birth Rate': 25, 'Country Code': '076', Type: 'A' },
            { ID: 3, Name: 'Greenland', 'Birth Rate': 39.2, 'Country Code': '304', Type: 'B' },
            { ID: 0, Name: 'USA', 'Birth Rate': 50, 'Country Code': '840', Type: 'A' }
          ];
          const EXPECTEDSORTORDER = 'desc';
          component.sortOrder = EXPECTEDSORTORDER;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=marker]');
          elements.forEach((element, i) => {
            expect(element['__data__'].ID).toEqual(EXPECTEDDATAASC[i].ID); // tslint:disable-line: no-string-literal
          });
        });
        // @watch-notes: we need to revisit whether to test accessor changes...
        it('should render data in descending order when sortOrder is updated to desc', async () => {
          // ARRANGE
          const EXPECTEDDATAASC = [
            { ID: 1, Name: 'Angola', 'Birth Rate': 14.2, 'Country Code': '024', Type: 'B' },
            { ID: 2, Name: 'Brazil', 'Birth Rate': 25, 'Country Code': '076', Type: 'A' },
            { ID: 3, Name: 'Greenland', 'Birth Rate': 39.2, 'Country Code': '304', Type: 'B' },
            { ID: 0, Name: 'USA', 'Birth Rate': 50, 'Country Code': '840', Type: 'A' }
          ];
          const EXPECTEDSORTORDER = 'desc';

          // ACT RENDER
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT UPDATE
          component.sortOrder = EXPECTEDSORTORDER;
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=marker]');
          elements.forEach((element, i) => {
            expect(element['__data__'].ID).toEqual(EXPECTEDDATAASC[i].ID); // tslint:disable-line: no-string-literal
          });
        });
        it('should render data in default order when sortOrder is not provided', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const elements = page.doc.querySelectorAll('[data-testid=marker]');
          elements.forEach((element, i) => {
            expect(element['__data__'].ID).toEqual(EXPECTEDDATA[i].ID); // tslint:disable-line: no-string-literal
          });
        });
      });
    });

    describe('dataLabel', () => {
      describe('visible', () => {
        it('should not render dataLabel by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
          expect(dataLabel).toEqualAttribute('opacity', 0);
        });
        it('should render the map data labels if visible is true', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          component.dataLabel = {
            visible: true,
            labelAccessor: ''
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();
          const dataLabel = page.doc.querySelector('[data-testid=dataLabel]');
          expect(dataLabel).toEqualAttribute('opacity', 1);
        });
      });
      describe('labelAccessor', () => {
        it('should default to the join/marker name if default', async () => {
          component.dataLabel = {
            visible: true,
            labelAccessor: ''
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          dataLabels.forEach((label, i) => {
            flushTransitions(label);
            expect(label).toEqualText(EXPECTEDDATA[i].Name);
          });
        });
        it('should render the map data labels if visible is true', async () => {
          // ARRANGE // equal earth is the default this should match without setting prop
          component.dataLabel = {
            visible: true,
            labelAccessor: 'Type'
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const dataLabels = page.doc.querySelectorAll('[data-testid=dataLabel]');
          dataLabels.forEach((label, i) => {
            flushTransitions(label);
            expect(label).toEqualText(EXPECTEDDATA[i].Type);
          });
        });
      });
      describe('format', () => {
        it('should format number if passed as prop', async () => {
          component.dataLabel = {
            visible: true,
            labelAccessor: 'Birth Rate',
            format: '$0[.][0]a'
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const label = page.doc.querySelector('[data-testid=dataLabel]');
          flushTransitions(label);
          expect(label).toEqualText('$50');
        });
      });
    });
    describe('legend', () => {
      describe('visible', () => {
        it('by default the legend should render, be key type and visible', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendSVG = page.doc.querySelector('[data-testid=legend-container]');
          const legendContainer = legendSVG.parentElement;
          const legendG = legendSVG.querySelector('g').querySelector('g');
          expect(legendContainer.getAttribute('style')).toEqual('display: block;');
          expect(legendSVG).toEqualAttribute('opacity', 1);
          expect(legendG).toHaveClass('key');
        });
        it('should render, but not be visible if false is passed', async () => {
          component.legend = {
            visible: false,
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
          const legendContainer = legendSVG.parentElement;
          expect(legendContainer.getAttribute('style')).toEqual('display: none;');
          expect(legendSVG).toEqualAttribute('opacity', 0);
          expect(legendSVG.getAttribute('style')).toEqual('display: none;');
        });
      });
      describe('type', () => {
        it('should be default type if default is passed', async () => {
          component.legend = {
            visible: true,
            interactive: false,
            type: 'default',
            format: '0[.][0][0]a',
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
          expect(legendG).toHaveClass('default');
        });
        it('should be gradient type if gradient is passed', async () => {
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
          const legendG = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelector('g');
          expect(legendG).toHaveClass('gradient');
        });
      });
      describe('interactive', () => {
        it('should not be interactive by deafult', async () => {
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
        it('should be interactive when interactive prop is true', async () => {
          component.legend = {
            visible: true,
            interactive: true,
            type: 'key',
            format: '0[.][0][0]a',
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
        });
      });
      describe('format', () => {
        it('should format number if passed as prop', async () => {
          component.legend = {
            visible: true,
            interactive: true,
            type: 'key',
            format: '$0[.][0]a',
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
          const legendGText = legendG.childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          expect(legendGText).toEqual('$14.2-$23.2');
        });
      });
      describe('labels', () => {
        it('should be equal to data values by default', async () => {
          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendG = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelector('g');
          const legendGText = legendG.childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
          expect(legendGText).toEqual('14.2-23.2');
        });
        it('should have custom labels when passed as prop', async () => {
          const EXPECTEDLABELS = ['A', 'B', 'C', 'D'];
          component.legend = {
            visible: true,
            interactive: true,
            type: 'key',
            format: '',
            labels: EXPECTEDLABELS
          };

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const legendG = page.doc
            .querySelector('[data-testid=legend-container]')
            .querySelector('g')
            .querySelectorAll('g');
          legendG.forEach((g, i) => {
            const gText = g.childNodes[1]['__data__']; // tslint:disable-line: no-string-literal
            expect(gText).toEqual(EXPECTEDLABELS[i]);
          });
        });
      });
    });
    describe('tooltip', () => {
      const tooltip1 = {
        tooltipLabel: {
          format: [],
          labelAccessor: ['Name'],
          labelTitle: ['Testing123']
        }
      };
      const tooltip2 = {
        tooltipLabel: {
          format: ['', '$0[.][0][0]'],
          labelAccessor: ['Name', 'Birth Rate'],
          labelTitle: ['Testing123', 'Rate']
        }
      };
      describe('generic tooltip tests for paths', () => {
        Object.keys(unitTestTooltip).forEach(test => {
          // const innerTestSelector = '[data-testid=marker][data-id=marker-840]'; // '[data-testid=country][data-id=country-path-840]';
          const innerTestSelector = '[data-testid=country][data-id=country-path-840]';
          const innerTooltipProps = {
            tooltip_tooltipLabel_custom_load: tooltip1,
            tooltip_tooltipLabel_custom_update: tooltip1,
            tooltip_tooltipLabel_custom_format_load: tooltip2,
            tooltip_tooltipLabel_custom_format_update: tooltip2
          };
          const innerTooltipContent = {
            tooltip_tooltipLabel_default: '<p style="margin: 0;"><b>USA (840)</b><br>Birth Rate:<b>50</b></p>',
            tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>USA</b><br></p>',
            tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>USA</b><br></p>',
            tooltip_tooltipLabel_custom_format_load:
              '<p style="margin: 0;">Testing123:<b>USA</b><br>Rate:<b>$50</b><br></p>',
            tooltip_tooltipLabel_custom_format_update:
              '<p style="margin: 0;">Testing123:<b>USA</b><br>Rate:<b>$50</b><br></p>'
          };
          const innerTestProps = { ...unitTestTooltip[test].testProps, ...innerTooltipProps[test] };

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
      describe('custom tooltip test for paths', () => {
        const testProps = {
          markerStyle: DEFAULTMARKERSTYLEVISIBLE
        };
        const fakePosition = { pageX: 125, pageY: 250 };
        const tooltipSelector = '[data-testid=tooltip-container]';
        it('check that paths do not show tooltip when markers are visible', async () => {
          // ARRANGE
          // if we have any testProps apply them
          if (Object.keys(testProps).length) {
            Object.keys(testProps).forEach(testProp => {
              component[testProp] = testProps[testProp];
            });
          }
          page.root.appendChild(component);
          await page.waitForChanges();

          // ACT - TRIGGER HOVER
          const tooltipContainer = page.doc.querySelector(tooltipSelector);
          const markerToHover = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          const mockMouseEvent = new MouseEvent('mouseover');
          markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

          // ACT - FLUSH TRANSITIONS
          flushTransitions(tooltipContainer);
          await page.waitForChanges();

          expect(parseFloat(tooltipContainer.style.opacity)).toEqual(0);
        });
      });
      describe('generic tooltip tests for markers', () => {
        Object.keys(unitTestTooltip).forEach(test => {
          const innerTestSelector = '[data-testid=marker][data-id=marker-840]'; // '[data-testid=country][data-id=country-path-840]';
          const innerTooltipProps = {
            tooltip_tooltipLabel_custom_load: tooltip1,
            tooltip_tooltipLabel_custom_update: tooltip1,
            tooltip_tooltipLabel_custom_format_load: tooltip2,
            tooltip_tooltipLabel_custom_format_update: tooltip2
          };
          const innerTooltipContent = {
            tooltip_tooltipLabel_default: '<p style="margin: 0;"><b>USA (840)</b><br>Birth Rate:<b>50</b></p>',
            tooltip_tooltipLabel_custom_load: '<p style="margin: 0;">Testing123:<b>USA</b><br></p>',
            tooltip_tooltipLabel_custom_update: '<p style="margin: 0;">Testing123:<b>USA</b><br></p>',
            tooltip_tooltipLabel_custom_format_load:
              '<p style="margin: 0;">Testing123:<b>USA</b><br>Rate:<b>$50</b><br></p>',
            tooltip_tooltipLabel_custom_format_update:
              '<p style="margin: 0;">Testing123:<b>USA</b><br>Rate:<b>$50</b><br></p>'
          };
          const innerTestProps = {
            ...unitTestTooltip[test].testProps,
            ...innerTooltipProps[test],
            markerStyle: DEFAULTMARKERSTYLEVISIBLE
          };

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
    describe('style', () => {
      describe('colorPalette', () => {
        it('should render sequential purple by default', async () => {
          const EXPECTEDFILLCOLOR = getColors('sequential_suppPurple', 4)[3];

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
        it('should render sequential grey when colorPalette is sequential_grey', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'sequential_grey';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE, 4)[3];
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });

        it('should render diverging RtoB based color when colorPalette is diverging_RtoB', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'diverging_RtoB';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE, 4)[3];
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
        it('should render categorical color when colorPalette is categorical', async () => {
          // ARRANGE
          const EXPECTEDCOLORPALETTE = 'categorical';
          const EXPECTEDFILLCOLOR = getColors(EXPECTEDCOLORPALETTE, 4)[3];
          component.colorPalette = EXPECTEDCOLORPALETTE;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
      });
      describe('colors', () => {
        it('should render colors instead of palette when passed', async () => {
          const colors = ['#829e46', '#c18174', '#7a6763', '#796aaf'];
          const EXPECTEDFILLCOLOR = colors[3];
          component.colors = colors;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
      });
      describe('colorSteps', () => {
        it('should change colorStep ramp based on new prop being passed', async () => {
          const EXPECTEDFILLCOLOR = getColors('sequential_suppPurple', 3)[2];
          component.colorSteps = 3;

          // ACT
          page.root.appendChild(component);
          await page.waitForChanges();

          // ASSERT
          const usaPath = page.doc.querySelector('[data-testid=country][data-id=country-path-840]');
          expect(usaPath).toEqualAttribute('fill', EXPECTEDFILLCOLOR);
        });
      });

      describe('cursor', () => {
        it('refer to generic interaction results above for cursor tests', () => {
          expect(true).toBeTruthy();
        });
      });
    });

    describe('event-emitter', () => {
      describe('generic event testing', () => {
        describe('path based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              // markerStyle: DEFAULTMARKERSTYLEVISIBLE,
              showTooltip: false
            };
            const innerTestSelector = '[data-testid=country][data-id=country-path-840]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
          });
        });
        describe('marker based events', () => {
          Object.keys(unitTestEvent).forEach(test => {
            const innerTestProps = {
              markerStyle: DEFAULTMARKERSTYLEVISIBLE,
              showTooltip: false
            };
            const innerTestSelector = '[data-testid=marker]';

            it(`[${unitTestEvent[test].group}] ${unitTestEvent[test].prop}: ${unitTestEvent[test].name}`, () =>
              unitTestEvent[test].testFunc(component, page, innerTestProps, innerTestSelector, EXPECTEDDATA[0]));
          });
        });
      });
    });
  });
});
