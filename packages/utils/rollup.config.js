import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default [
	// Browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'visa-charts-utils',
			file: pkg.browser,
			format: 'umd'
		},
		// Suppress circular dependency warnings from d3
		onwarn: function(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') return;
			warn(warning);
		},
		plugins: [
			resolve(),
			commonjs({
				include: [
					'./node_modules/deep-keys/index.js',
					'./node_modules/yup/lib/index.js',
					'./node_modules/synchronous-promise/index.js',
					'./node_modules/property-expr/index.js',
					'node_modules/toposort/index.js'
				]
			}),
			typescript({ include: '**/*.{ts,js}' }) // Convert TypeScript to JavaScript
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: 'src/index.ts',
		external: [],
		plugins: [
			resolve(),
			commonjs({
				include: [
					'./node_modules/deep-keys/index.js',
					'./node_modules/yup/lib/index.js',
					'./node_modules/synchronous-promise/index.js',
					'./node_modules/property-expr/index.js',
					'node_modules/toposort/index.js'
				]
			}),
			typescript() // Convert TypeScript to JavaScript
		],
		// Suppress circular dependency warnings from d3
		onwarn: function(warning, warn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') return;
			warn(warning);
		},
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				exports: 'auto' // Explicitly set exports to 'auto'
			},
			{
				file: pkg.module,
				format: 'es'
			}
		]
	}
];