import { defineWorkersProject, readD1Migrations } from '@cloudflare/vitest-pool-workers/config'
import path from 'node:path'

export default defineWorkersProject(async () => {
	const migrationsPath = path.join(__dirname, 'migrations')
	const migrations = await readD1Migrations(migrationsPath)
	return {
		test: {
			setupFiles: 'src/test/apply-migrations.js',
			poolOptions: {
				workers: {
					isolatedStorage: true,
					miniflare: {
						kvNamespaces: ['kv_edge_library'],
						d1Databases: ['d1_edge_library'],
						bindings: { TEST_MIGRATIONS: migrations },
					},
					wrangler: { configPath: './wrangler.jsonc' },
				},
			},
		},
	}
})
