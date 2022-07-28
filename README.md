# Visa Chart Components

![Image showing three examples of Visa Chart Components for demonstration purposes only.](docs/vcc-components.png 'clustered bar chart component')

**Visa Chart Components (VCC)** is an accessibility focused, framework agnostic set of data experience design systems components for the web. VCC attempts to provide a toolset to enable developers to build equal data experiences for everyone, everywhere.

Visa Chart Components (VCC) is provided under the [MIT license](LICENSE).

<hr>

### Installation Process:

To use VCC in your projects run `yarn add @visa/charts`, or you can also install a single component by running `yarn add @visa/bar-chart`. We recommend leveraging bundles if you are going to install three (3) or more specific components for your project.

While we do deliver React (`@visa/charts-react`) and Angular (`@visa/charts-angular`) bundles, VCC components are compiled to standard web components, leveraging [Stencil.js](https://stenciljs.com/) and can be reused directly in many web environments and/or frameworks.

#### Bundles

- [@visa/charts](packages/charts) (web components)
- [@visa/charts-react](packages/charts-react) (react)
- [@visa/charts-angular](packages/charts-angular) (angular)
- [@visa/charts-R](packages/charts-R) (R), `visachartR` function in R
- [@visa/charts-python](packages/charts-python) (python), `pyvisacharts` package in Python

#### Components with `Ready` status

- [@visa/bar-chart](packages/bar-chart)
- [@visa/clustered-bar-chart](packages/clustered-bar-chart)
- [@visa/stacked-bar-chart](packages/stacked-bar-chart)
- [@visa/line-chart](packages/line-chart)
- [@visa/pie-chart](packages/pie-chart)
- [@visa/scatter-plot](packages/scatter-plot)
- [@visa/heat-map](packages/heat-map)
- [@visa/circle-packing](packages/circle-packing)
- [@visa/parallel-plot](packages/parallel-plot)
- [@visa/dumbbell-plot](packages/dumbbell-plot)
- [@visa/world-map](packages/world-map)
- [@visa/alluvial-diagram](packages/alluvial-diagram)
- [@visa/visa-charts-data-table](packages/data-table)
- [@visa/keyboard-instructions](packages/keyboard-instructions)

<!-- #### Components with `Development` status -->

#### Our utilities can also be leveraged directly

- [@visa/visa-charts-utils](packages/utils)
- [@visa/visa-charts-utils-dev](packages/utils-dev)

<hr>

### Development

VCC is built as a monorepo containing a set of packages. These packages include specific chart components (e.g., `@visa/bar-chart`), our utilities (e.g., `@visa/visa-charts-utils`) as well as component bundles (e.g., `@visa/charts` or `@visa/charts-react`).

##### Steps to get up and running for development

_note: the initial install and build process can take some time._

- Clone the repo
- run `yarn install`
- run `yarn dev --i` to install the monorepo
- run `yarn dev --b` to build the packages across the monorepo
- You can also run `yarn dev --bR` to build & copy the @visa/charts bundle to our R wrapper.

<br>

##### Single component development

For development work on a single component, we launch local stencil applications, which allow for faster development iterations and features like hot reloading. To run a single component development environment run the below command. _Note: these local/dev applications are not included in our builds._

`yarn dev --ibsw=@visa/<component-name>`

The switches in the command relate to:

- `i` = install the component
- `b` = build the component
- `sw` = start watching the component

You can run `--ibsw`, `--bsw`, or `--sw` if you need to. You can also build packages together (once installed) using commands like:

`yarn build --scope=@visa/visa-charts-utils && yarn build --scope=@visa/bar-chart`

This can helpful if you are making changes to dependencies of the chart component, for example, our utilities package.

<br>

##### Running unit tests

We have built extensive unit testing out for some of our components and are working towards propagating this across the rest. To run unit tests the command is:

- test all components at once: `yarn dev --t`
- test a specific component: `yarn dev --test=@visa/<component-name>`

Also, in some cases, component snapshots may need to be updated after changes have been implemented on components themselves (take caution when updating testing snapshots). In this situation, run the update snapshot command as follows:

`yarn dev --updateSnapshot=@visa/<component-name>`

Once you have finished running your tests you can leverage the below scripts to evaluate them:

- `yarn combine-test-results` - This script will combine all tests results across the monorepo, both coverage and test summary/failures.
- `yarn compare-test-results` - This script will do a snapshot test of your test results to the current snapshot.
- `yarn update-test-results` - This script will update the combined test snapshot, useful in situations when you have added more tests, cleaned up tests or enabled new components.

We use [vscode](https://code.visualstudio.com/) as our development environment, you can also leverage the built in debugging capability in this tool to evaluate the unit tests themselves.

<br>

##### Running components through yarn audit / dependency check

We enable a repo wide scan using [yarn audit](https://classic.yarnpkg.com/en/docs/cli/audit/) to check for known dependency vulnerabilities. To run the audit command(s):

- all components: `yarn dev --a=ALL`
- OR, component specific: `yarn dev --a=@visa/<component-name>`

Once you have finished running your audit you can leverage the below scripts to evaluate the results:

- `yarn combine-audit-results` - This script will combine all audit results across the monorepo.
- `yarn compare-audit-results` - This script will do a snapshot test of your audit results to the current snapshot.
- `yarn update-audit-results` - This script will update the combined audit snapshot, useful in situations when you have added more dependencies, cleaned up dependencies or enabled new components.

<br>

##### Cleaning the repo

_caution: this will require you to re-install the entire monorepo, which can take some time_

To clean repo we have clean command with options

`yarn dev --c=<options>`

Here, `<options>` can be

`ALL`-- deletes all lock files, node_modules and build folders.

`LOCK`-- deletes only lock files.

`BUILD`-- deletes only build folders and files.

`NODE`-- deletes only node_modules folder across repo.

<hr>

#### Credits

You can find license information for all dependencies included in our build [here](packages/utils/src/utils/license.ts). Below is a list of key dependencies.

- [d3.js](https://d3js.org/)
- [stencil.js](https://stenciljs.com/)
- [d3-svg-annotation](https://d3-annotation.susielu.com/)
- [numeral.js](http://numeraljs.com/)
- [node-uuid](https://github.com/uuidjs/uuid)
- [vega-label](https://github.com/vega/vega-label)
- [storybook](https://storybook.js.org/)
- [widget-cookiecutter](https://github.com/jupyter-widgets/widget-cookiecutter)

This project was/is built with tireless efforts from:

- Chris DeMartini ([@visa](https://github.com/chris-demartini) / [personal](https://github.com/demartsc))
- Stephanie Modica ([@visa](https://github.com/steph-modica) / [personal](https://github.com/stephmod))
- Lilach Manheim ([personal](https://github.com/lmanheim))
- Jaime Tanner ([personal](https://github.com/tannerjaime))
- Frank Elavsky ([personal](https://github.com/frankelavsky))
- Tica Lin ([personal](https://github.com/ticahere))
- Basavaraj Kabbure ([personal](https://github.com/basavarajk))
- Akhil Gupta ([personal](https://github.com/akhil9tiet))
