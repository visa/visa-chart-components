/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
// tslint:disable: no-string-literal
import { SpecPage } from '@stencil/core/testing';
import { asyncForEach, flushTransitions, getTransitionDurations } from './unit-test-utils';
import Utils from '@visa/visa-charts-utils';

const { formatStats, visaColors, getTexture, getContrastingStroke, getColors } = Utils;

const mockFocusEvent = new Event('focus');
const mockKeyUpEvent = new KeyboardEvent('keyup');
const mockBBox = {
  x: 10,
  y: 10,
  height: 100,
  width: 100
};
// event polyfills => https://gist.github.com/hagi4u/1f344430ab764dabaa4f73e5a943ff93
// const mockStopPropagation = () => { this.cancelBubble = true };
// const mockPreventDefault = () => { this.returnValue = false };
// const mockKeyboardEvent = new KeyboardEvent('keydown', {});

const tooltipSelector = '[data-testid=tooltip-container]';
const emptyDescriptions = {
  'vcl-access-title': 'This chart has no title provided.',
  'vcl-access-subtitle': 'This chart has no subtitle provided.',
  'vcl-access-long-description': '', // 'This chart has no long description provided.',
  'vcl-access-context': '',
  'vcl-access-executive-summary': '', // 'This chart has no executive summary provided.',
  'vcl-access-purpose': '', // 'This chart has no information regarding its purpose provided.',
  'vcl-access-statistics': '', // 'This chart has no statistical explanation provided.',
  'vcl-access-layout': '', // 'This chart has no layout description provided.',
  'vcl-access-notes': '' // 'No notes provided regarding the structure of the chart.',
};
const axisDescriptions = {
  'vcl-access-xAxis': '', // 'This chart has no x axis.',
  'vcl-access-yAxis': '' // 'this chart has no y axis.',
};

const annotationDescriptions = {
  'vcl-access-annotation': '', // 'This chart has no annotations.',
  'vcl-access-annotation-title': '', // 'This chart displays an annotation with no title.',
  'vcl-access-annotation-description': '' // 'This annotation has no description provided.'
};

const classMap = {
  'vcl-access-title': 'title',
  'vcl-access-long-description': 'longDescription',
  'vcl-access-context': 'contextExplanation',
  'vcl-access-executive-summary': 'executiveSummary',
  'vcl-access-purpose': 'purpose',
  'vcl-access-statistics': 'statisticalNotes',
  'vcl-access-notes': 'structureNotes'
};

const headingsMap = {
  'vcl-region-label': 'p',
  'vcl-access-title': '0',
  'vcl-access-subtitle': '1',
  'vcl-access-executive-summary-heading': '1',
  'vcl-access-executive-summary': 'p',
  'vcl-access-purpose-heading': '1',
  'vcl-access-purpose': 'p',
  'vcl-access-long-description-heading': '1',
  'vcl-access-long-description': 'p',
  'vcl-access-context': 'p',
  'vcl-access-structure-heading': '1',
  'vcl-access-statistics-heading': '2',
  'vcl-access-statistics': 'p',
  'vcl-access-chart-layout-heading': '2',
  'vcl-access-layout': 'p',
  'vcl-access-xAxis': 'p',
  'vcl-access-yAxis': 'p',
  'vcl-access-notes': 'p'
};

const accessibilityGeomListeners = ['focus'];
const accessibilityControllerListeners = ['focus', 'blur', 'keydown', 'keyup'];

const hideAttributes = {
  'aria-hidden': 'true',
  role: 'presentation',
  focusable: 'false',
  tabindex: null
};

const showAttributes = {
  role: 'presentation',
  focusable: 'false',
  tabindex: -1
};

const categoricalColorArr = getColors('categorical', 3);
const testTextures = [];
[0, 1, 2].forEach(i => {
  testTextures.push(
    getTexture({
      scheme: 'categorical',
      id: `test-texture-id-${i}`,
      index: i,
      fillColor: categoricalColorArr[i],
      textureColor: getContrastingStroke(categoricalColorArr[i])
    })
  );
});

export const accessibility_instructions_default = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'default instruction elements should exist and have screen reader class',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    const instructionsChildren = accessibilityInstructionsContainer.childNodes;

    // ASSERT
    // IF IT IS THE FIRST CHILD IT SHOULD BE REGION LABEL
    expect(instructionsChildren[0]).toHaveClass('vcl-region-label');
    expect(instructionsChildren[0]).not.toHaveAttribute('tabindex');

    // CHECK THAT ALL CHIDREN HAVE THE SCREEN READER CLASS
    instructionsChildren.forEach(instruction => {
      expect(instruction).toHaveClass('screen-reader-info');
    });

    // ENSURE WE HAVE THE SECTIONS RELATED TO THE ACCESSIBILITY PROP DESCRIPTIONS
    Object.keys(emptyDescriptions).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      expect(descElement).toBeTruthy();
    });
  }
};

export const accessibility_instructions_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'custom instruction elements should exist and have screen reader class on load',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDACCESSIBILITY = {
      title: 'This is the chart title for testing purposes',
      longDescription: 'This is the long description provided for testing purposes',
      contextExplanation: 'This is the content explanation provided for testing purposes',
      executiveSummary: 'This is the executive summary provided for testing purposes',
      purpose: 'This is the purpose provided for testing purposes',
      statisticalNotes: 'This is the statistical notes provided for testing purposes',
      structureNotes: 'This is the structure notes provided for testing purposes'
    };
    component.accessibility = EXPECTEDACCESSIBILITY;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // CHECK WHETHER DESCRIPTIONS HAVE BEEN UPDATED
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    Object.keys(classMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      const expectedText =
        className === 'vcl-access-title'
          ? `Chart title: ${EXPECTEDACCESSIBILITY[classMap[className]]}`
          : EXPECTEDACCESSIBILITY[classMap[className]];
      expect(descElement).toEqualText(expectedText);
    });
  }
};

export const accessibility_instructions_update = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'custom instruction elements should exist and have screen reader class on update',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    const EXPECTEDACCESSIBILITY = {
      title: 'This is the chart title for testing purposes',
      longDescription: 'This is the long description provided for testing purposes',
      contextExplanation: 'This is the content explanation provided for testing purposes',
      executiveSummary: 'This is the executive summary provided for testing purposes',
      purpose: 'This is the purpose provided for testing purposes',
      statisticalNotes: 'This is the statistical notes provided for testing purposes',
      structureNotes: 'This is the structure notes provided for testing purposes'
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.accessibility = EXPECTEDACCESSIBILITY;
    await page.waitForChanges();

    // ASSERT
    // CHECK WHETHER DESCRIPTIONS HAVE BEEN UPDATED
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    Object.keys(classMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      const expectedText =
        className === 'vcl-access-title'
          ? `Chart title: ${EXPECTEDACCESSIBILITY[classMap[className]]}`
          : EXPECTEDACCESSIBILITY[classMap[className]];
      expect(descElement).toEqualText(expectedText);
    });
  }
};

export const accessibility_headings_default = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should have default html tags',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    // ACCESSIBILITY SECTIONS HAVE THE CORRECT TAGS
    Object.keys(headingsMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      const classString = className;
      let expectedHeading = '';
      switch (headingsMap[className]) {
        case 'p':
          expectedHeading = 'p';
          break;
        case '0':
          expectedHeading = 'h2';
          break;
        case '1':
          expectedHeading = 'h3';
          break;
        case '2':
          expectedHeading = 'h4';
          break;
      }
      // if it is a heading by default it will not render due to empty prop, except for two of them
      if (
        className.endsWith('-heading') &&
        !className.endsWith('-structure-heading') &&
        !className.endsWith('-layout-heading')
      ) {
        expect(descElement).toBeNull;
      } else {
        expect(descElement.nodeName.toLowerCase()).toEqual(expectedHeading);
      }
    });
  }
};

export const accessibility_headings_load_h3 = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should have h3+ html tags and headings on load',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.highestHeadingLevel = 'h3';
    component.accessibility = {
      ...component.accessibility,
      ...{
        longDescription: 'This is a test long description',
        executiveSummary: 'This is a test executive summary',
        purpose: 'This is a test purpose',
        contextExplanation: 'This is a test context explanation',
        title: 'This is a test title',
        statisticalNotes: 'This is a test statistical note',
        structureNotes: 'This is a test structure note'
      }
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);

    // ACCESSIBILITY SECTIONS HAVE THE CORRECT TAGS
    Object.keys(headingsMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      let expectedHeading = '';
      switch (headingsMap[className]) {
        case 'p':
          expectedHeading = 'p';
          break;
        case '0':
          expectedHeading = 'h3';
          break;
        case '1':
          expectedHeading = 'h4';
          break;
        case '2':
          expectedHeading = 'h5';
          break;
      }
      // we are passing all descriptions so we should have all headings
      expect(descElement.nodeName.toLowerCase()).toEqual(expectedHeading);
    });
  }
};

export const accessibility_headings_load_div = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should have div html tags on load',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.highestHeadingLevel = 'div';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    // ACCESSIBILITY SECTIONS HAVE THE CORRECT TAGS
    Object.keys(headingsMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      const expectedHeading = 'div';
      // if it is a heading by default it will not render due to empty prop, except for two of them
      if (
        className.endsWith('-heading') &&
        !className.endsWith('-structure-heading') &&
        !className.endsWith('-layout-heading')
      ) {
        expect(descElement).toBeNull;
      } else {
        expect(descElement.nodeName.toLowerCase()).toEqual(expectedHeading);
      }
    });
  }
};

export const accessibility_headings_update_h4 = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should have h4+ html tags and all headings on update',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.highestHeadingLevel = 'h4';
    component.accessibility = {
      ...component.accessibility,
      ...{
        longDescription: 'This is a test long description',
        executiveSummary: 'This is a test executive summary',
        purpose: 'This is a test purpose',
        contextExplanation: 'This is a test context explanation',
        title: 'This is a test title',
        statisticalNotes: 'This is a test statistical note',
        structureNotes: 'This is a test structure note'
      }
    };
    await page.waitForChanges();

    // ASSERT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);

    // ACCESSIBILITY SECTIONS HAVE THE CORRECT TAGS
    Object.keys(headingsMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      let expectedHeading = '';
      switch (headingsMap[className]) {
        case 'p':
          expectedHeading = 'p';
          break;
        case '0':
          expectedHeading = 'h4';
          break;
        case '1':
          expectedHeading = 'h5';
          break;
        case '2':
          expectedHeading = 'h6';
          break;
      }
      // since we are passing all descriptions we should have all headings
      expect(descElement.nodeName.toLowerCase()).toEqual(expectedHeading);
    });
  }
};

export const accessibility_headings_update_p = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should have p html tags on update',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.highestHeadingLevel = 'p';
    await page.waitForChanges();

    // ASSERT
    const accessibilityInstructionsContainer = page.doc.querySelector(testSelector);
    // ACCESSIBILITY SECTIONS HAVE THE CORRECT TAGS
    Object.keys(headingsMap).forEach(className => {
      const descElement = accessibilityInstructionsContainer.querySelector(`.${className}`);
      const expectedHeading = 'p';
      // if it is a heading by default it will not render due to empty prop, except for two of them
      if (
        className.endsWith('-heading') &&
        !className.endsWith('-structure-heading') &&
        !className.endsWith('-layout-heading')
      ) {
        expect(descElement).toBeNull;
      } else {
        expect(descElement.nodeName.toLowerCase()).toEqual(expectedHeading);
      }
    });
  }
};

export const accessibility_keyboard_instructions_default = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard instruction component renders in default state',
  testProps: {},
  testSelector: 'keyboard-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    const defaultHeaderText = 'Select to View Keyboard Instructions';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const keyboardInstructionsElement = page.root.querySelector(testSelector);
    const keyboardInstructionsOuterContainer = keyboardInstructionsElement.querySelector(
      '.visa-viz-keyboard-instructions-outer-container'
    );
    const keyboardInstructionsHeaderContainer = keyboardInstructionsOuterContainer.querySelector(
      '.vcc-ki-keyboard-instructions-header'
    );
    // const keyboardInstructionsButtonContainer = keyboardInstructionsOuterContainer.querySelector('.visa-viz-keyboard-instructions-button-wrapper');
    const keyboardInstructionsContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-container'
    );

    // now we can check the instructions table
    // ASSERT - by default the table or hover message are not shown
    expect(keyboardInstructionsOuterContainer).toBeTruthy();
    expect(keyboardInstructionsOuterContainer).not.toHaveClass('vcc-ki-bordered');

    // the header should be minized by default and the message should be its default
    expect(keyboardInstructionsHeaderContainer).toHaveClass('vcc-ki-minimize');
    expect(keyboardInstructionsHeaderContainer.querySelector('.vcc-ki-keyboard-heading')).toEqualText(
      defaultHeaderText
    );

    // the instructions container should exist and be empty by default
    expect(keyboardInstructionsContainer).toBeTruthy();
    expect(keyboardInstructionsContainer.childNodes.length).toEqual(0);
  }
};

export const accessibility_keyboard_instructions_focus_state = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard instruction component shows header in focus state',
  testProps: {},
  testSelector: 'keyboard-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    const defaultHeaderText = 'Select to View Keyboard Instructions';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const keyboardInstructionsElement = page.root.querySelector(testSelector);
    const keyboardInstructionsOuterContainer = keyboardInstructionsElement.querySelector(
      '.visa-viz-keyboard-instructions-outer-container'
    );
    const keyboardInstructionsHeaderContainer = keyboardInstructionsOuterContainer.querySelector(
      '.vcc-ki-keyboard-instructions-header'
    );
    const keyboardInstructionsButtonContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-button-wrapper'
    );
    const keyboardInstructionsButton = keyboardInstructionsButtonContainer.querySelector('button');
    const keyboardInstructionsContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-container'
    );

    // now we focus the button
    keyboardInstructionsButton.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    // now we can check the instructions table
    // ASSERT - by default the table or hover message are not shown
    expect(keyboardInstructionsOuterContainer).toBeTruthy();
    expect(keyboardInstructionsOuterContainer).toHaveClass('vcc-ki-bordered');

    // the header should be minized by default and the message should be its default
    expect(keyboardInstructionsHeaderContainer).not.toHaveClass('vcc-ki-minimize');
    expect(keyboardInstructionsHeaderContainer.querySelector('.vcc-ki-keyboard-heading')).toEqualText(
      defaultHeaderText
    );

    // the instructions container should exist and be empty by default
    expect(keyboardInstructionsContainer).toBeTruthy();
    expect(keyboardInstructionsContainer.childNodes.length).toEqual(0);
  }
};

export const accessibility_keyboard_instructions_click_state = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard instruction component displays table in click state',
  testProps: {},
  testSelector: 'keyboard-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    const tableHeaderText = 'Keyboard Instructions';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const keyboardInstructionsElement = page.root.querySelector(testSelector);
    const keyboardInstructionsOuterContainer = keyboardInstructionsElement.querySelector(
      '.visa-viz-keyboard-instructions-outer-container'
    );
    const keyboardInstructionsHeaderContainer = keyboardInstructionsOuterContainer.querySelector(
      '.vcc-ki-keyboard-instructions-header'
    );
    const keyboardInstructionsButtonContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-button-wrapper'
    );
    const keyboardInstructionsButton = keyboardInstructionsButtonContainer.querySelector('button');
    const keyboardInstructionsContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-container'
    );

    // now we click the button
    keyboardInstructionsButton.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    // now we can check the instructions table
    // ASSERT - by default the table or hover message are not shown
    expect(keyboardInstructionsOuterContainer).toBeTruthy();
    expect(keyboardInstructionsOuterContainer).toHaveClass('vcc-ki-bordered');

    // the header should be minized by default and the message should be its default
    expect(keyboardInstructionsHeaderContainer).not.toHaveClass('vcc-ki-minimize');
    expect(keyboardInstructionsHeaderContainer.querySelector('.vcc-ki-keyboard-heading')).toEqualText(tableHeaderText);

    // the instructions container should exist and be empty by default
    expect(keyboardInstructionsContainer).toBeTruthy();
    expect(keyboardInstructionsContainer.childNodes.length).toBeGreaterThan(0);
    expect(keyboardInstructionsContainer).toMatchSnapshot();
  }
};

export const accessibility_keyboard_instructions_click_state_interactive = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard instruction component displays table in click state with space enabled',
  testProps: {},
  testSelector: 'keyboard-instructions',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    const tableHeaderText = 'Keyboard Instructions';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    // set interface to true
    component.accessibility = { ...component.accessibility, elementsAreInterface: true };

    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const keyboardInstructionsElement = page.root.querySelector(testSelector);
    const keyboardInstructionsOuterContainer = keyboardInstructionsElement.querySelector(
      '.visa-viz-keyboard-instructions-outer-container'
    );
    const keyboardInstructionsHeaderContainer = keyboardInstructionsOuterContainer.querySelector(
      '.vcc-ki-keyboard-instructions-header'
    );
    const keyboardInstructionsButtonContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-button-wrapper'
    );
    const keyboardInstructionsButton = keyboardInstructionsButtonContainer.querySelector('button');
    const keyboardInstructionsContainer = keyboardInstructionsOuterContainer.querySelector(
      '.visa-viz-keyboard-instructions-container'
    );

    // now we click the button
    keyboardInstructionsButton.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    // now we can check the instructions table
    // ASSERT - by default the table or hover message are not shown
    expect(keyboardInstructionsOuterContainer).toBeTruthy();
    expect(keyboardInstructionsOuterContainer).toHaveClass('vcc-ki-bordered');

    // the header should be minized by default and the message should be its default
    expect(keyboardInstructionsHeaderContainer).not.toHaveClass('vcc-ki-minimize');
    expect(keyboardInstructionsHeaderContainer.querySelector('.vcc-ki-keyboard-heading')).toEqualText(tableHeaderText);

    // the instructions container should exist and be empty by default
    expect(keyboardInstructionsContainer).toBeTruthy();
    expect(keyboardInstructionsContainer.childNodes.length).toBeGreaterThan(0);
    expect(keyboardInstructionsContainer).toMatchSnapshot();
  }
};

export const accessibility_static_geometry_initialize = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'attributes should be added to static geometries on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    component.suppressEvents = true;
    component.accessibility = {
      ...component.accessibility,
      ...{ elementsAreInterface: false, keyboardNavConfig: { disabled: true } }
    };

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT - ELEMENTS
    const elements = page.doc.querySelectorAll(testSelector);
    elements.forEach(element => {
      expect(element).toEqualAttribute('tabindex', -1);
      expect(element).toEqualAttribute('role', 'presentation');
      expect(element).toEqualAttribute('focusable', false);
      expect(element).toEqualAttribute('data-role', 'img');
      expect(element.getAttribute('id')).toBeTruthy();
      expect(element['__on']).toBeFalsy(); // listeners should not be added as we have applied suppress events and disable keyboard nav
    });
  }
};

export const accessibility_geometry_initialize = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'attributes should be added to geometries on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT - ELEMENTS
    const elements = page.doc.querySelectorAll(testSelector);
    elements.forEach((element, i) => {
      expect(element).toEqualAttribute('tabindex', -1);
      expect(element).toEqualAttribute('role', 'presentation');
      expect(element).toEqualAttribute('focusable', false);
      expect(element).toEqualAttribute('data-role', 'img');
      expect(element.getAttribute('id')).toBeTruthy();
      accessibilityGeomListeners.forEach(expectedListener => {
        const matchedListener = element['__on'].find(o => o.type === expectedListener);
        expect(matchedListener).toBeTruthy();
      });
    });
  }
};

// this test is no longer needed as a result of the controller implementation.
// export const accessibility_group_initialize_and_hide = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'attributes should be added to groups on load, non-essential groups should be hidden',
//   testProps: {},
//   testSelector: '[data-testid=group]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         component[testProp] = testProps[testProp];
//       });
//     }

//     // ACT
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ASSERT
//     const paddingContainer = page.doc.querySelector('[data-testid=padding-container]');
//     paddingContainer.childNodes.forEach(group => {
//       if (group.nodeName === 'g') {
//         if (group['getAttribute']('data-testid') === testSelector.replace('[data-testid=', '').replace(']', '')) {
//           Object.keys(showAttributes).forEach(attr => {
//             expect(group).toEqualAttribute(attr, showAttributes[attr]);
//           });
//         } else {
//           Object.keys(hideAttributes).forEach(attr => {
//             expect(group).toEqualAttribute(attr, hideAttributes[attr]);
//           });
//         }
//       }
//     });
//   }
// };

export const accessibility_controller_initialize = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'controller div should be created and attributes should be added on load',
  testProps: {},
  testSelector: '[data-testid=controller]',
  nextTestSelector: '[data-testid=svg]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const titleText = `${component.mainTitle}. `;
    const subtitle = component.subTitle ? component.subTitle + '. ' : '';
    const descText = `${subtitle} Navigate into the chart area by pressing ENTER. ID: ${component.uniqueID}`;
    const ariaLabel = titleText + descText;

    const controller = page.doc.querySelector(testSelector);
    const rootSVG = page.doc.querySelector(nextTestSelector);
    // flushTransitions(rootSVG);
    // await page.waitForChanges();

    // check that controller has correct setup
    expect(controller).toEqualAttribute('tabindex', 0);
    expect(controller).toEqualAttribute('role', 'application');
    expect(controller).toEqualAttribute('id', `chart-area-${component.uniqueID}`);
    expect(controller).toEqualText(`Interactive ${component.nodeName.toLowerCase()}.`);
    expect(controller).toEqualAttribute('aria-label', ariaLabel);

    // check that the rootSVG has hidden attributes applied to it
    expect(rootSVG).toEqualAttribute('role', 'presentation');
    expect(rootSVG).toEqualAttribute('focusable', false);
    expect(rootSVG).toEqualAttribute('tabindex', -1);
    expect(rootSVG).toEqualAttribute('style', 'overflow: hidden;');
    expect(rootSVG['__on']).toBeTruthy();
    expect(rootSVG['__on'].length).toBeGreaterThanOrEqual(1);
    const focusObject = rootSVG['__on'].find(o => o.type === 'focus');
    expect(focusObject).toBeTruthy();
  }
};

export const accessibility_static_controller_initialize = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'controller div should be created and static image attributes should be added on load',
  testProps: {},
  testSelector: '[data-testid=controller]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    // these props are required for this behavior to take place
    component.suppressEvents = true;
    component.accessibility = {
      ...component.accessibility,
      ...{ elementsAreInterface: false, keyboardNavConfig: { disabled: true } }
    };

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const titleText = `${component.mainTitle}. `;
    const regionText = `Static ${component.tagName.toLowerCase()} image, Titled: ${titleText}This section contains additional information about this chart. Pressing TAB will focus the data table button.`;

    const controller = page.doc.querySelector(testSelector);
    const regionLabel = page.doc.querySelector('.vcl-region-label');
    expect(controller).toEqualAttribute('tabindex', -1);
    expect(controller).toEqualAttribute('role', 'presentation');
    expect(controller).toEqualAttribute('id', `chart-area-${component.uniqueID}`);
    expect(controller).toEqualText('');

    // during the simple chart implementation, the explanation text is attached to the region label.
    expect(regionLabel).toEqualText(regionText);
  }
};

// export const accessibility_geometry_aria_label_default = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to geometries on load',
//   testProps: {},
//   testSelector: '[data-testid=mark]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ASSERT
//     const elements = page.doc.querySelectorAll(testSelector);
//     const elementCount = elements.length;
//     elements.forEach((element, i) => {
//       const elementData = element['__data__'];
//       const valueLabel = `${formatStats(elementData[component.valueAccessor], '0.[0][0]a')}.`;
//       const ordinalLabel = ` ${elementData[component.ordinalAccessor]}.`;
//       const sizeLabel = ` ${geometryType} ${i + 1} of ${elementCount}.`;
//       const EXPECTEDLABEL = valueLabel + ordinalLabel + sizeLabel;

//       expect(element).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_geometry_aria_label_remove_update = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to geometries on update (exit)',
//   testProps: {},
//   testSelector: '[data-testid=mark]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     const tempData = [...component.data];
//     tempData.pop();

//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT RENDER
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // GET ELEMENTS AND SET COUNT TO ELEMENT - 1
//     const origElements = page.doc.querySelectorAll(testSelector);
//     const origElementCount = origElements.length - 1;

//     // ACT UPDATE AND FLUSH TRANSITIONS
//     component.data = tempData;
//     await asyncForEach(origElements, async element => {
//       flushTransitions(element);
//       await page.waitForChanges();
//     });

//     // ASSERT
//     const elements = page.doc.querySelectorAll(testSelector);
//     elements.forEach((element, i) => {
//       const elementData = element['__data__'];
//       const valueLabel = `${formatStats(elementData[component.valueAccessor], '0.[0][0]a')}.`;
//       const ordinalLabel = ` ${elementData[component.ordinalAccessor]}.`;
//       const sizeLabel = ` ${geometryType} ${i + 1} of ${origElementCount}.`;
//       const EXPECTEDLABEL = valueLabel + ordinalLabel + sizeLabel;

//       expect(element).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_geometry_aria_label_add_update = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to geometries on update (enter)',
//   testProps: {},
//   testSelector: '[data-testid=mark]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     const newData = [...component.data];
//     component.data.pop();

//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT RENDER
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // GET ELEMENTS AND SET COUNT TO ELEMENT + 1
//     const origElements = page.doc.querySelectorAll(testSelector);
//     const origElementCount = origElements.length + 1;

//     // ACT UPDATE AND FLUSH TRANSITIONS
//     component.data = newData;
//     await page.waitForChanges();

//     // FLUSH TRANSITION ON THE ELEMENT SELECTED (SHOULD BE THE FIRST GEOMETRY)
//     const elements = page.doc.querySelectorAll(testSelector);
//     await asyncForEach(elements, async element => {
//       flushTransitions(element);
//       await page.waitForChanges();
//     });

//     const elementData = elements[0]['__data__'];
//     const valueLabel = `${formatStats(elementData[component.valueAccessor], '0.[0][0]a')}.`;
//     const ordinalLabel = ` ${elementData[component.ordinalAccessor]}.`;
//     const sizeLabel = ` ${geometryType} 1 of ${origElementCount}.`;
//     const EXPECTEDLABEL = valueLabel + ordinalLabel + sizeLabel;

//     expect(elements[0]).toEqualAttribute('aria-label', EXPECTEDLABEL);
//   }
// };

// export const accessibility_geometry_aria_label_includeDataKeys_load = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated with data keys and added to geometries on load',
//   testProps: {},
//   testSelector: '[data-testid=mark]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     component.accessibility = { ...component.accessibility, includeDataKeyNames: true };

//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ASSERT
//     const elements = page.doc.querySelectorAll(testSelector);
//     const elementCount = elements.length;
//     elements.forEach((element, i) => {
//       const elementData = element['__data__'];
//       const valueLabel = `${component.valueAccessor}: ${formatStats(
//         elementData[component.valueAccessor],
//         '0.[0][0]a'
//       )}.`;
//       const ordinalLabel = ` ${component.ordinalAccessor}: ${elementData[component.ordinalAccessor]}.`;
//       const sizeLabel = ` ${geometryType} ${i + 1} of ${elementCount}.`;
//       const EXPECTEDLABEL = valueLabel + ordinalLabel + sizeLabel;

//       expect(element).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_geometry_aria_label_includeDataKeys_update = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated with data keys and added to geometries on update',
//   testProps: {},
//   testSelector: '[data-testid=mark]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT RENDER
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ACT UPDATE
//     component.accessibility = { ...component.accessibility, includeDataKeyNames: true };
//     await page.waitForChanges();

//     // ASSERT
//     const elements = page.doc.querySelectorAll(testSelector);
//     const elementCount = elements.length;
//     elements.forEach((element, i) => {
//       const elementData = element['__data__'];
//       const valueLabel = `${component.valueAccessor}: ${formatStats(
//         elementData[component.valueAccessor],
//         '0.[0][0]a'
//       )}.`;
//       const ordinalLabel = ` ${component.ordinalAccessor}: ${elementData[component.ordinalAccessor]}.`;
//       const sizeLabel = ` ${geometryType} ${i + 1} of ${elementCount}.`;
//       const EXPECTEDLABEL = valueLabel + ordinalLabel + sizeLabel;

//       expect(element).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_group_aria_label_default = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to groups on load',
//   testProps: {},
//   testSelector: '[data-testid=group]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ASSERT
//     const groups = page.doc.querySelectorAll(testSelector);
//     const groupsCount = groups.length;
//     groups.forEach((group, i) => {
//       const groupData = group['__data__'];
//       const elementCount = groupData ? groupData.values.length : group.childNodes.length;
//       const manyGroupLabel = groupsCount > 1 ? ` ${i} of ${groupsCount}` : '';
//       const groupAccessorLabel = groupsCount > 1 ? `${groupData.key}. ` : '';
//       const groupLabel = `${groupAccessorLabel}${geometryType} group${manyGroupLabel} which contains ${elementCount} interactive ${geometryType.toLowerCase()}s.`;
//       const EXPECTEDLABEL = groupLabel;

//       expect(group).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_group_aria_label_remove_update = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to groups on data update (exit)',
//   testProps: {},
//   testSelector: '[data-testid=group]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     const tempData = [...component.data];
//     tempData.pop();

//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT RENDER
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // GET GROUPS - THIS COULD CAUSE ISSUES IF WE LOSE A GROUP
//     const groups = page.doc.querySelectorAll(testSelector);
//     const groupsCount = groups.length;

//     // ACT UPDATE AND FLUSH TRANSITIONS
//     component.data = tempData;
//     await asyncForEach(groups, async group => {
//       await asyncForEach(group.childNodes, async child => {
//         flushTransitions(child);
//         await page.waitForChanges();
//       });
//     });

//     // ASSERT
//     groups.forEach((group, i) => {
//       const groupData = group['__data__'];
//       const elementCount = groupData ? groupData.values.length : group.childNodes.length;
//       const manyGroupLabel = groupsCount > 1 ? ` ${i} of ${groupsCount}` : '';
//       const groupAccessorLabel = groupsCount > 1 ? `${groupData.key}. ` : '';
//       const groupLabel = `${groupAccessorLabel}${geometryType} group${manyGroupLabel} which contains ${elementCount} interactive ${geometryType.toLowerCase()}s.`;
//       const EXPECTEDLABEL = groupLabel;

//       expect(group).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_group_aria_label_add_update = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated and added to groups on data update (enter)',
//   testProps: {},
//   testSelector: '[data-testid=group]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     let geometryType;
//     const newData = [...component.data];
//     component.data.pop();

//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT RENDER
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // GET GROUPS - THIS COULD CAUSE ISSUES IF WE LOSE A GROUP
//     const groups = page.doc.querySelectorAll(testSelector);
//     const groupsCount = groups.length;

//     // ACT UPDATE AND FLUSH TRANSITIONS
//     component.data = newData;
//     await asyncForEach(groups, async group => {
//       await asyncForEach(group.childNodes, async child => {
//         flushTransitions(child);
//         await page.waitForChanges();
//       });
//     });

//     // ASSERT
//     groups.forEach((group, i) => {
//       const groupData = group['__data__'];
//       const elementCount = groupData ? groupData.values.length : group.childNodes.length;
//       const manyGroupLabel = groupsCount > 1 ? ` ${i} of ${groupsCount}` : '';
//       const groupAccessorLabel = groupsCount > 1 ? `${groupData.key}. ` : '';
//       const groupLabel = `${groupAccessorLabel}${geometryType} group${manyGroupLabel} which contains ${elementCount} interactive ${geometryType.toLowerCase()}s.`;
//       const EXPECTEDLABEL = groupLabel;

//       expect(group).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

// export const accessibility_group_aria_label_includeDataKeys_load = {
//   prop: 'accessibility',
//   group: 'accessibility',
//   name: 'aria labels should be generated with data keys and added to groups on load',
//   testProps: {},
//   testSelector: '[data-testid=group]',
//   testFunc: async (
//     component: any,
//     page: SpecPage,
//     testProps: object,
//     testSelector: string,
//     nextTestSelector: string
//   ) => {
//     // ARRANGE
//     component.accessibility = { ...component.accessibility, includeDataKeyNames: true };
//     let geometryType;
//     // if we have any testProps apply them
//     if (Object.keys(testProps).length) {
//       Object.keys(testProps).forEach(testProp => {
//         if (testProp === 'geometryType') {
//           geometryType = testProps[testProp];
//         } else {
//           component[testProp] = testProps[testProp];
//         }
//       });
//     }

//     // ACT
//     page.root.appendChild(component);
//     await page.waitForChanges();

//     // ASSERT
//     const groups = page.doc.querySelectorAll(testSelector);
//     const groupsCount = groups.length;
//     groups.forEach((group, i) => {
//       const groupData = group['__data__'];
//       const elementCount = groupData ? groupData.values.length : group.childNodes.length;
//       const manyGroupLabel = groupsCount > 1 ? ` ${i} of ${groupsCount}` : '';
//       const groupAccessorLabel = groupsCount > 1 ? `${component.groupAccessor}: ${groupData.key}. ` : '';
//       const groupLabel = `${groupAccessorLabel}${geometryType} group${manyGroupLabel} which contains ${elementCount} interactive ${geometryType.toLowerCase()}s.`;
//       const EXPECTEDLABEL = groupLabel;

//       expect(group).toEqualAttribute('aria-label', EXPECTEDLABEL);
//     });
//   }
// };

export const accessibility_focus_marker_style = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'focus marker style should be applied on focus',
  testProps: {},
  testSelector: '[data-id=mark-id]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    let geometryPlacementAttributes;
    let geometryAdjustmentValues;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'geometryPlacementAttributes') {
          geometryPlacementAttributes = testProps[testProp];
        } else if (testProp === 'geometryAdjustmentValues') {
          geometryAdjustmentValues = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT FOCUS
    const markerToFocus = page.root.querySelector(testSelector);
    const markerToFocusParent = markerToFocus.parentNode;

    // need to mock bbox on the element and parent g
    markerToFocus['getBBox'] = () => mockBBox;
    markerToFocusParent['getBBox'] = () => mockBBox;

    // now that bbox is mocked we can fire event
    markerToFocus.dispatchEvent(mockFocusEvent);

    // FIND FOCUS MARKER CONTAINER
    const focusMarkerG = page.root.querySelector('g.vcl-accessibility-focus-highlight');

    // ASSERT FOCUS
    expect(markerToFocus).toHaveClass('vcl-accessibility-focus-source');
    expect(focusMarkerG).toBeTruthy();
    expect(focusMarkerG.childNodes.length).toEqual(3);

    // check style of focus marker children
    // black outline testing
    const blackStrokeMarker = focusMarkerG.childNodes[0];
    expect(blackStrokeMarker['style'].getPropertyValue('stroke')).toEqual('#000000');
    expect(blackStrokeMarker['style'].getPropertyValue('opacity')).toEqual('1');
    expect(blackStrokeMarker['style'].getPropertyValue('strokeWidth')).toEqual('2px');
    geometryPlacementAttributes.forEach(attr => {
      const adjObject = geometryAdjustmentValues.find(o => o.f === attr);
      expect(adjObject).toBeTruthy(); // if this fails test is invalid
      expect(blackStrokeMarker).toEqualAttribute(
        attr,
        Number(markerToFocus.getAttribute(attr)) + adjObject['b'] * adjObject['s']
      );
    });

    // white outline testing
    const whiteStrokeMarker = focusMarkerG.childNodes[1];
    expect(whiteStrokeMarker['style'].getPropertyValue('stroke')).toEqual('#ffffff');
    expect(whiteStrokeMarker['style'].getPropertyValue('opacity')).toEqual('1');
    expect(whiteStrokeMarker['style'].getPropertyValue('strokeWidth')).toEqual('6px');
    geometryPlacementAttributes.forEach(attr => {
      const adjObject = geometryAdjustmentValues.find(o => o.f === attr);
      expect(adjObject).toBeTruthy(); // if this fails test is invalid
      expect(whiteStrokeMarker).toEqualAttribute(
        attr,
        Number(markerToFocus.getAttribute(attr)) + adjObject['w'] * adjObject['s']
      );
    });

    // clone testing
    const clonedMarker = focusMarkerG.childNodes[2];
    expect(clonedMarker).toEqualAttribute('fill-opacity', 0);
    expect(clonedMarker['style'].getPropertyValue('fill-opacity')).toEqual('0');
    geometryPlacementAttributes.forEach(attr => {
      expect(clonedMarker).toEqualAttribute(attr, markerToFocus.getAttribute(attr));
    });
  }
};

export const accessibility_focus_group_style = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'focus group style should be applied on focus',
  testProps: {},
  testSelector: '[data-testid=svg]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT FOCUS
    const markerToFocus = page.root.querySelector(testSelector);
    markerToFocus['getBBox'] = () => mockBBox;
    markerToFocus.dispatchEvent(mockFocusEvent);

    // FIND FOCUS MARKER CONTAINER
    const focusMarkers = markerToFocus.querySelectorAll('.vcl-accessibility-focus-root-highlight');
    expect(focusMarkers).toBeTruthy();
    expect(focusMarkers.length).toEqual(3);

    // ASSERT FOCUS
    // check style of focus marker children
    // black outline testing
    const blackStrokeMarker = focusMarkers[0];
    expect(blackStrokeMarker['style'].getPropertyValue('fill')).toEqual('none');
    expect(blackStrokeMarker['style'].getPropertyValue('stroke')).toEqual('#000000');
    expect(blackStrokeMarker['style'].getPropertyValue('opacity')).toEqual('1');
    expect(blackStrokeMarker['style'].getPropertyValue('strokeWidth')).toEqual('10px');

    // white outline testing
    const whiteStrokeMarker = focusMarkers[1];
    expect(whiteStrokeMarker['style'].getPropertyValue('fill')).toEqual('none');
    expect(whiteStrokeMarker['style'].getPropertyValue('stroke')).toEqual('#ffffff');
    expect(whiteStrokeMarker['style'].getPropertyValue('opacity')).toEqual('1');
    expect(whiteStrokeMarker['style'].getPropertyValue('strokeWidth')).toEqual('6px');

    // clone testing
    const clonedMarker = focusMarkers[2];
    expect(clonedMarker['style'].getPropertyValue('fill')).toEqual('none');
    expect(clonedMarker['style'].getPropertyValue('opacity')).toEqual('0');
  }
};

export const accessibility_keyboard_selection_test = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard nav: test whether space bar performs click action',
  testProps: {},
  testSelector: '[data-id=mark-id]',
  nextTestSelector: '[data-id=mark-id]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    const expectedData = testProps && testProps['expectedData'] ? testProps['expectedData'] : component.data[0];
    const keyDownObject = { key: 'Space', code: 'Space', keyCode: 32 };
    const _callback = jest.fn();
    const mockKeyboardEvent = new KeyboardEvent('keydown', { ...keyDownObject });

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    page.doc.addEventListener('clickEvent', _callback);
    await page.waitForChanges();

    // ACT
    // SELECT THE BAR GROUP AND MOCK THE OWNER SVG ELEMENT SINCE JSDOM DOESN'T HAVE THIS
    const ownerSVG = page.root.querySelector('[data-testid=chart-container] svg');

    // ASSERT GROUP MARKER AND THEN ENABLE SVG OWNER ON ITS PARENT
    const markerToClick = page.root.querySelector(testSelector);
    const markerGroup = markerToClick.parentElement;
    Object.defineProperty(markerToClick, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });
    Object.defineProperty(markerGroup, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });
    Object.defineProperty(markerGroup.parentNode, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });

    // Add fake BBOX to elements before dispatching events
    markerToClick['getBBox'] = () => mockBBox;
    markerGroup['getBBox'] = () => mockBBox;

    // ACT CLICK ON ELEMENT TO POPULATE THE CONTROLLER
    markerToClick.dispatchEvent(mockFocusEvent);
    await page.waitForChanges();

    // NOW WE SHOULD HAVE CONTROLLER NODES AS THEY WERE CREATED BY THE ABOVE FOCUS EVENT
    // IF THIS FAILS IT IS LIKELY DUE TO CONTROLLER NODES NOT BE CREATED CORRECTLY
    const controllerContainer = page.doc.querySelector('.VCL-controller');
    const focusedFigure = controllerContainer.querySelector('.VCL-controller-focused');

    // fake BBOX before we click
    // markerToClick['getBBox'] = () => mockBBox;
    focusedFigure.dispatchEvent(mockKeyboardEvent);
    await page.waitForChanges();

    // ASSERT
    expect(_callback).toHaveBeenCalled();

    // first we need to mock the targetNode id before the snapshot
    _callback.mock.calls[0][0].detail.target.id = 'chart-unit-test-123457-123457-123457';
    expect(_callback.mock.calls[0][0].detail.target).toMatchSnapshot();

    expect(_callback.mock.calls[0][0].detail.data).toMatchObject(expectedData);

    // FIRE THE KEYUP EVENT TO PREPARE FOR NEXT TEST
    focusedFigure.dispatchEvent(mockKeyUpEvent);
    await page.waitForChanges();
  }
};

export const accessibility_keyboard_nav_generic_test = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'keyboard nav: generic test to handle keyboard nav scenarios',
  testProps: {},
  testSelector: '[data-id=mark-id]',
  nextTestSelector: '[data-id=mark-id]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string,
    keyDownObject: object
  ) => {
    // ARRANGE
    let geometryPlacementAttributes;
    let selectorAriaLabel;
    let nextSelectorAriaLabel;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'geometryPlacementAttributes') {
          geometryPlacementAttributes = testProps[testProp];
        } else if (testProp === 'selectorAriaLabel') {
          selectorAriaLabel = testProps[testProp];
        } else if (testProp === 'nextSelectorAriaLabel') {
          nextSelectorAriaLabel = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }
    const innerMockKeyboardEvent = new KeyboardEvent('keydown', { ...keyDownObject });

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // SELECT THE BAR GROUP AND MOCK THE OWNER SVG ELEMENT SINCE JSDOM DOESN'T HAVE THIS
    const ownerSVG = page.root.querySelector('[data-testid=chart-container] svg');

    // ASSERT GROUP MARKER AND THEN ENABLE SVG OWNER ON ITS PARENT
    const markerToFocus = page.root.querySelector(testSelector);
    const markerGroup = markerToFocus.parentElement;
    Object.defineProperty(markerToFocus, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });
    Object.defineProperty(markerGroup, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });
    Object.defineProperty(markerGroup.parentNode, 'ownerSVGElement', {
      get: () => ownerSVG,
      set: () => {} // tslint:disable-line: no-empty
    });

    // Add fake BBOX to elements before dispatching events
    markerToFocus['getBBox'] = () => mockBBox;
    markerGroup['getBBox'] = () => mockBBox;

    // ACT CLICK ON ELEMENT TO POPULATE THE CONTROLLER
    markerToFocus.dispatchEvent(mockFocusEvent);
    await page.waitForChanges();

    // NOW WE SHOULD HAVE CONTROLLER NODES AS THEY WERE CREATED BY THE ABOVE FOCUS EVENT
    // IF THIS FAILS IT IS LIKELY DUE TO CONTROLLER NODES NOT BE CREATED CORRECTLY
    const controllerContainer = page.doc.querySelector('.VCL-controller');
    const focusedFigure = controllerContainer.querySelector('.VCL-controller-focused');

    // WE EXPECT FOCUSED CONTROLLER NODE TO EXIST, WITH SELECTED DATA SUMMARIZED IN TEXT/ARIA
    expect(focusedFigure).toBeTruthy();
    expect(focusedFigure).toEqualText(selectorAriaLabel);
    expect(focusedFigure).toEqualAttribute('aria-label', selectorAriaLabel);

    // IF THE MARKER RECEIVING FOCUS IS A GEOMETRY (E.G., NOT A G OR SVG) IT SHOULD BE CLASSED
    if (markerToFocus.tagName !== 'g' && markerToFocus.tagName !== 'svg') {
      expect(markerToFocus).toHaveClass('vcl-accessibility-focus-source');
    }

    // FIRE THE KEYBOARD EVENT
    focusedFigure.dispatchEvent(innerMockKeyboardEvent);
    await page.waitForChanges();

    // NOW THAT WE ARE FOCUSED MOCK .focus() on mark to receive focus
    const markerReceiveFocus = page.root.querySelector(nextTestSelector);
    const newFocusedFigure = controllerContainer.querySelector('.VCL-controller-focused');
    const markerReceiveFocusChildrenCount = (markerReceiveFocus.childNodes || []).length;
    markerReceiveFocus['focus'] = () => markerReceiveFocus.dispatchEvent(mockFocusEvent);
    markerGroup['getBBox'] = () => mockBBox;

    // ASSERT
    // FIRST ORIGINAL MARK SHOULD NO LONGER BE SOURCE AND FOCUSED FIGURE REMOVED FROM DOM
    expect(markerToFocus).not.toHaveClass('vcl-accessibility-focus-source');
    expect(page.doc.querySelector(focusedFigure.getAttribute('id'))).toBeNull();

    // SECOND CHECK THAT NEW CONTROLLER NODES HAVE BEEN ADDED AND MARKER HAS CLASS
    expect(newFocusedFigure).toBeTruthy();
    expect(newFocusedFigure).toEqualText(nextSelectorAriaLabel);
    expect(newFocusedFigure).toEqualAttribute('aria-label', nextSelectorAriaLabel);

    // IF THE MARKER RECEIVING FOCUS IS A GEOMETRY (E.G., NOT A G OR SVG) IT SHOULD BE CLASSED
    if (markerReceiveFocus.tagName !== 'g' && markerReceiveFocus.tagName !== 'svg') {
      expect(markerReceiveFocus).toHaveClass('vcl-accessibility-focus-source');
    }

    // THIRD CHECK THAT FOCUS INDICATOR HAS BEEN CREATED
    if (markerReceiveFocus.tagName !== 'g' && markerReceiveFocus.tagName !== 'svg') {
      // NOW WE CAN DETERMINE WHETHER THE NEXT SIBLING IS FOCUSED
      // FIND FOCUS MARKER CONTAINER
      const focusMarkerG = page.root.querySelector('.vcl-accessibility-focus-highlight');
      expect(focusMarkerG).toBeTruthy();
      expect(focusMarkerG.childNodes.length).toEqual(3);

      // check clone is over the newly focused marker vs the original
      const clonedMarker = focusMarkerG.childNodes[2];
      geometryPlacementAttributes.forEach(attr => {
        expect(clonedMarker).toEqualAttribute(attr, markerReceiveFocus.getAttribute(attr));
      });
    } else {
      const focusMarkers = markerReceiveFocus.parentNode.querySelectorAll('.vcl-accessibility-focus-highlight');
      expect(focusMarkers).toBeTruthy();
      expect(focusMarkers.length).toEqual(3);
    }

    // FIRE THE KEYUP EVENT TO PREPARE FOR NEXT TEST
    newFocusedFigure.dispatchEvent(mockKeyUpEvent);
    await page.waitForChanges();
  }
};

export const accessibility_xaxis_description_set_on_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should contain xAxis description on load if xAxis exists on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-xAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const xAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');

    // we are going to use the existing axis to mock the description
    const firstTickText = xAxisTicks[0].textContent;
    const lastTickText = xAxisTicks[xAxisTicks.length - 1].textContent;
    const tickCount = xAxisTicks.length;
    const axisLabel = component.xAxis && component.xAxis.label ? component.xAxis.label : '';

    const yAxisTitle = axisLabel ? `, titled ${axisLabel}` : '';
    const yAxisRange = tickCount ? ` with a range that starts with ${firstTickText} and ends with ${lastTickText}` : '';

    const expectedText = `The chart has a horizontal X Axis${yAxisTitle}${yAxisRange}.`;

    // ASSERT
    // IF IT IS THE FIRST CHILD IT SHOULD BE REGION LABEL
    expect(xAxisAccessibilityDescriptionContainer).toEqualText(expectedText);
  }
};

export const accessibility_xaxis_description_off_on_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should not contain xAxis description on load if xAxis is not visible on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-xAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    component.xAxis = {
      visible: false,
      gridVisible: false,
      label: 'X Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const xAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');

    expect(xAxisAccessibilityDescriptionContainer.textContent).toBeFalsy();
  }
};

export const accessibility_xaxis_description_added_on_update = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should contain xAxis description on update if xAxis exists on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-xAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    component.xAxis = {
      visible: false,
      gridVisible: false,
      label: 'X Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.xAxis = {
      visible: true,
      gridVisible: false,
      label: 'X Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const xAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    const xAxisTicks = page.doc.querySelectorAll('[data-testid=x-axis] [data-testid=axis-tick-text]');

    // we are going to use the existing axis to mock the description
    const firstTickText = xAxisTicks[0].textContent;
    const lastTickText = xAxisTicks[xAxisTicks.length - 1].textContent;
    const tickCount = xAxisTicks.length;
    const axisLabel = component.xAxis && component.xAxis.label ? component.xAxis.label : '';

    const yAxisTitle = axisLabel ? `, titled ${axisLabel}` : '';
    const yAxisRange = tickCount ? ` with a range that starts with ${firstTickText} and ends with ${lastTickText}` : '';

    const expectedText = `The chart has a horizontal X Axis${yAxisTitle}${yAxisRange}.`;

    expect(xAxisAccessibilityDescriptionContainer).toEqualText(expectedText);
  }
};

export const accessibility_yaxis_description_set_on_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should contain yAxis description on load if yAxis exists on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-yAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const yAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick-text]');

    // we are going to use the existing axis to mock the description
    const firstTickText = yAxisTicks[0].textContent;
    const lastTickText = yAxisTicks[yAxisTicks.length - 1].textContent;
    const tickCount = yAxisTicks.length;
    const axisLabel = component.yAxis && component.yAxis.label ? component.yAxis.label : '';

    const yAxisTitle = axisLabel ? `, titled ${axisLabel}` : '';
    const yAxisRange = tickCount ? ` with a range that starts with ${firstTickText} and ends with ${lastTickText}` : '';

    const expectedText = `The chart has a vertical Y axis${yAxisTitle}${yAxisRange}.`;

    // ASSERT
    // IF IT IS THE FIRST CHILD IT SHOULD BE REGION LABEL
    expect(yAxisAccessibilityDescriptionContainer).toEqualText(expectedText);
  }
};

export const accessibility_yaxis_description_off_on_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should not contain yAxis description on load if yAxis is not visible on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-yAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    component.yAxis = {
      visible: false,
      gridVisible: false,
      label: 'Y Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    // IF IT IS THE FIRST CHILD IT SHOULD BE REGION LABEL
    const yAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    expect(yAxisAccessibilityDescriptionContainer.textContent).toBeFalsy();
  }
};

export const accessibility_yaxis_description_added_on_update = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'instruction elements should contain yAxis description on update if yAxis exists on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-yAxis',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    component.yAxis = {
      visible: false,
      gridVisible: false,
      label: 'Y Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.yAxis = {
      visible: true,
      gridVisible: true,
      label: 'Y Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };
    await page.waitForChanges();

    const yAxisAccessibilityDescriptionContainer = page.doc.querySelector(testSelector);
    const yAxisTicks = page.doc.querySelectorAll('[data-testid=y-axis] [data-testid=axis-tick-text]');

    // we are going to use the existing axis to mock the description
    const firstTickText = yAxisTicks[0].textContent;
    const lastTickText = yAxisTicks[yAxisTicks.length - 1].textContent;
    const tickCount = yAxisTicks.length;
    const axisLabel = component.yAxis && component.yAxis.label ? component.yAxis.label : '';

    const yAxisTitle = axisLabel ? `, titled ${axisLabel}` : '';
    const yAxisRange = tickCount ? ` with a range that starts with ${firstTickText} and ends with ${lastTickText}` : '';

    const expectedText = `The chart has a vertical Y axis${yAxisTitle}${yAxisRange}.`;

    // ASSERT
    // IF IT IS THE FIRST CHILD IT SHOULD BE REGION LABEL
    expect(yAxisAccessibilityDescriptionContainer).toEqualText(expectedText);
  }
};

export const accessibility_textures_on_by_default = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'accessibility textures are applied by default on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  nextTestSelector: '[data-testid=pattern-defs]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const patterns = page.doc.querySelector(nextTestSelector).querySelectorAll('pattern');
    const marker = page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('fill', `url(#${patterns[0].getAttribute('id')})`);
  }
};

export const accessibility_textures_off_on_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'accessibility textures are removed on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.accessibility = { ...component.accessibility, hideTextures: true };
    component.colorPalette = 'single_ossBlue';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const marker = page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('fill', visaColors.oss_blue);
  }
};

export const accessibility_textures_off_on_update = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'accessibility textures are removed on update',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.colorPalette = 'single_ossBlue';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT LOAD
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.accessibility = { ...component.accessibility, hideTextures: true };
    await page.waitForChanges();

    // ASSERT
    const marker = page.doc.querySelector(testSelector);
    expect(marker).toEqualAttribute('fill', visaColors.oss_blue);
  }
};

export const accessibility_categorical_textures_created_by_default = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'accessibility textures are applied in default order on load',
  testProps: { colorPalette: 'categorical' },
  testSelector: '[data-testid=pattern-defs]',
  nextTestSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const patterns = page.doc.querySelector(testSelector).querySelectorAll('pattern');

    // check pattern configs against util function
    testTextures.forEach((textureParent, parentI) => {
      textureParent.children.forEach((textureChild, childI) => {
        expect(patterns[parentI].childNodes[childI].nodeName).toEqual(textureChild.name);
        Object.keys(textureChild.attributes).forEach(attr => {
          expect(patterns[parentI].childNodes[childI]).toEqualAttribute(attr, textureChild.attributes[attr]);
        });
      });
    });
  }
};

export const animationConfig_disabled_false_by_default = {
  prop: 'animationConfig',
  group: 'accessibility',
  name: 'animationConfig disabled is false by default',
  testProps: { defaultDuration: 750 },
  testSelector: '[data-testid=mark]',
  nextTestSelector: '[data-testid=margin-container]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    let defaultDuration = 750;
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'defaultDuration') {
          defaultDuration = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT - FLUSH ENTRY MARKER TRANSITIONS
    const marker = page.doc.querySelector(testSelector);
    flushTransitions(marker);
    await page.waitForChanges();

    // ACT - UPDATE TO TRIGGER ANIMATION
    component.width = 500;
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(nextTestSelector);

    // TEST DURATIONS OF TRANSITIONS ASSIGNED
    const paddingTransitions = getTransitionDurations(paddingG);
    Object.keys(paddingTransitions).forEach(key => {
      expect(paddingTransitions[key]).toEqual(defaultDuration);
    });

    const markerTransitions = getTransitionDurations(marker);
    Object.keys(markerTransitions).forEach(key => {
      expect(markerTransitions[key]).toEqual(defaultDuration);
    });
  }
};

export const animationConfig_disabled_true_on_load = {
  prop: 'animationConfig',
  group: 'accessibility',
  name: 'animationConfig disabled is true when passed on load',
  testProps: { defaultDuration: 0, animationConfig: { disabled: true } },
  testSelector: '[data-testid=mark]',
  nextTestSelector: '[data-testid=margin-container]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    let defaultDuration = 0;
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'defaultDuration') {
          defaultDuration = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT - FLUSH ENTRY MARKER TRANSITIONS
    const marker = page.doc.querySelector(testSelector);
    flushTransitions(marker);
    await page.waitForChanges();

    // ACT - UPDATE TO TRIGGER ANIMATION
    component.width = 500;
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(nextTestSelector);

    // TEST DURATIONS OF TRANSITIONS ASSIGNED
    const paddingTransitions = getTransitionDurations(paddingG);
    expect(Object.keys(paddingTransitions).length).toEqual(0);

    const markerTransitions = getTransitionDurations(marker);
    Object.keys(markerTransitions).forEach(key => {
      expect(markerTransitions[key]).toEqual(defaultDuration);
    });
  }
};

export const animationConfig_disabled_true_on_update = {
  prop: 'animationConfig',
  group: 'accessibility',
  name: 'animationConfig disabled is true when passed on update',
  testProps: { defaultDuration: 0 },
  testSelector: '[data-testid=mark]',
  nextTestSelector: '[data-testid=margin-container]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    let defaultDuration = 0;
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'defaultDuration') {
          defaultDuration = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT - FLUSH ENTRY MARKER TRANSITIONS
    const marker = page.doc.querySelector(testSelector);
    flushTransitions(marker);
    await page.waitForChanges();

    // ACT - UPDATE TO TRIGGER ANIMATION
    component.animationConfig = { disabled: true };
    component.width = 500;
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(nextTestSelector);

    // TEST DURATIONS OF TRANSITIONS ASSIGNED
    const paddingTransitions = getTransitionDurations(paddingG);
    expect(Object.keys(paddingTransitions).length).toEqual(0);

    const markerTransitions = getTransitionDurations(marker);
    Object.keys(markerTransitions).forEach(key => {
      expect(markerTransitions[key]).toEqual(defaultDuration);
    });
  }
};

/*
// Accessibility annotation test does not run due to jsdom not supporting annotations util to date
export const accessibility_annotation_description_set_on_load = {
  prop: 'annotations',
  group: 'accessibility',
  name: 'instruction elements should contain annotation description on load if annotation exists on chart',
  testProps: {},
  testSelector: '.vcl-accessibility-instructions .vcl-access-annotations-heading',
  nextTestSelector: '.vcl-accessibility-instructions .vcl-access-annotation',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    nextTestSelector: string
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    component.highestHeadingLevel = 'h4';

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const annotationDescriptionContainer = page.doc.querySelector(testSelector);
    let headerCount = 0;
    let detailCount = 0;
    const annotationDetailsHeaders = Array.from(page.doc.querySelectorAll(nextTestSelector)).filter(
      o => o.tagName.toUpperCase() === 'H6'
    );
    const annotationDetailsContent = Array.from(page.doc.querySelectorAll(nextTestSelector)).filter(
      o => o.tagName.toUpperCase() === 'P'
    );

    // ASSERT
    const annotationCount = component.annotations.length;
    expect(annotationCount).toBeGreaterThanOrEqual(1);
    expect(annotationDescriptionContainer).toEqualText(
      `${annotationCount} annotation${annotationCount > 1 ? 's' : ''} on the chart`
    );

    component.annotations.forEach((annotation, i) => {
      if (annotation.note && annotation.note.title) {
        expect(annotationDetailsHeaders[headerCount]).toEqualText(annotation.note.title);
        headerCount++;
      }
      if (annotation.note && annotation.note.label) {
        expect(annotationDetailsContent[detailCount]).toEqualText(annotation.note.label);
        detailCount++;
      }
      if (annotation.accessibilityDescription) {
        expect(annotationDetailsContent[detailCount]).toEqualText(annotation.accessibilityDescription);
        detailCount++;
      }
    });
  }
};
*/
