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
- [@visa/visa-charts-data-table](packages/data-table)

#### Our utilities can also be leveraged directly

- [@visa/visa-charts-utils](packages/utils)
- [@visa/visa-charts-utils-dev](packages/utils-dev)

<hr>

### Development

VCC is built as a monorepo containing a set of packages. These packages include specific chart components (e.g., `@visa/bar-chart`), our utilities (e.g., `@visa/visa-charts-utils`) as well as component bundles (e.g., `@visa/charts` or `@visa/charts-react`).

##### Steps to get up and running for development

_note: the initial install and build process can take some time._

- Clone the repo
- run `yarn dev --i` to install the monorepo
- run `yarn dev --b` to build the packages across the monorepo

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

##### Running unit tests on a component

We have built extensive unit testing out for some of our components and are working towards propagating this across the rest. To run unit tests the command is:

`yarn dev --test=@visa/<component-name>`

Also, in some cases, component snapshots may need to be updated after changes have been implemented on components themselves (take caution when updating testing snapshots). In this situation, run the update snapshot command as follows:

`yarn dev --updateSnapshot=@visa/<component-name>`

We use [vscode](https://code.visualstudio.com/) as our development environment, you can also leverage the built in debugging capability in this tool to evaluate the unit tests themselves.

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
- [ally.js](https://allyjs.io/)

This project was/is built with tireless efforts from:

- Chris DeMartini ([@visa](https://github.com/chris-demartini) / [personal](https://github.com/demartsc))
- Frank Elavsky ([@visa](https://github.com/frank-elavsky) / [personal](https://github.com/frankelavsky))
- Jaime Tanner ([@visa](https://github.com/jaime-tanner) / [personal](https://github.com/tannerjaime))
- Basavaraj Kabbure ([@visa](https://github.com/basav-kabbure) / [personal](https://github.com/basavarajk))
- Lilach Manheim ([personal](https://github.com/lmanheim))
- Tica Lin ([personal](https://github.com/ticahere))
- Akhil Gupta ([personal](https://github.com/akhil9tiet))
