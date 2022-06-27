/**
 * Copyright (c) 2020, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { SpecPage } from '@stencil/core/testing';
import { flushTransitions, parseTransform, asyncForEach } from './unit-test-utils';

export const wrapLabel_applied_default = {
  prop: 'wrapLabel',
  group: 'axes',
  name: 'wrap label should be applied by default on load',
  testProps: {},
  testSelector: '[data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.width = 500;

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
    const xAxisTicksText = page.doc.querySelectorAll(testSelector);
    await asyncForEach(xAxisTicksText, async text => {
      flushTransitions(text);
      await page.waitForChanges();
      const textTspans = text.querySelectorAll('[data-testid=axis-tick-text-tspan]');
      expect(textTspans.length).toBeGreaterThanOrEqual(1);
    });
  }
};

export const wrapLabel_false_on_load = {
  prop: 'wrapLabel',
  group: 'axes',
  name: 'wrap label should be disabled when passed on load',
  testProps: {},
  testSelector: '[data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.width = 500;
    component.wrapLabel = false;

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
    const xAxisTicksText = page.doc.querySelectorAll(testSelector);
    await asyncForEach(xAxisTicksText, async text => {
      flushTransitions(text);
      await page.waitForChanges();

      const textTspans = text.querySelectorAll('[data-testid=axis-tick-text-tspan]');
      expect(textTspans.length).toEqual(0);
    });
  }
};

export const wrapLabel_false_on_update = {
  prop: 'wrapLabel',
  group: 'axes',
  name: 'wrap label should be disabled when passed on update',
  testProps: {},
  testSelector: '[data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.width = 500;
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
    component.wrapLabel = false;
    await page.waitForChanges();

    // ASSERT
    const xAxisTicksText = page.doc.querySelectorAll(testSelector);
    await asyncForEach(xAxisTicksText, async text => {
      flushTransitions(text);
      await page.waitForChanges();

      const textTspans = text.querySelectorAll('[data-testid=axis-tick-text-tspan]');
      expect(textTspans.length).toEqual(0);
    });
  }
};

export const xaxis_visible_default = {
  prop: 'xAxis.visible',
  group: 'axes',
  name: 'axis should be visible by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const xAxis = page.doc.querySelector(testSelector);
    flushTransitions(xAxis);
    await page.waitForChanges();
    expect(xAxis).toEqualAttribute('opacity', 1);
  }
};

export const yaxis_visible_default = {
  prop: 'yAxis.visible',
  group: 'axes',
  name: 'axis should be visible by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const yAxis = page.doc.querySelector(testSelector);
    flushTransitions(yAxis);
    await page.waitForChanges();
    expect(yAxis).toEqualAttribute('opacity', 1);
  }
};

export const xaxis_visible_false_load = {
  prop: 'xAxis.visible',
  group: 'axes',
  name: 'axis should not be visible when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.xAxis = { visible: false };
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
    const xAxis = page.doc.querySelector(testSelector);
    flushTransitions(xAxis);
    await page.waitForChanges();
    expect(xAxis).toEqualAttribute('opacity', 0);
  }
};

export const yaxis_visible_false_load = {
  prop: 'yAxis.visible',
  group: 'axes',
  name: 'axis should not be visible when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.yAxis = { visible: false };
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
    const yAxis = page.doc.querySelector(testSelector);
    flushTransitions(yAxis);
    await page.waitForChanges();
    expect(yAxis).toEqualAttribute('opacity', 0);
  }
};

export const xaxis_visible_false_update = {
  prop: 'xAxis.visible',
  group: 'axes',
  name: 'axis should not be visible when passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.xAxis = { visible: false };
    await page.waitForChanges();

    // ASSERT
    const xAxis = page.doc.querySelector(testSelector);
    flushTransitions(xAxis);
    await page.waitForChanges();
    expect(xAxis).toEqualAttribute('opacity', 0);
  }
};

export const yaxis_visible_false_update = {
  prop: 'yAxis.visible',
  group: 'axes',
  name: 'axis should not be visible when passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.yAxis = { visible: false };
    await page.waitForChanges();

    // ASSERT
    const yAxis = page.doc.querySelector(testSelector);
    flushTransitions(yAxis);
    await page.waitForChanges();
    expect(yAxis).toEqualAttribute('opacity', 0);
  }
};

export const xaxis_grid_visible_default = {
  prop: 'xAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should not be visible by default',
  testProps: {},
  testSelector: '[data-testid=grid-bottom]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const gridBottom = page.doc.querySelector(testSelector);
    flushTransitions(gridBottom);
    await page.waitForChanges();
    expect(gridBottom).toEqualAttribute('opacity', 0);
  }
};

export const yaxis_grid_visible_default = {
  prop: 'yAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should be visible by default',
  testProps: {},
  testSelector: '[data-testid=grid-left]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const gridLeft = page.doc.querySelector(testSelector);
    flushTransitions(gridLeft);
    await page.waitForChanges();
    expect(gridLeft).toEqualAttribute('opacity', 1);
  }
};

export const xaxis_grid_visible_load = {
  prop: 'xAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should be visible on load',
  testProps: {},
  testSelector: '[data-testid=grid-bottom]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'x axis',
      unit: 'month',
      format: '%b %y',
      tickInterval: 1
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
    const gridBottom = page.doc.querySelector(testSelector);
    flushTransitions(gridBottom);
    await page.waitForChanges();
    expect(gridBottom).toEqualAttribute('opacity', 1);
  }
};

export const yaxis_grid_visible_load = {
  prop: 'yAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should not be visible on load',
  testProps: {},
  testSelector: '[data-testid=grid-left]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.yAxis = {
      visible: true,
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

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const gridLeft = page.doc.querySelector(testSelector);
    flushTransitions(gridLeft);
    await page.waitForChanges();
    expect(gridLeft).toEqualAttribute('opacity', 0);
  }
};

export const xaxis_grid_visible_update = {
  prop: 'xAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should be visible on update',
  testProps: {},
  testSelector: '[data-testid=grid-bottom]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'x axis',
      unit: 'month',
      format: '%b %y',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const gridBottom = page.doc.querySelector(testSelector);
    flushTransitions(gridBottom);
    await page.waitForChanges();
    expect(gridBottom).toEqualAttribute('opacity', 1);
  }
};

export const yaxis_grid_visible_update = {
  prop: 'yAxis.gridVisible',
  group: 'axes',
  name: 'axis gridlines should not be visible on update',
  testProps: {},
  testSelector: '[data-testid=grid-left]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.yAxis = {
      visible: true,
      gridVisible: false,
      label: 'Y Axis',
      format: '0[.][0][0]a',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const gridLeft = page.doc.querySelector(testSelector);
    flushTransitions(gridLeft);
    await page.waitForChanges();
    expect(gridLeft).toEqualAttribute('opacity', 0);
  }
};

export const xaxis_label_default = {
  prop: 'xAxis.label',
  group: 'axes',
  name: 'axis label should be X Axis by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const xAxisLabel = page.doc.querySelector(testSelector);
    expect(xAxisLabel).toEqualText('X Axis');
  }
};

export const yaxis_label_default = {
  prop: 'yAxis.label',
  group: 'axes',
  name: 'axis label should be Y Axis by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    const yAxisLabel = page.doc.querySelector(testSelector);
    expect(yAxisLabel).toEqualText('Y Axis');
  }
};

export const xaxis_label_load = {
  prop: 'xAxis.label',
  group: 'axes',
  name: 'axis label should be passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %y',
      tickInterval: 1
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
    const xAxisLabel = page.doc.querySelector(testSelector);
    expect(xAxisLabel).toEqualText('Cats and Dogs');
  }
};

export const yaxis_label_load = {
  prop: 'yAxis.label',
  group: 'axes',
  name: 'axis label should be passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.yAxis = {
      visible: true,
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '0[.][0][0]a',
      tickInterval: 1
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
    const yAxisLabel = page.doc.querySelector(testSelector);
    expect(yAxisLabel).toEqualText('Cats and Dogs');
  }
};

export const xaxis_label_update = {
  prop: 'xAxis.label',
  group: 'axes',
  name: 'axis label should be passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %y',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const xAxisLabel = page.doc.querySelector(testSelector);
    expect(xAxisLabel).toEqualText('Cats and Dogs');
  }
};

export const yaxis_label_update = {
  prop: 'yAxis.label',
  group: 'axes',
  name: 'axis label should be passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis-label]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
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
    component.yAxis = {
      visible: true,
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '0[.][0][0]a',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const yAxisLabel = page.doc.querySelector(testSelector);
    expect(yAxisLabel).toEqualText('Cats and Dogs');
  }
};

export const xaxis_format_default = {
  prop: 'xAxis.format',
  group: 'axes',
  name: 'axis date format should be %b %y by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || [
      'Jan 16',
      'Feb 16',
      'Mar 16',
      'Apr 16',
      'May 16',
      'Jun 16',
      'Jul 16',
      'Aug 16',
      'Sep 16',
      'Oct 16',
      'Nov 16',
      'Dec 16'
    ];
    component.wrapLabel = false;
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
    const xAxisTicks = page.doc.querySelectorAll(testSelector);
    xAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const yaxis_format_default = {
  prop: 'yAxis.format',
  group: 'axes',
  name: 'axis number format should be 0[.][0][0]a by default',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || ['3b', '4b', '5b', '6b', '7b', '8b', '9b', '10b'];
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
    const yAxisTicks = page.doc.querySelectorAll(testSelector);
    yAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const xaxis_format_load = {
  prop: 'xAxis.format',
  group: 'axes',
  name: 'axis date format should be %b %Y when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || [
      'Jan 2016',
      'Feb 2016',
      'Mar 2016',
      'Apr 2016',
      'May 2016',
      'Jun 2016',
      'Jul 2016',
      'Aug 2016',
      'Sep 2016',
      'Oct 2016',
      'Nov 2016',
      'Dec 2016'
    ];
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %Y',
      tickInterval: 1
    };
    component.wrapLabel = false;
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
    const xAxisTicks = page.doc.querySelectorAll(testSelector);
    xAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const yaxis_format_load = {
  prop: 'yAxis.format',
  group: 'axes',
  name: 'axis number format should be $0[.][0]a when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.yAxis = {
      visible: true,
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '$0[.][0]a',
      tickInterval: 1
    };
    const EXPECTEDTICKS = expectedOutput || ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];
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
    const yAxisTicks = page.doc.querySelectorAll(testSelector);
    yAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const xaxis_format_update = {
  prop: 'xAxis.format',
  group: 'axes',
  name: 'axis date format should be %b %Y when passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || [
      'Jan 2016',
      'Feb 2016',
      'Mar 2016',
      'Apr 2016',
      'May 2016',
      'Jun 2016',
      'Jul 2016',
      'Aug 2016',
      'Sep 2016',
      'Oct 2016',
      'Nov 2016',
      'Dec 2016'
    ];
    component.wrapLabel = false;
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
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %Y',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const xAxisTicks = page.doc.querySelectorAll(testSelector);
    xAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const yaxis_format_update = {
  prop: 'yAxis.format',
  group: 'axes',
  name: 'axis number format should be $0[.][0]a when passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];
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
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '$0[.][0]a',
      tickInterval: 1
    };
    await page.waitForChanges();

    // ASSERT
    const yAxisTicks = page.doc.querySelectorAll(testSelector);
    yAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(EXPECTEDTICKS[i]);
    });
  }
};

export const xaxis_tickInterval_load = {
  prop: 'xAxis.tickInterval',
  group: 'axes',
  name: 'axis tick interval should be 2 when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || [
      'Jan 2016',
      'Feb 2016',
      'Mar 2016',
      'Apr 2016',
      'May 2016',
      'Jun 2016',
      'Jul 2016',
      'Aug 2016',
      'Sep 2016',
      'Oct 2016',
      'Nov 2016',
      'Dec 2016'
    ];
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %Y',
      tickInterval: 2
    };
    component.wrapLabel = false;
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
    const xAxisTicks = page.doc.querySelectorAll(testSelector);
    xAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(i % 2 === 0 ? EXPECTEDTICKS[i] : '');
    });
  }
};

export const yaxis_tickInterval_load = {
  prop: 'yAxis.tickInterval',
  group: 'axes',
  name: 'axis tick interval should be 2 when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    component.yAxis = {
      visible: true,
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '$0[.][0]a',
      tickInterval: 2
    };
    const EXPECTEDTICKS = expectedOutput || ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];
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
    const yAxisTicks = page.doc.querySelectorAll(testSelector);
    yAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(i % 2 === 0 ? EXPECTEDTICKS[i] : '');
    });
  }
};

export const xaxis_tickInterval_update = {
  prop: 'xAxis.tickInterval',
  group: 'axes',
  name: 'axis tick interval should be 2 when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || [
      'Jan 2016',
      'Feb 2016',
      'Mar 2016',
      'Apr 2016',
      'May 2016',
      'Jun 2016',
      'Jul 2016',
      'Aug 2016',
      'Sep 2016',
      'Oct 2016',
      'Nov 2016',
      'Dec 2016'
    ];
    component.wrapLabel = false;
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
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'month',
      format: '%b %Y',
      tickInterval: 2
    };
    await page.waitForChanges();

    // ASSERT
    const xAxisTicks = page.doc.querySelectorAll(testSelector);
    xAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(i % 2 === 0 ? EXPECTEDTICKS[i] : '');
    });
  }
};

export const yaxis_tickInterval_update = {
  prop: 'yAxis.tickInterval',
  group: 'axes',
  name: 'axis tick interval should be 2 when passed on update',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=y-axis] [data-testid=axis-tick-text]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    const EXPECTEDTICKS = expectedOutput || ['$3b', '$4b', '$5b', '$6b', '$7b', '$8b', '$9b', '$10b'];
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
      gridVisible: false,
      label: 'Cats and Dogs',
      format: '$0[.][0]a',
      tickInterval: 2
    };
    await page.waitForChanges();

    // ASSERT
    const yAxisTicks = page.doc.querySelectorAll(testSelector);
    yAxisTicks.forEach((tick, i) => {
      expect(tick).toEqualText(i % 2 === 0 ? EXPECTEDTICKS[i] : '');
    });
  }
};

export const xaxis_unit_load = {
  prop: 'xAxis.unit',
  group: 'axes',
  name: 'axis date format should be unit millisecond when passed on load',
  testProps: {},
  testSelector: '[data-testid=padding-container] > [data-testid=x-axis] [data-testid=axis-tick]',
  testFunc: async (component: any, page: SpecPage, testProps: object, testSelector: string, expectedOutput: any) => {
    // ARRANGE
    // if we have any testProps apply them
    if (Object.keys(testProps).length) {
      Object.keys(testProps).forEach(testProp => {
        component[testProp] = testProps[testProp];
      });
    }
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: 'Cats and Dogs',
      unit: 'millisecond',
      format: '%b %Y',
      tickInterval: 1
    };
    component.wrapLabel = false;
    // if we have any testProps apply them

    // ACT
    page.root.appendChild(component);
    await page.waitForChanges();

    // ASSERT
    const xAxisTick = page.doc.querySelector(testSelector);
    flushTransitions(xAxisTick);
    await page.waitForChanges();
    const transformData = parseTransform(xAxisTick.getAttribute('transform'));
    expect(parseFloat(transformData['translate'][0])).toBeLessThan(2);
  }
};

/* CANNOT TEST TRANSFORM ATTRIBUTE ON UPDATE DUE TO JSDOM LIMITATIONS
export const xaxis_unit_update = {
  prop: 'xAxis.unit',
  group: 'axes',
  name: 'axis date format should be unit millisecond when passed on update',
  testProps: {},
  testSelector: "[data-testid=x-axis] [data-testid=axis-tick]",
  testFunc: async (
    component: any,
    page: SpecPage,
    testProps: object,
    testSelector: string,
		expectedOutput: any
  ) => {
    // ARRANGE
    component.wrapLabel = false;
    // if we have any testProps apply them

    // ACT RENDER
    page.root.appendChild(component);
    await page.waitForChanges();

    // ACT UPDATE
    component.xAxis = {
      visible: true,
      gridVisible: true,
      label: "Cats and Dogs",
      unit: "millisecond",
      format: "%b %Y",
      tickInterval: 1
    }
    await page.waitForChanges();

    // ASSERT
    const xAxisTick = page.doc.querySelector(testSelector);
    flushTransitions(xAxisTick);
    await page.waitForChanges();
    const transformData = parseTransform(xAxisTick.getAttribute('transform'));
    expect(parseFloat(transformData['translate'][0])).toBeLessThan(2);
  }
};
*/
