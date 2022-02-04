# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@2.0.0...@visa/alluvial-diagram@2.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/alluvial-diagram





# [2.0.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.2.1...@visa/alluvial-diagram@2.0.0) (2021-11-18)


### chore

* refactor watch lifecycle, object emitted on click and hover events in alluvial-diagram ([1ff29bb](https://github.com/visa/visa-chart-components/commit/1ff29bbca83561341506a472990b67568961a7b7))


### BREAKING CHANGES

* The linkConfig.fillMode option 'path' is now renamed to 'link'. Update to this new name in order to maintain fill styling that is applied to each link individually
* e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively





## [1.2.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.2.0...@visa/alluvial-diagram@1.2.1) (2021-10-27)


### Bug Fixes

* add label collision to lifecycle and update a11y features on alluvial-diagram ([74b32fd](https://github.com/visa/visa-chart-components/commit/74b32fd0c03205d80fae6d65b7645a4f1dfd9849))





# [1.2.0](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.2...@visa/alluvial-diagram@1.2.0) (2021-08-09)


### Features

* push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))





## [1.1.2](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.1...@visa/alluvial-diagram@1.1.2) (2021-04-13)

**Note:** Version bump only for package @visa/alluvial-diagram





## [1.1.1](https://github.com/visa/visa-chart-components/compare/@visa/alluvial-diagram@1.1.0...@visa/alluvial-diagram@1.1.1) (2021-04-02)

**Note:** Version bump only for package @visa/alluvial-diagram





# 1.1.0 (2021-04-02)


### Features

* add alluvial diagram package ([b6391da](https://github.com/visa/visa-chart-components/commit/b6391da16a7f2aabd0a0596b3d38994ff456876f))
