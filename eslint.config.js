import js from '@eslint/js'
import globals from 'globals'

export default [
	js.configs.recommended, // Ativa o básico recomendado
	{
		files: ['**/*.js'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.serviceworker, // Isso libera o 'new Response', 'fetch', etc.
				...globals.node, // Isso libera o 'console' e APIs de sistema
				// Específicos do Cloudflare Workers:
				env: 'readonly',
				caches: 'readonly',
			},
		},
		rules: {
			// --- Rigor de Tipagem/Estrutura (Estilo TypeScript) ---
			'no-undef': 'error', // Proíbe variáveis não declaradas (Essencial!)
			'no-unused-vars': [
				'error',
				{
					// Proíbe variáveis não usadas
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'func-names': ['error', 'always'], // Força funções nomeadas
			'no-constant-condition': 'error', // Proíbe if(true)
			'no-duplicate-imports': 'error', // Proíbe imports duplicados
			eqeqeq: ['error', 'always'], // Força === ao invés de ==

			// --- Limpeza ---
			'no-console': 'off', // Permite console.log em Workers (útil p/ debug)
			quotes: ['error', 'single'], // Força aspas simples
		},
	},
]
