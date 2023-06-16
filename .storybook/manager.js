/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { addons } from '@storybook/addons';
import theme from './theme';

addons.setConfig({
  theme: theme,
  enableShortcuts: false,
  toolbar: {
    zoom: { hidden: true },
    eject: { hidden: true },
    copy: { hidden: true },
    fullscreen: { hidden: true },
    'storybook/background': { hidden: true },
    'storybook/viewport': { hidden: true }
  },
  sidebar: {
    showRoots: false
  },
  previewTabs: {
    canvas: 'Component Viewer',
    'storybook/docs/panel': { index: -1 }
  }
});

// this is glitchy
setTimeout(function() {
  addons.elements.tab['storybookjs/notes/panel'].title = 'README';
}, 10);
