/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions } from './unit-test-utils';

const fakePosition = { pageX: 125, pageY: 250 };
const tooltipSelector = '[data-testid=tooltip-container]';

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
