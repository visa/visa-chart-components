# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.2.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@5.1.0...@visa/visa-charts-utils@5.2.0) (2023-09-28)

### Features

- legendSubTitle internal user agent detection testing documentation ([3a3fd00](https://github.com/visa/visa-chart-components/commit/3a3fd003a81353561da911a6dc250e44949757cb))

# [5.1.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@5.0.0...@visa/visa-charts-utils@5.1.0) (2023-06-16)

### Features

- internationalization i18n validations i18n testing ([5e0325b](https://github.com/visa/visa-chart-components/commit/5e0325b1c6727406d6964459afbd9ac0238e1cc6))

# [5.0.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.8.0...@visa/visa-charts-utils@5.0.0) (2023-02-01)

### chore

- d3-color bump to 3.1.0 and resolutions ([dd9a2fb](https://github.com/visa/visa-chart-components/commit/dd9a2fb369c44bab6607acb5229ceb656dce5561))

### Features

- add yAxis.centerBaseline prop ([96b943d](https://github.com/visa/visa-chart-components/commit/96b943db7ee03a9eca97a3acf54e9e552878b794))

### BREAKING CHANGES

- d3-color bump to 3.1.0, IE11 support no longer maintained. If you need to support IE11, you should stick with the previous release.

# [4.8.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.7.1...@visa/visa-charts-utils@4.8.0) (2023-01-13)

### Features

- add dataKeyNames, sizeConfig tooltip default, dismiss tooltip w/ esc, no group accessor handling & initialLoadEndEvent ([d46cb8c](https://github.com/visa/visa-chart-components/commit/d46cb8c8b3187bc698af3f3604c3d5951fb66e03))
- enable access to numeral instance, numeral.register, numeral.locale ([c7eb31e](https://github.com/visa/visa-chart-components/commit/c7eb31e481ea55632066894e80f600151d15ec52))

## [4.7.1](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.7.0...@visa/visa-charts-utils@4.7.1) (2022-07-28)

### Bug Fixes

- bump utils to v4.7.1 ([a7eaf3f](https://github.com/visa/visa-chart-components/commit/a7eaf3f85d4dd85797c4bbb2534ff98868590cdb))

# [4.7.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.6.1...@visa/visa-charts-utils@4.7.0) (2022-06-27)

### Bug Fixes

- add alluvial default to tooltip, add z-index of 10 to style ([f4d7eea](https://github.com/visa/visa-chart-components/commit/f4d7eea78a6c9dbb5b8243f8a1520258108c4ae8))
- remove uniqueID update, pie-chart and interaction util to fix bug with nested data objects ([1cea07b](https://github.com/visa/visa-chart-components/commit/1cea07be1936f2c39d9b636d47a4fe59d147bb62))

### Features

- add annotation.accessibilityDecorationOnly to a11y descr util, update annotation readme with more detail ([ecb9606](https://github.com/visa/visa-chart-components/commit/ecb9606976bdc172feb196b1ab33c008a00b2392))
- enable size accessor in scatter-plot, remove uniqueID update, update tests ([f08c69a](https://github.com/visa/visa-chart-components/commit/f08c69ab8b1ab65881db46e55837c2a4f6995bb9))

## [4.6.1](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.6.0...@visa/visa-charts-utils@4.6.1) (2022-03-29)

### Bug Fixes

- alluvial-diagram missing freq in data table fix ([b90ba7f](https://github.com/visa/visa-chart-components/commit/b90ba7f95a0e387f5018381b1de6b34c3dc95f3f))
- bump dependencies to recent security vuln notices ([8749b9b](https://github.com/visa/visa-chart-components/commit/8749b9b11aeba92ecf39fc36251cdcb8844a7a46))
- bump util, type dependencies, pie-chart tests, unused a11y description fix ([5899037](https://github.com/visa/visa-chart-components/commit/5899037a074a4cec4112a4a8a8d78e598fdcf458))

# [4.6.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.5.2...@visa/visa-charts-utils@4.6.0) (2022-02-04)

### Bug Fixes

- add background stroke to legend text, makes legend text visible in dark contrast mode ([7ba6565](https://github.com/visa/visa-chart-components/commit/7ba6565d6dc404717203d42baff7ea5817416208))

### Features

- remove title and subtitle screen reader descriptions if they don't exist on chart ([f98210b](https://github.com/visa/visa-chart-components/commit/f98210b6f0fba2d2bc4c5277b9a4af4d01bd0d1e))
- remove uniqueID from VO descriptions of chart ([839adab](https://github.com/visa/visa-chart-components/commit/839adabd3dd3449097f6fe8519f567fccebb32c0))

## [4.5.2](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.5.1...@visa/visa-charts-utils@4.5.2) (2021-11-18)

### Bug Fixes

- add new event emitter name to accessibility validation ([a84487b](https://github.com/visa/visa-chart-components/commit/a84487b726563de74107d620526ba071350074c3))
- add secondary table to transform for alluvial data table ([980bf51](https://github.com/visa/visa-chart-components/commit/980bf51e09356c6a513abad391f67483ef6b45b1))
- bump versions of ua-parser-js and path-parse ([75a85a5](https://github.com/visa/visa-chart-components/commit/75a85a528718122d79e781d3b848ab064c9dc7e5))

## [4.5.1](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.5.0...@visa/visa-charts-utils@4.5.1) (2021-10-27)

### Bug Fixes

- add label collision to update functions across lib, doc and testing updates to support ([83e63dc](https://github.com/visa/visa-chart-components/commit/83e63dc352165a68aee9db4e7175fd241c13f523))
- leverage createURL from a11y util for textures, fix escape bug in alluvial key nav ([b25ec61](https://github.com/visa/visa-chart-components/commit/b25ec6155fb343a5774981b77fa2b1116f9b5fba))

# [4.5.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.4.1...@visa/visa-charts-utils@4.5.0) (2021-08-09)

### Features

- add vega-label as util, update types, docs and other utils ([205ac78](https://github.com/visa/visa-chart-components/commit/205ac780821399871e866815f006bbcb63bd7eba))
- update accessibility controller for keyboard-instrutions, fix 300% zoom bug ([2828852](https://github.com/visa/visa-chart-components/commit/2828852d72ed3ca2bb97fb493a315c93803c308c))
- update various utils for new animationConig capability ([9734cbc](https://github.com/visa/visa-chart-components/commit/9734cbc6810d6f064b0d797d836bd4437c4f0f12))

## [4.4.1](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.4.0...@visa/visa-charts-utils@4.4.1) (2021-04-13)

### Bug Fixes

- ensure legend padding does not conflict with \* border-box css ([b3e7a9b](https://github.com/visa/visa-chart-components/commit/b3e7a9b3f5504819e6f10a712cf9bba920b11b41))

# [4.4.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.3.0...@visa/visa-charts-utils@4.4.0) (2021-04-02)

### Bug Fixes

- refactor accessibility util, update utils & types for alluvial, clean dependencies ([a7305ef](https://github.com/visa/visa-chart-components/commit/a7305ef85f8e6b17d47bfb5bfcfc307626ea8bba))

### Features

- add alluvial diagram package ([b6391da](https://github.com/visa/visa-chart-components/commit/b6391da16a7f2aabd0a0596b3d38994ff456876f))

# [4.3.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.2.0...@visa/visa-charts-utils@4.3.0) (2021-04-01)

### Features

- add keyboardNavConfig to accessibility util and component apis ([7f6e8ef](https://github.com/visa/visa-chart-components/commit/7f6e8efee3f3c5a865c44862a72bef498eee0289))

# [4.2.0](https://github.com/visa/visa-chart-components/compare/@visa/visa-charts-utils@4.1.1...@visa/visa-charts-utils@4.2.0) (2021-02-09)

### Bug Fixes

- revert d3-array and d3-scale, enable commonjs bundles, add devDependency es5-check ([c6fea3c](https://github.com/visa/visa-chart-components/commit/c6fea3c601dfc4650b52996721ead03a1b363e2b))

### Features

- accessibility's hideStrokes and interaction state applied to legend ([0674b60](https://github.com/visa/visa-chart-components/commit/0674b608e918964f9bbce2992e363bf24f9cb911))

## [4.1.1](https://github.com/visa/visa-chart-components/tree/%40visa/visa-charts-utils%404.1.1) (2020-12-22)

- initial commit ([2383586](https://github.com/visa/visa-chart-components/commit/238358698bb59b8f20f424eeedc7235f51e02037))
