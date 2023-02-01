/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import 'react-app-polyfill/stable';
import React, { useState, useEffect, useCallback } from 'react';
import { render } from 'react-dom';
import { rgb, color } from 'd3-color';
import { extent } from 'd3-array';
import DisplayChart from './DisplayChart';
import ChartCards from './chart-cards';
import RecipeCards from './recipe-cards';
import { chartGroups } from './utils/constants';

import './ui.css';

type CustomProps = {};

const getBoundingClientRectObject = element => {
  const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect();
  return { top, right, bottom, left, width, height, x, y };
};

const calculateNestedOpacity = el => {
  let resultingOpacity = 1;
  for (; el && el.nodeName !== 'svg'; ) {
    // console.log('checking opacity for', el, el.getAttribute('opacity'))
    if (el.getAttribute('opacity') && parseFloat(el.getAttribute('opacity')) < resultingOpacity) {
      resultingOpacity = parseFloat(el.getAttribute('opacity'));
    } else if (el.getAttribute('stroke-opacity') && parseFloat(el.getAttribute('stroke-opacity')) < resultingOpacity) {
      resultingOpacity = parseFloat(el.getAttribute('stroke-opacity'));
    }
    el = el.parentElement;
  }
  return resultingOpacity;
};

// class App extends React.Component {
const App: React.FunctionComponent<CustomProps> = () => {
  const [level1, setLevel1] = useState();
  const [level2, setLevel2] = useState();
  const [chartProps, setChartProps] = useState({});
  const [chartConfig, setChartConfig] = useState([]);
  const [createDisabled, setCreateDisabled] = useState(false);
  // const [chartProcessingResult, setChartProcessingResult] = useState('Processing');

  useEffect(() => {
    // once the plugin loads we are going to fetch fonts async
    // this is so we can assign them later on
    parent.postMessage(
      {
        pluginMessage: {
          type: 'fetch-fonts'
        }
      },
      'https://www.figma.com'
    );
    // add event listener for messages
    window.addEventListener('message', handleMessage);

    // on unmount, clean up event listener
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleMessage = e => {
    // console.log('ui message event', e, e.data);
    if (!e.data.pluginMessage) return;
    const { type = null } = e.data.pluginMessage; // payload = null
    switch (type) {
      case 'figma-message': {
        break;
      }
      case 'receive-fonts': {
        // const { fonts } = payload;
        // console.log('fonts received', fonts);
        parent.postMessage(
          {
            pluginMessage: {
              type: 'show-ui'
            }
          },
          'https://www.figma.com'
        );
        break;
      }
      case 'chart-deployed-to-figma': {
        // console.log('chart deploy completed', e.data.pluginMessage);
        setTimeout(() => {
          setCreateDisabled(false);
        }, 500);
        break;
      }
      default:
        break; // Do nothing
    }
  };

  const randomizeData = useCallback(
    level2 => {
      let dataExtent, newData;

      switch (level2.chart) {
        case 'alluvial-diagram':
          dataExtent = extent(level2.linkData, d =>
            d[`orig-${level2.valueAccessor}`] ? d[`orig-${level2.valueAccessor}`] : d[level2.valueAccessor]
          );
          newData = level2.linkData.map(d => ({
            ...d,
            [`orig-${level2.valueAccessor}`]: d[`orig-${level2.valueAccessor}`]
              ? d[`orig-${level2.valueAccessor}`]
              : d[level2.valueAccessor],
            [level2.valueAccessor]: dataExtent[0] + (dataExtent[1] - dataExtent[0]) * Math.random()
          }));
          setLevel2({ ...level2, linkData: newData });
          break;
        case 'scatter-plot':
          dataExtent = [
            extent(level2.data, d =>
              d[`orig-${level2.xAccessor}`] ? d[`orig-${level2.xAccessor}`] : d[level2.xAccessor]
            ),
            extent(level2.data, d =>
              d[`orig-${level2.yAccessor}`] ? d[`orig-${level2.yAccessor}`] : d[level2.yAccessor]
            )
          ];
          newData = level2.data.map(d => ({
            ...d,
            [`orig-${level2.xAccessor}`]: d[`orig-${level2.xAccessor}`]
              ? d[`orig-${level2.xAccessor}`]
              : d[level2.xAccessor],
            [level2.xAccessor]: dataExtent[0][0] + (dataExtent[0][1] - dataExtent[0][0]) * Math.random(),
            [`orig-${level2.yAccessor}`]: d[`orig-${level2.yAccessor}`]
              ? d[`orig-${level2.yAccessor}`]
              : d[level2.yAccessor],
            [level2.yAccessor]: dataExtent[1][0] + (dataExtent[1][1] - dataExtent[1][0]) * Math.random()
          }));
          setLevel2({ ...level2, data: newData });
          break;
        case 'circle-packing':
          dataExtent = extent(level2.data, d =>
            d[`orig-${level2.sizeAccessor}`] ? d[`orig-${level2.sizeAccessor}`] : d[level2.sizeAccessor]
          );
          newData = level2.data.map(d => ({
            ...d,
            [`orig-${level2.sizeAccessor}`]: d[`orig-${level2.sizeAccessor}`]
              ? d[`orig-${level2.sizeAccessor}`]
              : d[level2.sizeAccessor],
            [level2.sizeAccessor]: dataExtent[0] + (dataExtent[1] - dataExtent[0]) * Math.random()
          }));
          setLevel2({ ...level2, data: newData });
          break;
        default:
          dataExtent = extent(level2.data, d =>
            d[`orig-${level2.valueAccessor}`] ? d[`orig-${level2.valueAccessor}`] : d[level2.valueAccessor]
          );
          newData = level2.data.map(d => ({
            ...d,
            [`orig-${level2.valueAccessor}`]: d[`orig-${level2.valueAccessor}`]
              ? d[`orig-${level2.valueAccessor}`]
              : d[level2.valueAccessor],
            [level2.valueAccessor]: dataExtent[0] + (dataExtent[1] - dataExtent[0]) * Math.random()
          }));
          setLevel2({ ...level2, data: newData });
      }
      // console.log('we are in random data and valueAccessor', level2);
    },
    [level2]
  );

  useEffect(() => {
    const chartTag = chartProps['chart'];
    if (chartProps && Object.keys(chartProps).length > 0 && chartGroups && chartTag) {
      setChartConfig(chartGroups[chartTag][chartProps['layout'] ? chartProps['layout'] : 'default']);
      // console.log('we are checking chartTag and props', chartTag, chartProps, chartConfig);
    }
  }, [chartProps]);

  const cleanUpSVG = () => {
    const innerCleanUp = grp => {
      const innerConfig = grp || {};
      // console.log('we are in innerCleanUp', grp, innerConfig, chartConfig);
      const elArray =
        innerConfig && innerConfig.selector
          ? document.querySelectorAll(`[${innerConfig.selector}=${innerConfig.selectorVal}]`)
          : document.querySelectorAll(`${innerConfig.selectorVal}`);
      // console.log('we are in svg clean up', elArray);
      if (elArray && elArray.length > 0) {
        elArray.forEach(el => {
          if (innerConfig.remove) {
            el.remove();
          } else {
            if (innerConfig.addID) {
              el.setAttribute('id', innerConfig.figmaName ? innerConfig.figmaName : innerConfig.selectorVal);
            }
            if (innerConfig.translateCSS && innerConfig.cssStylesToCopy && innerConfig.cssStylesToCopy.length > 0) {
              // console.log('we should translateCSS for', innerConfig.id);
              innerConfig.cssStylesToCopy.forEach(style => {
                // console.log(style, el, window.getComputedStyle(el)[style]);
                el.setAttribute(style, window.getComputedStyle(el)[style]);
                // const tmp = el.getAttributeNames();
                // tmp.forEach(attr => console.log(attr, el.getAttribute(attr)));
              });
            }
          }
        });
      }

      // recursively call clean up if the innerConfig has children to target
      if (innerConfig.children && innerConfig.children.length > 0) {
        // console.log('calling clean up recursively', innerConfig.children);
        innerConfig.children.forEach(child => innerCleanUp(child));
      }
    };
    // loop through chart specific configs to adjust specific groups based on the chart
    // worried about the maintenance of this constants file though
    // console.log('checking chartConfig', chartConfig, Object.keys(chartConfig));
    chartConfig.forEach(grp => {
      // we need to sort out how to handle children groups when necessary
      // grid-group -> grid-left -> ... line for css style
      // if ( grp && grp['children'] && grp['children'].length ) {
      innerCleanUp(grp);

      // }
    });
  };

  // in doc selection
  const onBack = level => {
    switch (level) {
      case 'level2':
        setLevel2(null);
        break;
      case 'level1':
        setLevel1(null);
        setLevel2(null);
        break;
      default:
        break;
      // do nothing
    }
  };

  const onCreateClicked = () => {
    setCreateDisabled(true);
  };

  useEffect(() => {
    // console.log('we are in the createDisabled useEffect', createDisabled);
    if (createDisabled) setTimeout(() => onCreate(), 250);
  }, [createDisabled]);

  const onCreate = () => {
    // before we take snapshot of the chart, we need to add some ids for use on figma side
    if (level1) cleanUpSVG();

    // hex in filters to rgb for figma
    function hexToRGB(hex) {
      const rColor = rgb(hex);

      return {
        r: rColor.r / 255,
        g: rColor.g / 255,
        b: rColor.b / 255
      };
    }

    // get filter ids
    const filter_ids = [];
    Array.from(document.querySelectorAll('filter')).forEach(i => {
      filter_ids.push(i.getAttribute('id'));
    });

    // compile strokes by filter id
    const strokes = [];
    filter_ids.forEach(i => {
      const el = Array.from(document.querySelectorAll(`#${i} feFlood`));
      const mrph = Array.from(document.querySelectorAll(`#${i} feMorphology`));
      const els = [];
      el.forEach((j, idx) => {
        els.push({
          floodColor: j.attributes['flood-color']['value'],
          result: j.attributes['result']['value'],
          radius: mrph[idx].attributes['radius']['value'] * 1
        });
      });
      strokes.push({
        id: i,
        strokes: els
      });
    });

    // connect filter strokes to marker ids
    const markerStrokes = [];
    ['bar', 'pie', 'marker', 'circle', 'link'].forEach(mark => {
      if (Array.from(document.querySelectorAll(`[data-testid=${mark}]`)).length) {
        Array.from(document.querySelectorAll(`[data-testid=${mark}]`)).forEach((i, iIndex) => {
          const strokeColor = i.getAttribute('stroke');
          const strokeInfo = strokes.filter(
            j => i.getAttribute('filter') && i.getAttribute('filter').indexOf(j.id) > 0
          )[0];
          // console.log(
          //   'checking marker strokes',
          //   iIndex,
          //   i,
          //   strokeInfo,
          //   i.getAttribute('class'),
          //   i.getAttribute('data-testid'),
          //   document.querySelectorAll(`[data-testid=${mark}]`)
          // );

          // we need to check if this is the clip path rectangle situation...
          if (i.classList && i.classList.contains('vcl-accessibility-focus-hover')) {
            // we have found a cloned element for hover stroke
            // need to get stroke color from style instead of attribute for these
            const clipStrokeColor = i['style'] && i['style']['stroke'] && color(i['style']['stroke']).formatHex();
            if (
              i.getAttribute('clip-path') &&
              clipStrokeColor &&
              markerStrokes.filter(s => s.id === i.getAttribute('id')).length === 0
            ) {
              markerStrokes.push({
                id: i.getAttribute('id'),
                num: iIndex,
                opacity: calculateNestedOpacity(i),
                filter: null,
                strokes: [
                  {
                    type: 'clip-path-inside-hover',
                    color: hexToRGB(clipStrokeColor),
                    colorHex: clipStrokeColor,
                    radius: 2 // parseFloat(i['style']['stroke-width']) / 2 || '2' // we can maybe hard code this 2 for now?
                  }
                ]
              });
            } else i.remove(); // if it is the clip path element we can just get rid of it.
          } else if (strokeInfo && Object.keys(strokeInfo).length > 0) {
            strokeInfo.strokes.forEach(k => (k.rgb = hexToRGB(k.floodColor)));
            markerStrokes.push({
              id: i.getAttribute('id'),
              num: iIndex,
              opacity: calculateNestedOpacity(i),
              filter: strokeInfo.id,
              strokes: strokeColor
                ? [
                    {
                      type: 'direct-marker-color',
                      color: hexToRGB(strokeColor),
                      colorHex: strokeColor,
                      radius: parseFloat(i.getAttribute('stroke-width') || '1')
                    },
                    ...strokeInfo.strokes.map(l => {
                      return l.result === 'outside-color' && (level1 === 'stacked-bar-chart' || level1 === 'pie-chart')
                        ? { type: `${l.result}-stacked`, color: l.rgb, colorHex: l.floodColor, radius: l.radius }
                        : { type: l.result, color: l.rgb, colorHex: l.floodColor, radius: l.radius };
                    })
                  ]
                : [
                    ...strokeInfo.strokes.map(l => {
                      return l.result === 'outside-color' && (level1 === 'stacked-bar-chart' || level1 === 'pie-chart')
                        ? { type: `${l.result}-stacked`, color: l.rgb, colorHex: l.floodColor, radius: l.radius }
                        : { type: l.result, color: l.rgb, colorHex: l.floodColor, radius: l.radius };
                    })
                  ]
            });
            // });
          } else {
            // need to handle if we don't have a filter
            markerStrokes.push({
              id: i.getAttribute('id'),
              num: iIndex,
              opacity: calculateNestedOpacity(i),
              filter: null,
              strokes: [
                {
                  type: 'direct-marker-color',
                  color: hexToRGB(strokeColor),
                  colorHex: strokeColor,
                  radius: parseFloat(i.getAttribute('stroke-width') || '1')
                }
              ]
            });
          }
        });
      }
    });

    // connect filter strokes to data labels
    const textStrokes = [];
    Array.from(document.querySelectorAll(`[data-testid=dataLabel]`)).forEach((i, iIndex) => {
      // for text if we don't find a filter we will check two parents which could also have filter def in VCC
      const strokeInfo = i.getAttribute('filter')
        ? strokes.filter(j => i.getAttribute('filter') && i.getAttribute('filter').indexOf(j.id) > 0)[0]
        : i.parentElement && i.parentElement.nodeName === 'g' && i.parentElement.getAttribute('filter')
        ? strokes.filter(
            j => i.parentElement.getAttribute('filter') && i.parentElement.getAttribute('filter').indexOf(j.id) > 0
          )[0]
        : i.parentElement.parentElement &&
          i.parentElement.parentElement.nodeName === 'g' &&
          i.parentElement.parentElement.getAttribute('filter')
        ? strokes.filter(
            j =>
              i.parentElement.parentElement.getAttribute('filter') &&
              i.parentElement.parentElement.getAttribute('filter').indexOf(j.id) > 0
          )[0]
        : undefined;

      if (strokeInfo && Object.keys(strokeInfo).length > 0) {
        // console.log('checking text strokes', iIndex, i, strokeInfo);
        strokeInfo.strokes.forEach(k => (k.rgb = hexToRGB(k.floodColor)));
        // const origHTML = i.innerHTML;
        i.innerHTML = `${iIndex}||${i.innerHTML}`; // add num to innerHTML so we can select text in Figma
        textStrokes.push({
          id: i.innerHTML,
          num: iIndex,
          opacity: calculateNestedOpacity(i),
          filter: strokeInfo.id,
          strokes: strokeInfo.strokes.map(l => {
            return { type: l.result, color: l.rgb, colorHex: l.floodColor };
          })
        });
        // i.innerHTML = origHTML;
      }
    });

    const legendTextStrokes = [];
    Array.from(document.querySelectorAll('[data-testid=legend-container] text')).forEach((i, iIndex) => {
      // for text if we don't find a filter we will check two parents which could also have filter def in VCC
      const strokeInfo = i.getAttribute('filter')
        ? strokes.filter(j => i.getAttribute('filter') && i.getAttribute('filter').indexOf(j.id) > 0)[0]
        : i.parentElement && i.parentElement.nodeName === 'g' && i.parentElement.getAttribute('filter')
        ? strokes.filter(
            j => i.parentElement.getAttribute('filter') && i.parentElement.getAttribute('filter').indexOf(j.id) > 0
          )[0]
        : i.parentElement.parentElement &&
          i.parentElement.parentElement.nodeName === 'g' &&
          i.parentElement.parentElement.getAttribute('filter')
        ? strokes.filter(
            j =>
              i.parentElement.parentElement.getAttribute('filter') &&
              i.parentElement.parentElement.getAttribute('filter').indexOf(j.id) > 0
          )[0]
        : undefined;

      if (strokeInfo && Object.keys(strokeInfo).length > 0) {
        // console.log('checking text strokes', iIndex, i, strokeInfo);
        strokeInfo.strokes.forEach(k => (k.rgb = hexToRGB(k.floodColor)));
        i.innerHTML = `${iIndex}||${i.innerHTML}`; // add num to innerHTML so we can select text in Figma
        legendTextStrokes.push({
          id: i.innerHTML,
          num: iIndex,
          opacity: calculateNestedOpacity(i),
          filter: strokeInfo.id,
          strokes: strokeInfo.strokes.map(l => {
            return { type: l.result, color: l.rgb, colorHex: l.floodColor };
          })
        });
      }
    });

    // connect filter strokes to data labels
    const seriesLabelMap = {
      'line-chart': 'line-series-label',
      'parallel-plot': 'parallel-series-label'
    };

    const seriesTextStrokes = [];
    if (level1)
      Array.from(document.querySelectorAll(`[data-testid=${seriesLabelMap[level1]}]`)).forEach((i, iIndex) => {
        // for text if we don't find a filter we will check two parents which could also have filter def in VCC
        const strokeInfo = i.getAttribute('filter')
          ? strokes.filter(j => i.getAttribute('filter') && i.getAttribute('filter').indexOf(j.id) > 0)[0]
          : i.parentElement && i.parentElement.nodeName === 'g' && i.parentElement.getAttribute('filter')
          ? strokes.filter(
              j => i.parentElement.getAttribute('filter') && i.parentElement.getAttribute('filter').indexOf(j.id) > 0
            )[0]
          : i.parentElement.parentElement &&
            i.parentElement.parentElement.nodeName === 'g' &&
            i.parentElement.parentElement.getAttribute('filter')
          ? strokes.filter(
              j =>
                i.parentElement.parentElement.getAttribute('filter') &&
                i.parentElement.parentElement.getAttribute('filter').indexOf(j.id) > 0
            )[0]
          : undefined;

        if (strokeInfo && Object.keys(strokeInfo).length > 0) {
          // console.log('checking text strokes', iIndex, i, strokeInfo);
          strokeInfo.strokes.forEach(k => (k.rgb = hexToRGB(k.floodColor)));
          i.innerHTML = `${iIndex}||${i.innerHTML}`; // add num to innerHTML so we can select text in Figma
          seriesTextStrokes.push({
            id: i.innerHTML,
            num: iIndex,
            opacity: calculateNestedOpacity(i),
            filter: strokeInfo.id,
            strokes: strokeInfo.strokes.map(l => {
              return { type: l.result, color: l.rgb, colorHex: l.floodColor };
            })
          });
        }
      });

    // pull chart svg from DOM for passing to figma
    const rootChart = document.querySelector('.chart-created');
    const chartSVG = rootChart.querySelector('[data-testid=root-svg]');
    const chartString = chartSVG.outerHTML;
    const legendSVG = rootChart.querySelector('[data-testid=legend-container');
    const legendString = legendSVG ? legendSVG.outerHTML : '';
    const mainTitle = rootChart.querySelector('[data-testid=main-title]').textContent;
    const subTitle = rootChart.querySelector('[data-testid=sub-title]').textContent;

    // console.log('chartString', chartSVG, chartProps, getBoundingClientRectObject(rootChart));

    // we could select the chart and grab all text and then revert if || is found as well
    // revert innerHTML text on data labels
    if (level1)
      Array.from(document.querySelectorAll(`[data-testid=dataLabel]`))
        .concat(Array.from(document.querySelectorAll('[data-testid=legend-container] text')))
        .concat(Array.from(document.querySelectorAll(`[data-testid=${seriesLabelMap[level1]}]`)))
        .forEach(i => {
          try {
            let iText = i.innerHTML;
            if (iText.lastIndexOf('||') > -1) {
              i.innerHTML = iText.substring(iText.lastIndexOf('||') + 2);
            }
          } catch (error) {
            console.log(`error during clean up of data labels`, error);
          }
        });

    // console.log('we are checking strokes', markerStrokes, textStrokes);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'draw-chart',
          svgText: chartString,
          markerStrokes: markerStrokes,
          textStrokes: textStrokes,
          seriesTextStrokes: seriesTextStrokes,
          legendTextStrokes: legendTextStrokes,
          chartName: level1,
          chartConfig: chartConfig,
          mainTitle: mainTitle,
          subTitle: subTitle,
          legendSVGText: legendString,
          boundingRect: getBoundingClientRectObject(rootChart),
          chartProps: {
            height: rootChart['height'],
            width: rootChart['width'],
            margin: rootChart['margin'],
            padding: rootChart['padding'],
            ...{ ...chartProps, data: [] } // we need to empty out data in case we made a js date in it
          }
        }
      },
      'https://www.figma.com'
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, 'https://www.figma.com');
  };

  // console.log('checking render', level1, level2, createDisabled);
  return level1 ? (
    level2 ? (
      <div>
        <h1>Change data, interact and Create Figma Chart</h1>
        <DisplayChart chartType={level1} recipe={level2} fullChart storePropsCallback={setChartProps} />
        <button id="back" onClick={_ => onBack('level2')}>
          Back to Chart Style
        </button>
        <button id="random" onClick={_ => randomizeData(level2)}>
          Randomize Data
        </button>
        <button id="create" onClick={onCreateClicked} disabled={createDisabled}>
          {createDisabled ? `Processing Chart ...` : `Create Chart`}
        </button>
        <button onClick={onCancel}>Close Plugin</button>
        {createDisabled && (
          <div className="busy-overlay">
            <div className="busy-spinner" />
            <h3 className="busy-text">Processing Chart ...</h3>
          </div>
        )}
      </div>
    ) : (
      <div>
        <h1>Pick a chart style</h1>
        <button id="back" onClick={_ => onBack('level1')}>
          Back to Chart Type
        </button>
        <RecipeCards chart={level1} level2Callback={setLevel2} />
      </div>
    )
  ) : (
    <div>
      <h1>Pick a chart type</h1>
      <ChartCards level1={level1} level1Callback={setLevel1} />
    </div>
  );
};

render(<App />, document.getElementById('react-page'));
