import js from '@eslint/js'
import globals from 'globals'

export default [
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.es2024,

				console: 'readonly',
				URL: 'readonly',
				fetch: 'readonly',
				Request: 'readonly',
				Response: 'readonly',
				Headers: 'readonly',
				crypto: 'readonly',
				caches: 'readonly',
			},
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
		},
	},
	js.configs.recommended,
]
