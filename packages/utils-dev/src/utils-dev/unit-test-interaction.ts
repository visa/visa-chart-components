/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions } from './unit-test-utils';
import { rgb } from 'd3-color';

import Utils from '@visa/visa-charts-utils';

const { visaColors, propDefaultValues, getAccessibleStrokes } = Utils;

const DEFAULTHOVEROPACITY = propDefaultValues.hoverOpacity;
const CUSTOMHOVEROPACITY = 0.5;

const DEFAULTCLICKSTYLE = propDefaultValues.clickStyle;
const DEFAULTSYMBOLCLICKSTYLE = propDefaultValues.symbolClickStyle;
const CUSTOMCLICKSTYLE = {
  color: visaColors.categorical_light_purple,
  strokeWidth: 4
};

const DEFAULTHOVERSTYLE = propDefaultValues.hoverStyle;
const DEFAULTSYMBOLHOVERSTYLE = propDefaultValues.symbolHoverStyle;

const checkRGB = element =>
  element.getAttribute('fill').substr(0, 3) === 'rgb' || element.style.getPropertyValue('fill').substr(0, 3) === 'rgb';
const checkURL = element =>
  element.getAttribute('fill') ? element.getAttribute('fill').substr(0, 4) === 'url(' : false;

// this is only needed for parsing the complex style object
// no longer needed after flushTransition() was added
// but a useful piece of code so leaving it commented for now
// const getStyleObject = styleString => {
//   const styleObject = {};
//   styleString
//     .replace(/[\n\r]+/g, '')
//     .replace(/\s{2,10}/g, '')
//     .split(';')
//     .forEach(style => (styleObject[style.split(':')[0]] = style.split(':')[1]));
//   return styleObject;
// };

export const interaction_cursor_default_load = {
  prop: 'cursor',
  group: 'interaction',
  name: 'should render default(arrow) pointer on mark when cursor type is default',
  testProps: { cursor: 'default' },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDCURSOR = 'default';
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp !== 'cursor') {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const marker = await page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('cursor', EXPECTEDCURSOR);
  }
};

export const interaction_cursor_pointer_load = {
  prop: 'cursor',
  group: 'interaction',
  name: 'should render link pointer on mark when cursor type is pointer on load',
  testProps: { cursor: 'pointer' },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDCURSOR = 'pointer';
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp !== 'cursor') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.cursor = EXPECTEDCURSOR;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const marker = await page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('cursor', EXPECTEDCURSOR);
  }
};

export const interaction_cursor_pointer_update = {
  prop: 'cursor',
  group: 'interaction',
  name: 'should render link pointer on mark when cursor type is pointer on update',
  testProps: { cursor: 'pointer' },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDCURSOR = 'pointer';
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp !== 'cursor') {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.cursor = EXPECTEDCURSOR;
    await page.waitForChanges();

    // ASSERT
    const marker = await page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('cursor', EXPECTEDCURSOR);
  }
};

export const interaction_clickStyle_default_load = {
  prop: 'clickStyle',
  group: 'interaction',
  name: 'on click the selected mark should be default clickStyle and others should have hoverOpacity',
  testProps: {},
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'clickHighlight') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.clickHighlight = [component.data[0]];
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      1 + customRadiusModifier[2],
      DEFAULTCLICKSTYLE.strokeWidth + 1 + customRadiusModifier[3],
      DEFAULTCLICKSTYLE.strokeWidth + 2 + customRadiusModifier[4]
    ];

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const notSelectedMarkColor = checkURL(notSelectedMark)
      ? page.doc
          .querySelector(
            selectedMark
              .getAttribute('fill')
              .replace('url(', '')
              .replace(')', '')
          )
          .querySelector('rect')
          .getAttribute('fill')
      : selectedMark.getAttribute('fill') === 'none'
      ? selectedMark.getAttribute('stroke')
      : selectedMark.getAttribute('fill');
    const expectedStrokeColor =
      selectedMark.getAttribute('fill') === 'none'
        ? selectedMark.getAttribute('stroke')
        : getAccessibleStrokes(notSelectedMarkColor)[0];
    const expectedScatterStrokeWidth = DEFAULTSYMBOLCLICKSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );

      const selectedMarkFilterPrimaryColorFlood = selectedMarkFilter.querySelector('feFlood[result=primary-color]');
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });

      // STROKE COLOR TEST
      expect(selectedMarkFilterPrimaryColorFlood).toEqualAttribute('flood-color', expectedStrokeColor);
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : DEFAULTCLICKSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);
    }

    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', DEFAULTHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', DEFAULTHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', DEFAULTHOVEROPACITY);
    }
  }
};

export const interaction_clickStyle_custom_load = {
  prop: 'clickStyle',
  group: 'interaction',
  name: 'on click (load) the selected mark should be custom clickStyle and others should have hoverOpacity',
  testProps: {
    hoverOpacity: CUSTOMHOVEROPACITY,
    clickStyle: CUSTOMCLICKSTYLE
  },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDCLICKSTYLE = testProps['clickStyle'] ? testProps['clickStyle'] : CUSTOMCLICKSTYLE;
    const EXPECTEDHOVEROPACITY = testProps['hoverOpacity'] ? testProps['hoverOpacity'] : CUSTOMHOVEROPACITY;
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'clickStyle' && testProp !== 'hoverOpacity') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.clickHighlight = [component.data[0]];
    component.clickStyle = EXPECTEDCLICKSTYLE;
    component.hoverOpacity = EXPECTEDHOVEROPACITY;
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      EXPECTEDCLICKSTYLE.strokeWidth + customRadiusModifier[2],
      EXPECTEDCLICKSTYLE.strokeWidth + 1 + customRadiusModifier[3]
    ];

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const expectedStrokeColor = getAccessibleStrokes(EXPECTEDCLICKSTYLE.color)[0];
    const expectedScatterStrokeWidth = EXPECTEDCLICKSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );

      const selectedMarkFilterPrimaryColorFlood = selectedMarkFilter.querySelector('feFlood[result=primary-color]');
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });

      // STROKE COLOR TEST
      expect(selectedMarkFilterPrimaryColorFlood).toEqualAttribute('flood-color', expectedStrokeColor);

      // FILL COLOR TEST
      expect(selectedMark).toEqualAttribute('fill', EXPECTEDCLICKSTYLE.color);
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : EXPECTEDCLICKSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);

      // FILL COLOR TEST
      if (!(selectedMark.getAttribute('fill') === 'none')) {
        expect(selectedMark).toEqualAttribute('fill', EXPECTEDCLICKSTYLE.color);
      }
    }

    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', EXPECTEDHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', EXPECTEDHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', EXPECTEDHOVEROPACITY);
    }
  }
};

export const interaction_clickStyle_custom_update = {
  prop: 'clickStyle',
  group: 'interaction',
  name: 'on click (update) the selected mark should be custom clickStyle and others should have hoverOpacity',
  testProps: {
    hoverOpacity: CUSTOMHOVEROPACITY,
    clickStyle: CUSTOMCLICKSTYLE
  },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDCLICKSTYLE = testProps['clickStyle'] ? testProps['clickStyle'] : CUSTOMCLICKSTYLE;
    const EXPECTEDHOVEROPACITY = testProps['hoverOpacity'] ? testProps['hoverOpacity'] : CUSTOMHOVEROPACITY;
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'clickStyle' && testProp !== 'hoverOpacity') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.clickStyle = EXPECTEDCLICKSTYLE;
    component.hoverOpacity = EXPECTEDHOVEROPACITY;
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      EXPECTEDCLICKSTYLE.strokeWidth + customRadiusModifier[2],
      EXPECTEDCLICKSTYLE.strokeWidth + 1 + customRadiusModifier[3]
    ];

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // ACT UPDATE
    component.clickHighlight = [component.data[0]];
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const expectedStrokeColor = getAccessibleStrokes(EXPECTEDCLICKSTYLE.color)[0];
    const expectedScatterStrokeWidth = EXPECTEDCLICKSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );

      const selectedMarkFilterPrimaryColorFlood = selectedMarkFilter.querySelector('feFlood[result=primary-color]');
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });

      // STROKE COLOR TEST
      expect(selectedMarkFilterPrimaryColorFlood).toEqualAttribute('flood-color', expectedStrokeColor);

      // FILL COLOR TEST
      expect(selectedMark).toEqualAttribute('fill', EXPECTEDCLICKSTYLE.color);
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : EXPECTEDCLICKSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);

      // FILL COLOR TEST
      if (!(selectedMark.getAttribute('fill') === 'none')) {
        expect(selectedMark).toEqualAttribute('fill', EXPECTEDCLICKSTYLE.color);
      }
    }

    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', EXPECTEDHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', EXPECTEDHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', EXPECTEDHOVEROPACITY);
    }
  }
};

export const interaction_hoverStyle_default_load = {
  prop: 'hoverStyle',
  group: 'interaction',
  name: 'on hover the mark should be default hoverStyle and others should have hoverOpacity',
  testProps: {
    hoverOpacity: DEFAULTHOVEROPACITY,
    hoverStyle: DEFAULTHOVERSTYLE
  },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'hoverHighlight') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.hoverHighlight = component.data[0];
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      1 + customRadiusModifier[2],
      DEFAULTHOVERSTYLE.strokeWidth + 1 + customRadiusModifier[3],
      DEFAULTHOVERSTYLE.strokeWidth + 2 + customRadiusModifier[4]
    ];

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const notSelectedMarkColor =
      checkURL(notSelectedMark) && !DEFAULTHOVERSTYLE.color
        ? page.doc
            .querySelector(
              selectedMark
                .getAttribute('fill')
                .replace('url(', '')
                .replace(')', '')
            )
            .querySelector('rect')
            .getAttribute('fill')
        : selectedMark.getAttribute('fill') === 'none'
        ? selectedMark.getAttribute('stroke')
        : selectedMark.getAttribute('fill');
    const expectedStrokeColor =
      selectedMark.getAttribute('fill') === 'none'
        ? selectedMark.getAttribute('stroke')
        : getAccessibleStrokes(notSelectedMarkColor)[0];
    const expectedScatterStrokeWidth = DEFAULTSYMBOLHOVERSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');
      const selectedMarkHighlightContainer = page.doc.querySelector('.vcl-accessibility-focus-highlight');
      const selectedMarkHighlightClip = selectedMarkHighlightContainer.childNodes[0];
      const selectedMarkHighlightElement = selectedMarkHighlightContainer.childNodes[1];
      const isRGB = checkRGB(selectedMarkHighlightElement);
      const clipID = `url(#${selectedMarkHighlightClip['getAttribute']('id')})`;

      // SOURCE MARK TESTS
      expect(selectedMark).toHaveClass('vcl-accessibility-focus-hoverSource');
      expect(selectedMark.getAttribute('filter').indexOf('-hover-')).toBeGreaterThan(0);

      // TEST THAT FOCUS HIGHLIGHT ELEMENTS ARE CREATED
      expect(selectedMarkHighlightContainer).toBeTruthy();
      expect(selectedMarkHighlightClip).toBeTruthy();
      expect(selectedMarkHighlightClip.nodeName).toEqual('clipPath');
      expect(selectedMarkHighlightElement).toBeTruthy();
      expect(selectedMarkHighlightElement.nodeName).not.toEqual('clipPath');
      expect(selectedMarkHighlightElement).toEqualAttribute('clip-path', clipID);

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke-width')).toEqual(
        `${2 + DEFAULTHOVERSTYLE.strokeWidth * 2}px`
      );

      // STROKE COLOR TEST
      expect(selectedMarkHighlightElement['style'].getPropertyValue('fill')).toEqual('none');
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke')).toEqual(
        isRGB ? rgb(DEFAULTHOVERSTYLE.color || expectedStrokeColor) : DEFAULTHOVERSTYLE.color || expectedStrokeColor
      );
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : DEFAULTCLICKSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);

      // FILL COLOR TEST // DEFAULT HOVER STYLE DOES NOT HAVE FILL PROPERTY
      // expect(selectedMark).toEqualAttribute('fill', EXPECTEDCLICKSTYLE.color);
    }
    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', DEFAULTHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', DEFAULTHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', DEFAULTHOVEROPACITY);
    }
  }
};

export const interaction_hoverStyle_custom_load = {
  prop: 'hoverStyle',
  group: 'interaction',
  name: 'on hover (load) the mark should be custom hoverStyle and others should have hoverOpacity',
  testProps: {
    hoverOpacity: CUSTOMHOVEROPACITY,
    hoverStyle: CUSTOMCLICKSTYLE
  },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDHOVERSTYLE = testProps['hoverStyle'] ? testProps['hoverStyle'] : CUSTOMCLICKSTYLE;
    const EXPECTEDHOVEROPACITY = testProps['hoverOpacity'] ? testProps['hoverOpacity'] : CUSTOMHOVEROPACITY;
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'hoverStyle' && testProp !== 'hoverOpacity') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.hoverHighlight = component.data[0];
    component.hoverStyle = EXPECTEDHOVERSTYLE;
    component.hoverOpacity = EXPECTEDHOVEROPACITY;
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      EXPECTEDHOVERSTYLE.strokeWidth + customRadiusModifier[2],
      EXPECTEDHOVERSTYLE.strokeWidth + 1 + customRadiusModifier[3]
    ];

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const expectedStrokeColor = getAccessibleStrokes(EXPECTEDHOVERSTYLE.color)[0];
    const expectedScatterStrokeWidth = EXPECTEDHOVERSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');
      const selectedMarkHighlightContainer = page.doc.querySelector('.vcl-accessibility-focus-highlight');
      const selectedMarkHighlightClip = selectedMarkHighlightContainer.childNodes[0];
      const selectedMarkHighlightElement = selectedMarkHighlightContainer.childNodes[1];
      const isRGB = checkRGB(selectedMarkHighlightElement);
      const clipID = `url(#${selectedMarkHighlightClip['getAttribute']('id')})`;

      // SOURCE MARK TESTS
      expect(selectedMark).toHaveClass('vcl-accessibility-focus-hoverSource');
      expect(selectedMark.getAttribute('filter').indexOf('-hover-')).toBeGreaterThan(0);

      // TEST THAT FOCUS HIGHLIGHT ELEMENTS ARE CREATED
      expect(selectedMarkHighlightContainer).toBeTruthy();
      expect(selectedMarkHighlightClip).toBeTruthy();
      expect(selectedMarkHighlightClip.nodeName).toEqual('clipPath');
      expect(selectedMarkHighlightElement).toBeTruthy();
      expect(selectedMarkHighlightElement.nodeName).not.toEqual('clipPath');
      expect(selectedMarkHighlightElement).toEqualAttribute('clip-path', clipID);

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke-width')).toEqual(
        `${EXPECTEDHOVERSTYLE.strokeWidth * 2}px`
      );

      // STROKE COLOR TEST
      expect(selectedMarkHighlightElement['style'].getPropertyValue('fill')).toEqual('none');
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke')).toEqual(
        isRGB ? rgb(expectedStrokeColor) : expectedStrokeColor
      );
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : EXPECTEDHOVERSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);

      // FILL COLOR TEST
      if (!(selectedMark.getAttribute('fill') === 'none')) {
        expect(selectedMark).toEqualAttribute('fill', EXPECTEDHOVERSTYLE.color);
      }
    }
    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', EXPECTEDHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', EXPECTEDHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', EXPECTEDHOVEROPACITY);
    }
  }
};

export const interaction_hoverStyle_custom_update = {
  prop: 'hoverStyle',
  group: 'interaction',
  name: 'on hover (update) the mark should be custom hoverStyle and others should have hoverOpacity',
  testProps: {
    hoverOpacity: CUSTOMHOVEROPACITY,
    hoverStyle: CUSTOMCLICKSTYLE
  },
  testSelector: '[data-testid=mark]',
  negTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    negTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDHOVERSTYLE = testProps['hoverStyle'] ? testProps['hoverStyle'] : CUSTOMCLICKSTYLE;
    const EXPECTEDHOVEROPACITY = testProps['hoverOpacity'] ? testProps['hoverOpacity'] : CUSTOMHOVEROPACITY;
    let useFilter = true;
    let fillStrokeOpacity = false;
    let applyFlushTransitions = true;
    let customRadiusModifier = [0, 0, 0, 0, 0];
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'useFilter') {
          useFilter = testProps[testProp];
        } else if (testProp === 'fillStrokeOpacity') {
          fillStrokeOpacity = testProps[testProp];
        } else if (testProp === 'applyFlushTransitions') {
          applyFlushTransitions = testProps[testProp];
        } else if (testProp === 'customRadiusModifier') {
          customRadiusModifier = testProps[testProp];
        } else if (testProp !== 'hoverStyle' && testProp !== 'hoverOpacity') {
          component[testProp] = testProps[testProp];
        }
      });
    }
    component.hoverStyle = EXPECTEDHOVERSTYLE;
    component.hoverOpacity = EXPECTEDHOVEROPACITY;
    const expectedMorphRadius = [
      1 + customRadiusModifier[0],
      0 + customRadiusModifier[1],
      EXPECTEDHOVERSTYLE.strokeWidth + customRadiusModifier[2],
      EXPECTEDHOVERSTYLE.strokeWidth + 1 + customRadiusModifier[3]
    ];

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    const selectedMark = page.doc.querySelector(testSelector);
    const notSelectedMark = page.doc.querySelector(negTestSelector);
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // ACT UPDATE
    component.hoverHighlight = component.data[0];
    await page.waitForChanges();

    // ASSERT
    // GET MARKS SELECTED AND NOT
    if (applyFlushTransitions) {
      flushTransitions(selectedMark);
      flushTransitions(notSelectedMark);
      await page.waitForChanges();
    }

    // FIGURE OUT WHAT COLOR THEY ARE AND DETERMINE EXPECTED STROKE USING OUR UTIL
    const expectedStrokeColor = getAccessibleStrokes(EXPECTEDHOVERSTYLE.color)[0];
    const expectedScatterStrokeWidth = EXPECTEDHOVERSTYLE.strokeWidth / component.dotRadius;

    // DETERMINE WHICH TYPE OF TEST WE ARE DOING (TEXTURE BASED FILTER OR NOT)
    if (useFilter) {
      // GET THE FILTER OF THE SELECTED MARK AND STORE KEY ATTRIBUTES INTO AN OBJECT FOR EASE OF TESTING
      const selectedMarkFilter = page.doc.querySelector(
        selectedMark
          .getAttribute('filter')
          .replace('url(', '')
          .replace(')', '')
      );
      const selectedMarkMorphs = selectedMarkFilter.querySelectorAll('feMorphology');
      const selectedMarkHighlightContainer = page.doc.querySelector('.vcl-accessibility-focus-highlight');
      const selectedMarkHighlightClip = selectedMarkHighlightContainer.childNodes[0];
      const selectedMarkHighlightElement = selectedMarkHighlightContainer.childNodes[1];
      const isRGB = checkRGB(selectedMarkHighlightElement);
      const clipID = `url(#${selectedMarkHighlightClip['getAttribute']('id')})`;

      // SOURCE MARK TESTS
      expect(selectedMark).toHaveClass('vcl-accessibility-focus-hoverSource');
      expect(selectedMark.getAttribute('filter').indexOf('-hover-')).toBeGreaterThan(0);

      // TEST THAT FOCUS HIGHLIGHT ELEMENTS ARE CREATED
      expect(selectedMarkHighlightContainer).toBeTruthy();
      expect(selectedMarkHighlightClip).toBeTruthy();
      expect(selectedMarkHighlightClip.nodeName).toEqual('clipPath');
      expect(selectedMarkHighlightElement).toBeTruthy();
      expect(selectedMarkHighlightElement.nodeName).not.toEqual('clipPath');
      expect(selectedMarkHighlightElement).toEqualAttribute('clip-path', clipID);

      // STROKE WIDTH TESTS
      selectedMarkMorphs.forEach((morph, i) => {
        expect(morph).toEqualAttribute('radius', expectedMorphRadius[i]);
      });
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke-width')).toEqual(
        `${EXPECTEDHOVERSTYLE.strokeWidth * 2}px`
      );

      // STROKE COLOR TEST
      expect(selectedMarkHighlightElement['style'].getPropertyValue('fill')).toEqual('none');
      expect(selectedMarkHighlightElement['style'].getPropertyValue('stroke')).toEqual(
        isRGB ? rgb(expectedStrokeColor) : expectedStrokeColor
      );
    } else {
      // STROKE WIDTH TESTS
      expect(selectedMark).toEqualAttribute(
        'stroke-width',
        component.tagName.toLowerCase() === 'scatter-plot' ? expectedScatterStrokeWidth : EXPECTEDHOVERSTYLE.strokeWidth
      );

      // STROKE COLOR TEST
      expect(selectedMark).toEqualAttribute('stroke', expectedStrokeColor);

      // FILL COLOR TEST
      if (!(selectedMark.getAttribute('fill') === 'none')) {
        expect(selectedMark).toEqualAttribute('fill', EXPECTEDHOVERSTYLE.color);
      }
    }
    // HOVER OPACITY TEST
    if (fillStrokeOpacity) {
      expect(notSelectedMark).toEqualAttribute('fill-opacity', EXPECTEDHOVEROPACITY);
      expect(notSelectedMark).toEqualAttribute('stroke-opacity', EXPECTEDHOVEROPACITY);
    } else {
      expect(notSelectedMark).toEqualAttribute('opacity', EXPECTEDHOVEROPACITY);
    }
  }
};
