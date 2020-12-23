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
const mockBBox = {
  x: 10,
  y: 10,
  height: 100,
  width: 100
};

export const event_clickFunc_emit = {
  prop: 'clickFunc',
  group: 'event',
  name: 'event object should emit and contain first data record when first mark is clicked',
  testProps: { showTooltip: false, nestedDataLocation: false },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedData: object) => {
    // ARRANGE
    const _callback = jest.fn();
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    page.doc.addEventListener('clickFunc', _callback);
    await page.waitForChanges();

    // ACT
    const markerToClick = page.root.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('click');

    // fake BBOX before we click
    markerToClick['getBBox'] = () => mockBBox;
    markerToClick.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(markerToClick);
    await page.waitForChanges();

    // ASSERT
    expect(_callback).toHaveBeenCalled();
    expect(_callback.mock.calls[0][0].detail).toMatchObject(expectedData);
  }
};

export const event_hoverFunc_emit = {
  prop: 'hoverFunc',
  group: 'event',
  name: 'event object should emit and contain first data record when first mark is hovered',
  testProps: { showTooltip: false, nestedDataLocation: false },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedData: object) => {
    // ARRANGE
    const _callback = jest.fn();
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    page.doc.addEventListener('hoverFunc', _callback);
    await page.waitForChanges();

    // ACT
    const markerToHover = page.root.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseover');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(markerToHover);
    await page.waitForChanges();

    // ASSERT
    expect(_callback).toHaveBeenCalled();
    expect(_callback.mock.calls[0][0].detail).toMatchObject(expectedData);
  }
};

export const event_mouseOutFunc_emit = {
  prop: 'mouseOutFunc',
  group: 'event',
  name: 'event object should emit and have undefined data object on mouse out',
  testProps: { showTooltip: false, nestedDataLocation: false },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedData: object) => {
    // ARRANGE
    const _callback = jest.fn();
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    page.doc.addEventListener('mouseOutFunc', _callback);
    await page.waitForChanges();

    // ACT
    const markerToHover = page.root.querySelector(testSelector);
    const mockMouseEvent = new MouseEvent('mouseout');
    markerToHover.dispatchEvent({ ...mockMouseEvent, ...fakePosition });

    // ACT - FLUSH TRANSITIONS
    flushTransitions(markerToHover);
    await page.waitForChanges();

    // ASSERT
    expect(_callback).toHaveBeenCalled();
    expect(_callback.mock.calls[0][0].detail).toBeUndefined();
  }
};

export const event_clickFunc_hoverFunc_suppress = {
  prop: 'suppressEvents',
  group: 'event',
  name: 'event object should not emit when first mark is clicked and surpress events is true',
  testProps: { showTooltip: false, suppressEvents: true },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedData: object) => {
    // ARRANGE
    const _callback = jest.fn();
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    component.suppressEvents = true;
    page.root.appendChild(component);
    page.doc.addEventListener('clickFunc', _callback);
    await page.waitForChanges();

    // ACT
    const markerToClick = page.root.querySelector(testSelector);
    const clickFunction = markerToClick['__on'] ? markerToClick['__on'].find(obj => obj.type === 'click') : undefined; // tslint:disable-line: no-string-literal
    const hoverFunction = markerToClick['__on']
      ? markerToClick['__on'].find(obj => obj.type === 'mouseover')
      : undefined; // tslint:disable-line: no-string-literal
    const hoverOffFunction = markerToClick['__on']
      ? markerToClick['__on'].find(obj => obj.type === 'mouseout')
      : undefined; // tslint:disable-line: no-string-literal

    // ASSERT
    expect(clickFunction).toBeUndefined();
    expect(hoverFunction).toBeUndefined();
    expect(hoverOffFunction).toBeUndefined();
  }
};
