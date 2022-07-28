# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [5.1.2](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@5.1.1...@visa/clustered-bar-chart@5.1.2) (2022-07-28)

**Note:** Version bump only for package @visa/clustered-bar-chart





## [5.1.1](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@5.1.0...@visa/clustered-bar-chart@5.1.1) (2022-06-27)


### Bug Fixes

* update scales for bar and clustered to address all negative values bug, remove uniqueID update ([7a4f03a](https://github.com/visa/visa-chart-components/commit/7a4f03a71014db551b5273940af6624bf5f01225))





# [5.1.0](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@5.0.1...@visa/clustered-bar-chart@5.1.0) (2022-03-29)


### Features

* major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))





## [5.0.1](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@5.0.0...@visa/clustered-bar-chart@5.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/clustered-bar-chart





# [5.0.0](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.3.1...@visa/clustered-bar-chart@5.0.0) (2021-11-18)


### chore

* refactor object emitted on click and hover events in clustered-bar-chart ([e76e1e4](https://github.com/visa/visa-chart-components/commit/e76e1e427ae77cf9be4f35e59cdb9a061c15a285))


### BREAKING CHANGES

* e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively





## [4.3.1](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.3.0...@visa/clustered-bar-chart@4.3.1) (2021-10-27)


### Bug Fixes

* add label collision to update functions across lib, doc and testing updates to support ([83e63dc](https://github.com/visa/visa-chart-components/commit/83e63dc352165a68aee9db4e7175fd241c13f523))





# [4.3.0](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.2.3...@visa/clustered-bar-chart@4.3.0) (2021-08-09)


### Features

* push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))





## [4.2.3](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.2.2...@visa/clustered-bar-chart@4.2.3) (2021-04-13)

**Note:** Version bump only for package @visa/clustered-bar-chart





## [4.2.2](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.2.1...@visa/clustered-bar-chart@4.2.2) (2021-04-02)

**Note:** Version bump only for package @visa/clustered-bar-chart





## [4.2.1](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.2.0...@visa/clustered-bar-chart@4.2.1) (2021-04-02)


### Bug Fixes

* refactor accessibility util, update utils & types for alluvial, clean dependencies ([a7305ef](https://github.com/visa/visa-chart-components/commit/a7305ef85f8e6b17d47bfb5bfcfc307626ea8bba))





# [4.2.0](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.1.0...@visa/clustered-bar-chart@4.2.0) (2021-04-01)


### Features

* add keyboardNavConfig to accessibility util and component  apis ([7f6e8ef](https://github.com/visa/visa-chart-components/commit/7f6e8efee3f3c5a865c44862a72bef498eee0289))





## [4.1.1](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.1.0...@visa/clustered-bar-chart@4.1.1) (2021-02-18)

**Note:** Version bump only for package @visa/clustered-bar-chart

# [4.1.0](https://github.com/visa/visa-chart-components/compare/@visa/clustered-bar-chart@4.0.2...@visa/clustered-bar-chart@4.1.0) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

### Features

- accessibility's hideStrokes and interaction state applied to legend ([0674b60](https://github.com/visa/visa-chart-components/commit/0674b608e918964f9bbce2992e363bf24f9cb911))

## [4.0.2](https://github.com/visa/visa-chart-components/tree/%40visa/clustered-bar-chart%404.0.2) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
