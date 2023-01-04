/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

import { loadFontsAsyncHardCoded, createChartTextStyles, checkFigmaPaintStyleExistsByName } from './utils/figma-utils';
import StartCase from 'lodash.startcase';

import { figmaRGBToHex } from '@figma-plugin/helpers';

const createChartTitles = (msg, frame) => {
  // vertical adjustment
  let verticalShift = 0;

  // main title
  const mainTitleText = msg.mainTitle;
  const mainTitleTextStyle = chartTextStyles.find(style => style.name === 'VCC Plugin/TextStyles/Main Title');

  const subTitleText = msg.subTitle;
  const subTitleTextStyle = chartTextStyles.find(style => style.name === 'VCC Plugin/TextStyles/Sub Title');

  if (mainTitleText && mainTitleText.length > 0) {
    const mainTitleNode = figma.createText();
    mainTitleNode.textStyleId = mainTitleTextStyle.id;
    mainTitleNode.characters = mainTitleText;
    mainTitleNode.name = 'chart-main-title';
    frame.insertChild(0, mainTitleNode);
    mainTitleNode.y = 5;
    verticalShift = verticalShift + 50;
  }

  if (subTitleText && subTitleText.length > 0) {
    const subTitleNode = figma.createText();
    subTitleNode.textStyleId = subTitleTextStyle.id;
    subTitleNode.characters = subTitleText;
    subTitleNode.name = 'chart-sub-title';
    frame.insertChild(0, subTitleNode);
    if (verticalShift > 0) subTitleNode.y = subTitleNode.y + verticalShift;
    verticalShift = verticalShift + 25;
  }
  return verticalShift;
};

const styleAxisText = frame => {
  // grab styles which we are going to apply
  const axisTitleTextStyle = chartTextStyles.find(style => style.name === 'VCC Plugin/TextStyles/Axis Titles');
  const axisLabelTextStyle = chartTextStyles.find(style => style.name === 'VCC Plugin/TextStyles/Axis Tick Labels');

  // axis labels
  // we should only do this if we have axis titles
  // all root text objects should be axis titles (if any)
  const axisTitleTextObjs = frame.findChildren(n => n.type === 'TEXT');
  axisTitleTextObjs.forEach(figmaObj => {
    if (figmaObj) {
      figmaObj.textStyleId = axisTitleTextStyle.id;
      figmaObj.name = 'axis-title';
    }
  });

  // x axis labels
  const figmaXAxisObj = frame.findOne(n => n.name === 'x-axis');
  if (figmaXAxisObj) {
    const figmaObjsX = figmaXAxisObj.findAllWithCriteria({ types: ['TEXT'] });
    if (figmaObjsX && figmaObjsX.length > 0) {
      figmaObjsX.forEach((textNode, i) => {
        try {
          textNode.textStyleId = axisLabelTextStyle.id;
          textNode.textAlignVertical = 'TOP';
          textNode.name = `x-axis-tick-${i}`;
        } catch (error) {
          console.log('error during axis lables', error);
        }
      });
    }
  }

  // y axis labels
  const figmaYAxisObj = frame.findOne(n => n.name === 'y-axis');
  if (figmaYAxisObj) {
    const figmaObjsY = figmaYAxisObj.findAllWithCriteria({ types: ['TEXT'] });
    if (figmaObjsY && figmaObjsY.length > 0) {
      figmaObjsY.forEach((textNode, i) => {
        try {
          textNode.textStyleId = axisLabelTextStyle.id;
          textNode.textAlignHorizontal = 'RIGHT';
          textNode.name = `y-axis-tick-${i}`;
        } catch (error) {
          console.log('error during axis lables', error);
        }
      });
    }
  }
};

const styleDataLabels = (frame, labelType) => {
  const dataLabelTextStyle = chartTextStyles.find(
    style => style.name === `VCC Plugin/TextStyles/${StartCase(labelType)} Labels`
  );

  const figmaDataLabelObj = frame.findOne(n => n.name === `${labelType}-labels`);
  // console.log('checking data lables', figmaDataLabelObj, dataLabelTextStyle);
  if (figmaDataLabelObj) {
    const figmaObjs = figmaDataLabelObj.findAllWithCriteria({ types: ['TEXT'] });
    if (figmaObjs && figmaObjs.length > 0) {
      figmaObjs.forEach((textNode, i) => {
        // console.log('setting text style', i, textNode, textNode.name, textNode.characters);
        try {
          textNode.textStyleId = dataLabelTextStyle.id;
          textNode.name = `${labelType}-label-${i}`;
          // this is an ugly hack to try and add an id to text
          // when copying text over from svg the name is set to the contents
          if (textNode.characters.indexOf('||') > -1) {
            textNode.deleteCharacters(0, textNode.characters.indexOf('||') + 2);
          }
        } catch (error) {
          console.log(`error during styling of ${labelType} lables`, error);
        }
      });
      // console.log(figmaObjs[0].textAlignHorizontal, figmaObjs[0].textAlignVertical);
    }
  }
};

const orderFigmaGroups = (msg, frame) => {
  if (msg && msg.chartConfig) {
    // first we sort the config
    // console.log('we are sorting', msg.chartConfig, frame);
    msg.chartConfig
      .sort((a, b) => a.order - b.order)
      .forEach(config => {
        const groupToSort = frame.findChild(n => {
          const nameCheck = config.figmaName ? config.figmaName : config.selectorVal;
          return n.name === nameCheck;
        });
        if (groupToSort && groupToSort.name) {
          // console.log('groupToSort', groupToSort, groupToSort.name, groupToSort.type);
          frame.insertChild(0, groupToSort);
        }
      });
  }
};

// clone marker to add center and outside strokes
const cloneMarker = (frame, i, strokeName, strokeAlign, strokeRadius) => {
  let original = frame.findOne(n => n.name === i.id);
  let clone = original.clone();
  clone.fills = []; // we can just wipe out the fill for the clones
  clone.x = original.x;
  clone.y = original.y;
  updateStrokes(frame, i, strokeName, strokeAlign, strokeRadius, true, clone);
};

// stroke update function
const updateStrokes = (frame, i, strokeName, strokeAlign, strokeRadius, isClone, clone?) => {
  let figmaObj = !isClone ? frame.findOne(n => n.name === i.id) : clone;
  let stroke = i.strokes.filter(j => j.type === strokeName).length
    ? i.strokes.filter(j => j.type === strokeName)[0].color
    : null;
  let colorHex = i.strokes.filter(j => j.type === strokeName).length
    ? i.strokes.filter(j => j.type === strokeName)[0].colorHex || '#ffffff'
    : '#ffffff';

  // console.log('updating strokes', i, i.strokes, i.fills, strokeName, strokeAlign, isClone, figmaObj, stroke);
  if (stroke) {
    // if the stroke doesn't have a style yet, make one
    const strokeStyleName = `VCC Plugin/PaintStyles/Data/Strokes/${colorHex}`;
    const strokeStyleId = checkFigmaPaintStyleExistsByName(strokeStyleName);
    if (!strokeStyleId) {
      const newStyle = figma.createPaintStyle();
      newStyle.paints = [{ type: 'SOLID', color: stroke }];
      newStyle.name = strokeStyleName;
      figmaObj.strokeStyleId = newStyle.id;
    } else {
      figmaObj.strokeStyleId = strokeStyleId;
    }

    // we could use plugin data to set order, name, etc if it is helpful?
    figmaObj.setPluginData('strokeName', strokeName);
    figmaObj.setPluginData('strokeColor', colorHex);
    figmaObj.setPluginData('strokeOrder', (strokeConfig[strokeName].order || 1).toString());
    figmaObj.strokeAlign = strokeAlign;
    figmaObj.strokeWeight = strokeRadius;

    // now we can transform fills over to styles as well
    if (figmaObj.fills && figmaObj.fills.length > 0) {
      figmaObj.fills.forEach(fill => {
        const fillHex = figmaRGBToHex(fill.color) || '#ffffff';
        const fillStyleName = `VCC Plugin/PaintStyles/Data/Fills/${fillHex}`;
        const fillStyleId = checkFigmaPaintStyleExistsByName(fillStyleName);

        if (!fillStyleId) {
          const newStyle = figma.createPaintStyle();
          newStyle.paints = [fill];
          newStyle.name = fillStyleName;
          figmaObj.fillStyleId = newStyle.id;
        } else {
          figmaObj.fillStyleId = fillStyleId;
        }
      });
    }
    // const fillHex =
    // const fillStyleName =
  }
};

const applyOpacity = (frame, strokeConfig) => {
  const figmaObj = frame.findOne(n => n.name === strokeConfig.id);
  // console.log('appying opacity', strokeConfig, figmaObj.opacity);
  if ((strokeConfig.opacity || strokeConfig.opacity === 0) && strokeConfig.opacity < 1 && figmaObj)
    figmaObj.opacity = strokeConfig.opacity;
};

const strokeConfig = {
  'clip-path-inside-hover': { placement: 'INSIDE', clone: false, strokeWeightModifier: 0, order: 5 },
  'clean-color': { placement: 'INSIDE', clone: false, strokeWeightModifier: 1, order: 4 },
  'edge-color': { placement: 'INSIDE', clone: true, strokeWeightModifier: 1, order: 2 },
  'primary-color': { placement: 'INSIDE', clone: true, strokeWeightModifier: 1, order: 3 },
  'outside-color': { placement: 'OUTSIDE', clone: true, strokeWeightModifier: 0, order: 1 },
  'outside-color-stacked': { placement: 'CENTER', clone: true, strokeWeightModifier: 1, order: 1 },
  whiteTextFlood: { placement: 'OUTSIDE', clone: true, strokeWeightModifier: 0, order: 1 },
  'direct-marker-color': { placement: 'CENTER', clone: false, strokeWeightModifier: 0, order: 2 }
};

const chartTextStyles = [];

// we kick off of the plugin without the ui shoing
figma.showUI(__html__, {
  height: 600,
  width: 700,
  visible: false
});

figma.ui.onmessage = async msg => {
  let closePlugin = false;
  // console.log(msg.type);

  switch (msg.type) {
    case 'draw-legend': {
      figma.createNodeFromSvg(msg.svgText);
      break;
    }
    case 'show-ui': {
      figma.ui.show();
      createChartTextStyles().map(style => {
        chartTextStyles.push(style);
      });
      break;
    }
    case 'close-plugin': {
      figma.closePlugin();
      break;
    }
    case 'ui-loaded': {
      // console.log('ui-loaded', msg);
      break;
    }
    case 'fetch-fonts': {
      await loadFontsAsyncHardCoded();
      // console.log('fetch fonts', msg);
      break;
    }
    case 'draw-chart': {
      try {
        // chart svg --> figma
        const frame = figma.createNodeFromSvg(msg.svgText);
        frame.name = msg.chartName;
        // @ts-ignore // need to ignore ts error for children
        figma.ungroup(frame.children[0].children[0]); // removes padding container
        // @ts-ignore // need to ignore ts error for children
        figma.ungroup(frame.children[0]); // removes margin container
        // console.log('checking frame', frame, frame.children, msg, orderFigmaGroups, updateStrokes);

        // add strokes to markers, group, rename
        msg.markerStrokes.forEach(i => {
          // console.log('checking markerStrokes', i, msg.markerStrokes, msg);
          applyOpacity(frame, i);
          i.strokes.forEach(stroke => {
            // console.log('checking the stroke object', stroke, strokeConfig[stroke.type]);
            // not sure if this will work for markers yet, probably have to apply this before the rest of this code though
            // applyOpacity(i);

            strokeConfig[stroke.type].clone
              ? cloneMarker(
                  frame,
                  i,
                  stroke.type,
                  strokeConfig[stroke.type].placement,
                  stroke.radius + strokeConfig[stroke.type].strokeWeightModifier
                )
              : updateStrokes(
                  frame,
                  i,
                  stroke.type,
                  strokeConfig[stroke.type].placement,
                  stroke.radius + strokeConfig[stroke.type].strokeWeightModifier,
                  strokeConfig[stroke.type].clone
                );
          });

          const markers = figma.currentPage.findAll(n => n.name === i.id);
          figma.group(markers, frame);
          markers[0].parent.name = 'marker-group';
          markers[0].parent['expanded'] = false;
          markers.sort(
            (a, b) => parseFloat(a.getPluginData('strokeOrder')) - parseFloat(b.getPluginData('strokeOrder'))
          );
          markers.forEach(j => {
            // console.log('checking plugin data', j, j.name, j.getPluginData('strokeName'), j.getPluginData('strokeColor'));
            const calcedName = `${j.getPluginData('strokeName')}-${j.getPluginData('strokeColor')}`;
            j.name = calcedName === '-' ? 'data-marker' : calcedName;
            j.parent.insertChild(0, j);
          });

          // group marker-groups
          const markerGroups = frame.findAll(n => n.name === 'marker-group');
          figma.group(markerGroups, frame);
          markerGroups[0].parent.name = 'data-markers';
          markerGroups[0].parent['expanded'] = false;
          // console.log('checking markers', markers);
        });

        // add strokes to data labels
        msg.textStrokes.forEach(i => {
          updateStrokes(frame, i, 'whiteTextFlood', 'OUTSIDE', 1, false); // default text stroke to weight of 1 for now
          applyOpacity(frame, i);
          // we don't need to change any group names, that is done by the config passed into ui.tsx
        });

        // add strokes to series labels
        msg.seriesTextStrokes.forEach(i => {
          updateStrokes(frame, i, 'whiteTextFlood', 'OUTSIDE', 1, false); // default text stroke to weight of 1 for now
          applyOpacity(frame, i);
        });

        // this doesn't do anything useful (yet)
        // const figmaLineGroup = frame.findOne(n => n.name === 'data-lines');
        // if (figmaLineGroup) {
        //   figmaLineGroup.findAll(n => n.type === 'VECTOR').forEach(line => {
        //     console.log('updating stroke for line', line);
        //     updateStrokes(frame, line, 'line-color', line.strokeAlign, line.strokeWeight, false);
        //   })
        // }

        // LEFT OFF HERE TRYING TO ORDER THE GROUPS IN FIGMA FRAME
        // cannot get code to recognize this function so putting code here for now
        // console.log('ordering');
        orderFigmaGroups(msg, frame);

        // we can apply some basic styles to axis titles and labels
        // console.log('style labels');

        // we should only use this if we have axis in our config
        // this errors on charts without axis, need to add handling for that still
        // styleAnnotationText(frame); // when built, this function will style annotation titles, text and reference text
        styleAxisText(frame);
        styleDataLabels(frame, 'data');
        styleDataLabels(frame, 'highlight'); // highlight label for pie-chart
        styleDataLabels(frame, 'center'); // highlight label for pie-chart
        styleDataLabels(frame, 'series');
        styleDataLabels(frame, 'total');

        // create everything into chart-container group
        figma.group(frame.children, frame);
        const chartContainer = frame.findChild(n => n.type === 'GROUP');
        chartContainer.name = 'chart-container';

        // may need to adjust placement of things vertically within the frame at some point

        // add main and sub titles
        // const chartContainerHeight = chartContainer.height;
        const verticalShift = createChartTitles(msg, frame);
        let legendShift = 0;

        // legend svg --> figma
        if (msg && msg.legendSVGText) {
          const legendFrame = figma.createNodeFromSvg(msg.legendSVGText).findChild(n => n.type === 'GROUP');
          // @ts-ignore // need to ignore ts error for children
          figma.ungroup(legendFrame.parent);
          // legendFrame.name = 'legend-container';
          legendFrame.y = legendFrame.y + (verticalShift - 10);
          frame.insertChild(frame.children.length, legendFrame);
          if (legendFrame.visible) legendShift = legendShift + legendFrame.height + 15;

          // add strokes to legend labels
          msg.legendTextStrokes.forEach(i => {
            updateStrokes(frame, i, 'whiteTextFlood', 'OUTSIDE', 1, false); // default text stroke to weight of 1 for now
            applyOpacity(frame, i);
          });

          // style legend labels
          styleDataLabels(frame, 'legend');
        }

        // resize frame and shift chart container based on titles and legend and margin and padding
        frame.resizeWithoutConstraints(frame.width, frame.height + verticalShift + legendShift + 25);
        chartContainer.y = chartContainer.y + verticalShift + legendShift;

        // TESTING AREA
        // IF WE WANT TO ASSING STYLES TO THE ELEMENTS IN THE PLUGIN WE NEED TO SOMEHOW ACCESS
        // THE LIBRARY STYLES FROM VPDS AND DX IN ORDER TO DO THIS... TBD FOR NOW
        // console.log('local text styles', figma.getLocalTextStyles(), figma.getLocalPaintStyles());

        figma.ui.postMessage({ type: 'chart-deployed-to-figma', payload: 'success' });
      } catch {
        figma.ui.postMessage({ type: 'chart-deployed-to-figma', payload: 'error' });
      }
      // console.log('set close plugin');
      // closePlugin = true;
      break;
    }
    default:
      closePlugin = true;
      break;
  }
  // console.log('checking close plugin', closePlugin);
  if (closePlugin) figma.closePlugin();
  // });
};
