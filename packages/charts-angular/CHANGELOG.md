# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.3.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@4.2.0...@visa/charts-angular@4.3.0) (2024-02-16)

### Features

- version bump for charts angular vue react ([2a75bb0](https://github.com/visa/visa-chart-components/commit/2a75bb0e33f3f42484e5bb50d3a5abe9d2592807))

## [4.2.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@4.2.0...@visa/charts-angular@4.2.1) (2024-02-09)

**Note:** Version bump only for package @visa/charts-angular

# [4.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@4.1.0...@visa/charts-angular@4.2.0) (2023-09-28)

### Features

- legendSubTitle internal user agent detection testing documentation ([3a3fd00](https://github.com/visa/visa-chart-components/commit/3a3fd003a81353561da911a6dc250e44949757cb))

# [4.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@4.0.0...@visa/charts-angular@4.1.0) (2023-06-16)

### Features

- internationalization i18n validations i18n testing ([5e0325b](https://github.com/visa/visa-chart-components/commit/5e0325b1c6727406d6964459afbd9ac0238e1cc6))

# [4.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.2.0...@visa/charts-angular@4.0.0) (2023-02-01)

### chore

- bump angular to v14, d3-color to v3, update configs ([544c53a](https://github.com/visa/visa-chart-components/commit/544c53a83b810b349ac24becbaab082b1151222e))

### BREAKING CHANGES

- Angular 14 and d3-color v3 no longer supports ie11, thus charts-angular will no longer support es5/legacy browsers

Co-authored-by: David Kutas <118760653+david-kutas@users.noreply.github.com>

# [3.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.1.2...@visa/charts-angular@3.2.0) (2023-01-13)

### Features

- add dataKeyNames, sizeConfig tooltip default, dismiss tooltip w/ esc, no group accessor handling & initialLoadEndEvent ([de01a0a](https://github.com/visa/visa-chart-components/commit/de01a0ab5cea8146ff3d4d0c48da995c2ba0fb9a))

## [3.1.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.1.1...@visa/charts-angular@3.1.2) (2022-07-28)

### Bug Fixes

- add charts-types as a dev dependency to bundles ([213fbb8](https://github.com/visa/visa-chart-components/commit/213fbb8dff8f55c64ee3d1a28e3d0017de76f374))

## [3.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.1.0...@visa/charts-angular@3.1.1) (2022-06-27)

**Note:** Version bump only for package @visa/charts-angular

# [3.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.0.1...@visa/charts-angular@3.1.0) (2022-03-29)

### Bug Fixes

- bump dependencies to recent security vuln notices ([8749b9b](https://github.com/visa/visa-chart-components/commit/8749b9b11aeba92ecf39fc36251cdcb8844a7a46))

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [3.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@3.0.0...@visa/charts-angular@3.0.1) (2022-02-04)

### Bug Fixes

- add resoultions to address charts-angular dep issues ([b846aee](https://github.com/visa/visa-chart-components/commit/b846aeef71b3c8dca87744bca7d2422dcf03527a))

# [3.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.3.2...@visa/charts-angular@3.0.0) (2021-11-18)

### Code Refactoring

- restructure charts-angular, remove old components, refactor object emitted ([23bae4d](https://github.com/visa/visa-chart-components/commit/23bae4d2f798c3e2f9aeda373014654a8655577f))

### BREAKING CHANGES

- refactor charts-angular to leverage angular/cli build process
- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively.
- level-indicator, group-charts, pareto-chart and clustered-force-layout non production components have been removed from VCC repo and bundles

## [2.3.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.3.1...@visa/charts-angular@2.3.2) (2021-10-27)

**Note:** Version bump only for package @visa/charts-angular

## [2.3.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.3.0...@visa/charts-angular@2.3.1) (2021-08-09)

### Bug Fixes

- bump deps for map and charts-angular ([86a37a1](https://github.com/visa/visa-chart-components/commit/86a37a108f45b581e983a23e7a954c635fb3ced9))

# [2.3.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.2.2...@visa/charts-angular@2.3.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [2.2.2](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.2.1...@visa/charts-angular@2.2.2) (2021-04-13)

**Note:** Version bump only for package @visa/charts-angular

## [2.2.1](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.2.0...@visa/charts-angular@2.2.1) (2021-04-02)

### Bug Fixes

- add resoultion to fix mapbox-map dependency audit results ([a655f60](https://github.com/visa/visa-chart-components/commit/a655f60c5b4d87f02d8ff85d524853268325eb7b))

# [2.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.1.0...@visa/charts-angular@2.2.0) (2021-04-02)

### Features

- add alluvial diagram to chart bundles ([9fd5cef](https://github.com/visa/visa-chart-components/commit/9fd5cef90db9a968c5a283ff065b1e5050842bfe))

# [2.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.0.3...@visa/charts-angular@2.1.0) (2021-04-01)

### Features

- bump angular from v9 to v11 in charts-angular ([ecd7cea](https://github.com/visa/visa-chart-components/commit/ecd7cea3356aac17372592643eafb0c66c9addd5))

## [2.0.4](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.0.3...@visa/charts-angular@2.0.4) (2021-02-18)

**Note:** Version bump only for package @visa/charts-angular

## [2.0.3](https://github.com/visa/visa-chart-components/compare/@visa/charts-angular@2.0.2...@visa/charts-angular@2.0.3) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

## [2.0.2](https://github.com/visa/visa-chart-components/tree/%40visa/charts-angular%402.0.2) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
