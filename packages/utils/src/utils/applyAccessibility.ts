/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import FocusableForeignObject from 'ally.js/src/element/focus.svg-foreign-object-hack';
import { select, event, selectAll } from 'd3-selection';
import { getScopedData } from './dataTransform';
import { getBrowser, getOS } from './browser-util';
import { polyfillMouseEvents } from './customPolyfills';
const keyCodes = {
  parent: 27, // ESCAPE
  child: 13, // ENTER
  select: 32, // SPACEBAR
  nextSibling: 39, // RIGHT ARROW
  previousSibling: 37, // LEFT ARROW
  nextCousin: 40, // DOWN ARROW
  previousCousin: 38, // UP ARROW
  nextCousinAlternate: 190, // PERIOD
  previousCousinAlternate: 188, // COMMA
  shift: 16, // SHIFT
  tab: 9 // TAB
};
const browser = getBrowser();
const userOS = getOS();
// const useHTMLController = true; // !!browser; // this resolves to false in jsdom, use this line for testing
const useHTMLController = !!browser; // this resolves to false in jsdom
const isIE11 = browser === 'IE'; // ua.includes('rv:11.0');
const isIEEdge = browser === 'Edge'; // ua.includes('Edge');
const isSafari = browser === 'Safari';
if (isIE11) {
  polyfillMouseEvents(window);
}

const rootSVGRole = 'application'; // !isIE11 ? 'region' : 'application';
const groupRole = 'img'; // 'menu'; // !(isIE11 || isIEEdge) ? 'group' : 'tree';
const staticGeometryRole = 'img'; // 'menuitem'; // !(isIE11 || isIEEdge) ? 'img' : 'treeitem';
const interactiveGeometryRole = 'button'; // 'menuitem'; // !(isIE11 || isIEEdge) ? 'button' : 'treeitem';
const controllerPrefix = 'node-';

let fired = false;
let shiftFired = false;
const emptyDescriptions = {
  'vcl-access-title': 'This chart has no title provided.',
  'vcl-access-subtitle': 'This chart has no subtitle provided.',
  'vcl-access-long-description': '', // 'This chart has no long description provided.',
  'vcl-access-context': '',
  'vcl-access-executive-summary': '', // 'This chart has no executive summary provided.',
  'vcl-access-purpose': '', // 'This chart has no information regarding its purpose provided.',
  'vcl-access-statistics': '', // 'This chart has no statistical explanation provided.',
  'vcl-access-layout': '', // 'This chart has no layout description provided.',
  'vcl-access-xAxis': '', // 'This chart has no x axis.',
  'vcl-access-yAxis': '', // 'this chart has no y axis.',
  'vcl-access-notes': '', // 'No notes provided regarding the structure of the chart.',
  'vcl-access-annotation': '', // 'This chart has no annotations.',
  'vcl-access-annotation-title': '', // 'This chart displays an annotation with no title.',
  'vcl-access-annotation-description': '', // 'This annotation has no description provided.'
  headings: ''
};

export const initializeGeometryAccess = ({
  node,
  sameGroupCousinKey,
  recursive
}: {
  node: any;
  sameGroupCousinKey?: string;
  recursive?: boolean;
}) => {
  // const targetSelection = !recursive ? select(node) : select(node.firstElementChild);

  if (useHTMLController) {
    select(node)
      .attr('tabindex', -1)
      .attr('role', 'presentation')
      .attr('focusable', false);
  } else {
    select(node)
      .on('keydown', () => {
        const e = event;
        e.stopPropagation();
        keyDownHandler(e, false, recursive, sameGroupCousinKey);
      })
      .on('keyup', () => {
        fired = false;
      })
      .attr('aria-disabled', 'false')
      .attr('role', staticGeometryRole)
      .attr('focusable', true)
      .attr('tabindex', -1) // (_, i, n) =>
      //   +select(n[i]).attr('tabindex') === 0 ||
      //   checkTabbableSiblings(n[i].parentNode) ||
      //   checkAccessFocus(n[i].parentNode)
      //     ? 0
      //     : -1
      // )
      .on('focus', (_, i, n) => {
        if (recursive) {
          // if recursive, remove tabindex from children
          const firstChild = findFirstValidChild(node, recursive);
          if (firstChild) {
            const recursiveChildren = findValidRecursiveSiblings(firstChild);
            recursiveChildren.forEach(sibling => {
              if (sibling.getAttribute('tabindex') !== null) {
                sibling.setAttribute('tabindex', -1);
              }
            });
          }
          // we also need to add a click event to the parent G element that will remove
          // the focus indicator (like a normal grouped chart would)
          select(n[i].parentNode).on('click', () => {
            event.cancelBubble = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            removeKeyboardHighlight(n[i].parentNode);
          });
        }
        setActiveChild(node);
        focusAsMouseover(node, recursive, true);
      })
      .on('blur', () => {
        removeActiveChild(node);
        blurAsMouseout(node);
      });
  }
};

export const setGeometryAccessLabel = ({
  node,
  geomType,
  includeKeyNames,
  dataKeys,
  groupKeys,
  nested,
  recursive,
  groupName,
  uniqueID,
  disableKeyNav
}: {
  node: any;
  geomType: string;
  includeKeyNames: boolean;
  dataKeys: any;
  groupKeys?: any;
  nested?: string;
  recursive?: boolean;
  groupName?: string;
  uniqueID?: string;
  disableKeyNav?: boolean;
}) => {
  if (useHTMLController) {
    select(node)
      .attr('id', () => {
        if (!node.id) {
          const random = generateRandomStringID(uniqueID);
          return random;
        }
        return node.id;
      })
      .on(
        'focus',
        !disableKeyNav
          ? (_, i, n) => {
              const idOfTarget = n[i].id;
              if (idOfTarget) {
                const rootNode = document.getElementById('chart-area-' + uniqueID);
                const sameGroupCousinKey = select(rootNode).attr('data-sgck');
                const groupAccessor = select(rootNode).attr('data-group');
                prepareControllerNodes({
                  rootNode,
                  nodeID: idOfTarget,
                  geomType,
                  includeKeyNames,
                  dataKeys,
                  groupKeys,
                  nested,
                  groupName,
                  groupAccessor,
                  recursive,
                  sameGroupCousinKey,
                  deleteControllers: false
                });
                hideKeyboardHighlight(n[i]);
              }
            }
          : null
      );
  } else {
    const capitalizedGeomType = geomType[0].toUpperCase() + geomType.substring(1);
    const capitalizedGroupName = groupName ? groupName[0].toUpperCase() + groupName.substring(1) : '';
    const targetNode = !recursive ? node : node.parentNode;
    const siblings = !recursive ? targetNode.parentNode.childNodes : findValidRecursiveSiblings(node);
    const index = Array.prototype.indexOf.call(siblings, node);
    const element = select(targetNode);
    element.attr('aria-label', d => {
      // this is used to make recursive work properly
      const label = createLabel({
        d,
        i: index,
        n: siblings,
        capitalizedGeomType,
        capitalizedGroupName,
        includeKeyNames,
        dataKeys,
        groupKeys,
        nested,
        recursive
      });
      if (recursive) {
        targetNode.firstElementChild.setAttribute('aria-label', label);
        return null;
      }
      return label;
    });
  }
};

export const setElementInteractionAccessState = (node: any, selected: boolean, selectable: boolean) => {
  if (useHTMLController) {
    const targetID = '#' + controllerPrefix + select(node).attr('id');
    select(node)
      .attr('data-aria-pressed', selectable ? selected : null)
      .attr('data-role', selectable ? interactiveGeometryRole : staticGeometryRole);
    select(targetID)
      .attr('aria-pressed', selectable ? selected : null)
      .attr('role', selectable ? interactiveGeometryRole : staticGeometryRole);
    // .attr('role', selectable ? 'button' : null);
  } else {
    select(node)
      .attr('aria-pressed', selectable ? selected : null)
      .attr('role', selectable ? interactiveGeometryRole : staticGeometryRole);
  }
};

export const initializeGroupAccess = (node: any) => {
  if (useHTMLController) {
    select(node)
      .attr('tabindex', -1)
      .attr('role', 'presentation')
      .attr('focusable', false);
  } else {
    select(node)
      .attr('aria-hidden', 'false')
      .attr('tabindex', -1)
      .attr('role', groupRole)
      .attr('focusable', 'true')
      .on('click', (_, i, n) => {
        event.cancelBubble = true;
        if (event.stopPropagation) {
          event.stopPropagation();
        }
        removeKeyboardHighlight(n[i]);
      })
      .on('keydown', () => {
        const e = event;
        e.stopPropagation();
        keyDownHandler(e, true);
      })
      .on('keyup', () => {
        const e = event;
        const keyCode = e.keyCode || e.which;
        keyUpHandler(keyCode);
      })
      .on('focus', (_, i, n) => {
        setActiveChild(n[i]);
        select(n[i])
          .selectAll('[tabindex]')
          .attr('tabindex', -1);
        drawKeyboardFocusClone(n[i]);
      })
      .on('blur', (_, i, n) => {
        removeActiveChild(n[i]);
        removeKeyboardHighlight(n[i]);
      });
  }
};

export const setGroupAccessLabel = ({
  node,
  geomType,
  includeKeyNames,
  groupName,
  isSubgroup,
  groupAccessor,
  groupKeys,
  uniqueID
}: {
  node: any;
  geomType: string;
  includeKeyNames: boolean;
  groupName?: string;
  isSubgroup?: boolean;
  groupAccessor?: string;
  groupKeys?: any;
  uniqueID?: string;
}) => {
  if (useHTMLController) {
    select(node).attr('id', () => {
      if (!node.id) {
        return generateRandomStringID(uniqueID);
      }
      return node.id;
    });
  } else {
    const capitalizedGeomType = geomType[0].toUpperCase() + geomType.substring(1);
    const capitalizedGroupName = groupName ? groupName[0].toUpperCase() + groupName.substring(1) : '';
    const element = select(node);
    element.attr('aria-label', (d, i, n) => {
      const childSelection = n[i].querySelectorAll('*:not(.vcl-accessibility-focus-highlight)');
      const childrenCount = childSelection.length;
      if (isSubgroup) {
        let groupData =
          childSelection[0] && childSelection[0]['__data__']
            ? includeKeyNames && groupAccessor && childSelection[0]['__data__'][groupAccessor]
              ? groupAccessor + ' ' + childSelection[0]['__data__'][groupAccessor] + '. '
              : childSelection[0]['__data__'][groupAccessor] + '. '
            : '';
        if (groupKeys && groupKeys.length) {
          groupKeys.forEach(groupKey => {
            groupData += !groupKey ? '' : d[groupKey] + '. ';
          });
        }
        const index = Array.prototype.indexOf.call(n[i].parentNode.childNodes, n[i]) + 1;
        return (
          groupData +
          (capitalizedGroupName || capitalizedGeomType + ' group') +
          ' ' +
          index +
          ' of ' +
          n[i].parentNode.querySelectorAll('g:not(.vcl-accessibility-focus-highlight)').length +
          ' which contains ' +
          childrenCount +
          ' interactive ' +
          geomType +
          (childrenCount !== 1 ? 's.' : '.')
        );
      } else {
        return (
          (capitalizedGroupName || capitalizedGeomType + ' group') +
          ' which contains ' +
          childrenCount +
          ' interactive ' +
          geomType +
          (childrenCount !== 1 ? 's.' : '.')
        );
      }
    });
  }
  // const exists = node.firstElementChild.nodeName === 'title';
  // const action = exists ? 'select' : 'append';
  // const id = exists
  //   ? element.select('title').attr('id')
  //   : 'visa-charts-library-' + Math.round(Math.random() * 1000000) + '-' + Math.round(Math.random() * 1000000);
  // const title = element[action]('title')
  //   .text(element.attr('aria-label'))
  //   .attr('lang', 'en-us')
  //   .attr('id', id);
  // node.insertBefore(title.node(), node.firstElementChild);
  // element.attr('aria-labelledby', id);
};

const validKeyCode = keyCode => {
  return (
    keyCode === keyCodes.select ||
    keyCode === keyCodes.child ||
    keyCode === keyCodes.parent ||
    keyCode === keyCodes.nextSibling ||
    keyCode === keyCodes.previousSibling ||
    keyCode === keyCodes.nextCousin ||
    keyCode === keyCodes.previousCousin ||
    keyCode === keyCodes.nextCousinAlternate ||
    keyCode === keyCodes.previousCousinAlternate
  );
};

export const setRootSVGAccess = ({
  node,
  chartTag,
  title,
  description,
  uniqueID,
  geomType,
  includeKeyNames,
  dataKeys,
  groupKeys,
  nested,
  groupName,
  groupAccessor,
  recursive,
  disableKeyNav
}: {
  node: any;
  chartTag: string;
  title: string;
  description: string;
  uniqueID: string;
  geomType: string;
  includeKeyNames: boolean;
  dataKeys: any;
  groupKeys?: any;
  nested?: string;
  groupName?: string;
  groupAccessor?: string;
  recursive?: boolean;
  disableKeyNav?: boolean;
}) => {
  const svg = select(node);
  if (useHTMLController) {
    const sameGroupCousinKey =
      groupAccessor && (chartTag === 'bar-chart' || chartTag === 'world-map') ? groupAccessor : '';
    svg
      .attr('role', 'presentation')
      .attr('focusable', false)
      .attr('tabindex', -1)
      .style('overflow', 'hidden')
      .on(
        'focus',
        !disableKeyNav
          ? () => {
              focusTarget(
                select(parent)
                  .select('.VCL-controller')
                  .node()
              );
              // removeKeyboardHighlight(n[i].firstElementChild, true)
            }
          : null
      );
    const parent = node.parentNode;
    let controller = select(parent).select('.VCL-controller');

    const getRootAriaLabel = () => {
      const titleText = `${title}. `;
      const subtitle = description ? description + '. ' : '';
      const descText = `${subtitle} Navigate into the chart area by pressing ENTER. ID: ${uniqueID}`;
      return titleText + descText;
    };
    if (!controller.size()) {
      controller = select(parent).insert('div', ':first-child');

      controller.attr('class', 'VCL-controller screen-reader-info');
    }

    controller
      .attr('id', 'chart-area-' + uniqueID)
      .attr('data-sgck', sameGroupCousinKey || null)
      .attr('data-group', groupAccessor)
      .attr('aria-label', !disableKeyNav ? getRootAriaLabel() : null)
      .text(!disableKeyNav ? `Interactive ${chartTag}.` : '')
      .attr('role', !disableKeyNav ? rootSVGRole : 'presentation')
      .attr('tabindex', !disableKeyNav ? '0' : '-1')
      .on(
        'keyup',
        !disableKeyNav
          ? () => {
              const e = event;
              const keyCode = e.keyCode || e.which;
              keyUpHandler(keyCode);
            }
          : null
      )
      .on(
        'focus',
        !disableKeyNav
          ? (_, i, n) => {
              select(n[i])
                .selectAll('[tabindex]')
                .attr('tabindex', -1);

              drawKeyboardFocusClone(n[i], recursive);
              controller.attr('aria-label', getRootAriaLabel());
            }
          : null
      )
      .on(
        'blur',
        !disableKeyNav
          ? (_, i, n) => {
              removeKeyboardHighlight(
                select(n[i].parentNode)
                  .select('svg :first-child')
                  .node(),
                true
              );
              controller.attr('aria-label', `Interactive ${chartTag}. ID: ${uniqueID}`);
            }
          : null
      )
      .on(
        'keydown',
        !disableKeyNav
          ? () => {
              const e = event;
              const keyCode = event.keyCode || event.which;
              const eventType = validKeyCode(keyCode);
              if (eventType && !fired) {
                fired = true;
                e.stopPropagation();
                const targetChild = enterChartArea(e, recursive);
                if (targetChild) {
                  prepareControllerNodes({
                    rootNode: controller.node(),
                    nodeID: targetChild.id,
                    geomType,
                    includeKeyNames,
                    dataKeys,
                    groupKeys,
                    nested,
                    groupName,
                    groupAccessor,
                    recursive,
                    sameGroupCousinKey
                  });
                }
              }
            }
          : null
      );

    const controllerChildID = controller.attr('aria-activedescendant');
    if (controllerChildID && !disableKeyNav) {
      const child = document.getElementById(controllerChildID.substring(5));
      if (child) {
        setActiveChild(child);
      } else {
        controller.attr('aria-activedescendant', null);
      }
    } else {
      controller.attr('aria-activedescendant', null);
    }
    const rootNode = controller.node();
    if (disableKeyNav && rootNode.children && rootNode.children.length) {
      let childrenToRemove = rootNode.children.length;
      while (childrenToRemove) {
        rootNode.removeChild(rootNode.children[0]);
        childrenToRemove--;
      }
    }
  } else {
    const titleText = `${title}. `;
    const subtitle = description ? description + '. ' : '';
    const descText = `${subtitle}Interactive ${chartTag}. Navigate into the chart area by pressing ENTER.`;
    const action = svg.select('title').size() ? 'select' : 'append';
    svg[action]('title')
      .text(titleText)
      .attr('id', `visa-viz-${chartTag}-title-${uniqueID}`)
      .attr('lang', 'en-us');

    svg[action]('desc')
      .text(descText)
      .attr('id', `visa-viz-${chartTag}-desc-${uniqueID}`)
      .attr('lang', 'en-us');
    svg
      .attr('role', rootSVGRole) // alternative suggestion: application
      .attr('aria-labelledby', `visa-viz-${chartTag}-title-${uniqueID}`) // this was removed because it is not read by voiceover but overrides aria-label
      .attr('aria-describedby', `visa-viz-${chartTag}-desc-${uniqueID}`) // this might not always work depending on AT, added just in case
      .attr('aria-label', `${titleText}Interactive ${chartTag}. ID: ${uniqueID}.`)
      .attr('focusable', 'true') // originally this was set to false because of an IE bug where parent element receives focus with children. Cannot reproduce.
      .attr('tabindex', 0)
      .attr('id', 'chart-area-' + uniqueID)
      .on('keydown', () => {
        const e = event;
        const keyCode = event.keyCode || event.which;
        const eventType = validKeyCode(keyCode);
        if (eventType && !fired) {
          fired = true;
          e.stopPropagation();
          enterChartArea(e, recursive);
        }
      })
      .on('keyup', () => {
        const e = event;
        const keyCode = e.keyCode || e.which;
        keyUpHandler(keyCode);
      })
      .on('focus', (_, i, n) => {
        select(n[i])
          .selectAll('[tabindex]')
          .attr('tabindex', -1);

        drawKeyboardFocusClone(n[i], recursive);
      })
      .on('blur', (_, i, n) => {
        removeKeyboardHighlight(n[i].firstElementChild);
      });
    // the following section may be added if role=application is used
    svg.attr('aria-activedescendant', () => {
      let descendant = null;
      if (svg.attr('aria-activedescendant')) {
        const child = svg.select('#' + svg.attr('aria-activedescendant')).node();
        if (child) {
          setActiveChild(child);
          descendant = svg.attr('aria-activedescendant');
        }
      }
      return descendant;
    });
  }

  setHighContrastListener(node, uniqueID); // 'chart-area-' + chartTag +
};

export const setAccessibilityDescriptionWidth = (uniqueID, width) => {
  select('#chart-instructions-' + uniqueID).style('width', () => {
    return Math.max(width, 200) + 'px';
  });
};

const setHighContrastListener = (root: any, id: string) => {
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

export const createUrl = (id?: string) => {
  let path = window.location.pathname;
  if (path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1);
  }
  const ending = id ? id + ')' : '';
  return (!isSafari ? 'url(#' : 'url(' + window.location.protocol + '//' + window.location.host + path + '#') + ending;
};

const prepareControllerNodes = ({
  rootNode,
  nodeID,
  geomType,
  includeKeyNames,
  dataKeys,
  groupKeys,
  nested,
  groupName,
  groupAccessor,
  recursive,
  sameGroupCousinKey,
  deleteControllers
}: {
  rootNode: any;
  nodeID: any;
  geomType: string;
  includeKeyNames: boolean;
  dataKeys: any;
  groupKeys?: any;
  nested?: string;
  groupName?: string;
  groupAccessor?: string;
  recursive?: boolean;
  sameGroupCousinKey?: string;
  deleteControllers?: boolean;
}) => {
  if (isIE11 || isIEEdge) {
    fired = false;
  }
  let drawCount = 0;
  if (!deleteControllers) {
    // find tab back node, append
    const tabBackNode = findTabBackwardNode(nodeID, recursive);
    if (tabBackNode && tabBackNode.id) {
      drawCount++;
      createControllerNode({
        rootNode,
        nodeID: tabBackNode.id,
        isTarget: false,
        geomType,
        includeKeyNames,
        dataKeys,
        groupKeys,
        nested,
        recursive,
        groupName,
        groupAccessor,
        direction: 'backward',
        sourceID: nodeID,
        sameGroupCousinKey
      });
    }
    const controllerNodeAlreadyExists = document.getElementById(controllerPrefix + nodeID);
    if (!controllerNodeAlreadyExists) {
      drawCount++;
      createControllerNode({
        rootNode,
        nodeID,
        isTarget: true,
        geomType,
        includeKeyNames,
        dataKeys,
        groupKeys,
        nested,
        recursive,
        groupName,
        groupAccessor,
        sameGroupCousinKey
      });
    } else {
      drawCount++;
      rootNode.appendChild(controllerNodeAlreadyExists.parentNode);
      select(controllerNodeAlreadyExists).on('focus', () => {});
    }

    const tabForwardNode = findTabForwardNode(nodeID, recursive);
    if (tabForwardNode && tabForwardNode.id) {
      drawCount++;
      createControllerNode({
        rootNode,
        nodeID: tabForwardNode.id,
        isTarget: false,
        geomType,
        includeKeyNames,
        dataKeys,
        groupKeys,
        nested,
        recursive,
        groupName,
        groupAccessor,
        direction: 'forward',
        sourceID: nodeID,
        sameGroupCousinKey
      });
    }
  }
  // focus controller node and add keyboard focus indication to chart element
  simulateFocus(nodeID, recursive, deleteControllers);

  // remove old nodes
  let childrenToRemove = rootNode.children.length - drawCount;
  while (childrenToRemove) {
    rootNode.removeChild(rootNode.children[0]);
    childrenToRemove--;
  }
};

const simulateFocus = (nodeID, recursive, directID?) => {
  const id = !directID ? controllerPrefix + nodeID : nodeID;
  const targetControllerElement = document.getElementById(id);
  const targetChartElement = document.getElementById(nodeID);
  simulateBlur(!directID ? targetControllerElement.parentNode.parentNode : targetControllerElement);
  focusTarget(targetControllerElement);
  if (!directID) {
    select(targetControllerElement).classed('VCL-controller-focused', true);
    focusAsMouseover(targetChartElement, recursive, false);
    setActiveChild(targetChartElement);
  } else {
    removeActiveChild(targetChartElement, true);
  }
  drawKeyboardFocusClone(targetChartElement, recursive);
};

const simulateBlur = controllerRoot => {
  const controllerToBlur = select(controllerRoot).select('.VCL-controller-focused');
  if (controllerToBlur.size()) {
    controllerToBlur.classed('VCL-controller-focused', false);
    const targetNode = document.getElementById(controllerToBlur.node().id.substring(5));
    controllerBlurToMouseout(targetNode);
  }
};

const createControllerNode = ({
  rootNode,
  nodeID,
  isTarget,
  geomType,
  includeKeyNames,
  dataKeys,
  groupKeys,
  nested,
  recursive,
  groupName,
  groupAccessor,
  direction,
  sourceID,
  sameGroupCousinKey
}: {
  rootNode: any;
  nodeID: any;
  isTarget: boolean;
  geomType: string;
  includeKeyNames: boolean;
  dataKeys: any;
  groupKeys?: any;
  nested?: string;
  recursive?: boolean;
  groupName?: string;
  groupAccessor?: string;
  direction?: string;
  sourceID?: string;
  sameGroupCousinKey?: string;
}) => {
  const sourceNode = document.getElementById(nodeID);
  const isGroup = sourceNode.nodeName === 'g';
  let nodeType = 'div';
  let nodeRole = 'img';
  let nodeCanBePressed = null;
  if (!isGroup) {
    nodeRole = select(sourceNode).attr('data-role');
    nodeCanBePressed = select(sourceNode).attr('data-aria-pressed');
    nodeType = nodeCanBePressed ? 'button' : 'div';
  }
  select(rootNode)
    .append(!isIEEdge ? 'figure' : 'div')
    .attr('role', 'figure')
    .append(nodeType)
    .attr('role', nodeRole)
    .attr('id', controllerPrefix + nodeID)
    .attr('tabindex', -1)
    .on('keydown', () => {
      const e = event;
      e.stopPropagation();
      const result = getInteractionResult(
        nodeID,
        e,
        document.getElementById(nodeID).nodeName === 'g',
        recursive,
        sameGroupCousinKey
      );
      if (result) {
        if (result.clicked) {
          // we will "click" the element now
          const resultTarget = document.getElementById(result.id);
          hideKeyboardHighlight(resultTarget.parentNode);
          const evt = new MouseEvent('click', { bubbles: false, cancelable: true });
          resultTarget.dispatchEvent(evt);

          // focus controller node and add keyboard focus indication to chart element
          simulateFocus(nodeID, recursive);
        } else if (result.focused) {
          // this will prepare the controller's nodes and then focus the result.id
          const idOfTarget = result.id || rootNode.id;
          prepareControllerNodes({
            rootNode,
            nodeID: idOfTarget,
            geomType,
            includeKeyNames,
            dataKeys,
            groupKeys,
            nested,
            groupName,
            groupAccessor,
            recursive,
            sameGroupCousinKey,
            deleteControllers: idOfTarget === rootNode.id
          });
        }
      }
    })
    .on('keyup', () => {
      fired = false;
    })
    .on(
      'focus',
      !isTarget
        ? () => {
            let id = nodeID;
            if (direction) {
              const node =
                direction === 'backward'
                  ? findTabBackwardNode(sourceID, recursive)
                  : findTabForwardNode(sourceID, recursive);
              id = node ? node.id : '';
            }
            if (id) {
              prepareControllerNodes({
                rootNode,
                nodeID: id,
                geomType,
                includeKeyNames,
                dataKeys,
                groupKeys,
                nested,
                groupName,
                groupAccessor,
                recursive,
                sameGroupCousinKey
              });
            }
          }
        : null
    )
    .on('blur', () => {
      const node = document.getElementById(nodeID);
      controllerBlurToMouseout(node);
    })
    .attr('aria-label', (_, i, n) => {
      let label = '';
      const capitalizedGeomType = geomType[0].toUpperCase() + geomType.substring(1);
      const capitalizedGroupName = groupName ? groupName[0].toUpperCase() + groupName.substring(1) : '';
      const targetNode = !recursive ? sourceNode : sourceNode.parentNode;
      const siblings = !recursive ? targetNode.parentNode.childNodes : findValidRecursiveSiblings(sourceNode);
      const index = Array.prototype.indexOf.call(siblings, sourceNode);
      const element = select(targetNode);
      const d = targetNode['__data__'] || element.data()[0];
      if (isGroup) {
        let tabbableSiblings = 0;
        Array.prototype.forEach.call(siblings, sibling => {
          tabbableSiblings += select(sibling).attr('tabindex') !== null ? 1 : 0;
        });
        if (tabbableSiblings > 1) {
          const firstChild = targetNode.querySelectorAll('*:not(.vcl-accessibility-focus-highlight)')[0];
          let groupData =
            firstChild && firstChild['__data__']
              ? includeKeyNames && groupAccessor && firstChild['__data__'][groupAccessor]
                ? groupAccessor + ' ' + firstChild['__data__'][groupAccessor] + '. '
                : firstChild['__data__'][groupAccessor] + '. '
              : '';
          if (groupKeys && groupKeys.length) {
            groupKeys.forEach(groupKey => {
              groupData += !groupKey ? '' : d[groupKey] + '. ';
            });
          }

          const index = Array.prototype.indexOf.call(targetNode.parentNode.childNodes, targetNode) + 1;
          const childrenCount = targetNode.querySelectorAll('*:not(.vcl-accessibility-focus-highlight)').length;
          label =
            groupData +
            (capitalizedGroupName || capitalizedGeomType + ' group') +
            ' ' +
            index +
            ' of ' +
            targetNode.parentNode.querySelectorAll('g:not(.vcl-accessibility-focus-highlight)').length +
            ' which contains ' +
            childrenCount +
            ' interactive ' +
            geomType +
            (childrenCount !== 1 ? 's.' : '.');
        } else {
          const childrenCount = siblings[index].querySelectorAll('*:not(.vcl-accessibility-focus-highlight)').length;
          label =
            (capitalizedGroupName || capitalizedGeomType + ' group') +
            ' which contains ' +
            childrenCount +
            ' interactive ' +
            geomType +
            (childrenCount !== 1 ? 's.' : '.');
        }
      } else {
        label = createLabel({
          d,
          i: index,
          n: siblings,
          capitalizedGeomType,
          capitalizedGroupName,
          includeKeyNames,
          dataKeys,
          groupKeys,
          nested,
          recursive
        });
      }
      select(n[i]).text(label);
      if (nodeCanBePressed) {
        select(n[i]).attr('aria-pressed', nodeCanBePressed);
      }
      return label;
    });
};

const generateRandomStringID = (lead: string) => {
  return (
    lead +
    '-' +
    Math.round(Math.random() * 1000000) +
    '-' +
    Math.round(Math.random() * 1000000) +
    '-' +
    Math.round(Math.random() * 1000000)
  );
};

const findTabForwardNode = (elementID: string, recursive?: boolean, siblingsOnly?: boolean) => {
  const target = document.getElementById(elementID);
  if (!target || target.tagName === 'svg') {
    return null;
  } else if (!recursive && target.nextElementSibling) {
    if (select(target.nextElementSibling).attr('tabindex') !== null) {
      return target.nextElementSibling;
    } else {
      return findTabForwardNode(target.nextElementSibling.id, recursive);
    }
  } else if (recursive && findValidCousin(target, 'next', true)) {
    return findValidCousin(target, 'next', true);
  } else if (!siblingsOnly) {
    const parent = findValidParent(target, recursive);
    const parentSibling = !recursive
      ? parent.nextElementSibling
      : parent
      ? findValidCousin(parent, 'next', true)
      : null;
    if (parentSibling) {
      if (select(parentSibling).attr('tabindex') !== null) {
        return parentSibling;
      } else if (parentSibling.id) {
        return findTabForwardNode(parentSibling.id, recursive, true);
      }
    }
  }
  return null;
};

const findTabBackwardNode = (elementID: string, recursive?: boolean) => {
  const target = document.getElementById(elementID);

  if (!target || target.tagName === 'svg') {
    return null;
  } else if (!recursive && target.previousElementSibling) {
    if (select(target.previousElementSibling).attr('tabindex') !== null) {
      return target.previousElementSibling;
    } else {
      return findTabBackwardNode(target.previousElementSibling.id, recursive);
    }
  } else if (recursive && findValidCousin(target, 'previous', true)) {
    return findValidCousin(target, 'previous', true);
  } else if (target.tagName === 'g') {
    return null;
  }
  return findValidParent(target, recursive);
};

export const hideNonessentialGroups = (rootNode: any, exception: any, recursive?: boolean) => {
  const childrenG = rootNode.childNodes.length > 1 ? rootNode.childNodes : rootNode.firstElementChild.childNodes;

  if (childrenG) {
    selectAll(childrenG).each((_, i, n) => {
      if (!(n[i] === exception)) {
        hideNode(n[i]);
      } else if (recursive && !useHTMLController) {
        select(n[i]).attr('role', groupRole);
      }
    });
  }
};

export const findTagLevel = (startLevel: any, depthFromStart?: number) => {
  if (startLevel === 'p' || startLevel === 'P' || !startLevel) {
    return 'p';
  } else if (startLevel === 'span' || startLevel === 'SPAN') {
    return 'span';
  } else if (startLevel === 'div' || startLevel === 'DIV') {
    return 'div';
  }
  const depth = depthFromStart || 0;
  const start = typeof startLevel !== 'string' || startLevel.length <= 1 ? startLevel : startLevel[1];
  if (+start + depth < 7 && depth < 3) {
    return 'h' + (+start + depth);
  }
  return 'p';
};

export const initializeDescriptionRoot = ({
  rootEle,
  geomType,
  title,
  chartTag,
  uniqueID,
  groupName,
  isSubgroup,
  highestHeadingLevel,
  redraw,
  recursive,
  disableKeyNav
}: {
  rootEle: any;
  geomType: string;
  title: string;
  chartTag: string;
  uniqueID: string;
  groupName?: string;
  isSubgroup?: boolean;
  highestHeadingLevel?: any;
  redraw?: boolean;
  recursive?: boolean;
  disableKeyNav?: boolean;
}) => {
  let level1 = findTagLevel(highestHeadingLevel, 0);
  level1 = level1 === 'h1' ? 'h2' : level1;
  const level2 = findTagLevel(level1, 1);
  const level3 = findTagLevel(level1, 2);
  const level4 = findTagLevel(level1, 3);
  let instructionsWrapper = select(rootEle).select('.vcl-accessibility-instructions');
  const group = groupName || geomType + ' group';
  if (!instructionsWrapper.size() || redraw) {
    if (!instructionsWrapper.size()) {
      instructionsWrapper = select(rootEle)
        .select('.o-layout')
        .insert('div', ':first-child')
        .attr('class', 'vcl-accessibility-instructions')
        .style('position', 'absolute')
        .style('width', '200px');
    } else {
      instructionsWrapper.selectAll('*').remove();
    }

    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-region-label')
      .on('focus', focusInstructions)
      .on('blur', blurInstructions)
      .attr('tabindex', 0);

    instructionsWrapper
      .append(level1)
      .attr('class', 'screen-reader-info vcl-access-title')
      .text(emptyDescriptions['vcl-access-title']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-subtitle')
      .text(emptyDescriptions['vcl-access-subtitle']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-executive-summary-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-executive-summary')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-executive-summary']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-purpose-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-purpose')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-purpose']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-long-description-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-long-description')
      .attr('data-level', level2)
      .text(emptyDescriptions['vcl-access-long-description']);
    instructionsWrapper
      .append(level4)
      .attr('data-level', level2)
      .attr('class', 'screen-reader-info vcl-access-context')
      .text(emptyDescriptions['vcl-access-context']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-structure-heading')
      .text('Structure');
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-statistics-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-statistics')
      .attr('data-level', level3)
      .text(emptyDescriptions['vcl-access-statistics']);
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-chart-layout-heading')
      .text('Chart Layout Description');
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-layout')
      .text(emptyDescriptions['vcl-access-layout']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-xAxis')
      .text(emptyDescriptions['vcl-access-xAxis']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-yAxis')
      .text(emptyDescriptions['vcl-access-yAxis']);
    instructionsWrapper
      .append(level3)
      .attr('class', 'screen-reader-info vcl-access-notes-heading')
      .text(emptyDescriptions['headings']);
    instructionsWrapper
      .append(level4)
      .attr('class', 'screen-reader-info vcl-access-notes')
      .attr('data-level', level3)
      .attr('data-annotationlevel', level2)
      .text(emptyDescriptions['vcl-access-notes']);
    instructionsWrapper
      .append(level2)
      .attr('class', 'screen-reader-info vcl-access-annotations-heading')
      .text(emptyDescriptions['headings']);
    if (!disableKeyNav) {
      instructionsWrapper
        .append(level2)
        .attr('class', 'screen-reader-info vcl-interaction-instructions')
        .text('Interaction Instructions');
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `Use Regions/Landmarks or TAB to skip ahead to the chart area or the data table. The following subsections explain how to use this chart's interactivity.`
        );
      if (userOS === 'Mac OS') {
        instructionsWrapper
          .append(level3)
          .attr('class', 'screen-reader-info')
          .text(`Note for Mac users`);
        instructionsWrapper
          .append(level4)
          .attr('class', 'screen-reader-info')
          .text(
            `If you are using Voice Over for Mac, you will need to press CONTROL plus SHIFT before using any arrow keys, ENTER, SPACEBAR, or ESCAPE, to ensure that Voice Over does not interfere with the chart's controls.`
          );
      }
      instructionsWrapper
        .append(level3)
        .attr('class', 'screen-reader-info')
        .text(`Enabling this chart's interactivity`);
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `Screen readers that are able to switch between Browse and Forms mode will need to turn on Forms mode once the chart area is reached.`
        );
      instructionsWrapper
        .append(level3)
        .attr('class', 'screen-reader-info')
        .text('Using the TAB key outside the Chart area and Exposing new Layers with the ENTER key');
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `Each chart has three main TAB areas at first: the information and instructions (which is this), the chart area, and the data table. You may TAB out of this section to the chart area at any time. Once on the chart area, you may focus the chart's first ${group} by pressing ENTER. Doing this will navigate you into the chart area, which enables you to use the ARROW keys focus new elements.`
        );
      instructionsWrapper
        .append(level3)
        .attr('class', 'screen-reader-info')
        .text('Using the ESCAPE key');
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `When in the chart area, pressing the ESCAPE key will always move your keyboard focus to the parent of the ${geomType} or ${group} you are currently on, until you reach the root of the chart.` //  Pressing SHIFT plus TAB will move your focus backwards, which will be the previous sibling to the ${geomType} or ${group} you are on or (if no previous sibling exists), then the parent of the ${geomType} or ${group} you are currently on.
        );
      // instructionsWrapper
      //   .append(level3)
      //   .attr('class', 'screen-reader-info')
      //   .text('Using TAB while inside the Chart area');
      // instructionsWrapper
      //   .append(level4)
      //   .attr('class', 'screen-reader-info')
      //   .text(
      //     `When in the chart area, pressing TAB will move your focus to the next available ${geomType} or ${group} at the same level, within the same group. If there is not another ${geomType} or ${group} at the same level within your group, focus will move up one level and to the next group. If there are no more groups available, you have reached the end of the chart area and your focus will move out of the chart area to the data table button for the chart.`
      //   );
      instructionsWrapper
        .append(level3)
        .attr('class', 'screen-reader-info')
        .text('Exploring Sibling Groups and Elements with LEFT and RIGHT');
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `When in the chart area, pressing RIGHT ARROW will move your focus to the next available ${geomType} or ${group} at the same level, within the same group. If there is not another ${geomType} or ${group} at the same level within your group, focus will move back to the first ${geomType} or ${group} among the siblings to your ${geomType} or ${group}. Pressing LEFT ARROW works in the same circular manner, but in reverse. This functionality is intended to allow easier comparison and navigation among siblings at the beginning and end of a group without leaving the group. This can be helpful when elements are sorted or ordered, because you can jump from the first to last elements easily.`
        );
      if (isSubgroup) {
        instructionsWrapper
          .append(level3)
          .attr('class', 'screen-reader-info')
          .text('Exploring Cousin Elements with UP and DOWN ARROW keys');
        instructionsWrapper
          .append(level4)
          .attr('class', 'screen-reader-info')
          .text(
            `When in the chart area on a ${geomType}, pressing UP or DOWN ARROW will move your focus to another ${geomType} at the same level, but in the previous or next ${group}. Navigation in this way is also circular, so pressing DOWN when on the last ${group} will navigate your focus to the corresponding cousin ${geomType} in the chart's first ${group} at that level. Navigating to cousin ${geomType}s in this way can improve the ease of comparison of similar elements across ${group}s, like using up and down arrows in a table.`
          );
      } else if (recursive) {
        instructionsWrapper
          .append(level3)
          .attr('class', 'screen-reader-info')
          .text('A note about navigating Hierarchical Charts');
        instructionsWrapper
          .append(level4)
          .attr('class', 'screen-reader-info')
          .text(
            `This chart contains a nested hierarchy, which means that there could be children contained inside any chart element that you navigate to and this nested structure could be multiple levels deep depending on the chart's data. Your current element will always explain if it contains children or not within it but these elements may be hidden until your current element is activated using SPACEBAR. If the children elements are not hidden, they can be navigated to using ENTER or DOWN ARROW keys and you can always exit your current level by using the ESCAPE or UP ARROW keys.`
          );
      }
      instructionsWrapper
        .append(level3)
        .attr('class', 'screen-reader-info')
        .text('Selecting Elements with SPACEBAR');
      instructionsWrapper
        .append(level4)
        .attr('class', 'screen-reader-info')
        .text(
          `If a ${geomType} is selectable and that selection causes something to happen, it will be marked up as a BUTTON and you may select it using SPACEBAR. Note that if you use SPACEBAR while on a ${group}, it will have no effect. Only using SPACEBAR on a ${geomType} may have effects.)`
        );
    }
  }
  instructionsWrapper.attr('id', 'chart-instructions-' + uniqueID);

  const chartTitle = title ? ', Titled: ' + title : ', with no title provided.';
  const full = `Keyboard interactive ${chartTag}${chartTitle}. The next TAB will focus the chart area. Pressing ENTER once on the chart will enter it and focus the chart's first ${group}. If there are multiple ${group}s, they can be navigated among using ARROW keys. You may access the group's child ${geomType}s by pressing ENTER again. You may then use the arrow keys to navigate among ${geomType}s and SPACEBAR to select them. Use ESCAPE to drill up one level of the chart or TAB to leave it entirely. If you are using a screen reader, this section contains additional information and instructions.`; //  Chart Unique ID: ${uniqueID}.
  const nonInteractive = `Static ${chartTag} image${chartTitle}. The next TAB will focus the data table button. If you are using a screen reader, this section contains additional information.`;
  instructionsWrapper.select('.vcl-region-label').text(!disableKeyNav ? full : nonInteractive);
};

export const setAccessTitle = (rootEle: any, title: string) => {
  select(rootEle)
    .select('.vcl-access-title')
    .text(title ? 'Chart title: ' + title : emptyDescriptions['vcl-access-title']);
};

export const setAccessSubtitle = (rootEle: any, subtitle: string) => {
  select(rootEle)
    .select('.vcl-access-subtitle')
    .text(subtitle ? 'Chart subtitle: ' + subtitle : emptyDescriptions['vcl-access-subtitle']);
};

const setDescriptionNode = (
  root: any,
  description: string,
  headingText: string,
  tag: string,
  contentExists: boolean,
  headingTag?: string
) => {
  const contentNode = root.select('.' + tag).text(description || emptyDescriptions[tag]);

  let headingNode = root.select('.' + (headingTag || tag) + '-heading');
  if (contentExists) {
    if (!headingNode.size()) {
      headingNode = root
        .insert(contentNode.node().dataset.level, '.' + (headingTag || tag))
        .attr('class', 'screen-reader-info ' + (headingTag || tag) + '-heading');
    }
    headingNode.text(headingText);
  } else {
    headingNode.remove();
  }
};

export const setAccessLongDescription = (rootEle: any, description: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    description,
    'Long Description',
    'vcl-access-long-description',
    description ||
      select(rootEle)
        .select('.vcl-access-context')
        .text()
  );
};

export const setAccessContext = (rootEle: any, context: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    context,
    'Long Description',
    'vcl-access-context',
    context ||
      select(rootEle)
        .select('.vcl-access-long-description')
        .text(),
    'vcl-access-long-description'
  );
};

export const setAccessExecutiveSummary = (rootEle: any, summary: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    summary,
    'Executive Summary',
    'vcl-access-executive-summary',
    !!summary
  );
};

export const setAccessPurpose = (rootEle: any, purpose: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    purpose,
    'Purpose',
    'vcl-access-purpose',
    !!purpose
  );
};

export const setAccessStatistics = (rootEle: any, statistics: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    statistics,
    'Statistical Information',
    'vcl-access-statistics',
    !!statistics
  );
};

export const setAccessChartCounts = ({
  rootEle,
  parentGNode,
  chartTag,
  geomType,
  groupName,
  recursive
}: {
  rootEle: any;
  parentGNode: any;
  chartTag: string;
  geomType: string;
  groupName?: string;
  recursive?: boolean;
}) => {
  const primaryG = select(parentGNode);
  const plural =
    primaryG
      .selectAll('g')
      .selectAll('*:not(title)')
      .size() > 1 ||
    (primaryG
      .selectAll('g')
      .selectAll('*:not(title)')
      .size() === 0 && primaryG.selectAll('*:not(title)').size()) > 1
      ? 's'
      : '';
  const groupNameString = groupName || geomType + ' group';
  const groupPlural = primaryG.selectAll('g').size() > 1 ? 's' : '';
  const count = !recursive
    ? primaryG.selectAll('g').size()
      ? primaryG.selectAll('g').size() +
        ' ' +
        groupNameString +
        groupPlural +
        ' containing a total ' +
        (primaryG
          .selectAll('g')
          .selectAll('*:not(title)')
          .size() -
          primaryG
            .selectAll('g')
            .selectAll('.vcl-accessibility-focus-highlight')
            .size()) +
        ' ' +
        geomType +
        plural
      : primaryG.selectAll('*:not(title)').size() -
        primaryG.selectAll('.vcl-accessibility-focus-highlight').size() +
        ' ' +
        geomType +
        plural
    : primaryG.selectAll('g').size() +
      ' ' +
      geomType +
      plural +
      ' (more ' +
      geomType +
      's may be revealed upon interaction)';

  select(rootEle)
    .select('.vcl-access-layout')
    .text(`This is a ${chartTag} with ${count}.`);
};

export const setAccessXAxis = ({
  rootEle,
  hasXAxis,
  xAxis,
  xAxisLabel
}: {
  rootEle: any;
  hasXAxis: boolean;
  xAxis?: any;
  xAxisLabel?: string;
}) => {
  let label = emptyDescriptions['vcl-access-xAxis'];
  if (hasXAxis) {
    const xDomain = xAxis && xAxis.formattedTicks && xAxis.formattedTicks[0] ? xAxis.formattedTicks : [];
    const xAxisTitle = xAxisLabel ? `, titled ${xAxisLabel}` : '';
    const xAxisRange = xDomain.length
      ? ` with a range that starts with ${xDomain[0]} and ends with ${xDomain[xDomain.length - 1]}`
      : '';
    label = `The chart has a horizontal X Axis${xAxisTitle}${xAxisRange}.`;
  }
  select(rootEle)
    .select('.vcl-access-xAxis')
    .text(label);
};

export const setAccessYAxis = ({
  rootEle,
  hasYAxis,
  yAxis,
  secondaryYAxis,
  yAxisLabel,
  secondaryYAxisLabel,
  xAxisLabel
}: {
  rootEle: any;
  hasYAxis: boolean;
  yAxis?: any;
  secondaryYAxis?: any;
  yAxisLabel?: string;
  secondaryYAxisLabel?: string;
  xAxisLabel?: string;
}) => {
  let label = emptyDescriptions['vcl-access-yAxis'];
  // y axis range from min to max

  // secondary y axis range from min to max e.g for pareto-chart.
  let yAxisTicks;
  if (yAxis && yAxis.formattedTicks) {
    yAxisTicks = yAxis.formattedTicks;
  }

  let secondaryYAxisTicks;
  if (secondaryYAxis && secondaryYAxis.formattedTicks) {
    secondaryYAxisTicks = secondaryYAxis.formattedTicks;
  }

  if (hasYAxis) {
    if (secondaryYAxisTicks) {
      // secondary y axis present
      const yAxis1Title = yAxisLabel ? `, titled ${yAxisLabel}` : '';
      const yAxis1Ticks = yAxisTicks
        ? ` with a range that starts with ${yAxisTicks[0]} and ends with ${yAxisTicks[yAxisTicks.length - 1]}`
        : '';
      const yAxis2Title = secondaryYAxisLabel ? `, titled ${secondaryYAxisLabel}` : '';
      const yAxis2Ticks = secondaryYAxisTicks
        ? ` with a range that starts with ${secondaryYAxisTicks[0]} and ends with ${
            secondaryYAxisTicks[secondaryYAxisTicks.length - 1]
          }`
        : '';
      label = `The chart has a primary vertical Y Axis${yAxis1Title}${yAxis1Ticks}. `;
      label += `The chart has a secondary vertical Y Axis${yAxis2Title}${yAxis2Ticks}.`;
    } else if (!(typeof yAxis === 'function')) {
      // y axis is an object that may contain multiple axes
      // parallel plot uses this
      const yLabels = Object.keys(yAxis);
      const firstYDomain =
        yAxis[yLabels[0]].y && yAxis[yLabels[0]].y.formattedTicks && yAxis[yLabels[0]].y.formattedTicks[0]
          ? yAxis[yLabels[0]].y.formattedTicks
          : [];
      const y1Range = firstYDomain.length
        ? `, with a range that starts with ${firstYDomain[0]} and ends with ${firstYDomain[firstYDomain.length - 1]}`
        : '';
      label =
        yLabels.length > 1
          ? `The chart has ${yLabels.length} vertical Y Axis sections, all using different scales${
              xAxisLabel ? '. This series is titled ' + xAxisLabel : ''
            }.`
          : `The chart has a vertical Y Axis, titled ${yLabels[0]}${y1Range}.`;
      if (yLabels.length > 1) {
        // the yAxis objected *does* contain multiple objects!
        let i = 0;
        for (i = 0; i < yLabels.length; i++) {
          const labelScale = yAxis[yLabels[i]].y;
          const iYDomain =
            labelScale && labelScale.formattedTicks && labelScale.formattedTicks[0] ? labelScale.formattedTicks : [];
          const iYRange = iYDomain.length
            ? `, with a range that starts with ${iYDomain[0]} and ends with ${iYDomain[iYDomain.length - 1]}`
            : '';
          label += ` Y Axis ${i + 1} of ${yLabels.length}, titled ${yLabels[i]}${iYRange}.`;
        }
      }
    } else {
      // only one axis present
      const yDomain = yAxis && yAxis.formattedTicks && yAxis.formattedTicks[0] ? yAxis.formattedTicks : [];
      const yAxisTitle = yAxisLabel ? `, titled ${yAxisLabel}` : '';
      const yAxisRange = yDomain.length
        ? ` with a range that starts with ${yDomain[0]} and ends with ${yDomain[yDomain.length - 1]}`
        : '';

      label = `The chart has a vertical Y axis${yAxisTitle}${yAxisRange}.`;
    }
  }
  select(rootEle)
    .select('.vcl-access-yAxis')
    .text(label);
};

export const setAccessStructure = (rootEle: any, structure: string) => {
  setDescriptionNode(
    select(rootEle).select('.vcl-accessibility-instructions'),
    structure,
    'Notes about the chart structure',
    'vcl-access-notes',
    !!structure
  );
};

export const setAccessAnnotation = (rootEle: any, annotations: any) => {
  const parent = select(rootEle).select('.vcl-accessibility-instructions');
  const notesNode = parent.select('.vcl-access-notes').node();
  let header = parent.select('.vcl-access-annotations-heading');

  const instructionsHeading = '.vcl-interaction-instructions';
  const headerLevel = notesNode.dataset.annotationlevel;
  const level1 = findTagLevel(headerLevel, 1);
  const level2 = findTagLevel(headerLevel, 2);

  parent.selectAll('.vcl-access-annotation').remove();

  let i = 1;
  if (annotations && annotations.length) {
    if (!header.size()) {
      header = parent
        .insert(headerLevel, instructionsHeading)
        .attr('class', 'screen-reader-info vcl-access-annotations-heading');
    }
    annotations.forEach(annotation => {
      let count = false;
      if (annotation.note) {
        if (annotation.note.title) {
          count = true;
          parent
            .insert(level1, instructionsHeading)
            .attr('class', 'screen-reader-info vcl-access-annotation')
            .text(annotation.note.title || 'Annotation ' + i);
        }
        if (annotation.note.label) {
          count = true;
          parent
            .insert(level2, instructionsHeading)
            .attr('class', 'screen-reader-info vcl-access-annotation')
            .text(annotation.note.label);
        }
      }
      if (annotation.accessibilityDescription) {
        count = true;
        parent
          .insert(level2, instructionsHeading)
          .attr('class', 'screen-reader-info vcl-access-annotation')
          .text(annotation.accessibilityDescription);
      }
      if (count) {
        i++;
      }
    });
  }
  if (i - 1) {
    const plural = i - 2 > 0 ? 's' : '';
    const headingText = i - 1 + ' annotation' + plural + ' on the chart';
    header.text(headingText);
  } else {
    header.remove();
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

export const checkAccessFocus = parentGNode =>
  !!select(parentGNode)
    .select('.vcl-accessibility-focus-source')
    .size();

export const retainAccessFocus = ({
  parentGNode,
  focusDidExist,
  recursive
}: {
  parentGNode: any;
  focusDidExist?: boolean;
  recursive?: boolean;
}) => {
  const primaryG = select(parentGNode);
  if (primaryG.select('.vcl-accessibility-focus-source').size()) {
    const target = primaryG.select('.vcl-accessibility-focus-source').node();
    const previouslyHidden = primaryG.select('.vcl-accessibility-focus-indicator').classed('hidden');
    drawKeyboardFocusClone(target, recursive);
    if (previouslyHidden) {
      hideKeyboardHighlight(target);
    }
  } else if (focusDidExist) {
    // if there is no focus source, we will put the user back at the start of the current group they are on
    let target;
    primaryG.selectAll('[tabindex]').each((_, i, n) => {
      if (!target && select(n[i]).attr('tabindex') !== null) {
        target = n[i];
      }
    });
    if (!target) {
      // if there is not a valid target in the group, we must find a valid target
      const root = findSVGRoot(parentGNode);
      // if there are no tabindex children
      target =
        select(root)
          .select('[tabindex]')
          .node() || root;
    }
    focusTarget(target);
    drawKeyboardFocusClone(target, recursive);
  }
};

// export const resolveRenderedOrderToData = ({
//   parent,
//   data
// }: {
//   parent: any;
//   data: any;
// }) => {
//   let index = 0

// }

const setActiveChild = (node: any) => {
  const rootSVG = findSVGRoot(node);
  if (!(rootSVG === document.body) && rootSVGRole === 'application') {
    if (useHTMLController) {
      const targetRoot = rootSVG.parentNode.firstElementChild;
      targetRoot.setAttribute('aria-activedescendant', controllerPrefix + node.id);
    } else {
      select(rootSVG)
        .select('#' + rootSVG.id + '-activeChild')
        .attr('id', null);
      node.id = rootSVG.id + '-activeChild';
      rootSVG.setAttribute('aria-activedescendant', node.id);
    }
  }
};

const removeActiveChild = (node, isTheRoot?) => {
  const rootSVG = !isTheRoot ? findSVGRoot(node) : node;
  if (!(rootSVG === document.body) && rootSVGRole === 'application') {
    if (useHTMLController) {
      const targetRoot = !isTheRoot ? rootSVG.parentNode.firstElementChild : node;
      targetRoot.setAttribute('aria-activedescendant', null);
    } else {
      select(rootSVG)
        .select('#' + rootSVG.id + '-activeChild')
        .attr('id', null);
      rootSVG.setAttribute('aria-activedescendant', null);
    }
  }
};

const focusInstructions = (_, i, n) => {
  select(n[i])
    .style('width', 'auto')
    .style('height', 'auto')
    .style('left', 'auto')
    .style('top', '15px')
    .style('background', 'white')
    .style('z-index', 9999);
};

const blurInstructions = (_, i, n) => {
  select(n[i])
    .style('width', null)
    .style('height', null)
    .style('left', null)
    .style('top', null)
    .style('background', null)
    .style('z-index', null);
};

const focusTarget = target => {
  // set the target focus state
  if (isIE11) {
    // https://mkyong.com/javascript/focus-is-not-working-in-ie-solution/
    // IE has lazy focusing, so it must be wrapped in a timeout
    setTimeout(function() {
      target.focus();
      // target.dispatchEvent(new Event('focus')); // .focus() is not working in jsdom dispatch for testing instead
    }, 10);
    // HTMLElement.prototype.focus.apply(target);
  } /* else if (isIEEdge) {
    FocusableForeignObject(target);
  }*/ else {
    target.focus();
    // target.dispatchEvent(new Event('focus')); // .focus() is not working in jsdom dispatch for testing instead
  }
};

const controllerBlurToMouseout = target => {
  if (!target) {
    return;
  }
  // remove the target focus state
  removeActiveChild(target);
  blurAsMouseout(target);
  removeKeyboardHighlight(target);
};

const checkTabbableSiblings = node => {
  let count = 0;
  select(node)
    .selectAll('*')
    .each(() => {
      if (node.getAttribute('tabindex') === '0') {
        count++;
      }
    });
  return !!count;
};

const setChildTabIndices = (node: any, recursive?: boolean) => {
  if (!recursive) {
    Array.prototype.forEach.call(node.childNodes, node => {
      if (node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', -1);
      }
    });
  } else {
    const siblings = findValidRecursiveSiblings(node.firstElementChild);
    siblings.forEach(node => {
      if (node.hasAttribute('tabindex')) {
        node.setAttribute('tabindex', -1);
      }
    });
    // need to add crazy selection logic here... ??
  }
};

const findValidSibling = (currentTarget: any, direction: string) => {
  const sibling = direction + 'Sibling';
  const loopSibling = (direction === 'next' ? 'first' : 'last') + 'ElementChild';
  const loopSiblingElement = () =>
    direction === 'next' ? currentTarget.parentNode.firstElementChild : findValidFinalSibling(currentTarget);
  const siblingElement =
    currentTarget[sibling] && select(currentTarget[sibling]).attr('tabindex') !== null ? currentTarget[sibling] : null;
  const target = !siblingElement ? loopSiblingElement() : currentTarget[sibling];
  return target || target.parentNode[loopSibling];
};

const findValidFinalSibling = node => {
  if (select(node.parentNode.lastElementChild).attr('tabindex') !== null) {
    return node.parentNode.lastElementChild;
  }
  let target = null;
  let index = node.parentNode.childNodes.length - 2;
  while (!target && index >= 0) {
    const currentChild = node.parentNode.childNodes[index];
    if (select(currentChild).attr('tabindex') !== null) {
      target = currentChild;
    }
    index--;
  }
  return target;
};

const findValidParent = (currentTarget: any, recursive?: boolean) => {
  if (!recursive) {
    return currentTarget.parentNode;
  }
  if (
    currentTarget.parentNode &&
    currentTarget.parentNode.parentNode &&
    currentTarget.parentNode.parentNode.firstElementChild
  ) {
    return (
      findValidChildTarget(currentTarget.parentNode.parentNode.firstElementChild, true) || findSVGRoot(currentTarget)
    );
  }
  return findSVGRoot(currentTarget);
};

const findSVGRoot = node => {
  if (node.ownerSVGElement) {
    return node.ownerSVGElement;
  }
  if (node.parentNode.nodeName === 'svg' || node.parentNode === document.body) {
    return node.parentNode;
  } else {
    return findSVGRoot(node.parentNode);
  }
};

const enterChartArea = (_event: any, recursive?: boolean) => {
  const currentTarget: any = _event.target;
  const keyCode = _event.keyCode || _event.which;
  if (keyCode === keyCodes.child || keyCode === keyCodes.select) {
    // we will allow ENTER or SPACEBAR to enter the chart area
    _event.preventDefault();
    if (useHTMLController) {
      return select(currentTarget.parentNode)
        .select('svg')
        .select('[tabindex]')
        .node();
    } else {
      // this will select the first element in the semantic order with a tabindex attribute :)
      const target = select(currentTarget)
        .select('[tabindex]')
        .node();

      if (target) {
        // this will set the target and all siblings of the target to have a tabindex === 0
        setChildTabIndices(target.parentNode, recursive);
        focusTarget(target);
        return;
      }
    }
  }
};

const keyUpHandler = code => {
  fired = false;
  if (code === keyCodes.shift) {
    shiftFired = false;
  }
};

const findFirstValidChild = (currentTarget: any, recursive?: boolean) => {
  // recursive by default until it finds something with a tab index?
  const target = !recursive ? currentTarget : findValidSiblingTarget(currentTarget);
  return target && target.firstElementChild ? findValidChildTarget(target.firstElementChild, true) : null;
};

const findValidRecursiveSiblings = node => {
  const parentOfParent = node.parentNode.parentNode;
  const parents = parentOfParent.childNodes;
  const siblings = [];
  Array.prototype.forEach.call(parents, parent => {
    if (parent.tagName === 'g' && !parent.classList.contains('.vcl-accessibility-focus-highlight')) {
      siblings.push(parent.firstElementChild);
    }
  });
  return siblings;
};

const findValidCousin = (currentTarget: any, direction: string, returnEarly?: boolean) => {
  let parentSiblingChildren;
  let target;
  const currentParentIdx = getElementIndex(currentTarget.parentNode);
  let currentIdx = getElementIndex(currentTarget);
  const _parent = currentTarget.parentNode.parentNode;
  const parentsSiblings = [];
  // const parentsSiblings = _parent.querySelectorAll('g:not(.vcl-accessibility-focus-highlight)')
  Array.prototype.forEach.call(_parent.childNodes, child => {
    if (child.tagName === 'g' && !child.classList.contains('vcl-accessibility-focus-highlight')) {
      parentsSiblings.push(child);
    }
  });
  const childrenCount = parentsSiblings.length;
  if (!childrenCount) {
    return null;
  }
  if (direction === 'previous') {
    // up
    if (returnEarly && currentParentIdx === 0) {
      return null;
    }
    parentSiblingChildren =
      currentParentIdx !== 0
        ? parentsSiblings[currentParentIdx - 1].childNodes
        : parentsSiblings[childrenCount - 1].childNodes;
  } else if (direction === 'next') {
    // down
    if (returnEarly && currentParentIdx === childrenCount - 1) {
      return null;
    }
    parentSiblingChildren =
      currentParentIdx !== childrenCount - 1
        ? parentsSiblings[currentParentIdx + 1].childNodes
        : parentsSiblings[0].childNodes;
  }

  // set target
  target = parentSiblingChildren[currentIdx];
  // ensure that target is actually something, will check backwards across groups if group sizes don't match
  while (!target && currentIdx > -1) {
    target = parentSiblingChildren[currentIdx];
    currentIdx--;
  }
  return !(currentTarget === target) ? target : null;
};

const findValidSameGroupCousin = (currentTarget: any, direction: string, sameGroupCousinKey: string) => {
  const currentData = select(currentTarget).data()[0];
  const targetGroup = currentData[sameGroupCousinKey];
  let target;
  const cousins = [];
  let targetIndex = -1;
  let found = 0;
  select(currentTarget.parentNode)
    .selectAll('*')
    .each((d, i, n) => {
      if (d && d[sameGroupCousinKey] === targetGroup) {
        cousins.push(n[i]);
        found++;
      }
      if (targetIndex < 0 && currentTarget === n[i]) {
        // same reference means we know our index
        targetIndex = found - 1;
      }
    });
  if (found && targetIndex > -1) {
    // we have results and a starting point
    if (direction === 'previous') {
      // return either the previous or last cousin
      target = cousins[targetIndex - 1] || cousins[cousins.length - 1];
    } else if (direction === 'next') {
      // return either the next or first cousin
      target = cousins[targetIndex + 1] || cousins[0];
    }
  }
  return target;
};

const getElementIndex = el => {
  let i = 0;
  const originalNodeName = el.nodeName;
  while (el.previousSibling) {
    if (
      originalNodeName === el.previousSibling.nodeName &&
      !select(el.previousSibling).classed('vcl-accessibility-focus-hover')
    ) {
      i++;
    }
    el = el.previousSibling;
  }
  return i;
};

const keyDownHandler = (_event: any, isGroup: boolean, recursive?: boolean, sameGroupCousinKey?: string) => {
  let target: any;
  const currentTarget: any = _event.target;
  const keyCode = _event.keyCode || _event.which;
  const direction =
    keyCode === keyCodes.nextSibling || keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate
      ? 'next'
      : keyCode === keyCodes.previousSibling ||
        keyCode === keyCodes.previousCousin ||
        keyCode === keyCodes.previousCousinAlternate
      ? 'previous'
      : keyCode === keyCodes.parent
      ? 'up'
      : keyCode === keyCodes.child
      ? 'down'
      : '';
  if (direction || keyCode === keyCodes.select) {
    _event.preventDefault();
  }
  if (keyCode === keyCodes.shift && !shiftFired) {
    shiftFired = true;
  }
  if (!fired) {
    fired = true;
    if (keyCode === keyCodes.select && !isGroup) {
      // a selection has happened
      const evt = new MouseEvent('click', { bubbles: false, cancelable: true });
      currentTarget.dispatchEvent(evt);
    } else if ((keyCode === keyCodes.nextSibling || keyCode === keyCodes.previousSibling) && !recursive) {
      // we are moving among siblings
      target = findValidSibling(currentTarget, direction);
    } else if (
      (!recursive &&
        (keyCode === keyCodes.nextCousin ||
          keyCode === keyCodes.nextCousinAlternate ||
          keyCode === keyCodes.previousCousin ||
          keyCode === keyCodes.previousCousinAlternate)) ||
      ((keyCode === keyCodes.nextSibling || keyCode === keyCodes.previousSibling) && recursive)
    ) {
      // we are moving among cousins (which are siblings if the chart is recursive)
      if (sameGroupCousinKey && !isGroup) {
        // the cousin is in the same tree and must be found among siblings
        target = findValidSameGroupCousin(currentTarget, direction, sameGroupCousinKey);
      } else if (!isGroup) {
        // the dom is structured in a hierarchy, so we navigate accordingly
        target = findValidCousin(currentTarget, direction);
      }
    } else if (
      direction === 'down' ||
      (recursive && (keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate))
    ) {
      // we are moving down
      if (isGroup || recursive) {
        target = findFirstValidChild(currentTarget, recursive);
        if (target) {
          setChildTabIndices(target.parentNode, recursive);
        }
      }
    } else if (
      direction === 'up' ||
      (recursive && (keyCode === keyCodes.previousCousin || keyCode === keyCodes.previousCousinAlternate))
    ) {
      // we are moving up
      if (isGroup) {
        target = findSVGRoot(currentTarget);
      } else {
        target = findValidParent(currentTarget, recursive);
      }
    }
  }
  if (target) {
    focusTarget(target);
  }
};

const getInteractionResult = (
  nodeID: string,
  _event: any,
  isGroup: boolean,
  recursive?: boolean,
  sameGroupCousinKey?: string
) => {
  let target: any;
  let result = {
    clicked: false,
    focused: false,
    id: ''
  };
  const currentTarget: any = document.getElementById(nodeID);
  const keyCode = _event.keyCode || _event.which;
  const direction =
    keyCode === keyCodes.nextSibling || keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate
      ? 'next'
      : keyCode === keyCodes.previousSibling ||
        keyCode === keyCodes.previousCousin ||
        keyCode === keyCodes.previousCousinAlternate
      ? 'previous'
      : keyCode === keyCodes.parent
      ? 'up'
      : keyCode === keyCodes.child
      ? 'down'
      : '';
  if (direction || keyCode === keyCodes.select) {
    _event.preventDefault();
  }
  if (keyCode === keyCodes.shift && !shiftFired) {
    shiftFired = true;
  }
  if (!fired) {
    fired = true;
    if (keyCode === keyCodes.select) {
      // a selection has happened
      result.clicked = true;
      result.id = nodeID;
    } else if ((keyCode === keyCodes.nextSibling || keyCode === keyCodes.previousSibling) && !recursive) {
      // we are moving among siblings
      target = findValidSibling(currentTarget, direction);
    } else if (
      (!recursive &&
        (keyCode === keyCodes.nextCousin ||
          keyCode === keyCodes.nextCousinAlternate ||
          keyCode === keyCodes.previousCousin ||
          keyCode === keyCodes.previousCousinAlternate)) ||
      ((keyCode === keyCodes.nextSibling || keyCode === keyCodes.previousSibling) && recursive)
    ) {
      // we are moving among cousins (which are siblings if the chart is recursive)
      if (sameGroupCousinKey && !isGroup) {
        // the cousin is in the same tree and must be found among siblings
        target = findValidSameGroupCousin(currentTarget, direction, sameGroupCousinKey);
      } else if (!isGroup) {
        // the dom is structured in a hierarchy, so we navigate accordingly
        target = findValidCousin(currentTarget, direction);
      }
    } else if (
      direction === 'down' ||
      (recursive && (keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate))
    ) {
      // we are moving down
      if (isGroup || recursive) {
        target = findFirstValidChild(currentTarget, recursive);
      }
    } else if (
      direction === 'up' ||
      (recursive && (keyCode === keyCodes.previousCousin || keyCode === keyCodes.previousCousinAlternate))
    ) {
      // we are moving up
      if (isGroup) {
        target = findSVGRoot(currentTarget);
      } else {
        target = findValidParent(currentTarget, recursive);
      }
    }
  }

  if (target && select(target).attr('tabindex')) {
    result.focused = true;
    result.id = target.id;
  }
  return result;
};

const removeKeyboardHighlight = (parent: any, rootOnly?: boolean) => {
  const className = !rootOnly ? 'vcl-accessibility-focus' : 'vcl-accessibility-focus-root';
  select(parent.ownerSVGElement)
    .selectAll('.' + className + '-source')
    .classed(className + '-source', false);

  select(parent.ownerSVGElement)
    .selectAll('.' + className + '-indicator')
    .remove();
};

const hideKeyboardHighlight = (parent: any) => {
  select(parent.ownerSVGElement)
    .selectAll('.vcl-accessibility-focus-indicator')
    .classed('hidden', true)
    .style('opacity', 0)
    .attr('opacity', 0);
};

const drawKeyboardFocusClone = (inputElement: any, recursive?: boolean) => {
  let source =
    inputElement.tagName !== 'DIV'
      ? inputElement
      : select(inputElement.parentNode)
          .select('svg')
          .node();
  let shouldDeleteSource = false;
  const className = !(source.tagName === 'svg' && useHTMLController)
    ? 'vcl-accessibility-focus'
    : 'vcl-accessibility-focus-root';
  const isNotAGeometry = source.tagName === 'g' || source.tagName === 'svg';
  if (isNotAGeometry) {
    const bbox = source.getBBox();
    const width = source.tagName === 'svg' ? Math.max(+source.getAttribute('width') - 10, 0) : +bbox.width + 10;
    const height = source.tagName === 'svg' ? Math.max(+source.getAttribute('height') - 10, 0) : +bbox.height + 10;
    const x = source.tagName === 'svg' ? 5 : +bbox.x - 5;
    const y = source.tagName === 'svg' ? 5 : +bbox.y - 5;
    const newSource = select(!(source.tagName === 'svg') ? source.parentNode : source)
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', width)
      .attr('height', height)
      .attr('transform', select(source).attr('transform') || null)
      .attr('fill', 'none')
      .style('fill', 'none');

    source = newSource.node();
    shouldDeleteSource = true;
  } else {
    const shouldHideOutline = select(source)
      .style('outline')
      .includes('auto');
    if (shouldHideOutline) {
      select(source)
        .style('outline-width', '0px')
        .style('outline-offset', '0px')
        .style('outline-color', 'none');
    }
  }

  const parent = source.parentNode;
  removeKeyboardHighlight(parent.tagName !== 'svg' ? parent : parent.firstElementChild);

  select(source).classed(className + '-source', true);
  const hasWidth = select(source).attr('width');

  const highlightCopy = source.cloneNode(false);
  const haloCopy = source.cloneNode(false);
  const copy = source.cloneNode(false);

  if ((!recursive && !shouldDeleteSource) || (recursive && isNotAGeometry)) {
    const elevateParentLevel = !isNotAGeometry && !(select(source.parentNode).attr('tabindex') === null);
    const targetAppendLocation = !elevateParentLevel ? parent : parent.parentNode;
    const parentCopy = parent.cloneNode(false);

    parentCopy.appendChild(haloCopy);
    parentCopy.appendChild(highlightCopy);
    parentCopy.appendChild(copy);

    targetAppendLocation.appendChild(parentCopy);
    applyDefaults(select(parentCopy), className);
    select(parentCopy).attr('filter', null);
  } else {
    if (recursive) {
      // NOTE: below chunk assumes recursive === a circle SVG primitive
      // this is true for now, with circle-packing as the only current recursive chart
      // future hierarchical charts will need special treatment
      const baseRadius = +select(copy).attr('r');
      parent.parentNode.appendChild(haloCopy);
      select(haloCopy)
        .attr('r', baseRadius + 6)
        .attr('stroke-width', 0);
      parent.parentNode.appendChild(highlightCopy);
      select(highlightCopy)
        .attr('r', baseRadius + 3)
        .attr('stroke-width', 0);

      // NOTE ALSO: recursive elements do not need to copy+append themselves,
      // they only need to append their halo + highlight elements
    } else {
      if (source.nextSibling) {
        parent.insertBefore(copy, source.nextSibling);
        parent.insertBefore(highlightCopy, source.nextSibling);
        parent.insertBefore(haloCopy, source.nextSibling);
      } else {
        parent.appendChild(haloCopy);
        parent.appendChild(highlightCopy);
        parent.appendChild(copy);
      }
    }
  }
  const copyStyle = select(copy)
    .style('opacity', !isNotAGeometry ? 1 : 0)
    .attr('opacity', !isNotAGeometry ? 1 : 0)
    .style('stroke-opacity', !isNotAGeometry ? 1 : 0)
    .attr('stroke-opacity', !isNotAGeometry ? 1 : 0);

  if ((!recursive && !isNotAGeometry && hasWidth) || isNotAGeometry) {
    copyStyle.style('fill-opacity', 0).attr('fill-opacity', 0);
  }

  applyDefaults(copyStyle, className);

  const highlightStyle = select(highlightCopy);
  applyDefaults(highlightStyle, className);
  applyOutlineOverride(highlightStyle, !isNotAGeometry && !recursive && !hasWidth ? 10 : 6, '#ffffff');
  if (!recursive && !isNotAGeometry && hasWidth) {
    applySizeOverride(highlightStyle, 3);
  }
  highlightStyle.style('opacity', 1).attr('opacity', 1);

  const haloStyle = select(haloCopy);
  applyDefaults(haloStyle, className);
  applyOutlineOverride(
    haloStyle,
    !isNotAGeometry && !recursive && !hasWidth ? 14 : !isNotAGeometry ? 2 : 10,
    '#000000'
  );
  if (!recursive && !isNotAGeometry && hasWidth) {
    applySizeOverride(haloStyle, 7);
  }
  haloStyle.style('opacity', 1).attr('opacity', 1);

  if (shouldDeleteSource) {
    select(source).remove();
  }
};

const applyDefaults = (selection, className) => {
  if (selection.attr('d') && selection.attr('filter') && !selection.attr('marker-start')) {
    selection.attr('filter', null);
  }
  selection
    .attr('id', null)
    .attr('class', className + '-highlight ' + className + '-indicator')
    .attr('focusable', false)
    .attr('aria-label', null)
    .attr('aria-hidden', true)
    .attr('role', null)
    .style('pointer-events', 'none')
    .attr('tabindex', null)
    .attr('mix-blend-mode', null)
    .style('mix-blend-mode', null)
    .attr('r', (_, i, n) => {
      const r = parseFloat(select(n[i]).attr('r'));
      return r || 1;
    });
};

const applySizeOverride = (selection, offset) => {
  selection
    .attr('width', (_, i, n) => {
      const width = parseFloat(select(n[i]).attr('width'));
      return width + offset * 2;
    })
    .attr('height', (_, i, n) => {
      const height = parseFloat(select(n[i]).attr('height'));
      return height + offset * 2;
    })
    .attr('x', (_, i, n) => {
      const x = parseFloat(select(n[i]).attr('x'));
      return x - offset;
    })
    .attr('y', (_, i, n) => {
      const y = parseFloat(select(n[i]).attr('y'));
      return y - offset;
    });
};

const applyOutlineOverride = (selection, extraStrokeWidth, strokeColor) => {
  selection
    .style('stroke-dasharray', '')
    .attr('stroke-dasharray', null)
    .style('outline-offset', '0px')
    .style('outline-color', 'none')
    .style('outline-width', '0px')
    .attr('filter', null)
    .style('stroke-linecap', 'round')
    .style('fill', 'none')
    .style('stroke-opacity', 1)
    .style('stroke', strokeColor)
    .style('stroke-width', (_, i, n) => {
      const width = select(n[i]).style('stroke') !== 'none' ? parseFloat(select(n[i]).style('stroke-width')) || 0 : 0;
      const scaleIndex = select(n[i]).attr('transform')
        ? select(n[i])
            .attr('transform')
            .indexOf('scale')
        : -1;
      let scale = 1;
      if (scaleIndex > -1) {
        const scaleSubstring = select(n[i])
          .attr('transform')
          .substring(scaleIndex + 6);
        const endSubstring =
          scaleSubstring.indexOf(',') < scaleSubstring.indexOf(')') && scaleSubstring.indexOf(',') !== -1
            ? scaleSubstring.indexOf(',')
            : scaleSubstring.indexOf(')');
        scale = +scaleSubstring.substring(0, endSubstring);
      }
      let bonus = 0;
      const me = select(n[i]);
      if (me.attr('marker-start') && me.attr('data-centerX1') && me.attr('d')) {
        const x1 = me.attr('data-centerX1');
        const y1 = me.attr('data-centerY1');
        const x2 = me.attr('data-centerX2');
        const y2 = me.attr('data-centerY2');
        me.attr('d', `M ${x1} ${y1} L ${x2} ${y2}`);
        bonus = +me.attr('data-barSize') + 6;
      }
      me.attr('marker-start', null);
      me.attr('marker-end', null);
      return (width + extraStrokeWidth + bonus) / scale + 'px';
    });
};

const findValidSiblingTarget = element => {
  return !element.nextElementSibling
    ? null
    : element.nextElementSibling.nodeName === 'g'
    ? element.nextElementSibling
    : findValidSiblingTarget(element.nextElementSibling);
};

const findValidChildTarget = (element, requireTabIndex) => {
  if (
    (!requireTabIndex || (requireTabIndex && select(element).attr('tabindex') !== null)) &&
    !select(element).classed('vcl-accessibility-focus-highlight')
  ) {
    return element;
  }
  if (element.nextElementSibling) {
    return findValidChildTarget(element.nextElementSibling, requireTabIndex);
  } else {
    return null;
  }
};

const getOffset = (el: any) => {
  const bounds = el.getBoundingClientRect(); // bounds.top
  const left = bounds.left + document.body.scrollLeft + document.documentElement.scrollLeft;
  const top = bounds.top + document.body.scrollTop + document.documentElement.scrollTop;
  return {
    top,
    left
  };
};

const blurAsMouseout = (node: any) => {
  removeKeyboardHighlight(node.parentNode);
  const evt = new MouseEvent('mouseout', { bubbles: false, cancelable: true });
  node.dispatchEvent(evt);
};

const focusAsMouseover = (node, recursive: boolean, drawClone: boolean) => {
  const leftPos = getOffset(node).left;
  const topPos = getOffset(node).top;
  const evt = new MouseEvent('mouseover', { bubbles: false, cancelable: true, clientX: leftPos, clientY: topPos });
  if (drawClone) {
    drawKeyboardFocusClone(node, recursive);
  }
  node.dispatchEvent(evt);
};

const iterateKeys = (item: any, objectOfDataKeys: any, includeKeyNames: boolean, nested?: boolean) => {
  const dataKeys = Object.keys(objectOfDataKeys);
  let label = '';
  const datum = !item.data
    ? getScopedData([item], objectOfDataKeys)[0]
    : getScopedData([item.data], objectOfDataKeys)[0];
  let keyPosition = 1;
  dataKeys.forEach(key => {
    if (datum[key] !== undefined) {
      const keyEnding = datum[key][datum[key].length - 1] === '.' ? ' ' : '. ';
      if (!(nested && !includeKeyNames)) {
        label += includeKeyNames ? key + ' ' : '';
        label += datum[key] + keyEnding;
      } else {
        label += datum[key] + (keyPosition % 2 ? ' ' : keyEnding);
      }
      if (datum[key + '%'] !== undefined) {
        const percentKeyEnding = datum[key + '%'][datum[key + '%'].length - 1] === '.' ? ' ' : '. ';
        label += includeKeyNames ? key + ' as a percentage ' : '';
        label += datum[key + '%'] + percentKeyEnding;
      }
      keyPosition++;
    }
  });
  return label;
};

const createLabel = ({
  d,
  i,
  n,
  capitalizedGeomType,
  capitalizedGroupName,
  includeKeyNames,
  dataKeys,
  groupKeys,
  nested,
  recursive
}: {
  d: any;
  i: number;
  n: any;
  capitalizedGeomType: string;
  capitalizedGroupName: string;
  includeKeyNames: boolean;
  dataKeys: any;
  groupKeys?: any;
  nested?: string;
  recursive?: boolean;
}) => {
  const datum = !recursive ? d : d.data.data;
  let label = '';
  if (nested) {
    if (datum[nested].length) {
      datum[nested].forEach(child => {
        label += iterateKeys(child, dataKeys, includeKeyNames, true);
      });
    }
    if (groupKeys && groupKeys.length) {
      groupKeys.forEach(groupKey => {
        label += !groupKey ? '' : datum[groupKey] + '. ';
      });
    }
  } else {
    label += iterateKeys(datum, dataKeys, includeKeyNames);
  }
  label += capitalizedGeomType + ' ' + (i + 1) + ' of ' + n.length + '.';
  if (recursive) {
    const depth = d.depth;
    const size = select(n[i].parentNode)
      .selectAll('g:not(.vcl-accessibility-focus-highlight)')
      .filter(data => (depth === undefined ? true : data && data.depth === depth + 1))
      .size();
    label +=
      (' This ' + capitalizedGroupName || capitalizedGeomType + ' group') +
      ' contains ' +
      (size || '0') +
      ' child elements' +
      (!size && d.children && d.children.length ? ' (but some may be hidden until you interact with this node)' : '');
  }
  return label;
};
