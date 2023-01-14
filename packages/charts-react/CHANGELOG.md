# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@3.1.2...@visa/charts-react@3.2.0) (2023-01-13)

### Features

- add dataKeyNames, sizeConfig tooltip default, dismiss tooltip w/ esc, no group accessor handling & initialLoadEndEvent ([de01a0a](https://github.com/visa/visa-chart-components/commit/de01a0ab5cea8146ff3d4d0c48da995c2ba0fb9a))

## [3.1.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@3.1.1...@visa/charts-react@3.1.2) (2022-07-28)

### Bug Fixes

- add charts-types as a dev dependency to bundles ([213fbb8](https://github.com/visa/visa-chart-components/commit/213fbb8dff8f55c64ee3d1a28e3d0017de76f374))

## [3.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@3.1.0...@visa/charts-react@3.1.1) (2022-06-27)

**Note:** Version bump only for package @visa/charts-react

# [3.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@3.0.1...@visa/charts-react@3.1.0) (2022-03-29)

### Bug Fixes

- bump dependencies to recent security vuln notices ([8749b9b](https://github.com/visa/visa-chart-components/commit/8749b9b11aeba92ecf39fc36251cdcb8844a7a46))

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [3.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@3.0.0...@visa/charts-react@3.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/charts-react

# [3.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.2.2...@visa/charts-react@3.0.0) (2021-11-18)

### chore

- remove old components, refactor object emitted, bump dependencies ([76d1de4](https://github.com/visa/visa-chart-components/commit/76d1de4d7d3c650bec85db8090c7a2a95a1f0506))

### BREAKING CHANGES

- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively.
- level-indicator, group-charts, pareto-chart and clustered-force-layout non production components have been removed from VCC repo and bundles

## [2.2.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.2.1...@visa/charts-react@2.2.2) (2021-10-27)

**Note:** Version bump only for package @visa/charts-react

## [2.2.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.2.0...@visa/charts-react@2.2.1) (2021-08-09)

**Note:** Version bump only for package @visa/charts-react

# [2.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.1.2...@visa/charts-react@2.2.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [2.1.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.1.1...@visa/charts-react@2.1.2) (2021-04-13)

**Note:** Version bump only for package @visa/charts-react

## [2.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.1.0...@visa/charts-react@2.1.1) (2021-04-02)

### Bug Fixes

- add resoultion to fix mapbox-map dependency audit results ([a655f60](https://github.com/visa/visa-chart-components/commit/a655f60c5b4d87f02d8ff85d524853268325eb7b))

# [2.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.0.6...@visa/charts-react@2.1.0) (2021-04-02)

### Features

- add alluvial diagram to chart bundles ([9fd5cef](https://github.com/visa/visa-chart-components/commit/9fd5cef90db9a968c5a283ff065b1e5050842bfe))

## [2.0.6](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.0.4...@visa/charts-react@2.0.6) (2021-04-01)

**Note:** Version bump only for package @visa/charts-react

## [2.0.5](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.0.4...@visa/charts-react@2.0.5) (2021-02-18)

**Note:** Version bump only for package @visa/charts-react

## [2.0.4](https://github.com/visa/visa-chart-components/compare/@visa/charts-react@2.0.2...@visa/charts-react@2.0.4) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

## [2.0.2](https://github.com/visa/visa-chart-components/tree/%40visa/charts-react%402.0.2) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
