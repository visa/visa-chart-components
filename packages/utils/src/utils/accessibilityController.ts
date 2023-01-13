/**
 * Copyright (c) 2020, 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select, event } from 'd3-selection';
import { getBrowser } from './browser-util';
import { polyfillMouseEvents } from './customPolyfills';
import { setHighContrastListener } from './accessibilityUtils';
import { createLabel, createGroupLabel } from './altTextGenerator';

export const keyCodes = {
  hideTooltip: 27, // ESCAPE
  parent: 13, // ENTER (only triggered when shiftKey is true)
  child: 13, // ENTER
  select: 32, // SPACEBAR
  nextSibling: 39, // RIGHT ARROW
  previousSibling: 37, // LEFT ARROW
  nextCousin: 40, // DOWN ARROW
  previousCousin: 38, // UP ARROW
  nextCousinAlternate: 190, // PERIOD
  previousCousinAlternate: 188, // COMMA
  shift: 16, // SHIFT
  tab: 9, // TAB
  escape: 27 // ESCAPE
};
const browser = getBrowser();
const isIE11 = browser === 'IE'; // ua.includes('rv:11.0');
const isIEEdge = browser === 'Edge'; // ua.includes('Edge');
const rootSVGRole = 'application'; // !isIE11 ? 'region' : 'application';
const staticGeometryRole = 'img'; // 'menuitem'; // !(isIE11 || isIEEdge) ? 'img' : 'treeitem';
const interactiveGeometryRole = 'button'; // 'menuitem'; // !(isIE11 || isIEEdge) ? 'button' : 'treeitem';
const controllerPrefix = 'node-';
let fired = false;
if (isIE11) {
  polyfillMouseEvents(window);
}

// This function initializes and maintains the root-level controller node and is designed
// to hook into the VCC lifecycle (so that it stays up to date as a chart changes).
export const setAccessibilityController = ({
  node,
  chartTag,
  title,
  description,
  uniqueID,
  geomType,
  includeKeyNames,
  dataKeys,
  dataKeyNames,
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
  dataKeyNames?: object;
  groupKeys?: any;
  nested?: string;
  groupName?: string;
  groupAccessor?: string;
  recursive?: boolean;
  disableKeyNav?: boolean;
}) => {
  const svg = select(node);
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
    const descText = `${subtitle} Navigate into the chart area by pressing ENTER.`;
    return titleText + descText;
  };
  if (!controller.size()) {
    select(parent).style('position', 'relative');
    controller = select(parent).insert('div', ':first-child');

    controller
      .attr('class', 'VCL-controller')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('opacity', 0)
      .style('pointer-events', 'none');
  }

  const bounds = node.getBoundingClientRect();
  controller
    .style('width', `${bounds.width}px`)
    .style('height', `${bounds.height}px`)
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
            fired = false;
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
            const bounds = node.getBoundingClientRect();
            controller
              .style('width', `${bounds.width}px`)
              .style('height', `${bounds.height}px`)
              .attr('aria-label', getRootAriaLabel());
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
            controller.attr('aria-label', `Interactive ${chartTag}.`);
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
              const targetChild = enterChartArea(e);
              if (targetChild) {
                prepareControllerNodes({
                  rootNode: controller.node(),
                  nodeID: targetChild.id,
                  geomType,
                  includeKeyNames,
                  dataKeys,
                  dataKeyNames,
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

  setHighContrastListener(node, uniqueID); // 'chart-area-' + chartTag +
};

export const setElementFocusHandler = ({
  node,
  geomType,
  includeKeyNames,
  dataKeys,
  dataKeyNames,
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
  dataKeyNames?: object;
  groupKeys?: any;
  nested?: string;
  recursive?: boolean;
  groupName?: string;
  uniqueID?: string;
  disableKeyNav?: boolean;
}) => {
  select(node).on(
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
              dataKeyNames,
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
};

export const setElementInteractionAccessState = (node: any, selected: boolean, selectable: boolean) => {
  const targetID = '#' + controllerPrefix + select(node).attr('id');
  select(node)
    .attr('data-aria-pressed', selectable ? selected : null)
    .attr('data-role', selectable ? interactiveGeometryRole : staticGeometryRole);
  select(targetID)
    .attr('aria-pressed', selectable ? selected : null)
    .attr('role', selectable ? interactiveGeometryRole : staticGeometryRole);
};

export const setElementAccessID = ({ node, uniqueID }: { node: any; uniqueID?: string }) => {
  select(node).attr('id', () => {
    if (!node.id) {
      return generateRandomStringID(uniqueID);
    }
    return node.id;
  });
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

const prepareControllerNodes = ({
  rootNode,
  nodeID,
  geomType,
  includeKeyNames,
  dataKeys,
  dataKeyNames,
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
  dataKeyNames?: object;
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
        dataKeyNames,
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
        dataKeyNames,
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
      const sourceNode = document.getElementById(nodeID);

      // now we get bounds for height/width/top/left after populating content
      const bounds = sourceNode.getBoundingClientRect();
      const parentBounds = rootNode.getBoundingClientRect();

      select(controllerNodeAlreadyExists)
        .on('focus', () => {})
        .style('position', 'absolute')
        .style('padding', 0)
        .style('margin', 0)
        .style('overflow', 'visible')
        .style('left', `${bounds.left - parentBounds.left}px`)
        .style('top', `${bounds.top - parentBounds.top}px`)
        .style('width', `${bounds.width}px`)
        .style('height', `${bounds.height}px`);
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
        dataKeyNames,
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
  dataKeyNames,
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
  dataKeyNames?: object;
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
  const isOffsetGroup = select(sourceNode).attr('data-offset-group');
  const isGroup = sourceNode.nodeName === 'g' || isOffsetGroup;
  let nodeType = 'div';
  let nodeRole = 'img';
  let nodeCanBePressed = null;
  if (!isGroup) {
    nodeRole = select(sourceNode).attr('data-role');
    nodeCanBePressed = select(sourceNode).attr('data-aria-pressed');
    nodeType = nodeCanBePressed ? 'button' : 'div';
  }

  // now we get bounds for height/width/top/left after populating content
  const bounds = sourceNode.getBoundingClientRect();
  const parentBounds = rootNode.getBoundingClientRect();
  select(rootNode)
    .append(!isIEEdge ? 'figure' : 'div')
    .attr('role', 'figure')
    .append(nodeType)
    .style('position', 'absolute')
    .style('padding', 0)
    .style('margin', 0)
    .style('overflow', 'visible')
    .attr('role', nodeRole)
    .attr('id', controllerPrefix + nodeID)
    .attr('tabindex', -1)
    .on('keydown', () => {
      const e = event;
      e.stopPropagation();
      const result = getInteractionResult(nodeID, e, isGroup, recursive, sameGroupCousinKey);
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
            dataKeyNames,
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
                dataKeyNames,
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
        label = createGroupLabel({
          d,
          targetNode,
          index,
          groupAccessor,
          groupKeys,
          dataKeyNames,
          siblings,
          isOffsetGroup,
          includeKeyNames,
          capitalizedGroupName,
          capitalizedGeomType,
          geomType
        });
      } else {
        label = createLabel({
          d,
          i: index,
          n: siblings,
          capitalizedGeomType,
          capitalizedGroupName,
          includeKeyNames,
          dataKeys,
          dataKeyNames,
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
    })
    .style('left', `${bounds.left - parentBounds.left}px`)
    .style('top', `${bounds.top - parentBounds.top}px`)
    .style('width', `${bounds.width}px`)
    .style('height', `${bounds.height}px`)
    .style('pointer-events', 'none');
};

const findFirstOffsetValidChild = node => {
  const i = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  return node.parentNode.nextSibling.childNodes[i]
    ? node.parentNode.nextSibling.childNodes[i].childNodes[0]
    : undefined;
};

const findOffsetParent = (node, direction?) => {
  const parent = direction === 'next' ? 'target' : 'source';
  const i = direction
    ? node.__data__[parent].index
    : Array.prototype.indexOf.call(node.parentNode.parentNode.childNodes, node.parentNode);
  return node.parentNode.parentNode.previousSibling.childNodes[i];
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
  const target = elementID === '' ? null : document.getElementById(elementID);

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
  const target = elementID === '' ? null : document.getElementById(elementID);

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

const setActiveChild = (node: any) => {
  const rootSVG = findSVGRoot(node);
  if (!(rootSVG === document.body) && rootSVGRole === 'application') {
    const targetRoot = rootSVG.parentNode.firstElementChild;
    targetRoot.setAttribute('aria-activedescendant', controllerPrefix + node.id);
  }
};

const removeActiveChild = (node, isTheRoot?) => {
  const rootSVG = !isTheRoot ? findSVGRoot(node) : node;
  if (!(rootSVG === document.body) && rootSVGRole === 'application') {
    const targetRoot = !isTheRoot ? rootSVG.parentNode.firstElementChild : node;
    targetRoot.setAttribute('aria-activedescendant', null);
  }
};

const focusTarget = target => {
  // set the target focus state
  if (isIE11) {
    // https://mkyong.com/javascript/focus-is-not-working-in-ie-solution/
    // IE has lazy focusing, so it must be wrapped in a timeout
    setTimeout(function() {
      target.focus();
      // stencil@2.17.3+ mocks focus in jsdom, this additional logic is no longer needed
      // 'focus' in target ? target.focus() : target.dispatchEvent(new Event('focus'));
    }, 10);
    // HTMLElement.prototype.focus.apply(target);
  } /* else if (isIEEdge) {
    FocusableForeignObject(target);
  }*/ else {
    target.focus();
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

const findValidParent = (currentTarget: any, recursive?: boolean, requireTabIndex?: boolean) => {
  if (!recursive) {
    if (requireTabIndex && select(currentTarget.parentNode).attr('tabindex') !== null) {
      return currentTarget.parentNode;
    }
    return findSVGRoot(currentTarget);
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

const enterChartArea = (_event: any) => {
  const currentTarget: any = _event.target;
  const keyCode = _event.keyCode || _event.which;
  if (!_event.shiftKey && (keyCode === keyCodes.child || keyCode === keyCodes.select)) {
    // we will allow ENTER or SPACEBAR to enter the chart area
    _event.preventDefault();
    return select(currentTarget.parentNode)
      .select('svg')
      .select('[tabindex]')
      .node();
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
  let currentIdx = select(currentTarget).attr('data-index')
    ? +select(currentTarget).attr('data-index')
    : getElementIndex(currentTarget);
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

  // set target -- this does assume that currentIdx and data-index are interchangable/reconciled
  target = select(currentTarget).attr('data-index')
    ? Array.prototype.filter.call(parentSiblingChildren, el => currentIdx === +select(el).attr('data-index'))[0]
    : parentSiblingChildren[currentIdx];
  // ensure that target is actually something, will check backwards across groups if group sizes don't match
  while (!target && currentIdx > -1) {
    target = select(currentTarget).attr('data-index')
      ? Array.prototype.filter.call(parentSiblingChildren, el => currentIdx === +select(el).attr('data-index'))[0]
      : parentSiblingChildren[currentIdx];
    // if we don't find anything going back, then just assign the first cousin of parent's sibling
    if (currentIdx === 0 && !target && select(currentTarget).attr('data-index')) {
      target = parentSiblingChildren[currentIdx];
    }
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
  const eventType = validKeyCode(keyCode);
  const direction =
    keyCode === keyCodes.nextSibling || keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate
      ? 'next'
      : keyCode === keyCodes.previousSibling ||
        keyCode === keyCodes.previousCousin ||
        keyCode === keyCodes.previousCousinAlternate
      ? 'previous'
      : _event.shiftKey && keyCode === keyCodes.parent
      ? 'up'
      : keyCode === keyCodes.child
      ? 'down'
      : '';
  if (direction || keyCode === keyCodes.select) {
    _event.preventDefault();
  }
  if (eventType && !fired) {
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
        const isOffset = select(currentTarget).attr('data-offset-element');
        target = !isOffset ? findValidCousin(currentTarget, direction) : findOffsetParent(currentTarget, direction);
      }
    } else if (
      direction === 'down' ||
      (recursive && (keyCode === keyCodes.nextCousin || keyCode === keyCodes.nextCousinAlternate))
    ) {
      // we are moving down
      if (isGroup || recursive) {
        const isOffset = select(currentTarget).attr('data-offset-group');
        target = !isOffset ? findFirstValidChild(currentTarget, recursive) : findFirstOffsetValidChild(currentTarget);
      }
    } else if (
      direction === 'up' ||
      (recursive && (keyCode === keyCodes.previousCousin || keyCode === keyCodes.previousCousinAlternate))
    ) {
      // we are moving up
      if (isGroup) {
        target = findSVGRoot(currentTarget);
      } else {
        const isOffset = select(currentTarget).attr('data-offset-element');
        target = !isOffset ? findValidParent(currentTarget, recursive, true) : findOffsetParent(currentTarget);
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
  const className = !(source.tagName === 'svg') ? 'vcl-accessibility-focus' : 'vcl-accessibility-focus-root';
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
    const elevateParentLevel =
      !isNotAGeometry &&
      (!(select(source.parentNode).attr('tabindex') === null) || select(source.parentNode).classed('offset-target'));
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
      const isOffsetGroup = !!select(inputElement).attr('data-offset-group');
      if (!isOffsetGroup) {
        if (source.nextSibling) {
          parent.insertBefore(copy, source.nextSibling);
          parent.insertBefore(highlightCopy, source.nextSibling);
          parent.insertBefore(haloCopy, source.nextSibling);
        } else {
          parent.appendChild(haloCopy);
          parent.appendChild(highlightCopy);
          parent.appendChild(copy);
        }
      } else {
        const offsetTarget = parent.nextSibling.nextSibling;
        parent.parentNode.insertBefore(haloCopy, offsetTarget);
        parent.parentNode.insertBefore(highlightCopy, offsetTarget);
        parent.parentNode.insertBefore(copy, offsetTarget);
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
  const isAlluvial =
    select(source).data() &&
    select(source).data()[0] &&
    select(source).data()[0].source &&
    select(source).data()[0].target &&
    (select(source).data()[0].y0 || select(source).data()[0].y0 === 0);

  const highlightStyle = select(highlightCopy);
  applyDefaults(highlightStyle, className);
  applyOutlineOverride(
    highlightStyle,
    !isNotAGeometry && !recursive && !hasWidth ? 10 : 6,
    '#ffffff',
    isAlluvial ? select(source).data()[0] : undefined
  );
  if (!recursive && !isNotAGeometry && hasWidth) {
    applySizeOverride(highlightStyle, 3);
  }
  highlightStyle.style('opacity', 1).attr('opacity', 1);

  const haloStyle = select(haloCopy);
  applyDefaults(haloStyle, className);
  applyOutlineOverride(
    haloStyle,
    !isNotAGeometry && !recursive && !hasWidth ? 14 : !isNotAGeometry ? 2 : 10,
    '#000000',
    isAlluvial ? select(source).data()[0] : undefined
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

const applyOutlineOverride = (selection, extraStrokeWidth, strokeColor, d?) => {
  selection
    .style('stroke-dasharray', '')
    .attr('stroke-dasharray', null)
    .style('outline-offset', '0px')
    .style('outline-color', 'none')
    .style('outline-width', '0px')
    .attr('filter', null)
    .style('stroke-linecap', !d ? 'round' : 'butt')
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
      if (me.attr('d') && d) {
        const originalPath = me.attr('d').substr(1);
        const offsetStart = `M ${d.source.x1 - extraStrokeWidth / 2} ${d.y0} L`;
        const offsetEnd = `L ${d.target.x0 + extraStrokeWidth / 2} ${d.y1}`;
        me.attr('d', offsetStart + originalPath + offsetEnd);
      } else if (me.attr('marker-start') && me.attr('data-centerX1') && me.attr('d')) {
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
  // ie11 includes scroll already in pageX/Y, other tested browsers do not do this
  const left = bounds.left + (isIE11 ? 0 : document.body.scrollLeft + document.documentElement.scrollLeft);
  const top = bounds.top + (isIE11 ? 0 : document.body.scrollTop + document.documentElement.scrollTop);
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
