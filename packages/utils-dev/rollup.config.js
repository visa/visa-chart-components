import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import pkg from './package.json';

export default [
	// Browser-friendly UMD build
	{
		input: 'src/index.ts',
		output: {
			name: 'visa-charts-utils-dev',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript() // Convert TypeScript to JavaScript
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	{
		input: 'src/index.ts',
		plugins: [
			typescript() // Convert TypeScript to JavaScript
		],
		// Suppress unresolved imports as we definitely have those covered
		onwarn: function(warning, warn) {
			if (warning.code === 'UNRESOLVED_IMPORT') return;
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