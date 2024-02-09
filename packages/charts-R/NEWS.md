# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.

# [3.2.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@7.2.0...@visa/charts@7.2.1) (2024-02-09)

- Version bump only for package @visa/charts

# [3.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@7.1.0...@visa/charts@7.2.0) (2023-09-28)

### Features

- legendSubTitle internal user agent detection testing documentation ([3a3fd00](https://github.com/visa/visa-chart-components/commit/3a3fd003a81353561da911a6dc250e44949757cb))

# [3.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@7.0.0...@visa/charts@7.1.0) (2023-06-16)

### Features

- internationalization i18n validations i18n testing ([5e0325b](https://github.com/visa/visa-chart-components/commit/5e0325b1c6727406d6964459afbd9ac0238e1cc6))

## [3.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.3.0...@visa/charts@7.0.0) (2023-02-01)

### chore

- d3-color bump to 3.1.0 and resolutions ([dd9a2fb](https://github.com/visa/visa-chart-components/commit/dd9a2fb369c44bab6607acb5229ceb656dce5561))

### BREAKING CHANGES

- d3-color bump to 3.1.0, IE11 support no longer maintained. If you need to support IE11, you should stick with the previous release.

## [2.2.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.2.0...@visa/charts@6.3.0) (2023-01-13)

### Features

- add dataKeyNames, sizeConfig tooltip default, dismiss tooltip w/ esc, no group accessor handling & initialLoadEndEvent ([de01a0a](https://github.com/visa/visa-chart-components/commit/de01a0ab5cea8146ff3d4d0c48da995c2ba0fb9a))

## [2.1.2](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.1.1...@visa/charts@6.2.0) (2022-07-28)

### Features

- add custom elements bundle output target to @visa/charts ([c5c3911](https://github.com/visa/visa-chart-components/commit/c5c391120141b409819d6ef93cffdc1a53bcc14b))

## [2.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.1.0...@visa/charts@6.1.1) (2022-06-27)

**Note:** Version bump only for package @visa/charts

## [2.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.0.1...@visa/charts@6.1.0) (2022-03-29)

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [2.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.0.0...@visa/charts@6.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/charts

## [2.0.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.2.1...@visa/charts@6.0.0) (2021-11-18)

- chore: remove old components, refactor object emitted, bump dependencies ([caff437](https://github.com/visa/visa-chart-components/commit/caff4370db77c0019f831c43eb79018bf11749ce))

### BREAKING CHANGES

- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively.
- level-indicator, group-charts, pareto-chart and clustered-force-layout non production components have been removed from VCC repo and bundles

## [1.1.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.2.0...@visa/charts@5.2.1) (2021-10-27)

**Note:** Version bump only for package @visa/charts

## [1.1.0](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.2...@visa/charts@5.2.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [1.0.2](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.1...@visa/charts@5.1.2) (2021-04-13)

**Note:** Version bump only for package @visa/charts within visachartR

## [1.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@5.1.0...@visa/charts@5.1.1) (2021-04-02)

**Note:** Version bump only for package @visa/charts within visachartR

## 1.0.0 (2021-03-19)

**Note:** Initial release of visachartR package, see the [@visa/charts changelog](../charts/CHANGELOG.md 'Changelog') for additional details pre-dating this package.
