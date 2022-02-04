# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://www.conventionalcommits.org/) for commit guidelines.

# [2.0.1](https://github.com/visa/visa-chart-components/compare/@visa/charts@6.0.0...@visa/charts@6.0.1) (2022-02-04)

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
