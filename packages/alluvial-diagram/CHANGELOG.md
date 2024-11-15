# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@4.0.0...@visa/alluvial-diagram@4.0.1) (2024-11-15)

### Bug Fixes

- package and version bumps for 8.0.1 fix release ([a021bdc](https://github.com/visa/visa-chart-components/commit/a021bdc3906bff451395cc60aca1d5cafa14d131))

# [4.0.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@3.2.0...@visa/alluvial-diagram@4.0.0) (2024-10-25)

### chore

- bump to stencil 4.21.0 and angular 17 ([e056f8c](https://github.com/visa/visa-chart-components/commit/e056f8c95e59ee58ce9facbd4e57552586746f30))

### Features

- subTitle mode prop added for choosing between background and text ([8aa325b](https://github.com/visa/visa-chart-components/commit/8aa325b203054b4fde80aaa6e5dc59fc209921ab))

### BREAKING CHANGES

- Older node, react and angular versions may no longer be compatible with stencil 4 and updated output targets.

# [3.2.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@3.1.1...@visa/alluvial-diagram@3.2.0) (2024-02-16)

### Features

- vertical alluvial diagram feature ([54ecb47](https://github.com/visa/visa-chart-components/commit/54ecb47e9420ad722b2d7982e898370bfd33d08f))

## [3.1.2](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@3.1.1...@visa/alluvial-diagram@3.1.2) (2024-02-09)

**Note:** Version bump only for package @visa/alluvial-diagram

## [3.1.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@3.1.0...@visa/alluvial-diagram@3.1.1) (2023-09-28)

### Bug Fixes

- alluvial-diagram updates ([19561da](https://github.com/visa/visa-chart-components/commit/19561da66498c086fb88a542d77c52bf712a52aa))

# [3.1.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@3.0.0...@visa/alluvial-diagram@3.1.0) (2023-06-16)

### Features

- internationalization i18n validations i18n testing ([5e0325b](https://github.com/visa/visa-chart-components/commit/5e0325b1c6727406d6964459afbd9ac0238e1cc6))

# [3.0.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.2.0...@visa/alluvial-diagram@3.0.0) (2023-02-01)

### chore

- d3-color bump to 3.1.0 and resolutions ([dd9a2fb](https://github.com/visa/visa-chart-components/commit/dd9a2fb369c44bab6607acb5229ceb656dce5561))

### BREAKING CHANGES

- d3-color bump to 3.1.0, IE11 support no longer maintained. If you need to support IE11, you should stick with the previous release.

# [2.2.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.1.2...@visa/alluvial-diagram@2.2.0) (2023-01-13)

### Bug Fixes

- update stencil/tsconfig across lib to include app- in dev and exclude it in prod build ([08ec353](https://github.com/visa/visa-chart-components/commit/08ec35339ca384994333305c82f061b0e800262b))

### Features

- add dataKeyNames prop and initialLoadEndEvent across chart components in lib ([486d44a](https://github.com/visa/visa-chart-components/commit/486d44aba0867ee28734eeae30ffbac353926dfe))

## [2.1.2](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.1.1...@visa/alluvial-diagram@2.1.2) (2022-07-28)

**Note:** Version bump only for package @visa/alluvial-diagram

## [2.1.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.1.0...@visa/alluvial-diagram@2.1.1) (2022-06-27)

### Bug Fixes

- augment unit testing for alluvial, remove uniqueID update, fix contrasting stroke on node and tooltip accessors ([59b0896](https://github.com/visa/visa-chart-components/commit/59b0896756782527801bb7e5c30d9ff6114fc6cd))

# [2.1.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.0.1...@visa/alluvial-diagram@2.1.0) (2022-03-29)

### Bug Fixes

- alluvial-diagram missing freq in data table fix ([b90ba7f](https://github.com/visa/visa-chart-components/commit/b90ba7f95a0e387f5018381b1de6b34c3dc95f3f))

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [2.0.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.0.0...@visa/alluvial-diagram@2.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/alluvial-diagram

# [2.0.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.2.1...@visa/alluvial-diagram@2.0.0) (2021-11-18)

### chore

- refactor watch lifecycle, object emitted on click and hover events in alluvial-diagram ([1ff29bb](https://github.com/visa/visa-chart-components/commit/1ff29bbca83561341506a472990b67568961a7b7))

### BREAKING CHANGES

- The linkConfig.fillMode option 'path' is now renamed to 'link'. Update to this new name in order to maintain fill styling that is applied to each link individually
- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively

## [1.2.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.2.0...@visa/alluvial-diagram@1.2.1) (2021-10-27)

### Bug Fixes

- add label collision to lifecycle and update a11y features on alluvial-diagram ([74b32fd](https://github.com/visa/visa-chart-components/commit/74b32fd0c03205d80fae6d65b7645a4f1dfd9849))

# [1.2.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.2...@visa/alluvial-diagram@1.2.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [1.1.2](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.1...@visa/alluvial-diagram@1.1.2) (2021-04-13)

**Note:** Version bump only for package @visa/alluvial-diagram

## [1.1.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.0...@visa/alluvial-diagram@1.1.1) (2021-04-02)

**Note:** Version bump only for package @visa/alluvial-diagram

# 1.1.0 (2021-04-02)

### Features

- add alluvial diagram package ([b6391da](https://github.com/visa/visa-chart-components/commit/b6391da16a7f2aabd0a0596b3d38994ff456876f))
