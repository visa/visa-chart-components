# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.2.2](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@6.2.0...@visa/bar-chart@6.2.2) (2024-02-16)

### Bug Fixes

- referenceLine function ([aed7623](https://github.com/visa/visa-chart-components/commit/aed76231095fb218147fc111195f7fa53b0fbef5))

## [6.2.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@6.2.0...@visa/bar-chart@6.2.1) (2024-02-09)

**Note:** Version bump only for package @visa/bar-chart

# [6.2.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@6.1.0...@visa/bar-chart@6.2.0) (2023-09-28)

### Features

- legendSubTitle internal user agent detection testing documentation ([3a3fd00](https://github.com/visa/visa-chart-components/commit/3a3fd003a81353561da911a6dc250e44949757cb))

# [6.1.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@6.0.0...@visa/bar-chart@6.1.0) (2023-06-16)

### Features

- internationalization i18n validations i18n testing ([5e0325b](https://github.com/visa/visa-chart-components/commit/5e0325b1c6727406d6964459afbd9ac0238e1cc6))

# [6.0.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.2.0...@visa/bar-chart@6.0.0) (2023-02-01)

### chore

- d3-color bump to 3.1.0 and resolutions ([dd9a2fb](https://github.com/visa/visa-chart-components/commit/dd9a2fb369c44bab6607acb5229ceb656dce5561))

### Features

- add yAxis.centerBaseline prop ([96b943d](https://github.com/visa/visa-chart-components/commit/96b943db7ee03a9eca97a3acf54e9e552878b794))

### BREAKING CHANGES

- d3-color bump to 3.1.0, IE11 support no longer maintained. If you need to support IE11, you should stick with the previous release.

# [5.2.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.1.2...@visa/bar-chart@5.2.0) (2023-01-13)

### Bug Fixes

- update stencil/tsconfig across lib to include app- in dev and exclude it in prod build ([08ec353](https://github.com/visa/visa-chart-components/commit/08ec35339ca384994333305c82f061b0e800262b))

### Features

- add dataKeyNames prop and initialLoadEndEvent across chart components in lib ([486d44a](https://github.com/visa/visa-chart-components/commit/486d44aba0867ee28734eeae30ffbac353926dfe))
- enable access to numeral instance, numeral.register, numeral.locale ([c7eb31e](https://github.com/visa/visa-chart-components/commit/c7eb31e481ea55632066894e80f600151d15ec52))

## [5.1.2](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.1.1...@visa/bar-chart@5.1.2) (2022-07-28)

**Note:** Version bump only for package @visa/bar-chart

## [5.1.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.1.0...@visa/bar-chart@5.1.1) (2022-06-27)

### Bug Fixes

- update scales for bar and clustered to address all negative values bug, remove uniqueID update ([7a4f03a](https://github.com/visa/visa-chart-components/commit/7a4f03a71014db551b5273940af6624bf5f01225))

# [5.1.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.0.1...@visa/bar-chart@5.1.0) (2022-03-29)

### Features

- major bump of stencil, bump other deps as well, add storybook demo app ([70719eb](https://github.com/visa/visa-chart-components/commit/70719ebc7fa59dc169bcc7fea62b238bcfab6418))

## [5.0.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@5.0.0...@visa/bar-chart@5.0.1) (2022-02-04)

**Note:** Version bump only for package @visa/bar-chart

# [5.0.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.3.1...@visa/bar-chart@5.0.0) (2021-11-18)

### chore

- refactor object emitted on click and hover events in bar-chart ([4e80188](https://github.com/visa/visa-chart-components/commit/4e801885b7fd2810964c4a696e963283e7787e2b))

### BREAKING CHANGES

- e.detail now contains two objects, data and target. To access data object, you now need to use e.detail.data. clickFunc, hoverFunc, and mouseOutFunc have been removed and replaced with clickEvent, hoverEvent, and mouseOutEvent, respectively

Co-authored-by: Chris DeMartini <74268675+chris-demartini@users.noreply.github.com>

## [4.3.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.3.0...@visa/bar-chart@4.3.1) (2021-10-27)

### Bug Fixes

- add label collision to update functions across lib, doc and testing updates to support ([83e63dc](https://github.com/visa/visa-chart-components/commit/83e63dc352165a68aee9db4e7175fd241c13f523))

# [4.3.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.2.3...@visa/bar-chart@4.3.0) (2021-08-09)

### Features

- push keyboard-instructions, animationConfig, label-collision and fixes across lib ([ea1b1a4](https://github.com/visa/visa-chart-components/commit/ea1b1a478b3ea9bcf07e76551a45a9adaaacdb47))

## [4.2.3](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.2.2...@visa/bar-chart@4.2.3) (2021-04-13)

**Note:** Version bump only for package @visa/bar-chart

## [4.2.2](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.2.1...@visa/bar-chart@4.2.2) (2021-04-02)

**Note:** Version bump only for package @visa/bar-chart

## [4.2.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.2.0...@visa/bar-chart@4.2.1) (2021-04-02)

### Bug Fixes

- refactor accessibility util, update utils & types for alluvial, clean dependencies ([a7305ef](https://github.com/visa/visa-chart-components/commit/a7305ef85f8e6b17d47bfb5bfcfc307626ea8bba))

# [4.2.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.1.0...@visa/bar-chart@4.2.0) (2021-04-01)

### Bug Fixes

- version bump bar-chart for npm deployment ([2adf7f3](https://github.com/visa/visa-chart-components/commit/2adf7f3a36920c7ca4c7a2dac325a5a67cf092d1))

### Features

- add keyboardNavConfig to accessibility util and component apis ([7f6e8ef](https://github.com/visa/visa-chart-components/commit/7f6e8efee3f3c5a865c44862a72bef498eee0289))

## [4.1.1](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.1.0...@visa/bar-chart@4.1.1) (2021-02-18)

### Bug Fixes

- version bump bar-chart for npm deployment ([2adf7f3](https://github.com/visa/visa-chart-components/commit/2adf7f3a36920c7ca4c7a2dac325a5a67cf092d1))

# [4.1.0](https://github.com/visa/visa-chart-components/compare/@visa/bar-chart@4.0.2...@visa/bar-chart@4.1.0) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

### Features

- accessibility's hideStrokes and interaction state applied to legend ([0674b60](https://github.com/visa/visa-chart-components/commit/0674b608e918964f9bbce2992e363bf24f9cb911))

## [4.0.2](https://github.com/visa/visa-chart-components/tree/%40visa/bar-chart%404.0.2) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
