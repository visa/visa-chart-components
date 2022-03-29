/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions } from './unit-test-utils';

export const generic_height_default_load = {
  prop: 'height',
  group: 'base',
  name: 'default height on load',
  testDefault: true,
  testProps: { height: 999999 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDHEIGHT = testProps['height'] || 999999; // if default is not sent cause error

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    expect(SVGelement).toEqualAttribute('height', EXPECTEDHEIGHT);
  }
};

export const generic_height_custom_load = {
  prop: 'height',
  group: 'base',
  name: 'set height on load',
  testProps: { height: 410 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDHEIGHT = testProps['height'] || 410;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    expect(SVGelement).toEqualAttribute('height', EXPECTEDHEIGHT);
  }
};

export const generic_height_custom_update = {
  prop: 'height',
  group: 'base',
  name: 'set height on update',
  testProps: { height: 500 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // render
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE UPDATE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDHEIGHT = testProps['height'] || 500;
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    flushTransitions(SVGelement);
    expect(SVGelement).toEqualAttribute('height', EXPECTEDHEIGHT);
  }
};

export const generic_width_default_load = {
  prop: 'width',
  group: 'base',
  name: 'default width on load',
  testDefault: true,
  testProps: { width: 999999 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDWIDTH = testProps['width'] || 999999; // if default is not sent cause error

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    expect(SVGelement).toEqualAttribute('width', EXPECTEDWIDTH);
  }
};

export const generic_width_custom_load = {
  prop: 'width',
  group: 'base',
  name: 'set width on load',
  testProps: { width: 410 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDWIDTH = testProps['width'] || 410;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    expect(SVGelement).toEqualAttribute('width', EXPECTEDWIDTH);
  }
};

export const generic_width_custom_update = {
  prop: 'width',
  group: 'base',
  name: 'set width on update',
  testProps: { width: 625 },
  testSelector: '[data-testid=chart-container] svg',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // render
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE UPDATE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDWIDTH = testProps['width'] || 625;
    await page.waitForChanges();

    // ASSERT
    const SVGelement = page.doc.querySelector(testSelector);
    flushTransitions(SVGelement);
    expect(SVGelement).toEqualAttribute('width', EXPECTEDWIDTH);
  }
};

export const generic_mainTitle_default_load = {
  prop: 'mainTitle',
  group: 'base',
  name: 'default mainTitle on load',
  testDefault: true,
  testProps: { mainTitle: 'This is a custom main title which causes an error' },
  testSelector: '[data-testid=main-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMAINTITLE = testProps['mainTitle'] || 'This is a custom main title which causes an error';

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const mainTitleElement = page.doc.querySelector(testSelector);
    expect(mainTitleElement).toEqualText(EXPECTEDMAINTITLE);
  }
};

export const generic_mainTitle_custom_load = {
  prop: 'mainTitle',
  group: 'base',
  name: 'set mainTitle on load',
  testProps: { mainTitle: 'This is a custom main title' },
  testSelector: '[data-testid=main-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDMAINTITLE = testProps['mainTitle'] || 'This is a custom main title';

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const mainTitleElement = page.doc.querySelector(testSelector);
    expect(mainTitleElement).toEqualText(EXPECTEDMAINTITLE);
  }
};

export const generic_mainTitle_custom_update = {
  prop: 'mainTitle',
  group: 'base',
  name: 'set mainTitle on update',
  testProps: { mainTitle: 'This is an updated custom main title' },
  testSelector: '[data-testid=main-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // render
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDMAINTITLE = testProps['mainTitle'] || 'This is an updated custom main title';

    // ACT
    await page.waitForChanges();

    // ASSERT
    const mainTitleElement = page.doc.querySelector(testSelector);
    expect(mainTitleElement).toEqualText(EXPECTEDMAINTITLE);
  }
};

export const generic_subTitle_default_load = {
  prop: 'subTitle',
  group: 'base',
  name: 'default subTitle on load',
  testDefault: true,
  testProps: { mainTitle: 'This is a custom sub title which causes an error' },
  testSelector: '[data-testid=sub-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDSUBTITLE = testProps['subTitle'] || 'This is a custom sub title which causes an error';

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const subTitleElement = page.doc.querySelector(testSelector);
    expect(subTitleElement).toEqualText(EXPECTEDSUBTITLE);
  }
};

export const generic_subTitle_custom_load = {
  prop: 'subTitle',
  group: 'base',
  name: 'set subTitle on load',
  testProps: { subTitle: 'This is a custom sub title' },
  testSelector: '[data-testid=sub-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDSUBTITLE = testProps['subTitle'] || 'This is a custom sub title';

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const subTitleElement = page.doc.querySelector(testSelector);
    expect(subTitleElement).toEqualText(EXPECTEDSUBTITLE);
  }
};

export const generic_subTitle_custom_update = {
  prop: 'subTitle',
  group: 'base',
  name: 'set subTitle on update',
  testProps: { subTitle: 'This is an updated custom sub title' },
  testSelector: '[data-testid=sub-title]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // render
    page.root.appendChild(component);
    await page.waitForChanges();

    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    const EXPECTEDSUBTITLE = testProps['subTitle'] || 'This is an updated custom sub title';

    // ACT
    await page.waitForChanges();

    // ASSERT
    const subTitleElement = page.doc.querySelector(testSelector);
    expect(subTitleElement).toEqualText(EXPECTEDSUBTITLE);
  }
};

export const generic_margin_default_load = {
  prop: 'margin',
  group: 'margin',
  name: 'default margin on load',
  testDefault: true,
  testProps: { margin: { bottom: 100, left: 100, right: 100, top: 100 } },
  testSelector: '[data-testid=margin-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = testProps['margin'] || { bottom: 100, left: 100, right: 100, top: 100 }; // if default is not sent cause error
    const MARGINMODIFIER = testProps['marginModifier'] || 0;
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const marginG = page.doc.querySelector(testSelector);
    expect(marginG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDMARGIN.left + MARGINMODIFIER}, ${EXPECTEDMARGIN.top + MARGINMODIFIER})`
    );
  }
};

export const generic_margin_custom_load = {
  prop: 'margin',
  group: 'margin',
  name: 'custom margin on load',
  testProps: { margin: { bottom: 25, left: 25, right: 25, top: 25 } },
  testSelector: '[data-testid=margin-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = testProps['margin'] || { bottom: 25, left: 25, right: 25, top: 25 }; // if default is not sent cause error
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    const MARGINMODIFIER = testProps['marginModifier'] || 0;
    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;
    component.margin = EXPECTEDMARGIN;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const marginG = page.doc.querySelector(testSelector);
    expect(marginG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDMARGIN.left + MARGINMODIFIER}, ${EXPECTEDMARGIN.top + MARGINMODIFIER})`
    );
  }
};

export const generic_margin_custom_update = {
  prop: 'margin',
  group: 'margin',
  name: 'custom margin on update',
  testProps: { margin: { bottom: 25, left: 25, right: 25, top: 25 }, animationConfig: { disabled: true } },
  testSelector: '[data-testid=margin-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = testProps['margin'] || { bottom: 25, left: 25, right: 25, top: 25 }; // if default is not sent cause error
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    const MARGINMODIFIER = testProps['marginModifier'] || 0;

    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });
    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UDPATE
    component.margin = EXPECTEDMARGIN;
    await page.waitForChanges();

    // ASSERT
    const marginG = page.doc.querySelector(testSelector);
    expect(marginG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDMARGIN.left + MARGINMODIFIER}, ${EXPECTEDMARGIN.top + MARGINMODIFIER})`
    );
  }
};

export const generic_padding_default_load = {
  prop: 'padding',
  group: 'padding',
  name: 'default padding on load',
  testDefault: true,
  testProps: { padding: { bottom: 100, left: 100, right: 100, top: 100 } },
  testSelector: '[data-testid=padding-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = { bottom: 10, left: 10, right: 10, top: 10 };
    const EXPECTEDPADDING = testProps['padding'] || { bottom: 100, left: 100, right: 100, top: 100 }; // if default is not sent cause error
    const PADDINGMODIFIER = testProps['paddingModifier'] || 0;
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;
    component.margin = EXPECTEDMARGIN;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(testSelector);
    expect(paddingG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDPADDING.left + PADDINGMODIFIER}, ${EXPECTEDPADDING.top + PADDINGMODIFIER})`
    );
  }
};

export const generic_padding_custom_load = {
  prop: 'padding',
  group: 'padding',
  name: 'custom padding on load',
  testProps: { padding: { bottom: 25, left: 25, right: 25, top: 25 } },
  testSelector: '[data-testid=padding-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = { bottom: 10, left: 10, right: 10, top: 10 };
    const EXPECTEDPADDING = testProps['padding'] || { bottom: 100, left: 100, right: 100, top: 100 }; // if default is not sent cause error
    const PADDINGMODIFIER = testProps['paddingModifier'] || 0;
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;
    component.margin = EXPECTEDMARGIN;
    component.padding = EXPECTEDPADDING;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(testSelector);
    expect(paddingG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDPADDING.left + PADDINGMODIFIER}, ${EXPECTEDPADDING.top + PADDINGMODIFIER})`
    );
  }
};

export const generic_padding_custom_update = {
  prop: 'padding',
  group: 'padding',
  name: 'custom padding on update',
  testProps: { padding: { bottom: 25, left: 25, right: 25, top: 25 }, animationConfig: { disabled: true } },
  testSelector: '[data-testid=padding-container]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDMARGIN = { bottom: 10, left: 10, right: 10, top: 10 };
    const EXPECTEDPADDING = testProps['padding'] || { bottom: 100, left: 100, right: 100, top: 100 }; // if default is not sent cause error
    const PADDINGMODIFIER = testProps['paddingModifier'] || 0;
    const BASEHEIGHT = 600;
    const BASEWIDTH = 600;
    // ARRANGE
    Object.keys(testProps).forEach(prop => {
      component[prop] = testProps[prop];
    });

    component.height = BASEHEIGHT;
    component.width = BASEWIDTH;
    component.margin = EXPECTEDMARGIN;

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UDPATE
    component.padding = EXPECTEDPADDING;
    await page.waitForChanges();

    // ASSERT
    const paddingG = page.doc.querySelector(testSelector);
    expect(paddingG).toEqualAttribute(
      'transform',
      `translate(${EXPECTEDPADDING.left + PADDINGMODIFIER}, ${EXPECTEDPADDING.top + PADDINGMODIFIER})`
    );
  }
};

export const generic_uniqueID_default_load = {
  prop: 'uniqueID',
  group: 'data',
  name: 'default uniqueID on load',
  testDefault: true,
  testProps: { uniqueID: 'not_matching_id' },
  testSelector: 'component-name',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const element = page.doc.querySelector(testSelector);
    expect(element.id).toEqual(expect.anything());
  }
};

export const generic_uniqueID_custom_load = {
  prop: 'uniqueID',
  group: 'data',
  name: 'custom uniqueID on load',
  testProps: { uniqueID: 'custom_unique_id' },
  testSelector: 'component-name',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDUNIQUEID = testProps['uniqueID'] || 'custom_unique_id';
    component.uniqueID = EXPECTEDUNIQUEID;

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const element = page.doc.querySelector(testSelector);
    const margin = element.querySelector('[data-testid=margin-container]');
    const padding = element.querySelector('[data-testid=padding-container]');

    expect(element.id).toEqual(EXPECTEDUNIQUEID);
    expect(margin.id).toEqual(`visa-viz-margin-container-g-${EXPECTEDUNIQUEID}`);
    expect(padding.id).toEqual(`visa-viz-padding-container-g-${EXPECTEDUNIQUEID}`);
  }
};

export const generic_uniqueID_custom_update = {
  prop: 'uniqueID',
  group: 'data',
  name: 'custom uniqueID on update',
  testProps: { uniqueID: 'custom_unique_id' },
  testSelector: 'component-name',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDUNIQUEID = testProps['uniqueID'] || 'custom_unique_id';

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.uniqueID = EXPECTEDUNIQUEID;
    await page.waitForChanges();

    // ASSERT
    const element = page.doc.querySelector(testSelector);
    const margin = element.querySelector('[data-testid=margin-container]');
    const padding = element.querySelector('[data-testid=padding-container]');

    expect(element.id).toEqual(EXPECTEDUNIQUEID);
    expect(margin.id).toEqual(`visa-viz-margin-container-g-${EXPECTEDUNIQUEID}`);
    expect(padding.id).toEqual(`visa-viz-padding-container-g-${EXPECTEDUNIQUEID}`);
  }
};

export const generic_data_custom_load = {
  prop: 'data',
  group: 'data',
  name: 'custom data on load',
  testProps: { data: [] },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDDATA = testProps['data'] || [];

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const elements = page.doc.querySelectorAll(testSelector);
    elements.forEach((element, i) => {
      expect(element['__data__']).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
    });
  }
};

export const generic_data_custom_update_enter = {
  prop: 'data',
  group: 'data',
  name: 'custom data enter on update',
  testProps: { data: [] },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDDATA = testProps['data'] || [];
    const BEGINNINGDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1]];
    component.data = BEGINNINGDATA;

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.data = EXPECTEDDATA;
    await page.waitForChanges();

    // ASSERT
    const elements = page.doc.querySelectorAll(testSelector);
    elements.forEach((element, i) => {
      expect(element['__data__']).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
    });
  }
};

export const generic_data_custom_update_exit = {
  prop: 'data',
  group: 'data',
  name: 'custom data exit on update',
  testProps: { data: [] },
  testSelector: '[data-testid=mark]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const EXPECTEDDATA = testProps['data'] || [];
    const EXITDATA = [EXPECTEDDATA[0], EXPECTEDDATA[1]];

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
        expect(element['__data__']).toEqual(EXPECTEDDATA[i]); // tslint:disable-line: no-string-literal
      } else {
        const lastTransitionKey = Object.keys(element['__transition'])[Object.keys(element['__transition']).length - 1]; // tslint:disable-line: no-string-literal
        const transitionName = element['__transition'][lastTransitionKey].name; // tslint:disable-line: no-string-literal
        expect(transitionName).toEqual('exit');
      }
    });
  }
};

export const generic_accessibility_validation_default_false_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'should print accessibility console warnings and logs when accessibility.disableValidation defaults to false',
  testProps: { disableValidation: false },
  testSelector: 'N/A',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation();
    const spyLog = jest.spyOn(console, 'log').mockImplementation();
    const spyGroup = jest.spyOn(console, 'groupCollapsed').mockImplementation();
    const ENABLEACCESSIBILITYVALIDATION = testProps || { disableValidation: false };
    component.accessibility = ENABLEACCESSIBILITYVALIDATION;

    // CLEAR
    spyWarn.mockClear();
    spyLog.mockClear();
    spyGroup.mockClear();

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    expect(spyWarn.mock.calls).toMatchSnapshot();
    expect(spyWarn.mock.calls.length).toBeGreaterThan(0);
    expect(spyLog.mock.calls).toMatchSnapshot();
    expect(spyLog.mock.calls.length).toBeGreaterThan(0);
    expect(spyGroup.mock.calls).toMatchSnapshot();
    expect(spyGroup.mock.calls.length).toBeGreaterThan(0);

    // RESTORE
    spyWarn.mockRestore();
    spyLog.mockRestore();
    spyGroup.mockRestore();
  }
};

export const generic_accessibility_validation_true_load = {
  prop: 'accessibility',
  group: 'accessibility',
  name: 'should not print accessibility console warnings and logs when accessibility.disableValidation set to true',
  testProps: { disableValidation: true },
  testSelector: 'N/A',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string) => {
    // ARRANGE
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation();
    const spyLog = jest.spyOn(console, 'log').mockImplementation();
    const spyGroup = jest.spyOn(console, 'groupCollapsed').mockImplementation();
    const DISABLEACCESSIBILITYVALIDATION = testProps || { disableValidation: true };
    component.accessibility = DISABLEACCESSIBILITYVALIDATION;

    // CLEAR
    spyWarn.mockClear();
    spyLog.mockClear();
    spyGroup.mockClear();

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    expect(spyWarn.mock.calls).toMatchSnapshot();
    expect(spyWarn.mock.calls.length).toBeLessThanOrEqual(0);
    expect(spyLog.mock.calls).toMatchSnapshot();
    expect(spyLog.mock.calls.length).toBeLessThanOrEqual(0);
    expect(spyGroup.mock.calls).toMatchSnapshot();
    expect(spyGroup.mock.calls.length).toBeLessThanOrEqual(0);

    // RESTORE
    spyWarn.mockRestore();
    spyLog.mockRestore();
    spyGroup.mockRestore();
  }
};
