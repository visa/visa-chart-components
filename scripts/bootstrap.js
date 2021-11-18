#!/usr/bin/env node
/**
 * Copyright (c) 2020, 2021 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/

const childProcess = require('child_process');
const commonComponents = [
  '@visa/charts-types',
  '@visa/visa-charts-utils',
  '@visa/visa-charts-utils-dev',
  '@visa/visa-charts-data-table',
  '@visa/keyboard-instructions'
].join();
const ignoreComponents = ['@visa/bivariate-mapbox-map'].join();
const ignoreAppComponents = ['charts-react-demo', 'charts-react-hooks-demo', 'visa-charts-demo'].join();

const logger = console;
let cooldown = 0;

try {
  require('inquirer');
  require('commander');
  require('chalk');
  require('npmlog');
} catch (e) {
  logger.log('🕘 running bootstrap, first time to install dependencies');
  childProcess.spawnSync('yarn', ['install', '--ignore-optional'], {
    stdio: ['inherit', 'inherit', 'inherit']
  });
  process.stdout.write('\x07');
  process.stdout.write('\033c');

  cooldown = 1000;
} finally {
  setTimeout(run, cooldown);
}

function run() {
  const program = require('commander');
  const chalk = require('chalk');
  const log = require('npmlog');
  log.heading = '@visa/charts';
  const prefix = 'bootstrap';
  log.addLevel('aborted', 3001, { fg: 'red', bold: true });

  const spawn = (command, options = {}) => {
    const out = childProcess.spawnSync(`${command}`, {
      shell: true,
      stdio: 'inherit',
      ...options
    });
    if (out.status !== 0) {
      process.exit(out.status);
    }
    return out;
  };

  const main = program.version('5.0.0').option('--all', `Bootstrap everything ${chalk.gray('(all)')}`);

  const createTask = ({ defaultValue, option, name, check = () => true, command, pre = [], order }) => ({
    value: false,
    defaultValue: defaultValue || false,
    option: option || undefined,
    name: name || 'unnamed task',
    check: check || (() => true),
    order,
    command: c => {
      pre
        .map(key => tasks[key])
        .forEach(task => {
          if (task.check()) {
            task.command(c);
          }
        });

      log.info(prefix, name);
      command(c);
    }
  });

  const tasks = {
    is: createTask({
      name: `Install specific component and dependecies ${chalk.gray('(bootstrap component and dep)')}`,
      defaultValue: false,
      option: '--is <component_name>',
      command: component_name => {
        let bootstrapComponents = `'{${commonComponents},${component_name}}'`;
        switch (component_name) {
          case '@visa/bivariate-mapbox-map':
            bootstrapComponents = `'{${commonComponents},'@visa/scatter-plot',${component_name}}'`;
            break;
          case '@visa/visa-charts-utils':
            bootstrapComponents = `${component_name}`;
            break;
          case '@visa/visa-charts-utils-dev':
            bootstrapComponents = `${component_name}`;
            break;
          case '@visa/visa-charts-data-table':
          case '@visa/keyboard-instructions':
          default:
        }
        spawn(`lerna bootstrap --scope ${bootstrapComponents}`);
      },
      order: 1
    }),

    build: createTask({
      name: `build specific component ${chalk.gray('(build single component)')}`,
      defaultValue: false,
      option: '--build <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream --concurrency 8 build`);
      },
      order: 2
    }),

    builddep: createTask({
      name: `build specific component dependencies ${chalk.gray('(build component dep)')}`,
      defaultValue: false,
      option: '--builddep <component_name>',
      command: component_name => {
        let tempCommonComp = `'{${commonComponents}'}`;
        switch (component_name) {
          case '@visa/bivariate-mapbox-map':
            tempCommonComp = `'{${commonComponents},'@visa/scatter-plot'}'`;
            spawn(`lerna run --scope ${tempCommonComp} --stream --concurrency 8 build`);
            break;
          case '@visa/visa-charts-data-table':
          case '@visa/keyboard-instructions':
          default:
            spawn(`lerna run --scope ${tempCommonComp} --stream --concurrency 8 build`);
        }
      },
      order: 23
    }),

    bs: createTask({
      name: `build self ${chalk.gray('(build component and dep)')}`,
      defaultValue: false,
      option: '--bs <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream --concurrency 8 build`);
      },
      pre: ['builddep'],
      order: 30
    }),

    t: createTask({
      name: `run test across all components ${chalk.gray('(test)')}`,
      defaultValue: false,
      option: '--t',
      command: () => {
        spawn(`npm run test`);
      },
      order: 31
    }),
    test: createTask({
      name: `test specific component ${chalk.gray('(test)')}`,
      defaultValue: false,
      option: '--test <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream test -- --.spec.tsx`);
      },
      order: 20
    }),
    updateSnapshot: createTask({
      name: `Update snapshot specific component ${chalk.gray('(Update Snapshot)')}`,
      defaultValue: false,
      option: '--updateSnapshot <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream update-snapshot`);
      },
      order: 22
    }),
    ss: createTask({
      name: `start specific component ${chalk.gray('(only start-dev)')}`,
      defaultValue: false,
      option: '--ss <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream start-dev`);
      },
      order: 3
    }),

    ibsw: createTask({
      name: `start-dev specific component ${chalk.gray('(install, build, start and watch)')}`,
      defaultValue: false,
      option: '--ibsw <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream start-dev`);
      },
      order: 4,
      pre: ['is', 'builddep']
    }),

    bsw: createTask({
      name: `start-dev specific component ${chalk.gray('(build, start and watch)')}`,
      defaultValue: false,
      option: '--bsw <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream start-dev`);
      },
      order: 5,
      pre: ['builddep']
    }),

    sw: createTask({
      name: `start-dev specific component ${chalk.gray('(start and watch)')}`,
      defaultValue: false,
      option: '--sw <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream start-dev`);
      },
      order: 6
    }),

    watch: createTask({
      name: `start specific component ${chalk.gray('(watch)')}`,
      defaultValue: false,
      option: '--watch <component_name>',
      command: component_name => {
        spawn(`lerna run --scope ${component_name} --stream watch`);
      },
      order: 21
    }),

    i: createTask({
      name: `bootstrap ${chalk.gray('(bootstrap all components)')}`,
      defaultValue: false,
      option: '--i',
      command: () => {
        spawn(`npm run bootup`);
      },
      order: 7
    }),

    a: createTask({
      name: `audit ${chalk.gray('(yarn audit ALL components, or a specific component)')}`,
      defaultValue: false,
      option: '--a <component_name>',
      command: (component_name = 'ALL') => {
        if (component_name !== 'ALL') {
          spawn(`lerna run --scope ${component_name} --stream audit`);
        } else {
          spawn(`npm run audit`);
        }
      },
      order: 41
    }),

    glj: createTask({
      name: `Generate lerna json ${chalk.gray('(Generate lerna json)')}`,
      defaultValue: false,
      option: '--glj',
      command: () => {
        spawn(`lerna ls -l --json > ./packages/visa-charts-demo/public/mono-packages.json`);
      },
      order: 8
    }),

    gdj: createTask({
      name: `Generate docs json ${chalk.gray('(Generate docs)')}`,
      defaultValue: false,
      option: '--gdj',
      command: () => {
        spawn(`npm -C ./packages/visa-charts-demo run generate-api-docs-json`);
      },
      order: 9
    }),

    b: createTask({
      name: `build ${chalk.gray('(build all components)')}`,
      defaultValue: false,
      option: '--b',
      command: () => {
        spawn(`npm run build`);
      },
      order: 10
    }),

    bR: createTask({
      name: `build ${chalk.gray('(build all components) and copy bundle to charts-R')}`,
      defaultValue: false,
      option: '--bR',
      command: () => {
        spawn(`npm run build-R`);
      },
      order: 42
    }),

    sd: createTask({
      name: `start charts demo ${chalk.gray('(start charts demo)')}`,
      defaultValue: false,
      option: '--sd',
      command: () => {
        spawn(`lerna run --scope visa-charts-demo start`);
      },
      order: 11,
      pre: ['gdj']
    }),

    srd: createTask({
      name: `start charts react demo ${chalk.gray('(start charts react demo)')}`,
      defaultValue: false,
      option: '--srd',
      command: () => {
        spawn(`lerna run --scope charts-react-demo start`);
      },
      order: 12
    }),

    srhd: createTask({
      name: `start charts react hooks demo ${chalk.gray('(start charts react hooks demo)')}`,
      defaultValue: false,
      option: '--srhd',
      command: () => {
        spawn(`lerna run --scope charts-react-hooks-demo start`);
        // spawn(`npm -C ./packages/charts-react-hooks-demo run start`);
      },
      order: 13
    }),

    c: createTask({
      name: `clean monorepo and build folder ${chalk.gray('(clean repo)')}`,
      defaultValue: false,
      option: '--c <option>',
      command: option => {
        switch (option) {
          case 'ALL':
            spawn(
              `lerna clean && rm -rf node_modules && rm -rf *lock.json && rm -rf *.lock && rm -rf packages/*/*lock.json && rm -rf packages/*/*.lock && rm -rf packages/*/dist && rm -rf packages/*/www`
            );
            break;
          case 'LOCK':
            spawn(`rm -rf packages/*/*lock.json && rm -rf packages/*/*.lock && rm -rf *lock.json && rm -rf *.lock`);
            break;
          case 'BUILD':
            spawn(`rm -rf build && rm -rf packages/*/dist && rm -rf packages/*/www`);
            break;
          case 'NODE':
            spawn(`lerna clean && rm -rf node_modules`);
            break;
          default:
            break;
        }
      },
      order: 15
    })
  };

  Object.keys(tasks)
    .reduce((acc, key) => acc.option(tasks[key].option, tasks[key].name), main)
    .parse(process.argv);

  Object.keys(tasks).forEach(key => {
    if (program[key]) tasks[key].command(program[key]);
  });
}

function counter(callback, param) {
  let start = new Date();
  callback(param);
  let executionTime = new Date() - start;
  console.log('Execution time:: %dms', executionTime);
}
