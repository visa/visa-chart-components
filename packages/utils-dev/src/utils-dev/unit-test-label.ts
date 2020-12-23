/**
 * Copyright (c) 2020 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions } from './unit-test-utils';

const labelSelector = '[data-testid=dataLabel]';

export const label_visible_default = {
  prop: 'label.visible',
  group: 'labels',
  name: 'label should visible (or not) by default on load',
  testProps: {},
  testSelector: labelSelector,
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    propName: string,
    defaultValue: any
  ) => {
    // ARRANGE
    const EXPECTEDOPACITY = defaultValue.visible ? 1 : 0;

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const label = await page.doc.querySelector(testSelector);

    // ASSERT
    expect(label).toEqualAttribute('opacity', EXPECTEDOPACITY);
  }
};

export const label_visible_load = {
  prop: 'label.visible',
  group: 'labels',
  name: 'label visibility should toggle on load',
  testProps: {},
  testSelector: labelSelector,
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    propName: string,
    defaultValue: any
  ) => {
    // ARRANGE
    const EXPECTEDOPACITY = defaultValue.visible ? 0 : 1;
    component[propName] = { ...defaultValue, visible: !defaultValue.visible };

    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT
    const label = await page.doc.querySelector(testSelector);

    // ASSERT
    expect(label).toEqualAttribute('opacity', EXPECTEDOPACITY);
  }
};

export const label_visible_update = {
  prop: 'label.visible',
  group: 'labels',
  name: 'label visibility should toggle on update',
  testProps: {},
  testSelector: labelSelector,
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
    propName: string,
    defaultValue: any
  ) => {
    // ARRANGE
    const EXPECTEDOPACITY = defaultValue.visible ? 0 : 1;

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    // if we have any testProps apply them
    component[propName] = { ...defaultValue, visible: !defaultValue.visible };
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    await page.waitForChanges();

    // ACT
    const label = await page.doc.querySelector(testSelector);
    flushTransitions(label);
    await page.waitForChanges();

    // ASSERT
    expect(label).toEqualAttribute('opacity', EXPECTEDOPACITY);
  }
};
