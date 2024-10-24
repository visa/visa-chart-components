/**
 * Copyright (c) 2022, 2023, 2024 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import recipe_json from './data/recipe-data.json';
import props_json from './data/prop-master-data.json';
import apidocs_json from './data/apidocs.json';
import {
  propDefaultValues,
  registerI18NextLanguage,
  registerNumeralLocale
} from '../packages/utils/dist/visa-charts-utils.cjs';
import { hu } from '../packages/utils/src/utils/localization/languages/hu';
import { HU } from '../packages/utils/src/utils/localization/numeralLocales/hu';
// import data_json from './data/demo-data.json';

const categories = {
  Accessibility: ['accessibility', 'animationConfig', 'highestHeadingLevel'],
  Annotations: ['annotations'],
  Axes: [
    'yAxis',
    'xAxis',
    'barIntervalRatio',
    'yMinValueOverride',
    'yMaxValueOverride',
    'xMinValueOverride',
    'xMaxValueOverride',
    'minValueOverride',
    'maxValueOverride',
    'hideAxisPath',
    'showBaselineX',
    'showBaselineY',
    'groupIntervalRatio'
  ],
  Base: ['mainTitle', 'subTitle', 'width', 'height', 'layout', 'centerTitle', 'centerSubTitle', 'uniqueID'],
  Countries: ['countryStyle'],
  Data: [
    'data',
    'linkData',
    'nodeData',
    'ordinalAccessor',
    'valueAccessor',
    'groupAccessor',
    'seriesAccessor',
    'parentAccessor',
    'sizeAccessor',
    'xAccessor',
    'yAccessor',
    'sortOrder',
    'reverseOrder',
    'nodeAccessor',
    'displayDepth',
    'joinAccessor',
    'joinNameAccessor',
    'latitudeAccessor',
    'longitudeAccessor',
    'sourceAccessor',
    'targetAccessor',
    'xKeyOrder',
    'yKeyOrder',
    'markerAccessor',
    'markerNameAccessor',
    'nodeIDAccessor',
    'dataDepth',
    'secondaryLines'
  ],
  Events: [
    'clickEvent',
    'hoverEvent',
    'mouseOutEvent',
    'drawStartEvent',
    'drawEndEvent',
    'initialLoadEvent',
    'initialLoadEndEvent',
    'transitionEndEvent',
    'suppressEvents',
    'clickHighlight',
    'hoverHighlight',
    'zoomToNode'
  ],
  Labels: [
    'dataLabel',
    'dataKeyNames',
    'tooltipLabel',
    'legend',
    'showTooltip',
    'wrapLabel',
    'seriesLabel',
    'differenceLabel',
    'showPercentage',
    'showLabelNote',
    'labelOffset',
    'normalized',
    'showTotalValue',
    'showZeroLabels'
  ],
  Links: ['linkConfig'],
  Localization: ['localization', 'language', 'numeralLocale', 'skipValidation', 'overwrite'],
  Map: ['mapProjection', 'quality', 'mapScaleZoom', 'showGridlines'],
  Margin: ['margin'],
  Marker: ['marker', 'focusMarker', 'markerStyle', 'sizeConfig', 'dotRadius', 'dotOpacity', 'dotSymbols', 'showDots'],
  Nodes: ['nodeConfig'],
  'Reference Line': ['referenceLines', 'referenceStyle', 'referenceData', 'fitLineStyle', 'showFitLine'],
  Padding: ['padding', 'circlePadding'],
  Style: [
    'colors',
    'colorPalette',
    'cursor',
    'interactionKeys',
    'clickStyle',
    'hoverOpacity',
    'hoverStyle',
    'roundedCorner',
    'barStyle',
    'colorSteps',
    'strokeWidth',
    'shape',
    'innerRatio',
    'showEdgeLine',
    'lineCurve'
  ]
};

export function getCategories() {
  return categories;
}

function flatten(obj) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const child of obj.children) {
    if (child.children) {
      const { children, ...rest } = child;
      if (child.kind !== 1) result.push(rest);
      result.push(...flatten(child));
    } else {
      result.push(child);
    }
  }

  return result;
}

export function GetAPIDocsJsonByChartType(chartType) {
  const docsJsonObj = {};
  try {
    docsJsonObj.docsJson = apidocs_json;
    const chartChildren = docsJsonObj.docsJson.children
      .filter(obj => obj.name.startsWith(chartType, 1) && obj.groups[0].title === 'Interfaces')
      .map(flatten)
      .reduce((a, b) => a.concat(b), []);

    // get main prop interface
    const mainPropInterface = chartChildren.find(obj => obj.name.endsWith('Props') && obj.kindString === 'Interface');

    // get remaining interface being used in chart
    const remainingInterfaces = chartChildren.filter(
      obj => obj.id !== mainPropInterface.id && obj.kindString === 'Interface'
    );

    const remainingInterfaceWithMembers = remainingInterfaces.map(remInterface => {
      const interfaceChildrenIds = remInterface.groups.find(grp => grp.title === 'Properties').children;
      const interfaceChildren = chartChildren.filter(child => interfaceChildrenIds.includes(child.id));
      const interfaceType = {};
      interfaceType.customType = remInterface.name;
      interfaceType.id = remInterface.id;
      interfaceType.members = interfaceChildren.map(child => {
        const item = {
          name: child.name,
          type: child.type
        };
        if (child.comment && child.comment.shortText) {
          item.shortDescription = child.comment.shortText;
        }
        return item;
      });
      return interfaceType;
    });

    // Get immediate children ids
    const immediateIds = mainPropInterface.groups.find(grp => grp.title === 'Properties').children;

    // get immediate children of main prop interface
    const immediateChildren = chartChildren.filter(obj => immediateIds.includes(obj.id));

    const defaultValuesChildren = docsJsonObj.docsJson.children
      .filter(obj => obj.name.startsWith(chartType, 1) && obj.groups[0].title === 'Classes')
      .map(flatten)
      .reduce((a, b) => a.concat(b), []);

    // Get default values class
    const defaultValuesClass = defaultValuesChildren.find(obj => obj.kindString === 'Class');

    // Get default props
    const defaultPropsId = defaultValuesClass.groups.find(obj => obj.title === 'Properties').children;
    const defaultProps = defaultValuesChildren
      .filter(obj => defaultPropsId.includes(obj.id))
      .map(obj => ({
        id: obj.id,
        name: obj.name,
        defaultValue: obj.defaultValue
      }));

    // Get default object literal
    const defaultObjectLiteralId = defaultValuesClass.groups.find(obj => obj.title.startsWith('Object')).children;
    const defaultObjectLiteral = defaultValuesChildren.filter(obj => defaultObjectLiteralId.includes(obj.id));

    // Get and set default values for each object literal
    const defaultObjectLiteralWithValues = defaultObjectLiteral.map(obj => {
      const childrenIdByInterface = obj.groups.find(grp => grp.title === 'Variables').children;
      const childrenByInterface = defaultValuesChildren.filter(o => childrenIdByInterface.includes(o.id));
      const defaultValuesByInterface = childrenByInterface.reduce((acm, item) => {
        // eslint-disable-next-line no-param-reassign
        acm[item.name] =
          typeof item.defaultValue === 'string' ? item.defaultValue.replace(/(")/g, '') : item.defaultValue;
        return acm;
      }, {});
      return {
        id: obj.id,
        name: obj.name,
        defaultValue: defaultValuesByInterface
      };
    });

    const tempDefaultValues = [...defaultProps, ...defaultObjectLiteralWithValues];

    // added this section to map util defaults to their values
    const allDefaultValues = tempDefaultValues.map(item => {
      let newDefaultValue;
      if (
        item.defaultValue &&
        typeof item.defaultValue === 'string' &&
        item.defaultValue.trim().split('.')[0] === 'propDefaultValues'
      ) {
        // eslint-disable-next-line no-unused-expressions
        newDefaultValue = propDefaultValues[item.defaultValue.trim().split('.')[1]];
      } else {
        newDefaultValue = item.defaultValue;
      }
      return { ...item, defaultValue: newDefaultValue };
    });

    // Final Json with documentation formatting
    const chartsJsonProps = immediateChildren.map(obj => {
      const item = allDefaultValues.find(i => i.name === obj.name);
      // eslint-disable-next-line no-nested-ternary
      let tempDefaultValue = item
        ? typeof item.defaultValue === 'string' && obj.type.type.toLowerCase() !== 'array'
          ? item.defaultValue.replace(/(")/g, '')
          : item.defaultValue
        : 'Not Set';
      const { type } = obj;
      if (obj.type.type.toLowerCase() === 'intrinsic') {
        if (obj.type.name.toLowerCase() === 'boolean' && tempDefaultValue !== 'Not Set') {
          tempDefaultValue = tempDefaultValue ? tempDefaultValue.toString().toLowerCase() === 'true' : false;
        } else if (obj.type.name.toLowerCase() === 'number' && tempDefaultValue !== 'Not Set') {
          tempDefaultValue = parseFloat(tempDefaultValue);
        } else if (tempDefaultValue === 'Not Set') {
          tempDefaultValue = '';
        }
      } else if (obj.type.type.toLowerCase() === 'array') {
        type.name = obj.type.elementType ? obj.type.elementType.name : 'any';
        type.type = obj.type.type;
        if (
          tempDefaultValue &&
          tempDefaultValue !== 'Not Set' &&
          String.prototype.indexOf.call(tempDefaultValue, '\\') !== -1
        ) {
          tempDefaultValue = JSON.parse(tempDefaultValue);
        } else if (tempDefaultValue === 'Not Set') {
          tempDefaultValue = '';
        }
      } else if (obj.type.type.toLowerCase() === 'reference' && Object.keys(tempDefaultValue).length !== 0) {
        const customType = remainingInterfaceWithMembers.find(t => t.id === obj.type.id)
          ? remainingInterfaceWithMembers.find(t => t.id === obj.type.id)
          : remainingInterfaceWithMembers.find(t => t.customType === obj.type.name);
        const defaultValueKeys = Object.keys(tempDefaultValue);
        customType.members.map(member => {
          defaultValueKeys.find(i => {
            if (i === member.name && member.type && member.type.name) {
              if (member.type.name.toLowerCase() === 'boolean') {
                const memberValue = tempDefaultValue[member.name]
                  ? tempDefaultValue[member.name].toString().toLowerCase() === 'true'
                  : false;
                tempDefaultValue[member.name] = memberValue;
              } else if (member.type.name.toLowerCase() === 'number') {
                const str = tempDefaultValue[member.name].toString().replace(/[^-()\d/*+.]/g, '');
                // eslint-disable-next-line no-eval
                tempDefaultValue[member.name] = parseFloat(eval(str));
              }
            } else if (i === member.name && member.type && member.type.elementType && member.type.elementType.name) {
              tempDefaultValue[member.name] = tempDefaultValue[member.name];
            }
            return false;
          });
          return false;
        });
      }
      const propItem = {
        id: obj.id,
        name: obj.name,
        type,
        defaultValue: tempDefaultValue,
        modifiedValue: -1
      };
      let tag;
      if (obj.comment && obj.comment.tags) {
        tag = obj.comment.tags.reduce((acm, t) => {
          // eslint-disable-next-line no-param-reassign
          acm[t.tag] = t.text;
          return acm;
        }, {});
      }
      if (tag) propItem.tag = tag;
      return propItem;
    });
    // Here return json for doc
    const docsJsonForChart = {
      chartName: chartType,
      props: chartsJsonProps,
      customTypes: remainingInterfaceWithMembers
    };
    return docsJsonForChart;
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.log('GetAPIDocsJsonByChartType: failed to build apidocsjson', ex);
  }
}

export function getProperties(chartType) {
  let chartRecipes = recipe_json.filter(i => i.chart === chartType);
  let propDetails = GetAPIDocsJsonByChartType(chartType);
  let argList = [];
  let actionList = [];
  chartRecipes.map(i =>
    Object.keys(i).forEach(j => {
      argList.push(j);
      if (new RegExp('^_.*Event$').test(j)) {
        actionList.push(i[j]);
      }
    })
  );
  const distinctArgs = Array.from(new Set(argList));
  const distinctActions = Array.from(new Set(actionList));

  const controlMapping = {
    TextArea: 'object',
    TextField: {
      number: 'number',
      string: 'text'
    },
    Radio: 'radio',
    Select: 'select',
    Slider: 'range',
    Toggle: 'boolean'
  };

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].includes(value));
  }

  let argTypes = {};
  propDetails.props.sort((a, b) => {
    let A = getKeyByValue(categories, a.name);
    let B = getKeyByValue(categories, b.name);
    if (A > B) return 1;
    if (A < B) return -1;
    return 0;
  });
  propDetails.props.forEach(j => {
    const propMaster = props_json.filter(p => p.name === j.name)[0];
    // props_json
    //   .filter(i => distinctArgs.includes(i.name))
    // .forEach(j => {
    let options =
      propMaster &&
      propMaster.options &&
      propMaster.options.hasOwnProperty('choices') &&
      Array.isArray(propMaster.options.choices)
        ? propMaster.options.choices.map(k => k.value)
        : propMaster.options.hasOwnProperty('default') && Array.isArray(propMaster.options.default)
        ? propMaster.options.default.map(k => k.id)
        : propMaster.options.length > 0
        ? propMaster.options.map(k => k.id)
        : null;

    // before we do anything we may this props argTypes stuff an object
    // might as well populate with description and default here as well
    Object.assign(argTypes, {
      [j.name]: {
        name: j.name,
        type: j.type && j.type.type,
        description: j.tag && j.tag.shortdescription
      }
    });

    // next we check for whether we have drop down options in prop master
    if (options !== null) {
      Object.assign(argTypes, {
        [j.name]: {
          ...argTypes[j.name],
          options: options,
          control: { type: controlMapping[j.tag && j.tag.controlname] || 'select' },
          table: {
            category: getKeyByValue(categories, j.name),
            defaultValue: { summary: j.defaultValue },
            type: {
              detail: j.tag && j.tag.shortdescription,
              summary: j.type && j.type.name
            }
          }
        }
      });
    } else if (new RegExp('Event$').test(j.name)) {
      let keyName = distinctActions.filter(k => k.toLowerCase().includes(j.name.split('Event')[0].toLowerCase()))[0];
      Object.assign(argTypes, {
        [keyName]: {
          action: `${j.name}`,
          table: { disable: true }
        },
        [`${j.name}`]: {
          ...argTypes[j.name],
          control: { type: 'boolean' },
          table: {
            category: 'Events',
            defaultValue: { summary: j.defaultValue },
            type: {
              detail: j.tag && j.tag.shortdescription,
              summary: j.type && j.type.name
            }
          }
        }
      });
    } else {
      let controlObject;
      // before we address control for the rest we can check whether there are ranges like sliders to consider
      if (controlMapping[j.tag && j.tag.controlname] === 'range') {
        controlObject =
          propMaster && propMaster.options && propMaster.options.min
            ? {
                control: {
                  type: 'range',
                  min: propMaster.options.min,
                  max: propMaster.options.max,
                  step: propMaster.options.step || 1
                }
              }
            : { control: { type: 'number' } };
      } else if (j.tag && j.tag.controlname === 'TextField') {
        controlObject = { control: { type: controlMapping['TextField'][j.type.name] || 'text' } };
      } else {
        controlObject = { control: { type: controlMapping[j.tag && j.tag.controlname] || 'text' } };
      }
      // console.log('we are in else statement', j, j.name, controlObject);
      Object.assign(argTypes, {
        [j.name]: {
          ...argTypes[j.name],
          ...controlObject,
          table: {
            category: getKeyByValue(categories, j.name),
            defaultValue: {
              summary: j.defaultValue instanceof Object ? JSON.stringify(j.defaultValue) : j.defaultValue
            },
            type: {
              detail: j.tag && j.tag.shortdescription,
              summary: j.type && j.type.name
            }
          }
        }
      });
    }
    // console.log('checking prop', j.name, j.tag.controlname, argTypes[j.name], j, propMaster);
  });
  // console.log('checking on returned objects', chartRecipes, argTypes, distinctArgs);
  return { chartRecipes, argTypes, distinctArgs }; // propDetails is helpful to return for debugging
}

export function setProperties(recipes, name, argList) {
  let args = recipes.filter(i => i.name === name)[0];
  let exclusions = [];

  argList.forEach(j => {
    if (!new RegExp('Event$').test(j)) {
      if (!Object.keys(args).includes(j)) {
        exclusions.push(j);
      }
    } else if (new RegExp('^_.*Event$').test(j)) {
      delete args[j];
    }
  });
  args.uniqueID = `${args.chart}-${name.replace(/\s/g, '')}`; //.toLowerCase().replace(/\s/g, '-');

  // no remove unnecessary args from recipes
  delete args.chart;
  delete args.name;

  // exclusions.push('uniqueID');
  return { args, exclusions };
}

export function registerLocalization() {
  registerI18NextLanguage(hu);
  registerNumeralLocale('hu', HU);
}

export function removeEventBooleans(args) {
  const {
    clickEvent,
    hoverEvent,
    mouseOutEvent,
    initialLoadEvent,
    initialLoadEndEvent,
    drawStartEvent,
    drawEndEvent,
    transitionEndEvent,
    ...renderArgs
  } = args;
  return renderArgs;
}

export function transformDates(args) {
  if (args && args.data) {
    args.data.map(d => {
      if (d.date && !(d.date instanceof Date)) {
        const tempDate = d.date;
        d.date = new Date(tempDate);
      }
      return d;
    });
  }

  if (args && args.clickHighlight && args.clickHighlight.length) {
    args.clickHighlight.map(d => {
      if (d.date && !(d.date instanceof Date)) {
        d.date = new Date(d.date);
      }
      return d;
    });
  }

  if (args && args.hoverHighlight && args.hoverHighlight.date && !(args.hoverHighlight.date instanceof Date)) {
    args.hoverHighlight.date = new Date(args.hoverHighlight.date);
  }

  if (args && args.annotations && args.annotations.length > 0) {
    // eslint-disable-next-line array-callback-return, arrow-parens
    args.annotations.map(d => {
      // eslint-disable-next-line array-callback-return, arrow-parens
      if (d.data && d.data.date) {
        d.data.date = new Date(d.data.date);
      }
    });
  }
}
