/**
 * Copyright (c) 2022, 2023, 2025 Visa, Inc.
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
    '@storybook/addon-actions',
    './addons/improve-a11y/register',
    './addons/show-source-code/register'
  ],
  framework: '@storybook/react',
  core: {
    disableTelemetry: true,
    builder: 'webpack4'
  },
  webpackFinal: config => {
    config.output.publicPath = process.env.RENDER_PATH !== 'local' ? process.env.RENDER_PATH : '';
    config.module.rules.push({
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: { presets: ['@babel/env', '@babel/preset-react'] }
    });

    // Add babel-loader for dist files that may contain modern JS syntax
    config.module.rules.push({
      test: /\.(js|esm\.js)$/,
      include: [/packages\/.*\/dist/],
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['last 2 versions', 'ie >= 11']
              }
            }
          ]
        ]
      }
    });

    // Fix webpack-virtual-modules compatibility with webpack 4
    if (config.plugins) {
      config.plugins.forEach(plugin => {
        if (plugin && plugin.constructor && plugin.constructor.name === 'VirtualModulesPlugin') {
          // Patch the plugin to handle webpack 4 compatibility
          const originalWriteModule = plugin.writeModule;
          plugin.writeModule = function(filePath, contents) {
            try {
              return originalWriteModule.call(this, filePath, contents);
            } catch (error) {
              // Handle the "Cannot read properties of undefined (reading 'data')" error
              console.warn(`VirtualModulesPlugin compatibility warning for ${filePath}:`, error.message);
              return false;
            }
          };
        }
      });
    }

    return config;
  },
  managerWebpack: async config => {
    config.output.publicPath = process.env.RENDER_PATH !== 'local' ? process.env.RENDER_PATH : ''; // '/storybook/'

    // Add babel-loader for dist files that may contain modern JS syntax
    config.module.rules.push({
      test: /\.(js|esm\.js|cjs)$/,
      include: [/packages\/.*\/dist/],
      loader: 'babel-loader',
      options: {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                browsers: ['last 2 versions', 'ie >= 11']
              }
            }
          ]
        ]
      }
    });

    return config;
  }
};
