/**
 * Copyright (c) 2020, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions } from './unit-test-utils';

const fakePosition = { pageX: 125, pageY: 250 };
const tooltipSelector = '[data-testid=tooltip-container]';
const mockSVGPoint = {
  x: 10,
  y: 10,
  matrixTransform: () => mockSVGPoint
};
const mockScreenCTM = {
  a: 1,
  b: 0,
  c: 0,
  d: 1,
  e: 120,
  f: 202.984375,
  inverse: () => mockScreenCTM
};

export const tooltip_showTooltip_default = {
  prop: 'showTooltip',
  group: 'labels',
  name: 'tooltip should render and have opacity 0 by default on load (before a hover)',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);

    // ASSERT
    expect(tooltipContainer).toHaveClass('vcl-tooltip');
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(0);
  }
};

export const tooltip_showTooltip_hover = {
  prop: 'showTooltip',
  group: 'labels',
  name: 'tooltip should render and have opacity 1 and be placed on hover',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const tooltip_showTooltip_false = {
  prop: 'showTooltip',
  group: 'labels',
  name: 'tooltip should not render when event is triggered and showTooltip is false',
  testProps: { showTooltip: false },
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(0);
  }
};

export const tooltip_tooltipLabel_default = {
  prop: 'tooltipLabel',
  group: 'labels',
  name: 'tooltip should render default content on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const tooltip_tooltipLabel_custom_load = {
  prop: 'tooltipLabel',
  group: 'labels',
  name: 'tooltip should render custom content on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const tooltip_tooltipLabel_custom_update = {
  prop: 'tooltipLabel',
  group: 'labels',
  name: 'tooltip should render custom content on update',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
  ) => {
    // ARRANGE RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE UPDATE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    await page.waitForChanges();

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const tooltip_tooltipLabel_custom_format_load = {
  prop: 'tooltipLabel',
  group: 'labels',
  name: 'tooltip should render formatted custom content on load',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
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

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const tooltip_tooltipLabel_custom_format_update = {
  prop: 'tooltipLabel',
  group: 'labels',
  name: 'tooltip should render formatted custom content on update',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
  ) => {
    // ARRANGE RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE UPDATE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    await page.waitForChanges();

    // ACT - TRIGGER HOVER
    const tooltipContainer = await page.doc.querySelector(tooltipSelector);
    const markerToHover = await page.doc.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);
    expect(parseFloat(tooltipContainer.style.opacity)).toEqual(1);
    expect(tooltipContainer.style.left).toEqual(`${fakePosition.pageX}px`);
    expect(tooltipContainer.style.top).toEqual(`${fakePosition.pageY}px`);
  }
};

export const dataKeyNames_custom_on_load = {
  prop: 'dataKeyNames',
  group: 'labels',
  name: 'if provided on load, dataKeyNames prop is used for key names across chart',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
  ) => {
    // ARRANGE
    let selectorAriaLabel;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'selectorAriaLabel') {
          selectorAriaLabel = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // first we check the tooltip and a11y controller
    // ACT - TRIGGER HOVER
    const ownerSVG = page.root.querySelector('[data-testid=chart-container] svg');
    const tooltipContainer = page.doc.querySelector(tooltipSelector);
    const controllerContainer = page.doc.querySelector('.VCL-controller');
    const markerToFocus = page.doc.querySelector(testSelector);

    ownerSVG['createSVGPoint'] = () => mockSVGPoint;
    markerToFocus['createSVGPoint'] = () => mockSVGPoint;
    const mockFocusEvent = new MouseEvent('focus');
    markerToFocus.dispatchEvent(mockFocusEvent);

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    // check tooltip
    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);

    // check aria label
    const focusedFigure = controllerContainer.querySelector('.VCL-controller-focused');
    expect(focusedFigure).toBeTruthy();
    expect(focusedFigure).toEqualText(selectorAriaLabel);
    expect(focusedFigure).toEqualAttribute('aria-label', selectorAriaLabel);

    // check data table column headers
    // first we expand the table by clicking the data table button
    const tableCompContainer = document.querySelector('[data-testid=data-table-outer-container]');
    const buttonToPress = tableCompContainer.querySelector('button');

    // fake BBOX before we click
    const mockClickEvent = new MouseEvent('click');
    buttonToPress.dispatchEvent({ ...mockClickEvent, ...fakePosition });
    await page.waitForChanges();

    const tableColumns = tableCompContainer.querySelectorAll('.vcc-th');
    const tableColumnData = {};
    // we build an object of what columns we do have in data table
    tableColumns.forEach(tC => {
      if (!tableColumnData[tC['__data__']]) {
        tableColumnData[tC['__data__']] = tC.textContent;
      }
    });

    // then we check that we have default or updated name for all keys based on dataKeyNames
    Object.keys(tableColumnData).forEach(key => {
      // if we are using the key directly, we don't have mapping in dataKeyNames
      if (key === tableColumnData[key]) {
        expect(testProps['dataKeyNames'][key]).toBeFalsy();
      } else {
        // we should match dataKeyNames
        expect(testProps['dataKeyNames'][key]).toEqual(tableColumnData[key]);
      }
    });
  }
};

export const dataKeyNames_custom_on_update = {
  prop: 'dataKeyNames',
  group: 'labels',
  name: 'if provided on update, dataKeyNames prop is used for key names across chart',
  testProps: {},
  testSelector: '[data-testid=mark]',
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    expectedTooltipContent: string
  ) => {
    // ARRANGE
    let selectorAriaLabel;
    let innerDataKeyNames;
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        if (testProp === 'selectorAriaLabel') {
          selectorAriaLabel = testProps[testProp];
        } else if (testProp === 'dataKeyNames') {
          innerDataKeyNames = testProps[testProp];
        } else {
          component[testProp] = testProps[testProp];
        }
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT - UPDATE CHART WITH COMPONENT PROPERTIES PROVIDED
    component.dataKeyNames = innerDataKeyNames;
    await page.waitForChanges();

    // first we check the tooltip and a11y controller
    // ACT - TRIGGER HOVER
    const ownerSVG = page.root.querySelector('[data-testid=chart-container] svg');
    const tooltipContainer = page.doc.querySelector(tooltipSelector);
    const controllerContainer = page.doc.querySelector('.VCL-controller');
    const markerToFocus = page.doc.querySelector(testSelector);

    ownerSVG['createSVGPoint'] = () => mockSVGPoint;
    markerToFocus['createSVGPoint'] = () => mockSVGPoint;
    const mockFocusEvent = new MouseEvent('focus');
    markerToFocus.dispatchEvent(mockFocusEvent);

    // ACT - FLUSH TRANSITIONS
    flushTransitions(tooltipContainer);
    await page.waitForChanges();

    // check tooltip
    const tooltipContent = tooltipContainer.querySelector('p');
    expect(tooltipContent).toEqualHtml(expectedTooltipContent);

    // check aria label
    const focusedFigure = controllerContainer.querySelector('.VCL-controller-focused');
    expect(focusedFigure).toBeTruthy();
    expect(focusedFigure).toEqualText(selectorAriaLabel);
    expect(focusedFigure).toEqualAttribute('aria-label', selectorAriaLabel);

    // check data table column headers
    // first we expand the table by clicking the data table button
    const tableCompContainer = document.querySelector('[data-testid=data-table-outer-container]');
    const buttonToPress = tableCompContainer.querySelector('button');

    // fake BBOX before we click
    const mockClickEvent = new MouseEvent('click');
    buttonToPress.dispatchEvent({ ...mockClickEvent, ...fakePosition });
    await page.waitForChanges();

    const tableColumns = tableCompContainer.querySelectorAll('.vcc-th');
    const tableColumnData = {};
    // we build an object of what columns we do have in data table
    tableColumns.forEach(tC => {
      if (!tableColumnData[tC['__data__']]) {
        tableColumnData[tC['__data__']] = tC.textContent;
      }
    });

    // then we check that we have default or updated name for all keys based on dataKeyNames
    Object.keys(tableColumnData).forEach(key => {
      // if we are using the key directly, we don't have mapping in dataKeyNames
      if (key === tableColumnData[key]) {
        expect(testProps['dataKeyNames'][key]).toBeFalsy();
      } else {
        // we should match dataKeyNames
        expect(testProps['dataKeyNames'][key]).toEqual(tableColumnData[key]);
      }
    });
  }
};
