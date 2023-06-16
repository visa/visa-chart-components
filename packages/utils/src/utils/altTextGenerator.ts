/**
 * Copyright (c) 2021, 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { select } from 'd3-selection';
import { getScopedData } from './dataTransform';
import { translate } from './localization';
import { capitalized } from './calculation';
import { formatStats } from './formatStats';

export const createLabel = ({
  chartTag,
  language,
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
  recursive,
  normalized,
  valueAccessor,
  geomType,
  groupName
}: {
  chartTag: string;
  language: string;
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
  normalized?: boolean;
  valueAccessor?: string;
  geomType: string;
  groupName: string;
}) => {
  const datum = !recursive ? d : d.data.data;
  let label = '';
  if (nested) {
    if (datum[nested].length) {
      datum[nested].forEach(child => {
        label += iterateKeys(chartTag, language, child, dataKeys, dataKeyNames, includeKeyNames, true, valueAccessor);
      });
    }
    if (groupKeys && groupKeys.length) {
      groupKeys.forEach(groupKey => {
        label += !groupKey ? '' : datum[groupKey] + '. ';
      });
    }
  } else {
    label += iterateKeys(chartTag, language, datum, dataKeys, dataKeyNames, includeKeyNames, false, valueAccessor);
  }
  if (normalized) {
    label +=
      (includeKeyNames
        ? dataKeyNames
          ? (dataKeyNames[`${valueAccessor}%`] || (dataKeyNames[`${valueAccessor}`] || valueAccessor) + ' (%)') + ' '
          : valueAccessor + ' (%) '
        : '') +
      formatStats(
        datum.hasOwnProperty('data') ? datum.data[`${valueAccessor}%`] : datum[`${valueAccessor}%`],
        '0[.][0][0]%'
      ) +
      '. ';
  }
  label += `${capitalized(translate(`general.geomTypes.${geomType}`, language))}` + ' ' + (i + 1) + `.`;
  if (recursive) {
    const depth = d.depth;
    const size = select(n[i].parentNode)
      .selectAll('g:not(.vcl-accessibility-focus-highlight)')
      .filter(data => (depth === undefined ? true : data && data.depth === depth + 1))
      .size();
    label +=
      ` ${translate(`${chartTag}.altTextGenerator.numberOfChildElements`, language)} ` +
      (size || '0') +
      (!size && d.children && d.children.length
        ? `${translate('general.expressions.butSomeMayBeHiddenUntilYouInteractWithThisNode', language)}`
        : '.');
  }
  return label;
};

export const createGroupLabel = ({
  chartTag,
  language,
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
  geomType,
  groupName
}: {
  chartTag: string;
  language: string;
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
  groupName: string;
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
    return groupData + `${translate(`general.groupNames.${groupName}`, language)}` + ' ' + (index + 1) + `.`;
  } else {
    const childrenCount = siblings[index].querySelectorAll('*:not(.vcl-accessibility-focus-highlight)').length;
    return `${translate(`${chartTag}.altTextGenerator.numberOfInteractiveElements`, language)} ` + childrenCount + '.';
  }
};

const iterateKeys = (
  chartTag: string,
  language: string,
  item: any,
  objectOfDataKeys: any,
  dataKeyNames: object,
  includeKeyNames: boolean,
  nested?: boolean,
  valueAccessor?: string
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
      if (datum[key + '%'] !== undefined && key !== valueAccessor) {
        const percentKeyEnding = datum[key + '%'][datum[key + '%'].length - 1] === '.' ? ' ' : '. ';
        label += includeKeyNames ? mappedKeyName + ` ${translate('general.expressions.asAPercentage', language)} ` : '';
        label += datum[key + '%'] + percentKeyEnding;
      }
      keyPosition++;
    }
  });
  return label;
};
