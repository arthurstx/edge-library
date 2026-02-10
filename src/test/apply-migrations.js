import { applyD1Migrations, env } from 'cloudflare:test'

await applyD1Migrations(env.d1_edge_library, env.TEST_MIGRATIONS)
