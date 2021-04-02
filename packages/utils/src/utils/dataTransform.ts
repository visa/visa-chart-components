/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import { formatStats } from './formatStats';
import { formatDate } from './formatDate';

export function transformData(data, groupAccessor, ordinalAccessor, valueAccessor) {
  // transform data to below format
  // [{label: "2018", "A": 23, "B": 7, "C": 11}, {label: ..}]
  const dataArr = [];
  data.forEach(obj => {
    let o = {};
    if (!dataArr.length) {
      o[groupAccessor] = obj[groupAccessor];
      o[obj[ordinalAccessor]] = obj[valueAccessor];
      dataArr.push(o);
    } else {
      o = dataArr.filter(d => d[groupAccessor] === obj[groupAccessor]).pop();
      if (!!o) {
        const idx = dataArr.findIndex(d => d[groupAccessor] === obj[groupAccessor]);
        o[obj[ordinalAccessor]] = obj[valueAccessor];
        dataArr[idx] = o;
      } else {
        o = {};
        o[groupAccessor] = obj[groupAccessor];
        o[obj[ordinalAccessor]] = obj[valueAccessor];
        dataArr.push(o);
      }
    }
  });
  return dataArr;
}

export const accessorFormatMap = {
  number: '0[.][0][0]a',
  date: '%B %d %Y',
  percent: '0[.][0][0]%',
  string: ''
};

export const accessorFormats = {
  valueAccessor: 'number',
  nodeSizeAccessor: 'number',
  latitudeAccessor: 'number',
  longitudeAccessor: 'number',
  xAccessor: [
    {
      charts: ['scatter-plot'],
      type: 'number'
    }
  ],
  yAccessor: [
    {
      charts: ['scatter-plot'],
      type: 'number'
    }
  ]
};
export const orderColumns = {
  'alluvial-diagram': ['sourceAccessor', 'targetAccessor', 'groupAccessor', 'valueAccessor'],
  'bar-chart': ['ordinalAccessor', 'valueAccessor', 'groupAccessor'],
  'clustered-bar-chart': ['groupAccessor', 'ordinalAccessor', 'valueAccessor'],
  'stacked-bar-chart': ['groupAccessor', 'ordinalAccessor', 'valueAccessor'],
  'line-chart': ['seriesAccessor', 'ordinalAccessor', 'valueAccessor'],
  'pie-chart': ['ordinalAccessor', 'valueAccessor'],
  'scatter-plot': ['groupAccessor', 'xAccessor', 'yAccessor'],
  'heat-map': ['xAccessor', 'yAccessor', 'valueAccessor'],
  'circle-packing': ['clusterAccessor', 'nodeAccessor', 'nodeSizeAccessor', 'idAccessor'],
  'parallel-plot': ['seriesAccessor', 'ordinalAccessor', 'valueAccessor'],
  'dumbbell-plot': ['seriesAccessor', 'ordinalAccessor', 'valueAccessor'],
  'world-map': ['markerNameAccessor', 'joinNameAccessor', 'valueAccessor']
};

export const chartAccessors = {
  singleAccessors: [
    'valueAccessor',
    'sizeAccessor',
    'xAccessor',
    'yAccessor',
    'latitudeAccessor',
    'longitudeAccessor',
    'ordinalAccessor',
    'idAccessor',
    'markerAccessor',
    'markerNameAccessor',
    'joinAccessor',
    'joinNameAccessor',
    'nodeAccessor',
    'parentAccessor',
    'groupAccessor',
    'seriesAccessor',
    'filterAccessor',
    'sourceAccessor',
    'targetAccessor'
  ],
  arrayAccessors: ['interactionKeys'],
  nestedAccessors: [
    {
      objectName: 'tooltipLabel',
      objectAccessors: ['labelAccessor'],
      formatAccessors: ['format']
    },
    {
      objectName: 'accessibility',
      objectAccessors: ['elementDescriptionAccessor']
    },
    {
      objectName: 'dataLabel',
      objectAccessors: ['labelAccessor'],
      formatAccessors: ['format']
    }
  ]
};

export function orderScopedData(_this, dataSample, chartType) {
  const tableColumns = [];
  orderColumns[chartType].forEach(col => {
    if (_this[col]) {
      tableColumns.push(_this[col]);
    }
  });
  Object.keys(dataSample).forEach(key => {
    if (tableColumns.indexOf(key) < 0) {
      tableColumns.push(key);
    }
  });
  return tableColumns;
}

export function getScopedData(data, keyMap) {
  const scopedData = [];
  data.forEach(dataRecord => {
    const scopedDataRecord = {};
    // loop through target fields instead of all data record fields
    Object.keys(keyMap).forEach(field => {
      // check if we have a date object, if we do format with provided or default date format
      if (dataRecord[field] instanceof Date) {
        scopedDataRecord[field] = formatDate({
          date: dataRecord[field],
          format: keyMap[field] ? keyMap[field] : accessorFormatMap['date'],
          offsetTimezone: true
        });
      } else {
        if (keyMap[field] === 'normalized') {
          scopedDataRecord[field] =
            keyMap[field] && dataRecord[field]
              ? formatStats(dataRecord[field], accessorFormatMap['number'])
              : dataRecord[field];
          scopedDataRecord[`${field}%`] =
            keyMap[field] && dataRecord[field] && dataRecord.getSum
              ? formatStats(dataRecord[field] / dataRecord.getSum(), accessorFormatMap['percent'])
              : dataRecord[field];
        } else {
          scopedDataRecord[field] =
            keyMap[field] && dataRecord[field] ? formatStats(dataRecord[field], keyMap[field]) : dataRecord[field];
        }
      }
    });
    scopedData.push(scopedDataRecord);
  });
  return scopedData;
}

export function getDefaultFormat(accessor, formats, formatMap, chartType) {
  // we are going to use a map for now instead of finding the type of the data in the data row
  if (formats[accessor]) {
    if (formats[accessor] instanceof Array) {
      // we have chart specific stuff
      let mappedFormat = undefined;
      formats[accessor].forEach(formatObj => {
        if (formatObj.charts.indexOf(chartType) >= 0) {
          mappedFormat = formatMap[formatObj.type];
        } else {
          mappedFormat = mappedFormat ? mappedFormat : (mappedFormat = '');
        }
      });
      return mappedFormat;
    } else {
      // we can simple return default type based on value
      if (formatMap[formats[accessor]]) {
        return formatMap[formats[accessor]];
      } else {
        return '';
      }
    }
  } else {
    return '';
  }
}

export function scopeDataKeys(_this, accessors, chartType, skipSorting?) {
  // this doesn't work need to get the list of props on the element.
  let valueKeyMap = {};
  let valueKeyHash = {};

  // first we do nested accessors, starting with tooltip
  if (accessors.nestedAccessors && accessors.nestedAccessors instanceof Array) {
    accessors.nestedAccessors.forEach(accessor => {
      if (accessor.objectName && accessor.objectAccessors && accessor.objectAccessors instanceof Array) {
        if (_this[accessor.objectName]) {
          accessor.objectAccessors.forEach((k, i) => {
            if (_this[accessor.objectName][k] instanceof Array) {
              _this[accessor.objectName][k].forEach((innerK, j) => {
                // is there an associated format that is an array?
                if (!valueKeyHash[innerK]) {
                  valueKeyMap[innerK] =
                    accessor.formatAccessors &&
                    accessor.formatAccessors instanceof Array &&
                    _this[accessor.objectName][accessor.formatAccessors[i]]
                      ? _this[accessor.objectName][accessor.formatAccessors[i]][j]
                      : undefined;
                  valueKeyHash[innerK] = 1;
                }
              });
            } else {
              if (_this[accessor.objectName][k] && !valueKeyHash[_this[accessor.objectName][k]]) {
                valueKeyMap[_this[accessor.objectName][k]] = accessor.formatAccessors
                  ? _this[accessor.objectName][accessor.formatAccessors]
                  : undefined;
                valueKeyHash[_this[accessor.objectName][k]] = 1;
              }
            }
          });
        }
      }
    });
  }

  // next we do singleAccessors, make sure it exists and is an array
  if (accessors.singleAccessors && accessors.singleAccessors instanceof Array) {
    accessors.singleAccessors.forEach(accessor => {
      // now we check whether the chart has the accessor for each
      if (_this[accessor] && !valueKeyHash[_this[accessor]]) {
        const defFormat = getDefaultFormat(accessor, accessorFormats, accessorFormatMap, chartType);
        valueKeyMap[_this[accessor]] = defFormat;
        valueKeyHash[_this[accessor]] = 1;
      }
    });
  }

  // next we do array accessors
  if (accessors.arrayAccessors && accessors.arrayAccessors instanceof Array) {
    accessors.arrayAccessors.forEach(accessor => {
      if (_this[accessor]) {
        _this[accessor].forEach(k => {
          if (!valueKeyHash[k] && k !== 'xAccessor' && k !== 'yAccessor') {
            // have to account for mutation of heat-map interaction key props
            valueKeyMap[k] = undefined;
            valueKeyHash[k] = 1;
          }
        });
      }
    });
  }

  if (!skipSorting) {
    const newKeyMap = {};
    const correctKeysInOrder = orderScopedData(_this, valueKeyMap, chartType);

    correctKeysInOrder.forEach(key => {
      newKeyMap[key] = valueKeyMap[key];
    });
    valueKeyMap = newKeyMap;
  }

  return valueKeyMap;
}

// this operation happens in-place (it mutates the incoming data, must duplicate before sending when necessary)
export function fixNestedSparseness(
  data: any,
  ordinalAccessor: string,
  groupAccessor: string,
  valueAccessor: string,
  defaultValue?: number
) {
  // full group is what an ideal group will look like in the nest
  const fullGroup = {};
  // currentNest is what the current nest looks like, we check its sparseness against fullGroup
  const currentNest = {};

  // we will now populate fullGroup and currentNest
  data.forEach(datum => {
    // make sure the ideal group has every ordinal value we encounter
    fullGroup[datum[ordinalAccessor]] = 1;
    // check if we have a group in the nest yet
    if (!currentNest[datum[groupAccessor]]) {
      // initialize the group if we don't
      currentNest[datum[groupAccessor]] = {};
    }
    // add the ordinal value to the current group
    currentNest[datum[groupAccessor]][datum[ordinalAccessor]] = 1;
  });

  // we create this array once, so we don't have to repeat it inside our looping
  const everyOrdinal = Object.keys(fullGroup);
  // now that we know what the nest looks like, we are checking sparseness against fullGroup
  Object.keys(currentNest).forEach(groupValue => {
    // everyOrdinal has the "perfect" group (non-sparse), so we use it to compare
    everyOrdinal.forEach(ordinalValue => {
      // we check each group's ordinals against everyOrdinal, one at a time
      if (!currentNest[groupValue][ordinalValue]) {
        // when we encounter a missing item in the current nest, we add to the original array
        const missingPiece = {};
        // make sure we always have some kind of numeric value here if one is not sent
        missingPiece[valueAccessor] = defaultValue || 0;
        missingPiece[ordinalAccessor] = ordinalValue;
        missingPiece[groupAccessor] = groupValue;

        // now our data contains each missing piece it requires
        data.push(missingPiece);
      }
    });
  });
}
