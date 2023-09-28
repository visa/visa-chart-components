/**
 * Copyright (c) 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select, selectAll } from 'd3-selection';
import { getBrowser } from './browser-util';
import { keyCodes } from './accessibilityController';
import { drawTooltip } from './tooltip';

const browser = getBrowser();
const isIE11 = browser === 'IE'; // ua.includes('rv:11.0');
const isIEEdge = browser === 'Edge'; // ua.includes('Edge');

export const initializeElementAccess = (node: any) => {
  select(node)
    .attr('tabindex', -1)
    .attr('role', 'presentation')
    .attr('focusable', false);
};

export const hideNonessentialGroups = (rootNode: any, exception: any) => {
  const childrenG = rootNode.childNodes.length > 1 ? rootNode.childNodes : rootNode.firstElementChild.childNodes;

  if (childrenG) {
    selectAll(childrenG).each((_, i, n) => {
      if (!(n[i] === exception)) {
        hideNode(n[i]);
      }
    });
  }
};

export const setTooltipAccess = (el: any) => {
  el.setAttribute('role', 'tooltip'); // AT tooltip
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('tabindex', null);
};

export const setLegendAccess = (root: any, id: string) => {
  hideNode(root);
  hideNode(root.parentNode, true);
  select(root).classed('vcl-svg', true);

  if (isIE11 || isIEEdge) {
    handleContrast(null, id);
  }
};

export const hideNode = (node: any, excludeFocusable?: boolean) => {
  select(node)
    .attr('aria-hidden', 'true')
    .attr('role', 'presentation')
    .attr('focusable', !excludeFocusable ? 'false' : null)
    .attr('tabindex', null);
};

export const createUrl = (id?: string) => {
  let path = window.location.pathname;
  if (path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1);
  }

  const ending = id ? id + ')' : '';
  return 'url(#' + ending;
};

export const setHighContrastListener = (root: any, id: string) => {
  select(root).classed('vcl-svg', true);
  let filter = select(root).select('.vcl-inversion-filter');
  if (!filter.size()) {
    let defs = select(root).select('defs');
    if (!defs.size()) {
      defs = select(root).append('defs');
    }
    filter = defs
      .append('filter')
      .attr('class', 'vcl-inversion-filter')
      .attr('color-interpolation-filters', 'sRGB');
    // this operation will "invert" every color: dark blue becomes light orange,
    // pink becomes dark green, etc. This ensures the new luminance is fully inverted
    filter
      .append('feColorMatrix')
      .attr('in', 'SourceGraphic')
      .attr('type', 'matrix')
      .attr(
        'values',
        `-1 0 0 0 1 
        0 -1 0 0 1 
        0 0 -1 0 1
        0 0 0 1 0`
      );
    // once luminance is inverted, we can rotate the hue back to its original
    // this means that the dark blue is now a light blue instead of light orange
    filter
      .append('feColorMatrix')
      .attr('type', 'hueRotate')
      .attr('values', '180');
  }
  filter.attr('id', 'inversion-' + id);
  const passMediaEventToHandler = a => {
    handleContrast(a, id);
  };
  const runContrastHandler = () => {
    handleContrast(null, id);
  };
  if (isIE11 || isIEEdge) {
    // here we are listening to contrast mode being turned on or off as well as
    // listening to the contrast modes being switched between types
    matchMedia('(-ms-high-contrast: active)').addListener(passMediaEventToHandler);
    matchMedia('(-ms-high-contrast: black-on-white)').addListener(runContrastHandler);
    passMediaEventToHandler(matchMedia('(-ms-high-contrast: active)'));
  }
};

const handleContrast = (a?: any, id?: string) => {
  const contrastStatus = a || matchMedia('(-ms-high-contrast: active)');
  if (contrastStatus.matches && !matchMedia('(-ms-high-contrast: black-on-white)').matches) {
    const url = createUrl('inversion-' + id);

    // we will always structure our SVG elements to have a single g that contains
    // all of our elements, so we only need to select the first g element for
    // every SVG within our component space (legend, chart, etc)
    select('#' + id)
      .selectAll('.vcl-svg')
      .select('g')
      .attr('filter', url);
  } else {
    select('#' + id)
      .selectAll('.vcl-svg')
      .select('g')
      .attr('filter', null);
  }
};

// hideTooltip handles is called by hideTooltipListener.
// We are checking if the tooltip is visible, if yes,
// we are settings its opacity to 0.
const hideTooltipHandler = event => {
  if (event.keyCode === keyCodes.escape) {
    selectAll('.vcl-tooltip').each((_, i, n) => {
      const root = select(n[i]);
      if (root.style('opacity') == 1) {
        drawTooltip({ root: root, isToShow: false });
      }
    });

    // }
  }
};

// hideTooltipListener is responsible to attach/remove a global eventListener
// to the window. It is attached/removed once even if we have multiple
// chart instances on the page. However, the listener is created when a tooltip
// is shown, therefore if there are multiple visible tooltips the window
// eventListener could be added to the DOM as many times as many tooltips are visible
// in a moment in time. Multiple tooltips is an unlikely scenario so we settle with
// this solution for now.
export const hideTooltipListener = isToShow => {
  if (isToShow) {
    window.addEventListener('keydown', hideTooltipHandler, true);
  } else {
    window.removeEventListener('keydown', hideTooltipHandler, true);
  }
};
