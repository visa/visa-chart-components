/**
 * Copyright (c) 2021, 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select } from 'd3-selection';
import { getScopedData } from './dataTransform';

export const createLabel = ({
  d,
  i,
  n,
  capitalizedGeomType,
  capitalizedGroupName,
  includeKeyNames,
  dataKeys,
  dataKeyNames,
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
  dataKeyNames?: object;
  groupKeys?: any;
  nested?: string;
  recursive?: boolean;
}) => {
  const datum = !recursive ? d : d.data.data;
  let label = '';
  if (nested) {
    if (datum[nested].length) {
      datum[nested].forEach(child => {
        label += iterateKeys(child, dataKeys, dataKeyNames, includeKeyNames, true);
      });
    }
    if (groupKeys && groupKeys.length) {
      groupKeys.forEach(groupKey => {
        label += !groupKey ? '' : datum[groupKey] + '. ';
      });
    }
  } else {
    label += iterateKeys(datum, dataKeys, dataKeyNames, includeKeyNames);
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

export const createGroupLabel = ({
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
}: {
  d: any;
  targetNode: any;
  index: number;
  groupAccessor: string;
  groupKeys: any;
  dataKeyNames?: object;
  siblings: any;
  isOffsetGroup: boolean;
  includeKeyNames: boolean;
  capitalizedGroupName: string;
  capitalizedGeomType: string;
  geomType: string;
}) => {
  let tabbableSiblings = 0;
  Array.prototype.forEach.call(siblings, sibling => {
    if (select(sibling).attr('tabindex') !== null) {
      tabbableSiblings++;
    }
  });
  if (tabbableSiblings > 1) {
    const targetRootForChildren = !isOffsetGroup ? targetNode : targetNode.parentNode.nextSibling.childNodes[index];
    const firstChild = targetNode.querySelectorAll('*:not(.vcl-accessibility-focus-highlight)')[0];
    let groupData =
      firstChild && firstChild['__data__']
        ? includeKeyNames &&
          groupAccessor &&
          dataKeyNames &&
          firstChild['__data__'][groupAccessor] &&
          dataKeyNames[groupAccessor]
          ? dataKeyNames[groupAccessor] + ' ' + firstChild['__data__'][groupAccessor] + '. '
          : includeKeyNames && groupAccessor && firstChild['__data__'][groupAccessor]
          ? groupAccessor + ' ' + firstChild['__data__'][groupAccessor] + '. '
          : firstChild['__data__'][groupAccessor] + '. '
        : '';
    if (groupKeys && groupKeys.length) {
      groupKeys.forEach(groupKey => {
        groupData += !groupKey ? '' : d[groupKey] + '. ';
      });
    }
    const childrenCount = targetRootForChildren
      ? targetRootForChildren.querySelectorAll('*:not(.vcl-accessibility-focus-highlight)').length
      : 0;
    return (
      groupData +
      (capitalizedGroupName || capitalizedGeomType + ' group') +
      ' ' +
      (index + 1) +
      ' of ' +
      targetNode.parentNode.querySelectorAll('g:not(.vcl-accessibility-focus-highlight)').length +
      ' which contains ' +
      childrenCount +
      ' interactive ' +
      geomType +
      (childrenCount !== 1 ? 's.' : '.')
    );
  } else {
    const childrenCount = siblings[index].querySelectorAll('*:not(.vcl-accessibility-focus-highlight)').length;
    return (
      (capitalizedGroupName || capitalizedGeomType + ' group') +
      ' which contains ' +
      childrenCount +
      ' interactive ' +
      geomType +
      (childrenCount !== 1 ? 's.' : '.')
    );
  }
};

const iterateKeys = (
  item: any,
  objectOfDataKeys: any,
  dataKeyNames: object,
  includeKeyNames: boolean,
  nested?: boolean
) => {
  const dataKeys = Object.keys(objectOfDataKeys);
  let label = '';
  const datum = !item.data
    ? getScopedData([item], objectOfDataKeys)[0]
    : getScopedData([item.data], objectOfDataKeys)[0];
  let keyPosition = 1;
  dataKeys.forEach(key => {
    const mappedKeyName = dataKeyNames && dataKeyNames[key] ? dataKeyNames[key] : key;
    if (datum[key] !== undefined) {
      const keyEnding = typeof datum[key] === 'string' && datum[key][datum[key].length - 1] === '.' ? ' ' : '. ';
      if (!(nested && !includeKeyNames)) {
        label += includeKeyNames ? mappedKeyName + ' ' : '';
        label += datum[key] + keyEnding;
      } else {
        label += datum[key] + (keyPosition % 2 ? ' ' : keyEnding);
      }
      if (datum[key + '%'] !== undefined) {
        const percentKeyEnding = datum[key + '%'][datum[key + '%'].length - 1] === '.' ? ' ' : '. ';
        label += includeKeyNames ? mappedKeyName + ' as a percentage ' : '';
        label += datum[key + '%'] + percentKeyEnding;
      }
      keyPosition++;
    }
  });
  return label;
};
