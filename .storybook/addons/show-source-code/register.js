/**
 * Copyright (c) 2022, 2023 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
import React, { useState } from 'react';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';
import { Source, AddonPanel } from '@storybook/components';
import { useArgs } from '@storybook/api';
import { STORY_RENDERED } from '@storybook/core-events';

const PanelWrapper = styled.div(({ theme }) => ({
  background: theme.background.content,
  padding: '2rem 20px',
  minHeight: '20vh',
  boxSizing: 'border-box'
}));

const PanelInner = styled.div({
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: '0 40px'
});

const ADDON_ID = 'show-source-code';
const PANEL_ID = `${ADDON_ID}/panel`;

const Panel = () => {
  const [args, _, __] = useArgs();
  const [storyID, setStoryID] = useState('bar-chart');
  const emitter = addons.getChannel();
  emitter.on(STORY_RENDERED, e => {
    if (e) {
      setStoryID(e.split('--')[0]);
    }
  });

  function formatter(args, n, src) {
    if ([1, 2].includes(n)) src = `this.props = {`;
    else if (n === 6) src = `const props = {`;
    else if (n === 3) src = `<${storyID}`;
    else if (n === 5)
      src += `import pyvisacharts as vcc\n\nvcc.${storyID
        .split('-')[0]
        .charAt(0)
        .toUpperCase() +
        storyID.split('-')[0].substring(1) +
        storyID
          .split('-')[1]
          .charAt(0)
          .toUpperCase() +
        storyID.split('-')[1].substring(1) +
        (storyID.split('-').length === 3
          ? storyID
              .split('-')[2]
              .charAt(0)
              .toUpperCase() + storyID.split('-')[2].substring(1)
          : '')}(`;
    Object.keys(args).forEach((i, j) => {
      if (
        !new RegExp('^on|Event$').test(i) &&
        (args[i].length || Object.keys(args[i]).length || ['number', 'boolean'].includes(typeof args[i]))
      ) {
        if (typeof args[i] === 'string') {
          src += `\n${'\t'.repeat(1)}${i.length > 1 ? `${i}${n === 3 ? '={' : n === 5 ? '=' : ': '}` : ''}"${args[i]
            .toLocaleString()
            .replace(/'/g, "\\'")}"${n === 3 ? '}' : ''}`;
        } else if (typeof args[i] === 'number') {
          src += `\n${'\t'.repeat(1)}${i}${n === 3 ? '={' : n === 5 ? '=' : ': '}${args[i]}${n === 3 ? '}' : ''}`;
        } else if (typeof args[i] === 'boolean') {
          src += `\n${'\t'.repeat(1)}${i}${n === 3 ? '={' : n === 5 ? '=' : ': '}${args[i].toLocaleString()}${
            n === 3 ? '}' : ''
          }`;
        } else if (args[i] === null) {
          src += `\n${'\t'.repeat(1)}"${i}": null`;
        } else if (typeof args[i] === 'object') {
          src += `\n${'\t'.repeat(1)}${
            args[i].length > 0 && ![3, 5].includes(n)
              ? `${i}: [`
              : [undefined, 0].includes(args[i].length) && ![3, 5].includes(n)
              ? `${i}: {`
              : args[i].length > 0 && n === 3
              ? `${i}={[`
              : args[i].length > 0 && n === 5
              ? `${i}=[`
              : [undefined, 0].includes(args[i].length) && n === 5
              ? `${i}={`
              : `${i}={{`
          }`;
          Object.keys(args[i]).forEach((l, m) => {
            if (typeof args[i][l] === 'string') {
              src += `\n${'\t'.repeat(2)}${l.length > 1 ? `"${l}": ` : ''}"${args[i][l]
                .toLocaleString()
                .replace(/'/g, "\\'")}"`;
            } else if (typeof args[i][l] === 'number') {
              src += `\n${'\t'.repeat(2)}"${l}": ${args[i][l]}`;
            } else if (typeof args[i][l] === 'boolean') {
              src += `\n${'\t'.repeat(2)}"${l}": ${
                n == 5
                  ? args[i][l]
                      .toLocaleString()
                      .charAt(0)
                      .toUpperCase() + args[i][l].toLocaleString().slice(1)
                  : args[i][l].toLocaleString()
              }`;
            } else if (args[i][l] === null) {
              src += `\n${'\t'.repeat(2)}"${l}": null`;
            } else if (typeof args[i][l] === 'object') {
              src += `\n${'\t'.repeat(2)}${!isNaN(l) ? '{' : '"' + l + '": ['}`;
              Object.keys(args[i][l]).forEach((a, b) => {
                if (typeof args[i][l][a] === 'string') {
                  src += `\n${'\t'.repeat(3)}${a.length > 0 && isNaN(a) ? `"${a}": ` : ''}"${args[i][l][a]
                    .toLocaleString()
                    .replace(/'/g, "\\'")}"`;
                } else if (typeof args[i][l][a] === 'number') {
                  src += `\n${'\t'.repeat(3)}"${a}": ${args[i][l][a]}`;
                } else if (typeof args[i][l][a] === 'boolean') {
                  src += `\n${'\t'.repeat(3)}"${a}": ${
                    n === 5
                      ? args[i][l][a]
                          .toLocaleString()
                          .charAt(0)
                          .toUpperCase() + args[i][l][a].toLocaleString().slice(1)
                      : args[i][l][a].toLocaleString()
                  }`;
                } else if (args[i][l][a] === null) {
                  src += `\n${'\t'.repeat(3)}"${a}": null`;
                } else if (typeof args[i][l][a] === 'object' && args[i][l][a] !== null) {
                  src += `\n${'\t'.repeat(3)}${
                    !isNaN(a) ? '{' : args[i][l][a].length > 0 ? '"' + a + '": [' : '"' + a + '": {'
                  }`;
                  Object.keys(args[i][l][a]).forEach((c, d) => {
                    if (typeof args[i][l][a][c] === 'string') {
                      src += `\n${'\t'.repeat(4)}${c.length > 0 && isNaN(c) ? `${c}: ` : ''}"${args[i][l][a][c]
                        .toLocaleString()
                        .replace(/'/g, "\\'")}"`;
                    } else if (typeof args[i][l][a][c] === 'number') {
                      src += `\n${'\t'.repeat(4)}${c.length > 0 && isNaN(c) ? `${c}: ` : ''}${args[i][l][a][c]}`;
                    } else if (typeof args[i][l][a][c] === 'boolean') {
                      src += `\n${'\t'.repeat(4)}${c}: ${
                        n === 5
                          ? args[i][l][a][c]
                              .toLocaleString()
                              .charAt(0)
                              .toUpperCase() + args[i][l][a][c].toLocaleString().slice(1)
                          : args[i][l][a][c].toLocaleString()
                      }`;
                    } else if (args[i][l][a][cancelIdleCallback] === null) {
                      src += `\n${'\t'.repeat(4)}"${c}": null`;
                    } else if (typeof args[i][l][a][c] === 'object') {
                      src += `\n${'\t'.repeat(4)}${
                        !isNaN(c) ? '{' : args[i][l][a][c].length > 0 ? c + ': [' : c + ': {'
                      }`;
                      Object.keys(args[i][l][a][c]).forEach((e, f) => {
                        if (typeof args[i][l][a][c][e] === 'string') {
                          src += `\n${'\t'.repeat(5)}${e.length > 0 && isNaN(e) ? `${e}: ` : ''}'${args[i][l][a][c][e]
                            .toLocaleString()
                            .replace(/'/g, "\\'")}'`;
                        } else if (typeof args[i][l][a][c][e] === 'number') {
                          src += `\n${'\t'.repeat(5)}${e}: ${args[i][l][a][c][e]}`;
                        } else if (typeof args[i][l][a][c][e] === 'boolean') {
                          src += `\n${'\t'.repeat(5)}${e}: ${
                            n === 5
                              ? args[i][l][a][c][e]
                                  .toLocaleString()
                                  .charAt(0)
                                  .toUpperCase() + args[i][l][a][c][e].toLocaleString().slice(1)
                              : args[i][l][a][c][e].toLocaleString()
                          }`;
                        }
                        if (f !== Object.keys(args[i][l][a][c]).length - 1) {
                          src += `,`;
                        }
                      });
                      src += `\n${'\t'.repeat(4)}${!isNaN(c) ? '}' : args[i][l][a][c].length > 0 ? ']' : '}'}`;
                    }
                    if (d !== Object.keys(args[i][l][a]).length - 1) {
                      src += `,`;
                    }
                  });
                  src += `\n${'\t'.repeat(3)}${!isNaN(a) ? '}' : args[i][l][a].length > 0 ? ']' : '}'}`;
                }
                if (b !== Object.keys(args[i][l]).length - 1) {
                  src += `,`;
                }
              });
              src += `\n${'\t'.repeat(2)}${!isNaN(l) ? '}' : ']'}`;
            }
            if (m !== Object.keys(args[i]).length - 1) {
              src += `,`;
            }
          });
          src += `\n${'\t'.repeat(1)}${args[i].length > 0 ? ']' : '}'}${n === 3 ? '}' : ''}`;
        }
        if (n !== 3 && j !== Object.keys(args).length - 1) {
          src += `,`;
        }
      }
    });
    src = src.slice(-1) === ',' ? src.slice(0, -1) : src;
    if (n === 1) {
      src += `\n}\n\n`;
      src += `<${storyID.charAt(0).toUpperCase() +
        storyID.split('-')[0].slice(1) +
        storyID
          .split('-')[1]
          .charAt(0)
          .toUpperCase() +
        storyID.split('-')[1].slice(1) +
        (storyID.split('-').length === 3
          ? storyID
              .split('-')[2]
              .charAt(0)
              .toUpperCase() + storyID.split('-')[2].slice(1)
          : '')} {...this.props} />`;
    } else if (n === 2) {
      src += `\n}\n\n`;
      src += `<${storyID}`;
      Object.keys(args).forEach(i => {
        if (!new RegExp('^on|Event$').test(i) && (args[i].length || Object.keys(args[i]).length)) {
          src += `\n\t[${i}]="props.${i}"`;
        }
      });
      src += `\n></${storyID}>`;
    } else if (n === 3) {
      src += `\n/>`;
    } else if (n === 6) {
      src += `\n}\n\n`;
      src += `<${storyID.charAt(0).toUpperCase() +
        storyID.split('-')[0].slice(1) +
        storyID
          .split('-')[1]
          .charAt(0)
          .toUpperCase() +
        storyID.split('-')[1].slice(1) +
        (storyID.split('-').length === 3
          ? storyID
              .split('-')[2]
              .charAt(0)
              .toUpperCase() + storyID.split('-')[2].slice(1)
          : '')} v-bind="props" />`;
    }
    return src;
  }

  let src1 = '';
  src1 += formatter(args, 1, src1);

  let src2 = '';
  src2 += formatter(args, 2, src2);

  let src3 = '';
  src3 += formatter(args, 3, src3);

  let src4 = `library(visachartR)\nlibrary(jsonlite)\nlibrary(dplyr)\n\n`;
  src4 += `data <- fromJSON('${JSON.stringify(args['data'] || args['linkData'])}')\n`;

  let exclusions =
    '^on|Event$|accessibility|uniqueID|[a-z].*Accessor|[a-z].*Title|data|[a-z].*Data|height|width|interactionKeys';

  function listify(key, depth) {
    let z = 0;
    src4 += `\n${'\t'.repeat(depth)}${key} = list(`;
    Object.keys(args[key]).forEach((i, j) => {
      if (typeof args[key][i] === 'string') {
        src4 += `\n${'\t'.repeat(depth + 1)}${i.length > 1 ? `${i}=` : ''}'${args[key][i]
          .toLocaleString()
          .replace(/'/g, "\\'")}'`;
      } else if (typeof args[key][i] === 'number' || args[key][i] === null) {
        src4 += `\n${'\t'.repeat(depth + 1)}${i}=${args[key][i]}`;
      } else if (typeof args[key][i] === 'boolean') {
        src4 += `\n${'\t'.repeat(depth + 1)}${i}=${args[key][i].toLocaleString().toUpperCase()}`;
      } else if (typeof args[key][i] === 'object') {
        src4 += `\n${'\t'.repeat(depth + 1)}${i.length > 1 ? `${i} = ` : ''}list(`;
        Object.keys(args[key][i]).forEach((l, m) => {
          if (typeof args[key][i][l] === 'string') {
            src4 += `\n${'\t'.repeat(depth + 2)}${l.length > 1 ? `${l}=` : ''}'${args[key][i][l]
              .toLocaleString()
              .replace(/'/g, "\\'")}'`;
          } else if (typeof args[key][i][l] === 'number' || args[key][i][l] === null) {
            src4 += `\n${'\t'.repeat(depth + 2)}${l}=${args[key][i][l]}`;
          } else if (typeof args[key][i][l] === 'boolean') {
            src4 += `\n${'\t'.repeat(depth + 2)}${l}=${args[key][i][l].toLocaleString().toUpperCase()}`;
          } else if (typeof args[key][i][l] === 'object') {
            src4 += `\n${'\t'.repeat(depth + 2)}${l} = list(`;
            Object.keys(args[key][i][l]).forEach((a, b) => {
              if (typeof args[key][i][l][a] === 'string') {
                src4 += `\n${'\t'.repeat(depth + 3)}${a.length > 0 ? `${a}=` : ''}'${args[key][i][l][a]
                  .toLocaleString()
                  .replace(/'/g, "\\'")}'`;
              } else if (typeof args[key][i][l][a] === 'number') {
                src4 += `\n${'\t'.repeat(depth + 3)}${a}=${args[key][i][l][a]}`;
              } else if (typeof args[key][i][l][a] === 'boolean') {
                src4 += `\n${'\t'.repeat(depth + 3)}${a}=${args[key][i][l][a].toLocaleString().toUpperCase()}`;
              }
              if (b !== Object.keys(args[key][i][l]).length - 1) {
                src4 += `,`;
              }
            });
            src4 += `\n${'\t'.repeat(depth + 2)})`;
          } else if (typeof args[key][i][l] === 'function') {
            src4 += `\n${'\t'.repeat(depth + 2)}${l.length > 1 ? `${l}=` : ''}'${args[key][i][l]
              .toLocaleString()
              .replace(/'/g, "\\'")}'`;
          }
          if (m !== Object.keys(args[key][i]).length - 1) {
            src4 += `,`;
          }
        });
        src4 += `\n${'\t'.repeat(depth + 1)})`;
      }
      if (j !== Object.keys(args[key]).length - 1) {
        src4 += `,`;
      }
      z += 1;
    });
    src4 += `\n${'\t'.repeat(depth)})`;
    if (z !== Object.keys(args).filter(x => new RegExp(exclusions).test(x)).length - 1) {
      src4 += `,`;
    }
  }

  if (args['data'] || args['linkData']) {
    listify('accessibility', 0);
    src4 = src4.slice(0, -1);
    src4 += `\n\n`;
  }

  src4 += `data %>% \n\t${storyID.split('-')[0]}_${storyID.split('-')[1] +
    (storyID.split('-').length === 3 ? '_' + storyID.split('-')[2] : '')}(`;
  Object.keys(args).forEach(i => {
    if (new RegExp('[a-z].*Accessor|[a-z].*Title|height|width').test(i)) {
      if (typeof args[i] === 'object') {
        listify(i, 2);
      } else {
        src4 += `${i} = '${args[i]}',\n\t\t`;
      }
    }
  });
  src4 += `accessibility = accessibility,\n\t\tprops = list(`;
  let len_r = 0;
  Object.keys(args).forEach(i => {
    if (
      (!new RegExp(exclusions).test(i) && (args[i].length || Object.keys(args[i]).length)) ||
      ['number', 'boolean'].includes(typeof args[i])
    ) {
      len_r += 1;
      if (typeof args[i] === 'object') {
        listify(i, 3);
      } else {
        src4 += `\n\t\t\t${i} = '${args[i]}',`;
      }
    }
  });
  if (len_r === 0) {
    src4 = src4.slice(0, -17);
    src4 += `\n\t)`;
  } else {
    src4 = src4.slice(0, -1);
    src4 += `\n\t\t)\n\t)`;
  }

  let src5 = '';
  let pyArgs = {};
  let configArgs = {};
  Object.keys(args).forEach((i, j) => {
    if (
      [
        'data',
        'linkData',
        'nodeData',
        'ordinalAccessor',
        'valueAccessor',
        'groupAccessor',
        'seriesAccessor',
        'xAccessor',
        'yAccessor',
        'nodeAccessor',
        'parentAccessor',
        'sizeAccessor',
        'joinAccessor',
        'joinNameAccessor',
        'markerAccessor',
        'markerNameAccessor',
        'latitudeAccessor',
        'longitudeAccessor',
        'sourceAccessor',
        'targetAccessor',
        'nodeIDAccessor',
        'mainTitle',
        'subTitle',
        'accessibility'
      ].includes(i)
    ) {
      pyArgs[i] = args[i];
    } else {
      if (
        !new RegExp('^on|Event$').test(i) &&
        (args[i].length || Object.keys(args[i]).length || ['number', 'boolean'].includes(typeof args[i]))
      ) {
        configArgs[i] = args[i];
      }
    }
  });
  src5 += formatter(pyArgs, 5, src5);
  if (Object.keys(configArgs).length) {
    src5 += `,\n\tconfig={`;
    Object.keys(configArgs).forEach((l, m) => {
      if (typeof configArgs[l] === 'string') {
        src5 += `\n${'\t'.repeat(2)}${l.length > 1 ? `"${l}": ` : ''}"${configArgs[l]
          .toLocaleString()
          .replace(/'/g, "\\'")}"`;
      } else if (typeof configArgs[l] === 'number') {
        src5 += `\n${'\t'.repeat(2)}"${l}": ${configArgs[l]}`;
      } else if (typeof configArgs[l] === 'boolean') {
        src5 += `\n${'\t'.repeat(2)}"${l}": ${configArgs[l]
          .toLocaleString()
          .charAt(0)
          .toUpperCase() + configArgs[l].toLocaleString().slice(1)}`;
      } else if (configArgs[l] === null) {
        src5 += `\n${'\t'.repeat(2)}"${l}": null`;
      } else if (typeof configArgs[l] === 'object') {
        src5 += `\n${'\t'.repeat(2)}${configArgs[l].length > 0 ? '"' + l + '": [' : '"' + l + '": {'}`;
        Object.keys(configArgs[l]).forEach((a, b) => {
          if (typeof configArgs[l][a] === 'string') {
            src5 += `\n${'\t'.repeat(3)}${a.length > 0 && isNaN(a) ? `"${a}": ` : ''}"${configArgs[l][a]
              .toLocaleString()
              .replace(/'/g, "\\'")}"`;
          } else if (typeof configArgs[l][a] === 'number') {
            src5 += `\n${'\t'.repeat(3)}"${a}": ${configArgs[l][a]}`;
          } else if (typeof configArgs[l][a] === 'boolean') {
            src5 += `\n${'\t'.repeat(3)}"${a}": ${configArgs[l][a]
              .toLocaleString()
              .charAt(0)
              .toUpperCase() +
              configArgs[l][a]
                .toLocaleString()
                .toLocaleString()
                .slice(1)}`;
          } else if (configArgs[l][a] === null) {
            src5 += `\n${'\t'.repeat(3)}"${a}": null`;
          } else if (typeof configArgs[l][a] === 'object' && configArgs[l][a] !== null) {
            src5 += `\n${'\t'.repeat(3)}${
              !isNaN(a) ? '{' : configArgs[l][a].length > 0 ? '"' + a + '": [' : '"' + a + '": {'
            }`;
            // console.log(configArgs[l][a]);
            Object.keys(configArgs[l][a]).forEach((c, d) => {
              if (typeof configArgs[l][a][c] === 'string') {
                src5 += `\n${'\t'.repeat(4)}${c.length > 0 && isNaN(c) ? `"${c}": ` : ''}"${configArgs[l][a][c]
                  .toLocaleString()
                  .replace(/'/g, "\\'")}"`;
              } else if (typeof configArgs[l][a][c] === 'number') {
                src5 += `\n${'\t'.repeat(4)}${c.length > 0 && isNaN(c) ? `"${c}": ` : ''}${configArgs[l][a][c]}`;
              } else if (typeof configArgs[l][a][c] === 'boolean') {
                src5 += `\n${'\t'.repeat(4)}${c}: ${configArgs[l][a][c]
                  .toLocaleString()
                  .charAt(0)
                  .toUpperCase() +
                  configArgs[l][a][c]
                    .toLocaleString()
                    .toLocaleString()
                    .slice(1)}`;
              } else if (configArgs[l][a][cancelIdleCallback] === null) {
                src5 += `\n${'\t'.repeat(4)}"${c}": null`;
              } else if (typeof configArgs[l][a][c] === 'object') {
                src5 += `\n${'\t'.repeat(4)}${
                  !isNaN(c) ? '{' : configArgs[l][a][c].length > 0 ? '"' + c + '": [' : '"' + c + '": {'
                }`;
                Object.keys(configArgs[l][a][c]).forEach((e, f) => {
                  if (typeof configArgs[l][a][c][e] === 'string') {
                    src5 += `\n${'\t'.repeat(5)}${e.length > 0 && isNaN(e) ? `${e}: ` : ''}'${configArgs[l][a][c][e]
                      .toLocaleString()
                      .replace(/'/g, "\\'")}'`;
                  } else if (typeof configArgs[l][a][c][e] === 'number') {
                    src5 += `\n${'\t'.repeat(5)}${e}: ${configArgs[l][a][c][e]}`;
                  } else if (typeof configArgs[l][a][c][e] === 'boolean') {
                    src5 += `\n${'\t'.repeat(5)}${e}: ${configArgs[l][a][c][e]
                      .toLocaleString()
                      .charAt(0)
                      .toUpperCase() +
                      configArgs[l][a][c][e]
                        .toLocaleString()
                        .toLocaleString()
                        .slice(1)}`;
                  }
                  if (f !== Object.keys(configArgs[l][a][c]).length - 1) {
                    src5 += `,`;
                  }
                });
                src5 += `\n${'\t'.repeat(4)}${!isNaN(c) ? '}' : configArgs[l][a][c].length > 0 ? ']' : '}'}`;
              }
              if (d !== Object.keys(configArgs[l][a]).length - 1) {
                src5 += `,`;
              }
            });
            src5 += `\n${'\t'.repeat(3)}${!isNaN(a) ? '}' : configArgs[l][a].length > 0 ? ']' : '}'}`;
          }
          if (b !== Object.keys(configArgs[l]).length - 1) {
            src5 += `,`;
          }
        });
        src5 += `\n${'\t'.repeat(2)}${configArgs[l].length > 0 ? ']' : '}'}`;
      }
      if (m !== Object.keys(configArgs).length - 1) {
        src5 += `,`;
      }
    });
    src5 += `\n${'\t'.repeat(1)}${configArgs.length > 0 ? ']' : '}'}${''}`;
    src5 += `\n)`;
  }

  let src6 = '';
  src6 += formatter(args, 6, src6);

  const [source, setSource] = useState(1);

  function selectSource(idx) {
    let lis = Array.from(document.querySelectorAll('.sources button'));
    if (idx) {
      lis.forEach((i, j) => {
        j !== idx - 1 ? (i.style.backgroundColor = 'whitesmoke') : (i.style.backgroundColor = 'rgba(0, 0, 255, .1)');
      });
      setSource(idx);
    }
  }
  return (
    <PanelWrapper>
      <PanelInner>
        <ul className="sources">
          <button onClick={() => selectSource(1)}>React</button>
          <button onClick={() => selectSource(2)}>Angular</button>
          <button onClick={() => selectSource(3)}>Web Component</button>
          <button onClick={() => selectSource(4)}>R</button>
          <button onClick={() => selectSource(5)}>Python</button>
          <button onClick={() => selectSource(6)}>Vue</button>
        </ul>
        {source === 1 ? (
          <Source code={src1} language="" format={false} />
        ) : source === 2 ? (
          <Source code={src2} language="" format={false} />
        ) : source === 3 ? (
          <Source code={src3} language="" format={false} />
        ) : source === 4 ? (
          <Source code={src4} language="" format={false} />
        ) : source === 5 ? (
          <Source code={src5} language="" format={false} />
        ) : (
          <Source code={src6} language="" format={false} />
        )}
      </PanelInner>
    </PanelWrapper>
  );
};

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Code',
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Panel />
      </AddonPanel>
    )
  });
});
