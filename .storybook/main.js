/**
 * Copyright (c) 2022 Visa, Inc.
 *
 * This source code is licensed under the MIT license
 * https://github.com/visa/visa-chart-components/blob/master/LICENSE
 *
 **/
module.exports = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../packages/bar-chart/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/clustered-bar-chart/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/stacked-bar-chart/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/line-chart/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/pie-chart/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/scatter-plot/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/heat-map/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/circle-packing/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/parallel-plot/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/dumbbell-plot/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/world-map/docs/*.stories.@(js|jsx|ts|tsx)',
    '../packages/alluvial-diagram/docs/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        measure: false,
        outline: false,
        backgrounds: false,
        viewport: false,
        toolbars: false
      }
    },
    '@storybook/addon-notes',
    './addons/improve-a11y/register',
    './addons/show-source-code/register'
  ],
  framework: '@storybook/react',
  webpackFinal: config => {
    config.output.publicPath = process.env.RENDER_PATH !== 'local' ? process.env.RENDER_PATH : '';
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: { presets: ['@babel/env', '@babel/preset-react'] }
    });
    return config;
  },
  managerWebpack: async config => {
    config.output.publicPath = process.env.RENDER_PATH !== 'local' ? process.env.RENDER_PATH : ''; // '/storybook/'
    return config;
  }
};
