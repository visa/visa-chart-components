/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import React from 'react';
import { LineChart } from '../../charts-react/dist/components/visa-charts';
import md from '!raw-loader!../README.md';
import docpage from './line-chart.mdx';
import { getProperties, setProperties, transformDates } from '../../../.storybook/utils.js';
import { useArgs } from '@storybook/client-api';

let { chartRecipes, argTypes, distinctArgs } = getProperties('line-chart');

let new_md = md.replace(/!\[[A-z].*\)/, '');

export default {
  title: 'line-chart',
  component: LineChart,
  argTypes: argTypes,
  parameters: {
    notes: {
      markdown: new_md
    },
    docs: {
      page: docpage
    },
    controls: { sort: 'alpha' }
  }
};

LineChart.displayName = 'LineChart';

const Template = args => {
  const [_, updateArgs] = useArgs();

  const click = e => {
    if (args.clickEvent) {
      args.onChartClick(e.detail);
      let highlights = args.clickHighlight || [];
      let interactionKeys = args.interactionKeys || ['label'];
      let index = -1;

      if (highlights) {
        highlights.forEach((el, i) => {
          let keyMatch = [];
          interactionKeys.forEach(k => {
            el[k] == e.detail.data[k] ? keyMatch.push(true) : keyMatch.push(false);
          });
          keyMatch.every(v => v === true) ? (index = i) : null;
        });

        let newHighlights = [...highlights];
        if (index > -1) {
          newHighlights.splice(index, 1);
        } else {
          newHighlights.push(e.detail.data);
        }
        updateArgs({ clickHighlight: newHighlights });
      }
    }
  };
  const hover = e => {
    if (args.hoverEvent) {
      args.onChartHover(e.detail);
      updateArgs({ hoverHighlight: e.detail.data });
    }
  };
  const mouse = e => {
    if (args.mouseOutEvent) {
      args.onMouseOuts(e);
      updateArgs({ hoverHighlight: '' });
    }
  };
  const drawStart = e => {
    if (args.drawStartEvent) {
      args.onDrawStart(e);
    }
  };
  const drawEnd = e => {
    if (args.drawEndEvent) {
      args.onDrawEnd(e);
    }
  };
  const initialLoad = e => {
    if (args.initialLoadEvent) {
      args.onInitialLoad(e);
    }
  };
  const transitionEnd = e => {
    if (args.transitionEndEvent) {
      args.onTransitionEnd(e);
    }
  };

  // now we can transform dates within the args object
  transformDates(args);

  return (
    <LineChart
      onClickEvent={click}
      onHoverEvent={hover}
      onMouseOutEvent={mouse}
      onDrawStartEvent={drawStart}
      onDrawEndEvent={drawEnd}
      onInitialLoadEvent={initialLoad}
      onTransitionEndEvent={transitionEnd}
      {...args}
    />
  );
};

export const Default = Template.bind({});
export const BreakLines = Template.bind({});
export const Highlight = Template.bind({});
export const Interaction = Template.bind({});
export const Hidden = Template.bind({});

let args, exclusions;
chartRecipes.forEach(i => {
  if (i.name) {
    let n = i.name
      .toLowerCase()
      .split(' ')
      .map(s => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ')
      .replace(/\s/g, '');
    if (eval(`typeof ${n} === "function"`)) {
      ({ args, exclusions } = setProperties(chartRecipes, i.name, distinctArgs));
      eval(n).args = args;
      // eval(n).parameters = { controls: { exclude: exclusions } };
    }
  }
});
