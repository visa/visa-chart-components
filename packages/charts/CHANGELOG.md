# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [6.3.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.2.0...@visa/charts@6.3.0) (2023-01-13)

### Features

- add dataKeyNames, sizeConfig tooltip default, dismiss tooltip w/ esc, no group accessor handling & initialLoadEndEvent ([de01a0a](https://github.com/visa/visa-chart-components/commit/de01a0ab5cea8146ff3d4d0c48da995c2ba0fb9a))

# [6.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.1.1...@visa/charts@6.2.0) (2022-07-28)

### Features

- add custom elements bundle output target to @visa/charts ([c5c3911](https://github.com/visa/visa-chart-components/commit/c5c391120141b409819d6ef93cffdc1a53bcc14b))

## [6.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.1.0...@visa/charts@6.1.1) (2022-06-27)

**Note:** Version bump only for package @visa/charts

# [6.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.0.1...@visa/charts@6.1.0) (2022-03-29)

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [6.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.0.0...@visa/charts@6.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/charts

# [6.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.2.1...@visa/charts@6.0.0) (2021-11-18)

- chore: remove old components, refactor object emitted, bump dependencies ([caff437](https://github.com/visa/visa-chart-components/commit/caff4370db77c0019f831c43eb79018bf11749ce))

### BREAKING CHANGES

- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively.
- level-indicator, group-charts, pareto-chart and clustered-force-layout non production components have been removed from VCC repo and bundles

## [5.2.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.2.0...@visa/charts@5.2.1) (2021-10-27)

**Note:** Version bump only for package @visa/charts

# [5.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.2...@visa/charts@5.2.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [5.1.2](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.1...@visa/charts@5.1.2) (2021-04-13)

**Note:** Version bump only for package @visa/charts

## [5.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.0...@visa/charts@5.1.1) (2021-04-02)

**Note:** Version bump only for package @visa/charts

# [5.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.0.5...@visa/charts@5.1.0) (2021-04-02)

### Features

- add alluvial diagram to chart bundles ([9fd5cef](https://github.com/visa/visa-chart-components/commit/9fd5cef90db9a968c5a283ff065b1e5050842bfe))

## [5.0.5](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.0.3...@visa/charts@5.0.5) (2021-04-01)

**Note:** Version bump only for package @visa/charts

## [5.0.4](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.0.3...@visa/charts@5.0.4) (2021-02-18)

**Note:** Version bump only for package @visa/charts

## [5.0.3](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.0.2...@visa/charts@5.0.3) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

## [5.0.2](https://github.com/visa/visa-chart-components/tree/%40visa/charts%405.0.2) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
